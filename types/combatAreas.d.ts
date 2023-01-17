declare class CombatAreaMenu {
  constructor(containerID: any, areas: any);
  areas: any;
  menuElems: Map<any, any>;
  container: HTMLElement;
  updateRequirements(): void;
  updateEvent(activeAreas: any): void;
  updateAreaEffectValues(): void;
  removeEvent(): void;
  setTutorialHighlight(area: any): void;
  highlightedArea: any;
  removeTutorialHighlight(): void;
  setReqStatus(reqSpan: any, met: any): void;
  createMenuElement(areaData: any, id: any): void;
  toggleTable(areaData: any, menuItem: any): void;
  createTutorialDirection(areaData: any): any;
  createName(areaData: any): any;
  createDifficultySpan(difficulty: any): any;
  createRequirements(areaData: any): {
    requirements: any;
    reqSpans: any[];
  };
  createReqImage(media: any): any;
  createReqSpan(text: any): any;
  createDungeonInfo(areaData: any): any[];
  createRewardImage(media: any): any;
  createEffectInfo(areaData: any, description: any): any;
  createDungeonUnlock(dungeon: any): any;
  getUnlockMessage(dungReq: any): any;
  isDungeonUnlocked(dungeon: any): any;
  createMonsterTable(areaData: any): {
    table: any;
    buttons: any[];
  };
  createDungeonTable(dungeon: any): {
    table: any;
    buttons: any[];
  };
  createEventStartButton(areaData: any): any;
}
declare namespace CombatAreaMenu {
  const difficulty: {
    readonly name: any;
    class: string;
  }[];
  namespace attackTypeMedia {
    const melee: string;
    const ranged: string;
    const magic: string;
    const random: string;
  }
}
declare class CombatArea extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  entryRequirements: any[];
  monsters: any;
  _name: any;
  _media: any;
  difficulty: any;
  get media(): any;
  get name(): any;
  registerSoftDependencies(data: any, game: any): void;
}
declare class SlayerArea extends CombatArea {
  slayerLevelRequired: number;
  _areaEffectDescription: any;
  areaEffect: any;
  pet: {
    pet: any;
    weight: any;
  };
  get areaEffectDescription(): any;
}
declare class Dungeon extends CombatArea {
  rewards: any;
  dropBones: any;
  floors: any;
  event: any;
  unlockRequirement: any;
  pet: {
    pet: any;
    weight: any;
  };
  fixedPetClears: any;
  pauseOnBosses: any;
  oneTimeReward: any;
  nonBossPassives: any;
}
declare class DummyDungeon extends Dungeon {}
