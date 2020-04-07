import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { CombinatorialConstraint } from "./composite/CombinatorialConstraint"
import { DefaultNarration } from "./narration/DefaultNarration"
import { IBusinessTimeNarrator } from "./narration/IBusinessTimeNarrator"

export abstract class RangeConstraint extends CombinatorialConstraint
    implements IBusinessTimeConstraint, IBusinessTimeNarrator {
    protected constructor(
        private readonly pMin: number,
        private readonly pMax: number,
    ) {
        super()

        // Keep the min and max within the valid range.
        this.pMin = Math.max(pMin, this.minMin())
        this.pMax = Math.min(pMax, this.maxMax())

        // Allow backwards order.
        if (this.pMin > this.pMax) {
            [this.pMin, this.pMax] = [this.pMax, this.pMin]
        }
    }

    min(): null | moment.Moment {
        return null
    }

    max(): null | moment.Moment {
        return null
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
            this.relevantValueOf(time) >= this.pMin &&
            this.relevantValueOf(time) <= this.pMax
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
