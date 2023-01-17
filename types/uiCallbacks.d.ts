declare function viewItemContents(item: any): void;
declare function viewItemStats(item: any, compareToSet?: any): void;
declare function viewEquipmentStats(): void;
declare function viewMonsterDrops(monster: any, respectArea: any): void;
declare function selectSpellbook(spellbook: any): void;
declare function equipFood(): void;
declare function changeCombatMenu(menu: any): void;
declare function togglePlayerContainer(): void;
declare function switchSummoningCategory(category: any): void;
declare function openSynergiesBreakdown(): void;
declare function toggleMenu(menu: any): void;
declare function toggleCombatSkillMenu(): void;
declare function viewGameGuide(): void;
declare function agreeToNotice(noticeID: any): void;
declare function openLink(url: any): void;
declare function openDiscordLink(): void;
declare function openWikiLink(): void;
declare function openExpansionSteamLink(): void;
declare function viewMonsterStats(monster: any): void;
declare function readLore(loreID: any): void;
declare const equipStatKeys: string[];
declare let selectedSpellbook: string;
declare const combatMenuCount: 6;
declare let skillsMenu: boolean;
declare let combatMenu: boolean;
declare function changePage(
  page: any,
  subCategory: number,
  skill: any,
  showRaidShop?: boolean,
  toggleSidebar?: boolean
): void;
