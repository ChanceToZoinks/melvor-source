declare class Smithing extends ArtisanSkill {
    constructor(namespace: any, game: any);
    _media: string;
    baseInterval: number;
    selectionTabs: Map<any, any>;
    renderQueue: ArtisanSkillRenderQueue;
    oreToBarMap: Map<any, any>;
    categories: NamespaceRegistry;
    getTotalUnlockedMasteryActions(): any;
    get menu(): any;
    get noCostsMessage(): any;
    get actionItem(): any;
    get actionItemQuantity(): any;
    get activeRecipe(): any;
    get isMakingBar(): boolean;
    get recipeHasCoal(): any;
    get masteryModifiedInterval(): number;
    getSmithedVersionOfOre(ore: any): any;
    recordCostPreservationStats(costs: any): void;
    recordCostConsumptionStats(costs: any): void;
    preAction(): void;
    get actionRewards(): Rewards;
    postAction(): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
}
