declare class ConstellationMenu extends HTMLElement {
  stardustIcons: ItemCurrentIcon[];
  _content: DocumentFragment;
  image: any;
  name: any;
  skillIcons: any;
  skillIcon0: any;
  xpIcon: XPIcon;
  masteryIcon: MasteryXPIcon;
  masteryPoolIcon: MasteryPoolIcon;
  intervalIcon: IntervalIcon;
  progressBar: ProgressBar;
  studyButton: any;
  exploreButton: any;
  masteryDisplay: any;
  stardustBreakdown: any;
  viewModifierContainer: any;
  connectedCallback(): void;
  setConstellation(constellation: any): void;
  updateGrants(
    xp: any,
    masteryXP: any,
    masteryPoolXP: any,
    interval: any
  ): void;
  updateQuantities(): void;
  setExplored(): void;
  setUnexplored(): void;
}
declare class AstrologyModifierDisplay extends HTMLElement {
  _content: DocumentFragment;
  starImage: any;
  modifierContainer: any;
  modifierText: any;
  upgradeButton: any;
  starDustImage: any;
  starDustQuantity: any;
  modifierProgress: any;
  modifierStatus: {
    locked: any;
    active: any;
    inactive: any;
  };
  connectedCallback(): void;
  setStandard(): void;
  setUnique(): void;
  setMasteryLocked(level: any): void;
  setModifier(modifier: any, precision: any): void;
  setModifierStatus(buyCount: any, data: any): void;
  setModifierStatusLocked(data: any): void;
  setDustQuantity(quantity: any): void;
  setUpgradeCallback(callback: any): void;
  hideUpgradeButton(): void;
  showUpgradeButton(): void;
}
declare class AstrologyExplorationPanel extends HTMLElement {
  standardModifiers: any[];
  uniqueModifiers: any[];
  _content: DocumentFragment;
  standardModifierContainer: any;
  uniqueModifierContainer: any;
  connectedCallback(): void;
  setMaxStandardMods(amount: any): void;
  setMaxUniqueMods(amount: any): void;
  setUpgradeCosts(constellation: any): void;
  setStandardUpgradeCost(constellation: any, modID: any): void;
  setUniqueUpgradeCost(constellation: any, modID: any): void;
  setConstellation(constellation: any): void;
  setStandardModifier(id: any, modifier: any, precision: any): void;
  setStandardModifierStatus(id: any, buyCount: any, data: any): void;
  setStandardLocked(id: any, masteryLevel: any): void;
  setStandardLockedStatus(id: any, data: any): void;
  setUniqueModifier(id: any, modifier: any, precision: any): void;
  setUniqueModifierStatus(id: any, buyCount: any, data: any): void;
  setUniqueLocked(id: any, masteryLevel: any): void;
  setUniqueLockedStatus(id: any, data: any): void;
}
declare class AstrologyInformationPanel extends HTMLElement {
  _content: DocumentFragment;
  viewAllModifiersButton: any;
  stardustChance: ItemChanceIcon;
  goldenstardustChance: ItemChanceIcon;
  doublingChance: DoublingIcon;
  meteoriteChance: MeteoriteChanceIcon;
  initialize(game: any): void;
  connectedCallback(): void;
  setModifierCallback(astrology: any): void;
  updateChances(
    stardust: any,
    goldenStardust: any,
    doubling: any,
    meteorite: any
  ): void;
}
