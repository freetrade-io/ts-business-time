import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { HourOfDay } from "./HoursOfDay"
import { RangeConstraint } from "./RangeConstraint"

export class BetweenHoursOfDay extends RangeConstraint
    implements IBusinessTimeConstraint {
    static hourOfDayIndex(hourOfDay: HourOfDay | "24"): number {
        return Number(hourOfDay)
    }

    constructor(min: HourOfDay = "09", max: HourOfDay | "24" = "17") {
        const minIndex = BetweenHoursOfDay.hourOfDayIndex(min)
        const maxIndex = BetweenHoursOfDay.hourOfDayIndex(max)

        // Subtract one from the max as we want to match it exclusively for
        // times of day. E.g. 17 should be a cut off at 5pm, excluding times
        // from 5pm onwards.
        super(minIndex, maxIndex - 1)
    }

    minMin(): number {
        return 0
    }

    maxMax(): number {
        return 23
    }

    relevantValueOf(time: moment.Moment): number {
        return time.hour()
    }
}
