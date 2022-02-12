import {describe, test} from "@jest/globals";
import empty from "./empty";
import fromEvent from "./fromEvent";

class EventDispatcher{
    listeners = {};
    addEventListener(name,callback){
        this.listeners[name]=this.listeners[name] || [];
        this.listeners[name].push(callback);
    }
    removeEventListener(name,callback){
        const callbackIndex = this.listeners[name].indexOf(callback);
        this.listeners[name].splice(callbackIndex,1);
    }
    dispatchEvent(event){
        this.listeners[event.type].forEach(listener => listener(event));
    }
}
class Event{
    type;
    constructor(type) {
        this.type = type;
    }

}
describe("empty", () => {
    test("it should raise event", (done) => {
        const eventDispatcher = new EventDispatcher();
        const originalEvent = new Event('click');
        fromEvent(eventDispatcher,'click').subscribe((event) => {
            expect(event).toEqual(originalEvent);
            done();
        });
        eventDispatcher.dispatchEvent(originalEvent);
    });
});