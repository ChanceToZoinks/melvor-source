"use strict";class BaseAgilityObject extends MasteryAction{constructor(namespace,data,game){super(namespace,data.id);this._name=data.name;this.itemCosts=game.items.getQuantities(data.itemCosts);this.gpCost=data.gpCost;this.scCost=data.scCost;this.modifiers=game.getPlayerModifiersFromData(data.modifiers);}}
class AgilityObstacle extends BaseAgilityObject{constructor(namespace,data,game){super(namespace,data,game);this._media=data.media;this.category=data.category;this.baseInterval=data.baseInterval;this.skillRequirements=data.skillRequirements.map((data)=>game.getLevelRequirement(data));this.baseExperience=data.baseExperience;this.gpReward=data.gpReward;this.scReward=data.scReward;this.itemRewards=game.items.getQuantities(data.itemRewards);}
get name(){if(this.isModded){return this._name;}
else{return getLangString('AGILITY',`OBSTACLE_NAME_${this.localID}`);}}
get media(){return this.getMediaURL(this._media);}
get level(){if(this.category===1)
return 1;return this.category*10;}}
class DummyObstacle extends AgilityObstacle{get name(){return `Full Version Only Obstacle.`;}
constructor(namespace,id,game){super(namespace,{id,name:'',itemCosts:[],gpCost:-1,scCost:-1,modifiers:{},media:"assets/media/main/question.svg",category:0,baseInterval:-1,skillRequirements:[],baseExperience:-1,gpReward:-1,scReward:-1,itemRewards:[],},game);}}
class AgilityPillar extends BaseAgilityObject{get name(){if(this.isModded){return this._name;}
else{return getLangString('AGILITY',`PILLAR_NAME_${this.localID}`);}}
get media(){return '';}}
class DummyPillar extends AgilityPillar{get name(){return 'Full Version Only Pillar';}
constructor(namespace,id,game){super(namespace,{id,name:'',itemCosts:[],gpCost:-1,scCost:-1,modifiers:{},},game);}}
class Agility extends GatheringSkill{constructor(namespace,game){super(namespace,'Agility',game);this._media='assets/media/skills/agility/agility.svg';this.obstacleUnlockLevels=[10,20,30,40,50,60,70,80,90,100,105,110,115,118];this.maxBlueprints=5;this.blueprints=new Map();this.renderQueue=new AgilityRenderQueue();this.maxObstacles=0;this.builtObstacles=new Map();this.obstacleBuildCount=new Map();this.currentlyActiveObstacle=-1;this.builtPassivePillar=undefined;this.builtElitePassivePillar=undefined;this.modifiers=new MappedModifiers();this.pillars=new NamespaceRegistry(game.registeredNamespaces);this.elitePillars=new NamespaceRegistry(game.registeredNamespaces);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
get actionInterval(){return this.getObstacleInterval(this.activeObstacle);}
get actionLevel(){return this.getObstacleLevel(this.activeObstacle.category);}
get masteryAction(){return this.activeObstacle;}
get activeObstacleCount(){let num=0;for(let tier=0;tier<this.numObstaclesUnlocked;tier++){const obstacle=this.builtObstacles.get(tier);if(obstacle===undefined)
break;num++;}
return num;}
get numObstaclesUnlocked(){return this.obstacleUnlockLevels.filter((level)=>level<=this.level).length+1;}
get passivePillarUnlocked(){return this.level>=99;}
get elitePassivePillarUnlocked(){return this.level>=120;}
get activeObstacle(){const obstacle=this.builtObstacles.get(this.currentlyActiveObstacle);if(obstacle===undefined)
throw new Error('Tried to get active obstacle, but none is built.');return obstacle;}
registerData(namespace,data){var _a,_b,_c;super.registerData(namespace,data);(_a=data.obstacles)===null||_a===void 0?void 0:_a.forEach((data)=>{this.actions.registerObject(new AgilityObstacle(namespace,data,this.game));});(_b=data.pillars)===null||_b===void 0?void 0:_b.forEach((data)=>{this.pillars.registerObject(new AgilityPillar(namespace,data,this.game));});(_c=data.elitePillars)===null||_c===void 0?void 0:_c.forEach((data)=>{this.elitePillars.registerObject(new AgilityPillar(namespace,data,this.game));});}
postDataRegistration(){super.postDataRegistration();this.maxObstacles=this.obstacleUnlockLevels.reduce((total,level)=>{if(level<=this.levelCap)
total++;return total;},1);this.sortedMasteryActions=this.actions.allObjects.sort((a,b)=>a.category-b.category);for(let tier=0;tier<this.maxObstacles;tier++){this.milestones.push(new AgilityObstacleMilestone(tier));}
this.milestones.push(new AgilityPillarMilestone(this));if(this.levelCap>=120)
this.milestones.push(new AgilityElitePillarMilestone(this));this.sortMilestones();}
isObstacleBuilt(obstacle){return this.builtObstacles.get(obstacle.category)===obstacle;}
isPillarBuilt(pillar){return this.builtPassivePillar===pillar;}
isElitePillarBuilt(pillar){return this.builtElitePassivePillar===pillar;}
getObstacleBuildCount(obstacle){var _a;return(_a=this.obstacleBuildCount.get(obstacle))!==null&&_a!==void 0?_a:0;}
getObstacleBuildCosts(obstacle){const costs=new Costs(this.game);this.addSingleObstacleBuildCost(obstacle,costs);return costs;}
addSingleObstacleBuildCost(obstacle,costs){const costModifier=this.getObstacleCostModifier(obstacle);if(obstacle.gpCost>0)
costs.addGP(Math.floor(obstacle.gpCost*(1+costModifier/100)));if(obstacle.scCost>0)
costs.addSlayerCoins(Math.floor(obstacle.scCost*(1+costModifier/100)));const itemCostModifier=this.getObstacleItemCostModifier(obstacle);obstacle.itemCosts.forEach(({item,quantity})=>{costs.addItem(item,Math.floor(quantity*(1+itemCostModifier/100)));});}
getPillarBuildCosts(pillar){const costModifier=this.game.modifiers.increasedAgilityPillarCost-this.game.modifiers.decreasedAgilityPillarCost;const costs=new Costs(this.game);if(pillar.gpCost>0)
costs.addGP(Math.floor(pillar.gpCost*(1+costModifier/100)));if(pillar.scCost>0)
costs.addSlayerCoins(Math.floor(pillar.scCost*(1+costModifier/100)));pillar.itemCosts.forEach(({item,quantity})=>costs.addItem(item,Math.floor(quantity*(1+costModifier/100))));return costs;}
addSinglePillarBuildCost(pillar,costs){const costModifier=this.game.modifiers.increasedAgilityPillarCost-this.game.modifiers.decreasedAgilityPillarCost;if(pillar.gpCost>0)
costs.addGP(Math.floor(pillar.gpCost*(1+costModifier/100)));if(pillar.scCost>0)
costs.addSlayerCoins(Math.floor(pillar.scCost*(1+costModifier/100)));pillar.itemCosts.forEach(({item,quantity})=>{costs.addItem(item,Math.floor(quantity*(1+costModifier/100)));});}
getTotalObstacleBuiltCount(){let total=0;this.obstacleBuildCount.forEach((count)=>{total+=count;});return total;}
getObstacleInterval(obstacle){return this.modifyInterval(obstacle.baseInterval,obstacle);}
getPercentageIntervalModifier(action){let modifier=super.getPercentageIntervalModifier(action);const masteryLevel=this.getMasteryLevel(action);modifier-=Math.floor(masteryLevel/10)*3;return modifier;}
getXPModifier(masteryAction){let modifier=super.getXPModifier(masteryAction);if(masteryAction!==undefined&&this.obstacleHasNegativeModifiers(masteryAction)){modifier+=this.game.modifiers.increasedXPFromNegativeObstacles;modifier-=this.game.modifiers.decreasedXPFromNegativeObstacles;}
return modifier;}
getGPModifier(obstacle){let modifier=super.getGPModifier(obstacle);modifier+=this.game.modifiers.increasedGPFromAgility;modifier-=this.game.modifiers.decreasedGPFromAgility;if(this.currentlyActiveObstacle>=0&&this.obstacleHasNegativeModifiers(this.activeObstacle)){modifier+=this.game.modifiers.increasedGPFromNegativeObstacles;modifier-=this.game.modifiers.decreasedGPFromNegativeObstacles;}
if(this.isPoolTierActive(1))
modifier+=10;modifier+=this.activeObstacleCount*(this.game.modifiers.increasedGPFromAgilityPerActiveObstacle-
this.game.modifiers.decreasedGPFromAgilityPerActiveObstacle);return modifier;}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(0))
modifier+=5;if(this.obstacleHasNegativeModifiers(action)){modifier+=this.game.modifiers.increasedMasteryXPFromNegativeObstacles;modifier-=this.game.modifiers.decreasedMasteryXPFromNegativeObstacles;}
return modifier;}
getObstacleGP(obstacle){return Math.floor(obstacle.gpReward*(1+this.getGPModifier(obstacle)/100));}
getObstacleModifiers(obstacle){const modifiers=new MappedModifiers();const masteryLevel=this.getMasteryLevel(obstacle);const negMult=masteryLevel>=99?0.5:1;modifiers.addModifiers(obstacle.modifiers,negMult,1);return modifiers;}
getPillarModifiers(pillar){const modifiers=new MappedModifiers();modifiers.addModifiers(pillar.modifiers,1,1);return modifiers;}
getObstacleCostModifier(obstacle){let modifier=this.game.modifiers.increasedAgilityObstacleCost-this.game.modifiers.decreasedAgilityObstacleCost;const masteryLevel=this.getMasteryLevel(obstacle);if(masteryLevel>=80)
modifier-=10;if(masteryLevel>=95)
modifier-=10;if(this.isPoolTierActive(2))
modifier-=10;return Math.max(modifier,-95);}
getObstacleItemCostModifier(obstacle){let modifier=this.getObstacleCostModifier(obstacle);if(this.isPoolTierActive(3))
modifier-=15;let buildCount=this.obstacleBuildCount.get(obstacle);if(buildCount!==undefined){buildCount=Math.min(buildCount,10);modifier-=4*buildCount;}
return Math.max(modifier,-95);}
obstacleHasNegativeModifiers(obstacle){if(this.currentlyActiveObstacle<0)
return false;return Object.entries(obstacle.modifiers).some((entry)=>{return modifierData[entry[0]].isNegative;});}
preAction(){}
get actionRewards(){const rewards=new Rewards(this.game);const obstacle=this.activeObstacle;const actionEvent=new AgilityActionEvent(this,obstacle);rewards.addXP(this,obstacle.baseExperience);if(obstacle.gpReward>0){rewards.addGP(this.getObstacleGP(obstacle));rewards.recordGPStat(this.game.stats.Agility,AgilityStats.GPEarned);}
if(obstacle.scReward>0){rewards.addSlayerCoins(obstacle.scReward);this.game.stats.Agility.add(AgilityStats.SlayerCoinsEarned,obstacle.scReward);}
if(obstacle.itemRewards.length>0){const doublingChance=this.getDoublingChance(obstacle);obstacle.itemRewards.forEach(({item,quantity})=>{if(rollPercentage(doublingChance))
quantity*=2;quantity*=Math.pow(2,this.game.modifiers.getSkillModifierValue('doubleItemsSkill',this));const extraItemChance=this.game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource',this)-
this.game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource',this);if(rollPercentage(extraItemChance))
quantity++;rewards.addItem(item,quantity);this.game.stats.Agility.add(AgilityStats.ItemsEarned,quantity);});}
this.addCommonRewards(rewards);this.game.processEvent(actionEvent,this.currentActionInterval);return rewards;}
start(){this.currentlyActiveObstacle=0;this.renderQueue.obstacleHighlights.add(this.currentlyActiveObstacle);this.renderQueue.startButtons=true;return super.start();}
onStop(){this.renderQueue.obstacleHighlights.add(this.currentlyActiveObstacle);this.currentlyActiveObstacle=-1;this.renderQueue.startButtons=true;}
postAction(){this.renderQueue.obstacleHighlights.add(this.currentlyActiveObstacle);this.game.stats.Agility.inc(AgilityStats.ObstaclesCompleted);this.game.stats.Agility.add(AgilityStats.TimeSpent,this.currentActionInterval);this.renderQueue.obstacleRates=true;this.currentlyActiveObstacle++;const nextObstacle=this.builtObstacles.get(this.currentlyActiveObstacle);if(nextObstacle===undefined||nextObstacle instanceof DummyObstacle){this.currentlyActiveObstacle=0;this.game.stats.Agility.inc(AgilityStats.CoursesCompleted);}
this.renderQueue.obstacleHighlights.add(this.currentlyActiveObstacle);}
get masteryModifiedInterval(){return this.actionInterval;}
onMasteryLevelUp(action,oldLevel,newLevel){super.onMasteryLevelUp(action,oldLevel,newLevel);if(newLevel>=99&&this.isObstacleBuilt(action)){this.renderQueue.obstacleModifiers=true;this.computeProvidedStats();}}
get newBlueprint(){return{name:'Empty',obstacles:new Map()};}
getBlueprintName(index){var _a,_b;return(_b=(_a=this.blueprints.get(index))===null||_a===void 0?void 0:_a.name)!==null&&_b!==void 0?_b:'Empty';}
setBlueprintName(index,name){const blueprint=this.blueprints.get(index);if(blueprint!==undefined)
blueprint.name=name;}
loadBlueprints(){this.setupBlueprints();this.updateBlueprintNames();}
updateBlueprintNames(){for(let i=0;i<this.maxBlueprints;i++){const blueprint=this.blueprints.get(i);document.querySelectorAll('#agility-blueprint-name-'+i).forEach((el)=>{if(blueprint!==undefined&&blueprint.obstacles.size>0){el.textContent=this.getBlueprintName(i);el.classList.add('text-warning');el.classList.remove('text-success');}
else{el.textContent='Empty';el.classList.remove('text-warning');el.classList.add('text-success');}});}}
setupBlueprints(){for(let i=0;i<this.maxBlueprints;i++){if(!this.blueprints.has(i))
this.blueprints.set(i,this.newBlueprint);document.getElementById(`agility-save-blueprint-button-${i}`).onclick=()=>this.nameBlueprintSwal(i);document.getElementById(`agility-load-blueprint-button-${i}`).onclick=()=>this.loadBlueprint(i);}}
nameBlueprintSwal(index){Swal.fire({title:getLangString('MENU_TEXT','NAME_BLUEPRINT'),input:'text',inputAttributes:{autocapitalize:'off',maxLength:'20',},showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),customClass:{input:'text-combat-smoke'},}).then((result)=>{if(result.isConfirmed){result.value==''||typeof result.value!=='string'?this.saveBlueprint(index,'No name'):this.saveBlueprint(index,result.value);}});}
saveBlueprint(index,name){const blueprint=this.blueprints.get(index);if(blueprint===undefined)
throw new Error('Blueprint is undefined. Game not loaded correctly?');for(let i=0;i<this.maxObstacles;i++){const builtObstacle=this.builtObstacles.get(i);if(builtObstacle!==undefined)
blueprint.obstacles.set(i,builtObstacle);}
if(this.builtPassivePillar!==undefined)
blueprint.pillar=this.builtPassivePillar;if(this.builtElitePassivePillar!==undefined)
blueprint.elitePillar=this.builtElitePassivePillar;this.setBlueprintName(index,name);this.updateBlueprintNames();this.game.combat.notifications.add({type:'Player',args:[this.game.agility,getLangString('MENU_TEXT','BLUEPRINT_SAVED'),'success'],});console.log('Blueprint saved');}
loadBlueprint(index){const blueprint=this.blueprints.get(index);if(blueprint!==undefined&&blueprint.obstacles.size>0)
this.displayBlueprintSwal(blueprint);}
getBlueprintCostToBuild(blueprint){const costs=new Costs(this.game);blueprint.obstacles.forEach((obstacle)=>{if(!this.isObstacleBuilt(obstacle))
this.addSingleObstacleBuildCost(obstacle,costs);});if(blueprint.pillar!==undefined&&!this.isPillarBuilt(blueprint.pillar))
this.addSinglePillarBuildCost(blueprint.pillar,costs);if(blueprint.elitePillar!==undefined&&!this.isElitePillarBuilt(blueprint.elitePillar))
this.addSinglePillarBuildCost(blueprint.elitePillar,costs);return costs;}
displayBlueprintObstacleNames(blueprint){var _a,_b,_c,_d;const element=createElement('div',{classList:['font-size-sm','mb-1']});for(let tier=0;tier<this.maxObstacles;tier++){let obstacleName='No obstacle';let classList;const obstacle=blueprint.obstacles.get(tier);if(obstacle!==undefined){obstacleName=obstacle.name;classList=this.isObstacleBuilt(obstacle)?['text-success']:['text-white'];}
else
classList=['text-danger','font-w600'];const obstacleElement=createElement('span',{text:obstacleName,classList:[...classList],});element.appendChild(obstacleElement);if(tier<this.maxObstacles-1){const join=createElement('span',{text:` -> `,});element.appendChild(join);}}
const pillars=createElement('div',{classList:['font-size-sm','mb-2']});if(this.passivePillarUnlocked){const pillarElement=createElement('span',{text:(_b=(_a=blueprint.pillar)===null||_a===void 0?void 0:_a.name)!==null&&_b!==void 0?_b:'No Pillar',classList:blueprint.pillar!==undefined&&this.isPillarBuilt(blueprint.pillar)?['text-success']:['text-white'],});pillars.appendChild(pillarElement);}
if(this.elitePassivePillarUnlocked){const join=createElement('span',{text:` -> `,});pillars.appendChild(join);const elitePillarElement=createElement('span',{text:(_d=(_c=blueprint.elitePillar)===null||_c===void 0?void 0:_c.name)!==null&&_d!==void 0?_d:'No Elite Pillar',classList:blueprint.elitePillar!==undefined&&this.isElitePillarBuilt(blueprint.elitePillar)?['text-success']:['text-white'],});pillars.appendChild(elitePillarElement);}
element.appendChild(pillars);return element;}
displayBlueprintCostToBuild(costs){const container=createElement('div',{});container.append(createElement('h5',{classList:['font-w600','mb-2','font-size-sm'],text:getLangString('MENU_TEXT','COST_TO_SWAP_BLUEPRINT'),}));const createAndAppendReq=(media,qty,name,currentQty)=>{const newReq=createElement('inline-requirement',{classList:['font-size-sm','font-w400','mr-2','ml-2',currentQty>qty?'text-success':'text-danger'],});container.append(newReq);newReq.setContent(media,formatNumber(qty),name);};if(costs.gp>0){createAndAppendReq(cdnMedia("assets/media/main/coins.svg"),costs.gp,getLangString('MENU_TEXT','GP'),this.game.gp.amount);}
if(costs.sc>0){createAndAppendReq(cdnMedia("assets/media/main/slayer_coins.svg"),costs.sc,getLangString('MENU_TEXT','SLAYER_COINS'),this.game.slayerCoins.amount);}
costs.getItemQuantityArray().forEach(({item,quantity})=>{createAndAppendReq(item.media,quantity,item.name,this.game.bank.getQty(item));});return container;}
getAllBlueprintModifiers(blueprint){const modifiers=new MappedModifiers();blueprint.obstacles.forEach((obstacle)=>{modifiers.addMappedModifiers(this.getObstacleModifiers(obstacle));});if(blueprint.pillar!==undefined)
modifiers.addMappedModifiers(this.getPillarModifiers(blueprint.pillar));if(blueprint.elitePillar!==undefined)
modifiers.addMappedModifiers(this.getPillarModifiers(blueprint.elitePillar));return modifiers;}
displayBlueprintSwal(blueprint){const costs=this.getBlueprintCostToBuild(blueprint);const canAfford=costs.checkIfOwned();const modifiers=this.getAllBlueprintModifiers(blueprint);const modifierList=modifiers.getActiveModifierDescriptions().map(([text,textClass])=>`<h5 class="font-w400 font-size-sm mb-1 ${textClass}">${text}</h5>`).join('');const modifierContainer=createElement('div',{classList:['mb-2']});modifierContainer.innerHTML=modifierList;const content=createElement('div');content.append(this.displayBlueprintObstacleNames(blueprint));content.append(this.displayBlueprintCostToBuild(costs));content.append(createElement('h5',{classList:['font-w600','mb-2','mt-3','font-size-sm'],text:getLangString('MENU_TEXT','BLUEPRINT_MODIFIERS'),}));content.append(modifierContainer);SwalLocale.fire({titleText:blueprint.name,html:content,showCancelButton:true,showConfirmButton:canAfford,confirmButtonText:getLangString('MENU_TEXT','REPLACE_COURSE'),cancelButtonText:'Cancel',}).then((result)=>{if(result.value)
this.replaceCourseWithBlueprint(blueprint);});}
replaceCourseWithBlueprint(blueprint){const numUnlocked=this.numObstaclesUnlocked;for(let tier=0;tier<numUnlocked;tier++){const obstacle=blueprint.obstacles.get(tier);if(obstacle!==undefined){if(!this.isObstacleBuilt(obstacle))
this.buildObstacle(obstacle);}
else{this.destroyObstacle(tier);}}
if(blueprint.pillar!==undefined&&!this.isPillarBuilt(blueprint.pillar))
this.buildPillar(blueprint.pillar);if(blueprint.elitePillar!==undefined&&!this.isElitePillarBuilt(blueprint.elitePillar))
this.buildPillar(blueprint.elitePillar);}
onLoad(){super.onLoad();this.computeProvidedStats(false);this.renderQueue.builtObstacles=true;this.renderQueue.obstacleRates=true;this.renderQueue.obstacleModifiers=true;this.renderQueue.startButtons=true;const progressBar=document.getElementById('agility-progress-bar');progressBar.setSegmentPattern(['bg-info','bg-agility']);if(this.isActive){this.renderQueue.progressBar=true;this.renderQueue.obstacleHighlights.add(this.currentlyActiveObstacle);}
document.getElementById('agility-start-button').onclick=()=>this.startAgilityOnClick();document.getElementById('agility-stop-button').onclick=()=>this.stopAgilityOnClick();document.getElementById('agility-obstacle-info-0').textContent=templateLangString('MENU_TEXT','OBSTACLE_INFO_0',{reduction:`4`,maxStacks:`10`});document.getElementById('agility-obstacle-info-1').textContent=templateLangString('MENU_TEXT','OBSTACLE_INFO_1',{reductionCap:`95`});document.getElementById('agility-view-passives-button').onclick=()=>this.viewAllPassivesOnClick();this.loadBlueprints();}
onModifierChange(){super.onModifierChange();this.renderQueue.obstacleRates=true;}
onEquipmentChange(){}
onLevelUp(oldLevel,newLevel){super.onLevelUp(oldLevel,newLevel);this.renderQueue.builtObstacles=true;}
getErrorLog(){const obstacleLog=[];this.builtObstacles.forEach((obstacle,tier)=>{obstacleLog.push(`${tier}:${obstacle.id}`);});return `${super.getErrorLog()}
Active Obstacle Tier: ${this.currentlyActiveObstacle}
Built Obstacles (tier|obstacleID):
${obstacleLog.join('\n')}`;}
render(){super.render();this.renderBuiltObstacles();this.renderCourseRates();this.renderCourseModifiers();this.renderObstacleHighlights();this.renderProgressBar();this.renderStartStopButtons();}
renderCourseRates(){if(!this.renderQueue.obstacleRates)
return;let obstaclesActive=true;let totalInterval=0;let totalXP=0;let totalGP=0;const maxObstacles=this.numObstaclesUnlocked;for(let tier=0;tier<maxObstacles;tier++){const obstacle=this.builtObstacles.get(tier);if(obstacle!==undefined){const interval=this.getObstacleInterval(obstacle);const xp=this.modifyXP(obstacle.baseExperience,obstacle);const gp=this.getObstacleGP(obstacle);if(obstaclesActive){totalInterval+=interval;totalXP+=xp;totalGP+=gp;}
const menu=agilityObstacleMenus[tier];menu.updateRates(interval,xp,gp);}
else{obstaclesActive=false;}}
document.getElementById('agility-breakdown-interval').textContent=templateLangString('MENU_TEXT','SECONDS_SHORT',{seconds:formatFixed(totalInterval/1000,2),});document.getElementById('agility-breakdown-xp').textContent=templateLangString('MENU_TEXT','XP_AMOUNT',{xp:formatNumber(Math.floor(totalXP)),});document.getElementById('agility-breakdown-gp').textContent=templateLangString('MENU_TEXT','GP_AMOUNT',{gp:formatNumber(totalGP),});this.renderQueue.obstacleRates=false;}
renderBuiltObstacles(){if(!this.renderQueue.builtObstacles)
return;const maxTier=this.numObstaclesUnlocked;let obstaclesActive=true;let obstacles120Active=true;for(let tier=0;tier<maxTier;tier++){const menu=agilityObstacleMenus[tier];const obstacle=this.builtObstacles.get(tier);if(obstacle===undefined){menu.setUnbuilt(tier);menu.setUnlocked();if(tier<10)
obstaclesActive=false;obstacles120Active=false;}
else{menu.setBuiltObstacle(obstacle);if(obstaclesActive&&tier<10)
menu.setActive();else if(obstacles120Active)
menu.setActive();else
menu.setInactive();}
showElement(menu);}
if(maxTier<this.maxObstacles){const nextTierMenu=agilityObstacleMenus[maxTier];nextTierMenu.setUnbuilt(maxTier);nextTierMenu.setLevelLocked(this.getObstacleLevel(maxTier));showElement(nextTierMenu);}
if(this.passivePillarUnlocked){showElement(agilityPassivePillarMenu);if(this.builtPassivePillar===undefined){agilityPassivePillarMenu.setUnbuilt();}
else{agilityPassivePillarMenu.setBuilt(this.builtPassivePillar);if(obstaclesActive)
agilityPassivePillarMenu.setActive();else
agilityPassivePillarMenu.setInactive();}}
if(this.elitePassivePillarUnlocked){showElement(agilityElitePassivePillarMenu);if(this.builtElitePassivePillar===undefined){agilityElitePassivePillarMenu.setUnbuilt();}
else{agilityElitePassivePillarMenu.setBuilt(this.builtElitePassivePillar);if(obstacles120Active)
agilityElitePassivePillarMenu.setActive();else
agilityElitePassivePillarMenu.setInactive();}}
this.renderQueue.builtObstacles=false;}
renderCourseModifiers(){if(!this.renderQueue.obstacleModifiers)
return;this.builtObstacles.forEach((obstacle,tier)=>{if(tier>this.maxObstacles)
return;const menu=agilityObstacleMenus[tier];menu.updatePassives(this.getObstacleModifiers(obstacle));});this.renderQueue.obstacleModifiers=false;}
renderObstacleHighlights(){if(this.renderQueue.obstacleHighlights.size===0)
return;this.renderQueue.obstacleHighlights.forEach((tier)=>{agilityObstacleMenus[tier].setHighlight(this.currentlyActiveObstacle===tier);});this.renderQueue.obstacleHighlights.clear();}
renderProgressBar(){if(!this.renderQueue.progressBar)
return;const progressBar=document.getElementById('agility-progress-bar');progressBar.setMaxSegments(this.numObstaclesUnlocked);if(this.isActive){progressBar.animateFromTimer(this.currentlyActiveObstacle,this.actionTimer);}
else{progressBar.stopAnimation();}
this.renderQueue.progressBar=false;}
renderStartStopButtons(){if(!this.renderQueue.startButtons)
return;const startButton=document.getElementById('agility-start-button');const stopButton=document.getElementById('agility-stop-button');if(this.isActive){startButton.disabled=true;stopButton.disabled=false;}
else{startButton.disabled=false;stopButton.disabled=true;}
this.renderQueue.startButtons=false;}
startAgilityOnClick(){if(this.isActive||!this.builtObstacles.has(0))
return;this.start();}
stopAgilityOnClick(){this.stop();}
createSelectionMenus(count){const selectionContainer=document.getElementById('modal-select-agility-obstacle-content');while(agilityObstacleSelectMenus.length<count){const newMenu=new AgilityObstacleSelection();newMenu.classList.add('col-12');selectionContainer.append(newMenu);agilityObstacleSelectMenus.push(newMenu);}}
viewObstacleSelectionOnClick(category){var _a,_b;if(this.level<this.getObstacleLevel(category))
return;const obstacleSelection=this.actions.filter((obstacle)=>obstacle.category===category);this.createSelectionMenus(obstacleSelection.length);agilityObstacleSelectMenus.forEach((menu,i)=>{if(i<obstacleSelection.length){showElement(menu);menu.setObstacle(obstacleSelection[i]);}
else{hideElement(menu);}});(_a=document.getElementById('build-pillar-info'))===null||_a===void 0?void 0:_a.classList.replace('d-flex','d-none');(_b=document.getElementById('build-obstacle-info'))===null||_b===void 0?void 0:_b.classList.replace('d-none','d-flex');$('#modal-select-agility-obstacle').modal('show');}
destroyObstacleOnClick(category){SwalLocale.fire({title:getLangString('MENU_TEXT','DESTROY_OBSTACLE?'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${getLangString('MENU_TEXT','DISABLE_OBSTACLE')}</h5><h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','DESTROY'),}).then((result)=>{if(result.value){this.destroyObstacle(category);}});}
computeProvidedStats(updatePlayer=true){this.modifiers.reset();const maxTier=this.numObstaclesUnlocked;let all10Active=true;let all15Active=true;for(let tier=0;tier<maxTier;tier++){const obstacle=this.builtObstacles.get(tier);const badObstacle=obstacle===undefined||obstacle instanceof DummyObstacle;if(tier<10&&badObstacle){all10Active=false;all15Active=false;break;}
else if(badObstacle){all15Active=false;break;}
else{const modifiers=this.getObstacleModifiers(obstacle);this.modifiers.addMappedModifiers(modifiers);}}
if(this.passivePillarUnlocked&&all10Active&&this.builtPassivePillar!==undefined){this.modifiers.addMappedModifiers(this.getPillarModifiers(this.builtPassivePillar));}
if(this.elitePassivePillarUnlocked&&all15Active&&this.builtElitePassivePillar!==undefined){this.modifiers.addMappedModifiers(this.getPillarModifiers(this.builtElitePassivePillar));}
if(updatePlayer)
this.game.combat.player.computeAllStats();}
onObstacleChange(){this.renderQueue.builtObstacles=true;this.renderQueue.obstacleRates=true;this.computeProvidedStats();}
destroyObstacle(category){if(!this.builtObstacles.has(category))
return;if(this.isActive&&!this.stop())
return;this.builtObstacles.delete(category);this.onObstacleChange();}
buildObstacle(obstacle){if(this.isActive&&!this.stop())
return;const costs=this.getObstacleBuildCosts(obstacle);costs.consumeCosts();this.builtObstacles.set(obstacle.category,obstacle);this.obstacleBuildCount.set(obstacle,this.getObstacleBuildCount(obstacle)+1);this.renderQueue.obstacleModifiers=true;this.onObstacleChange();}
buildPillar(pillar){const costs=this.getPillarBuildCosts(pillar);costs.consumeCosts();this.builtPassivePillar=pillar;this.renderQueue.obstacleModifiers=true;this.onObstacleChange();}
destroyPillar(){if(this.builtPassivePillar===undefined)
return;this.builtPassivePillar=undefined;this.onObstacleChange();}
viewPillarSelectionOnClick(){var _a,_b;if(!this.passivePillarUnlocked)
return;const allPillars=this.pillars.allObjects;this.createSelectionMenus(allPillars.length);agilityObstacleSelectMenus.forEach((menu,i)=>{if(i<allPillars.length){showElement(menu);menu.setPillar(allPillars[i]);}
else{hideElement(menu);}});(_a=document.getElementById('build-pillar-info'))===null||_a===void 0?void 0:_a.classList.replace('d-none','d-flex');(_b=document.getElementById('build-obstacle-info'))===null||_b===void 0?void 0:_b.classList.replace('d-flex','d-none');$('#modal-select-agility-obstacle').modal('show');}
destroyPillarOnClick(){SwalLocale.fire({title:getLangString('MENU_TEXT','DESTROY_PILLAR?'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${getLangString('MENU_TEXT','DISABLE_PILLAR')}</h5><h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','DESTROY'),}).then((result)=>{if(result.value){this.destroyPillar();}});}
buildElitePillar(pillar){const costs=this.getPillarBuildCosts(pillar);costs.consumeCosts();this.builtElitePassivePillar=pillar;this.renderQueue.obstacleModifiers=true;this.onObstacleChange();}
destroyElitePillar(){if(this.builtElitePassivePillar===undefined)
return;this.builtElitePassivePillar=undefined;this.onObstacleChange();}
viewElitePillarSelectionOnClick(){var _a,_b;if(!this.elitePassivePillarUnlocked)
return;const allPillars=this.elitePillars.allObjects;this.createSelectionMenus(allPillars.length);agilityObstacleSelectMenus.forEach((menu,i)=>{if(i<allPillars.length){showElement(menu);menu.setElitePillar(allPillars[i]);}
else{hideElement(menu);}});(_a=document.getElementById('build-pillar-info'))===null||_a===void 0?void 0:_a.classList.replace('d-none','d-flex');(_b=document.getElementById('build-obstacle-info'))===null||_b===void 0?void 0:_b.classList.replace('d-flex','d-none');$('#modal-select-agility-obstacle').modal('show');}
destroyElitePillarOnClick(){SwalLocale.fire({title:getLangString('MENU_TEXT','DESTROY_PILLAR?'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${getLangString('MENU_TEXT','DISABLE_PILLAR')}</h5><h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','DESTROY'),}).then((result)=>{if(result.value){this.destroyElitePillar();}});}
buildObstacleOnClick(obstacle){const costs=this.getObstacleBuildCosts(obstacle);if(!costs.checkIfOwned()||this.level<this.getObstacleLevel(obstacle.category)||this.isObstacleBuilt(obstacle)||!this.game.checkRequirements(obstacle.skillRequirements,true))
return;SwalLocale.fire({title:getLangString('MENU_TEXT','BUILD_OBSTACLE?'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${getLangString('MENU_TEXT','REPLACE_OBSTACLE')}</h5><h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','BUILD'),}).then((result)=>{if(result.value){$('#modal-select-agility-obstacle').modal('hide');this.buildObstacle(obstacle);}});}
buildPillarOnClick(pillar){const costs=this.getPillarBuildCosts(pillar);if(!costs.checkIfOwned()||!this.passivePillarUnlocked||this.isPillarBuilt(pillar))
return;SwalLocale.fire({title:getLangString('MENU_TEXT','BUILD_PASSIVE_PILLAR?'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${getLangString('MENU_TEXT','REPLACE_PILLAR')}</h5><h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','BUILD'),}).then((result)=>{if(result.value){$('#modal-select-agility-obstacle').modal('hide');this.buildPillar(pillar);}});}
buildElitePillarOnClick(pillar){const costs=this.getPillarBuildCosts(pillar);if(!costs.checkIfOwned()||!this.elitePassivePillarUnlocked||this.isElitePillarBuilt(pillar))
return;SwalLocale.fire({title:getLangString('MENU_TEXT','BUILD_PASSIVE_PILLAR?'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${getLangString('MENU_TEXT','REPLACE_PILLAR')}</h5><h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','BUILD'),}).then((result)=>{if(result.value){$('#modal-select-agility-obstacle').modal('hide');this.buildElitePillar(pillar);}});}
viewAllPassivesOnClick(){let passives=`<h5 class="font-w600 font-size-sm mb-1 text-combat-smoke">${getLangString('MENU_TEXT','CURRENT_PASSIVES')}</h5><h5 class="font-w600 font-size-sm mb-3 text-warning"><small>(${getLangString('MENU_TEXT','DOES_NOT_SHOW_DISABLED')})</small></h5>`;passives+=this.modifiers.getActiveModifierDescriptions().map(([text,textClass])=>`<h5 class="font-w400 font-size-sm mb-1 ${textClass}">${text}</h5>`).join('');SwalLocale.fire({html:passives,});}
resetActionState(){super.resetActionState();this.currentlyActiveObstacle=-1;}
encode(writer){super.encode(writer);writer.writeInt16(this.currentlyActiveObstacle);writer.writeMap(this.builtObstacles,(category,writer)=>writer.writeUint8(category),writeNamespaced);writer.writeMap(this.obstacleBuildCount,writeNamespaced,(count,writer)=>writer.writeUint32(count));writer.writeBoolean(this.builtPassivePillar!==undefined);if(this.builtPassivePillar!==undefined)
writer.writeNamespacedObject(this.builtPassivePillar);writer.writeBoolean(this.builtElitePassivePillar!==undefined);if(this.builtElitePassivePillar!==undefined)
writer.writeNamespacedObject(this.builtElitePassivePillar);writer.writeMap(this.blueprints,(id,writer)=>writer.writeUint8(id),(blueprint,writer)=>{writer.writeString(blueprint.name);writer.writeMap(blueprint.obstacles,(tier,writer)=>writer.writeUint8(tier),writeNamespaced);writer.writeBoolean(blueprint.pillar!==undefined);if(blueprint.pillar)
writer.writeNamespacedObject(blueprint.pillar);writer.writeBoolean(blueprint.elitePillar!==undefined);if(blueprint.elitePillar)
writer.writeNamespacedObject(blueprint.elitePillar);});return writer;}
getDummyObstacle(id){if(id.startsWith('melvor'))
return this.actions.getDummyObject(id,DummyObstacle,this.game);else
return undefined;}
decode(reader,version){super.decode(reader,version);this.currentlyActiveObstacle=reader.getInt16();this.builtObstacles=reader.getMap((reader)=>reader.getUint8(),(reader)=>{const obstacle=reader.getNamespacedObject(this.actions);if(typeof obstacle==='string'){this.shouldResetAction=true;return this.getDummyObstacle(obstacle);}
return obstacle;});this.obstacleBuildCount=reader.getMap((reader)=>{const obstacle=reader.getNamespacedObject(this.actions);if(typeof obstacle==='string')
return this.getDummyObstacle(obstacle);return obstacle;},(reader)=>reader.getUint32());if(reader.getBoolean()){const pillar=reader.getNamespacedObject(this.pillars);if(typeof pillar==='string'){if(pillar.startsWith('melvor'))
this.builtPassivePillar=this.pillars.getDummyObject(pillar,DummyPillar,this.game);}
else
this.builtPassivePillar=pillar;}
if(reader.getBoolean()){const pillar=reader.getNamespacedObject(this.elitePillars);if(typeof pillar==='string'){if(pillar.startsWith('melvor'))
this.builtElitePassivePillar=this.elitePillars.getDummyObject(pillar,DummyPillar,this.game);}
else
this.builtElitePassivePillar=pillar;}
if(version>=26){this.blueprints=reader.getMap((reader)=>reader.getUint8(),(reader)=>{const blueprint={name:'',obstacles:new Map(),};blueprint.name=reader.getString();blueprint.obstacles=reader.getMap((reader)=>reader.getUint8(),readNamespacedReject(this.actions));if(reader.getBoolean()){const pillar=reader.getNamespacedObject(this.pillars);if(typeof pillar!=='string')
blueprint.pillar=pillar;}
if(reader.getBoolean()){const elitePillar=reader.getNamespacedObject(this.elitePillars);if(typeof elitePillar!=='string')
blueprint.elitePillar=elitePillar;}
return blueprint;});}
if(this.shouldResetAction)
this.resetActionState();}
deserialize(reader,version,idMap){super.deserialize(reader.getVariableLengthChunk(),version,idMap);const getObstacle=(id)=>{const newID=idMap.agilityObstacles[id];let obstacle=this.actions.getObjectByID(newID);if(obstacle===undefined){obstacle=this.getDummyObstacle(newID);this.shouldResetAction=true;}
if(obstacle===undefined)
throw new Error('Error could not get dummy obstacle.');return obstacle;};const getPillar=(id)=>{const newID=idMap.agilityPillars[id];let pillar=this.pillars.getObjectByID(newID);if(pillar===undefined)
pillar=this.pillars.getDummyObject(newID,DummyPillar,this.game);return pillar;};const getElitePillar=(id)=>{const newID=idMap.agilityElitePillars[id];let pillar=this.elitePillars.getObjectByID(newID);if(pillar===undefined)
pillar=this.elitePillars.getDummyObject(newID,DummyPillar,this.game);return pillar;};this.currentlyActiveObstacle=reader.getNumber();const numBuiltObstacles=reader.getNumber();for(let i=0;i<numBuiltObstacles;i++){this.builtObstacles.set(reader.getNumber(),getObstacle(reader.getNumber()));}
const numBuiltCountObstacles=reader.getNumber();for(let i=0;i<numBuiltCountObstacles;i++){this.obstacleBuildCount.set(getObstacle(reader.getNumber()),reader.getNumber());}
const passivePillarID=reader.getNumber();if(passivePillarID!==-1)
this.builtPassivePillar=getPillar(passivePillarID);if(version>=20){const elitePassivePillarID=reader.getNumber();if(elitePassivePillarID!==-1)
this.builtElitePassivePillar=getElitePillar(elitePassivePillarID);}
if(this.shouldResetAction)
this.resetActionState();}
convertFromOldFormat(savegame,idMap){if(savegame.chosenAgilityObstacles!==undefined){savegame.chosenAgilityObstacles.forEach((id)=>{const newID=idMap.agilityObstacles[id];if(newID===undefined)
return;let obstacle=this.actions.getObjectByID(newID);if(obstacle===undefined)
obstacle=this.getDummyObstacle(newID);if(obstacle!==undefined)
this.builtObstacles.set(obstacle.category,obstacle);});}
if(savegame.agilityObstacleBuildCount!==undefined){savegame.agilityObstacleBuildCount.forEach((count,id)=>{const newID=idMap.agilityObstacles[id];let obstacle=this.actions.getObjectByID(newID);if(obstacle===undefined)
obstacle=this.getDummyObstacle(newID);if(count>0&&obstacle!==undefined)
this.obstacleBuildCount.set(obstacle,count);});}
if(savegame.agilityPassivePillarActive!==undefined&&savegame.agilityPassivePillarActive!==-1){const newID=idMap.agilityPillars[savegame.agilityPassivePillarActive];let pillar=this.pillars.getObjectByID(newID);if(pillar===undefined)
pillar=this.pillars.getDummyObject(newID,DummyPillar,this.game);this.builtPassivePillar=pillar;}}
getActionIDFromOldID(oldActionID,idMap){return idMap.agilityObstacles[oldActionID];}
setFromOldOffline(offline){this.currentlyActiveObstacle=offline.action;this.renderQueue.obstacleHighlights.add(this.currentlyActiveObstacle);this.renderQueue.startButtons=true;super.start();}
getObstacleLevel(category){if(category===0)
return 1;else
return this.obstacleUnlockLevels[category-1];}
testTranslations(){super.testTranslations();this.actions.forEach((action)=>{action.name;});this.pillars.forEach((pillar)=>{pillar.name;});this.elitePillars.forEach((pillar)=>{pillar.name;});}}
class AgilityRenderQueue extends GatheringSkillRenderQueue{constructor(){super(...arguments);this.obstacleRates=false;this.builtObstacles=false;this.obstacleModifiers=false;this.obstacleHighlights=new Set();this.startButtons=false;}}