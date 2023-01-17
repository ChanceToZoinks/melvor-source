declare function localizeSummoning(): void;
declare class SummoningRecipe extends CategorizedArtisanRecipe {
    _markMedia: any;
    product: any;
    baseQuantity: any;
    nonShardItemCosts: any;
    tier: any;
    skills: any;
    get name(): any;
    get media(): any;
    get markMedia(): any;
}
declare class DummySummoningRecipe extends SummoningRecipe {
    constructor(namespace: any, id: any, game: any);
}
declare class SummoningSynergy {
    constructor(data: any, game: any, summoning: any);
    modifiers: any;
    enemyModifiers: any;
    conditionalModifiers: any;
    summons: any[];
    consumesOn: any;
    _customDescription: any;
    get description(): any;
}
declare class Summoning extends ArtisanSkill {
    static getTabletConsumptionXP(summon: any, interval: any): number;
    static updateSearchArray(): void;
    constructor(namespace: any, game: any);
    _media: string;
    baseInterval: number;
    selectionTabs: Map<any, any>;
    renderQueue: SummoningRenderQueue;
    synergies: any[];
    synergiesByItem: Map<any, any>;
    recipesByProduct: Map<any, any>;
    recipesBySkill: Map<any, any>;
    setAltRecipes: Map<any, any>;
    marksUnlocked: Map<any, any>;
    categories: NamespaceRegistry;
    getTotalUnlockedMasteryActions(): any;
    get totalSynergiesUnlocked(): any;
    get menu(): any;
    get noCostsMessage(): any;
    get actionItem(): any;
    get actionItemQuantity(): number;
    get activeRecipe(): any;
    get masteryModifiedInterval(): number;
    get selectedAltRecipe(): any;
    get totalMarksDiscovered(): number;
    addXPForTabletConsumption(tablet: any, interval: any): void;
    getRecipeFromProduct(product: any): any;
    getMarkSnapshot(): Map<any, any>;
    getNonShardCostReductionModifier(recipe: any): number;
    modifyItemCost(item: any, quantity: any, recipe: any): number;
    modifyGPCost(recipe: any): number;
    modifySCCost(recipe: any): number;
    addNonShardCosts(recipe: any, altID: any, costs: any): void;
    getAltRecipeCosts(recipe: any, altID: any): Costs;
    selectAltRecipeOnClick(altID: any): void;
    renderMarkState(): void;
    renderMarkProgress(): void;
    renderSynergyUnlock(): void;
    renderSynergyQuantity(): void;
    queueMarkDiscoveryModal(mark: any): void;
    queueMarkLevelUpModal(mark: any): void;
    recordCostPreservationStats(costs: any): void;
    recordCostConsumptionStats(costs: any): void;
    preAction(): void;
    get actionRewards(): Rewards;
    postAction(): void;
    convertFromOldFormat(summoningData: any, idMap: any): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
    getMarkCount(mark: any): any;
    getMarkImage(mark: any): any;
    getMarkName(mark: any): any;
    getMarkLevel(mark: any): number;
    getSynergyData(summon1: any, summon2: any): any;
    getUnlockedSynergyData(summon1: any, summon2: any): any;
    isSynergyUnlocked(synergy: any): boolean;
    getChanceForMark(mark: any, skill: any, modifiedInterval: any): number;
    rollForMark(mark: any, skill: any, modifiedInterval: any): void;
    discoverMark(mark: any): void;
    checkForPetMark(): void;
    rollMarksForSkill(skill: any, modifiedInterval: any): void;
    getMarkForSkill(skill: any): any;
}
declare namespace Summoning {
    const recipeGPCost: number;
    const markLevels: number[];
    const searchArray: any[];
}
declare class SummoningRenderQueue extends ArtisanSkillRenderQueue {
    markState: Set<any>;
    markCount: Set<any>;
    synergyQuantities: boolean;
    synergyUnlock: boolean;
}
