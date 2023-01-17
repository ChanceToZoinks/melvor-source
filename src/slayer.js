"use strict";class SlayerTask{constructor(player,game){this.player=player;this.game=game;this.active=false;this.killsLeft=0;this.extended=false;this.tier=SlayerTierID.Easy;this.completion=[0,0,0,0,0,0,0];this.taskTimer=new Timer('SlayerTask',()=>this.setTask());this.autoStartNext=false;this.renderRequired=true;this.renderNewButton=true;this.areaBypassItems=[];this.allAreaBypassItems=[];this.shouldResetTaskState=false;}
get autoSlayer(){return this.game.settings.enableAutoSlayer;}
postDataRegistration(){this.game.items.equipment.forEach((item)=>{var _a,_b;if(((_a=item.modifiers)===null||_a===void 0?void 0:_a.bypassSlayerItems)!==undefined)
this.areaBypassItems.push(item);if(((_b=item.modifiers)===null||_b===void 0?void 0:_b.bypassAllSlayerItems)!==undefined)
this.allAreaBypassItems.push(item);});}
render(){if(this.renderRequired)
this.renderTask();if(this.renderNewButton)
this.renderButtonSpinner();}
jumpToTaskOnClick(){if(this.game.combat.isEventActive){notifyPlayer(this.game.attack,getLangString('TOASTS','CANNOT_DURING_EVENT'),'danger');}
else if(this.monster!==undefined){this.game.combat.selectMonster(this.monster,this.game.getMonsterArea(this.monster));}
else{console.warn('Tried to jump to slayer task enemy, but no task monster is set.');}}
renderTask(){if(!this.active||this.monster===undefined){combatMenus.slayerTask.setNoTask();}
else{combatMenus.slayerTask.setTaskMonster(this.monster,this.killsLeft,this.tier);combatMenus.slayerTask.updateTaskExtension(this.extended,this.getExtensionCost());}
this.renderRequired=false;}
renderButtonSpinner(){combatMenus.slayerTask.updateTaskSpinner(this.taskTimer.isActive);this.renderNewButton=false;}
extendTask(){const cost=this.getExtensionCost();if(this.game.slayerCoins.canAfford(cost)){this.game.slayerCoins.remove(cost);this.extended=true;this.killsLeft+=(this.tier+1)*(10+Math.floor(this.game.slayer.level/5));this.renderTask();}
else{notifyPlayer(this.game.slayer,getLangString('TOASTS','CANNOT_AFFORD_THAT'),'danger');}}
addKill(){this.killsLeft--;this.game.stats.Slayer.inc(SlayerStats.MonstersKilledOnTask);if(this.killsLeft<=0){this.active=false;this.completion[this.tier]++;this.game.queueRequirementRenders();this.selectTask(this.tier,false,false);}
this.renderRequired=true;}
tick(){this.taskTimer.tick();}
getExtensionCost(){return 100*Math.pow(this.tier+1,3);}
selectTask(tier,costsCoins,render,fromClick=false){const data=SlayerTask.data[tier];if(costsCoins&&!this.game.slayerCoins.canAfford(data.cost)){notifyPlayer(this.game.slayer,getLangString('TOASTS','CANNOT_AFFORD_THAT'),'danger');}
else{const monsterSelection=this.getMonsterSelection(tier);if(monsterSelection.length>0){const newMonster=monsterSelection[rollInteger(0,monsterSelection.length-1)];if(costsCoins)
this.game.slayerCoins.remove(data.cost);this.monster=newMonster;this.tier=tier;this.active=false;this.autoStartNext=!fromClick;this.taskTimer.start(1000);this.renderRequired=true;this.renderNewButton=true;}
else if(this.autoSlayer){notifyPlayer(this.game.slayer,getLangString('TOASTS','NO_TASK_FOUND_EQUIPMENT'),'danger');}
else{notifyPlayer(this.game.slayer,getLangString('TOASTS','NO_TASK_FOUND_TIER'),'danger');}}
if(render){this.render();this.clickNewTask();}}
getTaskLength(tier){const taskMultiplier=this.player.modifiers.increasedSlayerTaskLength-this.player.modifiers.decreasedSlayerTaskLength;let taskLength=(tier+1)*10+4*Math.floor(Math.random()*this.game.slayer.level+1);taskLength=applyModifier(taskLength,taskMultiplier);return taskLength;}
setTask(){this.active=true;this.extended=false;this.killsLeft=this.getTaskLength(this.tier);this.renderRequired=true;this.renderNewButton=true;if(this.monster===undefined)
throw new Error('Error setting slayer task, monster is not set.');if(this.autoSlayer&&this.autoStartNext&&!this.game.combat.isEventActive)
this.game.combat.selectMonster(this.monster,this.game.getMonsterArea(this.monster));}
getMonsterSelection(tier){const data=SlayerTask.data[tier];return this.game.monsters.filter((monster)=>{const combatLevel=monster.combatLevel;const monsterArea=this.game.getMonsterArea(monster);let slayerLevelReq=0;if(monsterArea instanceof SlayerArea)
slayerLevelReq=monsterArea.slayerLevelRequired;return(monster.canSlayer&&combatLevel>=data.minLevel&&combatLevel<=data.maxLevel&&this.checkRequirements(monsterArea.entryRequirements,!this.autoSlayer,slayerLevelReq)&&monster!==this.monster);});}
clickNewTask(){if(combatMenus.slayerTask.taskSelectionOpen){combatMenus.slayerTask.closeTaskSelection();}
else if(!this.game.slayer.isUnlocked){lockedSkillAlert(this.game.slayer,'SKILL_UNLOCK_ACCESS_THIS');}
else{combatMenus.slayerTask.updateTaskSelectButtons(this.game);combatMenus.slayerTask.openTaskSelection();}}
checkRequirements(requirements,softReq,slayerLevelReq){return requirements.every((requirement)=>{if(requirement.type==='SlayerItem'&&softReq){const itemList=[requirement.item,...this.allAreaBypassItems];if(slayerLevelReq<100)
itemList.push(...this.areaBypassItems);return itemList.some((item)=>this.game.stats.itemFindCount(item)>0);}
else{return this.game.checkRequirement(requirement,false,slayerLevelReq);}});}
getTaskCompletionsForTierAndAbove(tier){let total=0;for(let i=tier;i<this.completion.length;i++){total+=this.completion[i];}
return total;}
resetTaskState(){this.active=false;this.monster=undefined;this.killsLeft=0;this.extended=false;this.tier=0;this.taskTimer.stop();}
encode(writer){writer.writeBoolean(this.active);writer.writeBoolean(this.monster!==undefined);if(this.monster)
writer.writeNamespacedObject(this.monster);writer.writeUint32(this.killsLeft);writer.writeBoolean(this.extended);writer.writeUint8(this.tier);writer.writeArray(this.completion,(count,writer)=>writer.writeUint32(count));this.taskTimer.encode(writer);return writer;}
decode(reader,version){this.active=reader.getBoolean();if(reader.getBoolean()){const monster=reader.getNamespacedObject(this.game.monsters);if(typeof monster==='string')
this.shouldResetTaskState=true;else
this.monster=monster;}
this.killsLeft=reader.getUint32();this.extended=reader.getBoolean();this.tier=reader.getUint8();this.completion=reader.getArray((reader)=>reader.getUint32());this.taskTimer.decode(reader,version);if(this.shouldResetTaskState)
this.resetTaskState();}
deserialize(reader,version,idMap){this.active=reader.getBool();const monsterID=reader.getNumber();const monster=this.game.monsters.getObjectByID(idMap.monsters[monsterID]);if(monster===undefined)
this.shouldResetTaskState=true;else
this.monster=monster;this.killsLeft=reader.getNumber();this.extended=reader.getBool();this.tier=reader.getNumber();const numTiers=version<18?5:SlayerTask.data.length;this.completion=reader.getChunk(numTiers);if(this.shouldResetTaskState)
this.resetTaskState();}
convertFromOldSaveFormat(oldTasks,oldCompletion,idMap){var _a,_b;if(oldTasks.length!==0){const oldTask=oldTasks[0];const monster=this.game.monsters.getObjectByID(idMap.monsters[oldTask.monsterID]);if(monster!==undefined){this.active=true;this.monster=monster;this.killsLeft=oldTask.count;this.extended=(_a=oldTask.extended)!==null&&_a!==void 0?_a:false;this.tier=(_b=oldTask.tier)!==null&&_b!==void 0?_b:0;}}
this.completion=oldCompletion;}}
SlayerTask.data=[{get display(){return getLangString('COMBAT_MISC','23');},engDisplay:'Easy',cost:0,minLevel:1,maxLevel:49,slayerLevel:1,},{get display(){return getLangString('COMBAT_MISC','24');},engDisplay:'Normal',cost:2000,minLevel:50,maxLevel:99,slayerLevel:25,},{get display(){return getLangString('COMBAT_MISC','25');},engDisplay:'Hard',cost:5000,minLevel:100,maxLevel:199,slayerLevel:50,},{get display(){return getLangString('COMBAT_MISC','26');},engDisplay:'Elite',cost:15000,minLevel:200,maxLevel:374,slayerLevel:75,},{get display(){return getLangString('COMBAT_MISC','27');},engDisplay:'Master',cost:25000,minLevel:375,maxLevel:789,slayerLevel:85,},{get display(){return getLangString('COMBAT_MISC','SLAYER_TIER_5');},engDisplay:'Legendary',cost:50000,minLevel:790,maxLevel:999,slayerLevel:100,},{get display(){return getLangString('COMBAT_MISC','SLAYER_TIER_6');},engDisplay:'Mythical',cost:100000,minLevel:1000,maxLevel:Infinity,slayerLevel:110,},];class SlayerTaskMenuElement extends HTMLElement{constructor(){super();this.selectTaskButtons=[];this.taskSelectionOpen=false;this._content=new DocumentFragment();this._content.append(getTemplateNode('slayer-task-menu-template'));this.slayerIcon=getElementFromFragment(this._content,'slayer-icon','img');this.newTaskSpinner=getElementFromFragment(this._content,'new-task-spinner','div');this.newTaskButton=getElementFromFragment(this._content,'new-task-button','a');this.newTaskButtonText=getElementFromFragment(this._content,'new-task-button-text','small');this.selectTaskContainer=getElementFromFragment(this._content,'select-task-container','div');this.locatingContent=getElementFromFragment(this._content,'locating-content','div');this.monsterContainer=getElementFromFragment(this._content,'monster-container','h5');this.monsterImage=getElementFromFragment(this._content,'monster-image','img');this.monsterLevel=getElementFromFragment(this._content,'monster-level','span');this.taskTier=getElementFromFragment(this._content,'task-tier','small');this.monsterName=getElementFromFragment(this._content,'monster-name','div');this.jumpToEnemyButton=getElementFromFragment(this._content,'jump-to-enemy-button','button');this.extendContainer=getElementFromFragment(this._content,'extend-container','h5');this.extendMessage=getElementFromFragment(this._content,'extend-message','span');this.extendTaskButton=getElementFromFragment(this._content,'extend-task-button','a');this.extendTaskCost=getElementFromFragment(this._content,'extend-task-cost','small');this.autoSlayerCheckBox=getElementFromFragment(this._content,'auto-slayer-checkbox','settings-checkbox');}
connectedCallback(){this.appendChild(this._content);this.slayerIconTooltip=tippy(this.slayerIcon,{content:getLangString('SKILL_NAME','Slayer'),placement:'bottom',interactive:false,animation:false,});}
disconnectedCallback(){if(this.slayerIconTooltip!==undefined){this.slayerIconTooltip.destroy();this.slayerIconTooltip=undefined;}}
initialize(game){SlayerTask.data.forEach((taskData,tier)=>{if(taskData.slayerLevel>game.slayer.levelCap)
return;const taskButton=createElement('button',{className:'btn btn-sm btn-secondary font-w400 font-size-sm m-1 w-100',});taskButton.onclick=()=>game.combat.slayerTask.selectTask(tier,true,true,true);this.selectTaskButtons.push(taskButton);this.selectTaskContainer.append(taskButton);});this.jumpToEnemyButton.onclick=()=>game.combat.slayerTask.jumpToTaskOnClick();this.extendTaskButton.onclick=()=>game.combat.slayerTask.extendTask();this.newTaskButton.onclick=()=>game.combat.slayerTask.clickNewTask();}
setNoTask(){hideElement(this.monsterContainer);hideElement(this.extendContainer);}
setTaskMonster(monster,killsLeft,tier){showElement(this.monsterContainer);showElement(this.extendContainer);this.monsterImage.src=monster.media;this.monsterImage.onclick=()=>viewMonsterStats(monster);this.monsterLevel.textContent=`${monster.combatLevel}`;this.taskTier.textContent=SlayerTask.data[tier].display;this.monsterName.textContent=`${killsLeft} x ${monster.name}`;}
updateTaskExtension(isExtended,extensionCost){if(isExtended){showElement(this.extendMessage);hideElement(this.extendTaskButton);}
else{hideElement(this.extendMessage);showElement(this.extendTaskButton);this.extendTaskCost.innerHTML=templateLangString('COMBAT_MISC','29',{coinImage:`<img class="skill-icon-xxs mr-1" src="${cdnMedia("assets/media/main/slayer_coins.svg")}">`,value:numberWithCommas(extensionCost),});}}
openTaskSelection(){this.taskSelectionOpen=true;this.newTaskButtonText.textContent=getLangString('CHARACTER_SELECT','45');this.newTaskButton.classList.replace('combat-action','text-danger');showElement(this.selectTaskContainer);}
closeTaskSelection(){this.taskSelectionOpen=false;this.newTaskButtonText.textContent=getLangString('COMBAT_MISC','22');this.newTaskButton.classList.replace('text-danger','combat-action');hideElement(this.selectTaskContainer);}
updateTaskSelectButtons(game){const slayerLevel=game.slayer.level;SlayerTask.data.forEach((data,tier)=>{const button=this.selectTaskButtons[tier];if(button===undefined)
return;button.textContent='';if(slayerLevel>=data.slayerLevel){let costClass;if(game.slayerCoins.canAfford(data.cost)){costClass='text-success';}
else{costClass='text-danger';}
const combatImage=createElement('img',{classList:['skill-icon-xs','ml-2']});combatImage.src=cdnMedia("assets/media/skills/combat/combat.svg");const coinImage=createElement('img',{classList:['skill-icon-xs','ml-2']});coinImage.src=cdnMedia("assets/media/main/slayer_coins.svg");const rangeText=`${data.minLevel}${data.maxLevel===Infinity?'+':` - ${data.maxLevel}`}`;const costText=data.cost===0?getLangString('COMBAT_MISC','COST_FREE'):numberWithCommas(data.cost);button.append(document.createTextNode(data.display),combatImage,document.createTextNode(rangeText),coinImage,createElement('span',{classList:[costClass],text:costText}));if(game.slayerCoins.canAfford(data.cost)){button.disabled=false;button.classList.remove('disabled');}
else{button.disabled=true;button.classList.add('disabled');}}
else{const slayerImage=createElement('img',{classList:['skill-icon-xs','ml-2']});slayerImage.src=cdnMedia("assets/media/skills/slayer/slayer.svg");button.appendChild(createElement('span',{classList:['text-danger']})).append(...templateLangStringWithNodes('MENU_TEXT','REQUIRES_SKILL_LEVEL',{skillImage:slayerImage},{level:`${data.slayerLevel}`}));button.classList.add('disabled');button.disabled=true;}});}
updateTaskSpinner(isSelecting){if(isSelecting){hideElement(this.newTaskButton);showElement(this.newTaskSpinner);showElement(this.locatingContent);}
else{showElement(this.newTaskButton);hideElement(this.newTaskSpinner);hideElement(this.locatingContent);}}
toggleAutoSlayerCheckbox(unlocked){if(unlocked){showElement(this.autoSlayerCheckBox);}
else{hideElement(this.autoSlayerCheckBox);}}}
window.customElements.define('slayer-task-menu',SlayerTaskMenuElement);