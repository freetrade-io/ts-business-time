import moment = require("moment-timezone")
import { DayOfMonth } from "../../../src/constraint/BetweenDaysOfMonth"
import { DaysOfMonth } from "../../../src/constraint/DaysOfMonth"

describe("the 'days of month' business time constraint", () => {
    test.each([
        ["2018-01-01", ["1st"], true],
        ["2018-01-02", ["1st"], false],
        ["2018-01-02", ["2nd"], true],
        ["2018-01-02", ["1st", "2nd"], true],
        ["2018-01-31", ["1st", "8th", "23rd", "31st"], true],
        ["2020-02-29", ["29th"], true],
        ["2018-01-01", [1], true],
        ["2018-01-02", [1], false],
        ["2018-01-02", [2], true],
        ["2018-01-02", [1, 2], true],
        ["2018-01-31", [1, 8, 23, 31], true],
        ["2020-02-29", [29], true],
    ])(
        "constraining to days of the month",
        (time: string, daysOfMonth: DayOfMonth[], shouldMatch: boolean) => {
            // Given we have a business time;
            const timeMoment = moment.utc(time, "YYYY-MM-DD")

            // And a constraint for certain days of the month;
            const constraint = new DaysOfMonth(...daysOfMonth)

            // Then the constraint should match the time as expected.
            expect(constraint.isBusinessTime(timeMoment)).toEqual(shouldMatch)
        },
    )
})
