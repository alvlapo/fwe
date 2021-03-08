import { StateContext } from "./StateContext";
import TagVisitor from "./TagVisitor";

export function emitText(ctx:StateContext, visitor: TagVisitor) {
    let sanitizedText: string = ctx.text.replace(/\s+/gm, ' ').trim()

    if (sanitizedText && sanitizedText.length != 0)
        visitor.onText(sanitizedText);

    ctx.text = '';
}

export function emitTag(ctx:StateContext, visitor: TagVisitor) {
    visitor.onTag({ ...ctx.tag });
}

export function emitError(ctx:StateContext, visitor: TagVisitor) {
    
}