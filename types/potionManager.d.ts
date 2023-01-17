declare class PotionManager {
  constructor(game: any);
  game: any;
  activePotions: Map<any, any>;
  autoReuseActions: Set<any>;
  renderRequired: boolean;
  modifiers: MappedModifiers;
  isPotionActiveForAction(action: any): boolean;
  getActivePotionForAction(action: any): any;
  isPotionActive(potion: any): boolean;
  autoReusePotionsForAction(action: any): boolean;
  getPotionCharges(item: any): number;
  usePotion(item: any, loadPotions?: boolean): void;
  removePotion(action: any, loadPotions?: boolean): void;
  consumeCharges(event: any): void;
  toggleAutoReusePotion(action: any): void;
  openPotionSelectOnClick(action: any): void;
  computeProvidedStats(updatePlayer?: boolean): void;
  render(): void;
  onLoad(): void;
  updatePotionHeader(potion: any): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  convertFromOldFormat(save: any, idMap: any): void;
}
declare class PotionSelectMenuItem extends HTMLElement {
  _content: DocumentFragment;
  potionImage: any;
  potionQuantity: any;
  potionName: any;
  useButton: any;
  potionDescription: any;
  potionCharges: any;
  connectedCallback(): void;
  setPotion(potion: any, game: any): void;
}
declare class PotionSelectMenu extends HTMLElement {
  menuItems: any[];
  _content: DocumentFragment;
  potionContainer: any;
  autoReuseCheckBox: any;
  connectedCallback(): void;
  showPotionSelection(potions: any, action: any, game: any): void;
}
