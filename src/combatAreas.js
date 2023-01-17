"use strict";
class CombatAreaMenu {
  constructor(containerID, areas) {
    this.areas = areas;
    this.menuElems = new Map();
    this.container = document.getElementById(containerID);
    this.container.textContent = "";
    this.areas.forEach((areaData, id) => {
      this.createMenuElement(areaData, id);
    });
  }
  updateRequirements() {
    this.menuElems.forEach((menuElem, areaData) => {
      const reqSpans = menuElem.requirements;
      let slayerLevelReq = 0;
      if (areaData instanceof SlayerArea)
        slayerLevelReq = areaData.slayerLevelRequired;
      areaData.entryRequirements.forEach((requirement, reqID) => {
        this.setReqStatus(
          reqSpans[reqID],
          game.checkRequirement(requirement, false, slayerLevelReq)
        );
      });
      if (
        areaData instanceof Dungeon &&
        areaData.unlockRequirement !== undefined
      ) {
        if (game.checkRequirements(areaData.unlockRequirement)) {
          menuElem.lockedElems.forEach(hideElement);
          menuElem.unlockedElems.forEach(showElement);
          menuElem.image.src = areaData.media;
        } else {
          menuElem.lockedElems.forEach(showElement);
          menuElem.unlockedElems.forEach(hideElement);
          menuElem.lockedElems[0].textContent = this.getUnlockMessage(
            areaData.unlockRequirement
          );
          menuElem.image.src = `${CDNDIR}assets/media/main/question.svg`;
        }
      }
    });
  }
  updateEvent(activeAreas) {
    this.menuElems.forEach((menuElem, areaData) => {
      if (activeAreas.has(areaData)) {
        menuElem.isEventActive = true;
        menuElem.openButton.classList.remove("faded-image");
      } else {
        menuElem.isEventActive = false;
        menuElem.openButton.classList.add("faded-image");
      }
      if (menuElem.isOpen) {
        hideElement(menuElem.table);
        menuElem.isOpen = false;
      }
    });
  }
  updateAreaEffectValues() {
    this.menuElems.forEach((menuElem, areaData) => {
      if (areaData instanceof SlayerArea && areaData.areaEffect) {
        menuElem.effectDescription.textContent = templateString(
          areaData.areaEffectDescription,
          {
            effectValue: `${game.combat.getAreaEffectMagnitude(
              areaData.areaEffect
            )}`,
          }
        );
      }
    });
  }
  removeEvent() {
    this.menuElems.forEach((menuElem) => {
      menuElem.isEventActive = false;
      menuElem.openButton.classList.remove("faded-image");
      if (menuElem.isOpen) {
        hideElement(menuElem.eventButton);
        menuElem.isOpen = false;
      }
    });
  }
  setTutorialHighlight(area) {
    var _a;
    const areaMenu = this.menuElems.get(area);
    if (areaMenu === undefined)
      throw new Error("Tried to set tutorial highlight for invalid area.");
    this.removeTutorialHighlight();
    this.highlightedArea = areaMenu;
    (_a = areaMenu.openButton.parentElement) === null || _a === void 0
      ? void 0
      : _a.classList.add("glow-success");
  }
  removeTutorialHighlight() {
    var _a;
    if (this.highlightedArea !== undefined) {
      (_a = this.highlightedArea.openButton.parentElement) === null ||
      _a === void 0
        ? void 0
        : _a.classList.remove("glow-success");
    }
    this.highlightedArea = undefined;
  }
  setReqStatus(reqSpan, met) {
    if (met) {
      reqSpan.classList.remove("text-danger");
      reqSpan.classList.add("text-success");
    } else {
      reqSpan.classList.remove("text-success");
      reqSpan.classList.add("text-danger");
    }
  }
  createMenuElement(areaData, id) {
    const openButton = this.container
      .appendChild(
        createElement("div", { classList: ["col-12", "col-md-6", "col-xl-4"] })
      )
      .appendChild(
        createElement("div", {
          classList: [
            "block",
            "block-content",
            "block-rounded",
            "border-top",
            "border-combat",
            "border-4x",
            "pointer-enabled",
            "clickable",
          ],
          id: "clickable",
        })
      );
    const contentContainer = openButton.appendChild(
      createElement("div", {
        classList: ["media", "d-flex", "align-items-center", "push"],
      })
    );
    const image = createElement("img", {
      classList: ["shop-img"],
      attributes: [["src", areaData.media]],
    });
    const infoContainer = createElement("div", { classList: ["media-body"] });
    contentContainer.append(
      createElement("div", { classList: ["mr-3"], children: [image] }),
      infoContainer
    );
    const unlockedElems = [];
    const lockedElems = [];
    const tutorialDirection = this.createTutorialDirection(areaData);
    unlockedElems.push(this.createName(areaData));
    let reqSpans = [];
    if (areaData.entryRequirements.length > 0) {
      let requirements;
      ({ reqSpans, requirements } = this.createRequirements(areaData));
      unlockedElems.push(requirements);
    }
    let table;
    let buttons;
    const effectDescription = createElement("span");
    if (areaData instanceof SlayerArea) {
      unlockedElems.push(this.createEffectInfo(areaData, effectDescription));
    }
    if (areaData instanceof Dungeon) {
      if (areaData.unlockRequirement !== undefined) {
        lockedElems.push(this.createDungeonUnlock(areaData));
      }
      unlockedElems.push(...this.createDungeonInfo(areaData));
      ({ table, buttons } = this.createDungeonTable(areaData));
    } else {
      ({ table, buttons } = this.createMonsterTable(areaData));
    }
    infoContainer.append(...lockedElems, tutorialDirection, ...unlockedElems);
    hideElement(table);
    openButton.append(table);
    const eventButton = this.createEventStartButton(areaData);
    hideElement(eventButton);
    openButton.append(eventButton);
    const menuElem = {
      table: table,
      image: image,
      requirements: reqSpans,
      fightButtons: buttons,
      isOpen: false,
      lockedElems: lockedElems,
      unlockedElems: unlockedElems,
      isEventActive: false,
      eventButton,
      openButton,
      effectDescription,
    };
    openButton.onclick = () => this.toggleTable(areaData, menuElem);
    this.menuElems.set(areaData, menuElem);
  }
  toggleTable(areaData, menuItem) {
    if (
      (areaData instanceof Dungeon &&
        areaData.unlockRequirement !== undefined &&
        !game.checkRequirements(areaData.unlockRequirement)) ||
      (game.combat.isEventActive && !menuItem.isEventActive)
    ) {
      return;
    }
    let elementToToggle = menuItem.table;
    if (game.combat.isEventActive && menuItem.isEventActive) {
      elementToToggle = menuItem.eventButton;
    }
    if (menuItem.isOpen) {
      hideElement(elementToToggle);
    } else {
      showElement(elementToToggle);
    }
    menuItem.isOpen = !menuItem.isOpen;
  }
  createTutorialDirection(areaData) {
    const tutorialDirection = createElement("span", {
      classList: ["p-1", "bg-success", "rounded", "font-w700", "d-none"],
      id: `tutorial-${areaData.id}`,
      text: getLangString("COMBAT_MISC", "HERE"),
    });
    return tutorialDirection;
  }
  createName(areaData) {
    const name = createElement("div", { classList: ["font-w600"] });
    name.append(
      document.createTextNode(areaData.name),
      this.createDifficultySpan(areaData.difficulty[0])
    );
    if (areaData.difficulty.length > 1) {
      name.append(
        document.createTextNode("-"),
        this.createDifficultySpan(areaData.difficulty[1])
      );
    }
    return name;
  }
  createDifficultySpan(difficulty) {
    const diffData = CombatAreaMenu.difficulty[difficulty];
    return createElement("span", {
      classList: ["badge", "badge-pill", diffData.class, "m-1"],
      text: diffData.name,
    });
  }
  createRequirements(areaData) {
    const reqSpans = [];
    const requirements = createElement("div", { classList: ["font-size-sm"] });
    const small = requirements.appendChild(createElement("small"));
    small.appendChild(
      document.createTextNode(getLangString("COMBAT_MISC", "48"))
    );
    areaData.entryRequirements.forEach((requirement) => {
      let reqSpan;
      switch (requirement.type) {
        case "SkillLevel":
          small.append(this.createReqImage(requirement.skill.media));
          reqSpan = this.createReqSpan(
            templateString(getLangString("MENU_TEXT", "LEVEL"), {
              level: ` ${requirement.level}`,
            })
          );
          reqSpans.push(reqSpan);
          small.appendChild(reqSpan);
          break;
        case "AllSkillLevels":
          {
            if (requirement.exceptions !== undefined) {
              reqSpan = this.createReqSpan(
                " " +
                  templateLangString(
                    "MENU_TEXT",
                    "REQUIRES_ALL_SKILL_EXCEPTION",
                    {
                      level: `${requirement.level}`,
                      skillNames: joinAsList(
                        [...requirement.exceptions].map((skill) => skill.name)
                      ),
                    }
                  )
              );
            } else {
              reqSpan = this.createReqSpan(
                " " +
                  templateLangString("MENU_TEXT", "REQUIRES_ALL_SKILL", {
                    level: `${requirement.level}`,
                  })
              );
            }
            reqSpans.push(reqSpan);
            small.appendChild(reqSpan);
          }
          break;
        case "DungeonCompletion":
          {
            const dungeon = requirement.dungeon;
            small.append(this.createReqImage(`${dungeon.media}`));
            const templateData = {
              dungeonName: dungeon.name,
              count: `${requirement.count}`,
            };
            reqSpan = this.createReqSpan(
              templateLangString(
                "COMBAT_MISC",
                requirement.count > 1
                  ? "DUNGEON_CLEARED_TIMES"
                  : "DUNGEON_CLEARED",
                templateData
              )
            );
            reqSpans.push(reqSpan);
            small.appendChild(reqSpan);
          }
          break;
        case "SlayerItem":
          small.append(this.createReqImage(requirement.item.media));
          reqSpan = this.createReqSpan(getLangString("COMBAT_MISC", "110"));
          reqSpans.push(reqSpan);
          small.appendChild(reqSpan);
          break;
        case "Completion":
          reqSpan = this.createReqSpan(
            templateLangString(
              "MENU_TEXT",
              requirement.namespace.isModded
                ? "REQUIRES_COMPLETION_MOD"
                : `REQUIRES_COMPLETION_${requirement.namespace.name}`,
              {
                percent: `${requirement.percent}`,
                modName: requirement.namespace.displayName,
              }
            )
          );
          reqSpans.push(reqSpan);
          small.appendChild(reqSpan);
          break;
        case "ShopPurchase":
          {
            const purchase = requirement.purchase;
            small.append(this.createReqImage(purchase.media));
            reqSpan = this.createReqSpan(
              templateLangString("COMBAT_MISC", "SHOP_ITEM_PURCHASED", {
                purchaseName: purchase.name,
              })
            );
            reqSpans.push(reqSpan);
            small.appendChild(reqSpan);
          }
          break;
        case "SlayerTask":
          reqSpan = this.createReqSpan(
            templateLangString(
              "MENU_TEXT",
              `REQUIRES_SLAYER_${SlayerTask.data[requirement.tier].engDisplay}`,
              { count: `${requirement.count}` }
            )
          );
          reqSpans.push(reqSpan);
          small.appendChild(reqSpan);
          break;
        case "ItemFound":
          {
            reqSpan = this.createReqSpan("");
            reqSpan.append(
              ...templateLangStringWithNodes(
                "MENU_TEXT",
                "FIND_ITEM",
                { itemImage: this.createReqImage(requirement.item.media) },
                { itemName: requirement.item.name }
              )
            );
            reqSpans.push(reqSpan);
            small.appendChild(reqSpan);
          }
          break;
        case "MonsterKilled":
          {
            reqSpan = this.createReqSpan("");
            reqSpan.append(
              ...templateLangStringWithNodes(
                "MENU_TEXT",
                requirement.count > 1
                  ? "DEFEAT_MONSTER_TIMES"
                  : "DEFEAT_MONSTER_ONCE",
                {
                  monsterImage: this.createReqImage(requirement.monster.media),
                },
                {
                  monsterName: requirement.monster.name,
                  count: `${requirement.count}`,
                }
              )
            );
            reqSpans.push(reqSpan);
            small.appendChild(reqSpan);
          }
          break;
        case "TownshipTask":
          reqSpan = this.createReqSpan(
            templateLangString("MENU_TEXT", "REQUIRES_TOWNSHIP_TASKS", {
              count: `${requirement.count}`,
            })
          );
          reqSpans.push(reqSpan);
          small.appendChild(reqSpan);
          break;
        case "TownshipBuilding":
          reqSpan = this.createReqSpan(
            templateLangString("MENU_TEXT", "REQUIRES_TOWNSHIP_BUILDINGS", {
              count: `${requirement.count}`,
              buildingName: `${requirement.building.name}`,
            })
          );
          reqSpans.push(reqSpan);
          small.appendChild(reqSpan);
          break;
      }
    });
    return { requirements, reqSpans };
  }
  createReqImage(media) {
    return createElement("img", {
      classList: ["skill-icon-xs", "mr-1", "ml-2"],
      attributes: [["src", media]],
    });
  }
  createReqSpan(text) {
    return createElement("span", { classList: ["text-danger"], text });
  }
  createDungeonInfo(areaData) {
    const infoDivs = [];
    const numMonsters =
      areaData.event !== undefined
        ? getLangString("MENU_TEXT", "QUESTION_MARKS")
        : `${areaData.monsters.length}`;
    infoDivs.push(
      createElement("div", {
        classList: ["font-size-sm"],
        children: [
          createElement("small", {
            text: `${getLangString("COMBAT_MISC", "49")} ${numMonsters}`,
          }),
        ],
      }),
      createElement("div", {
        classList: ["font-size-sm"],
        children: [
          createElement("small", {
            text: templateString(getLangString("COMBAT_MISC", "108"), {
              combatLevel: `${
                areaData.monsters[areaData.monsters.length - 1].combatLevel
              }`,
            }),
          }),
        ],
      })
    );
    if (areaData.rewards.length > 0) {
      const rewards = createElement("small", {
        text: `${getLangString("COMBAT_MISC", "51")}`,
      });
      areaData.rewards.forEach((item) => {
        if (item instanceof OpenableItem) {
          const link = createElement("a", { classList: ["combat-action"] });
          link.onclick = () => viewItemContents(item);
          link.append(
            this.createRewardImage(item.media),
            document.createTextNode(item.name)
          );
          rewards.append(link);
        } else {
          rewards.append(
            this.createRewardImage(item.media),
            document.createTextNode(item.name)
          );
        }
      });
      infoDivs.push(
        createElement("div", {
          classList: ["font-size-sm"],
          children: [rewards],
        })
      );
    }
    return infoDivs;
  }
  createRewardImage(media) {
    return createElement("img", {
      classList: ["skill-icon-xxs", "ml-3", "mr-2"],
      attributes: [["src", media]],
    });
  }
  createEffectInfo(areaData, description) {
    const infoBox = createElement("div", { classList: ["font-size-sm"] });
    const small = infoBox.appendChild(createElement("small"));
    if (areaData.areaEffect) {
      description.textContent = templateString(areaData.areaEffectDescription, {
        effectValue: `${areaData.areaEffect.magnitude}`,
      });
      infoBox.classList.add("text-danger");
      small.append(
        createElement("i", {
          classList: ["fa", "fa-fw", "fa-info-circle", "mr-1"],
        }),
        description
      );
    } else {
      small.appendChild(
        createElement("span", {
          classList: ["text-success"],
          text: getLangString("COMBAT_MISC", "NO_AREA_EFFECT"),
        })
      );
    }
    return infoBox;
  }
  createDungeonUnlock(dungeon) {
    if (dungeon.unlockRequirement !== undefined) {
      return createElement("div", {
        classList: ["font-w600"],
        text: this.getUnlockMessage(dungeon.unlockRequirement),
      });
    } else {
      throw new Error(
        "Tried to create dungeon unlock element, but dungeon has no requirement."
      );
    }
  }
  getUnlockMessage(dungReq) {
    const unlockDungeon = dungReq[0].dungeon;
    const unlockCount = dungReq[0].count;
    let unlockMessage;
    if (this.isDungeonUnlocked(unlockDungeon)) {
      unlockMessage = templateString(getLangString("COMBAT_MISC", "112"), {
        dungeonName: unlockDungeon.name,
        qty: `${unlockCount}`,
      });
    } else {
      unlockMessage = getLangString("COMBAT_MISC", "111");
    }
    return unlockMessage;
  }
  isDungeonUnlocked(dungeon) {
    if (dungeon.unlockRequirement !== undefined) {
      return game.checkRequirements(dungeon.unlockRequirement);
    } else {
      return true;
    }
  }
  createMonsterTable(areaData) {
    const table = createElement("table", {
      classList: ["table", "table-sm", "table-vcenter"],
    });
    table
      .appendChild(createElement("thead"))
      .appendChild(createElement("tr"))
      .append(
        createElement("th", {
          classList: ["text-center"],
          attributes: [["style", "width: 75px;"]],
          children: [createElement("small", { text: "#" })],
        }),
        createElement("th", {
          attributes: [["style", "width: 125px;"]],
          children: [
            createElement("small", {
              text: getLangString("COMBAT_MISC", "NAME"),
            }),
          ],
        }),
        createElement("th", {
          attributes: [["style", "width: 50px;"]],
          children: [
            createElement("small", {
              text: getLangString("COMBAT_MISC", "TYPE"),
            }),
          ],
        }),
        createElement("th", {
          classList: ["text-center"],
          children: [
            createElement("small", {
              text: getLangString("COMBAT_MISC", "OPTIONS"),
            }),
          ],
        })
      );
    const body = table.appendChild(createElement("tbody"));
    const buttons = [];
    areaData.monsters.forEach((monster) => {
      const fightButton = createElement("button", {
        classList: ["btn", "btn-sm", "btn-danger", "m-1"],
        attributes: [["role", "button"]],
        text: getLangString("COMBAT_MISC", "53"),
      });
      fightButton.onclick = () => game.combat.selectMonster(monster, areaData);
      const dropsButton = createElement("button", {
        classList: ["btn", "btn-sm", "btn-primary", "m-1"],
        attributes: [["role", "button"]],
        text: getLangString("COMBAT_MISC", "104"),
      });
      dropsButton.onclick = (event) => {
        viewMonsterDrops(monster, false);
        event.stopPropagation();
      };
      body
        .appendChild(createElement("tr"))
        .append(
          createElement("th", {
            classList: ["text-center"],
            attributes: [["scope", "row"]],
            children: [
              createElement("img", {
                classList: ["max-height-64", "max-width-64"],
                attributes: [["src", monster.media]],
              }),
            ],
          }),
          createElement("td", {
            classList: ["font-w600", "font-size-sm"],
            text: monster.name,
            children: [
              createElement("br"),
              createElement("small", {
                classList: ["font-w400"],
                text: templateString(getLangString("COMBAT_MISC", "93"), {
                  level: `${monster.combatLevel}`,
                }),
              }),
              createElement("br"),
              createElement("small", {
                children: [
                  createElement("img", {
                    classList: ["skill-icon-xs", "mr-2"],
                    attributes: [["src", game.hitpoints.media]],
                  }),
                  document.createTextNode(
                    `${numberMultiplier * monster.levels.Hitpoints}`
                  ),
                ],
              }),
            ],
          }),
          createElement("td", {
            classList: ["font-w600", "font-size-sm"],
            children: [
              createElement("img", {
                classList: ["skill-icon-xxs"],
                attributes: [
                  [
                    "src",
                    `${CDNDIR}assets/media/${
                      CombatAreaMenu.attackTypeMedia[monster.attackType]
                    }.svg`,
                  ],
                ],
              }),
            ],
          }),
          createElement("td", {
            classList: ["text-center"],
            children: [fightButton, dropsButton],
          })
        );
      buttons.push(fightButton);
    });
    return { table, buttons };
  }
  createDungeonTable(dungeon) {
    const table = createElement("div", { classList: ["font-size-sm"] });
    let text = getLangString("COMBAT_MISC", "52");
    let btnClass = "btn-danger";
    if (dungeon.event !== undefined) {
      text = getLangString("BANE_EVENT", "BTN_0");
      btnClass = "btn-success";
    }
    const button = table.appendChild(
      createElement("button", {
        classList: ["btn", "btn-sm", btnClass, "m-1"],
        attributes: [
          ["role", "button"],
          ["style", "width: 100%;"],
        ],
        text,
      })
    );
    button.onclick = () => game.combat.selectDungeon(dungeon);
    return { table, buttons: [button] };
  }
  createEventStartButton(areaData) {
    const container = createElement("div", { classList: ["font-size-sm"] });
    const button = createElement("button", {
      classList: ["btn", "btn-sm", "btn-danger", "m-1"],
      attributes: [
        ["role", "button"],
        ["style", "width: 100%;"],
      ],
      text: getLangString("COMBAT_MISC", "109"),
    });
    if (areaData instanceof SlayerArea)
      button.onclick = () => game.combat.selectEventArea(areaData);
    container.append(button);
    return container;
  }
}
CombatAreaMenu.difficulty = [
  {
    get name() {
      return getLangString("COMBAT_MISC", "95");
    },
    class: "badge-success",
  },
  {
    get name() {
      return getLangString("COMBAT_MISC", "23");
    },
    class: "badge-success",
  },
  {
    get name() {
      return getLangString("COMBAT_MISC", "96");
    },
    class: "badge-warning",
  },
  {
    get name() {
      return getLangString("COMBAT_MISC", "25");
    },
    class: "badge-danger",
  },
  {
    get name() {
      return getLangString("COMBAT_MISC", "98");
    },
    class: "badge-danger",
  },
  {
    get name() {
      return getLangString("COMBAT_MISC", "26");
    },
    class: "badge-dark",
  },
  {
    get name() {
      return getLangString("COMBAT_MISC", "100");
    },
    class: "badge-secondary",
  },
  { name: "???", class: "badge-secondary" },
];
CombatAreaMenu.attackTypeMedia = {
  melee: "skills/combat/attack",
  ranged: "skills/ranged/ranged",
  magic: "skills/magic/magic",
  random: "main/question",
};
class CombatArea extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this.entryRequirements = [];
    this.monsters = data.monsterIDs.map((id) => {
      const monster = game.monsters.getObjectByID(id);
      if (monster === undefined)
        throw new Error(
          `Error constructing Combat Area: ${this.id}. Monster with id: ${id} is not registered.`
        );
      return monster;
    });
    this._name = data.name;
    this._media = data.media;
    this.difficulty = data.difficulty;
    game.queueForSoftDependencyReg(data, this);
  }
  get media() {
    return this.getMediaURL(this._media);
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("COMBAT_AREA", `NAME_${this.localID}`);
    }
  }
  registerSoftDependencies(data, game) {
    this.entryRequirements = data.entryRequirements.map((reqData) =>
      game.getRequirementFromData(reqData)
    );
  }
}
class SlayerArea extends CombatArea {
  constructor(namespace, data, game) {
    super(namespace, data, game);
    this.slayerLevelRequired = 0;
    this._areaEffectDescription = data.areaEffectDescription;
    if (data.areaEffect !== undefined) this.areaEffect = data.areaEffect;
    if (data.pet !== undefined) {
      const pet = game.pets.getObjectByID(data.pet.petID);
      if (pet === undefined)
        throw new Error(
          `Error constructing slayer area with id: ${this.id}. Pet with id: ${data.pet.petID} is not registered.`
        );
      this.pet = { pet, weight: data.pet.weight };
    }
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("SLAYER_AREA", `NAME_${this.localID}`);
    }
  }
  get areaEffectDescription() {
    if (this.areaEffect === undefined)
      return getLangString("COMBAT_MISC", "NO_AREA_EFFECT");
    if (this.isModded) {
      if (this._areaEffectDescription !== undefined) {
        return this._areaEffectDescription;
      } else {
        return "Error. No description.";
      }
    } else {
      return getLangString("SLAYER_AREA", `EFFECT_${this.localID}`);
    }
  }
}
class Dungeon extends CombatArea {
  constructor(namespace, data, game) {
    super(namespace, data, game);
    this.rewards = data.rewardItemIDs.map((itemID) => {
      const item = game.items.getObjectByID(itemID);
      if (item === undefined)
        throw new Error(
          `Error constructing Dungeon: ${this.id}. Reward item with id: ${itemID} is not registered.`
        );
      return item;
    });
    this.dropBones = data.dropBones;
    if (data.floors !== undefined) this.floors = data.floors;
    if (data.eventID !== undefined) {
      const event = game.combatEvents.getObjectByID(data.eventID);
      if (event === undefined)
        throw new Error(
          `Error constructing Dungeon: ${this.id}. Event with id: ${data.eventID} is not registered.`
        );
      this.event = event;
    }
    if (data.unlockRequirement !== undefined)
      this.unlockRequirement = data.unlockRequirement.map((reqData) =>
        game.getDungeonRequirement(reqData)
      );
    const pet = game.pets.getObjectByID(data.pet.petID);
    if (pet === undefined)
      throw new Error(
        `Error constructing dungeon with id: ${this.id}. Pet with id: ${data.pet.petID} is not registered.`
      );
    this.pet = { pet, weight: data.pet.weight };
    this.fixedPetClears = data.fixedPetClears;
    this.pauseOnBosses = data.pauseOnBosses;
    if (data.oneTimeRewardID !== undefined) {
      const item = game.items.getObjectByID(data.oneTimeRewardID);
      if (item === undefined)
        throw new Error(
          `Error constructing Dungeon: ${this.id}. One time reward with id: ${data.oneTimeRewardID} is not registered.`
        );
      this.oneTimeReward = item;
    }
    if (data.nonBossPassives !== undefined) {
      this.nonBossPassives = data.nonBossPassives.map((passiveID) => {
        const passive = game.combatPassives.getObjectByID(passiveID);
        if (passive === undefined)
          throw new Error(
            `Error constructing Dungeon: ${this.id}. Non-boss passive with id: ${passiveID} is not registered.`
          );
        return passive;
      });
    }
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("DUNGEON", `NAME_${this.localID}`);
    }
  }
}
class DummyDungeon extends Dungeon {
  constructor(namespace, id, game) {
    super(
      namespace,
      {
        id,
        name: "",
        media: "assets/media/main/question.svg",
        monsterIDs: [],
        difficulty: [0],
        entryRequirements: [],
        rewardItemIDs: [],
        dropBones: false,
        pet: { petID: "melvorD:Chick", weight: -1 },
        fixedPetClears: false,
        pauseOnBosses: false,
      },
      game
    );
  }
}
