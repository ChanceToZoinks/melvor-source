declare class CookingRecipe extends SingleProductArtisanSkillRecipe {
  hasMastery: boolean;
  discoveredItems: any[];
  perfectItem: any;
  baseInterval: any;
}
declare class CookingCategory extends SkillCategory {
  constructor(namespace: any, data: any, game: any, skill: any);
  game: any;
  shopUpgrades: any;
  upgradeRequired: any;
  get upgradeOwned(): boolean;
  get highestUpgrade(): any;
  applyDataModification(modData: any, game: any): void;
}
declare class Cooking extends CraftingSkill {
  constructor(namespace: any, game: any);
  _media: string;
  renderQueue: CookingRenderQueue;
  selectedRecipes: Map<any, any>;
  passiveCookTimers: Map<any, any>;
  stockpileItems: Map<any, any>;
  productRecipeMap: Map<any, any>;
  ingredientRecipeMap: Map<any, any>;
  categories: NamespaceRegistry;
  getTotalUnlockedMasteryActions(): any;
  get actionInterval(): number;
  get actionLevel(): any;
  get masteryAction(): any;
  get masteryModifiedInterval(): number;
  get activeRecipe(): any;
  get noCostsMessage(): any;
  get noPassiveCostsMessage(): any;
  canStopPassiveCooking(category: any): boolean;
  getIngredientCookedVersion(item: any): any;
  getStockpileSnapshot(): Map<any, any>;
  getMasteryHealingBonus(foodItem: any): number;
  getRecipeMasteryModifiedInterval(recipe: any): number;
  getRecipeCookingInterval(recipe: any): number;
  getRecipePassiveCookingInterval(recipe: any): number;
  getRecipeSuccessChance(recipe: any): number;
  getRecipePerfectChance(recipe: any): number;
  getRecipeCosts(recipe: any): Costs;
  getCurrentRecipeCosts(): Costs;
  recordCostConsumptionStats(costs: any): void;
  recordCostPreservationStats(costs: any): void;
  preAction(): void;
  get actionRewards(): Rewards;
  postAction(): void;
  startPassiveCooking(category: any): void;
  stopPassiveCooking(category: any): boolean;
  addItemToStockpile(category: any, item: any, quantity: any): void;
  passiveCookingAction(category: any): void;
  onActiveCookButtonClick(category: any): void;
  activeCookingCategory: any;
  onPassiveCookButtonClick(category: any): void;
  onRecipeSelectionClick(recipe: any): void;
  onRecipeSelectionOpenClick(category: any): void;
  onCollectStockpileClick(category: any): void;
  onEquipmentChange(): void;
  queueBankQuantityRender(item: any): void;
  renderSelectedRecipes(): void;
  renderRecipeRates(): void;
  renderRecipeQuantities(): void;
  renderProgressBars(): void;
  renderStockpile(): void;
  renderUpgrades(): void;
  convertFromOldFormat(savegame: any, idMap: any): void;
  getActionIDFromOldID(oldActionID: any, idMap: any): any;
  setFromOldOffline(offline: any, idMap: any): void;
}
declare namespace Cooking {
  const baseSuccessChance: number;
}
declare class CookingRenderQueue extends GatheringSkillRenderQueue {
  selectedRecipes: Set<any>;
  recipeRates: boolean;
  quantities: boolean;
  stockpile: Set<any>;
  upgrades: boolean;
}
