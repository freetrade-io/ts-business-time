import * as moment from "moment"
import {IBusinessTimeConstraint} from "./BusinessTimeConstraint"

export abstract class RangeConstraint implements IBusinessTimeConstraint {
    protected constructor(
        private readonly min: number,
        private readonly max: number,
    ) {
        // Keep the min and max within the valid range.
        this.min = Math.max(min, this.minMin())
        this.max = Math.min(max, this.maxMax())

        // Allow backwards order.
        if (this.min > this.max) {
            [this.min, this.max] = [this.max, this.min]
        }
    }

    /**
     * Get the minimum possible value of the range.
     */
    abstract minMin(): number

    /**
     * Get the maximum possible value of the range.
     */
    abstract maxMax(): number

    /**
     * Get an integer value from the time that is to be compared to this range.
     */
    abstract relevantValueOf(time: moment.Moment): number

    /**
     * Is the given time business time according to this constraint?
     */
    isBusinessTime(time: moment.Moment): boolean {
        return (
            this.relevantValueOf(time) >= this.min &&
            this.relevantValueOf(time) <= this.max
        )
    }
}
