declare function readNamespacedReject(registry: any): (reader: any) => any;
declare function readAttackEffect(reader: any, game: any, attack: any): any;
declare class BinaryWriter {
  constructor(mode: any, dataExtensionLength: any);
  mode: any;
  dataExtensionLength: any;
  stringEncoder: TextEncoder;
  stringDecoder: TextDecoder;
  byteOffset: number;
  markRegionOffset: number;
  _data: ArrayBuffer;
  dataView: DataView;
  uint8View: Uint8Array;
  set data(arg: ArrayBuffer);
  get data(): ArrayBuffer;
  get remainingBytes(): number;
  checkDataSize(bytes: any): void;
  checkWriteAccess(): void;
  checkReadAccess(): void;
  startMarkingWriteRegion(): void;
  stopMarkingWriteRegion(): void;
  getBigInt64(): bigint;
  getBigUint64(): bigint;
  getFloat32(): number;
  getFloat64(): number;
  getInt8(): number;
  getInt16(): number;
  getInt32(): number;
  getUint8(): number;
  getUint16(): number;
  getUint32(): number;
  getString(): string;
  getBoolean(): boolean;
  getArray(decodeArray: any): any[];
  getMap(decodeKey: any, decodeValue: any): Map<any, any>;
  getComplexMap(decode: any): Map<any, any>;
  getSet(decodeValue: any): Set<any>;
  getBuffer(): ArrayBuffer;
  getFixedLengthBuffer(length: any): ArrayBuffer;
  writeBigInt64(value: any): void;
  writeBigUInt64(value: any): void;
  writeFloat32(value: any): void;
  writeFloat64(value: any): void;
  writeInt8(value: any): void;
  writeInt16(value: any): void;
  writeInt32(value: any): void;
  writeUint8(value: any): void;
  writeUint16(value: any): void;
  writeUint32(value: any): void;
  writeString(value: any): void;
  writeBoolean(value: any): void;
  writeArray(array: any, encodeArray: any): void;
  writeMap(map: any, encodeKey: any, encodeValue: any): void;
  writeComplexMap(map: any, encode: any): void;
  writeSet(set: any, encodeValue: any): void;
  writeBuffer(buffer: any): void;
  writeFixedLengthBuffer(buffer: any, length: any): void;
  getRawData(): ArrayBuffer;
  setRawData(data: any): void;
}
declare namespace BinaryWriter {
  const Uint32Max: number;
}
declare class SaveWriter extends BinaryWriter {
  namespaceMap: Map<any, any>;
  nextNumericID: number;
  numericToStringIDMap: Map<any, any>;
  header: BinaryWriter;
  writeNamespacedObject(object: any): void;
  getNamespacedObject(registry: any): any;
  writeCombatModifierArray(modifiers: any): void;
  writeModifierArray(modifiers: any): void;
  getCombatModifierArray(): any[];
  getModifierArray(game: any): any[];
  writeHeaderInfo(headerInfo: any): void;
  getHeaderFromSaveString(
    saveString: any,
    game: any
  ): {
    saveVersion: number;
    characterName: string;
    currentGamemode: any;
    totalSkillLevel: number;
    gp: number;
    offlineAction: any;
    tickTimestamp: number;
    saveTimestamp: number;
    activeNamespaces: any[];
  };
  getSaveString(headerInfo: any): string;
  setDataFromSaveString(saveString: any): number;
}
declare function writeNamespaced(object: any, writer: any): void;
declare function writeEncodable(object: any, writer: any): void;
declare function writeItemQuantity(quantity: any, writer: any): void;
declare function writeAttackEffect(
  game: any,
  attack: any
): (effect: any, writer: any) => void;
