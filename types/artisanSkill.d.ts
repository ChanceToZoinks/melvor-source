declare class ArtisanSkill extends CraftingSkill {
  get actionXP(): any;
  get actionDoublingChance(): number;
  get actionInterval(): number;
  get actionLevel(): any;
  get masteryAction(): any;
  createButtonOnClick(): void;
  selectRecipeOnClick(recipe: any): void;
  selectedRecipe: any;
  queueBankQuantityRender(item: any): void;
  onEquipmentChange(): void;
  getRecipeCosts(recipe: any): Costs;
  getCurrentRecipeCosts(): Costs;
  modifyItemCost(item: any, quantity: any, recipe: any): any;
  modifyGPCost(recipe: any): any;
  modifySCCost(recipe: any): any;
  renderQuantities(): void;
  renderSelectedRecipe(): void;
  renderRecipeInfo(): void;
  renderProgressBar(): void;
  renderSelectionTabs(): void;
}
declare class ArtisanSkillRenderQueue extends GatheringSkillRenderQueue {
  quantities: boolean;
  recipeInfo: boolean;
  selectedRecipe: boolean;
  selectionTabs: boolean;
}
declare class ArtisanSkillRecipe extends BasicSkillRecipe {
  constructor(namespace: any, data: any, game: any);
  itemCosts: any;
  gpCost: any;
  scCost: any;
}
declare class CategorizedArtisanRecipe extends ArtisanSkillRecipe {
  constructor(namespace: any, data: any, game: any, skill: any);
  category: any;
}
declare class SingleProductArtisanSkillRecipe extends CategorizedArtisanRecipe {
  product: any;
  baseQuantity: any;
  get name(): any;
  get media(): any;
}
