declare class SkillRenderQueue {
  xp: boolean;
  level: boolean;
  xpCap: boolean;
  previousLevel: number;
  lock: boolean;
}
declare class Skill extends NamespacedObject {
  constructor(namespace: any, id: any, game: any);
  game: any;
  pets: any[];
  rareDrops: any[];
  minibarOptions: {
    defaultItems: Set<any>;
    upgrades: any[];
    pets: any[];
  };
  milestones: SkillMasteryMilestone[];
  _level: number;
  _xp: number;
  _unlocked: boolean;
  get level(): number;
  get xp(): number;
  get nextLevelProgress(): number;
  get name(): any;
  get media(): any;
  get hasMastery(): boolean;
  get isCombat(): boolean;
  get hasMinibar(): boolean;
  sortMilestones(): void;
  get virtualLevel(): number;
  get levelCap(): 99 | 120;
  get startingLevel(): number;
  get tutorialLevelCap(): number;
  get isUnlocked(): boolean;
  getItemForRegistration(id: any): any;
  onLoad(): void;
  render(): void;
  renderXP(): void;
  renderLevel(): void;
  renderLockStatus(): void;
  fireLevelUpModal(previousLevel: any): void;
  getNewMilestoneHTML(previousLevel: any): string;
  renderXPCap(): void;
  addXP(amount: any, masteryAction: any): boolean;
  capXPForTutorial(): void;
  capXPForGamemode(): void;
  levelUp(): void;
  modifyXP(amount: any, masteryAction: any): any;
  getXPModifier(masteryAction: any): number;
  getUncappedDoublingChance(action: any): number;
  getDoublingChance(action: any): number;
  getGPModifier(action: any): number;
  setXP(value: any): void;
  setUnlock(isUnlocked: any): void;
  unlockOnClick(): void;
  rollForPets(interval: any): void;
  onLevelUp(oldLevel: any, newLevel: any): void;
  rollForRareDrops(level: any, rewards: any): void;
  getRareDropChance(level: any, chance: any): any;
  openMilestoneModal(): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  convertOldXP(xp: any): void;
  registerData(namespace: any, data: any): void;
  postDataRegistration(): void;
  testTranslations(): void;
}
declare class MasteryLevelUnlock {
  constructor(data: any, skill: any);
  skill: any;
  _descriptionID: any;
  _description: any;
  level: any;
  get description(): any;
}
declare class MasterySkillRenderQueue extends SkillRenderQueue {
  constructor(...args: any[]);
  actionMastery: Set<any>;
  masteryPool: boolean;
}
declare class SkillWithMastery extends Skill {
  actions: NamespaceRegistry;
  actionMastery: Map<any, any>;
  _masteryPoolXP: number;
  sortedMasteryActions: any[];
  masteryLevelUnlocks: any[];
  totalMasteryActions: CompletionMap;
  _totalCurrentMasteryLevel: CompletionMap;
  totalUnlockedMasteryActions: number;
  get masteryLevelCap(): number;
  get masteryPoolCapPercent(): any;
  get baseMasteryPoolCap(): number;
  get masteryPoolCap(): number;
  get masteryPoolXP(): number;
  get masteryTokenChance(): number;
  onPageChange(): void;
  renderModifierChange(): void;
  onModifierChange(): void;
  renderActionMastery(): void;
  renderMasteryPool(): void;
  levelUpMasteryWithPoolXP(action: any, levels: any): void;
  exchangePoolXPForActionXP(action: any, xpToAdd: any): void;
  addMasteryForAction(action: any, interval: any): void;
  addMasteryXP(action: any, xp: any): boolean;
  onMasteryLevelUp(action: any, oldLevel: any, newLevel: any): void;
  fireMaximumMasteryModal(): void;
  onMasteryPoolBonusChange(oldBonusLevel: any, newBonusLevel: any): void;
  wasPoolBonusChanged(
    oldBonusLevel: any,
    newBonusLevel: any,
    tier: any
  ): boolean;
  addMasteryPoolXP(xp: any): void;
  isPoolTierActive(tier: any): boolean;
  getPoolBonusChange(xp: any): number;
  getMasteryCheckPointLevel(xp: any): number;
  updateTotalCurrentMasteryLevel(): void;
  get totalCurrentMasteryLevel(): number;
  getTotalCurrentMasteryLevels(namespace: any): any;
  getMaxTotalMasteryLevels(namespace: any): number;
  addTotalCurrentMasteryToCompletion(completion: any): void;
  get trueMaxTotalMasteryLevel(): number;
  get totalMasteryXP(): number;
  get trueTotalMasteryActions(): number;
  get masteryPoolProgress(): number;
  getMasteryXPToAddForAction(action: any, interval: any): number;
  getMasteryXPToAddToPool(xp: any): number;
  getMasteryXPModifier(action: any): number;
  getMasteryLevel(action: any): any;
  getMasteryXP(action: any): any;
  get isAnyMastery99(): boolean;
  getFlatIntervalModifier(action: any): number;
  getPercentageIntervalModifier(action: any): number;
  modifyInterval(interval: any, action: any): number;
  masteryToken: any;
  toStrang: any;
  computeTotalMasteryActions(): void;
  getMasteryProgress(action: any): {
    xp: any;
    level: any;
    percent: number;
    nextLevelXP: number;
  };
  updateMasteryDisplays(action: any): void;
  openSpendMasteryXPModal(): void;
  openMasteryLevelUnlockModal(): void;
  openMasteryPoolBonusModal(): void;
  convertOldMastery(oldMastery: any, idMap: any): void;
}
declare class GatheringSkill extends SkillWithMastery {
  constructor(...args: any[]);
  actionTimer: Timer;
  isActive: boolean;
  shouldResetAction: boolean;
  get activeSkills(): GatheringSkill[];
  get canStop(): boolean;
  get masteryLevel(): any;
  get currentActionInterval(): number;
  get isPotionActive(): any;
  get activePotion(): any;
  activeTick(): void;
  getErrorLog(): string;
  start(): boolean;
  stop(): boolean;
  onStop(): void;
  startActionTimer(): void;
  action(): void;
  addActionRewards(): boolean;
  addMasteryToken(rewards: any): void;
  addCommonRewards(rewards: any): void;
  addMasteryXPReward(): void;
  resetActionState(): void;
  deserialize(reader: any, version: any, idMap: any): void;
}
declare class CraftingSkill extends GatheringSkill {
  get actionPreservationChance(): number;
  getPreservationChance(action: any, chance: any): number;
  getPreservationCap(): number;
}
declare class DummyActiveAction extends NamespacedObject {
  constructor(dummyData: any);
  isActive: boolean;
  get name(): string;
  get media(): any;
  get activeSkills(): any[];
  getErrorLog(): string;
  stop(): boolean;
  activeTick(): void;
}
declare class BasicSkillRecipe extends MasteryAction {
  baseExperience: any;
  level: any;
}
declare class SingleProductRecipe extends BasicSkillRecipe {
  constructor(namespace: any, data: any, game: any);
  product: any;
  get name(): any;
  get media(): any;
}
declare class SkillCategory extends NamespacedObject {
  constructor(namespace: any, data: any, skill: any);
  skill: any;
  _name: any;
  _media: any;
  get media(): any;
  get name(): any;
}
declare class GatheringSkillRenderQueue extends MasterySkillRenderQueue {
  progressBar: boolean;
}
declare class Costs {
  constructor(game: any);
  game: any;
  _items: Map<any, any>;
  _gp: number;
  _sc: number;
  _raidCoins: number;
  get gp(): number;
  get sc(): number;
  get raidCoins(): number;
  addItemByID(itemID: any, quantity: any): void;
  addItem(item: any, quantity: any): void;
  addGP(amount: any): void;
  addSlayerCoins(amount: any): void;
  addRaidCoins(amount: any): void;
  getItemQuantityArray(): any[];
  recordGPStat(tracker: any, stat: any): void;
  recordSCStat(tracker: any, stat: any): void;
  recordBulkItemStat(tracker: any, stat: any): void;
  recordBulkItemValueStat(tracker: any, stat: any): void;
  recordIndividualItemStat(stat: any): void;
  reset(): void;
  checkIfOwned(): boolean;
  consumeCosts(): void;
}
declare class Rewards extends Costs {
  constructor(...args: any[]);
  _xp: Map<any, any>;
  addXP(skill: any, amount: any): void;
  getXP(skill: any): any;
  giveRewards(): boolean;
  forceGiveRewards(): boolean;
}
