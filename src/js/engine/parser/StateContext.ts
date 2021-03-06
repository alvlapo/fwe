import { ParsedTag } from './ParsedTag';

export class StateContext {

    data: DataSource
    text: string = ''
    tag: ParsedTag = new ParsedTag
    attr: [string, string] = ['','']

    constructor(ds: DataSource) {
        this.data = ds
    }

}