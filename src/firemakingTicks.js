"use strict";
class FiremakingLog extends BasicSkillRecipe {
  constructor(namespace, data, game) {
    super(namespace, data);
    const log = game.items.getObjectByID(data.logID);
    if (log === undefined)
      throw new Error(
        `Error constructing FiremakingLog with id: ${this.localID}. Log item with id: ${data.logID} is not registered.`
      );
    this.log = log;
    this.baseInterval = data.baseInterval;
    this.baseBonfireInterval = data.baseBonfireInterval;
    this.bonfireXPBonus = data.bonfireXPBonus;
  }
  get name() {
    return this.log.name;
  }
  get media() {
    return this.log.media;
  }
}
class Firemaking extends CraftingSkill {
  constructor(namespace, game) {
    super(namespace, "Firemaking", game);
    this.bonfireTimer = new Timer("Skill", () => this.endBonFire());
    this.baseAshChance = 20;
    this.baseStardustChance = 1;
    this.baseCharcoalChance = 1;
    this._media = "assets/media/skills/firemaking/firemaking.svg";
    this.modifiers = new MappedModifiers();
    this.renderQueue = new FiremakingRenderQueue();
  }
  getTotalUnlockedMasteryActions() {
    return this.actions.reduce(levelUnlockSum(this), 0);
  }
  get noCostsMessage() {
    return templateLangString("TOASTS", "NO_LOGS_TO_BURN", {
      itemName: this.activeRecipe.log.name,
    });
  }
  get actionInterval() {
    return this.modifyInterval(
      this.activeRecipe.baseInterval,
      this.masteryAction
    );
  }
  get masteryModifiedInterval() {
    return this.activeRecipe.baseInterval * 0.6;
  }
  get actionLevel() {
    return this.activeRecipe.level;
  }
  get masteryAction() {
    return this.activeRecipe;
  }
  get activeRecipe() {
    if (this.selectedRecipe === undefined)
      throw new Error("Tried to get active recipe, but none is selected.");
    return this.selectedRecipe;
  }
  get activeBonfire() {
    if (this.litBonfireRecipe === undefined)
      throw new Error("Tried to get active bonfire recipe, but none is lit.");
    return this.litBonfireRecipe;
  }
  get isBonfireActive() {
    return this.litBonfireRecipe !== undefined;
  }
  get isLogSelected() {
    return this.selectedRecipe !== undefined;
  }
  get generousFireSpiritChance() {
    return 0.001 * 100;
  }
  get coalChance() {
    let chanceForCoal = 40 + this.game.modifiers.increasedFiremakingCoalChance;
    chanceForCoal *= 1 + this.game.modifiers.increasedOffItemChance / 100;
    return chanceForCoal;
  }
  get diamondChance() {
    return (
      this.game.modifiers.increasedChanceForDiamondFiremaking -
      this.game.modifiers.decreasedChanceForDiamondFiremaking
    );
  }
  get bonfireBonusXP() {
    if (this.isBonfireActive) return this.activeBonfire.bonfireXPBonus;
    else return 0;
  }
  get ashChance() {
    return (
      this.baseAshChance +
      this.game.modifiers.increasedChanceForAshInFiremaking -
      this.game.modifiers.decreasedChanceForAshInFiremaking
    );
  }
  get charcoalChance() {
    return (
      this.baseCharcoalChance +
      this.game.modifiers.increasedChanceForCharcoalInFiremaking -
      this.game.modifiers.decreasedChanceForCharcoalInFiremaking
    );
  }
  get ashQty() {
    return Math.floor(this.activeRecipe.baseInterval / 1000);
  }
  getStardustChance(log) {
    if (log.id !== "melvorD:Magic_Logs") return 0;
    return (
      this.baseStardustChance +
      this.game.modifiers.increasedChanceForStardustInFiremaking -
      this.game.modifiers.decreasedChanceForStardustInFiremaking
    );
  }
  get isBearDevilActive() {
    const activePotion = this.activePotion;
    return (
      this.game.modifiers.summoningSynergy_Bear_Devil > 0 &&
      activePotion !== undefined &&
      [
        "melvorF:Controlled_Heat_Potion_I",
        "melvorF:Controlled_Heat_Potion_II",
        "melvorF:Controlled_Heat_Potion_III",
        "melvorF:Controlled_Heat_Potion_IV",
      ].includes(activePotion.id)
    );
  }
  registerData(namespace, data) {
    var _a;
    super.registerData(namespace, data);
    (_a = data.logs) === null || _a === void 0
      ? void 0
      : _a.forEach((log) => {
          this.actions.registerObject(
            new FiremakingLog(namespace, log, this.game)
          );
        });
    if (data.coalItemID !== undefined)
      this.coalItem = this.getItemForRegistration(data.coalItemID);
    if (data.diamondItemID !== undefined)
      this.diamondItem = this.getItemForRegistration(data.diamondItemID);
    if (data.ashItemID !== undefined)
      this.ashItem = this.getItemForRegistration(data.ashItemID);
    if (data.fireSpiritItemID !== undefined)
      this.fireSpiritItem = this.getItemForRegistration(data.fireSpiritItemID);
    if (data.charcoalItemID !== undefined)
      this.charcoalItem = this.getItemForRegistration(data.charcoalItemID);
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortedMasteryActions = this.actions.allObjects.sort(
      (a, b) => a.level - b.level
    );
    this.milestones.push(...this.actions.allObjects);
    this.sortMilestones();
  }
  getPercentageIntervalModifier(action) {
    let modifier = super.getPercentageIntervalModifier(action);
    if (this.isPoolTierActive(1)) modifier -= 10;
    modifier -= this.getMasteryLevel(action) * 0.1;
    return modifier;
  }
  getMasteryXPModifier(action) {
    let modifier = super.getMasteryXPModifier(action);
    if (this.isPoolTierActive(0)) modifier += 5;
    return modifier;
  }
  computeProvidedStats(updatePlayer = true) {
    this.modifiers.reset();
    if (this.isPoolTierActive(3))
      this.modifiers.addModifiers({ increasedGlobalMasteryXP: 5 });
    const maxLogs = this.actions.reduce((prev, log) => {
      if (this.getMasteryLevel(log) >= 99) prev += 1;
      return prev;
    }, 0);
    if (maxLogs > 0)
      this.modifiers.addModifiers({ increasedGlobalMasteryXP: maxLogs * 0.25 });
    if (updatePlayer) this.game.combat.player.computeAllStats();
  }
  onLoad() {
    super.onLoad();
    if (this.selectedRecipe !== undefined) {
      this.renderQueue.selectedLog = true;
      this.renderQueue.logQty = true;
    }
    if (this.isActive) {
      this.renderQueue.progressBar = true;
      if (this.isBonfireActive) {
        this.renderQueue.bonfireProgress = true;
      }
    }
    this.computeProvidedStats(false);
    this.render();
  }
  onModifierChange() {
    super.onModifierChange();
    this.renderQueue.selectedLog = true;
  }
  onMasteryLevelUp(action, oldLevel, newLevel) {
    super.onMasteryLevelUp(action, oldLevel, newLevel);
    if (newLevel >= 99) this.computeProvidedStats();
  }
  onMasteryPoolBonusChange(oldBonusLevel, newBonusLevel) {
    super.onMasteryPoolBonusChange(oldBonusLevel, newBonusLevel);
    this.computeProvidedStats();
  }
  onEquipmentChange() {}
  onPageChange() {
    this.renderQueue.logQty = true;
    if (this.isBonfireActive) this.renderQueue.bonfireProgress = true;
    super.onPageChange();
  }
  queueBankQuantityRender(item) {
    this.renderQueue.logQty = true;
  }
  localize() {
    this.renderLogSelection();
    $("#firemaking-log-select").text(getLangString("MENU_TEXT", "SELECT_LOGS"));
    $("#firemaking-burn-button").text(getLangString("MENU_TEXT", "BURN"));
    $("#firemaking-bonfire-button").text(
      getLangString("MENU_TEXT", "LIGHT_BONFIRE")
    );
    $("#firemaking-bonfire-status-text").text(
      getLangString("MENU_TEXT", "BONFIRE_STATUS")
    );
    $("#firemaking-xp-bonus-text").text(
      getLangString("MENU_TEXT", "FIREMAKING_XP_BONUS")
    );
    this.renderQueue.bonfireStatus = true;
    this.renderQueue.selectedLog = true;
    this.render();
  }
  burnLog() {
    if (this.isActive) {
      this.stop();
    } else if (this.selectedRecipe !== undefined) {
      if (this.game.bank.getQty(this.activeRecipe.log) > 0) this.start();
      else notifyPlayer(this, this.noCostsMessage, "danger");
    } else {
      notifyPlayer(this, getLangString("TOASTS", "SELECT_LOGS"), "danger");
    }
  }
  activeTick() {
    super.activeTick();
    this.bonfireTimer.tick();
  }
  getErrorLog() {
    return `${super.getErrorLog()}
Selected Recipe ID: ${this.selectedRecipe}
Lit Bonfire ID: ${this.litBonfireRecipe}`;
  }
  getCurrentRecipeCosts() {
    const costs = new Costs(this.game);
    costs.addItem(this.activeRecipe.log, 1);
    return costs;
  }
  getFiremakingGPMultiplier() {
    let gpMultiplier = 0;
    gpMultiplier +=
      this.game.modifiers.increasedGPFromFiremaking -
      this.game.modifiers.decreasedGPFromFiremaking +
      this.game.modifiers.increasedGPGlobal -
      this.game.modifiers.decreasedGPGlobal;
    return gpMultiplier;
  }
  getXPModifier(masteryAction) {
    let modifier = super.getXPModifier(masteryAction);
    if (this.isBearDevilActive) modifier += 5;
    return modifier;
  }
  recordCostConsumptionStats(costs) {
    costs.recordBulkItemStat(
      this.game.stats.Firemaking,
      FiremakingStats.LogsBurnt
    );
    costs.recordBulkItemValueStat(
      this.game.stats.Firemaking,
      FiremakingStats.GPBurnt
    );
  }
  recordCostPreservationStats(costs) {
    costs.recordBulkItemStat(
      this.game.stats.Firemaking,
      FiremakingStats.ItemsPreserved
    );
  }
  preAction() {}
  get actionRewards() {
    const rewards = new Rewards(this.game);
    const actionEvent = new FiremakingActionEvent(this, this.masteryAction);
    const baseSalePrice = this.activeRecipe.log.sellsFor;
    let gpToAdd =
      (baseSalePrice * this.game.modifiers.increasedFiremakingLogGP) / 100;
    if (this.isPoolTierActive(2)) {
      gpToAdd += baseSalePrice * 0.25;
    }
    gpToAdd = applyModifier(gpToAdd, this.getFiremakingGPMultiplier());
    if (gpToAdd >= 1) rewards.addGP(gpToAdd);
    this.game.stats.Firemaking.add(FiremakingStats.GPEarned, gpToAdd);
    const xpToAdd =
      this.activeRecipe.baseExperience * (1 + this.bonfireBonusXP / 100);
    rewards.addXP(this, xpToAdd);
    const chanceToDouble = this.getDoublingChance(this.activeRecipe);
    if (this.coalItem !== undefined && rollPercentage(this.coalChance)) {
      let coalQty = 1;
      if (rollPercentage(chanceToDouble)) coalQty *= 2;
      rewards.addItem(this.coalItem, coalQty);
      this.game.stats.Firemaking.add(FiremakingStats.CoalGained, coalQty);
    }
    if (this.diamondItem !== undefined && rollPercentage(this.diamondChance))
      rewards.addItem(this.diamondItem, 1);
    if (this.ashItem !== undefined) {
      let ashQty = 0;
      ashQty +=
        this.game.modifiers.increasedAdditionalAshInFiremaking -
        this.game.modifiers.decreasedAdditionalAshInFiremaking;
      if (rollForOffItem(this.ashChance)) {
        ashQty += this.ashQty;
        if (rollPercentage(chanceToDouble)) ashQty *= 2;
      }
      if (ashQty > 0) rewards.addItem(this.ashItem, ashQty);
    }
    if (
      this.game.astrology.starDustItem !== undefined &&
      rollForOffItem(this.getStardustChance(this.activeRecipe))
    ) {
      let stardustQty = 1;
      if (rollPercentage(chanceToDouble)) stardustQty *= 2;
      rewards.addItem(this.game.astrology.starDustItem, stardustQty);
    }
    if (
      this.fireSpiritItem !== undefined &&
      rollForOffItem(this.generousFireSpiritChance)
    ) {
      let generousFireSpiritQty = 1;
      if (rollPercentage(chanceToDouble)) generousFireSpiritQty *= 2;
      rewards.addItem(this.fireSpiritItem, generousFireSpiritQty);
    }
    if (
      this.charcoalItem !== undefined &&
      rollForOffItem(this.charcoalChance)
    ) {
      let charcoalQty = 1;
      if (rollPercentage(chanceToDouble)) charcoalQty *= 2;
      rewards.addItem(this.charcoalItem, charcoalQty);
    }
    this.addCommonRewards(rewards);
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  postAction() {
    if (this.bonfireBonusXP > 0)
      this.game.stats.Firemaking.add(
        FiremakingStats.BonusBonfireXP,
        this.modifyXP(
          this.activeRecipe.baseExperience * (this.bonfireBonusXP / 100)
        )
      );
    this.renderQueue.logQty = true;
    this.game.stats.Firemaking.inc(FiremakingStats.TotalActions);
    this.game.stats.Firemaking.add(
      FiremakingStats.TimeSpent,
      this.currentActionInterval
    );
  }
  endBonFire() {
    this.litBonfireRecipe = undefined;
    this.renderQueue.bonfireStatus = true;
    this.renderQueue.bonfireProgress = true;
    if (this.game.modifiers.freeBonfires && this.isActive) {
      this.lightBonfire();
    }
  }
  lightBonfire() {
    if (this.selectedRecipe === undefined || this.isBonfireActive) return;
    const bonfireCosts = new Costs(this.game);
    if (!this.game.modifiers.freeBonfires) {
      bonfireCosts.addItem(this.activeRecipe.log, 10);
    }
    if (bonfireCosts.checkIfOwned()) {
      const bonfireEvent = new BonfireLitEvent(this, this.selectedRecipe);
      this.litBonfireRecipe = this.selectedRecipe;
      let bonfireInterval = this.activeBonfire.baseBonfireInterval;
      if (this.isBearDevilActive) bonfireInterval *= 2;
      this.bonfireTimer.start(bonfireInterval);
      this.renderQueue.bonfireStatus = true;
      this.renderQueue.bonfireProgress = true;
      bonfireCosts.consumeCosts();
      this.recordCostConsumptionStats(bonfireCosts);
      this.game.processEvent(bonfireEvent);
      this.game.stats.Firemaking.inc(FiremakingStats.BonfiresLit);
    } else {
      notifyPlayer(
        this,
        getLangString("TOASTS", "NO_LOGS_FOR_BONFIRE"),
        "danger"
      );
    }
  }
  resetActionState() {
    super.resetActionState();
    this.bonfireTimer.stop();
    this.selectedRecipe = undefined;
    this.litBonfireRecipe = undefined;
  }
  encode(writer) {
    super.encode(writer);
    this.bonfireTimer.encode(writer);
    writer.writeBoolean(this.isLogSelected);
    if (this.selectedRecipe !== undefined) {
      writer.writeNamespacedObject(this.selectedRecipe);
    }
    writer.writeBoolean(this.isBonfireActive);
    if (this.litBonfireRecipe !== undefined) {
      writer.writeNamespacedObject(this.litBonfireRecipe);
    }
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    this.bonfireTimer.decode(reader, version);
    if (reader.getBoolean()) {
      const recipe = reader.getNamespacedObject(this.actions);
      if (typeof recipe === "string") this.shouldResetAction = true;
      else this.selectedRecipe = recipe;
    }
    if (reader.getBoolean()) {
      const recipe = reader.getNamespacedObject(this.actions);
      if (typeof recipe === "string") this.shouldResetAction = true;
      else this.litBonfireRecipe = recipe;
    }
    if (this.shouldResetAction) this.resetActionState();
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    this.bonfireTimer.deserialize(reader.getChunk(3), version);
    const getRecipe = (id) => {
      return this.actions.getObjectByID(idMap.firemakingRecipes[id]);
    };
    const selectedRecipeID = reader.getNumber();
    if (selectedRecipeID >= 0) {
      this.selectedRecipe = getRecipe(selectedRecipeID);
    }
    const litBonfireRecipeID = reader.getNumber();
    if (litBonfireRecipeID >= 0) {
      this.litBonfireRecipe = getRecipe(litBonfireRecipeID);
    }
    if (
      (this.isActive && this.selectedRecipe === undefined) ||
      (this.bonfireTimer.isActive && this.litBonfireRecipe === undefined)
    )
      this.shouldResetAction = true;
    if (this.shouldResetAction) this.resetActionState();
  }
  setFromOldOffline(offline, idMap) {
    const log = this.actions.getObjectByID(
      idMap.firemakingRecipes[offline.action]
    );
    if (log !== undefined) {
      this.selectLog(log);
      this.burnLog();
    }
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.firemakingRecipes[oldActionID];
  }
  selectLog(recipeToSelect) {
    if (recipeToSelect.level > this.level) {
      notifyPlayer(
        this,
        getLangString("TOASTS", "LEVEL_REQUIRED_TO_BURN"),
        "danger"
      );
    } else {
      if (
        this.selectedRecipe !== recipeToSelect &&
        this.isActive &&
        !this.stop()
      )
        return;
      this.selectedRecipe = recipeToSelect;
      this.renderQueue.selectedLog = true;
      this.renderQueue.logQty = true;
    }
  }
  render() {
    super.render();
    this.renderFireProgress();
    this.renderBonfireStatus();
    this.renderBonfireProgress();
    this.renderSelectedLog();
    this.renderSelectedLogQty();
  }
  renderBonfireStatus() {
    if (!this.renderQueue.bonfireStatus) return;
    if (!this.isBonfireActive) {
      $("#skill-fm-bonfire-status").text(
        getLangString("MENU_TEXT", "INACTIVE")
      );
      $("#skill-fm-bonfire-status").attr("class", "text-danger");
      $("#skill-fm-bonfire-bonus").text(formatPercent(0));
      $("#skill-fm-bonfire-status-img").attr(
        "src",
        "assets/media/skills/firemaking/bonfire_inactive.svg"
      );
    } else {
      $("#skill-fm-bonfire-status").text(getLangString("MENU_TEXT", "ACTIVE"));
      $("#skill-fm-bonfire-status").attr("class", "text-success");
      $("#skill-fm-bonfire-bonus").text(formatPercent(this.bonfireBonusXP));
      $("#skill-fm-bonfire-status-img").attr(
        "src",
        "assets/media/skills/firemaking/bonfire_active.svg"
      );
    }
    this.renderQueue.bonfireStatus = false;
  }
  renderFireProgress() {
    if (!this.renderQueue.progressBar) return;
    if (this.isActive)
      firemakingMenu.fireProgress.animateProgressFromTimer(this.actionTimer);
    else firemakingMenu.fireProgress.stopAnimation();
    this.renderQueue.progressBar = false;
  }
  renderBonfireProgress() {
    if (!this.renderQueue.bonfireProgress) return;
    if (this.isBonfireActive)
      firemakingMenu.bonfireProgress.animateProgressFromTimer(
        this.bonfireTimer
      );
    else firemakingMenu.bonfireProgress.stopAnimation();
    this.renderQueue.bonfireProgress = false;
  }
  renderSelectedLog() {
    if (!this.renderQueue.selectedLog) return;
    if (this.selectedRecipe === undefined) {
      $("#skill-fm-logs-selected-img").removeAttr("src");
      $("#skill-fm-logs-selected-name").text("");
      hideElement(firemakingMenu.grants);
      firemakingMenu.masteryDisplay.setNoMastery();
    } else {
      $("#skill-fm-logs-selected-img").attr("src", this.activeRecipe.media);
      $("#skill-fm-logs-selected-name").text(this.activeRecipe.name);
      const xp = this.modifyXP(
        this.activeRecipe.baseExperience,
        this.activeRecipe
      );
      const mxp = this.getMasteryXPToAddForAction(
        this.activeRecipe,
        this.masteryModifiedInterval
      );
      const mpxp = this.getMasteryXPToAddToPool(mxp);
      firemakingMenu.xpIcon.setXP(xp);
      firemakingMenu.masteryIcon.setXP(mxp);
      firemakingMenu.masteryPoolIcon.setXP(mpxp);
      firemakingMenu.intervalIcon.setInterval(this.actionInterval);
      showElement(firemakingMenu.grants);
      firemakingMenu.masteryDisplay.setMastery(this, this.selectedRecipe);
      this.updateMasteryDisplays(this.activeRecipe);
    }
    this.renderQueue.selectedLog = false;
  }
  renderSelectedLogQty() {
    if (!this.renderQueue.logQty) return;
    if (this.selectedRecipe === undefined) {
      $("#skill-fm-logs-selected-qty").text("");
    } else {
      $("#skill-fm-logs-selected-qty").text(
        formatNumber(this.game.bank.getQty(this.activeRecipe.log))
      );
    }
    this.renderQueue.logQty = false;
  }
  renderLogSelection() {
    this.actions.forEach((recipe) => {
      const recipeOption = firemakingMenu.recipeSelect.get(recipe);
      if (recipeOption === undefined) return;
      if (this.game.bank.getQty(recipe.log) > 0) {
        showElement(recipeOption.link);
        if (recipe.level > this.level) {
          recipeOption.name.textContent = templateLangString(
            "MENU_TEXT",
            "REQUIRES_LEVEL",
            { level: `${recipe.level}` }
          );
          recipeOption.link.classList.add("text-danger");
        } else {
          recipeOption.name.textContent = recipe.log.name;
          recipeOption.link.classList.remove("text-danger");
        }
      } else {
        hideElement(recipeOption.link);
      }
    });
  }
}
class FiremakingRenderQueue extends GatheringSkillRenderQueue {
  constructor() {
    super(...arguments);
    this.selectedLog = false;
    this.bonfireProgress = false;
    this.bonfireStatus = false;
    this.logQty = false;
  }
}
