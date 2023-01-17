"use strict";
class ArtisanSkill extends CraftingSkill {
  get actionXP() {
    return this.activeRecipe.baseExperience;
  }
  get actionDoublingChance() {
    return this.getDoublingChance(this.masteryAction);
  }
  get actionInterval() {
    return this.modifyInterval(this.baseInterval, this.masteryAction);
  }
  get actionLevel() {
    return this.activeRecipe.level;
  }
  get masteryAction() {
    return this.activeRecipe;
  }
  createButtonOnClick() {
    if (this.isActive) {
      this.stop();
    } else if (this.selectedRecipe !== undefined) {
      if (this.getCurrentRecipeCosts().checkIfOwned()) {
        this.start();
      } else {
        notifyPlayer(this, this.noCostsMessage, "danger");
      }
    }
  }
  selectRecipeOnClick(recipe) {
    if (recipe !== this.selectedRecipe && this.isActive && !this.stop()) return;
    this.selectedRecipe = recipe;
    this.renderQueue.selectedRecipe = true;
    this.render();
    if (nativeManager.isMobile) {
      try {
        const element = document.getElementById(
          `${this.localID.toLowerCase()}-category-container`
        );
        window.scrollTo({ top: element.offsetTop + 300, behavior: "smooth" });
      } catch (e) {
        console.warn("Could not scroll to element. Error: " + e);
      }
    }
  }
  onLoad() {
    super.onLoad();
    this.menu.localize();
    this.menu.setCreateCallback(() => this.createButtonOnClick());
    if (this.selectionTabs.size > 0) {
      const [firstTab] = this.selectionTabs.values();
      firstTab.show();
    }
    this.renderQueue.selectionTabs = true;
    this.renderQueue.selectedRecipe = true;
    if (this.isActive) {
      this.renderQueue.progressBar = true;
    }
    this.render();
  }
  queueBankQuantityRender(item) {
    this.renderQueue.quantities = true;
  }
  onModifierChange() {
    super.onModifierChange();
    this.renderQueue.selectionTabs = true;
    this.renderQueue.selectedRecipe = true;
  }
  onEquipmentChange() {}
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.renderQueue.selectionTabs = true;
  }
  getErrorLog() {
    return `${super.getErrorLog()}
Selected Recipe ID: ${this.selectedRecipe}`;
  }
  render() {
    this.renderSelectedRecipe();
    super.render();
    this.renderQuantities();
    this.renderRecipeInfo();
    this.renderProgressBar();
    this.renderSelectionTabs();
  }
  getRecipeCosts(recipe) {
    const costs = new Costs(this.game);
    recipe.itemCosts.forEach(({ item, quantity }) => {
      quantity = this.modifyItemCost(item, quantity, recipe);
      if (quantity > 0) costs.addItem(item, quantity);
    });
    if (recipe.gpCost > 0) costs.addGP(this.modifyGPCost(recipe));
    if (recipe.scCost > 0) costs.addSlayerCoins(this.modifySCCost(recipe));
    return costs;
  }
  getCurrentRecipeCosts() {
    return this.getRecipeCosts(this.activeRecipe);
  }
  modifyItemCost(item, quantity, recipe) {
    return quantity;
  }
  modifyGPCost(recipe) {
    return recipe.gpCost;
  }
  modifySCCost(recipe) {
    return recipe.scCost;
  }
  renderQuantities() {
    if (!this.renderQueue.quantities) return;
    this.menu.updateQuantities();
    this.renderQueue.quantities = false;
  }
  renderSelectedRecipe() {
    if (!this.renderQueue.selectedRecipe) return;
    if (this.selectedRecipe !== undefined) {
      this.menu.setSelected(this.selectedRecipe);
      this.menu.setProduct(this.actionItem, this.actionItemQuantity);
      const costs = this.getCurrentRecipeCosts();
      this.menu.setIngredients(
        costs.getItemQuantityArray(),
        costs.gp,
        costs.sc
      );
      this.renderQueue.recipeInfo = true;
      this.renderQueue.actionMastery.add(this.masteryAction);
    }
    this.renderQueue.selectedRecipe = false;
  }
  renderRecipeInfo() {
    if (!this.renderQueue.recipeInfo) return;
    const masteryXPToAdd = this.getMasteryXPToAddForAction(
      this.masteryAction,
      this.masteryModifiedInterval
    );
    this.menu.updateGrants(
      this.modifyXP(this.actionXP),
      masteryXPToAdd,
      this.getMasteryXPToAddToPool(masteryXPToAdd)
    );
    this.menu.updateChances(
      this.actionPreservationChance,
      this.actionDoublingChance
    );
    this.menu.updateInterval(this.actionInterval);
    this.renderQueue.recipeInfo = false;
  }
  renderProgressBar() {
    if (!this.renderQueue.progressBar) return;
    if (this.isActive) {
      this.menu.animateProgressFromTimer(this.actionTimer);
    } else {
      this.menu.stopProgressBar();
    }
    this.renderQueue.progressBar = false;
  }
  renderSelectionTabs() {
    if (!this.renderQueue.selectionTabs) return;
    this.selectionTabs.forEach((tab) => {
      tab.updateRecipesForLevel();
      tab.updateRecipeTooltips();
    });
    this.renderQueue.selectionTabs = false;
  }
  encode(writer) {
    super.encode(writer);
    writer.writeBoolean(this.selectedRecipe !== undefined);
    if (this.selectedRecipe !== undefined)
      writer.writeNamespacedObject(this.selectedRecipe);
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    if (reader.getBoolean()) {
      const recipe = reader.getNamespacedObject(this.actions);
      if (typeof recipe === "string") this.shouldResetAction = true;
      else this.selectedRecipe = recipe;
    }
    if (this.shouldResetAction) this.resetActionState();
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    this.selectedRecipe = this.actions.getObjectByID(
      this.getActionIDFromOldID(reader.getNumber(), idMap)
    );
    if (this.isActive && this.selectedRecipe === undefined)
      this.shouldResetAction = true;
    if (this.shouldResetAction) this.resetActionState();
  }
}
class ArtisanSkillRenderQueue extends GatheringSkillRenderQueue {
  constructor() {
    super(...arguments);
    this.quantities = false;
    this.recipeInfo = false;
    this.selectedRecipe = false;
    this.selectionTabs = false;
  }
}
class ArtisanSkillRecipe extends BasicSkillRecipe {
  constructor(namespace, data, game) {
    super(namespace, data);
    this.itemCosts = game.items.getQuantities(data.itemCosts);
    this.gpCost = data.gpCost;
    this.scCost = data.scCost;
  }
}
class CategorizedArtisanRecipe extends ArtisanSkillRecipe {
  constructor(namespace, data, game, skill) {
    super(namespace, data, game);
    const category = skill.categories.getObjectByID(data.categoryID);
    if (category === undefined)
      throw new Error(
        `Error constructing CategorizedArtisanRecipe with id: ${this.id}. Category with id: ${data.categoryID} is not registered to ${skill.id}`
      );
    this.category = category;
  }
}
class SingleProductArtisanSkillRecipe extends CategorizedArtisanRecipe {
  constructor(namespace, data, game, skill) {
    super(namespace, data, game, skill);
    const product = game.items.getObjectByID(data.productID);
    if (product === undefined)
      throw new Error(
        `Error constructing SingleProductArtisanSkillRecipe with id: ${this.id}. Product with id: ${data.productID} is not registered.`
      );
    this.product = product;
    this.baseQuantity = data.baseQuantity;
  }
  get name() {
    return this.product.name;
  }
  get media() {
    return this.product.media;
  }
}
