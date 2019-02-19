import { FormatConstraint } from "./FormatConstraint"

export type DayOfWeek =
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"

/**
 * Constraint that matches the given days of week with their full names.
 */
export class DaysOfWeek extends FormatConstraint {
    constructor(...daysOfWeek: DayOfWeek[]) {
        super("dddd", daysOfWeek)
    }
}
