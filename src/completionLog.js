"use strict";
let skillsLogLoaded = false;
let masteryLogLoaded = false;
let itemLogLoaded = false;
let monsterLogLoaded = false;
let petLogLoaded = false;
let itemLogPage = 0;
let compCategory = 0;
function filterItemLog(filter) {
  $("#searchTextbox-items").val("");
  let shouldShow;
  switch (filter) {
    case 0:
      shouldShow = (item, found) => found || !item.ignoreCompletion;
      break;
    case 1:
      shouldShow = (_, found) => found;
      break;
    case 2:
      shouldShow = (item, found) => !found && !item.ignoreCompletion;
      break;
    case 3:
      shouldShow = (item, _) =>
        (item.namespace == "melvorD" || item.namespace == "melvorF") &&
        !item.ignoreCompletion;
      break;
    case 4:
      shouldShow = (item, _) =>
        item.namespace == "melvorTotH" && !item.ignoreCompletion;
      break;
  }
  game.items.forEach((item) => {
    const element = completionLogMenu.items.get(item);
    if (element === undefined) return;
    const found = game.stats.itemFindCount(item) > 0;
    if (shouldShow(item, found)) showElement(element);
    else hideElement(element);
  });
}
function showCompletionCategory(category) {
  $(`#completion-log-${compCategory}`).addClass("d-none");
  $(`#completion-log-${category}`).removeClass("d-none");
  compCategory = category;
  if (category === 2 && !itemLogLoaded) buildItemLog(game);
}
function changeItemLogPage(page) {
  $(`#item-log-page-${itemLogPage}`).addClass("d-none");
  $(`#item-log-page-${page}`).removeClass("d-none");
  itemLogPage = page;
}
const completionLogMenu = {
  skills: new Map(),
  masterySkills: new Map(),
  items: new Map(),
  monsters: new Map(),
  pets: new Map(),
  skillProgress: new Map(),
  masteryProgress: new Map(),
  itemProgress: new Map(),
  monsterProgress: new Map(),
  petProgress: new Map(),
};
function buildCompletionProgressElements(container, langID, name, classes) {
  const parent = createElement("h5", {
    className: `font-size-sm mb-2 ${classes}`,
  });
  const current = createElement("span");
  const total = createElement("span");
  const percent = createElement("span", {
    className: "text-warning font-w400",
  });
  parent.append(
    ...templateLangStringWithNodes(
      "COMPLETION",
      langID,
      { num1: current, num2: total, percent },
      { name },
      false
    )
  );
  container.append(parent);
  return { parent, current, total, percent };
}
function buildCompletionProgress(container, progress, totalCategory) {
  progress.set(
    "melvorTrue",
    buildCompletionProgressElements(
      container,
      totalCategory,
      "True",
      "font-w600"
    )
  );
  progress.set(
    "melvorBaseGame",
    buildCompletionProgressElements(
      container,
      "DESC_BASE",
      "Base Game",
      "font-w400"
    )
  );
  game.registeredNamespaces.forEach((namespace) => {
    switch (namespace.name) {
      case "melvorD":
      case "melvorF":
      case "melvorTrue":
      case "melvorBaseGame":
        break;
      case "melvorTotH":
        progress.set(
          namespace.name,
          buildCompletionProgressElements(
            container,
            "DESC_TOTH",
            "Throne of the Herald",
            "font-w400"
          )
        );
        break;
      default:
        progress.set(
          namespace.name,
          buildCompletionProgressElements(
            container,
            "DESC_MODDED",
            namespace.displayName,
            "font-w400"
          )
        );
        break;
    }
  });
}
function buildSkillsLog(game) {
  if (!skillsLogLoaded) {
    const container = document.getElementById("skillslog-container");
    container.textContent = "";
    const combatContainer = createElement("div", {
      className: "row",
      parent: container,
    });
    const progressContainer = createElement("div", {
      className: "col-12",
      parent: combatContainer,
    });
    const noncombatContainer = createElement("div", {
      className: "row mt-3",
      parent: container,
    });
    buildCompletionProgress(
      progressContainer,
      completionLogMenu.skillProgress,
      "LOG_SKILLS_DESC"
    );
    game.skills.forEach((skill) => {
      const skillCompletion = new SkillCompletionElement();
      skillCompletion.className = "col-12 col-md-6 col-xl-4 mb-3";
      skillCompletion.setSkill(skill);
      if (skill.isCombat) {
        combatContainer.append(skillCompletion);
      } else {
        noncombatContainer.append(skillCompletion);
      }
      completionLogMenu.skills.set(skill, skillCompletion);
    });
    skillsLogLoaded = true;
  }
}
function buildMasteryLog(game) {
  if (!masteryLogLoaded) {
    const container = document.getElementById("masterylog-container");
    container.textContent = "";
    const skillsContainer = createElement("div", {
      className: "row",
      parent: container,
    });
    const progressContainer = createElement("div", {
      className: "col-12",
      parent: skillsContainer,
    });
    buildCompletionProgress(
      progressContainer,
      completionLogMenu.masteryProgress,
      "LOG_MASTERY_DESC"
    );
    game.masterySkills.forEach((skill) => {
      if (!skill.hasMastery) return;
      const masteryCompletion = new MasteryCompletionElement();
      masteryCompletion.className = "col-12 col-md-6 col-xl-4 mb-3";
      masteryCompletion.setSkill(skill);
      completionLogMenu.masterySkills.set(skill, masteryCompletion);
      skillsContainer.append(masteryCompletion);
    });
    masteryLogLoaded = true;
  }
}
function updateItemLogSearch(query) {
  if (query === "") {
    filterItemLog(0);
    return;
  }
  const options = {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    findAllMatches: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name", "category", "type", "description"],
  };
  const fuse = new Fuse(itemLogSearch, options);
  const result = fuse.search(query);
  const itemsFound = new Set();
  result.forEach((result) => itemsFound.add(result.item));
  completionLogMenu.items.forEach((itemCompletion, item) => {
    const discovered = game.stats.itemFindCount(item) > 0;
    if (itemsFound.has(item) && (!item.ignoreCompletion || discovered))
      showElement(itemCompletion);
    else hideElement(itemCompletion);
  });
  if (result.length === 0) {
    $("#searchTextbox-items").addClass("text-danger");
    if (query === "") {
      completionLogMenu.items.forEach((itemCompletion, item) => {
        const discovered = game.stats.itemFindCount(item) > 0;
        if (!item.ignoreCompletion || discovered) showElement(itemCompletion);
      });
    }
  } else $("#searchTextbox-items").removeClass("text-danger");
}
function clearItemLogSearch() {
  $("#searchTextbox-items").val("");
  updateItemLogSearch($("#searchTextbox-items").val());
}
function buildItemLog(game) {
  if (!itemLogLoaded) {
    const container = document.getElementById("itemlog-container");
    $(container).html(
      `<div class="col-12 text-center"><span class="spinner-border text-info skill-icon-md"></span></div>`
    );
    window.setTimeout(() => {
      container.textContent = "";
      const baseGameContainer = createElement("div", {
        className: "row",
        parent: container,
      });
      const progressContainer = createElement("div", {
        className: "col-12 col-lg-6",
        parent: baseGameContainer,
      });
      buildCompletionProgress(
        progressContainer,
        completionLogMenu.itemProgress,
        "LOG_ITEMS_DESC"
      );
      $(baseGameContainer).append(`
<div class="col-12 col-md-6">
  <div class="form-group col-12 mb-0">
    <div class="input-group">
      <input type="text" class="form-control text-danger" id="searchTextbox-items" name="searchTextbox-items" placeholder="Search Item Log...">
      <div class="input-group-append">
        <button type="button" class="btn btn-danger" onclick="clearItemLogSearch();">X</button>
      </div>
    </div>
  </div>
</div>
<div class="col-12">
  <button role="button" class="btn btn-sm btn-info m-1" onClick="filterItemLog(0);">${getLangString(
    "COMPLETION",
    "LOG_ITEMS_FILTER_0"
  )}</button>
  <button role="button" class="btn btn-sm btn-info m-1" onClick="filterItemLog(1);">${getLangString(
    "COMPLETION",
    "LOG_ITEMS_FILTER_1"
  )}</button>
  <button role="button" class="btn btn-sm btn-info m-1" onClick="filterItemLog(2);">${getLangString(
    "COMPLETION",
    "LOG_ITEMS_FILTER_2"
  )}</button>
  ${
    cloudManager.hasTotHEntitlement
      ? `<button role="button" class="btn btn-sm btn-info m-1" onClick="filterItemLog(3);">${getLangString(
          "COMPLETION",
          "LOG_ITEMS_FILTER_3"
        )}</button>
  <button role="button" class="btn btn-sm btn-info m-1" onClick="filterItemLog(4);">${getLangString(
    "COMPLETION",
    "LOG_ITEMS_FILTER_4"
  )}</button>`
      : ""
  }
</div>`);
      const namespaceContainers = new Map();
      game.registeredNamespaces.forEach((namespace) => {
        switch (namespace.name) {
          case "melvorD":
          case "melvorF":
            namespaceContainers.set(namespace.name, baseGameContainer);
            break;
          default: {
            if (!game.items.hasObjectInNamespace(namespace.name)) break;
            const newContainer = createElement("div", {
              className: "row",
              parent: container,
            });
            newContainer.append(
              createElement("div", {
                className: "col-12",
                children: [
                  createElement("h5", {
                    className: "mb-1 pt-3",
                    text: namespace.displayName,
                  }),
                ],
              })
            );
            namespaceContainers.set(namespace.name, newContainer);
          }
        }
      });
      game.items.forEach((item) => {
        var _a;
        const itemCompletion = new ItemCompletionElement();
        itemCompletion.className =
          "bank-item no-bg btn-light pointer-enabled m-1 resize-48";
        (_a = namespaceContainers.get(item.namespace)) === null || _a === void 0
          ? void 0
          : _a.append(itemCompletion);
        itemCompletion.updateItem(item, game);
        if (item.ignoreCompletion) hideElement(itemCompletion);
        completionLogMenu.items.set(item, itemCompletion);
      });
      game.completion.updateItem(game.items.firstObject);
      $("#searchTextbox-items").click(function (e) {
        updateItemLogSearchArray(game);
      });
      $("#searchTextbox-items").keyup(function () {
        const search = $("#searchTextbox-items").val();
        updateItemLogSearch(search);
      });
    }, 1000);
    itemLogLoaded = true;
  }
}
function buildMonsterLog(game) {
  if (!monsterLogLoaded) {
    const container = document.getElementById("monsterlog-container");
    container.textContent = "";
    const createColContainer = () => {
      return createElement("div", { className: "col-12", parent: container });
    };
    const createExpacContainer = (name) => {
      const col = createColContainer();
      col.append(createElement("h5", { className: "mb-1 pt-3", text: name }));
      col.append(
        createElement("h2", {
          className: "font-w600 mb-2 text-primary text-center",
          text: getLangString("COMPLETION", "LOG_MONSTERS_0"),
        })
      );
      const normalMonsters = createElement("div", { className: "row" });
      col.append(normalMonsters);
      col.append(
        createElement("h2", {
          className: "font-w600 mb-2 text-primary text-center",
          text: getLangString("COMPLETION", "LOG_MONSTERS_1"),
        })
      );
      const bossMonsters = createElement("div", { className: "row" });
      col.append(bossMonsters);
      return { normalMonsters, bossMonsters };
    };
    const progressContainer = createColContainer();
    buildCompletionProgress(
      progressContainer,
      completionLogMenu.monsterProgress,
      "LOG_MONSTERS_DESC"
    );
    const baseGameContainer = createExpacContainer("Base Game");
    const namespaceContainers = new Map();
    game.registeredNamespaces.forEach((namespace) => {
      switch (namespace.name) {
        case "melvorD":
        case "melvorF":
          namespaceContainers.set(namespace.name, baseGameContainer);
          break;
        default: {
          if (!game.monsters.hasObjectInNamespace(namespace.name)) break;
          const newContainer = createExpacContainer(namespace.displayName);
          namespaceContainers.set(namespace.name, newContainer);
        }
      }
    });
    game.monsters.forEach((monster) => {
      var _a, _b;
      const monsterCompletion = new MonsterCompletionElement();
      monsterCompletion.className = `monster-item${
        monster.isBoss ? "-boss" : ""
      } no-bg btn-light pointer-enabled m-1 justify-vertical-center`;
      if (monster.isBoss) {
        (_a = namespaceContainers.get(monster.namespace)) === null ||
        _a === void 0
          ? void 0
          : _a.bossMonsters.append(monsterCompletion);
      } else {
        (_b = namespaceContainers.get(monster.namespace)) === null ||
        _b === void 0
          ? void 0
          : _b.normalMonsters.append(monsterCompletion);
      }
      monsterCompletion.updateMonster(monster, game);
      completionLogMenu.monsters.set(monster, monsterCompletion);
      if (monster.ignoreCompletion) hideElement(monsterCompletion);
    });
    monsterLogLoaded = true;
  }
}
function buildPetLog(game) {
  if (!petLogLoaded) {
    const container = document.getElementById("petlog-container");
    container.textContent = "";
    const baseGameContainer = createElement("div", {
      className: "row",
      parent: container,
    });
    const progressContainer = createElement("div", {
      className: "col-12",
      parent: baseGameContainer,
    });
    buildCompletionProgress(
      progressContainer,
      completionLogMenu.petProgress,
      "LOG_PETS_DESC"
    );
    const namespaceContainers = new Map();
    game.registeredNamespaces.forEach((namespace) => {
      switch (namespace.name) {
        case "melvorD":
        case "melvorF":
          namespaceContainers.set(namespace.name, baseGameContainer);
          break;
        default: {
          if (!game.pets.hasObjectInNamespace(namespace.name)) break;
          const newContainer = createElement("div", {
            className: "row",
            parent: container,
          });
          newContainer.append(
            createElement("div", {
              className: "col-12",
              children: [
                createElement("h5", {
                  className: "mb-1 pt-3",
                  text: namespace.displayName,
                }),
              ],
            })
          );
          namespaceContainers.set(namespace.name, newContainer);
        }
      }
    });
    game.pets.forEach((pet) => {
      var _a;
      const petCompletion = new PetCompletionElement();
      petCompletion.className =
        "monster-item no-bg btn-light pointer-enabled m-1 justify-vertical-center pet-log-img-0";
      (_a = namespaceContainers.get(pet.namespace)) === null || _a === void 0
        ? void 0
        : _a.append(petCompletion);
      petCompletion.updatePet(pet, game);
      completionLogMenu.pets.set(pet, petCompletion);
    });
    petLogLoaded = true;
  }
}
const monsterStatDisplayOrder = [
  MonsterStats.Seen,
  MonsterStats.KilledByPlayer,
  MonsterStats.KilledPlayer,
  MonsterStats.DamageTakenFromPlayer,
  MonsterStats.DamageDealtToPlayer,
  MonsterStats.HitsFromPlayer,
  MonsterStats.HitsToPlayer,
  MonsterStats.PlayerMissed,
  MonsterStats.EnemyMissed,
  MonsterStats.RanAway,
];
function getItemStatDescriptions(item, preCount, preStat, postStat) {
  const descriptions = [];
  const stats = game.stats.Items.getTracker(item);
  for (let statID = 0; statID < 19; statID++) {
    const count = stats.get(statID);
    if (count > 0)
      descriptions.push(
        getLangString("STATISTICS", `ITEMS_${statID}`) +
          preCount +
          numberWithCommas(count)
      );
  }
  return preStat + descriptions.join(postStat + preStat) + postStat;
}
function parseProgress(progress, withPercent = true) {
  if (progress < 100 && progress.toFixed(2) === "100.00") progress = 99.99;
  else progress = parseFloat(progress.toFixed(2));
  if (!withPercent) return numberWithCommas(progress);
  else return formatPercent(progress, 2);
}
function promptGameReview() {
  if (location.origin === "https://steam.melvoridle.com") {
  } else if (
    location.origin === "https://android.melvoridle.com" &&
    !nativeManager.isNativeApp
  ) {
    if (
      getItem("androidReview") === undefined ||
      getItem("androidReview") === null
    ) {
      window.setTimeout(function () {
        android.rateApp();
      }, 5000);
      setItem("androidReview", "1");
    }
  } else if (
    location.origin === "https://ios.melvoridle.com" &&
    !nativeManager.isNativeApp
  ) {
    if (getItem("iosReview") === undefined || getItem("iosReview") === null) {
      window.setTimeout(function () {
        window.bridge.post("rate_app", {});
      }, 5000);
      setItem("iosReview", "1");
    }
  }
}
let itemLogSearch = [];
function updateItemLogSearchArray(game) {
  itemLogSearch = game.items.allObjects.map((item) => {
    return {
      item,
      name: item.name,
      category: item.category,
      description: item.description,
      type: item.type,
    };
  });
}
class SkillCompletionElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("skill-completion-template"));
    this.viewMilestonesLink = getElementFromFragment(
      this._content,
      "view-milestones-link",
      "a"
    );
    this.blockContainer = getElementFromFragment(
      this._content,
      "block-container",
      "div"
    );
    this.skillImage = getElementFromFragment(
      this._content,
      "skill-image",
      "img"
    );
    this.skillName = getElementFromFragment(this._content, "skill-name", "h4");
    this.skillProgressFraction = getElementFromFragment(
      this._content,
      "skill-progress-fraction",
      "span"
    );
    this.skillProgressBar = getElementFromFragment(
      this._content,
      "skill-progress-bar",
      "div"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setSkill(skill) {
    this.skillImage.src = skill.media;
    this.skillName.textContent = skill.name;
    this.viewMilestonesLink.onclick = () => skill.openMilestoneModal();
    this.blockContainer.classList.add(
      skill.hasMastery
        ? `bg-${setToLowercase(skill.localID)}-50`
        : "bg-combat-50"
    );
    this.updateProgress(skill);
  }
  updateProgress(skill) {
    let skillLevel = skill.level;
    let skillLevelCap = skill.levelCap;
    if (game.completion.visibleCompletion === "melvorBaseGame") {
      skillLevelCap = 99;
      if (skill.level > 99) skillLevel = 99;
    }
    this.skillProgressFraction.textContent = `${skillLevel} / ${skillLevelCap}`;
    this.skillProgressBar.style.width = `${
      (100 * skillLevel) / skillLevelCap
    }%`;
    if (skillLevel >= skillLevelCap) {
      this.skillProgressBar.classList.replace("bg-info", "bg-success");
    } else {
      this.skillProgressBar.classList.replace("bg-success", "bg-info");
    }
  }
}
window.customElements.define("skill-completion", SkillCompletionElement);
class MasteryCompletionElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("mastery-completion-template"));
    this.blockContainer = getElementFromFragment(
      this._content,
      "block-container",
      "div"
    );
    this.skillImage = getElementFromFragment(
      this._content,
      "skill-image",
      "img"
    );
    this.skillName = getElementFromFragment(this._content, "skill-name", "h4");
    this.masteryProgressFraction = getElementFromFragment(
      this._content,
      "mastery-progress-fraction",
      "span"
    );
    this.masteryProgressPercent = getElementFromFragment(
      this._content,
      "mastery-progress-percent",
      "span"
    );
    this.masteryProgressBar = getElementFromFragment(
      this._content,
      "mastery-progress-bar",
      "div"
    );
    this.progressButton = getElementFromFragment(
      this._content,
      "progress-button",
      "button"
    );
    this.unlocksButton = getElementFromFragment(
      this._content,
      "unlocks-button",
      "button"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
  }
  setSkill(skill) {
    this.blockContainer.classList.add(`bg-${setToLowercase(skill.localID)}-50`);
    this.skillImage.src = skill.media;
    this.skillName.textContent = skill.name;
    this.progressButton.onclick = () => skill.openSpendMasteryXPModal();
    this.unlocksButton.onclick = () => skill.openMasteryLevelUnlockModal();
    this.updateProgress(skill);
  }
  updateProgress(skill) {
    const maxTotal = skill.getMaxTotalMasteryLevels(
      game.completion.visibleCompletion
    );
    const currentTotal = skill.getTotalCurrentMasteryLevels(
      game.completion.visibleCompletion
    );
    this.masteryProgressFraction.textContent = `${currentTotal} / ${maxTotal}`;
    const percent = maxTotal === 0 ? 0 : (100 * currentTotal) / maxTotal;
    this.masteryProgressPercent.textContent = `(${formatPercent(percent, 2)})`;
    this.masteryProgressBar.style.width = `${percent}%`;
    if (currentTotal >= maxTotal) {
      this.masteryProgressBar.classList.replace("bg-info", "bg-success");
    } else {
      this.masteryProgressBar.classList.replace("bg-success", "bg-info");
    }
  }
}
window.customElements.define("mastery-completion", MasteryCompletionElement);
class ItemCompletionElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("item-completion-template"));
    this.itemImage = getElementFromFragment(this._content, "item-image", "img");
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.tooltip = tippy(this.itemImage, {
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }
  updateItem(item, game) {
    var _a;
    const found = game.stats.itemFindCount(item) > 0;
    this.itemImage.src = found
      ? item.media
      : cdnMedia("assets/media/main/question.svg");
    (_a = this.tooltip) === null || _a === void 0
      ? void 0
      : _a.setProps({
          onShow: (instance) => {
            instance.setContent(this.getItemTooltipHTML(item, game));
          },
        });
    if (found && item.obtainFromItemLog) {
      this.itemImage.onclick = () => game.bank.addItem(item, 1, false, true);
    }
  }
  getItemTooltipHTML(item, game) {
    let itemTooltip = "";
    let ignoreCompletion = "";
    if (item.ignoreCompletion)
      ignoreCompletion = `<br><span class='text-danger'>${getLangString(
        "STATISTICS",
        "MISC_0"
      )}</span>`;
    const statDescription = getItemStatDescriptions(
      item,
      " <small class='text-warning'>",
      "<br>",
      "</small>"
    );
    if (game.stats.itemFindCount(item) > 0)
      itemTooltip =
        "<div class='text-center'>" +
        item.name +
        "<small class='text-info'> " +
        statDescription +
        ignoreCompletion +
        "</small></div>";
    else if (!item.ignoreCompletion)
      itemTooltip = `<div class='text-center text-danger'>${item.name}</div>`;
    return itemTooltip;
  }
}
window.customElements.define("item-completion", ItemCompletionElement);
class MonsterCompletionElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("monster-completion-template"));
    this.monsterImage = getElementFromFragment(
      this._content,
      "monster-image",
      "img"
    );
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.tooltip = tippy(this.monsterImage, {
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }
  updateMonster(monster, game) {
    var _a;
    const killed = game.stats.monsterKillCount(monster) > 0;
    this.monsterImage.src = killed
      ? monster.media
      : cdnMedia("assets/media/main/question.svg");
    (_a = this.tooltip) === null || _a === void 0
      ? void 0
      : _a.setProps({
          onShow: (instance) => {
            instance.setContent(this.getMonsterTooltipHTML(monster, game));
          },
        });
    if (killed) this.onclick = () => viewMonsterStats(monster);
    else this.onclick = null;
    this.monsterImage.classList.add(
      `combat-enemy-img-sm${monster.isBoss ? "-boss" : ""}`
    );
  }
  getMonsterTooltipHTML(monster, game) {
    let monsterTooltip = "";
    if (game.stats.monsterKillCount(monster) > 0 && !monster.ignoreCompletion) {
      const stats = game.stats.Monsters.getTracker(monster);
      let statDescription = "";
      monsterStatDisplayOrder.forEach((statID) => {
        statDescription += `<br>${getLangString(
          "STATISTICS",
          `MONSTERS_${statID}`
        )} <small class='text-warning'>${formatNumber(
          stats.get(statID)
        )}</small>`;
      });
      monsterTooltip =
        "<div class='text-center'>" +
        monster.name +
        "<small class='text-info'> " +
        statDescription +
        "</small></div>";
    } else if (!monster.ignoreCompletion) {
      monsterTooltip = `<div class='text-center text-danger'>${monster.name}</div>`;
    }
    return monsterTooltip;
  }
}
window.customElements.define("monster-completion", MonsterCompletionElement);
class PetCompletionElement extends HTMLElement {
  constructor() {
    super();
    this._content = new DocumentFragment();
    this._content.append(getTemplateNode("pet-completion-template"));
    this.petImage = getElementFromFragment(this._content, "pet-image", "img");
  }
  connectedCallback() {
    this.appendChild(this._content);
    this.tooltip = tippy(this.petImage, {
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  disconnectedCallback() {
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }
  updatePet(pet, game) {
    var _a;
    const unlocked = game.petManager.isPetUnlocked(pet);
    this.petImage.src = unlocked
      ? pet.media
      : cdnMedia("assets/media/main/question.svg");
    (_a = this.tooltip) === null || _a === void 0
      ? void 0
      : _a.setContent(this.getPetTooltipHTML(pet, unlocked));
    if (unlocked) {
      this.onclick = () => game.petManager.petPet(pet);
      if (pet.ignoreCompletion) showElement(this);
    } else {
      this.onclick = null;
      if (pet.ignoreCompletion) hideElement(this);
    }
  }
  getPetTooltipHTML(pet, unlocked) {
    let tooltip = "";
    if (unlocked) {
      tooltip =
        '<div class="text-center"><span class="text-warning">' +
        pet.name +
        '</span><br><span class="text-info">' +
        pet.description +
        "</span></div>";
      if (pet.ignoreCompletion)
        tooltip += `<br><span class='text-danger'>${getLangString(
          "STATISTICS",
          "PET_NO_COMPLETION"
        )}</span>`;
    } else if (!pet.ignoreCompletion) {
      tooltip = `<div class="text-center">${getLangString(
        "MENU_TEXT",
        "QUESTION_MARKS"
      )}<br><small class='text-danger'>${templateLangString(
        "STATISTICS",
        "PET_HINT",
        { petHint: pet.acquiredBy }
      )}</small></div>`;
    }
    return tooltip;
  }
}
window.customElements.define("pet-completion", PetCompletionElement);
class CompletionMap extends SparseNumericMap {
  getCompValue(namespace) {
    switch (namespace) {
      case "melvorBaseGame":
        return this.getSumOfKeys(["melvorD", "melvorF"]);
      case "melvorTrue":
        return this.getSum();
      default:
        return this.get(namespace);
    }
  }
}
class CompletionRenderQueue {
  constructor() {
    this.items = new Set();
    this.monsters = new Set();
    this.pets = new Set();
    this.skills = new Set();
    this.masterySkills = new Set();
    this.totalProgressTrue = false;
    this.totalProgressBaseGame = false;
    this.totalProgressTotH = false;
  }
}
class CompletionProgress {
  constructor() {
    this.currentCount = new CompletionMap();
    this.maximumCount = new CompletionMap();
  }
  get hasNonBaseGame() {
    let count = 0;
    if (this.maximumCount.has("melvorD")) count++;
    if (this.maximumCount.has("melvorF")) count++;
    return this.maximumCount.size > count;
  }
  getPercent(namespace) {
    const current = this.currentCount.getCompValue(namespace);
    const maximum = this.maximumCount.getCompValue(namespace);
    if (maximum === 0) return 100;
    return (100 * current) / maximum;
  }
}
class Completion {
  constructor(game) {
    this.game = game;
    this.renderQueue = new CompletionRenderQueue();
    this.skillProgress = new CompletionProgress();
    this.masteryProgress = new CompletionProgress();
    this.itemProgress = new CompletionProgress();
    this.monsterProgress = new CompletionProgress();
    this.petProgress = new CompletionProgress();
    this.totalProgressMap = new CompletionMap();
    this.visibleCompletion = "melvorTrue";
  }
  get totalProgressTrue() {
    return this.totalProgressMap.get("melvorTrue");
  }
  get totalProgressBaseGame() {
    return this.totalProgressMap.get("melvorBaseGame");
  }
  get totalProgressTotH() {
    return this.totalProgressMap.get("melvorTotH");
  }
  encode(writer) {
    writer.writeString(this.visibleCompletion);
    return writer;
  }
  decode(reader, version) {
    if (version >= 31) {
      const name = reader.getString();
      if (name === "melvorTrue" || name === "melvorBaseGame") {
        this.visibleCompletion = name;
      } else {
        const namespace = this.game.registeredNamespaces.getNamespace(name);
        if (namespace === undefined) this.visibleCompletion = "melvorBaseGame";
        else this.visibleCompletion = name;
      }
    } else {
      const oldComp = reader.getUint8();
      switch (oldComp) {
        case 0:
          this.visibleCompletion = "melvorTrue";
          break;
        case 1:
          this.visibleCompletion = "melvorBaseGame";
          break;
        case 2:
          {
            const namespace =
              this.game.registeredNamespaces.getNamespace("melvorTotH");
            if (namespace === undefined)
              this.visibleCompletion = "melvorBaseGame";
            else this.visibleCompletion = "melvorTotH";
          }
          break;
      }
    }
  }
  setVisibleCompletion(visibleCompletion) {
    this.updateVisbleCompletionButtons(
      this.visibleCompletion,
      visibleCompletion
    );
    this.visibleCompletion = visibleCompletion;
    this.game.skills.forEach((skill) => {
      this.renderQueue.skills.add(skill);
    });
    this.game.masterySkills.forEach((skill) =>
      this.renderQueue.masterySkills.add(skill)
    );
    this.updateAllCompletion();
  }
  updateVisbleCompletionButtons(oldCompletion, newCompletion) {
    document
      .querySelectorAll(`.btn-visible-completion-${oldCompletion}`)
      .forEach((btn) => {
        btn.classList.replace("btn-info", "btn-outline-info");
      });
    document
      .querySelectorAll(`.btn-visible-completion-${newCompletion}`)
      .forEach((btn) => {
        btn.classList.replace("btn-outline-info", "btn-info");
      });
  }
  getSkillProgressPercent() {
    return this.skillProgress.getPercent(this.visibleCompletion);
  }
  getMasteryProgressPercent() {
    return this.masteryProgress.getPercent(this.visibleCompletion);
  }
  getItemProgressPercent() {
    return this.itemProgress.getPercent(this.visibleCompletion);
  }
  getMonsterProgressPercent() {
    return this.monsterProgress.getPercent(this.visibleCompletion);
  }
  getPetProgressPercent() {
    return this.petProgress.getPercent(this.visibleCompletion);
  }
  updateProgressElements(elementMap, progress, namespace) {
    const elements = elementMap.get(namespace);
    if (elements === undefined) return;
    const total = progress.maximumCount.getCompValue(namespace);
    const current = progress.currentCount.getCompValue(namespace);
    const percent = progress.getPercent(namespace);
    if (
      total === 0 ||
      (namespace === "melvorBaseGame" && !progress.hasNonBaseGame)
    ) {
      hideElement(elements.parent);
    } else {
      showElement(elements.parent);
      elements.total.textContent = numberWithCommas(total);
      elements.current.textContent = numberWithCommas(current);
      elements.percent.textContent = parseProgress(percent);
      if (percent >= 100) {
        elements.percent.classList.replace("text-warning", "text-success");
        elements.percent.classList.replace("font-w400", "font-w600");
      } else {
        elements.percent.classList.replace("text-success", "text-warning");
        elements.percent.classList.replace("font-w600", "font-w400");
      }
    }
  }
  updateAllProgressElements(elements, progress) {
    this.game.registeredNamespaces.forEach((namespace) => {
      switch (namespace.name) {
        case "melvorD":
        case "melvorF":
          break;
        default:
          this.updateProgressElements(elements, progress, namespace.name);
      }
    });
  }
  render() {
    const sideBarItem = sidebar.category("General").item("Completion Log");
    const setSideBarProgress = (category, progress) => {
      sideBarItem.subitem(`${"melvorD:CompletionLog"}:${category}`, {
        aside: parseProgress(progress),
      });
    };
    if (this.renderQueue.skills.size > 0) {
      this.renderQueue.skills.forEach((skill) => {
        var _a;
        (_a = completionLogMenu.skills.get(skill)) === null || _a === void 0
          ? void 0
          : _a.updateProgress(skill);
      });
      setSideBarProgress(0, this.getSkillProgressPercent());
      $(".skills-log-comp-percent").text(
        parseProgress(this.getSkillProgressPercent())
      );
      if (this.getSkillProgressPercent() >= 100) {
        $(".skills-log-comp-percent").removeClass("text-warning");
        $(".skills-log-comp-percent").addClass("text-success");
        $(".skills-log-comp-percent").removeClass("font-w400");
        $(".skills-log-comp-percent").addClass("font-w600");
      } else {
        $(".skills-log-comp-percent").addClass("text-warning");
        $(".skills-log-comp-percent").removeClass("text-success");
        $(".skills-log-comp-percent").addClass("font-w400");
        $(".skills-log-comp-percent").removeClass("font-w600");
      }
      this.updateAllProgressElements(
        completionLogMenu.skillProgress,
        this.skillProgress
      );
      this.renderQueue.skills.clear();
    }
    if (this.renderQueue.masterySkills.size > 0) {
      this.renderQueue.masterySkills.forEach((skill) => {
        var _a;
        (_a = completionLogMenu.masterySkills.get(skill)) === null ||
        _a === void 0
          ? void 0
          : _a.updateProgress(skill);
      });
      setSideBarProgress(1, this.getMasteryProgressPercent());
      $(".mastery-log-comp-percent").text(
        parseProgress(this.getMasteryProgressPercent())
      );
      if (this.getMasteryProgressPercent() >= 100) {
        $(".mastery-log-comp-percent").removeClass("text-warning");
        $(".mastery-log-comp-percent").addClass("text-success");
        $(".mastery-log-comp-percent").removeClass("font-w400");
        $(".mastery-log-comp-percent").addClass("font-w600");
      } else {
        $(".mastery-log-comp-percent").addClass("text-warning");
        $(".mastery-log-comp-percent").removeClass("text-success");
        $(".mastery-log-comp-percent").addClass("font-w400");
        $(".mastery-log-comp-percent").removeClass("font-w600");
      }
      this.updateAllProgressElements(
        completionLogMenu.masteryProgress,
        this.masteryProgress
      );
      this.renderQueue.masterySkills.clear();
    }
    if (this.renderQueue.items.size > 0) {
      this.renderQueue.items.forEach((item) => {
        var _a;
        (_a = completionLogMenu.items.get(item)) === null || _a === void 0
          ? void 0
          : _a.updateItem(item, this.game);
      });
      setSideBarProgress(2, this.getItemProgressPercent());
      $(".item-log-comp-percent").text(
        parseProgress(this.getItemProgressPercent())
      );
      if (this.getItemProgressPercent() >= 100) {
        $(".item-log-comp-percent").removeClass("text-warning");
        $(".item-log-comp-percent").addClass("text-success");
        $(".item-log-comp-percent").removeClass("font-w400");
        $(".item-log-comp-percent").addClass("font-w600");
      } else {
        $(".item-log-comp-percent").addClass("text-warning");
        $(".item-log-comp-percent").removeClass("text-success");
        $(".item-log-comp-percent").addClass("font-w400");
        $(".item-log-comp-percent").removeClass("font-w600");
      }
      this.updateAllProgressElements(
        completionLogMenu.itemProgress,
        this.itemProgress
      );
      this.renderQueue.items.clear();
    }
    if (this.renderQueue.monsters.size > 0) {
      this.renderQueue.monsters.forEach((monster) => {
        var _a;
        (_a = completionLogMenu.monsters.get(monster)) === null || _a === void 0
          ? void 0
          : _a.updateMonster(monster, this.game);
      });
      setSideBarProgress(3, this.getMonsterProgressPercent());
      $(".monster-log-comp-percent").text(
        parseProgress(this.getMonsterProgressPercent())
      );
      if (this.getMonsterProgressPercent() >= 100) {
        $(".monster-log-comp-percent").removeClass("text-warning");
        $(".monster-log-comp-percent").addClass("text-success");
        $(".monster-log-comp-percent").removeClass("font-w400");
        $(".monster-log-comp-percent").addClass("font-w600");
      } else {
        $(".monster-log-comp-percent").addClass("text-warning");
        $(".monster-log-comp-percent").removeClass("text-success");
        $(".monster-log-comp-percent").addClass("font-w400");
        $(".monster-log-comp-percent").removeClass("font-w600");
      }
      this.updateAllProgressElements(
        completionLogMenu.monsterProgress,
        this.monsterProgress
      );
      this.renderQueue.monsters.clear();
    }
    if (this.renderQueue.pets.size > 0) {
      this.renderQueue.pets.forEach((pet) => {
        var _a;
        (_a = completionLogMenu.pets.get(pet)) === null || _a === void 0
          ? void 0
          : _a.updatePet(pet, this.game);
      });
      setSideBarProgress(4, this.getPetProgressPercent());
      $(".pet-log-comp-percent").text(
        parseProgress(this.getPetProgressPercent())
      );
      if (this.getPetProgressPercent() >= 100) {
        $(".pet-log-comp-percent").removeClass("text-warning");
        $(".pet-log-comp-percent").addClass("text-success");
        $(".pet-log-comp-percent").removeClass("font-w400");
        $(".pet-log-comp-percent").addClass("font-w600");
      } else {
        $(".pet-log-comp-percent").addClass("text-warning");
        $(".pet-log-comp-percent").removeClass("text-success");
        $(".pet-log-comp-percent").addClass("font-w400");
        $(".pet-log-comp-percent").removeClass("font-w600");
      }
      this.updateAllProgressElements(
        completionLogMenu.petProgress,
        this.petProgress
      );
      this.renderQueue.pets.clear();
    }
    if (this.renderQueue.totalProgressTrue) {
      if (
        this.visibleCompletion === "melvorTrue" &&
        sideBarItem.asideEl !== undefined
      )
        sideBarItem.asideEl.textContent = parseProgress(this.totalProgressTrue);
      $(".comp-log-percent").text(parseProgress(this.totalProgressTrue));
      $(".comp-log-percent-progress").css(
        "width",
        `${this.totalProgressTrue}%`
      );
      if (this.totalProgressTrue >= 100) {
        $(".comp-log-comp-percent").addClass("text-success");
        $(".comp-log-comp-percent").addClass("font-w600");
      }
      this.renderQueue.totalProgressTrue = false;
    }
    if (this.renderQueue.totalProgressBaseGame) {
      if (
        this.visibleCompletion === "melvorBaseGame" &&
        sideBarItem.asideEl !== undefined
      )
        sideBarItem.asideEl.textContent = parseProgress(
          this.totalProgressBaseGame
        );
      $(".comp-log-percent-full-game").text(
        parseProgress(this.totalProgressBaseGame)
      );
      $(".comp-log-percent-progress-full-game").css(
        "width",
        `${this.totalProgressBaseGame}%`
      );
      if (this.totalProgressBaseGame >= 100) {
        $(".comp-log-comp-percent-full-game").addClass("text-success");
        $(".comp-log-comp-percent-full-game").addClass("font-w600");
      }
      this.renderQueue.totalProgressBaseGame = false;
    }
    if (this.renderQueue.totalProgressTotH) {
      if (
        this.visibleCompletion === "melvorTotH" &&
        sideBarItem.asideEl !== undefined
      )
        sideBarItem.asideEl.textContent = parseProgress(this.totalProgressTotH);
      $(".comp-log-percent-toth").text(parseProgress(this.totalProgressTotH));
      $(".comp-log-percent-progress-toth").css(
        "width",
        `${this.totalProgressTotH}%`
      );
      if (this.totalProgressTotH >= 100) {
        $(".comp-log-comp-percent-toth").addClass("text-success");
        $(".comp-log-comp-percent-toth").addClass("font-w600");
      }
      this.renderQueue.totalProgressTotH = false;
    }
  }
  onLoad() {
    this.totalProgressMap.set("melvorTrue", -1);
    this.totalProgressMap.set("melvorBaseGame", -1);
    this.game.registeredNamespaces.forEach((namespace) => {
      this.totalProgressMap.set(namespace.name, -1);
    });
    this.updateVisbleCompletionButtons("melvorTrue", this.visibleCompletion);
    this.updateAllCompletion();
  }
  updateAllCompletion() {
    this.updateSkillProgress();
    this.updateMasteryProgress();
    this.updateItemProgress();
    this.updateMonsterProgress();
    this.updatePetProgress();
    this.updateTotalProgress();
    this.renderQueue.skills.add(this.game.skills.firstObject);
    this.renderQueue.masterySkills.add(this.game.masterySkills.firstObject);
    this.renderQueue.items.add(this.game.items.firstObject);
    this.renderQueue.monsters.add(this.game.monsters.firstObject);
    this.renderQueue.pets.add(this.game.pets.firstObject);
  }
  updateSkill(skill) {
    this.renderQueue.skills.add(skill);
    this.updateSkillProgress();
    this.updateTotalProgress();
  }
  updateSkillMastery(skill) {
    this.renderQueue.masterySkills.add(skill);
    this.updateMasteryProgress();
    this.updateTotalProgress();
  }
  updateItem(item) {
    this.renderQueue.items.add(item);
    this.updateItemProgress();
    this.updateTotalProgress();
  }
  updateMonster(monster) {
    this.renderQueue.monsters.add(monster);
    this.updateMonsterProgress();
    this.updateTotalProgress();
  }
  updatePet(pet) {
    this.renderQueue.pets.add(pet);
    this.updatePetProgress();
    this.updateTotalProgress();
  }
  updateSkillProgress() {
    this.skillProgress.currentCount.clear();
    this.skillProgress.maximumCount.clear();
    this.game.skills.forEach((skill) => {
      switch (skill.namespace) {
        case "melvorD":
        case "melvorF":
          this.skillProgress.maximumCount.add(skill.namespace, 99);
          this.skillProgress.currentCount.add(
            skill.namespace,
            Math.min(skill.level, 99)
          );
          if (cloudManager.hasTotHEntitlement) {
            this.skillProgress.maximumCount.add("melvorTotH", 21);
            this.skillProgress.currentCount.add(
              "melvorTotH",
              Math.max(skill.level - 99, 0)
            );
          }
          break;
        default:
          this.skillProgress.maximumCount.add(skill.namespace, skill.levelCap);
          break;
      }
    });
  }
  updateMasteryProgress() {
    this.masteryProgress.currentCount.clear();
    this.masteryProgress.maximumCount.clear();
    this.game.masterySkills.forEach((skill) => {
      if (skill.hasMastery) {
        skill.addTotalCurrentMasteryToCompletion(
          this.masteryProgress.currentCount
        );
        skill.totalMasteryActions.forEach((total, namespace) => {
          this.masteryProgress.maximumCount.add(
            namespace,
            total * skill.masteryLevelCap
          );
        });
      }
    });
  }
  updateItemProgress() {
    this.itemProgress.currentCount.clear();
    this.itemProgress.maximumCount.clear();
    this.game.items.forEach((item) => {
      if (!item.ignoreCompletion) {
        if (this.game.stats.itemFindCount(item) > 0)
          this.itemProgress.currentCount.inc(item.namespace);
        this.itemProgress.maximumCount.inc(item.namespace);
      }
    });
  }
  updateMonsterProgress() {
    this.monsterProgress.currentCount.clear();
    this.monsterProgress.maximumCount.clear();
    this.game.monsters.forEach((monster) => {
      if (!monster.ignoreCompletion) {
        if (this.game.stats.monsterKillCount(monster) > 0)
          this.monsterProgress.currentCount.inc(monster.namespace);
        this.monsterProgress.maximumCount.inc(monster.namespace);
      }
    });
  }
  updatePetProgress() {
    this.petProgress.currentCount.clear();
    this.petProgress.maximumCount.clear();
    this.game.pets.forEach((pet) => {
      if (!pet.ignoreCompletion) {
        if (this.game.petManager.isPetUnlocked(pet))
          this.petProgress.currentCount.inc(pet.namespace);
        this.petProgress.maximumCount.inc(pet.namespace);
      }
    });
  }
  computeTotalProgressPercent(namespace) {
    return (
      (this.skillProgress.getPercent(namespace) +
        this.masteryProgress.getPercent(namespace) +
        this.itemProgress.getPercent(namespace) +
        this.monsterProgress.getPercent(namespace) +
        this.petProgress.getPercent(namespace)) /
      5
    );
  }
  updateTotalProgress() {
    const previousProgress = this.totalProgressMap.get("melvorTrue");
    const previousProgressFullGame =
      this.totalProgressMap.get("melvorBaseGame");
    const previousProgressTotH = this.totalProgressMap.get("melvorTotH");
    this.totalProgressMap.set(
      "melvorTrue",
      this.computeTotalProgressPercent("melvorTrue")
    );
    this.totalProgressMap.set(
      "melvorBaseGame",
      this.computeTotalProgressPercent("melvorBaseGame")
    );
    this.game.registeredNamespaces.forEach((dataNamespace) => {
      const namespace = dataNamespace.name;
      const totalProgress = this.computeTotalProgressPercent(namespace);
      this.totalProgressMap.set(namespace, totalProgress);
    });
    if (
      previousProgressFullGame >= 0 &&
      previousProgressFullGame < 100 &&
      this.totalProgressBaseGame >= 100
    ) {
      notifyCompletionYay();
      sendDiscordEvent(3);
    }
    if (
      cloudManager.hasTotHEntitlement &&
      previousProgressTotH >= 0 &&
      previousProgressTotH < 100 &&
      this.totalProgressTotH >= 100
    ) {
      notifyCompletionTotH();
    }
    if (
      cloudManager.hasTotHEntitlement &&
      previousProgress >= 0 &&
      previousProgress < 100 &&
      this.totalProgressTrue >= 100
    ) {
      notifyCompletionEverything();
    }
    this.renderQueue.totalProgressTrue = true;
    this.renderQueue.totalProgressBaseGame = true;
    this.renderQueue.totalProgressTotH = true;
    this.game.queueRequirementRenders();
  }
}
