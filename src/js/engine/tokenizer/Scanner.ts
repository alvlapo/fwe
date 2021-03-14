import { Predicates } from "./Common";
import { Stage } from "./Stage";
import { Stream } from "./Stream";

export interface Token {
    name: string
    value?: string
}

export type TokenStream = Stream<Token>

export interface Scanner {
    scan(limit?: number): TokenStream
    thenOne(rule: Predicates): this
}

export class SourceScanner implements Scanner {
    
    private rules: Predicates[]
    private stage?: Stage

    constructor(private source: Iterable<string>) {
        this.rules = []
    }

    scan(limit?: number): TokenStream {
        if (this.rules.length == 0) {
            return this.streamFrom([])
        }

        const stages: Stage[] = []
        let iterator = this.source[Symbol.iterator]()
        let char = iterator.next()

        limit = (limit && limit <= this.rules.length) ? limit : this.rules.length
        let step = 0

        while (step < limit) {
            this.stage = new Stage(this.rules.shift())

            while (true) {
                if (!this.stage?.test(char.value)) {
                    break
                }

                char = iterator.next()
                
                if (char.done) {
                    break
                }
            }

            if (char.done) {
                break
            }

            stages.push(this.stage)
            step++
        }

        return this.streamFrom(stages)
    }

    thenOne(rule: Predicates): this {
        this.rules.push(rule)
        return this
    }

    streamFrom(items: Stage[]): TokenStream {
        let tokens = items.map(stage => {
            return {
                name: stage.check?.name!,
                value: stage.context.value
            }
        })

        return new Stream<Token>(tokens)
    }
}