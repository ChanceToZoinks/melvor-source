declare class WoodcuttingTreeMenu extends ContainedComponent {
  constructor(tree: any, woodcutting: any, before: any);
  tree: any;
  woodcutting: any;
  container: any;
  button: any;
  cutText: any;
  treeName: any;
  xpText: any;
  intervalText: any;
  progressBar: any;
  mastery: MasteryDisplay;
  localize(): void;
  updateRates(): void;
  setActive(): void;
  setInactive(): void;
}
declare class WoodcuttingMenu {
  constructor(woodcutting: any);
  woodcutting: any;
  treeMenus: Map<any, any>;
  progressBar: ProgressBar;
  infoMessage: HTMLElement;
  grantsContainer: HTMLElement;
  lockedTree: HTMLElement;
  nextLevelText: HTMLElement;
  shopItemPurchased: HTMLElement;
  treeGrants: any[];
  selectedTrees: Set<any>;
  lowerGrants: any;
  xpIcon: XPIcon;
  poolXPIcon: MasteryPoolIcon;
  intervalIcon: IntervalIcon;
  localize(): void;
  updateTreeRates(): void;
  updateTreeUnlocks(): void;
  setTrees(trees: any): void;
  destroyTreeGrants(treeGrant: any): void;
  updateSelectedTrees(): void;
}
