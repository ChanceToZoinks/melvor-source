"use strict";
class DropDown extends ContainedComponent {
  constructor(
    parent,
    id,
    buttonClasses,
    optionsClasses,
    scroll = false,
    maxOptionsHeight = 0
  ) {
    super();
    this.parent = parent;
    this.container = createElement("div", { classList: ["dropdown"] });
    this.button = this.container.appendChild(
      createElement("button", {
        classList: ["btn", "dropdown-toggle", ...buttonClasses],
        id: id,
        attributes: [
          ["type", "button"],
          ["data-toggle", "dropdown"],
          ["aria-haspopup", "true"],
          ["aria-expanded", "false"],
        ],
      })
    );
    const classList = ["dropdown-menu", ...optionsClasses];
    const attributes = [["aria-labelledby", id]];
    if (scroll) classList.push("overflow-y-auto");
    if (maxOptionsHeight > 0) {
      attributes.push(["style", `max-height: ${maxOptionsHeight}vh;`]);
    }
    this.optionsContainer = this.container.appendChild(
      createElement("div", { classList, attributes })
    );
    this.parent.appendChild(this.container);
  }
  setButtonText(text) {
    this.button.textContent = text;
  }
  setButtonCallback(callback) {
    this.button.onclick = callback;
  }
  addOption(optionContent, callback) {
    const newOption = createElement("a", {
      classList: ["dropdown-item", "pointer-enabled", "pt-1", "pb-1"],
      children: optionContent,
    });
    newOption.onclick = callback;
    this.optionsContainer.appendChild(newOption);
  }
  clearOptions() {
    this.optionsContainer.textContent = "";
  }
}
class ArtisanMenu extends ContainedComponent {
  constructor(containerID, skill) {
    super();
    this.skill = skill;
    this.recipeDropdownItems = [];
    this.progressTimestamp = 0;
    this.progressInterval = 0;
    this.noneSelected = true;
    const parent = document.getElementById(containerID);
    if (parent === null)
      throw new Error(`Could not get container with ID: ${containerID}`);
    this.parent = parent;
    this.container = parent
      .appendChild(createElement("div", { classList: ["col-12"] }))
      .appendChild(
        createElement("div", {
          classList: ["block-content", "block-content-full"],
        })
      )
      .appendChild(createElement("div", { classList: ["row", "gutters-tiny"] }))
      .appendChild(createElement("div", { classList: ["col-12"] }));
    this.nameRow = createElement("div", {
      classList: ["row", "row-deck", "gutters-tiny"],
      parent: this.container,
    });
    const blockClasses = [
      "block",
      "block-rounded-double",
      "bg-combat-inner-dark",
    ];
    const colClasses = ["col-12", ...blockClasses];
    this.productBlock = this.nameRow
      .appendChild(createElement("div", { classList: ["col-4"] }))
      .appendChild(
        createElement("div", {
          classList: [...blockClasses, "text-center", "p-3"],
        })
      );
    this.productImage = this.productBlock.appendChild(
      createElement("img", {
        classList: ["bank-img-detail"],
        attributes: [["src", this.skill.media]],
      })
    );
    this.productQuantity = this.productBlock
      .appendChild(
        createElement("div", {
          attributes: [
            ["style", "position:absolute;left:0;bottom:10px;width:100%;"],
          ],
        })
      )
      .appendChild(
        createElement("small", {
          classList: [
            "font-w600",
            "badge-pill",
            "bg-secondary",
            "m-1",
            "text-white",
          ],
          text: "-",
        })
      );
    this.createBlock = this.nameRow
      .appendChild(createElement("div", { classList: ["col-8"] }))
      .appendChild(
        createElement("div", {
          classList: [...blockClasses, "pt-2", "pl-2", "pr-2", "pb-1"],
        })
      );
    this.createText = this.createBlock
      .appendChild(
        createElement("h5", {
          classList: ["font-size-sm", "font-w600", "text-muted", "m-1"],
        })
      )
      .appendChild(createElement("small"));
    this.productName = this.createBlock
      .appendChild(
        createElement("h5", {
          classList: ["font-w700", "text-left", "text-combat-smoke", "m-1"],
        })
      )
      .appendChild(createElement("span", { text: "-" }));
    this.productDescription = this.createBlock
      .appendChild(
        createElement("h5", {
          classList: [
            "font-w400",
            "font-size-sm",
            "text-left",
            "text-bank-desc",
            "m-1",
            "mb-2",
          ],
        })
      )
      .appendChild(createElement("small"));
    this.selectedText = this.createBlock
      .appendChild(
        createElement("h5", {
          classList: [
            "font-w400",
            "font-size-sm",
            "text-left",
            "text-bank-desc",
            "m-1",
            "mb-2",
          ],
        })
      )
      .appendChild(createElement("small"));
    this.viewStatsText = this.createBlock.appendChild(
      createElement("h5", {
        classList: [
          "font-w400",
          "font-size-sm",
          "text-left",
          "combat-action",
          "m-1",
          "mb-2",
          "pointer-enabled",
          "d-none",
        ],
      })
    );
    this.buffsContainer = this.createBlock
      .appendChild(createElement("div", { classList: ["col-12"] }))
      .appendChild(createElement("div", { classList: ["row"] }));
    this.productPreservation = new PreservationIcon(this.buffsContainer, 69);
    this.productDoubling = new DoublingIcon(this.buffsContainer, 69);
    this.masteryCol = createElement("div", {
      classList: [...colClasses, "p-1"],
      parent: this.container,
    });
    const masteryParent = createElement("div", {
      classList: ["col-12", "col-md-8"],
    });
    this.masteryCol
      .appendChild(createElement("div", { classList: ["row", "no-gutters"] }))
      .append(createElement("div", { classList: ["col-md-2"] }), masteryParent);
    this.mastery = new MasteryDisplay();
    this.mastery.classList.add("mastery-6");
    masteryParent.append(this.mastery);
    this.ingredientsCol = createElement("div", {
      classList: [...colClasses, "pt-2", "pb-1", "text-center"],
      parent: this.container,
    });
    const ingRow = createElement("div", {
      classList: ["row", "no-gutters"],
      parent: this.ingredientsCol,
    });
    this.dropDownCont = ingRow.appendChild(
      createElement("div", { classList: ["col-12", "d-none"] })
    );
    this.recipeDropdown = new DropDown(
      this.dropDownCont,
      `${this.skill.id}-artisan-menu-recipe-select`,
      ["btn-sm", "btn-primary"],
      ["font-size-sm"],
      true,
      60
    );
    const boxClasses = ["col-12", "col-sm-6", "pb-2"];
    this.requires = new RequiresBox(ingRow, false, boxClasses);
    this.haves = new HavesBox(ingRow, false, boxClasses);
    this.productsCol = createElement("div", {
      classList: [...colClasses, "pt-2", "pb-1", "text-center"],
      parent: this.container,
    });
    const prodRow = createElement("div", {
      classList: ["row", "no-gutters"],
      parent: this.productsCol,
    });
    this.produces = new ProducesBox(prodRow, false, boxClasses);
    this.productIcon = new ItemQtyIcon(this.produces.iconContainer, false, 0);
    this.productIcon.hide();
    this.produces.addIcon(this.productIcon);
    this.grants = new GrantsBox(prodRow, false, boxClasses);
    this.creationCol = createElement("div", {
      classList: [...colClasses, "p-3", "text-center"],
      parent: this.container,
    });
    const createRow = createElement("div", {
      classList: ["row", "justify-content-center"],
      parent: this.creationCol,
    });
    this.createButton = createRow.appendChild(createElement("div")).appendChild(
      createElement("button", {
        classList: ["btn", "btn-success", "m-1", "p-2"],
        attributes: [
          ["type", "button"],
          ["style", "height:48px;"],
        ],
      })
    );
    this.interval = new IntervalIcon(createRow, 0);
    const progressDiv = createRow
      .appendChild(createElement("div", { classList: ["col-12"] }))
      .appendChild(
        createElement("div", {
          classList: ["progress", "active", "mt-3"],
          attributes: [["style", "height:5px;"]],
        })
      )
      .appendChild(
        createElement("div", {
          classList: ["progress-bar", "bg-info"],
          attributes: [
            ["role", "progressbar"],
            ["style", "width:0%;"],
            ["aria-valuenow", "0"],
            ["aria-valuenow", "0"],
            ["aria-valuemin", "0"],
            ["aria-valuemax", "100"],
          ],
        })
      );
    this.progressBar = new ProgressBar(progressDiv);
  }
  localize() {
    this.createText.textContent = getLangString("MENU_TEXT", "CREATE");
    if (this.product !== undefined) {
      this.productName.textContent = this.product.name;
      this.productDescription.textContent = "";
      if (this.product.hasDescription) {
        this.productDescription.append(
          ...$.parseHTML(this.product.description)
        );
      }
    }
    this.selectedText.textContent = getLangString("MENU_TEXT", "NONE_SELECTED");
    this.viewStatsText.textContent = getLangString("MENU_TEXT", "VIEW_STATS");
    this.requires.localize();
    this.haves.localize();
    this.produces.localize();
    this.grants.localize();
    this.createButton.textContent = getLangString("MENU_TEXT", "CREATE");
    this.productDoubling.localize();
    this.productPreservation.localize();
    this.interval.localize();
    this.recipeDropdown.setButtonText(
      getLangString("MENU_TEXT", "SELECT_RECIPE")
    );
    this.recipeDropdownItems.forEach((recipe) => {
      recipe.forEach((icon) => icon.localize());
    });
  }
  setSelected(recipe) {
    if (this.noneSelected) {
      this.requires.setSelected();
      this.haves.setSelected();
      this.grants.setSelected();
      this.produces.setSelected();
      hideElement(this.selectedText);
      this.productIcon.show();
      this.noneSelected = false;
    }
    this.mastery.setMastery(this.skill, recipe);
  }
  setIngredients(items, gp, sc) {
    this.requires.setItems(items, gp, sc);
    this.haves.setItems(items, gp, sc);
  }
  setIngredientsFromRecipe(recipe) {
    this.requires.setItemsFromRecipe(recipe);
    this.haves.setItemsFromRecipe(recipe);
  }
  setProduct(item, qty) {
    this.product = item;
    this.productImage.src = item.media;
    this.productQuantity.textContent = numberWithCommas(game.bank.getQty(item));
    this.productName.textContent = item.name.replace("&apos;", "'");
    if (item instanceof EquipmentItem) {
      showElement(this.viewStatsText);
      this.viewStatsText.onclick = () => viewItemStats(item);
    } else {
      hideElement(this.viewStatsText);
    }
    this.productDescription.innerHTML = "";
    if (item.hasDescription) {
      this.productDescription.innerHTML = item.description;
    }
    this.productIcon.setItem(item, qty);
  }
  updateQuantities() {
    this.haves.updateQuantities();
    if (this.product !== undefined) {
      this.productQuantity.textContent = numberWithCommas(
        game.bank.getQty(this.product)
      );
    }
    this.recipeDropdownItems.forEach((recipe) => {
      recipe.forEach((icon) => icon.updateQuantity());
    });
  }
  updateGrants(xp, masteryXP, poolXP) {
    this.grants.updateGrants(xp, masteryXP, poolXP);
  }
  updateChances(preserveChance, doublingChance) {
    this.productPreservation.setChance(preserveChance);
    this.productDoubling.setChance(doublingChance);
  }
  updateInterval(interval) {
    this.interval.setInterval(interval);
  }
  setCreateCallback(callback) {
    this.createButton.onclick = () => {
      callback(), this.createButton.blur();
    };
  }
  animateProgressFromTimer(timer) {
    this.progressBar.animateProgressFromTimer(timer);
  }
  startProgressBar(interval) {
    this.progressBar.animateProgress(0, interval);
    this.progressInterval = interval;
    this.progressTimestamp = performance.now();
  }
  stopProgressBar() {
    this.progressBar.stopAnimation();
  }
  updateProgressBar() {
    const newTimestamp = performance.now();
    const timeDiff = newTimestamp - this.progressTimestamp;
    if (timeDiff < this.progressInterval) {
      this.progressBar.animateProgress(timeDiff, this.progressInterval);
      this.progressTimestamp = newTimestamp;
    } else {
      this.progressBar.stopAnimation();
    }
  }
  hideRecipeDropdown() {
    hideElement(this.dropDownCont);
  }
  showRecipeDropdown() {
    showElement(this.dropDownCont);
  }
  setRecipeDropdown(altRecipeIngredients, selectCallback, displayOrder) {
    this.recipeDropdownItems.forEach((altRecipe) => {
      altRecipe.forEach((qtyIcon) => {
        qtyIcon.destroy();
      });
    });
    this.recipeDropdownItems = [];
    this.recipeDropdown.clearOptions();
    if (displayOrder === undefined)
      displayOrder = altRecipeIngredients.map((_, i) => i);
    displayOrder.forEach((i) => {
      const altRecipe = altRecipeIngredients[i];
      const altRecipeContainer = createElement("div", {
        classList: ["row", "gutters-tiny"],
      });
      const icons = [];
      altRecipe.items.forEach(({ item, quantity }) => {
        const icon = new ItemQtyIcon(altRecipeContainer, false, quantity);
        icon.setItem(item, quantity);
        icon.updateQuantity();
        icons.push(icon);
      });
      if (altRecipe.gp > 0) {
        const icon = new GPQtyIcon(altRecipeContainer, altRecipe.gp);
        icon.updateQuantity();
        icons.push(icon);
      }
      if (altRecipe.sc > 0) {
        const icon = new SCQtyIcon(altRecipeContainer, altRecipe.sc);
        icon.updateQuantity();
        icons.push(icon);
      }
      this.recipeDropdownItems.push(icons);
      this.recipeDropdown.addOption([altRecipeContainer], selectCallback(i));
    });
    this.showRecipeDropdown();
  }
}
class HerbloreArtisanMenu extends ArtisanMenu {
  constructor(herblore) {
    super("herblore-artisan-container", herblore);
    this.tierImages = [];
    this.tierTooltips = [];
    this.tierContainer = createElement("h5", {
      classList: [
        "font-w700",
        "text-left",
        "text-combat-smoke",
        "m-1",
        "d-none",
      ],
    });
    this.tierText = this.tierContainer.appendChild(
      createElement("small", { classList: ["mr-2"] })
    );
    const tierSpan = this.tierContainer.appendChild(createElement("span"));
    Herblore.tierMasteryLevels.forEach((level, i) => {
      const image = tierSpan.appendChild(
        createElement("img", { classList: ["skill-icon-xs", "mr-2"] })
      );
      const tooltip = tippy(image, {
        placement: "top",
        allowHTML: true,
        interactive: false,
        animation: false,
      });
      this.tierImages.push(image);
      this.tierTooltips.push(tooltip);
    });
    this.productDescription.after(this.tierContainer);
  }
  setProductTier(product, productTier) {
    Herblore.tierMasteryLevels.forEach((level, tier) => {
      let media = cdnMedia(`assets/media/skills/herblore/potion_${tier}.svg`);
      let tipContent = `<div class="text-center"><small>${templateString(
        getLangString("MENU_TEXT", "TOOLTIP_MASTERY_UNLOCK"),
        { level: `${level}` }
      )}</small></div>`;
      if (productTier === tier) {
        media = product.media;
        tipContent = `<div class="text-center"><small>${product.name}</small></div>`;
      }
      this.tierImages[tier].src = media;
      this.tierTooltips[tier].setContent(tipContent);
    });
  }
  setPotionDescription(item, recipe) {
    this.productDescription.append(
      createElement("br"),
      createElement("span", {
        classList: ["text-danger"],
        text: templateLangString("MENU_TEXT", "POTION_CHARGES", {
          charges: `${item.charges}`,
        }),
      }),
      createElement("br"),
      createElement("span", {
        classList: ["text-success"],
        text: templateLangString("MENU_TEXT", "SKILL", {
          skillName: item.action.name,
        }),
      })
    );
    const tier = game.herblore.getPotionTier(recipe);
    this.setProductTier(item, tier);
  }
  setSelected(recipe) {
    if (this.noneSelected) showElement(this.tierContainer);
    super.setSelected(recipe);
  }
  setProduct(item, qty) {
    super.setProduct(item, qty);
    const recipe = game.herblore.getRecipeForPotion(item);
    if (recipe !== undefined) this.setPotionDescription(item, recipe);
  }
  localize() {
    super.localize();
    this.tierText.textContent = getLangString("MENU_TEXT", "POTION_TIER");
    if (this.product !== undefined) {
      const recipe = game.herblore.getRecipeForPotion(this.product);
      if (recipe !== undefined) this.setPotionDescription(this.product, recipe);
    }
  }
}
