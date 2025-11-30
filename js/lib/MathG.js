export function floor(value) {
    return Math.floor(value);
}

export function ceil(value) {
    return Math.ceil(value);
}

export function round(value) {
    return Math.round(value);
}

export function clamp(value, minValue, maxValue) {
    return min(max(value, minValue), maxValue);
}

export function min(a, b) {
    return Math.min(a, b);
}

export function max(a, b) {
    return Math.max(a, b);
}

export function floorToInt(a) {
    return floor(forceNumber(a));
}

export function nextFloat() {
    return Math.random();
}

export function forceNumber(a) {
    return Number(a) || 0;
}

export function moveToward(a, b, delta) {
    return a + sign(b - a) * min(abs(b - a), delta);
}

export function sign(a) {
    return Math.sign(a);
}

export function abs(a) {
    return Math.abs(a);
}