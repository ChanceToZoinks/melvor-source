declare class Golbin extends Enemy {
  static getName(): any;
  static getLevel(wave: any, isBoss: any, hitpoints?: boolean): any;
  static getAttackType(): "ranged" | "magic" | "melee";
  static getMedia(isBoss: any): string;
  static getStats(
    wave: any,
    isBoss: any
  ): {
    key: string;
    value: number;
  }[];
  static getStatValue(wave: any, isBoss: any): number;
  tempNamespace: {
    name: string;
    displayName: string;
    isModded: boolean;
  };
  getMonster(
    wave: any,
    isBoss: any,
    hasExtraPassiveChance: any,
    game: any
  ): GolbinMonster;
  encodeMonsterData(writer: any): void;
  decodeMonster(reader: any, version: any): void;
  deserializeMonsterData(reader: any, version: any, idMap: any): GolbinMonster;
}
declare namespace Golbin {
  const names: string[];
  const traits: string[];
}
