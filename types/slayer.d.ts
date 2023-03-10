declare class SlayerTask {
  constructor(player: any, game: any);
  player: any;
  game: any;
  active: boolean;
  killsLeft: number;
  extended: boolean;
  tier: any;
  completion: number[];
  taskTimer: Timer;
  autoStartNext: boolean;
  renderRequired: boolean;
  renderNewButton: boolean;
  areaBypassItems: any[];
  allAreaBypassItems: any[];
  shouldResetTaskState: boolean;
  get autoSlayer(): any;
  postDataRegistration(): void;
  render(): void;
  jumpToTaskOnClick(): void;
  renderTask(): void;
  renderButtonSpinner(): void;
  extendTask(): void;
  addKill(): void;
  tick(): void;
  getExtensionCost(): number;
  selectTask(
    tier: any,
    costsCoins: any,
    render: any,
    fromClick?: boolean
  ): void;
  monster: any;
  getTaskLength(tier: any): number;
  setTask(): void;
  getMonsterSelection(tier: any): any;
  clickNewTask(): void;
  checkRequirements(requirements: any, softReq: any, slayerLevelReq: any): any;
  getTaskCompletionsForTierAndAbove(tier: any): number;
  resetTaskState(): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  deserialize(reader: any, version: any, idMap: any): void;
  convertFromOldSaveFormat(oldTasks: any, oldCompletion: any, idMap: any): void;
}
declare namespace SlayerTask {
  const data: {
    readonly display: any;
    engDisplay: string;
    cost: number;
    minLevel: number;
    maxLevel: number;
    slayerLevel: number;
  }[];
}
declare class SlayerTaskMenuElement extends HTMLElement {
  selectTaskButtons: any[];
  taskSelectionOpen: boolean;
  _content: DocumentFragment;
  slayerIcon: any;
  newTaskSpinner: any;
  newTaskButton: any;
  newTaskButtonText: any;
  selectTaskContainer: any;
  locatingContent: any;
  monsterContainer: any;
  monsterImage: any;
  monsterLevel: any;
  taskTier: any;
  monsterName: any;
  jumpToEnemyButton: any;
  extendContainer: any;
  extendMessage: any;
  extendTaskButton: any;
  extendTaskCost: any;
  autoSlayerCheckBox: any;
  connectedCallback(): void;
  slayerIconTooltip: any;
  disconnectedCallback(): void;
  initialize(game: any): void;
  setNoTask(): void;
  setTaskMonster(monster: any, killsLeft: any, tier: any): void;
  updateTaskExtension(isExtended: any, extensionCost: any): void;
  openTaskSelection(): void;
  closeTaskSelection(): void;
  updateTaskSelectButtons(game: any): void;
  updateTaskSpinner(isSelecting: any): void;
  toggleAutoSlayerCheckbox(unlocked: any): void;
}
