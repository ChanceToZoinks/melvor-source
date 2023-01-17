declare class TutorialTask {
    constructor(game: any, data: any);
    progress: number;
    id: any;
    _description: any;
    _media: any;
    eventMatcher: any;
    eventCount: any;
    countEventQuantity: any;
    get description(): any;
    get media(): any;
    get complete(): boolean;
}
declare class TutorialStage extends NamespacedObject {
    constructor(namespace: any, data: any, game: any);
    claimed: boolean;
    tasks: any;
    taskPage: any;
    skillUnlocks: any;
    rewards: {
        gp: any;
        slayerCoins: any;
        items: any;
    };
    allowedShopPurchases: any;
    allowedMonsters: any;
    bannedItemSales: any;
    allowCombat: any;
    get name(): any;
    get description(): any;
    get complete(): any;
    get completedTasks(): any;
    get totalTasks(): any;
    encode(writer: any): any;
    decode(reader: any, version: any): void;
    resetProgress(): void;
    setClaimed(): void;
}
declare class TutorialRenderQueue {
    currentStageTasks: boolean;
    currentStageStatus: boolean;
}
declare class Tutorial {
    constructor(game: any);
    game: any;
    complete: boolean;
    allowedShopPurchases: Set<any>;
    allowedMonsters: Set<any>;
    bannedItemSales: Set<any>;
    allowCombat: boolean;
    stages: NamespaceRegistry;
    _stagesCompleted: number;
    renderQueue: TutorialRenderQueue;
    stageOrder: NamespacedArray;
    get stagesCompleted(): number;
    get totalStages(): number;
    get shouldStart(): any;
    registerStages(namespace: any, data: any): void;
    registerStageOrder(order: any): void;
    render(): void;
    continueOnLoad(): void;
    start(): void;
    completeTutorial(): void;
    startNextStage(): void;
    currentStage: any;
    setupForStage(stage: any): void;
    setStageMenus(stage: any): void;
    renderProgress(): void;
    showStageHints(stage: any): void;
    removeStageHints(stage: any): void;
    updateTaskProgress(event: any): void;
    claimStageOnClick(stage: any): void;
    skipButtonOnClick(): void;
    skipTutorial(): void;
    encode(writer: any): any;
    decode(reader: any, version: any): void;
    convertFromOldFormat(savegame: any, idMap: any): void;
}
