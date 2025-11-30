import { RenderItem } from '../../lib/RenderItem.js';

export class Forest extends RenderItem {

    static FRAME_COUNT = 25;
    timer = 0;

    constructor(path) {
        super(path, Forest.FRAME_COUNT, 1);
        this.posX = 96;
        this.posY = 39;
    }

    update(delta) {
        this.timer += delta;
        if (this.timer > 0.1) {
            this.timer -= 0.1;
            this.frameIndex++;
        }

        if (this.frameIndex > 50)
            this.frameIndex = 0;

    }
}