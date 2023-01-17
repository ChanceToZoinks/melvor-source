"use strict";
class SummoningMarkDiscovery extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("summoning-mark-discovery-template"));
    this.status = getElementFromFragment(this._content, "mark-status", "small");
    this.name = getElementFromFragment(this._content, "mark-name", "span");
    this.image = getElementFromFragment(this._content, "mark-image", "img");
    this.levelRequirement = getElementFromFragment(
      this._content,
      "mark-level-req",
      "h5"
    );
    this.discoveredContent = getElementFromFragment(
      this._content,
      "discovered-content",
      "div"
    );
    this.progressBar = getElementFromFragment(
      this._content,
      "mark-progress",
      "div"
    );
    this.skillImageContainer = getElementFromFragment(
      this._content,
      "mark-skill-images",
      "h5"
    );
    this.discoveryTotal = getElementFromFragment(
      this._content,
      "mark-discovery-total",
      "h5"
    );
    this.quickCreateButton = getElementFromFragment(
      this._content,
      "quick-create-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setLocked(mark) {
    this.status.className = "text-danger";
    this.status.textContent = getLangString("MENU_TEXT", "LOCKED");
    this.setName(getLangString("MENU_TEXT", "QUESTION_MARKS"));
    this.image.src = cdnMedia("assets/media/main/question.svg");
    this.levelRequirement.textContent = "";
    this.levelRequirement.append(
      ...templateLangStringWithNodes(
        "MENU_TEXT",
        "REQUIRES_SKILL_LEVEL",
        { skillImage: this.getSkillIcon(game.summoning) },
        { level: `${mark.level}` }
      )
    );
    hideElement(this.discoveredContent);
    showElement(this.levelRequirement);
    this.quickCreateButton.onclick = null;
  }
  setUndiscovered(mark) {
    this.status.className = "text-warning";
    this.status.textContent = getLangString("MENU_TEXT", "NOT_DISCOVERED");
    this.setName(getLangString("MENU_TEXT", "QUESTION_MARKS"));
    this.image.src = cdnMedia("assets/media/main/question.svg");
    this.setSkillImages(mark.skills);
    this.updateDiscoveryCount(mark);
    showElement(this.discoveredContent);
    hideElement(this.levelRequirement);
    hideElement(this.quickCreateButton);
    this.quickCreateButton.onclick = null;
  }
  setDiscovered(mark) {
    const markLevel = game.summoning.getMarkLevel(mark);
    this.status.className = "text-warning";
    this.status.textContent = templateLangString("MENU_TEXT", "MARK_LEVEL", {
      level: `${markLevel}`,
    });
    this.setName(mark.product.name);
    this.image.src = mark.markMedia;
    this.setSkillImages(mark.skills);
    this.updateDiscoveryCount(mark);
    showElement(this.discoveredContent);
    hideElement(this.levelRequirement);
    showElement(this.quickCreateButton);
    this.quickCreateButton.onclick = () => {
      switchSummoningCategory(mark.category);
      game.summoning.selectRecipeOnClick(mark);
    };
  }
  getSkillIcon(skill) {
    return createElement("img", {
      classList: ["skill-icon-xs", "mr-1"],
      attributes: [["src", skill.media]],
    });
  }
  setName(name) {
    let nodesToAppend;
    const nameNodes = templateLangStringWithNodes(
      "MENU_TEXT",
      "MARK_OF_THE",
      {
        familiarName: createElement("span", {
          text: name,
          classList: ["text-success"],
        }),
      },
      {}
    );
    if (typeof nameNodes[0] === "string") {
      nodesToAppend = [
        createElement("small", { text: nameNodes[0] }),
        createElement("br"),
        nameNodes[1],
      ];
    } else if (typeof nameNodes[1] === "string") {
      nodesToAppend = [
        nameNodes[0],
        createElement("small", { text: nameNodes[1] }),
      ];
    } else {
      throw new Error("Invalid Node templating result.");
    }
    this.name.textContent = "";
    this.name.append(...nodesToAppend);
  }
  setSkillImages(skills) {
    this.skillImageContainer.textContent = "";
    this.skillImageContainer.append(
      ...skills.map((skill) => this.getSkillIcon(skill))
    );
  }
  updateDiscoveryCount(mark) {
    const markLevel = game.summoning.getMarkLevel(mark);
    const totalCount = game.summoning.getMarkCount(mark);
    if (markLevel >= Summoning.markLevels.length) {
      this.progressBar.style.width = "100%";
      this.progressBar.classList.remove("bg-summoning");
      this.progressBar.classList.add("bg-success");
    } else {
      let countToNext = totalCount;
      let nextCountRequired = Summoning.markLevels[0];
      if (markLevel > 0) {
        nextCountRequired =
          Summoning.markLevels[markLevel] - Summoning.markLevels[markLevel - 1];
        countToNext -= Summoning.markLevels[markLevel - 1];
      }
      this.progressBar.style.width = `${(
        (100 * countToNext) /
        nextCountRequired
      ).toFixed(2)}%`;
      this.progressBar.classList.add("bg-summoning");
      this.progressBar.classList.remove("bg-success");
    }
    this.discoveryTotal.textContent = templateLangString(
      "MENU_TEXT",
      "DISCOVERY_COUNT",
      {
        count: `${totalCount}`,
        maxCount: `${Summoning.markLevels[Summoning.markLevels.length - 1]}`,
      }
    );
  }
}
window.customElements.define(
  "summoning-mark-discovery",
  SummoningMarkDiscovery
);
class SummoningSynergySearch extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("summoning-synergy-search-template"));
    this.flexContainer = getElementFromFragment(
      this._content,
      "flex-container",
      "div"
    );
    this.markElements0 = {
      container: getElementFromFragment(
        this._content,
        "mark-container-0",
        "div"
      ),
      image: getElementFromFragment(this._content, "mark-image-0", "img"),
      quantity: getElementFromFragment(
        this._content,
        "mark-quantity-0",
        "small"
      ),
      skillImage: getElementFromFragment(
        this._content,
        "mark-skill-image-0",
        "img"
      ),
    };
    this.markElements1 = {
      container: getElementFromFragment(
        this._content,
        "mark-container-1",
        "div"
      ),
      image: getElementFromFragment(this._content, "mark-image-1", "img"),
      quantity: getElementFromFragment(
        this._content,
        "mark-quantity-1",
        "small"
      ),
      skillImage: getElementFromFragment(
        this._content,
        "mark-skill-image-1",
        "img"
      ),
    };
    this.synergyIcon = getElementFromFragment(
      this._content,
      "synergy-icon",
      "img"
    );
    this.synergyDescription = getElementFromFragment(
      this._content,
      "synergy-description",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setSynergy(synergy) {
    this.synergy = synergy;
    this.markElements0.skillImage.src = synergy.summons[0].skills[0].media;
    this.markElements1.skillImage.src = synergy.summons[1].skills[0].media;
    this.updateLockStatus();
    this.updateQuantities();
  }
  updateLockStatus() {
    if (
      this.synergy !== undefined &&
      game.summoning.isSynergyUnlocked(this.synergy)
    ) {
      this.setUnlocked();
    } else {
      this.setLocked();
    }
  }
  setLocked() {
    this.markElements0.image.src = cdnMedia("assets/media/main/question.svg");
    this.markElements1.image.src = cdnMedia("assets/media/main/question.svg");
    this.synergyIcon.src = cdnMedia(
      "assets/media/skills/summoning/synergy_locked.svg"
    );
    this.setLockedDescriptions();
    this.flexContainer.onclick = null;
  }
  setLockedDescriptions() {
    if (this.synergy === undefined) return;
    const mark1 = this.synergy.summons[0];
    const mark2 = this.synergy.summons[1];
    const mark1Element = createElement("h5", {
      classList: ["font-w400", "font-size-sm", "text-warning", "mb-1"],
    });
    const mark2Element = createElement("h5", {
      classList: ["font-w400", "font-size-sm", "text-warning", "mb-0"],
    });
    mark1Element.innerText = `Requires ${game.summoning.getMarkName(
      mark1
    )} Level ${mark2.tier + 1}`;
    mark2Element.innerText = `Requires ${game.summoning.getMarkName(
      mark2
    )} Level ${mark1.tier + 1}`;
    if (mark1.tier < game.summoning.getMarkLevel(mark2)) {
      mark2Element.classList.add("text-success");
      mark2Element.classList.remove("text-warning");
    }
    if (mark2.tier < game.summoning.getMarkLevel(mark1)) {
      mark1Element.classList.add("text-success");
      mark1Element.classList.remove("text-warning");
    }
    this.synergyDescription.innerHTML = "";
    this.synergyDescription.append(mark1Element, mark2Element);
  }
  setUnlocked() {
    if (this.synergy === undefined) return;
    this.markElements0.image.src = this.synergy.summons[0].product.media;
    this.markElements1.image.src = this.synergy.summons[1].product.media;
    this.synergyIcon.src = cdnMedia(
      "assets/media/skills/summoning/synergy.svg"
    );
    this.synergyDescription.innerHTML = this.synergy.description;
    const synergy = this.synergy;
    this.flexContainer.onclick = () =>
      game.combat.player.quickEquipSynergy(synergy);
  }
  updateQuantities() {
    if (this.synergy === undefined) return;
    this.updateMarkQuantity(this.markElements0, this.synergy.summons[0]);
    this.updateMarkQuantity(this.markElements1, this.synergy.summons[1]);
  }
  updateMarkQuantity(markElements, mark) {
    const item = mark.product;
    const playerQty = game.combat.player.equipment.getQuantityOfItem(item);
    const bankQty = game.bank.getQty(item);
    if (playerQty > 0) {
      markElements.container.classList.remove("border-item-invalid");
      markElements.quantity.textContent = numberWithCommas(playerQty);
      markElements.quantity.className = "badge-pill bg-success";
    } else if (bankQty > 0) {
      markElements.container.classList.remove("border-item-invalid");
      markElements.quantity.textContent = numberWithCommas(bankQty);
      markElements.quantity.className = "badge-pill bg-secondary";
    } else {
      markElements.container.classList.add("border-item-invalid");
      markElements.quantity.textContent = "0";
      markElements.quantity.className = "badge-pill bg-danger";
    }
  }
}
window.customElements.define(
  "summoning-synergy-search",
  SummoningSynergySearch
);
class SynergySearchMenu extends HTMLElement {
  constructor() {
    super();
    this.filterOptions = new Map();
    this.visibleSynergies = new Set();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("synergy-search-menu-template"));
    this.showAllButton = getElementFromFragment(
      this._content,
      "show-all-button",
      "button"
    );
    this.showAllButton.onclick = () => this.showAllSynergies();
    this.showUnlockedButton = getElementFromFragment(
      this._content,
      "show-unlocked-button",
      "button"
    );
    this.showUnlockedButton.onclick = () => this.showUnlockedSynergies();
    this.filterDropdownButton = getElementFromFragment(
      this._content,
      "dropdown-default-primary",
      "button"
    );
    this.filterDropdownButton.onclick = () => this.updateFilterOptions();
    this.filterOptionsContainer = getElementFromFragment(
      this._content,
      "filter-dropdown-options",
      "div"
    );
    this.searchBar = getElementFromFragment(
      this._content,
      "search-bar",
      "input"
    );
    this.searchBar.placeholder = getLangString("MISC_STRING", "17");
    this.searchBar.onkeyup = () => this.onSearchChange();
    this.searchElements = new Map(
      game.summoning.synergies.map((synergy) => {
        const searchElement = new SummoningSynergySearch();
        searchElement.className = "col-12 col-lg-6";
        this._content.append(searchElement);
        this.visibleSynergies.add(searchElement);
        return [synergy, searchElement];
      })
    );
    const optionTemplate = getTemplateElement(
      "synergy-search-menu-option-template"
    ).content;
    game.summoning.actions.forEach((mark) => {
      const newOption = new DocumentFragment();
      newOption.append(optionTemplate.cloneNode(true));
      this.filterOptions.set(mark, {
        link: getElementFromFragment(newOption, "link", "a"),
        image: getElementFromFragment(newOption, "option-image", "img"),
        name: getElementFromFragment(newOption, "option-name", "span"),
      });
      this.filterOptionsContainer.append(newOption);
    });
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  initialize() {
    this.searchElements.forEach((searchElement, synergy) => {
      searchElement.setSynergy(synergy);
    });
  }
  showAllSynergies() {
    this.searchElements.forEach((element) => {
      showElement(element);
      this.visibleSynergies.add(element);
    });
  }
  showSynergiesWithMark(mark) {
    const query = templateLangString("MENU_TEXT", "THE_FAMILIAR", {
      name: mark.product.name,
    });
    this.searchBar.value = query;
    this.querySynergies(query);
  }
  showUnlockedSynergies() {
    this.searchElements.forEach((element, synergy) => {
      if (game.summoning.isSynergyUnlocked(synergy)) {
        showElement(element);
        this.visibleSynergies.add(element);
      } else {
        hideElement(element);
        this.visibleSynergies.delete(element);
      }
    });
  }
  updateFilterOptions() {
    game.summoning.actions.forEach((mark) => {
      const option = this.filterOptions.get(mark);
      if (option === undefined) return;
      const item = mark.product;
      if (game.summoning.getMarkLevel(mark) > 0) {
        option.name.textContent = item.name;
        option.image.src = item.media;
        option.link.onclick = () => this.showSynergiesWithMark(mark);
      } else {
        option.name.textContent = getLangString("MENU_TEXT", "QUESTION_MARKS");
        option.image.src = cdnMedia("assets/media/main/question.svg");
        option.link.onclick = null;
      }
    });
  }
  updateVisibleElementUnlocks() {
    this.visibleSynergies.forEach((search) => search.updateLockStatus());
  }
  updateVisibleElementQuantities() {
    this.visibleSynergies.forEach((search) => search.updateQuantities());
  }
  querySynergies(query) {
    if (query === "") {
      this.showAllSynergies();
      this.searchBar.classList.remove("text-danger");
      return;
    } else if (query === "Unlocked") {
      this.showUnlockedSynergies();
      this.searchBar.classList.remove("text-danger");
      return;
    }
    const searchOpts = {
      shouldSort: true,
      tokenize: true,
      matchAllTokens: true,
      findAllMatches: true,
      threshold: 0,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name1", "name2", "name1long", "name2long", "description"],
    };
    const fuzzySearch = new Fuse(Summoning.searchArray, searchOpts);
    const searchResults = fuzzySearch.search(query);
    const newVisibleSet = new Set();
    searchResults.forEach((result) => {
      const synergyElement = this.searchElements.get(result.synergy);
      if (synergyElement === undefined)
        throw new Error("Search result has no corresponding synergy display");
      newVisibleSet.add(synergyElement);
      synergyElement.classList.remove("d-none");
    });
    this.visibleSynergies.forEach((synergyElement) => {
      if (!newVisibleSet.has(synergyElement))
        synergyElement.classList.add("d-none");
    });
    this.visibleSynergies = newVisibleSet;
    if (searchResults.length === 0) {
      this.searchBar.classList.add("text-danger");
    } else {
      this.searchBar.classList.remove("text-danger");
    }
  }
  onSearchChange() {
    this.querySynergies(this.searchBar.value);
  }
}
window.customElements.define("synergy-search-menu", SynergySearchMenu);
