"use strict";class IconBox extends ContainedComponent{constructor(parent,smallName,containerClasses=[],iconContClasses=[]){super();this.icons=[];this.container=createElement('div',{classList:containerClasses});const nameHeader=createElement('h5',{classList:['font-w600','font-size-sm','mb-1','text-center'],parent:this.container,});if(smallName){this.name=createElement('small',{parent:nameHeader});}
else{this.name=nameHeader;}
this.iconContainer=createElement('div',{classList:['row','justify-content-center',...iconContClasses],parent:this.container,});this.dash=this.iconContainer.appendChild(createElement('span',{text:'-'}));parent.append(this.container);}
destroyIcons(){this.icons.forEach((icon)=>{icon.destroy();});this.icons=[];}
addIcon(icon){this.icons.push(icon);}
setName(name){this.name.textContent=name;}
localize(){this.icons.forEach((icon)=>icon.localize());}
setSelected(){this.icons.forEach((icon)=>icon.show());hideElement(this.dash);}
setUnselected(){this.icons.forEach((icon)=>icon.hide());showElement(this.dash);}}
class RequiresBox extends IconBox{constructor(parent,smallName,containerClasses=[],iconContClasses=[],size=48,titleLangID='REQUIRES'){super(parent,smallName,containerClasses,iconContClasses);this.size=size;this.titleLangID=titleLangID;this.localize();}
localize(){super.localize();this.setName(getLangString('MENU_TEXT',this.titleLangID));}
setItems(items,gp=0,sc=0,altMedia=false){this.destroyIcons();items.forEach(({item,quantity})=>{const reqIcon=new ItemQtyIcon(this.iconContainer,true,quantity,this.size);reqIcon.setItem(item,quantity,altMedia);this.addIcon(reqIcon);});if(gp>0)
this.addIcon(new GPQtyIcon(this.iconContainer,gp,this.size));if(sc>0)
this.addIcon(new SCQtyIcon(this.iconContainer,sc,this.size));}
setItemsFromRecipe(recipe,altMedia=false){this.destroyIcons();recipe.itemCosts.forEach(({item,quantity})=>{const icon=new ItemQtyIcon(this.iconContainer,true,quantity,this.size);icon.setItem(item,quantity,altMedia);this.addIcon(icon);});if(recipe.gpCost>0)
this.addIcon(new GPQtyIcon(this.iconContainer,recipe.gpCost,this.size));if(recipe.scCost>0)
this.addIcon(new SCQtyIcon(this.iconContainer,recipe.scCost,this.size));}}
class HavesBox extends IconBox{constructor(parent,smallName,containerClasses=[],iconContClasses=[],size=48,titleLangID='YOU_HAVE'){super(parent,smallName,containerClasses,iconContClasses);this.size=size;this.titleLangID=titleLangID;this.localize();}
localize(){super.localize();this.setName(getLangString('MENU_TEXT',this.titleLangID));}
updateQuantities(){this.icons.forEach((icon)=>icon.updateQuantity());}
setItems(items,gp=0,sc=0,altMedia=false){this.destroyIcons();items.forEach(({item,quantity})=>{const reqIcon=new ItemCurrentIcon(this.iconContainer,item,quantity,true,this.size,altMedia);this.addIcon(reqIcon);});if(gp>0)
this.addIcon(new GPCurrentIcon(this.iconContainer,gp,this.size));if(sc>0)
this.addIcon(new SCCurrentIcon(this.iconContainer,sc,this.size));}
setItemsFromRecipe(recipe,altMedia=false){this.destroyIcons();recipe.itemCosts.forEach(({item,quantity})=>{this.addIcon(new ItemCurrentIcon(this.iconContainer,item,quantity,true,this.size,altMedia));});if(recipe.gpCost>0)
this.addIcon(new GPCurrentIcon(this.iconContainer,recipe.gpCost,this.size));if(recipe.scCost>0)
this.addIcon(new SCCurrentIcon(this.iconContainer,recipe.scCost,this.size));}}
class ProducesBox extends IconBox{constructor(parent,smallName,containerClasses=[],iconContClasses=[]){super(parent,smallName,containerClasses,iconContClasses);this.size=48;this.localize();}
setItems(items,gp=0,sc=0){this.destroyIcons();items.forEach(({item,quantity})=>{const reqIcon=new ItemQtyIcon(this.iconContainer,true,quantity,this.size);reqIcon.setItem(item,quantity);this.addIcon(reqIcon);});if(gp>0)
this.addIcon(new GPQtyIcon(this.iconContainer,gp,this.size));if(sc>0)
this.addIcon(new SCQtyIcon(this.iconContainer,sc,this.size));}
localize(){super.localize();this.setName(getLangString('MENU_TEXT','PRODUCES'));}}
class GrantsBox extends IconBox{constructor(parent,smallName,containerClasses=[],size=48,iconContClasses=[]){super(parent,smallName,containerClasses,iconContClasses);this.xpIcon=new XPIcon(this.iconContainer,69,size);this.masteryXPIcon=new MasteryXPIcon(this.iconContainer,69,size);this.masteryPoolIcon=new MasteryPoolIcon(this.iconContainer,69,size);this.addIcon(this.xpIcon);this.addIcon(this.masteryXPIcon);this.addIcon(this.masteryPoolIcon);this.setUnselected();this.localize();}
localize(){super.localize();this.setName(getLangString('MENU_TEXT','GRANTS'));}
updateGrants(xp,masteryXP,poolXP){this.xpIcon.setXP(xp);this.masteryXPIcon.setXP(masteryXP);this.masteryPoolIcon.setXP(poolXP);}
hideMastery(){this.masteryXPIcon.hide();this.masteryPoolIcon.hide();}}
class CookingBonusBox extends IconBox{constructor(parent,smallName,containerClasses=[]){super(parent,smallName,containerClasses);this.preserve=new PreservationIcon(this.iconContainer,0);this.double=new DoublingIcon(this.iconContainer,0);this.perfect=new PerfectCookIcon(this.iconContainer,0);this.success=new CookingSuccessIcon(this.iconContainer,0);this.addIcon(this.preserve);this.addIcon(this.double);this.addIcon(this.perfect);this.addIcon(this.success);this.setUnselected();this.localize();}
setChances(preserve,double,perfect,success){this.preserve.setChance(preserve);this.double.setChance(double);this.perfect.setChance(perfect);this.success.setChance(success);}
localize(){super.localize();this.setName(getLangString('MENU_TEXT','BONUSES'));}}