
window.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('button');
    const content = document.getElementById('content');
    const pubSub = createPubSub(pubSub => {
        setInterval(() => {
            pubSub.publish(1);
        }, 1000);
    });
    const unSubScribe = pubSub.pipe(map((old) => {
        return old;
    })).pipe(reducer((acc, value) => {
        return acc + value;
    }, 0)).pipe(on((value, next) => {
        if (value === 3) {
            next(value);
        }
    })).subscribe((data) => {
        content.innerText = data;
    });
    button.addEventListener('click', () => {
        pubSub.publish(1);
        //pubSub.done();
        //unSubScribe();
    });
});
