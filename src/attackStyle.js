"use strict";
class AttackStyle extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this.modifiers = game.getPlayerModifiersFromData(data.modifiers);
    this.experienceGain = data.experienceGain.map(({ skillID, ratio }) => {
      const skill = game.skills.getObjectByID(skillID);
      if (skill === undefined)
        throw new Error(
          `Error constructing attack style. Skill with ID: ${skillID} is not registered.`
        );
      return { skill, ratio };
    });
    this.attackType = data.attackType;
    this._name = data.name;
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("COMBAT_MISC", `ATTACK_STYLE_NAME_${this.localID}`);
    }
  }
  get toolTipContent() {
    let tooltip = `<div class='text-center'>${getLangString(
      "MENU_TEXT",
      "TRAINS"
    )}<br><span class='text-success'>${joinAsList(
      this.experienceGain.map(({ skill }) => skill.name)
    )}</span>`;
    const modDesc = describeModifierDataPlain(this.modifiers);
    if (modDesc !== "")
      tooltip += `<br>${getLangString(
        "MENU_TEXT",
        "PROVIDES"
      )}<br><span class='text-info'>${modDesc}</span>`;
    tooltip += "</div>";
    return tooltip;
  }
  get buttonID() {
    return `combat-attack-style-button-${this.id}`;
  }
}
