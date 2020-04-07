import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "../BusinessTimeConstraint"
import { AllConstraints } from "./AllConstraints"
import { ICombinatorialConstraint } from "./ICombinatorialConstraint"
import { NotConstraint } from "./NotConstraint"

export class AnyConstraint implements ICombinatorialConstraint {
    private readonly constraints: IBusinessTimeConstraint[]

    constructor(...constraints: IBusinessTimeConstraint[]) {
        this.constraints = constraints
    }

    isBusinessTime(time: moment.Moment): boolean {
        for (const constraint of this.constraints) {
            if (constraint.isBusinessTime(time)) {
                return true
            }
        }

        return false
    }

    min(): null | moment.Moment {
        const minValues = (this.constraints
            .map((constraint) => constraint.min())
            .filter((min) => min) as any[]) as moment.Moment[]

        return minValues.length > 0 ? moment.min(...minValues) : null
    }

    max(): null | moment.Moment {
        const maxValues = (this.constraints
            .map((constraint) => constraint.max())
            .filter((min) => min) as any[]) as moment.Moment[]

        return maxValues.length > 0 ? moment.max(...maxValues) : null
    }

    /**
     * The methods from ICombinatorialConstraint have to be re-implemented here
     * instead of inheriting from a base-class as TypeScript does not allow
     * circular imports.
     */

    andAlso(
        ...additional: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new AllConstraints(this, ...additional)
    }

    orAlternatively(
        ...alternatives: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new AnyConstraint(this, ...alternatives)
    }

    exceptFor(
        ...exceptions: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new AllConstraints(this, new NotConstraint(...exceptions))
    }
}
