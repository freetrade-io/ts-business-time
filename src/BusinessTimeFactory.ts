import moment = require("moment-timezone")
import { BusinessTime } from "./BusinessTime"
import { BetweenHoursOfDay } from "./constraint/BetweenHoursOfDay"
import { IBusinessTimeConstraint } from "./constraint/BusinessTimeConstraint"
import { WeekDays } from "./constraint/WeekDays"

export class BusinessTimeFactory {
    private readonly precision: moment.Duration
    private readonly constraints: IBusinessTimeConstraint[]

    constructor(
        precision?: moment.Duration,
        constraints: IBusinessTimeConstraint[] = [
            new WeekDays(),
            new BetweenHoursOfDay("09", "17"),
        ],
    ) {
        // Default to hour precision.
        this.precision = precision ? precision : moment.duration(1, "hour")
        this.constraints = constraints
    }

    make(time?: moment.Moment): BusinessTime {
        time = time || moment.utc()
        if (!time.isValid() || !time.toISOString()) {
            throw new Error(`Invalid date time for business time: ${time}`)
        }
        return new BusinessTime(time, this.precision, this.constraints)
    }

    now(): BusinessTime {
        return this.make(moment.utc())
    }

    withConstraints(
        ...constraints: IBusinessTimeConstraint[]
    ): BusinessTimeFactory {
        return new BusinessTimeFactory(this.precision, constraints)
    }

    withPrecision(precision: moment.Duration): BusinessTimeFactory {
        return new BusinessTimeFactory(precision, this.constraints)
    }
}
