import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export class AnyTime implements IBusinessTimeConstraint, IBusinessTimeNarrator {
    isBusinessTime(time: moment.Moment): boolean {
        return true
    }

    narrate(time: moment.Moment): string {
        return new DefaultNarration().narrate(time)
    }
}
