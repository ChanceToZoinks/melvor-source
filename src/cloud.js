"use strict";var __awaiter=(this&&this.__awaiter)||function(thisArg,_arguments,P,generator){function adopt(value){return value instanceof P?value:new P(function(resolve){resolve(value);});}
return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}
function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}
function step(result){result.done?resolve(result.value):adopt(result.value).then(fulfilled,rejected);}
step((generator=generator.apply(thisArg,_arguments||[])).next());});};const CLOUDURL='';const ENABLEPLAYFABAUTH=false;let forceSaveCooldown=false;let forceSyncCooldownTimer=-1;let connectedToCloud=false;let connectedToPlayFab=false;let storedCloudSaves=['','','','','','','','','','',''];PlayFab.settings.titleId='E3855';let playFabSaves=[null,null,null,null,null,null];let playFabLoginTimestamp=0;let forceSave=false;let lastSaveTimestamp=0;let lastLoginTimestamp=0;let saveAndClose=false;let forceSyncSpamPrevention=-1;let autoCloudSaveInterval=23*60*60*1000;function getCloudCharacters(){if(cloudManager.isTest){$.getJSON(CLOUDURL+'cloud/getCloudCharactersTest.php').done(function(data){if(data){storedCloudSaves=['','','','','','','','','','',''];storedCloudSaves=data;$('#cloud-dropdown-username').text(`${getLangString('CHARACTER_SELECT','76')} ${storedCloudSaves[5]}`);$('#character-cloud-manage-username').text(storedCloudSaves[5]);$('#cloud-manage-form-username').val(storedCloudSaves[5]);$('#formElements-characterSelect-email-input').val(storedCloudSaves[6]);const playFabID=storedCloudSaves[9];if(playFabID!==null)
playFabLoginWithCustomID(playFabID);getConnectedPushNotificationDevice();}});}
else{$.getJSON(CLOUDURL+'cloud/getCloudCharacters.php').done(function(data){if(data){storedCloudSaves=['','','','','','','','','','',''];storedCloudSaves=data;$('#cloud-dropdown-username').text(`${getLangString('CHARACTER_SELECT','76')} ${storedCloudSaves[5]}`);$('#character-cloud-manage-username').text(storedCloudSaves[5]);$('#cloud-manage-form-username').val(storedCloudSaves[5]);$('#formElements-characterSelect-email-input').val(storedCloudSaves[6]);if(!PlayFabClientSDK.IsClientLoggedIn()){const playFabID=storedCloudSaves[9];if(playFabID!==null)
playFabLoginWithCustomID(playFabID);}
getConnectedPushNotificationDevice();cloudManager.connectionSuccessMelvorCloud();}});}}
const gameOriginCheck=function(){return true;};const checkConnectionToCloud=function(forceLoad=false,accessCheck=false){if(localStorage.getItem('playFabID')!==undefined&&localStorage.getItem('playFabID')!==null){$('.cloud-connection-status-text').text(getLangString('CHARACTER_SELECT','53'));storedCloudSaves[9]=localStorage.getItem('playFabID');playFabLoginWithCustomID(storedCloudSaves[9]);postActiveUserDevice();}
$('#header-cloud-save-btn-disconnected').addClass('d-none');$('#header-cloud-save-btn-connecting').removeClass('d-none');$('#header-cloud-save-btn-connected').addClass('d-none');$.ajax({url:CLOUDURL+'cloud/checkCloudConnection.php',type:'POST',async:true,data:{checkCloudConnection:1,},}).done(function(data){if(data==='1')
connectedToCloud=true;else
connectedToCloud=false;if(connectedToCloud&&!accessCheck){if(!PlayFabClientSDK.IsClientLoggedIn())
$('.cloud-connection-status-text').text(getLangString('CHARACTER_SELECT','54'));$('.btn-cloud-sign-out').removeClass('d-none');$('.btn-cloud-manage').removeClass('d-none');$('.character-selection-login').addClass('d-none');getCloudCharacters();$('#cloud-character-spinner').addClass('d-none');$('#character-selections').removeClass('d-none');cloudManager.connectionSuccessMelvorCloud();checkPatreon();}
else if(!connectedToCloud&&!accessCheck){$('.cloud-connection-status-text').text(getLangString('CHARACTER_SELECT','4'));$('.cloud-connection-status-text').addClass('text-danger');$('.cloud-connection-status-spinner').addClass('d-none');cloudManager.connectionFailedMelvorCloud();if(localStorage.getItem('playFabID')===undefined||localStorage.getItem('playFabID')===null)
connectionFailedPlayFab();$('.character-selection-login').removeClass('d-none');$('.btn-cloud-sign-in').removeClass('d-none');if(!gameOriginCheck())
$('body').html(`Why tho<br><img src="assets/april/images/lemon.jpg">`);}
else if(!accessCheck){$('.character-selection-login').removeClass('d-none');}
else if(connectedToCloud&&accessCheck){checkTestAccessPatreon(forceLoad,accessCheck);}
else if(!connectedToCloud&&accessCheck){killPage();}
if(!accessCheck)
loadCloudOptions(connectedToCloud);}).fail(function(){$('.cloud-connection-status-text').text(getLangString('CHARACTER_SELECT','4'));$('.cloud-connection-status-text').addClass('text-danger');$('.cloud-connection-status-spinner').addClass('d-none');cloudManager.connectionFailedMelvorCloud();if(localStorage.getItem('playFabID')===undefined||localStorage.getItem('playFabID')===null)
connectionFailedPlayFab();$('.character-selection-login').removeClass('d-none');$('.btn-cloud-sign-in').removeClass('d-none');if(!gameOriginCheck())
$('body').html(`Why tho<br><img src="assets/april/images/lemon.jpg">`);});};function connectionFailedPlayFab(){$('.playfab-connection-text').removeClass('text-info');$('.playfab-connection-text').addClass('text-danger');$('.playfab-connection-status').addClass('d-none');$('.playfab-connection-times').removeClass('d-none');warnActivationNotLoggedIn();}
function connectionSuccessPlayFab(){$('.playfab-connection-text').removeClass('text-info');$('.playfab-connection-text').addClass('text-success');$('.playfab-connection-status').addClass('d-none');$('.playfab-connection-check').removeClass('d-none');}
function deleteCloudSave(){if(cloudManager.isTest){$.ajax({url:CLOUDURL+'cloud/deleteCloudSaveTest.php',type:'POST',async:true,data:{deleteCloudSaveTest:1,currentSave:currentCharacter,},success:function(data){accountDeletion(true);},});}
else{$.ajax({url:CLOUDURL+'cloud/deleteCloudSave.php',type:'POST',async:true,data:{deleteCloudSave:1,currentSave:currentCharacter,},success:function(data){accountDeletion(true);},});}}
function forceSync(closeAfter=false,ignorePlayFab=true){clearTimeout(forceSyncSpamPrevention);forceSyncSpamPrevention=setTimeout(function(){saveData();if(closeAfter){SwalLocale.fire({title:'Saving to Cloud. Please wait...',html:"<small>Please don't be impatient and close the game yourself.</small>",imageUrl:CDNDIR+'assets/media/main/cloud.svg',imageWidth:64,imageHeight:64,imageAlt:'Cloud',showCancelButton:false,confirmButtonText:'No, you cannot click this',allowOutsideClick:false,});$('.swal2-confirm').attr('disabled','true');}
if(!forceSaveCooldown||closeAfter){const save=game.generateSaveString();const time=new Date().getTime();console.log('Synchronising with Cloud');forceSave=true;if(lastSaveTimestamp<=0)
lastSaveTimestamp=time;if(!ignorePlayFab&&connectedToPlayFab){$('#forceSyncSpinner').removeClass('d-none');lastSaveTimestamp=time;playFabSaveData(true);forceSyncCooldown();}
if(cloudManager.isTest){$.ajax({url:CLOUDURL+'cloud/syncSaveTest.php',type:'POST',async:true,data:{syncSaveTest:1,savegame:save,timestamp:time,currentSave:currentCharacter,},success:function(data){$('#forceSyncSpinner').addClass('d-none');$('#forceSync').text('Success');$('#forceSync').attr('class','badge badge-pill badge-success');forceSave=false;window.setTimeout(function(){$('#forceSync').addClass('d-none');},5000);if(closeAfter){window.setTimeout(function(){window.close();},2000);}},});}
else{$.ajax({url:CLOUDURL+'cloud/syncSave.php',type:'POST',async:true,data:{syncSave:1,savegame:save,timestamp:time,currentSave:currentCharacter,},success:function(data){$('#forceSyncSpinner').addClass('d-none');$('#forceSync').text('Success');$('#forceSync').attr('class','badge badge-pill badge-success');forceSave=false;window.setTimeout(function(){$('#forceSync').addClass('d-none');},5000);if(closeAfter){window.setTimeout(function(){window.close();},2000);}},});}}},250);}
function forceSyncCooldown(){const cooldown=10000;forceSaveCooldown=true;$('#header-cloud-save-btn-connected').prop('disabled',true);clearTimeout(forceSyncCooldownTimer);forceSyncCooldownTimer=setTimeout(function(){forceSaveCooldown=false;$('#header-cloud-save-btn-connected').prop('disabled',false);},cooldown);}
function checkGameVersion(){$.ajax({url:CLOUDURL+'cloud/versionCheck.php',type:'POST',async:true,data:{checkGameVersion:1,},success:function(data){if(data!==gameVersion)
$('#game-update-notification').removeClass('d-none');},});}
function checkPatreon(){$.getJSON(CLOUDURL+'cloud/checkPatreon.php').done(function(data){const patreonData=data;let tier='';if(patreonData['included']!==undefined){if(patreonData['included'][0]['attributes']['patron_status']==='active_patron'){if(data['included'][0]['attributes']['currently_entitled_amount_cents']>=900)
tier='Elite Supporter';else if(data['included'][0]['attributes']['currently_entitled_amount_cents']>=440)
tier='Supporter';else
tier='Active Patron (No Tier)';}}
$('#melvor-cloud-patreon-status').html();$('#melvor-cloud-patreon-settings').html();let p='';p+=`<span class="text-success">${getLangString('CHARACTER_SELECT','84')}</span> | <small><a class="pointer-enabled" href="#" onClick="disconnectPatreon(); return false;">${getLangString('CHARACTER_SELECT','85')}</a></small>`;$('#melvor-cloud-patreon-status').html(p);});}
function disconnectPatreon(){$.ajax({url:CLOUDURL+'cloud/disconnectPatreon.php',type:'POST',async:true,data:{disconnectPatreon:1,},success:function(){loadCloudOptions(connectedToCloud);checkPatreon();},});}
function loadCloudOptions(isCloud){if(isCloud){$('#header-cloud-status').html(`${getLangString('CHARACTER_SELECT','89')} <span class="badge badge-pill badge-success">${getLangString('CHARACTER_SELECT','78')}</span>`);$('#header-cloud-save-btn-disconnected').addClass('d-none');$('#header-cloud-save-btn-connecting').addClass('d-none');$('#header-cloud-save-btn-connected').removeClass('d-none');$('#header-cloud-save-time').removeClass('d-none');$('#header-cloud-status-options').html(`<a class="dropdown-item d-flex align-items-center justify-content-between" onClick="forceSync(false, false);" aria-dismiss="false">
				<span>${getLangString('MISC_STRING','FORCE_SAVE')}</span>
				<div class="spinner-border spinner-border-sm text-danger d-none" role="status" id="forceSyncSpinner">
					<span class="sr-only">${getLangString('CHARACTER_SELECT','77')}</span>
				</div>
				<small id="forceSync"></small>
			</a>
			<div class="dropdown-item d-flex align-items-center justify-content-between">
				<small id="sync">
				</small>
			</div>
			<div role="separator" class="dropdown-divider"></div>
			<h5 class="dropdown-header">${getLangString('CHARACTER_SELECT','79')}</h5>
			<div class="dropdown-item d-flex align-items-center justify-content-between">
				<small id="cloud-dropdown-username">${getLangString('CHARACTER_SELECT','76')} ${storedCloudSaves[5]}
				</small>
			</div>
			<a class="dropdown-item d-flex align-items-center justify-content-between" href="cloud/changePassword.php">
				<span>${getLangString('CHARACTER_SELECT','60')}</span>
			</a>
			<a class="dropdown-item d-flex align-items-center justify-content-between" href="cloud/logout.php">
				<span class="text-danger">${getLangString('CHARACTER_SELECT','8')}</span>
			</a>`);$('#settings-cloud-options').html('');$('#settings-push-notifications').removeClass('d-none');let s='';s+=`<h2 class="content-heading border-bottom mb-4 pb-2">${getLangString('CHARACTER_SELECT','83')}</h2>
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                      <settings-switch class="d-block mb-4" data-setting-id="autoCloudSave" data-size="large"></settings-switch>
                      <div class="form-inline mb-4 flex-wrap-reverse">
                        <div id="melvor-cloud-patreon-status">
                          <span class="text-danger">${getLangString('CHARACTER_SELECT','90')}</span> | <a class="btn btn-secondary" href="https://melvoridle.com/cloud/patreon.php">${getLangString('CHARACTER_SELECT','81')}</a>
                        </div>
                        <p class="font-size-sm text-muted ml-2 mb-1" data-toggle="tooltip" data-html="true" data-placement="bottom" title="" data-original-title="${getLangString('CHARACTER_SELECT','82')}">
                          ${getLangString('CHARACTER_SELECT','81')}
                        </p>
                      </div>
                      <div id="melvor-cloud-patreon-settings"></div>
                    </div>
                </div>`;$('#settings-cloud-options').html(s);$('.cloud-save-close').removeClass('d-none');$('.dropdown-melvor-cloud').removeClass('d-none');if(game.settings.autoCloudSave&&confirmedLoaded)
forceSync();}
else{if(!PlayFabClientSDK.IsClientLoggedIn()){$('#header-cloud-status').html(`${getLangString('CHARACTER_SELECT','89')} <span class="badge badge-pill badge-danger">${getLangString('CHARACTER_SELECT','88')}</span>`);$('#header-cloud-save-btn-disconnected').removeClass('d-none');$('#header-cloud-save-btn-connecting').addClass('d-none');$('#header-cloud-save-btn-connected').addClass('d-none');$('#header-cloud-save-time').addClass('d-none');$('#header-cloud-status-options').html(`<a class="dropdown-item d-flex align-items-center justify-content-between pointer-enabled" href="cloud/login.php"><span>${getLangString('CHARACTER_SELECT','86')}</span></a><a class="dropdown-item d-flex align-items-center justify-content-between" href="cloud/register.php"><span>${getLangString('CHARACTER_SELECT','87')}</span></a>`);$('#settings-cloud-options').html('');$('.cloud-save-close').addClass('d-none');$('#settings-push-notifications').addClass('d-none');}
else
$('#header-cloud-save-time').removeClass('d-none');$('.dropdown-melvor-cloud').addClass('d-none');}
$('#header-account-icon').attr('src',game.currentGamemode.media);$('#header-account-icon-dropdown').attr('src',game.currentGamemode.media);if(isLoaded)
game.settings.initializeToggles();}
function checkTestAccess(){if(DEBUGENABLED)
console.log('checkTestAccess');$.ajax(CLOUDURL+'cloud/checkTestAccess.php',{type:'GET',async:false,}).done(function(data){if(!data)
killPage();else
confirmTestAccess();});}
function confirmTestAccess(){$('.check-test-access').addClass('d-none');$('.cloud-connection-status-text').text('Connection and access confirmed...');loadGameInterface(false);}
function checkTestAccessInit(forceLoad=false,accessCheck=true){$('.check-test-access').removeClass('d-none');$('.cloud-connection-status-text').text('Checking access to the Test Server...');console.log('checkTestAccessInit');checkConnectionToCloud(forceLoad,accessCheck);}
function checkTestAccessPatreon(forceLoad=false,accessCheck=true){console.log('checkTestAccessPatreon');$('.cloud-connection-status-text').text('Check Test Server access via Patreon...');$.getJSON(CLOUDURL+'cloud/checkPatreon.php').done(function(data){if(data){const patreonData=data;if(patreonData!==0){if(patreonData['included']!==undefined){if(patreonData['included'][0]['attributes']['patron_status']==='active_patron'){if(data['included'][0]['attributes']['currently_entitled_amount_cents']>=440||data['included'][0]['attributes']['patron_status']==='active_patron')
confirmTestAccess();else
checkTestAccess();}
else
checkTestAccess();}
else
checkTestAccess();}
else
checkTestAccess();}
else
checkTestAccess();}).fail(function(){console.log('checkTestAccessPatreon failed');});}
function killPage(){let html='You cannot access this webpage. Please connect your Patreon Account from the main game to your Cloud Account for access.<br>Once connected successully, this message should disappear (Assuming you have access)';if(connectedToCloud)
html+='<br><a href="https://test.melvoridle.com/cloud/patreon.php">Click here connect Melvor Cloud to Patreon</a>';else
html+='<br>You need to log into the Cloud before you can connect. <a href="cloud/login.php">Click here Login</a><br>(This will bring you back here with an option to connect to Patreon).';$('html').html(html);}
function playFabLoginWithCustomID(playFabID){const loginRequest={TitleId:PlayFab.settings.titleId,CustomId:playFabID,CreateAccount:true,};PlayFabClientSDK.LoginWithCustomID(loginRequest,playFabLoginCallback);}
const playFabLoginCallback=function(result,error){return __awaiter(this,void 0,void 0,function*(){if(result!==null){connectionSuccessPlayFab();if(storedCloudSaves[9]!=='')
localStorage.setItem('playFabID',storedCloudSaves[9]);connectedToPlayFab=true;playFabLoginTimestamp=new Date().getTime();console.log('Connected to PlayFab successfully');setAutoCloudSaveInterval();$('#header-cloud-save-btn-disconnected').addClass('d-none');$('#header-cloud-save-btn-connecting').addClass('d-none');$('#header-cloud-save-btn-connected').removeClass('d-none');$('#header-cloud-save-time').removeClass('d-none');linkSteamAccountToPlayFab();updateMobilePurchaseStatus();submitQueuedPlayFabEvents();updatePlayerTags();}
else if(error!==null){if(!PlayFabClientSDK.IsClientLoggedIn())
connectionFailedPlayFab();$('.cloud-connection-status-text').text('There was an issue logging into the PlayFab service. Please refresh to try again.');$('.cloud-connection-status-text').addClass('text-danger');$('.cloud-connection-status-spinner').addClass('d-none');console.log('PlayFab Error: '+PlayFab.GenerateErrorReport(error));}
lastLoginTimestamp=new Date().getTime();});};const setAutoCloudSaveInterval=function(){PlayFabClientSDK.GetTitleData({Keys:['cloudSaveInterval']},function(result){if(result.data.Data!==undefined&&result.data.Data.cloudSaveInterval!==undefined){const interval=Number.parseInt(result.data.Data.cloudSaveInterval);autoCloudSaveInterval=interval*60*60*1000;}});};function getPlayFabSave(){if(!PlayFabClientSDK.IsClientLoggedIn())
return;let requestData;if(!cloudManager.isTest){requestData={Keys:['save0','save1','save2','save3','save4','save5'],};}
else{requestData={Keys:['save0_test','save1_test','save2_test','save3_test','save4_test','save5_test'],};}
PlayFab.ClientApi.GetUserData(requestData,onPlayFabSaveLoad);}
function onPlayFabSaveLoad(result,error){return __awaiter(this,void 0,void 0,function*(){if(error!==null){$('.cloud-connection-status-text').text('There was an issue fetching Cloud Saves from PlayFab. Please refresh to try again.');$('.cloud-connection-status-text').addClass('text-danger');$('.cloud-connection-status-spinner').addClass('d-none');console.log('PlayFab Error: '+PlayFab.GenerateErrorReport(error));}
if(result){if(result.data.Data!==undefined&&result.data.Data!==null){if(!cloudManager.isTest){if(result.data.Data.save0&&result.data.Data.save0.Value)
playFabSaves[0]=result.data.Data.save0.Value;else
playFabSaves[0]=null;if(result.data.Data.save1&&result.data.Data.save1.Value)
playFabSaves[1]=result.data.Data.save1.Value;else
playFabSaves[1]=null;if(result.data.Data.save2&&result.data.Data.save2.Value)
playFabSaves[2]=result.data.Data.save2.Value;else
playFabSaves[2]=null;if(result.data.Data.save3&&result.data.Data.save3.Value)
playFabSaves[3]=result.data.Data.save3.Value;else
playFabSaves[3]=null;if(result.data.Data.save4&&result.data.Data.save4.Value)
playFabSaves[4]=result.data.Data.save4.Value;else
playFabSaves[4]=null;if(result.data.Data.save4&&result.data.Data.save5.Value)
playFabSaves[5]=result.data.Data.save5.Value;else
playFabSaves[5]=null;}
else{if(result.data.Data.save0_test&&result.data.Data.save0_test.Value)
playFabSaves[0]=result.data.Data.save0_test.Value;else
playFabSaves[0]=null;if(result.data.Data.save1_test&&result.data.Data.save1_test.Value)
playFabSaves[1]=result.data.Data.save1_test.Value;else
playFabSaves[1]=null;if(result.data.Data.save2_test&&result.data.Data.save2_test.Value)
playFabSaves[2]=result.data.Data.save2_test.Value;else
playFabSaves[2]=null;if(result.data.Data.save3_test&&result.data.Data.save3_test.Value)
playFabSaves[3]=result.data.Data.save3_test.Value;else
playFabSaves[3]=null;if(result.data.Data.save4_test&&result.data.Data.save4_test.Value)
playFabSaves[4]=result.data.Data.save4_test.Value;else
playFabSaves[4]=null;if(result.data.Data.save5_test&&result.data.Data.save5_test.Value)
playFabSaves[5]=result.data.Data.save5_test.Value;else
playFabSaves[5]=null;}
$('.cloud-connection-status-text').text(getLangString('CHARACTER_SELECT','56'));$('.cloud-connection-status-text').addClass('text-success');$('.cloud-connection-status-spinner').addClass('d-none');yield updateCloudSaveHeaders();toggleSaveSelectionView(currentSaveView);}
else{playFabSaves=[null,null,null,null,null,null];console.log('No PlayFab Saves located');$('.cloud-connection-status-text').text(getLangString('CHARACTER_SELECT','56'));$('.cloud-connection-status-text').addClass('text-success');$('.cloud-connection-status-spinner').addClass('d-none');yield updateCloudSaveHeaders();enableCloudCharacterButton();}}});}
function getPlayFabData(key){const Keys=[key];const requestData={Keys};const data=new Promise((resolve,reject)=>{PlayFabClientSDK.GetUserData(requestData,function(result,error){if(error){console.log('PlayFab Event Failed.');console.log('PlayFab Error: '+PlayFab.GenerateErrorReport(error));return reject(error);}
if(result&&result.data&&result.data.Data&&result.data.Data[key]!=undefined)
return resolve(result.data.Data[key].Value);resolve(undefined);});});return data;}
function playFabStoreData(key,value){const data={[key]:value,};const requestData={Data:data,};if(requestData!==null){PlayFabClientSDK.UpdateUserData(requestData,playFabStoreDataCallback);}}
function playFabStoreDataCallback(result,error){if(result!==null){console.log('PlayFab Data Stored successfully.');}
if(error!==null){console.log('PlayFab Event Failed.');console.log('PlayFab Error: '+PlayFab.GenerateErrorReport(error));}}
function playFabSaveData(forceSave=false,closeAfterSave=false){saveData();saveAndClose=closeAfterSave;if((connectedToPlayFab&&game.settings.autoCloudSave)||(forceSave&&connectedToPlayFab)){let requestData=null;if(currentCharacter===0){if(!cloudManager.isTest){requestData={Data:{save0:createPlayFabSaves(),currentGamemode0:game.currentGamemode.id,},};}
else{requestData={Data:{save0_test:createPlayFabSaves(),},};}}
else if(currentCharacter===1){if(!cloudManager.isTest){requestData={Data:{save1:createPlayFabSaves(),currentGamemode1:game.currentGamemode.id,},};}
else{requestData={Data:{save1_test:createPlayFabSaves(),},};}}
else if(currentCharacter===2){if(!cloudManager.isTest){requestData={Data:{save2:createPlayFabSaves(),currentGamemode2:game.currentGamemode.id,},};}
else{requestData={Data:{save2_test:createPlayFabSaves(),},};}}
else if(currentCharacter===3){if(!cloudManager.isTest){requestData={Data:{save3:createPlayFabSaves(),currentGamemode3:game.currentGamemode.id,},};}
else{requestData={Data:{save3_test:createPlayFabSaves(),},};}}
else if(currentCharacter===4){if(!cloudManager.isTest){requestData={Data:{save4:createPlayFabSaves(),currentGamemode4:game.currentGamemode.id,},};}
else{requestData={Data:{save4_test:createPlayFabSaves(),},};}}
else if(currentCharacter===5){if(!cloudManager.isTest){requestData={Data:{save5:createPlayFabSaves(),currentGamemode5:game.currentGamemode.id,},};}
else{requestData={Data:{save5_test:createPlayFabSaves(),},};}}
if(requestData!==null){PlayFab.ClientApi.UpdateUserData(requestData,saveCallback,forceSave);}}}
function saveCallback(result,error,forceSave=false){if(result!==null){if(saveAndClose)
location.reload();else{$('#forceSyncSpinner').addClass('d-none');$('#forceSync').text('Success');$('#forceSync').attr('class','badge badge-pill badge-success');forceSave=false;if(characterSelected){showPlayFabSaveSuccessfulNotification();updateLastCloudSaveTimestamp();}
else{showPlayFabSaveDeletedNotification();getPlayFabSave();}}}
if(error!==null){console.log('PlayFab Save Failed.');console.log('PlayFab Error: '+PlayFab.GenerateErrorReport(error));SwalLocale.fire({icon:'error',title:getLangString('MENU_TEXT','CLOUD_SAVE_FAILED'),html:`<h5 class="font-w600">${getLangString('MENU_TEXT','CLOUD_SAVE_FAILED_BODY')}</h5><h5 class="font-w600 text-danger font-size-sm">Error: ${PlayFab.GenerateErrorReport(error)}</h5>`,});}}
function showPlayFabSaveSuccessfulNotification(){fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
  <div class="media d-flex align-items-center push">
    <div class="mr-2"><img class="skill-icon-md" src="${CDNDIR}assets/media/main/cloud.svg"></div>
    <div class="media-body text-left">
      <div class="font-w700 font-size-lg text-success">${getLangString('TOASTS','CLOUD_SAVE_SUCCESS')}</div>
      <div class="font-size-sm">
        ${getLangString('TOASTS','TAKE_A_BREATH')}
      </div>
    </div>
  </div>
</div>`,3000);}
function showPlayFabSaveDeletedNotification(){fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
  <div class="media d-flex align-items-center push">
    <div class="mr-2"><img class="skill-icon-md" src="${CDNDIR}assets/media/main/cloud.svg"></div>
    <div class="media-body text-left">
      <div class="font-w700 font-size-lg text-danger">${getLangString('TOASTS','CLOUD_SAVE_DELETED')}</div>
      <div class="font-size-sm">
        ${getLangString('TOASTS','HOPEFULLY_INTENDED')}
      </div>
    </div>
  </div>
</div>`,3000);}
function createPlayFabSaves(){return game.generateSaveString();}
function enableCloudCharacterButton(){$('.character-selection-toggle').removeAttr('disabled');if(currentSaveView===1)
$('#character-selection-toggle-refresh').removeAttr('disabled');}
function deletePlayFabSave(characterID=-1){if(characterID<0)
characterID=currentCharacter;let requestData=null;if(characterID===0){if(!cloudManager.isTest){requestData={KeysToRemove:['save0'],};}
else{requestData={KeysToRemove:['save0_test'],};}}
else if(characterID===1){if(!cloudManager.isTest){requestData={KeysToRemove:['save1'],};}
else{requestData={KeysToRemove:['save1_test'],};}}
else if(characterID===2){if(!cloudManager.isTest){requestData={KeysToRemove:['save2'],};}
else{requestData={KeysToRemove:['save2_test'],};}}
else if(characterID===3){if(!cloudManager.isTest){requestData={KeysToRemove:['save3'],};}
else{requestData={KeysToRemove:['save3_test'],};}}
else if(characterID===4){if(!cloudManager.isTest){requestData={KeysToRemove:['save4'],};}
else{requestData={KeysToRemove:['save4_test'],};}}
if(requestData!==null)
PlayFab.ClientApi.UpdateUserData(requestData,saveCallback);}
function sendPlayFabEvent(eventName,args){}
function sendPlayFabEventCallback(result,error){if(error!==null){console.log('PlayFab Event Write Failed.');console.log('PlayFab Error: '+PlayFab.GenerateErrorReport(error));}}
function queuePlayFabEvents(eventName,args){playFabEventQueue.push({eventName:eventName,args:args});}
function submitQueuedPlayFabEvents(){for(let i=0;i<playFabEventQueue.length;i++)
sendPlayFabEvent(playFabEventQueue[i].eventName,playFabEventQueue[i].args);playFabEventQueue=[];}
function fetchLatestTitleNews(){return;if(setLang==='en')
PlayFabClientSDK.GetTitleNews({Count:10},displayLatestTitleNews);}
function displayLatestTitleNews(result,error){var _a;if(result!==null){if(result.data.News&&result.data.News.length){let html='';$('#modal-playfab-news-content').html('');currentTitleNewsID=[];for(let i=0;i<result.data.News.length;i++){currentTitleNewsID.push(result.data.News[i].NewsId);let unreadCount=0;html+=createTitleNewsElement(result.data.News[i].Timestamp,result.data.News[i].Title,result.data.News[i].Body,result.data.News[i].NewsId);if(!game.readNewsIDs.includes(result.data.News[i].NewsId))
unreadCount++;if(unreadCount>0){const sidebarItem=sidebar.category('').item('Announcements');if(sidebarItem.rootEl)
sidebarItem.rootEl.classList.remove('d-none');if(sidebarItem.asideEl)
sidebarItem.asideEl.textContent=`${unreadCount}`;}}
(_a=sidebar.category('General').item('News').subitem('Recent News').rootEl)===null||_a===void 0?void 0:_a.classList.remove('d-none');$('#modal-playfab-news-content').html(html);}}
if(error!==null){console.log('PlayFab Get Title News Failed.');console.log('PlayFab Error: '+PlayFab.GenerateErrorReport(error));}}
function createTitleNewsElement(timestamp,title,body,newsId){let textClass='text-combat-smoke';if(!game.readNewsIDs.includes(newsId))
textClass='text-warning';let html='';html+=`<h5 class="font-w300 font-size-sm ${textClass} mb-1"><em><small>${new Date(timestamp)}</small></em></h5>
			<h5 class="font-w600 ${textClass} mb-2" id="announcement-${newsId}">${title}</h5>
			<h5 class="font-w300 font-size-sm text-combat-smoke mb-4">${body}</h5>
			<div role="separator" class="dropdown-divider"></div>`;return html;}
function readPlayFabNews(){var _a;game.readNewsIDs=[];for(let i=0;i<currentTitleNewsID.length;i++)
game.readNewsIDs.push(currentTitleNewsID[i]);if(game.readNewsIDs.length>10)
game.readNewsIDs.splice(10,1);(_a=sidebar.category('').item('Announcements').rootEl)===null||_a===void 0?void 0:_a.classList.add('d-none');}
function loginToMelvorCloud(playFab=true){const username=$('#cloud-login-form-username').val();const password=$('#cloud-login-form-password').val();$('#cloud-login-form-error').addClass('d-none');disableLoginForm();if(ENABLEPLAYFABAUTH&&playFab){}
else{window.setTimeout(function(){$.ajax({url:CLOUDURL+'cloud/loginToCloud.php',type:'POST',async:true,data:{login:1,username:username,password:password,},success:function(data){if(data==='1'){if(!returnToGameAfterSubmission){location.href='index.php';}
else{console.log('loginToMelvorCloud');checkConnectionToCloud();$('#m-page-loader-test').attr('class','d-none');returnToGameAfterSubmission=false;$('.cloud-connection-status-text').removeClass('text-danger');$('.cloud-connection-status-text').removeClass('text-success');$('.btn-cloud-sign-in').addClass('d-none');location.href='index.php';}}
else{enableLoginForm();$('#cloud-login-form-error').removeClass('d-none');}},});},500);}}
function registerToMelvorCloud(){if(ENABLEPLAYFABAUTH){const username=$('#cloud-register-form-username').val();$('#cloud-register-form-error').addClass('d-none');disableRegisterForm();window.setTimeout(function(){$.ajax({url:CLOUDURL+'cloud/checkCloudUsername.php',type:'POST',async:true,data:{register:1,username:username,},success:function(data){enableRegisterForm();$('#cloud-register-form-error').text(data);$('#cloud-register-form-error').removeClass('d-none');},});},500);}
else{const username=$('#cloud-register-form-username').val();const password=$('#cloud-register-form-password').val();const passwordConfirm=$('#cloud-register-form-password-confirm').val();const email=$('#cloud-register-form-email').val();const saves=['','','','',''];for(let i=0;i<5;i++){saves[i]=getLocalSaveString(true,i);}
$('#cloud-register-form-error').addClass('d-none');disableRegisterForm();window.setTimeout(function(){$.ajax({url:CLOUDURL+'cloud/registerToCloud.php',type:'POST',async:true,data:{register:1,username:username,password:password,confirmPassword:passwordConfirm,email:email,savegame:saves[0],savegame_2:saves[1],savegame_3:saves[2],savegame_4:saves[3],savegame_5:saves[4],},success:function(data){if(data==='1'){enableRegisterForm();SwalLocale.fire({icon:'success',title:'Successfully Registered!',html:`<span class="text-dark">You may now log in.</span>`,});changePageCharacterSelection(1);}
else{enableRegisterForm();$('#cloud-register-form-error').text(data);$('#cloud-register-form-error').removeClass('d-none');}},});},500);}}
function forgotPasswordMelvorCloud(){const email=$('#cloud-forgot-form-email').val();$('#cloud-forgot-form-error').addClass('d-none');disableForgotForm();window.setTimeout(function(){$.ajax({url:CLOUDURL+'cloud/forgotPasswordToCloud.php',type:'POST',async:true,data:{forgotPassword:1,email:email,},success:function(data){if(data==='1'){SwalLocale.fire({icon:'success',title:'Submitted!',html:`<span class="text-dark">Please check your email (and spam folder) for the reset link.</span>`,});changePageCharacterSelection(0);}
else{enableForgotForm();$('#cloud-forgot-form-error').removeClass('d-none');$('#cloud-forgot-form-error').text('Unsuccessful. Usually this means you did not attach an email to your Cloud account when registering :(');}},});},500);}
function disableLoginForm(){$('#cloud-login-form-spinner').removeClass('d-none');$('#cloud-login-form').addClass('d-none');$('#cloud-login-form-username').prop('disabled',true);$('#cloud-login-form-password').prop('disabled',true);$('#cloud-login-form-submit').prop('disabled',true);}
function enableLoginForm(){$('#cloud-login-form-spinner').addClass('d-none');$('#cloud-login-form').removeClass('d-none');$('#cloud-login-form-username').prop('disabled',false);$('#cloud-login-form-password').prop('disabled',false);$('#cloud-login-form-submit').prop('disabled',false);}
function disableRegisterForm(){$('#cloud-register-form-spinner').removeClass('d-none');$('#cloud-register-form').addClass('d-none');$('#cloud-register-form-username').prop('disabled',true);$('#cloud-register-form-password').prop('disabled',true);$('#cloud-register-form-password-confirm').prop('disabled',true);$('#cloud-register-form-email').prop('disabled',true);$('#cloud-register-form-submit').prop('disabled',true);}
function enableRegisterForm(){$('#cloud-register-form-spinner').addClass('d-none');$('#cloud-register-form').removeClass('d-none');$('#cloud-register-form-username').prop('disabled',false);$('#cloud-register-form-password').prop('disabled',false);$('#cloud-register-form-password-confirm').prop('disabled',false);$('#cloud-register-form-email').prop('disabled',false);$('#cloud-register-form-submit').prop('disabled',false);}
function disableForgotForm(){$('#cloud-forgot-form-spinner').removeClass('d-none');$('#cloud-forgot-form').addClass('d-none');$('#cloud-forgot-form-email').prop('disabled',true);$('#cloud-forgot-form-submit').prop('disabled',true);}
function enableForgotForm(){$('#cloud-forgot-form-spinner').addClass('d-none');$('#cloud-forgot-form').removeClass('d-none');$('#cloud-forgot-form-email').prop('disabled',false);$('#cloud-forgot-form-submit').prop('disabled',false);}
function disableChangeEmailForm(){$('#formElements-characterSelect-email-error').addClass('d-none');$('#formElements-characterSelect-email').prop('disabled',true);$('#formElements-characterSelect-email-submit').prop('disabled',true);}
function enableChangeEmailForm(){$('#formElements-characterSelect-email-submit').html('Update');$('#formElements-characterSelect-email-input').prop('disabled',false);$('#formElements-characterSelect-email-submit').prop('disabled',false);}
function disableChangePasswordForm(){$('#cloud-manage-form-password-error').addClass('d-none');$('#cloud-manage-form-password-current').prop('disabled',true);$('#cloud-manage-form-password-new').prop('disabled',true);$('#cloud-manage-form-password-new-confirm').prop('disabled',true);$('#cloud-manage-form-password-btn').prop('disabled',true);}
function enableChangePasswordForm(){$('#cloud-manage-form-password-btn').html(getLangString('CHARACTER_SELECT','60'));$('#cloud-manage-form-password-current').prop('disabled',false);$('#cloud-manage-form-password-new').prop('disabled',false);$('#cloud-manage-form-password-new-confirm').prop('disabled',false);$('#cloud-manage-form-password-btn').prop('disabled',false);}
function updateEmailMelvorCloud(){const newEmail=$('#formElements-characterSelect-email-input').val();disableChangeEmailForm();$('#formElements-characterSelect-email-submit').html(`<span class="spinner-border spinner-border-sm text-info mr-2" role="status"></span>`);window.setTimeout(function(){$.ajax({url:CLOUDURL+'cloud/changeEmailToCloud.php',type:'POST',async:true,data:{changeEmail:1,email:newEmail,},success:function(data){if(data==='1'){SwalLocale.fire({icon:'success',html:`<span class="text-dark">Your email has been updated successfully.</span>`,});enableChangeEmailForm();}
else{enableChangeEmailForm();$('#formElements-characterSelect-email-error').removeClass('d-none');$('#formElements-characterSelect-email-error').text('Unable to update email. Please confirm a valid email was entered.');}},});},500);}
function updatePasswordMelvorCloud(){const currentPassword=$('#cloud-manage-form-password-current').val();const newPassword=$('#cloud-manage-form-password-new').val();const newPasswordConfirm=$('#cloud-manage-form-password-new-confirm').val();disableChangePasswordForm();$('#cloud-manage-form-password-btn').html(`<span class="spinner-border spinner-border-sm text-info mr-2" role="status"></span>`);window.setTimeout(function(){$.ajax({url:CLOUDURL+'cloud/changePasswordToCloud.php',type:'POST',async:true,data:{changePassword:1,currentPassword:currentPassword,newPassword:newPassword,newPasswordConfirm:newPasswordConfirm,},success:function(data){if(data==='1'){SwalLocale.fire({icon:'success',html:"<span class='text-dark'>Your password has been updated successfully.</span>",});$('#cloud-manage-form-password-current').val('');$('#cloud-manage-form-password-new').val('');$('#cloud-manage-form-password-new-confirm').val('');enableChangePasswordForm();}
else{enableChangePasswordForm();$('#cloud-manage-form-password-error').removeClass('d-none');$('#cloud-manage-form-password-error').text(data);}},});},500);}
function cloudSaveAndExit(){SwalLocale.fire({title:'Saving to Cloud...',html:'<div class="spinner-border spinner-border-sm text-primary mr-2" role="status"></div>Saving to Cloud and exiting to character selection. Please wait...',imageWidth:64,imageHeight:64,imageAlt:'Offline',allowOutsideClick:false,});$('.swal2-confirm').attr('disabled','true');if(connectedToPlayFab)
playFabSaveData(false,true);else{saveData();location.reload();}}
function updateLastCloudSaveTimestamp(){const time=new Date().getTime();const lastSave=time-lastSaveTimestamp;if(lastSaveTimestamp>0)
$('#last-cloudsave-time').text(formatAsShorthandTimePeriod(lastSave));}
const linkSteamAccountToPlayFab=function(){if(nativeManager.isSteam&&PlayFabClientSDK.IsClientLoggedIn()){try{if(parent.greenworks.init()){parent.greenworks.getAuthSessionTicket(function(ticket){PlayFabClientSDK.LinkSteamAccount({SteamTicket:ticket.ticket.toString('hex'),ForceLink:true},function(results,error){if(results!==null)
console.log('Steam Account Link successful');else
console.log(PlayFab.GenerateErrorReport(error));});},function(e){console.log('Error getting Steam Auth Ticket');});}}
catch(e){console.warn('Steam Account Link failed:'+e);}}};const getPlayFabInfo=function(){if(PlayFabClientSDK.IsClientLoggedIn())
checkSteamPurchase();else
warnActivationNotLoggedIn();};const getSteamPurchaseStatus=function(){const isSteamPurchased=new Promise((resolve)=>{PlayFabClientSDK.ExecuteCloudScript({FunctionName:'steamCheckAppOwnership'},function(result,error){if(result!==null)
resolve(result.data.FunctionResult);else
resolve({isOwned:false});});});return isSteamPurchased;};const checkSteamPurchase=function(){getSteamPurchaseStatus().then((result)=>{if(result.isOwned&&cloudManager.hasFullVersionEntitlement&&location.origin!=='https://steam.melvoridle.com'){location.href='index.php';}
else if(result.isOwned){confirmSteamPurchase();confirmMobilePurchase();confirmBrowserPurchase();}
else{if(nativeManager.isSteam){warningSteamPurchase();showActivationError(1);}
else
failSteamPurchase();checkMobilePurchase();}});};const getMobilePurchaseStatus=function(){const isMobilePurchased=new Promise((resolve,reject)=>{PlayFabClientSDK.GetUserReadOnlyData({Keys:['validMobile']},function(d,error){if(d!==undefined&&d!==null&&d.data.Data!==undefined){if(d.data.Data.validMobile!==undefined)
resolve(d.data.Data.validMobile.Value);else
resolve(false);}
else
reject(error);});});return isMobilePurchased;};const checkMobilePurchase=function(){getMobilePurchaseStatus().then((result)=>{if(result=='true'&&cloudManager.hasFullVersionEntitlement&&!nativeManager.isSteam){location.href='index.php';}
else if(result=='true'){confirmMobilePurchase();confirmBrowserPurchase();}
else{failMobilePurchase();failBrowserPurchase();}});};function generateUUID(length){let result='';const characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';const charactersLength=characters.length;for(let i=0;i<length;i++){result+=characters.charAt(Math.floor(Math.random()*charactersLength));}
return result;}
let pingCheck=new Date().getTime();function pingAsActive(forcePing=false){const currentTime=new Date().getTime();if(currentTime-pingCheck>300000||forcePing){let UUID;if(localStorage.getItem('activeUUID')===null||localStorage.getItem('activeUUID')===undefined||localStorage.getItem('activeUUID')===''){UUID=generateUUID(12);localStorage.setItem('activeUUID',UUID);}
else
UUID=localStorage.getItem('activeUUID');if(UUID!==null&&UUID!==undefined&&UUID!==''){$.ajax({url:'cloud/ping.php',type:'POST',data:{activeUser:1,UUID:UUID,},});}
postActiveUserDevice();pingCheck=currentTime;}}
function postActiveUserDevice(){if(storedCloudSaves[9]!==''){let userDevice='';if(nativeManager.isSteam)
userDevice='steam';else if(nativeManager.isIOS)
userDevice='ios';else if(nativeManager.isAndroid)
userDevice='android';else
userDevice='web';if(userDevice!==''){$.ajax({url:'cloud/ping.php',type:'POST',data:{userDevicePing:1,username:storedCloudSaves[9],device:userDevice,},});}}}
function failSteamPurchase(){$('.full-activation-status-steam-spinner').addClass('d-none');$('.full-activation-status-steam-check').addClass('d-none');$('.full-activation-status-steam-times').removeClass('d-none');$('.full-activation-status-steam-warning').addClass('d-none');}
function confirmSteamPurchase(){$('.full-activation-status-steam-spinner').addClass('d-none');$('.full-activation-status-steam-check').removeClass('d-none');$('.full-activation-status-steam-times').addClass('d-none');$('.full-activation-status-steam-warning').addClass('d-none');hideActivationError(1);hideActivationError(2);}
function warningSteamPurchase(){$('.full-activation-status-steam-spinner').addClass('d-none');$('.full-activation-status-steam-check').addClass('d-none');$('.full-activation-status-steam-times').addClass('d-none');$('.full-activation-status-steam-warning').removeClass('d-none');}
function failMobilePurchase(){$('.full-activation-status-mobile-spinner').addClass('d-none');$('.full-activation-status-mobile-check').addClass('d-none');$('.full-activation-status-mobile-times').removeClass('d-none');$('.full-activation-status-mobile-warning').addClass('d-none');}
function confirmMobilePurchase(){$('.full-activation-status-mobile-spinner').addClass('d-none');$('.full-activation-status-mobile-check').removeClass('d-none');$('.full-activation-status-mobile-times').addClass('d-none');$('.full-activation-status-mobile-warning').addClass('d-none');hideActivationError(2);}
function warningMobilePurchase(){$('.full-activation-status-mobile-spinner').addClass('d-none');$('.full-activation-status-mobile-check').addClass('d-none');$('.full-activation-status-mobile-times').addClass('d-none');$('.full-activation-status-mobile-warning').removeClass('d-none');}
function failBrowserPurchase(){$('.full-activation-status-browser-spinner').addClass('d-none');$('.full-activation-status-browser-check').addClass('d-none');$('.full-activation-status-browser-times').removeClass('d-none');$('.full-activation-status-browser-warning').addClass('d-none');}
function confirmBrowserPurchase(){$('.full-activation-status-browser-spinner').addClass('d-none');$('.full-activation-status-browser-check').removeClass('d-none');$('.full-activation-status-browser-times').addClass('d-none');$('.full-activation-status-browser-warning').addClass('d-none');hideActivationError(2);}
function warningBrowserPurchase(){$('.full-activation-status-browser-spinner').addClass('d-none');$('.full-activation-status-browser-check').addClass('d-none');$('.full-activation-status-browser-times').addClass('d-none');$('.full-activation-status-browser-warning').removeClass('d-none');}
function showActivationError(error){$(`.full-activation-status-error-${error}`).removeClass('d-none');}
function hideActivationError(error){$(`.full-activation-status-error-${error}`).addClass('d-none');}
function warnActivationNotLoggedIn(){warningSteamPurchase();warningMobilePurchase();warningBrowserPurchase();showActivationError(2);}
const updatePlayerTags=function(){console.log('updatePlayerTags');let tag='Unknown';if(nativeManager.isSteam)
tag='Steam';else if(nativeManager.isAndroid)
tag='Android';else if(nativeManager.isIOS)
tag='iOS';else if(location.origin==='https://melvoridle.com')
tag='Web';PlayFabClientSDK.ExecuteCloudScript({FunctionName:'applyPlayerTag',FunctionParameter:{device:tag}},()=>{});};