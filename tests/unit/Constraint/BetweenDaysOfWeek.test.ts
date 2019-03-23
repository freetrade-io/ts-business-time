import moment = require("moment-timezone")
import { BetweenDaysOfWeek } from "../../../src/constraint/BetweenDaysOfWeek"
import { DayOfWeek } from "../../../src/constraint/DaysOfWeek"
import { TEST_FORMAT } from "../../index"

describe("BetweenDaysOfWeek", () => {
    test.each([
        // Time       Min       Max      Match?
        ["Wednesday 2018-05-23 10:00", "Tuesday", "Wednesday", true],
        ["Wednesday 2018-05-23 10:00", "Tuesday", "Thursday", true],
        ["Wednesday 2018-05-23 10:00", "Thursday", "Tuesday", true],
        ["Thursday 2018-05-24 10:00", "Tuesday", "Thursday", true],
        ["Wednesday 2018-05-23 10:00", "Wednesday", "Wednesday", true],
        ["Wednesday 2018-05-23 10:00", "Monday", "Friday", true],
        ["Saturday 2018-05-26 10:00", "Monday", "Friday", false],
        ["Saturday 2018-05-26 10:00", "Sunday", "Saturday", true],
        ["Saturday 2018-05-26 10:00", "Monday", "Monday", true],
        ["Saturday 2018-05-26 10:00", "Monday", "Sunday", true],
        ["Thursday 2018-05-24 10:00", "Friday", "Saturday", false],
    ])(
        "constraining between days of the week",
        (
            time: string,
            minDayOfWeek: DayOfWeek,
            maxDayOfWeek: DayOfWeek,
            shouldMatch: boolean,
        ) => {
            // Given we have a business time;
            const timeMoment = moment.utc(time, TEST_FORMAT)

            // And a constraint matching times between days of the week;
            const constraint = new BetweenDaysOfWeek(minDayOfWeek, maxDayOfWeek)

            // Then the constraint should match the time as expected.
            expect(constraint.isBusinessTime(timeMoment)).toEqual(shouldMatch)
        },
    )
})
