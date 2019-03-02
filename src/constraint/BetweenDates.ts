import moment = require("moment-timezone")
import {RangeConstraint} from "./RangeConstraint"

export class BetweenDates extends RangeConstraint {
    static readonly FORMAT = "YYYY-MM-DD"

    constructor(minDate: string, maxDate: string) {
        const minMoment = moment.utc(minDate, BetweenDates.FORMAT)
        const maxMoment = moment.utc(maxDate, BetweenDates.FORMAT)
        super(minMoment.startOf("day").unix(), maxMoment.endOf("day").unix())
    }

    maxMax(): number {
        return Number.MAX_SAFE_INTEGER
    }

    minMin(): number {
        return Number.MIN_SAFE_INTEGER
    }

    relevantValueOf(time: moment.Moment): number {
        return time.unix()
    }
}
