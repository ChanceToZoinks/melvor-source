"use strict";class HerbloreRecipe extends CategorizedArtisanRecipe{constructor(namespace,data,game,skill){super(namespace,data,game,skill);this.skill=skill;this._name=data.name;this.potions=data.potionIDs.map((potionID)=>{const potion=game.items.potions.getObjectByID(potionID);if(potion===undefined)
throw new Error(`Error constructing HerbloreRecipe. Item with id: ${potionID} is not registered.`);return potion;});}
get name(){if(this.isModded){return this._name;}
else{return getLangString('POTION_NAME',this.localID);}}
get media(){return this.potions[this.skill.getPotionTier(this)].media;}}
class Herblore extends ArtisanSkill{constructor(namespace,game){super(namespace,'Herblore',game);this._media='assets/media/skills/herblore/herblore.svg';this.baseInterval=2000;this.selectionTabs=herbloreSelectionTabs;this.renderQueue=new ArtisanSkillRenderQueue();this.potionToRecipeMap=new Map();this.categories=new NamespaceRegistry(game.registeredNamespaces);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
get menu(){return herbloreArtisanMenu;}
get noCostsMessage(){return getLangString('TOASTS','MATERIALS_REQUIRED_TO_BREW');}
get actionItem(){return this.activeRecipe.potions[this.getPotionTier(this.activeRecipe)];}
get actionItemQuantity(){return 1;}
get activeRecipe(){if(this.selectedRecipe===undefined)
throw new Error('Tried to get active recipe, but none is selected.');return this.selectedRecipe;}
get masteryModifiedInterval(){return 1700;}
registerData(namespace,data){var _a,_b;super.registerData(namespace,data);(_a=data.categories)===null||_a===void 0?void 0:_a.forEach((categoryData)=>{this.categories.registerObject(new SkillCategory(namespace,categoryData,this));});(_b=data.recipes)===null||_b===void 0?void 0:_b.forEach((recipeData)=>{this.actions.registerObject(new HerbloreRecipe(namespace,recipeData,this.game,this));});if(data.deadlyToxinsItem!==undefined)
this.deadlyToxinsItem=this.getItemForRegistration(data.deadlyToxinsItem);}
postDataRegistration(){super.postDataRegistration();this.actions.forEach((recipe)=>{recipe.potions.forEach((potion)=>this.potionToRecipeMap.set(potion,recipe));});this.sortedMasteryActions=sortRecipesByCategoryAndLevel(this.actions.allObjects,this.categories.allObjects);this.milestones.push(...this.actions.allObjects);this.sortMilestones();}
getRecipeForPotion(potion){return this.potionToRecipeMap.get(potion);}
getPotionTier(recipe){const masteryLevel=this.getMasteryLevel(recipe);for(let i=Herblore.tierMasteryLevels.length-1;i>=0;i--){if(masteryLevel>=Herblore.tierMasteryLevels[i])
return i;}
return 0;}
getUncappedDoublingChance(action){let chance=super.getUncappedDoublingChance(action);if(this.isPoolTierActive(3))
chance+=10;return chance;}
getPreservationChance(action,chance){const masteryLevel=this.getMasteryLevel(action);chance+=(masteryLevel-1)*0.2;if(masteryLevel>=99)
chance+=5;if(this.isPoolTierActive(2))
chance+=5;return super.getPreservationChance(action,chance);}
getXPModifier(masteryAction){let modifier=super.getXPModifier(masteryAction);if(this.isPoolTierActive(1))
modifier+=3;return modifier;}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(0))
modifier+=5;return modifier;}
onMasteryLevelUp(action,oldLevel,newLevel){super.onMasteryLevelUp(action,oldLevel,newLevel);if(this.selectedRecipe===action){this.renderQueue.selectedRecipe=true;this.renderQueue.selectionTabs=true;}}
recordCostPreservationStats(costs){costs.recordBulkItemStat(this.game.stats.Herblore,HerbloreStats.ItemsPreserved);}
recordCostConsumptionStats(costs){costs.recordBulkItemStat(this.game.stats.Herblore,HerbloreStats.ItemsUsed);}
preAction(){}
get actionRewards(){const rewards=new Rewards(this.game);const actionEvent=new HerbloreActionEvent(this,this.activeRecipe);let potionQuantity=this.actionItemQuantity;if(rollPercentage(this.actionDoublingChance))
potionQuantity*=2;potionQuantity*=Math.pow(2,this.game.modifiers.getSkillModifierValue('doubleItemsSkill',this));const extraItemChance=this.game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource',this)-
this.game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource',this);if(rollPercentage(extraItemChance))
potionQuantity++;rewards.addItem(this.actionItem,potionQuantity);actionEvent.productQuantity=potionQuantity;this.game.stats.Herblore.add(HerbloreStats.PotionsMade,potionQuantity);if(rollPercentage(this.game.modifiers.increasedChanceRandomPotionHerblore-
this.game.modifiers.decreasedChanceRandomPotionHerblore)){const randomPotion=getRandomArrayElement(this.activeRecipe.potions);rewards.addItem(randomPotion,potionQuantity);this.game.stats.Herblore.add(HerbloreStats.PotionsMade,potionQuantity);}
if(this.deadlyToxinsItem!==undefined&&this.activeRecipe.id==="melvorF:Lethal_Toxins_Potion"&&this.game.modifiers.increasedDeadlyToxinsFromHerblore>0)
rewards.addItem(this.deadlyToxinsItem,this.game.modifiers.increasedDeadlyToxinsFromHerblore);rewards.addXP(this,this.actionXP);this.addCommonRewards(rewards);this.game.processEvent(actionEvent,this.currentActionInterval);return rewards;}
postAction(){this.game.stats.Herblore.inc(HerbloreStats.Actions);this.game.stats.Herblore.add(HerbloreStats.TimeSpent,this.currentActionInterval);this.renderQueue.recipeInfo=true;this.renderQueue.quantities=true;}
getActionIDFromOldID(oldActionID,idMap){return idMap.herbloreRecipes[oldActionID];}
setFromOldOffline(offline,idMap){const recipe=this.actions.getObjectByID(idMap.herbloreRecipes[offline.action]);if(recipe!==undefined){this.selectRecipeOnClick(recipe);this.createButtonOnClick();}}
testTranslations(){super.testTranslations();this.actions.forEach((action)=>{action.name;});this.categories.forEach((category)=>{category.name;});}}
Herblore.tierMasteryLevels=[1,20,50,90];