import moment = require("moment-timezone")
import { IBusinessTimeConstraint } from "../../../../src/constraint/BusinessTimeConstraint"
import { FormatConstraint } from "../../../../src/constraint/FormatConstraint"
import { DefaultNarration } from "../../../../src/constraint/narration/DefaultNarration"
import { TEST_FORMAT } from "../../../index"

class StubFormatConstraint extends FormatConstraint {
    min() {
        return null
    }

    max() {
        return null
    }
}

describe("the default narration decorator", () => {
    /**
     * When the decorated constraint implements the narrator interface, then
     * that should be used.
     */
    test("uses narrator implementation", () => {
        // Given we have a constraint with narration;
        const constraint = new StubFormatConstraint("dddd", [])

        // And we decorate it with a default narrator;
        const decorated = new DefaultNarration(constraint)

        // When we ask it to narrate a business time;
        const narration = decorated.narrate(
            moment.utc("Wednesday 2018-05-23 10:00", TEST_FORMAT),
        )

        // Then the constraint's narration should be used.
        expect(narration).toBe("Wednesday")
    })

    /**
     * When the decorated constraint does not implement the narrator interface,
     * then the decorator should use a default.
     */
    test.each([
        // Time          Narration
        ["Wednesday 2018-05-23 10:00", "Wednesday 23rd May 2018 10:00"],
        ["Wednesday 2018-05-23 13:00", "Wednesday 23rd May 2018 13:00"],
    ])("offers default", (givenTime: string, expectedNarration: string) => {
        // Given we have a constraint without narration;
        // tslint:disable-next-line
        class NonNarratorConstraint implements IBusinessTimeConstraint {
            isBusinessTime(time: moment.Moment): boolean {
                return false
            }
            min = () => null
            max = () => null
        }
        const constraint = new NonNarratorConstraint()

        // And we decorate it with a default narrator;
        const decorated = new DefaultNarration(constraint)

        // When we ask it to narrate a business time;
        const narration = decorated.narrate(moment.utc(givenTime, TEST_FORMAT))

        // Then default narration should be used.
        expect(narration).toEqual(expectedNarration)
    })
})
