import * as moment from "moment"

export interface IBusinessTimeNarrator {
    /**
     * Get a business-relevant description for the given time.
     */
    narrate(time: moment.Moment): string
}
