import moment = require("moment-timezone")
import { BusinessTime } from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("determining if a time is business time with default behaviour", () => {
    test.each([
        ["Monday 2018-05-21 00:00", false],
        ["Monday 2018-05-21 08:59", false],
        ["Monday 2018-05-21 09:00", true],
        ["Monday 2018-05-21 12:00", true],
        ["Monday 2018-05-21 16:59", true],
        ["Monday 2018-05-21 17:00", false],
        ["Monday 2018-05-21 23:59", false],
        ["Tuesday 2018-05-22 10:00", true],
        ["Wednesday 2018-05-23 11:00", true],
        ["Thursday 2018-05-24 12:00", true],
        ["Friday 2018-05-25 13:00", true],
        ["Saturday 2018-05-26 11:00", false],
        ["Sunday 2018-05-27 13:00", false],
        ["Saturday 2018-05-26 10:00", false],
        ["Sunday 2018-05-27 16:00", false],
    ])(
        "is business time with default behaviour",
        (time: string, expectedToBeBusinessTime: boolean) => {
            // Given we have a business time for a particular time;
            const businessTime: BusinessTime = new BusinessTime(
                moment.utc(time, TEST_FORMAT),
            )

            // Then it should know whether or not it is business time.
            expect(businessTime.isBusinessTime()).toBe(expectedToBeBusinessTime)
        },
    )
})
