declare class EffectRenderer {
    constructor(container: any);
    container: any;
    renderedEffects: Map<any, any>;
    removalQueue: Set<any>;
    removeEffects(): void;
    flushRemovalQueue(): void;
    createEffect(icon: any, turns: any, tooltipContent: any): {
        container: HTMLDivElement;
        icon: HTMLImageElement;
        number: HTMLDivElement;
        tooltip: any;
    };
    createTooltip(element: any, content: any): any;
    addEffect(data: any, turnText: any, tooltipContent: any, media: any): void;
    addDOT(activeDOT: any): void;
    addModifier(activeEffect: any, effect: any, attack: any, turnNoun: any): void;
    addSleep(activeSleep: any): void;
    addStun(activeStun: any): void;
    addStunImmunity(stunImmunity: any): void;
    formatTurnsLeft(turns: any): any;
    formatStacks(stacks: any, max: any): any;
    addCurse(activeCurse: any): void;
    addReflexive(activeReflexive: any, effect: any, attack: any): void;
    addStacking(activeStacking: any, effect: any): void;
    addCombo(activeCombo: any, effect: any): void;
    queueRemoval(data: any): void;
    queueRemoveAll(): void;
}
declare namespace effectMedia {
    const offenseUp: string;
    const defenseUp: string;
    const offenseDown: string;
    const defenseDown: string;
    const frozen: string;
    const stun: string;
    const sleep: string;
    const slowed: string;
    const markOfDeath: string;
    const afflicted: string;
    const speedup: string;
    const frostBurn: string;
    const decay: string;
    const madness: string;
    const torment: string;
    const despair: string;
    const stunImmunity: string;
    const shocked: string;
}
declare namespace dotMedia {
    const Burn: string;
    const Bleed: string;
    const Poison: string;
    const Regen: string;
    const DeadlyPoison: string;
}
