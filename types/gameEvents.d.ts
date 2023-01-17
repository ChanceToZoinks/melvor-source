declare class GameEvent {
}
declare class GameEventMatcher {
}
declare class SkillActionEvent extends GameEvent {
    constructor(...args: any[]);
    successful: boolean;
    productQuantity: number;
    get isPotionActive(): boolean;
}
declare class SkillActionEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    isPotionActive: any;
    succesful: any;
    activePotions: any;
    doesEventMatch(event: any): boolean;
}
declare class WoodcuttingActionEvent extends SkillActionEvent {
    constructor(skill: any, actions: any);
    skill: any;
    actions: any;
    nestGiven: boolean;
    activePotion: any;
}
declare class WoodcuttingActionEventMatcher extends SkillActionEventMatcher {
    nestGiven: any;
    actions: any;
}
declare class FishingActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any, area: any);
    skill: any;
    action: any;
    area: any;
    gemGiven: boolean;
    cookedVersionExists: boolean;
    activePotion: any;
}
declare class FishingActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    areas: any;
    gemGiven: any;
    cookedVersionExists: any;
}
declare class FiremakingActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class FiremakingActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
}
declare class BonfireLitEvent extends GameEvent {
    constructor(skill: any, log: any);
    skill: any;
    log: any;
}
declare class BonfireLitEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    logs: any;
    doesEventMatch(event: any): any;
}
declare class CookingActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any, category: any);
    skill: any;
    action: any;
    category: any;
    isPassiveCooking: boolean;
    activePotion: any;
}
declare class CookingActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
    isPassiveCooking: any;
}
declare class MiningActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    gemObtained: boolean;
    smithedVersionExists: boolean;
    activePotion: any;
}
declare class MiningActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    gemObtained: any;
    smithedVersionExists: any;
    actionGivesGems: any;
    oreTypes: Set<any>;
}
declare class SmithingActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class SmithingActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
    consumedItems: any;
}
declare class ThievingActionEvent extends SkillActionEvent {
    constructor(skill: any, npc: any, area: any);
    skill: any;
    npc: any;
    area: any;
    commonDropObtained: boolean;
    activePotion: any;
}
declare class ThievingActionEventMatcher extends SkillActionEventMatcher {
    npcs: any;
    areas: any;
    commonDropObtained: any;
}
declare class FarmingPlantActionEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    actions: any;
    categories: any;
    doesEventMatch(event: any): any;
}
declare class FarmingPlantActionEvent extends GameEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
}
declare class FarmingHarvestActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
}
declare class FarmingHarvestActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class FletchingActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    altRecipeID: number;
    activePotion: any;
}
declare class FletchingActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
    isArrows: any;
    isUnstrungBows: any;
}
declare class CraftingActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class CraftingActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
}
declare class RunecraftingActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class RunecraftingActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
    consumedItems: any;
}
declare class HerbloreActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class HerbloreActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
}
declare class AgilityActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class AgilityActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: Set<any>;
}
declare class SummoningActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    altRecipeID: number;
    activePotion: any;
}
declare class SummoningActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
    categories: any;
}
declare class AstrologyActionEvent extends SkillActionEvent {
    constructor(skill: any, action: any);
    skill: any;
    action: any;
    activePotion: any;
}
declare class AstrologyActionEventMatcher extends SkillActionEventMatcher {
    actions: any;
}
declare class AltMagicActionEvent extends SkillActionEvent {
    constructor(skill: any, spell: any);
    skill: any;
    spell: any;
    activePotion: any;
}
declare class AltMagicActionEventMatcher extends SkillActionEventMatcher {
    spells: any;
}
declare class MonsterDropEvent extends GameEvent {
    constructor(item: any, quantity: any, herbSeed: any);
    item: any;
    quantity: any;
    herbSeed: any;
}
declare class MonsterDropEventMatcher extends GameEventMatcher {
    constructor(options: any);
    herbSeed: any;
    doesEventMatch(event: any): boolean;
}
declare class PlayerAttackEvent extends GameEvent {
    constructor(attack: any, attackType: any);
    attack: any;
    attackType: any;
}
declare class PlayerAttackEventMatcher extends GameEventMatcher {
    constructor(options: any);
    attackTypes: Set<any>;
    doesEventMatch(event: any): boolean;
}
declare class EnemyAttackEvent extends GameEvent {
    constructor(attack: any, attackType: any);
    attack: any;
    attackType: any;
}
declare class EnemyAttackEventMatcher extends GameEventMatcher {
    constructor(options: any);
    attackTypes: Set<any>;
    doesEventMatch(event: any): boolean;
}
declare class FoodEatenEvent extends GameEvent {
    constructor(food: any, quantity: any, healed: any);
    food: any;
    quantity: any;
    healed: any;
}
declare class FoodEatenEventMatcher extends GameEventMatcher {
    constructor(options: any);
    doesEventMatch(event: any): boolean;
}
declare class PrayerPointConsumptionEvent extends GameEvent {
    constructor(pointsUsed: any);
    pointsUsed: any;
}
declare class PrayerPointConsumptionEventMatcher extends GameEventMatcher {
    constructor(options: any);
    doesEventMatch(event: any): boolean;
}
declare class PlayerHitpointRegenerationEvent extends GameEvent {
    constructor(hitpointsGained: any);
    hitpointsGained: any;
}
declare class PlayerHitpointRegenerationMatcher extends GameEventMatcher {
    constructor(options: any);
    doesEventMatch(event: any): boolean;
}
declare class PlayerSummonAttackEvent extends GameEvent {
    missed: boolean;
    damage: number;
}
declare class PlayerSummonAttackEventMatcher extends GameEventMatcher {
    constructor(options: any);
    doesEventMatch(event: any): boolean;
}
declare class RuneConsumptionEvent extends GameEvent {
    constructor(runes: any);
    runes: any;
    preserved: boolean;
}
declare class RuneConsumptionEventMatcher extends GameEventMatcher {
    constructor(options: any);
    doesEventMatch(event: any): boolean;
}
declare class PotionUsedEvent extends GameEvent {
    constructor(potion: any, charges: any);
    potion: any;
    charges: any;
}
declare class PotionUsedEventMatcher extends GameEventMatcher {
    constructor(options: any);
    doesEventMatch(event: any): boolean;
}
declare class PotionChargeUsedEvent extends GameEvent {
    constructor(potion: any);
    potion: any;
    preserved: boolean;
}
declare class PotionChargeUsedEventMatcher extends GameEventMatcher {
    constructor(options: any);
    doesEventMatch(event: any): boolean;
}
declare class MonsterKilledEvent extends GameEvent {
    constructor(monster: any, killedByType: any);
    monster: any;
    killedByType: any;
}
declare class MonsterKilledEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    monsters: any;
    get monsterList(): any[];
    doesEventMatch(event: any): boolean;
}
declare class ItemEquippedEvent extends GameEvent {
    constructor(item: any, quantity: any);
    item: any;
    quantity: any;
}
declare class ItemEquippedEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    items: any;
    doesEventMatch(event: any): any;
}
declare class FoodEquippedEvent extends GameEvent {
    constructor(item: any, quantity: any);
    item: any;
    quantity: any;
}
declare class FoodEquippedEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    items: any;
    doesEventMatch(event: any): any;
}
declare class ShopPurchaseMadeEvent extends GameEvent {
    constructor(purchase: any, quantity: any);
    purchase: any;
    quantity: any;
}
declare class ShopPurchaseMadeEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    purchases: any;
    doesEventMatch(event: any): any;
}
declare class SummonTabletUsedEvent extends GameEvent {
    constructor(tablet: any);
    tablet: any;
}
declare class SummonTabletUsedEventMatcher extends GameEventMatcher {
    constructor(options: any, game: any);
    tablets: any;
    doesEventMatch(event: any): any;
}
