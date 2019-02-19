import { FormatConstraint } from "./FormatConstraint"

export type HourOfDay =
    | "00"
    | "01"
    | "02"
    | "03"
    | "04"
    | "05"
    | "06"
    | "07"
    | "08"
    | "09"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "17"
    | "18"
    | "19"
    | "20"
    | "21"
    | "22"
    | "23"

/**
 * Constraint that matches the given hours of the day with their numeric index.
 *
 * e.g.
 * new HoursOfDay("08", "13", "23") matches 8am, 1pm and 11pm.
 */
export class HoursOfDay extends FormatConstraint {
    constructor(...hoursOfDay: HourOfDay[]) {
        super("HH", hoursOfDay)
    }
}
