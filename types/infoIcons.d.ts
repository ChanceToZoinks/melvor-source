declare class ContainedComponent {
  show(): void;
  hide(): void;
  invisible(): void;
  visible(): void;
}
declare class InfoIcon extends ContainedComponent {
  constructor(parent: any, pillClass: any, size: any);
  parent: any;
  container: any;
  image: any;
  text: any;
  tooltip: any;
  setImage(media: any): void;
  setText(text: any): void;
  setTooltip(content: any): void;
  destroy(): void;
}
declare namespace InfoIcon {
  namespace media {
    const skillXP: string;
    const strXP: string;
    const masteryXP: string;
    const poolXP: string;
    const preserveChance: string;
    const doublingChance: string;
    const interval: string;
    const gp: string;
    const slayerCoins: string;
    const shopIcon: string;
    const perfectCook: string;
    const successfulCook: string;
    const intervalAlt: string;
  }
}
declare class XPIcon extends InfoIcon {
  constructor(parent: any, xp: any, size?: number);
  xp: any;
  setXP(xp: any): void;
  localize(): void;
  getTooltipContent(xp: any): string;
}
declare class STRXPIcon extends InfoIcon {
  constructor(parent: any, xp: any, size?: number);
  xp: any;
  setXP(xp: any): void;
  localize(): void;
  getTooltipContent(xp: any): string;
}
declare class IntervalIcon extends InfoIcon {
  constructor(parent: any, interval: any, size?: number, altMedia?: boolean);
  setMedia(altMedia: any): void;
  localize(): void;
  setInterval(interval: any): void;
}
declare class DoublingIcon extends InfoIcon {
  constructor(parent: any, chance: any, size?: number);
  localize(): void;
  getTooltipContent(): string;
  setChance(chance: any): void;
}
declare class PreservationIcon extends InfoIcon {
  constructor(parent: any, chance: any, size?: number);
  localize(): void;
  getTooltipContent(): string;
  setChance(chance: any): void;
}
declare class PerfectCookIcon extends InfoIcon {
  constructor(parent: any, chance: any, size?: number);
  localize(): void;
  getTooltipContent(): string;
  setChance(chance: any): void;
}
declare class CookingSuccessIcon extends InfoIcon {
  constructor(parent: any, chance: any, size?: number);
  localize(): void;
  getTooltipContent(): string;
  setChance(chance: any): void;
}
declare class MasteryXPIcon extends InfoIcon {
  constructor(parent: any, xp: any, size?: number);
  xp: any;
  localize(): void;
  setXP(xp: any): void;
  getTooltipContent(): string;
}
declare class MasteryPoolIcon extends InfoIcon {
  constructor(parent: any, xp: any, size?: number);
  xp: any;
  localize(): void;
  setXP(xp: any): void;
  getTooltipContent(): string;
}
declare class StealthIcon extends InfoIcon {
  constructor(parent: any, size?: number);
  setNPC(npc: any): void;
  npc: any;
  localize(): void;
  getTooltipContent(): string;
}
declare class ItemChanceIcon extends InfoIcon {
  constructor(parent: any, size?: number);
  setItem(item: any): void;
  item: any;
  localize(): void;
  getTooltipContent(): string;
  setChance(chance: any): void;
}
declare class MeteoriteChanceIcon extends InfoIcon {
  constructor(parent: any, size?: number);
  localize(): void;
  getTooltipContent(): string;
  setChance(chance: any): void;
}
declare class QtyIcon extends InfoIcon {
  constructor(parent: any, qty: any, size?: number);
  qty: any;
  localize(): void;
  updateQuantity(): void;
  getTooltipContent(): string;
}
declare class ItemQtyIcon extends QtyIcon {
  constructor(parent: any, quickBuy?: boolean, qty?: number, size?: number);
  allowQuickBuy: boolean;
  autoBuyIcon: any;
  setItem(item: any, qty: any, altMedia?: boolean): void;
  item: any;
  getCurrentQty(): any;
  getName(): any;
}
declare class CookingStockpileIcon extends ItemQtyIcon {
  constructor(parent: any, category: any, size?: number);
  unsetItem(): void;
  setItem(item: any, qty: any): void;
}
declare class GPQtyIcon extends QtyIcon {
  getCurrentQty(): any;
  getName(): any;
}
declare class SCQtyIcon extends QtyIcon {
  getCurrentQty(): any;
  getName(): any;
}
declare class QtyCurrentIcon extends InfoIcon {
  constructor(parent: any, requiredQty: any, size?: number);
  currentQuantity: number;
  requiredQuantity: any;
  localize(): void;
  init(): void;
  updateQuantity(): void;
  onMouseover(): void;
  onMouseleave(): void;
  getTooltipContent(): string;
}
declare class ItemCurrentIcon extends QtyCurrentIcon {
  constructor(
    parent: any,
    item: any,
    requiredQty: any,
    quickBuy?: boolean,
    size?: number,
    altMedia?: boolean
  );
  item: any;
  getCurrentQty(): any;
  getName(): any;
}
declare class GPCurrentIcon extends QtyCurrentIcon {
  getCurrentQty(): any;
  getName(): any;
}
declare class SCCurrentIcon extends QtyCurrentIcon {
  getCurrentQty(): any;
  getName(): any;
}
