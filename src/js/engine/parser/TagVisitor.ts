import { Tag } from "./Tag";

export default interface TagVisitor {

    onTag(tag: Tag): void;
    onText(text: String): void;

}