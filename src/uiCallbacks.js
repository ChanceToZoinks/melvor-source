"use strict";
const equipStatKeys = [
  "attackSpeed",
  "stabAttackBonus",
  "slashAttackBonus",
  "blockAttackBonus",
  "rangedAttackBonus",
  "magicAttackBonus",
  "meleeStrengthBonus",
  "rangedStrengthBonus",
  "magicDamageBonus",
  "meleeDefenceBonus",
  "rangedDefenceBonus",
  "magicDefenceBonus",
  "damageReduction",
];
function viewItemContents(item) {
  const dropsOrdered = item.dropTable.sortedDropsArray;
  const drops = dropsOrdered
    .map((drop) => {
      return templateString(getLangString("BANK_STRING", "40"), {
        qty: `${numberWithCommas(drop.maxQuantity)}`,
        itemImage: `<img class="skill-icon-xs mr-2" src="${drop.item.media}">`,
        itemName: drop.item.name,
      });
    })
    .join("<br>");
  SwalLocale.fire({
    title: item.name,
    html: getLangString("BANK_STRING", "39") + "<br><small>" + drops,
    imageUrl: item.media,
    imageWidth: 64,
    imageHeight: 64,
    imageAlt: item.name,
  });
}
function viewItemStats(item, compareToSet = game.combat.player.equipment) {
  const itemStats = new EquipmentStats(item.equipmentStats);
  $("#item-view-name").html(item.name);
  $("#item-view-img").attr("src", item.media);
  let levelReqHTML = "";
  const levelReqs = item.equipRequirements.filter(
    (req) => req.type === "SkillLevel"
  );
  if (levelReqs.length > 0) {
    levelReqs.forEach((req) => {
      levelReqHTML += `<span class="font-size-sm">${templateLangString(
        "MENU_TEXT",
        "REQUIRES_SKILL_LEVEL",
        {
          skillImage: `<span class="font-size-sm"><img class="skill-icon-xs mr-2" src="${req.skill.media}">`,
          level: `${req.level}`,
        }
      )}</span><br>`;
    });
    $("#item-view-description-levels").removeClass("d-none");
  } else $("#item-view-description-levels").addClass("d-none");
  $("#item-view-description-levels").html(levelReqHTML);
  equipStatKeys.forEach((key) => {
    if (key === "attackSpeed") return;
    $(`#item-view-${key}`).text(itemStats[key]);
  });
  if (item.description != undefined) {
    $("#item-view-description").html(item.description);
    $("#item-view-description").removeClass("d-none");
    if (item.consumesChargesOn != undefined) {
      $("#item-view-description").append(
        `<br><span class="text-success">${templateLangString(
          "MENU_TEXT",
          "CHARGES_REMAINING",
          { charges: numberWithCommas(game.itemCharges.getCharges(item)) }
        )}</span>`
      );
    }
  } else {
    $("#item-view-description").text("");
    $("#item-view-description").addClass("d-none");
  }
  if (item.specialAttacks.length > 0) {
    const attackHTML = item.specialAttacks
      .map((attack, id) => {
        let chance = attack.defaultChance;
        if (item.overrideSpecialChances !== undefined)
          chance = item.overrideSpecialChances[id];
        return `<h5 class="font-w400 font-size-sm text-left text-combat-smoke m-1 mb-2"><strong class="text-bank-desc">${
          attack.name
        } (${formatPercent(chance)}) </strong><span>${
          attack.description
        }</span></h5>`;
      })
      .join("");
    $("#item-view-special-attack-list").html(attackHTML);
    $("#item-view-special-attack").removeClass("d-none");
  } else {
    $("#item-view-special-attack-list").text("");
    $("#item-view-special-attack").addClass("d-none");
  }
  if (
    item.validSlots[0] === "Weapon" ||
    item.occupiesSlots.includes("Weapon")
  ) {
    $(`#item-view-attackSpeed`).text(
      templateLangString("MENU_TEXT", "SECONDS_SHORT", {
        seconds: `${itemStats.attackSpeed / 1000}`,
      })
    );
    $("#item-view-attack-speed-main").removeClass("d-none");
  } else {
    $("#item-view-attack-speed-main").addClass("d-none");
  }
  if (compareToSet) {
    const currentEquipStats = new EquipmentStats();
    const newEquipStats = new EquipmentStats();
    compareToSet.addEquipmentStats(currentEquipStats);
    compareToSet.addEquipmentStats(newEquipStats);
    const itemsRemovedOnEquip = compareToSet.getItemsAddedOnEquip(
      item,
      "Default"
    );
    itemsRemovedOnEquip.forEach(({ item }) => {
      newEquipStats.remItemStats(item);
    });
    newEquipStats.addItemStats(item);
    equipStatKeys.forEach((key) => {
      let statDiff = newEquipStats[key] - currentEquipStats[key];
      const diffElem = document.getElementById(`item-view-dif-${key}`);
      let diffText = "";
      let diffType = 1;
      if (key !== "attackSpeed") {
        if (statDiff > 0) {
          diffText = `+${statDiff}`;
          diffType = 2;
        } else if (statDiff < 0) {
          diffText = `${statDiff}`;
          diffType = 0;
        }
      } else if (
        item.validSlots[0] === "Weapon" ||
        item.occupiesSlots.includes("Weapon")
      ) {
        statDiff =
          (newEquipStats.attackSpeed || 4000) -
          (currentEquipStats.attackSpeed || 4000);
        statDiff /= 1000;
        if (statDiff > 0) {
          diffText = `+${templateLangString("MENU_TEXT", "SECONDS_SHORT", {
            seconds: `${statDiff}`,
          })}`;
          diffType = 0;
        } else if (statDiff < 0) {
          diffText = `${templateLangString("MENU_TEXT", "SECONDS_SHORT", {
            seconds: `${statDiff}`,
          })}`;
          diffType = 2;
        }
      }
      diffElem.textContent = diffText;
      switch (diffType) {
        case 0:
          diffElem.className = "text-danger";
          break;
        case 1:
          diffElem.className = "";
          break;
        case 2:
          diffElem.className = "text-success";
          break;
      }
    });
  } else {
    equipStatKeys.forEach((key) => {
      document.getElementById(`item-view-dif-${key}`).textContent = "";
    });
  }
  if (game.isGolbinRaid) $(".modal").css("z-index", "2000");
  else $(".modal").css("z-index", "1050");
  $("#modal-item-stats").modal("show");
}
function viewEquipmentStats() {
  const player = game.isGolbinRaid
    ? game.golbinRaid.player
    : game.combat.player;
  $("#item-view-name-current").text(
    getLangString("COMBAT_MISC", "EQUIPPED_ITEMS")
  );
  $("#item-view-img-current").attr(
    "src",
    CDNDIR + "assets/media/skills/combat/combat.svg"
  );
  equipStatKeys.forEach((key) => {
    let value = player.equipmentStats[key];
    if (key === "attackSpeed") {
      if (value === 0) value = 4000;
      value /= 1000;
    }
    const query = $(`#item-view-current-${key}`);
    query.text(value);
    if (value > 0) {
      query.addClass("text-success");
      query.removeClass("text-danger");
    } else {
      query.addClass("text-danger");
      query.removeClass("text-success");
    }
  });
  $("#modal-item-stats-current").modal("show");
}
function viewMonsterDrops(monster, respectArea) {
  SwalLocale.fire({
    title: monster.name,
    html: game.combat.getMonsterDropsHTML(monster, respectArea),
    imageUrl: monster.media,
    imageWidth: 64,
    imageHeight: 64,
    imageAlt: monster.name,
  });
}
let selectedSpellbook = "standard";
function selectSpellbook(spellbook) {
  $(`#combat-spellbook-container-${selectedSpellbook}`).addClass("d-none");
  $(`#spellbook-select-${selectedSpellbook}`).removeClass("border-success");
  $(`#combat-spellbook-container-${spellbook}`).removeClass("d-none");
  $(`#spellbook-select-${spellbook}`).addClass("border-success");
  selectedSpellbook = spellbook;
  if (game.isGolbinRaid) {
    updateSpellbook(spellbook, game.golbinRaid.player, 120, true);
  } else {
    updateSpellbook(spellbook, game.combat.player, game.altMagic.level, false);
  }
}
function equipFood() {}
const combatMenuCount = 6;
function changeCombatMenu(menu) {
  if (menu === 1 && !game.altMagic.isUnlocked && !game.isGolbinRaid) {
    lockedSkillAlert(game.altMagic, "SKILL_UNLOCK_ACCESS_THIS");
  } else if (menu === 2 && !game.prayer.isUnlocked && !game.isGolbinRaid) {
    lockedSkillAlert(game.prayer, "SKILL_UNLOCK_ACCESS_THIS");
  } else if (menu === 5 && !game.slayer.isUnlocked) {
    lockedSkillAlert(game.slayer, "SKILL_UNLOCK_ACCESS_THIS");
  } else {
    for (let i = 0; i < combatMenuCount; i++) {
      $("#combat-menu-" + i).addClass("d-none");
      $("#combat-menu-item-" + i).removeClass(
        "border border-2x border-combat-outline"
      );
    }
    $("#combat-menu-" + menu).removeClass("d-none");
    $("#combat-menu-item-" + menu).addClass(
      "border border-2x border-combat-outline"
    );
  }
}
function togglePlayerContainer() {
  $("#combat-player-container").toggleClass("d-none");
}
function switchSummoningCategory(category) {
  switch (category.id) {
    case "melvorD:Synergies":
      openSynergiesBreakdown();
      break;
    case "melvorD:Marks":
      $(`#summoning-category-0`).removeClass("d-none");
      $("#summoning-creation-element").addClass("d-none");
      switchToCategory(summoningSelectionTabs)(category);
      break;
    default:
      $(`#summoning-category-0`).addClass("d-none");
      $("#summoning-creation-element").removeClass("d-none");
      switchToCategory(summoningSelectionTabs)(category);
      break;
  }
}
function openSynergiesBreakdown() {
  var _a;
  if (!game.summoning.isUnlocked) {
    lockedSkillAlert(game.summoning, "SKILL_UNLOCK_OPEN_MENU");
  } else {
    summoningSearchMenu.updateVisibleElementUnlocks();
    summoningSearchMenu.updateVisibleElementQuantities();
    $("#modal-summoning-synergy").modal("show");
    let markToShow;
    if (
      ((_a = game.openPage) === null || _a === void 0 ? void 0 : _a.action) !==
      undefined
    ) {
      const action = game.openPage.action;
      if (action instanceof Skill)
        markToShow = game.summoning.getMarkForSkill(action);
    }
    if (markToShow !== undefined && game.summoning.getMarkLevel(markToShow) > 0)
      summoningSearchMenu.showSynergiesWithMark(markToShow);
    else summoningSearchMenu.showAllSynergies();
  }
}
let skillsMenu = true;
let combatMenu = true;
function toggleMenu(menu) {
  const c = [6, 7, 8, 9, 12, 16, 17, 18];
  const m = [0, 1, 2, 3, 4, 5, 10, 13, 14, 15, 19];
  if (menu === 0) {
    for (let i = 0; i < c.length; i++) {
      $("#nav-skill-tooltip-" + c[i]).toggleClass("d-none");
    }
    if (combatMenu) {
      $("#skill-menu-icon-1").attr("class", "far fa-eye-slash text-muted ml-1");
      combatMenu = false;
    } else {
      $("#skill-menu-icon-1").attr("class", "far fa-eye text-muted ml-1");
      combatMenu = true;
    }
  } else if (menu === 1) {
    $($(".nav-main-heading")[4])
      .nextUntil("[id=nav-main-heading]")
      .toggleClass("d-none");
    if (skillsMenu) {
      $("#skill-menu-icon").attr("class", "far fa-eye-slash text-muted ml-1");
      skillsMenu = false;
    } else {
      $("#skill-menu-icon").attr("class", "far fa-eye text-muted ml-1");
      skillsMenu = true;
    }
  }
}
function toggleCombatSkillMenu() {
  $("#combat-skill-progress-menu").toggleClass("d-none");
  $("#combat-skill-menu-open").toggleClass("d-none");
  $("#combat-skill-menu-closed").toggleClass("d-none");
}
function viewGameGuide() {
  const page = game.openPage;
  if (page === undefined || !page.hasGameGuide) return;
  game.pages.forEach((page) => {
    if (page.hasGameGuide) {
      $(`#tutorial-page-${page.localID}`).addClass("d-none");
      $(`#tutorial-page-${page.localID}-1`).addClass("d-none");
    }
  });
  if (setLang === "en")
    $(`#tutorial-page-${page.localID}`).removeClass("d-none");
  else $(`#tutorial-page-${page.localID}-1`).removeClass("d-none");
  $("#modal-game-guide").modal("show");
}
function agreeToNotice(noticeID) {
  switch (noticeID) {
    case 0:
      $("#game-notice-0").addClass("d-none");
      $("#character-selection-container").removeClass("d-none");
      break;
  }
}
function openLink(url) {
  if (nativeManager.isSteam) {
    try {
      parent.nw.Shell.openExternal(url);
    } catch (e) {
      console.warn(`Unable to open URL (${url})`, e);
    }
  } else {
    const newWindow = window.open(url, "_blank");
    if (newWindow !== null) newWindow.focus();
  }
}
function openDiscordLink() {
  if (nativeManager.isSteam) {
    try {
      parent.nw.Shell.openExternal("https://discord.gg/melvoridle");
    } catch (e) {
      console.warn("Unable to open Discord URL: " + e);
    }
  } else {
    const newWindow = window.open("https://discord.gg/melvoridle", "_blank");
    if (newWindow !== null) newWindow.focus();
  }
}
function openWikiLink() {
  if (nativeManager.isSteam) {
    try {
      parent.nw.Shell.openExternal("https://wiki.melvoridle.com");
    } catch (e) {
      console.warn("Unable to open Wiki URL: " + e);
    }
  } else {
    const newWindow = window.open("https://wiki.melvoridle.com", "_blank");
    if (newWindow !== null) newWindow.focus();
  }
}
function openExpansionSteamLink() {
  if (nativeManager.isSteam) {
    try {
      parent.nw.Shell.openExternal(
        "https://store.steampowered.com/app/2055140/Melvor_Idle_Throne_of_the_Herald/"
      );
    } catch (e) {
      console.warn("Unable to open Steam URL: " + e);
    }
  } else {
    const newWindow = window.open(
      "https://store.steampowered.com/app/2055140/Melvor_Idle_Throne_of_the_Herald/",
      "_blank"
    );
    if (newWindow !== null) newWindow.focus();
  }
}
function viewMonsterStats(monster) {
  const enemyStatHTMLElements = {
    minHit: [],
    maxHit: [document.getElementById("modal-combat-enemy-strength-bonus")],
    accuracy: [document.getElementById("modal-combat-enemy-attack-bonus")],
    attackInterval: [
      document.getElementById("modal-combat-enemy-attack-speed"),
    ],
    damageReduction: [
      document.getElementById("modal-combat-enemy-damage-reduction"),
    ],
    evasion: {
      melee: [document.getElementById("modal-combat-enemy-defence-evasion")],
      ranged: [document.getElementById("modal-combat-enemy-ranged-evasion")],
      magic: [document.getElementById("modal-combat-enemy-magic-evasion")],
    },
    hitChance: [document.getElementById("modal-combat-enemy-chance-to-hit")],
    image: document.getElementById("modal-combat-enemy-img"),
    name: [document.getElementById("modal-combat-enemy-name")],
    attackName: [
      document.getElementById("modal-combat-enemy-attack-speed-desc"),
    ],
    attackType: [document.getElementById("modal-combat-enemy-attack-type")],
    maxHitpoints: [document.getElementById("modal-combat-enemy-hitpoints")],
    levelElements: {
      Combat: [document.getElementById("modal-combat-enemy-combat-level")],
      Attack: [document.getElementById("modal-combat-enemy-attack-level")],
      Strength: [document.getElementById("modal-combat-enemy-strength-level")],
      Defence: [document.getElementById("modal-combat-enemy-defence-level")],
      Ranged: [document.getElementById("modal-combat-enemy-ranged-level")],
      Magic: [document.getElementById("modal-combat-enemy-magic-level")],
      Hitpoints: [],
      Prayer: [],
    },
    locationElements: {
      image: document.getElementById("modal-combat-dungeon-img"),
      name: document.getElementById("modal-combat-dungeon-name"),
    },
  };
  const mStats = new Enemy(game.combat, game);
  mStats.setMonster(monster);
  enemyStatHTMLElements.evasion.melee.forEach(
    (elem) => (elem.textContent = numberWithCommas(mStats.stats.evasion.melee))
  );
  enemyStatHTMLElements.evasion.ranged.forEach(
    (elem) => (elem.textContent = numberWithCommas(mStats.stats.evasion.ranged))
  );
  enemyStatHTMLElements.evasion.magic.forEach(
    (elem) => (elem.textContent = numberWithCommas(mStats.stats.evasion.magic))
  );
  enemyStatHTMLElements.minHit.forEach(
    (elem) => (elem.textContent = numberWithCommas(mStats.stats.minHit))
  );
  enemyStatHTMLElements.maxHit.forEach(
    (elem) => (elem.textContent = numberWithCommas(mStats.stats.maxHit))
  );
  enemyStatHTMLElements.accuracy.forEach(
    (elem) => (elem.textContent = numberWithCommas(mStats.stats.accuracy))
  );
  enemyStatHTMLElements.attackInterval.forEach(
    (elem) =>
      (elem.textContent = templateLangString("MENU_TEXT", "SECONDS_SHORT", {
        seconds: formatFixed(mStats.stats.attackInterval / 1000, 2),
      }))
  );
  enemyStatHTMLElements.damageReduction.forEach(
    (elem) => (elem.textContent = formatPercent(mStats.stats.damageReduction))
  );
  enemyStatHTMLElements.maxHitpoints.forEach(
    (elem) => (elem.textContent = `${mStats.stats.maxHitpoints}`)
  );
  enemyStatHTMLElements.name.forEach(
    (elem) => (elem.textContent = monster.name)
  );
  enemyStatHTMLElements.attackType.forEach(
    (elem) => (elem.src = mStats.getAttackTypeMedia(mStats.attackType))
  );
  enemyStatHTMLElements.levelElements.Combat.forEach(
    (elem) => (elem.textContent = `${monster.combatLevel}`)
  );
  enemyStatHTMLElements.levelElements.Attack.forEach(
    (elem) => (elem.textContent = `${mStats.levels.Attack}`)
  );
  enemyStatHTMLElements.levelElements.Strength.forEach(
    (elem) => (elem.textContent = `${mStats.levels.Strength}`)
  );
  enemyStatHTMLElements.levelElements.Defence.forEach(
    (elem) => (elem.textContent = `${mStats.levels.Defence}`)
  );
  enemyStatHTMLElements.levelElements.Ranged.forEach(
    (elem) => (elem.textContent = `${mStats.levels.Ranged}`)
  );
  enemyStatHTMLElements.levelElements.Magic.forEach(
    (elem) => (elem.textContent = `${mStats.levels.Magic}`)
  );
  const image = document.createElement("img");
  image.src = monster.media;
  image.classList.add("combat-enemy-img");
  enemyStatHTMLElements.image.textContent = "";
  enemyStatHTMLElements.image.append(image);
  const enemySpecs = new EnemyAttackPassiveMenu(false);
  enemySpecs.render(mStats.passives, mStats.availableAttacks, mStats);
  $("#modal-view-monster-info").modal("show");
}
const changePage = (
  page,
  subCategory = -1,
  skill,
  showRaidShop = false,
  toggleSidebar = true
) => {
  var _a, _b, _c;
  let headerPage = page;
  switch (page.id) {
    case "melvorD:ActiveSkill":
      page = game.getPageForActiveAction();
      headerPage = page;
      break;
    case "melvorD:GolbinRaid":
      if (!game.tutorial.complete) {
        SwalLocale.fire({
          title: getLangString("TUTORIAL", "MINIGAME_LOCKED"),
          html: `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${cdnMedia(
            "assets/media/pets/golden_golbin.svg"
          )}"> ${getLangString("TUTORIAL", "GOLBIN_RAID_LOCKED")}</h5>
          <h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString(
            "TUTORIAL",
            "CONTINUE_TUTORIAL"
          )}</h5>`,
          icon: "warning",
        });
        return;
      }
      if (game.isGolbinRaid) {
        page = game.getPageForActiveAction();
      }
      break;
    case "melvorD:Combat":
      if (!game.tutorial.complete && !game.tutorial.allowCombat) {
        SwalLocale.fire({
          title: getLangString("TUTORIAL", "PAGE_LOCKED"),
          html: `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${cdnMedia(
            "assets/media/skills/combat/combat.svg"
          )}"> ${getLangString("TUTORIAL", "COMBAT_LOCKED")}</h5>
          <h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString(
            "TUTORIAL",
            "CONTINUE_TUTORIAL"
          )}</h5>`,
          icon: "warning",
        });
        return;
      }
      if (game.isGolbinRaid) {
        headerPage = game.getPageForActiveAction();
      }
      break;
  }
  if (
    skill === undefined &&
    page.id !== "melvorD:Combat" &&
    page.skills !== undefined
  )
    skill = page.skills[0];
  if (skill !== undefined && !skill.isUnlocked) {
    if (!game.tutorial.complete) {
      SwalLocale.fire({
        title: getLangString("MENU_TEXT", "SKILL_LOCKED"),
        html: `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${
          skill.media
        }"> ${templateString(getLangString("TUTORIAL", "SKILL_LOCKED"), {
          skillName: skill.name,
        })}</h5>
			<h5 class="font-w400 text-combat-smoke font-size-sm">${getLangString(
        "TUTORIAL",
        "CONTINUE_TUTORIAL"
      )}</h5>`,
        icon: "warning",
      });
    } else if (!cloudManager.hasFullVersionEntitlement && !isDemoSkill(skill)) {
      nativeManager.buyFullGameSwal(skill);
    } else if (game.currentGamemode.allowSkillUnlock) {
      const unlockCost = game.getSkillUnlockCost();
      SwalLocale.fire({
        title: getLangString("MENU_TEXT", "SKILL_LOCKED"),
        html: `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${
          skill.media
        }"> ${templateString(getLangString("TUTORIAL", "SKILL_LOCKED"), {
          skillName: skill.name,
        })}</h5>
			<h5 class="font-w400 text-combat-smoke font-size-sm">${templateString(
        getLangString("MENU_TEXT", "UNLOCK_FOR"),
        {
          gpIcon: `<img class="skill-icon-xs mr-1" src="assets/media/main/coins.svg">`,
          value: `${numberWithCommas(unlockCost)}`,
        }
      )}</h5>`,
        showCancelButton: true,
        icon: "warning",
        confirmButtonText: getLangString("MENU_TEXT", "UNLOCK"),
        showConfirmButton: game.gp.canAfford(unlockCost),
      }).then((result) => {
        if (!result.value) return;
        skill.unlockOnClick();
      });
    } else {
      SwalLocale.fire({
        title: getLangString("MENU_TEXT", "SKILL_LOCKED"),
        html: `<h5 class="font-w400 text-combat-smoke font-size-sm"><img class="skill-icon-xs mr-1" src="${
          skill.media
        }"> ${templateString(getLangString("TUTORIAL", "SKILL_LOCKED"), {
          skillName: skill.name,
        })}</h5>`,
        showCancelButton: true,
        icon: "warning",
        showConfirmButton: false,
      });
    }
    return;
  }
  if (game.openPage !== undefined) {
    $(`#${game.openPage.containerID}`).attr("class", "content d-none");
    if (
      ((_a = game.openPage.action) === null || _a === void 0
        ? void 0
        : _a.onPageLeave) !== undefined
    )
      game.openPage.action.onPageLeave();
  }
  $("#header-title").text(headerPage.name);
  $("#header-icon").attr("src", headerPage.media);
  $("#header-theme").attr(
    "class",
    `content-header ${headerPage.headerBgClass}`
  );
  $("#header-theme-alt").attr(
    "class",
    `${headerPage.headerBgClass} w-100 text-right pr-3`
  );
  $("#page-header").attr("class", headerPage.headerBgClass);
  game.openPage = page;
  $("#skill-footer-minibar-items-container").addClass("d-none");
  if (
    ((_b = page.action) === null || _b === void 0
      ? void 0
      : _b.onPageChange) !== undefined
  )
    page.action.onPageChange();
  switch (page.id) {
    case "melvorD:Shop":
      game.shop.renderQueue.costs = true;
      game.shop.renderQueue.requirements = true;
      if (showRaidShop) {
        shopMenu.showAllRaidTabs();
      } else {
        shopMenu.showAllTabsButRaid();
      }
      break;
    case "melvorD:Statistics":
      updateStats(selectedStatCategory);
      break;
    case "melvorD:CompletionLog":
      showCompletionCategory(subCategory);
      break;
  }
  if (toggleSidebar && !window.matchMedia("(min-width: 992px)").matches) {
    One.layout("sidebar_toggle");
  }
  game.renderQueue.combatMinibar = true;
  game.potions.renderRequired = true;
  if (skill === undefined || !skill.hasMinibar) game.minibar.setSkill();
  else game.minibar.setSkill(skill);
  window.scrollTo(0, 0);
  if (page.id === "melvorD:TutorialIsland" && !game.tutorial.complete) {
    $("#tutorial-container").addClass("d-none");
  } else if (!game.tutorial.complete) {
    $("#tutorial-container").removeClass("d-none");
  }
  $(`#${page.containerID}`).attr("class", "content");
  if (
    ((_c = page.action) === null || _c === void 0
      ? void 0
      : _c.onPageVisible) !== undefined
  )
    page.action.onPageVisible();
};
function readLore(loreID) {
  $("#modal-book-" + loreID).modal("show");
}
