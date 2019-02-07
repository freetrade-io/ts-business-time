import * as moment from "moment"
import {IBusinessTimeConstraint} from "../BusinessTimeConstraint"
import {AllConstraints} from "./AllConstraints"
import {AnyConstraint} from "./AnyConstraint"
import {ICombinatorialConstraint} from "./ICombinatorialConstraint"
import {NotConstraint} from "./NotConstraint"

export abstract class CombinatorialConstraint implements ICombinatorialConstraint {
    abstract isBusinessTime(time: moment.Moment): boolean

    andAlso(...additional: IBusinessTimeConstraint[]): ICombinatorialConstraint {
        return new AllConstraints(this, ...additional)
    }

    orAlternatively(...alternatives: IBusinessTimeConstraint[]): ICombinatorialConstraint {
        return new AnyConstraint(this, ...alternatives)
    }

    exceptFor(...exceptions: IBusinessTimeConstraint[]): ICombinatorialConstraint {
        return new AllConstraints(this, new NotConstraint(...exceptions))
    }
}
