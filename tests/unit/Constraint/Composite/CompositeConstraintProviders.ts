import moment = require("moment-timezone")
import { BusinessTime } from "../../../../src"
import { AnyTime } from "../../../../src/constraint/AnyTime"
import { BetweenDaysOfWeek } from "../../../../src/constraint/BetweenDaysOfWeek"
import { BetweenHoursOfDay } from "../../../../src/constraint/BetweenHoursOfDay"
import { IBusinessTimeConstraint } from "../../../../src/constraint/BusinessTimeConstraint"
import { DaysOfWeek } from "../../../../src/constraint/DaysOfWeek"
import { HoursOfDay } from "../../../../src/constraint/HoursOfDay"
import { Never } from "../../../../src/constraint/Never"
import { WeekDays } from "../../../../src/constraint/WeekDays"
import { Weekends } from "../../../../src/constraint/Weekends"
import { TEST_FORMAT } from "../../../index"

/**
 * Get a business time instance that fits with the constraint providers.
 */
export function wednesdayOnePm(): BusinessTime {
    return new BusinessTime(
        moment.utc("Wednesday 2018-05-23 13:00", TEST_FORMAT),
    )
}

/**
 * Provides sets of constraints that all match Wednesday 2018-05-23 13:00
 * as business time.
 */
export function allMatchingWednesdayOnePm(): IBusinessTimeConstraint[][][] {
    return [
        [[new AnyTime(), new WeekDays(), new BetweenHoursOfDay("12", "14")]],
        [
            [
                new AnyTime(),
                new DaysOfWeek("Wednesday"),
                new BetweenHoursOfDay("12", "14"),
            ],
        ],
        [
            [
                new AnyTime(),
                new BetweenDaysOfWeek("Tuesday", "Thursday"),
                new HoursOfDay("08", "13", "20"),
            ],
        ],
    ]
}

/**
 * Provides sets of constraints none of which match Wednesday 2018-05-23
 * 13:00 as business time.
 */
export function noneMatchingWednesdayOnePm(): IBusinessTimeConstraint[][][] {
    return [
        [[new Never(), new Weekends(), new BetweenHoursOfDay("03", "07")]],
        [
            [
                new Never(),
                new DaysOfWeek("Tuesday", "Friday"),
                new BetweenHoursOfDay("15", "20"),
            ],
        ],
        [
            [
                new Never(),
                new BetweenDaysOfWeek("Thursday", "Saturday"),
                new HoursOfDay("08", "14", "20"),
            ],
        ],
    ]
}

/**
 * Provides sets of constraints some of which match Wednesday 2018-05-23
 * 13:00 as business time and some of which don't.
 */
export function someMatchingWednesdayOnePm(): IBusinessTimeConstraint[][][] {
    return allMatchingWednesdayOnePm().map(
        (
            matchingSetArgument: IBusinessTimeConstraint[][],
            index: number,
        ): IBusinessTimeConstraint[][] => {
            return [
                matchingSetArgument[0].concat(
                    noneMatchingWednesdayOnePm()[index][0],
                ),
            ]
        },
    )
}
