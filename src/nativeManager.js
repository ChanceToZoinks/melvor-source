"use strict";var __awaiter=(this&&this.__awaiter)||function(thisArg,_arguments,P,generator){function adopt(value){return value instanceof P?value:new P(function(resolve){resolve(value);});}
return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}
function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}
function step(result){result.done?resolve(result.value):adopt(result.value).then(fulfilled,rejected);}
step((generator=generator.apply(thisArg,_arguments||[])).next());});};class NativeManager{constructor(){this.deviceInfo={};this.onesignalInfo={};this.scheduledPushNotifications=[];this.waitingForPurchaseToFinish=false;this.waitingForPurchaseInfoToLoad=true;this.productIDInPurchaseFlow='';this.receiptData={};this.nativeAppIAPLoaded=false;this.productIDs={ios:{fullGame:'com.gamesbymalcs.melvoridle.removeAds',expansions:['com.gamesbymalcs.melvoridle.expansion1']},android:{fullGame:'com.malcs.melvoridle.removeads',expansions:['com.malcs.melvoridle.expansion1']},};this.defaultIAPPricing={ios:{fullGame:'US$9.99',expansions:['US$4.99']},android:{fullGame:'US$9.99',expansions:['US$4.99']},};if(!this.isNativeApp){this.showBrowserOnlyElements();return;}
this.showNativeOnlyElements();this.initNativeManager();}
get isIOS(){return location.origin==='https://ios.melvoridle.com'||navigator.userAgent.includes('gonative_ios');}
get isAndroid(){return location.origin==='https://android.melvoridle.com'||navigator.userAgent.includes('gonative_android');}
get isMobile(){return this.isIOS||this.isAndroid||location.pathname.includes('index_mobile.php');}
get isSteam(){return location.origin==='https://steam.melvoridle.com'||parent.greenworks!==undefined;}
initNativeManager(){return __awaiter(this,void 0,void 0,function*(){this.deviceInfo=yield this.getDeviceInfo();this.onesignalInfo=yield this.getOneSignalInfo();});}
hideNativeIOSElements(){const elements=document.querySelectorAll('.native-ios');elements.forEach((element)=>{element.classList.add('d-none');});}
showNativeIOSElements(){const elements=document.querySelectorAll('.native-ios');elements.forEach((element)=>{element.classList.remove('d-none');});}
hideNativeAndroidElements(){const elements=document.querySelectorAll('.native-android');elements.forEach((element)=>{element.classList.add('d-none');});}
showNativeAndroidElements(){const elements=document.querySelectorAll('.native-android');elements.forEach((element)=>{element.classList.remove('d-none');});}
schedulePushNotification(notificationType,msg,endDate){return __awaiter(this,void 0,void 0,function*(){const oneSignalUserID=this.onesignalInfo.oneSignalUserId;const platform=this.isIOS?'iOS':'AndroidAds';if(oneSignalUserID===undefined)
return Promise.reject('One Signal User ID not found');if(platform===undefined)
return Promise.reject('One Signal Platform not found');if(notificationType===PushNotificationType.Unique)
yield this.cancelUniquePushNotification();const data={sendNotification:1,playerID:oneSignalUserID,timestamp:endDate,message:msg,platform:platform,};$.ajax({url:'includes/notifications/sendPushNotification.php',method:'POST',async:true,data:data,}).done((result)=>{if(result.errors===undefined)
this.saveScheduledPushNotification(result.id,data.timestamp,data.platform);else
console.log(JSON.stringify(result.errors));}).fail((error)=>{});});}
cancelUniquePushNotification(){return __awaiter(this,void 0,void 0,function*(){const existingNotification=this.findUniqueScheduledPushNotification();if(existingNotification!==undefined){try{const cancelled=yield this.cancelPushNotification(existingNotification);Promise.resolve(cancelled);}
catch(e){const errorMessage=`Native Manager Error: cancelUniquePushNotification: ${e}`;console.log(errorMessage);Promise.resolve(false);}}
return Promise.resolve(true);});}
cancelPushNotification(data){return __awaiter(this,void 0,void 0,function*(){console.log(`Cancelling push notification: ${data.id}`);return $.ajax({url:'includes/notifications/sendPushNotification.php',method:'POST',async:true,data:{deleteNotification:1,messageID:data.id,platform:data.platform,},}).then((result)=>{if(result.success)
return true;else
return false;}).fail((error)=>{return 'Error cancelling push notification: '+error;});});}
saveScheduledPushNotification(id,endDate,platform){const data={id:id,notificationType:0,startDate:Date.now(),endDate:endDate,platform:platform,};this.scheduledPushNotifications.push(data);}
findScheduledPushNotification(id){}
findUniqueScheduledPushNotification(){return this.scheduledPushNotifications.find((notification)=>notification.notificationType===PushNotificationType.Unique);}
encode(writer){writer.writeArray(this.scheduledPushNotifications,(notification,writer)=>{writer.writeString(notification.id);writer.writeFloat64(notification.startDate);writer.writeFloat64(notification.endDate);writer.writeUint8(notification.notificationType);writer.writeString(notification.platform);});return writer;}
decode(reader,version){this.scheduledPushNotifications=reader.getArray((reader)=>{return{id:reader.getString(),startDate:reader.getFloat64(),endDate:reader.getFloat64(),notificationType:reader.getUint8(),platform:reader.getString(),};});}
convertOldNotifications(oldNotifications){}
get isNativeApp(){return navigator.userAgent.indexOf('gonative')>-1;}
get isAndroidFullVersionNativeApp(){return navigator.userAgent.indexOf('gonative_android_adfree')>-1;}
showNativeOnlyElements(){const elements=document.querySelectorAll('.native-only');elements.forEach((element)=>{element.classList.remove('d-none');});}
showBrowserOnlyElements(){const elements=document.querySelectorAll('.browser-only');elements.forEach((element)=>{element.classList.remove('d-none');});}
getDeviceInfo(){return __awaiter(this,void 0,void 0,function*(){try{const info=yield gonative.deviceInfo();return info;}
catch(e){console.log(`Native Manager Error: getDeviceError: ${e}`);return{};}});}
getOneSignalInfo(){return __awaiter(this,void 0,void 0,function*(){try{const info=yield gonative.onesignal.onesignalInfo();return info;}
catch(e){console.log(`Native Manager Error: getOneSignalInfo: ${e}`);return{};}});}
registerOneSignal(){try{gonative.onesignal.register();}
catch(e){console.log(`Native Manager Error: registerOneSignal: ${e}`);}}
sharePage(URL){try{gonative.share.sharePage(URL);}
catch(e){console.log(`Native Manager Error: sharePage: ${e}`);}}
openAppSettings(){try{gonative.open.appSettings();}
catch(e){console.log(`Native Manager Error: openAppSettings: ${e}`);}}
clearWebviewCache(){try{gonative.webview.clearCache();}
catch(e){console.log(`Native Manager Error: clearWebviewCache: ${e}`);}}
setDeviceBrightness(brightness,restoreOnNavigation){try{gonative.screen.setBrightness({brightness:brightness,restoreOnNavigation:restoreOnNavigation});}
catch(e){console.log(`Native Manager Error: setDeviceBrightness: ${e}`);}}
setNonPersistentLocalSetting(key,value){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support local settings`);return;}
try{gonative.localpreferences.nonpersistent.set({key:key,value:value,statuscallback:this.setNonPersistentCallback,});}
catch(e){console.log(`Native Manager Error: setNonPersistentLocalSetting: ${e}`);}}
setNonPersistentCallback(result){if(result.status)
console.log(result.status);}
getNonPersistentLocalSetting(key){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support local settings`);return;}
try{gonative.localpreferences.nonpersistent.get({key:key,callback:this.getNonPersistentCallback});}
catch(e){console.log(`Native Manager Error: getNonPersistentLocalSetting: ${e}`);}}
getNonPersistentCallback(result){console.log(result);}
deleteNonPersistentLocalSetting(key){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support local settings`);return;}
try{gonative.localpreferences.nonpersistent.delete({key:key,statuscallback:this.deleteNonPersistentCallback});}
catch(e){console.log(`Native Manager Error: deleteNonPersistentLocalSetting: ${e}`);}}
deleteAllNonPersistentLocalSettings(){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support local settings`);return;}
try{gonative.localpreferences.nonpersistent.deleteAll({statuscallback:this.deleteNonPersistentCallback});}
catch(e){console.log(`Native Manager Error: deleteAllNonPersistentLocalSettings: ${e}`);}}
deleteNonPersistentCallback(result){console.log(result);}
setPersistentLocalSetting(key,value){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support local settings`);return;}
try{gonative.localpreferences.nonpersistent.set({key:key,value:value,statuscallback:this.setPersistentCallback,});}
catch(e){console.log(`Native Manager Error: setPersistentLocalSetting: ${e}`);}}
setPersistentCallback(result){if(result.status)
console.log(result.status);}
getPersistentLocalSetting(key){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support local settings`);return;}
try{gonative.localpreferences.persistent.get({key:key,callback:this.getPersistentCallback});}
catch(e){console.log(`Native Manager Error: getPersistentLocalSetting: ${e}`);}}
getPersistentCallback(result){console.log(result);}
deletePersistentLocalSetting(key){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support local settings`);return;}
try{gonative.localpreferences.persistent.delete({key:key,statuscallback:this.deletePersistentCallback});}
catch(e){console.log(`Native Manager Error: deletePersistentLocalSetting: ${e}`);}}
deleteAllPersistentLocalSettings(){try{gonative.localpreferences.persistent.deleteAll({statuscallback:this.deletePersistentCallback});}
catch(e){console.log(`Native Manager Error: deleteAllPersistentLocalSettings: ${e}`);}}
deletePersistentCallback(result){console.log(result);}
triggerHaptic(style){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support haptics`);return;}
gonative.haptics.trigger({style:style});}
promptForAppReview(){if(!this.isNativeApp||this.isAndroidFullVersionNativeApp){console.log(`Native Manager Error: This version of the app does not support App Review`);return;}
gonative.appreview.prompt({});}
purchaseIAP(productID){try{this.waitingForPurchaseToFinish=true;this.productIDInPurchaseFlow=productID;if(!this.isNativeApp){if(this.isIOS)
window.bridge.post('make_purchase',{});else if(this.isAndroid)
android.buyItem();}
else{if(this.isIOS&&this.validateIOSIAP(this.receiptData,productID))
this.purchaseAlreadyMade();else if(this.isAndroid&&this.validateAndroidIAP(this.receiptData,productID))
this.purchaseAlreadyMade();else{gonative.purchase({productID:productID});nativeManager.purchaseInProgressPopup();}}}
catch(e){console.log(`Native Manager Error: purchaseIOSIAP: ${e}`);}}
restorePurchases(){if(!this.isIOS)
return;SwalLocale.fire({title:getLangString('IAP','RESTORING_PURCHASES'),html:`<div class="spinner-border spinner-border-sm text-info mr-2" role="status"></div><small>${getLangString('IAP','PLEASE_WAIT')}</small>`,showCancelButton:false,showConfirmButton:false,});try{gonative.iap.restorePurchases();window.setTimeout(()=>{SwalLocale.fire({title:getLangString('IAP','PURCHASES_RESTORED'),html:`<small>${getLangString('IAP','PURCHASES_RESTORED_INFO')}</small>`,showCancelButton:false,icon:'success',});},2000);}
catch(e){console.log(`Native Manager Error: restorePurchases: ${e}`);}}
purchaseInProgressPopup(){SwalLocale.fire({title:getLangString('MENU_TEXT','PURCHASE_IN_PROGRESS'),html:`<h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString('MENU_TEXT','PREMIUM_PURCHASE_INFO_0')}</h5><h5 class="font-w400 text-info font-size-sm">${getLangString('MENU_TEXT','PREMIUM_PURCHASE_INFO_1')}</h5>`,icon:'info',showConfirmButton:false,});}
purchaseAlreadyMade(){SwalLocale.fire({title:getLangString('IAP','PURCHASE_ALREADY_ACTIVE'),html:`<small>${getLangString('IAP','PURCHASE_ALREADY_ACTIVE_INFO')}</small>`,icon:'success',});}
validateIOSIAP(data,productID){if(!data['hasValidReceipt'])
return false;if(!data['allPurchases'].length)
return false;const purchase=data['allPurchases'].find((x)=>x.productIdentifier==productID);if(purchase===undefined)
return false;return true;}
validateAndroidIAP(data,productID){if(!data['allPurchases'].length)
return false;const purchase=data['allPurchases'].find((x)=>x.productID==productID);if(purchase===undefined)
return false;if(purchase.purchaseState!==0)
return false;return true;}
getIAPPrice(productID,formatted){let price='';switch(productID){case 'com.gamesbymalcs.melvoridle.removeAds':case 'com.malcs.melvoridle.removeads':price=this.defaultIAPPricing.ios.fullGame;break;case 'com.gamesbymalcs.melvoridle.expansion1':case 'com.malcs.melvoridle.expansion1':price=this.defaultIAPPricing.ios.expansions[0];}
if(this.nativeIAPInfo!==undefined){const product=this.nativeIAPInfo.inAppPurchases.products.find((x)=>x.productID==productID);if(product!==undefined){if(this.isIOS)
price=formatted?product.priceFormatted:product.price.toString();else if(this.isAndroid)
price=product.price.toString();}}
return price;}
getFullGameIAPProductID(){if(this.isIOS)
return this.productIDs.ios.fullGame;if(this.isAndroid)
return this.productIDs.android.fullGame;return '';}
getExpansionIAPProductID(expansionID){if(this.isIOS)
return this.productIDs.ios.expansions[expansionID];if(this.isAndroid)
return this.productIDs.android.expansions[expansionID];return '';}
buyFullGameSwal(skill){const productID=this.getFullGameIAPProductID();SwalLocale.fire({title:getLockedTitle(skill),html:getLockedMessage(skill),showCancelButton:true,icon:'warning',confirmButtonText:getLockedBtn(productID),}).then((result)=>{if(result.value){performUnlockIAP(productID);}});}
buyExpansion1Swal(){if(!cloudManager.hasFullVersionEntitlement)
return this.buyTheFullGameFirst();const productID=this.getExpansionIAPProductID(0);const price=this.isNativeApp?nativeManager.getIAPPrice(productID,true):'$4.99 USD';let html=getLangString('IAP','PURCHASE_TOTH_Q');if(!this.isNativeApp&&!this.isSteam&&setLang=='en')
html+=`<br><br><small class="font-w600">${getLangString('IAP','TOTH_GRANDFATHERED')}</small>`;SwalLocale.fire({title:'Throne of the Herald',html:html,showCancelButton:true,icon:'warning',confirmButtonText:templateString(getLangString('IAP','PRICE'),{price:`${price}`,}),}).then((result)=>{if(result.value){performUnlockExpansionIAP(productID);}});}
buyTheFullGameFirst(){SwalLocale.fire({title:'Throne of the Herald',html:getLangString('IAP','TOTH_FULL_GAME_REQUIRED'),showCancelButton:false,icon:'warning',});}
finalizePurchaseIAP(productID){return __awaiter(this,void 0,void 0,function*(){if(!PlayFabClientSDK.IsClientLoggedIn())
return(location.href='index.php');if((this.isIOS&&productID==this.productIDs.ios.fullGame)||(this.isAndroid&&productID==this.productIDs.android.fullGame))
yield cloudManager.validateMobilePurchaseStatus();else if((this.isIOS&&productID==this.productIDs.ios.expansions[0])||(this.isAndroid&&productID==this.productIDs.android.expansions[0]))
yield cloudManager.validateMobileExpansionPurchaseStatus();location.href='index.php';});}}
const nativeManager=new NativeManager();function gonative_iap_purchases(data){console.log(JSON.stringify(data));nativeManager.receiptData=data;cloudManager.updateEntitlementsFromReceiptData();if(nativeManager.waitingForPurchaseToFinish&&((nativeManager.isIOS&&nativeManager.validateIOSIAP(data,nativeManager.productIDInPurchaseFlow))||(nativeManager.isAndroid&&nativeManager.validateAndroidIAP(data,nativeManager.productIDInPurchaseFlow))))
nativeManager.finalizePurchaseIAP(nativeManager.productIDInPurchaseFlow);nativeManager.nativeAppIAPLoaded=true;}
function gonative_info_ready(data){console.log('gonative_info_ready');nativeManager.nativeIAPInfo=data;}