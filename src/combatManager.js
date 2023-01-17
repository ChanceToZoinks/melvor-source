"use strict";var CombatAreaType;(function(CombatAreaType){CombatAreaType[CombatAreaType["Combat"]=0]="Combat";CombatAreaType[CombatAreaType["Slayer"]=1]="Slayer";CombatAreaType[CombatAreaType["Dungeon"]=2]="Dungeon";CombatAreaType[CombatAreaType["None"]=3]="None";})(CombatAreaType||(CombatAreaType={}));const TICK_INTERVAL=50;const TICKS_PER_MINUTE=(60*1000)/TICK_INTERVAL;class CombatEvent extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);const getPassives=(passiveID)=>{const passive=game.combatPassives.getObjectByID(passiveID);if(passive===undefined)
throw new Error(`Error constructing CombatEven with id: ${this.id}. Combat passive with id ${passiveID} is not registered.`);return passive;};this.itemRewards=data.itemRewardIDs.map((itemID)=>{const item=game.items.getObjectByID(itemID);if(item===undefined)
throw new Error(`Error constructing CombatEvent with id: ${this.id}. Reward item with id: ${itemID} is not registered.`);return item;});const pet=game.pets.getObjectByID(data.petID);if(pet===undefined)
throw new Error(`Error constructing CombatEvent with id: ${this.id}. Pet with id: ${data.petID} is not registered.`);this.pet=pet;this.slayerAreas=data.slayerAreaIDs.map((areaID)=>{const area=game.slayerAreas.getObjectByID(areaID);if(area===undefined)
throw new Error(`Error constructing CombatEvent with id: ${this.id}. Slayer area with id ${areaID} is not registered.`);return area;});this.passiveSelection=data.passiveSelectionIDs.map(getPassives);this.enemyPassives=data.enemyPassives.map(getPassives);this.bossPassives=data.bossPassives.map(getPassives);const firstBoss=game.monsters.getObjectByID(data.firstBossMonster);if(firstBoss===undefined)
throw new Error(`Error constructing CombatEvent with id: ${this.id}. Monster with id ${data.firstBossMonster} is not registered.`);this.firstBossMonster=firstBoss;const finalBoss=game.monsters.getObjectByID(data.finalBossMonster);if(finalBoss===undefined)
throw new Error(`Error constructing CombatEvent with id: ${this.id}. Monster with id ${data.firstBossMonster} is not registered.`);this.finalBossMonster=finalBoss;}}
class CombatManager extends BaseManager{constructor(game,namespace){super(game,namespace,'Combat');this.player=new Player(this,this.game);this.enemy=new Enemy(this,this.game);this.dungeonCompletion=new Map();this.dungeonProgress=0;this.bank=this.game.bank;this.loot=new CombatLoot(100,this.game);this.slayerTask=new SlayerTask(this.player,this.game);this.paused=false;this.shouldResetEvent=false;this.eventProgress=0;this.eventPassives=[];this.availableEventPassives=[];this.eventPassivesBeingSelected=new Set();this.eventDungeonLength=0;this.activeEventAreas=new Map();this.itmMonsters=[];this.spiderLairMonsters=[];this.openCombatAreaMenu=CombatAreaType.None;}
get media(){return cdnMedia("assets/media/skills/combat/combat.svg");}
get name(){return getLangString('PAGE_NAME','Combat');}
get activeSkills(){if(!this.isActive||this.areaType===CombatAreaType.None)
return[];return this.player.getExperienceGainSkills();}
get canStop(){return this.isActive&&!this.game.isGolbinRaid;}
get areaType(){if(this.selectedArea instanceof Dungeon){return CombatAreaType.Dungeon;}
else if(this.selectedArea instanceof SlayerArea){return CombatAreaType.Slayer;}
else if(this.selectedArea instanceof CombatArea){return CombatAreaType.Combat;}
else{return CombatAreaType.None;}}
get isEventActive(){return this.activeEvent!==undefined;}
get isFightingITMBoss(){if(!(this.selectedArea instanceof Dungeon))
return false;return(this.selectedArea.id==="melvorF:Into_the_Mist"&&this.dungeonProgress>this.selectedArea.monsters.length-4);}
get onSlayerTask(){return(this.slayerTask.active&&this.slayerTask.monster===this.selectedMonster&&this.areaType!==CombatAreaType.Dungeon&&this.areaType!==CombatAreaType.None);}
get ignoreSpellRequirements(){return false;}
get canInteruptAttacks(){return this.fightInProgress&&!this.paused;}
get areaRequirements(){if(this.selectedArea===undefined)
return[];return this.selectedArea.entryRequirements;}
get slayerAreaLevelReq(){if(this.selectedArea instanceof SlayerArea)
return this.selectedArea.slayerLevelRequired;return 0;}
get playerAreaModifiers(){const modifiers={};const area=this.selectedArea;if(area instanceof SlayerArea&&area.areaEffect&&!(this.player.attackType==='magic'&&area.id==="melvorF:Runic_Ruins")&&area.areaEffect.target==='Player'){modifiers[area.areaEffect.modifier]=this.getAreaEffectMagnitude(area.areaEffect);}
return modifiers;}
get enemyAreaModifiers(){const modifiers={};const area=this.selectedArea;if(area instanceof SlayerArea&&area.areaEffect&&area.areaEffect.target==='Enemy'){modifiers[area.areaEffect.modifier]=this.getAreaEffectMagnitude(area.areaEffect);}
return modifiers;}
addDungeonCompletion(dungeon){this.dungeonCompletion.set(dungeon,this.getDungeonCompleteCount(dungeon)+1);}
getDungeonCompleteCount(dungeon){var _a;return(_a=this.dungeonCompletion.get(dungeon))!==null&&_a!==void 0?_a:0;}
getDungeonCompletionSnapshot(){return new Map(this.dungeonCompletion);}
setDungeonCompleteCount(dungeon,count){if(count<=0)
this.dungeonCompletion.delete(dungeon);else
this.dungeonCompletion.set(dungeon,count);}
getMonsterDropsHTML(monster,respectArea){let drops='';if(monster.lootChance>0&&monster.lootTable.size>0&&!(respectArea&&this.areaType===CombatAreaType.Dungeon)){drops=monster.lootTable.sortedDropsArray.map((drop)=>{let dropText=templateLangString('BANK_STRING','40',{qty:`${drop.maxQuantity}`,itemImage:`<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,itemName:drop.item.name,});if(DEBUGENABLED)
dropText+=` (${((monster.lootChance*drop.weight)/monster.lootTable.weight).toFixed(2)}%)`;return dropText;}).join('<br>');}
let bones='';if(monster.bones!==undefined&&!(respectArea&&this.selectedArea instanceof Dungeon&&!this.selectedArea.dropBones)){bones=`${getLangString('MISC_STRING','7')}<br><small><img class="skill-icon-xs mr-2" src="${monster.bones.item.media}">${monster.bones.item.name}</small><br><br>`;}
else{bones=getLangString('COMBAT_MISC','107')+'<br><br>';}
let html=`<span class="text-dark">${bones}<br>`;if(drops!==''){html+=`${getLangString('MISC_STRING','8')}<br><small>${getLangString('MISC_STRING','9')}</small><br>${drops}`;}
html+='</span>';return html;}
getAreaEffectMagnitude(areaEffect){let bonus=0;if(this.isEventActive&&this.eventPassives.some((passive)=>passive.id==="melvorF:EventPassive12")){bonus=5;}
return this.player.calculateAreaEffectValue(areaEffect.magnitude+bonus);}
get atLastEventDungeon(){return this.activeEventAreas.size===1;}
initialize(){this.slayerTask.renderRequired=true;this.slayerTask.renderNewButton=true;this.rendersRequired.eventMenu=true;this.rendersRequired.areaRequirements=true;super.initialize();if(this.isEventActive){if(this.eventPassivesBeingSelected.size>0)
this.fireEventPassiveModal();this.renderEventAreas();}
combatMenus.eventMenu.setButtonCallbacks();}
postDataRegistration(){this.slayerTask.postDataRegistration();}
passiveTick(){this.player.passiveTick();this.slayerTask.tick();}
activeTick(){if(this.paused){this.addCombatStat(CombatStats.TimeSpentPaused,TICK_INTERVAL);return;}
else if(this.enemy.state===EnemyState.Spawning){this.addCombatStat(CombatStats.TimeSpentSpawning,TICK_INTERVAL);}
else if(this.fightInProgress){this.addCombatStat(CombatStats.TimeSpentFighting,TICK_INTERVAL);}
this.spawnTimer.tick();this.enemy.passiveTick();this.player.activeTick();this.enemy.activeTick();}
getErrorLog(){var _a;return `${super.getErrorLog()}
Current Area Type: ${CombatAreaType[this.areaType]}
Current Area ID: ${(_a=this.selectedArea)===null||_a===void 0?void 0:_a.id}`;}
render(){if(this.rendersRequired.slayerAreaEffects)
this.renderSlayerAreaEffects();super.render();this.renderAreaRequirements();this.loot.render();this.slayerTask.render();this.renderEventMenu();this.renderPause();}
renderPause(){if(this.rendersRequired.pause){if(this.paused){$('#combat-pause-container').removeClass('d-none');}
else{$('#combat-pause-container').addClass('d-none');}}
this.rendersRequired.pause=false;}
renderLocation(){let floorText='';let countText='';let effectText='';let areaName=getLangString('COMBAT_MISC','39');let areaMedia=this.game.unknownCombatArea.media;if(this.selectedArea!==undefined){areaMedia=this.selectedArea.media;areaName=this.selectedArea.name;if(this.selectedArea instanceof Dungeon){if(this.selectedArea.floors!==undefined){let floorCount=0;let floor=0;for(let i=0;i<this.selectedArea.floors.length;i++){floorCount+=this.selectedArea.floors[i];floor++;if(floorCount>this.dungeonProgress){floorCount-=this.selectedArea.floors[i];break;}}
floorText=templateLangString('COMBAT_MISC','FLOOR_COUNT',{currentFloor:`${floor}`,totalFloors:`${this.selectedArea.floors.length}`,});countText=`(${this.dungeonProgress-floorCount+1} / ${this.selectedArea.floors[floor-1]})`;}
else{countText=`(${this.dungeonProgress+1} / ${this.selectedArea.monsters.length})`;}}
else if(this.selectedArea instanceof SlayerArea){if(this.selectedArea.areaEffect){effectText=templateString(this.selectedArea.areaEffectDescription,{effectValue:`${this.getAreaEffectMagnitude(this.selectedArea.areaEffect)}`,});combatMenus.locationElements.areaEffect.classList.add('text-danger');combatMenus.locationElements.areaEffect.classList.remove('text-success');}
else{effectText=getLangString('COMBAT_MISC','NO_AREA_EFFECT');combatMenus.locationElements.areaEffect.classList.remove('text-danger');combatMenus.locationElements.areaEffect.classList.add('text-success');}}
if(this.isEventActive){countText=`(${this.dungeonProgress+1} / ${this.eventDungeonLength}) `;}}
combatMenus.locationElements.name.textContent=areaName;combatMenus.locationElements.floorCount.textContent=floorText;combatMenus.locationElements.count.textContent=countText;combatMenus.locationElements.areaEffect.textContent=effectText;combatMenus.locationElements.image.src=areaMedia;this.rendersRequired.location=false;}
renderSlayerAreaEffects(){if(this.rendersRequired.slayerAreaEffects)
areaMenus.slayer.updateAreaEffectValues();if(this.areaType===CombatAreaType.Slayer)
this.rendersRequired.location=true;this.rendersRequired.slayerAreaEffects=false;}
renderEventMenu(){if(!this.rendersRequired.eventMenu)
return;if(this.isEventActive){showElement(combatMenus.eventMenu);document.body.style.backgroundImage=`url(${cdnMedia('assets/media/main/bg_event.jpg')})`;}
else{hideElement(combatMenus.eventMenu);document.body.style.backgroundImage=`url(${cdnMedia('assets/media/main/bg_0.jpg')})`;}
this.rendersRequired.eventMenu=false;}
renderAreaRequirements(){if(!this.rendersRequired.areaRequirements)
return;areaMenus.combat.updateRequirements();areaMenus.slayer.updateRequirements();areaMenus.dungeon.updateRequirements();this.rendersRequired.areaRequirements=false;}
onPlayerDeath(){super.onPlayerDeath();const shouldDeleteSave=!(this.game.isGolbinRaid||this.isEventActive||this.giveFreeDeath);if(this.isEventActive)
this.stopEvent();if(this.game.currentGamemode.isPermaDeath&&shouldDeleteSave){sendDiscordEvent(0,this.enemy.monster);let killed='Thieving';if(this.game.activeAction!==this.game.thieving&&this.enemy.monster!==undefined)
killed=this.enemy.monster.name;localStorage.setItem('LatestHCDeath',JSON.stringify({PlayerName:this.game.characterName,TotalSkillLevel:this.game.completion.skillProgress.currentCount.getSum(),killedBy:killed,timestamp:new Date().getTime(),}));if(connectedToSteam)
unlockSteamAchievement('NEW_ACHIEVEMENT_2_29',61);resetAccountData();}
this.giveFreeDeath=false;}
onEnemyDeath(){if(this.enemy.monster===undefined)
throw new Error('Enemy died, but has no monster set.');const killedEvent=new MonsterKilledEvent(this.enemy.monster,this.player.attackType);let stopCombat=false;this.player.trackWeaponStat(ItemStats.EnemiesKilled);this.addCombatStat(CombatStats.MonstersKilled);this.game.township.tasks.updateMonsterTasks(this.enemy.monster);this.player.rewardGPForKill();if(this.selectedArea instanceof Dungeon){this.dungeonProgress++;this.rendersRequired.location=true;if(this.selectedArea.dropBones)
this.dropEnemyBones(this.enemy.monster);if(this.dungeonProgress===this.selectedArea.monsters.length){this.dungeonProgress=0;const lootQty=rollPercentage(this.player.modifiers.combatLootDoubleChance)?2:1;this.selectedArea.rewards.forEach((item)=>{if(this.bank.addItem(item,lootQty,true,true)){this.addCombatStat(CombatStats.DungeonRewards,lootQty);}});if(this.selectedArea.oneTimeReward!==undefined&&this.game.stats.itemFindCount(this.selectedArea.oneTimeReward)<=0)
this.bank.addItem(this.selectedArea.oneTimeReward,1,false,true,true);this.dropEnemyGP(this.enemy.monster);this.dropSignetHalfB(this.enemy.monster);this.addDungeonCompletion(this.selectedArea);if(this.selectedArea.fixedPetClears){if(this.getDungeonCompleteCount(this.selectedArea)>=this.selectedArea.pet.weight)
this.game.petManager.unlockPet(this.selectedArea.pet.pet);}
else{this.game.petManager.rollForPet(this.selectedArea.pet);}
this.player.rendersRequired.equipment=true;if(this.player.modifiers.bonusCoalOnDungeonCompletion){if(rollPercentage(1))
this.bank.addItemByID("melvorD:Coal_Ore",this.player.modifiers.bonusCoalOnDungeonCompletion,true,true);}
if(!(this.game.settings.autoRestartDungeon&&this.selectedArea.id!=="melvorF:Into_the_Mist")){this.loot.lootAll();stopCombat=true;addModalToQueue({title:getLangString('COMBAT_MISC','DUNGEON_COMPLETE'),text:getLangString('COMBAT_MISC','DUNGEON_COMPLETE_TEXT'),imageUrl:'assets/media/skills/combat/dungeon.svg',imageWidth:64,imageHeight:64,imageAlt:getLangString('COMBAT_MISC','DUNGEON_COMPLETE'),});}}}
else if(this.activeEvent!==undefined){this.rendersRequired.location=true;this.dungeonProgress++;if(this.dungeonProgress===this.eventDungeonLength){this.loot.lootAll();stopCombat=true;if(!(this.selectedArea instanceof SlayerArea))
throw new Error('Error increasing event progress. Selected area is invalid.');this.activeEventAreas.delete(this.selectedArea);this.renderEventAreas();if(this.activeEventAreas.size===0){const reward=this.activeEvent.itemRewards[this.eventProgress];this.bank.addItem(reward,1,true,true,true);this.increaseEventProgress(this.activeEvent);}}}
else{this.rewardForEnemyDeath(this.enemy.monster);}
stopCombat=super.onEnemyDeath()||stopCombat;this.game.queueRequirementRenders();if(this.game.stats.monsterKillCount(this.enemy.monster)===1)
this.game.completion.updateMonster(this.enemy.monster);this.game.processEvent(killedEvent);return stopCombat;}
retroactivelyAddOneTimeRewards(){this.game.dungeons.forEach((dungeon)=>{const completeCount=this.getDungeonCompleteCount(dungeon);if(dungeon.oneTimeReward!==undefined&&this.game.stats.itemFindCount(dungeon.oneTimeReward)<=0&&completeCount>0){this.game.bank.addItem(dungeon.oneTimeReward,1,false,true,true);}
if(dungeon.fixedPetClears&&completeCount>=dungeon.pet.weight)
this.game.petManager.unlockPet(dungeon.pet.pet);});}
rewardForEnemyDeath(monster){if(this.selectedArea instanceof SlayerArea&&this.selectedArea.pet!==undefined)
this.game.petManager.rollForPet(this.selectedArea.pet);this.dropEnemyBones(monster);this.dropSignetHalfB(monster);this.dropEnemyLoot(monster);this.dropEnemyGP(monster);let slayerXPReward=0;if(this.areaType===CombatAreaType.Slayer){slayerXPReward+=this.enemy.stats.maxHitpoints/numberMultiplier/2;}
if(this.onSlayerTask){this.slayerTask.addKill();this.player.rewardSlayerCoins();const chanceForDoubleReward=this.player.modifiers.increasedChanceDoubleSlayerTaskKill-
this.player.modifiers.decreasedChanceDoubleSlayerTaskKill;if(rollPercentage(chanceForDoubleReward)&&this.onSlayerTask){this.slayerTask.addKill();this.player.rewardSlayerCoins();}
slayerXPReward+=this.enemy.stats.maxHitpoints/numberMultiplier;}
if(slayerXPReward>0)
this.game.slayer.addXP(slayerXPReward);}
dropEnemyLoot(monster){if(!this.game.tutorial.complete)
return;if(rollPercentage(monster.lootChance)){let{item,quantity}=monster.lootTable.getDrop();const herbItem=this.game.farming.getHerbFromSeed(item);if(herbItem!==undefined){if(rollPercentage(this.player.modifiers.increasedChanceToConvertSeedDrops)){item=herbItem;quantity+=3;}}
if(rollPercentage(this.player.modifiers.combatLootDoubleChance))
quantity*=2;const autoLooted=this.player.modifiers.autoLooting&&this.bank.addItem(item,quantity,false,true);if(autoLooted){this.addCombatStat(CombatStats.ItemsLooted,quantity);}
else{let stack=false;if(this.player.modifiers.allowLootContainerStacking>0)
stack=true;this.loot.add(item,quantity,stack);}
const event=new MonsterDropEvent(item,quantity,herbItem!==undefined);this.game.processEvent(event);}}
dropSignetHalfB(monster){const chance=monster.combatLevel/5000;if(rollPercentage(chance)){let itemID="melvorD:Gold_Topaz_Ring";if(this.player.modifiers.allowSignetDrops)
itemID="melvorD:Signet_Ring_Half_B";this.bank.addItemByID(itemID,1,true,true);if(itemID==="melvorD:Gold_Topaz_Ring")
this.game.stats.General.inc(GeneralStats.SignetRingHalvesMissed);}}
dropEnemyBones(monster){if(!this.game.tutorial.complete)
return;if(monster.bones!==undefined){let itemQty=monster.bones.quantity;if(rollPercentage(this.player.modifiers.combatLootDoubleChance))
itemQty*=2;if(this.player.modifiers.doubleBoneDrops>0)
itemQty*=2;const item=monster.bones.item;if(item instanceof BoneItem&&this.player.modifiers.autoBurying>0&&this.game.prayer.isUnlocked){this.game.stats.Prayer.add(PrayerStats.BonesBuried,itemQty);this.game.stats.Items.add(item,ItemStats.TimesBuried,itemQty);this.player.addPrayerPoints(applyModifier(itemQty*item.prayerPoints,this.player.modifiers.autoBurying));}
else{const autoLooted=this.player.modifiers.autoLooting&&this.bank.addItem(item,itemQty,false,true);if(autoLooted){this.addCombatStat(CombatStats.ItemsLooted,itemQty);}
else{this.loot.add(item,itemQty,true);}}}}
dropEnemyGP(monster){let gpToAdd=rollInteger(monster.gpDrops.min,monster.gpDrops.max);gpToAdd+=this.player.modifiers.increasedGPFromMonstersFlat-this.player.modifiers.decreasedGPFromMonstersFlat;let gpModifier=this.player.modifiers.increasedCombatGP;if(this.onSlayerTask)
gpModifier+=this.player.modifiers.increasedGPFromSlayerTaskMonsters;if(this.enemy.isBurning)
gpModifier+=this.player.modifiers.increasedGPFromBurningMonsters;gpToAdd=applyModifier(gpToAdd,gpModifier);this.game.gp.add(gpToAdd);this.game.stats.Combat.add(CombatStats.GPEarned,gpToAdd);}
startEvent(event){this.eventProgress=-1;this.activeEvent=event;this.eventPassives=[];this.computeAvailableEventPassives(event);this.increaseEventProgress(event);showCombatArea(CombatAreaType.Slayer);this.rendersRequired.eventMenu=true;this.renderEventMenu();}
computeAvailableEventPassives(event){this.availableEventPassives=[...event.passiveSelection];this.eventPassives.forEach((passive)=>this.removeAvailablePassive(passive));}
fireEventStageCompletionModal(event){const modalBody=createElement('div');const item=event.itemRewards[this.eventProgress-1];let title=getLangString('COMBAT_MISC','BANE_FLED');const itemFlavour=getLangString('COMBAT_MISC','IN_WAKE_FOUND');if(this.eventProgress===5){title=getLangString('COMBAT_MISC','BANE_DEFEATED');}
modalBody.append(createElement('h5',{text:itemFlavour,classList:['text-info']}),createElement('img',{classList:['bank-img'],attributes:[['src',item.media]]}),createElement('br'),createElement('span',{classList:['text-success'],text:item.name}),createElement('br'),createElement('small',{classList:['text-info'],text:item.description}));addModalToQueue({title,html:modalBody,allowOutsideClick:false,showConfirmButton:true,});}
fireEventPassiveModal(){const modalBody=createElement('div');this.eventPassivesBeingSelected.forEach((passive)=>{const selectButton=createElement('button',{classList:['btn','btn-outline-danger','m-2']});selectButton.style.width='80%';selectButton.onclick=()=>this.onPassiveSelection(passive);selectButton.append(createElement('small',{text:passive.description}));modalBody.append(selectButton);});addModalToQueue({title:getLangString('BANE_EVENT','3'),html:modalBody,allowOutsideClick:false,showConfirmButton:false,});}
showEventPassivesModal(){const modalBody=createElement('div');this.eventPassives.map((passive)=>{modalBody.append(createElement('small',{text:passive.description,classList:['text-danger']}),createElement('br'));});addModalToQueue({title:getLangString('BANE_EVENT','4'),html:modalBody,});}
showStartEventModal(event){const modalBody=createElement('div');modalBody.append(createElement('h5',{text:getLangString('BANE_EVENT','START_TEXT_0')}));modalBody.append(createElement('p',{text:getLangString('BANE_EVENT','START_TEXT_1'),}));if(this.game.currentGamemode.isPermaDeath){modalBody.append(createElement('p',{text:getLangString('BANE_EVENT','START_TEXT_2'),}));}
for(let i=3;i<9;i++){modalBody.append(createElement('p',{text:getLangString('BANE_EVENT',`START_TEXT_${i}`),}));}
SwalLocale.fire({title:getLangString('BANE_EVENT','5'),html:modalBody,confirmButtonText:getLangString('MENU_TEXT','START'),showCancelButton:true,cancelButtonText:getLangString('CHARACTER_SELECT','50'),}).then((result)=>{if(result.isConfirmed){this.startEvent(event);}});}
showStopEventModal(){const modalBody=createElement('div');modalBody.append(createElement('h5',{text:getLangString('BANE_EVENT','STOP_WARNING')}));modalBody.append(createElement('p',{text:getLangString('BANE_EVENT','ARE_YOU_SURE'),}));SwalLocale.fire({title:getLangString('BANE_EVENT','BTN_1'),html:modalBody,confirmButtonText:getLangString('MISC_STRING','30'),showCancelButton:true,}).then((result)=>{if(result.isConfirmed){this.stopEvent();this.stop(true);}});}
onPassiveSelection(passive){if(!this.eventPassivesBeingSelected.has(passive))
return;this.eventPassives.push(passive);this.removeAvailablePassive(passive);this.eventPassivesBeingSelected.clear();if(passive.id==="melvorF:EventPassive12")
this.rendersRequired.slayerAreaEffects=true;Swal.close();}
removeAvailablePassive(passive){const index=this.availableEventPassives.indexOf(passive);if(index===-1)
throw new Error('Tried to remove passive that is not available');this.availableEventPassives.splice(index,1);}
increaseEventProgress(event){this.eventProgress++;if(this.eventProgress>0)
this.fireEventStageCompletionModal(event);if(this.eventProgress===5){this.game.petManager.unlockPet(event.pet);const eventDungeon=this.game.dungeons.find((dungeon)=>dungeon.event===event);if(eventDungeon!==undefined)
this.addDungeonCompletion(eventDungeon);this.stopEvent();return;}
this.activeEventAreas.clear();event.slayerAreas.forEach((area)=>{this.activeEventAreas.set(area,rollInteger(5,8));});this.renderEventAreas();this.eventPassivesBeingSelected=getExclusiveRandomArrayElements(this.availableEventPassives,3);this.fireEventPassiveModal();}
stopEvent(){this.activeEvent=undefined;this.renderEventAreas();this.rendersRequired.eventMenu=true;this.renderEventMenu();}
renderEventAreas(){if(this.isEventActive){areaMenus.combat.updateEvent(new Map());areaMenus.dungeon.updateEvent(new Map());areaMenus.slayer.updateEvent(this.activeEventAreas);}
else{areaMenus.combat.removeEvent();areaMenus.dungeon.removeEvent();areaMenus.slayer.removeEvent();}}
selectMonster(monster,areaData){if(!this.game.tutorial.complete&&!this.game.tutorial.allowedMonsters.has(monster)){notifyPlayer(this.game.attack,getLangString('TOASTS','FIGHT_WRONG_MONSTER'),'danger');return;}
let slayerLevelReq=0;if(areaData instanceof SlayerArea)
slayerLevelReq=areaData.slayerLevelRequired;if(!this.game.checkRequirements(areaData.entryRequirements,true,slayerLevelReq)){return;}
const canStart=this.preSelection();if(canStart){this.selectedArea=areaData;this.selectedMonster=monster;this.onSelection();}}
selectDungeon(dungeon){if(!this.game.checkRequirements(dungeon.entryRequirements,true)){return;}
if(dungeon.event!==undefined){this.showStartEventModal(dungeon.event);return;}
const canStart=this.preSelection();if(canStart){this.selectedArea=dungeon;this.dungeonProgress=0;this.onSelection();}}
selectEventArea(areaData){if(!this.game.checkRequirements(areaData.entryRequirements,true,areaData.slayerLevelRequired)){return;}
const areaLength=this.activeEventAreas.get(areaData);if(areaLength===undefined)
throw new Error('Tried to select an event area that is not active!');const canStart=this.preSelection();if(canStart){this.selectedArea=areaData;this.dungeonProgress=0;this.eventDungeonLength=areaLength+(this.atLastEventDungeon?1:0);this.onSelection();}}
preSelection(){const canStart=!this.game.idleChecker(this);if(canStart){this.stop(true,true);}
return canStart;}
stop(fled=true,areaChange=false){if(!this.canStop)
return false;super.stop(fled);if(fled&&!areaChange)
this.loot.lootAll();this.selectedArea=undefined;if(this.enemy.state===EnemyState.Alive&&fled){this.addMonsterStat(MonsterStats.RanAway);}
if(this.paused){this.rendersRequired.pause=true;this.paused=false;}
this.game.clearActiveAction(!areaChange&&!loadingOfflineProgress);return true;}
loadNextEnemy(){let nextMonster;if(this.selectedArea instanceof Dungeon){nextMonster=this.selectedArea.monsters[this.dungeonProgress];}
else if(this.selectedArea instanceof CombatArea&&this.selectedMonster!==undefined){nextMonster=this.selectedMonster;}
else{throw new Error('Error loading next enemy. Area or Monster is not selected.');}
if(nextMonster.id==="melvorF:RandomITM"){nextMonster=getRandomArrayElement(this.itmMonsters);}
else if(nextMonster.id==="melvorTotH:RandomSpiderLair"){nextMonster=getRandomArrayElement(this.spiderLairMonsters);}
if(this.activeEvent!==undefined){if(this.atLastEventDungeon&&this.dungeonProgress===this.eventDungeonLength-1){nextMonster=this.eventProgress===4?this.activeEvent.finalBossMonster:this.activeEvent.firstBossMonster;}
else{nextMonster=getRandomArrayElement(this.selectedArea.monsters);}}
this.selectedMonster=nextMonster;super.loadNextEnemy();}
createNewEnemy(){if(this.selectedMonster===undefined)
throw new Error('Error creating new enemy, no monster is selected.');this.enemy=new Enemy(this,this.game);this.enemy.setMonster(this.selectedMonster);if(this.selectedArea instanceof Dungeon&&this.selectedArea.nonBossPassives!==undefined&&!this.selectedArea.monsters[this.dungeonProgress].isBoss){this.enemy.addPassives(this.selectedArea.nonBossPassives,true,true,false);}
if(this.activeEvent!==undefined){this.enemy.addPassives(this.eventPassives,true,false,false);if(this.selectedMonster!==this.activeEvent.firstBossMonster&&this.selectedMonster!==this.activeEvent.finalBossMonster){this.enemy.addPassives(this.activeEvent.enemyPassives,true,true,false);}
if(this.dungeonProgress===this.eventDungeonLength-(this.atLastEventDungeon?2:1)){this.enemy.addPassives(this.activeEvent.bossPassives,true,true,false);}}}
onPageChange(){if(this.game.isGolbinRaid)
this.game.golbinRaid.onCombatPageChange();else
this.onCombatPageChange();}
renderModifierChange(){if(this.game.isGolbinRaid)
this.game.golbinRaid.renderAutoSwapFood();else
this.renderAutoSwapFood();}
spawnEnemy(){super.spawnEnemy();if((this.selectedArea instanceof Dungeon&&this.selectedArea.pauseOnBosses&&this.selectedArea.monsters[this.dungeonProgress].isBoss)||(this.activeEvent!==undefined&&(this.enemy.monster===this.activeEvent.firstBossMonster||this.enemy.monster===this.activeEvent.finalBossMonster))){this.pauseDungeon();}
else{this.startFight();}}
pauseDungeon(){this.rendersRequired.pause=true;this.paused=true;}
resumeDungeon(){this.rendersRequired.pause=true;this.startFight(false);this.paused=false;}
onSelection(){this.game.activeAction=this;super.onSelection();this.closeAreaMenu();}
openAreaMenu(areaType){if(areaType!==this.openCombatAreaMenu){if(this.openCombatAreaMenu!==CombatAreaType.None)
this.closeAreaMenu();if(areaType===CombatAreaType.Slayer&&!this.game.slayer.isUnlocked){lockedSkillAlert(this.game.slayer,'SKILL_UNLOCK_EXPLORE_AREA');return;}
$('#combat-select-area-'+areaType).removeClass('d-none');$('#combat-select-'+areaType).addClass('bg-combat-menu-selected');this.openCombatAreaMenu=areaType;}
else{this.closeAreaMenu();}}
closeAreaMenu(){$('#combat-select-area-'+this.openCombatAreaMenu).addClass('d-none');$('#combat-select-'+this.openCombatAreaMenu).removeClass('bg-combat-menu-selected');this.openCombatAreaMenu=CombatAreaType.None;}
resetActionState(){super.resetActionState();this.selectedArea=undefined;this.dungeonProgress=0;this.selectedMonster=undefined;this.paused=false;}
resetEventState(){this.activeEvent=undefined;this.eventPassives=[];this.eventPassivesBeingSelected.clear();this.eventDungeonLength=0;this.activeEventAreas.clear();this.eventProgress=0;if(this.isActive)
this.shouldResetAction=true;}
encode(writer){super.encode(writer);writer.writeBoolean(this.selectedArea!==undefined);if(this.selectedArea!==undefined){if(this.selectedArea instanceof Dungeon){writer.writeUint8(CombatAreaType.Dungeon);}
else if(this.selectedArea instanceof SlayerArea){writer.writeUint8(CombatAreaType.Slayer);}
else{writer.writeUint8(CombatAreaType.Combat);}
writer.writeNamespacedObject(this.selectedArea);}
writer.writeUint32(this.dungeonProgress);writer.writeBoolean(this.selectedMonster!==undefined);if(this.selectedMonster!==undefined){writer.writeNamespacedObject(this.selectedMonster);}
writer.writeBoolean(this.paused);this.loot.encode(writer);this.slayerTask.encode(writer);writer.writeBoolean(this.isEventActive);if(this.activeEvent!==undefined)
writer.writeNamespacedObject(this.activeEvent);writer.writeArray(this.eventPassives,writeNamespaced);writer.writeSet(this.eventPassivesBeingSelected,writeNamespaced);writer.writeUint32(this.eventDungeonLength);writer.writeMap(this.activeEventAreas,writeNamespaced,(monsterCount,writer)=>writer.writeUint32(monsterCount));writer.writeUint32(this.eventProgress);writer.writeMap(this.dungeonCompletion,writeNamespaced,(count,writer)=>writer.writeUint32(count));return writer;}
decode(reader,version){super.decode(reader,version);if(reader.getBoolean()){let selectedArea;switch(reader.getUint8()){case CombatAreaType.Dungeon:selectedArea=reader.getNamespacedObject(this.game.dungeons);break;case CombatAreaType.Slayer:selectedArea=reader.getNamespacedObject(this.game.slayerAreas);break;case CombatAreaType.Combat:selectedArea=reader.getNamespacedObject(this.game.combatAreas);break;default:throw new Error(`Error decoding combat. Invalid CombatAreaType.`);}
if(typeof selectedArea==='string')
this.shouldResetAction=true;else
this.selectedArea=selectedArea;}
this.dungeonProgress=reader.getUint32();if(reader.getBoolean()){const selectedMonster=reader.getNamespacedObject(this.game.monsters);if(typeof selectedMonster==='string')
this.shouldResetAction=true;else
this.selectedMonster=selectedMonster;}
this.paused=reader.getBoolean();this.loot.decode(reader,version);this.slayerTask.decode(reader,version);if(reader.getBoolean()){const activeEvent=reader.getNamespacedObject(this.game.combatEvents);if(typeof activeEvent==='string')
this.shouldResetEvent=true;else
this.activeEvent=activeEvent;}
this.eventPassives=reader.getArray(readNamespacedReject(this.game.combatPassives));this.eventPassivesBeingSelected=reader.getSet(readNamespacedReject(this.game.combatPassives));this.eventDungeonLength=reader.getUint32();this.activeEventAreas=reader.getMap((reader)=>{const area=reader.getNamespacedObject(this.game.slayerAreas);if(typeof area==='string'){this.shouldResetEvent=true;return undefined;}
else
return area;},(reader)=>reader.getUint32());this.eventProgress=reader.getUint32();this.dungeonCompletion=reader.getMap((reader)=>{const dungeon=reader.getNamespacedObject(this.game.dungeons);if(typeof dungeon==='string'){if(dungeon.startsWith('melvor'))
return this.game.dungeons.getDummyObject(dungeon,DummyDungeon,this.game);else
return undefined;}
else
return dungeon;},(reader)=>reader.getUint32());if(this.activeEvent!==undefined)
this.computeAvailableEventPassives(this.activeEvent);if(this.shouldResetEvent)
this.resetEventState();if(this.shouldResetAction)
this.resetActionState();if(!this.isActive)
this.selectedArea=undefined;}
deserialize(reader,version,idMap){super.deserialize(reader.getVariableLengthChunk(),version,idMap);this.selectedArea=reader.getLocation(this.game,idMap);if(this.selectedArea===undefined)
this.shouldResetAction=true;this.dungeonProgress=reader.getNumber();const selectedMonster=this.game.monsters.getObjectByID(idMap.monsters[reader.getNumber()]);if(selectedMonster===undefined)
this.shouldResetAction=true;else
this.selectedMonster=selectedMonster;this.paused=reader.getBool();this.loot.deserialize(reader.getVariableLengthChunk(),version,idMap);this.slayerTask.deserialize(reader.getVariableLengthChunk(),version,idMap);if(version>=7){const eventActive=reader.getBool();if(eventActive){this.activeEvent=this.game.combatEvents.getObjectByID(idMap.combatEvents[0]);if(this.activeEvent===undefined)
this.shouldResetEvent=true;}
let eventPassiveIDs=reader.getVariableLengthChunk().getRawData();if(version<9){const oldPassiveIDs=eventPassiveIDs;eventPassiveIDs=[];oldPassiveIDs.forEach((passiveID)=>{if(passiveID>=31)
passiveID--;if(passiveID!==31)
eventPassiveIDs.push(passiveID);});}
eventPassiveIDs.forEach((passiveID)=>{const passive=this.game.combatPassives.getObjectByID(idMap.combatPassives[passiveID]);if(passive!==undefined)
this.eventPassives.push(passive);});let selectedPassiveIDs=reader.getVariableLengthChunk().getRawData();if(version<9){const oldPassivesSelected=selectedPassiveIDs;selectedPassiveIDs=[];oldPassivesSelected.forEach((passiveID)=>{if(passiveID>=31)
passiveID--;if(passiveID!==31)
selectedPassiveIDs.push(passiveID);});}
selectedPassiveIDs.forEach((passiveID)=>{const passive=this.game.combatPassives.getObjectByID(idMap.combatPassives[passiveID]);if(passive!==undefined)
this.eventPassivesBeingSelected.add(passive);});this.eventDungeonLength=reader.getNumber();const numAreas=reader.getNumber();for(let i=0;i<numAreas;i++){const slayerArea=this.game.slayerAreas.getObjectByID(idMap.slayerAreas[reader.getNumber()]);if(slayerArea===undefined)
this.shouldResetEvent=true;const monsterCount=reader.getNumber();if(slayerArea!==undefined)
this.activeEventAreas.set(slayerArea,monsterCount);}}
if(version>=8){this.eventProgress=reader.getNumber();}
if(this.activeEvent!==undefined){if(version<13){const newPassives=[];this.eventPassives.forEach((passive)=>{if(!newPassives.includes(passive))
newPassives.push(passive);});this.eventPassives=newPassives;}
this.computeAvailableEventPassives(this.activeEvent);}
while(this.slayerTask.completion.length<SlayerTask.data.length){this.slayerTask.completion.push(0);}
if(this.shouldResetEvent)
this.resetEventState();if(this.shouldResetAction)
this.resetActionState();if(!this.isActive)
this.selectedArea=undefined;}
resetOfflineTracking(){this.loot.lostLoot.clear();this.bank.lostItems.clear();}
convertFromOldSaveFormat(saveGame,idMap){var _a,_b;this.player.convertFromOldSaveFormat(saveGame,idMap);this.slayerTask.convertFromOldSaveFormat((_a=saveGame.slayerTask)!==null&&_a!==void 0?_a:[],(_b=saveGame.slayerTaskCompletion)!==null&&_b!==void 0?_b:defaultSaveValues.slayerTaskCompletion,idMap);}
convertDungeonCompletion(dungeonCompletion,idMap){dungeonCompletion.forEach((count,oldDungeonID)=>{const newID=idMap.dungeons[oldDungeonID];let dungeon=this.game.dungeons.getObjectByID(newID);if(dungeon===undefined)
dungeon=this.game.dungeons.getDummyObject(newID,DummyDungeon,this.game);this.dungeonCompletion.set(dungeon,count);});}
getStatsLog(){return{player:{stats:this.player.stats.getValueTable(),modifiers:this.player.modifiers.getActiveModifiers(),},enemy:{stats:this.enemy.stats.getValueTable(),modifiers:this.enemy.modifiers.getActiveModifiers(),},};}
saveStats(){setItem(`${key}statsLog`,this.getStatsLog());}
compareStatsWithSavedStats(){const oldStats=getItem(`${key}statsLog`);if(oldStats===undefined){console.log('No Saved Stats');return;}
const curStats=this.getStatsLog();console.log('Comparing player stats:');compareNameValuePairs(curStats.player.stats,oldStats.player.stats);console.log('Comparing player modifiers:');compareNameValuePairs(curStats.player.modifiers,oldStats.player.modifiers);console.log('Comparing enemy stats:');compareNameValuePairs(curStats.enemy.stats,oldStats.enemy.stats);console.log('Comparing enemy modifiers:');compareNameValuePairs(curStats.enemy.modifiers,oldStats.enemy.modifiers);}}
class Timer{constructor(type,action){this.type=type;this.action=action;this._ticksLeft=-1;this._maxTicks=-1;this.active=false;}
tick(){if(this.active){this._ticksLeft--;if(this._ticksLeft===0){this.active=false;this.action();}}}
start(time,offsetByTick=false){let ticks=Math.floor(time/TICK_INTERVAL);if(offsetByTick)
ticks++;if(ticks<1)
throw new Error(`Tried to start timer: ${this.type} with invalid tick amount: ${ticks}`);this.active=true;this._maxTicks=ticks;this._ticksLeft=ticks;}
stop(){this.active=false;}
get isActive(){return this.active;}
get maxTicks(){return this._maxTicks;}
get ticksLeft(){return this._ticksLeft;}
encode(writer){writer.writeInt32(this._ticksLeft);writer.writeInt32(this._maxTicks);writer.writeBoolean(this.active);return writer;}
decode(reader,version){this._ticksLeft=reader.getInt32();this._maxTicks=reader.getInt32();this.active=reader.getBoolean();}
deserialize(sData,version){this._ticksLeft=sData[0];this._maxTicks=sData[1];this.active=sData[2]===1;}}