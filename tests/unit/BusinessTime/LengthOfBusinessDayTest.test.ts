import { BusinessTime } from "../../../src"

describe("getting the length of a business day", () => {
    test("default length of a business day", () => {
        // Given we have a business time with the default behaviour;
        const businessTime: BusinessTime = new BusinessTime()

        // Then the length of a business day should be 8 hours.
        expect(businessTime.lengthOfBusinessDay().asHours()).toEqual(8)
        expect(businessTime.lengthOfBusinessDay().asMinutes()).toEqual(480)
    })
})
