import { RenderItem } from '../../lib/RenderItem.js';
import * as MathG from '../../lib/MathG.js';

export class Forest extends RenderItem {

    static FRAME_COUNT = 25;
    static FRAMES_PER_DEATH = 8;
    maxFrame = 0;

    constructor(path) {
        super(path, Forest.FRAME_COUNT, 1);
        this.posX = 96;
        this.posY = 39;
    }

    update(delta) {
        this.frameIndex = MathG.moveToward(this.frameIndex, this.maxFrame, delta * 10);
    }

    kill() {
        this.maxFrame += Forest.FRAMES_PER_DEATH;
    }

    restart() {
        this.maxFrame = 0;
    }
}