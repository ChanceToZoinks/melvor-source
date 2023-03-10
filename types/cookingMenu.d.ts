declare class CookingMenu extends ContainedComponent {
  constructor(category: any, parentID: any);
  category: any;
  productQty: number;
  container: any;
  contentRow: any;
  upgradeImage: any;
  upgradeName: any;
  selectRecipeButton: any;
  selectedRecipeCont: any;
  productImage: any;
  productCount: any;
  productTooltip: any;
  productName: any;
  productHealing: any;
  productHP: any;
  requires: RequiresBox;
  grants: GrantsBox;
  mastery: any;
  haves: HavesBox;
  bonuses: CookingBonusBox;
  activeCookButton: any;
  passiveCookButton: any;
  activeCookInterval: any;
  passiveCookInterval: any;
  progressBar: ProgressBar;
  stockPileIcon: CookingStockpileIcon;
  stockPileButton: any;
  activeCookCallback(): void;
  passiveCookCallback(): void;
  stockPileCallback(): void;
  localize(): void;
  setStockPile(item: any): void;
  updateUpgrade(): void;
  setRecipeSelectButtonDisabled(disable: any): void;
  setSelected(): void;
  getOwnedTooltipContent(normalQty: any, percectQty: any): string;
  setSelectedRecipe(recipe: any, cooking: any): void;
  setRecipeRates(recipe: any, cooking: any): void;
  setBonusValues(
    preservation: any,
    doubling: any,
    perfectCook: any,
    success: any
  ): void;
  updateQuantities(recipe: any): void;
  setProgressPassive(): void;
  renderActiveProgress(timer: any): void;
  stopProgressBar(): void;
}
declare class CookingRecipeSelection extends HTMLElement {
  quantityIcons: any[];
  _content: DocumentFragment;
  productImage: any;
  masteryLevel: any;
  masteryPercent: any;
  productName: any;
  selectButton: any;
  iconContainer: any;
  cookingXP: any;
  healingAmount: any;
  intervalIcon: IntervalIcon;
  connectedCallback(): void;
  disconnectedCallback(): void;
  setRecipe(recipe: any, cooking: any): void;
  updateRates(recipe: any): void;
  updateMastery(recipe: any, cooking: any): void;
  updateQuantities(recipe: any): void;
}
declare class LockedCookingRecipe extends HTMLElement {
  _content: DocumentFragment;
  lockedText: any;
  connectedCallback(): void;
  setRecipe(recipe: any): void;
}
