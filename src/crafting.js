"use strict";
class Crafting extends ArtisanSkill {
  constructor(namespace, game) {
    super(namespace, "Crafting", game);
    this._media = "assets/media/skills/crafting/crafting.svg";
    this.baseInterval = 3000;
    this.selectionTabs = craftingSelectionTabs;
    this.renderQueue = new ArtisanSkillRenderQueue();
    this.categories = new NamespaceRegistry(game.registeredNamespaces);
  }
  getTotalUnlockedMasteryActions() {
    return this.actions.reduce(levelUnlockSum(this), 0);
  }
  get menu() {
    return craftingArtisanMenu;
  }
  get noCostsMessage() {
    return getLangString("TOASTS", "MATERIALS_REQUIRED_TO_CRAFT");
  }
  get actionItem() {
    return this.activeRecipe.product;
  }
  get actionItemQuantity() {
    let quantity = this.activeRecipe.baseQuantity;
    if (this.isPoolTierActive(3) && this.isMakingJewlery) quantity++;
    return quantity;
  }
  get activeRecipe() {
    if (this.selectedRecipe === undefined)
      throw new Error(
        "Tried to get active crafting recipe, but none is selected."
      );
    return this.selectedRecipe;
  }
  get masteryModifiedInterval() {
    return 1650;
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
            new SingleProductArtisanSkillRecipe(
              namespace,
              recipeData,
              this.game,
              this
            )
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
    if (this.isPoolTierActive(2)) modifier -= 200;
    return modifier;
  }
  getUncappedDoublingChance(action) {
    let chance = super.getUncappedDoublingChance(action);
    const item = action.product;
    if (
      action.category.id === "melvorF:LeatherArmour" ||
      action.category.id === "melvorF:Dragonhide"
    )
      chance +=
        this.game.modifiers.increasedChanceToDoubleLeatherDragonhideCrafting;
    return chance;
  }
  getPreservationChance(action, chance) {
    const masteryLevel = this.getMasteryLevel(action);
    chance += (masteryLevel - 1) * 0.2;
    if (masteryLevel >= 99) chance += 5;
    if (this.isPoolTierActive(1)) chance += 5;
    if (
      action.category.id === "melvorF:Necklaces" ||
      action.category.id === "melvorF:Rings"
    )
      chance += this.game.modifiers.increasedCraftingJewelryPreservation;
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
  modifyItemCost(item, quantity, recipe) {
    if (recipe.category.id === "melvorF:Dragonhide") {
      quantity -= this.game.modifiers.decreasedFlatCraftingDragonhideCost;
      quantity = Math.max(1, quantity);
    }
    return quantity;
  }
  recordCostPreservationStats(costs) {
    costs.recordBulkItemStat(
      this.game.stats.Crafting,
      CraftingStats.ItemsPreserved
    );
    costs.recordGPStat(this.game.stats.Crafting, CraftingStats.GPPreserved);
  }
  recordCostConsumptionStats(costs) {
    costs.recordBulkItemStat(this.game.stats.Crafting, CraftingStats.ItemsUsed);
    costs.recordGPStat(this.game.stats.Crafting, CraftingStats.GPUsed);
  }
  get isMakingJewlery() {
    return (
      this.activeRecipe.category.id === "melvorF:Necklaces" ||
      this.activeRecipe.category.id === "melvorF:Rings"
    );
  }
  preAction() {}
  get actionRewards() {
    const rewards = new Rewards(this.game);
    const actionEvent = new CraftingActionEvent(this, this.activeRecipe);
    let qtyToAdd = this.actionItemQuantity;
    if (rollPercentage(this.actionDoublingChance)) qtyToAdd *= 2;
    qtyToAdd *= Math.pow(
      2,
      this.game.modifiers.getSkillModifierValue("doubleItemsSkill", this)
    );
    const itemID = this.actionItem;
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
    rewards.addItem(itemID, qtyToAdd);
    actionEvent.productQuantity = qtyToAdd;
    this.game.stats.Crafting.add(CraftingStats.ItemsCrafted, qtyToAdd);
    if (
      this.isMakingJewlery &&
      this.game.modifiers.increasedCraftingJewelryRandomGemChance > 0 &&
      rollPercentage(
        this.game.modifiers.increasedCraftingJewelryRandomGemChance
      )
    ) {
      rewards.addItem(this.game.randomGemTable.getDrop().item, 1);
    }
    rewards.addXP(this, this.actionXP);
    this.addCommonRewards(rewards);
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  postAction() {
    this.game.stats.Crafting.inc(CraftingStats.Actions);
    this.game.stats.Crafting.add(
      CraftingStats.TimeSpent,
      this.currentActionInterval
    );
    this.renderQueue.recipeInfo = true;
    this.renderQueue.quantities = true;
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.craftingRecipes[oldActionID];
  }
  setFromOldOffline(offline, idMap) {
    const recipe = this.actions.getObjectByID(
      idMap.craftingRecipes[offline.action]
    );
    if (recipe !== undefined) {
      this.selectRecipeOnClick(recipe);
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
