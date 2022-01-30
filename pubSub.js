function noOp() {
    // do nothing
}

const State = {
    CREATED: 'CREATED',
    INITIATED: 'INITIATED',
    ACTIVE: 'ACTIVE',
    COMPLETE: 'COMPLETE'
};

function createPubSub(initiator) {
    let subscribers = [];
    let stateListener = [];
    let data = [];
    let state = State.CREATED;

    function publish(...args) {
        if (state === State.COMPLETE) {
            return;
        }
        data.push(args);
        subscribers.forEach(function publishInvoker(subscriber) {
            setState(State.ACTIVE);
            subscriber.apply(self, args)
        });
    }

    function subscribe(subscriber) {
        if (state === State.COMPLETE) {
            return noOp;
        }
        if (state === State.CREATED) {
            if (initiator) {
                initiator.call(self, self);
            }
            setState(State.INITIATED);
        }

        data.forEach(function subscribeInvoker(args) {
            setState(State.ACTIVE);
            subscriber.apply(self, args)
        });
        subscribers.push(subscriber);
        return function unsubscribe() {
            subscribers.splice(subscribers.indexOf(subscriber), 1);
        }
    }

    function setState(value) {
        state = value;
        stateListener.forEach(function invoker(listener) {
            listener.call(self, value);
        })
    }

    function pipe(...observers) {
        return observers.reduce(function observerCombinator(prev, next) {
            prev.subscribe(next.publish);
            prev.onStateChange(function stateChangeListener(state) {
                if (state === State.COMPLETE) {
                    next.done();
                }
            })
            return next;
        }, self);
    }

    function done() {
        subscribers = [];
        data = [];
        setState(State.COMPLETE);
        stateListener = [];
    }

    function onStateChange(listener) {
        stateListener.push(listener);
    }

    const self = {
        publish,
        subscribe,
        pipe,
        done,
        onStateChange
    }
    return self;
}

// operator
function map(mapFunction) {
    const pubSub = createPubSub();

    function publish(value) {
        pubSub.publish(mapFunction(value));
    }

    return {...pubSub, publish};
}

function reduce(reducer, initialValue) {
    const pubSub = createPubSub();
    let accumulator = initialValue;

    function publish(value) {
        accumulator = reducer(accumulator, value);
        pubSub.publish(accumulator);
    }

    return {...pubSub, publish};
}

function wait(invoker) {
    const pubSub = createPubSub();

    function publish(value) {
        invoker(value, (value) => {
            pubSub.publish(value);
        });
    }

    return {...pubSub, publish};
}
export {createPubSub,map,wait,reduce}