declare class Runecrafting extends ArtisanSkill {
  constructor(namespace: any, game: any);
  _media: string;
  baseInterval: number;
  selectionTabs: Map<any, any>;
  renderQueue: ArtisanSkillRenderQueue;
  elementalRunes: any[];
  comboRunes: any[];
  categories: NamespaceRegistry;
  getTotalUnlockedMasteryActions(): any;
  get menu(): any;
  get noCostsMessage(): any;
  get actionItem(): any;
  get actionItemQuantity(): any;
  get activeRecipe(): any;
  get masteryModifiedInterval(): number;
  get isMakingRunes(): boolean;
  get isOctoActive(): any;
  crowDevilItem: any;
  getRecipeSubCategory(recipe: any): "None" | "ElementalRunes" | "Staff";
  modifyItemCost(item: any, quantity: any, recipe: any): number;
  recordCostPreservationStats(costs: any): void;
  recordCostConsumptionStats(costs: any): void;
  preAction(): void;
  get actionRewards(): Rewards;
  postAction(): void;
  getActionIDFromOldID(oldActionID: any, idMap: any): any;
  setFromOldOffline(offline: any, idMap: any): void;
}
