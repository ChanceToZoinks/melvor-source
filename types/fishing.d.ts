declare class Fish extends SingleProductRecipe {
    strengthXP: any;
    baseMinInterval: any;
    baseMaxInterval: any;
}
declare class FishingArea extends NamespacedObject {
    constructor(namespace: any, data: any, fishing: any, game: any);
    isSecret: boolean;
    _name: any;
    fishChance: any;
    junkChance: any;
    specialChance: any;
    fish: any;
    _description: any;
    requiredItem: any;
    get name(): any;
    get description(): any;
}
declare class Fishing extends GatheringSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: FishingRenderQueue;
    secretAreaUnlocked: boolean;
    selectedAreaFish: Map<any, any>;
    hiddenAreas: Set<any>;
    junkItems: any[];
    specialItems: DropTable;
    areas: NamespaceRegistry;
    getTotalUnlockedMasteryActions(): any;
    get chanceForLostChest(): any;
    get actionInterval(): number;
    get actionLevel(): any;
    get masteryAction(): any;
    get chanceForOneExtraFish(): number;
    get activeFish(): any;
    easterEgg: {
        original: any;
        equipped: any;
        reward: any;
    };
    lostChestItem: any;
    unlockSecretArea(): void;
    getMinFishInterval(fish: any): number;
    getMaxFishInterval(fish: any): number;
    getAreaChances(area: any): FishingAreaChances;
    preAction(): void;
    get actionRewards(): Rewards;
    postAction(): void;
    get masteryModifiedInterval(): number;
    onEquipmentChange(): void;
    onAreaStartButtonClick(area: any): void;
    activeFishingArea: any;
    renderHiddenAreas(): void;
    onAreaHeaderClick(area: any): void;
    onAreaFishSelection(area: any, fish: any): void;
    renderSelectedAreaFish(): void;
    renderSelectedFishRates(): void;
    renderAreaChances(): void;
    renderAreaButtons(): void;
    renderAreaUnlock(): void;
    renderActiveArea(): void;
    convertFromOldFormat(savegame: any): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
}
declare class FishingAreaChances {
    fish: number;
    special: number;
    junk: number;
    setChancesFromArea(area: any): void;
    addBonusSpecialChance(amount: any): void;
    shiftFishToSpecial(amount: any): void;
    shiftJunkToFish(amount: any): void;
    rollForRewardType(): any;
}
declare var FishingRewardType: any;
declare class FishingRenderQueue extends GatheringSkillRenderQueue {
    selectedAreaFish: boolean;
    selectedAreaFishRates: boolean;
    areaChances: boolean;
    areaUnlock: boolean;
    areaButtons: boolean;
    activeArea: boolean;
}
