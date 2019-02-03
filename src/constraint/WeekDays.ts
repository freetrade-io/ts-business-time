import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { FormatConstraint } from "./FormatConstraint"

export class WeekDays extends FormatConstraint
    implements IBusinessTimeConstraint {
    constructor() {
        super("dddd", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    }
}
