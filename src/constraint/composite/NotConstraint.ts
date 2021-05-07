import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "../BusinessTimeConstraint"
import { AllConstraints } from "./AllConstraints"
import { AnyConstraint } from "./AnyConstraint"
import { ICombinatorialConstraint } from "./ICombinatorialConstraint"

export class NotConstraint implements ICombinatorialConstraint {
    private readonly constraints: IBusinessTimeConstraint[]

    constructor(...constraints: IBusinessTimeConstraint[]) {
        this.constraints = constraints
    }

    isBusinessTime(time: moment.Moment): boolean {
        for (const constraint of this.constraints) {
            if (constraint.isBusinessTime(time)) {
                return false
            }
        }
        return true
    }

    /**
     * The methods from ICombinatorialConstraint have to be re-implemented here
     * instead of inheriting from a base-class as TypeScript does not allow
     * circular imports.
     */

    andAlso(
        ...additional: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new AllConstraints(AnyConstraint, this, ...additional)
    }

    orAlternatively(
        ...alternatives: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new AnyConstraint(AllConstraints, this, ...alternatives)
    }

    exceptFor(
        ...exceptions: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new AllConstraints(
            AnyConstraint,
            this,
            new NotConstraint(...exceptions),
        )
    }
}
