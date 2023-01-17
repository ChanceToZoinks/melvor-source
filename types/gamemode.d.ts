declare namespace COMBAT_TRIANGLE_IDS {
  const Standard: number;
  const Hardcore: number;
  const InvertedHardcore: number;
}
declare class Gamemode extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  _name: any;
  _description: any;
  _rules: any;
  _media: any;
  textClass: any;
  btnClass: any;
  isPermaDeath: any;
  isEvent: any;
  startDate: any;
  endDate: any;
  _combatTriangle: any;
  hitpointMultiplier: any;
  hasRegen: any;
  capNonCombatSkillLevels: any;
  startingPage: any;
  startingItems: any;
  allowSkillUnlock: any;
  startingSkills: Set<any>;
  skillUnlockCost: any;
  playerModifiers: any;
  enemyModifiers: any;
  hasTutorial: any;
  get name(): any;
  get description(): any;
  get rules(): any;
  get media(): any;
  get combatTriangle(): any;
}
declare class DummyGamemode extends Gamemode {
  constructor(dummyData: any, game: any);
  get name(): string;
}
