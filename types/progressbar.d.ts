declare class ProgressBar {
  constructor(barElem: any, currentStyle?: string);
  barElem: any;
  currentStyle: string;
  isStriped: boolean;
  isReversed: boolean;
  animateProgressFromTimer(timer: any): void;
  animateProgress(elapsedTime: any, totalTime: any): void;
  animateStriped(): void;
  stopAnimation(): void;
  setStyle(newStyle: any): void;
  setAnimation(animation: any): void;
  setFixedPosition(percent: any): void;
}
declare namespace ProgressBar {
  const stripeClasses: string[];
}
