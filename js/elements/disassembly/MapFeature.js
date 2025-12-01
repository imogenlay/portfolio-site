import { RenderItem } from '../../lib/RenderItem.js';
import * as MathG from '../../lib/MathG.js';

export class MapFeature extends RenderItem {

    timer = 0;
    frameCount;
    maxFrame = 0;

    constructor(path, _frameCount) {
        _frameCount = MathG.max(1, MathG.forceNumber(_frameCount));
        super(path, _frameCount, 1);
        this.frameCount = _frameCount;
    }

    update(delta) {
        this.frameIndex = MathG.moveToward(this.frameIndex, this.maxFrame, delta * 10);
    }

    kill() {
        this.maxFrame = this.frameCount;
    }

    restart() {
        this.maxFrame = 0;
    }
}