"use strict";class FarmingRecipe extends SingleProductRecipe{constructor(namespace,data,skill,game){super(namespace,data,game);this.baseInterval=data.baseInterval;const category=skill.categories.getObjectByID(data.categoryID);if(category===undefined)
throw new Error(`Error constructing FarmingRecipe with id: ${this.id}. Category with id: ${data.categoryID} is not registered.`);this.category=category;this.seedCost=game.items.getQuantity(data.seedCost);this._grownName=data.grownName;this._grownMedia=data.grownMedia;this._grownNameLang=data.grownNameLang;}
get name(){if(this._grownNameLang!==undefined){return getLangString(this._grownNameLang.category,this._grownNameLang.id);}
else if(this._grownName!==undefined){return this._grownName;}
else{return super.name;}}
get media(){if(this._grownMedia!==undefined){return this.getMediaURL(this._grownMedia);}
else{return super.media;}}}
class FarmingCategory extends SkillCategory{constructor(namespace,data,skill){super(namespace,data,skill);this.returnSeeds=data.returnSeeds;this.scaleXPWithQuantity=data.scaleXPWithQuantity;this.harvestMultiplier=data.harvestMultiplier;this.masteryXPDivider=data.masteryXPDivider;this.giveXPOnPlant=data.giveXPOnPlant;this._singularName=data.singularName;this._description=data.description;this._seedNotice=data.seedNotice;}
get singularName(){if(this.isModded){return this._singularName;}
else{return getLangString('SKILL_CATEGORY',`${this.skill.localID}_${this.localID}_singular`);}}
get description(){if(this.isModded){return this._description;}
else{return getLangString('SKILL_CATEGORY',`${this.skill.localID}_${this.localID}_description`);}}
get seedNotice(){if(this.isModded){return this._seedNotice;}
else{return getLangString('SKILL_CATEGORY',`${this.skill.localID}_${this.localID}_seedNotice`);}}}
class FarmingPlot extends NamespacedObject{constructor(namespace,data,farming){super(namespace,data.id);this.farming=farming;this.state=1;this.compostLevel=0;this.growthTime=0;const category=farming.categories.getObjectByID(data.categoryID);if(category===undefined)
throw new Error(`Error constructing FarmingPlot with id: ${this.id}. Category with id: ${data.categoryID} is not registered.`);this.category=category;this.level=data.level;this.gpCost=data.gpCost;this.state=this.gpCost===0&&this.level===1?1:0;}
encode(writer){writer.writeUint8(this.state);writer.writeBoolean(this.plantedRecipe!==undefined);if(this.plantedRecipe!==undefined)
writer.writeNamespacedObject(this.plantedRecipe);writer.writeBoolean(this.compostItem!==undefined);if(this.compostItem!==undefined)
writer.writeNamespacedObject(this.compostItem);writer.writeUint8(this.compostLevel);writer.writeBoolean(this.selectedRecipe!==undefined);if(this.selectedRecipe!==undefined)
writer.writeNamespacedObject(this.selectedRecipe);writer.writeFloat64(this.growthTime);return writer;}
decode(reader,version){this.state=reader.getUint8();let resetPlanted=false;let resetCompost=false;if(reader.getBoolean()){const planted=reader.getNamespacedObject(this.farming.actions);if(typeof planted==='string'){resetPlanted=true;}
else
this.plantedRecipe=planted;}
if(reader.getBoolean()){const compost=reader.getNamespacedObject(this.farming.composts);if(typeof compost==='string'){resetCompost=true;}
else
this.compostItem=compost;}
this.compostLevel=reader.getUint8();if(reader.getBoolean()){const selected=reader.getNamespacedObject(this.farming.actions);if(typeof selected==='string'){this.selectedRecipe=this.farming.actions.find((recipe)=>recipe.category===this.category);}
else
this.selectedRecipe=selected;}
this.growthTime=reader.getFloat64();if(resetPlanted||(this.state===3&&this.plantedRecipe===undefined)){this.state=1;this.growthTime=0;}
if(resetCompost){this.compostLevel=0;}}}
class DummyFarmingPlot extends FarmingPlot{constructor(namespace,id,game){super(namespace,{id,categoryID:"melvorD:Allotment",level:1,gpCost:-1},game.farming);}
decode(reader,version){super.decode(reader,version);}}
class FarmingRenderQueue extends MasterySkillRenderQueue{constructor(){super(...arguments);this.growthTime=new Set();this.growthState=new Set();this.compost=new Set();this.selectedSeed=new Set();this.growthIndicators=false;this.compostQuantity=false;}}
class FarmingGrowthTimer extends Timer{constructor(plots,farming){super('Skill',()=>farming.growPlots(this));this.plots=plots;this.farming=farming;}
encode(writer){super.encode(writer);writer.writeArray(this.plots,writeNamespaced);return writer;}
decode(reader,version){super.decode(reader,version);this.plots=reader.getArray(readNamespacedReject(this.farming.plots));}}
class Farming extends SkillWithMastery{constructor(namespace,game){super(namespace,'Farming',game);this._media='assets/media/skills/farming/farming.svg';this.herbSeedToProductMap=new Map();this.categoryRecipeMap=new Map();this.categoryPlotMap=new Map();this.growthTimers=new Set();this.growthTimerMap=new Map();this.renderQueue=new FarmingRenderQueue();this.categories=new NamespaceRegistry(game.registeredNamespaces);this.plots=new NamespaceRegistry(game.registeredNamespaces);}
get isPotionActive(){return this.game.potions.isPotionActiveForAction(this);}
get activePotion(){return this.game.potions.getActivePotionForAction(this);}
get composts(){return this.game.items.composts;}
get isAnyPlotGrown(){return this.plots.some((plot)=>plot.state===3||plot.state===4);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
onLoad(){super.onLoad();this.showPlotsInCategory(this.categories.firstObject);this.renderQueue.growthIndicators=true;}
onPageChange(){this.renderQueue.compostQuantity=true;this.render();}
queueBankQuantityRender(item){if(item instanceof CompostItem)
this.renderQueue.compostQuantity=true;}
getErrorLog(){const plotLog=[];this.plots.forEach((plot)=>{var _a,_b,_c;plotLog.push(`id: ${plot.id}; state: ${plot.state}; plantedRecipe: ${(_a=plot.plantedRecipe)===null||_a===void 0?void 0:_a.id}; compostItem: ${(_b=plot.compostItem)===null||_b===void 0?void 0:_b.id}; compostLevel: ${plot.compostLevel}; selectedRecipe: ${(_c=plot.selectedRecipe)===null||_c===void 0?void 0:_c.id}; growthTime: ${plot.growthTime};`);});const timerLog=[];this.growthTimers.forEach((timer)=>{timerLog.push(`plots: ${timer.plots.map((plot)=>plot.id).join(',')};`);});return `== Timer Information ==
${timerLog.join('\n')}
== Plot Information == 
${plotLog.join('\n')}`;}
registerData(namespace,data){var _a,_b,_c;super.registerData(namespace,data);(_a=data.categories)===null||_a===void 0?void 0:_a.forEach((categoryData)=>{this.categories.registerObject(new FarmingCategory(namespace,categoryData,this));});(_b=data.recipes)===null||_b===void 0?void 0:_b.forEach((recipeData)=>{this.actions.registerObject(new FarmingRecipe(namespace,recipeData,this,this.game));});(_c=data.plots)===null||_c===void 0?void 0:_c.forEach((plotData)=>{this.plots.registerObject(new FarmingPlot(namespace,plotData,this));});}
postDataRegistration(){super.postDataRegistration();this.actions.forEach((recipe)=>{if(recipe.category.id==="melvorD:Herb")
this.herbSeedToProductMap.set(recipe.seedCost.item,recipe.product);});this.sortedMasteryActions=sortRecipesByCategoryAndLevel(this.actions.allObjects,this.categories.allObjects);this.milestones.push(...this.actions.allObjects);this.sortMilestones();this.categories.forEach((category)=>{const recipes=this.actions.filter((recipe)=>recipe.category===category).sort((a,b)=>a.level-b.level);this.categoryRecipeMap.set(category,recipes);const plots=this.plots.filter((plot)=>plot.category===category).sort((a,b)=>a.level-b.level);this.categoryPlotMap.set(category,plots);plots.forEach((plot)=>{if(plot.selectedRecipe===undefined)
plot.selectedRecipe=recipes[0];});});}
growPlots(timer){let anyFailed=false;let anyGrown=false;timer.plots.forEach((plot)=>{var _a;const success=rollPercentage(this.getPlotGrowthChance(plot));plot.state=success?3:4;(_a=this.renderQueue).growthIndicators||(_a.growthIndicators=success);this.renderQueue.growthState.add(plot);this.growthTimerMap.delete(plot);this.game.stats.Farming.add(success?FarmingStats.TimeSpentWaitingForCrops:FarmingStats.TimeSpentWaitingForDeadCrops,plot.growthTime);if(!success)
this.game.stats.Farming.inc(FarmingStats.CropsDied);anyFailed||(anyFailed=!success);anyGrown||(anyGrown=success);});if(anyFailed){this.game.combat.notifications.add({type:'Player',args:[this,getLangString('TOASTS','CROP_FAILED'),'danger'],});}
if(anyGrown){this.game.combat.notifications.add({type:'Player',args:[this,getLangString('TOASTS','CROP_READY')],});}
this.removeGrowthTimer(timer);}
removeGrowthTimer(timer){this.growthTimers.delete(timer);this.renderQueue.growthTime.delete(timer);}
getHerbFromSeed(seedItem){return this.herbSeedToProductMap.get(seedItem);}
getRecipesForCategory(category){var _a;return(_a=this.categoryRecipeMap.get(category))!==null&&_a!==void 0?_a:[];}
getPlotsForCategory(category){var _a;return(_a=this.categoryPlotMap.get(category))!==null&&_a!==void 0?_a:[];}
getOwnedRecipeSeeds(recipe){return this.game.bank.getQty(recipe.seedCost.item);}
getRecipeSeedCost(recipe){let quantity=recipe.seedCost.quantity;if(recipe.category.id==="melvorD:Allotment")
quantity+=this.game.modifiers.increasedAllotmentSeedCost-this.game.modifiers.decreasedAllotmentSeedCost;quantity=Math.max(0,quantity);return quantity;}
getPercentageIntervalModifier(action){const masteryLevel=this.getMasteryLevel(action);let modifier=super.getPercentageIntervalModifier(action);if(masteryLevel>=99)
modifier-=10;if(this.isPoolTierActive(3))
modifier-=10;return modifier;}
getRecipeInterval(recipe){return this.modifyInterval(recipe.baseInterval,recipe);}
getPlotGrowthChance(plot){let chance=50+plot.compostLevel/2;if((plot.plantedRecipe!==undefined&&this.getMasteryLevel(plot.plantedRecipe)>=50)||this.isPoolTierActive(1)){chance=100;}
return chance;}
getPlotGrowthTime(plot){const timer=this.growthTimerMap.get(plot);if(timer===undefined)
return 0;return timer.ticksLeft*TICK_INTERVAL;}
getHarvestAllCost(category){return 2000;}
getCompostAllCost(category){return 2000;}
getPlantAllCost(category){return 5000;}
harvestPlot(plot){if(plot.state!==3||plot.plantedRecipe===undefined)
return false;const recipe=plot.plantedRecipe;const masteryLevel=this.getMasteryLevel(recipe);let harvestQuantity=Math.floor(5+masteryLevel*0.4);let quantityMultiplier=this.game.modifiers.increasedFarmingYield-this.game.modifiers.decreasedFarmingYield;if(this.isPoolTierActive(2))
quantityMultiplier+=5;if(masteryLevel>=99)
quantityMultiplier+=20;if(plot.compostItem!==undefined)
quantityMultiplier+=plot.compostItem.harvestBonus;harvestQuantity=applyModifier(harvestQuantity,quantityMultiplier);if(rollPercentage(this.getDoublingChance(recipe)))
harvestQuantity*=2;harvestQuantity*=recipe.category.harvestMultiplier;harvestQuantity+=this.game.modifiers.increasedFlatFarmingYield-this.game.modifiers.decreasedFlatFarmingYield;if(!this.game.bank.addItem(recipe.product,harvestQuantity,false,true))
return false;const rewards=new Rewards(this.game);this.rollForPets(plot.growthTime);if(recipe.category.returnSeeds&&masteryLevel>=15){const maxSeeds=masteryLevel>=99?8:masteryLevel/15;const seedQty=Math.floor(Math.random()*maxSeeds);if(seedQty>0)
rewards.addItem(recipe.seedCost.item,seedQty);}
this.rollForRareDrops(recipe.level,rewards);if(this.masteryToken!==undefined&&rollPercentage(this.masteryTokenChance)){rewards.addItem(this.masteryToken,1);}
let xpToAdd=recipe.baseExperience;if(recipe.category.scaleXPWithQuantity)
xpToAdd*=harvestQuantity;rewards.addXP(this,xpToAdd);this.addMasteryForAction(recipe,(plot.growthTime*harvestQuantity)/recipe.category.masteryXPDivider);rewards.giveRewards();switch(recipe.category.id){case "melvorD:Allotment":this.game.stats.Farming.inc(FarmingStats.AllotmentsHarvested);this.game.stats.Farming.add(FarmingStats.FoodGained,harvestQuantity);break;case "melvorD:Tree":this.game.stats.Farming.inc(FarmingStats.TreesHarvested);this.game.stats.Farming.add(recipe.product instanceof FoodItem?FarmingStats.FoodGained:FarmingStats.LogsGained,harvestQuantity);break;case "melvorD:Herb":this.game.stats.Farming.inc(FarmingStats.HerbsHarvested);this.game.stats.Farming.add(FarmingStats.HerbsGained,harvestQuantity);break;}
this.game.stats.Items.add(recipe.seedCost.item,ItemStats.TimesGrown,1);this.game.stats.Items.add(recipe.product,ItemStats.HarvestAmount,harvestQuantity);this.game.stats.Items.add(recipe.seedCost.item,ItemStats.TimeWaited,plot.growthTime);this.resetPlot(plot);const event=new FarmingHarvestActionEvent(this,recipe);event.productQuantity=harvestQuantity;event.successful=true;this.game.processEvent(event);return true;}
clearDeadPlot(plot){if(plot.state!==4||plot.plantedRecipe===undefined)
return;this.resetPlot(plot);const event=new FarmingHarvestActionEvent(this,plot.plantedRecipe);event.successful=false;this.game.processEvent(event);}
resetPlot(plot){plot.state=1;plot.plantedRecipe=undefined;plot.growthTime=0;this.renderQueue.growthState.add(plot);this.renderQueue.growthIndicators=true;if(!rollPercentage(this.game.modifiers.increasedCompostPreservationChance)){plot.compostItem=undefined;plot.compostLevel=0;this.renderQueue.compost.add(plot);}}
plantPlot(plot,recipe,isSelected=false){if(plot.state!==1)
return-1;const costs=new Costs(this.game);const seedQuantity=this.getRecipeSeedCost(recipe);costs.addItem(recipe.seedCost.item,seedQuantity);if(!costs.checkIfOwned()){if(isSelected){this.game.combat.notifications.add({type:'Player',args:[this,templateLangString('TOASTS','SEED_PLANT_FAILURE',{itemName:recipe.seedCost.item.name}),'danger',],});}
else{this.game.combat.notifications.add({type:'Player',args:[this,getLangString('TOASTS','NOT_ENOUGH_SEEDS'),'danger'],});}
return-1;}
const interval=this.modifyInterval(recipe.baseInterval,recipe);plot.state=2;plot.plantedRecipe=recipe;plot.growthTime=interval/1000;this.renderQueue.growthState.add(plot);costs.consumeCosts();this.game.stats.Farming.add(FarmingStats.SeedsPlanted,seedQuantity);if(recipe.category.giveXPOnPlant)
this.addXP(recipe.baseExperience,recipe);const event=new FarmingPlantActionEvent(this,recipe);this.game.processEvent(event);return interval;}
plantAllPlots(category,forceRecipe){if(forceRecipe!==undefined&&forceRecipe.category!==category)
throw new Error('Tried to plant all plots with recipe that does not match plot category.');const isSelected=forceRecipe===undefined;const cost=this.getPlantAllCost(category);if(!this.game.gp.canAfford(cost)){this.game.combat.notifications.add({type:'Player',args:[this,getLangString('TOASTS','PLANT_ALL_GP'),'danger'],});return;}
let anyPlanted=false;const plotIntervalMap=new Map();const plots=this.getPlotsForCategory(category);plots.forEach((plot)=>{const recipe=forceRecipe!==null&&forceRecipe!==void 0?forceRecipe:plot.selectedRecipe;if(recipe===undefined)
return;const plantInterval=this.plantPlot(plot,recipe,isSelected);if(plantInterval<=0)
return;const sameIntervalPlots=plotIntervalMap.get(plantInterval);if(sameIntervalPlots!==undefined){sameIntervalPlots.push(plot);}
else{plotIntervalMap.set(plantInterval,[plot]);}
anyPlanted=true;});plotIntervalMap.forEach((plots,interval)=>this.createGrowthTimer(plots,interval));if(anyPlanted)
this.game.gp.remove(cost);}
onMasteryLevelUp(action,oldLevel,newLevel){super.onMasteryLevelUp(action,oldLevel,newLevel);if(newLevel>=50&&oldLevel<50){this.plots.forEach((plot)=>{if(plot.plantedRecipe===action)
this.renderQueue.compost.add(plot);});}}
onMasteryPoolBonusChange(oldBonusLevel,newBonusLevel){super.onMasteryPoolBonusChange(oldBonusLevel,newBonusLevel);if(this.wasPoolBonusChanged(oldBonusLevel,newBonusLevel,1)){this.plots.forEach((plot)=>{if(plot.plantedRecipe!==undefined)
this.renderQueue.compost.add(plot);});}}
passiveTick(){if(this.growthTimers.size>0){this.growthTimers.forEach((timer)=>{timer.tick();if(timer.ticksLeft%TICKS_PER_MINUTE===0&&timer.ticksLeft>0)
this.renderQueue.growthTime.add(timer);});}}
render(){super.render();this.renderGrowthStatus();this.renderGrowthState();this.renderCompost();this.renderSelectedSeed();this.renderGrowthIndicators();this.renderCompostQuantity();}
renderGrowthStatus(){if(this.renderQueue.growthTime.size===0)
return;this.renderQueue.growthTime.forEach((timer)=>{timer.plots.forEach((plot)=>{var _a;(_a=farmingMenus.plotMap.get(plot))===null||_a===void 0?void 0:_a.updateGrowthTime(plot,this);});});this.renderQueue.growthTime.clear();}
renderGrowthState(){if(this.renderQueue.growthState.size===0)
return;this.renderQueue.growthState.forEach((plot)=>{var _a;(_a=farmingMenus.plotMap.get(plot))===null||_a===void 0?void 0:_a.updatePlotState(plot);});this.renderQueue.growthState.clear();}
renderCompost(){if(this.renderQueue.compost.size===0)
return;this.renderQueue.compost.forEach((plot)=>{var _a;(_a=farmingMenus.plotMap.get(plot))===null||_a===void 0?void 0:_a.updateCompost(plot,this);});this.renderQueue.compost.clear();}
renderSelectedSeed(){if(this.renderQueue.selectedSeed.size===0)
return;this.renderQueue.selectedSeed.forEach((plot)=>{var _a;(_a=farmingMenus.plotMap.get(plot))===null||_a===void 0?void 0:_a.updateSelectedSeed(plot);});this.renderQueue.selectedSeed.clear();}
renderGrowthIndicators(){if(!this.renderQueue.growthIndicators)
return;let anyGrown=false;this.categories.forEach((category)=>{var _a;const plots=this.getPlotsForCategory(category);const hasGrown=plots.some((plot)=>plot.state===3||plot.state===4);(_a=farmingMenus.categoryButtons.get(category))===null||_a===void 0?void 0:_a.updateNotice(hasGrown);anyGrown||(anyGrown=hasGrown);});skillNav.setGlowing(this,anyGrown);this.renderQueue.growthIndicators=false;}
renderCompostQuantity(){if(!this.renderQueue.compostQuantity)
return;farmingMenus.compostIcons.forEach((icon)=>icon.updateQuantity());this.renderQueue.compostQuantity=false;}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(0))
modifier+=5;return modifier;}
getUncappedDoublingChance(action){let chance=super.getUncappedDoublingChance(action);chance+=this.game.modifiers.increasedChanceDoubleHarvest-this.game.modifiers.decreasedChanceDoubleHarvest;return chance;}
showPlotsInCategory(category){const plots=this.getPlotsForCategory(category);let unlockedPlots=0;let lockedPlots=0;plots.forEach((plot)=>{if(plot.state!==0){unlockedPlots++;if(farmingMenus.plots.length<unlockedPlots){const newPlot=createElement('farming-plot',{className:'col-6 col-xl-3'});if(farmingMenus.plots.length===0){farmingMenus.categoryOptions.after(newPlot);}
else{farmingMenus.plots[farmingMenus.plots.length-1].after(newPlot);}
farmingMenus.plots.push(newPlot);}}
else{if(farmingMenus.lockedPlots.length===0){const lockedPlot=createElement('locked-farming-plot',{className:'col-6 col-xl-3'});farmingMenus.plotContainer.append(lockedPlot);farmingMenus.lockedPlots.push(lockedPlot);}
lockedPlots++;}});farmingMenus.plotMap.clear();plots.every((plot,i)=>{if(plot.state!==0){farmingMenus.plots[i].setPlot(plot,this.game);farmingMenus.plotMap.set(plot,farmingMenus.plots[i]);}
else{farmingMenus.lockedPlots[0].setPlot(plot,this);}
return plot.state!==0;});farmingMenus.plots.forEach((plot,i)=>{if(unlockedPlots>i)
showElement(plot);else
hideElement(plot);});if(lockedPlots>0)
showElement(farmingMenus.lockedPlots[0]);else if(farmingMenus.lockedPlots.length>0)
hideElement(farmingMenus.lockedPlots[0]);farmingMenus.categoryOptions.setCategory(category,this.game);}
harvestAllOnClick(category){const cost=this.getHarvestAllCost(category);if(!this.game.gp.canAfford(cost)){notifyPlayer(this,getLangString('TOASTS','HARVEST_ALL_GP'),'danger');return;}
const plots=this.getPlotsForCategory(category);let harvestCount=0;plots.forEach((plot)=>{switch(plot.state){case 3:if(this.harvestPlot(plot))
harvestCount++;break;case 4:this.clearDeadPlot(plot);harvestCount++;break;}});if(harvestCount>0)
this.game.gp.remove(cost);}
compostPlot(plot,compost,amount){if(plot.state!==1)
return false;const freeCompost=compost.id==="melvorD:Compost"&&this.game.modifiers.freeCompost>0;const owned=freeCompost?Infinity:this.game.bank.getQty(compost);if(plot.compostItem!==undefined&&plot.compostItem.harvestBonus>=compost.harvestBonus){if(plot.compostItem.harvestBonus>compost.harvestBonus||plot.compostLevel===100)
return false;const amountNeeded=Math.ceil((100-plot.compostLevel)/compost.compostValue);amount=Math.min(amount,amountNeeded,owned);if(amount>0){plot.compostLevel+=amount*compost.compostValue;plot.compostLevel=Math.min(plot.compostLevel,100);if(!freeCompost)
this.game.bank.removeItemQuantity(compost,amount,true);this.recordCompostStat(compost,amount);this.renderQueue.compost.add(plot);return true;}
else{this.notifyNoCompost(compost);return false;}}
else{const amountNeeded=Math.ceil(100/compost.compostValue);amount=Math.min(amount,amountNeeded,owned);if(amount>0){plot.compostLevel=amount*compost.compostValue;plot.compostLevel=Math.min(plot.compostLevel,100);plot.compostItem=compost;if(!freeCompost)
this.game.bank.removeItemQuantity(compost,amount,true);this.recordCompostStat(compost,amount);this.renderQueue.compost.add(plot);return true;}
else{this.notifyNoCompost(compost);return false;}}}
notifyNoCompost(compost){let message;switch(compost.id){case "melvorD:Compost":message=getLangString('TOASTS','NEED_COMPOST');break;case "melvorD:Weird_Gloop":message=getLangString('TOASTS','NEED_GLOOP');break;default:message=templateLangString('FARMING_MISC','NEED_ITEM_TO_APPLY',{itemName:compost.name});}
this.game.combat.notifications.add({type:'Player',args:[this,message,'danger'],});}
notifyCantAffordCompostAll(compost){let message;switch(compost.id){case "melvorD:Compost":message=getLangString('TOASTS','COMPOST_ALL_GP');break;case "melvorD:Weird_Gloop":message=getLangString('TOASTS','GLOOP_ALL_GP');break;default:message=templateLangString('FARMING_MISC','NO_GP_APPLY_ITEM',{itemName:compost.name});}
this.game.combat.notifications.add({type:'Player',args:[this,message,'danger'],});}
recordCompostStat(compost,amount){switch(compost.id){case "melvorD:Compost":this.game.stats.Farming.add(FarmingStats.CompostUsed,amount);break;case "melvorD:Weird_Gloop":this.game.stats.Farming.add(FarmingStats.GloopUsed,amount);break;}}
compostAllOnClick(category,compost){const cost=this.getCompostAllCost(category);if(!this.game.gp.canAfford(cost)){this.notifyCantAffordCompostAll(compost);return;}
let appliedAny=false;const plots=this.getPlotsForCategory(category);plots.forEach((plot)=>{if(!this.game.bank.hasItem(compost))
return;if(this.compostPlot(plot,compost,Infinity))
appliedAny=true;});if(appliedAny)
this.game.gp.remove(cost);}
plantAllOnClick(category){const plots=this.getPlotsForCategory(category);if(!plots.some((plot)=>plot.state===1)){notifyPlayer(this,getLangString('TOASTS','NO_EMPTY_PATCHES'),'danger');return;}
farmingMenus.seedSelect.setSeedSelection(category,this.game);farmingMenus.seedSelect.setUnselectedRecipe();$('#modal-farming-seed').modal('show');}
plantAllSelectedOnClick(category){this.plantAllPlots(category);}
setPlantAllSelected(plot,recipe){if(this.level>=recipe.level){plot.selectedRecipe=recipe;this.renderQueue.selectedSeed.add(plot);}
else{this.game.combat.notifications.add({type:'Player',args:[this,templateLangString('TOASTS','SKILL_LEVEL_REQUIRED',{level:`${recipe.level}`,skillName:this.name}),'danger',],});}}
destroyPlotOnClick(plot){if(plot.state!==2)
return;if(this.game.settings.showCropDestructionConfirmations){SwalLocale.fire({title:getLangString('MENU_TEXT','DESTROY_CROP'),html:`<h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','DESTROY'),}).then((result)=>{if(result.value){this.destroyPlot(plot);}});}
else{this.destroyPlot(plot);}}
destroyPlot(plot){if(plot.state!==2)
return;this.resetPlot(plot);const timer=this.growthTimerMap.get(plot);if(timer===undefined)
throw new Error('Tried destroying plot, but no timer is set for it.');const plotIndex=timer.plots.findIndex((timerPlot)=>timerPlot===plot);if(plotIndex===-1)
throw new Error('Tried destroying plot, but plot is not a member of timer.');this.growthTimerMap.delete(plot);timer.plots.splice(plotIndex,1);if(timer.plots.length===0){this.removeGrowthTimer(timer);}}
plantPlotOnClick(plot){if(plot.state!==1)
return;farmingMenus.seedSelect.setSeedSelection(plot.category,this.game,plot);farmingMenus.seedSelect.setUnselectedRecipe();$('#modal-farming-seed').modal('show');}
harvestPlotOnClick(plot){switch(plot.state){case 3:this.harvestPlot(plot);break;case 4:this.clearDeadPlot(plot);break;}}
unlockPlotOnClick(plot){if(!this.game.gp.canAfford(plot.gpCost)||this.level<plot.level)
return;this.game.gp.remove(plot.gpCost);plot.state=1;this.showPlotsInCategory(plot.category);}
plantRecipe(recipe,plot){const plantInterval=this.plantPlot(plot,recipe);if(plantInterval<=0)
return;this.createGrowthTimer([plot],plantInterval);}
plantAllRecipe(recipe){this.plantAllPlots(recipe.category,recipe);}
createGrowthTimer(plots,interval){const timer=new FarmingGrowthTimer(plots,this);this.growthTimers.add(timer);plots.forEach((plot)=>{this.growthTimerMap.set(plot,timer);});this.renderQueue.growthTime.add(timer);timer.start(interval);}
getActionIDFromOldID(oldActionID,idMap){return idMap.farmingRecipes[oldActionID];}
encode(writer){super.encode(writer);writer.writeUint32(this.plots.size);this.plots.forEach((plot)=>{writer.writeNamespacedObject(plot);plot.encode(writer);});writer.writeUint32(this.plots.dummySize);this.plots.forEachDummy((plot)=>{writer.writeNamespacedObject(plot);plot.encode(writer);});writer.writeSet(this.growthTimers,(timer,writer)=>timer.encode(writer));return writer;}
decodePlot(reader,version){let plot=reader.getNamespacedObject(this.plots);if(typeof plot==='string'){if(plot.startsWith('melvor'))
plot=this.plots.getDummyObject(plot,DummyFarmingPlot,this.game);else
plot=this.game.constructDummyObject(plot,DummyFarmingPlot);}
plot.decode(reader,version);}
decode(reader,version){super.decode(reader,version);const numPlots=reader.getUint32();for(let i=0;i<numPlots;i++){this.decodePlot(reader,version);}
const numDummyPlots=reader.getUint32();for(let i=0;i<numDummyPlots;i++){this.decodePlot(reader,version);}
this.growthTimers=reader.getSet((reader)=>{const timer=new FarmingGrowthTimer([],this);timer.decode(reader,version);if(timer.plots.length===0)
return undefined;return timer;});this.growthTimers.forEach((timer)=>{timer.plots.forEach((plot)=>{this.growthTimerMap.set(plot,timer);});});}
convertFromOldFormat(save,idMap){const compost=this.game.items.composts.getObjectByID("melvorD:Compost");const gloop=this.game.items.composts.getObjectByID("melvorD:Weird_Gloop");if(compost===undefined||gloop===undefined)
throw new Error(`Error converting farming data. Compost not registered.`);const currentTime=new Date().getTime();if(save.newFarmingAreas!==undefined){save.newFarmingAreas.forEach((area,catID)=>{area.patches.forEach((patch,i)=>{var _a;const plot=this.plots.getObjectByID(idMap.farmingPlots[`${catID}:${i}`]);if(plot===undefined)
return;plot.compostLevel=patch.compost;if(patch.compost>0)
plot.compostItem=patch.gloop?gloop:compost;if(patch.unlocked){if(patch.seedID>0){const recipe=this.actions.getObjectByID(idMap.farmingSeedToRecipe[patch.seedID]);if(recipe===undefined){plot.state=1;return;}
plot.plantedRecipe=recipe;if(patch.hasGrown){plot.state=3;}
else{plot.state=2;const growthTime=(_a=patch.setInterval)!==null&&_a!==void 0?_a:recipe.baseInterval/1000;plot.growthTime=growthTime;let timeLeft=patch.timePlanted+growthTime*1000-currentTime;timeLeft=Math.max(TICK_INTERVAL,timeLeft);this.createGrowthTimer([plot],timeLeft);}}
else{plot.state=1;}}});});}
if(save.plantAllSelected!==undefined){Object.entries(save.plantAllSelected).forEach(([catID,seeds])=>{seeds.forEach((seedID,i)=>{const plot=this.plots.getObjectByID(idMap.farmingPlots[`${catID}:${i}`]);if(plot===undefined)
return;const recipe=this.actions.getObjectByID(idMap.farmingSeedToRecipe[seedID]);if(recipe!==undefined)
plot.selectedRecipe=recipe;});});}}
testTranslations(){super.testTranslations();this.actions.forEach((action)=>{action.name;});this.categories.forEach((category)=>{category.name;category.singularName;category.description;category.seedNotice;});}}