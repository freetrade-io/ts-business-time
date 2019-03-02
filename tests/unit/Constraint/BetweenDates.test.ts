import moment = require("moment-timezone")
import { BetweenDates } from "../../../src/constraint/BetweenDates"

describe("the 'between dates' constraint", () => {
    test.each([
        // Time         Min           Max          Match?
        ["2018-05-23", "2018-05-22", "2018-05-24", true],
        ["2018-05-23", "2018-05-23", "2018-05-24", true],
        ["2018-05-23", "2018-05-22", "2018-05-23", true],
        ["2018-05-23", "2018-05-23", "2018-05-23", true],
        ["2018-05-23", "2018-05-24", "2018-05-25", false],
        ["2018-05-23", "2018-05-21", "2018-05-22", false],
        ["2019-05-23", "2018-05-20", "2018-05-30", false],
        ["2018-05-23", "2019-05-20", "2019-05-30", false],
        ["2017-05-23", "2018-05-20", "2018-05-30", false],
        ["2020-02-29", "2020-02-01", "2020-03-01", true],
    ])(
        "constraining between dates",
        (
            time: string,
            minDate: string,
            maxDate: string,
            shouldMatch: boolean,
        ) => {
            // Given we have a time;
            const timeMoment = moment.utc(time, BetweenDates.FORMAT)

            // And a constraint matching times between certain dates;
            const constraint = new BetweenDates(minDate, maxDate)

            // Then the constraint should match the time as expected.
            expect(constraint.isBusinessTime(timeMoment)).toBe(shouldMatch)
        },
    )
})
