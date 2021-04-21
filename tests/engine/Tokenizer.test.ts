import { ALPHA, DIGIT, KEYWORD, SYMBOL } from '../../src/js/engine/parser/Common'
import { LexicalError, Tokenizer, TokenPattern } from '../../src/js/engine/parser/Tokenizer'

enum Test {
    A, B, C, D, E, F
}

describe('Tokenizer', () => {
    let tokenizer: Tokenizer<Test>
    let patterns: TokenPattern<Test>[]

    beforeAll(() => {
        patterns = [
            [ Test.A, ALPHA ],
            [ Test.B, DIGIT ]
        ]
        tokenizer = new Tokenizer<Test>(patterns)
    })

    it('should return empty iterator when source is empty', () => {
        const stream = tokenizer.tokenize(' ');

        expect(stream.next()).toStrictEqual({ value: undefined , done: true });
    })

    it('should return tokens when the source contains valid lexems', () => {
        const stream = tokenizer.tokenize('  AB12  ');

        expect(stream.next()).toStrictEqual({ value: [Test.A, 'AB'] , done: false });
        expect(stream.next()).toStrictEqual({ value: [Test.B, '12'] , done: false });
        expect(stream.next()).toStrictEqual({ value: undefined , done: true });
    })

    it('should', () => {
        const p: TokenPattern<Test>[] = [
            [ Test.C, KEYWORD('return') ],
            [ Test.D, SYMBOL(';') ]
        ]
        const t = new Tokenizer<Test>(p)
        const stream = t.tokenize('ReturN;');

        expect(stream.next()).toStrictEqual({ value: [Test.C, 'ReturN'] , done: false });
        expect(stream.next()).toStrictEqual({ value: [Test.D, ';'] , done: false });
        expect(stream.next()).toStrictEqual({ value: undefined , done: true });
    })

    it('should return the longest match with the pattern', () => {
        const p: TokenPattern<Test>[] = [
            [ Test.F, KEYWORD('else') ],
            [ Test.E, KEYWORD('elseif') ]
        ]
        const t = new Tokenizer<Test>(p)
        const stream = t.tokenize('elseif');

        expect(stream.next()).toStrictEqual({ value: [Test.E, 'elseif'] , done: false });
        expect(stream.next()).toStrictEqual({ value: undefined , done: true });
    })

    it('should throw error when finding an unexpected character', () => {
        expect(() => tokenizer.tokenize('  A*B  ')).toThrow(LexicalError)
        expect(() => tokenizer.tokenize('AA\nA*B  ')).toThrow('Unexpected symbol "*" at 2:2')
    })

    describe('pattren matcher', () => {

        it('KEYWORD should match the keyword lexem', () => {
            const p = KEYWORD('end')

            expect(p('w')).toBe(false)

            expect(p('e')).toBe(true)
            expect(p('N', 'e')).toBe(true)
            expect(p('d', 'eN')).toBe(true)
            expect(p(';', 'eNd')).toBe(false)
        })

        it('SYMBOL should match only one character at a time', () => {
            const p = SYMBOL('@')

            expect(p('w')).toBe(false)

            expect(p('@')).toBe(true)
            expect(p('i', '@')).toBe(false)
        })

    })

})