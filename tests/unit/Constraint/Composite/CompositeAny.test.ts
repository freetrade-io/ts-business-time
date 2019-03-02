import { IBusinessTimeConstraint } from "../../../../src/constraint/BusinessTimeConstraint"
import { AnyConstraint } from "../../../../src/constraint/composite/AnyConstraint"
import {
    allMatchingWednesdayOnePm,
    noneMatchingWednesdayOnePm,
    someMatchingWednesdayOnePm,
    wednesdayOnePm,
} from "./CompositeConstraintProviders"

describe("the AnyConstraint composite constraint", () => {
    test.each(allMatchingWednesdayOnePm())(
        "all match",
        (constraints: IBusinessTimeConstraint[]) => {
            // Given we have a set of constraints;

            // And they all match a time as business time;
            const time = wednesdayOnePm()
            for (const constraint of constraints) {
                expect(constraint.isBusinessTime(time.getMoment())).toBeTruthy()
            }

            // When we make a composite Any constraint with them;
            const anyConstraint = new AnyConstraint(...constraints)

            // Then it should also match that time as business time.
            expect(anyConstraint.isBusinessTime(time.getMoment())).toBeTruthy()
        },
    )

    test.each(noneMatchingWednesdayOnePm())(
        "none match",
        (constraints: IBusinessTimeConstraint[]) => {
            // Given we have a set of constraints;

            // And none of them match a time as business time;
            const time = wednesdayOnePm()
            for (const constraint of constraints) {
                expect(constraint.isBusinessTime(time.getMoment())).toBeFalsy()
            }

            // When we make a composite Any constraint with them;
            const anyConstraint = new AnyConstraint(...constraints)

            // Then it should also not match that time as business time.
            expect(anyConstraint.isBusinessTime(time.getMoment())).toBeFalsy()
        },
    )

    test.each(someMatchingWednesdayOnePm())(
        "some match",
        (constraints: IBusinessTimeConstraint[]) => {
            // Given we have a set of constraints;

            // And some of them match a time as business time but some don't;
            const time = wednesdayOnePm()
            const someMatch: boolean = constraints.some((constraint) =>
                constraint.isBusinessTime(time.getMoment()),
            )
            const someDoNotMatch: boolean = constraints.some(
                (constraint) => !constraint.isBusinessTime(time.getMoment()),
            )
            expect(someMatch).toBeTruthy()
            expect(someDoNotMatch).toBeTruthy()

            // When we make a composite Any constraint with them;
            const anyConstraint = new AnyConstraint(...constraints)

            // Then it should match that time as business time.
            expect(anyConstraint.isBusinessTime(time.getMoment())).toBeTruthy()
        },
    )
})
