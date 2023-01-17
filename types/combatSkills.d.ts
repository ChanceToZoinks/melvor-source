declare class CombatSkill extends Skill {
}
declare class Attack extends CombatSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: SkillRenderQueue;
}
declare class Strength extends CombatSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: SkillRenderQueue;
}
declare class Defence extends CombatSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: SkillRenderQueue;
}
declare class Hitpoints extends CombatSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: SkillRenderQueue;
}
declare class Ranged extends CombatSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: SkillRenderQueue;
}
declare class PrayerRenderQueue extends SkillRenderQueue {
    constructor(...args: any[]);
    prayerMenu: boolean;
}
declare class Prayer extends CombatSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: PrayerRenderQueue;
    renderPrayerMenu(): void;
}
declare class Slayer extends CombatSkill {
    constructor(namespace: any, game: any);
    _media: string;
    renderQueue: SkillRenderQueue;
}
