"use strict";
class ThievingMenu {
  constructor(containerID) {
    this.areaPanels = new Map();
    this.npcNavs = new Map();
    this.activePanel = undefined;
    const container = document.getElementById(containerID);
    if (container === null)
      throw new Error(`Could not find container with id: ${containerID}`);
    this.container = container;
    game.thieving.areas.forEach((area) => {
      const panelContainer = createElement("div", {
        classList: ["col-12", "col-xl-6"],
        parent: this.container,
        id: "thieving-area-panel-" + area.id,
      })
        .appendChild(
          createElement("div", {
            classList: [
              "block",
              "block-rounded",
              "border-top",
              "border-thieving",
              "border-4x",
            ],
          })
        )
        .appendChild(
          createElement("div", { classList: ["row", "no-gutters"] })
        );
      const areaName = panelContainer
        .appendChild(
          createElement("div", {
            classList: ["col-12", "pointer-enabled"],
            id: "thieving-area-panel-container-" + area.id,
          })
        )
        .appendChild(
          createElement("div", { classList: ["block-content", "text-center"] })
        )
        .appendChild(
          createElement("span", {
            classList: ["h5", "font-w600"],
            text: area.name,
          })
        );
      areaName.before(
        createElement("i", {
          classList: ["fa", "fa-eye", "text-muted", "mr-2", "font-w300"],
          id: "thieving-area-panel-eye-" + area.id,
        })
      );
      const element = document.getElementById(
        "thieving-area-panel-container-" + area.id
      );
      element.onclick = () => game.thieving.onAreaHeaderClick(area);
      const targetContainer = createElement("div", {
        classList: ["col-12", "col-md-6", "thieving-panel-" + area.id],
        parent: panelContainer,
      }).appendChild(
        createElement("div", {
          classList: ["block-content", "block-content-full", "text-center"],
        })
      );
      const infoContainer = createElement("div", {
        classList: ["col-12", "col-md-6", "thieving-panel-" + area.id],
        parent: panelContainer,
      }).appendChild(
        createElement("div", {
          classList: ["block-content", "block-content-full", "text-center"],
        })
      );
      const infoBoxName = createElement("span", { text: "-" });
      const infoBoxImage = createElement("img", {
        classList: ["fishing-img", "m-2"],
      });
      const infoSkillName = createElement("small", {
        text: game.thieving.name,
      });
      createElement("div", {
        classList: ["font-size-sm", "font-w600", "text-center", "tet-muted"],
        parent: infoContainer,
      }).append(
        infoSkillName,
        createElement("br"),
        infoBoxName,
        createElement("br"),
        infoBoxImage
      );
      const infoBoxContainer = createElement("div", {
        classList: ["media", "d-flex", "align-items-center"],
        parent: infoContainer,
      });
      const infoBox = this.createInfoBox(infoBoxContainer);
      const startButton = createElement("button", {
        classList: ["btn", "btn-sm", "btn-success", "m-1", "mt-3"],
        attributes: [["role", "button"]],
        text: getLangString("MENU_TEXT", "PICKPOCKET"),
        parent: infoContainer,
      });
      const dropsButton = createElement("button", {
        classList: ["btn", "btn-sm", "btn-info", "m-1", "mt-3"],
        attributes: [["role", "button"]],
        text: getLangString("MENU_TEXT", "SHOW_DROPS"),
        parent: infoContainer,
      });
      const selectedNPC = -1;
      const barElement = createElement("div", {
        classList: ["progress", "active", "mt-3"],
        attributes: [["style", "height: 5px;"]],
        parent: infoContainer,
      }).appendChild(
        createElement("div", {
          classList: ["progress-bar", "bg-info"],
          attributes: [
            ["role", "progressbar"],
            ["aria-valuenow", "0"],
            ["aria-valuemin", "0"],
            ["aria-valuemax", "100"],
            ["style", "width: 0%;"],
          ],
        })
      );
      const progressBar = new ProgressBar(barElement);
      const panel = {
        panelContainer,
        targetContainer,
        infoContainer,
        infoBoxName,
        infoSkillName,
        infoBoxImage,
        startButton,
        dropsButton,
        progressBar,
        infoBox,
        selectedNPC,
        area,
        areaName,
      };
      this.areaPanels.set(area, panel);
      area.npcs.forEach((npc) => {
        const button = targetContainer
          .appendChild(
            createElement("ul", {
              classList: ["nav", "nav-pills", "nav-justified"],
            })
          )
          .appendChild(createElement("li", { classList: ["nav-item", "mr-1"] }))
          .appendChild(
            createElement("a", {
              classList: [
                "block",
                "block-link-pop",
                "nav-link",
                "border",
                "pointer-enabled",
                "font-w600",
              ],
            })
          );
        const buttonContent = createElement("div", {
          classList: ["media", "d-flex", "align-items-center"],
          parent: button,
        });
        buttonContent
          .appendChild(createElement("div", { classList: ["m-1"] }))
          .appendChild(
            createElement("img", {
              classList: ["skill-icon-sm", "mr-2"],
              attributes: [["src", npc.media]],
            })
          );
        const rightContent = createElement("div", {
          classList: ["media-body"],
          parent: buttonContent,
        });
        const npcName = createElement("span", { text: npc.name });
        const masteryDisplay = createElement("compact-mastery-display");
        masteryDisplay.setMastery(game.thieving, npc);
        rightContent
          .appendChild(createElement("div", { classList: ["text-center"] }))
          .appendChild(
            createElement("h5", {
              classList: [
                "font-w700",
                "text-combat-smoke",
                "mb-1",
                "d-flex",
                "flex-wrap",
                "justify-content-center",
              ],
            })
          )
          .append(npcName, masteryDisplay);
        const success = createElement("span", {
          text: `Success Rate: ${formatPercent(69)}`,
        });
        const maxHit = createElement("span", { text: "Max Hit: 69" });
        const perception = createElement("span", {
          text: templateLangString("MENU_TEXT", "PERCEPTION", {
            value: `${npc.perception}`,
          }),
        });
        rightContent
          .appendChild(
            createElement("div", {
              classList: ["font-w400", "font-size-xs", "mb-2"],
            })
          )
          .append(
            perception,
            createElement("br"),
            success,
            createElement("br"),
            maxHit
          );
        const unlock = createElement("div", {
          classList: ["text-danger"],
          parent: button,
        });
        unlock.append(...getUnlockedAtNodes(game.thieving, npc.level));
        this.npcNavs.set(npc, {
          npcName,
          perception,
          button,
          panel,
          buttonContent,
          success,
          maxHit,
          unlock,
          masteryDisplay,
        });
      });
    });
  }
  createInfoBox(container) {
    const subContainer = createElement("div", {
      classList: ["media-body"],
      parent: container,
    });
    const iconContainer = createElement("div", {
      classList: ["row", "justify-content-center", "pb-2"],
    });
    const stealth = new StealthIcon(iconContainer);
    const double = new DoublingIcon(iconContainer, 69);
    subContainer.appendChild(iconContainer);
    const xpContainer = createElement("div", {
      classList: ["row", "justify-content-center"],
    });
    const xp = new XPIcon(xpContainer, 69);
    const masteryXP = new MasteryXPIcon(xpContainer, 69);
    const poolXP = new MasteryPoolIcon(xpContainer, 69);
    const interval = new IntervalIcon(xpContainer, 6969);
    subContainer.appendChild(xpContainer);
    return { container, xp, interval, stealth, double, masteryXP, poolXP };
  }
  hideAreaPanel(area) {
    const panel = this.areaPanels.get(area);
    if (panel === undefined) return;
    hideElement(panel.targetContainer);
    hideElement(panel.infoContainer);
    const element = document.getElementById(
      `thieving-area-panel-eye-${area.id}`
    );
    element.classList.remove("fa-eye");
    element.classList.add("fa-eye-slash");
  }
  showAreaPanel(area) {
    const panel = this.areaPanels.get(area);
    if (panel === undefined) return;
    showElement(panel.targetContainer);
    showElement(panel.infoContainer);
    const element = document.getElementById(
      `thieving-area-panel-eye-${area.id}`
    );
    element.classList.add("fa-eye");
    element.classList.remove("fa-eye-slash");
  }
  updateNPCsForLevel(level) {
    game.thieving.actions.forEach((npc) => {
      const npcNav = this.npcNavs.get(npc);
      if (npcNav === undefined) return;
      if (level >= npc.level) {
        showElement(npcNav.buttonContent);
        npcNav.buttonContent.classList.add("d-flex");
        hideElement(npcNav.unlock);
        npcNav.button.onclick = () => this.selectNPCInPanel(npc, npcNav.panel);
      } else {
        hideElement(npcNav.buttonContent);
        npcNav.buttonContent.classList.remove("d-flex");
        showElement(npcNav.unlock);
        npcNav.button.onclick = null;
      }
    });
  }
  updateNPCButtons() {
    game.thieving.actions.forEach((npc) => {
      const npcNav = this.npcNavs.get(npc);
      if (npcNav === undefined) return;
      npcNav.success.textContent = templateLangString(
        "MENU_TEXT",
        "SUCCESS_RATE",
        { value: `${formatPercent(game.thieving.getNPCSuccessRate(npc), 2)}` }
      );
      const maxHit = Math.floor(
        numberMultiplier *
          npc.maxHit *
          (1 - game.combat.player.stats.damageReduction / 100)
      );
      npcNav.maxHit.textContent = templateLangString("MENU_TEXT", "MAX_HIT", {
        value: `${maxHit}`,
      });
    });
  }
  selectNPC(npc, area) {
    const panel = this.areaPanels.get(area);
    if (panel === undefined) return;
    this.selectNPCInPanel(npc, panel);
  }
  selectNPCInPanel(npc, panel) {
    if (game.thieving.onNPCPanelSelection(npc, panel.area)) {
      panel.selectedNPC = npc;
      this.updateAreaPanelInfo(panel);
      panel.startButton.onclick = () =>
        game.thieving.startThieving(panel.area, npc);
      panel.dropsButton.onclick = () => this.showNPCDrops(npc, panel.area);
    }
  }
  updateAllAreaPanels() {
    this.areaPanels.forEach((panel, id) => {
      this.updateAreaPanelInfo(panel);
    });
  }
  setStopButton(area) {
    const panel = this.areaPanels.get(area);
    this.removeStopButton();
    if (panel === undefined) return;
    this.activePanel = panel;
    panel.startButton.textContent = getLangString("MENU_TEXT", "STOP_THIEVING");
    panel.startButton.classList.remove("btn-success");
    panel.startButton.classList.add("btn-danger");
    panel.startButton.onclick = () => game.thieving.stop();
  }
  removeStopButton() {
    const panel = this.activePanel;
    if (panel !== undefined) {
      panel.startButton.textContent = getLangString("MENU_TEXT", "PICKPOCKET");
      panel.startButton.classList.remove("btn-danger");
      panel.startButton.classList.add("btn-success");
      const npc = panel.selectedNPC;
      if (npc !== -1) {
        panel.startButton.onclick = () =>
          game.thieving.startThieving(panel.area, npc);
      }
    }
    this.activePanel = undefined;
  }
  updateAreaPanelInfo(panel) {
    if (panel.selectedNPC !== -1) {
      showElement(panel.infoBox.container);
      panel.infoBox.container.classList.add("d-flex");
      showElement(panel.startButton);
      showElement(panel.dropsButton);
      showElement(panel.infoBoxImage);
      this.updateInfoContainerForNPC(panel, panel.selectedNPC);
    } else {
      panel.infoBoxName.textContent = "-";
      hideElement(panel.infoBox.container);
      panel.infoBox.container.classList.remove("d-flex");
      hideElement(panel.startButton);
      hideElement(panel.dropsButton);
      hideElement(panel.infoBoxImage);
    }
  }
  updateInfoContainerForNPC(panel, npc) {
    panel.infoBoxName.textContent = npc.name;
    panel.infoBoxImage.src = npc.media;
    const infoBox = panel.infoBox;
    infoBox.xp.setXP(Math.floor(game.thieving.modifyXP(npc.baseExperience)));
    const interval = game.thieving.getNPCInterval(npc);
    infoBox.interval.setInterval(interval);
    infoBox.stealth.setNPC(npc);
    const mXP = game.thieving.getMasteryXPToAddForAction(npc, interval);
    infoBox.masteryXP.setXP(mXP);
    infoBox.poolXP.setXP(game.thieving.getMasteryXPToAddToPool(mXP));
    infoBox.double.setChance(game.thieving.getNPCDoublingChance(npc));
  }
  showNPCDrops(npc, area) {
    const sortedTable = npc.lootTable.sortedDropsArray;
    const { minGP, maxGP } = game.thieving.getNPCGPRange(npc);
    let html = `<span class="text-dark"><small><img class="skill-icon-xs mr-2" src="${cdnMedia(
      "assets/media/main/coins.svg"
    )}"> ${templateLangString("MENU_TEXT", "GP_AMOUNT", {
      gp: `${formatNumber(minGP)}-${formatNumber(maxGP)}`,
    })}</small><br>`;
    html += `${getLangString("THIEVING", "POSSIBLE_COMMON")}<br><small>`;
    if (sortedTable.length) {
      html += `${getLangString("THIEVING", "MOST_TO_LEAST_COMMON")}<br>`;
      const totalWeight = npc.lootTable.weight;
      html += sortedTable
        .map(({ item, weight, minQuantity, maxQuantity }) => {
          let text = `${
            maxQuantity > minQuantity ? `${minQuantity}-` : ""
          }${maxQuantity} x <img class="skill-icon-xs mr-2" src="${
            item.media
          }">${item.name}`;
          if (DEBUGENABLED)
            text += ` (${((100 * weight) / totalWeight).toFixed(2)}%)`;
          return text;
        })
        .join("<br>");
      if (DEBUGENABLED)
        html += `<br>Average Value: ${npc.lootTable.averageDropValue.toFixed(
          2
        )} GP`;
    } else {
      html += getLangString("THIEVING", "NO_COMMON_DROPS");
    }
    html += `</small><br>`;
    html += `${getLangString("THIEVING", "POSSIBLE_RARE")}<br><small>`;
    const generalRareHTML = [];
    game.thieving.generalRareItems.forEach(({ item, npcs }) => {
      if (npcs === undefined || npcs.has(npc))
        generalRareHTML.push(this.formatSpecialDrop(item));
    });
    html += generalRareHTML.join("<br>");
    html += `</small><br>`;
    if (area.uniqueDrops.length) {
      html += `${getLangString("THIEVING", "POSSIBLE_AREA_UNIQUE")}<br><small>`;
      html += area.uniqueDrops
        .map((drop) => this.formatSpecialDrop(drop.item, drop.quantity))
        .join("<br>");
      html += "</small><br>";
    }
    if (npc.uniqueDrop !== undefined) {
      html += `${getLangString(
        "THIEVING",
        "POSSIBLE_NPC_UNIQUE"
      )}<br><small>${this.formatSpecialDrop(
        npc.uniqueDrop.item,
        npc.uniqueDrop.quantity
      )}</small>`;
    }
    html += "</span>";
    SwalLocale.fire({
      title: npc.name,
      html,
      imageUrl: npc.media,
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: npc.name,
    });
  }
  formatSpecialDrop(item, qty = 1) {
    const found = game.stats.itemFindCount(item);
    const media = found
      ? item.media
      : cdnMedia("assets/media/main/question.svg");
    const name = found
      ? item.name
      : getLangString("THIEVING", "UNDISCOVERED_ITEM");
    return `${formatNumber(
      qty
    )} x <img class="skill-icon-xs mr-2" src="${media}">${name}`;
  }
  getProgressBar(area) {
    var _a;
    return (_a = this.areaPanels.get(area)) === null || _a === void 0
      ? void 0
      : _a.progressBar;
  }
  localize() {
    game.thieving.areas.forEach((area) => {
      const panel = this.areaPanels.get(area);
      if (panel === undefined) return;
      panel.infoSkillName.textContent = game.thieving.name;
      if (panel.selectedNPC !== -1) {
        panel.infoBoxName.textContent = panel.selectedNPC.name;
      }
      if (panel === this.activePanel) {
        panel.startButton.textContent = getLangString(
          "MENU_TEXT",
          "STOP_THIEVING"
        );
      } else {
        panel.startButton.textContent = getLangString(
          "MENU_TEXT",
          "PICKPOCKET"
        );
      }
      panel.dropsButton.textContent = getLangString("MENU_TEXT", "SHOW_DROPS");
      panel.areaName.textContent = area.name;
      panel.infoBox.xp.localize();
      panel.infoBox.interval.localize();
      panel.infoBox.stealth.localize();
      panel.infoBox.double.localize();
      panel.infoBox.masteryXP.localize();
      panel.infoBox.poolXP.localize();
    });
    game.thieving.actions.forEach((npc) => {
      const npcNav = this.npcNavs.get(npc);
      if (npcNav === undefined) return;
      npcNav.npcName.textContent = npc.name;
      npcNav.perception.textContent = templateLangString(
        "MENU_TEXT",
        "PERCEPTION",
        { value: `${npc.perception}` }
      );
      npcNav.unlock.textContent = "";
      npcNav.unlock.append(...getUnlockedAtNodes(game.thieving, npc.level));
    });
    this.updateNPCButtons();
  }
}
