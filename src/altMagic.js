"use strict";
var AltMagicConsumptionID;
(function (AltMagicConsumptionID) {
  AltMagicConsumptionID[(AltMagicConsumptionID["AnyItem"] = -1)] = "AnyItem";
  AltMagicConsumptionID[(AltMagicConsumptionID["JunkItem"] = -2)] = "JunkItem";
  AltMagicConsumptionID[
    (AltMagicConsumptionID["BarIngredientsWithCoal"] = -3)
  ] = "BarIngredientsWithCoal";
  AltMagicConsumptionID[
    (AltMagicConsumptionID["BarIngredientsWithoutCoal"] = -4)
  ] = "BarIngredientsWithoutCoal";
  AltMagicConsumptionID[(AltMagicConsumptionID["None"] = -5)] = "None";
  AltMagicConsumptionID[(AltMagicConsumptionID["AnySuperiorGem"] = -6)] =
    "AnySuperiorGem";
  AltMagicConsumptionID[(AltMagicConsumptionID["AnyNormalFood"] = -7)] =
    "AnyNormalFood";
})(AltMagicConsumptionID || (AltMagicConsumptionID = {}));
var AltMagicProductionID;
(function (AltMagicProductionID) {
  AltMagicProductionID[(AltMagicProductionID["GP"] = -1)] = "GP";
  AltMagicProductionID[(AltMagicProductionID["Bar"] = -2)] = "Bar";
  AltMagicProductionID[(AltMagicProductionID["RandomGem"] = -3)] = "RandomGem";
  AltMagicProductionID[(AltMagicProductionID["RandomSuperiorGem"] = -4)] =
    "RandomSuperiorGem";
  AltMagicProductionID[(AltMagicProductionID["PerfectFood"] = -5)] =
    "PerfectFood";
  AltMagicProductionID[(AltMagicProductionID["RandomShards"] = -6)] =
    "RandomShards";
  AltMagicProductionID[(AltMagicProductionID["MagicXP"] = -7)] = "MagicXP";
})(AltMagicProductionID || (AltMagicProductionID = {}));
class AltMagicSpell extends BaseSpell {
  constructor(namespace, data, game) {
    super(namespace, data, game);
    this.fixedItemCosts = [];
    this.baseExperience = data.baseExperience;
    if (data.fixedItemCosts !== undefined)
      this.fixedItemCosts = game.items.getQuantities(data.fixedItemCosts);
    this.specialCost = {
      type: AltMagicConsumptionID[data.specialCost.type],
      quantity: data.specialCost.quantity,
    };
    const specialProduces = AltMagicProductionID[data.produces];
    if (specialProduces === undefined) {
      const produces = game.items.getObjectByID(data.produces);
      if (produces === undefined)
        throw new Error(
          `Error constructing AltMagicSpell with id: ${this.id}. Item with id: ${data.produces} is not registered.`
        );
      this.produces = produces;
    } else {
      this.produces = specialProduces;
    }
    this.productionRatio = data.productionRatio;
    this._description = data.description;
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("MAGIC", `ALTMAGIC_NAME_${this.localID}`);
    }
  }
  get description() {
    switch (this.produces) {
      case AltMagicProductionID.Bar:
        switch (this.specialCost.type) {
          case AltMagicConsumptionID.BarIngredientsWithCoal:
            return templateLangString("MAGIC", "SUPERHEAT", {
              barAmount: `${this.productionRatio}`,
              oreAmount: `${this.specialCost.quantity}`,
            });
          case AltMagicConsumptionID.BarIngredientsWithoutCoal:
            return templateLangString("MAGIC", "SUPERHEAT_NO_COAL", {
              barAmount: `${this.productionRatio}`,
              oreAmount: `${this.specialCost.quantity}`,
            });
        }
        break;
      case AltMagicProductionID.GP:
        if (this.specialCost.type === AltMagicConsumptionID.AnyItem)
          return templateLangString("MAGIC", "ITEM_ALCHEMY", {
            percent: `${this.productionRatio * 100}`,
          });
        break;
    }
    if (this.produces instanceof BoneItem && this.fixedItemCosts.length === 1) {
      return templateLangString("MAGIC", "HOLY_INVOCATION", {
        itemName: this.fixedItemCosts[0].item.name,
        qty1: `${this.fixedItemCosts[0].quantity}`,
        qty2: `${this.produces.prayerPoints}`,
      });
    }
    const templateData = {
      amount: `${this.productionRatio}`,
      percent: `${this.productionRatio * 100}`,
      specialCostQty: `${this.specialCost.quantity}`,
    };
    this.fixedItemCosts.forEach(({ item, quantity }, i) => {
      templateData[`fixedItemName${i}`] = item.name;
      templateData[`fixedItemQty${i}`] = `${quantity}`;
    });
    if (this.isModded) {
      return templateString(this._description, templateData);
    } else {
      return templateLangString(
        "MAGIC",
        `ALTMAGIC_DESC_${this.localID}`,
        templateData
      );
    }
  }
}
class AltMagic extends CraftingSkill {
  constructor(namespace, game) {
    super(namespace, "Magic", game);
    this._media = "assets/media/skills/magic/magic.svg";
    this.renderQueue = new AltMagicRenderQueue();
    this.smithingBarRecipes = [];
    this.baseInterval = 2000;
    this.randomShardTable = new DropTable(this.game, []);
  }
  get hasMastery() {
    return false;
  }
  get isCombat() {
    return true;
  }
  computeTotalMasteryActions() {}
  getTotalUnlockedMasteryActions() {
    return 0;
  }
  get actionInterval() {
    return this.modifyInterval(this.baseInterval, this.activeSpell);
  }
  get actionLevel() {
    return this.activeSpell.level;
  }
  get masteryAction() {
    return this.activeSpell;
  }
  get masteryModifiedInterval() {
    return this.baseInterval;
  }
  get noCostsMessage() {
    return getLangString("TOASTS", "MATERIALS_REQUIRED_TO_CAST");
  }
  get noRunesMessage() {
    return getLangString("TOASTS", "RUNES_REQUIRED_TO_CAST");
  }
  get activeSpell() {
    if (this.selectedSpell === undefined)
      throw new Error("Tried to get active spell, but none is selected");
    return this.selectedSpell;
  }
  get runePreservationChance() {
    let preserveChance =
      this.game.modifiers.increasedRunePreservation -
      this.game.modifiers.decreasedRunePreservation;
    preserveChance +=
      this.game.modifiers.increasedAltMagicRunePreservation -
      this.game.modifiers.decreasedAltMagicRunePreservation;
    return preserveChance;
  }
  get selectedSpellMedia() {
    if (this.selectedSpell === undefined) {
      return this.media;
    } else {
      switch (this.selectedSpell.specialCost.type) {
        case AltMagicConsumptionID.AnyItem:
        case AltMagicConsumptionID.JunkItem:
        case AltMagicConsumptionID.AnySuperiorGem:
        case AltMagicConsumptionID.AnyNormalFood:
          if (this.selectedConversionItem !== undefined) {
            return this.selectedConversionItem.media;
          }
          break;
        case AltMagicConsumptionID.BarIngredientsWithCoal:
        case AltMagicConsumptionID.BarIngredientsWithoutCoal:
          if (this.selectedSmithingRecipe !== undefined) {
            return this.selectedSmithingRecipe.media;
          }
          break;
      }
      return this.selectedSpell.media;
    }
  }
  registerData(namespace, data) {
    var _a;
    super.registerData(namespace, data);
    (_a = data.altSpells) === null || _a === void 0
      ? void 0
      : _a.forEach((altSpellData) => {
          this.actions.registerObject(
            new AltMagicSpell(namespace, altSpellData, this.game)
          );
        });
    if (data.randomShards !== undefined)
      this.randomShardTable.registerDrops(this.game, data.randomShards);
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.smithingBarRecipes = this.game.smithing.actions.filter(
      (recipe) => recipe.category.id === "melvorD:Bars"
    );
    this.milestones.push(...this.game.standardSpells.allObjects);
    this.milestones.push(...this.game.curseSpells.allObjects);
    this.milestones.push(...this.game.ancientSpells.allObjects);
    this.milestones.push(...this.game.auroraSpells.allObjects);
    this.milestones.push(...this.actions.allObjects);
    this.sortMilestones();
  }
  castButtonOnClick() {
    if (this.isActive) {
      this.stop();
    } else if (this.selectedSpell !== undefined) {
      let itemSelected = true;
      switch (this.selectedSpell.specialCost.type) {
        case AltMagicConsumptionID.AnyItem:
        case AltMagicConsumptionID.AnyNormalFood:
        case AltMagicConsumptionID.AnySuperiorGem:
        case AltMagicConsumptionID.JunkItem:
          itemSelected = this.selectedConversionItem !== undefined;
          break;
        case AltMagicConsumptionID.BarIngredientsWithCoal:
        case AltMagicConsumptionID.BarIngredientsWithoutCoal:
          itemSelected = this.selectedSmithingRecipe !== undefined;
          break;
      }
      if (!itemSelected) {
        notifyPlayer(this, getLangString("TOASTS", "SELECT_ITEM"));
      } else if (!this.getCurrentRecipeCosts().checkIfOwned()) {
        notifyPlayer(this, this.noCostsMessage, "danger");
      } else if (!this.getCurrentRecipeRuneCosts().checkIfOwned()) {
        notifyPlayer(this, this.noRunesMessage, "danger");
      } else {
        this.start();
      }
    }
  }
  selectSpellOnClick(spell) {
    if (this.selectedSpell !== spell) {
      if (this.isActive && !this.stop()) return;
      this.selectedConversionItem = undefined;
    }
    this.selectedSpell = spell;
    this.renderQueue.selectedSpellImage = true;
    this.renderQueue.selectedSpellInfo = true;
    hideElement(altMagicItemMenu);
    showElement(altMagicMenu);
    this.render();
  }
  openSelectItemOnClick() {
    if (this.selectedSpell === undefined) return;
    switch (this.selectedSpell.specialCost.type) {
      case AltMagicConsumptionID.AnyItem:
      case AltMagicConsumptionID.JunkItem:
      case AltMagicConsumptionID.AnySuperiorGem:
      case AltMagicConsumptionID.AnyNormalFood:
        altMagicItemMenu.setItemSelection(this, this.selectedSpell);
        break;
      case AltMagicConsumptionID.BarIngredientsWithCoal:
      case AltMagicConsumptionID.BarIngredientsWithoutCoal:
        altMagicItemMenu.setBarSelection(this);
        break;
      default:
        return;
    }
    hideElement(altMagicMenu);
    showElement(altMagicItemMenu);
  }
  selectItemOnClick(item) {
    if (this.game.isGolbinRaid) return;
    this.selectedConversionItem = item;
    this.renderQueue.selectedSpellInfo = true;
    hideElement(altMagicItemMenu);
    showElement(altMagicMenu);
    this.render();
    altMagicMenu.setSpellImage(this);
  }
  selectBarOnClick(recipe) {
    if (this.game.isGolbinRaid) return;
    this.selectedSmithingRecipe = recipe;
    this.renderQueue.selectedSpellInfo = true;
    hideElement(altMagicItemMenu);
    showElement(altMagicMenu);
    this.render();
    altMagicMenu.setSpellImage(this);
  }
  getSuperheatBarCosts(recipe, useCoal, costQty) {
    const costs = new Costs(this.game);
    recipe.itemCosts.forEach(({ item, quantity }) => {
      if (item.id === "melvorD:Coal_Ore" && !useCoal) return;
      costs.addItem(item, quantity * costQty);
    });
    if (recipe.gpCost > 0) costs.addGP(recipe.gpCost * costQty);
    if (recipe.scCost > 0) costs.addSlayerCoins(recipe.scCost * costQty);
    return costs;
  }
  getCurrentRecipeRuneCosts() {
    const costs = new Costs(this.game);
    if (this.selectedSpell !== undefined) {
      this.game.combat.player
        .getRuneCosts(this.selectedSpell)
        .forEach(({ item, quantity }) => {
          costs.addItem(item, quantity);
        });
    }
    return costs;
  }
  getCurrentRecipeCosts() {
    const costs = new Costs(this.game);
    if (this.selectedSpell !== undefined) {
      switch (this.selectedSpell.specialCost.type) {
        case AltMagicConsumptionID.AnyItem:
        case AltMagicConsumptionID.JunkItem:
        case AltMagicConsumptionID.AnySuperiorGem:
        case AltMagicConsumptionID.AnyNormalFood:
          if (this.selectedConversionItem !== undefined)
            costs.addItem(
              this.selectedConversionItem,
              this.selectedSpell.specialCost.quantity
            );
          break;
        case AltMagicConsumptionID.BarIngredientsWithCoal:
          if (this.selectedSmithingRecipe !== undefined)
            return this.getSuperheatBarCosts(
              this.selectedSmithingRecipe,
              true,
              this.selectedSpell.specialCost.quantity
            );
          break;
        case AltMagicConsumptionID.BarIngredientsWithoutCoal:
          if (this.selectedSmithingRecipe !== undefined)
            return this.getSuperheatBarCosts(
              this.selectedSmithingRecipe,
              false,
              this.selectedSpell.specialCost.quantity
            );
          break;
        case AltMagicConsumptionID.None:
          break;
      }
      this.selectedSpell.fixedItemCosts.forEach(({ item, quantity }) => {
        costs.addItem(item, quantity);
      });
    }
    return costs;
  }
  getCurrentRecipeBaseProducts() {
    const products = { items: [], gp: 0, sc: 0 };
    if (this.selectedSpell === undefined) return products;
    switch (this.selectedSpell.produces) {
      case AltMagicProductionID.Bar:
        if (this.selectedSmithingRecipe !== undefined)
          products.items.push({
            item: this.selectedSmithingRecipe.product,
            quantity: this.selectedSpell.productionRatio,
          });
        break;
      case AltMagicProductionID.GP:
        if (this.selectedConversionItem !== undefined)
          products.gp = this.getAlchemyGP(
            this.selectedConversionItem,
            this.selectedSpell.productionRatio
          );
        break;
      case AltMagicProductionID.PerfectFood:
        {
          const recipe = this.game.cooking.actions.find(
            (recipe) => recipe.product === this.selectedConversionItem
          );
          if (recipe === undefined)
            throw new Error("Recipe for food not found.");
          products.items.push({
            item: recipe.perfectItem,
            quantity: this.selectedSpell.productionRatio,
          });
        }
        break;
      case AltMagicProductionID.RandomGem:
      case AltMagicProductionID.RandomSuperiorGem:
      case AltMagicProductionID.RandomShards:
      case AltMagicProductionID.MagicXP:
        break;
      default:
        products.items.push({
          item: this.selectedSpell.produces,
          quantity: this.selectedSpell.productionRatio,
        });
        break;
    }
    return products;
  }
  getPreservationChance(action, chance) {
    return 0;
  }
  getXPModifier(masteryAction) {
    let modifier = super.getXPModifier(masteryAction);
    if (!this.game.combat.isActive) {
      modifier +=
        this.game.modifiers.increasedAltMagicSkillXP -
        this.game.modifiers.decreasedAltMagicSkillXP +
        this.game.modifiers.increasedNonCombatSkillXP -
        this.game.modifiers.decreasedNonCombatSkillXP;
    }
    return modifier;
  }
  recordCostConsumptionStats(costs) {
    costs.recordBulkItemStat(this.game.stats.Magic, AltMagicStats.ItemsUsed);
    costs.recordIndividualItemStat(ItemStats.TimesTransformed);
  }
  recordCostPreservationStats(costs) {}
  getAlchemyGP(item, conversionRatio) {
    conversionRatio += this.game.modifiers.increasedGPFromItemAlchemy;
    let gpToAdd = item.sellsFor * conversionRatio;
    gpToAdd = applyModifier(
      gpToAdd,
      this.game.modifiers.increasedGPGlobal -
        this.game.modifiers.decreasedGPGlobal
    );
    gpToAdd = Math.max(1, gpToAdd);
    return gpToAdd;
  }
  action() {
    const recipeCosts = this.getCurrentRecipeCosts();
    const runeCosts = this.getCurrentRecipeRuneCosts();
    if (!recipeCosts.checkIfOwned()) {
      this.game.combat.notifications.add({
        type: "Player",
        args: [this, this.noCostsMessage, "danger"],
      });
      this.stop();
      return;
    } else if (!runeCosts.checkIfOwned()) {
      this.game.combat.notifications.add({
        type: "Player",
        args: [this, this.noRunesMessage, "danger"],
      });
      this.stop();
      return;
    }
    this.preAction();
    const continueSkill = this.addActionRewards();
    recipeCosts.consumeCosts();
    this.recordCostConsumptionStats(recipeCosts);
    const runeConsumptionEvent = new RuneConsumptionEvent(
      runeCosts.getItemQuantityArray()
    );
    if (!rollPercentage(this.runePreservationChance)) {
      runeCosts.consumeCosts();
      runeCosts.recordBulkItemStat(
        this.game.stats.Magic,
        AltMagicStats.RunesUsed
      );
      runeConsumptionEvent.preserved = false;
    }
    this.game.processEvent(runeConsumptionEvent);
    this.postAction();
    const hasNextCosts = this.getCurrentRecipeCosts().checkIfOwned();
    const hasNextRuneCosts = this.getCurrentRecipeRuneCosts().checkIfOwned();
    if (hasNextCosts && hasNextRuneCosts && continueSkill) {
      this.startActionTimer();
    } else {
      if (!hasNextCosts)
        this.game.combat.notifications.add({
          type: "Player",
          args: [this, this.noCostsMessage, "danger"],
        });
      if (!hasNextRuneCosts)
        this.game.combat.notifications.add({
          type: "Player",
          args: [this, this.noRunesMessage, "danger"],
        });
      this.stop();
    }
  }
  get selectedSpellDoublingChance() {
    return this.getDoublingChance();
  }
  preAction() {}
  get actionRewards() {
    const spell = this.activeSpell;
    const rewards = new Rewards(this.game);
    const actionEvent = new AltMagicActionEvent(this, spell);
    let rewardQty = spell.productionRatio;
    let rewardItem = undefined;
    switch (spell.produces) {
      case AltMagicProductionID.GP:
        if (this.selectedConversionItem === undefined)
          throw new Error(
            "Error getting Alt. Magic rewards, no item is selected."
          );
        rewardQty = this.getAlchemyGP(
          this.selectedConversionItem,
          spell.productionRatio
        );
        break;
      case AltMagicProductionID.Bar:
        if (this.selectedSmithingRecipe === undefined)
          throw new Error(
            "Error getting Alt. Magic rewards, no smithing recipe is selected."
          );
        rewardItem = this.selectedSmithingRecipe.product;
        break;
      case AltMagicProductionID.RandomGem:
        rewardItem = this.game.randomGemTable.getDrop().item;
        break;
      case AltMagicProductionID.RandomSuperiorGem:
        rewardItem = this.game.randomSuperiorGemTable.getDrop().item;
        break;
      case AltMagicProductionID.PerfectFood:
        {
          const recipe = this.game.cooking.actions.find(
            (recipe) => recipe.product === this.selectedConversionItem
          );
          if (recipe === undefined)
            throw new Error(
              "Error getting Alt. Magic rewards, no cooking recipe exists for selected item."
            );
          rewardItem = recipe.perfectItem;
        }
        break;
      case AltMagicProductionID.RandomShards:
        if (this.selectedConversionItem === undefined)
          throw new Error(
            "Error getting Alt. Magic rewards, no item is selected."
          );
        rewardItem = this.randomShardTable.getDrop().item;
        rewardQty = Math.max(
          1,
          Math.floor(
            (2 * this.selectedConversionItem.sellsFor * 2) / rewardItem.sellsFor
          )
        );
        break;
      case AltMagicProductionID.MagicXP:
        if (this.selectedConversionItem === undefined)
          throw new Error(
            "Error getting Alt. Magic rewards, no item is selected."
          );
        rewardQty = this.selectedConversionItem.sellsFor * 0.03;
        break;
      default:
        rewardItem = spell.produces;
        break;
    }
    if (rewardItem !== undefined) {
      if (rollPercentage(this.selectedSpellDoublingChance)) rewardQty *= 2;
      rewards.addItem(rewardItem, rewardQty);
      if (rewardItem instanceof BoneItem)
        this.game.stats.Magic.add(AltMagicStats.BonesMade, rewardQty);
    }
    switch (spell.produces) {
      case AltMagicProductionID.Bar:
        this.game.stats.Magic.add(AltMagicStats.BarsMade, rewardQty);
        break;
      case AltMagicProductionID.GP:
        rewards.addGP(rewardQty);
        this.game.stats.Magic.add(AltMagicStats.GPGained, rewardQty);
        break;
      case AltMagicProductionID.RandomGem:
        this.game.stats.Magic.add(AltMagicStats.GemsMade, rewardQty);
        break;
      case AltMagicProductionID.MagicXP:
        rewards.addXP(this, rewardQty);
        break;
    }
    actionEvent.productQuantity = rewardQty;
    rewards.addXP(this, spell.baseExperience);
    this.rollForRareDrops(this.actionLevel, rewards);
    this.rollForPets(this.currentActionInterval);
    eventManager.rollForEventRewards(this.actionInterval, this, rewards);
    this.game.summoning.rollMarksForSkill(this, this.currentActionInterval);
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  postAction() {
    this.game.stats.Magic.inc(AltMagicStats.Actions);
    this.game.stats.Magic.add(
      AltMagicStats.TimeSpent,
      this.currentActionInterval
    );
    this.renderQueue.quantities = true;
  }
  onLoad() {
    super.onLoad();
    this.renderQueue.selectedSpellImage = true;
    if (this.selectedSpell !== undefined)
      this.renderQueue.selectedSpellInfo = true;
    this.renderQueue.selectionTab = true;
    if (this.isActive) {
      this.renderQueue.progressBar = true;
    }
    this.render();
    altMagicMenu.setCastCallback(this);
  }
  onComboRunesChange() {
    this.renderQueue.selectedSpellInfo = true;
    this.render();
  }
  onPageChange() {
    this.renderQueue.quantities = true;
    super.onPageChange();
  }
  queueBankQuantityRender(item) {
    this.renderQueue.quantities = true;
  }
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.game.combat.player.computeAllStats();
    this.renderQueue.selectionTab = true;
  }
  getErrorLog() {
    var _a, _b, _c;
    return `${super.getErrorLog()}
Selected Spell ID: ${
      (_a = this.selectedSpell) === null || _a === void 0 ? void 0 : _a.id
    }
Selected Smithing Recipe: ${
      (_b = this.selectedSmithingRecipe) === null || _b === void 0
        ? void 0
        : _b.id
    }
Selected Conversion Item ID: ${
      (_c = this.selectedConversionItem) === null || _c === void 0
        ? void 0
        : _c.id
    }`;
  }
  onModifierChange() {
    super.onModifierChange();
    this.renderQueue.selectedSpellInfo = true;
  }
  onEquipmentChange() {
    this.renderQueue.selectedSpellInfo = true;
  }
  render() {
    super.render();
    this.renderSelectedSpellImage();
    this.renderSelectedSpellInfo();
    this.renderQuantities();
    this.renderSelectionTab();
    this.renderProgressBar();
  }
  renderProgressBar() {
    if (!this.renderQueue.progressBar) return;
    altMagicMenu.renderProgress(this, this.actionTimer);
    this.renderQueue.progressBar = false;
  }
  renderSelectedSpellImage() {
    if (!this.renderQueue.selectedSpellImage) return;
    if (this.selectedSpell === undefined) {
      altMagicMenu.unsetSpell();
    } else {
      altMagicMenu.setSpell(this, this.selectedSpell);
    }
    this.renderQueue.selectedSpellImage = false;
  }
  renderSelectedSpellInfo() {
    if (!this.renderQueue.selectedSpellInfo) return;
    if (this.selectedSpell !== undefined) {
      switch (this.selectedSpell.specialCost.type) {
        case AltMagicConsumptionID.AnyItem:
        case AltMagicConsumptionID.JunkItem:
        case AltMagicConsumptionID.AnySuperiorGem:
        case AltMagicConsumptionID.AnyNormalFood:
          if (this.selectedConversionItem !== undefined) {
            altMagicMenu.setSpellQuantities(this);
          } else {
            altMagicMenu.resetSpellQuantities();
          }
          break;
        default:
          altMagicMenu.setSpellQuantities(this);
          break;
      }
      altMagicMenu.updateRates(this);
    }
    this.renderQueue.selectedSpellInfo = false;
  }
  renderQuantities() {
    if (!this.renderQueue.quantities) return;
    altMagicMenu.updateQuantities();
    this.renderQueue.quantities = false;
  }
  renderSelectionTab() {
    if (!this.renderQueue.selectionTab) return;
    altMagicSelection.updateRecipesForLevel();
    altMagicSelection.updateRecipeTooltips();
    this.renderQueue.selectionTab = false;
  }
  resetActionState() {
    super.resetActionState();
    this.selectedSpell = undefined;
    this.selectedConversionItem = undefined;
    this.selectedSmithingRecipe = undefined;
  }
  encode(writer) {
    super.encode(writer);
    writer.writeBoolean(this.selectedSpell !== undefined);
    if (this.selectedSpell !== undefined)
      writer.writeNamespacedObject(this.selectedSpell);
    writer.writeBoolean(this.selectedConversionItem !== undefined);
    if (this.selectedConversionItem !== undefined)
      writer.writeNamespacedObject(this.selectedConversionItem);
    writer.writeBoolean(this.selectedSmithingRecipe !== undefined);
    if (this.selectedSmithingRecipe !== undefined)
      writer.writeNamespacedObject(this.selectedSmithingRecipe);
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    if (reader.getBoolean()) {
      const spell = reader.getNamespacedObject(this.actions);
      if (typeof spell === "string") this.shouldResetAction = true;
      else this.selectedSpell = spell;
    }
    if (reader.getBoolean()) {
      const conversionItem = reader.getNamespacedObject(this.game.items);
      if (typeof conversionItem === "string") this.shouldResetAction = true;
      else this.selectedConversionItem = conversionItem;
    }
    if (reader.getBoolean()) {
      const selectedRecipe = reader.getNamespacedObject(
        this.game.smithing.actions
      );
      if (typeof selectedRecipe === "string") this.shouldResetAction = true;
      else this.selectedSmithingRecipe = selectedRecipe;
    }
    if (this.shouldResetAction) this.resetActionState();
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    const selectedSpellID = reader.getNumber();
    if (selectedSpellID >= 0) {
      const spell = this.actions.getObjectByID(
        idMap.magicAltSpells[selectedSpellID]
      );
      if (spell === undefined) this.shouldResetAction = true;
      else this.selectedSpell = spell;
    }
    const selectedConversionItemID = reader.getNumber();
    if (selectedConversionItemID >= 0) {
      const item = this.game.items.getObjectByID(
        idMap.items[selectedConversionItemID]
      );
      if (item === undefined) this.shouldResetAction = true;
      else this.selectedConversionItem = item;
    }
    const smithingRecipeID = reader.getNumber();
    if (smithingRecipeID >= 0) {
      const recipe = this.game.smithing.actions.getObjectByID(
        idMap.smithingRecipes[smithingRecipeID]
      );
      if (recipe === undefined) this.shouldResetAction = true;
      else this.selectedSmithingRecipe = recipe;
    }
    if (this.shouldResetAction) this.resetActionState();
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.magicAltSpells[oldActionID];
  }
  setFromOldOffline(offline, idMap) {
    const spellID = offline.action[0];
    const spell = this.actions.getObjectByID(idMap.magicAltSpells[spellID]);
    if (spell === undefined)
      throw new Error(unregisteredMessage("AltMagicSpell"));
    this.selectSpellOnClick(spell);
    switch (spell.specialCost.type) {
      case AltMagicConsumptionID.JunkItem:
      case AltMagicConsumptionID.AnyItem:
        {
          const item = this.game.items.getObjectByID(
            idMap.items[offline.action[1][1]]
          );
          if (item === undefined) throw new Error(unregisteredMessage("Item"));
          this.selectItemOnClick(item);
        }
        break;
      case AltMagicConsumptionID.BarIngredientsWithCoal:
      case AltMagicConsumptionID.BarIngredientsWithoutCoal:
        {
          const barID = idMap.items[offline.action[1][0]];
          const bar = this.smithingBarRecipes.find(
            (recipe) => recipe.product.id === barID
          );
          if (bar !== undefined) this.selectBarOnClick(bar);
        }
        break;
    }
    this.castButtonOnClick();
  }
  testTranslations() {
    super.testTranslations();
    this.actions.forEach((action) => {
      action.name;
      action.description;
    });
  }
}
class AltMagicRenderQueue extends GatheringSkillRenderQueue {
  constructor() {
    super(...arguments);
    this.quantities = false;
    this.selectedSpellImage = false;
    this.selectionTab = false;
    this.selectedSpellInfo = false;
  }
}
