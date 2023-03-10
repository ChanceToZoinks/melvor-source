"use strict";
class ShopCostsAndUnlock {
  constructor(purchase, game, costContainer) {
    this.purchase = purchase;
    this.game = game;
    this.costContainer = costContainer;
    this.requirementElements = [];
    this.costElements = [];
    this.createPurchaseRequirements();
    this.createCostElements();
  }
  get buyQty() {
    return this.purchase.allowQuantityPurchase
      ? this.game.shop.capPurchaseQuantity(
          this.purchase,
          this.game.shop.buyQuantity
        )
      : 1;
  }
  updatePurchaseRequirements() {
    const requirements = this.purchase.purchaseRequirements;
    let unlockID = -1;
    const getNextUnlock = () => {
      unlockID++;
      return this.requirementElements[unlockID];
    };
    requirements.forEach((requirement) => {
      const met = this.game.checkRequirement(requirement, false);
      switch (requirement.type) {
        case "SlayerTask":
          {
            const unlock = getNextUnlock();
            if (met) {
              hideElement(unlock.parent);
            } else {
              unlock.cost.textContent =
                this.getSlayerTaskUnlockText(requirement);
            }
            this.setUnlockElementMet(unlock, met);
          }
          break;
        default:
          this.setUnlockElementMet(getNextUnlock(), met);
          break;
      }
    });
  }
  updateCostElements() {
    let costID = -1;
    const getNextCost = () => {
      costID++;
      return this.costElements[costID];
    };
    const costs = this.purchase.costs;
    if (!isShopCostZero(costs.gp)) {
      const amount = this.getCostQty(costs.gp);
      this.updateCostElement(getNextCost(), this.isGPCostMet(amount), amount);
    }
    if (!isShopCostZero(costs.slayerCoins)) {
      const amount = this.getCostQty(costs.slayerCoins);
      this.updateCostElement(
        getNextCost(),
        this.isSlayerCoinCostMet(amount),
        amount
      );
    }
    costs.items.forEach(({ item, quantity }) => {
      this.updateCostElement(
        getNextCost(),
        this.isItemCostMet(item, quantity),
        quantity * this.buyQty
      );
    });
    if (!isShopCostZero(costs.raidCoins)) {
      const amount = this.getCostQty(costs.raidCoins);
      this.updateCostElement(
        getNextCost(),
        this.isRaidCoinCostMet(amount),
        amount
      );
    }
  }
  setToBuyLimit() {
    this.costElements.forEach(({ image, cost }) => {
      hideElement(image);
      hideElement(cost);
    });
    this.requirementElements.forEach(({ parent }) => hideElement(parent));
    createElement("span", {
      classList: ["text-danger"],
      text: templateLangString("MENU_TEXT", "BUY_LIMIT_REACHED", {
        count: `${this.purchase.getBuyLimit(this.game.currentGamemode)}`,
      }),
      parent: this.costContainer,
    });
  }
  destroy() {
    this.costElements.forEach((elem) => {
      elem.tooltip.destroy();
    });
  }
  createPurchaseRequirements() {
    const requirements = this.purchase.purchaseRequirements;
    requirements.forEach((requirement) => {
      this.requirementElements.push(
        this.createUnlockElement(
          getRequirementNodes(requirement, "skill-icon-xs m-1"),
          this.game.checkRequirement(requirement)
        )
      );
    });
  }
  createCostElements() {
    const costs = this.purchase.costs;
    if (!isShopCostZero(costs.gp)) {
      const amount = this.getCostQty(costs.gp);
      this.costElements.push(
        this.createCostElement(
          cdnMedia("assets/media/main/coins.svg"),
          amount,
          this.isGPCostMet(amount),
          getLangString("MENU_TEXT", "GP")
        )
      );
    }
    if (!isShopCostZero(costs.slayerCoins)) {
      const amount = this.getCostQty(costs.slayerCoins);
      this.costElements.push(
        this.createCostElement(
          cdnMedia("assets/media/main/slayer_coins.svg"),
          amount,
          this.isSlayerCoinCostMet(amount),
          getLangString("MENU_TEXT", "SLAYER_COINS")
        )
      );
    }
    costs.items.forEach(({ item, quantity }) => {
      this.costElements.push(
        this.createCostElement(
          item.media,
          quantity * this.buyQty,
          this.isItemCostMet(item, quantity),
          item.name
        )
      );
    });
    if (!isShopCostZero(costs.raidCoins)) {
      const amount = this.getCostQty(costs.raidCoins);
      this.costElements.push(
        this.createCostElement(
          cdnMedia("assets/media/main/raid_coins.svg"),
          amount,
          this.isRaidCoinCostMet(amount),
          getLangString("MENU_TEXT", "RAID_COINS")
        )
      );
    }
  }
  setElementMet(element, met) {
    if (met) {
      element.classList.add("text-success");
      element.classList.remove("text-danger");
    } else {
      element.classList.add("text-danger");
      element.classList.remove("text-success");
    }
  }
  setUnlockElementMet(element, met) {
    this.setElementMet(element.cost, met);
  }
  updateCostElement(element, met, amount) {
    this.setElementMet(element.cost, met);
    element.cost.textContent = formatNumber(amount);
  }
  getCostQty(amount) {
    const amountBought = this.game.shop.getPurchaseCount(this.purchase);
    return this.game.shop.getCurrencyCost(amount, this.buyQty, amountBought);
  }
  isGPCostMet(amount) {
    return this.game.gp.canAfford(amount);
  }
  isSlayerCoinCostMet(amount) {
    return this.game.slayerCoins.canAfford(amount);
  }
  isItemCostMet(item, baseQty) {
    return this.game.bank.getQty(item) >= baseQty * this.buyQty;
  }
  isRaidCoinCostMet(amount) {
    return this.game.raidCoins.canAfford(amount);
  }
  getTextClass(met) {
    return met ? "text-success" : "text-danger";
  }
  getSlayerTaskUnlockText(requirement) {
    const currentCount =
      this.game.combat.slayerTask.getTaskCompletionsForTierAndAbove(
        requirement.tier
      );
    return templateLangString(
      "MENU_TEXT",
      `UNLOCK_SLAYER_${SlayerTask.data[requirement.tier].engDisplay}`,
      { count: `${Math.max(requirement.count - currentCount, 0)}` }
    );
  }
  createUnlockElement(costNodes, met) {
    const parent = createElement("div", {
      classList: ["font-w600"],
      parent: this.costContainer,
    });
    const cost = createElement("small", {
      classList: [this.getTextClass(met)],
      children: costNodes,
      parent,
    });
    return { parent, cost };
  }
  createImage(media) {
    return createElement("img", {
      classList: ["skill-icon-xs", "m-1"],
      attributes: [["src", media]],
    });
  }
  createCostElement(media, qty, met, tooltipText) {
    const image = this.createImage(media);
    const cost = createElement("span", {
      classList: [this.getTextClass(met)],
      text: formatNumber(qty),
    });
    const tooltip = tippy(image, {
      content: tooltipText,
      placement: "top",
      interactive: false,
      animation: false,
      allowHTML: true,
    });
    this.costContainer.append(image, cost);
    return { image, cost, tooltip };
  }
}
class ShopConfirmModalItem extends ShopCostsAndUnlock {
  constructor(purchase, game) {
    const parent = createElement("div", { classList: ["text-dark"] });
    super(purchase, game, createElement("div"));
    if (this.purchase.contains.itemCharges !== undefined) {
      this.buyChargeQty = createElement("div", {
        classList: ["font-size-sm"],
        text: templateLangString("MENU_TEXT", "PLUS_CHARGES", {
          count: numberWithCommas(
            this.buyQty * this.purchase.contains.itemCharges.quantity
          ),
        }),
        parent,
      });
    }
    const description = createElement("div", {
      classList: ["font-size-sm"],
      parent,
    });
    description.innerHTML = this.purchase.getTemplatedDescription(game.shop);
    parent.append(this.costContainer);
    this.parent = parent;
  }
  updateForQuantityChange() {
    if (
      this.purchase.contains.itemCharges !== undefined &&
      this.buyChargeQty !== undefined
    ) {
      this.buyChargeQty.textContent = templateLangString(
        "MENU_TEXT",
        "PLUS_CHARGES",
        {
          count: numberWithCommas(
            this.purchase.contains.itemCharges.quantity * this.buyQty
          ),
        }
      );
    }
    this.updateCostElements();
  }
}
class ShopItem extends ShopCostsAndUnlock {
  constructor(purchase, game, parent) {
    super(purchase, game, createElement("div", { classList: ["font-w600"] }));
    this.parent = parent;
    this.container = createElement("div", {
      classList: ["media", "d-flex", "align-items-center", "push"],
    });
    this.image = this.container
      .appendChild(
        createElement("div", { classList: ["mr-3"], parent: this.container })
      )
      .appendChild(
        createElement("img", {
          classList: ["shop-img"],
          attributes: [["src", this.purchase.media]],
        })
      );
    this.mediaBody = createElement("div", {
      classList: ["media-body"],
      parent: this.container,
    });
    if (this.purchase.contains.itemCharges !== undefined) {
      const container = createElement("div", {
        classList: ["font-size-sm"],
        parent: this.mediaBody,
      });
      const owned = createElement("small", {
        classList: ["badge", "badge-success"],
        text: getLangString("MENU_TEXT", "OWNED"),
        parent: container,
      });
      const ownedCharges = createElement("small", {
        classList: ["badge", "badge-info"],
        text: templateString(getLangString("MENU_TEXT", "CURRENT_CHARGES"), {
          count: formatNumber(
            this.game.itemCharges.getCharges(
              this.purchase.contains.itemCharges.item
            )
          ),
        }),
        parent: container,
      });
      this.itemChargeDescription = { container, owned, ownedCharges };
    }
    this.name = createElement("div", {
      classList: ["font-w600"],
      text: this.purchase.name,
      parent: this.mediaBody,
    });
    if (this.purchase.contains.itemCharges !== undefined) {
      this.buyChargeQty = createElement("div", {
        classList: ["font-size-sm"],
        text: templateLangString("MENU_TEXT", "PLUS_CHARGES", {
          count: numberWithCommas(
            this.buyQty * this.purchase.contains.itemCharges.quantity
          ),
        }),
        parent: this.mediaBody,
      });
    }
    this.description = createElement("div", {
      classList: ["font-size-sm"],
      parent: this.mediaBody,
    });
    this.description.innerHTML = this.purchase.getTemplatedDescription(
      game.shop
    );
    this.currentDescription = createElement("div", {
      classList: ["font-size-sm"],
      parent: this.mediaBody,
    });
    if (this.purchase.currentDescription !== undefined) {
      this.currentDescription.textContent =
        this.game.shop.getCurrentDescription(this.purchase);
    } else {
      this.currentDescription.classList.add("d-none");
    }
    this.mediaBody.appendChild(this.costContainer);
    this.parent.appendChild(this.container);
  }
  destroy() {
    super.destroy();
    this.parent.removeChild(this.container);
  }
  updateItemChargeDescription() {
    if (
      this.itemChargeDescription !== undefined &&
      this.purchase.contains.itemCharges !== undefined
    ) {
      const item = this.purchase.contains.itemCharges.item;
      if (this.game.isItemOwned(item)) {
        this.itemChargeDescription.ownedCharges.textContent = templateString(
          getLangString("MENU_TEXT", "CURRENT_CHARGES"),
          { count: formatNumber(this.game.itemCharges.getCharges(item)) }
        );
        this.itemChargeDescription.owned.textContent = getLangString(
          "MENU_TEXT",
          "OWNED"
        );
        this.itemChargeDescription.owned.classList.add("badge-success");
        this.itemChargeDescription.owned.classList.remove("badge-danger");
        showElement(this.itemChargeDescription.ownedCharges);
      } else {
        this.itemChargeDescription.owned.textContent = getLangString(
          "MISC_STRING",
          "NOT_OWNED"
        );
        this.itemChargeDescription.owned.classList.add("badge-danger");
        this.itemChargeDescription.owned.classList.remove("badge-success");
        hideElement(this.itemChargeDescription.ownedCharges);
      }
    }
  }
  updateCurrentDescription() {
    if (this.purchase.currentDescription !== undefined) {
      this.currentDescription.textContent =
        this.game.shop.getCurrentDescription(this.purchase);
    }
  }
  updateForBuyQtyChange() {
    if (this.purchase.allowQuantityPurchase) {
      const maxPurchases = this.game.shop.capPurchaseQuantity(
        this.purchase,
        this.buyQty
      );
      this.name.textContent = `${numberWithCommas(maxPurchases)} x ${
        this.purchase.name
      }`;
      this.description.innerHTML = this.purchase.getTemplatedDescription(
        this.game.shop
      );
    }
    if (
      this.purchase.contains.itemCharges !== undefined &&
      this.buyChargeQty !== undefined
    ) {
      this.buyChargeQty.textContent = templateLangString(
        "MENU_TEXT",
        "PLUS_CHARGES",
        {
          count: numberWithCommas(
            this.purchase.contains.itemCharges.quantity * this.buyQty
          ),
        }
      );
    }
    this.updateCostElements();
  }
}
class QuickBuyItem extends ShopItem {
  constructor(purchase, game, parent) {
    super(purchase, game, parent);
    const buyContainer = createElement("div", {
      classList: ["ml-3"],
      parent: this.container,
    });
    this.quantityMenu = new ShopBuyQuantityMenu(buyContainer);
  }
}
class ShopBuyQuantityMenu {
  constructor(parent, buyOptions = [1, 10, 100, 1000]) {
    this.parent = parent;
    this.container = createElement("div", { classList: ["dropdown", "mr-2"] });
    this.button = createElement("button", {
      classList: ["btn", "btn-info", "dropdown-toggle", "shop-buy-qty-btn"],
      id: `shop-buy-qty-btn-${ShopBuyQuantityMenu.menuCount}`,
      attributes: [
        ["type", "button"],
        ["data-toggle", "dropdown"],
        ["aria-haspopup", "true"],
        ["aria-expanded", "false"],
      ],
      text: "Buy x1",
      parent: this.container,
    });
    this.container.onclick = (event) => {
      event.fromBuyQuantityDropdown = true;
    };
    const optionsContainer = createElement("div", {
      classList: ["dropdown-menu", "dropdown-menu-right", "font-size-sm"],
      attributes: [
        ["x-placement", "bottom-end"],
        [
          "style",
          "position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(83px, 28px, 0px);z-index: 10000;",
        ],
      ],
      parent: this.container,
    });
    buyOptions.forEach((value) => {
      optionsContainer.appendChild(this.createBuyOption(value));
    });
    optionsContainer.appendChild(
      createElement("div", {
        classList: ["dropdown-divider"],
        attributes: [["role", "separator"]],
      })
    );
    const buttonID = `dropdown-content-custom-amount-${ShopBuyQuantityMenu.menuCount}`;
    const customContainer = createElement("div", {
      classList: ["p-2", "form-group"],
      parent: optionsContainer,
    });
    createElement("label", {
      attributes: [["for", buttonID]],
      text: getLangString("SHOP_MISC", "9"),
      parent: customContainer,
    });
    this.input = createElement("input", {
      classList: ["form-control"],
      attributes: [
        ["type", "number"],
        ["name", buttonID],
        ["placeholder", "100"],
      ],
      id: buttonID,
      parent: customContainer,
    });
    const callback = () => this.onCustomChange();
    this.input.onchange = callback;
    this.input.onkeyup = callback;
    this.input.oninput = callback;
    this.parent.appendChild(this.container);
    ShopBuyQuantityMenu.menuCount++;
  }
  destroy() {
    this.parent.removeChild(this.container);
  }
  createBuyOption(value) {
    const option = createElement("a", {
      classList: ["dropdown-item"],
      text: `x${numberWithCommas(value)}`,
    });
    option.onclick = () => game.shop.updateBuyQuantity(value);
    return option;
  }
  onCustomChange() {
    const customQty = parseInt(this.input.value);
    if (!Number.isNaN(customQty) && customQty > 0) {
      game.shop.updateBuyQuantity(customQty);
    }
  }
}
ShopBuyQuantityMenu.menuCount = 0;
class ShopTabMenu {
  constructor(parent, _category, game) {
    this.parent = parent;
    this._category = _category;
    this.game = game;
    this.items = new Map();
    this.isOpen = true;
    this.purchases = this.game.shop.purchaseDisplayOrder.filter(
      (purchase) => purchase.category === this._category
    );
    this.icon = this.createHeader();
    this.hideBlock = createElement("div");
    this.itemsContainer = this.hideBlock
      .appendChild(createElement("div", { classList: ["p-3"] }))
      .appendChild(
        createElement("div", { classList: ["row", "gutters-tiny", "row-deck"] })
      );
    this.updateItemSelection();
    this.parent.appendChild(this.hideBlock);
  }
  get category() {
    return this._category;
  }
  updateItemSelection() {
    let lastItem;
    this.purchases.forEach((purchase) => {
      let existingItem = this.items.get(purchase);
      const shouldShow = this.shouldShowItem(purchase);
      if (shouldShow) {
        if (existingItem === undefined) {
          const container = createElement("div", {
            classList: ["col-12", "col-lg-6", "col-xl-4", "p-2"],
          });
          const link = createElement("a", {
            classList: [
              "block",
              "block-content",
              "block-rounded",
              "block-link-pop",
              "pointer-enabled",
              "border",
              "border-2x",
            ],
            parent: container,
          });
          link.onclick = () => this.game.shop.buyItemOnClick(purchase);
          const item = new ShopItem(purchase, this.game, link);
          if (lastItem !== undefined) {
            lastItem.container.after(container);
          } else {
            this.itemsContainer.prepend(container);
          }
          existingItem = { container, item };
          this.items.set(purchase, existingItem);
        }
        if (shouldShow === 2) existingItem.item.setToBuyLimit();
        lastItem = existingItem;
      } else if (existingItem !== undefined) {
        existingItem.item.destroy();
        this.itemsContainer.removeChild(existingItem.container);
        this.items.delete(purchase);
      }
    });
  }
  updatePurchaseCosts() {
    this.items.forEach(({ item }) => {
      item.updateCostElements();
    });
  }
  updateForBuyQtyChange() {
    this.items.forEach(({ item }) => {
      item.updateForBuyQtyChange();
    });
  }
  updatePurchaseRequirements() {
    this.items.forEach(({ item }) => {
      item.updatePurchaseRequirements();
    });
  }
  updateForItemChargeChange() {
    this.items.forEach(({ item }) => {
      item.updateItemChargeDescription();
    });
  }
  updateCurrentItemDescription(purchase) {
    var _a;
    (_a = this.items.get(purchase)) === null || _a === void 0
      ? void 0
      : _a.item.updateCurrentDescription();
  }
  shouldShowItem(purchase) {
    if (this.game.shop.isPurchaseAtBuyLimit(purchase))
      return purchase.showBuyLimit ? 2 : 0;
    if (purchase.unlockRequirements.length > 0) {
      return this.game.checkRequirements(purchase.unlockRequirements, false)
        ? 1
        : 0;
    }
    return 1;
  }
  createHeader() {
    const mainBlock = createElement("div", {
      classList: ["block-header", "block-header-default", "pointer-enabled"],
    });
    mainBlock.onclick = (event) => {
      if (!event.fromBuyQuantityDropdown) this.toggle();
    };
    const title = createElement("h3", { classList: ["block-title"] });
    title.append(
      createElement("i", {
        classList: ["fa", "fa-briefcase", "text-muted", "mr-1"],
      }),
      this._category.name
    );
    const options = createElement("div", { classList: ["block-options"] });
    if (this.purchases.some((purchase) => purchase.allowQuantityPurchase)) {
      this.qtyMenu = new ShopBuyQuantityMenu(options);
    }
    const icon = createElement("i", { classList: ["far", "fa-eye"] });
    options.append(icon);
    mainBlock.append(title, options);
    this.parent.appendChild(mainBlock);
    return icon;
  }
  toggle() {
    if (this.isOpen) {
      this.icon.classList.add("fa-eye-slash");
      this.icon.classList.remove("fa-eye");
      hideElement(this.hideBlock);
    } else {
      this.icon.classList.add("fa-eye");
      this.icon.classList.remove("fa-eye-slash");
      showElement(this.hideBlock);
    }
    this.isOpen = !this.isOpen;
  }
}
class ShopMenu {
  constructor(
    game,
    containerID = "new-shop",
    quickBuyID = "quick-buy-item-content"
  ) {
    this.game = game;
    this.categorySelects = new Map();
    this.tabs = new Map();
    this.shownTabs = new Set();
    const categoryContainer = document.getElementById("shop-tab-container");
    if (categoryContainer === null)
      throw new Error(
        `Cannot create shop menu, element with id: shop-tab-container does not exist.`
      );
    game.shop.categoryDisplayOrder.forEach((category) => {
      const listItem = createElement("li", {
        className: `nav-main-item${category.isGolbinRaid ? " d-none" : ""}`,
      });
      const link = createElement("a", {
        className: "nav-main-link active",
        parent: listItem,
      });
      link.onclick = () => this.showSingleTab(category);
      createElement("img", {
        className: "skill-icon-xs m-0 mr-2",
        attributes: [["src", category.media]],
        parent: link,
      });
      createElement("span", {
        className: "nav-main-link-name",
        text: category.name,
        parent: link,
      });
      categoryContainer.append(listItem);
    });
    const cont = document.getElementById(containerID);
    if (cont === null)
      throw new Error(
        `Cannot create shop menu, element with id: ${containerID} does not exist.`
      );
    this.container = cont;
    game.shop.categories.forEach((category) => {
      this.tabs.set(category, this.createShopTab(category));
    });
    const quickCont = document.getElementById(quickBuyID);
    if (quickCont === null)
      throw new Error(
        `Cannot create shop menu, element with id: ${containerID} does not exist.`
      );
    this.quickbuyContainer = quickCont;
    const quickBuyButton = document.getElementById("quick-buy-item-button");
    if (quickBuyButton === null)
      throw new Error(`Cannot create shop menu, quickBuyButton not found.`);
    this.quickBuyButton = quickBuyButton;
    this.quickbuyMenu = new QuickBuyItem(
      this.game.shop.purchases.firstObject,
      this.game,
      this.quickbuyContainer
    );
  }
  createShopTab(category) {
    const container = createElement("div", {
      classList: ["block", "d-none"],
      parent: this.container,
    });
    const menu = new ShopTabMenu(container, category, this.game);
    return { menu, container };
  }
  updateItemPostPurchase(purchase) {
    var _a;
    (_a = this.tabs.get(purchase.category)) === null || _a === void 0
      ? void 0
      : _a.menu.updateCurrentItemDescription(purchase);
  }
  updateForCostChange() {
    var _a;
    this.shownTabs.forEach((tab) => {
      tab.menu.updatePurchaseCosts();
    });
    (_a = this.confirmBuyItem) === null || _a === void 0
      ? void 0
      : _a.updateCostElements();
    this.quickbuyMenu.updateCostElements();
  }
  updateForRequirementChange() {
    var _a;
    this.shownTabs.forEach((tab) => {
      tab.menu.updatePurchaseRequirements();
    });
    (_a = this.confirmBuyItem) === null || _a === void 0
      ? void 0
      : _a.updatePurchaseRequirements();
    this.quickbuyMenu.updatePurchaseRequirements();
  }
  updateForItemChargeChange() {
    this.shownTabs.forEach((tab) => {
      tab.menu.updateForItemChargeChange();
    });
    this.quickbuyMenu.updateItemChargeDescription();
  }
  updateForBuyQtyChange() {
    var _a;
    this.shownTabs.forEach(({ menu }) => {
      menu.updateForBuyQtyChange();
    });
    (_a = this.confirmBuyItem) === null || _a === void 0
      ? void 0
      : _a.updateForQuantityChange();
    this.quickbuyMenu.updateForBuyQtyChange();
  }
  showTab(category) {
    const tab = this.tabs.get(category);
    if (tab === undefined)
      throw new Error(`Tried to show tab for invalid category: ${category}`);
    if (this.shownTabs.has(tab)) return;
    tab.menu.updatePurchaseRequirements();
    tab.menu.updateForItemChargeChange();
    tab.menu.updateForBuyQtyChange();
    showElement(tab.container);
    this.shownTabs.add(tab);
  }
  hideTab(category) {
    const tab = this.tabs.get(category);
    if (tab === undefined)
      throw new Error(`Tried to hide tab for invalid category: ${category}`);
    if (!this.shownTabs.has(tab)) return;
    hideElement(tab.container);
    this.shownTabs.delete(tab);
  }
  showCategoryButton(category) {
    var _a;
    (_a = this.categorySelects.get(category)) === null || _a === void 0
      ? void 0
      : _a.classList.remove("d-none");
  }
  hideCategoryButton(category) {
    var _a;
    (_a = this.categorySelects.get(category)) === null || _a === void 0
      ? void 0
      : _a.classList.add("d-none");
  }
  showAllTabsButRaid() {
    this.tabs.forEach((_, category) => {
      if (category.isGolbinRaid) {
        this.hideTab(category);
        this.hideCategoryButton(category);
      } else {
        this.showTab(category);
        this.showCategoryButton(category);
      }
    });
    $("#horizontal-navigation-shop").attr("class", "d-lg-block mt-2 mt-lg-0");
    $("#shop-current-raid-coins-tooltip").addClass("d-none");
    $("#shop-current-slayer-c").removeClass("d-none");
    $("#shop-current-gp-1").removeClass("d-none");
  }
  showAllRaidTabs() {
    let raidTabs = 0;
    this.tabs.forEach((_, category) => {
      if (!category.isGolbinRaid) {
        this.hideTab(category);
        this.hideCategoryButton(category);
      } else {
        this.showTab(category);
        this.showCategoryButton(category);
        raidTabs++;
      }
    });
    if (raidTabs > 1) {
      $("#horizontal-navigation-shop").attr("class", "d-lg-block mt-2 mt-lg-0");
    } else {
      $("#horizontal-navigation-shop").attr("class", "d-none");
    }
    $("#shop-current-raid-coins-tooltip").removeClass("d-none");
    $("#shop-current-slayer-c").addClass("d-none");
    $("#shop-current-gp-1").addClass("d-none");
  }
  hideAllTabs() {
    this.shownTabs.forEach((tab) => {
      hideElement(tab.container);
    });
    this.shownTabs.clear();
  }
  showSingleTab(category) {
    this.hideAllTabs();
    this.showTab(category);
  }
  changeQuickBuyItem(purchase) {
    this.quickbuyMenu.destroy();
    this.quickbuyMenu = new QuickBuyItem(
      purchase,
      this.game,
      this.quickbuyContainer
    );
    this.quickBuyButton.onclick = () => this.game.shop.buyItemOnClick(purchase);
  }
  updateQuickBuy() {
    this.quickbuyMenu.updateForBuyQtyChange();
    this.quickbuyMenu.updatePurchaseRequirements();
  }
  showConfirmBuyPrompt(purchase) {
    if (this.confirmBuyItem !== undefined)
      throw new Error(
        "Tried to show confirm buy prompt when item already exists"
      );
    this.confirmBuyItem = new ShopConfirmModalItem(purchase, this.game);
    SwalLocale.fire({
      title: purchase.allowQuantityPurchase
        ? templateLangString("SHOP_MISC", "10", {
            qty: `${this.game.shop.buyQuantity}`,
            shopName: purchase.name,
          })
        : templateLangString("SHOP_MISC", "7", { shopName: purchase.name }),
      html: this.confirmBuyItem.parent,
      imageUrl: purchase.media,
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: getLangString("SHOP_MISC", "8"),
      showCancelButton: true,
      confirmButtonText: getLangString("SHOP_MISC", "8"),
    }).then((result) => {
      var _a;
      if (result.value) {
        this.game.shop.buyItemOnClick(purchase, true);
      }
      (_a = this.confirmBuyItem) === null || _a === void 0
        ? void 0
        : _a.destroy();
      this.confirmBuyItem = undefined;
    });
  }
}
