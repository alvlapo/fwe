import { ALPHA } from "./Common";
import { Predicate } from "./Tokenizer";

export type Epsilon = [] | null
export type Terminal = Predicate;
export type NonTerminal<P> = P[];
export type Alternatives<P> = ProductionBody<P>[]
export type ProductionBody<P> = Terminal | NonTerminal<P> | Epsilon
export type Production<P> = [ P, (ProductionBody<P> | Alternatives<P>) ]

// Free-Context grammar
export type Grammar<T> = {
    productions?: Production<T>[]
}

export class GrammarError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = GrammarError.name
    }
}

// Free-Context grammar validator
export class GrammarValidator<T> {

    checkRecursion(body: ProductionBody<T>): boolean {
        return true;
    }

    checkFactorization(body: ProductionBody<T>): boolean {
        return true;
    }

    validate(grammar: Grammar<T>): boolean {
        return true;
    }

}

export class ParsingTableGenerator<T> {

    generate(grammar: Grammar<T>): ParsingTable<T> {
        return new ParsingTable()
    }

}

export class ParsingTable<T> {

}