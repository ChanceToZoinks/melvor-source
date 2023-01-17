"use strict";class RaidPlayer extends Player{constructor(manager,game){super(manager,game);this.manager=manager;this.food=new EquippedFood(1,this.game);this.baseSpawnInterval=1500;this.altAttacks={};this.resetAltAttacks();}
get isPrayerUnlocked(){return this.modifiers.golbinRaidPrayerUnlocked>0;}
get prayerPointsOnWaveCompletion(){return 20+this.modifiers.golbinRaidIncreasedPrayerPointsWave;}
get activeTriangle(){return combatTriangle[this.manager.difficulty.combatTriangle];}
get allowRegen(){return true;}
get useCombinationRunes(){return false;}
get addItemsToBankOnLoadFail(){return false;}
isEquipmentSlotUnlocked(slot){switch(slot){case 'Passive':{return this.modifiers.golbinRaidPassiveSlotUnlocked>0;}
default:return true;}}
modifyAttackInterval(interval){interval=super.modifyAttackInterval(interval);interval/=2;return interval;}
resetAltAttacks(){Object.entries(equipmentSlotData).forEach((entry)=>{this.altAttacks[entry[0]]=[];});}
getSlotAttacks(slot){const altAttacks=this.altAttacks[slot.type];if(altAttacks.length>0)
return altAttacks;else
return super.getSlotAttacks(slot);}
computeLevels(){this.levels.Attack=this.getSkillLevel('Attack')+this.modifiers.getHiddenSkillLevels(this.game.attack);this.levels.Strength=this.getSkillLevel('Strength')+this.modifiers.getHiddenSkillLevels(this.game.strength);this.levels.Defence=this.getSkillLevel('Defence')+this.modifiers.getHiddenSkillLevels(this.game.defence);this.levels.Hitpoints=this.getSkillLevel('Hitpoints')+this.modifiers.getHiddenSkillLevels(this.game.hitpoints);this.levels.Ranged=this.getSkillLevel('Ranged')+this.modifiers.getHiddenSkillLevels(this.game.ranged);this.levels.Magic=this.getSkillLevel('Magic')+this.modifiers.getHiddenSkillLevels(this.game.altMagic);this.levels.Prayer=this.getSkillLevel('Prayer');this.rendersRequired.levels=true;}
computeModifiers(){this.modifiers.reset();this.addProviderModifiers();this.modifiers.addArrayModifiers(this.manager.randomPlayerModifiers);this.addEquippedItemModifiers();this.addConditionalModifiers();this.addAttackStyleModifiers();this.addPassiveModifiers();this.addTargetModifiers();this.addPrayerModifiers();this.checkMagicUsage();this.addAuroraModifiers();this.addCurseModifiers();this.addMiscModifiers();this.addEffectModifiers();this.rendersRequired.autoEat=true;this.computeTargetModifiers();}
processDeath(){this.removeAllEffects(true);this.setHitpoints(10*numberMultiplier);this.disableActivePrayers();}
equipItem(item,set,slot='Default',quantity=1,altAttacks=[]){const equipment=this.equipmentSets[set].equipment;if(slot==='Default'){slot=item.validSlots[0];}
if(!equipmentSlotData[slot].allowQuantity)
quantity=1;if(equipment.checkForItem(item)){if(equipmentSlotData[slot].allowQuantity){equipment.addQuantityToSlot(slot,quantity);this.rendersRequired.equipment=true;this.render();return true;}
else{notifyPlayer(this.game.attack,templateLangString('TOASTS','ITEM_ALREADY_EQUIPPED',{itemName:item.name}),'danger');return false;}}
this.equipment.getSlotsToUnequip(item,slot).forEach((slot)=>{this.altAttacks[slot]=[];});this.altAttacks[slot]=altAttacks;if(slot==='Quiver')
quantity+=equipment.slots[slot].quantity;this.equipment.equipItem(item,slot,quantity);if(set===this.selectedEquipmentSet){this.updateForEquipmentChange();}
else{this.updateForEquipSetChange();}
return true;}
updateForEquipmentChange(){this.rendersRequired.equipment=true;this.computeAllStats();this.rendersRequired.attackStyle=true;this.rendersRequired.equipmentSets=true;this.game.renderQueue.activeSkills=true;this.interruptAttack();if(this.manager.fightInProgress)
this.target.combatModifierUpdate();this.render();}
equipFood(item,quantity){if(this.food.currentSlot.item!==item){this.food.unequipSelected();}
const equipped=this.food.equip(item,quantity);if(equipped){this.renderFood();return true;}
else{notifyPlayer(this.game.hitpoints,getLangString('TOASTS','NEED_FREE_SLOT'),'danger');return false;}}
setEquipmentToDefault(){this.resetAltAttacks();this.equipment.unequipAll();this.equipDefaultWeapon();if(this.manager.startingAmmo)
this.equipItem(this.manager.startingAmmo.item,this.selectedEquipmentSet,'Quiver',this.manager.startingAmmo.quantity);this.food.unequipSelected();if(this.manager.startingFood)
this.equipFood(this.manager.startingFood,10);this.prayerPoints=0;this.addPrayerPoints(this.modifiers.golbinRaidIncreasedPrayerPointsStart);}
addMiscModifiers(){this.modifiers.addModifiers({increasedAutoEatThreshold:30,increasedAutoEatEfficiency:80,increasedAutoEatHPLimit:60,});}
getSkillLevel(skill){let level=this.manager.wave+1;if(skill==='Hitpoints')
level+=9;if(skill==='Prayer')
level=1+this.modifiers.golbinRaidIncreasedPrayerLevel;return level;}
getLevelHistory(){return[this.getSkillLevel('Attack'),this.getSkillLevel('Strength'),this.getSkillLevel('Defence'),this.getSkillLevel('Hitpoints'),this.getSkillLevel('Ranged'),this.getSkillLevel('Magic'),];}
getEquipmentHistory(){const history=[];this.equipment.slotArray.forEach((slot)=>{if(slot.providesStats)
history.push(slot.item);});return history;}
getFoodHealingBonus(item){const bonus=this.modifiers.increasedFoodHealingValue-this.modifiers.decreasedFoodHealingValue;return bonus;}
onMagicAttackFailure(){this.equipDefaultWeapon();}
onRangedAttackFailure(quiver){this.equipDefaultWeapon();}
consumeAmmo(){super.consumeAmmo();if(this.equipment.slots.Weapon.isEmpty)
this.equipDefaultWeapon();}
equipDefaultWeapon(){const weaponIndex=Math.min(this.modifiers.golbinRaidStartingWeapon,this.manager.startingWeapons.length-1);const weapon=this.manager.startingWeapons[weaponIndex];this.equipItem(weapon,this.selectedEquipmentSet,'Weapon');}
rewardForDamage(damage){}
trackItemUsage(costs){}
trackWeaponStat(stat,amount=1){}
processCombatEvent(event,interval=0){this.consumeEquipmentCharges(event,interval);}
consumeEquipmentCharges(event,interval){this.equipment.itemQuantityUsers.forEach((slot)=>{var _a;if((_a=slot.item.consumesOn)===null||_a===void 0?void 0:_a.some((matcher)=>matcher.doesEventMatch(event))){if(this.equipment.removeQuantityFromSlot(slot.type,1)){this.computeAllStats();}
this.rendersRequired.equipment=true;}});}
trackArmourStat(stat,amount=1){}
addItemStat(item,stat,amount){}
trackPrayerStats(stat,amount){}
checkIfCantEquip(){notifyPlayer(this.game.attack,getLangString('TOASTS','CANNOT_DURING_RAID'),'danger');return true;}
render(){super.render();if(this.rendersRequired.levels)
this.renderLevels();}
renderLevels(){combatSkills.forEach((skill)=>{const level=this.getSkillLevel(skill);this.statElements.golbinLevels[skill].textContent=`${level}`;});this.rendersRequired.levels=false;}
encode(writer){super.encode(writer);writer.writeArray(Object.entries(this.altAttacks),([slot,attacks],writer)=>{writer.writeUint8(equipmentSlotData[slot].id);writer.writeArray(attacks,writeNamespaced);});return writer;}
decode(reader,version){if(version>=24)
super.decode(reader,version);const altAttackArray=reader.getArray((reader)=>{const slot=EquipmentSlots[reader.getUint8()];const attacks=reader.getArray(readNamespacedReject(this.game.specialAttacks));if(attacks.length===0)
return undefined;return[slot,attacks];});altAttackArray.forEach(([slot,attacks])=>{this.altAttacks[slot]=attacks;});}
deserializeAltAttacks(reader,version,idMap){while(!reader.atEnd){const slotID=reader.getNumber();const numAttacks=reader.getNumber();const altAttackArray=[];reader.getChunk(numAttacks).forEach((attackID)=>{const attack=this.game.specialAttacks.getObjectByID(idMap.attacks[attackID]);if(attack!==undefined)
altAttackArray.push(attack);});if(altAttackArray.length>0)
this.altAttacks[EquipmentSlots[slotID]]=altAttackArray;}}
deserialize(reader,version,idMap){if(version<=12){super.deserialize(reader,version,idMap);return;}
super.deserialize(reader.getVariableLengthChunk(),version,idMap);this.deserializeAltAttacks(reader.getVariableLengthChunk(),version,idMap);}}