declare class EquippedFood {
  constructor(maxSlots: any, game: any);
  maxSlots: any;
  game: any;
  slots: any[];
  selectedSlot: number;
  get currentSlot(): any;
  addSlot(): void;
  equip(item: any, quantity: any): boolean;
  unequipSelected(): void;
  consume(quantity?: number): void;
  setSlot(slotID: any): void;
  checkSlotid(slotID: any): void;
  encode(writer: any): any;
  decode(reader: any, version: any, addOnFail?: boolean): void;
  deserialize(reader: any, version: any, idMap: any, addOnFail?: boolean): void;
  convertFromOldSaveFormat(oldData: any, idMap: any): void;
}
declare class FoodMenu {
  constructor(containerID: any);
  dropOptions: any[];
  container: HTMLElement;
  dropContainer: any;
  dropDivider: any;
  unequipButton: any;
  selected: {
    button: any;
    healing: any;
    image: any;
    quantity: any;
  };
  addDropdownOption(): void;
  showHoldToEat(): void;
  hideHoldToEat(): void;
  removeDropOption(): void;
  renderOption(food: any, option: any, player: any): void;
  renderSelected(food: any, player: any): void;
  renderSelection(foods: any, player: any): void;
  render(player: any): void;
  setCallbacks(player: any): void;
}
