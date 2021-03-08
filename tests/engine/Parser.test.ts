import { ParsedTag } from '../../src/js/engine/dom/parser/ParsedTag';
import { Parser } from '../../src/js/engine/dom/parser/Parser';
import { StringDataSource } from '../../src/js/engine/dom/parser/StringDataSource';
import { TagType } from '../../src/js/engine/dom/parser/TagType';

function createParserFor(source: string) {
    let ds = new StringDataSource(source);
    return new Parser(ds);
}

function getMockVisitor() {
    return {
        onText: jest.fn(),
        onTag: jest.fn()
    }
}

describe('Parser', () => {

    describe('when source is valid', () => {

        describe('"onText" emitter', () => {

            describe('for empty source', () => {

                it('should not emit', () => {
                    let mockVisitor = getMockVisitor()
                    
                    createParserFor("").parse(mockVisitor)
                    createParserFor("\n\n").parse(mockVisitor)
                    createParserFor(" ").parse(mockVisitor)

                    expect(mockVisitor.onText.mock.calls.length).toBe(0)
                })

            })

            describe('for multiline source with extra spacers without tags', () => {

                const source = `
                ABC\t
                   DEF
                FED 
                \tCBA
                `
                it('should emit once with sanitazed text', () => {
                    const mockVisitor = getMockVisitor()
        
                    createParserFor(source).parse(mockVisitor)
        
                    expect(mockVisitor.onText.mock.calls.length).toBe(1)
                    expect(mockVisitor.onText.mock.calls[0][0]).toBe("ABC DEF FED CBA")
                })
            })        
        })

        describe('"onTag" emitter', () => {

            describe('for source with single self closed tag', () => {
                
                it('should emit "onTag" once', () => {
                    const mockVisitor = getMockVisitor()
        
                    createParserFor(`ABC
                        <tag id = 'tag_id'
                             name="tag_name"/>
                        DEF`).parse(mockVisitor);

                    const expected = { 
                        name: 'tag', 
                        type: TagType.SELF, 
                        attr: [
                            ['id','tag_id'],
                            ['name','tag_name']
                        ]}
        
                    expect(mockVisitor.onTag.mock.calls.length).toBe(1);
                    expect(mockVisitor.onTag.mock.calls[0][0]).toEqual(expected);
                })

                it('should emit tag with empty string as the value for empty attribute syntax', () => {
                    const mockVisitor = getMockVisitor()
        
                    createParserFor("<tag disabled/>").parse(mockVisitor)
        
                    expect(mockVisitor.onTag.mock.calls.length).toBe(1)
                    expect(mockVisitor.onTag.mock.calls[0][0]).toStrictEqual({ 
                        name: 'tag', 
                        type: TagType.SELF, 
                        attr: [ ['disabled', ''] ]
                    } as ParsedTag)
                })
            })

            describe('for source with single open/close tag', () => {
                
                it('should emit "onTag" twice', () => {
                    const mockVisitor = getMockVisitor()
        
                    createParserFor(`ABC
                        <tag id = 'tag_id'
                             name="tag_name">
                            DEF 
                            </tag>
                        G`).parse(mockVisitor);

                    const expectedOpen = { 
                        name: 'tag', 
                        type: TagType.OPEN, 
                        attr: [
                            ['id','tag_id'],
                            ['name','tag_name']
                        ]
                    }

                    const expectedClose = { 
                        name: 'tag', 
                        type: TagType.CLOSE, 
                        attr: []
                    }
        
                    expect(mockVisitor.onTag.mock.calls.length).toBe(2);
                    expect(mockVisitor.onTag.mock.calls[0][0]).toEqual(expectedOpen);
                    expect(mockVisitor.onTag.mock.calls[1][0]).toEqual(expectedClose);
                })
            })
        })
    })
})
