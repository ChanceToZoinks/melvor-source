declare class AltMagicMenu extends HTMLElement {
  _content: DocumentFragment;
  spellName: any;
  spellDescription: any;
  spellImage: any;
  clickImageInfo: any;
  runeRequirements: RequiresBox;
  itemRequirements: RequiresBox;
  runeHaves: HavesBox;
  itemHaves: HavesBox;
  producesSingle: ProducesBox;
  producesCurrent: HavesBox;
  grants: GrantsBox;
  interval: IntervalIcon;
  progressBar: ProgressBar;
  castButton: any;
  doublingCont: any;
  doublingIcon: DoublingIcon;
  connectedCallback(): void;
  setCastCallback(altMagic: any): void;
  setSpell(altMagic: any, spell: any): void;
  setSpellImage(altMagic: any): void;
  setSpellQuantities(altMagic: any): void;
  resetSpellQuantities(): void;
  updateQuantities(): void;
  updateRates(altMagic: any): void;
  unsetSpell(): void;
  renderProgress(altMagic: any, timer: any): void;
}
declare class AltMagicItemMenu extends HTMLElement {
  _content: DocumentFragment;
  buttonContainer: any;
  selectItemFragment: DocumentFragment;
  selectBarFragment: DocumentFragment;
  lockedBarFragment: DocumentFragment;
  connectedCallback(): void;
  createItemButton(item: any, callback: any): DocumentFragment;
  createBarButton(item: any, callback: any): DocumentFragment;
  createLockedBarButton(unlockLevel: any): DocumentFragment;
  setItemSelection(altMagic: any, spell: any): void;
  setBarSelection(altMagic: any): void;
}
