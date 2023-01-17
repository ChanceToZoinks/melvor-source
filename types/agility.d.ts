declare class BaseAgilityObject extends MasteryAction {
  constructor(namespace: any, data: any, game: any);
  _name: any;
  itemCosts: any;
  gpCost: any;
  scCost: any;
  modifiers: any;
}
declare class AgilityObstacle extends BaseAgilityObject {
  _media: any;
  category: any;
  baseInterval: any;
  skillRequirements: any;
  baseExperience: any;
  gpReward: any;
  scReward: any;
  itemRewards: any;
  get name(): any;
  get media(): any;
  get level(): number;
}
declare class DummyObstacle extends AgilityObstacle {
  get name(): string;
}
declare class AgilityPillar extends BaseAgilityObject {
  get name(): any;
  get media(): string;
}
declare class DummyPillar extends AgilityPillar {
  get name(): string;
}
declare class Agility extends GatheringSkill {
  constructor(namespace: any, game: any);
  _media: string;
  obstacleUnlockLevels: number[];
  maxBlueprints: number;
  blueprints: Map<any, any>;
  renderQueue: AgilityRenderQueue;
  maxObstacles: number;
  builtObstacles: Map<any, any>;
  obstacleBuildCount: Map<any, any>;
  currentlyActiveObstacle: number;
  builtPassivePillar: any;
  builtElitePassivePillar: any;
  modifiers: MappedModifiers;
  pillars: NamespaceRegistry;
  elitePillars: NamespaceRegistry;
  getTotalUnlockedMasteryActions(): any;
  get actionInterval(): number;
  get actionLevel(): number;
  get masteryAction(): any;
  get activeObstacleCount(): number;
  get numObstaclesUnlocked(): number;
  get passivePillarUnlocked(): boolean;
  get elitePassivePillarUnlocked(): boolean;
  get activeObstacle(): any;
  isObstacleBuilt(obstacle: any): boolean;
  isPillarBuilt(pillar: any): boolean;
  isElitePillarBuilt(pillar: any): boolean;
  getObstacleBuildCount(obstacle: any): any;
  getObstacleBuildCosts(obstacle: any): Costs;
  addSingleObstacleBuildCost(obstacle: any, costs: any): void;
  getPillarBuildCosts(pillar: any): Costs;
  addSinglePillarBuildCost(pillar: any, costs: any): void;
  getTotalObstacleBuiltCount(): number;
  getObstacleInterval(obstacle: any): number;
  getObstacleGP(obstacle: any): number;
  getObstacleModifiers(obstacle: any): MappedModifiers;
  getPillarModifiers(pillar: any): MappedModifiers;
  getObstacleCostModifier(obstacle: any): number;
  getObstacleItemCostModifier(obstacle: any): number;
  obstacleHasNegativeModifiers(obstacle: any): boolean;
  preAction(): void;
  get actionRewards(): Rewards;
  postAction(): void;
  get masteryModifiedInterval(): number;
  get newBlueprint(): {
    name: string;
    obstacles: Map<any, any>;
  };
  getBlueprintName(index: any): any;
  setBlueprintName(index: any, name: any): void;
  loadBlueprints(): void;
  updateBlueprintNames(): void;
  setupBlueprints(): void;
  nameBlueprintSwal(index: any): void;
  saveBlueprint(index: any, name: any): void;
  loadBlueprint(index: any): void;
  getBlueprintCostToBuild(blueprint: any): Costs;
  displayBlueprintObstacleNames(blueprint: any): any;
  displayBlueprintCostToBuild(costs: any): any;
  getAllBlueprintModifiers(blueprint: any): MappedModifiers;
  displayBlueprintSwal(blueprint: any): void;
  replaceCourseWithBlueprint(blueprint: any): void;
  onEquipmentChange(): void;
  renderCourseRates(): void;
  renderBuiltObstacles(): void;
  renderCourseModifiers(): void;
  renderObstacleHighlights(): void;
  renderProgressBar(): void;
  renderStartStopButtons(): void;
  startAgilityOnClick(): void;
  stopAgilityOnClick(): void;
  createSelectionMenus(count: any): void;
  viewObstacleSelectionOnClick(category: any): void;
  destroyObstacleOnClick(category: any): void;
  computeProvidedStats(updatePlayer?: boolean): void;
  onObstacleChange(): void;
  destroyObstacle(category: any): void;
  buildObstacle(obstacle: any): void;
  buildPillar(pillar: any): void;
  destroyPillar(): void;
  viewPillarSelectionOnClick(): void;
  destroyPillarOnClick(): void;
  buildElitePillar(pillar: any): void;
  destroyElitePillar(): void;
  viewElitePillarSelectionOnClick(): void;
  destroyElitePillarOnClick(): void;
  buildObstacleOnClick(obstacle: any): void;
  buildPillarOnClick(pillar: any): void;
  buildElitePillarOnClick(pillar: any): void;
  viewAllPassivesOnClick(): void;
  getDummyObstacle(id: any): any;
  convertFromOldFormat(savegame: any, idMap: any): void;
  getActionIDFromOldID(oldActionID: any, idMap: any): any;
  setFromOldOffline(offline: any): void;
  getObstacleLevel(category: any): number;
}
declare class AgilityRenderQueue extends GatheringSkillRenderQueue {
  obstacleRates: boolean;
  builtObstacles: boolean;
  obstacleModifiers: boolean;
  obstacleHighlights: Set<any>;
  startButtons: boolean;
}
