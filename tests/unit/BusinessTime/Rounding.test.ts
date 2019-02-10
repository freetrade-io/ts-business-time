import * as moment from "moment"
import { BusinessTime } from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("rounding times", () => {
    /**
     * Test the BusinessTime.floor(), BusinessTime.round() and
     * BusinessTime.ceil() methods.
     *
     * Note that these methods only make sense for units of time up to 1 day.
     * Beyond that the results become unintuitive because the rounding is done
     * based on seconds since the epoch, which won't match up with concepts like
     * "the current week" or "current month".
     */

    test.each([
        ["Wednesday 2018-05-23 17:23", undefined, "Wednesday 2018-05-23 17:00"], // default precision
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "minute"),
            "Wednesday 2018-05-23 17:23",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(10, "minutes"),
            "Wednesday 2018-05-23 17:20",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(15, "minutes"),
            "Wednesday 2018-05-23 17:15",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(30, "minutes"),
            "Wednesday 2018-05-23 17:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "hour"),
            "Wednesday 2018-05-23 17:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(2, "hours"),
            "Wednesday 2018-05-23 16:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(3, "hours"),
            "Wednesday 2018-05-23 15:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(6, "hours"),
            "Wednesday 2018-05-23 12:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(8, "hours"),
            "Wednesday 2018-05-23 16:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(12, "hours"),
            "Wednesday 2018-05-23 12:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(18, "hours"),
            "Wednesday 2018-05-23 12:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "day"),
            "Wednesday 2018-05-23 00:00",
        ],
    ])(
        "flooring time",
        (
            time: string,
            precision: moment.Duration,
            expectedFlooredTime: string,
        ) => {
            // Given we have a business time instance for a specific time;
            const businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // When we floor it to a precision interval.
            const floored = businessTime.floored(precision)

            // Then we should get the expected floored time.
            expect(floored.format(TEST_FORMAT)).toBe(expectedFlooredTime)
        },
    )

    test.each([
        ["Wednesday 2018-05-23 17:23", null, "Wednesday 2018-05-23 17:00"], // default precision
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "minute"),
            "Wednesday 2018-05-23 17:23",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(10, "minutes"),
            "Wednesday 2018-05-23 17:20",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(15, "minutes"),
            "Wednesday 2018-05-23 17:30",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(30, "minutes"),
            "Wednesday 2018-05-23 17:30",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "hour"),
            "Wednesday 2018-05-23 17:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(2, "hours"),
            "Wednesday 2018-05-23 18:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(3, "hours"),
            "Wednesday 2018-05-23 18:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(6, "hours"),
            "Wednesday 2018-05-23 18:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(8, "hours"),
            "Wednesday 2018-05-23 16:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(12, "hours"),
            "Wednesday 2018-05-23 12:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(18, "hours"),
            "Wednesday 2018-05-23 12:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "day"),
            "Thursday 2018-05-24 00:00",
        ],
    ])(
        "rounding time",
        (
            time: string,
            precision: moment.Duration,
            expectedRoundedTime: string,
        ) => {
            // Given we have a business time instance for a specific time;
            const businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // When we round it to a precision interval;
            const rounded = businessTime.rounded(precision)

            // Then we should get the expected rounded time.
            expect(rounded.format(TEST_FORMAT)).toBe(expectedRoundedTime)
        },
    )

    test.each([
        ["Wednesday 2018-05-23 17:23", null, "Wednesday 2018-05-23 18:00"], // default precision
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "minute"),
            "Wednesday 2018-05-23 17:23",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(10, "minutes"),
            "Wednesday 2018-05-23 17:30",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(15, "minutes"),
            "Wednesday 2018-05-23 17:30",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(30, "minutes"),
            "Wednesday 2018-05-23 17:30",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "hour"),
            "Wednesday 2018-05-23 18:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(2, "hours"),
            "Wednesday 2018-05-23 18:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(3, "hours"),
            "Wednesday 2018-05-23 18:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(6, "hours"),
            "Wednesday 2018-05-23 18:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(8, "hours"),
            "Thursday 2018-05-24 00:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(12, "hours"),
            "Thursday 2018-05-24 00:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(18, "hours"),
            "Thursday 2018-05-24 06:00",
        ],
        [
            "Wednesday 2018-05-23 17:23",
            moment.duration(1, "day"),
            "Thursday 2018-05-24 00:00",
        ],
    ])(
        "ceiling time",
        (
            time: string,
            precision: moment.Duration,
            expectedCeiledTime: string,
        ) => {
            // Given we have a business time instance for a specific time;
            const businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // When we ceil it to a precision interval.
            const ceiled = businessTime.ceiled(precision)

            // Then we should get the expected ceil-ed time.
            expect(ceiled.format(TEST_FORMAT)).toBe(expectedCeiledTime)
        },
    )
})
