import { Stream } from "./Stream";

export type Token<T, V> = [ T, V ]
export type TokenStream<T> = Stream<Token<T, string>>

export type Predicate = (char: string, prev?: string) => boolean
export type Literal = (c: string) => Predicate

export type TokenPattern<T> = [ T, Predicate ]

export class LexicalError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = LexicalError.name
    }
}

export class Tokenizer<T> {
    
    private matcher: Matcher<T>

    constructor(patterns: TokenPattern<T>[]) {
        this.matcher = new Matcher<T>(patterns)
    }

    tokenize(stream: string): TokenStream<T> {
        const tokens: Token<T, string>[] = []
        const source = new StringSource(stream)
        
        this.matcher.reset()

        for (const char of source) {
            let result = this.matcher.match(char)

            if (result.state == MatchState.PROCESSED) {
                continue
            }

            if (result.state == MatchState.MATCHED) {
                tokens.push([ result.type!, result.value! ])
                this.matcher.reset();

                result = this.matcher.match(char)
            }

            if (result.state == MatchState.FAILED) {
                throw new LexicalError('Unexpected symbol "' + char + '" at ' + source.row + ':' + source.col);
            }
        }

        return new Stream<Token<T, string>>(tokens);
    }
}

class StringSource implements Iterator<string, undefined>, Iterable<string> {

    private index = 0
    private data: string

    public row = 1
    public col = 1

    constructor(data: string) {
        this.data = data.concat('\n')
    }

    [Symbol.iterator](): Iterator<string> {
        return this;
    }

    next() {
        let done = this.data.length == 0 || this.index == this.data.length
        let value: string | undefined = done ? undefined : this.data.charAt(this.index)

        if (!done && value == '\n') {
            this.row++
            this.col = 0
        } else {
            this.col++
        }
        
        this.index++

        return { done, value } as IteratorResult<string, undefined>
    }

}

type MatchResult<T> = {
    type?: T,
    state: MatchState,
    value?: string
}

enum MatchState {
    FAILED,
    MATCHED,
    PROCESSED,
    SKIPPED
}

class MatchPattern<T> {
    
    readonly type: T
    readonly predicate: Predicate

    state: MatchState = MatchState.PROCESSED
    stage: number = 0
    value?: string

    constructor(pattern: TokenPattern<T>) {
        this.type = pattern[0]
        this.predicate = pattern[1]
    }

    test(char: string) {
        if (this.predicate(char, this.value)) {
            this.stage++
            this.value = this.value ? this.value.concat(char) : char
        } else {
            this.state = (this.stage == 0) ? MatchState.FAILED : MatchState.MATCHED
        }
    }

    getState(): MatchState {
        return this.state
    }

    isState(state: MatchState): boolean {
        return this.state == state
    }

    reset() {
        this.stage = 0
        this.state = MatchState.PROCESSED
        this.value = undefined
    }

}

class Matcher<T> {

    private matchers: MatchPattern<T>[] = []

    constructor(patterns: TokenPattern<T>[]) {
        patterns.forEach((p) => this.matchers.push(new MatchPattern(p)))
    }

    match(char: string): MatchResult<T> {
        for (const matcher of this.matchers) {
            if (matcher.isState(MatchState.PROCESSED)) {
                matcher.test(char)
            }
        }

        if (this.isFailed()) {
            if (this.isWhitespace(char)) {
                this.reset()
                return {
                    state: MatchState.SKIPPED
                }
            }

            return {
                state: MatchState.FAILED
            }
        }

        if (this.isMatched()) {
            const pattern = this.getMathedPattern()
            const result = <const>{
                type: pattern?.type,
                state: MatchState.MATCHED,
                value: pattern?.value
            }
            this.reset()

            return result
        }

        return {
            state: MatchState.PROCESSED
        }
    }

    getStateCount(state: MatchState): number {
        return this.matchers.filter(v => v.isState(state)).length
    }

    isMatched(): boolean {
        return !this.isProcessed() && this.getStateCount(MatchState.MATCHED) > 0
    }

    isProcessed(): boolean {
        return this.getStateCount(MatchState.PROCESSED) > 0
    }

    isFailed(): boolean {
        return this.getStateCount(MatchState.FAILED) == this.matchers.length
    }

    isWhitespace(s:string): boolean {
        return s ? ['\r', '\n', '\t', ' '].includes(s) : false
    }

    getMathedPattern(): MatchPattern<T> | undefined {
        if (this.isProcessed() || this.isFailed()) {
            return undefined
        }

        return this.matchers.reduce((prev, curr) => {
            return (curr.stage > prev.stage) ? curr : prev
        })
    }

    reset() {
        this.matchers.forEach(m => m.reset())
    }

} 