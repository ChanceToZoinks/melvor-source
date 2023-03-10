"use strict";
class NormalDamage {
  constructor(amplitude, attackCount = -1) {
    this.character = "Attacker";
    this.maxRoll = "MaxHit";
    this.maxPercent = 100;
    this.minRoll = "MinHit";
    this.minPercent = 100;
    this.roll = true;
    if (attackCount !== -1) this.attackCount = attackCount;
    this.maxPercent = amplitude;
    this.minPercent = amplitude;
  }
}
class BurnEffect {
  constructor(chance = 100) {
    this.chance = chance;
    this.type = "DOT";
    this.subtype = "Burn";
    this.damage = [
      {
        character: "Target",
        roll: false,
        maxRoll: "CurrentHP",
        maxPercent: 15,
      },
    ];
    this.procs = 10;
    this.interval = 250;
  }
}
class PoisonEffect {
  constructor(chance = 100) {
    this.chance = chance;
    this.type = "DOT";
    this.subtype = "Poison";
    this.damage = [
      { character: "Target", roll: false, maxRoll: "MaxHP", maxPercent: 10 },
    ];
    this.procs = 4;
    this.interval = 2500;
  }
}
class DeadlyPoisonEffect {
  constructor(chance = 100) {
    this.chance = chance;
    this.type = "DOT";
    this.subtype = "DeadlyPoison";
    this.damage = [
      { character: "Target", roll: false, maxRoll: "MaxHP", maxPercent: 25 },
    ];
    this.procs = 4;
    this.interval = 2500;
  }
}
class SlowEffect {
  constructor(magnitude, turns = 1) {
    this.turns = turns;
    this.type = "Modifier";
    this.character = "Target";
    this.countsOn = "Target";
    this.maxStacks = 1;
    this.stacksToAdd = 1;
    this.media = effectMedia.slowed;
    this.modifiers = { increasedAttackIntervalPercent: magnitude };
  }
}
class StickyWebs {
  constructor(chance = 100) {
    this.chance = chance;
    this.type = "Modifier";
    this.character = "Target";
    this.countsOn = "Target";
    this.maxStacks = 1;
    this.stacksToAdd = 1;
    this.media = effectMedia.slowed;
    this.turns = 5;
    this.modifiers = { increasedAttackIntervalPercent: 30 };
  }
}
class EndOfTurnEvasionEffect {
  constructor(turns, maxValue, atMax = false) {
    this.turns = turns;
    this.maxValue = maxValue;
    this.type = "Modifier";
    this.character = "Attacker";
    this.countsOn = "Attacker";
    this.maxStacks = 1;
    this.stacksToAdd = 1;
    this.media = effectMedia.defenseUp;
    const value = atMax ? maxValue : Math.ceil(Math.random() * maxValue);
    this.modifiers = { increasedGlobalEvasion: value };
  }
}
const burnEffect = new BurnEffect();
const bleedReflectEffect = {
  type: "DOT",
  subtype: "Bleed",
  damage: [
    {
      character: "Attacker",
      maxRoll: "DamageDealt",
      maxPercent: 300,
      roll: false,
    },
  ],
  procs: 20,
  interval: 500,
  chance: 100,
};
const poisonEffect = new PoisonEffect();
const deadlyPoisonEffect = new DeadlyPoisonEffect();
const frostBurnEffect = {
  type: "Modifier",
  modifiers: { increasedFrostburn: 3, increasedAttackIntervalPercent: 10 },
  turns: 2,
  character: "Target",
  countsOn: "Target",
  maxStacks: 1,
  stacksToAdd: 1,
  media: effectMedia.frostBurn,
};
const decreasedEvasionStackingEffect = {
  type: "Modifier",
  modifiers: { decreasedGlobalEvasion: 10 },
  maxStacks: 3,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Target",
  character: "Target",
  media: effectMedia.defenseDown,
};
const afflictionEffect = {
  type: "Modifier",
  modifiers: { decreasedMaxHitpoints: 1 },
  maxStacks: 50,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Target",
  character: "Target",
  media: effectMedia.afflicted,
};
const shockEffect = {
  type: "Modifier",
  modifiers: { decreasedDamageReduction: 2 },
  maxStacks: 10,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Target",
  character: "Target",
  media: effectMedia.shocked,
};
const absorbingSkinEffect = {
  type: "Modifier",
  modifiers: { increasedDamageReduction: 3 },
  maxStacks: 10,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Target",
  character: "Target",
  media: effectMedia.defenseUp,
};
const dualityEffect = {
  type: "Modifier",
  modifiers: { decreasedAttackIntervalPercent: 50 },
  maxStacks: 1,
  turns: 2,
  stacksToAdd: 1,
  countsOn: "Attacker",
  character: "Attacker",
  media: effectMedia.speedup,
};
const rageEffect = {
  type: "Modifier",
  modifiers: { increasedMaxHitPercent: 2, decreasedAttackIntervalPercent: 2 },
  maxStacks: 10,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Attacker",
  character: "Target",
  media: effectMedia.offenseUp,
};
const darkBladeEffect = {
  type: "Modifier",
  modifiers: { increasedMaxHitPercent: 1 },
  maxStacks: 30,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Attacker",
  character: "Attacker",
  media: effectMedia.offenseUp,
};
const assassinEffect = {
  type: "Modifier",
  modifiers: { increasedGlobalAccuracy: 30 },
  maxStacks: 5,
  turns: 5,
  stacksToAdd: 1,
  countsOn: "Attacker",
  character: "Attacker",
  media: effectMedia.offenseUp,
};
const growingMadnessEffect = {
  type: "Modifier",
  modifiers: { decreasedAttackIntervalPercent: 2, increasedMaxHitPercent: 2 },
  maxStacks: 25,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Attacker",
  character: "Attacker",
  media: effectMedia.offenseUp,
};
const momentInTimeEffect = {
  type: "Modifier",
  modifiers: {
    decreasedAttackIntervalPercent: 2,
    increasedMaxHitPercent: 2,
    increasedGlobalAccuracy: 2,
  },
  maxStacks: 25,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Attacker",
  character: "Attacker",
  media: effectMedia.offenseUp,
};
const reignOverTimeEffect = {
  type: "Modifier",
  modifiers: {
    decreasedAttackIntervalPercent: 2,
    increasedMaxHitPercent: 2,
    increasedGlobalAccuracy: 2,
    increasedGlobalEvasion: 2,
  },
  maxStacks: 25,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Attacker",
  character: "Attacker",
  media: effectMedia.offenseUp,
};
const shadowCloakEffect = {
  type: "Modifier",
  modifiers: { decreasedGlobalEvasion: 40 },
  maxStacks: 1,
  stacksToAdd: 1,
  turns: Infinity,
  countsOn: "Attacker",
  character: "Attacker",
  media: effectMedia.defenseDown,
};
const increased5DROnHitEffect = {
  type: "Modifier",
  modifiers: { increasedDamageReduction: 5 },
  maxStacks: 1,
  stacksToAdd: 1,
  turns: 1,
  countsOn: "Target",
  character: "Attacker",
  media: effectMedia.defenseUp,
};
const elementalEffects = [
  { type: "Compound", chance: 100, numEffects: 3 },
  { chance: 100, turns: 1, type: "Stun", flavour: "Freeze" },
  burnEffect,
  frostBurnEffect,
];
function damageReducer(attacker, target, prevDamage = 0) {
  return (totalDamage, damage) => {
    if (
      damage.attackCount !== undefined &&
      damage.attackCount !== attacker.attackCount
    )
      return totalDamage;
    let character;
    switch (damage.character) {
      case "Attacker":
        character = attacker;
        break;
      case "Target":
        character = target;
        break;
      default:
        throw new Error(`Invalid damage character type: ${damage.character}`);
    }
    const maxRoll = getDamageRoll(
      character,
      damage.maxRoll,
      damage.maxPercent,
      prevDamage
    );
    if (damage.roll) {
      const minRoll = getDamageRoll(
        character,
        damage.minRoll,
        damage.minPercent,
        prevDamage
      );
      return rollInteger(minRoll, maxRoll) + totalDamage;
    } else {
      return maxRoll + totalDamage;
    }
  };
}
function getMaxDamage(damage, attacker, target, prevDamage = 0) {
  let character;
  switch (damage.character) {
    case "Attacker":
      character = attacker;
      break;
    case "Target":
      character = target;
      break;
    default:
      throw new Error(`Invalid damage character type: ${damage.character}`);
  }
  const maxRoll = getDamageRoll(
    character,
    damage.maxRoll,
    damage.maxPercent,
    prevDamage
  );
  return maxRoll;
}
function getDamageRoll(character, type, percent, damageDealt = 0) {
  let value = 0;
  switch (type) {
    case "CurrentHP":
      value = character.hitpoints;
      break;
    case "MaxHP":
      value = character.stats.maxHitpoints;
      break;
    case "DamageDealt":
      value = damageDealt;
      break;
    case "MaxHit":
      value = character.stats.maxHit;
      break;
    case "MinHit":
      value = character.stats.minHit;
      break;
    case "Fixed":
      return percent * numberMultiplier;
    case "MagicScaling":
      value = (character.levels.Magic + 1) * numberMultiplier;
      break;
    case "One":
      return 1;
    case "Rend":
      if (character.target.hitpoints !== character.target.stats.maxHitpoints)
        percent = 250;
      value = damageDealt;
      break;
    case "Poisoned":
      if (character.isPoisoned) return numberMultiplier * percent;
      else return 0;
    case "Bleeding":
      if (character.isBleeding) return numberMultiplier * percent;
      else return 0;
    case "PoisonMin35":
      value = character.stats.minHit;
      if (character.target.isPoisoned) percent += 35;
      break;
    case "PoisonMax35":
      value = character.stats.maxHit;
      if (character.target.isPoisoned) percent += 35;
      break;
    case "PoisonFixed100":
      value = numberMultiplier * percent;
      if (character.target.isPoisoned) value *= 2;
      return value;
    case "BurnFixed100":
      value = numberMultiplier * percent;
      if (character.target.isBurning) value *= 2;
      return value;
    case "BurnMaxHit100":
      value = character.stats.maxHit;
      if (character.target.isBurning) percent += 100;
      break;
    case "CursedFixed100":
      value = numberMultiplier * percent;
      if (character.target.isCursed) value *= 2;
      return value;
    case "MaxHitDR":
      value = character.stats.maxHit;
      percent += character.stats.damageReduction;
      break;
    case "MaxHitScaledByHP":
      value = (character.stats.maxHit * character.hitpointsPercent) / 100;
      break;
    case "MaxHitScaledByHP2x":
      value = (character.stats.maxHit * (character.hitpointsPercent * 2)) / 100;
      break;
    case "FixedPlusMaxHit50":
      return numberMultiplier * percent + character.stats.maxHit / 2;
    case "HPUnder90":
      if (character.hitpointsPercent <= 90) return numberMultiplier * percent;
      else return 0;
    case "PoisonedMaxHit":
      value = character.target.isPoisoned ? character.stats.maxHit : 0;
      break;
    default:
      throw new Error(`Invalid damage type: ${type}`);
  }
  return Math.floor((value * percent) / 100);
}
const rollData = {
  CurrentHP: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) => ` of ${name} current hitpoints`,
  },
  MaxHP: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) => ` of ${name} max hitpoints`,
  },
  DamageDealt: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: () => ` of the damage dealt`,
  },
  MaxHit: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) => ` of ${name} max hit`,
  },
  FixedPlusMaxHit50: {
    formatPercent: (value) => `\${${value}}`,
    formatName: (name) => ` plus 50% of ${name} max hit`,
    modValue: multiplyByNumberMultiplier,
  },
  MinHit: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) => ` of ${name} min hit`,
  },
  Fixed: {
    formatPercent: (value) => `\${${value}}`,
    formatName: () => "",
    modValue: multiplyByNumberMultiplier,
  },
  MagicScaling: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) => ` of ${name} Magic level + 1`,
    modValue: multiplyByNumberMultiplier,
  },
  One: { formatPercent: () => "1", formatName: () => "" },
  Rend: {
    formatPercent: (value) =>
      `\${${value}}% if the target has full HP, otherwise 250%,`,
    formatName: () => ` of the damage dealt`,
  },
  Poisoned: {
    formatPercent: (value) => `\${${value}} if the target is poisoned`,
    formatName: () => "",
    modValue: multiplyByNumberMultiplier,
  },
  Bleeding: {
    formatPercent: (value) => `\${${value}} if the target is bleeding`,
    formatName: () => "",
    modValue: multiplyByNumberMultiplier,
  },
  PoisonMax35: {
    formatPercent: (value) =>
      `\${${value}}% + ${20}% damage if the target is poisoned`,
    formatName: (name) => ` of ${name} max hit`,
  },
  PoisonMin35: {
    formatPercent: (value) =>
      `\${${value}}% + ${20}% damage if the target is poisoned`,
    formatName: (name) => ` of ${name} min hit`,
  },
  PoisonFixed100: {
    formatPercent: (value) =>
      `\${${value}} + ${100}% damage if the target is poisoned`,
    formatName: () => "",
    modValue: multiplyByNumberMultiplier,
  },
  BurnFixed100: {
    formatPercent: (value) =>
      `\${${value}} + ${100}% damage if the target is burning`,
    formatName: () => "",
    modValue: multiplyByNumberMultiplier,
  },
  BurnMaxHit100: {
    formatPercent: (value) =>
      `\${${value}}% + ${100}% damage if the target is burning`,
    formatName: (name) => ` of ${name} max hit`,
  },
  CursedFixed100: {
    formatPercent: (value) =>
      `\${${value}} + ${100}% damage if the target is cursed`,
    formatName: () => "",
    modValue: multiplyByNumberMultiplier,
  },
  MaxHitScaledByHP: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) =>
      ` of ${name} max hit multiplied by ${name} current hitpoints percent`,
  },
  HPUnder90: {
    formatPercent: (value) =>
      `\${${value}} if the target's current hitpoints are under 90%`,
    formatName: () => "",
    modValue: multiplyByNumberMultiplier,
  },
  MaxHitScaledByHP2x: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) =>
      ` of ${name} max hit multiplied by 2 x ${name} current hitpoints percent`,
  },
  MaxHitDR: {
    formatPercent: (value) => `\${${value}}% + (Attacker DR%)`,
    formatName: () => ``,
  },
  PoisonedMaxHit: {
    formatPercent: (value) => `\${${value}}%`,
    formatName: (name) => ` of ${name} max hit if the target is poisoned`,
  },
};
function getDamageDescription(damage, attackerName, targetName, i, key) {
  let description = "";
  let name = "Unknown Name";
  switch (damage.character) {
    case "Attacker":
      name = attackerName.possesive;
      break;
    case "Target":
      name = targetName.possesive;
      break;
    default:
      throw new Error(`Invalid Damage Character`);
  }
  const maxData = rollData[damage.maxRoll];
  if (damage.roll) {
    const minData = rollData[damage.minRoll];
    if (damage.maxRoll === damage.minRoll) {
      description = `${minData.formatPercent(
        key + damageMinValue(i)
      )}-${maxData.formatPercent(key + damageMaxValue(i))}${minData.formatName(
        name
      )}`;
    } else if (
      damage.maxRoll === "MaxHit" &&
      damage.minRoll === "MinHit" &&
      damage.maxPercent === damage.minPercent
    ) {
      description = `\${${key + damageMaxValue(i)}}% of ${name} normal damage`;
    } else if (
      damage.maxRoll === "PoisonMax35" &&
      damage.minRoll === "PoisonMin35" &&
      damage.maxPercent === damage.minPercent
    ) {
      description = `\${${key + damageMaxValue(i)}}% + ${20}% if ${
        targetName.plain
      } ${targetName.is} poisoned of ${name} normal damage`;
    } else {
      description = `${minData.formatPercent(
        key + damageMinValue(i)
      )}${minData.formatName(name)} to ${maxData.formatPercent(
        key + damageMaxValue(i)
      )}${maxData.formatName(name)}`;
    }
  } else {
    description = `${maxData.formatPercent(
      key + damageMaxValue(i)
    )}${maxData.formatName(name)}`;
  }
  if (damage.attackCount !== undefined)
    description += ` on the ${formatAsOrdinal(damage.attackCount + 1)} attack`;
  description = description.trimEnd();
  return description;
}
function getEffectDescription(effect, attackerNoun, targetNoun, key) {
  let modifierDescription;
  let description = "";
  let damageDescriptions;
  let name;
  let countName;
  switch (effect.type) {
    case "DOT":
      damageDescriptions = effect.damage.map((damage, i) =>
        getDamageDescription(damage, attackerNoun, targetNoun, i, key)
      );
      if (effect.subtype === "Regen") {
        if (effect.chance < 100) {
          description += `has a \${${key}chance}% chance to give ${effect.subtype} `;
        } else {
          description += `gives ${effect.subtype} `;
        }
        description += `that heals ${joinAsList(
          damageDescriptions
        )} over \${${key}duration}s`;
      } else {
        if (effect.chance < 100) {
          description += `has a \${${key}chance}% chance to inflict ${effect.subtype} `;
        } else {
          description += `inflicts ${
            effect.subtype === "DeadlyPoison" ? "Deadly Poison" : effect.subtype
          } `;
        }
        description += `that deals ${joinAsList(
          damageDescriptions
        )} as damage over \${${key}duration}s`;
      }
      return description;
    case "Reflexive":
      modifierDescription = generateModifierDataDescription(
        effect.modifiers,
        key
      );
      return `gives ${attackerNoun.plain} ${modifierDescription} each time ${attackerNoun.pronoun} are hit for the duration of this attack (Stacks up to \${${key}maxStacks} times)`;
    case "Stacking":
      modifierDescription = generateModifierDataDescription(
        effect.modifiers,
        key
      );
      return `applies +\${${key}stacks} stack${pluralS(
        effect.stacksToAdd
      )} of ${effect.name} to ${
        targetNoun.plain
      } (Max \${${key}maxStacks} stack${pluralS(effect.maxStacks)}). ${
        effect.name
      } gives ${modifierDescription} regardless of number of stacks. One stack is removed after each of ${
        targetNoun.possesive
      } turns`;
    case "Modifier":
      modifierDescription = generateModifierDataDescription(
        effect.modifiers,
        key
      );
      name = effect.character === "Attacker" ? attackerNoun : targetNoun;
      countName = effect.countsOn === "Attacker" ? attackerNoun : targetNoun;
      if (effect === frostBurnEffect) {
        return `gives ${name.plain} Frostburn for \${${key}turns} of ${countName.possesive} turns`;
      }
      if (effect.maxStacks > 1) {
        return `gives ${name.plain} ${modifierDescription} that stacks up to \${${key}maxStacks} times`;
      } else if (effect.turns === Infinity) {
        return `gives ${name.plain} ${modifierDescription} until the end of the fight`;
      } else {
        let durationtext = "";
        if (effect.turns > 0)
          durationtext = `for \${${key}turns} of ${countName.possesive} turns`;
        else durationtext = `until the end of the attack`;
        return `gives ${name.plain} ${modifierDescription} ${durationtext}`;
      }
    case "Sleep": {
      const thresholdText =
        effect.hitpointThreshold !== undefined
          ? ` if ${targetNoun.possesive} hitpoints are below \${${key}hpThreshold}%`
          : "";
      if (effect.chance < 100) {
        return `has a \${${key}chance}% chance to apply sleep for \${${key}turns} turn${pluralS(
          effect.turns
        )}${thresholdText}`;
      } else {
        return `applies sleep for \${${key}turns} turn${pluralS(
          effect.turns
        )}${thresholdText}`;
      }
    }
    case "Stun":
      if (effect.chance < 100) {
        return `has a \${${key}chance}% chance to apply ${setToLowercase(
          effect.flavour
        )} for \${${key}turns} turn${pluralS(effect.turns)}`;
      } else {
        return `applies ${setToLowercase(
          effect.flavour
        )} for \${${key}turns} turn${pluralS(effect.turns)}`;
      }
    case "Compound":
      if (effect.chance < 100) {
        return `has a \${${key}chance}% chance to apply one of the following:`;
      } else {
        return `applies one of the following:`;
      }
    case "Combo":
      modifierDescription = generateModifierDataDescription(
        effect.modifiers,
        key
      );
      return `gives ${attackerNoun.plain} ${modifierDescription} each time ${attackerNoun.pronoun} successfully hit, stacking up to \${${key}maxStacks} times. Stacks reset on a miss.`;
    case "Curse":
      if (effect.chance < 100) {
        if (effect.isRandom)
          return `has a \${${key}chance}% chance to apply a random Curse for 3 turns`;
        return `has a \${${key}chance}% chance to apply the ${effect.curse.name} Curse for 3 turns`;
      } else {
        if (effect.isRandom) return `applies a random Curse for 3 turns`;
        return `applies the ${effect.curse.name} Curse for 3 turns`;
      }
  }
}
const attackDescriptors = {
  Count: (attack, attNoun, targNoun) => "${hitCount}",
  Damage: (attack, attNoun, targNoun) =>
    joinAsList(
      attack.damage.map((damage, i) =>
        getDamageDescription(damage, attNoun, targNoun, i, "attack")
      )
    ),
  Lifesteal: (attack, attNoun, targNoun) => "${lifesteal}%",
  Target: (attack, attNoun, targNoun) => `${targNoun.plain}`,
  Attacker: (attack, attNoun, targNoun) => `${attNoun.plain}`,
  TarPos: (attack, attNoun, targNoun) => `${targNoun.possesive}`,
  AttPos: (attack, attNoun, targNoun) => `${attNoun.possesive}`,
  PrehitEffect: (attack, attNoun, targNoun) =>
    joinAsSuperList(
      attack.prehitEffects.map((effect, i) =>
        getEffectDescription(effect, attNoun, targNoun, effectKey(true, i))
      )
    ),
  HitEffect: (attack, attNoun, targNoun) =>
    joinAsSuperList(
      attack.onhitEffects.map((effect, i) =>
        getEffectDescription(effect, attNoun, targNoun, effectKey(false, i))
      )
    ),
  CanMiss: (attack, attNoun, targNoun) =>
    attack.cantMiss ? `can't miss` : "can miss",
  Avoidable: (attack, attNoun, targNoun) =>
    attack.cantMiss ? `unavoidable` : "avoidable",
  Duration: (attack, attNoun, tarNoun) => "${duration}s",
  Interval: (attack, attNoun, tarNoun) => "${interval}s",
  Taris: (attack, attNoun, tarNoun) => `${tarNoun.is}`,
  Attis: (attack, attNoun, tarNoun) => `${attNoun.is}`,
};
function damageMaxValue(i) {
  return `DamageMaxValue${i}`;
}
function damageMinValue(i) {
  return `DamageMinValue${i}`;
}
function effectKey(preHit, i) {
  return preHit ? `preHitEffect${i}` : `onHitEffect${i}`;
}
function addEffectTemplateData(data, effect, preHit, i) {
  const preKey = effectKey(preHit, i);
  const addKey = (key, value) => {
    data[`${preKey}${key}`] = value;
  };
  switch (effect.type) {
    case "DOT":
      addDamageTemplateData(data, effect.damage, preKey);
      addKey("chance", `${effect.chance}`);
      addKey("duration", `${(effect.procs * effect.interval) / 1000}`);
      break;
    case "Reflexive":
      addModifierTemplateData(data, effect.modifiers, preKey);
      addKey("turns", `${effect.turns}`);
      addKey("maxStacks", `${effect.maxStacks}`);
      break;
    case "Stacking":
      addModifierTemplateData(data, effect.modifiers, preKey);
      addKey("stacks", `${effect.stacksToAdd}`);
      addKey("maxStacks", `${effect.maxStacks}`);
      break;
    case "Modifier":
      addModifierTemplateData(data, effect.modifiers, preKey);
      addKey("maxStacks", `${effect.maxStacks}`);
      addKey("turns", `${effect.turns}`);
      break;
    case "Sleep":
      addKey("chance", `${effect.chance}`);
      addKey("turns", `${effect.turns}`);
      if (effect.hitpointThreshold !== undefined)
        addKey("hpThreshold", `${effect.hitpointThreshold}`);
      break;
    case "Stun":
      addKey("chance", `${effect.chance}`);
      addKey("turns", `${effect.turns}`);
      break;
    case "Combo":
      addModifierTemplateData(data, effect.modifiers, preKey);
      addKey("maxStacks", `${effect.maxStacks}`);
      break;
    case "Compound":
      addKey("chance", `${effect.chance}`);
      break;
    case "Curse":
      addKey("chance", `${effect.chance}`);
      addKey("curse", `${effect.curse}`);
      addKey("isRandom", `${effect.isRandom}`);
      break;
  }
}
function addDamageTemplateData(data, damage, key) {
  damage.forEach((damage, i) => {
    const maxData = rollData[damage.maxRoll];
    let maxVal = damage.maxPercent;
    if (maxData.modValue !== undefined) maxVal = maxData.modValue(maxVal);
    data[key + damageMaxValue(i)] = `${maxVal}`;
    if (damage.roll) {
      const minData = rollData[damage.minRoll];
      let minVal = damage.minPercent;
      if (minData.modValue !== undefined) minVal = minData.modValue(minVal);
      data[key + damageMinValue(i)] = `${minVal}`;
    }
  });
}
const generateAttackDescription = (attack, attNoun, targNoun) => {
  if (attack.descriptionGenerator === undefined)
    throw new Error(
      `Error generating attack description, no generator present.`
    );
  let description = attack.descriptionGenerator;
  Object.entries(attackDescriptors).forEach(([replaceName, describer]) => {
    description = description.replace(
      new RegExp(`<${replaceName}>`, "gi"),
      (match) => {
        let replaceText = describer(attack, attNoun, targNoun);
        if (match[1].toUpperCase() === match[1])
          replaceText = `${replaceText[0].toUpperCase()}${replaceText.substring(
            1
          )}`;
        return replaceText;
      }
    );
  });
  return description;
};
const youNoun = { plain: "you", possesive: "your", pronoun: "you", is: "are" };
const enemyNoun = {
  plain: "the enemy",
  possesive: "the enemy's",
  pronoun: "they",
  is: "is",
};
