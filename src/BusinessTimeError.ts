export class BusinessTimeError extends Error {
    // tslint:disable-next-line ban-types
    constructor(fn: Function, errorMessage: string) {
        super(`${fn.name}: ${errorMessage}`)
    }
}
