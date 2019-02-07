import * as moment from "moment"
import { BusinessTime } from "../../../src"
import { BetweenHoursOfDay } from "../../../src/constraint/BetweenHoursOfDay"
import { IBusinessTimeConstraint } from "../../../src/constraint/BusinessTimeConstraint"
import { AllConstraints } from "../../../src/constraint/composite/AllConstraints"
import { WeekDays } from "../../../src/constraint/WeekDays"

describe("getting the length of a business day", () => {
    test("default length of a business day", () => {
        // Given we have a business time with the default behaviour;
        const businessTime: BusinessTime = new BusinessTime()

        // Then the length of a business day should be 8 hours.
        expect(businessTime.lengthOfBusinessDay().asHours()).toEqual(8)
        expect(businessTime.lengthOfBusinessDay().asMinutes()).toEqual(480)
    })

    test.each([
        [moment.duration(1, "hours"), 60 * 60],
        [moment.duration(2, "hours"), 2 * 60 * 60],
        [moment.duration(6, "hours"), 6 * 60 * 60],
        [moment.duration(18, "hours"), 18 * 60 * 60],
        [moment.duration(8 * 60 + 30, "minutes"), 8.5 * 60 * 60],
        [moment.duration(6 * 60 + 59, "minutes"), 6 * 60 * 60 + 59 * 60],
    ])(
        "set the length of a business day",
        (length: moment.Duration, expectedSeconds: number) => {
            // Given we have a business time with the default behaviour;
            const businessTime: BusinessTime = new BusinessTime()

            // And we set the length of the business day;
            businessTime.setLengthOfBusinessDay(length)

            // Then the length of the business day should be adjusted.
            expect(businessTime.lengthOfBusinessDay().asSeconds()).toEqual(
                expectedSeconds,
            )
        },
    )

    test.each([
        [new BetweenHoursOfDay(9, 17), 8 * 60 * 60],
        [new BetweenHoursOfDay(9, 12), 3 * 60 * 60],
        [new BetweenHoursOfDay(8, 18), 10 * 60 * 60],
        [new BetweenHoursOfDay(0, 23), 23 * 60 * 60],
        [new BetweenHoursOfDay(0, 24), 24 * 60 * 60],
        [new WeekDays(), 24 * 60 * 60],
        [
            new AllConstraints(new WeekDays(), new BetweenHoursOfDay(9, 17)),
            8 * 60 * 60,
        ],
        [
            // Exclude lunch time.
            new BetweenHoursOfDay(9, 17).exceptFor(
                new BetweenHoursOfDay(13, 14),
            ),
            7 * 60 * 60,
        ],
        [
            // Multiple periods.
            new BetweenHoursOfDay(8, 10)
                .orAlternatively(new BetweenHoursOfDay(12, 14))
                .orAlternatively(new BetweenHoursOfDay(16, 18)),
            6 * 60 * 60,
        ],
    ])(
        "determine length of business day",
        (constraint: IBusinessTimeConstraint, expectedSeconds: number) => {
            // Given we have a business time with certain constraints;
            const businessTime = new BusinessTime()
            businessTime.setBusinessTimeConstraints(constraint)

            // When we determine the length of a business day;
            const length: moment.Duration = businessTime.lengthOfBusinessDay()

            // Then the determined length of a business day should be as expected.
            expect(length.asSeconds()).toEqual(expectedSeconds)
        },
    )

    test("can't set zero length business day", () => {
        // When we try to set a zero-length business day.
        let error: Error | undefined
        try {
            const time = new BusinessTime()
            time.setLengthOfBusinessDay(moment.duration(0, "hours"))
        } catch (err) {
            error = err
        }

        // Then an error should be thrown.
        expect(error).toBeInstanceOf(Error)
        if (error) {
            // Keep compiler happy.
            expect(error.message).toBe("Business day cannot be zero-length.")
        }
    })

    test("can't set length of business day longer than 24 hours", () => {
        // When we try to set the length of a business day to be longer than 24
        // hours.
        let error: Error | undefined
        try {
            const time = new BusinessTime()
            time.setLengthOfBusinessDay(moment.duration(25, "hours"))
        } catch (err) {
            error = err
        }

        // Then an error should be thrown.
        expect(error).toBeInstanceOf(Error)
        if (error) {
            // Keep compiler happy.
            expect(error.message).toBe("Length of business day cannot be more than 24 hours (set to 25 hours)")
        }
    })
})
