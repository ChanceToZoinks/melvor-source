"use strict";
class NamespaceMap {
  constructor() {
    this.registeredNamespaces = new Map();
  }
  hasNamespace(name) {
    return this.registeredNamespaces.has(name);
  }
  getNamespace(name) {
    return this.registeredNamespaces.get(name);
  }
  registerNamespace(name, displayName, isModded) {
    if (isModded) {
      if (!NamespaceMap.isValidModdedName(name))
        throw new Error(
          `Error trying to register modded namespace. Name: "${name}" is invalid.`
        );
    } else {
      if (!NamespaceMap.isValidName(name))
        throw new Error(
          `Error trying to regsiter game namespace. Name: "${name}" is invalid.`
        );
    }
    if (this.hasNamespace(name))
      throw new Error(
        `Tried to register namespace: "${name}", but it already exists`
      );
    const newNamespace = { name, displayName, isModded };
    this.registeredNamespaces.set(name, newNamespace);
    return newNamespace;
  }
  forEach(callbackfn) {
    this.registeredNamespaces.forEach((namespace) => callbackfn(namespace));
  }
  static isValidName(name) {
    return /^melvor[\w]+$/.test(name);
  }
  static isValidModdedName(name) {
    return /^(?!melvor)[\w]+$/.test(name);
  }
}
class NamespacedObject {
  constructor(_namespace, localID) {
    this._namespace = _namespace;
    if (!NamespacedObject.isValidLocalID(localID))
      throw new Error(
        `Error constructing ${NamespacedObject.name}. Local ID "${localID}" is invalid.`
      );
    this._localID = localID;
  }
  get namespace() {
    return this._namespace.name;
  }
  get id() {
    return `${this._namespace.name}:${this._localID}`;
  }
  get localID() {
    return this._localID;
  }
  get isModded() {
    return this._namespace.isModded;
  }
  getMediaURL(media) {
    if (this._namespace.isModded) {
      return mod.getContext(this._namespace.name).getResourceUrl(media);
    } else {
      return cdnMedia(media);
    }
  }
  static isValidLocalID(localID) {
    return /^[\w]+$/.test(localID);
  }
}
class NamespaceRegistry {
  constructor(rootNamespaceMap) {
    this.rootNamespaceMap = rootNamespaceMap;
    this.namespaceMaps = new Map();
    this.registeredObjects = new Map();
    this.dummyObjects = new Map();
    this.namespaceChanges = new Map();
  }
  get size() {
    return this.registeredObjects.size;
  }
  get dummySize() {
    return this.dummyObjects.size;
  }
  get allObjects() {
    return [...this.registeredObjects.values()];
  }
  get firstObject() {
    const [first] = this.registeredObjects.values();
    return first;
  }
  registerObject(object) {
    if (!this.rootNamespaceMap.hasNamespace(object.namespace))
      throw new Error(
        `Tried to register object with namespace: ${object.namespace}, but namespace does not exist.`
      );
    let nameMap = this.namespaceMaps.get(object.namespace);
    if (nameMap === undefined) {
      nameMap = new Map();
      this.namespaceMaps.set(object.namespace, nameMap);
    }
    if (nameMap.has(object.localID))
      throw new Error(
        `Tried to register object with id: ${object.localID} and namespace: ${object.namespace}, but object with that id is already registered.`
      );
    nameMap.set(object.localID, object);
    this.registeredObjects.set(`${object.namespace}:${object.localID}`, object);
  }
  registerNamespaceChange(oldNamespace, data) {
    var _a;
    const changes =
      (_a = this.namespaceChanges.get(oldNamespace.name)) !== null &&
      _a !== void 0
        ? _a
        : new Map();
    data.forEach((data) => {
      data.ids.forEach((id) => {
        changes.set(id, data.newNamespace);
      });
    });
    this.namespaceChanges.set(oldNamespace.name, changes);
  }
  getObject(namespace, id) {
    var _a;
    return (_a = this.namespaceMaps.get(namespace)) === null || _a === void 0
      ? void 0
      : _a.get(id);
  }
  getObjectByID(id) {
    return this.registeredObjects.get(id);
  }
  getDummyObject(id, DummyObject, game) {
    var _a;
    let dummyObject = this.dummyObjects.get(id);
    if (dummyObject === undefined) {
      const dummyData = game.getDummyData(id);
      const newNamespace =
        (_a = this.namespaceChanges.get(dummyData.dataNamespace.name)) ===
          null || _a === void 0
          ? void 0
          : _a.get(dummyData.localID);
      const newObject = this.getObjectByID(
        `${newNamespace}:${dummyData.localID}`
      );
      if (newObject !== undefined) return newObject;
      dummyObject = new DummyObject(
        dummyData.dataNamespace,
        dummyData.localID,
        game
      );
      this.dummyObjects.set(id, dummyObject);
    }
    return dummyObject;
  }
  forEach(callbackfn) {
    this.registeredObjects.forEach(callbackfn);
  }
  forEachDummy(callbackfn) {
    this.dummyObjects.forEach(callbackfn);
  }
  find(predicate) {
    for (const [id, value] of this.registeredObjects) {
      if (predicate(value, id, this.registeredObjects)) return value;
    }
    return undefined;
  }
  filter(predicate) {
    const results = [];
    this.forEach((value, key, map) => {
      if (predicate(value, key, map)) {
        results.push(value);
      }
    });
    return results;
  }
  every(predicate) {
    for (const [id, value] of this.registeredObjects) {
      if (predicate(value, id, this.registeredObjects)) continue;
      return false;
    }
    return true;
  }
  some(predicate) {
    for (const [id, value] of this.registeredObjects) {
      if (predicate(value, id, this.registeredObjects)) return true;
    }
    return false;
  }
  reduce(callbackfn, initialValue) {
    for (const [id, value] of this.registeredObjects) {
      initialValue = callbackfn(
        initialValue,
        value,
        id,
        this.registeredObjects
      );
    }
    return initialValue;
  }
  getSetForConstructor(ids, objectBeingConstructed, unregisteredName) {
    return new Set(
      ids.map((id) => {
        const object = this.registeredObjects.get(id);
        if (object === undefined)
          throw new UnregisteredConstructionError(
            objectBeingConstructed,
            unregisteredName,
            id
          );
        return object;
      })
    );
  }
  getQuantity(quantity) {
    const item = this.getObjectByID(quantity.id);
    if (item === undefined)
      throw new Error(
        `Error getting quantity. Object with id: ${quantity.id} is not registered.`
      );
    return { item, quantity: quantity.quantity };
  }
  getQuantities(quantities) {
    return quantities.map((quantity) => this.getQuantity(quantity));
  }
  hasObjectInNamespace(namespace) {
    return this.namespaceMaps.has(namespace);
  }
}
class ItemRegistry extends NamespaceRegistry {
  constructor(rootNamespaceMap) {
    super(rootNamespaceMap);
    this.equipment = new NamespaceRegistry(this.rootNamespaceMap);
    this.weapons = new NamespaceRegistry(this.rootNamespaceMap);
    this.food = new NamespaceRegistry(this.rootNamespaceMap);
    this.bones = new NamespaceRegistry(this.rootNamespaceMap);
    this.potions = new NamespaceRegistry(this.rootNamespaceMap);
    this.readables = new NamespaceRegistry(this.rootNamespaceMap);
    this.openables = new NamespaceRegistry(this.rootNamespaceMap);
    this.tokens = new NamespaceRegistry(this.rootNamespaceMap);
    this.composts = new NamespaceRegistry(this.rootNamespaceMap);
  }
  registerObject(object) {
    super.registerObject(object);
    if (object instanceof WeaponItem) {
      this.weapons.registerObject(object);
    }
    if (object instanceof EquipmentItem) {
      this.equipment.registerObject(object);
    }
    if (object instanceof FoodItem) {
      this.food.registerObject(object);
    }
    if (object instanceof BoneItem) {
      this.bones.registerObject(object);
    }
    if (object instanceof PotionItem) {
      this.potions.registerObject(object);
    }
    if (object instanceof ReadableItem) {
      this.readables.registerObject(object);
    }
    if (object instanceof OpenableItem) {
      this.openables.registerObject(object);
    }
    if (object instanceof TokenItem) {
      this.tokens.registerObject(object);
    }
    if (object instanceof CompostItem) {
      this.composts.registerObject(object);
    }
  }
  registerNamespaceChange(oldNamespace, data) {
    super.registerNamespaceChange(oldNamespace, data);
    data.forEach((data) => {
      switch (data.itemType) {
        case "Weapon":
          this.weapons.registerNamespaceChange(oldNamespace, [data]);
        case "Equipment":
          this.equipment.registerNamespaceChange(oldNamespace, [data]);
          break;
        case "Food":
          this.food.registerNamespaceChange(oldNamespace, [data]);
          break;
        case "Bone":
          this.bones.registerNamespaceChange(oldNamespace, [data]);
          break;
        case "Potion":
          this.potions.registerNamespaceChange(oldNamespace, [data]);
          break;
        case "Readable":
          this.readables.registerNamespaceChange(oldNamespace, [data]);
          break;
        case "Openable":
          this.openables.registerNamespaceChange(oldNamespace, [data]);
          break;
        case "Token":
          this.tokens.registerNamespaceChange(oldNamespace, [data]);
          break;
        case "Compost":
          this.composts.registerNamespaceChange(oldNamespace, [data]);
          break;
      }
    });
  }
}
class NamespacedArray extends Array {
  constructor(registery, ...items) {
    super(...items);
    this.registery = registery;
  }
  registerData(insertions) {
    insertions.forEach((order) => {
      const objectsToInsert = order.ids.map((id) => {
        const object = this.registery.getObjectByID(id);
        if (object === undefined)
          throw new Error(`Error: Unregistered object with id: ${id}.`);
        return object;
      });
      switch (order.insertAt) {
        case "Start":
          this.splice(0, 0, ...objectsToInsert);
          break;
        case "End":
          this.push(...objectsToInsert);
          break;
        case "Before":
          {
            const beforeItem = this.registery.getObjectByID(order.beforeID);
            if (beforeItem === undefined)
              throw new Error(
                `Error: Unregistered object with id: ${order.beforeID}.`
              );
            const beforeIndex = this.findIndex((item) => item === beforeItem);
            if (beforeIndex === -1)
              throw new Error(
                `Error inserting before. Object with id: ${order.beforeID} is not in array.`
              );
            this.splice(beforeIndex, 0, ...objectsToInsert);
          }
          break;
        case "After":
          {
            const afterItem = this.registery.getObjectByID(order.afterID);
            if (afterItem === undefined)
              throw new Error(
                `Error: Unregistered object with id: ${order.afterID}.`
              );
            const afterIndex = this.findIndex((item) => item === afterItem);
            if (afterIndex === -1)
              throw new Error(
                `Error inserting after. Object with id: ${order.afterID} is not in array.`
              );
            this.splice(afterIndex + 1, 0, ...objectsToInsert);
          }
          break;
      }
    });
  }
}
