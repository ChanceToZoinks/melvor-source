"use strict";class SkillRenderQueue{constructor(){this.xp=false;this.level=false;this.xpCap=false;this.previousLevel=1;this.lock=false;}}
class Skill extends NamespacedObject{constructor(namespace,id,game){super(namespace,id);this.game=game;this.pets=[];this.rareDrops=[];this.minibarOptions={defaultItems:new Set(),upgrades:[],pets:[],};this.milestones=[];this._level=1;this._xp=0;this._unlocked=false;if(this.startingLevel>1)
this._xp=exp.level_to_xp(this.startingLevel)+1;this._level=this.startingLevel;this.milestones.push(new SkillMasteryMilestone(this));}
get level(){return this._level;}
get xp(){return this._xp;}
get nextLevelProgress(){let percent=100;if(this.level<this.levelCap){const currentLevelXP=exp.level_to_xp(this.level);const nextLevelXP=exp.level_to_xp(this.level+1);percent=(100*(this.xp-currentLevelXP))/(nextLevelXP-currentLevelXP);}
return percent;}
get name(){return getLangString('SKILL_NAME',this.localID);}
get media(){return this.getMediaURL(this._media);}
get hasMastery(){return false;}
get isCombat(){return false;}
get hasMinibar(){return true;}
sortMilestones(){this.milestones.sort((a,b)=>a.level-b.level);}
get virtualLevel(){return exp.xpToLevel(this._xp);}
get levelCap(){return cloudManager.hasTotHEntitlement?120:99;}
get startingLevel(){return 1;}
get tutorialLevelCap(){return 3;}
get isUnlocked(){return this._unlocked;}
getItemForRegistration(id){const item=this.game.items.getObjectByID(id);if(item===undefined)
throw new Error(`Error registering data for skill: ${this.id}. Item with id: ${id} is not registered.`);return item;}
onLoad(){this.renderQueue.level=true;this.renderQueue.xp=true;this.renderQueue.xpCap=true;this.renderQueue.previousLevel=this.level;this.renderQueue.lock=true;}
render(){this.renderXP();this.renderLockStatus();this.renderLevel();this.renderXPCap();}
renderXP(){if(!this.renderQueue.xp)
return;skillProgressDisplay.updateXP(this);this.renderQueue.xp=false;}
renderLevel(){if(!this.renderQueue.level)
return;if(this.renderQueue.previousLevel<this.level){if(!this.game.settings.useSmallLevelUpNotifications||this.level===99){this.fireLevelUpModal(this.renderQueue.previousLevel);if(this.level===99)
showFireworks();}
else{this.game.combat.notifications.add({type:'LevelUp',args:[this],});}
this.renderQueue.previousLevel=this.level;}
skillNav.updateSkillLevel(this);skillProgressDisplay.updateLevel(this);this.renderQueue.level=false;}
renderLockStatus(){if(!this.renderQueue.lock)
return;skillNav.updateSkillLock(this);this.renderQueue.lock=false;}
fireLevelUpModal(previousLevel){addModalToQueue({title:getLangString('COMPLETION','CONGRATS'),html:`<span class="text-dark">${templateLangString('TOASTS','SKILL_LEVEL_UP',{skillName:this.name,level:`${numberWithCommas(this.level)}`,})}${this.getNewMilestoneHTML(previousLevel)}</span>`,imageUrl:this.media,imageWidth:64,imageHeight:64,imageAlt:this.name,});}
getNewMilestoneHTML(previousLevel){let html=`<div class="h5 font-w400 font-size-sm pt-3 mb-1 text-success">${getLangString('COMPLETION','SKILL_LEVEL_MILESTONES')}</div>`;this.milestones.forEach((milestone)=>{if(previousLevel<milestone.level&&this.level>=milestone.level){html+=`<div class="h5 font-w600 mb-0"><img class="skill-icon-xs mr-2" src="${milestone.media}">${milestone.name}</div>`;}});if(this.level>=99&&previousLevel<99){const skillCape=this.game.shop.purchases.find((purchase)=>{return(purchase.category.id==="melvorD:Skillcapes"&&purchase.purchaseRequirements.length===1&&purchase.purchaseRequirements[0].type==='SkillLevel'&&purchase.purchaseRequirements[0].skill===this);});if(skillCape!==undefined)
html+=`<div class="h5 font-w400 font-size-sm text-success pt-3">${templateLangString('COMPLETION','SKILL_LEVEL_99_NOTICE',{itemName:`<strong>${skillCape.contains.items[0].item.name}</strong>`})}`;}
if(this.level>=120&&previousLevel<120){const superiorSkillCape=this.game.shop.purchases.find((purchase)=>{return(purchase.category.id==="melvorTotH:SuperiorSkillcapes"&&purchase.purchaseRequirements.length===1&&purchase.purchaseRequirements[0].type==='SkillLevel'&&purchase.purchaseRequirements[0].skill===this);});if(superiorSkillCape!==undefined)
html+=`<div class="h5 font-w400 font-size-sm text-success pt-3">${templateLangString('COMPLETION','SKILL_LEVEL_99_NOTICE',{itemName:`<strong>${superiorSkillCape.contains.items[0].item.name}</strong>`})}`;}
return html;}
renderXPCap(){if(!this.renderQueue.xpCap)
return;if(this.game.currentGamemode.capNonCombatSkillLevels&&!this.isCombat){const xpNotice=document.getElementById(`adventure-mode-xp-limit-notice-${this.id}`);if(xpNotice!==null){const combatLevel=this.game.playerCombatLevel;const xpCap=exp.level_to_xp(combatLevel+1)-1;if(this._xp<xpCap){hideElement(xpNotice);}
else{showElement(xpNotice);}}}
this.renderQueue.xpCap=false;}
addXP(amount,masteryAction){if(!this._unlocked)
return false;amount=this.modifyXP(amount,masteryAction);this._xp+=amount;this.capXPForTutorial();this.capXPForGamemode();const levelIncreased=this._xp>exp.level_to_xp(this.level+1)&&this.level<this.levelCap;if(levelIncreased){this.levelUp();}
this.renderQueue.xp=true;return levelIncreased;}
capXPForTutorial(){if(this.game.tutorial.complete)
return;const xpCap=exp.level_to_xp(this.tutorialLevelCap+1)-1;if(this._xp>xpCap){this._xp=xpCap;this.game.combat.notifications.add({type:'Player',args:[this,getLangString('MISC_STRING',this.tutorialLevelCap===3?'TUTORIAL_0':'TUTORIAL_1'),'danger'],});}}
capXPForGamemode(){if(!this.game.currentGamemode.capNonCombatSkillLevels||this.isCombat)
return;const combatLevel=this.game.playerCombatLevel;const xpCap=exp.level_to_xp(combatLevel+1)-1;if(this._xp>xpCap){this._xp=xpCap;this.renderQueue.xpCap=true;}}
levelUp(){const oldLevel=this._level;this._level=Math.min(this.levelCap,exp.xpToLevel(this._xp));const newLevel=this._level;this.onLevelUp(oldLevel,newLevel);}
modifyXP(amount,masteryAction){amount*=1+this.getXPModifier(masteryAction)/100;return amount;}
getXPModifier(masteryAction){let modifier=this.game.modifiers.increasedGlobalSkillXP-this.game.modifiers.decreasedGlobalSkillXP;if(!this.isCombat)
modifier+=this.game.modifiers.increasedNonCombatSkillXP-this.game.modifiers.decreasedNonCombatSkillXP;modifier+=this.game.modifiers.getSkillModifierValue('increasedSkillXP',this);modifier-=this.game.modifiers.getSkillModifierValue('decreasedSkillXP',this);return modifier;}
getUncappedDoublingChance(action){let chance=this.game.modifiers.increasedChanceToDoubleItemsGlobal-this.game.modifiers.decreasedChanceToDoubleItemsGlobal;chance+=this.game.modifiers.getSkillModifierValue('increasedChanceToDoubleItemsSkill',this)-
this.game.modifiers.getSkillModifierValue('decreasedChanceToDoubleItemsSkill',this);return chance;}
getDoublingChance(action){return clampValue(this.getUncappedDoublingChance(action),0,100);}
getGPModifier(action){return this.game.modifiers.increasedGPGlobal-this.game.modifiers.decreasedGPGlobal;}
setXP(value){this._xp=value;const oldLevel=this._level;this._level=Math.min(this.levelCap,exp.xpToLevel(this._xp));this.renderQueue.xp=true;this.onLevelUp(oldLevel,this._level);}
setUnlock(isUnlocked){this._unlocked=isUnlocked;this.renderQueue.lock=true;}
unlockOnClick(){if(this._unlocked)
return;const cost=this.game.getSkillUnlockCost();if(!this.game.gp.canAfford(cost))
return;this.game.gp.remove(cost);this.setUnlock(true);SwalLocale.fire({icon:'success',title:getLangString('MENU_TEXT','SKILL_UNLOCKED'),html:`<span class='text-dark'>${getLangString('MENU_TEXT','YOU_MAY_USE_SKILL')}</span>`,});sendPlayFabEvent('adv_skill_unlocked',{skillID:this.id,unlockOrder:this.game.getSkillUnlockCount()});}
rollForPets(interval){this.pets.forEach((pet)=>{this.game.petManager.rollForSkillPet(pet,interval,this);});}
onLevelUp(oldLevel,newLevel){this.game.completion.updateSkill(this);this.renderQueue.level=true;if(this.isCombat){this.game.skills.forEach((skill)=>{if(!skill.isCombat)
skill.renderQueue.xpCap=true;});this.game.combat.player.rendersRequired.combatLevel=true;}
if(this.game.skills.every((skill)=>skill.level>=99))
sendDiscordEvent(1);this.game.queueRequirementRenders();this.game.stats.General.wasMutated=true;}
rollForRareDrops(level,rewards){this.rareDrops.forEach((drop)=>{if(this.game.checkRequirements(drop.requirements)&&rollForOffItem(this.getRareDropChance(level,drop.chance))){if(drop.altItem!==undefined&&this.game.modifiers.allowSignetDrops){rewards.addItem(drop.altItem,drop.quantity);}
else{rewards.addItem(drop.item,drop.quantity);}}});}
getRareDropChance(level,chance){switch(chance.type){case 'Fixed':return chance.chance;case 'LevelScaling':return cappedLinearFunction(chance.scalingFactor,chance.baseChance,chance.maxChance,level);case 'TotalMasteryScaling':return cappedLinearFunction(chance.scalingFactor,chance.baseChance,chance.maxChance,this.game.completion.masteryProgress.currentCount.getSum());}}
openMilestoneModal(){const milestoneHtml=`
    <div class="block block-rounded block-link-pop border-top border-${this.localID} border-4x">
      <div class="block-header">
        <h3 class="block-title">${this.name}</h3>
        <div class="block-options">
          <button type="button" class="btn-block-option" data-dismiss="modal" aria-label="Close">
            <i class="fa fa-fw fa-times"></i>
          </button>
        </div>
      </div>
      <div class="row"><div class="col-12"><div class="block-content">
        <table class="table table-sm table-vcenter">
          <thead><tr>
              <th class="text-center" style="width: 65px;">${getLangString('MENU_TEXT','LEVEL_HEADER')}</th>
              <th>${getLangString('MENU_TEXT','UNLOCKS')}</th>
          </tr></thead>
          <tbody>
          ${this.milestones.map((milestone)=>{return `
            <tr>
              <th class="text-center${this.level>=milestone.level?' bg-success text-gray-lighter':''}" scope="row">${milestone.level}</th>
              <td class="font-w600 font-size-sm"><img class="milestone-icon" src="${milestone.media}">${milestone.name}</td>
            </tr>`;}).join('')}
          </tbody>
        </table>
      </div></div></div>
    </div>`;$('#modal-content-m').html(milestoneHtml);$('#modal-milestone').modal('show');}
encode(writer){writer.writeFloat64(this._xp);writer.writeBoolean(this._unlocked);return writer;}
decode(reader,version){this._xp=reader.getFloat64();this._unlocked=reader.getBoolean();this._level=Math.min(this.levelCap,exp.xpToLevel(this._xp));}
convertOldXP(xp){this._xp=xp;this._level=Math.min(this.levelCap,exp.xpToLevel(this._xp));}
registerData(namespace,data){var _a;if(data.pets!==undefined)
data.pets.forEach((petID)=>{const pet=this.game.pets.getObjectByID(petID);if(pet===undefined)
throw new Error(`Error registering data for ${this.id}. Pet with id: ${petID} is not registered.`);this.pets.push(pet);});if(data.rareDrops!==undefined)
data.rareDrops.forEach((rareDropData)=>{const item=this.game.items.getObjectByID(rareDropData.itemID);if(item===undefined)
throw new Error(`Error registering data for ${this.id}. Rare drop item with id: ${rareDropData.itemID} is not registered.`);const rareDrop={item,quantity:rareDropData.quantity,chance:rareDropData.chance,requirements:rareDropData.requirements.map((data)=>this.game.getRequirementFromData(data)),};if(rareDropData.altItemID!==undefined){const altItem=this.game.items.getObjectByID(rareDropData.altItemID);if(altItem===undefined)
throw new Error(`Error registering data for ${this.id}. Alt. Rare drop item with id: ${rareDropData.itemID} is not registered.`);rareDrop.altItem=altItem;}
this.rareDrops.push(rareDrop);});if(data.minibar!==undefined){data.minibar.defaultItems.forEach((itemID)=>{const item=this.game.items.equipment.getObjectByID(itemID);if(item===undefined)
throw new Error(`Error registering data for ${this.id}. Minibar item with id: ${itemID} is not registered.`);this.minibarOptions.defaultItems.add(item);});this.minibarOptions.pets.push(...data.minibar.pets.map((petID)=>{const pet=this.game.pets.getObjectByID(petID);if(pet===undefined)
throw new Error(`Error registering data for ${this.id}. Pet with id: ${petID} is not registered.`);return pet;}));this.minibarOptions.upgrades.push(...data.minibar.upgrades.map((upgradeID)=>{const upgrade=this.game.shop.purchases.getObjectByID(upgradeID);if(upgrade===undefined)
throw new Error(`Error registering data for ${this.id}. ShopPurchase with id: ${upgradeID} is not registered.`);return upgrade;}));}
(_a=data.customMilestones)===null||_a===void 0?void 0:_a.forEach((milestoneData)=>{switch(milestoneData.type){case 'Custom':this.milestones.push(new CustomSkillMilestone(milestoneData));break;case 'EquipItem':this.milestones.push(new EquipItemMilestone(milestoneData,this.game,this));break;}});}
postDataRegistration(){this.milestones.forEach((milestone)=>{if(milestone instanceof EquipItemMilestone)
milestone.setLevel(this);});}
testTranslations(){this.name;this.milestones.forEach((milestone)=>{milestone.name;});}}
class MasteryLevelUnlock{constructor(data,skill){this.skill=skill;this._descriptionID=data.descriptionID;this._description=data.description;this.level=data.level;}
get description(){if(this._descriptionID!==undefined)
return getLangString('MASTERY_BONUS',`${this.skill.localID}_${this._descriptionID}`);return this._description;}}
class MasterySkillRenderQueue extends SkillRenderQueue{constructor(){super(...arguments);this.actionMastery=new Set();this.masteryPool=false;}}
class SkillWithMastery extends Skill{constructor(namespace,id,game){super(namespace,id,game);this.actions=new NamespaceRegistry(this.game.registeredNamespaces);this.actionMastery=new Map();this._masteryPoolXP=0;this.sortedMasteryActions=[];this.masteryLevelUnlocks=[];this.totalMasteryActions=new CompletionMap();this._totalCurrentMasteryLevel=new CompletionMap();this.totalUnlockedMasteryActions=0;}
get hasMastery(){return true;}
get masteryLevelCap(){return 99;}
get masteryPoolCapPercent(){return 100+this.game.modifiers.increasedMasteryPoolCap;}
get baseMasteryPoolCap(){return this.trueTotalMasteryActions*500000;}
get masteryPoolCap(){return Math.floor((this.trueTotalMasteryActions*500000*this.masteryPoolCapPercent)/100);}
get masteryPoolXP(){return this._masteryPoolXP;}
get masteryTokenChance(){let chance=this.totalUnlockedMasteryActions/185;chance*=1+this.game.modifiers.increasedOffItemChance/100;return chance;}
onLoad(){super.onLoad();this.renderQueue.masteryPool=true;this.updateTotalCurrentMasteryLevel();this.totalUnlockedMasteryActions=this.getTotalUnlockedMasteryActions();}
onPageChange(){this.renderModifierChange();this.render();}
renderModifierChange(){this.onModifierChange();}
onModifierChange(){this.renderQueue.masteryPool=true;}
render(){super.render();this.renderActionMastery();this.renderMasteryPool();}
renderActionMastery(){if(this.renderQueue.actionMastery.size===0)
return;this.renderQueue.actionMastery.forEach((action)=>{this.updateMasteryDisplays(action);if(spendMasteryMenu.curentSkill===this)
spendMasteryMenu.updateAction(this,action);});this.renderQueue.actionMastery.clear();}
renderMasteryPool(){if(!this.renderQueue.masteryPool)
return;const poolDisplays=document.querySelectorAll(`mastery-pool-display[data-skill-id="${this.id}"]`);poolDisplays.forEach((icon)=>icon.updateProgress(this));if(spendMasteryMenu.curentSkill===this)
spendMasteryMenu.updateAllActions();this.renderQueue.masteryPool=false;}
levelUpMasteryWithPoolXP(action,levels){const currentLevel=this.getMasteryLevel(action);const currentXP=this.getMasteryXP(action);const nextLevel=Math.min(99,currentLevel+levels);const nextXP=exp.level_to_xp(nextLevel)+1;const xpToAdd=nextXP-currentXP;if(this.masteryPoolXP<xpToAdd)
return;const poolLevelChange=this.getPoolBonusChange(-xpToAdd);if(poolLevelChange<0&&this.game.settings.showMasteryCheckpointconfirmations){SwalLocale.fire({title:getLangString('MENU_TEXT','HOLD_UP'),html:`<h5 class="font-w600 text-combat-smoke mb-1">${getLangString('MENU_TEXT','HOLD_UP_0')}</h5><h5 class="font-w300 font-size-sm text-combat-smoke mb-1">${getLangString('MENU_TEXT','HOLD_UP_1')}</h5><h5 class="font-w300 font-size-sm text-danger mb-1"><small>${getLangString('MENU_TEXT','HOLD_UP_2')}</small></h5>`,imageUrl:cdnMedia("assets/media/main/mastery_header.svg"),imageWidth:64,imageHeight:64,imageAlt:getLangString('MENU_TEXT','MASTERY'),showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),}).then((result)=>{if(result.value){this.exchangePoolXPForActionXP(action,xpToAdd);}});}
else{this.exchangePoolXPForActionXP(action,xpToAdd);}}
exchangePoolXPForActionXP(action,xpToAdd){this.addMasteryXP(action,xpToAdd);this.addMasteryPoolXP(-xpToAdd);}
addMasteryForAction(action,interval){const xpToAdd=this.getMasteryXPToAddForAction(action,interval);this.addMasteryXP(action,xpToAdd);const poolXPToAdd=this.getMasteryXPToAddToPool(xpToAdd);this.addMasteryPoolXP(poolXPToAdd);}
addMasteryXP(action,xp){let mastery=this.actionMastery.get(action);if(mastery===undefined){mastery={xp:0,level:1,};this.actionMastery.set(action,mastery);}
mastery.xp+=xp;const levelIncreased=mastery.xp>exp.level_to_xp(mastery.level+1)&&mastery.level<this.masteryLevelCap;if(levelIncreased){const oldLevel=mastery.level;mastery.level=Math.min(this.masteryLevelCap,exp.xpToLevel(mastery.xp));this.onMasteryLevelUp(action,oldLevel,mastery.level);}
if(this.toStrang&&mastery.xp>exp.level_to_xp(120))
this.game.petManager.unlockPet(this.toStrang);this.renderQueue.actionMastery.add(action);return levelIncreased;}
onMasteryLevelUp(action,oldLevel,newLevel){this.updateTotalCurrentMasteryLevel();this.game.completion.updateSkillMastery(this);if(newLevel>=99){this.game.combat.notifications.add({type:'Mastery99',args:[action],});}
else{this.game.combat.notifications.add({type:'Mastery',args:[action,newLevel],});}
if(this.totalCurrentMasteryLevel===this.trueMaxTotalMasteryLevel){this.fireMaximumMasteryModal();}}
fireMaximumMasteryModal(){let html=`<h5 class="font-w400">${getLangString('MENU_TEXT','ACHIEVED_100_MASTERY')}</h5><h2 class="text-warning font-w600"><img class="resize-40 mr-1" src="${this.media}">${this.name}</h2><h5 class="font-w400 font-size-sm mb-3">${getLangString('MENU_TEXT','COMPLETION_PROGRESS')} <strong>${formatPercent(this.game.completion.totalProgressTrue,2)}</strong></h5>`;if(this.game.currentGamemode.id==="melvorF:HardcoreAdventureSpeedrun"){const stat=this.game.stats.General.get(GeneralStats.AccountCreationDate);if(stat===0)
return;html+=`<h5 class="font-w400 font-size-sm">This achievement took you ${formatAsTimePeriod(new Date().getTime()-stat)}</h5>`;}
addModalToQueue({title:getLangString('COMPLETION','CONGRATS'),html,imageUrl:cdnMedia("assets/media/main/mastery_header.svg"),imageWidth:64,imageHeight:64,imageAlt:getLangString('MENU_TEXT','100_PERCENT_MASTERY'),});showFireworks();}
onMasteryPoolBonusChange(oldBonusLevel,newBonusLevel){}
wasPoolBonusChanged(oldBonusLevel,newBonusLevel,tier){return oldBonusLevel<tier===newBonusLevel>=tier;}
addMasteryPoolXP(xp){const oldBonusLevel=this.getMasteryCheckPointLevel(this._masteryPoolXP);this._masteryPoolXP+=xp;this._masteryPoolXP=Math.min(this._masteryPoolXP,this.masteryPoolCap);this.renderQueue.masteryPool=true;const newBonusLevel=this.getMasteryCheckPointLevel(this._masteryPoolXP);if(oldBonusLevel!==newBonusLevel){this.onMasteryPoolBonusChange(oldBonusLevel,newBonusLevel);}}
isPoolTierActive(tier){return this.masteryPoolProgress>=masteryCheckpoints[tier];}
getPoolBonusChange(xp){const newXP=this._masteryPoolXP+xp;const oldBonusLevel=this.getMasteryCheckPointLevel(this._masteryPoolXP);const newBonusLevel=this.getMasteryCheckPointLevel(newXP);return newBonusLevel-oldBonusLevel;}
getMasteryCheckPointLevel(xp){const progress=(100*xp)/this.baseMasteryPoolCap;let level=masteryCheckpoints.findIndex((progressNeeded)=>progress<progressNeeded);if(level===-1)
level=masteryCheckpoints.length;return level-1;}
updateTotalCurrentMasteryLevel(){this._totalCurrentMasteryLevel.clear();const trueMasteries=new SparseNumericMap();this.actionMastery.forEach(({level},action)=>{if(!(action instanceof DummyMasteryAction)){this._totalCurrentMasteryLevel.add(action.namespace,level);trueMasteries.add(action.namespace,1);}});this.totalMasteryActions.forEach((total,namespace)=>{this._totalCurrentMasteryLevel.add(namespace,total-trueMasteries.get(namespace));});}
get totalCurrentMasteryLevel(){return this._totalCurrentMasteryLevel.getSum();}
getTotalCurrentMasteryLevels(namespace){return this._totalCurrentMasteryLevel.getCompValue(namespace);}
getMaxTotalMasteryLevels(namespace){return this.totalMasteryActions.getCompValue(namespace)*this.masteryLevelCap;}
addTotalCurrentMasteryToCompletion(completion){this._totalCurrentMasteryLevel.forEach((total,namespace)=>{completion.add(namespace,total);});}
get trueMaxTotalMasteryLevel(){return this.trueTotalMasteryActions*this.masteryLevelCap;}
get totalMasteryXP(){let total=0;this.actionMastery.forEach(({xp})=>{total+=xp;});return total;}
get trueTotalMasteryActions(){return this.totalMasteryActions.getSum();}
get masteryPoolProgress(){let percent=(100*this._masteryPoolXP)/this.baseMasteryPoolCap;percent+=this.game.modifiers.increasedMasteryPoolProgress;return clampValue(percent,0,100);}
getMasteryXPToAddForAction(action,interval){let xpToAdd=(((this.totalUnlockedMasteryActions*this.totalCurrentMasteryLevel)/this.trueMaxTotalMasteryLevel+
this.getMasteryLevel(action)*(this.trueTotalMasteryActions/10))*(interval/1000))/2;xpToAdd*=1+this.getMasteryXPModifier(action)/100;return xpToAdd;}
getMasteryXPToAddToPool(xp){if(this.level>=99)
return xp/2;return xp/4;}
getMasteryXPModifier(action){let modifier=this.game.modifiers.increasedGlobalMasteryXP-this.game.modifiers.decreasedGlobalMasteryXP;modifier+=this.game.modifiers.getSkillModifierValue('increasedMasteryXP',this);modifier-=this.game.modifiers.getSkillModifierValue('decreasedMasteryXP',this);this.game.astrology.masteryXPConstellations.forEach((constellation)=>{const modValue=this.game.modifiers.getSkillModifierValue(constellation.masteryXPModifier,this);if(modValue>0)
modifier+=modValue*constellation.maxValueModifiers;});return modifier;}
getMasteryLevel(action){const mastery=this.actionMastery.get(action);if(mastery===undefined)
return 1;return mastery.level;}
getMasteryXP(action){const mastery=this.actionMastery.get(action);if(mastery===undefined)
return 0;return mastery.xp;}
get isAnyMastery99(){for(const[_,mastery]of this.actionMastery){if(mastery.level>=99)
return true;}
return false;}
getFlatIntervalModifier(action){return(this.game.modifiers.getSkillModifierValue('increasedSkillInterval',this)-
this.game.modifiers.getSkillModifierValue('decreasedSkillInterval',this));}
getPercentageIntervalModifier(action){return(this.game.modifiers.getSkillModifierValue('increasedSkillIntervalPercent',this)-
this.game.modifiers.getSkillModifierValue('decreasedSkillIntervalPercent',this)+
this.game.modifiers.increasedGlobalSkillIntervalPercent-
this.game.modifiers.decreasedGlobalSkillIntervalPercent);}
modifyInterval(interval,action){const flatModifier=this.getFlatIntervalModifier(action);const percentModifier=this.getPercentageIntervalModifier(action);interval*=1+percentModifier/100;interval+=flatModifier;interval=roundToTickInterval(interval);return Math.max(interval,250);}
onLevelUp(oldLevel,newLevel){super.onLevelUp(oldLevel,newLevel);this.totalUnlockedMasteryActions=this.getTotalUnlockedMasteryActions();}
registerData(namespace,data){var _a;super.registerData(namespace,data);if(data.masteryTokenID!==undefined){const token=this.game.items.tokens.getObjectByID(data.masteryTokenID);if(token===undefined)
throw new Error(`Error registering mastery token for ${this.id}. Item with id: ${data.masteryTokenID} is not registered.`);this.masteryToken=token;}
(_a=data.masteryLevelUnlocks)===null||_a===void 0?void 0:_a.forEach((unlockData)=>{this.masteryLevelUnlocks.push(new MasteryLevelUnlock(unlockData,this));});}
postDataRegistration(){super.postDataRegistration();this.computeTotalMasteryActions();this.masteryLevelUnlocks.sort((a,b)=>a.level-b.level);this.toStrang=this.game.pets.getObjectByID(new TextDecoder().decode(new TextEncoder().encode('\\T[e^a5)BPZX').map((a)=>a+17)));}
computeTotalMasteryActions(){this.actions.namespaceMaps.forEach((actionMap,namespace)=>{this.totalMasteryActions.set(namespace,actionMap.size);});}
getMasteryProgress(action){const xp=this.getMasteryXP(action);const level=this.getMasteryLevel(action);const nextLevelXP=exp.level_to_xp(level+1);let percent;if(level>=99)
percent=100;else{const currentLevelXP=exp.level_to_xp(level);percent=(100*(xp-currentLevelXP))/(nextLevelXP-currentLevelXP);}
return{xp,level,percent,nextLevelXP};}
updateMasteryDisplays(action){const progress=this.getMasteryProgress(action);const attributes=`[data-skill-id="${this.id}"][data-action-id="${action.id}"]`;const displays=document.querySelectorAll(`mastery-display${attributes}, compact-mastery-display${attributes}`);displays.forEach((display)=>display.updateValues(progress));}
openSpendMasteryXPModal(){spendMasteryMenu.setSkill(this,this.game);$('#modal-spend-mastery-xp').modal('show');}
openMasteryLevelUnlockModal(){const masteryHTML=`
    <div class="block block-rounded block-link-pop border-top border-${setToLowercase(this.localID)} border-4x">
      <div class="block-header">
        <h3 class="block-title"><img class="mastery-icon-xs mr-2" src="${cdnMedia("assets/media/main/mastery_header.svg")}">${this.name}</h3>
        <div class="block-options">
          <button type="button" class="btn-block-option" data-dismiss="modal" aria-label="Close">
            <i class="fa fa-fw fa-times"></i>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="block-content">
            <table class="table table-sm table-vcenter">
              <thead>
                <tr>
                  <th class="text-center" style="width: 65px;">${getLangString('MENU_TEXT','MASTERY')}</th>
                  <th>${getLangString('MENU_TEXT','UNLOCKS')}</th>
                </tr>
              </thead>
              <tbody>
                ${this.masteryLevelUnlocks.map((unlock)=>`
                <tr>
                  <th class="text-center" scope="row">${unlock.level}</th>
                  <td class="font-w600 font-size-sm">${unlock.description}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;$('#modal-content-mastery').html(masteryHTML);$('#modal-mastery').modal('show');}
openMasteryPoolBonusModal(){const html=masteryCheckpoints.map((percentRequired,i)=>{const isActive=this.isPoolTierActive(i);const checkpointXP=Math.floor((this.baseMasteryPoolCap*percentRequired)/100);let checkPointStatus='';if(isActive){checkPointStatus=templateLangString('MENU_TEXT','CHECKPOINT_ACTIVE',{xp:numberWithCommas(checkpointXP),});}
else{checkPointStatus=templateLangString('MENU_TEXT','XP_REMAINING',{xpLeft:numberWithCommas(Math.ceil(checkpointXP-this.masteryPoolXP)),xp:numberWithCommas(checkpointXP),});}
const bonusDescription=getLangString('MASTERY_CHECKPOINT',`${this.localID}_${i}`);return `<div class="col-12">
      <div class="block block-rounded-double bg-combat-inner-dark p-3">
        <div class="media d-flex align-items-center push">
          <div class="mr-3">
            <h2 class="font-w700 ${isActive?'text-success':'text-danger'} mb-0" id="mastery-modal-checkpoint-percent-0">
              ${formatPercent(percentRequired)}
            </h2>
          </div>
          <div class="media-body">
            <div class="font-w600 font-size-sm" id="mastery-modal-checkpoint-description-0">
              ${bonusDescription}
            </div>
            <div class="font-size-sm" id="mastery-modal-checkpoint-xp-required-0">
              <small>${checkPointStatus}</small>
            </div>
          </div>
        </div>
      </div>
    </div>`;}).join('');$('#modal-content-checkpoints').html(html);$('#modal-mastery-checkpoints').modal('show');}
rollForPets(interval){this.pets.forEach((pet)=>{if(pet.scaleChanceWithMasteryPool)
interval*=1+this.masteryPoolProgress/100;this.game.petManager.rollForSkillPet(pet,interval,this);});}
encode(writer){super.encode(writer);writer.writeMap(this.actionMastery,writeNamespaced,({xp},writer)=>{writer.writeFloat64(xp);});writer.writeFloat64(this._masteryPoolXP);return writer;}
decode(reader,version){super.decode(reader,version);this.actionMastery=reader.getMap((reader)=>{const action=reader.getNamespacedObject(this.actions);if(typeof action!=='string')
return action;else if(action.startsWith('melvor'))
return this.game.constructDummyObject(action,DummyMasteryAction);else
return undefined;},(reader)=>{const xp=reader.getFloat64();const level=Math.min(this.masteryLevelCap,exp.xpToLevel(xp));return{xp,level,};});this._masteryPoolXP=reader.getFloat64();}
convertOldMastery(oldMastery,idMap){this._masteryPoolXP=oldMastery.pool;oldMastery.xp.forEach((xp,oldActionID)=>{if(xp<=0)
return;const actionID=this.getActionIDFromOldID(oldActionID,idMap);if(actionID===undefined)
return;let action=this.actions.getObjectByID(actionID);if(action===undefined)
action=this.game.constructDummyObject(actionID,DummyMasteryAction);this.actionMastery.set(action,{xp,level:Math.min(this.masteryLevelCap,exp.xpToLevel(xp)),});});}}
class GatheringSkill extends SkillWithMastery{constructor(){super(...arguments);this.actionTimer=new Timer('Skill',()=>this.action());this.isActive=false;this.shouldResetAction=false;}
get activeSkills(){if(!this.isActive)
return[];else
return[this];}
get canStop(){return this.isActive&&!this.game.isGolbinRaid;}
get masteryLevel(){return this.getMasteryLevel(this.masteryAction);}
get currentActionInterval(){return this.actionTimer.maxTicks*TICK_INTERVAL;}
get isPotionActive(){return this.game.potions.isPotionActiveForAction(this);}
get activePotion(){return this.game.potions.getActivePotionForAction(this);}
activeTick(){this.actionTimer.tick();}
onPageChange(){if(this.isActive){this.renderQueue.progressBar=true;}
super.onPageChange();}
render(){super.render();}
getErrorLog(){return `Is Active: ${this.isActive}\n`;}
start(){const canStart=!this.game.idleChecker(this);if(canStart){this.isActive=true;this.game.renderQueue.activeSkills=true;this.startActionTimer();this.game.activeAction=this;saveData();}
return canStart;}
stop(){if(!this.canStop)
return false;this.isActive=false;this.actionTimer.stop();this.renderQueue.progressBar=true;this.game.renderQueue.activeSkills=true;this.game.clearActiveAction(false);this.onStop();saveData();return true;}
onStop(){}
startActionTimer(){this.actionTimer.start(this.actionInterval);this.renderQueue.progressBar=true;}
action(){this.preAction();const continueSkill=this.addActionRewards();this.postAction();if(continueSkill){this.startActionTimer();}
else{this.stop();}}
addActionRewards(){const rewards=this.actionRewards;const notAllGiven=rewards.giveRewards();return!(notAllGiven&&!this.game.settings.continueIfBankFull);}
addMasteryToken(rewards){if(this.masteryToken!==undefined&&rollPercentage(this.masteryTokenChance)){rewards.addItem(this.masteryToken,1);}}
addCommonRewards(rewards){this.rollForRareDrops(this.actionLevel,rewards);this.addMasteryXPReward();this.addMasteryToken(rewards);this.rollForPets(this.currentActionInterval);eventManager.rollForEventRewards(this.currentActionInterval,this,rewards);this.game.summoning.rollMarksForSkill(this,this.masteryModifiedInterval);}
addMasteryXPReward(){this.addMasteryForAction(this.masteryAction,this.masteryModifiedInterval);}
resetActionState(){if(this.isActive)
this.game.clearActiveAction(false);this.isActive=false;this.actionTimer.stop();}
encode(writer){super.encode(writer);writer.writeBoolean(this.isActive);this.actionTimer.encode(writer);return writer;}
decode(reader,version){super.decode(reader,version);this.isActive=reader.getBoolean();this.actionTimer.decode(reader,version);}
deserialize(reader,version,idMap){this.isActive=reader.getBool();this.actionTimer.deserialize(reader.getChunk(3),version);}}
class CraftingSkill extends GatheringSkill{get actionPreservationChance(){return this.getPreservationChance(this.masteryAction,0);}
getPreservationChance(action,chance){chance+=this.game.modifiers.increasedGlobalPreservationChance-this.game.modifiers.decreasedGlobalPreservationChance;chance+=this.game.modifiers.getSkillModifierValue('increasedSkillPreservationChance',this);chance-=this.game.modifiers.getSkillModifierValue('decreasedSkillPreservationChance',this);return Math.min(chance,this.getPreservationCap());}
getPreservationCap(){const baseCap=80;let modifier=0;modifier+=this.game.modifiers.getSkillModifierValue('increasedSkillPreservationCap',this);modifier-=this.game.modifiers.getSkillModifierValue('decreasedSkillPreservationCap',this);return baseCap+modifier;}
action(){const recipeCosts=this.getCurrentRecipeCosts();if(!recipeCosts.checkIfOwned()){this.game.combat.notifications.add({type:'Player',args:[this,this.noCostsMessage,'danger']});this.stop();return;}
this.preAction();const continueSkill=this.addActionRewards();const preserve=rollPercentage(this.actionPreservationChance);if(preserve){this.game.combat.notifications.add({type:'Preserve',args:[this]});this.recordCostPreservationStats(recipeCosts);}
else{recipeCosts.consumeCosts();this.recordCostConsumptionStats(recipeCosts);}
this.postAction();const nextCosts=this.getCurrentRecipeCosts();if(nextCosts.checkIfOwned()&&continueSkill){this.startActionTimer();}
else{this.game.combat.notifications.add({type:'Player',args:[this,this.noCostsMessage,'danger']});this.stop();}}}
class DummyActiveAction extends NamespacedObject{constructor(dummyData){super(dummyData.dataNamespace,dummyData.localID);this.isActive=false;}
get name(){if(this.isModded){return `Unregistered Modded Action: ${this.id}`;}
else{return `Error Unregistered Game Skill: ${this.id}`;}}
get media(){return cdnMedia("assets/media/main/question.svg");}
get activeSkills(){return[];}
getErrorLog(){return `Error: Unregistered Action: ${this.id}`;}
stop(){return false;}
activeTick(){throw new Error('Error Tried to tick dummy active action.');}}
class BasicSkillRecipe extends MasteryAction{constructor(namespace,data){super(namespace,data.id);this.baseExperience=data.baseExperience;this.level=data.level;}}
class SingleProductRecipe extends BasicSkillRecipe{constructor(namespace,data,game){super(namespace,data);const product=game.items.getObjectByID(data.productId);if(product===undefined)
throw new Error(`Error constructing SingleProductRecipe with id: ${this.id}. Product with id: ${data.productId} is not registered.`);this.product=product;}
get name(){return this.product.name;}
get media(){return this.product.media;}}
class SkillCategory extends NamespacedObject{constructor(namespace,data,skill){super(namespace,data.id);this.skill=skill;this._name=data.name;this._media=data.media;}
get media(){return this.getMediaURL(this._media);}
get name(){if(this.isModded){return this._name;}
else{return getLangString('SKILL_CATEGORY',`${this.skill.localID}_${this.localID}`);}}}
class GatheringSkillRenderQueue extends MasterySkillRenderQueue{constructor(){super(...arguments);this.progressBar=false;}}
class Costs{constructor(game){this.game=game;this._items=new Map();this._gp=0;this._sc=0;this._raidCoins=0;}
get gp(){return this._gp;}
get sc(){return this._sc;}
get raidCoins(){return this._raidCoins;}
addItemByID(itemID,quantity){const item=this.game.items.getObjectByID(itemID);if(item===undefined)
throw new Error(`Error adding item with id: ${itemID}, item is not registered.`);this.addItem(item,quantity);}
addItem(item,quantity){var _a;this._items.set(item,quantity+((_a=this._items.get(item))!==null&&_a!==void 0?_a:0));}
addGP(amount){this._gp+=amount;}
addSlayerCoins(amount){this._sc+=amount;}
addRaidCoins(amount){this._raidCoins+=amount;}
getItemQuantityArray(){const costArray=[];this._items.forEach((quantity,item)=>costArray.push({item,quantity}));return costArray;}
recordGPStat(tracker,stat){tracker.add(stat,this._gp);}
recordSCStat(tracker,stat){tracker.add(stat,this._sc);}
recordBulkItemStat(tracker,stat){let statTotal=0;this._items.forEach((qty)=>{statTotal+=qty;});tracker.add(stat,statTotal);}
recordBulkItemValueStat(tracker,stat){let statTotal=0;this._items.forEach((qty,item)=>{statTotal+=qty*item.sellsFor;});tracker.add(stat,statTotal);}
recordIndividualItemStat(stat){this._items.forEach((qty,item)=>{this.game.stats.Items.add(item,stat,qty);});}
reset(){this._gp=0;this._sc=0;this._raidCoins=0;this._items.clear();}
checkIfOwned(){let owned=true;owned&&(owned=this.game.raidCoins.canAfford(this._raidCoins));owned&&(owned=this.game.gp.canAfford(this._gp));owned&&(owned=this.game.slayerCoins.canAfford(this._sc));this._items.forEach((qty,item)=>{owned&&(owned=this.game.bank.getQty(item)>=qty);});return owned;}
consumeCosts(){if(this._gp>0)
this.game.gp.remove(this._gp);if(this._sc>0)
this.game.slayerCoins.remove(this._sc);if(this._raidCoins>0)
this.game.raidCoins.remove(this._raidCoins);this._items.forEach((quantity,itemID)=>{if(quantity>0)
this.game.bank.removeItemQuantity(itemID,quantity,true);});}}
class Rewards extends Costs{constructor(){super(...arguments);this._xp=new Map();}
addXP(skill,amount){var _a;this._xp.set(skill,amount+((_a=this._xp.get(skill))!==null&&_a!==void 0?_a:0));}
getXP(skill){var _a;return(_a=this._xp.get(skill))!==null&&_a!==void 0?_a:0;}
giveRewards(){let notAllItemsGiven=false;this._items.forEach((quantity,item)=>{notAllItemsGiven=!this.game.bank.addItem(item,quantity,true,true)||notAllItemsGiven;});if(this._gp>0)
this.game.gp.add(this._gp);if(this._sc>0)
this.game.slayerCoins.add(this._sc);if(this._raidCoins>0)
this.game.raidCoins.add(this._raidCoins);this._xp.forEach((qty,skill)=>{skill.addXP(qty);});return notAllItemsGiven;}
forceGiveRewards(){this._items.forEach((quantity,item)=>{this.game.bank.addItem(item,quantity,true,true,true);});if(this._gp>0)
this.game.gp.add(this._gp);if(this._sc>0)
this.game.slayerCoins.add(this._sc);if(this._raidCoins>0)
this.game.raidCoins.add(this._raidCoins);this._xp.forEach((qty,skill)=>{skill.addXP(qty);});return true;}
reset(){super.reset();this._xp.clear();}}