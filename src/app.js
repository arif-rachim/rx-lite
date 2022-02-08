import {createObservable, map} from "./observable.js";

window.onload = () => {
    const origin = createObservable(({next,error,complete}) => {
        console.log('Running initializer');
        next(3);
        complete();
        next(4);
    });

    const observable = origin.pipe(map(x => x * 2),map(x => x + 1))
    observable.subscribe({next:(message) => {
        console.log('Hello ',message);
        },complete : () => {
        console.log('Done');
        },error:(err) => {
        console.error(err);
        }});

    observable.subscribe({next:(message) => {
            console.log('Hello ',message);
        },complete : () => {
            console.log('Done');
        },error:(err) => {
            console.error(err);
        }});
    origin.next(4);

}