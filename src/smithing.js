"use strict";class Smithing extends ArtisanSkill{constructor(namespace,game){super(namespace,'Smithing',game);this._media='assets/media/skills/smithing/smithing.svg';this.baseInterval=2000;this.selectionTabs=smithingSelectionTabs;this.renderQueue=new ArtisanSkillRenderQueue();this.oreToBarMap=new Map();this.categories=new NamespaceRegistry(game.registeredNamespaces);}
getTotalUnlockedMasteryActions(){return this.actions.reduce(levelUnlockSum(this),0);}
get menu(){return smithingArtisanMenu;}
get noCostsMessage(){return getLangString('TOASTS','MATERIALS_REQUIRED_TO_SMITH');}
get actionItem(){return this.activeRecipe.product;}
get actionItemQuantity(){return this.activeRecipe.baseQuantity;}
get activeRecipe(){if(this.selectedRecipe===undefined)
throw new Error('Tried to access active recipe, but none is selected.');return this.selectedRecipe;}
get isMakingBar(){return this.activeRecipe.category.id==="melvorD:Bars";}
get recipeHasCoal(){return this.activeRecipe.itemCosts.some((itemCost)=>itemCost.item.id==="melvorD:Coal_Ore");}
get masteryModifiedInterval(){return 1700;}
registerData(namespace,data){var _a,_b;super.registerData(namespace,data);(_a=data.categories)===null||_a===void 0?void 0:_a.forEach((categoryData)=>{this.categories.registerObject(new SkillCategory(namespace,categoryData,this));});(_b=data.recipes)===null||_b===void 0?void 0:_b.forEach((recipeData)=>{this.actions.registerObject(new SingleProductArtisanSkillRecipe(namespace,recipeData,this.game,this));});}
postDataRegistration(){super.postDataRegistration();this.actions.forEach((recipe)=>{if(recipe.category.id==="melvorD:Bars"){recipe.itemCosts.forEach(({item})=>{if(item.id!=="melvorD:Coal_Ore"&&!this.oreToBarMap.has(item)){this.oreToBarMap.set(item,recipe.product);}});}});this.sortedMasteryActions=sortRecipesByCategoryAndLevel(this.actions.allObjects,this.categories.allObjects);this.milestones.push(...this.actions.allObjects);this.sortMilestones();}
getSmithedVersionOfOre(ore){return this.oreToBarMap.get(ore);}
getUncappedDoublingChance(action){let chance=super.getUncappedDoublingChance(action);const masteryLevel=this.getMasteryLevel(action);chance+=Math.floor((masteryLevel+10)/20)*5;if(masteryLevel>=99)
chance+=10;if(this.isPoolTierActive(3))
chance+=10;return chance;}
getPreservationChance(action,chance){const masteryLevel=this.getMasteryLevel(action);chance+=Math.floor(masteryLevel/20)*5;if(masteryLevel>=99)
chance+=10;if(this.isPoolTierActive(1))
chance+=5;if(this.isPoolTierActive(2))
chance+=5;if(action.category.id==="melvorD:DragonGear")
chance+=this.game.modifiers.increasedSmithingDragonGearPreservation;return super.getPreservationChance(action,chance);}
getMasteryXPModifier(action){let modifier=super.getMasteryXPModifier(action);if(this.isPoolTierActive(0))
modifier+=5;return modifier;}
onMasteryLevelUp(action,oldLevel,newLevel){super.onMasteryLevelUp(action,oldLevel,newLevel);if(this.selectedRecipe===action)
this.renderQueue.selectedRecipe=true;}
modifyItemCost(item,quantity,recipe){if(item.id==="melvorD:Coal_Ore"){quantity=applyModifier(quantity,this.game.modifiers.decreasedSmithingCoalCost,2);quantity-=this.game.modifiers.decreasedFlatSmithingCoalCost;return quantity;}
else{return quantity;}}
recordCostPreservationStats(costs){const statToTrack=this.isMakingBar?SmithingStats.OresPreserved:SmithingStats.BarsPreserved;costs.recordBulkItemStat(this.game.stats.Smithing,statToTrack);}
recordCostConsumptionStats(costs){const statToTrack=this.isMakingBar?SmithingStats.OresUsed:SmithingStats.BarsUsed;costs.recordBulkItemStat(this.game.stats.Smithing,statToTrack);}
preAction(){}
get actionRewards(){const rewards=new Rewards(this.game);const actionEvent=new SmithingActionEvent(this,this.activeRecipe);let qtyToAdd=this.actionItemQuantity;if(rollPercentage(this.game.modifiers.summoningSynergy_3_17))
qtyToAdd++;if(rollPercentage(this.actionDoublingChance))
qtyToAdd*=2;qtyToAdd*=Math.pow(2,this.game.modifiers.getSkillModifierValue('doubleItemsSkill',this));const item=this.actionItem;if(item.id==="melvorD:Silver_Bar"){let goldBarQty=1;const activePotion=this.activePotion;if(this.game.modifiers.doubleSilverGoldSmithingWithSeeingGold>0&&activePotion!==undefined&&["melvorF:Seeing_Gold_Potion_I","melvorF:Seeing_Gold_Potion_II","melvorF:Seeing_Gold_Potion_III","melvorF:Seeing_Gold_Potion_IV",].includes(activePotion.id)){goldBarQty*=2;qtyToAdd*=2;}
if(rollPercentage(this.game.modifiers.increasedSeeingGoldChance-this.game.modifiers.decreasedSeeingGoldChance)){rewards.addItemByID("melvorD:Gold_Bar",goldBarQty);this.game.stats.Smithing.add(SmithingStats.TotalBarsSmelted,goldBarQty);}}
let extraItemChance=this.game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource',this)-
this.game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource',this);if(this.activeRecipe.category.id==="melvorD:Bars")
extraItemChance+=this.game.modifiers.increasedChanceAdditionalBarSmithing;if(rollPercentage(extraItemChance))
qtyToAdd++;rewards.addItem(item,qtyToAdd);actionEvent.productQuantity=qtyToAdd;this.game.stats.Smithing.add(this.isMakingBar?SmithingStats.TotalBarsSmelted:SmithingStats.TotalItemsSmithed,qtyToAdd);rewards.addXP(this,this.actionXP);this.addCommonRewards(rewards);this.game.processEvent(actionEvent,this.currentActionInterval);return rewards;}
postAction(){this.game.stats.Smithing.inc(this.isMakingBar?SmithingStats.SmeltingActions:SmithingStats.SmithingActions);this.game.stats.Smithing.add(SmithingStats.TimeSpent,this.currentActionInterval);this.renderQueue.recipeInfo=true;this.renderQueue.quantities=true;}
getActionIDFromOldID(oldActionID,idMap){return idMap.smithingRecipes[oldActionID];}
setFromOldOffline(offline,idMap){const recipe=this.actions.getObjectByID(idMap.smithingOldOffline[offline.action]);if(recipe!==undefined){this.selectRecipeOnClick(recipe);this.createButtonOnClick();}}
testTranslations(){super.testTranslations();this.categories.forEach((category)=>{category.name;});}}