import * as Check from './Check.js';

export function isTag(a, tagName) {
    return a.tagName && a.tagName.toLowerCase() === tagName.toLowerCase();
}

export function getChildOfType(parent, tagName) {
    return Array.from(parent.children).find(a => isTag(a, tagName)) || null;
}

function findSelfOrFirstOfType(element, tagName) {
    if (isTag(element, tagName.toLowerCase()))
        return element;

    for (const child of element.children) {
        const found = findSelfOrFirstOfType(child, tagName);
        if (found)
            return found;
    }

    return null;
}

export function createSpecific(type, className, textContent) {
    // Create a HTML element of type, with class, and content.

    if (!Check.allAreStrings(type, className, textContent)) {
        // The parameters were wrong, therefore a crappy red box will be returned.
        Check.error("When creating element, all 3 parameters must be strings.");
        const failureElement = document.createElement("div");
        failureElement.style.width = "20px";
        failureElement.style.height = "20px";
        failureElement.style.backgroundColor = "red";
        return failureElement;
    }

    const newElement = document.createElement(type);
    if (className.length > 0)
        newElement.classList.add(className);
    if (textContent.length > 0)
        newElement.textContent = textContent;
    return newElement;
}

export function createInput(labelText, attributes) {
    // Create a form box for text input.
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");

    for (const [key, value] of Object.entries(attributes))
        input.setAttribute(key, value);

    label.textContent = labelText;
    div.append(label, input);
    return div;
}

export function createSelect(labelText, selectName) {
    // Create an empty selection box.
    const div = document.createElement("div");
    const label = document.createElement("label");
    const select = document.createElement("select");

    label.textContent = labelText;
    select.name = selectName;
    select.required = true;

    div.append(label, select);
    return div;
}

export function appendOption(parent, attributes) {
    let optionParent = findSelfOrFirstOfType(parent, "select");
    if (!optionParent)
        optionParent = findSelfOrFirstOfType(parent, "datalist");
    if (!optionParent)
        optionParent = findSelfOrFirstOfType(parent, "optgroup");

    if (optionParent) {
        console.log("optionParent: " + optionParent.tagName)
        const option = document.createElement("option");
        option.value = attributes.value;
        option.textContent = attributes.text;

        if (attributes.disabled)
            option.disabled = true;
        if (attributes.selected)
            option.selected = true;

        optionParent.append(option);
    }
}