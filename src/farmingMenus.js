"use strict";
class FarmingCategoryButtonElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("farming-category-button-template"));
    this.link = getElementFromFragment(this._content, "link", "a");
    this.categoryImage = getElementFromFragment(
      this._content,
      "category-image",
      "img"
    );
    this.categoryName = getElementFromFragment(
      this._content,
      "category-name",
      "div"
    );
    this.categoryDescription = getElementFromFragment(
      this._content,
      "category-description",
      "div"
    );
    this.harvestReadyNotice = getElementFromFragment(
      this._content,
      "harvest-ready-notice",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setCategory(category, farming) {
    this.link.onclick = () => farming.showPlotsInCategory(category);
    this.categoryImage.src = category.media;
    this.categoryName.textContent = category.name;
    this.categoryDescription.textContent = category.description;
  }
  updateNotice(show) {
    if (show) showElement(this.harvestReadyNotice);
    else hideElement(this.harvestReadyNotice);
  }
}
window.customElements.define(
  "farming-category-button",
  FarmingCategoryButtonElement
);
class FarmingCategoryOptionsElement extends HTMLElement {
  constructor() {
    super();
    this.compostAllButtons = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("farming-category-options-template"));
    this.harvestAllButton = getElementFromFragment(
      this._content,
      "harvest-all-button",
      "button"
    );
    this.plantAllButton = getElementFromFragment(
      this._content,
      "plant-all-button",
      "button"
    );
    this.plantAllSelectedButton = getElementFromFragment(
      this._content,
      "plant-all-selected-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setCategory(category, game) {
    const farming = game.farming;
    const gpIcon = `<img class="skill-icon-xxs" src="${cdnMedia(
      "assets/media/main/coins.svg"
    )}">`;
    this.harvestAllButton.innerHTML = templateLangString(
      "MENU_TEXT",
      "HARVEST_ALL",
      { gpIcon, gpCost: numberWithCommas(farming.getHarvestAllCost(category)) }
    );
    this.compostAllButtons.forEach((button) => button.remove());
    this.compostAllButtons = [];
    game.items.composts.forEach((compost) => {
      const compostAllButton = createElement("button", {
        className: `btn btn-sm ${compost.buttonStyle} m-1`,
      });
      compostAllButton.onclick = () =>
        farming.compostAllOnClick(category, compost);
      switch (compost.id) {
        case "melvorD:Compost":
          compostAllButton.innerHTML = templateLangString(
            "MENU_TEXT",
            "COMPOST_ALL",
            {
              gpIcon,
              gpCost: numberWithCommas(farming.getCompostAllCost(category)),
            }
          );
          break;
        case "melvorD:Weird_Gloop":
          compostAllButton.innerHTML = templateLangString(
            "MENU_TEXT",
            "GLOOP_ALL",
            {
              gpIcon,
              gpCost: numberWithCommas(farming.getCompostAllCost(category)),
            }
          );
          break;
        default:
          compostAllButton.innerHTML = templateLangString(
            "FARMING_MISC",
            "APPLY_ITEM_ALL",
            {
              itemName: compost.name,
              gpIcon,
              gpCost: numberWithCommas(farming.getCompostAllCost(category)),
            }
          );
      }
      this.plantAllButton.before(compostAllButton);
      this.compostAllButtons.push(compostAllButton);
    });
    this.plantAllButton.innerHTML = templateLangString(
      "MENU_TEXT",
      "PLANT_ALL",
      { gpIcon, gpCost: numberWithCommas(farming.getPlantAllCost(category)) }
    );
    this.plantAllSelectedButton.innerHTML = templateLangString(
      "FARMING_MISC",
      "28",
      {
        gpValue: `${gpIcon} ${numberWithCommas(
          farming.getPlantAllCost(category)
        )}`,
      }
    );
    this.harvestAllButton.onclick = () => farming.harvestAllOnClick(category);
    this.plantAllButton.onclick = () => farming.plantAllOnClick(category);
    this.plantAllSelectedButton.onclick = () =>
      farming.plantAllSelectedOnClick(category);
  }
}
window.customElements.define(
  "farming-category-options",
  FarmingCategoryOptionsElement
);
class FarmingPlotElement extends HTMLElement {
  constructor() {
    super();
    this.seedQuantities = new Map();
    this.compostButtons = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("farming-plot-template"));
    this.categoryName = getElementFromFragment(
      this._content,
      "category-name",
      "h3"
    );
    this.selectSeedDropdownButton = getElementFromFragment(
      this._content,
      "select-seed-dropdown-button",
      "button"
    );
    this.selectSeedDropdownImage = getElementFromFragment(
      this._content,
      "select-seed-dropdown-image",
      "img"
    );
    this.selectSeedDropdownOptions = getElementFromFragment(
      this._content,
      "select-seed-dropdown-options",
      "div"
    );
    this.plantSeedButton = getElementFromFragment(
      this._content,
      "plant-seed-button",
      "button"
    );
    this.seedImage = getElementFromFragment(this._content, "seed-image", "img");
    this.growthStatus = getElementFromFragment(
      this._content,
      "growth-status",
      "small"
    );
    this.compostProgress = getElementFromFragment(
      this._content,
      "compost-progress",
      "div"
    );
    this.destroyButton = getElementFromFragment(
      this._content,
      "destroy-button",
      "button"
    );
    this.harvestButton = getElementFromFragment(
      this._content,
      "harvest-button",
      "button"
    );
    this.compostButtonContainer = getElementFromFragment(
      this._content,
      "compost-buttons",
      "div"
    );
    this.growthChance = getElementFromFragment(
      this._content,
      "growth-chance",
      "h5"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  disconnectedCallback() {
    this.destroyTooltips();
  }
  destroyTooltips() {
    var _a;
    (_a = this.compostTooltips) === null || _a === void 0
      ? void 0
      : _a.forEach((tooltip) => {
          tooltip.destroy();
        });
    this.compostTooltips = undefined;
  }
  setPlot(plot, game) {
    const farming = game.farming;
    this.categoryName.textContent = plot.category.singularName;
    const recipes = farming.getRecipesForCategory(plot.category);
    this.selectSeedDropdownOptions.textContent = "";
    this.seedQuantities.clear();
    recipes.forEach((recipe) => {
      const link = createElement("a", {
        className: "dropdown-item pointer-enabled",
      });
      const image = createElement("img", {
        className: "skill-icon-xs mr-1",
        attributes: [["src", recipe.seedCost.item.media]],
      });
      const seedQuantity = createElement("span", { text: "0" });
      link.append(image, `${recipe.name} (`, seedQuantity, ")");
      link.onclick = () => farming.setPlantAllSelected(plot, recipe);
      this.seedQuantities.set(recipe, seedQuantity);
      this.selectSeedDropdownOptions.append(link);
    });
    this.selectSeedDropdownButton.onclick = () =>
      this.updateSeedQuantities(farming);
    this.plantSeedButton.onclick = () => farming.plantPlotOnClick(plot);
    this.destroyButton.onclick = () => farming.destroyPlotOnClick(plot);
    this.harvestButton.onclick = () => farming.harvestPlotOnClick(plot);
    this.destroyTooltips();
    this.compostButtonContainer.textContent = "";
    const tooltips = [];
    const compostNodes = [];
    game.items.composts.forEach((compost) => {
      const image = createElement("img", {
        className: "skill-icon-xs",
        attributes: [["src", compost.media]],
      });
      tooltips.push(
        tippy(image, {
          content: compost.name,
          placement: "bottom",
          interactive: false,
          animation: false,
        })
      );
      const maxCompost = Math.ceil(100 / compost.compostValue);
      const compost1Button = createElement("button", {
        className: `btn btn-sm ${compost.buttonStyle} m-1`,
        text: "+1",
      });
      compost1Button.onclick = () => farming.compostPlot(plot, compost, 1);
      const nodes = [image, compost1Button];
      if (maxCompost > 1) {
        const compostMaxButton = createElement("button", {
          className: `btn btn-sm ${compost.buttonStyle} m-1`,
          text: `+${maxCompost}`,
        });
        compostMaxButton.onclick = () =>
          farming.compostPlot(plot, compost, maxCompost);
        nodes.push(compostMaxButton);
      }
      compostNodes.push(nodes);
    });
    compostNodes.forEach((nodes, i) => {
      this.compostButtonContainer.append(...nodes);
      if (i !== compostNodes.length - 1)
        this.compostButtonContainer.append(
          ` ${getLangString("MENU_TEXT", "OR")} `
        );
    });
    this.compostTooltips = tooltips;
    this.updateCompost(plot, farming);
    this.updatePlotState(plot);
    this.updateGrowthTime(plot, farming);
    this.updateSelectedSeed(plot);
  }
  updateCompost(plot, farming) {
    this.growthChance.textContent = templateLangString(
      "MENU_TEXT",
      "CHANCE_TO_GROW",
      { chance: `${Math.floor(farming.getPlotGrowthChance(plot))}` }
    );
    if (plot.compostItem !== undefined) {
      this.compostProgress.style.width = `${plot.compostLevel}%`;
      this.compostProgress.className = `progress-bar ${plot.compostItem.barStyle}`;
    } else {
      this.compostProgress.style.width = `0%`;
    }
  }
  updateGrowthTime(plot, farming) {
    if (plot.plantedRecipe === undefined || plot.state !== 2) return;
    const minutesLeft = Math.ceil(farming.getPlotGrowthTime(plot) / 1000 / 60);
    const timeLeft =
      setLang === "en" && minutesLeft === 69
        ? `${minutesLeft} (lol)`
        : `${minutesLeft}`;
    this.growthStatus.innerHTML = `${templateLangString(
      "MENU_TEXT",
      "GROWING",
      { itemName: plot.plantedRecipe.seedCost.item.name }
    )}<br>${templateLangString("MENU_TEXT", "TIME_LEFT", { timeLeft })}`;
  }
  updatePlotState(plot) {
    if (plot.plantedRecipe !== undefined) {
      switch (plot.state) {
        case 2:
          this.seedImage.src = plot.plantedRecipe.seedCost.item.media;
          showElement(this.destroyButton);
          hideElement(this.harvestButton);
          break;
        case 3:
          this.seedImage.src = plot.plantedRecipe.media;
          this.harvestButton.textContent = getLangString(
            "MENU_TEXT",
            "HARVEST"
          );
          this.harvestButton.classList.replace("btn-warning", "btn-success");
          this.growthStatus.textContent = plot.plantedRecipe.name;
          hideElement(this.destroyButton);
          showElement(this.harvestButton);
          break;
        case 4:
          this.seedImage.src = cdnMedia(TODO_REPLACE_MEDIA);
          this.harvestButton.textContent = getLangString(
            "FARMING_MISC",
            "CLEAR_DEAD_CROP"
          );
          this.harvestButton.classList.replace("btn-success", "btn-warning");
          this.growthStatus.textContent = getLangString(
            "FARMING_MISC",
            "CROP_DIED"
          );
          hideElement(this.destroyButton);
          showElement(this.harvestButton);
          break;
      }
      hideElement(this.plantSeedButton);
      showElement(this.growthStatus);
      showElement(this.seedImage);
      hideElement(this.compostButtonContainer);
    } else {
      hideElement(this.destroyButton);
      hideElement(this.harvestButton);
      showElement(this.plantSeedButton);
      hideElement(this.growthStatus);
      hideElement(this.seedImage);
      showElement(this.compostButtonContainer);
    }
  }
  updateSelectedSeed(plot) {
    var _a, _b;
    this.selectSeedDropdownImage.src =
      (_b =
        (_a = plot.selectedRecipe) === null || _a === void 0
          ? void 0
          : _a.seedCost.item.media) !== null && _b !== void 0
        ? _b
        : cdnMedia("assets/media/main/question.svg");
  }
  updateSeedQuantities(farming) {
    this.seedQuantities.forEach((quantity, recipe) => {
      quantity.textContent = formatNumber(farming.getOwnedRecipeSeeds(recipe));
    });
  }
}
window.customElements.define("farming-plot", FarmingPlotElement);
class LockedFarmingPlotElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("locked-farming-plot-template"));
    this.farmingLevelRequired = getElementFromFragment(
      this._content,
      "farming-level-required",
      "span"
    );
    this.gpCost = getElementFromFragment(this._content, "gp-cost", "span");
    this.unlockButton = getElementFromFragment(
      this._content,
      "unlock-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setPlot(plot, farming) {
    this.farmingLevelRequired.textContent = templateLangString(
      "MENU_TEXT",
      "LEVEL",
      { level: `${plot.level}` }
    );
    this.gpCost.textContent = formatNumber(plot.gpCost);
    this.unlockButton.onclick = () => farming.unlockPlotOnClick(plot);
  }
}
window.customElements.define("locked-farming-plot", LockedFarmingPlotElement);
class FarmingSeedSelectElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("farming-seed-select-template"));
    this.seedNotice = getElementFromFragment(
      this._content,
      "seed-notice",
      "small"
    );
    this.seedButtonContainer = getElementFromFragment(
      this._content,
      "seed-button-container",
      "div"
    );
    this.recipeOwnedQuantity = getElementFromFragment(
      this._content,
      "recipe-owned-quantity",
      "span"
    );
    this.recipeProductQuantity = getElementFromFragment(
      this._content,
      "recipe-product-quantity",
      "span"
    );
    this.recipeMastery = getElementFromFragment(
      this._content,
      "recipe-mastery",
      "mastery-display"
    );
    this.recipeCategory = getElementFromFragment(
      this._content,
      "recipe-category",
      "span"
    );
    this.recipeLevel = getElementFromFragment(
      this._content,
      "recipe-level",
      "span"
    );
    this.recipeQuantity = getElementFromFragment(
      this._content,
      "recipe-quantity",
      "span"
    );
    this.recipeInterval = getElementFromFragment(
      this._content,
      "recipe-interval",
      "span"
    );
    this.plantButton = getElementFromFragment(
      this._content,
      "plant-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setSeedSelection(category, game, plot) {
    const recipes = game.farming.getRecipesForCategory(category);
    this.seedNotice.textContent = category.seedNotice;
    this.seedButtonContainer.textContent = "";
    recipes.forEach((recipe) => {
      if (
        game.bank.getQty(recipe.seedCost.item) >=
          game.farming.getRecipeSeedCost(recipe) &&
        game.farming.level >= recipe.level
      ) {
        const selectButton = createElement("button", {
          className: "btn btn-outline-primary",
          attributes: [["type", "button"]],
        });
        selectButton.append(
          createElement("img", {
            className: "skill-icon-xs mr-2",
            attributes: [["src", recipe.seedCost.item.media]],
          }),
          recipe.seedCost.item.name
        );
        selectButton.onclick = () => this.setSelectedRecipe(recipe, game, plot);
        this.seedButtonContainer.append(selectButton);
      }
    });
  }
  setSelectedRecipe(recipe, game, plot) {
    this.recipeOwnedQuantity.textContent = numberWithCommas(
      game.bank.getQty(recipe.seedCost.item)
    );
    this.recipeProductQuantity.textContent = templateLangString(
      "FARMING_MISC",
      "17",
      {
        qty: numberWithCommas(game.bank.getQty(recipe.product)),
        farmItem: recipe.product.name,
      }
    );
    showElement(this.recipeMastery);
    this.recipeMastery.setMastery(game.farming, recipe);
    game.farming.renderQueue.actionMastery.add(recipe);
    this.recipeCategory.textContent = recipe.category.singularName;
    this.recipeLevel.textContent = `${recipe.level}`;
    this.recipeQuantity.textContent = `${game.farming.getRecipeSeedCost(
      recipe
    )}`;
    this.recipeInterval.textContent = formatAsTimePeriod(
      game.farming.getRecipeInterval(recipe)
    );
    showElement(this.plantButton);
    if (plot === undefined) {
      this.plantButton.onclick = () => game.farming.plantAllRecipe(recipe);
    } else {
      this.plantButton.onclick = () => game.farming.plantRecipe(recipe, plot);
    }
  }
  setUnselectedRecipe() {
    this.recipeOwnedQuantity.textContent = "";
    this.recipeProductQuantity.textContent = "";
    hideElement(this.recipeMastery);
    this.recipeCategory.textContent = "";
    this.recipeLevel.textContent = "";
    this.recipeQuantity.textContent = "";
    this.recipeInterval.textContent = "";
    hideElement(this.plantButton);
  }
}
