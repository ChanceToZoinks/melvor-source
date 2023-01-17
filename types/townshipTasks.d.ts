declare class TownshipTaskRewards {
    constructor(data: any, game: any);
    gp: any;
    slayerCoins: any;
    items: any;
    skillXP: any;
    townshipResources: any;
}
declare class TownshipTaskGoals {
    constructor(data: any, game: any);
    items: any;
    monsters: any;
    skillXP: any;
    buildings: any;
}
declare class TownshipTask extends NamespacedObject {
    constructor(namespace: any, data: any, game: any);
    _name: any;
    _description: any;
    goals: TownshipTaskGoals;
    rewards: TownshipTaskRewards;
    requirements: any;
    category: any;
    get name(): any;
    get description(): any;
    get hasDescription(): boolean;
}
declare class DummyTownshipTask extends TownshipTask {
}
declare class TownshipTasks {
    constructor(game: any);
    game: any;
    completedTasks: Set<any>;
    tasks: NamespaceRegistry;
    taskReadyIcon: boolean;
    _tasksCompleted: number;
    activeTaskCategory: string;
    get tasksCompleted(): number;
    get tutorialTasksCompleted(): number;
    get allTasksComplete(): boolean;
    registerData(namespace: any, taskData: any): void;
    onLoad(): void;
    computeTaskTotal(): void;
    onPageChange(): void;
    resetTutorial(): void;
    skipTownshipTutorial(): void;
    get isTownshipTutorialComplete(): boolean;
    getTaskCountInCategory(category: any): number;
    getCompletedTaskCountInCategory(category: any): number;
    completeTask(task: any, giveRewards?: boolean, forceComplete?: boolean): void;
    showTaskComplete(): void;
    checkForTaskReady(forceCheck?: boolean): void;
    checkForTaskReadyInCategory(category: any): boolean;
    checkTaskCompletion(task: any): boolean;
    isItemTaskComplete(itemGoal: any): boolean;
    isMonsterTaskComplete(monsterGoal: any): boolean;
    isSkillTaskComplete(skillTask: any): boolean;
    isTownshipBuildingTaskComplete(buildingTask: any): boolean;
    isTaskRequirementMet(task: any): any;
    updateAllTasks(): void;
    isTaskCategoryComplete(category: any): boolean;
    updateMonsterTasks(monster: any): void;
    updateSkillTasks(skill: any, xp: any): void;
    updateTownshipBuildingTasks(building: any, qty: any): void;
    removeTaskItemsFromBank(task: any): void;
    createTaskCompletedBreakdown(): any;
    getTaskCompletedBreakdownText(): any;
    updateTaskCompletedBreakdownText(): void;
    createTaskButtonHeader(): any;
    createTaskElement(task: any): any;
    createTaskDescription(task: any): any;
    createTaskTasks(task: any): any;
    createTaskItemTask(task: any): any;
    createTaskMonsterTask(task: any): any;
    createTaskSkillTask(task: any): any;
    createTaskTownshipBuildingTask(task: any): any;
    createTaskRewards(task: any): any;
    createTaskGPReward(task: any): any;
    createTaskSlayerCoinReward(task: any): any;
    createTaskItemsReward(item: any, quantity: any): any;
    createTaskSkillXPReward(skill: any, quantity: any): any;
    createTaskTownshipResourceReward(resource: any, quantity: any): any;
    claimTaskRewards(task: any): void;
    showAllTaskCategories(): void;
    showTaskCategory(category: any): void;
    createTaskCategory(category: any): any;
    createTaskLinkCategory(category: any): any;
    updateAllTaskProgress(): void;
    updateTaskProgress(category: any): void;
    getTownshipTaskCategoryIcon(category: any): "assets/media/skills/combat/combat.svg" | "assets/media/skills/township/township.svg";
    getTownshipTaskCategoryName(category: any): any;
    getTownshipTaskCategoryBG(category: any): "bg-township" | "bg-easy-task" | "bg-normal-task" | "bg-hard-task" | "bg-very-hard-task" | "bg-elite-task";
    countTotalTasksInCategory(category: any): any;
    isPlayerLookingAtTask(task: any): boolean;
}
