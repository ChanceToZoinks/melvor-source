declare class HerbloreRecipe extends CategorizedArtisanRecipe {
  skill: any;
  _name: any;
  potions: any;
  get name(): any;
  get media(): any;
}
declare class Herblore extends ArtisanSkill {
  constructor(namespace: any, game: any);
  _media: string;
  baseInterval: number;
  selectionTabs: Map<any, any>;
  renderQueue: ArtisanSkillRenderQueue;
  potionToRecipeMap: Map<any, any>;
  categories: NamespaceRegistry;
  getTotalUnlockedMasteryActions(): any;
  get menu(): any;
  get noCostsMessage(): any;
  get actionItem(): any;
  get actionItemQuantity(): number;
  get activeRecipe(): any;
  get masteryModifiedInterval(): number;
  deadlyToxinsItem: any;
  getRecipeForPotion(potion: any): any;
  getPotionTier(recipe: any): number;
  recordCostPreservationStats(costs: any): void;
  recordCostConsumptionStats(costs: any): void;
  preAction(): void;
  get actionRewards(): Rewards;
  postAction(): void;
  getActionIDFromOldID(oldActionID: any, idMap: any): any;
  setFromOldOffline(offline: any, idMap: any): void;
}
declare namespace Herblore {
  const tierMasteryLevels: number[];
}
