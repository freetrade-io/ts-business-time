import moment = require("moment")
import {
    DurationInputArg1,
    DurationInputArg2,
    ISO_8601,
    MomentInput,
    unitOfTime,
} from "moment"
import {BetweenHoursOfDay} from "./constraint/BetweenHoursOfDay"
import {IBusinessTimeConstraint} from "./constraint/BusinessTimeConstraint"
import {WeekDays} from "./constraint/WeekDays"

export class BusinessTime {
    private readonly moment: moment.Moment
    private precision: moment.Duration
    private constraints: IBusinessTimeConstraint[]

    private lengthOfBusinessDayCached?: moment.Duration = undefined

    constructor(
        input?: moment.MomentInput,
        format?: moment.MomentFormatSpecification,
        precision?: moment.Duration,
        constraints: IBusinessTimeConstraint[] = [
            new BetweenHoursOfDay(9, 17),
            new WeekDays(),
        ],
    ) {
        this.moment = moment.utc(input, format)
        if (!this.moment.isValid() || !this.moment.toISOString()) {
            throw new Error(`Invalid date time for business time: ${input}`)
        }
        this.precision = precision ? precision : moment.duration(1, "hour")
        this.constraints = constraints
    }

    isBusinessTime(): boolean {
        for (const constraint of this.constraints) {
            if (!constraint.isBusinessTime(this.getMoment())) {
                return false
            }
        }
        return true
    }

    addBusinessDay(): BusinessTime {
        return this.addBusinessDays(1)
    }

    addBusinessDays(businessDaysToAdd: number): BusinessTime {
        if (businessDaysToAdd === 0) {
            return this.clone()
        }

        if (businessDaysToAdd < 0) {
            return this.subBusinessDays(Math.abs(businessDaysToAdd))
        }

        // Jump ahead in whole days first, because the business days to add
        // will be at least this much. This solves the "intuitive problem" that
        // Monday 09:00 + 1 business day could technically be Monday 17:00, but
        // intuitively should be Tuesday 09:00.
        const daysToJump: number = Math.floor(businessDaysToAdd)
        let next: BusinessTime = this.add(daysToJump, "days")

        // We need to check how much business time we actually covered by
        // skipping ahead in days.
        businessDaysToAdd -= this.diffInPartialBusinessDays(next.getMoment())

        const decrement: number = this.precision.asDays() / this.lengthOfBusinessDay().asDays()

        while (businessDaysToAdd > 0) {
            if (next.isBusinessTime()) {
                businessDaysToAdd -= decrement
            }
            next = next.add(this.precision)
        }

        return next
    }

    subBusinessDay(): BusinessTime {
        return this.subBusinessDays(1)
    }

    subBusinessDays(businessDaysToSub: number): BusinessTime {
        if (businessDaysToSub === 0) {
            return this.clone()
        }

        if (businessDaysToSub < 0) {
            return this.addBusinessDays(Math.abs(businessDaysToSub))
        }

        // Jump back in whole days first, because the business days to subtract
        // will be at least this much. This also solves the "intuitive
        // problem" that Tuesday 17:00 - 1 business day could technically be
        // Tuesday 09:00, but intuitively should be Monday 17:00.
        const daysToJump: number = Math.floor(businessDaysToSub)
        let prev: BusinessTime = this.subtract(daysToJump, "days")

        // We need to check how much business time we actually covered by
        // skipping back in days.
        businessDaysToSub -= this.diffInPartialBusinessDays(prev.getMoment())

        const decrement: number = this.precision.asDays() / this.lengthOfBusinessDay().asDays()

        while (businessDaysToSub > 0) {
            prev = prev.subtract(this.precision)
            if (prev.isBusinessTime()) {
                businessDaysToSub -= decrement
            }
        }

        return prev
    }

    diffInBusinessDays(time?: moment.Moment, absolute: boolean = true): number {
        return Math.floor(this.diffInPartialBusinessDays(time, absolute))
    }

    diffInPartialBusinessDays(
        time?: moment.Moment,
        absolute: boolean = true,
    ): number {
        return this.diffInBusinessTime(time, absolute) / (
            this.lengthOfBusinessDay().asSeconds() / this.precision.asSeconds()
        )
    }

    /**
     * Difference in business time measured in units of the current precision.
     *
     * This is calculated by stepping through the time period in steps of the
     * precision. Finer precision means more steps but a potentially more
     * accurate result.
     */
    diffInBusinessTime(time?: moment.Moment, absolute: boolean = true): number {
        if (!time) {
            time = moment()
        }

        if (!time.isValid()) {
            throw new Error("Invalid time passed for diff")
        }

        if (time.isSame(this.getMoment(), "minutes")) {
            return 0
        }

        let start: moment.Moment = this.moment
        let end: moment.Moment = time
        let sign: number = 1

        // Swap if we're diffing back in time.
        if (this.moment.isAfter(time)) {
            start = time
            end = this.moment
            // We only need to negate if absolute is false.
            sign = absolute ? 1 : -1
        }

        // Count the business time diff by iterating in steps the length of the
        // precision and checking if each step counts as business time.
        let diff: number = 0
        let next: BusinessTime = this.atMoment(start)
        while (next.isBefore(end)) {
            if (next.isBusinessTime()) {
                diff += 1
            }
            next = next.add(this.precision)
        }

        return diff * sign
    }

    /**
     * Get a diff in business time as an interval.
     *
     * Note that seconds are only used as the unit here, not the precision.
     * E.g. with hour precision, we will iterate in steps of one hour, then
     * multiply the result to get the amount in seconds.
     */
    diffBusiness(
        time?: moment.Moment,
        absolute: boolean = true,
    ): moment.Duration {
        const diffInBusinessSeconds = this.diffInBusinessTime(time, absolute) * this.precision.asSeconds()
        return moment.duration(diffInBusinessSeconds, "seconds")
    }

    setBusinessTimeConstraints(...constraints: IBusinessTimeConstraint[]): BusinessTime {
        this.constraints = constraints

        return this
    }

    /**
     * Get the first business time after the start of this day.
     */
    startOfBusinessDay(): BusinessTime {
        // Iterate from the beginning of the day until we hit business time.
        let start: BusinessTime = this.startOf("day")
        while (!start.isBusinessTime()) {
            start = start.add(this.precision)
        }

        return start
    }

    /**
     * Get the last business time before the end of this day.
     */
    endOfBusinessDay(): BusinessTime {
        // Iterate back from the end of the day until we hit business time.
        let end: BusinessTime = this.endOf("day")
        while (!end.isBusinessTime()) {
            end = end.subtract(this.precision)
        }

        return end
    }

    lengthOfBusinessDay(): moment.Duration {
        if (!this.lengthOfBusinessDayCached) {
            this.determineLengthOfBusinessDay()
        }

        return this.lengthOfBusinessDayCached as moment.Duration
    }

    setLengthOfBusinessDay(duration: moment.Duration): BusinessTime {
        this.lengthOfBusinessDayCached = duration

        if (this.lengthOfBusinessDayCached.asMinutes() <= 0) {
            throw new Error("Business day cannot be zero-length.")
        }

        if (this.lengthOfBusinessDayCached.asHours() > 24) {
            throw new Error(
                "Length of business day cannot be more than 24 hours " +
                    `(set to ${this.lengthOfBusinessDayCached.asHours()} hours)`,
            )
        }

        return this
    }

    format(format?: string): string {
        return this.moment.format(format)
    }

    add(amount?: DurationInputArg1, unit?: DurationInputArg2): BusinessTime {
        return this.atMoment(this.moment.clone().add(amount, unit))
    }

    subtract(
        amount?: DurationInputArg1,
        unit?: DurationInputArg2,
    ): BusinessTime {
        return this.atMoment(this.moment.clone().subtract(amount, unit))
    }

    isAfter(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean {
        return this.moment.isAfter(inp, granularity)
    }

    isBefore(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean {
        return this.moment.isBefore(inp, granularity)
    }

    startOf(unit: unitOfTime.StartOf): BusinessTime {
        return this.atMoment(this.moment.startOf(unit))
    }

    endOf(unit: unitOfTime.StartOf): BusinessTime {
        return this.atMoment(this.moment.endOf(unit))
    }

    toISOString(keepOffset?: boolean): string {
        return this.moment.toISOString(keepOffset)
    }

    clone(): BusinessTime {
        return new BusinessTime(
            this.moment.toISOString(),
            ISO_8601,
            this.precision,
            this.constraints,
        )
    }

    atMoment(time: moment.Moment): BusinessTime {
        return new BusinessTime(
            time.toISOString(),
            ISO_8601,
            this.precision,
            this.constraints,
        )
    }

    getMoment(): moment.Moment {
        return this.moment.clone()
    }

    private determineLengthOfBusinessDay(
        typicalDay?: moment.Moment,
    ): BusinessTime {
        if (!typicalDay) {
            // Default to the length of a reasonable guess at a typical day.
            // We're using a fixed specific day for the default to keep
            // behaviour consistent.
            typicalDay = moment("2018-05-23T00:00:00Z", ISO_8601)
        }

        if (!typicalDay.isValid()) {
            throw new Error("Invalid typical day passed to determineLengthOfBusinessDay")
        }

        const typicalBusinessDay = this.atMoment(typicalDay)

        const startOfBusinessDay = typicalBusinessDay.startOfBusinessDay().getMoment()
        const endOfBusinessDay = typicalBusinessDay.endOfBusinessDay().getMoment()
        const lengthOfBusinessDay = this
            .atMoment(startOfBusinessDay)
            .diffBusiness(endOfBusinessDay)

        return this.setLengthOfBusinessDay(lengthOfBusinessDay)
    }
}
