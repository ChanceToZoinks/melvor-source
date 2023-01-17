"use strict";
class MelvorDatabase extends Dexie {
  constructor() {
    super("melvordb");
    this.version(2).stores({ mods: "&id", localMods: "++id" });
  }
}
