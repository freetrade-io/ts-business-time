import moment = require("moment-timezone")
import { DaysOfYear } from "../../../src/constraint/DaysOfYear"

describe("the 'days of year' business time constraint", () => {
    test.each([
        // Time        Days of year     Match?
        ["2018-01-01", ["1st January"], true],
        ["2018-01-02", ["1st January"], false],
        ["2018-02-01", ["1st January"], false],
        ["2018-01-02", ["1st January", "2nd January"], true],
        ["2018-02-01", ["1st January", "1st February"], true],
        ["2018-12-25", ["1st January", "1st February"], false],
        ["2018-12-25", ["1st January", "25th December", "1st February"], true],
    ])(
        "constraining to days of the year",
        (time: string, daysOfYear: string[], shouldMatch: boolean) => {
            // Given we have a business time;
            const timeMoment = moment.utc(time, "YYYY-MM-DD")

            // And a constraint for certain days of the year;
            const constraint = new DaysOfYear(...daysOfYear)

            // Then the constraint should match the time as expected.
            expect(constraint.isBusinessTime(timeMoment)).toEqual(shouldMatch)
        },
    )
})
