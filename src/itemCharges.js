"use strict";
class ItemCharges {
  constructor(game) {
    this.game = game;
    this.charges = new Map();
    this.renderQueue = { items: new Set() };
  }
  render() {
    if (this.renderQueue.items.size > 0) {
      this.renderQueue.items.forEach((item) => {
        const charges = this.getCharges(item);
        const elements = document.querySelectorAll(
          `item-charge-display[data-item-id="${item.id}"]`
        );
        elements.forEach((chargeDisplay) => {
          chargeDisplay.updateCharges(charges);
        });
      });
      shopMenu.updateForItemChargeChange();
      this.renderQueue.items.clear();
    }
  }
  getSnapShot() {
    return new Map(this.charges);
  }
  itemHasCharge(item) {
    return this.charges.has(item);
  }
  getCharges(item) {
    var _a;
    return (_a = this.charges.get(item)) !== null && _a !== void 0 ? _a : 0;
  }
  addCharges(item, amount) {
    if (amount <= 0)
      throw new Error("Tried to add negative or zero item charges.");
    this.charges.set(item, this.getCharges(item) + amount);
    this.game.combat.player.updateConditionals("ItemCharges", true, true);
    this.renderQueue.items.add(item);
  }
  removeCharges(item, amount) {
    const currentCharges = this.getCharges(item);
    if (currentCharges <= 0) return;
    if (amount <= 0)
      throw new Error("Tried to remove negative or zero item charges.");
    const newCharges = currentCharges - amount;
    if (newCharges <= 0) {
      this.charges.delete(item);
      this.game.combat.notifications.add({ type: "ItemCharges", args: [item] });
    } else {
      this.charges.set(item, newCharges);
    }
    this.game.combat.player.updateConditionals("ItemCharges", true, true);
    this.renderQueue.items.add(item);
  }
  removeAllCharges(item) {
    this.charges.delete(item);
    this.game.combat.player.updateConditionals("ItemCharges", true, true);
    this.renderQueue.items.add(item);
  }
  encode(writer) {
    writer.writeMap(this.charges, writeNamespaced, (charge, writer) =>
      writer.writeUint32(charge)
    );
    return writer;
  }
  decode(reader, version) {
    this.charges = reader.getMap(
      (reader) => {
        const item = reader.getNamespacedObject(this.game.items.equipment);
        if (typeof item === "string") {
          if (item.startsWith("melvor"))
            return this.game.items.equipment.getDummyObject(
              item,
              DummyEquipmentItem,
              this.game
            );
          else return undefined;
        }
        return item;
      },
      (reader) => reader.getUint32()
    );
  }
  convertFromOldFormat(oldGloveData, idMap) {
    oldGloveData.forEach((gloveData, gloveID) => {
      if (gloveData.isActive && gloveData.remainingActions > 0) {
        const itemID = idMap.skillGloves[gloveID];
        let item = this.game.items.equipment.getObjectByID(itemID);
        if (item === undefined)
          item = this.game.items.equipment.getDummyObject(
            itemID,
            DummyEquipmentItem,
            this.game
          );
        this.charges.set(item, gloveData.remainingActions);
      }
    });
  }
}
