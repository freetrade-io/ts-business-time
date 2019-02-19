import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { FormatConstraint } from "./FormatConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export class Weekends extends FormatConstraint
    implements IBusinessTimeConstraint, IBusinessTimeNarrator {
    constructor() {
        super("dddd", ["Saturday", "Sunday"])
    }

    /**
     * Get a business-relevant description for the given time.
     */
    narrate(time: moment.Moment): string {
        if (this.isBusinessTime(time)) {
            return "the weekend"
        }

        return DefaultNarration.BUSINESS_TIME
    }
}
