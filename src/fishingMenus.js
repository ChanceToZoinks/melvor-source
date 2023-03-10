"use strict";
class FishingAreaMenu extends HTMLElement {
  constructor() {
    super();
    this.fishButtons = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("fishing-area-menu-template"));
    this.areaBlock = getElementFromFragment(this._content, "area-block", "div");
    this.areaHeader = getElementFromFragment(
      this._content,
      "area-header",
      "div"
    );
    this.areaName = getElementFromFragment(this._content, "area-name", "span");
    this.areaEyecon = getElementFromFragment(this._content, "area-eyecon", "i");
    this.fishChance = getElementFromFragment(
      this._content,
      "fish-chance",
      "span"
    );
    this.junkChance = getElementFromFragment(
      this._content,
      "junk-chance",
      "span"
    );
    this.specialChance = getElementFromFragment(
      this._content,
      "special-chance",
      "span"
    );
    this.buttonContainer = getElementFromFragment(
      this._content,
      "button-container",
      "div"
    );
    this.infoContainer = getElementFromFragment(
      this._content,
      "info-container",
      "div"
    );
    this.fishName = getElementFromFragment(this._content, "fish-name", "span");
    this.fishImage = getElementFromFragment(this._content, "fish-image", "img");
    this.fishInfoContainer = getElementFromFragment(
      this._content,
      "fish-info-container",
      "div"
    );
    this.fishInterval = getElementFromFragment(
      this._content,
      "fish-interval",
      "span"
    );
    this.masteryDisplay = getElementFromFragment(
      this._content,
      "fish-mastery",
      "mastery-display"
    );
    this.startButton = getElementFromFragment(
      this._content,
      "start-button",
      "button"
    );
    this.statusSpinner = getElementFromFragment(
      this._content,
      "status-spinner",
      "div"
    );
    this.statusText = getElementFromFragment(
      this._content,
      "status-text",
      "small"
    );
    const grantsContainer = getElementFromFragment(
      this._content,
      "grants-container",
      "div"
    );
    this.xpIcon = new XPIcon(grantsContainer, 0, 32);
    this.strXPIcon = new STRXPIcon(grantsContainer, 0, 32);
    this.masteryIcon = new MasteryXPIcon(grantsContainer, 0, 32);
    this.masteryPoolIcon = new MasteryPoolIcon(grantsContainer, 0, 32);
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setChances(chance, area) {
    this.fishChance.textContent = templateLangString(
      "MENU_TEXT",
      "FISH_CHANCE",
      { fishChance: formatPercent(chance.fish) }
    );
    if (chance.fish !== area.fishChance) {
      this.fishChance.classList.add("text-success");
    } else {
      this.fishChance.classList.remove("text-success");
    }
    this.junkChance.textContent = templateLangString(
      "MENU_TEXT",
      "JUNK_CHANCE",
      { junkChance: formatPercent(chance.junk) }
    );
    if (chance.junk !== area.junkChance) {
      this.junkChance.classList.add("text-success");
    } else {
      this.junkChance.classList.remove("text-success");
    }
    this.specialChance.textContent = templateLangString(
      "MENU_TEXT",
      "SPECIAL_CHANCE",
      { specialChance: formatPercent(chance.special) }
    );
    if (chance.special !== area.specialChance) {
      this.specialChance.classList.add("text-success");
    } else {
      this.specialChance.classList.remove("text-success");
    }
  }
  setAreaData(area) {
    this.areaName.textContent = area.name;
    this.buttonContainer.textContent = "";
    this.fishButtons = [];
    area.fish.forEach((fish) => {
      const button = new FishingAreaMenuButton();
      this.buttonContainer.append(button);
      this.fishButtons.push(button);
    });
    this.startButton.onclick = () => game.fishing.onAreaStartButtonClick(area);
    this.areaHeader.onclick = () => game.fishing.onAreaHeaderClick(area);
    this.setActionInactive();
  }
  updateGrants(xp, masteryXP, masteryPoolXP, strengthXP) {
    this.xpIcon.setXP(xp);
    this.strXPIcon.setXP(strengthXP);
    this.masteryIcon.setXP(masteryXP);
    this.masteryPoolIcon.setXP(masteryPoolXP);
  }
  hideAreaPanel() {
    hideElement(this.buttonContainer);
    hideElement(this.infoContainer);
    this.areaEyecon.classList.remove("fa-eye");
    this.areaEyecon.classList.add("fa-eye-slash");
    this.areaBlock.removeAttribute("style");
  }
  showAreaPanel() {
    showElement(this.buttonContainer);
    showElement(this.infoContainer);
    this.areaEyecon.classList.remove("fa-eye-slash");
    this.areaEyecon.classList.add("fa-eye");
    this.areaBlock.setAttribute("style", "min-height:370px;");
  }
  setSelectedFish(fish) {
    this.fishImage.src = fish.product.media;
    this.fishName.textContent = fish.product.name;
    showElement(this.fishInfoContainer);
    showElement(this.fishImage);
    showElement(this.startButton);
    this.masteryDisplay.setMastery(game.fishing, fish);
  }
  setUnselected() {
    this.fishName.textContent = "";
    hideElement(this.fishInfoContainer);
    hideElement(this.fishImage);
    hideElement(this.startButton);
  }
  updateSelectedFishRates(fish) {
    this.fishInterval.textContent = templateLangString(
      "MENU_TEXT",
      "SECONDS_RANGE",
      {
        minTime: formatFixed(game.fishing.getMinFishInterval(fish) / 1000, 2),
        maxTime: formatFixed(game.fishing.getMaxFishInterval(fish) / 1000, 2),
      }
    );
    const avgInterval =
      (game.fishing.getMaxFishInterval(fish) +
        game.fishing.getMinFishInterval(fish)) /
      2;
    const xp = Math.floor(game.fishing.modifyXP(fish.baseExperience));
    const mxp = game.fishing.getMasteryXPToAddForAction(fish, avgInterval);
    const mpxp = game.fishing.getMasteryXPToAddToPool(mxp);
    let strxp = 0;
    if (fish.strengthXP > 0) {
      strxp = game.strength.modifyXP(fish.strengthXP);
    }
    this.updateGrants(xp, mxp, mpxp, strxp);
  }
  updateButtons(area) {
    area.fish.forEach((fish, i) => {
      const button = this.fishButtons[i];
      if (fish.level > game.fishing.level) {
        button.setFishLocked(fish);
      } else {
        button.setFishUnlocked(fish, area);
      }
    });
  }
  setActionActive() {
    showElement(this.statusSpinner);
    this.startButton.classList.replace("btn-info", "btn-danger");
    this.startButton.textContent = getLangString("MENU_TEXT", "STOP_FISHING");
    this.statusText.textContent = game.fishing.name;
  }
  setActionInactive() {
    hideElement(this.statusSpinner);
    this.startButton.classList.replace("btn-danger", "btn-info");
    this.startButton.textContent = getLangString("MENU_TEXT", "START_FISHING");
    this.statusText.textContent = getLangString("MENU_TEXT", "IDLE");
  }
}
window.customElements.define("fishing-area-menu", FishingAreaMenu);
class FishingAreaMenuButton extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("fishing-area-menu-button-template"));
    this.link = getElementFromFragment(this._content, "link", "a");
    this.fishImage = getElementFromFragment(this._content, "fish-image", "img");
    this.fishName = getElementFromFragment(this._content, "fish-name", "small");
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setFishUnlocked(fish, area) {
    this.fishName.textContent = fish.product.name;
    this.fishImage.src = fish.product.media;
    showElement(this.fishImage);
    this.link.onclick = () => game.fishing.onAreaFishSelection(area, fish);
    this.fishName.classList.remove("text-danger");
  }
  setFishLocked(fish) {
    this.fishName.textContent = "";
    this.fishName.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "UNLOCKED_AT",
        {
          skillImage: createElement("img", {
            classList: ["skill-icon-xs"],
            attributes: [["src", game.fishing.media]],
          }),
        },
        { level: `${fish.level}` }
      )
    );
    hideElement(this.fishImage);
    this.link.onclick = null;
    this.fishName.classList.add("text-danger");
  }
}
window.customElements.define("fishing-area-menu-button", FishingAreaMenuButton);
