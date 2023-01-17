declare class RaidManager extends BaseManager {
  constructor(game: any, namespace: any);
  activeSkills: any[];
  randomPlayerModifiers: any[];
  randomEnemyModifiers: any[];
  player: RaidPlayer;
  state: any;
  selectedDifficulty: any;
  _setDifficulty: any;
  enemy: Golbin;
  bank: GolbinRaidBank;
  bannedItems: Set<any>;
  bannedPassiveItems: Set<any>;
  crateItems: any[];
  golbinPassives: any[];
  startingWeapons: any[];
  startingRunes: any[];
  itemSelection: {
    weapons: any[][];
    armour: any[][];
    ammo: any[][];
    runes: any[][];
    food: any[][];
    passives: any[][];
  };
  exclusiveItemSelection: {
    weapons: any[][];
    armour: any[][];
    ammo: any[][];
    runes: any[][];
    food: any[][];
    passives: any[][];
  };
  itemLevelBrackets: number[];
  wave: number;
  waveProgress: number;
  killCount: number;
  specialAttackSelection: any[];
  isFightingITMBoss: boolean;
  onSlayerTask: boolean;
  startTimestamp: number;
  endTimestamp: number;
  ownedCrateItems: Set<any>;
  randomModifiersBeingSelected: any[];
  isSelectingPositiveModifier: boolean;
  itemsBeingSelected: {
    weapons: any[];
    armour: any[];
    ammo: any[];
    runes: any[];
    food: any[];
    passives: any[];
  };
  itemCategoryBeingSelected: string;
  posModsSelected: number;
  negModsSelected: number;
  isPaused: boolean;
  history: any[];
  toggleOffSelectors: string[];
  toggleOnSelectors: string[];
  prayerUnlockedSelectors: string[];
  get media(): any;
  get name(): any;
  get canStop(): boolean;
  get areaType(): any;
  get difficulty(): any;
  get waveLength(): number;
  get fightingBoss(): boolean;
  get waveBracket(): number;
  get waveSkipCost(): number;
  get coinsEarned(): number;
  get canInteruptAttacks(): boolean;
  get areaRequirements(): any[];
  get slayerAreaLevelReq(): number;
  get playerAreaModifiers(): {};
  get enemyAreaModifiers(): {};
  get ignoreSpellRequirements(): boolean;
  get raidRunning(): boolean;
  get cratesPurchased(): number;
  registerData(data: any): void;
  startingFood: any;
  startingAmmo: any;
  activeTick(): void;
  onPageChange(): void;
  preStartRaid(): void;
  resetModsSelected(): void;
  resetModifiers(): void;
  fireStateModals(): void;
  startRaid(): void;
  updateSkipCost(): void;
  pause(): void;
  unpause(): void;
  pauseGame(): void;
  resumeGame(): void;
  onLoad(): void;
  toggleUIOff(): void;
  toggleUIOn(): void;
  skipWave(): void;
  recordRaidHistory(): void;
  postDataRegistration(): void;
  computeItemSelection(): void;
  getItemSelection(category: any): any[];
  getCategoryQuantity(category: any): number;
  getItemChoices(
    category: any,
    count: any
  ): {
    item: any;
    quantity: number;
    isAlt: boolean;
  }[];
  createNewEnemy(): void;
  fireCategorySelectModal(): void;
  closeModalAndPause(): void;
  continueRaid(): void;
  addRunesCallback(item: any, quantity: any): void;
  addFoodCallback(item: any, quantity: any): void;
  equipItemCallback(item: any, quantity: any, isAlt: any): void;
  rerollPassiveCallback(): void;
  addExistingRunesCallback(quantity: any): void;
  selectNothingCallback(): void;
  showEquipmentSelectionModal(category: any): void;
  setEquipmentSelection(category: any): void;
  fireItemSelectModal(): void;
  getEquipmentSelectionNodes(selection: any): any[];
  getRuneSelectionNodes(selection: any): any[];
  getFoodSelectionNodes(selection: any): any[];
  renderLocation(): void;
  renderStartMenu(): void;
  setDefaultEquipment(): void;
  changeDifficulty(newDifficulty: any): void;
  renderDifficulty(): void;
  rollForCrateItem(): any;
  openGolbinCrate(): void;
  fireCrateModal(crateItem: any): void;
  setRandomModifierSelection(isPositive: any, amount?: number): void;
  fireRandomModifierSelection(): void;
  fireViewModifiersModal(): void;
  selectRandomModifier(index: any): void;
  continueModifierSelection(): void;
  convertFromOldFormat(save: any, idMap: any): void;
  getGolbinRaidHistory(historyID: any): string;
  loadHistory(): void;
}
declare namespace RaidManager {
  const difficulties: {
    0: {
      combatTriangle: number;
      coinMultiplier: number;
      enemyHPModifier: number;
      enemyAccuracyModifier: number;
      enemyMaxHitModifier: number;
      enemyEvasionModifier: number;
      negativeModifierCount: number;
      positiveModifierCount: number;
      selectedClass: string;
      unselectedClass: string;
      hasSecondPassiveChange: boolean;
      readonly name: any;
    };
    1: {
      combatTriangle: number;
      coinMultiplier: number;
      enemyHPModifier: number;
      enemyAccuracyModifier: number;
      enemyMaxHitModifier: number;
      enemyEvasionModifier: number;
      negativeModifierCount: number;
      positiveModifierCount: number;
      selectedClass: string;
      unselectedClass: string;
      hasSecondPassiveChange: boolean;
      readonly name: any;
    };
    2: {
      combatTriangle: number;
      coinMultiplier: number;
      enemyHPModifier: number;
      enemyAccuracyModifier: number;
      enemyMaxHitModifier: number;
      enemyEvasionModifier: number;
      negativeModifierCount: number;
      positiveModifierCount: number;
      selectedClass: string;
      unselectedClass: string;
      hasSecondPassiveChange: boolean;
      readonly name: any;
    };
  };
  const possibleModifiers: (
    | {
        key: string;
        multiplier?: undefined;
      }
    | {
        key: string;
        multiplier: number;
      }
  )[];
}
declare var RaidItemSelectionID: any;
declare var RaidDifficulty: any;
declare var RaidState: any;
