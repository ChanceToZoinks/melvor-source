declare class SkillProgressDisplay {
    constructor(game: any);
    game: any;
    elems: Map<any, any>;
    updateXP(skill: any): void;
    updateLevel(skill: any): void;
    getSkillElements(skill: any): any;
    createTooltip(element: any, content: any): any;
    createTooltipHTML(skill: any): string;
}
declare class SkillNav {
    constructor(game: any);
    game: any;
    navs: Map<any, any>;
    active: Set<any>;
    glowing: Set<any>;
    updateSkillLevel(skill: any): void;
    updateSkillLock(skill: any): void;
    setActive(skill: any): void;
    setInactive(skill: any): void;
    setGlowing(skill: any, shouldGlow: any): void;
    setAllInactive(): void;
    setLocked(nav: any): void;
    setUnlocked(nav: any, levelCap: any): void;
    setLevel(nav: any, level: any, levelCap: any): void;
    getNavs(skill: any): any;
}
