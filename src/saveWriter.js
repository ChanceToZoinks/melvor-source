"use strict";
class BinaryWriter {
  constructor(mode, dataExtensionLength) {
    this.mode = mode;
    this.dataExtensionLength = dataExtensionLength;
    this.stringEncoder = new TextEncoder();
    this.stringDecoder = new TextDecoder();
    this.byteOffset = 0;
    this.markRegionOffset = -1;
    this._data = new ArrayBuffer(this.dataExtensionLength);
    this.dataView = new DataView(this._data);
    this.uint8View = new Uint8Array(this._data);
  }
  set data(newData) {
    this._data = newData;
    this.dataView = new DataView(newData);
    this.uint8View = new Uint8Array(newData);
  }
  get data() {
    return this._data;
  }
  get remainingBytes() {
    return this._data.byteLength - this.byteOffset;
  }
  checkDataSize(bytes) {
    if (this.remainingBytes < bytes) {
      const extensionsRequired =
        Math.ceil((this.byteOffset + bytes) / this.dataExtensionLength) -
        this._data.byteLength / this.dataExtensionLength;
      const newBuffer = new ArrayBuffer(
        this._data.byteLength + extensionsRequired * this.dataExtensionLength
      );
      new Uint8Array(newBuffer).set(new Uint8Array(this._data));
      this.data = newBuffer;
    }
  }
  checkWriteAccess() {
    if (this.mode !== "Write") throw new Error("Writer is set to read only.");
  }
  checkReadAccess() {
    if (this.mode !== "Read") throw new Error("Writer is set to write only.");
  }
  startMarkingWriteRegion() {
    this.checkWriteAccess();
    if (this.markRegionOffset !== -1)
      throw new Error(`Region is already being marked.`);
    this.markRegionOffset = this.byteOffset;
    this.writeUint32(0);
  }
  stopMarkingWriteRegion() {
    this.checkWriteAccess();
    const regionSize =
      this.byteOffset - this.markRegionOffset - Uint32Array.BYTES_PER_ELEMENT;
    this.dataView.setUint32(this.markRegionOffset, regionSize);
    this.markRegionOffset = -1;
  }
  getBigInt64() {
    this.checkReadAccess();
    const int = this.dataView.getBigInt64(this.byteOffset);
    this.byteOffset += BigInt64Array.BYTES_PER_ELEMENT;
    return int;
  }
  getBigUint64() {
    this.checkReadAccess();
    const int = this.dataView.getBigUint64(this.byteOffset);
    this.byteOffset += BigUint64Array.BYTES_PER_ELEMENT;
    return int;
  }
  getFloat32() {
    this.checkReadAccess();
    const value = this.dataView.getFloat32(this.byteOffset);
    this.byteOffset += Float32Array.BYTES_PER_ELEMENT;
    return value;
  }
  getFloat64() {
    this.checkReadAccess();
    const value = this.dataView.getFloat64(this.byteOffset);
    this.byteOffset += Float64Array.BYTES_PER_ELEMENT;
    return value;
  }
  getInt8() {
    this.checkReadAccess();
    const value = this.dataView.getInt8(this.byteOffset);
    this.byteOffset += Int8Array.BYTES_PER_ELEMENT;
    return value;
  }
  getInt16() {
    this.checkReadAccess();
    const value = this.dataView.getInt16(this.byteOffset);
    this.byteOffset += Int16Array.BYTES_PER_ELEMENT;
    return value;
  }
  getInt32() {
    this.checkReadAccess();
    const value = this.dataView.getInt32(this.byteOffset);
    this.byteOffset += Int32Array.BYTES_PER_ELEMENT;
    return value;
  }
  getUint8() {
    this.checkReadAccess();
    const value = this.dataView.getUint8(this.byteOffset);
    this.byteOffset += Uint8Array.BYTES_PER_ELEMENT;
    return value;
  }
  getUint16() {
    this.checkReadAccess();
    const value = this.dataView.getUint16(this.byteOffset);
    this.byteOffset += Uint16Array.BYTES_PER_ELEMENT;
    return value;
  }
  getUint32() {
    this.checkReadAccess();
    const value = this.dataView.getUint32(this.byteOffset);
    this.byteOffset += Uint32Array.BYTES_PER_ELEMENT;
    return value;
  }
  getString() {
    this.checkReadAccess();
    const stringLength = this.getUint32();
    const encodedString = this.uint8View.slice(
      this.byteOffset,
      this.byteOffset + stringLength
    );
    const string = this.stringDecoder.decode(encodedString);
    this.byteOffset += stringLength;
    return string;
  }
  getBoolean() {
    this.checkReadAccess();
    return this.getUint8() === 1;
  }
  getArray(decodeArray) {
    this.checkReadAccess();
    const arrayLength = this.getUint32();
    const array = [];
    for (let i = 0; i < arrayLength; i++) {
      const newElement = decodeArray(this);
      if (newElement !== undefined) array.push(newElement);
    }
    return array;
  }
  getMap(decodeKey, decodeValue) {
    this.checkReadAccess();
    const map = new Map();
    const mapSize = this.getUint32();
    for (let i = 0; i < mapSize; i++) {
      const key = decodeKey(this);
      const value = decodeValue(this, key);
      if (key !== undefined && value !== undefined) map.set(key, value);
    }
    return map;
  }
  getComplexMap(decode) {
    this.checkReadAccess();
    const map = new Map();
    const mapSize = this.getUint32();
    for (let i = 0; i < mapSize; i++) {
      const keyValuePair = decode(this);
      if (keyValuePair !== undefined)
        map.set(keyValuePair.key, keyValuePair.value);
    }
    return map;
  }
  getSet(decodeValue) {
    this.checkReadAccess();
    const set = new Set();
    const setSize = this.getUint32();
    for (let i = 0; i < setSize; i++) {
      const newValue = decodeValue(this);
      if (newValue !== undefined) set.add(newValue);
    }
    return set;
  }
  getBuffer() {
    this.checkReadAccess();
    const bufferByteLength = this.getUint32();
    const buffer = this._data.slice(
      this.byteOffset,
      this.byteOffset + bufferByteLength
    );
    this.byteOffset += bufferByteLength;
    return buffer;
  }
  getFixedLengthBuffer(length) {
    this.checkReadAccess();
    const buffer = this._data.slice(this.byteOffset, this.byteOffset + length);
    this.byteOffset += length;
    return buffer;
  }
  writeBigInt64(value) {
    this.checkWriteAccess();
    this.checkDataSize(BigInt64Array.BYTES_PER_ELEMENT);
    this.dataView.setBigInt64(this.byteOffset, value);
    this.byteOffset += BigInt64Array.BYTES_PER_ELEMENT;
  }
  writeBigUInt64(value) {
    this.checkWriteAccess();
    this.checkDataSize(BigUint64Array.BYTES_PER_ELEMENT);
    this.dataView.setBigUint64(this.byteOffset, value);
    this.byteOffset += BigUint64Array.BYTES_PER_ELEMENT;
  }
  writeFloat32(value) {
    this.checkWriteAccess();
    this.checkDataSize(Float32Array.BYTES_PER_ELEMENT);
    this.dataView.setFloat32(this.byteOffset, value);
    this.byteOffset += Float32Array.BYTES_PER_ELEMENT;
  }
  writeFloat64(value) {
    this.checkWriteAccess();
    this.checkDataSize(Float64Array.BYTES_PER_ELEMENT);
    this.dataView.setFloat64(this.byteOffset, value);
    this.byteOffset += Float64Array.BYTES_PER_ELEMENT;
  }
  writeInt8(value) {
    this.checkWriteAccess();
    this.checkDataSize(Int8Array.BYTES_PER_ELEMENT);
    this.dataView.setInt8(this.byteOffset, value);
    this.byteOffset += Int8Array.BYTES_PER_ELEMENT;
  }
  writeInt16(value) {
    this.checkWriteAccess();
    this.checkDataSize(Int16Array.BYTES_PER_ELEMENT);
    this.dataView.setInt16(this.byteOffset, value);
    this.byteOffset += Int16Array.BYTES_PER_ELEMENT;
  }
  writeInt32(value) {
    this.checkWriteAccess();
    this.checkDataSize(Int32Array.BYTES_PER_ELEMENT);
    this.dataView.setInt32(this.byteOffset, value);
    this.byteOffset += Int32Array.BYTES_PER_ELEMENT;
  }
  writeUint8(value) {
    this.checkWriteAccess();
    this.checkDataSize(Uint8Array.BYTES_PER_ELEMENT);
    this.dataView.setUint8(this.byteOffset, value);
    this.byteOffset += Uint8Array.BYTES_PER_ELEMENT;
  }
  writeUint16(value) {
    this.checkWriteAccess();
    this.checkDataSize(Uint16Array.BYTES_PER_ELEMENT);
    this.dataView.setUint16(this.byteOffset, value);
    this.byteOffset += Uint16Array.BYTES_PER_ELEMENT;
  }
  writeUint32(value) {
    this.checkWriteAccess();
    this.checkDataSize(Uint32Array.BYTES_PER_ELEMENT);
    this.dataView.setUint32(this.byteOffset, value);
    this.byteOffset += Uint32Array.BYTES_PER_ELEMENT;
  }
  writeString(value) {
    this.checkWriteAccess();
    const encodedString = this.stringEncoder.encode(value);
    if (encodedString.byteLength > BinaryWriter.Uint32Max) {
      throw new Error(
        `Tried to write string but length exceeds: ${BinaryWriter.Uint32Max}`
      );
    }
    this.writeUint32(encodedString.byteLength);
    this.checkDataSize(encodedString.byteLength);
    this.uint8View.set(encodedString, this.byteOffset);
    this.byteOffset += encodedString.byteLength;
  }
  writeBoolean(value) {
    this.checkWriteAccess();
    this.writeUint8(value ? 1 : 0);
  }
  writeArray(array, encodeArray) {
    this.checkWriteAccess();
    if (array.length > BinaryWriter.Uint32Max) {
      throw new Error(
        `Tried to write array but length exceeds: ${BinaryWriter.Uint32Max}`
      );
    }
    this.writeUint32(array.length);
    array.forEach((value) => encodeArray(value, this));
  }
  writeMap(map, encodeKey, encodeValue) {
    this.checkWriteAccess();
    if (map.size > BinaryWriter.Uint32Max) {
      throw new Error(
        `Tried to write map, but size exceeds: ${BinaryWriter.Uint32Max}`
      );
    }
    this.writeUint32(map.size);
    map.forEach((value, key) => {
      encodeKey(key, this, value);
      encodeValue(value, this, key);
    });
  }
  writeComplexMap(map, encode) {
    this.checkWriteAccess();
    if (map.size > BinaryWriter.Uint32Max) {
      throw new Error(
        `Tried to write map, but size exceeds: ${BinaryWriter.Uint32Max}`
      );
    }
    this.writeUint32(map.size);
    map.forEach((value, key) => {
      encode(key, value, this);
    });
  }
  writeSet(set, encodeValue) {
    this.checkWriteAccess();
    if (set.size > BinaryWriter.Uint32Max) {
      throw new Error(
        `Tried to write set, but size exceeds: ${BinaryWriter.Uint32Max}`
      );
    }
    this.writeUint32(set.size);
    set.forEach((value) => {
      encodeValue(value, this);
    });
  }
  writeBuffer(buffer) {
    this.checkWriteAccess();
    if (buffer.byteLength > BinaryWriter.Uint32Max) {
      throw new Error(
        `Tried to write buffer, but byteLength exceeds: ${BinaryWriter.Uint32Max}`
      );
    }
    this.writeUint32(buffer.byteLength);
    this.checkDataSize(buffer.byteLength);
    this.uint8View.set(new Uint8Array(buffer), this.byteOffset);
    this.byteOffset += buffer.byteLength;
  }
  writeFixedLengthBuffer(buffer, length) {
    this.checkWriteAccess();
    if (buffer.byteLength !== length)
      throw new Error(
        `Tried to write fixed length buffer, but byteLength does not match specified`
      );
    this.checkDataSize(length);
    this.uint8View.set(new Uint8Array(buffer), this.byteOffset);
    this.byteOffset += length;
  }
  getRawData() {
    this.checkWriteAccess();
    return this._data.slice(0, this.byteOffset);
  }
  setRawData(data) {
    this.checkReadAccess();
    this.data = data;
  }
}
BinaryWriter.Uint32Max = 4294967295;
class SaveWriter extends BinaryWriter {
  constructor(mode, dataExtensionLength) {
    super(mode, dataExtensionLength);
    this.namespaceMap = new Map();
    this.nextNumericID = 0;
    this.numericToStringIDMap = new Map();
    this.header = new BinaryWriter(mode, dataExtensionLength);
  }
  writeNamespacedObject(object) {
    let nameMap = this.namespaceMap.get(object.namespace);
    if (nameMap === undefined) {
      nameMap = new Map();
      this.namespaceMap.set(object.namespace, nameMap);
    }
    let numericID = nameMap.get(object.localID);
    if (numericID === undefined) {
      numericID = this.nextNumericID;
      this.nextNumericID++;
      nameMap.set(object.localID, numericID);
    }
    this.writeUint16(numericID);
  }
  getNamespacedObject(registry) {
    const numericID = this.getUint16();
    const id = this.numericToStringIDMap.get(numericID);
    if (id === undefined)
      throw new Error(
        "Error getting namespaced object, no namespaced id exists for numeric ID"
      );
    const object = registry.getObjectByID(id);
    if (object === undefined) return id;
    return object;
  }
  writeCombatModifierArray(modifiers) {
    this.writeArray(modifiers, (modifierElement, writer) => {
      writer.writeUint16(ModifierID[modifierElement.key]);
      writer.writeFloat64(modifierElement.value);
    });
  }
  writeModifierArray(modifiers) {
    this.writeArray(modifiers, (modifierElement, writer) => {
      writer.writeUint16(ModifierID[modifierElement.key]);
      if ("values" in modifierElement) {
        writer.writeArray(modifierElement.values, (skillModifier, writer) => {
          writer.writeNamespacedObject(skillModifier.skill);
          writer.writeFloat64(skillModifier.value);
        });
      } else {
        writer.writeFloat64(modifierElement.value);
      }
    });
  }
  getCombatModifierArray() {
    return this.getArray((reader) => {
      return {
        key: ModifierID[reader.getUint16()],
        value: reader.getFloat64(),
      };
    });
  }
  getModifierArray(game) {
    return this.getArray((reader) => {
      const modifierKey = ModifierID[this.getUint16()];
      if (isSkillKey(modifierKey)) {
        return {
          key: modifierKey,
          values: reader.getArray((reader) => {
            const skill = reader.getNamespacedObject(game.skills);
            const value = reader.getFloat64();
            if (typeof skill === "string") return undefined;
            return { skill, value };
          }),
        };
      } else {
        return { key: modifierKey, value: reader.getFloat64() };
      }
    });
  }
  writeHeaderInfo(headerInfo) {
    this.header.writeUint32(headerInfo.saveVersion);
    this.header.writeString(headerInfo.characterName);
    this.header.writeString(headerInfo.currentGamemode.id);
    this.header.writeUint16(headerInfo.totalSkillLevel);
    this.header.writeFloat64(headerInfo.gp);
    this.header.writeBoolean(headerInfo.offlineAction !== undefined);
    if (headerInfo.offlineAction !== undefined) {
      this.header.writeString(headerInfo.offlineAction.id);
    }
    this.header.writeFloat64(headerInfo.tickTimestamp);
    this.header.writeFloat64(headerInfo.saveTimestamp);
    this.header.writeArray(headerInfo.activeNamespaces, (ns, writer) =>
      writer.writeString(ns)
    );
  }
  getHeaderFromSaveString(saveString, game) {
    const saveVersion = this.setDataFromSaveString(saveString);
    const characterName = this.header.getString();
    const gamemodeID = this.header.getString();
    let currentGamemode = game.gamemodes.getObjectByID(gamemodeID);
    if (currentGamemode === undefined) {
      currentGamemode = new DummyGamemode(game.getDummyData(gamemodeID), game);
    }
    const totalSkillLevel = this.header.getUint16();
    const gp = this.header.getFloat64();
    let offlineAction = undefined;
    if (this.header.getBoolean()) {
      const activeActionID = this.header.getString();
      offlineAction = game.activeActions.getObjectByID(activeActionID);
      if (offlineAction === undefined) {
        offlineAction = new DummyActiveAction(
          game.getDummyData(activeActionID)
        );
      }
    }
    const tickTimestamp = this.header.getFloat64();
    const saveTimestamp = this.header.getFloat64();
    let activeNamespaces = [];
    if (saveVersion >= 33) {
      activeNamespaces = this.header.getArray((reader) => reader.getString());
    } else {
      activeNamespaces.push("melvorD");
      if (this.namespaceMap.has("melvorTotH")) {
        activeNamespaces.push("melvorF", "melvorTotH");
      } else if (this.namespaceMap.has("melvorF")) {
        activeNamespaces.push("melvorF");
      }
    }
    return {
      saveVersion,
      characterName,
      currentGamemode,
      totalSkillLevel,
      gp,
      offlineAction,
      tickTimestamp,
      saveTimestamp,
      activeNamespaces,
    };
  }
  getSaveString(headerInfo) {
    this.header.writeMap(
      this.namespaceMap,
      (namespace, writer) => {
        writer.writeString(namespace);
      },
      (idMap, writer) => {
        writer.writeMap(
          idMap,
          (localID, writer) => {
            writer.writeString(localID);
          },
          (numericID, writer) => {
            writer.writeUint16(numericID);
          }
        );
      }
    );
    this.writeHeaderInfo(headerInfo);
    const headerData = this.header.getRawData();
    const bodyData = this.getRawData();
    const combinedData = new BinaryWriter(
      "Write",
      headerData.byteLength + bodyData.byteLength
    );
    combinedData.writeFixedLengthBuffer(this.stringEncoder.encode("melvor"), 6);
    combinedData.writeBuffer(headerData);
    combinedData.writeBuffer(bodyData);
    const rawSaveData = combinedData.getRawData();
    const compressedData = pako.deflate(new Uint8Array(rawSaveData), {
      to: "string",
    });
    const saveString = btoa(compressedData);
    return saveString;
  }
  setDataFromSaveString(saveString) {
    const combinedReader = new BinaryWriter("Read", 1);
    try {
      combinedReader.setRawData(pako.inflate(atob(saveString)).buffer);
    } catch (_a) {
      throw new Error("String is not save.");
    }
    const melvor = this.stringDecoder.decode(
      combinedReader.getFixedLengthBuffer(6)
    );
    if (melvor !== "melvor") throw new Error("String is not save.");
    this.header = new BinaryWriter("Read", 1);
    this.header.setRawData(combinedReader.getBuffer());
    this.setRawData(combinedReader.getBuffer());
    this.namespaceMap = this.header.getMap(
      (reader) => {
        return reader.getString();
      },
      (reader) => {
        return reader.getMap(
          (reader) => {
            return reader.getString();
          },
          (reader) => {
            return reader.getUint16();
          }
        );
      }
    );
    this.namespaceMap.forEach((idMap, namespace) => {
      idMap.forEach((numericID, id) => {
        this.numericToStringIDMap.set(numericID, `${namespace}:${id}`);
      });
    });
    return this.header.getUint32();
  }
}
const writeNamespaced = (object, writer) => {
  writer.writeNamespacedObject(object);
};
function readNamespacedReject(registry) {
  return (reader) => {
    const object = reader.getNamespacedObject(registry);
    if (typeof object === "string") return undefined;
    return object;
  };
}
const writeEncodable = (object, writer) => {
  object.encode(writer);
};
const writeItemQuantity = (quantity, writer) => {
  writer.writeNamespacedObject(quantity.item);
  writer.writeInt32(quantity.quantity);
};
const writeAttackEffect = (game, attack) => (effect, writer) => {
  if (attack === game.itemEffectAttack) {
    writer.writeUint8(18);
    writer.writeNamespacedObject(
      game.itemEffectAttack.getItemEffectFromEffect(effect)
    );
  } else {
    let effectType = 0;
    let effectID = attack.onhitEffects.findIndex((onhit) => onhit === effect);
    if (effectID === -1) {
      effectID = attack.prehitEffects.findIndex((prehit) => prehit === effect);
      effectType = 1;
    }
    if (effectID === -1) {
      if (effect === afflictionEffect) effectType = 2;
      else if (effect === frostBurnEffect) effectType = 3;
      else if (effect instanceof SlowEffect) {
        effectType = 4;
        effectID = effect.modifiers.increasedAttackIntervalPercent;
      } else if (effect === absorbingSkinEffect) effectType = 5;
      else if (effect === dualityEffect) effectType = 6;
      else if (effect === rageEffect) effectType = 7;
      else if (effect === darkBladeEffect) effectType = 8;
      else if (effect instanceof EndOfTurnEvasionEffect) {
        effectType = 9;
        effectID = effect.modifiers.increasedGlobalEvasion;
      } else if (effect === shockEffect) effectType = 10;
      else if (effect === assassinEffect) effectType = 11;
      else if (effect === decreasedEvasionStackingEffect) effectType = 12;
      else if (effect === growingMadnessEffect) effectType = 13;
      else if (effect === momentInTimeEffect) effectType = 14;
      else if (effect === reignOverTimeEffect) effectType = 15;
      else if (effect === shadowCloakEffect) effectType = 17;
      else if (effect === increased5DROnHitEffect) effectType = 19;
      else throw new Error("Attempted to encode invalid modifier effect.");
    }
    writer.writeUint8(effectType);
    writer.writeFloat64(effectID);
  }
};
function readAttackEffect(reader, game, attack) {
  let effect;
  const effectType = reader.getUint8();
  if (effectType === 18) {
    const itemEffect = reader.getNamespacedObject(
      game.itemEffectAttack.itemEffects
    );
    if (typeof itemEffect === "string") return undefined;
    return itemEffect.effect;
  } else {
    const effectID = reader.getFloat64();
    if (attack === undefined) return undefined;
    switch (effectType) {
      case 0:
        effect = attack.onhitEffects[effectID];
        break;
      case 1:
        effect = attack.prehitEffects[effectID];
        break;
      case 2:
        effect = afflictionEffect;
        break;
      case 3:
        effect = frostBurnEffect;
        break;
      case 4:
        effect = new SlowEffect(effectID, 2);
        break;
      case 5:
        effect = absorbingSkinEffect;
        break;
      case 6:
        effect = dualityEffect;
        break;
      case 7:
        effect = rageEffect;
        break;
      case 8:
        effect = darkBladeEffect;
        break;
      case 9:
        effect = new EndOfTurnEvasionEffect(1, effectID, true);
        break;
      case 10:
        effect = shockEffect;
        break;
      case 11:
        effect = assassinEffect;
        break;
      case 12:
        effect = decreasedEvasionStackingEffect;
        break;
      case 13:
        effect = growingMadnessEffect;
        break;
      case 14:
        effect = momentInTimeEffect;
        break;
      case 15:
        effect = reignOverTimeEffect;
        break;
      case 16:
        return undefined;
      case 17:
        effect = shadowCloakEffect;
        break;
      case 19:
        effect = increased5DROnHitEffect;
        break;
      default:
        throw new Error(
          `Error deserializing data, effectType ${effectType} is invalid.`
        );
    }
  }
  return effect;
}
