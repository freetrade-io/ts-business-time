import {
    IBusinessTimeConstraint,
    IBusinessDayConstraint,
} from "./BusinessTimeConstraint"
import { FormatConstraint } from "./FormatConstraint"

/**
 * Business time constraint that matches based on specific dates.
 *
 * e.g.
 * new Dates('2018-05-23') matches 23rd May 2018 only.
 *
 * The format is YYYY-MM-DD
 */
export class Dates extends FormatConstraint
    implements IBusinessTimeConstraint, IBusinessDayConstraint {
    constructor(...dates: string[]) {
        super("YYYY-MM-DD", dates)
    }

    isBusinessDay(): boolean {
        return true
    }
}
