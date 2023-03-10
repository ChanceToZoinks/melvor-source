"use strict";
const combatTriangle = {
  [0]: {
    damageModifier: {
      melee: { melee: 1, ranged: 1.1, magic: 0.85 },
      ranged: { melee: 0.85, ranged: 1, magic: 1.1 },
      magic: { melee: 1.1, ranged: 0.85, magic: 1 },
    },
    reductionModifier: {
      melee: { melee: 1, ranged: 1.25, magic: 0.75 },
      ranged: { melee: 0.95, ranged: 1, magic: 1.25 },
      magic: { melee: 1.25, ranged: 0.85, magic: 1 },
    },
  },
  [1]: {
    damageModifier: {
      melee: { melee: 1, ranged: 1.1, magic: 0.75 },
      ranged: { melee: 0.75, ranged: 1, magic: 1.1 },
      magic: { melee: 1.1, ranged: 0.75, magic: 1 },
    },
    reductionModifier: {
      melee: { melee: 1, ranged: 1.25, magic: 0.5 },
      ranged: { melee: 0.75, ranged: 1, magic: 1.25 },
      magic: { melee: 1.25, ranged: 0.75, magic: 1 },
    },
  },
  [2]: {
    damageModifier: {
      melee: { melee: 1, ranged: 0.75, magic: 1.1 },
      ranged: { melee: 1.1, ranged: 1, magic: 0.75 },
      magic: { melee: 0.75, ranged: 1.1, magic: 1 },
    },
    reductionModifier: {
      melee: { melee: 1, ranged: 0.75, magic: 1.25 },
      ranged: { melee: 1.25, ranged: 1, magic: 0.75 },
      magic: { melee: 0.5, ranged: 1.25, magic: 1 },
    },
  },
};
