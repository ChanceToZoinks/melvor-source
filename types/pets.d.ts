declare class Pet extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  _name: any;
  _media: any;
  _hint: any;
  _langHint: any;
  skill: any;
  ignoreCompletion: any;
  modifiers: any;
  enemyModifiers: any;
  activeInRaid: any;
  _patreonName: any;
  _langCustomDescription: any;
  scaleChanceWithMasteryPool: any;
  get name(): any;
  get media(): any;
  get acquiredBy(): any;
  get description(): string;
}
declare class DummyPet extends Pet {}
declare class PetManager {
  constructor(game: any);
  game: any;
  modifiers: MappedModifiers;
  enemyModifiers: TargetModifiers;
  raidStats: {
    modifiers: MappedModifiers;
    enemyModifiers: TargetModifiers;
  };
  unlocked: Set<any>;
  onLoad(): void;
  isPetUnlocked(pet: any): boolean;
  rollForPet(chance: any): void;
  rollForSkillPet(pet: any, actionInterval: any, forceSkill: any): void;
  unlockPet(pet: any): void;
  unlockPetByID(petID: any): void;
  petPet(pet: any): void;
  firePetUnlockModal(pet: any): void;
  computeProvidedStats(updatePlayers?: boolean): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  convertFromOldFormat(save: any, idMap: any): void;
}
