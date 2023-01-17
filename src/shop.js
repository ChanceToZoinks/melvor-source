"use strict";
class ShopCategory extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this.isGolbinRaid = false;
    this._name = data.name;
    this._media = data.media;
    if (data.isGolbinRaid !== undefined) this.isGolbinRaid = data.isGolbinRaid;
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("SHOP_CAT", this.localID);
    }
  }
  get media() {
    return this.getMediaURL(this._media);
  }
}
function isShopCostZero(cost) {
  return cost.type === "Fixed" && cost.cost === 0;
}
class ShopPurchase extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this.purchaseRequirements = [];
    this._buyLimitOverrides = new Map();
    this._media = data.media;
    const category = game.shop.categories.getObjectByID(data.category);
    if (category === undefined)
      throw new Error(
        `Error constructing ShopPurchase with id ${this.id}. ShopCategory with id: ${data.category} is not registered.`
      );
    this.category = category;
    this.contains = { items: game.items.getQuantities(data.contains.items) };
    if (data.contains.itemCharges !== undefined)
      this.contains.itemCharges = game.items.equipment.getQuantity(
        data.contains.itemCharges
      );
    if (data.contains.modifiers !== undefined)
      this.contains.modifiers = game.getPlayerModifiersFromData(
        data.contains.modifiers
      );
    if (data.contains.petID !== undefined) {
      const pet = game.pets.getObjectByID(data.contains.petID);
      if (pet === undefined)
        throw new Error(
          `Error constructing ShopPurchase with id: ${this.id}. Pet with id: ${data.contains.petID} is not registered`
        );
      this.contains.pet = pet;
    }
    if (data.contains.lootBox) this.contains.lootBox = data.contains.lootBox;
    this.costs = {
      gp: data.cost.gp,
      slayerCoins: data.cost.slayerCoins,
      raidCoins: data.cost.raidCoins,
      items: game.items.getQuantities(data.cost.items),
    };
    this.unlockRequirements = data.unlockRequirements.map((data) =>
      game.getShopPurchaseRequirement(data)
    );
    data.buyLimitOverrides.forEach(({ gamemodeID, maximum }) => {
      const mode = game.gamemodes.getObjectByID(gamemodeID);
      if (mode === undefined)
        throw new Error(
          `Error constructing ShopPurchase with id: ${this.id}. Gamemode with id: ${gamemodeID} is not registered.`
        );
      this._buyLimitOverrides.set(mode, maximum);
    });
    this._defaultBuyLimit = data.defaultBuyLimit;
    this.allowQuantityPurchase = data.allowQuantityPurchase;
    this.showBuyLimit = data.showBuyLimit;
    this.currentDescription = data.currentDescription;
    this._customName = data.customName;
    this._customDescription = data.customDescription;
    game.queueForSoftDependencyReg(data, this);
  }
  get media() {
    return this.getMediaURL(this._media);
  }
  get name() {
    if (this._customName !== undefined) {
      if (this.isModded) {
        return this._customName;
      } else {
        return getLangString("SHOP_NAME", this.localID);
      }
    }
    if (this.contains.itemCharges !== undefined) {
      return this.contains.itemCharges.item.name;
    }
    if (this.contains.items.length > 0) {
      return this.contains.items[0].item.name;
    }
    if (this.contains.pet !== undefined) {
      return this.contains.pet.name;
    }
    return "Error: No Purchase Name.";
  }
  get description() {
    if (this._customDescription !== undefined) {
      if (this.isModded) {
        return this._customDescription;
      } else {
        return getLangString("SHOP_DESCRIPTION", this.localID);
      }
    }
    if (this.contains.itemCharges !== undefined) {
      return this.contains.itemCharges.item.description;
    }
    if (this.contains.items.length > 0) {
      return this.contains.items[0].item.description;
    }
    if (this.contains.pet !== undefined) {
      return this.contains.pet.description;
    }
    if (this.contains.modifiers !== undefined) {
      return describeModifierDataPlain(this.contains.modifiers);
    }
    return "Error: No Purchase Description";
  }
  registerSoftDependencies(data, game) {
    this.purchaseRequirements = data.purchaseRequirements.map((data) =>
      game.getRequirementFromData(data)
    );
  }
  applyDataModification(modData, game) {
    var _a;
    (_a = modData.buyLimitOverrides) === null || _a === void 0
      ? void 0
      : _a.forEach(({ gamemodeID, maximum }) => {
          const mode = game.gamemodes.getObjectByID(gamemodeID);
          if (mode === undefined)
            throw new Error(
              `Error modifying ShopPurchase with id: ${this.id}. Gamemode with id: ${gamemodeID} is not registered.`
            );
          this._buyLimitOverrides.set(mode, maximum);
        });
  }
  getBuyLimit(gamemode) {
    var _a;
    let limit =
      (_a = this._buyLimitOverrides.get(gamemode)) !== null && _a !== void 0
        ? _a
        : this._defaultBuyLimit;
    if (limit === 0) limit = Infinity;
    return limit;
  }
  getTemplatedDescription(shop) {
    return templateString(
      this.description,
      this.getDescriptionTemplateData(
        shop.capPurchaseQuantity(this, shop.buyQuantity)
      )
    );
  }
  getDescriptionTemplateData(buyQuantity) {
    const templateData = {};
    templateData.qty = numberWithCommas(buyQuantity);
    this.contains.items.forEach(({ quantity }, i) => {
      templateData[`qty${i + 1}`] = numberWithCommas(quantity * buyQuantity);
    });
    return templateData;
  }
}
class DummyShopPurchase extends ShopPurchase {
  constructor(namespace, id, game) {
    super(
      namespace,
      {
        id,
        media: "assets/media/main/question.svg",
        category: "melvorD:SkillUpgrades",
        contains: { items: [] },
        cost: {
          gp: { type: "Fixed", cost: 0 },
          slayerCoins: { type: "Fixed", cost: 0 },
          items: [],
          raidCoins: { type: "Fixed", cost: 0 },
        },
        allowQuantityPurchase: false,
        unlockRequirements: [],
        purchaseRequirements: [],
        defaultBuyLimit: 0,
        buyLimitOverrides: [],
        showBuyLimit: false,
      },
      game
    );
  }
}
class ShopUpgradeChain extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    const upgrade = game.shop.purchases.getObjectByID(data.rootUpgradeID);
    if (upgrade === undefined)
      throw new UnregisteredConstructionError(
        this,
        ShopPurchase.name,
        data.rootUpgradeID
      );
    this.rootUpgrade = upgrade;
    this._chainName = data.chainName;
    this._defaultName = data.defaultName;
    this._defaultDescription = data.defaultDescription;
    this.nameLang = data.defaultNameLang;
    this.descriptionLang = data.descriptionLang;
    this.chainNameLang = data.chainNameLang;
  }
  get chainName() {
    if (this.chainNameLang !== undefined)
      return getLangString(this.chainNameLang.category, this.chainNameLang.id);
    return this._chainName;
  }
  get defaultName() {
    if (this.nameLang !== undefined)
      return getLangString(this.nameLang.category, this.nameLang.id);
    return this._defaultName;
  }
  get defaultDescription() {
    if (this.descriptionLang !== undefined)
      return getLangString(
        this.descriptionLang.category,
        this.descriptionLang.id
      );
    return this._defaultDescription;
  }
  applyDataModification(modData, game) {
    if (modData.rootUpgradeID !== undefined) {
      const upgrade = game.shop.purchases.getObjectByID(modData.rootUpgradeID);
      if (upgrade === undefined)
        throw new UnregisteredApplyDataModError(
          this,
          ShopPurchase.name,
          modData.rootUpgradeID
        );
      this.rootUpgrade = upgrade;
    }
  }
}
class ShopRenderQueue {
  constructor() {
    this.requirements = false;
    this.costs = false;
    this.upgrades = false;
  }
}
class Shop {
  constructor(game) {
    this.game = game;
    this.modifiers = new MappedModifiers();
    this.raidStats = { modifiers: new MappedModifiers() };
    this.upgradesPurchased = new Map();
    this.buyQuantity = 1;
    this.purchasesByItem = new Map();
    this.renderQueue = new ShopRenderQueue();
    this.purchases = new NamespaceRegistry(game.registeredNamespaces);
    this.upgradeChains = new NamespaceRegistry(game.registeredNamespaces);
    this.purchaseDisplayOrder = new NamespacedArray(this.purchases);
    this.categories = new NamespaceRegistry(game.registeredNamespaces);
    this.categoryDisplayOrder = new NamespacedArray(this.categories);
  }
  onLoad() {
    this.computeProvidedStats(false);
    this.renderQueue.upgrades = true;
    this.updateBuyQuantity(this.buyQuantity);
  }
  render() {
    this.renderCosts();
    this.renderRequirements();
    this.renderUpgrades();
  }
  renderCosts() {
    if (!this.renderQueue.costs) return;
    shopMenu.updateForCostChange();
    this.renderQueue.costs = false;
  }
  renderRequirements() {
    if (!this.renderQueue.requirements) return;
    shopMenu.updateForRequirementChange();
    this.renderQueue.requirements = false;
  }
  renderUpgrades() {
    if (!this.renderQueue.upgrades) return;
    if (this.game.modifiers.increasedTreeCutLimit > 0)
      $("#skill-woodcutting-multitree").removeClass("d-none");
    combatMenus.slayerTask.toggleAutoSlayerCheckbox(
      this.game.modifiers.autoSlayerUnlocked > 0
    );
    this.upgradeChains.forEach((chain) => {
      var _a;
      const lowestPurchase = this.getLowestUpgradeInChain(chain.rootUpgrade);
      const upgradeName =
        (_a =
          lowestPurchase === null || lowestPurchase === void 0
            ? void 0
            : lowestPurchase.name) !== null && _a !== void 0
          ? _a
          : chain.defaultName;
      let upgradeDesc;
      if (lowestPurchase !== undefined) {
        const totalModifiers = this.getTotalModifierInChain(lowestPurchase);
        upgradeDesc = totalModifiers
          .getActiveModifierDescriptions()
          .map(
            ([text, textClass]) => `<span class="${textClass}">${text}</span>`
          )
          .join("<br>");
      } else {
        upgradeDesc = chain.defaultDescription;
      }
      const chainDisplays = document.querySelectorAll(
        `upgrade-chain-display[data-upgrade-chain-id="${chain.id}"]`
      );
      chainDisplays.forEach((chainDisplay) => {
        chainDisplay.setUpgrade(upgradeName, upgradeDesc);
      });
    });
    this.renderQueue.upgrades = false;
  }
  initUpgradeChainDisplays() {
    this.upgradeChains.forEach((chain) => {
      const chainDisplays = document.querySelectorAll(
        `upgrade-chain-display[data-upgrade-chain-id="${chain.id}"]`
      );
      chainDisplays.forEach((chainDisplay) => {
        chainDisplay.initialize(chain);
      });
    });
  }
  postDataRegistration() {
    this.purchases.forEach((purchase) => {
      purchase.contains.items.forEach(({ item }) => {
        this.purchasesByItem.set(item, purchase);
      });
      if (purchase.contains.itemCharges !== undefined) {
        this.purchasesByItem.set(purchase.contains.itemCharges.item, purchase);
      }
    });
  }
  getTotalUpgradesPurchased(golbinRaid) {
    let totalCount = 0;
    this.upgradesPurchased.forEach((count, purchase) => {
      if (purchase.category.isGolbinRaid === golbinRaid) totalCount += count;
    });
    return totalCount;
  }
  isUpgradePurchased(upgrade) {
    return this.upgradesPurchased.has(upgrade);
  }
  getPurchaseCount(purchase) {
    var _a;
    return (_a = this.upgradesPurchased.get(purchase)) !== null && _a !== void 0
      ? _a
      : 0;
  }
  isPurchaseAtBuyLimit(purchase) {
    return (
      purchase.getBuyLimit(this.game.currentGamemode) <=
      this.getPurchaseCount(purchase)
    );
  }
  getQuickBuyPurchase(item) {
    return this.purchasesByItem.get(item);
  }
  getLowestUpgradeInChain(purchase) {
    while (true) {
      if (this.isUpgradePurchased(purchase)) return purchase;
      if (purchase.unlockRequirements[0] !== undefined) {
        purchase = purchase.unlockRequirements[0].purchase;
      } else {
        return undefined;
      }
    }
  }
  getTotalModifierInChain(purchase) {
    const totalModifiers = new MappedModifiers();
    while (purchase.unlockRequirements.length > 0) {
      if (purchase.contains.modifiers !== undefined)
        totalModifiers.addModifiers(purchase.contains.modifiers);
      purchase = purchase.unlockRequirements[0].purchase;
    }
    return totalModifiers;
  }
  capPurchaseQuantity(purchase, buyQuantity) {
    const buyLimit = purchase.getBuyLimit(this.game.currentGamemode);
    const existingPurchases = this.getPurchaseCount(purchase);
    return Math.min(buyQuantity, buyLimit - existingPurchases);
  }
  getPurchaseCosts(purchase, quantity) {
    const costs = new Costs(this.game);
    const amountBought = this.getPurchaseCount(purchase);
    costs.addGP(
      this.getCurrencyCost(purchase.costs.gp, quantity, amountBought)
    );
    costs.addSlayerCoins(
      this.getCurrencyCost(purchase.costs.slayerCoins, quantity, amountBought)
    );
    costs.addRaidCoins(
      this.getCurrencyCost(purchase.costs.raidCoins, quantity, amountBought)
    );
    purchase.costs.items.forEach((itemCost) => {
      costs.addItem(itemCost.item, quantity * itemCost.quantity);
    });
    return costs;
  }
  quickBuyItemOnClick(purchase) {
    shopMenu.changeQuickBuyItem(purchase);
    this.updateBuyQuantity(this.buyQuantity);
    $("#modal-quick-buy-item").modal("show");
  }
  buyItemOnClick(purchase, confirmed = false) {
    var _a;
    if (
      !this.game.tutorial.complete &&
      !this.game.tutorial.allowedShopPurchases.has(purchase)
    ) {
      SwalLocale.fire({
        title: getLangString("MENU_TEXT", "SHOP_ITEM_LOCKED"),
        html: `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${
          purchase.media
        }"> ${getLangString("TUTORIAL", "SHOP_LOCKED")}</h5>
        <h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString(
          "TUTORIAL",
          "CONTINUE_TUTORIAL_SHOP"
        )}</h5>`,
        icon: "warning",
      });
      return;
    }
    let quantityToBuy = 1;
    if (purchase.allowQuantityPurchase) {
      quantityToBuy = this.capPurchaseQuantity(purchase, this.buyQuantity);
    }
    const costs = this.getPurchaseCosts(purchase, quantityToBuy);
    const canBuy =
      !this.isPurchaseAtBuyLimit(purchase) &&
      costs.checkIfOwned() &&
      this.game.checkRequirements(purchase.purchaseRequirements);
    if (!canBuy) return;
    if (!confirmed && this.game.settings.showShopConfirmations) {
      shopMenu.showConfirmBuyPrompt(purchase);
      return;
    }
    const itemsToAdd = purchase.contains.items.map(({ item, quantity }) => {
      quantity *= quantityToBuy;
      return { item, quantity };
    });
    if (
      purchase.contains.itemCharges !== undefined &&
      !this.game.isItemOwned(purchase.contains.itemCharges.item)
    ) {
      itemsToAdd.push({
        item: purchase.contains.itemCharges.item,
        quantity: 1,
      });
    }
    if (!this.game.bank.willItemsFit(itemsToAdd)) {
      bankFullNotify();
      return;
    }
    costs.consumeCosts();
    costs.recordBulkItemStat(this.game.stats.Shop, ShopStats.ItemsSpent);
    this.game.stats.Shop.add(ShopStats.GPSpent, costs.gp);
    this.game.stats.Shop.add(ShopStats.SCSpent, costs.sc);
    this.game.stats.Shop.add(ShopStats.RCSpent, costs.raidCoins);
    this.game.stats.Shop.inc(ShopStats.PurchasesMade);
    let savePurchase = purchase.contains.modifiers !== undefined;
    if (purchase.contains.pet !== undefined) {
      this.game.petManager.unlockPet(purchase.contains.pet);
      savePurchase = true;
    }
    if (purchase.contains.lootBox) {
      this.game.golbinRaid.openGolbinCrate();
      savePurchase = true;
    }
    itemsToAdd.forEach(({ item, quantity }) => {
      this.game.bank.addItem(item, quantity, false, true);
      this.game.stats.Shop.add(ShopStats.ItemsPurchased, quantity);
    });
    if (purchase.contains.itemCharges !== undefined) {
      const chargesToAdd =
        purchase.contains.itemCharges.quantity * quantityToBuy;
      this.game.itemCharges.addCharges(
        purchase.contains.itemCharges.item,
        chargesToAdd
      );
      this.game.stats.Shop.add(ShopStats.GloveChargesPurchased, chargesToAdd);
    }
    this.game.processEvent(new ShopPurchaseMadeEvent(purchase, quantityToBuy));
    if (savePurchase) {
      this.upgradesPurchased.set(
        purchase,
        this.getPurchaseCount(purchase) + quantityToBuy
      );
      this.renderQueue.upgrades = true;
      this.game.queueRequirementRenders();
      this.game.woodcutting.renderQueue.treeUnlocks = true;
      this.game.mining.renderQueue.rockUnlock = true;
    }
    if (purchase.contains.modifiers !== undefined) this.computeProvidedStats();
    $("#modal-quick-buy-item").modal("hide");
    (_a = shopMenu.tabs.get(purchase.category)) === null || _a === void 0
      ? void 0
      : _a.menu.updateItemSelection();
    shopMenu.updateItemPostPurchase(purchase);
  }
  updateBuyQuantity(quantity) {
    this.buyQuantity = quantity;
    $(".shop-buy-qty-btn").text(
      templateLangString("MENU_TEXT", "BUY_X", {
        num: formatNumber(this.buyQuantity),
      })
    );
    shopMenu.updateForBuyQtyChange();
  }
  encode(writer) {
    writer.writeMap(this.upgradesPurchased, writeNamespaced, (count, writer) =>
      writer.writeUint32(count)
    );
    writer.writeFloat64(this.buyQuantity);
    return writer;
  }
  decode(reader, version) {
    this.upgradesPurchased = reader.getMap(
      (reader) => {
        const purchase = reader.getNamespacedObject(this.purchases);
        if (typeof purchase === "string") {
          if (purchase.startsWith("melvor")) {
            return this.purchases.getDummyObject(
              purchase,
              DummyShopPurchase,
              this.game
            );
          } else return undefined;
        }
        return purchase;
      },
      (reader) => reader.getUint32()
    );
    this.buyQuantity = reader.getFloat64();
  }
  computeProvidedStats(updatePlayers = true) {
    this.modifiers.reset();
    this.raidStats.modifiers.reset();
    this.upgradesPurchased.forEach((count, purchase) => {
      if (purchase.contains.modifiers !== undefined) {
        if (purchase.category.isGolbinRaid)
          this.raidStats.modifiers.addModifiers(
            purchase.contains.modifiers,
            count,
            count
          );
        else
          this.modifiers.addModifiers(
            purchase.contains.modifiers,
            count,
            count
          );
      }
    });
    if (updatePlayers) {
      this.game.combat.player.computeAllStats();
      this.game.golbinRaid.player.computeAllStats();
    }
  }
  getCurrencyCost(cost, buyQuantity, boughtQuantity) {
    const newQuantity = buyQuantity + boughtQuantity;
    switch (cost.type) {
      case "Linear":
        return (
          (cost.scaling / 2) *
            (newQuantity * (newQuantity - 1) -
              boughtQuantity * (boughtQuantity - 1)) +
          buyQuantity * cost.initial
        );
      case "Glove":
        return (
          cost.cost * buyQuantity * (this.game.merchantsPermitRead ? 0.9 : 1)
        );
      case "BankSlot": {
        let cost = 0;
        for (let i = boughtQuantity; i < newQuantity; i++) {
          const nextCost = newNewBankUpgradeCost.level_to_gp(i + 2);
          if (nextCost < 5000000) {
            cost += nextCost;
          } else {
            return cost + (newQuantity - i) * 5000000;
          }
        }
        return cost;
      }
      case "Fixed":
        return cost.cost * buyQuantity;
    }
  }
  getCurrentDescription(purchase) {
    if (
      purchase.currentDescription !== undefined &&
      purchase.contains.modifiers !== undefined
    ) {
      let firstModValue = Object.values(purchase.contains.modifiers)[0];
      if (!(typeof firstModValue === "number")) {
        firstModValue = firstModValue[0].value;
      }
      firstModValue *= this.getPurchaseCount(purchase);
      switch (purchase.currentDescription) {
        case "Decrease":
          return templateLangString("MENU_TEXT", "CURRENTLY_QTY_DEC", {
            qty: formatNumber(firstModValue),
          });
        case "Increase":
          return templateLangString("MENU_TEXT", "CURRENTLY_QTY_INC", {
            qty: formatNumber(firstModValue),
          });
        case "PercentDecrease":
          return templateLangString("MENU_TEXT", "CURRENTLY_PERCENT_DEC", {
            percent: formatNumber(firstModValue),
          });
        case "PercentIncrease":
          return templateLangString("MENU_TEXT", "CURRENTLY_PERCENT_INC", {
            percent: formatNumber(firstModValue),
          });
        case "SecondsDecrease":
          return templateLangString("MENU_TEXT", "CURRENTLY_SECONDS_DEC", {
            seconds: formatFixed(firstModValue / 1000, 1),
          });
        case "SecondsIncrease":
          return templateLangString("MENU_TEXT", "CURRENTLY_SECONDS_INC", {
            seconds: formatFixed(firstModValue / 1000, 1),
          });
      }
    }
    return "";
  }
  convertFromOldFormat(save, idMap) {
    if (save.shopItemsPurchased !== undefined) {
      save.shopItemsPurchased.forEach((purchasedItem, oldPurchaseID) => {
        const newID = idMap.shopPurchase[oldPurchaseID];
        let purchase = this.purchases.getObjectByID(newID);
        if (purchase === undefined)
          purchase = this.purchases.getDummyObject(
            newID,
            DummyShopPurchase,
            this.game
          );
        if (
          (save.version > 17 &&
            purchase.category.id === "melvorD:GolbinRaid") ||
          purchase.category.id === "melvorF:Township"
        ) {
          purchasedItem.quantity = Math.min(
            purchasedItem.quantity,
            purchase.getBuyLimit(this.game.currentGamemode)
          );
        }
        if (newID === "melvorD:GolbinCrate")
          purchasedItem.quantity = this.game.golbinRaid.cratesPurchased;
        this.upgradesPurchased.set(purchase, purchasedItem.quantity);
      });
    }
    if (save.buyQty !== undefined) this.buyQuantity = save.buyQty;
  }
  removePurchasesAboveLimit() {
    let violationFound = false;
    this.upgradesPurchased.forEach((count, purchase) => {
      const newCount = Math.min(
        purchase.getBuyLimit(this.game.currentGamemode),
        count
      );
      this.upgradesPurchased.set(purchase, newCount);
      if (newCount !== count) violationFound = true;
    });
    if (violationFound) {
      this.computeProvidedStats(true);
      this.game.combat.player.updateForEquipSetChange();
      saveData();
    }
  }
}
class BankUpgradeCost {
  equate(gp) {
    return Math.floor(gp + 300 * Math.pow(2, gp / 7));
  }
  level_to_gp(level) {
    let gp = 0;
    for (let i = 1; i < level; i++) gp += this.equate(i);
    return Math.floor(gp / 2);
  }
  gp_to_level(gp) {
    let level = 1;
    while (this.level_to_gp(level) < gp) level++;
    return level;
  }
}
class NewNewBankUpgradeCost {
  equate(level) {
    return Math.floor(
      (2654570 * (50 * level)) / Math.pow(142015, 163 / (120 + level))
    );
  }
  level_to_gp(level) {
    const cost = this.equate(level);
    return cost;
  }
}
class NewBankUpgradeCost {
  equate(gp) {
    return Math.floor(gp + 300 * Math.pow(2, gp / 7));
  }
  level_to_gp(level) {
    let gp = 0;
    for (let i = 1; i < level; i++) gp += this.equate(i);
    return Math.floor(gp / 3);
  }
  gp_to_level(gp) {
    let level = 1;
    while (this.level_to_gp(level) < gp) level++;
    return level;
  }
}
const bankUpgradeCost = new BankUpgradeCost();
const newBankUpgradeCost = new NewBankUpgradeCost();
const newNewBankUpgradeCost = new NewNewBankUpgradeCost();
