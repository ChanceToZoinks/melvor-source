declare class ItemUpgrade {
  constructor(data: any, game: any);
  itemCosts: any;
  gpCost: any;
  scCost: any;
  rootItems: any;
  upgradedItem: any;
  isDowngrade: any;
}
declare class BankRenderQueue {
  items: Set<any>;
  tabIcons: Set<any>;
  bankSearch: boolean;
  bankValue: boolean;
  space: boolean;
}
declare class Bank {
  constructor(game: any, maxTabs?: number, baseSlots?: number);
  game: any;
  maxTabs: number;
  baseSlots: number;
  renderQueue: BankRenderQueue;
  lockedItems: Set<any>;
  lostItems: Map<any, any>;
  newItemsAdded: boolean;
  items: Map<any, any>;
  itemsByTab: any[][];
  defaultItemTabs: Map<any, any>;
  customSortOrder: any[];
  glowingItems: Set<any>;
  tabIcons: Map<any, any>;
  itemSelectionMode: number;
  selectedItems: Set<any>;
  selectedBankItem: any;
  itemUpgrades: Map<any, any>;
  selectedBankTab: number;
  nextOpenedItems: Map<any, any>;
  searchArray: any[];
  currentSearchQuery: string;
  eightDelay: boolean;
  postLoadItems: Map<any, any>;
  defaultSortOrder: NamespacedArray;
  get slotsSelected(): number;
  get itemCountSelected(): number;
  get selectedItemValue(): number;
  get unlockedItemArray(): any[];
  registerSortOrder(order: any): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  convertFromOldFormat(save: any, idMap: any): void;
  addDummyItemOnLoad(itemID: any, quantity: any): void;
  onLoad(): void;
  renderModifierChange(): void;
  onModifierChange(): void;
  onEquipmentChange(): void;
  isItemInPosition(item: any, tab: any, tabPosition: any): boolean;
  registerItemUpgrades(data: any): void;
  isItemSelected(item: any): boolean;
  hasItem(item: any): boolean;
  hasUnlockedItem(item: any): boolean;
  getTabMedia(tabID: any): any;
  render(): void;
  updateSpaceElement(element: any): void;
  queueQuantityUpdates(item: any): void;
  getItemDefaultTab(item: any): any;
  getItemSalePrice(item: any, quantity?: number): number;
  getTabValue(tabID: any): any;
  getBankValue(): any;
  getSnapShot(): Map<any, any>;
  getHistory(): any[];
  addQuantityToExistingItems(quantity: any): void;
  empty(): void;
  moveItemInTab(tabID: any, oldTabPosition: any, newTabPosition: any): void;
  moveItemToNewTab(oldTabID: any, newTabID: any, oldTabPosition: any): void;
  checkForClueChasers(): void;
  get maximumSlots(): number;
  get occupiedSlots(): number;
  addItemByID(
    itemID: any,
    quantity: any,
    logLost: any,
    found: any,
    ignoreSpace?: boolean
  ): void;
  addItem(
    item: any,
    quantity: any,
    logLost: any,
    found: any,
    ignoreSpace?: boolean,
    notify?: boolean
  ): boolean;
  removeItemQuantity(item: any, quantity: any, removeItemCharges: any): void;
  removeItemQuantityByID(
    itemID: any,
    quantity: any,
    removeItemCharges: any
  ): void;
  getQty(item: any): any;
  filterItems(predicate: any): any[];
  checkForItems(costs: any): any;
  consumeItems(costs: any): void;
  willItemsFit(items: any): any;
  moveItemModeOnClick(): void;
  sellItemModeOnClick(): void;
  selectItemOnClick(item: any): void;
  onItemDoubleClick(item: any): void;
  toggleItemLock(bankItem: any): void;
  reassignBankItemPositions(tabID: any, startingPosition: any): void;
  toggleItemSelected(bankItem: any): void;
  deselectBankItem(): void;
  toggleItemForSelection(bankItem: any): void;
  toggleItemForMoving(bankItem: any): void;
  toggleItemForSelling(bankItem: any): void;
  setItemSelectionMode(selectionMode: any): void;
  disableItemSelectionMode(): void;
  moveSelectedItemsToTab(newTabID: any): void;
  sellAllSelectedItems(): void;
  processSellSelectedItems(): void;
  sellUnlockedItemsOnClick(): void;
  processSelectedTabSale(): void;
  setLockOfSelectedTab(locked: any): void;
  setLockOfAllItemsOnClick(locked: any): void;
  setLockOfAllItems(locked: any): void;
  fireBulkItemSaleConfirmation(totalGP: any, count: any, onConfirm: any): void;
  sortButtonOnClick(): void;
  storeCustomSortOrder(): void;
  processItemSale(item: any, quantity: any): void;
  sellItemOnClick(item: any, quantity: any): void;
  buryItemOnClick(item: any, quantity: any): void;
  openItemOnClick(item: any, quantity: any): void;
  processItemOpen(item: any, quantity: any): void;
  readItemOnClick(item: any): void;
  claimItemOnClick(item: any, quantity: any): void;
  getMaxUpgradeQuantity(upgrade: any): number;
  checkUpgradePotionRequirement(upgrade: any): boolean;
  fireItemUpgradeModal(upgrade: any, rootItem: any): void;
  upgradeItemOnClick(upgrade: any, upgradeQuantity: any): void;
  useEightOnClick(eight: any): void;
  findAFriendOnClick(cracker: any): void;
  updateSearchArray(): void;
  onBankSearchChange(query: any): void;
  setSelectedItemAsTabIcon(tabID: any): void;
  changeDefaultSort(sortSetting: any): void;
  updateItemBorders(): void;
  validateItemOrders(): void;
}
declare class BankItem {
  constructor(bank: any, item: any, quantity: any, tab: any, tabPosition: any);
  bank: any;
  item: any;
  quantity: any;
  tab: any;
  tabPosition: any;
  get itemSellValue(): any;
  get stackValue(): any;
  get locked(): any;
  get isGlowing(): any;
}
declare class GolbinRaidBank extends Bank {}
