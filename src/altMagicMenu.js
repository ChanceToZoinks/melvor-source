"use strict";
class AltMagicMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("alt-magic-menu-template"));
    this.spellName = getElementFromFragment(
      this._content,
      "spell-name",
      "span"
    );
    this.spellDescription = getElementFromFragment(
      this._content,
      "spell-description",
      "small"
    );
    this.spellImage = getElementFromFragment(
      this._content,
      "spell-image",
      "img"
    );
    this.clickImageInfo = getElementFromFragment(
      this._content,
      "image-info",
      "div"
    );
    this.runeRequirements = new RequiresBox(
      getElementFromFragment(this._content, "rune-requirements", "div"),
      false,
      ["pb-2", "col-12"]
    );
    this.itemRequirements = new RequiresBox(
      getElementFromFragment(this._content, "item-requirements", "div"),
      false,
      ["pb-2", "col-12"],
      [],
      48,
      "AND"
    );
    this.runeHaves = new HavesBox(
      getElementFromFragment(this._content, "rune-haves", "div"),
      false,
      ["pb-2", "col-12"]
    );
    this.itemHaves = new HavesBox(
      getElementFromFragment(this._content, "item-haves", "div"),
      false,
      ["pb-2", "col-12"],
      [],
      48,
      "AND"
    );
    this.producesSingle = new ProducesBox(
      getElementFromFragment(this._content, "produces-single", "div"),
      false,
      ["pb-2", "col-12"]
    );
    this.producesCurrent = new HavesBox(
      getElementFromFragment(this._content, "produces-current", "div"),
      false,
      ["pb-2", "col-12"]
    );
    this.grants = new GrantsBox(
      getElementFromFragment(this._content, "grants", "div"),
      false,
      ["pb-2", "col-12"]
    );
    const createRow = getElementFromFragment(
      this._content,
      "create-row",
      "div"
    );
    this.interval = new IntervalIcon(createRow, 0);
    this.progressBar = new ProgressBar(
      getElementFromFragment(this._content, "progress-bar", "div"),
      "bg-info"
    );
    this.grants.hideMastery();
    this.castButton = getElementFromFragment(
      this._content,
      "cast-button",
      "button"
    );
    this.doublingCont = getElementFromFragment(
      this._content,
      "doubling-icon-cont",
      "div"
    );
    this.doublingIcon = new DoublingIcon(this.doublingCont, 0);
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setCastCallback(altMagic) {
    this.castButton.onclick = () => altMagic.castButtonOnClick();
  }
  setSpell(altMagic, spell) {
    this.spellName.textContent = spell.name;
    this.spellDescription.textContent = spell.description;
    this.setSpellImage(altMagic);
    switch (spell.specialCost.type) {
      case AltMagicConsumptionID.AnyItem:
      case AltMagicConsumptionID.JunkItem:
      case AltMagicConsumptionID.BarIngredientsWithCoal:
      case AltMagicConsumptionID.BarIngredientsWithoutCoal:
      case AltMagicConsumptionID.AnySuperiorGem:
      case AltMagicConsumptionID.AnyNormalFood:
        showElement(this.clickImageInfo);
        this.spellImage.onclick = () => altMagic.openSelectItemOnClick();
        break;
      default:
        hideElement(this.clickImageInfo);
        this.spellImage.onclick = null;
        break;
    }
    if (
      spell.produces !== AltMagicProductionID.GP &&
      spell.produces !== AltMagicProductionID.MagicXP
    ) {
      showElement(this.doublingCont);
      this.doublingIcon.setChance(altMagic.selectedSpellDoublingChance);
    } else {
      hideElement(this.doublingCont);
    }
    this.interval.setInterval(altMagic.actionInterval);
    this.grants.setSelected();
    this.grants.updateGrants(
      altMagic.modifyXP(spell.baseExperience, spell),
      0,
      0
    );
    this.grants.hideMastery();
  }
  setSpellImage(altMagic) {
    this.spellImage.src = altMagic.selectedSpellMedia;
  }
  setSpellQuantities(altMagic) {
    const runeCosts = altMagic
      .getCurrentRecipeRuneCosts()
      .getItemQuantityArray();
    this.runeRequirements.setSelected();
    this.runeRequirements.setItems(runeCosts);
    this.runeHaves.setSelected();
    this.runeHaves.setItems(runeCosts);
    const itemCosts = altMagic.getCurrentRecipeCosts().getItemQuantityArray();
    if (itemCosts.length > 0) {
      this.itemRequirements.show();
      this.itemHaves.show();
      this.itemRequirements.setSelected();
      this.itemRequirements.setItems(itemCosts);
      this.itemHaves.setSelected();
      this.itemHaves.setItems(itemCosts);
    } else {
      this.itemRequirements.hide();
      this.itemHaves.hide();
      this.itemRequirements.destroyIcons();
      this.itemHaves.destroyIcons();
    }
    const products = altMagic.getCurrentRecipeBaseProducts();
    if (products.items.length > 0 || products.gp > 0 || products.sc > 0) {
      this.producesSingle.show();
      this.producesSingle.setSelected();
      this.producesSingle.setItems(products.items, products.gp, products.sc);
      this.producesCurrent.show();
      this.producesCurrent.setSelected();
      this.producesCurrent.setItems(products.items, products.gp, products.sc);
    } else {
      this.producesSingle.hide();
      this.producesSingle.destroyIcons();
      this.producesCurrent.hide();
      this.producesCurrent.destroyIcons();
    }
  }
  resetSpellQuantities() {
    this.runeRequirements.destroyIcons();
    this.runeRequirements.setUnselected();
    this.runeHaves.destroyIcons();
    this.runeHaves.setUnselected();
    this.itemRequirements.hide();
    this.itemHaves.hide();
    this.itemRequirements.destroyIcons();
    this.itemRequirements.setUnselected();
    this.itemHaves.destroyIcons();
    this.itemHaves.setUnselected();
    this.producesSingle.hide();
    this.producesSingle.destroyIcons();
    this.producesCurrent.hide();
    this.producesCurrent.destroyIcons();
  }
  updateQuantities() {
    this.runeHaves.updateQuantities();
    this.itemHaves.updateQuantities();
    this.producesCurrent.updateQuantities();
  }
  updateRates(altMagic) {
    var _a, _b;
    this.interval.setInterval(altMagic.actionInterval);
    this.doublingIcon.setChance(altMagic.selectedSpellDoublingChance);
    if (
      altMagic.activeSpell.produces === AltMagicProductionID.MagicXP &&
      altMagic.selectedConversionItem !== undefined
    ) {
      const baseXP =
        ((_b =
          (_a = altMagic.selectedConversionItem) === null || _a === void 0
            ? void 0
            : _a.sellsFor) !== null && _b !== void 0
          ? _b
          : 0) * 0.03;
      this.grants.updateGrants(altMagic.modifyXP(baseXP), 0, 0);
    }
  }
  unsetSpell() {
    this.spellName.textContent = "-";
    this.spellDescription.textContent = "-";
    this.spellImage.src = game.altMagic.media;
    this.spellImage.onclick = null;
    hideElement(this.clickImageInfo);
    this.grants.setUnselected();
    this.resetSpellQuantities();
  }
  renderProgress(altMagic, timer) {
    if (altMagic.isActive) {
      this.progressBar.animateProgressFromTimer(timer);
    } else {
      this.progressBar.stopAnimation();
    }
  }
}
window.customElements.define("alt-magic-menu", AltMagicMenu);
class AltMagicItemMenu extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("alt-magic-item-menu-template"));
    this.buttonContainer = getElementFromFragment(
      this._content,
      "button-container",
      "div"
    );
    const selectItemTemplate = document.getElementById(
      "alt-magic-item-select-template"
    );
    if (
      selectItemTemplate === null ||
      !(selectItemTemplate instanceof HTMLTemplateElement)
    )
      throw new Error("Template does not exist");
    this.selectItemFragment = selectItemTemplate.content;
    const selectBarFragment = document.getElementById(
      "alt-magic-bar-select-template"
    );
    if (
      selectBarFragment === null ||
      !(selectBarFragment instanceof HTMLTemplateElement)
    )
      throw new Error("Template does not exist");
    this.selectBarFragment = selectBarFragment.content;
    const lockedBarTemplate = document.getElementById(
      "alt-magic-bar-locked-template"
    );
    if (
      lockedBarTemplate === null ||
      !(lockedBarTemplate instanceof HTMLTemplateElement)
    )
      throw new Error("Template does not exist");
    this.lockedBarFragment = lockedBarTemplate.content;
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  createItemButton(item, callback) {
    const newButton = new DocumentFragment();
    newButton.append(this.selectItemFragment.cloneNode(true));
    getElementFromFragment(newButton, "link", "a").onclick = callback;
    getElementFromFragment(newButton, "image", "img").src = item.media;
    return newButton;
  }
  createBarButton(item, callback) {
    const newButton = new DocumentFragment();
    newButton.append(this.selectBarFragment.cloneNode(true));
    getElementFromFragment(newButton, "link", "a").onclick = callback;
    getElementFromFragment(newButton, "bar-image", "img").src = item.media;
    getElementFromFragment(newButton, "bar-name", "span").textContent =
      item.name;
    return newButton;
  }
  createLockedBarButton(unlockLevel) {
    const newButton = new DocumentFragment();
    newButton.append(this.lockedBarFragment.cloneNode(true));
    getElementFromFragment(newButton, "message-span", "span").append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "UNLOCKED_AT",
        {
          skillImage: createElement("img", {
            classList: ["skill-icon-xs", "mr-1"],
            attributes: [["src", game.smithing.media]],
          }),
        },
        { level: `${unlockLevel}` }
      )
    );
    return newButton;
  }
  setItemSelection(altMagic, spell) {
    const itemButtons = new DocumentFragment();
    switch (spell.specialCost.type) {
      case AltMagicConsumptionID.JunkItem:
        game.fishing.junkItems.forEach((item) => {
          if (game.bank.hasUnlockedItem(item)) {
            itemButtons.append(
              this.createItemButton(item, () =>
                altMagic.selectItemOnClick(item)
              )
            );
          }
        });
        break;
      case AltMagicConsumptionID.AnySuperiorGem:
        game.bank.unlockedItemArray.forEach((item) => {
          if (item.type === "Superior Gem")
            itemButtons.append(
              this.createItemButton(item, () =>
                altMagic.selectItemOnClick(item)
              )
            );
        });
        break;
      case AltMagicConsumptionID.AnyNormalFood:
        game.cooking.actions.forEach((action) => {
          if (game.bank.hasUnlockedItem(action.product))
            itemButtons.append(
              this.createItemButton(action.product, () =>
                altMagic.selectItemOnClick(action.product)
              )
            );
        });
        break;
      case AltMagicConsumptionID.AnyItem:
        game.bank.unlockedItemArray.forEach((item) => {
          itemButtons.append(
            this.createItemButton(item, () => altMagic.selectItemOnClick(item))
          );
        });
        break;
    }
    this.buttonContainer.textContent = "";
    this.buttonContainer.append(itemButtons);
  }
  setBarSelection(altMagic) {
    const barButtons = new DocumentFragment();
    altMagic.smithingBarRecipes.forEach((recipe) => {
      if (game.smithing.level >= recipe.level) {
        barButtons.append(
          this.createBarButton(recipe.product, () =>
            altMagic.selectBarOnClick(recipe)
          )
        );
      } else {
        barButtons.append(this.createLockedBarButton(recipe.level));
      }
    });
    this.buttonContainer.textContent = "";
    this.buttonContainer.append(barButtons);
  }
}
window.customElements.define("alt-magic-item-menu", AltMagicItemMenu);
