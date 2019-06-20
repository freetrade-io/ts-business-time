import { IBusinessTimeConstraint } from "../BusinessTimeConstraint"

export interface ICombinatorialConstraint extends IBusinessTimeConstraint {
    andAlso(...additional: IBusinessTimeConstraint[]): ICombinatorialConstraint
    orAlternatively(
        ...alternatives: IBusinessTimeConstraint[]
    ): ICombinatorialConstraint
    exceptFor(...exceptions: IBusinessTimeConstraint[]): IBusinessTimeConstraint
}
