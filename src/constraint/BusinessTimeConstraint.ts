import moment = require("moment-timezone")

export interface IBusinessTimeConstraint {
    isBusinessTime(time: moment.Moment): boolean
}
