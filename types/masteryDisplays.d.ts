declare class MasteryDisplay extends HTMLElement {
    _content: DocumentFragment;
    icon: any;
    level: any;
    xpProgress: any;
    progressBar: any;
    connectedCallback(): void;
    iconTooltip: any;
    disconnectedCallback(): void;
    setNoMastery(): void;
    setMastery(skill: any, action: any): void;
    updateValues(progress: any): void;
}
declare class CompactMasteryDisplay extends HTMLElement {
    _content: DocumentFragment;
    icon: any;
    level: any;
    progressPercent: any;
    connectedCallback(): void;
    iconTooltip: any;
    disconnectedCallback(): void;
    setMastery(skill: any, action: any): void;
    updateValues(progress: any): void;
}
declare class MasteryPoolDisplay extends HTMLElement {
    _content: DocumentFragment;
    poolIcon: any;
    poolProgress: any;
    currentXP: any;
    totalXP: any;
    percentXP: any;
    connectedCallback(): void;
    poolTooltip: any;
    disconnectedCallback(): void;
    setSkill(skill: any): void;
    updateProgress(skill: any): void;
}
declare class SpendMasteryMenuItem extends HTMLElement {
    _content: DocumentFragment;
    actionImage: any;
    level: any;
    xpRequired: any;
    progressBar: any;
    levelUpButton: any;
    connectedCallback(): void;
    actionTooltip: any;
    disconnectedCallback(): void;
    setAction(action: any): void;
    updateProgress(skill: any, action: any, spendAmount: any): void;
}
declare class SpendMasteryMenu extends HTMLElement {
    masteryItems: any[];
    itemsByAction: Map<any, any>;
    levelUpAmount: number;
    _content: DocumentFragment;
    masteryItemContainer: any;
    poolDisplay: any;
    claimTokenButton: any;
    tokenImage: any;
    tokenQuantity: any;
    setLevel1Button: any;
    setLevel5Button: any;
    setLevel10Button: any;
    get curentSkill(): any;
    get currentToken(): any;
    connectedCallback(): void;
    setSkill(skill: any, game: any): void;
    _currentSkill: any;
    unsetSkill(): void;
    updateAllActions(): void;
    toggleHideLevel99(): void;
    updateAction(skill: any, action: any): void;
    updateTokenQuantity(amount: any): void;
    changeLevelUpAmount(newAmount: any): void;
}
declare class MasterySkillOptionsElement extends HTMLElement {
    _content: DocumentFragment;
    poolDisplay: any;
    viewCheckpointsButton: any;
    spendMasteryButton: any;
    masteryImage: any;
    connectedCallback(): void;
    masteryTooltip: any;
    disconnectedCallback(): void;
    setSkill(skill: any): void;
}
