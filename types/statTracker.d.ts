declare class StatTracker {
  stats: Map<any, any>;
  wasMutated: boolean;
  add(stat: any, qty: any): void;
  set(stat: any, value: any): void;
  inc(stat: any): void;
  get(stat: any): any;
  getSum(stats: any): any;
  remove(stat: any): void;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  deserialize(reader: any, version: any): void;
  convertFromOldStatArray(oldStats: any): void;
}
declare class MappedStatTracker {
  constructor(registry: any, dummyConstructor: any, game: any);
  registry: any;
  dummyConstructor: any;
  game: any;
  statsMap: Map<any, any>;
  add(key: any, statID: any, qty: any): void;
  get(key: any, statID: any): any;
  getTracker(key: any): any;
  encode(writer: any): any;
  decode(reader: any, version: any): void;
  deserialize(reader: any, version: any, idMap: any): void;
}
