import { DayOfMonth } from "./BetweenDaysOfMonth"
import { IBusinessTimeConstraint } from "./BusinessTimeConstraint"
import { FormatConstraint } from "./FormatConstraint"

/**
 * Business time constraint that matches specific indexed days of the month as
 * business time.
 *
 * e.g.
 * new DaysOfMonth("1st", "8th", "23rd") matches the 1st, 8th and 23rd of any month.
 */
export class DaysOfMonth extends FormatConstraint
    implements IBusinessTimeConstraint {
    constructor(...daysOfMonth: DayOfMonth[]) {
        super(
            "D",
            daysOfMonth.map(
                (dayOfMonth: DayOfMonth): string => {
                    return String(
                        Number(String(dayOfMonth).replace(/[^0-9]/g, "")),
                    )
                },
            ),
        )
    }
}
