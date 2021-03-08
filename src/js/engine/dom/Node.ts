import { NodeType } from "./NodeType";

export class Node {
    readonly type: NodeType;

    name?: string
    value?: string
    attrs?: [string, string][]

    childs?: Node[]

    constructor(type: NodeType) {
        this.type = type;
    }
}