import moment = require("moment-timezone")
import { BetweenDates } from "../../../src/constraint/BetweenDates"
import {
    BetweenDaysOfMonth,
    DayOfMonth,
} from "../../../src/constraint/BetweenDaysOfMonth"
import { TEST_FORMAT } from "../../index"

describe("the 'between days of month' business time constraint", () => {
    test.each([
        // Min Max Time        Match?
        ["5th", "8th", "2018-01-07", true],
        ["8th", "5th", "2018-01-07", true],
        ["5th", "8th", "2018-01-01", false],
        ["5th", "31st", "2018-01-31", true],
        ["5th", "31st", "2018-01-04", false],
        ["29th", "29th", "2020-02-29", true],
        ["25th", "26th", "2018-05-23", false],
        ["23rd", "24th", "2018-05-23", true],
        ["22nd", "23rd", "2018-05-23", true],
        ["22nd", "24th", "2018-05-23", true],
        ["1st", "31st", moment.utc().format(TEST_FORMAT), true],
    ])(
        "constraining between days of the month",
        (
            minDayOfMonth: DayOfMonth,
            maxDayOfMonth: DayOfMonth,
            time: string,
            shouldMatch: boolean,
        ) => {
            // Given we have a time;
            const timeMoment = moment.utc(time, BetweenDates.FORMAT)

            // And a constraint matching times between days of the month;
            const constraint = new BetweenDaysOfMonth(
                minDayOfMonth,
                maxDayOfMonth,
            )

            // Then the constraint should match the time as expected.
            expect(constraint.isBusinessTime(timeMoment)).toEqual(shouldMatch)
        },
    )
})
