import * as moment from "moment"
import {IBusinessTimeNarrator} from "./IBusinessTimeNarrator"
import {IBusinessTimeConstraint} from "../BusinessTimeConstraint"

/**
 * Decorator for business time constraints that ensures they offer business
 * time narration.
 *
 * If the decorated constraint implements narration, then that is used.
 * Otherwise default narration is provided.
 */
export class DefaultNarration implements IBusinessTimeNarrator {

    static readonly BUSINESS_TIME = "business hours"
    static readonly NON_BUSINESS_TIME = "outside business hours"

    static canNarrate(obj: any): obj is IBusinessTimeNarrator {
        return typeof obj.narrate === "function"
    }

    constructor(private readonly wrapped?: IBusinessTimeConstraint) {}

    /**
     * Get a business-relevant description for the given time.
     */
    narrate(time: moment.Moment): string {
        if (this.wrapped && DefaultNarration.canNarrate(this.wrapped)) {
            return this.wrapped.narrate(time)
        }

        return time.format("dddd Do MMMM YYYY HH:mm")
    }
}
