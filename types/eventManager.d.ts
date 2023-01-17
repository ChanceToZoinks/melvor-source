declare class EventManager {
  activeEvents: any[];
  getEventData(id: any): {
    id: any;
    readonly name: any;
    readonly media: string;
    startDate: number;
    endDate: number;
    pageId: number;
    sidebarColour: string;
    borderClass: string;
    bgClass: string;
    containerId: string;
    logo: string;
  };
  isEventActive(event: any): boolean;
  getActiveEvents(): {
    id: any;
    readonly name: any;
    readonly media: string;
    startDate: number;
    endDate: number;
    pageId: number;
    sidebarColour: string;
    borderClass: string;
    bgClass: string;
    containerId: string;
    logo: string;
  }[];
  createEventContainerElement(event: any): HTMLDivElement;
  loadEventSidebarElements(event: any): void;
  loadEventContainerElements(event: any): void;
  populateEventContainerElement(event: any): void;
  loadSavedEventData(event: any): void;
  loadEvents(): void;
  updateGameLogo(event: any): void;
  rollForEventRewards(actionInterval: any, skill: any, rewards: any): void;
  rollForEventRewardsOffline(actionInterval: any, skill: any): number;
  updateEventUI(id: any): void;
}
declare const EVENTS: {
  id: any;
  readonly name: any;
  readonly media: string;
  startDate: number;
  endDate: number;
  pageId: number;
  sidebarColour: string;
  borderClass: string;
  bgClass: string;
  containerId: string;
  logo: string;
}[];
