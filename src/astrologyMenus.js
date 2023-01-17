"use strict";
class ConstellationMenu extends HTMLElement {
  constructor() {
    super();
    this.stardustIcons = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("constellation-menu-template"));
    this.image = getElementFromFragment(this._content, "image", "img");
    this.name = getElementFromFragment(this._content, "name", "h4");
    this.skillIcons = getElementFromFragment(
      this._content,
      "skill-icons",
      "div"
    );
    this.skillIcon0 = getElementFromFragment(
      this._content,
      "skill-icon-0",
      "img"
    );
    const grantsContainer = getElementFromFragment(
      this._content,
      "grants-container",
      "div"
    );
    this.xpIcon = new XPIcon(grantsContainer, 0, 32);
    this.masteryIcon = new MasteryXPIcon(grantsContainer, 0, 32);
    this.masteryPoolIcon = new MasteryPoolIcon(grantsContainer, 0, 32);
    this.intervalIcon = new IntervalIcon(grantsContainer, 0, 32);
    const progressBarDiv = getElementFromFragment(
      this._content,
      "progress-bar",
      "div"
    );
    this.progressBar = new ProgressBar(progressBarDiv, "bg-secondary");
    this.studyButton = getElementFromFragment(
      this._content,
      "study-button",
      "button"
    );
    this.exploreButton = getElementFromFragment(
      this._content,
      "explore-button",
      "button"
    );
    this.masteryDisplay = getElementFromFragment(
      this._content,
      "mastery-display",
      "mastery-display"
    );
    this.stardustBreakdown = getElementFromFragment(
      this._content,
      "stardust-breakdown",
      "div"
    );
    if (game.astrology.starDustItem !== undefined) {
      const normalDustIcon = new ItemCurrentIcon(
        this.stardustBreakdown,
        game.astrology.starDustItem,
        0,
        false
      );
      this.stardustIcons.push(normalDustIcon);
    }
    if (game.astrology.goldenStardustItem !== undefined) {
      const goldenDustIcon = new ItemCurrentIcon(
        this.stardustBreakdown,
        game.astrology.goldenStardustItem,
        0,
        false
      );
      this.stardustIcons.push(goldenDustIcon);
    }
    this.viewModifierContainer = getElementFromFragment(
      this._content,
      "view-modifier-container",
      "div"
    );
    this.exploreButton.textContent = getLangString("ASTROLOGY", "BTN_1");
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setConstellation(constellation) {
    this.image.src = constellation.media;
    this.name.textContent = constellation.name;
    this.skillIcons.innerHTML = "";
    constellation.skills.forEach((skill) => {
      this.skillIcon0.src = skill.media;
      this.skillIcons.append(this.skillIcon0.cloneNode(true));
    });
    this.masteryDisplay.setMastery(game.astrology, constellation);
    this.studyButton.onclick = () =>
      game.astrology.studyConstellationOnClick(constellation);
    this.exploreButton.onclick = () =>
      game.astrology.exploreConstellationOnClick(constellation);
  }
  updateGrants(xp, masteryXP, masteryPoolXP, interval) {
    this.xpIcon.setXP(xp);
    this.masteryIcon.setXP(masteryXP);
    this.masteryPoolIcon.setXP(masteryPoolXP);
    this.intervalIcon.setInterval(interval);
  }
  updateQuantities() {
    this.stardustIcons.forEach((icon) => {
      icon.updateQuantity();
    });
  }
  setExplored() {
    showElement(this.viewModifierContainer);
    showElement(this.stardustBreakdown);
    this.exploreButton.textContent = getLangString("ASTROLOGY", "BTN_2");
  }
  setUnexplored() {
    hideElement(this.viewModifierContainer);
    hideElement(this.stardustBreakdown);
    this.exploreButton.textContent = getLangString("ASTROLOGY", "BTN_1");
  }
}
window.customElements.define("constellation-menu", ConstellationMenu);
class AstrologyModifierDisplay extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("astrology-modifier-display-template")
    );
    this.starImage = getElementFromFragment(this._content, "star-image", "img");
    this.modifierContainer = getElementFromFragment(
      this._content,
      "modifier-container",
      "div"
    );
    this.modifierText = getElementFromFragment(
      this._content,
      "modifier-text",
      "h5"
    );
    this.upgradeButton = getElementFromFragment(
      this._content,
      "upgrade-button",
      "button"
    );
    this.starDustImage = getElementFromFragment(
      this._content,
      "stardust-image",
      "img"
    );
    this.starDustQuantity = getElementFromFragment(
      this._content,
      "stardust-quantity",
      "span"
    );
    this.modifierProgress = getElementFromFragment(
      this._content,
      "modifier-progress",
      "ul"
    );
    this.modifierStatus = {
      locked: getElementFromFragment(
        this._content,
        "modifier-progress-locked",
        "li"
      ),
      active: getElementFromFragment(
        this._content,
        "modifier-progress-active",
        "li"
      ),
      inactive: getElementFromFragment(
        this._content,
        "modifier-progress-inactive",
        "li"
      ),
    };
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setStandard() {
    this.starImage.src = cdnMedia(
      "assets/media/skills/astrology/star_standard.svg"
    );
    this.modifierContainer.classList.replace("border-warning", "border-info");
    this.starDustImage.src = cdnMedia("assets/media/bank/stardust.png");
  }
  setUnique() {
    this.starImage.src = cdnMedia(
      "assets/media/skills/astrology/star_unique.svg"
    );
    this.modifierContainer.classList.replace("border-info", "border-warning");
    this.starDustImage.src = cdnMedia("assets/media/bank/golden_stardust.png");
  }
  setMasteryLocked(level) {
    this.modifierText.textContent = templateLangString(
      "MENU_TEXT",
      "TOOLTIP_MASTERY_UNLOCK",
      { level: `${level}` }
    );
  }
  setModifier(modifier, precision) {
    this.modifierText.textContent = "";
    modifier.forEach((mod) => {
      let description;
      if ("values" in mod) {
        [description] = printPlayerModifier(mod.key, mod.values[0], precision);
      } else {
        [description] = printPlayerModifier(mod.key, mod.value, precision);
      }
      this.modifierText.append(
        createElement("div", {
          classList: ["text-success", "mb-1"],
          text: description,
        })
      );
    });
  }
  setModifierStatus(buyCount, data) {
    this.modifierProgress.innerHTML = "";
    for (let i = 0; i < data.maxCount; i++) {
      if (i < buyCount) {
        this.modifierProgress.append(
          this.modifierStatus.active.cloneNode(true)
        );
      } else {
        this.modifierProgress.append(
          this.modifierStatus.inactive.cloneNode(true)
        );
      }
    }
  }
  setModifierStatusLocked(data) {
    this.modifierProgress.innerHTML = "";
    for (let i = 0; i < data.maxCount; i++) {
      this.modifierProgress.append(
        this.modifierStatus.inactive.cloneNode(true)
      );
    }
  }
  setDustQuantity(quantity) {
    this.starDustQuantity.textContent = formatNumber(quantity);
  }
  setUpgradeCallback(callback) {
    this.upgradeButton.onclick = callback;
  }
  hideUpgradeButton() {
    this.upgradeButton.classList.add("d-none");
  }
  showUpgradeButton() {
    this.upgradeButton.classList.remove("d-none");
  }
}
window.customElements.define(
  "astrology-modifier-display",
  AstrologyModifierDisplay
);
class AstrologyExplorationPanel extends HTMLElement {
  constructor() {
    super();
    this.standardModifiers = [];
    this.uniqueModifiers = [];
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("astrology-exploration-panel-template")
    );
    this.standardModifierContainer = getElementFromFragment(
      this._content,
      "standard-modifier-container",
      "div"
    );
    this.uniqueModifierContainer = getElementFromFragment(
      this._content,
      "unique-modifier-container",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setMaxStandardMods(amount) {
    while (this.standardModifiers.length < amount) {
      const newModifierDisplay = createElement("astrology-modifier-display", {
        className: "col-12 p-2",
        parent: this.standardModifierContainer,
      });
      newModifierDisplay.setStandard();
      this.standardModifiers.push(newModifierDisplay);
    }
    while (this.standardModifiers.length > amount) {
      const oldDisplay = this.standardModifiers.pop();
      if (oldDisplay !== undefined)
        this.standardModifierContainer.removeChild(oldDisplay);
    }
  }
  setMaxUniqueMods(amount) {
    while (this.uniqueModifiers.length < amount) {
      const newModifierDisplay = createElement("astrology-modifier-display", {
        className: "col-12 p-2",
        parent: this.uniqueModifierContainer,
      });
      newModifierDisplay.setUnique();
      this.uniqueModifiers.push(newModifierDisplay);
    }
    while (this.uniqueModifiers.length > amount) {
      const oldDisplay = this.uniqueModifiers.pop();
      if (oldDisplay !== undefined)
        this.uniqueModifierContainer.removeChild(oldDisplay);
    }
  }
  setUpgradeCosts(constellation) {
    this.standardModifiers.forEach((_, id) =>
      this.setStandardUpgradeCost(constellation, id)
    );
    this.uniqueModifiers.forEach((_, id) =>
      this.setUniqueUpgradeCost(constellation, id)
    );
  }
  setStandardUpgradeCost(constellation, modID) {
    const quantity = game.astrology.isStarMaxValue(
      constellation,
      AstrologyModifierType.Standard,
      modID
    )
      ? -1
      : game.astrology.getStandardModifierUpgradeCost(constellation, modID);
    if (quantity >= 0) {
      this.standardModifiers[modID].showUpgradeButton();
      this.standardModifiers[modID].setDustQuantity(quantity);
    } else this.standardModifiers[modID].hideUpgradeButton();
  }
  setUniqueUpgradeCost(constellation, modID) {
    const quantity = game.astrology.isStarMaxValue(
      constellation,
      AstrologyModifierType.Unique,
      modID
    )
      ? -1
      : game.astrology.getUniqueModifierUpgradeCost(constellation, modID);
    if (quantity >= 0) {
      this.uniqueModifiers[modID].showUpgradeButton();
      this.uniqueModifiers[modID].setDustQuantity(quantity);
    } else this.uniqueModifiers[modID].hideUpgradeButton();
  }
  setConstellation(constellation) {
    this.standardModifiers.forEach((modifier, id) => {
      modifier.setUpgradeCallback(() =>
        game.astrology.upgradeStandardModifier(constellation, id)
      );
    });
    this.uniqueModifiers.forEach((modifier, id) => {
      modifier.setUpgradeCallback(() =>
        game.astrology.upgradeUniqueModifier(constellation, id)
      );
    });
  }
  setStandardModifier(id, modifier, precision) {
    this.standardModifiers[id].setModifier(modifier, precision);
  }
  setStandardModifierStatus(id, buyCount, data) {
    this.standardModifiers[id].setModifierStatus(buyCount, data);
  }
  setStandardLocked(id, masteryLevel) {
    this.standardModifiers[id].setMasteryLocked(masteryLevel);
  }
  setStandardLockedStatus(id, data) {
    this.standardModifiers[id].setModifierStatusLocked(data);
  }
  setUniqueModifier(id, modifier, precision) {
    this.uniqueModifiers[id].setModifier(modifier, precision);
  }
  setUniqueModifierStatus(id, buyCount, data) {
    this.uniqueModifiers[id].setModifierStatus(buyCount, data);
  }
  setUniqueLocked(id, masteryLevel) {
    this.uniqueModifiers[id].setMasteryLocked(masteryLevel);
  }
  setUniqueLockedStatus(id, data) {
    this.uniqueModifiers[id].setModifierStatusLocked(data);
  }
}
window.customElements.define(
  "astrology-exploration-panel",
  AstrologyExplorationPanel
);
class AstrologyInformationPanel extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("astrology-information-panel-template")
    );
    this.viewAllModifiersButton = getElementFromFragment(
      this._content,
      "view-all-modifiers-button",
      "button"
    );
    const iconContainer = getElementFromFragment(
      this._content,
      "icon-container",
      "div"
    );
    this.stardustChance = new ItemChanceIcon(iconContainer);
    this.goldenstardustChance = new ItemChanceIcon(iconContainer);
    this.doublingChance = new DoublingIcon(iconContainer, 0);
    this.meteoriteChance = new MeteoriteChanceIcon(iconContainer);
    if (!cloudManager.hasTotHEntitlement) this.meteoriteChance.hide();
  }
  initialize(game) {
    if (game.astrology.starDustItem)
      this.stardustChance.setItem(game.astrology.starDustItem);
    if (game.astrology.goldenStardustItem)
      this.goldenstardustChance.setItem(game.astrology.goldenStardustItem);
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setModifierCallback(astrology) {
    this.viewAllModifiersButton.onclick = () =>
      astrology.viewAllModifiersOnClick();
  }
  updateChances(stardust, goldenStardust, doubling, meteorite) {
    this.stardustChance.setChance(stardust);
    this.goldenstardustChance.setChance(goldenStardust);
    this.doublingChance.setChance(doubling);
    this.meteoriteChance.setChance(meteorite);
  }
}
window.customElements.define(
  "astrology-information-panel",
  AstrologyInformationPanel
);
