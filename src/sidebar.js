"use strict";
class Sidebar {
  constructor(rootSelector) {
    this.rootSelector = rootSelector;
    this.rendered = false;
    this.categories = new Map();
    this.categoriesOrder = [];
  }
  get isRendered() {
    return this.rendered;
  }
  render() {
    if (this.rendered) return;
    this.rootEl = document.querySelector(this.rootSelector) || undefined;
    if (!this.rootEl)
      throw new Error(
        `Cannot render sidebar. Root selector "${this.rootSelector}" does not exist on the page.`
      );
    this.rendered = true;
    this.renderCategories();
  }
  getCategory(id) {
    return this.categories.get(id);
  }
  getAllCategories() {
    return this.categoriesOrder
      .map((c) => this.categories.get(c))
      .filter((c) => c);
  }
  addCategory(id, config) {
    const category = new SidebarCategory(id, config);
    this.categories.set(id, category);
    this.categoriesOrder.push(id);
    if (config) this.configureCategory(id, config);
    if (this.rendered) this.renderCategories();
    return category;
  }
  removeCategory(id) {
    const category = this.categories.get(id);
    if (!category) return;
    category.removeAllItems();
    if (category.rootEl) category.rootEl.remove();
    this.categoriesOrder.splice(this.categoriesOrder.indexOf(id), 1);
    this.categories.delete(id);
  }
  removeAllCategories() {
    for (const id of [...this.categoriesOrder]) {
      this.removeCategory(id);
    }
  }
  configureCategory(id, config) {
    const category = this.categories.get(id);
    if (!category) return;
    this.orderCategory(id, config);
    category.configure(config);
  }
  orderCategory(id, config) {
    if (config.before == undefined && config.after == undefined) return;
    if (config.before != undefined && config.after != undefined)
      throw new Error(
        'A "before" and "after" configuration option cannot be defined at the same time.'
      );
    const currentIndex = this.categoriesOrder.indexOf(id);
    const target = config.before || config.after;
    const targetIndex = config.before
      ? this.categoriesOrder.indexOf(config.before)
      : config.after
      ? this.categoriesOrder.indexOf(config.after) + 1
      : -1;
    if (targetIndex === -1 || (config.after && targetIndex === 0))
      throw new Error(`No such item "${target}"`);
    if (targetIndex === currentIndex) return;
    this.categoriesOrder.splice(currentIndex, 1);
    this.categoriesOrder.splice(
      targetIndex > currentIndex ? targetIndex - 1 : targetIndex,
      0,
      id
    );
    this.renderCategories();
  }
  renderCategories() {
    if (!this.rendered) return;
    this.categoriesOrder
      .map((id) => this.categories.get(id))
      .forEach((category) => {
        if (!category) return;
        if (!category.isRendered) category.render();
        this.rootEl.appendChild(category.rootEl);
      });
  }
}
class SidebarCategory {
  constructor(id, config = {}) {
    this.id = id;
    this.config = config;
    this.rendered = false;
    this.expanded = true;
    this.items = new Map();
    this.itemsOrder = [];
  }
  get isRendered() {
    return this.rendered;
  }
  configure(config) {
    if (!config) return;
    this.update(config);
    if (config.before) this.config.after = undefined;
    else if (config.after) this.config.before = undefined;
    this.config = Object.assign(Object.assign({}, this.config), config);
  }
  render() {
    if (this.rendered) return;
    this.rootEl = createElement("li");
    this.categoryEl = createElement("div", {
      classList: ["nav-main-heading"],
      parent: this.rootEl,
    });
    this.nameEl = createElement("span", {
      text: this.id,
      parent: this.categoryEl,
    });
    this.rendered = true;
    this.update(this.config, true);
    this.renderItems();
    this.toggle(this.expanded);
    if (this.config.onRender) {
      this.config.onRender({
        rootEl: this.rootEl,
        categoryEl: this.categoryEl,
        nameEl: this.nameEl,
        toggleEl: this.toggleEl,
      });
    }
  }
  toggle(force) {
    var _a, _b;
    if (!this.config.toggleable) return;
    this.expanded = force !== undefined ? force : !this.expanded;
    if (!this.rendered) return;
    (_a = this.toggleEl) === null || _a === void 0
      ? void 0
      : _a.classList.toggle("fa-eye", this.expanded);
    (_b = this.toggleEl) === null || _b === void 0
      ? void 0
      : _b.classList.toggle("fa-eye-slash", !this.expanded);
    for (const [_id, item] of this.items) {
      if (item.ignoreToggle || !item.rootEl) continue;
      item.rootEl.classList.toggle("d-none", !this.expanded);
    }
  }
  click() {
    if (typeof this.config.onClick !== "function") return;
    this.config.onClick();
  }
  getItem(id) {
    return this.items.get(id);
  }
  getAllItems() {
    return this.itemsOrder.map((i) => this.items.get(i)).filter((i) => i);
  }
  addItem(id, config) {
    const item = new SidebarItem(id, config);
    this.items.set(id, item);
    this.itemsOrder.push(id);
    if (config) this.configureItem(id, config);
    if (this.rendered) this.renderItems();
    return item;
  }
  removeItem(id) {
    const item = this.items.get(id);
    if (!item) return;
    item.removeAllSubitems();
    if (item.rootEl) item.rootEl.remove();
    this.itemsOrder.splice(this.itemsOrder.indexOf(id), 1);
    this.items.delete(id);
  }
  removeAllItems() {
    for (const id of [...this.itemsOrder]) {
      this.removeItem(id);
    }
  }
  configureItem(id, config) {
    const item = this.items.get(id);
    if (!item) return;
    this.orderItem(id, config);
    item.configure(config);
  }
  orderItem(id, config) {
    if (config.before == undefined && config.after == undefined) return;
    if (config.before != undefined && config.after != undefined)
      throw new Error(
        'A "before" and "after" configuration option cannot be defined at the same time.'
      );
    const currentIndex = this.itemsOrder.indexOf(id);
    const target = config.before || config.after;
    const targetIndex = config.before
      ? this.itemsOrder.indexOf(config.before)
      : config.after
      ? this.itemsOrder.indexOf(config.after) + 1
      : -1;
    if (targetIndex === -1 || (config.after && targetIndex === 0))
      throw new Error(`No such item "${target}"`);
    if (targetIndex === currentIndex) return;
    this.itemsOrder.splice(currentIndex, 1);
    this.itemsOrder.splice(
      targetIndex > currentIndex ? targetIndex - 1 : targetIndex,
      0,
      id
    );
    this.renderItems();
  }
  renderItems() {
    if (!this.rendered) return;
    this.itemsOrder
      .map((id) => this.items.get(id))
      .reverse()
      .forEach((item) => {
        if (!item) return;
        if (!item.isRendered) item.render();
        this.categoryEl.after(item.rootEl);
      });
  }
  update(config, initialRender = false) {
    this.updateRootEl(config, initialRender);
    this.updateCategoryEl(config, initialRender);
    this.updateNameEl(config, initialRender);
    this.updateToggle(config);
  }
  updateRootEl(config, initialRender = false) {
    if (!this.rootEl) return;
    if (config.rootClass !== undefined) {
      if (!initialRender && this.config.rootClass) {
        this.rootEl.classList.remove(...this.config.rootClass.split(" "));
      }
      if (config.rootClass !== null)
        this.rootEl.classList.add(...config.rootClass.split(" "));
    }
  }
  updateCategoryEl(config, initialRender = false) {
    if (!this.categoryEl) return;
    if (config.categoryClass !== undefined) {
      if (!initialRender && this.config.categoryClass) {
        this.categoryEl.classList.remove(
          ...this.config.categoryClass.split(" ")
        );
      }
      if (config.categoryClass !== null)
        this.categoryEl.classList.add(...config.categoryClass.split(" "));
    }
    if (config.onClick !== undefined) {
      if (!initialRender && config.onClick === null && this.config.onClick) {
        this.categoryEl.removeEventListener("click", this.click);
      } else if (
        (initialRender && config.onClick) ||
        (!initialRender && config.onClick && !this.config.onClick)
      ) {
        this.categoryEl.addEventListener("click", this.click.bind(this));
      }
    }
  }
  updateNameEl(config, initialRender = false) {
    if (!this.nameEl) return;
    if (config.nameClass !== undefined) {
      if (!initialRender && this.config.nameClass) {
        this.nameEl.classList.remove(...this.config.nameClass.split(" "));
      }
      if (config.nameClass !== null)
        this.nameEl.classList.add(...config.nameClass.split(" "));
    }
    if (config.name !== undefined) {
      while (this.nameEl.firstChild) {
        this.nameEl.removeChild(this.nameEl.lastChild);
      }
      const toAppend =
        config.name === null
          ? document.createTextNode(this.id)
          : typeof config.name === "string"
          ? document.createTextNode(config.name)
          : config.name;
      this.nameEl.appendChild(toAppend);
    }
  }
  updateToggle(config) {
    if (!this.rendered) return;
    if (config.toggleable !== undefined) {
      if (config.toggleable && !this.toggleEl) {
        this.toggleEl = createElement("i", {
          classList: ["far", "fa-eye", "text-muted", "ml-2"],
          parent: this.categoryEl,
        });
        this.toggleEl.addEventListener("click", () => this.toggle());
      } else if (!config.toggleable && this.toggleEl) {
        this.toggleEl.remove();
        this.toggleEl = undefined;
      }
    }
  }
}
class SidebarItem {
  constructor(id, config = {}) {
    this.id = id;
    this.config = config;
    this.rendered = false;
    this.expanded = false;
    this.subitems = new Map();
    this.subitemsOrder = [];
    this.configure(config);
  }
  get isRendered() {
    return this.rendered;
  }
  get ignoreToggle() {
    return !!this.config.ignoreToggle;
  }
  configure(config) {
    if (!config) return;
    this.update(config);
    if (config.before) this.config.after = undefined;
    else if (config.after) this.config.before = undefined;
    this.config = Object.assign(Object.assign({}, this.config), config);
  }
  render() {
    if (this.rendered) return;
    this.rootEl = createElement("li", { classList: ["nav-main-item"] });
    this.itemEl = createElement("a", {
      classList: ["nav-main-link", "nav-compact", "pointer-enabled"],
      parent: this.rootEl,
    });
    this.iconEl = createElement("span", {
      classList: ["nav-img"],
      parent: this.itemEl,
    });
    this.nameEl = createElement("span", {
      text: this.id,
      classList: ["nav-main-link-name"],
      parent: this.itemEl,
    });
    this.rendered = true;
    this.update(this.config, true);
    this.renderSubitems();
    this.toggle(this.expanded);
    if (this.config.onRender) {
      this.config.onRender({
        rootEl: this.rootEl,
        itemEl: this.itemEl,
        iconEl: this.iconEl,
        nameEl: this.nameEl,
        asideEl: this.asideEl,
        subMenuEl: this.subMenuEl,
      });
    }
  }
  toggle(force) {
    if (!this.subitems.size) return;
    this.expanded = force !== undefined ? force : !this.expanded;
    if (!this.rendered) return;
    this.rootEl.classList.toggle("open", this.expanded);
  }
  click() {
    if (typeof this.config.onClick !== "function") return;
    this.config.onClick();
  }
  getSubitem(id) {
    return this.subitems.get(id);
  }
  getAllSubitems() {
    return this.subitemsOrder.map((s) => this.subitems.get(s)).filter((s) => s);
  }
  addSubitem(id, config) {
    const subitem = new SidebarSubitem(id, config);
    this.subitems.set(id, subitem);
    this.subitemsOrder.push(id);
    if (config) this.configureSubitem(id, config);
    if (this.rendered) this.renderSubitems();
    return subitem;
  }
  removeSubitem(id, removingAll = false) {
    const subitem = this.subitems.get(id);
    if (!subitem) return;
    if (subitem.rootEl) subitem.rootEl.remove();
    this.subitemsOrder.splice(this.subitemsOrder.indexOf(id), 1);
    this.subitems.delete(id);
    if (!removingAll) this.renderSubitems();
  }
  removeAllSubitems() {
    for (const id of [...this.subitemsOrder]) {
      this.removeSubitem(id, true);
    }
    this.renderSubitems();
  }
  configureSubitem(id, config) {
    const subitem = this.subitems.get(id);
    if (!subitem) return;
    this.orderSubitem(id, config);
    subitem.configure(config);
  }
  orderSubitem(id, config) {
    if (config.before == undefined && config.after == undefined) return;
    if (config.before != undefined && config.after != undefined)
      throw new Error(
        'A "before" and "after" configuration option cannot be defined at the same time.'
      );
    const currentIndex = this.subitemsOrder.indexOf(id);
    const target = config.before || config.after;
    const targetIndex = config.before
      ? this.subitemsOrder.indexOf(config.before)
      : config.after
      ? this.subitemsOrder.indexOf(config.after) + 1
      : -1;
    if (targetIndex === -1 || (config.after && targetIndex === 0))
      throw new Error(`No such subitem "${target}"`);
    if (targetIndex === currentIndex) return;
    this.subitemsOrder.splice(currentIndex, 1);
    this.subitemsOrder.splice(
      targetIndex > currentIndex ? targetIndex - 1 : targetIndex,
      0,
      id
    );
    this.renderSubitems();
  }
  renderSubitems() {
    if (!this.rendered) return;
    if (!this.subitems.size) {
      if (this.subMenuEl) {
        this.subMenuEl.remove();
        this.subMenuEl = undefined;
        this.itemEl.classList.remove("nav-main-link-submenu");
        this.itemEl.dataset.toggle = undefined;
      }
      return;
    }
    if (!this.subMenuEl) {
      this.subMenuEl = createElement("ul", {
        classList: ["nav-main-submenu"],
        parent: this.rootEl,
      });
      this.itemEl.classList.add("nav-main-link-submenu");
      this.itemEl.dataset.toggle = "submenu";
    }
    this.subitemsOrder
      .map((id) => this.subitems.get(id))
      .forEach((subitem) => {
        if (!subitem) return;
        if (!subitem.isRendered) subitem.render();
        this.subMenuEl.appendChild(subitem.rootEl);
      });
  }
  update(config, initialRender = false) {
    this.updateRoot(config, initialRender);
    this.updateItem(config, initialRender);
    this.updateIcon(config, initialRender);
    this.updateName(config, initialRender);
    this.updateAside(config, initialRender);
  }
  updateRoot(config, initialRender = false) {
    if (!this.rootEl) return;
    if (config.rootClass !== undefined) {
      if (!initialRender && this.config.rootClass) {
        this.rootEl.classList.remove(...this.config.rootClass.split(" "));
      }
      if (config.rootClass !== null)
        this.rootEl.classList.add(...config.rootClass.split(" "));
    }
  }
  updateItem(config, initialRender = false) {
    if (!this.itemEl) return;
    if (config.itemClass !== undefined) {
      if (!initialRender && this.config.itemClass) {
        this.itemEl.classList.remove(...this.config.itemClass.split(" "));
      }
      if (config.itemClass !== null)
        this.itemEl.classList.add(...config.itemClass.split(" "));
    }
    if (config.link !== undefined) {
      if (!initialRender && config.link === null && this.config.link) {
        this.itemEl.removeAttribute("href");
        this.itemEl.removeAttribute("target");
        this.itemEl.removeEventListener("click", openSidebarLink);
      } else if (config.link) {
        this.itemEl.href = config.link;
        this.itemEl.target = "_blank";
        if (initialRender || !this.config.link)
          this.itemEl.addEventListener("click", openSidebarLink);
      }
    }
    if (config.onClick !== undefined) {
      if (!initialRender && config.onClick === null && this.config.onClick) {
        this.itemEl.removeEventListener("click", this.click);
      } else if (
        (initialRender && config.onClick) ||
        (!initialRender && config.onClick && !this.config.onClick)
      ) {
        this.itemEl.addEventListener("click", this.click.bind(this));
      }
    }
  }
  updateIcon(config, initialRender = false) {
    if (!this.rendered) return;
    if (config.icon !== undefined) {
      while (this.iconEl.firstChild) {
        this.iconEl.removeChild(this.iconEl.lastChild);
      }
      if (config.icon !== null) {
        const toAppend =
          config.icon instanceof Node
            ? config.icon
            : createElement("img", { attributes: [["src", config.icon]] });
        this.iconEl.appendChild(toAppend);
      }
    }
    if (config.iconClass !== undefined) {
      if (!initialRender && this.config.iconClass) {
        this.iconEl.classList.remove(...this.config.iconClass.split(" "));
      }
      if (config.iconClass !== null)
        this.iconEl.classList.add(...config.iconClass.split(" "));
    }
  }
  updateName(config, initialRender = false) {
    if (!this.nameEl) return;
    if (config.nameClass !== undefined) {
      if (!initialRender && this.config.nameClass) {
        this.nameEl.classList.remove(...this.config.nameClass.split(" "));
      }
      if (config.nameClass !== null)
        this.nameEl.classList.add(...config.nameClass.split(" "));
    }
    if (config.name !== undefined) {
      while (this.nameEl.firstChild) {
        this.nameEl.removeChild(this.nameEl.lastChild);
      }
      const toAppend =
        config.name === null
          ? document.createTextNode(this.id)
          : config.name instanceof Node
          ? config.name
          : document.createTextNode(config.name);
      this.nameEl.appendChild(toAppend);
    }
  }
  updateAside(config, initialRender = false) {
    if (!this.rendered) return;
    if (config.aside !== undefined) {
      if (config.aside) {
        if (!this.asideEl)
          this.asideEl = createElement("small", { parent: this.itemEl });
        while (this.asideEl.firstChild) {
          this.asideEl.removeChild(this.asideEl.lastChild);
        }
        const toAppend =
          config.aside instanceof Node
            ? config.aside
            : document.createTextNode(config.aside);
        this.asideEl.appendChild(toAppend);
      } else if (config.aside === null && this.asideEl) {
        this.asideEl.remove();
        this.asideEl = undefined;
      }
    }
    if (config.asideClass !== undefined && this.asideEl) {
      if (!initialRender && this.config.asideClass) {
        this.asideEl.classList.remove(...this.config.asideClass.split(" "));
      }
      if (config.asideClass !== null)
        this.asideEl.classList.add(...config.asideClass.split(" "));
    }
  }
}
class SidebarSubitem {
  constructor(id, config = {}) {
    this.id = id;
    this.config = config;
    this.rendered = false;
    this.configure(config);
  }
  get isRendered() {
    return this.rendered;
  }
  configure(config) {
    if (!config) return;
    this.update(config);
    if (config.before) this.config.after = undefined;
    else if (config.after) this.config.before = undefined;
    this.config = Object.assign(Object.assign({}, this.config), config);
  }
  render() {
    if (this.rendered) return;
    this.rootEl = createElement("li", { classList: ["nav-main-item"] });
    this.subitemEl = createElement("a", {
      classList: ["nav-main-link", "nav-compact", "pointer-enabled"],
      parent: this.rootEl,
    });
    this.nameEl = createElement("span", {
      text: this.id,
      classList: ["nav-main-link-name"],
      parent: this.subitemEl,
    });
    this.rendered = true;
    this.update(this.config, true);
    if (this.config.onRender) {
      this.config.onRender({
        rootEl: this.rootEl,
        subitemEl: this.subitemEl,
        nameEl: this.nameEl,
        asideEl: this.asideEl,
      });
    }
  }
  click() {
    if (typeof this.config.onClick !== "function") return;
    this.config.onClick();
  }
  update(config, initialRender = false) {
    this.updateRoot(config, initialRender);
    this.updateSubitem(config, initialRender);
    this.updateName(config, initialRender);
    this.updateAside(config, initialRender);
  }
  updateRoot(config, initialRender = false) {
    if (!this.rootEl) return;
    if (config.rootClass !== undefined) {
      if (!initialRender && this.config.rootClass) {
        this.rootEl.classList.remove(...this.config.rootClass.split(" "));
      }
      if (config.rootClass !== null)
        this.rootEl.classList.add(...config.rootClass.split(" "));
    }
  }
  updateSubitem(config, initialRender = false) {
    if (!this.subitemEl) return;
    if (config.subitemClass !== undefined) {
      if (!initialRender && this.config.subitemClass) {
        this.subitemEl.classList.remove(...this.config.subitemClass.split(" "));
      }
      if (config.subitemClass !== null)
        this.subitemEl.classList.add(...config.subitemClass.split(" "));
    }
    if (config.link !== undefined) {
      if (!initialRender && config.link === null && this.config.link) {
        this.subitemEl.removeAttribute("href");
        this.subitemEl.removeAttribute("target");
        this.subitemEl.removeEventListener("click", openSidebarLink);
      } else if (config.link) {
        this.subitemEl.href = config.link;
        this.subitemEl.target = "_blank";
        if (initialRender || !this.config.link)
          this.subitemEl.addEventListener("click", openSidebarLink);
      }
    }
    if (config.onClick !== undefined) {
      if (!initialRender && config.onClick === null && this.config.onClick) {
        this.subitemEl.removeEventListener("click", this.click);
      } else if (
        (initialRender && config.onClick) ||
        (!initialRender && config.onClick && !this.config.onClick)
      ) {
        this.subitemEl.addEventListener("click", this.click.bind(this));
      }
    }
  }
  updateName(config, initialRender = false) {
    if (!this.nameEl) return;
    if (config.nameClass !== undefined) {
      if (!initialRender && this.config.nameClass) {
        this.nameEl.classList.remove(...this.config.nameClass.split(" "));
      }
      if (config.nameClass !== null)
        this.nameEl.classList.add(...config.nameClass.split(" "));
    }
    if (config.name !== undefined) {
      while (this.nameEl.firstChild) {
        this.nameEl.removeChild(this.nameEl.lastChild);
      }
      const toAppend =
        config.name === null
          ? document.createTextNode(this.id)
          : config.name instanceof Node
          ? config.name
          : document.createTextNode(config.name);
      this.nameEl.appendChild(toAppend);
    }
  }
  updateAside(config, initialRender = false) {
    if (!this.rendered) return;
    if (config.aside !== undefined) {
      if (config.aside) {
        if (!this.asideEl)
          this.asideEl = createElement("small", { parent: this.subitemEl });
        while (this.asideEl.firstChild) {
          this.asideEl.removeChild(this.asideEl.lastChild);
        }
        const toAppend =
          config.aside instanceof Node
            ? config.aside
            : document.createTextNode(config.aside);
        this.asideEl.appendChild(toAppend);
      } else if (config.aside === null && this.asideEl) {
        this.asideEl.remove();
        this.asideEl = undefined;
      }
    }
    if (config.asideClass !== undefined && this.asideEl) {
      if (!initialRender && this.config.asideClass) {
        this.asideEl.classList.remove(...this.config.asideClass.split(" "));
      }
      if (config.asideClass !== null)
        this.asideEl.classList.add(...config.asideClass.split(" "));
    }
  }
}
const sidebar = (() => {
  const sidebar = new Sidebar("#sidebar ul.nav-main");
  function createCategoryWrapper(sidebar, category) {
    return {
      get id() {
        return category.id;
      },
      get rootEl() {
        return category.rootEl;
      },
      get categoryEl() {
        return category.categoryEl;
      },
      get nameEl() {
        return category.nameEl;
      },
      get toggleEl() {
        return category.toggleEl;
      },
      click() {
        category.click();
      },
      toggle(force) {
        category.toggle(force);
      },
      item(id, config, builder) {
        if (config && typeof config === "function") {
          builder = config;
          config = undefined;
        }
        let item = category.getItem(id);
        if (!item) item = category.addItem(id, config);
        else if (config) category.configureItem(id, config);
        const wrappedItem = createItemWrapper(this, item);
        if (builder) builder(wrappedItem);
        return wrappedItem;
      },
      items() {
        return category.getAllItems().map((i) => createItemWrapper(this, i));
      },
      remove() {
        sidebar.removeCategory(category.id);
      },
      removeItem(id) {
        category.removeItem(id);
      },
      removeAllItems() {
        category.removeAllItems();
      },
    };
  }
  function createItemWrapper(category, item) {
    return {
      get id() {
        return item.id;
      },
      get rootEl() {
        return item.rootEl;
      },
      get itemEl() {
        return item.itemEl;
      },
      get iconEl() {
        return item.iconEl;
      },
      get nameEl() {
        return item.nameEl;
      },
      get asideEl() {
        return item.asideEl;
      },
      get subMenuEl() {
        return item.subMenuEl;
      },
      click() {
        item.click();
      },
      toggle(force) {
        item.toggle(force);
      },
      subitem(id, config, builder) {
        if (config && typeof config === "function") {
          builder = config;
          config = undefined;
        }
        let subitem = item.getSubitem(id);
        if (!subitem) subitem = item.addSubitem(id, config);
        else if (config) item.configureSubitem(id, config);
        const wrappedSub = createSubitemWrapper(this, subitem);
        if (builder) builder(wrappedSub);
        return wrappedSub;
      },
      subitems() {
        return item.getAllSubitems().map((s) => createSubitemWrapper(this, s));
      },
      remove() {
        category.removeItem(item.id);
      },
      removeSubitem(id) {
        item.removeSubitem(id);
      },
      removeAllSubitems() {
        item.removeAllSubitems();
      },
      category: category,
    };
  }
  function createSubitemWrapper(item, subitem) {
    return {
      get id() {
        return subitem.id;
      },
      get rootEl() {
        return subitem.rootEl;
      },
      get subitemEl() {
        return subitem.subitemEl;
      },
      get nameEl() {
        return subitem.nameEl;
      },
      get asideEl() {
        return subitem.asideEl;
      },
      click() {
        subitem.click();
      },
      remove() {
        item.removeSubitem(subitem.id);
      },
      item: item,
    };
  }
  return {
    category(id, config, builder) {
      if (config && typeof config === "function") {
        builder = config;
        config = undefined;
      }
      let category = sidebar.getCategory(id);
      if (!category) category = sidebar.addCategory(id, config);
      else if (config) sidebar.configureCategory(id, config);
      const wrappedCat = createCategoryWrapper(this, category);
      if (builder) builder(wrappedCat);
      return wrappedCat;
    },
    categories() {
      return sidebar
        .getAllCategories()
        .map((c) => createCategoryWrapper(this, c));
    },
    removeCategory(id) {
      sidebar.removeCategory(id);
    },
    removeAllCategories() {
      sidebar.removeAllCategories();
    },
    render() {
      sidebar.render();
    },
  };
})();
function openSidebarLink(e) {
  e.preventDefault();
  const target = e.currentTarget;
  openLink(target.href);
  return false;
}
(() => {
  sidebar.category("Gap", { categoryClass: "p-2", name: "" });
  sidebar.category("Test Environment", {
    rootClass: "d-none",
    categoryClass: "pt-1 pb-1 mb-1 bg-danger text-center",
    nameClass: "text-white-75 font-w600",
    name: createElement("span", { children: ["TEST ENVIRONMENT"] }),
    onRender: ({ rootEl }) => (rootEl.id = "test-env"),
  });
  sidebar.category("Expansion 1", {
    categoryClass:
      "pt-1 pb-1 mb-1 bg-dark text-center h5 font-size-xs expansion-1-version",
    nameClass: "text-white-75 font-w600",
    name: createElement("span", {
      children: [
        createElement("i", {
          classList: ["text-success", "fa", "fa-check-circle", "mr-1"],
        }),
        "Throne of the Herald",
      ],
    }),
  });
  sidebar.category("Game Version", {
    categoryClass: "pt-1 pb-1 mb-1 bg-dark text-center pointer-enabled",
    nameClass: "text-white-75 font-w600 announcekit-updates",
    name: createElement("span", {
      children: [
        gameVersion,
        createElement("small", { id: "sidebar-filever" }),
      ],
    }),
    onClick: () => $("#modal-major-update").modal("show"),
    onRender: ({ nameEl }) => {
      nameEl.querySelector("#sidebar-filever").textContent = ` (${
        document.querySelector("#sidebar ul.nav-main").dataset.fileVersion
      })`;
    },
  });
  sidebar.category(
    "Buy Expansion 1",
    { name: "", categoryClass: "p-0 m-0" },
    ({ item }) => {
      item("Buy Expansion 1 Button", {
        rootClass:
          "p-0 mb-1 bg-dark text-center h5 font-size-xs expansion-not-owned d-none",
        iconClass: "d-none",
        name: createElement("a", {
          classList: ["pointer-enabled", "toth-lang-cta"],
          text: "Buy the Throne of the Herald DLC",
        }),
        onClick: () => nativeManager.buyExpansion1Swal(),
      });
    }
  );
  sidebar.category(
    "Demo Version",
    {
      categoryClass:
        "pt-1 pb-1 mb-1 bg-danger text-center h5 font-size-sm demo-version",
      nameClass: "text-white-75 font-w600",
      name: createElement("span", { children: ["Demo Version"] }),
    },
    ({ item }) => {
      item("Buy Button", {
        rootClass: "demo-version mb-2",
        iconClass: "d-none",
        name: createElement("button", {
          classList: ["btn", "btn-sm", "btn-success", "w-100"],
          text: "Buy the Full Game",
        }),
        onClick: () => nativeManager.buyFullGameSwal(),
      });
    }
  );
  sidebar.category("", { categoryClass: "d-none" }, ({ item }) => {
    item("Announcements", {
      rootClass: "d-none",
      icon: cdnMedia("assets/media/main/announcement.svg"),
      nameClass: "text-warning",
      name: "New Announcement",
      asideClass: "text-warning font-size-sm",
      aside: "0",
      onClick: () => {
        $("#modal-playfab-news").modal("show");
        readPlayFabNews();
      },
    });
  });
  sidebar.category("Events", { categoryClass: "d-none" });
  sidebar.category("Combat", {
    name: "",
    toggleable: true,
    onRender: (elements) => {
      elements.nameEl.textContent = getLangString("PAGE_NAME", "Combat");
    },
  });
  sidebar.category("Non-Combat", { toggleable: true });
  sidebar.category("Minigame", {
    name: "",
    onRender: ({ nameEl }) => {
      nameEl.textContent = getLangString("PAGE_NAME_MISC", "1");
    },
  });
  sidebar.category(
    "General",
    {
      name: "",
      onRender: ({ nameEl }) => {
        nameEl.textContent = getLangString("PAGE_NAME_MISC", "2");
      },
    },
    ({ item }) => {
      item("Completion Log", {
        icon: cdnMedia("assets/media/main/completion_log.svg"),
        name: "",
        aside: "-%",
        onRender: ({ asideEl, nameEl }) => {
          if (!asideEl) return;
          asideEl.style.minWidth = "33px";
          nameEl.textContent = getLangString("PAGE_NAME", "CompletionLog");
        },
      });
      item(
        "News",
        {
          icon: cdnMedia("assets/media/main/announcement.svg"),
          name: "",
          onRender: ({ nameEl }) => {
            nameEl.textContent = getLangString("PAGE_NAME_MISC", "9");
          },
        },
        ({ subitem }) => {
          subitem("Recent News", {
            rootClass: "d-none",
            name: "",
            onRender: ({ nameEl }) => {
              nameEl.textContent = getLangString("PAGE_NAME_MISC", "10");
            },
            onClick: () => {
              $("#modal-playfab-news").modal("show");
              readPlayFabNews();
            },
          });
          subitem("Changelog", {
            name: "",
            onRender: ({ nameEl }) => {
              nameEl.textContent = getLangString("PAGE_NAME", "Changelog");
            },
            onClick: () => $("#modal-major-update").modal("show"),
          });
          subitem("Development Roadmap", {
            rootClass: "hide-non-en",
            name: "",
            onRender: ({ nameEl }) => {
              nameEl.textContent = getLangString("PAGE_NAME_MISC", "11");
            },
            onClick: () => $("#modal-major-update").modal("show"),
          });
        }
      );
    }
  );
  sidebar.category(
    "Socials",
    {
      name: "",
      onRender: ({ nameEl }) => {
        nameEl.textContent = getLangString("PAGE_NAME_MISC", "12");
      },
    },
    ({ item }) => {
      item("Wiki", {
        icon: cdnMedia("assets/media/main/wiki_logo.svg?2"),
        name: "",
        onRender: ({ nameEl }) => {
          nameEl.textContent = getLangString("PAGE_NAME_MISC", "13");
        },
        aside: createElement("lang-string", {
          attributes: [
            ["lang-cat", "PAGE_NAME_MISC"],
            ["lang-id", "22"],
          ],
        }),
        onClick: openWikiLink,
      });
      const socialsItems = [
        { name: "Discord", id: 15, link: "https://discord.gg/melvoridle" },
        { name: "Reddit", id: 17, link: "http://reddit.com/r/MelvorIdle" },
        { name: "Twitter", id: 19, link: "http://twitter.com/MelvorIdle" },
      ];
      if (!isSteam() && !isMobile())
        socialsItems.unshift({
          name: "Patreon",
          id: 14,
          link: "https://www.patreon.com/melvoridle",
        });
      for (const s of socialsItems) {
        item(s.name, {
          icon: cdnMedia(`assets/media/main/${s.name.toLowerCase()}.svg`),
          name: "",
          link: s.link,
          onRender: ({ nameEl }) => {
            nameEl.textContent = getLangString("PAGE_NAME_MISC", `${s.id}`);
          },
        });
      }
    }
  );
  sidebar.category(
    "Other",
    {
      name: "",
      onRender: ({ nameEl }) => {
        nameEl.textContent = getLangString("PAGE_NAME_MISC", `2`);
      },
    },
    ({ item }) => {
      item("Report a Bug", {
        iconClass: "d-none",
        nameClass: "font-size-sm",
        name: createElement("small", {
          children: [
            createElement("lang-string", {
              attributes: [
                ["lang-cat", "PAGE_NAME_MISC"],
                ["lang-id", "21"],
              ],
            }),
          ],
        }),
        link: "https://github.com/MelvorIdle/melvoridle.github.io/issues",
      });
      item("Privacy Policy", {
        iconClass: "d-none",
        nameClass: "font-size-sm",
        name: createElement("small", {
          children: [
            createElement("lang-string", {
              attributes: [
                ["lang-cat", "CHARACTER_SELECT"],
                ["lang-id", "9"],
              ],
            }),
          ],
        }),
        onClick: () => $("#modal-privacy").modal("show"),
      });
    }
  );
})();
