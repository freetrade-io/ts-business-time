import moment = require("moment-timezone")
import {
    BetweenHoursOfDay,
    BusinessTime,
    Dates,
    NotConstraint,
    WeekDays,
} from "../../../src"
import { TEST_FORMAT } from "../../index"

describe("Checking BusinessTime", () => {
    test.each([
        ["Monday 2018-05-14 04:00", true],
        ["Tuesday 2018-05-15 04:00", false],
        ["Wednesday 2018-05-16 04:00", true],
    ])("Is BusinessDay", (time: string, expectedIsBusinessDay: boolean) => {
        // Given we have a business time for a specific time with constraints
        const businessTime: BusinessTime = new BusinessTime(
            moment.utc(time, TEST_FORMAT),
            moment.duration(1, "hour"),
            [
                new WeekDays(),
                new BetweenHoursOfDay("09", "17"),
                new NotConstraint(new Dates("2018-05-15")),
            ],
        )
        
        // We check the business time is a business day
        const isBusinessDay = businessTime.isBusinessDay()

        expect(isBusinessDay).toBe(expectedIsBusinessDay)
    })
})
