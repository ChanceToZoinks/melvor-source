declare function loadMiningOres(): void;
declare function localizeMining(): void;
declare class MiningRenderQueue extends GatheringSkillRenderQueue {
    rockHP: Set<any>;
    rockStatus: Set<any>;
    rockRates: boolean;
    rockUnlock: boolean;
    respawnProgress: Set<any>;
}
declare const rockMenus: Map<any, any>;
declare class MiningRock extends SingleProductRecipe {
    currentHP: number;
    maxHP: number;
    isRespawning: boolean;
    _name: any;
    _media: any;
    baseRespawnInterval: any;
    baseQuantity: any;
    totalMasteryRequired: any;
    hasPassiveRegen: any;
    giveGems: any;
    superiorGemChance: any;
    shopItemPurchased: any;
    fixedMaxHP: any;
    type: any;
    gemVeinWeight: any;
    get giveSuperiorGems(): boolean;
}
declare class Mining extends GatheringSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: MiningRenderQueue;
    baseInterval: number;
    baseRockHP: number;
    passiveRegenInterval: number;
    tier3PoolWasActive: boolean;
    rockRespawnTimers: Map<any, any>;
    passiveRegenTimer: Timer;
    gemVeins: any[];
    totalGemVeinWeight: number;
    getTotalUnlockedMasteryActions(): any;
    get actionInterval(): number;
    get actionLevel(): any;
    get masteryAction(): any;
    get masteryModifiedInterval(): number;
    get activeRock(): any;
    coalItem: any;
    runestoneItem: any;
    canMineOre(ore: any): any;
    passiveTick(): void;
    onEquipmentChange(): void;
    renderRockRates(): void;
    renderRockHP(): void;
    renderRockStatus(): void;
    renderProgressBar(): void;
    activeProgressRock: any;
    stopActiveProgressBar(): void;
    renderRespawnProgress(): void;
    renderRockUnlock(): void;
    get rockHPPreserveChance(): number;
    get chanceToDoubleGems(): number;
    getRockGemChance(ore: any): number;
    getRockSuperiorGemChance(ore: any): any;
    onRockClick(rock: any): void;
    selectedRock: any;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
    preAction(): void;
    get actionRewards(): Rewards;
    addRandomGemReward(rewards: any): void;
    addRandomSuperiorGemReward(rewards: any): void;
    postAction(): void;
    regenRockHP(): void;
    getRockMaxHP(rock: any): any;
    updateRockMaxHP(rock: any): void;
    updateAllRockMaxHPs(): void;
    startRespawningRock(rock: any): void;
    respawnRock(rock: any): void;
    initializeRocks(): void;
    addMeteoriteVein(): void;
    rollForRandomGemVein(rock: any): void;
    rollRandomHPForGemVein(): {
        size: number;
        hpToAdd: number;
    };
    getRandomGemVein(): any;
    getGemVeinSize(number: any): string;
}
