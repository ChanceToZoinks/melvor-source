"use strict";
class CustomSkillMilestone {
  constructor(data) {
    this.level = data.level;
    this._media = data.media;
    this._name = data.name;
    this._milestoneID = data.milestoneID;
  }
  get name() {
    if (this._milestoneID !== undefined)
      return getLangString("MILESTONES", this._milestoneID);
    return this._name;
  }
  get media() {
    return cdnMedia(this._media);
  }
}
class EquipItemMilestone {
  constructor(data, game, skill) {
    this.level = 1;
    const item = game.items.equipment.getObjectByID(data.itemID);
    if (item === undefined)
      throw new UnregisteredConstructionError(
        this,
        EquipmentItem.name,
        data.itemID
      );
    this.item = item;
  }
  get name() {
    return this.item.name;
  }
  get media() {
    return this.item.media;
  }
  setLevel(skill) {
    let level = 1;
    this.item.equipRequirements.some((requirement) => {
      if (requirement.type === "SkillLevel" && requirement.skill === skill) {
        level = requirement.level;
        return true;
      }
      if (
        requirement.type === "AllSkillLevels" &&
        (requirement.exceptions === undefined ||
          !requirement.exceptions.has(skill))
      ) {
        level = requirement.level;
        return true;
      }
    });
    this.level = level;
  }
}
class SkillMasteryMilestone {
  constructor(skill) {
    this.skill = skill;
  }
  get level() {
    return 99;
  }
  get media() {
    return this.skill.media;
  }
  get name() {
    return getLangString("MILESTONES", "SKILL_MASTERY");
  }
}
class AgilityObstacleMilestone {
  constructor(tier) {
    this.tier = tier;
  }
  get level() {
    return game.agility.getObstacleLevel(this.tier);
  }
  get media() {
    return cdnMedia("assets/media/main/stamina.svg");
  }
  get name() {
    return templateLangString("MENU_TEXT", "OBSTACLE_NUMBER", {
      obstacleNumber: numberWithCommas(this.tier + 1),
    });
  }
}
class AgilityPillarMilestone {
  constructor(agility) {
    this.agility = agility;
  }
  get level() {
    return 99;
  }
  get media() {
    return this.agility.media;
  }
  get name() {
    return getLangString("MENU_TEXT", "PASSIVE_PILLAR");
  }
}
class AgilityElitePillarMilestone {
  constructor(agility) {
    this.agility = agility;
  }
  get level() {
    return 120;
  }
  get media() {
    return this.agility.media;
  }
  get name() {
    return getLangString("MENU_TEXT", "ELITE_PASSIVE_PILLAR");
  }
}
class SlayerAreaMilestone {
  constructor(area, level) {
    this.area = area;
    this.level = level;
  }
  get name() {
    return this.area.name;
  }
  get media() {
    return this.area.media;
  }
}
