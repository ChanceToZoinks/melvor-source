"use strict";class Runecrafting extends ArtisanSkill{constructor(namespace,game){super(namespace,'Runecrafting',game);this._media='assets/media/skills/runecrafting/runecrafting.svg';this.baseInterval=2000;this.selectionTabs=runecraftingSelectionTabs;this.renderQueue=new ArtisanSkillRenderQueue();this.elementalRunes=[];this.comboRunes=[];this.categories=new NamespaceRegistry(game.registeredNamespaces);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
get menu(){return runecraftingArtisanMenu;}
get noCostsMessage(){return getLangString('TOASTS','MATERIALS_REQUIRED_TO_CREATE');}
get actionXP(){let xp=super.actionXP;if(this.isMakingRunes&&this.isPoolTierActive(1)){xp*=2.5;}
return xp;}
get actionItem(){return this.activeRecipe.product;}
get actionItemQuantity(){let quantity=this.activeRecipe.baseQuantity;if(this.isMakingRunes){if(this.isPoolTierActive(3))
quantity+=5;const masteryLevel=this.masteryLevel;quantity+=Math.floor(masteryLevel/15);if(masteryLevel>=99)
quantity+=4;}
return quantity;}
get activeRecipe(){if(this.selectedRecipe===undefined)
throw new Error('Tried to get active recipe, but none is selected.');return this.selectedRecipe;}
get masteryModifiedInterval(){return 1700;}
get isMakingRunes(){return(this.activeRecipe.category.id==="melvorF:StandardRunes"||this.activeRecipe.category.id==="melvorF:CombinationRunes");}
get isOctoActive(){return(this.activeRecipe.category.id==="melvorF:CombinationRunes"&&this.activeRecipe.itemCosts.some((cost)=>cost.item.id==="melvorD:Water_Rune"));}
registerData(namespace,data){var _a,_b,_c,_d;super.registerData(namespace,data);(_a=data.categories)===null||_a===void 0?void 0:_a.forEach((categoryData)=>{this.categories.registerObject(new SkillCategory(namespace,categoryData,this));});(_b=data.recipes)===null||_b===void 0?void 0:_b.forEach((recipeData)=>{this.actions.registerObject(new SingleProductArtisanSkillRecipe(namespace,recipeData,this.game,this));});(_c=data.elementalRuneIDs)===null||_c===void 0?void 0:_c.forEach((runeID)=>{this.elementalRunes.push(this.getItemForRegistration(runeID));});(_d=data.comboRuneIDs)===null||_d===void 0?void 0:_d.forEach((runeID)=>{this.comboRunes.push(this.getItemForRegistration(runeID));});if(data.crowDevilItem!==undefined)
this.crowDevilItem=this.getItemForRegistration(data.crowDevilItem);}
postDataRegistration(){super.postDataRegistration();this.sortedMasteryActions=sortRecipesByCategoryAndLevel(this.actions.allObjects,this.categories.allObjects);this.milestones.push(...this.actions.allObjects);this.sortMilestones();}
getRecipeSubCategory(recipe){if(this.elementalRunes.includes(recipe.product))
return 'ElementalRunes';if(recipe.product.type==='Magic Staff')
return 'Staff';return 'None';}
modifyItemCost(item,quantity,recipe){if(recipe.product instanceof EquipmentItem&&item.type==='Rune'){const masteryLevel=this.getMasteryLevel(recipe);let runeCostReduction=Math.floor(masteryLevel/10)*0.05;if(masteryLevel>=99)
runeCostReduction+=0.15;quantity=Math.floor(quantity*(1-runeCostReduction));}
return Math.max(1,quantity);}
getPreservationChance(action,chance){if(this.isPoolTierActive(2))
chance+=10;if(action.product.type==='Magic Staff')
chance+=this.game.modifiers.increasedRunecraftingStavePreservation;else if(action.category.id==="melvorF:StandardRunes"||action.category.id==="melvorF:CombinationRunes"){chance+=this.game.modifiers.increasedRunecraftingEssencePreservation;}
return super.getPreservationChance(action,chance);}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(0))
modifier+=5;return modifier;}
onMasteryLevelUp(action,oldLevel,newLevel){super.onMasteryLevelUp(action,oldLevel,newLevel);if(this.selectedRecipe===action)
this.renderQueue.selectedRecipe=true;}
recordCostPreservationStats(costs){costs.recordBulkItemStat(this.game.stats.Runecrafting,RunecraftingStats.ItemsPreserved);}
recordCostConsumptionStats(costs){costs.recordBulkItemStat(this.game.stats.Runecrafting,RunecraftingStats.ItemsUsed);}
preAction(){}
get actionRewards(){const rewards=new Rewards(this.game);const actionEvent=new RunecraftingActionEvent(this,this.activeRecipe);let qtyToAdd=this.actionItemQuantity;if(rollPercentage(this.actionDoublingChance))
qtyToAdd*=2;qtyToAdd*=Math.pow(2,this.game.modifiers.getSkillModifierValue('doubleItemsSkill',this));if(this.isMakingRunes)
qtyToAdd+=this.game.modifiers.increasedAdditionalRunecraftCountRunes-
this.game.modifiers.decreasedAdditionalRunecraftCountRunes;if(this.isOctoActive){qtyToAdd+=this.game.modifiers.increasedRunecraftingWaterComboRunes;}
const extraItemChance=this.game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource',this)-
this.game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource',this);if(rollPercentage(extraItemChance))
qtyToAdd++;const itemID=this.actionItem;rewards.addItem(itemID,qtyToAdd);actionEvent.productQuantity=qtyToAdd;this.game.stats.Runecrafting.add(RunecraftingStats.ItemsCrafted,qtyToAdd);const bonusRuneChance=this.game.modifiers.increasedChanceForElementalRune-this.game.modifiers.decreasedChanceForElementalRune;if(bonusRuneChance>0){let bonusRuneQuantity=this.game.modifiers.increasedElementalRuneGain-this.game.modifiers.decreasedElementalRuneGain;bonusRuneQuantity=Math.max(1,bonusRuneQuantity);if(rollPercentage(bonusRuneChance)){rewards.addItem(getRandomArrayElement(this.elementalRunes),bonusRuneQuantity);this.game.stats.Runecrafting.add(RunecraftingStats.ItemsCrafted,bonusRuneQuantity);}
const activePotion=this.activePotion;if(this.game.modifiers.giveRandomComboRunesRunecrafting>0&&activePotion!==undefined&&["melvorF:Elemental_Potion_I","melvorF:Elemental_Potion_II","melvorF:Elemental_Potion_III","melvorF:Elemental_Potion_IV",].includes(activePotion.id)&&rollPercentage(bonusRuneChance)){rewards.addItem(getRandomArrayElement(this.comboRunes),bonusRuneQuantity);this.game.stats.Runecrafting.add(RunecraftingStats.ItemsCrafted,bonusRuneQuantity);}}
if(this.game.modifiers.increasedFireRunesWhenMakingElementalRunes>0&&this.crowDevilItem!==undefined&&this.elementalRunes.includes(this.actionItem)){rewards.addItem(this.crowDevilItem,this.game.modifiers.increasedFireRunesWhenMakingElementalRunes);}
rewards.addXP(this,this.actionXP);this.addCommonRewards(rewards);this.game.processEvent(actionEvent,this.currentActionInterval);return rewards;}
postAction(){this.game.stats.Runecrafting.inc(RunecraftingStats.Actions);this.game.stats.Runecrafting.add(RunecraftingStats.TimeSpent,this.currentActionInterval);this.renderQueue.recipeInfo=true;this.renderQueue.quantities=true;}
getActionIDFromOldID(oldActionID,idMap){return idMap.runecraftingRecipes[oldActionID];}
setFromOldOffline(offline,idMap){const recipe=this.actions.getObjectByID(idMap.runecraftingOldOffline[offline.action]);if(recipe!==undefined){this.selectRecipeOnClick(recipe);this.createButtonOnClick();}}
testTranslations(){super.testTranslations();this.categories.forEach((category)=>{category.name;});}}