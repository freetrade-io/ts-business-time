import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { FormatConstraint } from "./FormatConstraint"

/**
 * Business time constraint that matches specific days of the year.
 *
 * e.g.
 * new DaysOfYear('25th December') matches 25th December only.
 * new DaysOfYear('25th December', '1st April') matches 25th December and
 * April 1st.
 *
 * The format must be Do MMMM as in MomentJS's formatting.
 */
export class DaysOfYear extends FormatConstraint
    implements IBusinessTimeConstraint {
    constructor(...daysOfYear: string[]) {
        super("Do MMMM", daysOfYear)
    }
    min() {
        return null
    }

    max() {
        return null
    }
}
