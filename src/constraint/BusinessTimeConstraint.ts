import moment = require("moment-timezone")

export interface IBusinessTimeConstraint {
    isBusinessTime(time: moment.Moment): boolean

    // Minimum date in the set, or null if infinite
    min(): moment.Moment | null

    // Maximum date in the set, or null if infinite
    max(): moment.Moment | null
}
