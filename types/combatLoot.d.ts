declare class CombatLoot {
    constructor(maxLoot: any, game: any);
    maxLoot: any;
    game: any;
    drops: any[];
    renderRequired: boolean;
    lostLoot: Map<any, any>;
    initializeMenus(): void;
    add(item: any, quantity: any, stack?: boolean): void;
    removeAll(): void;
    makeDropRoom(): void;
    lootAll(): void;
    destroyAllLoot(): void;
    actuallyDestroyAllLootNow(): void;
    getSnapshot(): Map<any, any>;
    lootItem(id: any): void;
    render(): void;
    encode(writer: any): any;
    decode(reader: any, version: any): void;
    deserialize(reader: any, version: any, idMap: any): void;
}
declare class CombatLootMenuElement extends HTMLElement {
    dropElements: any[];
    _content: DocumentFragment;
    lootQuantity: any;
    lootAllButton: any;
    lootContainer: any;
    lootingAmuletText: any;
    connectedCallback(): void;
    initialize(loot: any): void;
    renderDrops(drops: any, maxDrops: any, loot: any): void;
    createDropElement(): void;
    createTooltip(parent: any): any;
}
