import {createObservable, map} from "./observable";

describe("Observable", () => {
    test("it should register the subscriber", (done) => {
        const observable = createObservable();
        const output = [];
        const input = [1,2,3]
        observable.subscribe({
            next: (value) => {
                output.push(value)
            }, complete: () => {
                expect(input.join(" ")).toEqual(output.join(" "));
                done();
            }
        })
        input.forEach(i => {
            observable.next(i);
        })
        observable.complete();
    });
    test("it should support pipe ", (done) => {
        const observable = createObservable();
        const output = [];
        const input = [1,2,3]
        observable.pipe(map(x => x * 2)).subscribe({
            next: (value) => {
                output.push(value);
            }, complete: () => {
                const valueOne = input.map(x => x * 2).join(" ");
                const valueTwo = output.join(" ");
                expect(valueOne).toEqual(valueTwo);
                done();
            }
        })
        input.forEach(i => observable.next(i));
        observable.complete();
    });
    test("it should support multiple pipe ", (done) => {
        const observable = createObservable();
        const output = [];
        const input = [1,2,3]
        observable.pipe(map(x => x * 2),map(x => x + 1)).subscribe({
            next: (value) => {
                output.push(value);
            }, complete: () => {
                const valueOne = input.map(x => x * 2).map(x => x + 1).join(" ");
                const valueTwo = output.join(" ");
                expect(valueOne).toEqual(valueTwo);
                done();
            }
        })
        input.forEach(i => observable.next(i));
        observable.complete();
    });
});