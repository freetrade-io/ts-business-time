import moment = require("moment-timezone")
import {
    IBusinessTimeConstraint,
    IBusinessDayConstraint,
} from "./BusinessTimeConstraint"
import { CombinatorialConstraint } from "./composite/CombinatorialConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export class AnyTime extends CombinatorialConstraint
    implements
        IBusinessTimeConstraint,
        IBusinessTimeNarrator,
        IBusinessDayConstraint {
    isBusinessTime(time: moment.Moment): boolean {
        return true
    }

    isBusinessDay(): boolean {
        return true
    }

    narrate(time: moment.Moment): string {
        return new DefaultNarration().narrate(time)
    }
}
