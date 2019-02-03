import moment = require("moment")

// @ts-ignore
export class ExtendableMoment implements moment.Moment {}

// noinspection JSPotentiallyInvalidConstructorUsage
Object.setPrototypeOf(ExtendableMoment.prototype, moment.prototype)
Object.setPrototypeOf(ExtendableMoment, moment)
