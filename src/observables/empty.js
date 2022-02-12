import createObservable from "../observable";

/**
 * Observer that immediately completes
 * @returns {{next: next, subscribe: function(*=, *=, *=): function(): void, pipe: function(...[*]): *, join: function(*=): function(): void, error: error, complete: complete, observers: [], initializer: function(): function()}}
 */
export default function empty(){
    return createObservable(function initComplete({next,complete}){
        next();
        complete();
    });
}