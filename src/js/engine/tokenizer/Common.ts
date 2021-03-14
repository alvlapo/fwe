export type TokenContext = {
    value?: string
}

export type Predicate = (s: string, ctx?: TokenContext) => boolean
export type Predicates = Predicate | Predicate[]
export type PredicateBuilder = (c: string) => Predicate
export type PredicateCombinator = (p1: Predicate, p2: Predicate) => Predicate

export const SIGN: PredicateBuilder = (c) => {
    return (s) => s == c
}

export const AND: PredicateCombinator = (p1, p2) => {
    return (s, ctx) => p1(s, ctx) && p2(s, ctx)
}

export const OR: PredicateCombinator = (p1, p2) => {
    return (s, ctx) => p1(s, ctx) || p2(s, ctx)
}

export const ALPHA: Predicate = (s) => {
    return s ? (s >= 'A' && s <= 'Z') || (s >= 'a' && s <= 'z') || s == '_' : false
}

export const DIGIT: Predicate = (s) => {
    return s ? s >= '0' && s <= '9' : false
}

export const ALPHANUMERIC = OR(DIGIT, ALPHA)

export const WHITESPACE: Predicate = (s) => {
    return s ? ['\r', '\n', '\t', ' '].includes(s) : false
}

export const AT_SIGN = SIGN('@')