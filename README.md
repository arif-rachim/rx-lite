# Rx-Lite

Rx-Lite is a small, dependency-free JavaScript implementation of RxJS-style observables, written in 2022 as a learning exercise to understand how observables, subscriptions and operators work under the hood. Everything is built on one factory, `createObservable(initializer)`, which returns a plain object holding a list of observers and the functions `subscribe`, `next`, `error`, `complete`, `join` and `pipe`; the initializer runs on every subscribe and can return a dispose function for cleanup. On top of that core sit six creation functions (`of`, `from`, `interval`, `fromEvent`, `defer`, `empty`) and two operators (`map` and `merge`), each in its own ES module with a matching Jest test file. There is no build step and no runtime dependency; Jest 27 runs the tests and live-server serves a small browser demo. The code is useful for reading and experimenting, not as a replacement for RxJS.

> Experimental code from 2022. Not published to npm and not actively maintained.

## Features

- `createObservable(initializer)` with `subscribe`, `next`, `error`, `complete` and `pipe`
- `subscribe` accepts either an observer object `{next, error, complete}` or three callbacks, and returns an unsubscribe function
- Initializers can return a dispose function that runs on unsubscribe or completion
- Creation functions: `of`, `from` (array, promise, Map/iterable), `interval`, `fromEvent`, `defer`, `empty`
- Operators: `map` (used with `pipe`), `merge` (combines several observables, completes when all complete)

## Example

```js
import createObservable from "./src/observable.js";
import map from "./src/operators/map.js";

const source = createObservable(({next, complete}) => {
    next(3);
    complete();
});

source.pipe(map(x => x * 2), map(x => x + 1))
    .subscribe({next: v => console.log(v), complete: () => console.log("done")});
```

## How it works

- `subscribe` normalizes its arguments into `{next, error, complete}`, calls the initializer with those callbacks, and registers the observer with `join`. The returned `unsubscribe` runs the dispose function and removes the observer.
- `next`, `error` and `complete` on the observable itself broadcast to every registered observer; `complete` also clears the observer list.
- An operator is a function `operator(nextObservable)` that returns a message handler. `pipe` chains one intermediate observable per operator, so `map` simply transforms each message and forwards it (or forwards a thrown error to `error`).
- `from` handles promises (one value, then complete), arrays (each element), and iterables with `forEach` such as `Map` (emits `[key, value]` pairs).
- `interval(ms)` emits 1, 2, 3, ... and clears its timer on unsubscribe; `fromEvent(target, name)` removes its listener on unsubscribe.

## Tech stack

JavaScript (ES modules) · Jest 27 · live-server

## Development

```bash
npm install
npm test     # runs Jest with --experimental-vm-modules
npm start    # serves index.html with live-server (demo script in src/app.js)
```

## Limitations

- Most modules import their siblings without the `.js` extension (for example `import map from "./operators/map"` in `src/app.js`). Jest resolves these, but a browser loading the files as native ES modules does not, so the `npm start` demo may fail to load until the imports get extensions.
- `empty()` calls `next()` once with `undefined` before completing, unlike RxJS `EMPTY`.
- Only `map` and `merge` exist as operators; there is no scheduler and no `filter`, `switchMap` or similar.

## Project layout

```text
src/
  observable.js      createObservable core
  observables/       of, from, interval, fromEvent, defer, empty
  operators/         map, merge
  app.js             browser demo loaded by index.html
```
