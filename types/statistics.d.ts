declare function initializeStatTables(): void;
declare function selectStatsCategory(category: any): void;
declare function updateStats(category: any): void;
declare class Statistics {
  constructor(game: any);
  game: any;
  Woodcutting: StatTracker;
  Fishing: StatTracker;
  Firemaking: StatTracker;
  Cooking: StatTracker;
  Mining: StatTracker;
  Smithing: StatTracker;
  Attack: StatTracker;
  Strength: StatTracker;
  Defence: StatTracker;
  Hitpoints: StatTracker;
  Thieving: StatTracker;
  Farming: StatTracker;
  Ranged: StatTracker;
  Fletching: StatTracker;
  Crafting: StatTracker;
  Runecrafting: StatTracker;
  Magic: StatTracker;
  Prayer: StatTracker;
  Slayer: StatTracker;
  Herblore: StatTracker;
  Agility: StatTracker;
  Summoning: StatTracker;
  Astrology: StatTracker;
  Township: StatTracker;
  General: StatTracker;
  Combat: StatTracker;
  GolbinRaid: StatTracker;
  Shop: StatTracker;
  Items: MappedStatTracker;
  Monsters: MappedStatTracker;
  itemFindCount(item: any): any;
  monsterKillCount(monster: any): any;
  getFilteredItemStatsTotal(predicate: any, stat: any): number;
  getFilteredItemStatsDiff(predicate: any, statAdd: any, statSub: any): number;
  meteoriteSnapshot(): {
    totalFound: any;
    hpFound: any;
  };
  onyxSnapshot(): {
    totalFound: any;
    hpFound: any;
  };
  orichaSnapshot(): {
    totalFound: any;
    hpFound: any;
  };
  ceruleanSnapshot(): {
    totalFound: any;
    hpFound: any;
  };
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  deserialize(reader: any, version: any, idMap: any): void;
  convertFromOldFormat(savegame: any, idMap: any): void;
  renderMutatedStats(): void;
}
declare var GeneralStats: any;
declare var PrayerStats: any;
declare var SlayerStats: any;
declare var WoodcuttingStats: any;
declare var FishingStats: any;
declare var FiremakingStats: any;
declare var CookingsStats: any;
declare var MiningStats: any;
declare var SmithingStats: any;
declare var ThievingStats: any;
declare var FarmingStats: any;
declare var FletchingStats: any;
declare var CraftingStats: any;
declare var RunecraftingStats: any;
declare var HerbloreStats: any;
declare var AgilityStats: any;
declare var SummoningStats: any;
declare var AltMagicStats: any;
declare var AstrologyStats: any;
declare var TownshipStats: any;
declare var ShopStats: any;
declare var MonsterStats: any;
declare var CombatStats: any;
declare var RaidStats: any;
declare var ItemStats: any;
declare var StatCategories: any;
declare const statsData: {
  tableID: string;
  readonly title: any;
  borderClass: string;
  trackerKey: string;
  rows: (
    | {
        readonly name: any;
        readonly value: any;
        isTime?: undefined;
        namespace?: undefined;
      }
    | {
        readonly name: any;
        readonly value: any;
        isTime: boolean;
        namespace?: undefined;
      }
    | {
        readonly name: any;
        readonly value: any;
        namespace: string;
        isTime?: undefined;
      }
  )[];
}[];
declare const statisticCategories: {
  id: any;
  readonly name: any;
  readonly media: any;
}[];
declare const statTables: any[];
declare let statCategoryMenu: any;
declare let selectedStatCategory: any;
