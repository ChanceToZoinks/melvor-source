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
let setLang = "en";
let loadedLangJson;
const langVersion = 624;
const LANGS = [
  "en",
  "zh-CN",
  "zh-TW",
  "fr",
  "de",
  "it",
  "ko",
  "ja",
  "pt",
  "pt-br",
  "es",
  "ru",
  "tr",
  "lemon",
];
function fetchLanguageJSON(lang) {
  return __awaiter(this, void 0, void 0, function* () {
    const URL = `./lang/${lang}.json?${langVersion}`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = yield fetch(URL, { method: "GET", headers: headers });
    if (!response.ok) throw new Error(`Could not fetch file: ${URL}`);
    return yield response.json();
  });
}
function setLanguage(lang) {
  return __awaiter(this, void 0, void 0, function* () {
    if (!LANGS.includes(lang)) lang = LANGS[0];
    localStorage.setItem("language", lang);
    yield fetchLanguageJSON(lang).then(
      (json) => {
        loadedLangJson = json;
        setLang = lang;
        updateUIForLanguageChange();
      },
      (error) => {
        console.error(error);
      }
    );
  });
}
function localiseSwal2() {
  if (setLang !== "en") {
    $(".swal2-confirm").text(getLangString("CHARACTER_SELECT", "42"));
    $(".swal2-cancel").text(getLangString("CHARACTER_SELECT", "45"));
  }
}
let SwalLocale = Swal.mixin({
  didOpen: () => {
    localiseSwal2();
  },
  customClass: {
    container: "swal-infront",
    confirmButton: "btn btn-primary m-1",
    denyButton: "btn btn-secondary m-1",
    cancelButton: "btn btn-danger m-1",
  },
  buttonsStyling: false,
});
function updateUIForLanguageChange() {
  SwalLocale = Swal.mixin({
    customClass: {
      container: "swal-infront",
      confirmButton: "btn btn-primary m-1",
      denyButton: "btn btn-secondary m-1",
      cancelButton: "btn btn-danger m-1",
    },
    buttonsStyling: false,
    confirmButtonText: getLangString("CHARACTER_SELECT", "42"),
    cancelButtonText: getLangString("CHARACTER_SELECT", "45"),
  });
  $(".page-nav-name-misc-modding").text(
    getLangString("MOD_MANAGER", "MODDING")
  );
  $(".page-nav-name-misc-mod-manager").text(
    getLangString("MOD_MANAGER", "MOD_MANAGER")
  );
  $(".page-nav-name-misc-mod-settings").text(
    getLangString("MOD_MANAGER", "MOD_SETTINGS")
  );
  $(".placeholder-username").attr(
    "placeholder",
    getLangString("CHARACTER_SELECT", "16")
  );
  $(".placeholder-password").attr(
    "placeholder",
    getLangString("CHARACTER_SELECT", "17")
  );
  $(".placeholder-confirm-password").attr(
    "placeholder",
    getLangString("CHARACTER_SELECT", "22")
  );
  $(".placeholder-email").attr(
    "placeholder",
    getLangString("CHARACTER_SELECT", "21")
  );
  $(".toth-lang-cta").text(getLangString("IAP", "BUY_TOTH"));
  if (isLoaded) {
    woodcuttingMenu.localize();
    smithingCategoryMenu.localize();
    smithingArtisanMenu.localize();
    smithingSelectionTabs.forEach((tab) => tab.localize());
    fletchingCategoryMenu.localize();
    fletchingArtisanMenu.localize();
    fletchingSelectionTabs.forEach((tab) => tab.localize());
    craftingCategoryMenu.localize();
    craftingArtisanMenu.localize();
    craftingSelectionTabs.forEach((tab) => tab.localize());
    runecraftingCategoryMenu.localize();
    runecraftingArtisanMenu.localize();
    runecraftingSelectionTabs.forEach((tab) => tab.localize());
    herbloreCategoryMenu.localize();
    herbloreArtisanMenu.localize();
    herbloreSelectionTabs.forEach((tab) => tab.localize());
    altMagicSelection.localize();
    thievingMenu.localize();
    localizeMining();
    game.firemaking.localize();
    localizeSummoning();
    localizeSettings();
    cookingMenus.forEach((menu) => menu.localize());
    $(".lang-bank-string-55").html(getLangString("BANK_STRING", 55));
    $(".lang-bank-string-56").html(getLangString("BANK_STRING", 56));
    $(".lang-bank-string-57").html(getLangString("BANK_STRING", 57));
    statTables.forEach((table) => table.localize());
    $(".placeholder-search-bank").attr(
      "placeholder",
      getLangString("BANK_STRING", "5")
    );
    $(".placeholder-exported-save").attr(
      "placeholder",
      getLangString("MENU_TEXT", "PLACEHOLDER_EXPORTED_SAVE")
    );
    $(".placeholder-sell-x").attr(
      "placeholder",
      getLangString("MENU_TEXT", "PLACEHOLDER_SELL_X")
    );
    $(".lang-minibar-you").html(
      templateString(getLangString("MENU_TEXT", "MINIBAR_YOU"), { hpValue: `` })
    );
    $(".lang-minibar-enemy").html(
      templateString(getLangString("MENU_TEXT", "MINIBAR_ENEMY"), {
        hpValue: ``,
      })
    );
    $(".lang-bank-59").html(
      templateString(getLangString("BANK_STRING", "59"), { bankSpace: `` })
    );
    if (setLang !== "en") {
      $(".alt-desc").addClass("d-none");
      $(".hide-non-en").addClass("d-none");
    }
  }
  if (window.customElements.get("lang-string")) {
    const langStrings = document.getElementsByTagName("lang-string");
    for (let i = 0; i < langStrings.length; i++) {
      langStrings[i].updateTranslation();
    }
  } else {
    window.customElements.define("lang-string", LangString);
  }
}
function getLangString(key, identifier) {
  const category = loadedLangJson[key];
  if (category === undefined) {
    if (DEBUGENABLED) {
      console.warn(`Tried to get unknown language category: ${key}`);
    }
    return `UNDEFINED TRANSLATION CATEGORY: ${key}`;
  }
  const translation = category[identifier];
  if (translation === undefined || translation === "") {
    if (DEBUGENABLED) {
      console.warn(
        `Tried to get unknown language string: ${key}:${identifier}`
      );
    }
    return `UNDEFINED TRANSLATION: ${key}:${identifier}`;
  }
  return translation;
}
