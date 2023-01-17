declare class ItemCharges {
  constructor(game: any);
  game: any;
  charges: Map<any, any>;
  renderQueue: {
    items: Set<any>;
  };
  render(): void;
  getSnapShot(): Map<any, any>;
  itemHasCharge(item: any): boolean;
  getCharges(item: any): any;
  addCharges(item: any, amount: any): void;
  removeCharges(item: any, amount: any): void;
  removeAllCharges(item: any): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  convertFromOldFormat(oldGloveData: any, idMap: any): void;
}
