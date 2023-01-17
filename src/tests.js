"use strict";
function timeFunctionCall(func, numCalls = 1) {
  const tStart = performance.now();
  for (let i = 0; i < numCalls; i++) {
    func();
  }
  const tEnd = performance.now();
  console.log(
    `Took ${tEnd - tStart}ms to run function ${numCalls} time${pluralS(
      numCalls
    )}`
  );
  return tEnd - tStart;
}
function deleteAllSaves() {
  for (let i = 0; i < 5; i++) {
    deleteLocalSaveInSlot(i);
  }
}
function testModifierDataDescriptions() {
  Object.entries(modifierData).forEach((entry) => {
    let printed;
    if (isSkillEntry(entry)) {
      [printed] = printPlayerModifier(entry[0], {
        skill: game.woodcutting,
        value: 0,
      });
    } else {
      [printed] = printPlayerModifier(entry[0], 69);
    }
    if (printed.includes("${"))
      console.log(`${entry[0]} has template components`);
    if (printed.includes("undefined")) console.log(`${entry[0]} has undefined`);
  });
}
function allItems(qty) {
  if (DEBUGENABLED)
    game.items.forEach((item) =>
      game.bank.addItem(item, qty, false, true, true)
    );
}
function testLevelCalculations(numTrials = 1000) {
  const randomXP = [];
  let totalXP = 0;
  while (totalXP < exp.level_to_xp(99)) {
    const randXP = Math.random() * 500;
    totalXP += randXP;
    randomXP.push(totalXP);
  }
  const testLevelA = () => {
    let level = 0;
    randomXP.forEach((xp) => {
      level = exp.xp_to_level(xp, level) - 1;
    });
  };
  const testLevelB = () => {
    let level = 0;
    randomXP.forEach((xp) => {
      level = exp.xpToLevel(xp);
    });
  };
  console.log("First Method");
  const t1 = timeFunctionCall(testLevelA, numTrials);
  console.log(
    `Time per call: ${(t1 / numTrials / randomXP.length) * 1000000}ns`
  );
  console.log("Second Method");
  const t2 = timeFunctionCall(testLevelB, numTrials);
  console.log(
    `Time per call: ${(t2 / numTrials / randomXP.length) * 1000000}ns`
  );
  console.log("Validating second method");
  const validate = () => {
    randomXP.every((xp) => {
      const level1 = exp.xp_to_level(xp) - 1;
      const level2 = exp.xpToLevel(xp);
      if (level1 !== level2) {
        console.log(xp);
        return false;
      }
      return true;
    });
  };
  validate();
}
function testDataTranslations() {
  game.gamemodes.forEach((gamemode) => {
    gamemode.name;
    gamemode.description;
    gamemode.rules;
  });
  game.items.forEach((item) => {
    item.name;
    item.description;
  });
  game.attackStyles.forEach((style) => {
    style.name;
  });
  game.stackingEffects.forEach((effect) => {
    effect.name;
  });
  game.specialAttacks.forEach((attack) => {
    attack.name;
    attack.description;
  });
  game.combatPassives.forEach((passive) => {
    passive.name;
    passive.description;
  });
  game.monsters.forEach((monster) => {
    monster.name;
    monster.description;
  });
  game.combatAreas.forEach((area) => {
    area.name;
  });
  game.slayerAreas.forEach((area) => {
    area.name;
    area.areaEffectDescription;
  });
  game.dungeons.forEach((dungeon) => {
    dungeon.name;
  });
  game.prayers.forEach((prayer) => {
    prayer.name;
  });
  game.standardSpells.forEach((spell) => {
    spell.name;
  });
  game.curseSpells.forEach((curse) => {
    curse.name;
  });
  game.auroraSpells.forEach((spell) => {
    spell.name;
  });
  game.ancientSpells.forEach((spell) => {
    spell.name;
  });
  game.archaicSpells.forEach((spell) => {
    spell.name;
  });
  game.pets.forEach((pet) => {
    pet.name;
    pet.acquiredBy;
    pet.description;
  });
  game.shop.purchases.forEach((purchase) => {
    purchase.name;
    purchase.description;
  });
  game.shop.upgradeChains.forEach((chain) => {
    chain.chainName;
    chain.defaultName;
    chain.defaultDescription;
  });
  game.tutorial.stages.forEach((stage) => {
    stage.name;
    stage.description;
    stage.tasks.forEach((task) => {
      task.description;
    });
  });
  game.pages.forEach((page) => {
    page.name;
  });
  game.lore.books.forEach((book) => {
    book.title;
  });
  game.skills.forEach((skill) => {
    skill.testTranslations();
  });
}
function validateSkillcapeStats(superior = false) {
  const skillCapes = game.items.equipment.filter((item) => {
    return (
      item.localID.endsWith("_Skillcape") &&
      item.localID.startsWith("Superior_") === superior &&
      !item.localID.includes("Max")
    );
  });
  const maxCape = game.items.equipment.getObjectByID(
    superior ? "melvorTotH:Superior_Max_Skillcape" : "melvorF:Max_Skillcape"
  );
  const compCape = game.items.equipment.getObjectByID(
    superior
      ? "melvorTotH:Superior_Cape_Of_Completion"
      : "melvorF:Cape_of_Completion"
  );
  const equipStats = {};
  const modifiers = {};
  skillCapes.forEach((cape) => {
    cape.equipmentStats.forEach((stat) => {
      if (equipStats[stat.key] === undefined) equipStats[stat.key] = stat.value;
      else equipStats[stat.key] = Math.max(stat.value, equipStats[stat.key]);
    });
    if (cape.modifiers !== undefined) {
      Object.entries(cape.modifiers).forEach((modEntry) => {
        if (isSkillEntry(modEntry)) {
          let skillEntry = modifiers[modEntry[0]];
          if (skillEntry === undefined) {
            skillEntry = [];
            modifiers[modEntry[0]] = skillEntry;
          }
          modEntry[1].forEach((skillMod) => {
            skillEntry === null || skillEntry === void 0
              ? void 0
              : skillEntry.push({
                  skill: skillMod.skill,
                  value: skillMod.value,
                });
          });
        } else {
          modifiers[modEntry[0]] = modEntry[1];
        }
      });
    }
  });
  maxCape.equipmentStats.forEach((stat) => {
    if (
      equipStats[stat.key] !== stat.value &&
      !equipStats[stat.key] === undefined
    )
      console.log(
        `Max Cape Error: ${stat.key} is ${stat.value} but capes have ${
          equipStats[stat.key]
        }`
      );
  });
  compCape.equipmentStats.forEach((stat) => {
    if (
      equipStats[stat.key] !== stat.value &&
      !equipStats[stat.key] === undefined
    )
      console.log(
        `Comp Cape Error: ${stat.key} is ${stat.value} but capes have ${
          equipStats[stat.key]
        }`
      );
  });
  Object.entries(modifiers).forEach((entry) => {
    if (isSkillEntry(entry)) {
      const maxMod = maxCape.modifiers[entry[0]];
      if (maxMod === undefined) console.log(`Max Cape is missing: ${entry[0]}`);
      else {
        entry[1].forEach(({ skill, value }) => {
          const maxSkillMod = maxMod.find(
            (maxSkillMod) => maxSkillMod.skill === skill
          );
          if (maxSkillMod === undefined)
            console.log(
              `Max Cape is missing: ${entry[0]} for ${skill.name} at value ${value}`
            );
          else if (maxSkillMod.value !== value)
            console.log(
              `Max Cape ${entry[0]} for ${skill.name} is ${maxSkillMod.value} but capes have ${value}`
            );
        });
      }
    } else {
      if (maxCape.modifiers[entry[0]] === undefined)
        console.log(`Max Cape is missing: ${entry[0]}: ${entry[1]}`);
      else if (maxCape.modifiers[entry[0]] !== entry[1])
        console.log(
          `Max Cape ${entry[0]} is ${
            maxCape.modifiers[entry[0]]
          } but capes have ${entry[1]}`
        );
    }
  });
  Object.entries(modifiers).forEach((entry) => {
    if (isSkillEntry(entry)) {
      const maxMod = compCape.modifiers[entry[0]];
      if (maxMod === undefined)
        console.log(`Comp Cape is missing: ${entry[0]}`);
      else {
        entry[1].forEach(({ skill, value }) => {
          const maxSkillMod = maxMod.find(
            (maxSkillMod) => maxSkillMod.skill === skill
          );
          if (maxSkillMod === undefined)
            console.log(
              `Comp Cape is missing: ${entry[0]} for ${skill.name} at value ${value}`
            );
          else if (maxSkillMod.value !== value)
            console.log(
              `Comp Cape ${entry[0]} for ${skill.name} is ${maxSkillMod.value} but capes have ${value}`
            );
        });
      }
    } else {
      if (compCape.modifiers[entry[0]] === undefined)
        console.log(`Comp Cape is missing: ${entry[0]}: ${entry[1]}`);
      else if (compCape.modifiers[entry[0]] !== entry[1])
        console.log(
          `Comp Cape ${entry[0]} is ${
            compCape.modifiers[entry[0]]
          } but capes have ${entry[1]}`
        );
    }
  });
}
