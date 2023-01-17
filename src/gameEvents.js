"use strict";
class GameEvent {}
class GameEventMatcher {}
class SkillActionEvent extends GameEvent {
  constructor() {
    super(...arguments);
    this.successful = true;
    this.productQuantity = 0;
  }
  get isPotionActive() {
    return this.activePotion !== undefined;
  }
}
class SkillActionEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    this.isPotionActive = options.isPotionActive;
    this.succesful = options.succesful;
    if (options.activePotionIDs !== undefined) {
      this.activePotions = game.items.potions.getSetForConstructor(
        options.activePotionIDs,
        this,
        PotionItem.name
      );
    }
  }
  doesEventMatch(event) {
    return (
      event instanceof SkillActionEvent &&
      (this.isPotionActive === undefined ||
        this.isPotionActive === event.isPotionActive) &&
      (this.activePotions === undefined ||
        (event.activePotion !== undefined &&
          this.activePotions.has(event.activePotion))) &&
      (this.succesful === undefined || this.succesful === event.successful)
    );
  }
}
class WoodcuttingActionEvent extends SkillActionEvent {
  constructor(skill, actions) {
    super();
    this.skill = skill;
    this.actions = actions;
    this.nestGiven = false;
    this.activePotion = skill.activePotion;
  }
}
class WoodcuttingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    this.nestGiven = options.nestGiven;
    if (options.actionIDs !== undefined) {
      this.actions = game.woodcutting.actions.getSetForConstructor(
        options.actionIDs,
        this,
        WoodcuttingTree.name
      );
    }
  }
  doesEventMatch(event) {
    return (
      event instanceof WoodcuttingActionEvent &&
      (this.nestGiven === undefined || this.nestGiven === event.nestGiven) &&
      (this.actions === undefined ||
        isAnySetMemberInSet(this.actions, event.actions)) &&
      super.doesEventMatch(event)
    );
  }
}
class FishingActionEvent extends SkillActionEvent {
  constructor(skill, action, area) {
    super();
    this.skill = skill;
    this.action = action;
    this.area = area;
    this.gemGiven = false;
    this.cookedVersionExists = false;
    this.activePotion = skill.activePotion;
  }
}
class FishingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined) {
      this.actions = game.fishing.actions.getSetForConstructor(
        options.actionIDs,
        this,
        Fish.name
      );
    }
    if (options.areaIDs !== undefined) {
      this.areas = game.fishing.areas.getSetForConstructor(
        options.areaIDs,
        this,
        FishingArea.name
      );
    }
    this.gemGiven = options.gemGiven;
    this.cookedVersionExists = options.cookedVersionExists;
  }
  doesEventMatch(event) {
    return (
      event instanceof FishingActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.areas === undefined || this.areas.has(event.area)) &&
      (this.gemGiven === undefined || this.gemGiven === event.gemGiven) &&
      (this.cookedVersionExists === undefined ||
        this.cookedVersionExists === event.cookedVersionExists) &&
      super.doesEventMatch(event)
    );
  }
}
class FiremakingActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class FiremakingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined) {
      this.actions = game.firemaking.actions.getSetForConstructor(
        options.actionIDs,
        this,
        FiremakingLog.name
      );
    }
  }
  doesEventMatch(event) {
    return (
      event instanceof FiremakingActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      super.doesEventMatch(event)
    );
  }
}
class BonfireLitEvent extends GameEvent {
  constructor(skill, log) {
    super();
    this.skill = skill;
    this.log = log;
  }
}
class BonfireLitEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    if (options.logIDs !== undefined) {
      this.logs = game.firemaking.actions.getSetForConstructor(
        options.logIDs,
        this,
        FiremakingLog.name
      );
    }
  }
  doesEventMatch(event) {
    return (
      event instanceof BonfireLitEvent &&
      (this.logs === undefined || this.logs.has(event.log))
    );
  }
}
class CookingActionEvent extends SkillActionEvent {
  constructor(skill, action, category) {
    super();
    this.skill = skill;
    this.action = action;
    this.category = category;
    this.isPassiveCooking = false;
    this.activePotion = skill.activePotion;
  }
}
class CookingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined) {
      this.actions = game.cooking.actions.getSetForConstructor(
        options.actionIDs,
        this,
        CookingRecipe.name
      );
    }
    if (options.categoryIDs !== undefined) {
      this.categories = game.cooking.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        CookingCategory.name
      );
    }
    this.isPassiveCooking = options.isPassiveCooking;
  }
  doesEventMatch(event) {
    return (
      event instanceof CookingActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined || this.categories.has(event.category)) &&
      (this.isPassiveCooking === undefined ||
        event.isPassiveCooking === this.isPassiveCooking) &&
      super.doesEventMatch(event)
    );
  }
}
class MiningActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.gemObtained = false;
    this.smithedVersionExists = false;
    this.activePotion = skill.activePotion;
  }
}
class MiningActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined) {
      this.actions = game.mining.actions.getSetForConstructor(
        options.actionIDs,
        this,
        MiningRock.name
      );
    }
    this.gemObtained = options.gemObtained;
    this.smithedVersionExists = options.smithedVersionExists;
    this.actionGivesGems = options.actionGivesGems;
    if (options.oreTypes !== undefined)
      this.oreTypes = new Set(options.oreTypes);
  }
  doesEventMatch(event) {
    return (
      event instanceof MiningActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.gemObtained === undefined ||
        this.gemObtained === event.gemObtained) &&
      (this.smithedVersionExists === undefined ||
        this.smithedVersionExists === event.smithedVersionExists) &&
      (this.actionGivesGems === undefined ||
        this.actionGivesGems === event.action.giveGems) &&
      (this.actionGivesSuperiorGems === undefined ||
        this.actionGivesSuperiorGems === event.action.giveSuperiorGems) &&
      (this.oreTypes === undefined || this.oreTypes.has(event.action.type)) &&
      super.doesEventMatch(event)
    );
  }
}
class SmithingActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class SmithingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.smithing.actions.getSetForConstructor(
        options.actionIDs,
        this,
        "SmithingRecipe"
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.smithing.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        SkillCategory.name
      );
    if (options.consumedItemIDs !== undefined)
      this.consumedItems = game.items.getSetForConstructor(
        options.consumedItemIDs,
        this,
        Item.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof SmithingActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      (this.consumedItems === undefined ||
        event.action.itemCosts.some(({ item }) =>
          this.consumedItems.has(item)
        )) &&
      super.doesEventMatch(event)
    );
  }
}
class ThievingActionEvent extends SkillActionEvent {
  constructor(skill, npc, area) {
    super();
    this.skill = skill;
    this.npc = npc;
    this.area = area;
    this.commonDropObtained = false;
    this.activePotion = skill.activePotion;
  }
}
class ThievingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.npcIDs !== undefined)
      this.npcs = game.thieving.actions.getSetForConstructor(
        options.npcIDs,
        this,
        ThievingNPC.name
      );
    if (options.areaIDs !== undefined)
      this.areas = game.thieving.areas.getSetForConstructor(
        options.areaIDs,
        this,
        ThievingArea.name
      );
    this.commonDropObtained = options.commonDropObtained;
  }
  doesEventMatch(event) {
    return (
      event instanceof ThievingActionEvent &&
      (this.npcs === undefined || this.npcs.has(event.npc)) &&
      (this.areas === undefined || this.areas.has(event.area)) &&
      (this.commonDropObtained === undefined ||
        this.commonDropObtained === event.commonDropObtained) &&
      super.doesEventMatch(event)
    );
  }
}
class FarmingPlantActionEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    if (options.actionIDs !== undefined)
      this.actions = game.farming.actions.getSetForConstructor(
        options.actionIDs,
        this,
        FarmingRecipe.name
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.farming.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        FarmingCategory.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof FarmingPlantActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category))
    );
  }
}
class FarmingPlantActionEvent extends GameEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
  }
}
class FarmingHarvestActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.farming.actions.getSetForConstructor(
        options.actionIDs,
        this,
        FarmingRecipe.name
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.farming.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        FarmingCategory.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof FarmingHarvestActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      super.doesEventMatch(event)
    );
  }
}
class FarmingHarvestActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class FletchingActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.altRecipeID = -1;
    this.activePotion = skill.activePotion;
  }
}
class FletchingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.fletching.actions.getSetForConstructor(
        options.actionIDs,
        this,
        FletchingRecipe.name
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.fletching.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        SkillCategory.name
      );
    this.isArrows = options.isArrows;
    this.isUnstrungBows = options.isUnstrungBows;
  }
  doesEventMatch(event) {
    return (
      event instanceof FletchingActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      (this.isArrows === undefined ||
        this.isArrows === event.skill.doesRecipeMakeArrows(event.action)) &&
      (this.isUnstrungBows === undefined ||
        this.isUnstrungBows ===
          event.skill.doesRecipeMakeUnstrungBows(event.action)) &&
      super.doesEventMatch(event)
    );
  }
}
class CraftingActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class CraftingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.crafting.actions.getSetForConstructor(
        options.actionIDs,
        this,
        "CraftingRecipe"
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.crafting.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        SkillCategory.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof CraftingActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      super.doesEventMatch(event)
    );
  }
}
class RunecraftingActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class RunecraftingActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.runecrafting.actions.getSetForConstructor(
        options.actionIDs,
        this,
        "RunecraftingRecipe"
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.runecrafting.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        SkillCategory.name
      );
    if (options.consumedItemIDs !== undefined)
      this.consumedItems = game.items.getSetForConstructor(
        options.consumedItemIDs,
        this,
        Item.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof RunecraftingActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      (this.consumedItems === undefined ||
        event.action.itemCosts.some(({ item }) =>
          this.consumedItems.has(item)
        )) &&
      (this.subCategories === undefined ||
        this.subCategories.has(
          event.skill.getRecipeSubCategory(event.action)
        )) &&
      super.doesEventMatch(event)
    );
  }
}
class HerbloreActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class HerbloreActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.herblore.actions.getSetForConstructor(
        options.actionIDs,
        this,
        HerbloreRecipe.name
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.herblore.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        SkillCategory.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof HerbloreActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      super.doesEventMatch(event)
    );
  }
}
class AgilityActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class AgilityActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.agility.actions.getSetForConstructor(
        options.actionIDs,
        this,
        AgilityObstacle.name
      );
    if (options.categories !== undefined)
      this.categories = new Set(options.categories);
  }
  doesEventMatch(event) {
    return (
      event instanceof AgilityActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      super.doesEventMatch(event)
    );
  }
}
class SummoningActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.altRecipeID = -1;
    this.activePotion = skill.activePotion;
  }
}
class SummoningActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.summoning.actions.getSetForConstructor(
        options.actionIDs,
        this,
        SummoningRecipe.name
      );
    if (options.categoryIDs !== undefined)
      this.categories = game.summoning.categories.getSetForConstructor(
        options.categoryIDs,
        this,
        SkillCategory.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof SummoningActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      (this.categories === undefined ||
        this.categories.has(event.action.category)) &&
      super.doesEventMatch(event)
    );
  }
}
class AstrologyActionEvent extends SkillActionEvent {
  constructor(skill, action) {
    super();
    this.skill = skill;
    this.action = action;
    this.activePotion = skill.activePotion;
  }
}
class AstrologyActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.actions = game.astrology.actions.getSetForConstructor(
        options.actionIDs,
        this,
        AstrologyRecipe.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof AstrologyActionEvent &&
      (this.actions === undefined || this.actions.has(event.action)) &&
      super.doesEventMatch(event)
    );
  }
}
class AltMagicActionEvent extends SkillActionEvent {
  constructor(skill, spell) {
    super();
    this.skill = skill;
    this.spell = spell;
    this.activePotion = skill.activePotion;
  }
}
class AltMagicActionEventMatcher extends SkillActionEventMatcher {
  constructor(options, game) {
    super(options, game);
    if (options.actionIDs !== undefined)
      this.spells = game.altMagic.actions.getSetForConstructor(
        options.actionIDs,
        this,
        AltMagicSpell.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof AltMagicActionEvent &&
      (this.spells === undefined || this.spells.has(event.spell)) &&
      super.doesEventMatch(event)
    );
  }
}
class MonsterDropEvent extends GameEvent {
  constructor(item, quantity, herbSeed) {
    super();
    this.item = item;
    this.quantity = quantity;
    this.herbSeed = herbSeed;
  }
}
class MonsterDropEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
    this.herbSeed = options.herbSeed;
  }
  doesEventMatch(event) {
    return (
      event instanceof MonsterDropEvent &&
      (this.herbSeed === undefined || this.herbSeed === event.herbSeed)
    );
  }
}
class PlayerAttackEvent extends GameEvent {
  constructor(attack, attackType) {
    super();
    this.attack = attack;
    this.attackType = attackType;
  }
}
class PlayerAttackEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
    if (options.attackTypes !== undefined)
      this.attackTypes = new Set(options.attackTypes);
  }
  doesEventMatch(event) {
    return (
      event instanceof PlayerAttackEvent &&
      (this.attackTypes === undefined || this.attackTypes.has(event.attackType))
    );
  }
}
class EnemyAttackEvent extends GameEvent {
  constructor(attack, attackType) {
    super();
    this.attack = attack;
    this.attackType = attackType;
  }
}
class EnemyAttackEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
    if (options.attackTypes !== undefined)
      this.attackTypes = new Set(options.attackTypes);
  }
  doesEventMatch(event) {
    return (
      event instanceof EnemyAttackEvent &&
      (this.attackTypes === undefined || this.attackTypes.has(event.attackType))
    );
  }
}
class FoodEatenEvent extends GameEvent {
  constructor(food, quantity, healed) {
    super();
    this.food = food;
    this.quantity = quantity;
    this.healed = healed;
  }
}
class FoodEatenEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
  }
  doesEventMatch(event) {
    return event instanceof FoodEatenEvent;
  }
}
class PrayerPointConsumptionEvent extends GameEvent {
  constructor(pointsUsed) {
    super();
    this.pointsUsed = pointsUsed;
  }
}
class PrayerPointConsumptionEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
  }
  doesEventMatch(event) {
    return event instanceof PrayerPointConsumptionEvent;
  }
}
class PlayerHitpointRegenerationEvent extends GameEvent {
  constructor(hitpointsGained) {
    super();
    this.hitpointsGained = hitpointsGained;
  }
}
class PlayerHitpointRegenerationMatcher extends GameEventMatcher {
  constructor(options) {
    super();
  }
  doesEventMatch(event) {
    return event instanceof PlayerHitpointRegenerationEvent;
  }
}
class PlayerSummonAttackEvent extends GameEvent {
  constructor() {
    super();
    this.missed = false;
    this.damage = 0;
  }
}
class PlayerSummonAttackEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
  }
  doesEventMatch(event) {
    return event instanceof PlayerSummonAttackEvent;
  }
}
class RuneConsumptionEvent extends GameEvent {
  constructor(runes) {
    super();
    this.runes = runes;
    this.preserved = true;
  }
}
class RuneConsumptionEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
  }
  doesEventMatch(event) {
    return event instanceof RuneConsumptionEvent;
  }
}
class PotionUsedEvent extends GameEvent {
  constructor(potion, charges) {
    super();
    this.potion = potion;
    this.charges = charges;
  }
}
class PotionUsedEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
  }
  doesEventMatch(event) {
    return event instanceof PotionUsedEvent;
  }
}
class PotionChargeUsedEvent extends GameEvent {
  constructor(potion) {
    super();
    this.potion = potion;
    this.preserved = false;
  }
}
class PotionChargeUsedEventMatcher extends GameEventMatcher {
  constructor(options) {
    super();
  }
  doesEventMatch(event) {
    return event instanceof PotionChargeUsedEvent;
  }
}
class MonsterKilledEvent extends GameEvent {
  constructor(monster, killedByType) {
    super();
    this.monster = monster;
    this.killedByType = killedByType;
  }
}
class MonsterKilledEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    if (options.monsterIDs !== undefined)
      this.monsters = game.monsters.getSetForConstructor(
        options.monsterIDs,
        this,
        Monster.name
      );
  }
  get monsterList() {
    if (this.monsters === undefined) return [];
    return [...this.monsters];
  }
  doesEventMatch(event) {
    return (
      event instanceof MonsterKilledEvent &&
      (this.monsters === undefined || this.monsters.has(event.monster)) &&
      (this.killedWithType === undefined ||
        event.killedByType === this.killedWithType)
    );
  }
}
class ItemEquippedEvent extends GameEvent {
  constructor(item, quantity) {
    super();
    this.item = item;
    this.quantity = quantity;
  }
}
class ItemEquippedEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    if (options.itemIDs !== undefined)
      this.items = game.items.equipment.getSetForConstructor(
        options.itemIDs,
        this,
        EquipmentItem.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof ItemEquippedEvent &&
      (this.items === undefined || this.items.has(event.item))
    );
  }
}
class FoodEquippedEvent extends GameEvent {
  constructor(item, quantity) {
    super();
    this.item = item;
    this.quantity = quantity;
  }
}
class FoodEquippedEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    if (options.itemIDs !== undefined)
      this.items = game.items.food.getSetForConstructor(
        options.itemIDs,
        this,
        FoodItem.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof FoodEquippedEvent &&
      (this.items === undefined || this.items.has(event.item))
    );
  }
}
class ShopPurchaseMadeEvent extends GameEvent {
  constructor(purchase, quantity) {
    super();
    this.purchase = purchase;
    this.quantity = quantity;
  }
}
class ShopPurchaseMadeEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    if (options.purchaseIDs !== undefined)
      this.purchases = game.shop.purchases.getSetForConstructor(
        options.purchaseIDs,
        this,
        ShopPurchase.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof ShopPurchaseMadeEvent &&
      (this.purchases === undefined || this.purchases.has(event.purchase))
    );
  }
}
class SummonTabletUsedEvent extends GameEvent {
  constructor(tablet) {
    super();
    this.tablet = tablet;
  }
}
class SummonTabletUsedEventMatcher extends GameEventMatcher {
  constructor(options, game) {
    super();
    if (options.tabletIDs !== undefined)
      this.tablets = game.items.equipment.getSetForConstructor(
        options.tabletIDs,
        this,
        EquipmentItem.name
      );
  }
  doesEventMatch(event) {
    return (
      event instanceof SummonTabletUsedEvent &&
      (this.tablets === undefined || this.tablets.has(event.tablet))
    );
  }
}
