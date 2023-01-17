declare function filterItemLog(filter: any): void;
declare function showCompletionCategory(category: any): void;
declare function changeItemLogPage(page: any): void;
declare function buildCompletionProgressElements(
  container: any,
  langID: any,
  name: any,
  classes: any
): {
  parent: any;
  current: any;
  total: any;
  percent: any;
};
declare function buildCompletionProgress(
  container: any,
  progress: any,
  totalCategory: any
): void;
declare function buildSkillsLog(game: any): void;
declare function buildMasteryLog(game: any): void;
declare function updateItemLogSearch(query: any): void;
declare function clearItemLogSearch(): void;
declare function buildItemLog(game: any): void;
declare function buildMonsterLog(game: any): void;
declare function buildPetLog(game: any): void;
declare function getItemStatDescriptions(
  item: any,
  preCount: any,
  preStat: any,
  postStat: any
): string;
declare function parseProgress(progress: any, withPercent?: boolean): any;
declare function promptGameReview(): void;
declare function updateItemLogSearchArray(game: any): void;
declare let skillsLogLoaded: boolean;
declare let masteryLogLoaded: boolean;
declare let itemLogLoaded: boolean;
declare let monsterLogLoaded: boolean;
declare let petLogLoaded: boolean;
declare let itemLogPage: number;
declare let compCategory: number;
declare namespace completionLogMenu {
  const skills: Map<any, any>;
  const masterySkills: Map<any, any>;
  const items: Map<any, any>;
  const monsters: Map<any, any>;
  const pets: Map<any, any>;
  const skillProgress: Map<any, any>;
  const masteryProgress: Map<any, any>;
  const itemProgress: Map<any, any>;
  const monsterProgress: Map<any, any>;
  const petProgress: Map<any, any>;
}
declare const monsterStatDisplayOrder: any[];
declare let itemLogSearch: any[];
declare class SkillCompletionElement extends HTMLElement {
  _content: DocumentFragment;
  viewMilestonesLink: any;
  blockContainer: any;
  skillImage: any;
  skillName: any;
  skillProgressFraction: any;
  skillProgressBar: any;
  connectedCallback(): void;
  setSkill(skill: any): void;
  updateProgress(skill: any): void;
}
declare class MasteryCompletionElement extends HTMLElement {
  _content: DocumentFragment;
  blockContainer: any;
  skillImage: any;
  skillName: any;
  masteryProgressFraction: any;
  masteryProgressPercent: any;
  masteryProgressBar: any;
  progressButton: any;
  unlocksButton: any;
  connectedCallback(): void;
  setSkill(skill: any): void;
  updateProgress(skill: any): void;
}
declare class ItemCompletionElement extends HTMLElement {
  _content: DocumentFragment;
  itemImage: any;
  connectedCallback(): void;
  tooltip: any;
  disconnectedCallback(): void;
  updateItem(item: any, game: any): void;
  getItemTooltipHTML(item: any, game: any): string;
}
declare class MonsterCompletionElement extends HTMLElement {
  _content: DocumentFragment;
  monsterImage: any;
  connectedCallback(): void;
  tooltip: any;
  disconnectedCallback(): void;
  updateMonster(monster: any, game: any): void;
  getMonsterTooltipHTML(monster: any, game: any): string;
}
declare class PetCompletionElement extends HTMLElement {
  _content: DocumentFragment;
  petImage: any;
  connectedCallback(): void;
  tooltip: any;
  disconnectedCallback(): void;
  updatePet(pet: any, game: any): void;
  getPetTooltipHTML(pet: any, unlocked: any): string;
}
declare class CompletionMap extends SparseNumericMap {
  getCompValue(namespace: any): any;
}
declare class CompletionRenderQueue {
  items: Set<any>;
  monsters: Set<any>;
  pets: Set<any>;
  skills: Set<any>;
  masterySkills: Set<any>;
  totalProgressTrue: boolean;
  totalProgressBaseGame: boolean;
  totalProgressTotH: boolean;
}
declare class CompletionProgress {
  currentCount: CompletionMap;
  maximumCount: CompletionMap;
  get hasNonBaseGame(): boolean;
  getPercent(namespace: any): number;
}
declare class Completion {
  constructor(game: any);
  game: any;
  renderQueue: CompletionRenderQueue;
  skillProgress: CompletionProgress;
  masteryProgress: CompletionProgress;
  itemProgress: CompletionProgress;
  monsterProgress: CompletionProgress;
  petProgress: CompletionProgress;
  totalProgressMap: CompletionMap;
  visibleCompletion: string;
  get totalProgressTrue(): any;
  get totalProgressBaseGame(): any;
  get totalProgressTotH(): any;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  setVisibleCompletion(visibleCompletion: any): void;
  updateVisbleCompletionButtons(oldCompletion: any, newCompletion: any): void;
  getSkillProgressPercent(): number;
  getMasteryProgressPercent(): number;
  getItemProgressPercent(): number;
  getMonsterProgressPercent(): number;
  getPetProgressPercent(): number;
  updateProgressElements(elementMap: any, progress: any, namespace: any): void;
  updateAllProgressElements(elements: any, progress: any): void;
  render(): void;
  onLoad(): void;
  updateAllCompletion(): void;
  updateSkill(skill: any): void;
  updateSkillMastery(skill: any): void;
  updateItem(item: any): void;
  updateMonster(monster: any): void;
  updatePet(pet: any): void;
  updateSkillProgress(): void;
  updateMasteryProgress(): void;
  updateItemProgress(): void;
  updateMonsterProgress(): void;
  updatePetProgress(): void;
  computeTotalProgressPercent(namespace: any): number;
  updateTotalProgress(): void;
}
