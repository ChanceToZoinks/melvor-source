declare function openBankSidebar(): void;
declare function closeBankSidebar(): void;
declare class BankItemIcon extends HTMLElement {
  _content: DocumentFragment;
  link: any;
  image: any;
  quantity: any;
  connectedCallback(): void;
  tooltip: any;
  disconnectedCallback(): void;
  setItem(bank: any, bankItem: any): void;
  item: any;
  updateQuantity(bankItem: any, enableAccessibility: any): void;
  setBorder(useDefaultBorder: any, isLocked: any): void;
  setGlow(isGlowing: any): void;
  addSelectionBorder(selectionMode: any): void;
  removeSelectionBorder(selectionMode: any): void;
}
declare class BankTabMenu extends HTMLElement {
  tabs: any[];
  itemIcons: Map<any, any>;
  isSorting: boolean;
  _content: DocumentFragment;
  tabContainer: any;
  spaceFractionLabel: any;
  spaceFraction: any;
  bankValueLabel: any;
  tabValueLabel: any;
  sellAllButton: any;
  sellAllText: any;
  unlockAllButton: any;
  unlockAllText: any;
  lockAllButton: any;
  lockAllText: any;
  paneContainer: any;
  connectedCallback(): void;
  tabValueTooltip: any;
  bankValueTooltip: any;
  disconnectedCallback(): void;
  getFromTabID(from: any): number;
  initialize(bank: any): void;
  loadAllItems(bank: any): void;
  addItemToEndofTab(bank: any, bankItem: any): void;
  removeItemFromTab(item: any): void;
  sortTabByOrder(tabID: any, order: any): void;
  validateItemOrder(): void;
  setItemSelected(item: any, selectMode: any): void;
  setItemUnselected(item: any, selectMode: any): void;
  setItemsUnselected(items: any, selectMode: any): void;
  moveIconsToNewTab(itemsToMove: any, newTabID: any): void;
  updateItemLockBorder(bankItem: any, useDefaultBorder: any): void;
  updateItemGlow(bankItem: any): void;
  updateForSearchResult(foundItems: any, foundTabs: any): void;
  showAllItems(): void;
  setTabImage(tabID: any, media: any): void;
  getValueTemplate(value: any): {
    gpIcon: string;
    gpValue: string;
  };
  selectTab(tabID: any, bank: any): void;
  updateBankValue(bank: any): void;
  updateBankSpace(bank: any): void;
}
declare class BankTabDropdownMenu extends HTMLElement {
  tabImages: any[];
  _content: DocumentFragment;
  openButton: any;
  optionsContainer: any;
  connectedCallback(): void;
  initialize(bank: any, optionSelectCallback: any): void;
  updateTabImages(bank: any): void;
}
declare class BankOptionsMenu extends HTMLElement {
  _content: DocumentFragment;
  sortButton: any;
  moveModeButton: any;
  sellModeButton: any;
  searchBar: any;
  clearSearchButton: any;
  connectedCallback(): void;
  initialize(bank: any): void;
  setSearchNone(): void;
  setSearchNormal(): void;
}
declare class BankMoveModeMenu extends HTMLElement {
  tabSelectedToMove: number;
  _content: DocumentFragment;
  tabSelection: any;
  confirmMoveButton: any;
  selectionCount: any;
  connectedCallback(): void;
  initialize(bank: any): void;
  updateSelectionCount(bank: any): void;
}
declare class BankSellModeMenu extends HTMLElement {
  _content: DocumentFragment;
  confirmSellButton: any;
  selectionCount: any;
  selectionValue: any;
  connectedCallback(): void;
  initialize(bank: any): void;
  updateSelectionValues(bank: any): void;
}
declare class BankRangeSlider {
  constructor(inputElement: any);
  inputElement: any;
  _sliderValue: number;
  sliderMode: number;
  sliderMin: number;
  sliderMax: number;
  customOnChange: () => void;
  sliderInstance: any;
  get quantity(): number;
  onSliderChange(newValue: any): void;
  checkSliderMode(newValue: any): boolean;
  setSliderMode(mode: any): void;
  setSliderRange(bankItem: any): void;
  setSliderPosition(value: any): void;
  setOnChange(onChange: any): void;
}
declare class BankSelectedItemMenu extends HTMLElement {
  static get observedAttributes(): string[];
  sizeElements: any[];
  equipToSetButtons: any[];
  _content: DocumentFragment;
  noneSelectedMessage: any;
  selectedItemContainer: any;
  itemImage: any;
  itemLockButton: any;
  itemLockIcon: any;
  quantityBadge: any;
  handednessBadge: any;
  itemName: any;
  itemDescription: any;
  itemHealing: any;
  viewStatsButton: any;
  specialAttackContainer: any;
  specialAttackList: any;
  upgradeContainer: any;
  upgradeText: any;
  upgradeButton: any;
  upgradeDropdownButton: any;
  upgradeOptionsContainer: any;
  readContainer: any;
  readButton: any;
  friendContainer: any;
  findFriendButton: any;
  equipItemContainer: any;
  equipSlotImage: any;
  equipSlotName: any;
  equipSetButtonContainer: any;
  equipReplacementContainer: any;
  equipQuantitySliderContainer: any;
  equipQuantitySlider: BankRangeSlider;
  equipSlotButtonContainer: any;
  equipFoodContainer: any;
  foodQuantitySlider: BankRangeSlider;
  equipFoodButton: any;
  openItemContainer: any;
  viewChestContentsButton: any;
  openItemQuantitySlider: BankRangeSlider;
  openItemButton: any;
  buryItemContainer: any;
  buryItemPrayerPoints: any;
  buryItemQuantitySlider: BankRangeSlider;
  buryItemButton: any;
  buryItemTotalPoints: any;
  claimTokenContainer: any;
  claimTokenQuantitySlider: BankRangeSlider;
  claimTokenButton: any;
  useEightContainer: any;
  useEightButton: any;
  singleItemSalePrice: any;
  sellItemQuantitySlider: BankRangeSlider;
  customSellQuantity: any;
  sellAllButOneButton: any;
  sellAllButton: any;
  sellItemButton: any;
  totalItemSalePrice: any;
  connectedCallback(): void;
  handednessTooltip: any;
  disconnectedCallback(): void;
  setUnselected(): void;
  setItem(bankItem: any, bank: any): void;
  createEquipToSetButtons(player: any, item: any): void;
  updateEquipToSetHighlight(setID: any): void;
  createReplaceItemHTML(item: any, player: any): string;
  createEquipItemButtons(item: any, player: any): void;
  updateItemQuantity(bankItem: any): void;
  updateEquipReplacement(item: any, player: any): void;
  setItemLocked(isLocked: any): void;
  getColClasses(attributeValue: any): any;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}
declare namespace BankSelectedItemMenu {
  namespace colSizeClasses {
    export const small: string[][];
    const _default: string[][];
    export { _default as default };
  }
}
declare class BankItemStatsMenu extends HTMLElement {
  _content: DocumentFragment;
  selectedItemContainer: any;
  itemImage: any;
  itemLockButton: any;
  itemLockIcon: any;
  quantityBadge: any;
  itemName: any;
  itemDescription: any;
  itemHealing: any;
  viewStatsButton: any;
  statsContainer: any;
  connectedCallback(): void;
  setUnselected(): void;
  setItem(bankItem: any, game: any): void;
  updateItemQuantity(bankItem: any): void;
  setItemLocked(isLocked: any): void;
}
declare class BankMinibarToggle extends HTMLElement {
  _content: DocumentFragment;
  skillToggle: any;
  skillLabel: any;
  skillImage: any;
  connectedCallback(): void;
  setSkill(skill: any): void;
  setItem(item: any, skill: any, game: any): void;
}
declare class BankItemSettingsMenu extends HTMLElement {
  minibarToggles: Map<any, any>;
  _content: DocumentFragment;
  selectedItemContainer: any;
  selectTabIconDropdown: any;
  minibarSettingsContainer: any;
  minibarSettingsToggles: any;
  unlockAllButton: any;
  lockAllButton: any;
  connectedCallback(): void;
  initialize(game: any): void;
  setItem(bankItem: any, game: any): void;
  setUnselected(): void;
}
declare class BankSideBarMenu extends HTMLElement {
  _content: DocumentFragment;
  itemImage: any;
  selectedMenu: any;
  statsMenu: any;
  settingsMenu: any;
  sidebarCloseButton: any;
  paneContainer: any;
  connectedCallback(): void;
  toggleSidebarMode(isSidebar: any): void;
  updateItemQuantity(bankItem: any): void;
  updateEquipItem(item: any, game: any): void;
  setItemLocked(isLocked: any): void;
  setItem(bankItem: any, game: any): void;
  setUnselected(): void;
  initialize(game: any): void;
}
