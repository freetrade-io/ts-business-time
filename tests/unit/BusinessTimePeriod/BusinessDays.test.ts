import moment = require("moment-timezone")
import { BusinessTimePeriod } from "../../../src/BusinessTimePeriod"
import { TEST_FORMAT } from "../../index"

describe("business days time period", () => {
    test.each([
        ["Monday 2018-05-21 10:00", "Monday 2018-05-21 10:00", ["Monday"]],
        [
            "Monday 2018-05-21 10:00",
            "Tuesday 2018-05-22 10:00",
            ["Monday", "Tuesday"],
        ],
        [
            "Wednesday 2018-05-23 10:00",
            "Friday 2018-05-25 10:00",
            ["Wednesday", "Thursday", "Friday"],
        ],
        [
            "Friday 2018-05-25 10:00",
            "Monday 2018-05-28 10:00",
            ["Friday", "Monday"],
        ],
        ["Saturday 2018-05-26 10:00", "Sunday 2018-05-27 10:00", []],
    ])(
        "business days default",
        (
            startTime: string,
            endTime: string,
            expectedBusinessDays: string[],
        ) => {
            // Given we have a business time period with a particular start and end;
            const timePeriod = BusinessTimePeriod.fromMoments(
                moment.utc(startTime, TEST_FORMAT),
                moment.utc(endTime, TEST_FORMAT),
            )

            // When we get the business days inside it;
            const businessDays = timePeriod.businessDays()

            // Then they should be as expected.
            const businessDayNames = businessDays.map((day) =>
                day.format("dddd"),
            )
            expect(businessDayNames).toEqual(expectedBusinessDays)
        },
    )

    test.each([
        ["Wednesday 2018-05-23 10:00", "Friday 2018-05-25 10:00", []],
        ["Friday 2018-05-25 10:00", "Saturday 2018-05-26 10:00", ["Saturday"]],
        [
            "Friday 2018-05-25 10:00",
            "Monday 2018-05-28 10:00",
            ["Saturday", "Sunday"],
        ],
        ["Sunday 2018-05-27 10:00", "Tuesday 2018-05-29 10:00", ["Sunday"]],
    ])(
        "non business days default",
        (
            startTime: string,
            endTime: string,
            expectedNonBusinessDays: string[],
        ) => {
            // Given we have a business time period with a particular start and end;
            const timePeriod = BusinessTimePeriod.fromMoments(
                moment.utc(startTime, TEST_FORMAT),
                moment.utc(endTime, TEST_FORMAT),
            )

            // When we get the non-business days inside it;
            const nonBusinessDays = timePeriod.nonBusinessDays()

            // Then they should be as expected.
            const nonBusinessDayNames = nonBusinessDays.map((day) =>
                day.format("dddd"),
            )
            expect(nonBusinessDayNames).toEqual(expectedNonBusinessDays)
        },
    )

    test.each([
        ["Monday 2018-05-21 10:00", "Monday 2018-05-21 10:00", ["Monday"]],
        [
            "Monday 2018-05-21 10:00",
            "Tuesday 2018-05-22 10:00",
            ["Monday", "Tuesday"],
        ],
        [
            "Wednesday 2018-05-23 10:00",
            "Friday 2018-05-25 10:00",
            ["Wednesday", "Thursday", "Friday"],
        ],
        [
            "Friday 2018-05-25 10:00",
            "Monday 2018-05-28 10:00",
            ["Friday", "Saturday", "Sunday", "Monday"],
        ],
    ])(
        "days in a day period",
        (startTime: string, endTime: string, expectedDays: string[]) => {
            // Given we have a business time period with a particular start and end;
            const timePeriod = BusinessTimePeriod.fromMoments(
                moment.utc(startTime, TEST_FORMAT),
                moment.utc(endTime, TEST_FORMAT),
            )

            // When we get all the days inside it;
            const days = timePeriod.allDays()

            // Then they should be as expected.
            const allDayNames = days.map((day) => day.format("dddd"))
            expect(allDayNames).toEqual(expectedDays)
        },
    )
})
