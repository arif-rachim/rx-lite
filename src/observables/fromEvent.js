import createObservable from "../observable";

/**
 * Turn event into observable sequence.
 * @param {{addEventListener:function,removeEventListener:function}} target
 * @param {string} eventName
 * @returns {{next: next, subscribe: (function((Function|{next: Function, error: Function, complete: Function}), Function, Function): function(): void), pipe: (function(...[*]): *), join: (function({next: Function, error: Function, complete: Function}): function(): void), error: error, complete: complete, observers: *[], initializer: (function(): function())}}
 */
export default function fromEvent(target,eventName){
    return createObservable(function initFromEvent({next}){
        function onEvent(event){
            next(event);
        }
        target.addEventListener(eventName,onEvent);
        return function dispose(){
            target.removeEventListener(eventName,onEvent);
        }
    });
}