import * as MathG from './MathG.js';
import { RenderItem } from './RenderItem.js';

export class RenderButton extends RenderItem {

    action = (mouseX, mouseY) => { console.log(`Button was clicked: [${mouseX},${mouseY}]`) };
    framePause = 0;
    buttonCropLeft = 0;
    buttonCropRight = 0;
    buttonCropTop = 0;
    buttonCropBottom = 0;
    baseFrame = 0;

    constructor(path, _spriteCountX, _spriteCountY) {
        super(path, _spriteCountX, _spriteCountY);
    }

    setAllCrop(crop) {
        this.buttonCropLeft = crop;
        this.buttonCropRight = crop;
        this.buttonCropTop = crop;
        this.buttonCropBottom = crop;
    }

    onNothing(mouseX, mouseY) {
        if (!this.visible)
            return false;

        const isHovering = this.isMouseHovering(mouseX, mouseY);
        this.frameCheck(isHovering, false);

        return isHovering;
    }

    onPressed(mouseX, mouseY) {
        if (!this.visible)
            return false;

        const isHovering = this.isMouseHovering(mouseX, mouseY);
        this.frameCheck(isHovering, true);

        return isHovering;
    }

    onClicked(mouseX, mouseY) {
        if (!this.visible)
            return false;

        const isHovering = this.isMouseHovering(mouseX, mouseY);
        this.frameCheck(isHovering, true);
        if (isHovering)
            this.action(mouseX, mouseY);

        return isHovering;
    }

    frameCheck(isHovering, isPressed) {
        if (isHovering && isPressed) {
            this.frameIndex = this.baseFrame + 2;
            this.framePause = 0.025;
        }
        else if (this.framePause === 0)
            this.frameIndex = this.baseFrame + (isHovering ? 1 : 0);
    }

    isMouseHovering(mouseX, mouseY) {
        const spriteWidth = this.getSpriteWidth();
        const spriteHeight = this.getSpriteHeight();

        return mouseX >= this.posX + this.buttonCropLeft &&
            mouseX < this.posX + spriteWidth - this.buttonCropRight &&
            mouseY >= this.posY + this.buttonCropTop &&
            mouseY < this.posY + spriteHeight - this.buttonCropBottom;
    }

    update(delta) {
        this.framePause = MathG.moveToward(this.framePause, 0, delta);
    }
}