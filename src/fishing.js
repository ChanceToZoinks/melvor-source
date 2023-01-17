"use strict";class Fish extends SingleProductRecipe{constructor(namespace,data,game){super(namespace,data,game);this.strengthXP=data.strengthXP;this.baseMinInterval=data.baseMinInterval;this.baseMaxInterval=data.baseMaxInterval;}}
class FishingArea extends NamespacedObject{constructor(namespace,data,fishing,game){super(namespace,data.id);this.isSecret=false;this._name=data.name;this.fishChance=data.fishChance;this.junkChance=data.junkChance;this.specialChance=data.specialChance;this.fish=data.fishIDs.map((id)=>{const fish=fishing.actions.getObjectByID(id);if(fish===undefined)
throw new Error(`Error constructing FishingArea with id ${this.id}. Fish with id: ${id} is not registered.`);return fish;});this._description=data.description;if(data.requiredItemID!==undefined){const item=game.items.equipment.getObjectByID(data.requiredItemID);if(item===undefined)
throw new Error(`Error constructing FishingArea. Item with id: ${data.requiredItemID} is not registered.`);this.requiredItem=item;}
if(data.isSecret)
this.isSecret=true;}
get name(){if(this.isModded){return this._name;}
else{return getLangString('FISHING',`AREA_NAME_${this.localID}`);}}
get description(){if(this._description===undefined)
return undefined;if(this.isModded){return this._description;}
else{return getLangString('FISHING',`AREA_DESCRIPTION_${this.localID}`);}}}
class Fishing extends GatheringSkill{constructor(namespace,game){super(namespace,'Fishing',game);this._media='assets/media/skills/fishing/fishing.svg';this.renderQueue=new FishingRenderQueue();this.secretAreaUnlocked=false;this.selectedAreaFish=new Map();this.hiddenAreas=new Set();this.junkItems=[];this.specialItems=new DropTable(this.game,[]);this.areas=new NamespaceRegistry(game.registeredNamespaces);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
get chanceForLostChest(){return this.game.modifiers.increasedChanceToFindLostChest;}
get actionInterval(){const minTicks=this.getMinFishInterval(this.activeFish)/TICK_INTERVAL;const maxTicks=this.getMaxFishInterval(this.activeFish)/TICK_INTERVAL;return TICK_INTERVAL*rollInteger(minTicks,maxTicks);}
get actionLevel(){return this.activeFish.level;}
get masteryAction(){return this.activeFish;}
get chanceForOneExtraFish(){return this.game.modifiers.increasedChanceForOneExtraFish-this.game.modifiers.decreasedChanceForOneExtraFish;}
get activeFish(){if(this.activeFishingArea===undefined)
throw new Error(`Tried to get active fish, but no area is active`);const fish=this.selectedAreaFish.get(this.activeFishingArea);if(fish===undefined)
throw new Error('Tried to get active fish from area, but area has no fish selected');return fish;}
registerData(namespace,data){var _a,_b,_c;super.registerData(namespace,data);(_a=data.fish)===null||_a===void 0?void 0:_a.forEach((data)=>{this.actions.registerObject(new Fish(namespace,data,this.game));});(_b=data.areas)===null||_b===void 0?void 0:_b.forEach((area)=>{this.areas.registerObject(new FishingArea(namespace,area,this,this.game));});(_c=data.junkItemIDs)===null||_c===void 0?void 0:_c.forEach((itemID)=>{const junkItem=this.game.items.getObjectByID(itemID);if(junkItem===undefined)
throw new Error(`Error registering fishing skill data, junk item with id: ${itemID} is not registered.`);this.junkItems.push(junkItem);});if(data.specialItems!==undefined)
this.specialItems.registerDrops(this.game,data.specialItems);if(data.easterEgg!==undefined){const original=this.game.items.getObjectByID(data.easterEgg.originalID);const equipped=this.game.items.equipment.getObjectByID(data.easterEgg.equippedID);const reward=this.game.items.getObjectByID(data.easterEgg.rewardID);if(!(original!==undefined&&equipped!==undefined&&reward!==undefined))
throw new Error('Error registering easter egg. Blame Coolrox.');this.easterEgg={original,equipped,reward};}
if(data.lostChestItem!==undefined)
this.lostChestItem=this.getItemForRegistration(data.lostChestItem);}
postDataRegistration(){super.postDataRegistration();this.sortedMasteryActions=this.actions.allObjects.sort((a,b)=>a.level-b.level);this.milestones.push(...this.actions.allObjects);this.sortMilestones();}
unlockSecretArea(){if(this.secretAreaUnlocked)
return;this.secretAreaUnlocked=true;this.renderQueue.areaUnlock=true;this.render();}
getMinFishInterval(fish){return this.modifyInterval(fish.baseMinInterval,fish);}
getMaxFishInterval(fish){return this.modifyInterval(fish.baseMaxInterval,fish);}
getUncappedDoublingChance(action){let chance=super.getUncappedDoublingChance(action);if(this.isPoolTierActive(2))
chance+=5;return chance;}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(0))
modifier+=5;return modifier;}
getAreaChances(area){const chances=new FishingAreaChances();chances.setChancesFromArea(area);const fishToSpecialShift=this.game.modifiers.increasedFishingSpecialChance-this.game.modifiers.decreasedFishingSpecialChance;let bonusSpecialChance=this.game.modifiers.increasedBonusFishingSpecialChance;let noJunk=this.isPoolTierActive(1);const fish=this.selectedAreaFish.get(area);if(fish!==undefined){const masteryLevel=this.getMasteryLevel(fish);if(masteryLevel>=50)
bonusSpecialChance+=3;if(masteryLevel>=65)
noJunk=true;}
chances.addBonusSpecialChance(bonusSpecialChance);chances.shiftFishToSpecial(fishToSpecialShift);if(noJunk)
chances.shiftJunkToFish(chances.junk);return chances;}
preAction(){}
get actionRewards(){const rewards=new Rewards(this.game);if(this.activeFishingArea===undefined)
throw new Error('Tried to get actionRewards but no area is active.');const chances=this.getAreaChances(this.activeFishingArea);const fish=this.activeFish;const actionEvent=new FishingActionEvent(this,fish,this.activeFishingArea);let rewardType=chances.rollForRewardType();if(!this.game.tutorial.complete)
rewardType=FishingRewardType.Fish;const masteryLevel=this.masteryLevel;let rewardQty=1;if(masteryLevel>=99||rollPercentage(masteryLevel*0.4))
rewardQty*=2;const doublingChance=this.getDoublingChance(this.masteryAction);if(rollPercentage(doublingChance))
rewardQty*=2;rewardQty*=Math.pow(2,this.game.modifiers.getSkillModifierValue('doubleItemsSkill',this));const chanceForExtraResource=this.game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource',this)-
this.game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource',this);if(rollPercentage(chanceForExtraResource))
rewardQty++;if(rewardType===FishingRewardType.Fish){if(rollPercentage(this.chanceForOneExtraFish))
rewardQty++;}
let rewardItem;switch(rewardType){case FishingRewardType.Fish:rewardItem=fish.product;this.game.stats.Fishing.add(FishingStats.FishCaught,rewardQty);break;case FishingRewardType.Junk:rewardItem=getRandomArrayElement(this.junkItems);this.game.stats.Fishing.add(FishingStats.JunkCaught,rewardQty);break;case FishingRewardType.Special:rewardItem=this.specialItems.getDrop().item;this.game.stats.Fishing.add(FishingStats.SpecialItemsCaught,rewardQty);if(this.isPoolTierActive(3)&&rollPercentage(25)){rewards.addItem(this.specialItems.getDrop().item,1);this.game.stats.Fishing.inc(FishingStats.SpecialItemsCaught);}
break;}
actionEvent.productQuantity=rewardQty;if(this.easterEgg!==undefined&&rewardItem===this.easterEgg.original&&this.game.combat.player.equipment.checkForItem(this.easterEgg.equipped)&&this.masteryPoolProgress>=100&&masteryLevel>=99&&rollPercentage(0.01))
rewardItem=this.easterEgg.reward;rewards.addItem(rewardItem,rewardQty);if(rewardType!==FishingRewardType.Junk){rewards.addXP(this,fish.baseExperience);if(fish.strengthXP>0)
rewards.addXP(this.game.strength,fish.strengthXP);}
else{rewards.addXP(this,1);}
this.addCommonRewards(rewards);if(rewardItem.type==='Gem'){actionEvent.gemGiven=true;if(rollPercentage(this.game.modifiers.summoningSynergy_4_5))
rewards.addItem(this.game.randomGemTable.getDrop().item,1);}
const cookedItem=this.game.cooking.getIngredientCookedVersion(rewardItem);if(cookedItem!==undefined){actionEvent.cookedVersionExists=true;if(rollPercentage(this.game.modifiers.increasedFishingCookedChance))
rewards.addItem(cookedItem,1);}
if(this.lostChestItem!==undefined&&rollPercentage(this.chanceForLostChest))
rewards.addItem(this.lostChestItem,1);this.game.processEvent(actionEvent,this.currentActionInterval);return rewards;}
postAction(){this.game.stats.Fishing.inc(FishingStats.Actions);this.game.stats.Fishing.add(FishingStats.TimeSpent,this.currentActionInterval);this.renderQueue.selectedAreaFishRates=true;this.renderQueue.areaChances=true;}
get masteryModifiedInterval(){return this.currentActionInterval;}
onModifierChange(){super.onModifierChange();this.renderQueue.areaChances=true;this.renderQueue.selectedAreaFishRates=true;}
onEquipmentChange(){this.renderQueue.areaUnlock=true;}
onLevelUp(oldLevel,newLevel){super.onLevelUp(oldLevel,newLevel);this.renderQueue.areaButtons=true;}
getErrorLog(){var _a;const selectedFishLog=[];this.selectedAreaFish.forEach((fish,area)=>{selectedFishLog.push(`${area.id}:${fish.id}`);});return `${super.getErrorLog()}
Active Area: ${(_a=this.activeFishingArea)===null||_a===void 0?void 0:_a.id}
Selected Area Fish: 
${selectedFishLog.join('\n')}
`;}
onLoad(){super.onLoad();this.areas.forEach((area)=>{var _a;(_a=fishingAreaMenus.get(area))===null||_a===void 0?void 0:_a.setAreaData(area);});this.renderQueue.selectedAreaFish=true;this.renderQueue.selectedAreaFishRates=true;this.renderQueue.areaChances=true;this.renderQueue.areaButtons=true;this.renderQueue.areaUnlock=true;if(this.isActive){this.renderQueue.activeArea=true;}
this.renderHiddenAreas();this.selectedAreaFish.forEach((fish)=>{this.renderQueue.actionMastery.add(fish);});}
onStop(){var _a;if(this.activeFishingArea!==undefined)
(_a=fishingAreaMenus.get(this.activeFishingArea))===null||_a===void 0?void 0:_a.setActionInactive();}
onAreaStartButtonClick(area){const wasActive=this.isActive;if(this.isActive&&!this.stop())
return;const prevArea=this.activeFishingArea;this.activeFishingArea=area;if((!wasActive||area!==prevArea)&&this.selectedAreaFish.get(area)!==undefined&&this.level>=this.activeFish.level){this.start();this.renderQueue.activeArea=true;}
this.render();}
renderHiddenAreas(){this.areas.forEach((area)=>{const menu=fishingAreaMenus.get(area);if(this.hiddenAreas.has(area))
menu===null||menu===void 0?void 0:menu.hideAreaPanel();else
menu===null||menu===void 0?void 0:menu.showAreaPanel();});}
onAreaHeaderClick(area){var _a,_b;if(this.hiddenAreas.has(area)){this.hiddenAreas.delete(area);(_a=fishingAreaMenus.get(area))===null||_a===void 0?void 0:_a.showAreaPanel();}
else{this.hiddenAreas.add(area);(_b=fishingAreaMenus.get(area))===null||_b===void 0?void 0:_b.hideAreaPanel();}}
onAreaFishSelection(area,fish){const previousSelection=this.selectedAreaFish.get(area);if(area===this.activeFishingArea&&previousSelection!==fish&&this.isActive&&!this.stop())
return;this.selectedAreaFish.set(area,fish);this.renderQueue.selectedAreaFish=true;this.renderQueue.selectedAreaFishRates=true;this.renderQueue.areaChances=true;this.renderQueue.actionMastery.add(fish);this.render();}
render(){this.renderSelectedAreaFish();super.render();this.renderSelectedFishRates();this.renderAreaChances();this.renderAreaButtons();this.renderAreaUnlock();this.renderActiveArea();}
renderSelectedAreaFish(){if(!this.renderQueue.selectedAreaFish)
return;this.areas.forEach((area)=>{const menu=fishingAreaMenus.get(area);const selectedFish=this.selectedAreaFish.get(area);if(selectedFish!==undefined){menu===null||menu===void 0?void 0:menu.setSelectedFish(selectedFish);}
else{menu===null||menu===void 0?void 0:menu.setUnselected();}});this.renderQueue.selectedAreaFish=false;}
renderSelectedFishRates(){if(!this.renderQueue.selectedAreaFishRates)
return;this.areas.forEach((area,id)=>{const menu=fishingAreaMenus.get(area);const selectedFish=this.selectedAreaFish.get(area);if(selectedFish!==undefined){menu===null||menu===void 0?void 0:menu.updateSelectedFishRates(selectedFish);}});this.renderQueue.selectedAreaFishRates=false;}
renderAreaChances(){if(!this.renderQueue.areaChances)
return;this.areas.forEach((area)=>{var _a;(_a=fishingAreaMenus.get(area))===null||_a===void 0?void 0:_a.setChances(this.getAreaChances(area),area);});this.renderQueue.areaChances=false;}
renderAreaButtons(){if(!this.renderQueue.areaButtons)
return;this.areas.forEach((area)=>{var _a;(_a=fishingAreaMenus.get(area))===null||_a===void 0?void 0:_a.updateButtons(area);});this.renderQueue.areaButtons=false;}
renderAreaUnlock(){if(!this.renderQueue.areaUnlock)
return;this.areas.forEach((area)=>{const menu=fishingAreaMenus.get(area);if(menu===undefined)
return;if((area.isSecret&&!this.secretAreaUnlocked)||(area.requiredItem!==undefined&&!this.game.combat.player.equipment.checkForItem(area.requiredItem))){hideElement(menu);}
else{showElement(menu);}});this.renderQueue.areaUnlock=false;}
renderActiveArea(){var _a;if(!this.renderQueue.activeArea)
return;if(this.isActive&&this.activeFishingArea!==undefined){(_a=fishingAreaMenus.get(this.activeFishingArea))===null||_a===void 0?void 0:_a.setActionActive();}
this.renderQueue.activeArea=false;}
encode(writer){super.encode(writer);writer.writeBoolean(this.secretAreaUnlocked);if(this.isActive){if(this.activeFishingArea===undefined)
throw new Error(`Error encoding Fishing. Skill is active, but no area is active.`);writer.writeNamespacedObject(this.activeFishingArea);}
writer.writeMap(this.selectedAreaFish,(key,writer)=>{writer.writeNamespacedObject(key);},(value,writer)=>{writer.writeNamespacedObject(value);});writer.writeSet(this.hiddenAreas,(value,writer)=>{writer.writeNamespacedObject(value);});return writer;}
resetActionState(){super.resetActionState();this.activeFishingArea=undefined;}
decode(reader,version){super.decode(reader,version);this.secretAreaUnlocked=reader.getBoolean();if(this.isActive){const area=reader.getNamespacedObject(this.areas);if(typeof area==='string')
this.shouldResetAction=true;else
this.activeFishingArea=area;}
this.selectedAreaFish=reader.getMap(readNamespacedReject(this.areas),readNamespacedReject(this.actions));this.hiddenAreas=reader.getSet(readNamespacedReject(this.areas));if(this.isActive&&this.activeFishingArea!==undefined&&this.selectedAreaFish.get(this.activeFishingArea)===undefined)
this.shouldResetAction=true;if(this.shouldResetAction)
this.resetActionState();}
deserialize(reader,version,idMap){super.deserialize(reader.getVariableLengthChunk(),version,idMap);const getArea=(id)=>{return this.areas.getObjectByID(idMap.fishingAreas[id]);};const getFish=(id)=>{return this.actions.getObjectByID(idMap.fishingFish[id]);};this.secretAreaUnlocked=reader.getBool();const activeAreaID=reader.getNumber();if(this.isActive){this.activeFishingArea=getArea(activeAreaID);if(this.activeFishingArea===undefined)
this.shouldResetAction=true;}
const numSetAreas=reader.getNumber();for(let i=0;i<numSetAreas;i++){const area=getArea(reader.getNumber());const fish=getFish(reader.getNumber());if(area!==undefined&&fish!==undefined)
this.selectedAreaFish.set(area,fish);}
if(version>=17){const numHiddenAreas=reader.getNumber();for(let i=0;i<numHiddenAreas;i++){const area=getArea(reader.getNumber());if(area!==undefined)
this.hiddenAreas.add(area);}}
if(this.isActive&&this.activeFishingArea!==undefined&&this.selectedAreaFish.get(this.activeFishingArea)===undefined)
this.shouldResetAction=true;if(this.shouldResetAction)
this.resetActionState();}
convertFromOldFormat(savegame){if(savegame.secretAreaUnlocked!==undefined)
this.secretAreaUnlocked=savegame.secretAreaUnlocked;}
getActionIDFromOldID(oldActionID,idMap){return idMap.fishingFish[oldActionID];}
setFromOldOffline(offline,idMap){const area=this.areas.getObjectByID(idMap.fishingAreas[offline.action[0]]);if(area!==undefined&&offline.action[1]<area.fish.length){this.onAreaFishSelection(area,area.fish[offline.action[1]]);this.onAreaStartButtonClick(area);}}
testTranslations(){super.testTranslations();this.areas.forEach((area)=>{area.name;area.description;});}}
class FishingAreaChances{constructor(){this.fish=100;this.special=0;this.junk=0;}
setChancesFromArea(area){this.fish=area.fishChance;this.special=area.specialChance;this.junk=area.junkChance;}
addBonusSpecialChance(amount){const junkToSpecialShift=clampValue(amount,-this.special,this.junk);this.junk-=junkToSpecialShift;this.special+=junkToSpecialShift;amount-=junkToSpecialShift;const fishToSpecialShift=clampValue(amount,-this.special,this.fish);this.fish-=fishToSpecialShift;this.special+=fishToSpecialShift;}
shiftFishToSpecial(amount){amount=clampValue(amount,-this.special,this.fish);this.fish-=amount;this.special+=amount;}
shiftJunkToFish(amount){amount=clampValue(amount,-this.fish,this.junk);this.junk-=amount;this.fish+=amount;}
rollForRewardType(){const roll=Math.random()*100;if(roll<this.fish)
return FishingRewardType.Fish;else if(roll<this.fish+this.junk)
return FishingRewardType.Junk;else
return FishingRewardType.Special;}}
var FishingRewardType;(function(FishingRewardType){FishingRewardType[FishingRewardType["Fish"]=0]="Fish";FishingRewardType[FishingRewardType["Junk"]=1]="Junk";FishingRewardType[FishingRewardType["Special"]=2]="Special";})(FishingRewardType||(FishingRewardType={}));class FishingRenderQueue extends GatheringSkillRenderQueue{constructor(){super(...arguments);this.selectedAreaFish=false;this.selectedAreaFishRates=false;this.areaChances=false;this.areaUnlock=false;this.areaButtons=false;this.activeArea=false;}}