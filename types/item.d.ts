declare function getItemSpecialAttackInformation(item: any): string;
declare function createItemInformationTooltip(item: any, showStats?: boolean): string;
declare class Item extends NamespacedObject {
    _name: any;
    _customDescription: any;
    category: any;
    type: any;
    _media: any;
    ignoreCompletion: any;
    obtainFromItemLog: any;
    golbinRaidExclusive: any;
    _mediaAnimation: any;
    _altMedia: any;
    sellsFor: any;
    get name(): any;
    get media(): any;
    get altMedia(): any;
    get description(): any;
    get hasDescription(): boolean;
}
declare class DummyItem extends Item {
    get name(): string;
    get description(): string;
}
declare class EquipmentItem extends Item {
    constructor(namespace: any, data: any, game: any);
    equipRequirements: any[];
    conditionalModifiers: any;
    specialAttacks: any[];
    fightEffects: any[];
    providedRunes: any;
    tier: any;
    validSlots: any;
    occupiesSlots: any;
    equipmentStats: any;
    modifiers: any;
    enemyModifiers: any;
    overrideSpecialChances: any;
    ammoType: any;
    registerSoftDependencies(data: any, game: any): void;
    consumesOn: any;
    consumesChargesOn: any;
    consumesItemOn: {
        item: any;
        chance: any;
        matchers: any;
    };
}
declare class DummyEquipmentItem extends EquipmentItem {
}
declare class WeaponItem extends EquipmentItem {
    attackType: any;
    ammoTypeRequired: any;
}
declare class FoodItem extends Item {
    healsFor: any;
}
declare class BoneItem extends Item {
    prayerPoints: any;
}
declare class PotionItem extends Item {
    constructor(namespace: any, data: any, game: any);
    consumesOn: any[];
    modifiers: any;
    charges: any;
    action: any;
    tier: any;
    registerSoftDependencies(data: any, game: any): void;
}
declare class ReadableItem extends Item {
    modalID: any;
    swalData: any;
    showContents(): void;
}
declare class OpenableItem extends Item {
    constructor(namespace: any, itemData: any, game: any);
    dropTable: DropTable;
    keyItem: any;
}
declare class TokenItem extends Item {
    constructor(namespace: any, itemData: any, game: any);
    modifiers: any;
}
declare class CompostItem extends Item {
    compostValue: any;
    harvestBonus: any;
    buttonStyle: any;
    barStyle: any;
}
