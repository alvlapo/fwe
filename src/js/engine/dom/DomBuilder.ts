import { Node } from "./Node";
import { NodeType } from "./NodeType";
import TagVisitor from './parser/TagVisitor';
import { Tag } from "./parser/Tag";
import { TagType } from "./parser/TagType";
import { SourceParser } from "./SourceParser";

export class DomBuilder implements TagVisitor {
    
    private root: Node
    private deep: Node[]
    private parser: SourceParser

    constructor(parser: SourceParser) {
        this.parser = parser
        this.deep = []

        this.root = {
            type: NodeType.DOCUMENT,
            childs: []
        }

        this.push(this.root)
    }

    build(): Node {
        this.parser.parse(this);

        return this.root;
    }

    onTag(tag: Tag): void {
        switch (tag.type) {
            case TagType.SELF:
                this.peek().childs?.push(this.createElementNode(tag))
                break;

            case TagType.OPEN:
                const elem = this.createElementNode(tag);
                this.peek().childs?.push(elem)
                this.push(elem)
                break;

            case TagType.CLOSE:
                this.pop()
                break;
        
            default:
                break;
        }
    }

    onText(text: string): void {
        this.peek().childs?.push(this.createTextNode(text));
    }

    private pop(): Node | undefined {
        return this.deep.pop()
    }

    private push(node: Node) {
        this.deep.push(node);
    }

    private peek() {
        return this.deep[this.deep.length - 1]
    }

    private createTextNode(text: string): Node {
        return {
            type: NodeType.TEXT,
            value: text
        }
    }

    private createElementNode(tag: Tag): Node {
        return {
            type: NodeType.ELEMENT,
            name: tag.name,
            attrs: tag.attr,
            childs: []
        }
    }

}