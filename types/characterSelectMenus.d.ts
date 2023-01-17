declare class CharacterDisplayElement extends HTMLElement {
    _content: DocumentFragment;
    selectCharacterButton: any;
    gamemodeBackground: any;
    gamemodeIcon: any;
    saveType: any;
    characterName: any;
    totalSkillLevel: any;
    gpAmount: any;
    offlineActionImage: any;
    offlineActionName: any;
    offlineActionTime: any;
    saveTimestamp: any;
    timestampComparison: any;
    connectedCallback(): void;
    toggleTestWarning(isTest: any): void;
    setLocalSave(slotID: any, localInfo: any, cloudInfo: any, disableCallbacks?: boolean): void;
    setCloudSave(slotID: any, cloudInfo: any, localInfo: any, disableCallbacks?: boolean): void;
    setDisabled(): void;
    disableCallbacks(): void;
    setCharacter(slotID: any, headerInfo: any, isCloud: any, disableCallbacks?: boolean): void;
    updateTimestampComparison(viewedInfo: any, comparedInfo: any): void;
}
declare class SaveSlotDisplayElement extends HTMLElement {
    _content: DocumentFragment;
    slotTitle: any;
    settingsButton: any;
    importSaveOption: any;
    forceLoadOption: any;
    settingsDivider: any;
    createSaveLinkOption: any;
    downloadSaveOption: any;
    exportSaveOption: any;
    deleteSettingsDivider: any;
    deleteLocalOption: any;
    deleteCloudOption: any;
    emptySlotContainer: any;
    emptySlotButton: any;
    emptySlotText: any;
    existingCloudWarning: any;
    saveLoadingSpinner: any;
    characterDisplay: any;
    connectedCallback(): void;
    setSlotID(slotID: any): void;
    showCloudSettings(forceLoad: any): void;
    showEmptySaveSettings(): void;
    showLocalSettings(forceLoad: any): void;
    setEmptyOutline(type: any): void;
    setEmptyLocal(slotID: any, hasCloud: any): void;
    setEmptyCloud(slotID: any): void;
    setError(slotID: any, message: any, isCloud: any): void;
    setCloudSave(slotID: any, cloudInfo: any, localInfo: any): void;
    setLocalSave(slotID: any, localInfo: any, cloudInfo: any): void;
    setSaveLoading(): void;
    setDisabled(): void;
}
declare class GamemodeSelectionElement extends HTMLElement {
    rules: any[];
    _content: DocumentFragment;
    selectButton: any;
    backgroundDiv: any;
    eventNotice: any;
    timeRemaining: any;
    name: any;
    safety: any;
    description: any;
    connectedCallback(): void;
    setGamemode(gamemode: any): void;
}
