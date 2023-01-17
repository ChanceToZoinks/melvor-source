declare class AttackStyle extends NamespacedObject {
    constructor(namespace: any, data: any, game: any);
    modifiers: any;
    experienceGain: any;
    attackType: any;
    _name: any;
    get name(): any;
    get toolTipContent(): string;
    get buttonID(): string;
}
