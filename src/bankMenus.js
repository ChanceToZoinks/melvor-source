"use strict";
class BankItemIcon extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-item-icon-template"));
    this.link = getElementFromFragment(this._content, "link", "a");
    this.image = getElementFromFragment(this._content, "image", "img");
    this.quantity = getElementFromFragment(this._content, "quantity", "small");
    this.className = "bank-item pointer-enabled m-2";
  }
  connectedCallback() {
    if (this.firstElementChild !== null && this.firstElementChild !== this.link)
      this.textContent = "";
    this.appendChild(this._content);
    this.tooltip = tippy(this, {
      content: "",
      placement: "top",
      allowHTML: true,
      interactive: false,
      animation: false,
      touch: "hold",
      onShow: (instance) => {
        if (this.item !== undefined)
          instance.setContent(createItemInformationTooltip(this.item));
      },
    });
  }
  disconnectedCallback() {
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }
  setItem(bank, bankItem) {
    this.image.src = bankItem.item.media;
    this.updateQuantity(bankItem, game.settings.enableAccessibility);
    this.onclick = () => bank.selectItemOnClick(bankItem.item);
    this.ondblclick = () => bank.onItemDoubleClick(bankItem.item);
    this.setAttribute("data-item-id", bankItem.item.id);
    this.setBorder(game.settings.useDefaultBankBorders, bankItem.locked);
    this.setGlow(bankItem.isGlowing);
    this.item = bankItem.item;
  }
  updateQuantity(bankItem, enableAccessibility) {
    const accessibilityText = enableAccessibility
      ? ` ${bankItem.item.name}`
      : "";
    this.quantity.textContent =
      formatNumber(bankItem.quantity) + accessibilityText;
    this.onmouseenter = () => {
      this.quantity.textContent =
        numberWithCommas(bankItem.quantity) + accessibilityText;
    };
    this.onmouseleave = () => {
      this.quantity.textContent =
        formatNumber(bankItem.quantity) + accessibilityText;
    };
  }
  setBorder(useDefaultBorder, isLocked) {
    if (isLocked) {
      this.classList.add("bank-locked");
    } else {
      this.classList.remove("bank-locked");
    }
    if (useDefaultBorder) {
      this.classList.remove("no-bg", "btn-light", "btn-locked");
    } else {
      this.classList.add("no-bg");
      if (isLocked) {
        this.classList.remove("btn-light");
        this.classList.add("btn-locked");
      } else {
        this.classList.remove("btn-locked");
        this.classList.add("btn-light");
      }
    }
  }
  setGlow(isGlowing) {
    if (isGlowing) this.classList.add("green-glow", "active");
    else this.classList.remove("green-glow", "active");
  }
  addSelectionBorder(selectionMode) {
    this.image.classList.add("border", "border-4x");
    switch (selectionMode) {
      case 1:
        this.image.classList.add("border-info");
        break;
      case 2:
        this.image.classList.add("border-warning");
        break;
      case 0:
        this.image.classList.add("border-success");
        break;
    }
  }
  removeSelectionBorder(selectionMode) {
    this.image.classList.remove("border", "border-4x");
    switch (selectionMode) {
      case 1:
        this.image.classList.remove("border-info");
        break;
      case 2:
        this.image.classList.remove("border-warning");
        break;
      case 0:
        this.image.classList.remove("border-success");
        break;
    }
  }
}
window.customElements.define("bank-item-icon", BankItemIcon);
class BankTabMenu extends HTMLElement {
  constructor() {
    super();
    this.tabs = [];
    this.itemIcons = new Map();
    this.isSorting = false;
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-tab-menu-template"));
    this.tabContainer = getElementFromFragment(
      this._content,
      "tab-container",
      "ul"
    );
    this.spaceFractionLabel = getElementFromFragment(
      this._content,
      "space-fraction-label",
      "span"
    );
    this.spaceFraction = getElementFromFragment(
      this._content,
      "space-fraction",
      "span"
    );
    this.bankValueLabel = getElementFromFragment(
      this._content,
      "bank-value-label",
      "span"
    );
    this.tabValueLabel = getElementFromFragment(
      this._content,
      "tab-value-label",
      "span"
    );
    this.sellAllButton = getElementFromFragment(
      this._content,
      "sell-all-button",
      "a"
    );
    this.sellAllText = getElementFromFragment(
      this._content,
      "sell-all-text",
      "span"
    );
    this.unlockAllButton = getElementFromFragment(
      this._content,
      "unlock-all-button",
      "a"
    );
    this.unlockAllText = getElementFromFragment(
      this._content,
      "unlock-all-text",
      "span"
    );
    this.lockAllButton = getElementFromFragment(
      this._content,
      "lock-all-button",
      "a"
    );
    this.lockAllText = getElementFromFragment(
      this._content,
      "lock-all-text",
      "span"
    );
    this.paneContainer = getElementFromFragment(
      this._content,
      "pane-container",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.tabValueTooltip = tippy(this.tabValueLabel, {
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
    this.bankValueTooltip = tippy(this.bankValueLabel, {
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.tabValueTooltip !== undefined) {
      this.tabValueTooltip.destroy();
      this.tabValueTooltip = undefined;
    }
    if (this.bankValueTooltip !== undefined) {
      this.bankValueTooltip.destroy();
      this.bankValueTooltip = undefined;
    }
  }
  getFromTabID(from) {
    return this.tabs.findIndex(({ itemContainer }) => itemContainer === from);
  }
  initialize(bank) {
    const tabTemplate = getTemplateElement(
      "bank-tab-menu-tab-template"
    ).content;
    const paneTemplate = getTemplateElement(
      "bank-tab-menu-pane-template"
    ).content;
    const delayOnTouchOnly = getSortableDelayOnTouch();
    for (let i = 0; i < bank.maxTabs; i++) {
      const newTabElement = new DocumentFragment();
      newTabElement.append(tabTemplate.cloneNode(true));
      const newPaneElement = new DocumentFragment();
      newPaneElement.append(paneTemplate.cloneNode(true));
      const tab = getElementFromFragment(newTabElement, "tab-main", "li");
      const tabLink = getElementFromFragment(newTabElement, "tab-link", "a");
      const tabImage = getElementFromFragment(
        newTabElement,
        "tab-image",
        "img"
      );
      const pane = getElementFromFragment(newPaneElement, "pane", "div");
      const itemContainer = getElementFromFragment(
        newPaneElement,
        "item-container",
        "div"
      );
      this.tabContainer.append(newTabElement);
      this.paneContainer.append(newPaneElement);
      tab.onclick = () => this.selectTab(i, bank);
      const containerSortable = new Sortable(itemContainer, {
        group: "bankContainer",
        delay: 200,
        delayOnTouchOnly,
        draggable: "bank-item-icon",
        dataIdAttr: "data-item-id",
        onEnd: (event) => {
          this.isSorting = false;
          disableSwipeEvents = false;
          if (
            event.newIndex === undefined ||
            event.oldIndex === undefined ||
            event.to !== itemContainer
          )
            return;
          bank.moveItemInTab(i, event.oldIndex, event.newIndex);
          this.validateItemOrder();
          tippy.hideAll();
        },
        onMove: (event) => {
          tippy.hideAll();
        },
        onChoose: (event) => {
          this.isSorting = true;
          disableSwipeEvents = true;
          tippy.hideAll();
        },
        onStart: (event) => {
          if (
            Sortable.ghost !== null &&
            Sortable.ghost !== undefined &&
            event.oldIndex !== undefined
          ) {
            const bankItem = bank.itemsByTab[i][event.oldIndex];
            Sortable.ghost.setItem(bank, bankItem);
          }
        },
      });
      const tabSortable = new Sortable(tab, {
        group: { name: "bankTab", put: ["bankContainer"] },
        sort: false,
        draggable: "bank-item-icon",
        onAdd: (event) => {
          this.isSorting = false;
          if (event.newIndex === undefined || event.oldIndex === undefined)
            return;
          itemContainer.append(event.item);
          bank.moveItemToNewTab(
            this.getFromTabID(event.from),
            i,
            event.oldIndex
          );
          this.validateItemOrder();
          tabLink.classList.remove("bg-combat-menu-selected");
        },
      });
      tab.addEventListener("dragenter", (event) => {
        if (this.isSorting && !tab.contains(event.relatedTarget)) {
          tabLink.classList.add("bg-combat-menu-selected");
        }
      });
      tab.addEventListener("dragleave", (event) => {
        if (this.isSorting && !tab.contains(event.relatedTarget)) {
          tabLink.classList.remove("bg-combat-menu-selected");
        }
      });
      tab.addEventListener("mouseenter", (event) => {
        if (this.isSorting) {
          tabLink.classList.add("bg-combat-menu-selected");
        }
      });
      tab.addEventListener("mouseleave", (event) => {
        if (this.isSorting) {
          tabLink.classList.remove("bg-combat-menu-selected");
        }
      });
      tab.addEventListener("touchmove", (event) => {
        if (!this.isSorting) return;
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        const elementAtTouchPoint = document.elementFromPoint(x, y);
        if (
          elementAtTouchPoint === tab ||
          (elementAtTouchPoint === null || elementAtTouchPoint === void 0
            ? void 0
            : elementAtTouchPoint.parentNode) === tab
        ) {
          tabLink.classList.add("bg-combat-menu-selected");
        } else {
          tabLink.classList.remove("bg-combat-menu-selected");
        }
      });
      this.tabs.push({
        tab,
        tabLink,
        tabImage,
        pane,
        itemContainer,
        containerSortable,
      });
    }
    this.tabs[0].pane.classList.add("active");
    this.tabs[0].tabLink.classList.add("active");
    this.spaceFractionLabel.textContent = templateLangString(
      "BANK_STRING",
      "59",
      { bankSpace: "" }
    );
    this.sellAllText.innerHTML = getLangString("BANK_STRING", "55");
    this.unlockAllText.innerHTML = getLangString("BANK_STRING", "56");
    this.lockAllText.innerHTML = getLangString("BANK_STRING", "57");
    this.sellAllButton.onclick = () => bank.sellUnlockedItemsOnClick();
    this.unlockAllButton.onclick = () => bank.setLockOfSelectedTab(false);
    this.lockAllButton.onclick = () => bank.setLockOfSelectedTab(true);
  }
  loadAllItems(bank) {
    bank.itemsByTab.forEach((tab, tabID) => {
      tab.forEach((bankItem) => {
        const newItemIcon = new BankItemIcon();
        this.tabs[tabID].itemContainer.append(newItemIcon);
        newItemIcon.setItem(bank, bankItem);
        this.itemIcons.set(bankItem.item, newItemIcon);
      });
    });
  }
  addItemToEndofTab(bank, bankItem) {
    const itemIcon = new BankItemIcon();
    this.tabs[bankItem.tab].itemContainer.append(itemIcon);
    itemIcon.setItem(bank, bankItem);
    this.itemIcons.set(bankItem.item, itemIcon);
  }
  removeItemFromTab(item) {
    var _a;
    const icon = this.itemIcons.get(item);
    if (icon === undefined)
      throw new Error("Tried to remove item icon but that does not exist");
    (_a = icon.parentElement) === null || _a === void 0
      ? void 0
      : _a.removeChild(icon);
    this.itemIcons.delete(item);
  }
  sortTabByOrder(tabID, order) {
    this.tabs[tabID].containerSortable.sort(order);
  }
  validateItemOrder() {
    this.tabs.forEach((tab, tabID) => {
      Array.from(tab.itemContainer.children).forEach((child, tabPosition) => {
        var _a, _b;
        if (
          child.getAttribute("data-item-id") !==
          ((_a = game.bank.itemsByTab[tabID][tabPosition]) === null ||
          _a === void 0
            ? void 0
            : _a.item.id)
        ) {
          console.log(
            `Item order validation failed. DOM has ${child.getAttribute(
              "data-item-id"
            )} at [${tabID},${tabPosition}], but bank has ${
              (_b = game.bank.itemsByTab[tabID][tabPosition]) === null ||
              _b === void 0
                ? void 0
                : _b.item.id
            }`
          );
        }
      });
    });
  }
  setItemSelected(item, selectMode) {
    var _a;
    (_a = this.itemIcons.get(item)) === null || _a === void 0
      ? void 0
      : _a.addSelectionBorder(selectMode);
  }
  setItemUnselected(item, selectMode) {
    var _a;
    (_a = this.itemIcons.get(item)) === null || _a === void 0
      ? void 0
      : _a.removeSelectionBorder(selectMode);
  }
  setItemsUnselected(items, selectMode) {
    items.forEach((bankItem) => {
      this.setItemUnselected(bankItem.item, selectMode);
    });
  }
  moveIconsToNewTab(itemsToMove, newTabID) {
    const newTabContainer = this.tabs[newTabID].itemContainer;
    itemsToMove.forEach((bankItem) => {
      var _a;
      const itemIcon = this.itemIcons.get(bankItem.item);
      if (itemIcon !== undefined) {
        (_a = itemIcon.parentElement) === null || _a === void 0
          ? void 0
          : _a.removeChild(itemIcon);
        newTabContainer.appendChild(itemIcon);
      }
    });
  }
  updateItemLockBorder(bankItem, useDefaultBorder) {
    var _a;
    (_a = this.itemIcons.get(bankItem.item)) === null || _a === void 0
      ? void 0
      : _a.setBorder(useDefaultBorder, bankItem.locked);
  }
  updateItemGlow(bankItem) {
    var _a;
    (_a = this.itemIcons.get(bankItem.item)) === null || _a === void 0
      ? void 0
      : _a.setGlow(bankItem.isGlowing);
  }
  updateForSearchResult(foundItems, foundTabs) {
    this.itemIcons.forEach((icon, item) => {
      if (foundItems.has(item)) {
        showElement(icon);
      } else {
        hideElement(icon);
      }
    });
    this.tabs.forEach((tab, tabID) => {
      if (foundTabs.has(tabID)) {
        tab.tabLink.classList.add("bg-bank-tab-search");
      } else {
        tab.tabLink.classList.remove("bg-bank-tab-search");
      }
    });
  }
  showAllItems() {
    this.itemIcons.forEach((icon) => {
      showElement(icon);
    });
    this.tabs.forEach((tab) => {
      tab.tabLink.classList.remove("bg-bank-tab-search");
    });
  }
  setTabImage(tabID, media) {
    this.tabs[tabID].tabImage.src = media;
  }
  getValueTemplate(value) {
    return {
      gpIcon: `<img class="skill-icon-xxs mr-1" src="${cdnMedia(
        "assets/media/main/coins.svg"
      )}">`,
      gpValue: `<span class="font-w400">${formatNumber(value)}</span>`,
    };
  }
  selectTab(tabID, bank) {
    if (bank.selectedBankTab === tabID) return;
    const oldTab = this.tabs[bank.selectedBankTab];
    oldTab.pane.classList.remove("active");
    oldTab.tabLink.classList.remove("active");
    const newTab = this.tabs[tabID];
    newTab.pane.classList.add("active");
    newTab.tabLink.classList.add("active");
    bank.selectedBankTab = tabID;
    this.tabValueLabel.innerHTML = templateLangString(
      "BANK_STRING",
      "45",
      this.getValueTemplate(bank.getTabValue(tabID))
    );
    if (bank.currentSearchQuery !== "")
      bank.onBankSearchChange(bank.currentSearchQuery);
  }
  updateBankValue(bank) {
    var _a, _b;
    const tabValue = bank.getTabValue(bank.selectedBankTab);
    const bankValue = bank.getBankValue();
    this.tabValueLabel.innerHTML = templateLangString(
      "BANK_STRING",
      "45",
      this.getValueTemplate(tabValue)
    );
    this.bankValueLabel.innerHTML = templateLangString(
      "BANK_STRING",
      "44",
      this.getValueTemplate(bankValue)
    );
    (_a = this.tabValueTooltip) === null || _a === void 0
      ? void 0
      : _a.setContent(numberWithCommas(tabValue));
    (_b = this.bankValueTooltip) === null || _b === void 0
      ? void 0
      : _b.setContent(numberWithCommas(bankValue));
  }
  updateBankSpace(bank) {
    bank.updateSpaceElement(this.spaceFraction);
  }
}
window.customElements.define("bank-tab-menu", BankTabMenu);
class BankTabDropdownMenu extends HTMLElement {
  constructor() {
    super();
    this.tabImages = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-tab-dropdown-menu-template"));
    this.openButton = getElementFromFragment(
      this._content,
      "open-dropdown-button",
      "button"
    );
    this.optionsContainer = getElementFromFragment(
      this._content,
      "dropdown-options",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(bank, optionSelectCallback) {
    const optionsTemplate = getTemplateElement(
      "bank-tab-dropdown-menu-option-template"
    ).content;
    for (let tabID = 0; tabID < bank.maxTabs; tabID++) {
      const newOption = new DocumentFragment();
      newOption.append(optionsTemplate.cloneNode(true));
      const link = getElementFromFragment(newOption, "link", "a");
      const image = getElementFromFragment(newOption, "image", "img");
      const tabNumber = getElementFromFragment(newOption, "tab-number", "span");
      tabNumber.textContent = `${tabID}`;
      link.onclick = () => optionSelectCallback(tabID);
      image.src = bank.getTabMedia(tabID);
      this.tabImages.push(image);
      this.optionsContainer.appendChild(newOption);
    }
    this.openButton.onclick = () => this.updateTabImages(bank);
  }
  updateTabImages(bank) {
    this.tabImages.forEach((image, tabID) => {
      image.src = bank.getTabMedia(tabID);
    });
  }
}
window.customElements.define("bank-tab-dropdown-menu", BankTabDropdownMenu);
class BankOptionsMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-options-menu-template"));
    this.sortButton = getElementFromFragment(
      this._content,
      "sort-button",
      "button"
    );
    this.moveModeButton = getElementFromFragment(
      this._content,
      "move-mode-button",
      "button"
    );
    this.sellModeButton = getElementFromFragment(
      this._content,
      "sell-mode-button",
      "button"
    );
    this.searchBar = getElementFromFragment(
      this._content,
      "searchTextbox",
      "input"
    );
    this.clearSearchButton = getElementFromFragment(
      this._content,
      "clear-search-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(bank) {
    this.sortButton.onclick = () => bank.sortButtonOnClick();
    this.moveModeButton.onclick = () => bank.moveItemModeOnClick();
    this.sellModeButton.onclick = () => bank.sellItemModeOnClick();
    this.searchBar.onkeyup = () => {
      const query = this.searchBar.value;
      bank.onBankSearchChange(query);
    };
    this.clearSearchButton.onclick = () => {
      this.searchBar.value = "";
      bank.onBankSearchChange("");
    };
  }
  setSearchNone() {
    this.searchBar.classList.add("text-danger");
  }
  setSearchNormal() {
    this.searchBar.classList.remove("text-danger");
  }
}
window.customElements.define("bank-options-menu", BankOptionsMenu);
class BankMoveModeMenu extends HTMLElement {
  constructor() {
    super();
    this.tabSelectedToMove = 0;
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-move-mode-menu-template"));
    this.tabSelection = getElementFromFragment(
      this._content,
      "tab-selection",
      "bank-tab-dropdown-menu"
    );
    this.confirmMoveButton = getElementFromFragment(
      this._content,
      "confirm-move-button",
      "button"
    );
    this.selectionCount = getElementFromFragment(
      this._content,
      "item-selection-count",
      "span"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(bank) {
    this.tabSelection.initialize(
      bank,
      (tabID) => (this.tabSelectedToMove = tabID)
    );
    this.confirmMoveButton.onclick = () => {
      bank.moveSelectedItemsToTab(this.tabSelectedToMove);
    };
  }
  updateSelectionCount(bank) {
    this.selectionCount.textContent = templateLangString(
      "MENU_TEXT",
      "MOVE_ITEMS_SELECTED",
      { num: `${bank.slotsSelected}` }
    );
  }
}
window.customElements.define("bank-move-mode-menu", BankMoveModeMenu);
class BankSellModeMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-sell-mode-menu-template"));
    this.confirmSellButton = getElementFromFragment(
      this._content,
      "confirm-sell-button",
      "button"
    );
    this.selectionCount = getElementFromFragment(
      this._content,
      "selection-count",
      "span"
    );
    this.selectionValue = getElementFromFragment(
      this._content,
      "selection-value",
      "span"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(bank) {
    this.confirmSellButton.onclick = () => bank.sellAllSelectedItems();
  }
  updateSelectionValues(bank) {
    this.selectionCount.textContent = templateLangString(
      "MENU_TEXT",
      "MOVE_ITEMS_SELECTED",
      { num: `${bank.itemCountSelected}` }
    );
    this.selectionValue.textContent = "";
    this.selectionValue.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "SELLS_FOR",
        {
          gpIcon: createElement("img", {
            className: "skill-icon-xxs",
            attributes: [["src", cdnMedia("assets/media/main/coins.svg")]],
          }),
        },
        { gpQty: formatNumber(bank.selectedItemValue) }
      )
    );
  }
}
window.customElements.define("bank-sell-mode-menu", BankSellModeMenu);
class BankRangeSlider {
  constructor(inputElement) {
    this.inputElement = inputElement;
    this._sliderValue = 0;
    this.sliderMode = 0;
    this.sliderMin = 0;
    this.sliderMax = 1;
    this.customOnChange = () => {};
    const inputQuery = $(inputElement);
    inputQuery.ionRangeSlider({
      skin: "round",
      type: "single",
      min: 0,
      max: 1,
      from: 0,
      onChange: (data) => {
        this.onSliderChange(data.from);
      },
    });
    this.sliderInstance = inputQuery.data("ionRangeSlider");
  }
  get quantity() {
    return this._sliderValue;
  }
  onSliderChange(newValue) {
    this._sliderValue = newValue;
    disableSidebarSwipeTimer();
    const modeReset = this.checkSliderMode(newValue);
    this.customOnChange(newValue, modeReset);
  }
  checkSliderMode(newValue) {
    let modeReset = false;
    switch (this.sliderMode) {
      case 2:
        modeReset = newValue !== this.sliderMax;
        break;
      case 1:
        modeReset = newValue !== this.sliderMax - 1;
        break;
    }
    if (modeReset) this.sliderMode = 0;
    return modeReset;
  }
  setSliderMode(mode) {
    this.sliderMode = mode;
    switch (mode) {
      case 2:
        this.setSliderPosition(this.sliderMax);
        break;
      case 1:
        this.setSliderPosition(this.sliderMax - 1);
        break;
    }
  }
  setSliderRange(bankItem) {
    this.sliderMax = bankItem.quantity;
    const fixSlider = this.sliderMax === 1;
    this.sliderMin = fixSlider ? 0 : 1;
    let sliderStart = this._sliderValue;
    switch (this.sliderMode) {
      case 2:
        sliderStart = this.sliderMax;
        break;
      case 1:
        sliderStart = this.sliderMax - 1;
        break;
      default:
        sliderStart = clampValue(
          this._sliderValue,
          this.sliderMin,
          this.sliderMax
        );
    }
    this.sliderInstance.update({
      min: this.sliderMin,
      max: this.sliderMax,
      from_fixed: fixSlider,
      from: sliderStart,
    });
    this._sliderValue = sliderStart;
  }
  setSliderPosition(value) {
    value = clampValue(value, this.sliderMin, this.sliderMax);
    this.sliderInstance.update({ from: value });
    this._sliderValue = value;
    const modeReset = this.checkSliderMode(value);
    this.customOnChange(value, modeReset);
  }
  setOnChange(onChange) {
    this.customOnChange = onChange;
  }
}
class BankSelectedItemMenu extends HTMLElement {
  constructor() {
    super();
    this.sizeElements = [];
    this.equipToSetButtons = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-selected-item-menu-template"));
    BankSelectedItemMenu.colSizeClasses.default.forEach((_, i) => {
      this.sizeElements.push(
        getAnyElementFromFragment(this._content, `size-elem-${i}`)
      );
    });
    this.noneSelectedMessage = getElementFromFragment(
      this._content,
      "none-selected-message",
      "div"
    );
    this.selectedItemContainer = getElementFromFragment(
      this._content,
      "selected-item-container",
      "div"
    );
    this.itemImage = getElementFromFragment(this._content, "item-image", "img");
    this.itemLockButton = getElementFromFragment(
      this._content,
      "item-lock-button",
      "button"
    );
    this.itemLockIcon = getElementFromFragment(
      this._content,
      "item-lock-icon",
      "i"
    );
    this.quantityBadge = getElementFromFragment(
      this._content,
      "quantity-badge",
      "small"
    );
    this.handednessBadge = getElementFromFragment(
      this._content,
      "handedness-badge",
      "small"
    );
    this.itemName = getElementFromFragment(this._content, "item-name", "span");
    this.itemDescription = getElementFromFragment(
      this._content,
      "item-description",
      "small"
    );
    this.itemHealing = getElementFromFragment(
      this._content,
      "item-healing",
      "h5"
    );
    this.viewStatsButton = getElementFromFragment(
      this._content,
      "view-stats-button",
      "h5"
    );
    this.specialAttackContainer = getElementFromFragment(
      this._content,
      "special-attack-container",
      "div"
    );
    this.specialAttackList = getElementFromFragment(
      this._content,
      "special-attack-list",
      "div"
    );
    this.upgradeContainer = getElementFromFragment(
      this._content,
      "upgrade-container",
      "div"
    );
    this.upgradeText = getElementFromFragment(
      this._content,
      "upgrade-text",
      "h5"
    );
    this.upgradeButton = getElementFromFragment(
      this._content,
      "upgrade-button",
      "button"
    );
    this.upgradeDropdownButton = getElementFromFragment(
      this._content,
      "upgrade-dropdown-button",
      "button"
    );
    this.upgradeOptionsContainer = getElementFromFragment(
      this._content,
      "upgrade-options-container",
      "div"
    );
    this.readContainer = getElementFromFragment(
      this._content,
      "read-container",
      "div"
    );
    this.readButton = getElementFromFragment(
      this._content,
      "read-button",
      "button"
    );
    this.friendContainer = getElementFromFragment(
      this._content,
      "friend-container",
      "div"
    );
    this.findFriendButton = getElementFromFragment(
      this._content,
      "find-friend-button",
      "button"
    );
    this.equipItemContainer = getElementFromFragment(
      this._content,
      "equip-item-container",
      "div"
    );
    this.equipSlotImage = getElementFromFragment(
      this._content,
      "equip-slot-image",
      "img"
    );
    this.equipSlotName = getElementFromFragment(
      this._content,
      "equip-slot-name",
      "span"
    );
    this.equipSetButtonContainer = getElementFromFragment(
      this._content,
      "equip-set-button-container",
      "div"
    );
    this.equipReplacementContainer = this.sizeElements[3];
    this.equipQuantitySliderContainer = getElementFromFragment(
      this._content,
      "equip-quantity-slider-container",
      "div"
    );
    this.equipQuantitySlider = new BankRangeSlider(
      getElementFromFragment(this._content, "equip-quantity-slider", "input")
    );
    this.equipSlotButtonContainer = this.sizeElements[5];
    this.equipFoodContainer = getElementFromFragment(
      this._content,
      "equip-food-container",
      "div"
    );
    this.foodQuantitySlider = new BankRangeSlider(
      getElementFromFragment(this._content, "food-quantity-slider", "input")
    );
    this.equipFoodButton = getElementFromFragment(
      this._content,
      "equip-food-button",
      "button"
    );
    this.openItemContainer = getElementFromFragment(
      this._content,
      "open-item-container",
      "div"
    );
    this.viewChestContentsButton = getElementFromFragment(
      this._content,
      "view-chest-contents-button",
      "h5"
    );
    this.openItemQuantitySlider = new BankRangeSlider(
      getElementFromFragment(
        this._content,
        "open-item-quantity-slider",
        "input"
      )
    );
    this.openItemButton = getElementFromFragment(
      this._content,
      "open-item-button",
      "button"
    );
    this.buryItemContainer = getElementFromFragment(
      this._content,
      "bury-item-container",
      "div"
    );
    this.buryItemPrayerPoints = getElementFromFragment(
      this._content,
      "bury-item-prayer-points",
      "h5"
    );
    this.buryItemQuantitySlider = new BankRangeSlider(
      getElementFromFragment(
        this._content,
        "bury-item-quantity-slider",
        "input"
      )
    );
    this.buryItemButton = getElementFromFragment(
      this._content,
      "bury-item-button",
      "button"
    );
    this.buryItemTotalPoints = getElementFromFragment(
      this._content,
      "bury-item-total-points",
      "h5"
    );
    this.claimTokenContainer = getElementFromFragment(
      this._content,
      "claim-token-container",
      "div"
    );
    this.claimTokenQuantitySlider = new BankRangeSlider(
      getElementFromFragment(
        this._content,
        "claim-token-quantity-slider",
        "input"
      )
    );
    this.claimTokenButton = getElementFromFragment(
      this._content,
      "claim-token-button",
      "button"
    );
    this.useEightContainer = getElementFromFragment(
      this._content,
      "use-eight-container",
      "div"
    );
    this.useEightButton = getElementFromFragment(
      this._content,
      "use-eight-button",
      "button"
    );
    this.singleItemSalePrice = getElementFromFragment(
      this._content,
      "single-item-sale-price",
      "h5"
    );
    this.sellItemQuantitySlider = new BankRangeSlider(
      getElementFromFragment(
        this._content,
        "sell-item-quantity-slider",
        "input"
      )
    );
    this.customSellQuantity = getElementFromFragment(
      this._content,
      "custom-sell-quantity",
      "input"
    );
    this.sellAllButOneButton = getElementFromFragment(
      this._content,
      "sell-all-but-one-button",
      "button"
    );
    this.sellAllButton = getElementFromFragment(
      this._content,
      "sell-all-button",
      "button"
    );
    this.sellItemButton = getElementFromFragment(
      this._content,
      "sell-item-button",
      "button"
    );
    this.totalItemSalePrice = getElementFromFragment(
      this._content,
      "total-item-sale-price",
      "span"
    );
    this.sellAllButOneButton.onclick = () => {
      this.sellAllButOneButton.classList.replace("btn-info", "btn-success");
      this.sellAllButton.classList.replace("btn-success", "btn-info");
      this.sellItemQuantitySlider.setSliderMode(1);
    };
    this.sellAllButton.onclick = () => {
      this.sellAllButton.classList.replace("btn-info", "btn-success");
      this.sellAllButOneButton.classList.replace("btn-success", "btn-info");
      this.sellItemQuantitySlider.setSliderMode(2);
    };
    const updateSellQuantity = () => {
      let newValue = parseInt(this.customSellQuantity.value);
      if (Number.isNaN(newValue)) newValue = 1;
      this.sellItemQuantitySlider.setSliderPosition(newValue);
    };
    this.customSellQuantity.onkeyup = updateSellQuantity;
    this.customSellQuantity.oninput = updateSellQuantity;
    this.customSellQuantity.onchange = updateSellQuantity;
  }
  connectedCallback() {
    this.appendChild(this._content);
    if (!this.hasAttribute("col-size"))
      this.setAttribute("col-size", "default");
    this.handednessTooltip = tippy(this.handednessBadge, {
      placement: "bottom",
      allowHTML: false,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.handednessTooltip !== undefined) {
      this.handednessTooltip.destroy();
      this.handednessTooltip = undefined;
    }
  }
  setUnselected() {
    hideElement(this.selectedItemContainer);
    showElement(this.noneSelectedMessage);
  }
  setItem(bankItem, bank) {
    var _a, _b;
    hideElement(this.noneSelectedMessage);
    showElement(this.selectedItemContainer);
    const item = bankItem.item;
    this.itemName.textContent = item.name;
    this.itemDescription.innerHTML = item.description;
    if (item instanceof EquipmentItem) {
      showElement(this.viewStatsButton);
      this.viewStatsButton.onclick = () =>
        viewItemStats(item, game.combat.player.equipToSetEquipment);
    } else {
      hideElement(this.viewStatsButton);
    }
    this.itemImage.src = item.media;
    this.quantityBadge.textContent = numberWithCommas(bankItem.quantity);
    this.setItemLocked(bankItem.locked);
    this.itemLockButton.onclick = () => bank.toggleItemLock(bankItem);
    this.singleItemSalePrice.textContent = templateLangString(
      "BANK_STRING",
      "24",
      { gpValue: numberWithCommas(bank.getItemSalePrice(item)) }
    );
    this.sellItemQuantitySlider.setOnChange((newValue, modeReset) => {
      if (modeReset) {
        this.sellAllButOneButton.classList.replace("btn-success", "btn-info");
        this.sellAllButton.classList.replace("btn-success", "btn-info");
      }
      this.totalItemSalePrice.textContent = numberWithCommas(
        bank.getItemSalePrice(item, newValue)
      );
      this.customSellQuantity.value = `${newValue}`;
    });
    this.sellItemQuantitySlider.setSliderRange(bankItem);
    this.sellItemQuantitySlider.setSliderPosition(
      this.sellItemQuantitySlider.quantity
    );
    this.sellItemButton.onclick = () => {
      bank.sellItemOnClick(item, this.sellItemQuantitySlider.quantity);
    };
    if (item instanceof EquipmentItem) {
      const defaultEquipSlot = equipmentSlotData[item.validSlots[0]];
      this.equipSlotImage.src = cdnMedia(
        `assets/media/bank/${defaultEquipSlot.emptyMedia}.png`
      );
      this.equipSlotName.textContent = defaultEquipSlot.emptyName;
      if (defaultEquipSlot.allowQuantity) {
        this.equipQuantitySlider.setSliderRange(bankItem);
        this.equipQuantitySlider.setSliderPosition(bankItem.quantity);
        showElement(this.equipQuantitySliderContainer);
      } else {
        hideElement(this.equipQuantitySliderContainer);
      }
      this.createEquipToSetButtons(game.combat.player, item);
      this.updateEquipToSetHighlight(game.combat.player.equipToSet);
      this.updateEquipReplacement(item, game.combat.player);
      this.createEquipItemButtons(item, game.combat.player);
      showElement(this.equipItemContainer);
      if (item.specialAttacks.length > 0) {
        this.specialAttackList.innerHTML = item.specialAttacks
          .map((attack, id) => {
            let chance = attack.defaultChance;
            if (item.overrideSpecialChances !== undefined)
              chance = item.overrideSpecialChances[id];
            return `<h5 class="font-w400 font-size-sm text-left text-combat-smoke m-1 mb-2"><strong class="text-bank-desc">${
              attack.name
            } (${formatPercent(chance)}) </strong><span>${
              attack.description
            }</span></h5>`;
          })
          .join("");
        showElement(this.specialAttackContainer);
      } else {
        hideElement(this.specialAttackContainer);
      }
    } else {
      hideElement(this.equipItemContainer);
      hideElement(this.specialAttackContainer);
    }
    if (item instanceof WeaponItem) {
      showElement(this.handednessBadge);
      if (item.occupiesSlots.includes("Shield")) {
        this.handednessBadge.textContent = getLangString("BANK_STRING", "2H");
        (_a = this.handednessTooltip) === null || _a === void 0
          ? void 0
          : _a.setContent(getLangString("MENU_TEXT", "TWO_HANDED_WEAPON"));
      } else {
        this.handednessBadge.textContent = getLangString("BANK_STRING", "1H");
        (_b = this.handednessTooltip) === null || _b === void 0
          ? void 0
          : _b.setContent(getLangString("MENU_TEXT", "ONE_HANDED_WEAPON"));
      }
    } else {
      hideElement(this.handednessBadge);
    }
    const upgrades = bank.itemUpgrades.get(item);
    if (upgrades !== undefined) {
      if (upgrades.length > 1) {
        hideElement(this.upgradeButton);
        showElement(this.upgradeDropdownButton);
        this.upgradeOptionsContainer.textContent = "";
        upgrades.forEach((upgrade) => {
          const newOption = createElement("a", { className: "dropdown-item" });
          newOption.append(
            createElement("img", {
              className: "skill-icon-xs mr-2",
              attributes: [["src", upgrade.upgradedItem.media]],
            }),
            upgrade.upgradedItem.name
          );
          newOption.onclick = () => bank.fireItemUpgradeModal(upgrade, item);
          this.upgradeOptionsContainer.append(newOption);
        });
      } else {
        const text = upgrades[0].isDowngrade
          ? getLangString("MENU_TEXT", "DOWNGRADE")
          : getLangString("BANK_STRING", "32");
        this.upgradeText.textContent = text;
        this.upgradeButton.textContent = text;
        hideElement(this.upgradeDropdownButton);
        showElement(this.upgradeButton);
        this.upgradeButton.onclick = () =>
          bank.fireItemUpgradeModal(upgrades[0], item);
      }
      showElement(this.upgradeContainer);
    } else {
      hideElement(this.upgradeContainer);
    }
    if (item instanceof ReadableItem) {
      this.readButton.onclick = () => bank.readItemOnClick(item);
      showElement(this.readContainer);
    } else {
      hideElement(this.readContainer);
    }
    if (item.id === "melvorD:Christmas_Cracker") {
      this.findFriendButton.onclick = () => bank.findAFriendOnClick(item);
      showElement(this.friendContainer);
    } else {
      hideElement(this.friendContainer);
    }
    if (item instanceof FoodItem) {
      showElement(this.itemHealing);
      this.itemHealing.innerHTML = templateLangString("BANK_STRING", "26", {
        hpImage: `<img class="skill-icon-xs mr-1" src="${cdnMedia(
          "assets/media/skills/hitpoints/hitpoints.svg"
        )}">`,
        hpValue: `<span class="text-bank-desc">${game.combat.player.getFoodHealing(
          item
        )}</span>`,
      });
      this.equipFoodButton.onclick = () => {
        game.combat.player.equipFood(item, this.foodQuantitySlider.quantity);
      };
      this.foodQuantitySlider.setSliderRange(bankItem);
      this.foodQuantitySlider.setSliderPosition(bankItem.quantity);
      showElement(this.equipFoodContainer);
    } else {
      hideElement(this.itemHealing);
      hideElement(this.equipFoodContainer);
    }
    if (item instanceof OpenableItem) {
      if (
        item.keyItem !== undefined &&
        bank.getQty(item.keyItem.item) < item.keyItem.quantity
      ) {
        this.openItemButton.disabled = true;
      } else {
        this.openItemButton.disabled = false;
      }
      this.openItemButton.onclick = () => {
        bank.openItemOnClick(item, this.openItemQuantitySlider.quantity);
      };
      this.viewChestContentsButton.onclick = () => viewItemContents(item);
      this.openItemQuantitySlider.setSliderRange(bankItem);
      this.openItemQuantitySlider.setSliderPosition(bankItem.quantity);
      showElement(this.openItemContainer);
    } else {
      hideElement(this.openItemContainer);
    }
    if (item instanceof BoneItem) {
      this.buryItemPrayerPoints.textContent = templateLangString(
        "MENU_TEXT",
        "GRANTS_PRAYER_POINTS",
        { num: `${item.prayerPoints}` }
      );
      this.buryItemButton.onclick = () => {
        bank.buryItemOnClick(item, this.buryItemQuantitySlider.quantity);
      };
      this.buryItemQuantitySlider.setOnChange((newValue) => {
        this.buryItemTotalPoints.textContent = templateLangString(
          "COMBAT_MISC",
          "PRAYER_POINTS",
          { num: numberWithCommas(item.prayerPoints * newValue) }
        );
      });
      this.buryItemQuantitySlider.setSliderRange(bankItem);
      this.buryItemQuantitySlider.setSliderPosition(bankItem.quantity);
      showElement(this.buryItemContainer);
    } else {
      hideElement(this.buryItemContainer);
    }
    if (item instanceof TokenItem) {
      this.claimTokenButton.onclick = () => {
        bank.claimItemOnClick(item, this.claimTokenQuantitySlider.quantity);
      };
      this.claimTokenQuantitySlider.setSliderRange(bankItem);
      this.claimTokenQuantitySlider.setSliderPosition(bankItem.quantity);
      showElement(this.claimTokenContainer);
    } else {
      hideElement(this.claimTokenContainer);
    }
    if (item.id === "melvorD:Eight") {
      this.useEightButton.onclick = () => bank.useEightOnClick(item);
      showElement(this.useEightContainer);
    } else {
      hideElement(this.useEightContainer);
    }
  }
  createEquipToSetButtons(player, item) {
    while (this.equipToSetButtons.length < player.numEquipSets) {
      const button = createElement("button", {
        className: "btn btn-primary m-1",
        attributes: [["role", "button"]],
        text: `${this.equipToSetButtons.length + 1}`,
      });
      this.equipToSetButtons.push(button);
      this.equipSetButtonContainer.append(button);
    }
    this.equipToSetButtons.forEach((button, setID) => {
      if (setID >= player.numEquipSets) {
        hideElement(button);
      } else {
        showElement(button);
      }
      button.onclick = () => {
        player.changeEquipToSet(setID);
        this.updateEquipToSetHighlight(setID);
        this.updateEquipReplacement(item, player);
      };
    });
  }
  updateEquipToSetHighlight(setID) {
    this.equipToSetButtons.forEach((button, i) => {
      if (i === setID) {
        button.classList.replace("btn-primary", "btn-success");
      } else {
        button.classList.replace("btn-success", "btn-primary");
      }
    });
  }
  createReplaceItemHTML(item, player) {
    return `<h5 class="font-w400 font-size-sm text-combat-smoke m-1 mb-2" ><lang-string lang-cat="BANK_STRING" lang-id="29"></lang-string></h5>${item.validSlots
      .map((slot) => {
        const slotData = equipmentSlotData[slot];
        const replacedItems = player.equipmentSets[
          player.equipToSet
        ].equipment.getItemsAddedOnEquip(item, slot);
        const addReplaceHTML = (
          src,
          name
        ) => `<div class="media d-flex align-items-center push">
        <div class="mr-1">
        <img class="skill-icon-sm" src="${src}"></div>
        <div class="media-body text-left">
        <div class="font-w400 font-size-sm text-bank-desc m-1">${name}</div>
        </div>
        </div>`;
        let replaceHTML = "";
        if (replacedItems.length > 0) {
          replacedItems.forEach(({ item, quantity }) => {
            let replaceName = `(${slotData.emptyName}) ${item.name}`;
            if (quantity > 1) replaceName += ` (${quantity})`;
            replaceHTML += addReplaceHTML(item.media, replaceName);
          });
        } else if (player.isEquipmentSlotUnlocked(slot)) {
          replaceHTML += addReplaceHTML(
            `${CDNDIR}assets/media/bank/${slotData.emptyMedia}.png`,
            `(${slotData.emptyName}) ${getLangString("GOLBIN_RAID", "POPUP_9")}`
          );
        }
        return replaceHTML;
      })
      .join("")}`;
  }
  createEquipItemButtons(item, player) {
    this.equipSlotButtonContainer.textContent = "";
    item.validSlots.forEach((slot) => {
      const slotData = equipmentSlotData[slot];
      if (player.isEquipmentSlotUnlocked(slot)) {
        const equipButton = createElement("button", {
          className: "btn btn-warning m-1",
          text: templateLangString("BANK_STRING", "30", {
            equipSlot: slotData.emptyName,
          }),
        });
        equipButton.onclick = () => {
          player.equipCallback(item, slot, this.equipQuantitySlider.quantity);
        };
        this.equipSlotButtonContainer.append(equipButton);
      }
    });
  }
  updateItemQuantity(bankItem) {
    const item = bankItem.item;
    this.sellItemQuantitySlider.setSliderRange(bankItem);
    this.quantityBadge.textContent = numberWithCommas(bankItem.quantity);
    if (item instanceof EquipmentItem) {
      this.equipQuantitySlider.setSliderRange(bankItem);
    } else if (item instanceof FoodItem) {
      this.foodQuantitySlider.setSliderRange(bankItem);
    } else if (item instanceof OpenableItem) {
      this.openItemQuantitySlider.setSliderRange(bankItem);
    } else if (item instanceof BoneItem) {
      this.buryItemQuantitySlider.setSliderRange(bankItem);
    } else if (item instanceof TokenItem) {
      this.claimTokenQuantitySlider.setSliderRange(bankItem);
    }
  }
  updateEquipReplacement(item, player) {
    this.equipReplacementContainer.innerHTML = this.createReplaceItemHTML(
      item,
      player
    );
  }
  setItemLocked(isLocked) {
    this.sellItemButton.disabled = isLocked;
    this.buryItemButton.disabled = isLocked;
    if (isLocked) {
      this.itemLockIcon.className = "fa fa-lock text-danger";
    } else {
      this.itemLockIcon.className = "fa fa-unlock text-success";
    }
  }
  getColClasses(attributeValue) {
    if (
      attributeValue === null ||
      !(attributeValue in BankSelectedItemMenu.colSizeClasses)
    ) {
      return BankSelectedItemMenu.colSizeClasses["default"];
    } else {
      return BankSelectedItemMenu.colSizeClasses[attributeValue];
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    const oldClasses = this.getColClasses(oldValue);
    const newClasses = this.getColClasses(newValue);
    if (oldClasses !== newClasses) {
      this.sizeElements.forEach((elem, i) => {
        elem.classList.remove(...oldClasses[i]);
        elem.classList.add(...newClasses[i]);
      });
    }
  }
  static get observedAttributes() {
    return ["col-size"];
  }
}
BankSelectedItemMenu.colSizeClasses = {
  small: [
    ["col-5"],
    ["col-7"],
    ["col-12", "col-sm-6"],
    ["col-12", "col-sm-6"],
    ["col-12", "col-sm-6"],
    ["col-12", "col-sm-4"],
    ["col-12", "col-sm-4"],
    ["col-md-8"],
    ["col-md-4"],
    ["col-md-8"],
    ["col-md-4"],
    ["col-md-8"],
    ["col-md-4"],
    ["col-md-8"],
    ["col-md-4"],
    ["col-md-3"],
    ["col-md-5"],
    ["col-md-4"],
  ],
  default: [
    ["col-4"],
    ["col-8"],
    ["col-6"],
    ["col-6"],
    ["col-8"],
    ["col-4"],
    ["col-xl-8"],
    ["col-xl-4"],
    ["col-xl-8"],
    ["col-xl-4"],
    ["col-xl-8"],
    ["col-xl-4"],
    ["col-xl-8"],
    ["col-xl-4"],
    ["col-xl-3"],
    ["col-xl-5"],
    ["col-xl-4"],
  ],
};
window.customElements.define("bank-selected-item-menu", BankSelectedItemMenu);
class BankItemStatsMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-item-stats-menu-template"));
    this.selectedItemContainer = getElementFromFragment(
      this._content,
      "selected-item-container",
      "div"
    );
    this.itemImage = getElementFromFragment(this._content, "item-image", "img");
    this.itemLockButton = getElementFromFragment(
      this._content,
      "item-lock-button",
      "button"
    );
    this.itemLockIcon = getElementFromFragment(
      this._content,
      "item-lock-icon",
      "i"
    );
    this.quantityBadge = getElementFromFragment(
      this._content,
      "quantity-badge",
      "small"
    );
    this.itemName = getElementFromFragment(this._content, "item-name", "h5");
    this.itemDescription = getElementFromFragment(
      this._content,
      "item-description",
      "h5"
    );
    this.itemHealing = getElementFromFragment(
      this._content,
      "item-healing",
      "h5"
    );
    this.viewStatsButton = getElementFromFragment(
      this._content,
      "view-stats-button",
      "h5"
    );
    this.statsContainer = getElementFromFragment(
      this._content,
      "stats-container",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setUnselected() {
    hideElement(this.selectedItemContainer);
  }
  setItem(bankItem, game) {
    showElement(this.selectedItemContainer);
    const item = bankItem.item;
    this.itemName.textContent = item.name;
    this.itemDescription.innerHTML = item.description;
    if (item instanceof EquipmentItem) {
      showElement(this.viewStatsButton);
      this.viewStatsButton.onclick = () => viewItemStats(item);
    } else {
      hideElement(this.viewStatsButton);
    }
    this.itemImage.src = item.media;
    this.quantityBadge.textContent = numberWithCommas(bankItem.quantity);
    this.setItemLocked(bankItem.locked);
    this.itemLockButton.onclick = () => game.bank.toggleItemLock(bankItem);
    if (item instanceof FoodItem) {
      showElement(this.itemHealing);
      this.itemHealing.innerHTML = templateLangString("BANK_STRING", "26", {
        hpImage: `<img class="skill-icon-xs mr-1" src="${cdnMedia(
          "assets/media/skills/hitpoints/hitpoints.svg"
        )}">`,
        hpValue: `<span class="text-bank-desc">${game.combat.player.getFoodHealing(
          item
        )}</span>`,
      });
    } else {
      hideElement(this.itemHealing);
    }
    this.statsContainer.textContent = "";
    const preStat =
      "<h5 class='font-w400 font-size-sm text-combat-smoke m-1 mb-2'><strong>";
    const postStat = "</h5>";
    this.statsContainer.innerHTML = getItemStatDescriptions(
      item,
      " </strong>",
      preStat,
      postStat
    );
  }
  updateItemQuantity(bankItem) {
    this.quantityBadge.textContent = numberWithCommas(bankItem.quantity);
  }
  setItemLocked(isLocked) {
    if (isLocked) {
      this.itemLockIcon.className = "fa fa-lock text-danger";
    } else {
      this.itemLockIcon.className = "fa fa-unlock text-success";
    }
  }
}
window.customElements.define("bank-item-stats-menu", BankItemStatsMenu);
class BankMinibarToggle extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-minibar-toggle-template"));
    this.skillToggle = getElementFromFragment(
      this._content,
      "skill-toggle",
      "input"
    );
    this.skillLabel = getElementFromFragment(
      this._content,
      "skill-label",
      "label"
    );
    this.skillImage = getElementFromFragment(
      this._content,
      "skill-image",
      "img"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setSkill(skill) {
    const id = `minibar-item-toggle-${skill.id}`;
    this.skillToggle.id = id;
    this.skillLabel.htmlFor = id;
    this.skillImage.src = skill.media;
  }
  setItem(item, skill, game) {
    this.skillToggle.checked = game.minibar.isCustomItemSet(skill, item);
    this.skillToggle.onchange = () => {
      this.skillToggle.checked = game.minibar.toggleCustomItem(skill, item);
    };
  }
}
window.customElements.define("bank-minibar-toggle", BankMinibarToggle);
class BankItemSettingsMenu extends HTMLElement {
  constructor() {
    super();
    this.minibarToggles = new Map();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-item-settings-menu-template"));
    this.selectedItemContainer = getElementFromFragment(
      this._content,
      "selected-item-container",
      "div"
    );
    this.selectTabIconDropdown = getElementFromFragment(
      this._content,
      "select-tab-icon-dropdown",
      "bank-tab-dropdown-menu"
    );
    this.minibarSettingsContainer = getElementFromFragment(
      this._content,
      "minibar-settings-container",
      "div"
    );
    this.minibarSettingsToggles = getElementFromFragment(
      this._content,
      "minibar-settings-toggles",
      "div"
    );
    this.unlockAllButton = getElementFromFragment(
      this._content,
      "unlock-all-button",
      "button"
    );
    this.lockAllButton = getElementFromFragment(
      this._content,
      "lock-all-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(game) {
    game.skills.forEach((skill) => {
      if (!skill.hasMinibar) return;
      const toggle = createElement("bank-minibar-toggle", {
        className: "col-4",
        parent: this.minibarSettingsToggles,
      });
      toggle.setSkill(skill);
      this.minibarToggles.set(skill, toggle);
    });
    this.selectTabIconDropdown.initialize(game.bank, (tabID) =>
      game.bank.setSelectedItemAsTabIcon(tabID)
    );
    this.unlockAllButton.onclick = () =>
      game.bank.setLockOfAllItemsOnClick(false);
    this.lockAllButton.onclick = () => game.bank.setLockOfAllItemsOnClick(true);
  }
  setItem(bankItem, game) {
    showElement(this.selectedItemContainer);
    const item = bankItem.item;
    if (item instanceof EquipmentItem) {
      showElement(this.minibarSettingsContainer);
      this.minibarToggles.forEach((toggle, skill) => {
        toggle.setItem(item, skill, game);
      });
    } else {
      hideElement(this.minibarSettingsContainer);
    }
  }
  setUnselected() {
    hideElement(this.selectedItemContainer);
  }
}
window.customElements.define("bank-item-settings-menu", BankItemSettingsMenu);
class BankSideBarMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("bank-sidebar-menu-template"));
    this.itemImage = getElementFromFragment(this._content, "item-image", "img");
    this.selectedMenu = getElementFromFragment(
      this._content,
      "selected-menu",
      "bank-selected-item-menu"
    );
    this.statsMenu = getElementFromFragment(
      this._content,
      "stats-menu",
      "bank-item-stats-menu"
    );
    this.settingsMenu = getElementFromFragment(
      this._content,
      "settings-menu",
      "bank-item-settings-menu"
    );
    this.sidebarCloseButton = getElementFromFragment(
      this._content,
      "sidebar-close-button",
      "button"
    );
    this.paneContainer = getElementFromFragment(
      this._content,
      "pane-container",
      "div"
    );
    this.sidebarCloseButton.onclick = closeBankSidebar;
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  toggleSidebarMode(isSidebar) {
    if (isSidebar) {
      showElement(this.sidebarCloseButton);
      this.selectedMenu.setAttribute("col-size", "small");
      this.paneContainer.classList.add("overflow-hidden");
      this.paneContainer.style.paddingBottom = "100px";
    } else {
      hideElement(this.sidebarCloseButton);
      this.selectedMenu.setAttribute("col-size", "default");
      this.paneContainer.classList.remove("overflow-hidden");
      this.paneContainer.style.paddingBottom = "";
    }
  }
  updateItemQuantity(bankItem) {
    this.selectedMenu.updateItemQuantity(bankItem);
    this.statsMenu.updateItemQuantity(bankItem);
  }
  updateEquipItem(item, game) {
    this.selectedMenu.updateEquipReplacement(item, game.combat.player);
  }
  setItemLocked(isLocked) {
    this.selectedMenu.setItemLocked(isLocked);
    this.statsMenu.setItemLocked(isLocked);
  }
  setItem(bankItem, game) {
    this.itemImage.src = bankItem.item.media;
    this.selectedMenu.setItem(bankItem, game.bank);
    this.statsMenu.setItem(bankItem, game);
    this.settingsMenu.setItem(bankItem, game);
  }
  setUnselected() {
    this.itemImage.src = cdnMedia("assets/media/main/question.svg");
    this.selectedMenu.setUnselected();
    this.statsMenu.setUnselected();
    this.settingsMenu.setUnselected();
  }
  initialize(game) {
    this.settingsMenu.initialize(game);
  }
}
window.customElements.define("bank-sidebar-menu", BankSideBarMenu);
function openBankSidebar() {
  const sidebarContainer = document.getElementById(
    "bank-sidebar-overlay-container"
  );
  sidebarContainer.appendChild(bankSideBarMenu);
  bankSideBarMenu.toggleSidebarMode(true);
  One._uiApiLayout("side_overlay_open");
}
function closeBankSidebar() {
  const mainContainer = document.getElementById("bank-item-box");
  mainContainer.appendChild(bankSideBarMenu);
  bankSideBarMenu.toggleSidebarMode(false);
  One._uiApiLayout("side_overlay_close");
}
