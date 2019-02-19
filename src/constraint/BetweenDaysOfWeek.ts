import * as moment from "moment"
import { DayOfWeek } from "./DaysOfWeek"
import { RangeConstraint } from "./RangeConstraint"

/**
 * Constraint that matches business time between given days of the week,
 * inclusively.
 *
 * This follows ISO 8601, so Monday is the first day of the week and Sunday
 * is the last.
 * https://en.wikipedia.org/wiki/ISO_week_date
 *
 * e.g.
 * new BetweenDaysOfWeek('Monday', 'Friday') matches week days.
 * new BetweenDaysOfWeek('Monday', 'Saturday') matches week days and Saturday.
 * new BetweenDaysOfWeek('Monday', 'Sunday') matches any day.
 */
export class BetweenDaysOfWeek extends RangeConstraint {
    static readonly DaysOfWeekIndex = new Map<DayOfWeek, number>([
        ["Sunday", 0],
        ["Monday", 1],
        ["Tuesday", 2],
        ["Wednesday", 3],
        ["Thursday", 4],
        ["Friday", 5],
        ["Saturday", 6],
    ])
    static readonly Min = 0
    static readonly Max = 6

    constructor(min: DayOfWeek, max: DayOfWeek) {
        let minIndex =
            BetweenDaysOfWeek.DaysOfWeekIndex.get(min) || BetweenDaysOfWeek.Min
        let maxIndex =
            BetweenDaysOfWeek.DaysOfWeekIndex.get(max) || BetweenDaysOfWeek.Max

        // Interpret passing the same day as min and max as meaning any day of
        // the week.
        if (minIndex === maxIndex) {
            minIndex = BetweenDaysOfWeek.Min
            maxIndex = BetweenDaysOfWeek.Max
        }

        super(minIndex, maxIndex)
    }

    maxMax(): number {
        return BetweenDaysOfWeek.Min
    }

    minMin(): number {
        return BetweenDaysOfWeek.Max
    }

    relevantValueOf(time: moment.Moment): number {
        return time.weekday()
    }
}
