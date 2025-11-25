import { PageBuilder } from './PageBuilder.js';
import { ProjectBox } from './elements/ProjectBox.js';

// ================================= GET ELEMENTS =================================
const header = document.getElementById("header");
const main = document.getElementById("main");
const foreground = document.getElementById("foreground");
const background = document.getElementById("background");

// ============================= CREATE MAIN CLASSES ==============================
const pageBuilder = new PageBuilder(header, main, foreground, background);

// ============================ DEFINE CUSTOM ELEMENTS ============================
customElements.define('project-box', ProjectBox);

// ================================ ANIMATION LOOP ================================
let lastDeltaTime = performance.now();
let deltaTimeAccumulator = 0;
requestAnimationFrame(animLoop);

function animLoop(now) {
    const MS_PER_UPDATE = 1000 / 60;
    let delta = now - lastDeltaTime;
    lastDeltaTime = now;

    if (delta > MS_PER_UPDATE * 4)
        delta = MS_PER_UPDATE * 4;

    deltaTimeAccumulator += delta;

    while (deltaTimeAccumulator >= MS_PER_UPDATE) {
        update(MS_PER_UPDATE / 1000);
        deltaTimeAccumulator -= MS_PER_UPDATE;
    }

    requestAnimationFrame(animLoop);
}

// ========================== ANIMATION UPDATE FUNCTION ===========================
function update(delta) {
    pageBuilder.updateFloatingTitleAnimation(delta);
}

// ================================ INITIALISATION ================================
pageBuilder.initialise();
