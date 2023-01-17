"use strict";class ItemSynergy{constructor(data,game){this.items=data.itemIDs.map((id)=>{switch(id){case 'ThrowingWeapon':case 'Melee2HWeapon':return id;default:{const item=game.items.equipment.getObjectByID(id);if(item===undefined)
throw new Error(`Error constructing item synergy, item with id: ${id} is not registered.`);return item;}}});if(data.playerModifiers!==undefined)
this.playerModifiers=game.getPlayerModifiersFromData(data.playerModifiers);if(data.enemyModifiers!==undefined)
this.enemyModifiers=data.enemyModifiers;if(data.conditionalModifiers!==undefined)
this.conditionalModifiers=data.conditionalModifiers.map((data)=>new ConditionalModifier(data,game));if(data.equipmentStats!==undefined)
this.equipmentStats=data.equipmentStats;}}