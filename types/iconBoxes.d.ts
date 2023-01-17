declare class IconBox extends ContainedComponent {
  constructor(
    parent: any,
    smallName: any,
    containerClasses?: any[],
    iconContClasses?: any[]
  );
  icons: any[];
  container: any;
  name: any;
  iconContainer: any;
  dash: any;
  destroyIcons(): void;
  addIcon(icon: any): void;
  setName(name: any): void;
  localize(): void;
  setSelected(): void;
  setUnselected(): void;
}
declare class RequiresBox extends IconBox {
  constructor(
    parent: any,
    smallName: any,
    containerClasses?: any[],
    iconContClasses?: any[],
    size?: number,
    titleLangID?: string
  );
  size: number;
  titleLangID: string;
  setItems(items: any, gp?: number, sc?: number, altMedia?: boolean): void;
  setItemsFromRecipe(recipe: any, altMedia?: boolean): void;
}
declare class HavesBox extends IconBox {
  constructor(
    parent: any,
    smallName: any,
    containerClasses?: any[],
    iconContClasses?: any[],
    size?: number,
    titleLangID?: string
  );
  size: number;
  titleLangID: string;
  updateQuantities(): void;
  setItems(items: any, gp?: number, sc?: number, altMedia?: boolean): void;
  setItemsFromRecipe(recipe: any, altMedia?: boolean): void;
}
declare class ProducesBox extends IconBox {
  size: number;
  setItems(items: any, gp?: number, sc?: number): void;
}
declare class GrantsBox extends IconBox {
  constructor(
    parent: any,
    smallName: any,
    containerClasses?: any[],
    size?: number,
    iconContClasses?: any[]
  );
  xpIcon: XPIcon;
  masteryXPIcon: MasteryXPIcon;
  masteryPoolIcon: MasteryPoolIcon;
  updateGrants(xp: any, masteryXP: any, poolXP: any): void;
  hideMastery(): void;
}
declare class CookingBonusBox extends IconBox {
  constructor(parent: any, smallName: any, containerClasses?: any[]);
  preserve: PreservationIcon;
  double: DoublingIcon;
  perfect: PerfectCookIcon;
  success: CookingSuccessIcon;
  setChances(preserve: any, double: any, perfect: any, success: any): void;
}
