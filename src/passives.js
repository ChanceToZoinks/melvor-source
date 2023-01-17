"use strict";
class CombatPassive extends NamespacedObject {
  constructor(namespace, data) {
    super(namespace, data.id);
    this._name = data.name;
    this._customDescription = data.customDescription;
    this.modifiers = data.modifiers;
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("PASSIVES", `NAME_${this.localID}`);
    }
  }
  get description() {
    if (this._customDescription !== undefined) {
      if (this.isModded) {
        return this._customDescription;
      } else {
        return getLangString("PASSIVES", `DESC_${this.localID}`);
      }
    }
    return describeModifierDataPlain(this.modifiers);
  }
}
class ControlledAffliction extends CombatPassive {
  constructor(namespace, game) {
    super(namespace, {
      id: "ControlledAffliction",
      name: "Controlled Affliction",
      modifiers: {
        get increasedFlatMaxHitpoints() {
          return 50 * (game.combat.eventProgress + 1);
        },
        get increasedAfflictionChance() {
          return 30 + 5 * game.combat.eventProgress;
        },
      },
    });
  }
}
