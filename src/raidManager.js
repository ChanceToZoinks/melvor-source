"use strict";
class RaidManager extends BaseManager {
  constructor(game, namespace) {
    super(game, namespace, "GolbinRaid");
    this.activeSkills = [];
    this.randomPlayerModifiers = [];
    this.randomEnemyModifiers = [];
    this.player = new RaidPlayer(this, this.game);
    this.state = RaidState.Unstarted;
    this.selectedDifficulty = RaidDifficulty.Medium;
    this._setDifficulty = RaidDifficulty.Easy;
    this.enemy = new Golbin(this, this.game);
    this.bank = new GolbinRaidBank(this.game, 1, 100);
    this.bannedItems = new Set();
    this.bannedPassiveItems = new Set();
    this.crateItems = [];
    this.golbinPassives = [];
    this.startingWeapons = [];
    this.startingRunes = [];
    this.itemSelection = {
      weapons: [[], [], []],
      armour: [[], [], []],
      ammo: [[], [], []],
      runes: [[], [], []],
      food: [[], [], []],
      passives: [[], [], []],
    };
    this.exclusiveItemSelection = {
      weapons: [[], [], []],
      armour: [[], [], []],
      ammo: [[], [], []],
      runes: [[], [], []],
      food: [[], [], []],
      passives: [[], [], []],
    };
    this.itemLevelBrackets = [70, 85, 121];
    this.wave = 0;
    this.waveProgress = 0;
    this.killCount = 0;
    this.specialAttackSelection = [];
    this.isFightingITMBoss = false;
    this.onSlayerTask = false;
    this.startTimestamp = 0;
    this.endTimestamp = 0;
    this.ownedCrateItems = new Set();
    this.randomModifiersBeingSelected = [];
    this.isSelectingPositiveModifier = false;
    this.itemsBeingSelected = {
      weapons: [],
      armour: [],
      ammo: [],
      runes: [],
      food: [],
      passives: [],
    };
    this.itemCategoryBeingSelected = "weapons";
    this.posModsSelected = 0;
    this.negModsSelected = 0;
    this.isPaused = false;
    this.history = [];
    this.toggleOffSelectors = [
      ".combat-equipment-set-container",
      "#combat-slayer-task-menu",
      "#combat-loot",
      "#combat-menu-item-5",
      "#combat-btn-monster-drops",
      "#combat-area-selection",
      "#combat-spellbook-use-combo-runes",
    ];
    this.toggleOnSelectors = [
      ".combat-player-golbin-stats",
      "#combat-golbin-raid-wave-skip",
      "#combat-btn-pause-raid",
      "#combat-btn-modifiers-raid",
    ];
    this.prayerUnlockedSelectors = [
      "#combat-menu-item-2",
      ".golbin-raid-prayer-level",
    ];
  }
  get media() {
    return cdnMedia("assets/media/pets/golden_golbin.svg");
  }
  get name() {
    return getLangString("PAGE_NAME", "GolbinRaid");
  }
  get canStop() {
    return this.isActive;
  }
  get areaType() {
    return CombatAreaType.None;
  }
  get difficulty() {
    return RaidManager.difficulties[this._setDifficulty];
  }
  get waveLength() {
    return Math.floor(2 + this.wave / 4);
  }
  get fightingBoss() {
    return (
      (this.wave + 1) % 10 === 0 && this.waveLength - 1 === this.waveProgress
    );
  }
  get waveBracket() {
    const brackets = [10, 20, Infinity];
    return brackets.findIndex((x) => this.wave < x);
  }
  get waveSkipCost() {
    return Math.floor(
      (this.wave + 1) *
        100 *
        (1 - this.player.modifiers.golbinRaidWaveSkipCostReduction / 100)
    );
  }
  get coinsEarned() {
    if (this.wave > 2) {
      return Math.floor(
        this.difficulty.coinMultiplier *
          3.6 *
          this.wave *
          Math.floor(2 + this.wave / 4) *
          Math.floor(this.wave / 15 + 1)
      );
    } else {
      return 0;
    }
  }
  get canInteruptAttacks() {
    return this.fightInProgress;
  }
  get areaRequirements() {
    return [];
  }
  get slayerAreaLevelReq() {
    return 0;
  }
  get playerAreaModifiers() {
    return {};
  }
  get enemyAreaModifiers() {
    return {};
  }
  get ignoreSpellRequirements() {
    return true;
  }
  get raidRunning() {
    return this.state !== RaidState.Unstarted && !this.isPaused;
  }
  get cratesPurchased() {
    return this.ownedCrateItems.size;
  }
  registerData(data) {
    const getItem = (itemID) => {
      const item = this.game.items.getObjectByID(itemID);
      if (item === undefined)
        throw new Error(
          `Error registering data for Golbin Raid. Item with id: ${itemID} is not registered.`
        );
      return item;
    };
    data.bannedItems.forEach((itemID) => {
      this.bannedItems.add(getItem(itemID));
    });
    data.bannedPassiveItems.forEach((itemID) => {
      this.bannedPassiveItems.add(getItem(itemID));
    });
    data.crateItems.forEach(({ itemID, weight }) => {
      const item = getItem(itemID);
      this.crateItems.push({ weight, item });
    });
    data.golbinPassives.forEach((id) => {
      const passive = this.game.combatPassives.getObjectByID(id);
      if (passive === undefined)
        throw new Error(
          `Error registering data for Golbin Raid. Passive with id: ${id} is not registered.`
        );
      this.golbinPassives.push(passive);
    });
    if (data.startingWeapons !== undefined) {
      data.startingWeapons.forEach((itemID) => {
        const weapon = this.game.items.weapons.getObjectByID(itemID);
        if (weapon === undefined)
          throw new Error(
            `Error registering data for Golbin Raid. Weapon with id: ${itemID} is not registered.`
          );
        this.startingWeapons.push(weapon);
      });
    }
    if (data.startingFood !== undefined) {
      const food = this.game.items.food.getObjectByID(data.startingFood);
      if (food === undefined)
        throw new Error(
          `Error registering data for Golbin Raid. Food with id: ${data.startingFood} is not registered.`
        );
      this.startingFood = food;
    }
    if (data.startingAmmo !== undefined) {
      const itemQuantity = this.game.items.equipment.getQuantity(
        data.startingAmmo
      );
      if (!itemQuantity.item.validSlots.includes("Quiver"))
        throw new Error(
          `Error registering data for Golbin Raid. Starting ammo with id: ${data.startingAmmo.id} is not a quiver item.`
        );
      this.startingAmmo = itemQuantity;
    }
    if (data.startingRunes !== undefined) {
      this.startingRunes.push(
        ...this.game.items.getQuantities(data.startingRunes)
      );
    }
  }
  activeTick() {
    if (this.state !== RaidState.FightingWave) return;
    this.player.passiveTick();
    this.spawnTimer.tick();
    this.enemy.passiveTick();
    this.player.activeTick();
    this.enemy.activeTick();
    this.checkDeath();
  }
  onPageChange() {
    this.loadHistory();
    updateStats(StatCategories.GolbinRaid);
  }
  render() {
    super.render();
    this.bank.render();
  }
  preStartRaid() {
    if (this.state !== RaidState.Unstarted) return;
    this._setDifficulty = this.selectedDifficulty;
    this.state = RaidState.SelectingModifiersStart;
    this.resetModifiers();
    this.resetModsSelected();
    this.continueModifierSelection();
  }
  resetModsSelected() {
    this.isSelectingPositiveModifier = true;
    this.posModsSelected = 0;
    this.negModsSelected = 0;
  }
  resetModifiers() {
    this.randomEnemyModifiers = [];
    this.randomPlayerModifiers = [];
  }
  fireStateModals() {
    switch (this.state) {
      case RaidState.SelectingCategory:
        this.fireCategorySelectModal();
        break;
      case RaidState.SelectingItem:
        this.fireItemSelectModal();
        break;
      case RaidState.SelectingModifiersWave:
      case RaidState.SelectingModifiersStart:
        this.fireRandomModifierSelection();
        break;
    }
  }
  startRaid() {
    this.startTimestamp = new Date().getTime();
    this.wave = 0;
    this.waveProgress = 0;
    this.killCount = 0;
    this.pauseGame();
    this.setDefaultEquipment();
    this.onSelection();
  }
  updateSkipCost() {
    $("#golbin-raid-skip-cost").html(
      templateString(getLangString("COMBAT_MISC", "85"), {
        coinImage: `<img class="skill-icon-xs mr-1 " src="${CDNDIR}assets/media/main/raid_coins.svg">`,
        qty: `${numberWithCommas(this.waveSkipCost)}`,
      })
    );
  }
  pause() {
    if (this.state === RaidState.Unstarted) return;
    this.isPaused = true;
    this.renderStartMenu();
    this.resumeGame();
  }
  unpause() {
    if (!this.isPaused) return;
    this.pauseGame();
    this.fireStateModals();
    this.game.renderQueue.combatMinibar = true;
    this.isPaused = false;
  }
  pauseGame() {
    if (confirmedLoaded) {
      this.game.pauseActiveSkill();
    }
    this.game.activeAction = this;
    this.initialize();
    this.toggleUIOff();
    this.rendersRequired.spellBook = true;
    this.updateSkipCost();
    const page = this.game.getPageForAction(this.game.combat);
    if (page !== undefined) changePage(page, -1, undefined, false, false);
    this.isPaused = false;
    saveData();
  }
  resumeGame() {
    if (confirmedLoaded) {
      this.game.stopMainLoop();
      this.game.unpauseActiveSkill().then(() => {
        this.game.startMainLoop();
      });
    }
    this.game.combat.initialize();
    this.toggleUIOn();
    this.game.combat.rendersRequired.spellBook = true;
    changeCombatMenu(0);
    const page = this.game.getPageForAction(this);
    if (page !== undefined) changePage(page, -1, undefined, false, false);
    saveData();
  }
  onLoad() {
    this.renderStartMenu();
    if (this.state === RaidState.Unstarted || this.isPaused) return;
    this.initialize();
    this.toggleUIOff();
    this.updateSkipCost();
    this.fireStateModals();
  }
  toggleUIOff() {
    this.toggleOffSelectors.forEach((selector) => {
      $(selector).addClass("d-none");
    });
    this.toggleOnSelectors.forEach((selector) => {
      $(selector).removeClass("d-none");
    });
    if (this.player.isPrayerUnlocked) {
      this.prayerUnlockedSelectors.forEach((selector) => {
        $(selector).removeClass("d-none");
      });
      combatMenus.prayer.updateForLevel(this.player.levels.Prayer, this.player);
    } else {
      this.prayerUnlockedSelectors.forEach((selector) => {
        $(selector).addClass("d-none");
      });
    }
    combatMenus.runes.updateCounts();
    this.game.renderQueue.title = true;
  }
  toggleUIOn() {
    this.toggleOffSelectors.forEach((selector) => {
      $(selector).removeClass("d-none");
    });
    this.toggleOnSelectors.forEach((selector) => {
      $(selector).addClass("d-none");
    });
    this.prayerUnlockedSelectors.forEach((selector) => {
      $(selector).removeClass("d-none");
    });
    $(this.prayerUnlockedSelectors[1]).addClass("d-none");
    combatMenus.prayer.updateForLevel(
      this.game.prayer.level,
      this.game.combat.player
    );
    combatMenus.runes.updateCounts();
    this.game.renderQueue.title = true;
  }
  stop(fled = true) {
    if (!this.canStop) return false;
    super.stop(fled);
    this.endTimestamp = new Date().getTime();
    this.recordRaidHistory();
    if (this.coinsEarned > 0) {
      this.game.raidCoins.add(this.coinsEarned);
      this.game.stats.GolbinRaid.add(
        RaidStats.RaidCoinsEarned,
        this.coinsEarned
      );
    }
    this.game.stats.GolbinRaid.set(
      RaidStats.HighestWave,
      Math.max(this.game.stats.GolbinRaid.get(RaidStats.HighestWave), this.wave)
    );
    const title = fled
      ? getLangString("COMBAT_MISC", "RAN_AWAY")
      : getLangString("COMBAT_MISC", "YOU_DIED");
    if (!fled) {
      this.game.stats.GolbinRaid.inc(RaidStats.TotalDeath);
    }
    addModalToQueue({
      title: title,
      html:
        '<span class="text-dark">' +
        templateString(getLangString("GOLBIN_RAID", "WAVE_FINISH"), {
          num: `${numberWithCommas(this.wave)}`,
        }) +
        "</span><br><br>" +
        this.getGolbinRaidHistory(this.history.length - 1),
      imageUrl: "assets/media/skills/combat/combat.svg",
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: getLangString("PAGE_NAME", "Combat"),
    });
    this.state = RaidState.Unstarted;
    this.resumeGame();
    this.renderStartMenu();
    return true;
  }
  skipWave() {
    if (this.game.raidCoins.canAfford(this.waveSkipCost)) {
      this.game.raidCoins.remove(this.waveSkipCost);
      this.endFight();
      if (this.spawnTimer.isActive) this.spawnTimer.stop();
      if (this.enemy.state !== EnemyState.Dead) this.enemy.processDeath();
      this.waveProgress = this.waveLength;
      this.loadNextEnemy();
    }
  }
  recordRaidHistory() {
    if (this.history.length >= 5)
      this.history.splice(this.history.length - 1, 1);
    const timestamp = this.endTimestamp - this.startTimestamp;
    const newHistory = {
      skillLevels: this.player.getLevelHistory(),
      equipment: this.player.getEquipmentHistory(),
      ammo: this.player.equipment.slots.Quiver.quantity,
      inventory: this.bank.getHistory(),
      food: {
        item: this.player.food.currentSlot.item,
        quantity: this.player.food.currentSlot.quantity,
      },
      wave: this.wave + 1,
      kills: this.killCount,
      timestamp: timestamp,
      raidCoinsEarned: this.coinsEarned,
      difficulty: this._setDifficulty,
    };
    this.history.push(newHistory);
    this.game.stats.GolbinRaid.add(RaidStats.TotalTimeSpent, timestamp);
    this.game.stats.GolbinRaid.set(
      RaidStats.LongestRaid,
      Math.max(this.game.stats.GolbinRaid.get(RaidStats.LongestRaid), timestamp)
    );
    sendPlayFabEvent("golbin_raid_finished", newHistory);
  }
  postDataRegistration() {
    this.computeItemSelection();
  }
  computeItemSelection() {
    this.game.items.forEach((item) => {
      if (!this.bannedItems.has(item)) {
        const selection = item.golbinRaidExclusive
          ? this.exclusiveItemSelection
          : this.itemSelection;
        if (
          item instanceof EquipmentItem &&
          !item.validSlots.includes("Summon1")
        ) {
          const levelReqs = item.equipRequirements.filter(
            (req) => req.type === "SkillLevel" || req.type === "AllSkillLevels"
          );
          const maxLevel = Math.max(...levelReqs.map((level) => level.level));
          const waveBracket = this.itemLevelBrackets.findIndex(
            (levelReq) => maxLevel < levelReq
          );
          if (item instanceof WeaponItem)
            selection.weapons[waveBracket].push(item);
          else if (item.validSlots.includes("Quiver"))
            selection.ammo[waveBracket].push(item);
          else selection.armour[waveBracket].push(item);
          if (item.specialAttacks.length > 0)
            this.specialAttackSelection.push(...item.specialAttacks);
          if (
            item.validSlots.includes("Passive") &&
            !this.bannedPassiveItems.has(item)
          )
            selection.passives[0].push(item);
        } else if (item.type === "Rune") {
          selection.runes[0].push(item);
        } else if (item instanceof FoodItem) {
          selection.food[0].push(item);
        }
      }
    });
  }
  getItemSelection(category) {
    const selection = [];
    const categoryBrackets = this.itemSelection[category];
    const exclusiveBrackets = this.exclusiveItemSelection[category];
    for (let i = 0; i <= this.waveBracket; i++) {
      selection.push(...categoryBrackets[i]);
      exclusiveBrackets[i].forEach((item) => {
        if (this.ownedCrateItems.has(item)) selection.push(item);
      });
    }
    return selection;
  }
  getCategoryQuantity(category) {
    switch (category) {
      case "ammo":
        return (
          Math.floor(
            Math.random() *
              applyModifier(
                this.wave * 25,
                this.player.modifiers.golbinRaidIncreasedMaximumAmmo
              )
          ) + 1
        );
      case "food":
        return (
          Math.floor(Math.random() * this.wave * 11) +
          this.wave +
          this.player.modifiers.golbinRaidIncreasedMinimumFood
        );
      case "runes":
        return (
          Math.floor(
            Math.random() *
              applyModifier(
                this.wave * 25,
                this.player.modifiers.golbinRaidIncreasedMaximumRunes
              )
          ) + 10
        );
      default:
        return 1;
    }
  }
  getItemChoices(category, count) {
    const itemSelection = this.getItemSelection(category);
    const rolledItems = [];
    const inSelection = new Set();
    while (rolledItems.length < count) {
      const item = getRandomArrayElement(itemSelection);
      if (inSelection.has(item)) continue;
      if (
        item instanceof EquipmentItem &&
        this.player.equipment.checkForItem(item)
      )
        continue;
      const isAlt =
        item instanceof EquipmentItem &&
        item.specialAttacks.length > 0 &&
        (rollPercentage(25) || item.id === "melvorD:Mystery_Wand");
      rolledItems.push({
        item,
        quantity: this.getCategoryQuantity(category),
        isAlt,
      });
    }
    return rolledItems;
  }
  createNewEnemy() {
    this.enemy = new Golbin(this, this.game);
    this.enemy.setMonster(
      this.enemy.getMonster(
        this.wave,
        this.fightingBoss,
        this.difficulty.hasSecondPassiveChange,
        this.game
      )
    );
  }
  onEnemyDeath() {
    const stopCombat = super.onEnemyDeath();
    this.waveProgress++;
    this.killCount++;
    this.rendersRequired.location = true;
    this.game.stats.GolbinRaid.inc(RaidStats.GolbinsKilled);
    return stopCombat;
  }
  loadNextEnemy() {
    if (this.waveProgress === this.waveLength) {
      this.wave++;
      this.game.stats.GolbinRaid.inc(RaidStats.WavesCompleted);
      this.waveProgress = 0;
      if (this.player.isPrayerUnlocked)
        this.player.addPrayerPoints(this.player.prayerPointsOnWaveCompletion);
      if (this.wave % 10 == 0 && this.difficulty.positiveModifierCount > 0) {
        this.state = RaidState.SelectingModifiersWave;
        this.resetModsSelected();
        this.render();
        this.continueModifierSelection();
      } else {
        this.state = RaidState.SelectingCategory;
        this.render();
        this.fireCategorySelectModal();
      }
    } else {
      this.state = RaidState.FightingWave;
      super.loadNextEnemy();
    }
  }
  fireCategorySelectModal() {
    let html = `<small>${getLangString("GOLBIN_RAID", "POPUP_1")}</small><br>
		<small class="text-danger">${getLangString(
      "GOLBIN_RAID",
      "POPUP_2"
    )}</small><br>
		<small>${templateString(getLangString("GOLBIN_RAID", "POPUP_3"), {
      num: `${this.itemLevelBrackets[this.waveBracket] - 1}`,
    })}</small><br>
		<button class="btn btn-outline-success m-2" onClick="game.golbinRaid.showEquipmentSelectionModal('weapons');" style="width: 80%;">
			<img class="skill-icon-xs mr-2" src="${cdnMedia(
        "assets/media/bank/weapon_scimitar_dragon.png"
      )}">${getLangString("GOLBIN_RAID", "POPUP_4")}
		</button><br>
		<button class="btn btn-outline-success m-2" onClick="game.golbinRaid.showEquipmentSelectionModal('armour');" style="width: 80%;">
			<img class="skill-icon-xs mr-2" src="${cdnMedia(
        "assets/media/bank/armour_helmet_adamant.png"
      )}">${getLangString("GOLBIN_RAID", "POPUP_5")}
		</button><br>
		<button class="btn btn-outline-success m-2" onClick="game.golbinRaid.showEquipmentSelectionModal('ammo');" style="width: 80%;">
			<img class="skill-icon-xs mr-2" src="${cdnMedia(
        "assets/media/bank/ammo_arrow_rune.png"
      )}">${getLangString("GOLBIN_RAID", "POPUP_6")}
		</button><br>
		<button class="btn btn-outline-success m-2" onClick="game.golbinRaid.showEquipmentSelectionModal('runes');" style="width: 80%;">
			<img class="skill-icon-xs mr-2" src="${cdnMedia(
        "assets/media/bank/rune_fire.png"
      )}">${getLangString("GOLBIN_RAID", "POPUP_7")}
		</button><br>
		<button class="btn btn-outline-success m-2" onClick="game.golbinRaid.showEquipmentSelectionModal('food');" style="width: 80%;">
			<img class="skill-icon-xs mr-2" src="${cdnMedia(
        "assets/media/bank/whale_cooked.png"
      )}">${getLangString("GOLBIN_RAID", "POPUP_8")}
		</button>`;
    if (
      this.player.modifiers.golbinRaidPassiveSlotUnlocked > 0 &&
      this.wave >= 5 &&
      this.wave % 5 === 0
    )
      html += `<br>
		<button class="btn btn-outline-warning m-2" onClick="game.golbinRaid.rerollPassiveCallback();" style="width: 80%;">
			<img class="skill-icon-xs mr-2" src="${cdnMedia(
        "assets/media/bank/guardian_amulet.png"
      )}">${getLangString("GOLBIN_RAID", "POPUP_17")}
		</button>`;
    html += `<button class="btn btn-danger m-2 w-80" onClick="game.golbinRaid.closeModalAndPause();">${getLangString(
      "GOLBIN_RAID",
      "PAUSE_RAID"
    )}</button><br>`;
    SwalLocale.fire({
      title: getLangString("GOLBIN_RAID", "POPUP_0"),
      html: html,
      imageUrl: cdnMedia("assets/media/pets/golden_golbin.svg"),
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: getLangString("PAGE_NAME", "GolbinRaid"),
      allowOutsideClick: false,
      showConfirmButton: false,
      allowEscapeKey: false,
    });
  }
  closeModalAndPause() {
    Swal.close();
    this.pause();
  }
  continueRaid() {
    this.itemsBeingSelected[this.itemCategoryBeingSelected] = [];
    this.player.computeAllStats();
    this.updateSkipCost();
    this.loadNextEnemy();
  }
  addRunesCallback(item, quantity) {
    this.bank.addItem(item, quantity, false, false, true, false);
    this.continueRaid();
    Swal.close();
  }
  addFoodCallback(item, quantity) {
    this.player.equipFood(item, quantity);
    this.continueRaid();
    Swal.close();
  }
  equipItemCallback(item, quantity, isAlt) {
    const attacks = [];
    if (isAlt) {
      attacks.push(getRandomArrayElement(this.specialAttackSelection));
      if (item.id === "melvorD:Mystery_Wand") {
        attacks.push(getRandomArrayElement(this.specialAttackSelection));
      }
    }
    this.player.equipItem(
      item,
      this.player.selectedEquipmentSet,
      "Default",
      quantity,
      attacks
    );
    this.continueRaid();
    Swal.close();
  }
  rerollPassiveCallback() {
    const newPassive = this.getItemChoices("passives", 1)[0];
    this.player.equipItem(
      newPassive.item,
      this.player.selectedEquipmentSet,
      "Passive"
    );
    this.continueRaid();
    Swal.close();
  }
  addExistingRunesCallback(quantity) {
    this.bank.addQuantityToExistingItems(quantity);
    this.continueRaid();
    Swal.close();
  }
  spawnEnemy() {
    super.spawnEnemy();
    if (this.waveProgress === 0) this.player.heal(numberMultiplier);
    this.startFight();
  }
  selectNothingCallback() {
    this.continueRaid();
    Swal.close();
  }
  showEquipmentSelectionModal(category) {
    this.state = RaidState.SelectingItem;
    this.setEquipmentSelection(category);
    this.fireItemSelectModal();
  }
  setEquipmentSelection(category) {
    this.itemCategoryBeingSelected = category;
    switch (category) {
      case "weapons":
        this.itemsBeingSelected.weapons = this.getItemChoices(category, 3);
        break;
      case "armour":
        this.itemsBeingSelected.armour = this.getItemChoices(category, 4);
        break;
      case "ammo":
        this.itemsBeingSelected.ammo = this.getItemChoices(category, 2);
        this.itemsBeingSelected.ammo.push({
          item: this.game.emptyEquipmentItem,
          quantity: this.getCategoryQuantity(category),
          isAlt: false,
        });
        break;
      case "runes":
        this.itemsBeingSelected.runes = this.getItemChoices(category, 2);
        this.itemsBeingSelected.runes.push({
          item: this.game.emptyEquipmentItem,
          quantity: this.getCategoryQuantity(category),
          isAlt: false,
        });
        break;
      case "food":
        this.itemsBeingSelected.food = this.getItemChoices(category, 3);
        break;
    }
  }
  fireItemSelectModal() {
    const category = this.itemCategoryBeingSelected;
    const modalBody = createElement("div");
    switch (category) {
      case "weapons":
        modalBody.append(
          ...this.getEquipmentSelectionNodes(this.itemsBeingSelected.weapons)
        );
        break;
      case "armour":
        modalBody.append(
          ...this.getEquipmentSelectionNodes(this.itemsBeingSelected.armour)
        );
        break;
      case "ammo":
        modalBody.append(
          createElement("small", {
            text: getLangString("GOLBIN_RAID", "POPUP_16"),
          }),
          createElement("br")
        );
        modalBody.append(
          ...this.getEquipmentSelectionNodes(this.itemsBeingSelected.ammo)
        );
        break;
      case "runes":
        modalBody.append(
          ...this.getRuneSelectionNodes(this.itemsBeingSelected.runes)
        );
        break;
      case "food":
        modalBody.append(
          createElement("small", {
            text: getLangString("GOLBIN_RAID", "POPUP_15"),
          }),
          createElement("br")
        );
        modalBody.append(
          ...this.getFoodSelectionNodes(this.itemsBeingSelected.food)
        );
        break;
    }
    const selectNothingButton = createElement("button", {
      className: "btn btn-outline-danger m-2 w-80",
      text: getLangString("GOLBIN_RAID", "POPUP_9"),
    });
    selectNothingButton.onclick = () => this.selectNothingCallback();
    const pauseButton = createElement("button", {
      className: "btn btn-danger m-2 w-80",
      text: getLangString("GOLBIN_RAID", "PAUSE_RAID"),
    });
    pauseButton.onclick = () => this.closeModalAndPause();
    modalBody.append(
      selectNothingButton,
      createElement("br"),
      pauseButton,
      createElement("br")
    );
    SwalLocale.fire({
      title: getLangString("MISC_STRING", "29"),
      html: modalBody,
      imageUrl: "assets/media/pets/golden_golbin.svg",
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: getLangString("PAGE_NAME", "GolbinRaid"),
      allowOutsideClick: false,
      showConfirmButton: false,
      allowEscapeKey: false,
    });
  }
  getEquipmentSelectionNodes(selection) {
    const nodes = [];
    selection.forEach(({ item, quantity, isAlt }) => {
      if (item === this.game.emptyEquipmentItem) {
        const existingQuiverItem = this.player.equipment.slots.Quiver.item;
        if (existingQuiverItem !== this.game.emptyEquipmentItem) {
          const equipExistingAmmo = createElement("button", {
            className: "btn btn-outline-success m-2 w-80",
            text: templateLangString("GOLBIN_RAID", "POPUP_13", {
              num: `${quantity}`,
            }),
          });
          equipExistingAmmo.onclick = () =>
            this.equipItemCallback(existingQuiverItem, quantity, false);
          nodes.push(equipExistingAmmo, createElement("br"));
        }
        return;
      }
      const equipButton = createElement("button", {
        className: "btn btn-outline-success w-80",
      });
      equipButton.append(
        createElement("img", {
          className: "skill-icon-xs mr-2",
          attributes: [["src", item.media]],
        })
      );
      if (isAlt) {
        equipButton.append(
          `${quantity} x `,
          createElement("span", {
            className: "text-warning",
            text: `(ALT) ${item.name}`,
          })
        );
      } else {
        equipButton.append(`${quantity} x ${item.name}`);
      }
      equipButton.onclick = () => this.equipItemCallback(item, quantity, isAlt);
      const viewStatsButton = createElement("button", {
        className: "btn btn-outline-warning",
      });
      viewStatsButton.style.width = "15%";
      viewStatsButton.onclick = () =>
        viewItemStats(item, this.player.equipment);
      viewStatsButton.append(
        createElement("img", {
          className: "skill-icon-xs m-1",
          attributes: [
            ["src", cdnMedia("assets/media/main/statistics_header.svg")],
          ],
        })
      );
      nodes.push(
        createElement("div", {
          className: "btn-group m-2 w-80",
          attributes: [
            ["role", "group"],
            ["aria-label", "Horizontal Primary"],
          ],
          children: [equipButton, viewStatsButton],
        }),
        createElement("br")
      );
      const slotReplaced = this.player.equipment.slots[item.validSlots[0]];
      let replaceName = getLangString("GOLBIN_RAID", "POPUP_9");
      if (!slotReplaced.isEmpty) replaceName = slotReplaced.item.name;
      nodes.push(
        createElement("small", {
          text: `${getLangString("GOLBIN_RAID", "POPUP_10")} ${replaceName}`,
        }),
        createElement("br")
      );
      const allReplaced = this.player.equipment.getItemsAddedOnEquip(
        item,
        "Default"
      );
      allReplaced.forEach(({ item }) => {
        if (item !== slotReplaced.item) {
          nodes.push(
            createElement("small", {
              text: `${getLangString("GOLBIN_RAID", "POPUP_11")} ${item.name}`,
            }),
            createElement("br")
          );
        }
      });
    });
    return nodes;
  }
  getRuneSelectionNodes(selection) {
    const nodes = [];
    selection.forEach(({ item, quantity }) => {
      const addRunesButton = createElement("button", {
        className: "btn btn-outline-success m-2 w-80",
      });
      if (item === this.game.emptyEquipmentItem) {
        addRunesButton.onclick = () => this.addExistingRunesCallback(quantity);
        addRunesButton.append(
          templateLangString("GOLBIN_RAID", "POPUP_14", { num: `${quantity}` })
        );
      } else {
        addRunesButton.onclick = () => this.addRunesCallback(item, quantity);
        addRunesButton.append(
          createElement("img", {
            className: "skill-icon-xs mr-2",
            attributes: [["src", item.media]],
          }),
          `${quantity} x ${item.name}`
        );
      }
      nodes.push(addRunesButton, createElement("br"));
    });
    return nodes;
  }
  getFoodSelectionNodes(selection) {
    const nodes = [];
    selection.forEach(({ item, quantity }) => {
      const addFoodButton = createElement("button", {
        className: "btn btn-outline-success m-2 w-80",
      });
      addFoodButton.onclick = () => this.addFoodCallback(item, quantity);
      addFoodButton.append(
        createElement("img", {
          className: "skill-icon-xs mr-2",
          attributes: [["src", item.media]],
        }),
        `${quantity} x ${item.name} (+${this.player.getFoodHealing(
          item
        )} ${getLangString("MENU_TEXT", "HP")})`
      );
      nodes.push(addFoodButton, createElement("br"));
      if (this.player.food.currentSlot.item !== item) {
        const itemName =
          this.player.food.currentSlot.item === this.game.emptyFoodItem
            ? getLangString("GOLBIN_RAID", "POPUP_9")
            : this.player.food.currentSlot.item.name;
        nodes.push(
          createElement("small", {
            text: `${getLangString("GOLBIN_RAID", "POPUP_12")} ${itemName}`,
          })
        );
      } else {
        nodes.push(
          createElement("small", {
            text: getLangString("GOLBIN_RAID", "POPUP_18"),
          })
        );
      }
      nodes.push(createElement("br"));
    });
    return nodes;
  }
  renderLocation() {
    const floorText = ` ${templateString(getLangString("GOLBIN_RAID", "WAVE"), {
      num1: `${this.wave + 1}`,
    })}`;
    const countText = ` ${templateString(
      getLangString("GOLBIN_RAID", "PROGRESS"),
      { qty1: `${this.waveProgress + 1}`, qty2: `${this.waveLength}` }
    )}`;
    const effectText = "";
    const areaName = getLangString("GOLBIN_RAID", "AREA_NAME");
    const areaMedia = "assets/media/pets/golden_golbin.svg";
    combatMenus.locationElements.name.textContent = areaName;
    combatMenus.locationElements.floorCount.textContent = floorText;
    combatMenus.locationElements.count.textContent = countText;
    combatMenus.locationElements.areaEffect.textContent = effectText;
    combatMenus.locationElements.image.src = areaMedia;
    this.rendersRequired.location = false;
  }
  renderStartMenu() {
    if (this.isPaused) {
      hideElement(document.getElementById("raid-start-button"));
      showElement(document.getElementById("raid-continue-button"));
    } else {
      showElement(document.getElementById("raid-start-button"));
      hideElement(document.getElementById("raid-continue-button"));
    }
    this.renderDifficulty();
  }
  addMonsterStat(statID, amount = 1) {}
  addCombatStat(statID, amount = 1) {}
  setDefaultEquipment() {
    this.player.setEquipmentToDefault();
    this.bank.empty();
    this.startingRunes.forEach(({ item, quantity }) => {
      this.bank.addItem(
        item,
        quantity + this.player.modifiers.golbinRaidIncreasedStartingRuneCount,
        false,
        false,
        true,
        false
      );
    });
  }
  changeDifficulty(newDifficulty) {
    this.selectedDifficulty = newDifficulty;
    this.renderDifficulty();
  }
  renderDifficulty() {
    const diffToSet = this.isPaused
      ? this._setDifficulty
      : this.selectedDifficulty;
    Object.values(RaidManager.difficulties).forEach((data, i) => {
      const btn = document.getElementById(`raid-difficulty-btn-${i}`);
      if (i === diffToSet) {
        btn.classList.add(data.selectedClass);
        btn.classList.remove(data.unselectedClass);
      } else {
        btn.classList.remove(data.selectedClass);
        btn.classList.add(data.unselectedClass);
      }
      btn.disabled = this.isPaused;
    });
    const diffText = document.getElementById("raid-difficulty-text");
    const newDiffText = new DocumentFragment();
    const diffData = RaidManager.difficulties[diffToSet];
    newDiffText.append(
      createElement("li", {
        text: getLangString(
          "GOLBIN_RAID",
          `TRIANGLE_${diffData.combatTriangle}`
        ),
      }),
      createElement("li", {
        text: templateLangString("GOLBIN_RAID", "COIN_MODIFIER", {
          mult: formatFixed(diffData.coinMultiplier, 1),
        }),
      }),
      createElement("li", {
        text: templateLangString("GOLBIN_RAID", "HP_MODIFIER", {
          mult: formatFixed(1 + diffData.enemyHPModifier / 100, 2),
        }),
      })
    );
    if (diffData.positiveModifierCount > 0) {
      newDiffText.append(
        createElement("li", {
          text: templateLangString("GOLBIN_RAID", "MODIFIER_CHOICE", {
            posCount: `${diffData.positiveModifierCount}`,
            negCount: `${diffData.negativeModifierCount}`,
            waveCount: "10",
          }),
        })
      );
    }
    if (diffData.enemyAccuracyModifier > 0) {
      newDiffText.append(
        createElement("li", {
          text: templateLangString("GOLBIN_RAID", "STAT_MODIFIER", {
            mult: formatFixed(1 + diffData.enemyAccuracyModifier / 100, 1),
          }),
        })
      );
    }
    if (diffData.hasSecondPassiveChange) {
      newDiffText.append(
        createElement("li", {
          text: getLangString("GOLBIN_RAID", "SECOND_PASSIVE"),
        })
      );
    }
    diffText.textContent = "";
    diffText.append(newDiffText);
  }
  rollForCrateItem() {
    if (this.crateItems.length === this.ownedCrateItems.size)
      throw new Error("All Golbin Crate Items already ownded");
    const totalWeight = this.crateItems.reduce((sum, item) => {
      if (this.ownedCrateItems.has(item.item)) return sum;
      return sum + item.weight;
    }, 0);
    const crateRoll = Math.floor(Math.random() * totalWeight);
    let cumWeight = 0;
    const itemRolled = this.crateItems.find((item) => {
      if (this.ownedCrateItems.has(item.item)) return false;
      cumWeight += item.weight;
      return crateRoll < cumWeight;
    });
    if (itemRolled === undefined)
      throw new Error("Error rolling crate item, could not find item.");
    return itemRolled;
  }
  openGolbinCrate() {
    const item = this.rollForCrateItem();
    this.fireCrateModal(item);
    this.ownedCrateItems.add(item.item);
  }
  fireCrateModal(crateItem) {
    const modalBody = createElement("div", {
      classList: ["media", "d-flex", "align-items-center", "flex-column"],
    });
    modalBody.style.overflow = "clip";
    const animationCont = createElement("div", {
      classList: ["lootBoxAnimationCont"],
    });
    const crateCont = createElement("div", { classList: ["crateContainer"] });
    const corner0 = createElement("img", {
      classList: ["crateCorner", "crateCorner0"],
      attributes: [["src", cdnMedia("assets/media/shop/golbin_crate.png")]],
    });
    crateCont.append(
      corner0,
      createElement("img", {
        classList: ["crateCorner", "crateCorner1"],
        attributes: [["src", cdnMedia("assets/media/shop/golbin_crate.png")]],
      }),
      createElement("img", {
        classList: ["crateCorner", "crateCorner2"],
        attributes: [["src", cdnMedia("assets/media/shop/golbin_crate.png")]],
      }),
      createElement("img", {
        classList: ["crateCorner", "crateCorner3"],
        attributes: [["src", cdnMedia("assets/media/shop/golbin_crate.png")]],
      })
    );
    const openCont = createElement("div", {
      classList: ["lootboxOpenCont", `lootbox${CrateRarity[crateItem.weight]}`],
    });
    const rayCont = createElement("div");
    rayCont.append(
      createElement("div", { classList: ["lootboxRay0"] }),
      createElement("div", { classList: ["lootboxRay1"] })
    );
    openCont.append(
      rayCont,
      createElement("img", {
        classList: ["lootboxImg"],
        attributes: [["src", crateItem.item.media]],
      }),
      createElement("span", {
        classList: ["lootboxTextTop"],
        text: getLangString("GOLBIN_RAID", CrateRarity[crateItem.weight]),
      }),
      createElement("span", {
        classList: ["lootboxTextBot"],
        text: crateItem.item.name,
      })
    );
    animationCont.append(openCont, crateCont);
    modalBody.append(animationCont);
    const item = crateItem.item;
    if (item instanceof EquipmentItem) {
      const viewStatsButton = createElement("button", {
        classList: ["btn", "btn-info", "invisible", "mt-2"],
        text: getLangString("MENU_TEXT", "VIEW_STATS"),
      });
      viewStatsButton.onclick = () => viewItemStats(item, false);
      corner0.onanimationend = () => {
        viewStatsButton.classList.remove("invisible");
      };
      modalBody.append(viewStatsButton);
    }
    addModalToQueue({
      title: getLangString("GOLBIN_RAID", "OPENING_CRATE"),
      html: modalBody,
      allowOutsideClick: false,
      showConfirmButton: true,
    });
  }
  setRandomModifierSelection(isPositive, amount = 3) {
    const randomSelection = getExclusiveRandomArrayElements(
      RaidManager.possibleModifiers,
      amount
    );
    this.randomModifiersBeingSelected = [];
    randomSelection.forEach((randomSelection) => {
      let value = rollInteger(1, 5);
      if (randomSelection.multiplier !== undefined)
        value *= randomSelection.multiplier;
      this.randomModifiersBeingSelected.push({
        key: randomSelection.key,
        value,
      });
    });
    this.isSelectingPositiveModifier = isPositive;
  }
  fireRandomModifierSelection() {
    const modalBody = createElement("div", {
      classList: ["media", "d-flex", "align-items-center", "flex-column"],
    });
    let posHead = getLangString("GOLBIN_RAID", "GIVES_YOU");
    let negHead = getLangString("GOLBIN_RAID", "GIVES_GOLBINS");
    let buttonStyle = "btn-outline-success";
    if (!this.isSelectingPositiveModifier) {
      posHead = getLangString("GOLBIN_RAID", "GIVES_GOLBINS");
      negHead = getLangString("GOLBIN_RAID", "GIVES_YOU");
      buttonStyle = "btn-outline-danger";
    }
    this.randomModifiersBeingSelected.forEach((selection, idx) => {
      const selectionButton = createElement("button", {
        classList: ["btn", buttonStyle, "m-2", "w-80"],
      });
      selectionButton.append(
        createElement("span", {
          text: modifierData[selection.key].isNegative ? negHead : posHead,
        }),
        createElement("br"),
        createElement("span", {
          text: printPlayerModifier(selection.key, selection.value)[0],
        })
      );
      selectionButton.onclick = () => this.selectRandomModifier(idx);
      modalBody.append(selectionButton);
    });
    const pauseButton = createElement("button", {
      text: getLangString("GOLBIN_RAID", "PAUSE_RAID"),
      classList: ["btn", "btn-danger", "m-2", "w-80"],
    });
    pauseButton.onclick = () => this.closeModalAndPause();
    modalBody.append(pauseButton);
    SwalLocale.fire({
      title: getLangString(
        "GOLBIN_RAID",
        `SELECT_${
          this.isSelectingPositiveModifier ? "POSITIVE" : "NEGATIVE"
        }_MOD`
      ),
      html: modalBody,
      allowOutsideClick: false,
      showConfirmButton: false,
      allowEscapeKey: false,
    });
  }
  fireViewModifiersModal() {
    const modalBody = createElement("div", {
      classList: ["media", "d-flex", "align-items-center", "flex-column"],
    });
    const playerMods = new MappedModifiers();
    playerMods.addArrayModifiers(this.randomPlayerModifiers);
    const golbinMods = new MappedModifiers();
    golbinMods.addArrayModifiers(this.randomEnemyModifiers);
    modalBody.append(
      createElement("h5", {
        text: getLangString("GOLBIN_RAID", "GIVES_YOU"),
        classList: ["mb-1"],
      }),
      ...playerMods.getActiveModifierDescriptions().map(([text, textClass]) => {
        return createElement("h5", {
          classList: [
            "font-w400",
            "font-size-sm",
            "m-1",
            textClass === "text-success" ? "text-success" : "text-danger",
          ],
          text: text,
        });
      })
    );
    modalBody.append(
      createElement("h5", {
        text: getLangString("GOLBIN_RAID", "GIVES_GOLBINS"),
        classList: ["mb-1"],
      }),
      ...golbinMods.getActiveModifierDescriptions().map(([text, textClass]) => {
        return createElement("h5", {
          classList: [
            "font-w400",
            "font-size-sm",
            "m-1",
            textClass === "text-success" ? "text-danger" : "text-success",
          ],
          text: text,
        });
      })
    );
    SwalLocale.fire({
      title: getLangString("GOLBIN_RAID", "ALL_MODIFIERS"),
      html: modalBody,
    });
  }
  selectRandomModifier(index) {
    const selection = this.randomModifiersBeingSelected[index];
    if (selection === undefined) throw new Error("Invalid index selected.");
    if (
      modifierData[selection.key].isNegative !==
      this.isSelectingPositiveModifier
    ) {
      this.randomPlayerModifiers.push(selection);
    } else {
      this.randomEnemyModifiers.push(selection);
    }
    if (this.isSelectingPositiveModifier) this.posModsSelected++;
    else this.negModsSelected++;
    Swal.close();
    this.continueModifierSelection();
  }
  continueModifierSelection() {
    this.randomModifiersBeingSelected = [];
    if (this.isSelectingPositiveModifier) {
      if (this.posModsSelected < this.difficulty.positiveModifierCount) {
        this.setRandomModifierSelection(true);
        this.fireRandomModifierSelection();
      } else {
        this.isSelectingPositiveModifier = false;
        this.continueModifierSelection();
      }
    } else {
      if (this.negModsSelected < this.difficulty.negativeModifierCount) {
        this.setRandomModifierSelection(false);
        this.fireRandomModifierSelection();
      } else if (this.state == RaidState.SelectingModifiersStart) {
        this.startRaid();
      } else {
        this.state = RaidState.SelectingCategory;
        this.fireCategorySelectModal();
      }
    }
  }
  encode(writer) {
    super.encode(writer);
    writer.writeCombatModifierArray(this.randomPlayerModifiers);
    writer.writeCombatModifierArray(this.randomEnemyModifiers);
    writer.writeUint8(this.state);
    writer.writeUint8(this._setDifficulty);
    this.bank.encode(writer);
    writer.writeUint32(this.wave);
    writer.writeUint32(this.waveProgress);
    writer.writeUint32(this.killCount);
    writer.writeUint32(this.startTimestamp);
    writer.writeSet(this.ownedCrateItems, writeNamespaced);
    writer.writeCombatModifierArray(this.randomModifiersBeingSelected);
    writer.writeBoolean(this.isSelectingPositiveModifier);
    const writeItemSelection = (object, writer) => {
      writer.writeNamespacedObject(object.item);
      writer.writeUint32(object.quantity);
      writer.writeBoolean(object.isAlt);
    };
    writer.writeArray(this.itemsBeingSelected.weapons, writeItemSelection);
    writer.writeArray(this.itemsBeingSelected.armour, writeItemSelection);
    writer.writeArray(this.itemsBeingSelected.ammo, writeItemSelection);
    writer.writeArray(this.itemsBeingSelected.runes, writeItemSelection);
    writer.writeArray(this.itemsBeingSelected.food, writeItemSelection);
    writer.writeArray(this.itemsBeingSelected.passives, writeItemSelection);
    writer.writeUint8(RaidItemSelectionID[this.itemCategoryBeingSelected]);
    writer.writeUint8(this.posModsSelected);
    writer.writeUint8(this.negModsSelected);
    writer.writeBoolean(this.isPaused);
    writer.writeArray(this.history, (history, writer) => {
      writer.writeArray(history.skillLevels, (level, writer) =>
        writer.writeUint32(level)
      );
      writer.writeArray(history.equipment, writeNamespaced);
      writer.writeUint32(history.ammo);
      writer.writeArray(history.inventory, writeItemQuantity);
      writeItemQuantity(history.food, writer);
      writer.writeUint32(history.wave);
      writer.writeUint32(history.kills);
      writer.writeFloat64(history.timestamp);
      writer.writeUint32(history.raidCoinsEarned);
      writer.writeUint8(history.difficulty);
    });
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    this.randomPlayerModifiers = reader.getCombatModifierArray();
    this.randomEnemyModifiers = reader.getCombatModifierArray();
    this.state = reader.getUint8();
    this._setDifficulty = reader.getUint8();
    this.bank.decode(reader, version);
    this.wave = reader.getUint32();
    this.waveProgress = reader.getUint32();
    this.killCount = reader.getUint32();
    this.startTimestamp = reader.getUint32();
    this.ownedCrateItems = reader.getSet((reader) => {
      const item = reader.getNamespacedObject(this.game.items);
      if (typeof item !== "string") return item;
      else if (item.startsWith("melvor"))
        return this.game.items.getDummyObject(item, DummyItem, this.game);
      return undefined;
    });
    this.randomModifiersBeingSelected = reader.getCombatModifierArray();
    this.isSelectingPositiveModifier = reader.getBoolean();
    const getSelection = (itemRegistry) => {
      return (reader) => {
        const item = reader.getNamespacedObject(itemRegistry);
        const quantity = reader.getUint32();
        const isAlt = reader.getBoolean();
        if (typeof item === "string") return undefined;
        return { item, quantity, isAlt };
      };
    };
    this.itemsBeingSelected.weapons = reader.getArray(
      getSelection(this.game.items.weapons)
    );
    this.itemsBeingSelected.armour = reader.getArray(
      getSelection(this.game.items.equipment)
    );
    this.itemsBeingSelected.ammo = reader.getArray(
      getSelection(this.game.items.equipment)
    );
    this.itemsBeingSelected.runes = reader.getArray(
      getSelection(this.game.items)
    );
    this.itemsBeingSelected.food = reader.getArray(
      getSelection(this.game.items.food)
    );
    this.itemsBeingSelected.passives = reader.getArray(
      getSelection(this.game.items.equipment)
    );
    this.itemCategoryBeingSelected = RaidItemSelectionID[reader.getUint8()];
    this.posModsSelected = reader.getUint8();
    this.negModsSelected = reader.getUint8();
    this.isPaused = reader.getBoolean();
    const readFood = (reader) => {
      let item = reader.getNamespacedObject(this.game.items);
      const quantity = reader.getInt32();
      if (typeof item === "string") item = this.game.emptyFoodItem;
      return { item, quantity };
    };
    this.history = reader.getArray((reader) => {
      return {
        skillLevels: reader.getArray((reader) => reader.getUint32()),
        equipment: reader.getArray((reader) => {
          const equipment = reader.getNamespacedObject(
            this.game.items.equipment
          );
          if (typeof equipment !== "string") return equipment;
          else if (equipment.startsWith("melvor"))
            return this.game.items.equipment.getDummyObject(
              equipment,
              DummyEquipmentItem,
              this.game
            );
          else return undefined;
        }),
        ammo: reader.getUint32(),
        inventory: reader.getArray((reader) => {
          const item = reader.getNamespacedObject(this.game.items);
          const quantity = reader.getInt32();
          if (typeof item !== "string") return { item, quantity };
          else if (item.startsWith("melvor"))
            return {
              item: this.game.items.getDummyObject(item, DummyItem, this.game),
              quantity,
            };
          return undefined;
        }),
        food: readFood(reader),
        wave: reader.getUint32(),
        kills: reader.getUint32(),
        timestamp: reader.getFloat64(),
        raidCoinsEarned: reader.getUint32(),
        difficulty: reader.getUint8(),
      };
    });
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    this.randomPlayerModifiers = reader.getCombatModifierArray();
    this.randomEnemyModifiers = reader.getCombatModifierArray();
    this.state = reader.getNumber();
    this._setDifficulty = reader.getNumber();
    const bankReader = reader.getVariableLengthChunk();
    for (let i = 0; i < bankReader.dataLength / 2; i++) {
      const item = this.game.getItemFromOldID(bankReader.getNumber(), idMap);
      const quantity = bankReader.getNumber();
      if (item !== undefined)
        this.bank.addItem(item, quantity, false, false, true, false);
    }
    this.wave = reader.getNumber();
    this.waveProgress = reader.getNumber();
    this.killCount = reader.getNumber();
    this.startTimestamp = reader.getNumber();
    this.ownedCrateItems = new Set();
    reader
      .getVariableLengthChunk()
      .getRawData()
      .forEach((id) => {
        if (id === 1199) {
          return;
        }
        const newID = idMap.items[id];
        let item = this.game.items.getObjectByID(newID);
        if (item === undefined)
          item = this.game.items.getDummyObject(newID, DummyItem, this.game);
        this.ownedCrateItems.add(item);
      });
    this.randomModifiersBeingSelected = reader.getCombatModifierArray();
    this.isSelectingPositiveModifier = reader.getBool();
    const oldItemSelection = reader.getRaidSelectionArray();
    this.itemCategoryBeingSelected = RaidItemSelectionID[reader.getNumber()];
    const getSelection = (registry) => {
      const selection = [];
      oldItemSelection.forEach(({ itemID, quantity, isAlt }) => {
        const item = registry.getObjectByID(idMap.items[itemID]);
        if (item !== undefined) selection.push({ item, quantity, isAlt });
      });
      return selection;
    };
    switch (this.itemCategoryBeingSelected) {
      case "weapons":
        this.itemsBeingSelected.weapons = getSelection(this.game.items.weapons);
        break;
      case "armour":
      case "ammo":
      case "passives":
        this.itemsBeingSelected[this.itemCategoryBeingSelected] = getSelection(
          this.game.items.equipment
        );
        break;
      case "food":
        this.itemsBeingSelected.food = getSelection(this.game.items.food);
        break;
      case "runes":
        this.itemsBeingSelected.runes = getSelection(this.game.items);
        break;
    }
    this.posModsSelected = reader.getNumber();
    this.negModsSelected = reader.getNumber();
    this.isPaused = reader.getBool();
  }
  convertFromOldFormat(save, idMap) {
    if (save.golbinRaidHistory !== undefined) {
      save.golbinRaidHistory.forEach((oldHistory) => {
        const equipment = [];
        oldHistory.equipment.forEach((itemID) => {
          const newID = idMap.items[itemID];
          let item = this.game.emptyEquipmentItem;
          if (itemID !== 0 && newID !== undefined)
            item = this.game.items.getObjectByID(newID);
          if (item === undefined)
            item = this.game.items.equipment.getDummyObject(
              newID,
              DummyEquipmentItem,
              this.game
            );
          if (!(item instanceof EquipmentItem)) return;
          equipment.push(item);
        });
        const inventory = [];
        oldHistory.inventory.forEach(({ id, qty }) => {
          const newID = idMap.items[id];
          let item = this.game.items.getObjectByID(newID);
          if (item === undefined && newID !== undefined)
            item = this.game.items.getDummyObject(newID, DummyItem, this.game);
          if (item !== undefined) inventory.push({ item, quantity: qty });
        });
        let foodItem = this.game.items.getObjectByID(
          idMap.items[oldHistory.food.itemID]
        );
        if (oldHistory.food.itemID === 0 || foodItem === undefined)
          foodItem = this.game.emptyFoodItem;
        const food = { item: foodItem, quantity: oldHistory.food.qty };
        const newHistory = {
          skillLevels: oldHistory.skillLevels,
          equipment,
          ammo: oldHistory.ammo,
          inventory,
          food,
          wave: oldHistory.wave,
          kills: oldHistory.kills,
          timestamp: oldHistory.timestamp,
          raidCoinsEarned: oldHistory.raidCoinsEarned,
          difficulty: oldHistory.difficulty,
        };
        this.history.push(newHistory);
      });
    }
    const golbin = this.game.monsters.getObjectByID("melvorD:Golbin");
    if (golbin !== undefined) {
      this.game.stats.Monsters.add(
        golbin,
        MonsterStats.KilledByPlayer,
        -this.game.stats.GolbinRaid.get(RaidStats.GolbinsKilled)
      );
    }
  }
  getGolbinRaidHistory(historyID) {
    const history = this.history[historyID];
    let html = "";
    let raidCoinsEarned = getLangString("MENU_TEXT", "QUESTION_MARKS");
    if (history.raidCoinsEarned !== undefined)
      raidCoinsEarned = formatNumber(history.raidCoinsEarned);
    html += `<div class="block-content">
          <div class="block block-rounded-double bg-combat-inner-dark text-center font-size-sm p-3">
          <span class="font-w400 text-combat-smoke">
        ${templateString(getLangString("GOLBIN_RAID", "HISTORY_6"), {
          difficulty: RaidManager.difficulties[history.difficulty].name,
        })}  | 
        ${templateString(getLangString("GOLBIN_RAID", "HISTORY_0"), {
          num: `${numberWithCommas(history.wave)}`,
        })}  | 
        ${templateString(getLangString("GOLBIN_RAID", "HISTORY_1"), {
          num: `${numberWithCommas(history.kills)}`,
        })}  | 
        ${templateString(getLangString("GOLBIN_RAID", "HISTORY_2"), {
          time: `${formatAsTimePeriod(history.timestamp)}`,
        })} |
        ${templateString(getLangString("GOLBIN_RAID", "HISTORY_3"), {
          num: `${numberWithCommas(raidCoinsEarned)}`,
        })} 
      </span><br>
          <img class="skill-icon-xs m-1" src="${cdnMedia(
            "assets/media/skills/attack/attack.svg"
          )}">${history.skillLevels[0]}
          <img class="skill-icon-xs m-1" src="${cdnMedia(
            "assets/media/skills/strength/strength.svg"
          )}">${history.skillLevels[1]}
          <img class="skill-icon-xs m-1" src="${cdnMedia(
            "assets/media/skills/defence/defence.svg"
          )}">${history.skillLevels[2]}
          <img class="skill-icon-xs m-1" src="${cdnMedia(
            "assets/media/skills/hitpoints/hitpoints.svg"
          )}">${history.skillLevels[3]}
          <img class="skill-icon-xs m-1" src="${cdnMedia(
            "assets/media/skills/ranged/ranged.svg"
          )}">${history.skillLevels[4]}
          <img class="skill-icon-xs m-1" src="${cdnMedia(
            "assets/media/skills/magic/magic.svg"
          )}">${history.skillLevels[5]}
          <br>`;
    if (history.food.item !== this.game.emptyFoodItem) {
      html += `${history.food.quantity}x <img class="skill-icon-xs m-1" src="${history.food.item.media}"><br>`;
    }
    history.equipment.forEach((item) => {
      if (item !== this.game.emptyEquipmentItem)
        html += `<img class="skill-icon-xs m-1" src="${item.media}">`;
    });
    html += `<br><span class="font-w400 text-combat-smoke">${templateString(
      getLangString("GOLBIN_RAID", "HISTORY_4"),
      { num: `${numberWithCommas(history.ammo)}` }
    )}</span></div></div>`;
    return html;
  }
  loadHistory() {
    $("#golbinraid-history").html();
    let html = "";
    for (let i = this.history.length - 1; i >= 0; i--) {
      try {
        html += this.getGolbinRaidHistory(i);
      } catch (_a) {
        this.history.splice(i, 1);
      }
    }
    $("#golbinraid-history").html(html);
  }
}
RaidManager.difficulties = {
  0: {
    combatTriangle: 0,
    coinMultiplier: 0.5,
    enemyHPModifier: -25,
    enemyAccuracyModifier: 0,
    enemyMaxHitModifier: 0,
    enemyEvasionModifier: 0,
    negativeModifierCount: 0,
    positiveModifierCount: 0,
    selectedClass: "btn-success",
    unselectedClass: "btn-outline-success",
    hasSecondPassiveChange: false,
    get name() {
      return getLangString("COMBAT_MISC", "23");
    },
  },
  1: {
    combatTriangle: 0,
    coinMultiplier: 1,
    enemyHPModifier: 0,
    enemyAccuracyModifier: 0,
    enemyMaxHitModifier: 0,
    enemyEvasionModifier: 0,
    negativeModifierCount: 1,
    positiveModifierCount: 1,
    selectedClass: "btn-warning",
    unselectedClass: "btn-outline-warning",
    hasSecondPassiveChange: false,
    get name() {
      return getLangString("COMBAT_MISC", "96");
    },
  },
  2: {
    combatTriangle: 1,
    coinMultiplier: 1.5,
    enemyHPModifier: 25,
    enemyAccuracyModifier: 10,
    enemyMaxHitModifier: 10,
    enemyEvasionModifier: 10,
    negativeModifierCount: 2,
    positiveModifierCount: 1,
    selectedClass: "btn-danger",
    unselectedClass: "btn-outline-danger",
    hasSecondPassiveChange: false,
    get name() {
      return getLangString("COMBAT_MISC", "25");
    },
  },
};
RaidManager.possibleModifiers = [
  { key: "increasedGlobalAccuracy" },
  { key: "decreasedGlobalAccuracy" },
  { key: "increasedMeleeAccuracyBonus" },
  { key: "decreasedMeleeAccuracyBonus" },
  { key: "increasedMeleeMaxHit" },
  { key: "decreasedMeleeMaxHit" },
  { key: "increasedMeleeEvasion" },
  { key: "decreasedMeleeEvasion" },
  { key: "increasedRangedAccuracyBonus" },
  { key: "decreasedRangedAccuracyBonus" },
  { key: "increasedRangedMaxHit" },
  { key: "decreasedRangedMaxHit" },
  { key: "increasedRangedEvasion" },
  { key: "decreasedRangedEvasion" },
  { key: "increasedMagicAccuracyBonus" },
  { key: "decreasedMagicAccuracyBonus" },
  { key: "increasedMagicMaxHit" },
  { key: "decreasedMagicMaxHit" },
  { key: "increasedMagicEvasion" },
  { key: "decreasedMagicEvasion" },
  { key: "increasedMaxHitFlat" },
  { key: "decreasedMaxHitFlat" },
  { key: "increasedMaxHitPercent" },
  { key: "decreasedMaxHitPercent" },
  { key: "increasedDamageReduction" },
  { key: "decreasedDamageReduction" },
  { key: "increasedHPRegenFlat" },
  { key: "decreasedAttackInterval", multiplier: 50 },
  { key: "increasedAttackInterval", multiplier: 50 },
  { key: "decreasedAttackIntervalPercent" },
  { key: "increasedAttackIntervalPercent" },
  { key: "increasedMaxHitpoints" },
  { key: "decreasedMaxHitpoints" },
  { key: "increasedFlatMaxHitpoints" },
  { key: "decreasedFlatMaxHitpoints" },
  { key: "increasedReflectDamage" },
  { key: "increasedFlatReflectDamage" },
  { key: "increasedRolledReflectDamage" },
  { key: "increasedLifesteal" },
  { key: "increasedMeleeLifesteal" },
  { key: "increasedRangedLifesteal" },
  { key: "increasedMagicLifesteal" },
  { key: "increasedBleedLifesteal" },
  { key: "increasedBurnLifesteal" },
  { key: "increasedPoisonLifesteal" },
  { key: "increasedMeleeCritChance" },
  { key: "increasedRangedCritChance" },
  { key: "increasedMagicCritChance" },
  { key: "increasedMinHitBasedOnMaxHit" },
  { key: "decreasedMinHitBasedOnMaxHit" },
  { key: "increasedFlatMinHit" },
  { key: "decreasedFlatMinHit" },
  { key: "increasedDamageTaken" },
  { key: "decreasedDamageTaken" },
  { key: "increasedConfusion" },
  { key: "increasedDecay" },
  { key: "increasedGlobalEvasion" },
  { key: "decreasedGlobalEvasion" },
];
var RaidItemSelectionID;
(function (RaidItemSelectionID) {
  RaidItemSelectionID[(RaidItemSelectionID["weapons"] = 0)] = "weapons";
  RaidItemSelectionID[(RaidItemSelectionID["armour"] = 1)] = "armour";
  RaidItemSelectionID[(RaidItemSelectionID["ammo"] = 2)] = "ammo";
  RaidItemSelectionID[(RaidItemSelectionID["runes"] = 3)] = "runes";
  RaidItemSelectionID[(RaidItemSelectionID["food"] = 4)] = "food";
  RaidItemSelectionID[(RaidItemSelectionID["passives"] = 5)] = "passives";
})(RaidItemSelectionID || (RaidItemSelectionID = {}));
var RaidDifficulty;
(function (RaidDifficulty) {
  RaidDifficulty[(RaidDifficulty["Easy"] = 0)] = "Easy";
  RaidDifficulty[(RaidDifficulty["Medium"] = 1)] = "Medium";
  RaidDifficulty[(RaidDifficulty["Hard"] = 2)] = "Hard";
})(RaidDifficulty || (RaidDifficulty = {}));
var RaidState;
(function (RaidState) {
  RaidState[(RaidState["Unstarted"] = 0)] = "Unstarted";
  RaidState[(RaidState["SelectingModifiersStart"] = 1)] =
    "SelectingModifiersStart";
  RaidState[(RaidState["FightingWave"] = 2)] = "FightingWave";
  RaidState[(RaidState["SelectingCategory"] = 3)] = "SelectingCategory";
  RaidState[(RaidState["SelectingItem"] = 4)] = "SelectingItem";
  RaidState[(RaidState["SelectingModifiersWave"] = 5)] =
    "SelectingModifiersWave";
})(RaidState || (RaidState = {}));
