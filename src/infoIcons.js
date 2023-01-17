"use strict";class ContainedComponent{show(){showElement(this.container);}
hide(){hideElement(this.container);}
invisible(){this.container.classList.add('invisible');}
visible(){this.container.classList.remove('invisible');}}
class InfoIcon extends ContainedComponent{constructor(parent,pillClass,size){super();this.parent=parent;this.container=createElement('div',{classList:['bank-item','no-bg','btn-light','pointer-enabled','m-1',`resize-${size}`],});this.image=this.container.appendChild(createElement('img',{classList:['bank-img','p-2',`resize-${size}`],parent:this.container,}));this.text=this.container.appendChild(createElement('div',{classList:['font-size-sm','text-white','text-center'],})).appendChild(createElement('small',{classList:['badge-pill',pillClass],}));this.tooltip=tippy(this.container,{content:'',placement:'top',allowHTML:true,interactive:false,animation:false,});parent.appendChild(this.container);}
setImage(media){this.image.src=media;}
setText(text){this.text.textContent=text;}
setTooltip(content){this.tooltip.setContent(content);}
destroy(){this.tooltip.destroy();this.parent.removeChild(this.container);}
hide(){this.container.classList.add('d-none');}
show(){this.container.classList.remove('d-none');}}
InfoIcon.media={skillXP:'assets/media/main/xp.svg',strXP:'assets/media/skills/strength/strength.svg',masteryXP:'assets/media/main/mastery_header.svg',poolXP:'assets/media/main/mastery_pool.svg',preserveChance:'assets/media/main/preservation.svg',doublingChance:'assets/media/main/double.svg',interval:'assets/media/main/timer.svg',gp:'assets/media/main/coins.svg',slayerCoins:'assets/media/main/slayer_coins.svg',shopIcon:'assets/media/main/shop_header.svg',perfectCook:'assets/media/skills/cooking/perfect.png',successfulCook:'assets/media/main/tick.png',intervalAlt:'assets/media/main/lemon_clock.png',};class XPIcon extends InfoIcon{constructor(parent,xp,size=48){super(parent,'bg-secondary',size);this.xp=xp;this.setXP(xp);this.setImage(InfoIcon.media.skillXP);}
setXP(xp){this.xp=Math.floor(xp);this.setText(`${this.xp}`);this.localize();}
localize(){this.setTooltip(this.getTooltipContent(this.xp));}
getTooltipContent(xp){return `<div class="text-center">${templateLangString('MENU_TEXT','TOOLTIP_SKILL_XP',{xp:`${xp}`,})}<br><small>${getLangString('MENU_TEXT','INCLUSIVE_OF_BONUSES')}</small></div>`;}}
class STRXPIcon extends InfoIcon{constructor(parent,xp,size=48){super(parent,'bg-secondary',size);this.xp=xp;this.setImage(cdnMedia(InfoIcon.media.strXP));this.setXP(xp);}
setXP(xp){if(xp<=0)
this.hide();else
this.show();this.xp=Math.floor(xp);this.setText(`${this.xp}`);this.localize();}
localize(){this.setTooltip(this.getTooltipContent(this.xp));}
getTooltipContent(xp){return `<div class="text-center">${xp} ${getLangString('SKILL_NAME','Strength')} XP<br><small>${getLangString('MENU_TEXT','INCLUSIVE_OF_BONUSES')}</small></div>`;}}
class IntervalIcon extends InfoIcon{constructor(parent,interval,size=48,altMedia=false){super(parent,'bg-primary',size);this.localize();this.setInterval(interval);this.setMedia(altMedia);}
setMedia(altMedia){this.setImage(altMedia?InfoIcon.media.intervalAlt:InfoIcon.media.interval);}
localize(){this.setTooltip(`<div class="text-center text-warning">${getLangString('MENU_TEXT','TOOLTIP_INTERVAL')}<br><small>${getLangString('MENU_TEXT','INCLUSIVE_OF_BONUSES')}</small></div>`);}
setInterval(interval){this.setText(`${formatFixed(interval/1000,2)}s`);}}
class DoublingIcon extends InfoIcon{constructor(parent,chance,size=48){super(parent,'bg-primary',size);this.localize();this.setChance(chance);this.setImage(InfoIcon.media.doublingChance);}
localize(){this.setTooltip(this.getTooltipContent());}
getTooltipContent(){return `
    <h5 class="font-w400 font-size-sm mb-1 text-warning text-center">${getLangString('MENU_TEXT','TOOLTIP_DOUBLE')}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-danger text-center">${templateString(getLangString('MENU_TEXT','TOOLTIP_CAPPED'),{chance:'100'})}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center">
      <small>${getLangString('MENU_TEXT','TOOLTIP_CHANCE_BELOW')}</small>
    </h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center text-info">
      <small>${getLangString('MENU_TEXT','TOOLTIP_FUTURE_UPDATE')}</small>
    </h5>
    `;}
setChance(chance){this.setText(formatPercent(Math.round(chance)));}}
class PreservationIcon extends InfoIcon{constructor(parent,chance,size=48){super(parent,'bg-primary',size);this.localize();this.setChance(chance);this.setImage(InfoIcon.media.preserveChance);}
localize(){this.setTooltip(this.getTooltipContent());}
getTooltipContent(){return `
    <h5 class="font-w400 font-size-sm mb-1 text-warning text-center">${getLangString('MENU_TEXT','TOOLTIP_PRESERVE')}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-danger text-center">${templateString(getLangString('MENU_TEXT','TOOLTIP_CAPPED'),{chance:'80'})}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center">
      <small>${getLangString('MENU_TEXT','TOOLTIP_CHANCE_BELOW')}</small>
    </h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center text-info">
      <small>${getLangString('MENU_TEXT','TOOLTIP_FUTURE_UPDATE')}</small>
    </h5>
    `;}
setChance(chance){this.setText(formatPercent(Math.round(chance)));}}
class PerfectCookIcon extends InfoIcon{constructor(parent,chance,size=48){super(parent,'bg-primary',size);this.localize();this.setChance(chance);this.setImage(InfoIcon.media.perfectCook);}
localize(){this.setTooltip(this.getTooltipContent());}
getTooltipContent(){return `
    <h5 class="font-w400 font-size-sm mb-1 text-warning text-center">${getLangString('MENU_TEXT','TOOLTIP_PERFECT_COOK')}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-danger text-center">${templateString(getLangString('MENU_TEXT','TOOLTIP_CAPPED'),{chance:'100'})}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center">
      <small>${getLangString('MENU_TEXT','TOOLTIP_CHANCE_BELOW')}</small>
    </h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center text-info">
      <small>${getLangString('MENU_TEXT','TOOLTIP_FUTURE_UPDATE')}</small>
    </h5>
    `;}
setChance(chance){this.setText(formatPercent(Math.round(chance)));}}
class CookingSuccessIcon extends InfoIcon{constructor(parent,chance,size=48){super(parent,'bg-primary',size);this.localize();this.setChance(chance);this.setImage(InfoIcon.media.successfulCook);}
localize(){this.setTooltip(this.getTooltipContent());}
getTooltipContent(){return `
    <h5 class="font-w400 font-size-sm mb-1 text-warning text-center">${getLangString('MENU_TEXT','TOOLTIP_SUCCESSFUL_COOK')}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-danger text-center">${templateString(getLangString('MENU_TEXT','TOOLTIP_CAPPED'),{chance:'100'})}</h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center">
      <small>${getLangString('MENU_TEXT','TOOLTIP_CHANCE_BELOW')}</small>
    </h5>
    <h5 class="font-w400 font-size-sm mb-1 text-center text-info">
      <small>${getLangString('MENU_TEXT','TOOLTIP_FUTURE_UPDATE')}</small>
    </h5>
    `;}
setChance(chance){this.setText(formatPercent(Math.round(chance)));}}
class MasteryXPIcon extends InfoIcon{constructor(parent,xp,size=48){super(parent,'bg-secondary',size);this.xp=xp;this.setXP(xp);this.setImage(InfoIcon.media.masteryXP);}
localize(){this.setTooltip(this.getTooltipContent());}
setXP(xp){this.xp=Math.floor(xp);this.setText(`${this.xp}`);this.localize();}
getTooltipContent(){return `<div class="text-center">${templateLangString('MENU_TEXT','TOOLTIP_MASTERY_XP',{value:`${this.xp}`,})}<br><small>${getLangString('MENU_TEXT','INCLUSIVE_OF_BONUSES')}</small></div>`;}}
class MasteryPoolIcon extends InfoIcon{constructor(parent,xp,size=48){super(parent,'bg-secondary',size);this.xp=xp;this.setXP(xp);this.setImage(InfoIcon.media.poolXP);}
localize(){this.setTooltip(this.getTooltipContent());}
setXP(xp){this.xp=Math.floor(xp);this.setText(`${this.xp}`);this.setTooltip(this.getTooltipContent());}
getTooltipContent(){return `<div class="text-center">${templateLangString('MENU_TEXT','TOOLTIP_MASTERY_POOL_XP',{value:`${this.xp}`,})}<br><small>${getLangString('MENU_TEXT','INCLUSIVE_OF_BONUSES')}</small></div>`;}}
class StealthIcon extends InfoIcon{constructor(parent,size=48){super(parent,'bg-primary',size);this.setImage(game.thieving.media);}
setNPC(npc){this.npc=npc;this.setText(`${game.thieving.getStealthAgainstNPC(npc)}`);this.localize();}
localize(){this.setTooltip(this.getTooltipContent());}
getTooltipContent(){if(this.npc===undefined)
return '';return `<div class="text-center">
    <h5 class="font-w600 font-size-sm mb-1 text-white">${templateString(getLangString('MENU_TEXT','TOOLTIP_STEALTH_VS'),{stealth:`${game.thieving.getStealthAgainstNPC(this.npc)}`,perception:`${this.npc.perception}`,})}</h5>
    <h5 class="font-w400 font-size-sm mb-1">${getLangString('MENU_TEXT','THIS_GIVES_YOU')}</h5>
    <small>
        <span> ${templateLangString('MENU_TEXT','SUCCESS_RATE',{value:`<span class="text-success">${formatPercent(game.thieving.getNPCSuccessRate(this.npc),2)}</span>`,})}</span><br>
        <span> ${templateLangString('MENU_TEXT','TOOLTIP_INCREASED_DOUBLING',{value:`<span class="text-success">${formatPercent(game.thieving.getNPCSleightOfHand(this.npc),2)}</span>`,})}</span><br>
        <span> ${templateLangString('MENU_TEXT','TOOLTIP_NPC_UNIQUE_CHANCE',{value:`<span class="text-success">${formatPercent(game.thieving.getNPCPickpocket(this.npc),3)}</span>`,})}</span><br>
    </small>
    </div>`;}}
class ItemChanceIcon extends InfoIcon{constructor(parent,size=48){super(parent,'bg-secondary',size);}
setItem(item){this.item=item;this.setImage(item.media);this.localize();}
localize(){this.setTooltip(this.getTooltipContent());}
getTooltipContent(){if(this.item===undefined)
return '';return `<div class="text-center">${this.item.name}</div>`;}
setChance(chance){this.setText(formatPercent(chance,2));}}
class MeteoriteChanceIcon extends InfoIcon{constructor(parent,size=48){super(parent,'bg-secondary',size);this.setImage(cdnMedia('assets/media/skills/astrology/meteorite.svg'));this.localize();}
localize(){this.setTooltip(this.getTooltipContent());}
getTooltipContent(){return `<div class="text-center">${getLangString('ORE_NAME','Meteorite_Ore')}</div>`;}
setChance(chance){this.setText(formatPercent(chance,2));}}
class QtyIcon extends InfoIcon{constructor(parent,qty,size=48){super(parent,'bg-secondary',size);this.qty=qty;this.setText(numberWithCommas(this.qty));}
localize(){this.setTooltip(this.getTooltipContent());}
updateQuantity(){if(this.getCurrentQty()>=this.qty){this.container.classList.remove('border-item-invalid');}
else{this.container.classList.add('border-item-invalid');}}
getTooltipContent(){return `<div class="text-center">${this.getName()}</div>`;}}
class ItemQtyIcon extends QtyIcon{constructor(parent,quickBuy=false,qty=0,size=48){super(parent,qty,size);this.allowQuickBuy=false;this.autoBuyIcon=createElement('img',{classList:['skill-icon-xxs','is-in-shop','d-none'],attributes:[['src',InfoIcon.media.shopIcon]],});this.container.append(this.autoBuyIcon);this.allowQuickBuy=quickBuy;}
setItem(item,qty,altMedia=false){this.item=item;this.qty=qty;this.setText(numberWithCommas(qty));this.localize();this.image.src=altMedia?item.altMedia:item.media;const purchase=game.shop.getQuickBuyPurchase(item);if(this.allowQuickBuy&&purchase!==undefined){showElement(this.autoBuyIcon);this.container.onclick=()=>game.shop.quickBuyItemOnClick(purchase);}
else{hideElement(this.autoBuyIcon);this.container.onclick=null;}}
getCurrentQty(){if(this.item===undefined)
return 0;return game.bank.getQty(this.item);}
getName(){if(this.item===undefined)
return '';return this.item.name;}}
class CookingStockpileIcon extends ItemQtyIcon{constructor(parent,category,size=48){super(parent,false,0,size);this.container.onclick=()=>game.cooking.onCollectStockpileClick(category);this.container.classList.remove('m-1');this.container.classList.add('border','border-primary','ml-1','mb-1','mt-1','mr-0');}
unsetItem(){this.setText('0');hideElement(this.image);this.tooltip.disable();}
setItem(item,qty){super.setItem(item,qty);showElement(this.image);this.tooltip.enable();}}
class GPQtyIcon extends QtyIcon{constructor(parent,qty,size=48){super(parent,qty,size);this.setImage(InfoIcon.media.gp);this.localize();}
getCurrentQty(){return game.gp.amount;}
getName(){return getLangString('MENU_TEXT','GP');}}
class SCQtyIcon extends QtyIcon{constructor(parent,qty,size=48){super(parent,qty,size);this.localize();this.setImage(InfoIcon.media.slayerCoins);}
getCurrentQty(){return game.slayerCoins.amount;}
getName(){return getLangString('MENU_TEXT','SLAYER_COINS');}}
class QtyCurrentIcon extends InfoIcon{constructor(parent,requiredQty,size=48){super(parent,'bg-primary',size);this.currentQuantity=0;this.requiredQuantity=requiredQty;}
localize(){this.setTooltip(this.getTooltipContent());}
init(){this.updateQuantity();this.localize();this.container.onmouseover=()=>this.onMouseover();this.container.onmouseleave=()=>this.onMouseleave();}
updateQuantity(){this.currentQuantity=this.getCurrentQty();this.setText(formatNumber(this.currentQuantity));if(this.currentQuantity>=this.requiredQuantity){this.container.classList.remove('border-item-invalid');}
else{this.container.classList.add('border-item-invalid');}}
onMouseover(){this.setText(numberWithCommas(this.currentQuantity));}
onMouseleave(){this.setText(formatNumber(this.currentQuantity));}
getTooltipContent(){return `<div class="text-center">${this.getName()}</div>`;}}
class ItemCurrentIcon extends QtyCurrentIcon{constructor(parent,item,requiredQty,quickBuy=false,size=48,altMedia=false){super(parent,requiredQty,size);this.item=item;this.init();this.setImage(altMedia?item.altMedia:item.media);const purchase=game.shop.getQuickBuyPurchase(item);if(quickBuy&&purchase!==undefined){const autoBuyIcon=createElement('img',{classList:['skill-icon-xxs','is-in-shop'],attributes:[['src',InfoIcon.media.shopIcon]],});this.container.append(autoBuyIcon);this.container.onclick=()=>game.shop.quickBuyItemOnClick(purchase);}}
getCurrentQty(){return game.bank.getQty(this.item);}
getName(){return this.item.name;}}
class GPCurrentIcon extends QtyCurrentIcon{constructor(parent,requiredQty,size=48){super(parent,requiredQty,size);this.setImage(InfoIcon.media.gp);this.init();}
getCurrentQty(){return game.gp.amount;}
getName(){return getLangString('MENU_TEXT','GP');}}
class SCCurrentIcon extends QtyCurrentIcon{constructor(parent,requiredQty,size=48){super(parent,requiredQty,size);this.setImage(InfoIcon.media.slayerCoins);this.init();}
getCurrentQty(){return game.slayerCoins.amount;}
getName(){return getLangString('MENU_TEXT','SLAYER_COINS');}}