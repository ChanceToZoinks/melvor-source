"use strict";class Enemy extends Character{constructor(manager,game){super(manager,game);this.manager=manager;this.game=game;this.state=EnemyState.Dead;this.modifiers=new CombatModifiers();this.spellSelection=new SpellSelection(this.game);this.noun=enemyNoun;this.rendersRequired={stats:false,hitChance:false,hitpoints:false,damageSplash:false,effects:false,image:false,levels:false,attackBar:false,attackBarMinibar:false,passives:false,attacks:false,damageValues:false,};this.randomAttackType='unset';this.isBoss=false;}
get statElements(){return enemyHTMLElements;}
get splashManager(){return combatMenus.enemySplashManager;}
get effectRenderer(){return combatMenus.enemyEffectRenderer;}
get attackBar(){return combatMenus.progressBars.enemyAttack;}
get attackBarMinibar(){return combatMenus.progressBars.enemyAttackMinibar;}
get encodeMonster(){return true;}
setMonster(monster){this.monster=monster;this.setStatsFromMonster(monster);this.computeAllStats();this.setHitpoints(this.stats.maxHitpoints);this.timers.regen.start(10000-this.modifiers.decreasedRegenerationInterval);}
computeAttackType(){if(this.monster===undefined){this.attackType='melee';return;}
if(this.monster.attackType==='random'){if(this.randomAttackType==='unset'){let newAttackType;switch(rollInteger(0,2)){case 0:newAttackType='melee';break;case 1:newAttackType='ranged';break;default:newAttackType='magic';break;}
this.randomAttackType=newAttackType;this.attackType=newAttackType;}
else{this.attackType=this.randomAttackType;}}
else{this.attackType=this.monster.attackType;}}
computeAttackSelection(){if(this.monster!==undefined)
this.availableAttacks=[...this.monster.specialAttacks];else
this.availableAttacks=[];const totalChance=this.availableAttacks.reduce((prev,attack)=>prev+attack.chance,0);if(totalChance<100)
this.availableAttacks.push({attack:this.game.normalAttack,chance:100-totalChance,});this.rendersRequired.attacks=true;}
computeLevels(){if(this.monster!==undefined)
Object.assign(this.levels,this.monster.levels);}
computeEquipmentStats(){this.equipmentStats.resetStats();if(this.monster!==undefined)
this.equipmentStats.addStats(this.monster.equipmentStats);}
computeModifiers(){this.modifiers.reset();this.addAuroraModifiers();this.addCurseModifiers();this.addPassiveModifiers();this.addTargetModifiers();this.addEffectModifiers();this.addCombatAreaEffectModifiers();this.addGamemodeModifiers();}
addGamemodeModifiers(){this.modifiers.addModifiers(this.game.currentGamemode.enemyModifiers);}
getAccuracyValues(){let effectiveLevel=0;let accuracyBonus=0;switch(this.attackType){case 'melee':effectiveLevel=this.levels.Attack;accuracyBonus=this.equipmentStats.stabAttackBonus;break;case 'magic':effectiveLevel=this.levels.Magic;accuracyBonus=this.equipmentStats.magicAttackBonus;break;case 'ranged':effectiveLevel=this.levels.Ranged;accuracyBonus=this.equipmentStats.rangedAttackBonus;break;default:throw new Error(`Invalid attacktype set: ${this.attackType}`);}
return{effectiveLevel:effectiveLevel,bonus:accuracyBonus,};}
modifyDamageReduction(reduction){if(this.manager.fightInProgress){reduction-=this.target.modifiers.decreasedEnemyDamageReduction;reduction+=this.target.modifiers.increasedEnemyDamageReduction;}
reduction=super.modifyDamageReduction(reduction);return reduction;}
getFlatReflectDamage(){return this.modifiers.getFlatReflectDamage()*numberMultiplier;}
damage(amount,source){this.manager.addMonsterStat(MonsterStats.DamageTakenFromPlayer,amount);this.manager.addCombatStat(CombatStats.DamageDealt,amount);super.damage(amount,source);}
processDeath(){this.removeAllEffects(true);this.state=EnemyState.Dead;this.rendersRequired.image=true;this.rendersRequired.hitpoints=true;this.rendersRequired.stats=true;this.rendersRequired.hitChance=true;this.rendersRequired.levels=true;this.rendersRequired.attacks=true;this.rendersRequired.passives=true;}
regen(){let regen=numberMultiplier*(this.modifiers.increasedHPRegenFlat-this.modifiers.decreasedHPRegenFlat);regen+=((this.modifiers.increasedHitpointRegeneration-this.modifiers.decreasedHitpointRegeneration)*this.stats.maxHitpoints)/100;regen=Math.floor(regen);regen=Math.min(regen,this.stats.maxHitpoints-this.hitpoints);if(regen>0)
this.heal(regen);this.timers.regen.start(10000-this.modifiers.decreasedRegenerationInterval);}
setSpawning(){this.state=EnemyState.Spawning;this.rendersRequired.image=true;}
setRenderAll(){super.setRenderAll();this.rendersRequired.image=true;this.rendersRequired.levels=true;}
applyUniqueSpawnEffects(){super.applyUniqueSpawnEffects();}
initializeForCombat(){this.rendersRequired.image=true;this.rendersRequired.levels=true;this.rendersRequired.passives=true;super.initializeForCombat();}
render(){if(this.rendersRequired.levels)
this.renderLevels();if(this.rendersRequired.image)
this.renderImageAndName();if(this.rendersRequired.attacks||this.rendersRequired.passives)
this.renderAttacksAndPassives();super.render();}
renderAttacksAndPassives(){if(this.state===EnemyState.Alive){combatMenus.enemyAttackPassive.render(this.passives,this.availableAttacks,this);}
else{combatMenus.enemyAttackPassive.hide();}
this.rendersRequired.attacks=false;this.rendersRequired.passives=false;}
renderDamageValues(){if(this.state===EnemyState.Alive)
combatMenus.enemyAttackPassive.renderMaxhits(this.availableAttacks,this);super.renderDamageValues();}
renderLevels(){if(this.state===EnemyState.Alive&&this.monster!==undefined){const monster=this.monster;this.statElements.levels['Combat'].forEach((elem)=>(elem.textContent=`${monster.combatLevel}`));Object.entries(this.levels).forEach(([key,level])=>{this.statElements.levels[key].forEach((elem)=>(elem.textContent=`${level}`));});}
else{Object.values(this.statElements.levels).forEach((elems)=>{elems.forEach((elem)=>(elem.textContent='-'));});}
this.rendersRequired.levels=false;}
renderImageAndName(){let name='-';const imageNodes=[];switch(this.state){case EnemyState.Alive:{if(this.monster===undefined)
return;name=this.monster.name;const image=document.createElement('img');image.src=this.monster.media;if(this.game.settings.enableEyebleachMode&&this.game.combat.spiderLairMonsters.includes(this.monster)){image.src=cdnMedia(`assets/media/monsters/eyebleach_${Math.floor(Math.random()*5)+1}.png`);}
image.classList.add('combat-enemy-img');for(const[passive]of this.passives){if(passive.id==="melvorF:Afflicted"){name=templateLangString('COMBAT_MISC','AFFLICTED_NAME',{monsterName:name});image.style.filter='saturate(15%)';break;}
if(passive.id==="melvorF:ControlledAffliction"){image.style.filter='saturate(15%)';break;}}
if(this.isBoss){}
imageNodes.push(image);if(this.monster.hasDescription){imageNodes.push(document.createElement('br'));const span=document.createElement('span');span.textContent=this.monster.description;span.classList.add('text-danger');imageNodes.push(span);}
break;}
case EnemyState.Spawning:{const div=document.createElement('div');!nativeManager.isMobile?div.classList.add('combat-enemy-img-spinner','spinner-border','text-danger'):div.classList.add('combat-enemy-img-spinner-mobile','spinner-border','text-danger');div.setAttribute('role','status');imageNodes.push(div);break;}}
this.statElements.name.forEach((elem)=>(elem.textContent=name));this.statElements.image.textContent='';this.statElements.image.append(...imageNodes);this.rendersRequired.image=false;}
renderStats(){this.statElements.attackType.src=this.getAttackTypeMedia(this.attackType);if(this.state===EnemyState.Alive){super.renderStats();}
else{this.renderNoStats();}}
getAttackTypeMedia(attackType){let attackTypeMedia='';switch(attackType){case 'melee':attackTypeMedia=this.game.attack.media;break;case 'ranged':attackTypeMedia=this.game.ranged.media;break;case 'magic':attackTypeMedia=this.game.altMagic.media;break;}
return attackTypeMedia;}
renderNoStats(){const text='-';this.statElements.evasion.melee.forEach((elem)=>(elem.textContent=text));this.statElements.evasion.ranged.forEach((elem)=>(elem.textContent=text));this.statElements.evasion.magic.forEach((elem)=>(elem.textContent=text));this.statElements.minHit.forEach((elem)=>(elem.textContent=text));this.statElements.maxHit.forEach((elem)=>(elem.textContent=text));this.statElements.accuracy.forEach((elem)=>(elem.textContent=text));this.statElements.maxHitpoints.forEach((elem)=>(elem.textContent=text));this.statElements.attackInterval.forEach((elem)=>(elem.textContent=text));this.statElements.damageReduction.forEach((elem)=>(elem.textContent=text));this.rendersRequired.stats=false;}
renderHitpoints(){if(this.state===EnemyState.Alive){super.renderHitpoints();}
else{this.statElements.hitpoints.forEach((elem)=>(elem.textContent='-'));this.statElements.hitpointsBar.forEach((elem)=>(elem.style.width=`0%`));this.rendersRequired.hitpoints=false;}}
resetActionState(){super.resetActionState();this.state=EnemyState.Dead;this.monster=undefined;}
encode(writer){super.encode(writer);writer.writeUint8(this.state);writer.writeUint8(AttackTypeID[this.randomAttackType]);if(this.encodeMonster){writer.writeBoolean(this.monster!==undefined);if(this.monster!==undefined)
writer.writeNamespacedObject(this.monster);}
return writer;}
setStatsFromMonster(monster){this.spellSelection.standard=monster.selectedSpell;if(monster.passives.length>0)
this.addPassives(monster.passives,false,true,false);this.isBoss=monster.isBoss;}
decode(reader,version){super.decode(reader,version);this.state=reader.getUint8();this.randomAttackType=AttackTypeID[reader.getUint8()];if(this.encodeMonster&&reader.getBoolean()){const monster=reader.getNamespacedObject(this.game.monsters);if(typeof monster==='string'){if(this.manager.fightInProgress)
this.manager.shouldResetAction=true;}
else{this.monster=monster;this.setStatsFromMonster(monster);}}}
deserialize(reader,version,idMap){super.deserialize(reader.getVariableLengthChunk(),version,idMap);const monster=this.game.monsters.getObjectByID(idMap.monsters[reader.getNumber()]);if(monster===undefined){if(this.manager.fightInProgress)
this.manager.shouldResetAction=true;}
else{this.monster=monster;this.setStatsFromMonster(monster);}
this.state=reader.getNumber();if(version>=7)
this.randomAttackType=reader.getRandomAttackType();}
postAttack(attack,attackType){}
onHit(){this.manager.addMonsterStat(MonsterStats.HitsToPlayer);}
onMiss(){this.manager.addMonsterStat(MonsterStats.EnemyMissed);}}
var EnemyState;(function(EnemyState){EnemyState[EnemyState["Dead"]=0]="Dead";EnemyState[EnemyState["Alive"]=1]="Alive";EnemyState[EnemyState["Spawning"]=2]="Spawning";})(EnemyState||(EnemyState={}));