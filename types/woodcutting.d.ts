declare class WoodcuttingTree extends SingleProductRecipe {
    canDropRavenNest: boolean;
    _name: any;
    _media: any;
    baseInterval: any;
    shopItemPurchased: any;
}
declare class Woodcutting extends GatheringSkill {
    constructor(namespace: any, game: any);
    _media: string;
    activeTrees: Set<any>;
    renderQueue: WoodcuttingRenderQueue;
    bannedJewelry: Set<any>;
    randomJewelry: any[];
    getTotalUnlockedMasteryActions(): any;
    get mushroomChance(): any;
    addArrowShaftReward(tree: any, rewards: any): void;
    nestItem: any;
    ashItem: any;
    mushroomItem: any;
    ravenNestItem: any;
    getTreeInterval(tree: any): number;
    getTreeMultiplier(tree: any): number;
    getTreeMasteryXP(tree: any): number;
    getBirdNestChance(): number;
    getRavenNestChance(): number;
    getBirdNestQuantity(): number;
    get treeCutLimit(): any;
    selectTree(tree: any): void;
    get actionInterval(): number;
    get totalXPToAdd(): any;
    get totalPoolXPToAdd(): number;
    get actionLevel(): number;
    get stardustChance(): any;
    getWCXPtoFMXP(): number;
    get ashChance(): number;
    get masteryAction(): any;
    get masteryModifiedInterval(): number;
    preAction(): void;
    get actionRewards(): Rewards;
    postAction(): void;
    onEquipmentChange(): void;
    renderTreeRates(): void;
    renderTreeUnlock(): void;
    renderProgressBar(): void;
    renderSelectedTrees(): void;
    renderTreeGrants(): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
}
declare class WoodcuttingRenderQueue extends GatheringSkillRenderQueue {
    selectedTrees: boolean;
    treeRates: boolean;
    treeUnlocks: boolean;
    treeGrants: boolean;
}
