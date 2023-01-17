declare class LoreBook extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  _title: any;
  _media: any;
  unlockRequirements: any;
  get title(): any;
  get media(): any;
}
declare class Lore {
  constructor(game: any);
  game: any;
  books: NamespaceRegistry;
  renderUnlocks: boolean;
  bookButtons: Map<any, any>;
  registerLore(namespace: any, loreData: any): void;
  loadLoreButtons(): void;
  onLoad(): void;
  render(): void;
  updateLoreBookUnlocks(): void;
  readLore(book: any): void;
}
declare namespace Lore {
  const LORE: {
    readonly title: any;
    readonly paragraphs: string;
  }[];
}
declare class LoreBookButtonElement extends HTMLElement {
  _content: DocumentFragment;
  bookImage: any;
  bookTitle: any;
  readButton: any;
  connectedCallback(): void;
  setImage(book: any): void;
  updateForUnlock(book: any, game: any): void;
  createUnlockElement(costNodes: any, met: any): any;
  createUnlockElements(book: any, game: any): any[];
  getTextClass(met: any): "text-success" | "text-danger";
}
