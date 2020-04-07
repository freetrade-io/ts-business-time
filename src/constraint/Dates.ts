import moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { FormatConstraint } from "./FormatConstraint"

/**
 * Business time constraint that matches based on specific dates.
 *
 * e.g.
 * new Dates('2018-05-23') matches 23rd May 2018 only.
 *
 * The format is YYYY-MM-DD
 */
export class Dates extends FormatConstraint implements IBusinessTimeConstraint {
    constructor(...dates: string[]) {
        super("YYYY-MM-DD", dates)
    }
    min(): null | moment.Moment {
        return moment.min(...this.momentMatches)
    }

    max(): null | moment.Moment {
        return moment.max(...this.momentMatches)
    }
}
