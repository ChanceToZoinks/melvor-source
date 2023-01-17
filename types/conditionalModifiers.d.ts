declare function checkValueCondition(value: any, condition: any): boolean;
declare function checkBooleanCondition(value: any, condition: any): any;
declare class ConditionalModifier {
    constructor(data: any, game: any, selfItem: any);
    isActive: boolean;
    hooks: Set<any>;
    condition: any;
    modifiers: any;
    enemyModifiers: any;
    getConditionFromData(conditionData: any, game: any, selfItem: any): any;
    addConditionHooks(condition: any): void;
}
