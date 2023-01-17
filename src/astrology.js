"use strict";
class AstrologyModifier {
  constructor(data, game) {
    this.modifiers = data.modifiers.map((modData) => {
      if ("skill" in modData) {
        const skill = game.skills.getObjectByID(modData.skill);
        if (skill === undefined)
          throw new Error(
            `Error registering AstrologyModifier. Skill with id ${modData.skill} is not registered.`
          );
        return { key: modData.key, skill };
      } else {
        return modData;
      }
    });
    this.incrementValue = data.incrementValue;
    this.maxCount = data.maxCount;
    this.costs = data.costs;
  }
}
class AstrologyRecipe extends BasicSkillRecipe {
  constructor(namespace, data, game) {
    super(namespace, data);
    this.maxValueModifiers = 0;
    this._name = data.name;
    this._media = data.media;
    this.skills = data.skillIDs.map((skillID) => {
      const skill = game.skills.getObjectByID(skillID);
      if (skill === undefined)
        throw new Error(
          `Error constructing AstrologyRecipe with id: ${this.id}. Skill with id: ${skillID} is not registered.`
        );
      return skill;
    });
    this.gpReward = data.gpReward;
    this.scReward = data.scReward;
    this.itemRewards = game.items.getQuantities(data.itemRewards);
    this.standardModifiers = data.standardModifiers.map(
      (modData) => new AstrologyModifier(modData, game)
    );
    this.uniqueModifiers = data.uniqueModifiers.map(
      (modData) => new AstrologyModifier(modData, game)
    );
    if (data.masteryXPModifier !== undefined)
      this.masteryXPModifier = data.masteryXPModifier;
    this.standardModsBought = new Array(this.standardModifiers.length).fill(0);
    this.uniqueModsBought = new Array(this.uniqueModifiers.length).fill(0);
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("ASTROLOGY", `NAME_${this.localID}`);
    }
  }
  get media() {
    return this.getMediaURL(this._media);
  }
}
class DummyAstrologyRecipe extends AstrologyRecipe {
  constructor(namespace, id, game) {
    super(
      namespace,
      {
        id,
        baseExperience: 0,
        level: 0,
        name: "",
        media: "",
        skillIDs: [],
        gpReward: 0,
        scReward: 0,
        itemRewards: [],
        standardModifiers: [],
        uniqueModifiers: [],
      },
      game
    );
  }
}
class Astrology extends GatheringSkill {
  constructor(namespace, game) {
    super(namespace, "Astrology", game);
    this._media = "assets/media/skills/astrology/astrology.svg";
    this.renderQueue = new AstrologyRenderQueue();
    this.modifiers = new MappedModifiers();
    this.masteryXPConstellations = [];
    this.shouldRefundStardust = false;
    this.shouldRefundStardustAgain = false;
    this.newRefundDate = 1666051201000;
  }
  getTotalUnlockedMasteryActions() {
    return this.actions.reduce(levelUnlockSum(this), 0);
  }
  get actionInterval() {
    return this.getConstellationInterval(this.activeConstellation);
  }
  get actionLevel() {
    return this.activeConstellation.level;
  }
  get masteryAction() {
    return this.activeConstellation;
  }
  get meteoriteChance() {
    let chance = 0.25;
    chance += this.game.modifiers.increasedChanceToFindMeteorite;
    if (this.isPoolTierActive(3)) chance += 2;
    return chance;
  }
  get stardustChance() {
    let chance = Astrology.baseStardustChance;
    if (this.isPoolTierActive(1)) chance += 5;
    chance += this.game.modifiers.increasedChanceStardust;
    chance -= this.game.modifiers.decreasedChanceStardust;
    return chance;
  }
  get goldenStardustChance() {
    let chance = Astrology.baseGoldenStardustChance;
    if (this.isPoolTierActive(2)) chance += 3;
    if (this.isPoolTierActive(3)) chance += 2;
    chance += this.game.modifiers.increasedChanceGoldenStardust;
    chance -= this.game.modifiers.decreasedChanceGoldenStardust;
    return chance;
  }
  get activeConstellation() {
    if (this.studiedConstellation === undefined)
      throw new Error(
        "Tried to get active constellation, but none is being studied."
      );
    return this.studiedConstellation;
  }
  registerData(namespace, data) {
    var _a;
    super.registerData(namespace, data);
    (_a = data.recipes) === null || _a === void 0
      ? void 0
      : _a.forEach((data) => {
          this.actions.registerObject(
            new AstrologyRecipe(namespace, data, this.game)
          );
        });
    if (data.stardustItemID !== undefined)
      this.starDustItem = this.getItemForRegistration(data.stardustItemID);
    if (data.goldenStardustItemID !== undefined)
      this.goldenStardustItem = this.getItemForRegistration(
        data.goldenStardustItemID
      );
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortedMasteryActions = this.actions.allObjects.sort(
      (a, b) => a.level - b.level
    );
    this.milestones.push(...this.actions.allObjects);
    this.sortMilestones();
    this.masteryXPConstellations = this.actions.filter(
      (action) => action.masteryXPModifier !== undefined
    );
  }
  isModifierUnlocked(constellation, type, modID) {
    const levelReqs =
      type === AstrologyModifierType.Standard
        ? Astrology.standardModifierLevels
        : Astrology.uniqueModifierLevels;
    return this.getMasteryLevel(constellation) >= levelReqs[modID];
  }
  isModifierBought(constellation, type, modID) {
    const boughtArray =
      type === AstrologyModifierType.Standard
        ? constellation.standardModsBought
        : constellation.uniqueModsBought;
    return boughtArray[modID] > 0;
  }
  refundStardust() {
    if (!this.shouldRefundStardust) return;
    if (this.starDustItem !== undefined) {
      const stardustInBank = this.game.bank.getQty(this.starDustItem);
      const stardustFound = this.game.stats.itemFindCount(this.starDustItem);
      const stardustToRefund = stardustFound - stardustInBank;
      if (stardustToRefund > 0)
        this.game.bank.addItem(
          this.starDustItem,
          stardustToRefund,
          false,
          false,
          true
        );
    }
    if (this.goldenStardustItem !== undefined) {
      const goldenStardustInBank = this.game.bank.getQty(
        this.goldenStardustItem
      );
      const goldenStardustFound = this.game.stats.itemFindCount(
        this.goldenStardustItem
      );
      const goldenStardustToRefund = goldenStardustFound - goldenStardustInBank;
      if (goldenStardustToRefund > 0)
        this.game.bank.addItem(
          this.goldenStardustItem,
          goldenStardustToRefund,
          false,
          false,
          true
        );
    }
    this.shouldRefundStardust = false;
  }
  refundStardustAgain() {
    if (
      !this.shouldRefundStardustAgain ||
      !this.isUnlocked ||
      game.stats.General.get(GeneralStats.AccountCreationDate) >
        this.newRefundDate ||
      this.game.stats.itemFindCount(this.starDustItem) < 1
    ) {
      this.shouldRefundStardustAgain = false;
      return;
    }
    if (this.starDustItem !== undefined) {
      const count = this.getTotalCurrentMasteryLevels("melvorF") * 50;
      if (count > 0)
        this.game.bank.addItem(this.starDustItem, count, false, false, true);
    }
    if (this.goldenStardustItem !== undefined) {
      const count = this.getTotalCurrentMasteryLevels("melvorF") * 30;
      if (count > 0)
        this.game.bank.addItem(
          this.goldenStardustItem,
          count,
          false,
          false,
          true
        );
    }
    this.shouldRefundStardustAgain = false;
  }
  getConstellationInterval(constellation) {
    return this.modifyInterval(Astrology.baseInterval, constellation);
  }
  getStardustQuantity(action) {
    let quantity = 1 + this.game.modifiers.increasedBaseStardustDropQty;
    if (rollPercentage(this.getDoublingChance(action))) quantity *= 2;
    return quantity;
  }
  getMasteryXPModifier(action) {
    let modifier = super.getMasteryXPModifier(action);
    if (this.isPoolTierActive(0)) modifier += 5;
    return modifier;
  }
  computeProvidedStats(updatePlayer = true) {
    this.modifiers.reset();
    this.actions.forEach((recipe) => {
      recipe.standardModifiers.forEach((astroMod, modID) => {
        const bought = recipe.standardModsBought[modID];
        if (bought <= 0) return;
        const value = bought * astroMod.incrementValue;
        this.modifiers.addArrayModifiers(
          this.getModifierElement(astroMod, value)
        );
      });
      recipe.uniqueModifiers.forEach((astroMod, modID) => {
        const bought = recipe.uniqueModsBought[modID];
        if (bought <= 0) return;
        const value = bought * astroMod.incrementValue;
        this.modifiers.addArrayModifiers(
          this.getModifierElement(astroMod, value)
        );
      });
    });
    if (updatePlayer) {
      this.game.combat.player.computeAllStats();
    }
  }
  preAction() {}
  get actionRewards() {
    const rewards = new Rewards(this.game);
    const actionEvent = new AstrologyActionEvent(
      this,
      this.activeConstellation
    );
    rewards.addXP(this, this.activeConstellation.baseExperience);
    if (
      this.starDustItem !== undefined &&
      rollPercentage(this.stardustChance)
    ) {
      rewards.addItem(
        this.starDustItem,
        this.getStardustQuantity(this.masteryAction)
      );
    }
    if (
      this.goldenStardustItem !== undefined &&
      this.game.modifiers.disableGoldenStardustDrops < 1 &&
      rollPercentage(this.goldenStardustChance)
    ) {
      rewards.addItem(
        this.goldenStardustItem,
        this.getStardustQuantity(this.masteryAction)
      );
    }
    this.addCommonRewards(rewards);
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  postAction() {
    this.rollForMeteorite();
    this.game.stats.Astrology.inc(AstrologyStats.Actions);
    this.game.stats.Astrology.add(
      AstrologyStats.TimeSpent,
      this.currentActionInterval
    );
    this.renderQueue.constellationRates = true;
    this.renderQueue.stardustRates = true;
  }
  queueModifierRender(constellation, type, modId) {
    if (type === AstrologyModifierType.Standard) {
      if (this.exploredConstellation === constellation)
        this.renderQueue.exploredStandardModifiers.add(modId);
    } else {
      if (this.exploredConstellation === constellation)
        this.renderQueue.exploredUniqueModifiers.add(modId);
    }
  }
  getModifierElement(modifier, value) {
    return modifier.modifiers.map((mod) => {
      if ("skill" in mod) {
        return { key: mod.key, values: [{ skill: mod.skill, value }] };
      } else {
        return { key: mod.key, value };
      }
    });
  }
  checkStardustCostsAndConsume(item, quantity) {
    const costs = new Costs(this.game);
    costs.addItem(item, quantity);
    if (costs.checkIfOwned()) {
      costs.consumeCosts();
      return true;
    } else {
      notifyPlayer(
        this,
        templateString(getLangString("ASTROLOGY", "MISC_4"), {
          itemName: item.name,
        }),
        "danger"
      );
      return false;
    }
  }
  isStarMaxValue(constellation, type, modID) {
    return type === AstrologyModifierType.Standard
      ? constellation.standardModsBought[modID] >=
          constellation.standardModifiers[modID].maxCount
      : constellation.uniqueModsBought[modID] >=
          constellation.uniqueModifiers[modID].maxCount;
  }
  countMaxValuesInConstellation(constellation) {
    let count = 0;
    count += constellation.standardModifiers.reduce(
      (total, astroMod, modID) => {
        if (constellation.standardModsBought[modID] >= astroMod.maxCount)
          total++;
        return total;
      },
      0
    );
    count += constellation.uniqueModifiers.reduce((total, astroMod, modID) => {
      if (constellation.uniqueModsBought[modID] >= astroMod.maxCount) total++;
      return total;
    }, 0);
    return count;
  }
  onConstellationUpgrade(constellation, type, modID) {
    type === AstrologyModifierType.Standard
      ? astrologyMenus.explorePanel.setStandardUpgradeCost(constellation, modID)
      : astrologyMenus.explorePanel.setUniqueUpgradeCost(constellation, modID);
    this.queueModifierRender(constellation, type, modID);
  }
  getStandardModifierUpgradeCost(constellation, modID) {
    return constellation.standardModifiers[modID].costs[
      constellation.standardModsBought[modID]
    ];
  }
  getUniqueModifierUpgradeCost(constellation, modID) {
    return constellation.uniqueModifiers[modID].costs[
      constellation.uniqueModsBought[modID]
    ];
  }
  upgradeStandardModifier(constellation, modID) {
    if (
      !this.isModifierUnlocked(
        constellation,
        AstrologyModifierType.Standard,
        modID
      )
    )
      return;
    if (this.starDustItem === undefined) return;
    const astroMod = constellation.standardModifiers[modID];
    const currentCount = constellation.standardModsBought[modID];
    if (currentCount >= astroMod.maxCount) return;
    const cost = this.getStandardModifierUpgradeCost(constellation, modID);
    if (this.checkStardustCostsAndConsume(this.starDustItem, cost)) {
      constellation.standardModsBought[modID]++;
      if (
        constellation.standardModsBought[modID] >=
        constellation.standardModifiers[modID].maxCount
      )
        constellation.maxValueModifiers++;
      this.computeProvidedStats(true);
      this.onConstellationUpgrade(
        constellation,
        AstrologyModifierType.Standard,
        modID
      );
    }
  }
  upgradeUniqueModifier(constellation, modID) {
    if (
      !this.isModifierUnlocked(
        constellation,
        AstrologyModifierType.Unique,
        modID
      )
    )
      return;
    if (this.goldenStardustItem === undefined) return;
    const astroMod = constellation.uniqueModifiers[modID];
    const currentCount = constellation.uniqueModsBought[modID];
    if (currentCount > astroMod.maxCount) return;
    const cost = this.getUniqueModifierUpgradeCost(constellation, modID);
    if (this.checkStardustCostsAndConsume(this.goldenStardustItem, cost)) {
      constellation.uniqueModsBought[modID]++;
      if (constellation.uniqueModsBought[modID] >= astroMod.maxCount)
        constellation.maxValueModifiers++;
      this.computeProvidedStats(true);
      this.onConstellationUpgrade(
        constellation,
        AstrologyModifierType.Unique,
        modID
      );
    }
  }
  get masteryModifiedInterval() {
    return this.actionInterval;
  }
  onLoad() {
    super.onLoad();
    this.actions.forEach((constellation) => {
      var _a;
      (_a = astrologyMenus.constellations.get(constellation)) === null ||
      _a === void 0
        ? void 0
        : _a.setConstellation(constellation);
      this.renderQueue.actionMastery.add(constellation);
      constellation.maxValueModifiers =
        this.countMaxValuesInConstellation(constellation);
    });
    astrologyMenus.infoPanel.setModifierCallback(this);
    astrologyMenus.explorePanel.setMaxStandardMods(
      Astrology.standardModifierLevels.length
    );
    astrologyMenus.explorePanel.setMaxUniqueMods(
      Astrology.uniqueModifierLevels.length
    );
    if (this.isActive) {
      this.renderQueue.progressBar = true;
    }
    this.renderQueue.visibleConstellations = true;
    if (this.exploredConstellation !== undefined) this.onConstellationExplore();
    this.computeProvidedStats(false);
    this.refundStardust();
    this.refundStardustAgain();
  }
  onPageChange() {
    this.renderQueue.stardustQuantities = true;
    super.onPageChange();
  }
  queueBankQuantityRender(item) {
    if (item === this.starDustItem || item === this.goldenStardustItem)
      this.renderQueue.stardustQuantities = true;
  }
  onModifierChange() {
    super.onModifierChange();
    this.renderQueue.constellationRates = true;
    this.renderQueue.stardustRates = true;
  }
  onEquipmentChange() {}
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.unlockNewModifierOnLevelUp(oldLevel);
    this.renderQueue.visibleConstellations = true;
  }
  getErrorLog() {
    var _a;
    return `${super.getErrorLog()}
Studied Constellation: ${
      (_a = this.studiedConstellation) === null || _a === void 0
        ? void 0
        : _a.id
    }
Explored Constellation: ${
      this.exploredConstellation !== undefined
        ? `${this.exploredConstellation.id}`
        : "Unset"
    }`;
  }
  unlockNewModifiers(constellation) {
    if (this.level < constellation.level) return;
    const masteryLevel = this.getMasteryLevel(constellation);
    Astrology.standardModifierLevels.every((levelRequired, modID) => {
      if (masteryLevel >= levelRequired) {
        if (
          !this.isModifierBought(
            constellation,
            AstrologyModifierType.Standard,
            modID
          )
        )
          this.queueModifierRender(
            constellation,
            AstrologyModifierType.Standard,
            modID
          );
        return true;
      }
      return false;
    });
    Astrology.uniqueModifierLevels.every((levelRequired, modID) => {
      if (masteryLevel >= levelRequired) {
        if (
          !this.isModifierBought(
            constellation,
            AstrologyModifierType.Unique,
            modID
          )
        )
          this.queueModifierRender(
            constellation,
            AstrologyModifierType.Unique,
            modID
          );
        return true;
      }
      return false;
    });
  }
  setUnlock(isUnlocked) {
    super.setUnlock(isUnlocked);
    this.onSkillUnlock();
  }
  onSkillUnlock() {
    if (!this.isUnlocked) return;
    this.unlockNewModifierOnLevelUp(0);
  }
  unlockNewModifierOnLevelUp(oldLevel) {
    this.actions.every((constellation) => {
      if (oldLevel < constellation.level && this.level >= constellation.level) {
        this.unlockNewModifiers(constellation);
      }
      return this.level >= constellation.level;
    });
  }
  onMasteryLevelUp(action, oldLevel, newLevel) {
    super.onMasteryLevelUp(action, oldLevel, newLevel);
    this.unlockNewModifiers(action);
  }
  onConstellationExplore() {
    this.renderQueue.rerollCosts = true;
    this.renderQueue.stardustQuantities = true;
    Astrology.standardModifierLevels.forEach((_, i) =>
      this.renderQueue.exploredStandardModifiers.add(i)
    );
    Astrology.uniqueModifierLevels.forEach((_, i) =>
      this.renderQueue.exploredUniqueModifiers.add(i)
    );
  }
  render() {
    super.render();
    this.renderProgressBar();
    this.renderConstellationRates();
    this.renderStardustQuantities();
    this.renderExploredStandardMods();
    this.renderExploredUniqueMods();
    this.renderStardustRates();
    this.renderVisibleConstellations();
    this.renderUpgradeCosts();
  }
  renderProgressBar() {
    var _a, _b;
    if (!this.renderQueue.progressBar) return;
    const progressBar =
      (_a = astrologyMenus.constellations.get(this.activeConstellation)) ===
        null || _a === void 0
        ? void 0
        : _a.progressBar;
    if (progressBar !== this.renderedProgressBar)
      (_b = this.renderedProgressBar) === null || _b === void 0
        ? void 0
        : _b.stopAnimation();
    if (progressBar !== undefined) {
      if (this.isActive) {
        progressBar.animateProgressFromTimer(this.actionTimer);
        this.renderedProgressBar = progressBar;
      } else {
        progressBar.stopAnimation();
        this.renderedProgressBar = undefined;
      }
    }
    this.renderQueue.progressBar = false;
  }
  renderStardustRates() {
    if (!this.renderQueue.stardustRates) return;
    astrologyMenus.infoPanel.updateChances(
      this.stardustChance,
      this.goldenStardustChance,
      this.getDoublingChance(),
      this.meteoriteChance
    );
    this.renderQueue.stardustRates = false;
  }
  renderConstellationRates() {
    if (!this.renderQueue.constellationRates) return;
    this.actions.forEach((constellation) => {
      var _a;
      const masteryXP = this.getMasteryXPToAddForAction(
        constellation,
        this.getConstellationInterval(constellation)
      );
      const poolXP = this.getMasteryXPToAddToPool(masteryXP);
      (_a = astrologyMenus.constellations.get(constellation)) === null ||
      _a === void 0
        ? void 0
        : _a.updateGrants(
            this.modifyXP(constellation.baseExperience, constellation),
            masteryXP,
            poolXP,
            this.getConstellationInterval(constellation)
          );
    });
    this.renderQueue.constellationRates = false;
  }
  renderStardustQuantities() {
    var _a;
    if (!this.renderQueue.stardustQuantities) return;
    const explored = this.exploredConstellation;
    if (explored !== undefined) {
      (_a = astrologyMenus.constellations.get(explored)) === null ||
      _a === void 0
        ? void 0
        : _a.updateQuantities();
    }
    this.renderQueue.stardustQuantities = false;
  }
  renderExploredStandardMods() {
    if (this.renderQueue.exploredStandardModifiers.size === 0) return;
    const explored = this.exploredConstellation;
    if (explored !== undefined) {
      this.renderQueue.exploredStandardModifiers.forEach((modID) => {
        const astroMod = explored.standardModifiers[modID];
        if (
          this.isModifierUnlocked(
            explored,
            AstrologyModifierType.Standard,
            modID
          )
        ) {
          const buyCount = explored.standardModsBought[modID];
          const modValue = buyCount * astroMod.incrementValue;
          const mods = this.getModifierElement(astroMod, modValue);
          const precision = Number.isInteger(modValue) ? 0 : 2;
          astrologyMenus.explorePanel.setStandardModifier(
            modID,
            mods,
            precision
          );
          astrologyMenus.explorePanel.setStandardModifierStatus(
            modID,
            buyCount,
            astroMod
          );
        } else {
          astrologyMenus.explorePanel.setStandardLocked(
            modID,
            Astrology.standardModifierLevels[modID]
          );
          astrologyMenus.explorePanel.setStandardLockedStatus(modID, astroMod);
        }
      });
    }
    this.renderQueue.exploredStandardModifiers.clear();
  }
  renderExploredUniqueMods() {
    if (this.renderQueue.exploredUniqueModifiers.size === 0) return;
    const explored = this.exploredConstellation;
    if (explored !== undefined) {
      this.renderQueue.exploredUniqueModifiers.forEach((modID) => {
        const astroMod = explored.uniqueModifiers[modID];
        if (
          this.isModifierUnlocked(explored, AstrologyModifierType.Unique, modID)
        ) {
          const buyCount = explored.uniqueModsBought[modID];
          const modValue = buyCount * astroMod.incrementValue;
          const mods = this.getModifierElement(astroMod, modValue);
          const precision = Number.isInteger(modValue) ? 0 : 2;
          astrologyMenus.explorePanel.setUniqueModifier(modID, mods, precision);
          astrologyMenus.explorePanel.setUniqueModifierStatus(
            modID,
            buyCount,
            astroMod
          );
        } else {
          astrologyMenus.explorePanel.setUniqueLocked(
            modID,
            Astrology.uniqueModifierLevels[modID]
          );
          astrologyMenus.explorePanel.setUniqueLockedStatus(modID, astroMod);
        }
      });
    }
    this.renderQueue.exploredUniqueModifiers.clear();
  }
  renderVisibleConstellations() {
    if (!this.renderQueue.visibleConstellations) return;
    if (this.exploredConstellation === undefined) {
      this.actions.forEach((constellation) => {
        const menu = astrologyMenus.constellations.get(constellation);
        if (menu === undefined) return;
        if (this.level >= constellation.level) {
          showElement(menu);
        } else {
          hideElement(menu);
        }
      });
      hideElement(astrologyMenus.explorePanel);
    } else {
      this.actions.forEach((constellation) => {
        const menu = astrologyMenus.constellations.get(constellation);
        if (menu === undefined) return;
        if (constellation !== this.exploredConstellation) {
          hideElement(menu);
        } else {
          showElement(menu);
          menu.setExplored();
        }
      });
      showElement(astrologyMenus.explorePanel);
      astrologyMenus.explorePanel.setConstellation(this.exploredConstellation);
    }
    this.renderQueue.visibleConstellations = false;
  }
  renderUpgradeCosts() {
    if (!this.renderQueue.rerollCosts) return;
    if (this.exploredConstellation !== undefined) {
      astrologyMenus.explorePanel.setUpgradeCosts(this.exploredConstellation);
    }
    this.renderQueue.rerollCosts = false;
  }
  viewAllModifiersOnClick() {
    const passives = this.modifiers
      .getActiveModifierDescriptions()
      .map(
        ([text, textClass]) =>
          `<h5 class="font-w400 font-size-sm mb-1 ${textClass}">${text}</h5>`
      )
      .join("");
    SwalLocale.fire({
      title: getLangString("ASTROLOGY", "MISC_6"),
      html: passives,
    });
  }
  studyConstellationOnClick(constellation) {
    const wasActive = this.isActive;
    if (this.isActive && !this.stop()) return;
    if (!wasActive || constellation !== this.studiedConstellation) {
      this.studiedConstellation = constellation;
      this.start();
    }
  }
  exploreConstellationOnClick(constellation) {
    var _a;
    if (this.exploredConstellation === undefined) {
      this.exploredConstellation = constellation;
      this.onConstellationExplore();
    } else {
      (_a = astrologyMenus.constellations.get(this.exploredConstellation)) ===
        null || _a === void 0
        ? void 0
        : _a.setUnexplored();
      this.exploredConstellation = undefined;
    }
    this.renderQueue.visibleConstellations = true;
    this.render();
  }
  rerollSpecificStandardModifierOnClick(constellation, modID) {
    this.upgradeStandardModifier(constellation, modID);
  }
  rerollSpecificUniqueModifierOnClick(constellation, modID) {
    this.upgradeUniqueModifier(constellation, modID);
  }
  resetActionState() {
    super.resetActionState();
    this.studiedConstellation = undefined;
  }
  encodeAction(writer, recipe) {
    writer.writeNamespacedObject(recipe);
    writer.writeArray(recipe.standardModsBought, (count, writer) =>
      writer.writeUint8(count)
    );
    writer.writeArray(recipe.uniqueModsBought, (count, writer) =>
      writer.writeUint8(count)
    );
  }
  encode(writer) {
    super.encode(writer);
    writer.writeBoolean(this.studiedConstellation !== undefined);
    if (this.studiedConstellation)
      writer.writeNamespacedObject(this.studiedConstellation);
    writer.writeBoolean(this.exploredConstellation !== undefined);
    if (this.exploredConstellation)
      writer.writeNamespacedObject(this.exploredConstellation);
    writer.writeArray(this.actions.allObjects, (recipe, writer) => {
      this.encodeAction(writer, recipe);
    });
    writer.writeUint32(this.actions.dummySize);
    this.actions.forEachDummy((recipe) => {
      this.encodeAction(writer, recipe);
    });
    return writer;
  }
  decodeAction(reader, version) {
    const recipe = reader.getNamespacedObject(this.actions);
    const standardModsBought = reader.getArray((reader) => reader.getUint8());
    const uniqueModsBought = reader.getArray((reader) => reader.getUint8());
    if (!(typeof recipe === "string")) {
      recipe.standardModsBought = standardModsBought;
      recipe.uniqueModsBought = uniqueModsBought;
    } else if (recipe.startsWith("melvor")) {
      const dummyRecipe = this.actions.getDummyObject(
        recipe,
        DummyAstrologyRecipe,
        this.game
      );
      dummyRecipe.standardModsBought = standardModsBought;
      dummyRecipe.uniqueModsBought = uniqueModsBought;
    }
  }
  decode(reader, version) {
    super.decode(reader, version);
    if (reader.getBoolean()) {
      const studied = reader.getNamespacedObject(this.actions);
      if (typeof studied === "string") this.shouldResetAction = true;
      else this.studiedConstellation = studied;
    }
    if (reader.getBoolean()) {
      const explored = reader.getNamespacedObject(this.actions);
      if (typeof explored !== "string") this.exploredConstellation = explored;
    }
    reader.getArray((reader) => {
      this.decodeAction(reader, version);
    });
    const numDummyRecipes = reader.getUint32();
    for (let i = 0; i < numDummyRecipes; i++) {
      this.decodeAction(reader, version);
    }
    if (this.shouldResetAction) this.resetActionState();
    if (version < 34) {
      this.shouldRefundStardustAgain = true;
    }
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    const getConstellation = (id) => {
      const recipe = this.actions.getObjectByID(
        idMap.astrologyConstellations[id]
      );
      return recipe;
    };
    const studiedID = reader.getNumber();
    const exploredID = reader.getNumber();
    if (this.isActive) {
      this.studiedConstellation = getConstellation(studiedID);
      if (this.studiedConstellation === undefined)
        this.shouldResetAction = true;
    }
    if (exploredID >= 0) {
      this.exploredConstellation = getConstellation(exploredID);
    }
    if (version < 18) {
      this.shouldRefundStardust = true;
    }
    if (version > 18) {
      const numConstellations = reader.getNumber();
      for (let i = 0; i < numConstellations; i++) {
        const recipe = getConstellation(reader.getNumber());
        const standard = reader.getAstrologyModifierArray(this.game, idMap);
        const unique = reader.getAstrologyModifierArray(this.game, idMap);
        const getModBuyCount = (modArray, modsPossible) => {
          const firstMod = modArray[0];
          let value = 0;
          if ("values" in firstMod) {
            value = firstMod.values[0].value;
          } else {
            value = firstMod.value;
          }
          return Math.round(value / modsPossible.incrementValue);
        };
        if (recipe !== undefined) {
          standard.forEach((modArray, index) => {
            recipe.standardModsBought[index] = getModBuyCount(
              modArray,
              recipe.standardModifiers[index]
            );
          });
          unique.forEach((modArray, index) => {
            recipe.uniqueModsBought[index] = getModBuyCount(
              modArray,
              recipe.uniqueModifiers[index]
            );
          });
        }
      }
    }
    if (this.shouldResetAction) this.resetActionState();
    if (version < 34) {
      this.shouldRefundStardustAgain = true;
    }
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.astrologyConstellations[oldActionID];
  }
  setFromOldOffline(offline, idMap) {
    const recipe = this.actions.getObjectByID(
      idMap.astrologyConstellations[offline.action]
    );
    if (recipe !== undefined) this.studyConstellationOnClick(recipe);
  }
  rollForMeteorite() {
    const random = Math.random() * 100;
    if (this.meteoriteChance > random) this.game.mining.addMeteoriteVein();
  }
  testTranslations() {
    super.testTranslations();
    this.actions.forEach((action) => {
      action.name;
    });
  }
}
Astrology.standardModifierLevels = [1, 40, 80];
Astrology.uniqueModifierLevels = [20, 60, 99];
Astrology.standardModifierCosts = [10, 20, 40, 80, 160, 320, 640, 1280];
Astrology.uniqueModifierCosts = [50, 100, 200, 400, 800];
Astrology.baseStardustChance = 5;
Astrology.baseGoldenStardustChance = 2;
Astrology.baseInterval = 3000;
Astrology.modifierMagnitudeChances = [50, 30, 15, 4, 1];
var AstrologyModifierType;
(function (AstrologyModifierType) {
  AstrologyModifierType[(AstrologyModifierType["Standard"] = 0)] = "Standard";
  AstrologyModifierType[(AstrologyModifierType["Unique"] = 1)] = "Unique";
})(AstrologyModifierType || (AstrologyModifierType = {}));
class AstrologyRenderQueue extends GatheringSkillRenderQueue {
  constructor() {
    super(...arguments);
    this.constellationRates = false;
    this.stardustQuantities = false;
    this.exploredStandardModifiers = new Set();
    this.exploredUniqueModifiers = new Set();
    this.stardustRates = false;
    this.visibleConstellations = false;
    this.rerollCosts = false;
  }
}
