export default function createObservable(initializer) {
    let observers = [];
    initializer = initializer || (() => (() => {
    }));

    function join(observer) {
        observers.push(observer);
        return function detach() {
            observers.splice(observers.indexOf(observer), 1);
        }
    }

    function subscribe(onNext,onError,onComplete) {
        const {next,complete,error} = typeof onNext === 'object' ? onNext : {next:onNext,error:onError,complete:onComplete};
        const disposeCallback = initializer({next,complete,error});
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
            function complete(){
                exit();
                nextObservable.complete();
            }
            const exit = observable.join({next: next, error: nextObservable.error, complete});
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

            self.initializer.call(self,init)
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
