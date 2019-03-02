import { AnyTime } from "../../../../src/constraint/AnyTime"
import { IBusinessTimeConstraint } from "../../../../src/constraint/BusinessTimeConstraint"
import {
    allMatchingWednesdayOnePm,
    noneMatchingWednesdayOnePm,
    someMatchingWednesdayOnePm,
    wednesdayOnePm,
} from "./CompositeConstraintProviders"

describe("the orAlternatively combinatorial method", () => {
    test.each(allMatchingWednesdayOnePm())(
        "orAlternatively all match",
        (additionalConstraints: IBusinessTimeConstraint[]) => {
            // Given we have a constraint which matches a business time;
            const time = wednesdayOnePm()
            const constraint = new AnyTime()
            expect(constraint.isBusinessTime(time.getMoment())).toBeTruthy()

            // When we use orAlternatively() to combine it with other
            // constraints that all match;
            const composite = constraint.orAlternatively(
                ...additionalConstraints,
            )

            // Then the composite constraint should match the time.
            expect(composite.isBusinessTime(time.getMoment())).toBeTruthy()
        },
    )

    test.each(noneMatchingWednesdayOnePm())(
        "orAlternatively none match",
        (additionalConstraints: IBusinessTimeConstraint[]) => {
            // Given we have a constraint which matches a business time;
            const time = wednesdayOnePm()
            const constraint = new AnyTime()
            expect(constraint.isBusinessTime(time.getMoment())).toBeTruthy()

            // When we use orAlternatively() to combine it with other
            // constraints none of which match.
            const composite = constraint.orAlternatively(
                ...additionalConstraints,
            )

            // Then the composite constraint should match the time.
            expect(composite.isBusinessTime(time.getMoment())).toBeTruthy()
        },
    )

    test.each(someMatchingWednesdayOnePm())(
        "orAlternatively some match",
        (additionalConstraints: IBusinessTimeConstraint[]) => {
            // Given we have a constraint which matches a business time;
            const time = wednesdayOnePm()
            const constraint = new AnyTime()
            expect(constraint.isBusinessTime(time.getMoment())).toBeTruthy()

            // When we use orAlternatively() to combine it with other
            // constraints only some of which match.
            const composite = constraint.orAlternatively(
                ...additionalConstraints,
            )

            // Then the composite constraint should match the time.
            expect(composite.isBusinessTime(time.getMoment())).toBeTruthy()
        },
    )
})
