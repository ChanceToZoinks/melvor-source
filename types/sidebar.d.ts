declare function openSidebarLink(e: any): boolean;
declare class Sidebar {
  constructor(rootSelector: any);
  rootSelector: any;
  rendered: boolean;
  categories: Map<any, any>;
  categoriesOrder: any[];
  get isRendered(): boolean;
  render(): void;
  rootEl: any;
  getCategory(id: any): any;
  getAllCategories(): any[];
  addCategory(id: any, config: any): SidebarCategory;
  removeCategory(id: any): void;
  removeAllCategories(): void;
  configureCategory(id: any, config: any): void;
  orderCategory(id: any, config: any): void;
  renderCategories(): void;
}
declare class SidebarCategory {
  constructor(id: any, config?: {});
  id: any;
  config: {};
  rendered: boolean;
  expanded: boolean;
  items: Map<any, any>;
  itemsOrder: any[];
  get isRendered(): boolean;
  configure(config: any): void;
  render(): void;
  rootEl: any;
  categoryEl: any;
  nameEl: any;
  toggle(force: any): void;
  click(): void;
  getItem(id: any): any;
  getAllItems(): any[];
  addItem(id: any, config: any): SidebarItem;
  removeItem(id: any): void;
  removeAllItems(): void;
  configureItem(id: any, config: any): void;
  orderItem(id: any, config: any): void;
  renderItems(): void;
  update(config: any, initialRender?: boolean): void;
  updateRootEl(config: any, initialRender?: boolean): void;
  updateCategoryEl(config: any, initialRender?: boolean): void;
  updateNameEl(config: any, initialRender?: boolean): void;
  updateToggle(config: any): void;
  toggleEl: any;
}
declare class SidebarItem {
  constructor(id: any, config?: {});
  id: any;
  config: {};
  rendered: boolean;
  expanded: boolean;
  subitems: Map<any, any>;
  subitemsOrder: any[];
  get isRendered(): boolean;
  get ignoreToggle(): boolean;
  configure(config: any): void;
  render(): void;
  rootEl: any;
  itemEl: any;
  iconEl: any;
  nameEl: any;
  toggle(force: any): void;
  click(): void;
  getSubitem(id: any): any;
  getAllSubitems(): any[];
  addSubitem(id: any, config: any): SidebarSubitem;
  removeSubitem(id: any, removingAll?: boolean): void;
  removeAllSubitems(): void;
  configureSubitem(id: any, config: any): void;
  orderSubitem(id: any, config: any): void;
  renderSubitems(): void;
  subMenuEl: any;
  update(config: any, initialRender?: boolean): void;
  updateRoot(config: any, initialRender?: boolean): void;
  updateItem(config: any, initialRender?: boolean): void;
  updateIcon(config: any, initialRender?: boolean): void;
  updateName(config: any, initialRender?: boolean): void;
  updateAside(config: any, initialRender?: boolean): void;
  asideEl: any;
}
declare class SidebarSubitem {
  constructor(id: any, config?: {});
  id: any;
  config: {};
  rendered: boolean;
  get isRendered(): boolean;
  configure(config: any): void;
  render(): void;
  rootEl: any;
  subitemEl: any;
  nameEl: any;
  click(): void;
  update(config: any, initialRender?: boolean): void;
  updateRoot(config: any, initialRender?: boolean): void;
  updateSubitem(config: any, initialRender?: boolean): void;
  updateName(config: any, initialRender?: boolean): void;
  updateAside(config: any, initialRender?: boolean): void;
  asideEl: any;
}
declare namespace sidebar {
  function category(
    id: any,
    config: any,
    builder: any
  ): {
    readonly id: any;
    readonly rootEl: any;
    readonly categoryEl: any;
    readonly nameEl: any;
    readonly toggleEl: any;
    click(): void;
    toggle(force: any): void;
    item(
      id: any,
      config: any,
      builder: any
    ): {
      readonly id: any;
      readonly rootEl: any;
      readonly itemEl: any;
      readonly iconEl: any;
      readonly nameEl: any;
      readonly asideEl: any;
      readonly subMenuEl: any;
      click(): void;
      toggle(force: any): void;
      subitem(
        id: any,
        config: any,
        builder: any
      ): {
        readonly id: any;
        readonly rootEl: any;
        readonly subitemEl: any;
        readonly nameEl: any;
        readonly asideEl: any;
        click(): void;
        remove(): void;
        item: any;
      };
      subitems(): any;
      remove(): void;
      removeSubitem(id: any): void;
      removeAllSubitems(): void;
      category: any;
    };
    items(): any;
    remove(): void;
    removeItem(id: any): void;
    removeAllItems(): void;
  };
  function categories(): {
    readonly id: any;
    readonly rootEl: any;
    readonly categoryEl: any;
    readonly nameEl: any;
    readonly toggleEl: any;
    click(): void;
    toggle(force: any): void;
    item(
      id: any,
      config: any,
      builder: any
    ): {
      readonly id: any;
      readonly rootEl: any;
      readonly itemEl: any;
      readonly iconEl: any;
      readonly nameEl: any;
      readonly asideEl: any;
      readonly subMenuEl: any;
      click(): void;
      toggle(force: any): void;
      subitem(
        id: any,
        config: any,
        builder: any
      ): {
        readonly id: any;
        readonly rootEl: any;
        readonly subitemEl: any;
        readonly nameEl: any;
        readonly asideEl: any;
        click(): void;
        remove(): void;
        item: any;
      };
      subitems(): any;
      remove(): void;
      removeSubitem(id: any): void;
      removeAllSubitems(): void;
      category: any;
    };
    items(): any;
    remove(): void;
    removeItem(id: any): void;
    removeAllItems(): void;
  }[];
  function removeCategory(id: any): void;
  function removeAllCategories(): void;
  function render(): void;
}
