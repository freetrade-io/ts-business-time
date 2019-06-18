import moment = require("moment-timezone")
import { BetweenTimesOfDay } from "../../../src/constraint/BetweenTimesOfDay"
import { TEST_FORMAT } from "../../index"

describe("the 'between times of day' business time constraint", () => {
    test.each([
        // Min     Max      Time    Match?
        ["09:00", "17:00", "Wednesday 2018-05-23 12:00", true],
        ["09:00", "17:00", "Wednesday 2018-05-23 08:59", false],
        ["09:00", "17:00", "Wednesday 2018-05-23 09:00", true],
        ["09:00", "17:00", "Wednesday 2018-05-23 12:00", true],
        ["09:00", "17:00", "Wednesday 2018-05-23 15:30", true],
        ["09:00", "17:00", "Wednesday 2018-05-23 17:00", false],
        ["09:00", "17:00", "Wednesday 2018-05-23 17:01", false],
        ["09:30", "17:30", "Wednesday 2018-05-23 09:29", false],
        ["09:30", "17:30", "Wednesday 2018-05-23 09:30", true],
        ["09:30", "17:30", "Wednesday 2018-05-23 17:29", true],
        ["09:30", "17:30", "Wednesday 2018-05-23 17:30", false],
        ["00:00", "23:59", "Wednesday 2018-05-23 23:59", false],
        ["00:00", "00:00", "Wednesday 2018-05-23 23:59", true],
    ])(
        "constraining between times of day",
        (min: string, max: string, time: string, shouldMatch: boolean) => {
            // Given we have a constraint for between times of the day;
            const constraint = new BetweenTimesOfDay(min, max)

            // And a business time for a specific time;
            const timeMoment = moment.utc(time, TEST_FORMAT)

            // Then the constraint should match the time as expected.
            expect(constraint.isBusinessTime(timeMoment)).toEqual(shouldMatch)
        },
    )

    test.each([
        // Time Expected narration
        ["Wednesday 2018-05-23 08:00", "outside business hours"],
        ["Wednesday 2018-05-23 08:59", "outside business hours"],
        ["Wednesday 2018-05-23 09:00", "business hours"],
        ["Wednesday 2018-05-23 09:01", "business hours"],
        ["Wednesday 2018-05-23 13:00", "business hours"],
        ["Wednesday 2018-05-23 16:00", "business hours"],
        ["Wednesday 2018-05-23 16:59", "business hours"],
        ["Wednesday 2018-05-23 17:00", "outside business hours"],
        ["Wednesday 2018-05-23 17:01", "outside business hours"],
        ["Wednesday 2018-05-23 23:00", "outside business hours"],
    ])("between times of day narration", (time: string, expectedNarration: string) => {
        // Given we have a time;
        const timeMoment = moment.utc(time, TEST_FORMAT)

        // And a constraint for between 09:00 and 17:00.
        const constraint = new BetweenTimesOfDay("09:00", "17:00")

        // Then the constraint should narrate the time as expected.
        expect(constraint.narrate(timeMoment)).toEqual(expectedNarration)
    })
})
