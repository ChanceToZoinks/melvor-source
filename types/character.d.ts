declare class Character {
  static calculateStandardStat(values: any): number;
  static calculateStandardMaxHit(baseLevel: any, strengthBonus: any): number;
  constructor(manager: any, game: any);
  manager: any;
  game: any;
  hitpoints: number;
  stun: {
    turns: number;
    flavour: string;
  };
  sleep: {
    turns: number;
  };
  nextAction: string;
  attackCount: number;
  stunImmunity: {
    turns: number;
  };
  isAttacking: boolean;
  firstHit: boolean;
  slowCount: number;
  frostBurnCount: number;
  modifierEffects: {
    fromSelf: {
      countSelf: Map<any, any>;
      countTarget: Map<any, any>;
    };
    fromTarget: {
      countSelf: Map<any, any>;
      countTarget: Map<any, any>;
    };
  };
  reflexiveEffects: Map<any, any>;
  stackingEffect: Map<any, any>;
  comboEffects: Map<any, any>;
  activeDOTs: Map<any, any>;
  target: Character;
  equipmentStats: EquipmentStats;
  levels: {
    Hitpoints: number;
    Attack: number;
    Strength: number;
    Defence: number;
    Ranged: number;
    Magic: number;
    Prayer: number;
  };
  stats: CharacterStats;
  attackType: string;
  hitchance: number;
  availableAttacks: any[];
  targetModifiers: TargetModifiers;
  canCurse: boolean;
  canAurora: boolean;
  passives: Map<any, any>;
  rendersRequired: {
    stats: boolean;
    hitChance: boolean;
    hitpoints: boolean;
    damageSplash: boolean;
    effects: boolean;
    attackBar: boolean;
    attackBarMinibar: boolean;
    attacks: boolean;
    passives: boolean;
    damageValues: boolean;
  };
  turnsTaken: number;
  timers: {
    act: Timer;
    regen: Timer;
  };
  nextAttack: any;
  get isCursed(): boolean;
  get isSleeping(): boolean;
  get isStunned(): boolean;
  get hitpointsPercent(): number;
  get usingAncient(): boolean;
  get isUsingArchaic(): boolean;
  get isBurning(): boolean;
  get isBleeding(): boolean;
  get isPoisoned(): boolean;
  isDotActive(type: any): boolean;
  isEffectSubtypeActive(type: any): boolean;
  isTargetDotActive(type: any): boolean;
  isFightingTypeVsType(thisType: any, targetType: any): boolean;
  isFighting(): any;
  get minHitFromMaxHitPercent(): any;
  setDefaultSpells(): void;
  setRenderAll(): void;
  applyUniqueSpawnEffects(): void;
  initializeForCombat(): void;
  stopFighting(): void;
  computeAttackInterval(): void;
  computeMinHit(): void;
  computeMaxHP(): void;
  computeAccuracy(): void;
  computeMaxHit(): void;
  computeMeleeMaxHit(): number;
  computeRangedMaxHit(): number;
  computeMagicMaxHit(): number;
  computeEvasion(): void;
  getMeleeDefenceBonus(): number;
  getRangedDefenceBonus(): number;
  getMagicDefenceBonus(): number;
  computeDamageReduction(): void;
  modifyAccuracy(accuracy: any): any;
  modifyEvasion(evasion: any): void;
  modifyMaxHit(maxHit: any): any;
  getMaxHitMultiplierBasedOnEnemyAttackType(): number;
  modifyMinHit(minHit: any): any;
  modifyMaxHP(maxHP: any): any;
  modifyAttackInterval(attackInterval: any): any;
  modifyDamageReduction(reduction: any): any;
  computeAllStats(): void;
  computeCombatStats(): void;
  updateHPConditionals(computeStats?: boolean): void;
  computeHitchance(): void;
  damage(amount: any, source: any): void;
  heal(amount: any): any;
  addHitpoints(amount: any): void;
  setHitpoints(value: any): void;
  isImmuneTo(attackType: any): any;
  fireMissSplash(immune: any): void;
  applyEffects(effects: any, target: any, damage?: number, attack?: any): void;
  attack(target: any, attack: any): number;
  modifyAttackDamage(target: any, attack: any, damage: any): number;
  getAttackMaxDamage(attack: any): number;
  lifesteal(attack: any, damage: any): number;
  removeStackingEffect(effect: any): void;
  onBeingHit(): void;
  rollToHit(target: any, attack: any): boolean;
  addAuroraModifiers(): void;
  addCurseModifiers(): void;
  addEffectModifiers(): void;
  addCombatAreaEffectModifiers(): void;
  addPassiveModifiers(): void;
  addTargetModifiers(): void;
  getDamageModifiers(target: any): number;
  applyDamageModifiers(target: any, damage: any): any;
  removeAllEffects(removeDOTS?: boolean): void;
  curse:
    | {
        turns: any;
        data: any;
      }
    | {
        turns: any;
        data: any;
      };
  removeComboEffects(): void;
  addPassives(
    passives: any,
    save?: boolean,
    display?: boolean,
    statUpdate?: boolean
  ): void;
  removePassives(passives: any): void;
  removeAllPassives(): void;
  applyEffect(effect: any, target: any, damage?: number, attack?: any): void;
  applyStackingEffect(effect: any, target: any): void;
  applyReflexiveEffect(effect: any, attack: any): void;
  applyComboEffect(effect: any, attack: any): void;
  castCurseSpell(target: any, curse: any): void;
  applyCurse(target: any, curse: any): void;
  combatModifierUpdate(): void;
  immuneToDOT(type: any): boolean;
  applyDOT(effect: any, target: any, damageDealt: any): boolean;
  onDOTApplication(type: any): void;
  onDOTRemoval(type: any, statUpdate?: boolean): void;
  onTargetDOTRemoval(type: any, statUpdate?: boolean): void;
  onModifierEffectApplication(): void;
  onModifierEffectRemoval(): void;
  onTargetModifierEffectRemoval(): void;
  onTargetModifierEffectApplication(): void;
  getModifierEffectAttackMap(effect: any): Map<any, any>;
  applyRandomCurseEffect(chance: any, target: any): void;
  applyCurseEffect(effect: any, target: any): void;
  applyModifierEffect(effect: any, target: any, attack: any): void;
  applySleep(effect: any, target: any, interruptAttack?: boolean): void;
  onBeingSlept(): void;
  onSleepRemoval(): void;
  onTargetSleepRemoval(): void;
  onApplyingSleep(target: any): void;
  applyStun(effect: any, target: any, interruptAttack?: boolean): void;
  onBeingStunned(): void;
  onStunRemoval(): void;
  onTargetStunRemoval(): void;
  onApplyingStun(target: any): void;
  passiveTick(): void;
  activeTick(): void;
  getErrorLog(): string;
  act(): void;
  countTargetEffectTurns(): boolean;
  countModifierEffectTurns(attackMap: any): boolean;
  removeModifierEffects(attackMap: any): boolean;
  dot(dotID: any): void;
  queueNextAction(noSpec?: boolean, tickOffset?: boolean): void;
  isAttackAlreadyActive(attack: any): any;
  isEffectActive(effect: any, attack: any): boolean;
  renderStats(): void;
  renderDamageValues(): void;
  formatNormalAttackDamage(damage: any): string;
  renderHitchance(): void;
  renderHitpoints(): void;
  renderDamageSplashes(): void;
  renderEffects(): void;
  renderAttackBar(): void;
  renderModifierEffect(attackMap: any, turnNoun: any): void;
  checkCombatCondition(condition: any): any;
  render(): void;
  resetActionState(): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  encodeModifierEffects(attackMap: any, writer: any): void;
  decodeModifierEffects(reader: any, version: any): any;
  encodeReflexiveEffects(writer: any): void;
  decodeReflexiveEffects(reader: any, version: any): any;
  encodeStackingEffects(writer: any): void;
  decodeStackingEffects(reader: any, version: any): any;
  encodeDOTS(writer: any): void;
  decodeDOTS(reader: any, version: any): any;
  encodePassives(writer: any): void;
  decodePassives(reader: any, version: any): void;
  encodeComboEffects(writer: any): void;
  decodeComboEffects(reader: any, version: any): any;
  deserialize(reader: any, version: any, idMap: any): void;
  deserializeModifierEffects(
    attackMap: any,
    reader: any,
    version: any,
    idMap: any
  ): void;
  deserializeReflexiveEffects(reader: any, version: any, idMap: any): void;
  deserializeStackingEffects(reader: any, version: any, idMap: any): void;
  deserializeComboEffects(reader: any, version: any, idMap: any): void;
  deserializeDOTS(reader: any, version: any): void;
  deserializePassives(reader: any, version: any, idMap: any): void;
}
declare class SpellSelection {
  constructor(game: any);
  game: any;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  standard: any;
  ancient: any;
  aurora: any;
  curse: any;
  archaic: any;
  validate(): void;
}
declare class EquipmentStats {
  constructor(stats?: any[]);
  attackSpeed: number;
  stabAttackBonus: number;
  slashAttackBonus: number;
  blockAttackBonus: number;
  rangedAttackBonus: number;
  magicAttackBonus: number;
  meleeStrengthBonus: number;
  rangedStrengthBonus: number;
  magicDamageBonus: number;
  meleeDefenceBonus: number;
  rangedDefenceBonus: number;
  magicDefenceBonus: number;
  damageReduction: number;
  summoningMaxhit: number;
  addItemStats(item: any): void;
  remItemStats(item: any): void;
  addStats(stats: any): void;
  subtractStats(stats: any): void;
  resetStats(): void;
}
declare class CharacterStats {
  evasion: {
    melee: number;
    ranged: number;
    magic: number;
  };
  minHit: number;
  maxHit: number;
  accuracy: number;
  maxHitpoints: number;
  attackInterval: number;
  damageReduction: number;
  get averageEvasion(): number;
  get maxEvasion(): number;
  getValueTable(): {
    name: string;
    value: number;
  }[];
}
