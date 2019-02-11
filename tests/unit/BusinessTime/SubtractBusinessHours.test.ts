import * as moment from "moment"
import { BusinessTime } from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("subtracting business hours", () => {
    test.each([
        ["Wednesday 2018-05-23 10:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 10:15", "Wednesday 2018-05-23 09:15"],
        ["Wednesday 2018-05-23 10:30", "Wednesday 2018-05-23 09:30"],
        ["Wednesday 2018-05-23 10:45", "Wednesday 2018-05-23 09:45"],
        ["Wednesday 2018-05-23 11:00", "Wednesday 2018-05-23 10:00"],
        ["Wednesday 2018-05-23 12:00", "Wednesday 2018-05-23 11:00"],
        ["Wednesday 2018-05-23 13:00", "Wednesday 2018-05-23 12:00"],
        ["Wednesday 2018-05-23 14:00", "Wednesday 2018-05-23 13:00"],
        ["Wednesday 2018-05-23 15:00", "Wednesday 2018-05-23 14:00"],
        ["Wednesday 2018-05-23 16:00", "Wednesday 2018-05-23 15:00"],
        ["Wednesday 2018-05-23 17:00", "Wednesday 2018-05-23 16:00"],
        ["Wednesday 2018-05-23 18:00", "Wednesday 2018-05-23 16:00"],
        ["Wednesday 2018-05-23 23:00", "Wednesday 2018-05-23 16:00"],
        ["Monday 2018-05-21 00:00", "Friday 2018-05-18 16:00"],
        ["Monday 2018-05-21 09:00", "Friday 2018-05-18 16:00"],
        ["Monday 2018-05-21 09:30", "Friday 2018-05-18 16:30"],
        ["Sunday 2018-05-20 02:00", "Friday 2018-05-18 16:00"],
        ["Saturday 2018-05-19 03:00", "Friday 2018-05-18 16:00"],
    ])(
        "subtract business hour default",
        (time: string, expectedNewTime: string) => {
            // Given we have a business time for a specific time;
            const businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // When we subtract a business hour from it;
            const previousBusinessHour = businessTime.subtractBusinessHour()

            // Then we should get the expected new time.
            expect(previousBusinessHour.format(TEST_FORMAT)).toBe(
                expectedNewTime,
            )
        },
    )

    test.each([
        // Subtracting less than a day.
        ["Wednesday 2018-05-23 17:00", 0, "Wednesday 2018-05-23 17:00"],
        ["Wednesday 2018-05-23 17:00", 0.25, "Wednesday 2018-05-23 16:45"],
        ["Wednesday 2018-05-23 17:00", 0.5, "Wednesday 2018-05-23 16:30"],
        ["Wednesday 2018-05-23 17:00", 0.75, "Wednesday 2018-05-23 16:15"],
        ["Wednesday 2018-05-23 17:00", 1, "Wednesday 2018-05-23 16:00"],
        ["Wednesday 2018-05-23 17:00", 1.25, "Wednesday 2018-05-23 15:45"],
        ["Wednesday 2018-05-23 17:00", 1.5, "Wednesday 2018-05-23 15:30"],
        ["Wednesday 2018-05-23 17:00", 1.75, "Wednesday 2018-05-23 15:15"],
        ["Wednesday 2018-05-23 17:00", 2, "Wednesday 2018-05-23 15:00"],
        // Subtracting a whole business day or more.
        ["Wednesday 2018-05-23 17:00", 8, "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 17:00", 8.25, "Tuesday 2018-05-22 16:45"],
        ["Wednesday 2018-05-23 17:00", 8.5, "Tuesday 2018-05-22 16:30"],
        ["Wednesday 2018-05-23 17:00", 8.75, "Tuesday 2018-05-22 16:15"],
        ["Wednesday 2018-05-23 17:00", 9, "Tuesday 2018-05-22 16:00"],
        ["Wednesday 2018-05-23 17:00", 16, "Tuesday 2018-05-22 09:00"],
        ["Wednesday 2018-05-23 17:00", 23, "Monday 2018-05-21 10:00"],
        ["Wednesday 2018-05-23 17:00", 24, "Monday 2018-05-21 09:00"],
        // Negative values.
        ["Wednesday 2018-05-23 17:00", -0, "Wednesday 2018-05-23 17:00"],
        ["Wednesday 2018-05-23 17:00", -0.25, "Thursday 2018-05-24 09:15"],
        ["Wednesday 2018-05-23 17:00", -0.5, "Thursday 2018-05-24 09:30"],
        ["Wednesday 2018-05-23 17:00", -0.75, "Thursday 2018-05-24 09:45"],
        ["Wednesday 2018-05-23 17:00", -1, "Thursday 2018-05-24 10:00"],
        ["Wednesday 2018-05-23 17:00", -1.25, "Thursday 2018-05-24 10:15"],
        ["Wednesday 2018-05-23 17:00", -1.5, "Thursday 2018-05-24 10:30"],
        ["Wednesday 2018-05-23 17:00", -1.75, "Thursday 2018-05-24 10:45"],
        ["Wednesday 2018-05-23 17:00", -2, "Thursday 2018-05-24 11:00"],
    ])(
        "subtract business hours default",
        (
            time: string,
            businessHoursToSubtract: number,
            expectedNewTime: string,
        ) => {
            // Given we have a business time for a specific time;
            let businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // And it has 15-minute precision;
            businessTime = businessTime.withPrecision(
                moment.duration(15, "minutes"),
            )

            // When we subtract a business hour from it;
            const subtracted = businessTime.subtractBusinessHours(
                businessHoursToSubtract,
            )

            // Then we should get the expected new time.
            expect(subtracted.format(TEST_FORMAT)).toBe(expectedNewTime)
        },
    )
})
