"use strict";class ItemUpgrade{constructor(data,game){this.itemCosts=game.items.getQuantities(data.itemCosts);this.gpCost=data.gpCost;this.scCost=data.scCost;this.rootItems=data.rootItemIDs.map((itemID)=>{const item=game.items.getObjectByID(itemID);if(item===undefined)
throw new UnregisteredConstructionError(this,Item.name,itemID);if(!this.itemCosts.some((cost)=>{return item===cost.item;}))
throw new Error(`Error constructing item upgrade, ${item.id} is set as root item, but is not a cost`);return item;});const upgradedItem=game.items.getObjectByID(data.upgradedItemID);if(upgradedItem===undefined)
throw new UnregisteredConstructionError(this,Item.name,data.upgradedItemID);this.upgradedItem=upgradedItem;this.isDowngrade=data.isDowngrade;}}
class BankRenderQueue{constructor(){this.items=new Set();this.tabIcons=new Set();this.bankSearch=false;this.bankValue=false;this.space=false;}}
class Bank{constructor(game,maxTabs=12,baseSlots=12){this.game=game;this.maxTabs=maxTabs;this.baseSlots=baseSlots;this.renderQueue=new BankRenderQueue();this.lockedItems=new Set();this.lostItems=new Map();this.newItemsAdded=false;this.items=new Map();this.itemsByTab=[];this.defaultItemTabs=new Map();this.customSortOrder=[];this.glowingItems=new Set();this.tabIcons=new Map();this.itemSelectionMode=0;this.selectedItems=new Set();this.selectedBankItem=undefined;this.itemUpgrades=new Map();this.selectedBankTab=0;this.nextOpenedItems=new Map();this.searchArray=[];this.currentSearchQuery='';this.eightDelay=false;this.postLoadItems=new Map();for(let i=0;i<maxTabs;i++){this.itemsByTab.push([]);}
this.defaultSortOrder=new NamespacedArray(this.game.items);}
get slotsSelected(){return this.selectedItems.size;}
get itemCountSelected(){let count=0;this.selectedItems.forEach((bankItem)=>{count+=bankItem.quantity;});return count;}
get selectedItemValue(){let totalValue=0;this.selectedItems.forEach((bankItem)=>{totalValue+=bankItem.stackValue;});return totalValue;}
get unlockedItemArray(){return this.filterItems((bankItem)=>!bankItem.locked);}
registerSortOrder(order){this.defaultSortOrder.registerData(order);}
encode(writer){writer.writeSet(this.lockedItems,writeNamespaced);writer.writeArray(this.itemsByTab,(bankItems,writer)=>{writer.writeArray(bankItems,(bankItem,writer)=>{writer.writeNamespacedObject(bankItem.item);writer.writeUint32(bankItem.quantity);});});writer.writeMap(this.defaultItemTabs,writeNamespaced,(tabID,writer)=>writer.writeUint8(tabID));writer.writeArray(this.customSortOrder,writeNamespaced);writer.writeSet(this.glowingItems,writeNamespaced);writer.writeMap(this.tabIcons,(tabID)=>writer.writeUint8(tabID),writeNamespaced);return writer;}
decode(reader,version){const getItem=(reader)=>{const item=reader.getNamespacedObject(this.game.items);if(typeof item==='string'){if(item.startsWith('melvor'))
return this.game.items.getDummyObject(item,DummyItem,this.game);else
return undefined;}
return item;};this.lockedItems=reader.getSet(getItem);this.itemsByTab=reader.getArray((reader)=>{return reader.getArray((reader)=>{const item=getItem(reader);const quantity=reader.getUint32();if(item===undefined)
return undefined;return new BankItem(this,item,quantity,0,0);});});this.defaultItemTabs=reader.getMap(getItem,(reader)=>reader.getUint8());this.customSortOrder=reader.getArray(getItem);this.glowingItems=reader.getSet(getItem);this.tabIcons=reader.getMap((reader)=>reader.getUint8(),readNamespacedReject(this.game.items));this.itemsByTab.forEach((bankItems,tabID)=>{bankItems.forEach((bankItem,tabPosition)=>{bankItem.tab=tabID;bankItem.tabPosition=tabPosition;this.items.set(bankItem.item,bankItem);});});}
convertFromOldFormat(save,idMap){var _a,_b;const getItem=(oldID)=>{const newID=idMap.items[oldID];let item=this.game.items.getObjectByID(newID);if(newID===undefined)
return undefined;if(item===undefined)
item=this.game.items.getDummyObject(newID,DummyItem,this.game);return item;};if(save.itemsAlreadyFound!==undefined){save.itemsAlreadyFound.forEach((itemID)=>{const item=getItem(itemID);if(item!==undefined)
this.glowingItems.add(item);});}
if(save.lockedItems!==undefined){save.lockedItems.forEach((itemID)=>{const item=getItem(itemID);if(item!==undefined)
this.lockedItems.add(item);});}
if(save.bank!==undefined){save.bank.forEach((oldBankItem)=>{const item=getItem(oldBankItem.id);if(item===undefined)
return;const tabID=clampValue(oldBankItem.tab,0,this.maxTabs-1);const bankItem=new BankItem(this,item,oldBankItem.qty,tabID,0);this.itemsByTab[tabID].push(bankItem);this.items.set(item,bankItem);});}
if(save.bankTabIcons!==undefined){save.bankTabIcons.forEach((itemID,tabID)=>{if(tabID>=0&&tabID<this.maxTabs&&itemID!==-1){const item=this.game.items.getObjectByID(idMap.items[itemID]);if(item!==undefined)
this.tabIcons.set(tabID,item);}});}
if(((_b=(_a=save.SETTINGS)===null||_a===void 0?void 0:_a.bank)===null||_b===void 0?void 0:_b.defaultItemTab)!==undefined){save.SETTINGS.bank.defaultItemTab.forEach(({itemID,tab})=>{const item=getItem(itemID);const tabID=clampValue(tab,0,this.maxTabs-1);if(item!==undefined)
this.defaultItemTabs.set(item,tabID);});}
this.itemsByTab.forEach((tabItems)=>{tabItems.forEach((bankItem,tabPosition)=>(bankItem.tabPosition=tabPosition));});}
addDummyItemOnLoad(itemID,quantity){var _a;const item=this.game.items.getDummyObject(itemID,DummyItem,this.game);this.postLoadItems.set(item,((_a=this.postLoadItems.get(item))!==null&&_a!==void 0?_a:0)+quantity);}
onLoad(){this.postLoadItems.forEach((quantity,item)=>{this.addItem(item,quantity,false,false,true);});if(this.game.settings.bankSortOrder===5&&this.customSortOrder.length===0)
this.storeCustomSortOrder();bankTabMenu.loadAllItems(this);for(let i=0;i<this.maxTabs;i++){this.renderQueue.tabIcons.add(i);}
this.renderQueue.space=true;this.renderQueue.bankValue=true;this.updateSearchArray();}
renderModifierChange(){this.onModifierChange();}
onModifierChange(){this.renderQueue.bankValue=true;this.renderQueue.space=true;}
onEquipmentChange(){if(this.selectedBankItem!==undefined&&this.selectedBankItem.item instanceof EquipmentItem){bankSideBarMenu.updateEquipItem(this.selectedBankItem.item,this.game);}}
isItemInPosition(item,tab,tabPosition){const bankItem=this.itemsByTab[tab][tabPosition];return(bankItem===null||bankItem===void 0?void 0:bankItem.item)===item;}
registerItemUpgrades(data){data.forEach((datum)=>{const upgrade=new ItemUpgrade(datum,this.game);upgrade.rootItems.forEach((item)=>{let upgradeArray=this.itemUpgrades.get(item);if(upgradeArray===undefined){upgradeArray=[];this.itemUpgrades.set(item,upgradeArray);}
upgradeArray.push(upgrade);});});}
isItemSelected(item){var _a;return((_a=this.selectedBankItem)===null||_a===void 0?void 0:_a.item)===item;}
hasItem(item){return this.items.has(item);}
hasUnlockedItem(item){return this.hasItem(item)&&!this.lockedItems.has(item);}
getTabMedia(tabID){const customItem=this.tabIcons.get(tabID);if(customItem!==undefined)
return customItem.media;const firstItemInTab=this.itemsByTab[tabID][0];if(firstItemInTab===undefined)
return cdnMedia("assets/media/skills/combat/food_empty.svg");return firstItemInTab.item.media;}
render(){if(this.renderQueue.items.size>0){let renderRunes=false;if(this.newItemsAdded){this.newItemsAdded=false;}
this.renderQueue.items.forEach((item)=>{var _a,_b,_c;const existingIcon=bankTabMenu.itemIcons.get(item);const bankItem=this.items.get(item);renderRunes||(renderRunes=item.type==='Rune');if(existingIcon!==undefined&&bankItem!==undefined){existingIcon.updateQuantity(bankItem,this.game.settings.enableAccessibility);if(((_a=this.selectedBankItem)===null||_a===void 0?void 0:_a.item)===item){bankSideBarMenu.updateItemQuantity(bankItem);}}
else if(existingIcon===undefined&&bankItem!==undefined){bankTabMenu.addItemToEndofTab(this,bankItem);}
else if(existingIcon!==undefined&&bankItem===undefined){bankTabMenu.removeItemFromTab(item);if(((_b=this.selectedBankItem)===null||_b===void 0?void 0:_b.item)===item){this.deselectBankItem();}}
if(item===spendMasteryMenu.currentToken){spendMasteryMenu.updateTokenQuantity((_c=bankItem===null||bankItem===void 0?void 0:bankItem.quantity)!==null&&_c!==void 0?_c:0);}});this.renderQueue.bankValue=true;this.renderQueue.space=true;if(renderRunes)
combatMenus.runes.updateCounts();this.renderQueue.items.clear();}
if(this.renderQueue.bankSearch){this.updateSearchArray();if(this.currentSearchQuery!=='')
this.onBankSearchChange(this.currentSearchQuery);this.renderQueue.bankSearch=false;}
if(this.renderQueue.tabIcons.size>0){this.renderQueue.tabIcons.forEach((tabID)=>{bankTabMenu.setTabImage(tabID,this.getTabMedia(tabID));});this.renderQueue.tabIcons.clear();}
if(this.renderQueue.bankValue){bankTabMenu.updateBankValue(this);this.renderQueue.bankValue=false;}
if(this.renderQueue.space){document.querySelectorAll('.bank-space-nav').forEach((element)=>this.updateSpaceElement(element));bankTabMenu.updateBankSpace(this);this.renderQueue.space=false;}}
updateSpaceElement(element){element.textContent=`${this.occupiedSlots} / ${this.maximumSlots}`;if(this.occupiedSlots>=this.maximumSlots){element.classList.add('text-danger');}
else{element.classList.remove('text-danger');}}
queueQuantityUpdates(item){var _a,_b;if(((_b=(_a=this.game.openPage)===null||_a===void 0?void 0:_a.action)===null||_b===void 0?void 0:_b.queueBankQuantityRender)!==undefined)
this.game.openPage.action.queueBankQuantityRender(item);this.game.shop.renderQueue.costs=true;this.game.summoning.renderQueue.synergyQuantities=true;}
getItemDefaultTab(item){var _a;return(_a=this.defaultItemTabs.get(item))!==null&&_a!==void 0?_a:0;}
getItemSalePrice(item,quantity=1){let salePrice=item.sellsFor*quantity;let priceModifier=this.game.modifiers.increasedGPFromSales-this.game.modifiers.decreasedGPFromSales;if(item.type==='Logs'&&this.game.woodcutting.isPoolTierActive(2))
priceModifier+=50;salePrice*=1+priceModifier/100;return Math.max(Math.floor(salePrice),0);}
getTabValue(tabID){return this.itemsByTab[tabID].reduce((totalValue,bankItem)=>{return totalValue+bankItem.stackValue;},0);}
getBankValue(){return this.itemsByTab.reduce((totalValue,_,tabID)=>{return totalValue+this.getTabValue(tabID);},0);}
getSnapShot(){const snapShot=new Map();this.items.forEach(({quantity},item)=>{snapShot.set(item,quantity);});return snapShot;}
getHistory(){const history=[];this.itemsByTab.forEach((tabArray)=>{tabArray.forEach(({item,quantity})=>{history.push({item,quantity,});});});return history;}
addQuantityToExistingItems(quantity){if(quantity<=0)
return;this.itemsByTab.forEach((tabArray)=>{tabArray.forEach((bankItem)=>{this.addItem(bankItem.item,quantity,false,false,false,false);});});}
empty(){for(let i=0;i<this.maxTabs;i++){this.itemsByTab.push([]);}
this.items.clear();}
moveItemInTab(tabID,oldTabPosition,newTabPosition){const tab=this.itemsByTab[tabID];const item=tab.splice(oldTabPosition,1);tab.splice(newTabPosition,0,...item);const lowestPosition=Math.min(oldTabPosition,newTabPosition);this.reassignBankItemPositions(tabID,lowestPosition);if(oldTabPosition===0||newTabPosition===0)
this.renderQueue.tabIcons.add(tabID);if(tabID===0)
this.checkForClueChasers();this.storeCustomSortOrder();}
moveItemToNewTab(oldTabID,newTabID,oldTabPosition){const oldTab=this.itemsByTab[oldTabID];const item=oldTab.splice(oldTabPosition,1);this.reassignBankItemPositions(oldTabID,oldTabPosition);const newTab=this.itemsByTab[newTabID];item[0].tab=newTabID;item[0].tabPosition=newTab.length;if(newTab.length===0)
this.renderQueue.tabIcons.add(newTabID);if(oldTabPosition===0)
this.renderQueue.tabIcons.add(oldTabID);newTab.push(...item);this.defaultItemTabs.set(item[0].item,newTabID);this.storeCustomSortOrder();this.renderQueue.bankValue=true;}
checkForClueChasers(){const clueChasers=this.game.items.getObjectByID("melvorD:Clue_Chasers_Insignia");if(clueChasers===undefined||this.hasItem(clueChasers))
return;const condition=["melvorD:Maple_Logs","melvorD:Redwood_Logs","melvorD:Raw_Swordfish","melvorD:Raw_Crab","melvorD:Herring","melvorD:Burnt_Cave_Fish",];if(condition.every((id,i)=>{const bankItem=this.itemsByTab[0][i];return bankItem!==undefined&&bankItem.item.id===id;})){this.addItem(clueChasers,1,false,true);}}
get maximumSlots(){return(this.baseSlots+
this.game.modifiers.increasedBankSpace-
this.game.modifiers.decreasedBankSpace+
this.game.modifiers.increasedBankSpaceShop-
this.game.modifiers.decreasedBankSpaceShop);}
get occupiedSlots(){return this.items.size;}
addItemByID(itemID,quantity,logLost,found,ignoreSpace=false){const item=this.game.items.getObjectByID(itemID);if(item===undefined)
throw new Error(`Error adding item to bank by id. Item with id: ${itemID} is not registered.`);this.addItem(item,quantity,logLost,found,ignoreSpace);}
addItem(item,quantity,logLost,found,ignoreSpace=false,notify=true){var _a;if(quantity<=0)
throw new Error(`Tried to add negative or zero quantity to bank.`);let success=false;let bankItem=this.items.get(item);if(bankItem!==undefined){bankItem.quantity+=quantity;success=true;}
else if(this.occupiedSlots<this.maximumSlots||ignoreSpace){const tab=this.getItemDefaultTab(item);bankItem=new BankItem(this,item,quantity,tab,this.itemsByTab[tab].length);this.items.set(item,bankItem);this.itemsByTab[tab].push(bankItem);if(this.game.settings.bankSortOrder===5&&!this.customSortOrder.includes(item))
this.storeCustomSortOrder();success=true;this.renderQueue.bankSearch=true;this.newItemsAdded=true;if(bankItem.tabPosition===0)
this.renderQueue.tabIcons.add(tab);}
if(success){if(found){const newItem=this.game.stats.itemFindCount(item)===0;this.game.stats.Items.add(item,ItemStats.TimesFound,quantity);if(newItem){this.game.completion.updateItem(item);this.glowingItems.add(item);if(item instanceof EquipmentItem)
this.game.minibar.addItemOnDiscovery(item);}}
this.renderQueue.items.add(item);this.queueQuantityUpdates(item);if(notify)
this.game.combat.notifications.add({type:'Item',args:[item,quantity],});this.game.combat.player.updateConditionals('BankItem',true,true);}
else{if(notify)
this.game.combat.notifications.add({type:'BankFull',args:[],});if(logLost){this.lostItems.set(item,((_a=this.lostItems.get(item))!==null&&_a!==void 0?_a:0)+quantity);}}
return success;}
removeItemQuantity(item,quantity,removeItemCharges){if(quantity<=0)
throw new Error(`Tried to remove negative or zero quantity from bank.`);const bankItem=this.items.get(item);if(bankItem===undefined)
throw new Error(`Tried to remove quantity from bank, but item is not in bank.`);bankItem.quantity-=quantity;if(bankItem.quantity<=0){this.items.delete(item);const bankTab=this.itemsByTab[bankItem.tab];bankTab.splice(bankItem.tabPosition,1);this.reassignBankItemPositions(bankItem.tab,bankItem.tabPosition);if(removeItemCharges&&item instanceof EquipmentItem){this.game.itemCharges.removeAllCharges(item);}
this.renderQueue.bankSearch=true;if(bankItem.tabPosition===0)
this.renderQueue.tabIcons.add(bankItem.tab);}
this.renderQueue.items.add(item);this.queueQuantityUpdates(item);this.game.combat.player.updateConditionals('BankItem',true,true);}
removeItemQuantityByID(itemID,quantity,removeItemCharges){const item=this.game.items.getObjectByID(itemID);if(item===undefined)
throw new Error(`Error removing item from bank by id. Item with id: ${itemID} is not registered.`);this.removeItemQuantity(item,quantity,removeItemCharges);}
getQty(item){var _a,_b;return(_b=(_a=this.items.get(item))===null||_a===void 0?void 0:_a.quantity)!==null&&_b!==void 0?_b:0;}
filterItems(predicate){const filtered=[];this.items.forEach((bankItem)=>{if(predicate(bankItem))
filtered.push(bankItem.item);});return filtered;}
checkForItems(costs){return costs.every((cost)=>{return this.getQty(cost.item)>=cost.quantity;});}
consumeItems(costs){costs.forEach((cost)=>{this.removeItemQuantity(cost.item,cost.quantity,true);});}
willItemsFit(items){const newItems=new Set();return items.every(({item})=>{if(this.hasItem(item))
return true;newItems.add(item);return this.occupiedSlots+newItems.size<=this.maximumSlots;});}
moveItemModeOnClick(){if(this.itemSelectionMode===1)
this.setItemSelectionMode(0);else
this.setItemSelectionMode(1);}
sellItemModeOnClick(){if(this.itemSelectionMode===2)
this.setItemSelectionMode(0);else
this.setItemSelectionMode(2);}
selectItemOnClick(item){const bankItem=this.items.get(item);if(bankItem===undefined){console.warn('Tried to select item in bank, but it does not exist');return;}
switch(this.itemSelectionMode){case 0:this.toggleItemForSelection(bankItem);break;case 1:this.toggleItemForMoving(bankItem);break;case 2:this.toggleItemForSelling(bankItem);break;}}
onItemDoubleClick(item){const bankItem=this.items.get(item);if(bankItem===undefined||this.itemSelectionMode!==0)
return;if(this.game.settings.defaultToCurrentEquipSet&&item instanceof EquipmentItem&&item.validSlots[0]!=='Summon1'){this.game.combat.player.equipCallback(item,item.validSlots[0],Infinity);}
else if(item instanceof OpenableItem&&!bankItem.locked){this.openItemOnClick(item,Infinity);}
else if(item instanceof BoneItem&&!bankItem.locked){this.buryItemOnClick(item,Infinity);}}
toggleItemLock(bankItem){if(this.lockedItems.has(bankItem.item)){this.lockedItems.delete(bankItem.item);}
else{this.lockedItems.add(bankItem.item);}
bankTabMenu.updateItemLockBorder(bankItem,this.game.settings.useDefaultBankBorders);if(bankItem===this.selectedBankItem){bankSideBarMenu.setItemLocked(bankItem.locked);}}
reassignBankItemPositions(tabID,startingPosition){const tab=this.itemsByTab[tabID];for(let tabPosition=startingPosition;tabPosition<tab.length;tabPosition++){tab[tabPosition].tabPosition=tabPosition;}}
toggleItemSelected(bankItem){if(this.selectedItems.has(bankItem)){this.selectedItems.delete(bankItem);bankTabMenu.setItemUnselected(bankItem.item,this.itemSelectionMode);}
else{this.selectedItems.add(bankItem);bankTabMenu.setItemSelected(bankItem.item,this.itemSelectionMode);}}
deselectBankItem(){if(this.selectedBankItem===undefined)
return;bankTabMenu.setItemUnselected(this.selectedBankItem.item,this.itemSelectionMode);this.selectedBankItem=undefined;if(checkMediaQuery('(max-width: 991px)'))
closeBankSidebar();bankSideBarMenu.setUnselected();}
toggleItemForSelection(bankItem){if(this.selectedBankItem===bankItem){this.deselectBankItem();}
else{if(this.selectedBankItem!==undefined)
bankTabMenu.setItemUnselected(this.selectedBankItem.item,this.itemSelectionMode);if(this.game.settings.defaultToCurrentEquipSet)
this.game.combat.player.changeEquipToSet(this.game.combat.player.selectedEquipmentSet);this.selectedBankItem=bankItem;if(checkMediaQuery('(max-width: 991px)'))
openBankSidebar();bankSideBarMenu.setItem(bankItem,this.game);bankTabMenu.setItemSelected(bankItem.item,this.itemSelectionMode);if(bankItem.isGlowing){this.glowingItems.delete(bankItem.item);bankTabMenu.updateItemGlow(bankItem);}}}
toggleItemForMoving(bankItem){this.toggleItemSelected(bankItem);bankMoveModeMenu.updateSelectionCount(this);}
toggleItemForSelling(bankItem){if(this.lockedItems.has(bankItem.item))
return;this.toggleItemSelected(bankItem);bankSellModeMenu.updateSelectionValues(this);}
setItemSelectionMode(selectionMode){if(selectionMode===this.itemSelectionMode)
return;this.disableItemSelectionMode();this.itemSelectionMode=selectionMode;switch(selectionMode){case 1:if(this.selectedBankItem!==undefined)
this.deselectBankItem();showElement(bankMoveModeMenu);bankMoveModeMenu.updateSelectionCount(this);break;case 2:if(this.selectedBankItem!==undefined)
this.deselectBankItem();showElement(bankSellModeMenu);bankSellModeMenu.updateSelectionValues(this);break;}}
disableItemSelectionMode(){if(this.itemSelectionMode===0)
return;bankTabMenu.setItemsUnselected(this.selectedItems,this.itemSelectionMode);this.selectedItems.clear();switch(this.itemSelectionMode){case 1:hideElement(bankMoveModeMenu);break;case 2:hideElement(bankSellModeMenu);break;}}
moveSelectedItemsToTab(newTabID){if(this.itemSelectionMode!==1)
return;const selectedItemsByTab=new Map();this.selectedItems.forEach((bankItem)=>{if(bankItem.tab===newTabID)
return;let tabArray=selectedItemsByTab.get(bankItem.tab);if(tabArray===undefined){tabArray=[];selectedItemsByTab.set(bankItem.tab,tabArray);}
tabArray.push(bankItem);});const tabToAddTo=this.itemsByTab[newTabID];const bankItemsMoved=[];selectedItemsByTab.forEach((tabArray,tabID)=>{const tabToRemoveFrom=this.itemsByTab[tabID];tabArray.sort((a,b)=>a.tabPosition-b.tabPosition);const lowestTabPosition=tabArray[0].tabPosition;let itemsRemoved=0;tabArray.forEach((bankItem)=>{const removedItems=tabToRemoveFrom.splice(bankItem.tabPosition-itemsRemoved,1);removedItems[0].tab=newTabID;removedItems[0].tabPosition=tabToAddTo.length;if(tabToAddTo.length===0)
this.renderQueue.tabIcons.add(newTabID);tabToAddTo.push(...removedItems);bankItemsMoved.push(...removedItems);itemsRemoved++;});this.reassignBankItemPositions(tabID,lowestTabPosition);if(lowestTabPosition===0)
this.renderQueue.tabIcons.add(tabID);});bankTabMenu.moveIconsToNewTab(bankItemsMoved,newTabID);bankItemsMoved.forEach(({item})=>this.defaultItemTabs.set(item,newTabID));this.storeCustomSortOrder();this.setItemSelectionMode(0);this.renderQueue.bankValue=true;}
sellAllSelectedItems(){if(this.itemSelectionMode!==2)
return;let itemCount=0;let totalGP=0;this.selectedItems.forEach((bankItem)=>{if(!bankItem.locked){itemCount++;totalGP+=this.getItemSalePrice(bankItem.item,bankItem.quantity);}});this.fireBulkItemSaleConfirmation(totalGP,itemCount,()=>{this.processSellSelectedItems();this.setItemSelectionMode(0);});}
processSellSelectedItems(){this.selectedItems.forEach((bankItem)=>{this.processItemSale(bankItem.item,bankItem.quantity);});}
sellUnlockedItemsOnClick(){const tab=this.itemsByTab[this.selectedBankTab];let itemCount=0;let totalGP=0;tab.forEach((bankItem)=>{if(!bankItem.locked){itemCount++;totalGP+=this.getItemSalePrice(bankItem.item,bankItem.quantity);}});this.fireBulkItemSaleConfirmation(totalGP,itemCount,()=>this.processSelectedTabSale());}
processSelectedTabSale(){const itemsToSell=[];this.itemsByTab[this.selectedBankTab].forEach((bankItem)=>{if(!bankItem.locked)
itemsToSell.push(bankItem);});itemsToSell.forEach((bankItem)=>{this.processItemSale(bankItem.item,bankItem.quantity);});}
setLockOfSelectedTab(locked){this.itemsByTab[this.selectedBankTab].forEach((bankItem)=>{if(bankItem.locked!==locked)
this.toggleItemLock(bankItem);});}
setLockOfAllItemsOnClick(locked){SwalLocale.fire({title:getLangString('BANK_STRING','52'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-2">${getLangString('BANK_STRING',locked?'51':'50')}</h5><h5 class="font-w600 text-danger font-size-sm mb-1">${getLangString('MENU_TEXT','CANNOT_UNDO')}</h5>`,showCancelButton:true,icon:'warning',}).then((result)=>{if(result.value){this.setLockOfAllItems(locked);}});}
setLockOfAllItems(locked){this.items.forEach((bankItem)=>{if(bankItem.locked!==locked)
this.toggleItemLock(bankItem);});}
fireBulkItemSaleConfirmation(totalGP,count,onConfirm){SwalLocale.fire({title:templateString(getLangString('MENU_TEXT','SELL_NUM_ITEMS'),{num:`${numberWithCommas(count)}`}),html:`<span class="text-dark"><img class="skill-icon-xxs mr-1" src="${cdnMedia("assets/media/main/coins.svg")}"><span id="bank-sell-item-summary-gp">${numberWithCommas(totalGP)} ${getLangString('MENU_TEXT','GP')}</span>`,imageUrl:cdnMedia("assets/media/main/coins.svg"),imageWidth:64,imageHeight:64,imageAlt:`${numberWithCommas(totalGP)} ${getLangString('MENU_TEXT','GP')}`,showCancelButton:true,confirmButtonText:getLangString('BANK_STRING','22'),}).then((result)=>{if(result.value){onConfirm();}});}
sortButtonOnClick(){let sortFunction;switch(this.game.settings.bankSortOrder){case 0:sortFunction=sortByOrder(this.defaultSortOrder,'item');break;case 1:sortFunction=(a,b)=>b.itemSellValue-a.itemSellValue;break;case 2:sortFunction=(a,b)=>a.itemSellValue-b.itemSellValue;break;case 3:sortFunction=(a,b)=>b.stackValue-a.stackValue;break;case 4:sortFunction=(a,b)=>a.stackValue-b.stackValue;break;case 5:sortFunction=sortByOrder(this.customSortOrder,'item');break;default:throw new Error(`Error sorting bank, sort order setting: ${this.game.settings.bankSortOrder} is invalid.`);}
this.itemsByTab.forEach((tab,tabID)=>{const tabOrder=tab.sort(sortFunction).map((bankItem)=>bankItem.item.id);this.reassignBankItemPositions(tabID,0);bankTabMenu.sortTabByOrder(tabID,tabOrder);this.renderQueue.tabIcons.add(tabID);});bankTabMenu.validateItemOrder();}
storeCustomSortOrder(){if(this.game.settings.bankSortOrder!==5)
return;this.customSortOrder=[];this.itemsByTab.forEach((tabArray)=>{tabArray.forEach((bankItem)=>this.customSortOrder.push(bankItem.item));});this.defaultSortOrder.forEach((item)=>{if(!this.items.has(item))
this.customSortOrder.push(item);});}
processItemSale(item,quantity){const bankItem=this.items.get(item);if(bankItem===undefined)
return;quantity=Math.min(bankItem.quantity,quantity);const salePrice=this.getItemSalePrice(item,quantity);this.game.gp.add(salePrice);this.game.stats.General.add(GeneralStats.TotalItemsSold,quantity);this.game.stats.Items.add(item,ItemStats.TimesSold,quantity);this.game.stats.Items.add(item,ItemStats.GpFromSale,salePrice);this.removeItemQuantity(item,quantity,true);}
sellItemOnClick(item,quantity){const bankItem=this.items.get(item);if(bankItem===undefined)
return;if(!this.game.tutorial.complete&&this.game.tutorial.bannedItemSales.has(item)){SwalLocale.fire({title:getLangString('MENU_TEXT','ITEM_SALE_LOCKED'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${item.media}"> ${getLangString('MENU_TEXT','ITEM_NEEDED_TUTORIAL')}</h5>`,icon:'warning',});return;}
quantity=Math.min(bankItem.quantity,quantity);const salePrice=this.getItemSalePrice(item,quantity);if(this.game.settings.showSaleConfirmations){SwalLocale.fire({title:getLangString('BANK_STRING','23'),html:`<span class='text-dark'>
        ${numberWithCommas(quantity)} x ${item.name}<br>
        <img class='skill-icon-xs mr-2' src='${cdnMedia("assets/media/main/coins.svg")}'>${numberWithCommas(salePrice)}
        </span>`,imageUrl:item.media,imageWidth:64,imageHeight:64,imageAlt:item.name,showCancelButton:true,confirmButtonText:getLangString('BANK_STRING','22'),}).then((result)=>{if(result.value){this.processItemSale(item,quantity);}});}
else{this.processItemSale(item,quantity);}}
buryItemOnClick(item,quantity){if(!this.game.prayer.isUnlocked){lockedSkillAlert(this.game.prayer,'SKILL_UNLOCK_BURY');return;}
const bankItem=this.items.get(item);if(bankItem===undefined)
return;quantity=Math.min(bankItem.quantity,quantity);this.removeItemQuantity(item,quantity,true);this.game.stats.Prayer.add(PrayerStats.BonesBuried,quantity);this.game.stats.Items.add(item,ItemStats.TimesBuried,quantity);this.game.combat.player.addPrayerPoints(item.prayerPoints*quantity);this.game.combat.player.render();notifyPlayer(this.game.prayer,templateLangString('MENU_TEXT','PRAYER_POINTS',{num:`+${numberWithCommas(item.prayerPoints*quantity)}`,}),'success');}
openItemOnClick(item,quantity){const bankItem=this.items.get(item);if(bankItem===undefined)
return;if(item.keyItem!==undefined&&this.getQty(item.keyItem.item)<item.keyItem.quantity)
return;quantity=Math.min(bankItem.quantity,quantity);let interval=500;if(item.id==="melvorD:Chest_of_Witwix"&&this.game.characterName==='witwix')
interval=5000;SwalLocale.fire({html:`<span id="item-open-contents" class="text-dark"><p>${templateLangString('BANK_STRING','41',{itemName:item.name,qty:numberWithCommas(quantity),})}</p><div class="skill-icon-md spinner-border spinner-border-sm text-danger" role="status"></span>`,imageUrl:item.media,imageWidth:64,imageHeight:64,imageAlt:item.name,});window.setTimeout(()=>{this.processItemOpen(item,quantity);},interval);}
processItemOpen(item,quantity){const bankItem=this.items.get(item);if(bankItem===undefined)
return;quantity=Math.min(bankItem.quantity,quantity);if(item.keyItem!==undefined&&item.keyItem.quantity>0){const maxQuantity=Math.floor(this.getQty(item.keyItem.item)/item.keyItem.quantity);quantity=Math.min(quantity,maxQuantity);}
const itemsToAdd=new Map();let bankSlotsOccupied=0;let itemsOpened=0;while(itemsOpened<quantity){let nextItem;if(item.id==="melvorD:Chest_of_Witwix"&&this.game.characterName==='witwix'){const item=this.game.items.getObjectByID("melvorD:Amulet_of_Calculated_Promotion");if(item===undefined)
throw new Error(`Error, item not registered.`);nextItem={item,quantity:1,};}
else{const prevNextItem=this.nextOpenedItems.get(item);if(prevNextItem===undefined){nextItem=item.dropTable.getDrop();}
else{nextItem=prevNextItem;this.nextOpenedItems.delete(item);}}
const currentAdded=itemsToAdd.get(nextItem.item);if(currentAdded===undefined){if(this.hasItem(nextItem.item)){itemsToAdd.set(nextItem.item,nextItem.quantity);itemsOpened++;}
else if(this.occupiedSlots+bankSlotsOccupied<this.maximumSlots){bankSlotsOccupied++;itemsToAdd.set(nextItem.item,nextItem.quantity);itemsOpened++;}
else{bankFullNotify();this.nextOpenedItems.set(item,nextItem);break;}}
else{itemsToAdd.set(nextItem.item,currentAdded+nextItem.quantity);itemsOpened++;}}
this.removeItemQuantity(item,itemsOpened,true);if(item.keyItem!==undefined&&item.keyItem.quantity>0){this.removeItemQuantity(item.keyItem.item,itemsOpened*item.keyItem.quantity,true);}
this.game.stats.Items.add(item,ItemStats.TimesOpened,itemsOpened);itemsToAdd.forEach((quantity,item)=>{this.addItem(item,quantity,false,true);});$('#item-open-contents').html(`<span class='text-dark'>
      <p>
      ${getLangString('MENU_TEXT','YOU_OPENED')}<br>
      <small class='text-info'>${itemsOpened} ${item.name}</small>
      </p>
      ${getLangString('MENU_TEXT','YOU_FOUND')}
      </span><br>`);const addedArray=[...itemsToAdd];let count=0;const itemInterval=setInterval(()=>{if(count<addedArray.length){$('#item-open-contents').append(`<small class="js-animation-object animated fadeInLeft text-dark">${numberWithCommas(addedArray[count][1])} <img class="skill-icon-xs mr-2" src="${addedArray[count][0].media}">${addedArray[count][0].name}<br></small>`);count++;}
else{clearInterval(itemInterval);}},200);}
readItemOnClick(item){item.showContents();switch(item.id){case "melvorD:Message_In_A_Bottle":this.game.fishing.unlockSecretArea();break;case "melvorF:Merchants_Permit":if(!this.game.merchantsPermitRead){this.game.merchantsPermitRead=true;this.game.shop.renderQueue.costs=true;}
break;}}
claimItemOnClick(item,quantity){const bankItem=this.items.get(item);if(bankItem===undefined)
return;quantity=Math.min(bankItem.quantity,quantity);if(item.modifiers.masteryToken!==undefined){const skill=item.modifiers.masteryToken[0].skill;const tokenPercent=item.modifiers.masteryToken[0].value;if(!(skill instanceof SkillWithMastery)||!skill.hasMastery)
throw new Error(`Error claiming token. Mastery Token skill does not have mastery.`);const xpPerToken=Math.floor((skill.baseMasteryPoolCap*tokenPercent)/100);const xpRemaining=skill.masteryPoolCap-skill.masteryPoolXP;const tokensToFillPool=Math.floor(xpRemaining/xpPerToken);quantity=Math.min(quantity,tokensToFillPool);const totalXpToAdd=xpPerToken*quantity;skill.addMasteryPoolXP(totalXpToAdd);if(quantity===tokensToFillPool)
notifyPlayer(skill,templateLangString('TOASTS','MAX_POOL_TOKENS',{count:`${tokensToFillPool}`}),'info');notifyPlayer(skill,templateLangString('TOASTS','POOL_XP_GRANTED',{xp:numberWithCommas(totalXpToAdd)}),'success');this.removeItemQuantity(item,quantity,true);$('#mastery-pool-spend-token-qty').text(numberWithCommas(this.getQty(item)));}
else{this.removeItemQuantity(item,quantity,true);this.game.combat.player.computeAllStats();}}
getMaxUpgradeQuantity(upgrade){let maxUpgrades=Infinity;if(upgrade.gpCost>0){maxUpgrades=Math.min(maxUpgrades,Math.floor(this.game.gp.amount/upgrade.gpCost));}
if(upgrade.scCost>0){maxUpgrades=Math.min(maxUpgrades,Math.floor(this.game.slayerCoins.amount/upgrade.scCost));}
upgrade.itemCosts.forEach(({item,quantity})=>{maxUpgrades=Math.min(maxUpgrades,Math.floor(this.getQty(item)/quantity));});return maxUpgrades;}
checkUpgradePotionRequirement(upgrade){let requirementsMet=true;if(upgrade.upgradedItem instanceof PotionItem){const recipe=this.game.herblore.getRecipeForPotion(upgrade.upgradedItem);requirementsMet=recipe!==undefined&&this.game.herblore.getMasteryLevel(recipe)>=Herblore.tierMasteryLevels[upgrade.upgradedItem.tier];}
return requirementsMet;}
fireItemUpgradeModal(upgrade,rootItem){$('#view-upgrade-btn').attr('class','btn btn-success d-none');const upgradedItem=upgrade.upgradedItem;$('#item-view-name-upgrade').html(upgradedItem.name);$('#item-view-img-upgrade').attr('src',upgradedItem.media);if(upgradedItem instanceof EquipmentItem){const statComparison=new EquipmentStats();statComparison.addStats(upgradedItem.equipmentStats);if(upgradedItem instanceof WeaponItem){$('#item-view-interval-upgrade-cont').removeClass('d-none');}
else{$('#item-view-interval-upgrade-cont').addClass('d-none');}
$('#item-view-interval-upgrade').text(templateLangString('MENU_TEXT','SECONDS_SHORT',{seconds:formatFixed(statComparison.attackSpeed/1000,2),}));$('#item-view-stab-bonus-upgrade').text(statComparison.stabAttackBonus);$('#item-view-slash-bonus-upgrade').text(statComparison.slashAttackBonus);$('#item-view-block-bonus-upgrade').text(statComparison.blockAttackBonus);$('#item-view-strength-bonus-upgrade').text(statComparison.meleeStrengthBonus);$('#item-view-defence-bonus-upgrade').text(statComparison.meleeDefenceBonus);$('#item-view-ranged-attack-bonus-upgrade').text(statComparison.rangedAttackBonus);$('#item-view-ranged-strength-bonus-upgrade').text(statComparison.rangedStrengthBonus);$('#item-view-ranged-defence-bonus-upgrade').text(statComparison.rangedDefenceBonus);$('#item-view-magic-attack-bonus-upgrade').text(statComparison.magicAttackBonus);$('#item-view-magic-damage-bonus-upgrade').text(formatPercent(statComparison.magicDamageBonus));$('#item-view-magic-defence-bonus-upgrade').text(statComparison.magicDefenceBonus);$('#item-view-damage-reduction-upgrade').text(formatPercent(statComparison.damageReduction));if(rootItem instanceof EquipmentItem)
statComparison.subtractStats(rootItem.equipmentStats);const formatDiff=(id,diff,percent=false,interval=false)=>{const diffElem=$(id);let diffText='';if(diff!==0){if(interval)
diffText=templateLangString('MENU_TEXT','SECONDS_SHORT',{seconds:formatFixed(diff/1000,2),});else if(percent)
diffText=formatPercent(diff);else
diffText=`${diff}`;}
if(diff>0){diffText=`+${diffText}`;}
const isPositive=diff>0===!interval;diffElem.text(diffText);if(isPositive){diffElem.removeClass('text-danger');diffElem.addClass('text-success');}
else{diffElem.removeClass('text-success');diffElem.addClass('text-danger');}};formatDiff('#item-view-interval-upgrade-diff',statComparison.attackSpeed,false,true);formatDiff('#item-view-slash-bonus-upgrade-diff',statComparison.slashAttackBonus);formatDiff('#item-view-stab-bonus-upgrade-diff',statComparison.stabAttackBonus);formatDiff('#item-view-block-bonus-upgrade-diff',statComparison.blockAttackBonus);formatDiff('#item-view-strength-bonus-upgrade-diff',statComparison.meleeStrengthBonus);formatDiff('#item-view-defence-bonus-upgrade-diff',statComparison.meleeDefenceBonus);formatDiff('#item-view-ranged-attack-bonus-upgrade-diff',statComparison.rangedAttackBonus);formatDiff('#item-view-ranged-strength-bonus-upgrade-diff',statComparison.rangedStrengthBonus);formatDiff('#item-view-ranged-defence-bonus-upgrade-diff',statComparison.rangedDefenceBonus);formatDiff('#item-view-magic-attack-bonus-upgrade-diff',statComparison.magicAttackBonus);formatDiff('#item-view-magic-damage-bonus-upgrade-diff',statComparison.magicDamageBonus,true);formatDiff('#item-view-magic-defence-bonus-upgrade-diff',statComparison.magicDefenceBonus);formatDiff('#item-view-damage-reduction-upgrade-diff',statComparison.damageReduction,true);$('#modal-upgrade-item-stats').removeClass('d-none');$('#modal-upgrade-item-stats-info').addClass('d-none');if(upgradedItem.specialAttacks.length>0){const attackHTML=upgradedItem.specialAttacks.map((attack,id)=>{let chance=attack.defaultChance;if(upgradedItem.overrideSpecialChances!==undefined)
chance=upgradedItem.overrideSpecialChances[id];return `<h5 class="font-w400 font-size-sm text-left text-combat-smoke m-1 mb-2"><strong class="text-bank-desc">${attack.name} (${formatPercent(chance)}) </strong><span>${attack.description}</span></h5>`;}).join('');$('#item-upgrade-special-attack-list').html(attackHTML);$('#item-upgrade-special-attack').removeClass('d-none');}
else{$('#item-upgrade-special-attack').addClass('d-none');}
let levelReqHTML='';const levelReqs=upgradedItem.equipRequirements.filter((req)=>req.type==='SkillLevel');if(levelReqs.length>0){levelReqs.forEach((req)=>{levelReqHTML+=`<span class="font-size-sm">${templateLangString('MENU_TEXT','REQUIRES_SKILL_LEVEL',{skillImage:`<span class="font-size-sm"><img class="skill-icon-xs mr-2" src="${req.skill.media}">`,level:`${req.level}`,})}</span><br>`;});$('#item-upgrade-description-levels').removeClass('d-none');}
else
$('#item-upgrade-description-levels').addClass('d-none');$('#item-upgrade-description-levels').html(levelReqHTML);}
else{$('#modal-upgrade-item-stats').addClass('d-none');$('#modal-upgrade-item-stats-info').removeClass('d-none');$('#item-upgrade-special-attack-list').text('');$('#item-upgrade-special-attack').addClass('d-none');$('#item-upgrade-description-levels').addClass('d-none');}
const potionRequirementMet=this.checkUpgradePotionRequirement(upgrade);if(upgradedItem instanceof PotionItem){const textClass=potionRequirementMet?'text-success':'text-danger';$('#item-upgrade-cost-mastery-text').text(Herblore.tierMasteryLevels[upgradedItem.tier]);$('#item-upgrade-cost-mastery-text').removeClass('text-danger');$('#item-upgrade-cost-mastery-text').removeClass('text-success');$('#item-upgrade-cost-mastery-text').addClass(textClass);$('#item-upgrade-cost-mastery').removeClass('d-none');}
else
$('#item-upgrade-cost-mastery').addClass('d-none');if(upgradedItem.hasDescription)
$('#item-upgrade-description').html(upgradedItem.description);else
$('#item-upgrade-description').html('');if(upgrade.gpCost>0){$('#item-upgrade-cost-gp').text(formatNumber(upgrade.gpCost));$('#item-upgrade-cost-gp').removeClass('text-danger');$('#item-upgrade-cost-gp').removeClass('text-success');$('#item-upgrade-cost-gp').addClass(this.game.gp.canAfford(upgrade.gpCost)?'text-success':'text-danger');$('#item-upgrade-cost-gp').removeClass('d-none');$('#item-upgrade-cost-gp-img').removeClass('d-none');}
else{$('#item-upgrade-cost-gp').addClass('d-none');$('#item-upgrade-cost-gp-img').addClass('d-none');}
if(upgrade.scCost>0){$('#item-upgrade-cost-sc').text(formatNumber(upgrade.scCost));$('#item-upgrade-cost-sc').removeClass('text-danger');$('#item-upgrade-cost-sc').removeClass('text-success');$('#item-upgrade-cost-sc').addClass(this.game.slayerCoins.canAfford(upgrade.scCost)?'text-success':'text-danger');$('#item-upgrade-cost-sc').removeClass('d-none');$('#item-upgrade-cost-sc-img').removeClass('d-none');}
else{$('#item-upgrade-cost-sc').addClass('d-none');$('#item-upgrade-cost-sc-img').addClass('d-none');}
$('#item-upgrade-cost').html('');upgrade.itemCosts.forEach(({item,quantity})=>{const owned=this.getQty(item);$('#item-upgrade-cost').append(`<img class="skill-icon-sm js-tooltip-enabled mr-1" src="${item.media}" data-toggle="tooltip" data-html="true" data-placement="bottom" title="" data-original-title="${item.name}"><span class="font-w600 ${owned>=quantity?'text-success':'text-danger'}">${quantity}</span>`);});const upgradeButtons=[{button:document.getElementById('view-upgrade-btn'),quantity:1,},{button:document.getElementById('view-upgrade-btn-10'),quantity:10,},{button:document.getElementById('view-upgrade-btn-100'),quantity:100,},{button:document.getElementById('view-upgrade-btn-1000'),quantity:1000,},{button:document.getElementById('view-upgrade-btn-all'),quantity:Infinity,},];const maxUpgrades=this.getMaxUpgradeQuantity(upgrade);upgradeButtons.forEach(({button,quantity})=>{if(potionRequirementMet&&(maxUpgrades>=quantity||(quantity===Infinity&&maxUpgrades>0))){showElement(button);button.onclick=()=>this.upgradeItemOnClick(upgrade,quantity);}
else{hideElement(button);}});updateTooltips();$('#modal-item-upgrade').modal('show');}
upgradeItemOnClick(upgrade,upgradeQuantity){if(!this.checkUpgradePotionRequirement(upgrade))
return;upgradeQuantity=Math.min(this.getMaxUpgradeQuantity(upgrade),upgradeQuantity);const costs=new Costs(this.game);costs.addGP(upgrade.gpCost*upgradeQuantity);costs.addSlayerCoins(upgrade.scCost*upgradeQuantity);upgrade.itemCosts.forEach(({item,quantity})=>{costs.addItem(item,quantity*upgradeQuantity);});if(this.addItem(upgrade.upgradedItem,upgradeQuantity,false,true)){costs.consumeCosts();}}
useEightOnClick(eight){const bankItem=this.items.get(eight);if(bankItem===undefined)
return;const eightRoll=rollInteger(1,8);if(eightRoll===8){this.addItem(eight,8,false,true);}
this.removeItemQuantity(eight,1,true);}
findAFriendOnClick(cracker){SwalLocale.fire({title:'...',html:`<small><div class="spinner-border spinner-border-sm text-primary mr-2" id="friend-finder-progress-spinner" role="status"></div>${getLangString('MENU_TEXT','FINDING_A_FRIEND')}</small>`,imageUrl:cdnMedia("assets/media/main/question.svg"),imageWidth:64,imageHeight:64,imageAlt:'Offline',allowOutsideClick:false,});$('.swal2-confirm').attr('disabled','true');const success=(data)=>{if(data==='true'){SwalLocale.fire({title:':D',html:getLangString('BANK_STRING','FOUND_A_FRIEND'),imageUrl:cdnMedia('assets/media/bank/friendship_bracelet.png'),imageWidth:64,imageHeight:64,imageAlt:getLangString('BANK_STRING','YAY_FRIEND'),});this.addItemByID("melvorD:Friendship_Bracelet",1,false,true);}
else{SwalLocale.fire({title:':(',html:getLangString('MENU_TEXT','NO_FRIENDS_FOUND'),});}};setTimeout(()=>{$.ajax({url:'misc/findAFriend.php',type:'POST',async:true,success,});},2000);}
updateSearchArray(){this.searchArray=[];this.items.forEach((bankItem)=>{this.searchArray.push({item:bankItem.item,qty:bankItem.quantity,name:bankItem.item.name,category:bankItem.item.category,description:bankItem.item.description,type:bankItem.item.type,tab:bankItem.tab,});});}
onBankSearchChange(query){if(query===''){bankTabMenu.showAllItems();bankOptionsMenu.setSearchNormal();}
else{const options={shouldSort:true,tokenize:true,matchAllTokens:true,findAllMatches:true,threshold:0.1,location:0,distance:100,maxPatternLength:32,minMatchCharLength:1,keys:['name','category','id','type','description'],};const fuse=new Fuse(this.searchArray,options);const result=fuse.search(query);const foundItems=new Set();const foundTabs=new Set();result.forEach((search)=>{const bankItem=this.items.get(search.item);if(bankItem!==undefined){foundItems.add(bankItem.item);if(bankItem.tab!==this.selectedBankTab)
foundTabs.add(bankItem.tab);}});bankTabMenu.updateForSearchResult(foundItems,foundTabs);if(foundItems.size===0){bankOptionsMenu.setSearchNone();}
else{bankOptionsMenu.setSearchNormal();}
switch(query){case 'wherearemylemons':this.addItemByID("melvorD:Lemon",1,false,true);break;case '8':if(!this.eightDelay){this.addItemByID("melvorD:Eight",1,false,true);this.eightDelay=true;window.setTimeout(()=>{this.eightDelay=false;},8000);}
break;case 'uuddlrlrba':showFireworks(true);window.setTimeout(function(){removePyro();clearInterval(pyroInterval);},10000);break;}}}
setSelectedItemAsTabIcon(tabID){if(this.selectedBankItem===undefined){this.tabIcons.delete(tabID);}
else{this.tabIcons.set(tabID,this.selectedBankItem.item);}
this.renderQueue.tabIcons.add(tabID);}
changeDefaultSort(sortSetting){this.game.settings.changeChoiceSetting('bankSortOrder',5);if(sortSetting===5&&this.customSortOrder.length===0){this.storeCustomSortOrder();}}
updateItemBorders(){this.items.forEach((bankItem)=>{bankTabMenu.updateItemLockBorder(bankItem,this.game.settings.useDefaultBankBorders);});}
validateItemOrders(){this.itemsByTab.forEach((tab,tabID)=>{tab.forEach((bankItem,tabPos)=>{if(bankItem.tab!==tabID)
console.warn(`${bankItem.item.name} has a mismatched tab. Real: ${tabID}, Item: ${bankItem.tab}`);if(bankItem.tabPosition!==tabPos)
console.warn(`${bankItem.item.name} has a mismatched tab position. Real: ${tabPos}, Item: ${bankItem.tabPosition}`);});});}}
class BankItem{constructor(bank,item,quantity,tab,tabPosition){this.bank=bank;this.item=item;this.quantity=quantity;this.tab=tab;this.tabPosition=tabPosition;}
get itemSellValue(){return this.bank.getItemSalePrice(this.item);}
get stackValue(){return this.bank.getItemSalePrice(this.item,this.quantity);}
get locked(){return this.bank.lockedItems.has(this.item);}
get isGlowing(){return this.bank.glowingItems.has(this.item);}}
class GolbinRaidBank extends Bank{render(){if(this.renderQueue.items.size>0){let renderRunes=false;this.renderQueue.items.forEach((item)=>{renderRunes||(renderRunes=item.type==='Rune');});if(renderRunes)
combatMenus.runes.updateCounts();this.renderQueue.items.clear();}}}