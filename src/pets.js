"use strict";class Pet extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this._name=data.name;this._media=data.media;this._hint=data.hint;if(data.langHint!==undefined)
this._langHint=data.langHint;if(data.skillID!==undefined){const skill=game.skills.getObjectByID(data.skillID);if(skill===undefined)
throw new Error(`Error constructing Pet with id: ${this.id}, skill with id: ${data.skillID} is not registered.`);this.skill=skill;}
this.ignoreCompletion=data.ignoreCompletion;this.modifiers=game.getPlayerModifiersFromData(data.modifiers);if(data.enemyModifiers!==undefined)
this.enemyModifiers=data.enemyModifiers;this.activeInRaid=data.activeInRaid;if(data.patreonName!==undefined)
this._patreonName=data.patreonName;if(data.langCustomDescription!==undefined)
this._langCustomDescription=data.langCustomDescription;this.scaleChanceWithMasteryPool=data.scaleChanceWithMasteryPool;}
get name(){if(this.isModded){return this._name;}
else{return getLangString('PET_NAME',this.localID);}}
get media(){return this.getMediaURL(this._media);}
get acquiredBy(){if(this.isModded&&this._hint!==undefined){return this._hint;}
else if(this._langHint!==undefined){return getLangString(this._langHint.category,this._langHint.id);}
if(this.skill!==undefined)
return this.skill.name;return 'Error: No Hint.';}
get description(){const descriptionLines=[];if(!this.isModded&&this._patreonName!==undefined){descriptionLines.push(`<small>${getLangString('MISC_STRING','1')} ${this._patreonName}</small>`);}
descriptionLines.push(this.acquiredBy);const modDesc=describeModifierDataPlain(this.modifiers);if(modDesc!=='')
descriptionLines.push(modDesc);if(this.isModded&&this._customDescription!==undefined){descriptionLines.push(this._customDescription);}
if(this._langCustomDescription!==undefined){descriptionLines.push(getLangString(this._langCustomDescription.category,this._langCustomDescription.id));}
return descriptionLines.join('<br>');}}
class DummyPet extends Pet{constructor(namespace,id,game){super(namespace,{id,name:'',media:"assets/media/main/question.svg",scaleChanceWithMasteryPool:false,ignoreCompletion:true,modifiers:{},activeInRaid:false,},game);}}
class PetManager{constructor(game){this.game=game;this.modifiers=new MappedModifiers();this.enemyModifiers=new TargetModifiers();this.raidStats={modifiers:new MappedModifiers(),enemyModifiers:new TargetModifiers(),};this.unlocked=new Set();}
onLoad(){this.computeProvidedStats(false);}
isPetUnlocked(pet){return this.unlocked.has(pet);}
rollForPet(chance){if(this.unlocked.has(chance.pet))
return;if(rollPercentage(100/chance.weight))
this.unlockPet(chance.pet);}
rollForSkillPet(pet,actionInterval,forceSkill){if(this.unlocked.has(pet))
return;if(forceSkill===undefined)
forceSkill=pet.skill;if(forceSkill===undefined)
return;const virtualLevel=forceSkill.virtualLevel;let chanceForPet=0;if(pet.id!=="melvorD:LarryTheLonelyLizard")
chanceForPet=((actionInterval/1000)*virtualLevel)/250000;else
chanceForPet=(actionInterval*virtualLevel)/25000000;if(rollPercentage(chanceForPet))
this.unlockPet(pet);}
unlockPet(pet){if(this.unlocked.has(pet))
return;this.unlocked.add(pet);this.game.completion.updatePet(pet);this.computeProvidedStats();this.firePetUnlockModal(pet);}
unlockPetByID(petID){const pet=this.game.pets.getObjectByID(petID);if(pet===undefined)
throw new Error(`Error unlocking pet. Pet with id: ${petID} is not registered.`);this.unlockPet(pet);}
petPet(pet){imageNotify(pet.media,templateLangString('COMPLETION','LOG_PETS_Pet',{petName:pet.name}),'success');if(pet.id==="melvorD:CoolRock")
this.game.combat.player.pets++;}
firePetUnlockModal(pet){addModalToQueue({title:getLangString('COMPLETION','LOG_PETS_UNLOCKED'),html:`<span class="text-success">${pet.name}</span><br><small class="text-info">${pet.description}</small><div class='h5 font-w300 font-size-sm pt-4 mb-0 text-warning'><em>${getLangString('COMPLETION','LOG_PETS_MISC')}</em></div>`,imageUrl:pet.media,imageWidth:128,imageHeight:128,imageAlt:pet.name,});}
computeProvidedStats(updatePlayers=true){this.modifiers.reset();this.enemyModifiers.reset();this.raidStats.modifiers.reset();this.unlocked.forEach((pet)=>{if(pet.activeInRaid){this.raidStats.modifiers.addModifiers(pet.modifiers);if(pet.enemyModifiers!==undefined)
this.raidStats.enemyModifiers.addModifiers(pet.enemyModifiers);}
else{this.modifiers.addModifiers(pet.modifiers);if(pet.enemyModifiers!==undefined)
this.enemyModifiers.addModifiers(pet.enemyModifiers);}});if(updatePlayers){this.game.combat.player.computeAllStats();this.game.golbinRaid.player.computeAllStats();}}
encode(writer){writer.writeSet(this.unlocked,writeNamespaced);return writer;}
decode(reader,version){this.unlocked=reader.getSet((reader)=>{const pet=reader.getNamespacedObject(this.game.pets);if(typeof pet==='string'){if(pet.startsWith('melvor'))
return this.game.pets.getDummyObject(pet,DummyPet,this.game);else
return undefined;}
else
return pet;});}
convertFromOldFormat(save,idMap){if(save.petUnlocked!==undefined){save.petUnlocked.forEach((isUnlocked,oldPetID)=>{if(!isUnlocked)
return;const newID=idMap.pets[oldPetID];let pet=this.game.pets.getObjectByID(newID);if(pet===undefined)
pet=this.game.pets.getDummyObject(newID,DummyPet,this.game);this.unlocked.add(pet);});}}}