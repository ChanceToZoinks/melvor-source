declare function isShopCostZero(cost: any): boolean;
declare class ShopCategory extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  isGolbinRaid: any;
  _name: any;
  _media: any;
  get name(): any;
  get media(): any;
}
declare class ShopPurchase extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  purchaseRequirements: any[];
  _buyLimitOverrides: Map<any, any>;
  _media: any;
  category: any;
  contains: {
    items: any;
  };
  costs: {
    gp: any;
    slayerCoins: any;
    raidCoins: any;
    items: any;
  };
  unlockRequirements: any;
  _defaultBuyLimit: any;
  allowQuantityPurchase: any;
  showBuyLimit: any;
  currentDescription: any;
  _customName: any;
  _customDescription: any;
  get media(): any;
  get name(): any;
  get description(): any;
  registerSoftDependencies(data: any, game: any): void;
  applyDataModification(modData: any, game: any): void;
  getBuyLimit(gamemode: any): any;
  getTemplatedDescription(shop: any): any;
  getDescriptionTemplateData(buyQuantity: any): {
    qty: any;
  };
}
declare class DummyShopPurchase extends ShopPurchase {}
declare class ShopUpgradeChain extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  rootUpgrade: any;
  _chainName: any;
  _defaultName: any;
  _defaultDescription: any;
  nameLang: any;
  descriptionLang: any;
  chainNameLang: any;
  get chainName(): any;
  get defaultName(): any;
  get defaultDescription(): any;
  applyDataModification(modData: any, game: any): void;
}
declare class ShopRenderQueue {
  requirements: boolean;
  costs: boolean;
  upgrades: boolean;
}
declare class Shop {
  constructor(game: any);
  game: any;
  modifiers: MappedModifiers;
  raidStats: {
    modifiers: MappedModifiers;
  };
  upgradesPurchased: Map<any, any>;
  buyQuantity: number;
  purchasesByItem: Map<any, any>;
  renderQueue: ShopRenderQueue;
  purchases: NamespaceRegistry;
  upgradeChains: NamespaceRegistry;
  purchaseDisplayOrder: NamespacedArray;
  categories: NamespaceRegistry;
  categoryDisplayOrder: NamespacedArray;
  onLoad(): void;
  render(): void;
  renderCosts(): void;
  renderRequirements(): void;
  renderUpgrades(): void;
  initUpgradeChainDisplays(): void;
  postDataRegistration(): void;
  getTotalUpgradesPurchased(golbinRaid: any): number;
  isUpgradePurchased(upgrade: any): boolean;
  getPurchaseCount(purchase: any): any;
  isPurchaseAtBuyLimit(purchase: any): boolean;
  getQuickBuyPurchase(item: any): any;
  getLowestUpgradeInChain(purchase: any): any;
  getTotalModifierInChain(purchase: any): MappedModifiers;
  capPurchaseQuantity(purchase: any, buyQuantity: any): number;
  getPurchaseCosts(purchase: any, quantity: any): Costs;
  quickBuyItemOnClick(purchase: any): void;
  buyItemOnClick(purchase: any, confirmed?: boolean): void;
  updateBuyQuantity(quantity: any): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  computeProvidedStats(updatePlayers?: boolean): void;
  getCurrencyCost(cost: any, buyQuantity: any, boughtQuantity: any): number;
  getCurrentDescription(purchase: any): any;
  convertFromOldFormat(save: any, idMap: any): void;
  removePurchasesAboveLimit(): void;
}
declare class BankUpgradeCost {
  equate(gp: any): number;
  level_to_gp(level: any): number;
  gp_to_level(gp: any): number;
}
declare class NewNewBankUpgradeCost {
  equate(level: any): number;
  level_to_gp(level: any): number;
}
declare class NewBankUpgradeCost {
  equate(gp: any): number;
  level_to_gp(level: any): number;
  gp_to_level(gp: any): number;
}
declare const bankUpgradeCost: BankUpgradeCost;
declare const newBankUpgradeCost: NewBankUpgradeCost;
declare const newNewBankUpgradeCost: NewNewBankUpgradeCost;
