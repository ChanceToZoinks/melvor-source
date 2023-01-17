"use strict";const MAX_QUICK_EQUIP_ITEMS=3;class Equipment{constructor(game){this.game=game;this.slotArray=[];this.slotMap=new Map();this.itemChargeUsers=new Set();this.itemQuantityUsers=new Set();this.bankItemUsers=new Set();this.slots={};Object.entries(equipmentSlotData).forEach((entry)=>{const slot=new EquipSlot(entry[0],this.game.emptyEquipmentItem);this.slots[entry[0]]=slot;this.slotArray[entry[1].id]=slot;});}
get isWeapon2H(){return this.slots.Weapon.item.occupiesSlots.includes('Shield');}
getItemsAddedOnEquip(item,slot){if(slot==='Default')
slot=item.validSlots[0];const slotsToUnequip=this.getSlotsToUnequip(item,slot);const itemsAdded=slotsToUnequip.map((slotType)=>{const slot=this.slots[slotType];return{item:slot.item,quantity:slot.quantity,};});return itemsAdded;}
getItemsAddedOnUnequip(slot){const rootSlot=this.getRootSlot(slot);const unequipSlot=this.slots[rootSlot];return{item:unequipSlot.item,quantity:unequipSlot.quantity,};}
getSlotsToUnequip(itemToEquip,slot){const slotsRequired=[slot,...itemToEquip.occupiesSlots];const slotsToUnequip=[];slotsRequired.forEach((slotType)=>{const slot=this.slots[slotType];if(!slot.isEmpty){const rootSlotType=this.getRootSlot(slotType);if(!slotsToUnequip.includes(rootSlotType))
slotsToUnequip.push(rootSlotType);}});return slotsToUnequip;}
getRootSlot(slotType){const slot=this.slots[slotType];let rootSlotType;if(slot.occupiedBy==='None'){rootSlotType=slotType;}
else{rootSlotType=slot.occupiedBy;}
return rootSlotType;}
equipItem(itemToEquip,slot,quantity){const slotsToUnequip=this.getSlotsToUnequip(itemToEquip,slot);slotsToUnequip.forEach((unequipType)=>{this.unequipItem(unequipType);});this.slotMap.set(itemToEquip,slot);if(itemToEquip.consumesOn!==undefined)
this.itemQuantityUsers.add(this.slots[slot]);if(itemToEquip.consumesChargesOn!==undefined)
this.itemChargeUsers.add(this.slots[slot]);if(itemToEquip.consumesItemOn!==undefined)
this.bankItemUsers.add(this.slots[slot]);this.slots[slot].setEquipped(itemToEquip,quantity,itemToEquip.occupiesSlots);itemToEquip.occupiesSlots.forEach((slotType)=>this.slots[slotType].setOccupied(itemToEquip,slot));}
unequipItem(slot){const unequip=this.slots[this.getRootSlot(slot)];this.slotMap.delete(unequip.item);if(unequip.item.consumesOn!==undefined)
this.itemQuantityUsers.delete(unequip);if(unequip.item.consumesChargesOn!==undefined)
this.itemChargeUsers.delete(unequip);if(unequip.item.consumesItemOn!==undefined)
this.bankItemUsers.delete(unequip);unequip.occupies.forEach((occupied)=>this.slots[occupied].setEmpty());unequip.setEmpty();}
forceAddAllToBank(){this.slotArray.forEach((slot)=>{if(slot.providesStats)
this.game.bank.addItem(slot.item,slot.quantity,false,false,true);});}
checkForItem(item){return this.slotMap.has(item);}
checkForItemID(itemID){const item=this.game.items.equipment.getObjectByID(itemID);if(item===undefined)
return false;return this.checkForItem(item);}
checkForItemIDs(itemIDs){const idsNotFound=[...itemIDs];return this.slotArray.some((slot)=>{const idIndex=idsNotFound.findIndex((id)=>slot.isItem(id));if(idIndex!==-1)
idsNotFound.splice(idIndex,1);return idsNotFound.length===0;});}
getSlotOfItem(item){var _a;return(_a=this.slotMap.get(item))!==null&&_a!==void 0?_a:'None';}
getQuantityOfItem(item){const slot=this.slotArray.find((slot)=>{return slot.item===item&&slot.occupiedBy==='None';});return slot===undefined?0:slot.quantity;}
addQuantityToSlot(slot,quantity){this.slots[slot].quantity+=quantity;}
removeQuantityFromSlot(slot,quantity){const equipped=this.slots[slot];equipped.quantity-=quantity;if(equipped.quantity<=0){this.unequipItem(slot);return true;}
return false;}
addEquipmentStats(stats){this.slotArray.forEach((slot)=>{if(slot.providesStats&&equipmentSlotData[slot.type].providesStats)
stats.addItemStats(slot.item);});}
getSnapshot(){const snapshot=new Map();this.slotArray.forEach((slot)=>{if(equipmentSlotData[slot.type].allowQuantity)
snapshot.set(slot.type,{item:slot.item,quantity:slot.quantity,});});return snapshot;}
render(player){Object.entries(equipmentSlotData).forEach((entry)=>{const slot=this.slots[entry[0]];let imgSrc=`assets/media/bank/${entry[1].emptyMedia}.png`;let allowUnequip=false;if(!slot.isEmpty){imgSrc=slot.item.media;allowUnequip=true;}
entry[1].imageElements.forEach((element,i)=>{element.src=imgSrc;if(slot.occupiedBy!=='None')
element.classList.add('faded-image');else
element.classList.remove('faded-image');element.classList.remove('border-synergy-0','border-synergy-1','border-synergy-2','border-synergy-3');let borderID=0;player.activeItemSynergies.forEach((synergy)=>{if(synergy.items.some((id)=>slot.isItem(id))){element.classList.add(`border-synergy-${borderID}`);}
borderID++;});if(i!==2){element.onclick=null;}});if(entry[1].allowQuantity){entry[1].qtyElements.forEach((element)=>{element.textContent=formatNumber(slot.quantity);});}
if(player.isEquipmentSlotUnlocked(entry[0])){entry[1].imageElements.forEach(showElement);}
else{entry[1].imageElements.forEach(hideElement);}
if(slot.type==='Helmet'){combatMenus.equipmentMenuIcons.forEach((icon)=>{icon.src=imgSrc;});}});const synergyDescription=player.synergyDescription;let synergyMedia='';switch(synergyDescription){case '':synergyMedia=`${CDNDIR}assets/media/skills/summoning/synergy_inactive.svg`;break;case getLangString('MENU_TEXT','LOCKED'):synergyMedia=`${CDNDIR}assets/media/skills/summoning/synergy_locked.svg`;break;default:synergyMedia=`${CDNDIR}assets/media/skills/summoning/synergy.svg`;break;}
synergyElements.icons.forEach((icon)=>(icon.src=synergyMedia));this.updateTooltips(synergyDescription);if(!(player instanceof RaidPlayer)){const equippedIDs=new Map();this.itemChargeUsers.forEach((slot)=>{equippedIDs.set(slot.item.id,slot.item);});const chargeDisplays=document.querySelectorAll('item-charge-display');chargeDisplays.forEach((display)=>{const itemID=display.getAttribute('data-item-id');if(itemID!==null&&equippedIDs.has(itemID)){if(!display.initialized){const item=equippedIDs.get(itemID);if(item!==undefined){display.setItem(item);display.updateCharges(this.game.itemCharges.getCharges(item));}}
showElement(display);}
else{hideElement(display);}});}}
renderQuantity(){Object.entries(equipmentSlotData).forEach((entry)=>{const slot=this.slots[entry[0]];if(entry[1].allowQuantity){entry[1].qtyElements.forEach((element)=>{element.textContent=formatNumber(slot.quantity);});}});}
updateTooltips(synergyDescription){this.slotArray.forEach((slot)=>{if(!slot.isEmpty){const item=slot.item;let tooltipContent=`<div class="text-center"><span class="text-warning">${item.name}</span><small class='text-success'>`;if(item.description!==undefined)
tooltipContent+=`<br><span class="text-info">${item.description}</span>`;if(slot.type!=='Passive'){const equipStats=item.equipmentStats;equipStats.forEach((stat)=>{tooltipContent+='<br>';if(stat.value>0){tooltipContent+=Equipment.getEquipStatDescription(stat.key,stat.value);}
else{tooltipContent+=`<span class="text-danger">${Equipment.getEquipStatDescription(stat.key,stat.value)}</span>`;}});}
equipmentSlotData[slot.type].tooltips.forEach((tooltip,i)=>{const text=`${tooltipContent}${i!==2?'</small></div>':'</small></div>'}`;tooltip.setContent(text);});}
else{equipmentSlotData[slot.type].tooltips.forEach((tooltip)=>{tooltip.setContent('<div class="text-center">'+getLangString('COMBAT_MISC','116')+'</div>');});}});const synergyTooltip=this.getSynergyTooltipContent(synergyDescription);synergyElements.tooltips.forEach((tooltip)=>tooltip.setContent(synergyTooltip));}
getSynergyTooltipContent(synergyDescription){let html=`<div class="text-center"><h5 class="font-w600 mb-0 `;switch(synergyDescription){case '':html+=`font-size-sm text-danger">${getLangString('COMBAT_MISC','117')}`;break;case 'Locked':html+=`font-size-sm text-danger">${getLangString('COMBAT_MISC','118')}</h5><h5 class="font-w400 font-size-sm text-warning mb-0">${getLangString('COMBAT_MISC','119')}`;break;default:html+=`text-success">${getLangString('COMBAT_MISC','120')}</h5><h5 class="font-w400 font-size-sm text-info mb-0">${synergyDescription}`;break;}
html+=`</h5></div>`;return html;}
static getEquipStatDescription(type,value){let statValue;switch(type){case 'attackSpeed':statValue=`${formatFixed(value/1000,2)}`;break;case 'summoningMaxhit':statValue=`${Math.round(value*numberMultiplier)}`;break;default:statValue=`${value}`;}
if(value>0)
statValue='+'+statValue;return templateLangString('EQUIPMENT_STAT',type,{statValue});}
encode(writer){writer.writeArray(this.slotArray,(slot,writer)=>{writer.writeUint8(equipmentSlotData[slot.type].id);writer.writeBoolean(slot.providesStats);if(slot.providesStats){writer.writeNamespacedObject(slot.item);writer.writeUint32(slot.quantity);}
writer.writeArray(slot.quickEquipItems,writeNamespaced);});return writer;}
decode(reader,version,addOnFail=false){reader.getArray((reader)=>{const slotID=reader.getUint8();if(reader.getBoolean()){const item=reader.getNamespacedObject(this.game.items.equipment);const quantity=reader.getUint32();if(typeof item!=='string')
this.equipItem(item,EquipmentSlots[slotID],quantity);else if(item.startsWith('melvor')&&addOnFail)
this.game.bank.addDummyItemOnLoad(item,quantity);}
const slot=this.slotArray[slotID];slot.quickEquipItems=reader.getArray((reader)=>{let item=reader.getNamespacedObject(this.game.items.equipment);if(typeof item==='string'||!item.validSlots.includes(slot.type))
item=this.game.emptyEquipmentItem;return item;});slot.trimQuickEquipItems();});}
deserialize(reader,version,idMap,addOnFail=false){const numItems=reader.dataLength/3;for(let i=0;i<numItems;i++){const slotID=reader.getNumber();const itemID=reader.getNumber();const quantity=reader.getNumber();const newID=idMap.items[itemID];const item=this.game.items.equipment.getObjectByID(newID);if(item!==undefined){const slotType=EquipmentSlots[slotID];this.equipItem(item,slotType,quantity);if(version<21&&item.validSlots.includes(slotType))
this.slotArray[slotID].quickEquipItems[0]=item;}
else if(addOnFail)
this.game.bank.addDummyItemOnLoad(newID,quantity);}}
convertFromOldFormat(oldData,idMap){if(oldData.equipment[EquipmentSlots.Weapon]===oldData.equipment[EquipmentSlots.Quiver]){oldData.equipment[EquipmentSlots.Weapon]=0;}
oldData.equipment.forEach((itemID,slotID)=>{if(itemID!==0){let quantity=1;if(slotID===EquipmentSlots.Quiver)
quantity=oldData.ammo;if(slotID===EquipmentSlots.Summon1)
quantity=oldData.summonAmmo[0];if(slotID===EquipmentSlots.Summon2)
quantity=oldData.summonAmmo[1];const newID=idMap.items[itemID];const item=this.game.items.getObjectByID(newID);if(item instanceof EquipmentItem){this.equipItem(item,EquipmentSlots[slotID],quantity);}
else if(item!==undefined){this.game.bank.addItem(item,quantity,false,false,true);console.log(`Non-equipment item was found equipped during save conversion, adding to bank.`);}
else{this.game.bank.addDummyItemOnLoad(newID,quantity);}}});}
unequipAll(){this.slotArray.forEach((slot)=>slot.setEmpty());this.slotMap.clear();}}
class EquipmentSet{constructor(game){this.game=game;this.prayerSelection=new Set();this.equipment=new Equipment(game);this.spellSelection=new SpellSelection(game);}
encode(writer){this.equipment.encode(writer);this.spellSelection.encode(writer);writer.writeSet(this.prayerSelection,writeNamespaced);return writer;}
decode(reader,version,addOnFail=false){this.equipment.decode(reader,version,addOnFail);this.spellSelection.decode(reader,version);this.prayerSelection=reader.getSet(readNamespacedReject(this.game.prayers));}}
class EquipmentSetMenu{constructor(containerID,buttonClasses){this.buttonClasses=buttonClasses;this.buttons=[];this.highlightedButton=-1;const cont=document.getElementById(containerID);if(cont===null)
throw new Error(`Invalid id: ${containerID}`);this.container=cont;}
render(sets,selected,player){this.renderSets(sets,player);this.renderSelected(selected);this.setCallbacks(player);}
renderSets(sets,player){for(let i=0;i<player.numEquipSets;i++){const set=sets[i];let button=this.buttons[i];if(button===undefined){button=this.addButton(`${i+1}`);}
showElement(button.button);button.tooltip.setProps({onShow:(instance)=>{instance.setContent(this.getTooltipContent(set));},});}
for(let i=player.numEquipSets;i<this.buttons.length;i++){const button=this.buttons[i];hideElement(button.button);}}
renderSelected(selected){if(this.highlightedButton!==-1){const oldButton=this.buttons[this.highlightedButton].button;oldButton.classList.remove('btn-success');oldButton.classList.add('btn-primary');}
this.buttons[selected].button.classList.remove();this.highlightedButton=selected;const newButton=this.buttons[selected].button;newButton.classList.add('btn-success');newButton.classList.remove('btn-primary');}
setCallbacks(player){this.buttons.forEach((button,i)=>{button.button.onclick=()=>player.changeEquipmentSet(i);});}
getTooltipRow(media,name){return `<img class="skill-icon-xxs mr-1" src="${media}">${name}<br>`;}
getTooltipContent(set){const equipmentHTML=set.equipment.slotArray.map((slot)=>{if(slot.providesStats){return this.getTooltipRow(slot.item.media,slot.item.name);}
else{return '';}}).join('');let prayerHTML='';set.prayerSelection.forEach((prayer)=>{prayerHTML+=this.getTooltipRow(prayer.media,prayer.name);});let spellHTML='';if(set.spellSelection.standard!==undefined)
spellHTML+=this.getTooltipRow(set.spellSelection.standard.media,set.spellSelection.standard.name);if(set.spellSelection.ancient!==undefined)
spellHTML+=this.getTooltipRow(set.spellSelection.ancient.media,set.spellSelection.ancient.name);if(set.spellSelection.archaic!==undefined)
spellHTML+=this.getTooltipRow(set.spellSelection.archaic.media,set.spellSelection.archaic.name);if(set.spellSelection.curse!==undefined)
spellHTML+=this.getTooltipRow(set.spellSelection.curse.media,set.spellSelection.curse.name);if(set.spellSelection.aurora!==undefined)
spellHTML+=this.getTooltipRow(set.spellSelection.aurora.media,set.spellSelection.aurora.name);let mainHTML=`<div class="text-center">
    <span class="text-info">${getLangString('COMBAT_MISC','18')}</span><br>
    ${equipmentHTML.length>0?equipmentHTML:`${getLangString('MENU_TEXT','NONE')}<br>`}`;if(spellHTML.length>0){mainHTML+=`<span class="text-info">${getLangString('COMBAT_MISC','SPELLS')}</span><br>${spellHTML}`;}
if(prayerHTML.length>0){mainHTML+=`<span class="text-info">${getLangString('COMBAT_MISC','17')}</span><br>${prayerHTML}`;}
mainHTML+=`</div>`;return mainHTML;}
addButton(text){const newButton=createElement('button',{text:text,classList:[...this.buttonClasses,'btn-primary'],});newButton.style.pointerEvents='auto';const newTooltip=this.createTooltip(newButton);const button={button:newButton,tooltip:newTooltip,};this.buttons.push(button);this.container.append(newButton);return button;}
createTooltip(parent){return tippy(parent,{content:'',allowHTML:true,placement:'top',interactive:false,animation:false,});}}
const equipmentSlotData={Helmet:{id:0,allowQuantity:false,emptyMedia:'armour_helmet',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Platebody:{id:1,allowQuantity:false,emptyMedia:'armour_platebody',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Platelegs:{id:2,allowQuantity:false,emptyMedia:'armour_platelegs',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Boots:{id:3,allowQuantity:false,emptyMedia:'armour_boots',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Weapon:{id:4,allowQuantity:false,emptyMedia:'weapon_sword',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Shield:{id:5,allowQuantity:false,emptyMedia:'armour_shield',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Amulet:{id:6,allowQuantity:false,emptyMedia:'misc_amulet',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Ring:{id:7,allowQuantity:false,emptyMedia:'misc_ring',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Gloves:{id:8,allowQuantity:false,emptyMedia:'armour_gloves',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Quiver:{id:9,allowQuantity:true,emptyMedia:'weapon_quiver',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Cape:{id:10,allowQuantity:false,emptyMedia:'armour_cape',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Passive:{id:11,allowQuantity:false,emptyMedia:'passive_slot',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:false,},Summon1:{id:12,allowQuantity:true,emptyMedia:'misc_summon',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Summon2:{id:13,allowQuantity:true,emptyMedia:'misc_summon',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},Consumable:{id:14,allowQuantity:true,emptyMedia:'consumable',get emptyName(){return getLangString('EQUIP_SLOT',`${this.id}`);},imageElements:[],qtyElements:[],tooltips:[],quickEquipTooltip:[],providesStats:true,},};function getEquipmentImageElements(slotID){const elems=[];for(let i=0;i<3;i++){elems.push(document.getElementById(`combat-equipment-slot-${slotID}-${i}`));}
return elems;}
function getEquipmentQtyElements(slot){const elements=[];if(equipmentSlotData[slot].allowQuantity){for(let i=0;i<3;i++){elements.push(document.getElementById(`combat-player-${slot}-qty-${i}`));}}
return elements;}
class EquipSlot{constructor(type,emptyItem){this.type=type;this.emptyItem=emptyItem;this.occupiedBy='None';this.quantity=0;this.occupies=[];this.item=emptyItem;this.quickEquipItems=new Array(MAX_QUICK_EQUIP_ITEMS).fill(emptyItem);}
get isEmpty(){return this.item===this.emptyItem;}
get providesStats(){return!this.isEmpty&&this.occupiedBy==='None';}
isItem(item){if(typeof item!=='string')
return item===this.item;else{switch(item){case 'ThrowingWeapon':return(this.item instanceof WeaponItem&&(this.item.ammoTypeRequired===AmmoTypeID.Javelins||this.item.ammoTypeRequired===AmmoTypeID.ThrowingKnives));case 'Melee2HWeapon':return(this.item instanceof WeaponItem&&this.item.attackType==='melee'&&this.item.occupiesSlots.includes('Shield'));default:return false;}}}
setOccupied(item,slot){this.item=item;this.occupiedBy=slot;this.quantity=0;this.occupies=[];}
setEquipped(item,quantity,occupies){this.item=item;this.occupiedBy='None';this.quantity=quantity;this.occupies=occupies;}
setEmpty(){this.item=this.emptyItem;this.occupiedBy='None';this.quantity=0;this.occupies=[];}
trimQuickEquipItems(){if(this.quickEquipItems.length>MAX_QUICK_EQUIP_ITEMS){this.quickEquipItems.splice(MAX_QUICK_EQUIP_ITEMS-1);}
while(this.quickEquipItems.length<MAX_QUICK_EQUIP_ITEMS){this.quickEquipItems.push(this.emptyItem);}}}
class CombatQuickEquipMenu{constructor(player,game){this.player=player;this.game=game;}
deserialize(reader,version,idMap,player){const numEquipSets=reader.getNumber();for(let i=0;i<numEquipSets;i++){const setID=reader.getNumber();const numEquipSlots=reader.getNumber();const equipSet=player.equipmentSets[setID];for(let j=0;j<numEquipSlots;j++){const slotID=reader.getNumber();const numItems=reader.getNumber();const quickEquipItems=[];for(let k=0;k<numItems;k++){const itemID=reader.getNumber();if(itemID===-1)
quickEquipItems.push(this.game.emptyEquipmentItem);else{const item=this.game.items.equipment.getObjectByID(idMap.items[itemID]);if(item===undefined)
quickEquipItems.push(this.game.emptyEquipmentItem);else
quickEquipItems.push(item);}}
if(equipSet!==undefined){const slot=equipSet.equipment.slotArray[slotID];slot.quickEquipItems=quickEquipItems;slot.trimQuickEquipItems();}}}}
getTooltipContent(slotID){const content=createElement('div',{classList:['text-center','font-size-xs'],text:getLangString('MENU_TEXT','QUICK_EQUIP'),});const list=createElement('ul',{classList:['nav-main','nav-main-horizontal','nav-main-horizontal-override','font-w400','font-size-sm'],});const equipSlot=this.player.equipment.slotArray[slotID];equipSlot.quickEquipItems.forEach((item,pos)=>{const equipImg=createElement('img',{classList:['skill-icon-xs'],id:`combat-quick-equip-${pos}`,});equipImg.src=item.media;const equipBtn=createElement('button',{classList:['btn','btn-sm']});if(!equipSlot.isEmpty&&item===equipSlot.item)
equipBtn.classList.add('btn-outline-success');else
equipBtn.classList.add('btn-outline-secondary');equipBtn.appendChild(equipImg);const setBtn=createElement('button',{classList:['btn','btn-sm','btn-outline-warning','font-size-xs'],text:getLangString('MENU_TEXT','SET'),});if(item!==this.game.emptyEquipmentItem){equipBtn.onclick=()=>{const slotType=Object.keys(equipmentSlotData)[slotID];const qty=equipmentSlotData[slotType].allowQuantity?this.game.bank.getQty(item)-1:1;const itemsInSavedSlot=equipSlot.quickEquipItems;if(qty>=1)
this.player.equipItem(itemsInSavedSlot[pos],this.player.selectedEquipmentSet,slotType,qty);};}
setBtn.onclick=()=>this.setItem(slotID,pos);const btnGroup=createElement('div',{classList:['btn-group-vertical','m-1']});btnGroup.appendChild(equipBtn);btnGroup.appendChild(setBtn);list.appendChild(createElement('li').appendChild(btnGroup));});const btnGroup=createElement('div',{classList:['btn-group-vertical','m-1']});const unequipBtn=createElement('button',{classList:['btn','btn-sm','btn-outline-danger'],text:'X',});btnGroup.appendChild(unequipBtn);unequipBtn.onclick=this.player.unequipCallback(Object.keys(equipmentSlotData)[slotID]);list.appendChild(btnGroup);content.append(list);return content;}
setItem(slotID,pos){const slot=this.player.equipment.slotArray[slotID];if(!slot.item.validSlots.includes(slot.type)){game.combat.notifications.add({type:'Player',args:[this.game.attack,'This item does not go in this Slot.','danger'],});return;}
if(!slot.isEmpty){slot.quickEquipItems[pos]=slot.item;this.setImage(pos,slot.item);}
else
game.combat.notifications.add({type:'Player',args:[this.game.attack,'No item equipped to set.','danger'],});}
setImage(pos,item){const element=document.getElementById(`combat-quick-equip-${pos}`);element.src=item.media;}}