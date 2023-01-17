declare class BaseSpell extends NamespacedObject {
    constructor(namespace: any, data: any, game: any);
    _name: any;
    _media: any;
    level: any;
    runesRequired: any;
    runesRequiredAlt: any;
    get media(): any;
}
declare class CombatSpell extends BaseSpell {
    requirements: any[];
    requiredItem: any;
    registerSoftDependencies(data: any, game: any): void;
}
declare class StandardSpell extends CombatSpell {
    maxHit: any;
    spellType: any;
    spellTier: any;
    specialAttack: any;
    get name(): any;
}
declare class CurseSpell extends CombatSpell {
    targetModifiers: any;
    get name(): any;
}
declare class AuroraSpell extends CombatSpell {
    modifiers: any;
    get name(): any;
    get description(): any;
}
declare class AncientSpell extends CombatSpell {
    specialAttack: any;
    get name(): any;
}
declare class ArchaicSpell extends CombatSpell {
    spellType: any;
    maxHit: any;
    specialAttack: any;
    get name(): any;
}
