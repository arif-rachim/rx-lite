import {describe, test} from "@jest/globals";
import merge from "./merge";
import of from "../observables/of";

describe("merge", () => {
    test("it should merge observers", (done) => {
        //emit every 2.5 seconds
        const first = of(1,2,3,4,5);
        //emit every 1 second
        const second = of(6,7,8,9,10);
        //used as instance method
        const input = [1,2,3,4,5,6,7,8,9,10];
        const result = [];
        merge(first,second).subscribe((value) => {
            result.push(value);
        },() => {},() => {
            expect(input.join(' ')).toEqual(result.join(" "));
            done();
        })
    });

});