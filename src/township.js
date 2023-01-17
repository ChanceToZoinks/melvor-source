"use strict";class TownshipBiome extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this.totalInMap=0;this.availableInMap=0;this.amountPurchased=0;this.buildingsBuilt=new Map();this.provides={population:false,storage:false,happiness:false,education:false,deadStorage:false,worship:false,};this.containsResources=new Set();this._name=data.name;this._description=data.description;this._media=data.media;game.queueForSoftDependencyReg(data,this);}
get name(){if(this.isModded)
return this._name;return getLangString('TOWNSHIP',`BIOME_${this.localID}`);}
get description(){return this._description;}
get media(){return this.getMediaURL(this._media);}
get usageMessage(){if(this.resourceUsage===undefined)
return '';if(this.isModded)
return this.resourceUsage._usageMessage;return getLangString('TOWNSHIP_MENU',`${this.localID}_NOTIFY_0`);}
get penaltyMessage(){if(this.resourceUsage===undefined)
return '';if(this.isModded)
return this.resourceUsage._penaltyMessage;return getLangString('TOWNSHIP_MENU',`${this.localID}_NOTIFY_1`);}
get noResourceMessage(){if(this.resourceUsage===undefined)
return '';if(this.isModded)
return this.resourceUsage._noResourceMessage;return getLangString('TOWNSHIP_MENU',`${this.localID}_NOTIFY_2`);}
registerSoftDependencies(data,game){if(data.resourceUsage===undefined)
return;const resource=game.township.resources.getObjectByID(data.resourceUsage.resourceID);if(resource===undefined)
throw new UnregisteredConstructionError(this,TownshipResource.name,data.resourceUsage.resourceID);this.resourceUsage={resource,amount:data.resourceUsage.amount,_usageMessage:data.resourceUsage.usageMessage,_penaltyMessage:data.resourceUsage.penaltyMessage,_noResourceMessage:data.resourceUsage.noResourceMessage,};}
getBuildingCount(building){var _a;return(_a=this.buildingsBuilt.get(building))!==null&&_a!==void 0?_a:0;}
removeBuildings(building,count){const newCount=this.getBuildingCount(building)-count;if(newCount<=0)
this.buildingsBuilt.delete(building);else
this.buildingsBuilt.set(building,newCount);}
addBuildings(building,count){const newCount=this.getBuildingCount(building)+count;this.buildingsBuilt.set(building,newCount);}
addResource(resource){this.containsResources.add(resource);}}
class DummyTownshipBiome extends TownshipBiome{constructor(namespace,id,game){super(namespace,{id,name:'',description:'',media:'',},game);}}
class TownshipBuildingProvides{constructor(data,game){this.workers=new Map();this.resources=new Map();this.population=data.population;this.happiness=data.happiness;this.education=data.education;this.storage=data.storage;data.workers.map(({id,quantity})=>{const job=game.township.jobs.getObjectByID(id);if(job===undefined)
throw new UnregisteredConstructionError(this,TownshipJob.name,id);this.workers.set(job,quantity);});data.resources.map(({id,quantity})=>{const resource=game.township.resources.getObjectByID(id);if(resource===undefined)
throw new UnregisteredConstructionError(this,TownshipResource.name,id);this.resources.set(resource,quantity);});this.deadStorage=data.deadStorage;this.worship=data.worship;}
resourceCount(resource){var _a;return(_a=this.resources.get(resource))!==null&&_a!==void 0?_a:0;}
workerCount(job){var _a;return(_a=this.workers.get(job))!==null&&_a!==void 0?_a:0;}}
class TownshipBuilding extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this.biomeModifiers=new Map();this._name=data.name;this._description=data.description;this._media=data.media;this.tier=data.tier;this.type=BuildingTypeID[data.type];if(data.upgradesFrom!==undefined){const upgradesFrom=game.township.buildings.getObjectByID(data.upgradesFrom);if(upgradesFrom===undefined)
throw new UnregisteredConstructionError(this,TownshipBuilding.name,data.upgradesFrom);this.upgradesFrom=upgradesFrom;}
this.costs=game.township.getResourceQuantityFromData(data.cost);this.provides=new TownshipBuildingProvides(data.provides,game);this.biomes=data.biomes.map((biomeID)=>{const biome=game.township.biomes.getObjectByID(biomeID);if(biome===undefined)
throw new UnregisteredConstructionError(this,TownshipBiome.name,biomeID);return biome;});data.biomeModifiers.forEach(({biomeID,value})=>{const biome=game.township.biomes.getObjectByID(biomeID);if(biome===undefined)
throw new UnregisteredConstructionError(this,TownshipBiome.name,biomeID);this.biomeModifiers.set(biome,value);});if(data.modifiers!==undefined)
this.modifiers=game.getPlayerModifiersFromData(data.modifiers);}
get name(){if(this._name==='STATUE_NAME')
return game.township.statueName;if(this.isModded)
return this._name;return getLangString('TOWNSHIP',`BUILDING_${this.localID}`);}
get description(){return this._description;}
get media(){if(this._media==='STATUE_MEDIA')
return game.township.statueMedia;return this.getMediaURL(this._media);}
getBiomeModifier(biome){var _a;return(_a=this.biomeModifiers.get(biome))!==null&&_a!==void 0?_a:0;}
isAnUpgradeOf(building){let isUpgrade=false;let hasUpgrade=this.upgradesFrom!==undefined;let nextBuilding=this.upgradesFrom;while(hasUpgrade){if(nextBuilding===building){isUpgrade=true;break;}
if(nextBuilding!==undefined){hasUpgrade=nextBuilding.upgradesFrom!==undefined;if(hasUpgrade)
nextBuilding=nextBuilding.upgradesFrom;else
break;}
else
break;}
return isUpgrade;}}
class DummyTownshipBuilding extends TownshipBuilding{constructor(namespace,id,game){super(namespace,{id,name:'',description:'',media:'',tier:0,type:'Other',cost:[],provides:{population:0,happiness:0,education:0,storage:0,workers:[],resources:[],},biomes:[],biomeModifiers:[],},game);}}
class TownshipWorship extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this._name=data.name;this._description=data.description;this._media=data.media;this.modifiers=game.getPlayerModifiersFromData(data.modifiers);this.isHidden=data.isHidden;this.checkpoints=data.checkpoints.map((modData)=>game.getPlayerModifiersFromData(modData));this.unlockRequirements=data.unlockRequirements.map((reqData)=>game.getRequirementFromData(reqData));this._statueName=data.statueName;this._statueMedia=data.statueMedia;}
get name(){return this._name;}
get description(){return this._description;}
get media(){return this.getMediaURL(this._media);}
get statueName(){return this._statueName;}
get statueMedia(){return this.getMediaURL(this._statueMedia);}}
class DummyTownshipWorship extends TownshipWorship{constructor(namespace,id,game){super(namespace,{id,name:'',description:'',media:"assets/media/main/question.svg",modifiers:{},isHidden:false,checkpoints:[{},{},{},{}],unlockRequirements:[],statueName:'',statueMedia:'',},game);}}
class TownshipMap extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this.biomeCounts=new Map();this._name=data.name;data.biomes.forEach(({biomeID,count})=>{const biome=game.township.biomes.getObjectByID(biomeID);if(biome===undefined)
throw new UnregisteredConstructionError(this,TownshipBiome.name,biomeID);this.biomeCounts.set(biome,count);});}
get name(){return this._name;}
getBiomeCount(biome){var _a;return(_a=this.biomeCounts.get(biome))!==null&&_a!==void 0?_a:0;}}
class TownshipJob extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this.assigned=0;this.maxAvailable=0;this._name=data.name;if(data.produces!==undefined){const produces=game.township.resources.getObjectByID(data.produces);if(produces===undefined)
throw new UnregisteredConstructionError(this,TownshipResource.name,data.produces);this.produces=produces;if(produces.producingJob!==undefined)
throw new Error(`Error constructing ${TownshipJob.name} with id: ${this.id}. A job that produces: ${produces.id} already exists.`);produces.producingJob=this;}}
get name(){if(this.isModded)
return this._name;return getLangString('TOWNSHIP',`JOB_${this.localID}`);}}
class TownshipResource extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this.requires=new Map();this.biomeUsage=new Map();this.requiredForPopGrowth=false;this.itemConversions=[];this.statPenalties=[];this.buildingPenalties=[];this._amount=0;this._cap=100;this.baseGeneration=0;this.generation=0;const getBiome=(id)=>{const biome=game.township.biomes.getObjectByID(id);if(biome===undefined)
throw new UnregisteredConstructionError(this,TownshipBiome.name,id);return biome;};this._name=data.name;this._media=data.media;this.type=TownshipResourceTypeID[data.type];this._description=data.description;data.requires.forEach(({id,quantity})=>{const resource=game.township.resources.getObjectByID(id);if(resource===undefined)
throw new UnregisteredConstructionError(this,TownshipResource.name,id);this.requires.set(resource,quantity);});this.startingAmount=data.startingAmount;this._amount=this.startingAmount;data.statPenalties.forEach((penaltyData)=>{const penalty={resource:this,penalty:penaltyData.penalty,value:penaltyData.value,};if(penaltyData.biome!==undefined){penalty.biome=getBiome(penaltyData.biome);}
if(penaltyData.maxAgeWorkers!==undefined)
penalty.maxAgeWorkers=penaltyData.maxAgeWorkers;if(penaltyData.scaleWithMaxAgeWorkers!==undefined)
penalty.scaleWithMaxAgeWorkers=penaltyData.scaleWithMaxAgeWorkers;this.statPenalties.push(penalty);});data.buildingPenalties.forEach((penaltyData)=>{const biome=getBiome(penaltyData.biome);this.buildingPenalties.push({resource:this,provides:penaltyData.provides,value:penaltyData.value,biome,});});if(data.healthBonus!==undefined)
this.healthBonus=data.healthBonus;if(data.requiredForPopGrowth!==undefined)
this.requiredForPopGrowth=data.requiredForPopGrowth;if(data.preventCitizenDeath!==undefined){this.preventCitizenDeath={resources:data.preventCitizenDeath.resources.map((id)=>{const resource=game.township.resources.getObjectByID(id);if(resource===undefined)
throw new UnregisteredConstructionError(this,TownshipResource.name,id);return resource;}),maxAge:data.preventCitizenDeath.maxAge,};}}
get name(){if(this.isModded)
return this._name;return getLangString('TOWNSHIP',`RESOURCE_${this.localID}`);}
get media(){return this.getMediaURL(this._media);}
get description(){return this._description;}
get amount(){return this._amount;}
set amount(amount){if(amount<0)
this._amount=0;else
this._amount=amount;}
get cap(){return this._cap;}
set cap(cap){if(cap<0)
this._cap=0;if(cap>100)
this._cap=100;else
this._cap=cap;}
requiredCount(resource){var _a;return(_a=this.requires.get(resource))!==null&&_a!==void 0?_a:0;}}
class DummyTownshipResource extends TownshipResource{constructor(namespace,id,game){super(namespace,{id,name:'',media:'',type:'Raw',description:'',requires:[],startingAmount:0,statPenalties:[],buildingPenalties:[],},game);}}
class TownshipRenderQueue extends SkillRenderQueue{constructor(){super(...arguments);this.townStats=false;this.resourceAmounts=false;this.resourceRates=false;this.workerCounts=false;this.buildingCosts=false;this.extraBuildingRequirements=false;this.ticksAvailable=false;this.townAge=false;this.citizens=false;this.buildingProvides=false;this.traderStock=false;}}
class Township extends Skill{constructor(namespace,game){super(namespace,'Township',game);this._media='assets/media/skills/township/township.svg';this.TICK_LENGTH=300;this.MAX_TOWN_SIZE=4096/2;this.SECTION_SIZE=32;this.INITIAL_CITIZEN_COUNT=2;this.MIN_WORKER_AGE=8;this.MAX_WORKER_AGE=70;this.AGE_OF_DEATH=55;this.MIN_MIGRATION_AGE=16;this.MAX_MIGRATION_AGE=50;this.BASE_TAX_RATE=0;this.EDUCATION_PER_CITIZEN=3;this.HAPPINESS_PER_CITIZEN=2;this.CITIZEN_FOOD_USAGE=1;this.POPULATION_REQUIRED_FOR_BIRTH=10;this.BASE_STORAGE=19000;this.WORSHIP_CHECKPOINTS=[5,25,50,85,100];this.MAX_WORSHIP=2000;this.DECREASED_BUILDING_COST_CAP=-80;this.DECREASED_FOOD_USAGE_CAP=-80;this.populationForTier={1:{population:1,level:1},2:{population:200,level:15},3:{population:500,level:35},4:{population:2500,level:60},5:{population:4000,level:80},6:{population:6000,level:100},7:{population:13000,level:110},};this.renderQueue=new TownshipRenderQueue();this.modifiers=new MappedModifiers();this.totalTicks=0;this.citizens=[];this.populationLimit=0;this.modifiersFromBuildings=new MappedModifiers();this.convertQty=1;this.convertQtyPercent=50;this.convertQtyType=1;this.convertType=1;this.convertValues={numbers:[10,100,1000,10000,100000],percentages:[10,25,50,75,90,100],};this.buildQty=1;this.availableGameTicksToSpend=144;this.lastTickAddedDate=Date.now();this.nextSectionQty=1;this.destroyQty=1;this.upgradeQty=1;this.tasks=new TownshipTasks(this.game);this.jobsAreAvailable=true;this.tickInterval=-1;this.tickIntervalActive=false;this.mapSelectIndex=0;this.biomes=new NamespaceRegistry(this.game.registeredNamespaces);this.buildings=new NamespaceRegistry(this.game.registeredNamespaces);this.worships=new NamespaceRegistry(this.game.registeredNamespaces);this.maps=new NamespaceRegistry(this.game.registeredNamespaces);this.resources=new NamespaceRegistry(this.game.registeredNamespaces);this.jobs=new NamespaceRegistry(this.game.registeredNamespaces);this.availableMaps=[];this.buildingDisplayOrder=new NamespacedArray(this.buildings);this.resourceDisplayOrder=new NamespacedArray(this.resources);this.buildingPenalties={happiness:[],education:[],resources:[],worship:[],};this.statPenalties={happinessModifier:[],deathRate:[],flatHappiness:[],};this.healthBonusResources=[];this.popGrowthResources=[];this.deathPreventingResources=[];this.updateUnemployedCount=true;this._unemployedCount=0;this.changeMapWarningShown=false;this.changeWorshipWarningShown=false;this.MAX_TRADER_STOCK_INCREASE=100000000;this.popOver55=0;const unselectedMap=new TownshipMap(namespace,{id:'Unselected',name:'Error: No Map Selected',biomes:[],},game);this.maps.registerObject(unselectedMap);this.mapSelection=unselectedMap;this.noWorship=new TownshipWorship(namespace,{id:'None',get name(){return getLangString('MENU_TEXT','NONE');},description:'',media:TODO_REPLACE_MEDIA,modifiers:{},isHidden:false,checkpoints:[{},{},{},{}],unlockRequirements:[],get statueName(){return getLangString('TOWNSHIP','Statue_of_Nothing');},statueMedia:'assets/media/skills/township/Statue_of_Nothing.svg',},this.game);this.worships.registerObject(this.noWorship);this.unemployedJob=new TownshipJob(namespace,{id:'Unemployed',name:'Unemployed',},game);this.jobs.registerObject(this.unemployedJob);this.townData=new TownshipData(this,this.game);}
get traderStockIncrease(){return Math.min(this.game.modifiers.increasedTownshipTraderStock,this.MAX_TRADER_STOCK_INCREASE);}
get decayTickAmount(){return 14;}
get foodJob(){return this.jobs.getObjectByID("melvorF:Fisherman");}
get unemployedCount(){if(!this.updateUnemployedCount)
return this._unemployedCount;this._unemployedCount=this.citizens.reduce((total,citizen)=>{const age=this.getCitizenAge(citizen);if(age>=this.MIN_WORKER_AGE&&age<=this.MAX_WORKER_AGE&&citizen.job===this.unemployedJob)
total++;return total;},0);this.updateUnemployedCount=false;return this._unemployedCount;}
get citizenSources(){return[getLangString('TOWNSHIP','SOURCE_0'),getLangString('TOWNSHIP','SOURCE_1')];}
get oneDayInTicks(){return 86400/this.TICK_LENGTH;}
get traderTimePeriod(){return 3600/this.TICK_LENGTH;}
get isTraderAvailable(){return this.totalTicks%(this.oneDayInTicks/3)<this.traderTimePeriod;}
get traderLeavesIn(){return this.traderTimePeriod-(this.totalTicks%(this.oneDayInTicks/3));}
get traderArrivesIn(){return this.oneDayInTicks/3-(this.totalTicks%(this.oneDayInTicks/3));}
get minWidthForListItem(){return nativeManager.isMobile?'48%':'150px';}
get chanceForPet(){return 1/(this.oneDayInTicks*5);}
get statueName(){return this.townData.worship.statueName;}
get statueMedia(){return this.townData.worship.statueMedia;}
get baseXPRate(){return Math.max((1+this.happinessPercent/100)*(this.currentPopulation*0.01)*(this.TICK_LENGTH/10),1);}
get currentPopulation(){return this.citizens.length;}
get currentWorshipName(){return this.townData.worship.name;}
get worshipPercent(){return(this.townData.worshipCount/this.MAX_WORSHIP)*100;}
get worshipTier(){const currentPercent=this.worshipPercent;let tier=this.WORSHIP_CHECKPOINTS.findIndex((checkpoint)=>currentPercent<checkpoint);if(tier===-1)
tier=this.WORSHIP_CHECKPOINTS.length;return tier-1;}
get deadStoragePercent(){if(this.totalDead<=0||this.availableDeadStorage<=0)
return 0;return(this.totalDead/this.availableDeadStorage)*100;}
get totalDead(){return this.townData.dead;}
get availableDeadStorage(){return this.townData.deadStorage;}
get happinessPercent(){if(this.maxHappiness<=0)
return 0;return Math.max(Math.min((this.townData.happiness/this.maxHappiness)*100,100),0);}
get maxHappiness(){return this.currentPopulation*this.HAPPINESS_PER_CITIZEN;}
get isCitizenAtMaxWorkerAge(){return this.citizens.some((citizen)=>this.getCitizenAge(citizen)>this.MAX_WORKER_AGE);}
get citizensAtMaxWorkerAge(){return this.citizens.reduce((total,citizen)=>{if(this.getCitizenAge(citizen)>this.MAX_WORKER_AGE)
return total+1;return total;},0);}
get educationPercent(){const maxEducation=this.maxEducation;if(maxEducation<=0)
return 0;return Math.max(Math.min((this.townData.education/maxEducation)*100,100),0);}
get maxEducation(){return this.currentPopulation*this.EDUCATION_PER_CITIZEN;}
get taxRate(){const baseRate=this.BASE_TAX_RATE;const modifier=this.game.modifiers.increasedTownshipTaxPerCitizen-this.game.modifiers.decreasedTownshipTaxPerCitizen;return Math.min(baseRate+modifier,80);}
get populationGainRate(){return Math.ceil(((0.05*this.populationLimit)/100)*(this.TICK_LENGTH/10));}
get populationGainChance(){return 1.4-this.currentPopulation/this.populationLimit;}
get deadDecayAmount(){return Math.floor(this.townData.deadStorage*0.01);}
get potionUsage(){return Math.floor((this.popOver55/1000)*(this.TICK_LENGTH/10));}
get foodUsage(){return(this.currentPopulation*(this.CITIZEN_FOOD_USAGE*(1+
Math.max(this.game.modifiers.increasedTownshipFoodUsage-this.game.modifiers.decreasedTownshipFoodUsage,this.DECREASED_FOOD_USAGE_CAP)/100))*(this.TICK_LENGTH/10));}
registerData(namespace,data){var _a,_b,_c,_d,_e,_f;super.registerData(namespace,data);(_a=data.biomes)===null||_a===void 0?void 0:_a.forEach((biomeData)=>{this.biomes.registerObject(new TownshipBiome(namespace,biomeData,this.game));});(_b=data.resources)===null||_b===void 0?void 0:_b.forEach((resourceData)=>{this.resources.registerObject(new TownshipResource(namespace,resourceData,this.game));});(_c=data.jobs)===null||_c===void 0?void 0:_c.forEach((jobData)=>{this.jobs.registerObject(new TownshipJob(namespace,jobData,this.game));});(_d=data.buildings)===null||_d===void 0?void 0:_d.forEach((buildingData)=>{this.buildings.registerObject(new TownshipBuilding(namespace,buildingData,this.game));});(_e=data.worships)===null||_e===void 0?void 0:_e.forEach((buildingData)=>{this.worships.registerObject(new TownshipWorship(namespace,buildingData,this.game));});(_f=data.maps)===null||_f===void 0?void 0:_f.forEach((mapData)=>{this.maps.registerObject(new TownshipMap(namespace,mapData,this.game));});if(data.buildingDisplayOrder!==undefined)
this.buildingDisplayOrder.registerData(data.buildingDisplayOrder);if(data.resourceDisplayOrder!==undefined)
this.resourceDisplayOrder.registerData(data.resourceDisplayOrder);if(data.tasks!==undefined)
this.tasks.registerData(namespace,data.tasks);}
getResourceQuantityFromData(resourceData){return resourceData.map(({id,quantity})=>{const resource=this.resources.getObjectByID(id);if(resource===undefined)
throw new Error(`Error getting resource quantity. ${TownshipResource.name} with id: ${id} is not registered.`);return{resource,quantity};});}
postDataRegistration(){super.postDataRegistration();this.availableMaps=this.maps.filter((map)=>map.id!==`melvorD:Unselected`);this.buildResourceItemConversions();this.biomes.forEach((biome)=>{if(biome.resourceUsage!==undefined){biome.resourceUsage.resource.biomeUsage.set(biome,biome.resourceUsage.amount);}});this.resources.forEach((resource)=>{resource.buildingPenalties.forEach((penalty)=>{this.buildingPenalties[penalty.provides].push(penalty);});resource.statPenalties.forEach((penalty)=>{this.statPenalties[penalty.penalty].push(penalty);});if(resource.healthBonus!==undefined)
this.healthBonusResources.push(resource);if(resource.requiredForPopGrowth)
this.popGrowthResources.push(resource);});this.buildings.forEach((building)=>{if(building.upgradesFrom!==undefined){if(building.upgradesFrom.upgradesTo!==undefined)
throw new Error(`Building: ${building.upgradesFrom.id} has multiple upgrade paths`);building.upgradesFrom.upgradesTo=building;}
building.biomes.forEach((biome)=>{building.provides.resources.forEach((_,resource)=>{biome.addResource(resource);});if(building.provides.population>0)
biome.provides.population=true;if(building.provides.storage>0)
biome.provides.storage=true;if(building.provides.happiness>0)
biome.provides.happiness=true;if(building.provides.education>0)
biome.provides.education=true;if(building.provides.deadStorage!==undefined)
biome.provides.deadStorage=true;if(building.provides.worship!==undefined)
biome.provides.worship=true;});});}
buildResourceItemConversions(){this.resources.forEach((resource)=>{switch(resource.id){case "melvorF:Food":resource.itemConversions=this.game.items.food.filter((item)=>{return!item.ignoreCompletion&&!item.localID.includes('_Perfect')&&!item.category.includes('Farming');});break;case "melvorF:Wood":case "melvorF:Planks":resource.itemConversions=this.game.items.filter((item)=>item.type==='Logs');break;case "melvorF:Stone":case "melvorF:Ore":resource.itemConversions=this.game.items.filter((item)=>item.type==='Ore'&&item.localID!=='Meteorite_Ore');break;case "melvorF:Coal":{const coalItem=this.game.items.getObjectByID("melvorD:Coal_Ore");if(coalItem!==undefined)
resource.itemConversions=[coalItem];}
break;case "melvorF:Bar":resource.itemConversions=this.game.items.filter((item)=>item.type==='Bar'&&item.localID!=='Meteorite_Bar');break;case "melvorF:Herbs":resource.itemConversions=this.game.items.filter((item)=>item.type==='Herb');break;case "melvorF:Rune_Essence":{const essences=[];const essenceItem=this.game.items.getObjectByID("melvorD:Rune_Essence");if(essenceItem!==undefined)
essences.push(essenceItem);const pureEssenceItem=this.game.items.getObjectByID("melvorTotH:Pure_Essence");if(pureEssenceItem!==undefined)
essences.push(pureEssenceItem);resource.itemConversions=essences;}
break;case "melvorF:Leather":{const leatherItem=this.game.items.getObjectByID("melvorD:Leather");if(leatherItem!==undefined)
resource.itemConversions=[leatherItem];}
break;case "melvorF:Potions":resource.itemConversions=this.game.items.potions.filter((item)=>item.tier===3);break;case "melvorF:Clothing":resource.itemConversions=this.game.items.filter((item)=>{return(item.localID==='Green_Dragonhide'||item.localID==='Blue_Dragonhide'||item.localID==='Red_Dragonhide'||item.localID==='Black_Dragonhide'||item.localID==='Elder_Dragonhide');});break;}});}
getErrorLog(){return `TODO: Implement Township Error Logging`;}
increaseTraderStockAvailable(){if(this.totalTicks%(this.oneDayInTicks/3)===0){this.townData.traderStock+=this.traderStockIncrease;this.renderQueue.traderStock=true;}}
grantOfflineTicks(){const now=Date.now();const ticksToGrant=Math.floor((now-this.lastTickAddedDate)/(1000*this.TICK_LENGTH));const leftover=Math.ceil((now-this.lastTickAddedDate)%(1000*this.TICK_LENGTH));if(ticksToGrant>=1){if(this.isUnlocked){this.availableGameTicksToSpend+=ticksToGrant;this.renderQueue.ticksAvailable=true;}
this.lastTickAddedDate=now-leftover;}}
toggleTickInterval(){if(this.tickIntervalActive){clearInterval(this.tickInterval);this.tickIntervalActive=false;}
else{this.tickInterval=setInterval(()=>{this.tick();},2000);this.tickIntervalActive=true;}}
encodeResource(writer,resource){writer.writeNamespacedObject(resource);writer.writeFloat64(resource.amount);writer.writeUint8(resource.cap);}
encodeBiome(writer,biome){writer.writeNamespacedObject(biome);writer.writeMap(biome.buildingsBuilt,writeNamespaced,(count,writer)=>writer.writeUint32(count));writer.writeUint32(biome.totalInMap);writer.writeUint32(biome.availableInMap);writer.writeUint32(biome.amountPurchased);}
encode(writer){super.encode(writer);this.townData.encode(writer);writer.writeArray(this.citizens,(citizen,writer)=>{writer.writeNamespacedObject(citizen.job);writer.writeUint32(citizen.ticksAlive);writer.writeUint8(citizen.source);});writer.writeArray(this.resources.allObjects,(resource,writer)=>this.encodeResource(writer,resource));writer.writeUint32(this.resources.dummySize);this.resources.forEachDummy((resource)=>this.encodeResource(writer,resource));writer.writeArray(this.jobs.allObjects,(job,writer)=>{writer.writeNamespacedObject(job);writer.writeInt32(job.assigned);});writer.writeArray(this.biomes.allObjects,(biome,writer)=>this.encodeBiome(writer,biome));writer.writeUint32(this.biomes.dummySize);this.biomes.forEachDummy((biome)=>this.encodeBiome(writer,biome));writer.writeUint32(this.buildQty);writer.writeUint32(this.availableGameTicksToSpend);writer.writeUint32(this.totalTicks);writer.writeFloat64(this.lastTickAddedDate);writer.writeSet(this.tasks.completedTasks,writeNamespaced);return writer;}
decodeResource(reader,version){const resource=reader.getNamespacedObject(this.resources);const amount=reader.getFloat64();if(typeof resource!=='string'){resource.amount=amount;}
else if(resource.startsWith('melvor')){const dummyResource=this.resources.getDummyObject(resource,DummyTownshipResource,this.game);dummyResource.amount=amount;}
if(version>34){const cap=reader.getUint8();if(typeof resource!=='string'){resource.cap=cap;}
else if(resource.startsWith('melvor')){const dummyResource=this.resources.getDummyObject(resource,DummyTownshipResource,this.game);dummyResource.cap=cap;}}}
decodeBiome(reader,version){const biome=reader.getNamespacedObject(this.biomes);const buildingsBuilt=reader.getMap((reader)=>{const building=reader.getNamespacedObject(this.buildings);if(typeof building!=='string')
return building;else if(building.startsWith('melvor')){return this.buildings.getDummyObject(building,DummyTownshipBuilding,this.game);}
else{return undefined;}},(reader)=>reader.getUint32());const totalInMap=reader.getUint32();const availableInMap=reader.getUint32();const amountPurchased=reader.getUint32();if(typeof biome!=='string'){biome.buildingsBuilt=buildingsBuilt;biome.totalInMap=totalInMap;biome.availableInMap=availableInMap;biome.amountPurchased=amountPurchased;}
else if(biome.startsWith('melvor')){const dummyBiome=this.biomes.getDummyObject(biome,DummyTownshipBiome,this.game);dummyBiome.buildingsBuilt=buildingsBuilt;dummyBiome.totalInMap=totalInMap;dummyBiome.availableInMap=availableInMap;dummyBiome.amountPurchased=amountPurchased;}}
decode(reader,version){super.decode(reader,version);this.townData.decode(reader,version);this.citizens=reader.getArray((reader)=>{let job=reader.getNamespacedObject(this.jobs);if(typeof job==='string')
job=this.unemployedJob;const ticksAlive=reader.getUint32();const source=reader.getUint8();return{job,ticksAlive,source};});reader.getArray((reader)=>{this.decodeResource(reader,version);});const numDummyResources=reader.getUint32();for(let i=0;i<numDummyResources;i++){this.decodeResource(reader,version);}
reader.getArray((reader)=>{const job=reader.getNamespacedObject(this.jobs);const assigned=reader.getUint32();if(typeof job!=='string'){job.assigned=assigned;}});reader.getArray((reader)=>{this.decodeBiome(reader,version);});const numDummyBiomes=reader.getUint32();for(let i=0;i<numDummyBiomes;i++){this.decodeBiome(reader,version);}
this.buildQty=reader.getUint32();this.availableGameTicksToSpend=reader.getUint32();if(version<26)
this.availableGameTicksToSpend=Math.ceil(this.availableGameTicksToSpend/36);this.totalTicks=reader.getUint32();if(version<26)
this.totalTicks/=36;this.lastTickAddedDate=reader.getFloat64();if(version>28)
this.tasks.completedTasks=reader.getSet((reader)=>{const task=reader.getNamespacedObject(this.tasks.tasks);if(typeof task!=='string')
return task;else if(task.startsWith('melvor')){return this.tasks.tasks.getDummyObject(task,DummyTownshipTask,this.game);}
return undefined;});if(version<32)
this.retroactiveCitizenAgeFix();}
deserialize(reader,version,idMap){const getBiome=(oldID)=>{const biome=this.biomes.getObjectByID(idMap.townshipBiomes[oldID]);if(biome===undefined)
throw new Error('Error converting save. Biome is not registered.');return biome;};if(version>=20){this.deserializeTownData(reader.getVariableLengthChunk(),version,idMap);this.deserializeCitizens(reader.getVariableLengthChunk(),version,idMap);const biomeCount=reader.getNumber();for(let i=0;i<biomeCount;i++){const biomeID=reader.getNumber();const buildingDataMap=reader.getTownshipBuildingDataMap(this.game,idMap);getBiome(biomeID).buildingsBuilt=buildingDataMap;}
const biomeCount2=reader.getNumber();for(let i=0;i<biomeCount2;i++){const biomeID=reader.getNumber();const value=reader.getNumber();getBiome(biomeID).totalInMap=value;}
const biomeCount3=reader.getNumber();for(let i=0;i<biomeCount3;i++){const biomeID=reader.getNumber();const value=reader.getNumber();getBiome(biomeID).availableInMap=value;}
const biomeCount4=reader.getNumber();for(let i=0;i<biomeCount4;i++){const biomeID=reader.getNumber();const value=reader.getNumber();getBiome(biomeID).amountPurchased=value;}
this.buildQty=reader.getNumber();this.availableGameTicksToSpend=reader.getNumber();this.totalTicks=reader.getNumber();}
if(version>=21)
this.lastTickAddedDate=reader.getNumber();}
deserializeCitizens(reader,version,idMap){var _a;for(let i=0;i<reader.dataLength/3;i++){const jobID=reader.getNumber();const job=(_a=this.jobs.getObjectByID(idMap.townshipJobs[jobID]))!==null&&_a!==void 0?_a:this.unemployedJob;const ticksAlive=reader.getNumber();const source=reader.getNumber();this.citizens.push({job,ticksAlive,source});}}
deserializeTownData(reader,version,idMap){this.townData.dead=reader.getNumber();reader.getNumber();reader.getNumber();reader.getNumber();reader.getNumber();const priority=reader.getString();this.townData.priorityJob=this.jobs.getObjectByID(idMap.townshipJobKeys[priority]);this.townData.sectionsPurchased=reader.getNumber();const biomeID=reader.getNumber();this.townData.currentBuildBiome=this.biomes.getObjectByID(idMap.townshipBiomes[biomeID]);reader.getNumber();this.townData.townCreated=reader.getBool();const worshipID=reader.getNumber();const worship=this.worships.getObjectByID(idMap.townshipWorships[worshipID]);if(worship!==undefined)
this.townData.worship=worship;reader.getNumber();reader.getNumber();reader.getVariableLengthChunk();this.deserializeTownDataResources(reader.getVariableLengthChunk(),version,idMap);this.deserializeTownDataWorkers(reader.getVariableLengthChunk(),version,idMap);}
deserializeTownDataResources(reader,version,idMap){for(let i=0;i<13;i++){const amount=reader.getNumber();const resource=this.resources.getObjectByID(idMap.townshipResourceDecode[i]);if(resource!==undefined)
resource.amount=amount;}}
deserializeTownDataWorkers(reader,version,idMap){for(let i=0;i<12;i++){const assigned=reader.getNumber();const job=this.jobs.getObjectByID(idMap.townshipJobDecode[i]);if(job!==undefined)
job.assigned=assigned;}}
onLevelUp(oldLevel,newLevel){super.onLevelUp(oldLevel,newLevel);this.renderQueue.extraBuildingRequirements=true;}
onResourceAmountChange(){this.renderQueue.resourceAmounts=true;this.renderQueue.buildingCosts=true;}
renderTownStats(){if(!this.renderQueue.townStats)
return;townshipUI.updateTownStats();this.renderQueue.townStats=false;}
renderResourceAmounts(){if(!this.renderQueue.resourceAmounts)
return;townshipUI.updateResourceAmounts();townshipUI.updateTownNotifications();this.renderQueue.resourceAmounts=false;}
renderResourceRates(){if(!this.renderQueue.resourceRates)
return;townshipUI.updateResourceTickBreakdown();this.renderQueue.resourceRates=false;}
renderWorkerCounts(){if(!this.renderQueue.workerCounts)
return;townshipUI.updateWorkerCounts();this.renderQueue.workerCounts=false;}
renderBuildingCosts(){if(!this.renderQueue.buildingCosts)
return;townshipUI.updateAllBuildingCosts();townshipUI.updateAllBuildingUpgradeCosts();this.renderQueue.buildingCosts=false;}
renderBuildingRequirements(){if(!this.renderQueue.extraBuildingRequirements)
return;townshipUI.updateAllBuildingRequirements();this.renderQueue.extraBuildingRequirements=false;}
renderTicksAvailable(){if(!this.renderQueue.ticksAvailable)
return;townshipUI.updateTicksAvailable();this.renderQueue.ticksAvailable=false;}
renderTownAge(){if(!this.renderQueue.townAge)
return;townshipUI.updateTimeAlive();townshipUI.updateTraderStatus();this.renderQueue.townAge=false;}
renderCitizens(){if(!this.renderQueue.citizens)
return;townshipUI.displayAllCitizens();this.renderQueue.citizens=false;}
renderBuildingProvides(){if(!this.renderQueue.buildingProvides)
return;townshipUI.updateTownBuildingProvides();townshipUI.updateBuildBuildingProvides();this.renderQueue.buildingProvides=false;}
renderTraderStockRemaining(){if(!this.renderQueue.traderStock)
return;townshipUI.updateTraderStockAvailable();this.renderQueue.traderStock=false;}
render(){super.render();this.renderTownStats();this.renderResourceAmounts();this.renderResourceRates();this.renderWorkerCounts();this.renderBuildingCosts();this.renderBuildingRequirements();this.renderTicksAvailable();this.renderTownAge();this.renderCitizens();this.renderBuildingProvides();this.renderTraderStockRemaining();}
initTownCreation(){if(this.availableMaps.length===0)
return;this.mapSelection=this.availableMaps[0];this.regenerateTown();townshipUI.createWorshipSelection();townshipUI.hideMainContainerDivs();townshipUI.showTownCreationDivs();}
updateConvertType(type){this.convertType=type;townshipUI.updateConvertTypeBtn();townshipUI.updateConvertQtyElements();townshipUI.updateConvertVisibility();}
updateGeneratedTownBreakdown(){const element=townshipUI.defaultElements.div.townBreakdown;let html=`<div class="row gutters-tiny">`;this.biomes.forEach((biome)=>{const count=biome.totalInMap;const percent=(count/this.MAX_TOWN_SIZE)*100;html+=`<div class="col-12"><div class="row gutters-tiny"><div class="text-right" style="width:${setLang!=='ru'?'120px':'190px'};"><span class="font-w600 text-warning">${biome.name}:</span></div><div class="text-right" style="width:50px"><span class="text-success">${count}</span></div><div class="text-right mr-2" style="width:50px"><small>${percent.toFixed(1)}%</small></div><!--<div class="col text-left text-info"><small>(Description coming soon)</small></div>--></div></div>`;});element.innerHTML=html;const name=document.getElementById('TOWN_MAP_NAME');name.innerText=this.mapSelection.name+' / '+this.availableMaps.length;}
confirmTownCreation(){var _a;this.confirmWorship();this.townData.townCreated=true;townshipUI.hideTownCreationDivs();townshipUI.showMainContainerDivs();if(!this.citizens.length)
this.spawnInitialCitizens();(_a=document.getElementById('TOWNSHIP_ALERT_TUTORIAL'))===null||_a===void 0?void 0:_a.classList.remove('d-none');this.onLoad();this.game.combat.player.computeAllStats();this.postStatLoad();}
regenerateTown(showConfirmation=false){if(showConfirmation&&!this.changeMapWarningShown){this.selectNewMapConfirmation();return;}
this.setBiomeCountsForMap();const grasslands=this.biomes.getObjectByID("melvorF:Grasslands");if(grasslands===undefined)
throw new Error(`Error regenerating town. Grasslands is not registered.`);this.townData.currentBuildBiome=grasslands;this.generateStartingSection(grasslands);this.generateEmptyTown(grasslands);this.updateGeneratedTownBreakdown();if(this.mapSelectIndex>=this.availableMaps.length-1){this.mapSelectIndex=0;}
else{this.mapSelectIndex++;}
this.mapSelection=this.availableMaps[this.mapSelectIndex];}
selectWorship(worship){this.worshipInSelection=worship;townshipUI.updateWorshipSelection();}
confirmWorship(){if(this.worshipInSelection!==undefined)
this.townData.worship=this.worshipInSelection;townshipUI.updateCurrentWorship();$('#modal-change-worship').modal('hide');}
preLoad(){this.recalculatePopOver55();this.updateAllBuildingModifierData();this.computeBuildingTownStats();this.computeWorship();const emporium=this.buildings.getObjectByID("melvorF:Magic_Emporium");if(emporium!==undefined)
this.removeOverflowingWorkers(emporium);this.computeProvidedStats(false);if(this.townData.priorityJob===undefined)
this.townData.priorityJob=this.foodJob;}
postStatLoad(){if(!this.townData.townCreated)
return;this.computeTownStats();townshipUI.loadTownshipUI();this.postLoad();}
postLoad(){this.assignWorkersOnLoad();this.renderQueue.resourceAmounts=true;this.renderQueue.resourceRates=true;this.setBuildBiome(this.townData.currentBuildBiome,false);this.grantOfflineTicks();this.biomes.forEach((biome)=>{townshipUI.updateBiomeBreakdown(biome);});this.tasks.checkForTaskReady();townshipUI.updateTownNotifications();this.renderQueue.citizens=true;this.renderQueue.townAge=true;}
onLoad(){super.onLoad();if(!this.townData.townCreated){this.initTownCreation();return;}
this.preLoad();}
onModifierChange(){this.renderQueue.buildingCosts=true;this.renderQueue.buildingProvides=true;this.computeTownStats();}
onPageChange(){this.renderModifierChange();this.tasks.onPageChange();this.updateConvertType(this.convertType);}
renderModifierChange(){this.onModifierChange();}
tick(){if(this.availableGameTicksToSpend<=0){this.game.combat.notifications.add({type:'Player',args:[this,'You have no ticks to spend.','danger'],});return false;}
this.addResources();this.addXP(this.baseXPRate);this.addPopulation();this.updateCitizens();this.updateDeadStorage();this.rollForPets(0);this.computeWorshipAndStats();this.availableGameTicksToSpend--;this.totalTicks++;this.renderQueue.townAge=true;this.renderQueue.ticksAvailable=true;this.increaseTraderStockAvailable();return true;}
rollForPets(interval){this.pets.forEach((pet)=>{if(this.game.petManager.isPetUnlocked(pet))
return;if(this.chanceForPet>Math.random())
this.game.petManager.unlockPet(pet);});}
catchupTicks(tickAmount,confirmed=false){if(tickAmount>=this.oneDayInTicks&&!confirmed)
this.fireCatchupConfirmation(tickAmount);else{tickAmount=this.availableGameTicksToSpend>=tickAmount?tickAmount:this.availableGameTicksToSpend;for(let i=0;i<tickAmount-1;i++){const complete=this.tick();if(!complete)
break;}
this.tick();}}
fireCatchupConfirmation(tickAmount){SwalLocale.fire({title:'Are you sure?',html:`<h5 class="font-size-sm mb-3">You are about to spend <span class="text-warning">${numberWithCommas(tickAmount)}</span> ticks in one go.</h5>
      <h5 class="font-size-sm mb-3">This can be quite <span class="text-danger">dangerous</span>, as your Town may experience shortages of Food, Resources or Storage during this time.</h5>
      <h5 class="font-size-sm mb-3 text-info">We recommend setting Workers to prioritize Food before confirming this action.</h5>`,showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),cancelButtonText:getLangString('CHARACTER_SELECT','45'),showConfirmButton:true,icon:'warning',}).then((result)=>{if(result.value)
this.catchupTicks(tickAmount,true);});}
selectNewMapConfirmation(){SwalLocale.fire({html:`<h5 class="font-size-sm font-w-600 mb-3 text-success">${getLangString('TOWNSHIP_MENU','WELCOME_RECOMMENDATION_SWAL_0')}</h5><h5 class="font-size-sm font-w400 mb-3">${getLangString('TOWNSHIP_MENU','WELCOME_RECOMMENDATION_SWAL_1')}</h5><h5 class="font-size-sm font-w600 mb-3">${getLangString('TOWNSHIP_MENU','WELCOME_RECOMMENDATION_SWAL_2')}</h5>`,showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),cancelButtonText:getLangString('CHARACTER_SELECT','45'),showConfirmButton:true,icon:'warning',}).then((result)=>{if(result.value){this.changeMapWarningShown=true;this.regenerateTown();}});}
deleteConfirmationSwal(){SwalLocale.fire({html:`<h5 class="font-size-sm font-w-600 mb-3 text-danger">${getLangString('TOWNSHIP_MENU','RESET_CONFIRM_0')}</h5>`,showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),cancelButtonText:getLangString('CHARACTER_SELECT','45'),showConfirmButton:true,icon:'warning',}).then((result)=>{if(result.value){this.deleteTownshipDataFromLocalStorage();}});}
deleteTownshipDataFromLocalStorage(){localStorage.removeItem('TOWNSHIP_DATA');localStorage.removeItem('TOWN_MAP');localStorage.removeItem('TOWN_MAP_AVAILABLE');localStorage.removeItem('TOWN');localStorage.removeItem('CITIZENS');localStorage.removeItem('TOTAL_TICKS');localStorage.removeItem('Township.BUILDINGS');localStorage.removeItem('TOWN_MAP_SECTIONS');const sections=this.townData.sectionsPurchased;const trader=this.townData.traderStock;this.townData=new TownshipData(this,this.game);this.townData.sectionsPurchased=sections;this.townData.traderStock=trader;if(this.availableGameTicksToSpend<144)
this.availableGameTicksToSpend=144;this.biomes.forEach((biome)=>{biome.buildingsBuilt.clear();biome.totalInMap=0;biome.availableInMap=0;biome.amountPurchased=0;});this.resources.forEach((resource)=>{resource.amount=resource.startingAmount;});this.jobs.forEach((job)=>{job.assigned=0;});this.citizens=[];this.buildQty=1;this.lastTickAddedDate=Date.now();this.totalTicks=0;this.tasks.resetTutorial();saveData();window.setTimeout(function(){location.reload();},500);}
resetTownshipLevel(){this.setXP(0);saveData();window.setTimeout(function(){location.reload();},500);}
setBiomeCountsForMap(){this.biomes.forEach((biome)=>{const biomeCount=this.mapSelection.getBiomeCount(biome);biome.totalInMap=biomeCount;biome.availableInMap=biomeCount;biome.amountPurchased=0;});}
generateStartingSection(grasslands){this.townData.biomesUnlocked=0;const availableBiomes=this.biomes.filter((biome)=>{return biome.totalInMap>0;});let sections=0;while(sections<this.SECTION_SIZE-1){const chosenBiome=getRandomArrayElement(availableBiomes);this.addSectionOfLand(chosenBiome,1);sections++;}
this.addSectionOfLand(grasslands,1);}
generateEmptyTown(grasslands){grasslands.availableInMap--;const basicShelter=this.buildings.getObjectByID("melvorF:Basic_Shelter");if(basicShelter===undefined)
throw new Error('Error generating town. Basic Shelter is not registered.');grasslands.buildingsBuilt.set(basicShelter,1);}
spawnInitialCitizens(){for(let i=0;i<this.INITIAL_CITIZEN_COUNT;i++){this.addNewCitizen(CitizenSource.Migration);}}
addNewCitizen(citizenSource){const citizen={job:this.unemployedJob,ticksAlive:0,source:citizenSource,};this.citizens.push(citizen);if(citizenSource===CitizenSource.Migration){const ageToSet=Math.floor(Math.random()*(this.MAX_MIGRATION_AGE-this.MIN_MIGRATION_AGE))+this.MIN_MIGRATION_AGE;this.setCitizenAge(citizen,ageToSet);}
this.jobsAreAvailable=true;this.updateUnemployedCount=true;if(this.getCitizenAge(citizen)>=55)
this.popOver55++;this.renderQueue.extraBuildingRequirements=true;}
setBuildBiome(biome,jumpTo=false){if(this.townData.currentBuildBiome!==biome){townshipUI.unhighlightBuildBiomeBtn(this.townData.currentBuildBiome);townshipUI.unhighlightTownBiomeBtn(this.currentTownBiome);}
this.townData.currentBuildBiome=biome;this.currentTownBiome=biome;this.updateForBiomeSelectChange(biome);const yOffset=-355;const element=document.getElementById('ts-summary');if(element!==null&&nativeManager.isMobile&&jumpTo){const y=element.getBoundingClientRect().top+window.pageYOffset+yOffset;window.scrollTo({top:y,behavior:'smooth'});}}
setTownBiome(biome,jumpTo=true){if(this.currentTownBiome!==biome){townshipUI.unhighlightTownBiomeBtn(this.currentTownBiome);}
this.currentTownBiome=biome;if(biome!==undefined){townshipUI.unhighlightBuildBiomeBtn(this.townData.currentBuildBiome);this.townData.currentBuildBiome=biome;}
this.updateForBiomeSelectChange(biome);const yOffset=-355;const element=document.getElementById('ts-town');if(element!==null&&nativeManager.isMobile&&jumpTo){const y=element.getBoundingClientRect().top+window.pageYOffset+yOffset;window.scrollTo({top:y,behavior:'smooth'});}}
updateForBiomeSelectChange(biome){this.setNextSectionQty(this.nextSectionQty);townshipUI.highlightBuildBiomeBtn(biome);townshipUI.updateBuildingsForBiomeSelection();townshipUI.updateBiomeBreakdown(biome);townshipUI.highlightTownBiomeBtn(biome);townshipUI.updateTownSummary();townshipUI.updateBuildingCounts();townshipUI.updateAllBuildingUpgradeCosts();townshipUI.updateTownBiomeSelectionNotifications();}
setPriorityJob(job){const foodJob=this.jobs.getObjectByID("melvorF:Fisherman");if(this.townData.priorityJob!==undefined||this.townData.priorityJob===job)
townshipUI.unhighlightPriorityWorkerBtn(this.townData.priorityJob);if(this.townData.priorityJob===job&&job!==foodJob)
this.townData.priorityJob=foodJob;else if(this.townData.priorityJob===job&&job===foodJob)
this.townData.priorityJob=undefined;else
this.townData.priorityJob=job;if(this.townData.priorityJob!==undefined)
townshipUI.highlightPriorityWorkerBtn(this.townData.priorityJob);townshipUI.updateTownNotifications();}
setNextSectionQty(qty){if(this.townData.currentBuildBiome===undefined)
return;this.nextSectionQty=qty;if(this.nextSectionQty<0)
this.nextSectionQty=0;townshipUI.updateNextSectionCost();}
setBuildQty(qty){townshipUI.updateBuildQtyButtons(this.buildQty,qty);this.buildQty=qty;this.updateBuildingsForQuantityChange();}
updateBuildingsForQuantityChange(){townshipUI.updateForBuildQtyChange();this.setBuildBiome(this.townData.currentBuildBiome,false);}
getNextSectionCost(qty){if(this.townData.currentBuildBiome===undefined)
return 0;const availableSpace=this.townData.currentBuildBiome.totalInMap-this.townData.currentBuildBiome.amountPurchased;qty=Math.min(qty,availableSpace);let total=0;for(let i=this.townData.biomesUnlocked;i<this.townData.biomesUnlocked+qty;i++){if(i>=this.townData.sectionsPurchased)
total+=Math.floor(Math.pow(15,0.0100661358978*((i+1)/32)+Math.pow((i+1)/32,0.42)));}
return total;}
getAvailableWorkers(){let total=0;let unemployed=0;this.citizens.forEach((citizen)=>{const age=this.getCitizenAge(citizen);if(age>=this.MIN_WORKER_AGE&&age<=this.MAX_WORKER_AGE){total++;if(citizen.job===this.unemployedJob)
unemployed++;}});return{total,unemployed};}
computeBuildingTownStats(){this.computeBuildingStorage();this.computeMaxWorkerCounts();}
computeTownStats(){this.computePopulationLimit();this.computeTownEducation();this.computeTownDeadStorage();this.computeTownHappiness();this.computeTownResourceGain();this.computeTownHealthPercent();this.renderQueue.townStats=true;this.renderQueue.resourceRates=true;}
computeWorshipAndStats(){const worshipChanged=this.computeWorship();if(worshipChanged)
this.computeProvidedStats(true);else
this.computeTownStats();}
recalculatePopOver55(){this.popOver55=this.citizens.filter((c)=>this.getCitizenAge(c)>=55).length;}
retroactiveCitizenAgeFix(){this.citizens.forEach((c)=>{if(c.job===this.unemployedJob){this.setCitizenAge(c,Math.floor(Math.random()*(100-this.MIN_MIGRATION_AGE))+this.MIN_MIGRATION_AGE);}
else{this.setCitizenAge(c,Math.floor(Math.random()*(this.MAX_WORKER_AGE-this.MIN_WORKER_AGE))+this.MIN_WORKER_AGE);}});}
setCitizenAge(citizen,age){citizen.ticksAlive=Math.ceil(age*(261/(this.TICK_LENGTH/10)));}
getCitizenAge(citizen){return Math.ceil(citizen.ticksAlive/(261/(this.TICK_LENGTH/10)));}
computeWorship(){const oldWorshipTier=this.worshipTier;const buildings=this.buildings.filter((b)=>b.provides.worship!==undefined&&b.provides.worship>0);let count=0;buildings.forEach((b)=>{const worship=b.provides.worship;if(worship!==undefined){count+=worship*this.countNumberOfBuildings(b);this.buildingPenalties.worship.forEach((penalty)=>{if(penalty.resource.amount<1)
count-=penalty.value*worship*penalty.biome.getBuildingCount(b);});}});this.townData.worshipCount=count;const newWorshipTier=this.worshipTier;return oldWorshipTier!==newWorshipTier;}
getDeadStoragePerBuilding(building){if(building.provides.deadStorage===undefined)
return 0;return applyModifier(building.provides.deadStorage,this.game.modifiers.increasedTownshipDeadStorage-this.game.modifiers.decreasedTownshipDeadStorage);}
getTotalDeadStorageForBuilding(building){if(building.provides.deadStorage===undefined)
return 0;return applyModifier(building.provides.deadStorage*this.countNumberOfBuildings(building),this.game.modifiers.increasedTownshipDeadStorage-this.game.modifiers.decreasedTownshipDeadStorage);}
computeTownDeadStorage(){this.townData.deadStorage=this.buildings.reduce((total,building)=>{return total+this.getTotalDeadStorageForBuilding(building);},0);}
computeTownHappiness(){let happiness=0;this.buildings.forEach((building)=>{const buildingCount=this.countNumberOfBuildings(building);if(building.provides.happiness<0){happiness+=building.provides.happiness*buildingCount;this.buildingPenalties.happiness.forEach((penalty)=>{if(penalty.resource.amount<1)
happiness-=penalty.value*building.provides.happiness*penalty.biome.getBuildingCount(building);});}
else
happiness+=building.provides.happiness*buildingCount;});happiness=this.applyBuildingHappinessPenalty(happiness);happiness+=this.townData.education;happiness-=this.getFlatTownHappinessNegatives();const modifiers=this.getTownHappinessNegativeModifiers();if(happiness>=0)
happiness=applyModifier(happiness,modifiers,2);else
happiness=applyModifier(happiness,modifiers);this.townData.happiness=Math.floor(happiness);}
applyBuildingHappinessPenalty(happiness){const modifier=this.game.modifiers.increasedTownshipBuildingHappinessPenalties-
this.game.modifiers.decreasedTownshipBuildingHappinessPenalties;const penalty=Math.max(0,modifier);return applyModifier(happiness,penalty,2);}
shouldApplyStatPenalty(penalty){return(penalty.resource.amount<1&&(penalty.biome===undefined||this.getTotalBuildingsInBiome(penalty.biome)>0)&&(!penalty.maxAgeWorkers||this.isCitizenAtMaxWorkerAge));}
getTownHappinessNegativeModifiers(){let modifier=0;modifier-=this.game.modifiers.increasedTownshipHappiness;modifier+=this.game.modifiers.decreasedTownshipHappiness;this.statPenalties.happinessModifier.forEach((penalty)=>{if(this.shouldApplyStatPenalty(penalty)){let value=penalty.value;if(penalty.scaleWithMaxAgeWorkers)
value*=this.citizensAtMaxWorkerAge;modifier-=value;}});return modifier;}
getFlatTownHappinessNegatives(){let reduction=0;reduction+=this.unemployedCount*5;this.statPenalties.flatHappiness.forEach((penalty)=>{if(this.shouldApplyStatPenalty(penalty)){let value=penalty.value;if(penalty.scaleWithMaxAgeWorkers)
value*=this.citizensAtMaxWorkerAge;reduction+=value;}});if(this.totalDead>this.availableDeadStorage)
reduction+=(this.totalDead-this.availableDeadStorage)*5;return reduction;}
computeTownHealthPercent(){const totalWeight=235;const percentages=[];percentages.push((this.educationPercent/totalWeight)*100);percentages.push((this.happinessPercent/totalWeight)*100);this.healthBonusResources.forEach((resource)=>{const positive=resource.amount>0;const increasing=resource.generation>0;percentages.push(this.getHealthConditionPercent(resource.healthBonus,positive,increasing));});let health=percentages.reduce((a,b)=>a+b,0);health=health*(1+(this.game.modifiers.increasedTownshipHealth-this.game.modifiers.decreasedTownshipHealth)/100);this.townData.healthPercent=Math.max(Math.min(health,100),0);}
getHealthConditionPercent(bonus,positive,increasing){if(bonus===undefined)
return 0;if(positive&&increasing)
return bonus.positiveIncreasing;else if(positive&&!increasing)
return bonus.positiveDecreasing;else if(!positive&&increasing)
return bonus.negativeIncreasing;else
return bonus.negativeDecreasing;}
computeTownEducation(){let education=0;this.buildings.forEach((building)=>{const buildingCount=this.countNumberOfBuildings(building);if(building.provides.education>0&&buildingCount>0)
education+=building.provides.education*buildingCount;this.buildingPenalties.education.forEach((penalty)=>{if(penalty.resource.amount<1)
education-=penalty.value*building.provides.education*penalty.biome.getBuildingCount(building);});});education*=1+(this.game.modifiers.increasedTownshipEducation-this.game.modifiers.decreasedTownshipEducation)/100;this.townData.education=Math.floor(education);}
computePopulationLimit(){const buildingsWithPop=this.buildings.filter((b)=>b.provides.population>0);let population=0;buildingsWithPop.forEach((building)=>{const buildingCount=this.countNumberOfBuildings(building);population+=buildingCount*building.provides.population;});population+=this.game.modifiers.increasedTownshipPopulationCap;population-=this.game.modifiers.decreasedTownshipPopulationCap;this.populationLimit=population;}
computeBuildingStorage(){this.townData.buildingStorage=this.buildings.reduce((total,building)=>{return total+this.countNumberOfBuildings(building)*building.provides.storage;},0);}
getMaxStorage(){let maxStorage=this.townData.buildingStorage+this.BASE_STORAGE;maxStorage*=1+(this.game.modifiers.increasedTownshipMaxStorage-this.game.modifiers.decreasedTownshipMaxStorage)/100;maxStorage=Math.max(1,Math.floor(maxStorage));return maxStorage;}
getUsedStorage(){return this.resources.reduce((total,resource)=>{if(resource.id==="melvorF:GP")
return total;return total+resource.amount;},0);}
getTotalBuildingsInBiome(biome){return biome.totalInMap-biome.availableInMap;}
modifyBuildingResourceCost(quantity){const modifier=Math.max(this.game.modifiers.increasedTownshipBuildingCost-this.game.modifiers.decreasedTownshipBuildingCost,this.DECREASED_BUILDING_COST_CAP);return Math.floor(quantity*(1+modifier/100));}
canAffordBuilding(building,qty=1){return building.costs.every(({resource,quantity})=>{const cost=this.modifyBuildingResourceCost(quantity);return cost<=0||resource.amount>=cost*qty;});}
subtractBuildingCosts(building,qty=1){building.costs.forEach(({resource,quantity})=>{const cost=this.modifyBuildingResourceCost(quantity);resource.amount-=cost*qty;});this.onResourceAmountChange();}
canBuildTierOfBuilding(building,notify=false){const tier=building.tier;if(this.currentPopulation<this.populationForTier[tier].population){if(notify){notifyPlayer(this,templateString(getLangString('TOWNSHIP_MENU','NOTICE_0'),{number:`${tier}`,}),'danger');}
return false;}
if(this.level<this.populationForTier[tier].level){if(notify){notifyPlayer(this,templateString(getLangString('TOWNSHIP_MENU','NOTICE_12'),{number:`${tier}`,}),'danger');}
return false;}
return true;}
canBuildInBiome(biome){switch(biome.id){case "melvorF:Desert":return this.resources.getObjectByID("melvorF:Clothing").amount>=1;case "melvorF:Snowlands":return this.resources.getObjectByID("melvorF:Coal").amount>=1;default:return true;}}
buildBuilding(building){const upgradedFrom=building.upgradesFrom;if(!this.canBuildTierOfBuilding(building,true))
return;if(upgradedFrom!==undefined){const biome=this.currentTownBiome;if(biome===undefined)
return;const buildingCountInBiome=biome.getBuildingCount(upgradedFrom);if(buildingCountInBiome<=0){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_2'),'danger');return;}
if(!this.canBuildInBiome(biome)){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_13'),'danger');return;}
const qtyToUpgrade=Math.min(buildingCountInBiome,this.upgradeQty);if(!this.canAffordBuilding(building,qtyToUpgrade)){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_1'),'danger');return;}
this.subtractBuildingCosts(building,qtyToUpgrade);this.removeBuildingFromBiome(biome,upgradedFrom,qtyToUpgrade);this.addBuildingToBiome(biome,building,qtyToUpgrade);this.updateAllBuildingModifierData();this.computeProvidedStats();this.updateForBuildingChange();this.jobsAreAvailable=true;townshipUI.updateBuilding(upgradedFrom);townshipUI.updateBuilding(building);this.setTownBiome(biome,false);townshipUI.updateBuildingTotalModifierElement(building);townshipUI.updateBuildingTotalModifierElement(upgradedFrom);this.tasks.updateTownshipBuildingTasks(building,qtyToUpgrade);this.tasks.checkForTaskReady(true);notifyPlayer(this,templateString(getLangString('TOWNSHIP_MENU','NOTICE_3'),{buildingName1:`${upgradedFrom.name}`,buildingName2:`${building.name}`,}),'success');}
else{let qtyToBuild=this.buildQty;const biome=this.townData.currentBuildBiome;if(biome===undefined)
return;const availableSpace=this.getAvailableBuildingSpaceInBiome(biome);if(availableSpace<this.buildQty)
qtyToBuild=availableSpace;if(availableSpace<=0){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_4'),'danger');return;}
if(!this.canBuildInBiome(biome)){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_13'),'danger');return;}
if(!this.canAffordBuilding(building,qtyToBuild)){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_1'),'danger');return;}
this.subtractBuildingCosts(building,qtyToBuild);this.addBuildingToBiome(biome,building,qtyToBuild);this.jobsAreAvailable=true;this.updateBuildingModifierData(building);this.computeProvidedStats();this.updateForBuildingChange();townshipUI.updateBuilding(building);townshipUI.updateBiomeBreakdown(biome);townshipUI.updateBuildingTotalModifierElement(building);townshipUI.updateTraderStatus();this.tasks.updateTownshipBuildingTasks(building,qtyToBuild);this.tasks.checkForTaskReady(true);if(biome===this.currentTownBiome)
this.setTownBiome(biome,false);notifyPlayer(this,templateString(getLangString('TOWNSHIP_MENU','NOTICE_5'),{buildingName:`${building.name}`,}),'success');}}
getAvailableBuildingSpaceInBiome(biome){const available=biome.amountPurchased;const count=this.getTotalBuildingsInBiome(biome);return available-count;}
removeBuildingFromBiome(biome,building,count=1){const buildingCountInBiome=biome.getBuildingCount(building);count=Math.min(count,buildingCountInBiome);biome.availableInMap+=count;biome.removeBuildings(building,count);return count;}
addBuildingToBiome(biome,building,count=1){const availableBuildingSpace=this.getAvailableBuildingSpaceInBiome(biome);count=Math.min(count,availableBuildingSpace);biome.availableInMap-=count;biome.addBuildings(building,count);return count;}
destroyHalfCitizens(){for(let i=this.citizens.length-1;i>=0;i--){if(i%2==0){this.destroyCitizen(this.citizens[i],i);}}
this.checkPopulationOverflow();this.renderQueue.citizens=true;}
confirmChangeOfWorship(){this.destroyAllWorshipBuildings();this.destroyHalfCitizens();this.updateAllBuildingModifierData();this.updateForBuildingChange();this.computeProvidedStats();this.biomes.forEach((biome)=>{townshipUI.updateBiomeBreakdown(biome);});this.renderCitizens();}
destroyAllWorshipBuildings(){this.biomes.forEach((biome)=>{biome.buildingsBuilt.forEach((count,building)=>{if(building.provides.worship!==undefined&&building.provides.worship>0){this.removeBuildingFromBiome(biome,building,count);}});});}
destroyAllBuildings(){this.biomes.forEach((biome)=>{biome.buildingsBuilt.forEach((count,building)=>{this.removeBuildingFromBiome(biome,building,count);this.computeMaxWorkerCounts();this.removeOverflowingWorkers(building);});});this.updateAllBuildingModifierData();this.updateForBuildingChange();this.computeProvidedStats();this.biomes.forEach((biome)=>{townshipUI.updateBiomeBreakdown(biome);});townshipUI.updateTraderStatus();}
destroyBuilding(building,render=true){const biome=this.currentTownBiome;if(biome===undefined)
return;const buildingCountInBiome=biome.getBuildingCount(building);const qtyToDestroy=Math.min(buildingCountInBiome,this.destroyQty);const destroyed=this.removeBuilding(building,qtyToDestroy);if(destroyed&&render){this.updateUnemployedCount=true;this.computeProvidedStats();this.updateForBuildingChange();townshipUI.updateBuilding(building);townshipUI.updateBiomeBreakdown(biome);townshipUI.updateBuildingTotalModifierElement(building);townshipUI.updateTraderStatus();notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_10'),'primary');}}
removeBuilding(building,count=1){const biome=this.currentTownBiome;if(biome===undefined)
return false;if(biome.getBuildingCount(building)<1){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_6'),'danger');return false;}
this.removeBuildingFromBiome(biome,building,count);this.computeMaxWorkerCounts();this.removeOverflowingWorkers(building);this.updateAllBuildingModifierData();return true;}
removeOverflowingWorkers(building){building.provides.workers.forEach((_,job)=>{const currentWorkers=job.assigned;const maxWorkers=job.maxAvailable;if(currentWorkers>maxWorkers){const workersToRemove=currentWorkers-maxWorkers;for(let i=0;i<workersToRemove;i++){this.removeRandomCitizenFromJob(job);}}});}
computeModifiersFromBuildings(){this.modifiersFromBuildings.reset();this.buildings.forEach((building)=>{if(building.providedModifiers!==undefined)
this.modifiersFromBuildings.addMappedModifiers(building.providedModifiers);});}
computeProvidedStats(updatePlayer=true){this.modifiers.reset();this.modifiers.addModifiers(this.townData.worship.modifiers);this.WORSHIP_CHECKPOINTS.forEach((checkpoint,id)=>{if(this.worshipPercent>=checkpoint)
this.modifiers.addModifiers(this.townData.worship.checkpoints[id]);});this.modifiers.addMappedModifiers(this.modifiersFromBuildings);if(updatePlayer)
this.game.combat.player.computeAllStats();}
setModifiers(building){const modifiers=building.modifiers;if(modifiers===undefined)
return;if(building.providedModifiers===undefined){building.providedModifiers=new MappedModifiers();}
else{building.providedModifiers.reset();}
const buildingCount=this.countNumberOfBuildings(building);if(buildingCount>0)
building.providedModifiers.addModifiers(modifiers,buildingCount,buildingCount);}
updateBuildingModifierData(building){this.setModifiers(building);this.computeModifiersFromBuildings();this.computeProvidedStats();}
updateAllBuildingModifierData(){const buildingsWithMods=this.buildings.filter((b)=>b.modifiers!==undefined);buildingsWithMods.forEach((b)=>{this.setModifiers(b);});this.computeModifiersFromBuildings();}
updateForBuildingChange(){this.computeBuildingTownStats();this.computeWorshipAndStats();this.renderQueue.buildingCosts=true;this.renderQueue.buildingProvides=true;townshipUI.updateWorshipCountSpan();this.updateUnemployedCount=true;this.renderQueue.traderStock=true;townshipUI.updateTraderStockAvailable();}
buyNewSectionOfLand(){const biome=this.townData.currentBuildBiome;if(biome===undefined||this.townData.biomesUnlocked>=this.MAX_TOWN_SIZE)
return;const availableSections=biome.totalInMap;const currentSections=biome.amountPurchased;if(currentSections>=availableSections){notifyPlayer(this,getLangString('TOWNSHIP_MENU','MAX_BIOME_PURCHASED'),'danger');return;}
if(this.nextSectionQty<1)
return;const totalCost=this.getNextSectionCost(this.nextSectionQty);if(!this.game.gp.canAfford(totalCost)){notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_7'),'danger');return;}
this.game.gp.remove(totalCost);this.addSectionOfLand(biome,this.nextSectionQty);this.biomes.forEach((b)=>{townshipUI.updateBiomeBreakdown(b);});this.setBuildBiome(this.townData.currentBuildBiome,false);this.setNextSectionQty(this.nextSectionQty);townshipUI.updateTotalBiomesPurchased();}
addSectionOfLand(biome,qty){const availableSpace=game.township.townData.currentBuildBiome.totalInMap-game.township.townData.currentBuildBiome.amountPurchased;qty=Math.min(qty,availableSpace);biome.amountPurchased+=qty;this.townData.biomesUnlocked+=qty;if(this.townData.biomesUnlocked>this.townData.sectionsPurchased)
this.townData.sectionsPurchased=this.townData.biomesUnlocked;}
getGPGainRate(){const gain=this.currentPopulation*(this.taxRate/100);const over70=this.citizens.filter((c)=>this.getCitizenAge(c)>this.MAX_WORKER_AGE).length*(this.taxRate/100);const modifier=this.game.modifiers.increasedTownshipGPProduction-this.game.modifiers.decreasedTownshipGPProduction;return Math.floor((gain+over70)*(this.TICK_LENGTH/10)*(1+modifier/100));}
getBuildingsWithResource(resource){const buildingsWithResource=this.buildings.filter((building)=>building.provides.resourceCount(resource)>0||building.provides.resourceCount(resource)<0);let buildingBiomeBreakdown=[];this.biomes.forEach((biome)=>{buildingsWithResource.forEach((building)=>{const count=biome.getBuildingCount(building);if(count>0){const baseAmount=building.provides.resourceCount(resource);const amount=this.getSingleResourceGainAmountInBiome(resource,building,biome);buildingBiomeBreakdown.push({building,biome,count,amount,baseAmount});}});});buildingBiomeBreakdown=buildingBiomeBreakdown.sort((a,b)=>{return a.amount-b.amount;});return buildingBiomeBreakdown;}
computeTownResourceGain(){this.resources.forEach((resource)=>{let generation=0;let baseGeneration=0;const job=resource.producingJob;if(resource.id==="melvorF:GP")
generation=this.getGPGainRate();else if(job!==undefined){const buildingsWithResource=this.getBuildingsWithResource(resource).reverse();let totalWorkers=job.assigned;if(totalWorkers>0){buildingsWithResource.forEach(({building,count,amount,baseAmount})=>{const workersToRemove=Math.min(count*building.provides.workerCount(job),totalWorkers);baseGeneration+=baseAmount*workersToRemove*100*(this.TICK_LENGTH/10);generation+=workersToRemove*amount;totalWorkers-=workersToRemove;});}}
resource.generation=generation;resource.baseGeneration=baseGeneration;});}
getBiomeResourceProductionModifier(biome){let modifier=0;switch(biome.id){case "melvorF:Grasslands":modifier+=this.game.modifiers.increasedTownshipGrasslandsProduction;modifier-=this.game.modifiers.decreasedTownshipGrasslandsProduction;break;case "melvorF:Forest":modifier+=this.game.modifiers.increasedTownshipForestProduction;modifier-=this.game.modifiers.decreasedTownshipForestProduction;break;case "melvorF:Desert":modifier+=this.game.modifiers.increasedTownshipDesertProduction;modifier-=this.game.modifiers.decreasedTownshipDesertProduction;break;case "melvorF:Water":modifier+=this.game.modifiers.increasedTownshipWaterProduction;modifier-=this.game.modifiers.decreasedTownshipWaterProduction;break;case "melvorF:Swamp":modifier+=this.game.modifiers.increasedTownshipSwampProduction;modifier-=this.game.modifiers.decreasedTownshipSwampProduction;break;case "melvorF:Arid_Plains":modifier+=this.game.modifiers.increasedTownshipAridPlainsProduction;modifier-=this.game.modifiers.decreasedTownshipAridPlainsProduction;break;case "melvorF:Mountains":modifier+=this.game.modifiers.increasedTownshipMountainsProduction;modifier-=this.game.modifiers.decreasedTownshipMountainsProduction;break;case "melvorF:Valley":modifier+=this.game.modifiers.increasedTownshipValleyProduction;modifier-=this.game.modifiers.decreasedTownshipValleyProduction;break;case "melvorF:Snowlands":modifier+=this.game.modifiers.increasedTownshipSnowlandsProduction;modifier-=this.game.modifiers.decreasedTownshipSnowlandsProduction;break;}
this.buildingPenalties.resources.forEach((penalty)=>{if(penalty.biome===biome&&penalty.resource.amount<1)
modifier-=penalty.value;});return modifier;}
getBuildingResourceProductionModifier(building){let modifier=0;switch(building.id){case "melvorF:Fishermans_Dock":case "melvorF:Fishermans_Pier":case "melvorF:Fishermans_Port":case "melvorTotH:Fishermans_Estate":modifier+=this.game.modifiers.increasedTownshipFishingDockProduction;modifier-=this.game.modifiers.decreasedTownshipFishingDockProduction;break;case "melvorF:Woodcutters_Camp":case "melvorF:Logging_Camp":case "melvorF:Forestry_Camp":case "melvorTotH:Forestry_Estate":modifier+=this.game.modifiers.increasedTownshipWoodcuttingProduction;modifier-=this.game.modifiers.decreasedTownshipWoodcuttingProduction;break;case "melvorF:Blacksmiths_Smithy":case "melvorF:Blacksmiths_Forge":case "melvorF:Blacksmiths_Workshop":case "melvorTotH:Blacksmiths_Estate":modifier+=this.game.modifiers.increasedTownshipBlacksmithProduction;modifier-=this.game.modifiers.decreasedTownshipBlacksmithProduction;break;case "melvorF:Farmland":case "melvorF:Mill":case "melvorF:Plantation":case "melvorTotH:Farming_Estate":modifier+=this.game.modifiers.increasedTownshipFarmProduction;modifier-=this.game.modifiers.decreasedTownshipFarmProduction;break;case "melvorF:Magic_Emporium":modifier+=this.game.modifiers.increasedTownshipMagicEmporiumProduction;modifier-=this.game.modifiers.decreasedTownshipMagicEmporiumProduction;break;case "melvorF:Orchard":modifier+=this.game.modifiers.increasedTownshipOrchardProduction;modifier-=this.game.modifiers.decreasedTownshipOrchardProduction;break;}
return modifier;}
getSingleResourceGainAmountInBiome(resource,building,biome){let amount=building.provides.resourceCount(resource)*100*(this.TICK_LENGTH/10);if(amount>0){let modifier=building.getBiomeModifier(biome);modifier+=this.getBiomeResourceProductionModifier(biome)+this.getBuildingResourceProductionModifier(building);amount*=1+modifier/100;amount*=1+this.getResourceGainModifier(resource)/100;return Math.max(amount,0);}
return amount;}
getResourceGainModifier(resource){let modifier=0;modifier+=this.educationPercent;switch(resource.id){case "melvorF:Food":modifier+=this.game.modifiers.increasedTownshipFoodProduction;modifier-=this.game.modifiers.decreasedTownshipFoodProduction;break;case "melvorF:Wood":modifier+=this.game.modifiers.increasedTownshipWoodProduction;modifier-=this.game.modifiers.decreasedTownshipWoodProduction;break;case "melvorF:Stone":modifier+=this.game.modifiers.increasedTownshipStoneProduction;modifier-=this.game.modifiers.decreasedTownshipStoneProduction;break;case "melvorF:Ore":modifier+=this.game.modifiers.increasedTownshipOreProduction;modifier-=this.game.modifiers.decreasedTownshipOreProduction;break;case "melvorF:Coal":modifier+=this.game.modifiers.increasedTownshipCoalProduction;modifier-=this.game.modifiers.decreasedTownshipCoalProduction;break;case "melvorF:Herbs":modifier+=this.game.modifiers.increasedTownshipHerbProduction;modifier-=this.game.modifiers.decreasedTownshipHerbProduction;break;case "melvorF:Planks":modifier+=this.game.modifiers.increasedTownshipPlankProduction;modifier-=this.game.modifiers.decreasedTownshipPlankProduction;break;case "melvorF:Leather":modifier+=this.game.modifiers.increasedTownshipLeatherProduction;modifier-=this.game.modifiers.decreasedTownshipLeatherProduction;break;case "melvorF:Clothing":modifier+=this.game.modifiers.increasedTownshipClothingProduction;modifier-=this.game.modifiers.decreasedTownshipClothingProduction;break;case "melvorF:Potions":modifier+=this.game.modifiers.increasedTownshipPotionProduction;modifier-=this.game.modifiers.decreasedTownshipPotionProduction;break;case "melvorF:Bar":modifier+=this.game.modifiers.increasedTownshipBarProduction;modifier-=this.game.modifiers.decreasedTownshipBarProduction;break;case "melvorF:Rune_Essence":modifier+=this.game.modifiers.increasedTownshipRuneEssenceProduction;modifier-=this.game.modifiers.decreasedTownshipRuneEssenceProduction;break;}
modifier+=this.game.modifiers.increasedTownshipResourceProduction;modifier-=this.game.modifiers.decreasedTownshipResourceProduction;return modifier;}
getTrueResourceUsage(resource){let usage=0;if(resource.id==="melvorF:Food")
usage+=this.foodUsage;if(resource.id==="melvorF:Potions")
usage+=this.potionUsage;const usedIn=this.resources.filter((r)=>r.requires.has(resource));if(usedIn.length){usedIn.forEach((user)=>{const requiredAmount=user.requiredCount(resource);if(requiredAmount!==undefined)
usage+=this.getTrueMaxProductCreationAmount(user,true)*requiredAmount*100;});}
usage+=this.getResourceBiomeUsage(resource);return usage;}
getResourceUsage(resource){let usage=0;if(resource.id==="melvorF:Food")
usage+=this.foodUsage;if(resource.id==="melvorF:Potions")
usage+=this.potionUsage;const usedIn=this.resources.filter((r)=>r.requires.has(resource));if(usedIn.length){usedIn.forEach((user)=>{const requiredAmount=user.requiredCount(resource);if(requiredAmount!==undefined)
usage+=this.getMaxProductCreationAmount(user,true)*requiredAmount*100;});}
usage+=this.getResourceBiomeUsage(resource);return usage;}
getResourceBiomeUsage(resource){let usage=0;let modifier=0;if(resource.id==="melvorF:Coal")
modifier+=this.game.modifiers.increasedTownshipCoalUsage-this.game.modifiers.decreasedTownshipCoalUsage;if(resource.biomeUsage.size>0){resource.biomeUsage.forEach((quantity,biome)=>{const buildingsInBiome=this.getTotalBuildingsInBiome(biome);usage+=quantity*100*(this.TICK_LENGTH/10)*buildingsInBiome*(1+modifier/100);});}
return usage;}
getSingleResourceUsageInBiome(resource,biome){let usage=0;let modifier=0;if(resource.id==="melvorF:Coal")
modifier+=this.game.modifiers.increasedTownshipCoalUsage-this.game.modifiers.decreasedTownshipCoalUsage;const biomeUsage=resource.biomeUsage.get(biome);if(biomeUsage!==undefined)
usage=biomeUsage*100*(this.TICK_LENGTH/10)*(1+modifier/100);return usage;}
getAllBuildingWorkerCount(){return this.jobs.reduce((total,job)=>{return total+job.assigned;},0);}
computeMaxWorkerCounts(){this.jobs.forEach((job)=>{this.computeMaxWorkerCount(job);});this.renderQueue.workerCounts=true;}
computeMaxWorkerCount(job){const buildings=this.buildings.filter((b)=>b.provides.workers.has(job));let maxWorkers=0;buildings.forEach((building)=>{maxWorkers+=building.provides.workerCount(job)*this.countNumberOfBuildings(building);});job.maxAvailable=maxWorkers;}
countNumberOfBuildings(building){return this.biomes.reduce((prev,biome)=>{return prev+biome.getBuildingCount(building);},0);}
addWorker(citizen,job){if(this.getAllBuildingWorkerCount()>=this.currentPopulation)
return;if(job.assigned>=job.maxAvailable)
return;this.assignCitizenToJob(citizen,job);}
removeWorker(citizen){const job=citizen.job;if(job.assigned<=0||job===this.unemployedJob)
return;this.removeCitizenFromJob(citizen);}
assignCitizenToJob(citizen,job){citizen.job=job;job.assigned++;this.renderQueue.workerCounts=true;}
removeCitizenFromJob(citizen){citizen.job.assigned--;citizen.job=this.unemployedJob;this.jobsAreAvailable=true;this.renderQueue.workerCounts=true;}
removeRandomCitizenFromJob(job){const citizen=this.citizens.find((c)=>c.job===job);if(citizen===undefined)
return;this.removeCitizenFromJob(citizen);}
addPopulation(){if(this.currentPopulation>=this.populationLimit)
return;if(this.popGrowthResources.every((resource)=>resource.amount>0)&&Math.random()>this.populationGainChance)
return;let populationGain=this.populationGainRate;if(this.currentPopulation+populationGain>this.populationLimit)
populationGain=this.populationLimit-this.currentPopulation;for(let i=0;i<populationGain;i++){let citizenSource=CitizenSource.Birth;const random=Math.random();if(random>0.1||this.currentPopulation<this.POPULATION_REQUIRED_FOR_BIRTH)
citizenSource=CitizenSource.Migration;this.addNewCitizen(citizenSource);}}
getTrueMaxProductCreationAmount(resource,withoutModifiers=false){if(resource.requires.size===0)
return 0;const amounts=[];let removedFromStorage=0;resource.requires.forEach((quantity,resource)=>{const baseAmount=resource.amount;const maxAmount=Math.floor((baseAmount+resource.generation)/(quantity*100));amounts.push(maxAmount);removedFromStorage+=maxAmount;});let min=Math.max(0,this.getMaxStorage()-this.getUsedStorage()+removedFromStorage);if(amounts.length){const generation=withoutModifiers?resource.baseGeneration:resource.generation;min=Math.min(...amounts,min,generation);}
return min;}
getMaxProductCreationAmount(resource,withoutModifiers=false){if(resource.requires.size===0)
return 0;const amounts=[];let removedFromStorage=0;resource.requires.forEach((quantity,resource)=>{const baseAmount=resource.amount;const maxAmount=Math.floor(baseAmount/(quantity*100));amounts.push(maxAmount);removedFromStorage+=maxAmount;});let min=Math.max(0,this.getMaxStorage()-this.getUsedStorage()+removedFromStorage);if(amounts.length){const generation=withoutModifiers?resource.baseGeneration:resource.generation;min=Math.min(...amounts,min,generation);}
return min;}
getMaxRawCreationAmount(resource){let amount=resource.generation;if(resource.id==="melvorF:Food")
amount-=this.foodUsage;if(resource.id==="melvorF:Potions")
amount-=this.potionUsage;amount-=this.getResourceBiomeUsage(resource);if(amount+this.getUsedStorage()>=this.getMaxStorage())
amount=this.getMaxStorage()-this.getUsedStorage();return amount;}
getNetResourceRate(resource){const gain=resource.type===TownshipResourceTypeID.Product?this.getTrueMaxProductCreationAmount(resource):resource.generation;return gain-this.getTrueResourceUsage(resource);}
addResources(){this.resources.forEach((resource)=>{if(resource.id==="melvorF:GP"){const gpToAdd=this.getGPGainRate();resource.amount+=gpToAdd;this.game.gp.add(gpToAdd);return;}
let amount=resource.generation;let baseAmount=resource.baseGeneration;if(resource.type===TownshipResourceTypeID.Product){amount=this.getMaxProductCreationAmount(resource);baseAmount=this.getMaxProductCreationAmount(resource,true);resource.requires.forEach((quantity,requiredResource)=>{requiredResource.amount-=quantity*100*baseAmount;});amount-=this.getResourceUsage(resource);}
else
amount=this.getMaxRawCreationAmount(resource);resource.amount+=amount;if(resource.amount>this.getMaxResourceAmount(resource))
resource.amount=this.getMaxResourceAmount(resource);});this.onResourceAmountChange();}
getMaxResourceAmount(resource){return this.getMaxStorage()*(resource.cap/100);}
applyRandomJobToCitizen(citizen){if(citizen.job!==this.unemployedJob||this.getCitizenAge(citizen)<this.MIN_WORKER_AGE||this.getCitizenAge(citizen)>this.MAX_WORKER_AGE)
return;const job=this.findAvailableJobForCitzen();if(job!==this.unemployedJob)
this.addWorker(citizen,job);}
findAvailableJobForCitzen(){const availableJobs=this.jobs.filter((job)=>job!==this.unemployedJob&&job.maxAvailable>job.assigned);if(!availableJobs.length){this.jobsAreAvailable=false;return this.unemployedJob;}
const foodJob=this.jobs.getObjectByID("melvorF:Fisherman");let job=foodJob!==undefined&&availableJobs.includes(foodJob)?foodJob:getRandomArrayElement(availableJobs);if(this.townData.priorityJob!==undefined&&availableJobs.includes(this.townData.priorityJob))
job=this.townData.priorityJob;return job;}
updateDeadStorage(){if(this.totalTicks%this.decayTickAmount===0){this.townData.dead-=this.deadDecayAmount;}
if(this.townData.dead<0)
this.townData.dead=0;}
updateCitizens(){for(let i=this.citizens.length-1;i>=0;i--){const c=this.citizens[i];c.ticksAlive++;this.updateCitizenInfo(c);if(this.jobsAreAvailable)
this.applyRandomJobToCitizen(c);if(this.shouldWeKillThisCitizen(c))
this.destroyCitizen(c,i);}
this.checkPopulationOverflow();this.renderQueue.citizens=true;}
assignWorkersOnLoad(){this.citizens.forEach((c)=>{this.applyRandomJobToCitizen(c);});}
updateCitizenInfo(citizen){if(citizen.ticksAlive/(261/(this.TICK_LENGTH/10))===55)
this.popOver55++;this.checkCitizenRetirement(citizen);}
checkCitizenRetirement(citizen){if(this.getCitizenAge(citizen)>this.MAX_WORKER_AGE&&citizen.job!==this.unemployedJob)
this.removeWorker(citizen);}
checkPopulationOverflow(){if(this.currentPopulation>this.populationLimit){const citizensToRemove=Math.ceil((this.currentPopulation-this.populationLimit)/4);let removed=0;while(removed<citizensToRemove){let citizen=this.citizens.find((citizen)=>citizen.job===this.unemployedJob);if(citizen===undefined){citizen=this.citizens[Math.floor(Math.random()*this.citizens.length)];this.jobsAreAvailable=true;}
this.destroyCitizen(citizen,this.citizens.indexOf(citizen));removed++;}}}
getChanceToDestroyCitizen(citizen){const age=this.getCitizenAge(citizen);let chanceToDestroy=0;if(age>=this.AGE_OF_DEATH){const healthPercent=this.townData.healthPercent;chanceToDestroy+=((100-healthPercent)/100/381)*(1+(1-healthPercent/100));}
this.statPenalties.deathRate.forEach((penalty)=>{if(this.shouldApplyStatPenalty(penalty)){let value=penalty.value;if(penalty.scaleWithMaxAgeWorkers)
value*=this.citizensAtMaxWorkerAge;chanceToDestroy+=value;}});return chanceToDestroy;}
shouldWeKillThisCitizen(citizen){const age=this.getCitizenAge(citizen);if(age>=100)
return true;const random=Math.random();const chanceToDestroy=this.getChanceToDestroyCitizen(citizen);return(random<chanceToDestroy&&!this.deathPreventingResources.some((resource)=>{if(resource.preventCitizenDeath===undefined)
return false;return(resource.amount>0&&resource.preventCitizenDeath.resources.every((resource)=>resource.amount>0)&&age<resource.preventCitizenDeath.maxAge);}));}
destroyCitizen(citizen,index){this.removeWorker(citizen);const age=this.getCitizenAge(citizen);if(age>=55)
this.popOver55-=1;if(age<100)
this.townData.dead++;this.citizens.splice(index,1);this.renderQueue.extraBuildingRequirements=true;}
setResourceCap(resource,cap){resource.cap=cap;townshipUI.updateResourceCapElement(resource);townshipUI.updateResourceAmounts();}
processYeet(resource,amount){const amountOwned=resource.amount;const amountToYeet=Math.min(amountOwned,amount);resource.amount-=amountToYeet;this.computeWorshipAndStats();this.onResourceAmountChange();notifyPlayer(this,templateString(getLangString('TOWNSHIP_MENU','YEETED'),{qty:numberWithCommas(amountToYeet),resourceName:resource.name,}),'danger');}
updateConvertQty(value){this.convertQty=value;townshipUI.updateConvertQtyElements();}
updateConvertToQty(value,resource,item){switch(this.convertQtyType){case 0:this.convertQty=Math.min(value,Math.floor(game.bank.getQty(item)/this.getBaseConvertToTownshipRatio(resource,item)));break;case 1:this.convertQty=Math.max(1,Math.floor(game.bank.getQty(item)*(this.convertQtyPercent/100)));this.convertQty=Math.floor(this.convertQty/this.getBaseConvertToTownshipRatio(resource,item));break;case 2:this.convertQty=Math.floor(game.bank.getQty(item)-1);this.convertQty=Math.floor(this.convertQty/this.getBaseConvertToTownshipRatio(resource,item));break;}}
updateConvertFromQty(value,resource,item){const baseConvert=this.getBaseConvertFromTownshipRatio(resource,item);switch(this.convertQtyType){case 0:this.convertQty=Math.min(value,Math.floor(resource.amount/baseConvert));break;case 1:this.convertQty=Math.max(1,Math.floor(resource.amount*(this.convertQtyPercent/100)));this.convertQty=Math.floor(Math.min(this.convertQty/baseConvert,this.townData.traderStock/Math.max(item.sellsFor,1)));break;case 2:this.convertQty=Math.floor(resource.amount-1);this.convertQty=Math.floor(Math.min(this.convertQty/baseConvert,this.townData.traderStock/Math.max(item.sellsFor,1)));break;}}
getConvertToTownshipRatio(resource,item){return this.getBaseConvertToTownshipRatio(resource,item)*this.convertQty;}
getConvertFromTownshipRatio(resource,item){return this.getBaseConvertFromTownshipRatio(resource,item)*this.convertQty;}
getBaseConvertToTownshipRatio(resource,item){switch(resource.id){case "melvorF:Food":if(!(item instanceof FoodItem))
throw new Error('Item is not a FoodItem.');return Math.max(Math.floor(1000/(item.healsFor*10)),2);case "melvorF:Planks":return Math.max(Math.floor(3000/Math.max(item.sellsFor,1)),2);case "melvorF:Rune_Essence":return 5;case "melvorF:Leather":return 20;default:return Math.max(Math.floor(1000/Math.max(item.sellsFor,1)),2);}}
getBaseConvertFromTownshipRatio(resource,item){switch(resource.id){case "melvorF:Food":if(!(item instanceof FoodItem))
throw new Error('Item is not a FoodItem');return item.healsFor*5*6*5;case "melvorF:Planks":return Math.max(Math.ceil(item.sellsFor/2)*6,1);case "melvorF:Rune_Essence":return(item.sellsFor+1)*10*6;case "melvorF:Leather":return 20*6;default:return Math.max(item.sellsFor*6,1);}}
processConversionToTownship(item,resource){const convertRatio=this.getConvertToTownshipRatio(resource,item);const quantityOwned=this.game.bank.getQty(item);if(quantityOwned>=0){const count=this.getMaxPossibleConvertToTownshipValue();if(count<this.convertQty)
return notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_8'),'danger');const amountRequired=convertRatio;if(quantityOwned>=amountRequired){this.game.bank.removeItemQuantity(item,amountRequired,true);resource.amount+=count;itemNotify(item,-amountRequired);this.onResourceAmountChange();this.computeWorshipAndStats();}
else if(amountRequired<1)
notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_9'),'danger');else if(quantityOwned<amountRequired)
notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_9'),'danger');}
else
notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_9'),'danger');}
processConversionFromTownship(item,resource){const convertRatio=this.getConvertFromTownshipRatio(resource,item);const count=this.getMaxPossibleConvertFromTownshipValue(resource,convertRatio);if(count<=0)
return notifyPlayer(this,getLangString('TOWNSHIP_MENU','NOTICE_11'),'danger');const amountToGive=this.convertQty;this.game.bank.addItem(item,amountToGive,true,true);this.townData.traderStock-=amountToGive*item.sellsFor;resource.amount-=convertRatio;this.onResourceAmountChange();this.computeWorshipAndStats();this.renderQueue.traderStock=true;this.render();}
getMaxPossibleConvertToTownshipValue(){let count=this.convertQty;if(count+this.getUsedStorage()>this.getMaxStorage())
count=this.getMaxStorage()-this.getUsedStorage();return count;}
getMaxPossibleConvertFromTownshipValue(resource,convertRatio){let count=this.convertQty;const currentResourceCount=resource.amount;if(currentResourceCount<convertRatio)
count=Math.floor(currentResourceCount/convertRatio);return count;}
testTranslations(){super.testTranslations();this.resources.forEach((resource)=>{resource.name;});this.jobs.forEach((job)=>{job.name;});this.biomes.forEach((biome)=>{biome.name;biome.description;});this.buildings.forEach((building)=>{building.name;building.description;});this.worships.forEach((worship)=>{worship.name;worship.statueName;});this.maps.forEach((map)=>{map.name;});}}
class TownshipUI{constructor(township){this.township=township;this.currentPage=0;this.defaultElements={btn:{town:document.getElementById('BTN_TOWN'),build:document.getElementById('BTN_BUILD'),convertResources:document.getElementById('BTN_CONVERT_RESOURCES'),yeetResources:document.getElementById('BTN_YEET_RESOURCES'),settings:document.getElementById('BTN_SETTINGS'),tasks:document.getElementById('BTN_TASKS'),citizens:document.getElementById('BTN_CITIZENS'),},div:{town:document.getElementById('DIV_TOWN'),build:document.getElementById('DIV_BUILD'),convertResources:document.getElementById('DIV_CONVERT_RESOURCES'),yeetResources:document.getElementById('DIV_YEET_RESOURCES'),citizens:document.getElementById('DIV_CITIZENS'),settings:document.getElementById('DIV_SETTINGS'),ticks:document.getElementById('DIV_TICKS'),mainInfo:document.getElementById('DIV_MAIN_INFO'),resources:document.getElementById('DIV_RESOURCES'),container:document.getElementById('DIV_CONTAINER'),worship:document.getElementById('DIV_WORSHIP'),currentWorshipModal:document.getElementById('DIV_CURRENT_WORSHIP_MODAL'),worshipModal:document.getElementById('DIV_WORSHIP_MODAL'),worshipModifiers:document.getElementById('DIV_WORSHIP_MODIFIERS'),worshipModifiersModal:document.getElementById('DIV_WORSHIP_MODIFIERS_MODAL'),generateTown:document.getElementById('DIV_GENERATE_TOWN'),townBreakdown:document.getElementById('DIV_TOWN_BREAKDOWN'),tasks:document.getElementById('DIV_TASKS'),},town:{population:document.getElementById('TOWN_POPULATION'),happiness:document.getElementById('TOWN_HAPPINESS'),education:document.getElementById('TOWN_EDUCATION'),health:document.getElementById('TOWN_HEALTH'),worship:document.getElementById('TOWN_WORSHIP'),deadStorage:document.getElementById('TOWN_DEAD_STORAGE'),breakdown:{map:document.getElementById('TOWNSHIP_TOWN_SUMMARY_MAP'),worship:document.getElementById('TOWNSHIP_TOWN_SUMMARY_WORSHIP'),worshipProgress:document.getElementById('TOWNSHIP_TOWN_SUMMARY_WORSHIP_PROGRESS'),boimesPurchased:document.getElementById('TOWNSHIP_TOWN_SUMMARY_BIOMES_PURCHASED'),storage:document.getElementById('TOWNSHIP_TOWN_SUMMARY_STORAGE'),population:document.getElementById('TOWNSHIP_TOWN_SUMMARY_POPULATION'),availableWorkers:document.getElementById('TOWNSHIP_TOWN_SUMMARY_AVAILABLE_WORKERS'),deadStorage:document.getElementById('TOWNSHIP_TOWN_SUMMARY_DEAD_STORAGE'),over55:document.getElementById('TOWNSHIP_TOWN_SUMMARY_OVER_55'),over70:document.getElementById('TOWNSHIP_TOWN_SUMMARY_OVER_70'),},},trader:{trader:document.getElementById('TOWN_TRADER'),traderAvailable:document.getElementById('TOWN_TRADER_AVAILABLE'),traderNotAvailable:document.getElementById('TOWN_TRADER_NOT_AVAILABLE'),arrivesIn:document.getElementById('TOWN_TRADER_AVAILABLE_IN'),leavesIn:document.getElementById('TOWN_TRADER_NOT_AVAILABLE_IN'),noTradingPost:document.getElementById('TOWN_TRADER_NO_TRADING_POST'),},notifications:{build:{alert:document.getElementById('BUILD_BIOME_NOTIFICATION'),usage:document.getElementById('BUILD_BIOME_RESOURCE_USAGE'),message:document.getElementById('BUILD_BIOME_RESOURCE_MESSAGE'),},town:{alert:document.getElementById('TOWN_BIOME_NOTIFICATION'),usage:document.getElementById('TOWN_BIOME_RESOURCE_USAGE'),message:document.getElementById('TOWN_BIOME_RESOURCE_MESSAGE'),noResourceAlerts:document.getElementById('TOWN_NO_RESOURCE_NOTIFICATIONS'),noFood:document.getElementById('TOWN_NO_FOOD_NOTIFICATION'),},global:{noFood:document.getElementById('TOWN_NO_FOOD_NOTIFICATION'),losingFood:document.getElementById('TOWN_LOSING_FOOD_NOTIFICATION'),noPriority:document.getElementById('TOWN_NO_PRIORITY_NOTIFICATION'),noStorage:document.getElementById('TOWN_NO_STORAGE_NOTIFICATION'),},},icon:{taskReady:document.getElementById('TOWNSHIP_TASK_READY_ICON'),},};this.resourceDisplays=new Map();this.townBiomeSelectButtons=new Map();this.buildingsInTown=new Map();this.buildBiomeSelectOptions=new Map();this.buildBiomeSelectButtons=new Map();this.buildBuildings=new Map();this.conversionElements=new Map();this.worshipSelects=new Map();this.worshipSelectsModal=new Map();this.biomeNoResourceAlerts=new Map();this.capResourceElements=new Map();this.filterIconElements=new Map();this.sortList={showAll:[true],buildingType:[false,false,false,false,false,false],resource:[false,false,false,false,false,false,false,false,false,false,false,false,false],};this.townViewTab=1;if(!this.township.townData.townCreated)
return;}
loadTownshipUI(){this.generateTownBiomeData();this.displayTownSummary();this.generateBuildBuildings();this.createResourceBreakdownTable();this.createTickBtns();this.createBtnEvents();this.updateTownStats();this.setupTownTooltips();this.buildCapResourceElements();this.buildYeetItemElement();this.buildConvertItemElements();this.updateNextSectionCost();this.createWorshipSelection();if(this.township.townData.priorityJob!==undefined)
this.highlightPriorityWorkerBtn(this.township.townData.priorityJob);this.showPage(this.currentPage);this.updateBuildQtyButtons(1,this.township.buildQty);this.updateCurrentWorship();this.setTownViewTab(this.townViewTab);this.updateTraderStockAvailable();this.updateBuildingCounts();this.updateTotalBiomesPurchased();}
updateTownStats(){this.updatePopulation();this.updateHappiness();this.updateEducation();this.updateHealth();this.updateWorship();this.updateDeathStorageBreakdown();this.updateStorageBreakdown();this.updateWorkersAvailable();}
updateTownNotifications(){let showAlertBox=false;this.biomeNoResourceAlerts.forEach((alert,biome)=>{if(biome.resourceUsage!==undefined&&biome.resourceUsage.resource.amount<1&&this.township.getTotalBuildingsInBiome(biome)>0){alert.classList.replace('d-none','d-flex');showAlertBox=true;}
else{alert.classList.replace('d-flex','d-none');}});if(showAlertBox){showElement(this.defaultElements.notifications.town.noResourceAlerts);}
else{hideElement(this.defaultElements.notifications.town.noResourceAlerts);}
const food=this.township.resources.getObjectByID('melvorF:Food');if(food!==undefined){if(food.amount<=0)
showElement(this.defaultElements.notifications.global.noFood);else
hideElement(this.defaultElements.notifications.global.noFood);if(this.township.getNetResourceRate(food)<=0)
showElement(this.defaultElements.notifications.global.losingFood);else
hideElement(this.defaultElements.notifications.global.losingFood);}
this.updateTownBiomeSelectionNotifications();if(this.township.townData.priorityJob===undefined)
showElement(this.defaultElements.notifications.global.noPriority);else
hideElement(this.defaultElements.notifications.global.noPriority);}
updateTicksAvailable(){const element=document.getElementById('TOWNSHIP_TICKS_AVAILABLE');if(element===null)
return;element.textContent=numberWithCommas(this.township.availableGameTicksToSpend);}
getPageButton(page){switch(page){case 0:return this.defaultElements.btn.town;case 1:return this.defaultElements.btn.citizens;case 2:return this.defaultElements.btn.settings;case 3:return this.defaultElements.btn.convertResources;case 4:return this.defaultElements.btn.build;case 5:return this.defaultElements.btn.tasks;case 6:return this.defaultElements.btn.yeetResources;}}
createBtnEvents(){this.defaultElements.btn.town.addEventListener('click',()=>{this.showPage(0);});this.defaultElements.btn.build.addEventListener('click',()=>{this.showPage(4);});this.defaultElements.btn.convertResources.addEventListener('click',()=>{this.showPage(3);});this.defaultElements.btn.settings.addEventListener('click',()=>{this.showPage(2);});this.defaultElements.btn.tasks.addEventListener('click',()=>{this.showPage(5);});this.defaultElements.btn.yeetResources.addEventListener('click',()=>{this.showPage(6);});this.defaultElements.btn.citizens.addEventListener('click',()=>{this.showPage(1);});}
createTickBtns(){const tickTimes=[getLangString('TOWNSHIP_MENU','TIME_PERIOD_5M'),getLangString('TOWNSHIP_MENU','TIME_PERIOD_1H'),getLangString('TOWNSHIP_MENU','TIME_PERIOD_12H'),getLangString('TOWNSHIP_MENU','TIME_PERIOD_1D'),];const tickOptions=[1,12,144,288];let html=`<ul class="nav-main nav-main-horizontal nav-main-horizontal-override">
      <li class="mr-2">
        ${getLangString('MENU_TEXT','TICK')}
        <div class="btn-group m-1">`;tickOptions.forEach((t,id)=>{html+=`<button class="btn btn-sm btn-outline-info" id="BTN_TICK_${t}" onclick="game.township.catchupTicks(${t})">${numberWithCommas(tickOptions[id])} (${tickTimes[id]})</button>`;});html+=`</div></li>
    <li class="mr-2"><span class="font-size-sm text-dark font-w300 ml-3">${templateString(getLangString('TOWNSHIP_MENU','TICKS_AVAILABLE'),{qty:`<strong id="TOWNSHIP_TICKS_AVAILABLE"></strong>`})}</span></li>
    <li class="mr-2"><span class="font-size-sm text-dark font-w300 ml-3">${templateString(getLangString('TOWNSHIP_MENU','TOWN_TIME_EXISTED'),{localTime:`<span class="font-w600" id="TIME_ALIVE">${formatAsSHTimePeriod(this.township.totalTicks*(1000*game.township.TICK_LENGTH))}</span>`,})}</span></li></ul>`;html+=`<ul class="nav-main nav-main-horizontal nav-main-horizontal-override">
    <li class="mr-2">
      <div><small class="font-size-xs text-dark">${getLangString('TOWNSHIP_MENU','TICK_DESC_0')}</small></div>
    </li>
    <li class="mr-2">
      <div><small class="font-size-xs text-dark">${getLangString('TOWNSHIP_MENU','TICK_GAIN_MSG')}</small></div>
    </li>
    </ul>`;this.defaultElements.div.ticks.innerHTML=html;this.updateTicksAvailable();}
showTownCreationDivs(){this.defaultElements.div.worship.classList.remove('d-none');this.defaultElements.div.worshipModifiers.classList.remove('d-none');this.defaultElements.div.generateTown.classList.remove('d-none');}
hideTownCreationDivs(){this.defaultElements.div.worship.classList.add('d-none');this.defaultElements.div.worshipModifiers.classList.add('d-none');this.defaultElements.div.generateTown.classList.add('d-none');}
hideMainContainerDivs(){this.defaultElements.div.ticks.classList.add('d-none');this.defaultElements.div.mainInfo.classList.add('d-none');this.defaultElements.div.resources.classList.add('d-none');this.defaultElements.div.container.classList.add('d-none');}
showMainContainerDivs(){this.defaultElements.div.ticks.classList.remove('d-none');this.defaultElements.div.mainInfo.classList.remove('d-none');this.defaultElements.div.resources.classList.remove('d-none');this.defaultElements.div.container.classList.remove('d-none');}
updatePageHighlight(oldPage,newPage){const oldButton=this.getPageButton(oldPage);oldButton.classList.remove('township-tab-selected');const newButton=this.getPageButton(newPage);newButton.classList.add('township-tab-selected');}
showPage(pageID){if(pageID===3){const tradingPost=this.township.buildings.getObjectByID("melvorF:Trading_Post");if(tradingPost===undefined||this.township.countNumberOfBuildings(tradingPost)<=0)
return;if(!this.township.isTraderAvailable){this.traderLockedSwal();return;}}
this.updatePageHighlight(this.currentPage,pageID);this.currentPage=pageID;this.defaultElements.div.town.classList.add('d-none');this.defaultElements.div.build.classList.add('d-none');this.defaultElements.div.citizens.classList.add('d-none');this.defaultElements.div.settings.classList.add('d-none');this.defaultElements.div.convertResources.classList.add('d-none');this.defaultElements.div.tasks.classList.add('d-none');this.defaultElements.div.yeetResources.classList.add('d-none');switch(pageID){case 0:this.defaultElements.div.town.classList.remove('d-none');this.updateTownSummary();break;case 1:this.defaultElements.div.citizens.classList.remove('d-none');break;case 2:this.defaultElements.div.settings.classList.remove('d-none');break;case 3:this.township.updateConvertType(this.township.convertType);this.defaultElements.div.convertResources.classList.remove('d-none');break;case 4:this.defaultElements.div.build.classList.remove('d-none');break;case 5:this.defaultElements.div.tasks.classList.remove('d-none');break;case 6:this.updateConvertVisibility();this.defaultElements.div.yeetResources.classList.remove('d-none');break;}}
updateTraderStatus(){const tradingPost=this.township.buildings.getObjectByID("melvorF:Trading_Post");if(tradingPost!==undefined&&this.township.countNumberOfBuildings(tradingPost)<=0){this.defaultElements.trader.traderAvailable.classList.add('d-none');this.defaultElements.trader.traderNotAvailable.classList.add('d-none');this.defaultElements.trader.noTradingPost.classList.remove('d-none');this.defaultElements.trader.trader.classList.remove('text-success');this.defaultElements.trader.trader.classList.add('text-danger');}
else if(this.township.isTraderAvailable){this.defaultElements.trader.trader.classList.add('text-success');this.defaultElements.trader.trader.classList.remove('text-danger');this.defaultElements.trader.traderAvailable.classList.remove('d-none');this.defaultElements.trader.traderNotAvailable.classList.add('d-none');this.defaultElements.trader.noTradingPost.classList.add('d-none');this.defaultElements.trader.leavesIn.innerText=numberWithCommas(this.township.traderLeavesIn);}
else{this.defaultElements.trader.trader.classList.remove('text-success');this.defaultElements.trader.trader.classList.add('text-danger');this.defaultElements.trader.traderAvailable.classList.add('d-none');this.defaultElements.trader.traderNotAvailable.classList.remove('d-none');this.defaultElements.trader.noTradingPost.classList.add('d-none');this.defaultElements.trader.arrivesIn.innerText=numberWithCommas(this.township.traderArrivesIn);}
if(!this.township.isTraderAvailable&&this.currentPage===3)
this.showPage(0);}
traderLockedSwal(){const canSkip=this.township.availableGameTicksToSpend>=this.township.traderArrivesIn;SwalLocale.fire({title:getLangString('MENU_TEXT','TRADER_UNAVAILABLE'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${templateString(getLangString('TOWNSHIP_MENU','TRADER_OUT_OF_TOWN'),{value:`<span class="text-warning">${numberWithCommas(this.township.traderArrivesIn)}</span>`})}</h5>
      <h5 class="font-w600 text-combat-smoke font-size-sm mb-2">
      ${this.township.availableGameTicksToSpend>=this.township.traderArrivesIn?templateString(getLangString('TOWNSHIP_MENU','SKIP_TO_TRADER'),{value:`<span class="text-warning">${numberWithCommas(this.township.traderArrivesIn)}</span>`,}):getLangString('TOWNSHIP_MENU','CANNOT_SKIP_TRADER')}</h5>`,showCancelButton:true,showConfirmButton:canSkip,icon:'warning',confirmButtonText:getLangString('MENU_TEXT','SKIP_TO_TRADER'),}).then((result)=>{if(result.value){this.township.catchupTicks(this.township.traderArrivesIn);}});}
updateTaskUI(category){game.township.tasks.showTaskCategory(category);}
generateTownBiomeData(){this.generateBiomeSelectionDropdown();this.generateBiomeNoResourceAlerts();const biomeSelectContainer=document.getElementById('BUILD_BIOME_SELECTION_CONTAINER');if(biomeSelectContainer===null)
throw new Error(`Error generating Township UI. Build biome select container is not in DOM.`);const buildContainer=document.getElementById('TOWN_BIOME_DATA');if(buildContainer===null)
throw new Error(`Error generating Township UI. Build container is not in DOM`);this.township.biomes.forEach((biome)=>{const biomeSelect=new TownshipBuildBiomeSelectElement();biomeSelect.setBiome(biome,this.township);biomeSelectContainer.append(biomeSelect);this.buildBiomeSelectButtons.set(biome,biomeSelect);});const buildingSortDropdown=new TownshipBuildingSortDropdownElement();buildingSortDropdown.populateOptions((category,index)=>this.toggleSortList(category,index));const dropdownContainer=document.getElementById('BUILD_BIOME_SORT_DROPDOWN');if(dropdownContainer!==null)
dropdownContainer.appendChild(buildingSortDropdown);this.generateFilterIcons();}
generateFilterIcons(){const showAll=new TownshipBuildBiomeFilterIconElement();showAll.setIcon(townshipIcons.showAll);showAll.setTooltipContent(getLangString('SHOP_CAT','MISC'));showAll.onclick=()=>{this.filterBuildBoimes('showAll');this.highlightBuildBuildingsWithFilter('showAll');this.highlightFilterIcon('showAll');};const population=new TownshipBuildBiomeFilterIconElement();population.setIcon(townshipIcons.population);population.setTooltipContent(getLangString('TOWNSHIP_MENU','POPULATION'));population.onclick=()=>{this.filterBuildBoimes('population');this.highlightBuildBuildingsWithFilter('population');this.highlightFilterIcon('population');};const storage=new TownshipBuildBiomeFilterIconElement();storage.setIcon(townshipIcons.storage);storage.setTooltipContent(getLangString('TOWNSHIP_MENU','STORAGE'));storage.onclick=()=>{this.filterBuildBoimes('storage');this.highlightBuildBuildingsWithFilter('storage');this.highlightFilterIcon('storage');};const happiness=new TownshipBuildBiomeFilterIconElement();happiness.setIcon(townshipIcons.happiness);happiness.setIconColor('yellow');happiness.setTooltipContent(getLangString('TOWNSHIP_MENU','HAPPINESS'));happiness.onclick=()=>{this.filterBuildBoimes('happiness');this.highlightBuildBuildingsWithFilter('happiness');this.highlightFilterIcon('happiness');};const education=new TownshipBuildBiomeFilterIconElement();education.setIcon(townshipIcons.education);education.setTooltipContent(getLangString('TOWNSHIP_MENU','EDUCATION'));education.onclick=()=>{this.filterBuildBoimes('education');this.highlightBuildBuildingsWithFilter('education');this.highlightFilterIcon('education');};const deadStorage=new TownshipBuildBiomeFilterIconElement();deadStorage.setIcon(townshipIcons.dead);deadStorage.setTooltipContent(getLangString('TOWNSHIP_MENU','DEAD_STORAGE'));deadStorage.onclick=()=>{this.filterBuildBoimes('deadStorage');this.highlightBuildBuildingsWithFilter('deadStorage');this.highlightFilterIcon('deadStorage');};const worship=new TownshipBuildBiomeFilterIconElement();worship.setIcon(townshipIcons.worship);worship.setTooltipContent(getLangString('TOWNSHIP_MENU','WORSHIP'));worship.onclick=()=>{this.filterBuildBoimes('worship');this.highlightBuildBuildingsWithFilter('worship');this.highlightFilterIcon('worship');};const resourceIcons=[];this.township.resources.forEach((resource)=>{if(resource.localID!=='GP'){const resourceIcon=new TownshipBuildBiomeFilterIconElement();resourceIcon.setMedia(resource);resourceIcon.setTooltipContent(resource.name);resourceIcon.onclick=()=>{this.filterBuildBoimes(resource);this.highlightBuildBuildingsWithFilter(resource);this.highlightFilterIcon(resource.id);};resourceIcons.push(resourceIcon);this.filterIconElements.set(resource.id,resourceIcon);}});const el=document.getElementById('SELECT_BIOME_TO_BUILD_FILTER_ICONS');el===null||el===void 0?void 0:el.append(showAll,population,storage,happiness,education,deadStorage,worship,...resourceIcons);this.filterIconElements.set('showAll',showAll);this.filterIconElements.set('population',population);this.filterIconElements.set('storage',storage);this.filterIconElements.set('happiness',happiness);this.filterIconElements.set('education',education);this.filterIconElements.set('deadStorage',deadStorage);this.filterIconElements.set('worship',worship);}
highlightFilterIcon(filter){this.filterIconElements.forEach((icon)=>{icon.filterLink.classList.remove('ts-biome-build-filter-highlight');});const icon=this.filterIconElements.get(filter);if(icon!==undefined)
icon.filterLink.classList.add('ts-biome-build-filter-highlight');}
filterBuildBoimes(filter){this.township.biomes.forEach((biome)=>{const biomeElement=this.buildBiomeSelectButtons.get(biome);if(biomeElement===undefined)
return;switch(filter){case 'showAll':biomeElement.hideFilterHighlightBorder();break;case 'population':biome.provides.population?biomeElement.showFilterHighlightBorder():biomeElement.hideFilterHighlightBorder();break;case 'storage':biome.provides.storage?biomeElement.showFilterHighlightBorder():biomeElement.hideFilterHighlightBorder();break;case 'happiness':biome.provides.happiness?biomeElement.showFilterHighlightBorder():biomeElement.hideFilterHighlightBorder();break;case 'education':biome.provides.education?biomeElement.showFilterHighlightBorder():biomeElement.hideFilterHighlightBorder();break;case 'deadStorage':biome.provides.deadStorage?biomeElement.showFilterHighlightBorder():biomeElement.hideFilterHighlightBorder();break;case 'worship':biome.provides.worship?biomeElement.showFilterHighlightBorder():biomeElement.hideFilterHighlightBorder();break;}
if(filter instanceof TownshipResource){biome.containsResources.has(filter)?biomeElement.showFilterHighlightBorder():biomeElement.hideFilterHighlightBorder();}});}
highlightBuildBuildingsWithFilter(filter){this.buildBuildings.forEach((el,building)=>{switch(filter){case 'showAll':el.hideFilterHighlightBorder();break;case 'population':building.provides.population>0?el.showFilterHighlightBorder():el.hideFilterHighlightBorder();break;case 'storage':building.provides.storage>0?el.showFilterHighlightBorder():el.hideFilterHighlightBorder();break;case 'happiness':building.provides.happiness>0?el.showFilterHighlightBorder():el.hideFilterHighlightBorder();break;case 'education':building.provides.education>0?el.showFilterHighlightBorder():el.hideFilterHighlightBorder();break;case 'deadStorage':building.provides.deadStorage!==undefined?el.showFilterHighlightBorder():el.hideFilterHighlightBorder();break;case 'worship':building.provides.worship!==undefined?el.showFilterHighlightBorder():el.hideFilterHighlightBorder();break;}
if(filter instanceof TownshipResource){building.provides.resources.get(filter)!==undefined?el.showFilterHighlightBorder():el.hideFilterHighlightBorder();}});}
generateBiomeSelectionDropdown(){const button=document.getElementById('BUILD_BIOME_SELECTION_DROPDOWN');if(button!==null&&this.township.townData.currentBuildBiome!==undefined)
button.textContent=this.township.townData.currentBuildBiome.name;const optionsContainer=document.getElementById('BUILD_BIOME_SELECTION_OPTIONS');if(optionsContainer===null)
throw new Error(`Error generating Township Build Biome Dropdown. Options container is not in DOM.`);this.township.biomes.forEach((biome)=>{const option=createElement('a',{className:'dropdown-item pointer-enabled'});option.onclick=()=>this.township.setBuildBiome(biome);const remainingSpan=createElement('small',{text:`bbb(${biome.amountPurchased}) [${biome.amountPurchased} / ${biome.totalInMap}]`,});option.append(createElement('span',{className:'font-w700',text:biome.name}),remainingSpan);optionsContainer.append(option);this.buildBiomeSelectOptions.set(biome,remainingSpan);});}
generateBiomeNoResourceAlerts(){const alertContainer=this.defaultElements.notifications.town.noResourceAlerts;this.township.biomes.forEach((biome)=>{if(biome.resourceUsage!==undefined){const alert=createElement('div',{className:'alert alert-danger d-flex align-items-center p-1 font-size-sm d-none',attributes:[['role','alert']],});alert.innerHTML=`<div class="flex-00-auto">
          <i class="fa fa-fw fa-exclamation-circle"></i>
        </div>
        <div class="flex-fill ml-3">
          <p class="mb-0 font-w600">${biome.noResourceMessage}</p>
        </div>`;this.biomeNoResourceAlerts.set(biome,alert);alertContainer.append(alert);}});}
toggleSortList(category,index){let value;switch(category){case 'showAll':value=!this.sortList.showAll[index];this.sortList.showAll[index]=value;this.updateSortCheckbox('showAll',0);if(value)
this.setSortListToDefault();break;case 'buildingType':value=!this.sortList.buildingType[index];this.sortList.buildingType[index]=value;this.updateSortCheckbox('buildingType',index);if(this.sortList.showAll[0]&&this.sortList.buildingType.includes(true)){this.sortList.showAll[0]=false;this.updateSortCheckbox('showAll',0);}
else if(!this.sortList.showAll[0]&&!this.sortList.buildingType.includes(true)){this.sortList.showAll[0]=true;this.updateSortCheckbox('showAll',0);}
break;case 'resource':break;}
this.updateBuildingsForBiomeSelection();}
setSortListToDefault(){const buildingTypes=Object.keys(BuildingTypeID).filter((key)=>isNaN(Number(key)));buildingTypes.forEach((_,id)=>{this.sortList.buildingType[id]=false;this.updateSortCheckbox('buildingType',id);});}
updateSortCheckbox(category,index){const element=document.getElementById(`building-sort-${category}-${index}`);if(element!==null)
element.checked=this.sortList[category][index];}
addDropdownDivider(){return `<div role="separator" class="dropdown-divider"></div>`;}
generateTownBiomeSummarySelection(){const container=document.getElementById('TOWNSHIP_BIOME_SELECT_ELEMENTS');if(container===null)
throw new Error(`Error generating township biome select elements. Container does not exist in DOM.`);const viewAll=new TownshipTownBiomeSelectElement();viewAll.setBiome(undefined,this.township);container.append(viewAll);this.townBiomeSelectButtons.set(undefined,viewAll);this.township.biomes.forEach((biome)=>{const viewButton=new TownshipTownBiomeSelectElement();viewButton.setBiome(biome,this.township);container.append(viewButton);this.townBiomeSelectButtons.set(biome,viewButton);});}
updateNextSectionCost(){const element=document.getElementById('section-cost');element.innerText=numberWithCommas(this.township.getNextSectionCost(this.township.nextSectionQty));const currentQty=document.getElementById('buy-section-qty-dropdown');currentQty.innerText=this.township.nextSectionQty.toString();}
updateDestroyDropdowns(){const element=document.getElementsByClassName('destroy-qty-dropdown');for(let i=0;i<element.length;i++){const dropdown=element[i];dropdown.innerHTML=`<small>${this.township.destroyQty}</small>`;}}
updateUpgradeDropdowns(){const element=document.getElementsByClassName('upgrade-qty-dropdown');for(let i=0;i<element.length;i++){const dropdown=element[i];dropdown.innerText=this.township.upgradeQty.toString();}}
setUpgradeQty(qty){this.township.upgradeQty=qty;this.updateAllBuildingUpgradeCosts();this.updateUpgradeDropdowns();}
setDestroyQty(qty){this.township.destroyQty=qty;this.updateDestroyDropdowns();}
shouldShowBuilding(building){if(!this.township.canBuildTierOfBuilding(building)&&!game.settings.showLockedTownshipBuildings)
return false;if(this.sortList.showAll[0])
return true;if(this.sortList.buildingType[building.type])
return true;return false;}
updateBuildBuildingProvides(){this.township.buildings.forEach((building)=>{var _a;if(this.township.townData.currentBuildBiome!==undefined&&building.biomes.includes(this.township.townData.currentBuildBiome)&&this.shouldShowBuilding(building)){(_a=this.buildBuildings.get(building))===null||_a===void 0?void 0:_a.updateResourceOutput(building,this.township);}});}
updateBuildingsForBiomeSelection(){this.township.buildings.forEach((building)=>{var _a;(_a=this.buildBuildings.get(building))===null||_a===void 0?void 0:_a.classList.add('d-none');});const buildingsInBiome=this.township.buildings.filter((building)=>this.township.townData.currentBuildBiome!==undefined&&building.biomes.includes(this.township.townData.currentBuildBiome));buildingsInBiome.forEach((building)=>{if(this.shouldShowBuilding(building)){const buildBuilding=this.buildBuildings.get(building);if(buildBuilding!==undefined){showElement(buildBuilding);buildBuilding.updateResourceOutput(building,this.township);}}});this.updateBuildBiomeSelectionNotifications();}
updateBuildBiomeSelectionNotifications(){const biome=this.township.townData.currentBuildBiome;if(biome!==undefined&&biome.resourceUsage!==undefined){this.defaultElements.notifications.build.message.textContent=biome.penaltyMessage;this.defaultElements.notifications.build.usage.innerHTML=templateString(biome.usageMessage,{qty:`<span class="text-warning font-w600">${this.township.getSingleResourceUsageInBiome(biome.resourceUsage.resource,biome).toFixed(2)}</span>`,});showElement(this.defaultElements.notifications.build.alert);}
else{hideElement(this.defaultElements.notifications.build.alert);}}
updateTownBiomeSelectionNotifications(){const biome=this.township.currentTownBiome;if(biome===undefined)
return;if(biome!==undefined&&biome.resourceUsage!==undefined){this.defaultElements.notifications.town.message.textContent=biome.penaltyMessage;this.defaultElements.notifications.town.usage.innerHTML=templateString(biome.usageMessage,{qty:`<span class="text-warning font-w600">${this.township.getSingleResourceUsageInBiome(biome.resourceUsage.resource,biome).toFixed(2)}</span>`,});showElement(this.defaultElements.notifications.town.alert);}
else{hideElement(this.defaultElements.notifications.town.alert);}}
getBuildingCostHTML(building,buildQty){let html='';building.costs.forEach(({resource,quantity})=>{const cost=this.township.modifyBuildingResourceCost(quantity)*buildQty;if(cost>0){const textClass=resource.amount>=cost?'font-w400 text-success':'font-w600 text-danger';html+=`<li class="${textClass} mr-2"><img class="skill-icon-xxs mr-1" src="${resource.media}">${numberWithCommas(cost)}</li>`;}});return html;}
getBuildingResourceUsage(building){let html='';building.provides.resources.forEach((quantity,resource)=>{if(resource.requires.size>0){resource.requires.forEach((usedQuantity,usedResource)=>{const baseProductPerBuilding=quantity*100;const amount=usedQuantity*100*baseProductPerBuilding*(game.township.TICK_LENGTH/10);const textClass='text-danger';html+=`<ul class="nav-main nav-main-horizontal nav-main-horizontal-override font-w400 font-size-xs">
                      <li class="mr-2 ${textClass} ${!game.settings.darkMode?'rounded bg-light px-1 mb-1':''}"><img class="skill-icon-xxs mr-1" src="${usedResource.media}"> -${amount.toFixed(2)} /t
                      </li>
                        </ul>`;});}});return html;}
updateBuildingCounts(){this.township.buildings.forEach((building)=>{var _a;const buildingCount=this.township.currentTownBiome!==undefined?this.township.currentTownBiome.getBuildingCount(building):this.township.countNumberOfBuildings(building);(_a=this.buildingsInTown.get(building))===null||_a===void 0?void 0:_a.updateBuildingCount(buildingCount);});}
updateBuilding(building){const buildBuilding=this.buildBuildings.get(building);if(buildBuilding!==undefined){buildBuilding.updateBuildingCount(building,this.township);}
const buildingInTown=this.buildingsInTown.get(building);this.updateBuildingTotalOutput(building);if(buildingInTown!==undefined){if(this.township.currentTownBiome!==undefined)
buildingInTown.updateBuildingCount(this.township.currentTownBiome.getBuildingCount(building));else
buildingInTown.updateBuildingCount(this.township.countNumberOfBuildings(building));if(this.township.countNumberOfBuildings(building)>0&&this.township.currentTownBiome!==undefined&&building.biomes.includes(this.township.currentTownBiome)){buildingInTown.classList.remove('d-none');}
else
buildingInTown.classList.add('d-none');}}
setupTownTooltips(){tippy(`#TOWN_POPULATION`,{placement:'top',allowHTML:true,interactive:false,animation:false,onShow:(instance)=>{instance.setContent(this.displayXPInfo());},});tippy(`#TOWN_DEAD_STORAGE`,{placement:'top',allowHTML:true,interactive:false,animation:false,onShow:(instance)=>{instance.setContent(this.displayDeathInfo());},});tippy(`#TOWN_HAPPINESS`,{placement:'top',allowHTML:true,interactive:false,animation:false,onShow(instance){instance.setContent(`<small>${getLangString('TOWNSHIP_MENU','HAPPINESS_DESC')}</small><br><br><small>${getLangString('TOWNSHIP_MENU','HAPPINESS_DEBUFF_DESC')}</small>`);},});tippy(`#TOWN_EDUCATION`,{placement:'top',allowHTML:true,interactive:false,animation:false,onShow(instance){instance.setContent(`<small>${getLangString('TOWNSHIP_MENU','EDUCATION_DESC')}</small>`);},});tippy(`#TOWN_HEALTH`,{placement:'top',allowHTML:true,interactive:false,animation:false,onShow:(instance)=>{instance.setContent(`<small>${templateString(getLangString('TOWNSHIP_MENU','HEALTH_DESC_0'),{value1:`55`,percent:`<span class="text-warning">${(100-this.township.townData.healthPercent).toFixed(1)}</span>`,value2:`100`,})}
          </small><br>
          <small>${getLangString('TOWNSHIP_MENU','HEALTH_DESC_1')}<br>- ${getLangString('TOWNSHIP_MENU','HEALTH_DESC_2')}<br>- ${getLangString('TOWNSHIP_MENU','HEALTH_DESC_3')}<br>- ${getLangString('TOWNSHIP_MENU','HEALTH_DESC_4')}<br>- ${getLangString('TOWNSHIP_MENU','HEALTH_DESC_5')}<br>- ${getLangString('TOWNSHIP_MENU','HEALTH_DESC_6')}</small>`);},});tippy(`#TOWN_WORSHIP`,{placement:'bottom',allowHTML:true,interactive:false,animation:false,onShow:(instance)=>{instance.setContent(this.displayWorshipTooltip());},});}
displayWorshipTooltip(){let tooltip=`<div class="text-center font-size-sm"><small>${getLangString('TOWNSHIP_MENU','ALWAYS_ACTIVE')}<br>${Object.keys(this.township.townData.worship.modifiers).length>0?describeModifierDataLineBreak(this.township.townData.worship.modifiers):getLangString('TOWNSHIP_MENU','NO_MODIFIERS')}</small></div>`;if(this.township.townData.worship.id!=="melvorD:None"){this.township.WORSHIP_CHECKPOINTS.forEach((checkpoint,id)=>{tooltip+=this.addDropdownDivider();tooltip+=`<div class="text-center font-size-sm"><small>${templateString(getLangString('TOWNSHIP_MENU','AT_PERCENT'),{value:`${checkpoint}`})}<br>${describeModifierDataLineBreak(this.township.townData.worship.checkpoints[id])}</div></small>`;});}
return tooltip;}
displayXPInfo(){const html=`<small>${templateString(getLangString('TOWNSHIP_MENU','XP_PER_TICK'),{value:`<span class="text-warning">${numberWithCommas(Math.floor(this.township.baseXPRate))}
                    </span>`,})}
                  <br>${getLangString('TOWNSHIP_MENU','XP_PER_TICK_INFO')}</small>`;return html;}
displayDeathInfo(){const html=`<small>${templateString(getLangString('TOWNSHIP_MENU','TICKS_UNTIL_DECAY'),{qty:`<span class="text-warning">
                    ${numberWithCommas(game.township.decayTickAmount-((this.township.totalTicks-1)%game.township.decayTickAmount))}</span>`,amount:`<span class="text-warning">${numberWithCommas(game.township.deadDecayAmount)}</span>`,})}
                  </small>`;return html;}
updatePopulation(){const html=`<div class="media d-flex align-items-center" style="line-height: 1.15;">
                    <div class="mr-1">
                        <i class="fa fa-house-user mr-1 font-size-lg"></i>
                    </div>
                    <div class="media-body text-left">
                      <div>
                        <small class="font-w600 text-warning">
                          ${getLangString('TOWNSHIP_MENU','POPULATION')}
                        </small>
                      </div>
                      <div>
                        <small class="font-w600 mr-1">
                          ${numberWithCommas(this.township.currentPopulation)} / ${numberWithCommas(this.township.populationLimit)}
                        </small>
                        <small>(~${this.township.populationGainRate}/t)</small>
                      </div>
                    </div>
                  </div>`;this.defaultElements.town.population.innerHTML=html;this.defaultElements.town.breakdown.population.innerText=numberWithCommas(this.township.currentPopulation);this.defaultElements.town.breakdown.over55.innerText=numberWithCommas(game.township.popOver55);const over70=this.township.citizens.filter((c)=>this.township.getCitizenAge(c)>this.township.MAX_WORKER_AGE).length;this.defaultElements.town.breakdown.over70.innerText=numberWithCommas(over70);}
updateHappiness(){const html=`<div class="media d-flex align-items-center" style="line-height: 1.15;">
                    <div class="mr-1">
                        <i class="fa fa-smile mr-1 font-size-lg" style="color:yellow;"></i>
                    </div>
                    <div class="media-body text-left">
                      <div>
                        <small class="font-w600 text-warning">
                          ${getLangString('TOWNSHIP_MENU','HAPPINESS')}
                        </small>
                      </div>
                      <div>
                        <small class="font-w600 mr-1">
                          ${numberWithCommas(this.township.townData.happiness)} / ${numberWithCommas(this.township.maxHappiness)}
                        </small>
                        <small>
                          (${this.township.happinessPercent.toFixed(1)}%)
                        </small>
                      </div>
                    </div>
                  </div>`;this.defaultElements.town.happiness.innerHTML=html;}
updateEducation(){const html=`<div class="media d-flex align-items-center" style="line-height: 1.15;">
                    <div class="mr-1">
                        <i class="fa fa-book-open mr-1 text-info font-size-lg"></i>
                    </div>
                    <div class="media-body text-left">
                      <div>
                        <small class="font-w600 text-warning">
                          ${getLangString('TOWNSHIP_MENU','EDUCATION')}
                        </small>
                      </div>
                      <div>
                        <small class="font-w600 mr-1">
                          ${numberWithCommas(this.township.townData.education)} / ${numberWithCommas(this.township.maxEducation)} 
                        </small>
                        <small>
                          (${this.township.educationPercent.toFixed(1)}%)
                        </small>
                      </div>
                    </div>
                  </div>`;this.defaultElements.town.education.innerHTML=html;}
updateHealth(){const html=`<div class="media d-flex align-items-center" style="line-height: 1.15;">
                    <div class="mr-1">
                        <i class="fa fa-plus-circle mr-1 text-success font-size-lg"></i>
                    </div>
                    <div class="media-body text-left">
                      <div>
                        <small class="font-w600 text-warning">
                          ${getLangString('TOWNSHIP_MENU','HEALTH')}
                        </small>
                      </div>
                      <div>
                        <small class="font-w600 mr-1">
                          ${this.township.townData.healthPercent.toFixed(1)}%
                        </small>
                      </div>
                    </div>
                  </div>`;this.defaultElements.town.health.innerHTML=html;}
updateWorship(){const html=`<div class="media d-flex align-items-center" style="line-height: 1.15;">
                    <div class="mr-1">
                        <i class="fa fa-church mr-1 text-danger font-size-lg"></i>
                    </div>
                    <div class="media-body text-left">
                      <div>
                        <small class="font-w600 text-warning">
                          ${getLangString('TOWNSHIP_MENU','WORSHIP')}
                        </small>
                      </div>
                      <div>
                        <small class="font-w600 mr-1" id="CURRENT_WORSHIP">
                          ${this.getCurrentWorshipSpan()}
                        </small>
                      </div>
                    </div>
                  </div>`;this.defaultElements.town.worship.innerHTML=html;this.defaultElements.town.breakdown.worship.textContent=this.township.currentWorshipName;this.defaultElements.town.breakdown.worshipProgress.innerHTML=this.getCurrentWorshipProgressSpan();}
updateDeathStorage(){const html=`<div class="media d-flex align-items-center" style="line-height: 1.15;">
                    <div class="mr-1">
                        <i class="fa fa-skull-crossbones mr-1 text-warning font-size-lg"></i>
                    </div>
                    <div class="media-body text-left">
                      <div>
                        <small class="font-w600 text-warning">
                          ${getLangString('TOWNSHIP_MENU','DEAD_STORAGE')}
                        </small>
                      </div>
                      <div>
                        <small class="font-w600 mr-1" id="RESOURCE_dead_storage">
                          ${this.getDeadStorageBreakdown()}
                        </small>
                      </div>
                    </div>
                  </div>`;this.defaultElements.town.deadStorage.innerHTML=html;this.defaultElements.town.breakdown.deadStorage.innerText=`${this.township.totalDead} / ${this.township.availableDeadStorage}`;}
showChangeWorshipSelection(){$('#modal-change-worship').modal('show');}
updateWorshipCountSpan(){const element=document.getElementById('CURRENT_WORSHIP');if(element!==null)
element.innerHTML=this.getCurrentWorshipSpan();}
getCurrentWorshipSpan(){if(this.township.townData.worship.id==="melvorD:None")
return this.township.currentWorshipName;return `<span>${this.township.currentWorshipName} - ${this.getCurrentWorshipProgressSpan()}`;}
getCurrentWorshipProgressSpan(){return `${numberWithCommas(this.township.townData.worshipCount)} / ${numberWithCommas(this.township.MAX_WORSHIP)} <span class="font-w400">(${this.township.worshipPercent.toFixed(1)}%)</span>`;}
updateTimeAlive(){const element=document.getElementById('TIME_ALIVE');element.innerText=`${formatAsSHTimePeriod(this.township.totalTicks*(1000*game.township.TICK_LENGTH))}`;}
updateBiomeBreakdown(biome){var _a,_b;if(biome===undefined)
return;const dropdown=document.getElementById('BUILD_BIOME_SELECTION_DROPDOWN');const textHTML=`(${biome.amountPurchased} / ${biome.totalInMap})<br>${templateString(getLangString('TOWNSHIP_MENU','AVAILABLE_BIOME_SPACE'),{qty:`${this.township.getAvailableBuildingSpaceInBiome(biome)}`})}`;(_a=this.buildBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.updateBiomesRemaining(textHTML);const remainingMobile=this.buildBiomeSelectOptions.get(biome);if(remainingMobile!==undefined)
remainingMobile.innerHTML=textHTML;if(biome===this.township.townData.currentBuildBiome)
dropdown.innerHTML=`<strong>${biome.name}</strong> ${textHTML}`;(_b=this.townBiomeSelectButtons.get(biome))===null||_b===void 0?void 0:_b.updateBuildingCount(biome,this.township);}
createResourceBreakdownTable(){const resourceContainer=document.getElementById('TOWNSHIP_RESOURCE_TABLE_ELEMENTS');if(resourceContainer===null)
throw new Error('Resource Container does not exist in DOM.');this.township.resourceDisplayOrder.forEach((resource)=>{const resourceDisplay=new TownshipResourceDisplayElement();resourceContainer.append(resourceDisplay);resourceDisplay.setResource(resource,this.township);this.resourceDisplays.set(resource,resourceDisplay);});}
updateStorageBreakdown(){const element=document.getElementById('RESOURCE_storage');element.innerText=this.getStorageBreakdown();this.defaultElements.town.breakdown.storage.textContent=this.getStorageBreakdown();this.updateStorageBreakdownColour();}
updateStorageBreakdownColour(){const element=document.getElementById('RESOURCE_storage');if(this.township.getUsedStorage()>=this.township.getMaxStorage()*0.98){element.classList.add('text-danger');this.defaultElements.town.breakdown.storage.classList.add('text-danger');this.defaultElements.notifications.global.noStorage.classList.remove('d-none');}
else{element.classList.remove('text-danger');this.defaultElements.town.breakdown.storage.classList.remove('text-danger');this.defaultElements.notifications.global.noStorage.classList.add('d-none');}}
getStorageBreakdown(){return `${numberWithCommas(Math.floor(this.township.getUsedStorage()))} / ${numberWithCommas(this.township.getMaxStorage())}`;}
updateDeathStorageBreakdown(){const element=document.getElementById('RESOURCE_dead_storage');element.innerText=this.getDeadStorageBreakdown();this.defaultElements.town.breakdown.deadStorage.textContent=this.getDeadStorageBreakdown();this.updateDeadStorageBreakdownColour();}
updateDeadStorageBreakdownColour(){const element=document.getElementById('RESOURCE_dead_storage');if(this.township.townData.dead>=this.township.availableDeadStorage){element.classList.add('text-danger');this.defaultElements.town.breakdown.deadStorage.classList.add('text-danger');}
else{element.classList.remove('text-danger');this.defaultElements.town.breakdown.deadStorage.classList.remove('text-danger');}}
getDeadStorageBreakdown(){return `${templateString(getLangString('TOWNSHIP_MENU','BURIED_COUNT'),{qty1:`${numberWithCommas(this.township.totalDead)}`,qty2:`${numberWithCommas(this.township.availableDeadStorage)}`,percent:`${Math.floor(this.township.deadStoragePercent)}`,})}`;}
updateResourceAmounts(){this.township.resources.forEach((resource)=>{const display=this.resourceDisplays.get(resource);if(display!==undefined)
display.updateResourceAmount(resource,this.township);const convert=document.getElementById(`convert-resource-${resource.id}-quantity`);if(convert!==null)
convert.textContent=numberWithCommas(Math.floor(resource.amount));});}
updateResourceTickBreakdown(){this.township.resources.forEach((resource)=>{const display=this.resourceDisplays.get(resource);if(display===undefined)
return;display.updateResourceRate(resource,this.township);if(resource.producingJob!==undefined)
display.updateAssignedWorkers(resource.producingJob);});}
unhighlightBuildBiomeBtn(biome){var _a;if(biome===undefined)
return;(_a=this.buildBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.unhighlight();}
highlightBuildBiomeBtn(biome){var _a;if(biome===undefined)
return;(_a=this.buildBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.highlight();}
unhighlightTownBiomeBtn(biome){var _a;(_a=this.townBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.unhighlight(biome);}
highlightTownBiomeBtn(biome){var _a;(_a=this.townBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.highlight(biome);}
unhighlightPriorityWorkerBtn(job){var _a;if(job.produces===undefined)
return;(_a=this.resourceDisplays.get(job.produces))===null||_a===void 0?void 0:_a.unhighlightButton();}
highlightPriorityWorkerBtn(job){var _a;if(job.produces===undefined)
return;(_a=this.resourceDisplays.get(job.produces))===null||_a===void 0?void 0:_a.highlightButton();}
updateWorkerCounts(){this.township.jobs.forEach((job)=>{var _a;if(job.produces===undefined)
return;(_a=this.resourceDisplays.get(job.produces))===null||_a===void 0?void 0:_a.updateAssignedWorkers(job);});}
updateWorkersAvailable(){const element=document.getElementById(`WORKERS_AVAILABLE`);element.innerText=this.getWorkersAvailableSpan();this.defaultElements.town.breakdown.availableWorkers.textContent=this.getWorkersAvailableSpan();}
getWorkersAvailableSpan(){const available=this.township.getAvailableWorkers();return `${numberWithCommas(available.unemployed)} / ${numberWithCommas(available.total)}`;}
displayAllCitizens(){const ages=new Map();const over55=this.township.citizens.filter((c)=>this.township.getCitizenAge(c)>=55).length;const over70=this.township.citizens.filter((c)=>this.township.getCitizenAge(c)>this.township.MAX_WORKER_AGE).length;this.township.citizens.forEach((c)=>{const age=this.township.getCitizenAge(c);if(ages.get(age)===undefined)
ages.set(age,1);else{const count=ages.get(age);ages.set(age,count+1);}});let html=``;html+=`<h5 class="font-w600 mb-2">${getLangString('TOWNSHIP_MENU','CITIZENS')}</h5>`;html+=`<div class="alert alert-info d-flex align-items-center p-1 font-size-sm" role="alert">
              <div class="flex-00-auto">
                  <i class="fa fa-fw fa-exclamation-circle"></i>
              </div>
              <div class="flex-fill ml-3">
                  <p class="mb-0">${getLangString('TOWNSHIP_MENU','CITIZENS_WORKER_AGE_NOTICE')}</p>
              </div>
            </div>
            <div class="alert alert-info d-flex align-items-center p-1 font-size-sm" role="alert">
              <div class="flex-00-auto">
                  <i class="fa fa-fw fa-exclamation-circle"></i>
              </div>
              <div class="flex-fill ml-3">
                  <p class="mb-0">${getLangString('TOWNSHIP_MENU','CITIZENS_OLD_AGE_NOTICE')}</p>
              </div>
            </div>
            <div class="alert alert-info d-flex align-items-center p-1 font-size-sm" role="alert">
              <div class="flex-00-auto">
                  <i class="fa fa-fw fa-exclamation-circle"></i>
              </div>
              <div class="flex-fill ml-3">
                  <p class="mb-0">${getLangString('TOWNSHIP_MENU','CITIZENS_OLD_AGE_NOTICE_GP')}</p>
              </div>
            </div>`;html+=`<h5 class="font-w600 text-info font-size-sm mb-2">${getLangString('TOWNSHIP_MENU','OVER_55')} <span class="text-dark">${numberWithCommas(over55)}</span></h5>`;html+=`<h5 class="font-w600 text-info font-size-sm mb-4">${getLangString('TOWNSHIP_MENU','OVER_70')} <span class="text-dark">${numberWithCommas(over70)}</span></h5>`;html+=`<h5 class="font-w600 mb-2 font-size-sm">${getLangString('TOWNSHIP_MENU','AGE_BREAKDOWN')}</h5>`;html+=`<ul class="nav-main nav-main-horizontal nav-main-horizontal-override font-w400 font-size-sm">`;for(let i=0;i<100;i++){const count=ages.get(i)===undefined?0:ages.get(i);html+=this.getCitizenDetailsElement(i,count);}
this.defaultElements.div.citizens.innerHTML=html;}
getCitizenDetailsElement(age,count){let html='';html+=`<li class="font-w600 text-info" style="min-width:80px;">${age}: <span class="text-dark">${numberWithCommas(count)}</span></li>`;return html;}
shouldShowBuildingInTown(building){return((this.township.currentTownBiome===undefined&&this.township.countNumberOfBuildings(building)>0)||(this.township.currentTownBiome!==undefined&&this.township.currentTownBiome.getBuildingCount(building)>0));}
updateTownSummary(){this.township.buildingDisplayOrder.forEach((building)=>{const buildingElement=this.buildingsInTown.get(building);if(buildingElement===undefined)
return;if(this.shouldShowBuildingInTown(building)){showElement(buildingElement);buildingElement.toggleBuildOptions(this.township.currentTownBiome!==undefined,building.upgradesTo!==undefined);}
else{hideElement(buildingElement);}});}
updateAllBuildingUpgradeCosts(){this.township.buildings.forEach((building)=>this.updateBuildingUpgradeCosts(building));}
updateBuildingUpgradeCosts(building){if(building.upgradesTo===undefined)
return;const buildingInTown=this.buildingsInTown.get(building);buildingInTown===null||buildingInTown===void 0?void 0:buildingInTown.updateBuildingUpgradeCosts(building.upgradesTo,this.township);}
updateTownBuildingProvides(){this.township.buildingDisplayOrder.forEach((building)=>{const buildingInTown=this.buildingsInTown.get(building);if(buildingInTown===undefined)
return;buildingInTown.updateResourceTotals(building,this.township);buildingInTown.setResourceUsage(building,this);});}
displayTownSummary(){this.generateTownBiomeSummarySelection();const buildingContainer=document.getElementById(`ts-town`);this.township.buildingDisplayOrder.forEach((building)=>{const inTownElement=new BuildingInTownElement();inTownElement.className=`col-12 col-sm-6 col-xl-4${this.shouldShowBuildingInTown(building)?'':' d-none'}`;inTownElement.initQtyDropdowns(this);buildingContainer.append(inTownElement);inTownElement.setBuilding(building,this.township);this.buildingsInTown.set(building,inTownElement);});this.updateTownSummary();}
generateBuildBuildings(){const container=document.getElementById(`ts-summary`);if(container===null)
throw new Error(`Error creating Township UI. Build Buildings container is not in DOM.`);this.township.buildingDisplayOrder.forEach((building)=>{if(building.upgradesFrom===undefined){const buildBuilding=new TownshipBuildBuildingElement();buildBuilding.className=`col-12 col-sm-6 col-xl-4`;container.append(buildBuilding);buildBuilding.setBuilding(building,this.township);this.buildBuildings.set(building,buildBuilding);}});}
updateBuildQtyButtons(oldQty,newQty){const oldButton=document.getElementById(`township-build-qty-btn-${oldQty}`);if(!oldButton)
throw new Error(`No build quantity button exists for ${oldQty}`);oldButton.classList.replace('btn-info','btn-outline-info');const newButton=document.getElementById(`township-build-qty-btn-${newQty}`);if(!newButton)
throw new Error(`No build quantity button exists for ${newQty}`);newButton.classList.replace('btn-outline-info','btn-info');}
updateForBuildQtyChange(){this.buildBuildings.forEach((buildBuilding,building)=>{buildBuilding.updateForBuildQtyChange(building,this.township);});}
updateAllBuildingRequirements(){this.township.buildings.forEach((building)=>{var _a;(_a=this.buildBuildings.get(building))===null||_a===void 0?void 0:_a.updateExtraRequirements(building,this.township);});}
updateAllBuildingCosts(){this.township.buildings.forEach((building)=>{var _a;(_a=this.buildBuildings.get(building))===null||_a===void 0?void 0:_a.updateBuildingCosts(building,this.township);});}
updateBuildingTotalModifierElement(building){var _a;if(building.modifiers===undefined)
return;(_a=this.buildingsInTown.get(building))===null||_a===void 0?void 0:_a.updateModifierTotals(building);}
updateBuildingTotalOutput(building){const buildingInTown=this.buildingsInTown.get(building);if(buildingInTown===undefined)
return;buildingInTown.updateResourceTotals(building,this.township);buildingInTown.updateBuildingTotals(building,this.township);}
createWorshipSelection(){const container=createElement('div',{className:'row row-deck no-gutters'});const containerModal=createElement('div',{className:'row row-deck no-gutters'});this.defaultElements.div.worship.append(container);this.defaultElements.div.worshipModal.append(containerModal);this.township.worships.forEach((worship)=>{if(this.isWorshipUnlocked(worship)){const worshipButtons=new TownshipWorshipSelectButtonElement();const worshipButtonsModal=new TownshipWorshipSelectButtonElement();container.append(worshipButtons);containerModal.append(worshipButtonsModal);worshipButtons.setWorship(worship,this.township);worshipButtonsModal.setWorship(worship,this.township);this.worshipSelects.set(worship,worshipButtons);this.worshipSelectsModal.set(worship,worshipButtonsModal);}});this.updateWorshipSelection();}
updateCurrentWorship(){this.defaultElements.div.currentWorshipModal.innerHTML=templateString(getLangString('TOWNSHIP_MENU','CURRENT_WORSHIP'),{worship:this.township.currentWorshipName});}
isWorshipUnlocked(worship){if(worship.isHidden)
return false;return game.checkRequirements(worship.unlockRequirements,false);}
updateWorshipSelection(){this.township.worships.forEach((worship)=>{if(!worship.isHidden){const worshipElement=this.worshipSelects.get(worship);const worshipElementModal=this.worshipSelectsModal.get(worship);if(worshipElement===undefined)
return;if(worshipElementModal===undefined)
return;if(worship!==this.township.worshipInSelection){worshipElement.setUnselected();worshipElementModal.setUnselected();}
else{worshipElement.setSelected();worshipElementModal.setSelected();const modifiers=new TownshipWorshipSelectElement();const modifiersModal=new TownshipWorshipSelectElement();modifiers.setWorship(worship,this.township);modifiersModal.setWorship(worship,this.township);this.defaultElements.div.worshipModifiers.innerHTML='';this.defaultElements.div.worshipModifiers.append(modifiers);this.defaultElements.div.worshipModifiersModal.innerHTML='';this.defaultElements.div.worshipModifiersModal.append(modifiersModal);}}});}
buildCapResourceElements(){const resourceCapContainer=document.getElementById(`CAP_RESOURCES_DATA`);if(resourceCapContainer===null)
throw new Error(`Error building TownshipUI, resource cap container is not in DOM.`);const elements=[];const title=createElement('div',{text:getLangString('TOWNSHIP_MENU','CAP_RESOURCES'),classList:['col-12','font-w600','mb-1'],});elements.push(title);this.township.resources.forEach((resource)=>{if(resource.id==="melvorF:GP")
return;const capResourceContainer=createElement('div',{className:'col-12 col-xl-6',});const cap=new TownshipCapResourceElement();cap.setResource(resource,this.township);cap.initQtyDropdowns(resource,this.township);capResourceContainer.append(cap);elements.push(capResourceContainer);this.capResourceElements.set(resource,cap);});resourceCapContainer.after(...elements);}
buildYeetItemElement(){const yeetContainer=document.getElementById('YEET_RESOURCES_DATA');if(yeetContainer===null)
throw new Error(`Error building TownshipUI, yeet container is not in DOM.`);const title=createElement('div',{text:getLangString('TOWNSHIP_MENU','YEET_RESOURCES'),classList:['col-12','font-w600','mb-1','mt-3'],});yeetContainer.append(title);this.township.resources.forEach((resource)=>{if(resource.id==="melvorF:GP")
return;const resourceContainer=createElement('ul',{className:'nav-main nav-main-horizontal nav-main-horizontal-override font-w400 font-size-sm mb-2',});TownshipUI.yeetResourceOptions.forEach((amount)=>{const yeet=new TownshipYeetElement();yeet.setResource(resource,amount,this.township);resourceContainer.append(yeet);});yeetContainer.append(resourceContainer);});}
buildConvertItemElements(){const jumpToList=document.getElementById('convert-resource-jump-to');this.township.convertValues.percentages.forEach((value)=>{const btn=document.getElementById(`convert-resource-quick-qty-${value}`);if(btn!==null){btn.onclick=()=>{this.township.convertQtyType=1;this.township.convertQtyPercent=value;this.updateConvertTypeBtn();};}});const btn=document.getElementById(`convert-resource-quick-qty-all-but-1`);if(btn!==null){btn.onclick=()=>{this.township.convertQtyType=2;this.updateConvertTypeBtn();};}
const toTownshipElement=document.getElementById('CONVERT_RESOURCES_DATA_TO_TOWN');this.township.resources.forEach((resource)=>{if(resource.itemConversions.length===0)
return;const jumpToResource=new TownshipConversionJumpToElement();jumpToResource.setIcon(resource);jumpToResource.onclick=()=>{var _a;(_a=document.getElementById(`jump-to-resource-${resource.id}`))===null||_a===void 0?void 0:_a.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});};jumpToList.append(jumpToResource);const titleBlock=createElement('div',{className:'block block-rounded-double bg-combat-inner-dark text-center w-100 p-1',id:`jump-to-resource-${resource.id}`,});const titleImage=createElement('img',{className:'skill-icon-sm mr-2'});const titleQuantity=createElement('span',{className:'font-w600',id:`convert-resource-${resource.id}-quantity`,});titleImage.src=resource.media;titleQuantity.textContent=numberWithCommas(Math.floor(resource.amount));titleBlock.append(titleImage,titleQuantity);toTownshipElement.append(titleBlock);const convertTo=[];const convertToContainer=createElement('ul',{className:'nav-main nav-main-horizontal nav-main-horizontal-override font-w400 font-size-sm mb-2',});toTownshipElement.append(convertToContainer);resource.itemConversions.forEach((item)=>{const convertToElem=new TownshipConversionElement();convertToContainer.append(convertToElem);convertToElem.setItemToResource(resource,item,this.township);convertTo.push(convertToElem);});this.conversionElements.set(resource,{convertTo});});}
updateConvertVisibility(){this.township.resources.forEach((resource)=>{const conversions=this.conversionElements.get(resource);if(conversions===undefined)
return;resource.itemConversions.forEach((item,i)=>{if(game.stats.itemFindCount(item)>0){showElement(conversions.convertTo[i]);if(game.stats.itemFindCount(item)<10000&&this.township.convertType===1){conversions.convertTo[i].convertButton.classList.replace('no-bg','bg-trader-locked');}
else{conversions.convertTo[i].convertButton.classList.replace('bg-trader-locked','no-bg');}}
else{hideElement(conversions.convertTo[i]);}});});}
updateConvertQtyElements(){this.township.resources.forEach((resource)=>{const conversions=this.conversionElements.get(resource);if(conversions===undefined)
return;resource.itemConversions.forEach((item,i)=>{conversions.convertTo[i].updateConvertRatio(resource,item,this.township);});});}
updateConvertTypeBtn(){const btnTo=document.getElementById('BTN_CONVERT_TO');const btnFrom=document.getElementById('BTN_CONVERT_FROM');if(this.township.convertType===0){btnTo.classList.replace('btn-outline-primary','btn-success');btnFrom.classList.replace('btn-success','btn-outline-primary');}
else{btnFrom.classList.replace('btn-outline-primary','btn-success');btnTo.classList.replace('btn-success','btn-outline-primary');}
this.township.convertValues.percentages.forEach((value)=>{document.querySelectorAll(`.convert-resource-quick-qty-${value}`).forEach((btn)=>{if(this.township.convertQtyType===1&&this.township.convertQtyPercent===value){btn.classList.replace('btn-primary','btn-success');}
else{btn.classList.replace('btn-success','btn-primary');}});});document.querySelectorAll(`.convert-resource-quick-qty-all-but-1`).forEach((btn)=>{this.township.convertQtyType===2?btn.classList.replace('btn-primary','btn-success'):btn.classList.replace('btn-success','btn-primary');});}
showTaskReadyIcon(){this.defaultElements.icon.taskReady.classList.remove('d-none');}
hideTaskReadyIcon(){this.defaultElements.icon.taskReady.classList.add('d-none');}
updateResourceCapElement(resource){const el=this.capResourceElements.get(resource);if(el===undefined)
return;el.setCap(resource);}
showChangeWorshipSwal(){const worship=this.township.worshipInSelection;SwalLocale.fire({title:'Change Worship',html:`<div class="font-w600 mb-3 text-warning">${worship===null||worship===void 0?void 0:worship.name}</div>
      <div class="font-w600 mb-3">${getLangString('TOWNSHIP_MENU','CHANGE_WORSHIP_DESC_0')}</div>
      <div class="font-w600 text-danger mb-1">${getLangString('TOWNSHIP_MENU','CHANGE_WORSHIP_DESC_1')}</div>
      <div class="font-w600 text-danger mb-3">${getLangString('TOWNSHIP_MENU','CHANGE_WORSHIP_DESC_2')}</div>
      <div class="font-w600">${getLangString('TOWNSHIP_MENU','CHANGE_WORSHIP_DESC_3')}</div>`,showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),cancelButtonText:getLangString('CHARACTER_SELECT','45'),}).then((result)=>{if(result.value){game.township.confirmWorship();game.township.confirmChangeOfWorship();game.township.updateForBuildingChange();game.township.setTownBiome(undefined,false);}});}
updateTotalBiomesPurchased(){this.defaultElements.town.breakdown.boimesPurchased.textContent=`${numberWithCommas(this.township.townData.sectionsPurchased)} / ${numberWithCommas(this.township.MAX_TOWN_SIZE)}`;}
highlightBiomesWithResource(resource){this.township.biomes.forEach((biome)=>{var _a;if(biome.containsResources.has(resource)){(_a=this.buildBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.showHighlightBorder();}});}
unhighlightBiomesWithResource(){this.township.biomes.forEach((biome)=>{var _a;(_a=this.buildBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.hideHighlightBorder();});}
highlightBiomesWithBuilding(building){this.township.biomes.forEach((biome)=>{var _a;if(building.biomes.includes(biome)){(_a=this.buildBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.showBuildable();}});}
unhighlightBiomesWithBuilding(){this.township.biomes.forEach((biome)=>{var _a;(_a=this.buildBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.hideBuildable();});}
highlightBiomesWithBuildingBuilt(building){this.township.biomes.forEach((biome)=>{var _a,_b,_c;if(biome.getBuildingCount(building)>0){(_a=this.townBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.highlightBorder();(_b=this.townBiomeSelectButtons.get(biome))===null||_b===void 0?void 0:_b.setBuildingCount(building,biome);(_c=this.townBiomeSelectButtons.get(biome))===null||_c===void 0?void 0:_c.showBuildingCount();}});}
unhighlightBiomesWithBuildingBuilt(){this.township.biomes.forEach((biome)=>{var _a,_b;(_a=this.townBiomeSelectButtons.get(biome))===null||_a===void 0?void 0:_a.unhighlightBorder();(_b=this.townBiomeSelectButtons.get(biome))===null||_b===void 0?void 0:_b.hideBuildingCount();});}
highlightBiomesWith(provides){this.township.biomes.forEach((biome)=>{const el=document.getElementById(`township-build-biome-select-select-button-${biome.localID}`);if(el!==null){switch(provides){case 'population':if(biome.provides.population)
el.classList.replace('ts-biome-select-border','ts-biome-highlight');break;case 'storage':if(biome.provides.storage)
el.classList.replace('ts-biome-select-border','ts-biome-highlight');break;case 'happiness':if(biome.provides.happiness)
el.classList.replace('ts-biome-select-border','ts-biome-highlight');break;case 'education':if(biome.provides.education)
el.classList.replace('ts-biome-select-border','ts-biome-highlight');break;case 'deadStorage':if(biome.provides.deadStorage)
el.classList.replace('ts-biome-select-border','ts-biome-highlight');break;case 'worship':if(biome.provides.worship)
el.classList.replace('ts-biome-select-border','ts-biome-highlight');break;}}});}
unhighlightBiomes(){this.township.biomes.forEach((biome)=>{var _a;(_a=document.getElementById(`township-build-biome-select-select-button-${biome.localID}`))===null||_a===void 0?void 0:_a.classList.replace('ts-biome-highlight','ts-biome-select-border');});}
setTownViewTab(tab){this.hideAllTownViewTabs();tab===0?this.showAllTownViewTabs():this.showTownViewTab(tab);let btn=document.getElementById(`township-town-tab-btn-${this.townViewTab}`);if(btn!==null)
btn.classList.replace('btn-primary','btn-outline-primary');btn=document.getElementById(`township-town-tab-btn-${tab}`);if(btn!==null)
btn.classList.replace('btn-outline-primary','btn-primary');this.townViewTab=tab;}
hideTownViewTab(tab){const el=document.getElementById(`township-town-tab-${tab}`);if(el!==null)
el.classList.add('d-none');}
showTownViewTab(tab){const el=document.getElementById(`township-town-tab-${tab}`);if(el!==null)
el.classList.remove('d-none');}
showAllTownViewTabs(){this.showTownViewTab(0);this.showTownViewTab(1);this.showTownViewTab(2);this.showTownViewTab(3);}
hideAllTownViewTabs(){this.hideTownViewTab(0);this.hideTownViewTab(1);this.hideTownViewTab(2);this.hideTownViewTab(3);}
updateTraderStockAvailable(){document.querySelectorAll('.township-trader-stock-available').forEach((el)=>{el.innerHTML=templateString(getLangString('TOWNSHIP_MENU','TRADER_STOCK_REMAINING'),{gpIcon:`<img class="skill-icon-xxs mr-1" src="${cdnMedia("assets/media/main/coins.svg")}">`,value:numberWithCommas(this.township.townData.traderStock),});});document.querySelectorAll('.township-trader-stock-increase').forEach((el)=>{el.textContent=templateString(getLangString('TOWNSHIP_MENU','TRADER_STOCK_INCREASE'),{value:numberWithCommas(this.township.traderStockIncrease),});});}
toggleTownInfo(){const el=document.getElementById('TOWN_TABLE');if(el!==null)
el.classList.toggle('d-none');}
toggleTownResources(){const el=document.getElementById('RESOURCES_TABLE');if(el!==null)
el.classList.toggle('d-none');}}
TownshipUI.destroyBuildingOptions=[1,5,10,25];TownshipUI.upgradeBuildingOptions=[1,5,10,25];TownshipUI.yeetResourceOptions=[1,10,100,1000,10000,100000,1000000];TownshipUI.resourceCapOptions=[1,5,10,20,30,40,50,60,70,80,90,100];class TownshipData{constructor(township,game){this.township=township;this.game=game;this.happiness=0;this.education=0;this.healthPercent=0;this.buildingStorage=0;this.deadStorage=0;this.worshipCount=0;this.dead=0;this.sectionsPurchased=1;this.biomesUnlocked=1;this.townCreated=false;this.traderStock=0;this.worship=township.noWorship;}
encode(writer){writer.writeUint32(this.dead);writer.writeBoolean(this.priorityJob!==undefined);if(this.priorityJob!==undefined)
writer.writeNamespacedObject(this.priorityJob);writer.writeBoolean(this.currentBuildBiome!==undefined);if(this.currentBuildBiome!==undefined)
writer.writeNamespacedObject(this.currentBuildBiome);writer.writeUint32(this.sectionsPurchased);writer.writeNamespacedObject(this.worship);writer.writeBoolean(this.townCreated);writer.writeUint32(this.biomesUnlocked);writer.writeUint32(this.traderStock);return writer;}
decode(reader,version){this.dead=reader.getUint32();if(reader.getBoolean()){const priorityJob=reader.getNamespacedObject(this.township.jobs);if(typeof priorityJob!=='string')
this.priorityJob=priorityJob;}
if(reader.getBoolean()){const selectedBiome=reader.getNamespacedObject(this.township.biomes);if(typeof selectedBiome!=='string')
this.currentBuildBiome=selectedBiome;}
this.sectionsPurchased=reader.getUint32();const worship=reader.getNamespacedObject(this.township.worships);if(typeof worship!=='string')
this.worship=worship;else if(worship.startsWith('melvor'))
this.worship=this.township.worships.getDummyObject(worship,DummyTownshipWorship,this.game);this.townCreated=reader.getBoolean();if(version<32)
this.biomesUnlocked=this.sectionsPurchased;else
this.biomesUnlocked=reader.getUint32();if(version>=36)
this.traderStock=reader.getUint32();}}
const townshipIcons={population:'fa fa-house-user',happiness:'fa fa-smile',education:'fa fa-book-open text-info',health:'fa fa-plus-circle text-success',storage:'fa fa-box-open',dead:'fa fa-skull-crossbones text-warning',worship:'fa fa-church text-danger',workers:'fa fa-user',showAll:'fa fa-redo-alt',};