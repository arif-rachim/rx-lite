function noOp() {
    return function noOp() {
    };
}

/**
 * Create observer
 * @param {function({next:function,error:function,complete:function}):function():void} initializer
 * @returns {{next: next, subscribe: function((Function|{next: Function, error: Function, complete: Function}), Function, Function): function(): void, pipe: function(...[*]): *, join: function({next: Function, error: Function, complete: Function}): function(): void, error: error, complete: complete, observers: [], initializer: function(): function()}}
 */
export default function createObservable(initializer) {
    let observers = [];
    initializer = initializer || noOp;

    /**
     *
     * @param {{next:function,error:function,complete:function}} observer
     * @returns {function(): void}
     */
    function join(observer) {
        observers.push(observer);
        return function detach() {
            observers.splice(observers.indexOf(observer), 1);
        }
    }

    /**
     *
     * @param {function|{next:function,error:function,complete:function}} onNext
     * @param {function} onError
     * @param {function} onComplete
     * @returns {function(): void} unregister the subscriber
     */
    function subscribe(onNext, onError, onComplete) {
        const {next, complete, error} = typeof onNext === 'object' ? onNext : {
            next: onNext,
            error: onError,
            complete: onComplete
        };
        const disposeCallback = initializer({next, complete, error});
        const exitCallback = join({
            next, error, complete: function completeCallback() {
                if (disposeCallback && typeof disposeCallback === 'function') {
                    disposeCallback();
                }
                complete();
            }
        });
        return function unsubscribe() {
            if (disposeCallback && typeof disposeCallback === 'function') {
                disposeCallback();
            }
            exitCallback();
        }
    }

    /**
     * Broadcast message to all observers
     * @param message
     */
    function next(message) {
        observers.forEach(observer => observer.next(message));
    }

    /**
     * Broadcast error to all observers
     * @param err
     */
    function error(err) {
        observers.forEach(observer => observer.error(err));
    }

    /**
     * Broadcast complete to all observer
     * remove all observers
     */
    function complete() {
        observers.forEach(observer => observer.complete());
        observers = [];
    }

    /**
     * Pipe against operators
     * @param operators
     * @returns {*}
     */
    function pipe(...operators) {
        const pipedObserver = operators.reduce(function reduceCallback(observable, operator){

            const nextObservable = createObservable();
            const next = operator(nextObservable);

            function complete() {
                exit();
                nextObservable.complete();
            }

            const exit = observable.join({next: next, error: nextObservable.error, complete});
            return nextObservable;
        }, self);

        pipedObserver.subscribe = function subscribe({next, error, complete}) {
            const init = createObservable();
            const final = operators.reduce(function reduceCallback(observable, operator) {
                const nextObservable = createObservable();
                const next = operator(nextObservable);
                observable.join({next: next, error: nextObservable.error, complete: nextObservable.complete});
                return nextObservable;
            }, init);
            final.join({next, error, complete});

            self.initializer.call(self, init)
            return pipedObserver.join({next, error, complete})
        }

        return pipedObserver;
    }

    const self = {
        observers,
        next,
        subscribe,
        pipe,
        join,
        error,
        complete,
        initializer
    }
    return self;
}
