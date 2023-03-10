"use strict";
class TownshipResourceDisplayElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-resource-display-template"));
    this.setPriorityButton = getElementFromFragment(
      this._content,
      "set-priority-button",
      "li"
    );
    this.resourceIcon = getElementFromFragment(
      this._content,
      "resource-icon",
      "img"
    );
    this.resourceAmount = getElementFromFragment(
      this._content,
      "resource-amount",
      "small"
    );
    this.resourceRate = getElementFromFragment(
      this._content,
      "resource-rate",
      "span"
    );
    this.workerBadge = getElementFromFragment(
      this._content,
      "worker-badge",
      "div"
    );
    this.assignedWorkers = getElementFromFragment(
      this._content,
      "assigned-workers",
      "span"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.tooltip = tippy(this.setPriorityButton, {
      placement: "top",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }
  setResource(resource, township) {
    var _a;
    this.resourceIcon.src = resource.media;
    this.updateResourceAmount(resource, township);
    this.updateResourceRate(resource, township);
    const job = resource.producingJob;
    if (job !== undefined) {
      showElement(this.workerBadge);
      this.updateAssignedWorkers(job);
      this.setPriorityButton.classList.add("pointer-enabled");
      this.setPriorityButton.onclick = () => township.setPriorityJob(job);
    } else {
      hideElement(this.workerBadge);
      this.setPriorityButton.classList.remove("pointer-enabled");
      this.setPriorityButton.onclick = null;
    }
    (_a = this.tooltip) === null || _a === void 0
      ? void 0
      : _a.setProps({
          onShow: (instance) => {
            instance.setContent(this.getTooltipContent(resource, township));
          },
        });
  }
  updateResourceAmount(resource, township) {
    if (resource.localID === "GP")
      this.resourceAmount.textContent = templateString(
        getLangString("TOWNSHIP_MENU", "TAX_RATE"),
        { value: township.taxRate.toFixed(1) }
      );
    else {
      this.resourceAmount.textContent =
        (game.settings.enableAccessibility ? `${resource.name}: ` : "") +
        numberWithCommas(Math.floor(resource.amount));
      this.updateResourceTextColour(resource, township);
    }
  }
  updateResourceTextColour(resource, township) {
    if (resource.amount >= township.getMaxResourceAmount(resource)) {
      this.resourceAmount.classList.add("text-warning");
    } else {
      this.resourceAmount.classList.remove("text-warning");
    }
  }
  updateResourceRate(resource, township) {
    const netRate = township.getNetResourceRate(resource);
    this.resourceRate.textContent = `${
      netRate > 0 ? "+" : ""
    }${numberWithCommas(netRate.toFixed(2))} /t`;
    this.resourceRate.classList.remove(
      "text-success",
      "text-muted",
      "text-danger"
    );
    if (netRate > 0) {
      this.resourceRate.classList.add("text-success");
    } else if (netRate === 0) {
      this.resourceRate.classList.add("text-muted");
    } else {
      this.resourceRate.classList.add("text-danger");
    }
  }
  updateAssignedWorkers(job) {
    this.assignedWorkers.textContent = `${job.assigned} / ${job.maxAvailable}`;
  }
  highlightButton() {
    this.setPriorityButton.classList.add("spell-selected");
  }
  unhighlightButton() {
    this.setPriorityButton.classList.remove("spell-selected");
  }
  getTooltipContent(resource, township) {
    let extraInfo = "";
    if (resource.localID === "GP") {
      extraInfo = `<br><small class="font-w600">${templateString(
        getLangString("TOWNSHIP_MENU", "TOTAL_GP_EARNED"),
        { number: `${numberWithCommas(Math.floor(resource.amount))}` }
      )}</span></small>`;
    }
    return `<div class="text-center" style="max-width:200px;"><small class="font-w700 text-warning">${
      resource.name
    }</small>${
      resource.id === "melvorF:GP"
        ? `<br><small>${templateString(
            getLangString("TOWNSHIP_MENU", "TAX_RATE"),
            { value: `${township.taxRate}` }
          )}</small><br>`
        : "<br>"
    }<small class="font-w600">${getLangString(
      "TOWNSHIP_MENU",
      "BREAKDOWN"
    )}</small><br><small class="text-success">${this.getResourcePerTickGainSpan(
      resource,
      township
    )}</small> <small class="text-danger">${this.getResourcePerTickUsageSpan(
      resource,
      township
    )}</small>${
      resource.producingJob !== undefined
        ? `<br><small class="font-w400 text-info">${getLangString(
            "TOWNSHIP_MENU",
            "CLICK_WORKER_PRIORITY"
          )}</small>`
        : ""
    }${extraInfo}</div>`;
  }
  getResourcePerTickUsageSpan(resource, township) {
    const usage = township.getTrueResourceUsage(resource);
    const span = `-${numberWithCommas(usage.toFixed(2))}`;
    return span;
  }
  getResourcePerTickGainSpan(resource, township) {
    const gain =
      resource.type === TownshipResourceTypeID.Product
        ? township.getTrueMaxProductCreationAmount(resource)
        : resource.generation;
    return `+${numberWithCommas(gain.toFixed(2))}`;
  }
}
window.customElements.define(
  "township-resource-display",
  TownshipResourceDisplayElement
);
class TownshipTownBiomeSelectElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("township-town-biome-select-template")
    );
    this.selectButton = getElementFromFragment(
      this._content,
      "select-button",
      "a"
    );
    this.biomeName = getElementFromFragment(
      this._content,
      "biome-name",
      "span"
    );
    this.biomeCount = getElementFromFragment(
      this._content,
      "biome-count",
      "small"
    );
    this.biomeImage = getElementFromFragment(
      this._content,
      "biome-image",
      "img"
    );
    this.buildingCount = getElementFromFragment(
      this._content,
      "building-count",
      "small"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setBiome(biome, township) {
    if (biome === undefined) {
      this.biomeName.textContent = getLangString("TOWNSHIP_MENU", "VIEW_ALL");
      hideElement(this.biomeCount);
      hideElement(this.biomeImage);
    } else {
      this.selectButton.id = `township-town-biome-select-select-button-${biome.localID}`;
      this.biomeName.textContent = biome.name;
      this.biomeImage.src = biome.media;
      showElement(this.biomeCount);
      showElement(this.biomeImage);
      this.updateBuildingCount(biome, township);
    }
    this.selectButton.onclick = () => township.setTownBiome(biome);
    if (nativeManager.isMobile) {
      this.setAsMobileLayout(biome);
      const el = document.getElementById("TOWNSHIP_BIOME_SELECT_ELEMENTS");
      el === null || el === void 0
        ? void 0
        : el.classList.add("nav-main-horizontal");
      el === null || el === void 0 ? void 0 : el.classList.remove("px-3");
    }
  }
  updateBuildingCount(biome, township) {
    this.biomeCount.textContent = `(${township.getTotalBuildingsInBiome(
      biome
    )} / ${biome.amountPurchased})`;
  }
  highlight(biome) {
    this.selectButton.classList.add("spell-selected");
  }
  unhighlight(biome) {
    this.selectButton.classList.remove("spell-selected");
  }
  setAsMobileLayout(biome) {
    this.biomeImage.classList.replace("skill-icon-sm", "skill-icon-xs");
    if (biome !== undefined) this.selectButton.classList.replace("p-2", "p-1");
  }
  setBuildingCount(building, biome) {
    this.buildingCount.textContent = biome
      .getBuildingCount(building)
      .toString();
  }
  showBuildingCount() {
    showElement(this.buildingCount);
  }
  hideBuildingCount() {
    hideElement(this.buildingCount);
  }
  highlightBorder() {
    this.selectButton.classList.replace(
      "ts-biome-select-border",
      "ts-building-in-town-border"
    );
  }
  unhighlightBorder() {
    this.selectButton.classList.replace(
      "ts-building-in-town-border",
      "ts-biome-select-border"
    );
  }
}
window.customElements.define(
  "township-town-biome-select",
  TownshipTownBiomeSelectElement
);
class TownshipBuildingSummaryElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-building-summary-template"));
    this.image = getElementFromFragment(this._content, "image", "img");
    this.name = getElementFromFragment(this._content, "name", "span");
    this.count = getElementFromFragment(this._content, "count", "small");
    this.provides = getElementFromFragment(this._content, "provides", "ul");
    this.resourceOutput = getElementFromFragment(
      this._content,
      "resource-output",
      "div"
    );
    this.resourceUsage = getElementFromFragment(
      this._content,
      "resource-usage",
      "div"
    );
    this.modifiers = getElementFromFragment(this._content, "modifiers", "div");
    this.extraRequirements = getElementFromFragment(
      this._content,
      "extra-requirements",
      "div"
    );
    this.levelRequirement = getElementFromFragment(
      this._content,
      "level-requirement",
      "div"
    );
    this.popRequirement = getElementFromFragment(
      this._content,
      "pop-requirement",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setBuilding(building, township) {
    this.image.src = building.media;
    this.name.textContent = building.name;
    if (!game.settings.darkMode)
      this.name.classList.replace("text-warning", "text-primary");
    this.updateBuildingCount(township.countNumberOfBuildings(building));
    this.updateForBuildQtyChange(building, township);
    this.updateExtraRequirements(building, township);
    this.updateModifiers(building);
  }
  setBuildingWithoutQuantity(building, township) {
    this.image.src = building.media;
    this.name.textContent = building.name;
    if (!game.settings.darkMode)
      this.name.classList.replace("text-warning", "text-primary");
    this.updateBuildingCount(township.countNumberOfBuildings(building));
    this.updateForBaseBuildQty(building, township);
    this.updateExtraRequirements(building, township);
    this.updateModifiers(building);
  }
  updateNameQuantity(building, quantity) {
    this.name.textContent = `${quantity} x ${building.name}`;
  }
  updateBuildingCount(count) {
    this.count.textContent = `${count}`;
  }
  createProvidesElement(iconClass, value) {
    return `<li class="mr-2 ${
      !game.settings.darkMode ? "rounded bg-light px-1 mb-1" : ""
    }"><i class="fa mr-1 ${iconClass}"></i>${
      value > 0 ? "+" : ""
    }${numberWithCommas(value)}</li>`;
  }
  updateBuildingProvides(building, township, qty = 1) {
    const provides = [];
    if (building.provides.population > 0 || building.provides.population < 0) {
      provides.push(
        this.createProvidesElement(
          "fa-house-user",
          building.provides.population * qty
        )
      );
    }
    if (building.provides.storage > 0 || building.provides.storage < 0) {
      provides.push(
        this.createProvidesElement(
          "fa-box-open",
          building.provides.storage * qty
        )
      );
    }
    if (building.provides.education > 0 || building.provides.education < 0) {
      provides.push(
        this.createProvidesElement(
          "fa-book-open text-info",
          building.provides.education * qty
        )
      );
    }
    if (building.provides.happiness > 0 || building.provides.happiness < 0) {
      const baseProvided = building.provides.happiness * qty;
      const modifiedProvided =
        township.applyBuildingHappinessPenalty(baseProvided);
      let totalColour = "";
      if (baseProvided !== modifiedProvided)
        totalColour =
          modifiedProvided > baseProvided ? "text-success" : "text-danger";
      provides.push(
        `<li class="mr-2 ${
          !game.settings.darkMode ? "rounded bg-light px-1 mb-1" : ""
        }"><i class="fa fa-smile mr-1" style="color:yellow;"></i><span class="${totalColour}">${
          modifiedProvided > 0 ? "+" : ""
        }${numberWithCommas(modifiedProvided)}`
      );
    }
    if (building.provides.worship !== undefined) {
      provides.push(
        this.createProvidesElement(
          "fa-church text-danger",
          building.provides.worship * qty
        )
      );
    }
    if (building.provides.deadStorage !== undefined) {
      const storagePerBuilding = township.getDeadStoragePerBuilding(building);
      provides.push(
        this.createProvidesElement(
          "fa-skull-crossbones text-warning",
          storagePerBuilding * qty
        )
      );
    }
    this.provides.innerHTML = provides.join("");
  }
  updateResourceOutput(building, township, qty = 1) {
    if (building.provides.resources.size === 0) {
      hideElement(this.resourceOutput);
      return;
    }
    showElement(this.resourceOutput);
    let html = "";
    building.provides.resources.forEach((quantity, resource) => {
      const originalAmount = quantity * 100;
      const amount =
        township.townData.currentBuildBiome === undefined
          ? 0
          : township.getSingleResourceGainAmountInBiome(
              resource,
              building,
              township.townData.currentBuildBiome
            );
      let textClass = "";
      if (amount > originalAmount) textClass = "text-success";
      else if (amount < originalAmount || amount < 0) textClass = "text-danger";
      const textSymbol = amount < 0 ? "" : "+";
      let workerCount = 0;
      if (resource.producingJob !== undefined)
        workerCount = building.provides.workerCount(resource.producingJob);
      workerCount *= qty;
      html += `<ul class="nav-main nav-main-horizontal nav-main-horizontal-override font-w400 font-size-xs">
          <li class="mr-2 ${textClass} ${
        !game.settings.darkMode ? "rounded bg-light px-1 mb-1" : ""
      }"><img class="skill-icon-xxs mr-1" src="${
        resource.media
      }"> ${textSymbol}${amount.toFixed(2)} /t</li>
          <li><i class="fa fa-user mr-1"></i>${workerCount}</li></ul>`;
    });
    this.resourceOutput.innerHTML = html;
  }
  updateResourceUsage(building, township, qty = 1) {
    const usageHTML = townshipUI.getBuildingResourceUsage(building);
    if (usageHTML.length === 0) {
      hideElement(this.resourceUsage);
    } else {
      showElement(this.resourceUsage);
      this.resourceUsage.innerHTML = usageHTML;
    }
  }
  updateModifiers(building) {
    if (building.modifiers === undefined) {
      hideElement(this.modifiers);
    } else {
      showElement(this.modifiers);
      this.modifiers.innerHTML = `${
        !game.settings.darkMode ? '<div class="rounded bg-light px-1">' : ""
      }${describeModifierDataLineBreak(building.modifiers)}${
        !game.settings.darkMode ? "</div>" : ""
      }`;
    }
  }
  applyReqFormatting(req, isMet) {
    if (isMet) {
      req.classList.replace("font-w600", "font-w400");
      req.classList.replace("text-danger", "text-success");
    } else {
      req.classList.replace("font-w400", "font-w600");
      req.classList.replace("text-success", "text-danger");
    }
  }
  updateExtraRequirements(building, township) {
    if (township.canBuildTierOfBuilding(building)) {
      hideElement(this.extraRequirements);
      return;
    }
    const levelRequired = township.populationForTier[building.tier].level;
    const popRequired = township.populationForTier[building.tier].population;
    this.applyReqFormatting(
      this.levelRequirement,
      township.level >= levelRequired
    );
    this.levelRequirement.textContent = `Requires Township Level ${levelRequired}`;
    this.applyReqFormatting(
      this.popRequirement,
      township.currentPopulation >= popRequired
    );
    this.popRequirement.textContent = `Requires population of ${popRequired}`;
  }
  updateForBuildQtyChange(building, township) {
    this.updateBuildingProvides(building, township, township.buildQty);
    this.updateResourceOutput(building, township, township.buildQty);
    this.updateResourceUsage(building, township, township.buildQty);
  }
  updateForBaseBuildQty(building, township) {
    this.updateBuildingProvides(building, township, 1);
    this.updateResourceOutput(building, township, 1);
    this.updateResourceUsage(building, township, 1);
  }
}
window.customElements.define(
  "township-building-summary",
  TownshipBuildingSummaryElement
);
class BuildingInTownElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("building-in-town-template"));
    this.buildingDiv = getElementFromFragment(
      this._content,
      "building-div",
      "div"
    );
    this.buildingImage = getElementFromFragment(
      this._content,
      "building-image",
      "img"
    );
    this.buildingName = getElementFromFragment(
      this._content,
      "building-name",
      "span"
    );
    this.buildingTaskIcon = getElementFromFragment(
      this._content,
      "building-task-icon",
      "img"
    );
    this.buildingCount = getElementFromFragment(
      this._content,
      "building-count",
      "small"
    );
    this.destroyContainer = getElementFromFragment(
      this._content,
      "destroy-container",
      "div"
    );
    this.destroyButton = getElementFromFragment(
      this._content,
      "destroy-button",
      "button"
    );
    this.destroyQtyOptions = getElementFromFragment(
      this._content,
      "destroy-qty-options",
      "div"
    );
    this.buildingTotals = getElementFromFragment(
      this._content,
      "building-totals",
      "ul"
    );
    this.buildingResources = getElementFromFragment(
      this._content,
      "building-resources",
      "div"
    );
    this.resourceOutput = getElementFromFragment(
      this._content,
      "resource-output",
      "div"
    );
    this.resourceUsage = getElementFromFragment(
      this._content,
      "resource-usage",
      "div"
    );
    this.buildingModifiers = getElementFromFragment(
      this._content,
      "building-modifiers",
      "div"
    );
    this.upgradesToDivider = getElementFromFragment(
      this._content,
      "upgrades-to-divider",
      "div"
    );
    this.selectBiomeWarning = getElementFromFragment(
      this._content,
      "select-biome-warning",
      "div"
    );
    this.upgradesToContainer = getElementFromFragment(
      this._content,
      "upgrades-to-container",
      "div"
    );
    this.upgradesToName = getElementFromFragment(
      this._content,
      "upgrades-to-name",
      "li"
    );
    this.upgradesToCosts = getElementFromFragment(
      this._content,
      "upgrades-to-costs",
      "ul"
    );
    this.upgradeButton = getElementFromFragment(
      this._content,
      "upgrade-button",
      "button"
    );
    this.upgradeQtyOptions = getElementFromFragment(
      this._content,
      "upgrade-qty-options",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.upgradesToTooltip = tippy(this.upgradesToName, {
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  initQtyDropdowns(townshipUI) {
    TownshipUI.destroyBuildingOptions.forEach((count) => {
      const newOption = createElement("a", {
        className: "dropdown-item pointer-enabled",
        text: `${count}`,
      });
      newOption.onclick = () => townshipUI.setDestroyQty(count);
      this.destroyQtyOptions.append(newOption);
    });
    TownshipUI.upgradeBuildingOptions.forEach((count) => {
      const newOption = createElement("a", {
        className: "dropdown-item pointer-enabled",
        text: `${count}`,
      });
      newOption.onclick = () => townshipUI.setUpgradeQty(count);
      this.upgradeQtyOptions.append(newOption);
    });
  }
  setBuilding(building, township) {
    var _a;
    this.buildingDiv.id = `building-in-town-building-div-${building.localID}`;
    this.buildingDiv.onmouseover = () =>
      townshipUI.highlightBiomesWithBuildingBuilt(building);
    this.buildingDiv.onmouseleave = () =>
      townshipUI.unhighlightBiomesWithBuildingBuilt();
    this.buildingImage.src = building.media;
    this.buildingTaskIcon.src = cdnMedia(
      "assets/media/skills/township/menu_tasks.svg"
    );
    this.buildingName.textContent = building.name;
    if (!game.settings.darkMode)
      this.buildingName.classList.replace("text-warning", "text-primary");
    this.destroyButton.onclick = () => township.destroyBuilding(building);
    this.updateBuildingTotals(building, township);
    this.updateResourceTotals(building, township);
    this.setResourceUsage(building, townshipUI);
    this.updateModifierTotals(building);
    const upgradesTo = building.upgradesTo;
    if (upgradesTo !== undefined) {
      showElement(this.upgradesToDivider);
      this.upgradesToName.textContent = upgradesTo.name;
      this.updateBuildingUpgradeCosts(upgradesTo, township);
      this.upgradeButton.onclick = () => township.buildBuilding(upgradesTo);
      (_a = this.upgradesToTooltip) === null || _a === void 0
        ? void 0
        : _a.setProps({
            onShow: (instance) => {
              const summary = new TownshipBuildingSummaryElement();
              summary.setBuildingWithoutQuantity(upgradesTo, township);
              instance.setContent(summary);
            },
          });
    } else {
      hideElement(this.upgradesToDivider);
    }
  }
  updateBuildingCount(count) {
    this.buildingCount.textContent = `${count}`;
  }
  updateBuildingUpgradeCosts(upgradesTo, township) {
    if (
      township.currentTownBiome === undefined ||
      upgradesTo.upgradesFrom === undefined
    )
      return;
    const maxUpgradeCount = township.currentTownBiome.getBuildingCount(
      upgradesTo.upgradesFrom
    );
    const upgradeQty = Math.min(maxUpgradeCount, township.upgradeQty);
    this.upgradesToCosts.innerHTML = `<li class="mr-1 font-w600">${getLangString(
      "MENU_TEXT",
      "COST"
    )}</li>
    ${townshipUI.getBuildingCostHTML(upgradesTo, upgradeQty)}`;
    if (
      township.canBuildTierOfBuilding(upgradesTo) &&
      township.canAffordBuilding(upgradesTo, upgradeQty)
    ) {
      this.upgradeButton.disabled = false;
      this.upgradeButton.classList.replace("bg-danger", "bg-secondary");
    } else {
      this.upgradeButton.disabled = true;
      this.upgradeButton.classList.replace("bg-secondary", "bg-danger");
    }
  }
  toggleBuildOptions(show, hasUpgrade) {
    if (show) {
      showElement(this.destroyContainer);
      hideElement(this.selectBiomeWarning);
      hasUpgrade
        ? showElement(this.upgradesToContainer)
        : hideElement(this.upgradesToContainer);
    } else {
      hideElement(this.destroyContainer);
      hideElement(this.upgradesToContainer);
      if (hasUpgrade) showElement(this.selectBiomeWarning);
      else hideElement(this.selectBiomeWarning);
    }
  }
  createTotalElement(iconClass, total) {
    return `<li class="mr-2"><i class="fa mr-1 ${iconClass}"></i>${numberWithCommas(
      total
    )}</li>`;
  }
  updateBuildingTotals(building, township) {
    const count = township.countNumberOfBuildings(building);
    const totals = [];
    if (building.provides.population > 0) {
      totals.push(
        this.createTotalElement(
          "fa-house-user",
          building.provides.population * count
        )
      );
    }
    if (building.provides.storage > 0) {
      totals.push(
        this.createTotalElement(
          "fa-box-open",
          building.provides.storage * count
        )
      );
    }
    if (building.provides.education > 0) {
      totals.push(
        this.createTotalElement(
          "fa-book-open text-info",
          building.provides.education * count
        )
      );
    }
    if (building.provides.happiness > 0) {
      const baseTotal = building.provides.happiness * count;
      const modifiedTotal = township.applyBuildingHappinessPenalty(baseTotal);
      let totalColour = "";
      if (baseTotal !== modifiedTotal)
        totalColour =
          modifiedTotal > baseTotal ? "text-success" : "text-danger";
      totals.push(
        `<li class="mr-2"><i class="fa fa-smile mr-1" style="color:yellow;"></i><span class="${totalColour}">+${numberWithCommas(
          modifiedTotal
        )}`
      );
    }
    if (building.provides.worship !== undefined) {
      totals.push(
        this.createTotalElement(
          "fa-church text-danger",
          building.provides.worship * count
        )
      );
    }
    if (building.provides.deadStorage !== undefined) {
      const storagePerBuilding = township.getDeadStoragePerBuilding(building);
      totals.push(
        this.createTotalElement(
          "fa-skull-crossbones text-warning",
          storagePerBuilding * count
        )
      );
    }
    this.buildingTotals.innerHTML = totals.join("");
  }
  updateResourceTotals(building, township) {
    let html = "";
    building.provides.resources.forEach((_, resource) => {
      let amount = 0;
      let totalWorkers = 0;
      const job = resource.producingJob;
      if (job !== undefined) {
        township.biomes.forEach((biome) => {
          const buildingCountInBiome = biome.getBuildingCount(building);
          const workersForBuilding =
            building.provides.workerCount(job) * buildingCountInBiome;
          totalWorkers += workersForBuilding;
          amount +=
            township.getSingleResourceGainAmountInBiome(
              resource,
              building,
              biome
            ) * workersForBuilding;
        });
      }
      const averageAmount = amount / totalWorkers;
      const textClass = averageAmount < 0 ? "text-danger" : "";
      const textSymbol = averageAmount < 0 ? "" : "+";
      html += `<ul class="nav-main nav-main-horizontal nav-main-horizontal-override font-w400 font-size-xs">
          <li class="mr-2 ${textClass}"><img class="skill-icon-xxs mr-1" src="${
        resource.media
      }">  ${textSymbol}${numberWithCommas(averageAmount.toFixed(2))} /t</li>
          <li><i class="fa fa-user mr-1"></i>${totalWorkers}</li></ul>`;
    });
    this.resourceOutput.innerHTML = html;
  }
  setResourceUsage(building, townshipUI) {
    const html = townshipUI.getBuildingResourceUsage(building);
    if (html.length === 0) {
      hideElement(this.resourceUsage);
    } else {
      this.resourceUsage.innerHTML = html;
      showElement(this.resourceUsage);
    }
  }
  updateModifierTotals(building) {
    if (building.modifiers === undefined) {
      hideElement(this.buildingModifiers);
      return;
    }
    if (building.providedModifiers === undefined) return;
    this.buildingModifiers.innerHTML = building.providedModifiers
      .getActiveModifierDescriptionsToPrecision(1)
      .map(
        ([text, textClass]) =>
          `<span class="font-w400 mb-1 ${textClass}">${text}</h5>`
      )
      .join("");
  }
}
window.customElements.define("building-in-town", BuildingInTownElement);
class TownshipBuildBiomeSelectElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("township-build-biome-select-template")
    );
    this.selectButton = getElementFromFragment(
      this._content,
      "select-button",
      "a"
    );
    this.biomeName = getElementFromFragment(
      this._content,
      "biome-name",
      "span"
    );
    this.biomesRemaining = getElementFromFragment(
      this._content,
      "biomes-remaining",
      "small"
    );
    this.biomeImage = getElementFromFragment(
      this._content,
      "biome-image",
      "img"
    );
    this.buildImage = getElementFromFragment(
      this._content,
      "build-image",
      "img"
    );
    this.containsResources = getElementFromFragment(
      this._content,
      "contains-resources",
      "div"
    );
    this.buildingCount = getElementFromFragment(
      this._content,
      "building-count",
      "small"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setBiome(biome, township) {
    this.biomeName.textContent = biome.name;
    this.biomeImage.src = biome.media;
    this.selectButton.onclick = () => township.setBuildBiome(biome);
    this.selectButton.id = `township-build-biome-select-select-button-${biome.localID}`;
    this.biomesRemaining.textContent = `(${biome.amountPurchased}) [${biome.amountPurchased} / ${biome.totalInMap}]`;
    this.buildImage.src = cdnMedia("assets/media/skills/township/hammer.png");
  }
  updateBiomesRemaining(text) {
    this.biomesRemaining.innerHTML = text;
  }
  highlight() {
    this.selectButton.classList.add("spell-selected");
  }
  unhighlight() {
    this.selectButton.classList.remove("spell-selected");
  }
  showHighlightBorder() {
    this.selectButton.classList.replace(
      "ts-biome-select-border",
      "ts-biome-highlight"
    );
  }
  hideHighlightBorder() {
    this.selectButton.classList.replace(
      "ts-biome-highlight",
      "ts-biome-select-border"
    );
  }
  showFilterHighlightBorder() {
    this.selectButton.classList.add("ts-biome-build-filter-highlight");
  }
  hideFilterHighlightBorder() {
    this.selectButton.classList.remove("ts-biome-build-filter-highlight");
  }
  showBuildable() {
    showElement(this.buildImage);
  }
  hideBuildable() {
    hideElement(this.buildImage);
  }
  setBuildingCount(building, biome) {
    this.buildingCount.textContent = biome
      .getBuildingCount(building)
      .toString();
  }
  showBuildingCount() {
    showElement(this.buildingCount);
  }
  hideBuildingCount() {
    hideElement(this.buildingCount);
  }
  showBiome() {
    showElement(this);
  }
  hideBiome() {
    hideElement(this);
  }
}
window.customElements.define(
  "township-build-biome-select",
  TownshipBuildBiomeSelectElement
);
class TownshipBuildingSortDropdownOptionElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("township-building-sort-dropdown-option-template")
    );
    this.checkbox = getElementFromFragment(this._content, "checkbox", "input");
    this.label = getElementFromFragment(this._content, "label", "label");
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  configure(labelText, callback, id) {
    this.checkbox.id = id;
    this.checkbox.setAttribute("name", id);
    this.label.setAttribute("for", id);
    this.label.textContent = labelText;
    this.checkbox.onclick = callback;
  }
  setChecked(isChecked) {
    this.checkbox.checked = isChecked;
  }
}
window.customElements.define(
  "township-building-sort-dropdown-option",
  TownshipBuildingSortDropdownOptionElement
);
class TownshipBuildingSortDropdownElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("township-building-sort-dropdown-template")
    );
    this.optionsContainer = getElementFromFragment(
      this._content,
      "options-container",
      "div"
    );
    this.optionsContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  populateOptions(callback) {
    this.addOption(
      getLangString("SHOP_CAT", "MISC"),
      "showAll",
      0,
      true,
      callback
    );
    this.optionsContainer.append(
      createElement("div", {
        className: "dropdown-divider",
        attributes: [["role", "separator"]],
      })
    );
    const buildingTypes = Object.keys(BuildingTypeID).filter((key) =>
      isNaN(Number(key))
    );
    buildingTypes.forEach((_, id) => {
      this.addOption(
        getLangString("TOWNSHIP", `BUILDING_TYPE_${id}`),
        "buildingType",
        id,
        false,
        callback
      );
    });
  }
  addOption(text, category, index, isChecked, callback) {
    const newOption = new TownshipBuildingSortDropdownOptionElement();
    const id = `building-sort-${category}-${index}`;
    newOption.configure(text, () => callback(category, index), id);
    newOption.setChecked(isChecked);
    this.optionsContainer.append(newOption);
  }
}
window.customElements.define(
  "township-building-sort-dropdown",
  TownshipBuildingSortDropdownElement
);
class TownshipBuildBuildingElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-build-building-template"));
    this.buildButton = getElementFromFragment(
      this._content,
      "build-button",
      "a"
    );
    this.buildingSummary = getElementFromFragment(
      this._content,
      "building-summary",
      "township-building-summary"
    );
    this.buildingCosts = getElementFromFragment(
      this._content,
      "building-costs",
      "ul"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setBuilding(building, township) {
    this.buildingSummary.setBuilding(building, township);
    this.buildingSummary.updateNameQuantity(building, township.buildQty);
    this.buildButton.onclick = () => township.buildBuilding(building);
    this.buildButton.onmouseover = () =>
      townshipUI.highlightBiomesWithBuilding(building);
    this.buildButton.onmouseleave = () =>
      townshipUI.unhighlightBiomesWithBuilding();
    this.updateBuildingCosts(building, township);
  }
  updateResourceOutput(building, township) {
    this.buildingSummary.updateResourceOutput(
      building,
      township,
      township.buildQty
    );
  }
  updateExtraRequirements(building, township) {
    this.buildingSummary.updateExtraRequirements(building, township);
  }
  updateBuildingCosts(building, township) {
    this.buildingCosts.innerHTML = townshipUI.getBuildingCostHTML(
      building,
      township.buildQty
    );
  }
  updateBuildingCount(building, township) {
    const count =
      township.townData.currentBuildBiome === undefined
        ? 0
        : township.townData.currentBuildBiome.getBuildingCount(building);
    this.buildingSummary.updateBuildingCount(count);
  }
  updateForBuildQtyChange(building, township) {
    this.buildingSummary.updateNameQuantity(building, township.buildQty);
    this.buildingSummary.updateForBuildQtyChange(building, township);
    this.updateBuildingCosts(building, township);
  }
  showFilterHighlightBorder() {
    this.buildButton.classList.add("ts-biome-build-filter-highlight");
  }
  hideFilterHighlightBorder() {
    this.buildButton.classList.remove("ts-biome-build-filter-highlight");
  }
}
window.customElements.define(
  "township-build-building",
  TownshipBuildBuildingElement
);
class TownshipYeetElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-yeet-template"));
    this.yeetButton = getElementFromFragment(this._content, "yeet-button", "a");
    this.resourceImage = getElementFromFragment(
      this._content,
      "resource-image",
      "img"
    );
    this.resourceAmount = getElementFromFragment(
      this._content,
      "resource-amount",
      "small"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setResource(resource, amount, township) {
    this.resourceImage.src = resource.media;
    this.resourceAmount.textContent = numberWithCommas(amount);
    this.yeetButton.onclick = () => township.processYeet(resource, amount);
  }
}
window.customElements.define("township-yeet", TownshipYeetElement);
class TownshipCapResourceElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-cap-resource-template"));
    this.resourceImage = getElementFromFragment(
      this._content,
      "resource-image",
      "img"
    );
    this.resourceName = getElementFromFragment(
      this._content,
      "resource-name",
      "span"
    );
    this.capQtyDropdown = getElementFromFragment(
      this._content,
      "cap-qty-dropdown",
      "button"
    );
    this.capQtyOptions = getElementFromFragment(
      this._content,
      "cap-qty-options",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setResource(resource, township) {
    this.resourceImage.src = resource.media;
    this.resourceName.innerText = resource.name;
    this.setCap(resource);
  }
  setCap(resource) {
    this.capQtyDropdown.innerText = `${resource.cap}%`;
  }
  initQtyDropdowns(resource, township) {
    TownshipUI.resourceCapOptions.forEach((value) => {
      const newOption = createElement("a", {
        className: "dropdown-item pointer-enabled",
        text: `${value}%`,
      });
      newOption.onclick = () => township.setResourceCap(resource, value);
      this.capQtyOptions.append(newOption);
    });
  }
}
window.customElements.define(
  "township-cap-resource",
  TownshipCapResourceElement
);
class TownshipConversionElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-conversion-template"));
    this.convertButton = getElementFromFragment(
      this._content,
      "convert-button",
      "a"
    );
    this.convertFromImage = getElementFromFragment(
      this._content,
      "convert-from-image",
      "img"
    );
    this.convertQuantity = getElementFromFragment(
      this._content,
      "convert-quantity",
      "span"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.tooltip = tippy(this.convertButton, {
      placement: "top",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }
  getTooltip(resource, item) {
    let text =
      game.township.convertType === 0
        ? `<small>${item.name} => ${resource.name}</small>`
        : `<small>${resource.name} => ${item.name}</small>`;
    text += `<br><small class="text-warning">In Bank:</small> <small>${numberWithCommas(
      game.bank.getQty(item)
    )}</small>`;
    if (game.stats.itemFindCount(item) < 10000) {
      text += `<br><small class="text-danger">${templateString(
        getLangString("TOWNSHIP_MENU", "TRADER_COUNT_REMAINING"),
        {
          value: `<span class="text-white">${numberWithCommas(
            10000 - game.stats.itemFindCount(item)
          )}</span>`,
        }
      )}</small>`;
    }
    return text;
  }
  createConvertToSwal(resource, item, township) {
    if (game.settings.enableQuickConvert) {
      township.updateConvertToQty(township.convertQtyPercent, resource, item);
      township.processConversionToTownship(item, resource);
      return;
    }
    const element = new TownshipConversionSwalTemplate();
    element.setConvertToImage(resource.media);
    element.setConvertFromImage(item.media);
    element.setConvertToRatioQuantity(1);
    element.setConvertFromRatioQuantity(
      township.getBaseConvertToTownshipRatio(resource, item)
    );
    element.setConvertButtons(resource, item, 0);
    const ratio = game.township.getConvertToTownshipRatio(resource, item);
    const bankQty = game.bank.getQty(item);
    element.setConvertFromQuantity(ratio, bankQty);
    element.setConvertToQuantity(township.convertQty);
    element.setConvertToQuantityInput(township.convertQty, resource, item);
    SwalLocale.fire({
      title: item.name,
      html: element,
      showCancelButton: true,
      confirmButtonText: getLangString("MENU_TEXT", "CONFIRM"),
    }).then((result) => {
      if (result.isConfirmed)
        township.processConversionToTownship(item, resource);
    });
  }
  createConvertFromSwal(resource, item, township) {
    if (game.stats.itemFindCount(item) < 10000) return;
    if (game.settings.enableQuickConvert) {
      township.updateConvertFromQty(township.convertQtyPercent, resource, item);
      township.processConversionFromTownship(item, resource);
      return;
    }
    const element = new TownshipConversionSwalTemplate();
    element.setConvertFromImage(resource.media);
    element.setConvertToImage(item.media);
    element.setConvertToRatioQuantity(1);
    element.setConvertFromRatioQuantity(
      township.getBaseConvertFromTownshipRatio(resource, item)
    );
    element.setConvertButtons(resource, item, 1);
    const ratio = game.township.getConvertToTownshipRatio(resource, item);
    const resourceQty = Math.floor(resource.amount);
    element.setConvertFromQuantity(ratio, resourceQty);
    element.setConvertToQuantity(township.convertQty);
    element.setConvertFromQuantityInput(township.convertQty, resource, item);
    element.setTraderStock(township);
    SwalLocale.fire({
      title: item.name,
      html: element,
      showCancelButton: true,
      confirmButtonText: getLangString("MENU_TEXT", "CONFIRM"),
    }).then((result) => {
      if (result.isConfirmed)
        township.processConversionFromTownship(item, resource);
    });
  }
  setItemToResource(resource, item, township) {
    if (this.tooltip !== undefined) {
      this.tooltip.props.onShow = (instance) => {
        instance.setContent(this.getTooltip(resource, item));
      };
    }
    this.convertButton.onclick = () => {
      township.convertType === 0
        ? this.createConvertToSwal(resource, item, township)
        : this.createConvertFromSwal(resource, item, township);
    };
    this.convertFromImage.src = item.media;
    this.convertQuantity.id = `btn-convert-qty-${resource.id}-${item.id}`;
    this.updateConvertToRatio(resource, item, township);
  }
  updateConvertRatio(resource, item, township) {
    township.convertType === 0
      ? this.updateConvertToRatio(resource, item, township)
      : this.updateConvertFromRatio(resource, item, township);
  }
  updateConvertToRatio(resource, item, township) {
    this.convertQuantity.classList.replace("bg-danger", "bg-secondary");
    const ratio = township.getBaseConvertToTownshipRatio(resource, item);
    this.convertQuantity.textContent = `${numberWithCommas(ratio)} => 1`;
  }
  updateConvertFromRatio(resource, item, township) {
    if (game.stats.itemFindCount(item) < 10000) {
      this.convertQuantity.innerHTML = `<i class="fa fa-lock text-white"></i>`;
      this.convertQuantity.classList.replace("bg-secondary", "bg-danger");
      return;
    }
    this.convertQuantity.classList.replace("bg-danger", "bg-secondary");
    const ratio = township.getBaseConvertFromTownshipRatio(resource, item);
    this.convertQuantity.textContent = `${numberWithCommas(ratio)} => 1`;
  }
}
window.customElements.define("township-conversion", TownshipConversionElement);
class TownshipConversionSwalTemplate extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-conversion-swal-template"));
    this.convertFromImage = getElementFromFragment(
      this._content,
      "convert-from-image",
      "img"
    );
    this.convertFromQuantity = getElementFromFragment(
      this._content,
      "convert-from-quantity",
      "small"
    );
    this.convertToImage = getElementFromFragment(
      this._content,
      "convert-to-image",
      "img"
    );
    this.convertToQuantity = getElementFromFragment(
      this._content,
      "convert-to-quantity",
      "small"
    );
    this.convertFromRatioImage = getElementFromFragment(
      this._content,
      "convert-from-image-ratio",
      "img"
    );
    this.convertFromRatioQuantity = getElementFromFragment(
      this._content,
      "convert-from-quantity-ratio",
      "small"
    );
    this.convertToRatioImage = getElementFromFragment(
      this._content,
      "convert-to-image-ratio",
      "img"
    );
    this.convertToRatioQuantity = getElementFromFragment(
      this._content,
      "convert-to-quantity-ratio",
      "small"
    );
    this.receiveImage = getElementFromFragment(
      this._content,
      "receive-image",
      "img"
    );
    this.receiveQuantity = getElementFromFragment(
      this._content,
      "receive-quantity",
      "small"
    );
    this.receiveGP = getElementFromFragment(
      this._content,
      "receive-gp",
      "small"
    );
    this.receiveGPContainer = getElementFromFragment(
      this._content,
      "receive-gp-container",
      "div"
    );
    this.btnGroupNumber = getElementFromFragment(
      this._content,
      "btn-group-number",
      "div"
    );
    this.btnGroupPercent = getElementFromFragment(
      this._content,
      "btn-group-percent",
      "div"
    );
    this.btnNumber = getElementFromFragment(
      this._content,
      "btn-number",
      "button"
    );
    this.btnPercent = getElementFromFragment(
      this._content,
      "btn-percent",
      "button"
    );
    this.inputQty = getElementFromFragment(
      this._content,
      "convert-quantity-input",
      "input"
    );
    this.traderStock = getElementFromFragment(
      this._content,
      "trader-stock",
      "h5"
    );
    this.traderIncrease = getElementFromFragment(
      this._content,
      "trader-increase",
      "h5"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.inputQty.classList.add("d-none");
  }
  setConvertToImage(media) {
    this.convertToImage.src = media;
    this.convertToRatioImage.src = media;
    this.receiveImage.src = media;
  }
  setConvertToQuantity(qty) {
    this.convertToQuantity.textContent = numberWithCommas(qty);
    this.receiveQuantity.textContent = numberWithCommas(qty);
  }
  setConvertFromImage(media) {
    this.convertFromImage.src = media;
    this.convertFromRatioImage.src = media;
  }
  setConvertFromQuantity(ratio, qty) {
    this.convertFromQuantity.textContent = `${numberWithCommas(
      ratio
    )} / ${numberWithCommas(qty)}`;
  }
  setConvertToRatioQuantity(qty) {
    this.convertToRatioQuantity.textContent = numberWithCommas(qty);
  }
  setConvertFromRatioQuantity(qty) {
    this.convertFromRatioQuantity.textContent = numberWithCommas(qty);
  }
  setConvertButtons(resource, item, type) {
    this.btnGroupNumber.innerHTML = "";
    this.btnGroupPercent.innerHTML = "";
    game.township.convertValues.percentages.forEach((value, id) => {
      const btn = this.btnPercent.cloneNode(true);
      btn.textContent = `${value}%`;
      btn.onclick = () => {
        game.township.convertQtyType = 1;
        game.township.convertQtyPercent = value;
        type === 0
          ? this.setConvertToQuantityInput(value, resource, item)
          : this.setConvertFromQuantityInput(value, resource, item);
        townshipUI.updateConvertTypeBtn();
      };
      if (
        game.township.convertQtyType === 1 &&
        game.township.convertQtyPercent === value
      )
        btn.classList.replace("btn-primary", "btn-success");
      btn.classList.add(`convert-resource-quick-qty-${value}`);
      this.btnGroupPercent.append(btn);
      if (id === Math.ceil(game.township.convertValues.percentages.length / 2))
        this.btnGroupPercent.append(createElement("br"));
    });
    const allButOne = this.btnPercent.cloneNode(true);
    allButOne.textContent = getLangString("BANK_STRING", "21");
    allButOne.onclick = () => {
      game.township.convertQtyType = 2;
      type === 0
        ? this.setConvertToQuantityInput(1, resource, item)
        : this.setConvertFromQuantityInput(1, resource, item);
      townshipUI.updateConvertTypeBtn();
    };
    if (game.township.convertQtyType === 2)
      allButOne.classList.replace("btn-primary", "btn-success");
    allButOne.classList.add("convert-resource-quick-qty-all-but-1");
    this.btnGroupPercent.append(allButOne);
  }
  setConvertToQuantityInput(value, resource, item) {
    game.township.updateConvertToQty(value, resource, item);
    this.updateInputValue();
    const ratio = game.township.getConvertToTownshipRatio(resource, item);
    const bankQty = game.bank.getQty(item);
    this.setConvertFromQuantity(ratio, bankQty);
    this.setConvertToQuantity(game.township.convertQty);
    this.receiveGPContainer.classList.remove("d-flex");
    hideElement(this.receiveGPContainer);
  }
  setConvertFromQuantityInput(value, resource, item) {
    game.township.updateConvertFromQty(value, resource, item);
    this.updateInputValue();
    const ratio = game.township.getConvertFromTownshipRatio(resource, item);
    const resourceQty = Math.floor(resource.amount);
    this.setConvertFromQuantity(ratio, resourceQty);
    this.setConvertToQuantity(game.township.convertQty);
    this.updateGPValue(item.sellsFor * game.township.convertQty);
    this.receiveGPContainer.classList.add("d-flex");
    showElement(this.receiveGPContainer);
  }
  updateInputValue() {
    this.inputQty.value = game.township.convertQty.toString();
  }
  updateGPValue(value) {
    this.receiveGP.textContent = numberWithCommas(value);
  }
  setTraderStock(township) {
    this.traderStock.innerHTML = templateString(
      getLangString("TOWNSHIP_MENU", "TRADER_STOCK_REMAINING"),
      {
        gpIcon: `<img class="skill-icon-xxs mr-1" src="${cdnMedia(
          "assets/media/main/coins.svg"
        )}">`,
        value: numberWithCommas(township.townData.traderStock),
      }
    );
    this.traderIncrease.textContent = templateString(
      getLangString("TOWNSHIP_MENU", "TRADER_STOCK_INCREASE"),
      { value: numberWithCommas(township.traderStockIncrease) }
    );
  }
}
window.customElements.define(
  "township-conversion-swal",
  TownshipConversionSwalTemplate
);
class TownshipWorshipSelectButtonElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("township-worship-select-button-template")
    );
    this.selectButton = getElementFromFragment(
      this._content,
      "select-button",
      "button"
    );
    this.worshipName = getElementFromFragment(
      this._content,
      "worship-name",
      "span"
    );
    this.worshipDescription = getElementFromFragment(
      this._content,
      "worship-description",
      "small"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setWorship(worship, township) {
    if (worship === township.townData.worship) {
      this.setSelected();
    } else {
      this.setUnselected();
    }
    this.selectButton.onclick = () => {
      township.selectWorship(worship);
      this.selectButton.blur();
    };
    this.worshipName.textContent = worship.name;
    this.worshipDescription.textContent = worship.description;
  }
  setSelected() {
    this.selectButton.classList.replace("btn-outline-dark", "btn-success");
  }
  setUnselected() {
    this.selectButton.classList.replace("btn-success", "btn-outline-dark");
  }
}
window.customElements.define(
  "township-worship-select-button",
  TownshipWorshipSelectButtonElement
);
class TownshipWorshipSelectElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-worship-select-template"));
    this.modifierDiv = getElementFromFragment(
      this._content,
      "modifier-div",
      "div"
    );
    this.modifierContainer = getElementFromFragment(
      this._content,
      "modifier-container",
      "small"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setWorship(worship, township) {
    if (Object.keys(worship.modifiers).length === 0)
      this.modifierContainer.append(
        getLangString("TOWNSHIP_MENU", "NO_MODIFIERS")
      );
    else {
      const spans = getSpansFromModifierObject(worship.modifiers);
      spans.forEach((span) => {
        this.modifierContainer.append(span, createElement("br"));
      });
    }
    if (worship === township.noWorship) return;
    township.WORSHIP_CHECKPOINTS.forEach((checkpoint, id) => {
      this.modifierDiv.append(
        createElement("div", {
          className: "dropdown-divider",
          attributes: [["role", "separator"]],
        })
      );
      const modContainer = this.modifierDiv
        .appendChild(createElement("div"))
        .appendChild(createElement("small"));
      modContainer.append(
        createElement("span", {
          classList: ["font-w600"],
          text: `At ${checkpoint}% Worship:`,
        }),
        createElement("br")
      );
      const spans = getSpansFromModifierObject(worship.checkpoints[id]);
      spans.forEach((span) => {
        modContainer.append(span, createElement("br"));
      });
    });
  }
}
window.customElements.define(
  "township-worship-select",
  TownshipWorshipSelectElement
);
class TownshipConversionJumpToElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(
      getTemplateNode("township-conversion-jump-to-template")
    );
    this.resourceIcon = getElementFromFragment(
      this._content,
      "resource-icon",
      "img"
    );
    this.resourceList = getElementFromFragment(
      this._content,
      "resource-list",
      "li"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setIcon(resource) {
    this.resourceIcon.src = resource.media;
  }
}
window.customElements.define(
  "township-conversion-jump-to",
  TownshipConversionJumpToElement
);
class TownshipTownBreakdownElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-town-breakdown-template"));
    this.breakdownTitle = getElementFromFragment(
      this._content,
      "breakdown-title",
      "span"
    );
    this.value = getElementFromFragment(
      this._content,
      "breakdown-value",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setItem(title, value) {
    this.breakdownTitle.textContent = title;
    this.value.textContent = value;
  }
  addValueClass(valueClass) {
    this.value.classList.add(valueClass);
  }
  removeValueClass(valueClass) {
    this.value.classList.add(valueClass);
  }
}
window.customElements.define(
  "township-town-breakdown",
  TownshipTownBreakdownElement
);
class TownshipBuildBiomeFilterIconElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("township-biome-filter-template"));
    this.icon = getElementFromFragment(this._content, "icon", "i");
    this.media = getElementFromFragment(this._content, "media", "img");
    this.filterList = getElementFromFragment(
      this._content,
      "filter-list",
      "li"
    );
    this.filterLink = getElementFromFragment(this._content, "filter-link", "a");
    this.tooltipContent = "";
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.setTooltip();
  }
  setIcon(className) {
    this.icon.className = className + " skill-icon-xxs";
    this.media.classList.add("d-none");
  }
  setIconColor(color) {
    this.icon.style.color = color;
  }
  setMedia(resource) {
    this.media.src = resource.media;
    this.icon.classList.add("d-none");
  }
  setTooltip() {
    this.tooltip = tippy(this.filterLink, {
      placement: "top",
      interactive: false,
      animation: false,
      content: this.tooltipContent,
    });
  }
  setTooltipContent(content) {
    this.tooltipContent = content;
  }
}
window.customElements.define(
  "township-biome-filter",
  TownshipBuildBiomeFilterIconElement
);
