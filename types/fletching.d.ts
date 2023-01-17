declare class Fletching extends ArtisanSkill {
    constructor(namespace: any, game: any);
    _media: string;
    baseInterval: number;
    selectionTabs: Map<any, any>;
    renderQueue: ArtisanSkillRenderQueue;
    setAltRecipes: Map<any, any>;
    categories: NamespaceRegistry;
    getTotalUnlockedMasteryActions(): any;
    get menu(): any;
    get noCostsMessage(): any;
    get actionItem(): any;
    get actionItemQuantity(): any;
    get activeRecipe(): any;
    get masteryModifiedInterval(): number;
    get selectedAltRecipe(): any;
    selectAltRecipeOnClick(altID: any): void;
    doesRecipeMakeArrows(recipe: any): boolean;
    doesRecipeMakeUnstrungBows(recipe: any): boolean;
    recordCostPreservationStats(costs: any): void;
    recordCostConsumptionStats(costs: any): void;
    preAction(): void;
    get actionRewards(): Rewards;
    postAction(): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
}
declare class FletchingRecipe extends SingleProductArtisanSkillRecipe {
    alternativeCosts: any;
    applyDataModification(modData: any, game: any): void;
}
