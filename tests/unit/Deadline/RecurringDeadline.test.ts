import moment = require("moment-timezone")
import { BusinessTime } from "../../../src"
import { HoursOfDay } from "../../../src/constraint/HoursOfDay"
import { WeekDays } from "../../../src/constraint/WeekDays"
import { RecurringDeadline } from "../../../src/deadline/RecurringDeadline"
import { TEST_FORMAT } from "../../index"

describe("RecurringDeadline", () => {
    test.each([
        // From Monday
        ["Monday 2018-05-21 00:00", "Monday 11:00"],
        ["Monday 2018-05-21 09:00", "Monday 11:00"],
        ["Monday 2018-05-21 09:30", "Monday 11:00"],
        ["Monday 2018-05-21 10:59", "Monday 11:00"],
        ["Monday 2018-05-21 11:00", "Tuesday 11:00"],
        ["Monday 2018-05-21 11:01", "Tuesday 11:00"],
        ["Monday 2018-05-21 17:00", "Tuesday 11:00"],
        ["Monday 2018-05-21 23:59", "Tuesday 11:00"],
        // From Friday
        ["Friday 2018-05-25 00:00", "Friday 11:00"],
        ["Friday 2018-05-25 09:00", "Friday 11:00"],
        ["Friday 2018-05-25 09:30", "Friday 11:00"],
        ["Friday 2018-05-25 10:59", "Friday 11:00"],
        ["Friday 2018-05-25 11:00", "Monday 11:00"],
        ["Friday 2018-05-25 11:01", "Monday 11:00"],
        ["Friday 2018-05-25 17:00", "Monday 11:00"],
        ["Friday 2018-05-25 23:59", "Monday 11:00"],
        // From Saturday
        ["Saturday 2018-05-26 00:00", "Monday 11:00"],
        ["Saturday 2018-05-26 09:00", "Monday 11:00"],
        ["Saturday 2018-05-26 09:30", "Monday 11:00"],
        ["Saturday 2018-05-26 10:59", "Monday 11:00"],
        ["Saturday 2018-05-26 11:00", "Monday 11:00"],
        ["Saturday 2018-05-26 11:01", "Monday 11:00"],
        ["Saturday 2018-05-26 17:00", "Monday 11:00"],
        ["Saturday 2018-05-26 23:59", "Monday 11:00"],
        // From Sunday
        ["Sunday 2018-05-27 00:00", "Monday 11:00"],
        ["Sunday 2018-05-27 09:00", "Monday 11:00"],
        ["Sunday 2018-05-27 09:30", "Monday 11:00"],
        ["Sunday 2018-05-27 10:59", "Monday 11:00"],
        ["Sunday 2018-05-27 11:00", "Monday 11:00"],
        ["Sunday 2018-05-27 11:01", "Monday 11:00"],
        ["Sunday 2018-05-27 17:00", "Monday 11:00"],
        ["Sunday 2018-05-27 23:59", "Monday 11:00"],
    ])(
        "nextOccurrenceFrom weekdays 11am",
        (time: string, expectedNextDeadline: string) => {
            // Given we have a recurring deadline for weekdays at 11am;
            const deadline = new RecurringDeadline(
                new WeekDays(),
                new HoursOfDay("11"),
            )

            // And a specific time;
            const businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // When we get the next occurrence of the deadline;
            const nextOccurrence = deadline.nextOccurrenceFrom(businessTime)

            // Then it should be as expected.
            expect(nextOccurrence.format("dddd HH:mm")).toEqual(
                expectedNextDeadline,
            )
        },
    )

    test.each([
        // From Friday
        ["Friday 2018-05-25 00:00", "Thursday 11:00"],
        ["Friday 2018-05-25 09:00", "Thursday 11:00"],
        ["Friday 2018-05-25 09:30", "Thursday 11:00"],
        ["Friday 2018-05-25 10:59", "Thursday 11:00"],
        ["Friday 2018-05-25 11:00", "Thursday 11:00"],
        ["Friday 2018-05-25 11:01", "Thursday 11:00"],
        ["Friday 2018-05-25 17:00", "Friday 11:00"],
        ["Friday 2018-05-25 23:59", "Friday 11:00"],
        // From Monday
        ["Monday 2018-05-21 00:00", "Friday 11:00"],
        ["Monday 2018-05-21 09:00", "Friday 11:00"],
        ["Monday 2018-05-21 09:30", "Friday 11:00"],
        ["Monday 2018-05-21 10:59", "Friday 11:00"],
        ["Monday 2018-05-21 11:00", "Friday 11:00"],
        ["Monday 2018-05-21 11:01", "Friday 11:00"],
        ["Monday 2018-05-21 17:00", "Monday 11:00"],
        ["Monday 2018-05-21 23:59", "Monday 11:00"],
        // From Saturday
        ["Saturday 2018-05-26 00:00", "Friday 11:00"],
        ["Saturday 2018-05-26 09:00", "Friday 11:00"],
        ["Saturday 2018-05-26 09:30", "Friday 11:00"],
        ["Saturday 2018-05-26 10:59", "Friday 11:00"],
        ["Saturday 2018-05-26 11:00", "Friday 11:00"],
        ["Saturday 2018-05-26 11:01", "Friday 11:00"],
        ["Saturday 2018-05-26 17:00", "Friday 11:00"],
        ["Saturday 2018-05-26 23:59", "Friday 11:00"],
        // From Sunday
        ["Sunday 2018-05-27 00:00", "Friday 11:00"],
        ["Sunday 2018-05-27 09:00", "Friday 11:00"],
        ["Sunday 2018-05-27 09:30", "Friday 11:00"],
        ["Sunday 2018-05-27 10:59", "Friday 11:00"],
        ["Sunday 2018-05-27 11:00", "Friday 11:00"],
        ["Sunday 2018-05-27 11:01", "Friday 11:00"],
        ["Sunday 2018-05-27 17:00", "Friday 11:00"],
        ["Sunday 2018-05-27 23:59", "Friday 11:00"],
    ])(
        "previousOccurrenceFrom weekdays 11am",
        (time: string, expectedPreviousDeadline: string) => {
            // Given we have a recurring deadline for weekdays at 11am;
            const deadline = new RecurringDeadline(
                new WeekDays(),
                new HoursOfDay("11"),
            )

            // And a specific time;
            const businessTime = new BusinessTime(moment.utc(time, TEST_FORMAT))

            // When we get the previous occurrence of the deadline;
            const previousOccurrence = deadline.previousOccurrenceFrom(
                businessTime,
            )

            // Then it should be as expected.
            expect(previousOccurrence.format("dddd HH:mm")).toEqual(
                expectedPreviousDeadline,
            )
        },
    )
})
