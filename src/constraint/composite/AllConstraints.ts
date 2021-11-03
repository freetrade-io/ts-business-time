import moment = require("moment-timezone")
import {
    isBusinessDayConstraint,
    IBusinessDayConstraint,
    IBusinessTimeConstraint,
} from "../BusinessTimeConstraint"
import { AnyConstraint } from "./AnyConstraint"
import { ICombinatorialConstraint } from "./ICombinatorialConstraint"
import { NotConstraint } from "./NotConstraint"

export class AllConstraints
    implements ICombinatorialConstraint, IBusinessDayConstraint {
    private readonly constraints: IBusinessTimeConstraint[]

    constructor(...constraints: IBusinessTimeConstraint[]) {
        this.constraints = constraints
    }

    isBusinessTime(time: moment.Moment): boolean {
        return this.constraints.every((c) => c.isBusinessTime(time))
    }

    isBusinessDay(): boolean {
        return this.constraints.every(isBusinessDayConstraint)
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
