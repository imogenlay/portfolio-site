// Basic type checks.

export function isString(a) {
	return typeof a === "string";
}

export function isNumber(a) {
	return typeof a === "number";
}

export function isNull(a) {
	return value === null || value === undefined;
}

export function isArrayWithItems(a) {
	return Array.isArray(a) && a.length > 0;
}
// Assertions.

export function error(report) {
	console.error("[ERROR] " + report)
}

export function allAreStrings(...shouldBeStrings) {
	for (let i = 0; i < shouldBeStrings.length; i++) {
		if (isString(shouldBeStrings[i]))
			continue;

		return false;
	}

	return true;
}
