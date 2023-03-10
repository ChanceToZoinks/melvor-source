declare function loadCharacterSelection(returnToGame?: boolean): void;
declare function getCloudInfoInSlot(slotID: any): {
  cloudInfo: any;
  hasCloud: boolean;
};
declare function getLocalInfoInSlot(slotID: any): any;
declare function refreshCloudSavesOnClick(): any;
declare function showLocalSaveSelection(): void;
declare function showCloudSaveSelection(): void;
declare function showSaveSelectionLoading(slotLoading: any): void;
declare function showSaveLoadingError(
  slotID: any,
  message: any,
  isCloud: any
): void;
declare function toggleSaveSelectionView(newView?: number): void;
declare function checkSaveExpansions(saveInfo: any): any;
declare function showSaveExpansionError(ns: any): void;
declare function forceLoadSaveOnClick(slotID: any, isCloud: any): any;
declare function loadLocalSaveOnClick(slotID: any, force?: boolean): any;
declare function loadCloudSaveOnClick(slotID: any, force?: boolean): any;
declare function getLocalSaveSummary(slotID: any): any;
declare function getCloudSaveSummary(slotID: any): any;
declare function showImportSaveFromStringForm(slotID: any): any;
declare function showImportSaveFromLinkForm(slotID: any): any;
declare function processImportSaveFromLink(link: any, slotID: any): any;
declare function createLocalSaveOnClick(slotID: any): void;
declare function createNewSave(): void;
declare function createLatestDeathNotification(): string;
declare function showDiscontinuedModal(title: any): void;
declare function createToggleCharacterSelectionViewBtn(): string;
declare function createCharacterSelectSettings(): string;
declare function toggleCharacteSelectWarningPopup(): void;
declare function setNewStartPage(page: any): void;
declare function showModManagerPrompts(): boolean;
declare function displayGamemodeSelection(slotID: any): void;
declare function importSaveOnClick(slotID: any): void;
declare function createSaveShareLink(characterID: any): void;
declare function openDownloadSave(slotID: any): any;
declare function openExportSave(slotID: any): void;
declare function confirmLocalSaveDeletion(slotID: any): any;
declare function confirmCloudSaveDeletion(slotID: any): any;
declare var __awaiter: any;
declare let inCharacterSelection: boolean;
declare let currentSaveView: number;
declare let startingGamemode: any;
declare let createNewCharacterSlot: number;
declare const localSaveHeaders: any[];
declare const cloudSaveHeaders: any[];
declare function setStartingGamemode(gamemode: any): void;
