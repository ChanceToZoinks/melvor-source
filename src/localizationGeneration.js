"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
let LANGJSON;
let allLangJsons = [];
function fillLanguageIdentifiers(category, identifier) {
  LANGS.forEach((lang, i) => {
    if (lang === "lemon") return;
    if (lang !== "en") {
      const langCat = allLangJsons[i][category];
      const langString =
        langCat === undefined ? undefined : langCat[identifier];
      if (langString !== undefined) {
        LANGJSON[lang][category][identifier] = langString;
      } else {
        LANGJSON[lang][category][identifier] = "";
      }
    }
  });
}
function applyEnglishKey(category, identifier, value) {
  value = replaceAll(
    value,
    "<br><span class='text-success'>Provides extra Prayer XP based on damage dealt to enemy</span>",
    ""
  );
  value = replaceAll(
    value,
    "<br><span class='text-danger'>Provides no extra Prayer XP</span>",
    ""
  );
  value = replaceAll(value, "(value) => `", "");
  value = replaceAll(value, "`", "");
  value = replaceAll(value, "() => ", "");
  value = replaceAll(value, "Max ", "Maximum ");
  value = replaceAll(value, "Min ", "Minimum ");
  value = replaceAll(value, " HP", " Hitpoints");
  LANGJSON["en"][category][identifier] = value;
  fillLanguageIdentifiers(category, identifier);
}
function createBlankLanguageCategories(category) {
  LANGS.forEach((lang) => {
    if (lang === "lemon") return;
    LANGJSON[lang][category] = {};
  });
}
function setupLangJSON(download = false) {
  return __awaiter(this, void 0, void 0, function* () {
    allLangJsons = yield Promise.all(
      LANGS.slice(0, LANGS.length - 1).map((lang) => fetchLanguageJSON(lang))
    );
    LANGJSON = {};
    LANGS.forEach((lang) => {
      if (lang === "lemon") return;
      LANGJSON[lang] = {};
    });
    const languageCategories = [
      "SPECIAL_ATTACK",
      "SPECIAL_ATTACK_NAME",
      "SKILL_NAME",
      "ITEM_NAME",
      "MONSTER_NAME",
      "ITEM_DESCRIPTION",
      "MODIFIER_DATA",
      "PET_NAME",
      "PRIVACY_POLICY",
      "MENU_TEXT",
      "MAGIC",
      "THIEVING",
      "PRAYER",
      "CHARACTER_SELECT",
      "FARMING_MISC",
      "SHOP_MISC",
      "EQUIP_SLOT",
      "COMBAT_MISC",
      "MASTERY_BONUS",
      "MASTERY_CHECKPOINT",
      "MISC_STRING",
      "BANK_STRING",
      "COMBAT_AREA",
      "SLAYER_AREA",
      "DUNGEON",
      "TUTORIAL",
      "COMPLETION",
      "BANE_EVENT",
      "TREE_NAME",
      "ORE_NAME",
      "FISHING",
      "SKILL_CATEGORY",
      "AGILITY",
      "POTION_NAME",
      "BANE_EVENT",
      "PET_MISC",
      "NUM",
      "IAP",
      "SUMMONING_SYNERGY",
      "LORE",
      "SHOP_NAME",
      "SHOP_DESCRIPTION",
      "PAGE_NAME_MISC",
      "GAMEMODES",
      "PAGE_NAME",
      "SETTINGS",
      "GAME_GUIDE",
      "GOLBIN_RAID",
      "SHOP_CAT",
      "ASTROLOGY",
      "STATISTICS",
      "EQUIPMENT_STAT",
      "TIME_UNIT",
      "MILESTONES",
      "TOASTS",
      "PUSH_NOTIFICATIONS",
      "PASSIVES",
      "ERROR",
      "EVENTS",
      "MONSTER_DESCRIPTION",
      "TOWNSHIP",
      "TOWNSHIP_MENU",
      "MINING_TYPE",
      "MOD_MANAGER",
    ];
    languageCategories.forEach((category) => {
      if (LANGJSON["en"][category] === undefined)
        createBlankLanguageCategories(category);
    });
    langGenerateSkillNames();
    langGenerateModifierData();
    langGenerateMenuText();
    langGenerateMagicText();
    langGenerateThievingText();
    langGenerateTutorialText();
    langGenerateMiscText();
    langGenerateBankText();
    langGenerateEquipSlotNameText();
    langGenerateMiscShopText();
    langGenerateFarmingMiscText();
    langGenerateCharacterSelectText();
    langGenerateMiscCombatText();
    langGenerateCompletionText();
    langGenerateEndgameText();
    langGeneratePetText();
    langGenerateNumberShorthand();
    langGeneratePrayer();
    langGenerateIAPStrings();
    langGenerateLore();
    langGenerateStatisticsText();
    langGenerateShopText();
    langGenerateGamemodeText();
    langGeneratePageNameMisc();
    langGenerateSettingsStrings();
    langGenerateGameGuideStrings();
    langGenerateGolbinRaidStrings();
    langGenerateAstrologyStrings();
    langGenerateEquipStatText();
    langGenerateTimeUnits();
    langGenerateMilestoneStrings();
    langGenerateToasts();
    langGeneratePushNotifications();
    langGenerateErrorText();
    langGenerateEventStrings();
    langGenerateTownship();
    langGenerateTownshipMenu();
    const fetchData = function (url) {
      return __awaiter(this, void 0, void 0, function* () {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const response = yield fetch(url, { method: "GET", headers });
        if (!response.ok)
          throw new Error(`Could not fetch data package with URL: ${url}`);
        const dataPackage = yield response.json();
        return dataPackage;
      });
    };
    langGenerateFromDataPackage(
      yield fetchData(`assets/data/melvorDemo.json?${DATA_VERSION}`)
    );
    langGenerateFromDataPackage(
      yield fetchData(`assets/data/melvorFull.json?${DATA_VERSION}`)
    );
    langGenerateFromDataPackage(
      yield fetchData(`assets/data/melvorTotH.json?${DATA_VERSION}`)
    );
    if (download) yield langCreateCSV();
    console.log(LANGJSON);
  });
}
function langCreateCSV() {
  return __awaiter(this, void 0, void 0, function* () {
    const csv = yield convertJSONtoCSV();
    downloadTextFile("languageFile.csv", csv, "data:text/csv");
  });
}
function formatStringForCSV(text) {
  text = replaceAll(text, `"`, `""`);
  if (text.includes(`"`) || text.includes(",")) text = `"${text}"`;
  return text;
}
function buildCSVFile(headers, rows) {
  let fileText = `${headers.map(formatStringForCSV).join(",")}\n`;
  rows.forEach((row, i) => {
    if (row.length !== headers.length)
      throw new Error(
        `Error building CSV file, row ${i} has length ${row.length} that does not match headder ${headers.length}`
      );
    fileText += `${row.map(formatStringForCSV).join(",")}\n`;
  });
  return fileText;
}
function convertJSONtoCSV() {
  return __awaiter(this, void 0, void 0, function* () {
    const existingOrder = yield fetchLanguageJSON("catOrder");
    const headers = Object.keys(LANGJSON);
    headers.unshift("category", "identifier");
    const rows = [];
    const categories = Object.keys(LANGJSON["en"]);
    const langs = Object.keys(LANGJSON);
    const diffLog = [];
    existingOrder.forEach(([category, identifier]) => {
      const row = [
        category,
        identifier,
        ...langs.map((lang, i) => {
          const langCat = LANGJSON[lang][category];
          const newValue =
            langCat === undefined ? undefined : langCat[identifier];
          const oldValue = allLangJsons[i][category][identifier];
          if (newValue === undefined) return oldValue;
          else {
            if (newValue !== oldValue) {
              diffLog.push([category, identifier, oldValue, newValue]);
            }
            return newValue;
          }
        }),
      ];
      rows.push(row);
    });
    categories.forEach((category) => {
      const identifiers = Object.keys(LANGJSON["en"][category]);
      identifiers.forEach((identifier) => {
        const loadedCat = loadedLangJson[category];
        const existingValue =
          loadedCat === undefined ? undefined : loadedCat[identifier];
        const newRow = [
          category,
          identifier,
          ...langs.map((lang) => LANGJSON[lang][category][identifier]),
        ];
        if (existingValue === undefined) rows.push(newRow);
      });
    });
    downloadTextFile(
      "languageChanges.csv",
      buildCSVFile(["category", "identifier", "old", "new"], diffLog),
      "data:text/csv"
    );
    return buildCSVFile(headers, rows);
  });
}
function langGenerateErrorText() {
  const addText = (identifier, text) =>
    applyEnglishKey("ERROR", identifier, text);
  addText(
    "OFFLINE_ERROR_0",
    "We ran into an error while calculating your Offline Progress! >:("
  );
  addText("SKILL_STOPPED", "Your Skill was also stopped in the process.");
  addText("LET_DEV_KNOW", "Please let the developer know of this error:");
  addText("CONTINUE_TO_GAME", "Continue to game");
}
function langGeneratePushNotifications() {
  const addText = (identifier, text) =>
    applyEnglishKey("PUSH_NOTIFICATIONS", identifier, text);
  addText(
    "OFFLINE_CAP",
    "You have been away for roughly 18 hours! Time cap reached. (${username})"
  );
  addText(
    "HARVEST_READY",
    "Your ${itemName} are ready to harvest! (${username})"
  );
}
function langGenerateToasts() {
  const addText = (identifier, text) =>
    applyEnglishKey("TOASTS", identifier, text);
  addText("CLOUD_SAVE_SUCCESS", "Cloud Save Successful");
  addText("TAKE_A_BREATH", "Take a deep breath, you're safe now.");
  addText("STUNNED", "You have been stunned!");
  addText("MINUS_HP", "-${damage} HP");
  addText("FULL_BANK", "Your bank is full");
  addText("SKILL_LEVEL_UP", "Your ${skillName} is now Level ${level}.");
  addText("GLOVES_DEGRADED", "Your gloves have degraded!");
  addText("ASLEEP", "You are now Asleep!");
  addText(
    "MAX_POOL_TOKENS",
    "Maximum Mastery Pool XP reached at ${count} Tokens."
  );
  addText("POOL_XP_GRANTED", "${xp} Mastery Pool XP granted.");
  addText(
    "PASSIVE_COOK_ITEMS_REQUIRED",
    "You don't have the required items to Passively Cook that."
  );
  addText(
    "MATERIALS_REQUIRED_TO_CRAFT",
    "You don't have the required materials to Craft that."
  );
  addText("PLANT_ALL_GP", "You do not have enough GP to Plant All.");
  addText("SEED_PLANT_FAILURE", "Your ${itemName} failed to Plant.");
  addText("NO_EMPTY_PATCHES", "You have no empty patches to plant!");
  addText("NOT_ENOUGH_SEEDS", "You don't have enough seeds!");
  addText("CROP_READY", "A crop is ready to harvest.");
  addText("CROP_FAILED", "One of your crops failed to produce :(");
  addText("NEED_COMPOST", "You need Compost to add Compost!");
  addText("NEED_GLOOP", "You need Weird Gloop to add Weird Gloop!");
  addText("HARVEST_ALL_GP", "You do not have enough GP to Harvest All.");
  addText("COMPOST_ALL_GP", "You do not have enough GP to Compost All.");
  addText("GLOOP_ALL_GP", "You do not have enough GP to Apply Gloop to All.");
  addText(
    "MATERIALS_REQUIRED_TO_FLETCH",
    "You don't have the required materials to Fletch that."
  );
  addText(
    "MATERIALS_REQUIRED_TO_BREW",
    "You don't have the required materials to brew that."
  );
  addText("POTION_DEPLETED", "Your potion has depleted.");
  addText(
    "MATERIALS_REQUIRED_TO_SMITH",
    "You don't have the required materials to Smith that."
  );
  addText(
    "MATERIALS_REQUIRED_TO_CAST",
    "You don't have the required materials to Cast that."
  );
  addText(
    "RUNES_REQUIRED_TO_CAST",
    "You don't have the required runes to Cast that."
  );
  addText("ITEM_DOESNT_EXIST", "That item doesn't exist.");
  addText(
    "MATERIALS_REQUIRED_TO_CREATE",
    "You don't have the required materials to create that."
  );
  addText("ITEM_EQUIPPED", "${itemName} Equipped.");
  addText("ITEM_QTY_EQUIPPED", "${itemName} x${quantity} Equipped.");
  addText("ITEM_ALREADY_EQUIPPED", "${itemName} is already Equipped.");
  addText("ITEM_NOT_IN_BANK", "There's no ${itemName} in your bank.");
  addText("CANT_EQUIP_ITEM", "Unable to equip ${itemName}.");
  addText(
    "OFFLINE_COMBAT_ENABLE_FAILURE",
    "You must agree to all points before enabling Offline Combat."
  );
  addText("SYNERGY_ALREADY_EQUIPPED", "This Synergy is already equipped.");
  addText("NO_TABLETS", "You do not have the required ${itemName} tablets.");
  addText("SYNERGY_EQUIPPED", "Synergy successfully equipped.");
  addText("CUT_LIMIT_REACHED", "Tree cutting limit reached.");
  addText(
    "NO_BANK_ROOM_EVERYTHING",
    "You don't have room in your bank for everything."
  );
  addText("NO_BANK_ROOM", "You don't have room in your bank for that.");
  addText("FIGHT_WRONG_MONSTER", "You tried to fight the wrong Monster!");
  addText("NO_LOGS_TO_BURN", "You don't have any ${itemName} to burn!");
  addText("SELECT_LOGS", "Select some logs first!");
  addText(
    "NO_LOGS_FOR_BONFIRE",
    "You do not have enough logs to light a bonfire!"
  );
  addText(
    "LEVEL_REQUIRED_TO_BURN",
    "You don't have the required Firemaking level to burn those!"
  );
  addText("SELECT_ITEM", "You need to select an item first!");
  addText(
    "CANT_FIT_CURRENT_EQUIPMENT",
    "You can't fit your currently equipped items into your bank."
  );
  addText("FOOD_EQUIPPED", "Food equipped.");
  addText("NEED_FREE_SLOT", "You need to free up a slot to equip that.");
  addText(
    "MAX_PRAYERS_ACTIVE",
    "You can only have up to 2 Prayers active at once!"
  );
  addText("NOT_ENOUGH_PP", "You don't have enough Prayer Points!");
  addText(
    "NO_CURSES_WITH_ANCIENT",
    "You cannot use curses with Ancient Magicks."
  );
  addText("CANNOT_DURING_DUNGEON", "You cannot do that during a dungeon!");
  addText("CANNOT_DURING_RAID", "You cannot do that during Golbin Raid!");
  addText(
    "COMPLETION_PERCENT_REQUIRED",
    "You require ${percent}% completion to do that!"
  );
  addText(
    "ITEM_EQUIPPED_REQUIRED",
    "You must have ${itemName} equipped to do that!"
  );
  addText(
    "SHOP_PURCHASE_REQUIRED",
    "You must purchase ${purchaseName} to do that!"
  );
  addText(
    "SKILL_LEVEL_REQUIRED",
    "You require level ${level} ${skillName} to do that!"
  );
  addText(
    "DUNGEON_COMPLETION_REQUIRED_ONCE",
    "You must complete ${dungeonName} once to do that!"
  );
  addText(
    "DUNGEON_COMPLETION_REEQUIRED_MULTIPLE",
    "You must complete ${dungeonName} ${count} times to do that!"
  );
  addText("ROCK_DEPLETED", "The rock is depleted.");
  addText("CANNOT_DURING_EVENT", "You cannot do that during the event.");
  addText("CANNOT_AFFORD_THAT", "You cannot afford that.");
  addText(
    "NO_TASK_FOUND_EQUIPMENT",
    "No available Slayer Tasks found. Equip a relevant item or disable Auto Slayer to increase availability."
  );
  addText(
    "NO_TASK_FOUND_TIER",
    "No available Slayer Tasks found. Try a different Tier of tasks."
  );
  addText(
    "RUNES_REQUIRED_CURSE",
    "You need more runes to cast your selected Curse Spell."
  );
  addText(
    "NOT_ENOUGH_COMBO_RUNES",
    "You do not have enough Combination runes."
  );
  addText(
    "NOT_ENOUGH_STANDARD_RUNES",
    "You do not have enough Standard runes."
  );
  addText("NO_AMMO", "You have no ammo.");
  addText("WRONG_AMMO", "You do not have the correct ammo type.");
  addText(
    "RUNES_REQUIRED_AURORA",
    "You need more runes to keep your Aurora active."
  );
  addText("FAMILIAR_OUT_OF_CHARGES", "Your Familiar has run out of charges.");
  addText("NO_ROCK_DAMAGE", "You did no damage to the rock.");
  addText("CANNOT_WHILE_STUNNED", "You cannot do that, you are stunned!");
  addText(
    "ALL_SKILL_LEVEL_REQUIRED",
    "You require level ${level} in all Skills to do that!"
  );
  addText(
    "ITEM_FOUND_REQUIRED",
    "You must find ${itemName} before you can do that!"
  );
  addText(
    "MONSTER_KILLED_REQUIRED",
    "You must kill ${monsterName} once before you can do that!"
  );
  addText(
    "MONSTER_KILLS_REQUIRED",
    "You must kill ${monsterName} ${count} times before you can do that!"
  );
  addText(
    "SLAYER_TASK_REQUIRED_Easy",
    "You must complete ${count} more Easy Slayer Tasks before you can do that!"
  );
  addText(
    "SLAYER_TASK_REQUIRED_Normal",
    "You must complete ${count} more Normal Slayer Tasks before you can do that!"
  );
  addText(
    "SLAYER_TASK_REQUIRED_Hard",
    "You must complete ${count} more Hard Slayer Tasks before you can do that!"
  );
  addText(
    "SLAYER_TASK_REQUIRED_Elite",
    "You must complete ${count} more Elite Slayer Tasks before you can do that!"
  );
  addText(
    "SLAYER_TASK_REQUIRED_Master",
    "You must complete ${count} more Master Slayer Tasks before you can do that!"
  );
}
function langGenerateMilestoneStrings() {
  const addText = (identifier, text) =>
    applyEnglishKey("MILESTONES", identifier, text);
  addText("SKILL_MASTERY", "Skill Mastery");
  addText("0", "Wield Bronze Weapons");
  addText("1", "Wield Iron Weapons");
  addText("2", "Wield Steel Weapons");
  addText("3", "Wield Black Weapons");
  addText("4", "Wield Mithril Weapons");
  addText("5", "Wield Adamant Weapons");
  addText("6", "Wield Rune Weapons");
  addText("7", "Wield Dragon Weapons");
  addText("8", "Wield Ancient Weapons");
  addText("9", "Wield Godswords");
  addText("10", "Wear Bronze Armour");
  addText("11", "Wear Iron Armour");
  addText("12", "Wear Steel Armour");
  addText("13", "Wear Black Armour");
  addText("14", "Wear Mithril Armour");
  addText("15", "Wear Adamant Armour");
  addText("16", "Wear Rune Armour");
  addText("17", "Wear Dragon Armour");
  addText("18", "Wear Ancient Armour");
  addText("19", "Wear Terran God Armour");
  addText("20", "Wear Ragnar God Armour");
  addText("21", "Apple Tree");
  addText("22", "Basic Elemental Staves");
  addText("23", "Basic Green Wizard Gear");
  addText("24", "Air Acolyte Wizard Gear");
  addText("25", "Water Acolyte Wizard Gear");
  addText("26", "Earth Acolyte Wizard Gear");
  addText("27", "Basic Blue Wizard Gear");
  addText("28", "Fire Acolyte Wizard Gear");
  addText("29", "Basic Red Wizard Gear");
  addText("30", "Air Adept Wizard Gear");
  addText("31", "Water Adept Wizard Gear");
  addText("32", "Mystic Staves");
  addText("33", "Earth Adept Wizard Gear");
  addText("34", "Fire Adept Wizard Gear");
  addText("35", "Basic Black Wizard Gear");
  addText("36", "Air Expert Wizard Gear");
  addText("37", "Water Expert Wizard Gear");
  addText("38", "Ancient Wizard Gear");
  addText("39", "Earth Expert Wizard Gear");
  addText("40", "Fire Expert Wizard Gear");
  addText("41", "Glacia God Gear");
  addText("42", "Wear Green Dragonhide Armour");
  addText("43", "Wear Blue Dragonhide Armour");
  addText("44", "Wear Red Dragonhide Armour");
  addText("45", "Wear Black Dragonhide Armour");
  addText("46", "Wear Ancient Dragonhide Armour");
}
function langGenerateGolbinRaidStrings() {
  const addText = (identifier, text) =>
    applyEnglishKey("GOLBIN_RAID", identifier, text);
  addText("HEADER", "Golbin Raid Development Plan");
  addText("STAGE_1", "Stage 1");
  addText("STAGE_1_0", "Initial Release");
  addText("STAGE_1_1", "Basic Mechanics Implemented");
  addText("STAGE_2", "Stage 2");
  addText("STAGE_2_0", "Raid Shop");
  addText("STAGE_2_1", "Increased Variance of Enemies");
  addText("STAGE_2_2", "Tuning for Ranged & Magic");
  addText("STAGE_3", "Stage 3");
  addText("STAGE_3_0", "Finalise Mechanics");
  addText("STAGE_3_1", "Focus on Feedback");
  addText("STAGE_4", "Stage 4");
  addText("STAGE_4_0", "Finished Minigame");
  addText("BTN_0_0", "WELCOME TO THE GOLBIN RAID");
  addText("BTN_0_1", "Fight for survival in this infinite dungeon.");
  addText("BTN_1_0", "Start the Raid");
  addText("BTN_1_1", "Begin your fight for survival and earn Raid Coins");
  addText("BTN_2_0", "Visit the Raid Shop");
  addText("BTN_2_1", "Spend your Raid Coins here");
  addText(
    "INFORMATION_0",
    "The Golbin Raid is the first permanent minigame added to Melvor Idle. It will be built and expanded upon to create a fun distraction for those who want to take a break from the grind. This gamemode offers unique rewards exclusive to the minigame."
  );
  addText(
    "INFORMATION_1",
    "This minigame is specifically designed to be fair for everyone, at any level of the game. There is no advantage to having high level stats or items in this."
  );
  addText("INFORMATION_2", "How to Play");
  addText(
    "INFORMATION_3",
    "Defeat infinite waves of Golbins, progressing in difficulty and Combat Level each wave."
  );
  addText(
    "INFORMATION_4",
    "You start at Level 1 Combat Skill Levels (Hitpoints Level 10) which increases by 1 at the end of each wave."
  );
  addText(
    "INFORMATION_5",
    "Start with only a Bronze Scimitar, 200 Bronze Arrows, 500 Air, Water, Earth, Fire & Mind Runes, and 10 Shrimp"
  );
  addText(
    "INFORMATION_6",
    "At the end of each wave you can select the desired item you wish to equip, chosen at random."
  );
  addText(
    "INFORMATION_7",
    "Get as far as you can with the best build possible."
  );
  addText(
    "INFORMATION_8",
    "Visit the Raid Shop to purchase upgrades that will assist in the Raid."
  );
  addText(
    "INFORMATION_9",
    "Running or dying in the Raid will reward you with Raid Coins based on what Wave you got up to. You cannot earn Raid Coins prior to Wave 4."
  );
  addText("INFORMATION_10", "Everyone attacks twice as fast in the Raid.");
  addText("INFORMATION_11", "Important Information");
  addText(
    "INFORMATION_12",
    `All Skills, including Combat, are placed into "Offline Mode" during a Raid. Once a Raid is finished, you will be rewarded with progress for the Skill.`
  );
  addText(
    "INFORMATION_13",
    "Running out of Runes or Ammo during Combat or selecting a weapon that isn't compatible with your existing Ammo will replace your weapon with a Bronze Scimitar."
  );
  addText("INFORMATION_14", "Auto Eat Tier II is active throughout the Raid.");
  addText("INFORMATION_15", "There is no Potions or passive Pet Bonuses.");
  addText("INFORMATION_16", "No Combat Experience is gained during the Raid.");
  addText(
    "INFORMATION_17",
    "You are limited to only 1 Equipment Set, and 1 Equipped Food. Choose wisely."
  );
  addText(
    "INFORMATION_18",
    "The Weapons and Gear you can select are gated behind Wave requirements. Check the selections screen for info."
  );
  addText(
    "INFORMATION_19",
    "All Runes acquired during the Raid are stored. Check the My Runes page in Combat to see what you have."
  );
  addText("INFORMATION_20", "All Magic Spells are unlocked from the start.");
  addText(
    "INFORMATION_21",
    "Combat Triangle Modifiers for Standard & Hardcore characters still apply here (Including no HP Regen for Hardcore)."
  );
  addText(
    "INFORMATION_22",
    "This is a safe minigame. Hardcore Characters are safe if you die."
  );
  addText(
    "INFORMATION_23",
    "The Raid is in its second stage of development. Refer to Development Plan above."
  );
  addText("STAT_0", "Golbins Slaughtered: ${num}");
  addText("STAT_1", "Highest Wave: ${num}");
  addText("STAT_2", "Total Raid Coins: ${num}");
  addText("STAT_3", "Time Spent Raiding: ${time}");
  addText("STAT_4", "Longest Raid: ${time}");
  addText("STAT_5", "Total Raid Deaths: ${num}");
  addText("HISTORY_TITLE", "Raid History (Max 5)");
  addText("HISTORY_0", "Wave: ${num}");
  addText("HISTORY_1", "Kill Count: ${num}");
  addText("HISTORY_2", "Time: ${time}");
  addText("HISTORY_3", "Raid Coins: ${num}");
  addText("HISTORY_4", "Ammo: ${num}");
  addText("HISTORY_5", "${num} x ${foodImage}");
  addText("AREA_NAME", "Golbin Raid -");
  addText("HISTORY_6", "Difficulty: ${difficulty}");
  addText("WAVE", "Wave ${num1} -");
  addText("PROGRESS", "${qty1} / ${qty2}");
  addText("POPUP_0", "Wave Complete!");
  addText("POPUP_1", "Select New Equipment");
  addText("POPUP_2", "Make this count. You cannot come back to this screen.");
  addText("POPUP_3", "Available Equipment: Up to Level ${num}");
  addText("POPUP_4", "Weapon");
  addText("POPUP_5", "Armour");
  addText("POPUP_6", "Ranged Ammo");
  addText("POPUP_7", "Runes");
  addText("POPUP_8", "Food");
  addText("POPUP_9", "Nothing");
  addText("POPUP_10", "Existing Item in Slot:");
  addText("POPUP_11", "Also Replaces:");
  addText("POPUP_12", "Replaces:");
  addText("POPUP_13", "+${num} Ammo");
  addText("POPUP_14", "+${num} to existing Runes");
  addText(
    "POPUP_15",
    "Note: Selecting the same Food as currently Equipped increases its Quantity. Selecting different Food replaces its Quantity."
  );
  addText(
    "POPUP_16",
    "Note: Selecting new Ammo will not reset your Ammo count. It will simply add the respective Quantity."
  );
  addText("POPUP_17", "Reroll Passive Item");
  addText("POPUP_18", "This is your currently Equipped Food.");
  addText("WAVE_FINISH", "You made it to Wave ${num}.");
  addText("Common", "Common!");
  addText("Uncommon", "Uncommon!");
  addText("Rare", "Rare!");
  addText("UltraRare", "Ultra Rare!");
  addText("BuggedRare", "Bugged Rare!");
  addText("PAUSE_RAID", "Pause Golbin Raid");
  addText("CONTINUE_RAID", "Continue Golbin Raid");
  addText("TRIANGLE_0", "Uses the Standard Mode Combat Triangle");
  addText("TRIANGLE_1", "Uses the Hardcore/Adventure Mode Combat Triangle");
  addText("COIN_MODIFIER", "Earn ${mult}x Raid Coins");
  addText("HP_MODIFIER", "Golbins have ${mult}x Hitpoints");
  addText(
    "STAT_MODIFIER",
    "Golbins have ${mult}x Accuracy Rating, Max Hit and Evasion"
  );
  addText(
    "MODIFIER_CHOICE",
    "You gain ${posCount} positive modifier(s) and ${negCount} negative modifier(s) at the start and every ${waveCount} waves."
  );
  addText(
    "SECOND_PASSIVE",
    "Golbins have a chance to have a second passive effect."
  );
  addText("SELECT_DIFFICULTY", "Select Difficulty");
  addText("GIVES_YOU", "Gives you:");
  addText("GIVES_GOLBINS", "Gives golbins:");
  addText("SELECT_POSITIVE_MOD", "Select a Positive Modifier");
  addText("SELECT_NEGATIVE_MOD", "Select a Negative Modifier");
  addText("OPENING_CRATE", "Opening Golbin  Crate!");
  addText("ALL_MODIFIERS", "All Golbin Raid Modifiers");
  addText("VIEW_MODIFIERS", "View Raid Modifiers");
}
function langGenerateGameGuideStrings() {
  const addText = (identifier, text) =>
    applyEnglishKey("GAME_GUIDE", identifier, text);
  addText("0", "Bank Space");
  addText("1", "Bank Tabs");
  addText("2", "Bank Layout");
  addText("3", "Bulk Selling");
  addText(
    "4",
    "Every one is provided 10 Bank tabs to organise their inventory. These tabs allow for easy organisation, as well as quick access to items you need."
  );
  addText(
    "5",
    "For Desktop users, you are able to drag any item into any tab you wish. For everyone else, there is an option at the top of the bank to quickly move items into new tabs. Kind of like a Bulk Move Item mode."
  );
  addText(
    "6",
    "The first item within the Tab determines the image that is displayed."
  );
  addText(
    "7",
    "The Bank is separated into two sections: The Main Container and the Bank Sidebar."
  );
  addText(
    "8",
    "The Main Container is just like it has always been, the section that stores all your items."
  );
  addText(
    "9",
    "The Bank Sidebar - Selecting an item will display this sidebar with all details and actions relating to your item."
  );
  addText(
    "10",
    "This new Bank Sidebar allows for easy scaling with new mechanics and ideas around items."
  );
  addText(
    "11",
    "You are also able to see the Item Stats for the selected item, as well as change settings relating to the bank including New Bank Sorting Options."
  );
  addText(
    "12",
    "On Mobile devices, this Bank Sidebar will pop-out for you when selecting an item."
  );
  addText(
    "13",
    "Another new option you get is the ability to Bulk Sell All of your items."
  );
  addText(
    "14",
    "By simply activating the option at the top of the Bank, you will be able to mark any unlocked item for Sale to quickly remove them from your Bank."
  );
  addText(
    "15",
    "Combat provides a in-depth experience for those who enjoy high risk, high reward."
  );
  addText(
    "16",
    "With a selection of 3 different Attack Styles, and an assortment of Enemies and Dungeons to encounter, you will be required to test your Skill to master what there is to come."
  );
  addText("17", "Combat Skills");
  addText(
    "18",
    "Each Level increases your Melee Accuracy Rating (Higher chance to hit). Increasing Attack Levels also unlocks more powerful Melee Weapons for you to Equip."
  );
  addText(
    "19",
    "Each Level increases your Max Hit for Melee. Sometimes it takes more than one Level to increase the Max Hit."
  );
  addText(
    "20",
    "Each Level increases your Evasion Rating for Melee, Ranged and Magic (Higher chance to evade Enemy hits). Increasing Defence Levels also unlocks more powerful Armour for you to Equip."
  );
  addText(
    "21",
    "Each Level increases your Maximum Hitpoints. For Standard Players, your Health Regenerates over time."
  );
  addText(
    "22",
    "Each Level increases your Ranged Accuracy Rating. Increasing Ranged Levels also unlocks more powerful Ranged Weapons & Armour for you to Equip."
  );
  addText(
    "23",
    "Each Level increases your Magic Accuracy Rating and your Magic Evasion Rating. Increasing Magic Levels also unlocks more powerful Magic Spells, Weapons & Armour for you to Equip and Use."
  );
  addText(
    "24",
    "Prayers are active Buffs you can apply to yourself at the cost of Prayer Points. Prayer Points are obtained by burying Bones from the Bank that you collect by slaying Enemies."
  );
  addText(
    "25",
    "Prayer Experience can only be granted using Active Prayers that specify that they provide Prayer XP."
  );
  addText(
    "26",
    "Slayer is a Skill where you are given a Task to complete. This Task involves the Slaying of selected Enemies."
  );
  addText(
    "27",
    "Slaying Enemies from your Slayer Tasks grant Slayer Coins which can be spent within the Shop to unlock more Weapons & Armour."
  );
  addText(
    "28",
    "Slaying XP is earned by defeating Slayer Task Enemies, or by simply slaying Enemies within Slayer Areas."
  );
  addText("29", "Important Combat Stats");
  addText("30", "Max Hit");
  addText("31", "The Maximum Amount of Damage you deal per Attack.");
  addText("32", "Chance to Hit");
  addText("33", "This is your % chance to land a hit.");
  addText("34", "Accuracy Rating");
  addText(
    "35",
    "The number that determines your Chance to Hit. The goal is to keep this number higher than the Enemy's Evasion Rating for the Attack Type you are currently using."
  );
  addText("36", "Damage Reduction");
  addText("37", "The % amount of Damage that is ignored from Enemy Attacks.");
  addText(
    "38",
    "This number determines the Enemy's chance to hit you. The goal is to keep the Evasion number for the Enemy's Attack Type higher than the Enemy's Accuracy Rating."
  );
  addText("39", "Combat Triangle");
  addText(
    "40",
    "Monsters have varying Attack Styles. These Attack Styles determine Modifiers to your Max Hit and Damage Reduction."
  );
  addText(
    "41",
    "Cut down various Trees to receive Logs that can be used throughout different Skills as a resource."
  );
  addText(
    "42",
    "Woodcutting is also a great starting point to receive Seeds for Farming."
  );
  addText("43", "Extra Items");
  addText("44", "Skill Interactions");
  addText(
    "45",
    "There is a small chance to receive a Bird Nest when cutting down Trees. These can be opened in the Bank to receive various Allotment or Tree Seeds that can be planted in Farming."
  );
  addText(
    "46",
    "Logs are the main resource used in Firemaking to progress the skill."
  );
  addText(
    "47",
    "Logs are one of the main resources required for most items in Fletching. These items are used for Ranged Combat training."
  );
  addText(
    "48",
    "Plant the Allotment & Tree Seeds received from Bird Nests to progress."
  );
  addText(
    "49",
    "Catch various Raw Fish within many different locations that can be used in Cooking."
  );
  addText(
    "50",
    "Be sure to have quite a few spare Bank Slots to accomodate for all the possible items you can get."
  );
  addText(
    "51",
    "Be sure to look out for Special Items that you can catch. Some unlock access to secret Fishing Areas! There's also some rare items you can equip that provide bonuses to Skills."
  );
  addText("52", "Special Items");
  addText("53", "Junk Items");
  addText(
    "54",
    "Those unskilled in Fishing have a tendency to lure a few useless items known as Junk."
  );
  addText(
    "55",
    "Fish is the main resource used in Cooking. Cooked Fish can be eaten during Combat or Thieving to provide healing. This is how you survive your adventure."
  );
  addText(
    "56",
    "Junk items can be converted to Gems using the correct Alt. Magic Spell."
  );
  addText("57", "Burn Logs obtained from Woodcutting to progress.");
  addText(
    "58",
    "Firemaking's main purpose is to provide Global XP Modifiers to other Skills."
  );
  addText("59", "Burnt Logs have a chance to provide Coal Ore.");
  addText(
    "60",
    "Progressing in Firemaking will allow you to purchase Cooking Fires from the Shop. These provide huge increases in Cooking Skill XP."
  );
  addText(
    "61",
    "Mine various types of Rocks to receive resources that can be used to progress in Smithing and Runecrafting"
  );
  addText(
    "62",
    "These Rocks only provide a set amount of resources until they become depleted. They will respawn after a certain period of time (Between 2 seconds and 2 minutes)."
  );
  addText("63", "Gems");
  addText("64", "There is a small chance per action to receive a random Gem.");
  addText(
    "65",
    "Use the Ores collected to Smelt Bars, that can then be used to create various Combat Gear."
  );
  addText(
    "66",
    "Rune Essence is the main resource used to progress in Runecrafting, which is required to progress Magic."
  );
  addText(
    "67",
    "Gems collected from Mining can be used to create Gem-Tipped Bolts, providing a high damage option for Ranged Combat Training."
  );
  addText(
    "68",
    "You can also use these Gems to craft various types of Jewellery that provide Combat bonuses."
  );
  addText(
    "69",
    "Smith all types of Melee Armour - Helmets, Platebodies, Platelegs, Boots & Gloves."
  );
  addText(
    "70",
    "Smith all types of Melee Weapons - Daggers, Swords, Scimitars, Battleaxes and 2-Handed Swords."
  );
  addText("71", "Required to create Arrows in Fletching.");
  addText("72", "Required to create Javelins in Fletching.");
  addText("73", "Required to create Crossbows in Fletching.");
  addText("74", "Required to create Gem-Tipped Bolts in Fletching.");
  addText(
    "75",
    "Smithing is one of the main Skills used to create Melee Combat Gear. This is used to train Attack, Strength, and Defence."
  );
  addText(
    "76",
    "All items in Fletching (Except Shortbows and Longbows) require resources obtained via Smithing."
  );
  addText("77", "Silver and Gold Bars are required to craft Jewellery.");
  addText(
    "78",
    "Pickpocket NPCs to gain GP as well as various items. Be sure to pay attention to your Hitpoints as NPCs may spot you and stun you, dealing damage in the process."
  );
  addText("79", "The Art of Stealth");
  addText(
    "80",
    "A good thief never gets caught. In order to accomplish this, you need to increase your Stealth."
  );
  addText("81", "Stealth can be increased in a number of ways:");
  addText("82", "Increasing your Thieving level");
  addText("83", "Increasing your Mastery level");
  addText("84", "Filling your Thieving Mastery Pool");
  addText("85", "Equipping items with Stealth bonuses");
  addText("86", "Potions from Herblore");
  addText("87", "Agility Courses");
  addText("88", "Your Stealth competes against an NPC's Perception");
  addText(
    "89",
    "Your success rate is determined by: 100 x (100 + Stealth) / (100 + Perception) %"
  );
  addText(
    "90",
    "Your chance to double items is increased by: 25 x (Stealth / Perception) %"
  );
  addText(
    "91",
    "Your chance to receive an NPC's unique item is: ((100 + Stealth) / Perception) / 100 %"
  );
  addText(
    "92",
    "Pickpocketting the Farmer NPC has a chance to provide a Herb Sack. These can be opened via the Bank to receive random Herb Seeds that can be planted in Farming."
  );
  addText(
    "93",
    "There are several unique Items you can obtain via Thieving. Be sure to watch out for them."
  );
  addText(
    "94",
    "You might discover some unique materials that can be used to craft bags that enhance other skills."
  );
  addText(
    "95",
    "Plant your Allotment, Herb or Tree Seeds to produce their grown counter-part. Crops have a 50% chance to die if Compost or Weird Gloop is not used."
  );
  addText(
    "96",
    "Allotments can be used as a source of Food. Herbs are used to create Potions in Herblore, and Trees are the main source of Skill XP in Farming."
  );
  addText(
    "97",
    "You are able to perform all Farming actions alongside any other Skill."
  );
  addText("98", "There are no Extra Items in Farming.");
  addText(
    "99",
    "Herbs are the main resource required to create any Potion within Herblore."
  );
  addText(
    "100",
    "Allotments can be used as a basic source of Food to restore your Hitpoints."
  );
  addText("101", "Used to Create:");
  addText("102", "Shortbows & Longbows");
  addText(
    "103",
    "Standard Two-Handed Ranged Weaponary. Requires Arrows as Ammo."
  );
  addText("104", "Arrows");
  addText(
    "105",
    "Ammo required for Shortbows & Longbows. Standard damage output."
  );
  addText("106", "Crossbows");
  addText(
    "107",
    "One-Handed Ranged Weaponary. Requires Gem-Tipped Bolts as Ammo."
  );
  addText("108", "Gem-Tipped Bolts");
  addText("109", "Ammo required for Crossbows. High damage output.");
  addText("110", "Javelins");
  addText("111", "Acts as both a Weapon and Ammo. Standard damage output.");
  addText(
    "112",
    "Fletching is your gateway to training Ranged Combat, providing all required resources necessary to progress."
  );
  addText(
    "113",
    "Used to create Armour for Ranged Combat, as well as Jewellery for general Combat bonuses."
  );
  addText("114", "Leather Armour");
  addText(
    "115",
    "Very Basic Defensive gear, suitable for Ranged Combat Training."
  );
  addText("116", "Dragonhide Armour");
  addText("117", "Strong Defensive gear, suitable for Ranged Combat Training.");
  addText("118", "Rings & Necklaces");
  addText(
    "119",
    "All purpose Combat Jewellery. Be sure to read the bonuses some of these items provide."
  );
  addText("120", "Crafting provides the necessary Armour for Ranged Combat.");
  addText(
    "121",
    "The Jewellery is a great starting point to aid with Combat in general."
  );
  addText(
    "122",
    "Used to create Runes for Magic Combat & Alt. Magic, as well as Magic Weapons & Gear to assist with your adventure."
  );
  addText("123", "Standard Runes");
  addText("124", "Your basic Runes. Required to cast any form of Magic Spell.");
  addText("125", "Combination Runes");
  addText(
    "126",
    "These are a combined Elemental Rune. An alternative to Standard Runes that can be more efficient at times."
  );
  addText("127", "Staffs & Wands");
  addText(
    "128",
    "Required to cast Magic Spells in Combat. Provides Rune reduction cost for most Magic Spells."
  );
  addText("129", "Elemental Wizard Gear");
  addText(
    "130",
    "All purpose Magic Combat Gear. Provides elemental damage bonuses respective to their base."
  );
  addText("131", "Magic & Alt. Magic");
  addText(
    "132",
    " Runecrafting is your gateway to training Magic, providing all required resources necessary to progress."
  );
  addText(
    "133",
    "Brew countless Potions that provide benefits to all Skills within the game by using Herbs you grow within Farming."
  );
  addText(
    "134",
    "Potions can be activated by selecting the Potion Button in the top right of the screen on the respective page associated with that Potion."
  );
  addText("135", "Combat Potions");
  addText(
    "136",
    "Provides bonuses for all Combat Skills. Only one Potion may be active at a time in Combat."
  );
  addText("137", "Skill Potions");
  addText(
    "138",
    "Provides bonuses for all non-Combat Skills. One Potion per non-Combat Skill can be active at any given time."
  );
  addText("139", "All Skills");
  addText("140", "Herblore interacts with every Skill within the game.");
  addText(
    "141",
    "Construct your very own Obstacle Course to provides many different Global Active Passives to your Character."
  );
  addText("142", "Obstacles");
  addText(
    "143",
    "You can build up to 10 different Obstacles, categorized into their own sections of the Obstacle Course."
  );
  addText("144", "You may destroy and swap Obstacles as you wish.");
  addText(
    "145",
    "Obstacles will become inactive if there is a gap in your Obstacle Course. This means the Global Active Passives will become Inactive. The game will tell you when this happens."
  );
  addText("146", "Passive Pillars");
  addText("147", "At Level 99 Agility, you unlock a Passive Pillar.");
  addText(
    "148",
    "These provide Global Active Passives just like Obstacles do, but are not actually an Obstacle that you must complete."
  );
  addText("149", "These are only active when all 10 Obstacles are built.");
  addText(
    "150",
    "Discover Marks, create and Summon Familiars, and unlock Synergies to assist you throughout the entire game."
  );
  addText("151", "Marks");
  addText(
    "152",
    "Discovering Marks is the first step in your Summoning journey."
  );
  addText(
    "153",
    "These can be discovered by performing any action in the Skill that the Mark defines. Continue to perform actions in this Skill to find more Marks, and level up."
  );
  addText(
    "154",
    "Having the respective Familiar equipped will double the Mark's drop rate."
  );
  addText(
    "155",
    "Note: You must create at least 1 Summoning Tablet for this Mark to find more after the first one is found."
  );
  addText("156", "Synergies");
  addText(
    "157",
    "Continue to level up your Marks to unlock Synergies between other Familiars."
  );
  addText(
    "158",
    "Equipping two Familiars with an unlocked Synergy will grant an extra bonus on top of their existing passives."
  );
  addText(
    "159",
    "Familiars use an extra 1 charge each per action with the Synergy active."
  );
  addText("160", "Familiars");
  addText("161", "Your companion throughout the game.");
  addText(
    "162",
    "Discovering 1 Mark will allow you to create Summoning Tablets. These Tablets can then be equipped from the Bank to provide passive bonuses for you."
  );
  addText(
    "163",
    "Familiars use 1 charge per action in its relative Skill. Combat Familiars uses 1 charge each time it attacks in Combat."
  );
  addText(
    "164",
    "Alt. Magic is a secondary method to progress in the Magic Skill using non-Combat abilities. You are still training Magic as a whole."
  );
  addText(
    "165",
    "All Alt. Magic Spells require Runes created in Runecrafting to cast. Some Spells also require you to select an item by clicking on the Magic Hat image."
  );
  addText("166", "There are no Extra Items in Alt. Magic.");
  addText(
    "167",
    "Because you're training the exact same Skill, progressing in Alt. Magic can also unlock all the Milestones available for Magic Combat."
  );
  addText(
    "168",
    "This Page details many different Statistics that is tracked within the game."
  );
  addText(
    "169",
    "This Page provides you with options to toggle various elements of the game on and off. This includes general gameplay settings, interface and account settings."
  );
  addText(
    "170",
    "Be sure to always check back here every update in case something new has arrived!"
  );
  addText(
    "171",
    "Cooking is your go to source for Food, which is used to provide healing in Combat and Thieving."
  );
  addText("172", "Cooking Utilities");
  addText("173", "Cooking Fire");
  addText("174", "For cooking all Fish and Beef products.");
  addText("175", "Furnace");
  addText("176", "For cooking Bread, Chicken, Pizza, Pies, Cupcakes & Cakes.");
  addText("177", "Pot");
  addText("178", "For cooking all Soup products.");
  addText("179", "Perfect Items");
  addText(
    "180",
    "When Active Cooking, you have a chance to receive a Perfect Version of that Product."
  );
  addText(
    "181",
    "Perfect Items provide +10% HP Healing Value, and +50% Base Sale Price."
  );
  addText("182", "Active & Passive Cooking");
  addText("183", "Active Cooking");
  addText(
    "184",
    "The standard way to cook Food. Only one product can be Active Cooked and any given time."
  );
  addText(
    "185",
    "Grants Skill XP, Mastery XP, Mastery Pool XP, Perfect Items and rare Skill Item Drops."
  );
  addText("186", "Passive Cooking");
  addText(
    "187",
    "You are able to Passive Cook a product at the same time you are Active Cooking. Passive Cooking can only be done on Cooking Utilities that are not currently in use."
  );
  addText(
    "188",
    "Products that are Passive Cooking take much longer to Cook than Active Cooking."
  );
  addText(
    "189",
    "Cooked Products from Passive Cooking are added to your Stockpile ready to collect when you wish."
  );
  addText(
    "190",
    "If you stop Active Cooking, all Passive Cooking will also stop."
  );
  addText(
    "191",
    "No Skill XP, Mastery XP, Mastery Pool XP, Perfect Items and rare Skill Item Drops."
  );
  addText(
    "192",
    "No Item Doubling or Skill Preservation is enabled with Passive Cooking."
  );
  addText(
    "193",
    "The Bank is one of the most important aspects of the game. This is where all your items are stored for use."
  );
  addText(
    "194",
    "You start out with very limited bank space, but you can buy more within the Shop!"
  );
  addText("195", "Game Guide");
  addText(
    "196",
    "Smelt Ores obtained from Mining to create Bars that are then used to smith various Combat Gear."
  );
  addText("197", "Melee Armour");
  addText("198", "Melee Weapons");
  addText("199", "Arrowtips");
  addText("200", "Javelin Heads");
  addText("201", "Crossbow Heads");
  addText(
    "202",
    "There are 3 different Cooking Utilities provided for you to use, each housing unique Food that can be produced."
  );
}
function langGenerateSettingsStrings() {
  const addText = (identifier, text) =>
    applyEnglishKey("SETTINGS", identifier, text);
  addText("CATEGORY_0", "Combat Settings");
  addText("CATEGORY_1", "General Settings");
  addText("CATEGORY_2", "Notification Settings");
  addText("CATEGORY_3", "Mobile Push Notification Settings");
  addText("CATEGORY_4", "Minibar Settings");
  addText("CATEGORY_5", "Interface Settings");
  addText("CATEGORY_6", "Performance Settings");
  addText("CATEGORY_7", "Account Settings");
  addText("CATEGORY_8", "Steam Settings");
  addText("SETTING_0_0", "Toggle Offline Combat");
  addText("SETTING_0_1", "Toggles the Offline Combat functionality.");
  addText("SETTING_0_2", "Special Attack Modifier Colour");
  addText(
    "SETTING_0_3",
    "Determines the colours used for Enemy Special Attack Modifier descriptions.<br>Colours are determined by the game's general perspective of a Buff / Debuff."
  );
  addText("SETTING_0_4", "Green (Buffs) & Red (Debuffs)");
  addText("SETTING_0_5", "Neutral (Buffs & Debuffs)");
  addText("SETTING_1_0", "Toggle Ignore Bank Full");
  addText("SETTING_1_1", "Continue Thieving on Stun");
  addText("SETTING_1_2", "Auto Restart Dungeon");
  addText("SETTING_1_3", "Show Virtual Levels");
  addText("SETTING_1_4", "Allow Perfect Cooking");
  addText(
    "SETTING_1_5",
    "Pause actions for skills (Except for Farming) when the game is minimised or placed in the background to activate offline progression upon return."
  );
  addText("SETTING_2_0", "Show Item Sale Confirmations");
  addText("SETTING_2_1", "Show Shop Purchase Confirmations");
  addText("SETTING_2_2", "Show Item Notifications");
  addText("SETTING_2_3", "Show GP Notifications");
  addText("SETTING_2_4", "Show Mastery Checkpoint Notifications");
  addText(
    "SETTING_2_5",
    `Show "You have been Stunned" Notifications in Combat.`
  );
  addText("SETTING_2_6", `Show "You are now Asleep" Notifications in Combat.`);
  addText(
    "SETTING_2_7",
    "Show Notification when you discover a Summoning Mark (Level up popups will always show)."
  );
  addText(
    "SETTING_2_8",
    "Show confirmation when attempting to close the game."
  );
  addText("SETTING_3_0", "Toggle Offline Time Cap Push Notifications");
  addText(
    "SETTING_3_1",
    `Toggle Farming "Ready to Harvest" Push Notifications`
  );
  addText("SETTING_3_2", "Connect Mobile Device to your Cloud Account");
  addText(
    "SETTING_3_3",
    "If you are logged into the Cloud, this allows the Desktop versions of the game to schedule Push Notifications to your Mobile Device.<br>If you are having issues, or have changed Devices, please disconnect and then reconnect your Device."
  );
  addText("SETTING_3_4", "Connect Device");
  addText("SETTING_4_0", "Toggle Skilling Minibar");
  addText("SETTING_4_1", "Toggle Combat Minibar");
  addText("SETTING_4_2", "Display Combat Minibar on Combat Screen");
  addText("SETTING_4_3", "Combat Minibar - Display Equipment Set Selection");
  addText("SETTING_4_4", "Combat Minibar - Display Enemy HP & Attack Bar");
  addText("SETTING_5_0", "Default Page on Load");
  addText("SETTING_5_1", "Use small Level Up Notifications");
  addText("SETTING_5_2", "Toggle Mini Sidebar Mode");
  addText("SETTING_5_3", "Toggle Dark Mode");
  addText("SETTING_5_4", "Number Format");
  addText("SETTING_5_5", "Remove commas from all numbers");
  addText("SETTING_5_6", "(REQUIRES REFRESH FOR CHANGES TO TAKE EFFECT).");
  addText(
    "SETTING_5_7",
    "Toggle Minor Accessibility Features. Please refresh after changing setting."
  );
  addText("SETTING_6_0", "Show Combat Damage Splashes");
  addText("SETTING_6_1", "Render Progress Bars");
  addText("SETTING_7_0", "Save Management");
  addText("SETTING_7_1", "Reset Account Progress");
  addText("SETTING_7_2", "Fix my Save");
  addText("SETTING_7_3", "Delete Character");
  addText("SETTING_MISC_0", "Automatically equip food when it is made?");
  addText("SETTING_MISC_1", "Enable Perfect Cooks?");
  addText(
    "SETTING_2_9",
    "Show confirmation when attempting to destroy a Farming crop."
  );
  addText(
    "SETTING_2_10",
    "Show confirmation when attempting to reroll a 5% Astrology Modifier."
  );
  addText(
    "SETTING_2_11",
    "Show current quantity of item in your Bank in Item Notification."
  );
  addText("SETTING_2_12", "Show Item Preservation Notifications.");
  addText("SETTING_2_13", "Show Slayer Coin Notifications.");
  addText("SETTING_8_0", "Set Zoom Level");
  addText("SETTING_8_0_0", "70%");
  addText("SETTING_8_0_1", "80%");
  addText("SETTING_8_0_2", "90%");
  addText("SETTING_8_0_3", "100%");
  addText("SETTING_8_0_4", "110%");
  addText("SETTING_8_0_5", "120%");
  addText("SETTING_8_0_6", "130%");
  addText("SETTING_8_1", "Full Screen");
  addText("SETTING_8_1_0", "Toggle Full Screen");
}
function langGenerateAstrologyStrings() {
  const addText = (identifier, text) =>
    applyEnglishKey("ASTROLOGY", identifier, text);
  addText("MISC_0", "Standard Modifiers");
  addText("MISC_1", "Unique Modifiers");
  addText("MISC_2", "Possible Modifiers");
  addText("MISC_3", "No Modifier Active. Maybe you should get one?");
  addText("MISC_4", "You don't have enough ${itemName} to reroll.");
  addText("MISC_5", "List displays highest possible value only.");
  addText("BTN_0", "Study");
  addText("BTN_1", "Explore");
  addText("BTN_2", "Go Back");
  addText("BTN_3", "Reroll All Standard Modifiers for ${itemImage} ${qty}");
  addText("BTN_4", "Reroll All Unique Modifiers for ${itemImage} ${qty}");
  addText("BTN_5", "View Possible Modifiers");
  addText("BTN_6", "View All Active Modifiers");
  addText("MISC_6", "All Active Astrology Modifiers");
}
function langGeneratePageNameMisc() {
  const addText = (identifier, text) =>
    applyEnglishKey("PAGE_NAME_MISC", identifier, text);
  addText("1", "Minigame");
  addText("2", "Other");
  addText("9", "News & Changelog");
  addText("10", "Recent News");
  addText("11", "Development Roadmap");
  addText("12", "Socials");
  addText("13", "Wiki");
  addText("14", "Patreon");
  addText("15", "Discord");
  addText("16", "Donate");
  addText("17", "Reddit");
  addText("18", "Facebook");
  addText("19", "Twitter");
  addText("20", "Instagram");
  addText("21", "Report a Bug");
  addText("22", "Official");
}
function langGenerateTutorialText() {
  const addText = (identifier, text) =>
    applyEnglishKey("TUTORIAL", identifier, text);
  addText("TASK_PREFIX_0", "Cut");
  addText("TASK_PREFIX_1", "Buy");
  addText("TASK_PREFIX_2", "Equip");
  addText("TASK_PREFIX_7", "Catch");
  addText("TASK_PREFIX_8", "Burn");
  addText("TASK_PREFIX_9", "Cook");
  addText("TASK_PREFIX_10", "Mine");
  addText("TASK_PREFIX_11", "Smith");
  addText("TASK_PREFIX_13", "Kill");
  addText("TASK_PREFIX_15", "Plant");
  addText("TASK_PREFIX_16", "Fletch");
  addText("TASK_PREFIX_18", "Runecraft");
  addText("MISC_0", "Progress");
  addText("MISC_1", "Your personal guide to Melvor Idle");
  addText("MISC_2", "Rewards");
  addText("MISC_3", "Tutorial Task Completed!");
  addText("MISC_4", "Head back to Tutorial Island to claim your Rewards.");
  addText("MISC_5", "Skip Tutorial Island?");
  addText(
    "MISC_6",
    "You will miss out on important information and rewards. Are you sure you want to skip Tutorial Island?"
  );
  addText("MISC_7", "Skip");
  addText("MISC_8", "Tutorial Island Complete!");
  addText(
    "MISC_9",
    "The Tutorial has finished! It's up to you from now on. Go forth and begin your massive journey within Melvor Idle!"
  );
  addText("PAGE_LOCKED", "Page Locked");
  addText("MINIGAME_LOCKED", "Minigame Locked");
  addText("COMBAT_LOCKED", "Combat is currently locked.");
  addText("GOLBIN_RAID_LOCKED", "Golbin Raid is currently locked.");
  addText("SKILL_LOCKED", "${skillName} is currently locked.");
  addText("SHOP_LOCKED", "This Shop Item is currently locked.");
  addText("CONTINUE_TUTORIAL", "Continue Tutorial Island to unlock this Page.");
  addText(
    "CONTINUE_TUTORIAL_SHOP",
    "Continue Tutorial Island to unlock this Shop Item."
  );
}
function langGenerateIAPStrings() {
  const addText = (identifier, text) =>
    applyEnglishKey("IAP", identifier, text);
  addText(
    "DESC_SKILL",
    '${skillName} is only available on the <span class="font-w700 text-success">Full Version</span> of Melvor Idle.'
  );
  addText(
    "DESC_DUNGEON",
    '${dungeonName} is only available on the <span class="font-w700 text-success">Full Version</span> of Melvor Idle.'
  );
  addText(
    "DESC_SKILL_STEAM",
    '${skillName} is only available on the <span class="font-w700 text-success">STEAM VERSION</span> of Melvor Idle.'
  );
  addText(
    "DESC_DUNGEON_STEAM",
    '${dungeonName} is only available on the <span class="font-w700 text-success">STEAM VERSION</span> of Melvor Idle.'
  );
  addText("CALL_TO_ACTION", "Would you like to upgrade now?");
  addText("BTN_WEB", "Purchase on Steam");
  addText("BTN_MOBILE", "Upgrade to Full Version");
  addText("BTN_MOBILE_Q", "Upgrade to Full Version?");
  addText("NOTICE_0", "Full Version Only");
  addText("PRICE", "Upgrade for ${price}");
  addText("NOTICE_DEMO", "Try Melvor Idle for Free");
  addText(
    "DESC_WEB",
    `Unlock extra Skills, Gamemodes and Dungeons by upgrading to Full Version.`
  );
  addText(
    "DESC_WEB_ALT",
    `Unlock extra Skills, Gamemodes and Dungeons by purchasing on STEAM.`
  );
}
function langGenerateCompletionText() {
  const addText = (identifier, text) =>
    applyEnglishKey("COMPLETION", identifier, text);
  addText("CONGRATS", "Congratulations!");
  addText("SKILL_LEVEL_99", "Your ${skillName} Level is now 99");
  addText(
    "SKILL_LEVEL_99_NOTICE",
    "You can now purchase the ${itemName} in the Shop"
  );
  addText("SKILL_LEVEL_MILESTONES", "New Milestones unlocked:");
  addText("MASTERY_LEVEL_99", "${itemName} has reached Level 99 Mastery");
  addText("LOG_ITEMS_FILTER_0", "Show All");
  addText("LOG_ITEMS_FILTER_1", "Show Discovered Items");
  addText("LOG_ITEMS_FILTER_2", "Show Undiscovered Items");
  addText("LOG_ITEMS_SEARCH", "Search Item Log...");
  addText("LOG_MONSTERS_0", "Normal Monsters");
  addText("LOG_MONSTERS_1", "Dungeon Bosses");
  addText(
    "LOG_MONSTERS_DESC",
    "Monsters Defeated: ${num1} / ${num2} (${percent})"
  );
  addText(
    "LOG_SKILLS_DESC",
    "Skill Total Level: ${num1} / ${num2} (${percent})"
  );
  addText(
    "LOG_MASTERY_DESC",
    "Mastery Total Level: ${num1} / ${num2} (${percent})"
  );
  addText("LOG_ITEMS_DESC", "Items Found: ${num1} / ${num2} (${percent})");
  addText("LOG_PETS_DESC", "Pets Found: ${num1} / ${num2} (${percent})");
  addText("LOG_PETS_UNLOCKED", "Pet Unlocked!");
  addText("LOG_PETS_MISC", "Pet bonuses are always active.");
  addText("LOG_PETS_Pet", "You Pet ${petName}");
  addText("LOG_PETS_MARK", "Achieve Max Level in all Summoning Marks");
}
function langGenerateStatisticsText() {
  const addText = (identifier, text) =>
    applyEnglishKey("STATISTICS", identifier, text);
  addText("STATISTIC", "Statistic");
  addText("ITEMS_0", "Times Found:");
  addText("ITEMS_1", "Quantity Sold:");
  addText("ITEMS_2", "GP Gained from Sales:");
  addText("ITEMS_3", "Times Lost Due to Death:");
  addText("ITEMS_4", "Damage Taken whilst Equipped:");
  addText("ITEMS_5", "Damage Dealt:");
  addText("ITEMS_6", "Attacks Missed:");
  addText("ITEMS_7", "Times Eaten:");
  addText("ITEMS_8", "Healed for:");
  addText("ITEMS_9", "Total Attacks:");
  addText("ITEMS_10", "Amount Used in Combat:");
  addText("ITEMS_11", "Time Spent Waiting to Grow:");
  addText("ITEMS_12", "Crop Deaths:");
  addText("ITEMS_13", "Successful Grows:");
  addText("ITEMS_14", "Amount Harvested:");
  addText("ITEMS_15", "Enemies Killed With:");
  addText("ITEMS_16", "Times Opened:");
  addText("ITEMS_17", "Quantity Transformed by Magic:");
  addText("ITEMS_18", "Times Buried:");
  addText("MONSTERS_0", "Damage Taken from Monster:");
  addText("MONSTERS_1", "Damage Dealt to Monster:");
  addText("MONSTERS_2", "Times Slain:");
  addText("MONSTERS_3", "Times Killed by Monster:");
  addText("MONSTERS_4", "Hits Taken from Monster:");
  addText("MONSTERS_5", "Successful Hits to Monster:");
  addText("MONSTERS_6", "Attacks from Monster Dodged:");
  addText("MONSTERS_7", "Attacks Against Monster Missed:");
  addText("MONSTERS_8", "Times Encountered:");
  addText("MONSTERS_9", "Times Fled from Monster:");
  addText("MISC_0", "Item does not count towards completion.");
  addText("CATEGORY_GENERAL", "General");
  addText("CATEGORY_MELEE_COMBAT", "Melee Combat");
  addText("CATEGORY_RANGED_COMBAT", "Ranged Combat");
  addText("CATEGORY_MAGIC_COMBAT", "Magic Combat");
  addText("SKILL_ACTIONS", "${skillName} Actions");
  addText("ITEMS_USED", "Items Used");
  addText("ITEMS_PRESERVED", "Items Preserved");
  addText("GP_USED", "GP Used");
  addText("GP_PRESERVED", "GP Preserved");
  addText("SC_USED", "Slayer Coins Used");
  addText("SC_PRESERVED", "Slayer Coins Preserved");
  addText("ITEMS_GAINED", "Items Gained");
  addText("ITEMS_MADE", "Items Made");
  addText("GP_GAINED", "GP Gained");
  addText("SC_EARNED", "Slayer Coins Earned");
  addText("TOTAL_SKILL_LEVEL", "Total Skill Level");
  addText("TOTAL_XP", "Total XP");
  addText("TOTAL_MASTERY_LEVEL", "Total Mastery Level");
  addText("TOTAL_MASTERY_XP", "Total Mastery XP");
  addText("TOTAL_GP_GAINED", "Total GP Gained");
  addText("TOTAL_ITEMS_SOLD", "Total Items Sold");
  addText("USERNAME_CHANGES", "Username Changes");
  addText("ACCOUNT_AGE", "Account Age");
  addText("ACCOUNT_CREATION_DATE", "Account Creation Date");
  addText("SIGNET_RING_HALVES_MISSED", "Signet Ring Halves Missed");
  addText("MONSTERS_SLAIN", "Monsters Slain");
  addText("TOTAL_DAMAGE_DEALT", "Total Damage Dealt");
  addText("TOTAL_DAMAGE_TAKEN", "Total Damage Taken");
  addText("TOTAL_ATTACKS_MISSED", "Total Attacks Missed");
  addText("DEATHS", "Deaths");
  addText("TOTAL_FOOD_CONSUMED", "Total Food Consumed");
  addText(
    "HITPOINTS_GAINED_FROM_EATING_FOOD",
    "Hitpoints Gained from Eating Food"
  );
  addText("TOTAL_DUNGEONS_COMPLETED", "Total Dungeons Completed");
  addText(
    "TIME_SPENT_WAITING_FOR_MONSTERS_TO_SPAWN",
    "Time Spent Waiting for Monsters to Spawn"
  );
  addText("TIME_SPENT_FIGHTING_MONSTERS", "Time Spent Fighting Monsters");
  addText("TIME_SPENT_PAUSED", "Time Spent Paused");
  addText("ITEMS_LOOTED", "Items Looted");
  addText("GP_EARNED", "GP Earned");
  addText("DUNGEON_REWARDS_EARNED", "Dungeon Rewards Earned");
  addText("MELEE_ATTACKS_MADE", "Melee Attacks Made");
  addText("MELEE_ATTACKS_HIT", "Melee Attacks Hit");
  addText("MELEE_ATTACKS_MISSED", "Melee Attacks Missed");
  addText("MELEE_DAMAGE_DEALT", "Melee Damage Dealt");
  addText("RANGED_ATTACKS_MADE", "Ranged Attacks Made");
  addText("RANGED_ATTACKS_HIT", "Ranged Attacks Hit");
  addText("RANGED_ATTACKS_MISSED", "Ranged Attacks Missed");
  addText("RANGED_DAMAGE_DEALT", "Ranged Damage Dealt");
  addText("AMMO_USED", "Ammo Used");
  addText("MAGIC_ATTACKS_MADE", "Magic Attacks Made");
  addText("MAGIC_ATTACKS_HIT", "Magic Attacks Hit");
  addText("MAGIC_ATTACKS_MISSED", "Magic Attacks Missed");
  addText("MAGIC_DAMAGE_DEALT", "Magic Damage Dealt");
  addText("RUNES_USED", "Runes Used");
  addText("TOTAL_BONES_BURIED", "Total Bones Buried");
  addText("PRAYER_POINTS_EARNED", "Prayer Points Earned");
  addText("PRAYER_POINTS_SPENT", "Prayer Points Spent");
  addText("PRAYER_POINTS_PRESERVED", "Prayer Points Preserved");
  addText("EASY_TASKS_COMPLETED", "Easy Tasks Completed");
  addText("NORMAL_TASKS_COMPLETED", "Normal Tasks Completed");
  addText("HARD_TASKS_COMPLETED", "Hard Tasks Completed");
  addText("ELITE_TASKS_COMPLETED", "Elite Tasks Completed");
  addText("MASTER_TASKS_COMPLETED", "Master Tasks Completed");
  addText("TOTAL_TASKS_COMPLETED", "Total Tasks Completed");
  addText("SLAYER_COINS_EARNED", "Slayer Coins Earned");
  addText("MONSTERS_SLAIN_ON_TASKS", "Monsters Slain on Tasks");
  addText("TREES_CUT", "Trees Cut/Environmental Impact");
  addText("TIME_SPENT_CUTTING", "Time Spent Cutting");
  addText("LOGS_EARNED", "Logs Earned");
  addText("BIRD_NESTS_EARNED", "Bird Nests Earned/Baby Birds Orphaned");
  addText("FISH_CAUGHT", "Fish Caught");
  addText("JUNK_ITEMS_CAUGHT", "Junk Items Caught");
  addText("SPECIAL_ITEMS_CAUGHT", "Special Items Caught");
  addText("TIME_SPENT_FISHING", "Time Spent Fishing");
  addText("LOGS_BURNT", "Logs Burnt");
  addText("FIRES_LIT", "Fires Lit");
  addText("BONFIRES_LIT", "Bonfires Lit");
  addText("GP_SACRIFICED_TO_THE_FIRE_GODS", "GP Sacrificed to the Fire Gods");
  addText("BONUS_XP_GAINED_FROM_BONFIRES", "Bonus XP Gained from Bonfires");
  addText("LOGS_PRESERVED", "Logs Preserved");
  addText("COAL_GAINED", "Coal Gained");
  addText("GP_GAINED", "GP Gained");
  addText("INGREDIENTS_USED", "Ingredients Used");
  addText("INGREDIENTS_PRESERVED", "Ingredients Preserved");
  addText("SUCCESSFUL_COOKS", "Successful Cooks");
  addText("FAILED_COOKS", "Failed Cooks");
  addText("PASSIVE_COOKS", "Passive Cooks");
  addText("TOTAL_COOKING_ACTIONS", "Total Cooking Actions");
  addText("FOOD_COOKED", "Food Cooked");
  addText("TIME_SPENT_COOKING", "Time Spent Cooking");
  addText("PERFECT_COOKS", "Perfect Cooks");
  addText("ORES_MINED", "Ores Mined");
  addText(
    "EMPTY_ORES_MINED",
    "Empty Ores you have attempted to mine for some unknown reason"
  );
  addText("TIME_SPENT_MINING", "Time Spent Mining");
  addText("GEMS_MINED", "Gems Mined");
  addText("ROCK_HP_PRESERVED", "Rock HP Preserved");
  addText("ROCKS_DEPLETED", "Rocks Depleted");
  addText("SMELTING_ACTIONS", "Smelting Actions");
  addText("SMITHING_ACTIONS", "Smithing Actions");
  addText("TOTAL_ACTIONS", "Total Actions");
  addText("TIME_SPENT_SMITHING", "Time Spent Smithing");
  addText("BARS_USED", "Bars Used");
  addText("BARS_PRESERVED", "Bars Preserved");
  addText("ORES_USED", "Ores Used");
  addText("ORES_PRESERVED", "Ores Preserved");
  addText("ITEMS_SMITHED", "Items Smithed");
  addText("BARS_SMELTED", "Bars Smelted");
  addText("SUCCESSFUL_PICKPOCKETS", "Successful Pickpockets");
  addText("FAILED_PICKPOCKETS", "Failed Pickpockets");
  addText("TOTAL_PICKPOCKETS", "Total Pickpockets");
  addText("DAMAGE_TAKEN_FROM_NPCS", "Damage Taken from NPCs");
  addText("TIME_SPENT_STEALING", "Time Spent Stealing");
  addText("TIME_SPENT_STUNNED", "Time Spent Stunned");
  addText("TOTAL_TIME_SPENT", "Total Time Spent");
  addText("GP_STOLEN", "GP Stolen");
  addText("COMMON_ITEMS_STOLEN", "Common Items Stolen");
  addText("RARE_ITEMS_STOLEN", "Rare Items Stolen");
  addText("AREA_UNIQUE_ITEMS_STOLEN", "Area Unique Items Stolen");
  addText("NPC_UNIQUE_ITEMS_STOLEN", "NPC Unique Items Stolen");
  addText("TOTAL_ITEMS_STOLEN", "Total Items Stolen");
  addText("ALLOTMENT_PATCHES_HARVESTED", "Allotment Patches Harvested");
  addText("HERB_PATCHES_HARVESTED", "Herb Patches Harvested");
  addText("TREES_HARVESTED", "Trees Harvested");
  addText("CROPS_DIED", "Crops Died");
  addText("COMPOST_USED", "Compost Used");
  addText("WEIRD_GLOOP_USED", "Weird Gloop Used");
  addText(
    "TIME_SPENT_WAITING_FOR_PLANTS_TO_GROW",
    "Time Spent Waiting for Plants to Grow"
  );
  addText(
    "TIME_SPENT_WAITING_FOR_PLANTS_TO_DIE",
    "Time Spent Waiting for Plants to Die"
  );
  addText("TOTAL_TIME_SPENT", "Total Time Spent");
  addText("SEEDS_PLANTED", "Seeds Planted");
  addText("HERBS_GAINED", "Herbs Gained");
  addText("LOGS_GAINED", "Logs Gained");
  addText("FOOD_GAINED", "Food Gained");
  addText("ARROW_SHAFTS_CREATED", "Arrow Shafts Created");
  addText("ITEMS_FLETCHED", "Items Fletched");
  addText("TIME_SPENT_FLETCHING", "Time Spent Fletching");
  addText("ITEMS_USED", "Items Used");
  addText("ITEMS_PRESERVED", "Items Preserved");
  addText("ITEMS_CRAFTED", "Items Crafted");
  addText("TIME_SPENT_CRAFTING", "Time Spent Crafting");
  addText("ITEMS_USED", "Items Used");
  addText("ITEMS_PRESERVED", "Items Preserved");
  addText("GP_USED", "GP Used");
  addText("GP_PRESERVED", "GP Preserved");
  addText("ITEMS_RUNECRAFTED", "Items Runecrafted");
  addText("TIME_SPENT_RUNECRAFTING", "Time Spent Runecrafting");
  addText("ITEMS_USED", "Items Used");
  addText("ITEMS_PRESERVED", "Items Preserved");
  addText("POTIONS_BREWED", "Potions Brewed");
  addText("TIME_SPENT_BREWING", "Time Spent Brewing");
  addText("POTIONS_USED", "Potions Used");
  addText("POTION_CHARGES_USED", "Potion Charges Used");
  addText("REAGENTS_USED", "Reagents Used");
  addText("REAGENTS_PRESERVED", "Reagents Preserved");
  addText("OBSTACLES_COMPLETED", "Obstacles Completed");
  addText("COURSES_COMPLETED", "Courses Completed");
  addText("OBSTACLES_BUILT", "Obstacles Built");
  addText("GP_EARNED", "GP Earned");
  addText("TIME_SPENT_TRAINING_AGILITY", "Time Spent Training Agility");
  addText("TIME_SPENT_CREATING_TABLETS", "Time Spent Creating Tablets");
  addText("TOTAL_MARKS_DISCOVERED", "Total Marks Discovered");
  addText("SYNERGIES_UNLOCKED", "Synergies Unlocked");
  addText("TABLETS_USED", "Tablets Used");
  addText("ITEMS_USED", "Items Used");
  addText("ITEMS_PRESERVED", "Items Preserved");
  addText("GP_USED", "GP Used");
  addText("GP_PRESERVED", "GP Preserved");
  addText("SLAYER_COINS_USED", "Slayer Coins Used");
  addText("SLAYER_COINS_PRESERVED", "Slayer Coins Preserved");
  addText("TABLETS_MADE", "Tablets Made");
  addText("ALT_MAGIC_SPELLS_CAST", "Alt. Magic Spells Cast");
  addText(
    "TIME_SPENT_CASTING_ALT_MAGIC_SPELLS",
    "Time Spent Casting Alt. Magic Spells"
  );
  addText("ITEMS_TRANSFORMED", "Items Transformed");
  addText("GP_TRANSMUTED_FROM_ALCHEMY", "GP Transmuted from Alchemy");
  addText("BARS_SUPERHEATED", "Bars Superheated");
  addText("BONES_CREATED_FROM_NOTHING", "Bones Created from Nothing");
  addText("GEMS_CREATED", "Gems Created");
  addText("RUNES_USED", "Runes Used");
  addText("PURCHASES_MADE", "Purchases Made");
  addText("ITEMS_PURCHASED", "Items Purchased");
  addText("GP_SPENT", "GP Spent");
  addText("SLAYER_COINS_SPENT", "Slayer Coins Spent");
  addText("RAID_COINS_SPENT", "Raid Coins Spent");
  addText("UPGRADES_PURCHASED", "Upgrades Purchased");
  addText("GLOVE_CHARGES_PURCHASED", "Glove Charges Purchased");
  addText("ITEMS_SPENT", "Items Spent");
  addText("GOLBINS_SLAUGHTERED", "Golbins Slaughtered");
  addText("HIGHEST_WAVE_REACHED", "Highest Wave Reached");
  addText("RAID_COINS_EARNED", "Raid Coins Earned");
  addText("TIME_SPENT_RAIDING", "Time Spent Raiding");
  addText("LONGEST_RAID", "Longest Raid");
  addText("TOTAL_RAID_DEATHS", "Total Raid Deaths");
  addText("RAID_UPGRADES_PURCHASED", "Raid Upgrades Purchased");
  addText("GOLBIN_CRATES_PURCHASED", "Golbin Crates Purchased");
  addText("WAVES_COMPLETED", "Waves Completed");
  addText("TIME_SPENT_STAR_GAZING", "Time Spent Star Gazing");
  addText(
    "TIMES_STANDARD_MODIFIERS_REROLLED",
    "Times Standard Modifiers Rerolled"
  );
  addText("TIMES_UNIQUE_MODIFIERS_REROLLED", "Times Unique Modifiers Rerolled");
  addText("TIMES_MAXIMUM_ROLL_WAS_HIT", "Times Maximum Roll was Hit");
  addText("TIMES_MINIMUM_ROLL_WAS_HIT", "Times Minimum Roll was Hit");
  addText("PET_HINT", "Hint: ${petHint}");
  addText("PET_NO_COMPLETION", "Pet does not count towards completion.");
}
function langGenerateMenuText() {
  const addText = (identifier, text) =>
    applyEnglishKey("MENU_TEXT", identifier, text);
  addText("CREATE", "Create");
  addText("NONE_SELECTED", "No item selected.");
  addText("VIEW_STATS", "View Item Stats");
  addText("MASTERY", "Mastery");
  addText("REQUIRES", "Requires:");
  addText("YOU_HAVE", "You Have:");
  addText("PRODUCES", "Produces:");
  addText("AND", "and:");
  addText("SELECT_ITEM", "Select Item");
  addText("GRANTS", "Grants:");
  addText("GP", "GP");
  addText("SLAYER_COINS", "Slayer Coins");
  addText("TOOLTIP_SKILL_XP", "${xp} Skill XP");
  addText("TOOLTIP_INTERVAL", "How long an action will take.");
  addText("TOOLTIP_DOUBLE", "Chance to double Items");
  addText("TOOLTIP_PRESERVE", "Chance to preserve Recipe Resources.");
  addText("TOOLTIP_CAPPED", "Capped at ${chance}% Chance.");
  addText("TOOLTIP_CHANCE_BELOW", "Chances below 0% will act as 0% chance.");
  addText(
    "TOOLTIP_FUTURE_UPDATE",
    "In a future update, you will be able to see where your bonuses come from."
  );
  addText("TOOLTIP_MASTERY_XP", "${value} Mastery XP");
  addText("TOOLTIP_MASTERY_POOL_XP", "${value} Mastery Pool XP");
  addText(
    "TOOLTIP_STEALTH_VS",
    '${stealth} <span class="text-warning">Stealth</span> vs. ${perception} <span class="text-danger">Perception</span>'
  );
  addText("SUCCESS_RATE", "Success Rate: ${value}");
  addText("TOOLTIP_INCREASED_DOUBLING", "Increased Item Doubling: ${value}");
  addText("TOOLTIP_NPC_UNIQUE_CHANCE", "NPC Unique Item Chance: ${value}");
  addText("TOOLTIP_MASTERY_UNLOCK", "Unlocked at Mastery Level ${level}");
  addText("POTION_TIER", "Potion Tier:");
  addText("POTION_CHARGES", "${charges} charges per use");
  addText("SKILL", "Skill: ${skillName}");
  addText("SELECT_RECIPE", "Select Recipe");
  addText("UNLOCKED_AT", "Unlocked at ${skillImage} Level ${level}");
  addText("USE_COMBINATION_RUNES", "Use Combination Runes");
  addText("OR", "or");
  addText("THE_FAMILIAR", "The ${name} Familiar");
  addText("SUMMON_TIER", "Tier ${tier} Summon");
  addText("MARK_UNLOCATED", "Mark not yet located");
  addText("SHARD_PURCHASE", "Summoning Shards are purchased from the Shop.");
  addText("PICKPOCKET", "Pickpocket");
  addText("SHOW_DROPS", "Show Drops");
  addText("PERCEPTION", "Perception: ${value}");
  addText("MAX_HIT", "Max Hit: ${value}");
  addText("STOP_THIEVING", "Stop Thieving");
  addText("EARLY_ACCESS", "EARLY ACCESS");
  addText("CUT", "Cut");
  addText("LOCKED", "Locked");
  addText("LEVEL", "Level ${level}");
  addText("XP_AMOUNT", "${xp} XP");
  addText("SECONDS", "${seconds} seconds");
  addText("MINE", "Mine");
  addText("MINING", "Mining");
  addText(
    "DRAGON_ORE_REQ",
    "Total Mining Mastery Level of ${level} required to mine."
  );
  addText("FISH_CHANCE", "Fish: ${fishChance}");
  addText("JUNK_CHANCE", "Junk: ${junkChance}");
  addText("SPECIAL_CHANCE", "Special: ${specialChance}");
  addText("SECONDS_RANGE", "${minTime}s - ${maxTime}s");
  addText("PLUS_XP", "+${xp} XP");
  addText("IDLE", "Idle");
  addText("START_FISHING", "Start Fishing");
  addText("STOP_FISHING", "Stop Fishing");
  addText("SECONDS_SHORT", "${seconds}s");
  addText("SELECT_LOGS", "Select your logs");
  addText("BURN", "Burn");
  addText("LIGHT_BONFIRE", "Light Bonfire (10 Logs)");
  addText("BONFIRE_STATUS", "Bonfire Status:");
  addText("FIREMAKING_XP_BONUS", "Firemaking XP Bonus when active:");
  addText("ACTIVE", "Active");
  addText("INACTIVE", "Inactive");
  addText("BONUSES", "Bonuses:");
  addText("TOOLTIP_PERFECT_COOK", "Chance for Perfect Cook.");
  addText("TOOLTIP_SUCCESSFUL_COOK", "Chance for Successful Cook.");
  addText("ACTIVE_COOK", "Active Cook");
  addText("PASSIVE_COOK", "Passive Cook");
  addText("SELECT_COOKING_RECIPE", "Select Recipe to Cook");
  addText("HP", "HP");
  addText("COLLECT_FROM_STOCKPILE", "Collect from Stockpile");
  addText("IN_BANK", "In Bank");
  addText("NORMAL", "Normal: ${quantity}");
  addText("PERFECT", "Perfect: ${quantity}");
  addText("SELECT_SMITHING_CATEGORY", "Select Smithing Category");
  addText("SELECT_FLETCHING_CATEGORY", "Select Fletching Category");
  addText("SELECT_CRAFTING_CATEGORY", "Select Crafting Category");
  addText("SELECT_CRAFTING_CATEGORY", "Select Crafting Category");
  addText("SELECT_RUNECRAFTING_CATEGORY", "Select Runecrafting Category");
  addText("SELECT_HERBLORE_CATEGORY", "Select Herblore Category");
  addText("SELECT_SUMMONING_CATEGORY", "Select Summoning Category");
  addText("SELECT_STATS_CATEGORY", "Select Stats Category");
  addText("HARVEST_ALL", "Harvest All: ${gpIcon} ${gpCost}");
  addText("COMPOST_ALL", "Apply Compost to all Plots: ${gpIcon} ${gpCost}");
  addText("GLOOP_ALL", "Apply Weird Gloop to all Plots: ${gpIcon} ${gpCost}");
  addText("PLANT_ALL", "Plant All: ${gpIcon} ${gpCost}");
  addText("PLANT_ALL_SELCTED", "Plant All Selected: ${gpIcon} ${gpCost}");
  addText("HARVEST_READY", "Ready to harvest");
  addText("HARVEST", "Harvest");
  addText("DESTROY", "Destroy");
  addText("PLANT", "Plant a Seed");
  addText("COMPOST_LEVEL", "Compost Level:");
  addText("REQUIREMENTS", "Requirements:");
  addText("UNLOCK", "Unlock");
  addText("GROWING", "Growing: ${itemName}");
  addText("TIME_LEFT", "Time Left: About ${timeLeft} mins");
  addText("AGILITY_GRANTS", "Grants per Obstacle Completion:");
  addText("VIEW_OBSTACLE", "View Obstacle Selection");
  addText("DESTROY_OBSTACLE", "Destroy Obstacle");
  addText("VIEW_PASSIVE_PILLAR", "View Passive Pillar Selection");
  addText("DESTROY_PASSIVE_PILLAR", "Destroy Passive Pillar");
  addText("START_AGILITY", "Start Agility");
  addText("STOP_AGILITY", "Stop Agility");
  addText(
    "VIEW_AGILITY_PASSIVES",
    "View all Global Active Passives from Agility"
  );
  addText(
    "AGILITY_BREAKDOWN",
    "Agility Course Breakdown (Inclusive of Modifiers):"
  );
  addText("CREATE_OBSTACLE", "Create another Obstacle");
  addText("OBSTACLE_NUMBER", "Obstacle ${obstacleNumber}");
  addText("CREATE_PASSIVE_PILLAR", "Create a Passive Pillar");
  addText(
    "PASSIVE_PILLAR_DESC",
    "Provides Global Active Passives. This is not an obstacle."
  );
  addText("REQUIRES_LEVEL", "Requires Level ${level}");
  addText("NONE", "None :(");
  addText("GLOBAL_ACTIVE_PASSIVES", "Global Active Passives:");
  addText("COST", "Cost:");
  addText("BUILD_COUNT", "Built ${count} times.");
  addText("COST_REDUCTION", "Cost Reduction:");
  addText("NO_REQUIREMENT", "No requirements");
  addText("ITEMS", "Items");
  addText("SELECT_OBSTACLE", "Select Agility Obstacle");
  addText("SELECT_PILLAR", "Select Passive Pillar");
  addText(
    "OBSTACLE_INFO_0",
    "Building an Obstacle will provide +${reduction}% Item Cost Reduction for that Obstacle only. Stacks up to ${maxStacks} times."
  );
  addText("OBSTACLE_INFO_1", "Cost reductions are capped at ${reductionCap}%.");
  addText("PILLAR_INFO", "Passive Pillar Costs cannot be reduced.");
  addText("DESTROY_OBSTACLE?", "Destroy Obstacle?");
  addText(
    "DISABLE_OBSTACLE",
    "This will disable all obstacles built after this one. This means you cannot train on them and their Global Active Passives will not be active until an obstacle is rebuilt at full cost in this category."
  );
  addText("CANNOT_UNDO", "This cannot be undone.");
  addText("DESTROY_PILLAR?", "Destroy Passive Pillar?");
  addText(
    "DISABLE_PILLAR",
    "This will remove all Global Active Passives provided by the Passive Pillar, and you must rebuild at full cost."
  );
  addText(
    "REPLACE_OBSTACLE",
    "This will replace any existing obstacle that may be present."
  );
  addText(
    "REPLACE_PILLAR",
    "This will replace your existing Passive Pillar that may be present."
  );
  addText("BUILD_OBSTACLE?", "Build Obstacle?");
  addText("BUILD_PASSIVE_PILLAR?", "Build Passive Pillar?");
  addText("BUILD", "Build");
  addText("CURRENT_PASSIVES", "Current Global Active Passives from Agility:");
  addText("DOES_NOT_SHOW_DISABLED", "Does not show disabled passives");
  addText("GP_AMOUNT", "${gp} GP");
  addText("MARK_DISCOVERED", "Mark Discovered");
  addText(
    "MARK_INFO_0",
    "Gain XP in the respective Skills to have a chance at discovering a Mark."
  );
  addText(
    "MARK_INFO_1",
    "Marks are required to be found in order to create Familiars."
  );
  addText(
    "MARK_INFO_2",
    "IMPORTANT: After finding the first Mark, you are required to create at least 1 Summoning Tablet for the respective Familiar in order to find more Marks."
  );
  addText(
    "MARK_INFO_3",
    "Training the respective Skill while that Familiar is equipped will <strong>DOUBLE</strong> the drop rate of its Marks."
  );
  addText("DISCOVERY_PROGRESS", "Discovery (Level) Progress:");
  addText("CREATE_FAMILIAR", "Create Familiar Tablets");
  addText("DISCOVERY_COUNT", "Marks Discovered: ${count} / ${maxCount}");
  addText("DISCOVERED_IN", "Discovered in:");
  addText("NOT_DISCOVERED", "Not Discovered");
  addText("DISCOVERED", "Discovered");
  addText("MARK_LEVEL", "Mark Level ${level}");
  addText("QUESTION_MARKS", "???");
  addText("MARK_OF_THE", "Mark of the ${familiarName}");
  addText("REQUIRES_SKILL_LEVEL", "Requires ${skillImage} Level ${level}");
  addText("MASTERY_VIEW_CHECKPOINTS", "View Checkpoints");
  addText("MASTERY_SPEND_XP", "Spend ${masteryImage} XP");
  addText("SKILL_LEVEL", "Skill Level");
  addText("SKILL_XP", "Skill XP");
  addText("CURRENT_AXE", "Current Axe");
  addText("CURRENT_ROD", "Current Rod");
  addText("CURRENT_PICKAXE", "Current Pickaxe");
  addText("RAID_COINS", "Raid Coins");
  addText("BUY_LIMIT_REACHED", "Buy limit of ${count} reached.");
  addText(
    "COMPLETE_DUNGEON_ONCE",
    "Complete ${dungeonImage} ${dungeonName} once"
  );
  addText(
    "COMPLETE_DUNGEON_TIMES",
    "Complete ${dungeonImage} ${dungeonName} ${count} times"
  );
  addText(
    "UNLOCK_SLAYER_Easy",
    "Unlocks after ${count} more Easy Slayer Task Completions"
  );
  addText(
    "UNLOCK_SLAYER_Normal",
    "Unlocks after ${count} more Normal Slayer Task Completions"
  );
  addText(
    "UNLOCK_SLAYER_Hard",
    "Unlocks after ${count} more Hard Slayer Task Completions"
  );
  addText(
    "UNLOCK_SLAYER_Elite",
    "Unlocks after ${count} more Elite Slayer Task Completions"
  );
  addText(
    "UNLOCK_SLAYER_Master",
    "Unlocks after ${count} more Master Slayer Task Completions"
  );
  addText("REQUIRES_COMPLETION", "Requires ${percent}% Completion");
  addText("PLUS_CHARGES", "+${count} Charges");
  addText("CURRENT_CHARGES", "${count} Charges");
  addText("PASSIVE_SLOT_COMPATIBLE", "Passive Slot Compatible");
  addText("UNLOCKS", "Unlocks");
  addText(
    "MPXP_NOTICE",
    "Mastery Pool XP can only be used to level up the item."
  );
  addText("MPXP_CLAIM_TOKENS", "Claim Tokens in Bank (${qtyInBank})");
  addText("PLUS_1", "+1");
  addText("PLUS_5", "+5");
  addText("PLUS_10", "+10");
  addText("HOLD_UP", "Hol' Up");
  addText("HOLD_UP_0", "You're about to lose a Mastery Checkpoint.");
  addText("HOLD_UP_1", "Please confirm you actually want to do this?");
  addText("HOLD_UP_2", "This confirmation can be disabled in Settings.");
  addText("HIDE_99", "Hide 99's");
  addText("CONFIRM", "Confirm");
  addText("SPEND_MASTERY_XP", "Spend Mastery XP");
  addText("MASTERY_POOL_CHECKPOINTS", "Mastery Pool Checkpoints");
  addText(
    "MOVE_ITEM_MODE_ACTIVE",
    "Move Item Mode is active! Move items to a new Tab."
  );
  addText("SELECT_TAB", "Select Tab");
  addText("CONFIRM_MOVE", "Confirm Move");
  addText("MOVE_ITEMS_SELECTED", "${num} Items Selected");
  addText("SELL_MODE_ACTIVE", "Sell Mode is active!");
  addText("CONFIRM_SALE", "Confirm Sale");
  addText("SELLS_FOR", "Sells for ${gpIcon} ${gpQty} GP");
  addText("SELL_NUM_ITEMS", "Sell ${num} Items?");
  addText("SKILL_LOCKED", "Skill Locked");
  addText("DUNGEON_LOCKED", "Dungeon Locked");
  addText("UNLOCK_FOR", "Unlock for ${gpIcon} ${value} GP?");
  addText("BUY_X", "Buy x${num}");
  addText(
    "THIEVING_NOTICE_0",
    "Continue Thieving when Stunned is not enabled on this Character."
  );
  addText(
    "THIEVING_NOTICE_1",
    "You are able to die while Thieving Offline. Food and Auto Eat are required to not die."
  );
  addText(
    "THIEVING_NOTICE_2",
    "Having this setting disabled will protect you from unwanted Offline Progress Deaths, as progress will stop when you are stunned."
  );
  addText(
    "THIEVING_NOTICE_3",
    "If you are fine with the potential threat of death and loss of a Hardcore Character, you may re-enable the Setting."
  );
  addText("SKILL_UNLOCK_BURY", "You need to unlock ${skillName} to bury this.");
  addText(
    "SKILL_UNLOCK_OPEN_MENU",
    "You need to unlock ${skillName} to open this menu."
  );
  addText(
    "SKILL_UNLOCK_EXPLORE_AREA",
    "You need to unlock ${skillName} to explore this Combat Areas."
  );
  addText(
    "SKILL_UNLOCK_DO_THAT",
    "You need to unlock ${skillName} to do that!"
  );
  addText(
    "SKILL_UNLOCK_ACCESS_THIS",
    "You need to unlock ${skillName} to access this."
  );
  addText(
    "SKILL_UNLOCK_DEFAULT_PAGE",
    "You need to unlock the skill before you can set it as the Default Page"
  );
  addText("FINDING_A_FRIEND", "Finding you a friend. Please wait...");
  addText("NO_FRIENDS_FOUND", "No friends found...");
  addText("CHECKPOINT_ACTIVE", "Checkpoint active (${xp} XP)");
  addText("XP_REMAINING", "${xpLeft} XP remaining (${xp} XP)");
  addText("PASSIVE_PILLAR", "Passive Pillar");
  addText("NO_BONUSES", "No bonuses.");
  addText("SHOP_ITEM_LOCKED", "Shop Item Locked");
  addText("MARK_DISCOVERED_TEXT0", "You have discovered an unknown Mark.");
  addText(
    "MARK_DISCOVERED_TEXT1",
    "Check it out in the Summoning Page to discover its secrets."
  );
  addText("MARK_DISCOVERED_TEXT2", "You have discovered another ${markName}.");
  addText(
    "MARK_DISCOVERED_TEXT3",
    "Check it out in the Summoning Page to see your progress to the next Mark Level."
  );
  addText(
    "MARK_LEVELUP_TEXT0",
    "You have discovered the secrets of the ${markName}!"
  );
  addText(
    "MARK_LEVELUP_TEXT1",
    "Head to the Summoning page to create the respective Summoning Tablet."
  );
  addText(
    "MARK_LEVELUP_TEXT2",
    "You must create at least 1 of these Summoning Tablets to continue levelling this Mark."
  );
  addText("MARK_LEVELUP_TEXT3", "You have levelled up ${markName}!");
  addText(
    "MARK_LEVELUP_TEXT4",
    'This Familiar can now Synergize with <span class="font-w700 text-warning">Tier ${tierNum} Familiars</span>, assuming the Mark Level for those Familiars is at least <span class="font-w700 text-warning">Level ${markLevel}</span>.'
  );
  addText("LOCKED_SYNERGY", "??? Locked Synergy ???");
  addText("ENEMY_PASSIVES", "Enemy Passives");
  addText("ENEMY_SPECIAL_ATTACKS", "Enemy Special Attacks");
  addText("TRAINS", "Trains:");
  addText("PROVIDES", "Provides:");
  addText("START", "Start");
  addText("MAX_OFFLINE_TIME", "(18 Hours is the maximum offline progression)");
  addText(
    "LEVELED_UP_SKILL_ONCE",
    "You leveled up ${skillName} once (${oldLevel}->${newLevel})"
  );
  addText(
    "LEVELED_UP_SKILL_TIMES",
    "You leveled up ${skillName} ${count} times (${oldLevel}->${newLevel})"
  );
  addText(
    "YOU_KILLED_MONSTER",
    "You killed ${count} ${monsterImage} ${monsterName}"
  );
  addText(
    "COMPLETED_DUNGEON_ONCE",
    "You completed ${dungeonImage} ${dungeonName} once"
  );
  addText(
    "COMPLETED_DUNGEON_TIMES",
    "You completed ${dungeonImage} ${dungeonName} ${count} times"
  );
  addText(
    "COMPLETED_SLAYER_TASK_0",
    "You completed ${count} Easy Slayer task(s)"
  );
  addText(
    "COMPLETED_SLAYER_TASK_1",
    "You completed ${count} Normal Slayer task(s)"
  );
  addText(
    "COMPLETED_SLAYER_TASK_2",
    "You completed ${count} Hard Slayer task(s)"
  );
  addText(
    "COMPLETED_SLAYER_TASK_3",
    "You completed ${count} Elite Slayer task(s)"
  );
  addText(
    "COMPLETED_SLAYER_TASK_4",
    "You completed ${count} Master Slayer task(s)"
  );
  addText("YOU_FOUND_MARK", "You found ${count} ${markImage} ${markName}");
  addText("YOU_GAINED_ITEM", "You gained ${count} ${itemImage} ${itemName}");
  addText(
    "YOU_HAVE_ITEM_LOOT",
    "You have ${count} ${itemImage} ${itemName} to loot"
  );
  addText(
    "LOST_ITEM_LOOT",
    "You looted ${count} ${itemImage} ${itemName}, but your lootbox was full :("
  );
  addText(
    "LOST_ITEM_BANK",
    "We tried to give you ${count} ${itemImage} ${itemName}, but your bank was full :("
  );
  addText("CURRENCY_GAIN_GP", "You earned ${curIcon} ${count} GP");
  addText("CURRENCY_LOSS_GP", "You spent ${curIcon} ${count} GP");
  addText("CURRENCY_GAIN_SC", "You earned ${curIcon} ${count} Slayer Coins");
  addText("CURRENCY_LOSS_SC", "You spent ${curIcon} ${count} Slayer Coins");
  addText("CURRENCY_GAIN_PP", "You earned ${curIcon} ${count} Prayer Points");
  addText("CURRENCY_LOSS_PP", "You spent ${curIcon} ${count} Prayer Points");
  addText("ITEM_USAGE", "You used ${count} ${itemImage} ${itemName}");
  addText(
    "GLOVE_CHARGE_USAGE",
    "You used ${count} ${itemImage} ${itemName} charges"
  );
  addText("FOOD_EATEN", "You ate ${count} ${itemImage} ${itemName}");
  addText("UNLOCKED_AT_SKILL_LEVEL", "Unlocked at ${skillName} Level ${level}");
  addText("SKILLNAME_LEVEL", "${skillName} level ${level}");
  addText("PLACEHOLDER_SELL_X", "Sell x");
  addText("PLACEHOLDER_EXPORTED_SAVE", "Exported Save will be here.");
  addText(
    "TABLET_CHARGES_USED",
    "${qty} ${tabletImage} ${tabletName} Tablet Charges used."
  );
  addText("LEVEL_HEADER", "Level");
  addText("XP_HEADER", "XP");
  addText(
    "LOADING_OFFLINE_PROGRESS",
    "Loading your offline progress. Please wait..."
  );
  addText("USING", "Using:");
  addText("WHICH_GAVE_YOU", "Which gave you:");
  addText("IN_STOCKPILE", "(In Stockpile)");
  addText("SLAYER_COINS_FROM_TASKS", "Earn SC from Slayer Tasks");
  addText("SLAYER_COIN_AMOUNT", "${qty} Slayer Coins");
  addText("CHARGES_REMAINING", "Charges Remaining: ${charges}");
  addText(
    "ADV_MODE_XP_LIMIT_WARNING",
    "Non-Combat Skill Level Limit reached. Level up your Combat Level to continue earning Skill XP."
  );
  addText("YOU_MAY_USE_SKILL", "You may now use this Skill.");
  addText("SKILL_UNLOCKED", "Skill Unlocked!");
  addText("PURCHASE_IN_PROGRESS", "Purchase in Progress");
  addText(
    "PREMIUM_PURCHASE_INFO_0",
    "Once the Purchase is complete - the App will automatically refresh."
  );
  addText(
    "PREMIUM_PURCHASE_INFO_1",
    "If you see no purchase popup, please make sure you have the latest version of the App from the App Store."
  );
  addText("OFFLINE", "Offline");
  addText("MASTERY_POOL", "Mastery Pool");
  addText("ONE_HANDED_WEAPON", "1-Handed Weapon");
  addText("TWO_HANDED_WEAPON", "2-Handed Weapon");
  addText("CLOUD_INFO_TT_0", "The last time your game saved to the Cloud.");
  addText("CLOUD_INFO_TT_1", "Your game still saves locally every 10 seconds.");
  addText("ACHIEVED_100_MASTERY", "You have achieved 100% Mastery in");
  addText("COMPLETION_PROGRESS", "Completion Progress:");
  addText(
    "ACHIEVED_COMPLETION",
    "You have achieved 100% Completion in Melvor Idle"
  );
  addText(
    "COMPLETION_MESSAGE",
    "Your hard work and dedication has paid off. Thank you for being with us on this amazing journey."
  );
  addText(
    "COMPLETION_BUY_CAPE",
    "You can now purchase the Cape of Completion from the Shop as a token of your achievement."
  );
  addText("100_PERCENT_MASTERY", "100% Mastery");
  addText("100_PERCENT_COMPLETION", "100% Completion");
  addText("INCLUSIVE_OF_BONUSES", "Inclusive of bonuses");
  addText("CHANCE_TO_GROW", "Chance to grow: ${chance}%");
  addText("DESTROY_CROP", "Destroy Crop?");
  addText("MAX_ROLL_DETECTED", "Max Roll Detected");
  addText("REROLL_CONFIRM", "Are you sure you want to reroll?");
  addText("REROLL", "Reroll");
  addText("SAVE_LINK", "Save Link");
  addText("CREATE_SAVE_LINK", "Create Sharable Save URL");
  addText("QUICK_BUY_ITEM", "Quick Buy Item");
  addText("UPGRADES_INTO", "Upgrades into:");
  addText("OFFENSIVE_STATS_COMPARISON", "Offensive Stats Comparison");
  addText("DEFENSIVE_STATS_COMPARISON", "Defensive Stats Comparison");
  addText("NO_STATS", "This item has no stats.");
  addText("CLICK_IMAGE", "Click Image to Choose Item");
  addText("CAST", "Cast");
  addText("DELETE_CLOUD_ACCOUNT", "Delete Account Data");
  addText(
    "DELETE_CLOUD_ACCOUNT_0",
    "This will delete all of your Cloud data, including the Cloud account and all data associated with it. This cannot be undone."
  );
  addText("DELETE_CLOUD_ACCOUNT_Q", "Delete Account Data?");
  addText("CURRENTLY_PERCENT_INC", "Currently: +${percent}%");
  addText("CURRENTLY_PERCENT_DEC", "Currently: -${percent}%");
  addText("CURRENTLY_QTY_INC", "Currently: +${qty}");
  addText("CURRENTLY_QTY_DEC", "Currently: -${qty}");
  addText("CURRENTLY_SECONDS_INC", "Currently: +${seconds}s");
  addText("CURRENTLY_SECONDS_DEC", "Currently: -${seconds}s");
  addText("MINIBAR_YOU", "You: ${hpValue}");
  addText("MINIBAR_ENEMY", "Enemy: ${hpValue}");
  addText("DESTROY_LOOT", "Destroy Loot");
  addText("EXISTING_CLOUD_SAVE", "EXISTING CLOUD SAVE DETECTED");
  addText(
    "CREATE_LOCAL_SAVE",
    "Create a Local Save from the Local Save selection screen."
  );
  addText("SAVE_SLOT_NUM", "Save Slot #${number}");
  addText("CLOUD_SAVE_SLOT_EMPTY", "Cloud Save Slot #${number} is empty");
  addText("CLICK_CREATE_CHARACTER", "Click to create a new Character");
  addText(
    "LATEST_PERMADEATH",
    'Your Latest Permadeath: <span class="font-w400">${username}. Killed by ${killedBy}. Total Skill Level ${number}. At ${localDateTime}.</span>'
  );
  addText(
    "SAVE_ERROR_MESSAGE_1",
    "Error loading this Local Save. It may be corrupted."
  );
  addText(
    "SAVE_ERROR_MESSAGE_2",
    "Error loading Local Save. Save version is higher than current game version."
  );
  addText(
    "SAVE_ERROR_MESSAGE_3",
    "Error loading this Cloud Save. It may be corrupted."
  );
  addText(
    "SAVE_ERROR_MESSAGE_4",
    "Error loading Cloud Save. Save version is higher than current game version."
  );
  addText(
    "EXISTING_CLOUD_SAVE_POPUP_TITLE",
    "An existing Cloud Save was detected in Save Slot #${number}"
  );
  addText(
    "EXISTING_CLOUD_SAVE_POPUP_BODY",
    "Importing a Local Save will overwrite the existing Cloud Save. Are you sure you want to proceed?"
  );
  addText("WILL_OVERWRITE", "WILL OVERWRITE");
  addText(
    "ERROR_DISPLAY_CLOUD",
    "There was an error displaying the Cloud Save."
  );
  addText(
    "ERROR_DISPLAY_LOCAL",
    "There was an error displaying the Local Save."
  );
  addText("ITEM_SALE_LOCKED", "Item Sale Locked");
  addText(
    "ITEM_NEEDED_TUTORIAL",
    "This item is needed to complete the tutorial."
  );
  addText("KILL_MONSTER", "Kill ${monsterImage} ${monsterName}");
  addText("FIND_ITEM", "Find ${itemImage} ${itemName}");
  addText(
    "REQUIRES_SLAYER_Easy",
    "Requires ${count} Easy Slayer Task completions"
  );
  addText(
    "REQUIRES_SLAYER_Normal",
    "Requires ${count} Normal Slayer Task completions"
  );
  addText(
    "REQUIRES_SLAYER_Hard",
    "Requires ${count} Hard Slayer Task completions"
  );
  addText(
    "REQUIRES_SLAYER_Elite",
    "Requires ${count} Elite Slayer Task completions"
  );
  addText(
    "REQUIRES_SLAYER_Master",
    "Requires ${count} Master Slayer Task completions"
  );
  addText("REQUIRES_ALL_SKILL", "Requires Level ${level} in all Skills");
  addText(
    "METEORITES_FOUND_ONE",
    "You located ${qty1} ${itemImage} Meteorite totalling ${qty2} Node HP"
  );
  addText(
    "METEORITES_FOUND_MANY",
    "You located ${qty1} ${itemImage} Meteorites totalling ${qty2} Node HP"
  );
  addText(
    "ONYX_FOUND_ONE",
    "You located ${qty1} ${itemImage} Onyx Gem Node totalling ${qty2} Node HP"
  );
  addText(
    "ONYX_FOUND_MANY",
    "You located ${qty1} ${itemImage} Onyx Gem Nodes totalling ${qty2} Node HP"
  );
  addText(
    "ORICHA_FOUND_ONE",
    "You located ${qty1} ${itemImage} Oricha Gem Node totalling ${qty2} Node HP"
  );
  addText(
    "ORICHA_FOUND_MANY",
    "You located ${qty1} ${itemImage} Oricha Gem Nodes totalling ${qty2} Node HP"
  );
  addText("REQUIRES_SHOP_PURCHASE", "Requires ${purchaseName} to be purchased");
  addText(
    "REQUIRES_TOWNSHIP_TASKS",
    "Requires ${count} Township tasks to be completed"
  );
  addText(
    "REQUIRES_ALL_SKILL_EXCEPTION",
    "Requires Level ${level} in all Skills except for ${skillNames}"
  );
}
function langGenerateMagicText() {
  const addText = (identifier, text) =>
    applyEnglishKey("MAGIC", identifier, text);
  addText(
    "SUPERHEAT",
    "Create ${barAmount} x bars using ${oreAmount} x required ores."
  );
  addText(
    "SUPERHEAT_NO_COAL",
    "Create ${barAmount} x bars using ${oreAmount} x required ores, ignoring all Coal Requirements."
  );
  addText(
    "ITEM_ALCHEMY",
    "Convert selected item into GP worth ${percent}% of the item's base sale price."
  );
}
function langGenerateBankText() {
  const addText = (identifier, text) =>
    applyEnglishKey("BANK_STRING", identifier, text);
  addText("0", "Bank space used");
  addText("1", "Bank value");
  addText("2", "Sort");
  addText("3", "Move items to new Tab");
  addText("4", "Toggle Sell Mode");
  addText("5", "Search Bank");
  addText("6", "Item Settings");
  addText("7", "Tab");
  addText(
    "8",
    "Item's Default tab is automatically set to the tab it is moved to."
  );
  addText("9", "Bank Settings");
  addText("10", "Equip Item - Use Current Equipment Set as Default");
  addText("11", "Use default Bank Border style");
  addText("12", "Set Default Bank Sorting");
  addText("13", "Current:");
  addText("14", "Default Sorting");
  addText("15", "Item GP Value (Highest to Lowest)");
  addText("16", "Item GP Value (Lowest to Highest)");
  addText("17", "Stack GP Value (Highest to Lowest)");
  addText("18", "Stack GP Value (Lowest to Highest)");
  addText("19", "Item Stats");
  addText("20", "All");
  addText("21", "All but 1");
  addText("22", "Sell Item");
  addText("23", "Sell Item?");
  addText("24", "Sells for: ${gpValue} GP each");
  addText("25", "Equip Food");
  addText("26", "Heals For: +${hpValue} HP");
  addText("27", "Equip Item");
  addText("28", "Select Equipment Set:");
  addText("29", "Will Replace:");
  addText("30", "Equip ${equipSlot}");
  addText("31", "Claim Token");
  addText("32", "Upgrade Item");
  addText("33", "Read Item");
  addText("34", "View Item Stats");
  addText("35", "Open Item");
  addText("36", "View Chest Contents");
  addText("37", "Special Attack");
  addText("38", "No Item Description");
  addText("39", "Possible Items:");
  addText("40", "Up to ${qty} x ${itemImage} ${itemName}");
  addText("41", "Attempting to open ${itemName} x${qty}");
  addText("42", "Custom Sorting (User Defined)");
  addText(
    "43",
    "This sorting method will automatically save the position of your items. This means you get to decide what order the items are sorted."
  );
  addText("44", "Bank: ${gpIcon} ${gpValue}");
  addText("45", "Tab: ${gpIcon} ${gpValue}");
  addText("46", "Lock all Items in Bank");
  addText("47", "Unlock all Items in Bank");
  addText("48", "Sell all Items in Tab");
  addText("49", "Reset Default Tab on all Items");
  addText("50", "Are you sure you want to unlock all items in your Bank?");
  addText("51", "Are you sure you want to lock all items in your Bank?");
  addText("52", "Lock all Items in Bank?");
  addText("53", "Unlock all Items in Bank?");
  addText("54", "Bank Options");
  addText(
    "55",
    `Sell all <span class="text-success">unlocked</span> items in Tab`
  );
  addText("56", `<span class="text-success">Unlock</span> all items in Tab`);
  addText("57", `<span class="text-danger">Lock</span> all items in Tab`);
  addText("58", "Set Item as Bank Tab Icon");
  addText("59", "Space: ${bankSpace}");
  addText("60", "Toggle item visibility on the Minibar for Non-Combat Skills.");
  addText("FIND_A_FRIEND", "Find a Friend");
  addText(
    "FOUND_A_FRIEND",
    "You found a friend! A Friendship Bracelet has been added to your bank."
  );
  addText("YAY_FRIEND", "Yay friend");
  addText("USE_ITEM", "Use Item");
  addText("1H", "1H");
  addText("2H", "2H");
}
function langGenerateEquipSlotNameText() {
  const addText = (identifier, text) =>
    applyEnglishKey("EQUIP_SLOT", identifier, text);
  Object.entries(equipmentSlotData).forEach(([slot, slotData], id) => {
    addText(`${id}`, slotData.emptyName);
  });
}
function langGenerateMiscCombatText() {
  const addText = (identifier, text) =>
    applyEnglishKey("COMBAT_MISC", identifier, text);
  addText("0", "Browse Combat Areas");
  addText("1", "Standard Combat Training");
  addText("2", "Variety of Monsters and Drops");
  addText("3", "Browse Slayer Areas");
  addText("4", "Great for Slayer Training");
  addText("5", "Unique Monsters and Drops");
  addText("6", "Browse Dungeons");
  addText("7", "Fight various Monsters and Bosses");
  addText("8", "High value rewards found here");
  addText("9", "Attack Interval:");
  addText("10", "Your Attack resets when eating manually");
  addText("11", "Min Hit (Normal Attack)");
  addText("12", "Max Hit (Normal Attack)");
  addText("13", "Chance to Hit");
  addText("14", "Accuracy Rating");
  addText("15", "Evasion");
  addText("16", "Prayer Points");
  addText("17", "Active Prayers");
  addText("18", "Equipment");
  addText("19", "View Equipment Stats");
  addText("20", "Change Equipment Set");
  addText("21", "Slayer Task");
  addText("22", "New Task");
  addText("23", "Easy");
  addText("24", "Normal");
  addText("25", "Hard");
  addText("26", "Elite");
  addText("27", "Master");
  addText("28", "Jump to Enemy");
  addText("29", "Extend Task for ${coinImage} ${value}");
  addText("30", "Automatically fight new Slayer Task?");
  addText("31", "Attack Style");
  addText("39", "No Monster Selected");
  addText("40", "Run / Area Select");
  addText("41", "View Monster Drops");
  addText("42", "Offensive Stats");
  addText("43", "Damage Reduction");
  addText("44", "Loot to Collect");
  addText(
    "45",
    "Equip the ${itemName} from the ${dungeonName} to enable auto-looting."
  );
  addText("46", "Loot All");
  addText("47", "Insane");
  addText("48", "Entry Requirements:");
  addText("49", "Monsters:");
  addText("50", "Highest Combat Level Monster:");
  addText("51", "Reward:");
  addText("52", "Start Dungeon");
  addText("53", "Fight");
  addText("54", "Toggle Skill progress");
  addText("55", "Offline Combat is not enabled on this Character");
  addText(
    "56",
    "Please enable if you wish to use this feature - or dismiss this message and enable it via Settings later."
  );
  addText("57", "Enable");
  addText("58", "Dismiss Message");
  addText("59", "Warning");
  addText("60", "Offline Combat can be dangerous if not careful.");
  addText(
    "61",
    "This is disabled by default. To enable it, please agree to all the below important points:"
  );
  addText(
    "62",
    "I understand that it is possible to die while Offline, and that it is possible to lose equipped items in the process."
  );
  addText(
    "63",
    "I understand that it is my responsibility to ensure I am prepared for all Combat scenarios that could occur while Offline."
  );
  addText(
    "64",
    "I understand that the game will not notify me if I die while Offline until I actually load into my Character."
  );
  addText(
    "65",
    "I understand that dying Offline with a Hardcore Character will result in the loss of my Hardcore Character."
  );
  addText(
    "66",
    "I understand that I can enable or disable Offline Combat from the Settings Page."
  );
  addText("67", "Enable Offline Combat");
  addText("68", "Offline Combat Warning");
  addText("70", "Spellbook");
  addText("71", "Magic Weapon Required");
  addText("72", "Use Combination Runes?");
  addText("73", "Did you know?");
  addText(
    "74",
    "You can also train Magic using non-combat spells. Check the Alt. Magic Skills menu"
  );
  addText("75", "Click to Activate");
  addText("76", "Runes");
  addText("77", "Stats");
  addText("78", "Max Hit (Summon):");
  addText("79", "Prayer Level:");
  addText("80", "Locating...");
  addText("81", "Slayer Task already extended");
  addText("82", "Dungeon Paused");
  addText("83", "Use this time to prepare");
  addText("84", "Start the Fight");
  addText("85", "Skip wave for ${coinImage} ${qty}");
  addText("86", "Skip");
  addText("87", "You have ${coinImage} ${qty}");
  addText("88", "No Combat Area selected");
  addText("89", "Special Attack Description");
  addText("90", "Passive Description");
  addText("91", "Defensive Stats");
  addText("92", "Combat Options");
  addText("93", "Combat Level ${level}");
  addText("94", "Toggle Skill Progress");
  addText("95", "Very Easy");
  addText("96", "Medium");
  addText("98", "Very Hard");
  addText("100", "Insane");
  addText("101", "Attack Type:");
  addText("104", "Drops");
  addText("105", "Food");
  addText("106", "Menu");
  addText("107", "This Monster does not drop Bones.");
  addText("108", "Highest Combat Level Monster: ${combatLevel}");
  addText("109", "Clear the Mist");
  addText("110", "Equipped");
  addText("111", "Defeat ??? to unlock");
  addText("112", "Defeat ${dungeonName} ${qty} times to unlock");
  addText("113", "View all Equipment Stats");
  addText("114", "Equipment Sets");
  addText("115", "(Left-click to unequip)");
  addText("116", "Empty");
  addText("117", "No Synergy Active");
  addText("118", "Synergy Locked");
  addText("119", "Unlock this Synergy from the Summoning Page.");
  addText("120", "Synergy Active");
  addText("121", "Automatically swap food when it runs out?");
  addText("122", "Unequip");
  addText("123", "You cannot equip or unequip from this screen");
  addText("MENU_0", "View Equipment");
  addText("MENU_1", "View Spellbook");
  addText("MENU_2", "View My Runes");
  addText("MENU_3", "View Prayer");
  addText("MENU_4", "View Summoning Synergy Search");
  addText("MENU_5", "View Slayer Task");
  addText("MENU_6", "View Combat Stats");
  addText("RAN_AWAY", "You Ran Away!");
  addText("YOU_DIED", "You Died!");
  addText("YOU_DIED_DESC", "Luck was on your side today. You lost nothing.");
  addText("YOU_LOST_YOUR", "It looks like you lost your:");
  addText("USING_ATTACK", "Using ${attackName}:");
  addText("STUNNED", "Stunned:");
  addText("SLEEPING", "Sleeping:");
  addText("MISS", "Miss!");
  addText("IMMUNE", "Immune!");
  addText("DUNGEON_CLEARED", "${dungeonName} Cleared");
  addText(
    "DUNGEON_CLEARED_TIMES",
    "${dungeonName} to be cleared ${count} times"
  );
  addText("SHOP_ITEM_PURCHASED", "${purchaseName} Purchased");
  addText("NO_AREA_EFFECT", "No Area Effect");
  addText("NAME", "Name");
  addText("TYPE", "Type");
  addText("OPTIONS", "Options");
  addText("ONLY_ON_PREMIUM", "Only Available on the Full Version");
  addText("HERE", "Here!");
  addText("FLOOR_COUNT", "- Floor (${currentFloor} / ${totalFloors})");
  addText("DUNGEON_COMPLETE", "Dungeon Complete!");
  addText(
    "DUNGEON_COMPLETE_TEXT",
    "Well Done! You beat the dungeon. A reward has been added to your bank."
  );
  addText("BANE_FLED", "Bane has fled!");
  addText("IN_WAKE_FOUND", "In his wake you have found:");
  addText("BANE_DEFEATED", "You have defeated Bane!");
  addText("AFFLICTED_NAME", "Afflicted ${monsterName}");
  addText("TOGGLE_DROPDOWN", "Toggle Dropdown");
  addText("STANDARD_SPELLBOOK_NAME", "Standard Magic");
  addText(
    "STANDARD_SPELLBOOK_DESC",
    "Standard Damage Spells that go great with Curses & Auroras."
  );
  addText("CURSE_SPELLBOOK_NAME", "Curses");
  addText(
    "CURSE_SPELLBOOK_DESC",
    "100% chance to activate and last for 3 Attack Turns."
  );
  addText("AURORA_SPELLBOOK_NAME", "Auroras");
  addText("AURORA_SPELLBOOK_DESC", "Active buffs that use Runes per Attack.");
  addText("ANCIENT_SPELLBOOK_NAME", "Ancient Magicks");
  addText(
    "ANCIENT_SPELLBOOK_DESC",
    "Specialised Magic Spells. Cannot be used alongside Curses or Damage Modifying Auroras."
  );
  addText("SPELL_DAMAGE", "Spell Damage: ${damage}");
  addText(
    "REQUIRES_ITEM_TO_BE_EQUIPPED",
    "Requires ${itemName} to be equipped"
  );
  addText("PRATS_IDEA", "(This was Prat's idea)");
  addText(
    "ANCIENT_EXTRA_INFO",
    "Ancient Magicks are not affected by any Damage Modifiers, except for the Combat Triangle. Special Attacks do not work with Ancient Magicks."
  );
  addText("AUTO_EAT", "Auto Eat");
  addText("AUTO_EAT_THRESHOLD", "Eat when at or below ${amount} HP");
  addText("FOOD_EFFICIENCY", "Food Efficiency:");
  addText(
    "AUTO_EAT_DESCRIPTION",
    "Using your currently equipped food only, automatically consume the food to fill your HP to at least <span class='text-warning'>${limitPercent}%</span> when it is equal to or below <span class='text-warning'>${threshHoldPercent}%</span> HP"
  );
  addText("WORKS_COMBAT_THIEVING", "Works with Combat & Thieving.");
  addText("NO_CHANGE", "No Change");
  addText("DAMAGE_REDUCTION_MULT", "Damage Reduction Multiplier:");
  addText("DAMAGE_DEALT_MULT", "Damage Dealt Multiplier:");
  addText("COST_FREE", "Free");
  addText("EQUIPPED_ITEMS", "Equipped Items");
  addText("GIVES_THE_ENEMY", "Gives the Enemy:");
  addText("LASTS_ENEMY_TURNS", "Lasts ${count} Enemy Turns");
  addText(
    "DOT_HEALING_DESC",
    "Healing ${amount} hitpoints every ${interval}s."
  );
  addText("DOT_DAMAGE_DESC", "Taking ${amount} damage every ${interval}s.");
  addText("ONE_PROC_LEFT", "1 proc left. (${interval}s)");
  addText("PROCS_LEFT", "${count} procs left. (${interval}s)");
  addText("ONE_ENEMY_TURN_LEFT", "1 enemy turn left.");
  addText("ENEMY_TURNS_LEFT", "${count} enemy turns left.");
  addText("YOUR_TURNS_LEFT", "${count} of your turns left.");
  addText("ONE_TURN_LEFT", "1 turn left.");
  addText("TURNS_LEFT", "${count} turns left.");
  addText("LASTS_UNTIL_END", "Lasts until the end of the fight.");
  addText(
    "LASTS_UNTIL_END_ONE_STACK",
    "1 stack. Lasts until the end of the fight."
  );
  addText(
    "LASTS_UNTIL_END_STACKS",
    "${count} stacks. Lasts until the end of the fight."
  );
  addText("AFFLICTION", "Affliction");
  addText("FROSTBURN", "Frostburn");
  addText("SLOWED", "Slowed");
  addText("CANNOT_ATTACK_OR_EVADE", "Cannot attack or evade attacks.");
  addText("INCREASED_DAMAGE_TAKEN", "+${value}% increased damage taken.");
  addText("STUNNED", "Stunned");
  addText("FROZEN", "Frozen");
  addText("LASTS_UNTIL_END_OF_ATTACK", "Lasts until the end of this attack.");
  addText("LASTS_FOR_1_MORE_TURN", "Lasts for 1 more turn.");
  addText("LASTS_FOR_TURNS", "Lasts for ${count} more turns.");
  addText("ONE_STACK_WITH_MAX", "1 stack (Max: ${max}).");
  addText("STACKS_WITH_MAX", "${count} stacks (Max: ${max}).");
  addText("ONE_STACK", "1 stack.");
  addText("STACKS", "${count} stacks.");
  addText("STACKS_REMOVED_PER_TURN", "1 stack removed every turn.");
  addText(
    "STACK_GAINED_WHEN_HIT",
    "1 stack gained each time hit by an attack."
  );
  addText("STACKS_REMOVED_ON_MISS", "Stacks removed on a missed attack.");
  addText("melee_vs_melee", "Melee vs. Melee");
  addText("melee_vs_ranged", "Melee vs. Ranged");
  addText("melee_vs_magic", "Melee vs. Magic");
  addText("magic_vs_melee", "Magic vs. Melee");
  addText("magic_vs_ranged", "Magic vs. Ranged");
  addText("magic_vs_magic", "Magic vs. Magic");
  addText("ranged_vs_melee", "Ranged vs. Melee");
  addText("ranged_vs_ranged", "Ranged vs. Ranged");
  addText("ranged_vs_magic", "Ranged vs. Magic");
  addText("GAINED_FROM_BURYING", "(Gained by burying Bones)");
  addText("MELEE", "Melee");
  addText(
    "SUMMON_BAR_TT",
    "Attack Interval Bar for active Combat Summons (3s)."
  );
  addText("SPEND_MASTERY_XP_FOR", "${xp} XP for +${num} Levels");
  addText("YOU_FOUND", "You found:");
  addText("YOU_OPENED", "You opened:");
  addText("SELECT_SHOP_CATEGORY", "Select Shop Category");
  addText("LAST_CLOUD_SAVE", "Last Cloud Save");
  addText("BURY_ITEM", "Bury Item");
  addText("GRANTS_PRAYER_POINTS", "Grants ${num} Prayer Points each");
  addText("PRAYER_POINTS", "${num} Prayer Points");
  addText("HOLD_TO_EAT", "Hold down the Eat button to keep eating.");
}
function langGenerateMiscShopText() {
  const addText = (identifier, text) =>
    applyEnglishKey("SHOP_MISC", identifier, text);
  addText("0", "Show All");
  addText("1", "You Have");
  addText("2", "General Upgrades");
  addText("3", "Skill Upgrades");
  addText("4", "Gloves");
  addText("5", "Skillcapes");
  addText("6", "Materials & Items");
  addText("7", "Buy ${shopName}?");
  addText("8", "Buy");
  addText("9", "Custom Amount:");
  addText("10", "Buy ${qty} x ${shopName}?");
}
function langGenerateFarmingMiscText() {
  const addText = (identifier, text) =>
    applyEnglishKey("FARMING_MISC", identifier, text);
  addText("0", "Allotments");
  addText("2", "Great source of Food.");
  addText("4", "Herbs");
  addText("5", "Base ingredient for Potions.");
  addText("6", "Trees");
  addText("7", "Great source of XP");
  addText("8", "Harvest All: ${gpCost}");
  addText("9", "Apply ${itemName} to all Plots: ${gpCost}");
  addText("10", "Plant All: ${gpCost}");
  addText("11", "${itemName} Level");
  addText("12", "Harvest");
  addText("16", "Seeds in Bank:");
  addText("17", "You have ${qty} ${farmItem} in your Bank.");
  addText("18", "Seed Type:");
  addText("19", "Level Required:");
  addText("20", "Seeds Required:");
  addText("21", "Grow time:");
  addText("22", "Plant");
  addText("23", "Information");
  addText("24", "Close");
  addText("25", "Growing: ${seedName}");
  addText("26", "Time Left: About ${timeLeft}");
  addText("27", "Destroy");
  addText("28", "Plant All Selected Crops: ${gpValue}");
  addText("CLEAR_DEAD_CROP", "Clear Dead Crop");
  addText("CROP_DIED", "Your crop died :(");
  addText(
    "APPLY_ITEM_ALL",
    "Apply ${itemName} to all Plots ${gpIcon} ${gpCost}"
  );
  addText("NEED_ITEM_TO_APPLY", "You need ${itemName} to add ${itemName}!");
  addText(
    "NO_GP_APPLY_ITEM",
    "You do not have enough GP to apply ${itemName} to all Plots."
  );
}
function langGenerateCharacterSelectText() {
  const addText = (identifier, text) =>
    applyEnglishKey("CHARACTER_SELECT", identifier, text);
  addText("1", "Create a new Character");
  addText("2", "Also Available On:");
  addText("3", "Your save is compatible on all versions of the game.");
  addText("4", "Not connected to Melvor Cloud.");
  addText("5", "Sign in the Melvor Cloud");
  addText("6", "Sign In");
  addText("7", "Manage");
  addText("8", "Logout");
  addText("9", "Privacy Policy");
  addText("10", "Restore Purchases");
  addText("11", "A game by Malcs");
  addText("12", "Lastly, what shall we call you?");
  addText("13", "Begin your Journey");
  addText("14", "Sign In");
  addText("15", "Welcome, please login or sign up for a new account.");
  addText("16", "Username");
  addText("17", "Password");
  addText("18", "Forgot Password?");
  addText("19", "Create Account");
  addText("20", "Already have an account? Sign in.");
  addText("21", "Email");
  addText("22", "Confirm Password");
  addText("23", "Sign up");
  addText(
    "24",
    "Don't stress, you can recover it below. Let's hope you signed up with an email address."
  );
  addText("25", "Actually, I remember it now.");
  addText("26", "Your email goes here...");
  addText("27", "Submit");
  addText("28", "Back to Character Selection");
  addText("29", "Not currently training");
  addText("30", "Last Save:");
  addText("31", "Local Save");
  addText("32", "Cloud Save");
  addText("33", "Show Cloud Saves");
  addText("34", "Show Local Saves");
  addText("35", "Settings");
  addText("36", "Download Save");
  addText("37", "Export Save");
  addText("38", "Import Save");
  addText("39", "Delete Save");
  addText("40", "Your save is in the box below.");
  addText("41", "Be sure to copy all of it, otherwise it will not work.");
  addText("42", "OK");
  addText("43", "Paste your save link or raw save into the box below");
  addText("44", "Import");
  addText("45", "Cancel");
  addText(
    "46",
    "Are you sure you want to delete this save? This cannot be undone!"
  );
  addText("47", "Delete");
  addText("48", "Select your Character");
  addText("49", "Don't forget to backup your saves locally!");
  addText("50", "Go Back");
  addText("51", "Select Language");
  addText("52", "Checking connection to the Cloud...");
  addText("53", "Authenticating with PlayFab...");
  addText("54", "Connection established. Fetching Cloud Saves...");
  addText("56", "Cloud connection successful.");
  addText(
    "57",
    "There was an issue logging into the PlayFab service. Please try again."
  );
  addText("58", "Incorrect username or password.");
  addText("59", "Firstly, what Gamemode?");
  addText("60", "Change Password");
  addText("61", "Current Password");
  addText("62", "New Password");
  addText("63", "Update");
  addText("64", "Hi, ${username}");
  addText("65", "Most recent save");
  addText("66", "Old save");
  addText("67", "Load Local Save");
  addText("68", "Load Cloud Save");
  addText("69", "This will overwrite your cloud save. Are you sure?");
  addText("70", "This will overwrite your local save. Are you sure?");
  addText("71", "${level} Total Level");
  addText(
    "72",
    "Save deleted successfully. Let's hope you were supposed to do that."
  );
  addText("73", "All done!");
  addText(
    "74",
    "Melvor Idle has been updated! Check the changelog for more info."
  );
  addText("75", "Insubordinate");
  addText("76", "Logged in as:");
  addText("77", "Loading...");
  addText("78", "Online");
  addText("79", "Account");
  addText("80", "Auto Save to Cloud");
  addText("81", "Connect to Patreon");
  addText(
    "82",
    "Connect your Patreon Account to Melvor for exclusive benefits."
  );
  addText("83", "Melvor Cloud Settings");
  addText("84", "Connected");
  addText("85", "Disconnect");
  addText("86", "Login");
  addText("87", "Register");
  addText("88", "Offline");
  addText("89", "Status:");
  addText("90", "Not Connected");
  addText("91", "Save link or raw save goes here...");
  addText("92", "Save imported successfully.");
  addText("93", "Oops!");
  addText(
    "94",
    "Something went wrong trying to import the save. Please double check everything was pasted correctly, and that the save is compatible with this version of the game."
  );
  addText("95", "Save downloaded successfully.");
  addText("96", "Something went wrong trying to download the save...");
  addText("97", "You have some unsaved changes");
  addText("98", "Logging out of the Cloud...");
  addText("99", "Chaos Mode Discontinued");
  addText("100", "Save cannot be loaded. Support for this gamemode has ended.");
  addText("101", "Premium Gamemode");
  addText("102", "PlayFab connection status");
  addText("103", "Melvor Cloud connection status");
  addText("DISCONTINUED", "(Discontinued)");
  addText("GAMEMODE_ENDS_IN", "Gamemode ends in ${timePeriod}");
  addText("TIME_LIMITED_MODE", "Time-limited Event Mode");
}
function langGenerateMiscText() {
  const addText = (identifier, text) =>
    applyEnglishKey("MISC_STRING", identifier, text);
  addText("0", "Passive:");
  addText("1", "Created by Patreon");
  addText("2", "You managed to preserve your resources");
  addText("3", "Welcome Back!");
  addText("4", "You were gone for roughly ${timeAway}");
  addText("5", "While you were gone:");
  addText("6", "You gained ${qty} ${skillName} XP");
  addText("7", "Always Drops:");
  addText("8", "Possible Extra Drops:");
  addText("9", "In order of most common to least common");
  addText("10", "Information about your cutting actions will display here.");
  addText("11", "Change Language");
  addText(
    "12",
    "Synergies are unlocked by levelling up a Familiar's Marks! They start to unlock at Mark Level 2."
  );
  addText("13", "Search terms include Familiar Name or Synergy Description.");
  addText("14", `NOTE: You can click an unlocked Synergy to "Quick Equip" it.`);
  addText("15", "Show Unlocked");
  addText("16", "Filter Familiars");
  addText("17", "Search Summoning Synergies");
  addText("18", "Melvor Cloud");
  addText("19", "Actions");
  addText("20", "Change Character Name");
  addText("21", "Select Character");
  addText("22", "Select Potion");
  addText(
    "23",
    "Only one Potion for each Non-Combat Skill can be active at any given time. Only one Combat Potion can be active at any given time."
  );
  addText(
    "24",
    "Your active potion will always show, regardless of your filtered setting."
  );
  addText("25", "Show Potion Tiers:");
  addText("26", "Settings:");
  addText("27", "Auto Re-use Potions for this Skill?");
  addText("28", "${num} Charges");
  addText("29", "Select");
  addText("30", "Stop");
  addText("MINIBAR_0", "(Click to Equip if Owned)");
  addText("MINIBAR_1", "(Must be in your Bank)");
  addText("MINIBAR_2", "View Milestones for this Skill");
  addText("MINIBAR_3", "View Item Mastery Unlocks");
  addText(
    "COOKING_0",
    "You need to be actively cooking something to start a Passive Cook."
  );
  addText("COOKING_1", "You failed to Cook the product.");
  addText("COOKING_2", "You don't have the required items to cook that.");
  addText(
    "COOKING_3",
    "Clear your Stockpile before passively cooking this item."
  );
  addText("TUTORIAL_0", "Maximum Skill Level of 3 reached in Tutorial Island.");
  addText(
    "TUTORIAL_1",
    "Maximum Skill Level of 10 reached in Tutorial Island."
  );
  addText("SAVE", "Save");
  addText("FORCE_SAVE", "Force Save");
  addText("READY_TO_CLAIM", "Ready to Claim");
  addText("CLAIM", "Claim");
  addText("TASK", "Task");
  addText("BRONZE_AXE", "Bronze Axe");
  addText("BRONZE_FISHING_ROD", "Bronze Fishing Rod");
  addText("BRONZE_PICKAXE", "Bronze Pickaxe");
  addText("CLAIMED", "Claimed");
  addText("NOT_OWNED", "Not Owned");
  addText("MESSAGE_IN_BOTTLE_TITLE", "A Forgotten Past");
  addText(
    "MESSAGE_IN_BOTTLE_TEXT",
    '"Jealousy? Is this the power of jealousy? The waves are too unnatural and dangerous here to be real, I fear I will not survive the night."'
  );
  addText("MESSAGE_IN_BOTTLE_UNLOCK", "Secret Fishing Area Unlocked");
  addText(
    "MERCHANTS_PERMIT_TEXT_0",
    '"By the grace of the King of Melvor, the bearer of this writ is hereby granted exemption from the royal glove tax."'
  );
  addText("MERCHANTS_PERMIT_TEXT_1", "- Signed: The Lemvor Port Authority");
  addText("MERCHANTS_PERMIT_UNLOCK", "Permanent: -10% Cost to Skilling Gloves");
}
function langGenerateGamemodeText() {
  const addText = (identifier, text) =>
    applyEnglishKey("GAMEMODES", identifier, text);
  addText("GAMEMODE_MISC_0", "This is a safe Gamemode.");
  addText("GAMEMODE_MISC_1", "THIS MODE IS PERMADEATH.");
}
function langGenerateThievingText() {
  const addText = (identifier, text) =>
    applyEnglishKey("THIEVING", identifier, text);
  addText("POSSIBLE_COMMON", "Possible Common Drops:");
  addText("MOST_TO_LEAST_COMMON", "In order of most to least common");
  addText("NO_COMMON_DROPS", "This NPC doesn&apos;t have any Common Drops");
  addText("POSSIBLE_RARE", "`Possible Rare Drops:");
  addText("POSSIBLE_AREA_UNIQUE", "Possible Area Unique Drops:");
  addText("POSSIBLE_NPC_UNIQUE", "Possible NPC Unique Drop:");
  addText("UNDISCOVERED_ITEM", "Undiscovered Item");
}
function langGenerateEndgameText() {
  const addText = (identifier, text) =>
    applyEnglishKey("BANE_EVENT", identifier, text);
  addText("0", "Impending Darkness Event");
  addText("2", "Requires Level 99 in all Skills");
  addText("3", "Select an Enemy Passive");
  addText("4", "Event Enemy Passive");
  addText("5", "Start the Event");
  addText("BTN_0", "Start Event");
  addText("BTN_1", "Stop Event");
  addText("BTN_2", "Show Event Passives");
  addText(
    "START_TEXT_0",
    "WARNING: You are about to begin the event for the Final Boss."
  );
  addText(
    "START_TEXT_1",
    "This event will lock all Combat content until it is either finished, you die, or ended by you."
  );
  addText(
    "START_TEXT_2",
    "Dying during this event will not result in account deletion."
  );
  addText(
    "START_TEXT_3",
    "The event will take roughly 2 hours to complete, depending on your gear setup, and you only need to complete it once to receive all possible rewards."
  );
  addText(
    "START_TEXT_4",
    "Dying or manually stopping via the button will result in the event ending."
  );
  addText(
    "START_TEXT_5",
    "You are able to train all Non-combat Skills, and close the game during the event. It will remember your progress upon returning."
  );
  addText(
    "START_TEXT_6",
    "Remember, you cannot train any Combat normally while the event is active."
  );
  addText(
    "START_TEXT_7",
    "Defeat all Monsters in the respective Slayer Areas, and fight your way through 5 cycles of chaos, mayhem and death."
  );
  addText("START_TEXT_8", "Are you ready?");
  addText(
    "STOP_WARNING",
    "WARNING: Stopping the event will make you lose all current progress in it."
  );
  addText("ARE_YOU_SURE", "Are you sure you want to do this?");
}
function langGeneratePrayer() {
  const addText = (identifier, text) =>
    applyEnglishKey("PRAYER", identifier, text);
  addText("PRAYER_MISC_0", "Prayer Point Cost:");
  addText(
    "PRAYER_MISC_1",
    "${points} per <small class='text-danger'>Enemy Attack</small>"
  );
  addText(
    "PRAYER_MISC_2",
    "${points} per <small class='text-success'>Player Attack</small>"
  );
  addText(
    "PRAYER_MISC_3",
    "${points} per <small class='text-info'>HP regen.</small>"
  );
  addText("PROVIDES_NO_XP", "Provides no Prayer XP");
  addText("PROVIDES_XP", "Provides Prayer XP based on damage dealt to enemy");
}
function langGenerateSpecialAttackDescriptions() {
  const diffLog = [];
  const describedEnemyAttacks = new Set();
  game.monsters.forEach((monster) => {
    monster.specialAttacks.forEach(({ attack }) => {
      if (!describedEnemyAttacks.has(attack)) {
        const generatedDesc = generateAttackDescription(
          attack,
          enemyNoun,
          youNoun
        );
        let description = loadedLangJson.SPECIAL_ATTACK[attack.localID];
        if (description !== undefined) {
          if (generatedDesc !== description)
            diffLog.push([
              attack.name + " for Enemy",
              description,
              generatedDesc,
            ]);
        } else {
          description = generatedDesc;
        }
        applyEnglishKey("SPECIAL_ATTACK", attack.localID, description);
        applyEnglishKey("SPECIAL_ATTACK_NAME", attack.localID, attack.name);
        describedEnemyAttacks.add(attack);
      }
    });
  });
  const describedPlayerAttacks = new Set();
  const addPlayerAttack = (attack) => {
    if (!describedPlayerAttacks.has(attack)) {
      const generatedDesc = generateAttackDescription(
        attack,
        youNoun,
        enemyNoun
      );
      let description = loadedLangJson.SPECIAL_ATTACK[attack.localID];
      if (description !== undefined) {
        if (generatedDesc !== description)
          diffLog.push([
            attack.name + " for Player",
            description,
            generatedDesc,
          ]);
      } else {
        description = generatedDesc;
      }
      applyEnglishKey("SPECIAL_ATTACK", attack.localID, description);
      applyEnglishKey("SPECIAL_ATTACK_NAME", attack.localID, attack.name);
      describedPlayerAttacks.add(attack);
    }
  };
  game.items.forEach((item) => {
    if (item instanceof EquipmentItem && item.specialAttacks.length > 0) {
      item.specialAttacks.forEach(addPlayerAttack);
    }
  });
  game.ancientSpells.forEach((ancient) => {
    addPlayerAttack(ancient.specialAttack);
  });
  game.standardSpells.forEach((spell) => {
    if (spell.specialAttack !== undefined) addPlayerAttack(spell.specialAttack);
  });
  game.archaicSpells.forEach((spell) => {
    addPlayerAttack(spell.specialAttack);
  });
  describedEnemyAttacks.forEach((attack) => {
    if (describedPlayerAttacks.has(attack))
      console.warn(`${attack.name} has a player and enemy description.`);
  });
  let generatedDescs = "";
  let existingDescs = "";
  diffLog.forEach(([name, existing, generated]) => {
    generatedDescs += `=== ${name} ===\n`;
    generatedDescs += `${formatStringForCSV(generated)}\n`;
    existingDescs += `=== ${name} ===\n`;
    existingDescs += `${formatStringForCSV(existing)}\n`;
  });
  downloadTextFile("generatedAttacks.txt", generatedDescs, "text/plain");
  downloadTextFile("existingAttacks.txt", existingDescs, "text/plain");
  downloadTextFile(
    "attackDiffs.csv",
    buildCSVFile(["Attack Name", "Current", "Generated"], diffLog),
    "data:text/csv"
  );
}
function langGenerateSkillNames() {
  const addText = (identifier, text) =>
    applyEnglishKey("SKILL_NAME", identifier, text);
  addText("Woodcutting", "Woodcutting");
  addText("Fishing", "Fishing");
  addText("Firemaking", "Firemaking");
  addText("Cooking", "Cooking");
  addText("Mining", "Mining");
  addText("Smithing", "Smithing");
  addText("Attack", "Attack");
  addText("Strength", "Strength");
  addText("Defence", "Defence");
  addText("Hitpoints", "Hitpoints");
  addText("Thieving", "Thieving");
  addText("Farming", "Farming");
  addText("Ranged", "Ranged");
  addText("Fletching", "Fletching");
  addText("Crafting", "Crafting");
  addText("Runecrafting", "Runecrafting");
  addText("Magic", "Magic");
  addText("Prayer", "Prayer");
  addText("Slayer", "Slayer");
  addText("Herblore", "Herblore");
  addText("Agility", "Agility");
  addText("Summoning", "Summoning");
  addText("Astrology", "Astrology");
}
function langGeneratePetText() {
  const addText = (identifier, text) =>
    applyEnglishKey("PET_MISC", identifier, text);
  addText("0", "Acquired By:");
  addText("1", "Boss Pet:");
  addText("2", "Named after Winner of 2020 Fan Art Competition");
  addText("3", "Christmas Event 2020 Pet");
  addText("4", "Named after Coolrox95");
  addText("5", "+15 Harvest Quantity");
  addText("6", "Christmas Event 2020");
  addText("7", "All enemies have: -1% Damage Reduction");
  addText("8", "+0.1% chance to find Golden Stardust");
}
function langGenerateLore() {
  for (let i = 0; i < LORE.length; i++) {
    let j = 0;
    while (j < 40) {
      if (loadedLangJson["LORE"][`PARAGRAPH_${i}_${j}`] === undefined) break;
      else
        applyEnglishKey(
          "LORE",
          `PARAGRAPH_${i}_${j}`,
          getLangString("LORE", `PARAGRAPH_${i}_${j}`)
        );
      j++;
    }
  }
  applyEnglishKey("LORE", `LEARN_ABOUT`, "Learn about the Gods.");
  applyEnglishKey("LORE", `BY_DEFEATING`, "By defeating Into the Mist:");
  applyEnglishKey(
    "LORE",
    `YOU_UNLOCKED`,
    "You unlocked the new Combat Passive Slot Access granted to Dark Waters Slayer Area"
  );
}
function langGeneratePrivacyPolicy() {
  applyEnglishKey("PRIVACY_POLICY", 0, PRIVACYPOLICY);
}
function langGenerateShopText() {
  const addText = (identifier, text) =>
    applyEnglishKey("SHOP_CAT", identifier, text);
  addText("0", "General Upgrades");
  addText("1", "Skill Upgrades");
  addText("2", "Slayer");
  addText("3", "Gloves");
  addText("4", "Skillcapes");
  addText("5", "Materials & Items");
  addText("MISC", "Show All");
}
function langGenerateModifierData() {
  Object.entries(modifierData).forEach(([key, data]) => {
    applyEnglishKey("MODIFIER_DATA", key, data.description);
  });
}
function langGenerateNumberShorthand() {
  const addText = (identifier, text) =>
    applyEnglishKey("NUM", identifier, text);
  addText("K", "K");
  addText("M", "M");
  addText("B", "B");
}
function langGenerateEquipStatText() {
  const addText = (identifier, text) =>
    applyEnglishKey("EQUIPMENT_STAT", identifier, text);
  addText("attackSpeed", "${statValue}s Attack Interval");
  addText("stabAttackBonus", "${statValue} Melee Stab Bonus");
  addText("slashAttackBonus", "${statValue} Melee Slash Bonus");
  addText("blockAttackBonus", "${statValue} Melee Block bonus");
  addText("rangedAttackBonus", "${statValue} Ranged Attack Bonus");
  addText("magicAttackBonus", "${statValue} Magic Attack Bonus");
  addText("meleeStrengthBonus", "${statValue} Melee Strength Bonus");
  addText("rangedStrengthBonus", "${statValue} Ranged Strength Bonus");
  addText("magicDamageBonus", "${statValue}% Magic Damage Bonus");
  addText("meleeDefenceBonus", "${statValue} Melee Defence Bonus");
  addText("rangedDefenceBonus", "${statValue} Ranged Defence Bonus");
  addText("magicDefenceBonus", "${statValue} Magic Defence Bonus");
  addText("damageReduction", "${statValue}% Damage Reduction");
  addText("summoningMaxhit", "${statValue} Summoning Max Hit");
  addText("ATTACK_INTERVAL", "Attack Interval:");
  addText("STAB_BONUS", "Stab Bonus:");
  addText("SLASH_BONUS", "Slash Bonus:");
  addText("BLOCK_BONUS", "Block bonus:");
  addText("ATTACK_BONUS", "Attack Bonus:");
  addText("STRENGTH_BONUS", "Strength Bonus:");
  addText("DAMAGE_BONUS", "Damage Bonus:");
  addText("DEFENCE_BONUS", "Defence Bonus:");
}
function langGenerateTimeUnits() {
  const addText = (identifier, text) =>
    applyEnglishKey("TIME_UNIT", identifier, text);
  addText("years", "${years} years");
  addText("year", "1 year");
  addText("days", "${days} days");
  addText("day", "1 day");
  addText("hours", "${hours} hours");
  addText("hour", "1 hour");
  addText("minutes", "${minutes} minutes");
  addText("minute", "1 minute");
  addText("seconds", "${seconds} seconds");
  addText("second", "1 second");
}
function langGenerateEventStrings() {
  const addText = (identifier, text) =>
    applyEnglishKey("EVENTS", identifier, text);
  addText("EVENT_PREFIX", "Event:");
  addText("NAME_0", "Christmas Event 2021");
  addText(
    "DESC_0_0",
    'Help Santa Chio locate the missing ${image} <span class="text-warning">Christmas Presents</span>!'
  );
  addText("DESC_0_1", "Event Progress: ${percent}%");
  addText("DESC_0_2", "Returned: ${num} / ${totalNum}");
  addText("DESC_0_3", "Event Rewards");
  addText("DESC_0_4", "Locked Event Reward");
  addText(
    "DESC_0_5",
    "Return Christmas Presents to Chio to unlock this Event Reward."
  );
  addText("DESC_0_6", "Found: ${num}");
  addText("DESC_0_7", "Return Presents");
  addText("DESC_0_8", "${num} in Bank");
}
function langGenerateTownship() {
  const addText = (identifier, text) =>
    applyEnglishKey("TOWNSHIP", identifier, text);
  addText(`RESOURCE_TYPE_0`, "Currency");
  addText(`RESOURCE_TYPE_1`, "Raw");
  addText(`RESOURCE_TYPE_2`, "Product");
  addText(`SOURCE_0`, "Birth");
  addText(`SOURCE_1`, "Migration");
  addText(`BUILDING_TYPE_0`, "House");
  addText(`BUILDING_TYPE_1`, "Gathering");
  addText(`BUILDING_TYPE_2`, "Production");
  addText(`BUILDING_TYPE_3`, "Storage");
  addText(`BUILDING_TYPE_4`, "Education");
  addText(`BUILDING_TYPE_5`, "Other");
}
function langGenerateTownshipMenu() {
  const addText = (identifier, text) =>
    applyEnglishKey("TOWNSHIP_MENU", identifier, text);
  addText(`POPULATION`, "Population");
  addText(`HAPPINESS`, "Happiness");
  addText(`EDUCATION`, "Education");
  addText(`HEALTH`, "Health");
  addText(`TAX`, "Tax");
  addText(`WORKERS`, "Workers");
  addText(`STORAGE`, "Workers");
  addText(`TOWN`, "Town");
  addText(`BUILD`, "Buid");
  addText(`BUILD_BUILDING`, "Build Building");
  addText(`BIOME_SELECT`, "Select a Biome");
  addText(`BUY_SECTION`, "Buy another section");
  addText(`TOWN_TIME_EXISTED`, "Town has existed for ${localTime}");
  addText(`BREAKDOWN`, "Breakdown:");
  addText(
    `CLICK_WORKER_PRIORITY`,
    "Click to toggle Worker prioritisation for this resource."
  );
  addText(`EDUCATION_DESC`, "Increases resource production by +(Education)%");
  addText(`HAPPINESS_DESC`, "Increases resource production by +(Happiness)%");
  addText(`DEAD_COUNT`, "${qty} have died.");
  addText(`BURIED_COUNT`, "Buried: ${qty1}/${qty2} (${percent}%)");
  addText(
    `HEALTH_DESC_0`,
    "Citizens over the age of ${value1} have a ${percent}% chance to die before reaching ${value2} years old."
  );
  addText(`HEALTH_DESC_1`, "This is defined by:");
  addText(`HEALTH_DESC_2`, "Total Education");
  addText(`HEALTH_DESC_3`, "Total Happiness");
  addText(`HEALTH_DESC_4`, "Total Potions and production per tick");
  addText(`HEALTH_DESC_5`, "Total Clothing and production per tick");
  addText(`HEALTH_DESC_6`, "Total Herbs and production per tick");
  addText(`CONVERT_RESOURCES`, "Convert Resources");
  addText(
    `CONVERT_0`,
    "Convert ${qty1} x ${itemName} to ${qty1} x ${itemName}"
  );
  addText(
    `CONVERT_1`,
    "Convert ${qty1} x ${resourceName} to ${qty1} x ${resourceName}"
  );
  addText(`CITIZENS`, "Citizens");
  addText(`CITIZENS_NAME`, "Name:");
  addText(`CITIZENS_AGE`, "Age:");
  addText(`CITIZENS_SOURCE`, "Source:");
  addText(`CITIZENS_JOB`, "Job:");
  addText(`CITIZENS_TICKS_ALIVE`, "Ticks Alive:");
  addText(`SORT_BUILDING_LIST`, "Sort Building List");
  addText(`VIEW_ALL`, "View All");
  addText(
    `NOTICE_0`,
    "You don't have the population required to build a Tier ${number} building."
  );
  addText(`NOTICE_1`, "You cannot afford to build that.");
  addText(`NOTICE_2`, "Original building in selected biome not found!");
  addText(`NOTICE_3`, "${buildingName1} upgraded to a ${buildingName2}!");
  addText(`NOTICE_4`, "There is no available Biome Space for that.");
  addText(`NOTICE_5`, "${buildingName} has been built!");
  addText(`NOTICE_6`, "Could not find this building in the selected Biome.");
  addText(`NOTICE_7`, "You cannot afford to buy another section!");
  addText(`NOTICE_8`, "Not enough storage available to convert resources.");
  addText(`NOTICE_9`, "Not enough resources in your Bank to convert.");
  addText(`SELECT_WORSHIP`, "Select your preferred Worship:");
  addText(`GENERATE_TOWN`, "Generate your unique Town:");
  addText(`BTN_REROLL_TOWN`, "Reroll Town");
  addText(`BTN_CONFIRM_TOWN`, "Confirm Town");
  addText(`NO_MODIFIERS`, "No modifiers");
  addText(`WORSHIP`, "Worship");
}
function langGenerateFromDataPackage(dataPackage) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u;
  const getLocalID = (fullID) => fullID.split(":")[1];
  const gameData = dataPackage.data;
  if (gameData === undefined) return;
  (_a = gameData.pages) === null || _a === void 0
    ? void 0
    : _a.forEach((pageData) => {
        var _a;
        if (pageData.customName !== undefined)
          applyEnglishKey("PAGE_NAME", pageData.id, pageData.customName);
        (_a = pageData.sidebarSubItems) === null || _a === void 0
          ? void 0
          : _a.forEach((subItem, i) => {
              if (subItem.name !== undefined)
                applyEnglishKey(
                  "PAGE_NAME",
                  `${pageData.id}_SUBCATEGORY_${i}`,
                  subItem.name
                );
            });
      });
  (_b = gameData.tutorialStages) === null || _b === void 0
    ? void 0
    : _b.forEach((stageData) => {
        applyEnglishKey(
          "TUTORIAL",
          `TASK_NAME_${stageData.id}`,
          stageData.name
        );
        applyEnglishKey(
          "TUTORIAL",
          `TASK_DESC_${stageData.id}`,
          stageData.description
        );
        stageData.tasks.forEach((taskData, j) => {
          applyEnglishKey(
            "TUTORIAL",
            `TASK_${stageData.id}_${j}`,
            taskData.description
          );
        });
      });
  (_c = gameData.combatPassives) === null || _c === void 0
    ? void 0
    : _c.forEach((passiveData) => {
        if (passiveData.name !== "")
          applyEnglishKey(
            "PASSIVES",
            `NAME_${passiveData.id}`,
            passiveData.name
          );
        if (passiveData.customDescription !== undefined)
          applyEnglishKey(
            "PASSIVES",
            `DESC_${passiveData.id}`,
            passiveData.customDescription
          );
      });
  (_d = gameData.standardSpells) === null || _d === void 0
    ? void 0
    : _d.forEach((spellData) => {
        applyEnglishKey("MAGIC", `SPELL_NAME_${spellData.id}`, spellData.name);
      });
  (_e = gameData.curseSpells) === null || _e === void 0
    ? void 0
    : _e.forEach((spellData) => {
        applyEnglishKey("MAGIC", `CURSE_NAME_${spellData.id}`, spellData.name);
      });
  (_f = gameData.auroraSpells) === null || _f === void 0
    ? void 0
    : _f.forEach((spellData) => {
        applyEnglishKey("MAGIC", `AURORA_NAME_${spellData.id}`, spellData.name);
      });
  (_g = gameData.ancientSpells) === null || _g === void 0
    ? void 0
    : _g.forEach((spellData) => {
        applyEnglishKey(
          "MAGIC",
          `ANCIENT_NAME_${spellData.id}`,
          spellData.name
        );
      });
  (_h = gameData.combatAreas) === null || _h === void 0
    ? void 0
    : _h.forEach((areaData) => {
        applyEnglishKey("COMBAT_AREA", `NAME_${areaData.id}`, areaData.name);
      });
  (_j = gameData.slayerAreas) === null || _j === void 0
    ? void 0
    : _j.forEach((areaData) => {
        applyEnglishKey("SLAYER_AREA", `NAME_${areaData.id}`, areaData.name);
        if (areaData.areaEffectDescription !== undefined)
          applyEnglishKey(
            "SLAYER_AREA",
            `EFFECT_${areaData.id}`,
            areaData.areaEffectDescription
          );
      });
  (_k = gameData.dungeons) === null || _k === void 0
    ? void 0
    : _k.forEach((dungeonData) => {
        applyEnglishKey("DUNGEON", `NAME_${dungeonData.id}`, dungeonData.name);
      });
  (_l = gameData.gamemodes) === null || _l === void 0
    ? void 0
    : _l.forEach((gamemodeData) => {
        applyEnglishKey(
          "GAMEMODES",
          `GAMEMODE_NAME_${gamemodeData.id}`,
          gamemodeData.name
        );
        if (gamemodeData.description !== undefined)
          applyEnglishKey(
            "GAMEMODES",
            `GAMEMODE_DESC_${gamemodeData.id}`,
            gamemodeData.description
          );
        gamemodeData.rules.forEach((ruleString, i) => {
          applyEnglishKey(
            "GAMEMODES",
            `GAMEMODE_RULES_${gamemodeData.id}_${i}`,
            ruleString
          );
        });
      });
  (_m = gameData.prayers) === null || _m === void 0
    ? void 0
    : _m.forEach((prayerData) => {
        applyEnglishKey(
          "PRAYER",
          `PRAYER_NAME_${prayerData.id}`,
          prayerData.name
        );
      });
  (_o = gameData.attacks) === null || _o === void 0
    ? void 0
    : _o.forEach((attackData) => {
        applyEnglishKey("SPECIAL_ATTACK_NAME", attackData.id, attackData.name);
        applyEnglishKey(
          "SPECIAL_ATTACK",
          attackData.id,
          attackData.description
        );
      });
  (_p = gameData.items) === null || _p === void 0
    ? void 0
    : _p.forEach((itemData) => {
        applyEnglishKey("ITEM_NAME", itemData.id, itemData.name);
        if (itemData.customDescription !== undefined)
          applyEnglishKey(
            "ITEM_DESCRIPTION",
            itemData.id,
            itemData.customDescription
          );
      });
  (_q = gameData.monsters) === null || _q === void 0
    ? void 0
    : _q.forEach((monsterData) => {
        applyEnglishKey("MONSTER_NAME", monsterData.id, monsterData.name);
        if (monsterData.description !== undefined)
          applyEnglishKey(
            "MONSTER_DESCRIPTION",
            monsterData.id,
            monsterData.description
          );
      });
  (_r = gameData.pets) === null || _r === void 0
    ? void 0
    : _r.forEach((petData) => {
        applyEnglishKey("PET_NAME", petData.id, petData.name);
      });
  (_s = gameData.shopPurchases) === null || _s === void 0
    ? void 0
    : _s.forEach((purchaseData) => {
        if (purchaseData.customName !== undefined)
          applyEnglishKey(
            "SHOP_NAME",
            purchaseData.id,
            purchaseData.customName
          );
        if (purchaseData.customDescription !== undefined)
          applyEnglishKey(
            "SHOP_DESCRIPTION",
            purchaseData.id,
            purchaseData.customDescription
          );
      });
  (_t = gameData.lore) === null || _t === void 0
    ? void 0
    : _t.forEach((loreData) => {
        applyEnglishKey("LORE", `TITLE_${loreData.id}`, loreData.title);
      });
  (_u = gameData.skillData) === null || _u === void 0
    ? void 0
    : _u.forEach((skillData) => {
        var _a,
          _b,
          _c,
          _d,
          _e,
          _f,
          _g,
          _h,
          _j,
          _k,
          _l,
          _m,
          _o,
          _p,
          _q,
          _r,
          _s,
          _t,
          _u,
          _v,
          _w,
          _x;
        switch (skillData.skillID) {
          case "melvorD:Woodcutting":
            (_a = skillData.data.trees) === null || _a === void 0
              ? void 0
              : _a.forEach((treeData) => {
                  applyEnglishKey("TREE_NAME", treeData.id, treeData.name);
                });
            break;
          case "melvorD:Fishing":
            (_b = skillData.data.areas) === null || _b === void 0
              ? void 0
              : _b.forEach((areaData) => {
                  applyEnglishKey(
                    "FISHING",
                    `AREA_NAME_${areaData.id}`,
                    areaData.name
                  );
                  if (areaData.description !== undefined)
                    applyEnglishKey(
                      "FISHING",
                      `AREA_DESCRIPTION_${areaData.id}`,
                      areaData.description
                    );
                });
            break;
          case "melvorD:Mining":
            (_c = skillData.data.rockData) === null || _c === void 0
              ? void 0
              : _c.forEach((rockData) => {
                  applyEnglishKey("ORE_NAME", rockData.id, rockData.name);
                });
            break;
          case "melvorD:Smithing":
            (_d = skillData.data.categories) === null || _d === void 0
              ? void 0
              : _d.forEach((categoryData) => {
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Smithing_${categoryData.id}`,
                    categoryData.name
                  );
                });
            break;
          case "melvorD:Thieving":
            (_e = skillData.data.npcs) === null || _e === void 0
              ? void 0
              : _e.forEach((npcData) => {
                  applyEnglishKey(
                    "THIEVING",
                    `NPC_NAME_${npcData.id}`,
                    npcData.name
                  );
                });
            (_f = skillData.data.areas) === null || _f === void 0
              ? void 0
              : _f.forEach((areaData) => {
                  applyEnglishKey(
                    "THIEVING",
                    `AREA_NAME_${areaData.id}`,
                    areaData.name
                  );
                });
            break;
          case "melvorD:Farming":
            (_g = skillData.data.categories) === null || _g === void 0
              ? void 0
              : _g.forEach((categoryData) => {
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Farming_${categoryData.id}`,
                    categoryData.name
                  );
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Farming_${categoryData.id}_singular`,
                    categoryData.singularName
                  );
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Farming_${categoryData.id}_description`,
                    categoryData.description
                  );
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Farming_${categoryData.id}_seedNotice`,
                    categoryData.seedNotice
                  );
                });
            break;
          case "melvorD:Fletching":
            (_h = skillData.data.categories) === null || _h === void 0
              ? void 0
              : _h.forEach((categoryData) => {
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Fletching_${categoryData.id}`,
                    categoryData.name
                  );
                });
            break;
          case "melvorD:Crafting":
            (_j = skillData.data.categories) === null || _j === void 0
              ? void 0
              : _j.forEach((categoryData) => {
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Crafting_${categoryData.id}`,
                    categoryData.name
                  );
                });
            break;
          case "melvorD:Herblore":
            (_k = skillData.data.categories) === null || _k === void 0
              ? void 0
              : _k.forEach((categoryData) => {
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Herblore_${categoryData.id}`,
                    categoryData.name
                  );
                });
            (_l = skillData.data.recipes) === null || _l === void 0
              ? void 0
              : _l.forEach((recipeData) => {
                  applyEnglishKey(
                    "POTION_NAME",
                    recipeData.id,
                    recipeData.name
                  );
                });
            break;
          case "melvorD:Runecrafting":
            (_m = skillData.data.categories) === null || _m === void 0
              ? void 0
              : _m.forEach((categoryData) => {
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Runecrafting_${categoryData.id}`,
                    categoryData.name
                  );
                });
            break;
          case "melvorD:Summoning":
            (_o = skillData.data.categories) === null || _o === void 0
              ? void 0
              : _o.forEach((categoryData) => {
                  applyEnglishKey(
                    "SKILL_CATEGORY",
                    `Summoning_${categoryData.id}`,
                    categoryData.name
                  );
                });
            (_p = skillData.data.synergies) === null || _p === void 0
              ? void 0
              : _p.forEach((synergyData) => {
                  if (synergyData.customDescription === undefined) return;
                  applyEnglishKey(
                    "SUMMONING_SYNERGY",
                    `DESC_${getLocalID(synergyData.summonIDs[0])}_${getLocalID(
                      synergyData.summonIDs[1]
                    )}`,
                    synergyData.customDescription
                  );
                });
            break;
          case "melvorD:Agility":
            (_q = skillData.data.obstacles) === null || _q === void 0
              ? void 0
              : _q.forEach((obstacleData) => {
                  applyEnglishKey(
                    "AGILITY",
                    `OBSTACLE_NAME_${obstacleData.id}`,
                    obstacleData.name
                  );
                });
            (_r = skillData.data.pillars) === null || _r === void 0
              ? void 0
              : _r.forEach((pillarData) => {
                  applyEnglishKey(
                    "AGILITY",
                    `PILLAR_NAME_${pillarData.id}`,
                    pillarData.name
                  );
                });
            break;
          case "melvorD:Astrology":
            (_s = skillData.data.recipes) === null || _s === void 0
              ? void 0
              : _s.forEach((actionData) => {
                  applyEnglishKey(
                    "ASTROLOGY",
                    `NAME_${actionData.id}`,
                    actionData.name
                  );
                });
            break;
          case "melvorD:Magic":
            (_t = skillData.data.altSpells) === null || _t === void 0
              ? void 0
              : _t.forEach((spellData) => {
                  applyEnglishKey(
                    "MAGIC",
                    `ALTMAGIC_NAME_${spellData.id}`,
                    spellData.name
                  );
                  if (
                    !(
                      (spellData.produces === "Bar" &&
                        (spellData.specialCost.type ===
                          "BarIngredientsWithCoal" ||
                          spellData.specialCost.type ===
                            "BarIngredientsWithoutCoal")) ||
                      (spellData.produces === "GP" &&
                        spellData.specialCost.type === "AnyItem")
                    )
                  )
                    applyEnglishKey(
                      "MAGIC",
                      `ALTMAGIC_DESC_${spellData.id}`,
                      spellData.description
                    );
                });
            break;
          case "melvorD:Township":
            (_u = skillData.data.resources) === null || _u === void 0
              ? void 0
              : _u.forEach((resource) => {
                  applyEnglishKey(
                    "TOWNSHIP",
                    `RESOURCE_${resource.id}`,
                    resource.name
                  );
                });
            (_v = skillData.data.buildings) === null || _v === void 0
              ? void 0
              : _v.forEach((building) => {
                  applyEnglishKey(
                    "TOWNSHIP",
                    `BUILDING_${building.id}`,
                    building.name
                  );
                });
            (_w = skillData.data.biomes) === null || _w === void 0
              ? void 0
              : _w.forEach((biome) => {
                  applyEnglishKey("TOWNSHIP", `BIOME_${biome.id}`, biome.name);
                });
            (_x = skillData.data.jobs) === null || _x === void 0
              ? void 0
              : _x.forEach((job) => {
                  applyEnglishKey("TOWNSHIP", `JOB_${job.id}`, job.name);
                });
            break;
        }
      });
}
