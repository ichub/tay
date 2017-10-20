import * as moment from "moment";

export const Weekdays: Weekday[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const WeekdayStrings = Object.freeze({
    Monday: "monday" as Weekday,
    Tuesday: "tuesday" as Weekday,
    Wednesday: "wednesday" as Weekday,
    Thursday: "thursday" as Weekday,
    Friday: "friday" as Weekday,
    Saturday: "saturday" as Weekday,
    Sunday: "sunday" as Weekday,
});

export function getWeekday(date: moment.Moment): string {
    return Weekdays[date.isoWeekday()]
}