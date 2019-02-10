import * as moment from "moment"
import { BusinessTime } from "../../../src"

describe("business time calculation precision", () => {
    test("default precision", () => {
        // Given we have a business time with the default behaviour;
        const businessTime = new BusinessTime()

        // Then the precision should be 1 hour.
        expect(businessTime.getPrecision().asHours()).toBe(1)
    })

    test.each([
        [moment.duration(1, "second"), 1],
        [moment.duration(1, "minute"), 60],
        [moment.duration(90, "seconds"), 90],
        [moment.duration(1, "hour"), 3600],
    ])(
        "setting the precision",
        (precision: moment.Duration, expectedSeconds: number) => {
            // Given we have a business time instance;
            let businessTime = new BusinessTime()

            // When we set the precision;
            businessTime = businessTime.withPrecision(precision)

            // Then the precision should be as expected.
            expect(businessTime.getPrecision().asSeconds()).toEqual(
                expectedSeconds,
            )
        },
    )
})
