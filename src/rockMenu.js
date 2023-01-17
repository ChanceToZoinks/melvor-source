"use strict";
class MiningRockMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("mining-ore-template"));
    this.button = getElementFromFragment(this._content, "rock-button", "a");
    this.statusText = getElementFromFragment(
      this._content,
      "rock-status-text",
      "lang-string"
    );
    this.nameText = getElementFromFragment(
      this._content,
      "rock-name-text",
      "span"
    );
    this.typeText = getElementFromFragment(
      this._content,
      "rock-type-text",
      "small"
    );
    this.rockImage = getElementFromFragment(this._content, "rock-image", "img");
    this.hpProgressText = getElementFromFragment(
      this._content,
      "rock-hp-progress-text",
      "small"
    );
    this.hpProgress = new ProgressBar(
      getElementFromFragment(this._content, "rock-hp-progress", "div"),
      "bg-danger"
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
    this.miningProgress = new ProgressBar(
      getElementFromFragment(this._content, "rock-mining-progress", "div"),
      "bg-mining"
    );
    this.mastery = getElementFromFragment(
      this._content,
      "mastery-display",
      "mastery-display"
    );
    this.requirementText = getElementFromFragment(
      this._content,
      "rock-requirement-text",
      "div"
    );
    this.gemVeinText = getElementFromFragment(
      this._content,
      "gem-vein-text",
      "div"
    );
    this.meteoriteText = getElementFromFragment(
      this._content,
      "meteorite-text",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setRock(rock) {
    this.button.onclick = () => game.mining.onRockClick(rock);
    this.nameText.textContent = rock.name;
    this.mastery.setMastery(game.mining, rock);
    this.typeText.textContent = getLangString("MINING_TYPE", rock.type);
    switch (rock.type) {
      case "Ore":
        this.typeText.classList.add("badge-warning");
        if (rock.id === "melvorTotH:Meteorite_Ore") {
          this.meteoriteText.textContent = getLangString(
            "MENU_TEXT",
            "METEORITE_VEIN"
          );
          this.meteoriteText.classList.remove("d-none");
        }
        break;
      case "Gem":
        this.typeText.classList.add("badge-primary");
        this.gemVeinText.textContent = getLangString("MENU_TEXT", "GEM_VEIN");
        this.gemVeinText.classList.remove("d-none");
        break;
      case "Essence":
        this.typeText.classList.add("badge-success");
        break;
    }
    this.mastery.setMastery(game.mining, rock);
  }
  updateHP(rock) {
    if (rock.isRespawning) {
      this.rockImage.src = cdnMedia(
        "assets/media/skills/mining/rock_empty.svg"
      );
    } else {
      this.rockImage.src = rock.media;
      const hpPercent = (rock.currentHP / rock.maxHP) * 100;
      this.hpProgress.setFixedPosition(hpPercent);
    }
    this.hpProgressText.textContent = `${rock.currentHP} / ${rock.maxHP}`;
  }
  setStatus(statusID) {
    var _a, _b;
    this.statusText.setAttribute("lang-id", statusID);
    if (statusID === "MINING") {
      (_a = this.statusText.parentElement) === null || _a === void 0
        ? void 0
        : _a.classList.add("badge", "badge-info");
    } else {
      (_b = this.statusText.parentElement) === null || _b === void 0
        ? void 0
        : _b.classList.remove("badge", "badge-info");
    }
  }
  setRequirement(reqText) {
    this.requirementText.textContent = reqText;
    showElement(this.requirementText);
  }
  hideRequirement() {
    hideElement(this.requirementText);
  }
  updateGrants(xp, masteryXP, masteryPoolXP, interval) {
    this.xpIcon.setXP(xp);
    this.masteryIcon.setXP(masteryXP);
    this.masteryPoolIcon.setXP(masteryPoolXP);
    this.intervalIcon.setInterval(interval);
  }
}
window.customElements.define("mining-rock", MiningRockMenu);
