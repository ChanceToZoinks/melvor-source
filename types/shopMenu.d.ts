declare class ShopCostsAndUnlock {
  constructor(purchase: any, game: any, costContainer: any);
  purchase: any;
  game: any;
  costContainer: any;
  requirementElements: any[];
  costElements: any[];
  get buyQty(): any;
  updatePurchaseRequirements(): void;
  updateCostElements(): void;
  setToBuyLimit(): void;
  destroy(): void;
  createPurchaseRequirements(): void;
  createCostElements(): void;
  setElementMet(element: any, met: any): void;
  setUnlockElementMet(element: any, met: any): void;
  updateCostElement(element: any, met: any, amount: any): void;
  getCostQty(amount: any): any;
  isGPCostMet(amount: any): any;
  isSlayerCoinCostMet(amount: any): any;
  isItemCostMet(item: any, baseQty: any): boolean;
  isRaidCoinCostMet(amount: any): any;
  getTextClass(met: any): "text-success" | "text-danger";
  getSlayerTaskUnlockText(requirement: any): any;
  createUnlockElement(
    costNodes: any,
    met: any
  ): {
    parent: any;
    cost: any;
  };
  createImage(media: any): any;
  createCostElement(
    media: any,
    qty: any,
    met: any,
    tooltipText: any
  ): {
    image: any;
    cost: any;
    tooltip: any;
  };
}
declare class ShopConfirmModalItem extends ShopCostsAndUnlock {
  constructor(purchase: any, game: any);
  buyChargeQty: any;
  parent: any;
  updateForQuantityChange(): void;
}
declare class ShopItem extends ShopCostsAndUnlock {
  parent: any;
  container: any;
  image: any;
  mediaBody: any;
  itemChargeDescription: {
    container: any;
    owned: any;
    ownedCharges: any;
  };
  name: any;
  buyChargeQty: any;
  description: any;
  currentDescription: any;
  updateItemChargeDescription(): void;
  updateCurrentDescription(): void;
  updateForBuyQtyChange(): void;
}
declare class QuickBuyItem extends ShopItem {
  quantityMenu: ShopBuyQuantityMenu;
}
declare class ShopBuyQuantityMenu {
  constructor(parent: any, buyOptions?: number[]);
  parent: any;
  container: any;
  button: any;
  input: any;
  destroy(): void;
  createBuyOption(value: any): any;
  onCustomChange(): void;
}
declare namespace ShopBuyQuantityMenu {
  const menuCount: number;
}
declare class ShopTabMenu {
  constructor(parent: any, _category: any, game: any);
  parent: any;
  _category: any;
  game: any;
  items: Map<any, any>;
  isOpen: boolean;
  purchases: any;
  icon: any;
  hideBlock: any;
  itemsContainer: any;
  get category(): any;
  updateItemSelection(): void;
  updatePurchaseCosts(): void;
  updateForBuyQtyChange(): void;
  updatePurchaseRequirements(): void;
  updateForItemChargeChange(): void;
  updateCurrentItemDescription(purchase: any): void;
  shouldShowItem(purchase: any): 0 | 1 | 2;
  createHeader(): any;
  qtyMenu: ShopBuyQuantityMenu;
  toggle(): void;
}
declare class ShopMenu {
  constructor(game: any, containerID?: string, quickBuyID?: string);
  game: any;
  categorySelects: Map<any, any>;
  tabs: Map<any, any>;
  shownTabs: Set<any>;
  container: HTMLElement;
  quickbuyContainer: HTMLElement;
  quickBuyButton: HTMLElement;
  quickbuyMenu: QuickBuyItem;
  createShopTab(category: any): {
    menu: ShopTabMenu;
    container: any;
  };
  updateItemPostPurchase(purchase: any): void;
  updateForCostChange(): void;
  updateForRequirementChange(): void;
  updateForItemChargeChange(): void;
  updateForBuyQtyChange(): void;
  showTab(category: any): void;
  hideTab(category: any): void;
  showCategoryButton(category: any): void;
  hideCategoryButton(category: any): void;
  showAllTabsButRaid(): void;
  showAllRaidTabs(): void;
  hideAllTabs(): void;
  showSingleTab(category: any): void;
  changeQuickBuyItem(purchase: any): void;
  updateQuickBuy(): void;
  showConfirmBuyPrompt(purchase: any): void;
  confirmBuyItem: ShopConfirmModalItem;
}
