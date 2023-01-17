"use strict";
class WoodcuttingTreeMenu extends ContainedComponent {
  constructor(tree, woodcutting, before) {
    super();
    this.tree = tree;
    this.woodcutting = woodcutting;
    this.container = createElement("div", {
      classList: ["col-6", "col-md-4", "col-lg-4", "col-xl-3", "d-none"],
    });
    this.button = createElement("a", {
      classList: [
        "block",
        "block-rounded",
        "block-link-pop",
        "border-top",
        "border-woodcutting",
        "border-4x",
        "pointer-enabled",
      ],
      parent: this.container,
    });
    this.button.onclick = () => this.woodcutting.selectTree(tree);
    const topBlock = createElement("div", {
      classList: ["block-content", "block-content-full", "pb-0"],
      parent: this.button,
    });
    const nameDiv = createElement("div", {
      classList: ["font-size-sm", "font-w600", "text-center", "text-muted"],
      parent: topBlock,
    });
    this.cutText = createElement("small");
    this.treeName = createElement("span");
    const rates = createElement("small");
    this.xpText = createElement("span");
    this.intervalText = createElement("span");
    rates.append(
      this.xpText,
      document.createTextNode(" / "),
      createElement("i", { classList: ["far", "fa-clock", "mr-1"] }),
      this.intervalText
    );
    nameDiv.append(
      this.cutText,
      createElement("br"),
      this.treeName,
      createElement("br"),
      rates
    );
    topBlock
      .appendChild(createElement("div", { classList: ["text-center"] }))
      .appendChild(
        createElement("img", {
          classList: ["mining-ore-img"],
          attributes: [["src", tree.media]],
        })
      );
    this.progressBar = topBlock
      .appendChild(createElement("div", { classList: ["progress", "active"] }))
      .appendChild(
        createElement("div", {
          classList: ["progress-bar", "bg-woodcutting"],
          attributes: [
            ["role", "progressbar"],
            ["style", "width: 0%;"],
            ["aria-valuenow", "0"],
            ["aria-valuemin", "0"],
            ["aria-valuemax", "100"],
          ],
        })
      );
    const masteryContainer = createElement("div", {
      classList: ["block-content"],
      parent: this.button,
    });
    this.mastery = new MasteryDisplay();
    this.mastery.classList.add("mastery-8");
    masteryContainer.appendChild(this.mastery);
    this.mastery.setMastery(this.woodcutting, tree);
    before.before(this.container);
  }
  localize() {
    this.cutText.textContent = getLangString("MENU_TEXT", "CUT");
    this.treeName.textContent = this.tree.name;
    this.updateRates();
  }
  updateRates() {
    this.xpText.textContent = templateLangString("MENU_TEXT", "XP_AMOUNT", {
      xp: `${this.tree.baseExperience}`,
    });
    const cutInterval = this.woodcutting.getTreeInterval(this.tree) / 1000;
    this.intervalText.textContent = templateLangString("MENU_TEXT", "SECONDS", {
      seconds: `${numberWithCommas(cutInterval)}`,
    });
  }
  setActive() {
    this.progressBar.style.width = "100%";
  }
  setInactive() {
    this.progressBar.style.width = "0%";
  }
}
class WoodcuttingMenu {
  constructor(woodcutting) {
    this.woodcutting = woodcutting;
    this.treeMenus = new Map();
    this.progressBar = new ProgressBar(
      document.getElementById("cut-tree-progress"),
      "bg-woodcutting"
    );
    this.infoMessage = document.getElementById("woodcutting-info-message");
    this.grantsContainer = document.getElementById("woodcutting-grants");
    this.lockedTree = document.getElementById("tree-locked");
    this.nextLevelText = document.getElementById("woodcutting-tree-next-level");
    this.shopItemPurchased = document.getElementById(
      "woodcutting-tree-shop-item"
    );
    this.treeGrants = [];
    this.selectedTrees = new Set();
    this.lowerGrants = createElement("div", {
      classList: ["row", "justify-content-center", "ml-2", "mr-2"],
    });
    this.grantsContainer.append(this.lowerGrants);
    this.xpIcon = new XPIcon(this.lowerGrants, 0);
    this.poolXPIcon = new MasteryPoolIcon(this.lowerGrants, 0);
    this.intervalIcon = new IntervalIcon(this.lowerGrants, 0);
    hideElement(this.lowerGrants);
    this.woodcutting.actions.forEach((tree) => {
      this.treeMenus.set(
        tree,
        new WoodcuttingTreeMenu(tree, this.woodcutting, this.lockedTree)
      );
    });
  }
  localize() {
    this.treeMenus.forEach((menu) => menu.localize());
  }
  updateTreeRates() {
    this.treeMenus.forEach((menu) => menu.updateRates());
  }
  updateTreeUnlocks() {
    const lowestLevelLocked = this.woodcutting.actions.reduce(
      (lowestLevelLocked, tree) => {
        const treeMenu = this.treeMenus.get(tree);
        if (treeMenu === undefined)
          throw new Error(
            `Error updating tree unlocks, menu does not exist for tree: ${tree.id}`
          );
        if (
          tree.level <= this.woodcutting.level &&
          (tree.shopItemPurchased === undefined ||
            game.shop.isUpgradePurchased(tree.shopItemPurchased))
        )
          treeMenu.show();
        else {
          treeMenu.hide();
          if (
            lowestLevelLocked === undefined ||
            lowestLevelLocked.level > tree.level
          )
            lowestLevelLocked = tree;
        }
        return lowestLevelLocked;
      },
      undefined
    );
    if (lowestLevelLocked === undefined) {
      hideElement(this.lockedTree);
    } else {
      this.nextLevelText.textContent = templateLangString(
        "MENU_TEXT",
        "LEVEL",
        { level: `${lowestLevelLocked.level}` }
      );
      if (this.woodcutting.level >= lowestLevelLocked.level) {
        this.nextLevelText.classList.replace("badge-danger", "badge-success");
      } else {
        this.nextLevelText.classList.replace("badge-success", "badge-danger");
      }
      if (lowestLevelLocked.shopItemPurchased !== undefined) {
        showElement(this.shopItemPurchased);
        this.shopItemPurchased.textContent = templateLangString(
          "MENU_TEXT",
          "REQUIRES_SHOP_PURCHASE",
          { purchaseName: lowestLevelLocked.shopItemPurchased.name }
        );
        toggleDangerSuccess(
          this.shopItemPurchased,
          game.shop.isUpgradePurchased(lowestLevelLocked.shopItemPurchased)
        );
      } else hideElement(this.shopItemPurchased);
    }
  }
  setTrees(trees) {
    let i = 0;
    trees.forEach((tree) => {
      if (this.treeGrants.length <= i) {
        const container = createElement("div", {
          classList: ["row", "justify-content-center", "mr-2", "ml-2"],
        });
        const itemIcon = new ItemQtyIcon(
          container,
          false,
          this.woodcutting.getTreeMultiplier(tree)
        );
        const masteryXPIcon = new MasteryXPIcon(container, 0);
        this.infoMessage.after(container);
        this.treeGrants.push({ itemIcon, masteryXPIcon, container });
      }
      i++;
    });
    for (let i = this.treeGrants.length - 1; i >= trees.size; i--) {
      this.destroyTreeGrants(this.treeGrants[i]);
      this.treeGrants.pop();
    }
    this.selectedTrees.forEach((tree) => {
      var _a;
      if (!trees.has(tree)) {
        (_a = this.treeMenus.get(tree)) === null || _a === void 0
          ? void 0
          : _a.setInactive();
        this.selectedTrees.delete(tree);
      }
    });
    trees.forEach((tree) => {
      var _a;
      if (!this.selectedTrees.has(tree)) {
        (_a = this.treeMenus.get(tree)) === null || _a === void 0
          ? void 0
          : _a.setActive();
        this.selectedTrees.add(tree);
      }
    });
    this.updateSelectedTrees();
  }
  destroyTreeGrants(treeGrant) {
    treeGrant.itemIcon.destroy();
    treeGrant.masteryXPIcon.destroy();
    this.grantsContainer.removeChild(treeGrant.container);
  }
  updateSelectedTrees() {
    let i = 0;
    this.selectedTrees.forEach((tree) => {
      const treeGrant = this.treeGrants[i];
      treeGrant.itemIcon.setItem(
        tree.product,
        Math.floor(game.woodcutting.getTreeMultiplier(tree))
      );
      treeGrant.masteryXPIcon.setXP(this.woodcutting.getTreeMasteryXP(tree));
      i++;
    });
    if (this.selectedTrees.size > 0) {
      hideElement(this.infoMessage);
      showElement(this.lowerGrants);
      this.xpIcon.setXP(this.woodcutting.totalXPToAdd);
      this.poolXPIcon.setXP(this.woodcutting.totalPoolXPToAdd);
      this.intervalIcon.setInterval(this.woodcutting.actionInterval);
    } else {
      showElement(this.infoMessage);
      hideElement(this.lowerGrants);
    }
  }
}
