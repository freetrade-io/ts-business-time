import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"

export class Never implements IBusinessTimeConstraint {
    isBusinessTime(time: moment.Moment): boolean {
        return false
    }
    min() {
        return null
    }

    max() {
        return null
    }
}
