"use strict";class Character{constructor(manager,game){this.manager=manager;this.game=game;this.hitpoints=0;this.stun={turns:0,flavour:'Stun',};this.sleep={turns:0,};this.nextAction='Attack';this.attackCount=1;this.stunImmunity={turns:0,};this.isAttacking=false;this.firstHit=true;this.slowCount=0;this.frostBurnCount=0;this.modifierEffects={fromSelf:{countSelf:new Map(),countTarget:new Map(),},fromTarget:{countSelf:new Map(),countTarget:new Map(),},};this.reflexiveEffects=new Map();this.stackingEffect=new Map();this.comboEffects=new Map();this.activeDOTs=new Map();this.target=this;this.equipmentStats=new EquipmentStats();this.levels={Hitpoints:0,Attack:0,Strength:0,Defence:0,Ranged:0,Magic:0,Prayer:0,};this.stats=new CharacterStats();this.attackType='melee';this.hitchance=0;this.availableAttacks=[];this.targetModifiers=new TargetModifiers();this.canCurse=false;this.canAurora=false;this.passives=new Map();this.rendersRequired={stats:false,hitChance:false,hitpoints:false,damageSplash:false,effects:false,attackBar:false,attackBarMinibar:false,attacks:false,passives:false,damageValues:false,};this.turnsTaken=0;this.timers={act:new Timer('Act',()=>this.act()),regen:new Timer('Regen',()=>this.regen()),};this.nextAttack=game.normalAttack;}
get isCursed(){return this.curse!==undefined;}
get isSleeping(){return this.sleep.turns>0;}
get isStunned(){return this.stun.turns>0;}
get hitpointsPercent(){return(100*this.hitpoints)/this.stats.maxHitpoints;}
get usingAncient(){return this.attackType==='magic'&&this.spellSelection.ancient!==undefined;}
get isUsingArchaic(){return this.attackType==='magic'&&this.spellSelection.archaic!==undefined;}
get isBurning(){return this.isDotActive('Burn');}
get isBleeding(){return this.isDotActive('Bleed');}
get isPoisoned(){return this.isDotActive('Poison');}
isDotActive(type){let active=false;this.activeDOTs.forEach((dot)=>{if(dot.type===type)
active=true;});return active;}
isEffectSubtypeActive(type){let active=false;switch(type){case 'Frostburn':active=this.frostBurnCount>0;break;case 'Slow':active=this.slowCount>0;break;}
return active;}
isTargetDotActive(type){return this.manager.fightInProgress&&this.target.isDotActive(type);}
isFightingTypeVsType(thisType,targetType){return this.manager.fightInProgress&&this.attackType===thisType&&this.target.attackType===targetType;}
isFighting(){return this.manager.fightInProgress;}
get minHitFromMaxHitPercent(){let percent=this.modifiers.getMinHitFromMaxHitModifier();if(this.attackType==='magic'&&this.spellSelection.standard!==undefined){const spell=this.spellSelection.standard;if(spell.spellType===SpellTypes.Nature)
percent+=this.modifiers.increasedMinNatureSpellDamageBasedOnMaxHit;}
return percent;}
setDefaultSpells(){this.spellSelection.standard=this.game.standardSpells.firstObject;}
setRenderAll(){this.rendersRequired.attackBar=true;this.rendersRequired.attackBarMinibar=true;this.rendersRequired.attacks=true;this.rendersRequired.damageSplash=true;this.rendersRequired.damageValues=true;this.effectRenderer.queueRemoveAll();this.rendersRequired.effects=true;this.rendersRequired.hitChance=true;this.rendersRequired.hitpoints=true;this.rendersRequired.passives=true;this.rendersRequired.stats=true;}
applyUniqueSpawnEffects(){if(this.modifiers.applyRandomCurseOnSpawn>0){this.applyRandomCurseEffect(100,this.target);}
if(this.modifiers.applyMadnessCurseOnSpawn>0){this.applyCurseEffect(new CurseEffect({effectType:'Curse',curse:"melvorTotH:Madness",},this.game),this.target);}
if(this.modifiers.applyTormentCurseOnSpawn>0){this.applyCurseEffect(new CurseEffect({effectType:'Curse',curse:"melvorTotH:Torment",},this.game),this.target);}
if(this.modifiers.applyDespairCurseOnSpawn>0){this.applyCurseEffect(new CurseEffect({effectType:'Curse',curse:"melvorTotH:Despair",},this.game),this.target);}}
initializeForCombat(){this.computeCombatStats();this.rendersRequired.attackBar=true;this.rendersRequired.attackBarMinibar=true;}
stopFighting(){this.timers.act.stop();this.isAttacking=false;this.removeAllEffects(false);this.initializeForCombat();this.target=this;}
computeAttackInterval(){let attackInterval=this.equipmentStats.attackSpeed||4000;attackInterval=this.modifyAttackInterval(attackInterval);attackInterval=roundToTickInterval(attackInterval);attackInterval=Math.max(attackInterval,250);this.stats.attackInterval=attackInterval;}
computeMinHit(){let minHit=1;minHit=this.modifyMinHit(minHit);this.stats.minHit=minHit;}
computeMaxHP(){let maxHP=numberMultiplier*this.levels.Hitpoints;maxHP=this.modifyMaxHP(maxHP);this.stats.maxHitpoints=maxHP;if(this.hitpoints>=maxHP)
this.setHitpoints(maxHP);}
computeAccuracy(){let accuracy=Character.calculateStandardStat(this.getAccuracyValues());accuracy=this.modifyAccuracy(accuracy);this.stats.accuracy=accuracy;}
computeMaxHit(){let maxHit;switch(this.attackType){case 'magic':maxHit=this.computeMagicMaxHit();break;case 'ranged':maxHit=this.computeRangedMaxHit();break;case 'melee':maxHit=this.computeMeleeMaxHit();break;default:throw new Error(`Invalid Attack Type: ${this.attackType}`);}
maxHit=this.modifyMaxHit(maxHit);this.stats.maxHit=maxHit;}
computeMeleeMaxHit(){return Character.calculateStandardMaxHit(this.levels.Strength,this.equipmentStats.meleeStrengthBonus);}
computeRangedMaxHit(){return Character.calculateStandardMaxHit(this.levels.Ranged,this.equipmentStats.rangedStrengthBonus);}
computeMagicMaxHit(){var _a;if(this.spellSelection.ancient!==undefined){return numberMultiplier*this.spellSelection.ancient.specialAttack.damage[0].maxPercent;}
const spell=(_a=this.spellSelection.standard)!==null&&_a!==void 0?_a:this.spellSelection.archaic;if(spell!==undefined){return Math.floor(numberMultiplier*spell.maxHit*(1+this.equipmentStats.magicDamageBonus/100)*(1+(this.levels.Magic+1)/200));}
else{console.warn('Calculating Magic Max Hit, but no spell is selected.');return 0;}}
computeEvasion(){const evasion={melee:Character.calculateStandardStat({effectiveLevel:this.levels.Defence,bonus:this.getMeleeDefenceBonus(),}),ranged:Character.calculateStandardStat({effectiveLevel:this.levels.Defence,bonus:this.getRangedDefenceBonus(),}),magic:Character.calculateStandardStat({effectiveLevel:Math.floor(this.levels.Defence*0.3+this.levels.Magic*0.7),bonus:this.getMagicDefenceBonus(),}),};this.modifyEvasion(evasion);Object.assign(this.stats.evasion,evasion);}
getMeleeDefenceBonus(){return this.equipmentStats.meleeDefenceBonus;}
getRangedDefenceBonus(){return this.equipmentStats.rangedDefenceBonus;}
getMagicDefenceBonus(){return this.equipmentStats.magicDefenceBonus;}
computeDamageReduction(){let reduction=this.equipmentStats.damageReduction;reduction=this.modifyDamageReduction(reduction);reduction=Math.floor(reduction);this.stats.damageReduction=clampValue(reduction,0,95);}
static calculateStandardStat(values){return(values.effectiveLevel+9)*(values.bonus+64);}
static calculateStandardMaxHit(baseLevel,strengthBonus){const effectiveLevel=baseLevel+9;return Math.floor(numberMultiplier*(1.3+effectiveLevel/10+strengthBonus/80+(effectiveLevel*strengthBonus)/640));}
modifyAccuracy(accuracy){let accuracyModifier=this.modifiers.getAccuracyModifier(this.attackType);if(this.attackType==='magic'){if(this.spellSelection.standard!==undefined){switch(this.spellSelection.standard.spellTier){case SpellTiers.Surge:accuracyModifier+=this.modifiers.increasedSurgeSpellAccuracy;break;}}
else if(this.spellSelection.archaic!==undefined){switch(this.spellSelection.archaic.spellType){case ArchaicSpellTypeID.Poison:accuracyModifier+=this.modifiers.increasedPoisonSpellAccuracy;break;case ArchaicSpellTypeID.Infernal:accuracyModifier+=this.modifiers.increasedInfernalSpellAccuracy;break;case ArchaicSpellTypeID.Lightning:accuracyModifier+=this.modifiers.increasedLightningSpellAccuracy;break;}}}
accuracy=applyModifier(accuracy,accuracyModifier);if(this.modifiers.globalAccuracyHPScaling>0){const modifier=(this.modifiers.globalAccuracyHPScaling*this.hitpointsPercent)/100;accuracy=Math.floor(accuracy*modifier);}
return accuracy;}
modifyEvasion(evasion){let evasionMeleeModifier=this.modifiers.getEvasionModifier('melee');let evasionRangedModifier=this.modifiers.getEvasionModifier('ranged');let evasionMagicModifier=this.modifiers.getEvasionModifier('magic');if(this.modifiers.decreasedEvasionBasedOnDR>0){const baseDR=this.equipmentStats.damageReduction;evasionMeleeModifier-=Math.floor((baseDR/2)*this.modifiers.decreasedEvasionBasedOnDR);evasionRangedModifier-=Math.floor((baseDR/2)*this.modifiers.decreasedEvasionBasedOnDR);evasionMagicModifier-=Math.floor((baseDR/2)*this.modifiers.decreasedEvasionBasedOnDR);}
if(this.manager.fightInProgress){let globalBonus=0;switch(this.target.attackType){case 'melee':globalBonus+=this.modifiers.increasedEvasionAgainstMelee;break;case 'ranged':globalBonus+=this.modifiers.increasedEvasionAgainstRanged;break;case 'magic':globalBonus+=this.modifiers.increasedEvasionAgainstMagic;break;}
evasionMeleeModifier+=globalBonus;evasionRangedModifier+=globalBonus;evasionMagicModifier+=globalBonus;}
evasion.melee=applyModifier(evasion.melee,evasionMeleeModifier);evasion.ranged=applyModifier(evasion.ranged,evasionRangedModifier);evasion.magic=applyModifier(evasion.magic,evasionMagicModifier);if(this.modifiers.globalEvasionHPScaling>0){const modifier=(this.modifiers.globalEvasionHPScaling*this.hitpointsPercent)/100;evasion.melee=Math.floor(evasion.melee*modifier);evasion.ranged=Math.floor(evasion.ranged*modifier);evasion.magic=Math.floor(evasion.magic*modifier);}}
modifyMaxHit(maxHit){if(this.usingAncient){return maxHit;}
let maxHitModifier=this.modifiers.getMaxHitModifier(this.attackType);if(this.attackType==='magic'&&this.spellSelection.standard!==undefined&&this.spellSelection.standard.spellTier===SpellTiers.Surge){maxHitModifier+=this.modifiers.increasedSurgeSpellMaxHit;}
switch(this.attackType){case 'melee':maxHitModifier+=(this.modifiers.increasedMeleeMaxHitBonusAgainstRanged-
this.modifiers.decreasedMeleeMaxHitBonusAgainstRanged)*this.getMaxHitMultiplierBasedOnEnemyAttackType();break;case 'ranged':maxHitModifier+=(this.modifiers.increasedRangedMaxHitBonusAgainstMagic-
this.modifiers.decreasedRangedMaxHitBonusAgainstMagic)*this.getMaxHitMultiplierBasedOnEnemyAttackType();break;case 'magic':maxHitModifier+=(this.modifiers.increasedMagicMaxHitBonusAgainstMelee-
this.modifiers.decreasedMagicMaxHitBonusAgainstMelee)*this.getMaxHitMultiplierBasedOnEnemyAttackType();break;}
if(this.manager.fightInProgress){maxHitModifier+=(this.modifiers.increasedMaxHitPercentBasedOnEnemyDamageReduction-
this.modifiers.decreasedMaxHitPercentBasedOnEnemyDamageReduction)*this.manager.enemy.stats.damageReduction;maxHitModifier+=(this.modifiers.increasedMaxHitPercentBasedOnDamageReduction-
this.modifiers.decreasedMaxHitPercentBasedOnDamageReduction)*this.stats.damageReduction;}
maxHit=applyModifier(maxHit,maxHitModifier);maxHit+=numberMultiplier*this.modifiers.getMaxHitFlatModifier(this.attackType);if(this.attackType==='magic'&&this.spellSelection.standard!==undefined){maxHit+=numberMultiplier*this.modifiers.getSpellMaxHitModifier(this.spellSelection.standard.spellType);}
maxHit=Math.max(maxHit,1);return maxHit;}
getMaxHitMultiplierBasedOnEnemyAttackType(){let multiplier=1;if(this.manager.fightInProgress){const enemyAttackType=this.manager.enemy.attackType;switch(enemyAttackType){case 'melee':if(this.attackType==='magic')
multiplier=3;break;case 'ranged':if(this.attackType==='melee')
multiplier=3;break;case 'magic':if(this.attackType==='ranged')
multiplier=3;break;}}
return multiplier;}
modifyMinHit(minHit){minHit+=Math.floor((this.stats.maxHit*this.minHitFromMaxHitPercent)/100);minHit+=numberMultiplier*this.modifiers.getFlatMinHitModifier();if(this.attackType==='magic'&&this.spellSelection.standard!==undefined){minHit+=numberMultiplier*this.modifiers.getSpellMinHitModifier(this.spellSelection.standard.spellType);}
else if(this.attackType==='magic'&&this.spellSelection.archaic!==undefined){minHit+=numberMultiplier*this.modifiers.getArchaicMinHitModifier(this.spellSelection.archaic);if(this.spellSelection.archaic.id==="melvorTotH:MeteorShower")
minHit+=numberMultiplier*this.modifiers.increasedMinMeteorShowerSpellDamage;}
minHit=clampValue(minHit,1,this.stats.maxHit);return minHit;}
modifyMaxHP(maxHP){maxHP+=numberMultiplier*this.modifiers.getMaxHPFlatModifier();maxHP=applyModifier(maxHP,this.modifiers.getMaxHPPercentModifier());maxHP=Math.max(maxHP,numberMultiplier);return maxHP;}
modifyAttackInterval(attackInterval){attackInterval=applyModifier(attackInterval,this.modifiers.getAttackIntervalModifier());attackInterval+=this.modifiers.getFlatAttackIntervalModifier();return attackInterval;}
modifyDamageReduction(reduction){reduction+=this.modifiers.getFlatDamageReductionModifier();if(this.manager.fightInProgress){switch(this.target.attackType){case 'melee':reduction+=this.modifiers.increasedDamageReductionAgainstMelee-this.modifiers.decreasedDamageReductionAgainstMelee;break;case 'ranged':reduction+=this.modifiers.increasedDamageReductionAgainstRanged-this.modifiers.decreasedDamageReductionAgainstRanged;break;case 'magic':reduction+=this.modifiers.increasedDamageReductionAgainstMagic-this.modifiers.decreasedDamageReductionAgainstMagic;break;}}
reduction*=1+(this.modifiers.increasedDamageReductionPercent-this.modifiers.decreasedDamageReductionPercent)/100;if(this.modifiers.halveDamageReduction>0)
reduction*=0.5;return reduction;}
computeAllStats(){this.computeAttackType();this.computeModifiers();this.computeAttackSelection();this.computeLevels();this.computeEquipmentStats();this.computeCombatStats();}
computeCombatStats(){this.computeMaxHP();this.updateHPConditionals(false);this.computeDamageReduction();this.computeAccuracy();this.computeEvasion();this.computeMaxHit();this.computeMinHit();this.computeAttackInterval();if(this.manager.fightInProgress){this.computeHitchance();this.target.computeHitchance();this.target.rendersRequired.damageValues=true;}
this.rendersRequired.stats=true;this.rendersRequired.damageValues=true;}
updateHPConditionals(computeStats=true){if((this.modifiers.globalEvasionHPScaling>0||this.modifiers.globalAccuracyHPScaling>0)&&computeStats)
this.computeCombatStats();}
computeHitchance(){const protection=this.target.modifiers.getProtectionValue(this.attackType);if(protection!==0){this.hitchance=100-protection;}
else{const targetEvasion=this.target.stats.evasion[this.attackType];const accuracy=this.stats.accuracy;if(accuracy<targetEvasion){this.hitchance=((0.5*accuracy)/targetEvasion)*100;}
else{this.hitchance=(1-(0.5*targetEvasion)/accuracy)*100;}}
this.rendersRequired.hitChance=true;}
damage(amount,source){if(source==='Burn'&&this.target.modifiers.increasedMaxHPBurnDamage>0)
amount+=Math.floor((this.stats.maxHitpoints*(this.target.modifiers.increasedMaxHPBurnDamage/100))/10);this.addHitpoints(-amount);this.splashManager.add({source:source,amount:-amount,xOffset:this.hitpointsPercent,});if(this.hitpoints<=0&&rollPercentage(this.modifiers.increasedRebirthChance)){this.heal(this.stats.maxHitpoints);if(this.modifiers.applyRandomCurseOnSpawn>0){this.applyRandomCurseEffect(100,this.target);}}
this.rendersRequired.damageSplash=true;}
heal(amount){amount=Math.min(amount,this.stats.maxHitpoints-this.hitpoints);this.addHitpoints(amount);this.splashManager.add({source:'Heal',amount,xOffset:this.hitpointsPercent,});this.rendersRequired.damageSplash=true;return amount;}
addHitpoints(amount){this.hitpoints+=amount;this.rendersRequired.hitpoints=true;if(this.manager.fightInProgress){this.target.rendersRequired.damageValues=true;this.rendersRequired.damageValues=true;}
this.updateHPConditionals(true);}
setHitpoints(value){this.hitpoints=value;this.rendersRequired.hitpoints=true;}
isImmuneTo(attackType){return(this.modifiers.getImmunity(attackType)||(this.modifiers.otherStyleImmunity>0&&attackType!==this.attackType));}
fireMissSplash(immune){const text=getLangString('COMBAT_MISC',immune?'IMMUNE':'MISS');this.splashManager.add({source:'Attack',amount:0,text,xOffset:this.hitpointsPercent,});this.rendersRequired.damageSplash=true;}
applyEffects(effects,target,damage=0,attack=this.nextAttack){let blockedIndexes=0;effects.forEach((effect,i,array)=>{if(effect.type==='Compound'){blockedIndexes=effect.numEffects+1;if(rollPercentage(effect.chance)){const effectIndex=i+rollInteger(1,effect.numEffects);this.applyEffect(array[effectIndex],target,damage,attack);}}
if(blockedIndexes<=0)
this.applyEffect(effect,target,damage,attack);blockedIndexes--;});}
attack(target,attack){const targetImmune=target.isImmuneTo(this.attackType);let damage=0;if(!targetImmune){this.applyEffects(attack.prehitEffects,target);if(this.canCurse&&this.spellSelection.curse!==undefined){this.castCurseSpell(target,this.spellSelection.curse);}}
const attackHit=!targetImmune&&this.rollToHit(target,attack);if(attackHit){damage=attack.damage.reduce(damageReducer(this,target),0);const crit=rollPercentage(this.modifiers.getCritChance(this.attackType));if(crit){damage*=1.5;}
const preModDamage=damage;damage=this.modifyAttackDamage(target,attack,damage);damage=Math.min(damage,target.hitpoints);target.damage(damage,crit?'Crit':'Attack');this.lifesteal(attack,damage);let damageTaken=0;if(this.firstHit){let reflectDamage=(damage*target.modifiers.getReflectPercent())/100;reflectDamage+=numberMultiplier*target.modifiers.getFlatReflectDamage();reflectDamage+=rollInteger(0,numberMultiplier*target.modifiers.getRolledReflectDamage());reflectDamage=target.applyDamageModifiers(this,reflectDamage);reflectDamage*=1-this.stats.damageReduction/100;reflectDamage=Math.floor(reflectDamage);if(reflectDamage<this.hitpoints)
damageTaken+=reflectDamage;if(rollPercentage(this.target.modifiers.increasedPoisonReflectChance)){this.target.applyDOT(poisonEffect,this,0);}
if(rollPercentage(this.target.modifiers.increasedBleedReflectChance)){this.target.applyDOT(bleedReflectEffect,this,damage);}
damageTaken+=Math.floor((this.hitpoints*this.modifiers.increasedConfusion)/100);damageTaken+=Math.floor((this.stats.maxHitpoints*this.modifiers.increasedDecay)/100);}
damageTaken=Math.min(damageTaken,this.hitpoints);if(damageTaken>0)
this.damage(damageTaken,'Attack');this.applyEffects(attack.onhitEffects,target,preModDamage);const globalStunChance=this.modifiers.increasedGlobalStunChance-this.modifiers.decreasedGlobalStunChance;let applyStun=this.modifiers.increasedMeleeStunThreshold>0&&this.attackType==='melee'&&preModDamage/this.stats.maxHit>=this.modifiers.increasedMeleeStunThreshold/100;applyStun||(applyStun=this.attackType==='melee'&&rollPercentage(this.modifiers.increasedMeleeStunChance+globalStunChance));applyStun||(applyStun=rollPercentage(globalStunChance));if(applyStun){const chanceToAvoid=this.modifiers.increasedChanceToAvoidStun-this.modifiers.decreasedChanceToAvoidStun;if(!rollPercentage(chanceToAvoid))
this.applyStun({chance:100,turns:1,type:'Stun',flavour:'Stun',},target);}
const globalSleepChance=this.modifiers.increasedGlobalSleepChance-this.modifiers.decreasedGlobalSleepChance;const applySleep=rollPercentage(globalSleepChance);if(applySleep){const chanceToAvoid=this.modifiers.increasedChanceToAvoidSleep-this.modifiers.decreasedChanceToAvoidSleep;if(!rollPercentage(chanceToAvoid))
this.applySleep({chance:100,turns:1,type:'Sleep',},target);}
if(this.attackType==='magic'&&rollPercentage(this.modifiers.increasedElementalEffectChance)){this.applyEffects(elementalEffects,target,0,this.game.normalAttack);}
if(rollPercentage(this.modifiers.increasedChanceToApplyPoison)){this.applyDOT(poisonEffect,target,0);}
if((target.isPoisoned&&rollPercentage(this.modifiers.increasedChanceToApplyDeadlyPoisonWhenPoisoned-
this.modifiers.decreasedChanceToApplyDeadlyPoisonWhenPoisoned))||rollPercentage(this.modifiers.increasedChanceToApplyDeadlyPoison)){this.applyDOT(deadlyPoisonEffect,target,0);}
if(this.modifiers.increasedOnHitSlowMagnitude>0){this.applyModifierEffect(new SlowEffect(this.modifiers.increasedOnHitSlowMagnitude,2),target,this.game.normalAttack);}
else{const globalSpecificSlowChance=this.modifiers.increased15SlowStunChance2Turns-this.modifiers.decreased15SlowStunChance2Turns;const applySlow=rollPercentage(globalSpecificSlowChance);if(applySlow){this.applyModifierEffect(new SlowEffect(15,2),target,this.game.normalAttack);}}
if(this.modifiers.increased30Slow5TurnsChance>0&&rollPercentage(this.modifiers.increased30Slow5TurnsChance)){this.applyModifierEffect(new SlowEffect(30,5),target,this.game.normalAttack);}
target.reflexiveEffects.forEach((activeEffect,effect)=>{if(activeEffect.stacks<effect.maxStacks){activeEffect.stacks++;target.modifiers.addModifiers(effect.modifiers);target.computeCombatStats();target.rendersRequired.effects=true;}});this.comboEffects.forEach((activeEffect,effect)=>{if(activeEffect.sourceAttack===attack&&activeEffect.stacks<effect.maxStacks){activeEffect.stacks++;this.modifiers.addModifiers(effect.modifiers);this.computeCombatStats();this.rendersRequired.effects=true;}});this.onHit();target.onBeingHit();this.firstHit=false;}
else{this.removeComboEffects();this.computeCombatStats();target.fireMissSplash(targetImmune);this.onMiss();}
if(!targetImmune){if(rollPercentage(this.modifiers.increasedChanceToApplyBurn-this.modifiers.decreasedChanceToApplyBurn)){this.applyDOT(burnEffect,target,0);}
if(rollPercentage(this.modifiers.increasedChanceToApplyFrostburn)){this.applyModifierEffect(frostBurnEffect,this.target,this.game.normalAttack);}
if(rollPercentage(this.modifiers.increasedChanceToApplyShock)){this.applyModifierEffect(shockEffect,this.target,this.game.normalAttack);}
if(rollPercentage(this.modifiers.increasedChanceToApplyDecayCurse)){const decay=this.game.curseSpells.getObjectByID("melvorF:Decay");if(decay!==undefined)
this.applyCurse(this.target,decay);}
if(rollPercentage(this.modifiers.increasedChanceDarkBlade)){this.applyModifierEffect(darkBladeEffect,this.target,this.game.normalAttack);}
if(this.target.modifiers.increasedAbsorbingSkin>0){this.applyModifierEffect(absorbingSkinEffect,this.target,this.game.normalAttack);}
if(this.target.modifiers.increasedRage>0){this.applyModifierEffect(rageEffect,this.target,this.game.normalAttack);}
if(this.modifiers.increasedAssassin>0){this.applyModifierEffect(assassinEffect,this.target,this.game.normalAttack);}
if(this.modifiers.increasedDuality>0&&rollPercentage(50)){this.applyModifierEffect(dualityEffect,this.target,this.game.normalAttack);}
if(this.modifiers.growingMadnessPassive>0){this.applyModifierEffect(growingMadnessEffect,this,this.game.normalAttack);}
if(this.modifiers.momentInTimePassive>0){this.applyModifierEffect(momentInTimeEffect,this,this.game.normalAttack);}
if(this.modifiers.reignOverTimePassive>0){this.applyModifierEffect(reignOverTimeEffect,this,this.game.normalAttack);}
if(this.attackCount===0&&rollPercentage(this.modifiers.increasedAfflictionChance)){this.applyModifierEffect(afflictionEffect,this.target,this.game.normalAttack);}}
if(this.attackCount===0){const dmgModifier=this.modifiers.increasedFrostburn+
this.modifiers.increasedDamageTakenPerAttack-
this.modifiers.decreasedDamageTakenPerAttack;const damageTaken=Math.floor((this.hitpoints*dmgModifier)/100);if(damageTaken>0)
this.damage(damageTaken,'Attack');}
if(attackHit){if(rollPercentage(this.target.modifiers.increasedChanceToApplySleepToTargetWhenHit)){this.target.applySleep({chance:100,turns:2,type:'Sleep'},this,false);}}
target.postAttack(attack,this.attackType);this.attackCount++;if(attack.consumeStacks!==undefined){let maxAttacks=attack.attackCount;const existingStacks=target.stackingEffect.get(attack.consumeStacks);if(existingStacks!==undefined)
maxAttacks+=existingStacks.stacks;this.isAttacking=this.attackCount<maxAttacks;if(!this.isAttacking&&existingStacks!==undefined){target.removeStackingEffect(attack.consumeStacks);target.computeCombatStats();}}
else{this.isAttacking=this.attackCount<attack.attackCount;}
return damage;}
modifyAttackDamage(target,attack,damage){damage=this.applyDamageModifiers(target,damage);if(attack.isDragonbreath)
damage*=1-target.modifiers.decreasedDragonBreathDamage/100;damage*=1-target.stats.damageReduction/100;return Math.floor(damage);}
getAttackMaxDamage(attack){const computeDamage=(damage,prevDamage)=>getMaxDamage(damage,this,this.target,prevDamage);let allHitDamage=0;const specificHitDamage=new Map();attack.damage.forEach((damage)=>{var _a;if(damage.attackCount!==undefined){let existingDamage=(_a=specificHitDamage.get(damage.attackCount))!==null&&_a!==void 0?_a:allHitDamage;existingDamage+=computeDamage(damage,existingDamage);specificHitDamage.set(damage.attackCount,existingDamage);}
else{allHitDamage+=computeDamage(damage,allHitDamage);specificHitDamage.forEach((specificDamage,attackCount)=>{specificHitDamage.set(attackCount,specificDamage+computeDamage(damage,specificDamage));});}});const maxHit=Math.max(allHitDamage,...specificHitDamage.values());return this.modifyAttackDamage(this.target,this.game.normalAttack,maxHit);}
lifesteal(attack,damage){if(this.modifiers.disableLifesteal>0)
return 0;let lifesteal=this.modifiers.getLifesteal(this.attackType)+attack.lifesteal;if(this.target.curse!==undefined)
lifesteal+=this.modifiers.increasedCurseLifesteal;if(this.modifiers.doubleLifesteal>0)
lifesteal*=2;let healing=Math.floor((damage*lifesteal)/100);if(healing>0)
healing=this.heal(healing);return healing;}
removeStackingEffect(effect){const activeEffect=this.stackingEffect.get(effect);if(activeEffect===undefined)
throw new Error('Tried to remove stacking effect that does not exist');this.stackingEffect.delete(effect);this.effectRenderer.queueRemoval(activeEffect);this.modifiers.subModifiers(effect.modifiers);this.rendersRequired.effects=true;}
onBeingHit(){}
rollToHit(target,attack){if(target.modifiers.getProtectionValue(this.attackType)===100)
return false;if(target.isStunned||target.isSleeping||(attack.cantMiss&&this.stats.accuracy>=attack.minAccuracy))
return true;const maxRolls=Math.min(1+this.modifiers.increasedAttackRolls-this.modifiers.decreasedAttackRolls,2);let hit=false;for(let i=0;i<maxRolls;i++){hit=rollPercentage(this.hitchance);if(hit)
break;}
return hit;}
addAuroraModifiers(){if(this.canAurora&&this.spellSelection.aurora!==undefined){this.modifiers.addModifiers(this.spellSelection.aurora.modifiers);}}
addCurseModifiers(){if(this.curse!==undefined){this.modifiers.addModifiers(this.curse.data.targetModifiers);}}
addEffectModifiers(){const addModifiers=(attackMap)=>{attackMap.forEach((effectData,effect)=>{this.modifiers.addModifiers(effect.modifiers,effectData.stacks,effectData.stacks);});};this.modifierEffects.fromSelf.countSelf.forEach(addModifiers);this.modifierEffects.fromSelf.countTarget.forEach(addModifiers);this.modifierEffects.fromTarget.countSelf.forEach(addModifiers);this.modifierEffects.fromTarget.countTarget.forEach(addModifiers);this.stackingEffect.forEach((activeEffect,effect)=>{this.modifiers.addModifiers(effect.modifiers);});this.reflexiveEffects.forEach((activeReflex,effect)=>{if(activeReflex.stacks>0)
this.modifiers.addModifiers(effect.modifiers,activeReflex.stacks,activeReflex.stacks);});this.comboEffects.forEach((activeEffect,effect)=>{if(activeEffect.stacks>0)
this.modifiers.addModifiers(effect.modifiers,activeEffect.stacks,activeEffect.stacks);});}
addCombatAreaEffectModifiers(){if(this.manager.fightInProgress)
this.modifiers.addModifiers(this.manager.enemyAreaModifiers);}
addPassiveModifiers(){this.passives.forEach((_,passive)=>{this.modifiers.addModifiers(passive.modifiers);});}
addTargetModifiers(){if(this.manager.fightInProgress)
this.target.targetModifiers.addToCombatModifiers(this.modifiers);}
getDamageModifiers(target){let totalModifier=target.modifiers.increasedDamageTaken-target.modifiers.decreasedDamageTaken;if(target.isStunned){totalModifier+=30;totalModifier+=target.modifiers.increasedDamageTakenWhenStunned;totalModifier-=target.modifiers.decreasedDamageTakenWhenStunned;}
if(target.isSleeping){totalModifier+=20;totalModifier+=target.modifiers.increasedDamageTakenWhenAsleep;totalModifier-=target.modifiers.decreasedDamageTakenWhenAsleep;}
if(target.isPoisoned){totalModifier+=this.modifiers.increasedDamageDealtIfPoisoned;totalModifier-=this.modifiers.decreasedDamageDealtIfPoisoned;}
return totalModifier;}
applyDamageModifiers(target,damage){damage*=1+this.getDamageModifiers(target)/100;return damage;}
removeAllEffects(removeDOTS=false){this.reflexiveEffects.forEach((active,effect)=>{this.modifiers.subModifiers(effect.modifiers,active.stacks,active.stacks);});this.reflexiveEffects.clear();this.stackingEffect.forEach((active,effect)=>{this.modifiers.subModifiers(effect.modifiers);});this.stackingEffect.clear();let effectRemoved=false;effectRemoved=this.removeModifierEffects(this.modifierEffects.fromSelf.countSelf)||effectRemoved;effectRemoved=this.removeModifierEffects(this.modifierEffects.fromSelf.countTarget)||effectRemoved;effectRemoved=this.removeModifierEffects(this.modifierEffects.fromTarget.countSelf)||effectRemoved;effectRemoved=this.removeModifierEffects(this.modifierEffects.fromTarget.countTarget)||effectRemoved;if(effectRemoved){this.onModifierEffectRemoval();this.target.onTargetModifierEffectRemoval();}
this.slowCount=0;this.frostBurnCount=0;if(this.isStunned){this.stun.turns=0;this.onStunRemoval();this.target.onTargetStunRemoval();}
if(this.isSleeping){this.sleep.turns=0;this.onSleepRemoval();this.target.onTargetSleepRemoval();}
if(this.curse!==undefined){this.modifiers.subModifiers(this.curse.data.targetModifiers);}
this.curse=undefined;if(removeDOTS){this.activeDOTs.forEach((activeDOT,id)=>{this.activeDOTs.delete(id);this.onDOTRemoval(activeDOT.type,false);this.target.onTargetDOTRemoval(activeDOT.type,false);});}
this.stunImmunity.turns=0;this.removeComboEffects();this.effectRenderer.queueRemoveAll();this.rendersRequired.effects=true;}
removeComboEffects(){this.comboEffects.forEach((activeEffect,effect)=>{this.effectRenderer.queueRemoval(activeEffect);this.modifiers.subModifiers(effect.modifiers,activeEffect.stacks,activeEffect.stacks);});this.comboEffects.clear();this.rendersRequired.effects=true;}
addPassives(passives,save=false,display=true,statUpdate=true){passives.forEach((passive)=>{this.passives.set(passive,{save,display});this.modifiers.addModifiers(passive.modifiers);});this.rendersRequired.passives=true;if(statUpdate)
this.computeCombatStats();}
removePassives(passives){passives.forEach((passive)=>{this.passives.delete(passive);this.modifiers.subModifiers(passive.modifiers);});this.rendersRequired.passives=true;this.computeCombatStats();}
removeAllPassives(){this.passives.forEach((_,passive)=>{this.modifiers.subModifiers(passive.modifiers);});this.passives.clear();this.rendersRequired.passives=true;this.computeCombatStats();}
applyEffect(effect,target,damage=0,attack=this.nextAttack){switch(effect.type){case 'DOT':this.applyDOT(effect,target,damage);break;case 'Reflexive':this.applyReflexiveEffect(effect,attack);break;case 'Stacking':this.applyStackingEffect(effect,target);break;case 'Modifier':this.applyModifierEffect(effect,target,attack);break;case 'Sleep':this.applySleep(effect,target);break;case 'Stun':this.applyStun(effect,target);break;case 'Combo':this.applyComboEffect(effect,attack);break;case 'Curse':this.applyCurseEffect(effect,target);break;case 'Compound':throw new Error('Compound effects cannot be applied directly.');}}
applyStackingEffect(effect,target){if(target.modifiers.debuffImmunity!==0)
return;let existingStacks=target.stackingEffect.get(effect);if(existingStacks===undefined){existingStacks={stacks:0,};target.stackingEffect.set(effect,existingStacks);target.modifiers.addModifiers(effect.modifiers);target.computeCombatStats();target.rendersRequired.effects=true;}
existingStacks.stacks+=effect.stacksToAdd;existingStacks.stacks=Math.min(existingStacks.stacks,effect.maxStacks);}
applyReflexiveEffect(effect,attack){let existingEffect=this.reflexiveEffects.get(effect);if(existingEffect===undefined){existingEffect={stacks:0,sourceAttack:attack,turnsLeft:effect.turns+1,};this.reflexiveEffects.set(effect,existingEffect);this.rendersRequired.effects=true;}}
applyComboEffect(effect,attack){if(this.comboEffects.get(effect)===undefined){this.comboEffects.set(effect,{sourceAttack:attack,stacks:0,});}}
castCurseSpell(target,curse){this.applyCurse(target,curse);}
applyCurse(target,curse){if(target.curse!==undefined||target.modifiers.curseImmunity||rollPercentage(target.modifiers.increasedChanceToAvoidCurses))
return;target.curse={turns:3,data:curse,};target.modifiers.addModifiers(curse.targetModifiers);target.computeCombatStats();target.rendersRequired.effects=true;this.rendersRequired.damageValues=true;}
combatModifierUpdate(){this.computeModifiers();this.computeCombatStats();}
immuneToDOT(type){let immune=false;switch(type){case 'Bleed':immune=rollPercentage(this.modifiers.bleedImmunity);break;case 'Burn':immune=rollPercentage(this.modifiers.burnImmunity);break;case 'Poison':case 'DeadlyPoison':immune=rollPercentage(this.modifiers.poisonImmunity);break;}
return immune;}
applyDOT(effect,target,damageDealt){if(!rollPercentage(effect.chance)||target.immuneToDOT(effect.subtype))
return false;if(effect.subtype==='Regen')
target=this;if(!this.manager.allowDuplicateDOTS){let duplicated=false;target.activeDOTs.forEach((dot)=>{if(dot.type===effect.subtype)
duplicated=true;});if(duplicated)
return false;}
let totalDamage=effect.damage.reduce(damageReducer(this,target,damageDealt),0);if(effect.subtype==='Bleed')
totalDamage+=numberMultiplier*this.modifiers.increasedTotalBleedDamage;if(effect.subtype!=='Regen'){totalDamage=this.applyDamageModifiers(target,totalDamage);totalDamage*=1+this.modifiers.getDOTDamageModifier(effect.subtype)/100;totalDamage*=1-target.stats.damageReduction/100;}
let procDamage=Math.floor(totalDamage/effect.procs);procDamage=Math.max(procDamage,1);if(totalDamage===0)
return false;const dotID=this.manager.dotID;const dotData={type:effect.subtype,damage:procDamage,procsLeft:effect.procs,interval:effect.interval,timer:new Timer('DOT',()=>target.dot(dotID)),};dotData.timer.start(dotData.interval);target.activeDOTs.set(dotID,dotData);target.rendersRequired.effects=true;target.onDOTApplication(effect.subtype);return true;}
onDOTApplication(type){}
onDOTRemoval(type,statUpdate=true){}
onTargetDOTRemoval(type,statUpdate=true){}
onModifierEffectApplication(){}
onModifierEffectRemoval(){}
onTargetModifierEffectRemoval(){}
onTargetModifierEffectApplication(){}
getModifierEffectAttackMap(effect){let countedMods;let attackMods;switch(effect.character){case 'Attacker':countedMods=this.modifierEffects.fromSelf;switch(effect.countsOn){case 'Attacker':attackMods=countedMods.countSelf;break;case 'Target':attackMods=countedMods.countTarget;break;}
break;case 'Target':countedMods=this.target.modifierEffects.fromTarget;switch(effect.countsOn){case 'Attacker':attackMods=countedMods.countTarget;break;case 'Target':attackMods=countedMods.countSelf;break;}
break;}
return attackMods;}
applyRandomCurseEffect(chance,target){if(!rollPercentage(chance))
return;const randomCurse=getRandomArrayElement(this.game.curseSpells.allObjects);this.applyCurse(target,randomCurse);}
applyCurseEffect(effect,target){if(effect.isRandom){this.applyRandomCurseEffect(effect.chance,target);return;}
const chance=effect.chance;if(!rollPercentage(chance))
return;this.applyCurse(target,effect.curse);}
applyModifierEffect(effect,target,attack){if(effect.character==='Target'&&target.modifiers.debuffImmunity>0)
return;const isSlow=effect instanceof SlowEffect;const isFrostburn=effect===frostBurnEffect;if(effect.character==='Target'&&isSlow&&rollPercentage(target.modifiers.slowImmunity))
return;if(isFrostburn&&rollPercentage(target.modifiers.frostBurnImmunity))
return;if(effect===afflictionEffect)
attack=this.game.normalAttack;let applied=false;const attackMap=this.getModifierEffectAttackMap(effect);let effectMap=attackMap.get(attack);if(effectMap===undefined){effectMap=new Map();attackMap.set(attack,effectMap);}
let activeData=effectMap.get(effect);if(isSlow&&attack===this.game.normalAttack){effectMap.forEach((active,effect)=>{if(effect instanceof SlowEffect)
activeData=active;});}
if(activeData===undefined){activeData={turnsLeft:effect.turns+1,stacks:1,};effectMap.set(effect,activeData);applied=true;}
else if(effect.maxStacks>activeData.stacks){const stacksToAdd=effect.stacksToAdd+activeData.stacks>effect.maxStacks?effect.stacksToAdd-activeData.stacks:effect.stacksToAdd;activeData.stacks+=stacksToAdd;applied=true;}
if(applied){let updateCharacter;switch(effect.character){case 'Attacker':updateCharacter=this;break;case 'Target':updateCharacter=target;break;}
if(isSlow)
updateCharacter.slowCount++;if(isFrostburn)
updateCharacter.frostBurnCount++;updateCharacter.rendersRequired.effects=true;updateCharacter.modifiers.addModifiers(effect.modifiers);if(effect.character==='Target')
this.onTargetModifierEffectApplication();updateCharacter.onModifierEffectApplication();updateCharacter.computeCombatStats();}}
applySleep(effect,target,interruptAttack=true){if(target.modifiers.sleepImmunity===0&&target.sleep.turns===0&&rollPercentage(effect.chance)&&(effect.hitpointThreshold===undefined||target.hitpointsPercent<=effect.hitpointThreshold)){target.sleep.turns=effect.turns;if(rollPercentage(this.modifiers.increasedChanceToIncreaseSleepDuration-this.modifiers.decreasedChanceToIncreaseSleepDuration))
target.sleep.turns++;if(interruptAttack)
target.queueNextAction();target.rendersRequired.effects=true;this.rendersRequired.damageValues=true;this.onApplyingSleep(target);target.onBeingSlept();}}
onBeingSlept(){const healOnSleep=this.modifiers.increasedHealWhenSleep-this.modifiers.decreasedHealWhenSleep;if(healOnSleep>0){const healing=Math.floor((this.stats.maxHitpoints*healOnSleep)/100);this.heal(healing);}}
onSleepRemoval(){}
onTargetSleepRemoval(){}
onApplyingSleep(target){if(this.modifiers.decreaseEnemyEvasionOnSleep>0)
this.applyModifierEffect(decreasedEvasionStackingEffect,target,this.game.normalAttack);}
applyStun(effect,target,interruptAttack=true){let immuneChance=0;const isStunImmune=effect.flavour==='Stun'&&target.stunImmunity.turns>0;if(effect.flavour==='Stun'||effect.flavour==='Freeze')
immuneChance+=target.modifiers.stunImmunity;if(effect.flavour==='Freeze')
immuneChance+=target.modifiers.freezeImmunity;if(target.stun.turns===0&&!isStunImmune&&rollPercentage(effect.chance)&&!rollPercentage(immuneChance)){target.stun.turns=effect.turns;if(effect.flavour==='Stun')
target.stunImmunity.turns=3;if(rollPercentage(this.modifiers.increasedChanceToIncreaseStunDuration))
target.stun.turns++;target.stun.flavour=effect.flavour;if(interruptAttack)
target.queueNextAction();target.rendersRequired.effects=true;this.rendersRequired.damageValues=true;this.onApplyingStun(target);target.onBeingStunned();}}
onBeingStunned(){const healOnStun=this.modifiers.increasedHealWhenStunned-this.modifiers.decreasedHealWhenStunned;if(healOnStun>0){const healing=Math.floor((this.stats.maxHitpoints*healOnStun)/100);this.heal(healing);}}
onStunRemoval(){}
onTargetStunRemoval(){}
onApplyingStun(target){if(this.modifiers.decreaseEnemyEvasionOnStun>0)
this.applyModifierEffect(decreasedEvasionStackingEffect,target,this.game.normalAttack);}
passiveTick(){this.timers.regen.tick();if(this.activeDOTs.size)
this.activeDOTs.forEach((dot)=>dot.timer.tick());}
activeTick(){this.timers.act.tick();}
getErrorLog(){var _a,_b,_c,_d;return `Next Action: ${this.nextAction}
Next Attack: ${this.nextAttack.id}
Is Attacking: ${this.isAttacking}
Standard Spell Selected: ${(_a=this.spellSelection.standard)===null||_a===void 0?void 0:_a.id}
Ancient Spell Selected ${(_b=this.spellSelection.ancient)===null||_b===void 0?void 0:_b.id}
Aurora Selected: ${(_c=this.spellSelection.aurora)===null||_c===void 0?void 0:_c.id}
Curse Selected: ${(_d=this.spellSelection.curse)===null||_d===void 0?void 0:_d.id}`;}
act(){let endOfTurn=true;switch(this.nextAction){case 'Attack':this.attack(this.target,this.nextAttack);endOfTurn=this.nextAttack.attackCount===this.attackCount||this.isStunned||this.isSleeping;break;case 'Nothing':break;default:throw new Error(`Invalid action type: ${this.nextAction}`);}
if(this.isStunned){this.stun.turns--;if(this.stun.turns===0){this.onStunRemoval();this.target.onTargetStunRemoval();this.effectRenderer.queueRemoval(this.stun);this.target.rendersRequired.damageValues=true;}
this.rendersRequired.effects=true;}
if(this.isSleeping){this.sleep.turns--;if(this.sleep.turns===0){this.onSleepRemoval();this.target.onTargetSleepRemoval();this.effectRenderer.queueRemoval(this.sleep);this.target.rendersRequired.damageValues=true;}
this.rendersRequired.effects=true;}
if(endOfTurn){this.turnsTaken++;if(this.stunImmunity.turns>0){this.stunImmunity.turns--;if(this.stunImmunity.turns===0)
this.effectRenderer.queueRemoval(this.stunImmunity);this.rendersRequired.effects=true;}
let eotHealing=0;if(this.turnsTaken%2===0){eotHealing+=Math.floor((this.modifiers.increasedEndOfTurnHealing2/100)*this.hitpoints);eotHealing+=Math.floor((this.modifiers.increasedEndOfTurnMaxHealing2/100)*this.stats.maxHitpoints);}
if(this.turnsTaken%3===0)
eotHealing+=Math.floor((this.modifiers.increasedEndOfTurnHealing3/100)*this.hitpoints);if(this.turnsTaken%5===0){eotHealing+=Math.floor((this.modifiers.increasedEndOfTurnHealing5/100)*this.hitpoints);}
if(eotHealing>0)
this.heal(eotHealing);let statUpdateRequired=false;if(this.curse!==undefined){this.curse.turns--;if(this.curse.turns===0){statUpdateRequired=true;this.modifiers.subModifiers(this.curse.data.targetModifiers);this.effectRenderer.queueRemoval(this.curse);this.target.rendersRequired.damageValues=true;this.curse=undefined;}
this.rendersRequired.effects=true;}
let selfEffectRemoved=false;selfEffectRemoved=this.countModifierEffectTurns(this.modifierEffects.fromSelf.countSelf)||selfEffectRemoved;selfEffectRemoved=this.countModifierEffectTurns(this.modifierEffects.fromTarget.countSelf)||selfEffectRemoved;statUpdateRequired||(statUpdateRequired=selfEffectRemoved);this.stackingEffect.forEach((activeEffect,effect)=>{activeEffect.stacks--;if(activeEffect.stacks===0){this.removeStackingEffect(effect);statUpdateRequired=true;}
this.rendersRequired.effects=true;});this.reflexiveEffects.forEach((activeEffect,effect)=>{activeEffect.turnsLeft--;if(activeEffect.turnsLeft===0){this.reflexiveEffects.delete(effect);this.effectRenderer.queueRemoval(activeEffect);this.modifiers.subModifiers(effect.modifiers,activeEffect.stacks,activeEffect.stacks);statUpdateRequired=true;}
this.rendersRequired.effects=true;});const targetEffectRemoved=this.target.countTargetEffectTurns();statUpdateRequired||(statUpdateRequired=targetEffectRemoved);if(selfEffectRemoved){this.onModifierEffectRemoval();this.target.onTargetModifierEffectRemoval();}
if(targetEffectRemoved){this.onTargetModifierEffectRemoval();this.target.onModifierEffectRemoval();}
if(this.turnsTaken%2===0&&this.modifiers.increasedEndOfTurnEvasion2>0){this.applyModifierEffect(new EndOfTurnEvasionEffect(1,this.modifiers.increasedEndOfTurnEvasion2),this,this.game.normalAttack);statUpdateRequired=true;}
if(statUpdateRequired){this.computeCombatStats();this.target.computeCombatStats();}}
this.queueNextAction();}
countTargetEffectTurns(){let effectRemoved=false;effectRemoved=this.countModifierEffectTurns(this.modifierEffects.fromSelf.countTarget)||effectRemoved;effectRemoved=this.countModifierEffectTurns(this.modifierEffects.fromTarget.countTarget)||effectRemoved;return effectRemoved;}
countModifierEffectTurns(attackMap){let effectRemoved=false;attackMap.forEach((effectMap,attack)=>{effectMap.forEach((effectData,effect)=>{effectData.turnsLeft--;if(effectData.turnsLeft===0){effectMap.delete(effect);effectRemoved=true;this.effectRenderer.queueRemoval(effectData);this.modifiers.subModifiers(effect.modifiers,effectData.stacks,effectData.stacks);if(effect instanceof SlowEffect)
this.slowCount--;if(effect===frostBurnEffect)
this.frostBurnCount--;}
this.rendersRequired.effects=true;});if(effectMap.size===0)
attackMap.delete(attack);});return effectRemoved;}
removeModifierEffects(attackMap){let effectRemoved=false;attackMap.forEach((effectMap)=>{effectMap.forEach((effectData,effect)=>{this.modifiers.subModifiers(effect.modifiers,effectData.stacks,effectData.stacks);effectRemoved=true;});});attackMap.clear();return effectRemoved;}
dot(dotID){const dotData=this.activeDOTs.get(dotID);if(dotData!==undefined){if(dotData.type==='Regen'){this.heal(dotData.damage);}
else if(this.immuneToDOT(dotData.type)){dotData.procsLeft=1;}
else{this.damage(dotData.damage,dotData.type);if(this.manager.fightInProgress){const lifeSteal=Math.floor((this.target.modifiers.getDOTLifesteal(dotData.type)*dotData.damage)/100);if(lifeSteal>0)
this.target.heal(lifeSteal);if(this.target.modifiers.increasedSlayerCoinsPerDamage>0&&!this.game.isGolbinRaid&&(dotData.type==='Poison'||dotData.type==='DeadlyPoison')){const scToAdd=Math.floor(((dotData.damage/numberMultiplier)*this.target.modifiers.increasedSlayerCoinsPerPoisonDamage)/100);if(scToAdd>0)
this.game.slayerCoins.add(scToAdd);}}}
dotData.procsLeft--;this.rendersRequired.effects=true;if(dotData.procsLeft===0){this.activeDOTs.delete(dotID);this.effectRenderer.queueRemoval(dotData);this.onDOTRemoval(dotData.type);this.target.onTargetDOTRemoval(dotData.type);}
else{dotData.timer.start(dotData.interval);}}
else{throw new Error(`Tried to deal dot damage for nonexistant DOT: ${dotID}`);}}
queueNextAction(noSpec=false,tickOffset=false){if(this.isStunned||this.isSleeping){this.nextAction='Nothing';this.attackCount=0;this.isAttacking=false;this.firstHit=true;this.timers.act.start(this.stats.attackInterval,tickOffset);}
else if(this.isAttacking&&!noSpec){this.nextAction='Attack';this.timers.act.start(this.nextAttack.attackInterval,tickOffset);}
else{this.nextAction='Attack';this.firstHit=true;if(noSpec&&!(this.usingAncient||this.isUsingArchaic)){this.nextAttack=this.game.normalAttack;}
else{const attackRoll=Math.random()*100;let percentTotal=0;for(let i=0;i<this.availableAttacks.length;i++){const attack=this.availableAttacks[i];percentTotal+=attack.chance;if(percentTotal>attackRoll){this.nextAttack=attack.attack;break;}}
if(this.isAttackAlreadyActive(this.nextAttack)){this.nextAttack=this.game.normalAttack;}}
this.attackCount=0;this.isAttacking=false;this.timers.act.start(this.stats.attackInterval,tickOffset);}
this.rendersRequired.attackBar=true;this.rendersRequired.attackBarMinibar=true;}
isAttackAlreadyActive(attack){if(attack.damage.length===0){let active=attack.prehitEffects.some((effect)=>this.isEffectActive(effect,attack));active||(active=attack.onhitEffects.some((effect)=>this.isEffectActive(effect,attack)));return active;}
else{return false;}}
isEffectActive(effect,attack){switch(effect.type){case 'Stun':return this.target.isStunned;case 'Sleep':return this.target.isSleeping;case 'Modifier':{const attackMap=this.getModifierEffectAttackMap(effect);const effectMap=attackMap.get(attack);if(effectMap===undefined)
return false;const activeData=effectMap.get(effect);return activeData!==undefined;}
default:return false;}}
renderStats(){this.statElements.evasion.melee.forEach((elem)=>(elem.textContent=formatNumber(this.stats.evasion.melee)));this.statElements.evasion.ranged.forEach((elem)=>(elem.textContent=formatNumber(this.stats.evasion.ranged)));this.statElements.evasion.magic.forEach((elem)=>(elem.textContent=formatNumber(this.stats.evasion.magic)));this.statElements.accuracy.forEach((elem)=>(elem.textContent=formatNumber(this.stats.accuracy)));this.statElements.maxHitpoints.forEach((elem)=>(elem.textContent=formatNumber(this.stats.maxHitpoints)));this.statElements.attackInterval.forEach((elem)=>(elem.textContent=templateLangString('MENU_TEXT','SECONDS_SHORT',{seconds:formatFixed(this.stats.attackInterval/1000,2),})));this.statElements.damageReduction.forEach((elem)=>(elem.textContent=formatPercent(this.stats.damageReduction)));this.rendersRequired.stats=false;}
renderDamageValues(){let minHitText;let maxHitText;if(this.manager.fightInProgress){minHitText=this.formatNormalAttackDamage(this.stats.minHit);maxHitText=this.formatNormalAttackDamage(this.stats.maxHit);}
else{minHitText=formatNumber(this.stats.minHit);maxHitText=formatNumber(this.stats.maxHit);}
this.statElements.minHit.forEach((elem)=>(elem.textContent=minHitText));this.statElements.maxHit.forEach((elem)=>(elem.textContent=maxHitText));this.rendersRequired.damageValues=false;}
formatNormalAttackDamage(damage){damage=this.modifyAttackDamage(this.target,this.game.normalAttack,damage);return `(${formatNumber(damage)})`;}
renderHitchance(){let text;if(this.manager.fightInProgress){text=formatPercent(Math.round(this.hitchance));}
else{text='-';}
this.statElements.hitChance.forEach((elem)=>(elem.textContent=text));this.rendersRequired.hitChance=false;}
renderHitpoints(){const text=formatNumber(this.hitpoints);this.statElements.hitpoints.forEach((elem)=>(elem.textContent=text));const hpRatio=`${Math.floor((this.hitpoints/this.stats.maxHitpoints)*100)}%`;this.statElements.hitpointsBar.forEach((elem)=>(elem.style.width=hpRatio));this.rendersRequired.hitpoints=false;}
renderDamageSplashes(){this.splashManager.render();this.rendersRequired.damageSplash=false;}
renderEffects(){this.effectRenderer.removeEffects();if(this.isStunned){this.effectRenderer.addStun(this.stun);}
if(this.stunImmunity.turns>0){this.effectRenderer.addStunImmunity(this.stunImmunity);}
if(this.isSleeping){this.effectRenderer.addSleep(this.sleep);}
if(this.curse!==undefined){this.effectRenderer.addCurse(this.curse);}
this.renderModifierEffect(this.modifierEffects.fromSelf.countSelf,this.noun);this.renderModifierEffect(this.modifierEffects.fromSelf.countTarget,this.target.noun);this.renderModifierEffect(this.modifierEffects.fromTarget.countSelf,this.noun);this.renderModifierEffect(this.modifierEffects.fromTarget.countTarget,this.target.noun);this.activeDOTs.forEach((activeDOT)=>{this.effectRenderer.addDOT(activeDOT);});this.reflexiveEffects.forEach((activeEffect,effect)=>{this.effectRenderer.addReflexive(activeEffect,effect,this.nextAttack);});this.stackingEffect.forEach((activeEffect,effect)=>{this.effectRenderer.addStacking(activeEffect,effect);});this.comboEffects.forEach((activeEffect,effect)=>{this.effectRenderer.addCombo(activeEffect,effect);});this.rendersRequired.effects=false;}
renderAttackBar(){this.rendersRequired.attackBar=false;this.rendersRequired.attackBarMinibar=false;let attackText=getLangString('COMBAT_MISC','9');if(!this.timers.act.isActive){this.attackBar.stopAnimation();this.attackBarMinibar.stopAnimation();this.statElements.attackName.forEach((elem)=>(elem.textContent=attackText));return;}
let newStyle='bg-info';let setStriped=false;switch(this.nextAction){case 'Nothing':newStyle='bg-danger';if(this.isStunned)
attackText=getLangString('COMBAT_MISC','STUNNED');else if(this.isSleeping)
attackText=getLangString('COMBAT_MISC','SLEEPING');this.statElements.attackName.forEach((elem)=>(elem.textContent=attackText));break;case 'Attack':if(this.isAttacking){setStriped=true;newStyle='bg-warning';}
else if(this.slowCount>0)
newStyle='bg-slowed';else if(this.nextAttack!==this.game.normalAttack)
newStyle='bg-warning';if(this.nextAttack!==this.game.normalAttack){this.statElements.attackName.forEach((elem)=>{elem.textContent='';elem.append(...templateLangStringWithNodes('COMBAT_MISC','USING_ATTACK',{attackName:createElement('strong',{text:this.nextAttack.name})},{}));});}
else{this.statElements.attackName.forEach((elem)=>(elem.textContent=attackText));}
break;}
if(setStriped){this.attackBar.animateStriped();this.attackBarMinibar.animateStriped();}
else{this.attackBar.animateProgressFromTimer(this.timers.act);this.attackBarMinibar.animateProgressFromTimer(this.timers.act);}
this.attackBar.setStyle(newStyle);this.attackBarMinibar.setStyle(newStyle);}
renderModifierEffect(attackMap,turnNoun){attackMap.forEach((effectMap,attack)=>{effectMap.forEach((effectData,effect)=>{this.effectRenderer.addModifier(effectData,effect,attack,turnNoun);});});}
checkCombatCondition(condition){switch(condition.type){case 'CombatType':return checkBooleanCondition((condition.thisAttackType==='any'||this.attackType===condition.thisAttackType)&&(condition.targetAttackType==='any'||this.target.attackType===condition.targetAttackType),condition);case 'DOT':return checkBooleanCondition(this.isDotActive(condition.dotType),condition);case 'Effect':return checkBooleanCondition(this.isEffectSubtypeActive(condition.effectType),condition);case 'Hitpoints':return checkValueCondition(this.hitpointsPercent,condition);case 'IsFighting':return checkBooleanCondition(this.manager.fightInProgress,condition);case 'IsStunned':return checkBooleanCondition(this.isStunned&&(condition.flavour===undefined||condition.flavour===this.stun.flavour),condition);case 'IsSleeping':return checkBooleanCondition(this.isSleeping,condition);}}
render(){if(this.rendersRequired.hitChance)
this.renderHitchance();if(this.rendersRequired.hitpoints)
this.renderHitpoints();if(this.rendersRequired.stats)
this.renderStats();if(this.rendersRequired.damageValues)
this.renderDamageValues();if(this.rendersRequired.damageSplash)
this.renderDamageSplashes();if(this.rendersRequired.effects)
this.renderEffects();if(this.rendersRequired.attackBar)
this.renderAttackBar();}
resetActionState(){this.timers.act.stop();this.isAttacking=false;this.reflexiveEffects.clear();this.stackingEffect.clear();this.modifierEffects.fromSelf.countSelf.clear();this.modifierEffects.fromSelf.countTarget.clear();this.modifierEffects.fromTarget.countSelf.clear();this.modifierEffects.fromTarget.countTarget.clear();this.slowCount=0;this.frostBurnCount=0;this.stun.turns=0;this.sleep.turns=0;this.curse=undefined;this.stunImmunity.turns=0;this.comboEffects.clear();this.target=this;}
encode(writer){writer.writeUint32(this.hitpoints);writer.writeUint8(this.stun.turns);writer.writeUint8(this.stun.flavour==='Stun'?1:0);writer.writeUint8(this.sleep.turns);writer.writeUint8(this.nextAction==='Attack'?1:0);writer.writeUint32(this.attackCount);writer.writeNamespacedObject(this.nextAttack);writer.writeBoolean(this.isAttacking);writer.writeBoolean(this.firstHit);writer.writeUint32(this.slowCount);writer.writeBoolean(this.curse!==undefined);if(this.curse!==undefined){writer.writeUint8(this.curse.turns);writer.writeNamespacedObject(this.curse.data);}
this.timers.act.encode(writer);this.timers.regen.encode(writer);this.encodeModifierEffects(this.modifierEffects.fromSelf.countSelf,writer);this.encodeModifierEffects(this.modifierEffects.fromSelf.countTarget,writer);this.encodeModifierEffects(this.modifierEffects.fromTarget.countSelf,writer);this.encodeModifierEffects(this.modifierEffects.fromTarget.countTarget,writer);this.encodeReflexiveEffects(writer);this.encodeStackingEffects(writer);this.encodeDOTS(writer);this.encodePassives(writer);writer.writeUint32(this.turnsTaken);this.encodeComboEffects(writer);writer.writeUint8(this.stunImmunity.turns);return writer;}
decode(reader,version){this.hitpoints=reader.getUint32();this.stun.turns=reader.getUint8();this.stun.flavour=reader.getUint8()===1?'Stun':'Freeze';this.sleep.turns=reader.getUint8();this.nextAction=reader.getUint8()===1?'Attack':'Nothing';this.attackCount=reader.getUint32();const nextAttack=reader.getNamespacedObject(this.game.specialAttacks);if(typeof nextAttack==='string')
this.nextAttack=this.game.normalAttack;else
this.nextAttack=nextAttack;this.isAttacking=reader.getBoolean();this.firstHit=reader.getBoolean();this.slowCount=reader.getUint32();if(reader.getBoolean()){const turns=reader.getUint8();const data=reader.getNamespacedObject(this.game.curseSpells);if(typeof data!=='string')
this.curse={turns,data,};}
this.timers.act.decode(reader,version);this.timers.regen.decode(reader,version);this.modifierEffects.fromSelf.countSelf=this.decodeModifierEffects(reader,version);this.modifierEffects.fromSelf.countTarget=this.decodeModifierEffects(reader,version);this.modifierEffects.fromTarget.countSelf=this.decodeModifierEffects(reader,version);this.modifierEffects.fromTarget.countTarget=this.decodeModifierEffects(reader,version);this.reflexiveEffects=this.decodeReflexiveEffects(reader,version);this.stackingEffect=this.decodeStackingEffects(reader,version);this.activeDOTs=this.decodeDOTS(reader,version);this.decodePassives(reader,version);this.turnsTaken=reader.getUint32();this.comboEffects=this.decodeComboEffects(reader,version);if(version>29)
this.stunImmunity.turns=reader.getUint8();if(typeof nextAttack==='string'){this.attackCount=0;this.isAttacking=false;}}
encodeModifierEffects(attackMap,writer){writer.writeMap(attackMap,writeNamespaced,(effectMap,writer,attack)=>{writer.writeMap(effectMap,writeAttackEffect(this.game,attack),(activeEffect,writer)=>{writer.writeFloat64(activeEffect.turnsLeft);writer.writeFloat64(activeEffect.stacks);});});}
decodeModifierEffects(reader,version){return reader.getMap(readNamespacedReject(this.game.specialAttacks),(reader,attack)=>{const effectMap=reader.getMap((reader)=>{const effect=readAttackEffect(reader,this.game,attack);if(effect===undefined||effect.type!=='Modifier')
return undefined;return effect;},(reader)=>{return{turnsLeft:reader.getFloat64(),stacks:reader.getFloat64(),};});if(effectMap.size===0)
return undefined;return effectMap;});}
encodeReflexiveEffects(writer){writer.writeComplexMap(this.reflexiveEffects,(effect,activeEffect,writer)=>{writer.writeNamespacedObject(activeEffect.sourceAttack);writeAttackEffect(this.game,activeEffect.sourceAttack)(effect,writer);writer.writeFloat64(activeEffect.stacks);writer.writeFloat64(activeEffect.turnsLeft);});}
decodeReflexiveEffects(reader,version){return reader.getComplexMap((reader)=>{const sourceAttack=reader.getNamespacedObject(this.game.specialAttacks);const key=readAttackEffect(reader,this.game,typeof sourceAttack==='string'?undefined:sourceAttack);const turnsLeft=reader.getFloat64();const stacks=reader.getFloat64();if(typeof sourceAttack==='string'||key===undefined||key.type!=='Reflexive')
return undefined;const value={sourceAttack,turnsLeft,stacks,};return{key,value};});}
encodeStackingEffects(writer){writer.writeMap(this.stackingEffect,writeNamespaced,(activeEffect,writer)=>{writer.writeFloat64(activeEffect.stacks);});}
decodeStackingEffects(reader,version){return reader.getMap(readNamespacedReject(this.game.stackingEffects),(reader)=>{return{stacks:reader.getFloat64(),};});}
encodeDOTS(writer){writer.writeComplexMap(this.activeDOTs,(_,dot,writer)=>{writer.writeUint8(DotTypeIDs[dot.type]);writer.writeFloat64(dot.damage);writer.writeFloat64(dot.procsLeft);writer.writeFloat64(dot.interval);dot.timer.encode(writer);});}
decodeDOTS(reader,version){return reader.getComplexMap((reader)=>{const key=this.manager.dotID;const type=DotTypeIDs[reader.getUint8()];const damage=reader.getFloat64();const procsLeft=reader.getFloat64();const interval=reader.getFloat64();const timer=new Timer('DOT',()=>this.dot(key));timer.decode(reader,version);const value={type,damage,procsLeft,interval,timer,};return{key,value};});}
encodePassives(writer){let passiveCount=0;this.passives.forEach((active)=>{if(active.save)
passiveCount++;});writer.writeUint32(passiveCount);this.passives.forEach((active,passive)=>{if(active.save){writer.writeNamespacedObject(passive);writer.writeBoolean(active.display);}});}
decodePassives(reader,version){const passiveCount=reader.getUint32();for(let i=0;i<passiveCount;i++){const passive=reader.getNamespacedObject(this.game.combatPassives);const display=reader.getBoolean();if(typeof passive!=='string')
this.passives.set(passive,{save:true,display});}}
encodeComboEffects(writer){writer.writeComplexMap(this.comboEffects,(effect,activeEffect,writer)=>{writer.writeNamespacedObject(activeEffect.sourceAttack);writeAttackEffect(this.game,activeEffect.sourceAttack)(effect,writer);writer.writeFloat64(activeEffect.stacks);});}
decodeComboEffects(reader,version){return reader.getComplexMap((reader)=>{const sourceAttack=reader.getNamespacedObject(this.game.specialAttacks);const key=readAttackEffect(reader,this.game,typeof sourceAttack==='string'?undefined:sourceAttack);const stacks=reader.getFloat64();if(typeof sourceAttack==='string'||key===undefined||key.type!=='Combo')
return undefined;const value={sourceAttack,stacks,};return{key,value};});}
deserialize(reader,version,idMap){this.hitpoints=reader.getNumber();this.stun.turns=reader.getNumber();this.stun.flavour=reader.getStunFlavour();this.sleep.turns=reader.getNumber();this.nextAction=reader.getActionType();this.attackCount=reader.getNumber();const nextAttack=reader.getAttack(this.game,idMap);if(nextAttack===undefined)
this.nextAttack=this.game.normalAttack;else
this.nextAttack=nextAttack;this.isAttacking=reader.getBool();this.firstHit=reader.getBool();this.slowCount=reader.getNumber();const curseTurns=reader.getNumber();const curseID=reader.getNumber();if(curseTurns>0){const curse=this.game.curseSpells.getObjectByID(idMap.magicCurses[curseID]);if(curse!==undefined)
this.curse={turns:curseTurns,data:curse,};}
reader.getBool();this.timers.act.deserialize(reader.getChunk(3),version);this.timers.regen.deserialize(reader.getChunk(3),version);this.deserializeModifierEffects(this.modifierEffects.fromSelf.countSelf,reader.getVariableLengthChunk(),version,idMap);this.deserializeModifierEffects(this.modifierEffects.fromSelf.countTarget,reader.getVariableLengthChunk(),version,idMap);this.deserializeModifierEffects(this.modifierEffects.fromTarget.countSelf,reader.getVariableLengthChunk(),version,idMap);this.deserializeModifierEffects(this.modifierEffects.fromTarget.countTarget,reader.getVariableLengthChunk(),version,idMap);this.deserializeReflexiveEffects(reader.getVariableLengthChunk(),version,idMap);this.deserializeStackingEffects(reader.getVariableLengthChunk(),version,idMap);this.deserializeDOTS(reader.getVariableLengthChunk(),version);if(version>=7){this.deserializePassives(reader.getVariableLengthChunk(),version,idMap);this.turnsTaken=reader.getNumber();this.deserializeComboEffects(reader.getVariableLengthChunk(),version,idMap);}
if(nextAttack===undefined){this.attackCount=0;this.isAttacking=false;}}
deserializeModifierEffects(attackMap,reader,version,idMap){attackMap.clear();const numAttacks=reader.getNumber();for(let i=0;i<numAttacks;i++){const effectMap=new Map();const attack=reader.getAttack(this.game,idMap);const numEffects=reader.getNumber();for(let j=0;j<numEffects;j++){const effect=reader.getAttackEffect(attack);const turnsLeft=reader.getNumber();const stacks=reader.getNumber();if(effect===undefined||effect.type!=='Modifier')
continue;effectMap.set(effect,{turnsLeft,stacks,});}
if(attack!==undefined&&effectMap.size>0)
attackMap.set(attack,effectMap);}}
deserializeReflexiveEffects(reader,version,idMap){this.reflexiveEffects.clear();const numEffects=reader.getNumber();for(let i=0;i<numEffects;i++){const sourceAttack=reader.getAttack(this.game,idMap);let effect=reader.getAttackEffect(sourceAttack);if(sourceAttack===this.game.itemEffectAttack){const newEffect=this.game.itemEffectAttack.itemEffects.getObjectByID(idMap.itemEffects[0]);if(newEffect===undefined)
effect=undefined;else
effect=newEffect.effect;}
const stacks=reader.getNumber();let turns=0;if(version>3)
turns=reader.getNumber();if(sourceAttack===undefined||effect===undefined||effect.type!=='Reflexive')
continue;this.reflexiveEffects.set(effect,{stacks,sourceAttack,turnsLeft:turns,});}}
deserializeStackingEffects(reader,version,idMap){this.stackingEffect.clear();const numEffects=reader.getNumber();for(let i=0;i<numEffects;i++){const effectID=reader.getNumber();const effect=this.game.stackingEffects.getObjectByID(idMap.stackingEffects[effectID]);const stacks=reader.getNumber();if(effect!==undefined)
this.stackingEffect.set(effect,{stacks,});}}
deserializeComboEffects(reader,version,idMap){this.comboEffects.clear();const numEffects=reader.getNumber();for(let i=0;i<numEffects;i++){const sourceAttack=reader.getAttack(this.game,idMap);const effect=reader.getAttackEffect(sourceAttack);const stacks=reader.getNumber();if(sourceAttack===undefined||effect===undefined||effect.type!=='Combo')
continue;this.comboEffects.set(effect,{sourceAttack,stacks,});}}
deserializeDOTS(reader,version){this.activeDOTs.clear();const numDOTs=reader.getNumber();for(let i=0;i<numDOTs;i++){const dotID=this.manager.dotID;const dotData={type:reader.getDOTType(),damage:reader.getNumber(),procsLeft:reader.getNumber(),interval:reader.getNumber(),timer:new Timer('DOT',()=>this.dot(dotID)),};dotData.timer.deserialize(reader.getChunk(3),version);this.activeDOTs.set(dotID,dotData);}}
deserializePassives(reader,version,idMap){const passiveCount=reader.getNumber();for(let i=0;i<passiveCount;i++){const passiveID=reader.getNumber();const display=reader.getBool();const passive=this.game.combatPassives.getObjectByID(idMap.combatPassives[passiveID]);if(passive!==undefined)
this.passives.set(passive,{save:true,display});}}}
class SpellSelection{constructor(game){this.game=game;}
encode(writer){writer.writeBoolean(this.standard!==undefined);if(this.standard)
writer.writeNamespacedObject(this.standard);writer.writeBoolean(this.ancient!==undefined);if(this.ancient)
writer.writeNamespacedObject(this.ancient);writer.writeBoolean(this.aurora!==undefined);if(this.aurora)
writer.writeNamespacedObject(this.aurora);writer.writeBoolean(this.curse!==undefined);if(this.curse)
writer.writeNamespacedObject(this.curse);writer.writeBoolean(this.archaic!==undefined);if(this.archaic)
writer.writeNamespacedObject(this.archaic);return writer;}
decode(reader,version){if(reader.getBoolean()){const spell=reader.getNamespacedObject(this.game.standardSpells);if(typeof spell!=='string')
this.standard=spell;}
if(reader.getBoolean()){const ancient=reader.getNamespacedObject(this.game.ancientSpells);if(typeof ancient!=='string')
this.ancient=ancient;}
if(reader.getBoolean()){const aurora=reader.getNamespacedObject(this.game.auroraSpells);if(typeof aurora!=='string')
this.aurora=aurora;}
if(reader.getBoolean()){const curse=reader.getNamespacedObject(this.game.curseSpells);if(typeof curse!=='string')
this.curse=curse;}
if(version>=23){if(reader.getBoolean()){const archaic=reader.getNamespacedObject(this.game.archaicSpells);if(typeof archaic!=='string')
this.archaic=archaic;}}
this.validate();}
validate(){if(this.standard===undefined&&this.ancient===undefined&&this.archaic===undefined){this.standard=this.game.standardSpells.firstObject;}}}
class EquipmentStats{constructor(stats=[]){this.attackSpeed=0;this.stabAttackBonus=0;this.slashAttackBonus=0;this.blockAttackBonus=0;this.rangedAttackBonus=0;this.magicAttackBonus=0;this.meleeStrengthBonus=0;this.rangedStrengthBonus=0;this.magicDamageBonus=0;this.meleeDefenceBonus=0;this.rangedDefenceBonus=0;this.magicDefenceBonus=0;this.damageReduction=0;this.summoningMaxhit=0;this.addStats(stats);}
addItemStats(item){this.addStats(item.equipmentStats);}
remItemStats(item){this.subtractStats(item.equipmentStats);}
addStats(stats){stats.forEach((stat)=>{if(stat.key==='summoningMaxhit'){this[stat.key]+=Math.round(stat.value*numberMultiplier);}
else{this[stat.key]+=stat.value;}});}
subtractStats(stats){stats.forEach((stat)=>{if(stat.key==='summoningMaxhit'){this[stat.key]-=Math.round(stat.value*numberMultiplier);}
else{this[stat.key]-=stat.value;}});}
resetStats(){this.attackSpeed=0;this.stabAttackBonus=0;this.slashAttackBonus=0;this.blockAttackBonus=0;this.rangedAttackBonus=0;this.magicAttackBonus=0;this.meleeStrengthBonus=0;this.rangedStrengthBonus=0;this.magicDamageBonus=0;this.meleeDefenceBonus=0;this.rangedDefenceBonus=0;this.magicDefenceBonus=0;this.damageReduction=0;this.summoningMaxhit=0;}}
class CharacterStats{constructor(){this.evasion={melee:0,ranged:0,magic:0,};this.minHit=0;this.maxHit=0;this.accuracy=0;this.maxHitpoints=0;this.attackInterval=0;this.damageReduction=0;}
get averageEvasion(){return(this.evasion.melee+this.evasion.ranged+this.evasion.magic)/3;}
get maxEvasion(){return Math.max(this.evasion.melee,this.evasion.ranged,this.evasion.magic);}
getValueTable(){const valueTable=[];valueTable.push({name:'Melee Evasion',value:this.evasion.melee,});valueTable.push({name:'Ranged Evasion',value:this.evasion.ranged,});valueTable.push({name:'Magic Evasion',value:this.evasion.magic,});valueTable.push({name:'Min Hit',value:this.minHit,});valueTable.push({name:'Max Hit',value:this.maxHit,});valueTable.push({name:'Accuracy',value:this.accuracy,});valueTable.push({name:'Max HP',value:this.maxHitpoints,});valueTable.push({name:'Attack Interval',value:this.attackInterval,});valueTable.push({name:'Damage Reduction',value:this.damageReduction,});return valueTable;}}