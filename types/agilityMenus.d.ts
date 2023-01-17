declare class BuiltAgilityObstacle extends HTMLElement {
  _content: DocumentFragment;
  blockContainer: any;
  builtContent: any;
  inactiveText: any;
  name: any;
  interval: any;
  xpGrants: any;
  gpGrants: any;
  masteryDisplay: any;
  bonusContainer: any;
  selectObstacleButton: any;
  destroyObstacleButton: any;
  unbuiltContent: any;
  unbuiltText: any;
  tierName: any;
  connectedCallback(): void;
  setUnbuilt(tier: any): void;
  setBuiltObstacle(obstacle: any): void;
  setTier(tier: any): void;
  setLevelLocked(level: any): void;
  setUnlocked(): void;
  updateRates(interval: any, xp: any, gp: any): void;
  updatePassives(passives: any): void;
  setHighlight(on: any): void;
  setActive(): void;
  setInactive(): void;
}
declare class PassivePillarMenu extends HTMLElement {
  _content: DocumentFragment;
  blockContainer: any;
  unbuiltContent: any;
  builtContent: any;
  activeText: any;
  name: any;
  passiveContainer: any;
  pillarSelectButton: any;
  pillarDestroyButton: any;
  connectedCallback(): void;
  setUnbuilt(): void;
  setBuilt(pillar: any): void;
  updatePassives(passives: any): void;
  setActive(): void;
  setInactive(): void;
}
declare class ElitePassivePillarMenu extends HTMLElement {
  _content: DocumentFragment;
  blockContainer: any;
  unbuiltContent: any;
  builtContent: any;
  activeText: any;
  name: any;
  passiveContainer: any;
  pillarSelectButton: any;
  pillarDestroyButton: any;
  connectedCallback(): void;
  setUnbuilt(): void;
  setBuilt(pillar: any): void;
  updatePassives(passives: any): void;
  setActive(): void;
  setInactive(): void;
}
declare class AgilityObstacleSelection extends HTMLElement {
  obstacleOnlyElements: any[];
  _content: DocumentFragment;
  link: any;
  activeText: any;
  name: any;
  interval: any;
  masteryLevel: any;
  masteryPercent: any;
  buildCount: any;
  xpGrants: any;
  gpGrants: any;
  gpReduction: any;
  scReduction: any;
  itemReduction: any;
  costContainer: any;
  requirementContainer: any;
  passivesContainer: any;
  connectedCallback(): void;
  createInlineRequirement(textClass: any): any;
  setCosts(items: any, gpReq: any, scReq: any): void;
  setPassives(passives: any): void;
  setBuildStatus(built: any): void;
  setObstacle(obstacle: any): void;
  setPillar(pillar: any): void;
  setElitePillar(pillar: any): void;
}
declare class InlineRequirement extends HTMLElement {
  _content: DocumentFragment;
  image: any;
  text: any;
  setContent(media: any, text: any, tooltipText: any): void;
  connectedCallback(): void;
  imageTooltip: any;
  disconnectedCallback(): void;
}
declare class MultiProgressBar extends HTMLElement {
  progressDivs: any[];
  animatedSegment: number;
  filledSegments: number;
  segmentPattern: any[];
  _content: DocumentFragment;
  barContainer: any;
  connectedCallback(): void;
  getPatternClass(segmentNumber: any): any;
  stopSegmentAnimation(segmentNumber: any): void;
  startSegmentAnimation(segmentNumber: any, timer: any): void;
  setMaxSegments(count: any): void;
  setSegmentPattern(classPattern: any): void;
  animateFromTimer(segment: any, timer: any): void;
  stopAnimation(): void;
}
