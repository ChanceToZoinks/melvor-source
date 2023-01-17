declare class NamespaceMap {
  static isValidName(name: any): boolean;
  static isValidModdedName(name: any): boolean;
  registeredNamespaces: Map<any, any>;
  hasNamespace(name: any): boolean;
  getNamespace(name: any): any;
  registerNamespace(
    name: any,
    displayName: any,
    isModded: any
  ): {
    name: any;
    displayName: any;
    isModded: any;
  };
  forEach(callbackfn: any): void;
}
declare class NamespacedObject {
  static isValidLocalID(localID: any): boolean;
  constructor(_namespace: any, localID: any);
  _namespace: any;
  _localID: any;
  get namespace(): any;
  get id(): string;
  get localID(): any;
  get isModded(): any;
  getMediaURL(media: any): any;
}
declare class NamespaceRegistry {
  constructor(rootNamespaceMap: any);
  rootNamespaceMap: any;
  namespaceMaps: Map<any, any>;
  registeredObjects: Map<any, any>;
  dummyObjects: Map<any, any>;
  namespaceChanges: Map<any, any>;
  get size(): number;
  get dummySize(): number;
  get allObjects(): any[];
  get firstObject(): any;
  registerObject(object: any): void;
  registerNamespaceChange(oldNamespace: any, data: any): void;
  getObject(namespace: any, id: any): any;
  getObjectByID(id: any): any;
  getDummyObject(id: any, DummyObject: any, game: any): any;
  forEach(callbackfn: any): void;
  forEachDummy(callbackfn: any): void;
  find(predicate: any): any;
  filter(predicate: any): any[];
  every(predicate: any): boolean;
  some(predicate: any): boolean;
  reduce(callbackfn: any, initialValue: any): any;
  getSetForConstructor(
    ids: any,
    objectBeingConstructed: any,
    unregisteredName: any
  ): Set<any>;
  getQuantity(quantity: any): {
    item: any;
    quantity: any;
  };
  getQuantities(quantities: any): any;
  hasObjectInNamespace(namespace: any): boolean;
}
declare class ItemRegistry extends NamespaceRegistry {
  equipment: NamespaceRegistry;
  weapons: NamespaceRegistry;
  food: NamespaceRegistry;
  bones: NamespaceRegistry;
  potions: NamespaceRegistry;
  readables: NamespaceRegistry;
  openables: NamespaceRegistry;
  tokens: NamespaceRegistry;
  composts: NamespaceRegistry;
}
declare class NamespacedArray extends Array<any> {
  constructor(registery: any, ...items: any[]);
  registery: any;
  registerData(insertions: any): void;
}
