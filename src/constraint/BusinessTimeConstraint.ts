import moment = require("moment-timezone")

export interface IBusinessTimeConstraint {
    isBusinessTime(time: moment.Moment): boolean
}

export interface IBusinessDayConstraint {
    isBusinessDay(): boolean
}

export function isIBusinessDayStatic(object: unknown): object is IBusinessDayConstraint {
    const businessDayConstraint = (object as IBusinessDayConstraint)
    return businessDayConstraint.isBusinessDay !== undefined && businessDayConstraint.isBusinessDay()
}