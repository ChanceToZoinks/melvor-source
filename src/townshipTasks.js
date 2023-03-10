"use strict";
class TownshipTaskRewards {
  constructor(data, game) {
    this.gp = data.gp;
    this.slayerCoins = data.slayerCoins;
    this.items = game.items.getQuantities(data.items);
    this.skillXP = data.skillXP.map(({ id, quantity }) => {
      const skill = game.skills.getObjectByID(id);
      if (skill === undefined)
        throw new UnregisteredConstructionError(this, Skill.name, id);
      return { skill, quantity };
    });
    this.townshipResources = game.township.getResourceQuantityFromData(
      data.townshipResources
    );
  }
}
class TownshipTaskGoals {
  constructor(data, game) {
    this.items = game.items.getQuantities(data.items);
    this.monsters = data.monsters.map(({ id, quantity }) => {
      const monster = game.monsters.getObjectByID(id);
      if (monster === undefined)
        throw new UnregisteredConstructionError(this, Monster.name, id);
      return { monster, quantity };
    });
    this.skillXP = data.skillXP.map(({ id, quantity }) => {
      const skill = game.skills.getObjectByID(id);
      if (skill === undefined)
        throw new UnregisteredConstructionError(this, Skill.name, id);
      return { skill, quantity };
    });
    this.buildings = data.buildings.map(({ id, quantity }) => {
      const building = game.township.buildings.getObjectByID(id);
      if (building === undefined)
        throw new UnregisteredConstructionError(
          this,
          TownshipBuilding.name,
          id
        );
      return { building, quantity };
    });
  }
}
class TownshipTask extends NamespacedObject {
  constructor(namespace, data, game) {
    super(namespace, data.id);
    this._name = data.name;
    this._description = data.description;
    this.goals = new TownshipTaskGoals(data.goals, game);
    this.rewards = new TownshipTaskRewards(data.rewards, game);
    this.requirements = data.requirements.map((req) =>
      game.getRequirementFromData(req)
    );
    this.category = data.category;
  }
  get name() {
    if (this.isModded) return this._name;
    return getLangString("MISC_STRING", "TASK");
  }
  get description() {
    if (this._description === undefined) return "";
    if (this.isModded) return this._description;
    return getLangString("TOWNSHIP_TASKS", `${this.localID}_description`);
  }
  get hasDescription() {
    return this._description !== undefined;
  }
}
class DummyTownshipTask extends TownshipTask {
  constructor(namespace, id, game) {
    super(
      namespace,
      {
        id,
        name: "",
        category: "Easy",
        goals: { items: [], monsters: [], skillXP: [], buildings: [] },
        rewards: {
          gp: 0,
          slayerCoins: 0,
          items: [],
          skillXP: [],
          townshipResources: [],
        },
        requirements: [],
      },
      game
    );
  }
}
class TownshipTasks {
  constructor(game) {
    this.game = game;
    this.completedTasks = new Set();
    this.tasks = new NamespaceRegistry(this.game.registeredNamespaces);
    this.taskReadyIcon = false;
    this._tasksCompleted = 0;
    this.activeTaskCategory = "None";
  }
  get tasksCompleted() {
    return this._tasksCompleted;
  }
  get tutorialTasksCompleted() {
    return Array.from(this.completedTasks).filter(
      (task) => task.category === "TownshipTutorial"
    ).length;
  }
  get allTasksComplete() {
    return this.tasksCompleted === this.tasks.size;
  }
  registerData(namespace, taskData) {
    taskData.forEach((data) =>
      this.tasks.registerObject(new TownshipTask(namespace, data, this.game))
    );
  }
  onLoad() {
    this.computeTaskTotal();
    this.updateAllTasks();
    this.showAllTaskCategories();
  }
  computeTaskTotal() {
    let total = 0;
    this.completedTasks.forEach((task) => {
      if (!(task instanceof DummyTownshipTask)) total++;
    });
    this._tasksCompleted = total;
  }
  onPageChange() {
    if (this.activeTaskCategory !== "None")
      this.showTaskCategory(this.activeTaskCategory);
  }
  resetTutorial() {
    this.completedTasks.forEach((task) => {
      if (
        !(task instanceof DummyTownshipTask) &&
        task.category === "TownshipTutorial"
      ) {
        this.completedTasks.delete(task);
        this._tasksCompleted--;
      }
    });
  }
  skipTownshipTutorial() {
    const tasks = this.tasks.filter(
      (task) => task.category === "TownshipTutorial"
    );
    tasks.forEach((task) => {
      if (!this.completedTasks.has(task)) this.completeTask(task, false, true);
    });
    this.showAllTaskCategories();
  }
  get isTownshipTutorialComplete() {
    return this.tasksCompleted >= 23;
  }
  getTaskCountInCategory(category) {
    return this.tasks.filter((task) => task.category === category).length;
  }
  getCompletedTaskCountInCategory(category) {
    let count = 0;
    this.completedTasks.forEach((task) => {
      if (!(task instanceof DummyTownshipTask) && task.category === category)
        count++;
    });
    return count;
  }
  completeTask(task, giveRewards = true, forceComplete = false) {
    if (this.checkTaskCompletion(task) || forceComplete) {
      if (giveRewards) {
        this.removeTaskItemsFromBank(task);
        this.claimTaskRewards(task);
      }
      this.completedTasks.add(task);
      this._tasksCompleted++;
      this.updateAllTasks();
      this.updateAllTaskProgress();
      this.updateTaskCompletedBreakdownText();
      this.showTaskComplete();
      if (
        this.activeTaskCategory !== "None" &&
        this.getCompletedTaskCountInCategory(this.activeTaskCategory) <
          this.getTaskCountInCategory(this.activeTaskCategory)
      )
        this.showTaskCategory(this.activeTaskCategory);
      else this.showAllTaskCategories();
      this.checkForTaskReady(true);
    }
  }
  showTaskComplete() {
    this.game.combat.notifications.add({
      type: "Player",
      args: [
        game.township,
        getLangString("TOWNSHIP_TASKS", "TASK_COMPLETE"),
        "success",
      ],
    });
  }
  checkForTaskReady(forceCheck = false) {
    if ((this.taskReadyIcon && !forceCheck) || this.allTasksComplete) return;
    const task = this.tasks.find(
      (task) => this.checkTaskCompletion(task) && !this.completedTasks.has(task)
    );
    if (task !== undefined) {
      this.taskReadyIcon = true;
      townshipUI.showTaskReadyIcon();
    } else {
      this.taskReadyIcon = false;
      townshipUI.hideTaskReadyIcon();
    }
  }
  checkForTaskReadyInCategory(category) {
    const task = this.tasks.find(
      (task) =>
        this.checkTaskCompletion(task) &&
        task.category === category &&
        !this.completedTasks.has(task)
    );
    return task !== undefined;
  }
  checkTaskCompletion(task) {
    let complete = true;
    task.goals.monsters.forEach((monsterGoal) => {
      if (complete) complete = this.isMonsterTaskComplete(monsterGoal);
    });
    task.goals.skillXP.forEach((skillGoal) => {
      if (complete) complete = this.isSkillTaskComplete(skillGoal);
    });
    task.goals.items.forEach((itemGoal) => {
      if (complete) complete = this.isItemTaskComplete(itemGoal);
    });
    task.goals.buildings.forEach((buildingGoal) => {
      if (complete)
        complete = this.isTownshipBuildingTaskComplete(buildingGoal);
    });
    return complete;
  }
  isItemTaskComplete(itemGoal) {
    return this.game.bank.getQty(itemGoal.item) >= itemGoal.quantity;
  }
  isMonsterTaskComplete(monsterGoal) {
    return (
      monsterGoal.quantity <= game.stats.monsterKillCount(monsterGoal.monster)
    );
  }
  isSkillTaskComplete(skillTask) {
    return skillTask.quantity <= skillTask.skill.xp;
  }
  isTownshipBuildingTaskComplete(buildingTask) {
    return (
      buildingTask.quantity <=
      this.game.township.countNumberOfBuildings(buildingTask.building)
    );
  }
  isTaskRequirementMet(task) {
    return task.requirements.every((req) => game.checkRequirement(req));
  }
  updateAllTasks() {}
  isTaskCategoryComplete(category) {
    return (
      this.getCompletedTaskCountInCategory(category) ===
      this.countTotalTasksInCategory(category)
    );
  }
  updateMonsterTasks(monster) {
    if (this.activeTaskCategory !== "None")
      this.showTaskCategory(this.activeTaskCategory);
  }
  updateSkillTasks(skill, xp) {
    if (this.activeTaskCategory !== "None")
      this.showTaskCategory(this.activeTaskCategory);
  }
  updateTownshipBuildingTasks(building, qty) {
    if (this.activeTaskCategory !== "None")
      this.showTaskCategory(this.activeTaskCategory);
  }
  removeTaskItemsFromBank(task) {
    if (task.goals.items.length === 0) return;
    task.goals.items.forEach(({ item, quantity }) => {
      this.game.bank.removeItemQuantity(item, quantity, true);
    });
  }
  createTaskCompletedBreakdown() {
    const element = createElement("div", { classList: ["col-12"] });
    const h5 = createElement("h5", {
      classList: ["font-w600", "font-size-sm", "mb-2"],
      id: "task-completed-breakdown",
      text: this.getTaskCompletedBreakdownText(),
    });
    element.appendChild(h5);
    return element;
  }
  getTaskCompletedBreakdownText() {
    return templateString(getLangString("TOWNSHIP_MENU", "TASKS_COMPLETED"), {
      qty1: `${this.tasksCompleted}`,
      qty2: `${this.tasks.size}`,
    });
  }
  updateTaskCompletedBreakdownText() {
    const element = document.getElementById("task-completed-breakdown");
    if (element) element.innerText = this.getTaskCompletedBreakdownText();
  }
  createTaskButtonHeader() {
    const element = createElement("div", { classList: ["col-12"] });
    const btn = createElement("button", {
      classList: ["btn", "btn-sm", "m-1", "text-white"],
    });
    const allBtn = btn.cloneNode(true);
    allBtn.innerText = getLangString("TOWNSHIP_MENU", "VIEW_ALL");
    allBtn.classList.add("bg-primary");
    allBtn.addEventListener("click", () => {
      this.showAllTaskCategories();
    });
    const tsBtn = btn.cloneNode(true);
    tsBtn.innerText = getLangString("TOWNSHIP_MENU", "TUTORIAL");
    tsBtn.classList.add("bg-township");
    tsBtn.addEventListener("click", () => {
      this.showTaskCategory("TownshipTutorial");
    });
    const easyBtn = btn.cloneNode(true);
    easyBtn.innerText = getLangString("COMBAT_MISC", "23");
    easyBtn.classList.add("bg-easy-task");
    easyBtn.addEventListener("click", () => {
      this.showTaskCategory("Easy");
    });
    const normalBtn = btn.cloneNode(true);
    normalBtn.innerText = getLangString("COMBAT_MISC", "24");
    normalBtn.classList.add("bg-normal-task");
    normalBtn.addEventListener("click", () => {
      this.showTaskCategory("Normal");
    });
    const hardBtn = btn.cloneNode(true);
    hardBtn.innerText = getLangString("COMBAT_MISC", "25");
    hardBtn.classList.add("bg-hard-task");
    hardBtn.addEventListener("click", () => {
      this.showTaskCategory("Hard");
    });
    const veryHardBtn = btn.cloneNode(true);
    veryHardBtn.innerText = getLangString("COMBAT_MISC", "98");
    veryHardBtn.classList.add("bg-very-hard-task");
    veryHardBtn.addEventListener("click", () => {
      this.showTaskCategory("VeryHard");
    });
    const eliteBtn = btn.cloneNode(true);
    eliteBtn.innerText = getLangString("COMBAT_MISC", "26");
    eliteBtn.classList.add("bg-elite-task");
    eliteBtn.addEventListener("click", () => {
      this.showTaskCategory("Elite");
    });
    element.append(
      allBtn,
      tsBtn,
      easyBtn,
      normalBtn,
      hardBtn,
      veryHardBtn,
      eliteBtn
    );
    return element;
  }
  createTaskElement(task) {
    const element = createElement("div", { classList: ["col-12"] });
    const div = createElement("div", { classList: ["block", "block-rounded"] });
    const header = createElement("div", {
      classList: [
        "block-header",
        "block-header-default",
        "p-2",
        this.getTownshipTaskCategoryBG(task.category),
      ],
    });
    const headerTitle = createElement("h3", {
      classList: ["block-title"],
      text: task.name,
    });
    header.appendChild(headerTitle);
    const content = createElement("div", {
      classList: ["p-2", "bg-combat-inner-dark"],
    });
    if (task.hasDescription) content.append(this.createTaskDescription(task));
    content.append(this.createTaskTasks(task));
    content.append(this.createTaskRewards(task));
    div.append(header, content);
    element.append(div);
    return element;
  }
  createTaskDescription(task) {
    const element = createElement("h5", {
      classList: ["font-w600", "font-size-sm", "mb-1", "text-warning"],
      text: task.description,
    });
    return element;
  }
  createTaskTasks(task) {
    const element = createElement("div", {
      classList: ["font-w600", "text-info"],
      text: "Tasks:",
    });
    element.append(this.createTaskItemTask(task));
    element.append(this.createTaskMonsterTask(task));
    element.append(this.createTaskSkillTask(task));
    element.append(this.createTaskTownshipBuildingTask(task));
    return element;
  }
  createTaskItemTask(task) {
    if (task.goals.items.length <= 0) return createElement("div");
    const element = createElement("ul", {
      classList: [
        "nav-main",
        "nav-main-horizontal",
        "nav-main-horizontal-override",
        "font-w400",
        "font-size-sm",
      ],
    });
    task.goals.items.forEach((itemGoal) => {
      const list = createElement("li", {
        classList: [
          `block`,
          `block-rounded-double`,
          `text-center`,
          `p-1`,
          `mr-2`,
          `${
            this.isItemTaskComplete(itemGoal)
              ? "spell-selected"
              : "spell-not-selected"
          }`,
        ],
      });
      const img = createElement("img", {
        classList: ["skill-icon-xs", "mr-1"],
      });
      img.src = itemGoal.item.media;
      const span = createElement("span");
      const progress =
        game.bank.getQty(itemGoal.item) > itemGoal.quantity
          ? itemGoal.quantity
          : game.bank.getQty(itemGoal.item);
      span.innerHTML = templateString(
        getLangString("TOWNSHIP_TASKS", "REQ_3"),
        {
          qty1: `${numberWithCommas(progress)}`,
          qty2: `${numberWithCommas(itemGoal.quantity)}`,
          itemImg: img.outerHTML,
          itemName: itemGoal.item.name,
        }
      );
      list.append(span);
      element.append(list);
    });
    return element;
  }
  createTaskMonsterTask(task) {
    if (task.goals.monsters.length <= 0) return createElement("div");
    const element = createElement("ul", {
      classList: [
        "nav-main",
        "nav-main-horizontal",
        "nav-main-horizontal-override",
        "font-w400",
        "font-size-sm",
      ],
    });
    task.goals.monsters.forEach((monsterGoal, id) => {
      const list = createElement("li", {
        classList: [
          `block`,
          `block-rounded-double`,
          `text-center`,
          `p-1`,
          `mr-2`,
          `${
            this.isMonsterTaskComplete(monsterGoal)
              ? "spell-selected"
              : "spell-not-selected"
          }`,
        ],
      });
      const img = createElement("img", {
        classList: ["skill-icon-xs", "mr-1"],
      });
      img.src = monsterGoal.monster.media;
      const span = createElement("span");
      const progress =
        game.stats.monsterKillCount(monsterGoal.monster) > monsterGoal.quantity
          ? monsterGoal.quantity
          : game.stats.monsterKillCount(monsterGoal.monster);
      span.innerHTML = templateString(
        getLangString("TOWNSHIP_TASKS", "REQ_2"),
        {
          qty1: `${numberWithCommas(progress)}`,
          qty2: `${numberWithCommas(monsterGoal.quantity)}`,
          monsterImg: img.outerHTML,
          monsterName: monsterGoal.monster.name,
        }
      );
      list.append(span);
      element.append(list);
    });
    return element;
  }
  createTaskSkillTask(task) {
    if (task.goals.skillXP.length <= 0) return createElement("div");
    const element = createElement("ul", {
      classList: [
        "nav-main",
        "nav-main-horizontal",
        "nav-main-horizontal-override",
        "font-w400",
        "font-size-sm",
      ],
    });
    task.goals.skillXP.forEach((skillGoal, id) => {
      const list = createElement("li", {
        classList: [
          `block`,
          `block-rounded-double`,
          `text-center`,
          `p-1`,
          `mr-2`,
          `${
            this.isSkillTaskComplete(skillGoal)
              ? "spell-selected"
              : "spell-not-selected"
          }`,
        ],
      });
      const img = createElement("img", {
        classList: ["skill-icon-xs", "mr-1"],
      });
      img.src = skillGoal.skill.media;
      const span = createElement("span");
      const progress =
        skillGoal.skill.xp > skillGoal.quantity
          ? skillGoal.quantity
          : Math.floor(skillGoal.skill.xp);
      span.innerHTML = templateString(
        getLangString("TOWNSHIP_TASKS", "REQ_0"),
        {
          qty1: `${numberWithCommas(progress)}`,
          qty2: `${numberWithCommas(skillGoal.quantity)}`,
          skillIcon: img.outerHTML,
          skillName: skillGoal.skill.name,
        }
      );
      list.append(span);
      element.append(list);
    });
    return element;
  }
  createTaskTownshipBuildingTask(task) {
    if (task.goals.buildings.length <= 0) return createElement("div");
    const element = createElement("ul", {
      classList: [
        "nav-main",
        "nav-main-horizontal",
        "nav-main-horizontal-override",
        "font-w400",
        "font-size-sm",
      ],
    });
    task.goals.buildings.forEach((buildingProgress, id) => {
      const list = createElement("li", {
        classList: [
          `block`,
          `block-rounded-double`,
          `text-center`,
          `p-1`,
          `mr-2`,
          `${
            this.isTownshipBuildingTaskComplete(buildingProgress)
              ? "spell-selected"
              : "spell-not-selected"
          }`,
        ],
      });
      const img = createElement("img", {
        classList: ["skill-icon-xs", "mr-1"],
      });
      img.src = buildingProgress.building.media;
      const span = createElement("span");
      const count = game.township.countNumberOfBuildings(
        buildingProgress.building
      );
      const progress =
        count > buildingProgress.quantity ? buildingProgress.quantity : count;
      span.innerHTML = templateString(
        getLangString("TOWNSHIP_TASKS", "REQ_1"),
        {
          qty1: `${numberWithCommas(progress)}`,
          qty2: `${numberWithCommas(buildingProgress.quantity)}`,
          buildingIcon: img.outerHTML,
          buildingName: buildingProgress.building.name,
        }
      );
      list.append(span);
      element.append(list);
    });
    return element;
  }
  createTaskRewards(task) {
    const element = createElement("div", {
      classList: ["font-w600", "text-success"],
      text: "Rewards:",
    });
    const ul = createElement("ul", {
      classList: [
        "nav-main",
        "nav-main-horizontal",
        "nav-main-horizontal-override",
        "font-w400",
        "font-size-sm",
      ],
    });
    if (task.rewards.gp > 0) ul.append(this.createTaskGPReward(task));
    if (task.rewards.slayerCoins > 0)
      ul.append(this.createTaskSlayerCoinReward(task));
    task.rewards.items.forEach(({ item, quantity }) => {
      ul.append(this.createTaskItemsReward(item, quantity));
    });
    task.rewards.skillXP.forEach(({ skill, quantity }) => {
      ul.append(this.createTaskSkillXPReward(skill, quantity));
    });
    task.rewards.townshipResources.forEach(({ resource, quantity }) => {
      ul.append(this.createTaskTownshipResourceReward(resource, quantity));
    });
    element.append(ul);
    if (this.checkTaskCompletion(task)) {
      const btn = createElement("button", {
        classList: ["btn", "btn-sm", "btn-success"],
        text: getLangString("TOWNSHIP_TASKS", "CLAIM_REWARDS"),
      });
      btn.onclick = () => {
        game.township.tasks.completeTask(task);
      };
      element.append(btn);
    }
    return element;
  }
  createTaskGPReward(task) {
    const element = createElement("li", {
      classList: [
        "block",
        "block-rounded-double",
        "text-center",
        "p-1",
        "pr-2",
        "pl-2",
        "mr-2",
      ],
    });
    const img = createElement("img", { classList: ["skill-icon-xs", "mr-1"] });
    img.src = cdnMedia("assets/media/main/coins.svg");
    const span = createElement("span", {
      text: `${numberWithCommas(task.rewards.gp)} `,
    });
    element.append(img);
    element.append(span);
    return element;
  }
  createTaskSlayerCoinReward(task) {
    const element = createElement("li", {
      classList: [
        "block",
        "block-rounded-double",
        "text-center",
        "p-1",
        "pr-2",
        "pl-2",
        "mr-2",
      ],
    });
    const img = createElement("img", { classList: ["skill-icon-xs", "mr-1"] });
    img.src = cdnMedia("assets/media/main/slayer_coins.svg");
    const span = createElement("span", {
      text: `${numberWithCommas(task.rewards.slayerCoins)} `,
    });
    element.append(img);
    element.append(span);
    return element;
  }
  createTaskItemsReward(item, quantity) {
    const list = createElement("li", {
      classList: [
        "block",
        "block-rounded-double",
        "text-center",
        "p-1",
        "pr-2",
        "pl-2",
        "mr-2",
      ],
    });
    const img = createElement("img", { classList: ["skill-icon-xs", "mr-1"] });
    img.src = item.media;
    const preSpan = createElement("span", {
      text: `${numberWithCommas(quantity)} `,
    });
    const postSpan = createElement("span", { text: ` ${item.name}` });
    list.append(preSpan);
    list.append(img);
    list.append(postSpan);
    return list;
  }
  createTaskSkillXPReward(skill, quantity) {
    const list = createElement("li", {
      classList: [
        "block",
        "block-rounded-double",
        "text-center",
        "p-1",
        "pr-2",
        "pl-2",
        "mr-2",
      ],
    });
    const img = createElement("img", { classList: ["skill-icon-xs", "mr-1"] });
    img.src = skill.media;
    const preSpan = createElement("span", {
      text: `${numberWithCommas(quantity)} `,
    });
    const postSpan = createElement("span", { text: ` ${skill.name} Skill XP` });
    list.append(preSpan);
    list.append(img);
    list.append(postSpan);
    return list;
  }
  createTaskTownshipResourceReward(resource, quantity) {
    const list = createElement("li", {
      classList: [
        "block",
        "block-rounded-double",
        "text-center",
        "p-1",
        "pr-2",
        "pl-2",
        "mr-2",
      ],
    });
    const img = createElement("img", { classList: ["skill-icon-xs", "mr-1"] });
    img.src = resource.media;
    const preSpan = createElement("span", {
      text: `${numberWithCommas(quantity)} `,
    });
    const postSpan = createElement("span", {
      text: ` ${resource.name} for Township`,
    });
    list.append(preSpan);
    list.append(img);
    list.append(postSpan);
    return list;
  }
  claimTaskRewards(task) {
    const rewards = new Rewards(this.game);
    const taskRewards = task.rewards;
    if (taskRewards.gp > 0) rewards.addGP(taskRewards.gp);
    if (taskRewards.slayerCoins > 0)
      rewards.addSlayerCoins(taskRewards.slayerCoins);
    taskRewards.items.forEach(({ item, quantity }) => {
      rewards.addItem(item, quantity);
    });
    taskRewards.skillXP.forEach(({ skill, quantity }) => {
      rewards.addXP(skill, quantity);
    });
    taskRewards.townshipResources.forEach(({ resource, quantity }) => {
      resource.amount += quantity;
    });
    rewards.forceGiveRewards();
    townshipUI.updateResourceAmounts();
    if (this.activeTaskCategory !== "None")
      this.showTaskCategory(this.activeTaskCategory);
  }
  showAllTaskCategories() {
    const element = townshipUI.defaultElements.div.tasks;
    element.innerHTML = "";
    const row = createElement("div", { classList: ["row"] });
    row.append(this.createTaskCompletedBreakdown());
    row.append(this.createTaskButtonHeader());
    row.append(this.createTaskCategory("TownshipTutorial"));
    row.append(this.createTaskCategory("Easy"));
    row.append(this.createTaskCategory("Normal"));
    row.append(this.createTaskCategory("Hard"));
    row.append(this.createTaskCategory("VeryHard"));
    row.append(this.createTaskCategory("Elite"));
    element.append(row);
    this.activeTaskCategory = "None";
  }
  showTaskCategory(category) {
    if (this.isTaskCategoryComplete(category)) return;
    if (category !== "TownshipTutorial" && this.tasksCompleted < 3) {
      notifyPlayer(
        game.township,
        "You must complete at least 3 Township Starter Guide Tasks before you can start other tasks.",
        "danger"
      );
      return;
    }
    const element = townshipUI.defaultElements.div.tasks;
    element.innerHTML = "";
    const row = createElement("div", { classList: ["row"] });
    row.append(this.createTaskCompletedBreakdown());
    row.append(this.createTaskButtonHeader());
    if (category === "TownshipTutorial") {
      const div = createElement("div", { classList: ["col-12", "mb-2"] });
      const btn = createElement("button", {
        classList: ["btn", "btn-sm", "btn-danger"],
        text: "Skip Tutorial",
      });
      btn.onclick = () => this.game.township.tasks.skipTownshipTutorial();
      div.appendChild(btn);
      row.append(div);
    }
    this.tasks.forEach((task) => {
      if (
        task.category === category &&
        !this.completedTasks.has(task) &&
        this.isTaskRequirementMet(task)
      )
        row.append(this.createTaskElement(task));
    });
    element.append(row);
    this.activeTaskCategory = category;
  }
  createTaskCategory(category) {
    const element = createElement("div", {
      classList: ["col-12", "col-md-6", "col-xl-4", "mb-3"],
    });
    element.append(this.createTaskLinkCategory(category));
    return element;
  }
  createTaskLinkCategory(category) {
    const element = createElement("a", {
      classList: [
        "block",
        "block-rounded",
        "block-link-pop",
        "pointer-enabled",
      ],
    });
    element.onclick = () => this.showTaskCategory(category);
    const content = createElement("div", {
      classList: [
        "block-content",
        "block-content-full",
        this.getTownshipTaskCategoryBG(category),
      ],
    });
    const media = createElement("div", {
      classList: ["media", "d-flex", "align-items-center", "push", "mb-0"],
    });
    const img = createElement("img", { classList: ["resize-48", "mr-2"] });
    img.src = this.getTownshipTaskCategoryIcon(category);
    const body = createElement("div", {
      classList: ["media-body", "text-left"],
    });
    const title = createElement("h4", {
      classList: ["font-w600", "text-left", "text-white", "mb-0"],
      text: this.getTownshipTaskCategoryName(category),
    });
    if (this.checkForTaskReadyInCategory(category)) {
      const icon = createElement("i", {
        classList: ["fa", "fa-exclamation-circle", "ml-1", "text-success"],
      });
      title.append(icon);
    }
    const subtitle = createElement("h5", {
      classList: [
        "font-size-sm",
        "font-w400",
        "text-left",
        "text-warning",
        "mb-1",
      ],
      id: `task-category-${category}-progress-text`,
    });
    const current = this.getCompletedTaskCountInCategory(category);
    const total = this.countTotalTasksInCategory(category);
    subtitle.append(`${current} / ${total}`);
    const progress = createElement("div", {
      classList: ["progress", "active"],
    });
    progress.style.height = "5px";
    const progressBar = createElement("div", {
      classList: ["progress-bar", "bg-info"],
      id: `task-category-${category}-progress-bar`,
    });
    progressBar.style.width = `${(current / total) * 100}%`;
    progressBar.ariaRoleDescription = "progressbar";
    progressBar.ariaValueNow = `${(current / total) * 100}`;
    progressBar.ariaValueMin = "0";
    progressBar.ariaValueMax = "100";
    if (this.isTaskCategoryComplete(category))
      progressBar.classList.replace("bg-info", "bg-success");
    progress.append(progressBar);
    body.append(title, subtitle, progress);
    media.append(img, body);
    content.append(media);
    element.append(content);
    return element;
  }
  updateAllTaskProgress() {
    this.updateTaskProgress("TownshipTutorial");
    this.updateTaskProgress("Easy");
    this.updateTaskProgress("Normal");
    this.updateTaskProgress("Hard");
    this.updateTaskProgress("VeryHard");
    this.updateTaskProgress("Elite");
  }
  updateTaskProgress(category) {
    const progress = this.getCompletedTaskCountInCategory(category);
    const total = this.countTotalTasksInCategory(category);
    const progressText = document.getElementById(
      `task-category-${category}-progress-text`
    );
    const progressBar = document.getElementById(
      `task-category-${category}-progress-bar`
    );
    if (progressText && progressBar) {
      progressBar.style.width = `${(progress / total) * 100}%`;
      progressBar.ariaValueNow = `${(progress / total) * 100}`;
    }
  }
  getTownshipTaskCategoryIcon(category) {
    switch (category) {
      case "Easy":
        return "assets/media/skills/combat/combat.svg";
      case "Normal":
        return "assets/media/skills/combat/combat.svg";
      case "Hard":
        return "assets/media/skills/combat/combat.svg";
      case "VeryHard":
        return "assets/media/skills/combat/combat.svg";
      case "Elite":
        return "assets/media/skills/combat/combat.svg";
      case "TownshipTutorial":
        return "assets/media/skills/township/township.svg";
    }
  }
  getTownshipTaskCategoryName(category) {
    switch (category) {
      case "Easy":
        return getLangString("COMBAT_MISC", "23");
      case "Normal":
        return getLangString("COMBAT_MISC", "24");
      case "Hard":
        return getLangString("COMBAT_MISC", "25");
      case "VeryHard":
        return getLangString("COMBAT_MISC", "98");
      case "Elite":
        return getLangString("COMBAT_MISC", "26");
      case "TownshipTutorial":
        return getLangString("TOWNSHIP_MENU", "TUTORIAL");
    }
  }
  getTownshipTaskCategoryBG(category) {
    switch (category) {
      case "Easy":
        return "bg-easy-task";
      case "Normal":
        return "bg-normal-task";
      case "Hard":
        return "bg-hard-task";
      case "VeryHard":
        return "bg-very-hard-task";
      case "Elite":
        return "bg-elite-task";
      case "TownshipTutorial":
        return `bg-township`;
    }
  }
  countTotalTasksInCategory(category) {
    return this.tasks.reduce((total, task) => {
      if (task.category === category) return total + 1;
      return total;
    }, 0);
  }
  isPlayerLookingAtTask(task) {
    var _a;
    return (
      ((_a = this.game.openPage) === null || _a === void 0 ? void 0 : _a.id) ===
        "melvorD:Township" && this.activeTaskCategory === task.category
    );
  }
}
