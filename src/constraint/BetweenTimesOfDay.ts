import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { RangeConstraint } from "./RangeConstraint"

/**
 * A business time constraint that matches times between certain times of day
 * as business time.
 *
 * e.g.
 * new BetweenTimesOfDay('8:30', '18:00') matches from 8:30am to 6pm.
 *
 * @see BetweenTimesOfDayTest
 */
export class BetweenTimesOfDay extends RangeConstraint
    implements IBusinessTimeConstraint {
    static Min = 0
    static Max = 1440

    private static minuteOfDay(timeOfDay: string): number {
        if (!timeOfDay.match(/^[0-2][0-9]:[0-5][0-9]$/)) {
            throw new Error(
                `Time of day ${timeOfDay} does not match format HH:mm`,
            )
        }
        const split = timeOfDay.split(":")

        const hours = Number(split[0])
        const minutes = Number(split[1])

        return minutes + hours * 60
    }

    constructor(min: string = "09:00", max: string = "17:00") {
        let minMinute = BetweenTimesOfDay.minuteOfDay(min)
        let maxMinute = BetweenTimesOfDay.minuteOfDay(max)

        // Interpret passing the same day as min and max as meaning any day of
        // the week.
        if (minMinute === maxMinute) {
            minMinute = BetweenTimesOfDay.Min
            maxMinute = BetweenTimesOfDay.Max
        } else {
            // Subtract one minute from the max to make it exclusive.
            maxMinute -= 1
        }

        super(minMinute, maxMinute)
    }

    relevantValueOf(time: moment.Moment): number {
        return BetweenTimesOfDay.minuteOfDay(time.format("HH:mm"))
    }

    /**
     * Get the maximum possible value of the range.
     */
    maxMax(): number {
        return BetweenTimesOfDay.Max
    }

    /**
     * Get the minimum possible value of the range.
     */
    minMin(): number {
        return BetweenTimesOfDay.Min
    }
}
