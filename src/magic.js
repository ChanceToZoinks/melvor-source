"use strict";var SpellTiers;(function(SpellTiers){SpellTiers[SpellTiers["Strike"]=0]="Strike";SpellTiers[SpellTiers["Bolt"]=1]="Bolt";SpellTiers[SpellTiers["Blast"]=2]="Blast";SpellTiers[SpellTiers["Wave"]=3]="Wave";SpellTiers[SpellTiers["Surge"]=4]="Surge";SpellTiers[SpellTiers["Other"]=5]="Other";})(SpellTiers||(SpellTiers={}));var ArchaicSpellTypeID;(function(ArchaicSpellTypeID){ArchaicSpellTypeID[ArchaicSpellTypeID["Poison"]=0]="Poison";ArchaicSpellTypeID[ArchaicSpellTypeID["Infernal"]=1]="Infernal";ArchaicSpellTypeID[ArchaicSpellTypeID["Lightning"]=2]="Lightning";ArchaicSpellTypeID[ArchaicSpellTypeID["Other"]=3]="Other";})(ArchaicSpellTypeID||(ArchaicSpellTypeID={}));class RuneMenu{constructor(){this.container=document.getElementById('combat-rune-count-container');this.runes=new Map();this.highlighted=new Set();}
init(){game.runecrafting.actions.forEach((recipe)=>{const item=recipe.product;if(item.type==='Rune'){this.runes.set(item,this.createMenuElement(item));}});}
createMenuElement(item){const border=createElement('div',{classList:['col-4','col-md-3']});const count=createElement('small',{classList:['text-combat-smoke'],text:'0'});const image=createElement('img',{classList:['skill-icon-xs'],attributes:[['src',item.media]],});const tooltip=this.createTooltip(image,item);border.appendChild(createElement('div',{classList:['text-center']})).append(image,createElement('br'),count);this.container.appendChild(border);return{tooltip:tooltip,count:count,border:border,};}
createTooltip(image,item){return tippy(image,{content:item.name,placement:'bottom',interactive:false,animation:false,});}
updateCounts(){const bank=game.isGolbinRaid?game.golbinRaid.bank:game.combat.bank;this.runes.forEach((menuElement,item)=>{menuElement.count.textContent=formatNumber(bank.getQty(item));});}
updateHighlights(spellSelection,useAltRunes){this.highlighted.forEach((item)=>{this.removeBorder(item);});if(spellSelection.standard!==undefined)
this.addBordersForSpell(spellSelection.standard,useAltRunes);if(spellSelection.curse!==undefined)
this.addBordersForSpell(spellSelection.curse,useAltRunes);if(spellSelection.aurora!==undefined)
this.addBordersForSpell(spellSelection.aurora,useAltRunes);if(spellSelection.ancient!==undefined)
this.addBordersForSpell(spellSelection.ancient,useAltRunes);if(spellSelection.archaic!==undefined)
this.addBordersForSpell(spellSelection.archaic,useAltRunes);}
addBordersForSpell(spell,useAltRunes){let runesRequired=spell.runesRequired;if(useAltRunes&&spell.runesRequiredAlt!==undefined)
runesRequired=spell.runesRequiredAlt;runesRequired.forEach((rune)=>{this.addBorder(rune.item);});}
removeBorder(item){const menu=this.runes.get(item);if(menu!==undefined){menu.border.classList.remove('border','border-success');this.highlighted.delete(item);}}
addBorder(item){const menu=this.runes.get(item);if(menu!==undefined&&!this.highlighted.has(item)){menu.border.classList.add('border','border-success');this.highlighted.add(item);}}}
class SpellMenu{constructor(){this.spellElements=new Map();}
updateForUnlock(level,player,ignoreReqs){this.book.forEach((spell)=>{const spellElem=this.spellElements.get(spell);if(spellElem===undefined)
return;if(this.checkUnlocked(spell,level,player,ignoreReqs)){spellElem.tooltip.setContent(this.getTooltipHTML(spell));spellElem.button.classList.add('pointer-enabled');spellElem.button.onclick=this.getMenuCallback(spell,player);spellElem.image.src=spell.media;}
else{spellElem.tooltip.setContent(this.getLockedTooltipHTML(spell,player,level,ignoreReqs));spellElem.button.classList.remove('pointer-enabled');spellElem.button.onclick=null;spellElem.image.src=`${CDNDIR}assets/media/main/question.svg`;}});}
setMenuCallbacks(player){this.spellElements.forEach((spellElem,spell)=>{spellElem.button.onclick=this.getMenuCallback(spell,player);});}
setSelection(spell){const borders=['border-success','border-2x','spell-selected'];if(this.selection!==undefined){const prevElem=this.spellElements.get(this.selection);if(prevElem!==undefined)
prevElem.button.classList.remove(...borders);}
if(spell!==undefined){const newElem=this.spellElements.get(spell);if(newElem!==undefined)
newElem.button.classList.add(...borders);}
this.selection=spell;}
createMenu(){this.menuContainer.textContent='';this.menuContainer.appendChild(createElement('div',{classList:['col-12']})).appendChild(createElement('small',{classList:['text-warning']})).append(document.createTextNode(this.bookData.name),createElement('br'),document.createTextNode(this.bookData.description));const divs=this.book.map((spell)=>{return{div:this.createSpell(spell),spell};});divs.sort((a,b)=>a.spell.level-b.spell.level);this.menuContainer.append(...divs.map((div)=>div.div));tippy(this.selectButton,{content:this.bookData.name,placement:'bottom',interactive:false,animation:false,});}
createSpell(spell){const image=createElement('img',{classList:['skill-icon-xs']});image.src=spell.media;const button=createElement('a',{classList:['pointer-enabled','nav-link','border','border-dark','p-0'],});const div=createElement('div',{classList:['col-4','col-md-3']});div.appendChild(createElement('ul',{classList:['nav','nav-pills','nav-justified','push']})).appendChild(createElement('li',{classList:['nav-item','mr-1']})).appendChild(createElement('small',{classList:['text-warning']})).appendChild(button).appendChild(image);const tooltip=this.createTooltip(button,'Error: Menu not initialized.');this.spellElements.set(spell,{tooltip:tooltip,button:button,image:image,});return div;}
createTooltip(element,tooltipHTML){return tippy(element,{content:tooltipHTML,placement:'bottom',allowHTML:true,interactive:false,animation:false,});}
getLockedTooltipHTML(spell,player,magicLevel,ignoreReqs){return `
    <div class="text-center">
    ${this.getUnlockHTML(spell,player,magicLevel,ignoreReqs)}
    </div>
    `;}
getRuneHTML(spell){let runes=this.getRuneCostHTML(spell.runesRequired);if(spell.runesRequiredAlt!==undefined&&!game.isGolbinRaid){runes+=`<br>${getLangString('MENU_TEXT','OR')}<br><small class="text-info">(${getLangString('MENU_TEXT','USE_COMBINATION_RUNES')})</small><br>${this.getRuneCostHTML(spell.runesRequiredAlt)}`;}
return runes;}
getRuneCostHTML(costs){return costs.map((runeCost)=>`${runeCost.quantity}<img class='skill-icon-sm' src='${runeCost.item.media}'>`).join('');}
getUnlockHTML(spell,player,magicLevel,ignoreReqs){const successSpan=(met,text)=>`<span class="text-${met?'success':'danger'}">${text}</span>`;let html=`
    <small class='text-info'>${getLangString('MENU_TEXT','REQUIRES')}</small><br>
    ${successSpan(magicLevel>=spell.level,templateLangString('MENU_TEXT','SKILLNAME_LEVEL',{skillName:game.altMagic.name,level:`${spell.level}`}))}<br>`;if(spell.requiredItem!==undefined){const equipped=player.equipment.checkForItem(spell.requiredItem);html+=successSpan(equipped,templateLangString('COMBAT_MISC','REQUIRES_ITEM_TO_BE_EQUIPPED',{itemName:spell.requiredItem.name}))+`<br>`;}
if(ignoreReqs)
return html;spell.requirements.forEach((requirement)=>{switch(requirement.type){case 'DungeonCompletion':{const clearsLeft=requirement.count-game.combat.getDungeonCompleteCount(requirement.dungeon);const templateData={dungeonName:requirement.dungeon.name,count:`${clearsLeft}`,};if(clearsLeft>0)
html+=`${successSpan(false,templateLangString('COMBAT_MISC',clearsLeft===1?'DUNGEON_CLEARED':'DUNGEON_CLEARED_TIMES',templateData))}<br>`;}
break;case 'MonsterKilled':{const killsLeft=requirement.count-game.stats.Monsters.get(requirement.monster,MonsterStats.KilledByPlayer);const templateData={monsterName:requirement.monster.name,monsterImage:'',count:`${killsLeft}`,};if(killsLeft>0)
html+=`${successSpan(false,templateLangString('COMBAT_MISC',killsLeft===1?'DEFEAT_MONSTER_ONCE':'DEFEAT_MONSTER_TIMES',templateData))}<br>`;}
break;default:}});if(spell.requirements.length>0&&!spell.isModded)
html+=`<small>${getLangString('COMBAT_MISC','PRATS_IDEA')}</small>`;return html;}
itemRequirement(spell,player){return spell.requiredItem===undefined||player.equipment.checkForItem(spell.requiredItem);}
checkUnlocked(spell,level,player,ignoreReqs){return(level>=spell.level&&this.itemRequirement(spell,player)&&(ignoreReqs||game.checkRequirements(spell.requirements)));}}
class StandardSpellMenu extends SpellMenu{constructor(){super();this.menuContainer=document.getElementById('combat-spellbook-container-standard');this.selectButton=document.getElementById('spellbook-select-standard');this.bookData={get name(){return getLangString('COMBAT_MISC','STANDARD_SPELLBOOK_NAME');},get description(){return getLangString('COMBAT_MISC','STANDARD_SPELLBOOK_DESC');},};this.book=game.standardSpells.allObjects;this.createMenu();}
getMenuCallback(spell,player){return()=>player.toggleSpell(spell);}
getTooltipHTML(spell){return `
    <div class="text-center">
      <span class='text-warning'>${spell.name}</span><br>
      <small>
        ${templateLangString('COMBAT_MISC','SPELL_DAMAGE',{damage:`${numberMultiplier*spell.maxHit}`,})}<br>
        ${spell.specialAttack!==undefined?`${spell.specialAttack.description}<br>`:''}
        ${getLangString('MENU_TEXT','REQUIRES')}<br>
        ${this.getRuneHTML(spell)}
      </small>
    </div>
    `;}}
class CurseSpellMenu extends SpellMenu{constructor(){super();this.menuContainer=document.getElementById('combat-spellbook-container-curse');this.selectButton=document.getElementById('spellbook-select-curse');this.bookData={get name(){return getLangString('COMBAT_MISC','CURSE_SPELLBOOK_NAME');},get description(){return getLangString('COMBAT_MISC','CURSE_SPELLBOOK_DESC');},};this.book=game.curseSpells.allObjects;this.createMenu();}
getMenuCallback(spell,player){return()=>player.toggleCurse(spell);}
getTooltipHTML(curse){return `
    <div class="text-center">
      <span class='text-warning'>${curse.name}</span><br>
      <small>
        ${getLangString('COMBAT_MISC','GIVES_THE_ENEMY')}<br>
        <span class="text-danger">
        ${getPlainModifierDescriptions(curse.targetModifiers).join('<br>')}<br>
        </span>
        ${templateLangString('COMBAT_MISC','LASTS_ENEMY_TURNS',{count:`${3}`})}<br>
        ${getLangString('MENU_TEXT','REQUIRES')}<br>
        ${this.getRuneHTML(curse)}
      </small>
    </div>
    `;}}
class AuroraSpellMenu extends SpellMenu{constructor(){super();this.menuContainer=document.getElementById('combat-spellbook-container-aurora');this.selectButton=document.getElementById('spellbook-select-aurora');this.bookData={get name(){return getLangString('COMBAT_MISC','AURORA_SPELLBOOK_NAME');},get description(){return getLangString('COMBAT_MISC','AURORA_SPELLBOOK_DESC');},};this.book=game.auroraSpells.allObjects;this.createMenu();}
getMenuCallback(spell,player){return()=>player.toggleAurora(spell);}
getTooltipHTML(aurora){return `
    <div class="text-center">
      <span class='text-warning'>${aurora.name}</span><br>
      <small>
        ${aurora.description}<br>
        ${getLangString('MENU_TEXT','REQUIRES')}<br>
        ${this.getRuneHTML(aurora)}
      </small>
    </div>
    `;}}
class AncientSpellMenu extends SpellMenu{constructor(){super();this.menuContainer=document.getElementById('combat-spellbook-container-ancient');this.selectButton=document.getElementById('spellbook-select-ancient');this.bookData={get name(){return getLangString('COMBAT_MISC','ANCIENT_SPELLBOOK_NAME');},get description(){return getLangString('COMBAT_MISC','ANCIENT_SPELLBOOK_DESC');},};this.book=game.ancientSpells.allObjects;this.createMenu();}
getMenuCallback(spell,player){return()=>player.toggleAncient(spell);}
createMenu(){super.createMenu();this.menuContainer.appendChild(createElement('div',{classList:['col-12']})).appendChild(createElement('small',{classList:['text-danger']})).append(createElement('i',{classList:['fa','fa-fw','fa-info-circle','mr-2']}),document.createTextNode(getLangString('COMBAT_MISC','ANCIENT_EXTRA_INFO')));}
getTooltipHTML(ancient){return `
    <div class="text-center">
      <span class='text-warning'>${ancient.name}</span><br>
      <small>
        ${ancient.specialAttack.description}<br>
        ${getLangString('MENU_TEXT','REQUIRES')}<br>
        ${this.getRuneHTML(ancient)}
      </small>
    </div>
    `;}}
class ArchaicSpellMenu extends SpellMenu{constructor(){super();this.menuContainer=document.getElementById('combat-spellbook-container-archaic');this.selectButton=document.getElementById('spellbook-select-archaic');this.bookData={get name(){return getLangString('COMBAT_MISC','ARCHAIC_SPELLBOOK_NAME');},get description(){return getLangString('COMBAT_MISC','ARCHAIC_SPELLBOOK_DESC');},};this.book=game.archaicSpells.allObjects;this.createMenu();}
getMenuCallback(spell,player){return()=>player.toggleArchaic(spell);}
createMenu(){super.createMenu();this.menuContainer.appendChild(createElement('div',{classList:['col-12']})).appendChild(createElement('small',{classList:['text-danger']})).append(createElement('i',{classList:['fa','fa-fw','fa-info-circle','mr-2']}),document.createTextNode(getLangString('COMBAT_MISC','ARCHAIC_EXTRA_INFO')));}
getTooltipHTML(spell){return `
    <div class="text-center">
      <span class='text-warning'>${spell.name}</span><br>
      <small>
        ${templateLangString('COMBAT_MISC','SPELL_DAMAGE',{damage:`${numberMultiplier*spell.maxHit}`,})}<br>
        ${spell.specialAttack.description}<br>
        ${getLangString('MENU_TEXT','REQUIRES')}<br>
        ${this.getRuneHTML(spell)}
      </small>
    </div>
    `;}}
function updateSpellbook(book,player,magicLevel,ignoreReqs){if(player.attackType==='magic')
$('#combat-spellbook-notice').addClass('d-none');else
$('#combat-spellbook-notice').removeClass('d-none');switch(book){case 'standard':combatMenus.spells.standard.updateForUnlock(magicLevel,player,ignoreReqs);break;case 'curse':combatMenus.spells.curse.updateForUnlock(magicLevel,player,ignoreReqs);break;case 'aurora':combatMenus.spells.aurora.updateForUnlock(magicLevel,player,ignoreReqs);break;case 'ancient':combatMenus.spells.ancient.updateForUnlock(magicLevel,player,ignoreReqs);break;case 'archaic':combatMenus.spells.archaic.updateForUnlock(magicLevel,player,ignoreReqs);break;}}