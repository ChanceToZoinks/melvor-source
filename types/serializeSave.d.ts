declare function getSaveKeysFromDiff(diff: any): any[][];
declare function testDiff(diff: any, vars: any, version: any): void;
declare function deserializeItemStatsPortion(portion: any, subData: any, stats: any, itemStatVer: any): void;
declare function getStatDeserializer(statVar: any): (sData: any, sVersion: any) => any;
declare function decompressSaveString(saveString: any): any;
declare function getSaveFromString(saveString: any, idMap: any): {
    saveGame: {
        SETTINGS: any;
        serialData: DataReader;
        version: number;
    };
    oldFormat: boolean;
};
declare function setSaveKeyToDefault(saveGame: any, key: any): void;
declare function convertHerbloreBonusesFromArray(herbloreBonuses: any): {};
declare function constructRedundantVars(saveGame: any, saveVersion: any): void;
declare function updateSavePre110(savegame: any): void;
declare function updateSavePre121(savegame: any): void;
declare function cleanSaveGame(savegame: any): void;
declare function convertOldMastery(savegame: any): void;
declare const saveFormat2Version: 21;
declare const currentSaveVersion: 36;
declare const numberVarDiff: {
    0: {
        add: string[];
        remove: any[];
    };
    1: {
        add: any[];
        remove: any[];
    };
    2: {
        add: any[];
        remove: string[];
    };
    3: {
        add: any[];
        remove: any[];
    };
    4: {
        add: any[];
        remove: any[];
    };
    5: {
        add: any[];
        remove: any[];
    };
    6: {
        add: string[];
        remove: any[];
    };
    7: {
        add: any[];
        remove: any[];
    };
    8: {
        add: any[];
        remove: any[];
    };
    9: {
        add: any[];
        remove: any[];
    };
    10: {
        add: any[];
        remove: any[];
    };
    11: {
        add: string[];
        remove: any[];
    };
    12: {
        add: any[];
        remove: any[];
    };
    13: {
        add: any[];
        remove: any[];
    };
    14: {
        add: any[];
        remove: any[];
    };
    15: {
        add: any[];
        remove: any[];
    };
    16: {
        add: any[];
        remove: any[];
    };
    17: {
        add: any[];
        remove: string[];
    };
    18: {
        add: any[];
        remove: any[];
    };
    19: {
        add: any[];
        remove: any[];
    };
    20: {
        add: any[];
        remove: any[];
    };
    21: {
        add: any[];
        remove: any[];
    };
    22: {
        add: any[];
        remove: any[];
    };
};
declare const boolVarDiff: {
    0: {
        add: string[];
        remove: any[];
    };
    1: {
        add: any[];
        remove: any[];
    };
    2: {
        add: any[];
        remove: any[];
    };
    3: {
        add: any[];
        remove: any[];
    };
    4: {
        add: any[];
        remove: string[];
    };
    5: {
        add: any[];
        remove: string[];
    };
    6: {
        add: string[];
        remove: any[];
    };
    7: {
        add: any[];
        remove: any[];
    };
    8: {
        add: any[];
        remove: any[];
    };
    9: {
        add: any[];
        remove: any[];
    };
    10: {
        add: any[];
        remove: any[];
    };
    11: {
        add: any[];
        remove: any[];
    };
    12: {
        add: any[];
        remove: any[];
    };
    13: {
        add: any[];
        remove: any[];
    };
    14: {
        add: any[];
        remove: any[];
    };
    15: {
        add: any[];
        remove: any[];
    };
    16: {
        add: any[];
        remove: string[];
    };
    17: {
        add: any[];
        remove: any[];
    };
    18: {
        add: any[];
        remove: any[];
    };
    19: {
        add: any[];
        remove: any[];
    };
    20: {
        add: any[];
        remove: any[];
    };
    21: {
        add: any[];
        remove: any[];
    };
};
declare const otherVarDiff: {
    0: {
        add: string[];
        remove: any[];
    };
    1: {
        add: string[];
        remove: any[];
    };
    2: {
        add: any[];
        remove: string[];
    };
    3: {
        add: any[];
        remove: any[];
    };
    4: {
        add: string[];
        remove: any[];
    };
    5: {
        add: any[];
        remove: any[];
    };
    6: {
        add: string[];
        remove: any[];
    };
    7: {
        add: any[];
        remove: any[];
    };
    8: {
        add: any[];
        remove: any[];
    };
    9: {
        add: string[];
        remove: any[];
    };
    10: {
        add: any[];
        remove: any[];
    };
    11: {
        add: string[];
        remove: any[];
    };
    12: {
        add: any[];
        remove: any[];
    };
    13: {
        add: any[];
        remove: any[];
    };
    14: {
        add: string[];
        remove: any[];
    };
    15: {
        add: string[];
        remove: any[];
    };
    16: {
        add: any[];
        remove: string[];
    };
    17: {
        add: any[];
        remove: string[];
    };
    18: {
        add: any[];
        remove: any[];
    };
    19: {
        add: any[];
        remove: any[];
    };
    20: {
        add: any[];
        remove: any[];
    };
    21: {
        add: any[];
        remove: any[];
    };
};
declare const serialVarDiff: {
    0: {
        add: string[];
        remove: any[];
    };
    1: {
        add: any[];
        remove: any[];
    };
    2: {
        add: any[];
        remove: string[];
    };
    3: {
        add: any[];
        remove: any[];
    };
    4: {
        add: any[];
        remove: any[];
    };
    5: {
        add: any[];
        remove: any[];
    };
    6: {
        add: any[];
        remove: any[];
    };
    7: {
        add: any[];
        remove: any[];
    };
    8: {
        add: any[];
        remove: any[];
    };
    9: {
        add: any[];
        remove: string[];
    };
    10: {
        add: any[];
        remove: string[];
    };
    11: {
        add: any[];
        remove: any[];
    };
    12: {
        add: any[];
        remove: any[];
    };
    13: {
        add: any[];
        remove: any[];
    };
    14: {
        add: any[];
        remove: any[];
    };
    15: {
        add: any[];
        remove: any[];
    };
    16: {
        add: any[];
        remove: string[];
    };
    17: {
        add: any[];
        remove: string[];
    };
    18: {
        add: any[];
        remove: any[];
    };
    19: {
        add: any[];
        remove: any[];
    };
    20: {
        add: any[];
        remove: any[];
    };
    21: {
        add: any[];
        remove: any[];
    };
};
declare const nestedVarDiff: {
    0: {
        add: string[];
        remove: any[];
    };
    1: {
        add: any[];
        remove: any[];
    };
    2: {
        add: any[];
        remove: any[];
    };
    3: {
        add: any[];
        remove: any[];
    };
    4: {
        add: any[];
        remove: any[];
    };
    5: {
        add: any[];
        remove: any[];
    };
    6: {
        add: any[];
        remove: any[];
    };
    7: {
        add: any[];
        remove: any[];
    };
    8: {
        add: any[];
        remove: any[];
    };
    9: {
        add: any[];
        remove: string[];
    };
    10: {
        add: any[];
        remove: any[];
    };
    11: {
        add: any[];
        remove: any[];
    };
    12: {
        add: any[];
        remove: any[];
    };
    13: {
        add: any[];
        remove: any[];
    };
    14: {
        add: any[];
        remove: any[];
    };
    15: {
        add: any[];
        remove: any[];
    };
    16: {
        add: any[];
        remove: any[];
    };
    17: {
        add: any[];
        remove: any[];
    };
    18: {
        add: any[];
        remove: any[];
    };
    19: {
        add: any[];
        remove: any[];
    };
    20: {
        add: any[];
        remove: any[];
    };
    21: {
        add: any[];
        remove: any[];
    };
};
declare namespace defaultSaveValues {
    export const ignoreBankFull: boolean;
    export const continueThievingOnStun: boolean;
    export const autoRestartDungeon: boolean;
    export const autoSaveCloud: boolean;
    export const darkMode: boolean;
    export const showGPNotify: boolean;
    export const enableAccessibility: boolean;
    export const showEnemySkillLevels: boolean;
    export const confirmationOnClose: boolean;
    export const autoPotion: boolean;
    export const showCommas: boolean;
    export const showVirtualLevels: boolean;
    export const secretAreaUnlocked: boolean;
    export const showSaleNotifications: boolean;
    export const showShopNotifications: boolean;
    export const pauseOfflineActions: boolean;
    export const showCombatMinibar: boolean;
    export const showCombatMinibarCombat: boolean;
    export const showSkillMinibar: boolean;
    export const disableAds: boolean;
    export const useCombinationRunes: boolean;
    export const firstTimeLoad: boolean;
    export const autoSlayer: boolean;
    export const firstTime: number;
    export const nameChanges: number;
    export const gp: number;
    export const defaultPageOnLoad: number;
    export const levelUpScreen: number;
    export const attackStyle: number;
    export const currentCombatFood: number;
    export const showItemNotify: number;
    export const myBankVersion: number;
    export const buyQty: number;
    export const sellQty: number;
    export const accountGameVersion: number;
    export const formatNumberSetting: number;
    export const saveTimestamp: number;
    export const currentGamemode: number;
    export const raidCoins: number;
    export const agilityPassivePillarActive: number;
    export const username: string;
    export const gameUpdateNotification: string;
    export { saveFormat2Version as version };
    export const selectedEquipmentSet: number;
    export const selectedSpell: number;
    export const prayerPoints: number;
    export const slayerCoins: number;
    export const activeAurora: number;
    export const equipmentSets: any[];
    export const ammo: number;
    export const currentBankUpgrade: number;
    export const currentAxe: number;
    export const treeCutLimit: number;
    export const bankMax: number;
    export const currentRod: number;
    export const upgradedToRange: boolean;
    export const currentPickaxe: number;
    export const currentCookingFire: number;
    export const showSkillNav: boolean;
    export const currentAutoEat: number;
    export const showHPNotify: boolean;
    export const equipmentSwapPurchased: boolean;
    export const autoSlayerUnlocked: boolean;
    export const xmasPresents: number;
    export const cookingStockpiles: {
        itemID: number;
        qty: number;
    }[];
    export const tutorialComplete: boolean;
    export const tutorialProgress: number;
    export const christmas2021Progress: number;
    export const christmas2021PresentProgress: number[];
    export const bankTabIcons: any[];
    export const customMinibarItems: {};
}
declare const numberVars: any[][];
declare const boolVars: any[][];
declare const otherVars: any[][];
declare const serialVars: any[][];
declare const nestedVars: any[][];
declare function deserializeNumberArray(sData: any, sVersion: any): any[];
declare function deserializeRaidHistory(sData: any, sVersion: any): any[];
declare function deserializeMastery(sData: any, sVersion: any): {};
declare function deserializeEquipment(sData: any, sVersion: any): {
    equipment: any[];
    ammo: any;
    summonAmmo: any[];
}[];
declare function deserializeBoolArray(sData: any, sVersion: any): any;
declare function deserializeMonsterStats(sData: any, sVersion: any): {
    monsterID: number;
    stats: any;
}[];
declare const itemStatTypes: string[];
declare const curItemStatVer: 1;
declare function deserializeItemStats(sData: any, sVersion: any, idMap: any): any;
declare function deserializeSettings(sData: any, sVersion: any): {
    bank: {
        bankBorder: number;
        currentEquipDefault: boolean;
        defaultBankSort: number;
        defaultItemTab: any[];
    };
    mastery: {
        hideMaxLevel: boolean;
        confirmationCheckpoint: boolean;
    };
    general: {
        pushNotificationOffline: boolean;
        pushNotificationFarming: boolean;
        enabledOfflineCombat: boolean;
        enableNeutralSpecModifiers: boolean;
        autoReusePotion: any[];
        miniSidebar: boolean;
        autoEquipFood: boolean;
        autoSwapFood: boolean;
        continueThievingOnStun: boolean;
        showPotionTier: boolean[];
        allowPerfectCook: boolean;
        showDestroyCropConfirmation: boolean;
        showAstrologyMaxRollConfirmation: boolean;
        showQtyInItemNotification: boolean;
        showItemPreservationNotification: boolean;
        showSlayerCoinNotification: boolean;
        combatMinibarShowEquipmentSets: boolean;
        combatMinibarShowEnemyBars: boolean;
    };
    notifications: {
        combatStunned: boolean;
        combatSleep: boolean;
        summoningMark: boolean;
    };
    performance: {
        disableDamageSplashes: boolean;
        disableProgressBars: boolean;
    };
    accessibility: {
        colourBlindMode: number;
    };
} | {
    bank: {
        bankBorder: any;
        currentEquipDefault: boolean;
        defaultBankSort: any;
        defaultItemTab: {
            itemID: any;
            tab: any;
        }[];
    };
    mastery: {
        hideMaxLevel: boolean;
        confirmationCheckpoint: boolean;
    };
    general: {
        pushNotificationOffline: boolean;
        pushNotificationFarming: boolean;
        enabledOfflineCombat: boolean;
        enableNeutralSpecModifiers: boolean;
        autoReusePotion: any[];
        miniSidebar: boolean;
        autoEquipFood: boolean;
        autoSwapFood: boolean;
        continueThievingOnStun: boolean;
        showPotionTier: boolean[];
        allowPerfectCook: boolean;
        showDestroyCropConfirmation: boolean;
        showAstrologyMaxRollConfirmation: boolean;
        showQtyInItemNotification: boolean;
        showItemPreservationNotification: boolean;
        showSlayerCoinNotification: boolean;
        combatMinibarShowEquipmentSets: boolean;
        combatMinibarShowEnemyBars: boolean;
    };
    notifications: {
        combatStunned: boolean;
        combatSleep: boolean;
        summoningMark: boolean;
    };
    performance: {
        disableDamageSplashes: boolean;
        disableProgressBars: boolean;
    };
    accessibility: {
        colourBlindMode: number;
    };
};
declare function deserializeSettingsOld(sData: any, sVersion: any): {
    bank: {
        bankBorder: any;
        currentEquipDefault: boolean;
        defaultBankSort: any;
        defaultItemTab: {
            itemID: any;
            tab: any;
        }[];
    };
    mastery: {
        hideMaxLevel: boolean;
        confirmationCheckpoint: boolean;
    };
    general: {
        pushNotificationOffline: boolean;
        pushNotificationFarming: boolean;
        enabledOfflineCombat: boolean;
        enableNeutralSpecModifiers: boolean;
        autoReusePotion: any[];
        miniSidebar: boolean;
        autoEquipFood: boolean;
        autoSwapFood: boolean;
        continueThievingOnStun: boolean;
        showPotionTier: boolean[];
        allowPerfectCook: boolean;
        showDestroyCropConfirmation: boolean;
        showAstrologyMaxRollConfirmation: boolean;
        showQtyInItemNotification: boolean;
        showItemPreservationNotification: boolean;
        showSlayerCoinNotification: boolean;
        combatMinibarShowEquipmentSets: boolean;
        combatMinibarShowEnemyBars: boolean;
    };
    notifications: {
        combatStunned: boolean;
        combatSleep: boolean;
        summoningMark: boolean;
    };
    performance: {
        disableDamageSplashes: boolean;
        disableProgressBars: boolean;
    };
    accessibility: {
        colourBlindMode: number;
    };
};
declare function deserializeDefaultItemTabs(sData: any, sVersion: any): {
    itemID: any;
    tab: any;
}[];
declare function deserializeBank(sData: any, sVersion: any): {
    id: any;
    qty: any;
    tab: any;
    locked: boolean;
}[];
declare namespace deserializeStats {
    function general(sData: any, sVersion: any): any;
    function woodcutting(sData: any, sVersion: any): any;
    function firemaking(sData: any, sVersion: any): any;
    function fishing(sData: any, sVersion: any): any;
    function cooking(sData: any, sVersion: any): any;
    function mining(sData: any, sVersion: any): any;
    function smithing(sData: any, sVersion: any): any;
    function combat(sData: any, sVersion: any): any;
    function thieving(sData: any, sVersion: any): any;
    function farming(sData: any, sVersion: any): any;
    function fletching(sData: any, sVersion: any): any;
    function crafting(sData: any, sVersion: any): any;
    function runecrafting(sData: any, sVersion: any): any;
    function herblore(sData: any, sVersion: any): any;
}
declare function deserializeGlovesTracker(sData: any, sVersion: any): {
    isActive: boolean;
    remainingActions: any;
}[];
declare function deserializeRockData(sData: any, sVersion: any): {
    maxHP: any;
    damage: any;
    depleted: boolean;
    respawnTimer: any;
}[];
declare function deserializeSlayerTask(sData: any, sVersion: any): {
    monsterID: any;
    count: any;
    tier: any;
    extended: boolean;
}[];
declare function deserializeFarmingAreas(sData: any, sVersion: any): any[];
declare function deserializeHerbloreBonuses(sData: any, sVersion: any): {};
declare function deserializeTutorialTips(sData: any, sVersion: any): any[];
declare function deserializeShopItems(sData: any, sVersion: any): Map<any, any>;
declare function deserializeCombatData(sData: any, sVersion: any): {
    player: {
        hitpoints: any;
    };
};
declare function deserializeFood(sData: any, sVersion: any): {
    itemID: any;
    qty: any;
}[];
declare class DataReader {
    constructor(data: any);
    data: any;
    dataIndex: number;
    get dataLength(): any;
    get atEnd(): boolean;
    getBool(): boolean;
    getNumber(): any;
    nextValue(): any;
    getChunk(length: any): any;
    getVariableLengthChunk(): DataReader;
    getBoolArray(): any;
    getStunFlavour(): "Stun" | "Freeze";
    getActionType(): "Attack" | "Nothing";
    getAttack(game: any, idMap: any): any;
    getAttackEffect(attack: any): any;
    getDOTType(): any;
    getLocation(game: any, idMap: any): any;
    getRandomAttackType(): any;
    getMonsterAttackType(): any;
    getString(): string;
    getCombatModifierArray(): {
        key: any;
        value: any;
    }[];
    getModifierArray(game: any, idMap: any): ({
        key: any;
        values: {
            skill: any;
            value: any;
        }[];
        value?: undefined;
    } | {
        key: any;
        value: any;
        values?: undefined;
    })[];
    getTownshipBuildingDataMap(game: any, idMap: any): Map<any, any>;
    getAstrologyModifierArray(game: any, idMap: any): ({
        key: any;
        values: {
            skill: any;
            value: any;
        }[];
        value?: undefined;
    } | {
        key: any;
        value: any;
        values?: undefined;
    })[][];
    getRaidSelectionArray(): {
        itemID: any;
        quantity: any;
        isAlt: boolean;
    }[];
    getItemQuantities(): {
        id: any;
        qty: any;
    }[];
    getRawData(): any;
}
declare var DotTypeIDs: any;
declare var AttackTypeID: any;
