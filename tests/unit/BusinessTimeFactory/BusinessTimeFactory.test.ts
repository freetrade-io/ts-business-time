import moment = require("moment-timezone")
import { BusinessTimeFactory } from "../../../src/BusinessTimeFactory"
import {DaysOfWeek} from "../../../src/constraint/DaysOfWeek"
import {TEST_FORMAT} from "../../index"

describe("business time factory", () => {
    test("calling make()", () => {
        // Given we have a business time factory;
        let factory = new BusinessTimeFactory()
        factory = factory.withConstraints(new DaysOfWeek("Tuesday"))
        factory = factory.withPrecision(moment.duration(30, "minutes"))

        // When we use it to make a business time instance;
        const businessTime = factory.make(moment.utc("Wednesday 2018-05-16 11:00", TEST_FORMAT))

        // Then the instance should be set up correctly.
        expect(businessTime.getPrecision().asMinutes()).toBe(30)
        expect(businessTime.getConstraints().length).toBe(1)
        expect(businessTime.isBusinessTime()).toBeFalsy()
    })

    test("calling now()", () => {
        // Given we have a business time factory;
        let factory = new BusinessTimeFactory()
        factory = factory.withConstraints(new DaysOfWeek("Tuesday"))
        factory = factory.withPrecision(moment.duration(15, "minutes"))

        // When we use it to make a business time instance for the current time;
        const now = moment.utc()
        const businessTime = factory.now()

        // Then the instance should be set up correctly.
        expect(businessTime.getPrecision().asMinutes()).toBe(15)
        expect(businessTime.getConstraints().length).toBe(1)
        expect(businessTime.format("YYYY-MM-DD HH:mm")).toEqual(now.format("YYYY-MM-DD HH:mm"))
    })
})
