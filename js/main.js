import { PageBuilder } from './PageBuilder.js';
import { DisassemblyCanvas } from './elements/DisassemblyCanvas.js';
import { ProjectBox } from './elements/ProjectBox.js';

// ============================ DEFINE CUSTOM ELEMENTS ============================
customElements.define('disassembly-canvas', DisassemblyCanvas);
customElements.define('project-box', ProjectBox);

// ================================= GET ELEMENTS =================================
const header = document.getElementById("header");
const gap = document.getElementById("gap");
const main = document.getElementById("main");
const foreground = document.getElementById("foreground");
const background = document.getElementById("background");

// ============================= CREATE MAIN CLASSES ==============================
const pageBuilder = new PageBuilder(header, main, foreground, background);

// ================================ ANIMATION LOOP ================================
let lastDeltaTime = performance.now();
let deltaTimeAccumulator = 0;
requestAnimationFrame(animLoop);

function animLoop(now) {
    const MS_PER_UPDATE = 1000 / 60;
    let delta = now - lastDeltaTime;
    lastDeltaTime = now;

    if (!document.hidden) {
        if (delta > MS_PER_UPDATE * 2)
            delta = MS_PER_UPDATE * 2;

        deltaTimeAccumulator += delta;

        while (deltaTimeAccumulator >= MS_PER_UPDATE) {
            update(MS_PER_UPDATE / 1000);
            deltaTimeAccumulator -= MS_PER_UPDATE;
        }
    }

    requestAnimationFrame(animLoop);
}

// ========================== ANIMATION UPDATE FUNCTION ===========================
function update(delta) {
    pageBuilder.update(delta);
}

// ================================ INITIALISATION ================================
pageBuilder.initialise();



export const checkStringPalindrome = (stringOne) => {
    const half = Math.floor(stringOne.length / 2);
    for (let i = 0; i < half; i++)
        if (stringOne[i] !== stringOne[stringOne.length - 1 - i])
            return false;

    return true;
};

export const totalNestedScoresArr = (scoresArr) => {
    return scoresArr.map((arr) => arr.reduce((prev, curr) => prev + Number(curr), 0));
};

console.log("START");
console.log(checkStringPalindrome("racecar"));
console.log(checkStringPalindrome("rrrrrrrrrrrrrrrrrrrrrrrr"));
console.log(checkStringPalindrome("rrrrrrrrrrrrrrrrrrprrrrr"));
console.log([[7, 7, 6], [2, 3, 2], [3]]);
console.log(totalNestedScoresArr([[7, 7, 6], [2, 3, 2], [3]]));