declare class FishingAreaMenu extends HTMLElement {
  fishButtons: any[];
  _content: DocumentFragment;
  areaBlock: any;
  areaHeader: any;
  areaName: any;
  areaEyecon: any;
  fishChance: any;
  junkChance: any;
  specialChance: any;
  buttonContainer: any;
  infoContainer: any;
  fishName: any;
  fishImage: any;
  fishInfoContainer: any;
  fishInterval: any;
  masteryDisplay: any;
  startButton: any;
  statusSpinner: any;
  statusText: any;
  xpIcon: XPIcon;
  strXPIcon: STRXPIcon;
  masteryIcon: MasteryXPIcon;
  masteryPoolIcon: MasteryPoolIcon;
  connectedCallback(): void;
  setChances(chance: any, area: any): void;
  setAreaData(area: any): void;
  updateGrants(
    xp: any,
    masteryXP: any,
    masteryPoolXP: any,
    strengthXP: any
  ): void;
  hideAreaPanel(): void;
  showAreaPanel(): void;
  setSelectedFish(fish: any): void;
  setUnselected(): void;
  updateSelectedFishRates(fish: any): void;
  updateButtons(area: any): void;
  setActionActive(): void;
  setActionInactive(): void;
}
declare class FishingAreaMenuButton extends HTMLElement {
  _content: DocumentFragment;
  link: any;
  fishImage: any;
  fishName: any;
  connectedCallback(): void;
  setFishUnlocked(fish: any, area: any): void;
  setFishLocked(fish: any): void;
}
