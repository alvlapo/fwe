import { Predicate, Predicates, TokenContext } from "./Common"

export class Stage {

    public check?: Predicate
    public context: TokenContext

    constructor(private rules?: Predicates) {
        if (!Array.isArray(rules)) {
            this.check = rules
        }

        this.context = { value: undefined }
    }

    test(value: string): boolean {

        if (this.check) {
            if (this.check(value)) {
                this.collect(value)
                return true
            }

            return this.isEmptyContext()
        }

        this.check = this.resolveCheck(value)

        if (this.check) {
            this.collect(value)
            return true
        }

        return this.isEmptyContext()
    }

    isEmptyContext(): boolean {
        return this.context.value == undefined
    }

    private resolveCheck(s: string): Predicate | undefined {
        if (Array.isArray(this.rules)) {
            return this.rules.find(r => r(s, this.context))
        }
    }

    private collect(value: string) {
        if (this.context?.value == undefined) {
            this.context!.value = value
        } else {
            this.context!.value += value
        }
    }

}
