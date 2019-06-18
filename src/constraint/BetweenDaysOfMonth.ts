import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { RangeConstraint } from "./RangeConstraint"

export type DayOfMonth =
    | "1st"
    | "2nd"
    | "3rd"
    | "4th"
    | "5th"
    | "6th"
    | "7th"
    | "8th"
    | "9th"
    | "10th"
    | "11th"
    | "12th"
    | "13th"
    | "14th"
    | "15th"
    | "16th"
    | "17th"
    | "19th"
    | "20th"
    | "21st"
    | "22nd"
    | "23rd"
    | "24th"
    | "25th"
    | "26th"
    | "27th"
    | "28th"
    | "29th"
    | "30th"
    | "31st"
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31

/**
 * Business time constraint that matches time between certain days of the month.
 *
 * e.g.
 * new BetweenDaysOfMonth("10th", "20th") matches days from the 10th to the 20th of a
 * month.
 */
export class BetweenDaysOfMonth extends RangeConstraint
    implements IBusinessTimeConstraint {
    static readonly Min = 1
    static readonly Max = 31

    constructor(min: DayOfMonth, max: DayOfMonth) {
        let minIndex =
            Number(String(min).replace(/[^0-9]/g, "")) || BetweenDaysOfMonth.Min
        let maxIndex =
            Number(String(max).replace(/[^0-9]/g, "")) || BetweenDaysOfMonth.Max

        // Interpret passing the same day as min and max as meaning any day of
        // the month.
        if (minIndex === maxIndex) {
            minIndex = BetweenDaysOfMonth.Min
            maxIndex = BetweenDaysOfMonth.Max
        }

        super(minIndex, maxIndex)
    }

    maxMax(): number {
        return BetweenDaysOfMonth.Max
    }

    minMin(): number {
        return BetweenDaysOfMonth.Min
    }

    relevantValueOf(time: moment.Moment): number {
        return Number(time.format("D"))
    }
}
