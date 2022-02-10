import createObservable from "../observable";

/**
 * Emit numbers in sequence based on provided timeframe.
 *
 * @param delayMiliseconds
 * @returns {{next: next, subscribe: function({next: *, error: *, complete: *}): function(): void, pipe: function(...[*]): *, join: function(*=): function(): void, error: error, complete: complete, observers: [], initializer: function(): function()}}
 */
export default function interval(delayMiliseconds){
    return createObservable(function intervalInitializer({next}){
        let index = 0;
        const intervalTimeout = setInterval(function intervalHandler(){
            next(++index);
        },delayMiliseconds)
        return function shutdown(){
            clearInterval(intervalTimeout);
        }
    })
}