declare var __awaiter: any;
declare class Game {
  loopInterval: number;
  loopStarted: boolean;
  disableClearOffline: boolean;
  isUnpausing: boolean;
  previousTickTime: number;
  enableRendering: boolean;
  maxOfflineTicks: number;
  registeredNamespaces: NamespaceMap;
  dummyNamespaces: NamespaceMap;
  tickTimestamp: number;
  saveTimestamp: number;
  _isPaused: boolean;
  merchantsPermitRead: boolean;
  characterName: any;
  minibar: Minibar;
  petManager: PetManager;
  shop: Shop;
  itemCharges: ItemCharges;
  tutorial: Tutorial;
  potions: PotionManager;
  gp: GP;
  slayerCoins: SlayerCoins;
  raidCoins: RaidCoins;
  readNewsIDs: any[];
  lastLoadedGameVersion: string;
  completion: Completion;
  lore: Lore;
  eventManager: EventManager;
  dropWeightCache: Map<any, any>;
  refundedAstrology: boolean;
  refundedAstrologyAgain: boolean;
  renderQueue: {
    title: boolean;
    combatMinibar: boolean;
    activeSkills: boolean;
  };
  attackStyles: NamespaceRegistry;
  stackingEffects: NamespaceRegistry;
  specialAttacks: NamespaceRegistry;
  items: ItemRegistry;
  pages: NamespaceRegistry;
  actions: NamespaceRegistry;
  activeActions: NamespaceRegistry;
  passiveActions: NamespaceRegistry;
  _passiveTickers: any[];
  actionPageMap: Map<any, any>;
  skillPageMap: Map<any, any>;
  skills: NamespaceRegistry;
  masterySkills: NamespaceRegistry;
  monsters: NamespaceRegistry;
  monsterAreas: Map<any, any>;
  combatPassives: NamespaceRegistry;
  combatAreas: NamespaceRegistry;
  combatAreaDisplayOrder: NamespacedArray;
  slayerAreas: NamespaceRegistry;
  slayerAreaDisplayOrder: NamespacedArray;
  dungeons: NamespaceRegistry;
  dungeonDisplayOrder: NamespacedArray;
  combatEvents: NamespaceRegistry;
  prayers: NamespaceRegistry;
  standardSpells: NamespaceRegistry;
  curseSpells: NamespaceRegistry;
  auroraSpells: NamespaceRegistry;
  ancientSpells: NamespaceRegistry;
  archaicSpells: NamespaceRegistry;
  pets: NamespaceRegistry;
  gamemodes: NamespaceRegistry;
  steamAchievements: Map<any, any>;
  itemSynergies: Map<any, any>;
  randomGemTable: DropTable;
  randomSuperiorGemTable: DropTable;
  softDataRegQueue: any[];
  bank: Bank;
  normalAttack: SpecialAttack;
  itemEffectAttack: ItemEffectAttack;
  emptyEquipmentItem: EquipmentItem;
  emptyFoodItem: FoodItem;
  unknownCombatArea: CombatArea;
  decreasedEvasionStackingEffect: StackingEffect;
  activeActionPage: Page;
  currentGamemode: Gamemode;
  settings: Settings;
  stats: Statistics;
  combat: CombatManager;
  golbinRaid: RaidManager;
  attack: any;
  strength: any;
  defence: any;
  hitpoints: any;
  ranged: any;
  altMagic: any;
  prayer: any;
  slayer: any;
  woodcutting: any;
  fishing: any;
  firemaking: any;
  cooking: any;
  mining: any;
  smithing: any;
  thieving: any;
  farming: any;
  fletching: any;
  crafting: any;
  runecrafting: any;
  herblore: any;
  agility: any;
  summoning: any;
  astrology: any;
  township: any;
  get playerCombatLevel(): number;
  get isPaused(): boolean;
  get isGolbinRaid(): boolean;
  get modifiers(): PlayerModifiers;
  fetchAndRegisterDataPackage(url: any): any;
  registerDataPackage(dataPackage: any): void;
  queueForSoftDependencyReg(data: any, object: any): void;
  postDataRegistration(): void;
  registerAttackStyles(namespace: any, data: any): void;
  registerItemData(namespace: any, data: any): void;
  registerAttackData(namespace: any, data: any): void;
  registerStackingEffectData(namespace: any, data: any): void;
  registerCombatPassiveData(namespace: any, data: any): void;
  registerMonsterData(namespace: any, data: any): void;
  registerRandomMonsters(monsterIDs: any, monsterArray: any): void;
  registerCombatAreaData(namespace: any, data: any): void;
  registerSlayerAreaData(namespace: any, data: any): void;
  registerDungeonData(namespace: any, data: any): void;
  registerCombatEventData(namespace: any, data: any): void;
  registerPrayerData(namespace: any, data: any): void;
  registerStandardSpellData(namespace: any, data: any): void;
  registerCurseSpellData(namespace: any, data: any): void;
  registerAuroraSpellData(namespace: any, data: any): void;
  registerAncientSpellData(namespace: any, data: any): void;
  registerArchaicSpellData(namespace: any, data: any): void;
  registerPets(namespace: any, data: any): void;
  registerShopCategories(namespace: any, data: any): void;
  registerShopPurchases(namespace: any, data: any): void;
  registerShopUpgradeChains(namespace: any, data: any): void;
  registerItemSynergies(data: any): void;
  registerGamemodes(namespace: any, data: any): void;
  registerSteamAchievements(data: any): void;
  registerPages(namespace: any, data: any): void;
  registerSkill(namespace: any, constructor: any): any;
  applyDataModifications(modificationData: any): void;
  getPlayerModifiersFromData(data: any): {};
  getRequirementFromData(data: any): any;
  getDungeonRequirement(data: any): {
    type: any;
    dungeon: any;
    count: any;
  };
  getLevelRequirement(data: any): {
    type: any;
    skill: any;
    level: any;
  };
  getSlayerItemRequirement(data: any): {
    type: any;
    item: any;
  };
  getItemFoundRequirement(data: any): {
    type: any;
    item: any;
  };
  getMonsterKilledRequirement(data: any): {
    type: any;
    monster: any;
    count: any;
  };
  getShopPurchaseRequirement(data: any): {
    type: any;
    purchase: any;
    count: any;
  };
  getTownshipBuildingRequirement(data: any): {
    type: any;
    building: any;
    count: any;
  };
  getAllSkillLevelRequirement(data: any): {
    type: string;
    level: any;
  };
  getSlayerTaskRequirement(data: any): {
    type: string;
    tier: any;
    count: any;
  };
  getCompletionRequirement(data: any): {
    type: string;
    percent: any;
    namespace: any;
  };
  getDummyData(fullID: any): {
    dataNamespace: any;
    localID: any;
  };
  constructDummyObject(id: any, constructor: any): any;
  startMainLoop(): void;
  stopMainLoop(): void;
  pauseActiveSkill(fromBlur?: boolean): void;
  pausedAction: any;
  activeAction: any;
  unpauseActiveSkill(fromFocus?: boolean): any;
  idleChecker(action: any): boolean;
  stopActiveAction(): void;
  onLoad(): void;
  processTime(): void;
  runTicks(ticksToRun: any): void;
  tick(): void;
  queueRequirementRenders(): void;
  render(): void;
  renderGameTitle(): void;
  renderCombatMinibar(): void;
  renderActiveSkills(): void;
  loop(): void;
  getErrorLog(error: any, title: any): string;
  showBrokenGame(error: any, title: any): void;
  clearActiveAction(save?: boolean): void;
  getOfflineTimeDiff(): {
    timeDiff: number;
    originalTimeDiff: number;
  };
  processOffline(): Promise<any>;
  snapShotOffline(): {
    gp: number;
    slayercoins: number;
    prayerPoints: number;
    experience: Map<any, any>;
    levels: Map<any, any>;
    food: {
      item: any;
      quantity: any;
    }[];
    equipment: Map<any, any>;
    bank: Map<any, any>;
    loot: Map<any, any>;
    monsterKills: Map<any, any>;
    dungeonCompletion: Map<any, any>;
    taskCompletions: number[];
    summoningMarks: any;
    itemCharges: Map<any, any>;
    cookingStockpile: any;
    meteorite: {
      totalFound: any;
      hpFound: any;
    };
    onyxNode: {
      totalFound: any;
      hpFound: any;
    };
    orichaNode: {
      totalFound: any;
      hpFound: any;
    };
    ceruleanNode: {
      totalFound: any;
      hpFound: any;
    };
  };
  createOfflineModal(oldSnapshot: any, timeDiff: any): string;
  resetOfflineTracking(): void;
  testForOffline(timeToGoBack: any): any;
  testCombatInitializationStatParity(): void;
  generateSaveString(): string;
  getHeaderFromSaveString(saveString: any): any;
  getSaveHeader(): {
    saveVersion: number;
    characterName: any;
    currentGamemode: Gamemode;
    totalSkillLevel: any;
    gp: number;
    offlineAction: any;
    tickTimestamp: number;
    saveTimestamp: number;
    activeNamespaces: any[];
  };
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  deserialize(reader: any, version: any, idMap: any): void;
  getLootTableWeight(table: any): any;
  getItemFromLootTable(table: any): {
    itemID: any;
    qty: any;
  };
  getSkillUnlockCount(): number;
  getSkillUnlockCost(): any;
  checkSkillRequirement(requirement: any, notifyOnFailure?: boolean): boolean;
  checkAllSkillLevelRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkDungeonRequirement(requirement: any, notifyOnFailure?: boolean): boolean;
  checkCompletionRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkSlayerItemRequirement(
    requirement: any,
    notifyOnFailure?: boolean,
    slayerLevelReq?: number
  ): boolean;
  checkShopPurchaseRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkSlayerTaskRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkItemFoundRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkMonsterKilledRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkTownshipTaskRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkTownshipTutorialTaskRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkTownshipBuildingRequirement(
    requirement: any,
    notifyOnFailure?: boolean
  ): boolean;
  checkRequirement(
    requirement: any,
    notifyOnFailure?: boolean,
    slayerLevelReq?: number
  ): boolean;
  checkRequirements(
    requirements: any,
    notifyOnFailure?: boolean,
    slayerLevelReq?: number
  ): any;
  isItemOwned(item: any): boolean;
  getMonsterArea(monster: any): any;
  getPageForAction(action: any): any;
  getPageForActiveAction(): any;
  getPagesForSkill(skill: any): any;
  constructEventMatcher(
    data: any
  ):
    | WoodcuttingActionEventMatcher
    | FishingActionEventMatcher
    | FiremakingActionEventMatcher
    | BonfireLitEventMatcher
    | CookingActionEventMatcher
    | MiningActionEventMatcher
    | SmithingActionEventMatcher
    | ThievingActionEventMatcher
    | FarmingPlantActionEventMatcher
    | FarmingHarvestActionEventMatcher
    | FletchingActionEventMatcher
    | CraftingActionEventMatcher
    | RunecraftingActionEventMatcher
    | HerbloreActionEventMatcher
    | AgilityActionEventMatcher
    | SummoningActionEventMatcher
    | AstrologyActionEventMatcher
    | AltMagicActionEventMatcher
    | MonsterDropEventMatcher
    | PlayerAttackEventMatcher
    | EnemyAttackEventMatcher
    | FoodEatenEventMatcher
    | PrayerPointConsumptionEventMatcher
    | PlayerHitpointRegenerationMatcher
    | PlayerSummonAttackEventMatcher
    | RuneConsumptionEventMatcher
    | PotionUsedEventMatcher
    | PotionChargeUsedEventMatcher
    | MonsterKilledEventMatcher
    | ItemEquippedEventMatcher
    | FoodEquippedEventMatcher
    | ShopPurchaseMadeEventMatcher
    | SummonTabletUsedEventMatcher;
  processEvent(event: any, interval?: number): void;
  checkSteamAchievements(): void;
  isAchievementMet(achievement: any): any;
  setupCurrentGamemode(): void;
  getItemFromOldID(itemID: any, idMap: any): any;
  convertFromOldFormat(save: any, idMap: any): void;
  convertOldOffline(offline: any, idMap: any): void;
}
