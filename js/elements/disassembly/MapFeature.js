import { RenderItem } from '../../lib/RenderItem.js';
import * as MathG from '../../lib/MathG.js';

export class MapFeature extends RenderItem {

    frameCount;
    timer = 0;

    constructor(path, _frameCount) {
        _frameCount = MathG.max(1, MathG.forceNumber(_frameCount));
        super(path, _frameCount, 1);
        this.frameCount = _frameCount;
    }

    update(delta) {
        this.timer += delta;
        if (this.timer > 0.1) {
            this.timer -= 0.1;
            this.frameIndex++;
        }

        if (this.frameIndex > this.frameCount + 100)
            this.frameIndex = MathG.nextFloat() * -100;
    }
}