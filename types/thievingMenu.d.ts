declare class ThievingMenu {
    constructor(containerID: any);
    areaPanels: Map<any, any>;
    npcNavs: Map<any, any>;
    activePanel: any;
    container: HTMLElement;
    createInfoBox(container: any): {
        container: any;
        xp: XPIcon;
        interval: IntervalIcon;
        stealth: StealthIcon;
        double: DoublingIcon;
        masteryXP: MasteryXPIcon;
        poolXP: MasteryPoolIcon;
    };
    hideAreaPanel(area: any): void;
    showAreaPanel(area: any): void;
    updateNPCsForLevel(level: any): void;
    updateNPCButtons(): void;
    selectNPC(npc: any, area: any): void;
    selectNPCInPanel(npc: any, panel: any): void;
    updateAllAreaPanels(): void;
    setStopButton(area: any): void;
    removeStopButton(): void;
    updateAreaPanelInfo(panel: any): void;
    updateInfoContainerForNPC(panel: any, npc: any): void;
    showNPCDrops(npc: any, area: any): void;
    formatSpecialDrop(item: any, qty?: number): string;
    getProgressBar(area: any): any;
    localize(): void;
}
