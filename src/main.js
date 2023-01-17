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
const useCDN = true;
const CDNVersion = "v018";
const CDNEndpoint = "https://cdn.melvor.net/core";
const DEBUGENABLED = false;
const releaseDate = 1637258400000;
const DEBUG_REPORTER = [];
const CDNDIR = useCDN ? `${CDNEndpoint}/${CDNVersion}/` : "";
const gameTitle = "Melvor Idle :: v1.1.1";
let currentTitleNewsID = [];
let playFabEventQueue = [];
let isLoaded = false;
let confirmedLoaded = false;
let steamAchievements = [];
let connectedToSteam = false;
let lolYouDiedGetRekt = false;
let numberMultiplier = 10;
let returnToGameAfterSubmission = false;
const modalQueue = [];
const cloudSaveHeartbeatLevel = 0;
let loadingOfflineProgress = false;
let modalIsOpen = false;
let offlineProgressCache;
$("body").on("click", "#header-equipment-dropdown", function (e) {
  e.stopPropagation();
});
$("body").on("click", "#header-user-options-dropdown", function (e) {
  e.stopPropagation();
});
function updateWindow() {
  var _a, _b;
  return __awaiter(this, void 0, void 0, function* () {
    try {
      setSaveGUID();
      new SimpleBar($(".js-sidebar-scroll")[0]);
      One.helpers("core-bootstrap-tabs");
      $("#modal-spend-mastery-xp").on("hide.bs.modal", () => {
        spendMasteryMenu.unsetSkill();
      });
      jQuery("#page-overlay").on("click.pixelcave.overlay", (e) => {
        closeBankSidebar();
      });
      if (cloudManager.hasFullVersionEntitlement)
        sidebar.removeCategory("Demo Version");
      if (!cloudManager.hasTotHEntitlement)
        sidebar.removeCategory("Expansion 1");
      if (game.stats.General.get(GeneralStats.AccountCreationDate) === 0)
        game.stats.General.set(GeneralStats.AccountCreationDate, Date.now());
      dataDeleted = false;
      numberMultiplier = game.currentGamemode.hitpointMultiplier;
      const bane = game.monsters.getObjectByID("melvorF:BaneInstrumentOfFear");
      const impendingDarkness = game.dungeons.getObjectByID(
        "melvorF:Impending_Darkness"
      );
      if (
        bane !== undefined &&
        impendingDarkness !== undefined &&
        game.stats.Monsters.get(bane, MonsterStats.KilledByPlayer) > 0 &&
        game.combat.getDungeonCompleteCount(impendingDarkness) < 1
      ) {
        game.combat.setDungeonCompleteCount(
          impendingDarkness,
          game.stats.Monsters.get(bane, MonsterStats.KilledByPlayer)
        );
      }
      cleanSaveFile();
      initializeStatTables();
      shopMenu = new ShopMenu(game);
      game.mining.initializeRocks();
      loadMiningOres();
      $("#account-name").text(game.characterName);
      combatMenus.runes.init();
      game.onLoad();
      combatMenus.runes.updateCounts();
      updateEvery10Seconds();
      changeCombatMenu(0);
      combatMenus.prayer.updateForLevel(game.prayer.level, game.combat.player);
      buildSkillsLog(game);
      buildMasteryLog(game);
      buildMonsterLog(game);
      buildPetLog(game);
      game.combat.player.checkEquipmentRequirements();
      if (game.tutorial.shouldStart) {
        game.tutorial.continueOnLoad();
        const tutorialPage = game.pages.getObjectByID("melvorD:TutorialIsland");
        if (tutorialPage === undefined)
          throw new Error(`Error tutorial page not registered.`);
        changePage(tutorialPage, -1, undefined, false, false);
      } else {
        (_a = sidebar.category("").item("melvorD:TutorialIsland").rootEl) ===
          null || _a === void 0
          ? void 0
          : _a.classList.add("d-none");
        if (isCreatingSave) game.setupCurrentGamemode();
        game.tutorial.complete = true;
        setupSkillLock(game);
        if (game.isGolbinRaid)
          changePage(
            game.getPageForActiveAction(),
            -1,
            undefined,
            false,
            false
          );
        else
          changePage(
            game.settings.defaultPageOnLoad,
            -1,
            undefined,
            false,
            false
          );
      }
      eventManager.loadEvents();
      game.combat.retroactivelyAddOneTimeRewards();
      setBackupSaveDetails(backupSave);
      initSteam();
      loadLore();
      game.golbinRaid.onLoad();
      game.lore.onLoad();
      isLoaded = true;
      updateUIForLanguageChange();
      characterSelected = true;
      inCharacterSelection = false;
      $("#m-page-loader").attr("class", "d-none");
      console.log("Game Loaded");
      Summoning.updateSearchArray();
      initTooltips();
      cloudManager.updateUIForMelvorCloudSignIn();
      cloudManager.updateUIForEntitlements();
      initChangelog();
      One.helpers("core-toggle-class");
      const zoomLevel = localStorage.getItem("steamZoomLevel");
      if (
        location.origin === "https://steam.melvoridle.com" &&
        localStorage.getItem("steamZoomLevel") !== undefined &&
        zoomLevel !== null
      ) {
        if (!Number.isInteger(zoomLevel))
          adjustZoom(Number.parseFloat(zoomLevel));
        else removeItem("steamZoomLevel");
      }
      if (
        localStorage.getItem("creationDate") === undefined ||
        localStorage.getItem("creationDate") === null
      )
        localStorage.setItem("creationDate", `${new Date().getTime()}`);
      if (
        game.settings.enableOfflineCombat ||
        (localStorage.getItem("offlineCombatDismissed") !== null &&
          localStorage.getItem("offlineCombatDismissed") !== undefined)
      )
        $("#offline-combat-alert").addClass("d-none");
      if (
        game.settings.continueThievingOnStun ||
        (localStorage.getItem("offlineThievingDismissed") !== null &&
          localStorage.getItem("offlineThievingDismissed") !== undefined)
      )
        $("#offline-thieving-alert").addClass("d-none");
      window.setTimeout(function () {
        gameUpdate();
      }, 5000);
      if (
        cloudManager.hasFullVersionEntitlement &&
        PlayFab.ClientApi.IsClientLoggedIn()
      ) {
        (_b = document.querySelector(".mod-support-setting")) === null ||
        _b === void 0
          ? void 0
          : _b.classList.remove("d-none");
        const modsHidden = mod.manager.isHidden();
        document
          .querySelector(".mod-support-enable-btn")
          .classList.toggle("d-none", !modsHidden);
        const disableModBtn = document.querySelector(
          ".mod-support-disable-btn"
        );
        disableModBtn.classList.toggle("d-none", modsHidden);
        disableModBtn.textContent = `${
          mod.manager.isEnabled() ? "Disable & " : ""
        }Hide Mod Manager`;
      }
      yield mod.trigger.characterLoaded();
    } catch (e) {
      showGameLoadError(e);
    }
  });
}
function showGameLoadError(e) {
  $("#m-page-loader").attr("class", "d-none");
  if (e instanceof Error && e.stack !== undefined)
    $("#game-broke-error-msg").val(e.stack);
  const mods = mod.getModsFromError(e);
  if (mods.length > 0) {
    $("#game-broke-load-text").html(
      `<strong>Error due to Mods:</strong><br>${mods
        .map(({ name, version }) => `${name}: v${version}`)
        .join("<br>")}`
    );
    $("#game-broke-load-dev").text(
      "Please report this error to the mod developer(s):"
    );
  }
  $("#modal-game-broke").modal("show");
  console.error(e);
}
function loadLore() {
  for (let i = 0; i < LORE.length; i++) {
    $("#lore-" + i + "-header").html(LORE[i].title);
    $("#lore-" + i + "-title").html(LORE[i].title);
    $("#lore-" + i + "-text").html(LORE[i].paragraphs);
  }
}
let offlineModalID = 0;
function cleanSaveFile() {
  const defunctVars = [
    "farmingAreas",
    "killCount",
    "mbucks",
    "caseInventory",
    "totalMbucksSpent",
    "arcXP",
    "arcLevel",
    "arcNextLevelProgress",
    "easterEggs",
    "easterMaxScores",
    "totalEasterEggs",
    "autoSlayerTask",
    "slayerTaskCompetion",
  ];
  defunctVars.forEach((varName) => {
    if (getItem(`${key}${varName}`) !== null) removeItem(`${key}${varName}`);
  });
}
function getCloudSaveHeartbeatInterval() {
  const initialInterval = 43200000;
  return initialInterval;
}
const tenSeconds = 10000;
let tenSecondUpdateTimeout = -1;
let gameVersionChecker = 0;
function updateEvery10Seconds() {
  clearTimeout(tenSecondUpdateTimeout);
  tenSecondUpdateTimeout = setTimeout(function () {
    saveData();
    if (connectedToPlayFab) {
      const currentTime = new Date().getTime();
      if (currentTime - lastLoginTimestamp >= 16 * 60 * 60 * 1000) {
        cloudManager.refreshPlayFabToken("customID");
        lastLoginTimestamp = currentTime;
      }
      if (
        currentTime - lastSaveTimestamp >= autoCloudSaveInterval &&
        game.settings.autoCloudSave
      ) {
        forceSync(false, false);
        setAutoCloudSaveInterval();
      }
    }
    if (gameVersionChecker % 45 === 0) {
      if (connectedToPlayFab) fetchLatestTitleNews();
      if (
        game.settings.enableOfflinePushNotifications &&
        game.activeAction !== undefined
      )
        sendPushNotification(
          `offlineSkill`,
          templateLangString("PUSH_NOTIFICATIONS", "OFFLINE_CAP", {
            username: game.characterName,
          }),
          64800000
        );
    }
    if (gameVersionChecker > 0) updateLastCloudSaveTimestamp();
    gameVersionChecker++;
    if (connectedToSteam) {
      const sLevel = game.completion.skillProgress.currentCount.getSum();
      const gm = game.currentGamemode.name;
      parent.greenworks.setRichPresence("currentGamemode", gm);
      parent.greenworks.setRichPresence("skillLevel", "" + sLevel + "");
      parent.greenworks.setRichPresence(
        "steam_display",
        "#Status_gamemodeSkillLevel"
      );
      try {
        setDiscordRPCDetails();
      } catch (e) {
        console.error(e);
      }
    }
    game.township.grantOfflineTicks();
    game.township.tasks.checkForTaskReady();
    updateEvery10Seconds();
  }, tenSeconds);
}
const isAdsPath = function () {
  return (
    location.pathname.includes("index_ads.php") ||
    location.pathname.includes("siwg_test.html")
  );
};
function isIOS() {
  return (
    location.origin === "https://ios.melvoridle.com" ||
    navigator.userAgent.includes("gonative_ios")
  );
}
function isAndroid() {
  return (
    location.origin === "https://android.melvoridle.com" ||
    navigator.userAgent.includes("gonative_android")
  );
}
function isMobile() {
  return isIOS() || isAndroid || location.pathname.includes("index_mobile.php");
}
function isSteam() {
  return (
    location.origin === "https://steam.melvoridle.com" ||
    parent.greenworks !== undefined
  );
}
const isDemoSkill = (skill) => {
  const f = new Set([
    "melvorD:Attack",
    "melvorD:Strength",
    "melvorD:Defence",
    "melvorD:Hitpoints",
    "melvorD:Woodcutting",
    "melvorD:Fishing",
    "melvorD:Firemaking",
    "melvorD:Cooking",
    "melvorD:Mining",
    "melvorD:Smithing",
    "melvorD:Farming",
  ]);
  return f.has(skill.id);
};
const getLockedTitle = function (skill, dungeon) {
  let title = "";
  if (!cloudManager.hasFullVersionEntitlement) {
    if (
      (skill === undefined && dungeon === undefined) ||
      cloudManager.isOnAuthPage
    )
      title += getLangString("IAP", "BTN_MOBILE_Q");
    else if (skill !== undefined)
      title += getLangString("MENU_TEXT", "SKILL_LOCKED");
    else if (dungeon !== undefined)
      title += getLangString("MENU_TEXT", "DUNGEON_LOCKED");
  } else {
    title += getLangString("MENU_TEXT", "SKILL_LOCKED");
  }
  return title;
};
const getLockedMessage = function (skill, dungeon) {
  let msg = "";
  if (!cloudManager.hasFullVersionEntitlement) {
    if (skill === undefined && dungeon === undefined && setLang != "en")
      msg += `<h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString(
        "IAP",
        "DESC_WEB"
      )}</h5>`;
    else if (skill !== undefined)
      msg += `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${
        skill.media
      }"> ${templateString(getLangString("IAP", "DESC_SKILL"), {
        skillName: skill.name,
      })}</h5>`;
    else if (dungeon !== undefined)
      msg += `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${
        dungeon.media
      }"> ${templateString(getLangString("IAP", "DESC_DUNGEON"), {
        dungeonName: dungeon.name,
      })}</h5>`;
    if (setLang == "en")
      msg += `<h5 class="font-w400 text-combat-smoke font-size-sm">Purchasing the <strong class="text-success">Full Version</strong> unlocks a variety of extra content!</h5><h5 class="font-w400 text-combat-smoke font-size-sm"><strong class="text-success">13</strong> more unique Skills<br><strong class="text-success">7</strong> extra challenging Dungeons<br><strong class="text-success">2</strong> new Gamemodes<br><strong class="text-success">One-time Purchase</strong> only</h5>`;
    msg += `<h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString(
      "IAP",
      "CALL_TO_ACTION"
    )}</h5>`;
  } else if (skill !== undefined) {
    msg += `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${
      skill.media
    }"> ${templateString(getLangString("IAP", "DESC_SKILL"), {
      skillName: skill.name,
    })}</h5>`;
  }
  return msg;
};
let IAPPrice = "";
const getLocaleIAPPrice = function () {
  if (location.origin === "https://ios.melvoridle.com") {
    window.bridge.post("iap_price", {}, (results, error) => {
      IAPPrice = results.price;
    });
  }
};
const IAPPurchaseInProcess = false;
let IAPTimer;
const performUnlockIAP = function (productID) {
  if (nativeManager.isIOS || nativeManager.isAndroid) {
    try {
      if (nativeManager.isIOS || nativeManager.isAndroid)
        nativeManager.purchaseIAP(productID);
      startIAPPurchaseInterval();
    } catch (e) {
      console.error(e);
    }
  } else {
    const newWindow = window.open(
      "https://store.steampowered.com/app/1267910/Melvor_Idle/",
      "_blank"
    );
    if (newWindow === null) throw new Error("Could not open IAP window");
    newWindow.focus();
  }
};
const performUnlockExpansionIAP = function (productID) {
  if (nativeManager.isIOS || nativeManager.isAndroid) {
    if (!nativeManager.isNativeApp) return;
    try {
      if (nativeManager.isIOS || nativeManager.isAndroid)
        nativeManager.purchaseIAP(productID);
      startIAPPurchaseInterval();
    } catch (e) {
      console.error(e);
    }
  } else {
    openExpansionSteamLink();
  }
};
const startIAPPurchaseInterval = function () {
  if (!nativeManager.isNativeApp) return;
  clearInterval(IAPTimer);
  IAPTimer = setInterval(function () {
    if (nativeManager.isIOS && !nativeManager.isNativeApp) {
      window.bridge.post("app_purchased", {}, (results, error) => {
        if (results.purchased) window.location.href = "index.php";
      });
    } else if (nativeManager.isAndroid) {
      getAndroidIAPStatus().then((isPurchased) => {
        if (isPurchased) window.location.href = "index.php";
      });
      if (android.isProductPurchased()) window.location.href = "index.php";
    }
  }, 2000);
};
const getAndroidIAPStatus = function () {
  const isPurchased = new Promise((resolve, reject) => {
    resolve(android.isProductPurchased());
  });
  return isPurchased;
};
const updateMobilePurchaseStatus = function () {
  if (nativeManager.isNativeApp) return;
  if (location.origin === "https://ios.melvoridle.com") {
    window.bridge.post("app_purchased", {}, (results, error) => {
      if (results.purchased) {
        PlayFabClientSDK.ExecuteCloudScript(
          {
            FunctionName: "checkValidMobilePurchase",
            FunctionParameter: { isValid: results.purchased },
          },
          () => {}
        );
      }
    });
  } else if (location.origin === "https://android.melvoridle.com") {
    getAndroidIAPStatus().then((isPurchased) => {
      if (isPurchased) {
        PlayFabClientSDK.ExecuteCloudScript(
          {
            FunctionName: "checkValidMobilePurchase",
            FunctionParameter: { isValid: isPurchased },
          },
          () => {}
        );
      } else if (location.pathname == "/adfree/index.php") {
        PlayFabClientSDK.ExecuteCloudScript(
          {
            FunctionName: "checkValidMobilePurchase",
            FunctionParameter: { isValid: "true" },
          },
          () => {}
        );
      }
    });
  }
};
const getLockedBtn = function (productID) {
  let msg = "";
  if (
    (nativeManager.isIOS || nativeManager.isAndroid) &&
    nativeManager.isNativeApp
  ) {
    msg = templateString(getLangString("IAP", "PRICE"), {
      price: `${nativeManager.getIAPPrice(productID, true)}`,
    });
  } else {
    msg = getLangString("IAP", "BTN_WEB");
  }
  return msg;
};
function openNextModal() {
  if (modalQueue.length && !(modalIsOpen || Swal.isVisible())) {
    SwalLocale.fire(modalQueue[0]).then((result) => {
      if (result.isConfirmed) {
        modalIsOpen = false;
        openNextModal();
      }
    });
    modalQueue.splice(0, 1);
    modalIsOpen = true;
  } else if (!modalQueue.length) modalIsOpen = false;
}
function addModalToQueue(modal) {
  modalQueue.push(modal);
  openNextModal();
}
function showBaneCompletionModal() {
  const time = game.stats.General.get(GeneralStats.AccountCreationDate);
  if (time === 0) return;
  SwalLocale.fire({
    title: "Congratulations!",
    html: `You defeated Bane in ${formatAsTimePeriod(
      new Date().getTime() - time
    )}`,
    imageUrl: "assets/media/main/has.svg",
    imageWidth: 128,
    imageHeight: 128,
    imageAlt: "Yay",
  });
}
function onSaveDataLoad() {
  return __awaiter(this, void 0, void 0, function* () {
    yield updateWindow();
    if (!isLoaded) throw new Error("updateWindow failed.");
    $("#m-page-loader-test").attr("class", "d-none");
    if (!isCreatingSave) yield game.processOffline();
    game.startMainLoop();
    confirmedLoaded = true;
    yield mod.trigger.interfaceReady();
  });
}
function resetAccountData() {
  if (game.currentGamemode.isPermaDeath) {
    lolYouDiedGetRekt = true;
    if (game.settings.showCloseConfirmations)
      game.settings.toggleSetting("showCloseConfirmations");
    deleteLocalSaveInSlot();
    dataDeleted = true;
    if (connectedToPlayFab) deletePlayFabSave();
    location.href = "index.php";
  }
}
function setDiscordRPCDetails() {
  var _a, _b, _c;
  return __awaiter(this, void 0, void 0, function* () {
    const gm = game.currentGamemode.name;
    const sLevel = game.completion.skillProgress.currentCount.getSum();
    const details = `${gm} (${sLevel} Total Level) (${Math.floor(
      game.completion.totalProgressTrue
    )}%)`;
    let state = "idk what is happening";
    switch (game.activeAction) {
      case undefined:
        state = "Currently bank standing...";
        break;
      case game.combat:
        state = `Fighting ${
          (_a = game.combat.enemy.monster) === null || _a === void 0
            ? void 0
            : _a.name
        } in ${
          (_b = game.combat.selectedArea) === null || _b === void 0
            ? void 0
            : _b.name
        }`;
        break;
      case game.woodcutting:
        state = `Currently Woodcutting (${game.woodcutting.virtualLevel}/${game.woodcutting.levelCap})`;
        break;
      case game.fishing:
        state = `Currently Fishing ${game.fishing.activeFish.name} (${game.fishing.virtualLevel}/${game.fishing.levelCap})`;
        break;
      case game.firemaking:
        state = `Currently Firemaking lol (${game.firemaking.virtualLevel}/${game.firemaking.levelCap})`;
        break;
      case game.cooking:
        state = `Currently Cooking ${game.cooking.activeRecipe.name} (${game.cooking.virtualLevel}/${game.cooking.level})`;
        break;
      case game.mining:
        state = `Currently Mining ${game.mining.activeRock.name} (${game.mining.virtualLevel}/${game.mining.levelCap})`;
        break;
      case game.smithing:
        state = `Currently Smithing ${game.smithing.activeRecipe.name} (${game.smithing.virtualLevel}/${game.smithing.levelCap})`;
        break;
      case game.thieving:
        state = `Currently Thieving ${
          (_c = game.thieving.currentNPC) === null || _c === void 0
            ? void 0
            : _c.name
        } (${game.thieving.virtualLevel}/${game.thieving.levelCap})`;
        break;
      case game.fletching:
        state = `Currently Fletching ${game.fletching.activeRecipe.name} (${game.fletching.virtualLevel}/${game.fletching.levelCap})`;
        break;
      case game.crafting:
        state = `Currently Crafting ${game.crafting.activeRecipe.name} (${game.crafting.virtualLevel}/${game.crafting.levelCap})`;
        break;
      case game.runecrafting:
        state = `Currently Runecrafting ${game.runecrafting.activeRecipe.name} (${game.runecrafting.virtualLevel}/${game.runecrafting.levelCap})`;
        break;
      case game.herblore:
        state = `Currently Herblore ${game.herblore.activeRecipe.name} (${game.herblore.virtualLevel}/${game.herblore.levelCap})`;
        break;
      case game.agility:
        state = `Currently training Agility (${game.agility.virtualLevel}/${game.agility.levelCap})`;
        break;
      case game.summoning:
        state = `Currently creating ${game.summoning.activeRecipe.name} Tablets (${game.summoning.virtualLevel}/${game.summoning.levelCap})`;
        break;
      case game.astrology:
        state = `Currently studying ${game.astrology.activeConstellation.name} (${game.astrology.virtualLevel}/${game.astrology.levelCap})`;
        break;
      case game.altMagic:
        state = `Currently training Alt. Magic (${game.altMagic.activeSpell.name}) (${game.altMagic.virtualLevel}/${game.altMagic.levelCap})`;
        break;
      case game.golbinRaid:
        state = `Raiding Golbins (Wave ${game.golbinRaid.wave + 1}) (${
          game.golbinRaid.difficulty.name
        })`;
        break;
      default:
        state = `Currently playing with mods`;
        break;
    }
    parent.setActivityDetails(`${details}`, `${state}`);
  });
}
function initSteam() {
  if (location.origin === "https://steam.melvoridle.com") {
    if (parent.greenworks.initAPI() && parent.greenworks.init())
      connectedToSteam = true;
    else
      console.log(
        "There was an error connecting to Steam. Steam Achievement functionality will not work."
      );
    if (connectedToSteam) game.checkSteamAchievements();
  }
}
function unlockSteamAchievement(achievementName, i) {
  try {
    parent.greenworks.activateAchievement(achievementName, function () {});
    steamAchievements[i] = 1;
  } catch (e) {
    console.error(e);
  }
}
function resetSteamAchievements() {
  try {
    const achievementNames = parent.greenworks.getAchievementNames();
    steamAchievements = [];
    for (let i = 0; i < achievementNames.length; i++) {
      parent.greenworks.clearAchievement(achievementNames[i], function () {});
      steamAchievements.push(0);
    }
  } catch (e) {
    console.error(e);
  }
}
function showPageLoader() {
  $("#m-page-loader").attr("class", "show");
}
function initTooltips() {
  tippy(".mastery-icon", {
    content: getLangString("MENU_TEXT", "MASTERY"),
    placement: "bottom",
    interactive: false,
    animation: false,
  });
  tippy(".melee-icon", {
    content: getLangString("COMBAT_MISC", "MELEE"),
    placement: "bottom",
    interactive: false,
    animation: false,
  });
  tippy(".ranged-icon", {
    content: getLangString("SKILL_NAME", "Ranged"),
    placement: "bottom",
    interactive: false,
    animation: false,
  });
  tippy(".magic-icon", {
    content: getLangString("SKILL_NAME", "Magic"),
    placement: "bottom",
    interactive: false,
    animation: false,
  });
  tippy(".prayer-icon", {
    content: getLangString("SKILL_NAME", "Prayer"),
    placement: "bottom",
    interactive: false,
    animation: false,
  });
  tippy(".prayer-points-icon", {
    content: `<small>${getLangString("COMBAT_MISC", "16")}<br>${getLangString(
      "COMBAT_MISC",
      "GAINED_FROM_BURYING"
    )}</small>`,
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#combat-menu-item-0", {
    content:
      "<div class='text-center'>" +
      getLangString("COMBAT_MISC", "MENU_0") +
      "</div>",
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#combat-menu-item-1", {
    content:
      "<div class='text-center'>" +
      getLangString("COMBAT_MISC", "MENU_1") +
      "</div>",
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#combat-menu-item-2", {
    content:
      "<div class='text-center'>" +
      getLangString("COMBAT_MISC", "MENU_3") +
      "</div>",
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#combat-menu-item-3", {
    content:
      "<div class='text-center'>" +
      getLangString("COMBAT_MISC", "MENU_2") +
      "</div>",
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#combat-menu-item-4", {
    content: `<div class='text-center'>${getLangString(
      "COMBAT_MISC",
      "MENU_6"
    )}</div>`,
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#combat-menu-item-5", {
    content:
      "<div class='text-center'>" +
      getLangString("COMBAT_MISC", "MENU_5") +
      "</div>",
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#combat-menu-item-6", {
    content:
      "<div class='text-center'>" +
      getLangString("COMBAT_MISC", "MENU_4") +
      "</div>",
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy("#last-cloud-save-question", {
    content: `<h5 class="font-w400 font-size-sm mb-1">${getLangString(
      "MENU_TEXT",
      "CLOUD_INFO_TT_0"
    )}<br><span class="text-warning">${getLangString(
      "MENU_TEXT",
      "CLOUD_INFO_TT_1"
    )}</span></h5>`,
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  tippy(".summoning-combat-bar", {
    content: `<h5 class="font-w400 font-size-sm mb-1 text-center">${getLangString(
      "COMBAT_MISC",
      "SUMMON_BAR_TT"
    )}</h5>`,
    placement: "top",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
}
function generateLoreModals() {
  let html = "";
  for (let i = 9; i < LORE.length; i++) {
    html += `
	<div class="modal" id="modal-book-${i}" tabindex="-1" role="dialog" aria-labelledby="modal-block-extra-large" aria-modal="true" style="display: none;">
	  <div class="modal-dialog modal-lg" role="document">
	    <div class="modal-content" style="height:100%;">
	      <div class="block block-themed block-transparent mb-0">
	        <div class="block-header bg-primary-dark">
	          <h3 class="block-title" id="lore-${i}-header"></h3>
	          <div class="block-options">
	            <button type="button" class="btn-block-option" data-dismiss="modal" aria-label="Close">
	              <i class="fa fa-fw fa-times"></i>
	            </button>
	          </div>
	        </div>
	        <div class="block-content block-content-full text-center">
	          <h5 class="font-w600 text-combat-smoke" id="lore-${i}-title"></h5>
	          <h5 class="font-w300 font-size-sm text-combat-smoke" id="lore-${i}-text"></h5>
	        </div>
	      </div>
	    </div>
	  </div>
	</div>`;
  }
  return html;
}
function resetSkillsTo99(confirmed = false) {
  if (!confirmed) {
    SwalLocale.fire({
      title: getLangString("SETTINGS", "RESET_99_SWAL_TITLE"),
      html: `${getLangString(
        "SETTINGS",
        "RESET_99_SWAL_BODY_0"
      )}<br><br><strong>${getLangString(
        "SETTINGS",
        "RESET_99_MSG_0"
      )}</strong><br><br><strong class="text-warning">${getLangString(
        "SETTINGS",
        "RESET_99_MSG_2"
      )}</strong><br><br>${getLangString("SETTINGS", "RESET_99_SWAL_BODY_1")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: getLangString("MENU_TEXT", "CONFIRM"),
      cancelButtonText: getLangString("CHARACTER_SELECT", "45"),
    }).then((result) => {
      if (result.value) {
        resetSkillsTo99(true);
      }
    });
    return;
  }
  game.skills.forEach((skill) => {
    if (skill.xp >= exp.level_to_xp(100)) skill.setXP(exp.level_to_xp(100) - 1);
  });
  saveData();
  location.href = "index.php";
}
function setBackground(id) {
  const bg = document.querySelectorAll("bg-selection");
  bg.forEach((el) => {
    el.style.backgroundImage = `url('assets/media/main/bg_${id}.jpg')`;
  });
}
function initChangelog() {
  if (cloudManager.isTest) {
    window.announcekit.push({
      widget: "https://announcekit.co/widgets/v2/1d44KY",
      name: "changelog",
      selector: ".announcekit-updates",
      badge: { style: { "margin-left": "5px" } },
    });
  } else {
    window.announcekit.push({
      widget: "https://changelog.melvoridle.com/widgets/v2/1pyqtO",
      selector: ".announcekit-widget",
      embed: true,
    });
  }
}
