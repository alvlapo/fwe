import { DomBuilder } from '../../src/js/engine/dom/DomBuilder';
import TagVisitor from '../../src/js/engine/dom/parser/TagVisitor';
import { Node } from '../../src/js/engine/dom/Node';
import { NodeType } from '../../src/js/engine/dom/NodeType';
import { TagType } from '../../src/js/engine/dom/parser/TagType';

describe('DOM builder', () => {

    it('should build DOM with one TEXT element', () => {

    const parser = {
        parse: (v: TagVisitor) => {
            v.onText('TEST')
        }
    }

    const builder = new DomBuilder(parser)
    const rootNode = builder.build();

    expect(rootNode).toStrictEqual({ 
        type: NodeType.DOCUMENT,
        childs: [
            { type: NodeType.TEXT, value: 'TEST'} as Node
        ] } as Node)
    })

    it('should build DOM with siblings elements', () => {

        const parser = {
            parse: (v: TagVisitor) => {
                v.onTag({ name: 'tag1', type: TagType.SELF, attr: [] })
                v.onTag({ name: 'tag2', type: TagType.SELF, attr: [] })
                v.onTag({ name: 'tag3', type: TagType.SELF, attr: [] })
            }
        }
    
        const builder = new DomBuilder(parser)
        const rootNode = builder.build();
    
        expect(rootNode).toStrictEqual({ 
            type: NodeType.DOCUMENT,
            childs: [
                { type: NodeType.ELEMENT, name: 'tag1', attrs: [], childs: [] } as Node,
                { type: NodeType.ELEMENT, name: 'tag2', attrs: [], childs: [] } as Node,
                { type: NodeType.ELEMENT, name: 'tag3', attrs: [], childs: [] } as Node,
            ] } as Node)
    })


    it('should build DOM with childs elements', () => {

        const parser = {
            parse: (v: TagVisitor) => {
                v.onTag({ name: 'tag1', type: TagType.OPEN, attr: [] })
                v.onTag({ name: 'tag2', type: TagType.SELF, attr: [] })
                v.onTag({ name: 'tag1', type: TagType.CLOSE, attr: [] })
            }
        }
    
        const builder = new DomBuilder(parser)
        const rootNode = builder.build();
    
        expect(rootNode).toStrictEqual({ 
            type: NodeType.DOCUMENT,
            childs: [
                { 
                    type: NodeType.ELEMENT, 
                    name: 'tag1', 
                    attrs: [],
                    childs: [{ type: NodeType.ELEMENT, name: 'tag2', attrs: [], childs: [] } as Node ]
                } as Node,
            ] } as Node)
    })
})
