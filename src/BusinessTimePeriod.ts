import moment = require("moment-timezone")
import { BusinessTime } from "./BusinessTime"

export class BusinessTimePeriod {
    static fromMoments(
        start: moment.Moment,
        end: moment.Moment,
    ): BusinessTimePeriod {
        return new BusinessTimePeriod(
            new BusinessTime(start),
            new BusinessTime(end),
        )
    }

    constructor(
        private readonly start: BusinessTime,
        private readonly end: BusinessTime,
    ) {}

    /**
     * Get an array of business time instances, one for each business day in
     * this period.
     *
     * Note that this skips through in whole days, so the time of day should be
     * representative of potential business time.
     */
    businessDays(): BusinessTime[] {
        return this.allDays().filter((day) => day.isBusinessTime())
    }

    /**
     * Get an array of business time instances, one for each non-business day in
     * this period.
     *
     * Note that this skips through in whole days, so the time of day should be
     * representative of potential business time.
     */
    nonBusinessDays(): BusinessTime[] {
        return this.allDays().filter((day) => !day.isBusinessTime())
    }

    /**
     * Get an array of business time instances, one for each day in this period.
     */
    allDays(): BusinessTime[] {
        const days: BusinessTime[] = []
        let next = this.getStart().clone()
        days.push(next)
        while (next.isBefore(this.getEnd().getMoment())) {
            next = next.add(moment.duration(1, "day"))
            days.push(next)
        }
        return days
    }

    businessPeriods(): BusinessTimePeriod[] {
        return this.subPeriods().filter((period) => period.isBusinessTime())
    }

    nonBusinessPeriods(): BusinessTimePeriod[] {
        return this.subPeriods().filter((period) => !period.isBusinessTime())
    }

    /**
     * Get this business time period separated into consecutive business and
     * non-business times.
     *
     * E.g. a time period from Monday 06:00 to Monday 20:00 could be:
     *     Monday 06:00 - Monday 09:00
     *     Monday 09:00 - Monday 17:00
     *     Monday 17:00 - Monday 20:00
     */
    subPeriods(): BusinessTimePeriod[] {
        const subPeriods: BusinessTimePeriod[] = []
        let next = this.getStart().clone()

        // Iterate from the getStart of the time period until we reach the end.
        const end = this.getEnd().getMoment()
        while (next.isBefore(end)) {
            let subStart = next.clone()

            // When we're in a business sub-period, keep going until we hit a
            // non-business sub-period or the end of the whole period.
            while (next.isBusinessTime() && next.isBefore(end)) {
                next = next.add(next.getPrecision())
            }
            // If we advanced by doing that, record it as a sub-period.
            if (next.isAfter(subStart.getMoment())) {
                subPeriods.push(
                    new BusinessTimePeriod(subStart.clone(), next.clone()),
                )
                subStart = next.clone()
            }

            // When we're in a non-business sub-period, keep going until we hit
            // a business sub-period or the end of the whole period.
            while (!next.isBusinessTime() && next.isBefore(end)) {
                next = next.add(next.getPrecision())
            }
            // If we advanced by doing that, record it as a sub-period.
            if (next.isAfter(subStart.getMoment())) {
                subPeriods.push(
                    new BusinessTimePeriod(subStart.clone(), next.clone()),
                )
            }
        }

        return subPeriods
    }

    /**
     * Get the business-relevant name of this period of time.
     *
     * The most commonly occurring name of all sub-intervals based on the
     * precision of the start time is used. This means that the name of a mixed
     * period might not be ideal.
     */
    businessName(): string {
        const names: string[] = []
        let next = this.getStart().clone()
        while (next.isBefore(this.getEnd().getMoment())) {
            names.push(next.businessName())
            next = next.add(next.getPrecision())
        }
        return mostCommonElement(names)
    }

    isBusinessTime(): boolean {
        return this.getStart().isBusinessTime()
    }

    getStart(): BusinessTime {
        return this.start.clone()
    }

    getEnd(): BusinessTime {
        return this.end.clone()
    }
}

function mostCommonElement(elements: string[]): string {
    const counts = new Map<string, number>()
    let mostCommon = ""
    let mostCommonCount = 0
    for (const element of elements) {
        const elementCount = (counts.get(element) || 0) + 1
        counts.set(element, elementCount)
        if (elementCount >= mostCommonCount) {
            mostCommon = element
            mostCommonCount = elementCount
        }
    }
    return mostCommon
}
