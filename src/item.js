"use strict";
class Item extends NamespacedObject {
  constructor(namespace, data) {
    super(namespace, data.id);
    this._name = data.name;
    this._customDescription = data.customDescription;
    this.category = data.category;
    this.type = data.type;
    this._media = data.media;
    this.ignoreCompletion = data.ignoreCompletion;
    this.obtainFromItemLog = data.obtainFromItemLog;
    this.golbinRaidExclusive = data.golbinRaidExclusive;
    if (data.mediaAnimation !== undefined)
      this._mediaAnimation = data.mediaAnimation;
    if (data.altMedia !== undefined) this._altMedia = data.altMedia;
    this.sellsFor = data.sellsFor;
  }
  get name() {
    if (this.isModded) {
      return this._name;
    } else {
      return getLangString("ITEM_NAME", this.localID);
    }
  }
  get media() {
    if (this._mediaAnimation !== undefined)
      return this.getMediaURL(this._mediaAnimation);
    return this.getMediaURL(this._media);
  }
  get altMedia() {
    if (this._altMedia !== undefined) return this.getMediaURL(this._altMedia);
    return this.media;
  }
  get description() {
    if (this._customDescription !== undefined) {
      if (this.isModded) {
        return this._customDescription;
      } else {
        switch (this.type) {
          case "Gem":
            return getLangString("MENU_TEXT", "STANDARD_GEM");
          case "Superior Gem":
            return getLangString("MENU_TEXT", "SUPERIOR_GEM");
        }
        return getLangString("ITEM_DESCRIPTION", this.localID);
      }
    }
    return getLangString("BANK_STRING", "38");
  }
  get hasDescription() {
    return this._customDescription !== undefined;
  }
}
class DummyItem extends Item {
  get name() {
    return "Full Version Only Item.";
  }
  get description() {
    return "This item is only available in the Full Version of Melvor Idle.";
  }
  constructor(namespace, id) {
    super(namespace, {
      id,
      name: "",
      category: "",
      type: "",
      media: "assets/media/main/question.svg",
      ignoreCompletion: true,
      obtainFromItemLog: false,
      golbinRaidExclusive: false,
      sellsFor: 0,
    });
  }
}
class EquipmentItem extends Item {
  constructor(namespace, data, game) {
    super(namespace, data);
    this.equipRequirements = [];
    this.conditionalModifiers = [];
    this.specialAttacks = [];
    this.fightEffects = [];
    this.providedRunes = [];
    this.tier = data.tier;
    this.validSlots = data.validSlots;
    this.occupiesSlots = data.occupiesSlots;
    this.equipmentStats = data.equipmentStats;
    if (data.modifiers !== undefined)
      this.modifiers = game.getPlayerModifiersFromData(data.modifiers);
    if (data.enemyModifiers !== undefined)
      this.enemyModifiers = data.enemyModifiers;
    if (data.conditionalModifiers !== undefined)
      this.conditionalModifiers = data.conditionalModifiers.map(
        (data) => new ConditionalModifier(data, game, this)
      );
    if (data.specialAttacks !== undefined) {
      data.specialAttacks.forEach((id) => {
        const attack = game.specialAttacks.getObjectByID(id);
        if (attack === undefined)
          throw new Error(
            `Error constructing item, attack with ${id} is not registered.`
          );
        this.specialAttacks.push(attack);
      });
    }
    if (data.overrideSpecialChances !== undefined)
      this.overrideSpecialChances = data.overrideSpecialChances;
    if (data.providedRunes !== undefined)
      this.providedRunes = game.items.getQuantities(data.providedRunes);
    if (data.ammoType !== undefined) this.ammoType = AmmoTypeID[data.ammoType];
    game.queueForSoftDependencyReg(data, this);
  }
  get hasDescription() {
    return super.hasDescription || this.modifiers !== undefined;
  }
  get description() {
    if (super.hasDescription) return super.description;
    if (this.modifiers !== undefined) {
      if (this.validSlots.includes("Passive")) {
        return `${getLangString(
          "MISC_STRING",
          "0"
        )} ${describeModifierDataPlain(this.modifiers)}`;
      } else {
        return describeModifierDataPlain(this.modifiers);
      }
    }
    return getLangString("BANK_STRING", "38");
  }
  registerSoftDependencies(data, game) {
    this.equipRequirements = data.equipRequirements.map((req) =>
      game.getRequirementFromData(req)
    );
    if (data.consumesOn !== undefined)
      this.consumesOn = data.consumesOn.map((data) =>
        game.constructEventMatcher(data)
      );
    if (data.consumesChargesOn !== undefined)
      this.consumesChargesOn = data.consumesChargesOn.map((data) =>
        game.constructEventMatcher(data)
      );
    if (data.consumesItemOn !== undefined) {
      const item = game.items.getObjectByID(data.consumesItemOn.itemID);
      if (item === undefined)
        throw new Error(
          `Error constructing Item with id: ${this.id}. Item with id: ${data.consumesItemOn.itemID} is not registered.`
        );
      this.consumesItemOn = {
        item,
        chance: data.consumesItemOn.chance,
        matchers: data.consumesItemOn.matchers.map((data) =>
          game.constructEventMatcher(data)
        ),
      };
    }
    if (data.fightEffects !== undefined) {
      this.fightEffects = data.fightEffects.map((id) => {
        const itemEffect = game.itemEffectAttack.itemEffects.getObjectByID(id);
        if (itemEffect === undefined)
          throw new Error(
            `Error constructing item, item effect with ${id} is not registered.`
          );
        return itemEffect;
      });
    }
  }
}
class DummyEquipmentItem extends EquipmentItem {
  constructor(namespace, id, game) {
    super(
      namespace,
      {
        id,
        tier: "dummyItem",
        name: "",
        category: "",
        type: "",
        media: "assets/media/main/question.svg",
        ignoreCompletion: true,
        obtainFromItemLog: false,
        golbinRaidExclusive: false,
        sellsFor: 0,
        validSlots: [],
        occupiesSlots: [],
        equipRequirements: [],
        equipmentStats: [],
      },
      game
    );
  }
}
class WeaponItem extends EquipmentItem {
  constructor(namespace, itemData, game) {
    super(namespace, itemData, game);
    this.attackType = itemData.attackType;
    if (itemData.ammoTypeRequired !== undefined)
      this.ammoTypeRequired = AmmoTypeID[itemData.ammoTypeRequired];
  }
}
class FoodItem extends Item {
  constructor(namespace, itemData) {
    super(namespace, itemData);
    this.healsFor = itemData.healsFor;
  }
}
class BoneItem extends Item {
  constructor(namespace, itemData) {
    super(namespace, itemData);
    this.prayerPoints = itemData.prayerPoints;
  }
}
class PotionItem extends Item {
  constructor(namespace, data, game) {
    super(namespace, data);
    this.consumesOn = [];
    this.modifiers = game.getPlayerModifiersFromData(data.modifiers);
    this.charges = data.charges;
    const action = game.actions.getObjectByID(data.action);
    if (action === undefined)
      throw new Error(
        `Error registering potion, action with id: ${data.action} is not registered.`
      );
    this.action = action;
    this.tier = data.tier;
    game.queueForSoftDependencyReg(data, this);
  }
  get hasDescription() {
    return true;
  }
  get description() {
    if (super.hasDescription) return super.description;
    return describeModifierDataPlain(this.modifiers);
  }
  registerSoftDependencies(data, game) {
    this.consumesOn = data.consumesOn.map((data) =>
      game.constructEventMatcher(data)
    );
  }
}
class ReadableItem extends Item {
  constructor(namespace, itemData) {
    super(namespace, itemData);
    if (itemData.modalID !== undefined) this.modalID = itemData.modalID;
    if (itemData.swalData !== undefined) this.swalData = itemData.swalData;
  }
  showContents() {
    if (this.modalID !== undefined) {
      const modal = document.getElementById(this.modalID);
      if (modal !== null) $(modal).modal("show");
      else
        console.warn(
          `Tried to read item with id: ${this.id}, but modal with id: ${this.modalID} is not in DOM.`
        );
    } else if (this.swalData !== undefined) {
      const html = createElement("div");
      html.append(
        getTemplateElement(this.swalData.htmlTemplateID).content.cloneNode(true)
      );
      SwalLocale.fire({
        title: getLangString(
          this.swalData.title.category,
          this.swalData.title.id
        ),
        html,
        imageUrl: this.media,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: this.name,
      });
    }
  }
}
class OpenableItem extends Item {
  constructor(namespace, itemData, game) {
    super(namespace, itemData);
    this.dropTable = new DropTable(game, itemData.dropTable);
    if (itemData.keyItem !== undefined)
      this.keyItem = game.items.getQuantity(itemData.keyItem);
  }
}
class TokenItem extends Item {
  constructor(namespace, itemData, game) {
    super(namespace, itemData);
    this.modifiers = game.getPlayerModifiersFromData(itemData.modifiers);
  }
  get hasDescription() {
    return true;
  }
  get description() {
    if (super.hasDescription) return super.description;
    return describeModifierDataPlain(this.modifiers);
  }
}
class CompostItem extends Item {
  constructor(namespace, itemData) {
    super(namespace, itemData);
    this.compostValue = itemData.compostValue;
    this.harvestBonus = itemData.harvestBonus;
    this.buttonStyle = itemData.buttonStyle;
    this.barStyle = itemData.barStyle;
  }
}
function getItemSpecialAttackInformation(item) {
  let spec = "";
  if (item.specialAttacks.length > 0) {
    item.specialAttacks.forEach((attack, id) => {
      let chance = attack.defaultChance;
      if (item.overrideSpecialChances !== undefined)
        chance = item.overrideSpecialChances[id];
      spec += `<h5 class="font-size-sm font-w700 text-danger mb-0"><img class="skill-icon-xxs mr-1" src="${cdnMedia(
        "assets/media/main/special_attack.svg"
      )}"><small>${attack.name} (${formatPercent(
        chance
      )})</small></h5><h5 class="font-size-sm font-w400 text-warning mb-0"><small>${
        attack.description
      }</small></h5>`;
    });
  }
  return spec;
}
function createItemInformationTooltip(item, showStats = false) {
  let potionCharges = "",
    description = "",
    spec = "",
    hp = "",
    passive = "",
    html = "",
    baseStats = "";
  if (item instanceof EquipmentItem) {
    spec = getItemSpecialAttackInformation(item);
    if (showStats) baseStats = getItemBaseStatsBreakdown(item);
  }
  if (item instanceof PotionItem)
    potionCharges = `<small class='text-warning'>${templateString(
      getLangString("MENU_TEXT", "POTION_CHARGES"),
      { charges: `${item.charges}` }
    )}</small><br>`;
  if (item.hasDescription)
    description = `<small class='text-info'>${item.description}</small><br>`;
  if (item instanceof FoodItem)
    hp = `<img class='skill-icon-xs ml-2' src='${
      game.hitpoints.media
    }'><span class='text-success'>+${game.combat.player.getFoodHealing(
      item
    )}</span>`;
  if (
    item instanceof EquipmentItem &&
    item.validSlots.includes("Passive") &&
    game.combat.player.isEquipmentSlotUnlocked("Passive")
  )
    passive =
      '<br><small class="text-success">' +
      getLangString("MENU_TEXT", "PASSIVE_SLOT_COMPATIBLE") +
      "</small>";
  html += `<div class="text-center">
				<div class="media d-flex align-items-center push">
					<div class="mr-3">
						<img class="bank-img m-1" src="${item.media}">
					</div>
					<div class="media-body">
						<div class="font-w600">${item.name}</div>
						${potionCharges}
						${description}
						${spec}
						<div class="font-size-sm">
							<img class="skill-icon-xs" src="${cdnMedia(
                "assets/media/main/coins.svg"
              )}">${numberWithCommas(game.bank.getItemSalePrice(item))}
							${hp}
							${passive}
							<br>
						</div>
						${baseStats}
					</div>
				</div>
			</div>`;
  return html;
}
