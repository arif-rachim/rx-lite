import {describe, test} from "@jest/globals";
import empty from "./empty";

describe("empty", () => {
    test("it should immediately complete", (done) => {
        const result = [];
        empty().subscribe(value => {
            if(value){
                result.push(value);
            }
        },() => {},() => {
            expect(0).toEqual(result.length);
            done();
        })
    });

});