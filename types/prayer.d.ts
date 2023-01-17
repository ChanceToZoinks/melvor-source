declare class ActivePrayer extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  level: any;
  _media: any;
  _name: any;
  pointsPerPlayer: any;
  pointsPerEnemy: any;
  pointsPerRegen: any;
  modifiers: any;
  enemyModifiers: any;
  get media(): any;
  get name(): any;
}
declare class PrayerMenu {
  menuContainer: HTMLElement;
  activeContainer: HTMLElement;
  menus: Map<any, any>;
  activeMenu: any[];
  createMenu(): void;
  createActiveMenu(): void;
  updateForLevel(level: any, player: any): void;
  setEnabled(button: any): void;
  setDisabled(button: any): void;
  setActive(active: any, player: any): void;
  setMenuCallbacks(player: any): void;
  createActivePrayer(): any;
  createMenuPrayer(prayer: any): any;
  createTooltip(parent: any, tooltipHTML: any): any;
  getLockedTooltipHTML(prayer: any): string;
  getUnlockedTooltipHTML(prayer: any): string;
}
