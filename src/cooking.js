"use strict";
class CookingRecipe extends SingleProductArtisanSkillRecipe {
  constructor(namespace, data, game, cooking) {
    super(namespace, data, game, cooking);
    this.hasMastery = true;
    this.discoveredItems = [];
    const perfectItem = game.items.getObjectByID(data.perfectCookID);
    if (perfectItem === undefined)
      throw new Error(
        `Error constructing CookingRecipe with id: ${this.localID}. Perfect item with id: ${data.perfectCookID} is not registered.`
      );
    this.perfectItem = perfectItem;
    this.baseInterval = data.baseInterval;
    if (data.noMastery) this.hasMastery = false;
    if (data.discoveredItems !== undefined) {
      data.discoveredItems.forEach((id) => {
        const item = game.items.getObjectByID(id);
        if (item == undefined)
          throw new Error(
            `Error constructing CookingRecipe with id: ${this.localID}. Discovered item with id: ${data.perfectCookID} is not registered.`
          );
        this.discoveredItems.push(item);
      });
    }
  }
}
class CookingCategory extends SkillCategory {
  constructor(namespace, data, game, skill) {
    super(namespace, data, skill);
    this.game = game;
    this.skill = skill;
    this.shopUpgrades = data.shopUpgradeIDs.map((purchaseID) => {
      const upgrade = game.shop.purchases.getObjectByID(purchaseID);
      if (upgrade === undefined)
        throw new Error(
          `Error constructing CookingCategory with id: ${this.id}. Shop Purchase with id: ${purchaseID} is not registered.`
        );
      return upgrade;
    });
    this.upgradeRequired = data.upgradeRequired;
  }
  get media() {
    const upgrade = this.highestUpgrade;
    if (upgrade === undefined) return super.media;
    return upgrade.media;
  }
  get name() {
    const upgrade = this.highestUpgrade;
    if (upgrade === undefined) return super.name;
    return upgrade.name;
  }
  get upgradeOwned() {
    return this.highestUpgrade !== undefined;
  }
  get highestUpgrade() {
    return this.shopUpgrades.find((upgrade) => {
      return this.game.shop.isUpgradePurchased(upgrade);
    });
  }
  applyDataModification(modData, game) {
    modData.shopUpgradeIDs.forEach((id) => {
      const upgrade = game.shop.purchases.getObjectByID(id);
      if (upgrade === undefined)
        throw new UnregisteredApplyDataModError(this, ShopPurchase.name, id);
      this.shopUpgrades.unshift(upgrade);
    });
  }
}
class Cooking extends CraftingSkill {
  constructor(namespace, game) {
    super(namespace, "Cooking", game);
    this._media = "assets/media/skills/cooking/cooking.svg";
    this.renderQueue = new CookingRenderQueue();
    this.selectedRecipes = new Map();
    this.passiveCookTimers = new Map();
    this.stockpileItems = new Map();
    this.productRecipeMap = new Map();
    this.ingredientRecipeMap = new Map();
    this.categories = new NamespaceRegistry(game.registeredNamespaces);
  }
  computeTotalMasteryActions() {
    this.actions.namespaceMaps.forEach((actionMap, namespace) => {
      let total = 0;
      actionMap.forEach((action) => {
        if (action.hasMastery) total++;
      });
      this.totalMasteryActions.set(namespace, total);
    });
  }
  getTotalUnlockedMasteryActions() {
    return this.actions.reduce((previous, recipe) => {
      if (recipe.hasMastery && this.level >= recipe.level) previous++;
      return previous;
    }, 0);
  }
  get actionInterval() {
    return this.getRecipeCookingInterval(this.activeRecipe);
  }
  get actionLevel() {
    return this.activeRecipe.level;
  }
  get masteryAction() {
    return this.activeRecipe;
  }
  get masteryModifiedInterval() {
    return this.getRecipeMasteryModifiedInterval(this.activeRecipe);
  }
  get activeRecipe() {
    if (this.activeCookingCategory === undefined)
      throw new Error(`Tried to get active recipe, but no category is active.`);
    const recipe = this.selectedRecipes.get(this.activeCookingCategory);
    if (recipe === undefined)
      throw new Error(
        "Tried to access active recipe, but none is selected in the active category"
      );
    return recipe;
  }
  get noCostsMessage() {
    return getLangString("MISC_STRING", "COOKING_2");
  }
  get noPassiveCostsMessage() {
    return getLangString("TOASTS", "PASSIVE_COOK_ITEMS_REQUIRED");
  }
  canStopPassiveCooking(category) {
    return this.passiveCookTimers.has(category) && !this.game.isGolbinRaid;
  }
  registerData(namespace, data) {
    var _a, _b;
    super.registerData(namespace, data);
    (_a = data.categories) === null || _a === void 0
      ? void 0
      : _a.forEach((categoryData) => {
          this.categories.registerObject(
            new CookingCategory(namespace, categoryData, this.game, this)
          );
        });
    (_b = data.recipes) === null || _b === void 0
      ? void 0
      : _b.forEach((recipe) => {
          this.actions.registerObject(
            new CookingRecipe(namespace, recipe, this.game, this)
          );
        });
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.actions.forEach((recipe) => {
      this.productRecipeMap.set(recipe.product, recipe);
      this.productRecipeMap.set(recipe.perfectItem, recipe);
      if (recipe.itemCosts.length === 1)
        this.ingredientRecipeMap.set(recipe.itemCosts[0].item, recipe);
      if (recipe.hasMastery) {
        this.sortedMasteryActions.push(recipe);
        this.milestones.push(recipe);
      }
    });
    this.sortedMasteryActions = sortRecipesByCategoryAndLevel(
      this.sortedMasteryActions,
      this.categories.allObjects
    );
    this.sortMilestones();
  }
  getIngredientCookedVersion(item) {
    var _a;
    return (_a = this.ingredientRecipeMap.get(item)) === null || _a === void 0
      ? void 0
      : _a.product;
  }
  activeTick() {
    super.activeTick();
    this.passiveCookTimers.forEach((timer) => {
      timer.tick();
    });
  }
  getStockpileSnapshot() {
    const snapshot = new Map();
    this.stockpileItems.forEach((items, category) => {
      snapshot.set(category, { item: items.item, quantity: items.quantity });
    });
    return snapshot;
  }
  getMasteryHealingBonus(foodItem) {
    let bonus = 0;
    const recipe = this.productRecipeMap.get(foodItem);
    if (recipe !== undefined && recipe.hasMastery) {
      if (this.getMasteryLevel(recipe) >= 99) bonus += 20;
    }
    if (this.isPoolTierActive(3)) bonus += 10;
    return bonus;
  }
  getRecipeMasteryModifiedInterval(recipe) {
    return recipe.baseInterval * 0.85;
  }
  getMasteryXPModifier(action) {
    let modifier = super.getMasteryXPModifier(action);
    if (this.isPoolTierActive(0)) modifier += 5;
    return modifier;
  }
  getRecipeCookingInterval(recipe) {
    return this.modifyInterval(recipe.baseInterval, recipe);
  }
  getRecipePassiveCookingInterval(recipe) {
    const modifier =
      this.game.modifiers.decreasedPassiveCookInterval -
      this.game.modifiers.increasedPassiveCookInterval;
    const interval = roundToTickInterval(
      this.getRecipeCookingInterval(recipe) * 5 * (1 - modifier / 100)
    );
    return Math.max(interval, 250);
  }
  getRecipeSuccessChance(recipe) {
    const masteryLevel = this.getMasteryLevel(recipe);
    let chance = Cooking.baseSuccessChance;
    chance +=
      this.game.modifiers.increasedChanceSuccessfulCook -
      this.game.modifiers.decreasedChanceSuccessfulCook;
    chance += masteryLevel * 0.6;
    let chanceCap = 100;
    chanceCap -= this.game.modifiers.decreasedCookingSuccessCap;
    return clampValue(chance, 0, chanceCap);
  }
  getRecipePerfectChance(recipe) {
    if (!this.game.settings.enablePerfectCooking) return 0;
    let chance = 0;
    if (recipe.hasMastery) {
      const masteryLevel = this.getMasteryLevel(recipe);
      chance += Math.floor(masteryLevel / 10) * 5;
      if (masteryLevel >= 99) chance += 50;
    }
    switch (recipe.category.id) {
      case "melvorD:Fire":
        chance +=
          this.game.modifiers.increasedChancePerfectCookFire -
          this.game.modifiers.decreasedChancePerfectCookFire;
        break;
      case "melvorD:Furnace":
        chance +=
          this.game.modifiers.increasedChancePerfectCookFurnace -
          this.game.modifiers.decreasedChancePerfectCookFurnace;
        break;
      case "melvorD:Pot":
        chance +=
          this.game.modifiers.increasedChancePerfectCookPot -
          this.game.modifiers.decreasedChancePerfectCookPot;
        break;
    }
    chance +=
      this.game.modifiers.increasedChancePerfectCookGlobal -
      this.game.modifiers.decreasedChancePerfectCookGlobal;
    return clampValue(chance, 0, 100);
  }
  getRecipeCosts(recipe) {
    const costs = new Costs(this.game);
    recipe.itemCosts.forEach((cost) => {
      costs.addItem(cost.item, cost.quantity);
    });
    if (recipe.gpCost > 0) costs.addGP(recipe.gpCost);
    if (recipe.scCost > 0) costs.addSlayerCoins(recipe.scCost);
    return costs;
  }
  getCurrentRecipeCosts() {
    return this.getRecipeCosts(this.activeRecipe);
  }
  getPreservationChance(action, chance) {
    if (this.isPoolTierActive(2)) chance += 10;
    return super.getPreservationChance(action, chance);
  }
  getUncappedDoublingChance(action) {
    let chance = super.getUncappedDoublingChance(action);
    if (this.isPoolTierActive(1)) chance += 5;
    return chance;
  }
  recordCostConsumptionStats(costs) {
    costs.recordBulkItemStat(this.game.stats.Cooking, CookingsStats.ItemsUsed);
  }
  recordCostPreservationStats(costs) {
    costs.recordBulkItemStat(
      this.game.stats.Cooking,
      CookingsStats.ItemsPreserved
    );
  }
  preAction() {}
  get actionRewards() {
    const rewards = new Rewards(this.game);
    const recipe = this.activeRecipe;
    const actionEvent = new CookingActionEvent(this, recipe, recipe.category);
    actionEvent.isPassiveCooking = this.passiveCookTimers.size > 0;
    if (
      rollPercentage(this.getRecipeSuccessChance(recipe)) ||
      (!this.game.tutorial.complete &&
        recipe.id === "melvorD:Shrimp" &&
        this.game.stats.itemFindCount(recipe.product) < 3)
    ) {
      let product = recipe.product;
      let additionalPerfect = 0;
      if (rollPercentage(this.getRecipePerfectChance(recipe))) {
        product = recipe.perfectItem;
        this.game.stats.Cooking.inc(CookingsStats.PerfectCooks);
        if (
          rollPercentage(
            this.game.modifiers.increasedChanceAdditionalPerfectItem
          )
        ) {
          additionalPerfect++;
          this.game.stats.Cooking.inc(CookingsStats.PerfectCooks);
        }
      }
      let itemQuantity = recipe.baseQuantity;
      if (rollPercentage(this.getDoublingChance(recipe))) itemQuantity *= 2;
      const extraItemChance =
        this.game.modifiers.getSkillModifierValue(
          "increasedChanceAdditionalSkillResource",
          this
        ) -
        this.game.modifiers.getSkillModifierValue(
          "decreasedChanceAdditionalSkillResource",
          this
        );
      if (rollPercentage(extraItemChance)) itemQuantity++;
      itemQuantity += additionalPerfect;
      if (
        !(
          this.game.modifiers.autoEquipFoodUnlocked > 0 &&
          this.game.settings.enableAutoEquipFood &&
          product instanceof FoodItem &&
          this.game.combat.player.autoEquipFood(product, itemQuantity)
        )
      ) {
        rewards.addItem(product, itemQuantity);
      }
      actionEvent.productQuantity = itemQuantity;
      rewards.addXP(this, recipe.baseExperience);
      this.addCommonRewards(rewards);
      this.game.stats.Cooking.inc(CookingsStats.SuccessfulActions);
      this.game.stats.Cooking.add(CookingsStats.FoodCooked, itemQuantity);
    } else {
      actionEvent.successful = false;
      this.game.combat.notifications.add({
        type: "Player",
        args: [this, getLangString("MISC_STRING", "COOKING_1"), "danger"],
      });
      if (this.game.modifiers.coalGainedOnCookingFailure > 0)
        rewards.addItemByID(
          "melvorD:Coal_Ore",
          this.game.modifiers.coalGainedOnCookingFailure
        );
      this.game.stats.Cooking.inc(CookingsStats.FoodBurnt);
    }
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  postAction() {
    this.game.stats.Cooking.add(
      CookingsStats.TimeSpent,
      this.currentActionInterval
    );
    this.renderQueue.recipeRates = true;
    this.renderQueue.quantities = true;
  }
  addMasteryXPReward() {
    if (this.masteryAction.hasMastery) super.addMasteryXPReward();
  }
  startPassiveCooking(category) {
    let timer = this.passiveCookTimers.get(category);
    if (timer === undefined) {
      timer = new Timer("Skill", () => this.passiveCookingAction(category));
      this.passiveCookTimers.set(category, timer);
    }
    const recipe = this.selectedRecipes.get(category);
    if (recipe === undefined)
      throw new Error(
        "Tried to start passive cooking, but no recipe is selected."
      );
    timer.start(this.getRecipePassiveCookingInterval(recipe));
    this.renderQueue.progressBar = true;
  }
  stopPassiveCooking(category) {
    if (!this.canStopPassiveCooking(category)) return false;
    this.passiveCookTimers.delete(category);
    this.renderQueue.progressBar = true;
    return true;
  }
  addItemToStockpile(category, item, quantity) {
    let items = this.stockpileItems.get(category);
    if (items === undefined) {
      items = { item, quantity };
      this.stockpileItems.set(category, items);
    } else if (items.item === item) {
      items.quantity += quantity;
    } else {
      throw new Error("Tried to add item to stockpile but ids don't match.");
    }
    this.renderQueue.stockpile.add(category);
  }
  passiveCookingAction(category) {
    const recipe = this.selectedRecipes.get(category);
    if (recipe === undefined)
      throw new Error("Tried to passive cook, but no recipe is selected.");
    const recipeCosts = this.getRecipeCosts(recipe);
    if (!recipeCosts.checkIfOwned()) {
      this.stopPassiveCooking(category);
      this.game.combat.notifications.add({
        type: "Player",
        args: [this, this.noPassiveCostsMessage, "danger"],
      });
      return;
    }
    this.addItemToStockpile(category, recipe.product, recipe.baseQuantity);
    this.game.stats.Cooking.add(CookingsStats.FoodCooked, recipe.baseQuantity);
    recipeCosts.consumeCosts();
    recipeCosts.recordBulkItemStat(
      this.game.stats.Cooking,
      CookingsStats.ItemsUsed
    );
    this.game.stats.Cooking.inc(CookingsStats.PassiveCooks);
    if (recipeCosts.checkIfOwned()) {
      this.startPassiveCooking(category);
    } else {
      this.stopPassiveCooking(category);
      this.game.combat.notifications.add({
        type: "Player",
        args: [this, this.noPassiveCostsMessage, "danger"],
      });
    }
  }
  onStop() {
    this.passiveCookTimers.forEach((_, category) =>
      this.stopPassiveCooking(category)
    );
  }
  onActiveCookButtonClick(category) {
    if (this.selectedRecipes.get(category) === undefined) return;
    const wasActive = this.isActive;
    if (this.isActive && !this.stop()) return;
    if (!wasActive || category !== this.activeCookingCategory) {
      this.activeCookingCategory = category;
      const costs = this.getCurrentRecipeCosts();
      if (!costs.checkIfOwned) {
        notifyPlayer(this, this.noCostsMessage, "danger");
      } else {
        this.start();
      }
    }
  }
  onPassiveCookButtonClick(category) {
    const recipe = this.selectedRecipes.get(category);
    if (
      recipe === undefined ||
      (this.isActive && this.activeCookingCategory === category)
    )
      return;
    if (this.passiveCookTimers.has(category)) {
      this.stopPassiveCooking(category);
      return;
    }
    const stockpileItems = this.stockpileItems.get(category);
    if (!this.isActive)
      notifyPlayer(this, getLangString("MISC_STRING", "COOKING_0"), "danger");
    else if (
      stockpileItems !== undefined &&
      stockpileItems.item !== recipe.product
    )
      notifyPlayer(this, getLangString("MISC_STRING", "COOKING_3"), "danger");
    else if (!this.getRecipeCosts(recipe).checkIfOwned())
      notifyPlayer(this, this.noPassiveCostsMessage, "danger");
    else this.startPassiveCooking(category);
  }
  onRecipeSelectionClick(recipe) {
    const category = recipe.category;
    const existingRecipe = this.selectedRecipes.get(category);
    if (this.isActive) {
      if (
        category === this.activeCookingCategory &&
        recipe !== this.activeRecipe &&
        !this.stop()
      )
        return;
      else if (
        this.passiveCookTimers.has(category) &&
        recipe !== existingRecipe &&
        !this.stopPassiveCooking(category)
      )
        return;
    }
    this.selectedRecipes.set(category, recipe);
    this.renderQueue.selectedRecipes.add(category);
    this.renderQueue.recipeRates = true;
    this.renderQueue.quantities = true;
    this.render();
  }
  onRecipeSelectionOpenClick(category) {
    const recipes = this.actions
      .filter((recipe) => {
        if (recipe.product.id === "melvorF:Lemon_Cake") {
          return (
            recipe.category === category &&
            recipe.discoveredItems.every(
              (item) => this.game.stats.itemFindCount(item) > 0
            ) &&
            this.totalCurrentMasteryLevel >= this.trueMaxTotalMasteryLevel
          );
        } else {
          return recipe.category === category;
        }
      })
      .sort((a, b) => a.level - b.level);
    const modalContent = new DocumentFragment();
    const rowDiv = createElement("div", { classList: ["row", "row-deck"] });
    modalContent.append(rowDiv);
    recipes.forEach((recipe) => {
      let recipeElement;
      if (this.level >= recipe.level) {
        recipeElement = new CookingRecipeSelection();
      } else {
        recipeElement = new LockedCookingRecipe();
      }
      recipeElement.setRecipe(recipe, this);
      recipeElement.className = "col-12 col-lg-6 d-flex";
      rowDiv.append(recipeElement);
    });
    const modalContainer = document.getElementById(
      "modal-recipe-select-content"
    );
    modalContainer.textContent = "";
    modalContainer.append(modalContent);
    $(`#modal-recipe-select`).modal("show");
  }
  onCollectStockpileClick(category) {
    const items = this.stockpileItems.get(category);
    if (items === undefined) return;
    const added = this.game.bank.addItem(
      items.item,
      items.quantity,
      false,
      true
    );
    if (added) {
      this.stockpileItems.delete(category);
      this.renderQueue.stockpile.add(category);
      this.render();
    }
  }
  renderModifierChange() {
    super.renderModifierChange();
    if (this.game.modifiers.autoEquipFoodUnlocked) {
      $("#cooking-food-auto-equip").removeClass("d-none");
    }
  }
  onModifierChange() {
    super.onModifierChange();
    this.renderQueue.recipeRates = true;
  }
  onEquipmentChange() {}
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
  }
  getErrorLog() {
    var _a;
    const selectedRecipeLog = [];
    this.selectedRecipes.forEach((recipe, category) => {
      selectedRecipeLog.push(`${category.id}: ${recipe.id}`);
    });
    const passiveCategories = [];
    this.passiveCookTimers.forEach((timer, category) => {
      passiveCategories.push(category.id);
    });
    const stockPileLog = [];
    this.stockpileItems.forEach(({ quantity, item }, category) => {
      stockPileLog.push(`${category.id}: item: ${item.id} qty: ${quantity}`);
    });
    return `${super.getErrorLog()}
Selected Cooking Recipes:
${selectedRecipeLog.join("\n")}
Active Cooking Category: ${
      (_a = this.activeCookingCategory) === null || _a === void 0
        ? void 0
        : _a.id
    }
Passive Cooking Categories: ${passiveCategories.join(",")}
Stockpile Contents:
${stockPileLog.join("\n")}
`;
  }
  onLoad() {
    super.onLoad();
    this.renderQueue.selectedRecipes = new Set(this.categories.allObjects);
    this.renderQueue.recipeRates = true;
    this.renderQueue.quantities = true;
    this.renderQueue.stockpile = new Set(this.categories.allObjects);
    if (this.isActive) {
      this.renderQueue.progressBar = true;
    }
  }
  onPageChange() {
    if (this.game.settings.enablePerfectCooking) {
      $("#cooking-food-enable-perfect").removeClass("d-none");
    }
    this.renderQueue.upgrades = true;
    this.renderQueue.quantities = true;
    super.onPageChange();
  }
  queueBankQuantityRender(item) {
    this.renderQueue.quantities = true;
  }
  render() {
    this.renderSelectedRecipes();
    super.render();
    this.renderRecipeRates();
    this.renderRecipeQuantities();
    this.renderProgressBars();
    this.renderStockpile();
    this.renderUpgrades();
  }
  renderSelectedRecipes() {
    if (this.renderQueue.selectedRecipes.size === 0) return;
    this.renderQueue.selectedRecipes.forEach((category) => {
      var _a;
      (_a = cookingMenus.get(category)) === null || _a === void 0
        ? void 0
        : _a.setSelectedRecipe(this.selectedRecipes.get(category), this);
    });
    this.renderQueue.selectedRecipes.clear();
  }
  renderRecipeRates() {
    if (!this.renderQueue.recipeRates) return;
    this.categories.forEach((category) => {
      const menu = cookingMenus.get(category);
      const recipe = this.selectedRecipes.get(category);
      if (recipe !== undefined) {
        menu === null || menu === void 0
          ? void 0
          : menu.setRecipeRates(recipe, this);
        menu === null || menu === void 0
          ? void 0
          : menu.setBonusValues(
              this.getPreservationChance(recipe, 0),
              this.getDoublingChance(recipe),
              this.getRecipePerfectChance(recipe),
              this.getRecipeSuccessChance(recipe)
            );
      }
    });
    this.renderQueue.recipeRates = false;
  }
  renderRecipeQuantities() {
    if (!this.renderQueue.quantities) return;
    this.categories.forEach((category) => {
      const menu = cookingMenus.get(category);
      const recipe = this.selectedRecipes.get(category);
      if (recipe !== undefined) {
        menu === null || menu === void 0
          ? void 0
          : menu.updateQuantities(recipe);
      }
    });
    this.renderQueue.quantities = false;
  }
  renderProgressBars() {
    if (!this.renderQueue.progressBar) return;
    if (this.isActive) {
      this.categories.forEach((category) => {
        const menu = cookingMenus.get(category);
        if (this.activeCookingCategory === category)
          menu === null || menu === void 0
            ? void 0
            : menu.renderActiveProgress(this.actionTimer);
        else if (this.passiveCookTimers.has(category))
          menu === null || menu === void 0 ? void 0 : menu.setProgressPassive();
        else menu === null || menu === void 0 ? void 0 : menu.stopProgressBar();
      });
    } else {
      cookingMenus.forEach((menu) => menu.stopProgressBar());
    }
    this.renderQueue.progressBar = false;
  }
  renderStockpile() {
    if (this.renderQueue.stockpile.size === 0) return;
    this.renderQueue.stockpile.forEach((category) => {
      var _a;
      (_a = cookingMenus.get(category)) === null || _a === void 0
        ? void 0
        : _a.setStockPile(this.stockpileItems.get(category));
    });
    this.renderQueue.stockpile.clear();
  }
  renderUpgrades() {
    if (!this.renderQueue.upgrades) return;
    this.categories.forEach((category) => {
      var _a;
      (_a = cookingMenus.get(category)) === null || _a === void 0
        ? void 0
        : _a.updateUpgrade();
    });
    this.renderQueue.upgrades = false;
  }
  resetActionState() {
    super.resetActionState();
    this.passiveCookTimers.clear();
    this.activeCookingCategory = undefined;
  }
  encode(writer) {
    super.encode(writer);
    writer.writeMap(this.selectedRecipes, writeNamespaced, writeNamespaced);
    writer.writeMap(this.passiveCookTimers, writeNamespaced, writeEncodable);
    writer.writeMap(this.stockpileItems, writeNamespaced, writeItemQuantity);
    if (this.isActive) {
      if (this.activeCookingCategory === undefined)
        throw new Error(
          `Error saving Cooking data. Skill is active, but has no active category.`
        );
      writer.writeNamespacedObject(this.activeCookingCategory);
    }
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    this.selectedRecipes = reader.getMap(
      readNamespacedReject(this.categories),
      readNamespacedReject(this.actions)
    );
    this.passiveCookTimers = reader.getMap(
      readNamespacedReject(this.categories),
      (reader, category) => {
        if (category === undefined) {
          const timer = new Timer("Skill", () => {});
          timer.decode(reader, version);
          return undefined;
        }
        const timer = new Timer("Skill", () =>
          this.passiveCookingAction(category)
        );
        timer.decode(reader, version);
        return timer;
      }
    );
    this.stockpileItems = reader.getMap(
      readNamespacedReject(this.categories),
      (reader) => {
        const item = reader.getNamespacedObject(this.game.items);
        const quantity = reader.getInt32();
        if (typeof item === "string") {
          if (item.startsWith("melvor")) {
            this.game.bank.addDummyItemOnLoad(item, quantity);
          }
          return undefined;
        } else {
          return { item, quantity };
        }
      }
    );
    if (this.isActive) {
      const activeCategory = reader.getNamespacedObject(this.categories);
      if (typeof activeCategory === "string") this.shouldResetAction = true;
      else this.activeCookingCategory = activeCategory;
    }
    if (this.shouldResetAction) this.resetActionState();
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    const getCategory = (id) => {
      const newID = idMap.cookingCategories[id];
      const category = this.categories.getObjectByID(newID);
      return category;
    };
    const getRecipe = (id) => {
      const recipe = this.actions.getObjectByID(idMap.cookingRecipes[id]);
      return recipe;
    };
    const numSelectedRecipes = reader.getNumber();
    for (let i = 0; i < numSelectedRecipes; i++) {
      const category = getCategory(reader.getNumber());
      const recipe = getRecipe(reader.getNumber());
      if (category !== undefined && recipe !== undefined)
        this.selectedRecipes.set(category, recipe);
    }
    const numPassiveTimers = reader.getNumber();
    for (let i = 0; i < numPassiveTimers; i++) {
      const category = getCategory(reader.getNumber());
      if (category === undefined) {
        const dummyTimer = new Timer("Skill", () => {});
        dummyTimer.deserialize(reader.getChunk(3), version);
      } else {
        const timer = new Timer("Skill", () =>
          this.passiveCookingAction(category)
        );
        timer.deserialize(reader.getChunk(3), version);
        this.passiveCookTimers.set(category, timer);
      }
    }
    const numStockpileItems = reader.getNumber();
    for (let i = 0; i < numStockpileItems; i++) {
      const category = getCategory(reader.getNumber());
      const itemID = idMap.items[reader.getNumber()];
      const item = this.game.items.getObjectByID(itemID);
      const quantity = reader.getNumber();
      if (item === undefined)
        this.game.bank.addDummyItemOnLoad(itemID, quantity);
      else if (category !== undefined)
        this.stockpileItems.set(category, { item, quantity });
    }
    const activeCategoryID = reader.getNumber();
    if (this.isActive) {
      this.activeCookingCategory = getCategory(activeCategoryID);
      if (this.activeCookingCategory === undefined)
        this.shouldResetAction = true;
    }
    if (this.shouldResetAction) this.resetActionState();
  }
  convertFromOldFormat(savegame, idMap) {
    if (savegame.cookingStockpiles !== undefined) {
      savegame.cookingStockpiles.forEach(({ itemID, qty }, categoryID) => {
        if (itemID === -1) return;
        const newID = idMap.items[itemID];
        const item = this.game.items.getObjectByID(newID);
        const category = this.categories.getObjectByID(
          idMap.cookingCategories[categoryID]
        );
        if (item === undefined) this.game.bank.addDummyItemOnLoad(newID, qty);
        else if (category !== undefined)
          this.stockpileItems.set(category, { item, quantity: qty });
      });
    }
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.cookingRecipes[oldActionID];
  }
  setFromOldOffline(offline, idMap) {
    if (typeof offline.action === "number") {
      const item = this.game.getItemFromOldID(offline.action, idMap);
      if (item === undefined) return;
      const recipe = this.ingredientRecipeMap.get(item);
      if (recipe !== undefined) {
        this.onRecipeSelectionClick(recipe);
        this.onActiveCookButtonClick(recipe.category);
      }
    } else {
      const productItem = this.game.getItemFromOldID(
        offline.action.active,
        idMap
      );
      if (productItem === undefined) return;
      const activeRecipe = this.productRecipeMap.get(productItem);
      const passiveRecipes = offline.action.passive.map((itemID) => {
        const productItem = this.game.getItemFromOldID(itemID, idMap);
        if (productItem === undefined) return undefined;
        return this.productRecipeMap.get(productItem);
      });
      if (activeRecipe !== undefined) {
        this.onRecipeSelectionClick(activeRecipe);
        this.onActiveCookButtonClick(activeRecipe.category);
      }
      passiveRecipes.forEach((passiveRecipe) => {
        if (passiveRecipe !== undefined) {
          this.onRecipeSelectionClick(passiveRecipe);
          this.onPassiveCookButtonClick(passiveRecipe.category);
        }
      });
    }
  }
}
Cooking.baseSuccessChance = 70;
class CookingRenderQueue extends GatheringSkillRenderQueue {
  constructor() {
    super(...arguments);
    this.selectedRecipes = new Set();
    this.recipeRates = false;
    this.quantities = false;
    this.stockpile = new Set();
    this.upgrades = false;
  }
}
