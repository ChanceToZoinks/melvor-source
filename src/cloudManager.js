"use strict";var __awaiter=(this&&this.__awaiter)||function(thisArg,_arguments,P,generator){function adopt(value){return value instanceof P?value:new P(function(resolve){resolve(value);});}
return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}
function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}
function step(result){result.done?resolve(result.value):adopt(result.value).then(fulfilled,rejected);}
step((generator=generator.apply(thisArg,_arguments||[])).next());});};class CloudManager{constructor(){this.TITLE_ID='E3855';this.enableAccountCreation=true;this.enableMelvorCloudRegistration=true;this.enableSkipRegistration=true;this.maxSaveSlots=6;this.enableSignInWithApple=false;this.enableSignInWithGoogle=false;this.enableSignInWithMelvorCloud=true;this.enableMelvorCloudBypass=false;this.melvorCloudLoginURL='cloud/api/';this.grandfatheredTimestamp=1634774400000;this.expansionRelease=1666281300000;this.accountCreated='';this.isAuthenticated=false;this.canAccessTest=false;this.DEBUG=false;this.appleToken='';this.googleToken='';this.customID='';this.JWT='';this.disableSocialSignIn=false;this.accountInfo={};this.playfabSaves={};this.patreonAccessToken='';this.patreonRefreshToken='';this.entitlements={fullGame:false,TotH:false,};this.formElements={default:{title:document.getElementById('formElements-default-title'),logo:document.getElementById('formElements-default-logo'),},signIn:{container:document.getElementById('formElements-signIn-container'),submit:document.getElementById('formElements-signIn-submit'),username:document.getElementById('formElements-signIn-username'),password:document.getElementById('formElements-signIn-password'),error:document.getElementById('formElements-signIn-error'),withSocialsTitle:document.getElementById('formElements-signIn-withSocialsTitle'),},register:{container:document.getElementById('formElements-register-container'),submit:document.getElementById('formElements-register-submit'),username:document.getElementById('formElements-register-username'),password:document.getElementById('formElements-register-password'),confirmPassword:document.getElementById('formElements-register-confirmPassword'),email:document.getElementById('formElements-register-email'),error:document.getElementById('formElements-register-error'),},forgot:{container:document.getElementById('formElements-forgot-container'),submit:document.getElementById('formElements-forgot-submit'),email:document.getElementById('formElements-forgot-email'),error:document.getElementById('formElements-forgot-error'),},characterSelect:{email:{input:document.getElementById('formElements-characterSelect-email-input'),submit:document.getElementById('formElements-characterSelect-email-submit'),error:document.getElementById('formElements-characterSelect-email-error'),},changePassword:{currentPassword:document.getElementById('formElements-characterSelect-changePassword-currentPassword'),newPassword:document.getElementById('formElements-characterSelect-changePassword-newPassword'),confirmNewPassword:document.getElementById('formElements-characterSelect-changePassword-confirmNewPassword'),submit:document.getElementById('formElements-characterSelect-changePassword-submit'),error:document.getElementById('formElements-characterSelect-changePassword-error'),},},signInWithApple:{native:document.getElementById('formElements-signInWithApple-native'),browser:document.getElementById('appleid-signin'),},signInWithGoogle:{native:document.getElementById('formElements-signInWithGoogle-native'),browser:document.getElementById('formElements-signInWithGoogle-browser'),},env:{container:document.getElementById('formElements-env-container'),baseGame:document.getElementById('formElements-env-baseGame'),testServer:document.getElementById('formElements-env-testServer'),desktopTest:document.getElementById('formElements-env-desktopTest'),mobileTest:document.getElementById('formElements-env-mobileTest'),patreonConnect:document.getElementById('formElements-env-patreonConnect'),},language:{container:document.getElementById('formElements-language-container'),},debug:{container:document.getElementById('formElements-debug-container'),log:document.getElementById('formElements-debug-log'),status:document.getElementById('page-loader-status-text'),pageLoader:document.getElementById('m-page-loader'),},};this.formInnerHTML={signIn:{submit:{original:'',},},register:{submit:{original:'',},},forgot:{submit:{original:'',},},changePassword:{submit:{original:'',},},};if(this.isOnAuthPage)
this.onAuthPageLoad();}
get inProgressSpinner(){return `<div class="spinner-border spinner-border-sm text-light" role="status"><span class="sr-only">Loading...</span></div>`;}
get btnSubmitInnerHTML(){return `<i class="fa fa-fw fa-sign-in-alt mr-1 opacity-50"></i> <lang-string lang-cat="CHARACTER_SELECT" lang-id="6"></lang-string>`;}
get btnPatreonConnectSpinner(){return `<div class="spinner-border spinner-border-sm text-light" role="status"><span class="sr-only">Please wait...</span></div>`;}
get isTest(){return location.origin.includes('test.melvoridle.com');}
checkAuthentication(){return __awaiter(this,void 0,void 0,function*(){this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_AUTH_CLOUD'));return this.isAuthenticated;});}
get hasFullVersionEntitlement(){return this.entitlements.fullGame||nativeManager.isSteam;}
get hasTotHEntitlement(){return this.entitlements.TotH;}
onAuthPageLoad(){if(!this.isOnAuthPage)
return;this.initDebug();this.createOnClickEvents();if(!this.enableSignInWithApple)
this.removeSignInWithApple();if(!this.enableSignInWithGoogle)
this.removeSignInWithGoogle();if(!this.enableSignInWithApple&&!this.enableSignInWithGoogle)
this.hideSignInWithSocialsTitle();}
hidePageLoader(){this.formElements.debug.pageLoader.classList.add('d-none');this.formElements.debug.pageLoader.classList.remove('show');}
showPageLoader(){this.setStatus('Loading...');this.formElements.debug.pageLoader.classList.add('show');this.formElements.debug.pageLoader.classList.remove('d-none');}
hideAllContainers(){this.hideSignInContainer();this.hideRegisterContainer();this.hideForgotContainer();this.hideEnvSelectionContainer();}
showEnvSelectionContainer(){this.formElements.env.container.classList.remove('d-none');}
hideEnvSelectionContainer(){this.formElements.env.container.classList.add('d-none');}
hideSignInContainer(){this.formElements.signIn.container.classList.add('d-none');}
showSignInContainer(){this.hideAllContainers();this.formElements.default.title.innerText='Sign In';this.formElements.signIn.container.classList.remove('d-none');}
showRegisterContainer(){if(!this.enableMelvorCloudRegistration||this.isTest)
return this.registrationDisabled();this.hideAllContainers();this.formElements.default.title.innerText='Register';this.formElements.register.container.classList.remove('d-none');}
hideRegisterContainer(){this.formElements.register.container.classList.add('d-none');}
showForgotContainer(){this.hideAllContainers();this.formElements.default.title.innerText='Forgot Password';this.formElements.forgot.container.classList.remove('d-none');}
hideForgotContainer(){this.formElements.forgot.container.classList.add('d-none');}
removeSignInWithApple(){const elements=document.getElementsByClassName('signInWithApple');while(elements.length>0){elements[0].remove();}}
removeSignInWithGoogle(){const elements=document.getElementsByClassName('signInWithGoogle');while(elements.length>0){elements[0].remove();}}
hideSignInWithSocialsTitle(){this.formElements.signIn.withSocialsTitle.classList.add('d-none');}
showSignInWithSocialsTitle(){this.formElements.signIn.withSocialsTitle.classList.remove('d-none');}
showLanguageSelection(){this.hideAllContainers();this.formElements.language.container.classList.remove('d-none');}
getOldCloudTokens(){const selector=this.getCookie('random_selector');const random_password=this.getCookie('random_password');const username=this.getCookie('member_login');return{selector,random_password,username};}
hasOldCloudTokens(){const{selector,random_password,username}=this.getOldCloudTokens();return selector!==undefined&&random_password!==undefined&&username!==undefined;}
initSilentSignIn(){return __awaiter(this,void 0,void 0,function*(){this.getTokensFromLocalStorage();if((nativeManager.isIOS||nativeManager.isAndroid)&&!nativeManager.isNativeApp){location.href='updateApp.php';return;}
this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_ATTEMPTING_SIGN_IN'));if(this.JWT!==''){this.log('Silent Sign in with JWT');try{const data=yield this.performJWTValidation(this.JWT);this.saveDataFromJWT(data);this.initPlayFabLogin('customID');this.isAuthenticated=true;return;}
catch(e){this.isAuthenticated=false;this.log('JWT validation failed: '+e);this.removeJWTFromLocalStorage();if(this.enableMelvorCloudBypass){if(localStorage.getItem('playFabID')!==null){this.customID=localStorage.getItem('playFabID');this.initPlayFabLogin('customID');}
else if(!this.isOnAuthPage)
return(location.href='index.php');}
if(!this.isOnAuthPage&&!this.enableMelvorCloudBypass)
return(location.href='index.php');else
this.finalizeSignIn();}}
else if(this.hasOldCloudTokens()){this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_CONVERTING_TOKENS'));yield this.performMelvorCloudConversion();}
else if(this.enableMelvorCloudBypass){if(localStorage.getItem('playFabID')!==null){this.customID=localStorage.getItem('playFabID');this.initPlayFabLogin('customID');}
else if(!this.isOnAuthPage&&!this.enableSkipRegistration)
return(location.href='index.php');else
this.finalizeSignIn();}
else if(this.isTest&&!this.enableMelvorCloudBypass&&!this.isOnAuthPage){return(location.href='index.php');}
else{this.finalizeSignIn();}
if(this.appleToken!==''){return;}
if(this.googleToken!==''){return;}});}
performMelvorCloudConversion(){return __awaiter(this,void 0,void 0,function*(){if(!this.hasOldCloudTokens())
Promise.reject('No old cloud tokens found');const{selector,random_password,username}=this.getOldCloudTokens();this.log('Initiated Melvor Cloud token conversion');let loginRejected=false;try{const loginResponse=yield this.convertMelvorCloudViaPOST(selector,random_password,username);if(loginResponse.jwt!==undefined){try{const data=yield this.performJWTValidation(loginResponse.jwt);this.deleteOldTokenCookies();this.continueSuccessfulMelvorCloudLogin(data);}
catch(e){this.finalizeSignIn();}}
else{loginRejected=true;this.log(loginResponse.message);}}
catch(e){loginRejected=true;}
if(loginRejected)
this.finalizeSignIn();});}
deleteOldTokenCookies(){this.deleteCookie('member_login');this.deleteCookie('random_selector');this.deleteCookie('random_password');}
continueSuccessfulMelvorCloudLogin(data){this.saveDataFromJWT(data);this.initPlayFabLogin('customID');this.isAuthenticated=true;}
convertMelvorCloudViaPOST(selector,random_password,username){this.log('Converting Melvor Cloud tokens to JWT via POST');return new Promise(function(resolve,reject){const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'loginWithOldToken.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{try{resolve(JSON.parse(xhr.response));}
catch(e){reject();}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const data=JSON.stringify({member_login:username,random_selector:selector,random_password:random_password,});xhr.send(data);});}
isNativeAppLoadedYet(){return new Promise((resolve)=>{let attempts=0;const maxAttempts=50;const interval=setInterval(()=>{if(nativeManager.nativeAppIAPLoaded){clearInterval(interval);resolve(true);}
attempts++;if(attempts>=maxAttempts){clearInterval(interval);resolve(false);}},100);});}
finalizeSignIn(){return __awaiter(this,void 0,void 0,function*(){this.log('Authenticated w/ Melvor Cloud: '+this.isAuthenticated);this.log('Authenticated w/ PlayFab: '+PlayFabClientSDK.IsClientLoggedIn());if(!this.isOnAuthPage){if(nativeManager.isNativeApp&&!nativeManager.nativeAppIAPLoaded){const nativeLoaded=yield this.isNativeAppLoadedYet();if(!nativeLoaded)
console.warn('Native App IAP failed to load.');}
const hasFull=yield this.hasFullGame();if(hasFull){yield this.hasTotH();}
initGameClass();this.log('Loading Game Data...');this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_LOADING_GAME_DATA'));try{yield loadGameData();}
catch(e){this.handleLoadingError('Error Loading Game Data',e);return;}
if(this.hasFullVersionEntitlement){this.log('Initializing Mod Manager...');this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_LOADING_MOD_MANAGER'));yield mod.manager.init();}
try{game.postDataRegistration();}
catch(e){this.handleLoadingError('Error in Game Post Data Registration',e);return;}
this.log('Loading Local Saves...');this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_LOCAL_SAVES'));yield updateLocalSaveHeaders();if(PlayFabClientSDK.IsClientLoggedIn()){this.log('Loading Cloud Saves...');this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_CLOUD_SAVES'));yield this.refreshPlayFabSaves();}
this.log('Saves retrieved');loadCharacterSelection();}
else if(PlayFabClientSDK.IsClientLoggedIn()){if(nativeManager.isNativeApp)
location.href='index_mobile.php';else
location.href='index_game.php';return;}
onloadEvent(false);this.hidePageLoader();});}
getTokensFromLocalStorage(){const appleAuthToken=localStorage.getItem('appleAuthToken');this.appleToken=appleAuthToken?appleAuthToken:'';const googleAuthToken=localStorage.getItem('googleAuthToken');this.googleToken=googleAuthToken?googleAuthToken:'';const melvorCloudAuthToken=localStorage.getItem('melvorCloudAuthToken');this.JWT=melvorCloudAuthToken?melvorCloudAuthToken:'';}
removeJWTFromLocalStorage(){localStorage.removeItem('melvorCloudAuthToken');}
removeAppleTokenFromLocalStorage(){localStorage.removeItem('appleAuthToken');}
removeGoogleTokenFromLocalStorage(){localStorage.removeItem('googleAuthToken');}
getCookie(name){const value=`; ${document.cookie}`;const parts=value.split(`; ${name}=`);if(parts!==undefined&&parts.length===2)
return parts.pop().split(';').shift();}
deleteCookie(name){document.cookie=name+'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';}
handleSignInWithApple(token){if(token!==undefined)
this.storeAppleToken(token);this.initPlayFabLogin('apple');}
handleSignInWithGoogle(token){if(token!==undefined)
this.storeGoogleToken(token);this.initPlayFabLogin('google');}
storeAppleToken(token){this.log('Storing Apple Token');this.appleToken=token;localStorage.setItem('appleAuthToken',token);}
storeGoogleToken(token){this.log('Storing Google Token');this.googleToken=token;localStorage.setItem('googleAuthToken',token);}
storeMelvorCloudToken(token){this.log('Storing Melvor Cloud Token');this.JWT=token;localStorage.setItem('melvorCloudAuthToken',token);}
initSignIn(){this.log('Initiating sign in');this.disableSignInForm();this.showSignInProgressSpinner();this.hideSignInError();}
initRegistration(){this.log('Initiating registration');this.disableRegisterForm();this.showRegisterProgressSpinner();this.hideRegisterError();}
initForgotPassword(){this.log('Initiating forgot password');this.disableForgotForm();this.showForgotProgressSpinner();this.hideForgotError();}
initChangeEmail(){this.log('Initiating change email');this.disableChangeEmailForm();this.showChangeEmailProgressSpinner();this.hideChangeEmailError();}
initChangePassword(){this.log('Initiating change password');this.disableChangePasswordForm();this.showChangePasswordProgressSpinner();this.hideChangePasswordError();}
disableSignInForm(){this.disableSocialSignIn=true;this.formElements.signIn.username.disabled=true;this.formElements.signIn.password.disabled=true;this.formElements.signIn.submit.disabled=true;}
enableSignInForm(){this.disableSocialSignIn=false;this.formElements.signIn.username.disabled=false;this.formElements.signIn.password.disabled=false;this.formElements.signIn.submit.disabled=false;}
disableRegisterForm(){this.disableSocialSignIn=true;this.formElements.register.username.disabled=true;this.formElements.register.password.disabled=true;this.formElements.register.confirmPassword.disabled=true;this.formElements.register.email.disabled=true;this.formElements.register.submit.disabled=true;}
enableRegisterForm(){this.disableSocialSignIn=false;this.formElements.register.username.disabled=false;this.formElements.register.password.disabled=false;this.formElements.register.confirmPassword.disabled=false;this.formElements.register.email.disabled=false;this.formElements.register.submit.disabled=false;}
disableForgotForm(){this.disableSocialSignIn=true;this.formElements.forgot.email.disabled=true;this.formElements.forgot.submit.disabled=true;}
enableForgotForm(){this.disableSocialSignIn=false;this.formElements.forgot.email.disabled=false;this.formElements.forgot.submit.disabled=false;}
disableChangeEmailForm(){this.formElements.characterSelect.email.input.disabled=true;this.formElements.characterSelect.email.submit.disabled=true;}
enableChangeEmailForm(){this.formElements.characterSelect.email.input.disabled=false;this.formElements.characterSelect.email.submit.disabled=false;}
disableChangePasswordForm(){this.formElements.characterSelect.changePassword.currentPassword.disabled=true;this.formElements.characterSelect.changePassword.newPassword.disabled=true;this.formElements.characterSelect.changePassword.confirmNewPassword.disabled=true;this.formElements.characterSelect.changePassword.submit.disabled=true;}
enableChangePasswordForm(){this.formElements.characterSelect.changePassword.currentPassword.disabled=false;this.formElements.characterSelect.changePassword.newPassword.disabled=false;this.formElements.characterSelect.changePassword.confirmNewPassword.disabled=false;this.formElements.characterSelect.changePassword.submit.disabled=false;}
showSignInProgressSpinner(){this.formInnerHTML.signIn.submit.original=this.formElements.signIn.submit.innerHTML;this.formElements.signIn.submit.innerHTML=this.inProgressSpinner;}
hideSignInProgressSpinner(){this.formElements.signIn.submit.innerHTML=this.formInnerHTML.signIn.submit.original;}
showRegisterProgressSpinner(){this.formInnerHTML.register.submit.original=this.formElements.register.submit.innerHTML;this.formElements.register.submit.innerHTML=this.inProgressSpinner;}
hideRegisterProgressSpinner(){this.formElements.register.submit.innerHTML=this.formInnerHTML.register.submit.original;}
showForgotProgressSpinner(){this.formInnerHTML.forgot.submit.original=this.formElements.forgot.submit.innerHTML;this.formElements.forgot.submit.innerHTML=this.inProgressSpinner;}
hideForgotProgressSpinner(){this.formElements.forgot.submit.innerHTML=this.formInnerHTML.forgot.submit.original;}
showChangeEmailProgressSpinner(){this.formInnerHTML.changePassword.submit.original=this.formElements.characterSelect.email.submit.innerHTML;this.formElements.characterSelect.email.submit.innerHTML=this.inProgressSpinner;}
hideChangeEmailProgressSpinner(){this.formElements.characterSelect.email.submit.innerHTML=this.formInnerHTML.changePassword.submit.original;}
showChangePasswordProgressSpinner(){this.formInnerHTML.changePassword.submit.original=this.formElements.characterSelect.changePassword.submit.innerHTML;this.formElements.characterSelect.changePassword.submit.innerHTML=this.inProgressSpinner;}
hideChangePasswordProgressSpinner(){this.formElements.characterSelect.changePassword.submit.innerHTML=this.formInnerHTML.changePassword.submit.original;}
createOnClickEvents(){if(this.enableSignInWithApple)
this.createSignInWithAppleEvent();if(this.enableSignInWithGoogle)
this.createSignInWithGoogleEvent();if(this.isOnAuthPage){this.createLoginToMelvorCloudEvents();this.createRegisterToMelvorCloudEvents();this.createForgortPasswordCloudEvents();}
else{this.createChangeEmailCloudEvents();this.createChangePasswordCloudEvents();}}
createLoginToMelvorCloudEvents(){this.formElements.signIn.submit.onclick=(e)=>{this.initSignIn();this.loginToMelvorCloud();e.preventDefault();};}
createRegisterToMelvorCloudEvents(){this.formElements.register.submit.onclick=(e)=>{this.initRegistration();this.registerToMelvorCloud();e.preventDefault();};}
createForgortPasswordCloudEvents(){this.formElements.forgot.submit.onclick=(e)=>{this.initForgotPassword();this.forgotPasswordToMelvorCloud();e.preventDefault();};}
createChangeEmailCloudEvents(){this.formElements.characterSelect.email.submit.onclick=(e)=>{this.initChangeEmail();this.updateEmailAddress();e.preventDefault();};}
performChanceEmail(){this.initChangeEmail();this.updateEmailAddress();}
createChangePasswordCloudEvents(){}
createSignInWithAppleEvent(){this.formElements.signInWithApple.native.onclick=()=>{if(this.disableSocialSignIn)
return;this.initSignIn();this.log('Sign in with Apple');if(nativeManager.isNativeApp){this.log('Calling native social login');gonative.socialLogin.apple.login({callback:signInWithAppleCallback,scope:'full_name, email',});}};}
createSignInWithGoogleEvent(){this.formElements.signInWithGoogle.native.onclick=()=>{if(this.disableSocialSignIn)
return;this.initSignIn();this.log('Sign in with Google');if(nativeManager.isNativeApp){this.log('Calling native social login');gonative.socialLogin.google.login({callback:signInWithGoogleCallback,});}};}
playfabAPI(endpoint,requestObject){return new Promise(function(resolve,reject){PlayFabClientSDK[endpoint](requestObject,function(result,error){if(error!==null){return reject(new Error(PlayFab.GenerateErrorReport(error)));}
else if(result&&result.code==200){return resolve(result);}
else{return reject(new Error(result.status));}});});}
initPlayFabLogin(method){return __awaiter(this,void 0,void 0,function*(){this.log(`Initializing PlayFab login. Method: ${method}`);let authorized;switch(method){case 'apple':authorized=yield this.loginWithAppleViaPlayFab();break;case 'google':authorized=yield this.loginWithGoogleViaPlayFab();break;case 'customID':try{authorized=yield this.loginWithCustomIDViaPlayFab();}
catch(e){this.removeJWTFromLocalStorage();}}
if(authorized&&authorized.code===200){this.handleSuccessfulSignIn();}
else if(method==='apple'||method==='google')
this.failSocialSignIn();else
this.handleFailedSignIn();});}
refreshPlayFabToken(method){return __awaiter(this,void 0,void 0,function*(){this.log(`Initializing PlayFab login. Method: ${method}`);let authorized;switch(method){case 'apple':authorized=yield this.loginWithAppleViaPlayFab();break;case 'google':authorized=yield this.loginWithGoogleViaPlayFab();break;case 'customID':try{authorized=yield this.loginWithCustomIDViaPlayFab();}
catch(e){this.removeJWTFromLocalStorage();}}});}
loginWithCustomIDViaPlayFab(){this.log('Logging in with Custom ID via PlayFab');this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_PLAYFAB'));if(this.customID!=''){const request={CustomId:this.customID,TitleId:PlayFab.settings.titleId,CreateAccount:this.enableAccountCreation,};return this.playfabAPI('LoginWithCustomID',request).then((result)=>{if(result.code===200)
this.log('Login with custom ID success');return Promise.resolve(result);}).catch((error)=>{this.log(error);return Promise.reject(error);});}
else{this.log('Custom ID is empty');return Promise.reject('Custom ID is empty');}}
loginWithAppleViaPlayFab(){this.log('Logging in with Apple via PlayFab');if(this.appleToken!=''){const request={IdentityToken:this.appleToken,TitleId:PlayFab.settings.titleId,CreateAccount:this.enableAccountCreation,};return this.playfabAPI('LoginWithApple',request).then((result)=>{if(result.code===200)
this.log('Login with apple success');return Promise.resolve(result);}).catch((error)=>{this.log(error);return Promise.reject(error);});}
else{this.log('Apple Token is empty');return Promise.reject('Apple Token is empty');}}
linkAppleToPlayFab(){this.log('Linking Apple to PlayFab account');if(!PlayFabClientSDK.IsClientLoggedIn())
return Promise.reject('Player not logged in');if(this.appleToken!=''){const request={IdentityToken:this.appleToken};return this.playfabAPI('LinkApple',request).then((result)=>{if(result.code===200)
this.log('Link apple success');Promise.resolve(result);}).catch((error)=>{this.log(error);Promise.reject(error);});}
else{this.log('Apple Token is empty');return Promise.reject('Apple Token is empty');}}
loginWithGoogleViaPlayFab(){this.log('Logging in with Google via PlayFab');if(this.googleToken!=''){const request={AccessToken:this.googleToken,TitleId:PlayFab.settings.titleId,CreateAccount:this.enableAccountCreation,};return this.playfabAPI('LoginWithGoogleAccount',request).then((result)=>{if(result.code===200)
this.log('Login with google success');return Promise.resolve(result);}).catch((error)=>{this.log(error);return Promise.reject(error);});}
else{this.log('Google Token is empty');return Promise.reject('Google Token is empty');}}
linkGoogleToPlayFab(){this.log('Linking Google to PlayFab account');if(!PlayFabClientSDK.IsClientLoggedIn())
return Promise.reject('Player not logged in');if(this.googleToken!=''){const request={IdentityToken:this.googleToken};return this.playfabAPI('LinkGoogleAccount',request).then((result)=>{if(result.code===200)
this.log('Link Google success');Promise.resolve(result);}).catch((error)=>{this.log(error);Promise.reject(error);});}
else{this.log('Google token is empty');return Promise.reject('Google token is empty');}}
failSocialSignIn(){this.log('Social sign in failed');if(!this.formElements.signIn.submit.disabled)
return;this.handleFailedSignIn();}
handleFailedSignIn(){this.enableSignInForm();this.hideSignInProgressSpinner();}
handleSuccessfulSignIn(){return __awaiter(this,void 0,void 0,function*(){try{let canAccess=true;if(this.isTest)
canAccess=yield this.checkTestAccess();if(!canAccess)
return this.accessDenied();if(this.isOnAuthPage&&this.isTest)
return this.signInRedirect();const accountInfo=yield this.getAccountInfo();this.accountInfo=accountInfo.data.AccountInfo;this.log('Account info retrieved');yield this.performRequireAccountUpdates();this.finalizeSignIn();}
catch(error){this.removeJWTFromLocalStorage();this.log(error);}});}
refreshPlayFabSaves(){return __awaiter(this,void 0,void 0,function*(){const saves=yield this.getSavesFromPlayFab();this.playfabSaves=saves.data.Data;if(!this.isOnAuthPage)
yield updateCloudSaveHeaders();});}
signInRedirect(){this.hideSignInContainer();this.showEnvContainer();this.showTestServerSelectionBtn();this.hidePageLoader();}
get isOnAuthPage(){return(!location.href.includes('index_noads.php')&&!location.href.includes('index_game.php')&&!location.href.includes('index_ads.php')&&!location.href.includes('index_mobile.php')&&!location.href.includes('siwg_test.html'));}
accessDenied(){this.log(`You do not have access to the Test Server.`);this.displaySignInError(`You do not have access to the Test Server. Please connect to Patreon.`);}
displaySignInError(msg){this.formElements.signIn.error.innerText=msg;this.formElements.signIn.error.classList.remove('d-none');}
hideSignInError(){this.formElements.signIn.error.classList.add('d-none');}
displayRegisterError(msg){this.formElements.register.error.innerText=msg;this.formElements.register.error.classList.remove('d-none');}
hideRegisterError(){this.formElements.register.error.classList.add('d-none');}
displayForgotError(msg){this.formElements.forgot.error.innerText=msg;this.formElements.forgot.error.classList.remove('d-none');}
hideForgotError(){this.formElements.forgot.error.classList.add('d-none');}
displayChangeEmailError(msg){this.formElements.characterSelect.email.error.innerText=msg;this.formElements.characterSelect.email.error.classList.remove('d-none');}
hideChangeEmailError(){this.formElements.characterSelect.email.error.classList.add('d-none');}
displayChangePasswordError(msg){this.formElements.characterSelect.changePassword.error.innerText=msg;this.formElements.characterSelect.changePassword.error.classList.remove('d-none');}
hideChangePasswordError(){this.formElements.characterSelect.changePassword.error.classList.add('d-none');}
getAccountInfo(){this.log('Getting account info');this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_ACCOUNT_INFO'));return this.playfabAPI('GetAccountInfo',{});}
getSavesFromPlayFab(){this.log('Getting saves from playfab');this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_FETCHING_CLOUD'));return this.playfabAPI('GetUserData',{Keys:this.getPlayFabSaveKeys()});}
performRequireAccountUpdates(){return __awaiter(this,void 0,void 0,function*(){if(nativeManager.isSteam)
linkSteamAccountToPlayFab();if(nativeManager.isNativeApp&&nativeManager.receiptData!==undefined){this.validateMobilePurchaseStatus();this.validateMobileExpansionPurchaseStatus();}
return Promise.resolve(true);});}
getPlayFabSaveKeys(){const keys=[];for(let i=0;i<this.maxSaveSlots;i++){keys.push(this.getPlayFabSaveKey(i));}
return keys;}
skipCloudAuthentication(){if(!this.enableSkipRegistration||this.isTest)
return this.skipDisabled();SwalLocale.fire({title:'Skip Cloud Authentication?',html:`<h5 class="font-w600 text-combat-smoke font-size-sm mb-2">A Cloud account allows you to continue your progress on any platform Melvor Idle is available on.</h5><h5 class="font-w400 text-combat-smoke font-size-sm mb-2">Skipping means your saves will be stored locally on your device and will not be backed up to the Cloud.</h5><h5 class="font-w400 text-combat-smoke font-size-sm mb-2">Local saves cannot be restored if lost.</h5>`,showCancelButton:true,icon:'warning',confirmButtonText:'Skip',}).then((result)=>{if(result.value){if(nativeManager.isNativeApp)
location.href='index_mobile.php';else
location.href='index_game.php';}});}
registrationDisabled(){SwalLocale.fire({title:'Registration Disabled',html:`<h5 class="font-w600 text-combat-smoke font-size-sm mb-2">Registration is currently disabled.</h5>`,icon:'warning',});}
skipDisabled(){SwalLocale.fire({title:'Skip Cloud Authentication?',html:`<h5 class="font-w600 text-combat-smoke font-size-sm mb-2">Skipping authentication is currently disabled.</h5>`,icon:'warning',});}
initDebug(){if(!this.DEBUG)
return;this.formElements.debug.log.classList.remove('d-none');}
log(message){console.log(message);if(this.isOnAuthPage&&this.DEBUG){const element=document.createElement('div');element.classList.add('font-size-xs');element.innerText=message;this.formElements.debug.log.append(element);}}
setStatus(message){this.formElements.debug.status.innerText=message;}
isLoginFormValid(){return this.formElements.signIn.username.value!==''&&this.formElements.signIn.password.value!=='';}
isChangeEmailFormValid(){return this.formElements.characterSelect.email.input.value!=='';}
isChangePasswordFormValid(){return(this.formElements.characterSelect.changePassword.currentPassword.value!==''&&this.formElements.characterSelect.changePassword.newPassword.value!==''&&this.formElements.characterSelect.changePassword.confirmNewPassword.value!==''&&this.doChangePasswordsMatch());}
doChangePasswordsMatch(){return(this.formElements.characterSelect.changePassword.newPassword.value===this.formElements.characterSelect.changePassword.confirmNewPassword.value);}
isRegisterFormValid(){return(this.formElements.register.username.value!==''&&this.formElements.register.password.value!==''&&this.formElements.register.confirmPassword.value!==''&&this.formElements.register.email.value!==''&&this.doRegisterPasswordsMatch());}
isForgotFormValid(){return this.formElements.forgot.email.value!=='';}
doRegisterPasswordsMatch(){return this.formElements.register.password.value===this.formElements.register.confirmPassword.value;}
getLoginFormInput(){const username=this.formElements.signIn.username.value;const password=this.formElements.signIn.password.value;return{username,password};}
getRegisterFormInput(){const username=this.formElements.register.username.value;const password=this.formElements.register.password.value;const confirmPassword=this.formElements.register.confirmPassword.value;const email=this.formElements.register.email.value;return{username,password,confirmPassword,email};}
getForgotFormInput(){const email=this.formElements.forgot.email.value;return email;}
getChangeEmailFormInput(){const email=this.formElements.characterSelect.email.input.value;return email;}
getChangePasswordFormInput(){const currentPassword=this.formElements.characterSelect.changePassword.currentPassword.value;const newPassword=this.formElements.characterSelect.changePassword.newPassword.value;const confirmNewPassword=this.formElements.characterSelect.changePassword.confirmNewPassword.value;return{currentPassword,newPassword,confirmNewPassword};}
loginToMelvorCloud(){return __awaiter(this,void 0,void 0,function*(){this.log('Initiated login to Melvor Cloud');if(!this.isLoginFormValid()){this.log('Login form is invalid');this.enableSignInForm();this.hideSignInProgressSpinner();return;}
const{username,password}=this.getLoginFormInput();let loginRejected=false;try{const loginResponse=yield this.loginToMelvorCloudViaPOST(username,password);if(loginResponse.jwt!==undefined){try{const data=yield this.performJWTValidation(loginResponse.jwt);this.continueSuccessfulMelvorCloudLogin(data);}
catch(e){this.isAuthenticated=false;this.displaySignInError('Unknown Melvor Cloud error: '+e);this.enableSignInForm();this.hideSignInProgressSpinner();this.log('Login to Melvor Cloud error: '+e);}}
else{loginRejected=true;this.log(loginResponse.message);}}
catch(e){loginRejected=true;}
if(loginRejected){this.isAuthenticated=false;this.displaySignInError(getLangString('CHARACTER_SELECT','58'));this.enableSignInForm();this.hideSignInProgressSpinner();this.log('Login failed');}});}
registerToMelvorCloud(){return __awaiter(this,void 0,void 0,function*(){this.log('Initiated register to Melvor Cloud');if(!this.isRegisterFormValid()){this.log('Register form is invalid');if(!this.doRegisterPasswordsMatch())
this.displayRegisterError('Passwords do not match.');this.enableRegisterForm();this.hideRegisterProgressSpinner();return;}
const{username,password,confirmPassword,email}=this.getRegisterFormInput();let registerRejected=true;const registerResponse=yield this.registerToMelvorCloudViaPOST(username,password,confirmPassword,email);if(registerResponse.success!==undefined){try{this.registrationSuccessfulSwal();cloudManager.showSignInContainer();registerRejected=false;}
catch(e){this.isAuthenticated=false;this.displayRegisterError('Unknown Melvor Cloud error: '+e);this.log('Register to Melvor Cloud error: '+e);}
this.enableRegisterForm();this.hideRegisterProgressSpinner();}
else{this.log(registerResponse.message);this.displayRegisterError(registerResponse.message);}
if(registerRejected){this.enableRegisterForm();this.hideRegisterProgressSpinner();this.log('Registration error.');}});}
registrationSuccessfulSwal(){SwalLocale.fire({icon:'success',title:'Successfully Registered!',html:`<span class="text-dark">You may now log in.</span>`,});}
forgotPasswordToMelvorCloud(){return __awaiter(this,void 0,void 0,function*(){this.log('Initiated Forgot Password to Melvor Cloud');if(!this.isForgotFormValid()){this.log('Forgot Password form is invalid');this.enableForgotForm();this.hideForgotProgressSpinner();return;}
const email=this.getForgotFormInput();let forgotRejected=false;try{const forgotResponse=yield this.forgotPasswordToMelvorCloudViaPOST(email);if(forgotResponse.success!==undefined){try{this.forgotPasswordSuccessfulSwal();cloudManager.showSignInContainer();}
catch(e){this.isAuthenticated=false;this.displayForgotError('Unknown Melvor Cloud error: '+e);this.log('Forgot Password to Melvor Cloud error: '+e);}
this.enableForgotForm();this.hideForgotProgressSpinner();}
else{forgotRejected=true;this.log(forgotResponse.message);this.displayForgotError(forgotResponse.message);}}
catch(e){forgotRejected=true;}
if(forgotRejected){this.enableForgotForm();this.hideForgotProgressSpinner();this.log('Forgot Password failed');}});}
forgotPasswordSuccessfulSwal(){SwalLocale.fire({icon:'success',title:'Forgot Password Submitted',html:`<span class="text-dark">An email is on the way to your inbox. Please follow the instructions.<br><br>Note: Your username is displayed inside the email you receive.</span>`,});}
updateEmailAddress(){return __awaiter(this,void 0,void 0,function*(){this.log('Initiated update email address');if(!this.isChangeEmailFormValid()){this.log('Change email form is invalid');this.enableChangeEmailForm();this.hideChangeEmailProgressSpinner();return;}
const email=this.getChangeEmailFormInput();let changeRejected=false;try{const response=yield this.changeEmailMelvorCloudViaPOST(email);if(response.jwt!==undefined){try{const data=yield this.performJWTValidation(response.jwt);this.saveDataFromJWT(data);this.changeEmailSuccessfulSwal();this.enableChangeEmailForm();}
catch(e){this.displayChangeEmailError('Unknown Melvor Cloud error: '+e);this.enableChangeEmailForm();this.hideChangeEmailProgressSpinner();this.log('Change Email Melvor Cloud error: '+e);}}
else{changeRejected=true;this.log(response.message);}}
catch(e){changeRejected=true;}
if(changeRejected){this.displayChangeEmailError('Change email failed due to unknown error');this.enableChangeEmailForm();this.hideChangeEmailProgressSpinner();this.log('Change email failed');}});}
changeEmailSuccessfulSwal(){SwalLocale.fire({icon:'success',html:`<span class="text-dark">Your email has been updated successfully.</span>`,});}
changePasswordToMelvorCloud(){return __awaiter(this,void 0,void 0,function*(){this.log('Initiated change password');if(!this.isChangePasswordFormValid()){this.log('Change password form is invalid');this.enableChangePasswordForm();this.hideChangePasswordProgressSpinner();return;}
const{currentPassword,newPassword,confirmNewPassword}=this.getChangePasswordFormInput();let changeRejected=false;let rejectMessage='';try{const response=yield this.changePasswordMelvorCloudViaPOST(currentPassword,newPassword);if(response.jwt!==undefined){try{const data=yield this.performJWTValidation(response.jwt);this.saveDataFromJWT(data);this.changePasswordSuccessfulSwal();this.enableChangePasswordForm();this.hideChangePasswordProgressSpinner();}
catch(e){this.displayChangePasswordError('Unknown Melvor Cloud error: '+e);this.enableChangePasswordForm();this.hideChangePasswordProgressSpinner();this.log('Change Password Melvor Cloud error: '+e);}}
else{changeRejected=true;rejectMessage=response.message;this.log(rejectMessage);}}
catch(e){changeRejected=true;}
if(changeRejected){this.displayChangePasswordError(rejectMessage===''?'Change password failed due to unknown error':rejectMessage);this.enableChangePasswordForm();this.hideChangePasswordProgressSpinner();this.log('Change password failed');}});}
changePasswordSuccessfulSwal(){SwalLocale.fire({icon:'success',html:`<span class="text-dark">Your password has been updated successfully.</span>`,});}
saveDataFromJWT(data){this.JWTData=data;this.customID=this.JWTData.playfabID;this.accountCreated=this.JWTData.created;localStorage.setItem('playFabID',this.customID);if(this.JWTData.patreonAccessToken!==null)
this.patreonAccessToken=this.JWTData.patreonAccessToken;if(this.JWTData.patreonRefreshToken!==null)
this.patreonRefreshToken=this.JWTData.patreonRefreshToken;if(data.canTest==='1')
this.canAccessTest=true;}
performJWTValidation(jwt){return __awaiter(this,void 0,void 0,function*(){try{const validatedData=yield this.validateMelvorCloudToken(jwt);const data=validatedData.data;if(data!==undefined){this.storeMelvorCloudToken(jwt);return Promise.resolve(data);}
else if(validatedData.error!==undefined){this.log(validatedData.error);return Promise.reject('If you got here then idk what to say');}
else{this.log('If you got here then idk what to say');return Promise.reject('If you got here then idk what to say');}}
catch(e){this.log('Token validation produced an error.');this.removeJWTFromLocalStorage();return Promise.reject(e);}});}
loginToMelvorCloudViaPOST(username,password){this.log('Logging in to Melvor Cloud via POST');return new Promise(function(resolve,reject){const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'login.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{try{resolve(JSON.parse(xhr.response));}
catch(e){reject();}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const data=JSON.stringify({username:username,password:password});xhr.send(data);});}
registerToMelvorCloudViaPOST(username,password,confirmPassword,email){this.log('Registering Melvor Cloud via POST');return new Promise(function(resolve,reject){const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'createUser.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{try{resolve(JSON.parse(xhr.response));}
catch(e){reject();}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const data=JSON.stringify({username:username,password:password,confirmPassword:confirmPassword,email:email,});xhr.send(data);});}
forgotPasswordToMelvorCloudViaPOST(email){this.log('Forgot Password to Melvor Cloud via POST');return new Promise(function(resolve,reject){const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'forgotPassword.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{try{resolve(JSON.parse(xhr.response));}
catch(e){reject();}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const data=JSON.stringify({email:email,});xhr.send(data);});}
changeEmailMelvorCloudViaPOST(email){this.log('Changing email to Melvor Cloud via POST');if(this.JWTData===undefined)
return Promise.reject('JWTData is undefined');return new Promise(function(resolve,reject){const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'updateEmail.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{try{resolve(JSON.parse(xhr.response));}
catch(e){reject();}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const data=JSON.stringify({email:email,jwt:cloudManager.JWT,});xhr.send(data);});}
changePasswordMelvorCloudViaPOST(currentPassword,newPassword){this.log('Changing password to Melvor Cloud via POST');if(this.JWTData===undefined)
return Promise.reject('JWTData is undefined');return new Promise(function(resolve,reject){var _a;const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'updateUser.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{try{resolve(JSON.parse(xhr.response));}
catch(e){reject();}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const email=(_a=cloudManager.JWTData)===null||_a===void 0?void 0:_a.email;const data=JSON.stringify({email:email,newPassword:newPassword,currentPassword:currentPassword,jwt:cloudManager.JWT,});xhr.send(data);});}
validateMelvorCloudToken(token){this.log('Validating Melvor Cloud token');return new Promise(function(resolve,reject){const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'validateToken.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300){resolve(JSON.parse(xhr.response));}
else{reject({status:xhr.status,statusText:xhr.statusText,});}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const data=JSON.stringify({jwt:token});xhr.send(data);});}
showEnvContainer(){this.formElements.env.container.classList.remove('d-none');}
showPatreonConnectBtn(){this.formElements.env.patreonConnect.classList.remove('d-none');}
showTestServerSelectionBtn(){this.formElements.env.desktopTest.classList.remove('d-none');this.formElements.env.mobileTest.classList.remove('d-none');}
showBaseGameBtn(){this.formElements.env.baseGame.classList.remove('d-none');}
showTestServerBtn(){this.formElements.env.testServer.classList.remove('d-none');}
accessBaseGame(){location.href='https://melvoridle.com/';}
accessTestServer(device='desktop'){switch(device){case 'desktop':location.href='index_game.php';break;case 'mobile':location.href='index_mobile.php';break;}}
connectToPatreon(){this.removeJWTFromLocalStorage();this.formElements.env.patreonConnect.innerHTML=this.btnPatreonConnectSpinner;location.href='https://test.melvoridle.com/cloud/patreon.php';}
checkTestAccess(){return __awaiter(this,void 0,void 0,function*(){this.log('Checking access to test server');const canAccess=yield this.checkPatreon();this.log('Can Access? '+canAccess);if(canAccess){this.log('Access Confirmed');return Promise.resolve(canAccess);}
else{this.log('Access Denied');this.hideSignInContainer();this.showEnvContainer();this.showPatreonConnectBtn();this.removeJWTFromLocalStorage();return Promise.resolve(canAccess);}});}
checkPatreon(){return __awaiter(this,void 0,void 0,function*(){if(this.canAccessTest)
return Promise.resolve(true);this.log('Checking Patreon');let validated=false;if(this.patreonAccessToken===''||this.patreonRefreshToken===''){this.log('No Patreon Access Token or Refresh Token');return Promise.resolve(false);}
try{const patreonData=yield this.getPatreonData();validated=this.validatePatreonSubscription(patreonData);}
catch(e){this.log('Error checking Patreon: '+e);this.removeJWTFromLocalStorage();return Promise.resolve(false);}
return Promise.resolve(validated);});}
getPatreonData(){this.log('Checking if user has test access via Patreon');return new Promise(function(resolve,reject){const xhr=new XMLHttpRequest();xhr.open('POST',cloudManager.melvorCloudLoginURL+'checkPatreon.php');xhr.setRequestHeader('Content-Type','application/json');xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300){resolve(JSON.parse(xhr.response));}
else{reject({status:xhr.status,statusText:xhr.statusText,});}};xhr.onerror=()=>{reject({status:xhr.status,statusText:xhr.statusText,});};const data=JSON.stringify({checkPatreon:1,accessToken:cloudManager.patreonAccessToken,refreshToken:cloudManager.patreonRefreshToken,});xhr.send(data);});}
validatePatreonSubscription(data){let valid=false;if(data.included!==undefined){for(let i=0;i<data.included.length;i++){const status=data.included[i].attributes.patron_status;const currentEntitlement=data.included[i].attributes.currently_entitled_amount_cents;if(status=='active_patron'&&currentEntitlement>=440)
valid=true;}}
return valid;}
getPlayFabSaveKey(saveSlot){return this.isTest?`save${saveSlot}_test`:`save${saveSlot}`;}
getPlayFabSave(saveSlot){const key=this.getPlayFabSaveKey(saveSlot);return this.playfabSaves[key]===undefined?'':this.playfabSaves[key].Value;}
updateUIForPlayFabSignIn(){var _a,_b,_c,_d;if(PlayFabClientSDK.IsClientLoggedIn()){connectionSuccessPlayFab();connectedToPlayFab=true;playFabLoginTimestamp=new Date().getTime();console.log('Connected to PlayFab successfully');setAutoCloudSaveInterval();(_a=document.getElementById('header-cloud-save-btn-disconnected'))===null||_a===void 0?void 0:_a.classList.add('d-none');(_b=document.getElementById('header-cloud-save-btn-connecting'))===null||_b===void 0?void 0:_b.classList.add('d-none');(_c=document.getElementById('header-cloud-save-btn-connected'))===null||_c===void 0?void 0:_c.classList.remove('d-none');(_d=document.getElementById('header-cloud-save-time'))===null||_d===void 0?void 0:_d.classList.remove('d-none');updateMobilePurchaseStatus();submitQueuedPlayFabEvents();enableCloudCharacterButton();}
else{connectionFailedPlayFab();document.querySelectorAll('.cloud-connection-status-spinner').forEach((element)=>{element.textContent='There was an issue logging into the PlayFab service. Please refresh to try again.';element.classList.add('text-danger');});document.querySelectorAll('.cloud-connection-status-text').forEach((element)=>{element.classList.add('d-none');});}
lastLoginTimestamp=new Date().getTime();}
updateUIForMelvorCloudSignIn(){if(this.isAuthenticated){this.connectionSuccessMelvorCloud();if(!this.isOnAuthPage)
this.updateCharacterSelectManagePage();}
else
this.connectionFailedMelvorCloud();if(characterSelected)
loadCloudOptions(this.isAuthenticated);}
updateCharacterSelectManagePage(){if(this.JWTData===undefined)
throw new Error('Player is authenticated but JWTData is undefined');const usernameText=document.getElementById('character-cloud-manage-username');usernameText.innerText=this.JWTData.username;const usernameField=document.getElementById('cloud-manage-form-username');usernameField.value=this.JWTData.username;this.formElements.characterSelect.email.input.value=this.JWTData.email;document.querySelectorAll('.btn-cloud-sign-in').forEach((element)=>{element.classList.add('d-none');});}
updateUIForEntitlements(){const currentTime=new Date().getTime();if(this.entitlements.fullGame){document.querySelectorAll('.demo-version').forEach((element)=>{element.remove();});if(currentTime>=this.expansionRelease){document.querySelectorAll('.expansion-1-container').forEach((element)=>{element.classList.remove('d-none');});}
if(this.entitlements.TotH){document.querySelectorAll('.expansion-1-status').forEach((element)=>{element.textContent='Throne of the Herald - ACTIVE';element.classList.remove('text-danger');element.classList.add('text-success');});document.querySelectorAll('.expansion-1-show').forEach((element)=>{element.classList.remove('d-none');});}
else{document.querySelectorAll('.expansion-1-status').forEach((element)=>{element.textContent='Throne of the Herald - INACTIVE';element.classList.add('text-danger');element.classList.remove('text-success');});if(currentTime>=this.expansionRelease){document.querySelectorAll('.expansion-not-owned').forEach((element)=>{element.classList.remove('d-none');});}
document.querySelectorAll('.expansion-1-show').forEach((element)=>{element.classList.add('d-none');});}}
if(!this.entitlements.fullGame||currentTime<this.expansionRelease){document.querySelectorAll('.expansion-not-owned').forEach((element)=>{element.remove();});}
document.querySelectorAll('.expansion-1-version').forEach((element)=>{this.entitlements.TotH?element.classList.remove('d-none'):element.classList.add('d-none');});document.querySelectorAll('.expansion-not-owned').forEach((element)=>{if(this.entitlements.TotH)
element.remove();});if(currentTime>this.expansionRelease){document.querySelectorAll('.toth-release-date').forEach((element)=>{element.remove();});}}
connectionSuccessMelvorCloud(){Array.from(document.getElementsByClassName('melvor-cloud-connection-text')).forEach((element)=>{element.classList.add('text-success');element.classList.remove('text-danger');element.classList.remove('text-info');});Array.from(document.getElementsByClassName('melvor-cloud-connection-status')).forEach((element)=>{element.classList.add('d-none');});Array.from(document.getElementsByClassName('melvor-cloud-connection-check')).forEach((element)=>{element.classList.remove('d-none');});Array.from(document.getElementsByClassName('btn-cloud-sign-out')).forEach((element)=>{element.classList.remove('d-none');});Array.from(document.getElementsByClassName('btn-cloud-manage')).forEach((element)=>{element.classList.remove('d-none');});Array.from(document.getElementsByClassName('character-selection-login')).forEach((element)=>{element.classList.add('d-none');});}
connectionFailedMelvorCloud(){Array.from(document.getElementsByClassName('melvor-cloud-connection-text')).forEach((element)=>{element.classList.remove('text-success');element.classList.add('text-danger');});Array.from(document.getElementsByClassName('melvor-cloud-connection-status')).forEach((element)=>{element.classList.add('d-none');});Array.from(document.getElementsByClassName('melvor-cloud-connection-times')).forEach((element)=>{element.classList.remove('d-none');});}
logout(){changePageCharacterSelection(5);Array.from(document.getElementsByClassName('btn-cloud-sign-out')).forEach((element)=>{element.classList.add('d-none');});Array.from(document.getElementsByClassName('btn-cloud-manage')).forEach((element)=>{element.classList.add('d-none');});this.removeAppleTokenFromLocalStorage();this.removeGoogleTokenFromLocalStorage();this.removeJWTFromLocalStorage();localStorage.removeItem('isPremium');localStorage.removeItem('playFabID');connectedToCloud=false;connectedToPlayFab=false;returnToGameAfterSubmission=false;window.setTimeout(function(){location.href='index.php';},500);}
hasFullGame(){return __awaiter(this,void 0,void 0,function*(){if(!nativeManager.isSteam)
this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_VALIDATING_PURCHASES'));else
this.setStatus(getLangString('MENU_TEXT','LOADING_MSG_VALIDATING_PURCHASES_STEAM'));this.log('Checking for valid full version');if(this.enableMelvorCloudBypass&&DEBUGENABLED){const userResponse=yield SwalLocale.fire({title:'Load Full Version Data?',showCancelButton:true,icon:'question',confirmButtonText:'Yes',cancelButtonText:'No',});this.entitlements.fullGame=userResponse.isConfirmed;return userResponse.isConfirmed;}
if(this.isTest||this.hasFullVersionEntitlement||nativeManager.isAndroidFullVersionNativeApp||isSteam()){this.entitlements.fullGame=true;return Promise.resolve(true);}
if(PlayFabClientSDK.IsClientLoggedIn()){try{const steamStatus=yield this.getSteamPurchaseStatus();if(steamStatus.isOwned){this.entitlements.fullGame=true;return Promise.resolve(true);}}
catch(e){console.log(e);}
try{const mobileStatus=yield this.getMobilePurchaseStatus();if(mobileStatus=='true'){this.entitlements.fullGame=true;return Promise.resolve(true);}}
catch(e){console.log(e);}
try{const playFabCreationDate=yield this.compareCreationDates();if(playFabCreationDate){this.entitlements.fullGame=true;return Promise.resolve(true);}}
catch(e){console.log(e);}}
try{const grandfathered=this.checkMelvorCloudGrandfathered();if(grandfathered){this.entitlements.fullGame=true;return Promise.resolve(grandfathered);}}
catch(e){console.log(e);}
return Promise.resolve(false);});}
hasTotH(){return __awaiter(this,void 0,void 0,function*(){this.log('Checking for valid TotH purchase');if(this.enableMelvorCloudBypass&&DEBUGENABLED){const userResponse=yield SwalLocale.fire({title:'Load Throne of the Herald Data?',showCancelButton:true,icon:'question',confirmButtonText:'Yes',cancelButtonText:'No',});this.entitlements.TotH=userResponse.isConfirmed;return userResponse.isConfirmed;}
if(this.isTest||this.hasTotHEntitlement){this.entitlements.TotH=true;return Promise.resolve(true);}
else if(nativeManager.isSteam&&parent.greenworks.isSteamRunning()&&parent.greenworks.init()&&parent.greenworks.initAPI()&&parent.greenworks.isSubscribedApp(2055140)){this.entitlements.TotH=true;return Promise.resolve(true);}
else if(PlayFabClientSDK.IsClientLoggedIn()){try{const steamStatus=yield this.getSteamExpansionPurchaseStatus();if(steamStatus.isOwned){this.entitlements.TotH=true;return Promise.resolve(true);}}
catch(e){console.log(e);}
try{const mobileStatus=yield this.getMobileExpansionStatus();if(mobileStatus=='true'){this.entitlements.TotH=true;return Promise.resolve(true);}}
catch(e){console.log(e);}}
this.entitlements.TotH=false;return Promise.resolve(false);});}
getSteamPurchaseStatus(){return __awaiter(this,void 0,void 0,function*(){const isSteamPurchased=new Promise((resolve)=>{PlayFabClientSDK.ExecuteCloudScript({FunctionName:'steamCheckAppOwnership'},function(result,error){if(result!==null)
resolve(result.data.FunctionResult);else
resolve({isOwned:false});});});return isSteamPurchased;});}
getSteamExpansionPurchaseStatus(){return __awaiter(this,void 0,void 0,function*(){const isSteamPurchased=new Promise((resolve)=>{PlayFabClientSDK.ExecuteCloudScript({FunctionName:'steamCheckExpansionOwnership'},function(result,error){if(result!==null)
resolve(result.data.FunctionResult);else
resolve({isOwned:false});});});return isSteamPurchased;});}
getMobilePurchaseStatus(){return __awaiter(this,void 0,void 0,function*(){const isMobilePurchased=new Promise((resolve,reject)=>{PlayFabClientSDK.GetUserReadOnlyData({Keys:['validMobile']},function(d,error){if(d!==undefined&&d!==null&&d.data.Data!==undefined){const validMobile=d.data.Data.validMobile;if(validMobile!==undefined)
resolve(validMobile.Value==='true'?'true':'false');else
resolve('false');}
else
reject(error);});});return isMobilePurchased;});}
getMobileExpansionStatus(){return __awaiter(this,void 0,void 0,function*(){const isMobilePurchased=new Promise((resolve,reject)=>{PlayFabClientSDK.GetUserReadOnlyData({Keys:['validTotH']},function(d,error){if(d!==undefined&&d!==null&&d.data.Data!==undefined){const validTotH=d.data.Data.validTotH;if(validTotH!==undefined)
resolve(validTotH.Value==='true'?'true':'false');else
resolve('false');}
else
reject(error);});});return isMobilePurchased;});}
validateMobilePurchaseStatus(){return __awaiter(this,void 0,void 0,function*(){const isMobilePurchased=new Promise((resolve,reject)=>{if(nativeManager.isAndroidFullVersionNativeApp){PlayFabClientSDK.ExecuteCloudScript({FunctionName:'validateMobilePurchaseFullVersion',FunctionParameter:{receipt:nativeManager.receiptData},},function(d,error){if(error!==null)
reject(error);resolve(d.data.FunctionResult);});}
else{PlayFabClientSDK.ExecuteCloudScript({FunctionName:'validateMobilePurchase',FunctionParameter:{receipt:nativeManager.receiptData}},function(d,error){if(error!==null)
reject(error);resolve(d.data.FunctionResult);});}});return isMobilePurchased;});}
validateMobileExpansionPurchaseStatus(){return __awaiter(this,void 0,void 0,function*(){const isMobilePurchased=new Promise((resolve,reject)=>{PlayFabClientSDK.ExecuteCloudScript({FunctionName:'validateMobileExpansionPurchase',FunctionParameter:{receipt:nativeManager.receiptData}},function(d,error){if(error!==null)
reject(error);resolve(d.data.FunctionResult);});});return isMobilePurchased;});}
getPlayFabCreationDate(){return __awaiter(this,void 0,void 0,function*(){const date=new Promise((resolve,reject)=>{PlayFabClientSDK.GetAccountInfo({},function(result,error){if(result!==null)
resolve(result.data.AccountInfo.TitleInfo.Created);else if(error!==null){$('#on-load-error').append('PlayFab Error: '+PlayFab.GenerateErrorReport(error));reject(false);}
else
reject(false);});});return date;});}
compareCreationDates(){return __awaiter(this,void 0,void 0,function*(){this.getPlayFabCreationDate().then((creationDate)=>{if(creationDate!==false){if(new Date(creationDate).getTime()<this.grandfatheredTimestamp){return Promise.resolve(true);}
else
return Promise.resolve(false);}
else
return Promise.resolve(false);});return Promise.resolve(false);});}
updateEntitlementsFromReceiptData(){if(nativeManager.validateIOSIAP(nativeManager.receiptData,nativeManager.productIDs.ios.fullGame))
this.entitlements.fullGame=true;if(nativeManager.validateIOSIAP(nativeManager.receiptData,nativeManager.productIDs.ios.expansions[0]))
this.entitlements.TotH=true;if(nativeManager.validateAndroidIAP(nativeManager.receiptData,nativeManager.productIDs.android.fullGame))
this.entitlements.fullGame=true;if(nativeManager.validateAndroidIAP(nativeManager.receiptData,nativeManager.productIDs.android.expansions[0]))
this.entitlements.TotH=true;}
checkMelvorCloudGrandfathered(){const iosDate=new Date(this.accountCreated.replace(/\s/,'T'));if(this.JWTData===undefined)
return false;if(this.JWTData.created===undefined||this.JWTData.created===null)
return false;return new Date(iosDate).getTime()<this.grandfatheredTimestamp;}
handleLoadingError(title,e){var _a;console.error(e);const errorBox=document.getElementById('on-load-error');if(errorBox===null)
return;errorBox.innerHTML+=`<h4 class="text-danger mb-2">${title}</h4>`;const errorArea=createElement('textarea',{className:'form-control text-danger'});errorArea.rows=5;errorArea.readOnly=true;errorArea.onclick=()=>errorArea.setSelectionRange(0,errorArea.value.length);if(e instanceof Error){errorArea.value=`${e.name}: ${e.message}
=== Stack Trace ===
${(_a=e.stack)!==null&&_a!==void 0?_a:'Stack not available.'}`;}
else{errorArea.value=`Unknown error: ${e}`;}
errorBox.append(errorArea);}}
const cloudManager=new CloudManager();function signInWithAppleCallback(response){cloudManager.log('Apple Login Callback');let idToken;if(response.detail){if(response.detail.authorization)
idToken=response.detail.authorization.id_token;}
else{idToken=response.idToken;}
if(idToken)
cloudManager.handleSignInWithApple(idToken);else
cloudManager.failSocialSignIn();}
function signInWithGoogleCallback(response){cloudManager.log('Google Login Callback');let idToken;if(response.credential){idToken=response.credential;}
else{idToken=response.idToken;}
if(idToken)
cloudManager.handleSignInWithGoogle(idToken);else
cloudManager.failSocialSignIn();}