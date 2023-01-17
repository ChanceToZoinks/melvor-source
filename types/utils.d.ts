declare function rollPercentage(chance: any): boolean;
declare function rollInteger(minValue: any, maxValue: any): any;
declare function rollForOffItem(baseChance: any): boolean;
declare function generateGaussianNumber($mean: any, $stdDev: any): any;
declare function getMean(numActions: any, probability: any): number;
declare function getStdDev(numActions: any, probability: any): number;
declare function applyModifier(
  baseStat: any,
  modifier: any,
  type?: number
): any;
declare function binomial_distribution(
  n: any,
  p: any,
  epsilon?: number
): number[];
declare function sample_from_binomial(numberTrials: any, chance: any): any;
declare function linearFunction(m: any, b: any, x: any): any;
declare function cappedLinearFunction(m: any, b: any, cap: any, x: any): number;
declare function deleteKeysFromObject(object: any): void;
declare function getRandomArrayElement(array: any): any;
declare function getExclusiveRandomArrayElements(
  array: any,
  numElements: any
): Set<any>;
declare function getAverage(elements?: any[]): number;
declare function clampValue(value: any, min: any, max: any): number;
declare function setToUppercase(string: any): any;
declare function setToLowercase(string: any): any;
declare function replaceAll(str: any, find: any, replace: any): any;
declare function isAnySetMemberInSet(setA: any, setB: any): boolean;
declare function updateTooltips(): void;
declare function getSortableDelayOnTouch(): boolean;
declare function roundToTickInterval(interval: any): number;
declare function joinAsList(list: any): any;
declare function joinAsLineBreakList(list: any): any;
declare function pluralS(number: any): "" | "s";
declare function checkMediaQuery(mediaQuery: any): boolean;
declare function createElement(tagName: any, options?: {}): any;
declare function hideElement(elem: any): void;
declare function showElement(elem: any): void;
declare function toggleDangerSuccess(elem: any, success: any): void;
declare function removeElementID(elem: any): void;
declare function fireBottomToast(text: any, duration?: number): void;
declare function fireTopToast(text: any, duration?: number): void;
declare function imageNotify(
  media: any,
  message: any,
  messageTheme?: string
): void;
declare function itemNotify(item: any, quantity: any): void;
declare function processItemNotify(item: any, quantity: any): void;
declare function stunNotify(damage: any): void;
declare function bankFullNotify(): void;
declare function levelUpNotify(skill: any): void;
declare function level99Notify(skill: any): void;
declare function notifyPreserve(skill: any): void;
declare function notifyPlayer(
  skill: any,
  message: any,
  messageTheme?: string
): void;
declare function notifyItemCharges(item: any): void;
declare function tutorialNotify(): void;
declare function currencyNotify(media: any, amount: any): void;
declare function notifyMasteryLevelUp(action: any, newLevel: any): void;
declare function notify99ItemMastery(action: any): void;
declare function notifyCompletionYay(): void;
declare function notifyCompletionTotH(): void;
declare function notifyCompletionEverything(): void;
declare function showFireworks(force?: boolean): void;
declare function removePyro(): void;
declare function startPyroInterval(): void;
declare function getItemBaseStatsBreakdown(item: any): string;
declare function lockedSkillAlert(skill: any, messageTemplate: any): void;
declare function showStunnedNotification(): void;
declare function showSleepNotification(): void;
declare function cdnMedia(media: any): any;
declare function compareNameValuePairs(currentPairs: any, oldPairs: any): void;
declare function convertNameValuePairToMap(pairs: any): Map<any, any>;
declare function templateString(string: any, templateData: any): any;
declare function templateLangString(
  category: any,
  identifier: any,
  templateData: any
): any;
declare function milliToSeconds(ms: any): number;
declare function multiplyByNumberMultiplier(value: any): number;
declare function divideByNumberMultiplier(value: any): number;
declare function animateProgress(
  div: any,
  interval: any,
  stayFull?: boolean
): void;
declare function resetProgressAnimation(div: any): void;
declare function getUnlockedAtNodes(skill: any, level: any): any[];
declare function templateLangStringWithNodes(
  category: any,
  id: any,
  nodeData: any,
  textData: any,
  clone?: boolean
): any[];
declare function templateStringWithNodes(
  string: any,
  nodeData: any,
  textData: any,
  clone?: boolean
): any[];
declare function numberWithCommas(number: any, ignoreSetting?: boolean): any;
declare function formatNumber(number: any): string;
declare function formatPercent(percent: any, digits: any): string;
declare function getMSAsTime(time: any): {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};
declare function formatAsTimePeriod(timeInMs: any): any;
declare function formatAsShorthandTimePeriod(timeInMs: any): any;
declare function successSpan(content: any): string;
declare function getTemplateElement(templateID: any): HTMLTemplateElement;
declare function getTemplateNode(templateID: any): Node;
declare function getAnyElementFromFragment(fragment: any, elementID: any): any;
declare function getElementFromFragment(
  fragment: any,
  elementID: any,
  tagName: any
): any;
declare function formatFixed(num: any, digits: any): any;
declare function switchToCategory(tabs: any): (categoryToShow: any) => void;
declare function downloadTextFile(
  fileName: any,
  fileText: any,
  fileType?: string
): void;
declare function removeFromArray(original: any, remove: any): any;
declare function mapOrder(array: any, order: any, key: any): any;
declare function sortByOrder(order: any, key: any): (a: any, b: any) => number;
declare function logConsole(message: any): void;
declare function escapeRegExp(string: any): any;
declare function generateComponentClass(
  templateID: any,
  tagName: any,
  className: any
): string;
declare function generateModifierDataSchema(): string;
declare function formatAsSHTimePeriod(timeInMs: any): any;
declare function getMAsTime(time: any): {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};
declare function arrSum(arr: any): any;
declare let updateTooltipsTimer: number;
declare function joinList(seperator: any): (list: any) => string;
declare function joinAsSuperList(list: any): string;
declare function levelUnlockSum(
  skill: any
): (previous: any, current: any) => any;
declare let itemNotifyTimer: number;
declare let itemNotifyToProcess: any[];
declare let pyroInterval: number;
declare let forcePyro: boolean;
declare class NotificationQueue {
  constructor(maxNotifiactions: any);
  maxNotifiactions: any;
  queue: any[];
  notify(): void;
  add(notification: any): void;
  clear(): void;
}
declare class ExperienceCalculator {
  estConstA: number;
  estConstB: number;
  table: number[];
  xpSum: number;
  equate(level: any): number;
  level_to_xp(level: any): number;
  xp_to_level(xp: any, level?: number): number;
  xpToLevel(xp: any): number;
}
declare const exp: ExperienceCalculator;
declare function formatAsOrdinal(value: any): string;
declare function unregisteredMessage(type: any): string;
declare class UnregisteredConstructionError extends Error {
  constructor(object: any, unregisteredName: any, id: any);
}
declare class UnregisteredDataModError extends Error {
  constructor(unregisteredName: any, id: any);
}
declare class UnregisteredApplyDataModError extends Error {
  constructor(
    objectBeingModded: any,
    unregisteredName: any,
    unregisteredID: any
  );
}
declare const progressBarAttributes: string[][];
declare class DropTable {
  constructor(game: any, data: any);
  totalWeight: number;
  drops: any[];
  get size(): number;
  get weight(): number;
  get sortedDropsArray(): any[];
  get averageDropValue(): number;
  registerDrops(game: any, data: any): void;
  getDrop(): {
    item: any;
    quantity: any;
  };
}
declare class SparseNumericMap {
  data: Map<any, any>;
  get size(): number;
  has(key: any): boolean;
  get(key: any): any;
  set(key: any, value: any): void;
  add(key: any, amount: any): void;
  inc(key: any): void;
  sub(key: any, amount: any): void;
  dec(key: any): void;
  mult(key: any, multiplier: any): void;
  div(key: any, divisor: any): void;
  getSum(): number;
  getSumOfKeys(keys: any): any;
  clear(): void;
  forEach(callbackfn: any): void;
}
declare var TownshipResourceTypeID: any;
declare var BuildingTypeID: any;
declare var CitizenSource: any;
declare var PushNotificationType: any;
