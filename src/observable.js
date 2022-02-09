function noOp(){
}
export function createObservable(initializer) {
    let observers = [];
    initializer = initializer || noOp;
    function join(observer) {
        observers.push(observer);
        return function detach() {
            observers.splice(observers.indexOf(observer), 1);
        }
    }

    function subscribe({next, error, complete}) {
        initializer({next, error, complete});
        return join({next, error, complete})
    }

    function next(message) {
        observers.forEach(observer => observer.next(message));
    }

    function error(err) {
        observers.forEach(observer => observer.error(err));
    }

    function complete() {
        observers.forEach(observer => observer.complete());
        observers = [];
    }

    function pipe(...operators) {
        const pipedObserver = operators.reduce((observable, operator) => {
            const nextObservable = createObservable();
            const next = operator(nextObservable);
            observable.join({next: next, error: nextObservable.error, complete: nextObservable.complete});
            return nextObservable;
        }, self);

        pipedObserver.subscribe = function subscribe({next, error, complete}) {
            const init = createObservable();
            const final = operators.reduce((observable, operator) => {
                const nextObservable = createObservable();
                const next = operator(nextObservable);
                observable.join({next: next, error: nextObservable.error, complete: nextObservable.complete});
                return nextObservable;
            }, init);
            final.join({next, error, complete});
            self.initializer(init);
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

export function map(mapCallback) {
    return function observer({next, error, complete}) {
        return function message(message) {
            try {
                const nextVal = mapCallback(message);
                next(nextVal);
            } catch (err) {
                error(err);
            }
        }
    }
}