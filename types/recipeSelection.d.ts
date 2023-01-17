declare class RecipeSelectionTab extends ContainedComponent {
  constructor(
    parentID: any,
    skill: any,
    recipes: any,
    containerID: any,
    recipeCollapse?: string
  );
  skill: any;
  recipes: any;
  recipeCollapse: string;
  recipeContainers: any[];
  recipeTooltips: any[];
  recipeUnlocked: any[];
  parent: HTMLElement;
  container: any;
  recipeRow: any;
  updateRecipesForLevel(): void;
  updateRecipeTooltips(): void;
  localize(): void;
  isRecipeUnlocked(recipe: any): boolean;
  addRecipeContainer(): void;
  setRecipeUnlocked(id: any): void;
  setRecipeLocked(id: any): void;
  getRequiresTooltip(items: any, gp: any, sc: any): string;
}
declare class ItemRecipeSelectionTab extends RecipeSelectionTab {
  getRecipeMedia(recipe: any): any;
  getRecipeName(recipe: any): any;
}
declare class SmithingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category: any);
  getRecipeCallback(recipe: any): () => any;
  getRecipeIngredients(recipe: any): any;
}
declare class FletchingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category: any);
  getRecipeCallback(recipe: any): () => any;
  getRecipeIngredients(recipe: any): any;
}
declare class CraftingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category: any);
  getRecipeCallback(recipe: any): () => any;
  getRecipeIngredients(recipe: any): any;
}
declare class RunecraftingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category: any);
  getRecipeCallback(recipe: any): () => any;
  getRecipeIngredients(recipe: any): any;
}
declare class HerbloreSelectionTab extends RecipeSelectionTab {
  constructor(category: any);
  getRecipeMedia(recipe: any): any;
  getRecipeName(recipe: any): any;
  getRecipeCallback(recipe: any): () => any;
  getRecipeIngredients(recipe: any): any;
}
declare class AltMagicSelectionTab extends RecipeSelectionTab {
  constructor();
  getRecipeMedia(recipe: any): any;
  getRecipeName(recipe: any): any;
  getRecipeCallback(recipe: any): () => any;
  getRecipeIngredients(recipe: any): Costs;
  getSpellTooltip(altSpell: any): string;
}
declare class SummoningSelectionTab extends ItemRecipeSelectionTab {
  constructor(category: any);
  shardMessage: any;
  getRecipeCallback(recipe: any): () => any;
  getRecipeIngredients(recipe: any): any;
}
declare class CategoryMenu extends ContainedComponent {
  constructor(
    parentID: any,
    navID: any,
    categoryData: any,
    expandTextID: any,
    changeCategoryFunc: any
  );
  navID: any;
  categoryData: any;
  expandTextID: any;
  optionNames: any[];
  container: any;
  expandText: any;
  optionsContainer: any;
  addCategory(category: any, callback: any): void;
  localize(): void;
}
