declare class LangString extends HTMLElement {
  static get observedAttributes(): string[];
  connectedCallback(): void;
  updateTranslation(): void;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}
declare class ItemChargeDisplay extends HTMLElement {
  initialized: boolean;
  _content: DocumentFragment;
  itemImage: any;
  itemCharges: any;
  connectedCallback(): void;
  itemTooltip: any;
  disconnectedCallback(): void;
  setItem(item: any): void;
  updateCharges(charges: any): void;
}
declare class SettingsCheckboxElement extends HTMLElement {
  _content: DocumentFragment;
  label: any;
  input: any;
  connectedCallback(): void;
  initialize(data: any, onChange: any): void;
  setChecked(isChecked: any): void;
}
declare namespace SettingsCheckboxElement {
  const elementCount: number;
}
declare class SettingsSwitchElement extends HTMLElement {
  static get observedAttributes(): string[];
  _content: DocumentFragment;
  label: any;
  input: any;
  control: any;
  connectedCallback(): void;
  initialize(data: any, onChange: any): void;
  setChecked(isChecked: any): void;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  setLabel(labelHTML: any, size: any): void;
  setSize(oldSize: any, newSize: any): void;
}
declare namespace SettingsSwitchElement {
  const elementCount_1: number;
  export { elementCount_1 as elementCount };
}
declare class SettingsDropdownElement extends HTMLElement {
  _content: DocumentFragment;
  dropdownButton: any;
  optionsContainer: any;
  label: any;
  connectedCallback(): void;
  initialize(data: any, onChange: any): void;
  appendOptionToElement(option: any, element: any): void;
  updateValue(newOption: any): void;
}
declare class UpgradeChainDisplayElement extends HTMLElement {
  _content: DocumentFragment;
  chainName: any;
  upgradeName: any;
  connectedCallback(): void;
  descriptionTooltip: any;
  disconnectedCallback(): void;
  initialize(chain: any): void;
  setUpgrade(name: any, description: any): void;
}
