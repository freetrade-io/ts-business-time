import moment = require("moment-timezone")
import { BusinessTime } from "../BusinessTime"
import { IBusinessTimeConstraint } from "../constraint/BusinessTimeConstraint"
import { AllConstraints } from "../constraint/composite/AllConstraints"
import { AnyConstraint } from "../constraint"

/**
 * A recurring cut-off point in time. For example, orders might be shipped at
 * 11am on weekdays, and this class could be used to get the next shipping time.
 */
export class RecurringDeadline {
    private readonly deadlineConstraints: IBusinessTimeConstraint

    constructor(...deadlineConstraints: IBusinessTimeConstraint[]) {
        this.deadlineConstraints = new AllConstraints(
            AnyConstraint,
            ...deadlineConstraints,
        )
    }

    /**
     * Get the next time this deadline will occur after a given time.
     *
     * It's possible this will loop infinitely if the given constraints never
     * match a time with the given precision.
     */
    nextOccurrenceFrom(time: BusinessTime): BusinessTime {
        time = time.clone()

        // Advance until we're out of a current deadline (as we want the next).
        while (this.isDeadline(time.getMoment())) {
            time = time.add(time.getPrecision())
        }

        // Advance until we hit the next deadline.
        while (!this.isDeadline(time.getMoment())) {
            time = time.add(time.getPrecision())
        }

        return time.floored()
    }

    /**
     * Get the previous time this deadline occurred before a given time.
     *
     * It's possible this will loop infinitely if the given constraints never
     * match a time with the given precision.
     */
    previousOccurrenceFrom(time: BusinessTime): BusinessTime {
        time = time.clone()

        // Regress until we're out of a current deadline (as we want the
        // previous one).
        while (this.isDeadline(time.getMoment())) {
            time = time.subtract(time.getPrecision())
        }

        // Regress until we hit the next deadline.
        while (!this.isDeadline(time.getMoment())) {
            time = time.subtract(time.getPrecision())
        }

        return time.floored()
    }

    hasPassedToday(timezone?: string): boolean {
        timezone = timezone ? timezone : "UTC"
        const passed = this.firstTimePassedBetween(
            new BusinessTime(moment.tz(timezone).startOf("day")),
            new BusinessTime(moment.tz(timezone).endOf("day")),
        )

        return !!(passed && passed.isBefore(moment.tz(timezone)))
    }

    hasPassedBetween(start: BusinessTime, end: BusinessTime): boolean {
        return !!this.firstTimePassedBetween(start, end)
    }

    /**
     * Get the first time the deadline passes between two given times, if any.
     */
    firstTimePassedBetween(
        start: BusinessTime,
        end: BusinessTime,
    ): BusinessTime | null {
        let time = start.clone()
        while (time.isSameOrBefore(end.getMoment())) {
            if (this.isDeadline(time.getMoment())) {
                return time.floored()
            }
            time = time.add(time.getPrecision())
        }

        return null
    }

    private isDeadline(time: moment.Moment): boolean {
        return this.deadlineConstraints.isBusinessTime(time)
    }
}
