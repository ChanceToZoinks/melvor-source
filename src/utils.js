"use strict";function rollPercentage(chance){return chance>Math.random()*100;}
function rollInteger(minValue,maxValue){return Math.floor(Math.random()*(maxValue-minValue+1))+minValue;}
function rollForOffItem(baseChance){return rollPercentage(baseChance*(1+game.modifiers.increasedOffItemChance/100));}
function generateGaussianNumber($mean,$stdDev){const $randNumA=Math.random();const $randNumB=Math.random();const $randNumNorm=Math.sqrt(-2.0*Math.log($randNumA))*Math.cos(2.0*3.141592653589793238462643383279502884197169399375*$randNumB);return $mean+$stdDev*$randNumNorm;}
function getMean(numActions,probability){return numActions*probability;}
function getStdDev(numActions,probability){return Math.sqrt(numActions*probability*(1-probability));}
function applyModifier(baseStat,modifier,type=0){switch(type){case 0:return Math.floor(baseStat*(1+modifier/100));case 1:return baseStat+modifier;case 2:return Math.floor(baseStat*(1-modifier/100));case 3:return Math.floor(baseStat*(modifier/100));default:return baseStat;}}
function binomial_distribution(n,p,epsilon=0.00001){const marginals=[];let sumOfMarginals=0;let marginal=Math.pow(1-p,n);const odds=p/(1-p);sumOfMarginals+=marginal;marginals.push(marginal);for(let k=1;k<=n;++k){marginal*=odds;marginal*=(n-k+1)/k;sumOfMarginals+=marginal;marginals.push(marginal);if(1-sumOfMarginals<=epsilon){break;}}
return marginals.map((x)=>x/sumOfMarginals);}
function sample_from_binomial(numberTrials,chance){let randNumA=Math.random();const binomial=binomial_distribution(numberTrials,chance);for(const[index,probabilityMass]of binomial.entries()){randNumA-=probabilityMass;if(randNumA<0){return index;}}
return binomial.length;}
function linearFunction(m,b,x){return m*x+b;}
function cappedLinearFunction(m,b,cap,x){return Math.min(linearFunction(m,b,x),cap);}
function deleteKeysFromObject(object){Object.keys(object).forEach((el)=>{delete object[el];});}
function getRandomArrayElement(array){return array[rollInteger(0,array.length-1)];}
function getExclusiveRandomArrayElements(array,numElements){if(numElements>array.length)
throw new Error('Cannot get more elements than length of array');const arrayCopy=[...array];const selection=new Set();for(let i=0;i<numElements;i++){const randIndex=rollInteger(0,arrayCopy.length-1);selection.add(arrayCopy[randIndex]);arrayCopy.splice(randIndex,1);}
return selection;}
const arrSum=(arr)=>arr.reduce((a,b)=>a+b,0);function getAverage(elements=[]){return arrSum(elements)/elements.length;}
function clampValue(value,min,max){return Math.min(Math.max(value,min),max);}
function setToUppercase(string){return string.charAt(0).toUpperCase()+string.slice(1);}
function setToLowercase(string){return string.charAt(0).toLowerCase()+string.slice(1);}
function replaceAll(str,find,replace){return str.replace(new RegExp(find,'g'),replace);}
function isAnySetMemberInSet(setA,setB){for(const member of setA){if(setB.has(member))
return true;}
return false;}
let updateTooltipsTimer=-1;function updateTooltips(){clearTimeout(updateTooltipsTimer);updateTooltipsTimer=setTimeout(function(){$('[data-toggle="tooltip"]').tooltip({sanitize:false,});$('[data-toggle="popover"]').popover({sanitize:false,});},250);}
function getSortableDelayOnTouch(){return location.origin!=='https://ios.melvoridle.com'&&location.origin!=='https://android.melvoridle.com';}
function roundToTickInterval(interval){return Math.floor(interval/TICK_INTERVAL)*TICK_INTERVAL;}
const joinList=(seperator)=>(list)=>{let joined='';if(list.length>1){joined+=`${list.slice(0,-1).join(seperator)} and `;}
joined+=list[list.length-1];return joined;};function joinAsList(list){const listFormatter=new Intl.ListFormat(new Intl.Locale(setLang),{style:'long',type:'conjunction'});return listFormatter.format(list);}
function joinAsLineBreakList(list){return list.join('<br>');}
const joinAsSuperList=joinList(';');function pluralS(number){return number>1?'s':'';}
function checkMediaQuery(mediaQuery){const mq=window.matchMedia(mediaQuery);if(mq.matches)
return true;return false;}
function createElement(tagName,options={}){const elem=document.createElement(tagName);if(options.className!==undefined){elem.className=options.className;}
if(options.classList!==undefined){elem.classList.add(...options.classList);}
if(options.text!==undefined)
elem.textContent=options.text;if(options.parent!==undefined)
options.parent.appendChild(elem);if(options.children!==undefined)
elem.append(...options.children);if(options.attributes!==undefined)
options.attributes.forEach(([name,value])=>elem.setAttribute(name,value));if(options.id!==undefined)
elem.id=options.id;return elem;}
function hideElement(elem){elem.classList.add('d-none');}
function showElement(elem){elem.classList.remove('d-none');}
function toggleDangerSuccess(elem,success){if(success)
elem.classList.replace('text-danger','text-success');else
elem.classList.replace('text-success','text-danger');}
function removeElementID(elem){elem.removeAttribute('id');}
const levelUnlockSum=(skill)=>(previous,current)=>{if(skill.level>=current.level)
previous++;return previous;};function fireBottomToast(text,duration=2000){Toastify({text,duration,gravity:'bottom',position:'center',backgroundColor:'transparent',stopOnFocus:false,}).showToast();}
function fireTopToast(text,duration=2000){Toastify({text,duration,gravity:'top',position:'center',backgroundColor:'transparent',stopOnFocus:false,}).showToast();}
function imageNotify(media,message,messageTheme='success'){fireBottomToast(`<div class="text-center"><img class="notification-img" src="${media}"><span class="badge badge-${messageTheme}">${message}</span></div>`);}
let itemNotifyTimer=-1;let itemNotifyToProcess=[];function itemNotify(item,quantity){if(game.settings.showItemNotifications){clearTimeout(itemNotifyTimer);itemNotifyToProcess.push({item,quantity});itemNotifyTimer=setTimeout(function(){for(let i=0;i<itemNotifyToProcess.length;i++)
processItemNotify(itemNotifyToProcess[i].item,itemNotifyToProcess[i].quantity);itemNotifyToProcess=[];},50);}}
function processItemNotify(item,quantity){let access='';if(game.settings.enableAccessibility)
access=` ${item.name}`;let qtyInBank='';if(game.settings.showQuantityInItemNotifications)
qtyInBank=" <span class='ml-2'>("+numberWithCommas(game.bank.getQty(item))+')</span> ';imageNotify(item.media,`+${numberWithCommas(quantity)}${qtyInBank}${access}`,'success');}
function stunNotify(damage){fireBottomToast(`<div class="text-center"><img class="notification-img" src="${cdnMedia("assets/media/skills/thieving/thieving.svg")}"><span class="badge badge-warning">${getLangString('TOASTS','STUNNED')} </span> <span class="badge badge-danger"> ${templateLangString('TOASTS','MINUS_HP',{damage:`${damage}`,})}</span></div>`);}
function bankFullNotify(){imageNotify(cdnMedia('assets/media/main/bank_header.svg'),getLangString('TOASTS','FULL_BANK'),'danger');}
function levelUpNotify(skill){fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
  <div class="media d-flex align-items-center push">
    <div class="mr-2"><img class="skill-icon-md" src="${skill.media}"></div>
    <div class="media-body text-left">
      <div class="font-w700 font-size-lg text-success">${getLangString('COMPLETION','CONGRATS')}</div>
      <div class="font-size-sm">
        ${templateLangString('TOASTS','SKILL_LEVEL_UP',{skillName:skill.name,level:`${skill.level}`})}
      </div>
    </div>
  </div>
</div>`,5000);}
function level99Notify(skill){imageNotify(skill.media,templateLangString('TOASTS','SKILL_LEVEL_UP',{skillName:skill.name,level:`${skill.level}`,}),'success');}
function notifyPreserve(skill){if(game.settings.showItemPreservationNotifications)
notifyPlayer(skill,getLangString('MISC_STRING','2'),'success');}
function notifyPlayer(skill,message,messageTheme='success'){let img='';if(skill===-1)
img=CDNDIR+'assets/media/main/xmas_present.svg';else
img=skill.media;imageNotify(img,message,messageTheme);}
function notifyItemCharges(item){imageNotify(item.media,getLangString('TOASTS','GLOVES_DEGRADED'),'danger');}
function tutorialNotify(){fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
  <div class="media d-flex align-items-center push">
    <div class="mr-2"><img class="skill-icon-md" src="${cdnMedia('assets/media/main/tutorial_island.svg')}"></div>
    <div class="media-body text-left">
      <div class="font-w700 font-size-lg text-success"><lang-string lang-cat="TUTORIAL" lang-id="MISC_3"></lang-string></div>
      <div class="font-size-sm">
        <lang-string lang-cat="TUTORIAL" lang-id="MISC_4"></lang-string>
      </div>
    </div>
  </div>
</div>`,5000);}
function currencyNotify(media,amount){imageNotify(media,`${amount>=0?'+':''}${formatNumber(amount)}`,amount>=0?'success':'danger');}
function notifyMasteryLevelUp(action,newLevel){fireBottomToast(`<div class="text-center"><img class="notification-img" src="${action.media}"><img class="skill-icon-xs" src="${cdnMedia("assets/media/main/mastery_header.svg")}"><span class="badge badge-success">${newLevel}</span></div>`);}
function notify99ItemMastery(action){fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
  <div class="media d-flex align-items-center push">
    <div class="mr-2"><img class="skill-icon-md" src="${cdnMedia("assets/media/main/mastery_header.svg")}"></div>
    <div class="media-body text-left">
      <div class="font-w700 font-size-lg text-success">${getLangString('COMPLETION','CONGRATS')}</div>
      <div class="font-size-sm">
        <img class="skill-icon-xs mr-1" src="${action.media}">${templateLangString('COMPLETION','MASTERY_LEVEL_99',{itemName:action.name,})}
      </div>
    </div>
  </div>
</div>`,5000);}
function notifyCompletionYay(){let html=`<h5 class="font-w600 text-success">${getLangString('MENU_TEXT','ACHIEVED_COMPLETION')}</h5><h5 class="font-w400 font-size-sm">${getLangString('MENU_TEXT','COMPLETION_MESSAGE')}</h5><h5 class="font-w400 font-size-sm">${getLangString('MENU_TEXT','COMPLETION_BUY_CAPE')}</h5>`;const stat=game.stats.General.get(GeneralStats.AccountCreationDate);if(stat===0)
return;html+=`<h5 class="font-w400 font-size-sm">This achievement took you ${formatAsTimePeriod(new Date().getTime()-stat)}</h5>`;addModalToQueue({title:getLangString('COMPLETION','CONGRATS'),html:html,imageUrl:CDNDIR+'assets/media/main/completion_log.svg',imageWidth:128,imageHeight:128,imageAlt:getLangString('MENU_TEXT','100_PERCENT_COMPLETION'),});showFireworks();}
function notifyCompletionTotH(){let html=`<h5 class="font-w600 text-success">${getLangString('MENU_TEXT','ACHIEVED_COMPLETION_TOTH')}</h5><h5 class="font-w400 font-size-sm">${getLangString('MENU_TEXT','COMPLETION_MESSAGE_TOTH')}</h5>`;const stat=game.stats.General.get(GeneralStats.AccountCreationDate);if(stat===0)
return;html+=`<h5 class="font-w400 font-size-sm">This achievement took you ${formatAsTimePeriod(new Date().getTime()-stat)}</h5>`;addModalToQueue({title:getLangString('COMPLETION','CONGRATS'),html:html,imageUrl:CDNDIR+'assets/media/main/completion_log.svg',imageWidth:128,imageHeight:128,imageAlt:getLangString('MENU_TEXT','100_PERCENT_COMPLETION'),});showFireworks();}
function notifyCompletionEverything(){let html=`<h5 class="font-w600 text-success">${getLangString('MENU_TEXT','ACHIEVED_COMPLETION_ALL')}</h5><h5 class="font-w400 font-size-sm">${getLangString('MENU_TEXT','COMPLETION_MESSAGE_ALL')}</h5><h5 class="font-w400 font-size-sm">${getLangString('MENU_TEXT','COMPLETION_BUY_CAPE_TOTH')}</h5>`;const stat=game.stats.General.get(GeneralStats.AccountCreationDate);if(stat===0)
return;html+=`<h5 class="font-w400 font-size-sm">This achievement took you ${formatAsTimePeriod(new Date().getTime()-stat)}</h5>`;addModalToQueue({title:getLangString('COMPLETION','CONGRATS'),html:html,imageUrl:CDNDIR+'assets/media/main/completion_log.svg',imageWidth:128,imageHeight:128,imageAlt:getLangString('MENU_TEXT','100_PERCENT_COMPLETION'),});showFireworks();}
let pyroInterval=-1;let forcePyro=false;function showFireworks(force=false){forcePyro=force;const pyro=`<div class="pyro">
					<div class="before"></div>
					<div class="after"></div>
				</div>`;$('body').append(pyro);startPyroInterval();}
function removePyro(){$('.pyro').remove();}
function startPyroInterval(){clearInterval(pyroInterval);pyroInterval=setInterval(function(){if(!Swal.isVisible()&&!forcePyro){removePyro();clearInterval(pyroInterval);}},1000);}
class NotificationQueue{constructor(maxNotifiactions){this.maxNotifiactions=maxNotifiactions;this.queue=[];}
notify(){this.queue.forEach((notification)=>{switch(notification.type){case 'Item':itemNotify(...notification.args);break;case 'Stun':stunNotify(...notification.args);break;case 'BankFull':bankFullNotify(...notification.args);break;case 'LevelUp':levelUpNotify(...notification.args);break;case 'Player':notifyPlayer(...notification.args);break;case 'ItemCharges':notifyItemCharges(...notification.args);break;case 'Mastery':notifyMasteryLevelUp(...notification.args);break;case 'Mastery99':notify99ItemMastery(...notification.args);break;case 'Preserve':notifyPreserve(...notification.args);break;case 'Currency':currencyNotify(...notification.args);break;case 'TutorialTask':tutorialNotify();break;}});this.queue=[];}
add(notification){if(this.queue.length===this.maxNotifiactions){this.queue.splice(0,1);}
this.queue.push(notification);}
clear(){this.queue=[];}}
class ExperienceCalculator{constructor(){this.estConstA=Math.pow(2,1/7);this.estConstB=(Math.pow(2,1/7)-1)/75;this.table=[0];this.xpSum=0;}
equate(level){return Math.floor(level+300*Math.pow(2,level/7));}
level_to_xp(level){if(this.table.length>=level)
return this.table[level-1];else{for(let i=this.table.length;i<level;i++){this.xpSum+=this.equate(i);this.table.push(Math.floor(this.xpSum/4));}
return this.table[level-1];}}
xp_to_level(xp,level=1){while(this.level_to_xp(level)<xp)
level++;if(xp<=0)
level=2;return level;}
xpToLevel(xp){if(xp<=0)
return 1;let levelEstimate=Math.floor(7*Math.log2(this.estConstA+this.estConstB*xp))-1;if(xp>this.level_to_xp(levelEstimate+1)){levelEstimate++;}
return levelEstimate;}}
const exp=new ExperienceCalculator();function getItemBaseStatsBreakdown(item){let html='';item.equipmentStats.forEach((statPair)=>{const isPositive=statPair.value>0;const statDesc=Equipment.getEquipStatDescription(statPair.key,statPair.value);html+=`<h5 class="font-size-sm ${isPositive?'text-success font-w400':'text-danger'} mb-0"><small>${statDesc}</small></h5>`;});return html;}
function lockedSkillAlert(skill,messageTemplate){SwalLocale.fire({icon:'error',title:getLangString('MENU_TEXT','SKILL_LOCKED'),html:`<span class='text-dark'>${templateLangString('MENU_TEXT',messageTemplate,{skillName:skill.name,})}</span>`,});}
function showStunnedNotification(){if(!game.settings.showCombatStunNotifications)
return;fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
  <div class="media d-flex align-items-center push">
    <div class="mr-2"><img class="skill-icon-md" src="${CDNDIR}assets/media/main/stunned.svg"></div>
    <div class="media-body text-left">
      <div class="font-w700 font-size-lg text-danger">${getLangString('TOASTS','STUNNED')}</div>
      <div class="font-size-sm">
        The Enemy deals <span class="font-w600 text-warning">30%</span> extra Damage while you are stunned.
      </div>
      <div class="font-size-sm">
        <small>(You can disable this notification in Settings)</small>
      </div>
    </div>
  </div>
</div>`,5000);}
function showSleepNotification(){if(!game.settings.showCombatSleepNotifications)
return;fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
  <div class="media d-flex align-items-center push">
    <div class="mr-2"><img class="skill-icon-md" src="${CDNDIR}assets/media/main/sleep.svg"></div>
    <div class="media-body text-left">
      <div class="font-w700 font-size-lg text-danger">${getLangString('TOASTS','ASLEEP')}</div>
      <div class="font-size-sm">
        The Enemy deals <span class="font-w600 text-warning">20%</span> extra Damage while you are sleeping.
      </div>
      <div class="font-size-sm">
        <small>(You can disable this notification in Settings)</small>
      </div>
    </div>
  </div>
</div>`,5000);}
function cdnMedia(media){if(useCDN)
return `${CDNDIR}${media}`;else
return media;}
function compareNameValuePairs(currentPairs,oldPairs){const curPairMap=convertNameValuePairToMap(currentPairs);const oldPairMap=convertNameValuePairToMap(oldPairs);curPairMap.forEach((curVal,name)=>{const oldVal=oldPairMap.get(name);if(oldVal===undefined)
console.log(`Current has ${name}, but Old does not.`);else if(curVal!==oldVal)
console.log(`Value of ${name} is different. Current: ${curVal} Old: ${oldVal}.`);});oldPairMap.forEach((oldVal,name)=>{const curVal=curPairMap.get(name);if(curVal===undefined)
console.log(`Old has ${name}, but Current does not.`);});}
function convertNameValuePairToMap(pairs){const map=new Map();pairs.forEach((pair)=>{if(map.get(pair.name)!==undefined)
console.warn(`Duplicate pair found: ${pair.name}`);map.set(pair.name,pair.value);});return map;}
function templateString(string,templateData){return string.replace(/\${(\w+)}/g,(match,p1)=>{var _a;return(_a=templateData[p1])!==null&&_a!==void 0?_a:match;});}
function templateLangString(category,identifier,templateData){return templateString(getLangString(category,identifier),templateData);}
function milliToSeconds(ms){return ms/1000;}
function multiplyByNumberMultiplier(value){return value*numberMultiplier;}
function divideByNumberMultiplier(value){return value/numberMultiplier;}
function animateProgress(div,interval,stayFull=true){resetProgressAnimation(div);interval=interval/1000;$(`#${div}`).css('-webkit-animation','progressBar '+interval+'s linear');if(stayFull)
$(`#${div}`).css('-webkit-animation-fill-mode','both');}
function resetProgressAnimation(div){const el=document.getElementById(div);el.style.animation='none';el.offsetHeight;$(`#${div}`).css('-webkit-animation-fill-mode','none');$(`#${div}`).css('width','0%');}
function getUnlockedAtNodes(skill,level){const unlockText=templateLangString('MENU_TEXT','UNLOCKED_AT',{skillImage:'$$$',level:`${level}`,});const splitText=unlockText.split('$$$');const skillImage=createElement('img',{classList:['skill-icon-xs','mr-1']});skillImage.src=skill.media;return[document.createTextNode(splitText[0]),skillImage,document.createTextNode(splitText[1])];}
function templateLangStringWithNodes(category,id,nodeData,textData,clone=true){return templateStringWithNodes(getLangString(category,id),nodeData,textData,clone);}
function templateStringWithNodes(string,nodeData,textData,clone=true){let nodes=[];nodes.push(templateString(string,textData));Object.entries(nodeData).forEach(([fillIn,imageNode])=>{const newNodes=[];nodes.forEach((node)=>{if(typeof node==='string'){const portions=node.split(`\${${fillIn}}`);if(portions.length>0){portions.forEach((stringPort,i)=>{newNodes.push(stringPort);if(i!==portions.length-1)
newNodes.push(clone?imageNode.cloneNode(true):imageNode);});}
else{newNodes.push(node);}}
else{newNodes.push(node);}});nodes=newNodes;});return nodes;}
const formatAsOrdinal=(()=>{const pr=new Intl.PluralRules('en-US',{type:'ordinal'});const suffixes=new Map([['one','st'],['two','nd'],['few','rd'],['other','th'],]);return(value)=>{const rule=pr.select(value);const suffix=suffixes.get(rule);return `${value}${suffix}`;};})();function numberWithCommas(number,ignoreSetting=false){if(typeof number==='string'){number=parseFloat(number);}
if(typeof number==='number'){if(ignoreSetting||!game.settings.hideThousandsSeperator){try{return number.toLocaleString(setLang);}
catch(e){return number.toLocaleString();}}
else{return `${number}`;}}
else{console.warn('Tried to format non-number.');return number;}}
function formatNumber(number){let postfix='';switch(game.settings.formatNumberSetting){case 0:if(number>=100000&&number<10000000){number=Math.floor(number/1000);postfix=getLangString('NUM','K');}
else if(number>=10000000&&number<10000000000){number=Math.floor(number/1000000);postfix=getLangString('NUM','M');}
else if(number>=10000000000){number=Math.floor(number/1000000000);postfix=getLangString('NUM','B');}
break;case 1:if(number>=100000&&number<1000000){number=Math.floor(number/1000);postfix=getLangString('NUM','K');}
else if(number>=1000000&&number<1000000000){number=Math.floor(number/1000000);postfix=getLangString('NUM','M');}
else if(number>=1000000000){number=Math.floor(number/1000000000);postfix=getLangString('NUM','B');}
break;}
return numberWithCommas(number)+postfix;}
function formatPercent(percent,digits){try{return(percent/100).toLocaleString(setLang,{style:'percent',minimumFractionDigits:digits,maximumFractionDigits:digits,});}
catch(_a){if(digits!==undefined){return `${percent.toFixed(digits)}%`;}
else{return `${percent}%`;}}}
function getMSAsTime(time){const msPerUnit={years:365*24*60*60*1000,days:24*60*60*1000,hours:60*60*1000,minutes:60*1000,seconds:1000,milliseconds:1,};const years=Math.floor(time/msPerUnit.years);const days=Math.floor((time%msPerUnit.years)/msPerUnit.days);const hours=Math.floor((time%msPerUnit.days)/msPerUnit.hours);const minutes=Math.floor((time%msPerUnit.hours)/msPerUnit.minutes);const seconds=Math.floor((time%msPerUnit.minutes)/msPerUnit.seconds);const milliseconds=Math.floor((time%msPerUnit.seconds)/msPerUnit.milliseconds);return{years,days,hours,minutes,seconds,milliseconds,};}
function formatAsTimePeriod(timeInMs){const time=getMSAsTime(timeInMs);const timePeriods=[];if(time.years>0){if(time.years===1){timePeriods.push(getLangString('TIME_UNIT','year'));}
else{timePeriods.push(templateLangString('TIME_UNIT','years',{years:`${time.years}`}));}}
if(time.days>0){if(time.days===1){timePeriods.push(getLangString('TIME_UNIT','day'));}
else{timePeriods.push(templateLangString('TIME_UNIT','days',{days:`${time.days}`}));}}
if(time.hours>0){if(time.hours===1){timePeriods.push(getLangString('TIME_UNIT','hour'));}
else{timePeriods.push(templateLangString('TIME_UNIT','hours',{hours:`${time.hours}`}));}}
if(time.minutes>0){if(time.minutes===1){timePeriods.push(getLangString('TIME_UNIT','minute'));}
else{timePeriods.push(templateLangString('TIME_UNIT','minutes',{minutes:`${time.minutes}`}));}}
if(time.seconds===1){timePeriods.push(getLangString('TIME_UNIT','second'));}
else{timePeriods.push(templateLangString('TIME_UNIT','seconds',{seconds:`${time.seconds}`}));}
const listFormat=new Intl.ListFormat(new Intl.Locale(setLang),{style:'long',type:'unit'});return listFormat.format(timePeriods.map((part)=>part.replace(' ','\xa0')));}
function formatAsShorthandTimePeriod(timeInMs){const time=getMSAsTime(timeInMs);const timePeriods=[];if(time.years>0){timePeriods.push(`${time.years}y`);}
if(time.days>0){timePeriods.push(`${time.days}d`);}
timePeriods.push(`${time.hours}h`);timePeriods.push(`${time.minutes}m`);timePeriods.push(`${time.seconds}s`);const listFormat=new Intl.ListFormat(new Intl.Locale(setLang),{style:'narrow',type:'unit'});return listFormat.format(timePeriods.map((part)=>part.replace(' ','\xa0')));}
function successSpan(content){return `<span class="text-success">${content}</span>`;}
function getTemplateElement(templateID){const template=document.getElementById(templateID);if(template===null||!(template instanceof HTMLTemplateElement))
throw new Error('Template does not exist');return template;}
function getTemplateNode(templateID){const templateContent=getTemplateElement(templateID).content;return templateContent.cloneNode(true);}
function getAnyElementFromFragment(fragment,elementID){const elem=fragment.getElementById(elementID);if(elem===null)
throw new Error(`Fragment does not contain element with id: ${elementID}`);elem.removeAttribute('id');return elem;}
function getElementFromFragment(fragment,elementID,tagName){const elem=fragment.getElementById(elementID);if(elem===null)
throw new Error(`Fragment does not contain element with id: ${elementID}`);if(elem.tagName!==tagName.toUpperCase())
throw new Error('Element does not have the correct tag name');elem.removeAttribute('id');return elem;}
function formatFixed(num,digits){try{return num.toLocaleString(setLang,{minimumFractionDigits:digits,maximumFractionDigits:digits,});}
catch(_a){return num.toFixed(digits);}}
function switchToCategory(tabs){return(categoryToShow)=>{tabs.forEach((tab,category)=>{if(category===categoryToShow){tab.show();if(nativeManager.isMobile){try{window.scrollTo({top:tab.container.offsetTop,behavior:'smooth'});}
catch(e){console.warn('Could not scroll to tab element. Error: '+e);}}}
else
tab.hide();});};}
function downloadTextFile(fileName,fileText,fileType='text/plain'){const file=new Blob([fileText],{type:fileType});const link=document.createElement('a');const url=URL.createObjectURL(file);link.href=url;link.download=fileName;document.body.appendChild(link);link.click();setTimeout(function(){document.body.removeChild(link);window.URL.revokeObjectURL(url);},0);}
function removeFromArray(original,remove){return original.filter((value)=>!remove.includes(value));}
function mapOrder(array,order,key){const orderMap=new Map(order.map((val,i)=>[val,i]));array.sort(sortByOrder(order,key));return array;}
function sortByOrder(order,key){const orderMap=new Map(order.map((val,i)=>[val,i]));return(a,b)=>{return(orderMap.get(a[key])||0)-(orderMap.get(b[key])||0);};}
function logConsole(message){if(DEBUGENABLED)
console.log(message);}
const unregisteredMessage=(type)=>`Error converting old save data. ${type} is not registered.`;class UnregisteredConstructionError extends Error{constructor(object,unregisteredName,id){super(`Error constructing ${object.constructor.name}. ${unregisteredName} with id: ${id} is not registered.`);this.name=this.constructor.name;}}
class UnregisteredDataModError extends Error{constructor(unregisteredName,id){super(`Error applying data modification to ${unregisteredName} with id: ${id}. Object is not registered.`);this.name=this.constructor.name;}}
class UnregisteredApplyDataModError extends Error{constructor(objectBeingModded,unregisteredName,unregisteredID){super(`Error applying data modification to ${objectBeingModded.constructor.name} with id: ${objectBeingModded.id}. ${unregisteredName} with id: ${unregisteredID} is not registered.`);this.name=this.constructor.name;}}
const progressBarAttributes=[['role','progressbar'],['style','width:0%;'],['aria-valuenow','0'],['aria-valuemin','0'],['aria-valuemax','100'],];class DropTable{constructor(game,data){this.totalWeight=0;this.drops=[];this.registerDrops(game,data);}
get size(){return this.drops.length;}
get weight(){return this.totalWeight;}
get sortedDropsArray(){return[...this.drops].sort((a,b)=>b.weight-a.weight);}
get averageDropValue(){return(this.drops.reduce((totalValue,{item,weight,minQuantity,maxQuantity})=>{return totalValue+(weight*item.sellsFor*(minQuantity+maxQuantity))/2;},0)/this.totalWeight);}
registerDrops(game,data){data.forEach((data)=>{const item=game.items.getObjectByID(data.itemID);if(item===undefined)
throw new Error(`Error registering drop table data, item with ID: ${data.itemID} is not registered`);this.totalWeight+=data.weight;this.drops.push({item,minQuantity:data.minQuantity,maxQuantity:data.maxQuantity,weight:data.weight,});});}
getDrop(){const dropRoll=Math.floor(Math.random()*this.totalWeight);let itemWeight=0;const lootIndex=this.drops.findIndex((drop)=>{itemWeight+=drop.weight;return dropRoll<itemWeight;});const drop=this.drops[lootIndex];const quantity=rollInteger(drop.minQuantity,drop.maxQuantity);return{item:drop.item,quantity,};}}
class SparseNumericMap{constructor(){this.data=new Map();}
get size(){return this.data.size;}
has(key){return this.data.has(key);}
get(key){var _a;return(_a=this.data.get(key))!==null&&_a!==void 0?_a:0;}
set(key,value){if(value===0)
this.data.delete(key);else
this.data.set(key,value);}
add(key,amount){const newVal=this.get(key)+amount;this.set(key,newVal);}
inc(key){this.add(key,1);}
sub(key,amount){this.add(key,-amount);}
dec(key){this.sub(key,1);}
mult(key,multiplier){const newVal=this.get(key)*multiplier;this.set(key,newVal);}
div(key,divisor){const newVal=this.get(key)/divisor;this.set(key,newVal);}
getSum(){let total=0;this.data.forEach((value)=>{total+=value;});return total;}
getSumOfKeys(keys){return keys.reduce((prev,key)=>{return prev+this.get(key);},0);}
clear(){this.data.clear();}
forEach(callbackfn){this.data.forEach(callbackfn);}}
function escapeRegExp(string){return string.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function generateComponentClass(templateID,tagName,className){const fragment=getTemplateElement(templateID).content;const idElements=fragment.querySelectorAll('[id]');const props=[];const getters=[];idElements.forEach((element)=>{const id=element.id;const propertyName=id.split('-').map((idPart,i)=>{if(i===0)
return idPart;return setToUppercase(idPart);}).join('');const tagName=element.tagName.toLowerCase();props.push(`  private ${propertyName}: ${element.constructor.name};`);getters.push(`    this.${propertyName} = getElementFromFragment(this._content, '${id}','${tagName}');`);});return `class ${className} extends HTMLElement {
  private _content: DocumentFragment;
${props.join('\n')}
  public constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode('${templateID}'));
${getters.join('\n')}
  }
  public connectedCallback() {
    this.appendChild(this._content);
  }
  // TODO_C: Implement custom rendering functionality
}
window.customElements.define('${tagName}', ${className});`;}
function generateModifierDataSchema(){const combatSchema={type:'object',properties:{},};const allCombatKeys=new Set();Object.entries(new CombatModifiers()).forEach(([key])=>{combatSchema.properties[key]={type:'number',minimum:0,description:modifierData[key].description,};allCombatKeys.add(key);});const standardKeys=[];const skillKeys=[];const standardSkillSchema={type:'object',allOf:[{$ref:'#/$defs/CombatModifierBase',},],properties:{},unevaluatedProperties:false,};Object.entries(modifierData).forEach((entry)=>{if(isSkillEntry(entry)){standardSkillSchema.properties[entry[0]]={description:entry[1].description,allOf:[{$ref:'#/$defs/SkillModDataArray'}],};skillKeys.push(entry[0]);}
else if(!allCombatKeys.has(entry[0])){standardSkillSchema.properties[entry[0]]={description:entry[1].description,type:'number',minimum:0,};standardKeys.push(entry[0]);}});return JSON.stringify({CombatModifierBase:combatSchema,CombatModifierData:{type:'object',allOf:[{$ref:'#/$defs/CombatModifierBase',},],unevaluatedProperties:false,},PlayerModifierData:standardSkillSchema,CombatModifierKey:{type:'string',enum:[...allCombatKeys],},StandardModifierKeys:{oneOf:[{$ref:'#/$defs/CombatModifierKey',},{type:'string',enum:standardKeys,},],},SkillModifierKeys:{type:'string',enum:skillKeys,},});}
var TownshipResourceTypeID;(function(TownshipResourceTypeID){TownshipResourceTypeID[TownshipResourceTypeID["Currency"]=0]="Currency";TownshipResourceTypeID[TownshipResourceTypeID["Raw"]=1]="Raw";TownshipResourceTypeID[TownshipResourceTypeID["Product"]=2]="Product";})(TownshipResourceTypeID||(TownshipResourceTypeID={}));var BuildingTypeID;(function(BuildingTypeID){BuildingTypeID[BuildingTypeID["House"]=0]="House";BuildingTypeID[BuildingTypeID["Gathering"]=1]="Gathering";BuildingTypeID[BuildingTypeID["Production"]=2]="Production";BuildingTypeID[BuildingTypeID["Storage"]=3]="Storage";BuildingTypeID[BuildingTypeID["Education"]=4]="Education";BuildingTypeID[BuildingTypeID["Other"]=5]="Other";})(BuildingTypeID||(BuildingTypeID={}));var CitizenSource;(function(CitizenSource){CitizenSource[CitizenSource["Birth"]=0]="Birth";CitizenSource[CitizenSource["Migration"]=1]="Migration";})(CitizenSource||(CitizenSource={}));function formatAsSHTimePeriod(timeInMs){const time=getMAsTime(timeInMs);const timePeriods=[];if(time.years>0){timePeriods.push(`${time.years}y`);}
if(time.days>0){timePeriods.push(`${time.days}d`);}
timePeriods.push(`${time.hours}h`);timePeriods.push(`${time.minutes}m`);timePeriods.push(`${time.seconds}s`);const listFormat=new Intl.ListFormat('en',{style:'narrow',type:'unit'});return listFormat.format(timePeriods.map((part)=>part.replace(' ','\xa0')));}
function getMAsTime(time){const msPerUnit={years:365*24*60*60*1000,days:24*60*60*1000,hours:60*60*1000,minutes:60*1000,seconds:1000,milliseconds:1,};const years=Math.floor(time/msPerUnit.years);const days=Math.floor((time%msPerUnit.years)/msPerUnit.days);const hours=Math.floor((time%msPerUnit.days)/msPerUnit.hours);const minutes=Math.floor((time%msPerUnit.hours)/msPerUnit.minutes);const seconds=Math.floor((time%msPerUnit.minutes)/msPerUnit.seconds);const milliseconds=Math.floor((time%msPerUnit.seconds)/msPerUnit.milliseconds);return{years,days,hours,minutes,seconds,milliseconds,};}
var PushNotificationType;(function(PushNotificationType){PushNotificationType[PushNotificationType["Unique"]=0]="Unique";PushNotificationType[PushNotificationType["Other"]=1]="Other";})(PushNotificationType||(PushNotificationType={}));