"use strict";var __awaiter=(this&&this.__awaiter)||function(thisArg,_arguments,P,generator){function adopt(value){return value instanceof P?value:new P(function(resolve){resolve(value);});}
return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}
function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}
function step(result){result.done?resolve(result.value):adopt(result.value).then(fulfilled,rejected);}
step((generator=generator.apply(thisArg,_arguments||[])).next());});};class Game{constructor(){this.loopInterval=-1;this.loopStarted=false;this.disableClearOffline=false;this.isUnpausing=false;this.previousTickTime=performance.now();this.enableRendering=true;this.maxOfflineTicks=20*60*60*24;this.registeredNamespaces=new NamespaceMap();this.dummyNamespaces=new NamespaceMap();this.tickTimestamp=Date.now();this.saveTimestamp=0;this._isPaused=false;this.merchantsPermitRead=false;this.characterName=getLangString('CHARACTER_SELECT','75');this.minibar=new Minibar(this);this.petManager=new PetManager(this);this.shop=new Shop(this);this.itemCharges=new ItemCharges(this);this.tutorial=new Tutorial(this);this.potions=new PotionManager(this);this.gp=new GP(this);this.slayerCoins=new SlayerCoins(this);this.raidCoins=new RaidCoins(this);this.readNewsIDs=[];this.lastLoadedGameVersion=gameVersion;this.completion=new Completion(this);this.lore=new Lore(this);this.eventManager=new EventManager();this.dropWeightCache=new Map();this.refundedAstrology=false;this.refundedAstrologyAgain=false;this.renderQueue={title:false,combatMinibar:false,activeSkills:false,};this.attackStyles=new NamespaceRegistry(this.registeredNamespaces);this.stackingEffects=new NamespaceRegistry(this.registeredNamespaces);this.specialAttacks=new NamespaceRegistry(this.registeredNamespaces);this.items=new ItemRegistry(this.registeredNamespaces);this.pages=new NamespaceRegistry(this.registeredNamespaces);this.actions=new NamespaceRegistry(this.registeredNamespaces);this.activeActions=new NamespaceRegistry(this.registeredNamespaces);this.passiveActions=new NamespaceRegistry(this.registeredNamespaces);this._passiveTickers=[];this.actionPageMap=new Map();this.skillPageMap=new Map();this.skills=new NamespaceRegistry(this.registeredNamespaces);this.masterySkills=new NamespaceRegistry(this.registeredNamespaces);this.monsters=new NamespaceRegistry(this.registeredNamespaces);this.monsterAreas=new Map();this.combatPassives=new NamespaceRegistry(this.registeredNamespaces);this.combatAreas=new NamespaceRegistry(this.registeredNamespaces);this.combatAreaDisplayOrder=new NamespacedArray(this.combatAreas);this.slayerAreas=new NamespaceRegistry(this.registeredNamespaces);this.slayerAreaDisplayOrder=new NamespacedArray(this.slayerAreas);this.dungeons=new NamespaceRegistry(this.registeredNamespaces);this.dungeonDisplayOrder=new NamespacedArray(this.dungeons);this.combatEvents=new NamespaceRegistry(this.registeredNamespaces);this.prayers=new NamespaceRegistry(this.registeredNamespaces);this.standardSpells=new NamespaceRegistry(this.registeredNamespaces);this.curseSpells=new NamespaceRegistry(this.registeredNamespaces);this.auroraSpells=new NamespaceRegistry(this.registeredNamespaces);this.ancientSpells=new NamespaceRegistry(this.registeredNamespaces);this.archaicSpells=new NamespaceRegistry(this.registeredNamespaces);this.pets=new NamespaceRegistry(this.registeredNamespaces);this.gamemodes=new NamespaceRegistry(this.registeredNamespaces);this.steamAchievements=new Map();this.itemSynergies=new Map();this.randomGemTable=new DropTable(this,[]);this.randomSuperiorGemTable=new DropTable(this,[]);this.softDataRegQueue=[];this.bank=new Bank(this,12,12);this.registeredNamespaces.registerNamespace("melvorBaseGame",'Base Game',false);this.registeredNamespaces.registerNamespace("melvorTrue",'True',false);const demoNamespace=this.registeredNamespaces.registerNamespace("melvorD",'Demo',false);if(cloudManager.hasFullVersionEntitlement){const fullNamespace=this.registeredNamespaces.registerNamespace("melvorF",'Full Version',false);this.combatPassives.registerObject(new ControlledAffliction(fullNamespace,this));}
if(cloudManager.hasTotHEntitlement)
this.registeredNamespaces.registerNamespace("melvorTotH",'Throne of the Herald',false);this.normalAttack=new SpecialAttack(demoNamespace,{id:'Normal',defaultChance:100,damage:[{damageType:'Normal',amplitude:100,},],prehitEffects:[],onhitEffects:[],cantMiss:false,attackCount:1,attackInterval:-1,lifesteal:0,usesRunesPerProc:false,usesPrayerPointsPerProc:true,usesPotionChargesPerProc:true,attackTypes:['melee','ranged','magic'],isDragonbreath:false,name:'Normal Attack',description:'Perform a Normal attack.',descriptionGenerator:'Perform a Normal attack.',},this);this.specialAttacks.registerObject(this.normalAttack);this.itemEffectAttack=new ItemEffectAttack(demoNamespace,this);this.emptyEquipmentItem=new EquipmentItem(demoNamespace,{id:'Empty_Equipment',tier:'emptyItem',name:'',validSlots:[],occupiesSlots:[],equipRequirements:[],equipmentStats:[],category:'',type:'',media:"assets/media/skills/combat/food_empty.svg",ignoreCompletion:true,obtainFromItemLog:false,golbinRaidExclusive:false,sellsFor:0,},this);this.items.registerObject(this.emptyEquipmentItem);this.emptyFoodItem=new FoodItem(demoNamespace,{itemType:'Food',id:'Empty_Food',name:'',healsFor:0,category:'',type:'',media:"assets/media/skills/combat/food_empty.svg",ignoreCompletion:true,obtainFromItemLog:false,golbinRaidExclusive:false,sellsFor:0,});this.items.registerObject(this.emptyFoodItem);this.unknownCombatArea=new CombatArea(demoNamespace,{name:'Unknown Area',id:'UnknownArea',media:'assets/media/main/question.svg',monsterIDs:[],difficulty:[0],entryRequirements:[],},this);this.combatAreas.registerObject(this.unknownCombatArea);this.decreasedEvasionStackingEffect=new StackingEffect(demoNamespace,{id:'DecreasedEvasion',stacksToAdd:1,modifiers:{decreasedGlobalEvasion:10,},maxStacks:3,name:'TODO: Get name',media:TODO_REPLACE_MEDIA,});this.activeActionPage=new Page(demoNamespace,{id:'ActiveSkill',customName:'Active Skill',media:'assets/media/main/logo_no_text.svg',containerID:'',headerBgClass:'',hasGameGuide:false,canBeDefault:true,},this);this.pages.registerObject(this.activeActionPage);const unsetMode=new Gamemode(demoNamespace,{id:'Unset',name:'Error: Unset Gamemode',media:"assets/media/main/question.svg",description:'Error: Unset Gamemode',rules:[],textClass:'',btnClass:'',isPermaDeath:false,isEvent:false,endDate:0,combatTriangle:'Standard',hitpointMultiplier:1,hasRegen:true,capNonCombatSkillLevels:false,startingPage:"melvorD:ActiveSkill",startingItems:[],allowSkillUnlock:true,startingSkills:[],skillUnlockCost:[Infinity],playerModifiers:{},enemyModifiers:{},hasTutorial:false,},this);this.gamemodes.registerObject(unsetMode);this.currentGamemode=unsetMode;this.settings=new Settings(this);this.stats=new Statistics(this);this.combat=new CombatManager(this,demoNamespace);this.golbinRaid=new RaidManager(this,demoNamespace);this.actions.registerObject(this.combat);this.actions.registerObject(this.golbinRaid);this.activeActions.registerObject(this.combat);this.activeActions.registerObject(this.golbinRaid);this.passiveActions.registerObject(this.combat);this.attack=this.registerSkill(demoNamespace,Attack);this.strength=this.registerSkill(demoNamespace,Strength);this.defence=this.registerSkill(demoNamespace,Defence);this.hitpoints=this.registerSkill(demoNamespace,Hitpoints);this.ranged=this.registerSkill(demoNamespace,Ranged);this.altMagic=this.registerSkill(demoNamespace,AltMagic);this.prayer=this.registerSkill(demoNamespace,Prayer);this.slayer=this.registerSkill(demoNamespace,Slayer);this.woodcutting=this.registerSkill(demoNamespace,Woodcutting);this.fishing=this.registerSkill(demoNamespace,Fishing);this.firemaking=this.registerSkill(demoNamespace,Firemaking);this.cooking=this.registerSkill(demoNamespace,Cooking);this.mining=this.registerSkill(demoNamespace,Mining);this.smithing=this.registerSkill(demoNamespace,Smithing);this.thieving=this.registerSkill(demoNamespace,Thieving);this.farming=this.registerSkill(demoNamespace,Farming);this.fletching=this.registerSkill(demoNamespace,Fletching);this.crafting=this.registerSkill(demoNamespace,Crafting);this.runecrafting=this.registerSkill(demoNamespace,Runecrafting);this.herblore=this.registerSkill(demoNamespace,Herblore);this.agility=this.registerSkill(demoNamespace,Agility);this.summoning=this.registerSkill(demoNamespace,Summoning);this.astrology=this.registerSkill(demoNamespace,Astrology);this.township=this.registerSkill(demoNamespace,Township);this.actions.registerObject(this.township);this.combat.player.registerStatProvider(this.petManager);this.combat.player.registerStatProvider(this.shop);this.combat.player.registerStatProvider(this.potions);this.golbinRaid.player.registerStatProvider(this.petManager.raidStats);this.golbinRaid.player.registerStatProvider(this.shop.raidStats);}
get playerCombatLevel(){const base=0.25*(this.defence.level+this.hitpoints.level+Math.floor(this.prayer.level/2));const melee=0.325*(this.attack.level+this.strength.level);const range=0.325*Math.floor((3*this.ranged.level)/2);const magic=0.325*Math.floor((3*this.altMagic.level)/2);const levels=[melee,range,magic];return Math.floor(base+Math.max(...levels));}
get isPaused(){return this._isPaused;}
get isGolbinRaid(){return this.activeAction===this.golbinRaid;}
get modifiers(){return this.combat.player.modifiers;}
fetchAndRegisterDataPackage(url){return __awaiter(this,void 0,void 0,function*(){const headers=new Headers();headers.append('Content-Type','application/json');const response=yield fetch(url,{method:'GET',headers,});if(!response.ok)
throw new Error(`Could not fetch data package with URL: ${url}. Error ${response.status}: ${response.statusText}`);const dataPackage=(yield response.json());this.registerDataPackage(dataPackage);});}
registerDataPackage(dataPackage){if(dataPackage.namespace===undefined)
throw new Error(`Package does not have a namespace defined.`);const namespace=this.registeredNamespaces.getNamespace(dataPackage.namespace);if(namespace===undefined)
throw new Error(`Error trying to register data package. Namespace: "${dataPackage.namespace}" is not registered.`);if(dataPackage.data!==undefined){if(dataPackage.data.stackingEffects!==undefined)
this.registerStackingEffectData(namespace,dataPackage.data.stackingEffects);if(dataPackage.data.combatPassives!==undefined)
this.registerCombatPassiveData(namespace,dataPackage.data.combatPassives);if(dataPackage.data.attacks!==undefined)
this.registerAttackData(namespace,dataPackage.data.attacks);if(dataPackage.data.pages!==undefined)
this.registerPages(namespace,dataPackage.data.pages);if(dataPackage.data.pets!==undefined)
this.registerPets(namespace,dataPackage.data.pets);if(dataPackage.data.attackStyles!==undefined)
this.registerAttackStyles(namespace,dataPackage.data.attackStyles);if(dataPackage.data.prayers!==undefined)
this.registerPrayerData(namespace,dataPackage.data.prayers);if(dataPackage.data.items!==undefined)
this.registerItemData(namespace,dataPackage.data.items);if(dataPackage.data.bankSortOrder!==undefined)
this.bank.registerSortOrder(dataPackage.data.bankSortOrder);if(dataPackage.data.itemUpgrades!==undefined)
this.bank.registerItemUpgrades(dataPackage.data.itemUpgrades);if(dataPackage.data.itemSynergies!==undefined)
this.registerItemSynergies(dataPackage.data.itemSynergies);if(dataPackage.data.randomGems!==undefined)
this.randomGemTable.registerDrops(this,dataPackage.data.randomGems);if(dataPackage.data.randomSuperiorGems!==undefined)
this.randomSuperiorGemTable.registerDrops(this,dataPackage.data.randomSuperiorGems);if(dataPackage.data.golbinRaid!==undefined)
this.golbinRaid.registerData(dataPackage.data.golbinRaid);if(dataPackage.data.gamemodes!==undefined)
this.registerGamemodes(namespace,dataPackage.data.gamemodes);if(dataPackage.data.standardSpells!==undefined)
this.registerStandardSpellData(namespace,dataPackage.data.standardSpells);if(dataPackage.data.auroraSpells!==undefined)
this.registerAuroraSpellData(namespace,dataPackage.data.auroraSpells);if(dataPackage.data.curseSpells!==undefined)
this.registerCurseSpellData(namespace,dataPackage.data.curseSpells);if(dataPackage.data.itemEffects!==undefined)
this.itemEffectAttack.registerItemEffects(namespace,dataPackage.data.itemEffects,this);if(dataPackage.data.monsters!==undefined)
this.registerMonsterData(namespace,dataPackage.data.monsters);if(dataPackage.data.itmMonsters!==undefined)
this.registerRandomMonsters(dataPackage.data.itmMonsters,this.combat.itmMonsters);if(dataPackage.data.spiderLairMonsters!==undefined)
this.registerRandomMonsters(dataPackage.data.spiderLairMonsters,this.combat.spiderLairMonsters);if(dataPackage.data.combatAreas!==undefined)
this.registerCombatAreaData(namespace,dataPackage.data.combatAreas);if(dataPackage.data.slayerAreas!==undefined)
this.registerSlayerAreaData(namespace,dataPackage.data.slayerAreas);if(dataPackage.data.combatEvents!==undefined)
this.registerCombatEventData(namespace,dataPackage.data.combatEvents);if(dataPackage.data.dungeons!==undefined)
this.registerDungeonData(namespace,dataPackage.data.dungeons);if(dataPackage.data.combatAreaDisplayOrder!==undefined)
this.combatAreaDisplayOrder.registerData(dataPackage.data.combatAreaDisplayOrder);if(dataPackage.data.slayerAreaDisplayOrder!==undefined)
this.slayerAreaDisplayOrder.registerData(dataPackage.data.slayerAreaDisplayOrder);if(dataPackage.data.dungeonDisplayOrder!==undefined)
this.dungeonDisplayOrder.registerData(dataPackage.data.dungeonDisplayOrder);if(dataPackage.data.ancientSpells!==undefined)
this.registerAncientSpellData(namespace,dataPackage.data.ancientSpells);if(dataPackage.data.archaicSpells!==undefined)
this.registerArchaicSpellData(namespace,dataPackage.data.archaicSpells);if(dataPackage.data.shopCategories!==undefined)
this.registerShopCategories(namespace,dataPackage.data.shopCategories);if(dataPackage.data.shopCategoryOrder!==undefined)
this.shop.categoryDisplayOrder.registerData(dataPackage.data.shopCategoryOrder);if(dataPackage.data.shopPurchases!==undefined)
this.registerShopPurchases(namespace,dataPackage.data.shopPurchases);if(dataPackage.data.shopDisplayOrder!==undefined)
this.shop.purchaseDisplayOrder.registerData(dataPackage.data.shopDisplayOrder);if(dataPackage.data.shopUpgradeChains!==undefined)
this.registerShopUpgradeChains(namespace,dataPackage.data.shopUpgradeChains);if(dataPackage.data.skillData!==undefined){dataPackage.data.skillData.forEach((skillsData)=>{const skill=this.skills.getObjectByID(skillsData.skillID);if(skill===undefined)
throw new Error(`Error registering data package. Cannot register data for unregistered skill: ${skillsData.skillID}.`);skill.registerData(namespace,skillsData.data);});}
if(!namespace.isModded&&dataPackage.data.steamAchievements!==undefined)
this.registerSteamAchievements(dataPackage.data.steamAchievements);if(dataPackage.data.lore!==undefined)
this.lore.registerLore(namespace,dataPackage.data.lore);if(!namespace.isModded){if(dataPackage.data.tutorialStages!==undefined)
this.tutorial.registerStages(namespace,dataPackage.data.tutorialStages);if(dataPackage.data.tutorialStageOrder!==undefined)
this.tutorial.registerStageOrder(dataPackage.data.tutorialStageOrder);}
this.softDataRegQueue.forEach(([data,object])=>object.registerSoftDependencies(data,this));this.softDataRegQueue=[];}
if(dataPackage.modifications!==undefined)
this.applyDataModifications(dataPackage.modifications);if(dataPackage.namespaceChange!==undefined){if(dataPackage.namespaceChange.items!==undefined){this.items.registerNamespaceChange(namespace,dataPackage.namespaceChange.items);}}}
queueForSoftDependencyReg(data,object){this.softDataRegQueue.push([data,object]);}
postDataRegistration(){this.combatAreas.forEach((area)=>{area.monsters.forEach((monster)=>this.monsterAreas.set(monster,area));});this.slayerAreas.forEach((area)=>{area.monsters.forEach((monster)=>this.monsterAreas.set(monster,area));const slayerLevelReq=area.entryRequirements.find((req)=>{return req.type==='SkillLevel'&&req.skill===this.slayer;});if(slayerLevelReq!==undefined)
area.slayerLevelRequired=slayerLevelReq.level;});this.skills.forEach((skill)=>skill.postDataRegistration());this.shop.postDataRegistration();this.golbinRaid.postDataRegistration();this.combat.postDataRegistration();this._passiveTickers=this.passiveActions.allObjects;this.pages.forEach((page)=>{if(page.action!==undefined)
this.actionPageMap.set(page.action,page);if(page.skills!==undefined){page.skills.forEach((skill)=>{const pageArray=this.skillPageMap.get(skill);if(pageArray!==undefined){pageArray.push(page);}
else{this.skillPageMap.set(skill,[page]);}});}});this.settings.postDataRegistration();}
registerAttackStyles(namespace,data){data.forEach((data)=>this.attackStyles.registerObject(new AttackStyle(namespace,data,this)));}
registerItemData(namespace,data){data.forEach((itemData)=>{switch(itemData.itemType){case 'Item':this.items.registerObject(new Item(namespace,itemData));break;case 'Equipment':this.items.registerObject(new EquipmentItem(namespace,itemData,this));break;case 'Weapon':this.items.registerObject(new WeaponItem(namespace,itemData,this));break;case 'Food':this.items.registerObject(new FoodItem(namespace,itemData));break;case 'Bone':this.items.registerObject(new BoneItem(namespace,itemData));break;case 'Potion':this.items.registerObject(new PotionItem(namespace,itemData,this));break;case 'Readable':this.items.registerObject(new ReadableItem(namespace,itemData));break;case 'Openable':this.items.registerObject(new OpenableItem(namespace,itemData,this));break;case 'Token':this.items.registerObject(new TokenItem(namespace,itemData,this));break;case 'Compost':this.items.registerObject(new CompostItem(namespace,itemData));break;}});}
registerAttackData(namespace,data){data.forEach((attackData)=>{this.specialAttacks.registerObject(new SpecialAttack(namespace,attackData,this));});}
registerStackingEffectData(namespace,data){data.forEach((effectData)=>{this.stackingEffects.registerObject(new StackingEffect(namespace,effectData));});}
registerCombatPassiveData(namespace,data){data.forEach((passiveData)=>{this.combatPassives.registerObject(new CombatPassive(namespace,passiveData));});}
registerMonsterData(namespace,data){data.forEach((monsterData)=>{this.monsters.registerObject(new Monster(namespace,monsterData,this));});}
registerRandomMonsters(monsterIDs,monsterArray){monsterIDs.forEach((monsterID)=>{const monster=this.monsters.getObjectByID(monsterID);if(monster===undefined)
throw new Error(`Error registering random dungeon monsters, monster with id: ${monsterID} is not registered.`);monsterArray.push(monster);});}
registerCombatAreaData(namespace,data){data.forEach((data)=>{this.combatAreas.registerObject(new CombatArea(namespace,data,this));});}
registerSlayerAreaData(namespace,data){data.forEach((data)=>{this.slayerAreas.registerObject(new SlayerArea(namespace,data,this));});}
registerDungeonData(namespace,data){data.forEach((data)=>{this.dungeons.registerObject(new Dungeon(namespace,data,this));});}
registerCombatEventData(namespace,data){data.forEach((data)=>{this.combatEvents.registerObject(new CombatEvent(namespace,data,this));});}
registerPrayerData(namespace,data){data.forEach((data)=>this.prayers.registerObject(new ActivePrayer(namespace,data,this)));}
registerStandardSpellData(namespace,data){data.forEach((data)=>this.standardSpells.registerObject(new StandardSpell(namespace,data,this)));}
registerCurseSpellData(namespace,data){data.forEach((data)=>this.curseSpells.registerObject(new CurseSpell(namespace,data,this)));}
registerAuroraSpellData(namespace,data){data.forEach((data)=>this.auroraSpells.registerObject(new AuroraSpell(namespace,data,this)));}
registerAncientSpellData(namespace,data){data.forEach((data)=>this.ancientSpells.registerObject(new AncientSpell(namespace,data,this)));}
registerArchaicSpellData(namespace,data){data.forEach((data)=>this.archaicSpells.registerObject(new ArchaicSpell(namespace,data,this)));}
registerPets(namespace,data){data.forEach((data)=>this.pets.registerObject(new Pet(namespace,data,this)));}
registerShopCategories(namespace,data){data.forEach((data)=>this.shop.categories.registerObject(new ShopCategory(namespace,data,this)));}
registerShopPurchases(namespace,data){data.forEach((data)=>this.shop.purchases.registerObject(new ShopPurchase(namespace,data,this)));}
registerShopUpgradeChains(namespace,data){data.forEach((data)=>this.shop.upgradeChains.registerObject(new ShopUpgradeChain(namespace,data,this)));}
registerItemSynergies(data){data.forEach((data)=>{const synergy=new ItemSynergy(data,this);synergy.items.forEach((item)=>{if(!(typeof item==='string')){let synergyArray=this.itemSynergies.get(item);if(synergyArray===undefined){synergyArray=[];this.itemSynergies.set(item,synergyArray);}
synergyArray.push(synergy);}});});}
registerGamemodes(namespace,data){data.forEach((gamemodeData)=>this.gamemodes.registerObject(new Gamemode(namespace,gamemodeData,this)));}
registerSteamAchievements(data){data.forEach((achieveData)=>this.steamAchievements.set(achieveData.id,new SteamAchievement(achieveData,this)));}
registerPages(namespace,data){data.forEach((pageData)=>this.pages.registerObject(new Page(namespace,pageData,this)));}
registerSkill(namespace,constructor){const skillInstance=new constructor(namespace,this);this.skills.registerObject(skillInstance);let isAction=false;if(skillInstance.passiveTick!==undefined){this.passiveActions.registerObject(skillInstance);isAction=true;}
if(skillInstance.activeTick!==undefined){this.activeActions.registerObject(skillInstance);isAction=true;}
if(isAction)
this.actions.registerObject(skillInstance);if(skillInstance.modifiers!==undefined||skillInstance.enemyModifiers!==undefined||skillInstance.conditionalModifiers!==undefined||skillInstance.equipmentStats!==undefined){this.combat.player.registerStatProvider(skillInstance);}
if(skillInstance instanceof SkillWithMastery){this.masterySkills.registerObject(skillInstance);}
return skillInstance;}
applyDataModifications(modificationData){var _a,_b,_c;if(modificationData.shopPurchases!==undefined){modificationData.shopPurchases.forEach((modData)=>{const purchase=this.shop.purchases.getObjectByID(modData.id);if(purchase===undefined)
throw new UnregisteredDataModError(ShopPurchase.name,modData.id);purchase.applyDataModification(modData,this);});}
(_a=modificationData.shopUpgradeChains)===null||_a===void 0?void 0:_a.forEach((modData)=>{const upgradeChain=this.shop.upgradeChains.getObjectByID(modData.id);if(upgradeChain===undefined)
throw new UnregisteredDataModError(ShopUpgradeChain.name,modData.id);upgradeChain.applyDataModification(modData,this);});(_b=modificationData.cookingCategories)===null||_b===void 0?void 0:_b.forEach((modData)=>{const category=this.cooking.categories.getObjectByID(modData.id);if(category===undefined)
throw new UnregisteredDataModError(CookingCategory.name,modData.id);category.applyDataModification(modData,this);});(_c=modificationData.fletchingRecipes)===null||_c===void 0?void 0:_c.forEach((modData)=>{const recipe=this.fletching.actions.getObjectByID(modData.id);if(recipe===undefined)
throw new UnregisteredDataModError(FletchingRecipe.name,modData.id);recipe.applyDataModification(modData,this);});}
getPlayerModifiersFromData(data){const modifierObject={};Object.entries(data).forEach((entry)=>{if(isSkillEntry(entry)){modifierObject[entry[0]]=entry[1].map(({skillID,value})=>{const skill=this.skills.getObjectByID(skillID);if(skill===undefined)
throw new Error(`Error creating modifier object from data. Skill with id: ${skillID} is not registered.`);return{skill,value,};});}
else{modifierObject[entry[0]]=entry[1];}});return modifierObject;}
getRequirementFromData(data){switch(data.type){case 'DungeonCompletion':return this.getDungeonRequirement(data);case 'SkillLevel':return this.getLevelRequirement(data);case 'ShopPurchase':return this.getShopPurchaseRequirement(data);case 'SlayerItem':return this.getSlayerItemRequirement(data);case 'ItemFound':return this.getItemFoundRequirement(data);case 'MonsterKilled':return this.getMonsterKilledRequirement(data);case 'TownshipBuilding':return this.getTownshipBuildingRequirement(data);case 'AllSkillLevels':return this.getAllSkillLevelRequirement(data);case 'SlayerTask':return this.getSlayerTaskRequirement(data);case 'Completion':return this.getCompletionRequirement(data);case 'TownshipTask':return data;case 'TownshipTutorialTask':return data;}}
getDungeonRequirement(data){const dungeon=this.dungeons.getObjectByID(data.dungeonID);if(dungeon===undefined)
throw new Error(`Error getting dungeon requirement. Dungeon with id: ${data.dungeonID} is not registered.`);return{type:data.type,dungeon,count:data.count,};}
getLevelRequirement(data){const skill=this.skills.getObjectByID(data.skillID);if(skill===undefined)
throw new Error(`Error getting level requirement. Skill with id: ${data.skillID} is not registered.`);return{type:data.type,skill,level:data.level,};}
getSlayerItemRequirement(data){const item=this.items.equipment.getObjectByID(data.itemID);if(item===undefined)
throw new Error(`Error getting slayer item requirement. Item with id: ${data.itemID} is not registered.`);return{type:data.type,item,};}
getItemFoundRequirement(data){const item=this.items.getObjectByID(data.itemID);if(item===undefined)
throw new Error(`Error getting item found requirement. Item with id: ${data.itemID} is not registered.`);return{type:data.type,item,};}
getMonsterKilledRequirement(data){const monster=this.monsters.getObjectByID(data.monsterID);if(monster===undefined)
throw new Error(`Error getting MonsterKilledRequirement. Monster with id: ${data.monsterID} is not registered.`);return{type:data.type,monster,count:data.count,};}
getShopPurchaseRequirement(data){const purchase=this.shop.purchases.getObjectByID(data.purchaseID);if(purchase===undefined)
throw new Error(`Error getting shop purchase requirement. Shop purchase with id: ${data.purchaseID} is not registered.`);return{type:data.type,purchase,count:data.count,};}
getTownshipBuildingRequirement(data){const building=this.township.buildings.getObjectByID(data.buildingID);if(building===undefined)
throw new Error(`Error getting township building requirement. Building with id: ${data.buildingID} is not registered.`);return{type:data.type,building,count:data.count,};}
getAllSkillLevelRequirement(data){const requirement={type:'AllSkillLevels',level:data.level,};if(data.exceptions!==undefined){requirement.exceptions=new Set(data.exceptions.map((id)=>{const skill=this.skills.getObjectByID(id);if(skill===undefined)
throw new Error(`Error getting all skill level requirement. Skill with id ${id} is not registered`);return skill;}));}
return requirement;}
getSlayerTaskRequirement(data){return{type:'SlayerTask',tier:SlayerTierID[data.tier],count:data.count,};}
getCompletionRequirement(data){const namespace=this.registeredNamespaces.getNamespace(data.namespace);if(namespace===undefined)
throw new Error(`Error getting completion requirement. Namespace ${data.namespace} is not registered`);return{type:'Completion',percent:data.percent,namespace,};}
getDummyData(fullID){const[name,localID]=fullID.split(':');let dataNamespace=this.dummyNamespaces.getNamespace(name);if(dataNamespace===undefined){dataNamespace=this.dummyNamespaces.registerNamespace(name,'Error: Unregistered Namespace',!name.startsWith('melvor'));}
return{dataNamespace,localID};}
constructDummyObject(id,constructor){const dummyData=this.getDummyData(id);return new constructor(dummyData.dataNamespace,dummyData.localID,this);}
startMainLoop(){if(!this.loopStarted){this.previousTickTime=performance.now();this.loopInterval=window.setInterval(this.loop.bind(this),TICK_INTERVAL);this.loopStarted=true;logConsole('Starting Main Game Loop.');}
else{if(DEBUGENABLED)
console.warn('Game loop was already started.');}}
stopMainLoop(){if(this.loopStarted){clearInterval(this.loopInterval);this.loopStarted=false;logConsole('Stopping Main Game Loop.');}
else{if(DEBUGENABLED)
console.warn('Game loop was already stopped');}}
pauseActiveSkill(fromBlur=false){if(this._isPaused)
return;this._isPaused=true;if(this.pausedAction===undefined){if(this.activeAction===this.combat&&!this.settings.enableOfflineCombat&&fromBlur)
return;this.pausedAction=this.activeAction;this.activeAction=undefined;}
if(fromBlur)
this.stopMainLoop();}
unpauseActiveSkill(fromFocus=false){return __awaiter(this,void 0,void 0,function*(){if(!this._isPaused||this.isUnpausing)
return;this.isUnpausing=true;this._isPaused=false;if(this.pausedAction!==undefined){const wasGolbinRaid=this.isGolbinRaid;this.activeAction=this.pausedAction;this.pausedAction=undefined;yield this.processOffline();if(wasGolbinRaid){switch(this.activeAction){case this.thieving:this.thieving.onLoad();break;case this.firemaking:this.firemaking.onLoad();break;}}}
else if(this.isGolbinRaid){this.activeAction=undefined;}
if(fromFocus)
this.startMainLoop();this.isUnpausing=false;});}
idleChecker(action){if(this.isGolbinRaid)
return true;if(this.activeAction===undefined)
return false;if(this.activeAction!==action){return!this.activeAction.stop();}
return false;}
stopActiveAction(){var _a;(_a=this.activeAction)===null||_a===void 0?void 0:_a.stop();}
onLoad(){this.renderQueue.activeSkills=true;if(this.golbinRaid.raidRunning&&this.activeAction!==this.golbinRaid){if(this.pausedAction!==undefined){const paused=this.pausedAction;if(!(paused instanceof BaseManager)&&!paused.isActive)
this.pausedAction=undefined;}
const currentActive=this.activeAction;if(currentActive!==undefined&&!(currentActive instanceof BaseManager)&&currentActive.isActive)
this.pausedAction=this.activeAction;this.activeAction=this.golbinRaid;}
if(this.isPaused&&this.pausedAction===undefined&&!this.isGolbinRaid)
this._isPaused=false;if(this.pausedAction!==undefined&&!this.isGolbinRaid){this.activeAction=this.pausedAction;this.pausedAction=undefined;this._isPaused=false;logConsole('Game was paused on load. Setting state to unpaused.');}
if(this.thieving.isActive&&this.activeAction!==this.thieving&&this.pausedAction!==this.thieving){this.disableClearOffline=true;this.thieving.resetActionState();this.disableClearOffline=false;}
this.skills.forEach((skill)=>{skill.onLoad();});this.completion.onLoad();this.bank.onLoad();this.potions.onLoad();this.petManager.onLoad();this.shop.onLoad();this.combat.initialize();this.gp.onLoad();this.slayerCoins.onLoad();this.raidCoins.onLoad();this.settings.initializeToggles();this.settings.initializeChoices();this.township.postStatLoad();this.township.tasks.onLoad();this.settings.onLoad();}
processTime(){const currentTickTime=performance.now();let ticksToRun=Math.floor((currentTickTime-this.previousTickTime)/TICK_INTERVAL);if(ticksToRun>this.maxOfflineTicks){ticksToRun=this.maxOfflineTicks;this.previousTickTime=currentTickTime-ticksToRun*TICK_INTERVAL;}
this.runTicks(ticksToRun);this.previousTickTime+=ticksToRun*TICK_INTERVAL;}
runTicks(ticksToRun){const startTimeStamp=performance.now();for(let i=0;i<ticksToRun;i++){this.tick();}
if(ticksToRun>72000){const processingTime=performance.now()-startTimeStamp;console.log(`Took ${processingTime/1000}s to process ${ticksToRun} ticks. ${processingTime/ticksToRun}ms per tick.`);}}
tick(){var _a;if(this.isGolbinRaid){this.golbinRaid.activeTick();}
else{this._passiveTickers.forEach((action)=>{action.passiveTick();});(_a=this.activeAction)===null||_a===void 0?void 0:_a.activeTick();this.combat.checkDeath();}}
queueRequirementRenders(){this.combat.rendersRequired.areaRequirements=true;this.combat.rendersRequired.spellBook=true;this.shop.renderQueue.requirements=true;this.lore.renderUnlocks=true;}
render(){if(this.isGolbinRaid){this.golbinRaid.render();}
else{this.combat.render();this.skills.forEach((skill)=>{skill.render();});this.tutorial.render();}
this.renderGameTitle();this.renderCombatMinibar();this.renderActiveSkills();this.stats.renderMutatedStats();this.completion.render();this.bank.render();this.potions.render();this.itemCharges.render();this.shop.render();this.gp.render();this.slayerCoins.render();this.raidCoins.render();this.minibar.render();this.lore.render();openNextModal();}
renderGameTitle(){if(this.renderQueue.title){let title=gameTitle;if(this.activeAction===this.combat||this.activeAction===this.thieving){title=`${getLangString('SKILL_NAME','Hitpoints')} ${numberWithCommas(this.combat.player.hitpoints)}`;}
else if(this.activeAction===this.golbinRaid){title=`${getLangString('SKILL_NAME','Hitpoints')} ${numberWithCommas(this.golbinRaid.player.hitpoints)}`;}
$('title').text(title);}
this.renderQueue.title=false;}
renderCombatMinibar(){var _a;if(!this.renderQueue.combatMinibar)
return;const minibar=document.getElementById('combat-footer-minibar');const inCombatLike=this.activeAction===this.combat||this.activeAction===this.golbinRaid;if(inCombatLike&&this.settings.showCombatMinibar&&!(((_a=this.openPage)===null||_a===void 0?void 0:_a.id)==="melvorD:Combat"&&!this.settings.showCombatMinibarCombat)){showElement(minibar);}
else{hideElement(minibar);}
this.renderQueue.combatMinibar=false;}
renderActiveSkills(){if(!this.renderQueue.activeSkills)
return;skillNav.setAllInactive();if(this.activeAction!==undefined){this.activeAction.activeSkills.forEach((skill)=>{skillNav.setActive(skill);});}
this.renderQueue.activeSkills=false;}
loop(){if(!this.isGolbinRaid)
this.tickTimestamp=new Date().getTime();try{this.processTime();}
catch(e){this.stopMainLoop();this.showBrokenGame(e,'An error occurred while processing ticks:');console.error(e);throw new Error(`An error occurred while processing ticks: ${e}.`);}
if(this.enableRendering){try{this.render();}
catch(e){this.stopMainLoop();this.showBrokenGame(e,'An error occurred while rendering:');console.error(e);throw new Error(`An error occurred while rendering: ${e}.`);}}}
getErrorLog(error,title){var _a,_b;let errorBody='Could not parse error';if(error instanceof Error){const stackTrace=(_a=error.stack)!==null&&_a!==void 0?_a:'Stack not available';errorBody=`Error Name: ${error.name}
Error Message: ${error.message}
Stack Trace:
${stackTrace}`;}
else if(typeof error==='string'){errorBody=error;}
let equipmentText='Current Equipment:\n';let equipmentToLog;if(this.isGolbinRaid){equipmentToLog=this.golbinRaid.player.equipment;}
else{equipmentToLog=this.combat.player.equipment;}
equipmentToLog.slotArray.forEach((slot)=>{if(slot.providesStats)
equipmentText+=`${slot.type}: ${slot.item.id}\n`;});let activeSkillLog='No Active Action Information\n';if(this.activeAction!==undefined){activeSkillLog='Action Information:\n';activeSkillLog+=this.activeAction.getErrorLog();}
let moddingLog='Modding Disabled';if(mod.manager.isEnabled()){moddingLog='Modding Enabled. Loaded mods:\n';moddingLog+=mod.manager.getLoadedModList().join('\n');}
const errorMessage=`${title}
Active Action: ${(_b=this.activeAction)===null||_b===void 0?void 0:_b.id}
${errorBody}
${equipmentText}
${activeSkillLog}
${moddingLog}`;return errorMessage;}
showBrokenGame(error,title){$('#ticks-broke-error-msg').val(this.getErrorLog(error,title));$('#ticks-broke-error-title').text(title);const mods=mod.getModsFromError(error);if(mods.length===0){$('#ticks-broke-dev').text('Maybe you should let the dev know about this error. Please copy the entire contents of this error message when reporting:');}
else{$('#ticks-broke-text').html(`<strong>Error due to Mods:</strong><br>${mods.map(({name,version})=>`${name}: v${version}`).join('<br>')}`);$('#ticks-broke-dev').text(`Please report this error to the mod developer(s):`);}
$('#modal-ticks-broke').modal('show');}
clearActiveAction(save=true){if(!this.disableClearOffline){firstSkillAction=true;this.activeAction=undefined;if(save)
saveData('all');deleteScheduledPushNotification('offlineSkill');}}
getOfflineTimeDiff(){const currentTime=Date.now();const originalTimeDiff=currentTime-this.tickTimestamp;const timeDiff=Math.min(originalTimeDiff,86400000);return{timeDiff,originalTimeDiff};}
processOffline(){if(DEBUGENABLED&&this.activeAction===this.combat)
this.combat.compareStatsWithSavedStats();return new Promise((resolve,reject)=>{var _a,_b;if(this.activeAction===this.combat&&(!this.settings.enableOfflineCombat||(this.combat.selectedArea instanceof SlayerArea&&!this.slayer.isUnlocked))){this.combat.stop();resolve();return;}
if(this.activeAction===this.thieving&&!this.thieving.isUnlocked){this.thieving.stop();resolve();return;}
if(this.isGolbinRaid){resolve();return;}
this.resetOfflineTracking();let welcomeBackModal;const hasOfflineAction=this.activeAction!==undefined;loadingOfflineProgress=true;if(hasOfflineAction){const modalID=offlineModalID;offlineModalID++;const html=`<div id="offline-modal-${modalID}" style="height:auto;"><small><div class="spinner-border spinner-border-sm text-primary mr-2" id="offline-progress-spinner" role="status"></div>${getLangString('MENU_TEXT','LOADING_OFFLINE_PROGRESS')}</small></div>`;welcomeBackModal={alertOptions:{title:getLangString('MISC_STRING','3'),html,imageUrl:(_b=(_a=this.activeAction)===null||_a===void 0?void 0:_a.media)!==null&&_b!==void 0?_b:cdnMedia("assets/media/main/question.svg"),imageWidth:64,imageHeight:64,imageAlt:getLangString('CHARACTER_SELECT','88'),allowOutsideClick:false,},id:modalID,};addModalToQueue(welcomeBackModal.alertOptions);}
setTimeout(()=>{var _a;const snapShot=this.snapShotOffline();const{timeDiff}=this.getOfflineTimeDiff();let offlineMessage;try{this.runTicks(Math.floor(timeDiff/TICK_INTERVAL));offlineMessage=this.createOfflineModal(snapShot,timeDiff);}
catch(e){const messageDoc=new DocumentFragment();messageDoc.append(getTemplateNode('broken-offline-template'));const messageArea=getElementFromFragment(messageDoc,'broken-offline-template-message','textarea');messageArea.value=this.getErrorLog(e,'An error occured while processing ticks offline:');const devText=getElementFromFragment(messageDoc,'dev-text','h5');const modText=getElementFromFragment(messageDoc,'mod-text','h5');const mods=mod.getModsFromError(e);if(mods.length===0){devText.textContent=`Please let the dev know of this error. Please copy the entire contents of the error message when reporting it:`;hideElement(modText);}
else{devText.textContent=`Please report this error to the mod developer(s):`;showElement(modText);modText.innerHTML=`<strong>Error due to Mods:</strong><br>${mods.map(({name,version})=>`${name}: v${version}`).join('<br>')}`;}
offlineMessage=messageDoc;(_a=this.activeAction)===null||_a===void 0?void 0:_a.stop();}
this.tickTimestamp=Date.now();if(this.combat.giveFreeDeath){window.setTimeout(()=>{this.combat.giveFreeDeath=false;},60*1000);}
this.combat.notifications.clear();if(welcomeBackModal!==undefined){const modalInDOM=document.getElementById(`offline-modal-${welcomeBackModal.id}`);if(modalInDOM!==null){if(typeof offlineMessage==='string')
modalInDOM.innerHTML=offlineMessage;else{modalInDOM.textContent='';modalInDOM.append(offlineMessage);}}
else{const offlineDiv=createElement('div',{id:`offline-modal-${welcomeBackModal.id}`,attributes:[['style','height:auto;']],});if(typeof offlineMessage==='string'){offlineDiv.innerHTML=offlineMessage;}
else{offlineDiv.append(offlineMessage);}
welcomeBackModal.alertOptions.html=offlineDiv;}}
loadingOfflineProgress=false;resolve();},0);});}
snapShotOffline(){const monsterKills=new Map();this.monsters.forEach((monster)=>monsterKills.set(monster,this.stats.monsterKillCount(monster)));const experience=new Map();const levels=new Map();this.skills.forEach((skill)=>{experience.set(skill,skill.xp);levels.set(skill,skill.level);});const snapshot={gp:this.gp.amount,slayercoins:this.slayerCoins.amount,prayerPoints:this.combat.player.prayerPoints,experience,levels,food:this.combat.player.food.slots.map((food)=>{return{item:food.item,quantity:food.quantity};}),equipment:this.combat.player.equipment.getSnapshot(),bank:this.bank.getSnapShot(),loot:this.combat.loot.getSnapshot(),monsterKills,dungeonCompletion:this.combat.getDungeonCompletionSnapshot(),taskCompletions:[...this.combat.slayerTask.completion],summoningMarks:this.summoning.getMarkSnapshot(),itemCharges:this.itemCharges.getSnapShot(),cookingStockpile:this.cooking.getStockpileSnapshot(),meteorite:this.stats.meteoriteSnapshot(),onyxNode:this.stats.onyxSnapshot(),orichaNode:this.stats.orichaSnapshot(),ceruleanNode:this.stats.ceruleanSnapshot(),};return snapshot;}
createOfflineModal(oldSnapshot,timeDiff){const newSnapshot=this.snapShotOffline();const lostLoot=this.combat.loot.lostLoot;const lostItems=this.combat.bank.lostItems;const seconds=timeDiff/1000;const minutes=seconds/60;const hours=minutes/60;let timeUnit='second';let timeAmount=Math.floor(seconds);if(hours>1){timeAmount=Math.floor(hours);timeUnit='hour';}
else if(minutes>1){timeAmount=Math.floor(minutes);timeUnit='minute';}
let timeText=`${timeAmount} ${timeUnit}${pluralS(timeAmount)}`;timeText+=`<br><small class="text-danger">${getLangString('MENU_TEXT','MAX_OFFLINE_TIME')}</small>`;const gpDiff=newSnapshot.gp-oldSnapshot.gp;const scDiff=newSnapshot.slayercoins-oldSnapshot.slayercoins;const ppDiff=newSnapshot.prayerPoints-oldSnapshot.prayerPoints;const xpGain=new Map();const levelGain=new Map();newSnapshot.experience.forEach((xp,skill)=>{var _a;const xpDiff=Math.floor(xp-((_a=oldSnapshot.experience.get(skill))!==null&&_a!==void 0?_a:0));if(xpDiff>0)
xpGain.set(skill,xpDiff);});newSnapshot.levels.forEach((level,skill)=>{var _a;const levelDiff=level-((_a=oldSnapshot.levels.get(skill))!==null&&_a!==void 0?_a:0);if(levelDiff>0)
levelGain.set(skill,levelDiff);});const itemsGained=new Map();const itemsUsed=new Map();const monstersKilled=new Map();newSnapshot.monsterKills.forEach((kills,monster)=>{var _a;const newKills=kills-((_a=oldSnapshot.monsterKills.get(monster))!==null&&_a!==void 0?_a:0);if(newKills>0)
monstersKilled.set(monster,newKills);});const dungeonsCompleted=new Map();newSnapshot.dungeonCompletion.forEach((completions,dungeon)=>{var _a;const newComps=completions-((_a=oldSnapshot.dungeonCompletion.get(dungeon))!==null&&_a!==void 0?_a:0);if(newComps>0)
dungeonsCompleted.set(dungeon,newComps);});const tasksCompleted=newSnapshot.taskCompletions.map((newCount,tier)=>newCount-oldSnapshot.taskCompletions[tier]);const marksFound=new Map();newSnapshot.summoningMarks.forEach((newCount,mark)=>{var _a;const oldCount=(_a=oldSnapshot.summoningMarks.get(mark))!==null&&_a!==void 0?_a:0;if(oldCount!==newCount)
marksFound.set(mark,newCount-oldCount);});const itemChargesUsed=[];oldSnapshot.itemCharges.forEach((quantity,item)=>{var _a;quantity-=(_a=newSnapshot.itemCharges.get(item))!==null&&_a!==void 0?_a:0;if(quantity>0)
itemChargesUsed.push({item,quantity,});});const stockPileItemsGained=[];newSnapshot.cookingStockpile.forEach(({item,quantity},category)=>{const oldItems=oldSnapshot.cookingStockpile.get(category);if(oldItems!==undefined){quantity-=oldItems.quantity;}
if(quantity>0)
stockPileItemsGained.push({item,quantity});});this.items.forEach((item)=>{var _a,_b;const qtyDiff=((_a=newSnapshot.bank.get(item))!==null&&_a!==void 0?_a:0)-((_b=oldSnapshot.bank.get(item))!==null&&_b!==void 0?_b:0);if(qtyDiff>0){itemsGained.set(item,qtyDiff);}
else if(qtyDiff<0){itemsUsed.set(item,qtyDiff);}});const foodEaten=[];oldSnapshot.food.forEach(({item,quantity},i)=>{var _a;const qtyDiff=quantity-newSnapshot.food[i].quantity;if(qtyDiff>0)
foodEaten.push({item,quantity:qtyDiff});else if(qtyDiff<0){item=newSnapshot.food[i].item;itemsGained.set(item,((_a=itemsGained.get(item))!==null&&_a!==void 0?_a:0)-qtyDiff);}});const getNodeDiff=(oldNode,newNode)=>{return{totalFound:newNode.totalFound-oldNode.totalFound,hpFound:newNode.hpFound-oldNode.hpFound,};};const meteorite=getNodeDiff(oldSnapshot.meteorite,newSnapshot.meteorite);const onyxNode=getNodeDiff(oldSnapshot.onyxNode,newSnapshot.onyxNode);const orichaNode=getNodeDiff(oldSnapshot.orichaNode,newSnapshot.orichaNode);const ceruleanNode=getNodeDiff(oldSnapshot.ceruleanNode,newSnapshot.ceruleanNode);const image=(media)=>`<img class="skill-icon-xs" src="${media}">`;const posSpan=(text)=>`<span class='text-success'>${text}</span>`;const negSpan=(text)=>`<span class='text-danger'>${text}</span>`;const currencyDiff=(diff,name,media)=>{if(diff>0){return templateLangString('MENU_TEXT',`CURRENCY_GAIN_${name}`,{curIcon:image(media),count:posSpan(numberWithCommas(diff)),});}
else{return templateLangString('MENU_TEXT',`CURRENCY_LOSS_${name}`,{curIcon:image(media),count:negSpan(numberWithCommas(-diff)),});}};const outputHeaders=[];xpGain.forEach((xpGain,skill)=>{outputHeaders.push(templateString(getLangString('MISC_STRING','6'),{qty:posSpan(numberWithCommas(xpGain)),skillName:skill.name,}));});levelGain.forEach((levelGain,skill)=>{var _a,_b;const templateData={skillName:skill.name,count:`${levelGain}`,oldLevel:`${(_a=oldSnapshot.levels.get(skill))!==null&&_a!==void 0?_a:1}`,newLevel:`${(_b=newSnapshot.levels.get(skill))!==null&&_b!==void 0?_b:1}`,};outputHeaders.push(templateLangString('MENU_TEXT',levelGain===1?'LEVELED_UP_SKILL_ONCE':'LEVELED_UP_SKILL_TIMES',templateData));});monstersKilled.forEach((killDiff,monster)=>{if(killDiff>0){outputHeaders.push(templateLangString('MENU_TEXT','YOU_KILLED_MONSTER',{count:`${killDiff}`,monsterImage:image(monster.media),monsterName:monster.name,}));}});dungeonsCompleted.forEach((countDiff,dungeon)=>{if(countDiff>0){outputHeaders.push(templateLangString('MENU_TEXT',countDiff===1?'COMPLETED_DUNGEON_ONCE':'COMPLETED_DUNGEON_TIMES',{dungeonImage:image(dungeon.media),dungeonName:dungeon.name,count:`${countDiff}`,}));}});tasksCompleted.forEach((taskCount,tier)=>{if(taskCount>0){outputHeaders.push(templateLangString('MENU_TEXT',`COMPLETED_SLAYER_TASK_${tier}`,{count:`${taskCount}`}));}});marksFound.forEach((markCount,mark)=>{if(markCount>0){outputHeaders.push(templateLangString('MENU_TEXT','YOU_FOUND_MARK',{count:posSpan(`${markCount}`),markImage:image(this.summoning.getMarkImage(mark)),markName:this.summoning.getMarkName(mark),}));}});let itemGPValue=0;itemsGained.forEach((qty,item)=>{outputHeaders.push(templateLangString('MENU_TEXT','YOU_GAINED_ITEM',{count:posSpan(numberWithCommas(qty)),itemImage:image(item.media),itemName:item.name,}));itemGPValue+=qty*item.sellsFor;});stockPileItemsGained.forEach(({quantity,item})=>{outputHeaders.push(`${templateLangString('MENU_TEXT','YOU_GAINED_ITEM',{count:posSpan(numberWithCommas(quantity)),itemImage:image(item.media),itemName:item.name,})}<span class="text-warning">${getLangString('MENU_TEXT','IN_STOCKPILE')}</span>`);itemGPValue+=quantity*item.sellsFor;});if(DEBUGENABLED)
outputHeaders.push(`Total Item Value: ${numberWithCommas(itemGPValue)} GP`);newSnapshot.loot.forEach((qty,item)=>{outputHeaders.push(templateLangString('MENU_TEXT','YOU_HAVE_ITEM_LOOT',{count:posSpan(numberWithCommas(qty)),itemImage:image(item.media),itemName:item.name,}));});lostLoot.forEach((qty,item)=>{outputHeaders.push(templateLangString('MENU_TEXT','LOST_ITEM_LOOT',{count:posSpan(numberWithCommas(qty)),itemImage:image(item.media),itemName:item.name,}));});lostItems.forEach((qty,item)=>{outputHeaders.push(templateLangString('MENU_TEXT','LOST_ITEM_BANK',{count:posSpan(numberWithCommas(qty)),itemImage:image(item.media),itemName:item.name,}));});if(gpDiff!==0){outputHeaders.push(currencyDiff(gpDiff,'GP',`${CDNDIR}assets/media/main/coins.svg`));}
if(scDiff!==0){outputHeaders.push(currencyDiff(scDiff,'SC',`${CDNDIR}assets/media/main/slayer_coins.svg`));}
if(ppDiff!==0){outputHeaders.push(currencyDiff(ppDiff,'PP',`${CDNDIR}assets/media/skills/prayer/prayer.svg`));}
itemsUsed.forEach((qty,item)=>{outputHeaders.push(templateLangString('MENU_TEXT','ITEM_USAGE',{count:negSpan(numberWithCommas(-qty)),itemImage:image(item.media),itemName:item.name,}));});oldSnapshot.equipment.forEach((oldQuantity,slot)=>{const newQuantity=newSnapshot.equipment.get(slot);if(newQuantity===undefined||oldQuantity.item===this.emptyEquipmentItem)
return;const quantityUsed=newQuantity.item===this.emptyEquipmentItem?oldQuantity.quantity:oldQuantity.quantity-newQuantity.quantity;if(quantityUsed<=0)
return;outputHeaders.push(templateLangString('MENU_TEXT','ITEM_USAGE',{count:negSpan(numberWithCommas(quantityUsed)),itemImage:image(oldQuantity.item.media),itemName:oldQuantity.item.name,}));});foodEaten.forEach(({quantity,item})=>{outputHeaders.push(templateLangString('MENU_TEXT','FOOD_EATEN',{count:negSpan(numberWithCommas(quantity)),itemImage:image(item.media),itemName:item.name,}));});itemChargesUsed.forEach(({item,quantity})=>{if(quantity>0)
outputHeaders.push(templateLangString('MENU_TEXT','GLOVE_CHARGE_USAGE',{count:negSpan(numberWithCommas(quantity)),itemImage:image(item.media),itemName:item.name,}));});const addMiningNodeHeader=(nodeDiff,singular,plural,media)=>{if(nodeDiff.totalFound>0){outputHeaders.push(templateLangString('MENU_TEXT',nodeDiff.totalFound===1?singular:plural,{qty1:`${numberWithCommas(nodeDiff.totalFound)}`,qty2:`${numberWithCommas(nodeDiff.hpFound)}`,itemImage:image(cdnMedia(media)),}));}};addMiningNodeHeader(meteorite,'METEORITES_FOUND_ONE','METEORITES_FOUND_MANY','assets/media/skills/astrology/meteorite.svg');addMiningNodeHeader(onyxNode,'ONYX_FOUND_ONE','ONYX_FOUND_MANY',"assets/media/bank/onyx.png");addMiningNodeHeader(orichaNode,'ORICHA_FOUND_ONE','ORICHA_FOUND_MANY',"assets/media/bank/oricha.png");addMiningNodeHeader(ceruleanNode,'CERULEAN_FOUND_ONE','CERULEAN_FOUND_MANY',"assets/media/bank/cerulean.png");let html=`<h5 class='font-w400'>${templateString(getLangString('MISC_STRING','4'),{timeAway:formatAsTimePeriod(timeDiff),})}<br><small class="text-info">${getLangString('MENU_TEXT','MAX_OFFLINE_TIME')}</small></h5>
    <h5 class='font-w400 font-size-sm mb-1'><lang-string lang-cat="MISC_STRING" lang-id="5"></h5>`;html+=`<h5 class='font-w600 mb-1'>${outputHeaders.join(`</h5><h5 class='font-w600 mb-1'>`)}</h5>`;return html;}
resetOfflineTracking(){this.combat.resetOfflineTracking();}
testForOffline(timeToGoBack){return __awaiter(this,void 0,void 0,function*(){this.stopMainLoop();this.tickTimestamp-=timeToGoBack*60*60*1000;saveData('all');yield this.processOffline();this.startMainLoop();});}
testCombatInitializationStatParity(){this.combat.saveStats();this.combat.initialize();this.combat.compareStatsWithSavedStats();}
generateSaveString(){this.saveTimestamp=Date.now();const writer=new SaveWriter('Write',512);this.encode(writer);return writer.getSaveString(this.getSaveHeader());}
getHeaderFromSaveString(saveString){var _a;return __awaiter(this,void 0,void 0,function*(){try{const reader=new SaveWriter('Read',1);const header=reader.getHeaderFromSaveString(saveString,this);if(header.saveVersion>currentSaveVersion)
return 2;else
return header;}
catch(e){if(e instanceof Error&&e.message==='String is not save.'){try{const idMap=yield getNumericIDMap();const{saveGame}=getSaveFromString(saveString,idMap);const gamemodeID=idMap.gameModes[saveGame.currentGamemode];if(gamemodeID===undefined)
throw new Error(`No Gamemode maps to: ${saveGame.currentGamemode}`);let currentGamemode=this.gamemodes.getObjectByID(gamemodeID);if(currentGamemode===undefined){currentGamemode=new DummyGamemode(this.getDummyData(gamemodeID),this);}
let offlineAction=undefined;if(saveGame.offline.skill!==null){offlineAction=this.activeActions.getObjectByID(idMap.offlineSkillToAction[saveGame.offline.skill]);}
const header={saveVersion:saveGame.version,characterName:saveGame.username,currentGamemode,totalSkillLevel:arrSum(saveGame.skillLevel),gp:saveGame.gp,offlineAction,tickTimestamp:(_a=saveGame.offline.timestamp)!==null&&_a!==void 0?_a:0,saveTimestamp:saveGame.saveTimestamp,activeNamespaces:[],};if(header.saveVersion>currentSaveVersion)
return 2;else
return header;}
catch(_b){console.error(e);return 1;}}
else{console.error(e);return 1;}}});}
getSaveHeader(){let offlineAction=this.activeAction;if(offlineAction===undefined)
offlineAction=this.pausedAction;const activeNamespaces=[];this.registeredNamespaces.forEach((namespace)=>{if(!namespace.isModded)
activeNamespaces.push(namespace.name);});return{saveVersion:currentSaveVersion,characterName:this.characterName,currentGamemode:this.currentGamemode,totalSkillLevel:this.completion.skillProgress.currentCount.getCompValue("melvorTrue"),gp:this.gp.amount,offlineAction,tickTimestamp:this.tickTimestamp,saveTimestamp:this.saveTimestamp,activeNamespaces,};}
encode(writer){writer.writeFloat64(this.tickTimestamp);writer.writeFloat64(this.saveTimestamp);writer.writeBoolean(this.activeAction!==undefined);if(this.activeAction!==undefined)
writer.writeNamespacedObject(this.activeAction);writer.writeBoolean(this.pausedAction!==undefined);if(this.pausedAction!==undefined)
writer.writeNamespacedObject(this.pausedAction);writer.writeBoolean(this._isPaused);writer.writeBoolean(this.merchantsPermitRead);writer.writeNamespacedObject(this.currentGamemode);writer.writeString(this.characterName);this.bank.encode(writer);this.combat.encode(writer);this.golbinRaid.encode(writer);this.minibar.encode(writer);this.petManager.encode(writer);this.shop.encode(writer);this.itemCharges.encode(writer);this.tutorial.encode(writer);this.potions.encode(writer);this.stats.encode(writer);this.settings.encode(writer);this.gp.encode(writer);this.slayerCoins.encode(writer);this.raidCoins.encode(writer);writer.writeArray(this.readNewsIDs,(newsID,writer)=>{writer.writeString(newsID);});writer.writeString(this.lastLoadedGameVersion);nativeManager.encode(writer);writer.writeUint32(this.skills.size);this.skills.forEach((skill)=>{writer.writeNamespacedObject(skill);writer.startMarkingWriteRegion();skill.encode(writer);writer.stopMarkingWriteRegion();});mod.encode(writer);this.completion.encode(writer);return writer;}
decode(reader,version){let resetPaused=false;this.tickTimestamp=reader.getFloat64();this.saveTimestamp=reader.getFloat64();if(reader.getBoolean()){const activeAction=reader.getNamespacedObject(this.activeActions);if(typeof activeAction!=='string')
this.activeAction=activeAction;}
if(reader.getBoolean()){const pausedAction=reader.getNamespacedObject(this.activeActions);if(typeof pausedAction==='string')
resetPaused=true;else
this.pausedAction=pausedAction;}
this._isPaused=reader.getBoolean();this.merchantsPermitRead=reader.getBoolean();const gamemode=reader.getNamespacedObject(this.gamemodes);if(typeof gamemode==='string')
throw new Error('Error loading save. Gamemode is not registered.');this.currentGamemode=gamemode;this.characterName=reader.getString();this.bank.decode(reader,version);this.combat.decode(reader,version);this.golbinRaid.decode(reader,version);this.minibar.decode(reader,version);this.petManager.decode(reader,version);this.shop.decode(reader,version);this.itemCharges.decode(reader,version);this.tutorial.decode(reader,version);this.potions.decode(reader,version);this.stats.decode(reader,version);this.settings.decode(reader,version);this.gp.decode(reader,version);this.slayerCoins.decode(reader,version);this.raidCoins.decode(reader,version);this.readNewsIDs=reader.getArray((reader)=>reader.getString());this.lastLoadedGameVersion=reader.getString();nativeManager.decode(reader,version);const numSkills=reader.getUint32();for(let i=0;i<numSkills;i++){const skill=reader.getNamespacedObject(this.skills);const skillDataSize=reader.getUint32();if(typeof skill==='string')
reader.getFixedLengthBuffer(skillDataSize);else
skill.decode(reader,version);}
mod.decode(reader,version);if(version>=26)
this.completion.decode(reader,version);if(resetPaused){if(!this.isGolbinRaid)
this._isPaused=false;}}
deserialize(reader,version,idMap){this.combat.deserialize(reader.getVariableLengthChunk(),version,idMap);this.thieving.deserialize(reader.getVariableLengthChunk(),version,idMap);const oldActiveAction=idMap.activeActions[reader.getNumber()];if(oldActiveAction!==undefined){const action=this.activeActions.getObjectByID(oldActiveAction);if(action!==undefined)
this.activeAction=action;}
const oldPausedAction=idMap.activeActions[reader.getNumber()];if(oldPausedAction!==undefined){const action=this.activeActions.getObjectByID(oldPausedAction);if(action!==undefined)
this.pausedAction=action;}
this.merchantsPermitRead=reader.getBool();if(version>=9){this.stats.deserialize(reader.getVariableLengthChunk(),version,idMap);this.firemaking.deserialize(reader.getVariableLengthChunk(),version,idMap);}
if(version>=10){this.mining.deserialize(reader.getVariableLengthChunk(),version,idMap);}
if(version>=12){this.golbinRaid.deserialize(reader.getVariableLengthChunk(),version,idMap);this._isPaused=reader.getBool();this.woodcutting.deserialize(reader.getVariableLengthChunk(),version,idMap);this.herblore.deserialize(reader.getVariableLengthChunk(),version,idMap);}
if(version>=13){this.smithing.deserialize(reader.getVariableLengthChunk(),version,idMap);this.altMagic.deserialize(reader.getVariableLengthChunk(),version,idMap);}
if(version>=16){this.runecrafting.deserialize(reader.getVariableLengthChunk(),version,idMap);this.crafting.deserialize(reader.getVariableLengthChunk(),version,idMap);this.fletching.deserialize(reader.getVariableLengthChunk(),version,idMap);this.summoning.deserialize(reader.getVariableLengthChunk(),version,idMap);this.fishing.deserialize(reader.getVariableLengthChunk(),version,idMap);this.cooking.deserialize(reader.getVariableLengthChunk(),version,idMap);}
if(version>=17){this.agility.deserialize(reader.getVariableLengthChunk(),version,idMap);this.astrology.deserialize(reader.getVariableLengthChunk(),version,idMap);}
if(version>=18){this.astrology.shouldRefundStardust=!reader.getBool();}
if(version>=20){this.township.deserialize(reader.getVariableLengthChunk(),version,idMap);}
if(!this._isPaused&&this.activeAction===this.golbinRaid){this.activeAction=this.pausedAction;}}
getLootTableWeight(table){let totalWeight=this.dropWeightCache.get(table);if(totalWeight===undefined){totalWeight=table.reduce((prev,loot)=>prev+loot[1],0);this.dropWeightCache.set(table,totalWeight);}
return totalWeight;}
getItemFromLootTable(table){const dropRoll=Math.floor(Math.random()*this.getLootTableWeight(table));let itemWeight=0;const lootIndex=table.findIndex((loot)=>{itemWeight+=loot[1];return dropRoll<itemWeight;});const itemID=table[lootIndex][0];const qty=rollInteger(1,table[lootIndex][2]);return{itemID,qty};}
getSkillUnlockCount(){if(this.currentGamemode.startingSkills===undefined)
return 0;const startingCount=this.currentGamemode.startingSkills.size;const currentlyUnlocked=this.skills.reduce((prev,skill)=>{if(skill.isUnlocked)
prev++;return prev;},0);return currentlyUnlocked-startingCount;}
getSkillUnlockCost(){if(!this.currentGamemode.allowSkillUnlock)
return 0;let costIndex=this.getSkillUnlockCount();costIndex=Math.min(costIndex,this.currentGamemode.skillUnlockCost.length-1);return this.currentGamemode.skillUnlockCost[costIndex];}
checkSkillRequirement(requirement,notifyOnFailure=false){if(!requirement.skill.isUnlocked){if(notifyOnFailure)
lockedSkillAlert(requirement.skill,'SKILL_UNLOCK_DO_THAT');return false;}
else{const met=requirement.skill.level>=requirement.level;if(!met&&notifyOnFailure)
notifyPlayer(requirement.skill,templateLangString('TOASTS','SKILL_LEVEL_REQUIRED',{level:`${requirement.level}`,skillName:requirement.skill.name,}),'danger');return met;}}
checkAllSkillLevelRequirement(requirement,notifyOnFailure=false){const met=this.skills.every((skill)=>skill.level>=requirement.level||(requirement.exceptions!==undefined&&requirement.exceptions.has(skill)));if(!met&&notifyOnFailure){imageNotify(cdnMedia('assets/media/main/milestones_header.svg'),templateLangString('TOASTS','ALL_SKILL_LEVEL_REQUIRED',{level:`${requirement.level}`}),'danger');}
return met;}
checkDungeonRequirement(requirement,notifyOnFailure=false){const met=this.combat.getDungeonCompleteCount(requirement.dungeon)>=requirement.count;let countText;if(requirement.count>1){countText=`${requirement.count} times`;}
else{countText='once';}
if(!met&&notifyOnFailure){const templateData={dungeonName:requirement.dungeon.name,count:`${requirement.count}`,};if(requirement.count>1){notifyPlayer(this.attack,templateLangString('TOASTS','DUNGEON_COMPLETION_REEQUIRED_MULTIPLE',templateData));}
else{notifyPlayer(this.attack,templateLangString('TOASTS','DUNGEON_COMPLETION_REQUIRED_ONCE',templateData));}}
return met;}
checkCompletionRequirement(requirement,notifyOnFailure=false){const met=this.completion.totalProgressMap.get(requirement.namespace.name)>=requirement.percent;if(!met&&notifyOnFailure){const langID=requirement.namespace.isModded?'COMPLETION_PERCENT_REQUIRED_MOD':`COMPLETION_PERCENT_REQUIRED_${requirement.namespace.name}`;notifyPlayer(this.attack,templateLangString('TOASTS',langID,{percent:`${requirement.percent}`,modName:`${requirement.namespace.displayName}`,}),'danger');}
return met;}
checkSlayerItemRequirement(requirement,notifyOnFailure=false,slayerLevelReq=0){const met=this.modifiers.bypassAllSlayerItems>0||(slayerLevelReq<100&&this.modifiers.bypassSlayerItems>0)||this.combat.player.equipment.checkForItem(requirement.item);if(!met&&notifyOnFailure)
notifyPlayer(this.attack,templateLangString('TOASTS','ITEM_EQUIPPED_REQUIRED',{itemName:requirement.item.name}),'danger');return met;}
checkShopPurchaseRequirement(requirement,notifyOnFailure=false){const met=this.shop.getPurchaseCount(requirement.purchase)>=requirement.count;if(!met&&notifyOnFailure)
notifyPlayer(this.attack,templateLangString('TOASTS','SHOP_PURCHASE_REQUIRED',{purchaseName:requirement.purchase.name,}),'danger');return met;}
checkSlayerTaskRequirement(requirement,notifyOnFailure=false){const met=this.combat.slayerTask.getTaskCompletionsForTierAndAbove(requirement.tier)>=requirement.count;if(!met&&notifyOnFailure){imageNotify(this.slayer.media,templateLangString('TOASTS',`SLAYER_TASK_REQUIRED_${SlayerTask.data[requirement.tier].engDisplay}`,{count:`${requirement.count}`,}),'danger');}
return met;}
checkItemFoundRequirement(requirement,notifyOnFailure=false){const met=this.stats.itemFindCount(requirement.item)>0;if(!met&&notifyOnFailure){imageNotify(requirement.item.media,templateLangString('TOASTS','ITEM_FOUND_REQUIRED',{itemName:requirement.item.name}),'danger');}
return met;}
checkMonsterKilledRequirement(requirement,notifyOnFailure=false){const met=this.stats.monsterKillCount(requirement.monster)>=requirement.count;if(!met&&notifyOnFailure){imageNotify(requirement.monster.media,templateLangString('TOASTS',requirement.count>1?'MONSTER_KILLS_REQUIRED':'MONSTER_KILLED_REQUIRED',{monsterName:requirement.monster.name,count:`${requirement.count}`,}),'danger');}
return met;}
checkTownshipTaskRequirement(requirement,notifyOnFailure=false){const met=this.township.tasks.tasksCompleted>=requirement.count;const tasksLeft=0;if(!met&&notifyOnFailure){imageNotify(this.township.media,`You must complete ${tasksLeft} more Township Getting Started tasks to do that!`,'danger');}
return met;}
checkTownshipTutorialTaskRequirement(requirement,notifyOnFailure=false){const met=this.township.tasks.tutorialTasksCompleted>=requirement.count;const tasksLeft=0;if(!met&&notifyOnFailure){imageNotify(this.township.media,`You must complete ${tasksLeft} more Township tasks to do that!`,'danger');}
return met;}
checkTownshipBuildingRequirement(requirement,notifyOnFailure=false){const buildCount=this.township.countNumberOfBuildings(requirement.building);const met=buildCount>=requirement.count;if(!met&&notifyOnFailure){const buildingsLeft=requirement.count-buildCount;imageNotify(requirement.building.media,`You must build ${buildingsLeft} more ${requirement.building.name} to do that!`,'danger');}
return met;}
checkRequirement(requirement,notifyOnFailure=false,slayerLevelReq=0){switch(requirement.type){case 'SkillLevel':return this.checkSkillRequirement(requirement,notifyOnFailure);case 'AllSkillLevels':return this.checkAllSkillLevelRequirement(requirement,notifyOnFailure);case 'DungeonCompletion':return this.checkDungeonRequirement(requirement,notifyOnFailure);case 'Completion':return this.checkCompletionRequirement(requirement,notifyOnFailure);case 'SlayerItem':return this.checkSlayerItemRequirement(requirement,notifyOnFailure,slayerLevelReq);case 'ShopPurchase':return this.checkShopPurchaseRequirement(requirement,notifyOnFailure);case 'SlayerTask':return this.checkSlayerTaskRequirement(requirement,notifyOnFailure);case 'ItemFound':return this.checkItemFoundRequirement(requirement,notifyOnFailure);case 'MonsterKilled':return this.checkMonsterKilledRequirement(requirement,notifyOnFailure);case 'TownshipTask':return this.checkTownshipTaskRequirement(requirement,notifyOnFailure);case 'TownshipTutorialTask':return this.checkTownshipTutorialTaskRequirement(requirement,notifyOnFailure);case 'TownshipBuilding':return this.checkTownshipBuildingRequirement(requirement,notifyOnFailure);}}
checkRequirements(requirements,notifyOnFailure=false,slayerLevelReq=0){return requirements.every((requirement)=>this.checkRequirement(requirement,notifyOnFailure,slayerLevelReq));}
isItemOwned(item){return(this.bank.hasItem(item)||(item instanceof EquipmentItem&&this.combat.player.checkEquipmentSetsForItem(item)));}
getMonsterArea(monster){let area=this.monsterAreas.get(monster);if(area===undefined)
area=this.unknownCombatArea;return area;}
getPageForAction(action){return this.actionPageMap.get(action);}
getPageForActiveAction(){if(this.activeAction!==undefined){const page=this.actionPageMap.get(this.activeAction);if(page!==undefined)
return page;}
else if(this.farming.isAnyPlotGrown){const pages=this.getPagesForSkill(this.farming);if(pages!==undefined)
return pages[0];}
const page=this.pages.getObjectByID("melvorD:Bank");if(page===undefined)
throw new Error(`Error, Bank page not registered.`);return page;}
getPagesForSkill(skill){return this.skillPageMap.get(skill);}
constructEventMatcher(data){switch(data.type){case 'WoodcuttingAction':return new WoodcuttingActionEventMatcher(data,this);case 'FishingAction':return new FishingActionEventMatcher(data,this);case 'FiremakingAction':return new FiremakingActionEventMatcher(data,this);case 'BonfireLit':return new BonfireLitEventMatcher(data,this);case 'CookingAction':return new CookingActionEventMatcher(data,this);case 'MiningAction':return new MiningActionEventMatcher(data,this);case 'SmithingAction':return new SmithingActionEventMatcher(data,this);case 'ThievingAction':return new ThievingActionEventMatcher(data,this);case 'FarmingPlantAction':return new FarmingPlantActionEventMatcher(data,this);case 'FarmingHarvestAction':return new FarmingHarvestActionEventMatcher(data,this);case 'FletchingAction':return new FletchingActionEventMatcher(data,this);case 'CraftingAction':return new CraftingActionEventMatcher(data,this);case 'RunecraftingAction':return new RunecraftingActionEventMatcher(data,this);case 'HerbloreAction':return new HerbloreActionEventMatcher(data,this);case 'AgilityAction':return new AgilityActionEventMatcher(data,this);case 'SummoningAction':return new SummoningActionEventMatcher(data,this);case 'AstrologyAction':return new AstrologyActionEventMatcher(data,this);case 'AltMagicAction':return new AltMagicActionEventMatcher(data,this);case 'MonsterDrop':return new MonsterDropEventMatcher(data);case 'PlayerAttack':return new PlayerAttackEventMatcher(data);case 'EnemyAttack':return new EnemyAttackEventMatcher(data);case 'FoodEaten':return new FoodEatenEventMatcher(data);case 'PrayerPointConsumption':return new PrayerPointConsumptionEventMatcher(data);case 'PlayerHitpointRegeneration':return new PlayerHitpointRegenerationMatcher(data);case 'PlayerSummonAttack':return new PlayerSummonAttackEventMatcher(data);case 'RuneConsumption':return new RuneConsumptionEventMatcher(data);case 'PotionUsed':return new PotionUsedEventMatcher(data);case 'PotionChargeUsed':return new PotionChargeUsedEventMatcher(data);case 'MonsterKilled':return new MonsterKilledEventMatcher(data,this);case 'ItemEquipped':return new ItemEquippedEventMatcher(data,this);case 'FoodEquipped':return new FoodEquippedEventMatcher(data,this);case 'ShopPurchaseMade':return new ShopPurchaseMadeEventMatcher(data,this);case 'SummonTabletUsed':return new SummonTabletUsedEventMatcher(data,this);}}
processEvent(event,interval=0){this.combat.player.consumeEquipmentCharges(event,interval);this.potions.consumeCharges(event);this.tutorial.updateTaskProgress(event);}
checkSteamAchievements(){if(!connectedToSteam)
return;let achievementIDs=[];try{achievementIDs=parent.greenworks.getAchievementNames();for(let i=steamAchievements.length;i<achievementIDs.length;i++){steamAchievements.push(0);}}
catch(e){console.error(e);}
achievementIDs.forEach((achieveID,i)=>{const achievement=this.steamAchievements.get(achieveID);if(achievement===undefined){console.warn(`Error checking steam achievements, no data exists for achievement with id: ${achieveID}`);return;}
if(this.isAchievementMet(achievement))
unlockSteamAchievement(achieveID,i);});parent.greenworks.setRichPresence('currentGamemode',this.currentGamemode.name);parent.greenworks.setRichPresence('skillLevel',''+this.completion.skillProgress.currentCount.getSum()+'');parent.greenworks.setRichPresence('steam_display','#Status_gamemodeSkillLevel');}
isAchievementMet(achievement){if(achievement.requiredGamemode!==undefined&&this.currentGamemode!==achievement.requiredGamemode)
return false;if(achievement.requirements.length>0)
return this.checkRequirements(achievement.requirements,false);switch(achievement.id){case 'NEW_ACHIEVEMENT_1_0':return true;case 'NEW_ACHIEVEMENT_1_1':return this.skills.some((skill)=>skill.level>skill.startingLevel);case 'NEW_ACHIEVEMENT_1_2':return this.pets.some((pet)=>this.petManager.isPetUnlocked(pet));case 'NEW_ACHIEVEMENT_1_3':return this.skills.some((skill)=>skill.level>=99);case 'NEW_ACHIEVEMENT_1_4':return this.masterySkills.some((skill)=>skill.isAnyMastery99);case 'NEW_ACHIEVEMENT_1_26':case 'NEW_ACHIEVEMENT_3_20':return this.completion.itemProgress.getPercent("melvorBaseGame")===100;case 'NEW_ACHIEVEMENT_1_27':case 'NEW_ACHIEVEMENT_3_21':return this.completion.petProgress.getPercent("melvorBaseGame")===100;case 'NEW_ACHIEVEMENT_1_28':case 'NEW_ACHIEVEMENT_3_22':return this.completion.masteryProgress.getPercent("melvorBaseGame")===100;case 'NEW_ACHIEVEMENT_1_29':case 'NEW_ACHIEVEMENT_3_23':return this.completion.monsterProgress.getPercent("melvorBaseGame")===100;case 'NEW_ACHIEVEMENT_2_24':return this.bank.maximumSlots>=80;case 'NEW_ACHIEVEMENT_2_25':return this.bank.maximumSlots>=100;case 'NEW_ACHIEVEMENT_2_26':return this.bank.maximumSlots>=200;case 'NEW_ACHIEVEMENT_2_27':{const plant=this.monsters.getObjectByID("melvorD:Plant");return plant!==undefined&&this.stats.Monsters.get(plant,MonsterStats.KilledPlayer)>0;}
default:return false;}}
setupCurrentGamemode(){const startingSkills=this.currentGamemode.startingSkills;if(startingSkills!==undefined){this.skills.forEach((skill)=>{skill.setUnlock(startingSkills.has(skill));});}
else{this.skills.forEach((skill)=>{skill.setUnlock(cloudManager.hasFullVersionEntitlement||isDemoSkill(skill));});}
this.currentGamemode.startingItems.forEach(({item,quantity})=>this.bank.addItem(item,quantity,false,true));this.settings.changeChoiceSetting('defaultPageOnLoad',this.currentGamemode.startingPage);}
getItemFromOldID(itemID,idMap){const item=this.items.getObjectByID(idMap.items[itemID]);return item;}
convertFromOldFormat(save,idMap){if(save.serialData!==undefined){if(save.version<=3){this.combat.deserialize(save.serialData,save.version,idMap);if(save.offline.skill!==null&&save.offline.skill===9)
this.activeAction=this.combat;}
else
this.deserialize(save.serialData,save.version,idMap);}
else{this.combat.convertFromOldSaveFormat(save,idMap);}
if(save.version<=8){this.stats.convertFromOldFormat(save,idMap);}
if(save.version<10&&(this.activeAction===this.thieving||this.activeAction===this.combat)){this.combat.giveFreeDeath=true;}
if(save.version<=15){if(save.summoningData!==undefined)
this.summoning.convertFromOldFormat(save.summoningData,idMap);this.fishing.convertFromOldFormat(save);this.cooking.convertFromOldFormat(save,idMap);}
if(save.version<17){this.agility.convertFromOldFormat(save,idMap);}
if(save.currentGamemode!==undefined){const gamemodeID=idMap.gameModes[save.currentGamemode];const gamemode=this.gamemodes.getObjectByID(gamemodeID);if(gamemode===undefined)
throw new Error(`Error converting save. Gamemode with id: ${gamemodeID} is not registered.`);this.currentGamemode=gamemode;}
this.bank.convertFromOldFormat(save,idMap);if(save.glovesTracker!==undefined)
this.itemCharges.convertFromOldFormat(save.glovesTracker,idMap);this.minibar.convertFromOldformat(save,idMap);this.potions.convertFromOldFormat(save,idMap);this.golbinRaid.convertFromOldFormat(save,idMap);if(save.dungeonCompleteCount!==undefined)
this.combat.convertDungeonCompletion(save.dungeonCompleteCount,idMap);this.shop.convertFromOldFormat(save,idMap);this.petManager.convertFromOldFormat(save,idMap);this.settings.convertFromOldFormat(save,idMap);if(save.skillXP!==undefined){save.skillXP.forEach((xp,oldSkillID)=>{const skill=this.skills.getObjectByID(idMap.skills[oldSkillID]);if(skill===undefined)
return;skill.convertOldXP(xp);});}
if(save.skillsUnlocked!==undefined){save.skillsUnlocked.forEach((isUnlocked,oldSkillID)=>{const skill=this.skills.getObjectByID(idMap.skills[oldSkillID]);if(skill===undefined)
return;skill.setUnlock(isUnlocked);});}
if(save.MASTERY!==undefined){Object.entries(save.MASTERY).forEach(([oldSkillID,oldMasteryData])=>{const skill=this.masterySkills.getObjectByID(idMap.skills[parseInt(oldSkillID)]);if(skill===undefined)
return;skill.convertOldMastery(oldMasteryData,idMap);});}
if(save.offline!==undefined)
this.convertOldOffline(save.offline,idMap);if(save.raidCoins!==undefined)
this.raidCoins.set(save.raidCoins);if(save.gp!==undefined)
this.gp.set(save.gp);this.tutorial.convertFromOldFormat(save,idMap);this.farming.convertFromOldFormat(save,idMap);if(save.username!==undefined)
this.characterName=save.username;if(save.titleNewsID!==undefined)
this.readNewsIDs=save.titleNewsID;if(save.gameUpdateNotification!==undefined)
this.lastLoadedGameVersion=save.gameUpdateNotification;if(save.scheduledPushNotifications!==undefined)
nativeManager.convertOldNotifications(save.scheduledPushNotifications);}
convertOldOffline(offline,idMap){if(offline.timestamp!==null){this.tickTimestamp=offline.timestamp;}
if(!this.mining.isActive&&offline.skill===4&&offline.action!==null){this.mining.setFromOldOffline(offline,idMap);}
if(!this.firemaking.isActive&&offline.skill===2&&offline.action!==null){this.firemaking.setFromOldOffline(offline,idMap);}
if(!this.woodcutting.isActive&&offline.skill===0&&offline.action!==null){this.woodcutting.setFromOldOffline(offline,idMap);}
if(!this.herblore.isActive&&offline.skill===19&&offline.action!==null){this.herblore.setFromOldOffline(offline,idMap);}
if(!this.smithing.isActive&&offline.skill===5&&offline.action!==null){this.smithing.setFromOldOffline(offline,idMap);}
if(!this.runecrafting.isActive&&offline.skill===15&&offline.action!==null){this.runecrafting.setFromOldOffline(offline,idMap);}
if(!this.altMagic.isActive&&offline.skill===16&&offline.action!==null){this.altMagic.setFromOldOffline(offline,idMap);}
if(!this.crafting.isActive&&offline.skill===14&&offline.action!==null){this.crafting.setFromOldOffline(offline,idMap);}
if(!this.fletching.isActive&&offline.skill===13&&offline.action!==null){this.fletching.setFromOldOffline(offline,idMap);}
if(!this.summoning.isActive&&offline.skill===21&&offline.action!==null){this.smithing.setFromOldOffline(offline,idMap);}
if(!this.fishing.isActive&&offline.skill===1&&offline.action!==null&&Array.isArray(offline.action)){this.fishing.setFromOldOffline(offline,idMap);}
if(!this.cooking.isActive&&offline.skill===3&&offline.action!==null){this.cooking.setFromOldOffline(offline,idMap);}
if(!this.agility.isActive&&offline.skill===20&&offline.action!==null){this.agility.setFromOldOffline(offline);}
if(!this.astrology.isActive&&offline.skill===22&&offline.action!==null){this.astrology.setFromOldOffline(offline,idMap);}}}