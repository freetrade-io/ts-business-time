import * as moment from "moment"
import { BusinessTime } from "../../../src"
import { BetweenHoursOfDay } from "../../../src/constraint/BetweenHoursOfDay"
import { IBusinessTimeConstraint } from "../../../src/constraint/BusinessTimeConstraint"
import { TEST_FORMAT } from "../../index"

describe("adding business hours", () => {
    test.each([
        ["Monday 2018-05-14 00:00", "Monday 2018-05-14 10:00"],
        ["Monday 2018-05-14 08:00", "Monday 2018-05-14 10:00"],
        ["Monday 2018-05-14 09:00", "Monday 2018-05-14 10:00"],
        ["Monday 2018-05-14 09:15", "Monday 2018-05-14 10:15"],
        ["Monday 2018-05-14 09:30", "Monday 2018-05-14 10:30"],
        ["Monday 2018-05-14 09:45", "Monday 2018-05-14 10:45"],
        ["Monday 2018-05-14 10:00", "Monday 2018-05-14 11:00"],
        ["Monday 2018-05-14 11:00", "Monday 2018-05-14 12:00"],
        ["Monday 2018-05-14 12:00", "Monday 2018-05-14 13:00"],
        ["Monday 2018-05-14 13:00", "Monday 2018-05-14 14:00"],
        ["Monday 2018-05-14 14:00", "Monday 2018-05-14 15:00"],
        ["Monday 2018-05-14 15:00", "Monday 2018-05-14 16:00"],
        ["Monday 2018-05-14 16:00", "Monday 2018-05-14 17:00"],
        ["Monday 2018-05-14 17:00", "Tuesday 2018-05-15 10:00"],
        ["Monday 2018-05-14 18:00", "Tuesday 2018-05-15 10:00"],
        ["Monday 2018-05-14 23:00", "Tuesday 2018-05-15 10:00"],
        ["Friday 2018-05-18 16:00", "Friday 2018-05-18 17:00"],
        ["Friday 2018-05-18 17:00", "Monday 2018-05-21 10:00"],
        ["Saturday 2018-05-19 08:00", "Monday 2018-05-21 10:00"],
        ["Saturday 2018-05-19 18:00", "Monday 2018-05-21 10:00"],
        ["Sunday 2018-05-20 07:00", "Monday 2018-05-21 10:00"],
        ["Sunday 2018-05-20 19:00", "Monday 2018-05-21 10:00"],
    ])(
        "add business hour with default behaviour",
        (time: string, expectedNewTime: string) => {
            // Given we have a business time for a specific time;
            const businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // When we add a business hour to it;
            const nextBusinessHour = businessTime.addBusinessHour()

            // Then we should get the expected new time.
            expect(nextBusinessHour.format(TEST_FORMAT)).toBe(expectedNewTime)
        },
    )

    test.each([
        // Adding less than a day.
        ["Monday 2018-05-14 09:00", 0, "Monday 2018-05-14 09:00"],
        ["Monday 2018-05-14 09:00", 0.25, "Monday 2018-05-14 09:15"],
        ["Monday 2018-05-14 09:00", 0.5, "Monday 2018-05-14 09:30"],
        ["Monday 2018-05-14 09:00", 0.75, "Monday 2018-05-14 09:45"],
        ["Monday 2018-05-14 09:00", 1, "Monday 2018-05-14 10:00"],
        ["Monday 2018-05-14 09:00", 1.25, "Monday 2018-05-14 10:15"],
        ["Monday 2018-05-14 09:00", 1.5, "Monday 2018-05-14 10:30"],
        ["Monday 2018-05-14 09:00", 1.75, "Monday 2018-05-14 10:45"],
        ["Monday 2018-05-14 09:00", 2, "Monday 2018-05-14 11:00"],
        ["Monday 2018-05-14 09:00", 7.75, "Monday 2018-05-14 16:45"],
        // Adding a whole business day or more.
        ["Monday 2018-05-14 09:00", 8, "Monday 2018-05-14 17:00"],
        ["Monday 2018-05-14 09:00", 8.25, "Tuesday 2018-05-15 09:15"],
        ["Monday 2018-05-14 09:00", 8.5, "Tuesday 2018-05-15 09:30"],
        ["Monday 2018-05-14 09:00", 8.75, "Tuesday 2018-05-15 09:45"],
        ["Monday 2018-05-14 09:00", 9, "Tuesday 2018-05-15 10:00"],
        ["Monday 2018-05-14 09:00", 16, "Tuesday 2018-05-15 17:00"],
        ["Monday 2018-05-14 09:00", 23, "Wednesday 2018-05-16 16:00"],
        ["Monday 2018-05-14 09:00", 24, "Wednesday 2018-05-16 17:00"],
        // Negative values.
        ["Monday 2018-05-14 09:00", -0, "Monday 2018-05-14 09:00"],
        ["Monday 2018-05-14 09:00", -0.25, "Friday 2018-05-11 16:45"],
        ["Monday 2018-05-14 09:00", -0.5, "Friday 2018-05-11 16:30"],
        ["Monday 2018-05-14 09:00", -0.75, "Friday 2018-05-11 16:15"],
        ["Monday 2018-05-14 09:00", -1, "Friday 2018-05-11 16:00"],
        ["Monday 2018-05-14 09:00", -1.25, "Friday 2018-05-11 15:45"],
        ["Monday 2018-05-14 09:00", -1.5, "Friday 2018-05-11 15:30"],
        ["Monday 2018-05-14 09:00", -1.75, "Friday 2018-05-11 15:15"],
        ["Monday 2018-05-14 09:00", -2, "Friday 2018-05-11 15:00"],
    ])(
        "add business hour with default behaviour",
        (time: string, businessHoursToAdd: number, expectedNewTime: string) => {
            // Given we have a business time for a specific time;
            let businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // And we have 15-minute precision;
            businessTime = businessTime.withPrecision(
                moment.duration(15, "minutes"),
            )

            // When we add an amount of business hours to it;
            const added = businessTime.addBusinessHours(businessHoursToAdd)

            // Then we should get the expected new time.
            expect(added.format(TEST_FORMAT)).toBe(expectedNewTime)
        },
    )

    test.each([
        [
            "Monday 2018-05-14 09:00",
            // Exclude lunch time.
            new BetweenHoursOfDay("09", "17").exceptFor(
                new BetweenHoursOfDay("13", "14"),
            ),
            4,
            "Monday 2018-05-14 13:00",
        ],
        [
            "Monday 2018-05-14 09:00",
            // Exclude lunch time.
            new BetweenHoursOfDay("09", "17").exceptFor(
                new BetweenHoursOfDay("13", "14"),
            ),
            5, // Would be 14:00, but we're not counting lunch time.
            "Monday 2018-05-14 15:00",
        ],
        [
            "Monday 2018-05-14 09:00",
            // Exclude lunch time.
            new BetweenHoursOfDay("09", "17").exceptFor(
                new BetweenHoursOfDay("13", "14"),
            ),
            7 + 5, // 1 full day, plus 5 hours.
            "Tuesday 2018-05-15 15:00",
        ],
    ])(
        "add business hours with constraints",
        (
            time: string,
            constraint: IBusinessTimeConstraint,
            businessHoursToAdd: number,
            expectedNewTime: string,
        ) => {
            // Given we have a business time for a specific time;
            let businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // And we set specific business time constraints;
            businessTime = businessTime.withConstraints(constraint)

            // And we have 15-minute precision;
            businessTime = businessTime.withPrecision(
                moment.duration(15, "minutes"),
            )

            // When we add an amount of business hours to it;
            const added = businessTime.addBusinessHours(businessHoursToAdd)

            // Then we should get the expected new time.
            expect(added.format(TEST_FORMAT)).toBe(expectedNewTime)
        },
    )
})
