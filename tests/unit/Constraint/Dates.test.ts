import moment = require("moment-timezone")
import { Dates } from "../../../src/constraint/Dates"

describe("the 'dates' business time constraint", () => {
    test.each([
        // Time              Dates           Match?
        ["January 1st 2018", ["2018-01-01"], true],
        ["January 1st 2018", ["2018-01-02"], false],
        ["January 1st 2018", ["2018-02-01"], false],
        ["January 1st 2018", ["2019-01-01"], false],
        ["January 2nd 2018", ["2018-01-01"], false],
        ["February 1st 2018", ["2018-02-01"], true],
        ["January 1st 2019", ["2019-01-01"], true],
        ["January 1st 2018", ["2018-01-01", "2018-05-23"], true],
        ["January 1st 2018", ["2018-01-02", "2018-01-01"], true],
        ["January 1st 2018", ["2018-02-01", "2018-01-01"], true],
        ["January 1st 2018", ["2019-01-01", "2018-01-01"], true],
        ["January 2nd 2018", ["2018-01-01", "2018-01-02"], true],
        ["February 1st 2018", ["2018-02-01", "2019-02-01"], true],
        ["January 1st 2019", ["2019-01-01", "2019-02-01"], true],
        ["February 29th 2020", ["2020-02-29"], true],
        ["February 29th 2020", ["2020-03-01"], false],
    ])(
        "constraining to dates",
        (time: string, dates: string[], shouldMatch: boolean) => {
            // Given we have a business time;
            const timeMoment = moment.utc(time, "MMMM Do YYYY")

            // And a constraint for certain dates;
            const constraint = new Dates(...dates)

            // Then the constraint should match the time as expected.
            expect(constraint.isBusinessTime(timeMoment)).toEqual(shouldMatch)
        },
    )
})
