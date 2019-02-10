import * as moment from "moment"
import { BusinessTime } from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("adding business days", () => {
    test.each([
        ["Monday 2018-05-14 00:00", "Tuesday 2018-05-15 00:00"],
        ["Monday 2018-05-14 08:00", "Tuesday 2018-05-15 08:00"],
        ["Monday 2018-05-14 09:00", "Tuesday 2018-05-15 09:00"],
        ["Monday 2018-05-14 10:00", "Tuesday 2018-05-15 10:00"],
        ["Monday 2018-05-14 17:00", "Tuesday 2018-05-15 17:00"],
        ["Tuesday 2018-05-15 11:00", "Wednesday 2018-05-16 11:00"],
        ["Wednesday 2018-05-16 12:00", "Thursday 2018-05-17 12:00"],
        ["Thursday 2018-05-17 13:00", "Friday 2018-05-18 13:00"],
        ["Friday 2018-05-18 14:00", "Monday 2018-05-21 14:00"],
        ["Saturday 2018-05-19 15:00", "Monday 2018-05-21 17:00"],
        ["Sunday 2018-05-20 16:00", "Monday 2018-05-21 17:00"],
    ])("add business day default", (time: string, expectedNewTime: string) => {
        // Given we have a business time for a specific time;
        const businessTime: BusinessTime = new BusinessTime(
            moment.utc(time, TEST_FORMAT),
        )

        // When we add a business day to it;
        const nextBusinessDay: BusinessTime = businessTime.addBusinessDay()

        // Then we should get the expected new time.
        expect(nextBusinessDay.format(TEST_FORMAT)).toBe(expectedNewTime)
    })

    test.each([
        // From Monday morning.
        ["Monday 2018-05-14 00:00", 0, "Monday 2018-05-14 00:00"],
        ["Monday 2018-05-14 09:00", 0, "Monday 2018-05-14 09:00"],
        ["Monday 2018-05-14 09:00", 0.25, "Monday 2018-05-14 11:00"],
        ["Monday 2018-05-14 09:00", 0.5, "Monday 2018-05-14 13:00"],
        ["Monday 2018-05-14 09:00", 0.75, "Monday 2018-05-14 15:00"],
        ["Monday 2018-05-14 09:00", 1, "Tuesday 2018-05-15 09:00"],
        ["Monday 2018-05-14 00:00", 1, "Tuesday 2018-05-15 00:00"],
        ["Monday 2018-05-14 09:00", 1.25, "Tuesday 2018-05-15 11:00"],
        ["Monday 2018-05-14 09:00", 1.5, "Tuesday 2018-05-15 13:00"],
        ["Monday 2018-05-14 09:00", 1.75, "Tuesday 2018-05-15 15:00"],
        ["Monday 2018-05-14 09:00", 2, "Wednesday 2018-05-16 09:00"],
        // From Friday evening.
        ["Friday 2018-05-18 00:00", 0, "Friday 2018-05-18 00:00"],
        ["Friday 2018-05-18 17:00", 0, "Friday 2018-05-18 17:00"],
        ["Friday 2018-05-18 17:00", 0.25, "Monday 2018-05-21 11:00"],
        ["Friday 2018-05-18 17:00", 0.5, "Monday 2018-05-21 13:00"],
        ["Friday 2018-05-18 17:00", 0.75, "Monday 2018-05-21 15:00"],
        ["Friday 2018-05-18 17:00", 1, "Monday 2018-05-21 17:00"],
        ["Friday 2018-05-18 17:00", 1.25, "Tuesday 2018-05-22 11:00"],
        ["Friday 2018-05-18 17:00", 1.5, "Tuesday 2018-05-22 13:00"],
        ["Friday 2018-05-18 17:00", 1.75, "Tuesday 2018-05-22 15:00"],
        ["Friday 2018-05-18 17:00", 2, "Tuesday 2018-05-22 17:00"],
        ["Friday 2018-05-18 17:00", 3, "Wednesday 2018-05-23 17:00"],
        // Negative values.
        ["Friday 2018-05-18 00:00", -0, "Friday 2018-05-18 00:00"],
        ["Friday 2018-05-18 17:00", -0, "Friday 2018-05-18 17:00"],
        ["Friday 2018-05-18 17:00", -0.25, "Friday 2018-05-18 15:00"],
        ["Friday 2018-05-18 17:00", -0.5, "Friday 2018-05-18 13:00"],
        ["Friday 2018-05-18 17:00", -0.75, "Friday 2018-05-18 11:00"],
        ["Friday 2018-05-18 17:00", -1, "Thursday 2018-05-17 17:00"],
        ["Friday 2018-05-18 17:00", -1.25, "Thursday 2018-05-17 15:00"],
        ["Friday 2018-05-18 17:00", -1.5, "Thursday 2018-05-17 13:00"],
        ["Friday 2018-05-18 17:00", -1.75, "Thursday 2018-05-17 11:00"],
        ["Friday 2018-05-18 17:00", -2, "Wednesday 2018-05-16 17:00"],
    ])(
        "testAddBusinessDaysDefault",
        (time: string, businessDaysToAdd: number, expectedNewTime: string) => {
            // Given we have a business time for a specific time;
            const businessTime: BusinessTime = new BusinessTime(
                moment.utc(time, TEST_FORMAT),
            )

            // When we add an amount of business days to it;
            const added: BusinessTime = businessTime.addBusinessDays(
                businessDaysToAdd,
            )

            // Then we should get the expected new time.
            expect(added.format(TEST_FORMAT)).toBe(expectedNewTime)
        },
    )
})
