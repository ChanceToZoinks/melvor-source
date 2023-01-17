declare function sortRecipesByCategoryAndLevel(
  recipes: any,
  categories: any
): any;
declare const masteryCheckpoints: number[];
declare class MasteryAction extends NamespacedObject {}
declare class DummyMasteryAction extends MasteryAction {
  get name(): string;
  get media(): any;
}
