"use strict";class BaseManager extends NamespacedObject{constructor(game,namespace,id){super(namespace,id);this.game=game;this.fightInProgress=false;this.spawnTimer=new Timer('Spawn',()=>this.spawnEnemy());this.notifications=new NotificationQueue(10);this.allowDuplicateDOTS=false;this.isActive=false;this.giveFreeDeath=false;this.rendersRequired={location:false,pause:false,slayerAreaEffects:false,eventMenu:false,areaRequirements:false,spellBook:false,};this.shouldResetAction=false;this._dotID=0;}
get dotID(){this._dotID++;return this._dotID;}
initialize(){if(this.fightInProgress){this.player.target=this.player;this.enemy.target=this.enemy;this.fightInProgress=false;this.player.computeAllStats();this.enemy.computeAllStats();this.fightInProgress=true;this.enemy.target=this.player;this.player.target=this.enemy;this.player.updateConditionals('All',false,false);this.statUpdateOnEnemySpawn();}
else{this.player.computeAllStats();this.enemy.computeAllStats();}
this.player.setRenderAll();this.enemy.setRenderAll();this.rendersRequired.location=true;this.rendersRequired.pause=true;this.rendersRequired.slayerAreaEffects=true;this.render();this.setCallbacks();}
setCallbacks(){combatMenus.runButton.onclick=()=>this.stop();combatMenus.viewDropsButton.onclick=()=>{if(this.enemy.monster!==undefined)
viewMonsterDrops(this.enemy.monster,true);};combatMenus.minibarEatButton.onclick=()=>this.minibarEatCallback();combatMenus.minibarEatButton.ontouchstart=(e)=>{this.minibarEatCallback();this.player.startHoldToEat();this.minibarShowHoldToEat();e.preventDefault();};combatMenus.minibarEatButton.ontouchend=(e)=>{this.player.stopHoldToEat();this.minibarHideHoldToEat();e.preventDefault();};combatMenus.minibarEatButton.onmousedown=(e)=>{this.player.startHoldToEat();this.minibarShowHoldToEat();e.preventDefault();};combatMenus.minibarEatButton.onmouseup=()=>{this.player.stopHoldToEat();this.minibarHideHoldToEat();};combatMenus.minibarEatButton.onmouseleave=()=>{this.player.stopHoldToEat();this.minibarHideHoldToEat();};combatMenus.minibarRunButton.onclick=()=>this.minibarRunCallback();this.player.setCallbacks();}
minibarEatCallback(){this.player.eatFood();this.player.render();combatMenus.minibarEatButton.blur();}
minibarRunCallback(){this.stop();combatMenus.minibarRunButton.blur();}
minibarShowHoldToEat(){combatMenus.minibarEatButton.classList.remove('btn-light');combatMenus.minibarEatButton.classList.add('btn-outline-success');}
minibarHideHoldToEat(){combatMenus.minibarEatButton.classList.add('btn-light');combatMenus.minibarEatButton.classList.remove('btn-outline-success');}
render(){this.player.render();this.enemy.render();this.notifications.notify();if(this.rendersRequired.location)
this.renderLocation();this.renderSpellBook();}
getErrorLog(){var _a;return `Is In Combat: ${this.isActive}
Fight in Progress: ${this.fightInProgress}
-- Start of Player Information --
${this.player.getErrorLog()}
-- End Player Information --
-- Start of Enemy Information --
Enemy: ${(_a=this.enemy.monster)===null||_a===void 0?void 0:_a.id}
${this.enemy.getErrorLog()}
-- End Enemy Information --`;}
renderSpellBook(){if(!this.rendersRequired.spellBook)
return;updateSpellbook(selectedSpellbook,this.player,this.ignoreSpellRequirements?120:this.game.altMagic.level,this.ignoreSpellRequirements);this.rendersRequired.spellBook=false;}
checkDeath(){const playerDied=this.player.hitpoints<=0;const enemyDied=this.enemy.state===EnemyState.Alive&&this.enemy.hitpoints<=0;if(playerDied){this.onPlayerDeath();}
let stopCombat=playerDied&&this.isActive;if(enemyDied){stopCombat=this.onEnemyDeath()||stopCombat;}
if(stopCombat){this.stop(false);}
else if(enemyDied){this.endFight();this.loadNextEnemy();}
else if(playerDied&&this.game.activeAction===this.game.thieving){this.game.thieving.stopOnDeath();}}
onPlayerDeath(){this.player.processDeath();}
onEnemyDeath(){var _a,_b;this.enemy.processDeath();this.addMonsterStat(MonsterStats.KilledByPlayer);if(((_a=this.enemy.monster)===null||_a===void 0?void 0:_a.pet)!==undefined){let kills=this.game.stats.monsterKillCount(this.enemy.monster);if(this.enemy.monster.id==="melvorD:Golbin")
kills+=this.game.stats.GolbinRaid.get(RaidStats.GolbinsKilled);if(kills>=this.enemy.monster.pet.kills)
this.game.petManager.unlockPet(this.enemy.monster.pet.pet);}
if(this.game.currentGamemode.id=="melvorF:HardcoreAdventureSpeedrun"&&((_b=this.enemy.monster)===null||_b===void 0?void 0:_b.id)==="melvorF:BaneInstrumentOfFear"&&this.game.stats.monsterKillCount(this.enemy.monster)===1)
showBaneCompletionModal();return false;}
addMonsterStat(statID,amount=1){if(this.enemy.monster===undefined)
return;this.game.stats.Monsters.add(this.enemy.monster,statID,amount);}
addCombatStat(statID,amount=1){this.game.stats.Combat.add(statID,amount);}
onSelection(){this.game.renderQueue.combatMinibar=true;this.game.renderQueue.title=true;this.game.renderQueue.activeSkills=true;this.isActive=true;this.rendersRequired.location=true;this.loadNextEnemy();if(!loadingOfflineProgress)
saveData('all');}
stop(fled=true){this.game.renderQueue.combatMinibar=true;this.game.renderQueue.title=true;this.game.renderQueue.activeSkills=true;this.isActive=false;this.rendersRequired.location=true;if(this.enemy.state!==EnemyState.Dead)
this.enemy.processDeath();this.endFight();if(this.spawnTimer.isActive)
this.spawnTimer.stop();return true;}
loadNextEnemy(){this.spawnTimer.start(this.player.getMonsterSpawnTime());this.enemy.setSpawning();}
spawnEnemy(){this.fightInProgress=true;this.createNewEnemy();this.addMonsterStat(MonsterStats.Seen);this.enemy.target=this.player;this.player.target=this.enemy;this.statUpdateOnEnemySpawn();this.uniqueUpdatesOnEnemySpawn();this.enemy.setHitpoints(this.enemy.stats.maxHitpoints);this.enemy.state=EnemyState.Alive;this.player.turnsTaken=0;this.enemy.turnsTaken=0;}
uniqueUpdatesOnEnemySpawn(){this.player.applyUniqueSpawnEffects();this.enemy.applyUniqueSpawnEffects();}
statUpdateOnEnemySpawn(){this.player.addCombatAreaEffectModifiers();this.player.addTargetModifiers();this.enemy.addTargetModifiers();this.player.initializeForCombat();this.enemy.initializeForCombat();}
startFight(tickOffset=true){this.player.queueNextAction(false,tickOffset);this.player.startSummonAttack(tickOffset);this.enemy.queueNextAction(false,tickOffset);}
endFight(){if(this.fightInProgress){this.fightInProgress=false;this.player.stopFighting();this.enemy.stopFighting();}}
onCombatPageChange(){this.player.rendersRequired.attackBar=true;this.player.rendersRequired.attackBarMinibar=true;this.player.rendersRequired.summonBar=true;this.enemy.rendersRequired.attackBar=true;this.enemy.rendersRequired.attackBarMinibar=true;this.player.rendersRequired.activeSkillModifierChange=true;this.rendersRequired.areaRequirements=true;this.rendersRequired.spellBook=true;this.render();}
renderAutoSwapFood(){if(this.player.modifiers.autoSwapFoodUnlocked){$('#combat-food-auto-swap').removeClass('d-none');}
else{$('#combat-food-auto-swap').addClass('d-none');}}
resetActionState(){this.player.resetActionState();this.enemy.resetActionState();if(this.isActive)
this.game.clearActiveAction(false);this.fightInProgress=false;this.spawnTimer.stop();this.isActive=false;}
encode(writer){this.player.encode(writer);this.enemy.encode(writer);writer.writeBoolean(this.fightInProgress);this.spawnTimer.encode(writer);writer.writeBoolean(this.isActive);return writer;}
decode(reader,version){this.player.decode(reader,version);this.enemy.decode(reader,version);this.fightInProgress=reader.getBoolean();this.spawnTimer.decode(reader,version);this.isActive=reader.getBoolean();}
deserialize(reader,version,idMap){this.player.deserialize(reader.getVariableLengthChunk(),version,idMap);this.enemy.deserialize(reader.getVariableLengthChunk(),version,idMap);reader.getNumber();this.fightInProgress=reader.getBool();if(version<=3)
reader.getNumber();this.spawnTimer.deserialize(reader.getChunk(3),version);this.isActive=reader.getBool();if(this.fightInProgress){this.player.target=this.enemy;this.enemy.target=this.player;}}}