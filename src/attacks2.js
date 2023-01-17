"use strict";
class SpecialAttack extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this.damage = [];
    this.prehitEffects = [];
    this.onhitEffects = [];
    this.usesRunesPerProc = false;
    this.usesPrayerPointsPerProc = false;
    this.usesPotionChargesPerProc = false;
    this.isDragonbreath = false;
    this.minAccuracy = -Infinity;
    this.defaultChance = data.defaultChance;
    this.damage = constructDamageFromData(data.damage);
    this.cantMiss = data.cantMiss;
    this.attackCount = data.attackCount;
    this.attackInterval = data.attackInterval;
    this.lifesteal = data.lifesteal;
    if (data.usesRunesPerProc !== undefined)
      this.usesRunesPerProc = data.usesRunesPerProc;
    if (data.usesPrayerPointsPerProc !== undefined)
      this.usesPrayerPointsPerProc = data.usesPrayerPointsPerProc;
    if (data.usesPotionChargesPerProc !== undefined)
      this.usesPotionChargesPerProc = data.usesPotionChargesPerProc;
    if (data.attackTypes !== undefined) {
      this.attackTypes = new Set(data.attackTypes);
    }
    if (data.isDragonbreath !== undefined)
      this.isDragonbreath = data.isDragonbreath;
    if (data.minAccuracy !== undefined) this.minAccuracy = data.minAccuracy;
    this.descriptionGenerator = data.descriptionGenerator;
    this._name = data.name;
    this._description = data.description;
    game.queueForSoftDependencyReg(data, this);
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("SPECIAL_ATTACK_NAME", this.localID);
    }
  }
  get description() {
    let stringTemplate;
    if (this.isModded) {
      stringTemplate = this._description;
    } else {
      stringTemplate = getLangString("SPECIAL_ATTACK", this.localID);
    }
    return templateString(stringTemplate, this.descriptionTemplateData);
  }
  get canNormalAttack() {
    return (
      this.damage.length === 0 &&
      ((this.prehitEffects.length > 0 &&
        this.prehitEffects.some((effect) => {
          switch (effect.type) {
            case "Stun":
            case "Sleep":
            case "Modifier":
              return true;
            default:
              return false;
          }
        })) ||
        (this.onhitEffects.length > 0 &&
          this.onhitEffects.some((effect) => {
            switch (effect.type) {
              case "Stun":
              case "Sleep":
              case "Modifier":
                return true;
              default:
                return false;
            }
          })))
    );
  }
  get descriptionTemplateData() {
    const templateData = {};
    templateData.hitCount = `${this.attackCount}`;
    templateData.interval = `${this.attackInterval / 1000}`;
    templateData.duration = `${
      ((this.attackCount - 1) * this.attackInterval) / 1000
    }`;
    templateData.lifesteal = `${this.lifesteal}`;
    addDamageTemplateData(templateData, this.damage, "attack");
    this.onhitEffects.forEach((effect, i) => {
      addEffectTemplateData(templateData, effect, false, i);
    });
    this.prehitEffects.forEach((effect, i) => {
      addEffectTemplateData(templateData, effect, true, i);
    });
    return templateData;
  }
  registerSoftDependencies(data, game) {
    this.prehitEffects = data.prehitEffects.map((effectData) =>
      constructEffectFromData(effectData, game)
    );
    this.onhitEffects = data.onhitEffects.map((effectData) =>
      constructEffectFromData(effectData, game)
    );
    if (data.consumesStacks !== undefined) {
      const stackingEffect = game.stackingEffects.getObjectByID(
        data.consumesStacks
      );
      if (stackingEffect === undefined)
        throw new Error(
          `Error constructing SpecialAttack with id: ${this.id}. StackingEffect with id ${data.consumesStacks} is not registered.`
        );
      this.consumeStacks = stackingEffect;
    }
  }
}
class ItemEffect extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this.effect = constructEffectFromData(data.effectData, game);
  }
}
class ItemEffectAttack extends SpecialAttack {
  constructor(namespace, game) {
    super(
      namespace,
      {
        id: "ReflexiveEffectAttack",
        defaultChance: 0,
        damage: [],
        prehitEffects: [],
        onhitEffects: [],
        cantMiss: false,
        attackCount: 0,
        attackInterval: -1,
        lifesteal: 0,
        usesRunesPerProc: false,
        usesPrayerPointsPerProc: true,
        usesPotionChargesPerProc: true,
        attackTypes: [],
        isDragonbreath: false,
        name: "",
        description: "",
        descriptionGenerator: "",
      },
      game
    );
    this.effectToItemEffectMap = new Map();
    this.itemEffects = new NamespaceRegistry(game.registeredNamespaces);
  }
  registerItemEffects(namespace, data, game) {
    data.forEach((data) => {
      const itemEffect = new ItemEffect(namespace, data, game);
      this.itemEffects.registerObject(itemEffect);
      this.effectToItemEffectMap.set(itemEffect.effect, itemEffect);
    });
  }
  getItemEffectFromEffect(effect) {
    const itemEffect = this.effectToItemEffectMap.get(effect);
    if (itemEffect === undefined)
      throw new Error("No item effect matches the effect.");
    return itemEffect;
  }
}
class StackingEffect extends NamespacedObject {
  constructor(namespace, data) {
    super(namespace, data.id);
    this.type = "Stacking";
    this.stacksToAdd = data.stacksToAdd;
    this.modifiers = data.modifiers;
    this.maxStacks = data.maxStacks;
    this._media = data.media;
    this._name = data.name;
    this._langName = data.langName;
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else if (this._langName !== undefined) {
      return getLangString(this._langName.category, this._langName.id);
    } else {
      return this._name;
    }
  }
  get media() {
    return this.getMediaURL(this._media);
  }
}
function constructDamageFromData(data) {
  return data.map((damageData) => {
    switch (damageData.damageType) {
      case "Normal":
        return new NormalDamage(damageData.amplitude, damageData.attackCount);
      case "Custom":
        return damageData;
      default:
        throw new Error("Invalid damage data type.");
    }
  });
}
function constructEffectFromData(effectData, game) {
  switch (effectData.effectType) {
    case "Affliction":
      return afflictionEffect;
    case "Burn":
      return new BurnEffect(effectData.chance);
    case "Frostburn":
      return frostBurnEffect;
    case "Poison":
      return new PoisonEffect(effectData.chance);
    case "Slow":
      return new SlowEffect(effectData.magnitude, effectData.turns);
    case "Custom": {
      switch (effectData.type) {
        case "Modifier":
          if (effectData.turns === "Infinity") effectData.turns = Infinity;
          return effectData;
        case "Reflexive":
          if (effectData.turns === "Infinity") effectData.turns = Infinity;
          return effectData;
        default:
          return effectData;
      }
    }
    case "Stacking": {
      const effect = game.stackingEffects.getObjectByID(effectData.id);
      if (effect === undefined)
        throw new Error(
          `Error constructing effect from data, stacking effect: ${effectData.id} is not registered.`
        );
      return effect;
    }
    case "Curse":
      return new CurseEffect(effectData, game);
    case "DeadlyPoison":
      return new DeadlyPoisonEffect(effectData.chance);
  }
}
class CurseEffect {
  constructor(data, game) {
    this.type = "Curse";
    this.chance = 100;
    this.isRandom = false;
    const curse = game.curseSpells.getObjectByID(data.curse);
    if (curse === undefined)
      throw new Error(
        `Error constructing CurseEffect. Curse with id: ${data.curse} is not registered.`
      );
    this.curse = curse;
    if (data.chance !== undefined) this.chance = data.chance;
    if (data.isRandom) this.isRandom = data.isRandom;
  }
}
