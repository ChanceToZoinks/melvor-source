declare function adjustZoom(zoomLevel: any): void;
declare function toggleFullScreen(): void;
declare function localizeSettings(): void;
declare function showEnableOfflineCombatModal(): void;
declare function dismissOfflineCombatAlert(): void;
declare function dismissOfflineThievingAlert(): void;
declare function toggleOfflineCombatCheckbox(id: any): void;
declare function updateEnableOfflineCombatBtn(): void;
declare function enableOfflineCombat(): void;
declare function enableOfflineThieving(): void;
declare function initLocalStorageSettings(): void;
declare class DefaultPageOption {
    constructor(value: any);
    value: any;
    get name(): any;
    get media(): any;
}
declare class Settings {
    constructor(game: any);
    game: any;
    boolData: {
        continueIfBankFull: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        continueThievingOnStun: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        autoRestartDungeon: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        autoCloudSave: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        darkMode: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        showGPNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableAccessibility: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showEnemySkillLevels: {
            currentValue: boolean;
            defaultValue: boolean;
            name: string;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        showCloseConfirmations: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        hideThousandsSeperator: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: string;
            saveOnChange: boolean;
        };
        showVirtualLevels: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        showSaleConfirmations: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showShopConfirmations: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        pauseOnUnfocus: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showCombatMinibar: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        showCombatMinibarCombat: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showSkillingMinibar: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        useCombinationRunes: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        enableAutoSlayer: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showItemNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        useSmallLevelUpNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        useDefaultBankBorders: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        defaultToCurrentEquipSet: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        hideMaxLevelMasteries: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: () => void;
            saveOnChange: boolean;
        };
        showMasteryCheckpointconfirmations: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableOfflinePushNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableFarmingPushNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableOfflineCombat: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: string;
            shouldChange: (oldValue: any, newValue: any) => any;
            saveOnChange: boolean;
        };
        enableMiniSidebar: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        enableAutoEquipFood: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableAutoSwapFood: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enablePerfectCooking: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        showCropDestructionConfirmations: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showAstrologyMaxRollConfirmations: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showQuantityInItemNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showItemPreservationNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showSlayerCoinNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showEquipmentSetsInCombatMinibar: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        showBarsInCombatMinibar: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: (oldValue: any, newValue: any) => void;
            saveOnChange: boolean;
        };
        showCombatStunNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showCombatSleepNotifications: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showSummoningMarkDiscoveryModals: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableCombatDamageSplashes: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableProgressBars: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        showTierIPotions: {
            currentValue: boolean;
            defaultValue: boolean;
            name: string;
            onChange: () => void;
            saveOnChange: boolean;
        };
        showTierIIPotions: {
            currentValue: boolean;
            defaultValue: boolean;
            name: string;
            onChange: () => void;
            saveOnChange: boolean;
        };
        showTierIIIPotions: {
            currentValue: boolean;
            defaultValue: boolean;
            name: string;
            onChange: () => void;
            saveOnChange: boolean;
        };
        showTierIVPotions: {
            currentValue: boolean;
            defaultValue: boolean;
            name: string;
            onChange: () => void;
            saveOnChange: boolean;
        };
        enableEyebleachMode: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            saveOnChange: boolean;
        };
        enableQuickConvert: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: string;
            saveOnChange: boolean;
        };
        showLockedTownshipBuildings: {
            currentValue: boolean;
            defaultValue: boolean;
            readonly name: any;
            onChange: () => void;
            saveOnChange: boolean;
        };
    };
    choiceData: {
        showNeutralAttackModifiers: {
            currentValue: boolean;
            defaultValue: boolean;
            saveOnChange: boolean;
            readonly name: string;
            options: {
                value: boolean;
                readonly name: any;
            }[];
            onChange: (oldValue: any, newValue: any) => void;
        };
        defaultPageOnLoad: {
            currentValue: any;
            defaultValue: any;
            saveOnChange: boolean;
            readonly name: any;
            options: any[];
            shouldChange: (oldValue: any, newValue: any) => boolean;
        };
        formatNumberSetting: {
            currentValue: number;
            defaultValue: number;
            saveOnChange: boolean;
            readonly name: string;
            options: {
                value: number;
                readonly name: string;
            }[];
        };
        bankSortOrder: {
            currentValue: number;
            defaultValue: number;
            saveOnChange: boolean;
            readonly name: any;
            options: {
                value: number;
                readonly name: any;
            }[];
        };
        colourBlindMode: {
            currentValue: number;
            defaultValue: number;
            saveOnChange: boolean;
            name: string;
            options: {
                value: number;
                name: string;
            }[];
            onChange: (oldValue: any, newValue: any) => void;
        };
    };
    get continueIfBankFull(): boolean;
    get continueThievingOnStun(): boolean;
    get autoRestartDungeon(): boolean;
    get autoCloudSave(): boolean;
    get darkMode(): boolean;
    get showGPNotifications(): boolean;
    get enableAccessibility(): boolean;
    get showEnemySkillLevels(): boolean;
    get showCloseConfirmations(): boolean;
    get hideThousandsSeperator(): boolean;
    get showVirtualLevels(): boolean;
    get showSaleConfirmations(): boolean;
    get showShopConfirmations(): boolean;
    get pauseOnUnfocus(): boolean;
    get showCombatMinibar(): boolean;
    get showCombatMinibarCombat(): boolean;
    get showSkillingMinibar(): boolean;
    get useCombinationRunes(): boolean;
    get enableAutoSlayer(): boolean;
    get useDefaultBankBorders(): boolean;
    get defaultToCurrentEquipSet(): boolean;
    get hideMaxLevelMasteries(): boolean;
    get showMasteryCheckpointconfirmations(): boolean;
    get enableOfflinePushNotifications(): boolean;
    get enableFarmingPushNotifications(): boolean;
    get enableOfflineCombat(): boolean;
    get showNeutralAttackModifiers(): boolean;
    get enableMiniSidebar(): boolean;
    get enableAutoEquipFood(): boolean;
    get enableAutoSwapFood(): boolean;
    get enablePerfectCooking(): boolean;
    get showCropDestructionConfirmations(): boolean;
    get showAstrologyMaxRollConfirmations(): boolean;
    get showQuantityInItemNotifications(): boolean;
    get showItemPreservationNotifications(): boolean;
    get showSlayerCoinNotifications(): boolean;
    get showEquipmentSetsInCombatMinibar(): boolean;
    get showBarsInCombatMinibar(): boolean;
    get showCombatStunNotifications(): boolean;
    get showCombatSleepNotifications(): boolean;
    get showSummoningMarkDiscoveryModals(): boolean;
    get enableCombatDamageSplashes(): boolean;
    get enableProgressBars(): boolean;
    get showItemNotifications(): boolean;
    get useSmallLevelUpNotifications(): boolean;
    get showTierIPotions(): boolean;
    get showTierIIPotions(): boolean;
    get showTierIIIPotions(): boolean;
    get showTierIVPotions(): boolean;
    get showPotionTiers(): boolean[];
    get enableEyebleachMode(): boolean;
    get enableQuickConvert(): boolean;
    get showLockedTownshipBuildings(): boolean;
    get defaultPageOnLoad(): any;
    get formatNumberSetting(): number;
    get bankSortOrder(): number;
    get colourBlindMode(): number;
    postDataRegistration(): void;
    encode(writer: any): any;
    decode(reader: any, version: any): void;
    convertFromOldFormat(savegame: any, idMap: any): void;
    initializeToggles(): void;
    initializeChoices(): void;
    isBooleanSetting(settingID: any): boolean;
    isChoiceSetting(settingID: any): boolean;
    toggleSetting(setting: any): void;
    setTogglesChecked(setting: any, isChecked: any): void;
    changeChoiceSetting(setting: any, newValue: any): void;
    getOptionFromValue(value: any, data: any): any;
    onLoad(): void;
}
declare var localStorageSettings: {};
declare const colourBlindClasses: {
    0: string;
    1: string;
};
declare const offlineCombatChecks: boolean[];
