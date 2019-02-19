import { AnyTime } from "../../../../src/constraint/AnyTime"
import { IBusinessTimeConstraint } from "../../../../src/constraint/BusinessTimeConstraint"
import {
    allMatchingWednesdayOnePm,
    noneMatchingWednesdayOnePm,
    someMatchingWednesdayOnePm,
    wednesdayOnePm,
} from "./CompositeConstraintProviders"

describe("the andAlso combinatorial method", () => {
    test.each(allMatchingWednesdayOnePm())(
        "andAlso all match",
        (additionalConstraints: IBusinessTimeConstraint[]) => {
            // Given we have a constraint which matches a business time;
            const time = wednesdayOnePm()
            const constraint = new AnyTime()
            expect(constraint.isBusinessTime(time.getMoment())).toBeTruthy()

            // When we use andAlso() to combine it with other constraints that all
            // match;
            const composite = constraint.andAlso(...additionalConstraints)

            // Then the composite constraint should also match the time.
            expect(composite.isBusinessTime(time.getMoment())).toBeTruthy()
        },
    )

    test.each(noneMatchingWednesdayOnePm())(
        "andAlso none match",
        (additionalConstraints: IBusinessTimeConstraint[]) => {
            // Given we have a constraint which matches a business time;
            const time = wednesdayOnePm()
            const constraint = new AnyTime()
            expect(constraint.isBusinessTime(time.getMoment())).toBeTruthy()

            // When we use andAlso() to combine it with other constraints none of
            // which match.
            const composite = constraint.andAlso(...additionalConstraints)

            // Then the composite constraint should not match the time.
            expect(composite.isBusinessTime(time.getMoment())).toBeFalsy()
        },
    )

    test.each(someMatchingWednesdayOnePm())(
        "andAlso some match",
        (additionalConstraints: IBusinessTimeConstraint[]) => {
            // Given we have a constraint which matches a business time;
            const time = wednesdayOnePm()
            const constraint = new AnyTime()
            expect(constraint.isBusinessTime(time.getMoment())).toBeTruthy()

            // When we use andAlso() to combine it with other constraints only
            // some of which match.
            const composite = constraint.andAlso(...additionalConstraints)

            // Then the composite constraint should not match the time.
            expect(composite.isBusinessTime(time.getMoment())).toBeFalsy()
        },
    )
})
