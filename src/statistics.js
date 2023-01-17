"use strict";
class Statistics {
  constructor(game) {
    this.game = game;
    this.Woodcutting = new StatTracker();
    this.Fishing = new StatTracker();
    this.Firemaking = new StatTracker();
    this.Cooking = new StatTracker();
    this.Mining = new StatTracker();
    this.Smithing = new StatTracker();
    this.Attack = new StatTracker();
    this.Strength = new StatTracker();
    this.Defence = new StatTracker();
    this.Hitpoints = new StatTracker();
    this.Thieving = new StatTracker();
    this.Farming = new StatTracker();
    this.Ranged = new StatTracker();
    this.Fletching = new StatTracker();
    this.Crafting = new StatTracker();
    this.Runecrafting = new StatTracker();
    this.Magic = new StatTracker();
    this.Prayer = new StatTracker();
    this.Slayer = new StatTracker();
    this.Herblore = new StatTracker();
    this.Agility = new StatTracker();
    this.Summoning = new StatTracker();
    this.Astrology = new StatTracker();
    this.Township = new StatTracker();
    this.General = new StatTracker();
    this.Combat = new StatTracker();
    this.GolbinRaid = new StatTracker();
    this.Shop = new StatTracker();
    this.Items = new MappedStatTracker(game.items, DummyItem, this.game);
    this.Monsters = new MappedStatTracker(
      game.monsters,
      DummyMonster,
      this.game
    );
  }
  itemFindCount(item) {
    return this.Items.get(item, ItemStats.TimesFound);
  }
  monsterKillCount(monster) {
    return this.Monsters.get(monster, MonsterStats.KilledByPlayer);
  }
  getFilteredItemStatsTotal(predicate, stat) {
    let statTotal = 0;
    this.game.items.forEach((item) => {
      if (predicate(item)) statTotal += this.Items.get(item, stat);
    });
    return statTotal;
  }
  getFilteredItemStatsDiff(predicate, statAdd, statSub) {
    let statTotal = 0;
    this.game.items.forEach((item) => {
      if (predicate(item))
        statTotal +=
          this.Items.get(item, statAdd) - this.Items.get(item, statSub);
    });
    return statTotal;
  }
  meteoriteSnapshot() {
    return {
      totalFound: this.Astrology.get(AstrologyStats.MeteoritesLocated),
      hpFound: this.Astrology.get(AstrologyStats.TotalMeteoriteHP),
    };
  }
  onyxSnapshot() {
    return {
      totalFound: this.Mining.get(MiningStats.OnyxGemNodesFound),
      hpFound: this.Mining.get(MiningStats.TotalOnyxGemNodeHPFound),
    };
  }
  orichaSnapshot() {
    return {
      totalFound: this.Mining.get(MiningStats.OrichaGemNodesFound),
      hpFound: this.Mining.get(MiningStats.TotalOrichaGemNodeHPFound),
    };
  }
  ceruleanSnapshot() {
    return {
      totalFound: this.Mining.get(MiningStats.CeruleanGemNodesFound),
      hpFound: this.Mining.get(MiningStats.TotalCeruleanGemNodeHPFound),
    };
  }
  encode(writer) {
    this.Woodcutting.encode(writer);
    this.Fishing.encode(writer);
    this.Firemaking.encode(writer);
    this.Cooking.encode(writer);
    this.Mining.encode(writer);
    this.Smithing.encode(writer);
    this.Attack.encode(writer);
    this.Strength.encode(writer);
    this.Defence.encode(writer);
    this.Hitpoints.encode(writer);
    this.Thieving.encode(writer);
    this.Farming.encode(writer);
    this.Ranged.encode(writer);
    this.Fletching.encode(writer);
    this.Crafting.encode(writer);
    this.Runecrafting.encode(writer);
    this.Magic.encode(writer);
    this.Prayer.encode(writer);
    this.Slayer.encode(writer);
    this.Herblore.encode(writer);
    this.Agility.encode(writer);
    this.Summoning.encode(writer);
    this.Items.encode(writer);
    this.Monsters.encode(writer);
    this.General.encode(writer);
    this.Combat.encode(writer);
    this.GolbinRaid.encode(writer);
    this.Astrology.encode(writer);
    this.Shop.encode(writer);
    this.Township.encode(writer);
    return writer;
  }
  decode(reader, version) {
    this.Woodcutting.decode(reader, version);
    this.Fishing.decode(reader, version);
    this.Firemaking.decode(reader, version);
    this.Cooking.decode(reader, version);
    this.Mining.decode(reader, version);
    this.Smithing.decode(reader, version);
    this.Attack.decode(reader, version);
    this.Strength.decode(reader, version);
    this.Defence.decode(reader, version);
    this.Hitpoints.decode(reader, version);
    this.Thieving.decode(reader, version);
    this.Farming.decode(reader, version);
    this.Ranged.decode(reader, version);
    this.Fletching.decode(reader, version);
    this.Crafting.decode(reader, version);
    this.Runecrafting.decode(reader, version);
    this.Magic.decode(reader, version);
    this.Prayer.decode(reader, version);
    this.Slayer.decode(reader, version);
    this.Herblore.decode(reader, version);
    this.Agility.decode(reader, version);
    this.Summoning.decode(reader, version);
    this.Items.decode(reader, version);
    this.Monsters.decode(reader, version);
    this.General.decode(reader, version);
    this.Combat.decode(reader, version);
    this.GolbinRaid.decode(reader, version);
    this.Astrology.decode(reader, version);
    this.Shop.decode(reader, version);
    this.Township.decode(reader, version);
  }
  deserialize(reader, version, idMap) {
    this.Woodcutting.deserialize(reader.getVariableLengthChunk(), version);
    this.Fishing.deserialize(reader.getVariableLengthChunk(), version);
    this.Firemaking.deserialize(reader.getVariableLengthChunk(), version);
    this.Cooking.deserialize(reader.getVariableLengthChunk(), version);
    this.Mining.deserialize(reader.getVariableLengthChunk(), version);
    this.Smithing.deserialize(reader.getVariableLengthChunk(), version);
    this.Attack.deserialize(reader.getVariableLengthChunk(), version);
    this.Strength.deserialize(reader.getVariableLengthChunk(), version);
    this.Defence.deserialize(reader.getVariableLengthChunk(), version);
    this.Hitpoints.deserialize(reader.getVariableLengthChunk(), version);
    this.Thieving.deserialize(reader.getVariableLengthChunk(), version);
    this.Farming.deserialize(reader.getVariableLengthChunk(), version);
    this.Ranged.deserialize(reader.getVariableLengthChunk(), version);
    this.Fletching.deserialize(reader.getVariableLengthChunk(), version);
    this.Crafting.deserialize(reader.getVariableLengthChunk(), version);
    this.Runecrafting.deserialize(reader.getVariableLengthChunk(), version);
    this.Magic.deserialize(reader.getVariableLengthChunk(), version);
    this.Prayer.deserialize(reader.getVariableLengthChunk(), version);
    this.Slayer.deserialize(reader.getVariableLengthChunk(), version);
    this.Herblore.deserialize(reader.getVariableLengthChunk(), version);
    this.Agility.deserialize(reader.getVariableLengthChunk(), version);
    this.Summoning.deserialize(reader.getVariableLengthChunk(), version);
    this.Items.deserialize(
      reader.getVariableLengthChunk(),
      version,
      idMap.items
    );
    this.Monsters.deserialize(
      reader.getVariableLengthChunk(),
      version,
      idMap.monsters
    );
    this.General.deserialize(reader.getVariableLengthChunk(), version);
    this.Combat.deserialize(reader.getVariableLengthChunk(), version);
    this.GolbinRaid.deserialize(reader.getVariableLengthChunk(), version);
    this.Astrology.deserialize(reader.getVariableLengthChunk(), version);
    this.Shop.deserialize(reader.getVariableLengthChunk(), version);
    if (version > 18)
      this.Township.deserialize(reader.getVariableLengthChunk(), version);
  }
  convertFromOldFormat(savegame, idMap) {
    savegame.monsterStats.forEach((monsterStat) => {
      var _a;
      const newID = idMap.monsters[monsterStat.monsterID];
      const monster =
        (_a = this.game.monsters.getObjectByID(newID)) !== null && _a !== void 0
          ? _a
          : this.game.monsters.getDummyObject(newID, DummyMonster, this.game);
      monsterStat.stats.forEach((statValue, statID) => {
        if (statValue !== 0) {
          this.Monsters.add(monster, statID, statValue);
        }
      });
    });
    savegame.itemStats.forEach((itemStat) => {
      var _a;
      const newID = idMap.items[itemStat.itemID];
      const item =
        (_a = this.game.items.getObjectByID(newID)) !== null && _a !== void 0
          ? _a
          : this.game.items.getDummyObject(newID, DummyItem, this.game);
      itemStat.stats.forEach((statValue, statID) => {
        if (statValue !== 0) {
          this.Items.add(item, statID, statValue);
        }
      });
    });
    this.General.convertFromOldStatArray(savegame.statsGeneral);
    this.Combat.convertFromOldStatArray(savegame.statsCombat);
    this.Woodcutting.add(
      WoodcuttingStats.Actions,
      savegame.statsWoodcutting[0].count
    );
    this.Woodcutting.add(
      WoodcuttingStats.TimeSpent,
      savegame.statsWoodcutting[3].count * 1000
    );
    this.Fishing.add(FishingStats.FishCaught, savegame.statsFishing[0].count);
    this.Fishing.add(
      FishingStats.TimeSpent,
      savegame.statsFishing[2].count * 1000
    );
    this.Fishing.add(FishingStats.JunkCaught, savegame.statsFishing[5].count);
    this.Fishing.add(
      FishingStats.SpecialItemsCaught,
      savegame.statsFishing[6].count
    );
    this.Firemaking.convertFromOldStatArray(savegame.statsFiremaking);
    this.Firemaking.remove(FiremakingStats.TimeSpent);
    this.Firemaking.add(
      FiremakingStats.TimeSpent,
      savegame.statsFiremaking[FiremakingStats.TimeSpent].count * 1000
    );
    this.Cooking.remove(FiremakingStats.TimeSpent);
    this.Cooking.add(
      FiremakingStats.TimeSpent,
      savegame.statsCooking[FiremakingStats.TimeSpent].count * 1000
    );
    this.Cooking.convertFromOldStatArray(savegame.statsCooking);
    this.Cooking.remove(CookingsStats.TimeSpent);
    this.Cooking.add(
      CookingsStats.TimeSpent,
      savegame.statsCooking[CookingsStats.TimeSpent].count * 1000
    );
    this.Mining.convertFromOldStatArray(savegame.statsMining);
    this.Smithing.convertFromOldStatArray(savegame.statsSmithing);
    this.Smithing.remove(3);
    this.Smithing.remove(SmithingStats.TimeSpent);
    this.Smithing.add(
      SmithingStats.TimeSpent,
      savegame.statsSmithing[SmithingStats.TimeSpent].count * 1000
    );
    this.Thieving.convertFromOldStatArray(savegame.statsThieving);
    this.Thieving.remove(ThievingStats.TimeSpentStunned);
    this.Thieving.add(
      ThievingStats.TimeSpentStunned,
      savegame.statsSmithing[ThievingStats.TimeSpentStunned].count * 1000
    );
    this.Farming.convertFromOldStatArray(savegame.statsFarming);
    this.Farming.remove(FarmingStats.AllotmentsHarvested);
    this.Fletching.convertFromOldStatArray(savegame.statsFletching);
    this.Crafting.convertFromOldStatArray(savegame.statsCrafting);
    this.Runecrafting.convertFromOldStatArray(savegame.statsRunecrafting);
    this.Herblore.convertFromOldStatArray(savegame.statsHerblore);
    savegame.golbinRaidStats.forEach((value, id) => {
      this.GolbinRaid.set(id, value);
    });
  }
  renderMutatedStats() {
    var _a;
    switch (
      (_a = this.game.openPage) === null || _a === void 0 ? void 0 : _a.id
    ) {
      case "melvorD:Statistics": {
        const tableData = statsData[selectedStatCategory];
        const tracker = this[tableData.trackerKey];
        if (tracker.wasMutated) {
          updateStats(selectedStatCategory);
          tracker.wasMutated = false;
        }
        break;
      }
      case "melvorD:GolbinRaid":
        if (this.GolbinRaid.wasMutated) {
          updateStats(StatCategories.GolbinRaid);
          this.GolbinRaid.wasMutated = false;
        }
        break;
    }
  }
}
var GeneralStats;
(function (GeneralStats) {
  GeneralStats[(GeneralStats["TotalGPEarned"] = 0)] = "TotalGPEarned";
  GeneralStats[(GeneralStats["TotalItemsSold"] = 1)] = "TotalItemsSold";
  GeneralStats[(GeneralStats["UsernameChanges"] = 2)] = "UsernameChanges";
  GeneralStats[(GeneralStats["AccountCreationDate"] = 3)] =
    "AccountCreationDate";
  GeneralStats[(GeneralStats["SignetRingHalvesMissed"] = 4)] =
    "SignetRingHalvesMissed";
})(GeneralStats || (GeneralStats = {}));
var PrayerStats;
(function (PrayerStats) {
  PrayerStats[(PrayerStats["BonesBuried"] = 0)] = "BonesBuried";
  PrayerStats[(PrayerStats["PrayerPointsEarned"] = 1)] = "PrayerPointsEarned";
  PrayerStats[(PrayerStats["PrayerPointsSpent"] = 2)] = "PrayerPointsSpent";
  PrayerStats[(PrayerStats["PrayerPointsPreserved"] = 3)] =
    "PrayerPointsPreserved";
})(PrayerStats || (PrayerStats = {}));
var SlayerStats;
(function (SlayerStats) {
  SlayerStats[(SlayerStats["SlayerCoinsEarned"] = 0)] = "SlayerCoinsEarned";
  SlayerStats[(SlayerStats["MonstersKilledOnTask"] = 1)] =
    "MonstersKilledOnTask";
})(SlayerStats || (SlayerStats = {}));
var WoodcuttingStats;
(function (WoodcuttingStats) {
  WoodcuttingStats[(WoodcuttingStats["Actions"] = 0)] = "Actions";
  WoodcuttingStats[(WoodcuttingStats["TimeSpent"] = 1)] = "TimeSpent";
  WoodcuttingStats[(WoodcuttingStats["LogsCut"] = 2)] = "LogsCut";
  WoodcuttingStats[(WoodcuttingStats["BirdNestsGotten"] = 3)] =
    "BirdNestsGotten";
})(WoodcuttingStats || (WoodcuttingStats = {}));
var FishingStats;
(function (FishingStats) {
  FishingStats[(FishingStats["FishCaught"] = 0)] = "FishCaught";
  FishingStats[(FishingStats["JunkCaught"] = 1)] = "JunkCaught";
  FishingStats[(FishingStats["SpecialItemsCaught"] = 2)] = "SpecialItemsCaught";
  FishingStats[(FishingStats["TimeSpent"] = 3)] = "TimeSpent";
  FishingStats[(FishingStats["Actions"] = 4)] = "Actions";
})(FishingStats || (FishingStats = {}));
var FiremakingStats;
(function (FiremakingStats) {
  FiremakingStats[(FiremakingStats["LogsBurnt"] = 0)] = "LogsBurnt";
  FiremakingStats[(FiremakingStats["GPBurnt"] = 1)] = "GPBurnt";
  FiremakingStats[(FiremakingStats["TimeSpent"] = 2)] = "TimeSpent";
  FiremakingStats[(FiremakingStats["BonusBonfireXP"] = 3)] = "BonusBonfireXP";
  FiremakingStats[(FiremakingStats["TotalActions"] = 4)] = "TotalActions";
  FiremakingStats[(FiremakingStats["BonfiresLit"] = 5)] = "BonfiresLit";
  FiremakingStats[(FiremakingStats["ItemsPreserved"] = 6)] = "ItemsPreserved";
  FiremakingStats[(FiremakingStats["GPEarned"] = 7)] = "GPEarned";
  FiremakingStats[(FiremakingStats["CoalGained"] = 8)] = "CoalGained";
})(FiremakingStats || (FiremakingStats = {}));
var CookingsStats;
(function (CookingsStats) {
  CookingsStats[(CookingsStats["FoodCooked"] = 0)] = "FoodCooked";
  CookingsStats[(CookingsStats["FoodBurnt"] = 1)] = "FoodBurnt";
  CookingsStats[(CookingsStats["TimeSpent"] = 2)] = "TimeSpent";
  CookingsStats[(CookingsStats["SuccessfulActions"] = 3)] = "SuccessfulActions";
  CookingsStats[(CookingsStats["PerfectCooks"] = 4)] = "PerfectCooks";
  CookingsStats[(CookingsStats["PassiveCooks"] = 5)] = "PassiveCooks";
  CookingsStats[(CookingsStats["ItemsUsed"] = 6)] = "ItemsUsed";
  CookingsStats[(CookingsStats["ItemsPreserved"] = 7)] = "ItemsPreserved";
})(CookingsStats || (CookingsStats = {}));
var MiningStats;
(function (MiningStats) {
  MiningStats[(MiningStats["Actions"] = 0)] = "Actions";
  MiningStats[(MiningStats["EmptyOresMined"] = 1)] = "EmptyOresMined";
  MiningStats[(MiningStats["TimeSpent"] = 2)] = "TimeSpent";
  MiningStats[(MiningStats["OresGained"] = 3)] = "OresGained";
  MiningStats[(MiningStats["GemsGained"] = 4)] = "GemsGained";
  MiningStats[(MiningStats["RockHPPreserved"] = 5)] = "RockHPPreserved";
  MiningStats[(MiningStats["RocksDepleted"] = 6)] = "RocksDepleted";
  MiningStats[(MiningStats["OnyxGemNodesFound"] = 7)] = "OnyxGemNodesFound";
  MiningStats[(MiningStats["TotalOnyxGemNodeHPFound"] = 8)] =
    "TotalOnyxGemNodeHPFound";
  MiningStats[(MiningStats["OrichaGemNodesFound"] = 9)] = "OrichaGemNodesFound";
  MiningStats[(MiningStats["TotalOrichaGemNodeHPFound"] = 10)] =
    "TotalOrichaGemNodeHPFound";
  MiningStats[(MiningStats["CeruleanGemNodesFound"] = 11)] =
    "CeruleanGemNodesFound";
  MiningStats[(MiningStats["TotalCeruleanGemNodeHPFound"] = 12)] =
    "TotalCeruleanGemNodeHPFound";
})(MiningStats || (MiningStats = {}));
var SmithingStats;
(function (SmithingStats) {
  SmithingStats[(SmithingStats["SmeltingActions"] = 0)] = "SmeltingActions";
  SmithingStats[(SmithingStats["SmithingActions"] = 1)] = "SmithingActions";
  SmithingStats[(SmithingStats["TimeSpent"] = 2)] = "TimeSpent";
  SmithingStats[(SmithingStats["BarsUsed"] = 3)] = "BarsUsed";
  SmithingStats[(SmithingStats["BarsPreserved"] = 4)] = "BarsPreserved";
  SmithingStats[(SmithingStats["OresUsed"] = 5)] = "OresUsed";
  SmithingStats[(SmithingStats["OresPreserved"] = 6)] = "OresPreserved";
  SmithingStats[(SmithingStats["TotalItemsSmithed"] = 7)] = "TotalItemsSmithed";
  SmithingStats[(SmithingStats["TotalBarsSmelted"] = 8)] = "TotalBarsSmelted";
})(SmithingStats || (SmithingStats = {}));
var ThievingStats;
(function (ThievingStats) {
  ThievingStats[(ThievingStats["SuccessfulPickpockets"] = 0)] =
    "SuccessfulPickpockets";
  ThievingStats[(ThievingStats["FailedPickpockets"] = 1)] = "FailedPickpockets";
  ThievingStats[(ThievingStats["DamageTakenFromNPCs"] = 2)] =
    "DamageTakenFromNPCs";
  ThievingStats[(ThievingStats["TimeSpentStunned"] = 3)] = "TimeSpentStunned";
  ThievingStats[(ThievingStats["TimeSpent"] = 4)] = "TimeSpent";
  ThievingStats[(ThievingStats["GPStolen"] = 5)] = "GPStolen";
  ThievingStats[(ThievingStats["CommonDrops"] = 6)] = "CommonDrops";
  ThievingStats[(ThievingStats["RareDrops"] = 7)] = "RareDrops";
  ThievingStats[(ThievingStats["AreaDrops"] = 8)] = "AreaDrops";
  ThievingStats[(ThievingStats["NpcDrops"] = 9)] = "NpcDrops";
})(ThievingStats || (ThievingStats = {}));
var FarmingStats;
(function (FarmingStats) {
  FarmingStats[(FarmingStats["AllotmentsHarvested"] = 0)] =
    "AllotmentsHarvested";
  FarmingStats[(FarmingStats["CompostUsed"] = 1)] = "CompostUsed";
  FarmingStats[(FarmingStats["CropsDied"] = 2)] = "CropsDied";
  FarmingStats[(FarmingStats["TimeSpentWaitingForCrops"] = 3)] =
    "TimeSpentWaitingForCrops";
  FarmingStats[(FarmingStats["TimeSpentWaitingForDeadCrops"] = 4)] =
    "TimeSpentWaitingForDeadCrops";
  FarmingStats[(FarmingStats["GloopUsed"] = 5)] = "GloopUsed";
  FarmingStats[(FarmingStats["HerbsHarvested"] = 6)] = "HerbsHarvested";
  FarmingStats[(FarmingStats["TreesHarvested"] = 7)] = "TreesHarvested";
  FarmingStats[(FarmingStats["SeedsPlanted"] = 8)] = "SeedsPlanted";
  FarmingStats[(FarmingStats["HerbsGained"] = 9)] = "HerbsGained";
  FarmingStats[(FarmingStats["LogsGained"] = 10)] = "LogsGained";
  FarmingStats[(FarmingStats["FoodGained"] = 11)] = "FoodGained";
})(FarmingStats || (FarmingStats = {}));
var FletchingStats;
(function (FletchingStats) {
  FletchingStats[(FletchingStats["ArrowShaftsMade"] = 0)] = "ArrowShaftsMade";
  FletchingStats[(FletchingStats["ItemsFletched"] = 1)] = "ItemsFletched";
  FletchingStats[(FletchingStats["TimeSpent"] = 2)] = "TimeSpent";
  FletchingStats[(FletchingStats["ItemsUsed"] = 3)] = "ItemsUsed";
  FletchingStats[(FletchingStats["ItemsPreserved"] = 4)] = "ItemsPreserved";
  FletchingStats[(FletchingStats["Actions"] = 5)] = "Actions";
})(FletchingStats || (FletchingStats = {}));
var CraftingStats;
(function (CraftingStats) {
  CraftingStats[(CraftingStats["ItemsCrafted"] = 0)] = "ItemsCrafted";
  CraftingStats[(CraftingStats["TimeSpent"] = 1)] = "TimeSpent";
  CraftingStats[(CraftingStats["ItemsUsed"] = 2)] = "ItemsUsed";
  CraftingStats[(CraftingStats["ItemsPreserved"] = 3)] = "ItemsPreserved";
  CraftingStats[(CraftingStats["Actions"] = 4)] = "Actions";
  CraftingStats[(CraftingStats["GPUsed"] = 5)] = "GPUsed";
  CraftingStats[(CraftingStats["GPPreserved"] = 6)] = "GPPreserved";
})(CraftingStats || (CraftingStats = {}));
var RunecraftingStats;
(function (RunecraftingStats) {
  RunecraftingStats[(RunecraftingStats["ItemsCrafted"] = 0)] = "ItemsCrafted";
  RunecraftingStats[(RunecraftingStats["TimeSpent"] = 1)] = "TimeSpent";
  RunecraftingStats[(RunecraftingStats["ItemsUsed"] = 2)] = "ItemsUsed";
  RunecraftingStats[(RunecraftingStats["ItemsPreserved"] = 3)] =
    "ItemsPreserved";
  RunecraftingStats[(RunecraftingStats["Actions"] = 4)] = "Actions";
})(RunecraftingStats || (RunecraftingStats = {}));
var HerbloreStats;
(function (HerbloreStats) {
  HerbloreStats[(HerbloreStats["PotionsMade"] = 0)] = "PotionsMade";
  HerbloreStats[(HerbloreStats["TimeSpent"] = 1)] = "TimeSpent";
  HerbloreStats[(HerbloreStats["PotionsUsed"] = 2)] = "PotionsUsed";
  HerbloreStats[(HerbloreStats["ChargesUsed"] = 3)] = "ChargesUsed";
  HerbloreStats[(HerbloreStats["ItemsUsed"] = 4)] = "ItemsUsed";
  HerbloreStats[(HerbloreStats["ItemsPreserved"] = 5)] = "ItemsPreserved";
  HerbloreStats[(HerbloreStats["Actions"] = 6)] = "Actions";
})(HerbloreStats || (HerbloreStats = {}));
var AgilityStats;
(function (AgilityStats) {
  AgilityStats[(AgilityStats["ObstaclesCompleted"] = 0)] = "ObstaclesCompleted";
  AgilityStats[(AgilityStats["CoursesCompleted"] = 1)] = "CoursesCompleted";
  AgilityStats[(AgilityStats["GPEarned"] = 2)] = "GPEarned";
  AgilityStats[(AgilityStats["TimeSpent"] = 3)] = "TimeSpent";
  AgilityStats[(AgilityStats["SlayerCoinsEarned"] = 4)] = "SlayerCoinsEarned";
  AgilityStats[(AgilityStats["ItemsEarned"] = 5)] = "ItemsEarned";
})(AgilityStats || (AgilityStats = {}));
var SummoningStats;
(function (SummoningStats) {
  SummoningStats[(SummoningStats["Actions"] = 0)] = "Actions";
  SummoningStats[(SummoningStats["TimeSpent"] = 1)] = "TimeSpent";
  SummoningStats[(SummoningStats["ItemsMade"] = 2)] = "ItemsMade";
  SummoningStats[(SummoningStats["ItemsUsed"] = 3)] = "ItemsUsed";
  SummoningStats[(SummoningStats["ItemsPreserved"] = 4)] = "ItemsPreserved";
  SummoningStats[(SummoningStats["GPUsed"] = 5)] = "GPUsed";
  SummoningStats[(SummoningStats["GPPreserved"] = 6)] = "GPPreserved";
  SummoningStats[(SummoningStats["SCUsed"] = 7)] = "SCUsed";
  SummoningStats[(SummoningStats["SCPreserved"] = 8)] = "SCPreserved";
  SummoningStats[(SummoningStats["TabletsUsed"] = 9)] = "TabletsUsed";
})(SummoningStats || (SummoningStats = {}));
var AltMagicStats;
(function (AltMagicStats) {
  AltMagicStats[(AltMagicStats["Actions"] = 0)] = "Actions";
  AltMagicStats[(AltMagicStats["TimeSpent"] = 1)] = "TimeSpent";
  AltMagicStats[(AltMagicStats["BarsMade"] = 2)] = "BarsMade";
  AltMagicStats[(AltMagicStats["BonesMade"] = 3)] = "BonesMade";
  AltMagicStats[(AltMagicStats["GemsMade"] = 4)] = "GemsMade";
  AltMagicStats[(AltMagicStats["GPGained"] = 5)] = "GPGained";
  AltMagicStats[(AltMagicStats["ItemsUsed"] = 6)] = "ItemsUsed";
  AltMagicStats[(AltMagicStats["RunesUsed"] = 7)] = "RunesUsed";
})(AltMagicStats || (AltMagicStats = {}));
var AstrologyStats;
(function (AstrologyStats) {
  AstrologyStats[(AstrologyStats["TimeSpent"] = 0)] = "TimeSpent";
  AstrologyStats[(AstrologyStats["StandardRerolls"] = 1)] = "StandardRerolls";
  AstrologyStats[(AstrologyStats["UniqueRerolls"] = 2)] = "UniqueRerolls";
  AstrologyStats[(AstrologyStats["MaxRollsHit"] = 3)] = "MaxRollsHit";
  AstrologyStats[(AstrologyStats["MinRollsHit"] = 4)] = "MinRollsHit";
  AstrologyStats[(AstrologyStats["Actions"] = 5)] = "Actions";
  AstrologyStats[(AstrologyStats["MeteoritesLocated"] = 6)] =
    "MeteoritesLocated";
  AstrologyStats[(AstrologyStats["TotalMeteoriteHP"] = 7)] = "TotalMeteoriteHP";
})(AstrologyStats || (AstrologyStats = {}));
var TownshipStats;
(function (TownshipStats) {})(TownshipStats || (TownshipStats = {}));
var ShopStats;
(function (ShopStats) {
  ShopStats[(ShopStats["PurchasesMade"] = 0)] = "PurchasesMade";
  ShopStats[(ShopStats["ItemsPurchased"] = 1)] = "ItemsPurchased";
  ShopStats[(ShopStats["GPSpent"] = 2)] = "GPSpent";
  ShopStats[(ShopStats["SCSpent"] = 3)] = "SCSpent";
  ShopStats[(ShopStats["RCSpent"] = 4)] = "RCSpent";
  ShopStats[(ShopStats["ItemsSpent"] = 5)] = "ItemsSpent";
  ShopStats[(ShopStats["GloveChargesPurchased"] = 6)] = "GloveChargesPurchased";
})(ShopStats || (ShopStats = {}));
var MonsterStats;
(function (MonsterStats) {
  MonsterStats[(MonsterStats["DamageDealtToPlayer"] = 0)] =
    "DamageDealtToPlayer";
  MonsterStats[(MonsterStats["DamageTakenFromPlayer"] = 1)] =
    "DamageTakenFromPlayer";
  MonsterStats[(MonsterStats["KilledByPlayer"] = 2)] = "KilledByPlayer";
  MonsterStats[(MonsterStats["KilledPlayer"] = 3)] = "KilledPlayer";
  MonsterStats[(MonsterStats["HitsToPlayer"] = 4)] = "HitsToPlayer";
  MonsterStats[(MonsterStats["HitsFromPlayer"] = 5)] = "HitsFromPlayer";
  MonsterStats[(MonsterStats["EnemyMissed"] = 6)] = "EnemyMissed";
  MonsterStats[(MonsterStats["PlayerMissed"] = 7)] = "PlayerMissed";
  MonsterStats[(MonsterStats["Seen"] = 8)] = "Seen";
  MonsterStats[(MonsterStats["RanAway"] = 9)] = "RanAway";
})(MonsterStats || (MonsterStats = {}));
var CombatStats;
(function (CombatStats) {
  CombatStats[(CombatStats["MonstersKilled"] = 0)] = "MonstersKilled";
  CombatStats[(CombatStats["DamageDealt"] = 1)] = "DamageDealt";
  CombatStats[(CombatStats["DamageTaken"] = 2)] = "DamageTaken";
  CombatStats[(CombatStats["AttacksMissed"] = 3)] = "AttacksMissed";
  CombatStats[(CombatStats["Deaths"] = 4)] = "Deaths";
  CombatStats[(CombatStats["FoodConsumed"] = 5)] = "FoodConsumed";
  CombatStats[(CombatStats["HPFromFood"] = 6)] = "HPFromFood";
  CombatStats[(CombatStats["TimeSpentSpawning"] = 7)] = "TimeSpentSpawning";
  CombatStats[(CombatStats["TimeSpentFighting"] = 8)] = "TimeSpentFighting";
  CombatStats[(CombatStats["TimeSpentPaused"] = 9)] = "TimeSpentPaused";
  CombatStats[(CombatStats["ItemsLooted"] = 10)] = "ItemsLooted";
  CombatStats[(CombatStats["GPEarned"] = 11)] = "GPEarned";
  CombatStats[(CombatStats["DungeonRewards"] = 12)] = "DungeonRewards";
})(CombatStats || (CombatStats = {}));
var RaidStats;
(function (RaidStats) {
  RaidStats[(RaidStats["GolbinsKilled"] = 0)] = "GolbinsKilled";
  RaidStats[(RaidStats["HighestWave"] = 1)] = "HighestWave";
  RaidStats[(RaidStats["RaidCoinsEarned"] = 2)] = "RaidCoinsEarned";
  RaidStats[(RaidStats["TotalTimeSpent"] = 3)] = "TotalTimeSpent";
  RaidStats[(RaidStats["LongestRaid"] = 4)] = "LongestRaid";
  RaidStats[(RaidStats["TotalDeath"] = 5)] = "TotalDeath";
  RaidStats[(RaidStats["WavesCompleted"] = 6)] = "WavesCompleted";
})(RaidStats || (RaidStats = {}));
var ItemStats;
(function (ItemStats) {
  ItemStats[(ItemStats["TimesFound"] = 0)] = "TimesFound";
  ItemStats[(ItemStats["TimesSold"] = 1)] = "TimesSold";
  ItemStats[(ItemStats["GpFromSale"] = 2)] = "GpFromSale";
  ItemStats[(ItemStats["TimesLostToDeath"] = 3)] = "TimesLostToDeath";
  ItemStats[(ItemStats["DamageTaken"] = 4)] = "DamageTaken";
  ItemStats[(ItemStats["DamageDealt"] = 5)] = "DamageDealt";
  ItemStats[(ItemStats["MissedAttacks"] = 6)] = "MissedAttacks";
  ItemStats[(ItemStats["TimesEaten"] = 7)] = "TimesEaten";
  ItemStats[(ItemStats["HealedFor"] = 8)] = "HealedFor";
  ItemStats[(ItemStats["TotalAttacks"] = 9)] = "TotalAttacks";
  ItemStats[(ItemStats["AmountUsedInCombat"] = 10)] = "AmountUsedInCombat";
  ItemStats[(ItemStats["TimeWaited"] = 11)] = "TimeWaited";
  ItemStats[(ItemStats["TimesDied"] = 12)] = "TimesDied";
  ItemStats[(ItemStats["TimesGrown"] = 13)] = "TimesGrown";
  ItemStats[(ItemStats["HarvestAmount"] = 14)] = "HarvestAmount";
  ItemStats[(ItemStats["EnemiesKilled"] = 15)] = "EnemiesKilled";
  ItemStats[(ItemStats["TimesOpened"] = 16)] = "TimesOpened";
  ItemStats[(ItemStats["TimesTransformed"] = 17)] = "TimesTransformed";
  ItemStats[(ItemStats["TimesBuried"] = 18)] = "TimesBuried";
})(ItemStats || (ItemStats = {}));
var StatCategories;
(function (StatCategories) {
  StatCategories[(StatCategories["General"] = 0)] = "General";
  StatCategories[(StatCategories["Combat"] = 1)] = "Combat";
  StatCategories[(StatCategories["Woodcutting"] = 2)] = "Woodcutting";
  StatCategories[(StatCategories["Fishing"] = 3)] = "Fishing";
  StatCategories[(StatCategories["Firemaking"] = 4)] = "Firemaking";
  StatCategories[(StatCategories["Cooking"] = 5)] = "Cooking";
  StatCategories[(StatCategories["Mining"] = 6)] = "Mining";
  StatCategories[(StatCategories["Smithing"] = 7)] = "Smithing";
  StatCategories[(StatCategories["Thieving"] = 8)] = "Thieving";
  StatCategories[(StatCategories["Farming"] = 9)] = "Farming";
  StatCategories[(StatCategories["Fletching"] = 10)] = "Fletching";
  StatCategories[(StatCategories["Crafting"] = 11)] = "Crafting";
  StatCategories[(StatCategories["Runecrafting"] = 12)] = "Runecrafting";
  StatCategories[(StatCategories["Herblore"] = 13)] = "Herblore";
  StatCategories[(StatCategories["MeleeCombat"] = 14)] = "MeleeCombat";
  StatCategories[(StatCategories["RangedCombat"] = 15)] = "RangedCombat";
  StatCategories[(StatCategories["MagicCombat"] = 16)] = "MagicCombat";
  StatCategories[(StatCategories["Agility"] = 17)] = "Agility";
  StatCategories[(StatCategories["Summoning"] = 18)] = "Summoning";
  StatCategories[(StatCategories["AltMagic"] = 19)] = "AltMagic";
  StatCategories[(StatCategories["Astrology"] = 20)] = "Astrology";
  StatCategories[(StatCategories["Shop"] = 21)] = "Shop";
  StatCategories[(StatCategories["GolbinRaid"] = 22)] = "GolbinRaid";
  StatCategories[(StatCategories["Slayer"] = 23)] = "Slayer";
  StatCategories[(StatCategories["Prayer"] = 24)] = "Prayer";
  StatCategories[(StatCategories["Township"] = 25)] = "Township";
})(StatCategories || (StatCategories = {}));
const statsData = [
  {
    tableID: "general-stats-table",
    get title() {
      return getLangString("STATISTICS", "CATEGORY_GENERAL");
    },
    borderClass: "border-settings",
    trackerKey: "General",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_SKILL_LEVEL");
        },
        get value() {
          return game.completion.skillProgress.currentCount.getSum();
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_XP");
        },
        get value() {
          return Math.floor(
            game.skills.reduce((prev, skill) => prev + skill.xp, 0)
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_MASTERY_LEVEL");
        },
        get value() {
          return game.completion.masteryProgress.currentCount.getSum();
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_MASTERY_XP");
        },
        get value() {
          return Math.floor(
            game.masterySkills.reduce((totalXP, skill) => {
              if (skill.hasMastery) totalXP += skill.totalMasteryXP;
              return totalXP;
            }, 0)
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_GP_GAINED");
        },
        get value() {
          return Math.floor(game.stats.General.get(GeneralStats.TotalGPEarned));
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_ITEMS_SOLD");
        },
        get value() {
          return game.stats.General.get(GeneralStats.TotalItemsSold);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "USERNAME_CHANGES");
        },
        get value() {
          return game.stats.General.get(GeneralStats.UsernameChanges);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ACCOUNT_AGE");
        },
        get value() {
          return (
            Date.now() -
            game.stats.General.get(GeneralStats.AccountCreationDate)
          );
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "SIGNET_RING_HALVES_MISSED");
        },
        get value() {
          return game.stats.General.get(GeneralStats.SignetRingHalvesMissed);
        },
      },
    ],
  },
  {
    tableID: "combat-stats-table",
    get title() {
      return getLangString("PAGE_NAME", `Combat`);
    },
    borderClass: "border-settings",
    trackerKey: "Combat",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "MONSTERS_SLAIN");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.MonstersKilled);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_DUNGEONS_COMPLETED");
        },
        get value() {
          return game.dungeons.reduce((previous, current) => {
            return previous + game.combat.getDungeonCompleteCount(current);
          }, 0);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_DAMAGE_DEALT");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.DamageDealt);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_DAMAGE_TAKEN");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.DamageTaken);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_ATTACKS_MISSED");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.AttacksMissed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "DEATHS");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.Deaths);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_FOOD_CONSUMED");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.FoodConsumed);
        },
      },
      {
        get name() {
          return getLangString(
            "STATISTICS",
            "HITPOINTS_GAINED_FROM_EATING_FOOD"
          );
        },
        get value() {
          return game.stats.Combat.get(CombatStats.HPFromFood);
        },
      },
      {
        get name() {
          return getLangString(
            "STATISTICS",
            "TIME_SPENT_WAITING_FOR_MONSTERS_TO_SPAWN"
          );
        },
        get value() {
          return game.stats.Combat.get(CombatStats.TimeSpentSpawning);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_FIGHTING_MONSTERS");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.TimeSpentFighting);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_PAUSED");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.TimeSpentPaused);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_TIME_SPENT");
        },
        get value() {
          return game.stats.Combat.getSum([
            CombatStats.TimeSpentSpawning,
            CombatStats.TimeSpentFighting,
            CombatStats.TimeSpentPaused,
          ]);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_LOOTED");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.ItemsLooted);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_EARNED");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.GPEarned);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "DUNGEON_REWARDS_EARNED");
        },
        get value() {
          return game.stats.Combat.get(CombatStats.DungeonRewards);
        },
      },
    ],
  },
  {
    tableID: "woodcutting-stats-table",
    get title() {
      return game.woodcutting.name;
    },
    borderClass: "border-woodcutting",
    trackerKey: "Woodcutting",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "TREES_CUT");
        },
        get value() {
          return game.stats.Woodcutting.get(WoodcuttingStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_CUTTING");
        },
        get value() {
          return game.stats.Woodcutting.get(WoodcuttingStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "LOGS_EARNED");
        },
        get value() {
          return game.stats.Woodcutting.get(WoodcuttingStats.LogsCut);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "BIRD_NESTS_EARNED");
        },
        get value() {
          return game.stats.Woodcutting.get(WoodcuttingStats.BirdNestsGotten);
        },
      },
    ],
  },
  {
    tableID: "fishing-stats-table",
    get title() {
      return game.fishing.name;
    },
    borderClass: "border-fishing",
    trackerKey: "Fishing",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.fishing.name,
          });
        },
        get value() {
          return game.stats.Fishing.get(FishingStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_FISHING");
        },
        get value() {
          return game.stats.Fishing.get(FishingStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "FISH_CAUGHT");
        },
        get value() {
          return game.stats.Fishing.get(FishingStats.FishCaught);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "JUNK_ITEMS_CAUGHT");
        },
        get value() {
          return game.stats.Fishing.get(FishingStats.JunkCaught);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SPECIAL_ITEMS_CAUGHT");
        },
        get value() {
          return game.stats.Fishing.get(FishingStats.SpecialItemsCaught);
        },
      },
    ],
  },
  {
    tableID: "firemaking-stats-table",
    get title() {
      return game.firemaking.name;
    },
    borderClass: "border-firemaking",
    trackerKey: "Firemaking",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "FIRES_LIT");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.TotalActions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "BONFIRES_LIT");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.BonfiresLit);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_BURNING");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_EARNED");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.GPEarned);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "COAL_GAINED");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.CoalGained);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "LOGS_BURNT");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.LogsBurnt);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "LOGS_PRESERVED");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.ItemsPreserved);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_SACRIFICED_TO_THE_FIRE_GODS");
        },
        get value() {
          return game.stats.Firemaking.get(FiremakingStats.GPBurnt);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "BONUS_XP_GAINED_FROM_BONFIRES");
        },
        get value() {
          return Math.floor(
            game.stats.Firemaking.get(FiremakingStats.BonusBonfireXP)
          );
        },
      },
    ],
  },
  {
    tableID: "cooking-stats-table",
    get title() {
      return game.cooking.name;
    },
    borderClass: "border-cooking",
    trackerKey: "Cooking",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "FAILED_COOKS");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.FoodBurnt);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SUCCESSFUL_COOKS");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.SuccessfulActions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "PASSIVE_COOKS");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.PassiveCooks);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "PERFECT_COOKS");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.PerfectCooks);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_COOKING");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "FOOD_COOKED");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.FoodCooked);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "INGREDIENTS_USED");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.ItemsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "INGREDIENTS_PRESERVED");
        },
        get value() {
          return game.stats.Cooking.get(CookingsStats.ItemsPreserved);
        },
      },
    ],
  },
  {
    tableID: "mining-stats-table",
    get title() {
      return game.mining.name;
    },
    borderClass: "border-mining",
    trackerKey: "Mining",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.mining.name,
          });
        },
        get value() {
          return game.stats.Mining.get(MiningStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_MINING");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "ORES_MINED");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.OresGained);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GEMS_MINED");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.GemsGained);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "EMPTY_ORES_MINED");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.EmptyOresMined);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ROCKS_DEPLETED");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.RocksDepleted);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ROCK_HP_PRESERVED");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.RockHPPreserved);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ONYX_GEM_NODES_FOUND");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.OnyxGemNodesFound);
        },
        namespace: "melvorTotH",
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_ONYX_HP_FOUND");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.TotalOnyxGemNodeHPFound);
        },
        namespace: "melvorTotH",
      },
      {
        get name() {
          return getLangString("STATISTICS", "ORICHA_GEM_NODES_FOUND");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.OrichaGemNodesFound);
        },
        namespace: "melvorTotH",
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_ORICHA_HP_FOUND");
        },
        get value() {
          return game.stats.Mining.get(MiningStats.TotalOrichaGemNodeHPFound);
        },
        namespace: "melvorTotH",
      },
    ],
  },
  {
    tableID: "smithing-stats-table",
    get title() {
      return game.smithing.name;
    },
    borderClass: "border-smithing",
    trackerKey: "Smithing",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "SMELTING_ACTIONS");
        },
        get value() {
          return game.stats.Smithing.get(SmithingStats.SmeltingActions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SMITHING_ACTIONS");
        },
        get value() {
          return game.stats.Smithing.get(SmithingStats.SmithingActions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_ACTIONS");
        },
        get value() {
          return game.stats.Smithing.getSum([
            SmithingStats.SmithingActions,
            SmithingStats.SmeltingActions,
          ]);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_SMITHING");
        },
        get value() {
          return Math.floor(game.stats.Smithing.get(SmithingStats.TimeSpent));
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "BARS_SMELTED");
        },
        get value() {
          return Math.floor(
            game.stats.Smithing.get(SmithingStats.TotalBarsSmelted)
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_SMITHED");
        },
        get value() {
          return Math.floor(
            game.stats.Smithing.get(SmithingStats.TotalItemsSmithed)
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ORES_USED");
        },
        get value() {
          return Math.floor(game.stats.Smithing.get(SmithingStats.OresUsed));
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ORES_PRESERVED");
        },
        get value() {
          return Math.floor(
            game.stats.Smithing.get(SmithingStats.OresPreserved)
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "BARS_USED");
        },
        get value() {
          return Math.floor(game.stats.Smithing.get(SmithingStats.BarsUsed));
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "BARS_PRESERVED");
        },
        get value() {
          return Math.floor(
            game.stats.Smithing.get(SmithingStats.BarsPreserved)
          );
        },
      },
    ],
  },
  {
    tableID: "thieving-stats-table",
    get title() {
      return game.thieving.name;
    },
    borderClass: "border-thieving",
    trackerKey: "Thieving",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "SUCCESSFUL_PICKPOCKETS");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.SuccessfulPickpockets);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "FAILED_PICKPOCKETS");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.FailedPickpockets);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_PICKPOCKETS");
        },
        get value() {
          return game.stats.Thieving.getSum([
            ThievingStats.FailedPickpockets,
            ThievingStats.SuccessfulPickpockets,
          ]);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_STEALING");
        },
        get value() {
          return Math.floor(game.stats.Thieving.get(ThievingStats.TimeSpent));
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_STUNNED");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.TimeSpentStunned);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_TIME_SPENT");
        },
        get value() {
          return game.stats.Thieving.getSum([
            ThievingStats.TimeSpentStunned,
            ThievingStats.TimeSpent,
          ]);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_STOLEN");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.GPStolen);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "COMMON_ITEMS_STOLEN");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.CommonDrops);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RARE_ITEMS_STOLEN");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.RareDrops);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "AREA_UNIQUE_ITEMS_STOLEN");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.AreaDrops);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "NPC_UNIQUE_ITEMS_STOLEN");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.NpcDrops);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_ITEMS_STOLEN");
        },
        get value() {
          return game.stats.Thieving.getSum([
            ThievingStats.CommonDrops,
            ThievingStats.RareDrops,
            ThievingStats.AreaDrops,
            ThievingStats.NpcDrops,
          ]);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "DAMAGE_TAKEN_FROM_NPCS");
        },
        get value() {
          return game.stats.Thieving.get(ThievingStats.DamageTakenFromNPCs);
        },
      },
    ],
  },
  {
    tableID: "farming-stats-table",
    get title() {
      return game.farming.name;
    },
    borderClass: "border-farming",
    trackerKey: "Farming",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "ALLOTMENT_PATCHES_HARVESTED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.AllotmentsHarvested);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "HERB_PATCHES_HARVESTED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.HerbsHarvested);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TREES_HARVESTED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.TreesHarvested);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "CROPS_DIED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.CropsDied);
        },
      },
      {
        get name() {
          return getLangString(
            "STATISTICS",
            "TIME_SPENT_WAITING_FOR_PLANTS_TO_GROW"
          );
        },
        get value() {
          return (
            game.stats.Farming.get(FarmingStats.TimeSpentWaitingForCrops) * 1000
          );
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString(
            "STATISTICS",
            "TIME_SPENT_WAITING_FOR_PLANTS_TO_DIE"
          );
        },
        get value() {
          return (
            game.stats.Farming.get(FarmingStats.TimeSpentWaitingForDeadCrops) *
            1000
          );
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_TIME_SPENT");
        },
        get value() {
          return (
            game.stats.Farming.getSum([
              FarmingStats.TimeSpentWaitingForCrops,
              FarmingStats.TimeSpentWaitingForDeadCrops,
            ]) * 1000
          );
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "FOOD_GAINED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.FoodGained);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "HERBS_GAINED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.HerbsGained);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "LOGS_GAINED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.LogsGained);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "COMPOST_USED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.CompostUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "WEIRD_GLOOP_USED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.GloopUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SEEDS_PLANTED");
        },
        get value() {
          return game.stats.Farming.get(FarmingStats.SeedsPlanted);
        },
      },
    ],
  },
  {
    tableID: "fletching-stats-table",
    get title() {
      return game.fletching.name;
    },
    borderClass: "border-fletching",
    trackerKey: "Fletching",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.fletching.name,
          });
        },
        get value() {
          return game.stats.Fletching.get(FletchingStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_FLETCHING");
        },
        get value() {
          return game.stats.Fletching.get(FletchingStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "ARROW_SHAFTS_CREATED");
        },
        get value() {
          return game.stats.Fletching.get(FletchingStats.ArrowShaftsMade);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_FLETCHED");
        },
        get value() {
          return game.stats.Fletching.get(FletchingStats.ItemsFletched);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_USED");
        },
        get value() {
          return game.stats.Fletching.get(FletchingStats.ItemsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_PRESERVED");
        },
        get value() {
          return game.stats.Fletching.get(FletchingStats.ItemsPreserved);
        },
      },
    ],
  },
  {
    tableID: "crafting-stats-table",
    get title() {
      return game.crafting.name;
    },
    borderClass: "border-crafting",
    trackerKey: "Crafting",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.crafting.name,
          });
        },
        get value() {
          return game.stats.Crafting.get(CraftingStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_CRAFTING");
        },
        get value() {
          return game.stats.Crafting.get(CraftingStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_CRAFTED");
        },
        get value() {
          return game.stats.Crafting.get(CraftingStats.ItemsCrafted);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_USED");
        },
        get value() {
          return game.stats.Crafting.get(CraftingStats.ItemsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_PRESERVED");
        },
        get value() {
          return game.stats.Crafting.get(CraftingStats.ItemsPreserved);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_USED");
        },
        get value() {
          return game.stats.Crafting.get(CraftingStats.GPUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_PRESERVED");
        },
        get value() {
          return game.stats.Crafting.get(CraftingStats.GPPreserved);
        },
      },
    ],
  },
  {
    tableID: "runecrafting-stats-table",
    get title() {
      return game.runecrafting.name;
    },
    borderClass: "border-runecrafting",
    trackerKey: "Runecrafting",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.runecrafting.name,
          });
        },
        get value() {
          return game.stats.Runecrafting.get(RunecraftingStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_RUNECRAFTING");
        },
        get value() {
          return game.stats.Runecrafting.get(RunecraftingStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_RUNECRAFTED");
        },
        get value() {
          return game.stats.Runecrafting.get(RunecraftingStats.ItemsCrafted);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_USED");
        },
        get value() {
          return game.stats.Runecrafting.get(RunecraftingStats.ItemsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_PRESERVED");
        },
        get value() {
          return game.stats.Runecrafting.get(RunecraftingStats.ItemsPreserved);
        },
      },
    ],
  },
  {
    tableID: "herblore-stats-table",
    get title() {
      return game.herblore.name;
    },
    borderClass: "border-herblore",
    trackerKey: "Herblore",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.herblore.name,
          });
        },
        get value() {
          return game.stats.Herblore.get(HerbloreStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_BREWING");
        },
        get value() {
          return game.stats.Herblore.get(HerbloreStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "POTIONS_BREWED");
        },
        get value() {
          return game.stats.Herblore.get(HerbloreStats.PotionsMade);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "REAGENTS_USED");
        },
        get value() {
          return game.stats.Herblore.get(HerbloreStats.ItemsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "REAGENTS_PRESERVED");
        },
        get value() {
          return game.stats.Herblore.get(HerbloreStats.ItemsPreserved);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "POTIONS_USED");
        },
        get value() {
          return game.stats.Herblore.get(HerbloreStats.PotionsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "POTION_CHARGES_USED");
        },
        get value() {
          return game.stats.Herblore.get(HerbloreStats.ChargesUsed);
        },
      },
    ],
  },
  {
    tableID: "melee-combat-stats-table",
    get title() {
      return getLangString("STATISTICS", "CATEGORY_MELEE_COMBAT");
    },
    borderClass: "border-attack",
    trackerKey: "Combat",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "MELEE_ATTACKS_MADE");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) => item instanceof WeaponItem && item.attackType === "melee",
            ItemStats.TotalAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MELEE_ATTACKS_HIT");
        },
        get value() {
          return game.stats.getFilteredItemStatsDiff(
            (item) => item instanceof WeaponItem && item.attackType === "melee",
            ItemStats.TotalAttacks,
            ItemStats.MissedAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MELEE_ATTACKS_MISSED");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) => item instanceof WeaponItem && item.attackType === "melee",
            ItemStats.MissedAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MELEE_DAMAGE_DEALT");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) => item instanceof WeaponItem && item.attackType === "melee",
            ItemStats.DamageDealt
          );
        },
      },
    ],
  },
  {
    tableID: "ranged-combat-stats-table",
    get title() {
      return getLangString("STATISTICS", "CATEGORY_RANGED_COMBAT");
    },
    borderClass: "border-ranged",
    trackerKey: "Combat",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "RANGED_ATTACKS_MADE");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) =>
              item instanceof WeaponItem && item.attackType === "ranged",
            ItemStats.TotalAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RANGED_ATTACKS_HIT");
        },
        get value() {
          return game.stats.getFilteredItemStatsDiff(
            (item) =>
              item instanceof WeaponItem && item.attackType === "ranged",
            ItemStats.TotalAttacks,
            ItemStats.MissedAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RANGED_ATTACKS_MISSED");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) =>
              item instanceof WeaponItem && item.attackType === "ranged",
            ItemStats.MissedAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RANGED_DAMAGE_DEALT");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) =>
              item instanceof WeaponItem && item.attackType === "ranged",
            ItemStats.DamageDealt
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "AMMO_USED");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) =>
              item instanceof EquipmentItem &&
              item.validSlots.includes("Quiver"),
            ItemStats.AmountUsedInCombat
          );
        },
      },
    ],
  },
  {
    tableID: "magic-combat-stats-table",
    get title() {
      return getLangString("STATISTICS", "CATEGORY_MAGIC_COMBAT");
    },
    borderClass: "border-magic",
    trackerKey: "Combat",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "MAGIC_ATTACKS_MADE");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) => item instanceof WeaponItem && item.attackType === "magic",
            ItemStats.TotalAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MAGIC_ATTACKS_HIT");
        },
        get value() {
          return game.stats.getFilteredItemStatsDiff(
            (item) => item instanceof WeaponItem && item.attackType === "magic",
            ItemStats.TotalAttacks,
            ItemStats.MissedAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MAGIC_ATTACKS_MISSED");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) => item instanceof WeaponItem && item.attackType === "magic",
            ItemStats.MissedAttacks
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MAGIC_DAMAGE_DEALT");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) => item instanceof WeaponItem && item.attackType === "magic",
            ItemStats.DamageDealt
          );
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RUNES_USED");
        },
        get value() {
          return game.stats.getFilteredItemStatsTotal(
            (item) => item.type === "Rune",
            ItemStats.AmountUsedInCombat
          );
        },
      },
    ],
  },
  {
    tableID: "agility-stats-table",
    get title() {
      return game.agility.name;
    },
    borderClass: "border-agility",
    trackerKey: "Agility",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "OBSTACLES_COMPLETED");
        },
        get value() {
          return game.stats.Agility.get(AgilityStats.ObstaclesCompleted);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "COURSES_COMPLETED");
        },
        get value() {
          return game.stats.Agility.get(AgilityStats.CoursesCompleted);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_TRAINING_AGILITY");
        },
        get value() {
          return game.stats.Agility.get(AgilityStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_EARNED");
        },
        get value() {
          return game.stats.Agility.get(AgilityStats.GPEarned);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "OBSTACLES_BUILT");
        },
        get value() {
          return game.agility.getTotalObstacleBuiltCount();
        },
      },
    ],
  },
  {
    tableID: "summoning-stats-table",
    get title() {
      return game.summoning.name;
    },
    borderClass: "border-summoning",
    trackerKey: "Summoning",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.summoning.name,
          });
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_CREATING_TABLETS");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TABLETS_MADE");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.ItemsMade);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_USED");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.ItemsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_PRESERVED");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.ItemsPreserved);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_USED");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.GPUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_PRESERVED");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.GPPreserved);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SLAYER_COINS_USED");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.SCUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SLAYER_COINS_PRESERVED");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.SCPreserved);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TABLETS_USED");
        },
        get value() {
          return game.stats.Summoning.get(SummoningStats.TabletsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_MARKS_DISCOVERED");
        },
        get value() {
          return game.summoning.totalMarksDiscovered;
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SYNERGIES_UNLOCKED");
        },
        get value() {
          return game.summoning.totalSynergiesUnlocked;
        },
      },
    ],
  },
  {
    tableID: "alt-magic-stats-table",
    get title() {
      return getLangString("PAGE_NAME", `AltMagic`);
    },
    borderClass: "border-magic",
    trackerKey: "Magic",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "ALT_MAGIC_SPELLS_CAST");
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.Actions);
        },
      },
      {
        get name() {
          return getLangString(
            "STATISTICS",
            "TIME_SPENT_CASTING_ALT_MAGIC_SPELLS"
          );
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "BARS_SUPERHEATED");
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.BarsMade);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GEMS_CREATED");
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.GemsMade);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "BONES_CREATED_FROM_NOTHING");
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.BonesMade);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_TRANSMUTED_FROM_ALCHEMY");
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.GPGained);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_TRANSFORMED");
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.ItemsUsed);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RUNES_USED");
        },
        get value() {
          return game.stats.Magic.get(AltMagicStats.RunesUsed);
        },
      },
    ],
  },
  {
    tableID: "astrology-stats-table",
    get title() {
      return game.astrology.name;
    },
    borderClass: "border-astrology",
    trackerKey: "Astrology",
    rows: [
      {
        get name() {
          return templateLangString("STATISTICS", "SKILL_ACTIONS", {
            skillName: game.astrology.name,
          });
        },
        get value() {
          return game.stats.Astrology.get(AstrologyStats.Actions);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_STAR_GAZING");
        },
        get value() {
          return game.stats.Astrology.get(AstrologyStats.TimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString(
            "STATISTICS",
            "TIMES_STANDARD_MODIFIERS_REROLLED"
          );
        },
        get value() {
          return game.stats.Astrology.get(AstrologyStats.StandardRerolls);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIMES_UNIQUE_MODIFIERS_REROLLED");
        },
        get value() {
          return game.stats.Astrology.get(AstrologyStats.UniqueRerolls);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIMES_MAXIMUM_ROLL_WAS_HIT");
        },
        get value() {
          return game.stats.Astrology.get(AstrologyStats.MaxRollsHit);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIMES_MINIMUM_ROLL_WAS_HIT");
        },
        get value() {
          return game.stats.Astrology.get(AstrologyStats.MinRollsHit);
        },
      },
    ],
  },
  {
    tableID: "shop-stats-table",
    get title() {
      return getLangString("PAGE_NAME", `Shop`);
    },
    borderClass: "border-shop",
    trackerKey: "Shop",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "PURCHASES_MADE");
        },
        get value() {
          return game.stats.Shop.get(ShopStats.PurchasesMade);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "UPGRADES_PURCHASED");
        },
        get value() {
          return game.shop.getTotalUpgradesPurchased(false);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_PURCHASED");
        },
        get value() {
          return game.stats.Shop.get(ShopStats.ItemsPurchased);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GLOVE_CHARGES_PURCHASED");
        },
        get value() {
          return game.stats.Shop.get(ShopStats.GloveChargesPurchased);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GP_SPENT");
        },
        get value() {
          return game.stats.Shop.get(ShopStats.GPSpent);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SLAYER_COINS_SPENT");
        },
        get value() {
          return game.stats.Shop.get(ShopStats.SCSpent);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RAID_COINS_SPENT");
        },
        get value() {
          return game.stats.Shop.get(ShopStats.RCSpent);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ITEMS_SPENT");
        },
        get value() {
          return game.stats.Shop.get(ShopStats.ItemsSpent);
        },
      },
    ],
  },
  {
    tableID: "raid-stats-table",
    get title() {
      return getLangString("PAGE_NAME", `GolbinRaid`);
    },
    borderClass: "border-combat",
    trackerKey: "GolbinRaid",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "GOLBINS_SLAUGHTERED");
        },
        get value() {
          return game.stats.GolbinRaid.get(RaidStats.GolbinsKilled);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "HIGHEST_WAVE_REACHED");
        },
        get value() {
          return game.stats.GolbinRaid.get(RaidStats.HighestWave);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RAID_COINS_EARNED");
        },
        get value() {
          return game.stats.GolbinRaid.get(RaidStats.RaidCoinsEarned);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TIME_SPENT_RAIDING");
        },
        get value() {
          return game.stats.GolbinRaid.get(RaidStats.TotalTimeSpent);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "LONGEST_RAID");
        },
        get value() {
          return game.stats.GolbinRaid.get(RaidStats.LongestRaid);
        },
        isTime: true,
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_RAID_DEATHS");
        },
        get value() {
          return game.stats.GolbinRaid.get(RaidStats.TotalDeath);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "WAVES_COMPLETED");
        },
        get value() {
          return game.stats.GolbinRaid.get(RaidStats.WavesCompleted);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "RAID_UPGRADES_PURCHASED");
        },
        get value() {
          return game.shop.getTotalUpgradesPurchased(true);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "GOLBIN_CRATES_PURCHASED");
        },
        get value() {
          return game.golbinRaid.cratesPurchased;
        },
      },
    ],
  },
  {
    tableID: "slayer-stats-table",
    get title() {
      return game.slayer.name;
    },
    borderClass: "border-slayer",
    trackerKey: "Slayer",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "EASY_TASKS_COMPLETED");
        },
        get value() {
          return game.combat.slayerTask.completion[SlayerTierID.Easy];
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "NORMAL_TASKS_COMPLETED");
        },
        get value() {
          return game.combat.slayerTask.completion[SlayerTierID.Normal];
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "HARD_TASKS_COMPLETED");
        },
        get value() {
          return game.combat.slayerTask.completion[SlayerTierID.Hard];
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "ELITE_TASKS_COMPLETED");
        },
        get value() {
          return game.combat.slayerTask.completion[SlayerTierID.Elite];
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MASTER_TASKS_COMPLETED");
        },
        get value() {
          return game.combat.slayerTask.completion[SlayerTierID.Master];
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_TASKS_COMPLETED");
        },
        get value() {
          return arrSum(game.combat.slayerTask.completion);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "SLAYER_COINS_EARNED");
        },
        get value() {
          return game.stats.Slayer.get(SlayerStats.SlayerCoinsEarned);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "MONSTERS_SLAIN_ON_TASKS");
        },
        get value() {
          return game.stats.Slayer.get(SlayerStats.MonstersKilledOnTask);
        },
      },
    ],
  },
  {
    tableID: "prayer-stats-table",
    get title() {
      return game.prayer.name;
    },
    borderClass: "border-prayer",
    trackerKey: "Prayer",
    rows: [
      {
        get name() {
          return getLangString("STATISTICS", "TOTAL_BONES_BURIED");
        },
        get value() {
          return game.stats.Prayer.get(PrayerStats.BonesBuried);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "PRAYER_POINTS_EARNED");
        },
        get value() {
          return game.stats.Prayer.get(PrayerStats.PrayerPointsEarned);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "PRAYER_POINTS_SPENT");
        },
        get value() {
          return game.stats.Prayer.get(PrayerStats.PrayerPointsSpent);
        },
      },
      {
        get name() {
          return getLangString("STATISTICS", "PRAYER_POINTS_PRESERVED");
        },
        get value() {
          return game.stats.Prayer.get(PrayerStats.PrayerPointsPreserved);
        },
      },
    ],
  },
  {
    tableID: "township-stats-table",
    get title() {
      return getLangString("SKILL_NAME", "Township");
    },
    borderClass: "border-township",
    trackerKey: "Township",
    rows: [],
  },
];
const statisticCategories = [
  {
    id: StatCategories.General,
    get name() {
      return statsData[this.id].title;
    },
    media: "assets/media/main/statistics_header.svg",
  },
  {
    id: StatCategories.Shop,
    get name() {
      return statsData[this.id].title;
    },
    media: "assets/media/main/gp.svg",
  },
  {
    id: StatCategories.Combat,
    get name() {
      return statsData[this.id].title;
    },
    media: "assets/media/skills/combat/combat.svg",
  },
  {
    id: StatCategories.MeleeCombat,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.attack.media;
    },
  },
  {
    id: StatCategories.RangedCombat,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.ranged.media;
    },
  },
  {
    id: StatCategories.MagicCombat,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.altMagic.media;
    },
  },
  {
    id: StatCategories.Prayer,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.prayer.media;
    },
  },
  {
    id: StatCategories.Slayer,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.slayer.media;
    },
  },
  {
    id: StatCategories.Woodcutting,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.woodcutting.media;
    },
  },
  {
    id: StatCategories.Fishing,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.fishing.media;
    },
  },
  {
    id: StatCategories.Firemaking,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.firemaking.media;
    },
  },
  {
    id: StatCategories.Cooking,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.cooking.media;
    },
  },
  {
    id: StatCategories.Mining,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.mining.media;
    },
  },
  {
    id: StatCategories.Smithing,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.smithing.media;
    },
  },
  {
    id: StatCategories.Thieving,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.thieving.media;
    },
  },
  {
    id: StatCategories.Farming,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.farming.media;
    },
  },
  {
    id: StatCategories.Fletching,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.fletching.media;
    },
  },
  {
    id: StatCategories.Crafting,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.crafting.media;
    },
  },
  {
    id: StatCategories.Runecrafting,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.runecrafting.media;
    },
  },
  {
    id: StatCategories.Herblore,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.herblore.media;
    },
  },
  {
    id: StatCategories.Agility,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.agility.media;
    },
  },
  {
    id: StatCategories.Summoning,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.summoning.media;
    },
  },
  {
    id: StatCategories.Astrology,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.astrology.media;
    },
  },
  {
    id: StatCategories.AltMagic,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return game.altMagic.media;
    },
  },
  {
    id: StatCategories.Township,
    get name() {
      return statsData[this.id].title;
    },
    get media() {
      return "assets/media/skills/township/township.svg";
    },
  },
];
const statTables = [];
let statCategoryMenu;
function initializeStatTables() {
  if (statTables.length > 0) throw new Error("Stat Tables already initialized");
  statsData.forEach((data, id) => {
    const table = document.getElementById(data.tableID);
    table.setData(data);
    statTables.push(table);
  });
  statCategoryMenu = new CategoryMenu(
    "stats-category-menu",
    "horizontal-navigation-stats",
    statisticCategories,
    "SELECT_STATS_CATEGORY",
    selectStatsCategory
  );
}
let selectedStatCategory = StatCategories.General;
function selectStatsCategory(category) {
  selectedStatCategory = category.id;
  statisticCategories.forEach((cat) => {
    const table = statTables[cat.id];
    if (cat.id === category.id) showElement(table);
    else hideElement(table);
  });
  updateStats(category.id);
}
function updateStats(category) {
  statTables[category].updateRowValues();
}
