"use strict";
class EquippedFood {
  constructor(maxSlots, game) {
    this.maxSlots = maxSlots;
    this.game = game;
    this.slots = [];
    this.selectedSlot = 0;
    for (let i = 0; i < maxSlots; i++) {
      this.addSlot();
    }
  }
  get currentSlot() {
    return this.slots[this.selectedSlot];
  }
  addSlot() {
    this.slots.push({ item: this.game.emptyFoodItem, quantity: 0 });
  }
  equip(item, quantity) {
    let food = this.slots.find((slot) => slot.item === item);
    if (food === undefined)
      food = this.slots.find((slot) => slot.item === this.game.emptyFoodItem);
    if (food !== undefined) {
      food.item = item;
      food.quantity += quantity;
    }
    return food !== undefined;
  }
  unequipSelected() {
    const food = this.currentSlot;
    food.item = this.game.emptyFoodItem;
    food.quantity = 0;
  }
  consume(quantity = 1) {
    if (this.currentSlot.quantity < quantity)
      throw new Error(`Tried to consume more food than equipped.`);
    this.currentSlot.quantity -= quantity;
    if (this.currentSlot.quantity === 0) {
      this.unequipSelected();
    }
  }
  setSlot(slotID) {
    this.checkSlotid(slotID);
    this.selectedSlot = slotID;
  }
  checkSlotid(slotID) {
    if (slotID >= this.maxSlots)
      throw new Error(
        `Tried to equip food to invalid slot id: ${slotID}. Max id is: ${
          this.maxSlots - 1
        }`
      );
  }
  encode(writer) {
    writer.writeUint32(this.selectedSlot);
    writer.writeUint32(this.maxSlots);
    writer.writeArray(this.slots, (slot, writer) => {
      writer.writeNamespacedObject(slot.item);
      writer.writeUint32(slot.quantity);
    });
    return writer;
  }
  decode(reader, version, addOnFail = false) {
    this.selectedSlot = reader.getUint32();
    this.maxSlots = reader.getUint32();
    this.slots = reader.getArray((reader) => {
      const item = reader.getNamespacedObject(this.game.items.food);
      const quantity = reader.getUint32();
      if (typeof item !== "string") {
        return { item, quantity };
      } else if (item.startsWith("melvor") && addOnFail) {
        this.game.bank.addDummyItemOnLoad(item, quantity);
      }
      return undefined;
    });
    while (this.slots.length < this.maxSlots) {
      this.addSlot();
    }
  }
  deserialize(reader, version, idMap, addOnFail = false) {
    this.selectedSlot = reader.getNumber();
    this.maxSlots = reader.getNumber();
    for (let i = 0; i < this.maxSlots; i++) {
      const itemID = reader.getNumber();
      let quantity = reader.getNumber();
      if (this.slots[i] === undefined) {
        this.addSlot();
      }
      const slot = this.slots[i];
      let item = this.game.emptyFoodItem;
      if (itemID !== -1) {
        const newID = idMap.items[itemID];
        const tempItem = this.game.items.food.getObjectByID(newID);
        if (tempItem !== undefined) item = tempItem;
        else {
          if (addOnFail) this.game.bank.addDummyItemOnLoad(newID, quantity);
          quantity = 0;
        }
      }
      slot.item = item;
      slot.quantity = quantity;
    }
  }
  convertFromOldSaveFormat(oldData, idMap) {
    this.maxSlots = 3;
    for (let i = 0; i < 3; i++) {
      if (this.slots[i] === undefined) {
        this.addSlot();
      }
      const slot = this.slots[i];
      const oldQty = oldData[i];
      if (oldQty.itemID !== 0) {
        const newID = idMap.items[oldQty.itemID];
        const item = this.game.items.getObjectByID(newID);
        if (item === undefined)
          throw new Error(
            "Error converting old equipment. Food item is not registered."
          );
        if (item instanceof FoodItem) {
          slot.item = item;
          slot.quantity = oldQty.qty;
        } else if (item !== undefined) {
          this.game.bank.addItem(item, oldQty.qty, false, false, true);
          console.log(
            `Non-food item was found equipped during save conversion, adding to bank.`
          );
        } else {
          this.game.bank.addDummyItemOnLoad(newID, oldQty.qty);
        }
      }
    }
  }
}
class FoodMenu {
  constructor(containerID) {
    this.dropOptions = [];
    const container = document.getElementById(containerID);
    if (container !== null) {
      this.container = container;
    } else {
      throw new Error(
        `Error constructing food menu: element with ID: ${containerID} does not exist.`
      );
    }
    const eatButton = createElement("button", {
      classList: [
        "btn",
        "btn-outline-secondary",
        "text-combat-smoke",
        "font-size-sm",
      ],
    });
    eatButton.type = "button";
    const foodQuantity = createElement("span", { text: "(0)" });
    const foodImage = createElement("img", { classList: ["combat-food"] });
    const foodHealing = createElement("span", { text: "+0 HP" });
    eatButton.append(foodQuantity, foodImage, foodHealing);
    const dropButton = createElement("button", {
      classList: [
        "btn",
        "btn-outline-secondary",
        "dropdown-toggle",
        "dropdown-toggle-split",
      ],
      attributes: [
        ["data-toggle", "dropdown"],
        ["aria-haspopup", "true"],
        ["aria-expanded", "false"],
      ],
      id: "dropdown-food-select",
    });
    dropButton.type = "button";
    dropButton.appendChild(
      createElement("span", {
        classList: ["sr-only"],
        text: getLangString("COMBAT_MISC", "TOGGLE_DROPDOWN"),
      })
    );
    this.dropContainer = createElement("div", {
      classList: ["dropdown-menu", "font-size-sm"],
      attributes: [["aria-labelledby", "dropdown-food-select"]],
    });
    this.dropDivider = createElement("div", {
      classList: ["dropdown-divider"],
    });
    this.unequipButton = createElement("a", {
      classList: ["dropdown-item", "text-danger", "pointer-enabled"],
      text: getLangString("COMBAT_MISC", "122"),
    });
    this.dropContainer.append(this.dropDivider, this.unequipButton);
    this.container
      .appendChild(createElement("div", { classList: ["btn-group"] }))
      .append(eatButton, dropButton, this.dropContainer);
    this.selected = {
      button: eatButton,
      healing: foodHealing,
      image: foodImage,
      quantity: foodQuantity,
    };
  }
  addDropdownOption() {
    const newButton = createElement("a", {
      classList: ["dropdown-item", "pointer-enabled"],
    });
    const quantity = createElement("span");
    const image = createElement("img", { classList: ["combat-food"] });
    const healing = createElement("span", {
      text: getLangString("COMBAT_MISC", "116"),
    });
    newButton.append(quantity, image, healing);
    this.dropContainer.insertBefore(newButton, this.dropDivider);
    this.dropOptions.push({
      button: newButton,
      quantity: quantity,
      image: image,
      healing: healing,
    });
  }
  showHoldToEat() {
    this.selected.button.classList.remove("btn-outline-secondary");
    this.selected.button.classList.add("btn-outline-success");
  }
  hideHoldToEat() {
    this.selected.button.classList.add("btn-outline-secondary");
    this.selected.button.classList.remove("btn-outline-success");
  }
  removeDropOption() {
    const removedOption = this.dropOptions.pop();
    if (removedOption !== undefined) {
      this.dropContainer.removeChild(removedOption.button);
    } else {
      throw new Error(`Tried to remove drop option when options are empty.`);
    }
  }
  renderOption(food, option, player) {
    if (food.quantity === 0) {
      option.quantity.textContent = "";
      option.healing.textContent = getLangString("COMBAT_MISC", "116");
    } else {
      option.quantity.textContent = `(${numberWithCommas(food.quantity)})`;
      option.healing.textContent = `+${player.getFoodHealing(food.item)} HP`;
    }
    option.image.src = `${CDNDIR}${food.item.media}`;
  }
  renderSelected(food, player) {
    this.renderOption(food, this.selected, player);
  }
  renderSelection(foods, player) {
    foods.forEach((food, i) => {
      if (this.dropOptions[i] === undefined) this.addDropdownOption();
      const dropOption = this.dropOptions[i];
      this.renderOption(food, dropOption, player);
    });
    const optsToRemove = this.dropOptions.length - foods.length;
    for (let i = 0; i < optsToRemove; i++) this.removeDropOption();
  }
  render(player) {
    this.renderSelected(player.food.currentSlot, player);
    this.renderSelection(player.food.slots, player);
  }
  setCallbacks(player) {
    this.unequipButton.onclick = () => player.unequipFood();
    this.selected.button.onclick = () => {
      player.eatFood();
      player.render();
    };
    this.selected.button.ontouchstart = (e) => {
      player.eatFood();
      player.render();
      player.startHoldToEat();
      this.showHoldToEat();
      e.preventDefault();
    };
    this.selected.button.ontouchend = (e) => {
      player.stopHoldToEat();
      this.hideHoldToEat();
      e.preventDefault();
    };
    this.selected.button.onmousedown = (e) => {
      player.startHoldToEat();
      this.showHoldToEat();
      e.preventDefault();
    };
    this.selected.button.onmouseup = () => {
      player.stopHoldToEat();
      this.hideHoldToEat();
    };
    this.selected.button.onmouseleave = () => {
      player.stopHoldToEat();
      this.hideHoldToEat();
    };
    this.dropOptions.forEach((option, i) => {
      option.button.onclick = () => player.selectFood(i);
    });
  }
}
