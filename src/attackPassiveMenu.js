"use strict";
class EnemyAttackPassiveMenu {
  constructor(isCombat) {
    this.container = document.getElementById("combat-enemy-special-attack");
    this.passiveContainer = document.getElementById(
      "combat-enemy-passive-desc"
    );
    this.attackContainer = document.getElementById(
      "combat-enemy-special-attack-desc"
    );
    this.maxhitSpans = [];
    if (!isCombat) {
      this.container = document.getElementById(
        "modal-combat-enemy-special-attack"
      );
      this.passiveContainer = document.getElementById(
        "modal-combat-enemy-passive-desc"
      );
      this.attackContainer = document.getElementById(
        "modal-combat-enemy-special-attack-desc"
      );
    }
    this.passiveDescCont = createElement("h5", {
      classList: [
        "font-w400",
        "font-size-sm",
        "text-combat-smoke",
        "m-1",
        "mb-2",
      ],
    });
    this.passiveContainer.textContent = "";
    this.passiveContainer.append(
      createElement("h5", {
        classList: [
          "font-w700",
          "font-size-sm",
          "text-warning",
          "m-1",
          "mb-2",
          "mt-3",
        ],
        text: getLangString("MENU_TEXT", "ENEMY_PASSIVES"),
      }),
      this.passiveDescCont
    );
    this.attackDescCont = createElement("div");
    this.attackContainer.textContent = "";
    this.attackContainer.append(
      createElement("h5", {
        classList: ["font-w700", "font-size-sm", "text-danger", "m-1", "mb-2"],
        text: getLangString("MENU_TEXT", "ENEMY_SPECIAL_ATTACKS"),
      }),
      this.attackDescCont
    );
  }
  render(passives, attackSelection, character) {
    const hidePassives = this.renderPassives(passives);
    const hideAttacks = this.renderAttacks(attackSelection, character);
    if (!hidePassives || !hideAttacks) {
      showElement(this.container);
    } else {
      this.hide();
    }
  }
  renderMaxhits(attackSelection, character) {
    if (!this.shouldHideAttacks(attackSelection)) {
      this.maxhitSpans.forEach((span, i) => {
        span.textContent = this.getAttackMaxHitText(
          attackSelection[i].attack,
          character
        );
      });
    }
  }
  renderPassives(passives) {
    let hidePassives = true;
    passives.forEach((activeData) => {
      if (activeData.display) hidePassives = false;
    });
    if (hidePassives) {
      this.hidePassives();
    } else {
      showElement(this.passiveContainer);
      this.passiveDescCont.textContent = "";
      passives.forEach((activeData, passive) => {
        if (activeData.display) {
          this.passiveDescCont.append(
            createElement("strong", { text: passive.name }),
            document.createTextNode(` - ${passive.description}`),
            createElement("div", { classList: ["dropdown-divider"] })
          );
        }
      });
    }
    return hidePassives;
  }
  hidePassives() {
    hideElement(this.passiveContainer);
  }
  shouldHideAttacks(attackSelection) {
    return (
      attackSelection.length === 1 &&
      attackSelection[0].attack === game.normalAttack
    );
  }
  renderAttacks(attackSelection, character) {
    const hideAttacks = this.shouldHideAttacks(attackSelection);
    this.maxhitSpans = [];
    if (hideAttacks) {
      this.hideAttacks();
    } else {
      showElement(this.attackContainer);
      this.attackDescCont.textContent = "";
      attackSelection.forEach((selection) => {
        const hitSpan = createElement("span", {
          classList: ["font-w600"],
          text: this.getAttackMaxHitText(selection.attack, character),
        });
        const maxHitSpan = createElement("span", {
          classList: ["font-w400", "text-info"],
          text: " ",
        });
        maxHitSpan.append(
          ...templateLangStringWithNodes(
            "MENU_TEXT",
            "MAX_HIT",
            { value: hitSpan },
            {},
            false
          )
        );
        this.attackDescCont.append(
          createElement("strong", { text: selection.attack.name }),
          document.createTextNode(` (${formatPercent(selection.chance)}) - `),
          ...jQuery.parseHTML(selection.attack.description),
          maxHitSpan,
          createElement("div", { classList: ["dropdown-divider"] })
        );
        this.maxhitSpans.push(hitSpan);
      });
    }
    return hideAttacks;
  }
  getAttackMaxHitText(attack, character) {
    return `(${character.getAttackMaxDamage(attack)})`;
  }
  hideAttacks() {
    hideElement(this.attackContainer);
  }
  hide() {
    hideElement(this.container);
  }
}
