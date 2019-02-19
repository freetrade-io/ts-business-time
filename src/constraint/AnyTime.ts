import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { CombinatorialConstraint } from "./composite/CombinatorialConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export class AnyTime extends CombinatorialConstraint
    implements IBusinessTimeConstraint, IBusinessTimeNarrator {
    isBusinessTime(time: moment.Moment): boolean {
        return true
    }

    narrate(time: moment.Moment): string {
        return new DefaultNarration().narrate(time)
    }
}
