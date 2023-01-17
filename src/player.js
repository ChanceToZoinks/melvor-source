"use strict";class PlayerStats extends CharacterStats{constructor(){super();this.summoningMaxHit=0;}
getValueTable(){const valueTable=super.getValueTable();valueTable.push({name:'Summoning Max Hit',value:this.summoningMaxHit,});return valueTable;}}
class Player extends Character{constructor(manager,game){super(manager,game);this.manager=manager;this.equipmentSets=[new EquipmentSet(this.game)];this.selectedEquipmentSet=0;this.food=new EquippedFood(3,this.game);this.attackStyles={};this.equipToSet=0;this.modifiers=new PlayerModifiers();this.noun=youNoun;this.runesProvided=new Map();this.prayerPoints=0;this.target=this;this.stats=new PlayerStats();this.eatTimeout=-1;this.allowToEatFromTimeout=false;this.quickEquipMenu=new CombatQuickEquipMenu(this,this.game);this.rendersRequired={stats:false,hitChance:false,hitpoints:false,damageSplash:false,effects:false,attackBar:false,attackBarMinibar:false,summonBar:false,prayerPoints:false,prayerSelection:false,spellSelection:false,ancientSelection:false,archaicSelection:false,auroraSelection:false,curseSelection:false,attackStyle:false,equipment:false,food:false,combatLevel:false,attacks:false,passives:false,equipmentSets:false,runesUsed:false,autoEat:false,combatTriangle:false,damageValues:false,levels:false,activeSkillModifierChange:false,};this.activeSummonSlots=[];this.statProviders=new Set();this.activeItemSynergies=new Set();this.summonAttackInterval=3000;this.itemEffects=new Set();this._pets=0;this.baseSpawnInterval=3000;this.conditionalListeners={All:new Set(),PlayerHitpoints:new Set(),EnemyHitpoints:new Set(),ItemCharges:new Set(),BankItem:new Set(),PlayerDOT:new Set(),EnemyDOT:new Set(),PlayerModEffect:new Set(),EnemyModEffect:new Set(),EnemySpawn:new Set(),Stun:new Set(),EnemyStun:new Set(),Sleep:new Set(),EnemySleep:new Set(),};this.hitpoints=numberMultiplier*10;this.timers={act:new Timer('Act',()=>this.act()),regen:new Timer('Regen',()=>this.regen()),summon:new Timer('Summon',()=>this.summonAttack()),};this.timers.regen.start(Math.max(10000-this.modifiers.decreasedRegenerationInterval,2500));}
get activePrayers(){return this.equipmentSets[this.selectedEquipmentSet].prayerSelection;}
get activeTriangle(){return this.game.currentGamemode.combatTriangle;}
get statElements(){return playerHTMLElements;}
get splashManager(){return combatMenus.playerSplashManager;}
get effectRenderer(){return combatMenus.playerEffectRenderer;}
get attackBar(){return combatMenus.progressBars.playerAttack;}
get attackBarMinibar(){return combatMenus.progressBars.playerAttackMinibar;}
get equipment(){return this.equipmentSets[this.selectedEquipmentSet].equipment;}
get equipToSetEquipment(){return this.equipmentSets[this.equipToSet].equipment;}
get spellSelection(){return this.equipmentSets[this.selectedEquipmentSet].spellSelection;}
get attackStyle(){return this.attackStyles[this.attackType];}
get autoEatThreshold(){let percent=this.modifiers.increasedAutoEatThreshold-this.modifiers.decreasedAutoEatThreshold;percent=Math.min(100,percent);return(this.stats.maxHitpoints*percent)/100;}
get autoEatHPLimit(){let percent=this.modifiers.increasedAutoEatHPLimit-this.modifiers.decreasedAutoEatHPLimit;percent=Math.min(100,percent);return(this.stats.maxHitpoints*percent)/100;}
get autoEatEfficiency(){const percent=this.modifiers.increasedAutoEatEfficiency-this.modifiers.decreasedAutoEatEfficiency;return Math.max(percent,1);}
get minHitFromMaxHitPercent(){let percent=super.minHitFromMaxHitPercent;if(this.manager.onSlayerTask){switch(this.attackType){case 'melee':percent+=this.modifiers.increasedMeleeMaxHitBasedOnMaxHitSlayerTask;break;case 'ranged':percent+=this.modifiers.increasedRangedMaxHitBasedOnMaxHitSlayerTask;break;case 'magic':percent+=this.modifiers.increasedMagicMinHitBasedOnMaxHitSlayerTask;break;}}
return percent;}
get synergyDescription(){const synergy=this.equippedSummoningSynergy;if(synergy!==undefined){if(this.game.summoning.isSynergyUnlocked(synergy)){return synergy.description;}
else{return getLangString('MENU_TEXT','LOCKED');}}
else{return '';}}
get numEquipSets(){return Math.max(this.modifiers.increasedEquipmentSets+1,1);}
get maxPrayerCost(){let max=0;this.activePrayers.forEach((prayer)=>{max=Math.max(max,this.computePrayerMaxCost(prayer));});return max;}
get pets(){return this._pets;}
set pets(value){this._pets=value;if(this._pets%95===0){this.manager.bank.addItemByID("melvorD:Cool_Glasses",1,true,true);}}
get bigOlRonModifiers(){let mult=Math.floor(Math.min(this.target.levels.Hitpoints,1000)/200);if(this.manager.enemy.isBoss)
mult*=2;return{increasedMeleeStrengthBonus:9*mult,increasedMinHitBasedOnMaxHit:3*mult,increasedDamageReduction:mult,};}
get useCombinationRunes(){return this.game.settings.useCombinationRunes;}
get allowRegen(){return this.game.currentGamemode.hasRegen&&this.modifiers.disableHPRegeneration<1;}
get addItemsToBankOnLoadFail(){return true;}
setDefaultAttackStyles(){this.attackStyles.melee=this.game.attackStyles.find((style)=>style.attackType==='melee');this.attackStyles.ranged=this.game.attackStyles.find((style)=>style.attackType==='ranged');this.attackStyles.magic=this.game.attackStyles.find((style)=>style.attackType==='magic');}
setCallbacks(){combatMenus.combatFood.setCallbacks(this);combatMenus.thievingFood.setCallbacks(this);combatMenus.prayer.setMenuCallbacks(this);combatMenus.spells.standard.setMenuCallbacks(this);combatMenus.spells.curse.setMenuCallbacks(this);combatMenus.spells.aurora.setMenuCallbacks(this);combatMenus.spells.ancient.setMenuCallbacks(this);this.setAttackStyleButtonCallbacks();}
initialize(){this.computeAllStats();}
registerStatProvider(provider){if(this.statProviders.has(provider))
throw new Error('Stat Provider is already registered.');this.statProviders.add(provider);}
setRenderAll(){super.setRenderAll();this.rendersRequired.prayerPoints=true;this.rendersRequired.prayerSelection=true;this.rendersRequired.spellSelection=true;this.rendersRequired.curseSelection=true;this.rendersRequired.auroraSelection=true;this.rendersRequired.ancientSelection=true;this.rendersRequired.archaicSelection=true;this.rendersRequired.attackStyle=true;this.rendersRequired.equipment=true;this.rendersRequired.food=true;this.rendersRequired.combatLevel=true;this.rendersRequired.summonBar=true;this.rendersRequired.attacks=true;this.rendersRequired.equipmentSets=true;this.rendersRequired.runesUsed=true;this.rendersRequired.autoEat=true;this.rendersRequired.combatTriangle=true;this.rendersRequired.levels=true;}
activeTick(){super.activeTick();this.timers.summon.tick();}
getErrorLog(){let log=super.getErrorLog();log+=`\nActive Prayers:`;if(this.activePrayers.size){this.activePrayers.forEach((prayer)=>{log+=`${prayer.id}, `;});}
else{log+=' None';}
log+='\nEquipped Food:';this.food.slots.forEach((slot)=>{if(slot.item!==this.game.emptyFoodItem)
log+=`\nItem: ${slot.item.id}, Qty: ${slot.quantity}`;});return log;}
getMonsterSpawnTime(){let spawnTime=this.baseSpawnInterval;spawnTime-=this.modifiers.decreasedMonsterRespawnTimer;spawnTime+=this.modifiers.increasedMonsterRespawnTimer;return spawnTime;}
isEquipmentSlotUnlocked(slot){switch(slot){case 'Passive':{const itm=this.game.dungeons.getObjectByID("melvorF:Into_the_Mist");return itm!==undefined&&this.game.combat.getDungeonCompleteCount(itm)>0;}
default:return true;}}
checkEquipmentSetsForItem(item){return this.equipmentSets.some(({equipment})=>equipment.checkForItem(item));}
checkEquipmentRequirements(){const itemsToAdd=new Map();this.equipmentSets.forEach(({equipment})=>{const slotsToRemove=[];equipment.slotArray.forEach((slot)=>{var _a;if(slot.providesStats){if(!this.game.checkRequirements(slot.item.equipRequirements)||!slot.item.validSlots.includes(slot.type)){itemsToAdd.set(slot.item,((_a=itemsToAdd.get(slot.item))!==null&&_a!==void 0?_a:0)+slot.quantity);slotsToRemove.push(slot.type);}}});slotsToRemove.forEach((slotType)=>equipment.unequipItem(slotType));});itemsToAdd.forEach((quantity,item)=>this.game.bank.addItem(item,quantity,false,false,true));if(itemsToAdd.size>0){this.updateForEquipmentChange();this.updateForEquipSetChange();}}
modifyDamageReduction(reduction){if(this.manager.fightInProgress){reduction-=this.target.modifiers.decreasedPlayerDamageReduction;if(this.isDotActive('Bleed'))
reduction-=this.target.modifiers.reducedTargetDamageRedcutionIfBleeding;if(this.manager.enemy.isBoss)
reduction+=this.modifiers.increasedDamageReductionAgainstBosses-this.modifiers.decreasedDamageReductionAgainstBosses;}
if(this.manager.onSlayerTask){reduction+=this.modifiers.increasedDamageReductionAgainstSlayerTasks;}
if(this.attackType==='magic'&&this.equipment.isWeapon2H)
reduction+=this.modifiers.increasedDamageReductionWithMagic2HWeapon-
this.modifiers.decreasedDamageReductionWithMagic2HWeapon;reduction=super.modifyDamageReduction(reduction);if(this.manager.fightInProgress)
reduction*=this.activeTriangle.reductionModifier[this.attackType][this.target.attackType];return reduction;}
computeAllStats(){this.computeItemSynergies();this.computeSummoningSynergy();this.computeConditionalListeners();this.computeItemEffectList();this.checkItemEffects();super.computeAllStats();this.computeRuneProvision();this.updateEquipmentSets();}
computeCombatStats(){this.computeSummonMaxHit();super.computeCombatStats();this.rendersRequired.autoEat=true;}
computeItemEffectList(){this.itemEffects.clear();this.equipment.slotArray.forEach((slot)=>{if(slot.providesStats){const item=slot.item;if(item.fightEffects!==undefined){item.fightEffects.forEach((itemEffect)=>this.itemEffects.add(itemEffect));}}});}
applyItemEffects(){if(!this.manager.fightInProgress)
return;this.itemEffects.forEach(({effect})=>{this.applyEffect(effect,this,0,this.game.itemEffectAttack);});}
checkItemEffects(){if(!this.manager.fightInProgress)
return;this.game.itemEffectAttack.itemEffects.forEach((itemEffect)=>{const shouldBeActive=this.itemEffects.has(itemEffect);const effect=itemEffect.effect;switch(effect.type){case 'Combo':{const activeEffect=this.comboEffects.get(effect);if(!shouldBeActive&&activeEffect!==undefined){this.modifiers.subModifiers(effect.modifiers,activeEffect.stacks,activeEffect.stacks);this.effectRenderer.queueRemoval(activeEffect);this.rendersRequired.effects=true;this.comboEffects.delete(effect);}}
break;case 'Modifier':{const attackMap=this.getModifierEffectAttackMap(effect);const effectMap=attackMap.get(this.game.itemEffectAttack);if(effectMap===undefined)
return;const activeEffect=effectMap.get(effect);if(!shouldBeActive&&activeEffect!==undefined){this.modifiers.subModifiers(effect.modifiers);this.effectRenderer.queueRemoval(activeEffect);this.rendersRequired.effects=true;effectMap.delete(effect);if(effectMap.size===0)
attackMap.delete(this.game.itemEffectAttack);}}
break;case 'Reflexive':{const activeEffect=this.reflexiveEffects.get(effect);if(shouldBeActive&&activeEffect===undefined&&effect.turns===Infinity){this.applyEffect(effect,this.target,0,this.game.itemEffectAttack);}
else if(!shouldBeActive&&activeEffect!==undefined){this.modifiers.subModifiers(effect.modifiers,activeEffect.stacks,activeEffect.stacks);this.effectRenderer.queueRemoval(activeEffect);this.rendersRequired.effects=true;this.reflexiveEffects.delete(effect);}}
break;}});}
resetPrimarySpell(){this.spellSelection.standard=this.game.standardSpells.firstObject;this.spellSelection.ancient=undefined;this.spellSelection.archaic=undefined;this.rendersRequired.spellSelection=true;this.rendersRequired.archaicSelection=true;this.rendersRequired.ancientSelection=true;this.rendersRequired.runesUsed=true;}
checkMagicUsage(){const validateSpell=(spell)=>{if(spell!==undefined&&spell.requiredItem!==undefined&&!this.equipment.checkForItem(spell.requiredItem))
this.resetPrimarySpell();};validateSpell(this.spellSelection.standard);validateSpell(this.spellSelection.ancient);validateSpell(this.spellSelection.archaic);const allowMagic=this.attackType==='magic'||this.modifiers.allowAttackAugmentingMagic>0;this.canCurse=(allowMagic||this.modifiers.allowNonMagicCurses>0)&&!this.usingAncient;this.canAurora=allowMagic;const curse=this.spellSelection.curse;if(curse!==undefined&&(!this.canCurse||(curse.requiredItem!==undefined&&!this.equipment.checkForItem(curse.requiredItem)))){this.spellSelection.curse=undefined;this.rendersRequired.curseSelection=true;this.rendersRequired.runesUsed=true;}
const aurora=this.spellSelection.aurora;if(aurora!==undefined&&(!this.canAurora||(aurora.requiredItem!==undefined&&!this.equipment.checkForItem(aurora.requiredItem)))){this.spellSelection.aurora=undefined;this.rendersRequired.auroraSelection=true;this.rendersRequired.runesUsed=true;}}
computeLevels(){const getEffectiveLevel=(skill)=>{return skill.level+this.modifiers.getHiddenSkillLevels(skill);};this.levels.Hitpoints=getEffectiveLevel(this.game.hitpoints);this.levels.Attack=getEffectiveLevel(this.game.attack);this.levels.Strength=getEffectiveLevel(this.game.strength);this.levels.Defence=getEffectiveLevel(this.game.defence);this.levels.Ranged=getEffectiveLevel(this.game.ranged);this.levels.Magic=getEffectiveLevel(this.game.altMagic);this.levels.Prayer=getEffectiveLevel(this.game.prayer);}
getAccuracyValues(){var _a;let effectiveLevel=0;let accuracyBonus=0;let twoHandModifier=1;if(this.equipment.isWeapon2H)
twoHandModifier=2;switch(this.attackType){case 'melee':effectiveLevel=this.levels.Attack;switch((_a=this.attackStyles.melee)===null||_a===void 0?void 0:_a.id){case "melvorD:Stab":accuracyBonus=this.equipmentStats.stabAttackBonus+this.modifiers.increasedFlatStabAttackBonus;break;case "melvorD:Block":accuracyBonus=this.equipmentStats.blockAttackBonus+this.modifiers.increasedFlatBlockAttackBonus;break;case "melvorD:Slash":accuracyBonus=this.equipmentStats.slashAttackBonus+this.modifiers.increasedFlatSlashAttackBonus;break;}
accuracyBonus+=(this.modifiers.increasedFlatMeleeAccuracyBonusPerAttackInterval-
this.modifiers.decreasedFlatMeleeAccuracyBonusPerAttackInterval)*Math.floor(this.stats.attackInterval/100)*twoHandModifier;break;case 'magic':effectiveLevel=this.levels.Magic;accuracyBonus=this.equipmentStats.magicAttackBonus+this.modifiers.increasedFlatMagicAttackBonus;accuracyBonus+=(this.modifiers.increasedFlatMagicAccuracyBonusPerAttackInterval-
this.modifiers.decreasedFlatMagicAccuracyBonusPerAttackInterval)*Math.floor(this.stats.attackInterval/100)*twoHandModifier;break;case 'ranged':effectiveLevel=this.levels.Ranged;accuracyBonus=this.equipmentStats.rangedAttackBonus+this.modifiers.increasedFlatRangedAttackBonus;if(this.manager.fightInProgress){if(this.equipment.slots.Weapon.item.id==="melvorF:Stormsnap"){accuracyBonus+=Math.floor(124*(1+(this.target.levels.Magic*6)/5500));}}
accuracyBonus+=(this.modifiers.increasedFlatRangedAccuracyBonusPerAttackInterval-
this.modifiers.decreasedFlatRangedAccuracyBonusPerAttackInterval)*Math.floor(this.stats.attackInterval/100)*twoHandModifier;break;default:throw new Error(`Invalid attacktype set: ${this.attackType}`);}
return{effectiveLevel:effectiveLevel,bonus:accuracyBonus,};}
computeAttackSelection(){var _a,_b;this.rendersRequired.attacks=true;if(this.attackType==='magic'){const spell=(_b=(_a=this.spellSelection.ancient)!==null&&_a!==void 0?_a:this.spellSelection.standard)!==null&&_b!==void 0?_b:this.spellSelection.archaic;if(spell!==undefined&&spell.specialAttack!==undefined){this.availableAttacks=[{attack:spell.specialAttack,chance:100,},];return;}}
this.availableAttacks=[];this.equipment.slotArray.forEach((slot)=>{if(!slot.providesStats)
return;this.getSlotAttacks(slot).forEach((attack,id)=>{if(attack.attackTypes===undefined||attack.attackTypes.has(this.attackType)){let chance=attack.defaultChance;if(slot.item.overrideSpecialChances!==undefined)
chance=slot.item.overrideSpecialChances[id];this.availableAttacks.push({attack:attack,chance:chance,});}});});const totalChance=this.availableAttacks.reduce((prev,attack)=>{return prev+attack.chance;},0);if(totalChance<100){this.availableAttacks.push({attack:this.game.normalAttack,chance:100-totalChance,});}
else if(totalChance>100){const ratio=100/totalChance;this.availableAttacks.forEach((attack)=>(attack.chance*=ratio));}}
getSlotAttacks(slot){return slot.item.specialAttacks;}
computeRuneProvision(){this.runesProvided.clear();this.equipment.slotArray.forEach((slot)=>{if(slot.providesStats&&slot.item.providedRunes.length>0){slot.item.providedRunes.forEach(({item,quantity})=>{var _a;quantity*=Math.pow(2,this.modifiers.increasedRuneProvision);const newQuantity=((_a=this.runesProvided.get(item))!==null&&_a!==void 0?_a:0)+quantity;this.runesProvided.set(item,newQuantity);});}});}
rollToHit(target,attack){return(this.game.checkRequirements(this.manager.areaRequirements,false,this.manager.slayerAreaLevelReq)&&super.rollToHit(target,attack));}
damage(amount,source,thieving=false){super.damage(amount,source);if(!thieving){this.addPrayerPointsBasedOnDamage(amount);this.manager.addMonsterStat(MonsterStats.DamageDealtToPlayer,amount);this.manager.addCombatStat(CombatStats.DamageTaken,amount);this.trackArmourStat(ItemStats.DamageTaken,amount);}
if(this.hitpoints>0){this.autoEat();if(this.hitpoints<(this.stats.maxHitpoints*this.modifiers.increasedRedemptionThreshold)/100){this.heal(applyModifier(this.stats.maxHitpoints,this.modifiers.increasedRedemptionPercent));}}}
addPrayerPointsBasedOnDamage(amount){let percent=0;percent+=this.modifiers.increasedDamageTakenAddedAsPrayerPoints;percent-=this.modifiers.decreasedDamageTakenAddedAsPrayerPoints;if(percent>0){this.addPrayerPoints(Math.floor(amount*(percent/100)));}}
addHitpoints(amount){super.addHitpoints(amount);this.game.renderQueue.title=true;}
setHitpoints(value){super.setHitpoints(value);this.game.renderQueue.title=true;}
updateHPConditionals(computeStats=true){this.updateConditionals('PlayerHitpoints',computeStats,true);super.updateHPConditionals(computeStats);}
autoEat(foodSwapped=false){if((this.hitpoints<=this.autoEatThreshold||foodSwapped)&&this.food.currentSlot.item!==this.game.emptyFoodItem){const autoEatHealing=Math.floor((this.getFoodHealing(this.food.currentSlot.item)*this.autoEatEfficiency)/100);let foodQty=Math.ceil((this.autoEatHPLimit-this.hitpoints)/autoEatHealing);foodQty=Math.min(foodQty,this.food.currentSlot.quantity);this.eatFood(foodQty,false,this.autoEatEfficiency);if(this.food.currentSlot.quantity<1&&this.modifiers.autoSwapFoodUnlocked>0&&this.game.settings.enableAutoSwapFood){const nonEmptySlot=this.food.slots.findIndex((slot)=>slot.item!==this.game.emptyFoodItem);if(nonEmptySlot>=0){this.food.setSlot(nonEmptySlot);if(this.hitpoints<this.autoEatHPLimit)
this.autoEat(true);}}}}
getRuneCosts(spell){let runeCost=spell.runesRequired;const spellCost=[];if(this.useCombinationRunes&&spell.runesRequiredAlt!==undefined)
runeCost=spell.runesRequiredAlt;runeCost.forEach((cost)=>{var _a;const reducedCost=cost.quantity-((_a=this.runesProvided.get(cost.item))!==null&&_a!==void 0?_a:0);if(reducedCost>0){spellCost.push({item:cost.item,quantity:reducedCost,});}});return spellCost;}
castCurseSpell(target,curse){if(target.isCursed||target.modifiers.curseImmunity>0)
return;const runeCosts=this.getRuneCosts(curse);if(this.manager.bank.checkForItems(runeCosts)){this.consumeRunes(runeCosts);super.castCurseSpell(target,curse);}
else{this.toggleCurse(curse,false);this.manager.notifications.add({type:'Player',args:[this.game.altMagic,getLangString('TOASTS','RUNES_REQUIRED_CURSE'),'danger'],});}}
onMagicAttackFailure(){this.manager.notifications.add({type:'Player',args:[this.game.altMagic,getLangString('TOASTS',this.useCombinationRunes?'NOT_ENOUGH_COMBO_RUNES':'NOT_ENOUGH_STANDARD_RUNES'),'danger',],});}
onRangedAttackFailure(quiver){let message;if(quiver===this.game.emptyEquipmentItem)
message=getLangString('TOASTS','NO_AMMO');else
message=getLangString('TOASTS','WRONG_AMMO');this.manager.notifications.add({type:'Player',args:[this.game.ranged,message,'danger'],});}
rewardForDamage(damage){this.rewardXPAndPetsForDamage(damage);this.rewardCurrencyForDamage(damage);this.trackWeaponStat(ItemStats.DamageDealt,damage);}
attack(target,attack){const attackEvent=new PlayerAttackEvent(attack,this.attackType);let canAttack=true;let runeCosts=[];const weapon=this.equipment.slots.Weapon.item;const quiver=this.equipment.slots.Quiver.item;if(this.attackCount===0||(this.attackCount>0&&this.attackType==='magic'&&attack.usesRunesPerProc)){switch(this.attackType){case 'magic':{let spell;if(this.spellSelection.ancient!==undefined)
spell=this.spellSelection.ancient;else if(this.spellSelection.standard!==undefined)
spell=this.spellSelection.standard;else if(this.spellSelection.archaic!==undefined)
spell=this.spellSelection.archaic;else
throw new Error('No spell is selected.');runeCosts=this.getRuneCosts(spell);if(attack.extraRuneConsumption!==undefined)
runeCosts.push(...attack.extraRuneConsumption);if(this.manager.bank.checkForItems(runeCosts)){this.consumeRunes(runeCosts);}
else{canAttack=false;this.onMagicAttackFailure();}
break;}
case 'ranged':{if(weapon.ammoTypeRequired===4)
break;if(weapon.ammoTypeRequired!==quiver.ammoType){this.onRangedAttackFailure(quiver);canAttack=false;}
break;}}}
if(this.canAurora&&this.spellSelection.aurora!==undefined){const auroraCosts=this.getRuneCosts(this.spellSelection.aurora);if(this.manager.bank.checkForItems(auroraCosts)){this.consumeRunes(auroraCosts);}
else{this.toggleAurora(this.spellSelection.aurora,false);this.manager.notifications.add({type:'Player',args:[this.game.altMagic,getLangString('TOASTS','RUNES_REQUIRED_AURORA'),'danger'],});}}
let damage=0;if(canAttack)
damage=super.attack(target,attack);else{this.isAttacking=false;return damage;}
if(damage>0){this.rewardForDamage(damage);}
if(this.attackCount===1||(attack.usesPrayerPointsPerProc&&attack.attackCount>1)){this.activePrayers.forEach((prayer)=>{this.consumePrayerPoints(prayer.pointsPerPlayer);});}
if(this.attackCount===1||(attack.usesPotionChargesPerProc&&attack.attackCount>1)){this.processCombatEvent(attackEvent,this.timers.act.maxTicks*TICK_INTERVAL);}
if(this.attackCount===1){switch(this.attackType){case 'ranged':if(weapon.ammoTypeRequired!==4)
this.consumeAmmo();break;}
const healing=Math.floor((this.modifiers.increasedHealingOnAttackBasedOnDR/100)*this.stats.damageReduction*numberMultiplier);if(healing>0)
this.heal(healing);}
return damage;}
lifesteal(attack,damage){const healing=super.lifesteal(attack,damage);if(!this.game.isGolbinRaid){const scToAdd=((healing/numberMultiplier)*this.modifiers.increasedSCfromLifesteal)/100;if(scToAdd>0){this.game.slayerCoins.add(scToAdd);}}
return healing;}
rewardForSummonDamage(damage){this.rewardCurrencyForSummonDamage(damage);}
summonAttack(){const event=new PlayerSummonAttackEvent();const targetImmune=this.target.isImmuneTo(this.attackType);if(this.game.checkRequirements(this.manager.areaRequirements,false,this.manager.slayerAreaLevelReq)&&(rollPercentage(this.hitchance)||this.target.stun.turns>0||this.target.sleep.turns>0)&&!targetImmune){let damage=rollInteger(1,this.stats.summoningMaxHit);damage=this.applyTriangleToDamage(this.target,damage);damage*=1-this.target.stats.damageReduction/100;damage=Math.min(damage,this.target.hitpoints);damage=Math.floor(damage);this.target.damage(damage,'Attack');const lifesteal=Math.floor((this.modifiers.increasedSummoningAttackLifesteal/100)*damage);if(lifesteal>0)
this.heal(lifesteal);if(damage>0)
this.rewardForSummonDamage(damage);event.damage=damage;}
else{this.target.fireMissSplash(targetImmune);event.missed=true;}
this.processCombatEvent(event,this.summonAttackInterval);this.startSummonAttack();}
startSummonAttack(tickOffset=false){if(this.stats.summoningMaxHit>0){this.timers.summon.start(this.summonAttackInterval,tickOffset);this.rendersRequired.summonBar=true;}}
postAttack(attack,attackType){const enemyAttackEvent=new EnemyAttackEvent(attack,attackType);this.activePrayers.forEach((prayer)=>{if(prayer.id==="melvorF:Protect_Item"&&this.modifiers.freeProtectItem>0)
return;this.consumePrayerPoints(prayer.pointsPerEnemy);});this.processCombatEvent(enemyAttackEvent);this.trackWeaponStat(ItemStats.TotalAttacks);}
onHit(){this.manager.addMonsterStat(MonsterStats.HitsFromPlayer);let gpToAdd=this.modifiers.increasedGPOnEnemyHit-this.modifiers.decreasedGPOnEnemyHit;if(this.modifiers.increasedGPBasedOnEnemyCombatLevel>0&&this.firstHit&&this.manager.enemy.monster!==undefined)
gpToAdd+=this.manager.enemy.monster.combatLevel;if(gpToAdd>0){gpToAdd=applyModifier(gpToAdd,this.modifiers.increasedCombatGP);this.game.gp.add(gpToAdd);this.game.stats.Combat.add(CombatStats.GPEarned,gpToAdd);}
if(this.modifiers.healOnHitBasedOnTargetDR>0&&this.firstHit){const healing=Math.floor((this.modifiers.healOnHitBasedOnTargetDR*numberMultiplier*this.target.equipmentStats.damageReduction)/100);this.heal(healing);}
if(this.manager.onSlayerTask&&this.modifiers.increasedSlayerCoinsBasedOnTargetDR>0&&this.target.equipmentStats.damageReduction>0)
this.game.slayerCoins.add(applyModifier(this.target.equipmentStats.damageReduction,this.modifiers.increasedSlayerCoinsBasedOnTargetDR,3));}
onBeingHit(){if(this.target.firstHit){let gpToAdd=this.modifiers.increasedGPWhenHitBasedOnDR*this.stats.damageReduction;if(gpToAdd>0){gpToAdd=applyModifier(gpToAdd,this.modifiers.increasedGPGlobal-this.modifiers.decreasedGPGlobal);this.game.gp.add(gpToAdd);this.game.stats.Combat.add(CombatStats.GPEarned,gpToAdd);}}
if(this.modifiers.increasedPrayerPointsWhenHit>0)
this.addPrayerPoints(this.modifiers.increasedPrayerPointsWhenHit);if(this.modifiers.shadowCloak>0)
this.applyModifierEffect(shadowCloakEffect,this.target,this.game.normalAttack);if(this.modifiers.increased5DROnBeingHit>0)
this.applyModifierEffect(increased5DROnHitEffect,this,this.game.normalAttack);super.onBeingHit();}
applyOnBeingHitEffects(){}
onMiss(){this.manager.addMonsterStat(MonsterStats.PlayerMissed);this.trackWeaponStat(ItemStats.MissedAttacks);this.manager.addCombatStat(CombatStats.AttacksMissed);}
trackWeaponStat(stat,amount=1){const weapon=this.equipment.slots.Weapon.item;const quiver=this.equipment.slots.Quiver.item;if(weapon!==this.game.emptyEquipmentItem){this.addItemStat(weapon,stat,amount);}
if(this.attackType==='ranged'&&quiver!==this.game.emptyEquipmentItem&&quiver!==weapon){this.addItemStat(quiver,stat,amount);}}
trackArmourStat(stat,amount=1){this.equipment.slotArray.forEach((slot)=>{if(slot.type!=='Quiver'&&slot.type!=='Weapon'&&slot.providesStats){this.addItemStat(slot.item,stat,amount);}});}
addItemStat(item,stat,amount){this.game.stats.Items.add(item,stat,amount);}
consumeRunes(costs){const event=new RuneConsumptionEvent(costs);if(!rollPercentage(this.modifiers.runePreservationChance)){this.manager.bank.consumeItems(costs);this.trackItemUsage(costs);event.preserved=false;}
this.processCombatEvent(event);}
consumeEquipmentCharges(event,interval){this.equipment.itemChargeUsers.forEach((slot)=>{var _a;if((_a=slot.item.consumesChargesOn)===null||_a===void 0?void 0:_a.some((matcher)=>matcher.doesEventMatch(event))){this.game.itemCharges.removeCharges(slot.item,1);}});this.equipment.itemQuantityUsers.forEach((slot)=>{var _a;if((_a=slot.item.consumesOn)===null||_a===void 0?void 0:_a.some((matcher)=>matcher.doesEventMatch(event))){if(slot.type==='Summon1'||slot.type==='Summon2'){this.removeSummonCharge(slot.type,interval);}
else{if(this.equipment.removeQuantityFromSlot(slot.type,1)){this.computeAllStats();}
this.rendersRequired.equipment=true;}}});this.equipment.bankItemUsers.forEach((slot)=>{if(slot.item.consumesItemOn&&this.manager.bank.hasItem(slot.item.consumesItemOn.item)&&rollPercentage(slot.item.consumesItemOn.chance)&&slot.item.consumesItemOn.matchers.some((matcher)=>matcher.doesEventMatch(event))){this.manager.bank.removeItemQuantity(slot.item.consumesItemOn.item,1,true);}});if(this.activeSummoningSynergy!==undefined&&this.activeSummoningSynergy.consumesOn.some((matcher)=>matcher.doesEventMatch(event))){this.removeSummonCharge('Summon1',interval);this.removeSummonCharge('Summon2',interval);}}
removeFromQuiver(qty=1){if(this.equipment.removeQuantityFromSlot('Quiver',qty))
this.computeAllStats();this.rendersRequired.equipment=true;}
removeFromConsumable(qty=1){if(this.equipment.removeQuantityFromSlot('Consumable',qty))
this.computeAllStats();this.rendersRequired.equipment=true;}
consumeAmmo(){if(!rollPercentage(this.modifiers.ammoPreservationChance)){this.trackItemUsage([{item:this.equipment.slots.Quiver.item,quantity:1}]);this.removeFromQuiver(1);}}
trackItemUsage(costs){costs.forEach((cost)=>{this.addItemStat(cost.item,ItemStats.AmountUsedInCombat,cost.quantity);});}
applyDOT(effect,target,damageDealt){const applied=super.applyDOT(effect,target,damageDealt);if(applied)
this.updateConditionals('EnemyDOT',true,true);return applied;}
getFlatReflectDamage(){const maxRoll=this.modifiers.getFlatReflectDamage()*numberMultiplier;return rollInteger(1,maxRoll);}
applyDamageModifiers(target,damage){damage=this.applyTriangleToDamage(target,damage);if(this.usingAncient){return damage;}
else{return super.applyDamageModifiers(target,damage);}}
applyTriangleToDamage(target,damage){if(this.manager.fightInProgress)
damage*=this.activeTriangle.damageModifier[this.attackType][target.attackType];return damage;}
getDamageModifiers(target){let totalModifier=0;if(this.manager.enemy.isBoss){totalModifier+=this.modifiers.increasedDamageToBosses;totalModifier-=this.modifiers.decreasedDamageToBosses;}
if(this.manager.onSlayerTask){totalModifier+=this.modifiers.increasedDamageToSlayerTasks;totalModifier-=this.modifiers.decreasedDamageToSlayerTasks;}
switch(this.manager.areaType){case CombatAreaType.Combat:totalModifier+=this.modifiers.increasedDamageToCombatAreaMonsters;totalModifier-=this.modifiers.decreasedDamageToCombatAreaMonsters;break;case CombatAreaType.Dungeon:totalModifier+=this.modifiers.increasedDamageToDungeonMonsters;totalModifier-=this.modifiers.decreasedDamageToDungeonMonsters;break;case CombatAreaType.Slayer:totalModifier+=this.modifiers.increasedDamageToSlayerAreaMonsters;totalModifier-=this.modifiers.decreasedDamageToSlayerAreaMonsters;break;}
totalModifier+=this.modifiers.increasedDamageToAllMonsters-this.modifiers.decreasedDamageToAllMonsters;return super.getDamageModifiers(target)+totalModifier;}
quickEquipItem(item,skill){let quantity=this.manager.bank.getQty(item);const templateData={itemName:item.name,quantity:`${quantity}`};if(quantity>0){if(!equipmentSlotData[item.validSlots[0]].allowQuantity)
quantity=1;this.equipItem(item,this.selectedEquipmentSet,'Default',quantity);if(this.equipment.checkForItem(item)){if(quantity>1){notifyPlayer(skill,templateLangString('TOASTS','ITEM_QTY_EQUIPPED',templateData),'success');}
else{notifyPlayer(skill,templateLangString('TOASTS','ITEM_EQUIPPED',templateData),'success');}}
else
notifyPlayer(skill,templateLangString('TOASTS','CANT_EQUIP_ITEM',templateData),'danger');}
else if(this.equipment.checkForItem(item))
notifyPlayer(skill,templateLangString('TOASTS','ITEM_ALREADY_EQUIPPED',templateData),'info');else
notifyPlayer(skill,templateLangString('TOASTS','ITEM_NOT_IN_BANK',templateData),'danger');}
equipCallback(item,slot,quantity=1){this.equipItem(item,this.equipToSet,slot,quantity);}
quickEquipSynergy(synergy){const mark1=synergy.summons[0].product;const mark2=synergy.summons[1].product;const summon1Slot=this.equipment.getSlotOfItem(mark1);const summon2Slot=this.equipment.getSlotOfItem(mark2);const otherSlot=(slot)=>{return slot==='Summon1'?'Summon2':'Summon1';};const equipArgs=[];if(summon1Slot==='None'&&summon2Slot!=='None'){equipArgs.push([mark1,this.selectedEquipmentSet,otherSlot(summon2Slot),69696969]);}
else if(summon1Slot!=='None'&&summon2Slot==='None'){equipArgs.push([mark2,this.selectedEquipmentSet,otherSlot(summon1Slot),69696969]);}
else if(summon1Slot==='None'&&summon2Slot==='None'){equipArgs.push([mark1,this.selectedEquipmentSet,'Summon1',69696969],[mark2,this.selectedEquipmentSet,'Summon2',69696969]);}
if(summon1Slot!=='None'&&summon2Slot!=='None'){notifyPlayer(this.game.summoning,getLangString('TOASTS','SYNERGY_ALREADY_EQUIPPED'),'success');}
else{const success=equipArgs.every((arg)=>{const ownedQuantity=this.manager.bank.getQty(arg[0]);if(ownedQuantity===0)
notifyPlayer(this.game.summoning,templateLangString('TOASTS','NO_TABLETS',{itemName:arg[0].name}),'danger');return ownedQuantity>0;});if(success){equipArgs.forEach((arg)=>{this.equipItem(...arg);});notifyPlayer(this.game.summoning,getLangString('TOASTS','SYNERGY_EQUIPPED'),'success');}}}
changeEquipmentSet(setID){if(this.equipmentSets.length<=setID)
throw new Error(`Invalid equipment set id: ${setID}`);if(!this.checkIfCantEquip()){this.selectedEquipmentSet=setID;this.updateForEquipmentChange();this.rendersRequired.prayerSelection=true;this.rendersRequired.spellSelection=true;this.rendersRequired.ancientSelection=true;this.rendersRequired.archaicSelection=true;this.rendersRequired.auroraSelection=true;this.rendersRequired.curseSelection=true;this.rendersRequired.runesUsed=true;}}
changeEquipToSet(setID){if(this.equipmentSets.length<=setID)
throw new Error(`Set ID exceed maximum equipment sets.`);this.equipToSet=setID;}
updateEquipmentSets(){while(this.numEquipSets>this.equipmentSets.length){const newSet=new EquipmentSet(this.game);newSet.spellSelection.standard=this.game.standardSpells.firstObject;this.equipmentSets.push(newSet);this.rendersRequired.equipmentSets=true;}
let setsExceedAmount=false;while(this.equipmentSets.length>this.numEquipSets){setsExceedAmount=true;const removedSet=this.equipmentSets.pop();if(removedSet===undefined)
throw new Error('Error updating equipment sets, number of sets is 0 or negative');removedSet.equipment.forceAddAllToBank();}
if(setsExceedAmount&&this.selectedEquipmentSet>=this.numEquipSets){this.changeEquipmentSet(0);}}
updateForEquipmentChange(){this.rendersRequired.equipment=true;this.computeAllStats();this.rendersRequired.attackStyle=true;this.rendersRequired.equipmentSets=true;this.game.renderQueue.activeSkills=true;this.interruptAttack();if(this.manager.fightInProgress)
this.target.combatModifierUpdate();this.render();this.manager.rendersRequired.spellBook=true;this.manager.rendersRequired.areaRequirements=true;this.game.woodcutting.onEquipmentChange();this.game.fishing.onEquipmentChange();this.game.firemaking.onEquipmentChange();this.game.cooking.onEquipmentChange();this.game.mining.onEquipmentChange();this.game.smithing.onEquipmentChange();this.game.thieving.onEquipmentChange();this.game.fletching.onEquipmentChange();this.game.crafting.onEquipmentChange();this.game.runecrafting.onEquipmentChange();this.game.herblore.onEquipmentChange();this.game.agility.onEquipmentChange();this.game.summoning.onEquipmentChange();this.game.astrology.onEquipmentChange();this.game.altMagic.onEquipmentChange();this.game.bank.onEquipmentChange();this.game.minibar.updateEquippedTicks();}
updateForEquipSetChange(){this.rendersRequired.equipmentSets=true;this.game.bank.onEquipmentChange();this.render();}
equipItem(item,set,slot='Default',quantity=1){const equipment=this.equipmentSets[set].equipment;if(this.checkIfCantEquip()){return false;}
if(slot==='Default'){slot=item.validSlots[0];}
if(!equipmentSlotData[slot].allowQuantity)
quantity=1;quantity=Math.min(this.manager.bank.getQty(item),quantity);if(quantity===0)
throw new Error('Tried to equip item when none is owned.');const existingSlot=equipment.getSlotOfItem(item);if(existingSlot!=='None'){if(equipmentSlotData[slot].allowQuantity&&existingSlot===slot){equipment.addQuantityToSlot(slot,quantity);this.game.bank.removeItemQuantity(item,quantity,false);this.rendersRequired.equipment=true;this.render();this.processCombatEvent(new ItemEquippedEvent(item,quantity));return true;}
else{notifyPlayer(this.game.attack,templateLangString('TOASTS','ITEM_ALREADY_EQUIPPED',{itemName:item.name}),'danger');return false;}}
if(!this.game.checkRequirements(item.equipRequirements,true))
return false;const itemsToAdd=equipment.getItemsAddedOnEquip(item,slot);let newBankSlotsUsed=itemsToAdd.length;let bankSlotsFreed=0;itemsToAdd.forEach((itemToAdd)=>{if(this.game.bank.hasItem(itemToAdd.item))
newBankSlotsUsed--;});if(this.manager.bank.getQty(item)===quantity)
bankSlotsFreed++;if(this.game.bank.maximumSlots>=this.game.bank.occupiedSlots+newBankSlotsUsed-bankSlotsFreed||newBankSlotsUsed===0){this.game.bank.removeItemQuantity(item,quantity,false);itemsToAdd.forEach((itemToAdd)=>{this.game.bank.addItem(itemToAdd.item,itemToAdd.quantity,false,false);});equipment.equipItem(item,slot,quantity);if(set===this.selectedEquipmentSet){this.updateForEquipmentChange();}
else{this.updateForEquipSetChange();}
this.processCombatEvent(new ItemEquippedEvent(item,quantity));return true;}
else{notifyPlayer(this.game.attack,getLangString('TOASTS','CANT_FIT_CURRENT_EQUIPMENT'),'danger');return false;}}
unequipCallback(slot){return()=>this.unequipItem(this.selectedEquipmentSet,slot);}
unequipItem(set,slot){if(this.checkIfCantEquip()){return false;}
const itemsToAdd=this.equipment.getItemsAddedOnUnequip(slot);const addResult=this.game.bank.addItem(itemsToAdd.item,itemsToAdd.quantity,false,false);if(addResult){this.equipment.unequipItem(slot);if(this.selectedEquipmentSet===set){this.updateForEquipmentChange();}
else{this.updateForEquipSetChange();}}
return addResult;}
autoEquipFood(item,quantity){const equipped=this.food.equip(item,quantity);if(equipped){const newItem=this.game.stats.itemFindCount(item)===0;this.game.stats.Items.add(item,ItemStats.TimesFound,quantity);if(newItem)
this.game.completion.updateItem(item);this.manager.notifications.add({type:'Item',args:[item,quantity],});const event=new FoodEquippedEvent(item,quantity);this.processCombatEvent(event);this.rendersRequired.food=true;}
return equipped;}
equipFood(item,quantity){if(this.checkIfCantEquip()){return;}
const equipped=this.food.equip(item,quantity);if(equipped){this.game.bank.removeItemQuantity(item,quantity,false);notifyPlayer(this.game.hitpoints,getLangString('TOASTS','FOOD_EQUIPPED'),'success');const event=new FoodEquippedEvent(item,quantity);this.processCombatEvent(event);this.renderFood();return true;}
else{notifyPlayer(this.game.hitpoints,getLangString('TOASTS','NEED_FREE_SLOT'),'danger');return false;}}
unequipFood(){const foodData=this.food.currentSlot;if(foodData.quantity===0){return;}
if(this.checkIfCantEquip()){return;}
const addResult=this.game.bank.addItem(foodData.item,foodData.quantity,false,false);if(addResult){this.food.unequipSelected();this.renderFood();}
else{notifyPlayer(this.game.attack,getLangString('TOASTS','NO_BANK_ROOM'),'danger');}}
selectFood(slotID){if(this.checkIfCantEquip()){return;}
this.food.setSlot(slotID);this.renderFood();}
eatFood(quantity=1,interrupt=true,efficiency=100){const item=this.food.currentSlot.item;if(this.stats.maxHitpoints===this.hitpoints||(item===this.game.emptyFoodItem&&(!this.game.settings.enableAutoSwapFood||this.modifiers.autoSwapFoodUnlocked<1))){return;}
else if(this.food.currentSlot.quantity<1&&this.modifiers.autoSwapFoodUnlocked>0&&this.game.settings.enableAutoSwapFood){const nonEmptySlot=this.food.slots.findIndex((slot)=>slot.item!==this.game.emptyFoodItem);if(nonEmptySlot>=0){this.food.setSlot(nonEmptySlot);}
else{return;}}
let healingAmount=quantity*Math.max(Math.floor((this.getFoodHealing(item)*efficiency)/100),1);healingAmount=this.heal(healingAmount);this.addItemStat(item,ItemStats.TimesEaten,quantity);this.manager.addCombatStat(CombatStats.FoodConsumed,quantity);this.addItemStat(item,ItemStats.HealedFor,healingAmount);this.manager.addCombatStat(CombatStats.HPFromFood,healingAmount);if(!rollPercentage(this.modifiers.increasedChanceToPreserveFood)){this.food.consume(quantity);this.rendersRequired.food=true;}
if(interrupt)
this.interruptAttack();this.processCombatEvent(new FoodEatenEvent(item,quantity,healingAmount));}
getFoodHealing(item){const value=item.healsFor*numberMultiplier;return applyModifier(value,this.getFoodHealingBonus(item));}
getFoodHealingBonus(item){let bonus=this.modifiers.increasedFoodHealingValue-this.modifiers.decreasedFoodHealingValue;bonus+=this.game.cooking.getMasteryHealingBonus(item);return bonus;}
startHoldToEat(){this.allowToEatFromTimeout=true;clearInterval(this.eatTimeout);this.eatTimeout=setInterval(()=>{if(this.allowToEatFromTimeout)
this.eatFood();this.render();},200);}
stopHoldToEat(){this.allowToEatFromTimeout=false;clearInterval(this.eatTimeout);this.eatTimeout=-1;}
interruptAttack(){if(this.manager.canInteruptAttacks){this.queueNextAction(true);this.startSummonAttack();}}
togglePrayer(prayer,render=true){let statUpdateRequired=false;if(this.activePrayers.has(prayer)){this.activePrayers.delete(prayer);statUpdateRequired=true;}
else if(this.activePrayers.size>=2){notifyPlayer(this.game.prayer,getLangString('TOASTS','MAX_PRAYERS_ACTIVE'),'danger');}
else if(this.computePrayerMaxCost(prayer)>this.prayerPoints){notifyPlayer(this.game.prayer,getLangString('TOASTS','NOT_ENOUGH_PP'),'danger');}
else{this.activePrayers.add(prayer);statUpdateRequired=true;}
if(statUpdateRequired){this.combatModifierUpdate();if(this.manager.fightInProgress)
this.target.combatModifierUpdate();this.game.renderQueue.activeSkills=true;this.rendersRequired.prayerSelection=true;if(render)
this.render();}}
toggleSpell(spell,render=true){if(this.spellSelection.ancient!==undefined){this.spellSelection.ancient=undefined;this.rendersRequired.ancientSelection=true;}
if(this.spellSelection.archaic!==undefined){this.spellSelection.archaic=undefined;this.rendersRequired.archaicSelection=true;}
if(spell!==this.spellSelection.standard){this.spellSelection.standard=spell;if(this.attackType==='magic'){this.computeAllStats();}
this.rendersRequired.spellSelection=true;this.rendersRequired.runesUsed=true;if(render)
this.render();}}
toggleCurse(spell,render=true){let renderRequired=false;if(this.spellSelection.ancient!==undefined){notifyPlayer(this.game.altMagic,getLangString('TOASTS','NO_CURSES_WITH_ANCIENT'),'danger');}
else if(spell===this.spellSelection.curse){this.spellSelection.curse=undefined;renderRequired=true;}
else if(this.canCurse){this.spellSelection.curse=spell;renderRequired=true;}
if(renderRequired){this.rendersRequired.curseSelection=true;this.rendersRequired.runesUsed=true;if(render)
this.render();}}
toggleAurora(spell,render=true){if(spell===this.spellSelection.aurora){this.spellSelection.aurora=undefined;}
else{if(!this.canAurora)
return;this.spellSelection.aurora=spell;}
this.rendersRequired.auroraSelection=true;this.rendersRequired.runesUsed=true;this.combatModifierUpdate();if(render)
this.render();}
toggleAncient(spell,render=true){if(this.spellSelection.standard!==undefined){this.spellSelection.standard=undefined;this.rendersRequired.spellSelection=true;}
if(this.spellSelection.curse!==undefined){this.spellSelection.curse=undefined;this.rendersRequired.curseSelection=true;}
if(this.spellSelection.archaic!==undefined){this.spellSelection.archaic=undefined;this.rendersRequired.archaicSelection=true;}
if(spell!==this.spellSelection.ancient){this.spellSelection.ancient=spell;if(this.attackType==='magic'){this.computeAllStats();}
this.rendersRequired.ancientSelection=true;if(render)
this.render();}
this.rendersRequired.runesUsed=true;}
toggleArchaic(spell,render=true){if(this.spellSelection.standard!==undefined){this.spellSelection.standard=undefined;this.rendersRequired.spellSelection=true;}
if(this.spellSelection.ancient!==undefined){this.spellSelection.ancient=undefined;this.rendersRequired.ancientSelection=true;}
if(spell!==this.spellSelection.archaic){this.spellSelection.archaic=spell;if(this.attackType==='magic'){this.computeAllStats();}
this.rendersRequired.archaicSelection=true;if(render)
this.render();}
this.rendersRequired.runesUsed=true;}
consumePrayerPoints(amount){if(amount>0){amount=this.applyModifiersToPrayerCost(amount);this.processCombatEvent(new PrayerPointConsumptionEvent(amount));this.prayerPoints-=amount;if(this.prayerPoints<0)
this.prayerPoints=0;this.trackPrayerStats(PrayerStats.PrayerPointsSpent,amount);this.rendersRequired.prayerPoints=true;if(this.prayerPoints<this.maxPrayerCost){this.disableActivePrayers();}}}
disableActivePrayers(){this.activePrayers.forEach((pID)=>{this.togglePrayer(pID,false);});}
addPrayerPoints(amount){this.prayerPoints+=amount;this.trackPrayerStats(PrayerStats.PrayerPointsEarned,amount);this.rendersRequired.prayerPoints=true;}
trackPrayerStats(stat,amount){this.game.stats.Prayer.add(stat,amount);}
applyCostModifiersToPrayerCost(amount){amount+=this.modifiers.decreasedFlatPrayerCostReduction;amount-=this.modifiers.increasedFlatPrayerCostReduction;amount=applyModifier(amount,this.modifiers.increasedPrayerCost-this.modifiers.decreasedPrayerCost);amount=Math.max(amount,1);return amount;}
applyPreservationToPrayerCost(amount){const preserveChance=this.modifiers.increasedChanceToPreservePrayerPoints+this.modifiers.decreasedChanceToPreservePrayerPoints;if(rollPercentage(preserveChance)){this.trackPrayerStats(PrayerStats.PrayerPointsPreserved,amount);amount=0;}
return amount;}
applyModifiersToPrayerCost(amount){amount=this.applyCostModifiersToPrayerCost(amount);amount=this.applyPreservationToPrayerCost(amount);return amount;}
computePrayerMaxCost(prayer){return this.applyCostModifiersToPrayerCost(Math.max(prayer.pointsPerEnemy,prayer.pointsPerPlayer,prayer.pointsPerRegen));}
renderPrayerPoints(){const text=numberWithCommas(this.prayerPoints);const bracket=`(${text})`;this.statElements.prayerPoints.forEach((elem)=>(elem.textContent=text));this.statElements.navPrayerPoints.forEach((elem)=>{elem.textContent=bracket;if(this.prayerPoints>0){elem.classList.add('text-success');elem.classList.remove('text-danger');}
else{elem.classList.add('text-danger');elem.classList.remove('text-success');}});this.rendersRequired.prayerPoints=false;}
renderPrayerSelection(){combatMenus.prayer.setActive(this.activePrayers,this);}
checkIfCantEquip(){let cantEquip=false;if(this.manager.areaType===CombatAreaType.Dungeon&&this.modifiers.dungeonEquipmentSwapping===0){cantEquip=true;notifyPlayer(this.game.attack,getLangString('TOASTS','CANNOT_DURING_DUNGEON'),'danger');}
else if(this.game.isGolbinRaid){cantEquip=true;notifyPlayer(this.game.attack,getLangString('TOASTS','CANNOT_DURING_RAID'),'danger');}
return cantEquip;}
computeEquipmentStats(){this.equipmentStats.resetStats();this.statProviders.forEach((provider)=>{if(provider.equipmentStats!==undefined)
this.equipmentStats.addStats(provider.equipmentStats);});this.equipment.addEquipmentStats(this.equipmentStats);this.activeItemSynergies.forEach((synergy)=>{if(synergy.equipmentStats!==undefined)
this.equipmentStats.addStats(synergy.equipmentStats);});this.activeSummonSlots=[];this.checkActiveSummon('Summon1');this.checkActiveSummon('Summon2');}
checkActiveSummon(slot){if(this.equipment.slots[slot].item.equipmentStats.some((statPair)=>statPair.key==='summoningMaxhit'))
this.activeSummonSlots.push(slot);}
computeMeleeMaxHit(){let strengthBonus=this.equipmentStats.meleeStrengthBonus+this.modifiers.increasedFlatMeleeStrengthBonus;let twoHandModifier=1;if(this.equipment.isWeapon2H)
twoHandModifier=2;strengthBonus+=(this.modifiers.increasedFlatMeleeStrengthBonusPerAttackInterval-
this.modifiers.decreasedFlatMeleeStrengthBonusPerAttackInterval)*Math.floor(this.stats.attackInterval/100)*twoHandModifier;const modifier=this.modifiers.meleeStrengthBonusModifier;strengthBonus=applyModifier(strengthBonus,modifier);return Character.calculateStandardMaxHit(this.levels.Strength,strengthBonus);}
computeRangedMaxHit(){let strengthBonus=this.equipmentStats.rangedStrengthBonus+this.modifiers.increasedFlatRangedStrengthBonus;let twoHandModifier=1;if(this.equipment.isWeapon2H)
twoHandModifier=2;strengthBonus+=(this.modifiers.increasedFlatMeleeStrengthBonusPerAttackInterval-
this.modifiers.decreasedFlatMeleeStrengthBonusPerAttackInterval)*Math.floor(this.stats.attackInterval/100)*twoHandModifier;let modifier=this.modifiers.rangedStrengthBonusModifier;if(this.manager.fightInProgress){const weaponID=this.equipment.slots.Weapon.item.id;if((this.manager.onSlayerTask||this.manager.areaType===CombatAreaType.Slayer)&&weaponID==="melvorF:Slayer_Crossbow")
modifier+=33;if(weaponID==="melvorF:Stormsnap"){strengthBonus+=Math.floor(129+(1+(this.target.levels.Magic*6)/33));}}
strengthBonus=applyModifier(strengthBonus,modifier);return Character.calculateStandardMaxHit(this.levels.Ranged,strengthBonus);}
computeMagicMaxHit(){var _a;if(this.spellSelection.ancient!==undefined){return numberMultiplier*this.spellSelection.ancient.specialAttack.damage[0].maxPercent;}
const spell=(_a=this.spellSelection.standard)!==null&&_a!==void 0?_a:this.spellSelection.archaic;if(spell!==undefined){let damageBonus=this.equipmentStats.magicDamageBonus;damageBonus=applyModifier(damageBonus,this.modifiers.magicDamageModifier);return Math.floor(numberMultiplier*spell.maxHit*(1+damageBonus/100)*(1+(this.levels.Magic+1)/200));}
else{return 0;}}
computeSummonMaxHit(){let maxHit=this.equipmentStats.summoningMaxhit;maxHit=applyModifier(maxHit,this.modifiers.increasedSummoningMaxHit-this.modifiers.decreasedSummoningMaxHit);this.stats.summoningMaxHit=maxHit;}
computeAttackType(){const item=this.equipment.slots.Weapon.item;if(item!==this.game.emptyEquipmentItem){if(item instanceof WeaponItem){this.attackType=item.attackType;}
else{throw new Error(`Equipped weapon ${item.name} is not a weapon!`);}}
else{this.attackType='melee';}
this.rendersRequired.combatTriangle=true;}
setAttackStyle(attackType,style){this.attackStyles[attackType]=style;if(attackType===this.attackType){this.rendersRequired.attackStyle=true;this.game.renderQueue.activeSkills=true;this.computeAllStats();this.render();}}
computeModifiers(){var _a;this.modifiers.reset();this.addProviderModifiers();this.addEquippedItemModifiers();this.addConditionalModifiers();this.addAttackStyleModifiers();this.addPassiveModifiers();this.addTargetModifiers();this.addPrayerModifiers();this.addGamemodeModifiers();this.checkMagicUsage();this.addAuroraModifiers();this.addCurseModifiers();this.addMiscModifiers();this.addSummonSynergyModifiers();this.addEffectModifiers();this.addMiscSummoningModifiers();this.addCombatAreaEffectModifiers();this.rendersRequired.autoEat=true;this.rendersRequired.activeSkillModifierChange=true;this.manager.rendersRequired.slayerAreaEffects=true;this.computeTargetModifiers();if(((_a=this.game.activeAction)===null||_a===void 0?void 0:_a.onModifierChangeWhileActive)!==undefined)
this.game.activeAction.onModifierChangeWhileActive();}
addProviderModifiers(){this.statProviders.forEach((provider)=>{if(provider.modifiers!==undefined)
this.modifiers.addMappedModifiers(provider.modifiers);});}
addAttackStyleModifiers(){if(this.attackStyle!==undefined)
this.modifiers.addModifiers(this.attackStyle.modifiers);}
addEquippedItemModifiers(){this.equipment.slotArray.forEach((slot)=>{const item=slot.item;if(slot.providesStats){if(item.modifiers!==undefined)
this.modifiers.addModifiers(item.modifiers);}});this.activeItemSynergies.forEach((synergy)=>{if(synergy.playerModifiers!==undefined)
this.modifiers.addModifiers(synergy.playerModifiers);});}
computeTargetModifiers(){if(this.manager.fightInProgress)
this.targetModifiers.subFromCombatModifiers(this.target.modifiers);this.targetModifiers.reset();this.statProviders.forEach((provider)=>{if(provider.enemyModifiers!==undefined)
this.targetModifiers.addTargetModifiers(provider.enemyModifiers);});this.equipment.slotArray.forEach((slot)=>{const item=slot.item;if(slot.providesStats){if(item.enemyModifiers!==undefined){this.targetModifiers.addModifiers(item.enemyModifiers);}}});this.activeItemSynergies.forEach((synergy)=>{if(synergy.enemyModifiers!==undefined)
this.targetModifiers.addModifiers(synergy.enemyModifiers);});const synergy=this.activeSummoningSynergy;if((synergy===null||synergy===void 0?void 0:synergy.enemyModifiers)!==undefined){this.targetModifiers.addModifiers(synergy.enemyModifiers);}
if(this.modifiers.decreasedSlayerTaskMonsterAccuracy>0&&this.manager.onSlayerTask){this.targetModifiers.addModifiers({decreasedGlobalAccuracy:this.modifiers.decreasedSlayerTaskMonsterAccuracy,});}
this.activePrayers.forEach((prayer)=>{if(prayer.enemyModifiers!==undefined)
this.targetModifiers.addModifiers(prayer.enemyModifiers);});this.addConditionalTargetModifiers();if(this.manager.fightInProgress)
this.targetModifiers.addToCombatModifiers(this.target.modifiers);}
computeItemSynergies(){this.activeItemSynergies.clear();const potentialSynergies=new Set();this.equipment.slotArray.forEach((slot)=>{if(slot.providesStats){const synergies=this.game.itemSynergies.get(slot.item);if(synergies!==undefined)
synergies.forEach((synergy)=>potentialSynergies.add(synergy));}});potentialSynergies.forEach((synergy)=>{if(this.equipment.checkForItemIDs(synergy.items))
this.activeItemSynergies.add(synergy);});}
computeSummoningSynergy(){this.activeSummoningSynergy=this.game.summoning.getUnlockedSynergyData(this.equipment.slots.Summon1.item,this.equipment.slots.Summon2.item);}
checkStatCompareCondition(condition){const playerValue=this.equipmentStats[condition.statKey];const enemyValue=this.target.equipmentStats[condition.statKey];return checkValueCondition(playerValue,{value:enemyValue,operator:condition.operator,});}
checkCondition(condition){switch(condition.type){case 'ItemCharge':return checkValueCondition(this.game.itemCharges.getCharges(condition.item),condition);case 'BankItem':return checkValueCondition(this.game.bank.getQty(condition.item),condition);case 'IsFighting':case 'CombatType':case 'DOT':case 'Effect':case 'Hitpoints':case 'IsStunned':case 'IsSleeping':if(condition.character==='Player')
return this.checkCombatCondition(condition);else
return this.target.checkCombatCondition(condition);case 'Some':return condition.conditions.some((condition)=>this.checkCondition(condition));case 'Every':return condition.conditions.every((condition)=>this.checkCondition(condition));case 'FightingBoss':return checkBooleanCondition(this.manager.enemy.isBoss,condition);case 'EquipStatCompare':return this.checkStatCompareCondition(condition);}}
updateConditionals(hook,computeStats,computeTargetStats){const conditionals=this.conditionalListeners[hook];let playerStatUpdate=false;let enemyStatUpdate=false;conditionals.forEach((conditional)=>{const wasActive=conditional.isActive;conditional.isActive=this.checkCondition(conditional.condition);if(wasActive!==conditional.isActive){const mult=conditional.isActive?1:-1;if(conditional.modifiers!==undefined){this.modifiers.addModifiers(conditional.modifiers,mult,mult);if(conditional.modifiers.bigRon!==undefined){this.modifiers.addModifiers(this.bigOlRonModifiers,mult,mult);}
playerStatUpdate=true;}
if(conditional.enemyModifiers!==undefined){if(this.manager.fightInProgress)
this.target.modifiers.addModifiers(conditional.enemyModifiers,mult,mult);this.targetModifiers.addModifiers(conditional.enemyModifiers,mult,mult);enemyStatUpdate=true;}}});if(playerStatUpdate&&computeStats)
this.computeCombatStats();if(this.manager.fightInProgress&&enemyStatUpdate&&computeTargetStats)
this.target.computeCombatStats();}
registerConditionalListeners(conditionals){conditionals.forEach((conditional)=>{conditional.isActive=false;conditional.hooks.forEach((hook)=>{this.conditionalListeners[hook].add(conditional);});this.conditionalListeners.All.add(conditional);});}
computeConditionalListeners(){Object.values(this.conditionalListeners).forEach((list)=>list.clear());this.statProviders.forEach((provider)=>{if(provider.conditionalModifiers!==undefined)
this.registerConditionalListeners(provider.conditionalModifiers);});this.equipment.slotArray.forEach((slot)=>{if(slot.providesStats){this.registerConditionalListeners(slot.item.conditionalModifiers);}});const synergy=this.activeSummoningSynergy;if((synergy===null||synergy===void 0?void 0:synergy.conditionalModifiers)!==undefined)
this.registerConditionalListeners(synergy.conditionalModifiers);this.activeItemSynergies.forEach((synergy)=>{if(synergy.conditionalModifiers!==undefined)
this.registerConditionalListeners(synergy.conditionalModifiers);});}
addConditionalModifiers(){this.conditionalListeners.All.forEach((conditional)=>{if(conditional.modifiers!==undefined&&!conditional.hooks.has('PlayerHitpoints')&&this.checkCondition(conditional.condition)){this.modifiers.addModifiers(conditional.modifiers);conditional.isActive=true;}});}
addConditionalTargetModifiers(){this.conditionalListeners.All.forEach((conditional)=>{if(conditional.enemyModifiers!==undefined&&!conditional.hooks.has('PlayerHitpoints')&&this.checkCondition(conditional.condition)){this.targetModifiers.addModifiers(conditional.enemyModifiers);conditional.isActive=true;}});}
addPrayerModifiers(){this.activePrayers.forEach((prayer)=>{this.modifiers.addModifiers(prayer.modifiers);});}
addMiscModifiers(){this.game.items.tokens.forEach((item)=>{const tokensClaimed=this.game.stats.itemFindCount(item)-
this.game.stats.Items.get(item,ItemStats.TimesSold)-
this.game.stats.Items.get(item,ItemStats.TimesTransformed)-
this.game.bank.getQty(item);this.modifiers.addModifiers(item.modifiers,tokensClaimed,tokensClaimed);});if(this.equipment.checkForItemID("melvorF:Knights_Defender")&&this.attackType==='melee'){this.modifiers.addModifiers({decreasedAttackInterval:100,decreasedDamageReduction:3,});}
if(this.modifiers.increasedNonMagicPoisonChance>0&&this.attackType!=='magic'){this.modifiers.addModifiers({increasedChanceToApplyPoison:this.modifiers.increasedNonMagicPoisonChance,});}}
addGamemodeModifiers(){this.modifiers.addModifiers(this.game.currentGamemode.playerModifiers);}
addSummonSynergyModifiers(){const synergy=this.activeSummoningSynergy;if(synergy!==undefined){this.modifiers.addModifiers(synergy.modifiers);}}
get equippedSummoningSynergy(){return this.game.summoning.getSynergyData(this.equipment.slots.Summon1.item,this.equipment.slots.Summon2.item);}
removeSummonCharge(slot,interval){this.game.summoning.addXPForTabletConsumption(this.equipment.slots[slot].item,interval);const event=new SummonTabletUsedEvent(this.equipment.slots[slot].item);if(!rollPercentage(Math.min(this.modifiers.increasedSummoningChargePreservation-this.modifiers.decreasedSummoningChargePreservation,80))){this.game.stats.Summoning.inc(SummoningStats.TabletsUsed);if(this.equipment.removeQuantityFromSlot(slot,1)){this.computeAllStats();this.manager.notifications.add({type:'Player',args:[this.game.summoning,getLangString('TOASTS','FAMILIAR_OUT_OF_CHARGES'),'danger'],});}
this.game.summoning.renderQueue.synergyQuantities=true;}
this.processCombatEvent(event);this.rendersRequired.equipment=true;}
addCombatAreaEffectModifiers(){if(this.manager.fightInProgress)
this.modifiers.addModifiers(this.manager.playerAreaModifiers);}
calculateAreaEffectValue(value){const effectValue=value-
this.modifiers.increasedSlayerAreaEffectNegationFlat+
this.modifiers.decreasedSlayerAreaEffectNegationFlat;return Math.max(effectValue,0);}
addMiscSummoningModifiers(){if(this.modifiers.increasedChanceToApplyBurnWithRanged>0&&this.attackType==='ranged'){this.modifiers.addModifiers({increasedChanceToApplyBurn:this.modifiers.increasedChanceToApplyBurnWithRanged});}}
onDOTApplication(type){this.updateConditionals('PlayerDOT',true,true);}
onDOTRemoval(type,statUpdate=true){this.updateConditionals('PlayerDOT',statUpdate,true);}
onTargetDOTRemoval(type,statUpdate=true){this.updateConditionals('EnemyDOT',statUpdate,true);}
onModifierEffectApplication(){this.updateConditionals('PlayerModEffect',false,true);}
onModifierEffectRemoval(){this.updateConditionals('PlayerModEffect',false,false);}
onTargetModifierEffectRemoval(){this.updateConditionals('EnemyModEffect',false,false);}
onTargetModifierEffectApplication(){this.updateConditionals('EnemyModEffect',true,false);}
onApplyingStun(target){super.onApplyingStun(target);if(target!==this)
this.updateConditionals('EnemyStun',true,true);}
onBeingStunned(){super.onBeingStunned();this.updateConditionals('Stun',true,true);}
onStunRemoval(){this.updateConditionals('Stun',true,true);}
onTargetStunRemoval(){this.updateConditionals('EnemyStun',true,true);}
onApplyingSleep(target){super.onApplyingSleep(target);if(target!==this)
this.updateConditionals('EnemySleep',true,true);}
onBeingSlept(){super.onBeingSlept();this.updateConditionals('Sleep',true,true);}
onSleepRemoval(){this.updateConditionals('Sleep',true,true);}
onTargetSleepRemoval(){this.updateConditionals('EnemySleep',true,true);}
getMeleeDefenceBonus(){let bonus=super.getMeleeDefenceBonus();bonus+=this.modifiers.increasedMeleeRangedDefenceBonusBasedOnDR*this.stats.damageReduction;bonus+=this.modifiers.increasedFlatMeleeDefenceBonus;if(this.attackType==='melee'&&this.equipment.checkForItemID("melvorF:Knights_Defender"))
bonus+=7;if(this.equipment.checkForItemID("melvorD:Obsidian_Cape"))
bonus+=this.levels.Defence;return bonus;}
getRangedDefenceBonus(){let bonus=super.getRangedDefenceBonus();bonus+=this.modifiers.increasedMeleeRangedDefenceBonusBasedOnDR*this.stats.damageReduction;bonus+=this.modifiers.increasedFlatRangedDefenceBonus;if(this.equipment.checkForItemID("melvorD:Obsidian_Cape"))
bonus+=this.levels.Ranged;return bonus;}
getMagicDefenceBonus(){let bonus=super.getMagicDefenceBonus();bonus+=this.modifiers.increasedFlatMagicDefenceBonus;return bonus;}
processDeath(){this.removeAllEffects(true);this.setHitpoints(Math.floor(this.stats.maxHitpoints*0.2));this.manager.addCombatStat(CombatStats.Deaths);this.manager.addMonsterStat(MonsterStats.KilledPlayer);this.applyDeathPenalty();this.disableActivePrayers();}
applyDeathPenalty(){let lostItem=false;if(this.modifiers.itemProtection<=0&&!this.manager.giveFreeDeath){const slotID=rollInteger(0,this.equipment.slotArray.length-1);const slot=this.equipment.slotArray[slotID];const itemLost=slot.item;if(!slot.isEmpty&&this.game.tutorial.complete){lostItem=true;addModalToQueue({title:getLangString('COMBAT_MISC','YOU_DIED'),html:`${getLangString('COMBAT_MISC','YOU_LOST_YOUR')}<br>
          <img class="skill-icon-sm mr-2" src="${itemLost.media}">${itemLost.name}${slot.quantity>1?` x ${slot.quantity}`:''}`,imageUrl:'assets/media/skills/combat/combat.svg',imageWidth:64,imageHeight:64,imageAlt:getLangString('PAGE_NAME','Combat'),});this.addItemStat(slot.item,ItemStats.TimesLostToDeath,slot.quantity);this.equipment.unequipItem(slot.type);this.updateForEquipmentChange();if(this.game.itemCharges.itemHasCharge(itemLost)){this.game.itemCharges.removeAllCharges(itemLost);}}}
if(!lostItem){addModalToQueue({title:getLangString('COMBAT_MISC','YOU_DIED'),html:'<span class="text-dark">'+getLangString('COMBAT_MISC','YOU_DIED_DESC')+'</span>',imageUrl:'assets/media/skills/combat/combat.svg',imageWidth:64,imageHeight:64,imageAlt:getLangString('PAGE_NAME','Combat'),});}}
regen(){if(this.hitpoints<this.stats.maxHitpoints&&this.allowRegen){let regen=this.stats.maxHitpoints/100;regen+=numberMultiplier*(this.modifiers.increasedHPRegenFlat-this.modifiers.decreasedHPRegenFlat);switch(this.attackType){case 'melee':regen+=(this.modifiers.increasedFlatHPRegenBasedOnMeleeMaxHit*this.stats.maxHit)/100;break;case 'ranged':regen+=(this.modifiers.increasedFlatHPRegenBasedOnRangedMaxHit*this.stats.maxHit)/100;break;case 'magic':regen+=(this.modifiers.increasedFlatHPRegenBasedOnMagicMaxHit*this.stats.maxHit)/100;break;}
let regenModifier=this.modifiers.increasedHitpointRegeneration-this.modifiers.decreasedHitpointRegeneration;if(this.modifiers.increasedHPRegenWhenEnemyHasMoreEvasion>0&&this.manager.fightInProgress&&this.stats.averageEvasion<this.target.stats.averageEvasion)
regenModifier+=this.modifiers.increasedHPRegenWhenEnemyHasMoreEvasion;if(this.manager.onSlayerTask)
regenModifier+=this.modifiers.increasedHitpointRegenerationAgainstSlayerTasks;regen=applyModifier(regen,regenModifier);regen=this.heal(regen);let gpToAdd=(regen*this.modifiers.increasedGPOnRegenBasedOnHPGain)/numberMultiplier;if(gpToAdd>0){gpToAdd=applyModifier(gpToAdd,this.modifiers.increasedGPGlobal-this.modifiers.decreasedGPGlobal);this.game.gp.add(gpToAdd);this.game.stats.Combat.add(CombatStats.GPEarned,gpToAdd);}
this.activePrayers.forEach((prayer)=>{this.consumePrayerPoints(prayer.pointsPerRegen);});this.processCombatEvent(new PlayerHitpointRegenerationEvent(regen));}
this.timers.regen.start(10000-this.modifiers.decreasedRegenerationInterval);}
renderAttackStyle(){['melee','ranged','magic'].forEach((attackType)=>{const container=document.getElementById(`${attackType}-attack-style-buttons`);if(attackType===this.attackType){showElement(container);}
else{hideElement(container);}});this.game.attackStyles.forEach((style)=>{if(style.attackType===this.attackType){const button=document.getElementById(style.buttonID);if(this.attackStyle===style){button.classList.add('btn-secondary');button.classList.remove('btn-outline-secondary');}
else{button.classList.add('btn-outline-secondary');button.classList.remove('btn-secondary');}}});this.rendersRequired.attackStyle=false;}
setAttackStyleButtonCallbacks(){this.game.attackStyles.forEach((style)=>{const button=document.getElementById(style.buttonID);button.onclick=()=>this.setAttackStyle(style.attackType,style);});}
renderHitpoints(){super.renderHitpoints();const navText=`(${formatNumber(this.hitpoints)})`;let remove='text-danger';let add='text-success';if(this.hitpoints<this.stats.maxHitpoints){remove='text-success';add='text-danger';}
this.statElements.navHitpoints.forEach((elem)=>{elem.textContent=navText;elem.classList.remove(remove);elem.classList.add(add);});}
renderSummonMaxHit(){let maxHit=this.stats.summoningMaxHit;if(this.manager.fightInProgress){maxHit=this.applyTriangleToDamage(this.target,maxHit);maxHit*=1-this.target.stats.damageReduction/100;}
maxHit=Math.floor(maxHit);let text;if(this.manager.fightInProgress){text=`(${maxHit})`;}
else{text=`${maxHit}`;}
if(maxHit>0){$('.summon-max-hit').removeClass('d-none');$('.summoning-combat-bar').removeClass('d-none');$('#combat-player-strength-bonus-summon').text(text);}
else{$('.summon-max-hit').addClass('d-none');$('.summoning-combat-bar').addClass('d-none');$('#combat-player-strength-bonus-summon').text('0');}}
renderStats(){this.renderSummonMaxHit();super.renderStats();}
renderFood(){combatMenus.combatFood.render(this);combatMenus.thievingFood.render(this);$('#combat-food-current-qty-1').text(this.food.currentSlot.quantity);$('#combat-footer-minibar-food-img').attr('src',this.food.currentSlot.item.media);this.rendersRequired.food=false;}
render(){if(this.rendersRequired.prayerPoints)
this.renderPrayerPoints();if(this.rendersRequired.attackStyle)
this.renderAttackStyle();if(this.rendersRequired.equipment){this.equipment.render(this);this.rendersRequired.equipment=false;}
if(this.rendersRequired.prayerSelection){combatMenus.prayer.setActive(this.activePrayers,this);this.rendersRequired.prayerSelection=false;}
if(this.rendersRequired.spellSelection){combatMenus.spells.standard.setSelection(this.spellSelection.standard);this.rendersRequired.spellSelection=false;}
if(this.rendersRequired.ancientSelection){combatMenus.spells.ancient.setSelection(this.spellSelection.ancient);this.rendersRequired.ancientSelection=false;}
if(this.rendersRequired.curseSelection){combatMenus.spells.curse.setSelection(this.spellSelection.curse);this.rendersRequired.curseSelection=false;}
if(this.rendersRequired.auroraSelection){combatMenus.spells.aurora.setSelection(this.spellSelection.aurora);this.rendersRequired.auroraSelection=false;}
if(this.rendersRequired.archaicSelection){combatMenus.spells.archaic.setSelection(this.spellSelection.archaic);this.rendersRequired.archaicSelection=false;}
if(this.rendersRequired.runesUsed){combatMenus.runes.updateHighlights(this.spellSelection,this.useCombinationRunes);this.rendersRequired.runesUsed=false;}
if(this.rendersRequired.food)
this.renderFood();if(this.rendersRequired.combatLevel)
this.renderCombatLevel();if(this.rendersRequired.summonBar)
this.renderSummonBar();if(this.rendersRequired.attacks)
this.renderAttackIcon();if(this.rendersRequired.equipmentSets)
this.renderEquipmentSets();if(this.rendersRequired.autoEat)
this.renderAutoEat();if(this.rendersRequired.combatTriangle)
this.renderCombatTriangle();this.renderActiveSkillModifiers();super.render();}
renderAutoEat(){let efficiencyClass='text-danger';if(this.autoEatThreshold>0){if(this.autoEatEfficiency>=100)
efficiencyClass='text-success';const tooltipContent=`<div class='text-center'>
      <span class='text-warning'> 
        ${getLangString('COMBAT_MISC','AUTO_EAT')}
      </span><br>
      <small class='text-success'> 
        ${templateLangString('COMBAT_MISC','AUTO_EAT_THRESHOLD',{amount:`${Math.floor(this.autoEatThreshold)}`})}
      </small><br>
      <small>
        ${templateLangString('COMBAT_MISC','AUTO_EAT_DESCRIPTION',{limitPercent:`${this.modifiers.increasedAutoEatHPLimit-this.modifiers.decreasedAutoEatHPLimit}`,threshHoldPercent:`${this.modifiers.increasedAutoEatThreshold-this.modifiers.decreasedAutoEatThreshold}`,})}<br>
        ${getLangString('COMBAT_MISC','FOOD_EFFICIENCY')} 
        <span class="${efficiencyClass}">${formatPercent(this.modifiers.increasedAutoEatEfficiency-this.modifiers.decreasedAutoEatEfficiency)}</span><br>
        ${getLangString('COMBAT_MISC','WORKS_COMBAT_THIEVING')}
      </small>
    </div>`;this.statElements.autoEatTooltips.forEach((tooltip)=>{tooltip.setContent(tooltipContent);});this.statElements.autoEatIcons.forEach(showElement);}
else{this.statElements.autoEatIcons.forEach(hideElement);}
this.rendersRequired.autoEat=false;}
renderCombatTriangle(){if(this.manager.fightInProgress){this.statElements.triangleDamageIcons.forEach(showElement);showElement(this.statElements.triangleReductionIcon);const tooltipInfo=getLangString('COMBAT_MISC',`${this.attackType}_vs_${this.target.attackType}`);const damageMult=this.activeTriangle.damageModifier[this.attackType][this.target.attackType];const reductionMod=this.activeTriangle.reductionModifier[this.attackType][this.target.attackType];let reductionText=getLangString('COMBAT_MISC','NO_CHANGE');let damageText=getLangString('COMBAT_MISC','NO_CHANGE');let textStyle='info';if(damageMult!==0){damageText=`x${damageMult}`;}
if(reductionMod!==1){reductionText=`x${reductionMod}`;if(reductionMod<1){textStyle='danger';}
else{textStyle='success';}}
const damageTooltipContent=`
      <div class="text-center font-size-sm">${tooltipInfo}<br>
      <span class="text-warning">${getLangString('COMBAT_MISC','DAMAGE_DEALT_MULT')} </span>
      <span class="text-${textStyle}">${damageText}</span>`;const reductionTooltipContent=`
      <div class="text-center font-size-sm">${tooltipInfo}<br>
      <span class="text-warning">${getLangString('COMBAT_MISC','DAMAGE_REDUCTION_MULT')} </span>
      <span class="text-${textStyle}">${reductionText}</span>`;this.statElements.triangleReductionTooltip.setContent(reductionTooltipContent);this.statElements.triangleDamageTooltips.forEach((tooltip)=>tooltip.setContent(damageTooltipContent));}
else{this.statElements.triangleDamageIcons.forEach(hideElement);hideElement(this.statElements.triangleReductionIcon);}
this.rendersRequired.combatTriangle=false;}
getExperienceGainSkills(){const skills=[];if(this.attackStyle!==undefined){this.attackStyle.experienceGain.forEach((gain)=>{skills.push(gain.skill);});}
skills.push(this.game.hitpoints);if(this.activePrayers.size>0)
skills.push(this.game.prayer);if(this.manager.onSlayerTask)
skills.push(this.game.slayer);return skills;}
renderActiveSkillModifiers(){var _a,_b,_c,_d;if(!this.rendersRequired.activeSkillModifierChange)
return;if(((_b=(_a=this.game.openPage)===null||_a===void 0?void 0:_a.action)===null||_b===void 0?void 0:_b.renderModifierChange)!==undefined)
(_d=(_c=this.game.openPage)===null||_c===void 0?void 0:_c.action)===null||_d===void 0?void 0:_d.renderModifierChange();this.game.mining.updateAllRockMaxHPs();this.game.bank.renderModifierChange();this.rendersRequired.activeSkillModifierChange=false;}
renderEquipmentSets(){combatMenus.equipSets.forEach((menu)=>{menu.render(this.equipmentSets,this.selectedEquipmentSet,this);});this.rendersRequired.equipmentSets=false;}
renderAttackIcon(){let tooltipContent='';this.availableAttacks.forEach((selection)=>{let chanceText=formatPercent(selection.chance);if(Math.floor(selection.chance)!==selection.chance){chanceText=formatPercent(selection.chance,2);}
if(selection.attack!==this.game.normalAttack){tooltipContent+=`
        <div class='text-center'>
          <small class='text-success'>${getLangString('BANK_STRING','37')}<br>
            <span class='text-danger'>${selection.attack.name} (${chanceText}): </span>
            <span class='text-warning'>${selection.attack.description}</span>
          </small>
        </div>`;}});if(tooltipContent!==''){showElement(this.statElements.specialIcon);this.statElements.specialTooltip.setContent(tooltipContent);}
else{hideElement(this.statElements.specialIcon);}
this.rendersRequired.attacks=false;}
renderSummonBar(){this.rendersRequired.summonBar=false;if(!this.timers.summon.isActive){combatMenus.progressBars.playerSummon.stopAnimation();return;}
combatMenus.progressBars.playerSummon.animateProgressFromTimer(this.timers.summon);}
rewardSlayerCoins(){let amount=this.target.stats.maxHitpoints/numberMultiplier;if(this.manager.enemy.monster!==undefined){switch(this.target.attackType){case 'melee':if(this.modifiers.gainSlayerCoinsBasedOnEnemyCombatLevelMelee>0)
amount+=this.manager.enemy.monster.combatLevel;break;case 'ranged':if(this.modifiers.gainSlayerCoinsBasedOnEnemyCombatLevelRanged>0)
amount+=this.manager.enemy.monster.combatLevel;break;case 'magic':if(this.modifiers.gainSlayerCoinsBasedOnEnemyCombatLevelMagic>0)
amount+=this.manager.enemy.monster.combatLevel;break;}}
this.game.slayerCoins.add(amount);}
rewardXPAndPetsForDamage(damage){damage=damage/numberMultiplier;const attackInterval=this.timers.act.maxTicks*TICK_INTERVAL;if(this.attackStyle!==undefined){this.attackStyle.experienceGain.forEach((gain)=>{gain.skill.addXP(gain.ratio*damage);this.rollForSummoningMarks(gain.skill,attackInterval);gain.skill.rollForPets(attackInterval);});}
this.game.hitpoints.addXP(damage*1.33);this.rollForSummoningMarks(this.game.hitpoints,attackInterval);this.game.hitpoints.rollForPets(attackInterval);let prayerRatio=0;this.activePrayers.forEach((prayer)=>{return(prayerRatio+=prayer.pointsPerPlayer);});prayerRatio/=3;if(prayerRatio>0){this.game.prayer.addXP(prayerRatio*damage);this.rollForSummoningMarks(this.game.prayer,attackInterval);this.game.prayer.rollForPets(attackInterval);}
if(this.manager.onSlayerTask){this.rollForSummoningMarks(this.game.slayer,attackInterval);this.game.slayer.rollForPets(attackInterval);}}
rollForSummoningMarks(skill,interval){this.game.summoning.rollMarksForSkill(skill,interval);}
rewardCurrencyForSummonDamage(damage){damage=damage/numberMultiplier;const gpMult=this.modifiers.increasedGPBasedOnSummonDamage-this.modifiers.decreasedGPBasedOnSummonDamage;let gpToAdd=(damage*gpMult)/100;gpToAdd=applyModifier(gpToAdd,this.modifiers.increasedCombatGP);if(gpToAdd>0){this.game.gp.add(gpToAdd);this.game.stats.Combat.add(CombatStats.GPEarned,gpToAdd);}}
rewardCurrencyForDamage(damage){damage=damage/numberMultiplier;let gpMult=this.modifiers.getGPForDamageMultiplier(this.attackType);if(this.modifiers.increasedGPMultiplierPer1MGP>0){gpMult+=(this.game.gp.amount/1e6)*this.modifiers.increasedGPMultiplierPer1MGP;gpMult=clampValue(gpMult,this.modifiers.increasedGPMultiplierMin,this.modifiers.increasedGPMultiplierCap);}
let gpToAdd=(damage*gpMult)/100;gpToAdd=applyModifier(gpToAdd,this.modifiers.increasedCombatGP);if(gpToAdd>0){this.game.gp.add(gpToAdd);this.game.stats.Combat.add(CombatStats.GPEarned,gpToAdd);}
let scMult=0;if(this.attackType==='magic'&&this.manager.onSlayerTask)
scMult+=this.modifiers.increasedSlayerCoinsPerMagicDamageSlayerTask;scMult+=this.modifiers.increasedSlayerCoinsPerDamage-this.modifiers.decreasedSlayerCoinsPerDamage;if(scMult>0){const scToAdd=(scMult*damage)/100;this.game.slayerCoins.add(scToAdd);}}
rewardGPForKill(){let gpToAdd=0;if(this.modifiers.increasedGPFromMonstersFlatBasedOnEvasion>0){gpToAdd+=(this.target.stats.maxEvasion*this.modifiers.increasedGPFromMonstersFlatBasedOnEvasion)/100;}
gpToAdd=applyModifier(gpToAdd,this.modifiers.increasedCombatGP);if(gpToAdd>0){this.game.gp.add(gpToAdd);this.game.stats.Combat.add(CombatStats.GPEarned,gpToAdd);}}
processCombatEvent(event,interval=0){this.game.processEvent(event,interval);}
applyUniqueSpawnEffects(){super.applyUniqueSpawnEffects();}
initializeForCombat(){this.applyItemEffects();this.updateConditionals('EnemySpawn',false,false);this.rendersRequired.summonBar=true;this.rendersRequired.combatTriangle=true;super.initializeForCombat();}
stopFighting(){this.timers.summon.stop();this.modifiers.subModifiers(this.manager.playerAreaModifiers);super.stopFighting();}
renderCombatLevel(){const text=templateString(getLangString('COMBAT_MISC','93'),{level:`${this.game.playerCombatLevel}`});this.statElements.combatLevel.forEach((elem)=>(elem.textContent=text));this.rendersRequired.combatLevel=false;}
resetActionState(){super.resetActionState();this.timers.summon.stop();}
encode(writer){super.encode(writer);writer.writeBoolean(this.attackStyles.melee!==undefined);if(this.attackStyles.melee)
writer.writeNamespacedObject(this.attackStyles.melee);writer.writeBoolean(this.attackStyles.ranged!==undefined);if(this.attackStyles.ranged)
writer.writeNamespacedObject(this.attackStyles.ranged);writer.writeBoolean(this.attackStyles.magic!==undefined);if(this.attackStyles.magic)
writer.writeNamespacedObject(this.attackStyles.magic);writer.writeUint32(this.prayerPoints);writer.writeUint16(this.selectedEquipmentSet);writer.writeArray(this.equipmentSets,(set,writer)=>set.encode(writer));this.food.encode(writer);this.timers.summon.encode(writer);return writer;}
decode(reader,version){super.decode(reader,version);const oldSpellSelection=new SpellSelection(this.game);if(version<=24){oldSpellSelection.decode(reader,version);}
if(reader.getBoolean()){const style=reader.getNamespacedObject(this.game.attackStyles);if(typeof style==='string')
this.attackStyles.melee=this.game.attackStyles.find((style)=>style.attackType==='melee');else
this.attackStyles.melee=style;}
if(reader.getBoolean()){const style=reader.getNamespacedObject(this.game.attackStyles);if(typeof style==='string')
this.attackStyles.ranged=this.game.attackStyles.find((style)=>style.attackType==='ranged');else
this.attackStyles.ranged=style;}
if(reader.getBoolean()){const style=reader.getNamespacedObject(this.game.attackStyles);if(typeof style==='string')
this.attackStyles.magic=this.game.attackStyles.find((style)=>style.attackType==='magic');else
this.attackStyles.magic=style;}
this.prayerPoints=reader.getUint32();this.selectedEquipmentSet=reader.getUint16();if(version<=24){this.equipmentSets=reader.getArray((reader)=>{const set=new EquipmentSet(this.game);set.equipment.decode(reader,version,this.addItemsToBankOnLoadFail);return set;});}
else{this.equipmentSets=reader.getArray((reader)=>{const set=new EquipmentSet(this.game);set.decode(reader,version,this.addItemsToBankOnLoadFail);return set;});}
this.food.decode(reader,version,this.addItemsToBankOnLoadFail);if(version<=24){this.equipmentSets[this.selectedEquipmentSet].spellSelection=oldSpellSelection;const oldPrayerSelection=reader.getSet(readNamespacedReject(this.game.prayers));this.equipmentSets[this.selectedEquipmentSet].prayerSelection=oldPrayerSelection;this.equipmentSets.forEach((set)=>set.spellSelection.validate());}
this.timers.summon.decode(reader,version);if(this.timers.summon.isActive&&this.equipment.slots.Summon1.isEmpty&&this.equipment.slots.Summon2.isEmpty)
this.timers.summon.stop();}
deserialize(reader,version,idMap){super.deserialize(reader.getVariableLengthChunk(),version,idMap);const spellSelection=new SpellSelection(this.game);const standardID=reader.getNumber();if(standardID>=0){spellSelection.standard=this.game.standardSpells.getObjectByID(idMap.magicStandardSpells[standardID]);}
const ancientID=reader.getNumber();if(ancientID>=0){spellSelection.ancient=this.game.ancientSpells.getObjectByID(idMap.magicAncients[ancientID]);}
const auroraID=reader.getNumber();if(auroraID>=0){spellSelection.aurora=this.game.auroraSpells.getObjectByID(idMap.magicAuroras[auroraID]);}
const curseID=reader.getNumber();if(curseID>=0){spellSelection.curse=this.game.curseSpells.getObjectByID(idMap.magicCurses[curseID]);}
const getStyle=(oldID,type)=>{let style=this.game.attackStyles.getObjectByID(idMap.attackStyles[oldID]);if(style===undefined)
style=this.game.attackStyles.find((style)=>style.attackType===type);return style;};this.attackStyles.melee=getStyle(reader.getNumber(),'melee');this.attackStyles.ranged=getStyle(reader.getNumber(),'ranged');this.attackStyles.magic=getStyle(reader.getNumber(),'magic');this.prayerPoints=reader.getNumber();if(this.prayerPoints<0)
this.prayerPoints=0;this.selectedEquipmentSet=reader.getNumber();const slayerCoins=reader.getNumber();if(!(this instanceof RaidPlayer))
this.game.slayerCoins.set(slayerCoins);const numSets=reader.getNumber();for(let i=0;i<numSets;i++){if(this.equipmentSets[i]===undefined){this.equipmentSets.push(new EquipmentSet(this.game));}
const equipment=this.equipmentSets[i].equipment;equipment.deserialize(reader.getVariableLengthChunk(),version,idMap,this.addItemsToBankOnLoadFail);}
this.food.deserialize(reader.getVariableLengthChunk(),version,idMap,this.addItemsToBankOnLoadFail);const numPrayers=reader.getNumber();const activePrayers=new Set();for(let i=0;i<numPrayers;i++){const prayerID=reader.getNumber();const prayer=this.game.prayers.getObjectByID(idMap.prayers[prayerID]);if(prayer!==undefined)
activePrayers.add(prayer);}
this.timers.summon.deserialize(reader.getChunk(3),version);if(this.timers.summon.isActive&&this.equipment.slots.Summon1.isEmpty&&this.equipment.slots.Summon2.isEmpty)
this.timers.summon.stop();if(version>=21)
this.quickEquipMenu.deserialize(reader.getVariableLengthChunk(),version,idMap,this);this.equipmentSets[this.selectedEquipmentSet].spellSelection=spellSelection;this.equipmentSets[this.selectedEquipmentSet].prayerSelection=activePrayers;this.equipmentSets.forEach((set)=>set.spellSelection.validate());}
convertFromOldSaveFormat(saveGame,idMap){var _a,_b,_c,_d,_e,_f,_g;this.game.slayerCoins.set((_a=saveGame.slayerCoins)!==null&&_a!==void 0?_a:0);this.prayerPoints=(_b=saveGame.prayerPoints)!==null&&_b!==void 0?_b:0;if(this.prayerPoints<0)
this.prayerPoints=0;const spellSelection=new SpellSelection(this.game);const standardID=(_c=saveGame.selectedSpell)!==null&&_c!==void 0?_c:0;if(standardID>=0){let spell=this.game.standardSpells.getObjectByID(idMap.magicStandardSpells[standardID]);if(spell===undefined)
spell=this.game.standardSpells.firstObject;spellSelection.standard=spell;}
const auroraId=(_d=saveGame.activeAurora)!==null&&_d!==void 0?_d:-1;if(auroraId>=0){const aurora=this.game.auroraSpells.getObjectByID(idMap.magicAuroras[auroraId]);if(aurora!==undefined)
spellSelection.aurora=aurora;}
this.hitpoints=(_f=(_e=saveGame.combatData)===null||_e===void 0?void 0:_e.player.hitpoints)!==null&&_f!==void 0?_f:10*numberMultiplier;this.selectedEquipmentSet=(_g=saveGame.selectedEquipmentSet)!==null&&_g!==void 0?_g:0;const getStyle=(oldID,type)=>{let style=this.game.attackStyles.getObjectByID(idMap.attackStyles[oldID]);if(style===undefined)
style=this.game.attackStyles.find((style)=>style.attackType===type);return style;};if(saveGame.selectedAttackStyle!==undefined){this.attackStyles.melee=getStyle(saveGame.selectedAttackStyle[0],'melee');this.attackStyles.ranged=getStyle(saveGame.selectedAttackStyle[1],'ranged');this.attackStyles.magic=getStyle(saveGame.selectedAttackStyle[1],'magic');}
if(saveGame.equipmentSets!==undefined){for(let i=0;i<3;i++){const oldSet=saveGame.equipmentSets[i];if(this.equipmentSets[i]===undefined){this.equipmentSets.push(new EquipmentSet(this.game));}
const equipment=this.equipmentSets[i].equipment;equipment.convertFromOldFormat(oldSet,idMap);}}
if(saveGame.equippedFood!==undefined)
this.food.convertFromOldSaveFormat(saveGame.equippedFood,idMap);this.equipmentSets[this.selectedEquipmentSet].spellSelection=spellSelection;this.equipmentSets.forEach((set)=>set.spellSelection.validate());}}