declare class Currency {
  constructor(game: any);
  game: any;
  _amount: number;
  renderRequired: boolean;
  get media(): any;
  get amount(): number;
  queueNotification(amount: any): void;
  onLoad(): void;
  onAmountChange(): void;
  render(): void;
  add(amount: any): void;
  remove(amount: any): void;
  set(amount: any): void;
  canAfford(amountToSpend: any): boolean;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
}
declare class GP extends Currency {
  constructor(...args: any[]);
  _media: string;
  get shouldNotify(): any;
  renderAmount(): void;
}
declare class SlayerCoins extends Currency {
  constructor(...args: any[]);
  _media: string;
  get shouldNotify(): any;
  renderAmount(): void;
}
declare class RaidCoins extends Currency {
  constructor(...args: any[]);
  _media: string;
  shouldNotify: boolean;
  renderAmount(): void;
}
