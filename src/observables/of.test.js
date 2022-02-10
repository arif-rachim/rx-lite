import of from "./of";
import {describe, test} from "@jest/globals";

describe("of", () => {
    test("it should Emitting a sequence of numbers", (done) => {
        const of$ = of(1,2,3,4);
        const result = [];
        of$.subscribe({next:(value) => {
            result.push(value);
            },complete : ()  => {
                expect([1,2,3,4].join(" ")).toEqual(result.join(" "));
                done();
            }});
    });
    test("it should Emitting a sequence of numbers twice", (done) => {
        const of$ = of(1,2,3,4);
        const result = [];
        of$.subscribe({next:(value) => {
                result.push(value);
            },complete : ()  => {
                expect([1,2,3,4].join(" ")).toEqual(result.join(" "));
                of$.subscribe({next:(value) => {
                        result.push(value);
                    },complete : ()  => {
                        expect([1,2,3,4,1,2,3,4].join(" ")).toEqual(result.join(" "));
                        done();
                    }});
            }});
    });
});