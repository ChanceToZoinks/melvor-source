declare class RaidPlayer extends Player {
  altAttacks: {};
  get isPrayerUnlocked(): boolean;
  get prayerPointsOnWaveCompletion(): number;
  get useCombinationRunes(): boolean;
  resetAltAttacks(): void;
  equipItem(
    item: any,
    set: any,
    slot?: string,
    quantity?: number,
    altAttacks?: any[]
  ): boolean;
  setEquipmentToDefault(): void;
  getSkillLevel(skill: any): any;
  getLevelHistory(): any[];
  getEquipmentHistory(): any[];
  equipDefaultWeapon(): void;
  renderLevels(): void;
  deserializeAltAttacks(reader: any, version: any, idMap: any): void;
}
