declare class TownshipBiome extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  totalInMap: number;
  availableInMap: number;
  amountPurchased: number;
  buildingsBuilt: Map<any, any>;
  provides: {
    population: boolean;
    storage: boolean;
    happiness: boolean;
    education: boolean;
    deadStorage: boolean;
    worship: boolean;
  };
  containsResources: Set<any>;
  _name: any;
  _description: any;
  _media: any;
  get name(): any;
  get description(): any;
  get media(): any;
  get usageMessage(): any;
  get penaltyMessage(): any;
  get noResourceMessage(): any;
  registerSoftDependencies(data: any, game: any): void;
  resourceUsage: {
    resource: any;
    amount: any;
    _usageMessage: any;
    _penaltyMessage: any;
    _noResourceMessage: any;
  };
  getBuildingCount(building: any): any;
  removeBuildings(building: any, count: any): void;
  addBuildings(building: any, count: any): void;
  addResource(resource: any): void;
}
declare class DummyTownshipBiome extends TownshipBiome {}
declare class TownshipBuildingProvides {
  constructor(data: any, game: any);
  workers: Map<any, any>;
  resources: Map<any, any>;
  population: any;
  happiness: any;
  education: any;
  storage: any;
  deadStorage: any;
  worship: any;
  resourceCount(resource: any): any;
  workerCount(job: any): any;
}
declare class TownshipBuilding extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  biomeModifiers: Map<any, any>;
  _name: any;
  _description: any;
  _media: any;
  tier: any;
  type: any;
  upgradesFrom: any;
  costs: any;
  provides: TownshipBuildingProvides;
  biomes: any;
  modifiers: any;
  get name(): any;
  get description(): any;
  get media(): any;
  getBiomeModifier(biome: any): any;
  isAnUpgradeOf(building: any): boolean;
}
declare class DummyTownshipBuilding extends TownshipBuilding {}
declare class TownshipWorship extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  _name: any;
  _description: any;
  _media: any;
  modifiers: any;
  isHidden: any;
  checkpoints: any;
  unlockRequirements: any;
  _statueName: any;
  _statueMedia: any;
  get name(): any;
  get description(): any;
  get media(): any;
  get statueName(): any;
  get statueMedia(): any;
}
declare class DummyTownshipWorship extends TownshipWorship {}
declare class TownshipMap extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  biomeCounts: Map<any, any>;
  _name: any;
  get name(): any;
  getBiomeCount(biome: any): any;
}
declare class TownshipJob extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  assigned: number;
  maxAvailable: number;
  _name: any;
  produces: any;
  get name(): any;
}
declare class TownshipResource extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  requires: Map<any, any>;
  biomeUsage: Map<any, any>;
  requiredForPopGrowth: any;
  itemConversions: any[];
  statPenalties: any[];
  buildingPenalties: any[];
  _amount: any;
  _cap: number;
  baseGeneration: number;
  generation: number;
  _name: any;
  _media: any;
  type: any;
  _description: any;
  startingAmount: any;
  healthBonus: any;
  preventCitizenDeath: {
    resources: any;
    maxAge: any;
  };
  get name(): any;
  get media(): any;
  get description(): any;
  set amount(arg: any);
  get amount(): any;
  set cap(arg: number);
  get cap(): number;
  requiredCount(resource: any): any;
}
declare class DummyTownshipResource extends TownshipResource {}
declare class TownshipRenderQueue extends SkillRenderQueue {
  constructor(...args: any[]);
  townStats: boolean;
  resourceAmounts: boolean;
  resourceRates: boolean;
  workerCounts: boolean;
  buildingCosts: boolean;
  extraBuildingRequirements: boolean;
  ticksAvailable: boolean;
  townAge: boolean;
  citizens: boolean;
  buildingProvides: boolean;
  traderStock: boolean;
}
declare class Township extends Skill {
  constructor(namespace: any, game: any);
  _media: string;
  TICK_LENGTH: number;
  MAX_TOWN_SIZE: number;
  SECTION_SIZE: number;
  INITIAL_CITIZEN_COUNT: number;
  MIN_WORKER_AGE: number;
  MAX_WORKER_AGE: number;
  AGE_OF_DEATH: number;
  MIN_MIGRATION_AGE: number;
  MAX_MIGRATION_AGE: number;
  BASE_TAX_RATE: number;
  EDUCATION_PER_CITIZEN: number;
  HAPPINESS_PER_CITIZEN: number;
  CITIZEN_FOOD_USAGE: number;
  POPULATION_REQUIRED_FOR_BIRTH: number;
  BASE_STORAGE: number;
  WORSHIP_CHECKPOINTS: number[];
  MAX_WORSHIP: number;
  DECREASED_BUILDING_COST_CAP: number;
  DECREASED_FOOD_USAGE_CAP: number;
  populationForTier: {
    1: {
      population: number;
      level: number;
    };
    2: {
      population: number;
      level: number;
    };
    3: {
      population: number;
      level: number;
    };
    4: {
      population: number;
      level: number;
    };
    5: {
      population: number;
      level: number;
    };
    6: {
      population: number;
      level: number;
    };
    7: {
      population: number;
      level: number;
    };
  };
  renderQueue: TownshipRenderQueue;
  modifiers: MappedModifiers;
  totalTicks: number;
  citizens: any[];
  populationLimit: number;
  modifiersFromBuildings: MappedModifiers;
  convertQty: number;
  convertQtyPercent: number;
  convertQtyType: number;
  convertType: number;
  convertValues: {
    numbers: number[];
    percentages: number[];
  };
  buildQty: number;
  availableGameTicksToSpend: number;
  lastTickAddedDate: number;
  nextSectionQty: number;
  destroyQty: number;
  upgradeQty: number;
  tasks: TownshipTasks;
  jobsAreAvailable: boolean;
  tickInterval: number;
  tickIntervalActive: boolean;
  mapSelectIndex: number;
  biomes: NamespaceRegistry;
  buildings: NamespaceRegistry;
  worships: NamespaceRegistry;
  maps: NamespaceRegistry;
  resources: NamespaceRegistry;
  jobs: NamespaceRegistry;
  availableMaps: any[];
  buildingDisplayOrder: NamespacedArray;
  resourceDisplayOrder: NamespacedArray;
  buildingPenalties: {
    happiness: any[];
    education: any[];
    resources: any[];
    worship: any[];
  };
  statPenalties: {
    happinessModifier: any[];
    deathRate: any[];
    flatHappiness: any[];
  };
  healthBonusResources: any[];
  popGrowthResources: any[];
  deathPreventingResources: any[];
  updateUnemployedCount: boolean;
  _unemployedCount: number;
  changeMapWarningShown: boolean;
  changeWorshipWarningShown: boolean;
  MAX_TRADER_STOCK_INCREASE: number;
  popOver55: number;
  mapSelection: TownshipMap;
  noWorship: TownshipWorship;
  unemployedJob: TownshipJob;
  townData: TownshipData;
  get traderStockIncrease(): number;
  get decayTickAmount(): number;
  get foodJob(): any;
  get unemployedCount(): number;
  get citizenSources(): any[];
  get oneDayInTicks(): number;
  get traderTimePeriod(): number;
  get isTraderAvailable(): boolean;
  get traderLeavesIn(): number;
  get traderArrivesIn(): number;
  get minWidthForListItem(): "48%" | "150px";
  get chanceForPet(): number;
  get statueName(): any;
  get statueMedia(): any;
  get baseXPRate(): number;
  get currentPopulation(): number;
  get currentWorshipName(): any;
  get worshipPercent(): number;
  get worshipTier(): number;
  get deadStoragePercent(): number;
  get totalDead(): number;
  get availableDeadStorage(): number;
  get happinessPercent(): number;
  get maxHappiness(): number;
  get isCitizenAtMaxWorkerAge(): boolean;
  get citizensAtMaxWorkerAge(): any;
  get educationPercent(): number;
  get maxEducation(): number;
  get taxRate(): number;
  get populationGainRate(): number;
  get populationGainChance(): number;
  get deadDecayAmount(): number;
  get potionUsage(): number;
  get foodUsage(): number;
  getResourceQuantityFromData(resourceData: any): any;
  buildResourceItemConversions(): void;
  getErrorLog(): string;
  increaseTraderStockAvailable(): void;
  grantOfflineTicks(): void;
  toggleTickInterval(): void;
  encodeResource(writer: any, resource: any): void;
  encodeBiome(writer: any, biome: any): void;
  decodeResource(reader: any, version: any): void;
  decodeBiome(reader: any, version: any): void;
  deserialize(reader: any, version: any, idMap: any): void;
  deserializeCitizens(reader: any, version: any, idMap: any): void;
  deserializeTownData(reader: any, version: any, idMap: any): void;
  deserializeTownDataResources(reader: any, version: any, idMap: any): void;
  deserializeTownDataWorkers(reader: any, version: any, idMap: any): void;
  onResourceAmountChange(): void;
  renderTownStats(): void;
  renderResourceAmounts(): void;
  renderResourceRates(): void;
  renderWorkerCounts(): void;
  renderBuildingCosts(): void;
  renderBuildingRequirements(): void;
  renderTicksAvailable(): void;
  renderTownAge(): void;
  renderCitizens(): void;
  renderBuildingProvides(): void;
  renderTraderStockRemaining(): void;
  initTownCreation(): void;
  updateConvertType(type: any): void;
  updateGeneratedTownBreakdown(): void;
  confirmTownCreation(): void;
  regenerateTown(showConfirmation?: boolean): void;
  selectWorship(worship: any): void;
  worshipInSelection: any;
  confirmWorship(): void;
  preLoad(): void;
  postStatLoad(): void;
  postLoad(): void;
  onModifierChange(): void;
  onPageChange(): void;
  renderModifierChange(): void;
  tick(): boolean;
  catchupTicks(tickAmount: any, confirmed?: boolean): void;
  fireCatchupConfirmation(tickAmount: any): void;
  selectNewMapConfirmation(): void;
  deleteConfirmationSwal(): void;
  deleteTownshipDataFromLocalStorage(): void;
  resetTownshipLevel(): void;
  setBiomeCountsForMap(): void;
  generateStartingSection(grasslands: any): void;
  generateEmptyTown(grasslands: any): void;
  spawnInitialCitizens(): void;
  addNewCitizen(citizenSource: any): void;
  setBuildBiome(biome: any, jumpTo?: boolean): void;
  currentTownBiome: any;
  setTownBiome(biome: any, jumpTo?: boolean): void;
  updateForBiomeSelectChange(biome: any): void;
  setPriorityJob(job: any): void;
  setNextSectionQty(qty: any): void;
  setBuildQty(qty: any): void;
  updateBuildingsForQuantityChange(): void;
  getNextSectionCost(qty: any): number;
  getAvailableWorkers(): {
    total: number;
    unemployed: number;
  };
  computeBuildingTownStats(): void;
  computeTownStats(): void;
  computeWorshipAndStats(): void;
  recalculatePopOver55(): void;
  retroactiveCitizenAgeFix(): void;
  setCitizenAge(citizen: any, age: any): void;
  getCitizenAge(citizen: any): number;
  computeWorship(): boolean;
  getDeadStoragePerBuilding(building: any): any;
  getTotalDeadStorageForBuilding(building: any): any;
  computeTownDeadStorage(): void;
  computeTownHappiness(): void;
  applyBuildingHappinessPenalty(happiness: any): any;
  shouldApplyStatPenalty(penalty: any): boolean;
  getTownHappinessNegativeModifiers(): number;
  getFlatTownHappinessNegatives(): number;
  computeTownHealthPercent(): void;
  getHealthConditionPercent(bonus: any, positive: any, increasing: any): any;
  computeTownEducation(): void;
  computePopulationLimit(): void;
  computeBuildingStorage(): void;
  getMaxStorage(): number;
  getUsedStorage(): any;
  getTotalBuildingsInBiome(biome: any): number;
  modifyBuildingResourceCost(quantity: any): number;
  canAffordBuilding(building: any, qty?: number): any;
  subtractBuildingCosts(building: any, qty?: number): void;
  canBuildTierOfBuilding(building: any, notify?: boolean): boolean;
  canBuildInBiome(biome: any): boolean;
  buildBuilding(building: any): void;
  getAvailableBuildingSpaceInBiome(biome: any): number;
  removeBuildingFromBiome(biome: any, building: any, count?: number): number;
  addBuildingToBiome(biome: any, building: any, count?: number): number;
  destroyHalfCitizens(): void;
  confirmChangeOfWorship(): void;
  destroyAllWorshipBuildings(): void;
  destroyAllBuildings(): void;
  destroyBuilding(building: any, render?: boolean): void;
  removeBuilding(building: any, count?: number): boolean;
  removeOverflowingWorkers(building: any): void;
  computeModifiersFromBuildings(): void;
  computeProvidedStats(updatePlayer?: boolean): void;
  setModifiers(building: any): void;
  updateBuildingModifierData(building: any): void;
  updateAllBuildingModifierData(): void;
  updateForBuildingChange(): void;
  buyNewSectionOfLand(): void;
  addSectionOfLand(biome: any, qty: any): void;
  getGPGainRate(): number;
  getBuildingsWithResource(resource: any): any[];
  computeTownResourceGain(): void;
  getBiomeResourceProductionModifier(biome: any): number;
  getBuildingResourceProductionModifier(building: any): number;
  getSingleResourceGainAmountInBiome(
    resource: any,
    building: any,
    biome: any
  ): number;
  getResourceGainModifier(resource: any): number;
  getTrueResourceUsage(resource: any): number;
  getResourceUsage(resource: any): number;
  getResourceBiomeUsage(resource: any): number;
  getSingleResourceUsageInBiome(resource: any, biome: any): number;
  getAllBuildingWorkerCount(): any;
  computeMaxWorkerCounts(): void;
  computeMaxWorkerCount(job: any): void;
  countNumberOfBuildings(building: any): any;
  addWorker(citizen: any, job: any): void;
  removeWorker(citizen: any): void;
  assignCitizenToJob(citizen: any, job: any): void;
  removeCitizenFromJob(citizen: any): void;
  removeRandomCitizenFromJob(job: any): void;
  addPopulation(): void;
  getTrueMaxProductCreationAmount(
    resource: any,
    withoutModifiers?: boolean
  ): number;
  getMaxProductCreationAmount(
    resource: any,
    withoutModifiers?: boolean
  ): number;
  getMaxRawCreationAmount(resource: any): any;
  getNetResourceRate(resource: any): number;
  addResources(): void;
  getMaxResourceAmount(resource: any): number;
  applyRandomJobToCitizen(citizen: any): void;
  findAvailableJobForCitzen(): any;
  updateDeadStorage(): void;
  updateCitizens(): void;
  assignWorkersOnLoad(): void;
  updateCitizenInfo(citizen: any): void;
  checkCitizenRetirement(citizen: any): void;
  checkPopulationOverflow(): void;
  getChanceToDestroyCitizen(citizen: any): number;
  shouldWeKillThisCitizen(citizen: any): boolean;
  destroyCitizen(citizen: any, index: any): void;
  setResourceCap(resource: any, cap: any): void;
  processYeet(resource: any, amount: any): void;
  updateConvertQty(value: any): void;
  updateConvertToQty(value: any, resource: any, item: any): void;
  updateConvertFromQty(value: any, resource: any, item: any): void;
  getConvertToTownshipRatio(resource: any, item: any): number;
  getConvertFromTownshipRatio(resource: any, item: any): number;
  getBaseConvertToTownshipRatio(resource: any, item: any): number;
  getBaseConvertFromTownshipRatio(resource: any, item: any): number;
  processConversionToTownship(item: any, resource: any): void;
  processConversionFromTownship(item: any, resource: any): void;
  getMaxPossibleConvertToTownshipValue(): number;
  getMaxPossibleConvertFromTownshipValue(
    resource: any,
    convertRatio: any
  ): number;
}
declare class TownshipUI {
  constructor(township: any);
  township: any;
  currentPage: number;
  defaultElements: {
    btn: {
      town: HTMLElement;
      build: HTMLElement;
      convertResources: HTMLElement;
      yeetResources: HTMLElement;
      settings: HTMLElement;
      tasks: HTMLElement;
      citizens: HTMLElement;
    };
    div: {
      town: HTMLElement;
      build: HTMLElement;
      convertResources: HTMLElement;
      yeetResources: HTMLElement;
      citizens: HTMLElement;
      settings: HTMLElement;
      ticks: HTMLElement;
      mainInfo: HTMLElement;
      resources: HTMLElement;
      container: HTMLElement;
      worship: HTMLElement;
      currentWorshipModal: HTMLElement;
      worshipModal: HTMLElement;
      worshipModifiers: HTMLElement;
      worshipModifiersModal: HTMLElement;
      generateTown: HTMLElement;
      townBreakdown: HTMLElement;
      tasks: HTMLElement;
    };
    town: {
      population: HTMLElement;
      happiness: HTMLElement;
      education: HTMLElement;
      health: HTMLElement;
      worship: HTMLElement;
      deadStorage: HTMLElement;
      breakdown: {
        map: HTMLElement;
        worship: HTMLElement;
        worshipProgress: HTMLElement;
        boimesPurchased: HTMLElement;
        storage: HTMLElement;
        population: HTMLElement;
        availableWorkers: HTMLElement;
        deadStorage: HTMLElement;
        over55: HTMLElement;
        over70: HTMLElement;
      };
    };
    trader: {
      trader: HTMLElement;
      traderAvailable: HTMLElement;
      traderNotAvailable: HTMLElement;
      arrivesIn: HTMLElement;
      leavesIn: HTMLElement;
      noTradingPost: HTMLElement;
    };
    notifications: {
      build: {
        alert: HTMLElement;
        usage: HTMLElement;
        message: HTMLElement;
      };
      town: {
        alert: HTMLElement;
        usage: HTMLElement;
        message: HTMLElement;
        noResourceAlerts: HTMLElement;
        noFood: HTMLElement;
      };
      global: {
        noFood: HTMLElement;
        losingFood: HTMLElement;
        noPriority: HTMLElement;
        noStorage: HTMLElement;
      };
    };
    icon: {
      taskReady: HTMLElement;
    };
  };
  resourceDisplays: Map<any, any>;
  townBiomeSelectButtons: Map<any, any>;
  buildingsInTown: Map<any, any>;
  buildBiomeSelectOptions: Map<any, any>;
  buildBiomeSelectButtons: Map<any, any>;
  buildBuildings: Map<any, any>;
  conversionElements: Map<any, any>;
  worshipSelects: Map<any, any>;
  worshipSelectsModal: Map<any, any>;
  biomeNoResourceAlerts: Map<any, any>;
  capResourceElements: Map<any, any>;
  filterIconElements: Map<any, any>;
  sortList: {
    showAll: boolean[];
    buildingType: boolean[];
    resource: boolean[];
  };
  townViewTab: number;
  loadTownshipUI(): void;
  updateTownStats(): void;
  updateTownNotifications(): void;
  updateTicksAvailable(): void;
  getPageButton(page: any): HTMLElement;
  createBtnEvents(): void;
  createTickBtns(): void;
  showTownCreationDivs(): void;
  hideTownCreationDivs(): void;
  hideMainContainerDivs(): void;
  showMainContainerDivs(): void;
  updatePageHighlight(oldPage: any, newPage: any): void;
  showPage(pageID: any): void;
  updateTraderStatus(): void;
  traderLockedSwal(): void;
  updateTaskUI(category: any): void;
  generateTownBiomeData(): void;
  generateFilterIcons(): void;
  highlightFilterIcon(filter: any): void;
  filterBuildBoimes(filter: any): void;
  highlightBuildBuildingsWithFilter(filter: any): void;
  generateBiomeSelectionDropdown(): void;
  generateBiomeNoResourceAlerts(): void;
  toggleSortList(category: any, index: any): void;
  setSortListToDefault(): void;
  updateSortCheckbox(category: any, index: any): void;
  addDropdownDivider(): string;
  generateTownBiomeSummarySelection(): void;
  updateNextSectionCost(): void;
  updateDestroyDropdowns(): void;
  updateUpgradeDropdowns(): void;
  setUpgradeQty(qty: any): void;
  setDestroyQty(qty: any): void;
  shouldShowBuilding(building: any): boolean;
  updateBuildBuildingProvides(): void;
  updateBuildingsForBiomeSelection(): void;
  updateBuildBiomeSelectionNotifications(): void;
  updateTownBiomeSelectionNotifications(): void;
  getBuildingCostHTML(building: any, buildQty: any): string;
  getBuildingResourceUsage(building: any): string;
  updateBuildingCounts(): void;
  updateBuilding(building: any): void;
  setupTownTooltips(): void;
  displayWorshipTooltip(): string;
  displayXPInfo(): string;
  displayDeathInfo(): string;
  updatePopulation(): void;
  updateHappiness(): void;
  updateEducation(): void;
  updateHealth(): void;
  updateWorship(): void;
  updateDeathStorage(): void;
  showChangeWorshipSelection(): void;
  updateWorshipCountSpan(): void;
  getCurrentWorshipSpan(): any;
  getCurrentWorshipProgressSpan(): string;
  updateTimeAlive(): void;
  updateBiomeBreakdown(biome: any): void;
  createResourceBreakdownTable(): void;
  updateStorageBreakdown(): void;
  updateStorageBreakdownColour(): void;
  getStorageBreakdown(): string;
  updateDeathStorageBreakdown(): void;
  updateDeadStorageBreakdownColour(): void;
  getDeadStorageBreakdown(): string;
  updateResourceAmounts(): void;
  updateResourceTickBreakdown(): void;
  unhighlightBuildBiomeBtn(biome: any): void;
  highlightBuildBiomeBtn(biome: any): void;
  unhighlightTownBiomeBtn(biome: any): void;
  highlightTownBiomeBtn(biome: any): void;
  unhighlightPriorityWorkerBtn(job: any): void;
  highlightPriorityWorkerBtn(job: any): void;
  updateWorkerCounts(): void;
  updateWorkersAvailable(): void;
  getWorkersAvailableSpan(): string;
  displayAllCitizens(): void;
  getCitizenDetailsElement(age: any, count: any): string;
  shouldShowBuildingInTown(building: any): boolean;
  updateTownSummary(): void;
  updateAllBuildingUpgradeCosts(): void;
  updateBuildingUpgradeCosts(building: any): void;
  updateTownBuildingProvides(): void;
  displayTownSummary(): void;
  generateBuildBuildings(): void;
  updateBuildQtyButtons(oldQty: any, newQty: any): void;
  updateForBuildQtyChange(): void;
  updateAllBuildingRequirements(): void;
  updateAllBuildingCosts(): void;
  updateBuildingTotalModifierElement(building: any): void;
  updateBuildingTotalOutput(building: any): void;
  createWorshipSelection(): void;
  updateCurrentWorship(): void;
  isWorshipUnlocked(worship: any): any;
  updateWorshipSelection(): void;
  buildCapResourceElements(): void;
  buildYeetItemElement(): void;
  buildConvertItemElements(): void;
  updateConvertVisibility(): void;
  updateConvertQtyElements(): void;
  updateConvertTypeBtn(): void;
  showTaskReadyIcon(): void;
  hideTaskReadyIcon(): void;
  updateResourceCapElement(resource: any): void;
  showChangeWorshipSwal(): void;
  updateTotalBiomesPurchased(): void;
  highlightBiomesWithResource(resource: any): void;
  unhighlightBiomesWithResource(): void;
  highlightBiomesWithBuilding(building: any): void;
  unhighlightBiomesWithBuilding(): void;
  highlightBiomesWithBuildingBuilt(building: any): void;
  unhighlightBiomesWithBuildingBuilt(): void;
  highlightBiomesWith(provides: any): void;
  unhighlightBiomes(): void;
  setTownViewTab(tab: any): void;
  hideTownViewTab(tab: any): void;
  showTownViewTab(tab: any): void;
  showAllTownViewTabs(): void;
  hideAllTownViewTabs(): void;
  updateTraderStockAvailable(): void;
  toggleTownInfo(): void;
  toggleTownResources(): void;
}
declare namespace TownshipUI {
  const destroyBuildingOptions: number[];
  const upgradeBuildingOptions: number[];
  const yeetResourceOptions: number[];
  const resourceCapOptions: number[];
}
declare class TownshipData {
  constructor(township: any, game: any);
  township: any;
  game: any;
  happiness: number;
  education: number;
  healthPercent: number;
  buildingStorage: number;
  deadStorage: number;
  worshipCount: number;
  dead: number;
  sectionsPurchased: number;
  biomesUnlocked: number;
  townCreated: boolean;
  traderStock: number;
  worship: any;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  priorityJob: any;
  currentBuildBiome: any;
}
declare namespace townshipIcons {
  const population: string;
  const happiness: string;
  const education: string;
  const health: string;
  const storage: string;
  const dead: string;
  const worship: string;
  const workers: string;
  const showAll: string;
}
