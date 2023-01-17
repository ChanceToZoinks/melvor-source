"use strict";class BaseSpell extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this._name=data.name;this._media=data.media;this.level=data.level;this.runesRequired=game.items.getQuantities(data.runesRequired);if(data.runesRequiredAlt!==undefined)
this.runesRequiredAlt=game.items.getQuantities(data.runesRequiredAlt);}
get media(){return this.getMediaURL(this._media);}}
class CombatSpell extends BaseSpell{constructor(namespace,data,game){super(namespace,data,game);this.requirements=[];if(data.requiredItemID!==undefined){const item=game.items.equipment.getObjectByID(data.requiredItemID);if(item===undefined)
throw new Error(`Error constructing ${this.constructor.name} with id: ${this.id}: item with id: ${data.requiredItemID} is not registered.`);this.requiredItem=item;}
game.queueForSoftDependencyReg(data,this);}
registerSoftDependencies(data,game){if(data.requirements!==undefined)
this.requirements=data.requirements.map((data)=>game.getRequirementFromData(data));}}
class StandardSpell extends CombatSpell{constructor(namespace,data,game){super(namespace,data,game);this.maxHit=data.maxHit;this.spellType=SpellTypes[data.spellType];this.spellTier=SpellTiers[data.spellTier];if(data.specialAttackID!==undefined){const attack=game.specialAttacks.getObjectByID(data.specialAttackID);if(attack===undefined)
throw new Error(`Error constructing standard spell with id: ${this.id}: attack with id: ${data.specialAttackID} is not registered.`);this.specialAttack=attack;}}
get name(){if(this.isModded){return this._name;}
else{return getLangString('MAGIC',`SPELL_NAME_${this.localID}`);}}}
class CurseSpell extends CombatSpell{constructor(namespace,data,game){super(namespace,data,game);this.targetModifiers=data.targetModifiers;}
get name(){if(this.isModded){return this._name;}
else{return getLangString('MAGIC',`CURSE_NAME_${this.localID}`);}}}
class AuroraSpell extends CombatSpell{constructor(namespace,data,game){super(namespace,data,game);this.modifiers=data.modifiers;}
get name(){if(this.isModded){return this._name;}
else{return getLangString('MAGIC',`AURORA_NAME_${this.localID}`);}}
get description(){return describeModifierData(this.modifiers);}}
class AncientSpell extends CombatSpell{constructor(namespace,data,game){super(namespace,data,game);const attack=game.specialAttacks.getObjectByID(data.specialAttackID);if(attack===undefined)
throw new Error(`Error constructing standard spell with id: ${this.id}: attack with id: ${data.specialAttackID} is not registered.`);this.specialAttack=attack;}
get name(){if(this.isModded){return this._name;}
else{return getLangString('MAGIC',`ANCIENT_NAME_${this.localID}`);}}}
class ArchaicSpell extends CombatSpell{constructor(namespace,data,game){super(namespace,data,game);this.spellType=ArchaicSpellTypeID[data.spellType];this.maxHit=data.maxHit;const attack=game.specialAttacks.getObjectByID(data.specialAttack);if(attack===undefined)
throw new Error(`Error constructing ArchaicSpell with id: ${this.id}: attack with id: ${data.specialAttack} is not registered.`);this.specialAttack=attack;}
get name(){if(this.isModded){return this._name;}
else{return getLangString('MAGIC',`ARCHAIC_NAME_${this.localID}`);}}}