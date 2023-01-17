"use strict";
function getRequirementNodes(requirement, imageClass) {
  const createImage = (media) =>
    createElement("img", {
      className: imageClass,
      attributes: [["src", media]],
    });
  switch (requirement.type) {
    case "SkillLevel":
      return templateLangStringWithNodes(
        "MENU_TEXT",
        "REQUIRES_SKILL_LEVEL",
        { skillImage: createImage(requirement.skill.media) },
        { level: `${requirement.level}` }
      );
    case "AllSkillLevels":
      if (requirement.exceptions !== undefined) {
        return [
          templateLangString("MENU_TEXT", "REQUIRES_ALL_SKILL_EXCEPTION", {
            level: `${requirement.level}`,
            skillNames: joinAsList(
              [...requirement.exceptions].map((skill) => skill.name)
            ),
          }),
        ];
      } else {
        return [
          templateLangString("MENU_TEXT", "REQUIRES_ALL_SKILL", {
            level: `${requirement.level}`,
          }),
        ];
      }
    case "DungeonCompletion":
      return templateLangStringWithNodes(
        "MENU_TEXT",
        requirement.count > 1
          ? "COMPLETE_DUNGEON_TIMES"
          : "COMPLETE_DUNGEON_ONCE",
        { dungeonImage: createImage(requirement.dungeon.media) },
        { dungeonName: requirement.dungeon.name, count: `${requirement.count}` }
      );
    case "Completion":
      return [
        templateLangString(
          "MENU_TEXT",
          requirement.namespace.isModded
            ? "REQUIRES_COMPLETION_MOD"
            : `REQUIRES_COMPLETION_${requirement.namespace.name}`,
          {
            percent: `${requirement.percent}`,
            modName: requirement.namespace.displayName,
          }
        ),
      ];
    case "ShopPurchase":
      return templateLangStringWithNodes(
        "MENU_TEXT",
        "SHOP_ITEM_PURCHASED",
        { shopImage: createImage(requirement.purchase.media) },
        { shopName: requirement.purchase.name }
      );
    case "SlayerItem":
      return [
        createImage(requirement.item.media),
        getLangString("COMBAT_MISC", "110"),
      ];
    case "SlayerTask": {
      const currentCount =
        game.combat.slayerTask.getTaskCompletionsForTierAndAbove(
          requirement.tier
        );
      return [
        templateLangString(
          "MENU_TEXT",
          `UNLOCK_SLAYER_${SlayerTask.data[requirement.tier].engDisplay}`,
          { count: `${Math.max(requirement.count - currentCount, 0)}` }
        ),
      ];
    }
    case "ItemFound":
      return templateLangStringWithNodes(
        "MENU_TEXT",
        "FIND_ITEM",
        { itemImage: createImage(requirement.item.media) },
        { itemName: requirement.item.name }
      );
    case "MonsterKilled":
      return templateLangStringWithNodes(
        "MENU_TEXT",
        requirement.count > 1 ? "DEFEAT_MONSTER_TIMES" : "DEFEAT_MONSTER_ONCE",
        { monsterImage: createImage(requirement.monster.media) },
        { monsterName: requirement.monster.name, count: `${requirement.count}` }
      );
    case "TownshipTask":
      return [
        templateLangString("MENU_TEXT", "REQUIRES_TOWNSHIP_TASKS", {
          count: `${requirement.count}`,
        }),
      ];
    case "TownshipTutorialTask":
      return [""];
    case "TownshipBuilding":
      return [
        templateLangString("MENU_TEXT", "REQUIRES_TOWNSHIP_BUILDINGS", {
          count: `${requirement.count}`,
          buildingName: `${requirement.building.name}`,
        }),
      ];
  }
}
