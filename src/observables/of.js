import createObservable from "../observable";

/**
 * Emit variable amount of values in a sequence and then emits a complete notification
 * @param params
 * @returns {{next: next, subscribe: function({next: *, error: *, complete: *}): function(): void, pipe: function(...[*]): *, join: function(*=): function(): void, error: error, complete: complete, observers: [], initializer: function(): function()}}
 */
export default function of(...params){
    return createObservable(function ofInitializer({next,complete}){
        params.forEach(param => next(param));
        complete();
    })
}