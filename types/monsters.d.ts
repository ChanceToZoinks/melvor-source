declare class Monster extends NamespacedObject {
  constructor(namespace: any, data: any, game: any);
  specialAttacks: any[];
  _media: any;
  _mediaAnimation: any;
  levels: any;
  equipmentStats: any;
  ignoreCompletion: any;
  attackType: any;
  passives: any;
  lootChance: any;
  lootTable: DropTable;
  gpDrops: any;
  bones: {
    item: any;
    quantity: any;
  };
  canSlayer: any;
  isBoss: any;
  selectedSpell: any;
  _description: any;
  _name: any;
  hasDescription: boolean;
  pet: {
    pet: any;
    kills: any;
  };
  get media(): any;
  get name(): any;
  get description(): any;
  get combatLevel(): number;
}
declare class DummyMonster extends Monster {}
declare class GolbinMonster extends Monster {}
