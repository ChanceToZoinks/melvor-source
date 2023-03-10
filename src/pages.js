"use strict";
class Page extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this._customName = data.customName;
    this._media = data.media;
    this.containerID = data.containerID;
    this.headerBgClass = data.headerBgClass;
    this.hasGameGuide = data.hasGameGuide;
    this.canBeDefault = data.canBeDefault;
    if (data.skills !== undefined) {
      this.skills = data.skills.map((skillID) => {
        const skill = game.skills.getObjectByID(skillID);
        if (skill === undefined)
          throw new Error(
            `Error constructing ${Page.name} with id: ${this.id}. Skill with id: ${skillID} is not registered.`
          );
        return skill;
      });
    }
    if (data.action !== undefined) {
      const action = game.actions.getObjectByID(data.action);
      if (action === undefined)
        throw new Error(
          `Error constructing ${Page.name} with id: ${this.id}. Action wtih id: ${data.action} is not registered.`
        );
      this.action = action;
    }
    this.skillSidebarCategoryID = data.skillSidebarCategoryID;
    this.sidebarItem = data.sidebarItem;
    this.sidebarSubItems = data.sidebarSubItems;
  }
  get name() {
    if (this._customName !== undefined) {
      if (this.isModded) {
        return this._customName;
      } else {
        return getLangString("PAGE_NAME", this.localID);
      }
    }
    if (this.skills !== undefined) {
      return this.skills[0].name;
    }
    return "Error: No Page Name";
  }
  get media() {
    return this.getMediaURL(this._media);
  }
  generateSideBar() {
    var _a, _b;
    if (this.sidebarItem !== undefined) {
      const category = sidebar.category(this.sidebarItem.categoryID);
      const itemConfig = JSON.parse(JSON.stringify(this.sidebarItem));
      itemConfig.onClick = () => changePage(this);
      itemConfig.name = this.name;
      if (this.sidebarItem.icon !== undefined && this.sidebarItem.icon !== null)
        itemConfig.icon = this.getMediaURL(this.sidebarItem.icon);
      switch (this.id) {
        case "melvorD:TutorialIsland":
          itemConfig.aside = createElement("i", {
            classList: ["text-success", "fa", "fa-check", "mr-2"],
          });
          break;
        case "melvorD:Shop":
          itemConfig.aside = createElement("span", {
            children: [
              createElement("img", {
                attributes: [
                  ["src", cdnMedia("assets/media/main/coins.svg")],
                  ["width", "16px"],
                  ["height", "16px"],
                  ["style", "margin-right: 4px;"],
                ],
              }),
              createElement("span", {
                id: "nav-current-gp",
                classList: ["js-tooltip-enabled"],
                text: "0 GP",
                attributes: [
                  ["data-toggle", "tooltip"],
                  ["data-html", "true"],
                  ["data-placement", "bottom"],
                  ["data-original-title", "0"],
                ],
              }),
            ],
          });
          break;
      }
      category.item(this.id, itemConfig);
    }
    (_a = this.skills) === null || _a === void 0
      ? void 0
      : _a.forEach((skill) => {
          var _a, _b, _c;
          const category = sidebar.category(
            this.skillSidebarCategoryID ||
              (this.id === "melvorD:Combat" ? "Combat" : "Non-Combat")
          );
          const sideBarOptions = {
            icon: skill.media,
            name: skill.name,
            aside: createElement("span"),
            onClick: () => changePage(this, -1, skill),
          };
          if (skill.id === "melvorD:Magic" && this.id !== "melvorD:Combat")
            sideBarOptions.name = this.name;
          const navItem = category.item(skill.id, sideBarOptions);
          switch (skill.id) {
            case "melvorD:Hitpoints":
              (_a = navItem.nameEl) === null || _a === void 0
                ? void 0
                : _a.appendChild(
                    createElement("small", {
                      id: "nav-hitpoints-current",
                      classList: ["text-success"],
                      text: "(10)",
                    })
                  );
              break;
            case "melvorD:Prayer":
              (_b = navItem.nameEl) === null || _b === void 0
                ? void 0
                : _b.appendChild(
                    createElement("small", {
                      id: "combat-player-prayer-points-2",
                      classList: ["text-success"],
                      text: "(1)",
                    })
                  );
              break;
            case "melvorD:Slayer":
              (_c = navItem.nameEl) === null || _c === void 0
                ? void 0
                : _c.appendChild(
                    createElement("small", {
                      id: "nav-slayer-coins-2",
                      classList: ["text-success"],
                    })
                  );
              break;
          }
        });
    (_b = this.sidebarSubItems) === null || _b === void 0
      ? void 0
      : _b.forEach((subItem, i) => {
          const category = sidebar.category(subItem.categoryID);
          const item = category.item(subItem.itemID);
          const subItemConfig = JSON.parse(JSON.stringify(subItem));
          subItemConfig.onClick = () => changePage(this, i);
          if (!this.isModded && subItemConfig.name !== undefined) {
            subItemConfig.name = getLangString(
              "PAGE_NAME",
              `${this.localID}_SUBCATEGORY_${i}`
            );
          }
          item.subitem(`${this.id}:${i}`, subItemConfig);
        });
  }
}
