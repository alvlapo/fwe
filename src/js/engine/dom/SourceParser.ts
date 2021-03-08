import TagVisitor from "./parser/TagVisitor";

export interface SourceParser {

    parse(v: TagVisitor): void

}