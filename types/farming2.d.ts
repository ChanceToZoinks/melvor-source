declare class FarmingRecipe extends SingleProductRecipe {
    constructor(namespace: any, data: any, skill: any, game: any);
    baseInterval: any;
    category: any;
    seedCost: any;
    _grownName: any;
    _grownMedia: any;
    _grownNameLang: any;
}
declare class FarmingCategory extends SkillCategory {
    returnSeeds: any;
    scaleXPWithQuantity: any;
    harvestMultiplier: any;
    masteryXPDivider: any;
    giveXPOnPlant: any;
    _singularName: any;
    _description: any;
    _seedNotice: any;
    get singularName(): any;
    get description(): any;
    get seedNotice(): any;
}
declare class FarmingPlot extends NamespacedObject {
    constructor(namespace: any, data: any, farming: any);
    farming: any;
    state: number;
    compostLevel: number;
    growthTime: number;
    category: any;
    level: any;
    gpCost: any;
    encode(writer: any): any;
    decode(reader: any, version: any): void;
    plantedRecipe: any;
    compostItem: any;
    selectedRecipe: any;
}
declare class DummyFarmingPlot extends FarmingPlot {
}
declare class FarmingRenderQueue extends MasterySkillRenderQueue {
    growthTime: Set<any>;
    growthState: Set<any>;
    compost: Set<any>;
    selectedSeed: Set<any>;
    growthIndicators: boolean;
    compostQuantity: boolean;
}
declare class FarmingGrowthTimer extends Timer {
    plots: any;
    farming: any;
}
declare class Farming extends SkillWithMastery {
    constructor(namespace: any, game: any);
    _media: string;
    herbSeedToProductMap: Map<any, any>;
    categoryRecipeMap: Map<any, any>;
    categoryPlotMap: Map<any, any>;
    growthTimers: Set<any>;
    growthTimerMap: Map<any, any>;
    renderQueue: FarmingRenderQueue;
    categories: NamespaceRegistry;
    plots: NamespaceRegistry;
    get isPotionActive(): any;
    get activePotion(): any;
    get composts(): any;
    get isAnyPlotGrown(): boolean;
    getTotalUnlockedMasteryActions(): any;
    queueBankQuantityRender(item: any): void;
    getErrorLog(): string;
    growPlots(timer: any): void;
    removeGrowthTimer(timer: any): void;
    getHerbFromSeed(seedItem: any): any;
    getRecipesForCategory(category: any): any;
    getPlotsForCategory(category: any): any;
    getOwnedRecipeSeeds(recipe: any): any;
    getRecipeSeedCost(recipe: any): any;
    getRecipeInterval(recipe: any): number;
    getPlotGrowthChance(plot: any): number;
    getPlotGrowthTime(plot: any): number;
    getHarvestAllCost(category: any): number;
    getCompostAllCost(category: any): number;
    getPlantAllCost(category: any): number;
    harvestPlot(plot: any): boolean;
    clearDeadPlot(plot: any): void;
    resetPlot(plot: any): void;
    plantPlot(plot: any, recipe: any, isSelected?: boolean): number;
    plantAllPlots(category: any, forceRecipe: any): void;
    passiveTick(): void;
    renderGrowthStatus(): void;
    renderGrowthState(): void;
    renderCompost(): void;
    renderSelectedSeed(): void;
    renderGrowthIndicators(): void;
    renderCompostQuantity(): void;
    showPlotsInCategory(category: any): void;
    harvestAllOnClick(category: any): void;
    compostPlot(plot: any, compost: any, amount: any): boolean;
    notifyNoCompost(compost: any): void;
    notifyCantAffordCompostAll(compost: any): void;
    recordCompostStat(compost: any, amount: any): void;
    compostAllOnClick(category: any, compost: any): void;
    plantAllOnClick(category: any): void;
    plantAllSelectedOnClick(category: any): void;
    setPlantAllSelected(plot: any, recipe: any): void;
    destroyPlotOnClick(plot: any): void;
    destroyPlot(plot: any): void;
    plantPlotOnClick(plot: any): void;
    harvestPlotOnClick(plot: any): void;
    unlockPlotOnClick(plot: any): void;
    plantRecipe(recipe: any, plot: any): void;
    plantAllRecipe(recipe: any): void;
    createGrowthTimer(plots: any, interval: any): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    decodePlot(reader: any, version: any): void;
    convertFromOldFormat(save: any, idMap: any): void;
}
