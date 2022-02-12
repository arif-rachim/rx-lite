import createObservable from "../observable";

/**
 * Turn an array, promise, or iterable into an observable.
 *💡 This operator can be used to convert a promise to an observable!
 *💡 For arrays and iterables, all contained values will be emitted as a sequence!
 *💡 This operator can also be used to emit a string as a sequence of characters!
 * @param param
 * @returns {{next: next, subscribe: function(*=, *=, *=): function(): void, pipe: function(...[*]): *, join: function(*=): function(): void, error: error, complete: complete, observers: [], initializer: function(): function()}}
 */
export default function from(param){
    return createObservable(function initFrom({next,complete,error}){
        if(typeof param === 'object' && 'then' in param){
            param.then(function onPromise(value){
                next(value);
                complete();
            }).catch(function onError(err){
                error(err);
                complete();
            });
        }else if(Array.isArray(param)){
            param.forEach(function onEach(par){
                next(par);
            });
            complete();
        }else if(Symbol.iterator in param){
            param.forEach(function onEach(value, key){
                next([key,value]);
            })
            complete();
        }else if(param instanceof String){
            param.split("").forEach(function onEach(key){
                next(key);
            })
            complete();
        }
    })
}