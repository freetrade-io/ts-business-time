import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { CombinatorialConstraint } from "./composite/CombinatorialConstraint"

/**
 * Constraint that matches business times using a date time format and
 * corresponding matching string.
 *
 * e.g. new FormatConstraint('dddd', 'Monday') matches any time on a Monday as
 * business time.
 *
 * https://momentjs.com/docs/#/displaying/format/
 */
export class FormatConstraint extends CombinatorialConstraint
    implements IBusinessTimeConstraint {
    constructor(
        private readonly format: string,
        private readonly matches: string[],
    ) {
        super()
    }

    isBusinessTime(time: moment.Moment): boolean {
        return this.matches.includes(time.format(this.format))
    }
}
