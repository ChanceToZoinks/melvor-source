"use strict";class ActivePrayer extends NamespacedObject{constructor(namespace,data,game){super(namespace,data.id);this.level=data.level;this._media=data.media;this._name=data.name;this.pointsPerPlayer=data.pointsPerPlayer;this.pointsPerEnemy=data.pointsPerEnemy;this.pointsPerRegen=data.pointsPerRegen;this.modifiers=game.getPlayerModifiersFromData(data.modifiers);if(data.enemyModifiers!==undefined)
this.enemyModifiers=data.enemyModifiers;}
get media(){return this.getMediaURL(this._media);}
get name(){if(this.isModded){return this._name;}
else{return getLangString('PRAYER',`PRAYER_NAME_${this.localID}`);}}}
class PrayerMenu{constructor(){this.menuContainer=document.getElementById('combat-prayer-container');this.activeContainer=document.getElementById('combat-player-active-prayers');this.menus=new Map();this.activeMenu=[];this.createMenu();this.createActiveMenu();}
createMenu(){this.menuContainer.textContent='';const prayerMenuContainer=this.menuContainer.appendChild(createElement('div',{classList:['row']}));const sortedPrayers=game.prayers.allObjects.sort((a,b)=>a.level-b.level);sortedPrayers.forEach((prayer)=>{prayerMenuContainer.append(this.createMenuPrayer(prayer));});}
createActiveMenu(){this.activeContainer.append(this.createActivePrayer(),this.createActivePrayer());}
updateForLevel(level,player){game.prayers.forEach((prayer)=>{const menuElem=this.menus.get(prayer);if(menuElem===undefined)
return;if(level>=prayer.level){menuElem.tooltip.setContent(this.getUnlockedTooltipHTML(prayer));menuElem.button.classList.remove('border-2x');menuElem.button.classList.add('pointer-enabled');menuElem.button.onclick=()=>player.togglePrayer(prayer);menuElem.image.src=prayer.media;}
else{menuElem.tooltip.setContent(this.getLockedTooltipHTML(prayer));menuElem.button.classList.remove('pointer-enabled');menuElem.button.classList.add('border-2x');menuElem.button.onclick=null;menuElem.image.src=`${CDNDIR}assets/media/main/question.svg`;}});}
setEnabled(button){button.classList.add('border-success','spell-selected');button.classList.remove('border-dark');}
setDisabled(button){button.classList.add('border-dark');button.classList.remove('border-success','spell-selected');}
setActive(active,player){this.menus.forEach((elem)=>this.setDisabled(elem.button));let i=0;active.forEach((prayer)=>{const menuItem=this.activeMenu[i];const prayerMenuElement=this.menus.get(prayer);if(prayerMenuElement!==undefined)
this.setEnabled(prayerMenuElement.button);menuItem.image.src=prayer.media;menuItem.tooltip.setContent(this.getUnlockedTooltipHTML(prayer));showElement(menuItem.button);menuItem.button.onclick=()=>player.togglePrayer(prayer);i++;});for(let i=active.size;i<2;i++){hideElement(this.activeMenu[i].button);}}
setMenuCallbacks(player){this.menus.forEach((menuItem,pID)=>{menuItem.button.onclick=()=>player.togglePrayer(pID);});}
createActivePrayer(){const image=createElement('img',{classList:['skill-icon-xs']});const button=createElement('a',{classList:['pointer-enabled','m-1','d-none']});button.appendChild(image);const tooltip=this.createTooltip(button,'');this.activeMenu.push({tooltip,image,button,});return button;}
createMenuPrayer(prayer){const image=createElement('img',{classList:['skill-icon-xs']});image.src=prayer.media;const button=createElement('a',{classList:['pointer-enabled','nav-link','border','border-dark','p-0'],});const newDiv=createElement('div',{classList:['col-3']});newDiv.appendChild(createElement('ul',{classList:['nav','nav-pills','nav-justified','push']})).appendChild(createElement('li',{classList:['nav-item','mr-1']})).appendChild(button).appendChild(image);const tooltip=this.createTooltip(button,this.getUnlockedTooltipHTML(prayer));this.menus.set(prayer,{tooltip,image,button,newDiv,});return newDiv;}
createTooltip(parent,tooltipHTML){return tippy(parent,{content:tooltipHTML,placement:'bottom',allowHTML:true,interactive:false,animation:false,});}
getLockedTooltipHTML(prayer){return `<div class="text-center"><span class="text-warning">${templateLangString('MENU_TEXT','UNLOCKED_AT_SKILL_LEVEL',{skillName:game.prayer.name,level:`${prayer.level}`})}</span></div>`;}
getUnlockedTooltipHTML(prayer){let ppPlayer='';let ppEnemy='';let ppRegen='';let xpDesc=`<small class="text-danger">${getLangString('PRAYER','PROVIDES_NO_XP')}</small>`;if(prayer.pointsPerPlayer!=undefined&&prayer.pointsPerPlayer>0){ppPlayer=`<br><small>${templateLangString('PRAYER','PRAYER_MISC_2',{points:`<span class='text-info'>${prayer.pointsPerPlayer}</span>`,})}</small>`;xpDesc=`<small class="text-success">${getLangString('PRAYER','PROVIDES_XP')}</small>`;}
if(prayer.pointsPerEnemy!=undefined&&prayer.pointsPerEnemy>0)
ppEnemy=`<br><small>${templateLangString('PRAYER','PRAYER_MISC_1',{points:`<span class='text-info'>${prayer.pointsPerEnemy}</span>`,})}</small>`;if(prayer.pointsPerRegen!=undefined&&prayer.pointsPerRegen>0)
ppRegen=`<br><small>${templateLangString('PRAYER','PRAYER_MISC_3',{points:`<span class='text-info'>${prayer.pointsPerRegen}</span>`,})}</small>`;let enemyDesc='';if(prayer.enemyModifiers!==undefined){enemyDesc='<br>'+
getPlainModifierDescriptions(prayer.enemyModifiers).map((desc)=>`${getLangString('COMBAT_MISC','GIVES_THE_ENEMY')} ${desc}`).join('<br>');}
return `<div class="text-center"> 
    <span class="text-warning">${prayer.name}</span><br>
    <small class='text-info'>${getPlainModifierDescriptions(prayer.modifiers).join('<br>')}${enemyDesc}</small><br>
    ${xpDesc}<br>
    <small class='text-warning'>${getLangString('PRAYER','PRAYER_MISC_0')}</small>
    ${ppPlayer}
    ${ppEnemy}
    ${ppRegen}
    </div>`;}}