import moment = require("moment-timezone")

export interface IBusinessTimeConstraint {
    isBusinessTime(time: moment.Moment): boolean
}

export interface IBusinessDayConstraint {
    isBusinessDay(): boolean
}

export function isBusinessDayConstraint(
    object: unknown,
): object is IBusinessDayConstraint {
    const businessDayConstraint = object as IBusinessDayConstraint
    return (
        typeof businessDayConstraint.isBusinessDay === "function" &&
        businessDayConstraint.isBusinessDay()
    )
}
