declare class ThievingNPC extends BasicSkillRecipe {
  constructor(namespace: any, data: any, game: any);
  _name: any;
  _media: any;
  perception: any;
  maxHit: any;
  maxGP: any;
  uniqueDrop: any;
  lootTable: DropTable;
  get name(): any;
  get media(): any;
}
declare class ThievingArea extends NamespacedObject {
  constructor(namespace: any, data: any, game: any, thieving: any);
  _name: any;
  npcs: any;
  uniqueDrops: any;
  get name(): any;
}
declare class ThievingRenderQueue extends GatheringSkillRenderQueue {
  menu: boolean;
  stopButton: boolean;
  npcUnlock: boolean;
}
declare class Thieving extends GatheringSkill {
  constructor(namespace: any, game: any);
  stunTimer: Timer;
  _media: string;
  baseInterval: number;
  baseStunInterval: number;
  itemChance: number;
  baseAreaUniqueChance: number;
  renderQueue: ThievingRenderQueue;
  generalRareItems: any[];
  barItems: any[];
  hiddenAreas: Set<any>;
  stunState: number;
  areas: NamespaceRegistry;
  getTotalUnlockedMasteryActions(): any;
  get areaUniqueChance(): number;
  get masteryAction(): any;
  get actionLevel(): any;
  get avoidStunChance(): number;
  get stunInterval(): number;
  entLeprechaunItem: any;
  crowLeprechaunItem: any;
  bearLeprechaunItem: any;
  easterEgg: {
    equipped: EquipmentItem;
    positioned: any;
    reward: any;
  };
  renderNPCUnlock(): void;
  currentArea: any;
  currentNPC: any;
  getActionIDFromOldID(oldActionID: any, idMap: any): any;
  onEquipmentChange(): void;
  stopOnDeath(): void;
  notifyStunBlockingAction(): void;
  renderMenu(): void;
  renderStopButton(): void;
  renderProgressBar(): void;
  lastActiveAreaProgressBar: any;
  renderVisibleAreas(): void;
  onAreaHeaderClick(area: any): void;
  onNPCPanelSelection(npc: any, area: any): boolean;
  startThieving(area: any, npc: any): void;
  getStunInterval(): number;
  getNPCSuccessRate(npc: any): number;
  getNPCSleightOfHand(npc: any): number;
  getNPCPickpocket(npc: any): number;
  getStealthAgainstNPC(npc: any): any;
  getNPCInterval(npc: any): number;
  getNPCDoublingChance(npc: any): number;
  getNPCGPRange(npc: any): {
    minGP: number;
    maxGP: any;
  };
  getNPCMinGPRoll(npc: any): number;
  getNPCGPMultiplier(npc: any): number;
  stunned(): void;
  get isStunned(): boolean;
  get actionRewards(): Rewards;
  addJesterHatGP(item: any, rewards: any): void;
  get actionInterval(): number;
  get masteryModifiedInterval(): number;
  preAction(): void;
  postAction(): void;
  addStat(stat: any, amount?: number): void;
}
declare namespace Thieving {
  const DevilTable: number[][];
  const OtherDevilTable: number[][];
}
