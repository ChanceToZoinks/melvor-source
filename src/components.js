"use strict";
class LangString extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.updateTranslation();
  }
  updateTranslation() {
    const category = this.getAttribute("lang-cat");
    const id = this.getAttribute("lang-id");
    if (category === null) {
      this.textContent = "Language Category Undefined";
    } else if (id === null) {
      this.textContent = "Language ID Undefined";
    } else {
      this.textContent = getLangString(category, id);
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.updateTranslation();
  }
  static get observedAttributes() {
    return ["lang-cat", "lang-id"];
  }
}
class ItemChargeDisplay extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("item-charge-display-template"));
    this.itemImage = getElementFromFragment(this._content, "item-image", "img");
    this.itemCharges = getElementFromFragment(
      this._content,
      "item-charges",
      "span"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.itemTooltip = tippy(this.itemImage, {
      content: "",
      placement: "bottom",
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.itemTooltip !== undefined) {
      this.itemTooltip.destroy();
      this.itemTooltip = undefined;
    }
  }
  setItem(item) {
    var _a;
    this.setAttribute("data-item-id", item.id);
    this.itemImage.src = item.media;
    (_a = this.itemTooltip) === null || _a === void 0
      ? void 0
      : _a.setContent(item.description);
    this.initialized = true;
  }
  updateCharges(charges) {
    this.itemCharges.textContent = templateLangString(
      "MENU_TEXT",
      "CURRENT_CHARGES",
      { count: numberWithCommas(charges) }
    );
    if (charges <= 0) {
      this.itemCharges.classList.replace("text-success", "text-danger");
    } else {
      this.itemCharges.classList.replace("text-danger", "text-success");
    }
  }
}
window.customElements.define("item-charge-display", ItemChargeDisplay);
class SettingsCheckboxElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("settings-checkbox-template"));
    this.label = getElementFromFragment(this._content, "label", "label");
    this.input = getElementFromFragment(this._content, "input", "input");
    const id = `settings-checkbox-${SettingsCheckboxElement.elementCount}`;
    this.input.id = id;
    this.label.htmlFor = id;
    SettingsCheckboxElement.elementCount++;
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(data, onChange) {
    this.setChecked(data.currentValue);
    this.label.innerHTML = data.name;
    this.input.onchange = onChange;
    this.setAttribute("data-init", "true");
  }
  setChecked(isChecked) {
    this.input.checked = isChecked;
  }
}
SettingsCheckboxElement.elementCount = 0;
window.customElements.define("settings-checkbox", SettingsCheckboxElement);
class SettingsSwitchElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("settings-switch-template"));
    this.label = getElementFromFragment(this._content, "label", "label");
    this.input = getElementFromFragment(this._content, "input", "input");
    this.control = getElementFromFragment(this._content, "control", "div");
    const id = `settings-switch-${SettingsSwitchElement.elementCount}`;
    this.input.id = id;
    this.label.htmlFor = id;
    SettingsSwitchElement.elementCount++;
    const size = this.getAttribute("data-size");
    if (size === null) this.setAttribute("data-size", "small");
    else this.attributeChangedCallback("data-size", null, size);
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(data, onChange) {
    this.setChecked(data.currentValue);
    this.setLabel(data.name, this.getAttribute("data-size"));
    this.input.onchange = onChange;
    this.setAttribute("data-init", "true");
  }
  setChecked(isChecked) {
    this.input.checked = isChecked;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "data-size":
        switch (newValue) {
          case "small":
          case "large":
            this.setSize(oldValue, newValue);
            break;
        }
        break;
    }
  }
  setLabel(labelHTML, size) {
    switch (size) {
      case "small":
        this.label.innerHTML = `<small>${labelHTML}</small>`;
        break;
      default:
        this.label.innerHTML = labelHTML;
    }
  }
  setSize(oldSize, newSize) {
    if (this.getAttribute("data-init")) {
      let oldHTML = this.label.innerHTML;
      if (oldSize === "small") {
        const innerMatch = oldHTML.match(/^<small>(.*?)<\/small>$/);
        if (innerMatch === null) throw new Error("Error setting size");
        oldHTML = innerMatch[1];
      }
      this.setLabel(oldHTML, newSize);
    }
    switch (newSize) {
      case "small":
        this.control.classList.remove("custom-control-lg");
        this.label.classList.add("font-w400");
        break;
      case "large":
        this.control.classList.add("custom-control-lg");
        this.label.classList.remove("font-w400");
        break;
    }
  }
  static get observedAttributes() {
    return ["data-size"];
  }
}
SettingsSwitchElement.elementCount = 0;
window.customElements.define("settings-switch", SettingsSwitchElement);
class SettingsDropdownElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("settings-dropdown-template"));
    this.dropdownButton = getElementFromFragment(
      this._content,
      "dropdown-button",
      "button"
    );
    this.optionsContainer = getElementFromFragment(
      this._content,
      "options-container",
      "div"
    );
    this.label = getElementFromFragment(this._content, "label", "span");
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize(data, onChange) {
    this.label.innerHTML = data.name;
    data.options.forEach((option) => {
      const item = createElement("a", { className: "dropdown-item" });
      item.onclick = () => onChange(option.value);
      this.appendOptionToElement(option, item);
      this.optionsContainer.append(item);
    });
    this.setAttribute("data-init", "true");
  }
  appendOptionToElement(option, element) {
    element.innerHTML = option.name;
    if (option.media !== undefined) {
      const image = createElement("img", {
        className: "skill-icon-sm m-0",
        attributes: [["src", option.media]],
      });
      element.prepend(image, " ");
    }
  }
  updateValue(newOption) {
    this.appendOptionToElement(newOption, this.dropdownButton);
  }
}
window.customElements.define("settings-dropdown", SettingsDropdownElement);
class UpgradeChainDisplayElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("upgrade-chain-display-template"));
    this.chainName = getElementFromFragment(
      this._content,
      "chain-name",
      "span"
    );
    this.upgradeName = getElementFromFragment(
      this._content,
      "upgrade-name",
      "span"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.descriptionTooltip = tippy(this.upgradeName, {
      allowHTML: true,
      placement: "bottom",
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.descriptionTooltip !== undefined) {
      this.descriptionTooltip.destroy();
      this.descriptionTooltip = undefined;
    }
  }
  initialize(chain) {
    this.chainName.textContent = chain.chainName;
  }
  setUpgrade(name, description) {
    var _a;
    this.upgradeName.textContent = name;
    (_a = this.descriptionTooltip) === null || _a === void 0
      ? void 0
      : _a.setContent(`<div class="text-center">${description}</div>`);
  }
}
window.customElements.define(
  "upgrade-chain-display",
  UpgradeChainDisplayElement
);
