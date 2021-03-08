import { isAlpha, isWhiteSpace } from "./CharUtils";
import { emitError, emitText, emitTag } from "./Emitters";
import { StateContext } from "./StateContext";
import StateResult from "./StateResult";
import { TagType } from "./TagType";

export function dataState(ctx: StateContext): StateResult {
    ctx.tag.reset()
    while (true) {
        let c = ctx.data.next();

        if (!c) {
            return { 
                state: undefined, 
                emitter: emitText, 
                parsing: false 
            }
        }

        if (c == '<') {
            ctx.tag.type = TagType.OPEN
            return { 
                state: tagOpen, 
                emitter: emitText, 
                parsing: true 
            }
        }

        ctx.text += c;
    }
}

export function tagOpen(ctx:StateContext): StateResult {
    const c = ctx.data.next();

    if (!c) {
        ctx.text += '<';
        return { 
            state: dataState, 
            emitter: emitError, 
            parsing: false 
        }
    }

    if (c == '/') {
        ctx.tag.type = TagType.CLOSE
        return { 
            state: tagClose, 
            emitter: undefined, 
            parsing: true 
        }
    }

    if (isAlpha(c)) {
        return { 
            state: tagName, 
            emitter: undefined, 
            parsing: true 
        }
    }

    ctx.text += c;

    return { 
        state: dataState, 
        emitter: emitError, 
        parsing: true 
    }
}

export function tagName(ctx:StateContext): StateResult {
    
    let name: string = '';
    let c = ctx.data.curr();

    while (true) {

        if (!c) {
            return {
                state: dataState,
                emitter: emitError,
                parsing: true
            }
        }

        if (isWhiteSpace(c)) {
            ctx.tag.name = name
            return {
                state: beforeAttrName,
                emitter: undefined,
                parsing: true
            }
        }

        if (c == '/') {
            ctx.tag.name = name
            return {
                state: tagSelf,
                emitter: undefined,
                parsing: true
            }
        }

        if (c == '>') {
            ctx.tag.name = name
            return {
                state: dataState,
                emitter: emitTag,
                parsing: true
            }
        }

        name += c
        c = ctx.data.next()
    }
}

export function tagSelf(ctx:StateContext): StateResult {
    let c = ctx.data.next();

    if (!c) {
        ctx.text += '/';
        return { 
            state: dataState, 
            emitter: emitError, 
            parsing: false 
        }
    }

    if (c == '>') {
        ctx.tag.type = TagType.SELF
        ctx.tag.attr.push(ctx.attr)
        return { 
            state: dataState, 
            emitter: emitTag, 
            parsing: true 
        }
    }

    return {
        state: dataState, 
        emitter: emitError, 
        parsing: true 
    }
}

export function tagClose(ctx:StateContext): StateResult {
    let c = ctx.data.next();

    if (!c) {
        ctx.text += '/';
        return { 
            state: dataState, 
            emitter: emitError, 
            parsing: false 
        }
    }

    if (isAlpha(c)) {
        ctx.tag.type = TagType.CLOSE
        return {
            state: tagName,
            parsing: true
        }
    }

    if (c == '>') {
        ctx.tag.type = TagType.CLOSE
        return { 
            state: dataState, 
            emitter: emitTag, 
            parsing: true 
        }
    }

    return {
        state: dataState, 
        emitter: emitError, 
        parsing: true 
    }
}

export function beforeAttrName(ctx: StateContext): StateResult {
    while (true) {
        const c = ctx.data.next()

        if (!c) {
            return { 
                state: dataState, 
                emitter: emitError, 
                parsing: false 
            }
        }

        if (isWhiteSpace(c)) {
            continue
        }

        if (c == '/') {
            return {
                state: tagSelf,
                parsing: true
            }
        }

        if (c == '>') {
            return {
                state: dataState,
                emitter: emitTag,
                parsing: true
            }
        }

        return {
            state: attrName,
            parsing: true
        }
    }
}

export function attrName(ctx: StateContext): StateResult {
    let name = ''
    let c = ctx.data.curr()

    while (true) {
        if (!c) {
            return { 
                state: dataState, 
                emitter: emitError, 
                parsing: false 
            }
        }

        if (isWhiteSpace(c)) {
            ctx.attr[0] = name
            return {
                state: afterAttrName,
                parsing: true
            }
        }

        if (c == '/') {
            ctx.attr[0] = name
            ctx.attr[1] = ''
            return {
                state: tagSelf,
                parsing: true
            }
        }

        if (c == '=') {
            ctx.attr[0] = name
            return {
                state: beforeAttrValue,
                parsing: true
            }
        }

        if (c == '>') {
            ctx.attr[0] = name
            ctx.attr[1] = ''
            ctx.tag.attr.push(ctx.attr)
            return {
                state: dataState,
                emitter: emitTag,
                parsing: true
            }
        }

        name += c
        c = ctx.data.next()
    }
}

export function afterAttrName(ctx: StateContext): StateResult {
    while (true) {
        const c = ctx.data.next()

        if (!c) {
            return { 
                state: dataState, 
                emitter: emitError, 
                parsing: false 
            }
        }

        if (isWhiteSpace(c)) {
            continue
        }

        if (c == '/') {
            ctx.attr[1] = ''
            return {
                state: tagSelf,
                parsing: true
            }
        }

        if (c == '=') {
            return {
                state: beforeAttrValue,
                parsing: true
            }
        }

        if (c == '>') {
            ctx.attr[1] = ''
            ctx.tag.attr.push(ctx.attr)
            return {
                state: dataState,
                emitter: emitTag,
                parsing: true
            }
        }

        ctx.attr = ['','']
        return {
            state: attrName,
            parsing: true
        }
    }
}

export function beforeAttrValue(ctx: StateContext): StateResult {
    while (true) {
        const c = ctx.data.next()

        if (!c) {
            return { 
                state: dataState, 
                emitter: emitError, 
                parsing: false 
            }
        }

        if (isWhiteSpace(c)) {
            continue
        }

        if (c == '\'') {
            return {
                state: attrValueSingleQuoted,
                parsing: true
            }
        }

        if (c == '\"') {
            return {
                state: attrValueDoubleQuoted,
                parsing: true
            }
        }

        if (c == '>') {
            return {
                state: dataState,
                emitter: emitError,
                parsing: true
            }
        }

        return {
            state: attrValueUnQuoted,
            parsing: true
        }
    }
}

export function attrValueSingleQuoted(ctx: StateContext): StateResult {
    let value: string = ''

    while (true) {
        const c = ctx.data.next()

        if (!c) {
            return { 
                state: dataState, 
                emitter: emitError, 
                parsing: false 
            }
        }

        if (c == "\'") {
            ctx.attr[1] = value
            return {
                state: afterAttrValueQuoted,
                parsing: true
            }
        }

        value += c
    }
}

export function attrValueDoubleQuoted(ctx: StateContext): StateResult {
    let value: string = ''

    while (true) {
        const c = ctx.data.next()

        if (!c) {
            return { 
                state: dataState, 
                emitter: emitError, 
                parsing: false 
            }
        }

        if (c == "\"") {
            ctx.attr[1] = value
            return {
                state: afterAttrValueQuoted,
                parsing: true
            }
        }

        value += c
    }
}

export function attrValueUnQuoted(ctx: StateContext): StateResult {
    let value: string = ''

    while (true) {
        const c = ctx.data.next()

        if (!c) {
            return { 
                state: dataState, 
                emitter: emitError, 
                parsing: false 
            }
        }

        if (isWhiteSpace(c)) {
            ctx.attr[1] = value
            return {
                state: afterAttrValueQuoted,
                parsing: true
            }
        }

        value += c
    }
}

export function afterAttrValueQuoted(ctx: StateContext): StateResult {
    const c = ctx.data.next();

    if (!c) {
        return { 
            state: dataState, 
            emitter: emitError, 
            parsing: false 
        }
    }

    if (c == '/') {
        return {
            state: tagSelf,
            parsing: true
        }
    }

    ctx.tag.attr.push(ctx.attr)

    if (c == '>') {
        ctx.tag.type = TagType.OPEN
        return {
            state: dataState, 
            emitter: emitTag, 
            parsing: true 
        }
    }

    ctx.attr = ['','']

    return {
        state: beforeAttrName,
        parsing: true
    }
}