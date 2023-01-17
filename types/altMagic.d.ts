declare var AltMagicConsumptionID: any;
declare var AltMagicProductionID: any;
declare class AltMagicSpell extends BaseSpell {
    fixedItemCosts: any;
    baseExperience: any;
    specialCost: {
        type: any;
        quantity: any;
    };
    produces: any;
    productionRatio: any;
    _description: any;
    get name(): any;
    get description(): any;
}
declare class AltMagic extends CraftingSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: AltMagicRenderQueue;
    smithingBarRecipes: any[];
    baseInterval: number;
    randomShardTable: DropTable;
    getTotalUnlockedMasteryActions(): number;
    get actionInterval(): number;
    get actionLevel(): any;
    get masteryAction(): any;
    get masteryModifiedInterval(): number;
    get noCostsMessage(): any;
    get noRunesMessage(): any;
    get activeSpell(): any;
    get runePreservationChance(): number;
    get selectedSpellMedia(): any;
    castButtonOnClick(): void;
    selectSpellOnClick(spell: any): void;
    selectedConversionItem: any;
    selectedSpell: any;
    openSelectItemOnClick(): void;
    selectItemOnClick(item: any): void;
    selectBarOnClick(recipe: any): void;
    selectedSmithingRecipe: any;
    getSuperheatBarCosts(recipe: any, useCoal: any, costQty: any): Costs;
    getCurrentRecipeRuneCosts(): Costs;
    getCurrentRecipeCosts(): Costs;
    getCurrentRecipeBaseProducts(): {
        items: any[];
        gp: number;
        sc: number;
    };
    recordCostConsumptionStats(costs: any): void;
    recordCostPreservationStats(costs: any): void;
    getAlchemyGP(item: any, conversionRatio: any): number;
    get selectedSpellDoublingChance(): number;
    preAction(): void;
    get actionRewards(): Rewards;
    postAction(): void;
    onComboRunesChange(): void;
    queueBankQuantityRender(item: any): void;
    onEquipmentChange(): void;
    renderProgressBar(): void;
    renderSelectedSpellImage(): void;
    renderSelectedSpellInfo(): void;
    renderQuantities(): void;
    renderSelectionTab(): void;
    getActionIDFromOldID(oldActionID: any, idMap: any): any;
    setFromOldOffline(offline: any, idMap: any): void;
}
declare class AltMagicRenderQueue extends GatheringSkillRenderQueue {
    quantities: boolean;
    selectedSpellImage: boolean;
    selectionTab: boolean;
    selectedSpellInfo: boolean;
}
