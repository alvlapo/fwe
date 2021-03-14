import { SourceScanner } from "../../src/js/engine/tokenizer/Scanner"
import { ALPHA, DIGIT } from '../../src/js/engine/tokenizer/Common';

describe.only('Scanner', () => {

    it('should return an empty stream when no rule is defined', () => {
        const source = " AB CD EF "
        const scanner = new SourceScanner(source)
        
        let result = scanner.scan()

        expect(result.next()).toStrictEqual({ done: true, value: undefined })
    })

    it('should return an empty stream when no rule is matched', () => {
        const source = " AB CD EF "
        const scanner = new SourceScanner(source).thenOne(DIGIT)
        
        let result = scanner.scan()

        expect(result.next()).toStrictEqual({ done: true, value: undefined })
    })

    it('should return only one token when multiple rules are defined for a single-token source', () => {
        const source = " ABCDEF "
        const scanner = new SourceScanner(source).thenOne(ALPHA).thenOne(ALPHA).thenOne(ALPHA)
        
        let result = scanner.scan()

        expect(result.next()).toStrictEqual({ done: false, value: { name: 'ALPHA', value: 'ABCDEF'} })
        expect(result.next()).toStrictEqual({ done: true, value: undefined })
    })

    it('should return only one token when multiple rules are defined with a 1-step limit', () => {
        const source = " AB 12 EF "
        const scanner = new SourceScanner(source).thenOne(ALPHA).thenOne(DIGIT).thenOne(ALPHA)
        
        let result = scanner.scan(1)

        expect(result.next()).toStrictEqual({ done: false, value: { name: 'ALPHA', value: 'AB'} })
        expect(result.next()).toStrictEqual({ done: true, value: undefined })
    })

    it('should return all tokens when the limit is greater than the number of rules', () => {
        const source = " AB 12 EF "
        const scanner = new SourceScanner(source).thenOne(ALPHA).thenOne(DIGIT).thenOne(ALPHA)
        
        let result = scanner.scan(10)

        expect(result.next()).toStrictEqual({ done: false, value: { name: 'ALPHA', value: 'AB'} })
        expect(result.next()).toStrictEqual({ done: false, value: { name: 'DIGIT', value: '12'} })
        expect(result.next()).toStrictEqual({ done: false, value: { name: 'ALPHA', value: 'EF'} })
        expect(result.next()).toStrictEqual({ done: true, value: undefined })
    })

    it('should return all valid tokens when the rules are set with branching', () => {
        const source = " AB12EF "
        const scanner = new SourceScanner(source)
        
        scanner.thenOne([ALPHA,DIGIT]).thenOne([ALPHA,DIGIT]).thenOne([ALPHA,DIGIT])

        let result = scanner.scan()

        expect(result.next()).toStrictEqual({ done: false, value: { name: 'ALPHA', value: 'AB'} })
        expect(result.next()).toStrictEqual({ done: false, value: { name: 'DIGIT', value: '12'} })
        expect(result.next()).toStrictEqual({ done: false, value: { name: 'ALPHA', value: 'EF'} })
        expect(result.next()).toStrictEqual({ done: true, value: undefined })
    })

})