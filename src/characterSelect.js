"use strict";var __awaiter=(this&&this.__awaiter)||function(thisArg,_arguments,P,generator){function adopt(value){return value instanceof P?value:new P(function(resolve){resolve(value);});}
return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}
function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}
function step(result){result.done?resolve(result.value):adopt(result.value).then(fulfilled,rejected);}
step((generator=generator.apply(thisArg,_arguments||[])).next());});};let inCharacterSelection=false;let currentSaveView=0;let startingGamemode=undefined;let createNewCharacterSlot=-1;const localSaveHeaders=[];const cloudSaveHeaders=[];function loadCharacterSelection(returnToGame=false){console.log('Loading character selection');inCharacterSelection=true;returnToGameAfterSubmission=returnToGame;$('#m-page-loader-test').attr('class','show');showLocalSaveSelection();cloudManager.updateUIForPlayFabSignIn();cloudManager.updateUIForMelvorCloudSignIn();cloudManager.updateUIForEntitlements();mod.trigger.characterSelectionLoaded();}
function getCloudInfoInSlot(slotID){let cloudInfo=undefined;let hasCloud=false;if(cloudSaveHeaders.length===maxSaveSlots){const cloudHeader=cloudSaveHeaders[slotID];switch(cloudHeader){case 0:hasCloud=false;break;case 1:case 2:hasCloud=true;break;default:hasCloud=true;cloudInfo=cloudHeader;break;}}
return{cloudInfo,hasCloud};}
function getLocalInfoInSlot(slotID){let localInfo=undefined;if(localSaveHeaders.length===maxSaveSlots){const localHeader=localSaveHeaders[slotID];if(!(typeof localHeader==='number'))
localInfo=localHeader;}
return localInfo;}
function refreshCloudSavesOnClick(){return __awaiter(this,void 0,void 0,function*(){if(!PlayFabClientSDK.IsClientLoggedIn())
return;const refresh=document.getElementById('character-selection-toggle-refresh');refresh.disabled=true;refresh.innerHTML=`<div class="spinner-border spinner-border-sm" role="status"></div>`;yield cloudManager.refreshPlayFabSaves();if(currentSaveView===1)
showCloudSaveSelection();refresh.innerHTML=`<i class="si si-refresh"></i>`;refresh.disabled=false;});}
function showLocalSaveSelection(){if(localSaveHeaders.length<maxSaveSlots)
throw new Error('Local saves have not been loaded yet.');const saveContainer=$('#character-selection-container');let html=createCharacterSelectSettings();html+=createToggleCharacterSelectionViewBtn();saveContainer.html(html);localSaveHeaders.forEach((localInfo,slotID)=>{const saveSlotDisplay=createElement('save-slot-display',{id:`save-slot-display-${slotID}`});saveContainer.append(saveSlotDisplay);const{cloudInfo,hasCloud}=getCloudInfoInSlot(slotID);switch(localInfo){case 0:saveSlotDisplay.setEmptyLocal(slotID,hasCloud);break;case 1:saveSlotDisplay.setError(slotID,getLangString('MENU_TEXT','SAVE_ERROR_MESSAGE_2'),false);break;case 2:saveSlotDisplay.setError(slotID,getLangString('MENU_TEXT','SAVE_ERROR_MESSAGE_1'),false);break;default:saveSlotDisplay.setLocalSave(slotID,localInfo,cloudInfo);break;}
saveSlotDisplay.characterDisplay.toggleTestWarning(cloudManager.isTest);});saveContainer.append(createLatestDeathNotification());}
function showCloudSaveSelection(){if(cloudSaveHeaders.length<maxSaveSlots)
throw new Error(`Cloud saves have not been loaded yet.`);const saveContainer=$('#character-selection-container');let html=createCharacterSelectSettings();html+=createToggleCharacterSelectionViewBtn();saveContainer.html(html);cloudSaveHeaders.forEach((cloudInfo,slotID)=>{const saveSlotDisplay=createElement('save-slot-display',{id:`save-slot-display-${slotID}`});saveContainer.append(saveSlotDisplay);const localInfo=getLocalInfoInSlot(slotID);switch(cloudInfo){case 0:saveSlotDisplay.setEmptyCloud(slotID);break;case 1:saveSlotDisplay.setError(slotID,getLangString('MENU_TEXT','SAVE_ERROR_MESSAGE_3'),true);break;case 2:saveSlotDisplay.setError(slotID,getLangString('MENU_TEXT','SAVE_ERROR_MESSAGE_4'),true);break;default:saveSlotDisplay.setCloudSave(slotID,cloudInfo,localInfo);break;}
saveSlotDisplay.characterDisplay.toggleTestWarning(cloudManager.isTest);});}
function showSaveSelectionLoading(slotLoading){for(let slotID=0;slotID<maxSaveSlots;slotID++){const slotElement=document.getElementById(`save-slot-display-${slotID}`);if(slotElement===null)
continue;if(slotID===slotLoading){slotElement.setSaveLoading();}
else{slotElement.setDisabled();}}}
function showSaveLoadingError(slotID,message,isCloud){const slotElement=document.getElementById(`save-slot-display-${slotID}`);if(slotElement===null)
return;slotElement.setError(slotID,message,isCloud);}
function toggleSaveSelectionView(newView=-1){if(newView===-1){switch(currentSaveView){case 0:newView=1;break;case 1:newView=0;break;}}
switch(newView){case 0:{currentSaveView=0;showLocalSaveSelection();}
break;case 1:{currentSaveView=1;showCloudSaveSelection();}
break;}}
function checkSaveExpansions(saveInfo){let notInstalled=undefined;for(let i=saveInfo.activeNamespaces.length-1;i>=0;i--){const ns=saveInfo.activeNamespaces[i];if(!game.registeredNamespaces.hasNamespace(ns)){notInstalled=ns;break;}}
return notInstalled;}
function showSaveExpansionError(ns){const modalBody=createElement('div');switch(ns){case "melvorTotH":modalBody.append(createElement('p',{text:getLangString('CHARACTER_SELECT','SAVE_CONTENT_ERROR_THRONE'),}));break;case "melvorF":modalBody.append(createElement('p',{text:getLangString('CHARACTER_SELECT','SAVE_CONTENT_ERROR_FULL'),}));break;case "melvorD":modalBody.append(createElement('p',{text:getLangString('CHARACTER_SELECT','SAVE_CONTENT_ERROR_DEMO')}));break;}
const instructions=createElement('p',{parent:modalBody});instructions.innerHTML=templateLangString('CHARACTER_SELECT','SAVE_CONTENT_ERROR_INSTRUCTIONS',{icon1:'<i class="fa fa-cog mr-1"></i>',icon2:'<i class="fa fa-exclamation-circle mr-1"></i>',});SwalLocale.fire({titleText:getLangString('CHARACTER_SELECT','ERROR_LOADING_SAVE'),icon:'error',html:modalBody,});}
function forceLoadSaveOnClick(slotID,isCloud){return __awaiter(this,void 0,void 0,function*(){const saveInfo=isCloud?cloudSaveHeaders[slotID]:localSaveHeaders[slotID];if(typeof saveInfo==='number')
throw new Error('Tried to force load invalid save.');const modalBody=createElement('div');modalBody.append(createElement('p',{text:getLangString('CHARACTER_SELECT','FORCE_LOAD_WARNING'),className:'font-size-sm text-warning',}));const el=createElement('div',{className:'bg-light rounded p-2 mb-2',parent:modalBody});const formGroup=createElement('div',{className:'form-check',parent:el,});const confirmCheck=createElement('input',{className:'form-check-input pointer-enabled',attributes:[['type','checkbox']],id:'force-load-save-check',parent:formGroup,});createElement('label',{text:getLangString('CHARACTER_SELECT','FORCE_LOAD_CONFIRMATION'),className:'form-check-label pointer-enabled font-size-sm text-left',attributes:[['for','force-load-save-check']],parent:formGroup,});const userResponse=yield SwalLocale.fire({titleText:getLangString('CHARACTER_SELECT','FORCE_LOAD_SAVE'),icon:'warning',html:modalBody,confirmButtonText:getLangString('CHARACTER_SELECT','FORCE_LOAD'),showCancelButton:true,preConfirm:()=>{return confirmCheck.checked;},});if(!userResponse.value)
return;if(isCloud)
loadCloudSaveOnClick(slotID,true);else
loadLocalSaveOnClick(slotID,true);});}
function loadLocalSaveOnClick(slotID,force=false){return __awaiter(this,void 0,void 0,function*(){if(isLoadingSave)
return;if(showModManagerPrompts())
return;const localInfo=localSaveHeaders[slotID];if(typeof localInfo==='number')
throw new Error('Tried to load invalid local save.');const unloadedNS=checkSaveExpansions(localInfo);if(unloadedNS!==undefined&&!force){showSaveExpansionError(unloadedNS);return;}
if(localStorageSettings.enableSaveOverwriteWarning=='true'&&PlayFabClientSDK.IsClientLoggedIn()){const html=createElement('div');html.append(createElement('h5',{className:'text-dark font-size-sm',text:getLangString('CHARACTER_SELECT','69')}),getLocalSaveSummary(slotID),createElement('h5',{className:'font-w600 text-danger mb-3 mt-3',text:getLangString('MENU_TEXT','WILL_OVERWRITE'),}),getCloudSaveSummary(slotID));const userResponse=yield SwalLocale.fire({title:getLangString('CHARACTER_SELECT','67'),html:html,icon:'warning',showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),});if(userResponse.value){showSaveSelectionLoading(slotID);yield loadLocalSave(slotID);yield mod.trigger.characterLoaded();}}
else{showSaveSelectionLoading(slotID);yield loadLocalSave(slotID);yield mod.trigger.characterLoaded();}});}
function loadCloudSaveOnClick(slotID,force=false){return __awaiter(this,void 0,void 0,function*(){if(isLoadingSave)
return;if(showModManagerPrompts())
return;const cloudInfo=cloudSaveHeaders[slotID];if(typeof cloudInfo==='number')
throw new Error('Tried to load invalid cloud save.');const unloadedNS=checkSaveExpansions(cloudInfo);if(unloadedNS!==undefined&&!force){showSaveExpansionError(unloadedNS);return;}
if(localStorageSettings.enableSaveOverwriteWarning=='true'){const html=createElement('div');html.append(createElement('h5',{className:'text-dark font-size-sm',text:getLangString('CHARACTER_SELECT','70')}),getCloudSaveSummary(slotID),createElement('h5',{className:'font-w600 text-danger mb-3 mt-3',text:getLangString('MENU_TEXT','WILL_OVERWRITE'),}),getLocalSaveSummary(slotID));const userResponse=yield SwalLocale.fire({title:getLangString('CHARACTER_SELECT','68'),html:html,icon:'warning',showCancelButton:true,confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),});if(userResponse.value){showSaveSelectionLoading(slotID);yield loadCloudSave(slotID);}}
else{showSaveSelectionLoading(slotID);yield loadCloudSave(slotID);}});}
function getLocalSaveSummary(slotID){if(localSaveHeaders.length<maxSaveSlots)
throw new Error('Local saves not loaded.');const localInfo=localSaveHeaders[slotID];switch(localInfo){case 0:return createElement('h5',{className:'font-w400 font-size-sm mb-3',text:getLangString('GOLBIN_RAID','POPUP_9'),});case 1:case 2:return createElement('h5',{className:'font-w600 text-danger font-size-sm mb-3',text:getLangString('MENU_TEXT','ERROR_DISPLAY_LOCAL'),});default:{const characterDisplay=createElement('character-display');const{cloudInfo}=getCloudInfoInSlot(slotID);characterDisplay.setLocalSave(slotID,localInfo,cloudInfo,true);return characterDisplay;}}}
function getCloudSaveSummary(slotID){if(cloudSaveHeaders.length<maxSaveSlots)
throw new Error('Cloud saves not loaded.');const cloudInfo=cloudSaveHeaders[slotID];switch(cloudInfo){case 0:return createElement('h5',{className:'font-w400 font-size-sm mb-3',text:getLangString('GOLBIN_RAID','POPUP_9'),});case 1:case 2:return createElement('h5',{className:'font-w600 text-danger font-size-sm mb-3',text:getLangString('MENU_TEXT','ERROR_DISPLAY_CLOUD'),});default:{const characterDisplay=createElement('character-display');const localInfo=getLocalInfoInSlot(slotID);characterDisplay.setCloudSave(slotID,cloudInfo,localInfo,true);return characterDisplay;}}}
function showImportSaveFromStringForm(slotID){return __awaiter(this,void 0,void 0,function*(){const userResponse=yield SwalLocale.fire({title:getLangString('CHARACTER_SELECT','38'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString('CHARACTER_SELECT','43')}</h5>
					<div class="form-group">
						<textarea class="form-control" id="import-save-character-selection" name="import-save-character-selection" rows="8" placeholder="${getLangString('CHARACTER_SELECT','91')}" onclick="this.select();"></textarea>
					</div>`,showCancelButton:true,confirmButtonText:getLangString('CHARACTER_SELECT','44'),});if(!userResponse.value)
return;const saveString=$('#import-save-character-selection').val();if(saveString.startsWith('https://melvoridle.com/save/')&&saveString.length<100){yield processImportSaveFromLink(saveString,slotID);}
else{const importSuccess=yield importSaveToSlot(saveString,slotID);if(importSuccess){SwalLocale.fire({icon:'success',title:getLangString('CHARACTER_SELECT','73'),html:`<span class='text-dark'>${getLangString('CHARACTER_SELECT','92')}</span>`,});yield updateLocalSaveHeaders();toggleSaveSelectionView(0);inCharacterSelection=true;}
else{SwalLocale.fire({icon:'error',title:getLangString('CHARACTER_SELECT','93'),html:`<span class='text-dark'>${getLangString('CHARACTER_SELECT','94')}</span>`,});}}});}
function showImportSaveFromLinkForm(slotID){return __awaiter(this,void 0,void 0,function*(){const userResponse=yield SwalLocale.fire({title:getLangString('CHARACTER_SELECT','38'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString('CHARACTER_SELECT','43')}</h5>
					<div class="form-group">
						<input type="text" class="form-control" id="import-save-link-character-selection" name="import-save-link-character-selection" rows="1" placeholder="${getLangString('CHARACTER_SELECT','91')}"/>
					</div>`,showCancelButton:true,confirmButtonText:getLangString('CHARACTER_SELECT','44'),});if(!userResponse.value)
return;const link=$('#import-save-link-character-selection').val();if(link.startsWith('https://melvoridle.com/save/')&&link.length<100)
yield processImportSaveFromLink(link,slotID);});}
function processImportSaveFromLink(link,slotID){return __awaiter(this,void 0,void 0,function*(){const shortLink=replaceAll(link,'https://melvoridle.com/save/','');const URL=`cloud/getSaveFromLink.php?saveLink=${shortLink}`;const response=yield fetch(URL,{method:'GET',});const saveString=yield response.text();const importSuccess=yield importSaveToSlot(saveString,slotID);if(importSuccess){SwalLocale.fire({icon:'success',title:getLangString('CHARACTER_SELECT','73'),html:`<span class='text-dark'>${getLangString('CHARACTER_SELECT','92')}</span>`,});inCharacterSelection=true;yield updateLocalSaveHeaders();toggleSaveSelectionView(0);}
else{SwalLocale.fire({icon:'error',title:getLangString('CHARACTER_SELECT','93'),html:`<span class='text-dark'>${getLangString('CHARACTER_SELECT','94')}</span>`,});}});}
function createLocalSaveOnClick(slotID){if(showModManagerPrompts())
return;if(cloudManager.getPlayFabSave(slotID)===''){displayGamemodeSelection(slotID);return;}
const html=createElement('div');html.append(createElement('h5',{className:'font-w600 font-size-sm mb-3',text:getLangString('MENU_TEXT','EXISTING_CLOUD_SAVE_POPUP_BODY_CREATING'),}),createElement('h5',{className:'font-w600 text-danger mb-3 mt-3',text:getLangString('MENU_TEXT','WILL_OVERWRITE'),}),getCloudSaveSummary(slotID));SwalLocale.fire({title:templateString(getLangString('MENU_TEXT','EXISTING_CLOUD_SAVE_POPUP_TITLE'),{number:`${slotID+1}`,}),html,icon:'warning',showCancelButton:true,confirmButtonColor:'#3085d6',cancelButtonColor:'#d33',confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),cancelButtonText:getLangString('CHARACTER_SELECT','45'),}).then((result)=>{if(result.value)
displayGamemodeSelection(slotID);});}
function createNewSave(){if(createNewCharacterSlot===-1||startingGamemode===undefined)
throw new Error('Error new save data not set.');$('#start-game-btn').addClass('d-none');$('#spinner-begin-journey').removeClass('d-none');logConsole('Set Timeout: createNewSave');window.setTimeout(function(){if(startingGamemode===undefined)
throw new Error(`Error trying to create save. No gameode selected.`);$('#m-page-loader').attr('class','show');let startingCharacterName=$('#username-set-main').val();if(startingCharacterName===''){startingCharacterName=getLangString('CHARACTER_SELECT','75');}
createNewCharacterInSlot(createNewCharacterSlot,startingGamemode,startingCharacterName);},1000);}
function createLatestDeathNotification(){const latestHCDeath=localStorage.getItem('LatestHCDeath');let html='';if(latestHCDeath!==undefined&&latestHCDeath!==null){const latestHCDeathJSON=JSON.parse(latestHCDeath);html+=`<div class="mt-2 font-w600 font-size-sm text-center text-danger">${templateString(getLangString('MENU_TEXT','LATEST_PERMADEATH'),{username:latestHCDeathJSON.PlayerName,killedBy:latestHCDeathJSON.killedBy,number:`${latestHCDeathJSON.TotalSkillLevel}`,localDateTime:new Date(latestHCDeathJSON.timestamp).toLocaleString(),})}</div>`;}
return html;}
function showDiscontinuedModal(title){SwalLocale.fire({title:title,html:getLangString('CHARACTER_SELECT','100'),icon:'error',});}
function createToggleCharacterSelectionViewBtn(){let disabled='';if(!PlayFabClientSDK.IsClientLoggedIn())
disabled='disabled';const html=`<div class="btn-group mt-1 mb-1 w-100" role="group" aria-label="Horizontal Primary">
					<button type="button" class="btn btn-lg btn-alt-primary mt-2 mb-2 w-100 character-selection-toggle" onclick="toggleSaveSelectionView();" ${disabled}>${getLangString('CHARACTER_SELECT',currentSaveView===0?'33':'34')}</button>
					<button type="button" class="btn btn-lg btn-alt-info mt-2 mb-2 w-100" id="character-selection-toggle-refresh"${currentSaveView===0||!PlayFabClientSDK.IsClientLoggedIn()?' disabled=""':''} style="max-width:15%;" onclick="refreshCloudSavesOnClick();">
						<i class="si si-refresh"></i>
					</button>
				</div>`;return html;}
function createCharacterSelectSettings(){let checked='checked';if(localStorageSettings.enableSaveOverwriteWarning=='false')
checked='';const html=`<div class="col-12 text-center">
				<div class="custom-control custom-switch mb-2">
					<input type="checkbox" class="custom-control-input pointer-enabled" id="enableSaveOverwriteWarning" name="enableSaveOverwriteWarning" ${checked} onClick="toggleCharacteSelectWarningPopup();">
					<label class="custom-control-label pointer-enabled text-light" for="enableSaveOverwriteWarning">${getLangString('MENU_TEXT','ENABLE_OVERWRITE_SAVE_POPUP')}</label>
				</div>
			</div>`;return html;}
function toggleCharacteSelectWarningPopup(){if(localStorageSettings.enableSaveOverwriteWarning===undefined||localStorageSettings.enableSaveOverwriteWarning.includes('false')){localStorageSettings.enableSaveOverwriteWarning='true';$('#enableSaveOverwriteWarning').prop('checked',true);}
else{localStorageSettings.enableSaveOverwriteWarning='false';$('#enableSaveOverwriteWarning').prop('checked',false);}
localStorage.setItem('enableSaveOverwriteWarning',localStorageSettings.enableSaveOverwriteWarning);}
function setNewStartPage(page){$('#character-selection-page-'+currentStartPage).attr('class','d-none animated fadeOutRight');$('#character-selection-page-'+page).attr('class','w-100 animated fadeInRight');currentStartPage=page;if(page!==0){$('.btn-cloud-sign-in').addClass('d-none');$('.btn-cloud-sign-in-back').removeClass('d-none');}
else{if(!cloudManager.isAuthenticated)
$('.btn-cloud-sign-in').removeClass('d-none');$('.btn-cloud-sign-in-back').addClass('d-none');}}
function showModManagerPrompts(){if(mod.manager.isProcessing()){mod.manager.showPromptForInProgress();return true;}
if(mod.manager.hasChanges()){mod.manager.showPromptForReload(false);return true;}
return false;}
function displayGamemodeSelection(slotID){createNewCharacterSlot=slotID;const gamemodeDisplayContainer=document.getElementById('gamemode-selection');if(gamemodeDisplayContainer===null)
throw new Error('Gamemode container does not exist.');gamemodeDisplayContainer.textContent='';game.gamemodes.forEach((gamemode)=>{if(gamemode.id===`melvorD:Unset`)
return;if(gamemode.startDate!==undefined&&gamemode.startDate>Date.now())
return;if(gamemode.endDate>0&&Date.now()>gamemode.endDate)
return;const gamemodeSelect=createElement('gamemode-selection');gamemodeSelect.setGamemode(gamemode);gamemodeDisplayContainer.append(gamemodeSelect);});setNewStartPage(3);}
const setStartingGamemode=function(gamemode){startingGamemode=gamemode;$('#gamemode-selection-text').html(`<img class="skill-icon-xs mr-2" src="${gamemode.media}">${gamemode.name}`);changePageCharacterSelection(4);};function importSaveOnClick(slotID){if(cloudManager.getPlayFabSave(slotID)!==''){const html=createElement('div');html.append(getLangString('MENU_TEXT','EXISTING_CLOUD_SAVE_POPUP_BODY'),createElement('h5',{className:'font-w600 text-danger mb-3 mt-3',text:getLangString('MENU_TEXT','WILL_OVERWRITE'),}),getCloudSaveSummary(slotID));SwalLocale.fire({title:templateString(getLangString('MENU_TEXT','EXISTING_CLOUD_SAVE_POPUP_TITLE'),{number:`${slotID+1}`,}),html,icon:'warning',showCancelButton:true,confirmButtonColor:'#3085d6',cancelButtonColor:'#d33',confirmButtonText:getLangString('MENU_TEXT','CONFIRM'),cancelButtonText:getLangString('CHARACTER_SELECT','45'),}).then((result)=>{if(result.value)
showImportSaveFromStringForm(slotID);});}
else
showImportSaveFromStringForm(slotID);}
function createSaveShareLink(characterID){SwalLocale.fire({title:getLangString('MENU_TEXT','SAVE_LINK'),html:`<div id="saveLink" class="font-size-sm text-info" style="-webkit-user-select: all!important;
    -moz-user-select: -moz-all!important;
    -ms-user-select: all!important;
    user-select: all!important;"><span class="spinner-border text-info skill-icon-xs"></span></div>`,showCancelButton:false,});const save=getLocalSaveString(true,characterID);$.ajax({url:'cloud/shareSave.php',type:'POST',async:true,data:{shareSave:save,},}).done(function(d){$('#saveLink').html(`${d}<i class="fa fa-copy ml-3 pointer-enabled" onClick="copyToClipboard('${d}')"></i>`);});}
function openDownloadSave(slotID){return __awaiter(this,void 0,void 0,function*(){const downloadSuccessful=yield downloadSave(false,slotID);if(downloadSuccessful){SwalLocale.fire({icon:'success',title:getLangString('CHARACTER_SELECT','73'),html:`<span class='text-dark'>${getLangString('CHARACTER_SELECT','95')}</span>`,});}
else{SwalLocale.fire({icon:'error',title:getLangString('CHARACTER_SELECT','93'),html:`<span class='text-dark'>${getLangString('CHARACTER_SELECT','96')}</span>`,});}});}
function openExportSave(slotID){SwalLocale.fire({title:getLangString('CHARACTER_SELECT','37'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm mb-1">${getLangString('CHARACTER_SELECT','40')}</h5>
				<h5 class="font-w600 text-danger font-size-sm">${getLangString('CHARACTER_SELECT','41')}</h5>
					<div class="form-group">
						<textarea class="form-control" id="export-save-character-selection" name="export-save-character-selection" rows="8" onclick="this.select();">${getLocalSaveString(true,slotID)}</textarea>
					</div>`,showCancelButton:false,});}
function confirmLocalSaveDeletion(slotID){return __awaiter(this,void 0,void 0,function*(){const userResponse=yield SwalLocale.fire({title:getLangString('CHARACTER_SELECT','39'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm">${''}</h5>
    <h5 class="font-w600 text-danger font-size-sm">${getLangString('CHARACTER_SELECT','46')}</h5>`,showCancelButton:true,confirmButtonText:getLangString('CHARACTER_SELECT','47'),});if(!userResponse.value)
return;deleteLocalSaveInSlot(slotID);yield updateLocalSaveHeaders();toggleSaveSelectionView(currentSaveView);dataDeleted=false;SwalLocale.fire({icon:'success',title:getLangString('CHARACTER_SELECT','73'),html:`<span class="text-dark">${getLangString('CHARACTER_SELECT','72')}</span>`,});});}
function confirmCloudSaveDeletion(slotID){return __awaiter(this,void 0,void 0,function*(){const userResponse=yield SwalLocale.fire({title:getLangString('CHARACTER_SELECT','39'),html:`<h5 class="font-w600 text-danger font-size-sm">${getLangString('CHARACTER_SELECT','46')}</h5>`,showCancelButton:true,confirmButtonText:getLangString('CHARACTER_SELECT','47'),});if(!userResponse.value)
return;deletePlayFabSave(slotID);});}