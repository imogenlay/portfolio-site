export function floor(value) {
    return Math.floor(value);
}

export function ceil(value) {
    return Math.ceil(value);
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
    return floor(Number(a));
}
