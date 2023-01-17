"use strict";
class EffectRenderer {
  constructor(container) {
    this.container = container;
    this.renderedEffects = new Map();
    this.removalQueue = new Set();
  }
  removeEffects() {
    this.removalQueue.forEach((dataToRemove) => {
      const renderedEffect = this.renderedEffects.get(dataToRemove);
      if (renderedEffect !== undefined) {
        this.container.removeChild(renderedEffect.container);
        renderedEffect.tooltip.destroy();
        this.renderedEffects.delete(dataToRemove);
      }
    });
    this.flushRemovalQueue();
  }
  flushRemovalQueue() {
    this.removalQueue.clear();
  }
  createEffect(icon, turns, tooltipContent) {
    const container = document.createElement("div");
    container.classList.add("overlay-container", "overlay-bottom");
    const image = document.createElement("img");
    image.classList.add("mastery-icon-sm", "mr-2");
    image.src = icon;
    const text = document.createElement("div");
    text.classList.add("overlay-item", "mr-1", "font-w700");
    text.textContent = turns;
    container.appendChild(image);
    container.appendChild(text);
    this.container.appendChild(container);
    return {
      container: container,
      icon: image,
      number: text,
      tooltip: this.createTooltip(container, tooltipContent),
    };
  }
  createTooltip(element, content) {
    return tippy(element, {
      content: content,
      allowHTML: true,
      placement: "bottom",
      interactive: false,
      animation: false,
    });
  }
  addEffect(data, turnText, tooltipContent, media) {
    const existingEffect = this.renderedEffects.get(data);
    if (existingEffect === undefined) {
      const newEffect = this.createEffect(media, turnText, tooltipContent);
      this.renderedEffects.set(data, newEffect);
    } else {
      existingEffect.number.textContent = turnText;
      existingEffect.tooltip.setContent(tooltipContent);
    }
  }
  addDOT(activeDOT) {
    const turnText = `${activeDOT.procsLeft}`;
    const damageText = templateLangString(
      "COMBAT_MISC",
      activeDOT.type === "Regen" ? "DOT_HEALING_DESC" : "DOT_DAMAGE_DESC",
      {
        amount: `${activeDOT.damage}`,
        interval: `${activeDOT.interval / 1000}`,
      }
    );
    const procText = templateLangString(
      "COMBAT_MISC",
      activeDOT.procsLeft === 1 ? "ONE_PROC_LEFT" : "PROCS_LEFT",
      {
        count: `${activeDOT.procsLeft}`,
        interval: `${(activeDOT.procsLeft * activeDOT.interval) / 1000}`,
      }
    );
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${activeDOT.type}</span><br>
      <span>${damageText}</span><br>
      <span>${procText}</span>
    </div>`;
    this.addEffect(
      activeDOT,
      turnText,
      tooltipContent,
      dotMedia[activeDOT.type]
    );
  }
  addModifier(activeEffect, effect, attack, turnNoun) {
    let turnText;
    let turnTooltip;
    if (activeEffect.turnsLeft === Infinity) {
      if (effect.maxStacks > 1) {
        turnText = `${activeEffect.stacks}`;
        turnTooltip = templateLangString(
          "COMBAT_MISC",
          activeEffect.stacks === 1
            ? "LASTS_UNTIL_END_ONE_STACK"
            : "LASTS_UNTIL_END_STACKS",
          { count: `${activeEffect.stacks}` }
        );
      } else {
        turnText = ``;
        turnTooltip = getLangString("COMBAT_MISC", "LASTS_UNTIL_END");
      }
    } else {
      turnText = `${activeEffect.turnsLeft}`;
      let langID;
      if (turnNoun === youNoun) {
        langID = "YOUR_TURNS_LEFT";
      } else if (activeEffect.turnsLeft === 1) {
        langID = "ONE_ENEMY_TURN_LEFT";
      } else {
        langID = "ENEMY_TURNS_LEFT";
      }
      turnTooltip = templateLangString("COMBAT_MISC", langID, {
        count: `${activeEffect.turnsLeft}`,
      });
    }
    let name;
    switch (effect) {
      case afflictionEffect:
        name = getLangString("COMBAT_MISC", "AFFLICTION");
        break;
      case frostBurnEffect:
        name = getLangString("COMBAT_MISC", "FROSTBURN");
        break;
      case shockEffect:
        name = getLangString("PASSIVES", "NAME_Shocked");
        break;
      case darkBladeEffect:
        name = getLangString("PASSIVES", "NAME_DarkBlade");
        break;
      case absorbingSkinEffect:
        name = getLangString("PASSIVES", "NAME_AbsorbingSkin");
        break;
      case rageEffect:
        name = getLangString("PASSIVES", "NAME_Rage");
        break;
      case assassinEffect:
        name = getLangString("PASSIVES", "NAME_Assassin");
        break;
      case dualityEffect:
        name = getLangString("PASSIVES", "NAME_Duality");
        break;
      case growingMadnessEffect:
        name = getLangString("PASSIVES", "NAME_GrowingMadness");
        break;
      case momentInTimeEffect:
        name = getLangString("PASSIVES", "NAME_MomentInTime");
        break;
      case reignOverTimeEffect:
        name = getLangString("PASSIVES", "NAME_ReignOverTime");
        break;
      case decreasedEvasionStackingEffect:
        name = getLangString("COMBAT_MISC", "EVASION_DECREASED");
        break;
      case shadowCloakEffect:
        name = getLangString("ITEM_NAME", "Shadow_Cloak");
        break;
      case increased5DROnHitEffect:
        name = getLangString("COMBAT_MISC", "PROTECTED");
        break;
      default:
        if (effect instanceof SlowEffect) {
          name = getLangString("COMBAT_MISC", "SLOWED");
        } else if (effect instanceof EndOfTurnEvasionEffect) {
          name = getLangString("SLAYER_AREA", "NAME_MidnightValley");
        } else {
          name = attack.name;
        }
    }
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${name}</span><br>
      ${getModifierDataSpans(
        effect.modifiers,
        activeEffect.stacks,
        activeEffect.stacks
      ).join("<br>")}<br>
      <span>${turnTooltip}</span>
    </div>`;
    this.addEffect(activeEffect, turnText, tooltipContent, effect.media);
  }
  addSleep(activeSleep) {
    const turnText = `${activeSleep.turns}`;
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${getLangString(
        "COMBAT_MISC",
        "SLEEPING"
      )}</span><br>
      <span>${getLangString("COMBAT_MISC", "CANNOT_ATTACK_OR_EVADE")}</span><br>
      <span class="text-danger">${templateLangString(
        "COMBAT_MISC",
        "INCREASED_DAMAGE_TAKEN",
        { value: `${20}` }
      )}</span><br>
      <span>${this.formatTurnsLeft(activeSleep.turns)}</span>
    </div>`;
    this.addEffect(activeSleep, turnText, tooltipContent, effectMedia.sleep);
  }
  addStun(activeStun) {
    const turnText = `${activeStun.turns}`;
    let title;
    let media;
    switch (activeStun.flavour) {
      case "Stun":
        title = getLangString("COMBAT_MISC", "STUNNED");
        media = effectMedia.stun;
        break;
      case "Freeze":
        title = getLangString("COMBAT_MISC", "FROZEN");
        media = effectMedia.frozen;
        break;
    }
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${title}</span><br>
      <span>${getLangString("COMBAT_MISC", "CANNOT_ATTACK_OR_EVADE")}</span><br>
      <span class="text-danger">${templateLangString(
        "COMBAT_MISC",
        "INCREASED_DAMAGE_TAKEN",
        { value: `${30}` }
      )}</span><br>
      <span>${this.formatTurnsLeft(activeStun.turns)}</span>
    </div>`;
    this.addEffect(activeStun, turnText, tooltipContent, media);
  }
  addStunImmunity(stunImmunity) {
    const turnText = `${stunImmunity.turns}`;
    const title = "Stun Immunity";
    const media = effectMedia.stunImmunity;
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${title}</span><br>
      <span>Immune to Stuns</span><br>
      <span>${this.formatTurnsLeft(stunImmunity.turns)}</span>
    </div>`;
    this.addEffect(stunImmunity, turnText, tooltipContent, media);
  }
  formatTurnsLeft(turns) {
    return templateLangString(
      "COMBAT_MISC",
      turns === 1 ? "ONE_TURN_LEFT" : "TURNS_LEFT",
      { count: `${turns}` }
    );
  }
  formatStacks(stacks, max) {
    if (max !== undefined) {
      return templateLangString(
        "COMBAT_MISC",
        stacks === 1 ? "ONE_STACK_WITH_MAX" : "STACKS_WITH_MAX",
        { count: `${stacks}`, max: `${max}` }
      );
    } else {
      return templateLangString(
        "COMBAT_MISC",
        stacks === 1 ? "ONE_STACK" : "STACKS",
        { count: `${stacks}` }
      );
    }
  }
  addCurse(activeCurse) {
    const curse = activeCurse.data;
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${curse.name}</span><br>
      ${getModifierDataSpans(curse.targetModifiers).join("<br>")}<br>
      <span>${this.formatTurnsLeft(activeCurse.turns)}</span>
    </div>`;
    const turnText = `${activeCurse.turns}`;
    this.addEffect(activeCurse, turnText, tooltipContent, curse.media);
  }
  addReflexive(activeReflexive, effect, attack) {
    let turnSpan;
    if (activeReflexive.turnsLeft === Infinity)
      turnSpan = getLangString("COMBAT_MISC", "LASTS_UNTIL_END");
    else if (activeReflexive.turnsLeft === 1)
      turnSpan = getLangString("COMBAT_MISC", "LASTS_UNTIL_END_OF_ATTACK");
    else if (activeReflexive.turnsLeft === 2)
      turnSpan = getLangString("COMBAT_MISC", "LASTS_FOR_1_MORE_TURN");
    else
      turnSpan = templateLangString("COMBAT_MISC", "LASTS_FOR_TURNS", {
        count: `${activeReflexive.turnsLeft - 1}`,
      });
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${effect.name}</span><br>
      ${getModifierDataSpans(
        effect.modifiers,
        activeReflexive.stacks,
        activeReflexive.stacks
      ).join("<br>")}<br>
      <span>${this.formatStacks(
        activeReflexive.stacks,
        effect.maxStacks
      )}</span><br>
      <span>${getLangString("COMBAT_MISC", "STACK_GAINED_WHEN_HIT")}</span><br>
      <span>${turnSpan}</span>
    </div>`;
    const turnText = `${activeReflexive.stacks}`;
    this.addEffect(activeReflexive, turnText, tooltipContent, effect.media);
  }
  addStacking(activeStacking, effect) {
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${effect.name}</span><br>
      ${getModifierDataSpans(effect.modifiers).join("<br>")}<br>
      <span>${this.formatStacks(activeStacking.stacks)}</span>
      <span>${getLangString("COMBAT_MISC", "STACKS_REMOVED_PER_TURN")}</span>
    </div>`;
    const turnText = `${activeStacking.stacks}`;
    this.addEffect(activeStacking, turnText, tooltipContent, effect.media);
  }
  addCombo(activeCombo, effect) {
    const tooltipContent = `
    <div class="text-center">
      <span class="text-warning">${activeCombo.sourceAttack.name}</span><br>
      ${getModifierDataSpans(
        effect.modifiers,
        activeCombo.stacks,
        activeCombo.stacks
      ).join("<br>")}<br>
      <span>${this.formatStacks(activeCombo.stacks)}</span>
      <span>${getLangString("COMBAT_MISC", "STACKS_REMOVED_ON_MISS")}</span>
    </div>`;
    const turnText = `${activeCombo.stacks}`;
    this.addEffect(activeCombo, turnText, tooltipContent, effect.media);
  }
  queueRemoval(data) {
    if (this.renderedEffects.get(data)) this.removalQueue.add(data);
  }
  queueRemoveAll() {
    this.renderedEffects.forEach((_, data) => {
      this.queueRemoval(data);
    });
  }
}
const effectMedia = {
  offenseUp: "assets/media/status/attack_increase.svg",
  defenseUp: "assets/media/status/evasion_increase.svg",
  offenseDown: "assets/media/status/attack_decrease.svg",
  defenseDown: "assets/media/status/evasion_decrease.svg",
  frozen: "assets/media/status/frozen.svg",
  stun: "assets/media/status/stunned.svg",
  sleep: "assets/media/status/sleep.svg",
  slowed: "assets/media/status/slowed.svg",
  markOfDeath: "assets/media/misc/mark_of_death.svg",
  afflicted: "assets/media/misc/afflicted.svg",
  speedup: "assets/media/status/speedup.svg",
  frostBurn: "assets/media/status/frostburn.svg",
  decay: "assets/media/skills/magic/decay.svg",
  madness: "assets/media/bank/Mask_of_Madness.png",
  torment: "assets/media/bank/Mask_of_Torment.png",
  despair: "assets/media/bank/Mask_of_Despair.png",
  stunImmunity: "assets/media/status/stun_immunity.svg",
  shocked: "assets/media/status/shocked.svg",
};
const dotMedia = {
  Burn: "assets/media/main/burn.svg",
  Bleed: "assets/media/misc/blood.svg",
  Poison: "assets/media/status/poison.svg",
  Regen: "assets/media/status/regen_increase.svg",
  DeadlyPoison: "assets/media/status/poison.svg",
};
