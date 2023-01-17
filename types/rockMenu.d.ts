declare class MiningRockMenu extends HTMLElement {
    _content: DocumentFragment;
    button: any;
    statusText: any;
    nameText: any;
    typeText: any;
    rockImage: any;
    hpProgressText: any;
    hpProgress: ProgressBar;
    xpIcon: XPIcon;
    masteryIcon: MasteryXPIcon;
    masteryPoolIcon: MasteryPoolIcon;
    intervalIcon: IntervalIcon;
    miningProgress: ProgressBar;
    mastery: any;
    requirementText: any;
    gemVeinText: any;
    meteoriteText: any;
    connectedCallback(): void;
    setRock(rock: any): void;
    updateHP(rock: any): void;
    setStatus(statusID: any): void;
    setRequirement(reqText: any): void;
    hideRequirement(): void;
    updateGrants(xp: any, masteryXP: any, masteryPoolXP: any, interval: any): void;
}
