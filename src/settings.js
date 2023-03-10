"use strict";
class DefaultPageOption {
  constructor(value) {
    this.value = value;
  }
  get name() {
    return this.value.name;
  }
  get media() {
    if (this.value.action !== undefined) return this.value.action.media;
    return this.value.media;
  }
}
class Settings {
  constructor(game) {
    this.game = game;
    this.boolData = {
      continueIfBankFull: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("SETTINGS", "SETTING_1_0");
        },
        saveOnChange: false,
      },
      continueThievingOnStun: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("SETTINGS", "SETTING_1_1");
        },
        saveOnChange: false,
      },
      autoRestartDungeon: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_1_2");
        },
        saveOnChange: false,
      },
      autoCloudSave: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("CHARACTER_SELECT", "80");
        },
        saveOnChange: false,
      },
      darkMode: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_5_3");
        },
        onChange: (oldValue, newValue) => {
          if (newValue) {
            document.body.classList.add("darkMode");
            $("#first-time-btn-light").attr("class", "btn btn-outline-info");
          } else {
            document.body.classList.remove("darkMode");
            $("#first-time-btn-light").attr("class", "btn btn-info");
          }
        },
        saveOnChange: false,
      },
      showGPNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_3");
        },
        saveOnChange: false,
      },
      enableAccessibility: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("SETTINGS", "SETTING_5_7");
        },
        saveOnChange: true,
      },
      showEnemySkillLevels: {
        currentValue: false,
        defaultValue: false,
        name: "Show Enemy Skill Levels",
        onChange: (oldValue, newValue) => {
          if (newValue) {
            $("#combat-enemy-stats").removeClass("d-none");
          } else {
            $("#combat-enemy-stats").addClass("d-none");
          }
        },
        saveOnChange: true,
      },
      showCloseConfirmations: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_8");
        },
        saveOnChange: true,
      },
      hideThousandsSeperator: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return `${getLangString(
            "SETTINGS",
            "SETTING_5_5"
          )}<br><small>${getLangString("SETTINGS", "SETTING_5_6")}</small>`;
        },
        saveOnChange: true,
      },
      showVirtualLevels: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("SETTINGS", "SETTING_1_3");
        },
        onChange: (oldValue, newValue) => {
          this.game.skills.forEach((skill) => {
            skill.renderQueue.level = true;
            skill.renderQueue.xp = true;
          });
        },
        saveOnChange: true,
      },
      showSaleConfirmations: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_0");
        },
        saveOnChange: true,
      },
      showShopConfirmations: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_1");
        },
        saveOnChange: true,
      },
      pauseOnUnfocus: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_1_5");
        },
        saveOnChange: true,
      },
      showCombatMinibar: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_4_1");
        },
        onChange: (oldValue, newValue) => {
          if (
            newValue &&
            ((this.game.isGolbinRaid && this.game.golbinRaid.isActive) ||
              (!this.game.isGolbinRaid && this.game.combat.isActive))
          ) {
            $("#combat-footer-minibar").removeClass("d-none");
          } else {
            $("#combat-footer-minibar").addClass("d-none");
          }
        },
        saveOnChange: true,
      },
      showCombatMinibarCombat: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_4_2");
        },
        saveOnChange: true,
      },
      showSkillingMinibar: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_4_0");
        },
        saveOnChange: true,
      },
      useCombinationRunes: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("MENU_TEXT", "USE_COMBINATION_RUNES");
        },
        onChange: (oldValue, newValue) => {
          this.game.combat.player.rendersRequired.runesUsed = true;
          this.game.altMagic.onComboRunesChange();
        },
        saveOnChange: false,
      },
      enableAutoSlayer: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("COMBAT_MISC", "30");
        },
        saveOnChange: false,
      },
      showItemNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_2");
        },
        saveOnChange: false,
      },
      useSmallLevelUpNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_5_1");
        },
        saveOnChange: false,
      },
      useDefaultBankBorders: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("BANK_STRING", "11");
        },
        onChange: (oldValue, newValue) => {
          this.game.bank.updateItemBorders();
        },
        saveOnChange: true,
      },
      defaultToCurrentEquipSet: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("BANK_STRING", "10");
        },
        saveOnChange: true,
      },
      hideMaxLevelMasteries: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("MENU_TEXT", "HIDE_99");
        },
        onChange: () => {
          spendMasteryMenu.toggleHideLevel99();
        },
        saveOnChange: true,
      },
      showMasteryCheckpointconfirmations: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_4");
        },
        saveOnChange: true,
      },
      enableOfflinePushNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_3_0");
        },
        saveOnChange: true,
      },
      enableFarmingPushNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_3_1");
        },
        saveOnChange: true,
      },
      enableOfflineCombat: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return `${getLangString(
            "SETTINGS",
            "SETTING_0_0"
          )}<br><small>${getLangString("SETTINGS", "SETTING_0_1")}</small>`;
        },
        shouldChange: (oldValue, newValue) => {
          const canChange =
            oldValue || offlineCombatChecks.every((check) => check);
          if (!canChange) {
            $("#modal-offline-combat-warning").modal("show");
          }
          return canChange;
        },
        saveOnChange: true,
      },
      enableMiniSidebar: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("SETTINGS", "SETTING_5_2");
        },
        onChange: (oldValue, newValue) => {
          if (newValue) {
            One.layout("sidebar_mini_on");
          } else {
            One.layout("sidebar_mini_off");
          }
        },
        saveOnChange: false,
      },
      enableAutoEquipFood: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_MISC_0");
        },
        saveOnChange: true,
      },
      enableAutoSwapFood: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("COMBAT_MISC", "121");
        },
        saveOnChange: true,
      },
      enablePerfectCooking: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_MISC_1");
        },
        onChange: (oldValue, newValue) => {
          this.game.cooking.renderQueue.recipeRates = true;
        },
        saveOnChange: true,
      },
      showCropDestructionConfirmations: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_9");
        },
        saveOnChange: true,
      },
      showAstrologyMaxRollConfirmations: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_10");
        },
        saveOnChange: true,
      },
      showQuantityInItemNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_11");
        },
        saveOnChange: true,
      },
      showItemPreservationNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_12");
        },
        saveOnChange: true,
      },
      showSlayerCoinNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_13");
        },
        saveOnChange: true,
      },
      showEquipmentSetsInCombatMinibar: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_4_3");
        },
        onChange: (oldValue, newValue) => {
          if (newValue) {
            $(".combatMinibarShowEquipmentSets").removeClass("d-none");
          } else {
            $(".combatMinibarShowEquipmentSets").addClass("d-none");
          }
        },
        saveOnChange: true,
      },
      showBarsInCombatMinibar: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_4_4");
        },
        onChange: (oldValue, newValue) => {
          if (newValue) {
            $(".combatMinibarShowEnemyBars").removeClass("d-none");
          } else {
            $(".combatMinibarShowEnemyBars").addClass("d-none");
          }
        },
        saveOnChange: true,
      },
      showCombatStunNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_5");
        },
        saveOnChange: true,
      },
      showCombatSleepNotifications: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_6");
        },
        saveOnChange: true,
      },
      showSummoningMarkDiscoveryModals: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_2_7");
        },
        saveOnChange: true,
      },
      enableCombatDamageSplashes: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_6_0");
        },
        saveOnChange: true,
      },
      enableProgressBars: {
        currentValue: true,
        defaultValue: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_6_1");
        },
        saveOnChange: true,
      },
      showTierIPotions: {
        currentValue: true,
        defaultValue: true,
        name: "I",
        onChange: () => {
          var _a;
          if (
            ((_a = this.game.openPage) === null || _a === void 0
              ? void 0
              : _a.action) !== undefined
          )
            this.game.potions.openPotionSelectOnClick(
              this.game.openPage.action
            );
        },
        saveOnChange: true,
      },
      showTierIIPotions: {
        currentValue: true,
        defaultValue: true,
        name: "II",
        onChange: () => {
          var _a;
          if (
            ((_a = this.game.openPage) === null || _a === void 0
              ? void 0
              : _a.action) !== undefined
          )
            this.game.potions.openPotionSelectOnClick(
              this.game.openPage.action
            );
        },
        saveOnChange: true,
      },
      showTierIIIPotions: {
        currentValue: true,
        defaultValue: true,
        name: "III",
        onChange: () => {
          var _a;
          if (
            ((_a = this.game.openPage) === null || _a === void 0
              ? void 0
              : _a.action) !== undefined
          )
            this.game.potions.openPotionSelectOnClick(
              this.game.openPage.action
            );
        },
        saveOnChange: true,
      },
      showTierIVPotions: {
        currentValue: true,
        defaultValue: true,
        name: "IV",
        onChange: () => {
          var _a;
          if (
            ((_a = this.game.openPage) === null || _a === void 0
              ? void 0
              : _a.action) !== undefined
          )
            this.game.potions.openPotionSelectOnClick(
              this.game.openPage.action
            );
        },
        saveOnChange: true,
      },
      enableEyebleachMode: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("SETTINGS", "TOGGLE_EYEBLEACH");
        },
        saveOnChange: true,
      },
      enableQuickConvert: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return "Enable Quick Convert?";
        },
        saveOnChange: true,
      },
      showLockedTownshipBuildings: {
        currentValue: false,
        defaultValue: false,
        get name() {
          return getLangString("TOWNSHIP_MENU", "SHOW_LOCKED_BUILDINGS");
        },
        onChange: () => {
          townshipUI.updateBuildingsForBiomeSelection();
        },
        saveOnChange: true,
      },
    };
    this.choiceData = {
      showNeutralAttackModifiers: {
        currentValue: false,
        defaultValue: false,
        saveOnChange: true,
        get name() {
          return `${getLangString(
            "SETTINGS",
            "SETTING_0_2"
          )}<br><small>${getLangString("SETTINGS", "SETTING_0_3")}</small>`;
        },
        options: [
          {
            value: false,
            get name() {
              return getLangString("SETTINGS", "SETTING_0_4");
            },
          },
          {
            value: true,
            get name() {
              return `<span class="text-warning">${getLangString(
                "SETTINGS",
                "SETTING_0_5"
              )}</span>`;
            },
          },
        ],
        onChange: (oldValue, newValue) => {
          if (this.game.isGolbinRaid) {
            this.game.golbinRaid.player.rendersRequired.effects = true;
            if (selectedSpellbook === "aurora")
              this.game.golbinRaid.rendersRequired.spellBook = true;
          } else {
            this.game.combat.player.rendersRequired.effects = true;
            if (selectedSpellbook === "aurora")
              this.game.combat.rendersRequired.spellBook = true;
          }
        },
      },
      defaultPageOnLoad: {
        currentValue: this.game.activeActionPage,
        defaultValue: this.game.activeActionPage,
        saveOnChange: true,
        get name() {
          return getLangString("SETTINGS", "SETTING_5_0");
        },
        options: [],
        shouldChange: (oldValue, newValue) => {
          if (newValue.action !== undefined) {
            const action = newValue.action;
            if (action instanceof Skill) {
              if (action.isUnlocked) return true;
              SwalLocale.fire({
                icon: "error",
                title: getLangString("MENU_TEXT", "SKILL_LOCKED"),
                html: `<span class='text-dark'>${getLangString(
                  "MENU_TEXT",
                  "SKILL_UNLOCK_DEFAULT_PAGE"
                )}</span>`,
              });
              return false;
            }
          }
          return true;
        },
      },
      formatNumberSetting: {
        currentValue: 0,
        defaultValue: 0,
        saveOnChange: true,
        get name() {
          return `${getLangString(
            "SETTINGS",
            "SETTING_5_4"
          )}<br><small>${getLangString("SETTINGS", "SETTING_5_6")}</small>`;
        },
        options: [
          {
            value: 0,
            get name() {
              return `1,000${getLangString("NUM", "K")}`;
            },
          },
          {
            value: 1,
            get name() {
              return `1${getLangString("NUM", "M")}`;
            },
          },
        ],
      },
      bankSortOrder: {
        currentValue: 0,
        defaultValue: 0,
        saveOnChange: true,
        get name() {
          return getLangString("BANK_STRING", "12");
        },
        options: [
          {
            value: 0,
            get name() {
              return getLangString("BANK_STRING", "14");
            },
          },
          {
            value: 5,
            get name() {
              return getLangString("BANK_STRING", "42");
            },
          },
          {
            value: 1,
            get name() {
              return getLangString("BANK_STRING", "15");
            },
          },
          {
            value: 2,
            get name() {
              return getLangString("BANK_STRING", "16");
            },
          },
          {
            value: 3,
            get name() {
              return getLangString("BANK_STRING", "17");
            },
          },
          {
            value: 4,
            get name() {
              return getLangString("BANK_STRING", "18");
            },
          },
        ],
      },
      colourBlindMode: {
        currentValue: 0,
        defaultValue: 0,
        saveOnChange: true,
        name: "Colour Blindness Mode",
        options: [
          { value: 0, name: "None" },
          { value: 1, name: "Red-Green" },
        ],
        onChange: (oldValue, newValue) => {
          if (oldValue !== 0) {
            document.body.classList.remove(colourBlindClasses[oldValue]);
          }
          if (newValue !== 0) {
            document.body.classList.add(colourBlindClasses[newValue]);
          }
        },
      },
    };
  }
  get continueIfBankFull() {
    return this.boolData.continueIfBankFull.currentValue;
  }
  get continueThievingOnStun() {
    return this.boolData.continueThievingOnStun.currentValue;
  }
  get autoRestartDungeon() {
    return this.boolData.autoRestartDungeon.currentValue;
  }
  get autoCloudSave() {
    return this.boolData.autoCloudSave.currentValue;
  }
  get darkMode() {
    return this.boolData.darkMode.currentValue;
  }
  get showGPNotifications() {
    return this.boolData.showGPNotifications.currentValue;
  }
  get enableAccessibility() {
    return this.boolData.enableAccessibility.currentValue;
  }
  get showEnemySkillLevels() {
    return this.boolData.showEnemySkillLevels.currentValue;
  }
  get showCloseConfirmations() {
    return this.boolData.showCloseConfirmations.currentValue;
  }
  get hideThousandsSeperator() {
    return this.boolData.hideThousandsSeperator.currentValue;
  }
  get showVirtualLevels() {
    return this.boolData.showVirtualLevels.currentValue;
  }
  get showSaleConfirmations() {
    return this.boolData.showSaleConfirmations.currentValue;
  }
  get showShopConfirmations() {
    return this.boolData.showShopConfirmations.currentValue;
  }
  get pauseOnUnfocus() {
    return this.boolData.pauseOnUnfocus.currentValue;
  }
  get showCombatMinibar() {
    return this.boolData.showCombatMinibar.currentValue;
  }
  get showCombatMinibarCombat() {
    return this.boolData.showCombatMinibarCombat.currentValue;
  }
  get showSkillingMinibar() {
    return this.boolData.showSkillingMinibar.currentValue;
  }
  get useCombinationRunes() {
    return this.boolData.useCombinationRunes.currentValue;
  }
  get enableAutoSlayer() {
    return this.boolData.enableAutoSlayer.currentValue;
  }
  get useDefaultBankBorders() {
    return this.boolData.useDefaultBankBorders.currentValue;
  }
  get defaultToCurrentEquipSet() {
    return this.boolData.defaultToCurrentEquipSet.currentValue;
  }
  get hideMaxLevelMasteries() {
    return this.boolData.hideMaxLevelMasteries.currentValue;
  }
  get showMasteryCheckpointconfirmations() {
    return this.boolData.showMasteryCheckpointconfirmations.currentValue;
  }
  get enableOfflinePushNotifications() {
    return this.boolData.enableOfflinePushNotifications.currentValue;
  }
  get enableFarmingPushNotifications() {
    return this.boolData.enableFarmingPushNotifications.currentValue;
  }
  get enableOfflineCombat() {
    return this.boolData.enableOfflineCombat.currentValue;
  }
  get showNeutralAttackModifiers() {
    return this.choiceData.showNeutralAttackModifiers.currentValue;
  }
  get enableMiniSidebar() {
    return this.boolData.enableMiniSidebar.currentValue;
  }
  get enableAutoEquipFood() {
    return this.boolData.enableAutoEquipFood.currentValue;
  }
  get enableAutoSwapFood() {
    return this.boolData.enableAutoSwapFood.currentValue;
  }
  get enablePerfectCooking() {
    return this.boolData.enablePerfectCooking.currentValue;
  }
  get showCropDestructionConfirmations() {
    return this.boolData.showCropDestructionConfirmations.currentValue;
  }
  get showAstrologyMaxRollConfirmations() {
    return this.boolData.showAstrologyMaxRollConfirmations.currentValue;
  }
  get showQuantityInItemNotifications() {
    return this.boolData.showQuantityInItemNotifications.currentValue;
  }
  get showItemPreservationNotifications() {
    return this.boolData.showItemPreservationNotifications.currentValue;
  }
  get showSlayerCoinNotifications() {
    return this.boolData.showSlayerCoinNotifications.currentValue;
  }
  get showEquipmentSetsInCombatMinibar() {
    return this.boolData.showEquipmentSetsInCombatMinibar.currentValue;
  }
  get showBarsInCombatMinibar() {
    return this.boolData.showBarsInCombatMinibar.currentValue;
  }
  get showCombatStunNotifications() {
    return this.boolData.showCombatStunNotifications.currentValue;
  }
  get showCombatSleepNotifications() {
    return this.boolData.showCombatSleepNotifications.currentValue;
  }
  get showSummoningMarkDiscoveryModals() {
    return this.boolData.showSummoningMarkDiscoveryModals.currentValue;
  }
  get enableCombatDamageSplashes() {
    return this.boolData.enableCombatDamageSplashes.currentValue;
  }
  get enableProgressBars() {
    return this.boolData.enableProgressBars.currentValue;
  }
  get showItemNotifications() {
    return this.boolData.showItemNotifications.currentValue;
  }
  get useSmallLevelUpNotifications() {
    return this.boolData.useSmallLevelUpNotifications.currentValue;
  }
  get showTierIPotions() {
    return this.boolData.showTierIPotions.currentValue;
  }
  get showTierIIPotions() {
    return this.boolData.showTierIIPotions.currentValue;
  }
  get showTierIIIPotions() {
    return this.boolData.showTierIIIPotions.currentValue;
  }
  get showTierIVPotions() {
    return this.boolData.showTierIVPotions.currentValue;
  }
  get showPotionTiers() {
    return [
      this.showTierIPotions,
      this.showTierIIPotions,
      this.showTierIIIPotions,
      this.showTierIVPotions,
    ];
  }
  get enableEyebleachMode() {
    return this.boolData.enableEyebleachMode.currentValue;
  }
  get enableQuickConvert() {
    return this.boolData.enableQuickConvert.currentValue;
  }
  get showLockedTownshipBuildings() {
    return this.boolData.showLockedTownshipBuildings.currentValue;
  }
  get defaultPageOnLoad() {
    return this.choiceData.defaultPageOnLoad.currentValue;
  }
  get formatNumberSetting() {
    return this.choiceData.formatNumberSetting.currentValue;
  }
  get bankSortOrder() {
    return this.choiceData.bankSortOrder.currentValue;
  }
  get colourBlindMode() {
    return this.choiceData.colourBlindMode.currentValue;
  }
  postDataRegistration() {
    const defaultPages = this.game.pages.filter((page) => page.canBeDefault);
    this.choiceData.defaultPageOnLoad.options = defaultPages.map((page) => {
      return new DefaultPageOption(page);
    });
  }
  encode(writer) {
    writer.writeBoolean(this.boolData.continueIfBankFull.currentValue);
    writer.writeBoolean(this.boolData.continueThievingOnStun.currentValue);
    writer.writeBoolean(this.boolData.autoRestartDungeon.currentValue);
    writer.writeBoolean(this.boolData.autoCloudSave.currentValue);
    writer.writeBoolean(this.boolData.darkMode.currentValue);
    writer.writeBoolean(this.boolData.showGPNotifications.currentValue);
    writer.writeBoolean(this.boolData.enableAccessibility.currentValue);
    writer.writeBoolean(this.boolData.showEnemySkillLevels.currentValue);
    writer.writeBoolean(this.boolData.showCloseConfirmations.currentValue);
    writer.writeBoolean(this.boolData.hideThousandsSeperator.currentValue);
    writer.writeBoolean(this.boolData.showVirtualLevels.currentValue);
    writer.writeBoolean(this.boolData.showSaleConfirmations.currentValue);
    writer.writeBoolean(this.boolData.showShopConfirmations.currentValue);
    writer.writeBoolean(this.boolData.pauseOnUnfocus.currentValue);
    writer.writeBoolean(this.boolData.showCombatMinibar.currentValue);
    writer.writeBoolean(this.boolData.showCombatMinibarCombat.currentValue);
    writer.writeBoolean(this.boolData.showSkillingMinibar.currentValue);
    writer.writeBoolean(this.boolData.useCombinationRunes.currentValue);
    writer.writeBoolean(this.boolData.enableAutoSlayer.currentValue);
    writer.writeBoolean(this.boolData.showItemNotifications.currentValue);
    writer.writeBoolean(
      this.boolData.useSmallLevelUpNotifications.currentValue
    );
    writer.writeBoolean(this.boolData.useDefaultBankBorders.currentValue);
    writer.writeBoolean(this.boolData.defaultToCurrentEquipSet.currentValue);
    writer.writeBoolean(this.boolData.hideMaxLevelMasteries.currentValue);
    writer.writeBoolean(
      this.boolData.showMasteryCheckpointconfirmations.currentValue
    );
    writer.writeBoolean(
      this.boolData.enableOfflinePushNotifications.currentValue
    );
    writer.writeBoolean(
      this.boolData.enableFarmingPushNotifications.currentValue
    );
    writer.writeBoolean(this.boolData.enableOfflineCombat.currentValue);
    writer.writeBoolean(this.boolData.enableMiniSidebar.currentValue);
    writer.writeBoolean(this.boolData.enableAutoEquipFood.currentValue);
    writer.writeBoolean(this.boolData.enableAutoSwapFood.currentValue);
    writer.writeBoolean(this.boolData.enablePerfectCooking.currentValue);
    writer.writeBoolean(
      this.boolData.showCropDestructionConfirmations.currentValue
    );
    writer.writeBoolean(
      this.boolData.showAstrologyMaxRollConfirmations.currentValue
    );
    writer.writeBoolean(
      this.boolData.showQuantityInItemNotifications.currentValue
    );
    writer.writeBoolean(
      this.boolData.showItemPreservationNotifications.currentValue
    );
    writer.writeBoolean(this.boolData.showSlayerCoinNotifications.currentValue);
    writer.writeBoolean(
      this.boolData.showEquipmentSetsInCombatMinibar.currentValue
    );
    writer.writeBoolean(this.boolData.showBarsInCombatMinibar.currentValue);
    writer.writeBoolean(this.boolData.showCombatStunNotifications.currentValue);
    writer.writeBoolean(
      this.boolData.showCombatSleepNotifications.currentValue
    );
    writer.writeBoolean(
      this.boolData.showSummoningMarkDiscoveryModals.currentValue
    );
    writer.writeBoolean(this.boolData.enableCombatDamageSplashes.currentValue);
    writer.writeBoolean(this.boolData.enableProgressBars.currentValue);
    writer.writeBoolean(this.boolData.showTierIPotions.currentValue);
    writer.writeBoolean(this.boolData.showTierIIPotions.currentValue);
    writer.writeBoolean(this.boolData.showTierIIIPotions.currentValue);
    writer.writeBoolean(this.boolData.showTierIVPotions.currentValue);
    writer.writeBoolean(
      this.choiceData.showNeutralAttackModifiers.currentValue
    );
    writer.writeNamespacedObject(
      this.choiceData.defaultPageOnLoad.currentValue
    );
    writer.writeUint8(this.choiceData.formatNumberSetting.currentValue);
    writer.writeUint8(this.choiceData.bankSortOrder.currentValue);
    writer.writeUint8(this.choiceData.colourBlindMode.currentValue);
    writer.writeBoolean(this.boolData.enableEyebleachMode.currentValue);
    writer.writeBoolean(this.boolData.enableQuickConvert.currentValue);
    writer.writeBoolean(this.boolData.showLockedTownshipBuildings.currentValue);
    return writer;
  }
  decode(reader, version) {
    this.boolData.continueIfBankFull.currentValue = reader.getBoolean();
    this.boolData.continueThievingOnStun.currentValue = reader.getBoolean();
    this.boolData.autoRestartDungeon.currentValue = reader.getBoolean();
    this.boolData.autoCloudSave.currentValue = reader.getBoolean();
    this.boolData.darkMode.currentValue = reader.getBoolean();
    this.boolData.showGPNotifications.currentValue = reader.getBoolean();
    this.boolData.enableAccessibility.currentValue = reader.getBoolean();
    this.boolData.showEnemySkillLevels.currentValue = reader.getBoolean();
    this.boolData.showCloseConfirmations.currentValue = reader.getBoolean();
    this.boolData.hideThousandsSeperator.currentValue = reader.getBoolean();
    this.boolData.showVirtualLevels.currentValue = reader.getBoolean();
    this.boolData.showSaleConfirmations.currentValue = reader.getBoolean();
    this.boolData.showShopConfirmations.currentValue = reader.getBoolean();
    this.boolData.pauseOnUnfocus.currentValue = reader.getBoolean();
    this.boolData.showCombatMinibar.currentValue = reader.getBoolean();
    this.boolData.showCombatMinibarCombat.currentValue = reader.getBoolean();
    this.boolData.showSkillingMinibar.currentValue = reader.getBoolean();
    this.boolData.useCombinationRunes.currentValue = reader.getBoolean();
    this.boolData.enableAutoSlayer.currentValue = reader.getBoolean();
    this.boolData.showItemNotifications.currentValue = reader.getBoolean();
    this.boolData.useSmallLevelUpNotifications.currentValue =
      reader.getBoolean();
    this.boolData.useDefaultBankBorders.currentValue = reader.getBoolean();
    this.boolData.defaultToCurrentEquipSet.currentValue = reader.getBoolean();
    this.boolData.hideMaxLevelMasteries.currentValue = reader.getBoolean();
    this.boolData.showMasteryCheckpointconfirmations.currentValue =
      reader.getBoolean();
    this.boolData.enableOfflinePushNotifications.currentValue =
      reader.getBoolean();
    this.boolData.enableFarmingPushNotifications.currentValue =
      reader.getBoolean();
    this.boolData.enableOfflineCombat.currentValue = reader.getBoolean();
    this.boolData.enableMiniSidebar.currentValue = reader.getBoolean();
    this.boolData.enableAutoEquipFood.currentValue = reader.getBoolean();
    this.boolData.enableAutoSwapFood.currentValue = reader.getBoolean();
    this.boolData.enablePerfectCooking.currentValue = reader.getBoolean();
    this.boolData.showCropDestructionConfirmations.currentValue =
      reader.getBoolean();
    this.boolData.showAstrologyMaxRollConfirmations.currentValue =
      reader.getBoolean();
    this.boolData.showQuantityInItemNotifications.currentValue =
      reader.getBoolean();
    this.boolData.showItemPreservationNotifications.currentValue =
      reader.getBoolean();
    this.boolData.showSlayerCoinNotifications.currentValue =
      reader.getBoolean();
    this.boolData.showEquipmentSetsInCombatMinibar.currentValue =
      reader.getBoolean();
    this.boolData.showBarsInCombatMinibar.currentValue = reader.getBoolean();
    this.boolData.showCombatStunNotifications.currentValue =
      reader.getBoolean();
    this.boolData.showCombatSleepNotifications.currentValue =
      reader.getBoolean();
    this.boolData.showSummoningMarkDiscoveryModals.currentValue =
      reader.getBoolean();
    this.boolData.enableCombatDamageSplashes.currentValue = reader.getBoolean();
    this.boolData.enableProgressBars.currentValue = reader.getBoolean();
    this.boolData.showTierIPotions.currentValue = reader.getBoolean();
    this.boolData.showTierIIPotions.currentValue = reader.getBoolean();
    this.boolData.showTierIIIPotions.currentValue = reader.getBoolean();
    this.boolData.showTierIVPotions.currentValue = reader.getBoolean();
    this.choiceData.showNeutralAttackModifiers.currentValue =
      reader.getBoolean();
    let defaultPageOnLoad = reader.getNamespacedObject(this.game.pages);
    if (typeof defaultPageOnLoad === "string")
      defaultPageOnLoad = this.game.currentGamemode.startingPage;
    this.choiceData.defaultPageOnLoad.currentValue = defaultPageOnLoad;
    this.choiceData.formatNumberSetting.currentValue = reader.getUint8();
    this.choiceData.bankSortOrder.currentValue = reader.getUint8();
    this.choiceData.colourBlindMode.currentValue = reader.getUint8();
    if (version >= 26)
      this.boolData.enableEyebleachMode.currentValue = reader.getBoolean();
    if (version >= 27)
      this.boolData.enableQuickConvert.currentValue = reader.getBoolean();
    if (version >= 28)
      this.boolData.showLockedTownshipBuildings.currentValue =
        reader.getBoolean();
  }
  convertFromOldFormat(savegame, idMap) {
    if (savegame.ignoreBankFull !== undefined)
      this.boolData.continueIfBankFull.currentValue = savegame.ignoreBankFull;
    if (savegame.autoRestartDungeon !== undefined)
      this.boolData.autoRestartDungeon.currentValue =
        savegame.autoRestartDungeon;
    if (savegame.autoSaveCloud !== undefined)
      this.boolData.autoCloudSave.currentValue = savegame.autoSaveCloud;
    if (savegame.darkMode !== undefined)
      this.boolData.darkMode.currentValue = savegame.darkMode;
    if (savegame.showGPNotify !== undefined)
      this.boolData.showGPNotifications.currentValue = savegame.showGPNotify;
    if (savegame.enableAccessibility !== undefined)
      this.boolData.enableAccessibility.currentValue =
        savegame.enableAccessibility;
    if (savegame.showEnemySkillLevels !== undefined)
      this.boolData.showEnemySkillLevels.currentValue =
        savegame.showEnemySkillLevels;
    if (savegame.confirmationOnClose !== undefined)
      this.boolData.showCloseConfirmations.currentValue =
        savegame.confirmationOnClose;
    if (savegame.showCommas !== undefined)
      this.boolData.hideThousandsSeperator.currentValue = !savegame.showCommas;
    if (savegame.showVirtualLevels !== undefined)
      this.boolData.showVirtualLevels.currentValue = savegame.showVirtualLevels;
    if (savegame.showSaleNotifications !== undefined)
      this.boolData.showSaleConfirmations.currentValue =
        savegame.showSaleNotifications;
    if (savegame.showShopNotifications !== undefined)
      this.boolData.showShopConfirmations.currentValue =
        savegame.showShopNotifications;
    if (savegame.pauseOfflineActions !== undefined)
      this.boolData.pauseOnUnfocus.currentValue = savegame.pauseOfflineActions;
    if (savegame.showCombatMinibar !== undefined)
      this.boolData.showCombatMinibar.currentValue = savegame.showCombatMinibar;
    if (savegame.showCombatMinibarCombat !== undefined)
      this.boolData.showCombatMinibarCombat.currentValue =
        savegame.showCombatMinibarCombat;
    if (savegame.showSkillMinibar !== undefined)
      this.boolData.showSkillingMinibar.currentValue =
        savegame.showSkillMinibar;
    if (savegame.useCombinationRunes !== undefined)
      this.boolData.useCombinationRunes.currentValue =
        savegame.useCombinationRunes;
    if (savegame.autoSlayer !== undefined)
      this.boolData.enableAutoSlayer.currentValue = savegame.autoSlayer;
    if (savegame.levelUpScreen !== undefined)
      this.boolData.useSmallLevelUpNotifications.currentValue =
        savegame.levelUpScreen === 1;
    if (savegame.showItemNotify !== undefined)
      this.boolData.showItemNotifications.currentValue =
        savegame.showItemNotify === 1;
    if (savegame.defaultPageOnLoad !== undefined) {
      const defaultPage = this.game.pages.getObjectByID(
        idMap.pages[savegame.defaultPageOnLoad]
      );
      if (defaultPage !== undefined) {
        this.choiceData.defaultPageOnLoad.currentValue = defaultPage;
      }
    }
    if (savegame.formatNumberSetting !== undefined)
      this.choiceData.formatNumberSetting.currentValue =
        savegame.formatNumberSetting;
    if (savegame.SETTINGS !== undefined) {
      this.boolData.continueThievingOnStun.currentValue =
        savegame.SETTINGS.general.continueThievingOnStun;
      this.boolData.useDefaultBankBorders.currentValue =
        savegame.SETTINGS.bank.bankBorder === 0;
      this.choiceData.bankSortOrder.currentValue =
        savegame.SETTINGS.bank.defaultBankSort;
      this.boolData.defaultToCurrentEquipSet.currentValue =
        savegame.SETTINGS.bank.currentEquipDefault;
      this.boolData.hideMaxLevelMasteries.currentValue =
        savegame.SETTINGS.mastery.hideMaxLevel;
      this.boolData.showMasteryCheckpointconfirmations.currentValue =
        savegame.SETTINGS.mastery.confirmationCheckpoint;
      this.boolData.enableOfflinePushNotifications.currentValue =
        savegame.SETTINGS.general.pushNotificationOffline;
      this.boolData.enableFarmingPushNotifications.currentValue =
        savegame.SETTINGS.general.pushNotificationFarming;
      this.boolData.enableOfflineCombat.currentValue =
        savegame.SETTINGS.general.enabledOfflineCombat;
      this.choiceData.showNeutralAttackModifiers.currentValue =
        savegame.SETTINGS.general.enableNeutralSpecModifiers;
      this.boolData.enableMiniSidebar.currentValue =
        savegame.SETTINGS.general.miniSidebar;
      this.boolData.enableAutoEquipFood.currentValue =
        savegame.SETTINGS.general.autoEquipFood;
      this.boolData.enableAutoSwapFood.currentValue =
        savegame.SETTINGS.general.autoSwapFood;
      this.boolData.continueThievingOnStun.currentValue =
        savegame.SETTINGS.general.continueThievingOnStun;
      this.boolData.enablePerfectCooking.currentValue =
        savegame.SETTINGS.general.allowPerfectCook;
      this.boolData.showCropDestructionConfirmations.currentValue =
        savegame.SETTINGS.general.showDestroyCropConfirmation;
      this.boolData.showAstrologyMaxRollConfirmations.currentValue =
        savegame.SETTINGS.general.showAstrologyMaxRollConfirmation;
      this.boolData.showQuantityInItemNotifications.currentValue =
        savegame.SETTINGS.general.showQtyInItemNotification;
      this.boolData.showItemPreservationNotifications.currentValue =
        savegame.SETTINGS.general.showItemPreservationNotification;
      this.boolData.showSlayerCoinNotifications.currentValue =
        savegame.SETTINGS.general.showSlayerCoinNotification;
      this.boolData.showEquipmentSetsInCombatMinibar.currentValue =
        savegame.SETTINGS.general.combatMinibarShowEquipmentSets;
      this.boolData.showBarsInCombatMinibar.currentValue =
        savegame.SETTINGS.general.combatMinibarShowEnemyBars;
      this.boolData.showTierIPotions.currentValue =
        savegame.SETTINGS.general.showPotionTier[0];
      this.boolData.showTierIIPotions.currentValue =
        savegame.SETTINGS.general.showPotionTier[1];
      this.boolData.showTierIIIPotions.currentValue =
        savegame.SETTINGS.general.showPotionTier[2];
      this.boolData.showTierIVPotions.currentValue =
        savegame.SETTINGS.general.showPotionTier[3];
      this.boolData.showCombatStunNotifications.currentValue =
        savegame.SETTINGS.notifications.combatStunned;
      this.boolData.showCombatSleepNotifications.currentValue =
        savegame.SETTINGS.notifications.combatSleep;
      this.boolData.showSummoningMarkDiscoveryModals.currentValue =
        savegame.SETTINGS.notifications.summoningMark;
      this.boolData.enableCombatDamageSplashes.currentValue =
        !savegame.SETTINGS.performance.disableDamageSplashes;
      this.boolData.enableProgressBars.currentValue =
        !savegame.SETTINGS.performance.disableProgressBars;
      this.choiceData.colourBlindMode.currentValue =
        savegame.SETTINGS.accessibility.colourBlindMode;
    }
  }
  initializeToggles() {
    const attributes = ":not([data-init])";
    const toggles = document.querySelectorAll(
      `settings-checkbox${attributes}, settings-switch${attributes}`
    );
    toggles.forEach((toggle) => {
      const settingID = toggle.getAttribute("data-setting-id");
      if (settingID === null) {
        console.warn("Tried to initialize toggle but no setting-id was set.");
        console.log(toggle);
        return;
      }
      if (this.isBooleanSetting(settingID)) {
        toggle.initialize(this.boolData[settingID], () =>
          this.toggleSetting(settingID)
        );
      } else {
        console.warn(
          `Tried to initialize toggle, but it has an invalid setting: ${settingID}`
        );
      }
    });
  }
  initializeChoices() {
    const attributes = ":not([data-init])";
    const dropdowns = document.querySelectorAll(
      `settings-dropdown${attributes}`
    );
    dropdowns.forEach((dropdown) => {
      const settingID = dropdown.getAttribute("data-setting-id");
      if (settingID === null) {
        console.warn(
          "Tried to initialize settings-dropdown but no setting-id was set."
        );
        console.log(dropdown);
        return;
      }
      if (this.isChoiceSetting(settingID)) {
        const data = this.choiceData[settingID];
        const option = this.getOptionFromValue(data.currentValue, data);
        dropdown.initialize(data, (newValue) =>
          this.changeChoiceSetting(settingID, newValue)
        );
        dropdown.updateValue(option);
      } else {
        console.warn(
          `Tried to initialize toggle, but it has an invalid setting: ${settingID}`
        );
      }
    });
  }
  isBooleanSetting(settingID) {
    const data = this.boolData[settingID];
    return data !== undefined;
  }
  isChoiceSetting(settingID) {
    const data = this.choiceData[settingID];
    return data !== undefined;
  }
  toggleSetting(setting) {
    const data = this.boolData[setting];
    const oldValue = data.currentValue;
    const newValue = !data.currentValue;
    if (
      data.shouldChange !== undefined &&
      !data.shouldChange(oldValue, newValue)
    ) {
      this.setTogglesChecked(setting, data.currentValue);
      return;
    }
    data.currentValue = newValue;
    if (data.onChange !== undefined) data.onChange(oldValue, newValue);
    this.setTogglesChecked(setting, data.currentValue);
    if (data.saveOnChange) saveData("all");
  }
  setTogglesChecked(setting, isChecked) {
    const attributes = `[data-setting-id="${setting}"]`;
    const toggles = document.querySelectorAll(
      `settings-checkbox${attributes}, settings-switch${attributes}`
    );
    toggles.forEach((toggle) => {
      toggle.setChecked(isChecked);
    });
  }
  changeChoiceSetting(setting, newValue) {
    const data = this.choiceData[setting];
    const oldValue = data.currentValue;
    if (
      data.shouldChange !== undefined &&
      !data.shouldChange(oldValue, newValue)
    )
      return;
    data.currentValue = newValue;
    if (data.onChange !== undefined) data.onChange(oldValue, newValue);
    const attributes = `[data-setting-id="${setting}"]`;
    const dropdowns = document.querySelectorAll(
      `settings-dropdown${attributes}`
    );
    const option = this.getOptionFromValue(newValue, data);
    dropdowns.forEach((dropdown) => {
      dropdown.updateValue(option);
    });
    if (data.saveOnChange) saveData("all");
  }
  getOptionFromValue(value, data) {
    const option = data.options.find((option) => option.value === value);
    if (option === undefined)
      throw new Error(
        "Tried to change choice setting, but option does not exist"
      );
    return option;
  }
  onLoad() {
    Object.values(this.boolData).forEach((boolSetting) => {
      if (
        boolSetting.currentValue !== boolSetting.defaultValue &&
        boolSetting.onChange !== undefined
      )
        boolSetting.onChange(
          boolSetting.defaultValue,
          boolSetting.currentValue
        );
    });
    Object.values(this.choiceData).forEach((choiceSetting) => {
      if (
        choiceSetting.currentValue !== choiceSetting.defaultValue &&
        choiceSetting.onChange !== undefined
      )
        choiceSetting.onChange(
          choiceSetting.defaultValue,
          choiceSetting.currentValue
        );
    });
  }
}
var localStorageSettings = {};
function adjustZoom(zoomLevel) {
  try {
    const nwWin = parent.nw.Window.get();
    nwWin.zoomLevel = zoomLevel;
    localStorage.setItem("steamZoomLevel", `${zoomLevel}`);
    saveData();
  } catch (e) {
    console.error(e);
  }
}
function toggleFullScreen() {
  try {
    parent.win.toggleFullscreen();
  } catch (e) {
    console.error(e);
  }
}
const colourBlindClasses = { [0]: "", [1]: "colourAdjustment" };
function localizeSettings() {
  $("#setting-3-3").html(getLangString("SETTINGS", "SETTING_3_3"));
}
const offlineCombatChecks = [false, false, false, false, false];
function showEnableOfflineCombatModal() {
  $("#modal-offline-combat-warning").modal("show");
}
function dismissOfflineCombatAlert() {
  $("#offline-combat-alert").addClass("d-none");
  localStorage.setItem("offlineCombatDismissed", "1");
}
function dismissOfflineThievingAlert() {
  $("#offline-thieving-alert").addClass("d-none");
  localStorage.setItem("offlineThievingDismissed", "1");
}
function toggleOfflineCombatCheckbox(id) {
  offlineCombatChecks[id] = $(`#cb-offline-combat-${id}`).prop("checked");
  updateEnableOfflineCombatBtn();
}
function updateEnableOfflineCombatBtn() {
  if (offlineCombatChecks.includes(false))
    $(`#cb-offline-combat-btn`).prop("disabled", true);
  else $(`#cb-offline-combat-btn`).prop("disabled", false);
}
function enableOfflineCombat() {
  if (offlineCombatChecks.includes(false))
    notifyPlayer(
      game.attack,
      getLangString("TOASTS", "OFFLINE_COMBAT_ENABLE_FAILURE"),
      "danger"
    );
  else {
    game.settings.toggleSetting("enableOfflineCombat");
  }
}
function enableOfflineThieving() {
  game.settings.toggleSetting("continueThievingOnStun");
  $("#offline-thieving-alert").addClass("d-none");
}
function initLocalStorageSettings() {
  const hideEmptySaveSlots = localStorage.getItem("hideEmptySaveSlots");
  const enableSaveOverwriteWarning = localStorage.getItem(
    "enableSaveOverwriteWarning"
  );
  const enableMostRecentSaveBanner = localStorage.getItem(
    "enableMostRecentSaveBanner"
  );
  if (hideEmptySaveSlots !== null && hideEmptySaveSlots !== undefined)
    localStorageSettings.hideEmptySaveSlots = hideEmptySaveSlots;
  if (
    enableSaveOverwriteWarning !== null &&
    enableSaveOverwriteWarning !== undefined
  )
    localStorageSettings.enableSaveOverwriteWarning =
      enableSaveOverwriteWarning;
  if (
    enableMostRecentSaveBanner !== null &&
    enableMostRecentSaveBanner !== undefined
  )
    localStorageSettings.enableMostRecentSaveBanner =
      enableMostRecentSaveBanner;
  if (localStorageSettings.hideEmptySaveSlots === undefined) {
    localStorageSettings.hideEmptySaveSlots = "false";
    localStorage.setItem("hideEmptySaveSlots", "false");
  }
  if (localStorageSettings.enableSaveOverwriteWarning === undefined) {
    localStorageSettings.enableSaveOverwriteWarning = "true";
    localStorage.setItem("enableSaveOverwriteWarning", "true");
  }
  if (localStorageSettings.enableMostRecentSaveBanner === undefined) {
    localStorageSettings.enableMostRecentSaveBanner = "true";
    localStorage.setItem("enableMostRecentSaveBanner", "true");
  }
}
