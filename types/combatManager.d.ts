declare var CombatAreaType: any;
declare const TICK_INTERVAL: 50;
declare const TICKS_PER_MINUTE: number;
declare class CombatEvent extends NamespacedObject {
    constructor(namespace: any, data: any, game: any);
    itemRewards: any;
    pet: any;
    slayerAreas: any;
    passiveSelection: any;
    enemyPassives: any;
    bossPassives: any;
    firstBossMonster: any;
    finalBossMonster: any;
}
declare class CombatManager extends BaseManager {
    constructor(game: any, namespace: any);
    player: Player;
    enemy: Enemy;
    dungeonCompletion: Map<any, any>;
    dungeonProgress: number;
    bank: any;
    loot: CombatLoot;
    slayerTask: SlayerTask;
    paused: boolean;
    shouldResetEvent: boolean;
    eventProgress: number;
    eventPassives: any[];
    availableEventPassives: any[];
    eventPassivesBeingSelected: Set<any>;
    eventDungeonLength: number;
    activeEventAreas: Map<any, any>;
    itmMonsters: any[];
    spiderLairMonsters: any[];
    openCombatAreaMenu: any;
    get media(): any;
    get name(): any;
    get activeSkills(): any[];
    get canStop(): boolean;
    get areaType(): any;
    get isEventActive(): boolean;
    get isFightingITMBoss(): boolean;
    get onSlayerTask(): boolean;
    get ignoreSpellRequirements(): boolean;
    get canInteruptAttacks(): boolean;
    get areaRequirements(): any;
    get slayerAreaLevelReq(): number;
    get playerAreaModifiers(): {};
    get enemyAreaModifiers(): {};
    addDungeonCompletion(dungeon: any): void;
    getDungeonCompleteCount(dungeon: any): any;
    getDungeonCompletionSnapshot(): Map<any, any>;
    setDungeonCompleteCount(dungeon: any, count: any): void;
    getMonsterDropsHTML(monster: any, respectArea: any): string;
    getAreaEffectMagnitude(areaEffect: any): number;
    get atLastEventDungeon(): boolean;
    postDataRegistration(): void;
    passiveTick(): void;
    activeTick(): void;
    renderPause(): void;
    renderLocation(): void;
    renderSlayerAreaEffects(): void;
    renderEventMenu(): void;
    renderAreaRequirements(): void;
    retroactivelyAddOneTimeRewards(): void;
    rewardForEnemyDeath(monster: any): void;
    dropEnemyLoot(monster: any): void;
    dropSignetHalfB(monster: any): void;
    dropEnemyBones(monster: any): void;
    dropEnemyGP(monster: any): void;
    startEvent(event: any): void;
    activeEvent: any;
    computeAvailableEventPassives(event: any): void;
    fireEventStageCompletionModal(event: any): void;
    fireEventPassiveModal(): void;
    showEventPassivesModal(): void;
    showStartEventModal(event: any): void;
    showStopEventModal(): void;
    onPassiveSelection(passive: any): void;
    removeAvailablePassive(passive: any): void;
    increaseEventProgress(event: any): void;
    stopEvent(): void;
    renderEventAreas(): void;
    selectMonster(monster: any, areaData: any): void;
    selectedArea: any;
    selectedMonster: any;
    selectDungeon(dungeon: any): void;
    selectEventArea(areaData: any): void;
    preSelection(): boolean;
    stop(fled?: boolean, areaChange?: boolean): boolean;
    createNewEnemy(): void;
    onPageChange(): void;
    renderModifierChange(): void;
    pauseDungeon(): void;
    resumeDungeon(): void;
    openAreaMenu(areaType: any): void;
    closeAreaMenu(): void;
    resetEventState(): void;
    resetOfflineTracking(): void;
    convertFromOldSaveFormat(saveGame: any, idMap: any): void;
    convertDungeonCompletion(dungeonCompletion: any, idMap: any): void;
    getStatsLog(): {
        player: {
            stats: {
                name: string;
                value: number;
            }[];
            modifiers: any[];
        };
        enemy: {
            stats: {
                name: string;
                value: number;
            }[];
            modifiers: {
                name: string;
                value: any;
            }[];
        };
    };
    saveStats(): void;
    compareStatsWithSavedStats(): void;
}
declare class Timer {
    constructor(type: any, action: any);
    type: any;
    action: any;
    _ticksLeft: number;
    _maxTicks: number;
    active: boolean;
    tick(): void;
    start(time: any, offsetByTick?: boolean): void;
    stop(): void;
    get isActive(): boolean;
    get maxTicks(): number;
    get ticksLeft(): number;
    encode(writer: any): any;
    decode(reader: any, version: any): void;
    deserialize(sData: any, version: any): void;
}
