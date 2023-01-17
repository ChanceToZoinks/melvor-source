declare class SummoningMarkDiscovery extends HTMLElement {
    _content: DocumentFragment;
    status: any;
    name: any;
    image: any;
    levelRequirement: any;
    discoveredContent: any;
    progressBar: any;
    skillImageContainer: any;
    discoveryTotal: any;
    quickCreateButton: any;
    connectedCallback(): void;
    setLocked(mark: any): void;
    setUndiscovered(mark: any): void;
    setDiscovered(mark: any): void;
    getSkillIcon(skill: any): any;
    setName(name: any): void;
    setSkillImages(skills: any): void;
    updateDiscoveryCount(mark: any): void;
}
declare class SummoningSynergySearch extends HTMLElement {
    _content: DocumentFragment;
    flexContainer: any;
    markElements0: {
        container: any;
        image: any;
        quantity: any;
        skillImage: any;
    };
    markElements1: {
        container: any;
        image: any;
        quantity: any;
        skillImage: any;
    };
    synergyIcon: any;
    synergyDescription: any;
    connectedCallback(): void;
    setSynergy(synergy: any): void;
    synergy: any;
    updateLockStatus(): void;
    setLocked(): void;
    setLockedDescriptions(): void;
    setUnlocked(): void;
    updateQuantities(): void;
    updateMarkQuantity(markElements: any, mark: any): void;
}
declare class SynergySearchMenu extends HTMLElement {
    filterOptions: Map<any, any>;
    visibleSynergies: Set<any>;
    _content: DocumentFragment;
    showAllButton: any;
    showUnlockedButton: any;
    filterDropdownButton: any;
    filterOptionsContainer: any;
    searchBar: any;
    searchElements: Map<any, any>;
    connectedCallback(): void;
    initialize(): void;
    showAllSynergies(): void;
    showSynergiesWithMark(mark: any): void;
    showUnlockedSynergies(): void;
    updateFilterOptions(): void;
    updateVisibleElementUnlocks(): void;
    updateVisibleElementQuantities(): void;
    querySynergies(query: any): void;
    onSearchChange(): void;
}
