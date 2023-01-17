declare function toggleSkillMinibar(): void;
declare function displayQuickItemEquip(): void;
declare class Minibar {
    constructor(game: any);
    game: any;
    pets: any[];
    upgrades: any[];
    customItems: Map<any, any>;
    renderQueue: {
        quickEquipIcons: boolean;
    };
    quickEquipIcons: Map<any, any>;
    minibar: any[];
    masteryUnlocks: {
        element: any;
    };
    milestones: {
        element: any;
    };
    summoning: {
        element: any;
    };
    quickEquip: {
        element: any;
    };
    get minibarElement(): HTMLElement;
    get quickEquipContainer(): HTMLElement;
    initialize(): void;
    render(): void;
    encode(writer: any): any;
    decode(reader: any, version: any): void;
    convertFromOldformat(save: any, idMap: any): void;
    getCustomItemsForSkill(skill: any): any;
    setCustomItemsToDefault(skill: any): any[];
    addItemOnDiscovery(item: any): void;
    toggleCustomItem(skill: any, item: any): boolean;
    isCustomItemSet(skill: any, item: any): any;
    setSkill(skill: any): void;
    activeSkill: any;
    updateEquippedTicks(): void;
    destroyQuickEquipIcons(): void;
    createQuickEquipIcons(skill: any): void;
    createQuickEquipIcon(item: any, skill: any): void;
    createPetItem(pet: any): {
        element: any;
    };
    createUpgradeItem(upgrade: any): {
        element: any;
    };
    createMinibarItem(elementID: any, media: any, tooltipContent: any, options: any): {
        element: any;
    };
    applyOptionsToElement(element: any, options: any): void;
    createElementTooltip(element: any, tooltipContent: any): any;
    removeItem(item: any): void;
    changeItemOrder(newIndex: any, oldIndex: any): void;
}
