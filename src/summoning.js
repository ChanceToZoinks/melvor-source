"use strict";class SummoningRecipe extends CategorizedArtisanRecipe{constructor(namespace,data,game,skill){super(namespace,data,game,skill);this._markMedia=data.markMedia;const product=game.items.equipment.getObjectByID(data.productID);if(product===undefined)
throw new Error(`Error constructing SummoningRecipe with id: ${this.id}. Product with id: ${data.productID} is not registered.`);this.product=product;this.baseQuantity=data.baseQuantity;this.nonShardItemCosts=data.nonShardItemCosts.map((itemID)=>{const item=game.items.getObjectByID(itemID);if(item===undefined)
throw new Error(`Error constructing SummoningRecipe with id: ${this.id}. Non shard item cost with id: ${itemID} is not registered.`);return item;});this.tier=data.tier;this.skills=data.skillIDs.map((skillID)=>{const skill=game.skills.getObjectByID(skillID);if(skill===undefined)
throw new Error(`Error constructing SummoningRecipe with id: ${this.id}. Skill with id: ${skillID} is not registered.`);return skill;});}
get name(){return this.product.name;}
get media(){return this.product.media;}
get markMedia(){return this.getMediaURL(this._markMedia);}}
class DummySummoningRecipe extends SummoningRecipe{constructor(namespace,id,game){super(namespace,{id,markMedia:"assets/media/main/question.svg",nonShardItemCosts:[],tier:1,skillIDs:[],productID:game.emptyEquipmentItem.id,baseQuantity:0,categoryID:"melvorD:Marks",itemCosts:[],gpCost:-1,scCost:-1,baseExperience:-1,level:-1,},game,game.summoning);}}
class SummoningSynergy{constructor(data,game,summoning){this.modifiers=game.getPlayerModifiersFromData(data.modifiers);if(data.enemyModifiers!==undefined)
this.enemyModifiers=data.enemyModifiers;if(data.conditionalModifiers!==undefined)
this.conditionalModifiers=data.conditionalModifiers.map((conditionalData)=>new ConditionalModifier(conditionalData,game));const summon0=summoning.actions.getObjectByID(data.summonIDs[0]);if(summon0===undefined)
throw new Error(`Error constructing SummoningSynergy. Summon with id ${data.summonIDs[0]} is not registered.`);const summon1=summoning.actions.getObjectByID(data.summonIDs[1]);if(summon1===undefined)
throw new Error(`Error constructing SummoningSynergy. Summon with id ${data.summonIDs[1]} is not registered.`);if(summon0===summon1)
throw new Error(`Error constructing SummoningSynergy. Cannot have synergy where both summons are identical.`);this.summons=[summon0,summon1];this.consumesOn=data.consumesOn.map((data)=>game.constructEventMatcher(data));if(data.customDescription!==undefined)
this._customDescription=data.customDescription;}
get description(){if(this._customDescription!==undefined){return getLangString('SUMMONING_SYNERGY',`DESC_${this.summons[0].localID}_${this.summons[1].localID}`);}
else{return describeModifierDataPlainLineBreak(this.modifiers);}}}
class Summoning extends ArtisanSkill{constructor(namespace,game){super(namespace,'Summoning',game);this._media='assets/media/skills/summoning/summoning.svg';this.baseInterval=5000;this.selectionTabs=summoningSelectionTabs;this.renderQueue=new SummoningRenderQueue();this.synergies=[];this.synergiesByItem=new Map();this.recipesByProduct=new Map();this.recipesBySkill=new Map();this.setAltRecipes=new Map();this.marksUnlocked=new Map();this.categories=new NamespaceRegistry(game.registeredNamespaces);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
get totalSynergiesUnlocked(){return this.synergies.reduce((prev,synergy)=>{if(this.isSynergyUnlocked(synergy))
prev++;return prev;},0);}
get menu(){return summoningArtisanMenu;}
get noCostsMessage(){return getLangString('TOASTS','MATERIALS_REQUIRED_TO_CRAFT');}
get actionItem(){return this.activeRecipe.product;}
get actionItemQuantity(){let quantity=this.activeRecipe.baseQuantity;const masteryLevel=this.masteryLevel;if(this.isPoolTierActive(3))
quantity+=10;if(masteryLevel>=99)
quantity+=10;quantity+=this.game.modifiers.increasedSummoningCreationCharges-this.game.modifiers.decreasedSummoningCreationCharges;let percentBonus=0;switch(this.activeRecipe.id){case "melvorF:Salamander":percentBonus+=this.game.modifiers.increasedSalamanderCreationCharges-
this.game.modifiers.decreasedSalamanderCreationCharges;break;case "melvorF:Leprechaun":quantity+=this.game.modifiers.increasedLeprechaunCreationCharges-
this.game.modifiers.decreasedLeprechaunCreationCharges;break;case "melvorF:Cyclops":quantity+=this.game.modifiers.increasedCyclopsCreationCharges-this.game.modifiers.decreasedCyclopsCreationCharges;break;}
if(this.game.combat.player.equipment.checkForItem(this.activeRecipe.product))
quantity+=this.game.modifiers.increasedSummoningCreationChargesForEquippedTablets;if(percentBonus!==0)
quantity=Math.floor(quantity*(1+percentBonus/100));return Math.max(quantity,0);}
get activeRecipe(){if(this.selectedRecipe===undefined)
throw new Error('Tried to access active recipe, but none is selected.');return this.selectedRecipe;}
get masteryModifiedInterval(){return 4850;}
get selectedAltRecipe(){var _a;return(_a=this.setAltRecipes.get(this.activeRecipe))!==null&&_a!==void 0?_a:0;}
get totalMarksDiscovered(){let total=0;this.marksUnlocked.forEach((count,mark)=>{total+=count;});return total;}
registerData(namespace,data){var _a,_b,_c;super.registerData(namespace,data);(_a=data.categories)===null||_a===void 0?void 0:_a.forEach((category)=>{this.categories.registerObject(new SkillCategory(namespace,category,this));});(_b=data.recipes)===null||_b===void 0?void 0:_b.forEach((recipe)=>{this.actions.registerObject(new SummoningRecipe(namespace,recipe,this.game,this));});(_c=data.synergies)===null||_c===void 0?void 0:_c.forEach((synergyData)=>{const synergy=new SummoningSynergy(synergyData,this.game,this);const summon0=synergy.summons[0];const summon1=synergy.summons[1];let summon0Map=this.synergiesByItem.get(summon0.product);let summon1Map=this.synergiesByItem.get(summon1.product);if((summon0Map===null||summon0Map===void 0?void 0:summon0Map.get(summon1.product))!==undefined)
throw new Error(`Error registering summon synergy between ${summon0.id} and ${summon1.id}. Synergy already exists.`);if(summon0Map===undefined){summon0Map=new Map();this.synergiesByItem.set(summon0.product,summon0Map);}
if(summon1Map===undefined){summon1Map=new Map();this.synergiesByItem.set(summon1.product,summon1Map);}
summon0Map.set(summon1.product,synergy);summon1Map.set(summon0.product,synergy);this.synergies.push(synergy);});}
postDataRegistration(){super.postDataRegistration();this.actions.forEach((recipe)=>{this.recipesByProduct.set(recipe.product,recipe);recipe.skills.forEach((skill)=>{let recipeArray=this.recipesBySkill.get(skill);if(recipeArray===undefined){recipeArray=[];this.recipesBySkill.set(skill,recipeArray);}
recipeArray.push(recipe);});});this.sortedMasteryActions=sortRecipesByCategoryAndLevel(this.actions.allObjects,this.categories.allObjects);this.milestones.push(...this.actions.allObjects);this.sortMilestones();}
addXPForTabletConsumption(tablet,interval){const recipe=this.recipesByProduct.get(tablet);if(recipe!==undefined){this.addXP(Summoning.getTabletConsumptionXP(recipe,interval));}}
getPercentageIntervalModifier(action){let modifier=super.getPercentageIntervalModifier(action);if(this.game.combat.player.equipment.checkForItem(action.product))
modifier-=this.game.modifiers.decreasedSummoningIntervalPercentForEquippedTablets;if(action.id==="melvorF:Octopus")
modifier-=this.game.modifiers.decreasedSummoningIntervalForOctopus;return modifier;}
getRecipeFromProduct(product){return this.recipesByProduct.get(product);}
onLevelUp(oldLevel,newLevel){super.onLevelUp(oldLevel,newLevel);this.actions.forEach((recipe)=>{if(this.level>=recipe.level)
this.renderQueue.markState.add(recipe);});}
getErrorLog(){const altRecipeLog=[];this.setAltRecipes.forEach((altID,recipe)=>{altRecipeLog.push(`${recipe.id}: ${altID}`);});return `${super.getErrorLog()}
Selected Alt Recipes (Mastery ID | altID):
${altRecipeLog.join('\n')}`;}
getMarkSnapshot(){return new Map(this.marksUnlocked);}
getNonShardCostReductionModifier(recipe){if(recipe.id==="melvorF:Salamander"&&this.game.modifiers.disableSalamanderItemReduction)
return 0;const masteryLevel=this.getMasteryLevel(recipe);let modifier=0;modifier+=Math.floor(masteryLevel/10)*5;if(masteryLevel>=99)
modifier+=5;const equippedModifier=this.game.modifiers.decreasedNonShardCostForEquippedTablets-
this.game.modifiers.increasedNonShardCostForEquippedTablets;const summon1=this.game.combat.player.equipment.slots.Summon1;const summon2=this.game.combat.player.equipment.slots.Summon2;if(recipe.product===summon1.item||recipe.product===summon2.item)
modifier+=equippedModifier;return modifier;}
modifyItemCost(item,quantity,recipe){const masteryLevel=this.getMasteryLevel(recipe);if(item.type==='Shard'){if(masteryLevel>=50)
quantity--;if(masteryLevel>=99)
quantity--;quantity+=this.game.modifiers.increasedSummoningShardCost-this.game.modifiers.decreasedSummoningShardCost;if((recipe.tier===1||recipe.tier===2)&&this.isPoolTierActive(1))
quantity--;if(recipe.tier===3&&this.isPoolTierActive(3))
quantity--;}
return Math.max(1,quantity);}
modifyGPCost(recipe){let gpCost=super.modifyGPCost(recipe);gpCost*=1-this.getNonShardCostReductionModifier(recipe)/100;return Math.max(1,Math.floor(gpCost));}
modifySCCost(recipe){let scCost=super.modifySCCost(recipe);scCost*=1-this.getNonShardCostReductionModifier(recipe)/100;return Math.max(1,Math.floor(scCost));}
addNonShardCosts(recipe,altID,costs){const item=recipe.nonShardItemCosts[altID];const salePrice=Math.max(20,item.sellsFor);const itemValueRequired=Summoning.recipeGPCost*(1-this.getNonShardCostReductionModifier(recipe)/100);const qtyToAdd=Math.max(1,Math.floor(itemValueRequired/salePrice));costs.addItem(item,qtyToAdd);}
onLoad(){super.onLoad();this.actions.forEach((recipe)=>this.renderQueue.markState.add(recipe));summoningSearchMenu.initialize();switchSummoningCategory(this.categories.firstObject);}
onEquipmentChange(){this.renderQueue.synergyQuantities=true;super.onEquipmentChange();}
render(){super.render();this.renderMarkState();this.renderMarkProgress();this.renderSynergyUnlock();this.renderSynergyQuantity();}
getAltRecipeCosts(recipe,altID){const costs=super.getRecipeCosts(recipe);if(recipe.nonShardItemCosts.length>0)
this.addNonShardCosts(recipe,altID,costs);return costs;}
getRecipeCosts(recipe){var _a;return this.getAltRecipeCosts(recipe,(_a=this.setAltRecipes.get(recipe))!==null&&_a!==void 0?_a:0);}
selectAltRecipeOnClick(altID){if(altID!==this.selectedAltRecipe&&this.isActive&&!this.stop())
return;this.setAltRecipes.set(this.activeRecipe,altID);this.renderQueue.selectedRecipe=true;this.render();}
renderSelectedRecipe(){if(!this.renderQueue.selectedRecipe)
return;if(this.selectedRecipe!==undefined){if(this.activeRecipe.nonShardItemCosts.length>1){this.menu.setRecipeDropdown(this.activeRecipe.nonShardItemCosts.map((cost,i)=>{const costs=this.getAltRecipeCosts(this.activeRecipe,i);return{items:costs.getItemQuantityArray(),gp:costs.gp,sc:costs.sc,};}),(recipeID)=>()=>this.selectAltRecipeOnClick(recipeID));this.menu.showRecipeDropdown();}
else{this.menu.hideRecipeDropdown();}}
else{this.menu.hideRecipeDropdown();}
super.renderSelectedRecipe();}
renderMarkState(){if(this.renderQueue.markState.size===0)
return;this.renderQueue.markState.forEach((mark)=>{const markDiscovery=markDiscoveryMenus.get(mark);if(markDiscovery===undefined)
return;if(mark.level>this.level){markDiscovery.setLocked(mark);}
else if(this.getMarkCount(mark)===0){markDiscovery.setUndiscovered(mark);}
else{markDiscovery.setDiscovered(mark);}});this.renderQueue.markState.clear();}
renderMarkProgress(){if(this.renderQueue.markCount.size===0)
return;this.renderQueue.markCount.forEach((mark)=>{var _a;(_a=markDiscoveryMenus.get(mark))===null||_a===void 0?void 0:_a.updateDiscoveryCount(mark);});this.renderQueue.markCount.clear();}
renderSynergyUnlock(){if(!this.renderQueue.synergyUnlock)
return;if(summoningSearchMenu.offsetParent!==null)
summoningSearchMenu.updateVisibleElementUnlocks();this.renderQueue.synergyUnlock=false;}
renderSynergyQuantity(){if(!this.renderQueue.synergyQuantities)
return;if(summoningSearchMenu.offsetParent!==null)
summoningSearchMenu.updateVisibleElementQuantities();this.renderQueue.synergyQuantities=false;}
queueMarkDiscoveryModal(mark){if(!this.game.settings.showSummoningMarkDiscoveryModals)
return;const discoveryCount=this.getMarkCount(mark);let html=`<small class="text-info">${getLangString('MENU_TEXT','MARK_DISCOVERED_TEXT0')}<br><br>${getLangString('MENU_TEXT','MARK_DISCOVERED_TEXT1')}</small>`;if(discoveryCount>1)
html=`<small class="text-info">${templateLangString('MENU_TEXT','MARK_DISCOVERED_TEXT2',{markName:`<span class="font-w700 text-success">${this.getMarkName(mark)}</span>`,})}<br><br>${getLangString('MENU_TEXT','MARK_DISCOVERED_TEXT3')}</small>`;const modal={title:getLangString('MENU_TEXT','MARK_DISCOVERED'),html:html,imageUrl:mark.markMedia,imageWidth:64,imageHeight:64,imageAlt:getLangString('MENU_TEXT','MARK_DISCOVERED'),};addModalToQueue(modal);}
queueMarkLevelUpModal(mark){const markLevel=this.getMarkLevel(mark);const title=templateLangString('MENU_TEXT','MARK_LEVEL',{level:`${markLevel}`});let html=`<small>${templateLangString('MENU_TEXT','MARK_LEVELUP_TEXT0',{markName:`<span class="font-w700 text-success">${this.getMarkName(mark)}</span>`,})}<br><br>${getLangString('MENU_TEXT','MARK_LEVELUP_TEXT1')}<br><br><span class="font-w700 text-warning">${getLangString('MENU_TEXT','MARK_LEVELUP_TEXT2')}</span></small>`;if(markLevel>=2){html=`<small>${templateLangString('MENU_TEXT','MARK_LEVELUP_TEXT3',{markName:`<span class="font-w700 text-success">${this.getMarkName(mark)}</span>`,})}<br><br>${templateLangString('MENU_TEXT','MARK_LEVELUP_TEXT4',{tierNum:`${markLevel-1}`,markLevel:`${markLevel}`,})}</small>`;}
const modal={title:title,html:html,imageUrl:mark.markMedia,imageWidth:64,imageHeight:64,imageAlt:title,};addModalToQueue(modal);}
getPreservationChance(action,chance){if(this.isPoolTierActive(2))
chance+=10;return super.getPreservationChance(action,chance);}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(0))
modifier+=5;return modifier;}
onMasteryLevelUp(action,oldLevel,newLevel){super.onMasteryLevelUp(action,oldLevel,newLevel);if(this.selectedRecipe===action)
this.renderQueue.selectedRecipe=true;}
recordCostPreservationStats(costs){costs.recordBulkItemStat(this.game.stats.Summoning,SummoningStats.ItemsPreserved);costs.recordGPStat(this.game.stats.Summoning,SummoningStats.GPPreserved);costs.recordSCStat(this.game.stats.Summoning,SummoningStats.SCPreserved);}
recordCostConsumptionStats(costs){costs.recordBulkItemStat(this.game.stats.Summoning,SummoningStats.ItemsUsed);costs.recordGPStat(this.game.stats.Summoning,SummoningStats.GPUsed);costs.recordSCStat(this.game.stats.Summoning,SummoningStats.SCUsed);}
preAction(){}
get actionRewards(){const rewards=new Rewards(this.game);const actionEvent=new SummoningActionEvent(this,this.activeRecipe);actionEvent.altRecipeID=this.selectedAltRecipe;let qtyToAdd=this.actionItemQuantity;if(rollPercentage(this.actionDoublingChance))
qtyToAdd*=2;qtyToAdd*=Math.pow(2,this.game.modifiers.getSkillModifierValue('doubleItemsSkill',this));const extraItemChance=this.game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource',this)-
this.game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource',this);if(rollPercentage(extraItemChance))
qtyToAdd++;const itemID=this.actionItem;if(qtyToAdd>0)
rewards.addItem(itemID,qtyToAdd);actionEvent.productQuantity=qtyToAdd;this.game.stats.Summoning.add(SummoningStats.ItemsMade,qtyToAdd);rewards.addXP(this,this.actionXP);this.addCommonRewards(rewards);this.game.processEvent(actionEvent,this.currentActionInterval);return rewards;}
postAction(){this.game.stats.Summoning.inc(SummoningStats.Actions);this.game.stats.Summoning.add(SummoningStats.TimeSpent,this.currentActionInterval);this.renderQueue.recipeInfo=true;this.renderQueue.quantities=true;}
encode(writer){super.encode(writer);writer.writeMap(this.setAltRecipes,writeNamespaced,(value,writer)=>writer.writeUint8(value));writer.writeMap(this.marksUnlocked,writeNamespaced,(value,writer)=>writer.writeUint8(value));return writer;}
decode(reader,version){super.decode(reader,version);this.setAltRecipes=reader.getMap(readNamespacedReject(this.actions),(reader)=>reader.getUint8());this.marksUnlocked=reader.getMap((reader)=>{const mark=reader.getNamespacedObject(this.actions);if(typeof mark==='string'){if(mark.startsWith('melvor'))
return this.actions.getDummyObject(mark,DummySummoningRecipe,this.game);else
return undefined;}
else
return mark;},(reader)=>reader.getUint8());}
deserialize(reader,version,idMap){super.deserialize(reader.getVariableLengthChunk(),version,idMap);const getRecipe=(id)=>{return this.actions.getObjectByID(idMap.summoningMarks[id]);};const numSetAlts=reader.getNumber();for(let i=0;i<numSetAlts;i++){const recipe=getRecipe(reader.getNumber());const altID=reader.getNumber();if(recipe!==undefined)
this.setAltRecipes.set(recipe,altID);}
const numMarksUnlocked=reader.getNumber();for(let i=0;i<numMarksUnlocked;i++){const recipeID=idMap.summoningMarks[reader.getNumber()];let recipe=this.actions.getObjectByID(recipeID);if(recipe===undefined)
recipe=this.actions.getDummyObject(recipeID,DummySummoningRecipe,this.game);this.marksUnlocked.set(recipe,reader.getNumber());}}
convertFromOldFormat(summoningData,idMap){Object.entries(summoningData.MarksDiscovered).forEach(([key,count])=>{const markID=parseInt(key);const newID=idMap.summoningMarks[markID];let mark=this.actions.getObjectByID(newID);if(mark===undefined)
mark=this.actions.getDummyObject(newID,DummySummoningRecipe,this.game);if(count<=0)
return;this.marksUnlocked.set(mark,count);});if(summoningData.defaultRecipe===undefined)
return;Object.entries(summoningData.defaultRecipe).forEach(([key,altID])=>{const markID=parseInt(key);const mark=this.actions.getObjectByID(idMap.summoningMarks[markID]);if(mark===undefined||altID<=0||altID>=mark.nonShardItemCosts.length)
return;this.setAltRecipes.set(mark,altID);});}
getActionIDFromOldID(oldActionID,idMap){return idMap.summoningMarks[oldActionID];}
setFromOldOffline(offline,idMap){const recipe=this.actions.getObjectByID(idMap.summoningMarks[offline.action]);if(recipe!==undefined){this.selectRecipeOnClick(recipe);this.createButtonOnClick();}}
getMarkCount(mark){var _a;return(_a=this.marksUnlocked.get(mark))!==null&&_a!==void 0?_a:0;}
getMarkImage(mark){let media;if(this.getMarkCount(mark)>0){media=cdnMedia("assets/media/main/question.svg");}
else{media=mark.markMedia;}
return media;}
getMarkName(mark){if(this.level<mark.level||this.getMarkCount(mark)===0){return getLangString('MENU_TEXT','QUESTION_MARKS');}
else{return templateString(getLangString('MENU_TEXT','MARK_OF_THE'),{familiarName:mark.product.name});}}
getMarkLevel(mark){const count=this.getMarkCount(mark);const index=Summoning.markLevels.findIndex((countRequired)=>count<countRequired);if(index===-1)
return Summoning.markLevels.length;else
return index;}
getSynergyData(summon1,summon2){var _a;return(_a=this.synergiesByItem.get(summon1))===null||_a===void 0?void 0:_a.get(summon2);}
getUnlockedSynergyData(summon1,summon2){const synergyData=this.getSynergyData(summon1,summon2);if(synergyData!==undefined&&this.isSynergyUnlocked(synergyData))
return synergyData;return undefined;}
isSynergyUnlocked(synergy){const mark1=synergy.summons[0];const mark2=synergy.summons[1];return mark1.tier<this.getMarkLevel(mark2)&&mark2.tier<this.getMarkLevel(mark1);}
getChanceForMark(mark,skill,modifiedInterval){let equippedModifier=1;if(this.game.combat.player.equipment.checkForItem(mark.product)){if(skill.hasMastery)
equippedModifier=2.5;else
equippedModifier=2;}
return(equippedModifier*modifiedInterval)/(2000*Math.pow(mark.tier+1,2));}
rollForMark(mark,skill,modifiedInterval){const markLevel=this.getMarkLevel(mark);const cantRoll=this.level<mark.level||!mark.skills.includes(skill)||(markLevel>0&&this.game.stats.itemFindCount(mark.product)<1)||markLevel>=Summoning.markLevels.length;if(!cantRoll&&rollPercentage(this.getChanceForMark(mark,skill,modifiedInterval))){this.discoverMark(mark);}}
discoverMark(mark){const prevLevel=this.getMarkLevel(mark);this.marksUnlocked.set(mark,this.getMarkCount(mark)+1);const curLevel=this.getMarkLevel(mark);this.queueMarkDiscoveryModal(mark);if(prevLevel!==curLevel){this.queueMarkLevelUpModal(mark);this.renderQueue.markState.add(mark);this.renderQueue.synergyUnlock=true;if(this.game.combat.player.equipment.checkForItem(mark.product))
this.game.combat.player.computeAllStats();if(curLevel===1)
this.renderQueue.selectionTabs=true;this.checkForPetMark();}
else{this.renderQueue.markCount.add(mark);}}
checkForPetMark(){const unlock=!this.actions.some((mark)=>{return mark.level<=99&&this.getMarkCount(mark)<Summoning.markLevels[3];});if(unlock)
this.game.petManager.unlockPetByID("melvorF:Mark");}
rollMarksForSkill(skill,modifiedInterval){if(!skill.isUnlocked)
return;const recipes=this.recipesBySkill.get(skill);if(recipes!==undefined)
recipes.forEach((mark)=>{this.rollForMark(mark,skill,modifiedInterval);});}
getMarkForSkill(skill){const skills=this.recipesBySkill.get(skill);if(skills===undefined)
return undefined;return skills[0];}
testTranslations(){super.testTranslations();this.synergies.forEach((synergy)=>{synergy.description;});this.categories.forEach((category)=>{category.name;});}
static getTabletConsumptionXP(summon,interval){return((interval/1000)*summon.level)/((summon.level+10)/10);}
static updateSearchArray(){Summoning.searchArray=game.summoning.synergies.map((synergy)=>{const name1=synergy.summons[0].product.name;const name2=synergy.summons[1].product.name;return{synergy,description:synergy.description,name1,name2,name1long:templateLangString('MENU_TEXT','THE_FAMILIAR',{name:name1}),name2long:templateLangString('MENU_TEXT','THE_FAMILIAR',{name:name2}),};});}}
Summoning.recipeGPCost=1000;Summoning.markLevels=[1,6,16,31,46,61];Summoning.searchArray=[];function localizeSummoning(){summoningCategoryMenu.localize();summoningArtisanMenu.localize();summoningSelectionTabs.forEach((tab)=>tab.localize());document.getElementById('mark-info-3-header').innerHTML=getLangString('MENU_TEXT','MARK_INFO_3');}
class SummoningRenderQueue extends ArtisanSkillRenderQueue{constructor(){super(...arguments);this.markState=new Set();this.markCount=new Set();this.synergyQuantities=false;this.synergyUnlock=false;}}