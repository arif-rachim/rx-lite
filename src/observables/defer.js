import createObservable from "../observable";

/**
 * Create an observable with given subscription function.
 *💡 defer is used as part of the iif operator!
 * @param initializeCallback
 * @returns {{next: next, subscribe: function(*=, *=, *=): function(): void, pipe: function(...[*]): *, join: function(*=): function(): void, error: error, complete: complete, observers: [], initializer: function(): function()}}
 */
export default function defer(initializeCallback){
    return createObservable(function initDefer({next,complete,error}){
        const observer$ = initializeCallback();
        const unsubscribe = observer$.subscribe({next,complete,error});
        return function dispose(){
            unsubscribe();
        }
    })
}