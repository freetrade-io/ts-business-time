import * as moment from "moment-timezone"
import { BusinessTime } from "../../../src"

describe("ceiling business time in a time zone", () => {
    const gmtTimeLow = "2019-02-12T20:23:57.050Z"
    const gmtTimeHigh = "2019-02-12T20:42:57.050Z"
    const localTimeFormat = "YYYY-MM-DDTHH:mm:ssZ"

    test.each([
        [
            "Africa/Bangui",
            "2019-02-12T21:23:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Africa/Kinshasa",
            "2019-02-12T21:23:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Africa/Windhoek",
            "2019-02-12T22:23:57+02:00",
            "2019-02-12T23:00:00+02:00",
        ],
        [
            "America/Cayenne",
            "2019-02-12T17:23:57-03:00",
            "2019-02-12T18:00:00-03:00",
        ],
        [
            "America/Guatemala",
            "2019-02-12T14:23:57-06:00",
            "2019-02-12T15:00:00-06:00",
        ],
        [
            "America/New_York",
            "2019-02-12T15:23:57-05:00",
            "2019-02-12T16:00:00-05:00",
        ],
        [
            "America/Toronto",
            "2019-02-12T15:23:57-05:00",
            "2019-02-12T16:00:00-05:00",
        ],
        [
            "Antarctica/Casey",
            "2019-02-13T04:23:57+08:00",
            "2019-02-13T05:00:00+08:00",
        ],
        [
            "Antarctica/Troll",
            "2019-02-12T20:23:57+00:00",
            "2019-02-12T21:00:00+00:00",
        ],
        [
            "Antarctica/Vostok",
            "2019-02-13T02:23:57+06:00",
            "2019-02-13T03:00:00+06:00",
        ],
        [
            "Arctic/Longyearbyen",
            "2019-02-12T21:23:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Asia/Bishkek",
            "2019-02-13T02:23:57+06:00",
            "2019-02-13T03:00:00+06:00",
        ],
        [
            "Asia/Kathmandu",
            "2019-02-13T02:08:57+05:45",
            "2019-02-13T03:00:00+05:45",
        ],
        [
            "Asia/Rangoon",
            "2019-02-13T02:53:57+06:30",
            "2019-02-13T03:00:00+06:30",
        ],
        [
            "Asia/Seoul",
            "2019-02-13T05:23:57+09:00",
            "2019-02-13T06:00:00+09:00",
        ],
        [
            "Asia/Shanghai",
            "2019-02-13T04:23:57+08:00",
            "2019-02-13T05:00:00+08:00",
        ],
        [
            "Asia/Tehran",
            "2019-02-12T23:53:57+03:30",
            "2019-02-13T00:00:00+03:30",
        ],
        [
            "Asia/Tokyo",
            "2019-02-13T05:23:57+09:00",
            "2019-02-13T06:00:00+09:00",
        ],
        [
            "Atlantic/Reykjavik",
            "2019-02-12T20:23:57+00:00",
            "2019-02-12T21:00:00+00:00",
        ],
        [
            "Australia/Adelaide",
            "2019-02-13T06:53:57+10:30",
            "2019-02-13T07:00:00+10:30",
        ],
        [
            "Australia/Sydney",
            "2019-02-13T07:23:57+11:00",
            "2019-02-13T08:00:00+11:00",
        ],
        [
            "Europe/Amsterdam",
            "2019-02-12T21:23:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Europe/London",
            "2019-02-12T20:23:57+00:00",
            "2019-02-12T21:00:00+00:00",
        ],
        [
            "Europe/Zurich",
            "2019-02-12T21:23:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Indian/Antananarivo",
            "2019-02-12T23:23:57+03:00",
            "2019-02-13T00:00:00+03:00",
        ],
        [
            "Indian/Reunion",
            "2019-02-13T00:23:57+04:00",
            "2019-02-13T01:00:00+04:00",
        ],
        [
            "Pacific/Auckland",
            "2019-02-13T09:23:57+13:00",
            "2019-02-13T10:00:00+13:00",
        ],
        [
            "Pacific/Kwajalein",
            "2019-02-13T08:23:57+12:00",
            "2019-02-13T09:00:00+12:00",
        ],
        [
            "Pacific/Majuro",
            "2019-02-13T08:23:57+12:00",
            "2019-02-13T09:00:00+12:00",
        ],
        [
            "Pacific/Saipan",
            "2019-02-13T06:23:57+10:00",
            "2019-02-13T07:00:00+10:00",
        ],
        [
            "Pacific/Tongatapu",
            "2019-02-13T09:23:57+13:00",
            "2019-02-13T10:00:00+13:00",
        ],
        ["UTC", "2019-02-12T20:23:57+00:00", "2019-02-12T21:00:00+00:00"],
    ])(
        "ceil to hour in timezone with low minutes",
        (
            timeZoneName: string,
            localTime: string,
            expectedCeiledLocalTime: string,
        ) => {
            // Given we are in a particular timezone;
            const time = moment.tz(gmtTimeLow, timeZoneName)
            expect(time.tz()).toBe(timeZoneName)
            expect(time.format(localTimeFormat)).toBe(localTime)

            // And we have a business time instance for a specific time in that
            // timezone;
            const businessTime = new BusinessTime(time)
            expect(businessTime.getMoment().tz()).toBe(timeZoneName)

            // When we ceil it to the nearest hour;
            const ceiled = businessTime.ceiled(moment.duration(1, "hour"))

            // Then we should get the expected ceiled local time.
            expect(ceiled.getMoment().tz()).toBe(timeZoneName)
            expect(ceiled.format(localTimeFormat)).toBe(expectedCeiledLocalTime)
        },
    )

    test.each([
        [
            "Africa/Bangui",
            "2019-02-12T21:42:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Africa/Kinshasa",
            "2019-02-12T21:42:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Africa/Windhoek",
            "2019-02-12T22:42:57+02:00",
            "2019-02-12T23:00:00+02:00",
        ],
        [
            "America/Cayenne",
            "2019-02-12T17:42:57-03:00",
            "2019-02-12T18:00:00-03:00",
        ],
        [
            "America/Guatemala",
            "2019-02-12T14:42:57-06:00",
            "2019-02-12T15:00:00-06:00",
        ],
        [
            "America/New_York",
            "2019-02-12T15:42:57-05:00",
            "2019-02-12T16:00:00-05:00",
        ],
        [
            "America/Toronto",
            "2019-02-12T15:42:57-05:00",
            "2019-02-12T16:00:00-05:00",
        ],
        [
            "Antarctica/Casey",
            "2019-02-13T04:42:57+08:00",
            "2019-02-13T05:00:00+08:00",
        ],
        [
            "Antarctica/Troll",
            "2019-02-12T20:42:57+00:00",
            "2019-02-12T21:00:00+00:00",
        ],
        [
            "Antarctica/Vostok",
            "2019-02-13T02:42:57+06:00",
            "2019-02-13T03:00:00+06:00",
        ],
        [
            "Arctic/Longyearbyen",
            "2019-02-12T21:42:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Asia/Bishkek",
            "2019-02-13T02:42:57+06:00",
            "2019-02-13T03:00:00+06:00",
        ],
        [
            "Asia/Kathmandu",
            "2019-02-13T02:27:57+05:45",
            "2019-02-13T03:00:00+05:45",
        ],
        [
            "Asia/Rangoon",
            "2019-02-13T03:12:57+06:30",
            "2019-02-13T04:00:00+06:30",
        ],
        [
            "Asia/Seoul",
            "2019-02-13T05:42:57+09:00",
            "2019-02-13T06:00:00+09:00",
        ],
        [
            "Asia/Shanghai",
            "2019-02-13T04:42:57+08:00",
            "2019-02-13T05:00:00+08:00",
        ],
        [
            "Asia/Tehran",
            "2019-02-13T00:12:57+03:30",
            "2019-02-13T01:00:00+03:30",
        ],
        [
            "Asia/Tokyo",
            "2019-02-13T05:42:57+09:00",
            "2019-02-13T06:00:00+09:00",
        ],
        [
            "Atlantic/Reykjavik",
            "2019-02-12T20:42:57+00:00",
            "2019-02-12T21:00:00+00:00",
        ],
        [
            "Australia/Adelaide",
            "2019-02-13T07:12:57+10:30",
            "2019-02-13T08:00:00+10:30",
        ],
        [
            "Australia/Sydney",
            "2019-02-13T07:42:57+11:00",
            "2019-02-13T08:00:00+11:00",
        ],
        [
            "Europe/Amsterdam",
            "2019-02-12T21:42:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Europe/London",
            "2019-02-12T20:42:57+00:00",
            "2019-02-12T21:00:00+00:00",
        ],
        [
            "Europe/Zurich",
            "2019-02-12T21:42:57+01:00",
            "2019-02-12T22:00:00+01:00",
        ],
        [
            "Indian/Antananarivo",
            "2019-02-12T23:42:57+03:00",
            "2019-02-13T00:00:00+03:00",
        ],
        [
            "Indian/Reunion",
            "2019-02-13T00:42:57+04:00",
            "2019-02-13T01:00:00+04:00",
        ],
        [
            "Pacific/Auckland",
            "2019-02-13T09:42:57+13:00",
            "2019-02-13T10:00:00+13:00",
        ],
        [
            "Pacific/Kwajalein",
            "2019-02-13T08:42:57+12:00",
            "2019-02-13T09:00:00+12:00",
        ],
        [
            "Pacific/Majuro",
            "2019-02-13T08:42:57+12:00",
            "2019-02-13T09:00:00+12:00",
        ],
        [
            "Pacific/Saipan",
            "2019-02-13T06:42:57+10:00",
            "2019-02-13T07:00:00+10:00",
        ],
        [
            "Pacific/Tongatapu",
            "2019-02-13T09:42:57+13:00",
            "2019-02-13T10:00:00+13:00",
        ],
        ["UTC", "2019-02-12T20:42:57+00:00", "2019-02-12T21:00:00+00:00"],
    ])(
        "ceil to hour in timezone with high minutes",
        (
            timeZoneName: string,
            localTime: string,
            expectedCeiledLocalTime: string,
        ) => {
            // Given we are in a particular timezone;
            const time = moment.tz(gmtTimeHigh, timeZoneName)
            expect(time.tz()).toBe(timeZoneName)
            expect(time.format(localTimeFormat)).toBe(localTime)

            // And we have a business time instance for a specific time in that
            // timezone;
            const businessTime = new BusinessTime(time)
            expect(businessTime.getMoment().tz()).toBe(timeZoneName)

            // When we ceil it to the nearest hour;
            const ceiled = businessTime.ceiled(moment.duration(1, "hour"))

            // Then we should get the expected ceiled local time.
            expect(ceiled.getMoment().tz()).toBe(timeZoneName)
            expect(ceiled.format(localTimeFormat)).toBe(expectedCeiledLocalTime)
        },
    )
})
