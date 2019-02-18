import moment = require("moment-timezone")
import { BusinessTimePeriod } from "../../../src/BusinessTimePeriod"
import { TEST_FORMAT } from "../../index"

describe("business name time period", () => {
    test.each([
        [
            "Monday 2018-05-21 09:00",
            "Monday 2018-05-21 17:00",
            "business hours",
        ],
        [
            "Monday 2018-05-21 17:00",
            "Monday 2018-05-21 20:00",
            "outside business hours",
        ],
        [
            "Monday 2018-05-21 17:00",
            "Tuesday 2018-05-22 09:00",
            "outside business hours",
        ],
        ["Friday 2018-05-25 17:00", "Monday 2018-05-28 09:00", "the weekend"],
        // Mixed periods default to the most commonly occurring name.
        [
            "Monday 2018-05-21 03:00",
            "Monday 2018-05-21 19:00",
            "outside business hours",
        ],
        [
            "Monday 2018-05-21 09:00",
            "Tuesday 2018-05-22 17:00",
            "business hours",
        ],
        [
            "Monday 2018-05-21 05:00",
            "Wednesday 2018-05-23 23:00",
            "outside business hours",
        ],
        ["Friday 2018-05-25 13:00", "Tuesday 2018-05-29 11:00", "the weekend"],
    ])(
        "business name default",
        (startTime: string, endTime: string, expectedBusinessName: string) => {
            // Given we have a business time period with a particular start and end;
            const timePeriod = BusinessTimePeriod.fromMoments(
                moment.utc(startTime, TEST_FORMAT),
                moment.utc(endTime, TEST_FORMAT),
            )

            // When we get its business-relevant name;
            const businessName = timePeriod.businessName()

            // Then it should be as expected.
            expect(businessName).toBe(expectedBusinessName)
        },
    )
})
