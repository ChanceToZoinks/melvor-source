declare class Enemy extends Character {
  state: any;
  modifiers: CombatModifiers;
  spellSelection: SpellSelection;
  noun: {
    plain: string;
    possesive: string;
    pronoun: string;
    is: string;
  };
  rendersRequired: {
    stats: boolean;
    hitChance: boolean;
    hitpoints: boolean;
    damageSplash: boolean;
    effects: boolean;
    image: boolean;
    levels: boolean;
    attackBar: boolean;
    attackBarMinibar: boolean;
    passives: boolean;
    attacks: boolean;
    damageValues: boolean;
  };
  randomAttackType: string;
  isBoss: boolean;
  get statElements(): any;
  get splashManager(): any;
  get effectRenderer(): any;
  get attackBar(): any;
  get attackBarMinibar(): any;
  get encodeMonster(): boolean;
  setMonster(monster: any): void;
  monster: any;
  computeAttackType(): void;
  computeAttackSelection(): void;
  computeLevels(): void;
  computeEquipmentStats(): void;
  computeModifiers(): void;
  addGamemodeModifiers(): void;
  getAccuracyValues(): {
    effectiveLevel: number;
    bonus: number;
  };
  getFlatReflectDamage(): number;
  processDeath(): void;
  regen(): void;
  setSpawning(): void;
  renderAttacksAndPassives(): void;
  renderLevels(): void;
  renderImageAndName(): void;
  getAttackTypeMedia(attackType: any): string;
  renderNoStats(): void;
  setStatsFromMonster(monster: any): void;
  postAttack(attack: any, attackType: any): void;
  onHit(): void;
  onMiss(): void;
}
declare var EnemyState: any;
