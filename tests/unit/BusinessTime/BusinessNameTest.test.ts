import { BusinessTime } from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("getting the business-relevant name of a time", () => {
    test.each([
        ["Monday 2019-02-11 00:00", "outside business hours"],
        ["Monday 2019-02-11 08:00", "outside business hours"],
        ["Monday 2019-02-11 08:59", "outside business hours"],
        ["Monday 2019-02-11 9:00", "business hours"],
        ["Friday 2019-02-15 16:00", "business hours"],
        ["Friday 2019-02-15 16:59", "business hours"],
        ["Friday 2019-02-15 17:00", "outside business hours"],
        ["Friday 2019-02-15 23:59", "outside business hours"],
        ["Saturday 2019-02-16 00:00", "the weekend"],
        ["Saturday 2019-02-16 10:00", "the weekend"],
        ["Sunday 2019-02-17 13:00", "the weekend"],
        ["Sunday 2019-02-17 23:59", "the weekend"],
    ])(
        "default business name",
        (time: string, expectedBusinessName: string) => {
            // Given we have a business time for a particular time;
            const businessTime = new BusinessTime(time, TEST_FORMAT)

            // Then the business name should be as expected.
            expect(businessTime.businessName()).toBe(expectedBusinessName)
        },
    )

    test("fallback business name", () => {
        // Given we have a business time for a particular time;
        const businessTime = new BusinessTime(
            "Wednesday 2018-05-23 13:00",
            TEST_FORMAT,
        )

        // And it has no business time constraints;
        businessTime.setBusinessTimeConstraints()

        // Then a fall-back business time name should be used.
        expect(businessTime.businessName()).toBe(
            "Wednesday 23rd May 2018 13:00",
        )
    })
})
