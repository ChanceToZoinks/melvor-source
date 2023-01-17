declare class EnemyAttackPassiveMenu {
  constructor(isCombat: any);
  container: HTMLElement;
  passiveContainer: HTMLElement;
  attackContainer: HTMLElement;
  maxhitSpans: any[];
  passiveDescCont: any;
  attackDescCont: any;
  render(passives: any, attackSelection: any, character: any): void;
  renderMaxhits(attackSelection: any, character: any): void;
  renderPassives(passives: any): boolean;
  hidePassives(): void;
  shouldHideAttacks(attackSelection: any): boolean;
  renderAttacks(attackSelection: any, character: any): boolean;
  getAttackMaxHitText(attack: any, character: any): string;
  hideAttacks(): void;
  hide(): void;
}
