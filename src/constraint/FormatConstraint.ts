import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { CombinatorialConstraint } from "./composite/CombinatorialConstraint"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

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
    implements IBusinessTimeConstraint, IBusinessTimeNarrator {
    constructor(
        private readonly format: string,
        private readonly matches: string[],
    ) {
        super()
    }

    isBusinessTime(time: moment.Moment): boolean {
        return this.matches.includes(time.format(this.format))
    }

    /**
     * Get a business-relevant description for the given time.
     */
    narrate(time: moment.Moment): string {
        return time.format(this.format)
    }
}
