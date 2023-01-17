declare function getEquipmentImageElements(slotID: any): HTMLElement[];
declare function getEquipmentQtyElements(slot: any): HTMLElement[];
declare const MAX_QUICK_EQUIP_ITEMS: 3;
declare class Equipment {
    static getEquipStatDescription(type: any, value: any): any;
    constructor(game: any);
    game: any;
    slotArray: any[];
    slotMap: Map<any, any>;
    itemChargeUsers: Set<any>;
    itemQuantityUsers: Set<any>;
    bankItemUsers: Set<any>;
    slots: {};
    get isWeapon2H(): any;
    getItemsAddedOnEquip(item: any, slot: any): {
        item: any;
        quantity: any;
    }[];
    getItemsAddedOnUnequip(slot: any): {
        item: any;
        quantity: any;
    };
    getSlotsToUnequip(itemToEquip: any, slot: any): any[];
    getRootSlot(slotType: any): any;
    equipItem(itemToEquip: any, slot: any, quantity: any): void;
    unequipItem(slot: any): void;
    forceAddAllToBank(): void;
    checkForItem(item: any): boolean;
    checkForItemID(itemID: any): boolean;
    checkForItemIDs(itemIDs: any): boolean;
    getSlotOfItem(item: any): any;
    getQuantityOfItem(item: any): any;
    addQuantityToSlot(slot: any, quantity: any): void;
    removeQuantityFromSlot(slot: any, quantity: any): boolean;
    addEquipmentStats(stats: any): void;
    getSnapshot(): Map<any, any>;
    render(player: any): void;
    renderQuantity(): void;
    updateTooltips(synergyDescription: any): void;
    getSynergyTooltipContent(synergyDescription: any): string;
    encode(writer: any): any;
    decode(reader: any, version: any, addOnFail?: boolean): void;
    deserialize(reader: any, version: any, idMap: any, addOnFail?: boolean): void;
    convertFromOldFormat(oldData: any, idMap: any): void;
    unequipAll(): void;
}
declare class EquipmentSet {
    constructor(game: any);
    game: any;
    prayerSelection: Set<any>;
    equipment: Equipment;
    spellSelection: SpellSelection;
    encode(writer: any): any;
    decode(reader: any, version: any, addOnFail?: boolean): void;
}
declare class EquipmentSetMenu {
    constructor(containerID: any, buttonClasses: any);
    buttonClasses: any;
    buttons: any[];
    highlightedButton: number;
    container: HTMLElement;
    render(sets: any, selected: any, player: any): void;
    renderSets(sets: any, player: any): void;
    renderSelected(selected: any): void;
    setCallbacks(player: any): void;
    getTooltipRow(media: any, name: any): string;
    getTooltipContent(set: any): string;
    addButton(text: any): {
        button: any;
        tooltip: any;
    };
    createTooltip(parent: any): any;
}
declare namespace equipmentSlotData {
    namespace Helmet {
        const id: number;
        const allowQuantity: boolean;
        const emptyMedia: string;
        const imageElements: any[];
        const qtyElements: any[];
        const tooltips: any[];
        const quickEquipTooltip: any[];
        const providesStats: boolean;
    }
    namespace Platebody {
        const id_1: number;
        export { id_1 as id };
        const allowQuantity_1: boolean;
        export { allowQuantity_1 as allowQuantity };
        const emptyMedia_1: string;
        export { emptyMedia_1 as emptyMedia };
        const imageElements_1: any[];
        export { imageElements_1 as imageElements };
        const qtyElements_1: any[];
        export { qtyElements_1 as qtyElements };
        const tooltips_1: any[];
        export { tooltips_1 as tooltips };
        const quickEquipTooltip_1: any[];
        export { quickEquipTooltip_1 as quickEquipTooltip };
        const providesStats_1: boolean;
        export { providesStats_1 as providesStats };
    }
    namespace Platelegs {
        const id_2: number;
        export { id_2 as id };
        const allowQuantity_2: boolean;
        export { allowQuantity_2 as allowQuantity };
        const emptyMedia_2: string;
        export { emptyMedia_2 as emptyMedia };
        const imageElements_2: any[];
        export { imageElements_2 as imageElements };
        const qtyElements_2: any[];
        export { qtyElements_2 as qtyElements };
        const tooltips_2: any[];
        export { tooltips_2 as tooltips };
        const quickEquipTooltip_2: any[];
        export { quickEquipTooltip_2 as quickEquipTooltip };
        const providesStats_2: boolean;
        export { providesStats_2 as providesStats };
    }
    namespace Boots {
        const id_3: number;
        export { id_3 as id };
        const allowQuantity_3: boolean;
        export { allowQuantity_3 as allowQuantity };
        const emptyMedia_3: string;
        export { emptyMedia_3 as emptyMedia };
        const imageElements_3: any[];
        export { imageElements_3 as imageElements };
        const qtyElements_3: any[];
        export { qtyElements_3 as qtyElements };
        const tooltips_3: any[];
        export { tooltips_3 as tooltips };
        const quickEquipTooltip_3: any[];
        export { quickEquipTooltip_3 as quickEquipTooltip };
        const providesStats_3: boolean;
        export { providesStats_3 as providesStats };
    }
    namespace Weapon {
        const id_4: number;
        export { id_4 as id };
        const allowQuantity_4: boolean;
        export { allowQuantity_4 as allowQuantity };
        const emptyMedia_4: string;
        export { emptyMedia_4 as emptyMedia };
        const imageElements_4: any[];
        export { imageElements_4 as imageElements };
        const qtyElements_4: any[];
        export { qtyElements_4 as qtyElements };
        const tooltips_4: any[];
        export { tooltips_4 as tooltips };
        const quickEquipTooltip_4: any[];
        export { quickEquipTooltip_4 as quickEquipTooltip };
        const providesStats_4: boolean;
        export { providesStats_4 as providesStats };
    }
    namespace Shield {
        const id_5: number;
        export { id_5 as id };
        const allowQuantity_5: boolean;
        export { allowQuantity_5 as allowQuantity };
        const emptyMedia_5: string;
        export { emptyMedia_5 as emptyMedia };
        const imageElements_5: any[];
        export { imageElements_5 as imageElements };
        const qtyElements_5: any[];
        export { qtyElements_5 as qtyElements };
        const tooltips_5: any[];
        export { tooltips_5 as tooltips };
        const quickEquipTooltip_5: any[];
        export { quickEquipTooltip_5 as quickEquipTooltip };
        const providesStats_5: boolean;
        export { providesStats_5 as providesStats };
    }
    namespace Amulet {
        const id_6: number;
        export { id_6 as id };
        const allowQuantity_6: boolean;
        export { allowQuantity_6 as allowQuantity };
        const emptyMedia_6: string;
        export { emptyMedia_6 as emptyMedia };
        const imageElements_6: any[];
        export { imageElements_6 as imageElements };
        const qtyElements_6: any[];
        export { qtyElements_6 as qtyElements };
        const tooltips_6: any[];
        export { tooltips_6 as tooltips };
        const quickEquipTooltip_6: any[];
        export { quickEquipTooltip_6 as quickEquipTooltip };
        const providesStats_6: boolean;
        export { providesStats_6 as providesStats };
    }
    namespace Ring {
        const id_7: number;
        export { id_7 as id };
        const allowQuantity_7: boolean;
        export { allowQuantity_7 as allowQuantity };
        const emptyMedia_7: string;
        export { emptyMedia_7 as emptyMedia };
        const imageElements_7: any[];
        export { imageElements_7 as imageElements };
        const qtyElements_7: any[];
        export { qtyElements_7 as qtyElements };
        const tooltips_7: any[];
        export { tooltips_7 as tooltips };
        const quickEquipTooltip_7: any[];
        export { quickEquipTooltip_7 as quickEquipTooltip };
        const providesStats_7: boolean;
        export { providesStats_7 as providesStats };
    }
    namespace Gloves {
        const id_8: number;
        export { id_8 as id };
        const allowQuantity_8: boolean;
        export { allowQuantity_8 as allowQuantity };
        const emptyMedia_8: string;
        export { emptyMedia_8 as emptyMedia };
        const imageElements_8: any[];
        export { imageElements_8 as imageElements };
        const qtyElements_8: any[];
        export { qtyElements_8 as qtyElements };
        const tooltips_8: any[];
        export { tooltips_8 as tooltips };
        const quickEquipTooltip_8: any[];
        export { quickEquipTooltip_8 as quickEquipTooltip };
        const providesStats_8: boolean;
        export { providesStats_8 as providesStats };
    }
    namespace Quiver {
        const id_9: number;
        export { id_9 as id };
        const allowQuantity_9: boolean;
        export { allowQuantity_9 as allowQuantity };
        const emptyMedia_9: string;
        export { emptyMedia_9 as emptyMedia };
        const imageElements_9: any[];
        export { imageElements_9 as imageElements };
        const qtyElements_9: any[];
        export { qtyElements_9 as qtyElements };
        const tooltips_9: any[];
        export { tooltips_9 as tooltips };
        const quickEquipTooltip_9: any[];
        export { quickEquipTooltip_9 as quickEquipTooltip };
        const providesStats_9: boolean;
        export { providesStats_9 as providesStats };
    }
    namespace Cape {
        const id_10: number;
        export { id_10 as id };
        const allowQuantity_10: boolean;
        export { allowQuantity_10 as allowQuantity };
        const emptyMedia_10: string;
        export { emptyMedia_10 as emptyMedia };
        const imageElements_10: any[];
        export { imageElements_10 as imageElements };
        const qtyElements_10: any[];
        export { qtyElements_10 as qtyElements };
        const tooltips_10: any[];
        export { tooltips_10 as tooltips };
        const quickEquipTooltip_10: any[];
        export { quickEquipTooltip_10 as quickEquipTooltip };
        const providesStats_10: boolean;
        export { providesStats_10 as providesStats };
    }
    namespace Passive {
        const id_11: number;
        export { id_11 as id };
        const allowQuantity_11: boolean;
        export { allowQuantity_11 as allowQuantity };
        const emptyMedia_11: string;
        export { emptyMedia_11 as emptyMedia };
        const imageElements_11: any[];
        export { imageElements_11 as imageElements };
        const qtyElements_11: any[];
        export { qtyElements_11 as qtyElements };
        const tooltips_11: any[];
        export { tooltips_11 as tooltips };
        const quickEquipTooltip_11: any[];
        export { quickEquipTooltip_11 as quickEquipTooltip };
        const providesStats_11: boolean;
        export { providesStats_11 as providesStats };
    }
    namespace Summon1 {
        const id_12: number;
        export { id_12 as id };
        const allowQuantity_12: boolean;
        export { allowQuantity_12 as allowQuantity };
        const emptyMedia_12: string;
        export { emptyMedia_12 as emptyMedia };
        const imageElements_12: any[];
        export { imageElements_12 as imageElements };
        const qtyElements_12: any[];
        export { qtyElements_12 as qtyElements };
        const tooltips_12: any[];
        export { tooltips_12 as tooltips };
        const quickEquipTooltip_12: any[];
        export { quickEquipTooltip_12 as quickEquipTooltip };
        const providesStats_12: boolean;
        export { providesStats_12 as providesStats };
    }
    namespace Summon2 {
        const id_13: number;
        export { id_13 as id };
        const allowQuantity_13: boolean;
        export { allowQuantity_13 as allowQuantity };
        const emptyMedia_13: string;
        export { emptyMedia_13 as emptyMedia };
        const imageElements_13: any[];
        export { imageElements_13 as imageElements };
        const qtyElements_13: any[];
        export { qtyElements_13 as qtyElements };
        const tooltips_13: any[];
        export { tooltips_13 as tooltips };
        const quickEquipTooltip_13: any[];
        export { quickEquipTooltip_13 as quickEquipTooltip };
        const providesStats_13: boolean;
        export { providesStats_13 as providesStats };
    }
    namespace Consumable {
        const id_14: number;
        export { id_14 as id };
        const allowQuantity_14: boolean;
        export { allowQuantity_14 as allowQuantity };
        const emptyMedia_14: string;
        export { emptyMedia_14 as emptyMedia };
        const imageElements_14: any[];
        export { imageElements_14 as imageElements };
        const qtyElements_14: any[];
        export { qtyElements_14 as qtyElements };
        const tooltips_14: any[];
        export { tooltips_14 as tooltips };
        const quickEquipTooltip_14: any[];
        export { quickEquipTooltip_14 as quickEquipTooltip };
        const providesStats_14: boolean;
        export { providesStats_14 as providesStats };
    }
}
declare class EquipSlot {
    constructor(type: any, emptyItem: any);
    type: any;
    emptyItem: any;
    occupiedBy: string;
    quantity: number;
    occupies: any[];
    item: any;
    quickEquipItems: any[];
    get isEmpty(): boolean;
    get providesStats(): boolean;
    isItem(item: any): any;
    setOccupied(item: any, slot: any): void;
    setEquipped(item: any, quantity: any, occupies: any): void;
    setEmpty(): void;
    trimQuickEquipItems(): void;
}
declare class CombatQuickEquipMenu {
    constructor(player: any, game: any);
    player: any;
    game: any;
    deserialize(reader: any, version: any, idMap: any, player: any): void;
    getTooltipContent(slotID: any): any;
    setItem(slotID: any, pos: any): void;
    setImage(pos: any, item: any): void;
}
