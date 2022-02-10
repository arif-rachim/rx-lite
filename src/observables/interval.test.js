import {describe, test} from "@jest/globals";
import of from "./of";
import interval from "./interval";

describe("of", () => {
    test("it should Emitting a sequence of numbers", (done) => {
        const source = interval(100);
        const max = 5;
        let result = [];
        source.subscribe({
            next: (val) => {
                result.push(val);
                if (val === max) {
                    source.complete();
                }
            },
            complete: () => {
                expect(Array.from({length: 5}).map((v, i) => i + 1).join(' ')).toEqual(result.join(" "));
                done();
            }
        });

    });

});