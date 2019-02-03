import * as moment from "moment"

export interface IBusinessTimeConstraint {
    isBusinessTime(time: moment.Moment): boolean
}
