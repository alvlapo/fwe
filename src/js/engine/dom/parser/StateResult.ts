import { StateContext } from "./StateContext";
import TagVisitor from "./TagVisitor";

export default interface StateResult {

    state?: (ctx: StateContext) => StateResult;
    emitter?: (ctx: StateContext, v: TagVisitor) => void;
    parsing: boolean;

}