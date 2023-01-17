"use strict";
class MiningRenderQueue extends GatheringSkillRenderQueue {
  constructor() {
    super(...arguments);
    this.rockHP = new Set();
    this.rockStatus = new Set();
    this.rockRates = false;
    this.rockUnlock = false;
    this.respawnProgress = new Set();
  }
}
const rockMenus = new Map();
function loadMiningOres() {
  const oreContainer = document.getElementById("mining-ores-container");
  const sortedActions = game.mining.actions.allObjects.sort(
    (a, b) => a.level - b.level
  );
  sortedActions.forEach((rock) => {
    const rockMenu = createElement("mining-rock", {
      classList: ["col-6", "col-lg-4", "col-xl-3"],
    });
    rockMenus.set(rock, rockMenu);
    oreContainer.append(rockMenu);
    rockMenu.setRock(rock);
  });
  let miningOres =
    '<div class="col-6 col-lg-4 col-xl-3" id="mining-ore-locked">';
  miningOres +=
    '<div class="block block-rounded block-link-pop border-top border-danger border-4x justify-vertical-center">';
  miningOres += '<div class="block-content block-content-full bg-light pb-0">';
  miningOres +=
    '<div class="font-size-sm font-w600 text-center text-muted mb-3">';
  miningOres +=
    `<span id="mining-locked-text">${getLangString(
      "MENU_TEXT",
      "LOCKED"
    )}</span><br><img class="mining-ore-img m-3" src="` +
    CDNDIR +
    'assets/media/skills/mining/mining.svg"><br>';
  miningOres += `<span class="badge badge-danger badge-pill mb-1" id="mining-next-level">${templateLangString(
    "MENU_TEXT",
    "LEVEL",
    { level: "90" }
  )}</span>`;
  miningOres += `<div class="text-center font-size-sm font-w600 text-danger badge-pill mb-1 d-none" id="mining-pickaxe-required"></div>`;
  miningOres += "</div>";
  miningOres += "</div>";
  miningOres += "</div></div>";
  $("#mining-ores-container").append(miningOres);
}
function localizeMining() {
  $("#mining-locked-text").text(getLangString("MENU_TEXT", "LOCKED"));
  game.mining.onLoad();
}
class MiningRock extends SingleProductRecipe {
  constructor(namespace, data, game) {
    var _a;
    super(namespace, data, game);
    this.currentHP = 0;
    this.maxHP = 0;
    this.isRespawning = false;
    this._name = data.name;
    this._media = data.media;
    this.baseRespawnInterval = data.baseRespawnInterval;
    this.baseQuantity = data.baseQuantity;
    this.totalMasteryRequired =
      (_a = data.totalMasteryRequired) !== null && _a !== void 0 ? _a : 0;
    this.hasPassiveRegen = data.hasPassiveRegen;
    this.giveGems = data.giveGems;
    this.superiorGemChance = data.superiorGemChance;
    if (data.shopItemPurchased !== undefined) {
      const purchase = game.shop.purchases.getObjectByID(
        data.shopItemPurchased
      );
      if (purchase === undefined)
        throw new Error(
          `Error constructing MiningRock with id: ${this.id}. Purchase with id: ${data.shopItemPurchased} is not registered.`
        );
      this.shopItemPurchased = purchase;
    }
    if (data.fixedMaxHP !== undefined) this.fixedMaxHP = data.fixedMaxHP;
    this.type = data.type;
    if (data.gemVeinWeight !== undefined)
      this.gemVeinWeight = data.gemVeinWeight;
  }
  get media() {
    return this.getMediaURL(this._media);
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("ORE_NAME", this.localID);
    }
  }
  get giveSuperiorGems() {
    return this.superiorGemChance !== undefined;
  }
}
class Mining extends GatheringSkill {
  constructor(namespace, game) {
    super(namespace, "Mining", game);
    this._media = "assets/media/skills/mining/mining.svg";
    this.renderQueue = new MiningRenderQueue();
    this.baseInterval = 3000;
    this.baseRockHP = 5;
    this.passiveRegenInterval = 10000;
    this.tier3PoolWasActive = false;
    this.rockRespawnTimers = new Map();
    this.passiveRegenTimer = new Timer("Skill", () => this.regenRockHP());
    this.gemVeins = [];
    this.totalGemVeinWeight = 0;
  }
  getTotalUnlockedMasteryActions() {
    return this.actions.reduce((previous, rock) => {
      if (
        this.level >= rock.level &&
        this.totalCurrentMasteryLevel > rock.totalMasteryRequired
      )
        previous++;
      return previous;
    }, 0);
  }
  get actionInterval() {
    return this.modifyInterval(this.baseInterval, this.activeRock);
  }
  get actionLevel() {
    return this.activeRock.level;
  }
  get masteryAction() {
    return this.activeRock;
  }
  get masteryModifiedInterval() {
    return this.actionInterval;
  }
  get activeRock() {
    if (this.selectedRock === undefined)
      throw new Error("Tried to get active rock data, but none is selected.");
    return this.selectedRock;
  }
  registerData(namespace, data) {
    var _a;
    super.registerData(namespace, data);
    (_a = data.rockData) === null || _a === void 0
      ? void 0
      : _a.forEach((data) => {
          this.actions.registerObject(
            new MiningRock(namespace, data, this.game)
          );
        });
    if (data.coalItemID !== undefined)
      this.coalItem = this.getItemForRegistration(data.coalItemID);
    if (data.runestoneItemID !== undefined)
      this.runestoneItem = this.getItemForRegistration(data.runestoneItemID);
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.actions.forEach((action) => {
      if (action.gemVeinWeight !== undefined) {
        this.gemVeins.push({ weight: action.gemVeinWeight, rock: action });
        this.totalGemVeinWeight += action.gemVeinWeight;
      }
    });
    this.sortedMasteryActions = this.actions.allObjects.sort(
      (a, b) => a.level - b.level
    );
    this.milestones.push(...this.actions.allObjects);
    this.sortMilestones();
  }
  getFlatIntervalModifier(action) {
    let modifier = super.getFlatIntervalModifier(action);
    if (this.isPoolTierActive(2)) modifier -= 200;
    return modifier;
  }
  getUncappedDoublingChance(action) {
    let chance = super.getUncappedDoublingChance(action);
    const masteryLevel = this.getMasteryLevel(action);
    chance += Math.floor(masteryLevel / 10);
    if (masteryLevel >= 99) chance += 6;
    chance +=
      this.game.modifiers.increasedChanceToDoubleOres -
      this.game.modifiers.decreasedChanceToDoubleOres;
    return chance;
  }
  getMasteryXPModifier(action) {
    let modifier = super.getMasteryXPModifier(action);
    if (this.isPoolTierActive(0)) modifier += 5;
    return modifier;
  }
  canMineOre(ore) {
    return (
      ore.level <= this.level &&
      (ore.totalMasteryRequired > 0 ||
        this.totalCurrentMasteryLevel >= ore.totalMasteryRequired) &&
      (ore.shopItemPurchased === undefined ||
        this.game.shop.isUpgradePurchased(ore.shopItemPurchased))
    );
  }
  passiveTick() {
    if (this.rockRespawnTimers.size)
      this.rockRespawnTimers.forEach((timer) => timer.tick());
    this.passiveRegenTimer.tick();
  }
  getErrorLog() {
    var _a;
    return `${super.getErrorLog()}
Selected Rock ID: ${
      (_a = this.selectedRock) === null || _a === void 0 ? void 0 : _a.id
    }
Active Rock Data:
${this.actions.allObjects
  .map((rock) => {
    return `id: ${rock.id}; isRespawning: ${rock.isRespawning}; currentHP: ${rock.currentHP}; maxHP: ${rock.maxHP};`;
  })
  .join("\n")}`;
  }
  onPageChange() {
    this.rockRespawnTimers.forEach((_, rock) => {
      this.renderQueue.respawnProgress.add(rock);
    });
    super.onPageChange();
  }
  onModifierChange() {
    super.onModifierChange();
    this.renderQueue.rockRates = true;
  }
  onEquipmentChange() {}
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.renderQueue.rockUnlock = true;
  }
  render() {
    super.render();
    this.renderRockRates();
    this.renderRespawnProgress();
    this.renderRockHP();
    this.renderProgressBar();
    this.renderRockStatus();
    this.renderRockUnlock();
  }
  renderRockRates() {
    if (!this.renderQueue.rockRates) return;
    this.actions.forEach((rock) => {
      const menu = rockMenus.get(rock);
      if (menu === undefined) return;
      let interval = this.modifyInterval(this.baseInterval, rock);
      const mxp = this.getMasteryXPToAddForAction(rock, interval);
      interval /= 1000;
      const xp = this.modifyXP(rock.baseExperience);
      const mpxp = this.getMasteryXPToAddToPool(mxp);
      menu.updateGrants(xp, mxp, mpxp, interval * 1000);
    });
    this.renderQueue.rockRates = false;
  }
  renderRockHP() {
    if (this.renderQueue.rockHP.size === 0) return;
    this.renderQueue.rockHP.forEach((rock) => {
      var _a;
      (_a = rockMenus.get(rock)) === null || _a === void 0
        ? void 0
        : _a.updateHP(rock);
    });
    this.renderQueue.rockHP.clear();
  }
  renderRockStatus() {
    if (this.renderQueue.rockStatus.size === 0) return;
    this.renderQueue.rockStatus.forEach((rock) => {
      var _a;
      const newStatus = rock === this.selectedRock ? "MINING" : "MINE";
      (_a = rockMenus.get(rock)) === null || _a === void 0
        ? void 0
        : _a.setStatus(newStatus);
    });
    this.renderQueue.rockStatus.clear();
  }
  renderProgressBar() {
    var _a;
    if (!this.renderQueue.progressBar) return;
    if (this.activeProgressRock !== this.selectedRock || !this.isActive) {
      this.stopActiveProgressBar();
    }
    if (this.isActive && this.selectedRock !== undefined) {
      (_a = rockMenus.get(this.selectedRock)) === null || _a === void 0
        ? void 0
        : _a.miningProgress.animateProgressFromTimer(this.actionTimer);
      this.activeProgressRock = this.selectedRock;
    }
    this.renderQueue.progressBar = false;
  }
  stopActiveProgressBar() {
    var _a;
    if (this.activeProgressRock !== undefined) {
      (_a = rockMenus.get(this.activeProgressRock)) === null || _a === void 0
        ? void 0
        : _a.miningProgress.stopAnimation();
      this.activeProgressRock = undefined;
    }
  }
  renderRespawnProgress() {
    if (this.renderQueue.respawnProgress.size === 0) return;
    this.renderQueue.respawnProgress.forEach((rock) => {
      const rockMenu = rockMenus.get(rock);
      if (rockMenu === undefined) return;
      const respawnTimer = this.rockRespawnTimers.get(rock);
      if (respawnTimer !== undefined) {
        rockMenu.hpProgress.setStyle("bg-warning");
        rockMenu.hpProgress.animateProgressFromTimer(respawnTimer);
      } else {
        rockMenu.hpProgress.setStyle("bg-danger");
        rockMenu.hpProgress.stopAnimation();
      }
    });
    this.renderQueue.respawnProgress.clear();
  }
  renderRockUnlock() {
    if (!this.renderQueue.rockUnlock) return;
    const lowestLevelLocked = this.actions.reduce((lowestLevelLocked, rock) => {
      const rockMenu = rockMenus.get(rock);
      if (rockMenu === undefined) return;
      if (
        rock.level > this.level ||
        (rock.shopItemPurchased !== undefined &&
          !this.game.shop.isUpgradePurchased(rock.shopItemPurchased))
      ) {
        hideElement(rockMenu);
        if (
          lowestLevelLocked === undefined ||
          lowestLevelLocked.level > rock.level
        ) {
          lowestLevelLocked = rock;
        }
      } else {
        showElement(rockMenu);
      }
      if (rock.totalMasteryRequired > 0) {
        if (this.totalCurrentMasteryLevel > rock.totalMasteryRequired) {
          rockMenu.hideRequirement();
        } else {
          rockMenu.setRequirement(
            templateLangString("MENU_TEXT", "DRAGON_ORE_REQ", {
              level: numberWithCommas(rock.totalMasteryRequired),
            })
          );
        }
      }
      return lowestLevelLocked;
    }, undefined);
    if (lowestLevelLocked === undefined) {
      $("#mining-ore-locked").addClass("d-none");
    } else {
      const lockedLevel = document.getElementById("mining-next-level");
      lockedLevel.textContent = templateLangString("MENU_TEXT", "LEVEL", {
        level: `${lowestLevelLocked.level}`,
      });
      if (this.level >= lowestLevelLocked.level) {
        lockedLevel.classList.replace("badge-danger", "badge-success");
      } else {
        lockedLevel.classList.replace("badge-success", "badge-danger");
      }
      const shopPurchase = document.getElementById("mining-pickaxe-required");
      if (lowestLevelLocked.shopItemPurchased !== undefined) {
        shopPurchase.classList.remove("d-none");
        shopPurchase.textContent = templateLangString(
          "MENU_TEXT",
          "REQUIRES_SHOP_PURCHASE",
          { purchaseName: lowestLevelLocked.shopItemPurchased.name }
        );
        showElement(shopPurchase);
        toggleDangerSuccess(
          shopPurchase,
          this.game.shop.isUpgradePurchased(lowestLevelLocked.shopItemPurchased)
        );
      } else hideElement(shopPurchase);
    }
    this.renderQueue.rockUnlock = false;
  }
  get rockHPPreserveChance() {
    return (
      this.game.modifiers.increasedChanceNoDamageMining -
      this.game.modifiers.decreasedChanceNoDamageMining
    );
  }
  get chanceToDoubleGems() {
    const baseChance = super.getUncappedDoublingChance();
    return clampValue(baseChance, 0, 100);
  }
  getRockGemChance(ore) {
    let gemChance = 1;
    if (ore.giveGems && this.activeRock.id !== "melvorTotH:Pure_Essence")
      gemChance += this.game.modifiers.increasedMiningGemChance;
    gemChance *= 1 + this.game.modifiers.increasedOffItemChance / 100;
    return gemChance;
  }
  getRockSuperiorGemChance(ore) {
    if (ore.superiorGemChance === undefined) return 0;
    let chance = ore.superiorGemChance;
    chance += this.game.modifiers.increasedChanceForQualitySuperiorGem;
    chance -= this.game.modifiers.decreasedChanceForQualitySuperiorGem;
    return chance;
  }
  onRockClick(rock) {
    if (rock.isRespawning) {
      this.game.stats.Mining.inc(MiningStats.EmptyOresMined);
    }
    const prevRockId = this.selectedRock;
    if (this.isActive && !this.stop()) return;
    if (rock.isRespawning) {
      notifyPlayer(this, getLangString("TOASTS", "ROCK_DEPLETED"), "danger");
    } else if (prevRockId !== rock && this.canMineOre(rock)) {
      this.selectedRock = rock;
      if (!this.start()) {
        this.selectedRock = undefined;
      } else {
        this.renderQueue.rockStatus.add(rock);
      }
    }
    this.render();
  }
  onStop() {
    this.renderQueue.rockStatus.add(this.activeRock);
    this.selectedRock = undefined;
  }
  onLoad() {
    super.onLoad();
    this.actions.forEach((rock) => {
      this.renderQueue.rockHP.add(rock);
      this.renderQueue.actionMastery.add(rock);
      if (rock.isRespawning) this.renderQueue.respawnProgress.add(rock);
    });
    this.renderQueue.rockRates = true;
    this.renderQueue.rockUnlock = true;
    if (!this.passiveRegenTimer.isActive)
      this.passiveRegenTimer.start(this.passiveRegenInterval);
    if (this.isActive) {
      this.renderQueue.progressBar = true;
      this.renderQueue.rockStatus.add(this.activeRock);
    }
  }
  encode(writer) {
    super.encode(writer);
    if (this.isActive) writer.writeNamespacedObject(this.activeRock);
    writer.writeArray(this.actions.allObjects, (rock, writer) => {
      writer.writeNamespacedObject(rock);
      writer.writeBoolean(rock.isRespawning);
      writer.writeUint32(rock.currentHP);
      writer.writeUint32(rock.maxHP);
    });
    writer.writeMap(this.rockRespawnTimers, writeNamespaced, writeEncodable);
    this.passiveRegenTimer.encode(writer);
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    if (this.isActive) {
      const selectedRock = reader.getNamespacedObject(this.actions);
      if (typeof selectedRock === "string") this.shouldResetAction = true;
      else this.selectedRock = selectedRock;
    }
    reader.getArray((reader) => {
      const rock = reader.getNamespacedObject(this.actions);
      const isRespawning = reader.getBoolean();
      const currentHP = reader.getUint32();
      const maxHP = reader.getUint32();
      if (!(typeof rock === "string")) {
        rock.isRespawning = isRespawning;
        rock.currentHP = currentHP;
        rock.maxHP = maxHP;
      }
    });
    this.rockRespawnTimers = reader.getMap(
      readNamespacedReject(this.actions),
      (reader, rock) => {
        if (rock === undefined) {
          const tempTimer = new Timer("Skill", () => {});
          tempTimer.decode(reader, version);
          return undefined;
        } else {
          const timer = new Timer("Skill", () => this.respawnRock(rock));
          timer.decode(reader, version);
          return timer;
        }
      }
    );
    this.passiveRegenTimer.decode(reader, version);
    if (this.shouldResetAction) this.resetActionState();
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    const getRock = (id) => {
      return this.actions.getObjectByID(idMap.miningOres[id]);
    };
    const selectedRockID = reader.getNumber();
    if (this.isActive) {
      this.selectedRock = getRock(selectedRockID);
      if (this.selectedRock === undefined) this.shouldResetAction = true;
    }
    const activeReader = reader.getVariableLengthChunk();
    for (let i = 0; i < activeReader.dataLength / 3; i++) {
      const rock = getRock(i);
      const isRespawning = activeReader.getBool();
      const currentHP = activeReader.getNumber();
      const maxHP = activeReader.getNumber();
      if (rock !== undefined) {
        rock.isRespawning = isRespawning;
        rock.currentHP = currentHP;
        rock.maxHP = maxHP;
      }
    }
    const timerReader = reader.getVariableLengthChunk();
    this.rockRespawnTimers.clear();
    for (let i = 0; i < timerReader.dataLength / 4; i++) {
      const rock = getRock(timerReader.getNumber());
      if (rock === undefined) {
        timerReader.getChunk(3);
      } else {
        const timer = new Timer("Skill", () => this.respawnRock(rock));
        timer.deserialize(timerReader.getChunk(3), version);
        this.rockRespawnTimers.set(rock, timer);
      }
    }
    this.passiveRegenTimer.deserialize(reader.getChunk(3), version);
    if (this.shouldResetAction) this.resetActionState();
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.miningOres[oldActionID];
  }
  setFromOldOffline(offline, idMap) {
    const rock = this.actions.getObjectByID(idMap.miningOres[offline.action]);
    if (rock !== undefined) this.onRockClick(rock);
  }
  preAction() {
    this.tier3PoolWasActive = this.isPoolTierActive(3);
  }
  get actionRewards() {
    const rewards = new Rewards(this.game);
    const actionEvent = new MiningActionEvent(this, this.activeRock);
    const oreItem = this.activeRock.product;
    let oreQty = this.activeRock.baseQuantity;
    switch (oreItem.id) {
      case "melvorD:Rune_Essence":
        if (this.game.modifiers.doubleRuneEssenceMining > 0)
          oreQty *= Math.pow(2, this.game.modifiers.doubleRuneEssenceMining);
        break;
      case "melvorD:Silver_Ore":
      case "melvorD:Gold_Ore":
        if (this.game.modifiers.doubleSilverGoldMining > 0)
          oreQty *= Math.pow(2, this.game.modifiers.doubleSilverGoldMining);
        break;
      case "melvorTotH:Meteorite_Ore":
        oreQty += this.game.modifiers.increasedMeteoriteOre;
        break;
    }
    if (rollPercentage(this.getDoublingChance(this.activeRock))) oreQty *= 2;
    if (this.activeRock.type === "Ore")
      oreQty *= Math.pow(2, this.game.modifiers.doubleOresMining);
    const chanceForExtraResource =
      this.game.modifiers.getSkillModifierValue(
        "increasedChanceAdditionalSkillResource",
        this
      ) -
      this.game.modifiers.getSkillModifierValue(
        "decreasedChanceAdditionalSkillResource",
        this
      );
    if (rollPercentage(chanceForExtraResource)) oreQty++;
    if (this.activeRock.id === "melvorTotH:Meteorite_Ore") {
      const extraMeteorite =
        this.game.modifiers.increasedChanceExtraMeteoriteOre -
        this.game.modifiers.decreasedChanceExtraMeteoriteOre;
      if (rollPercentage(extraMeteorite)) oreQty++;
    }
    if (this.activeRock.type === "Ore") {
      const chanceForPlusOne =
        this.game.modifiers.increasedChanceForOneExtraOre -
        this.game.modifiers.decreasedChanceForOneExtraOre;
      if (rollPercentage(chanceForPlusOne)) oreQty++;
    }
    rewards.addItem(this.activeRock.product, oreQty);
    this.game.stats.Mining.add(MiningStats.OresGained, oreQty);
    actionEvent.productQuantity = oreQty;
    if (rollPercentage(this.getRockGemChance(this.activeRock))) {
      actionEvent.gemObtained = true;
      this.addRandomGemReward(rewards);
      if (
        this.game.modifiers.summoningSynergy_4_5 > 0 &&
        rollPercentage(this.game.modifiers.summoningSynergy_4_5)
      ) {
        this.addRandomGemReward(rewards);
      }
    }
    if (
      this.activeRock.giveSuperiorGems &&
      rollPercentage(this.getRockSuperiorGemChance(this.activeRock))
    )
      this.addRandomSuperiorGemReward(rewards);
    if (
      this.coalItem !== undefined &&
      this.game.modifiers.increasedBonusCoalMining > 0
    ) {
      rewards.addItem(
        this.coalItem,
        this.game.modifiers.increasedBonusCoalMining
      );
      this.game.stats.Mining.add(
        MiningStats.OresGained,
        this.game.modifiers.increasedBonusCoalMining
      );
    }
    const barItem = this.game.smithing.getSmithedVersionOfOre(oreItem);
    if (barItem !== undefined) {
      actionEvent.smithedVersionExists = true;
      if (rollPercentage(this.game.modifiers.increasedMiningBarChance))
        rewards.addItem(barItem, 1);
    }
    rewards.addXP(this, this.activeRock.baseExperience);
    this.addCommonRewards(rewards);
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  addRandomGemReward(rewards) {
    let gemQty = 1;
    if (rollPercentage(this.chanceToDoubleGems)) gemQty *= 2;
    let gem;
    if (
      this.activeRock.id === "melvorTotH:Pure_Essence" &&
      this.runestoneItem !== undefined
    )
      gem = this.runestoneItem;
    else gem = this.game.randomGemTable.getDrop().item;
    rewards.addItem(gem, gemQty);
    this.game.stats.Mining.add(MiningStats.GemsGained, gemQty);
  }
  addRandomSuperiorGemReward(rewards) {
    if (this.game.randomSuperiorGemTable.size === 0) return;
    const gemQty = 1;
    const gemItem = this.game.randomSuperiorGemTable.getDrop().item;
    rewards.addItem(gemItem, gemQty);
  }
  postAction() {
    this.renderQueue.rockRates = true;
    if (
      this.activeRock.type !== "Gem" &&
      rollPercentage(this.rockHPPreserveChance)
    ) {
      this.game.stats.Mining.inc(MiningStats.RockHPPreserved);
      this.game.combat.notifications.add({
        type: "Player",
        args: [this, getLangString("TOASTS", "NO_ROCK_DAMAGE"), "success"],
      });
    } else {
      if (this.activeRock.currentHP > 0) {
        this.activeRock.currentHP--;
      } else {
        this.activeRock.currentHP = 0;
      }
      this.renderQueue.rockHP.add(this.activeRock);
      if (this.activeRock.currentHP <= 0) {
        this.game.stats.Mining.inc(MiningStats.RocksDepleted);
        this.startRespawningRock(this.activeRock);
      }
    }
    this.game.stats.Mining.inc(MiningStats.Actions);
    this.game.stats.Mining.add(
      MiningStats.TimeSpent,
      this.currentActionInterval
    );
    if (this.tier3PoolWasActive !== this.isPoolTierActive(3)) {
      this.updateAllRockMaxHPs();
    } else {
      this.updateRockMaxHP(this.activeRock);
    }
    this.rollForRandomGemVein(this.activeRock);
  }
  startActionTimer() {
    if (!this.activeRock.isRespawning && this.activeRock.currentHP > 0) {
      super.startActionTimer();
    }
  }
  regenRockHP() {
    this.actions.forEach((rock) => {
      if (
        !rock.isRespawning &&
        !(rock.maxHP === rock.currentHP) &&
        rock.hasPassiveRegen
      ) {
        rock.currentHP++;
        this.renderQueue.rockHP.add(rock);
      }
    });
    this.passiveRegenTimer.start(this.passiveRegenInterval);
  }
  getRockMaxHP(rock) {
    if (rock.fixedMaxHP !== undefined) return rock.fixedMaxHP;
    let rockHP = this.baseRockHP;
    if (this.isPoolTierActive(3)) rockHP += 10;
    const activePotion = this.activePotion;
    if (
      activePotion !== undefined &&
      [
        "melvorF:Perfect_Swing_Potion_I",
        "melvorF:Perfect_Swing_Potion_II",
        "melvorF:Perfect_Swing_Potion_III",
        "melvorF:Perfect_Swing_Potion_IV",
      ].includes(activePotion.id)
    ) {
      rockHP += this.game.modifiers.increasedMiningNodeHPWithPerfectSwing;
    }
    rockHP += this.getMasteryLevel(rock);
    rockHP +=
      this.game.modifiers.increasedMiningNodeHP -
      this.game.modifiers.decreasedMiningNodeHP;
    return Math.max(rockHP, 1);
  }
  updateRockMaxHP(rock) {
    rock.maxHP = this.getRockMaxHP(rock);
    if (rock.currentHP > rock.maxHP) rock.currentHP = rock.maxHP;
    this.renderQueue.rockHP.add(rock);
  }
  updateAllRockMaxHPs() {
    this.actions.forEach((rock) => this.updateRockMaxHP(rock));
  }
  startRespawningRock(rock) {
    if (!rock.hasPassiveRegen) return;
    rock.isRespawning = true;
    const respawnTimer = new Timer("Skill", () => this.respawnRock(rock));
    let respawnInterval = rock.baseRespawnInterval;
    if (this.isPoolTierActive(1)) respawnInterval *= 0.9;
    respawnTimer.start(respawnInterval);
    this.rockRespawnTimers.set(rock, respawnTimer);
    this.renderQueue.respawnProgress.add(rock);
  }
  respawnRock(rock) {
    rock.isRespawning = false;
    rock.currentHP = rock.maxHP;
    this.renderQueue.rockHP.add(rock);
    this.rockRespawnTimers.delete(rock);
    this.renderQueue.respawnProgress.add(rock);
    if (this.selectedRock === rock && this.isActive) {
      this.startActionTimer();
    }
  }
  initializeRocks() {
    this.actions.forEach((rock) => {
      if (rock.maxHP === 0) {
        const maxHP = this.getRockMaxHP(rock);
        rock.currentHP = rock.fixedMaxHP !== undefined ? 0 : maxHP;
        rock.maxHP = maxHP;
      }
    });
  }
  addMeteoriteVein() {
    const meteorite = this.actions.getObjectByID("melvorTotH:Meteorite_Ore");
    if (meteorite === undefined) return;
    const hpToAdd = Math.floor(Math.random() * 20) + 5;
    meteorite.currentHP += hpToAdd;
    this.updateRockMaxHP(meteorite);
    this.game.stats.Astrology.inc(AstrologyStats.MeteoritesLocated);
    this.game.stats.Astrology.add(AstrologyStats.TotalMeteoriteHP, hpToAdd);
    const message = templateString(
      getLangString("MENU_TEXT", "METEORITE_LOCATED_DESC"),
      { qty: `${numberWithCommas(hpToAdd)}` }
    );
    this.game.combat.notifications.add({
      type: "Player",
      args: [this, message, "info"],
    });
  }
  rollForRandomGemVein(rock) {
    if (rock.level < 100 || rock.type !== "Ore") return;
    const gemVeinInfo = this.rollRandomHPForGemVein();
    if (gemVeinInfo.size > 0) {
      const gemVein = this.getRandomGemVein();
      gemVein.currentHP += gemVeinInfo.hpToAdd;
      this.updateRockMaxHP(gemVein);
      const size = this.getGemVeinSize(gemVeinInfo.size);
      const message = templateString(
        getLangString("MENU_TEXT", "GEM_VEIN_LOCATED_DESC"),
        {
          size: `${size}`,
          name: `${gemVein.name}`,
          qty: `${numberWithCommas(gemVeinInfo.hpToAdd)}`,
        }
      );
      switch (gemVein.id) {
        case "melvorTotH:Onyx":
          this.game.stats.Mining.inc(MiningStats.OnyxGemNodesFound);
          this.game.stats.Mining.add(
            MiningStats.TotalOnyxGemNodeHPFound,
            gemVeinInfo.hpToAdd
          );
          break;
        case "melvorTotH:Oricha":
          this.game.stats.Mining.inc(MiningStats.OrichaGemNodesFound);
          this.game.stats.Mining.add(
            MiningStats.TotalOrichaGemNodeHPFound,
            gemVeinInfo.hpToAdd
          );
          break;
        case "melvorTotH:Cerulean":
          this.game.stats.Mining.inc(MiningStats.CeruleanGemNodesFound);
          this.game.stats.Mining.add(
            MiningStats.TotalCeruleanGemNodeHPFound,
            gemVeinInfo.hpToAdd
          );
          break;
      }
      this.game.combat.notifications.add({
        type: "Player",
        args: [this, message, "info"],
      });
    }
  }
  rollRandomHPForGemVein() {
    const chanceModifier =
      this.game.modifiers.increasedGemVeinChance -
      this.game.modifiers.decreasedGemVeinChance;
    const veinChance = (200 / 375) * (1 + chanceModifier / 100);
    let size = 0;
    let hpToAdd = 0;
    if (rollPercentage(veinChance)) {
      const gemRoll = Math.floor(Math.random() * 8);
      if (gemRoll < 5) {
        size = 1;
        hpToAdd = Math.ceil(Math.random() * 10) + 5;
      } else if (gemRoll < 7) {
        size = 2;
        hpToAdd = Math.ceil(Math.random() * 15) + 10;
      } else {
        size = 3;
        hpToAdd = Math.ceil(Math.random() * 40) + 20;
      }
    }
    return { size, hpToAdd };
  }
  getRandomGemVein() {
    const gemVeinRoll = Math.floor(Math.random() * this.totalGemVeinWeight);
    let gemVeinWeight = 0;
    const veinIndex = this.gemVeins.findIndex(({ weight }) => {
      gemVeinWeight += weight;
      return gemVeinWeight > gemVeinRoll;
    });
    return this.gemVeins[veinIndex].rock;
  }
  getGemVeinSize(number) {
    let size = "";
    switch (number) {
      case 1:
        size = "Small";
        break;
      case 2:
        size = "Medium";
        break;
      case 3:
        size = "Large";
        break;
    }
    return size;
  }
  testTranslations() {
    super.testTranslations();
    this.actions.forEach((action) => {
      action.name;
    });
  }
}
