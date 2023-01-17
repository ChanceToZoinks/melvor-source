"use strict";
class CombatSkill extends Skill {
  get isCombat() {
    return true;
  }
  get hasMinibar() {
    return false;
  }
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.game.combat.player.computeAllStats();
  }
}
class Attack extends CombatSkill {
  constructor(namespace, game) {
    super(namespace, "Attack", game);
    this._media = "assets/media/skills/attack/attack.svg";
    this.renderQueue = new SkillRenderQueue();
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortMilestones();
  }
}
class Strength extends CombatSkill {
  constructor(namespace, game) {
    super(namespace, "Strength", game);
    this._media = "assets/media/skills/strength/strength.svg";
    this.renderQueue = new SkillRenderQueue();
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortMilestones();
  }
}
class Defence extends CombatSkill {
  constructor(namespace, game) {
    super(namespace, "Defence", game);
    this._media = "assets/media/skills/defence/defence.svg";
    this.renderQueue = new SkillRenderQueue();
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortMilestones();
  }
}
class Hitpoints extends CombatSkill {
  constructor(namespace, game) {
    super(namespace, "Hitpoints", game);
    this._media = "assets/media/skills/hitpoints/hitpoints.svg";
    this.renderQueue = new SkillRenderQueue();
  }
  get tutorialLevelCap() {
    return 10;
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortMilestones();
  }
  get startingLevel() {
    return 10;
  }
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.game.combat.player.heal((newLevel - oldLevel) * numberMultiplier);
  }
}
class Ranged extends CombatSkill {
  constructor(namespace, game) {
    super(namespace, "Ranged", game);
    this._media = "assets/media/skills/ranged/ranged.svg";
    this.renderQueue = new SkillRenderQueue();
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.sortMilestones();
  }
}
class PrayerRenderQueue extends SkillRenderQueue {
  constructor() {
    super(...arguments);
    this.prayerMenu = false;
  }
}
class Prayer extends CombatSkill {
  constructor(namespace, game) {
    super(namespace, "Prayer", game);
    this._media = "assets/media/skills/prayer/prayer.svg";
    this.renderQueue = new PrayerRenderQueue();
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.milestones.push(...this.game.prayers.allObjects);
    this.sortMilestones();
  }
  render() {
    super.render();
    this.renderPrayerMenu();
  }
  renderPrayerMenu() {
    if (!this.renderQueue.prayerMenu) return;
    combatMenus.prayer.updateForLevel(this.level, this.game.combat.player);
    this.renderQueue.prayerMenu = false;
  }
  onLevelUp(oldLevel, newLevel) {
    super.onLevelUp(oldLevel, newLevel);
    this.renderQueue.prayerMenu = true;
  }
}
class Slayer extends CombatSkill {
  constructor(namespace, game) {
    super(namespace, "Slayer", game);
    this._media = "assets/media/skills/slayer/slayer.svg";
    this.renderQueue = new SkillRenderQueue();
  }
  postDataRegistration() {
    super.postDataRegistration();
    this.game.slayerAreas.forEach((area) => {
      let level = 1;
      const isMilestone = area.entryRequirements.some((requirement) => {
        switch (requirement.type) {
          case "AllSkillLevels":
            level = requirement.level;
            return true;
          case "SkillLevel":
            if (requirement.skill === this) {
              level = requirement.level;
              return true;
            }
        }
        return false;
      });
      if (isMilestone)
        this.milestones.push(new SlayerAreaMilestone(area, level));
    });
    this.sortMilestones();
  }
}
