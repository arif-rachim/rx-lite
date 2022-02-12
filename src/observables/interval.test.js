import {describe, test} from "@jest/globals";
import interval from "./interval";

describe("interval", () => {
    test("it should Emitting a sequence of numbers", (done) => {
        const source = interval(100);
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
                expect(Array.from({length: 5}).map((v, i) => i + 1).join(' ')).toEqual(result.join(" "));
                done();
            }
        });

    });

});