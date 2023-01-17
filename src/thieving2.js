"use strict";class ThievingNPC extends BasicSkillRecipe{constructor(namespace,data,game){super(namespace,data);this._name=data.name;this._media=data.media;this.perception=data.perception;this.maxHit=data.maxHit;this.maxGP=data.maxGP;if(data.uniqueDrop!==undefined)
this.uniqueDrop=game.items.getQuantity(data.uniqueDrop);this.lootTable=new DropTable(game,data.lootTable);}
get name(){if(this.isModded){return this._name;}
else{return getLangString('THIEVING',`NPC_NAME_${this.localID}`);}}
get media(){return this.getMediaURL(this._media);}}
class ThievingArea extends NamespacedObject{constructor(namespace,data,game,thieving){super(namespace,data.id);this._name=data.name;this.npcs=data.npcIDs.map((npcID)=>{const npc=thieving.actions.getObjectByID(npcID);if(npc===undefined)
throw new Error(`Error constructing ThievingArea with id: ${this.id}. NPC with id: ${npcID} is not registered.`);return npc;});this.uniqueDrops=game.items.getQuantities(data.uniqueDrops);}
get name(){if(this.isModded){return this._name;}
else{return getLangString('THIEVING',`AREA_NAME_${this.localID}`);}}}
class ThievingRenderQueue extends GatheringSkillRenderQueue{constructor(){super(...arguments);this.menu=false;this.stopButton=false;this.npcUnlock=false;}}
class Thieving extends GatheringSkill{constructor(namespace,game){super(namespace,'Thieving',game);this.stunTimer=new Timer('Skill',()=>this.stunned());this._media='assets/media/skills/thieving/thieving.svg';this.baseInterval=3000;this.baseStunInterval=3000;this.itemChance=75;this.baseAreaUniqueChance=0.2;this.renderQueue=new ThievingRenderQueue();this.generalRareItems=[];this.barItems=[];this.hiddenAreas=new Set();this.stunState=0;this.areas=new NamespaceRegistry(game.registeredNamespaces);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
get areaUniqueChance(){let chance=this.baseAreaUniqueChance;chance+=this.game.modifiers.increasedThievingAreaUniqueChance;chance-=this.game.modifiers.decreasedThievingAreaUniqueChance;return chance;}
get masteryAction(){if(this.currentNPC===undefined)
throw new Error(`Error getting masteryAction. No NPC is selected.`);return this.currentNPC;}
get actionLevel(){if(this.currentNPC===undefined)
return 0;return this.currentNPC.level;}
get canStop(){let canStop=super.canStop;if(canStop&&this.isStunned){this.notifyStunBlockingAction();canStop=false;}
return canStop;}
get avoidStunChance(){let chance=0;chance+=this.game.modifiers.increasedChanceToAvoidThievingStuns;return chance;}
get stunInterval(){return this.getStunInterval();}
registerData(namespace,data){var _a,_b,_c;super.registerData(namespace,data);(_a=data.npcs)===null||_a===void 0?void 0:_a.forEach((npc)=>{this.actions.registerObject(new ThievingNPC(namespace,npc,this.game));});(_b=data.areas)===null||_b===void 0?void 0:_b.forEach((area)=>{this.areas.registerObject(new ThievingArea(namespace,area,this.game,this));});(_c=data.generalRareItems)===null||_c===void 0?void 0:_c.forEach((rareData)=>{const generalRare={item:this.getItemForRegistration(rareData.itemID),chance:rareData.chance,};if(rareData.npcs!==undefined)
generalRare.npcs=new Set(rareData.npcs.map((id)=>{const npc=this.actions.getObjectByID(id);if(npc===undefined)
throw new Error(`Error registering general rare item. NPC with id: ${id} is not registered.`);return npc;}));this.generalRareItems.push(generalRare);});if(data.entLeprechaunItem!==undefined)
this.entLeprechaunItem=this.getItemForRegistration(data.entLeprechaunItem);if(data.crowLeprechaunItem!==undefined)
this.crowLeprechaunItem=this.getItemForRegistration(data.crowLeprechaunItem);if(data.bearLeprechaunItem!==undefined)
this.bearLeprechaunItem=this.getItemForRegistration(data.bearLeprechaunItem);if(data.easterEgg!==undefined){const equipped=this.getItemForRegistration(data.easterEgg.equippedID);if(!(equipped instanceof EquipmentItem))
throw new Error(`Error registering easter egg. ${data.easterEgg.equippedID} is not equipment. Blame Coolrox.`);this.easterEgg={equipped,positioned:this.getItemForRegistration(data.easterEgg.positionedID),reward:this.getItemForRegistration(data.easterEgg.rewardID),};}}
postDataRegistration(){super.postDataRegistration();this.game.smithing.actions.forEach((recipe)=>{if(recipe.category.id==="melvorD:Bars"){this.barItems.push(recipe.product);}});this.areas.forEach((area)=>{this.sortedMasteryActions.push(...area.npcs);});this.milestones.push(...this.actions.allObjects);this.sortMilestones();}
activeTick(){this.stunTimer.tick();super.activeTick();}
getErrorLog(){var _a,_b;return `${super.getErrorLog}
  Selected Area: ${(_a=this.currentArea)===null||_a===void 0?void 0:_a.id}
  Selected NPC: ${(_b=this.currentNPC)===null||_b===void 0?void 0:_b.id}
  Stun State: ${this.stunState}`;}
render(){super.render();this.renderMenu();this.renderProgressBar();this.renderStopButton();this.renderNPCUnlock();}
renderNPCUnlock(){if(!this.renderQueue.npcUnlock)
return;thievingMenu.updateNPCsForLevel(this.level);this.renderQueue.npcUnlock=false;}
resetActionState(){super.resetActionState();this.stunTimer.stop();this.currentArea=undefined;this.currentNPC=undefined;this.stunState=0;}
encode(writer){super.encode(writer);this.stunTimer.encode(writer);if(this.isActive&&this.currentArea!==undefined&&this.currentNPC!==undefined){writer.writeNamespacedObject(this.currentArea);writer.writeNamespacedObject(this.currentNPC);}
writer.writeSet(this.hiddenAreas,writeNamespaced);writer.writeUint8(this.stunState);return writer;}
decode(reader,version){super.decode(reader,version);this.stunTimer.decode(reader,version);if(this.isActive){const area=reader.getNamespacedObject(this.areas);if(typeof area==='string')
this.shouldResetAction=true;else
this.currentArea=area;const npc=reader.getNamespacedObject(this.actions);if(typeof npc==='string')
this.shouldResetAction=true;else
this.currentNPC=npc;}
this.hiddenAreas=reader.getSet(readNamespacedReject(this.areas));this.stunState=reader.getUint8();if(this.shouldResetAction)
this.resetActionState();}
deserialize(reader,version,idMap){super.deserialize(reader.getVariableLengthChunk(),version,idMap);this.stunTimer.deserialize(reader.getChunk(3),version);const currentAreaID=reader.getNumber();const currentNPCID=reader.getNumber();const getArea=(id)=>{return this.areas.getObjectByID(idMap.thievingAreas[id]);};const getNPC=(id)=>{return this.actions.getObjectByID(idMap.thievingNPCs[id]);};if(this.isActive){this.currentArea=getArea(currentAreaID);this.currentNPC=getNPC(currentNPCID);if(this.currentArea===undefined||this.currentNPC===undefined)
this.shouldResetAction=true;}
if(version>=17){const numHiddenAreas=reader.getNumber();for(let i=0;i<numHiddenAreas;i++){const area=getArea(reader.getNumber());if(area!==undefined)
this.hiddenAreas.add(area);}}
if(this.shouldResetAction)
this.resetActionState();}
getActionIDFromOldID(oldActionID,idMap){return idMap.thievingNPCs[oldActionID];}
onModifierChange(){super.onModifierChange();this.renderQueue.menu=true;}
onEquipmentChange(){}
onLevelUp(oldLevel,newLevel){super.onLevelUp(oldLevel,newLevel);this.renderQueue.npcUnlock=true;}
onLoad(){super.onLoad();this.renderQueue.menu=true;this.renderQueue.npcUnlock=true;if(this.isActive&&this.currentNPC!==undefined&&this.currentArea!==undefined){thievingMenu.selectNPC(this.currentNPC,this.currentArea);this.renderQueue.progressBar=true;this.renderQueue.stopButton=true;}
this.actions.forEach((npc)=>{this.renderQueue.actionMastery.add(npc);});this.renderVisibleAreas();this.render();}
onStop(){this.renderQueue.stopButton=true;}
stopOnDeath(){this.stunState=0;this.stunTimer.stop();this.stop();}
notifyStunBlockingAction(){this.game.combat.notifications.add({type:'Player',args:[this,getLangString('TOASTS','CANNOT_WHILE_STUNNED'),'danger'],});}
renderMenu(){if(this.renderQueue.menu){thievingMenu.updateAllAreaPanels();thievingMenu.updateNPCButtons();}
this.renderQueue.menu=false;}
renderStopButton(){if(this.renderQueue.stopButton){if(this.isActive&&this.currentArea!==undefined)
thievingMenu.setStopButton(this.currentArea);else
thievingMenu.removeStopButton();}
this.renderQueue.stopButton=false;}
renderProgressBar(){var _a;if(!this.renderQueue.progressBar)
return;if(this.lastActiveAreaProgressBar!==undefined){(_a=thievingMenu.getProgressBar(this.lastActiveAreaProgressBar))===null||_a===void 0?void 0:_a.stopAnimation();this.lastActiveAreaProgressBar=undefined;}
if(this.currentArea===undefined)
return;const progressBar=thievingMenu.getProgressBar(this.currentArea);if(progressBar!==undefined){if(this.isActive){if(this.stunState===1){progressBar.setStyle('bg-danger');progressBar.animateProgressFromTimer(this.stunTimer);}
else{progressBar.setStyle('bg-info');progressBar.animateProgressFromTimer(this.actionTimer);}
this.lastActiveAreaProgressBar=this.currentArea;}
else{progressBar.stopAnimation();this.lastActiveAreaProgressBar=undefined;}}
this.renderQueue.progressBar=false;}
renderVisibleAreas(){this.areas.forEach((area)=>{if(this.hiddenAreas.has(area)){thievingMenu.hideAreaPanel(area);}
else{thievingMenu.showAreaPanel(area);}});}
onAreaHeaderClick(area){if(this.hiddenAreas.has(area)){this.hiddenAreas.delete(area);thievingMenu.showAreaPanel(area);}
else{this.hiddenAreas.add(area);thievingMenu.hideAreaPanel(area);}}
onNPCPanelSelection(npc,area){if(this.isActive&&area===this.currentArea&&npc!==this.currentNPC){return this.stop();}
else{return true;}}
startThieving(area,npc){if(this.isActive&&!this.stop())
return;this.currentArea=area;this.currentNPC=npc;if(this.level>=this.currentNPC.level){this.start();this.renderQueue.stopButton=true;}}
getStunInterval(){let interval=this.baseStunInterval;let modifier=0;modifier-=this.game.modifiers.decreasedThievingStunIntervalPercent;modifier+=this.game.modifiers.increasedThievingStunIntervalPercent;interval*=1+modifier/100;interval=roundToTickInterval(interval);return Math.max(interval,250);}
getNPCSuccessRate(npc){return Math.min(100,(100*(100+this.getStealthAgainstNPC(npc)))/(100+npc.perception));}
getNPCSleightOfHand(npc){return(100*this.getStealthAgainstNPC(npc))/4/npc.perception;}
getNPCPickpocket(npc){return(100+this.getStealthAgainstNPC(npc))/100/npc.perception;}
getStealthAgainstNPC(npc){const mastery=this.getMasteryLevel(npc);let stealth=this.level+mastery;if(mastery>=99)
stealth+=75;if(this.isPoolTierActive(0))
stealth+=30;if(this.isPoolTierActive(3))
stealth+=100;stealth+=this.game.modifiers.increasedThievingStealth;stealth-=this.game.modifiers.decreasedThievingStealth;return stealth;}
getFlatIntervalModifier(action){let modifier=super.getFlatIntervalModifier(action);if(this.getMasteryLevel(action)>=50)
modifier-=200;if(this.isPoolTierActive(1))
modifier-=200;return modifier;}
getPercentageIntervalModifier(action){let modifier=super.getPercentageIntervalModifier(action);if(action.id==="melvorF:FISHERMAN")
modifier+=this.game.modifiers.summoningSynergy_Octopus_Leprechaun;return modifier;}
getNPCInterval(npc){return this.modifyInterval(this.baseInterval,npc);}
getNPCDoublingChance(npc){return Math.min(100,this.getNPCSleightOfHand(npc)+this.getDoublingChance(npc));}
getNPCGPRange(npc){let minGP=this.getNPCMinGPRoll(npc);let maxGP=npc.maxGP;const gpFlat=this.game.modifiers.increasedGPFromThievingFlat-this.game.modifiers.decreasedGPFromThievingFlat;const gpModifier=this.getNPCGPMultiplier(npc);const modGp=(gp)=>{gp+=gpFlat;gp*=1+gpModifier/100;gp=Math.floor(gp);return gp;};minGP=modGp(minGP);maxGP=modGp(maxGP);return{minGP,maxGP,};}
getNPCMinGPRoll(npc){return Math.max(1,Math.floor((npc.maxGP*(this.game.modifiers.increasedMinThievingGP-this.game.modifiers.decreasedMinThievingGP))/100));}
getNPCGPMultiplier(npc){let increasedGPModifier=this.game.modifiers.increasedGPGlobal-this.game.modifiers.decreasedGPGlobal;increasedGPModifier+=this.game.modifiers.increasedGPFromThieving-this.game.modifiers.decreasedGPFromThieving;increasedGPModifier+=1+this.getMasteryLevel(npc);if(this.isPoolTierActive(2))
increasedGPModifier+=100;return increasedGPModifier;}
getXPModifier(masteryAction){let modifier=super.getXPModifier(masteryAction);if(this.isPoolTierActive(0))
modifier+=3;return modifier;}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(1))
modifier+=3;return modifier;}
stunned(){this.stunState=0;this.addStat(ThievingStats.TimeSpentStunned,this.stunTimer.maxTicks*TICK_INTERVAL);if(this.game.settings.continueThievingOnStun)
this.startActionTimer();else
this.stop();}
get isStunned(){return this.stunState!==0;}
get actionRewards(){const currentNPC=this.currentNPC;if(currentNPC===undefined)
throw new Error('Tried to get actionRewards, but no NPC is selected.');if(this.currentArea===undefined)
throw new Error('Tried to get actionRewards, but no Area is selected.');const actionEvent=new ThievingActionEvent(this,currentNPC,this.currentArea);const rewards=new Rewards(this.game);if(this.stunState===0){let giveItems=true;let giveGP=true;let quantityMultiplier=1;let gpMultiplier=1;let baseQuantityBonus=0;let skillXPModifier=0;if(rollPercentage(this.getNPCDoublingChance(currentNPC)))
quantityMultiplier*=2;quantityMultiplier*=Math.pow(2,this.game.modifiers.getSkillModifierValue('doubleItemsSkill',this));if(this.game.modifiers.summoningSynergy_Leprechaun_Devil>0){const{itemID}=this.game.getItemFromLootTable(Thieving.DevilTable);switch(itemID){case 0:gpMultiplier*=2;break;case 1:quantityMultiplier*=4;break;case 2:giveItems=false;giveGP=false;break;}}
if(this.game.modifiers.summoningSynergy_Ent_Leprechaun>0&&currentNPC.id==="melvorF:LUMBERJACK"&&this.entLeprechaunItem!==undefined){giveGP=false;rewards.addItem(this.entLeprechaunItem,this.game.modifiers.summoningSynergy_Ent_Leprechaun);this.game.stats.Thieving.add(ThievingStats.CommonDrops,this.game.modifiers.summoningSynergy_Ent_Leprechaun);}
if(currentNPC.id==="melvorF:MINER"){if(this.game.modifiers.summoningSynergy_Mole_Leprechaun>0&&rollPercentage(this.game.modifiers.summoningSynergy_Mole_Leprechaun))
rewards.addItem(this.game.randomGemTable.getDrop().item,1);this.game.stats.Thieving.inc(ThievingStats.CommonDrops);if(this.game.modifiers.increasedRuneEssenceThievingMiner>0&&this.crowLeprechaunItem!==undefined)
rewards.addItem(this.crowLeprechaunItem,this.game.modifiers.increasedRuneEssenceThievingMiner);this.game.stats.Thieving.add(ThievingStats.CommonDrops,this.game.modifiers.increasedRuneEssenceThievingMiner);}
if(this.game.modifiers.summoningSynergy_Octopus_Leprechaun>0&&currentNPC.id==="melvorF:FISHERMAN"){baseQuantityBonus+=2;}
if(giveItems){if(currentNPC.lootTable.size>0&&rollPercentage(this.itemChance)){actionEvent.commonDropObtained=true;const{item,quantity}=currentNPC.lootTable.getDrop();if(this.game.modifiers.increasedThievingAutoSellPrice>0){const gpToAdd=item.sellsFor*this.game.modifiers.increasedThievingAutoSellPrice;rewards.addGP(gpToAdd);this.game.stats.Thieving.add(ThievingStats.GPStolen,gpToAdd);}
else{const qtyToAdd=(quantity+baseQuantityBonus)*quantityMultiplier;rewards.addItem(item,qtyToAdd);this.game.stats.Thieving.add(ThievingStats.CommonDrops,qtyToAdd);}
if(currentNPC.id==="melvorF:MINER"&&this.game.modifiers.increasedRandomBarChanceThievingMiner>0&&rollPercentage(this.game.modifiers.increasedRandomBarChanceThievingMiner)){rewards.addItem(getRandomArrayElement(this.barItems),1);this.game.stats.Thieving.inc(ThievingStats.CommonDrops);}
if(currentNPC.id==="melvorF:BOB_THE_FARMER"&&this.bearLeprechaunItem!==undefined&&this.game.modifiers.increasedHerbSackChanceThievingFarmer>0&&rollPercentage(this.game.modifiers.increasedHerbSackChanceThievingFarmer)){rewards.addItem(this.bearLeprechaunItem,1);this.game.stats.Thieving.inc(ThievingStats.CommonDrops);}}
const rareItemQty=(1+baseQuantityBonus)*quantityMultiplier;this.generalRareItems.forEach((rareItem)=>{if((rareItem.npcs===undefined||rareItem.npcs.has(currentNPC))&&rollPercentage(rareItem.chance)){rewards.addItem(rareItem.item,rareItemQty);this.game.stats.Thieving.add(ThievingStats.RareDrops,rareItemQty);}});this.currentArea.uniqueDrops.forEach((drop)=>{const chanceMult=this.isPoolTierActive(3)?3:1;if(rollPercentage(this.areaUniqueChance*chanceMult)){const qty=(drop.quantity+baseQuantityBonus)*quantityMultiplier;rewards.addItem(drop.item,qty);this.game.stats.Thieving.add(ThievingStats.AreaDrops,qty);this.addJesterHatGP(drop.item,rewards);}});if(currentNPC.uniqueDrop!==undefined&&rollPercentage(this.getNPCPickpocket(currentNPC))){const qty=(currentNPC.uniqueDrop.quantity+baseQuantityBonus)*quantityMultiplier;rewards.addItem(currentNPC.uniqueDrop.item,qty);this.game.stats.Thieving.add(ThievingStats.NpcDrops,qty);this.addJesterHatGP(currentNPC.uniqueDrop.item,rewards);}}
if(this.easterEgg!==undefined&&currentNPC.id==="melvorF:LUMBERJACK"&&this.masteryLevel>=99&&this.masteryPoolProgress>=100&&this.game.combat.player.equipment.checkForItem(this.easterEgg.equipped)&&this.game.bank.isItemInPosition(this.easterEgg.positioned,0,0)&&rollPercentage(0.01))
rewards.addItem(this.easterEgg.reward,1);if(giveGP){const minRoll=this.getNPCMinGPRoll(currentNPC);let gpToAdd=rollInteger(minRoll,currentNPC.maxGP);gpToAdd+=this.game.modifiers.increasedGPFromThievingFlat-this.game.modifiers.decreasedGPFromThievingFlat;const increasedGPModifier=this.getNPCGPMultiplier(currentNPC);gpMultiplier*=1+increasedGPModifier/100;gpToAdd=Math.floor(gpMultiplier*gpToAdd);rewards.addGP(gpToAdd);this.game.stats.Thieving.add(ThievingStats.GPStolen,gpToAdd);}
const baseXP=currentNPC.baseExperience*(1+skillXPModifier/100);rewards.addXP(this,baseXP);this.addCommonRewards(rewards);}
else if(this.stunState===1){actionEvent.successful=false;let damageDealt=rollInteger(1,Math.floor(currentNPC.maxHit*numberMultiplier));damageDealt*=1-this.game.combat.player.stats.damageReduction/100;damageDealt=Math.floor(damageDealt);if(currentNPC.id==="melvorF:CHEF"&&this.game.modifiers.thievingChefNoDamage>0){damageDealt=0;}
this.addStat(ThievingStats.DamageTakenFromNPCs,damageDealt);this.game.combat.player.damage(damageDealt,'Attack',true);this.game.combat.notifications.add({type:'Stun',args:[damageDealt],});}
else{this.stunState=0;}
this.game.processEvent(actionEvent,this.currentActionInterval);return rewards;}
addJesterHatGP(item,rewards){if(this.game.combat.player.equipment.checkForItemID("melvorF:Jesters_Hat")){const percent=rollInteger(50,300);const gpToAdd=Math.floor((item.sellsFor*percent)/100);rewards.addGP(gpToAdd);this.game.stats.Thieving.add(ThievingStats.GPStolen,gpToAdd);}}
get actionInterval(){if(this.currentNPC===undefined)
return 0;return this.getNPCInterval(this.currentNPC);}
get masteryModifiedInterval(){return this.actionInterval;}
startActionTimer(){if(!(this.stunState===1)){super.startActionTimer();}}
preAction(){if(this.currentNPC===undefined)
throw new Error('Error during Thieving pre-action stage. No NPC is selected.');if(!rollPercentage(this.getNPCSuccessRate(this.currentNPC))){if(!rollPercentage(this.avoidStunChance)){this.stunState=1;}
else
this.stunState=2;this.addStat(ThievingStats.FailedPickpockets);}
else{this.addStat(ThievingStats.SuccessfulPickpockets);}}
postAction(){this.addStat(ThievingStats.TimeSpent,this.currentActionInterval);if(this.stunState===1){this.stunTimer.start(this.stunInterval);this.renderQueue.progressBar=true;}
this.renderQueue.menu=true;}
addStat(stat,amount=1){this.game.stats.Thieving.add(stat,amount);}
testTranslations(){super.testTranslations();this.actions.forEach((action)=>{action.name;});this.areas.forEach((area)=>{area.name;});}}
Thieving.DevilTable=[[0,50,1],[1,35,1],[2,15,1],];Thieving.OtherDevilTable=[[0,50,1],[1,40,1],[2,10,1],];