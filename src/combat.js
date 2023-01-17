"use strict";
let game;
let showCombatArea;
let skillNav;
let skillProgressDisplay;
let spendMasteryMenu;
let enemyHTMLElements;
let playerHTMLElements;
let thievingMenu;
let firemakingMenu;
let woodcuttingMenu;
let eventManager;
let herbloreArtisanMenu;
let herbloreCategoryMenu;
const herbloreSelectionTabs = new Map();
let potionSelectMenu;
let smithingArtisanMenu;
const smithingSelectionTabs = new Map();
let smithingCategoryMenu;
let altMagicMenu;
let altMagicItemMenu;
let altMagicSelection;
let runecraftingCategoryMenu;
let runecraftingArtisanMenu;
const runecraftingSelectionTabs = new Map();
let craftingCategoryMenu;
let craftingArtisanMenu;
const craftingSelectionTabs = new Map();
let fletchingCategoryMenu;
let fletchingArtisanMenu;
const fletchingSelectionTabs = new Map();
let summoningArtisanMenu;
const summoningSelectionTabs = new Map();
let summoningCategoryMenu;
const markDiscoveryMenus = new Map();
let summoningSearchMenu;
const fishingAreaMenus = new Map();
const cookingMenus = new Map();
const agilityObstacleMenus = [];
let agilityPassivePillarMenu;
let agilityElitePassivePillarMenu;
const agilityObstacleSelectMenus = [];
let astrologyMenus;
let farmingMenus;
let townshipUI;
let bankTabMenu;
let bankOptionsMenu;
let bankMoveModeMenu;
let bankSellModeMenu;
let bankSideBarMenu;
let bankItemSettingsMenu;
const combatSkills = [
  "Hitpoints",
  "Attack",
  "Strength",
  "Defence",
  "Ranged",
  "Magic",
  "Prayer",
];
let shopMenu;
const synergyElements = { icons: [], tooltips: [] };
let tutorialMenus;
let combatMenus;
let areaMenus;
function initGameClass() {
  game = new Game();
  showCombatArea = game.combat.openAreaMenu.bind(game.combat);
  eventManager = new EventManager();
}
function initMenus() {
  var _a, _b, _c;
  window.customElements.define("farming-seed-select", FarmingSeedSelectElement);
  window.customElements.define("spend-mastery-menu", SpendMasteryMenu);
  window.customElements.define("potion-select-menu", PotionSelectMenu);
  sidebar.render();
  Object.entries(equipmentSlotData).forEach((entry, id) => {
    entry[1].imageElements = getEquipmentImageElements(entry[1].id);
    if (entry[1].allowQuantity)
      entry[1].qtyElements = getEquipmentQtyElements(entry[0]);
    entry[1].tooltips = entry[1].imageElements.map((imageElem) => {
      return tippy(imageElem, {
        content: "",
        allowHTML: true,
        placement: "top",
        interactive: false,
        animation: false,
        popperOptions: {
          strategy: "fixed",
          modifiers: [
            { name: "flip", options: { fallbackPlacements: ["top", "right"] } },
            {
              name: "preventOverflow",
              options: { altAxis: true, tether: false },
            },
          ],
        },
      });
    });
    entry[1].quickEquipTooltip = entry[1].imageElements.map((imageElem) => {
      return tippy(imageElem, {
        allowHTML: true,
        placement: "bottom",
        interactive: true,
        animation: false,
        trigger: "click",
        onShow: (instance) => {
          instance.setContent(
            game.combat.player.quickEquipMenu.getTooltipContent(id)
          );
        },
        popperOptions: {
          strategy: "fixed",
          modifiers: [
            {
              name: "flip",
              options: { fallbackPlacements: ["bottom", "right"] },
            },
            {
              name: "preventOverflow",
              options: { altAxis: true, tether: false },
            },
          ],
        },
      });
    });
  });
  enemyHTMLElements = {
    minHit: [document.getElementById("combat-enemy-min-hit")],
    maxHit: [document.getElementById("combat-enemy-strength-bonus")],
    accuracy: [document.getElementById("combat-enemy-attack-bonus")],
    maxHitpoints: [
      document.getElementById("combat-enemy-hitpoints-max"),
      document.getElementById("combat-enemy-hitpoints-max-1"),
    ],
    attackInterval: [document.getElementById("combat-enemy-attack-speed")],
    damageReduction: [document.getElementById("combat-enemy-damage-reduction")],
    evasion: {
      melee: [document.getElementById("combat-enemy-defence-evasion")],
      ranged: [document.getElementById("combat-enemy-ranged-evasion")],
      magic: [document.getElementById("combat-enemy-magic-evasion")],
    },
    hitChance: [document.getElementById("combat-enemy-chance-to-hit")],
    hitpoints: [
      document.getElementById("combat-enemy-hitpoints-current"),
      document.getElementById("combat-enemy-hitpoints-current-1"),
    ],
    hitpointsBar: [
      document.getElementById("combat-enemy-hitpoints-bar"),
      document.getElementById("combat-enemy-hitpoints-bar-1"),
    ],
    image: document.getElementById("combat-enemy-img"),
    name: [document.getElementById("combat-enemy-name")],
    attackName: [document.getElementById("combat-enemy-attack-speed-desc")],
    attackType: document.getElementById("combat-enemy-attack-type"),
    levels: {
      Combat: [document.getElementById("combat-enemy-combat-level")],
      Attack: [document.getElementById("combat-enemy-attack-level")],
      Strength: [document.getElementById("combat-enemy-strength-level")],
      Defence: [document.getElementById("combat-enemy-defence-level")],
      Ranged: [document.getElementById("combat-enemy-ranged-level")],
      Magic: [document.getElementById("combat-enemy-magic-level")],
      Hitpoints: [],
      Prayer: [],
    },
  };
  game.pages.forEach((page) => page.generateSideBar());
  skillNav = new SkillNav(game);
  const pageButtons = document.querySelectorAll("button[data-page-id]");
  pageButtons.forEach((button) => {
    const pageID = button.getAttribute("data-page-id");
    if (pageID === null) {
      console.warn(
        "Tried to initialize page change button, but page-id is null"
      );
      console.log(button);
      return;
    }
    const page = game.pages.getObjectByID(pageID);
    if (page === undefined) {
      console.warn(
        `Tried to initialize page change button, but page with id: ${pageID} is not registered.`
      );
      console.log(button);
      return;
    }
    button.onclick = () => {
      changePage(page, -1, undefined, true, false);
      button.blur();
    };
  });
  game.skills.forEach((skill) => {
    if (!skill.isCombat) {
      const xpDisplay = document.getElementById(
        `skill-progress-xp-${skill.id}`
      );
      if (xpDisplay !== null) {
        xpDisplay.after(
          createElement("span", {
            id: `adventure-mode-xp-limit-notice-${skill.id}`,
            className: "text-danger d-none",
            children: [
              createElement("br"),
              createElement("i", { className: "fa fa-info-circle mr-1" }),
              getLangString("MENU_TEXT", "ADV_MODE_XP_LIMIT_WARNING"),
            ],
          })
        );
      }
    }
  });
  playerHTMLElements = {
    evasion: {
      melee: [document.getElementById("combat-player-defence-bonus")],
      ranged: [document.getElementById("combat-player-defence-bonus-ranged")],
      magic: [document.getElementById("combat-player-defence-bonus-magic")],
    },
    minHit: [document.getElementById("combat-player-min-hit")],
    maxHit: [document.getElementById("combat-player-strength-bonus")],
    accuracy: [document.getElementById("combat-player-attack-bonus")],
    maxHitpoints: [
      document.getElementById("combat-player-hitpoints-max"),
      document.getElementById("combat-player-hitpoints-max-1"),
      document.getElementById("thieving-player-hitpoints-max"),
    ],
    attackInterval: [document.getElementById("combat-player-attack-speed")],
    damageReduction: [
      document.getElementById("combat-player-damage-reduction"),
    ],
    hitChance: [document.getElementById("combat-player-chance-to-hit")],
    hitpoints: [
      document.getElementById("combat-player-hitpoints-current"),
      document.getElementById("combat-player-hitpoints-current-1"),
      document.getElementById("thieving-player-hitpoints-current"),
    ],
    hitpointsBar: [
      document.getElementById("combat-player-hitpoints-bar"),
      document.getElementById("combat-player-hitpoints-bar-1"),
      document.getElementById("thieving-player-hitpoints-bar"),
    ],
    navHitpoints: [document.getElementById("nav-hitpoints-current")],
    prayerPoints: [document.getElementById("combat-player-prayer-points-0")],
    navPrayerPoints: [document.getElementById("combat-player-prayer-points-2")],
    gp: [
      document.getElementById("nav-current-gp"),
      document.getElementById("shop-current-gp"),
    ],
    combatLevel: [sidebar.category("Combat").item("melvorD:Combat").nameEl],
    attackName: [document.getElementById("combat-player-attack-speed-desc")],
    specialIcon: document.getElementById("combat-player-special-attack-icon"),
    specialTooltip: tippy(
      document.getElementById("combat-player-special-attack-icon"),
      {
        content: "",
        placement: "bottom",
        allowHTML: true,
        interactive: false,
        animation: false,
      }
    ),
    autoEatIcons: [
      document.getElementById("combat-player-auto-eat"),
      document.getElementById("thieving-player-auto-eat"),
    ],
    autoEatTooltips: tippy(".auto-eat-icon", {
      content: "",
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    }),
    triangleDamageIcons: Object.values(
      document.getElementsByClassName("combat-player-strength-bonus-tooltip")
    ),
    triangleReductionIcon: document.getElementById(
      "combat-player-damage-reduction-tooltip"
    ),
    triangleDamageTooltips: tippy(".combat-player-strength-bonus-tooltip", {
      content: "",
      placement: "bottom",
      allowHTML: true,
      interactive: false,
      animation: false,
    }),
    triangleReductionTooltip: tippy(
      document.getElementById("combat-player-damage-reduction-tooltip"),
      {
        content: "",
        placement: "bottom",
        allowHTML: true,
        interactive: false,
        animation: false,
      }
    ),
    golbinLevels: {
      Attack: document.getElementById("combat-player-golbin-stat-Attack"),
      Strength: document.getElementById("combat-player-golbin-stat-Strength"),
      Defence: document.getElementById("combat-player-golbin-stat-Defence"),
      Hitpoints: document.getElementById("combat-player-golbin-stat-Hitpoints"),
      Ranged: document.getElementById("combat-player-golbin-stat-Ranged"),
      Magic: document.getElementById("combat-player-golbin-stat-Magic"),
      Prayer: document.getElementById("golbin-raid-prayer-level-text"),
    },
  };
  synergyElements.icons = Object.values(
    document.getElementsByClassName("combat-summon-synergy")
  );
  synergyElements.tooltips = tippy(".combat-summon-synergy", {
    content: "",
    placement: "bottom",
    allowHTML: true,
    interactive: false,
    animation: false,
  });
  skillProgressDisplay = new SkillProgressDisplay(game);
  const eventMenu = document.getElementById("combat-event-menu");
  combatMenus = {
    progressBars: {
      playerAttack: new ProgressBar(
        document.getElementById("combat-progress-attack-player")
      ),
      playerAttackMinibar: new ProgressBar(
        document.getElementById("combat-progress-attack-player-1")
      ),
      playerSummon: new ProgressBar(
        document.getElementById("combat-progress-attack-summoning")
      ),
      enemyAttack: new ProgressBar(
        document.getElementById("combat-progress-attack-enemy")
      ),
      enemyAttackMinibar: new ProgressBar(
        document.getElementById("combat-progress-attack-enemy-1")
      ),
    },
    playerEffectRenderer: new EffectRenderer(
      document.getElementById("combat-player-effect-container")
    ),
    enemyEffectRenderer: new EffectRenderer(
      document.getElementById("combat-enemy-effect-container")
    ),
    playerSplashManager: new SplashManager(
      document.getElementById("combat-player-splash-container")
    ),
    enemySplashManager: new SplashManager(
      document.getElementById("combat-enemy-splash-container")
    ),
    spells: {
      standard: new StandardSpellMenu(),
      curse: new CurseSpellMenu(),
      aurora: new AuroraSpellMenu(),
      ancient: new AncientSpellMenu(),
      archaic: new ArchaicSpellMenu(),
    },
    prayer: new PrayerMenu(),
    runes: new RuneMenu(),
    equipSets: [
      new EquipmentSetMenu("combat-equipment-set-menu-0", ["btn", "m-1"]),
      new EquipmentSetMenu("combat-equipment-set-menu-1", [
        "btn",
        "btn-sm",
        "m-1",
      ]),
      new EquipmentSetMenu("combat-equipment-set-menu-2", [
        "btn",
        "btn-sm",
        "fixed-size",
        "mr-1",
        "mt-1",
      ]),
    ],
    combatFood: new FoodMenu("combat-food-container"),
    thievingFood: new FoodMenu("thieving-food-container"),
    enemyAttackPassive: new EnemyAttackPassiveMenu(true),
    eventMenu,
    loot: document.getElementById("combat-loot"),
    slayerTask: document.getElementById("combat-slayer-task-menu"),
    runButton: document.getElementById("combat-btn-run"),
    minibarRunButton: document.getElementById("combat-footer-minibar-run-btn"),
    minibarEatButton: document.getElementById("combat-footer-minibar-eat-btn"),
    viewDropsButton: document.getElementById("combat-btn-monster-drops"),
    locationElements: {
      image: document.getElementById("combat-dungeon-img"),
      name: document.getElementById("combat-dungeon-name"),
      floorCount: document.getElementById("combat-dungeon-floor-count"),
      count: document.getElementById("combat-dungeon-count"),
      areaEffect: document.getElementById("combat-area-effect"),
    },
    equipmentMenuIcons: [
      document.getElementById("combat-menu-item-0"),
      document.getElementById("page-header-equipment-dropdown-image"),
    ],
  };
  if (game.archaicSpells.size > 0) {
    (_a = document.getElementById("spellbook-select-standard-div")) === null ||
    _a === void 0
      ? void 0
      : _a.classList.replace("col-6", "col-4");
    (_b = document.getElementById("spellbook-select-ancient-div")) === null ||
    _b === void 0
      ? void 0
      : _b.classList.replace("col-6", "col-4");
    (_c = document.getElementById("spellbook-select-archaic-div")) === null ||
    _c === void 0
      ? void 0
      : _c.classList.remove("d-none");
  }
  areaMenus = {
    combat: new CombatAreaMenu(
      "combat-select-area-Combat",
      game.combatAreaDisplayOrder
    ),
    slayer: new CombatAreaMenu(
      "combat-select-area-Slayer",
      game.slayerAreaDisplayOrder
    ),
    dungeon: new CombatAreaMenu(
      "combat-select-area-Dungeon",
      game.dungeonDisplayOrder
    ),
  };
  game.attackStyles.forEach((style) => {
    const container = document.getElementById(
      `${style.attackType}-attack-style-buttons`
    );
    const button = createElement("button", {
      className: "btn btn-outline-secondary m-1",
      id: style.buttonID,
    });
    button.style.width = "100%";
    style.experienceGain.forEach(({ skill }) => {
      button.append(
        createElement("img", {
          className: "nav-img",
          attributes: [["src", skill.media]],
        })
      );
    });
    button.append(createElement("span", { text: style.name }));
    container
      .appendChild(
        createElement("div", {
          className: nativeManager.isMobile ? "col-6" : "col-12",
        })
      )
      .appendChild(button);
    tippy(button, {
      content: style.toolTipContent,
      placement: "right",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  });
  woodcuttingMenu = new WoodcuttingMenu(game.woodcutting);
  const fishingAreaMenuContainer = document.getElementById(
    "fishing-area-menu-container"
  );
  game.fishing.areas.forEach((area) => {
    const menu = new FishingAreaMenu();
    menu.className = "col-12 col-xl-6";
    fishingAreaMenuContainer.append(menu);
    fishingAreaMenus.set(area, menu);
  });
  game.cooking.categories.forEach((category) => {
    cookingMenus.set(
      category,
      new CookingMenu(category, "cooking-menu-container")
    );
  });
  const constellations = new Map();
  const infoPanel = document.getElementById("astrology-info-panel");
  infoPanel.initialize(game);
  const explorePanel = document.getElementById("astrology-exploration-panel");
  game.astrology.actions.forEach((recipe) => {
    const constellationMenu = createElement("constellation-menu", {
      className: "col-6 col-lg-3",
    });
    explorePanel.before(constellationMenu);
    constellations.set(recipe, constellationMenu);
  });
  astrologyMenus = { constellations, infoPanel, explorePanel };
  herbloreArtisanMenu = new HerbloreArtisanMenu(game.herblore);
  herbloreCategoryMenu = new CategoryMenu(
    "herblore-category-menu",
    "horizontal-navigation-herblore",
    game.herblore.categories.allObjects,
    "SELECT_HERBLORE_CATEGORY",
    switchToCategory(herbloreSelectionTabs)
  );
  game.herblore.categories.forEach((category) => {
    herbloreSelectionTabs.set(category, new HerbloreSelectionTab(category));
  });
  potionSelectMenu = document.getElementById("potion-select-menu-modal");
  smithingCategoryMenu = new CategoryMenu(
    "smithing-category-menu",
    "horizontal-navigation-smithing",
    game.smithing.categories.allObjects,
    "SELECT_SMITHING_CATEGORY",
    switchToCategory(smithingSelectionTabs)
  );
  smithingArtisanMenu = new ArtisanMenu(
    "smithing-artisan-container",
    game.smithing
  );
  game.smithing.categories.forEach((category) => {
    smithingSelectionTabs.set(category, new SmithingSelectionTab(category));
  });
  runecraftingCategoryMenu = new CategoryMenu(
    "runecrafting-category-menu",
    "horizontal-navigation-runecrafting",
    game.runecrafting.categories.allObjects,
    "SELECT_RUNECRAFTING_CATEGORY",
    switchToCategory(runecraftingSelectionTabs)
  );
  runecraftingArtisanMenu = new ArtisanMenu(
    "runecrafting-artisan-container",
    game.runecrafting
  );
  game.runecrafting.categories.forEach((category) => {
    runecraftingSelectionTabs.set(
      category,
      new RunecraftingSelectionTab(category)
    );
  });
  craftingCategoryMenu = new CategoryMenu(
    "crafting-category-menu",
    "horizontal-navigation-crafting",
    game.crafting.categories.allObjects,
    "SELECT_CRAFTING_CATEGORY",
    switchToCategory(craftingSelectionTabs)
  );
  craftingArtisanMenu = new ArtisanMenu(
    "crafting-artisan-container",
    game.crafting
  );
  game.crafting.categories.forEach((category) => {
    craftingSelectionTabs.set(category, new CraftingSelectionTab(category));
  });
  fletchingCategoryMenu = new CategoryMenu(
    "fletching-category-menu",
    "horizontal-navigation-fletching",
    game.fletching.categories.allObjects,
    "SELECT_FLETCHING_CATEGORY",
    switchToCategory(fletchingSelectionTabs)
  );
  fletchingArtisanMenu = new ArtisanMenu(
    "fletching-artisan-container",
    game.fletching
  );
  game.fletching.categories.forEach((category) => {
    fletchingSelectionTabs.set(category, new FletchingSelectionTab(category));
  });
  summoningCategoryMenu = new CategoryMenu(
    "summoning-category-menu",
    "horizontal-navigation-summoning",
    game.summoning.categories.allObjects,
    "SELECT_SUMMONING_CATEGORY",
    switchSummoningCategory
  );
  summoningArtisanMenu = new ArtisanMenu(
    "summoning-creation-element",
    game.summoning
  );
  game.summoning.categories.forEach((category) => {
    if (category.id === "melvorD:Marks" || category.id === "melvorD:Synergies")
      return;
    summoningSelectionTabs.set(category, new SummoningSelectionTab(category));
  });
  const markDiscoveryContainer = document.getElementById(
    "mark-discovery-elements"
  );
  game.summoning.actions.allObjects
    .sort((a, b) => a.level - b.level)
    .forEach((mark) => {
      const newMenu = new SummoningMarkDiscovery();
      newMenu.className = "col-6 col-lg-4 col-xl-2";
      markDiscoveryMenus.set(mark, markDiscoveryContainer.appendChild(newMenu));
    });
  const summoningSearchMenuCont = document.getElementById(
    "summoning-synergies-search-cont"
  );
  summoningSearchMenu = new SynergySearchMenu();
  summoningSearchMenu.classList.add("row");
  summoningSearchMenuCont.append(summoningSearchMenu);
  const obstacleMenuContainer = document.getElementById(
    "skill-content-container-20"
  );
  for (let i = 0; i < game.agility.maxObstacles; i++) {
    const menu = new BuiltAgilityObstacle();
    menu.className = "col-12 col-lg-6 d-none";
    obstacleMenuContainer.append(menu);
    agilityObstacleMenus.push(menu);
  }
  agilityPassivePillarMenu = new PassivePillarMenu();
  agilityPassivePillarMenu.className = "col-12 col-lg-6 d-none";
  obstacleMenuContainer.append(agilityPassivePillarMenu);
  agilityElitePassivePillarMenu = new ElitePassivePillarMenu();
  agilityElitePassivePillarMenu.className = "col-12 col-lg-6 d-none";
  obstacleMenuContainer.append(agilityElitePassivePillarMenu);
  altMagicMenu = document.getElementById("magic-screen-cast");
  altMagicItemMenu = document.getElementById("magic-screen-select");
  altMagicSelection = new AltMagicSelectionTab();
  bankTabMenu = document.getElementById("bank-tab-menu");
  bankMoveModeMenu = document.getElementById("main-bank-move-mode");
  bankSellModeMenu = document.getElementById("main-bank-sell-mode");
  bankOptionsMenu = document.getElementById("main-bank-options");
  bankSideBarMenu = document.getElementById("main-bank-sidebar");
  bankMoveModeMenu.initialize(game.bank);
  bankSellModeMenu.initialize(game.bank);
  bankOptionsMenu.initialize(game.bank);
  bankSideBarMenu.initialize(game);
  bankTabMenu.initialize(game.bank);
  thievingMenu = new ThievingMenu("thieving-npc-container");
  const firemakingGrants = document.getElementById("skill-fm-logs-grants");
  firemakingMenu = {
    fireProgress: new ProgressBar(
      document.getElementById("skill-fm-burn-progress"),
      "bg-warning"
    ),
    bonfireProgress: new ProgressBar(
      document.getElementById("skill-fm-bonfire-progress"),
      "bg-primary"
    ),
    masteryDisplay: document.getElementById("firemaking-mastery-display"),
    recipeSelect: new Map(),
    grants: firemakingGrants,
    xpIcon: new XPIcon(firemakingGrants, 0, 32),
    masteryIcon: new MasteryXPIcon(firemakingGrants, 0, 32),
    masteryPoolIcon: new MasteryPoolIcon(firemakingGrants, 0, 32),
    intervalIcon: new IntervalIcon(firemakingGrants, 0, 32),
  };
  firemakingMenu.bonfireProgress.isReversed = true;
  const firemakingOptionsContainer = document.getElementById(
    "firemaking-log-options"
  );
  game.firemaking.actions.forEach((recipe) => {
    const link = createElement("a", {
      classList: ["dropdown-item", "d-none"],
      parent: firemakingOptionsContainer,
    });
    link.onclick = () => game.firemaking.selectLog(recipe);
    createElement("img", {
      parent: link,
      className: "resize-24",
      attributes: [["src", recipe.log.media]],
    });
    const name = createElement("span", { text: recipe.log.name, parent: link });
    firemakingMenu.recipeSelect.set(recipe, { link, name });
  });
  spendMasteryMenu = document.getElementById("modal-spend-mastery-menu");
  farmingMenus = {
    categoryOptions: document.getElementById("farming-category-options"),
    categoryButtons: new Map(),
    plots: [],
    plotMap: new Map(),
    lockedPlots: [],
    seedSelect: document.getElementById("farming-seed-select"),
    plotContainer: document.getElementById("farming-plot-container"),
    compostIcons: [],
  };
  const farmingCategoryContainer = document.getElementById(
    "farming-category-container"
  );
  game.farming.categories.forEach((category) => {
    const button = createElement("farming-category-button", {
      className: "col-12 col-md-6 col-xl-4",
    });
    button.setCategory(category, game.farming);
    farmingMenus.categoryButtons.set(category, button);
    farmingCategoryContainer.append(button);
  });
  const compostIconContainer = document.getElementById(
    "farming-compost-container"
  );
  game.items.composts.forEach((item) => {
    const icon = new ItemCurrentIcon(compostIconContainer, item, 1, true, 32);
    farmingMenus.compostIcons.push(icon);
  });
  townshipUI = new TownshipUI(game.township);
  tutorialMenus = {
    headerStage: document.getElementById("tutorial-stage-header"),
    progress: document.getElementById("tutorial-progress"),
    stageContainer: document.getElementById("tutorial-stage-container"),
    stages: [],
  };
  game.masterySkills.forEach((skill) => {
    if (skill.hasMastery) {
      const header = document.getElementById(`skill-header-${skill.id}`);
      if (header !== null) {
        const options = createElement("mastery-skill-options", {
          className: "pl-1 pr-1",
        });
        header.append(options);
        options.setSkill(skill);
      }
    }
  });
  const cookingToggleHTML = `
  <div class="row gutters-tiny">
    <div class="col-12 col-lg-6 font-w400 font-size-sm text-center mb-2 d-none" id="cooking-food-auto-equip">
      <settings-checkbox data-setting-id="enableAutoEquipFood"></settings-checkbox>
    </div>
    <div class="col-12 col-lg-6 font-w400 font-size-sm text-center mb-2" id="cooking-food-enable-perfect">
      <settings-checkbox data-setting-id="enablePerfectCooking"></settings-checkbox>
    </div>
  </div>`;
  const cookingHeader = document.getElementById("skill-header-melvorD:Cooking");
  if (cookingHeader !== null) $(cookingHeader).append(cookingToggleHTML);
  game.lore.loadLoreButtons();
  game.shop.initUpgradeChainDisplays();
  game.minibar.initialize();
  game.combat.loot.initializeMenus();
  combatMenus.slayerTask.initialize(game);
}
