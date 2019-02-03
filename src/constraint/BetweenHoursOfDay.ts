import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { RangeConstraint } from "./RangeConstraint"

export class BetweenHoursOfDay extends RangeConstraint
    implements IBusinessTimeConstraint {
    constructor(min: number = 9, max: number = 17) {
        // Subtract one from the max as we want to match it exclusively for
        // times of day. E.g. 17 should be a cut off at 5pm, excluding times
        // from 5pm onwards.
        super(min, max - 1)
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
