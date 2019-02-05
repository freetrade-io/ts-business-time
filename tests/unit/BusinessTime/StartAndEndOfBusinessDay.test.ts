import { BusinessTime } from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("finding the start and end of a business day", () => {
    test.each([
        ["Wednesday 2018-05-23 00:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 08:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 09:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 10:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 16:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 17:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 18:00", "Wednesday 2018-05-23 09:00"],
        ["Wednesday 2018-05-23 23:00", "Wednesday 2018-05-23 09:00"],
        ["Saturday 2018-05-26 18:00", "Monday 2018-05-28 09:00"],
        ["Sunday 2018-05-27 19:00", "Monday 2018-05-28 09:00"],
    ])(
        "determine the start of a default business day",
        (time: string, expectedStartOfBusinessDay: string) => {
            // Given we have a business time for a particular time;
            const businessTime: BusinessTime = new BusinessTime(
                time,
                TEST_FORMAT,
            )

            // When we get the start of the business day;
            const startOfBusinessDay: BusinessTime = businessTime.startOfBusinessDay()

            // Then it should be as expected.
            expect(startOfBusinessDay.format(TEST_FORMAT)).toEqual(
                expectedStartOfBusinessDay,
            )
        },
    )

    test.each([
        ["Wednesday 2018-05-23 00:00", "Wednesday 2018-05-23 16:59"],
        ["Wednesday 2018-05-23 08:00", "Wednesday 2018-05-23 16:59"],
        ["Wednesday 2018-05-23 09:00", "Wednesday 2018-05-23 16:59"],
        ["Wednesday 2018-05-23 10:00", "Wednesday 2018-05-23 16:59"],
        ["Wednesday 2018-05-23 16:00", "Wednesday 2018-05-23 16:59"],
        ["Wednesday 2018-05-23 17:00", "Wednesday 2018-05-23 16:59"],
        ["Wednesday 2018-05-23 18:00", "Wednesday 2018-05-23 16:59"],
        ["Wednesday 2018-05-23 23:00", "Wednesday 2018-05-23 16:59"],
        ["Saturday 2018-05-26 03:00", "Friday 2018-05-25 16:59"],
        ["Sunday 2018-05-27 02:00", "Friday 2018-05-25 16:59"],
    ])(
        "determine the end of a default business day",
        (time: string, expectedEndOfBusinessDay: string) => {
            // Given we have a business time for a particular time;
            const businessTime: BusinessTime = new BusinessTime(
                time,
                TEST_FORMAT,
            )

            // When we get the start of the business day;
            const endOfBusinessDay: BusinessTime = businessTime.endOfBusinessDay()

            // Then it should be as expected.
            expect(endOfBusinessDay.format(TEST_FORMAT)).toEqual(
                expectedEndOfBusinessDay,
            )
        },
    )
})
