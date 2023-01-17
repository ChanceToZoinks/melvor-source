"use strict";
class SkillProgressDisplay {
  constructor(game) {
    this.game = game;
    this.elems = new Map();
    game.skills.forEach((skill) => {
      const elems = {
        level: [document.getElementById(`skill-progress-level-${skill.id}`)],
        percent: [],
        xp: [document.getElementById(`skill-progress-xp-${skill.id}`)],
        progress: [document.getElementById(`skill-progress-bar-${skill.id}`)],
        tooltip: [],
      };
      const tooltipBar = document.getElementById(
        `skill-progress-xp-tooltip-${skill.id}`
      );
      if (tooltipBar !== null) {
        const tooltip = this.createTooltip(tooltipBar, "Test");
        elems.tooltip.push(tooltip);
      }
      const percent = document.getElementById(
        `skill-progress-percent-${skill.id}`
      );
      if (percent !== null) elems.percent.push(percent);
      if (skill.id === "melvorD:Magic") {
        elems.level.push(
          document.getElementById(`skill-progress-level-${skill.id}-1`)
        );
        elems.xp.push(
          document.getElementById(`skill-progress-xp-${skill.id}-1`)
        );
        elems.progress.push(
          document.getElementById(`skill-progress-bar-${skill.id}-1`)
        );
      }
      this.elems.set(skill, elems);
    });
  }
  updateXP(skill) {
    const skillElems = this.getSkillElements(skill);
    const xp = skill.xp;
    const level = this.game.settings.showVirtualLevels
      ? skill.virtualLevel
      : skill.level;
    let xpText = `${numberWithCommas(Math.floor(xp))}`;
    if (level < skill.levelCap) {
      xpText = `${xpText} / ${numberWithCommas(exp.level_to_xp(level + 1))}`;
    }
    const progress = skill.nextLevelProgress;
    skillElems.percent.forEach(
      (elem) => (elem.textContent = formatPercent(Math.floor(progress)))
    );
    skillElems.xp.forEach((elem) => (elem.textContent = xpText));
    skillElems.progress.forEach((elem) => (elem.style.width = `${progress}%`));
    skillElems.tooltip.forEach((elem) =>
      elem.setContent(this.createTooltipHTML(skill))
    );
  }
  updateLevel(skill) {
    const skillElems = this.getSkillElements(skill);
    const level = this.game.settings.showVirtualLevels
      ? skill.virtualLevel
      : skill.level;
    skillElems.level.forEach(
      (elem) => (elem.textContent = `${level} / ${skill.levelCap}`)
    );
  }
  getSkillElements(skill) {
    const skillElems = this.elems.get(skill);
    if (skillElems === undefined)
      throw new Error(
        `Tried to update skill progress for invalid skill: ${skill.id}`
      );
    return skillElems;
  }
  createTooltip(element, content) {
    return tippy(element, {
      content: content,
      allowHTML: true,
      placement: "top",
      interactive: false,
      animation: false,
    });
  }
  createTooltipHTML(skill) {
    const xp = skill.xp;
    const level = skill.level;
    let xpText;
    if (level >= skill.levelCap) xpText = numberWithCommas(Math.floor(xp));
    else
      xpText =
        numberWithCommas(Math.floor(xp)) +
        " / " +
        numberWithCommas(exp.level_to_xp(level + 1));
    return `<div class='text-center'>${xpText}</div>`;
  }
}
class SkillNav {
  constructor(game) {
    this.game = game;
    this.navs = new Map();
    this.active = new Set();
    this.glowing = new Set();
    game.skills.forEach((skill) => {
      const pages = game.getPagesForSkill(skill);
      if (pages === undefined) return;
      this.navs.set(
        skill,
        pages.map((page) => {
          const category = sidebar.category(
            page.skillSidebarCategoryID ||
              (page.id === "melvorD:Combat" ? "Combat" : "Non-Combat")
          );
          const navItem = category.item(skill.id);
          const levelAll = navItem.asideEl;
          if (levelAll === undefined)
            throw new Error(
              "Error creating SkillNav, sidebar item does not have aside."
            );
          const level = createElement("span", { text: "1" });
          levelAll.append("(", level, ` / ${skill.levelCap})`);
          const nav = { item: navItem, name: navItem.nameEl, levelAll, level };
          return nav;
        })
      );
    });
  }
  updateSkillLevel(skill) {
    const navs = this.getNavs(skill);
    const levelToUse = this.game.settings.showVirtualLevels
      ? skill.virtualLevel
      : skill.level;
    navs.forEach((nav) => {
      this.setLevel(nav, levelToUse, skill.levelCap);
    });
  }
  updateSkillLock(skill) {
    const navs = this.getNavs(skill);
    if (skill.isUnlocked) {
      navs.forEach((nav) => this.setUnlocked(nav, skill.levelCap));
    } else {
      navs.forEach((nav) => this.setLocked(nav));
    }
  }
  setActive(skill) {
    const navs = this.getNavs(skill);
    this.active.add(skill);
    navs.forEach((nav) => {
      nav.name.classList.add("text-success");
    });
  }
  setInactive(skill) {
    const navs = this.getNavs(skill);
    this.active.delete(skill);
    navs.forEach((nav) => {
      nav.name.classList.remove("text-success");
    });
  }
  setGlowing(skill, shouldGlow) {
    const navs = this.getNavs(skill);
    if (shouldGlow && !this.glowing.has(skill)) {
      navs.forEach(({ item }) => {
        var _a;
        (_a = item.rootEl) === null || _a === void 0
          ? void 0
          : _a.classList.add("glow-animation");
      });
      this.glowing.add(skill);
    } else if (!shouldGlow && this.glowing.has(skill)) {
      navs.forEach(({ item }) => {
        var _a;
        (_a = item.rootEl) === null || _a === void 0
          ? void 0
          : _a.classList.remove("glow-animation");
      });
      this.glowing.delete(skill);
    }
  }
  setAllInactive() {
    this.active.forEach((skillID) => {
      this.setInactive(skillID);
    });
  }
  setLocked(nav) {
    const lock = createElement("i", {
      classList: ["fa", "fa-lock", "text-danger"],
    });
    nav.lock = lock;
    nav.levelAll.textContent = "";
    nav.levelAll.append(lock);
    nav.name.classList.add("text-danger");
  }
  setUnlocked(nav, levelCap) {
    nav.lock = undefined;
    nav.levelAll.textContent = "";
    nav.levelAll.append("(", nav.level, ` / ${levelCap})`);
    nav.name.classList.remove("text-danger");
  }
  setLevel(nav, level, levelCap) {
    if (level >= levelCap) {
      nav.levelAll.classList.add("text-warning");
    } else {
      nav.levelAll.classList.remove("text-warning");
    }
    nav.level.textContent = numberWithCommas(level);
  }
  getNavs(skill) {
    const navs = this.navs.get(skill);
    if (navs === undefined)
      throw new Error(
        `Tried to update skill nav for invalid skill: ${skill.id}`
      );
    return navs;
  }
}
