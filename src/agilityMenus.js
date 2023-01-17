"use strict";
class BuiltAgilityObstacle extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("built-agility-obstacle-template"));
    this.blockContainer = getElementFromFragment(
      this._content,
      "block-container",
      "div"
    );
    this.builtContent = getElementFromFragment(
      this._content,
      "built-content",
      "div"
    );
    this.inactiveText = getElementFromFragment(
      this._content,
      "inactive-text",
      "h5"
    );
    this.name = getElementFromFragment(this._content, "name", "span");
    this.interval = getElementFromFragment(this._content, "interval", "span");
    this.xpGrants = getElementFromFragment(this._content, "xp-grants", "span");
    this.gpGrants = getElementFromFragment(this._content, "gp-grants", "span");
    this.masteryDisplay = getElementFromFragment(
      this._content,
      "mastery-display",
      "mastery-display"
    );
    this.bonusContainer = getElementFromFragment(
      this._content,
      "bonus-container",
      "div"
    );
    this.selectObstacleButton = getElementFromFragment(
      this._content,
      "select-obstacle-button",
      "button"
    );
    this.destroyObstacleButton = getElementFromFragment(
      this._content,
      "destroy-obstacle-button",
      "button"
    );
    this.unbuiltContent = getElementFromFragment(
      this._content,
      "unbuilt-content",
      "div"
    );
    this.unbuiltText = getElementFromFragment(
      this._content,
      "create-text",
      "h5"
    );
    this.tierName = getElementFromFragment(this._content, "tier-name", "h5");
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setUnbuilt(tier) {
    this.setTier(tier);
    this.blockContainer.classList.add("pointer-enabled");
    this.blockContainer.onclick = () =>
      game.agility.viewObstacleSelectionOnClick(tier);
    showElement(this.unbuiltContent);
    hideElement(this.builtContent);
  }
  setBuiltObstacle(obstacle) {
    this.setTier(obstacle.category);
    this.name.textContent = obstacle.name;
    this.masteryDisplay.setMastery(game.agility, obstacle);
    game.agility.updateMasteryDisplays(obstacle);
    this.blockContainer.classList.remove("pointer-enabled");
    this.blockContainer.onclick = null;
    this.selectObstacleButton.onclick = () =>
      game.agility.viewObstacleSelectionOnClick(obstacle.category);
    this.destroyObstacleButton.onclick = () =>
      game.agility.destroyObstacleOnClick(obstacle.category);
    showElement(this.builtContent);
    hideElement(this.unbuiltContent);
  }
  setTier(tier) {
    this.tierName.textContent = templateLangString(
      "MENU_TEXT",
      "OBSTACLE_NUMBER",
      { obstacleNumber: `${tier + 1}` }
    );
  }
  setLevelLocked(level) {
    this.blockContainer.classList.replace("border-agility", "border-danger");
    this.unbuiltText.textContent = templateLangString(
      "MENU_TEXT",
      "REQUIRES_LEVEL",
      { level: `${level}` }
    );
    this.unbuiltText.classList.replace("text-success", "text-danger");
  }
  setUnlocked() {
    this.blockContainer.classList.replace("border-danger", "border-agility");
    this.unbuiltText.textContent = getLangString(
      "MENU_TEXT",
      "CREATE_OBSTACLE"
    );
    this.unbuiltText.classList.replace("text-danger", "text-success");
  }
  updateRates(interval, xp, gp) {
    this.interval.textContent = templateLangString(
      "MENU_TEXT",
      "SECONDS_SHORT",
      { seconds: formatFixed(interval / 1000, 2) }
    );
    this.xpGrants.textContent = templateLangString("MENU_TEXT", "XP_AMOUNT", {
      xp: formatNumber(Math.floor(xp)),
    });
    this.gpGrants.textContent = formatNumber(gp);
  }
  updatePassives(passives) {
    this.bonusContainer.textContent = "";
    this.bonusContainer.append(
      ...passives.getModifierDescriptionsAsNodes("h5", ["font-size-sm", "m-1"])
    );
  }
  setHighlight(on) {
    if (on) {
      this.blockContainer.classList.add("bg-combat-menu-selected");
    } else {
      this.blockContainer.classList.remove("bg-combat-menu-selected");
    }
  }
  setActive() {
    hideElement(this.inactiveText);
  }
  setInactive() {
    showElement(this.inactiveText);
  }
}
window.customElements.define("built-agility-obstacle", BuiltAgilityObstacle);
class PassivePillarMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("agility-passive-pillar-template"));
    this.blockContainer = getElementFromFragment(
      this._content,
      "block-container",
      "div"
    );
    this.unbuiltContent = getElementFromFragment(
      this._content,
      "unbuilt-content",
      "div"
    );
    this.builtContent = getElementFromFragment(
      this._content,
      "built-content",
      "div"
    );
    this.activeText = getElementFromFragment(
      this._content,
      "active-text",
      "h5"
    );
    this.name = getElementFromFragment(this._content, "name", "h5");
    this.passiveContainer = getElementFromFragment(
      this._content,
      "passive-container",
      "div"
    );
    this.pillarSelectButton = getElementFromFragment(
      this._content,
      "pillar-selection-button",
      "button"
    );
    this.pillarDestroyButton = getElementFromFragment(
      this._content,
      "pillar-destroy-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setUnbuilt() {
    hideElement(this.builtContent);
    showElement(this.unbuiltContent);
    this.blockContainer.classList.replace("border-warning", "border-agility");
    this.blockContainer.classList.add("pointer-enabled");
    this.blockContainer.onclick = () =>
      game.agility.viewPillarSelectionOnClick();
  }
  setBuilt(pillar) {
    showElement(this.builtContent);
    hideElement(this.unbuiltContent);
    this.name.textContent = pillar.name;
    this.blockContainer.classList.replace("border-agility", "border-warning");
    this.blockContainer.classList.remove("pointer-enabled");
    this.blockContainer.onclick = null;
    this.pillarSelectButton.onclick = () =>
      game.agility.viewPillarSelectionOnClick();
    this.pillarDestroyButton.onclick = () =>
      game.agility.destroyPillarOnClick();
    const modifiers = new MappedModifiers();
    modifiers.addModifiers(pillar.modifiers);
    this.updatePassives(modifiers);
  }
  updatePassives(passives) {
    this.passiveContainer.textContent = "";
    this.passiveContainer.append(
      ...passives.getModifierDescriptionsAsNodes("h5", ["font-size-sm", "m-1"])
    );
  }
  setActive() {
    hideElement(this.activeText);
  }
  setInactive() {
    showElement(this.activeText);
  }
}
window.customElements.define("agility-passive-pillar", PassivePillarMenu);
class ElitePassivePillarMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("agility-elite-passive-pillar-template")
    );
    this.blockContainer = getElementFromFragment(
      this._content,
      "block-container",
      "div"
    );
    this.unbuiltContent = getElementFromFragment(
      this._content,
      "unbuilt-content",
      "div"
    );
    this.builtContent = getElementFromFragment(
      this._content,
      "built-content",
      "div"
    );
    this.activeText = getElementFromFragment(
      this._content,
      "active-text",
      "h5"
    );
    this.name = getElementFromFragment(this._content, "name", "h5");
    this.passiveContainer = getElementFromFragment(
      this._content,
      "passive-container",
      "div"
    );
    this.pillarSelectButton = getElementFromFragment(
      this._content,
      "pillar-selection-button",
      "button"
    );
    this.pillarDestroyButton = getElementFromFragment(
      this._content,
      "pillar-destroy-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setUnbuilt() {
    hideElement(this.builtContent);
    showElement(this.unbuiltContent);
    this.blockContainer.classList.replace("border-warning", "border-agility");
    this.blockContainer.classList.add("pointer-enabled");
    this.blockContainer.onclick = () =>
      game.agility.viewElitePillarSelectionOnClick();
  }
  setBuilt(pillar) {
    showElement(this.builtContent);
    hideElement(this.unbuiltContent);
    this.name.textContent = pillar.name;
    this.blockContainer.classList.replace("border-agility", "border-warning");
    this.blockContainer.classList.remove("pointer-enabled");
    this.blockContainer.onclick = null;
    this.pillarSelectButton.onclick = () =>
      game.agility.viewElitePillarSelectionOnClick();
    this.pillarDestroyButton.onclick = () =>
      game.agility.destroyElitePillarOnClick();
    const modifiers = new MappedModifiers();
    modifiers.addModifiers(pillar.modifiers);
    this.updatePassives(modifiers);
  }
  updatePassives(passives) {
    this.passiveContainer.textContent = "";
    this.passiveContainer.append(
      ...passives.getModifierDescriptionsAsNodes("h5", ["font-size-sm", "m-1"])
    );
  }
  setActive() {
    hideElement(this.activeText);
  }
  setInactive() {
    showElement(this.activeText);
  }
}
window.customElements.define(
  "agility-elite-passive-pillar",
  ElitePassivePillarMenu
);
class AgilityObstacleSelection extends HTMLElement {
  constructor() {
    super();
    this.obstacleOnlyElements = [];
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("agility-obstacle-selection-template")
    );
    this.link = getElementFromFragment(this._content, "link", "a");
    this.activeText = getElementFromFragment(
      this._content,
      "active-text",
      "h5"
    );
    this.name = getElementFromFragment(this._content, "name", "span");
    this.interval = getElementFromFragment(this._content, "interval", "span");
    this.masteryLevel = getElementFromFragment(
      this._content,
      "mastery-level",
      "span"
    );
    this.masteryPercent = getElementFromFragment(
      this._content,
      "mastery-percent",
      "small"
    );
    this.buildCount = getElementFromFragment(
      this._content,
      "build-count",
      "h5"
    );
    this.xpGrants = getElementFromFragment(this._content, "xp-grants", "span");
    this.gpGrants = getElementFromFragment(this._content, "gp-grants", "span");
    this.gpReduction = getElementFromFragment(
      this._content,
      "gp-reduction",
      "span"
    );
    this.scReduction = getElementFromFragment(
      this._content,
      "sc-reduction",
      "span"
    );
    this.itemReduction = getElementFromFragment(
      this._content,
      "item-reduction",
      "span"
    );
    this.costContainer = getElementFromFragment(
      this._content,
      "cost-container",
      "div"
    );
    this.requirementContainer = getElementFromFragment(
      this._content,
      "requirement-container",
      "div"
    );
    this.passivesContainer = getElementFromFragment(
      this._content,
      "passives-container",
      "div"
    );
    this.obstacleOnlyElements.push(
      getElementFromFragment(
        this._content,
        "interval-mastery-container",
        "span"
      ),
      getElementFromFragment(this._content, "cost-reduction-header", "h5"),
      getElementFromFragment(this._content, "requirement-header", "h5"),
      getElementFromFragment(this._content, "grants-title", "h5"),
      getElementFromFragment(this._content, "grants-container", "h5"),
      this.buildCount
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  createInlineRequirement(textClass) {
    return createElement("inline-requirement", {
      classList: ["font-size-sm", "font-w400", "mr-2", "ml-2", textClass],
    });
  }
  setCosts(items, gpReq, scReq) {
    this.costContainer.textContent = "";
    const addReq = (media, qty, name, currentQty) => {
      const newReq = this.createInlineRequirement(
        currentQty >= qty ? "text-success" : "text-danger"
      );
      this.costContainer.append(newReq);
      newReq.setContent(media, formatNumber(qty), name);
    };
    items.forEach(({ item, quantity }) => {
      addReq(item.media, quantity, item.name, game.bank.getQty(item));
    });
    if (gpReq > 0) {
      addReq(
        cdnMedia("assets/media/main/coins.svg"),
        gpReq,
        getLangString("MENU_TEXT", "GP"),
        game.gp.amount
      );
    }
    if (scReq > 0) {
      addReq(
        cdnMedia("assets/media/main/slayer_coins.svg"),
        scReq,
        getLangString("MENU_TEXT", "SLAYER_COINS"),
        game.slayerCoins.amount
      );
    }
  }
  setPassives(passives) {
    this.passivesContainer.textContent = "";
    this.passivesContainer.append(
      ...passives.getModifierDescriptionsAsNodes("h5", ["font-size-sm", "m-1"])
    );
  }
  setBuildStatus(built) {
    if (built) {
      showElement(this.activeText);
      this.link.classList.replace("border-agility", "border-success");
    } else {
      hideElement(this.activeText);
      this.link.classList.replace("border-success", "border-agility");
    }
  }
  setObstacle(obstacle) {
    this.obstacleOnlyElements.forEach(showElement);
    this.link.onclick = () => game.agility.buildObstacleOnClick(obstacle);
    this.setBuildStatus(game.agility.isObstacleBuilt(obstacle));
    this.name.textContent = obstacle.name;
    this.interval.textContent = templateLangString(
      "MENU_TEXT",
      "SECONDS_SHORT",
      {
        seconds: formatFixed(
          game.agility.getObstacleInterval(obstacle) / 1000,
          2
        ),
      }
    );
    const masteryProgress = game.agility.getMasteryProgress(obstacle);
    this.masteryLevel.textContent = `${masteryProgress.level}`;
    this.masteryPercent.textContent = `(${formatPercent(
      masteryProgress.percent,
      2
    )})`;
    this.buildCount.textContent = "";
    this.buildCount.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "BUILD_COUNT",
        {
          count: createElement("span", {
            classList: ["text-warning"],
            text: `${game.agility.getObstacleBuildCount(obstacle)}`,
          }),
        },
        {}
      )
    );
    const costModifier = 100 + game.agility.getObstacleCostModifier(obstacle);
    const itemModifier =
      100 + game.agility.getObstacleItemCostModifier(obstacle);
    this.gpReduction.textContent = formatPercent(costModifier);
    this.scReduction.textContent = formatPercent(costModifier);
    this.itemReduction.textContent = formatPercent(itemModifier);
    const costs = game.agility.getObstacleBuildCosts(obstacle);
    this.setCosts(costs.getItemQuantityArray(), costs.gp, costs.sc);
    this.requirementContainer.textContent = "";
    if (obstacle.skillRequirements.length === 0) {
      this.requirementContainer.append(
        createElement("span", {
          classList: [
            "font-size-sm",
            "font-w400",
            "mr-2",
            "ml-2",
            "text-success",
          ],
          text: getLangString("MENU_TEXT", "NO_REQUIREMENT"),
        })
      );
    } else {
      obstacle.skillRequirements.forEach((requirement) => {
        const textClass = game.checkSkillRequirement(requirement, false)
          ? "text-success"
          : "text-danger";
        const newReq = this.createInlineRequirement(textClass);
        this.requirementContainer.append(newReq);
        newReq.setContent(
          requirement.skill.media,
          templateLangString("MENU_TEXT", "LEVEL", {
            level: `${requirement.level}`,
          }),
          requirement.skill.name
        );
      });
    }
    this.gpGrants.textContent = formatNumber(
      game.agility.getObstacleGP(obstacle)
    );
    this.xpGrants.textContent = templateLangString("MENU_TEXT", "XP_AMOUNT", {
      xp: formatNumber(
        Math.floor(game.agility.modifyXP(obstacle.baseExperience))
      ),
    });
    this.setPassives(game.agility.getObstacleModifiers(obstacle));
  }
  setPillar(pillar) {
    this.obstacleOnlyElements.forEach(hideElement);
    this.link.onclick = () => game.agility.buildPillarOnClick(pillar);
    this.setBuildStatus(game.agility.isPillarBuilt(pillar));
    this.name.textContent = pillar.name;
    const costs = game.agility.getPillarBuildCosts(pillar);
    this.setCosts(costs.getItemQuantityArray(), costs.gp, costs.sc);
    this.setPassives(game.agility.getPillarModifiers(pillar));
  }
  setElitePillar(pillar) {
    this.obstacleOnlyElements.forEach(hideElement);
    this.link.onclick = () => game.agility.buildElitePillarOnClick(pillar);
    this.setBuildStatus(game.agility.isElitePillarBuilt(pillar));
    this.name.textContent = pillar.name;
    const costs = game.agility.getPillarBuildCosts(pillar);
    this.setCosts(costs.getItemQuantityArray(), costs.gp, costs.sc);
    this.setPassives(game.agility.getPillarModifiers(pillar));
  }
}
window.customElements.define(
  "agility-obstacle-selection",
  AgilityObstacleSelection
);
class InlineRequirement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("inline-requirement-template"));
    this.image = getElementFromFragment(this._content, "image", "img");
    this.text = getElementFromFragment(this._content, "text", "span");
  }
  setContent(media, text, tooltipText) {
    var _a;
    this.image.src = media;
    this.text.textContent = text;
    (_a = this.imageTooltip) === null || _a === void 0
      ? void 0
      : _a.setContent(tooltipText);
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.imageTooltip = tippy(this.image, {
      placement: "bottom",
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.imageTooltip !== undefined) this.imageTooltip.destroy();
  }
}
window.customElements.define("inline-requirement", InlineRequirement);
class MultiProgressBar extends HTMLElement {
  constructor() {
    super();
    this.progressDivs = [];
    this.animatedSegment = -1;
    this.filledSegments = 0;
    this.segmentPattern = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("multi-progress-bar-template"));
    this.barContainer = getElementFromFragment(
      this._content,
      "bar-container",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  getPatternClass(segmentNumber) {
    const index = segmentNumber % this.segmentPattern.length;
    return this.segmentPattern[index];
  }
  stopSegmentAnimation(segmentNumber) {
    const segment = this.progressDivs[segmentNumber].bar;
    void segment.offsetHeight;
    segment.style.width = "0%";
    segment.style.animation = "none";
  }
  startSegmentAnimation(segmentNumber, timer) {
    const elapsedTime = (timer.maxTicks - timer.ticksLeft) * TICK_INTERVAL;
    const totalTime = timer.maxTicks * TICK_INTERVAL;
    const segment = this.progressDivs[segmentNumber].bar;
    const delay = -elapsedTime / 1000;
    const duration = totalTime / 1000;
    segment.style.animation = "none";
    void segment.offsetHeight;
    segment.style.animation = `${duration}s linear ${delay}s 1 progressBar`;
  }
  setMaxSegments(count) {
    const width = `width: ${100 / count}%`;
    while (this.progressDivs.length < count) {
      const container = createElement("div", {
        classList: ["d-flex"],
        attributes: [["style", width]],
        parent: this.barContainer,
      });
      const bar = createElement("div", {
        classList: [
          "progress-bar",
          this.getPatternClass(this.progressDivs.length),
        ],
        attributes: [
          ["style", "width: 0%"],
          ["aria-value-now", "0"],
          ["aria-value-min", "0"],
          ["aria-valuemax", "100"],
        ],
        parent: container,
      });
      this.progressDivs.push({ bar, container });
    }
    while (this.progressDivs.length > count) {
      const removedDiv = this.progressDivs.pop();
      if (removedDiv !== undefined)
        this.barContainer.removeChild(removedDiv.container);
    }
  }
  setSegmentPattern(classPattern) {
    this.segmentPattern = classPattern;
    this.progressDivs.forEach((div, segmentNumber) => {
      div.bar.className = "progress-bar";
      div.bar.classList.add(this.getPatternClass(segmentNumber));
    });
  }
  animateFromTimer(segment, timer) {
    if (!game.settings.enableProgressBars) return;
    if (this.animatedSegment !== segment && this.animatedSegment !== -1) {
      this.stopSegmentAnimation(this.animatedSegment);
    }
    if (this.filledSegments > segment) {
      while (this.filledSegments > segment) {
        this.filledSegments--;
        this.progressDivs[this.filledSegments].bar.style.width = "0%";
      }
    } else if (this.filledSegments < segment) {
      while (this.filledSegments < segment) {
        this.progressDivs[this.filledSegments].bar.style.width = "100%";
        this.filledSegments++;
      }
    }
    this.startSegmentAnimation(segment, timer);
    this.animatedSegment = segment;
  }
  stopAnimation() {
    if (!game.settings.enableProgressBars) return;
    if (this.animatedSegment !== -1)
      this.stopSegmentAnimation(this.animatedSegment);
    while (this.filledSegments > 0) {
      this.filledSegments--;
      this.progressDivs[this.filledSegments].bar.style.width = "0%";
    }
  }
}
window.customElements.define("multi-progress-bar", MultiProgressBar);
