declare class TutorialStageDisplayElement extends HTMLElement {
    displayedTasks: any[];
    rewardSpans: any[];
    _content: DocumentFragment;
    header: any;
    stageStatus: any;
    stageName: any;
    stageDescription: any;
    taskCompletion: any;
    pageIcon: any;
    pageLink: any;
    taskContainer: any;
    claimRewardsButton: any;
    get displayedStage(): any;
    connectedCallback(): void;
    setStage(stage: any, tutorial: any): void;
    _displayedStage: any;
    updateTasks(stage: any): void;
    getTaskCount(task: any): string;
    getTaskIconClass(task: any): string;
    updateTaskCompletion(completedTasks: any, totalTasks: any): void;
    updateStageStatus(stage: any): void;
    setActive(): void;
    setCompleted(): void;
    setClaimed(): void;
    setHeaderClass(className: any): void;
}
declare class TutorialProgressDisplayElement extends HTMLElement {
    _content: DocumentFragment;
    skipButton: any;
    stagesCompleted: any;
    totalStages: any;
    connectedCallback(): void;
    init(tutorial: any): void;
    updateProgress(tutorial: any): void;
}
