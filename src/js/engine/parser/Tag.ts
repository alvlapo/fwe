import { TagType } from "./TagType";

export interface Tag {

    name: string
    type: TagType
    attr: [string, string][]

}