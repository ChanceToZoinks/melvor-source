"use strict";
var Events;
(function (Events) {
  Events[(Events["CHRISTMAS2021"] = 0)] = "CHRISTMAS2021";
})(Events || (Events = {}));
var EquipmentSlots;
(function (EquipmentSlots) {
  EquipmentSlots[(EquipmentSlots["Helmet"] = 0)] = "Helmet";
  EquipmentSlots[(EquipmentSlots["Platebody"] = 1)] = "Platebody";
  EquipmentSlots[(EquipmentSlots["Platelegs"] = 2)] = "Platelegs";
  EquipmentSlots[(EquipmentSlots["Boots"] = 3)] = "Boots";
  EquipmentSlots[(EquipmentSlots["Weapon"] = 4)] = "Weapon";
  EquipmentSlots[(EquipmentSlots["Shield"] = 5)] = "Shield";
  EquipmentSlots[(EquipmentSlots["Amulet"] = 6)] = "Amulet";
  EquipmentSlots[(EquipmentSlots["Ring"] = 7)] = "Ring";
  EquipmentSlots[(EquipmentSlots["Gloves"] = 8)] = "Gloves";
  EquipmentSlots[(EquipmentSlots["Quiver"] = 9)] = "Quiver";
  EquipmentSlots[(EquipmentSlots["Cape"] = 10)] = "Cape";
  EquipmentSlots[(EquipmentSlots["Passive"] = 11)] = "Passive";
  EquipmentSlots[(EquipmentSlots["Summon1"] = 12)] = "Summon1";
  EquipmentSlots[(EquipmentSlots["Summon2"] = 13)] = "Summon2";
  EquipmentSlots[(EquipmentSlots["Consumable"] = 14)] = "Consumable";
})(EquipmentSlots || (EquipmentSlots = {}));
var SpellTypes;
(function (SpellTypes) {
  SpellTypes[(SpellTypes["Air"] = 0)] = "Air";
  SpellTypes[(SpellTypes["Water"] = 1)] = "Water";
  SpellTypes[(SpellTypes["Earth"] = 2)] = "Earth";
  SpellTypes[(SpellTypes["Fire"] = 3)] = "Fire";
  SpellTypes[(SpellTypes["Nature"] = 4)] = "Nature";
})(SpellTypes || (SpellTypes = {}));
var SlayerTierID;
(function (SlayerTierID) {
  SlayerTierID[(SlayerTierID["Easy"] = 0)] = "Easy";
  SlayerTierID[(SlayerTierID["Normal"] = 1)] = "Normal";
  SlayerTierID[(SlayerTierID["Hard"] = 2)] = "Hard";
  SlayerTierID[(SlayerTierID["Elite"] = 3)] = "Elite";
  SlayerTierID[(SlayerTierID["Master"] = 4)] = "Master";
  SlayerTierID[(SlayerTierID["Legendary"] = 5)] = "Legendary";
  SlayerTierID[(SlayerTierID["Mythical"] = 6)] = "Mythical";
})(SlayerTierID || (SlayerTierID = {}));
var CrateRarity;
(function (CrateRarity) {
  CrateRarity[(CrateRarity["Common"] = 35)] = "Common";
  CrateRarity[(CrateRarity["Uncommon"] = 20)] = "Uncommon";
  CrateRarity[(CrateRarity["Rare"] = 10)] = "Rare";
  CrateRarity[(CrateRarity["UltraRare"] = 4)] = "UltraRare";
  CrateRarity[(CrateRarity["BuggedRare"] = 1)] = "BuggedRare";
})(CrateRarity || (CrateRarity = {}));
var ModifierID;
(function (ModifierID) {
  ModifierID[(ModifierID["increasedGlobalAccuracy"] = 0)] =
    "increasedGlobalAccuracy";
  ModifierID[(ModifierID["increasedMeleeAccuracyBonus"] = 1)] =
    "increasedMeleeAccuracyBonus";
  ModifierID[(ModifierID["increasedMeleeMaxHit"] = 2)] = "increasedMeleeMaxHit";
  ModifierID[(ModifierID["increasedMeleeEvasion"] = 3)] =
    "increasedMeleeEvasion";
  ModifierID[(ModifierID["increasedRangedAccuracyBonus"] = 4)] =
    "increasedRangedAccuracyBonus";
  ModifierID[(ModifierID["increasedRangedMaxHit"] = 5)] =
    "increasedRangedMaxHit";
  ModifierID[(ModifierID["increasedRangedEvasion"] = 6)] =
    "increasedRangedEvasion";
  ModifierID[(ModifierID["increasedMagicAccuracyBonus"] = 7)] =
    "increasedMagicAccuracyBonus";
  ModifierID[(ModifierID["increasedMagicMaxHit"] = 8)] = "increasedMagicMaxHit";
  ModifierID[(ModifierID["increasedMagicEvasion"] = 9)] =
    "increasedMagicEvasion";
  ModifierID[(ModifierID["increasedMaxHitFlat"] = 10)] = "increasedMaxHitFlat";
  ModifierID[(ModifierID["increasedMaxHitPercent"] = 11)] =
    "increasedMaxHitPercent";
  ModifierID[(ModifierID["increasedDamageReduction"] = 12)] =
    "increasedDamageReduction";
  ModifierID[(ModifierID["increasedChanceToDoubleLootCombat"] = 13)] =
    "increasedChanceToDoubleLootCombat";
  ModifierID[(ModifierID["increasedSlayerCoins"] = 14)] =
    "increasedSlayerCoins";
  ModifierID[(ModifierID["increasedHPRegenFlat"] = 15)] =
    "increasedHPRegenFlat";
  ModifierID[(ModifierID["increasedGPGlobal"] = 16)] = "increasedGPGlobal";
  ModifierID[(ModifierID["increasedGPFromMonsters"] = 17)] =
    "increasedGPFromMonsters";
  ModifierID[(ModifierID["increasedGPFromMonstersFlat"] = 18)] =
    "increasedGPFromMonstersFlat";
  ModifierID[(ModifierID["increasedGPFromThieving"] = 19)] =
    "increasedGPFromThieving";
  ModifierID[(ModifierID["increasedGPFromThievingFlat"] = 20)] =
    "increasedGPFromThievingFlat";
  ModifierID[(ModifierID["increasedGPFromAgility"] = 21)] =
    "increasedGPFromAgility";
  ModifierID[(ModifierID["decreasedGPFromAgility"] = 22)] =
    "decreasedGPFromAgility";
  ModifierID[(ModifierID["increasedDamageToBosses"] = 23)] =
    "increasedDamageToBosses";
  ModifierID[(ModifierID["increasedDamageToSlayerTasks"] = 24)] =
    "increasedDamageToSlayerTasks";
  ModifierID[(ModifierID["increasedDamageToSlayerAreaMonsters"] = 25)] =
    "increasedDamageToSlayerAreaMonsters";
  ModifierID[(ModifierID["increasedDamageToCombatAreaMonsters"] = 26)] =
    "increasedDamageToCombatAreaMonsters";
  ModifierID[(ModifierID["increasedDamageToDungeonMonsters"] = 27)] =
    "increasedDamageToDungeonMonsters";
  ModifierID[(ModifierID["increasedDamageToAllMonsters"] = 28)] =
    "increasedDamageToAllMonsters";
  ModifierID[(ModifierID["increasedAutoEatEfficiency"] = 29)] =
    "increasedAutoEatEfficiency";
  ModifierID[(ModifierID["increasedAutoEatThreshold"] = 30)] =
    "increasedAutoEatThreshold";
  ModifierID[(ModifierID["increasedAutoEatHPLimit"] = 31)] =
    "increasedAutoEatHPLimit";
  ModifierID[(ModifierID["increasedFoodHealingValue"] = 32)] =
    "increasedFoodHealingValue";
  ModifierID[(ModifierID["increasedChanceToPreservePrayerPoints"] = 33)] =
    "increasedChanceToPreservePrayerPoints";
  ModifierID[(ModifierID["increasedFlatPrayerCostReduction"] = 34)] =
    "increasedFlatPrayerCostReduction";
  ModifierID[(ModifierID["increasedMinAirSpellDmg"] = 35)] =
    "increasedMinAirSpellDmg";
  ModifierID[(ModifierID["increasedMinWaterSpellDmg"] = 36)] =
    "increasedMinWaterSpellDmg";
  ModifierID[(ModifierID["increasedMinEarthSpellDmg"] = 37)] =
    "increasedMinEarthSpellDmg";
  ModifierID[(ModifierID["increasedMinFireSpellDmg"] = 38)] =
    "increasedMinFireSpellDmg";
  ModifierID[(ModifierID["increasedAmmoPreservation"] = 39)] =
    "increasedAmmoPreservation";
  ModifierID[(ModifierID["increasedRunePreservation"] = 40)] =
    "increasedRunePreservation";
  ModifierID[(ModifierID["increasedHiddenSkillLevel"] = 41)] =
    "increasedHiddenSkillLevel";
  ModifierID[(ModifierID["decreasedAttackInterval"] = 42)] =
    "decreasedAttackInterval";
  ModifierID[(ModifierID["decreasedAttackIntervalPercent"] = 43)] =
    "decreasedAttackIntervalPercent";
  ModifierID[(ModifierID["increasedSlayerAreaEffectNegationFlat"] = 44)] =
    "increasedSlayerAreaEffectNegationFlat";
  ModifierID[(ModifierID["decreasedMonsterRespawnTimer"] = 45)] =
    "decreasedMonsterRespawnTimer";
  ModifierID[(ModifierID["decreasedGlobalAccuracy"] = 46)] =
    "decreasedGlobalAccuracy";
  ModifierID[(ModifierID["decreasedMeleeAccuracyBonus"] = 47)] =
    "decreasedMeleeAccuracyBonus";
  ModifierID[(ModifierID["decreasedMeleeMaxHit"] = 48)] =
    "decreasedMeleeMaxHit";
  ModifierID[(ModifierID["decreasedMeleeEvasion"] = 49)] =
    "decreasedMeleeEvasion";
  ModifierID[(ModifierID["decreasedRangedAccuracyBonus"] = 50)] =
    "decreasedRangedAccuracyBonus";
  ModifierID[(ModifierID["decreasedRangedMaxHit"] = 51)] =
    "decreasedRangedMaxHit";
  ModifierID[(ModifierID["decreasedRangedEvasion"] = 52)] =
    "decreasedRangedEvasion";
  ModifierID[(ModifierID["decreasedMagicAccuracyBonus"] = 53)] =
    "decreasedMagicAccuracyBonus";
  ModifierID[(ModifierID["decreasedMagicMaxHit"] = 54)] =
    "decreasedMagicMaxHit";
  ModifierID[(ModifierID["decreasedMagicEvasion"] = 55)] =
    "decreasedMagicEvasion";
  ModifierID[(ModifierID["decreasedMaxHitFlat"] = 56)] = "decreasedMaxHitFlat";
  ModifierID[(ModifierID["decreasedMaxHitPercent"] = 57)] =
    "decreasedMaxHitPercent";
  ModifierID[(ModifierID["decreasedDamageReduction"] = 58)] =
    "decreasedDamageReduction";
  ModifierID[(ModifierID["decreasedChanceToDoubleLootCombat"] = 59)] =
    "decreasedChanceToDoubleLootCombat";
  ModifierID[(ModifierID["decreasedSlayerCoins"] = 60)] =
    "decreasedSlayerCoins";
  ModifierID[(ModifierID["decreasedHPRegenFlat"] = 61)] =
    "decreasedHPRegenFlat";
  ModifierID[(ModifierID["decreasedGPGlobal"] = 62)] = "decreasedGPGlobal";
  ModifierID[(ModifierID["decreasedGPFromMonsters"] = 63)] =
    "decreasedGPFromMonsters";
  ModifierID[(ModifierID["decreasedGPFromMonstersFlat"] = 64)] =
    "decreasedGPFromMonstersFlat";
  ModifierID[(ModifierID["decreasedDamageToBosses"] = 65)] =
    "decreasedDamageToBosses";
  ModifierID[(ModifierID["decreasedDamageToSlayerTasks"] = 66)] =
    "decreasedDamageToSlayerTasks";
  ModifierID[(ModifierID["decreasedDamageToSlayerAreaMonsters"] = 67)] =
    "decreasedDamageToSlayerAreaMonsters";
  ModifierID[(ModifierID["decreasedDamageToCombatAreaMonsters"] = 68)] =
    "decreasedDamageToCombatAreaMonsters";
  ModifierID[(ModifierID["decreasedDamageToDungeonMonsters"] = 69)] =
    "decreasedDamageToDungeonMonsters";
  ModifierID[(ModifierID["decreasedDamageToAllMonsters"] = 70)] =
    "decreasedDamageToAllMonsters";
  ModifierID[(ModifierID["decreasedAutoEatEfficiency"] = 71)] =
    "decreasedAutoEatEfficiency";
  ModifierID[(ModifierID["decreasedAutoEatThreshold"] = 72)] =
    "decreasedAutoEatThreshold";
  ModifierID[(ModifierID["decreasedAutoEatHPLimit"] = 73)] =
    "decreasedAutoEatHPLimit";
  ModifierID[(ModifierID["decreasedFoodHealingValue"] = 74)] =
    "decreasedFoodHealingValue";
  ModifierID[(ModifierID["decreasedChanceToPreservePrayerPoints"] = 75)] =
    "decreasedChanceToPreservePrayerPoints";
  ModifierID[(ModifierID["decreasedFlatPrayerCostReduction"] = 76)] =
    "decreasedFlatPrayerCostReduction";
  ModifierID[(ModifierID["decreasedMinAirSpellDmg"] = 77)] =
    "decreasedMinAirSpellDmg";
  ModifierID[(ModifierID["decreasedMinWaterSpellDmg"] = 78)] =
    "decreasedMinWaterSpellDmg";
  ModifierID[(ModifierID["decreasedMinEarthSpellDmg"] = 79)] =
    "decreasedMinEarthSpellDmg";
  ModifierID[(ModifierID["decreasedMinFireSpellDmg"] = 80)] =
    "decreasedMinFireSpellDmg";
  ModifierID[(ModifierID["decreasedAmmoPreservation"] = 81)] =
    "decreasedAmmoPreservation";
  ModifierID[(ModifierID["decreasedRunePreservation"] = 82)] =
    "decreasedRunePreservation";
  ModifierID[(ModifierID["decreasedHiddenSkillLevel"] = 83)] =
    "decreasedHiddenSkillLevel";
  ModifierID[(ModifierID["increasedAttackInterval"] = 84)] =
    "increasedAttackInterval";
  ModifierID[(ModifierID["increasedAttackIntervalPercent"] = 85)] =
    "increasedAttackIntervalPercent";
  ModifierID[(ModifierID["increasedMonsterRespawnTimer"] = 86)] =
    "increasedMonsterRespawnTimer";
  ModifierID[(ModifierID["decreasedSlayerAreaEffectNegationFlat"] = 87)] =
    "decreasedSlayerAreaEffectNegationFlat";
  ModifierID[(ModifierID["increasedGPFromSales"] = 88)] =
    "increasedGPFromSales";
  ModifierID[(ModifierID["increasedBankSpace"] = 89)] = "increasedBankSpace";
  ModifierID[(ModifierID["increasedBankSpaceShop"] = 90)] =
    "increasedBankSpaceShop";
  ModifierID[(ModifierID["increasedChanceToPreservePotionCharge"] = 91)] =
    "increasedChanceToPreservePotionCharge";
  ModifierID[(ModifierID["decreasedGPFromSales"] = 92)] =
    "decreasedGPFromSales";
  ModifierID[(ModifierID["decreasedBankSpace"] = 93)] = "decreasedBankSpace";
  ModifierID[(ModifierID["decreasedBankSpaceShop"] = 94)] =
    "decreasedBankSpaceShop";
  ModifierID[(ModifierID["decreasedChanceToPreservePotionCharge"] = 95)] =
    "decreasedChanceToPreservePotionCharge";
  ModifierID[(ModifierID["decreasedSkillInterval"] = 96)] =
    "decreasedSkillInterval";
  ModifierID[(ModifierID["decreasedSkillIntervalPercent"] = 97)] =
    "decreasedSkillIntervalPercent";
  ModifierID[(ModifierID["increasedGlobalMasteryXP"] = 98)] =
    "increasedGlobalMasteryXP";
  ModifierID[(ModifierID["increasedGlobalSkillXP"] = 99)] =
    "increasedGlobalSkillXP";
  ModifierID[(ModifierID["decreasedGlobalSkillXP"] = 100)] =
    "decreasedGlobalSkillXP";
  ModifierID[(ModifierID["increasedMasteryXP"] = 101)] = "increasedMasteryXP";
  ModifierID[(ModifierID["increasedSkillXP"] = 102)] = "increasedSkillXP";
  ModifierID[(ModifierID["increasedMiningNodeHP"] = 103)] =
    "increasedMiningNodeHP";
  ModifierID[(ModifierID["increasedSkillInterval"] = 104)] =
    "increasedSkillInterval";
  ModifierID[(ModifierID["increasedSkillIntervalPercent"] = 105)] =
    "increasedSkillIntervalPercent";
  ModifierID[(ModifierID["decreasedGlobalMasteryXP"] = 106)] =
    "decreasedGlobalMasteryXP";
  ModifierID[(ModifierID["decreasedMasteryXP"] = 107)] = "decreasedMasteryXP";
  ModifierID[(ModifierID["decreasedSkillXP"] = 108)] = "decreasedSkillXP";
  ModifierID[(ModifierID["decreasedMiningNodeHP"] = 109)] =
    "decreasedMiningNodeHP";
  ModifierID[(ModifierID["decreasedGPFromThieving"] = 110)] =
    "decreasedGPFromThieving";
  ModifierID[(ModifierID["decreasedGPFromThievingFlat"] = 111)] =
    "decreasedGPFromThievingFlat";
  ModifierID[(ModifierID["dungeonEquipmentSwapping"] = 112)] =
    "dungeonEquipmentSwapping";
  ModifierID[(ModifierID["increasedEquipmentSets"] = 113)] =
    "increasedEquipmentSets";
  ModifierID[(ModifierID["autoSlayerUnlocked"] = 114)] = "autoSlayerUnlocked";
  ModifierID[(ModifierID["increasedTreeCutLimit"] = 115)] =
    "increasedTreeCutLimit";
  ModifierID[(ModifierID["increasedGlobalPreservationChance"] = 116)] =
    "increasedGlobalPreservationChance";
  ModifierID[(ModifierID["decreasedGlobalPreservationChance"] = 117)] =
    "decreasedGlobalPreservationChance";
  ModifierID[(ModifierID["increasedFarmingYield"] = 118)] =
    "increasedFarmingYield";
  ModifierID[(ModifierID["decreasedFarmingYield"] = 119)] =
    "decreasedFarmingYield";
  ModifierID[(ModifierID["increasedMaxHitpoints"] = 120)] =
    "increasedMaxHitpoints";
  ModifierID[(ModifierID["decreasedMaxHitpoints"] = 121)] =
    "decreasedMaxHitpoints";
  ModifierID[(ModifierID["increasedFlatMaxHitpoints"] = 122)] =
    "increasedFlatMaxHitpoints";
  ModifierID[(ModifierID["decreasedFlatMaxHitpoints"] = 123)] =
    "decreasedFlatMaxHitpoints";
  ModifierID[(ModifierID["increasedSlayerTaskLength"] = 124)] =
    "increasedSlayerTaskLength";
  ModifierID[(ModifierID["decreasedSlayerTaskLength"] = 125)] =
    "decreasedSlayerTaskLength";
  ModifierID[(ModifierID["increasedChanceToDoubleItemsSkill"] = 126)] =
    "increasedChanceToDoubleItemsSkill";
  ModifierID[(ModifierID["decreasedChanceToDoubleItemsSkill"] = 127)] =
    "decreasedChanceToDoubleItemsSkill";
  ModifierID[(ModifierID["increasedChanceToDoubleItemsGlobal"] = 128)] =
    "increasedChanceToDoubleItemsGlobal";
  ModifierID[(ModifierID["decreasedChanceToDoubleItemsGlobal"] = 129)] =
    "decreasedChanceToDoubleItemsGlobal";
  ModifierID[(ModifierID["increasedLifesteal"] = 130)] = "increasedLifesteal";
  ModifierID[(ModifierID["decreasedLifesteal"] = 131)] = "decreasedLifesteal";
  ModifierID[(ModifierID["increasedReflectDamage"] = 132)] =
    "increasedReflectDamage";
  ModifierID[(ModifierID["decreasedReflectDamage"] = 133)] =
    "decreasedReflectDamage";
  ModifierID[(ModifierID["increasedSkillPreservationChance"] = 134)] =
    "increasedSkillPreservationChance";
  ModifierID[(ModifierID["decreasedSkillPreservationChance"] = 135)] =
    "decreasedSkillPreservationChance";
  ModifierID[(ModifierID["increasedChanceToDoubleOres"] = 136)] =
    "increasedChanceToDoubleOres";
  ModifierID[(ModifierID["decreasedChanceToDoubleOres"] = 137)] =
    "decreasedChanceToDoubleOres";
  ModifierID[(ModifierID["increasedHitpointRegeneration"] = 138)] =
    "increasedHitpointRegeneration";
  ModifierID[(ModifierID["decreasedHitpointRegeneration"] = 139)] =
    "decreasedHitpointRegeneration";
  ModifierID[(ModifierID["golbinRaidWaveSkipCostReduction"] = 140)] =
    "golbinRaidWaveSkipCostReduction";
  ModifierID[(ModifierID["golbinRaidIncreasedMaximumAmmo"] = 141)] =
    "golbinRaidIncreasedMaximumAmmo";
  ModifierID[(ModifierID["golbinRaidIncreasedMaximumRunes"] = 142)] =
    "golbinRaidIncreasedMaximumRunes";
  ModifierID[(ModifierID["golbinRaidIncreasedMinimumFood"] = 143)] =
    "golbinRaidIncreasedMinimumFood";
  ModifierID[(ModifierID["golbinRaidIncreasedPrayerLevel"] = 144)] =
    "golbinRaidIncreasedPrayerLevel";
  ModifierID[(ModifierID["golbinRaidIncreasedPrayerPointsStart"] = 145)] =
    "golbinRaidIncreasedPrayerPointsStart";
  ModifierID[(ModifierID["golbinRaidIncreasedPrayerPointsWave"] = 146)] =
    "golbinRaidIncreasedPrayerPointsWave";
  ModifierID[(ModifierID["golbinRaidIncreasedStartingRuneCount"] = 147)] =
    "golbinRaidIncreasedStartingRuneCount";
  ModifierID[(ModifierID["golbinRaidPassiveSlotUnlocked"] = 148)] =
    "golbinRaidPassiveSlotUnlocked";
  ModifierID[(ModifierID["golbinRaidPrayerUnlocked"] = 149)] =
    "golbinRaidPrayerUnlocked";
  ModifierID[(ModifierID["golbinRaidStartingWeapon"] = 150)] =
    "golbinRaidStartingWeapon";
  ModifierID[(ModifierID["increasedMinHitBasedOnMaxHit"] = 151)] =
    "increasedMinHitBasedOnMaxHit";
  ModifierID[(ModifierID["decreasedMinHitBasedOnMaxHit"] = 152)] =
    "decreasedMinHitBasedOnMaxHit";
  ModifierID[(ModifierID["increasedPotionChargesFlat"] = 153)] =
    "increasedPotionChargesFlat";
  ModifierID[(ModifierID["decreasedPotionChargesFlat"] = 154)] =
    "decreasedPotionChargesFlat";
  ModifierID[(ModifierID["increasedBirdNestDropRate"] = 155)] =
    "increasedBirdNestDropRate";
  ModifierID[(ModifierID["decreasedBirdNestDropRate"] = 156)] =
    "decreasedBirdNestDropRate";
  ModifierID[(ModifierID["increasedChanceNoDamageMining"] = 157)] =
    "increasedChanceNoDamageMining";
  ModifierID[(ModifierID["decreasedChanceNoDamageMining"] = 158)] =
    "decreasedChanceNoDamageMining";
  ModifierID[(ModifierID["increasedSeeingGoldChance"] = 159)] =
    "increasedSeeingGoldChance";
  ModifierID[(ModifierID["decreasedSeeingGoldChance"] = 160)] =
    "decreasedSeeingGoldChance";
  ModifierID[(ModifierID["increasedChanceDoubleHarvest"] = 161)] =
    "increasedChanceDoubleHarvest";
  ModifierID[(ModifierID["decreasedChanceDoubleHarvest"] = 162)] =
    "decreasedChanceDoubleHarvest";
  ModifierID[(ModifierID["increasedChanceForElementalRune"] = 163)] =
    "increasedChanceForElementalRune";
  ModifierID[(ModifierID["decreasedChanceForElementalRune"] = 164)] =
    "decreasedChanceForElementalRune";
  ModifierID[(ModifierID["increasedElementalRuneGain"] = 165)] =
    "increasedElementalRuneGain";
  ModifierID[(ModifierID["decreasedElementalRuneGain"] = 166)] =
    "decreasedElementalRuneGain";
  ModifierID[(ModifierID["increasedChanceRandomPotionHerblore"] = 167)] =
    "increasedChanceRandomPotionHerblore";
  ModifierID[(ModifierID["decreasedChanceRandomPotionHerblore"] = 168)] =
    "decreasedChanceRandomPotionHerblore";
  ModifierID[(ModifierID["increasedAttackRolls"] = 169)] =
    "increasedAttackRolls";
  ModifierID[(ModifierID["decreasedAttackRolls"] = 170)] =
    "decreasedAttackRolls";
  ModifierID[(ModifierID["freeBonfires"] = 171)] = "freeBonfires";
  ModifierID[(ModifierID["increasedAltMagicSkillXP"] = 172)] =
    "increasedAltMagicSkillXP";
  ModifierID[(ModifierID["decreasedAltMagicSkillXP"] = 173)] =
    "decreasedAltMagicSkillXP";
  ModifierID[(ModifierID["increasedChanceToConvertSeedDrops"] = 174)] =
    "increasedChanceToConvertSeedDrops";
  ModifierID[(ModifierID["aprilFoolsIncreasedMovementSpeed"] = 175)] =
    "aprilFoolsIncreasedMovementSpeed";
  ModifierID[(ModifierID["aprilFoolsDecreasedMovementSpeed"] = 176)] =
    "aprilFoolsDecreasedMovementSpeed";
  ModifierID[(ModifierID["aprilFoolsIncreasedTeleportCost"] = 177)] =
    "aprilFoolsIncreasedTeleportCost";
  ModifierID[(ModifierID["aprilFoolsDecreasedTeleportCost"] = 178)] =
    "aprilFoolsDecreasedTeleportCost";
  ModifierID[(ModifierID["aprilFoolsIncreasedUpdateDelay"] = 179)] =
    "aprilFoolsIncreasedUpdateDelay";
  ModifierID[(ModifierID["aprilFoolsDecreasedUpdateDelay"] = 180)] =
    "aprilFoolsDecreasedUpdateDelay";
  ModifierID[(ModifierID["aprilFoolsIncreasedLemonGang"] = 181)] =
    "aprilFoolsIncreasedLemonGang";
  ModifierID[(ModifierID["aprilFoolsDecreasedLemonGang"] = 182)] =
    "aprilFoolsDecreasedLemonGang";
  ModifierID[(ModifierID["aprilFoolsIncreasedCarrotGang"] = 183)] =
    "aprilFoolsIncreasedCarrotGang";
  ModifierID[(ModifierID["aprilFoolsDecreasedCarrotGang"] = 184)] =
    "aprilFoolsDecreasedCarrotGang";
  ModifierID[(ModifierID["increasedGPOnEnemyHit"] = 185)] =
    "increasedGPOnEnemyHit";
  ModifierID[(ModifierID["decreasedGPOnEnemyHit"] = 186)] =
    "decreasedGPOnEnemyHit";
  ModifierID[(ModifierID["increasedAdditionalRunecraftCountRunes"] = 187)] =
    "increasedAdditionalRunecraftCountRunes";
  ModifierID[(ModifierID["decreasedAdditionalRunecraftCountRunes"] = 188)] =
    "decreasedAdditionalRunecraftCountRunes";
  ModifierID[(ModifierID["increasedGPFromMonstersFlatBasedOnEvasion"] = 189)] =
    "increasedGPFromMonstersFlatBasedOnEvasion";
  ModifierID[(ModifierID["increasedGPPerMeleeDamage"] = 190)] =
    "increasedGPPerMeleeDamage";
  ModifierID[(ModifierID["increasedGPPerRangedDamage"] = 191)] =
    "increasedGPPerRangedDamage";
  ModifierID[(ModifierID["increasedGPPerMagicDamage"] = 192)] =
    "increasedGPPerMagicDamage";
  ModifierID[(ModifierID["increasedGPFromSlayerTaskMonsters"] = 193)] =
    "increasedGPFromSlayerTaskMonsters";
  ModifierID[(ModifierID["increasedGPWhenHitBasedOnDR"] = 194)] =
    "increasedGPWhenHitBasedOnDR";
  ModifierID[(ModifierID["increasedGPOnRegenBasedOnHPGain"] = 195)] =
    "increasedGPOnRegenBasedOnHPGain";
  ModifierID[(ModifierID["increasedGPFromBurningMonsters"] = 196)] =
    "increasedGPFromBurningMonsters";
  ModifierID[(ModifierID["summoningSynergy_1_2"] = 197)] =
    "summoningSynergy_1_2";
  ModifierID[(ModifierID["increasedFlatMagicDefenceBonus"] = 198)] =
    "increasedFlatMagicDefenceBonus";
  ModifierID[(ModifierID["decreasedSlayerTaskMonsterAccuracy"] = 199)] =
    "decreasedSlayerTaskMonsterAccuracy";
  ModifierID[(ModifierID["increasedMeleeRangedDefenceBonusBasedOnDR"] = 200)] =
    "increasedMeleeRangedDefenceBonusBasedOnDR";
  ModifierID[(ModifierID["increasedHPRegenWhenEnemyHasMoreEvasion"] = 201)] =
    "increasedHPRegenWhenEnemyHasMoreEvasion";
  ModifierID[(ModifierID["summoningSynergy_1_15"] = 202)] =
    "summoningSynergy_1_15";
  ModifierID[(ModifierID["increasedSCfromLifesteal"] = 203)] =
    "increasedSCfromLifesteal";
  ModifierID[(ModifierID["increasedHealingOnAttackBasedOnDR"] = 204)] =
    "increasedHealingOnAttackBasedOnDR";
  ModifierID[(ModifierID["increasedSummoningAttackLifesteal"] = 205)] =
    "increasedSummoningAttackLifesteal";
  ModifierID[(ModifierID["increasedWoodcuttingGemChance"] = 206)] =
    "increasedWoodcuttingGemChance";
  ModifierID[(ModifierID["increasedBonusFishingSpecialChance"] = 207)] =
    "increasedBonusFishingSpecialChance";
  ModifierID[(ModifierID["summoningSynergy_3_9"] = 208)] =
    "summoningSynergy_3_9";
  ModifierID[(ModifierID["increasedRunecraftingStavePreservation"] = 209)] =
    "increasedRunecraftingStavePreservation";
  ModifierID[(ModifierID["summoningSynergy_Ent_Leprechaun"] = 210)] =
    "summoningSynergy_Ent_Leprechaun";
  ModifierID[(ModifierID["increasedWoodcuttingJewelryChance"] = 211)] =
    "increasedWoodcuttingJewelryChance";
  ModifierID[(ModifierID["summoningSynergy_3_17"] = 212)] =
    "summoningSynergy_3_17";
  ModifierID[(ModifierID["increasedMinimumBirdNestsWhenPotionActive"] = 213)] =
    "increasedMinimumBirdNestsWhenPotionActive";
  ModifierID[(ModifierID["summoningSynergy_3_19"] = 214)] =
    "summoningSynergy_3_19";
  ModifierID[(ModifierID["summoningSynergy_4_5"] = 215)] =
    "summoningSynergy_4_5";
  ModifierID[(ModifierID["decreasedCookingSuccessCap"] = 216)] =
    "decreasedCookingSuccessCap";
  ModifierID[(ModifierID["doubleRuneEssenceMining"] = 217)] =
    "doubleRuneEssenceMining";
  ModifierID[(ModifierID["summoningSynergy_Mole_Leprechaun"] = 218)] =
    "summoningSynergy_Mole_Leprechaun";
  ModifierID[(ModifierID["doubleSilverGoldMining"] = 219)] =
    "doubleSilverGoldMining";
  ModifierID[(ModifierID["increasedMiningBarChance"] = 220)] =
    "increasedMiningBarChance";
  ModifierID[(ModifierID["increasedMiningNodeHPWithPerfectSwing"] = 221)] =
    "increasedMiningNodeHPWithPerfectSwing";
  ModifierID[(ModifierID["summoningSynergy_4_19"] = 222)] =
    "summoningSynergy_4_19";
  ModifierID[(ModifierID["increasedFishingCookedChance"] = 223)] =
    "increasedFishingCookedChance";
  ModifierID[(ModifierID["increasedRunecraftingWaterComboRunes"] = 224)] =
    "increasedRunecraftingWaterComboRunes";
  ModifierID[(ModifierID["summoningSynergy_Octopus_Leprechaun"] = 225)] =
    "summoningSynergy_Octopus_Leprechaun";
  ModifierID[(ModifierID["increasedCraftingJewelryRandomGemChance"] = 226)] =
    "increasedCraftingJewelryRandomGemChance";
  ModifierID[(ModifierID["increasedSmithingDragonGearPreservation"] = 227)] =
    "increasedSmithingDragonGearPreservation";
  ModifierID[(ModifierID["increasedFishermansPotionCharges"] = 228)] =
    "increasedFishermansPotionCharges";
  ModifierID[(ModifierID["summoningSynergy_6_7"] = 229)] =
    "summoningSynergy_6_7";
  ModifierID[
    (ModifierID["increasedMagicMinHitBasedOnMaxHitSlayerTask"] = 230)
  ] = "increasedMagicMinHitBasedOnMaxHitSlayerTask";
  ModifierID[
    (ModifierID["increasedMeleeMaxHitBasedOnMaxHitSlayerTask"] = 231)
  ] = "increasedMeleeMaxHitBasedOnMaxHitSlayerTask";
  ModifierID[(ModifierID["summoningSynergy_6_13"] = 232)] =
    "summoningSynergy_6_13";
  ModifierID[(ModifierID["increasedFlatHPRegenBasedOnMeleeMaxHit"] = 233)] =
    "increasedFlatHPRegenBasedOnMeleeMaxHit";
  ModifierID[(ModifierID["summoningSynergy_6_15"] = 234)] =
    "summoningSynergy_6_15";
  ModifierID[(ModifierID["summoningSynergy_7_8"] = 235)] =
    "summoningSynergy_7_8";
  ModifierID[
    (ModifierID["increasedRangedMaxHitBasedOnMaxHitSlayerTask"] = 236)
  ] = "increasedRangedMaxHitBasedOnMaxHitSlayerTask";
  ModifierID[(ModifierID["summoningSynergy_7_13"] = 237)] =
    "summoningSynergy_7_13";
  ModifierID[(ModifierID["increasedFlatHPRegenBasedOnRangedMaxHit"] = 238)] =
    "increasedFlatHPRegenBasedOnRangedMaxHit";
  ModifierID[(ModifierID["increasedChanceToApplyBurnWithRanged"] = 239)] =
    "increasedChanceToApplyBurnWithRanged";
  ModifierID[
    (ModifierID["increasedSlayerCoinsPerMagicDamageSlayerTask"] = 240)
  ] = "increasedSlayerCoinsPerMagicDamageSlayerTask";
  ModifierID[(ModifierID["summoningSynergy_8_13"] = 241)] =
    "summoningSynergy_8_13";
  ModifierID[(ModifierID["increasedFlatHPRegenBasedOnMagicMaxHit"] = 242)] =
    "increasedFlatHPRegenBasedOnMagicMaxHit";
  ModifierID[(ModifierID["increasedRunecraftingEssencePreservation"] = 243)] =
    "increasedRunecraftingEssencePreservation";
  ModifierID[(ModifierID["thievingChefNoDamage"] = 244)] =
    "thievingChefNoDamage";
  ModifierID[(ModifierID["decreasedFlatCraftingDragonhideCost"] = 245)] =
    "decreasedFlatCraftingDragonhideCost";
  ModifierID[(ModifierID["summoningSynergy_9_17"] = 246)] =
    "summoningSynergy_9_17";
  ModifierID[(ModifierID["increasedGenerousCookPotionCharges"] = 247)] =
    "increasedGenerousCookPotionCharges";
  ModifierID[(ModifierID["summoningSynergy_9_19"] = 248)] =
    "summoningSynergy_9_19";
  ModifierID[(ModifierID["increasedRuneEssenceThievingMiner"] = 249)] =
    "increasedRuneEssenceThievingMiner";
  ModifierID[
    (ModifierID["increasedChanceToDoubleLeatherDragonhideCrafting"] = 250)
  ] = "increasedChanceToDoubleLeatherDragonhideCrafting";
  ModifierID[(ModifierID["summoningSynergy_10_17"] = 251)] =
    "summoningSynergy_10_17";
  ModifierID[(ModifierID["giveRandomComboRunesRunecrafting"] = 252)] =
    "giveRandomComboRunesRunecrafting";
  ModifierID[(ModifierID["increasedFireRunesWhenMakingElementalRunes"] = 253)] =
    "increasedFireRunesWhenMakingElementalRunes";
  ModifierID[(ModifierID["increasedThievingAutoSellPrice"] = 254)] =
    "increasedThievingAutoSellPrice";
  ModifierID[(ModifierID["increasedRandomBarChanceThievingMiner"] = 255)] =
    "increasedRandomBarChanceThievingMiner";
  ModifierID[(ModifierID["increasedHerbSackChanceThievingFarmer"] = 256)] =
    "increasedHerbSackChanceThievingFarmer";
  ModifierID[(ModifierID["summoningSynergy_Leprechaun_Devil"] = 257)] =
    "summoningSynergy_Leprechaun_Devil";
  ModifierID[(ModifierID["increasedDamageReductionAgainstSlayerTasks"] = 258)] =
    "increasedDamageReductionAgainstSlayerTasks";
  ModifierID[
    (ModifierID["increasedHitpointRegenerationAgainstSlayerTasks"] = 259)
  ] = "increasedHitpointRegenerationAgainstSlayerTasks";
  ModifierID[(ModifierID["decreasedDragonBreathDamage"] = 260)] =
    "decreasedDragonBreathDamage";
  ModifierID[(ModifierID["summoningSynergy_13_14"] = 261)] =
    "summoningSynergy_13_14";
  ModifierID[(ModifierID["increasedCraftingJewelryPreservation"] = 262)] =
    "increasedCraftingJewelryPreservation";
  ModifierID[(ModifierID["increasedCraftingPotionCharges"] = 263)] =
    "increasedCraftingPotionCharges";
  ModifierID[(ModifierID["increasedFiremakingLogGP"] = 264)] =
    "increasedFiremakingLogGP";
  ModifierID[(ModifierID["doubleSilverGoldSmithingWithSeeingGold"] = 265)] =
    "doubleSilverGoldSmithingWithSeeingGold";
  ModifierID[(ModifierID["decreasedFlatSmithingCoalCost"] = 266)] =
    "decreasedFlatSmithingCoalCost";
  ModifierID[(ModifierID["summoningSynergy_Bear_Devil"] = 267)] =
    "summoningSynergy_Bear_Devil";
  ModifierID[(ModifierID["increasedFlatReflectDamage"] = 268)] =
    "increasedFlatReflectDamage";
  ModifierID[(ModifierID["decreasedFlatReflectDamage"] = 269)] =
    "decreasedFlatReflectDamage";
  ModifierID[(ModifierID["increasedRolledReflectDamage"] = 270)] =
    "increasedRolledReflectDamage";
  ModifierID[(ModifierID["decreasedRolledReflectDamage"] = 271)] =
    "decreasedRolledReflectDamage";
  ModifierID[(ModifierID["increasedFlatMinHit"] = 272)] = "increasedFlatMinHit";
  ModifierID[(ModifierID["decreasedFlatMinHit"] = 273)] = "decreasedFlatMinHit";
  ModifierID[(ModifierID["increasedConfusion"] = 274)] = "increasedConfusion";
  ModifierID[(ModifierID["increasedDecay"] = 275)] = "increasedDecay";
  ModifierID[(ModifierID["increasedDamageTaken"] = 276)] =
    "increasedDamageTaken";
  ModifierID[(ModifierID["decreasedDamageTaken"] = 277)] =
    "decreasedDamageTaken";
  ModifierID[(ModifierID["increasedGlobalEvasion"] = 278)] =
    "increasedGlobalEvasion";
  ModifierID[(ModifierID["decreasedGlobalEvasion"] = 279)] =
    "decreasedGlobalEvasion";
  ModifierID[(ModifierID["increasedChanceAdditionalSkillResource"] = 280)] =
    "increasedChanceAdditionalSkillResource";
  ModifierID[(ModifierID["decreasedChanceAdditionalSkillResource"] = 281)] =
    "decreasedChanceAdditionalSkillResource";
  ModifierID[(ModifierID["increasedMeleeStrengthBonus"] = 282)] =
    "increasedMeleeStrengthBonus";
  ModifierID[(ModifierID["increasedRangedStrengthBonus"] = 283)] =
    "increasedRangedStrengthBonus";
  ModifierID[(ModifierID["increasedMagicDamageBonus"] = 284)] =
    "increasedMagicDamageBonus";
  ModifierID[(ModifierID["decreasedMeleeStrengthBonus"] = 285)] =
    "decreasedMeleeStrengthBonus";
  ModifierID[(ModifierID["decreasedRangedStrengthBonus"] = 286)] =
    "decreasedRangedStrengthBonus";
  ModifierID[(ModifierID["decreasedMagicDamageBonus"] = 287)] =
    "decreasedMagicDamageBonus";
  ModifierID[(ModifierID["increasedMaxAirSpellDmg"] = 288)] =
    "increasedMaxAirSpellDmg";
  ModifierID[(ModifierID["increasedMaxWaterSpellDmg"] = 289)] =
    "increasedMaxWaterSpellDmg";
  ModifierID[(ModifierID["increasedMaxEarthSpellDmg"] = 290)] =
    "increasedMaxEarthSpellDmg";
  ModifierID[(ModifierID["increasedMaxFireSpellDmg"] = 291)] =
    "increasedMaxFireSpellDmg";
  ModifierID[(ModifierID["decreasedMaxAirSpellDmg"] = 292)] =
    "decreasedMaxAirSpellDmg";
  ModifierID[(ModifierID["decreasedMaxWaterSpellDmg"] = 293)] =
    "decreasedMaxWaterSpellDmg";
  ModifierID[(ModifierID["decreasedMaxEarthSpellDmg"] = 294)] =
    "decreasedMaxEarthSpellDmg";
  ModifierID[(ModifierID["decreasedMaxFireSpellDmg"] = 295)] =
    "decreasedMaxFireSpellDmg";
  ModifierID[(ModifierID["increasedAgilityObstacleCost"] = 296)] =
    "increasedAgilityObstacleCost";
  ModifierID[(ModifierID["decreasedAgilityObstacleCost"] = 297)] =
    "decreasedAgilityObstacleCost";
  ModifierID[(ModifierID["decreasedSecondaryFoodBurnChance"] = 298)] =
    "decreasedSecondaryFoodBurnChance";
  ModifierID[(ModifierID["freeCompost"] = 299)] = "freeCompost";
  ModifierID[(ModifierID["increasedCompostPreservationChance"] = 300)] =
    "increasedCompostPreservationChance";
  ModifierID[(ModifierID["increasedOffItemChance"] = 301)] =
    "increasedOffItemChance";
  ModifierID[(ModifierID["increasedFiremakingCoalChance"] = 302)] =
    "increasedFiremakingCoalChance";
  ModifierID[(ModifierID["doubleItemsSkill"] = 303)] = "doubleItemsSkill";
  ModifierID[(ModifierID["increasedMiningGemChance"] = 304)] =
    "increasedMiningGemChance";
  ModifierID[(ModifierID["doubleOresMining"] = 305)] = "doubleOresMining";
  ModifierID[(ModifierID["increasedBonusCoalMining"] = 306)] =
    "increasedBonusCoalMining";
  ModifierID[(ModifierID["decreasedSmithingCoalCost"] = 307)] =
    "decreasedSmithingCoalCost";
  ModifierID[(ModifierID["allowSignetDrops"] = 308)] = "allowSignetDrops";
  ModifierID[(ModifierID["bonusCoalOnDungeonCompletion"] = 309)] =
    "bonusCoalOnDungeonCompletion";
  ModifierID[(ModifierID["increasedMasteryPoolProgress"] = 310)] =
    "increasedMasteryPoolProgress";
  ModifierID[(ModifierID["increasedMeleeLifesteal"] = 311)] =
    "increasedMeleeLifesteal";
  ModifierID[(ModifierID["increasedRangedLifesteal"] = 312)] =
    "increasedRangedLifesteal";
  ModifierID[(ModifierID["increasedMagicLifesteal"] = 313)] =
    "increasedMagicLifesteal";
  ModifierID[(ModifierID["increasedBleedLifesteal"] = 314)] =
    "increasedBleedLifesteal";
  ModifierID[(ModifierID["increasedBurnLifesteal"] = 315)] =
    "increasedBurnLifesteal";
  ModifierID[(ModifierID["increasedPoisonLifesteal"] = 316)] =
    "increasedPoisonLifesteal";
  ModifierID[(ModifierID["decreasedMeleeLifesteal"] = 317)] =
    "decreasedMeleeLifesteal";
  ModifierID[(ModifierID["decreasedRangedLifesteal"] = 318)] =
    "decreasedRangedLifesteal";
  ModifierID[(ModifierID["decreasedMagicLifesteal"] = 319)] =
    "decreasedMagicLifesteal";
  ModifierID[(ModifierID["decreasedBleedLifesteal"] = 320)] =
    "decreasedBleedLifesteal";
  ModifierID[(ModifierID["decreasedBurnLifesteal"] = 321)] =
    "decreasedBurnLifesteal";
  ModifierID[(ModifierID["decreasedPoisonLifesteal"] = 322)] =
    "decreasedPoisonLifesteal";
  ModifierID[(ModifierID["increasedMeleeCritChance"] = 323)] =
    "increasedMeleeCritChance";
  ModifierID[(ModifierID["decreasedMeleeCritChance"] = 324)] =
    "decreasedMeleeCritChance";
  ModifierID[(ModifierID["increasedRangedCritChance"] = 325)] =
    "increasedRangedCritChance";
  ModifierID[(ModifierID["decreasedRangedCritChance"] = 326)] =
    "decreasedRangedCritChance";
  ModifierID[(ModifierID["increasedMagicCritChance"] = 327)] =
    "increasedMagicCritChance";
  ModifierID[(ModifierID["decreasedMagicCritChance"] = 328)] =
    "decreasedMagicCritChance";
  ModifierID[(ModifierID["meleeProtection"] = 329)] = "meleeProtection";
  ModifierID[(ModifierID["rangedProtection"] = 330)] = "rangedProtection";
  ModifierID[(ModifierID["magicProtection"] = 331)] = "magicProtection";
  ModifierID[(ModifierID["increasedRuneProvision"] = 332)] =
    "increasedRuneProvision";
  ModifierID[(ModifierID["bypassSlayerItems"] = 333)] = "bypassSlayerItems";
  ModifierID[(ModifierID["curseImmunity"] = 334)] = "curseImmunity";
  ModifierID[(ModifierID["increasedDamageReductionPercent"] = 335)] =
    "increasedDamageReductionPercent";
  ModifierID[(ModifierID["decreasedDamageReductionPercent"] = 336)] =
    "decreasedDamageReductionPercent";
  ModifierID[(ModifierID["itemProtection"] = 337)] = "itemProtection";
  ModifierID[(ModifierID["increasedRedemptionThreshold"] = 338)] =
    "increasedRedemptionThreshold";
  ModifierID[(ModifierID["increasedRedemptionPercent"] = 339)] =
    "increasedRedemptionPercent";
  ModifierID[(ModifierID["autoLooting"] = 340)] = "autoLooting";
  ModifierID[(ModifierID["autoBurying"] = 341)] = "autoBurying";
  ModifierID[(ModifierID["freeProtectItem"] = 342)] = "freeProtectItem";
  ModifierID[(ModifierID["stunImmunity"] = 343)] = "stunImmunity";
  ModifierID[(ModifierID["sleepImmunity"] = 344)] = "sleepImmunity";
  ModifierID[(ModifierID["debuffImmunity"] = 345)] = "debuffImmunity";
  ModifierID[(ModifierID["burnImmunity"] = 346)] = "burnImmunity";
  ModifierID[(ModifierID["poisonImmunity"] = 347)] = "poisonImmunity";
  ModifierID[(ModifierID["bleedImmunity"] = 348)] = "bleedImmunity";
  ModifierID[(ModifierID["increasedRebirthChance"] = 349)] =
    "increasedRebirthChance";
  ModifierID[(ModifierID["increasedChanceToApplyBurn"] = 350)] =
    "increasedChanceToApplyBurn";
  ModifierID[(ModifierID["decreasedChanceToApplyBurn"] = 351)] =
    "decreasedChanceToApplyBurn";
  ModifierID[(ModifierID["increasedSummoningShardCost"] = 352)] =
    "increasedSummoningShardCost";
  ModifierID[(ModifierID["decreasedSummoningShardCost"] = 353)] =
    "decreasedSummoningShardCost";
  ModifierID[(ModifierID["increasedSummoningCreationCharges"] = 354)] =
    "increasedSummoningCreationCharges";
  ModifierID[(ModifierID["decreasedSummoningCreationCharges"] = 355)] =
    "decreasedSummoningCreationCharges";
  ModifierID[(ModifierID["increasedSummoningChargePreservation"] = 356)] =
    "increasedSummoningChargePreservation";
  ModifierID[(ModifierID["decreasedSummoningChargePreservation"] = 357)] =
    "decreasedSummoningChargePreservation";
  ModifierID[(ModifierID["decreasedPrayerCost"] = 358)] = "decreasedPrayerCost";
  ModifierID[(ModifierID["increasedPrayerCost"] = 359)] = "increasedPrayerCost";
  ModifierID[(ModifierID["increasedGPMultiplierPer1MGP"] = 360)] =
    "increasedGPMultiplierPer1MGP";
  ModifierID[(ModifierID["increasedGPMultiplierCap"] = 361)] =
    "increasedGPMultiplierCap";
  ModifierID[(ModifierID["increasedGPMultiplierMin"] = 362)] =
    "increasedGPMultiplierMin";
  ModifierID[(ModifierID["allowAttackAugmentingMagic"] = 363)] =
    "allowAttackAugmentingMagic";
  ModifierID[(ModifierID["increasedMeleeStunThreshold"] = 364)] =
    "increasedMeleeStunThreshold";
  ModifierID[(ModifierID["autoEquipFoodUnlocked"] = 365)] =
    "autoEquipFoodUnlocked";
  ModifierID[(ModifierID["autoSwapFoodUnlocked"] = 366)] =
    "autoSwapFoodUnlocked";
  ModifierID[(ModifierID["increasedChanceSuccessfulCook"] = 367)] =
    "increasedChanceSuccessfulCook";
  ModifierID[(ModifierID["decreasedChanceSuccessfulCook"] = 368)] =
    "decreasedChanceSuccessfulCook";
  ModifierID[(ModifierID["increasedChancePerfectCookGlobal"] = 369)] =
    "increasedChancePerfectCookGlobal";
  ModifierID[(ModifierID["decreasedChancePerfectCookGlobal"] = 370)] =
    "decreasedChancePerfectCookGlobal";
  ModifierID[(ModifierID["increasedChancePerfectCookFire"] = 371)] =
    "increasedChancePerfectCookFire";
  ModifierID[(ModifierID["decreasedChancePerfectCookFire"] = 372)] =
    "decreasedChancePerfectCookFire";
  ModifierID[(ModifierID["increasedChancePerfectCookFurnace"] = 373)] =
    "increasedChancePerfectCookFurnace";
  ModifierID[(ModifierID["decreasedChancePerfectCookFurnace"] = 374)] =
    "decreasedChancePerfectCookFurnace";
  ModifierID[(ModifierID["increasedChancePerfectCookPot"] = 375)] =
    "increasedChancePerfectCookPot";
  ModifierID[(ModifierID["decreasedChancePerfectCookPot"] = 376)] =
    "decreasedChancePerfectCookPot";
  ModifierID[(ModifierID["increasedThievingStealth"] = 377)] =
    "increasedThievingStealth";
  ModifierID[(ModifierID["decreasedThievingStealth"] = 378)] =
    "decreasedThievingStealth";
  ModifierID[(ModifierID["increasedAltMagicRunePreservation"] = 379)] =
    "increasedAltMagicRunePreservation";
  ModifierID[(ModifierID["decreasedAltMagicRunePreservation"] = 380)] =
    "decreasedAltMagicRunePreservation";
  ModifierID[(ModifierID["increasedMinThievingGP"] = 381)] =
    "increasedMinThievingGP";
  ModifierID[(ModifierID["decreasedMinThievingGP"] = 382)] =
    "decreasedMinThievingGP";
  ModifierID[(ModifierID["increasedFishingSpecialChance"] = 383)] =
    "increasedFishingSpecialChance";
  ModifierID[(ModifierID["decreasedFishingSpecialChance"] = 384)] =
    "decreasedFishingSpecialChance";
  ModifierID[(ModifierID["decreasedAllotmentSeedCost"] = 385)] =
    "decreasedAllotmentSeedCost";
  ModifierID[(ModifierID["increasedAllotmentSeedCost"] = 386)] =
    "increasedAllotmentSeedCost";
  ModifierID[(ModifierID["increasedFrostburn"] = 387)] = "increasedFrostburn";
  ModifierID[(ModifierID["increasedSummoningMaxHit"] = 388)] =
    "increasedSummoningMaxHit";
  ModifierID[(ModifierID["decreasedSummoningMaxHit"] = 389)] =
    "decreasedSummoningMaxHit";
  ModifierID[(ModifierID["masteryToken"] = 390)] = "masteryToken";
  ModifierID[(ModifierID["increasedChanceForDiamondFiremaking"] = 391)] =
    "increasedChanceForDiamondFiremaking";
  ModifierID[(ModifierID["decreasedChanceForDiamondFiremaking"] = 392)] =
    "decreasedChanceForDiamondFiremaking";
  ModifierID[(ModifierID["increasedAfflictionChance"] = 393)] =
    "increasedAfflictionChance";
  ModifierID[(ModifierID["otherStyleImmunity"] = 394)] = "otherStyleImmunity";
  ModifierID[(ModifierID["meleeImmunity"] = 395)] = "meleeImmunity";
  ModifierID[(ModifierID["rangedImmunity"] = 396)] = "rangedImmunity";
  ModifierID[(ModifierID["magicImmunity"] = 397)] = "magicImmunity";
  ModifierID[(ModifierID["slowImmunity"] = 398)] = "slowImmunity";
  ModifierID[(ModifierID["increasedEndOfTurnHealing2"] = 399)] =
    "increasedEndOfTurnHealing2";
  ModifierID[(ModifierID["increasedEndOfTurnHealing3"] = 400)] =
    "increasedEndOfTurnHealing3";
  ModifierID[(ModifierID["increasedEndOfTurnHealing5"] = 401)] =
    "increasedEndOfTurnHealing5";
  ModifierID[(ModifierID["increasedChanceToApplyPoison"] = 402)] =
    "increasedChanceToApplyPoison";
  ModifierID[(ModifierID["increasedChanceToApplyFrostburn"] = 403)] =
    "increasedChanceToApplyFrostburn";
  ModifierID[(ModifierID["increasedMeleeStunChance"] = 404)] =
    "increasedMeleeStunChance";
  ModifierID[(ModifierID["increasedElementalEffectChance"] = 405)] =
    "increasedElementalEffectChance";
  ModifierID[(ModifierID["frostBurnImmunity"] = 406)] = "frostBurnImmunity";
  ModifierID[(ModifierID["increasedPoisonReflectChance"] = 407)] =
    "increasedPoisonReflectChance";
  ModifierID[(ModifierID["increasedBleedReflectChance"] = 408)] =
    "increasedBleedReflectChance";
  ModifierID[(ModifierID["increasedMinNatureSpellDamageBasedOnMaxHit"] = 409)] =
    "increasedMinNatureSpellDamageBasedOnMaxHit";
  ModifierID[(ModifierID["increasedTotalBleedDamage"] = 410)] =
    "increasedTotalBleedDamage";
  ModifierID[(ModifierID["increasedChanceToIncreaseStunDuration"] = 411)] =
    "increasedChanceToIncreaseStunDuration";
  ModifierID[(ModifierID["increasedSurgeSpellAccuracy"] = 412)] =
    "increasedSurgeSpellAccuracy";
  ModifierID[(ModifierID["increasedSurgeSpellMaxHit"] = 413)] =
    "increasedSurgeSpellMaxHit";
  ModifierID[(ModifierID["decreasedRegenerationInterval"] = 414)] =
    "decreasedRegenerationInterval";
  ModifierID[(ModifierID["increasedOnHitSlowMagnitude"] = 415)] =
    "increasedOnHitSlowMagnitude";
  ModifierID[(ModifierID["increasedNonMagicPoisonChance"] = 416)] =
    "increasedNonMagicPoisonChance";
  ModifierID[(ModifierID["globalEvasionHPScaling"] = 417)] =
    "globalEvasionHPScaling";
  ModifierID[(ModifierID["increasedChanceToPreserveFood"] = 418)] =
    "increasedChanceToPreserveFood";
  ModifierID[(ModifierID["allowLootContainerStacking"] = 419)] =
    "allowLootContainerStacking";
  ModifierID[(ModifierID["infiniteLootContainer"] = 420)] =
    "infiniteLootContainer";
  ModifierID[(ModifierID["increasedBaseStardustDropQty"] = 421)] =
    "increasedBaseStardustDropQty";
  ModifierID[(ModifierID["increasedGPFromFiremaking"] = 422)] =
    "increasedGPFromFiremaking";
  ModifierID[(ModifierID["decreasedGPFromFiremaking"] = 423)] =
    "decreasedGPFromFiremaking";
  ModifierID[(ModifierID["increasedWoodcuttingXPAddedAsFiremakingXP"] = 424)] =
    "increasedWoodcuttingXPAddedAsFiremakingXP";
  ModifierID[(ModifierID["decreasedWoodcuttingXPAddedAsFiremakingXP"] = 425)] =
    "decreasedWoodcuttingXPAddedAsFiremakingXP";
  ModifierID[(ModifierID["increasedChanceForOneExtraOre"] = 426)] =
    "increasedChanceForOneExtraOre";
  ModifierID[(ModifierID["decreasedChanceForOneExtraOre"] = 427)] =
    "decreasedChanceForOneExtraOre";
  ModifierID[(ModifierID["increasedChanceForQualitySuperiorGem"] = 428)] =
    "increasedChanceForQualitySuperiorGem";
  ModifierID[(ModifierID["decreasedChanceForQualitySuperiorGem"] = 429)] =
    "decreasedChanceForQualitySuperiorGem";
  ModifierID[(ModifierID["increasedMeteoriteOre"] = 430)] =
    "increasedMeteoriteOre";
  ModifierID[(ModifierID["increasedChanceForAshInWoodcutting"] = 431)] =
    "increasedChanceForAshInWoodcutting";
  ModifierID[(ModifierID["decreasedChanceForAshInWoodcutting"] = 432)] =
    "decreasedChanceForAshInWoodcutting";
  ModifierID[(ModifierID["increasedChanceForAshInFiremaking"] = 433)] =
    "increasedChanceForAshInFiremaking";
  ModifierID[(ModifierID["decreasedChanceForAshInFiremaking"] = 434)] =
    "decreasedChanceForAshInFiremaking";
  ModifierID[(ModifierID["increasedChanceForStardustInFiremaking"] = 435)] =
    "increasedChanceForStardustInFiremaking";
  ModifierID[(ModifierID["decreasedChanceForStardustInFiremaking"] = 436)] =
    "decreasedChanceForStardustInFiremaking";
  ModifierID[(ModifierID["increasedChanceForOneExtraFish"] = 437)] =
    "increasedChanceForOneExtraFish";
  ModifierID[(ModifierID["decreasedChanceForOneExtraFish"] = 438)] =
    "decreasedChanceForOneExtraFish";
  ModifierID[(ModifierID["doubleBoneDrops"] = 439)] = "doubleBoneDrops";
  ModifierID[(ModifierID["increasedPrayerPointsWhenHit"] = 440)] =
    "increasedPrayerPointsWhenHit";
  ModifierID[(ModifierID["doubleLogProduction"] = 441)] = "doubleLogProduction";
  ModifierID[
    (ModifierID["increasedFlatMeleeAccuracyBonusPerAttackInterval"] = 442)
  ] = "increasedFlatMeleeAccuracyBonusPerAttackInterval";
  ModifierID[
    (ModifierID["decreasedFlatMeleeAccuracyBonusPerAttackInterval"] = 443)
  ] = "decreasedFlatMeleeAccuracyBonusPerAttackInterval";
  ModifierID[
    (ModifierID["increasedFlatMeleeStrengthBonusPerAttackInterval"] = 444)
  ] = "increasedFlatMeleeStrengthBonusPerAttackInterval";
  ModifierID[
    (ModifierID["decreasedFlatMeleeStrengthBonusPerAttackInterval"] = 445)
  ] = "decreasedFlatMeleeStrengthBonusPerAttackInterval";
  ModifierID[
    (ModifierID["increasedFlatRangedAccuracyBonusPerAttackInterval"] = 446)
  ] = "increasedFlatRangedAccuracyBonusPerAttackInterval";
  ModifierID[
    (ModifierID["decreasedFlatRangedAccuracyBonusPerAttackInterval"] = 447)
  ] = "decreasedFlatRangedAccuracyBonusPerAttackInterval";
  ModifierID[
    (ModifierID["increasedFlatRangedStrengthBonusPerAttackInterval"] = 448)
  ] = "increasedFlatRangedStrengthBonusPerAttackInterval";
  ModifierID[
    (ModifierID["decreasedFlatRangedStrengthBonusPerAttackInterval"] = 449)
  ] = "decreasedFlatRangedStrengthBonusPerAttackInterval";
  ModifierID[
    (ModifierID["increasedFlatMagicAccuracyBonusPerAttackInterval"] = 450)
  ] = "increasedFlatMagicAccuracyBonusPerAttackInterval";
  ModifierID[
    (ModifierID["decreasedFlatMagicAccuracyBonusPerAttackInterval"] = 451)
  ] = "decreasedFlatMagicAccuracyBonusPerAttackInterval";
  ModifierID[(ModifierID["increasedDamageReductionAgainstMelee"] = 452)] =
    "increasedDamageReductionAgainstMelee";
  ModifierID[(ModifierID["decreasedDamageReductionAgainstMelee"] = 453)] =
    "decreasedDamageReductionAgainstMelee";
  ModifierID[(ModifierID["increasedDamageReductionAgainstRanged"] = 454)] =
    "increasedDamageReductionAgainstRanged";
  ModifierID[(ModifierID["decreasedDamageReductionAgainstRanged"] = 455)] =
    "decreasedDamageReductionAgainstRanged";
  ModifierID[(ModifierID["increasedDamageReductionAgainstMagic"] = 456)] =
    "increasedDamageReductionAgainstMagic";
  ModifierID[(ModifierID["decreasedDamageReductionAgainstMagic"] = 457)] =
    "decreasedDamageReductionAgainstMagic";
  ModifierID[(ModifierID["increasedDamageReductionWithMagic2HWeapon"] = 458)] =
    "increasedDamageReductionWithMagic2HWeapon";
  ModifierID[(ModifierID["decreasedDamageReductionWithMagic2HWeapon"] = 459)] =
    "decreasedDamageReductionWithMagic2HWeapon";
  ModifierID[
    (ModifierID["increasedMaxHitPercentBasedOnEnemyDamageReduction"] = 460)
  ] = "increasedMaxHitPercentBasedOnEnemyDamageReduction";
  ModifierID[
    (ModifierID["decreasedMaxHitPercentBasedOnEnemyDamageReduction"] = 461)
  ] = "decreasedMaxHitPercentBasedOnEnemyDamageReduction";
  ModifierID[(ModifierID["increasedMeleeMaxHitBonusAgainstRanged"] = 462)] =
    "increasedMeleeMaxHitBonusAgainstRanged";
  ModifierID[(ModifierID["decreasedMeleeMaxHitBonusAgainstRanged"] = 463)] =
    "decreasedMeleeMaxHitBonusAgainstRanged";
  ModifierID[(ModifierID["increasedRangedMaxHitBonusAgainstMagic"] = 464)] =
    "increasedRangedMaxHitBonusAgainstMagic";
  ModifierID[(ModifierID["decreasedRangedMaxHitBonusAgainstMagic"] = 465)] =
    "decreasedRangedMaxHitBonusAgainstMagic";
  ModifierID[(ModifierID["increasedMagicMaxHitBonusAgainstMelee"] = 466)] =
    "increasedMagicMaxHitBonusAgainstMelee";
  ModifierID[(ModifierID["decreasedMagicMaxHitBonusAgainstMelee"] = 467)] =
    "decreasedMagicMaxHitBonusAgainstMelee";
  ModifierID[
    (ModifierID["gainSlayerCoinsBasedOnEnemyCombatLevelMelee"] = 468)
  ] = "gainSlayerCoinsBasedOnEnemyCombatLevelMelee";
  ModifierID[
    (ModifierID["gainSlayerCoinsBasedOnEnemyCombatLevelRanged"] = 469)
  ] = "gainSlayerCoinsBasedOnEnemyCombatLevelRanged";
  ModifierID[
    (ModifierID["gainSlayerCoinsBasedOnEnemyCombatLevelMagic"] = 470)
  ] = "gainSlayerCoinsBasedOnEnemyCombatLevelMagic";
  ModifierID[(ModifierID["increasedDamageReductionAgainstBosses"] = 471)] =
    "increasedDamageReductionAgainstBosses";
  ModifierID[(ModifierID["decreasedDamageReductionAgainstBosses"] = 472)] =
    "decreasedDamageReductionAgainstBosses";
  ModifierID[(ModifierID["increasedChanceDoubleSlayerTaskKill"] = 473)] =
    "increasedChanceDoubleSlayerTaskKill";
  ModifierID[(ModifierID["decreasedChanceDoubleSlayerTaskKill"] = 474)] =
    "decreasedChanceDoubleSlayerTaskKill";
  ModifierID[(ModifierID["increasedDamageTakenAddedAsPrayerPoints"] = 475)] =
    "increasedDamageTakenAddedAsPrayerPoints";
  ModifierID[(ModifierID["decreasedDamageTakenAddedAsPrayerPoints"] = 476)] =
    "decreasedDamageTakenAddedAsPrayerPoints";
  ModifierID[(ModifierID["globalAccuracyHPScaling"] = 477)] =
    "globalAccuracyHPScaling";
  ModifierID[(ModifierID["increasedGPFromNegativeObstacles"] = 478)] =
    "increasedGPFromNegativeObstacles";
  ModifierID[(ModifierID["decreasedGPFromNegativeObstacles"] = 479)] =
    "decreasedGPFromNegativeObstacles";
  ModifierID[(ModifierID["increasedXPFromNegativeObstacles"] = 480)] =
    "increasedXPFromNegativeObstacles";
  ModifierID[(ModifierID["decreasedXPFromNegativeObstacles"] = 481)] =
    "decreasedXPFromNegativeObstacles";
  ModifierID[(ModifierID["increasedMasteryXPFromNegativeObstacles"] = 482)] =
    "increasedMasteryXPFromNegativeObstacles";
  ModifierID[(ModifierID["decreasedMasteryXPFromNegativeObstacles"] = 483)] =
    "decreasedMasteryXPFromNegativeObstacles";
  ModifierID[(ModifierID["increasedChanceGoldenStardust"] = 484)] =
    "increasedChanceGoldenStardust";
  ModifierID[(ModifierID["decreasedChanceGoldenStardust"] = 485)] =
    "decreasedChanceGoldenStardust";
  ModifierID[(ModifierID["decreasedEnemyDamageReduction"] = 486)] =
    "decreasedEnemyDamageReduction";
  ModifierID[(ModifierID["increasedEnemyDamageReduction"] = 487)] =
    "increasedEnemyDamageReduction";
  ModifierID[(ModifierID["increasedChanceStardust"] = 488)] =
    "increasedChanceStardust";
  ModifierID[(ModifierID["decreasedChanceStardust"] = 489)] =
    "decreasedChanceStardust";
  ModifierID[(ModifierID["decreasedThievingStunIntervalPercent"] = 490)] =
    "decreasedThievingStunIntervalPercent";
  ModifierID[(ModifierID["increasedThievingStunIntervalPercent"] = 491)] =
    "increasedThievingStunIntervalPercent";
  ModifierID[(ModifierID["decreasedGlobalSkillIntervalPercent"] = 492)] =
    "decreasedGlobalSkillIntervalPercent";
  ModifierID[(ModifierID["increasedGlobalSkillIntervalPercent"] = 493)] =
    "increasedGlobalSkillIntervalPercent";
  ModifierID[(ModifierID["increasedGlobalStunChance"] = 494)] =
    "increasedGlobalStunChance";
  ModifierID[(ModifierID["decreasedGlobalStunChance"] = 495)] =
    "decreasedGlobalStunChance";
  ModifierID[(ModifierID["increasedGlobalSleepChance"] = 496)] =
    "increasedGlobalSleepChance";
  ModifierID[(ModifierID["decreasedGlobalSleepChance"] = 497)] =
    "decreasedGlobalSleepChance";
  ModifierID[(ModifierID["increased15SlowStunChance2Turns"] = 498)] =
    "increased15SlowStunChance2Turns";
  ModifierID[(ModifierID["decreased15SlowStunChance2Turns"] = 499)] =
    "decreased15SlowStunChance2Turns";
  ModifierID[(ModifierID["increasedChanceForArrowShaftsWoodcutting"] = 500)] =
    "increasedChanceForArrowShaftsWoodcutting";
  ModifierID[(ModifierID["decreasedChanceForArrowShaftsWoodcutting"] = 501)] =
    "decreasedChanceForArrowShaftsWoodcutting";
  ModifierID[(ModifierID["decreasedNonShardCostForEquippedTablets"] = 502)] =
    "decreasedNonShardCostForEquippedTablets";
  ModifierID[(ModifierID["increasedNonShardCostForEquippedTablets"] = 503)] =
    "increasedNonShardCostForEquippedTablets";
  ModifierID[(ModifierID["decreasedPassiveCookInterval"] = 504)] =
    "decreasedPassiveCookInterval";
  ModifierID[(ModifierID["increasedPassiveCookInterval"] = 505)] =
    "increasedPassiveCookInterval";
  ModifierID[(ModifierID["increasedSkillPreservationCap"] = 506)] =
    "increasedSkillPreservationCap";
  ModifierID[(ModifierID["decreasedSkillPreservationCap"] = 507)] =
    "decreasedSkillPreservationCap";
  ModifierID[(ModifierID["increasedSalamanderCreationCharges"] = 508)] =
    "increasedSalamanderCreationCharges";
  ModifierID[(ModifierID["decreasedSalamanderCreationCharges"] = 509)] =
    "decreasedSalamanderCreationCharges";
  ModifierID[(ModifierID["decreasedJavelinResourceCost"] = 510)] =
    "decreasedJavelinResourceCost";
  ModifierID[(ModifierID["increasedJavelinResourceCost"] = 511)] =
    "increasedJavelinResourceCost";
  ModifierID[(ModifierID["increasedJavelinProduction"] = 512)] =
    "increasedJavelinProduction";
  ModifierID[(ModifierID["decreasedJavelinProduction"] = 513)] =
    "decreasedJavelinProduction";
  ModifierID[(ModifierID["increasedChanceExtraJavelins"] = 514)] =
    "increasedChanceExtraJavelins";
  ModifierID[(ModifierID["decreasedChanceExtraJavelins"] = 515)] =
    "decreasedChanceExtraJavelins";
  ModifierID[(ModifierID["increasedChanceExtraMeteoriteOre"] = 516)] =
    "increasedChanceExtraMeteoriteOre";
  ModifierID[(ModifierID["decreasedChanceExtraMeteoriteOre"] = 517)] =
    "decreasedChanceExtraMeteoriteOre";
  ModifierID[(ModifierID["increasedChanceExtraArrows"] = 518)] =
    "increasedChanceExtraArrows";
  ModifierID[(ModifierID["decreasedChanceExtraArrows"] = 519)] =
    "decreasedChanceExtraArrows";
  ModifierID[(ModifierID["increasedChanceExtraUnstrungBows"] = 520)] =
    "increasedChanceExtraUnstrungBows";
  ModifierID[(ModifierID["decreasedChanceExtraUnstrungBows"] = 521)] =
    "decreasedChanceExtraUnstrungBows";
  ModifierID[(ModifierID["increasedChanceItemToGoldFletching"] = 522)] =
    "increasedChanceItemToGoldFletching";
  ModifierID[(ModifierID["decreasedChanceItemToGoldFletching"] = 523)] =
    "decreasedChanceItemToGoldFletching";
  ModifierID[(ModifierID["increasedLeprechaunCreationCharges"] = 524)] =
    "increasedLeprechaunCreationCharges";
  ModifierID[(ModifierID["decreasedLeprechaunCreationCharges"] = 525)] =
    "decreasedLeprechaunCreationCharges";
  ModifierID[(ModifierID["increasedGPFromAgilityPerActiveObstacle"] = 526)] =
    "increasedGPFromAgilityPerActiveObstacle";
  ModifierID[(ModifierID["decreasedGPFromAgilityPerActiveObstacle"] = 527)] =
    "decreasedGPFromAgilityPerActiveObstacle";
  ModifierID[(ModifierID["increasedChanceExtraCrossbows"] = 528)] =
    "increasedChanceExtraCrossbows";
  ModifierID[(ModifierID["decreasedChanceExtraCrossbows"] = 529)] =
    "decreasedChanceExtraCrossbows";
  ModifierID[(ModifierID["disableGoldenStardustDrops"] = 530)] =
    "disableGoldenStardustDrops";
  ModifierID[(ModifierID["increasedBoltProduction"] = 531)] =
    "increasedBoltProduction";
  ModifierID[(ModifierID["decreasedBoltProduction"] = 532)] =
    "decreasedBoltProduction";
  ModifierID[(ModifierID["decreasedFletchingIntervalWithArrows"] = 533)] =
    "decreasedFletchingIntervalWithArrows";
  ModifierID[(ModifierID["increasedFletchingIntervalWithArrows"] = 534)] =
    "increasedFletchingIntervalWithArrows";
  ModifierID[(ModifierID["increasedGPPerDamage"] = 535)] =
    "increasedGPPerDamage";
  ModifierID[(ModifierID["decreasedGPPerDamage"] = 536)] =
    "decreasedGPPerDamage";
  ModifierID[(ModifierID["increasedGPBasedOnEnemyCombatLevel"] = 537)] =
    "increasedGPBasedOnEnemyCombatLevel";
  ModifierID[(ModifierID["increasedGPBasedOnSummonDamage"] = 538)] =
    "increasedGPBasedOnSummonDamage";
  ModifierID[(ModifierID["decreasedGPBasedOnSummonDamage"] = 539)] =
    "decreasedGPBasedOnSummonDamage";
  ModifierID[(ModifierID["increasedSlayerCoinsPerDamage"] = 540)] =
    "increasedSlayerCoinsPerDamage";
  ModifierID[(ModifierID["decreasedSlayerCoinsPerDamage"] = 541)] =
    "decreasedSlayerCoinsPerDamage";
  ModifierID[(ModifierID["increasedChanceToIncreaseSleepDuration"] = 542)] =
    "increasedChanceToIncreaseSleepDuration";
  ModifierID[(ModifierID["decreasedChanceToIncreaseSleepDuration"] = 543)] =
    "decreasedChanceToIncreaseSleepDuration";
  ModifierID[(ModifierID["increasedCyclopsCreationCharges"] = 544)] =
    "increasedCyclopsCreationCharges";
  ModifierID[(ModifierID["decreasedCyclopsCreationCharges"] = 545)] =
    "decreasedCyclopsCreationCharges";
  ModifierID[(ModifierID["increasedChanceToAvoidStun"] = 546)] =
    "increasedChanceToAvoidStun";
  ModifierID[(ModifierID["decreasedChanceToAvoidStun"] = 547)] =
    "decreasedChanceToAvoidStun";
  ModifierID[(ModifierID["increasedChanceToAvoidSleep"] = 548)] =
    "increasedChanceToAvoidSleep";
  ModifierID[(ModifierID["decreasedChanceToAvoidSleep"] = 549)] =
    "decreasedChanceToAvoidSleep";
  ModifierID[(ModifierID["increasedHealWhenStunned"] = 550)] =
    "increasedHealWhenStunned";
  ModifierID[(ModifierID["decreasedHealWhenStunned"] = 551)] =
    "decreasedHealWhenStunned";
  ModifierID[(ModifierID["increasedHealWhenSleep"] = 552)] =
    "increasedHealWhenSleep";
  ModifierID[(ModifierID["decreasedHealWhenSleep"] = 553)] =
    "decreasedHealWhenSleep";
  ModifierID[
    (ModifierID["increasedChanceToApplyDeadlyPoisonWhenPoisoned"] = 554)
  ] = "increasedChanceToApplyDeadlyPoisonWhenPoisoned";
  ModifierID[
    (ModifierID["decreasedChanceToApplyDeadlyPoisonWhenPoisoned"] = 555)
  ] = "decreasedChanceToApplyDeadlyPoisonWhenPoisoned";
  ModifierID[(ModifierID["increasedDamageTakenPerAttack"] = 556)] =
    "increasedDamageTakenPerAttack";
  ModifierID[(ModifierID["decreasedDamageTakenPerAttack"] = 557)] =
    "decreasedDamageTakenPerAttack";
  ModifierID[(ModifierID["increasedDamageTakenWhenAsleep"] = 558)] =
    "increasedDamageTakenWhenAsleep";
  ModifierID[(ModifierID["decreasedDamageTakenWhenAsleep"] = 559)] =
    "decreasedDamageTakenWhenAsleep";
  ModifierID[(ModifierID["increasedDamageTakenWhenStunned"] = 560)] =
    "increasedDamageTakenWhenStunned";
  ModifierID[(ModifierID["decreasedDamageTakenWhenStunned"] = 561)] =
    "decreasedDamageTakenWhenStunned";
  ModifierID[(ModifierID["decreasedPlayerDamageReduction"] = 562)] =
    "decreasedPlayerDamageReduction";
  ModifierID[(ModifierID["increasedDamageDealtIfPoisoned"] = 563)] =
    "increasedDamageDealtIfPoisoned";
  ModifierID[(ModifierID["decreasedDamageDealtIfPoisoned"] = 564)] =
    "decreasedDamageDealtIfPoisoned";
  ModifierID[(ModifierID["increasedMeleeMaxHitFlat"] = 565)] =
    "increasedMeleeMaxHitFlat";
  ModifierID[(ModifierID["decreasedMeleeMaxHitFlat"] = 566)] =
    "decreasedMeleeMaxHitFlat";
  ModifierID[(ModifierID["increasedRangedMaxHitFlat"] = 567)] =
    "increasedRangedMaxHitFlat";
  ModifierID[(ModifierID["decreasedRangedMaxHitFlat"] = 568)] =
    "decreasedRangedMaxHitFlat";
  ModifierID[(ModifierID["increasedMagicMaxHitFlat"] = 569)] =
    "increasedMagicMaxHitFlat";
  ModifierID[(ModifierID["decreasedMagicMaxHitFlat"] = 570)] =
    "decreasedMagicMaxHitFlat";
  ModifierID[(ModifierID["increasedGPFromItemAlchemy"] = 571)] =
    "increasedGPFromItemAlchemy";
  ModifierID[(ModifierID["increasedChanceToApplyShock"] = 572)] =
    "increasedChanceToApplyShock";
  ModifierID[(ModifierID["increasedAbsorbingSkin"] = 573)] =
    "increasedAbsorbingSkin";
  ModifierID[(ModifierID["increasedDuality"] = 574)] = "increasedDuality";
  ModifierID[(ModifierID["increasedChanceToApplyDecayCurse"] = 575)] =
    "increasedChanceToApplyDecayCurse";
  ModifierID[(ModifierID["increasedRage"] = 576)] = "increasedRage";
  ModifierID[(ModifierID["increasedCurseLifesteal"] = 577)] =
    "increasedCurseLifesteal";
  ModifierID[(ModifierID["applyRandomCurseOnSpawn"] = 578)] =
    "applyRandomCurseOnSpawn";
  ModifierID[(ModifierID["increasedChanceDarkBlade"] = 579)] =
    "increasedChanceDarkBlade";
  ModifierID[(ModifierID["increasedChanceForCharcoalInFiremaking"] = 580)] =
    "increasedChanceForCharcoalInFiremaking";
  ModifierID[(ModifierID["decreasedChanceForCharcoalInFiremaking"] = 581)] =
    "decreasedChanceForCharcoalInFiremaking";
  ModifierID[(ModifierID["increasedThievingAreaUniqueChance"] = 582)] =
    "increasedThievingAreaUniqueChance";
  ModifierID[(ModifierID["decreasedThievingAreaUniqueChance"] = 583)] =
    "decreasedThievingAreaUniqueChance";
  ModifierID[(ModifierID["increasedChanceToFindMeteorite"] = 584)] =
    "increasedChanceToFindMeteorite";
  ModifierID[(ModifierID["increasedChanceToFindMushroomWoodcutting"] = 585)] =
    "increasedChanceToFindMushroomWoodcutting";
  ModifierID[(ModifierID["increasedChanceToAvoidThievingStuns"] = 586)] =
    "increasedChanceToAvoidThievingStuns";
  ModifierID[(ModifierID["increasedChanceAdditionalPerfectItem"] = 587)] =
    "increasedChanceAdditionalPerfectItem";
  ModifierID[
    (ModifierID["increasedMaxHitPercentBasedOnDamageReduction"] = 588)
  ] = "increasedMaxHitPercentBasedOnDamageReduction";
  ModifierID[
    (ModifierID["decreasedMaxHitPercentBasedOnDamageReduction"] = 589)
  ] = "decreasedMaxHitPercentBasedOnDamageReduction";
  ModifierID[(ModifierID["halveDamageReduction"] = 590)] =
    "halveDamageReduction";
  ModifierID[
    (ModifierID["increasedLifestealBasedOnHPRegenEffectiveness"] = 591)
  ] = "increasedLifestealBasedOnHPRegenEffectiveness";
  ModifierID[(ModifierID["disableHPRegeneration"] = 592)] =
    "disableHPRegeneration";
  ModifierID[(ModifierID["increasedMinMeteorShowerSpellDamage"] = 593)] =
    "increasedMinMeteorShowerSpellDamage";
  ModifierID[(ModifierID["increasedEndOfTurnEvasion2"] = 594)] =
    "increasedEndOfTurnEvasion2";
  ModifierID[(ModifierID["decreaseEnemyEvasionOnStun"] = 595)] =
    "decreaseEnemyEvasionOnStun";
  ModifierID[(ModifierID["decreaseEnemyEvasionOnSleep"] = 596)] =
    "decreaseEnemyEvasionOnSleep";
  ModifierID[(ModifierID["decreasedEvasionBasedOnDR"] = 597)] =
    "decreasedEvasionBasedOnDR";
  ModifierID[(ModifierID["healOnHitBasedOnTargetDR"] = 598)] =
    "healOnHitBasedOnTargetDR";
  ModifierID[(ModifierID["doubleLifesteal"] = 599)] = "doubleLifesteal";
  ModifierID[(ModifierID["increasedMaxHPBurnDamage"] = 600)] =
    "increasedMaxHPBurnDamage";
  ModifierID[(ModifierID["increasedChanceToApplyDeadlyPoison"] = 601)] =
    "increasedChanceToApplyDeadlyPoison";
  ModifierID[(ModifierID["disableLifesteal"] = 602)] = "disableLifesteal";
  ModifierID[(ModifierID["increasedSlayerCoinsBasedOnTargetDR"] = 603)] =
    "increasedSlayerCoinsBasedOnTargetDR";
  ModifierID[(ModifierID["increasedSlayerCoinsPerPoisonDamage"] = 604)] =
    "increasedSlayerCoinsPerPoisonDamage";
  ModifierID[(ModifierID["increasedChanceStardustCuttingMagicLogs"] = 605)] =
    "increasedChanceStardustCuttingMagicLogs";
  ModifierID[(ModifierID["increasedTownshipPopulationCap"] = 606)] =
    "increasedTownshipPopulationCap";
  ModifierID[(ModifierID["decreasedTownshipPopulationCap"] = 607)] =
    "decreasedTownshipPopulationCap";
  ModifierID[(ModifierID["increasedTownshipHappiness"] = 608)] =
    "increasedTownshipHappiness";
  ModifierID[(ModifierID["decreasedTownshipHappiness"] = 609)] =
    "decreasedTownshipHappiness";
  ModifierID[(ModifierID["increasedTownshipEducation"] = 610)] =
    "increasedTownshipEducation";
  ModifierID[(ModifierID["decreasedTownshipEducation"] = 611)] =
    "decreasedTownshipEducation";
  ModifierID[(ModifierID["increasedTownshipHealth"] = 612)] =
    "increasedTownshipHealth";
  ModifierID[(ModifierID["decreasedTownshipHealth"] = 613)] =
    "decreasedTownshipHealth";
  ModifierID[(ModifierID["increasedTownshipGPProduction"] = 614)] =
    "increasedTownshipGPProduction";
  ModifierID[(ModifierID["decreasedTownshipGPProduction"] = 615)] =
    "decreasedTownshipGPProduction";
  ModifierID[(ModifierID["increasedTownshipMaxStorage"] = 616)] =
    "increasedTownshipMaxStorage";
  ModifierID[(ModifierID["decreasedTownshipMaxStorage"] = 617)] =
    "decreasedTownshipMaxStorage";
  ModifierID[(ModifierID["increasedTownshipFoodProduction"] = 618)] =
    "increasedTownshipFoodProduction";
  ModifierID[(ModifierID["decreasedTownshipFoodProduction"] = 619)] =
    "decreasedTownshipFoodProduction";
  ModifierID[(ModifierID["increasedTownshipWoodProduction"] = 620)] =
    "increasedTownshipWoodProduction";
  ModifierID[(ModifierID["decreasedTownshipWoodProduction"] = 621)] =
    "decreasedTownshipWoodProduction";
  ModifierID[(ModifierID["increasedTownshipOreProduction"] = 622)] =
    "increasedTownshipOreProduction";
  ModifierID[(ModifierID["decreasedTownshipOreProduction"] = 623)] =
    "decreasedTownshipOreProduction";
  ModifierID[(ModifierID["increasedTownshipStoneProduction"] = 624)] =
    "increasedTownshipStoneProduction";
  ModifierID[(ModifierID["decreasedTownshipStoneProduction"] = 625)] =
    "decreasedTownshipStoneProduction";
  ModifierID[(ModifierID["increasedTownshipCoalProduction"] = 626)] =
    "increasedTownshipCoalProduction";
  ModifierID[(ModifierID["decreasedTownshipCoalProduction"] = 627)] =
    "decreasedTownshipCoalProduction";
  ModifierID[(ModifierID["increasedTownshipBarProduction"] = 628)] =
    "increasedTownshipBarProduction";
  ModifierID[(ModifierID["decreasedTownshipBarProduction"] = 629)] =
    "decreasedTownshipBarProduction";
  ModifierID[(ModifierID["increasedTownshipHerbProduction"] = 630)] =
    "increasedTownshipHerbProduction";
  ModifierID[(ModifierID["decreasedTownshipHerbProduction"] = 631)] =
    "decreasedTownshipHerbProduction";
  ModifierID[(ModifierID["increasedTownshipRuneEssenceProduction"] = 632)] =
    "increasedTownshipRuneEssenceProduction";
  ModifierID[(ModifierID["decreasedTownshipRuneEssenceProduction"] = 633)] =
    "decreasedTownshipRuneEssenceProduction";
  ModifierID[(ModifierID["increasedTownshipLeatherProduction"] = 634)] =
    "increasedTownshipLeatherProduction";
  ModifierID[(ModifierID["decreasedTownshipLeatherProduction"] = 635)] =
    "decreasedTownshipLeatherProduction";
  ModifierID[(ModifierID["increasedTownshipPotionProduction"] = 636)] =
    "increasedTownshipPotionProduction";
  ModifierID[(ModifierID["decreasedTownshipPotionProduction"] = 637)] =
    "decreasedTownshipPotionProduction";
  ModifierID[(ModifierID["increasedTownshipPlankProduction"] = 638)] =
    "increasedTownshipPlankProduction";
  ModifierID[(ModifierID["decreasedTownshipPlankProduction"] = 639)] =
    "decreasedTownshipPlankProduction";
  ModifierID[(ModifierID["increasedTownshipClothingProduction"] = 640)] =
    "increasedTownshipClothingProduction";
  ModifierID[(ModifierID["decreasedTownshipClothingProduction"] = 641)] =
    "decreasedTownshipClothingProduction";
  ModifierID[(ModifierID["increasedTownshipBuildingCost"] = 642)] =
    "increasedTownshipBuildingCost";
  ModifierID[(ModifierID["decreasedTownshipBuildingCost"] = 643)] =
    "decreasedTownshipBuildingCost";
  ModifierID[(ModifierID["increasedTownshipGrasslandsProduction"] = 644)] =
    "increasedTownshipGrasslandsProduction";
  ModifierID[(ModifierID["decreasedTownshipGrasslandsProduction"] = 645)] =
    "decreasedTownshipGrasslandsProduction";
  ModifierID[(ModifierID["increasedTownshipForestProduction"] = 646)] =
    "increasedTownshipForestProduction";
  ModifierID[(ModifierID["decreasedTownshipForestProduction"] = 647)] =
    "decreasedTownshipForestProduction";
  ModifierID[(ModifierID["increasedTownshipDesertProduction"] = 648)] =
    "increasedTownshipDesertProduction";
  ModifierID[(ModifierID["decreasedTownshipDesertProduction"] = 649)] =
    "decreasedTownshipDesertProduction";
  ModifierID[(ModifierID["increasedTownshipWaterProduction"] = 650)] =
    "increasedTownshipWaterProduction";
  ModifierID[(ModifierID["decreasedTownshipWaterProduction"] = 651)] =
    "decreasedTownshipWaterProduction";
  ModifierID[(ModifierID["increasedTownshipSwampProduction"] = 652)] =
    "increasedTownshipSwampProduction";
  ModifierID[(ModifierID["decreasedTownshipSwampProduction"] = 653)] =
    "decreasedTownshipSwampProduction";
  ModifierID[(ModifierID["increasedTownshipAridPlainsProduction"] = 654)] =
    "increasedTownshipAridPlainsProduction";
  ModifierID[(ModifierID["decreasedTownshipAridPlainsProduction"] = 655)] =
    "decreasedTownshipAridPlainsProduction";
  ModifierID[(ModifierID["increasedTownshipMountainsProduction"] = 656)] =
    "increasedTownshipMountainsProduction";
  ModifierID[(ModifierID["decreasedTownshipMountainsProduction"] = 657)] =
    "decreasedTownshipMountainsProduction";
  ModifierID[(ModifierID["increasedTownshipValleyProduction"] = 658)] =
    "increasedTownshipValleyProduction";
  ModifierID[(ModifierID["decreasedTownshipValleyProduction"] = 659)] =
    "decreasedTownshipValleyProduction";
  ModifierID[(ModifierID["increasedTownshipJungleProduction"] = 660)] =
    "increasedTownshipJungleProduction";
  ModifierID[(ModifierID["decreasedTownshipJungleProduction"] = 661)] =
    "decreasedTownshipJungleProduction";
  ModifierID[(ModifierID["increasedTownshipSnowlandsProduction"] = 662)] =
    "increasedTownshipSnowlandsProduction";
  ModifierID[(ModifierID["decreasedTownshipSnowlandsProduction"] = 663)] =
    "decreasedTownshipSnowlandsProduction";
  ModifierID[(ModifierID["increasedTownshipFishingDockProduction"] = 664)] =
    "increasedTownshipFishingDockProduction";
  ModifierID[(ModifierID["decreasedTownshipFishingDockProduction"] = 665)] =
    "decreasedTownshipFishingDockProduction";
  ModifierID[(ModifierID["increasedTownshipMagicEmporiumProduction"] = 666)] =
    "increasedTownshipMagicEmporiumProduction";
  ModifierID[(ModifierID["decreasedTownshipMagicEmporiumProduction"] = 667)] =
    "decreasedTownshipMagicEmporiumProduction";
  ModifierID[(ModifierID["increasedTownshipOrchardProduction"] = 668)] =
    "increasedTownshipOrchardProduction";
  ModifierID[(ModifierID["decreasedTownshipOrchardProduction"] = 669)] =
    "decreasedTownshipOrchardProduction";
  ModifierID[(ModifierID["increasedTownshipFarmProduction"] = 670)] =
    "increasedTownshipFarmProduction";
  ModifierID[(ModifierID["decreasedTownshipFarmProduction"] = 671)] =
    "decreasedTownshipFarmProduction";
  ModifierID[(ModifierID["increasedTownshipWoodcuttingProduction"] = 672)] =
    "increasedTownshipWoodcuttingProduction";
  ModifierID[(ModifierID["decreasedTownshipWoodcuttingProduction"] = 673)] =
    "decreasedTownshipWoodcuttingProduction";
  ModifierID[(ModifierID["increasedTownshipBlacksmithProduction"] = 674)] =
    "increasedTownshipBlacksmithProduction";
  ModifierID[(ModifierID["decreasedTownshipBlacksmithProduction"] = 675)] =
    "decreasedTownshipBlacksmithProduction";
  ModifierID[(ModifierID["increasedTownshipTaxPerCitizen"] = 676)] =
    "increasedTownshipTaxPerCitizen";
  ModifierID[(ModifierID["decreasedTownshipTaxPerCitizen"] = 677)] =
    "decreasedTownshipTaxPerCitizen";
  ModifierID[(ModifierID["townshipDisableHunting"] = 678)] =
    "townshipDisableHunting";
  ModifierID[(ModifierID["increasedTownshipResourceProduction"] = 679)] =
    "increasedTownshipResourceProduction";
  ModifierID[(ModifierID["decreasedTownshipResourceProduction"] = 680)] =
    "decreasedTownshipResourceProduction";
  ModifierID[(ModifierID["increasedTownshipCoalUsage"] = 681)] =
    "increasedTownshipCoalUsage";
  ModifierID[(ModifierID["decreasedTownshipCoalUsage"] = 682)] =
    "decreasedTownshipCoalUsage";
  ModifierID[
    (ModifierID["increasedTownshipBuildingHappinessPenalties"] = 683)
  ] = "increasedTownshipBuildingHappinessPenalties";
  ModifierID[
    (ModifierID["decreasedTownshipBuildingHappinessPenalties"] = 684)
  ] = "decreasedTownshipBuildingHappinessPenalties";
  ModifierID[(ModifierID["increasedAdditionalAshInFiremaking"] = 685)] =
    "increasedAdditionalAshInFiremaking";
  ModifierID[(ModifierID["decreasedAdditionalAshInFiremaking"] = 686)] =
    "decreasedAdditionalAshInFiremaking";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerDeedree"] = 687)] =
    "increasedSkillMasteryXPPerDeedree";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerAmeria"] = 688)] =
    "increasedSkillMasteryXPPerAmeria";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerVale"] = 689)] =
    "increasedSkillMasteryXPPerVale";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerQimican"] = 690)] =
    "increasedSkillMasteryXPPerQimican";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerKo"] = 691)] =
    "increasedSkillMasteryXPPerKo";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerArachi"] = 692)] =
    "increasedSkillMasteryXPPerArachi";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerIridan"] = 693)] =
    "increasedSkillMasteryXPPerIridan";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerHyden"] = 694)] =
    "increasedSkillMasteryXPPerHyden";
  ModifierID[(ModifierID["increasedSkillMasteryXPPerSyllia"] = 695)] =
    "increasedSkillMasteryXPPerSyllia";
  ModifierID[(ModifierID["increasedTownshipFoodUsage"] = 696)] =
    "increasedTownshipFoodUsage";
  ModifierID[(ModifierID["decreasedTownshipFoodUsage"] = 697)] =
    "decreasedTownshipFoodUsage";
  ModifierID[(ModifierID["increasedChanceToAvoidCurses"] = 698)] =
    "increasedChanceToAvoidCurses";
  ModifierID[(ModifierID["applyMadnessCurseOnSpawn"] = 699)] =
    "applyMadnessCurseOnSpawn";
  ModifierID[(ModifierID["applyTormentCurseOnSpawn"] = 700)] =
    "applyTormentCurseOnSpawn";
  ModifierID[(ModifierID["applyDespairCurseOnSpawn"] = 701)] =
    "applyDespairCurseOnSpawn";
  ModifierID[(ModifierID["freezeImmunity"] = 702)] = "freezeImmunity";
  ModifierID[(ModifierID["increasedMinPoisonArchaicDmg"] = 703)] =
    "increasedMinPoisonArchaicDmg";
  ModifierID[(ModifierID["increasedMinInfernalArchaicDmg"] = 704)] =
    "increasedMinInfernalArchaicDmg";
  ModifierID[(ModifierID["increasedMinLightningArchaicDmg"] = 705)] =
    "increasedMinLightningArchaicDmg";
  ModifierID[(ModifierID["increasedChanceToFindLostChest"] = 706)] =
    "increasedChanceToFindLostChest";
  ModifierID[(ModifierID["reducedTargetDamageRedcutionIfBleeding"] = 707)] =
    "reducedTargetDamageRedcutionIfBleeding";
  ModifierID[(ModifierID["increasedAssassin"] = 708)] = "increasedAssassin";
  ModifierID[(ModifierID["increasedChanceToPreserveConsumable"] = 709)] =
    "increasedChanceToPreserveConsumable";
  ModifierID[(ModifierID["increasedTownshipDeadStorage"] = 710)] =
    "increasedTownshipDeadStorage";
  ModifierID[(ModifierID["decreasedTownshipDeadStorage"] = 711)] =
    "decreasedTownshipDeadStorage";
  ModifierID[(ModifierID["growingMadnessPassive"] = 712)] =
    "growingMadnessPassive";
  ModifierID[(ModifierID["momentInTimePassive"] = 713)] = "momentInTimePassive";
  ModifierID[(ModifierID["reignOverTimePassive"] = 714)] =
    "reignOverTimePassive";
  ModifierID[(ModifierID["increasedChanceToApplySleepToTargetWhenHit"] = 715)] =
    "increasedChanceToApplySleepToTargetWhenHit";
  ModifierID[(ModifierID["increasedPlayerRage"] = 716)] = "increasedPlayerRage";
  ModifierID[(ModifierID["increasedLeviathan"] = 717)] = "increasedLeviathan";
  ModifierID[(ModifierID["shadowCloak"] = 718)] = "shadowCloak";
  ModifierID[(ModifierID["ingrainedRoots"] = 719)] = "ingrainedRoots";
  ModifierID[(ModifierID["bigRon"] = 720)] = "bigRon";
  ModifierID[(ModifierID["coalGainedOnCookingFailure"] = 721)] =
    "coalGainedOnCookingFailure";
  ModifierID[(ModifierID["halvedWoodcuttingDoubleChance"] = 722)] =
    "halvedWoodcuttingDoubleChance";
  ModifierID[(ModifierID["increasedFlatFarmingYield"] = 723)] =
    "increasedFlatFarmingYield";
  ModifierID[(ModifierID["decreasedFlatFarmingYield"] = 724)] =
    "decreasedFlatFarmingYield";
  ModifierID[(ModifierID["summoningSynergy_Devil_Eagle"] = 725)] =
    "summoningSynergy_Devil_Eagle";
  ModifierID[(ModifierID["increasedDeadlyToxinsFromHerblore"] = 726)] =
    "increasedDeadlyToxinsFromHerblore";
  ModifierID[(ModifierID["increasedPoisonSpellAccuracy"] = 727)] =
    "increasedPoisonSpellAccuracy";
  ModifierID[(ModifierID["increasedInfernalSpellAccuracy"] = 728)] =
    "increasedInfernalSpellAccuracy";
  ModifierID[(ModifierID["increasedLightningSpellAccuracy"] = 729)] =
    "increasedLightningSpellAccuracy";
  ModifierID[
    (ModifierID["increasedSummoningCreationChargesForEquippedTablets"] = 730)
  ] = "increasedSummoningCreationChargesForEquippedTablets";
  ModifierID[
    (ModifierID["decreasedSummoningIntervalPercentForEquippedTablets"] = 731)
  ] = "decreasedSummoningIntervalPercentForEquippedTablets";
  ModifierID[(ModifierID["increasedMinBirdNestQuantity"] = 732)] =
    "increasedMinBirdNestQuantity";
  ModifierID[(ModifierID["increasedGemVeinChance"] = 733)] =
    "increasedGemVeinChance";
  ModifierID[(ModifierID["decreasedGemVeinChance"] = 734)] =
    "decreasedGemVeinChance";
  ModifierID[(ModifierID["increasedChanceAdditionalBarSmithing"] = 735)] =
    "increasedChanceAdditionalBarSmithing";
  ModifierID[(ModifierID["increasedFletchingBoltQuantity"] = 736)] =
    "increasedFletchingBoltQuantity";
  ModifierID[(ModifierID["increasedAgilityPillarCost"] = 737)] =
    "increasedAgilityPillarCost";
  ModifierID[(ModifierID["decreasedAgilityPillarCost"] = 738)] =
    "decreasedAgilityPillarCost";
  ModifierID[(ModifierID["increasedNonCombatSkillXP"] = 739)] =
    "increasedNonCombatSkillXP";
  ModifierID[(ModifierID["decreasedNonCombatSkillXP"] = 740)] =
    "decreasedNonCombatSkillXP";
  ModifierID[(ModifierID["increasedFlatMeleeDefenceBonus"] = 741)] =
    "increasedFlatMeleeDefenceBonus";
  ModifierID[(ModifierID["increasedFlatRangedDefenceBonus"] = 742)] =
    "increasedFlatRangedDefenceBonus";
  ModifierID[(ModifierID["increasedFlatStabAttackBonus"] = 743)] =
    "increasedFlatStabAttackBonus";
  ModifierID[(ModifierID["increasedFlatSlashAttackBonus"] = 744)] =
    "increasedFlatSlashAttackBonus";
  ModifierID[(ModifierID["increasedFlatBlockAttackBonus"] = 745)] =
    "increasedFlatBlockAttackBonus";
  ModifierID[(ModifierID["increasedFlatRangedAttackBonus"] = 746)] =
    "increasedFlatRangedAttackBonus";
  ModifierID[(ModifierID["increasedFlatMagicAttackBonus"] = 747)] =
    "increasedFlatMagicAttackBonus";
  ModifierID[(ModifierID["increasedFlatMeleeStrengthBonus"] = 748)] =
    "increasedFlatMeleeStrengthBonus";
  ModifierID[(ModifierID["increasedFlatRangedStrengthBonus"] = 749)] =
    "increasedFlatRangedStrengthBonus";
  ModifierID[(ModifierID["disableSalamanderItemReduction"] = 750)] =
    "disableSalamanderItemReduction";
  ModifierID[(ModifierID["decreasedSummoningIntervalForOctopus"] = 751)] =
    "decreasedSummoningIntervalForOctopus";
  ModifierID[(ModifierID["decreasedBurnDOTDamage"] = 752)] =
    "decreasedBurnDOTDamage";
  ModifierID[(ModifierID["increasedBurnDOTDamage"] = 753)] =
    "increasedBurnDOTDamage";
  ModifierID[(ModifierID["decreasedBleedDOTDamage"] = 754)] =
    "decreasedBleedDOTDamage";
  ModifierID[(ModifierID["increasedBleedDOTDamage"] = 755)] =
    "increasedBleedDOTDamage";
  ModifierID[(ModifierID["increasedPoisonDOTDamage"] = 756)] =
    "increasedPoisonDOTDamage";
  ModifierID[(ModifierID["decreasedPoisonDOTDamage"] = 757)] =
    "decreasedPoisonDOTDamage";
  ModifierID[(ModifierID["increasedDeadlyPoisonDOTDamage"] = 758)] =
    "increasedDeadlyPoisonDOTDamage";
  ModifierID[(ModifierID["decreasedDeadlyPoisonDOTDamage"] = 759)] =
    "decreasedDeadlyPoisonDOTDamage";
  ModifierID[(ModifierID["increasedMasteryPoolCap"] = 760)] =
    "increasedMasteryPoolCap";
  ModifierID[(ModifierID["bypassAllSlayerItems"] = 761)] =
    "bypassAllSlayerItems";
  ModifierID[(ModifierID["increased5DROnBeingHit"] = 762)] =
    "increased5DROnBeingHit";
  ModifierID[(ModifierID["increased30Slow5TurnsChance"] = 763)] =
    "increased30Slow5TurnsChance";
  ModifierID[(ModifierID["increasedEndOfTurnMaxHealing2"] = 764)] =
    "increasedEndOfTurnMaxHealing2";
  ModifierID[(ModifierID["increasedEvasionAgainstMelee"] = 765)] =
    "increasedEvasionAgainstMelee";
  ModifierID[(ModifierID["increasedEvasionAgainstRanged"] = 766)] =
    "increasedEvasionAgainstRanged";
  ModifierID[(ModifierID["increasedEvasionAgainstMagic"] = 767)] =
    "increasedEvasionAgainstMagic";
  ModifierID[(ModifierID["allowNonMagicCurses"] = 768)] = "allowNonMagicCurses";
  ModifierID[(ModifierID["increasedTownshipTraderStock"] = 769)] =
    "increasedTownshipTraderStock";
})(ModifierID || (ModifierID = {}));
var AmmoTypeID;
(function (AmmoTypeID) {
  AmmoTypeID[(AmmoTypeID["Arrows"] = 0)] = "Arrows";
  AmmoTypeID[(AmmoTypeID["Bolts"] = 1)] = "Bolts";
  AmmoTypeID[(AmmoTypeID["Javelins"] = 2)] = "Javelins";
  AmmoTypeID[(AmmoTypeID["ThrowingKnives"] = 3)] = "ThrowingKnives";
  AmmoTypeID[(AmmoTypeID["None"] = 4)] = "None";
})(AmmoTypeID || (AmmoTypeID = {}));
const TODO_REPLACE_MEDIA = "assets/media/main/missing_artwork.png";
