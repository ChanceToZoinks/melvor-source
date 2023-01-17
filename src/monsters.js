"use strict";class Monster extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this.specialAttacks=[];this._media=data.media;if(data.mediaAnimation!==undefined)
this._mediaAnimation=data.mediaAnimation;this.levels=data.levels;this.equipmentStats=data.equipmentStats;this.ignoreCompletion=data.ignoreCompletion;this.attackType=data.attackType;data.specialAttacks.forEach((attackID,i)=>{var _a,_b;const attack=game.specialAttacks.getObjectByID(attackID);if(attack===undefined)
throw new Error(`Error constructing monster, attack with id: ${attackID} is not registered`);const chance=(_b=(_a=data.overrideSpecialChances)===null||_a===void 0?void 0:_a[i])!==null&&_b!==void 0?_b:attack.defaultChance;this.specialAttacks.push({attack,chance});});this.passives=data.passives.map((passiveID)=>{const passive=game.combatPassives.getObjectByID(passiveID);if(passive===undefined)
throw new Error(`Error constructing Monster with id: ${this.localID}. Combat Passive with id :${passiveID} is not registered.`);return passive;});this.lootChance=data.lootChance;this.lootTable=new DropTable(game,data.lootTable);this.gpDrops=data.gpDrops;if(data.bones!==undefined){const item=game.items.getObjectByID(data.bones.itemID);if(item===undefined)
throw new Error(`Error constructing monster, bone with id: ${data.bones.itemID} is not registered`);this.bones={item,quantity:data.bones.quantity,};}
this.canSlayer=data.canSlayer;this.isBoss=data.isBoss;const spell=game.standardSpells.getObjectByID(data.selectedSpell);if(spell===undefined)
throw new Error(`Error constructing Monster: ${this.localID}. Standard Spell with id: ${data.selectedSpell} is not registered.`);this.selectedSpell=spell;this._description=data.description;this._name=data.name;this.hasDescription=data.description!==undefined;if(data.pet!==undefined){const pet=game.pets.getObjectByID(data.pet.id);if(pet===undefined)
throw new Error(`Error constructing Monster: ${this.id}. Pet with id: ${data.pet.id} is not registered.`);this.pet={pet,kills:data.pet.quantity,};}}
get media(){if(this._mediaAnimation!==undefined)
return this.getMediaURL(this._mediaAnimation);return this.getMediaURL(this._media);}
get name(){if(this.isModded){return this._name;}
else{return getLangString('MONSTER_NAME',this.localID);}}
get description(){if(this._description===undefined)
return '';if(this.isModded){return this._description;}
else{return getLangString('MONSTER_DESCRIPTION',this.localID);}}
get combatLevel(){const prayer=1;const base=0.25*(this.levels.Defence+this.levels.Hitpoints+Math.floor(prayer/2));const melee=0.325*(this.levels.Attack+this.levels.Strength);const range=0.325*Math.floor((3*this.levels.Ranged)/2);const magic=0.325*Math.floor((3*this.levels.Magic)/2);const levels=[melee,range,magic];return Math.floor(base+Math.max(...levels));}}
class DummyMonster extends Monster{constructor(namespace,id,game){super(namespace,{id,name:'',media:"assets/media/main/question.svg",levels:{Hitpoints:0,Attack:0,Strength:0,Defence:0,Ranged:0,Magic:0,},equipmentStats:[],ignoreCompletion:true,attackType:'melee',specialAttacks:[],passives:[],lootChance:0,lootTable:[],gpDrops:{min:0,max:0,},canSlayer:false,isBoss:false,selectedSpell:"melvorD:WindStrike",},game);}}
class GolbinMonster extends Monster{get name(){return this._name;}}