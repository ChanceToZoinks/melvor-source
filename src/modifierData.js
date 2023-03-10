"use strict";
const modifierData = {
  increasedGlobalAccuracy: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGlobalAccuracy");
    },
    description: "+${value}% Accuracy Rating",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "attack"],
  },
  increasedMeleeAccuracyBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeAccuracyBonus");
    },
    description: "+${value}% Melee Accuracy Rating",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "attack"],
  },
  increasedMeleeMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeMaxHit");
    },
    description: "+${value}% Melee Max Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  increasedMeleeEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeEvasion");
    },
    description: "+${value}% Melee Evasion",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "defence"],
  },
  increasedRangedAccuracyBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRangedAccuracyBonus");
    },
    description: "+${value}% Ranged Accuracy Rating",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "ranged"],
  },
  increasedRangedMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRangedMaxHit");
    },
    description: "+${value}% Ranged Max Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "ranged"],
  },
  increasedRangedEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRangedEvasion");
    },
    description: "+${value}% Ranged Evasion",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "ranged"],
  },
  increasedMagicAccuracyBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMagicAccuracyBonus");
    },
    description: "+${value}% Magic Accuracy Rating",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMagicMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMagicMaxHit");
    },
    description: "+${value}% Magic Max Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMagicEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMagicEvasion");
    },
    description: "+${value}% Magic Evasion",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Max Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  increasedMaxHitPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxHitPercent");
    },
    description: "+${value}% Max Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  increasedDamageReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageReduction");
    },
    description: "+${value}% Damage Reduction",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "defence", "thieving"],
  },
  increasedChanceToDoubleLootCombat: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToDoubleLootCombat"
      );
    },
    description: "+${value}% Chance To Double Loot in Combat",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedSlayerCoins: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSlayerCoins");
    },
    description: "+${value}% Slayer Coins",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "slayer"],
  },
  increasedHPRegenFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedHPRegenFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Flat HP Regen",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "hitpoints"],
  },
  increasedGPGlobal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPGlobal");
    },
    description: "+${value}% Global GP (except Item Sales)",
    isSkill: false,
    isNegative: false,
    tags: ["global"],
  },
  increasedGPFromMonsters: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromMonsters");
    },
    description: "+${value}% GP From Monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPFromMonstersFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromMonstersFlat");
    },
    description: "+${value} GP From Monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPFromThieving: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromThieving");
    },
    description: "+${value}% GP From Thieving",
    isSkill: false,
    isNegative: false,
    tags: ["thieving"],
  },
  increasedGPFromThievingFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromThievingFlat");
    },
    description: "+${value} GP From Thieving",
    isSkill: false,
    isNegative: false,
    tags: ["thieving"],
  },
  increasedGPFromAgility: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromAgility");
    },
    description: "+${value}% GP From Agility",
    isSkill: false,
    isNegative: false,
    tags: ["agility"],
  },
  decreasedGPFromAgility: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromAgility");
    },
    description: "-${value}% GP From Agility",
    isSkill: false,
    isNegative: true,
    tags: ["agility"],
  },
  increasedDamageToBosses: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageToBosses");
    },
    description: "+${value}% Damage To Bosses",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  increasedDamageToSlayerTasks: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageToSlayerTasks");
    },
    description: "+${value}% Damage To Slayer Tasks",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength", "slayer"],
  },
  increasedDamageToSlayerAreaMonsters: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageToSlayerAreaMonsters"
      );
    },
    description: "+${value}% Damage To Slayer Area Monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength", "slayer"],
  },
  increasedDamageToCombatAreaMonsters: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageToCombatAreaMonsters"
      );
    },
    description: "+${value}% Damage To Combat Area Monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  increasedDamageToDungeonMonsters: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageToDungeonMonsters");
    },
    description: "+${value}% Damage To Dungeon Monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  increasedDamageToAllMonsters: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageToAllMonsters");
    },
    description: "+${value}% Damage To All Monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  increasedAutoEatEfficiency: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAutoEatEfficiency");
    },
    description: "+${value}% Auto Eat Efficiency",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "thieving"],
  },
  increasedAutoEatThreshold: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAutoEatThreshold");
    },
    description: "+${value}% Auto Eat Threshold",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "thieving"],
  },
  increasedAutoEatHPLimit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAutoEatHPLimit");
    },
    description: "+${value}% Auto Eat HP Limit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "thieving"],
  },
  increasedFoodHealingValue: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFoodHealingValue");
    },
    description: "+${value}% Food Healing Value",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "thieving", "cooking"],
  },
  increasedChanceToPreservePrayerPoints: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToPreservePrayerPoints"
      );
    },
    description: "+${value}% Chance To Preserve Prayer Points",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "prayer"],
  },
  increasedFlatPrayerCostReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatPrayerCostReduction");
    },
    description: "-${value} Prayer Point Cost for Prayers",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "prayer"],
  },
  increasedMinAirSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinAirSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Min Air Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMinWaterSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinWaterSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Min Water Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMinEarthSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinEarthSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Min Earth Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMinFireSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinFireSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Min Fire Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedAmmoPreservation: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAmmoPreservation");
    },
    description: "+${value}% Ammo Preservation",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "ranged"],
  },
  increasedRunePreservation: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRunePreservation");
    },
    description: "+${value}% Rune Preservation",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedHiddenSkillLevel: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedHiddenSkillLevel");
    },
    description: "+${value} Hidden ${skillName} Level",
    isSkill: true,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedAttackInterval: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAttackInterval");
    },
    modifyValue: milliToSeconds,
    description: "-${value}s Attack Interval",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "attack"],
  },
  decreasedAttackIntervalPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAttackIntervalPercent");
    },
    description: "-${value}% Attack Interval",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "attack"],
  },
  increasedSlayerAreaEffectNegationFlat: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSlayerAreaEffectNegationFlat"
      );
    },
    description: "+${value}% Flat Slayer Area Effect Negation",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "slayer"],
  },
  decreasedMonsterRespawnTimer: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMonsterRespawnTimer");
    },
    modifyValue: milliToSeconds,
    description: "-${value}s Monster Respawn Timer",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedGlobalAccuracy: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGlobalAccuracy");
    },
    description: "-${value}% Global Accuracy",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "defence"],
  },
  decreasedMeleeAccuracyBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMeleeAccuracyBonus");
    },
    description: "-${value}% Melee Accuracy Rating",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "attack"],
  },
  decreasedMeleeMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMeleeMaxHit");
    },
    description: "-${value}% Melee Max Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  decreasedMeleeEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMeleeEvasion");
    },
    description: "-${value}% Melee Evasion",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "defence"],
  },
  decreasedRangedAccuracyBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRangedAccuracyBonus");
    },
    description: "-${value}% Ranged Accuracy Rating",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "ranged"],
  },
  decreasedRangedMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRangedMaxHit");
    },
    description: "-${value}% Ranged Max Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "ranged"],
  },
  decreasedRangedEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRangedEvasion");
    },
    description: "-${value}% Ranged Evasion",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "ranged"],
  },
  decreasedMagicAccuracyBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMagicAccuracyBonus");
    },
    description: "-${value}% Magic Accuracy Rating",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedMagicMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMagicMaxHit");
    },
    description: "-${value}% Magic Max Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedMagicEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMagicEvasion");
    },
    description: "-${value}% Magic Evasion",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Max Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "stength"],
  },
  decreasedMaxHitPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMaxHitPercent");
    },
    description: "-${value}% Max Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "stength"],
  },
  decreasedDamageReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageReduction");
    },
    description: "-${value}% Damage Reduction",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "defence", "thieving"],
  },
  decreasedChanceToDoubleLootCombat: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceToDoubleLootCombat"
      );
    },
    description: "-${value}% Chance To Double Loot in Combat",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedSlayerCoins: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSlayerCoins");
    },
    description: "-${value}% Slayer Coins",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "slayer"],
  },
  decreasedHPRegenFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedHPRegenFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Flat HP Regen",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "hitpoints"],
  },
  decreasedGPGlobal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPGlobal");
    },
    description: "-${value}% Global GP (except Item Sales)",
    isSkill: false,
    isNegative: true,
    tags: ["global"],
  },
  decreasedGPFromMonsters: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromMonsters");
    },
    description: "-${value}% GP From Monsters",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedGPFromMonstersFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromMonstersFlat");
    },
    description: "-${value} GP From Monsters",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedDamageToBosses: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageToBosses");
    },
    description: "-${value}% Damage To Bosses",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  decreasedDamageToSlayerTasks: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageToSlayerTasks");
    },
    description: "-${value}% Damage To Slayer Tasks",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "slayer"],
  },
  decreasedDamageToSlayerAreaMonsters: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageToSlayerAreaMonsters"
      );
    },
    description: "-${value}% Damage To Slayer Area Monsters",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "slayer"],
  },
  decreasedDamageToCombatAreaMonsters: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageToCombatAreaMonsters"
      );
    },
    description: "-${value}% Damage To Combat Area Monsters",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  decreasedDamageToDungeonMonsters: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageToDungeonMonsters");
    },
    description: "-${value}% Damage To Dungeon Monsters",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  decreasedDamageToAllMonsters: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageToAllMonsters");
    },
    description: "-${value}% Damage To All Monsters",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  decreasedAutoEatEfficiency: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAutoEatEfficiency");
    },
    description: "-${value}% Auto Eat Efficiency",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedAutoEatThreshold: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAutoEatThreshold");
    },
    description: "-${value}% Auto Eat Threshold",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedAutoEatHPLimit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAutoEatHPLimit");
    },
    description: "-${value}% Auto Eat HP Limit",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedFoodHealingValue: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFoodHealingValue");
    },
    description: "-${value}% Food Healing Value",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "thieving", "cooking"],
  },
  decreasedChanceToPreservePrayerPoints: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceToPreservePrayerPoints"
      );
    },
    description: "-${value}% Chance To Preserve Prayer Points",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "prayer"],
  },
  decreasedFlatPrayerCostReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFlatPrayerCostReduction");
    },
    description: "+${value} Prayer Point Cost for Prayers",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "prayer"],
  },
  decreasedMinAirSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMinAirSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Min Air Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedMinWaterSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMinWaterSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Min Water Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedMinEarthSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMinEarthSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Min Earth Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedMinFireSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMinFireSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Min Fire Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedAmmoPreservation: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAmmoPreservation");
    },
    description: "-${value}% Ammo Preservation",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "ranged"],
  },
  decreasedRunePreservation: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRunePreservation");
    },
    description: "-${value}% Rune Preservation",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "magic"],
  },
  decreasedHiddenSkillLevel: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedHiddenSkillLevel");
    },
    description: "-${value} Hidden ${skillName} Level",
    isSkill: true,
    isNegative: true,
    tags: ["combat"],
  },
  increasedAttackInterval: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAttackInterval");
    },
    modifyValue: milliToSeconds,
    description: "+${value}s Attack Interval",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedAttackIntervalPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAttackIntervalPercent");
    },
    description: "+${value}% Attack Interval",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMonsterRespawnTimer: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMonsterRespawnTimer");
    },
    modifyValue: milliToSeconds,
    description: "+${value}s Monster Respawn Timer",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedSlayerAreaEffectNegationFlat: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedSlayerAreaEffectNegationFlat"
      );
    },
    description: "-${value}% Flat Slayer Area Effect Negation",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "slayer"],
  },
  increasedGPFromSales: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromSales");
    },
    description: "+${value}% GP From Sales",
    isSkill: false,
    isNegative: false,
    tags: ["misc"],
  },
  increasedBankSpace: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBankSpace");
    },
    description: "+${value} Bank Space",
    isSkill: false,
    isNegative: false,
    tags: ["misc"],
  },
  increasedBankSpaceShop: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBankSpaceShop");
    },
    description: "+${value} Bank Space from Shop",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceToPreservePotionCharge: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToPreservePotionCharge"
      );
    },
    description: "+${value}% Chance To Preserve Potion Charge",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedGPFromSales: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromSales");
    },
    description: "-${value}% GP From Sales",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedBankSpace: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBankSpace");
    },
    description: "-${value} Bank Space",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedBankSpaceShop: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBankSpaceShop");
    },
    description: "-${value} Bank Space from Shop",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedChanceToPreservePotionCharge: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceToPreservePotionCharge"
      );
    },
    description: "-${value}% Chance To Preserve Potion Charge",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedSkillInterval: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSkillInterval");
    },
    modifyValue: milliToSeconds,
    description: "-${value}s ${skillName} Interval",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  decreasedSkillIntervalPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSkillIntervalPercent");
    },
    description: "-${value}% ${skillName} Interval",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedGlobalMasteryXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGlobalMasteryXP");
    },
    description: "+${value}% Global Mastery XP",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedGlobalSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGlobalSkillXP");
    },
    description: "+${value}% Global Skill XP",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedGlobalSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGlobalSkillXP");
    },
    description: "-${value}% Global Skill XP",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedMasteryXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMasteryXP");
    },
    description: "+${value}% ${skillName} Mastery XP",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillXP");
    },
    description: "+${value}% ${skillName} Skill XP",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedMiningNodeHP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMiningNodeHP");
    },
    description: "+${value} Mining Node HP",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedSkillInterval: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillInterval");
    },
    modifyValue: milliToSeconds,
    description: "+${value}s ${skillName} Interval",
    isSkill: true,
    isNegative: true,
    tags: [],
  },
  increasedSkillIntervalPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillIntervalPercent");
    },
    description: "+${value}% ${skillName} Interval",
    isSkill: true,
    isNegative: true,
    tags: [],
  },
  decreasedGlobalMasteryXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGlobalMasteryXP");
    },
    description: "-${value}% Global Mastery XP",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedMasteryXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMasteryXP");
    },
    description: "-${value}% ${skillName} Mastery XP",
    isSkill: true,
    isNegative: true,
    tags: [],
  },
  decreasedSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSkillXP");
    },
    description: "-${value}% ${skillName} Skill XP",
    isSkill: true,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedMiningNodeHP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMiningNodeHP");
    },
    description: "-${value} Mining Node HP",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedGPFromThieving: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromThieving");
    },
    description: "-${value}% GP From Thieving",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedGPFromThievingFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromThievingFlat");
    },
    description: "-${value} GP From Thieving",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  dungeonEquipmentSwapping: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "dungeonEquipmentSwapping");
    },
    description: "${value} Dungeon Equipment Swapping",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEquipmentSets: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEquipmentSets");
    },
    description: "+${value} Equipment Sets",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  autoSlayerUnlocked: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "autoSlayerUnlocked");
    },
    description: "${value} Auto Slayer Unlocked",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedTreeCutLimit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTreeCutLimit");
    },
    description: "+${value} Tree Cut Limit",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedGlobalPreservationChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedGlobalPreservationChance"
      );
    },
    description: "+${value}% Chance to Preserve Resources in Skills",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedGlobalPreservationChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedGlobalPreservationChance"
      );
    },
    description: "-${value}% Chance to Preserve Resources in Skills",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedFarmingYield: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFarmingYield");
    },
    description: "+${value}% Farming Yield",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedFarmingYield: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFarmingYield");
    },
    description: "-${value}% Farming Yield",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedMaxHitpoints: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxHitpoints");
    },
    description: "+${value}% Maximum Hitpoints",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMaxHitpoints: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMaxHitpoints");
    },
    description: "-${value}% Maximum Hitpoints",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedFlatMaxHitpoints: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatMaxHitpoints");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Maximum Hitpoints",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatMaxHitpoints: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFlatMaxHitpoints");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Maximum Hitpoints",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedSlayerTaskLength: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSlayerTaskLength");
    },
    description: "+${value}% Slayer Task Length/Qty",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedSlayerTaskLength: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSlayerTaskLength");
    },
    description: "-${value}% Slayer Task Length/Qty",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceToDoubleItemsSkill: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToDoubleItemsSkill"
      );
    },
    description: "+${value}% Chance to Double Items in ${skillName}",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  decreasedChanceToDoubleItemsSkill: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceToDoubleItemsSkill"
      );
    },
    description: "-${value}% Chance to Double Items in ${skillName}",
    isSkill: true,
    isNegative: true,
    tags: [],
  },
  increasedChanceToDoubleItemsGlobal: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToDoubleItemsGlobal"
      );
    },
    description: "+${value}% Chance to Double Items Globally",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceToDoubleItemsGlobal: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceToDoubleItemsGlobal"
      );
    },
    description: "-${value}% Chance to Double Items Globally",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedLifesteal");
    },
    description: "+${value}% Lifesteal",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedLifesteal");
    },
    description: "-${value}% Lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedReflectDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedReflectDamage");
    },
    description: "+${value}% Reflect Damage",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedReflectDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedReflectDamage");
    },
    description: "-${value}% Reflect Damage",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedSkillPreservationChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillPreservationChance");
    },
    description: "+${value}% Chance to Preserve Resources in ${skillName}",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  decreasedSkillPreservationChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSkillPreservationChance");
    },
    description: "-${value}% Chance to Preserve Resources in ${skillName}",
    isSkill: true,
    isNegative: true,
    tags: [],
  },
  increasedChanceToDoubleOres: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToDoubleOres");
    },
    description: "+${value}% Chance to Double Ores in Mining",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceToDoubleOres: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceToDoubleOres");
    },
    description: "-${value}% Chance to Double Ores in Mining",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedHitpointRegeneration: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedHitpointRegeneration");
    },
    description: "+${value}% Hitpoint Regeneration",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedHitpointRegeneration: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedHitpointRegeneration");
    },
    description: "-${value}% Hitpoint Regeneration",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  golbinRaidWaveSkipCostReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidWaveSkipCostReduction");
    },
    description: "-${value}% Golbin Raid Wave Skip Cost",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidIncreasedMaximumAmmo: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidIncreasedMaximumAmmo");
    },
    description: "+${value}% Maximum Ammo in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidIncreasedMaximumRunes: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidIncreasedMaximumRunes");
    },
    description: "+${value}% Maximum Runes in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidIncreasedMinimumFood: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidIncreasedMinimumFood");
    },
    description: "+${value} Minimum Food in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidIncreasedPrayerLevel: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidIncreasedPrayerLevel");
    },
    description: "+${value} Prayer Levels in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidIncreasedPrayerPointsStart: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "golbinRaidIncreasedPrayerPointsStart"
      );
    },
    description: "+${value} Starting Prayer Points in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidIncreasedPrayerPointsWave: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "golbinRaidIncreasedPrayerPointsWave"
      );
    },
    description: "+${value} Prayer Points per Wave in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidIncreasedStartingRuneCount: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "golbinRaidIncreasedStartingRuneCount"
      );
    },
    description: "+${value}% Starting Runes in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidPassiveSlotUnlocked: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidPassiveSlotUnlocked");
    },
    description: "Unlocked Passive Slot in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidPrayerUnlocked: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidPrayerUnlocked");
    },
    description: "Unlocked Prayer in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  golbinRaidStartingWeapon: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "golbinRaidStartingWeapon");
    },
    modifyValue: (value) => game.golbinRaid.startingWeapons[value].name,
    description: "Start with ${value} in Golbin Raid",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMinHitBasedOnMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinHitBasedOnMaxHit");
    },
    description: "+${value}% of Maximum Hit added to Minimum Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMinHitBasedOnMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMinHitBasedOnMaxHit");
    },
    description: "-${value}% of Maximum Hit added to Minimum Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedPotionChargesFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPotionChargesFlat");
    },
    description: "+${value} Charges per Potion",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedPotionChargesFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedPotionChargesFlat");
    },
    description: "-${value} Charges per Potion",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedBirdNestDropRate: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBirdNestDropRate");
    },
    description: "+${value}% Chance for Bird Nests to drop in Woodcutting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedBirdNestDropRate: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBirdNestDropRate");
    },
    description: "-${value}% Chance for Bird Nests to drop in Woodcutting",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceNoDamageMining: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceNoDamageMining");
    },
    description:
      "+${value}% Chance to deal no Damage to an Ore or Essence Mining Node",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceNoDamageMining: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceNoDamageMining");
    },
    description:
      "-${value}% Chance to deal no Damage to an Ore or Essence Mining Node",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedSeeingGoldChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSeeingGoldChance");
    },
    description:
      "+${value}% Chance to receive a Gold Bar when Smithing Silver Bars",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedSeeingGoldChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSeeingGoldChance");
    },
    description:
      "-${value}% Chance to receive a Gold Bar when Smithing Silver Bars",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceDoubleHarvest: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceDoubleHarvest");
    },
    description: "+${value}% Chance to Double Farming Yield",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceDoubleHarvest: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceDoubleHarvest");
    },
    description: "-${value}% Chance to Double Farming Yield",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceForElementalRune: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceForElementalRune");
    },
    description:
      "+${value}% Chance to receive random Elemental Runes from Runecrafting when creating Runes",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForElementalRune: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceForElementalRune");
    },
    description:
      "-${value}% Chance to receive random Elemental Runes from Runecrafting when creating Runes",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedElementalRuneGain: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedElementalRuneGain");
    },
    description:
      "+${value} Elemental Runes received from Runecrafting when creating Runes",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedElementalRuneGain: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedElementalRuneGain");
    },
    description:
      "-${value} Elemental Runes received from Runecrafting when creating Runes",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceRandomPotionHerblore: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceRandomPotionHerblore"
      );
    },
    description:
      "+${value}% Chance to receive a Random Tier of the same Potion in Herblore",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedChanceRandomPotionHerblore: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceRandomPotionHerblore"
      );
    },
    description:
      "-${value}% Chance to receive a Random Tier of the same Potion in Herblore",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedAttackRolls: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAttackRolls");
    },
    description: "Your Attacks now roll twice (Select highest chance)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedAttackRolls: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAttackRolls");
    },
    description: "-${value} rolls per Attack. Select highest chance",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  freeBonfires: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "freeBonfires");
    },
    description:
      "Bonfires in Firemaking require no logs to light. Automatically relights Bonfires when depleted",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedAltMagicSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAltMagicSkillXP");
    },
    description: "+${value}% Alt. Magic Skill XP",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedAltMagicSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAltMagicSkillXP");
    },
    description: "-${value}% Alt. Magic Skill XP",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceToConvertSeedDrops: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToConvertSeedDrops"
      );
    },
    description: "+${value}% chance to convert combat seed drops to herbs",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  aprilFoolsIncreasedMovementSpeed: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsIncreasedMovementSpeed");
    },
    description: "+${value}% Movement Speed",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  aprilFoolsDecreasedMovementSpeed: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsDecreasedMovementSpeed");
    },
    description: "-${value}% Movement Speed",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  aprilFoolsIncreasedTeleportCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsIncreasedTeleportCost");
    },
    description: "+${value}% Rune cost for Teleportation Spells",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  aprilFoolsDecreasedTeleportCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsDecreasedTeleportCost");
    },
    description: "-${value}% Rune cost for Teleportation Spells",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  aprilFoolsIncreasedUpdateDelay: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsIncreasedUpdateDelay");
    },
    description: "+${value} days next Major Update has been delayed",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  aprilFoolsDecreasedUpdateDelay: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsDecreasedUpdateDelay");
    },
    description: "-${value} days next Major Update has been delayed",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  aprilFoolsIncreasedLemonGang: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsIncreasedLemonGang");
    },
    description: "+${value} Lemon Gang reputation points",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  aprilFoolsDecreasedLemonGang: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsDecreasedLemonGang");
    },
    description: "-${value} Lemon Gang reputation points",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  aprilFoolsIncreasedCarrotGang: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsIncreasedCarrotGang");
    },
    description: "+${value} Carrot Gang reputation points",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  aprilFoolsDecreasedCarrotGang: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "aprilFoolsDecreasedCarrotGang");
    },
    description: "-${value} Carrot Gang reputation points",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedGPOnEnemyHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPOnEnemyHit");
    },
    description: "+${value} GP Gained on successful Enemy Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedGPOnEnemyHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPOnEnemyHit");
    },
    description: "-${value} GP Gained on successful Enemy Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedAdditionalRunecraftCountRunes: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedAdditionalRunecraftCountRunes"
      );
    },
    description:
      "Create +${value} Additional Runes of the same type in Runecrafting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedAdditionalRunecraftCountRunes: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedAdditionalRunecraftCountRunes"
      );
    },
    description:
      "Create -${value} Additional Runes of the same type in Runecrafting",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedGPFromMonstersFlatBasedOnEvasion: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedGPFromMonstersFlatBasedOnEvasion"
      );
    },
    description: "+${value}% of enemy's highest evasion rating as GP on kill",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPPerMeleeDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPPerMeleeDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% of melee damage dealt gained as GP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPPerRangedDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPPerRangedDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% of ranged damage dealt gained as GP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPPerMagicDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPPerMagicDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% of magic damage dealt gained as GP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPFromSlayerTaskMonsters: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedGPFromSlayerTaskMonsters"
      );
    },
    description: "+${value}% GP from Slayer Task monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPWhenHitBasedOnDR: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPWhenHitBasedOnDR");
    },
    description:
      "+${value} GP gained per your damage reduction when hit by an enemy (Procs once per Enemy Attack Turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPOnRegenBasedOnHPGain: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPOnRegenBasedOnHPGain");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% of passively regenerated health gained as GP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPFromBurningMonsters: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromBurningMonsters");
    },
    description: "+${value}% GP from burning Monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_1_2: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_1_2");
    },
    modifyValue: (value) => value + 1,
    description:
      "x${value} the effects of the Occultist Familiar when you are at full hp",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatMagicDefenceBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatMagicDefenceBonus");
    },
    description: "+${value} Magic Defence Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedSlayerTaskMonsterAccuracy: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedSlayerTaskMonsterAccuracy"
      );
    },
    description: "-${value}% Slayer Task monster Accuracy Rating",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMeleeRangedDefenceBonusBasedOnDR: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMeleeRangedDefenceBonusBasedOnDR"
      );
    },
    description:
      "Gain Melee and Ranged Defence Bonus equal to damage reduction. (e.g. 50% damage reduction grants +50 melee and ranged defence bonus)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedHPRegenWhenEnemyHasMoreEvasion: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedHPRegenWhenEnemyHasMoreEvasion"
      );
    },
    description:
      "+${value}% hitpoint regeneration when the enemy has more combined evasion ratings than the player",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_1_15: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_1_15");
    },
    description:
      "+${value} Melee, Ranged and Magic Defence Bonuses when burning",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedSCfromLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSCfromLifesteal");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% of lifesteal healing gained as Slayer Coins",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedHealingOnAttackBasedOnDR: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedHealingOnAttackBasedOnDR"
      );
    },
    modifyValue: multiplyByNumberMultiplier,
    description:
      "Heal for ${value}% of your damage reduction on attacking an enemy (once per turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedSummoningAttackLifesteal: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSummoningAttackLifesteal"
      );
    },
    description: "+${value}% Lifesteal for Summoning attacks",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedWoodcuttingGemChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedWoodcuttingGemChance");
    },
    description: "+${value}% chance to receive a gem per Woodcutting action",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedBonusFishingSpecialChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedBonusFishingSpecialChance"
      );
    },
    description: "+${value}% Special Item chance in Fishing",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_3_9: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_3_9");
    },
    description:
      "+${value}% chance to receive +1 cooked food. Cannot be doubled",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedRunecraftingStavePreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedRunecraftingStavePreservation"
      );
    },
    description:
      "+${value}% chance to preserve resources in Runecrafting when making staves",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_Ent_Leprechaun: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_Ent_Leprechaun");
    },
    description:
      "+${value} Bird Nest when thieving the lumberjack, but gain no GP",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedWoodcuttingJewelryChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedWoodcuttingJewelryChance"
      );
    },
    description:
      "+${value}% chance for Silver or Gold Jewelry to drop instead of a Bird's Nest from Woodcutting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_3_17: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_3_17");
    },
    description:
      "+${value}% chance to receive +1 log from Woodcutting or +1 item from Smithing",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedMinimumBirdNestsWhenPotionActive: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMinimumBirdNestsWhenPotionActive"
      );
    },
    description:
      "+${value} minimum Bird Nests recieved from Woodcutting when the Bird Nest Potion is active",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_3_19: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_3_19");
    },
    description:
      "+${value}% of Woodcutting XP gained as Firemaking XP, but chance to double logs is halved",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_4_5: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_4_5");
    },
    description:
      "+${value}% chance to get a second gem (that can be a different type) when receiving a gem from Mining",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedCookingSuccessCap: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedCookingSuccessCap");
    },
    description: "-${value}% Cooking success chance cap",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  doubleRuneEssenceMining: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "doubleRuneEssenceMining");
    },
    modifyValue: (value) => Math.pow(2, value),
    description: "x${value} Rune Essence received from Mining",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_Mole_Leprechaun: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_Mole_Leprechaun");
    },
    description: "+${value}% chance to receive a gem while thieving the Miner",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  doubleSilverGoldMining: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "doubleSilverGoldMining");
    },
    modifyValue: (value) => Math.pow(2, value),
    description: "x${value} Gold and Silver Ore recieved from Mining",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedMiningBarChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMiningBarChance");
    },
    description:
      "+${value}% chance to recieve the bar version of an ore when Mining",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedMiningNodeHPWithPerfectSwing: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMiningNodeHPWithPerfectSwing"
      );
    },
    description: "+${value} Mining node HP when using Perfect Swing Potions",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_4_19: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_4_19");
    },
    description:
      "+${value}% chance to receive a Diamond when burning a log in Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedFishingCookedChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFishingCookedChance");
    },
    description:
      "+${value}% chance to gain 1 cooked version of a fish when Fishing",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedRunecraftingWaterComboRunes: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedRunecraftingWaterComboRunes"
      );
    },
    description:
      "+${value} base quantity when creating Combination runes that require Water Runes in Runecrafting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_Octopus_Leprechaun: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "summoningSynergy_Octopus_Leprechaun"
      );
    },
    description:
      "+50% Thieving Interval and +2 base item quantity when thieving the Fisherman",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedCraftingJewelryRandomGemChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedCraftingJewelryRandomGemChance"
      );
    },
    description:
      "+${value}% chance to gain a random gem when creating jewelry in Crafting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedSmithingDragonGearPreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSmithingDragonGearPreservation"
      );
    },
    description:
      "+${value}% chance to preserve resources in Smithing when making Dragon Gear",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedFishermansPotionCharges: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFishermansPotionCharges");
    },
    description: "+${value}% Fisherman's Potion charges",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_6_7: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_6_7");
    },
    description:
      "+${value} stab, slash, block, and melee strength bonus when fighting a ranged enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMagicMinHitBasedOnMaxHitSlayerTask: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMagicMinHitBasedOnMaxHitSlayerTask"
      );
    },
    description:
      "+${value}% of Magic Maximum Hit added to Minimum Hit when fighting Slayer Task monsters",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedMeleeMaxHitBasedOnMaxHitSlayerTask: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMeleeMaxHitBasedOnMaxHitSlayerTask"
      );
    },
    description:
      "+${value}% of Melee Maximum Hit added to Minimum Hit when fighting Slayer Task monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_6_13: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_6_13");
    },
    description: "+${value}% damage reduction when fighting a ranged enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatHPRegenBasedOnMeleeMaxHit: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatHPRegenBasedOnMeleeMaxHit"
      );
    },
    description: "+${value}% of Melee max hit as flat hitpoint regeneration",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_6_15: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_6_15");
    },
    modifyValue: (value) => value + 1,
    description:
      "x${value} the effects of the Minotaur Familiar when the enemy is burning",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_7_8: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_7_8");
    },
    description:
      "+${value} Ranged Accuracy and Strength Bonus when fighting a magic enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRangedMaxHitBasedOnMaxHitSlayerTask: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedRangedMaxHitBasedOnMaxHitSlayerTask"
      );
    },
    description:
      "+${value}% of Ranged Maximum Hit added to Minimum Hit when fighting Slayer Task monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_7_13: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_7_13");
    },
    description: "+${value}% damage reduction when fighting a magic enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatHPRegenBasedOnRangedMaxHit: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatHPRegenBasedOnRangedMaxHit"
      );
    },
    description: "+${value}% of Ranged max hit as flat hitpoints regeneration",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceToApplyBurnWithRanged: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToApplyBurnWithRanged"
      );
    },
    description: "+${value}% chance to apply burn when attacking with Ranged",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedSlayerCoinsPerMagicDamageSlayerTask: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSlayerCoinsPerMagicDamageSlayerTask"
      );
    },
    modifyValue: divideByNumberMultiplier,
    description:
      "+${value}% of Magic Damage Dealt against Slayer Task monsters gained as Slayer Coins",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_8_13: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_8_13");
    },
    description: "+${value}% damage reduction when fighting a melee enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatHPRegenBasedOnMagicMaxHit: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatHPRegenBasedOnMagicMaxHit"
      );
    },
    description: "+${value}% of Magic max hit as flat hitpoints regeneration",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRunecraftingEssencePreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedRunecraftingEssencePreservation"
      );
    },
    description:
      "+${value}% chance to preserve resources when Runecrafting runes",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  thievingChefNoDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "thievingChefNoDamage");
    },
    description: "Take no damage when stunned by the Chef in Thieving",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedFlatCraftingDragonhideCost: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedFlatCraftingDragonhideCost"
      );
    },
    description:
      "-${value} Dragonhide costs when Crafting (Cannot be reduced below 1)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_9_17: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_9_17");
    },
    modifyValue: milliToSeconds,
    description: "-${value}s Skill Interval for Cooking & Smithing",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedGenerousCookPotionCharges: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedGenerousCookPotionCharges"
      );
    },
    description: "+${value}% Generous Cook Potion charges",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_9_19: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_9_19");
    },
    description: "0",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedRuneEssenceThievingMiner: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedRuneEssenceThievingMiner"
      );
    },
    description: "+${value} Rune Essence gained when Thieving the Miner",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceToDoubleLeatherDragonhideCrafting: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToDoubleLeatherDragonhideCrafting"
      );
    },
    description:
      "+${value}% chance to double items in Crafting when making Leather or Dragonhide armour",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_10_17: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_10_17");
    },
    description: "+${value}% Smithing & Runecrafting Preservation Chance",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  giveRandomComboRunesRunecrafting: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "giveRandomComboRunesRunecrafting");
    },
    description:
      "Gain a chance to receive random combination runes when recieving random elemental runes equal to the chance to receive random elemental runes from Runecrafting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedFireRunesWhenMakingElementalRunes: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFireRunesWhenMakingElementalRunes"
      );
    },
    description:
      "+${value} Fire Runes gained when Runecrafting elemental runes",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedThievingAutoSellPrice: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedThievingAutoSellPrice");
    },
    description:
      "Automatically sell Common Drops from Thieving for ${value}x their base sale price",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedRandomBarChanceThievingMiner: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedRandomBarChanceThievingMiner"
      );
    },
    description:
      "+${value}% chance to receive a random bar when gaining a Common Drop from Thieving the Miner",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedHerbSackChanceThievingFarmer: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedHerbSackChanceThievingFarmer"
      );
    },
    description:
      "+${value}% chance to receive a Herb Sack when gaining a Common Drop from Thieving the Farmer",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_Leprechaun_Devil: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "summoningSynergy_Leprechaun_Devil"
      );
    },
    description:
      "+50% chance to gain 100% GP, +35% chance to gain 4x items and +15% chance to gain no items or gp from Thieving",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedDamageReductionAgainstSlayerTasks: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageReductionAgainstSlayerTasks"
      );
    },
    description:
      "+${value}% Damage Reduction when fighting a Slayer Task monster",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedHitpointRegenerationAgainstSlayerTasks: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedHitpointRegenerationAgainstSlayerTasks"
      );
    },
    description:
      "+${value}% Hitpoint Regeneration when fighting Slayer Task monsters",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDragonBreathDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDragonBreathDamage");
    },
    description: "-${value}% damage taken from dragonbreath",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_13_14: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_13_14");
    },
    description:
      "+${value}% hitpoint regeneration when below 75% of max hitpoints",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedCraftingJewelryPreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedCraftingJewelryPreservation"
      );
    },
    description:
      "+${value}% chance to preserve resources in Crafting when making jewelry",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedCraftingPotionCharges: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedCraftingPotionCharges");
    },
    description: "+${value}% Crafting Potion charges",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFiremakingLogGP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFiremakingLogGP");
    },
    description:
      "+${value}% of Log base sale price granted as GP when Burnt in Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  doubleSilverGoldSmithingWithSeeingGold: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "doubleSilverGoldSmithingWithSeeingGold"
      );
    },
    description:
      "x2 Silver and Gold bars recieved from Smithing when using Seeing Gold Potions",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedFlatSmithingCoalCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFlatSmithingCoalCost");
    },
    description: "-${value} Coal Ore Cost when Smithing",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  summoningSynergy_Bear_Devil: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_Bear_Devil");
    },
    description:
      "+${value}% Firemaking XP and +100% bonfire duration when using Controlled Heat Potions",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedFlatReflectDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatReflectDamage");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Reflect Damage",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatReflectDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFlatReflectDamage");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Reflect Damage",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedRolledReflectDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRolledReflectDamage");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+0-${value} Reflect Damage",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedRolledReflectDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRolledReflectDamage");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-0-${value} Reflect Damage",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedFlatMinHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatMinHit");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Minimum Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatMinHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFlatMinHit");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Minimum Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedConfusion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedConfusion");
    },
    description:
      "+${value}% of remaining HP taken as damage on a successful attack (once per turn)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDecay: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDecay");
    },
    description:
      "+${value}% of Max HP taken as damage on a successful attack (once per turn)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageTaken: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageTaken");
    },
    description: "+${value}% more Damage taken",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedDamageTaken: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageTaken");
    },
    description: "${value}% less Damage taken",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGlobalEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGlobalEvasion");
    },
    description: "+${value}% Global Evasion",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedGlobalEvasion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGlobalEvasion");
    },
    description: "-${value}% Global Evasion",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceAdditionalSkillResource: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceAdditionalSkillResource"
      );
    },
    description:
      "+${value}% Chance to gain +1 additional resource in ${skillName}. Cannot be doubled",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  decreasedChanceAdditionalSkillResource: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceAdditionalSkillResource"
      );
    },
    description:
      "-${value}% Chance to gain +1 additional resource in ${skillName}. Cannot be doubled",
    isSkill: true,
    isNegative: true,
    tags: [],
  },
  increasedMeleeStrengthBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeStrengthBonus");
    },
    description: "+${value}% Melee Strength Bonus from Equipment",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRangedStrengthBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRangedStrengthBonus");
    },
    description: "+${value}% Ranged Strength Bonus from Equipment",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMagicDamageBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMagicDamageBonus");
    },
    description: "+${value}% Magic Damage Bonus from Equipment",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMeleeStrengthBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMeleeStrengthBonus");
    },
    description: "-${value}% Melee Strength Bonus from Equipment",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedRangedStrengthBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRangedStrengthBonus");
    },
    description: "-${value}% Ranged Strength Bonus from Equipment",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedMagicDamageBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMagicDamageBonus");
    },
    description: "-${value}% Magic Damage Bonus from Equipment",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMaxAirSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxAirSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Max Air Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMaxWaterSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxWaterSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Max Water Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMaxEarthSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxEarthSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Max Earth Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMaxFireSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxFireSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Max Fire Spell Dmg",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMaxAirSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMaxAirSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Max Air Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedMaxWaterSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMaxWaterSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Max Water Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedMaxEarthSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMaxEarthSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Max Earth Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedMaxFireSpellDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMaxFireSpellDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Max Fire Spell Dmg",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedAgilityObstacleCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAgilityObstacleCost");
    },
    description: "+${value}% Agility Obstacle Build Costs",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedAgilityObstacleCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAgilityObstacleCost");
    },
    description: "-${value}% Agility Obstacle Build Costs",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedSecondaryFoodBurnChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSecondaryFoodBurnChance");
    },
    description: "0",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  freeCompost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "freeCompost");
    },
    description: "Composting crops in Farming is free",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedCompostPreservationChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedCompostPreservationChance"
      );
    },
    description:
      "+${value}% Chance to preserve Compost or Weird Gloop applied to Farming Plots when harvesting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedOffItemChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedOffItemChance");
    },
    description:
      "${value}% increased chance to receive Global Rare Items, Mastery Tokens, Bird Nests from Woodcutting, Gems from Mining, and Coal from Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedFiremakingCoalChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFiremakingCoalChance");
    },
    description:
      "+${value}% chance to receive coal when burning logs in Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  doubleItemsSkill: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "doubleItemsSkill");
    },
    modifyValue: (value) => Math.pow(2, value),
    description: "x${value} Items received from ${skillName}",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedMiningGemChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMiningGemChance");
    },
    description:
      "+${value}% Chance to receive gems from Mining (Does not work for Rune Essence)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  doubleOresMining: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "doubleOresMining");
    },
    modifyValue: (value) => Math.pow(2, value),
    description: "x${value} Ores received from Mining",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedBonusCoalMining: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBonusCoalMining");
    },
    description:
      "+${value} Coal Ore per Ore Mined. (Item doubling does not apply)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedSmithingCoalCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSmithingCoalCost");
    },
    description: "-${value}% Coal Costs for Smithing",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  allowSignetDrops: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "allowSignetDrops");
    },
    get description() {
      return `if equipped, something special might drop while training Skills.`;
    },
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  bonusCoalOnDungeonCompletion: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "bonusCoalOnDungeonCompletion");
    },
    description: "1% chance to receive ${value} Coal when completing a dungeon",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMasteryPoolProgress: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMasteryPoolProgress");
    },
    description: "+${value}% to effective Mastery Pool progress",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedMeleeLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeLifesteal");
    },
    description: "+${value}% Melee lifesteal",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRangedLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRangedLifesteal");
    },
    description: "+${value}% Ranged lifesteal",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMagicLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMagicLifesteal");
    },
    description: "+${value}% Magic lifesteal",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedBleedLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBleedLifesteal");
    },
    description: "+${value}% Bleed lifesteal",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedBurnLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBurnLifesteal");
    },
    description: "+${value}% Burn lifesteal",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedPoisonLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPoisonLifesteal");
    },
    description: "+${value}% Poison lifesteal",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMeleeLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMeleeLifesteal");
    },
    description: "-${value}% Melee lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedRangedLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRangedLifesteal");
    },
    description: "-${value}% Ranged lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedMagicLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMagicLifesteal");
    },
    description: "-${value}% Magic lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedBleedLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBleedLifesteal");
    },
    description: "-${value}% Bleed lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedBurnLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBurnLifesteal");
    },
    description: "-${value}% Burn lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedPoisonLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedPoisonLifesteal");
    },
    description: "-${value}% Poison lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMeleeCritChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeCritChance");
    },
    description: "+${value}% Melee critical hit chance",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMeleeCritChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMeleeCritChance");
    },
    description: "-${value}% Melee critical hit chance",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedRangedCritChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRangedCritChance");
    },
    description: "+${value}% Ranged critical hit chance",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedRangedCritChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRangedCritChance");
    },
    description: "-${value}% Ranged critical hit chance",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMagicCritChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMagicCritChance");
    },
    description: "+${value}% Magic critical hit chance",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMagicCritChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMagicCritChance");
    },
    description: "-${value}% Magic critical hit chance",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  meleeProtection: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "meleeProtection");
    },
    description: "${value}% chance to dodge Melee attacks",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  rangedProtection: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "rangedProtection");
    },
    description: "${value}% chance to dodge Ranged attacks",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  magicProtection: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "magicProtection");
    },
    description: "${value}% chance to dodge Magic attacks",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRuneProvision: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRuneProvision");
    },
    modifyValue: (value) => Math.pow(2, value),
    description: "Rune providing items provide ${value}x as many runes",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  bypassSlayerItems: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "bypassSlayerItems");
    },
    description:
      "Bypass Slayer Area item requirements for areas that require less than level 100 Slayer",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  curseImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "curseImmunity");
    },
    description: "Immune to curses",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedDamageReductionPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageReductionPercent");
    },
    description: "${value}% increased damage reduction",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDamageReductionPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageReductionPercent");
    },
    description: "${value}% decreased damage reduction",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  itemProtection: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "itemProtection");
    },
    description: "Items are not lost on death",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRedemptionThreshold: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRedemptionThreshold");
    },
    description: "+${value}% redemption threshold",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRedemptionPercent: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRedemptionPercent");
    },
    description: "+${value}% of max hitpoints healed on redemption",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  autoLooting: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "autoLooting");
    },
    description: "Combat loot is automatically collected",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  autoBurying: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "autoBurying");
    },
    modifyValue: (value) => 100 + value,
    description:
      "Bones are automatically buried for ${value}% of their Prayer Point value",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  freeProtectItem: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "freeProtectItem");
    },
    description: "The Protect Item Prayer costs nothing",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  stunImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "stunImmunity");
    },
    description: "+${value}% chance to ignore Stuns and Freezes",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  sleepImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "sleepImmunity");
    },
    description: "Immune to Sleep",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  debuffImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "debuffImmunity");
    },
    description: "Immune to debuffs",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  burnImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "burnImmunity");
    },
    description: "+${value}% chance to ignore burn",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  poisonImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "poisonImmunity");
    },
    description: "+${value}% chance to ignore poison",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  bleedImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "bleedImmunity");
    },
    description: "+${value}% chance to ignore bleed",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedRebirthChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRebirthChance");
    },
    description:
      "+${value}% chance to respawn with full hitpoints upon reaching 0 hitpoints",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceToApplyBurn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToApplyBurn");
    },
    description: "+${value}% Chance to apply burn when attacking",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedChanceToApplyBurn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceToApplyBurn");
    },
    description: "-${value}% Chance to apply burn when attacking",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedSummoningShardCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSummoningShardCost");
    },
    description: "+${value} Shard Cost when creating Familiars in Summoning",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedSummoningShardCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSummoningShardCost");
    },
    description: "-${value} Shard Cost when creating Familiars in Summoning",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedSummoningCreationCharges: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSummoningCreationCharges"
      );
    },
    description: "+${value} Base Quantity for Summoning Tablet Creation",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedSummoningCreationCharges: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedSummoningCreationCharges"
      );
    },
    description: "-${value} Base Quantity for Summoning Tablet Creation",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedSummoningChargePreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSummoningChargePreservation"
      );
    },
    description: "+${value}% Chance to preserve Summoning Charges",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedSummoningChargePreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedSummoningChargePreservation"
      );
    },
    description: "-${value}% Chance to preserve Summoning Charges",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedPrayerCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedPrayerCost");
    },
    description: "-${value}% Prayer Point Cost for Prayers",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedPrayerCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPrayerCost");
    },
    description: "+${value}% Prayer Point Cost for Prayers",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedGPMultiplierPer1MGP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPMultiplierPer1MGP");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% GP per damage dealt for every 1M GP owned",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPMultiplierCap: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPMultiplierCap");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% maximum gp per damage dealt",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPMultiplierMin: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPMultiplierMin");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% minimum gp per damage dealt",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  allowAttackAugmentingMagic: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "allowAttackAugmentingMagic");
    },
    description: "Magic Curses and Auroras can be used without a Magic weapon",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMeleeStunThreshold: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeStunThreshold");
    },
    description:
      "Melee attacks stun the target when they deal ${value}% of max hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  autoEquipFoodUnlocked: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "autoEquipFoodUnlocked");
    },
    description: "${value} Auto Equip Food Unlocked",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  autoSwapFoodUnlocked: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "autoSwapFoodUnlocked");
    },
    description: "${value} Auto Swap Food Unlocked",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceSuccessfulCook: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceSuccessfulCook");
    },
    description: "+${value}% chance to successfully Cook an item",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceSuccessfulCook: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceSuccessfulCook");
    },
    description: "-${value}% chance to successfully Cook an item",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChancePerfectCookGlobal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChancePerfectCookGlobal");
    },
    description: "+${value}% Global Perfect Cook chance",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChancePerfectCookGlobal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChancePerfectCookGlobal");
    },
    description: "-${value}% Global Perfect Cook chance",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChancePerfectCookFire: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChancePerfectCookFire");
    },
    description:
      "+${value}% Perfect Cook chance for items cooked on Cooking Fire",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChancePerfectCookFire: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChancePerfectCookFire");
    },
    description:
      "-${value}% Perfect Cook chance for items cooked on Cooking Fire",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChancePerfectCookFurnace: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChancePerfectCookFurnace"
      );
    },
    description: "+${value}% Perfect Cook chance for items cooked on Furnace",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChancePerfectCookFurnace: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChancePerfectCookFurnace"
      );
    },
    description: "-${value}% Perfect Cook chance for items cooked on Furnace",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChancePerfectCookPot: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChancePerfectCookPot");
    },
    description: "+${value}% Perfect Cook chance for items cooked on Pot",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChancePerfectCookPot: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChancePerfectCookPot");
    },
    description: "-${value}% Perfect Cook chance for items cooked on Pot",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedThievingStealth: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedThievingStealth");
    },
    description: "+${value} Stealth while Thieving",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedThievingStealth: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedThievingStealth");
    },
    description: "-${value} Stealth while Thieving",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedAltMagicRunePreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedAltMagicRunePreservation"
      );
    },
    description: "+${value}% Rune Preservation for Alt. Magic Spells",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedAltMagicRunePreservation: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedAltMagicRunePreservation"
      );
    },
    description: "-${value}% Rune Preservation for Alt. Magic Spells",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedMinThievingGP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinThievingGP");
    },
    description: "+${value}% minimum GP from Thieving",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedMinThievingGP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMinThievingGP");
    },
    description: "-${value}% minimum GP from Thieving",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedFishingSpecialChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFishingSpecialChance");
    },
    description: "+${value}% chance to receive Special Items from Fishing",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedFishingSpecialChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFishingSpecialChance");
    },
    description: "-${value}% chance to receive Special Items from Fishing",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedAllotmentSeedCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAllotmentSeedCost");
    },
    description: "-${value} seed cost to plant Allotments in Farming",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedAllotmentSeedCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAllotmentSeedCost");
    },
    description: "+${value} seed cost to plant Allotments in Farming",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedFrostburn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFrostburn");
    },
    description: "${value}% of Current HP taken as damage per Attack",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedSummoningMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSummoningMaxHit");
    },
    description: "+${value}% Summoning Max Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedSummoningMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSummoningMaxHit");
    },
    description: "-${value}% Summoning Max Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  masteryToken: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "masteryToken");
    },
    description:
      "Grants Mastery Pool XP equal to ${value}% of the maximum Mastery Pool XP for the respective skill",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedChanceForDiamondFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceForDiamondFiremaking"
      );
    },
    description:
      "+${value}% chance to receive a Diamond per action in Firemaking (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForDiamondFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceForDiamondFiremaking"
      );
    },
    description:
      "-${value}% chance to receive a Diamond per action in Firemaking (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedAfflictionChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAfflictionChance");
    },
    description: "+${value}% chance to apply affliction when attacking",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  otherStyleImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "otherStyleImmunity");
    },
    description: "Immune to all attack types other than their own",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  meleeImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "meleeImmunity");
    },
    description: "Immune to Melee attacks",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  rangedImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "rangedImmunity");
    },
    description: "Immune to Ranged attacks",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  magicImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "magicImmunity");
    },
    description: "Immune to Magic attacks",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  slowImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "slowImmunity");
    },
    description: "+${value}% chance to ignore Slow effects",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEndOfTurnHealing2: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEndOfTurnHealing2");
    },
    description: "Heal ${value}% of current hitpoints every 2 turns",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEndOfTurnHealing3: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEndOfTurnHealing3");
    },
    description: "Heal ${value}% of current hitpoints every 3 turns",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEndOfTurnHealing5: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEndOfTurnHealing5");
    },
    description: "Heal ${value}% of current hitpoints every 5 turns",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceToApplyPoison: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToApplyPoison");
    },
    description:
      "+${value}% chance to apply poison when hitting with an attack",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceToApplyFrostburn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToApplyFrostburn");
    },
    description: "+${value}% chance to apply frostburn when attacking",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMeleeStunChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeStunChance");
    },
    description:
      "+${value}% chance to stun when hitting with a Melee attack (once per turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedElementalEffectChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedElementalEffectChance");
    },
    description:
      "+${value}% chance to apply Burn, Frostburn or Freeze when hitting with a Magic attack (once per turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  frostBurnImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "frostBurnImmunity");
    },
    description: "+${value}% chance to ignore Frostburn",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedPoisonReflectChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPoisonReflectChance");
    },
    description: "+${value}% chance to poison attackers when hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedBleedReflectChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBleedReflectChance");
    },
    description:
      "+${value}% chance to inflict a bleed that does 300% of the attack's damage to attackers when hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMinNatureSpellDamageBasedOnMaxHit: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMinNatureSpellDamageBasedOnMaxHit"
      );
    },
    description:
      "+${value}% of Maximum Hit added to Minimum Hit when using Nature spells",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedTotalBleedDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTotalBleedDamage");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} total damage to bleeds inflicted",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceToIncreaseStunDuration: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToIncreaseStunDuration"
      );
    },
    description:
      "+${value}% chance to increase the length of stuns inflicted by 1 turn",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedSurgeSpellAccuracy: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSurgeSpellAccuracy");
    },
    description: "+${value}% Accuracy Rating when using Surge spells",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedSurgeSpellMaxHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSurgeSpellMaxHit");
    },
    description: "+${value}% Max Hit when using Surge spells",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedRegenerationInterval: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRegenerationInterval");
    },
    modifyValue: milliToSeconds,
    description: "-${value}s Hitpoint Regeneration interval",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedOnHitSlowMagnitude: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedOnHitSlowMagnitude");
    },
    description:
      "Inflict a slow that increases the target's attack interval by ${value}% when hitting with an attack",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedNonMagicPoisonChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedNonMagicPoisonChance");
    },
    description:
      "+${value}% chance to apply poison when hitting with a Melee or Ranged attack",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  globalEvasionHPScaling: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "globalEvasionHPScaling");
    },
    description:
      "Evasion Ratings are multiplied by ${value} times current Hitpoints percent",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceToPreserveFood: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToPreserveFood");
    },
    description: "+${value}% Chance to Preserve Food when eaten",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  allowLootContainerStacking: {
    get langDescription() {
      return "No description";
    },
    description: "No description",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  infiniteLootContainer: {
    get langDescription() {
      return "No description";
    },
    description: "No description",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedBaseStardustDropQty: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBaseStardustDropQty");
    },
    description:
      "+${value} to base drop quantity of Stardust and Golden Stardust from Astrology",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPFromFiremaking: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromFiremaking");
    },
    description: "+${value}% GP from Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedGPFromFiremaking: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromFiremaking");
    },
    description: "-${value}% GP from Firemaking",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  bigRon: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "bigRon");
    },
    description: "Big Ol Ron is active",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedWoodcuttingXPAddedAsFiremakingXP: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedWoodcuttingXPAddedAsFiremakingXP"
      );
    },
    description: "+${value}% Woodcutting XP added as Firemaking XP",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  coalGainedOnCookingFailure: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "coalGainedOnCookingFailure");
    },
    description: "+${value} Coal Ore when failing to Cook Food",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  halvedWoodcuttingDoubleChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "halvedWoodcuttingDoubleChance");
    },
    description: "Chance to double Logs while Woodcutting is halved",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedFlatFarmingYield: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatFarmingYield");
    },
    description:
      "+${value} harvest quantity from Farming (Cannot be doubled or multiplied)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedWoodcuttingXPAddedAsFiremakingXP: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedWoodcuttingXPAddedAsFiremakingXP"
      );
    },
    description: "-${value}% Woodcutting XP added as Firemaking XP",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceForOneExtraOre: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceForOneExtraOre");
    },
    description:
      "+${value}% chance to receive +1 Ore in Mining (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForOneExtraOre: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceForOneExtraOre");
    },
    description:
      "-${value}% chance to receive +1 Ore in Mining (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceForQualitySuperiorGem: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceForQualitySuperiorGem"
      );
    },
    description:
      "+${value}% chance to receive a Quality Superior Gem while Mining Gem Veins or Meteorite Ore",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForQualitySuperiorGem: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceForQualitySuperiorGem"
      );
    },
    description:
      "-${value}% chance to receive a Quality Superior Gem while Mining Gem Veins or Meteorite Ore",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedMeteoriteOre: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeteoriteOre");
    },
    description: "+${value} Meteorite Ore gained when Mining Meteorite Veins",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceForAshInWoodcutting: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceForAshInWoodcutting"
      );
    },
    description: "+${value}% chance to receive an Ash drop while Woodcutting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForAshInWoodcutting: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceForAshInWoodcutting"
      );
    },
    description: "-${value}% chance to receive an Ash drop while Woodcutting",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceForAshInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceForAshInFiremaking"
      );
    },
    description: "+${value}% chance to receive Ash per burn in Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForAshInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceForAshInFiremaking"
      );
    },
    description: "-${value}% chance to receive Ash per burn in Firemaking",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceForStardustInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceForStardustInFiremaking"
      );
    },
    description:
      "+${value}% chance to receive Stardust when burning Magic Logs in Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForStardustInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceForStardustInFiremaking"
      );
    },
    description:
      "-${value}% chance to receive Stardust when burning Magic Logs in Firemaking",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceForOneExtraFish: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceForOneExtraFish");
    },
    description:
      "+${value}% chance to receive +1 Fish in Fishing (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForOneExtraFish: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceForOneExtraFish");
    },
    description:
      "-${value}% chance to receive +1 Fish in Fishing (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  doubleBoneDrops: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "doubleBoneDrops");
    },
    description: "All Bone drops from Combat are doubled",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedPrayerPointsWhenHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPrayerPointsWhenHit");
    },
    description:
      "Gain +${value} Prayer Points for each successful Enemy hit on you",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  doubleLogProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "doubleLogProduction");
    },
    description: "Quantity of logs produced by Woodcutting is doubled",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedFlatFarmingYield: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedFlatFarmingYield");
    },
    description:
      "-${value} harvest quantity from Farming (Cannot be doubled or multiplied)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedFlatMeleeAccuracyBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatMeleeAccuracyBonusPerAttackInterval"
      );
    },
    description:
      "+${value} Flat Melee Accuracy Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatMeleeAccuracyBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedFlatMeleeAccuracyBonusPerAttackInterval"
      );
    },
    description:
      "-${value} Flat Melee Accuracy Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedFlatMeleeStrengthBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatMeleeStrengthBonusPerAttackInterval"
      );
    },
    description:
      "+${value} Flat Melee Strength Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatMeleeStrengthBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedFlatMeleeStrengthBonusPerAttackInterval"
      );
    },
    description:
      "-${value} Flat Melee Strength Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedFlatRangedAccuracyBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatRangedAccuracyBonusPerAttackInterval"
      );
    },
    description:
      "+${value} Flat Ranged Accuracy Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatRangedAccuracyBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedFlatRangedAccuracyBonusPerAttackInterval"
      );
    },
    description:
      "-${value} Flat Ranged Accuracy Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedFlatRangedStrengthBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatRangedStrengthBonusPerAttackInterval"
      );
    },
    description:
      "+${value} Flat Ranged Strength Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatRangedStrengthBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedFlatRangedStrengthBonusPerAttackInterval"
      );
    },
    description:
      "-${value} Flat Ranged Strength Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedFlatMagicAccuracyBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFlatMagicAccuracyBonusPerAttackInterval"
      );
    },
    description:
      "+${value} Flat Magic Accuracy Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedFlatMagicAccuracyBonusPerAttackInterval: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedFlatMagicAccuracyBonusPerAttackInterval"
      );
    },
    description:
      "-${value} Flat Magic Accuracy Bonus per 0.1s Attack Interval. This is doubled if a 2-Handed Weapon is currently equipped",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageReductionAgainstMelee: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageReductionAgainstMelee"
      );
    },
    description: "+${value}% Damage Reduction when fighting a Melee Enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDamageReductionAgainstMelee: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageReductionAgainstMelee"
      );
    },
    description: "-${value}% Damage Reduction when fighting a Melee Enemy",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageReductionAgainstRanged: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageReductionAgainstRanged"
      );
    },
    description: "+${value}% Damage Reduction when fighting a Ranged Enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDamageReductionAgainstRanged: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageReductionAgainstRanged"
      );
    },
    description: "-${value}% Damage Reduction when fighting a Ranged Enemy",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageReductionAgainstMagic: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageReductionAgainstMagic"
      );
    },
    description: "+${value}% Damage Reduction when fighting a Magic Enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDamageReductionAgainstMagic: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageReductionAgainstMagic"
      );
    },
    description: "-${value}% Damage Reduction when fighting a Magic Enemy",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageReductionWithMagic2HWeapon: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageReductionWithMagic2HWeapon"
      );
    },
    description:
      "+${value}% Damage Reduction when using a Magic 2-Handed Weapon",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDamageReductionWithMagic2HWeapon: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageReductionWithMagic2HWeapon"
      );
    },
    description:
      "-${value}% Damage Reduction when using a Magic 2-Handed Weapon",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMaxHitPercentBasedOnEnemyDamageReduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMaxHitPercentBasedOnEnemyDamageReduction"
      );
    },
    description:
      "+${value}% Max Hit for each 1% of Damage Reduction the Enemy has",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMaxHitPercentBasedOnEnemyDamageReduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedMaxHitPercentBasedOnEnemyDamageReduction"
      );
    },
    description:
      "-${value}% Max Hit for each 1% of Damage Reduction the Enemy has",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMeleeMaxHitBonusAgainstRanged: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMeleeMaxHitBonusAgainstRanged"
      );
    },
    description:
      "+${value}% Melee Max Hit. This value is tripled if fighting a Ranged Enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMeleeMaxHitBonusAgainstRanged: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedMeleeMaxHitBonusAgainstRanged"
      );
    },
    description:
      "-${value}% Melee Max Hit. This value is tripled if fighting a Ranged Enemy",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedRangedMaxHitBonusAgainstMagic: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedRangedMaxHitBonusAgainstMagic"
      );
    },
    description:
      "+${value}% Ranged Max Hit. This value is tripled if fighting a Magic Enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedRangedMaxHitBonusAgainstMagic: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedRangedMaxHitBonusAgainstMagic"
      );
    },
    description:
      "-${value}% Ranged Max Hit. This value is tripled if fighting a Magic Enemy",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMagicMaxHitBonusAgainstMelee: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMagicMaxHitBonusAgainstMelee"
      );
    },
    description:
      "+${value}% Magic Max Hit. This value is tripled if fighting a Melee Enemy",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMagicMaxHitBonusAgainstMelee: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedMagicMaxHitBonusAgainstMelee"
      );
    },
    description:
      "-${value}% Magic Max Hit. This value is tripled if fighting a Melee Enemy",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  gainSlayerCoinsBasedOnEnemyCombatLevelMelee: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "gainSlayerCoinsBasedOnEnemyCombatLevelMelee"
      );
    },
    description:
      "Killing a Melee Slayer Task Enemy grants Slayer Coins equal to Enemy Combat Level",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  gainSlayerCoinsBasedOnEnemyCombatLevelRanged: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "gainSlayerCoinsBasedOnEnemyCombatLevelRanged"
      );
    },
    description:
      "Killing a Ranged Slayer Task Enemy grants Slayer Coins equal to Enemy Combat Level",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  gainSlayerCoinsBasedOnEnemyCombatLevelMagic: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "gainSlayerCoinsBasedOnEnemyCombatLevelMagic"
      );
    },
    description:
      "Killing a Magic Slayer Task Enemy grants Slayer Coins equal to Enemy Combat Level",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedDamageReductionAgainstBosses: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageReductionAgainstBosses"
      );
    },
    description: "+${value}% Damage Reduction when fighting a Dungeon Boss",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDamageReductionAgainstBosses: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageReductionAgainstBosses"
      );
    },
    description: "-${value}% Damage Reduction when fighting a Dungeon Boss",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceDoubleSlayerTaskKill: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceDoubleSlayerTaskKill"
      );
    },
    description:
      "+${value}% chance for a Slayer Task kill to count as 2 kills (Rewards Slayer Coins for 2nd kill, but not Slayer XP)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedChanceDoubleSlayerTaskKill: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceDoubleSlayerTaskKill"
      );
    },
    description: "-${value}% chance for a Slayer Task kill to count as 2 kills",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageTakenAddedAsPrayerPoints: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDamageTakenAddedAsPrayerPoints"
      );
    },
    modifyValue: divideByNumberMultiplier,
    description:
      "+${value}% of all damage taken is added as Prayer Points (Rounded down)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedDamageTakenAddedAsPrayerPoints: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedDamageTakenAddedAsPrayerPoints"
      );
    },
    modifyValue: divideByNumberMultiplier,
    description:
      "-${value}% of all damage taken is added as Prayer Points (Rounded down)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  globalAccuracyHPScaling: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "globalAccuracyHPScaling");
    },
    description:
      "Accuracy Ratings are multiplied by ${value} times current Hitpoints percent",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPFromNegativeObstacles: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromNegativeObstacles");
    },
    description:
      "+${value}% GP from Agility Obstacles that contain a negative modifier",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedGPFromNegativeObstacles: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPFromNegativeObstacles");
    },
    description:
      "-${value}% GP from Agility Obstacles that contain a negative modifier",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedXPFromNegativeObstacles: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedXPFromNegativeObstacles");
    },
    description:
      "+${value}% Agility Skill XP from Obstacles that contain a negative modifier",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedXPFromNegativeObstacles: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedXPFromNegativeObstacles");
    },
    description:
      "-${value}% Agility Skill XP from Obstacles that contain a negative modifier",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedMasteryXPFromNegativeObstacles: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMasteryXPFromNegativeObstacles"
      );
    },
    description:
      "+${value}% Agility Mastery XP from Obstacles that contain a negative modifier",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedMasteryXPFromNegativeObstacles: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedMasteryXPFromNegativeObstacles"
      );
    },
    description:
      "-${value}% Agility Mastery XP from Obstacles that contain a negative modifier",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceGoldenStardust: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceGoldenStardust");
    },
    description: "+${value}% chance to locate Golden Stardust in Astrology",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceGoldenStardust: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceGoldenStardust");
    },
    description: "-${value}% chance to locate Golden Stardust in Astrology",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedEnemyDamageReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedEnemyDamageReduction");
    },
    description: "Enemy Damage Reduction is decreased by flat ${value}%",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedEnemyDamageReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEnemyDamageReduction");
    },
    description: "Enemy Damage Reduction is increased by flat ${value}%",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceStardust: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceStardust");
    },
    description: "+${value}% chance to locate Stardust in Astrology",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceStardust: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceStardust");
    },
    description: "-${value}% chance to locate Stardust in Astrology",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedThievingStunIntervalPercent: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedThievingStunIntervalPercent"
      );
    },
    description: "-${value}% Thieving Stun Interval",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedThievingStunIntervalPercent: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedThievingStunIntervalPercent"
      );
    },
    description: "+${value}% Thieving Stun Interval",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedGlobalSkillIntervalPercent: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedGlobalSkillIntervalPercent"
      );
    },
    description: "-${value}% Interval for all Non-Combat Skills",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedGlobalSkillIntervalPercent: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedGlobalSkillIntervalPercent"
      );
    },
    description: "+${value}% Interval for all Non-Combat Skills",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedGlobalStunChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGlobalStunChance");
    },
    description:
      "+${value}% chance to apply a Stun for 1 Attack Turn when hitting with any attack (once per turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedGlobalStunChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGlobalStunChance");
    },
    description:
      "-${value}% chance to apply a Stun for 1 Attack Turn when hitting with any attack (once per turn)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedGlobalSleepChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGlobalSleepChance");
    },
    description:
      "+${value}% chance to apply Sleep when hitting with any attack (once per turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedGlobalSleepChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGlobalSleepChance");
    },
    description:
      "-${value}% chance to apply Sleep when hitting with any attack (once per turn)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increased15SlowStunChance2Turns: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increased15SlowStunChance2Turns");
    },
    description:
      "+${value}% chance to apply a 15% Slow for 2 Attack Turns when hitting with any attack (once per turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreased15SlowStunChance2Turns: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreased15SlowStunChance2Turns");
    },
    description:
      "-${value}% chance to apply a 15% Slow for 2 Attack Turns when hitting with any attack (once per turn)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceForArrowShaftsWoodcutting: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceForArrowShaftsWoodcutting"
      );
    },
    description:
      "+${value}% chance to gain Arrow Shafts when cutting Trees (Cannot be Doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForArrowShaftsWoodcutting: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceForArrowShaftsWoodcutting"
      );
    },
    description:
      "-${value}% chance to gain Arrow Shafts when cutting Trees (Cannot be Doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedNonShardCostForEquippedTablets: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedNonShardCostForEquippedTablets"
      );
    },
    description:
      "-${value}% Item cost reduction for equipped Summoning Tablets (Excludes Shard Cost)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedNonShardCostForEquippedTablets: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedNonShardCostForEquippedTablets"
      );
    },
    description:
      "+${value}% Item cost reduction for equipped Summoning Tablets (Excludes Shard Cost)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedPassiveCookInterval: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedPassiveCookInterval");
    },
    description: "-${value}% Passive Cook Interval",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedPassiveCookInterval: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPassiveCookInterval");
    },
    description: "+${value}% Passive Cook Interval",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedSkillPreservationCap: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillPreservationCap");
    },
    description: "+${value}% Resource Preservation cap in ${skillName}",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  decreasedSkillPreservationCap: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSkillPreservationCap");
    },
    description: "-${value}% Resource Preservation cap in ${skillName}",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSalamanderCreationCharges: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSalamanderCreationCharges"
      );
    },
    description: "+${value}% Salamander Tablets made in Summoning",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedSalamanderCreationCharges: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedSalamanderCreationCharges"
      );
    },
    description: "-${value}% Salamander Tablet made in Summoning",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedJavelinResourceCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedJavelinResourceCost");
    },
    description: "-${value}% Resource Cost for Javelins in Fletching",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedJavelinResourceCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedJavelinResourceCost");
    },
    description: "+${value}% Resource Cost for Javelins in Fletching",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedJavelinProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedJavelinProduction");
    },
    description: "+${value} base Javelins produced per action in Fletching",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedJavelinProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedJavelinProduction");
    },
    description: "-${value} base Javelins produced per action in Fletching",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceExtraJavelins: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceExtraJavelins");
    },
    description:
      "+${value}% chance for +3 Javelins produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceExtraJavelins: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceExtraJavelins");
    },
    description:
      "-${value}% chance for +3 Javelins produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceExtraMeteoriteOre: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceExtraMeteoriteOre");
    },
    description:
      "+${value}% chance for +1 Meteorite Ore in Mining (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceExtraMeteoriteOre: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceExtraMeteoriteOre");
    },
    description:
      "-${value}% chance for +1 Meteorite Ore in Mining (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceExtraArrows: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceExtraArrows");
    },
    description:
      "+${value}% chance for +5 Arrows produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceExtraArrows: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceExtraArrows");
    },
    description:
      "-${value}% chance for +5 Arrows produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceExtraUnstrungBows: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceExtraUnstrungBows");
    },
    description:
      "+${value}% chance for +2 Unstrung Bows produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceExtraUnstrungBows: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceExtraUnstrungBows");
    },
    description:
      "-${value}% chance for +2 Unstrung Bows produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceItemToGoldFletching: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceItemToGoldFletching"
      );
    },
    description:
      "+${value}% chance for Items produced in Fletching to be converted to GP equal to 150% Base Sale price",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceItemToGoldFletching: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceItemToGoldFletching"
      );
    },
    description:
      "-${value}% chance for Items produced in Fletching to be converted to GP equal to 150% Base Sale price",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedLeprechaunCreationCharges: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedLeprechaunCreationCharges"
      );
    },
    description:
      "+${value} Base Quantity for Leprechaun Tablet Creation in Summoning",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedLeprechaunCreationCharges: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedLeprechaunCreationCharges"
      );
    },
    description:
      "-${value} Base Quantity for Leprechaun Tablet Creation in Summoning",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedGPFromAgilityPerActiveObstacle: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedGPFromAgilityPerActiveObstacle"
      );
    },
    description: "+${value}% GP from Agility per active Obstacle",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedGPFromAgilityPerActiveObstacle: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedGPFromAgilityPerActiveObstacle"
      );
    },
    description: "-${value}% GP from Agility per active Obstacle",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceExtraCrossbows: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceExtraCrossbows");
    },
    description:
      "+${value}% chance for +1 Crossbow produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceExtraCrossbows: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceExtraCrossbows");
    },
    description:
      "-${value}% chance for +1 Crossbow produced per action in Fletching (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  disableGoldenStardustDrops: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "disableGoldenStardustDrops");
    },
    description: "No longer receive Golden Stardust from Astrology",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedBoltProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBoltProduction");
    },
    description: "+${value} Bolts produced per action in Fletching",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedBoltProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBoltProduction");
    },
    description: "-${value} Bolts produced per action in Fletching",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedFletchingIntervalWithArrows: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedFletchingIntervalWithArrows"
      );
    },
    modifyValue: milliToSeconds,
    description: "-${value}s Fletching Interval when making Arrows",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedFletchingIntervalWithArrows: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedFletchingIntervalWithArrows"
      );
    },
    modifyValue: milliToSeconds,
    description: "+${value}s Fletching Interval when making Arrows",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedGPPerDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPPerDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% of damage dealt gained as GP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedGPPerDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPPerDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description: "-${value}% of damage dealt gained as GP",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedGPBasedOnEnemyCombatLevel: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedGPBasedOnEnemyCombatLevel"
      );
    },
    description:
      "+${value}% GP gained per Attack Turn equal to the Enemy Combat Level",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedGPBasedOnSummonDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPBasedOnSummonDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description:
      "+${value}% of damage dealt by Summoning Familiars gained as GP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedGPBasedOnSummonDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGPBasedOnSummonDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description:
      "-${value}% of damage dealt by Summoning Familiars gained as GP",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedSlayerCoinsPerDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSlayerCoinsPerDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description: "+${value}% Damage Dealt gained as Slayer Coins",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedSlayerCoinsPerDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedSlayerCoinsPerDamage");
    },
    modifyValue: divideByNumberMultiplier,
    description: "-${value}% Damage Dealt gained as Slayer Coins",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceToIncreaseSleepDuration: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToIncreaseSleepDuration"
      );
    },
    description:
      "+${value}% chance for Sleep applied to the Enemy to last an extra 1 Attack Turn",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedChanceToIncreaseSleepDuration: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceToIncreaseSleepDuration"
      );
    },
    description:
      "-${value}% chance for Sleep applied to the Enemy to last an extra 1 Attack Turn",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedCyclopsCreationCharges: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedCyclopsCreationCharges");
    },
    description:
      "+${value} Base Quantity for Cyclops Tablet Creation in Summoning",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedCyclopsCreationCharges: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedCyclopsCreationCharges");
    },
    description:
      "-${value} Base Quantity for Cyclops Tablet Creation in Summoning",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceToAvoidStun: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToAvoidStun");
    },
    description: "+${value}% chance to avoid being Stunned",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedChanceToAvoidStun: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceToAvoidStun");
    },
    description: "-${value}% chance to avoid being Stunned",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceToAvoidSleep: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToAvoidSleep");
    },
    description: "+${value}% chance to avoid Sleep",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedChanceToAvoidSleep: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedChanceToAvoidSleep");
    },
    description: "-${value}% chance to avoid Sleep",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedHealWhenStunned: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedHealWhenStunned");
    },
    description:
      "When a stun is applied to you, heal for +${value}% of your Max HP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedHealWhenStunned: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedHealWhenStunned");
    },
    description:
      "When a stun is applied to you, heal for -${value}% of your Max HP",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedHealWhenSleep: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedHealWhenSleep");
    },
    description:
      "When Sleep is applied to you, heal for +${value}% of your Max HP",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedHealWhenSleep: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedHealWhenSleep");
    },
    description:
      "When Sleep is applied to you, heal for -${value}% of your Max HP",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceToApplyDeadlyPoisonWhenPoisoned: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToApplyDeadlyPoisonWhenPoisoned"
      );
    },
    description:
      "If target is poisoned, +${value}% chance to apply deadly poison when hitting with an attack",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedChanceToApplyDeadlyPoisonWhenPoisoned: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceToApplyDeadlyPoisonWhenPoisoned"
      );
    },
    description:
      "If target is poisoned, -${value}% chance to apply deadly poison when hitting with an attack",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedDamageTakenPerAttack: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageTakenPerAttack");
    },
    description: "+${value}% of Current HP taken as damage per Attack",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedDamageTakenPerAttack: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageTakenPerAttack");
    },
    description: "-${value}% of Current HP taken as damage per Attack",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageTakenWhenAsleep: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageTakenWhenAsleep");
    },
    description: "+${value}% damage taken when asleep",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedDamageTakenWhenAsleep: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageTakenWhenAsleep");
    },
    description: "-${value}% damage taken when asleep",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageTakenWhenStunned: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageTakenWhenStunned");
    },
    description: "+${value}% damage taken when stunned",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedDamageTakenWhenStunned: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageTakenWhenStunned");
    },
    description: "-${value}% damage taken when stunned",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedPlayerDamageReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedPlayerDamageReduction");
    },
    description: "Reduce Player damage reduction by ${value}%",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedDamageDealtIfPoisoned: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDamageDealtIfPoisoned");
    },
    description: "+${value}% damage dealt if target is poisoned",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedDamageDealtIfPoisoned: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDamageDealtIfPoisoned");
    },
    description: "-${value}% damage dealt if target is poisoned",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMeleeMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMeleeMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Flat Melee Maximum Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  decreasedMeleeMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMeleeMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Flat Melee Maximum Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  increasedRangedMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRangedMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Flat Ranged Maximum Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  decreasedRangedMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedRangedMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Flat Ranged Maximum Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  increasedMagicMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMagicMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "+${value} Flat Magic Maximum Hit",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "strength"],
  },
  decreasedMagicMaxHitFlat: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedMagicMaxHitFlat");
    },
    modifyValue: multiplyByNumberMultiplier,
    description: "-${value} Flat Magic Maximum Hit",
    isSkill: false,
    isNegative: true,
    tags: ["combat", "strength"],
  },
  increasedGPFromItemAlchemy: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGPFromItemAlchemy");
    },
    modifyValue: (value) => value * 100,
    description: "+${value}% Item Alchemy Item sale price conversion",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceToApplyShock: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToApplyShock");
    },
    description:
      "+${value}% chance to reduce Target Damage Reduction by 1% per successful hit. Stacks up to 20 times",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedAbsorbingSkin: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAbsorbingSkin");
    },
    description:
      "Target gains +3% Damage Reduction for every successful hit by the Attacker (Stacks up to 10 times)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedDuality: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDuality");
    },
    description:
      "For each Target Attack Turn: 50% chance for the Target to apply -50% Attack Interval to itself for 2 turns",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceToApplyDecayCurse: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToApplyDecayCurse");
    },
    description: "+${value}% to apply Decay Curse to the Target per hit",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedRage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedRage");
    },
    description:
      "When Target is hit, Attacker gains a stack of Rage: +2% Max Hit and -2% Attack Interval (Stacks up to 10 times)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedCurseLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedCurseLifesteal");
    },
    description: "+${value}% Lifesteal if target is Cursed",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  applyRandomCurseOnSpawn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "applyRandomCurseOnSpawn");
    },
    description: "Apply a random Curse to the Target on spawn or revive",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceDarkBlade: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceDarkBlade");
    },
    description:
      "+${value}% chance to apply Dark Blade Effect (+1% Max Hit) to the Attacker per successful hit (Stacks up to 30 times)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceForCharcoalInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceForCharcoalInFiremaking"
      );
    },
    description: "+${value}% chance to receive Charcoal per burn in Firemaking",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedChanceForCharcoalInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedChanceForCharcoalInFiremaking"
      );
    },
    description: "-${value}% chance to receive Charcoal per burn in Firemaking",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedThievingAreaUniqueChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedThievingAreaUniqueChance"
      );
    },
    description: "+${value}% chance to receive Thieving Area Unique Item",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedThievingAreaUniqueChance: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedThievingAreaUniqueChance"
      );
    },
    description: "-${value}% chance to receive Thieving Area Unique Item",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceToFindMeteorite: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToFindMeteorite");
    },
    description: "+${value}% chance to locate a Meteorite in Astrology",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceToFindMushroomWoodcutting: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToFindMushroomWoodcutting"
      );
    },
    description:
      "+${value} chance to find a Mushroom in Woodcutting (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceToAvoidThievingStuns: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToAvoidThievingStuns"
      );
    },
    description:
      "+${value} chance to avoid the stun interval and stun damage in Thieving when pickpocket attempt fails",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedChanceAdditionalPerfectItem: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceAdditionalPerfectItem"
      );
    },
    description:
      "+${value} chance to receive an additional Perfect Item from Cooking (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedMaxHitPercentBasedOnDamageReduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMaxHitPercentBasedOnDamageReduction"
      );
    },
    description: "+${value}% Max Hit for each 1% of Damage Reduction",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedMaxHitPercentBasedOnDamageReduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedMaxHitPercentBasedOnDamageReduction"
      );
    },
    description: "-${value}% Max Hit for each 1% of Damage Reduction",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  halveDamageReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "halveDamageReduction");
    },
    description: "Damage Reduction is halved (Floored)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedLifestealBasedOnHPRegenEffectiveness: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedLifestealBasedOnHPRegenEffectiveness"
      );
    },
    description:
      "Increased Lifesteal based on +${value}% * Current HP Regen Effectiveness (Eg. 5% * 300 = +15% Lifesteal)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  disableHPRegeneration: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "disableHPRegeneration");
    },
    description: "Passive Hitpoint Regeneration is disabled",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMinMeteorShowerSpellDamage: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedMinMeteorShowerSpellDamage"
      );
    },
    modifyValue: multiplyByNumberMultiplier,
    description:
      "+${value} minimum Spell damage when using the Meteor Shower Archaic Spell",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEndOfTurnEvasion2: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEndOfTurnEvasion2");
    },
    description:
      "Gains up to +${value}% Global Evasion Rating every 2 turns (Lasts 2 turns)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreaseEnemyEvasionOnStun: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreaseEnemyEvasionOnStun");
    },
    description:
      "When a Stun is applied to the Target, -10% Global Evasion Rating for the remainder of the fight (Stacks up to 3 times)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreaseEnemyEvasionOnSleep: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreaseEnemyEvasionOnSleep");
    },
    description:
      "When a Sleep is applied to the Target, -10% Global Evasion Rating for the remainder of the fight (Stacks up to 3 times)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  decreasedEvasionBasedOnDR: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedEvasionBasedOnDR");
    },
    description:
      "-${value}% Global Evasion Rating for every 2% base Damage Reduction",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  healOnHitBasedOnTargetDR: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "healOnHitBasedOnTargetDR");
    },
    modifyValue: multiplyByNumberMultiplier,
    description:
      "Heal for +${value}% of the Target's base Damage Reduction on a successful attack (once per turn)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  doubleLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "doubleLifesteal");
    },
    description: "Doubles the Attacker Lifesteal percent",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMaxHPBurnDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMaxHPBurnDamage");
    },
    description: "Burns to the Target deal +${value}% Max HP as extra damage",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceToApplyDeadlyPoison: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToApplyDeadlyPoison"
      );
    },
    description: "+${value}% chance to apply Deadly Poison to the Target",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  disableLifesteal: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "disableLifesteal");
    },
    description: "Disables all sources of Lifesteal",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedSlayerCoinsBasedOnTargetDR: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSlayerCoinsBasedOnTargetDR"
      );
    },
    description:
      "Gain Slayer Coins equal to ${value}% of the Target Damage Reduction",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedSlayerCoinsPerPoisonDamage: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSlayerCoinsPerPoisonDamage"
      );
    },
    modifyValue: divideByNumberMultiplier,
    description:
      "Gain Slayer Coins euqal to +${value}% of Poison damage dealt to Target",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedChanceStardustCuttingMagicLogs: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceStardustCuttingMagicLogs"
      );
    },
    description:
      "+${value}% chance to receive Stardust when cutting Magic Logs in Woodcutting (Quantity equal to Logs received)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedTownshipPopulationCap: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipPopulationCap");
    },
    description: "+${value} Township Population Cap",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipPopulationCap: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipPopulationCap");
    },
    description: "-${value} Township Population Cap",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipHappiness: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipHappiness");
    },
    description: "+${value}% Township Happiness",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipHappiness: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipHappiness");
    },
    description: "-${value}% Township Happiness",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipEducation: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipEducation");
    },
    description: "+${value}% Township Education",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipEducation: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipEducation");
    },
    description: "-${value}% Township Education",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipHealth: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipHealth");
    },
    description: "+${value}% Township Health",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipHealth: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipHealth");
    },
    description: "-${value}% Township Health",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipGPProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipGPProduction");
    },
    description: "+${value}% Township GP Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipGPProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipGPProduction");
    },
    description: "-${value}% Township GP Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipMaxStorage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipMaxStorage");
    },
    description: "+${value}% Township Max Storage",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipMaxStorage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipMaxStorage");
    },
    description: "-${value}% Township Max Storage",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipFoodProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipFoodProduction");
    },
    description: "+${value}% Township Food Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipFoodProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipFoodProduction");
    },
    description: "-${value}% Township Food Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipWoodProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipWoodProduction");
    },
    description: "+${value}% Township Wood Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipWoodProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipWoodProduction");
    },
    description: "-${value}% Township Wood Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipOreProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipOreProduction");
    },
    description: "+${value}% Township Ore Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipOreProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipOreProduction");
    },
    description: "-${value}% Township Ore Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipStoneProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipStoneProduction");
    },
    description: "+${value}% Township Stone Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipStoneProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipStoneProduction");
    },
    description: "-${value}% Township Stone Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipCoalProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipCoalProduction");
    },
    description: "+${value}% Township Coal Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipCoalProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipCoalProduction");
    },
    description: "-${value}% Township Coal Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipBarProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipBarProduction");
    },
    description: "+${value}% Township Bar Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipBarProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipBarProduction");
    },
    description: "-${value}% Township Bar Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipHerbProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipHerbProduction");
    },
    description: "+${value}% Township Herb Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipHerbProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipHerbProduction");
    },
    description: "-${value}% Township Herb Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipRuneEssenceProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipRuneEssenceProduction"
      );
    },
    description: "+${value}% Township Rune Essence Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipRuneEssenceProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipRuneEssenceProduction"
      );
    },
    description: "-${value}% Township Rune Essence Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipLeatherProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipLeatherProduction"
      );
    },
    description: "+${value}% Township Leather Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipLeatherProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipLeatherProduction"
      );
    },
    description: "-${value}% Township Leather Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipPotionProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipPotionProduction"
      );
    },
    description: "+${value}% Township Potion Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipPotionProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipPotionProduction"
      );
    },
    description: "-${value}% Township Potion Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipPlankProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipPlankProduction");
    },
    description: "+${value}% Township Plank Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipPlankProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipPlankProduction");
    },
    description: "-${value}% Township Plank Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipClothingProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipClothingProduction"
      );
    },
    description: "+${value}% Township Clothing Production",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipClothingProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipClothingProduction"
      );
    },
    description: "-${value}% Township Clothing Production",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipBuildingCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipBuildingCost");
    },
    description: "+${value}% Township Building Cost",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  decreasedTownshipBuildingCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipBuildingCost");
    },
    description: "-${value}% Township Building Cost (Capped at -80%)",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  increasedTownshipGrasslandsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipGrasslandsProduction"
      );
    },
    description: "+${value}% Township Building Production in Grasslands Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipGrasslandsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipGrasslandsProduction"
      );
    },
    description: "-${value}% Township Building Production in Grasslands Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipForestProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipForestProduction"
      );
    },
    description: "+${value}% Township Building Production in Forest Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipForestProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipForestProduction"
      );
    },
    description: "-${value}% Township Building Production in Forest Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipDesertProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipDesertProduction"
      );
    },
    description: "+${value}% Township Building Production in Desert Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipDesertProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipDesertProduction"
      );
    },
    description: "-${value}% Township Building Production in Desert Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipWaterProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipWaterProduction");
    },
    description: "+${value}% Township Building Production in Water Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipWaterProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipWaterProduction");
    },
    description: "-${value}% Township Building Production in Water Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipSwampProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipSwampProduction");
    },
    description: "+${value}% Township Building Production in Swamp Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipSwampProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipSwampProduction");
    },
    description: "-${value}% Township Building Production in Swamp Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipAridPlainsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipAridPlainsProduction"
      );
    },
    description: "+${value}% Township Building Production in Arid Plains Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipAridPlainsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipAridPlainsProduction"
      );
    },
    description: "-${value}% Township Building Production in Arid Plains Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipMountainsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipMountainsProduction"
      );
    },
    description: "+${value}% Township Building Production in Mountains Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipMountainsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipMountainsProduction"
      );
    },
    description: "-${value}% Township Building Production in Mountains Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipValleyProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipValleyProduction"
      );
    },
    description: "+${value}% Township Building Production in Valley Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipValleyProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipValleyProduction"
      );
    },
    description: "-${value}% Township Building Production in Valley Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipJungleProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipJungleProduction"
      );
    },
    description: "+${value}% Township Building Production in Jungle Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipJungleProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipJungleProduction"
      );
    },
    description: "-${value}% Township Building Production in Jungle Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipSnowlandsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipSnowlandsProduction"
      );
    },
    description: "+${value}% Township Building Production in Snowlands Biome",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipSnowlandsProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipSnowlandsProduction"
      );
    },
    description: "-${value}% Township Building Production in Snowlands Biome",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipFishingDockProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipFishingDockProduction"
      );
    },
    description: "+${value}% Township Production for Fishing Dock buildings",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipFishingDockProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipFishingDockProduction"
      );
    },
    description: "-${value}% Township Production for Fishing Dock buildings",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipMagicEmporiumProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipMagicEmporiumProduction"
      );
    },
    description: "+${value}% Township Production for Magic Emporium buildings",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipMagicEmporiumProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipMagicEmporiumProduction"
      );
    },
    description: "-${value}% Township Production for Magic Emporium buildings",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipOrchardProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipOrchardProduction"
      );
    },
    description: "+${value}% Township Production for Orchard buildings",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipOrchardProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipOrchardProduction"
      );
    },
    description: "-${value}% Township Production for Orchard buildings",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipFarmProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipFarmProduction");
    },
    description: "+${value}% Township Production for Farm buildings",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipFarmProduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipFarmProduction");
    },
    description: "-${value}% Township Production for Farm buildings",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipWoodcuttingProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipWoodcuttingProduction"
      );
    },
    description: "+${value}% Township Production for Woodcutting buildings",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipWoodcuttingProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipWoodcuttingProduction"
      );
    },
    description: "-${value}% Township Production for Woodcutting buildings",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipBlacksmithProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipBlacksmithProduction"
      );
    },
    description: "+${value}% Township Production for Blacksmith buildings",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipBlacksmithProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipBlacksmithProduction"
      );
    },
    description: "-${value}% Township Production for Blacksmith buildings",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipTaxPerCitizen: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipTaxPerCitizen");
    },
    description: "+${value}% Township Citizen Tax Rate (Max 80%)",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipTaxPerCitizen: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipTaxPerCitizen");
    },
    description: "-${value}% Township Citizen Tax Rate",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  townshipDisableHunting: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "townshipDisableHunting");
    },
    description: "Hunting is forbidden in Township",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipResourceProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipResourceProduction"
      );
    },
    description: "+${value}% Township Resource Generation",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipResourceProduction: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipResourceProduction"
      );
    },
    description: "-${value}% Township Resource Generation",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  increasedTownshipCoalUsage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipCoalUsage");
    },
    description: "+${value}% Township Coal Usage",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  decreasedTownshipCoalUsage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipCoalUsage");
    },
    description: "-${value}% Township Coal Usage",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  increasedTownshipBuildingHappinessPenalties: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedTownshipBuildingHappinessPenalties"
      );
    },
    description: "+${value}% Township Building Happiness Penalties",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  decreasedTownshipBuildingHappinessPenalties: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedTownshipBuildingHappinessPenalties"
      );
    },
    description: "-${value}% Township Building Happiness Penalties",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  increasedAdditionalAshInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedAdditionalAshInFiremaking"
      );
    },
    description: "+${value} Ash per burn in Firemaking (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedAdditionalAshInFiremaking: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedAdditionalAshInFiremaking"
      );
    },
    description: "-${value} Ash per burn in Firemaking (Cannot be doubled)",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedSkillMasteryXPPerDeedree: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSkillMasteryXPPerDeedree"
      );
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Deedree constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerAmeria: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillMasteryXPPerAmeria");
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Ameria constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerVale: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillMasteryXPPerVale");
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Vale constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerQimican: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSkillMasteryXPPerQimican"
      );
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Qimican constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerKo: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillMasteryXPPerKo");
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Ko constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerArachi: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillMasteryXPPerArachi");
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Arachi constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerIridan: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillMasteryXPPerIridan");
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Iridan constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerHyden: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillMasteryXPPerHyden");
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Hyden constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedSkillMasteryXPPerSyllia: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedSkillMasteryXPPerSyllia");
    },
    description:
      "+${value}% ${skillName} Mastery XP per maxed Star in Syllia constellation in Astrology",
    isSkill: true,
    isNegative: false,
    tags: [],
  },
  increasedTownshipFoodUsage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipFoodUsage");
    },
    description: "+${value}% Township Citizen Food Usage",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  decreasedTownshipFoodUsage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipFoodUsage");
    },
    description: "-${value}% Township Citizen Food Usage (Capped at -80%)",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  increasedChanceToAvoidCurses: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToAvoidCurses");
    },
    description: "+${value}% chance to avoid Curses",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  applyMadnessCurseOnSpawn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "applyMadnessCurseOnSpawn");
    },
    description: "Apply Madness Curse to the Target on spawn or revive",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  applyTormentCurseOnSpawn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "applyTormentCurseOnSpawn");
    },
    description: "Apply Torment Curse to the Target on spawn or revive",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  applyDespairCurseOnSpawn: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "applyDespairCurseOnSpawn");
    },
    description: "Apply Despair Curse to the Target on spawn or revive",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  freezeImmunity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "freezeImmunity");
    },
    description: "+${value}% chance to ignore Freezes only",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedMinPoisonArchaicDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinPoisonArchaicDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description:
      "+${value} Minimum Damage for Archaic Spells that use Poison Runes",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMinInfernalArchaicDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinInfernalArchaicDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description:
      "+${value} Minimum Damage for Archaic Spells that use Infernal Runes",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMinLightningArchaicDmg: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinLightningArchaicDmg");
    },
    modifyValue: multiplyByNumberMultiplier,
    description:
      "+${value} Minimum Damage for Archaic Spells that use Lightning Runes",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedChanceToFindLostChest: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedChanceToFindLostChest");
    },
    description:
      "+${value}% chance to find a Lost Chest while Fishing (This is separate to the Special Fishing Chance)",
    isSkill: false,
    isNegative: false,
    tags: ["fishing"],
  },
  reducedTargetDamageRedcutionIfBleeding: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "reducedTargetDamageRedcutionIfBleeding"
      );
    },
    description:
      "While Target is Bleeding, reduce their Damage Reduction by -${value}%",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedAssassin: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAssassin");
    },
    description:
      "When Target is hit, Attacker gains a stack of Assassin: +30% Global Accuracy (Stacks up to 5 times and resets after 5 Attack Turns)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  summoningSynergy_Devil_Eagle: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "summoningSynergy_Devil_Eagle");
    },
    description:
      "While Thieving - 50% chance for +10% base Skill XP, 40% chance for 2.5x GP, and 10% chance to gain no Items or GP",
    isSkill: false,
    isNegative: false,
    tags: ["thieving"],
  },
  increasedChanceToPreserveConsumable: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToPreserveConsumable"
      );
    },
    description: "+${value}% chance to preserve Consumable Slot charges",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedTownshipDeadStorage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipDeadStorage");
    },
    description: "+${value}% Township Dead Storage",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
  decreasedTownshipDeadStorage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedTownshipDeadStorage");
    },
    description: "-${value}% Township Dead Storage",
    isSkill: false,
    isNegative: true,
    tags: ["township"],
  },
  growingMadnessPassive: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "growingMadnessPassive");
    },
    description:
      "For every Enemy Attack Turn, the Enemy gains -2% Attack Interval, +2% Maximum Hit (Stacks 25 times)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  momentInTimePassive: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "momentInTimePassive");
    },
    description:
      "For every Enemy Attack Turn, the Enemy gains -2% Attack Interval, +2% Maximum Hit, +2% Global Accuracy (Stacks 25 times)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  reignOverTimePassive: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "reignOverTimePassive");
    },
    description:
      "For every Enemy Attack Turn, Enemy gains -2% Attack Interval, +2% Maximum Hit, +2% Global Accuracy, +2% Global Evasion Rating (Stacks 25 times)",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedChanceToApplySleepToTargetWhenHit: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceToApplySleepToTargetWhenHit"
      );
    },
    description:
      "When hit, +${value}% chance to apply Sleep to the Target for 1 turn",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedPlayerRage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPlayerRage");
    },
    description:
      "When hit, +{value}% chance to gain a stack of Rage: +2% Max Hit and -2% Attack Interval (Stacks up to 10 times)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedLeviathan: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedLeviathan");
    },
    description:
      "When hit, gain a stack of Leviathan: +5% Reflect Damage and +1% Damage Reduction (Stacks up to 5 times)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  shadowCloak: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "shadowCloak");
    },
    description: "",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedDeadlyToxinsFromHerblore: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedDeadlyToxinsFromHerblore"
      );
    },
    description:
      "When creating Lethal Toxins Potions in Herblore, gain +${value} Deadly Toxins Potion(s) as an additional Potion (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: ["herblore"],
  },
  increasedPoisonSpellAccuracy: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPoisonSpellAccuracy");
    },
    description:
      "+${value}% Accuracy Rating when using Archaic Spells that use Poison Runes",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedInfernalSpellAccuracy: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedInfernalSpellAccuracy");
    },
    description:
      "+${value}% Accuracy Rating when using Archaic Spells that use Infernal Runes",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedLightningSpellAccuracy: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedLightningSpellAccuracy");
    },
    description:
      "+${value}% Accuracy Rating when using Archaic Spells that use Lightning Runes",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedSummoningCreationChargesForEquippedTablets: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedSummoningCreationChargesForEquippedTablets"
      );
    },
    description:
      "+${value} Base Quantity when creating equipped Summoning Tablets",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  decreasedSummoningIntervalPercentForEquippedTablets: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedSummoningIntervalPercentForEquippedTablets"
      );
    },
    description: "-${value}% Summoning Interval for equipped Summoning Tablets",
    isSkill: false,
    isNegative: false,
    tags: ["combat", "magic"],
  },
  increasedMinBirdNestQuantity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMinBirdNestQuantity");
    },
    description: "+${value} minimum Bird Nest's recieved from Woodcutting",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedGemVeinChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedGemVeinChance");
    },
    description: "+${value}% Chance to find gem veins when Mining",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedGemVeinChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedGemVeinChance");
    },
    description: "-${value}% Chance to find gem veins when Mining",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedChanceAdditionalBarSmithing: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "increasedChanceAdditionalBarSmithing"
      );
    },
    description:
      "+${value}% Chance to gain +1 additional bar in Smithing (Cannot be doubled)",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedFletchingBoltQuantity: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFletchingBoltQuantity");
    },
    description: "+{value} Base Quantity when creating Bolts in Fletching",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedAgilityPillarCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedAgilityPillarCost");
    },
    description: "+${value}% Agility Pillar build costs",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  decreasedAgilityPillarCost: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedAgilityPillarCost");
    },
    description: "-${value}% Agility Pillar build costs",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  increasedNonCombatSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedNonCombatSkillXP");
    },
    description: "+${value}% Non-Combat Skill XP",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  decreasedNonCombatSkillXP: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedNonCombatSkillXP");
    },
    description: "-${value}% Non-Combat Skill XP",
    isSkill: false,
    isNegative: true,
    tags: [],
  },
  increasedFlatMeleeDefenceBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatMeleeDefenceBonus");
    },
    description: "+${value} Melee Defence Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatRangedDefenceBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatRangedDefenceBonus");
    },
    description: "+${value} Ranged Defence Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatStabAttackBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatStabAttackBonus");
    },
    description: "+${value} Stab Attack Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatSlashAttackBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatSlashAttackBonus");
    },
    description: "+${value} Slash Attack Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatBlockAttackBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatBlockAttackBonus");
    },
    description: "+${value} Block Attack Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatRangedAttackBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatRangedAttackBonus");
    },
    description: "+${value} Ranged Attack Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatMagicAttackBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatMagicAttackBonus");
    },
    description: "+${value} Magic Attack Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatMeleeStrengthBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatMeleeStrengthBonus");
    },
    description: "+${value} Melee Strength Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedFlatRangedStrengthBonus: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedFlatRangedStrengthBonus");
    },
    description: "+${value} Ranged Strength Bonus",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  disableSalamanderItemReduction: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "disableSalamanderItemReduction");
    },
    description:
      "Item Cost reduction is disabled when making Salamander Tablets in Summoning (Excludes Shard Cost)",
    isSkill: false,
    isNegative: true,
    tags: ["summoning"],
  },
  decreasedSummoningIntervalForOctopus: {
    get langDescription() {
      return getLangString(
        "MODIFIER_DATA",
        "decreasedSummoningIntervalForOctopus"
      );
    },
    description: "-${value}% Summoning Interval when making Octopus Tablets",
    isSkill: false,
    isNegative: false,
    tags: ["summoning"],
  },
  decreasedBurnDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBurnDOTDamage");
    },
    description: "-${value}% Damage taken from Burns",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedBurnDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBurnDOTDamage");
    },
    description: "+${value}% Damage taken from Burns",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedBleedDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedBleedDOTDamage");
    },
    description: "-${value}% Damage taken from Bleeds",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedBleedDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedBleedDOTDamage");
    },
    description: "+${value}% Damage taken from Bleeds",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedPoisonDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedPoisonDOTDamage");
    },
    description: "-${value}% Damage taken from Poison",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedPoisonDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedPoisonDOTDamage");
    },
    description: "+${value}% Damage taken from Poison",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  decreasedDeadlyPoisonDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "decreasedDeadlyPoisonDOTDamage");
    },
    description: "-${value}% Damage taken from Deadly Poison",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedDeadlyPoisonDOTDamage: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedDeadlyPoisonDOTDamage");
    },
    description: "+${value}% Damage taken from Deadly Poison",
    isSkill: false,
    isNegative: true,
    tags: ["combat"],
  },
  increasedMasteryPoolCap: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedMasteryPoolCap");
    },
    description: "+${value}% Mastery Pool XP Cap",
    isSkill: false,
    isNegative: false,
    tags: [],
  },
  bypassAllSlayerItems: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "bypassAllSlayerItems");
    },
    description: "Bypass All Slayer Area item requirements",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increased5DROnBeingHit: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increased5DROnBeingHit");
    },
    description:
      "When hit by an Enemy, gain +5% Damage Reduction for 1 Enemy Turn (Does not Stack)",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increased30Slow5TurnsChance: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increased30Slow5TurnsChance");
    },
    description:
      "+${value}% chance to inflict a Slow that increases the target's attack interval by 30% for 5 target turns when hitting with an attack",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEndOfTurnMaxHealing2: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEndOfTurnMaxHealing2");
    },
    description: "Heal ${value}% of max hitpoints every 2 turns",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEvasionAgainstMelee: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEvasionAgainstMelee");
    },
    description: "+${value}% Global Evasion against Melee targets",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEvasionAgainstRanged: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEvasionAgainstRanged");
    },
    description: "+${value}% Global Evasion against Ranged targets",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedEvasionAgainstMagic: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedEvasionAgainstMagic");
    },
    description: "+${value}% Global Evasion against Magic targets",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  allowNonMagicCurses: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "allowNonMagicCurses");
    },
    description: "Magic Curses can be used without a Magic weapon",
    isSkill: false,
    isNegative: false,
    tags: ["combat"],
  },
  increasedTownshipTraderStock: {
    get langDescription() {
      return getLangString("MODIFIER_DATA", "increasedTownshipTraderStock");
    },
    description: "+${value} Township Trader GP Limit per visit (Max 100M)",
    isSkill: false,
    isNegative: false,
    tags: ["township"],
  },
};
