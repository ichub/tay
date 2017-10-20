export interface IFoodGalleryItem {
    name: string;
    address: string;
    hours: IHoursForDay
    menu?: Menu;
}

export interface Menu {
    monday: DayMenu;
    tuesday: DayMenu;
    wednesday: DayMenu;
    thursday: DayMenu;
    friday: DayMenu;
    saturday: DayMenu;
    sunday: DayMenu;
}

export interface DayMenu {
    breakfast?: string[];
    lunch?: string[];
    dinner?: string[];
}

export interface IHoursForDay {
    [key: string]: ITimeSpan[]
}

export interface ITimeSpan {
    start: ITime;
    end: ITime;
}

export interface ITimeSpanAndWeekday extends ITimeSpan {
    weekday: string;
}

export interface ITime {
    h: number,
    m: number
}