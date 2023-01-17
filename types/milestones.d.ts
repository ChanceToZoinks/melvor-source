declare class CustomSkillMilestone {
  constructor(data: any);
  level: any;
  _media: any;
  _name: any;
  _milestoneID: any;
  get name(): any;
  get media(): any;
}
declare class EquipItemMilestone {
  constructor(data: any, game: any, skill: any);
  level: number;
  item: any;
  get name(): any;
  get media(): any;
  setLevel(skill: any): void;
}
declare class SkillMasteryMilestone {
  constructor(skill: any);
  skill: any;
  get level(): number;
  get media(): any;
  get name(): any;
}
declare class AgilityObstacleMilestone {
  constructor(tier: any);
  tier: any;
  get level(): any;
  get media(): any;
  get name(): any;
}
declare class AgilityPillarMilestone {
  constructor(agility: any);
  agility: any;
  get level(): number;
  get media(): any;
  get name(): any;
}
declare class AgilityElitePillarMilestone {
  constructor(agility: any);
  agility: any;
  get level(): number;
  get media(): any;
  get name(): any;
}
declare class SlayerAreaMilestone {
  constructor(area: any, level: any);
  area: any;
  level: any;
  get name(): any;
  get media(): any;
}
