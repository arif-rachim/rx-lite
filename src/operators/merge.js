import createObservable from "../observable";

/**
 * Turn multiple observables into a single observable.
 * @param observables
 * @returns {{next: next, subscribe: function(*=, *=, *=): function(): void, pipe: function(...[*]): *, join: function(*=): function(): void, error: error, complete: complete, observers: [], initializer: function(): function()}}
 */
export default function merge(...observables){
    let activeObserver = observables.length;
    return createObservable(function mergeInitializer({next:mergeNext,error:mergeError,complete:mergeComplete}){
        observables.forEach(function onEach(observable){
            function complete(){
                activeObserver = activeObserver - 1;
                if(activeObserver === 0){
                    mergeComplete();
                }
            }
            observable.subscribe(mergeNext,mergeError,complete);
        })
    })
}