declare class AstrologyModifier {
  constructor(data: any, game: any);
  modifiers: any;
  incrementValue: any;
  maxCount: any;
  costs: any;
}
declare class AstrologyRecipe extends BasicSkillRecipe {
  constructor(namespace: any, data: any, game: any);
  maxValueModifiers: number;
  _name: any;
  _media: any;
  skills: any;
  gpReward: any;
  scReward: any;
  itemRewards: any;
  standardModifiers: any;
  uniqueModifiers: any;
  masteryXPModifier: any;
  standardModsBought: any[];
  uniqueModsBought: any[];
  get name(): any;
  get media(): any;
}
declare class DummyAstrologyRecipe extends AstrologyRecipe {}
declare class Astrology extends GatheringSkill {
  constructor(namespace: any, game: any);
  _media: string;
  renderQueue: AstrologyRenderQueue;
  modifiers: MappedModifiers;
  masteryXPConstellations: any[];
  shouldRefundStardust: boolean;
  shouldRefundStardustAgain: boolean;
  newRefundDate: number;
  getTotalUnlockedMasteryActions(): any;
  get actionInterval(): number;
  get actionLevel(): any;
  get masteryAction(): any;
  get meteoriteChance(): number;
  get stardustChance(): number;
  get goldenStardustChance(): number;
  get activeConstellation(): any;
  starDustItem: any;
  goldenStardustItem: any;
  isModifierUnlocked(constellation: any, type: any, modID: any): boolean;
  isModifierBought(constellation: any, type: any, modID: any): boolean;
  refundStardust(): void;
  refundStardustAgain(): void;
  getConstellationInterval(constellation: any): number;
  getStardustQuantity(action: any): any;
  computeProvidedStats(updatePlayer?: boolean): void;
  preAction(): void;
  get actionRewards(): Rewards;
  postAction(): void;
  queueModifierRender(constellation: any, type: any, modId: any): void;
  getModifierElement(modifier: any, value: any): any;
  checkStardustCostsAndConsume(item: any, quantity: any): boolean;
  isStarMaxValue(constellation: any, type: any, modID: any): boolean;
  countMaxValuesInConstellation(constellation: any): number;
  onConstellationUpgrade(constellation: any, type: any, modID: any): void;
  getStandardModifierUpgradeCost(constellation: any, modID: any): any;
  getUniqueModifierUpgradeCost(constellation: any, modID: any): any;
  upgradeStandardModifier(constellation: any, modID: any): void;
  upgradeUniqueModifier(constellation: any, modID: any): void;
  get masteryModifiedInterval(): number;
  queueBankQuantityRender(item: any): void;
  onEquipmentChange(): void;
  unlockNewModifiers(constellation: any): void;
  onSkillUnlock(): void;
  unlockNewModifierOnLevelUp(oldLevel: any): void;
  onConstellationExplore(): void;
  renderProgressBar(): void;
  renderedProgressBar: any;
  renderStardustRates(): void;
  renderConstellationRates(): void;
  renderStardustQuantities(): void;
  renderExploredStandardMods(): void;
  renderExploredUniqueMods(): void;
  renderVisibleConstellations(): void;
  renderUpgradeCosts(): void;
  viewAllModifiersOnClick(): void;
  studyConstellationOnClick(constellation: any): void;
  studiedConstellation: any;
  exploreConstellationOnClick(constellation: any): void;
  exploredConstellation: any;
  rerollSpecificStandardModifierOnClick(constellation: any, modID: any): void;
  rerollSpecificUniqueModifierOnClick(constellation: any, modID: any): void;
  encodeAction(writer: any, recipe: any): void;
  decodeAction(reader: any, version: any): void;
  getActionIDFromOldID(oldActionID: any, idMap: any): any;
  setFromOldOffline(offline: any, idMap: any): void;
  rollForMeteorite(): void;
}
declare namespace Astrology {
  const standardModifierLevels: number[];
  const uniqueModifierLevels: number[];
  const standardModifierCosts: number[];
  const uniqueModifierCosts: number[];
  const baseStardustChance: number;
  const baseGoldenStardustChance: number;
  const baseInterval: number;
  const modifierMagnitudeChances: number[];
}
declare var AstrologyModifierType: any;
declare class AstrologyRenderQueue extends GatheringSkillRenderQueue {
  constellationRates: boolean;
  stardustQuantities: boolean;
  exploredStandardModifiers: Set<any>;
  exploredUniqueModifiers: Set<any>;
  stardustRates: boolean;
  visibleConstellations: boolean;
  rerollCosts: boolean;
}
