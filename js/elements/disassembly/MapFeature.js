import { RenderItem } from '../../lib/RenderItem.js';
import * as MathG from '../../lib/MathG.js';

export class MapFeature extends RenderItem {

    timer = 0;
    frameCount;
    #isDead = false;

    constructor(path, _frameCount) {
        _frameCount = MathG.max(1, MathG.forceNumber(_frameCount));
        super(path, _frameCount, 1);
        this.frameCount = _frameCount;
    }

    update(delta) {
        this.timer += delta;

        if (this.timer > 0.1) {
            this.timer -= 0.1;
            if (this.#isDead) {
                this.frameIndex++;
            }
        }

    }

    kill() {
        this.#isDead = true;
    }
}