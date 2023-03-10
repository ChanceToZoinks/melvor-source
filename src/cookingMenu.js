"use strict";
class CookingMenu extends ContainedComponent {
  constructor(category, parentID) {
    super();
    this.category = category;
    this.productQty = 0;
    const parent = document.getElementById(parentID);
    if (parent === null)
      throw new Error(`Could not find parent element with id: ${parentID}`);
    const centerFlex = ["media", "d-flex", "align-items-center", "push"];
    this.container = createElement("div", {
      classList: ["col-12", "col-lg-4"],
    });
    this.contentRow = this.container
      .appendChild(
        createElement("div", {
          classList: [
            "block",
            "block-rounded",
            "border-top",
            "border-cooking",
            "border-4x",
          ],
        })
      )
      .appendChild(
        createElement("div", {
          classList: ["block-content", "block-content-full"],
        })
      )
      .appendChild(
        createElement("div", { classList: ["font-size-sm", "font-w400"] })
      )
      .appendChild(
        createElement("div", { classList: ["row", "gutters-tiny"] })
      );
    const topLeftBox = this.contentRow
      .appendChild(createElement("div", { classList: ["col-6", "text-left"] }))
      .appendChild(createElement("div", { classList: centerFlex }));
    this.upgradeImage = topLeftBox
      .appendChild(createElement("div", { classList: ["mr-2"] }))
      .appendChild(createElement("img", { classList: ["resize-48", "m-0"] }));
    this.upgradeName = topLeftBox
      .appendChild(
        createElement("div", { classList: ["media-body", "text-left"] })
      )
      .appendChild(createElement("h5", { classList: ["font-w700", "mb-0"] }));
    this.selectRecipeButton = this.contentRow
      .appendChild(createElement("div", { classList: ["col-6", "text-right"] }))
      .appendChild(
        createElement("button", {
          classList: ["btn", "btn-sm", "btn-primary"],
          attributes: [["type", "button"]],
          text: getLangString("MENU_TEXT", "SELECT_COOKING_RECIPE"),
        })
      );
    this.selectRecipeButton.onclick = () =>
      game.cooking.onRecipeSelectionOpenClick(category);
    this.selectedRecipeCont = this.contentRow.appendChild(
      createElement("div", { classList: ["col-12", "mt-2"] })
    );
    const selectedSubCont = this.selectedRecipeCont.appendChild(
      createElement("div", {
        classList: [
          "block",
          "block-rounded-double",
          "bg-combat-inner-dark",
          "p-3",
        ],
      })
    );
    const selectedTopCont = selectedSubCont
      .appendChild(createElement("div", { classList: [...centerFlex, "mb-0"] }))
      .appendChild(createElement("div", { classList: ["col-12"] }));
    const productCont = selectedTopCont.appendChild(
      createElement("div", { classList: [...centerFlex, "m-0"] })
    );
    const productImageCont = productCont.appendChild(
      createElement("div", { classList: ["m-1", "font-w600"] })
    );
    this.productImage = createElement("img", {
      classList: ["resize-40", "mr-1"],
    });
    this.productCount = createElement("small", {
      classList: ["font-w600", "badge-pill", "bg-secondary", "m-1"],
      attributes: [["style", "position: absolute;"]],
      text: "0",
    });
    this.productCount.onmouseover = () => {
      this.productCount.textContent = numberWithCommas(this.productQty);
    };
    this.productCount.onmouseout = () => {
      this.productCount.textContent = formatNumber(this.productQty);
    };
    this.productTooltip = tippy(productImageCont, {
      placement: "top",
      interactive: false,
      animation: false,
      allowHTML: true,
    });
    productImageCont.append(
      this.productImage,
      createElement("br"),
      this.productCount
    );
    const nameCont = productCont.appendChild(
      createElement("div", { classList: ["media-body"] })
    );
    this.productName = createElement("h5", {
      classList: ["font-w700", "mb-1", "text-center"],
    });
    const healingCont = createElement("div", {
      classList: ["font-w400", "font-size-sm", "text-center"],
    });
    this.productHealing = createElement("span", {
      classList: ["text-success", "mr-2"],
    });
    this.productHP = createElement("span", {
      text: getLangString("MENU_TEXT", "HP"),
    });
    healingCont.append(
      createElement("img", {
        classList: ["skill-icon-xxs", "mr-1"],
        attributes: [["src", game.hitpoints.media]],
      }),
      this.productHealing,
      this.productHP
    );
    nameCont.append(this.productName, healingCont);
    this.requires = new RequiresBox(
      selectedTopCont,
      true,
      ["mb-3"],
      ["gutters-tiny"]
    );
    this.grants = new GrantsBox(selectedTopCont, true, ["mb-3"], 32, [
      "gutters-tiny",
    ]);
    this.mastery = selectedSubCont.appendChild(new MasteryDisplay());
    this.mastery.classList.add("mastery-6");
    this.haves = new HavesBox(this.contentRow, false, ["col-12", "p-1"]);
    this.bonuses = new CookingBonusBox(this.contentRow, false, [
      "col-12",
      "p-1",
    ]);
    const buttonCont = this.contentRow
      .appendChild(
        createElement("div", { classList: ["col-12", "mt-2", "text-center"] })
      )
      .appendChild(
        createElement("div", {
          classList: ["btn-group", "w-100", "p-1"],
          attributes: [
            ["role", "group"],
            ["aria-label", "HorizontalPrimary"],
          ],
        })
      );
    this.activeCookButton = buttonCont.appendChild(
      createElement("button", {
        classList: ["btn", "btn-success"],
        text: getLangString("MENU_TEXT", "ACTIVE_COOK"),
      })
    );
    this.passiveCookButton = buttonCont.appendChild(
      createElement("button", {
        classList: ["btn", "btn-primary"],
        text: getLangString("MENU_TEXT", "PASSIVE_COOK"),
      })
    );
    this.activeCookInterval = this.activeCookButton
      .appendChild(
        createElement("div", {
          classList: ["font-size-sm", "text-white", "text-center"],
          attributes: [
            [
              "style",
              "position: absolute;z-index: 99;width: 100%;bottom: -10px;left: 0;",
            ],
          ],
        })
      )
      .appendChild(
        createElement("small", {
          classList: ["badge-pill", "bg-secondary"],
          text: "-",
        })
      );
    this.passiveCookInterval = this.passiveCookButton
      .appendChild(
        createElement("div", {
          classList: ["font-size-sm", "text-white", "text-center"],
          attributes: [
            [
              "style",
              "position: absolute;z-index: 99;width: 100%;bottom: -10px;left: 0;",
            ],
          ],
        })
      )
      .appendChild(
        createElement("small", {
          classList: ["badge-pill", "bg-secondary"],
          text: "-",
        })
      );
    this.activeCookButton.onclick = () => this.activeCookCallback();
    this.passiveCookButton.onclick = () => this.passiveCookCallback();
    const progressDiv = this.contentRow
      .appendChild(createElement("div", { classList: ["col-12"] }))
      .appendChild(
        createElement("div", {
          classList: ["progress", "active"],
          attributes: [["style", "height: 20px;margin:5px;"]],
        })
      )
      .appendChild(
        createElement("div", {
          classList: ["progress-bar", "bg-success"],
          attributes: progressBarAttributes,
        })
      );
    this.progressBar = new ProgressBar(progressDiv, "bg-success");
    const stockPileCont = this.contentRow
      .appendChild(
        createElement("div", { classList: ["col-12", "p-1", "text-center"] })
      )
      .appendChild(createElement("div", { classList: centerFlex }));
    const stockIconCont = stockPileCont.appendChild(
      createElement("div", { classList: ["mr-0"] })
    );
    this.stockPileIcon = new CookingStockpileIcon(stockIconCont, category);
    this.stockPileButton = stockPileCont
      .appendChild(
        createElement("div", { classList: ["media-body", "text-left"] })
      )
      .appendChild(
        createElement("button", {
          classList: ["btn", "btn-sm", "btn-primary", "mr-1", "mb-1", "mt-1"],
          attributes: [["style", "margin-left:-5px;"]],
          text: getLangString("MENU_TEXT", "COLLECT_FROM_STOCKPILE"),
        })
      );
    this.stockPileButton.onclick = () => this.stockPileCallback();
    parent.append(this.container);
  }
  activeCookCallback() {
    game.cooking.onActiveCookButtonClick(this.category);
    this.activeCookButton.blur();
  }
  passiveCookCallback() {
    game.cooking.onPassiveCookButtonClick(this.category);
    this.passiveCookButton.blur();
  }
  stockPileCallback() {
    game.cooking.onCollectStockpileClick(this.category);
    this.stockPileButton.blur();
  }
  localize() {
    this.requires.localize();
    this.grants.localize();
    this.haves.localize();
    this.bonuses.localize();
    this.productHP.textContent = getLangString("MENU_TEXT", "HP");
    this.selectRecipeButton.textContent = getLangString(
      "MENU_TEXT",
      "SELECT_COOKING_RECIPE"
    );
    this.activeCookButton.firstChild.textContent = getLangString(
      "MENU_TEXT",
      "ACTIVE_COOK"
    );
    this.passiveCookButton.firstChild.textContent = getLangString(
      "MENU_TEXT",
      "PASSIVE_COOK"
    );
    this.stockPileButton.textContent = getLangString(
      "MENU_TEXT",
      "COLLECT_FROM_STOCKPILE"
    );
    this.stockPileIcon.localize();
  }
  setStockPile(item) {
    if (item === undefined) {
      this.stockPileIcon.unsetItem();
    } else {
      this.stockPileIcon.setItem(item.item, item.quantity);
    }
  }
  updateUpgrade() {
    this.upgradeImage.src = this.category.media;
    this.upgradeName.textContent = this.category.name;
    this.setRecipeSelectButtonDisabled(
      this.category.upgradeRequired && !this.category.upgradeOwned
    );
  }
  setRecipeSelectButtonDisabled(disable) {
    this.selectRecipeButton.disabled = disable;
  }
  setSelected() {
    this.haves.setSelected();
    this.requires.setSelected();
    this.grants.setSelected();
    this.bonuses.setSelected();
    showElement(this.selectedRecipeCont);
  }
  getOwnedTooltipContent(normalQty, percectQty) {
    return `<h5 class="text-warning text-center font-w600 mb-1">${getLangString(
      "MENU_TEXT",
      "IN_BANK"
    )}</h5>
    <h5 class="text-white text-center font-w400 mb-1 font-size-sm">${templateLangString(
      "MENU_TEXT",
      "NORMAL",
      { quantity: successSpan(numberWithCommas(normalQty)) }
    )}</h5>
    <h5 class="text-white text-center font-w400 mb-1 font-size-sm">${templateLangString(
      "MENU_TEXT",
      "PERFECT",
      { quantity: successSpan(numberWithCommas(percectQty)) }
    )}</h5>`;
  }
  setSelectedRecipe(recipe, cooking) {
    if (recipe !== undefined) {
      this.setSelected();
      this.productImage.src = recipe.product.media;
      this.productName.textContent = `${recipe.baseQuantity} x ${recipe.product.name}`;
      this.requires.setItemsFromRecipe(recipe, !recipe.hasMastery);
      this.haves.setItemsFromRecipe(recipe, !recipe.hasMastery);
      if (recipe.hasMastery) {
        this.mastery.classList.remove("invisible");
        this.mastery.setMastery(cooking, recipe);
        cooking.updateMasteryDisplays(recipe);
      } else {
        this.mastery.classList.add("invisible");
        this.grants.hideMastery();
      }
    } else {
      hideElement(this.selectedRecipeCont);
    }
  }
  setRecipeRates(recipe, cooking) {
    const timePerActionModifier =
      game.cooking.getRecipeMasteryModifiedInterval(recipe);
    const masteryXPToAdd = cooking.getMasteryXPToAddForAction(
      recipe,
      timePerActionModifier
    );
    this.grants.updateGrants(
      cooking.modifyXP(recipe.baseExperience, recipe),
      masteryXPToAdd,
      cooking.getMasteryXPToAddToPool(masteryXPToAdd)
    );
    const interval = game.cooking.getRecipeCookingInterval(recipe) / 1000;
    const passiveInterval =
      game.cooking.getRecipePassiveCookingInterval(recipe) / 1000;
    this.activeCookInterval.textContent = templateLangString(
      "MENU_TEXT",
      "SECONDS_SHORT",
      { seconds: formatFixed(interval, 2) }
    );
    this.passiveCookInterval.textContent = templateLangString(
      "MENU_TEXT",
      "SECONDS_SHORT",
      { seconds: formatFixed(passiveInterval, 2) }
    );
    const item = recipe.product;
    if (item instanceof FoodItem)
      this.productHealing.textContent = `+${game.combat.player.getFoodHealing(
        item
      )}`;
  }
  setBonusValues(preservation, doubling, perfectCook, success) {
    this.bonuses.setChances(preservation, doubling, perfectCook, success);
  }
  updateQuantities(recipe) {
    this.haves.updateQuantities();
    const normalQty = game.bank.getQty(recipe.product);
    const perfectQty = game.bank.getQty(recipe.perfectItem);
    this.productQty = normalQty + perfectQty;
    this.productCount.textContent = formatNumber(this.productQty);
    this.productTooltip.setContent(
      this.getOwnedTooltipContent(normalQty, perfectQty)
    );
  }
  setProgressPassive() {
    this.progressBar.setStyle("bg-primary");
    this.progressBar.animateStriped();
  }
  renderActiveProgress(timer) {
    this.progressBar.setStyle("bg-success");
    this.progressBar.animateProgressFromTimer(timer);
  }
  stopProgressBar() {
    this.progressBar.stopAnimation();
  }
}
class CookingRecipeSelection extends HTMLElement {
  constructor() {
    super();
    this.quantityIcons = [];
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("cooking-recipe-selection-template"));
    this.productImage = getElementFromFragment(
      this._content,
      "product-image",
      "img"
    );
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
    this.productName = getElementFromFragment(
      this._content,
      "product-name",
      "span"
    );
    this.selectButton = getElementFromFragment(
      this._content,
      "select-button",
      "button"
    );
    this.iconContainer = getElementFromFragment(
      this._content,
      "icon-container",
      "div"
    );
    this.cookingXP = getElementFromFragment(
      this._content,
      "cooking-xp",
      "span"
    );
    this.healingAmount = getElementFromFragment(
      this._content,
      "healing-amount",
      "span"
    );
    this.intervalIcon = new IntervalIcon(this.iconContainer, 69);
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  disconnectedCallback() {
    this.intervalIcon.destroy();
    this.quantityIcons.forEach((icon) => icon.destroy());
    this.quantityIcons = [];
  }
  setRecipe(recipe, cooking) {
    this.productImage.src = recipe.product.media;
    this.productName.textContent = `${recipe.baseQuantity} x ${recipe.product.name}`;
    recipe.itemCosts.forEach((cost) => {
      const qtyIcon = new ItemQtyIcon(
        this.iconContainer,
        true,
        cost.quantity,
        48
      );
      qtyIcon.setItem(cost.item, cost.quantity, !recipe.hasMastery);
      this.quantityIcons.push(qtyIcon);
    });
    this.selectButton.onclick = () => {
      game.cooking.onRecipeSelectionClick(recipe);
      this.selectButton.blur();
    };
    this.intervalIcon.setMedia(!recipe.hasMastery);
    this.updateRates(recipe);
    this.updateMastery(recipe, cooking);
    this.updateQuantities(recipe);
  }
  updateRates(recipe) {
    const item = recipe.product;
    this.cookingXP.textContent = `${numberWithCommas(
      Math.floor(game.cooking.modifyXP(recipe.baseExperience))
    )} ${getLangString("MENU_TEXT", "SKILL_XP")}`;
    if (item instanceof FoodItem)
      this.healingAmount.textContent = `+${numberWithCommas(
        game.combat.player.getFoodHealing(item)
      )}`;
    this.intervalIcon.setInterval(
      game.cooking.getRecipeCookingInterval(recipe)
    );
  }
  updateMastery(recipe, cooking) {
    if (!recipe.hasMastery) {
      this.masteryLevel.textContent = `69`;
      this.masteryPercent.textContent = `(${formatPercent(4.2, 2)})`;
    } else {
      const progress = cooking.getMasteryProgress(recipe);
      this.masteryLevel.textContent = `${progress.level}`;
      this.masteryPercent.textContent = `(${formatPercent(
        progress.percent,
        2
      )})`;
    }
  }
  updateQuantities(recipe) {
    this.quantityIcons.forEach((icon) => icon.updateQuantity());
  }
}
window.customElements.define(
  "cooking-recipe-selection",
  CookingRecipeSelection
);
class LockedCookingRecipe extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("locked-cooking-recipe-template"));
    this.lockedText = getElementFromFragment(
      this._content,
      "locked-text",
      "h5"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setRecipe(recipe) {
    this.lockedText.textContent = "";
    this.lockedText.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "REQUIRES_SKILL_LEVEL",
        {
          skillImage: createElement("img", {
            classList: ["skill-icon-xs", "mr-1"],
            attributes: [["src", game.cooking.media]],
          }),
        },
        { level: `${recipe.level}` }
      )
    );
  }
}
window.customElements.define("locked-cooking-recipe", LockedCookingRecipe);
