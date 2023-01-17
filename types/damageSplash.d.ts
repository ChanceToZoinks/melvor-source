declare class SplashManager {
  constructor(container: any);
  container: any;
  queue: any[];
  splashDelay: number;
  maxSplashes: number;
  add(splash: any): void;
  render(): void;
  renderSplash(splash: any): void;
}
declare namespace SplashManager {
  namespace splashClasses {
    const Burn: string;
    const Bleed: string;
    const Poison: string;
    const Regen: string;
    const Attack: string;
    const Crit: string;
    const Heal: string;
    const DeadlyPoison: string;
  }
}
