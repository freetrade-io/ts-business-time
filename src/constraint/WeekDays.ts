import moment = require("moment-timezone")
import { IBusinessDayConstraint } from "."
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { FormatConstraint } from "./FormatConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export class WeekDays extends FormatConstraint
    implements IBusinessTimeConstraint, 
        IBusinessTimeNarrator,
        IBusinessDayConstraint {
    constructor() {
        super("dddd", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    }

    isBusinessDay(): boolean {
        return true
    }

    /**
     * Get a business-relevant description for the given time.
     */
    narrate(time: moment.Moment): string {
        if (this.isBusinessTime(time)) {
            return DefaultNarration.BUSINESS_TIME
        }

        return "the weekend"
    }
}
