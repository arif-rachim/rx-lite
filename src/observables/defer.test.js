import {describe, test} from "@jest/globals";
import defer from "./defer";
import of from "./of";
import merge from "../operators/merge";

describe("defer", () => {
    test("it should test defer works like normal subscription", (done) => {
        const source = defer(() => of(1,2,3,4,5));
        const max = 5;
        let result = [];
        source.subscribe({
            next: (val) => {
                result.push(val);
                if (val === max) {
                    source.complete.call();
                }
            },
            complete: () => {
                expect(Array.from({length: max}).map((v, i) => i + 1).join(' ')).toEqual(result.join(" "));
                done();
            }
        });
    });

    test("it should generate different time", (done) => {
        const sourceActual = of(new Date());
        const sourceDefer = defer(() => of(new Date('2000-01-01')));
        const result = [];
        merge(sourceActual,sourceDefer).subscribe({
            next : (value) => result.push(value),
            complete : () => {
                const firstTime = result[0];
                const secondTime = result[1];
                const diff = firstTime.getTime() - secondTime.getTime();
                expect(diff).toBeGreaterThan(1);
                done();
            }
        });

    });

});