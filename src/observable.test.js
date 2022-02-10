import createObservable from "./observable";

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
});