declare class Page extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  _customName: any;
  _media: any;
  containerID: any;
  headerBgClass: any;
  hasGameGuide: any;
  canBeDefault: any;
  skills: any;
  action: any;
  skillSidebarCategoryID: any;
  sidebarItem: any;
  sidebarSubItems: any;
  get name(): any;
  get media(): any;
  generateSideBar(): void;
}
