"use strict";function checkValueCondition(value,condition){switch(condition.operator){case '==':return value==condition.value;case '!=':return value!=condition.value;case '>':return value>condition.value;case '<':return value<condition.value;case '<=':return value<=condition.value;case '>=':return value>=condition.value;}}
function checkBooleanCondition(value,condition){if(condition.inverted)
return!value;return value;}
class ConditionalModifier{constructor(data,game,selfItem){this.isActive=false;this.hooks=new Set();this.condition=this.getConditionFromData(data.condition,game,selfItem);if(data.modifiers!==undefined)
this.modifiers=game.getPlayerModifiersFromData(data.modifiers);if(data.enemyModifiers!==undefined)
this.enemyModifiers=data.enemyModifiers;this.addConditionHooks(this.condition);}
getConditionFromData(conditionData,game,selfItem){switch(conditionData.type){case 'BankItem':{let item=game.items.getObjectByID(conditionData.itemID);if(item===undefined){if((selfItem===null||selfItem===void 0?void 0:selfItem.id)===conditionData.itemID)
item=selfItem;else
throw new Error(`Error constructing conditional modifier, item with id: ${conditionData.itemID} is not registered.`);}
return{type:conditionData.type,item,value:conditionData.value,operator:conditionData.operator,};}
case 'ItemCharge':{let item=game.items.equipment.getObjectByID(conditionData.itemID);if(item===undefined){if((selfItem===null||selfItem===void 0?void 0:selfItem.id)===conditionData.itemID)
item=selfItem;else
throw new Error(`Error constructing conditional modifier, item with id: ${conditionData.itemID} is not registered.`);}
return{type:conditionData.type,item,value:conditionData.value,operator:conditionData.operator,};}
case 'Every':case 'Some':return{type:conditionData.type,conditions:conditionData.conditions.map((conditionData)=>this.getConditionFromData(conditionData,game,selfItem)),};default:return conditionData;}}
addConditionHooks(condition){switch(condition.type){case 'BankItem':this.hooks.add('BankItem');break;case 'IsFighting':case 'CombatType':case 'FightingBoss':case 'EquipStatCompare':this.hooks.add('EnemySpawn');break;case 'DOT':if(condition.character==='Player')
this.hooks.add('PlayerDOT');else
this.hooks.add('EnemyDOT');break;case 'Effect':if(condition.character==='Player')
this.hooks.add('PlayerModEffect');else
this.hooks.add('EnemyModEffect');break;case 'Some':case 'Every':condition.conditions.forEach((condition)=>this.addConditionHooks(condition));break;case 'Hitpoints':if(condition.character==='Player')
this.hooks.add('PlayerHitpoints');else
this.hooks.add('EnemyHitpoints');break;case 'ItemCharge':this.hooks.add('ItemCharges');break;case 'IsStunned':if(condition.character==='Player')
this.hooks.add('Stun');else
this.hooks.add('EnemyStun');break;case 'IsSleeping':if(condition.character==='Player')
this.hooks.add('Sleep');else
this.hooks.add('EnemySleep');break;default:throw new Error('No hooks exist for condition.');}}}