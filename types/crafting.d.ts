declare class Crafting extends ArtisanSkill {
    constructor(namespace: any, game: any);
    _media: string;
    baseInterval: number;
    selectionTabs: Map<any, any>;
    renderQueue: ArtisanSkillRenderQueue;
    categories: NamespaceRegistry;
    getTotalUnlockedMasteryActions(): any;
    get menu(): any;
    get noCostsMessage(): any;
    get actionItem(): any;
    get actionItemQuantity(): any;
    get activeRecipe(): any;
    get masteryModifiedInterval(): number;
    recordCostPreservationStats(costs: any): void;
    recordCostConsumptionStats(costs: any): void;
    get isMakingJewlery(): boolean;
    preAction(): void;
    get actionRewards(): Rewards;
    postAction(): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
}
