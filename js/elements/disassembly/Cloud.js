import { RenderItem } from '../../lib/RenderItem.js';
import { DisassemblyCanvas } from '../DisassemblyCanvas.js';
import * as MathG from '../../lib/MathG.js';

export class Cloud extends RenderItem {

    speed;
    static MIN_SPEED = 0.25;
    static COUNT = 5;

    constructor(path, index) {
        super(path, Cloud.COUNT, 1);
        this.reset();
        this.posX = index / Cloud.COUNT * DisassemblyCanvas.CANVAS_SIZE + 10;
        this.frameIndex = index;
    }

    update(delta) {
        if (this.posX > DisassemblyCanvas.CANVAS_SIZE)
            this.reset();

        this.posX += delta * this.speed;
    }

    reset() {
        this.posX = -10 - MathG.nextFloat() * 20;
        this.posY = 1 + MathG.round(17 * MathG.nextFloat());
        this.speed = 0.5 * MathG.nextFloat() + Cloud.MIN_SPEED;
    }
}