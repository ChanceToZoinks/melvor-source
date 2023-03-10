declare function disableSidebarSwipeTimer(): void;
declare function updateKeys(): void;
declare function getKeyForSaveSlot(slotID: any): string;
declare function setItem(key: any, value: any): void;
declare function getItem(key: any): any;
declare function removeItem(key: any): void;
declare function saveData(vars?: string): void;
declare function getSaveGameOld(keyPrefix: any): {
  version: number;
};
declare function removeSaveOld(keyPrefix: any): void;
declare function updatePartialSettings(partialSettings: any): {
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
};
declare function doesLocalSaveExist(keyPrefix: any): 0 | 1 | 2;
declare function deleteLocalSaveInSlot(slotID: any): void;
declare function exportSave(update?: boolean): void;
declare function setSlotToSaveString(slotID: any, saveString: any): void;
declare function importSaveToSlot(saveString: any, slotID: any): any;
declare function openDeleteMelvorCloudAccount(): void;
declare function confirmDeleteMelvorCloudAccount(): void;
declare function copyToClipboard(input: any): void;
declare function getLocalSaveString(
  customKey?: boolean,
  charID?: number
): string;
declare function getSaveStringOld(keyPrefix: any): string;
declare function getNumericIDMap(): any;
declare function downloadSave(backup?: boolean, slotID?: number): any;
declare function isOldItemStats(itemStats: any): boolean;
declare function isOldMonsterStats(monsterStats: any): boolean;
declare function convertItemStats(oldItemStats: any): {
  itemID: number;
  stats: number[];
}[];
declare function convertMonsterStats(oldMonsterStats: any): {
  monsterID: number;
  stats: number[];
}[];
declare function loadOldSaveGame(savegame: any): any;
declare function setBackupSaveDetails(save: any): void;
declare function confirmedAuthenticated(): void;
declare function checkIfAuthenticated(): any;
declare function loadGameInterface(accessCheck?: boolean): Promise<any>;
declare function loadGameData(): any;
declare function changePageCharacterSelection(page: any): void;
declare function updateUIForAnnouncements(): void;
declare function hideUIForAnnouncement(id: any): void;
declare function updateLocalSaveHeaders(): any;
declare function updateCloudSaveHeaders(): any;
declare function loadSaveFromString(saveString: any): any;
declare function processSaveLoadError(
  slotID: any,
  isCloud: any,
  error: any
): void;
declare function loadLocalSave(slotID: any): any;
declare function loadCloudSave(slotID: any): any;
declare function createNewCharacterInSlot(
  slotID: any,
  gamemode: any,
  characterName: any
): any;
declare var __awaiter: any;
declare let currentCharacter: number;
declare let characterSelected: boolean;
declare let backupSave: string;
declare let dataDeleted: boolean;
declare const keyVersion: "A04";
declare let key: string;
declare let currentStartPage: number;
declare let panVal: number;
declare let GUID: any;
declare function setSaveGUID(): void;
declare let sidebarSwipeTimer: number;
declare let disableSwipeEvents: boolean;
declare let disableSidebarSwipe: boolean;
declare let firstSkillAction: boolean;
declare let loadedIDMap: any;
declare let blockCorruptSaving: boolean;
declare let quickEquipInterval: number;
declare let inFocus: boolean;
declare function onloadEvent(accessCheck?: boolean): void;
declare const INTERFACE_VERSION: 24;
declare const DATA_VERSION: 93;
declare const maxSaveSlots: 6;
declare let isLoadingSave: boolean;
declare let isCreatingSave: boolean;
