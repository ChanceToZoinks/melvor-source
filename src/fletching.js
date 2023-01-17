"use strict";
class Fletching extends ArtisanSkill {
  constructor(namespace, game) {
    super(namespace, "Fletching", game);
    this._media = "assets/media/skills/fletching/fletching.svg";
    this.baseInterval = 2000;
    this.selectionTabs = fletchingSelectionTabs;
    this.renderQueue = new ArtisanSkillRenderQueue();
    this.setAltRecipes = new Map();
    this.categories = new NamespaceRegistry(game.registeredNamespaces);
  }
  getTotalUnlockedMasteryActions() {
    return this.actions.reduce(levelUnlockSum(this), 0);
  }
  get menu() {
    return fletchingArtisanMenu;
  }
  get noCostsMessage() {
    return getLangString("TOASTS", "MATERIALS_REQUIRED_TO_FLETCH");
  }
  get actionItem() {
    return this.activeRecipe.product;
  }
  get actionItemQuantity() {
    let quantity = this.activeRecipe.baseQuantity;
    if (this.activeRecipe.alternativeCosts !== undefined) {
      quantity *=
        this.activeRecipe.alternativeCosts[this.selectedAltRecipe]
          .quantityMultiplier;
    }
    if (
      this.isPoolTierActive(1) &&
      this.activeRecipe.category.id === "melvorF:Javelins"
    )
      quantity++;
    if (this.activeRecipe.category.id === "melvorF:Bolts") {
      if (this.isPoolTierActive(2)) quantity++;
      quantity += this.game.modifiers.increasedFletchingBoltQuantity;
      quantity +=
        this.game.modifiers.increasedBoltProduction -
        this.game.modifiers.decreasedBoltProduction;
    }
    if (this.activeRecipe.category.id === "melvorF:Javelins") {
      quantity +=
        this.game.modifiers.increasedJavelinProduction -
        this.game.modifiers.decreasedJavelinProduction;
    }
    return quantity;
  }
  get activeRecipe() {
    if (this.selectedRecipe === undefined)
      throw new Error(
        "Tried to get active fletching recipe, but none is selected."
      );
    return this.selectedRecipe;
  }
  get masteryModifiedInterval() {
    return 1300;
  }
  get selectedAltRecipe() {
    var _a;
    return (_a = this.setAltRecipes.get(this.activeRecipe)) !== null &&
      _a !== void 0
      ? _a
      : 0;
  }
  registerData(namespace, data) {
    var _a, _b;
    super.registerData(namespace, data);
    (_a = data.categories) === null || _a === void 0
      ? void 0
      : _a.forEach((categoryData) => {
          this.categories.registerObject(
            new SkillCategory(namespace, categoryData, this)
          );
        });
    (_b = data.recipes) === null || _b === void 0
      ? void 0
      : _b.forEach((recipeData) => {
          this.actions.registerObject(
            new FletchingRecipe(namespace, recipeData, this.game, this)
          );
        });
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortedMasteryActions = sortRecipesByCategoryAndLevel(
      this.actions.allObjects,
      this.categories.allObjects
    );
    this.milestones.push(...this.actions.allObjects);
    this.sortMilestones();
  }
  getFlatIntervalModifier(action) {
    let modifier = super.getFlatIntervalModifier(action);
    if (this.isPoolTierActive(3)) modifier -= 200;
    if (this.doesRecipeMakeArrows(action)) {
      modifier -=
        this.game.modifiers.decreasedFletchingIntervalWithArrows +
        this.game.modifiers.increasedFletchingIntervalWithArrows;
    }
    return modifier;
  }
  modifyItemCost(item, quantity, recipe) {
    if (
      recipe.product instanceof EquipmentItem &&
      recipe.product.ammoType === AmmoTypeID.Javelins
    ) {
      const modifier =
        this.game.modifiers.increasedJavelinResourceCost -
        this.game.modifiers.decreasedJavelinResourceCost;
      quantity = applyModifier(quantity, modifier);
    }
    return quantity;
  }
  getRecipeCosts(recipe) {
    var _a;
    const costs = super.getRecipeCosts(recipe);
    if (recipe.alternativeCosts !== undefined) {
      const altID =
        (_a = this.setAltRecipes.get(recipe)) !== null && _a !== void 0
          ? _a
          : 0;
      const altCosts = recipe.alternativeCosts[altID];
      altCosts.itemCosts.forEach(({ item, quantity }) => {
        costs.addItem(item, this.modifyItemCost(item, quantity, recipe));
      });
    }
    return costs;
  }
  selectAltRecipeOnClick(altID) {
    if (altID !== this.selectedAltRecipe && this.isActive && !this.stop())
      return;
    this.setAltRecipes.set(this.activeRecipe, altID);
    this.renderQueue.selectedRecipe = true;
    this.render();
  }
  renderSelectedRecipe() {
    if (!this.renderQueue.selectedRecipe) return;
    if (this.selectedRecipe !== undefined) {
      if (this.activeRecipe.alternativeCosts !== undefined) {
        this.menu.setRecipeDropdown(
          this.activeRecipe.alternativeCosts.map((cost) => {
            return { items: cost.itemCosts, gp: 0, sc: 0 };
          }),
          (recipeID) => () => this.selectAltRecipeOnClick(recipeID)
        );
        this.menu.showRecipeDropdown();
      } else {
        this.menu.hideRecipeDropdown();
      }
    } else {
      this.menu.hideRecipeDropdown();
    }
    super.renderSelectedRecipe();
  }
  getPreservationChance(action, chance) {
    const masteryLevel = this.getMasteryLevel(action);
    chance += 0.2 * (masteryLevel - 1);
    if (masteryLevel >= 99) chance += 5;
    return super.getPreservationChance(action, chance);
  }
  getMasteryXPModifier(action) {
    let modifier = super.getMasteryXPModifier(action);
    if (this.isPoolTierActive(0)) modifier += 5;
    return modifier;
  }
  onMasteryLevelUp(action, oldLevel, newLevel) {
    super.onMasteryLevelUp(action, oldLevel, newLevel);
    if (this.selectedRecipe === action) this.renderQueue.selectedRecipe = true;
  }
  doesRecipeMakeArrows(recipe) {
    return (
      recipe.product instanceof EquipmentItem &&
      recipe.product.ammoType === AmmoTypeID.Arrows
    );
  }
  doesRecipeMakeUnstrungBows(recipe) {
    return (
      (recipe.category.id === "melvorF:Longbows" ||
        recipe.category.id === "melvorF:Shortbows") &&
      !(recipe.product instanceof EquipmentItem)
    );
  }
  recordCostPreservationStats(costs) {
    costs.recordBulkItemStat(
      this.game.stats.Fletching,
      FletchingStats.ItemsPreserved
    );
  }
  recordCostConsumptionStats(costs) {
    costs.recordBulkItemStat(
      this.game.stats.Fletching,
      FletchingStats.ItemsUsed
    );
  }
  preAction() {}
  get actionRewards() {
    const rewards = new Rewards(this.game);
    const actionEvent = new FletchingActionEvent(this, this.activeRecipe);
    if (this.activeRecipe.alternativeCosts !== undefined) {
      actionEvent.altRecipeID = this.selectedAltRecipe;
    }
    let qtyToAdd = this.actionItemQuantity;
    if (rollPercentage(this.actionDoublingChance)) qtyToAdd *= 2;
    qtyToAdd *= Math.pow(
      2,
      this.game.modifiers.getSkillModifierValue("doubleItemsSkill", this)
    );
    const item = this.actionItem;
    const extraItemChance =
      this.game.modifiers.getSkillModifierValue(
        "increasedChanceAdditionalSkillResource",
        this
      ) -
      this.game.modifiers.getSkillModifierValue(
        "decreasedChanceAdditionalSkillResource",
        this
      );
    if (rollPercentage(extraItemChance)) qtyToAdd++;
    if (this.activeRecipe.category.id === "melvorF:Javelins") {
      const extraItems =
        this.game.modifiers.increasedChanceExtraJavelins -
        this.game.modifiers.decreasedChanceExtraJavelins;
      if (rollPercentage(extraItems)) qtyToAdd += 3;
    }
    if (this.doesRecipeMakeArrows(this.activeRecipe)) {
      const extraItems =
        this.game.modifiers.increasedChanceExtraArrows -
        this.game.modifiers.decreasedChanceExtraArrows;
      if (rollPercentage(extraItems)) qtyToAdd += 5;
    }
    if (this.doesRecipeMakeUnstrungBows(this.activeRecipe)) {
      const extraItems =
        this.game.modifiers.increasedChanceExtraUnstrungBows -
        this.game.modifiers.decreasedChanceExtraUnstrungBows;
      if (rollPercentage(extraItems)) qtyToAdd += 2;
    }
    if (this.activeRecipe.category.id === "melvorF:Crossbows") {
      const extraItems =
        this.game.modifiers.increasedChanceExtraCrossbows -
        this.game.modifiers.decreasedChanceExtraCrossbows;
      if (rollPercentage(extraItems)) qtyToAdd++;
    }
    const chanceForGP =
      this.game.modifiers.increasedChanceItemToGoldFletching -
      this.game.modifiers.decreasedChanceItemToGoldFletching;
    if (rollPercentage(chanceForGP)) {
      const gpToAdd = Math.floor(item.sellsFor * qtyToAdd * 1.5);
      rewards.addGP(gpToAdd);
    } else {
      rewards.addItem(item, qtyToAdd);
    }
    actionEvent.productQuantity = qtyToAdd;
    this.game.stats.Fletching.add(FletchingStats.ItemsFletched, qtyToAdd);
    if (item.id === "melvorF:Arrow_Shafts")
      this.game.stats.Fletching.add(FletchingStats.ArrowShaftsMade, qtyToAdd);
    rewards.addXP(this, this.actionXP);
    this.addCommonRewards(rewards);
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  postAction() {
    this.game.stats.Fletching.inc(FletchingStats.Actions);
    this.game.stats.Fletching.add(
      FletchingStats.TimeSpent,
      this.currentActionInterval
    );
    this.renderQueue.recipeInfo = true;
    this.renderQueue.quantities = true;
  }
  getErrorLog() {
    const altRecipeLog = [];
    this.setAltRecipes.forEach((altID, recipe) => {
      altRecipeLog.push(`${recipe.id} : ${altID}`);
    });
    return `${super.getErrorLog()}
Selected Alt Recipes (Mastery ID | altID):
${altRecipeLog.join("\n")}`;
  }
  encode(writer) {
    super.encode(writer);
    writer.writeMap(this.setAltRecipes, writeNamespaced, (altId, writer) => {
      writer.writeUint16(altId);
    });
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    this.setAltRecipes = reader.getMap(
      readNamespacedReject(this.actions),
      (reader) => reader.getUint16()
    );
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    const numSetAlts = reader.getNumber();
    for (let i = 0; i < numSetAlts; i++) {
      const recipe = this.actions.getObjectByID(
        idMap.fletchingRecipes[reader.getNumber()]
      );
      const altID = reader.getNumber();
      if (recipe === undefined) return;
      if (
        recipe.alternativeCosts !== undefined &&
        altID < recipe.alternativeCosts.length
      )
        this.setAltRecipes.set(recipe, altID);
    }
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.fletchingRecipes[oldActionID];
  }
  setFromOldOffline(offline, idMap) {
    const recipe = this.actions.getObjectByID(
      idMap.fletchingOldOffline[offline.action[0]]
    );
    const altLogID = offline.action[1];
    if (recipe !== undefined) {
      this.selectRecipeOnClick(recipe);
      if (
        recipe.alternativeCosts !== undefined &&
        altLogID < recipe.alternativeCosts.length
      )
        this.selectAltRecipeOnClick(altLogID);
      this.createButtonOnClick();
    }
  }
  testTranslations() {
    super.testTranslations();
    this.categories.forEach((category) => {
      category.name;
    });
  }
}
class FletchingRecipe extends SingleProductArtisanSkillRecipe {
  constructor(namespace, data, game, skill) {
    super(namespace, data, game, skill);
    if (data.alternativeCosts !== undefined) {
      this.alternativeCosts = data.alternativeCosts.map(
        ({ itemCosts, quantityMultiplier }) => {
          return {
            itemCosts: game.items.getQuantities(itemCosts),
            quantityMultiplier,
          };
        }
      );
    }
  }
  applyDataModification(modData, game) {
    if (modData.alternativeCosts !== undefined) {
      if (this.alternativeCosts === undefined) this.alternativeCosts = [];
      modData.alternativeCosts.forEach(({ itemCosts, quantityMultiplier }) => {
        var _a;
        (_a = this.alternativeCosts) === null || _a === void 0
          ? void 0
          : _a.push({
              itemCosts: game.items.getQuantities(itemCosts),
              quantityMultiplier,
            });
      });
    }
  }
}
