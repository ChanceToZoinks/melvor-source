"use strict";
class CombatModifiers {
  constructor() {
    this.increasedGlobalAccuracy = 0;
    this.decreasedGlobalAccuracy = 0;
    this.increasedMeleeAccuracyBonus = 0;
    this.decreasedMeleeAccuracyBonus = 0;
    this.increasedMeleeMaxHit = 0;
    this.decreasedMeleeMaxHit = 0;
    this.increasedMeleeEvasion = 0;
    this.decreasedMeleeEvasion = 0;
    this.increasedRangedAccuracyBonus = 0;
    this.decreasedRangedAccuracyBonus = 0;
    this.increasedRangedMaxHit = 0;
    this.decreasedRangedMaxHit = 0;
    this.increasedRangedEvasion = 0;
    this.decreasedRangedEvasion = 0;
    this.increasedMagicAccuracyBonus = 0;
    this.decreasedMagicAccuracyBonus = 0;
    this.increasedMagicMaxHit = 0;
    this.decreasedMagicMaxHit = 0;
    this.increasedMagicEvasion = 0;
    this.decreasedMagicEvasion = 0;
    this.increasedMaxHitFlat = 0;
    this.decreasedMaxHitFlat = 0;
    this.increasedMaxHitPercent = 0;
    this.decreasedMaxHitPercent = 0;
    this.increasedDamageReduction = 0;
    this.decreasedDamageReduction = 0;
    this.increasedHPRegenFlat = 0;
    this.decreasedHPRegenFlat = 0;
    this.decreasedAttackInterval = 0;
    this.increasedAttackInterval = 0;
    this.decreasedAttackIntervalPercent = 0;
    this.increasedAttackIntervalPercent = 0;
    this.increasedMaxHitpoints = 0;
    this.decreasedMaxHitpoints = 0;
    this.increasedFlatMaxHitpoints = 0;
    this.decreasedFlatMaxHitpoints = 0;
    this.increasedReflectDamage = 0;
    this.decreasedReflectDamage = 0;
    this.increasedFlatReflectDamage = 0;
    this.decreasedFlatReflectDamage = 0;
    this.increasedRolledReflectDamage = 0;
    this.decreasedRolledReflectDamage = 0;
    this.increasedLifesteal = 0;
    this.decreasedLifesteal = 0;
    this.increasedMeleeLifesteal = 0;
    this.increasedRangedLifesteal = 0;
    this.increasedMagicLifesteal = 0;
    this.increasedBleedLifesteal = 0;
    this.increasedBurnLifesteal = 0;
    this.increasedPoisonLifesteal = 0;
    this.decreasedMeleeLifesteal = 0;
    this.decreasedRangedLifesteal = 0;
    this.decreasedMagicLifesteal = 0;
    this.decreasedBleedLifesteal = 0;
    this.decreasedBurnLifesteal = 0;
    this.decreasedPoisonLifesteal = 0;
    this.increasedMeleeCritChance = 0;
    this.decreasedMeleeCritChance = 0;
    this.increasedRangedCritChance = 0;
    this.decreasedRangedCritChance = 0;
    this.increasedMagicCritChance = 0;
    this.decreasedMagicCritChance = 0;
    this.increasedHitpointRegeneration = 0;
    this.decreasedHitpointRegeneration = 0;
    this.increasedMinHitBasedOnMaxHit = 0;
    this.decreasedMinHitBasedOnMaxHit = 0;
    this.increasedAttackRolls = 0;
    this.decreasedAttackRolls = 0;
    this.increasedFlatMinHit = 0;
    this.decreasedFlatMinHit = 0;
    this.increasedDamageTaken = 0;
    this.decreasedDamageTaken = 0;
    this.increasedConfusion = 0;
    this.increasedDecay = 0;
    this.increasedGlobalEvasion = 0;
    this.decreasedGlobalEvasion = 0;
    this.increasedMinAirSpellDmg = 0;
    this.decreasedMinAirSpellDmg = 0;
    this.increasedMinWaterSpellDmg = 0;
    this.decreasedMinWaterSpellDmg = 0;
    this.increasedMinEarthSpellDmg = 0;
    this.decreasedMinEarthSpellDmg = 0;
    this.increasedMinFireSpellDmg = 0;
    this.decreasedMinFireSpellDmg = 0;
    this.increasedMaxAirSpellDmg = 0;
    this.decreasedMaxAirSpellDmg = 0;
    this.increasedMaxWaterSpellDmg = 0;
    this.decreasedMaxWaterSpellDmg = 0;
    this.increasedMaxEarthSpellDmg = 0;
    this.decreasedMaxEarthSpellDmg = 0;
    this.increasedMaxFireSpellDmg = 0;
    this.decreasedMaxFireSpellDmg = 0;
    this.meleeProtection = 0;
    this.rangedProtection = 0;
    this.magicProtection = 0;
    this.curseImmunity = 0;
    this.increasedDamageReductionPercent = 0;
    this.decreasedDamageReductionPercent = 0;
    this.stunImmunity = 0;
    this.sleepImmunity = 0;
    this.burnImmunity = 0;
    this.poisonImmunity = 0;
    this.bleedImmunity = 0;
    this.debuffImmunity = 0;
    this.freezeImmunity = 0;
    this.increasedRebirthChance = 0;
    this.increasedChanceToApplyBurn = 0;
    this.decreasedChanceToApplyBurn = 0;
    this.decreasedDragonBreathDamage = 0;
    this.increasedMeleeStunThreshold = 0;
    this.increasedFrostburn = 0;
    this.increasedAfflictionChance = 0;
    this.otherStyleImmunity = 0;
    this.meleeImmunity = 0;
    this.rangedImmunity = 0;
    this.magicImmunity = 0;
    this.slowImmunity = 0;
    this.increasedEndOfTurnHealing2 = 0;
    this.increasedEndOfTurnHealing3 = 0;
    this.increasedEndOfTurnHealing5 = 0;
    this.increasedChanceToApplyPoison = 0;
    this.increasedChanceToApplyFrostburn = 0;
    this.increasedMeleeStunChance = 0;
    this.increasedElementalEffectChance = 0;
    this.frostBurnImmunity = 0;
    this.increasedPoisonReflectChance = 0;
    this.increasedBleedReflectChance = 0;
    this.increasedMinNatureSpellDamageBasedOnMaxHit = 0;
    this.increasedTotalBleedDamage = 0;
    this.increasedChanceToIncreaseStunDuration = 0;
    this.increasedSurgeSpellAccuracy = 0;
    this.increasedSurgeSpellMaxHit = 0;
    this.decreasedRegenerationInterval = 0;
    this.increasedOnHitSlowMagnitude = 0;
    this.globalEvasionHPScaling = 0;
    this.doubleBoneDrops = 0;
    this.increasedPrayerPointsWhenHit = 0;
    this.increasedFlatMeleeAccuracyBonusPerAttackInterval = 0;
    this.decreasedFlatMeleeAccuracyBonusPerAttackInterval = 0;
    this.increasedFlatMeleeStrengthBonusPerAttackInterval = 0;
    this.decreasedFlatMeleeStrengthBonusPerAttackInterval = 0;
    this.increasedFlatRangedAccuracyBonusPerAttackInterval = 0;
    this.decreasedFlatRangedAccuracyBonusPerAttackInterval = 0;
    this.increasedFlatRangedStrengthBonusPerAttackInterval = 0;
    this.decreasedFlatRangedStrengthBonusPerAttackInterval = 0;
    this.increasedFlatMagicAccuracyBonusPerAttackInterval = 0;
    this.decreasedFlatMagicAccuracyBonusPerAttackInterval = 0;
    this.increasedDamageReductionAgainstMelee = 0;
    this.decreasedDamageReductionAgainstMelee = 0;
    this.increasedDamageReductionAgainstRanged = 0;
    this.decreasedDamageReductionAgainstRanged = 0;
    this.increasedDamageReductionAgainstMagic = 0;
    this.decreasedDamageReductionAgainstMagic = 0;
    this.increasedDamageReductionWithMagic2HWeapon = 0;
    this.decreasedDamageReductionWithMagic2HWeapon = 0;
    this.increasedMaxHitPercentBasedOnEnemyDamageReduction = 0;
    this.decreasedMaxHitPercentBasedOnEnemyDamageReduction = 0;
    this.increasedMeleeMaxHitBonusAgainstRanged = 0;
    this.decreasedMeleeMaxHitBonusAgainstRanged = 0;
    this.increasedRangedMaxHitBonusAgainstMagic = 0;
    this.decreasedRangedMaxHitBonusAgainstMagic = 0;
    this.increasedMagicMaxHitBonusAgainstMelee = 0;
    this.decreasedMagicMaxHitBonusAgainstMelee = 0;
    this.gainSlayerCoinsBasedOnEnemyCombatLevelMelee = 0;
    this.gainSlayerCoinsBasedOnEnemyCombatLevelRanged = 0;
    this.gainSlayerCoinsBasedOnEnemyCombatLevelMagic = 0;
    this.increasedDamageReductionAgainstBosses = 0;
    this.decreasedDamageReductionAgainstBosses = 0;
    this.increasedChanceDoubleSlayerTaskKill = 0;
    this.decreasedChanceDoubleSlayerTaskKill = 0;
    this.increasedDamageTakenAddedAsPrayerPoints = 0;
    this.decreasedDamageTakenAddedAsPrayerPoints = 0;
    this.globalAccuracyHPScaling = 0;
    this.decreasedEnemyDamageReduction = 0;
    this.increasedEnemyDamageReduction = 0;
    this.increasedGlobalStunChance = 0;
    this.decreasedGlobalStunChance = 0;
    this.increasedGlobalSleepChance = 0;
    this.decreasedGlobalSleepChance = 0;
    this.increased15SlowStunChance2Turns = 0;
    this.decreased15SlowStunChance2Turns = 0;
    this.increasedGPPerDamage = 0;
    this.decreasedGPPerDamage = 0;
    this.increasedGPBasedOnEnemyCombatLevel = 0;
    this.increasedGPBasedOnSummonDamage = 0;
    this.decreasedGPBasedOnSummonDamage = 0;
    this.increasedSlayerCoinsPerDamage = 0;
    this.decreasedSlayerCoinsPerDamage = 0;
    this.increasedChanceToIncreaseSleepDuration = 0;
    this.decreasedChanceToIncreaseSleepDuration = 0;
    this.increasedChanceToAvoidStun = 0;
    this.decreasedChanceToAvoidStun = 0;
    this.increasedChanceToAvoidSleep = 0;
    this.decreasedChanceToAvoidSleep = 0;
    this.increasedHealWhenStunned = 0;
    this.decreasedHealWhenStunned = 0;
    this.increasedHealWhenSleep = 0;
    this.decreasedHealWhenSleep = 0;
    this.increasedChanceToApplyDeadlyPoisonWhenPoisoned = 0;
    this.decreasedChanceToApplyDeadlyPoisonWhenPoisoned = 0;
    this.increasedDamageTakenPerAttack = 0;
    this.decreasedDamageTakenPerAttack = 0;
    this.increasedDamageTakenWhenAsleep = 0;
    this.decreasedDamageTakenWhenAsleep = 0;
    this.increasedDamageTakenWhenStunned = 0;
    this.decreasedDamageTakenWhenStunned = 0;
    this.decreasedPlayerDamageReduction = 0;
    this.increasedDamageDealtIfPoisoned = 0;
    this.decreasedDamageDealtIfPoisoned = 0;
    this.increasedMeleeMaxHitFlat = 0;
    this.decreasedMeleeMaxHitFlat = 0;
    this.increasedRangedMaxHitFlat = 0;
    this.decreasedRangedMaxHitFlat = 0;
    this.increasedMagicMaxHitFlat = 0;
    this.decreasedMagicMaxHitFlat = 0;
    this.increasedChanceToApplyShock = 0;
    this.increasedAbsorbingSkin = 0;
    this.increasedDuality = 0;
    this.increasedChanceToApplyDecayCurse = 0;
    this.increasedRage = 0;
    this.increasedCurseLifesteal = 0;
    this.applyRandomCurseOnSpawn = 0;
    this.increasedChanceDarkBlade = 0;
    this.increasedMaxHitPercentBasedOnDamageReduction = 0;
    this.decreasedMaxHitPercentBasedOnDamageReduction = 0;
    this.halveDamageReduction = 0;
    this.increasedLifestealBasedOnHPRegenEffectiveness = 0;
    this.disableHPRegeneration = 0;
    this.increasedMinMeteorShowerSpellDamage = 0;
    this.increasedEndOfTurnEvasion2 = 0;
    this.decreaseEnemyEvasionOnStun = 0;
    this.decreaseEnemyEvasionOnSleep = 0;
    this.decreasedEvasionBasedOnDR = 0;
    this.healOnHitBasedOnTargetDR = 0;
    this.doubleLifesteal = 0;
    this.increasedMaxHPBurnDamage = 0;
    this.increasedChanceToApplyDeadlyPoison = 0;
    this.disableLifesteal = 0;
    this.increasedSlayerCoinsBasedOnTargetDR = 0;
    this.increasedSlayerCoinsPerPoisonDamage = 0;
    this.increasedChanceToAvoidCurses = 0;
    this.applyMadnessCurseOnSpawn = 0;
    this.applyTormentCurseOnSpawn = 0;
    this.applyDespairCurseOnSpawn = 0;
    this.increasedMinPoisonArchaicDmg = 0;
    this.increasedMinInfernalArchaicDmg = 0;
    this.increasedMinLightningArchaicDmg = 0;
    this.reducedTargetDamageRedcutionIfBleeding = 0;
    this.increasedAssassin = 0;
    this.summoningSynergy_Devil_Eagle = 0;
    this.growingMadnessPassive = 0;
    this.momentInTimePassive = 0;
    this.reignOverTimePassive = 0;
    this.increasedChanceToApplySleepToTargetWhenHit = 0;
    this.increasedPlayerRage = 0;
    this.increasedLeviathan = 0;
    this.shadowCloak = 0;
    this.increasedPoisonSpellAccuracy = 0;
    this.increasedInfernalSpellAccuracy = 0;
    this.increasedLightningSpellAccuracy = 0;
    this.decreasedBurnDOTDamage = 0;
    this.increasedBurnDOTDamage = 0;
    this.decreasedBleedDOTDamage = 0;
    this.increasedBleedDOTDamage = 0;
    this.increasedPoisonDOTDamage = 0;
    this.decreasedPoisonDOTDamage = 0;
    this.increasedDeadlyPoisonDOTDamage = 0;
    this.decreasedDeadlyPoisonDOTDamage = 0;
    this.increased30Slow5TurnsChance = 0;
    this.increasedEndOfTurnMaxHealing2 = 0;
    this.increasedEvasionAgainstMelee = 0;
    this.increasedEvasionAgainstRanged = 0;
    this.increasedEvasionAgainstMagic = 0;
  }
  reset() {
    Object.entries(this).forEach((entry) => {
      this[entry[0]] = 0;
    });
  }
  getActiveModifiers() {
    const modifierTable = Object.entries(this)
      .filter((entry) => entry[1] !== 0)
      .map((entry) => {
        return { name: entry[0], value: entry[1] };
      });
    return modifierTable;
  }
  addModifiers(modData, negMult = 1, posMult = 1) {
    Object.entries(modData).forEach((entry) => {
      let value = 0;
      if (modifierData[entry[0]].isNegative) {
        value = entry[1] * negMult;
      } else {
        value = entry[1] * posMult;
      }
      this[entry[0]] += value;
    });
  }
  addArrayModifiers(modArray) {
    modArray.forEach(({ key, value }) => {
      this[key] += value;
    });
  }
  subArrayModifiers(modArray) {
    modArray.forEach(({ key, value }) => {
      this[key] -= value;
    });
  }
  subModifiers(modData, negMult = 1, posMult = 1) {
    this.addModifiers(modData, -negMult, -posMult);
  }
  getDOTLifesteal(type) {
    let value = 0;
    switch (type) {
      case "Bleed":
        value += this.increasedBleedLifesteal - this.decreasedBleedLifesteal;
        break;
      case "Burn":
        value += this.increasedBurnLifesteal - this.decreasedBurnLifesteal;
        break;
      case "Poison":
      case "DeadlyPoison":
        value += this.increasedPoisonLifesteal - this.decreasedPoisonLifesteal;
        break;
    }
    return value;
  }
  getDOTDamageModifier(type) {
    let value = 0;
    switch (type) {
      case "Burn":
        value += this.increasedBurnDOTDamage - this.decreasedBurnDOTDamage;
        break;
      case "Poison":
        value += this.increasedPoisonDOTDamage - this.decreasedPoisonDOTDamage;
        break;
      case "Bleed":
        value += this.increasedBleedDOTDamage - this.decreasedBleedDOTDamage;
        break;
      case "DeadlyPoison":
        value +=
          this.increasedDeadlyPoisonDOTDamage -
          this.decreasedDeadlyPoisonDOTDamage;
        break;
    }
    return value;
  }
  getAccuracyModifier(type) {
    let totalBonus =
      this.increasedGlobalAccuracy - this.decreasedGlobalAccuracy;
    switch (type) {
      case "melee":
        totalBonus += this.increasedMeleeAccuracyBonus;
        totalBonus -= this.decreasedMeleeAccuracyBonus;
        break;
      case "ranged":
        totalBonus += this.increasedRangedAccuracyBonus;
        totalBonus -= this.decreasedRangedAccuracyBonus;
        break;
      case "magic":
        totalBonus += this.increasedMagicAccuracyBonus;
        totalBonus -= this.decreasedMagicAccuracyBonus;
        break;
      default:
        throw new Error(
          `Invalid attack type: ${type} while modifying accuracy.`
        );
    }
    return totalBonus;
  }
  getEvasionModifier(type) {
    let totalBonus = this.increasedGlobalEvasion - this.decreasedGlobalEvasion;
    switch (type) {
      case "melee":
        totalBonus += this.increasedMeleeEvasion;
        totalBonus -= this.decreasedMeleeEvasion;
        break;
      case "ranged":
        totalBonus += this.increasedRangedEvasion;
        totalBonus -= this.decreasedRangedEvasion;
        break;
      case "magic":
        totalBonus += this.increasedMagicEvasion;
        totalBonus -= this.decreasedMagicEvasion;
        break;
      default:
        throw new Error(
          `Invalid attack type: ${type} while modifying evasion.`
        );
    }
    return totalBonus;
  }
  getMaxHitModifier(type) {
    let totalBonus = this.increasedMaxHitPercent - this.decreasedMaxHitPercent;
    switch (type) {
      case "melee":
        totalBonus += this.increasedMeleeMaxHit;
        totalBonus -= this.decreasedMeleeMaxHit;
        break;
      case "ranged":
        totalBonus += this.increasedRangedMaxHit;
        totalBonus -= this.decreasedRangedMaxHit;
        break;
      case "magic":
        totalBonus += this.increasedMagicMaxHit;
        totalBonus -= this.decreasedMagicMaxHit;
        break;
      default:
        throw new Error(
          `Invalid attack type: ${type} while modifying max hit.`
        );
    }
    return totalBonus;
  }
  getCritChance(type) {
    let totalBonus = 0;
    switch (type) {
      case "melee":
        totalBonus += this.increasedMeleeCritChance;
        totalBonus -= this.decreasedMeleeCritChance;
        break;
      case "ranged":
        totalBonus += this.increasedRangedCritChance;
        totalBonus -= this.decreasedRangedCritChance;
        break;
      case "magic":
        totalBonus += this.increasedMagicCritChance;
        totalBonus -= this.decreasedMagicCritChance;
        break;
      default:
        throw new Error(
          `Invalid attack type: ${type} while calculating crit chance.`
        );
    }
    return totalBonus;
  }
  getLifesteal(type) {
    let totalBonus = this.increasedLifesteal - this.decreasedLifesteal;
    switch (type) {
      case "melee":
        totalBonus += this.increasedMeleeLifesteal;
        totalBonus -= this.decreasedMeleeLifesteal;
        break;
      case "ranged":
        totalBonus += this.increasedRangedLifesteal;
        totalBonus -= this.decreasedRangedLifesteal;
        break;
      case "magic":
        totalBonus += this.increasedMagicLifesteal;
        totalBonus -= this.decreasedMagicLifesteal;
        break;
      default:
        throw new Error(
          `Invalid attack type: ${type} while calculating crit mult.`
        );
    }
    if (this.increasedLifestealBasedOnHPRegenEffectiveness > 0) {
      totalBonus +=
        (this.increasedLifestealBasedOnHPRegenEffectiveness / 100) *
        (this.increasedHitpointRegeneration -
          this.decreasedHitpointRegeneration);
    }
    return totalBonus;
  }
  getMaxHitFlatModifier(type) {
    let totalBonus = this.increasedMaxHitFlat - this.decreasedMaxHitFlat;
    switch (type) {
      case "melee":
        totalBonus += this.increasedMeleeMaxHitFlat;
        totalBonus -= this.decreasedMeleeMaxHitFlat;
        break;
      case "ranged":
        totalBonus += this.increasedRangedMaxHitFlat;
        totalBonus -= this.decreasedRangedMaxHitFlat;
        break;
      case "magic":
        totalBonus += this.increasedMagicMaxHitFlat;
        totalBonus -= this.decreasedMagicMaxHitFlat;
        break;
      default:
        throw new Error(
          `Invalid attack type: ${type} while calculating flat max hit modifier.`
        );
    }
    return totalBonus;
  }
  getMinHitFromMaxHitModifier() {
    return (
      this.increasedMinHitBasedOnMaxHit - this.decreasedMinHitBasedOnMaxHit
    );
  }
  getFlatMinHitModifier() {
    return this.increasedFlatMinHit - this.decreasedFlatMinHit;
  }
  getSpellMinHitModifier(spellType) {
    switch (spellType) {
      case SpellTypes.Air:
        return this.increasedMinAirSpellDmg - this.decreasedMinAirSpellDmg;
      case SpellTypes.Water:
        return this.increasedMinWaterSpellDmg - this.decreasedMinWaterSpellDmg;
      case SpellTypes.Earth:
        return this.increasedMinEarthSpellDmg - this.decreasedMinEarthSpellDmg;
      case SpellTypes.Fire:
        return this.increasedMinFireSpellDmg - this.decreasedMinFireSpellDmg;
      case SpellTypes.Nature:
        return 0;
      default:
        throw new Error(`Invalid Spelltype: ${spellType}`);
    }
  }
  getArchaicMinHitModifier(archaicSpell) {
    switch (archaicSpell.spellType) {
      case ArchaicSpellTypeID.Poison:
        return this.increasedMinPoisonArchaicDmg;
      case ArchaicSpellTypeID.Infernal:
        return this.increasedMinInfernalArchaicDmg;
      case ArchaicSpellTypeID.Lightning:
        return this.increasedMinLightningArchaicDmg;
      default:
        return 0;
    }
  }
  getSpellMaxHitModifier(spellType) {
    switch (spellType) {
      case SpellTypes.Air:
        return this.increasedMaxAirSpellDmg - this.decreasedMaxAirSpellDmg;
      case SpellTypes.Water:
        return this.increasedMaxWaterSpellDmg - this.decreasedMaxWaterSpellDmg;
      case SpellTypes.Earth:
        return this.increasedMaxEarthSpellDmg - this.decreasedMaxEarthSpellDmg;
      case SpellTypes.Fire:
        return this.increasedMaxFireSpellDmg - this.decreasedMaxFireSpellDmg;
      case SpellTypes.Nature:
        return 0;
      default:
        throw new Error(`Invalid Spelltype: ${spellType}`);
    }
  }
  getMaxHPPercentModifier() {
    return this.increasedMaxHitpoints - this.decreasedMaxHitpoints;
  }
  getMaxHPFlatModifier() {
    return this.increasedFlatMaxHitpoints - this.decreasedFlatMaxHitpoints;
  }
  getAttackIntervalModifier() {
    return (
      this.increasedAttackIntervalPercent - this.decreasedAttackIntervalPercent
    );
  }
  getFlatAttackIntervalModifier() {
    return this.increasedAttackInterval - this.decreasedAttackInterval;
  }
  getFlatDamageReductionModifier() {
    return this.increasedDamageReduction - this.decreasedDamageReduction;
  }
  getProtectionValue(type) {
    switch (type) {
      case "melee":
        return this.meleeProtection;
      case "ranged":
        return this.rangedProtection;
      case "magic":
        return this.magicProtection;
    }
  }
  getImmunity(type) {
    switch (type) {
      case "melee":
        return this.meleeImmunity > 0;
      case "ranged":
        return this.rangedImmunity > 0;
      case "magic":
        return this.magicImmunity > 0;
    }
  }
  getFlatReflectDamage() {
    const value =
      this.increasedFlatReflectDamage - this.decreasedFlatReflectDamage;
    return Math.max(0, value);
  }
  getRolledReflectDamage() {
    const value =
      this.increasedRolledReflectDamage - this.decreasedRolledReflectDamage;
    return Math.max(0, value);
  }
  getReflectPercent() {
    const value = this.increasedReflectDamage - this.decreasedReflectDamage;
    return Math.max(0, value);
  }
}
class PlayerModifiers extends CombatModifiers {
  constructor() {
    super();
    this.increasedRuneProvision = 0;
    this.increasedChanceToDoubleLootCombat = 0;
    this.decreasedChanceToDoubleLootCombat = 0;
    this.increasedSlayerCoins = 0;
    this.decreasedSlayerCoins = 0;
    this.increasedGPGlobal = 0;
    this.decreasedGPGlobal = 0;
    this.increasedGPFromMonsters = 0;
    this.decreasedGPFromMonsters = 0;
    this.increasedGPFromMonstersFlat = 0;
    this.decreasedGPFromMonstersFlat = 0;
    this.increasedGPFromThieving = 0;
    this.decreasedGPFromThieving = 0;
    this.increasedGPFromThievingFlat = 0;
    this.decreasedGPFromThievingFlat = 0;
    this.increasedDamageToBosses = 0;
    this.decreasedDamageToBosses = 0;
    this.increasedDamageToSlayerTasks = 0;
    this.decreasedDamageToSlayerTasks = 0;
    this.increasedDamageToSlayerAreaMonsters = 0;
    this.decreasedDamageToSlayerAreaMonsters = 0;
    this.increasedDamageToCombatAreaMonsters = 0;
    this.decreasedDamageToCombatAreaMonsters = 0;
    this.increasedDamageToDungeonMonsters = 0;
    this.decreasedDamageToDungeonMonsters = 0;
    this.increasedDamageToAllMonsters = 0;
    this.decreasedDamageToAllMonsters = 0;
    this.increasedAutoEatEfficiency = 0;
    this.decreasedAutoEatEfficiency = 0;
    this.increasedAutoEatThreshold = 0;
    this.decreasedAutoEatThreshold = 0;
    this.increasedAutoEatHPLimit = 0;
    this.decreasedAutoEatHPLimit = 0;
    this.increasedFoodHealingValue = 0;
    this.decreasedFoodHealingValue = 0;
    this.increasedChanceToPreservePrayerPoints = 0;
    this.decreasedChanceToPreservePrayerPoints = 0;
    this.increasedFlatPrayerCostReduction = 0;
    this.decreasedFlatPrayerCostReduction = 0;
    this.increasedAmmoPreservation = 0;
    this.decreasedAmmoPreservation = 0;
    this.increasedRunePreservation = 0;
    this.decreasedRunePreservation = 0;
    this.increasedSlayerAreaEffectNegationFlat = 0;
    this.decreasedSlayerAreaEffectNegationFlat = 0;
    this.decreasedMonsterRespawnTimer = 0;
    this.increasedMonsterRespawnTimer = 0;
    this.increasedGPFromSales = 0;
    this.decreasedGPFromSales = 0;
    this.increasedBankSpace = 0;
    this.decreasedBankSpace = 0;
    this.increasedBankSpaceShop = 0;
    this.decreasedBankSpaceShop = 0;
    this.increasedChanceToPreservePotionCharge = 0;
    this.decreasedChanceToPreservePotionCharge = 0;
    this.increasedChanceToDoubleLootThieving = 0;
    this.decreasedChanceToDoubleLootThieving = 0;
    this.increasedGlobalPreservationChance = 0;
    this.decreasedGlobalPreservationChance = 0;
    this.increasedStaminaPreservationChance = 0;
    this.decreasedStaminaPreservationChance = 0;
    this.increasedGlobalMasteryXP = 0;
    this.decreasedGlobalMasteryXP = 0;
    this.increasedGlobalSkillXP = 0;
    this.decreasedGlobalSkillXP = 0;
    this.increasedMaxStamina = 0;
    this.decreasedMaxStamina = 0;
    this.increasedMiningNodeHP = 0;
    this.decreasedMiningNodeHP = 0;
    this.dungeonEquipmentSwapping = 0;
    this.increasedEquipmentSets = 0;
    this.autoSlayerUnlocked = 0;
    this.increasedTreeCutLimit = 0;
    this.increasedChanceToDoubleItemsGlobal = 0;
    this.decreasedChanceToDoubleItemsGlobal = 0;
    this.increasedFarmingYield = 0;
    this.decreasedFarmingYield = 0;
    this.increasedStaminaPerObstacle = 0;
    this.decreasedStaminaPerObstacle = 0;
    this.increasedSlayerTaskLength = 0;
    this.decreasedSlayerTaskLength = 0;
    this.increasedStaminaCost = 0;
    this.decreasedStaminaCost = 0;
    this.increasedGPFromAgility = 0;
    this.decreasedGPFromAgility = 0;
    this.increasedChanceToDoubleOres = 0;
    this.decreasedChanceToDoubleOres = 0;
    this.golbinRaidWaveSkipCostReduction = 0;
    this.golbinRaidIncreasedMinimumFood = 0;
    this.golbinRaidIncreasedMaximumAmmo = 0;
    this.golbinRaidIncreasedMaximumRunes = 0;
    this.golbinRaidPrayerUnlocked = 0;
    this.golbinRaidIncreasedPrayerLevel = 0;
    this.golbinRaidIncreasedPrayerPointsStart = 0;
    this.golbinRaidIncreasedPrayerPointsWave = 0;
    this.golbinRaidPassiveSlotUnlocked = 0;
    this.golbinRaidIncreasedStartingRuneCount = 0;
    this.golbinRaidStartingWeapon = 0;
    this.increasedPotionChargesFlat = 0;
    this.decreasedPotionChargesFlat = 0;
    this.increasedBirdNestDropRate = 0;
    this.decreasedBirdNestDropRate = 0;
    this.increasedChanceNoDamageMining = 0;
    this.decreasedChanceNoDamageMining = 0;
    this.increasedSeeingGoldChance = 0;
    this.decreasedSeeingGoldChance = 0;
    this.increasedChanceDoubleHarvest = 0;
    this.decreasedChanceDoubleHarvest = 0;
    this.increasedChanceForElementalRune = 0;
    this.decreasedChanceForElementalRune = 0;
    this.increasedElementalRuneGain = 0;
    this.decreasedElementalRuneGain = 0;
    this.increasedChanceRandomPotionHerblore = 0;
    this.decreasedChanceRandomPotionHerblore = 0;
    this.freeBonfires = 0;
    this.increasedAltMagicSkillXP = 0;
    this.decreasedAltMagicSkillXP = 0;
    this.aprilFoolsIncreasedMovementSpeed = 0;
    this.aprilFoolsDecreasedMovementSpeed = 0;
    this.aprilFoolsIncreasedTeleportCost = 0;
    this.aprilFoolsDecreasedTeleportCost = 0;
    this.aprilFoolsIncreasedUpdateDelay = 0;
    this.aprilFoolsDecreasedUpdateDelay = 0;
    this.aprilFoolsIncreasedLemonGang = 0;
    this.aprilFoolsDecreasedLemonGang = 0;
    this.aprilFoolsIncreasedCarrotGang = 0;
    this.aprilFoolsDecreasedCarrotGang = 0;
    this.increasedGPOnEnemyHit = 0;
    this.decreasedGPOnEnemyHit = 0;
    this.increasedAdditionalRunecraftCountRunes = 0;
    this.decreasedAdditionalRunecraftCountRunes = 0;
    this.increasedGPFromMonstersFlatBasedOnEvasion = 0;
    this.increasedGPPerMeleeDamage = 0;
    this.increasedGPPerRangedDamage = 0;
    this.increasedGPPerMagicDamage = 0;
    this.increasedGPFromSlayerTaskMonsters = 0;
    this.increasedGPWhenHitBasedOnDR = 0;
    this.increasedGPOnRegenBasedOnHPGain = 0;
    this.increasedGPFromBurningMonsters = 0;
    this.summoningSynergy_1_2 = 0;
    this.increasedFlatMagicDefenceBonus = 0;
    this.decreasedSlayerTaskMonsterAccuracy = 0;
    this.increasedMeleeRangedDefenceBonusBasedOnDR = 0;
    this.increasedHPRegenWhenEnemyHasMoreEvasion = 0;
    this.summoningSynergy_1_15 = 0;
    this.increasedSCfromLifesteal = 0;
    this.increasedHealingOnAttackBasedOnDR = 0;
    this.increasedSummoningAttackLifesteal = 0;
    this.increasedWoodcuttingGemChance = 0;
    this.increasedBonusFishingSpecialChance = 0;
    this.summoningSynergy_3_9 = 0;
    this.increasedRunecraftingStavePreservation = 0;
    this.summoningSynergy_Ent_Leprechaun = 0;
    this.increasedWoodcuttingJewelryChance = 0;
    this.summoningSynergy_3_17 = 0;
    this.increasedMinimumBirdNestsWhenPotionActive = 0;
    this.summoningSynergy_3_19 = 0;
    this.summoningSynergy_4_5 = 0;
    this.decreasedCookingSuccessCap = 0;
    this.doubleRuneEssenceMining = 0;
    this.summoningSynergy_Mole_Leprechaun = 0;
    this.doubleSilverGoldMining = 0;
    this.increasedMiningBarChance = 0;
    this.increasedMiningNodeHPWithPerfectSwing = 0;
    this.summoningSynergy_4_19 = 0;
    this.increasedFishingCookedChance = 0;
    this.increasedRunecraftingWaterComboRunes = 0;
    this.summoningSynergy_Octopus_Leprechaun = 0;
    this.increasedCraftingJewelryRandomGemChance = 0;
    this.increasedSmithingDragonGearPreservation = 0;
    this.increasedFishermansPotionCharges = 0;
    this.summoningSynergy_6_7 = 0;
    this.increasedMagicMinHitBasedOnMaxHitSlayerTask = 0;
    this.increasedMeleeMaxHitBasedOnMaxHitSlayerTask = 0;
    this.summoningSynergy_6_13 = 0;
    this.increasedFlatHPRegenBasedOnMeleeMaxHit = 0;
    this.summoningSynergy_6_15 = 0;
    this.summoningSynergy_7_8 = 0;
    this.increasedRangedMaxHitBasedOnMaxHitSlayerTask = 0;
    this.summoningSynergy_7_13 = 0;
    this.increasedFlatHPRegenBasedOnRangedMaxHit = 0;
    this.increasedChanceToApplyBurnWithRanged = 0;
    this.increasedSlayerCoinsPerMagicDamageSlayerTask = 0;
    this.summoningSynergy_8_13 = 0;
    this.increasedFlatHPRegenBasedOnMagicMaxHit = 0;
    this.increasedRunecraftingEssencePreservation = 0;
    this.thievingChefNoDamage = 0;
    this.decreasedFlatCraftingDragonhideCost = 0;
    this.summoningSynergy_9_17 = 0;
    this.increasedGenerousCookPotionCharges = 0;
    this.summoningSynergy_9_19 = 0;
    this.increasedRuneEssenceThievingMiner = 0;
    this.increasedChanceToDoubleLeatherDragonhideCrafting = 0;
    this.summoningSynergy_10_17 = 0;
    this.giveRandomComboRunesRunecrafting = 0;
    this.increasedFireRunesWhenMakingElementalRunes = 0;
    this.increasedThievingAutoSellPrice = 0;
    this.increasedRandomBarChanceThievingMiner = 0;
    this.increasedHerbSackChanceThievingFarmer = 0;
    this.summoningSynergy_Leprechaun_Devil = 0;
    this.increasedDamageReductionAgainstSlayerTasks = 0;
    this.increasedHitpointRegenerationAgainstSlayerTasks = 0;
    this.summoningSynergy_13_14 = 0;
    this.increasedCraftingJewelryPreservation = 0;
    this.increasedCraftingPotionCharges = 0;
    this.increasedFiremakingLogGP = 0;
    this.doubleSilverGoldSmithingWithSeeingGold = 0;
    this.decreasedFlatSmithingCoalCost = 0;
    this.summoningSynergy_Bear_Devil = 0;
    this.increasedChanceToConvertSeedDrops = 0;
    this.increasedMeleeStrengthBonus = 0;
    this.decreasedMeleeStrengthBonus = 0;
    this.increasedRangedStrengthBonus = 0;
    this.decreasedRangedStrengthBonus = 0;
    this.increasedMagicDamageBonus = 0;
    this.decreasedMagicDamageBonus = 0;
    this.increasedAgilityObstacleCost = 0;
    this.decreasedAgilityObstacleCost = 0;
    this.decreasedSecondaryFoodBurnChance = 0;
    this.freeCompost = 0;
    this.increasedCompostPreservationChance = 0;
    this.increasedOffItemChance = 0;
    this.increasedFiremakingCoalChance = 0;
    this.increasedMiningGemChance = 0;
    this.doubleOresMining = 0;
    this.increasedBonusCoalMining = 0;
    this.decreasedSmithingCoalCost = 0;
    this.increasedThievingSuccessRate = 0;
    this.increasedThievingSuccessCap = 0;
    this.allowSignetDrops = 0;
    this.bonusCoalOnDungeonCompletion = 0;
    this.increasedMasteryPoolProgress = 0;
    this.bypassSlayerItems = 0;
    this.itemProtection = 0;
    this.increasedRedemptionPercent = 0;
    this.increasedRedemptionThreshold = 0;
    this.autoLooting = 0;
    this.autoBurying = 0;
    this.freeProtectItem = 0;
    this.decreasedSummoningShardCost = 0;
    this.increasedSummoningShardCost = 0;
    this.increasedSummoningCreationCharges = 0;
    this.decreasedSummoningCreationCharges = 0;
    this.increasedSummoningChargePreservation = 0;
    this.decreasedSummoningChargePreservation = 0;
    this.decreasedPrayerCost = 0;
    this.increasedPrayerCost = 0;
    this.increasedGPMultiplierPer1MGP = 0;
    this.increasedGPMultiplierCap = 0;
    this.increasedGPMultiplierMin = 0;
    this.allowAttackAugmentingMagic = 0;
    this.autoEquipFoodUnlocked = 0;
    this.autoSwapFoodUnlocked = 0;
    this.increasedChanceSuccessfulCook = 0;
    this.decreasedChanceSuccessfulCook = 0;
    this.increasedChancePerfectCookGlobal = 0;
    this.decreasedChancePerfectCookGlobal = 0;
    this.increasedChancePerfectCookFire = 0;
    this.decreasedChancePerfectCookFire = 0;
    this.increasedChancePerfectCookFurnace = 0;
    this.decreasedChancePerfectCookFurnace = 0;
    this.increasedChancePerfectCookPot = 0;
    this.decreasedChancePerfectCookPot = 0;
    this.increasedThievingStealth = 0;
    this.decreasedThievingStealth = 0;
    this.increasedAltMagicRunePreservation = 0;
    this.decreasedAltMagicRunePreservation = 0;
    this.increasedMinThievingGP = 0;
    this.decreasedMinThievingGP = 0;
    this.increasedFishingSpecialChance = 0;
    this.decreasedFishingSpecialChance = 0;
    this.increasedAllotmentSeedCost = 0;
    this.decreasedAllotmentSeedCost = 0;
    this.increasedSummoningMaxHit = 0;
    this.decreasedSummoningMaxHit = 0;
    this.increasedChanceForDiamondFiremaking = 0;
    this.decreasedChanceForDiamondFiremaking = 0;
    this.increasedNonMagicPoisonChance = 0;
    this.increasedChanceToPreserveFood = 0;
    this.allowLootContainerStacking = 0;
    this.infiniteLootContainer = 0;
    this.increasedBaseStardustDropQty = 0;
    this.increasedGPFromFiremaking = 0;
    this.decreasedGPFromFiremaking = 0;
    this.increasedWoodcuttingXPAddedAsFiremakingXP = 0;
    this.decreasedWoodcuttingXPAddedAsFiremakingXP = 0;
    this.increasedChanceForOneExtraOre = 0;
    this.decreasedChanceForOneExtraOre = 0;
    this.increasedChanceForQualitySuperiorGem = 0;
    this.decreasedChanceForQualitySuperiorGem = 0;
    this.increasedMeteoriteOre = 0;
    this.increasedChanceForAshInWoodcutting = 0;
    this.decreasedChanceForAshInWoodcutting = 0;
    this.increasedChanceForAshInFiremaking = 0;
    this.decreasedChanceForAshInFiremaking = 0;
    this.increasedChanceForStardustInFiremaking = 0;
    this.decreasedChanceForStardustInFiremaking = 0;
    this.increasedChanceForOneExtraFish = 0;
    this.decreasedChanceForOneExtraFish = 0;
    this.doubleLogProduction = 0;
    this.increasedGPFromNegativeObstacles = 0;
    this.decreasedGPFromNegativeObstacles = 0;
    this.increasedXPFromNegativeObstacles = 0;
    this.decreasedXPFromNegativeObstacles = 0;
    this.increasedMasteryXPFromNegativeObstacles = 0;
    this.decreasedMasteryXPFromNegativeObstacles = 0;
    this.increasedChanceGoldenStardust = 0;
    this.decreasedChanceGoldenStardust = 0;
    this.increasedChanceStardust = 0;
    this.decreasedChanceStardust = 0;
    this.decreasedThievingStunIntervalPercent = 0;
    this.increasedThievingStunIntervalPercent = 0;
    this.decreasedGlobalSkillIntervalPercent = 0;
    this.increasedGlobalSkillIntervalPercent = 0;
    this.increasedChanceForArrowShaftsWoodcutting = 0;
    this.decreasedChanceForArrowShaftsWoodcutting = 0;
    this.decreasedNonShardCostForEquippedTablets = 0;
    this.increasedNonShardCostForEquippedTablets = 0;
    this.decreasedPassiveCookInterval = 0;
    this.increasedPassiveCookInterval = 0;
    this.increasedSalamanderCreationCharges = 0;
    this.decreasedSalamanderCreationCharges = 0;
    this.decreasedJavelinResourceCost = 0;
    this.increasedJavelinResourceCost = 0;
    this.increasedJavelinProduction = 0;
    this.decreasedJavelinProduction = 0;
    this.increasedChanceExtraJavelins = 0;
    this.decreasedChanceExtraJavelins = 0;
    this.increasedChanceExtraMeteoriteOre = 0;
    this.decreasedChanceExtraMeteoriteOre = 0;
    this.increasedChanceExtraArrows = 0;
    this.decreasedChanceExtraArrows = 0;
    this.increasedChanceExtraUnstrungBows = 0;
    this.decreasedChanceExtraUnstrungBows = 0;
    this.increasedChanceItemToGoldFletching = 0;
    this.decreasedChanceItemToGoldFletching = 0;
    this.increasedLeprechaunCreationCharges = 0;
    this.decreasedLeprechaunCreationCharges = 0;
    this.increasedGPFromAgilityPerActiveObstacle = 0;
    this.decreasedGPFromAgilityPerActiveObstacle = 0;
    this.increasedChanceExtraCrossbows = 0;
    this.decreasedChanceExtraCrossbows = 0;
    this.disableGoldenStardustDrops = 0;
    this.increasedBoltProduction = 0;
    this.decreasedBoltProduction = 0;
    this.decreasedFletchingIntervalWithArrows = 0;
    this.increasedFletchingIntervalWithArrows = 0;
    this.increasedCyclopsCreationCharges = 0;
    this.decreasedCyclopsCreationCharges = 0;
    this.increasedGPFromItemAlchemy = 0;
    this.increasedChanceForCharcoalInFiremaking = 0;
    this.decreasedChanceForCharcoalInFiremaking = 0;
    this.increasedThievingAreaUniqueChance = 0;
    this.decreasedThievingAreaUniqueChance = 0;
    this.increasedChanceToFindMeteorite = 0;
    this.increasedChanceToFindMushroomWoodcutting = 0;
    this.increasedChanceToAvoidThievingStuns = 0;
    this.increasedChanceAdditionalPerfectItem = 0;
    this.increasedChanceStardustCuttingMagicLogs = 0;
    this.increasedTownshipPopulationCap = 0;
    this.decreasedTownshipPopulationCap = 0;
    this.increasedTownshipHappiness = 0;
    this.decreasedTownshipHappiness = 0;
    this.increasedTownshipEducation = 0;
    this.decreasedTownshipEducation = 0;
    this.increasedTownshipHealth = 0;
    this.decreasedTownshipHealth = 0;
    this.increasedTownshipGPProduction = 0;
    this.decreasedTownshipGPProduction = 0;
    this.increasedTownshipMaxStorage = 0;
    this.decreasedTownshipMaxStorage = 0;
    this.increasedTownshipFoodProduction = 0;
    this.decreasedTownshipFoodProduction = 0;
    this.increasedTownshipWoodProduction = 0;
    this.decreasedTownshipWoodProduction = 0;
    this.increasedTownshipOreProduction = 0;
    this.decreasedTownshipOreProduction = 0;
    this.increasedTownshipStoneProduction = 0;
    this.decreasedTownshipStoneProduction = 0;
    this.increasedTownshipCoalProduction = 0;
    this.decreasedTownshipCoalProduction = 0;
    this.increasedTownshipBarProduction = 0;
    this.decreasedTownshipBarProduction = 0;
    this.increasedTownshipHerbProduction = 0;
    this.decreasedTownshipHerbProduction = 0;
    this.increasedTownshipRuneEssenceProduction = 0;
    this.decreasedTownshipRuneEssenceProduction = 0;
    this.increasedTownshipLeatherProduction = 0;
    this.decreasedTownshipLeatherProduction = 0;
    this.increasedTownshipPotionProduction = 0;
    this.decreasedTownshipPotionProduction = 0;
    this.increasedTownshipPlankProduction = 0;
    this.decreasedTownshipPlankProduction = 0;
    this.increasedTownshipClothingProduction = 0;
    this.decreasedTownshipClothingProduction = 0;
    this.increasedTownshipBuildingCost = 0;
    this.decreasedTownshipBuildingCost = 0;
    this.increasedTownshipGrasslandsProduction = 0;
    this.decreasedTownshipGrasslandsProduction = 0;
    this.increasedTownshipForestProduction = 0;
    this.decreasedTownshipForestProduction = 0;
    this.increasedTownshipDesertProduction = 0;
    this.decreasedTownshipDesertProduction = 0;
    this.increasedTownshipWaterProduction = 0;
    this.decreasedTownshipWaterProduction = 0;
    this.increasedTownshipSwampProduction = 0;
    this.decreasedTownshipSwampProduction = 0;
    this.increasedTownshipAridPlainsProduction = 0;
    this.decreasedTownshipAridPlainsProduction = 0;
    this.increasedTownshipMountainsProduction = 0;
    this.decreasedTownshipMountainsProduction = 0;
    this.increasedTownshipValleyProduction = 0;
    this.decreasedTownshipValleyProduction = 0;
    this.increasedTownshipJungleProduction = 0;
    this.decreasedTownshipJungleProduction = 0;
    this.increasedTownshipSnowlandsProduction = 0;
    this.decreasedTownshipSnowlandsProduction = 0;
    this.increasedTownshipFishingDockProduction = 0;
    this.decreasedTownshipFishingDockProduction = 0;
    this.increasedTownshipMagicEmporiumProduction = 0;
    this.decreasedTownshipMagicEmporiumProduction = 0;
    this.increasedTownshipOrchardProduction = 0;
    this.decreasedTownshipOrchardProduction = 0;
    this.increasedTownshipFarmProduction = 0;
    this.decreasedTownshipFarmProduction = 0;
    this.increasedTownshipWoodcuttingProduction = 0;
    this.decreasedTownshipWoodcuttingProduction = 0;
    this.increasedTownshipBlacksmithProduction = 0;
    this.decreasedTownshipBlacksmithProduction = 0;
    this.increasedTownshipTaxPerCitizen = 0;
    this.decreasedTownshipTaxPerCitizen = 0;
    this.townshipDisableHunting = 0;
    this.increasedTownshipResourceProduction = 0;
    this.decreasedTownshipResourceProduction = 0;
    this.increasedTownshipCoalUsage = 0;
    this.decreasedTownshipCoalUsage = 0;
    this.increasedTownshipBuildingHappinessPenalties = 0;
    this.decreasedTownshipBuildingHappinessPenalties = 0;
    this.increasedAdditionalAshInFiremaking = 0;
    this.decreasedAdditionalAshInFiremaking = 0;
    this.increasedTownshipFoodUsage = 0;
    this.decreasedTownshipFoodUsage = 0;
    this.increasedChanceToFindLostChest = 0;
    this.increasedChanceToPreserveConsumable = 0;
    this.increasedTownshipDeadStorage = 0;
    this.decreasedTownshipDeadStorage = 0;
    this.bigRon = 0;
    this.coalGainedOnCookingFailure = 0;
    this.halvedWoodcuttingDoubleChance = 0;
    this.increasedFlatFarmingYield = 0;
    this.decreasedFlatFarmingYield = 0;
    this.increasedDeadlyToxinsFromHerblore = 0;
    this.increasedSummoningCreationChargesForEquippedTablets = 0;
    this.decreasedSummoningIntervalPercentForEquippedTablets = 0;
    this.increasedMinBirdNestQuantity = 0;
    this.increasedGemVeinChance = 0;
    this.decreasedGemVeinChance = 0;
    this.increasedChanceAdditionalBarSmithing = 0;
    this.increasedFletchingBoltQuantity = 0;
    this.increasedAgilityPillarCost = 0;
    this.decreasedAgilityPillarCost = 0;
    this.increasedNonCombatSkillXP = 0;
    this.decreasedNonCombatSkillXP = 0;
    this.increasedFlatMeleeDefenceBonus = 0;
    this.increasedFlatRangedDefenceBonus = 0;
    this.increasedFlatStabAttackBonus = 0;
    this.increasedFlatSlashAttackBonus = 0;
    this.increasedFlatBlockAttackBonus = 0;
    this.increasedFlatRangedAttackBonus = 0;
    this.increasedFlatMagicAttackBonus = 0;
    this.increasedFlatMeleeStrengthBonus = 0;
    this.increasedFlatRangedStrengthBonus = 0;
    this.disableSalamanderItemReduction = 0;
    this.decreasedSummoningIntervalForOctopus = 0;
    this.increasedMasteryPoolCap = 0;
    this.bypassAllSlayerItems = 0;
    this.increased5DROnBeingHit = 0;
    this.allowNonMagicCurses = 0;
    this.increasedTownshipTraderStock = 0;
    this.skillModifiers = new Map();
  }
  get combatLootDoubleChance() {
    return (
      this.increasedChanceToDoubleItemsGlobal -
      this.decreasedChanceToDoubleItemsGlobal +
      this.increasedChanceToDoubleLootCombat -
      this.decreasedChanceToDoubleLootCombat
    );
  }
  get increasedCombatGP() {
    return (
      this.increasedGPFromMonsters -
      this.decreasedGPFromMonsters +
      this.increasedGPGlobal -
      this.decreasedGPGlobal
    );
  }
  get runePreservationChance() {
    const chance =
      this.increasedRunePreservation - this.decreasedRunePreservation;
    return Math.min(chance, 80);
  }
  get ammoPreservationChance() {
    const chance =
      this.increasedAmmoPreservation - this.decreasedAmmoPreservation;
    return Math.min(chance, 80);
  }
  addModifiers(modifiers, negMult = 1, posMult = 1) {
    Object.entries(modifiers).forEach((entry) => {
      var _a;
      if (isSkillEntry(entry)) {
        const skillMap =
          (_a = this.skillModifiers.get(entry[0])) !== null && _a !== void 0
            ? _a
            : new Map();
        entry[1].forEach((skillMod) => {
          var _a;
          let value = 0;
          if (modifierData[entry[0]].isNegative) {
            value = skillMod.value * negMult;
          } else {
            value = skillMod.value * posMult;
          }
          skillMap.set(
            skillMod.skill,
            ((_a = skillMap.get(skillMod.skill)) !== null && _a !== void 0
              ? _a
              : 0) + value
          );
        });
        this.skillModifiers.set(entry[0], skillMap);
      } else {
        if (modifierData[entry[0]].isNegative) {
          this[entry[0]] += entry[1] * negMult;
        } else {
          this[entry[0]] += entry[1] * posMult;
        }
      }
    });
  }
  addMappedModifiers(modifiers) {
    modifiers.skillModifiers.forEach((skillMapToAdd, skillKey) => {
      var _a;
      const skillMap =
        (_a = this.skillModifiers.get(skillKey)) !== null && _a !== void 0
          ? _a
          : new Map();
      skillMapToAdd.forEach((value, skill) => {
        var _a;
        skillMap.set(
          skill,
          ((_a = skillMap.get(skill)) !== null && _a !== void 0 ? _a : 0) +
            value
        );
      });
      this.skillModifiers.set(skillKey, skillMap);
    });
    modifiers.standardModifiers.forEach((value, standardKey) => {
      this[standardKey] += value;
    });
  }
  getActiveModifiers() {
    const modifierTable = [];
    Object.entries(modifierData).forEach((entry) => {
      if (!isSkillEntry(entry) && this[entry[0]] !== 0) {
        modifierTable.push({ name: entry[0], value: this[entry[0]] });
      }
    });
    this.skillModifiers.forEach((skillMap, modKey) => {
      skillMap.forEach((value, skill) => {
        modifierTable.push({ name: `${modKey}:${skill.id}`, value: value });
      });
    });
    return modifierTable;
  }
  reset() {
    Object.entries(modifierData).forEach((entry) => {
      if (!isSkillEntry(entry)) {
        this[entry[0]] = 0;
      }
    });
    this.skillModifiers.clear();
  }
  getSkillModifierValue(key, skill) {
    var _a;
    const skillMap = this.skillModifiers.get(key);
    if (skillMap === undefined) return 0;
    else return (_a = skillMap.get(skill)) !== null && _a !== void 0 ? _a : 0;
  }
  getGPForDamageMultiplier(attackType) {
    let totalMod = 0;
    switch (attackType) {
      case "melee":
        totalMod += this.increasedGPPerMeleeDamage;
        break;
      case "ranged":
        totalMod += this.increasedGPPerRangedDamage;
        break;
      case "magic":
        totalMod += this.increasedGPPerMagicDamage;
        break;
    }
    totalMod += this.increasedGPPerDamage - this.decreasedGPPerDamage;
    return totalMod;
  }
  get meleeStrengthBonusModifier() {
    return this.increasedMeleeStrengthBonus - this.decreasedMeleeStrengthBonus;
  }
  get rangedStrengthBonusModifier() {
    return (
      this.increasedRangedStrengthBonus - this.decreasedRangedStrengthBonus
    );
  }
  get magicDamageModifier() {
    return this.increasedMagicDamageBonus - this.decreasedMagicDamageBonus;
  }
  getHiddenSkillLevels(skill) {
    return (
      this.getSkillModifierValue("increasedHiddenSkillLevel", skill) -
      this.getSkillModifierValue("decreasedHiddenSkillLevel", skill)
    );
  }
  getActiveModifierDescriptions() {
    const descriptions = [];
    Object.entries(modifierData).forEach((entry) => {
      if (!isSkillEntry(entry) && this[entry[0]] !== 0)
        descriptions.push(printPlayerModifier(entry[0], this[entry[0]]));
    });
    this.skillModifiers.forEach((skillMap, key) => {
      skillMap.forEach((value, skill) => {
        descriptions.push(printPlayerModifier(key, { skill, value }));
      });
    });
    return descriptions;
  }
}
class MappedModifiers {
  constructor() {
    this.skillModifiers = new Map();
    this.standardModifiers = new Map();
  }
  addStandardModifier(key, value) {
    var _a;
    this.standardModifiers.set(
      key,
      value +
        ((_a = this.standardModifiers.get(key)) !== null && _a !== void 0
          ? _a
          : 0)
    );
  }
  addSkillModifiers(key, values, negMult = 1, posMult = 1) {
    var _a;
    const skillMap =
      (_a = this.skillModifiers.get(key)) !== null && _a !== void 0
        ? _a
        : new Map();
    values.forEach(({ skill, value }) => {
      var _a;
      if (modifierData[key].isNegative) {
        value *= negMult;
      } else {
        value *= posMult;
      }
      skillMap.set(
        skill,
        ((_a = skillMap.get(skill)) !== null && _a !== void 0 ? _a : 0) + value
      );
    });
    this.skillModifiers.set(key, skillMap);
  }
  addModifiers(modifiers, negMult = 1, posMult = 1) {
    Object.entries(modifiers).forEach((entry) => {
      if (isSkillEntry(entry)) {
        this.addSkillModifiers(entry[0], entry[1], negMult, posMult);
      } else {
        const value =
          entry[1] * (modifierData[entry[0]].isNegative ? negMult : posMult);
        this.addStandardModifier(entry[0], value);
      }
    });
  }
  addArrayModifiers(modArray) {
    modArray.forEach((modElement) => {
      if ("values" in modElement) {
        this.addSkillModifiers(modElement.key, modElement.values);
      } else {
        this.addStandardModifier(modElement.key, modElement.value);
      }
    });
  }
  addMappedModifiers(modifiers) {
    modifiers.skillModifiers.forEach((skillMapToAdd, skillKey) => {
      var _a;
      const skillMap =
        (_a = this.skillModifiers.get(skillKey)) !== null && _a !== void 0
          ? _a
          : new Map();
      skillMapToAdd.forEach((value, skill) => {
        var _a;
        skillMap.set(
          skill,
          ((_a = skillMap.get(skill)) !== null && _a !== void 0 ? _a : 0) +
            value
        );
      });
      this.skillModifiers.set(skillKey, skillMap);
    });
    modifiers.standardModifiers.forEach((value, standardKey) => {
      this.addStandardModifier(standardKey, value);
    });
  }
  reset() {
    this.standardModifiers.clear();
    this.skillModifiers.clear();
  }
  getActiveModifierDescriptions() {
    const descriptions = [];
    this.standardModifiers.forEach((value, key) => {
      if (value > 0)
        descriptions.push(
          printPlayerModifier(
            key,
            value,
            shouldRoundModifier(key, value) ? 2 : 0
          )
        );
    });
    this.skillModifiers.forEach((skillMap, key) => {
      skillMap.forEach((value, skill) => {
        if (value > 0)
          descriptions.push(
            printPlayerModifier(
              key,
              { skill, value },
              shouldRoundModifier(key, value) ? 2 : 0
            )
          );
      });
    });
    return descriptions;
  }
  getActiveModifierDescriptionsToPrecision(precision) {
    const descriptions = [];
    this.standardModifiers.forEach((value, key) => {
      if (value > 0)
        descriptions.push(
          printPlayerModifier(
            key,
            Number.parseFloat(value.toPrecision(precision))
          )
        );
    });
    this.skillModifiers.forEach((skillMap, key) => {
      skillMap.forEach((value, skill) => {
        if (value > 0)
          descriptions.push(
            printPlayerModifier(key, {
              skill,
              value: Number.parseFloat(value.toPrecision(precision)),
            })
          );
      });
    });
    return descriptions;
  }
  getModifierDescriptionsAsNodes(tagName, additionalClasses = []) {
    const nodes = [];
    const descriptions = this.getActiveModifierDescriptions();
    if (descriptions.length > 0) {
      descriptions.forEach(([text, textClass]) => {
        nodes.push(
          createElement(tagName, {
            className: textClass,
            classList: additionalClasses,
            text,
          })
        );
      });
    } else {
      nodes.push(
        createElement(tagName, {
          classList: ["font-w700", "text-danger", ...additionalClasses],
          text: getLangString("MENU_TEXT", "NONE"),
        })
      );
    }
    return nodes;
  }
}
class TargetModifiers {
  constructor() {
    this.modifiers = new Map();
  }
  addTargetModifiers(modifiers) {
    modifiers.modifiers.forEach((value, key) => {
      var _a;
      this.modifiers.set(
        key,
        value +
          ((_a = this.modifiers.get(key)) !== null && _a !== void 0 ? _a : 0)
      );
    });
  }
  addModifiers(modifiers, negMult = 1, posMult = 1) {
    Object.entries(modifiers).forEach((entry) => {
      var _a;
      const value =
        entry[1] * (modifierData[entry[0]].isNegative ? negMult : posMult);
      this.modifiers.set(
        entry[0],
        value +
          ((_a = this.modifiers.get(entry[0])) !== null && _a !== void 0
            ? _a
            : 0)
      );
    });
  }
  addToCombatModifiers(combatModifiers) {
    this.modifiers.forEach((value, key) => {
      combatModifiers[key] += value;
    });
  }
  subFromCombatModifiers(combatModifiers) {
    this.modifiers.forEach((value, key) => {
      combatModifiers[key] -= value;
    });
  }
  reset() {
    this.modifiers.clear();
  }
}
function shouldRoundModifier(key, value) {
  const modData = modifierData[key];
  if (modData.modifyValue !== undefined) {
    const modifiedValue = modData.modifyValue(value);
    return (
      typeof modifiedValue === "number" && !Number.isInteger(modifiedValue)
    );
  } else {
    return !Number.isInteger(value);
  }
}
function printPlayerModifier(key, value, precision) {
  const modData = modifierData[key];
  const description = modifierData[key].langDescription;
  const formatData = {};
  let valueNum;
  if (typeof value !== "number") {
    valueNum = value.value;
    formatData.skillName = value.skill.name;
  } else {
    valueNum = value;
  }
  if (modData.modifyValue !== undefined) {
    const modifiedValue = modData.modifyValue(valueNum);
    if (typeof modifiedValue === "number" && precision !== undefined)
      formatData.value = modifiedValue.toFixed(precision);
    else formatData.value = `${modifiedValue}`;
  } else {
    if (precision !== undefined) formatData.value = valueNum.toFixed(precision);
    else formatData.value = numberWithCommas(valueNum);
  }
  const textClass = modData.isNegative
    ? "font-w700 text-danger"
    : "text-success";
  return [templateString(description, formatData), textClass];
}
function isSkillEntry(entry) {
  return modifierData[entry[0]].isSkill;
}
function isSkillKey(key) {
  return modifierData[key].isSkill;
}
function addModifierTemplateData(formatData, modifiers, key) {
  Object.entries(modifiers).forEach((entry, i) => {
    const modData = modifierData[entry[0]];
    if (isSkillEntry(entry)) {
      entry[1].forEach((data, j) => {
        const valueNum = data.value;
        let valueString;
        if (modData.modifyValue !== undefined) {
          valueString = `${modData.modifyValue(valueNum)}`;
        } else {
          valueString = `${valueNum}`;
        }
        formatData[`${key}modValue${i}-${j}`] = valueString;
        formatData[`${key}modSkillName${i}-${j}`] = data.skill.name;
      });
    } else {
      const valueNum = entry[1];
      let valueString;
      if (modData.modifyValue !== undefined) {
        valueString = `${modData.modifyValue(valueNum)}`;
      } else {
        valueString = `${valueNum}`;
      }
      formatData[`${key}modValue${i}`] = valueString;
    }
  });
}
function generateModifierDataDescription(modifiers, key) {
  const descriptions = [];
  Object.entries(modifiers).forEach((entry, i) => {
    if (isSkillEntry(entry)) {
      entry[1].forEach((_, j) => {
        descriptions.push(
          templateString(modifierData[entry[0]].description, {
            value: `\${${key}modValue${i}-${j}}`,
            skillName: `\${${key}modSkillName${i}-${j}}`,
          })
        );
      });
    } else {
      descriptions.push(
        templateString(modifierData[entry[0]].description, {
          value: `\${${key}modValue${i}}`,
        })
      );
    }
  });
  return joinAsList(descriptions);
}
function getPlainModifierDescriptions(modifiers) {
  const descriptions = [];
  Object.entries(modifiers).forEach((entry) => {
    if (isSkillEntry(entry)) {
      entry[1].forEach((data) => {
        const [desc, format] = printPlayerModifier(entry[0], data);
        descriptions.push(desc);
      });
    } else {
      const [desc, format] = printPlayerModifier(entry[0], entry[1]);
      descriptions.push(desc);
    }
  });
  return descriptions;
}
function describeModifierDataPlain(modifiers) {
  return joinAsList(getPlainModifierDescriptions(modifiers));
}
function describeModifierDataPlainLineBreak(modifiers) {
  return joinAsLineBreakList(getPlainModifierDescriptions(modifiers));
}
function describeModifierData(modifiers) {
  const modSpans = getModifierDataSpans(modifiers);
  return joinAsList(modSpans);
}
function describeModifierDataLineBreak(modifiers) {
  const modSpans = getModifierDataSpans(modifiers);
  return joinAsLineBreakList(modSpans);
}
function getModifierDataSpans(modifiers, negMult = 1, posMult = 1) {
  const modSpans = [];
  Object.entries(modifiers).forEach((entry) => {
    const isNeg = modifierData[entry[0]].isNegative;
    const mult = isNeg ? negMult : posMult;
    if (isSkillEntry(entry)) {
      entry[1].forEach((data) => {
        const [desc, format] = printPlayerModifier(entry[0], data);
        if (game.settings.showNeutralAttackModifiers)
          modSpans.push(`<span class="font-w700 text-warning">${desc}</span>`);
        else modSpans.push(`<span class="${format}">${desc}</span>`);
      });
    } else {
      const [desc, format] = printPlayerModifier(entry[0], entry[1] * mult);
      if (game.settings.showNeutralAttackModifiers)
        modSpans.push(`<span class="font-w700 text-warning">${desc}</span>`);
      else modSpans.push(`<span class="${format}">${desc}</span>`);
    }
  });
  return modSpans;
}
function getSpansFromModifierObject(modifiers, negMult = 1, posMult = 1) {
  const spans = [];
  Object.entries(modifiers).forEach((entry) => {
    const isNeg = modifierData[entry[0]].isNegative;
    const mult = isNeg ? negMult : posMult;
    if (isSkillEntry(entry)) {
      entry[1].forEach((data) => {
        const [desc, format] = printPlayerModifier(entry[0], data);
        const className = game.settings.showNeutralAttackModifiers
          ? "font-w700 text-warning"
          : format;
        spans.push(createElement("span", { className, text: desc }));
      });
    } else {
      const [desc, format] = printPlayerModifier(entry[0], entry[1] * mult);
      const className = game.settings.showNeutralAttackModifiers
        ? "font-w700 text-warning"
        : format;
      spans.push(createElement("span", { className, text: desc }));
    }
  });
  return spans;
}
