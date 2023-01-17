"use strict";
class WoodcuttingTree extends SingleProductRecipe {
  constructor(namespace, data, game) {
    super(namespace, data, game);
    this.canDropRavenNest = false;
    this._name = data.name;
    this._media = data.media;
    this.baseInterval = data.baseInterval;
    if (data.canDropRavenNest) this.canDropRavenNest = true;
    if (data.shopItemPurchased !== undefined) {
      const purchase = game.shop.purchases.getObjectByID(
        data.shopItemPurchased
      );
      if (purchase === undefined)
        throw new UnregisteredConstructionError(
          this,
          ShopPurchase.name,
          data.shopItemPurchased
        );
      this.shopItemPurchased = purchase;
    }
  }
  get media() {
    return this.getMediaURL(this._media);
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("TREE_NAME", this.localID);
    }
  }
}
class Woodcutting extends GatheringSkill {
  constructor(namespace, game) {
    super(namespace, "Woodcutting", game);
    this._media = "assets/media/skills/woodcutting/woodcutting.svg";
    this.activeTrees = new Set();
    this.renderQueue = new WoodcuttingRenderQueue();
    this.bannedJewelry = new Set();
    this.randomJewelry = [];
  }
  getTotalUnlockedMasteryActions() {
    return this.actions.reduce(levelUnlockSum(this), 0);
  }
  get mushroomChance() {
    return this.game.modifiers.increasedChanceToFindMushroomWoodcutting;
  }
  addArrowShaftReward(tree, rewards) {
    var _a;
    const shaftRecipe = this.game.fletching.actions.getObjectByID(
      "melvorF:Arrow_Shafts"
    );
    if (shaftRecipe === undefined) return;
    const altCostMatch =
      (_a = shaftRecipe.alternativeCosts) === null || _a === void 0
        ? void 0
        : _a.find((altCost) => {
            return altCost.itemCosts[0].item === tree.product;
          });
    if (altCostMatch === undefined) return;
    rewards.addItem(
      shaftRecipe.product,
      altCostMatch.quantityMultiplier * shaftRecipe.baseQuantity
    );
  }
  registerData(namespace, data) {
    var _a;
    super.registerData(namespace, data);
    (_a = data.trees) === null || _a === void 0
      ? void 0
      : _a.forEach((treeData) => {
          this.actions.registerObject(
            new WoodcuttingTree(namespace, treeData, this.game)
          );
        });
    if (data.nestItemID !== undefined) {
      this.nestItem = this.getItemForRegistration(data.nestItemID);
    }
    if (data.bannedJewleryIDs !== undefined) {
      data.bannedJewleryIDs.forEach((id) => {
        const bannedItem = this.getItemForRegistration(id);
        this.bannedJewelry.add(bannedItem);
      });
    }
    if (data.ashItemID !== undefined)
      this.ashItem = this.getItemForRegistration(data.ashItemID);
    if (data.mushroomItemID !== undefined)
      this.mushroomItem = this.getItemForRegistration(data.mushroomItemID);
    if (data.ravenNestItemID !== undefined)
      this.ravenNestItem = this.getItemForRegistration(data.ravenNestItemID);
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.game.crafting.actions.forEach((recipe) => {
      if (
        (recipe.category.id === "melvorF:Necklaces" ||
          recipe.category.id === "melvorF:Rings") &&
        !this.bannedJewelry.has(recipe.product)
      ) {
        this.randomJewelry.push(recipe.product);
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
    if (this.getMasteryLevel(action) >= 99) modifier -= 200;
    return modifier;
  }
  getUncappedDoublingChance(action) {
    let chance = super.getUncappedDoublingChance(action);
    const masteryLevel = this.getMasteryLevel(action);
    chance += Math.floor(masteryLevel / 10) * 5;
    if (this.isPoolTierActive(1)) chance += 5;
    if (this.game.modifiers.halvedWoodcuttingDoubleChance > 0)
      chance = Math.floor(chance / 2);
    return chance;
  }
  getTreeInterval(tree) {
    return this.modifyInterval(tree.baseInterval, tree);
  }
  getTreeMultiplier(tree) {
    const treeInterval = this.getTreeInterval(tree);
    const actionInterval = this.actionInterval;
    if (treeInterval < actionInterval) return actionInterval / treeInterval;
    return 1;
  }
  getTreeMasteryXP(tree) {
    return this.getMasteryXPToAddForAction(tree, this.masteryModifiedInterval);
  }
  getBirdNestChance() {
    let birdNestChance =
      this.game.modifiers.increasedBirdNestDropRate -
      this.game.modifiers.decreasedBirdNestDropRate;
    birdNestChance = Math.max(0.5, birdNestChance);
    return birdNestChance;
  }
  getRavenNestChance() {
    return 3;
  }
  getBirdNestQuantity() {
    let nestQuantity = 1;
    const activePotion = this.activePotion;
    if (
      activePotion !== undefined &&
      [
        "melvorF:Bird_Nest_Potion_I",
        "melvorF:Bird_Nest_Potion_II",
        "melvorF:Bird_Nest_Potion_III",
        "melvorF:Bird_Nest_Potion_IV",
      ].includes(activePotion.id)
    )
      nestQuantity +=
        this.game.modifiers.increasedMinimumBirdNestsWhenPotionActive;
    if (this.isPoolTierActive(3)) nestQuantity++;
    nestQuantity += this.game.modifiers.increasedMinBirdNestQuantity;
    return nestQuantity;
  }
  getMasteryXPModifier(action) {
    let modifier = super.getMasteryXPModifier(action);
    if (this.isPoolTierActive(0)) modifier += 5;
    return modifier;
  }
  get treeCutLimit() {
    return 1 + this.game.modifiers.increasedTreeCutLimit;
  }
  onStop() {
    this.activeTrees.clear();
    this.renderQueue.selectedTrees = true;
  }
  selectTree(tree) {
    if (this.game.isGolbinRaid) return;
    if (this.activeTrees.has(tree)) {
      this.activeTrees.delete(tree);
    } else if (this.activeTrees.size < this.treeCutLimit) {
      this.activeTrees.add(tree);
    } else {
      notifyPlayer(
        this,
        getLangString("TOASTS", "CUT_LIMIT_REACHED"),
        "danger"
      );
      return;
    }
    if (this.activeTrees.size === 0) {
      this.stop();
    } else {
      this.renderQueue.selectedTrees = true;
      this.start();
    }
  }
  get actionInterval() {
    let interval = -Infinity;
    this.activeTrees.forEach((tree) => {
      interval = Math.max(interval, this.getTreeInterval(tree));
    });
    return interval;
  }
  get totalXPToAdd() {
    let baseXP = 0;
    this.activeTrees.forEach((tree) => {
      baseXP += this.getTreeMultiplier(tree) * tree.baseExperience;
    });
    return this.modifyXP(baseXP);
  }
  get totalPoolXPToAdd() {
    let totalMasteryXP = 0;
    this.activeTrees.forEach((tree) => {
      totalMasteryXP += this.getMasteryXPToAddForAction(
        tree,
        this.masteryModifiedInterval
      );
    });
    return this.getMasteryXPToAddToPool(totalMasteryXP);
  }
  get actionLevel() {
    let highestLevel = -Infinity;
    this.activeTrees.forEach((tree) => {
      highestLevel = Math.max(highestLevel, tree.level);
    });
    return highestLevel;
  }
  get stardustChance() {
    return this.game.modifiers.increasedChanceStardustCuttingMagicLogs;
  }
  getWCXPtoFMXP() {
    return (
      (this.game.modifiers.increasedWoodcuttingXPAddedAsFiremakingXP -
        this.game.modifiers.decreasedWoodcuttingXPAddedAsFiremakingXP) /
      100
    );
  }
  get ashChance() {
    return (
      this.game.modifiers.increasedChanceForAshInWoodcutting -
      this.game.modifiers.decreasedChanceForAshInWoodcutting
    );
  }
  get masteryAction() {
    return [...this.activeTrees][0];
  }
  get masteryModifiedInterval() {
    return this.actionInterval;
  }
  preAction() {}
  get actionRewards() {
    const rewards = new Rewards(this.game);
    const actionEvent = new WoodcuttingActionEvent(
      this,
      new Set(this.activeTrees)
    );
    let baseLogQty = 1;
    if (
      this.game.modifiers.summoningSynergy_3_17 > 0 &&
      rollPercentage(this.game.modifiers.summoningSynergy_3_17)
    )
      baseLogQty++;
    this.activeTrees.forEach((tree) => {
      let logQuantity = baseLogQty;
      const doubleChance = this.getDoublingChance(tree);
      if (rollPercentage(doubleChance)) logQuantity *= 2;
      if (this.game.modifiers.doubleLogProduction > 0) logQuantity *= 2;
      const chanceForExtraResource =
        this.game.modifiers.getSkillModifierValue(
          "increasedChanceAdditionalSkillResource",
          this
        ) -
        this.game.modifiers.getSkillModifierValue(
          "decreasedChanceAdditionalSkillResource",
          this
        );
      if (rollPercentage(chanceForExtraResource)) logQuantity++;
      const multiplier = this.getTreeMultiplier(tree);
      logQuantity = Math.floor(logQuantity * multiplier);
      this.game.stats.Woodcutting.add(WoodcuttingStats.LogsCut, logQuantity);
      rewards.addItem(tree.product, logQuantity);
      rewards.addXP(this, tree.baseExperience * multiplier);
      if (this.getWCXPtoFMXP() > 0)
        rewards.addXP(
          this.game.firemaking,
          tree.baseExperience * multiplier * this.getWCXPtoFMXP()
        );
      if (this.ashItem !== undefined && rollPercentage(this.ashChance))
        rewards.addItem(this.ashItem, 1);
      if (
        this.mushroomItem !== undefined &&
        rollPercentage(this.mushroomChance)
      )
        rewards.addItem(this.mushroomItem, 1);
      const shaftChance =
        this.game.modifiers.increasedChanceForArrowShaftsWoodcutting -
        this.game.modifiers.decreasedChanceForArrowShaftsWoodcutting;
      if (rollPercentage(shaftChance)) {
        this.addArrowShaftReward(tree, rewards);
      }
      if (
        tree.id === "melvorD:Magic" &&
        rollPercentage(this.stardustChance) &&
        this.game.astrology.starDustItem !== undefined
      )
        rewards.addItem(this.game.astrology.starDustItem, logQuantity);
      actionEvent.productQuantity += logQuantity;
    });
    if (
      this.game.modifiers.increasedWoodcuttingGemChance > 0 &&
      rollPercentage(this.game.modifiers.increasedWoodcuttingGemChance)
    )
      rewards.addItem(this.game.randomGemTable.getDrop().item, 1);
    if (
      this.nestItem !== undefined &&
      rollForOffItem(this.getBirdNestChance())
    ) {
      const nestQuantity = this.getBirdNestQuantity();
      let nestItem = this.nestItem;
      if (
        rollPercentage(this.game.modifiers.increasedWoodcuttingJewelryChance)
      ) {
        nestItem = getRandomArrayElement(this.randomJewelry);
      } else {
        this.game.stats.Woodcutting.add(
          WoodcuttingStats.BirdNestsGotten,
          nestQuantity
        );
      }
      rewards.addItem(nestItem, nestQuantity);
      actionEvent.nestGiven = true;
    }
    let canRollForRavenNest = false;
    for (const tree of this.activeTrees) {
      if (tree.canDropRavenNest) {
        canRollForRavenNest = true;
        break;
      }
    }
    if (
      this.ravenNestItem !== undefined &&
      canRollForRavenNest &&
      rollForOffItem(this.getRavenNestChance())
    ) {
      rewards.addItem(this.ravenNestItem, this.getBirdNestQuantity());
    }
    this.addCommonRewards(rewards);
    this.game.processEvent(actionEvent, this.currentActionInterval);
    return rewards;
  }
  addMasteryXPReward() {
    this.activeTrees.forEach((tree) => {
      this.addMasteryForAction(tree, this.masteryModifiedInterval);
    });
  }
  postAction() {
    this.game.stats.Woodcutting.inc(WoodcuttingStats.Actions);
    this.game.stats.Woodcutting.add(
      WoodcuttingStats.TimeSpent,
      this.currentActionInterval
    );
    this.renderQueue.treeGrants = true;
    this.renderQueue.treeRates = true;
  }
  onLoad() {
    super.onLoad();
    woodcuttingMenu.localize();
    this.renderQueue.treeUnlocks = true;
    this.renderQueue.treeRates = true;
    this.renderQueue.selectedTrees = true;
    if (this.isActive) {
      this.renderQueue.progressBar = true;
    }
    this.actions.forEach((tree) => {
      this.renderQueue.actionMastery.add(tree);
    });
    this.render();
  }
  onMasteryLevelUp(action, oldLevel, newLevel) {
    super.onMasteryLevelUp(action, oldLevel, newLevel);
    if (newLevel >= 99) this.renderQueue.treeRates = true;
  }
  onModifierChange() {
    super.onModifierChange();
    this.renderQueue.treeRates = true;
    this.renderQueue.treeGrants = true;
  }
  onEquipmentChange() {}
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.renderQueue.treeUnlocks = true;
  }
  getErrorLog() {
    const treeLog = [];
    this.activeTrees.forEach((tree) => {
      treeLog.push(`${tree.id}`);
    });
    return `${super.getErrorLog()}
Active Trees: ${treeLog.join("\n")}`;
  }
  render() {
    super.render();
    this.renderTreeRates();
    this.renderTreeUnlock();
    this.renderProgressBar();
    this.renderSelectedTrees();
    this.renderTreeGrants();
  }
  renderTreeRates() {
    if (!this.renderQueue.treeRates) return;
    woodcuttingMenu.updateTreeRates();
    this.renderQueue.treeRates = false;
  }
  renderTreeUnlock() {
    if (!this.renderQueue.treeUnlocks) return;
    woodcuttingMenu.updateTreeUnlocks();
    this.renderQueue.treeUnlocks = false;
  }
  renderProgressBar() {
    if (!this.renderQueue.progressBar) return;
    if (this.isActive)
      woodcuttingMenu.progressBar.animateProgressFromTimer(this.actionTimer);
    else woodcuttingMenu.progressBar.stopAnimation();
    this.renderQueue.progressBar = false;
  }
  renderSelectedTrees() {
    if (!this.renderQueue.selectedTrees) return;
    woodcuttingMenu.setTrees(this.activeTrees);
    this.renderQueue.selectedTrees = false;
  }
  renderTreeGrants() {
    if (!this.renderQueue.treeGrants) return;
    woodcuttingMenu.updateSelectedTrees();
    this.renderQueue.treeGrants = false;
  }
  resetActionState() {
    super.resetActionState();
    this.activeTrees.clear();
  }
  encode(writer) {
    super.encode(writer);
    writer.writeSet(this.activeTrees, writeNamespaced);
    return writer;
  }
  decode(reader, version) {
    super.decode(reader, version);
    this.activeTrees = reader.getSet(readNamespacedReject(this.actions));
    if (this.isActive && this.activeTrees.size === 0)
      this.shouldResetAction = true;
    if (this.shouldResetAction) this.resetActionState();
  }
  deserialize(reader, version, idMap) {
    super.deserialize(reader.getVariableLengthChunk(), version, idMap);
    this.activeTrees = new Set();
    reader
      .getVariableLengthChunk()
      .getRawData()
      .forEach((oldID) => {
        const tree = this.actions.getObjectByID(idMap.woodcuttingTrees[oldID]);
        if (tree !== undefined) this.activeTrees.add(tree);
      });
    if (this.isActive && this.activeTrees.size === 0)
      this.shouldResetAction = true;
    if (this.shouldResetAction) this.resetActionState();
  }
  getActionIDFromOldID(oldActionID, idMap) {
    return idMap.woodcuttingTrees[oldActionID];
  }
  setFromOldOffline(offline, idMap) {
    offline.action.forEach((treeID) => {
      const tree = this.actions.getObjectByID(idMap.woodcuttingTrees[treeID]);
      if (tree !== undefined) this.selectTree(tree);
    });
  }
  testTranslations() {
    super.testTranslations();
    this.actions.forEach((action) => {
      action.name;
    });
  }
}
class WoodcuttingRenderQueue extends GatheringSkillRenderQueue {
  constructor() {
    super(...arguments);
    this.selectedTrees = false;
    this.treeRates = false;
    this.treeUnlocks = false;
    this.treeGrants = false;
  }
}
