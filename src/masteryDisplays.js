"use strict";
class MasteryDisplay extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("mastery-display-template"));
    this.icon = getElementFromFragment(this._content, "icon", "img");
    this.level = getElementFromFragment(this._content, "level", "span");
    this.xpProgress = getElementFromFragment(
      this._content,
      "xp-progress",
      "small"
    );
    this.progressBar = getElementFromFragment(
      this._content,
      "progress-bar",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.iconTooltip = tippy(this.icon, {
      content: getLangString("MENU_TEXT", "MASTERY"),
      placement: "bottom",
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.iconTooltip !== undefined) {
      this.iconTooltip.destroy();
      this.iconTooltip = undefined;
    }
  }
  setNoMastery() {
    this.removeAttribute("data-skill-id");
    this.removeAttribute("data-action-id");
    this.level.classList.remove("text-warning");
    this.level.textContent = "-";
    this.xpProgress.textContent = "-";
    this.progressBar.style.width = "0%";
  }
  setMastery(skill, action) {
    this.setAttribute("data-skill-id", skill.id);
    this.setAttribute("data-action-id", action.id);
  }
  updateValues(progress) {
    let xpText = numberWithCommas(Math.floor(progress.xp));
    if (progress.level >= 99) {
      this.level.classList.add("text-warning");
      this.progressBar.classList.replace("bg-info", "bg-success");
    } else {
      this.level.classList.remove("text-warning");
      this.progressBar.classList.replace("bg-success", "bg-info");
      xpText += ` / ${numberWithCommas(progress.nextLevelXP)}`;
    }
    this.progressBar.style.width = `${progress.percent}%`;
    this.level.textContent = `${progress.level}`;
    this.xpProgress.textContent = xpText;
  }
}
window.customElements.define("mastery-display", MasteryDisplay);
class CompactMasteryDisplay extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("compact-mastery-display-template"));
    this.icon = getElementFromFragment(this._content, "icon", "img");
    this.level = getElementFromFragment(this._content, "level", "span");
    this.progressPercent = getElementFromFragment(
      this._content,
      "progress-percent",
      "small"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.iconTooltip = tippy(this.icon, {
      content: getLangString("MENU_TEXT", "MASTERY"),
      placement: "bottom",
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.iconTooltip !== undefined) {
      this.iconTooltip.destroy();
      this.iconTooltip = undefined;
    }
  }
  setMastery(skill, action) {
    this.setAttribute("data-skill-id", skill.id);
    this.setAttribute("data-action-id", action.id);
  }
  updateValues(progress) {
    if (progress.level >= 99) this.level.classList.add("text-warning");
    else this.level.classList.remove("text-warning");
    this.progressPercent.textContent = `(${formatPercent(
      progress.percent,
      2
    )})`;
    this.level.textContent = `${progress.level}`;
  }
}
window.customElements.define("compact-mastery-display", CompactMasteryDisplay);
class MasteryPoolDisplay extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("mastery-pool-display-template"));
    this.poolIcon = getElementFromFragment(this._content, "pool-icon", "img");
    this.poolProgress = getElementFromFragment(
      this._content,
      "pool-progress",
      "div"
    );
    const xpContainer = getElementFromFragment(
      this._content,
      "xp-container",
      "small"
    );
    const xpSpan = createElement("span");
    this.currentXP = createElement("span");
    this.totalXP = createElement("span");
    this.percentXP = createElement("span");
    xpSpan.append(
      this.currentXP,
      " / ",
      this.totalXP,
      " (",
      this.percentXP,
      ")"
    );
    xpContainer.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "XP_AMOUNT",
        { xp: xpSpan },
        {},
        false
      )
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.poolTooltip = tippy(this.poolIcon, {
      content: getLangString("MENU_TEXT", "MASTERY_POOL"),
      placement: "bottom",
      allowHTML: false,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.poolTooltip !== undefined) {
      this.poolTooltip.destroy();
      this.poolTooltip = undefined;
    }
  }
  setSkill(skill) {
    this.setAttribute("data-skill-id", skill.id);
    this.updateProgress(skill);
  }
  updateProgress(skill) {
    const percent = (100 * skill.masteryPoolXP) / skill.baseMasteryPoolCap;
    this.poolProgress.style.width = `${percent}%`;
    this.currentXP.textContent = numberWithCommas(
      Math.floor(skill.masteryPoolXP)
    );
    this.totalXP.textContent = numberWithCommas(skill.masteryPoolCap);
    this.percentXP.textContent = formatPercent(percent, 2);
  }
}
window.customElements.define("mastery-pool-display", MasteryPoolDisplay);
class SpendMasteryMenuItem extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("spend-mastery-menu-item-template"));
    this.actionImage = getElementFromFragment(
      this._content,
      "action-image",
      "img"
    );
    this.level = getElementFromFragment(
      this._content,
      "mastery-level",
      "strong"
    );
    this.xpRequired = getElementFromFragment(
      this._content,
      "xp-required",
      "span"
    );
    this.progressBar = getElementFromFragment(
      this._content,
      "mastery-progress",
      "div"
    );
    this.levelUpButton = getElementFromFragment(
      this._content,
      "level-up-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.actionTooltip = tippy(this.actionImage, {
      content: "",
      placement: "top",
      allowHTML: false,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.actionTooltip !== undefined) {
      this.actionTooltip.destroy();
      this.actionTooltip = undefined;
    }
  }
  setAction(action) {
    var _a;
    this.actionImage.src = action.media;
    (_a = this.actionTooltip) === null || _a === void 0
      ? void 0
      : _a.setContent(action.name);
  }
  updateProgress(skill, action, spendAmount) {
    const progress = skill.getMasteryProgress(action);
    this.level.textContent = `${progress.level}`;
    this.progressBar.style.width = `${progress.percent}%`;
    if (progress.level >= 99) {
      this.progressBar.classList.replace("bg-info", "bg-success");
      hideElement(this.levelUpButton);
      hideElement(this.xpRequired);
    } else {
      this.progressBar.classList.replace("bg-success", "bg-info");
      showElement(this.levelUpButton);
      showElement(this.xpRequired);
      const nextLevel = Math.min(progress.level + spendAmount, 99);
      const xpRequired = exp.level_to_xp(nextLevel) - progress.xp + 1;
      const levelIncrease = nextLevel - progress.level;
      this.xpRequired.textContent = templateLangString(
        "MENU_TEXT",
        "SPEND_MASTERY_XP_FOR",
        {
          xp: numberWithCommas(Math.floor(xpRequired)),
          num: `${levelIncrease}`,
        }
      );
      this.levelUpButton.textContent = `+${levelIncrease}`;
      this.levelUpButton.onclick = () =>
        skill.levelUpMasteryWithPoolXP(action, levelIncrease);
      const poolTierChange = skill.getPoolBonusChange(-xpRequired);
      if (xpRequired <= skill.masteryPoolXP) {
        if (poolTierChange < 0) {
          this.levelUpButton.classList.remove("btn-danger", "btn-success");
          this.levelUpButton.classList.add("btn-warning");
        } else {
          this.levelUpButton.classList.remove("btn-danger", "btn-warning");
          this.levelUpButton.classList.add("btn-success");
        }
        this.levelUpButton.classList.remove("disabled");
        this.levelUpButton.disabled = false;
      } else {
        this.levelUpButton.classList.remove("btn-success", "btn-warning");
        this.levelUpButton.classList.add("disabled", "btn-danger");
        this.levelUpButton.disabled = true;
      }
    }
  }
}
window.customElements.define("spend-mastery-menu-item", SpendMasteryMenuItem);
class SpendMasteryMenu extends HTMLElement {
  constructor() {
    super();
    this.masteryItems = [];
    this.itemsByAction = new Map();
    this.levelUpAmount = 1;
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("spend-mastery-menu-template"));
    this.masteryItemContainer = getElementFromFragment(
      this._content,
      "mastery-item-container",
      "div"
    );
    this.poolDisplay = getElementFromFragment(
      this._content,
      "pool-display",
      "mastery-pool-display"
    );
    this.claimTokenButton = getElementFromFragment(
      this._content,
      "claim-token-button",
      "button"
    );
    this.tokenImage = getElementFromFragment(
      this._content,
      "token-image",
      "img"
    );
    this.tokenQuantity = createElement("span");
    this.claimTokenButton.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "MPXP_CLAIM_TOKENS",
        { qtyInBank: this.tokenQuantity },
        {},
        false
      )
    );
    this.setLevel1Button = getElementFromFragment(
      this._content,
      "set-level-1-button",
      "button"
    );
    this.setLevel5Button = getElementFromFragment(
      this._content,
      "set-level-5-button",
      "button"
    );
    this.setLevel10Button = getElementFromFragment(
      this._content,
      "set-level-10-button",
      "button"
    );
    this.setLevel1Button.onclick = () => this.changeLevelUpAmount(1);
    this.setLevel5Button.onclick = () => this.changeLevelUpAmount(5);
    this.setLevel10Button.onclick = () => this.changeLevelUpAmount(10);
  }
  get curentSkill() {
    return this._currentSkill;
  }
  get currentToken() {
    var _a;
    return (_a = this._currentSkill) === null || _a === void 0
      ? void 0
      : _a.masteryToken;
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setSkill(skill, game) {
    this._currentSkill = skill;
    while (this.masteryItems.length < skill.sortedMasteryActions.length) {
      const newItem = createElement("spend-mastery-menu-item", {
        className: "coi-12 col-md-6",
        parent: this.masteryItemContainer,
      });
      this.masteryItems.push(newItem);
    }
    while (this.masteryItems.length > skill.sortedMasteryActions.length) {
      const masteryItem = this.masteryItems.pop();
      if (masteryItem !== undefined) masteryItem.remove();
    }
    this.itemsByAction.clear();
    skill.sortedMasteryActions.forEach((action, i) => {
      const masteryItem = this.masteryItems[i];
      this.itemsByAction.set(action, masteryItem);
      masteryItem.setAction(action);
      masteryItem.updateProgress(skill, action, this.levelUpAmount);
      if (
        game.settings.hideMaxLevelMasteries &&
        skill.getMasteryLevel(action) >= 99
      )
        hideElement(masteryItem);
      else showElement(masteryItem);
    });
    if (skill.masteryToken !== undefined) {
      const tokenItem = skill.masteryToken;
      this.tokenImage.src = tokenItem.media;
      this.updateTokenQuantity(game.bank.getQty(tokenItem));
      this.claimTokenButton.onclick = () => {
        game.bank.claimItemOnClick(tokenItem, Infinity);
        this.claimTokenButton.blur();
      };
    }
    this.poolDisplay.setSkill(skill);
  }
  unsetSkill() {
    this._currentSkill = undefined;
  }
  updateAllActions() {
    if (this._currentSkill === undefined) return;
    const skill = this._currentSkill;
    skill.sortedMasteryActions.forEach((action, i) => {
      const masteryItem = this.masteryItems[i];
      masteryItem.updateProgress(skill, action, this.levelUpAmount);
      if (
        game.settings.hideMaxLevelMasteries &&
        skill.getMasteryLevel(action) >= 99
      )
        hideElement(masteryItem);
    });
  }
  toggleHideLevel99() {
    if (this._currentSkill === undefined) return;
    const skill = this._currentSkill;
    skill.sortedMasteryActions.forEach((action, i) => {
      const masteryItem = this.masteryItems[i];
      if (
        game.settings.hideMaxLevelMasteries &&
        skill.getMasteryLevel(action) >= 99
      )
        hideElement(masteryItem);
      else showElement(masteryItem);
    });
  }
  updateAction(skill, action) {
    const masteryItem = this.itemsByAction.get(action);
    if (masteryItem === undefined) return;
    masteryItem.updateProgress(skill, action, this.levelUpAmount);
    if (
      game.settings.hideMaxLevelMasteries &&
      skill.getMasteryLevel(action) >= 99
    )
      hideElement(masteryItem);
  }
  updateTokenQuantity(amount) {
    this.tokenQuantity.textContent = numberWithCommas(amount);
  }
  changeLevelUpAmount(newAmount) {
    this.levelUpAmount = newAmount;
    if (this._currentSkill !== undefined) {
      const skill = this._currentSkill;
      skill.sortedMasteryActions.forEach((action, i) => {
        const masteryItem = this.masteryItems[i];
        masteryItem.updateProgress(skill, action, newAmount);
      });
    }
  }
}
class MasterySkillOptionsElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("mastery-skill-options-template"));
    this.poolDisplay = getElementFromFragment(
      this._content,
      "pool-display",
      "mastery-pool-display"
    );
    this.viewCheckpointsButton = getElementFromFragment(
      this._content,
      "view-checkpoints-button",
      "button"
    );
    this.spendMasteryButton = getElementFromFragment(
      this._content,
      "spend-mastery-button",
      "button"
    );
    this.masteryImage = createElement("img", {
      className: "skill-icon-xs m-0",
      attributes: [["src", cdnMedia("assets/media/main/mastery_pool.svg")]],
    });
    this.spendMasteryButton.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "MASTERY_SPEND_XP",
        { masteryImage: this.masteryImage },
        {},
        false
      )
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.masteryTooltip = tippy(this.masteryImage, {
      content: getLangString("MENU_TEXT", "MASTERY_POOL"),
      placement: "bottom",
      allowHTML: false,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.masteryTooltip !== undefined) {
      this.masteryTooltip.destroy();
      this.masteryTooltip = undefined;
    }
  }
  setSkill(skill) {
    this.poolDisplay.setSkill(skill);
    this.viewCheckpointsButton.onclick = () =>
      skill.openMasteryPoolBonusModal();
    this.spendMasteryButton.onclick = () => skill.openSpendMasteryXPModal();
  }
}
window.customElements.define(
  "mastery-skill-options",
  MasterySkillOptionsElement
);
