"use strict";
class Minibar {
  constructor(game) {
    this.game = game;
    this.pets = [];
    this.upgrades = [];
    this.customItems = new Map();
    this.renderQueue = { quickEquipIcons: false };
    this.quickEquipIcons = new Map();
    this.minibar = [];
    this.masteryUnlocks = this.createMinibarItem(
      "minibar-mastery",
      `${CDNDIR}assets/media/main/mastery_header.svg`,
      `<div class="text-center"><small>${getLangString(
        "MISC_STRING",
        "MINIBAR_3"
      )}</small></div>`,
      {}
    );
    this.milestones = this.createMinibarItem(
      "minibar-milestones",
      `${CDNDIR}assets/media/main/milestones_header.svg`,
      `<div class="text-center"><small>${getLangString(
        "MISC_STRING",
        "MINIBAR_2"
      )}</small></div>`,
      {}
    );
    this.summoning = this.createMinibarItem(
      "minibar-summoning",
      `${CDNDIR}assets/media/skills/summoning/summoning.svg`,
      `<div class="text-center"><small>${getLangString(
        "COMBAT_MISC",
        "MENU_4"
      )}</small></div>`,
      { onClick: () => openSynergiesBreakdown() }
    );
    this.quickEquip = this.createMinibarItem(
      "minibar-quick-equip",
      `${CDNDIR}assets/media/main/settings_header.svg`,
      "",
      { onClick: () => displayQuickItemEquip() }
    );
  }
  get minibarElement() {
    return document.getElementById("skill-footer-minibar");
  }
  get quickEquipContainer() {
    const container = document.getElementById("minibar-skill-item-container");
    if (container === null) throw new Error(`UI is not loaded yet.`);
    return container;
  }
  initialize() {
    const minibarElement = this.minibarElement;
    minibarElement.prepend(this.masteryUnlocks.element);
    minibarElement.prepend(this.milestones.element);
    minibarElement.prepend(this.summoning.element);
    minibarElement.prepend(this.quickEquip.element);
    Sortable.create(document.getElementById("minibar-skill-item-container"), {
      group: "minibar",
      delay: 200,
      delayOnTouchOnly: getSortableDelayOnTouch(),
      onEnd: (evt) => {
        const { newIndex, oldIndex } = evt;
        if (newIndex === undefined || oldIndex === undefined) return;
        this.changeItemOrder(newIndex, oldIndex);
      },
      onMove: function () {
        tippy.hideAll();
      },
      onChoose: function (evt) {
        tippy.hideAll();
      },
    });
  }
  render() {
    if (this.renderQueue.quickEquipIcons) {
      if (this.activeSkill !== undefined) {
        const skill = this.activeSkill;
        const quickEquipItems = this.getCustomItemsForSkill(skill);
        quickEquipItems.forEach((item) => {
          if (!this.quickEquipIcons.has(item))
            this.createQuickEquipIcon(item, skill);
        });
      }
      this.renderQueue.quickEquipIcons = false;
    }
  }
  encode(writer) {
    writer.writeMap(this.customItems, writeNamespaced, (items, writer) => {
      writer.writeArray(items, writeNamespaced);
    });
    return writer;
  }
  decode(reader, version) {
    this.customItems = reader.getMap(
      readNamespacedReject(this.game.skills),
      (reader) => {
        return reader.getArray(readNamespacedReject(this.game.items.equipment));
      }
    );
  }
  convertFromOldformat(save, idMap) {
    if (save.customMinibarItems !== undefined) {
      Object.entries(save.customMinibarItems).forEach(([skillID, itemIDs]) => {
        const skill = this.game.skills.getObjectByID(
          idMap.skills[parseInt(skillID)]
        );
        if (skill === undefined)
          throw new Error(`Error converting save. Skill is unregistered.`);
        const items = [];
        itemIDs.forEach((itemID) => {
          const item = this.game.items.equipment.getObjectByID(
            idMap.items[itemID]
          );
          if (item !== undefined && this.game.stats.itemFindCount(item) > 0)
            items.push(item);
        });
        this.customItems.set(skill, items);
      });
    }
  }
  getCustomItemsForSkill(skill) {
    let customItems = this.customItems.get(skill);
    if (customItems === undefined)
      customItems = this.setCustomItemsToDefault(skill);
    return customItems;
  }
  setCustomItemsToDefault(skill) {
    const defaultItems = [];
    skill.minibarOptions.defaultItems.forEach((item) => {
      if (this.game.stats.itemFindCount(item) > 0) defaultItems.push(item);
    });
    this.customItems.set(skill, defaultItems);
    return defaultItems;
  }
  addItemOnDiscovery(item) {
    this.game.skills.forEach((skill) => {
      if (skill.minibarOptions.defaultItems.has(item)) {
        const customItems = this.customItems.get(skill);
        if (customItems !== undefined) {
          customItems.push(item);
        } else {
          this.setCustomItemsToDefault(skill);
        }
        if (skill === this.activeSkill) this.renderQueue.quickEquipIcons = true;
      }
    });
  }
  toggleCustomItem(skill, item) {
    const customItems = this.getCustomItemsForSkill(skill);
    const itemIndex = customItems.findIndex(
      (customItem) => customItem === item
    );
    if (itemIndex === -1) {
      customItems.push(item);
      return true;
    } else {
      customItems.splice(itemIndex, 1);
      return false;
    }
  }
  isCustomItemSet(skill, item) {
    return this.getCustomItemsForSkill(skill).includes(item);
  }
  setSkill(skill) {
    if (skill === undefined || !this.game.settings.showSkillingMinibar) {
      this.destroyQuickEquipIcons();
      $("#skill-footer-minibar-container").addClass("d-none");
      return;
    }
    this.pets.forEach((petItem) => this.removeItem(petItem));
    this.pets = [];
    this.upgrades.forEach((upgradeItem) => this.removeItem(upgradeItem));
    this.upgrades = [];
    this.milestones.element.onclick = () => {
      skill.openMilestoneModal();
      this.milestones.element.blur();
    };
    if (skill instanceof SkillWithMastery && skill.hasMastery) {
      this.masteryUnlocks.element.onclick = () => {
        skill.openMasteryLevelUnlockModal();
        this.masteryUnlocks.element.blur();
      };
      showElement(this.masteryUnlocks.element);
    } else {
      hideElement(this.masteryUnlocks.element);
    }
    this.createQuickEquipIcons(skill);
    const minibarElement = this.minibarElement;
    skill.minibarOptions.pets.forEach((pet) => {
      if (this.game.petManager.isPetUnlocked(pet)) {
        const petItem = this.createPetItem(pet);
        this.pets.push(petItem);
        minibarElement.prepend(petItem.element);
      }
    });
    skill.minibarOptions.upgrades.forEach((upgrade) => {
      if (this.game.shop.isUpgradePurchased(upgrade)) {
        const upgradeItem = this.createUpgradeItem(upgrade);
        this.upgrades.push(upgradeItem);
        minibarElement.prepend(upgradeItem.element);
      }
    });
    this.activeSkill = skill;
    $("#skill-footer-minibar-container").removeClass("d-none");
  }
  updateEquippedTicks() {
    this.quickEquipIcons.forEach((icon, item) => {
      if (this.game.combat.player.equipment.checkForItem(item)) {
        showElement(icon.equippedTick);
      } else {
        hideElement(icon.equippedTick);
      }
    });
  }
  destroyQuickEquipIcons() {
    this.quickEquipIcons.forEach((icon) => {
      icon.tooltip.destroy();
      icon.button.remove();
    });
    this.quickEquipIcons.clear();
  }
  createQuickEquipIcons(skill) {
    this.destroyQuickEquipIcons();
    const quickEquipItems = this.getCustomItemsForSkill(skill);
    quickEquipItems.forEach((item) => this.createQuickEquipIcon(item, skill));
  }
  createQuickEquipIcon(item, skill) {
    const itemContainer = this.quickEquipContainer;
    const equippedTick = createElement("img", {
      className: `skill-icon-xxs minibar-equipped${
        !this.game.combat.player.equipment.checkForItem(item) ? " d-none" : ""
      }`,
      attributes: [["src", cdnMedia("assets/media/main/tick.png")]],
    });
    const button = createElement("button", {
      className:
        "btn btn-sm btn-outline-secondary overlay-container overlay-bottom",
      children: [
        createElement("img", {
          classList: ["skill-icon-xs"],
          attributes: [["src", item.media]],
        }),
        equippedTick,
      ],
      parent: itemContainer,
    });
    button.onclick = () => {
      this.game.combat.player.quickEquipItem(item, skill);
      button.blur();
    };
    let itemDescription = "";
    if (item.hasDescription) itemDescription = item.description;
    const tooltip = tippy(button, {
      content: `<div class="text-center"><span class="text-warning">${
        item.name
      }</span><br><small>${itemDescription}<br><span class="text-info">${getLangString(
        "MISC_STRING",
        "MINIBAR_0"
      )}</span><br><span class="text-danger">${getLangString(
        "MISC_STRING",
        "MINIBAR_1"
      )}</span></small></div>`,
      placement: "left",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
    this.quickEquipIcons.set(item, { button, tooltip, equippedTick });
  }
  createPetItem(pet) {
    return this.createMinibarItem(
      `minibar-pet-${pet.id}`,
      pet.media,
      '<div class="text-center"><small class="text-success">' +
        getLangString("MENU_TEXT", "ACTIVE") +
        '</small><br><span class="text-warning">' +
        pet.name +
        "</span><br><small>" +
        pet.description +
        "</small></div>",
      { onClick: () => this.game.petManager.petPet(pet) }
    );
  }
  createUpgradeItem(upgrade) {
    return this.createMinibarItem(
      `minibar-upgrade-${upgrade.id}`,
      upgrade.media,
      `<div class="text-center"><small class="text-success">${getLangString(
        "MENU_TEXT",
        "ACTIVE"
      )}</small><br><span class="text-warning">${
        upgrade.name
      }</span><small><br>${upgrade.description}</small></div>`,
      {}
    );
  }
  createMinibarItem(elementID, media, tooltipContent, options) {
    const element = createElement("button", {
      id: elementID,
      className: "btn btn-sm btn-light",
    });
    element.innerHTML = `<img class="skill-icon-xs" src="${media}">`;
    this.applyOptionsToElement(element, options);
    const item = { element };
    if (tooltipContent !== "") {
      item.tooltip = this.createElementTooltip(element, tooltipContent);
    }
    return item;
  }
  applyOptionsToElement(element, options) {
    if (options.onClick !== undefined) {
      element.onclick = options.onClick;
    }
    if (options.hideOnCreate) element.classList.add("d-none");
  }
  createElementTooltip(element, tooltipContent) {
    return tippy(element, {
      content: tooltipContent,
      placement: "left",
      allowHTML: true,
      interactive: false,
      animation: false,
    });
  }
  removeItem(item) {
    if (item.tooltip !== undefined) item.tooltip.destroy();
    item.element.remove();
  }
  changeItemOrder(newIndex, oldIndex) {
    if (this.activeSkill === undefined) return;
    const customItems = this.getCustomItemsForSkill(this.activeSkill);
    customItems.splice(newIndex, 0, ...customItems.splice(oldIndex, 1));
    if (DEBUGENABLED) {
      console.log(`END: NEW INDEX: ${newIndex} | OLD INDEX: ${oldIndex}`);
      console.log(customItems);
    }
  }
}
function toggleSkillMinibar() {
  $("#skill-footer-minibar").toggleClass("d-none");
  $("#skill-footer-minibar-icon").toggleClass("si-arrow-up");
  $("#skill-footer-minibar-icon").toggleClass("si-arrow-down");
}
function displayQuickItemEquip() {
  if (nativeManager.isMobile)
    $("#skill-footer-minibar-items-container").toggleClass("d-none");
}
