import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "../BusinessTimeConstraint"
import { ICombinatorialConstraint } from "./ICombinatorialConstraint"
import { NotConstraint } from "./NotConstraint"

export class AllConstraints implements ICombinatorialConstraint {
    private readonly constraints: IBusinessTimeConstraint[]

    constructor(
        private readonly anyConstraintClass: any,
        ...constraints: IBusinessTimeConstraint[]
    ) {
        this.constraints = constraints
    }

    isBusinessTime(time: moment.Moment): boolean {
        for (const constraint of this.constraints) {
            if (!constraint.isBusinessTime(time)) {
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
        return new AllConstraints(this, ...additional)
    }

    orAlternatively(
        ...alternatives: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new this.anyConstraintClass(this, ...alternatives)
    }

    exceptFor(
        ...exceptions: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint {
        return new AllConstraints(this, new NotConstraint(...exceptions))
    }
}
