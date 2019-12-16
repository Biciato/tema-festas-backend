export const getNested = (props, obj) =>
    props.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), obj);
