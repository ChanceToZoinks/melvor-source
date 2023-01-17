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
let currentCharacter = 0;
let characterSelected = false;
let backupSave = "";
let dataDeleted = false;
const keyVersion = "A04";
let key = "MI-" + keyVersion + "-" + currentCharacter + "-";
let currentStartPage = 8;
let panVal = 0;
let GUID;
const setSaveGUID = () => {
  if (GUID === undefined) {
    GUID = Math.random().toString(36).substring(2, 6);
  }
};
let sidebarSwipeTimer = -1;
let disableSwipeEvents = false;
let disableSidebarSwipe = false;
function disableSidebarSwipeTimer() {
  disableSidebarSwipe = true;
  clearTimeout(sidebarSwipeTimer);
  sidebarSwipeTimer = setTimeout(function () {
    disableSidebarSwipe = false;
  }, 1000);
}
function updateKeys() {
  key = getKeyForSaveSlot(currentCharacter);
}
function getKeyForSaveSlot(slotID) {
  let saveKey;
  if (slotID === 0) {
    saveKey = `MI-${keyVersion}`;
  } else {
    saveKey = `MI-${keyVersion}-${slotID}-`;
  }
  if (cloudManager.isTest) saveKey = `MI-test-${saveKey}`;
  return saveKey;
}
function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getItem(key) {
  const keydata = localStorage.getItem(key);
  if (keydata === null) return null;
  if (keydata === "undefined") return undefined;
  return JSON.parse(keydata);
}
function removeItem(key) {
  localStorage.removeItem(key);
}
let firstSkillAction = true;
function saveData(vars = "all") {
  if (
    !dataDeleted &&
    !inCharacterSelection &&
    !(game.currentGamemode.isPermaDeath && lolYouDiedGetRekt) &&
    !blockCorruptSaving
  ) {
    updateKeys();
    const doSave = vars === "all" || (vars === "offline" && firstSkillAction);
    if (doSave) {
      if (DEBUGENABLED) game.combat.saveStats();
      localStorage.setItem(`${key}saveGame`, game.generateSaveString());
      if (vars === "offline") {
        firstSkillAction = false;
      }
    }
  }
}
function getSaveGameOld(keyPrefix) {
  const saveGame = {};
  allVars.forEach((varName) => {
    const data = getItem(keyPrefix + varName);
    if (data !== null && data !== undefined) {
      saveGame[varName] = data;
    } else {
      saveGame[varName] = defaultSaveValues[varName];
    }
  });
  saveGame.version = -1;
  return saveGame;
}
function removeSaveOld(keyPrefix) {
  allVars.forEach((varName) => {
    removeItem(keyPrefix + varName);
  });
  console.log("Removed old local storage keys.");
}
function updatePartialSettings(partialSettings) {
  const defaultSettings = defaultSaveValues.SETTINGS;
  Object.keys(defaultSettings).forEach((category) => {
    if (partialSettings[category] !== undefined) {
      Object.assign(defaultSettings[category], partialSettings[category]);
    }
  });
  return defaultSettings;
}
function doesLocalSaveExist(keyPrefix) {
  const saveString = localStorage.getItem(`${keyPrefix}saveGame`);
  if (saveString === null) {
    if (localStorage.getItem(`${keyPrefix}skillLevel`) !== null) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 2;
  }
}
function deleteLocalSaveInSlot(slotID) {
  if (slotID === undefined) slotID = currentCharacter;
  const storageKey = getKeyForSaveSlot(slotID);
  if (localStorage.getItem(`${storageKey}saveGame`) !== null) {
    localStorage.removeItem(`${storageKey}saveGame`);
  }
  removeSaveOld(storageKey);
  console.log(`Deleted local save in slot: ${slotID}.`);
  dataDeleted = true;
}
function exportSave(update = false) {
  const exportSaved = getLocalSaveString();
  if (!update) {
    const exportField = document.getElementById("exportSaveField");
    const exportField2 = document.getElementById("exportSaveField2");
    exportField.value = exportSaved;
    exportField2.value = exportSaved;
  } else {
    const exportField = document.getElementById("exportSaveFieldUpdate");
    const exportField2 = document.getElementById("exportSaveFieldUpdate2");
    exportField.value = exportSaved;
    exportField2.value = exportSaved;
  }
}
function setSlotToSaveString(slotID, saveString) {
  const keyToUse = getKeyForSaveSlot(slotID);
  const existingSave = doesLocalSaveExist(keyToUse);
  if (existingSave === 1) {
    removeSaveOld(keyToUse);
  }
  localStorage.setItem(`${keyToUse}saveGame`, saveString);
}
function importSaveToSlot(saveString, slotID) {
  return __awaiter(this, void 0, void 0, function* () {
    if (saveString === "") return false;
    const saveHeader = yield game.getHeaderFromSaveString(saveString);
    if (typeof saveHeader === "number") return false;
    setSlotToSaveString(slotID, saveString);
    return true;
  });
}
function openDeleteMelvorCloudAccount() {
  SwalLocale.fire({
    title: "Delete Melvor Cloud Account?",
    html: `<div class="font-w600 mb-3">Are you sure you want to delete your Melvor Cloud Account?</div><div class="font-w600 text-danger">THIS CANNOT BE UNDONE AND WILL REMOVE YOUR MELVOR CLOUD ACCOUNT COMPLETELY. ALL CLOUD SAVES WILL BE LOST FOREVER AND CANNOT BE RECOVERED.</div>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "DELETE MY ACCOUNT",
    cancelButtonText: getLangString("CHARACTER_SELECT", "45"),
  }).then((result) => {
    if (result.value) confirmDeleteMelvorCloudAccount();
  });
}
function confirmDeleteMelvorCloudAccount() {
  $.ajax({
    url: CLOUDURL + "cloud/deleteMelvorCloudAccount.php",
    type: "POST",
    async: true,
    data: { deleteAccount: 1 },
    success: function (data) {
      if (data === "1") {
        SwalLocale.fire({
          icon: "success",
          html: `<span class="text-dark">Your account has been deleted successfully. Reloading the game.</span>`,
        });
        cloudManager.logout();
      } else {
        SwalLocale.fire({
          icon: "error",
          html: `<span class="text-dark">Something went wrong. Please try again.</span>`,
        });
      }
    },
  });
}
function copyToClipboard(input) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(input).then(
      () => {
        console.log("Copied to clipboard successfully.");
      },
      (err) => {
        console.log("Failed to copy the text to clipboard.", err);
      }
    );
  }
}
function getLocalSaveString(customKey = false, charID = 0) {
  let keyPrefix = key;
  if (customKey) keyPrefix = getKeyForSaveSlot(charID);
  const saveExists = doesLocalSaveExist(keyPrefix);
  if (saveExists) {
    switch (saveExists) {
      case 1:
        return getSaveStringOld(keyPrefix);
      case 2: {
        const saveString = localStorage.getItem(`${keyPrefix}saveGame`);
        if (saveString === null) return "";
        else return saveString;
      }
    }
  } else return "";
}
function getSaveStringOld(keyPrefix) {
  const toSave = getSaveGameOld(keyPrefix);
  const pakoSave = pako.gzip(JSON.stringify(toSave), { to: "string" });
  return btoa(pakoSave);
}
let loadedIDMap = undefined;
function getNumericIDMap() {
  return __awaiter(this, void 0, void 0, function* () {
    if (loadedIDMap === undefined) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const response = yield fetch("assets/data/oldIDMaps.json", {
        method: "GET",
        headers,
      });
      loadedIDMap = yield response.json();
    }
    return loadedIDMap;
  });
}
function downloadSave(backup = false, slotID = -1) {
  return __awaiter(this, void 0, void 0, function* () {
    let saveString;
    let saveUsername = "";
    const saveTimestamp =
      replaceAll(new Date().toLocaleDateString(), "/", "-") +
      "_" +
      replaceAll(replaceAll(new Date().toLocaleTimeString(), ":", ""), " ", "");
    if (!backup && slotID < 0) saveString = getLocalSaveString();
    else if (slotID >= 0) saveString = getLocalSaveString(true, slotID);
    else saveString = backupSave;
    const file = new Blob([saveString], { type: "text/plain" });
    if (slotID >= 0) {
      const saveInfo = yield game.getHeaderFromSaveString(saveString);
      if (typeof saveInfo === "number") {
        console.log("Unable to get save username. Using default.");
        saveUsername = `ErrorSaveSlot${slotID + 1}`;
      } else {
        saveUsername = saveInfo.characterName;
      }
    } else {
      saveUsername = game.characterName;
    }
    try {
      const a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download =
        "melvoridlesave_" + saveUsername + "_" + saveTimestamp + ".txt";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
      return true;
    } catch (e) {
      return false;
    }
  });
}
function isOldItemStats(itemStats) {
  return !("stats" in itemStats[0]);
}
function isOldMonsterStats(monsterStats) {
  return !("stats" in monsterStats[0]);
}
function convertItemStats(oldItemStats) {
  const newItemStats = [];
  for (let i = 0; i < oldItemStats.length; i++) {
    newItemStats.push({
      itemID: i,
      stats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
    newItemStats[i].stats[0] = oldItemStats[i].timesFound;
    newItemStats[i].stats[1] = oldItemStats[i].timesSold;
    newItemStats[i].stats[2] = oldItemStats[i].gpFromSale;
    newItemStats[i].stats[3] = oldItemStats[i].deathCount;
    newItemStats[i].stats[4] = oldItemStats[i].damageTaken;
    newItemStats[i].stats[5] = oldItemStats[i].damageDealt;
    newItemStats[i].stats[6] = oldItemStats[i].missedAttacks;
    newItemStats[i].stats[7] = oldItemStats[i].timesEaten;
    newItemStats[i].stats[8] = oldItemStats[i].healedFor;
    newItemStats[i].stats[9] = oldItemStats[i].totalAttacks;
    newItemStats[i].stats[10] = oldItemStats[i].amountUsedInCombat;
    newItemStats[i].stats[11] = oldItemStats[i].timeWaited;
    newItemStats[i].stats[12] = oldItemStats[i].timesDied;
    newItemStats[i].stats[13] = oldItemStats[i].timesGrown;
    newItemStats[i].stats[14] = oldItemStats[i].harvestAmount;
    newItemStats[i].stats[15] = oldItemStats[i].enemiesKilled;
    newItemStats[i].stats[16] = oldItemStats[i].timesOpened;
  }
  return newItemStats;
}
function convertMonsterStats(oldMonsterStats) {
  const newMonsterStats = [];
  for (let i = 0; i < oldMonsterStats.length; i++) {
    newMonsterStats.push({
      monsterID: i,
      stats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
    newMonsterStats[i].stats[0] = oldMonsterStats[i].damageDealtToPlayer;
    newMonsterStats[i].stats[1] = oldMonsterStats[i].damageTakenFromPlayer;
    newMonsterStats[i].stats[2] = oldMonsterStats[i].killedByPlayer;
    newMonsterStats[i].stats[3] = oldMonsterStats[i].killedPlayer;
    newMonsterStats[i].stats[4] = oldMonsterStats[i].hitsToPlayer;
    newMonsterStats[i].stats[5] = oldMonsterStats[i].hitsFromPlayer;
    newMonsterStats[i].stats[6] = oldMonsterStats[i].enemyMissed;
    newMonsterStats[i].stats[7] = oldMonsterStats[i].playerMissed;
    newMonsterStats[i].stats[8] = oldMonsterStats[i].seen;
    newMonsterStats[i].stats[9] = oldMonsterStats[i].ranAway;
  }
  return newMonsterStats;
}
let blockCorruptSaving = false;
function loadOldSaveGame(savegame) {
  return __awaiter(this, void 0, void 0, function* () {
    const idMap = yield getNumericIDMap();
    try {
      if (savegame.accountGameVersion < 110) updateSavePre110(savegame);
      if (savegame.accountGameVersion < 121) updateSavePre121(savegame);
      if (savegame.version <= 8) {
        if (
          savegame.itemStats !== undefined &&
          isOldItemStats(savegame.itemStats)
        ) {
          savegame.itemStats = convertItemStats(savegame.itemStats);
        }
        if (
          savegame.monsterStats !== undefined &&
          isOldMonsterStats(savegame.monsterStats)
        ) {
          savegame.monsterStats = convertMonsterStats(savegame.monsterStats);
        }
      }
      cleanSaveGame(savegame);
      convertOldMastery(savegame);
      game.convertFromOldFormat(savegame, idMap);
    } catch (e) {
      blockCorruptSaving = true;
      showGameLoadError(e);
    }
  });
}
function setBackupSaveDetails(save) {
  if (save !== null) {
    const unpako = atob(save);
    let savegame;
    try {
      savegame = JSON.parse(pako.ungzip(unpako, { to: "string" }));
    } catch (e) {
      savegame = unpako;
    }
    const version = savegame.gameUpdateNotification;
    $("#settings-backup-save-version").text(version);
    $("#exportBackupSaveField").val(backupSave);
  }
}
let quickEquipInterval = -1;
let inFocus = true;
const onloadEvent = function (accessCheck = false) {
  var _a;
  if (!gameOriginCheck())
    $("body").html(`Why tho<br><img src="assets/april/images/lemon.jpg">`);
  else {
    let errorNum = "0";
    try {
      updateKeys();
      $(".cloud-connection-status-text").removeClass("text-danger");
      $(".cloud-connection-status-text").removeClass("text-success");
      if (!cloudManager.isAuthenticated)
        $(".btn-cloud-sign-in").removeClass("d-none");
      if (isSteam() || !cloudManager.hasFullVersionEntitlement)
        $(".cloud-connection-status-header-mobile").addClass("d-none");
      if (cloudManager.isTest && accessCheck) {
        if (!confirmedLoaded) $("#m-page-loader-test").attr("class", "show");
        $("#m-page-loader").attr("class", "d-none");
      } else {
        errorNum = "4";
        $("#character-selection-page-8").addClass("d-none");
        if (
          localStorage.getItem("language") !== undefined &&
          localStorage.getItem("language") !== null &&
          currentStartPage !== 9
        ) {
          $("#character-selection-page-0").removeClass("d-none");
          currentStartPage = 0;
        }
        updateUIForLanguageChange();
        updateUIForAnnouncements();
        errorNum = "8";
        if (!nativeManager.isMobile) {
          $("#minibar-quick-equip")
            .on("mouseover", function () {
              $("#skill-footer-minibar-items-container").removeClass("d-none");
            })
            .on("mouseout", function () {
              quickEquipInterval = setInterval(function () {
                if (
                  !$("#skill-footer-minibar-items-container:hover").length &&
                  !$("#minibar-quick-equip:hover").length
                ) {
                  $("#skill-footer-minibar-items-container").addClass("d-none");
                  clearInterval(quickEquipInterval);
                }
              }, 500);
            });
        }
        errorNum = "9";
        errorNum = "10";
        if (cloudManager.isTest)
          (_a = sidebar.category("Test Environment").rootEl) === null ||
          _a === void 0
            ? void 0
            : _a.classList.remove("d-none");
        ifvisible.on("blur", function () {
          if (confirmedLoaded && inFocus) game.combat.player.stopHoldToEat();
          if (
            confirmedLoaded &&
            (game.settings.pauseOnUnfocus || nativeManager.isMobile) &&
            !game.isGolbinRaid &&
            inFocus &&
            location.origin !== "https://steam.melvoridle.com" &&
            game.tutorial.complete
          ) {
            inFocus = false;
            game.pauseActiveSkill(true);
          }
        });
        ifvisible.on("focus", function () {
          if (
            confirmedLoaded &&
            (game.settings.pauseOnUnfocus || nativeManager.isMobile) &&
            !game.isGolbinRaid &&
            !inFocus &&
            location.origin !== "https://steam.melvoridle.com" &&
            game.tutorial.complete
          ) {
            inFocus = true;
            game.unpauseActiveSkill(true);
          }
        });
        $(window).bind("beforeunload", function (event) {
          if (!game.settings.enableOfflineCombat && characterSelected) {
            if (game.combat.isActive) game.combat.stop();
          }
          if (!game.tutorial.complete) game.stopActiveAction();
          if (
            !dataDeleted &&
            characterSelected &&
            (getItem("MI-forceReload-") === undefined ||
              getItem("MI-forceReload-") === null)
          ) {
            saveData();
          }
          clearTimeout(tenSecondUpdateTimeout);
          if (
            game.settings.showCloseConfirmations &&
            location.origin !== "https://steam.melvoridle.com/"
          )
            return getLangString("CHARACTER_SELECT", "97");
        });
        errorNum = "12";
        $("body").on("swipeleft", function () {
          const mq = checkMediaQuery("(max-width: 991px)");
          if (mq && !disableSwipeEvents) One._uiApiLayout("sidebar_close");
        });
        $("body").on("swiperight", function () {
          const mq = checkMediaQuery("(max-width: 991px)");
          if (mq && !disableSwipeEvents && !disableSidebarSwipe)
            One._uiApiLayout("sidebar_open");
        });
      }
    } catch (e) {
      if (e instanceof Error)
        $("#on-load-error").html(
          "<span class='font-w700'>An error has occured loading the game:<br>If you are on Android, please clear your app cache in hopes to remove this error.</span><br>" +
            e.message +
            "<br>" +
            e.stack
        );
    }
  }
};
window.onload = function () {
  return __awaiter(this, void 0, void 0, function* () {
    let langToSet = "en";
    $(".language-select").removeClass("d-none");
    if (
      localStorage.getItem("language") !== undefined &&
      localStorage.getItem("language") !== null
    )
      langToSet = localStorage.getItem("language");
    else {
      cloudManager.hidePageLoader();
      if (cloudManager.isOnAuthPage) cloudManager.showLanguageSelection();
      else changePageCharacterSelection(9);
    }
    initLocalStorageSettings();
    if (!isIOS()) nativeManager.hideNativeIOSElements();
    if (!nativeManager.isAndroid) nativeManager.hideNativeAndroidElements();
    cloudManager.setStatus("Loading Language Data...");
    yield setLanguage(langToSet);
    yield cloudManager.initSilentSignIn();
  });
};
function confirmedAuthenticated() {
  let langToSet = "en";
  $(".language-select").removeClass("d-none");
  if (
    localStorage.getItem("language") !== undefined &&
    localStorage.getItem("language") !== null
  )
    langToSet = localStorage.getItem("language");
  else changePageCharacterSelection(9);
  initLocalStorageSettings();
  setLanguage(langToSet).then(() => {
    onloadEvent(false);
  });
}
function checkIfAuthenticated() {
  return __awaiter(this, void 0, void 0, function* () {
    const isAuthenticated = yield cloudManager.checkAuthentication();
    if (!isAuthenticated) $("#m-page-loader").attr("class", "d-none");
    else confirmedAuthenticated();
  });
}
const INTERFACE_VERSION = 24;
function loadGameInterface(accessCheck = false) {
  return new Promise((resolve, reject) => {
    const onLoadCallback = (_, textStatus, xQR) =>
      __awaiter(this, void 0, void 0, function* () {
        if (textStatus === "success") {
          yield mod.trigger.interfaceAvailable();
          initMenus();
          onloadEvent(false);
          resolve();
        } else {
          reject(`Error: ${xQR.status}. Failed to load game content.`);
        }
      });
    if (location.pathname.includes("index_mobile.php")) {
      $("#page-container").load(
        `pageContainer_mobile.php?${INTERFACE_VERSION}`,
        onLoadCallback
      );
    } else {
      $("#page-container").load(
        `pageContainer.php?${INTERFACE_VERSION}`,
        onLoadCallback
      );
    }
  });
}
const DATA_VERSION = 93;
function loadGameData() {
  return __awaiter(this, void 0, void 0, function* () {
    yield game.fetchAndRegisterDataPackage(
      `assets/data/melvorDemo.json?${DATA_VERSION}`
    );
    console.log("Registered Demo Data.");
    if (cloudManager.hasFullVersionEntitlement) {
      yield game.fetchAndRegisterDataPackage(
        `assets/data/melvorFull.json?${DATA_VERSION}`
      );
      console.log("Registered Full Version Data.");
      if (cloudManager.hasTotHEntitlement) {
        yield game.fetchAndRegisterDataPackage(
          `assets/data/melvorTotH.json?${DATA_VERSION}`
        );
        console.log("Registered Throne of the Herald Data.");
      }
    }
  });
}
function changePageCharacterSelection(page) {
  if (currentStartPage !== page) {
    if (page !== 3) setNewStartPage(page);
    if (page === 1) enableLoginForm();
  }
}
function updateUIForAnnouncements() {}
function hideUIForAnnouncement(id) {}
const maxSaveSlots = 6;
function updateLocalSaveHeaders() {
  return __awaiter(this, void 0, void 0, function* () {
    for (let slotID = 0; slotID < maxSaveSlots; slotID++) {
      const saveString = getLocalSaveString(true, slotID);
      if (saveString === "") {
        localSaveHeaders[slotID] = 0;
      } else {
        localSaveHeaders[slotID] = yield game.getHeaderFromSaveString(
          saveString
        );
      }
    }
  });
}
function updateCloudSaveHeaders() {
  return __awaiter(this, void 0, void 0, function* () {
    for (let slotID = 0; slotID < maxSaveSlots; slotID++) {
      const saveString = cloudManager.getPlayFabSave(slotID);
      if (saveString === "") {
        cloudSaveHeaders[slotID] = 0;
      } else {
        cloudSaveHeaders[slotID] = yield game.getHeaderFromSaveString(
          saveString
        );
      }
    }
  });
}
let isLoadingSave = false;
let isCreatingSave = false;
function loadSaveFromString(saveString) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      yield loadGameInterface(cloudManager.isTest);
    } catch (e) {
      throw new Error("Interface failed to load.");
    }
    let loadedOldFormatLocalSave = false;
    try {
      const reader = new SaveWriter("Read", 1);
      const saveVersion = reader.setDataFromSaveString(saveString);
      if (saveVersion > currentSaveVersion) {
        throw new Error("Invalid save version.");
      } else {
        game.decode(reader, saveVersion);
      }
    } catch (e) {
      if (e instanceof Error && e.message === "String is not save.") {
        try {
          const idMap = yield getNumericIDMap();
          const { saveGame, oldFormat } = getSaveFromString(saveString, idMap);
          yield loadOldSaveGame(saveGame);
          if (oldFormat) {
            loadedOldFormatLocalSave = true;
          }
        } catch (e) {
          console.error(e);
          throw new Error("Corrupt Save.");
        }
      } else {
        console.error(e);
        throw new Error("Corrupt Save.");
      }
    }
    onSaveDataLoad();
  });
}
function processSaveLoadError(slotID, isCloud, error) {
  if (error instanceof Error) {
    showSaveLoadingError(slotID, error.message, isCloud);
    switch (error.message) {
      case "Corrupt Save.":
        break;
      case "Invalid save version.":
        break;
      default:
        break;
    }
  } else {
    showSaveLoadingError(slotID, "Unknown Error Loading Save.", isCloud);
  }
}
function loadLocalSave(slotID) {
  return __awaiter(this, void 0, void 0, function* () {
    if (isLoadingSave) return;
    isLoadingSave = true;
    currentCharacter = slotID;
    updateKeys();
    const saveString = getLocalSaveString(true, slotID);
    if (saveString === "") {
      showSaveLoadingError(slotID, "Error: Local Save Does not exist.", false);
    } else {
      try {
        yield loadSaveFromString(saveString);
      } catch (e) {
        processSaveLoadError(slotID, false, e);
      }
    }
  });
}
function loadCloudSave(slotID) {
  return __awaiter(this, void 0, void 0, function* () {
    if (isLoadingSave) return;
    isLoadingSave = true;
    currentCharacter = slotID;
    updateKeys();
    const saveString = cloudManager.getPlayFabSave(slotID);
    if (saveString === "") {
      showSaveLoadingError(slotID, "Error: Cloud Save Does not exist.", true);
    } else {
      try {
        yield loadSaveFromString(saveString);
      } catch (e) {
        processSaveLoadError(slotID, true, e);
      }
    }
  });
}
function createNewCharacterInSlot(slotID, gamemode, characterName) {
  return __awaiter(this, void 0, void 0, function* () {
    if (isLoadingSave) return;
    isLoadingSave = true;
    isCreatingSave = true;
    currentCharacter = slotID;
    updateKeys();
    deleteLocalSaveInSlot();
    dataDeleted = true;
    try {
      yield loadGameInterface(cloudManager.isTest);
    } catch (e) {
      throw new Error("Interface failed to load.");
    }
    game.characterName = characterName;
    game.currentGamemode = gamemode;
    game.combat.player.hitpoints = 10 * gamemode.hitpointMultiplier;
    game.combat.player.setDefaultAttackStyles();
    game.combat.player.setDefaultSpells();
    game.golbinRaid.player.setDefaultAttackStyles();
    game.golbinRaid.player.setDefaultSpells();
    onSaveDataLoad();
    dataDeleted = false;
    saveData();
  });
}
