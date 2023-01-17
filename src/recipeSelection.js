"use strict";
class RecipeSelectionTab extends ContainedComponent {
  constructor(parentID, skill, recipes, containerID, recipeCollapse = "md") {
    super();
    this.skill = skill;
    this.recipes = recipes;
    this.recipeCollapse = recipeCollapse;
    this.recipeContainers = [];
    this.recipeTooltips = [];
    this.recipeUnlocked = [];
    const parent = document.getElementById(parentID);
    if (parent === null)
      throw new Error(`Could not find parent element with id: ${parentID}`);
    this.parent = parent;
    this.container = createElement("div", {
      classList: ["col-12", "col-md-8"],
      id: containerID,
    });
    this.recipeRow = this.container
      .appendChild(createElement("div", { classList: ["block-content"] }))
      .appendChild(createElement("div", { classList: ["row"] }));
    this.recipes.forEach(() => this.addRecipeContainer());
    this.parent.append(this.container);
  }
  updateRecipesForLevel() {
    this.recipes.forEach((recipe, id) => {
      if (this.isRecipeUnlocked(recipe)) {
        if (!this.recipeUnlocked[id]) this.setRecipeUnlocked(id);
      } else {
        this.setRecipeLocked(id);
      }
    });
  }
  updateRecipeTooltips() {
    this.recipes.forEach((recipe, id) => {
      const tooltip = this.recipeTooltips[id];
      if (this.recipeUnlocked[id]) {
        const costs = this.getRecipeIngredients(recipe);
        tooltip.setContent(
          this.getRequiresTooltip(
            costs.getItemQuantityArray(),
            costs.gp,
            costs.sc
          )
        );
        tooltip.enable();
      } else {
        tooltip.disable();
      }
    });
  }
  localize() {
    this.recipeUnlocked.forEach((unlocked, id) => {
      if (unlocked) this.setRecipeUnlocked(id);
      else this.setRecipeLocked(id);
    });
    this.updateRecipeTooltips();
  }
  isRecipeUnlocked(recipe) {
    return this.skill.level >= recipe.level;
  }
  addRecipeContainer() {
    const container = createElement("div", {
      classList: ["col-12", `col-${this.recipeCollapse}-6`],
      parent: this.recipeRow,
    })
      .appendChild(
        createElement("ul", {
          classList: ["nav", "nav-pills", "nav-justified", "push"],
        })
      )
      .appendChild(createElement("li", { classList: ["nav-item", "mr-1"] }));
    this.recipeContainers.push(container);
    this.recipeUnlocked.push(false);
    const tooltip = tippy(container, {
      placement: "top",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
    this.recipeTooltips.push(tooltip);
  }
  setRecipeUnlocked(id) {
    const container = this.recipeContainers[id];
    const recipe = this.recipes[id];
    container.textContent = "";
    const link = createElement("a", {
      classList: [
        "block",
        "block-link-pop",
        "nav-link",
        "border",
        "pointer-enabled",
        "font-w600",
      ],
    });
    link.onclick = this.getRecipeCallback(recipe);
    const recipeImage = createElement("img", {
      classList: ["skill-icon-xs", "mr-2"],
    });
    recipeImage.src = this.getRecipeMedia(recipe);
    link.append(
      recipeImage,
      document.createTextNode(this.getRecipeName(recipe))
    );
    this.recipeUnlocked[id] = true;
    container.append(link);
  }
  setRecipeLocked(id) {
    const container = this.recipeContainers[id];
    const recipe = this.recipes[id];
    container.textContent = "";
    const span = createElement("span", {
      classList: [
        "nav-link",
        "font-size-sm",
        "border",
        "border-danger",
        "text-danger",
      ],
    });
    span.append(...getUnlockedAtNodes(this.skill, recipe.level));
    this.recipeUnlocked[id] = false;
    container.append(span);
  }
  getRequiresTooltip(items, gp, sc) {
    const quantities = [];
    const getQty = (qty, media) =>
      `${qty} <img class='skill-icon-xs mr-2' src="${media}">`;
    items.forEach(({ item, quantity }) => {
      quantities.push(getQty(quantity, item.media));
    });
    if (gp > 0) quantities.push(getQty(gp, cdnMedia(InfoIcon.media.gp)));
    if (sc > 0)
      quantities.push(getQty(sc, cdnMedia(InfoIcon.media.slayerCoins)));
    return `
    <small class="text-warning">${getLangString(
      "MENU_TEXT",
      "REQUIRES"
    )}</small><br>
    ${quantities.join("")}
    `;
  }
}
class ItemRecipeSelectionTab extends RecipeSelectionTab {
  getRecipeMedia(recipe) {
    return recipe.product.media;
  }
  getRecipeName(recipe) {
    return recipe.product.name.replace("&apos;", "'");
  }
}
class SmithingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category) {
    const recipes = game.smithing.actions.filter(
      (recipe) => recipe.category === category
    );
    recipes.sort((a, b) => a.level - b.level);
    super(
      `smithing-category-container`,
      game.smithing,
      recipes,
      `smithing-category-${category.id}`
    );
    this.hide();
  }
  getRecipeCallback(recipe) {
    return () => game.smithing.selectRecipeOnClick(recipe);
  }
  getRecipeIngredients(recipe) {
    return game.smithing.getRecipeCosts(recipe);
  }
}
class FletchingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category) {
    const recipes = game.fletching.actions.filter(
      (recipe) => recipe.category === category
    );
    recipes.sort((a, b) => a.level - b.level);
    super(
      `fletching-category-container`,
      game.fletching,
      recipes,
      `fletching-category-${category.id}`
    );
    this.hide();
  }
  getRecipeCallback(recipe) {
    return () => game.fletching.selectRecipeOnClick(recipe);
  }
  getRecipeIngredients(recipe) {
    return game.fletching.getRecipeCosts(recipe);
  }
}
class CraftingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category) {
    const recipes = game.crafting.actions.filter(
      (recipe) => recipe.category === category
    );
    recipes.sort((a, b) => a.level - b.level);
    super(
      `crafting-category-container`,
      game.crafting,
      recipes,
      `crafting-category-${category.id}`
    );
    this.hide();
  }
  getRecipeCallback(recipe) {
    return () => game.crafting.selectRecipeOnClick(recipe);
  }
  getRecipeIngredients(recipe) {
    return game.crafting.getRecipeCosts(recipe);
  }
}
class RunecraftingSelectionTab extends ItemRecipeSelectionTab {
  constructor(category) {
    const recipes = game.runecrafting.actions.filter(
      (recipe) => recipe.category === category
    );
    recipes.sort((a, b) => a.level - b.level);
    super(
      `runecrafting-category-container`,
      game.runecrafting,
      recipes,
      `runecrafting-category-${category.id}`
    );
    this.hide();
  }
  getRecipeCallback(recipe) {
    return () => game.runecrafting.selectRecipeOnClick(recipe);
  }
  getRecipeIngredients(recipe) {
    return game.runecrafting.getRecipeCosts(recipe);
  }
}
class HerbloreSelectionTab extends RecipeSelectionTab {
  constructor(category) {
    const recipes = game.herblore.actions.filter(
      (recipe) => recipe.category === category
    );
    recipes.sort((a, b) => a.level - b.level);
    super(
      `herblore-category-container`,
      game.herblore,
      recipes,
      `herblore-category-${category.id}`
    );
    this.hide();
  }
  updateRecipesForLevel() {
    this.recipes.forEach((recipe, id) => {
      if (this.skill.level >= recipe.level) {
        this.setRecipeUnlocked(id);
      } else {
        this.setRecipeLocked(id);
      }
    });
  }
  getRecipeMedia(recipe) {
    const tier = game.herblore.getPotionTier(recipe);
    return recipe.potions[tier].media;
  }
  getRecipeName(recipe) {
    return recipe.name;
  }
  getRecipeCallback(recipe) {
    return () => game.herblore.selectRecipeOnClick(recipe);
  }
  getRecipeIngredients(recipe) {
    return game.herblore.getRecipeCosts(recipe);
  }
}
class AltMagicSelectionTab extends RecipeSelectionTab {
  constructor() {
    const spells = game.altMagic.actions.allObjects.sort(
      (a, b) => a.level - b.level
    );
    super(
      `altmagic-category-container`,
      game.altMagic,
      spells,
      `altmagic-category-0`
    );
    this.recipeTooltips.forEach((tooltip) =>
      tooltip.setProps({ placement: "bottom" })
    );
  }
  getRecipeMedia(recipe) {
    return recipe.media;
  }
  getRecipeName(recipe) {
    return recipe.name;
  }
  getRecipeCallback(recipe) {
    return () => game.altMagic.selectSpellOnClick(recipe);
  }
  updateRecipeTooltips() {
    this.recipes.forEach((recipe, id) => {
      const tooltip = this.recipeTooltips[id];
      if (this.recipeUnlocked[id]) {
        tooltip.setContent(this.getSpellTooltip(recipe));
        tooltip.enable();
      } else {
        tooltip.disable();
      }
    });
  }
  getRecipeIngredients(recipe) {
    return new Costs(game);
  }
  getSpellTooltip(altSpell) {
    let runes = altSpell.runesRequired
      .map(
        (rune) =>
          `${rune.quantity}<img class='skill-icon-sm' src="${rune.item.media}">`
      )
      .join("");
    if (altSpell.runesRequiredAlt !== undefined) {
      runes += `<br>${getLangString(
        "MENU_TEXT",
        "OR"
      )}<br><small class="text-info">(${getLangString(
        "MENU_TEXT",
        "USE_COMBINATION_RUNES"
      )})</small><br>`;
      runes += altSpell.runesRequiredAlt
        .map(
          (rune) =>
            `${rune.quantity}<img class='skill-icon-sm' src="${rune.item.media}">`
        )
        .join("");
    }
    return `
    <div class="text-center"><span class="text-warning">
    ${altSpell.name}
    </span><br><small>
    ${altSpell.description}<br>
    ${templateLangString("MENU_TEXT", "XP_AMOUNT", {
      xp: `${altSpell.baseExperience}`,
    })}<br>
    ${getLangString("MENU_TEXT", "REQUIRES")}<br>
    ${runes}
    </small></div>`;
  }
}
class SummoningSelectionTab extends ItemRecipeSelectionTab {
  constructor(category) {
    const recipes = game.summoning.actions.filter(
      (recipe) => recipe.category === category
    );
    recipes.sort((a, b) => a.level - b.level);
    super(
      `summoning-category-container`,
      game.summoning,
      recipes,
      `summoning-category-${category.id}`,
      "lg"
    );
    const shardDiv = createElement("div", {
      classList: ["col-12", "p-3", "text-center"],
    });
    this.shardMessage = shardDiv.appendChild(
      createElement("h5", {
        classList: ["font-w600", "font-size-sm", "text-warning", "mb-3"],
        text: getLangString("MENU_TEXT", "SHARD_PURCHASE"),
      })
    );
    this.recipeRow.prepend(shardDiv);
    this.container.classList.remove("col-md-8");
    this.container.classList.add("col-md-6", "col-lg-8", "overflow-y-auto");
    this.container.setAttribute("style", "height:100vh!important;");
    this.hide();
  }
  localize() {
    super.localize();
    this.shardMessage.textContent = getLangString(
      "MENU_TEXT",
      "SHARD_PURCHASE"
    );
  }
  isRecipeUnlocked(recipe) {
    return (
      super.isRecipeUnlocked(recipe) && game.summoning.getMarkLevel(recipe) > 0
    );
  }
  setRecipeUnlocked(id) {
    const container = this.recipeContainers[id];
    const recipe = this.recipes[id];
    container.textContent = "";
    const link = createElement("a", {
      classList: [
        "block",
        "block-link-pop",
        "nav-link",
        "border",
        "pointer-enabled",
        "font-w600",
      ],
    });
    link.onclick = this.getRecipeCallback(recipe);
    const subcont = link.appendChild(
      createElement("div", {
        classList: ["media", "d-flex", "align-items-center", "push", "mb-0"],
      })
    );
    const recipeImage = createElement("img", { classList: ["shop-img"] });
    recipeImage.src = this.getRecipeMedia(recipe);
    subcont
      .appendChild(createElement("div", { classList: ["mr-2"] }))
      .appendChild(recipeImage);
    const descContainer = subcont.appendChild(
      createElement("div", { classList: ["media-body", "text-left"] })
    );
    descContainer.appendChild(
      createElement("div", {
        classList: ["font-w600", "font-size-lg"],
        text: templateLangString("MENU_TEXT", "THE_FAMILIAR", {
          name: this.getRecipeName(recipe),
        }),
      })
    );
    descContainer.appendChild(
      createElement("div", {
        classList: ["font-w600", "font-size-sm", "text-warning"],
        text: templateLangString("MENU_TEXT", "SUMMON_TIER", {
          tier: `${recipe.tier}`,
        }),
      })
    );
    this.recipeUnlocked[id] = true;
    container.append(link);
  }
  setRecipeLocked(id) {
    const container = this.recipeContainers[id];
    const recipe = this.recipes[id];
    if (!super.isRecipeUnlocked(recipe)) {
      super.setRecipeLocked(id);
    } else {
      container.textContent = "";
      const span = createElement("span", {
        classList: [
          "nav-link",
          "font-size-sm",
          "border",
          "border-danger",
          "text-danger",
        ],
      });
      const skillImage = createElement("img", {
        classList: ["skill-icon-xs", "mr-1"],
      });
      skillImage.src = cdnMedia("assets/media/main/question.svg");
      span.append(
        skillImage,
        document.createTextNode(getLangString("MENU_TEXT", "MARK_UNLOCATED"))
      );
      this.recipeUnlocked[id] = false;
      container.append(span);
    }
  }
  getRecipeCallback(recipe) {
    return () => game.summoning.selectRecipeOnClick(recipe);
  }
  getRecipeIngredients(recipe) {
    return game.summoning.getRecipeCosts(recipe);
  }
}
class CategoryMenu extends ContainedComponent {
  constructor(parentID, navID, categoryData, expandTextID, changeCategoryFunc) {
    super();
    this.navID = navID;
    this.categoryData = categoryData;
    this.expandTextID = expandTextID;
    this.optionNames = [];
    const parent = document.getElementById(parentID);
    if (parent === null)
      throw new Error(`Element with ID: ${parentID} does not exist.`);
    this.container = createElement("div", {
      classList: ["bg-white", "p-3", "push", "content-justify-center"],
    });
    this.container.style.width = "100%";
    const expandButton = this.container
      .appendChild(createElement("div", { classList: ["d-lg-none"] }))
      .appendChild(
        createElement("button", {
          classList: [
            "btn",
            "btn-block",
            "btn-light",
            "d-flex",
            "justify-content-between",
            "align-items-center",
            "text-combat-smoke",
          ],
          attributes: [
            ["type", "button"],
            ["data-toggle", "class-toggle"],
            ["data-target", `#${navID}`],
            ["data-class", "d-none"],
          ],
        })
      );
    this.expandText = createElement("span", {
      text: getLangString("MENU_TEXT", this.expandTextID),
    });
    expandButton.append(
      this.expandText,
      createElement("i", { classList: ["fa", "fa-bars"] })
    );
    this.optionsContainer = this.container
      .appendChild(
        createElement("div", {
          id: navID,
          classList: ["d-none", "d-lg-block", "mt-2", "mt-lg-0"],
        })
      )
      .appendChild(
        createElement("ul", {
          classList: [
            "nav-main",
            "nav-main-horizontal",
            "nav-main-hover",
            "nav-main-horizontal-center",
          ],
        })
      );
    categoryData.forEach((category) => {
      this.addCategory(category, changeCategoryFunc);
    });
    parent.appendChild(this.container);
  }
  addCategory(category, callback) {
    const link = this.optionsContainer
      .appendChild(createElement("li", { classList: ["nav-main-item"] }))
      .appendChild(
        createElement("a", {
          classList: ["nav-main-link", "active"],
          attributes: [
            ["data-toggle", "class-toggle"],
            ["data-target", `#${this.navID}`],
            ["data-class", "d-none"],
          ],
        })
      );
    link.onclick = () => callback(category);
    const optionName = createElement("span", {
      classList: ["nav-main-link-name"],
      text: category.name,
    });
    link.append(
      createElement("img", {
        classList: ["skill-icon-xs", "m-0", "mr-2"],
        attributes: [["src", category.media]],
      }),
      optionName
    );
    this.optionNames.push(optionName);
  }
  localize() {
    this.categoryData.forEach((category, i) => {
      this.optionNames[i].textContent = category.name;
    });
    this.expandText.textContent = getLangString("MENU_TEXT", this.expandTextID);
  }
}
