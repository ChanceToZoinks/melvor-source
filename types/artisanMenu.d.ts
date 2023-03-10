declare class DropDown extends ContainedComponent {
  constructor(
    parent: any,
    id: any,
    buttonClasses: any,
    optionsClasses: any,
    scroll?: boolean,
    maxOptionsHeight?: number
  );
  parent: any;
  container: any;
  button: any;
  optionsContainer: any;
  setButtonText(text: any): void;
  setButtonCallback(callback: any): void;
  addOption(optionContent: any, callback: any): void;
  clearOptions(): void;
}
declare class ArtisanMenu extends ContainedComponent {
  constructor(containerID: any, skill: any);
  skill: any;
  recipeDropdownItems: any[];
  progressTimestamp: number;
  progressInterval: number;
  noneSelected: boolean;
  parent: HTMLElement;
  container: any;
  nameRow: any;
  productBlock: any;
  productImage: any;
  productQuantity: any;
  createBlock: any;
  createText: any;
  productName: any;
  productDescription: any;
  selectedText: any;
  viewStatsText: any;
  buffsContainer: any;
  productPreservation: PreservationIcon;
  productDoubling: DoublingIcon;
  masteryCol: any;
  mastery: MasteryDisplay;
  ingredientsCol: any;
  dropDownCont: any;
  recipeDropdown: DropDown;
  requires: RequiresBox;
  haves: HavesBox;
  productsCol: any;
  produces: ProducesBox;
  productIcon: ItemQtyIcon;
  grants: GrantsBox;
  creationCol: any;
  createButton: any;
  interval: IntervalIcon;
  progressBar: ProgressBar;
  localize(): void;
  setSelected(recipe: any): void;
  setIngredients(items: any, gp: any, sc: any): void;
  setIngredientsFromRecipe(recipe: any): void;
  setProduct(item: any, qty: any): void;
  product: any;
  updateQuantities(): void;
  updateGrants(xp: any, masteryXP: any, poolXP: any): void;
  updateChances(preserveChance: any, doublingChance: any): void;
  updateInterval(interval: any): void;
  setCreateCallback(callback: any): void;
  animateProgressFromTimer(timer: any): void;
  startProgressBar(interval: any): void;
  stopProgressBar(): void;
  updateProgressBar(): void;
  hideRecipeDropdown(): void;
  showRecipeDropdown(): void;
  setRecipeDropdown(
    altRecipeIngredients: any,
    selectCallback: any,
    displayOrder: any
  ): void;
}
declare class HerbloreArtisanMenu extends ArtisanMenu {
  constructor(herblore: any);
  tierImages: any[];
  tierTooltips: any[];
  tierContainer: any;
  tierText: any;
  setProductTier(product: any, productTier: any): void;
  setPotionDescription(item: any, recipe: any): void;
}
