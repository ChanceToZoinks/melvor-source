declare function constructDamageFromData(data: any): any;
declare function constructEffectFromData(effectData: any, game: any): any;
declare class SpecialAttack extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  damage: any;
  prehitEffects: any[];
  onhitEffects: any[];
  usesRunesPerProc: any;
  usesPrayerPointsPerProc: any;
  usesPotionChargesPerProc: any;
  isDragonbreath: any;
  minAccuracy: any;
  defaultChance: any;
  cantMiss: any;
  attackCount: any;
  attackInterval: any;
  lifesteal: any;
  attackTypes: Set<any>;
  descriptionGenerator: any;
  _name: any;
  _description: any;
  get name(): any;
  get description(): any;
  get canNormalAttack(): boolean;
  get descriptionTemplateData(): {
    hitCount: string;
    interval: string;
    duration: string;
    lifesteal: string;
  };
  registerSoftDependencies(data: any, game: any): void;
  consumeStacks: any;
}
declare class ItemEffect extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  effect: any;
}
declare class ItemEffectAttack extends SpecialAttack {
  constructor(namespace: any, game: any);
  effectToItemEffectMap: Map<any, any>;
  itemEffects: NamespaceRegistry;
  registerItemEffects(namespace: any, data: any, game: any): void;
  getItemEffectFromEffect(effect: any): any;
}
declare class StackingEffect extends NamespacedObject {
  type: string;
  stacksToAdd: any;
  modifiers: any;
  maxStacks: any;
  _media: any;
  _name: any;
  _langName: any;
  get name(): any;
  get media(): any;
}
declare class CurseEffect {
  constructor(data: any, game: any);
  type: string;
  chance: any;
  isRandom: any;
  curse: any;
}
