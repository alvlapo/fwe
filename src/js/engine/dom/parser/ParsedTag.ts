import { Tag } from "./Tag";
import { TagType } from "./TagType";

export class ParsedTag implements Tag {
    name: string = '';
    type: TagType = TagType.SELF;
    attr: [string, string][] = [];

    reset() {
        this.name = ''
        this.type = TagType.SELF
        this.attr = []
    }
    
}