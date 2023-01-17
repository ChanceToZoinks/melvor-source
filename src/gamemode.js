"use strict";const COMBAT_TRIANGLE_IDS={Standard:0,Hardcore:1,InvertedHardcore:2,};class Gamemode extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this._name=data.name;if(data.description!==undefined)
this._description=data.description;this._rules=data.rules;this._media=data.media;this.textClass=data.textClass;this.btnClass=data.btnClass;this.isPermaDeath=data.isPermaDeath;this.isEvent=data.isEvent;if(data.startDate!==undefined)
this.startDate=data.startDate;this.endDate=data.endDate;this._combatTriangle=COMBAT_TRIANGLE_IDS[data.combatTriangle];this.hitpointMultiplier=data.hitpointMultiplier;this.hasRegen=data.hasRegen;this.capNonCombatSkillLevels=data.capNonCombatSkillLevels;const page=game.pages.getObjectByID(data.startingPage);if(page===undefined)
throw new UnregisteredConstructionError(this,Page.name,data.startingPage);this.startingPage=page;this.startingItems=game.items.getQuantities(data.startingItems);this.allowSkillUnlock=data.allowSkillUnlock;if(data.startingSkills!==undefined)
this.startingSkills=new Set(data.startingSkills.map((skillID)=>{const skill=game.skills.getObjectByID(skillID);if(skill===undefined)
throw new UnregisteredConstructionError(this,Skill.name,skillID);return skill;}));this.skillUnlockCost=data.skillUnlockCost;this.playerModifiers=game.getPlayerModifiersFromData(data.playerModifiers);this.enemyModifiers=data.enemyModifiers;this.hasTutorial=data.hasTutorial;}
get name(){if(this.isModded){return this._name;}
else{return getLangString('GAMEMODES',`GAMEMODE_NAME_${this.localID}`);}}
get description(){if(this._description===undefined)
return '';if(this.isModded){return this._description;}
else{return getLangString('GAMEMODES',`GAMEMODE_DESC_${this.localID}`);}}
get rules(){if(this.isModded){return this._rules;}
else{return this._rules.map((_,i)=>getLangString('GAMEMODES',`GAMEMODE_RULES_${this.localID}_${i}`));}}
get media(){return this.getMediaURL(this._media);}
get combatTriangle(){return combatTriangle[this._combatTriangle];}}
class DummyGamemode extends Gamemode{get name(){if(this.isModded){return `Unregistered Modded Gamemode: ${this.id}`;}
else{return `Full Version Only Gamemode`;}}
get media(){return cdnMedia("assets/media/main/question.svg");}
constructor(dummyData,game){super(dummyData.dataNamespace,{id:dummyData.localID,name:'',media:'',description:'',rules:[],textClass:'text-danger',btnClass:'btn-danger',isPermaDeath:false,isEvent:false,endDate:0,combatTriangle:'Standard',hitpointMultiplier:1,hasRegen:true,capNonCombatSkillLevels:false,startingPage:"melvorD:ActiveSkill",startingItems:[],allowSkillUnlock:false,startingSkills:[],skillUnlockCost:[],playerModifiers:{},enemyModifiers:{},hasTutorial:true,},game);}}