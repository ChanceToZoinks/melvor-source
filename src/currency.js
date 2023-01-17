"use strict";
class Currency {
  constructor(game) {
    this.game = game;
    this._amount = 0;
    this.renderRequired = false;
  }
  get media() {
    return cdnMedia(this._media);
  }
  get amount() {
    return this._amount;
  }
  queueNotification(amount) {
    if (!this.shouldNotify) return;
    this.game.combat.notifications.add({
      type: "Currency",
      args: [this.media, amount],
    });
  }
  onLoad() {
    this.renderRequired = true;
  }
  onAmountChange() {
    this.renderRequired = true;
    this.game.shop.renderQueue.costs = true;
  }
  render() {
    if (!this.renderRequired) return;
    this.renderAmount();
    this.renderRequired = false;
  }
  add(amount) {
    this._amount += amount;
    this.queueNotification(amount);
    this.onAmountChange();
  }
  remove(amount) {
    this._amount -= amount;
    this.queueNotification(-amount);
    this.onAmountChange();
  }
  set(amount) {
    this._amount = amount;
    this.onAmountChange();
  }
  canAfford(amountToSpend) {
    return this._amount >= amountToSpend;
  }
  encode(writer) {
    writer.writeFloat64(this._amount);
    return writer;
  }
  decode(reader, version) {
    this._amount = Math.floor(reader.getFloat64());
  }
}
class GP extends Currency {
  constructor() {
    super(...arguments);
    this._media = "assets/media/main/coins.svg";
  }
  get shouldNotify() {
    return this.game.settings.showGPNotifications;
  }
  add(amount) {
    this.game.stats.General.add(GeneralStats.TotalGPEarned, amount);
    super.add(amount);
  }
  renderAmount() {
    const text = templateLangString("MENU_TEXT", "GP_AMOUNT", {
      gp: formatNumber(this._amount),
    });
    const tooltip = templateLangString("MENU_TEXT", "GP_AMOUNT", {
      gp: numberWithCommas(this._amount),
    });
    playerHTMLElements.gp.forEach((elem) => {
      elem.textContent = text;
      elem.setAttribute("data-original-title", tooltip);
    });
    const textClass =
      (this.game.settings.formatNumberSetting === 0 &&
        this._amount >= 10000000) ||
      (this.game.settings.formatNumberSetting === 1 && this._amount >= 1000000)
        ? "text-success"
        : "text-warning";
    $("#nav-current-gp").attr("class", textClass);
    updateTooltips();
  }
}
class SlayerCoins extends Currency {
  constructor() {
    super(...arguments);
    this._media = "assets/media/main/slayer_coins.svg";
  }
  get shouldNotify() {
    return this.game.settings.showSlayerCoinNotifications;
  }
  add(amount) {
    const modifier =
      this.game.modifiers.increasedSlayerCoins -
      this.game.modifiers.decreasedSlayerCoins;
    amount = applyModifier(amount, modifier, 0);
    this.game.stats.Slayer.add(SlayerStats.SlayerCoinsEarned, amount);
    super.add(amount);
  }
  renderAmount() {
    $("#shop-current-slayer").text(
      `${formatNumber(this._amount)} ${getLangString(
        "MENU_TEXT",
        "SLAYER_COINS"
      )}`
    );
    $("#shop-current-slayer-c").attr(
      "data-original-title",
      `${templateLangString("MENU_TEXT", "SLAYER_COIN_AMOUNT", {
        qty: numberWithCommas(this._amount),
      })}<br><small class='text-warning'>${getLangString(
        "MENU_TEXT",
        "SLAYER_COINS_FROM_TASKS"
      )}</small>`
    );
    $("#nav-slayer-coins-1").text("(" + formatNumber(this._amount) + ")");
    $("#nav-slayer-coins-2").text("(" + formatNumber(this._amount) + ")");
    updateTooltips();
  }
}
class RaidCoins extends Currency {
  constructor() {
    super(...arguments);
    this._media = "assets/media/main/raid_coins.svg";
    this.shouldNotify = true;
  }
  renderAmount() {
    $("#shop-current-raid-coins").text(formatNumber(this._amount));
    $("#golbin-raid-skip-current").html(
      templateString(getLangString("COMBAT_MISC", "87"), {
        coinImage: `<img class="skill-icon-xs mr-1 " src="${this.media}">`,
        qty: `${formatNumber(this._amount)}`,
      })
    );
    $("#shop-current-raid-coins-tooltip").attr(
      "data-original-title",
      templateLangString("GOLBIN_RAID", "HISTORY_3", {
        num: numberWithCommas(this._amount),
      })
    );
    updateTooltips();
  }
}
