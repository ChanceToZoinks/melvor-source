declare class TownshipResourceDisplayElement extends HTMLElement {
    _content: DocumentFragment;
    setPriorityButton: any;
    resourceIcon: any;
    resourceAmount: any;
    resourceRate: any;
    workerBadge: any;
    assignedWorkers: any;
    connectedCallback(): void;
    tooltip: any;
    disconnectedCallback(): void;
    setResource(resource: any, township: any): void;
    updateResourceAmount(resource: any, township: any): void;
    updateResourceTextColour(resource: any, township: any): void;
    updateResourceRate(resource: any, township: any): void;
    updateAssignedWorkers(job: any): void;
    highlightButton(): void;
    unhighlightButton(): void;
    getTooltipContent(resource: any, township: any): string;
    getResourcePerTickUsageSpan(resource: any, township: any): string;
    getResourcePerTickGainSpan(resource: any, township: any): string;
}
declare class TownshipTownBiomeSelectElement extends HTMLElement {
    _content: DocumentFragment;
    selectButton: any;
    biomeName: any;
    biomeCount: any;
    biomeImage: any;
    buildingCount: any;
    connectedCallback(): void;
    setBiome(biome: any, township: any): void;
    updateBuildingCount(biome: any, township: any): void;
    highlight(biome: any): void;
    unhighlight(biome: any): void;
    setAsMobileLayout(biome: any): void;
    setBuildingCount(building: any, biome: any): void;
    showBuildingCount(): void;
    hideBuildingCount(): void;
    highlightBorder(): void;
    unhighlightBorder(): void;
}
declare class TownshipBuildingSummaryElement extends HTMLElement {
    _content: DocumentFragment;
    image: any;
    name: any;
    count: any;
    provides: any;
    resourceOutput: any;
    resourceUsage: any;
    modifiers: any;
    extraRequirements: any;
    levelRequirement: any;
    popRequirement: any;
    connectedCallback(): void;
    setBuilding(building: any, township: any): void;
    setBuildingWithoutQuantity(building: any, township: any): void;
    updateNameQuantity(building: any, quantity: any): void;
    updateBuildingCount(count: any): void;
    createProvidesElement(iconClass: any, value: any): string;
    updateBuildingProvides(building: any, township: any, qty?: number): void;
    updateResourceOutput(building: any, township: any, qty?: number): void;
    updateResourceUsage(building: any, township: any, qty?: number): void;
    updateModifiers(building: any): void;
    applyReqFormatting(req: any, isMet: any): void;
    updateExtraRequirements(building: any, township: any): void;
    updateForBuildQtyChange(building: any, township: any): void;
    updateForBaseBuildQty(building: any, township: any): void;
}
declare class BuildingInTownElement extends HTMLElement {
    _content: DocumentFragment;
    buildingDiv: any;
    buildingImage: any;
    buildingName: any;
    buildingTaskIcon: any;
    buildingCount: any;
    destroyContainer: any;
    destroyButton: any;
    destroyQtyOptions: any;
    buildingTotals: any;
    buildingResources: any;
    resourceOutput: any;
    resourceUsage: any;
    buildingModifiers: any;
    upgradesToDivider: any;
    selectBiomeWarning: any;
    upgradesToContainer: any;
    upgradesToName: any;
    upgradesToCosts: any;
    upgradeButton: any;
    upgradeQtyOptions: any;
    connectedCallback(): void;
    upgradesToTooltip: any;
    initQtyDropdowns(townshipUI: any): void;
    setBuilding(building: any, township: any): void;
    updateBuildingCount(count: any): void;
    updateBuildingUpgradeCosts(upgradesTo: any, township: any): void;
    toggleBuildOptions(show: any, hasUpgrade: any): void;
    createTotalElement(iconClass: any, total: any): string;
    updateBuildingTotals(building: any, township: any): void;
    updateResourceTotals(building: any, township: any): void;
    setResourceUsage(building: any, townshipUI: any): void;
    updateModifierTotals(building: any): void;
}
declare class TownshipBuildBiomeSelectElement extends HTMLElement {
    _content: DocumentFragment;
    selectButton: any;
    biomeName: any;
    biomesRemaining: any;
    biomeImage: any;
    buildImage: any;
    containsResources: any;
    buildingCount: any;
    connectedCallback(): void;
    setBiome(biome: any, township: any): void;
    updateBiomesRemaining(text: any): void;
    highlight(): void;
    unhighlight(): void;
    showHighlightBorder(): void;
    hideHighlightBorder(): void;
    showFilterHighlightBorder(): void;
    hideFilterHighlightBorder(): void;
    showBuildable(): void;
    hideBuildable(): void;
    setBuildingCount(building: any, biome: any): void;
    showBuildingCount(): void;
    hideBuildingCount(): void;
    showBiome(): void;
    hideBiome(): void;
}
declare class TownshipBuildingSortDropdownOptionElement extends HTMLElement {
    _content: DocumentFragment;
    checkbox: any;
    label: any;
    connectedCallback(): void;
    configure(labelText: any, callback: any, id: any): void;
    setChecked(isChecked: any): void;
}
declare class TownshipBuildingSortDropdownElement extends HTMLElement {
    _content: DocumentFragment;
    optionsContainer: any;
    connectedCallback(): void;
    populateOptions(callback: any): void;
    addOption(text: any, category: any, index: any, isChecked: any, callback: any): void;
}
declare class TownshipBuildBuildingElement extends HTMLElement {
    _content: DocumentFragment;
    buildButton: any;
    buildingSummary: any;
    buildingCosts: any;
    connectedCallback(): void;
    setBuilding(building: any, township: any): void;
    updateResourceOutput(building: any, township: any): void;
    updateExtraRequirements(building: any, township: any): void;
    updateBuildingCosts(building: any, township: any): void;
    updateBuildingCount(building: any, township: any): void;
    updateForBuildQtyChange(building: any, township: any): void;
    showFilterHighlightBorder(): void;
    hideFilterHighlightBorder(): void;
}
declare class TownshipYeetElement extends HTMLElement {
    _content: DocumentFragment;
    yeetButton: any;
    resourceImage: any;
    resourceAmount: any;
    connectedCallback(): void;
    setResource(resource: any, amount: any, township: any): void;
}
declare class TownshipCapResourceElement extends HTMLElement {
    _content: DocumentFragment;
    resourceImage: any;
    resourceName: any;
    capQtyDropdown: any;
    capQtyOptions: any;
    connectedCallback(): void;
    setResource(resource: any, township: any): void;
    setCap(resource: any): void;
    initQtyDropdowns(resource: any, township: any): void;
}
declare class TownshipConversionElement extends HTMLElement {
    _content: DocumentFragment;
    convertButton: any;
    convertFromImage: any;
    convertQuantity: any;
    connectedCallback(): void;
    tooltip: any;
    disconnectedCallback(): void;
    getTooltip(resource: any, item: any): string;
    createConvertToSwal(resource: any, item: any, township: any): void;
    createConvertFromSwal(resource: any, item: any, township: any): void;
    setItemToResource(resource: any, item: any, township: any): void;
    updateConvertRatio(resource: any, item: any, township: any): void;
    updateConvertToRatio(resource: any, item: any, township: any): void;
    updateConvertFromRatio(resource: any, item: any, township: any): void;
}
declare class TownshipConversionSwalTemplate extends HTMLElement {
    _content: DocumentFragment;
    convertFromImage: any;
    convertFromQuantity: any;
    convertToImage: any;
    convertToQuantity: any;
    convertFromRatioImage: any;
    convertFromRatioQuantity: any;
    convertToRatioImage: any;
    convertToRatioQuantity: any;
    receiveImage: any;
    receiveQuantity: any;
    receiveGP: any;
    receiveGPContainer: any;
    btnGroupNumber: any;
    btnGroupPercent: any;
    btnNumber: any;
    btnPercent: any;
    inputQty: any;
    traderStock: any;
    traderIncrease: any;
    connectedCallback(): void;
    setConvertToImage(media: any): void;
    setConvertToQuantity(qty: any): void;
    setConvertFromImage(media: any): void;
    setConvertFromQuantity(ratio: any, qty: any): void;
    setConvertToRatioQuantity(qty: any): void;
    setConvertFromRatioQuantity(qty: any): void;
    setConvertButtons(resource: any, item: any, type: any): void;
    setConvertToQuantityInput(value: any, resource: any, item: any): void;
    setConvertFromQuantityInput(value: any, resource: any, item: any): void;
    updateInputValue(): void;
    updateGPValue(value: any): void;
    setTraderStock(township: any): void;
}
declare class TownshipWorshipSelectButtonElement extends HTMLElement {
    _content: DocumentFragment;
    selectButton: any;
    worshipName: any;
    worshipDescription: any;
    connectedCallback(): void;
    setWorship(worship: any, township: any): void;
    setSelected(): void;
    setUnselected(): void;
}
declare class TownshipWorshipSelectElement extends HTMLElement {
    _content: DocumentFragment;
    modifierDiv: any;
    modifierContainer: any;
    connectedCallback(): void;
    setWorship(worship: any, township: any): void;
}
declare class TownshipConversionJumpToElement extends HTMLElement {
    _content: DocumentFragment;
    resourceIcon: any;
    resourceList: any;
    connectedCallback(): void;
    setIcon(resource: any): void;
}
declare class TownshipTownBreakdownElement extends HTMLElement {
    _content: DocumentFragment;
    breakdownTitle: any;
    value: any;
    connectedCallback(): void;
    setItem(title: any, value: any): void;
    addValueClass(valueClass: any): void;
    removeValueClass(valueClass: any): void;
}
declare class TownshipBuildBiomeFilterIconElement extends HTMLElement {
    _content: DocumentFragment;
    icon: any;
    media: any;
    filterList: any;
    filterLink: any;
    tooltipContent: string;
    connectedCallback(): void;
    setIcon(className: any): void;
    setIconColor(color: any): void;
    setMedia(resource: any): void;
    setTooltip(): void;
    tooltip: any;
    setTooltipContent(content: any): void;
}
