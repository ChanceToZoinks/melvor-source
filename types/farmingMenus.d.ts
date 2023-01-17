declare class FarmingCategoryButtonElement extends HTMLElement {
    _content: DocumentFragment;
    link: any;
    categoryImage: any;
    categoryName: any;
    categoryDescription: any;
    harvestReadyNotice: any;
    connectedCallback(): void;
    setCategory(category: any, farming: any): void;
    updateNotice(show: any): void;
}
declare class FarmingCategoryOptionsElement extends HTMLElement {
    compostAllButtons: any[];
    _content: DocumentFragment;
    harvestAllButton: any;
    plantAllButton: any;
    plantAllSelectedButton: any;
    connectedCallback(): void;
    setCategory(category: any, game: any): void;
}
declare class FarmingPlotElement extends HTMLElement {
    seedQuantities: Map<any, any>;
    compostButtons: any[];
    _content: DocumentFragment;
    categoryName: any;
    selectSeedDropdownButton: any;
    selectSeedDropdownImage: any;
    selectSeedDropdownOptions: any;
    plantSeedButton: any;
    seedImage: any;
    growthStatus: any;
    compostProgress: any;
    destroyButton: any;
    harvestButton: any;
    compostButtonContainer: any;
    growthChance: any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    destroyTooltips(): void;
    compostTooltips: any[];
    setPlot(plot: any, game: any): void;
    updateCompost(plot: any, farming: any): void;
    updateGrowthTime(plot: any, farming: any): void;
    updatePlotState(plot: any): void;
    updateSelectedSeed(plot: any): void;
    updateSeedQuantities(farming: any): void;
}
declare class LockedFarmingPlotElement extends HTMLElement {
    _content: DocumentFragment;
    farmingLevelRequired: any;
    gpCost: any;
    unlockButton: any;
    connectedCallback(): void;
    setPlot(plot: any, farming: any): void;
}
declare class FarmingSeedSelectElement extends HTMLElement {
    _content: DocumentFragment;
    seedNotice: any;
    seedButtonContainer: any;
    recipeOwnedQuantity: any;
    recipeProductQuantity: any;
    recipeMastery: any;
    recipeCategory: any;
    recipeLevel: any;
    recipeQuantity: any;
    recipeInterval: any;
    plantButton: any;
    connectedCallback(): void;
    setSeedSelection(category: any, game: any, plot: any): void;
    setSelectedRecipe(recipe: any, game: any, plot: any): void;
    setUnselectedRecipe(): void;
}
