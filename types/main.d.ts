declare function updateWindow(): any;
declare function showGameLoadError(e: any): void;
declare function loadLore(): void;
declare function cleanSaveFile(): void;
declare function getCloudSaveHeartbeatInterval(): number;
declare function updateEvery10Seconds(): void;
declare function isIOS(): boolean;
declare function isAndroid(): boolean;
declare function isMobile(): boolean | typeof isAndroid;
declare function isSteam(): boolean;
declare function openNextModal(): void;
declare function addModalToQueue(modal: any): void;
declare function showBaneCompletionModal(): void;
declare function onSaveDataLoad(): any;
declare function resetAccountData(): void;
declare function setDiscordRPCDetails(): any;
declare function initSteam(): void;
declare function unlockSteamAchievement(achievementName: any, i: any): void;
declare function resetSteamAchievements(): void;
declare function showPageLoader(): void;
declare function initTooltips(): void;
declare function generateLoreModals(): string;
declare function resetSkillsTo99(confirmed?: boolean): void;
declare function setBackground(id: any): void;
declare function initChangelog(): void;
declare var __awaiter: any;
declare const useCDN: true;
declare const CDNVersion: "v018";
declare const CDNEndpoint: "https://cdn.melvor.net/core";
declare const DEBUGENABLED: false;
declare const releaseDate: 1637258400000;
declare const DEBUG_REPORTER: any[];
declare const CDNDIR: string;
declare const gameTitle: "Melvor Idle :: v1.1.1";
declare let currentTitleNewsID: any[];
declare let playFabEventQueue: any[];
declare let isLoaded: boolean;
declare let confirmedLoaded: boolean;
declare let steamAchievements: any[];
declare let connectedToSteam: boolean;
declare let lolYouDiedGetRekt: boolean;
declare let numberMultiplier: number;
declare let returnToGameAfterSubmission: boolean;
declare const modalQueue: any[];
declare const cloudSaveHeartbeatLevel: 0;
declare let loadingOfflineProgress: boolean;
declare let modalIsOpen: boolean;
declare let offlineProgressCache: any;
declare let offlineModalID: number;
declare const tenSeconds: 10000;
declare let tenSecondUpdateTimeout: number;
declare let gameVersionChecker: number;
declare function isAdsPath(): boolean;
declare function isDemoSkill(skill: any): boolean;
declare function getLockedTitle(skill: any, dungeon: any): string;
declare function getLockedMessage(skill: any, dungeon: any): string;
declare let IAPPrice: string;
declare function getLocaleIAPPrice(): void;
declare const IAPPurchaseInProcess: false;
declare let IAPTimer: any;
declare function performUnlockIAP(productID: any): void;
declare function performUnlockExpansionIAP(productID: any): void;
declare function startIAPPurchaseInterval(): void;
declare function getAndroidIAPStatus(): Promise<any>;
declare function updateMobilePurchaseStatus(): void;
declare function getLockedBtn(productID: any): string;
