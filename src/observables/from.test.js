import {describe, test} from "@jest/globals";
import empty from "./empty";
import from from "./from";

describe("empty", () => {
    test("it should resolve promise", (done) => {
        from(new Promise(resolve => {
            setTimeout(() => {
                resolve('Hello world');
            },100)
        })).subscribe(value => {
            expect('Hello world').toEqual(value);
            done();
        })
    });
});