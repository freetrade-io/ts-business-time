import * as moment from "moment"
import { BusinessTime } from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("getting difference in business hours", () => {
    test.each([
        // Going forward in time.
        ["Monday 2018-05-14 00:00", "Monday 2018-05-14 09:00", 0],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 09:00", 0],
        ["Monday 2018-05-14 00:00", "Monday 2018-05-14 10:00", 1],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 10:00", 1],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 11:00", 2],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 12:00", 3],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 13:00", 4],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 14:00", 5],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 15:00", 6],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 16:00", 7],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 17:00", 8],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 18:00", 8],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 23:00", 8],
        ["Monday 2018-05-14 09:00", "Tuesday 2018-05-15 00:00", 8],
        ["Monday 2018-05-14 09:00", "Tuesday 2018-05-15 03:00", 8],
        ["Monday 2018-05-14 09:00", "Tuesday 2018-05-15 09:00", 8],
        ["Monday 2018-05-14 09:00", "Tuesday 2018-05-15 10:00", 9],
        ["Friday 2018-05-18 08:00", "Saturday 2018-05-19 13:00", 8],
        ["Friday 2018-05-18 09:00", "Saturday 2018-05-19 10:00", 8],
        ["Friday 2018-05-18 03:00", "Sunday 2018-05-20 19:00", 8],
        ["Friday 2018-05-18 07:00", "Monday 2018-05-21 08:00", 8],
        ["Friday 2018-05-18 06:00", "Monday 2018-05-21 09:00", 8],
        ["Friday 2018-05-18 05:00", "Monday 2018-05-21 10:00", 9],
        ["Friday 2018-05-18 09:00", "Monday 2018-05-21 10:00", 9],
        ["Friday 2018-05-18 10:00", "Monday 2018-05-21 10:00", 8],
        ["Friday 2018-05-18 09:00", "Monday 2018-05-21 11:00", 10],
        ["Friday 2018-05-18 09:00", "Monday 2018-05-21 17:00", 16],
        // Going back in time.
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 00:00", 0],
        ["Monday 2018-05-14 10:00", "Monday 2018-05-14 00:00", 1],
        ["Monday 2018-05-14 10:00", "Monday 2018-05-14 09:00", 1],
        ["Monday 2018-05-14 11:00", "Monday 2018-05-14 09:00", 2],
        ["Monday 2018-05-14 12:00", "Monday 2018-05-14 09:00", 3],
        ["Monday 2018-05-14 13:00", "Monday 2018-05-14 09:00", 4],
        ["Monday 2018-05-14 14:00", "Monday 2018-05-14 09:00", 5],
        ["Monday 2018-05-14 15:00", "Monday 2018-05-14 09:00", 6],
        ["Monday 2018-05-14 16:00", "Monday 2018-05-14 09:00", 7],
        ["Monday 2018-05-14 17:00", "Monday 2018-05-14 09:00", 8],
        ["Monday 2018-05-14 18:00", "Monday 2018-05-14 09:00", 8],
        ["Monday 2018-05-14 23:00", "Monday 2018-05-14 09:00", 8],
        ["Tuesday 2018-05-15 00:00", "Monday 2018-05-14 09:00", 8],
        ["Tuesday 2018-05-15 03:00", "Monday 2018-05-14 09:00", 8],
        ["Tuesday 2018-05-15 09:00", "Monday 2018-05-14 09:00", 8],
        ["Tuesday 2018-05-15 10:00", "Monday 2018-05-14 09:00", 9],
        ["Saturday 2018-05-19 13:00", "Friday 2018-05-18 08:00", 8],
        ["Saturday 2018-05-19 10:00", "Friday 2018-05-18 09:00", 8],
        ["Sunday 2018-05-20 19:00", "Friday 2018-05-18 03:00", 8],
        ["Monday 2018-05-21 08:00", "Friday 2018-05-18 07:00", 8],
        ["Monday 2018-05-21 09:00", "Friday 2018-05-18 06:00", 8],
        ["Monday 2018-05-21 10:00", "Friday 2018-05-18 05:00", 9],
        ["Monday 2018-05-21 10:00", "Friday 2018-05-18 09:00", 9],
        ["Monday 2018-05-21 10:00", "Friday 2018-05-18 10:00", 8],
        ["Monday 2018-05-21 11:00", "Friday 2018-05-18 09:00", 10],
        ["Monday 2018-05-21 17:00", "Friday 2018-05-18 09:00", 16],
    ])(
        "diff in business hours default",
        (time: string, otherTime: string, expectedDiff: number) => {
            // Given we have a business time for a particular time;
            const businessTime = new BusinessTime(time, TEST_FORMAT)

            // When we get the diff in business hours from another time;
            const diff = businessTime.diffInBusinessHours(
                moment.utc(otherTime, TEST_FORMAT),
            )

            // Then we should get the expected diff.
            expect(diff).toEqual(expectedDiff)
        },
    )

    test.each([
        // Going forward in time.
        ["Monday 2018-05-14 00:00", "Monday 2018-05-14 09:00", 0],
        ["Monday 2018-05-14 00:00", "Monday 2018-05-14 09:15", 0.25],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 09:30", 0.5],
        ["Monday 2018-05-14 00:00", "Monday 2018-05-14 10:45", 1.75],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 10:30", 1.5],
        ["Monday 2018-05-14 09:30", "Monday 2018-05-14 11:45", 2.25],
        ["Monday 2018-05-14 09:15", "Monday 2018-05-14 12:45", 3.5],
        ["Monday 2018-05-14 09:30", "Monday 2018-05-14 13:15", 3.75],
        ["Monday 2018-05-14 09:45", "Monday 2018-05-14 14:30", 4.75],
        ["Monday 2018-05-14 09:30", "Monday 2018-05-14 15:30", 6.0],
        ["Monday 2018-05-14 09:45", "Monday 2018-05-14 16:45", 7.0],
        ["Monday 2018-05-14 09:15", "Monday 2018-05-14 17:45", 7.75],
        ["Monday 2018-05-14 09:30", "Monday 2018-05-14 18:15", 7.5],
        ["Monday 2018-05-14 09:45", "Monday 2018-05-14 23:30", 7.25],
        ["Monday 2018-05-14 09:30", "Tuesday 2018-05-15 00:15", 7.5],
        ["Monday 2018-05-14 09:00", "Tuesday 2018-05-15 03:45", 8.0],
        ["Monday 2018-05-14 09:45", "Tuesday 2018-05-15 09:30", 7.75],
        ["Monday 2018-05-14 09:30", "Tuesday 2018-05-15 10:15", 8.75],
        ["Friday 2018-05-18 08:30", "Saturday 2018-05-19 13:45", 8.0],
        ["Friday 2018-05-18 09:45", "Saturday 2018-05-19 10:30", 7.25],
        ["Friday 2018-05-18 03:00", "Sunday 2018-05-20 19:15", 8.0],
        ["Friday 2018-05-18 07:30", "Monday 2018-05-21 08:30", 8.0],
        ["Friday 2018-05-18 06:45", "Monday 2018-05-21 09:45", 8.75],
        ["Friday 2018-05-18 05:30", "Monday 2018-05-21 10:30", 9.5],
        ["Friday 2018-05-18 09:00", "Monday 2018-05-21 10:00", 9.0],
        ["Friday 2018-05-18 10:15", "Monday 2018-05-21 10:15", 8.0],
        ["Friday 2018-05-18 09:45", "Monday 2018-05-21 11:30", 9.75],
        ["Friday 2018-05-18 09:30", "Monday 2018-05-21 17:45", 15.5],
        // Going back in time.
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 00:00", 0.0],
        ["Monday 2018-05-14 09:45", "Monday 2018-05-14 00:15", 0.75],
        ["Monday 2018-05-14 10:45", "Monday 2018-05-14 00:15", 1.75],
        ["Monday 2018-05-14 10:30", "Monday 2018-05-14 09:45", 0.75],
        ["Monday 2018-05-14 11:00", "Monday 2018-05-14 09:30", 1.5],
        ["Monday 2018-05-14 12:15", "Monday 2018-05-14 09:15", 3.0],
        ["Monday 2018-05-14 13:45", "Monday 2018-05-14 09:30", 4.25],
        ["Monday 2018-05-14 14:30", "Monday 2018-05-14 09:45", 4.75],
        ["Monday 2018-05-14 15:15", "Monday 2018-05-14 09:00", 6.25],
        ["Monday 2018-05-14 16:45", "Monday 2018-05-14 09:30", 7.25],
        ["Monday 2018-05-14 17:00", "Monday 2018-05-14 09:15", 7.75],
        ["Monday 2018-05-14 18:30", "Monday 2018-05-14 09:45", 7.25],
        ["Monday 2018-05-14 23:15", "Monday 2018-05-14 09:30", 7.5],
        ["Tuesday 2018-05-15 00:30", "Monday 2018-05-14 09:45", 7.25],
        ["Tuesday 2018-05-15 03:45", "Monday 2018-05-14 09:30", 7.5],
        ["Tuesday 2018-05-15 09:30", "Monday 2018-05-14 09:45", 7.75],
        ["Tuesday 2018-05-15 10:15", "Monday 2018-05-14 09:30", 8.75],
        ["Saturday 2018-05-19 13:45", "Friday 2018-05-18 09:15", 7.75],
        ["Saturday 2018-05-19 10:30", "Friday 2018-05-18 09:45", 7.25],
        ["Sunday 2018-05-20 19:15", "Friday 2018-05-18 03:15", 8.0],
        ["Monday 2018-05-21 08:15", "Friday 2018-05-18 07:30", 8.0],
        ["Monday 2018-05-21 09:45", "Friday 2018-05-18 06:00", 8.75],
        ["Monday 2018-05-21 10:00", "Friday 2018-05-18 05:45", 9.0],
        ["Monday 2018-05-21 10:45", "Friday 2018-05-18 09:15", 9.5],
        ["Monday 2018-05-21 10:45", "Friday 2018-05-18 10:30", 8.25],
        ["Monday 2018-05-21 11:15", "Friday 2018-05-18 09:45", 9.5],
        ["Monday 2018-05-21 17:00", "Friday 2018-05-18 09:15", 15.75],
    ])(
        "diff in partial business hours default",
        (time: string, otherTime: string, expectedDiff: number) => {
            // Given we have a business time for a particular time;
            let businessTime = new BusinessTime(time, TEST_FORMAT)

            // And we have 15-minute precision;
            businessTime = businessTime.withPrecision(
                moment.duration(15, "minutes"),
            )

            // When we get the diff in partial business hours from another time;
            const diff = businessTime.diffInPartialBusinessHours(
                moment.utc(otherTime, TEST_FORMAT),
            )

            // Then we should get the expected diff.
            expect(diff).toEqual(expectedDiff)
        },
    )
})
