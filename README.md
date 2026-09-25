# Rx-Lite

A small, dependency-free JavaScript implementation of RxJS-style observables, written as a learning exercise. It covers a core `createObservable` function, a handful of creation functions and two operators, each with Jest tests.

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

## Tech stack

JavaScript (ES modules) · Jest 27 · live-server

## Development

```bash
npm install
npm test     # runs Jest with --experimental-vm-modules
npm start    # serves index.html with live-server (demo script in src/app.js)
```

## Project layout

```
src/
  observable.js      createObservable core
  observables/       of, from, interval, fromEvent, defer, empty
  operators/         map, merge
  app.js             browser demo loaded by index.html
```
