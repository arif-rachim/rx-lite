import createObservable from "../observable";

/**
 * Observer that immediately completes
 * @returns {{next: next, subscribe: (function((Function|{next: Function, error: Function, complete: Function}), Function, Function): function(): void), pipe: (function(...[*]): *), join: (function({next: Function, error: Function, complete: Function}): function(): void), error: error, complete: complete, observers: *[], initializer: (function(): function())}}
 */
export default function empty(){
    return createObservable(function initComplete({next,complete}){
        next();
        complete();
    });
}