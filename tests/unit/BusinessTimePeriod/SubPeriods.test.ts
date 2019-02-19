import moment = require("moment-timezone")
import { BusinessTimePeriod } from "../../../src/BusinessTimePeriod"
import { TEST_FORMAT } from "../../index"

describe("sub-periods of a business time period", () => {
    test.each([
        [
            "Monday 2018-05-21 03:00",
            "Monday 2018-05-21 19:00",
            [["Monday 09:00", "Monday 17:00"]],
        ],
        [
            "Monday 2018-05-21 09:00",
            "Tuesday 2018-05-22 17:00",
            [
                ["Monday 09:00", "Monday 17:00"],
                ["Tuesday 09:00", "Tuesday 17:00"],
            ],
        ],
        [
            "Monday 2018-05-21 05:00",
            "Wednesday 2018-05-23 23:00",
            [
                ["Monday 09:00", "Monday 17:00"],
                ["Tuesday 09:00", "Tuesday 17:00"],
                ["Wednesday 09:00", "Wednesday 17:00"],
            ],
        ],
        [
            "Friday 2018-05-25 13:00",
            "Tuesday 2018-05-29 11:00",
            [
                ["Friday 13:00", "Friday 17:00"],
                ["Monday 09:00", "Monday 17:00"],
                ["Tuesday 09:00", "Tuesday 11:00"],
            ],
        ],
    ])(
        "business sub-periods default",
        (
            startTime: string,
            endTime: string,
            expectedBusinessPeriodTimings: string[][],
        ) => {
            // Given we have a business time period with a start and end time;
            const timePeriod = BusinessTimePeriod.fromMoments(
                moment.utc(startTime, TEST_FORMAT),
                moment.utc(endTime, TEST_FORMAT),
            )

            // When we get the business sub-periods;
            const businessSubPeriods = timePeriod.businessPeriods()

            // Then their timings should be as expected;
            const subPeriodTimings = businessSubPeriods.map(
                (subPeriod): string[] => {
                    return [
                        subPeriod.getStart().format("dddd HH:mm"),
                        subPeriod.getEnd().format("dddd HH:mm"),
                    ]
                },
            )
            expect(subPeriodTimings).toEqual(expectedBusinessPeriodTimings)
        },
    )

    test.each([
        [
            "Monday 2018-05-21 03:00",
            "Monday 2018-05-21 19:00",
            [["Monday 09:00", "Monday 17:00"]],
        ],
        [
            "Monday 2018-05-21 09:00",
            "Tuesday 2018-05-22 17:00",
            [
                ["Monday 09:00", "Monday 17:00"],
                ["Tuesday 09:00", "Tuesday 17:00"],
            ],
        ],
        [
            "Monday 2018-05-21 05:00",
            "Wednesday 2018-05-23 23:00",
            [
                ["Monday 09:00", "Monday 17:00"],
                ["Tuesday 09:00", "Tuesday 17:00"],
                ["Wednesday 09:00", "Wednesday 17:00"],
            ],
        ],
        [
            "Friday 2018-05-25 13:00",
            "Tuesday 2018-05-29 11:00",
            [
                ["Friday 13:00", "Friday 17:00"],
                ["Monday 09:00", "Monday 17:00"],
                ["Tuesday 09:00", "Tuesday 11:00"],
            ],
        ],
    ])(
        "non-business sub-periods default",
        (
            startTime: string,
            endTime: string,
            expectedNonBusinessPeriodTimings: string[][],
        ) => {
            // Given we have a business time period with a start and end time;
            const timePeriod = BusinessTimePeriod.fromMoments(
                moment.utc(startTime, TEST_FORMAT),
                moment.utc(endTime, TEST_FORMAT),
            )

            // When we get the non-business sub-periods;
            const nonBusinessSubPeriods = timePeriod.businessPeriods()

            // Then their timings should be as expected;
            const subPeriodTimings = nonBusinessSubPeriods.map(
                (subPeriod): string[] => {
                    return [
                        subPeriod.getStart().format("dddd HH:mm"),
                        subPeriod.getEnd().format("dddd HH:mm"),
                    ]
                },
            )
            expect(subPeriodTimings).toEqual(expectedNonBusinessPeriodTimings)
        },
    )

    test.each([
        [
            "Monday 2018-05-21 03:00",
            "Monday 2018-05-21 19:00",
            [
                ["Monday 03:00", "Monday 09:00"],
                ["Monday 09:00", "Monday 17:00"],
                ["Monday 17:00", "Monday 19:00"],
            ],
        ],
        [
            "Monday 2018-05-21 09:00",
            "Tuesday 2018-05-22 17:00",
            [
                ["Monday 09:00", "Monday 17:00"],
                ["Monday 17:00", "Tuesday 09:00"],
                ["Tuesday 09:00", "Tuesday 17:00"],
            ],
        ],
        [
            "Monday 2018-05-21 05:00",
            "Wednesday 2018-05-23 23:00",
            [
                ["Monday 05:00", "Monday 09:00"],
                ["Monday 09:00", "Monday 17:00"],
                ["Monday 17:00", "Tuesday 09:00"],
                ["Tuesday 09:00", "Tuesday 17:00"],
                ["Tuesday 17:00", "Wednesday 09:00"],
                ["Wednesday 09:00", "Wednesday 17:00"],
                ["Wednesday 17:00", "Wednesday 23:00"],
            ],
        ],
        [
            "Friday 2018-05-25 13:00",
            "Tuesday 2018-05-29 11:00",
            [
                ["Friday 13:00", "Friday 17:00"],
                ["Friday 17:00", "Monday 09:00"],
                ["Monday 09:00", "Monday 17:00"],
                ["Monday 17:00", "Tuesday 09:00"],
                ["Tuesday 09:00", "Tuesday 11:00"],
            ],
        ],
    ])(
        "all sub-periods default",
        (
            startTime: string,
            endTime: string,
            expectedSubPeriodTimings: string[][],
        ) => {
            // Given we have a business time period with a start and end time;
            const timePeriod = BusinessTimePeriod.fromMoments(
                moment.utc(startTime, TEST_FORMAT),
                moment.utc(endTime, TEST_FORMAT),
            )

            // When we get all the sub-periods;
            const subPeriods = timePeriod.subPeriods()

            // Then their timings should be as expected;
            const subPeriodTimings = subPeriods.map(
                (subPeriod): string[] => {
                    return [
                        subPeriod.getStart().format("dddd HH:mm"),
                        subPeriod.getEnd().format("dddd HH:mm"),
                    ]
                },
            )
            expect(subPeriodTimings).toEqual(expectedSubPeriodTimings)
        },
    )
})
