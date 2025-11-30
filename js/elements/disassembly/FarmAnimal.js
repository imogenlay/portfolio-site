import { RenderItem } from '../../lib/RenderItem.js';
import * as MathG from '../../lib/MathG.js';

export class FarmAnimal extends RenderItem {

    timer = 12;
    homeX; homeY;
    targetX; targetY;
    variant;
    frameCount;

    homeWidth = 3; homeHeight = 3;
    speedMultiplier = 1;
    delayLength = 7;
    speedBoostTimer = 0;

    static VERTICAL_MOVEMENT_MULTIPLIER = 0.25;

    constructor(path, _variant, _frameCount) {
        super(path, _frameCount, 1);
        this.variant = _variant;
        this.frameCount = _frameCount;
    }

    update(delta) {
        this.timer += delta;
        if (this.timer > this.variant + this.delayLength) {
            this.timer = MathG.nextFloat() * -5;
            this.findNewSpot();
        }

        this.setAnimalDirection();

        // Animal move.
        const variantSpeed = 1 + this.variant * 0.3;
        let baseSpeed = delta * variantSpeed * this.speedMultiplier;
        if (this.speedBoostTimer > 0) {
            baseSpeed *= 5.3;
            this.speedBoostTimer -= delta;
        }

        this.posX = MathG.moveToward(this.posX, this.targetX, baseSpeed);
        this.posY = MathG.moveToward(this.posY, this.targetY, baseSpeed * FarmAnimal.VERTICAL_MOVEMENT_MULTIPLIER);
    }

    forceToHome(x, y) {
        this.homeX = x;
        this.homeY = y;
        this.findNewSpot();
    }

    findNewSpot() {
        this.targetX = MathG.floor(this.homeX + this.homeWidth * MathG.nextFloat());
        this.targetY = MathG.floor(this.homeY + this.homeHeight * MathG.nextFloat());
    }

    setAnimalDirection() {
        const baseFrame = (this.variant * 2) % this.frameCount;
        if (this.targetX > this.posX)
            this.frameIndex = baseFrame;
        else if (this.targetX < this.posX)
            this.frameIndex = baseFrame + 1;
    }
}