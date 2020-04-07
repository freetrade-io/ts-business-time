import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { CombinatorialConstraint } from "./composite/CombinatorialConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export class AnyTime extends CombinatorialConstraint
    implements IBusinessTimeConstraint, IBusinessTimeNarrator {
    isBusinessTime(time: moment.Moment): boolean {
        return true
    }

    min(): null | moment.Moment {
        return null
    }

    max(): null | moment.Moment {
        return null
    }

    narrate(time: moment.Moment): string {
        return new DefaultNarration().narrate(time)
    }
}
