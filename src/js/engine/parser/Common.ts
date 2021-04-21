import { Literal, Predicate } from "./Tokenizer"


export const KEYWORD: Literal = (k: string) => {
    const keyword = k.toLocaleLowerCase()
    return (char, prev) => {
        if (prev == undefined) {
            return keyword.charAt(0) == char.toLocaleLowerCase()
        }

        const value = prev.concat(char).toLocaleLowerCase()

        if (value.length < keyword.length) {
            return value == keyword.substring(0, value.length)
        }

        if (value.length == keyword.length) {
            return value == keyword
        }

        return false
    }
}

export const SYMBOL: Literal = (symbol: string) => {
    return (char, prev) => (char == symbol && prev == undefined) ? true : false
}

export const ALPHA: Predicate = (s) => {
    return s ? (s >= 'A' && s <= 'Z') || (s >= 'a' && s <= 'z') || s == '_' : false
}

export const DIGIT: Predicate = (s) => {
    return s ? s >= '0' && s <= '9' : false
}