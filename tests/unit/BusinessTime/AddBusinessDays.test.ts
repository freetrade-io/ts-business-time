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
        const businessTime = new BusinessTime(time, TEST_FORMAT)

        // When we add a business day to it;
        const nextBusinessDay: BusinessTime = businessTime.addBusinessDay()

        // Then we should get the expected new time.
        expect(nextBusinessDay.format(TEST_FORMAT)).toBe(expectedNewTime)
    })
})
