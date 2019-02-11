import * as moment from "moment"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { CombinatorialConstraint } from "./composite/CombinatorialConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export abstract class RangeConstraint extends CombinatorialConstraint
    implements IBusinessTimeConstraint, IBusinessTimeNarrator {
    protected constructor(
        private readonly min: number,
        private readonly max: number,
    ) {
        super()

        // Keep the min and max within the valid range.
        this.min = Math.max(min, this.minMin())
        this.max = Math.min(max, this.maxMax())

        // Allow backwards order.
        if (this.min > this.max) {
            ;[this.min, this.max] = [this.max, this.min]
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

    /**
     * Get a business-relevant description for the given time.
     */
    narrate(time: moment.Moment): string {
        if (this.isBusinessTime(time)) {
            return DefaultNarration.BUSINESS_TIME
        }

        return DefaultNarration.NON_BUSINESS_TIME
    }
}
