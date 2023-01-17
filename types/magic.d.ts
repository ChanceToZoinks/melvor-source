declare function updateSpellbook(
  book: any,
  player: any,
  magicLevel: any,
  ignoreReqs: any
): void;
declare var SpellTiers: any;
declare var ArchaicSpellTypeID: any;
declare class RuneMenu {
  container: HTMLElement;
  runes: Map<any, any>;
  highlighted: Set<any>;
  init(): void;
  createMenuElement(item: any): {
    tooltip: any;
    count: any;
    border: any;
  };
  createTooltip(image: any, item: any): any;
  updateCounts(): void;
  updateHighlights(spellSelection: any, useAltRunes: any): void;
  addBordersForSpell(spell: any, useAltRunes: any): void;
  removeBorder(item: any): void;
  addBorder(item: any): void;
}
declare class SpellMenu {
  spellElements: Map<any, any>;
  updateForUnlock(level: any, player: any, ignoreReqs: any): void;
  setMenuCallbacks(player: any): void;
  setSelection(spell: any): void;
  selection: any;
  createMenu(): void;
  createSpell(spell: any): any;
  createTooltip(element: any, tooltipHTML: any): any;
  getLockedTooltipHTML(
    spell: any,
    player: any,
    magicLevel: any,
    ignoreReqs: any
  ): string;
  getRuneHTML(spell: any): any;
  getRuneCostHTML(costs: any): any;
  getUnlockHTML(
    spell: any,
    player: any,
    magicLevel: any,
    ignoreReqs: any
  ): string;
  itemRequirement(spell: any, player: any): any;
  checkUnlocked(spell: any, level: any, player: any, ignoreReqs: any): any;
}
declare class StandardSpellMenu extends SpellMenu {
  menuContainer: HTMLElement;
  selectButton: HTMLElement;
  bookData: {
    readonly name: any;
    readonly description: any;
  };
  book: any;
  getMenuCallback(spell: any, player: any): () => any;
  getTooltipHTML(spell: any): string;
}
declare class CurseSpellMenu extends SpellMenu {
  menuContainer: HTMLElement;
  selectButton: HTMLElement;
  bookData: {
    readonly name: any;
    readonly description: any;
  };
  book: any;
  getMenuCallback(spell: any, player: any): () => any;
  getTooltipHTML(curse: any): string;
}
declare class AuroraSpellMenu extends SpellMenu {
  menuContainer: HTMLElement;
  selectButton: HTMLElement;
  bookData: {
    readonly name: any;
    readonly description: any;
  };
  book: any;
  getMenuCallback(spell: any, player: any): () => any;
  getTooltipHTML(aurora: any): string;
}
declare class AncientSpellMenu extends SpellMenu {
  menuContainer: HTMLElement;
  selectButton: HTMLElement;
  bookData: {
    readonly name: any;
    readonly description: any;
  };
  book: any;
  getMenuCallback(spell: any, player: any): () => any;
  getTooltipHTML(ancient: any): string;
}
declare class ArchaicSpellMenu extends SpellMenu {
  menuContainer: HTMLElement;
  selectButton: HTMLElement;
  bookData: {
    readonly name: any;
    readonly description: any;
  };
  book: any;
  getMenuCallback(spell: any, player: any): () => any;
  getTooltipHTML(spell: any): string;
}
