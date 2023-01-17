declare function damageReducer(
  attacker: any,
  target: any,
  prevDamage?: number
): (totalDamage: any, damage: any) => any;
declare function getMaxDamage(
  damage: any,
  attacker: any,
  target: any,
  prevDamage?: number
): number;
declare function getDamageRoll(
  character: any,
  type: any,
  percent: any,
  damageDealt?: number
): number;
declare function getDamageDescription(
  damage: any,
  attackerName: any,
  targetName: any,
  i: any,
  key: any
): string;
declare function getEffectDescription(
  effect: any,
  attackerNoun: any,
  targetNoun: any,
  key: any
): string;
declare function damageMaxValue(i: any): string;
declare function damageMinValue(i: any): string;
declare function effectKey(preHit: any, i: any): string;
declare function addEffectTemplateData(
  data: any,
  effect: any,
  preHit: any,
  i: any
): void;
declare function addDamageTemplateData(data: any, damage: any, key: any): void;
declare class NormalDamage {
  constructor(amplitude: any, attackCount?: number);
  character: string;
  maxRoll: string;
  maxPercent: any;
  minRoll: string;
  minPercent: any;
  roll: boolean;
  attackCount: number;
}
declare class BurnEffect {
  constructor(chance?: number);
  chance: number;
  type: string;
  subtype: string;
  damage: {
    character: string;
    roll: boolean;
    maxRoll: string;
    maxPercent: number;
  }[];
  procs: number;
  interval: number;
}
declare class PoisonEffect {
  constructor(chance?: number);
  chance: number;
  type: string;
  subtype: string;
  damage: {
    character: string;
    roll: boolean;
    maxRoll: string;
    maxPercent: number;
  }[];
  procs: number;
  interval: number;
}
declare class DeadlyPoisonEffect {
  constructor(chance?: number);
  chance: number;
  type: string;
  subtype: string;
  damage: {
    character: string;
    roll: boolean;
    maxRoll: string;
    maxPercent: number;
  }[];
  procs: number;
  interval: number;
}
declare class SlowEffect {
  constructor(magnitude: any, turns?: number);
  turns: number;
  type: string;
  character: string;
  countsOn: string;
  maxStacks: number;
  stacksToAdd: number;
  media: string;
  modifiers: {
    increasedAttackIntervalPercent: any;
  };
}
declare class StickyWebs {
  constructor(chance?: number);
  chance: number;
  type: string;
  character: string;
  countsOn: string;
  maxStacks: number;
  stacksToAdd: number;
  media: string;
  turns: number;
  modifiers: {
    increasedAttackIntervalPercent: number;
  };
}
declare class EndOfTurnEvasionEffect {
  constructor(turns: any, maxValue: any, atMax?: boolean);
  turns: any;
  maxValue: any;
  type: string;
  character: string;
  countsOn: string;
  maxStacks: number;
  stacksToAdd: number;
  media: string;
  modifiers: {
    increasedGlobalEvasion: any;
  };
}
declare const burnEffect: BurnEffect;
declare namespace bleedReflectEffect {
  const type: string;
  const subtype: string;
  const damage: {
    character: string;
    maxRoll: string;
    maxPercent: number;
    roll: boolean;
  }[];
  const procs: number;
  const interval: number;
  const chance: number;
}
declare const poisonEffect: PoisonEffect;
declare const deadlyPoisonEffect: DeadlyPoisonEffect;
declare namespace frostBurnEffect {
  const type_1: string;
  export { type_1 as type };
  export namespace modifiers {
    const increasedFrostburn: number;
    const increasedAttackIntervalPercent: number;
  }
  export const turns: number;
  export const character: string;
  export const countsOn: string;
  export const maxStacks: number;
  export const stacksToAdd: number;
  export const media: string;
}
declare namespace decreasedEvasionStackingEffect {
  const type_2: string;
  export { type_2 as type };
  export namespace modifiers_1 {
    const decreasedGlobalEvasion: number;
  }
  export { modifiers_1 as modifiers };
  const maxStacks_1: number;
  export { maxStacks_1 as maxStacks };
  const stacksToAdd_1: number;
  export { stacksToAdd_1 as stacksToAdd };
  const turns_1: number;
  export { turns_1 as turns };
  const countsOn_1: string;
  export { countsOn_1 as countsOn };
  const character_1: string;
  export { character_1 as character };
  const media_1: string;
  export { media_1 as media };
}
declare namespace afflictionEffect {
  const type_3: string;
  export { type_3 as type };
  export namespace modifiers_2 {
    const decreasedMaxHitpoints: number;
  }
  export { modifiers_2 as modifiers };
  const maxStacks_2: number;
  export { maxStacks_2 as maxStacks };
  const stacksToAdd_2: number;
  export { stacksToAdd_2 as stacksToAdd };
  const turns_2: number;
  export { turns_2 as turns };
  const countsOn_2: string;
  export { countsOn_2 as countsOn };
  const character_2: string;
  export { character_2 as character };
  const media_2: string;
  export { media_2 as media };
}
declare namespace shockEffect {
  const type_4: string;
  export { type_4 as type };
  export namespace modifiers_3 {
    const decreasedDamageReduction: number;
  }
  export { modifiers_3 as modifiers };
  const maxStacks_3: number;
  export { maxStacks_3 as maxStacks };
  const stacksToAdd_3: number;
  export { stacksToAdd_3 as stacksToAdd };
  const turns_3: number;
  export { turns_3 as turns };
  const countsOn_3: string;
  export { countsOn_3 as countsOn };
  const character_3: string;
  export { character_3 as character };
  const media_3: string;
  export { media_3 as media };
}
declare namespace absorbingSkinEffect {
  const type_5: string;
  export { type_5 as type };
  export namespace modifiers_4 {
    const increasedDamageReduction: number;
  }
  export { modifiers_4 as modifiers };
  const maxStacks_4: number;
  export { maxStacks_4 as maxStacks };
  const stacksToAdd_4: number;
  export { stacksToAdd_4 as stacksToAdd };
  const turns_4: number;
  export { turns_4 as turns };
  const countsOn_4: string;
  export { countsOn_4 as countsOn };
  const character_4: string;
  export { character_4 as character };
  const media_4: string;
  export { media_4 as media };
}
declare namespace dualityEffect {
  const type_6: string;
  export { type_6 as type };
  export namespace modifiers_5 {
    const decreasedAttackIntervalPercent: number;
  }
  export { modifiers_5 as modifiers };
  const maxStacks_5: number;
  export { maxStacks_5 as maxStacks };
  const turns_5: number;
  export { turns_5 as turns };
  const stacksToAdd_5: number;
  export { stacksToAdd_5 as stacksToAdd };
  const countsOn_5: string;
  export { countsOn_5 as countsOn };
  const character_5: string;
  export { character_5 as character };
  const media_5: string;
  export { media_5 as media };
}
declare namespace rageEffect {
  const type_7: string;
  export { type_7 as type };
  export namespace modifiers_6 {
    export const increasedMaxHitPercent: number;
    const decreasedAttackIntervalPercent_1: number;
    export { decreasedAttackIntervalPercent_1 as decreasedAttackIntervalPercent };
  }
  export { modifiers_6 as modifiers };
  const maxStacks_6: number;
  export { maxStacks_6 as maxStacks };
  const stacksToAdd_6: number;
  export { stacksToAdd_6 as stacksToAdd };
  const turns_6: number;
  export { turns_6 as turns };
  const countsOn_6: string;
  export { countsOn_6 as countsOn };
  const character_6: string;
  export { character_6 as character };
  const media_6: string;
  export { media_6 as media };
}
declare namespace darkBladeEffect {
  const type_8: string;
  export { type_8 as type };
  export namespace modifiers_7 {
    const increasedMaxHitPercent_1: number;
    export { increasedMaxHitPercent_1 as increasedMaxHitPercent };
  }
  export { modifiers_7 as modifiers };
  const maxStacks_7: number;
  export { maxStacks_7 as maxStacks };
  const stacksToAdd_7: number;
  export { stacksToAdd_7 as stacksToAdd };
  const turns_7: number;
  export { turns_7 as turns };
  const countsOn_7: string;
  export { countsOn_7 as countsOn };
  const character_7: string;
  export { character_7 as character };
  const media_7: string;
  export { media_7 as media };
}
declare namespace assassinEffect {
  const type_9: string;
  export { type_9 as type };
  export namespace modifiers_8 {
    const increasedGlobalAccuracy: number;
  }
  export { modifiers_8 as modifiers };
  const maxStacks_8: number;
  export { maxStacks_8 as maxStacks };
  const turns_8: number;
  export { turns_8 as turns };
  const stacksToAdd_8: number;
  export { stacksToAdd_8 as stacksToAdd };
  const countsOn_8: string;
  export { countsOn_8 as countsOn };
  const character_8: string;
  export { character_8 as character };
  const media_8: string;
  export { media_8 as media };
}
declare namespace growingMadnessEffect {
  const type_10: string;
  export { type_10 as type };
  export namespace modifiers_9 {
    const decreasedAttackIntervalPercent_2: number;
    export { decreasedAttackIntervalPercent_2 as decreasedAttackIntervalPercent };
    const increasedMaxHitPercent_2: number;
    export { increasedMaxHitPercent_2 as increasedMaxHitPercent };
  }
  export { modifiers_9 as modifiers };
  const maxStacks_9: number;
  export { maxStacks_9 as maxStacks };
  const stacksToAdd_9: number;
  export { stacksToAdd_9 as stacksToAdd };
  const turns_9: number;
  export { turns_9 as turns };
  const countsOn_9: string;
  export { countsOn_9 as countsOn };
  const character_9: string;
  export { character_9 as character };
  const media_9: string;
  export { media_9 as media };
}
declare namespace momentInTimeEffect {
  const type_11: string;
  export { type_11 as type };
  export namespace modifiers_10 {
    const decreasedAttackIntervalPercent_3: number;
    export { decreasedAttackIntervalPercent_3 as decreasedAttackIntervalPercent };
    const increasedMaxHitPercent_3: number;
    export { increasedMaxHitPercent_3 as increasedMaxHitPercent };
    const increasedGlobalAccuracy_1: number;
    export { increasedGlobalAccuracy_1 as increasedGlobalAccuracy };
  }
  export { modifiers_10 as modifiers };
  const maxStacks_10: number;
  export { maxStacks_10 as maxStacks };
  const stacksToAdd_10: number;
  export { stacksToAdd_10 as stacksToAdd };
  const turns_10: number;
  export { turns_10 as turns };
  const countsOn_10: string;
  export { countsOn_10 as countsOn };
  const character_10: string;
  export { character_10 as character };
  const media_10: string;
  export { media_10 as media };
}
declare namespace reignOverTimeEffect {
  const type_12: string;
  export { type_12 as type };
  export namespace modifiers_11 {
    const decreasedAttackIntervalPercent_4: number;
    export { decreasedAttackIntervalPercent_4 as decreasedAttackIntervalPercent };
    const increasedMaxHitPercent_4: number;
    export { increasedMaxHitPercent_4 as increasedMaxHitPercent };
    const increasedGlobalAccuracy_2: number;
    export { increasedGlobalAccuracy_2 as increasedGlobalAccuracy };
    export const increasedGlobalEvasion: number;
  }
  export { modifiers_11 as modifiers };
  const maxStacks_11: number;
  export { maxStacks_11 as maxStacks };
  const stacksToAdd_11: number;
  export { stacksToAdd_11 as stacksToAdd };
  const turns_11: number;
  export { turns_11 as turns };
  const countsOn_11: string;
  export { countsOn_11 as countsOn };
  const character_11: string;
  export { character_11 as character };
  const media_11: string;
  export { media_11 as media };
}
declare namespace shadowCloakEffect {
  const type_13: string;
  export { type_13 as type };
  export namespace modifiers_12 {
    const decreasedGlobalEvasion_1: number;
    export { decreasedGlobalEvasion_1 as decreasedGlobalEvasion };
  }
  export { modifiers_12 as modifiers };
  const maxStacks_12: number;
  export { maxStacks_12 as maxStacks };
  const stacksToAdd_12: number;
  export { stacksToAdd_12 as stacksToAdd };
  const turns_12: number;
  export { turns_12 as turns };
  const countsOn_12: string;
  export { countsOn_12 as countsOn };
  const character_12: string;
  export { character_12 as character };
  const media_12: string;
  export { media_12 as media };
}
declare namespace increased5DROnHitEffect {
  const type_14: string;
  export { type_14 as type };
  export namespace modifiers_13 {
    const increasedDamageReduction_1: number;
    export { increasedDamageReduction_1 as increasedDamageReduction };
  }
  export { modifiers_13 as modifiers };
  const maxStacks_13: number;
  export { maxStacks_13 as maxStacks };
  const stacksToAdd_13: number;
  export { stacksToAdd_13 as stacksToAdd };
  const turns_13: number;
  export { turns_13 as turns };
  const countsOn_13: string;
  export { countsOn_13 as countsOn };
  const character_13: string;
  export { character_13 as character };
  const media_13: string;
  export { media_13 as media };
}
declare const elementalEffects: (
  | BurnEffect
  | {
      type: string;
      modifiers: {
        increasedFrostburn: number;
        increasedAttackIntervalPercent: number;
      };
      turns: number;
      character: string;
      countsOn: string;
      maxStacks: number;
      stacksToAdd: number;
      media: string;
    }
  | {
      type: string;
      chance: number;
      numEffects: number;
      turns?: undefined;
      flavour?: undefined;
    }
  | {
      chance: number;
      turns: number;
      type: string;
      flavour: string;
      numEffects?: undefined;
    }
)[];
declare namespace rollData {
  namespace CurrentHP {
    function formatPercent(value: any): string;
    function formatName(name: any): string;
  }
  namespace MaxHP {
    export function formatPercent_1(value: any): string;
    export { formatPercent_1 as formatPercent };
    export function formatName_1(name: any): string;
    export { formatName_1 as formatName };
  }
  namespace DamageDealt {
    export function formatPercent_2(value: any): string;
    export { formatPercent_2 as formatPercent };
    export function formatName_2(): string;
    export { formatName_2 as formatName };
  }
  namespace MaxHit {
    export function formatPercent_3(value: any): string;
    export { formatPercent_3 as formatPercent };
    export function formatName_3(name: any): string;
    export { formatName_3 as formatName };
  }
  namespace FixedPlusMaxHit50 {
    export function formatPercent_4(value: any): string;
    export { formatPercent_4 as formatPercent };
    export function formatName_4(name: any): string;
    export { formatName_4 as formatName };
    export const modValue: typeof multiplyByNumberMultiplier;
  }
  namespace MinHit {
    export function formatPercent_5(value: any): string;
    export { formatPercent_5 as formatPercent };
    export function formatName_5(name: any): string;
    export { formatName_5 as formatName };
  }
  namespace Fixed {
    export function formatPercent_6(value: any): string;
    export { formatPercent_6 as formatPercent };
    export function formatName_6(): string;
    export { formatName_6 as formatName };
    const modValue_1: typeof multiplyByNumberMultiplier;
    export { modValue_1 as modValue };
  }
  namespace MagicScaling {
    export function formatPercent_7(value: any): string;
    export { formatPercent_7 as formatPercent };
    export function formatName_7(name: any): string;
    export { formatName_7 as formatName };
    const modValue_2: typeof multiplyByNumberMultiplier;
    export { modValue_2 as modValue };
  }
  namespace One {
    export function formatPercent_8(): string;
    export { formatPercent_8 as formatPercent };
    export function formatName_8(): string;
    export { formatName_8 as formatName };
  }
  namespace Rend {
    export function formatPercent_9(value: any): string;
    export { formatPercent_9 as formatPercent };
    export function formatName_9(): string;
    export { formatName_9 as formatName };
  }
  namespace Poisoned {
    export function formatPercent_10(value: any): string;
    export { formatPercent_10 as formatPercent };
    export function formatName_10(): string;
    export { formatName_10 as formatName };
    const modValue_3: typeof multiplyByNumberMultiplier;
    export { modValue_3 as modValue };
  }
  namespace Bleeding {
    export function formatPercent_11(value: any): string;
    export { formatPercent_11 as formatPercent };
    export function formatName_11(): string;
    export { formatName_11 as formatName };
    const modValue_4: typeof multiplyByNumberMultiplier;
    export { modValue_4 as modValue };
  }
  namespace PoisonMax35 {
    export function formatPercent_12(value: any): string;
    export { formatPercent_12 as formatPercent };
    export function formatName_12(name: any): string;
    export { formatName_12 as formatName };
  }
  namespace PoisonMin35 {
    export function formatPercent_13(value: any): string;
    export { formatPercent_13 as formatPercent };
    export function formatName_13(name: any): string;
    export { formatName_13 as formatName };
  }
  namespace PoisonFixed100 {
    export function formatPercent_14(value: any): string;
    export { formatPercent_14 as formatPercent };
    export function formatName_14(): string;
    export { formatName_14 as formatName };
    const modValue_5: typeof multiplyByNumberMultiplier;
    export { modValue_5 as modValue };
  }
  namespace BurnFixed100 {
    export function formatPercent_15(value: any): string;
    export { formatPercent_15 as formatPercent };
    export function formatName_15(): string;
    export { formatName_15 as formatName };
    const modValue_6: typeof multiplyByNumberMultiplier;
    export { modValue_6 as modValue };
  }
  namespace BurnMaxHit100 {
    export function formatPercent_16(value: any): string;
    export { formatPercent_16 as formatPercent };
    export function formatName_16(name: any): string;
    export { formatName_16 as formatName };
  }
  namespace CursedFixed100 {
    export function formatPercent_17(value: any): string;
    export { formatPercent_17 as formatPercent };
    export function formatName_17(): string;
    export { formatName_17 as formatName };
    const modValue_7: typeof multiplyByNumberMultiplier;
    export { modValue_7 as modValue };
  }
  namespace MaxHitScaledByHP {
    export function formatPercent_18(value: any): string;
    export { formatPercent_18 as formatPercent };
    export function formatName_18(name: any): string;
    export { formatName_18 as formatName };
  }
  namespace HPUnder90 {
    export function formatPercent_19(value: any): string;
    export { formatPercent_19 as formatPercent };
    export function formatName_19(): string;
    export { formatName_19 as formatName };
    const modValue_8: typeof multiplyByNumberMultiplier;
    export { modValue_8 as modValue };
  }
  namespace MaxHitScaledByHP2x {
    export function formatPercent_20(value: any): string;
    export { formatPercent_20 as formatPercent };
    export function formatName_20(name: any): string;
    export { formatName_20 as formatName };
  }
  namespace MaxHitDR {
    export function formatPercent_21(value: any): string;
    export { formatPercent_21 as formatPercent };
    export function formatName_21(): string;
    export { formatName_21 as formatName };
  }
  namespace PoisonedMaxHit {
    export function formatPercent_22(value: any): string;
    export { formatPercent_22 as formatPercent };
    export function formatName_22(name: any): string;
    export { formatName_22 as formatName };
  }
}
declare namespace attackDescriptors {
  function Count(attack: any, attNoun: any, targNoun: any): string;
  function Damage(attack: any, attNoun: any, targNoun: any): any;
  function Lifesteal(attack: any, attNoun: any, targNoun: any): string;
  function Target(attack: any, attNoun: any, targNoun: any): string;
  function Attacker(attack: any, attNoun: any, targNoun: any): string;
  function TarPos(attack: any, attNoun: any, targNoun: any): string;
  function AttPos(attack: any, attNoun: any, targNoun: any): string;
  function PrehitEffect(attack: any, attNoun: any, targNoun: any): string;
  function HitEffect(attack: any, attNoun: any, targNoun: any): string;
  function CanMiss(
    attack: any,
    attNoun: any,
    targNoun: any
  ): "can't miss" | "can miss";
  function Avoidable(
    attack: any,
    attNoun: any,
    targNoun: any
  ): "unavoidable" | "avoidable";
  function Duration(attack: any, attNoun: any, tarNoun: any): string;
  function Interval(attack: any, attNoun: any, tarNoun: any): string;
  function Taris(attack: any, attNoun: any, tarNoun: any): string;
  function Attis(attack: any, attNoun: any, tarNoun: any): string;
}
declare function generateAttackDescription(
  attack: any,
  attNoun: any,
  targNoun: any
): any;
declare namespace youNoun {
  const plain: string;
  const possesive: string;
  const pronoun: string;
  const is: string;
}
declare namespace enemyNoun {
  const plain_1: string;
  export { plain_1 as plain };
  const possesive_1: string;
  export { possesive_1 as possesive };
  const pronoun_1: string;
  export { pronoun_1 as pronoun };
  const is_1: string;
  export { is_1 as is };
}
