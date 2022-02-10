
export default function map(mapCallback) {
    return function observer({next, error}) {
        return function message(message) {
            try {
                const nextVal = mapCallback(message);
                next(nextVal);
            } catch (err) {
                error(err);
            }
        }
    }
}