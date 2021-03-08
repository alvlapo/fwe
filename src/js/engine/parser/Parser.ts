import { StateContext } from './StateContext';
import StateResult from './StateResult';
import { dataState } from './States';
import TagVisitor from './TagVisitor';

export class Parser {

    private context: StateContext;

    constructor(ds: DataSource) {
        this.context = new StateContext(ds);
    }

    parse(visitor: TagVisitor): void {

        let next: (ctx: StateContext) => StateResult = dataState;

        while(true) {
            
            const { state, emitter, parsing } = next(this.context);

            //console.log('state: ' + next.name + ', emitter: ' + emitter?.name + ', parsed tag: ' + JSON.stringify(this.context.tag))

            if (emitter) emitter(this.context, visitor);
            if (!parsing) break;
            
            if (state) next = state;
        }

    }

}