import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "../BusinessTimeConstraint"
import { AllConstraints } from "./AllConstraints"
import { AnyConstraint } from "./AnyConstraint"
import { ICombinatorialConstraint } from "./ICombinatorialConstraint"
import { NotConstraint } from "./NotConstraint"

export abstract class CombinatorialConstraint
    implements ICombinatorialConstraint {
    abstract isBusinessTime(time: moment.Moment): boolean

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
