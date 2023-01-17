declare function getCloudCharacters(): void;
declare function connectionFailedPlayFab(): void;
declare function connectionSuccessPlayFab(): void;
declare function deleteCloudSave(): void;
declare function forceSync(closeAfter?: boolean, ignorePlayFab?: boolean): void;
declare function forceSyncCooldown(): void;
declare function checkGameVersion(): void;
declare function checkPatreon(): void;
declare function disconnectPatreon(): void;
declare function loadCloudOptions(isCloud: any): void;
declare function checkTestAccess(): void;
declare function confirmTestAccess(): void;
declare function checkTestAccessInit(
  forceLoad?: boolean,
  accessCheck?: boolean
): void;
declare function checkTestAccessPatreon(
  forceLoad?: boolean,
  accessCheck?: boolean
): void;
declare function killPage(): void;
declare function playFabLoginWithCustomID(playFabID: any): void;
declare function getPlayFabSave(): void;
declare function onPlayFabSaveLoad(result: any, error: any): any;
declare function getPlayFabData(key: any): Promise<any>;
declare function playFabStoreData(key: any, value: any): void;
declare function playFabStoreDataCallback(result: any, error: any): void;
declare function playFabSaveData(
  forceSave?: boolean,
  closeAfterSave?: boolean
): void;
declare function saveCallback(
  result: any,
  error: any,
  forceSave?: boolean
): void;
declare function showPlayFabSaveSuccessfulNotification(): void;
declare function showPlayFabSaveDeletedNotification(): void;
declare function createPlayFabSaves(): any;
declare function enableCloudCharacterButton(): void;
declare function deletePlayFabSave(characterID?: number): void;
declare function sendPlayFabEvent(eventName: any, args: any): void;
declare function sendPlayFabEventCallback(result: any, error: any): void;
declare function queuePlayFabEvents(eventName: any, args: any): void;
declare function submitQueuedPlayFabEvents(): void;
declare function fetchLatestTitleNews(): void;
declare function displayLatestTitleNews(result: any, error: any): void;
declare function createTitleNewsElement(
  timestamp: any,
  title: any,
  body: any,
  newsId: any
): string;
declare function readPlayFabNews(): void;
declare function loginToMelvorCloud(playFab?: boolean): void;
declare function registerToMelvorCloud(): void;
declare function forgotPasswordMelvorCloud(): void;
declare function disableLoginForm(): void;
declare function enableLoginForm(): void;
declare function disableRegisterForm(): void;
declare function enableRegisterForm(): void;
declare function disableForgotForm(): void;
declare function enableForgotForm(): void;
declare function disableChangeEmailForm(): void;
declare function enableChangeEmailForm(): void;
declare function disableChangePasswordForm(): void;
declare function enableChangePasswordForm(): void;
declare function updateEmailMelvorCloud(): void;
declare function updatePasswordMelvorCloud(): void;
declare function cloudSaveAndExit(): void;
declare function updateLastCloudSaveTimestamp(): void;
declare function generateUUID(length: any): string;
declare function pingAsActive(forcePing?: boolean): void;
declare function postActiveUserDevice(): void;
declare function failSteamPurchase(): void;
declare function confirmSteamPurchase(): void;
declare function warningSteamPurchase(): void;
declare function failMobilePurchase(): void;
declare function confirmMobilePurchase(): void;
declare function warningMobilePurchase(): void;
declare function failBrowserPurchase(): void;
declare function confirmBrowserPurchase(): void;
declare function warningBrowserPurchase(): void;
declare function showActivationError(error: any): void;
declare function hideActivationError(error: any): void;
declare function warnActivationNotLoggedIn(): void;
declare var __awaiter: any;
declare const CLOUDURL: "";
declare const ENABLEPLAYFABAUTH: false;
declare let forceSaveCooldown: boolean;
declare let forceSyncCooldownTimer: number;
declare let connectedToCloud: boolean;
declare let connectedToPlayFab: boolean;
declare let storedCloudSaves: string[];
declare let playFabSaves: any[];
declare let playFabLoginTimestamp: number;
declare let forceSave: boolean;
declare let lastSaveTimestamp: number;
declare let lastLoginTimestamp: number;
declare let saveAndClose: boolean;
declare let forceSyncSpamPrevention: number;
declare let autoCloudSaveInterval: number;
declare function gameOriginCheck(): boolean;
declare function checkConnectionToCloud(
  forceLoad?: boolean,
  accessCheck?: boolean
): void;
declare function playFabLoginCallback(result: any, error: any): any;
declare function setAutoCloudSaveInterval(): void;
declare function linkSteamAccountToPlayFab(): void;
declare function getPlayFabInfo(): void;
declare function getSteamPurchaseStatus(): Promise<any>;
declare function checkSteamPurchase(): void;
declare function getMobilePurchaseStatus(): Promise<any>;
declare function checkMobilePurchase(): void;
declare let pingCheck: number;
declare function updatePlayerTags(): void;
