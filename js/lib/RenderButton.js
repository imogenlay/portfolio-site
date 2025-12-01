import * as MathG from './MathG.js';
import { RenderItem } from './RenderItem.js';

export class RenderButton extends RenderItem {

    action = (mouseX, mouseY) => { console.log(`Button was clicked: [${mouseX},${mouseY}]`) };
    #isHovering = false;
    framePause = 0;

    constructor(path, _spriteCountX, _spriteCountY) {
        super(path, _spriteCountX, _spriteCountY);
    }

    onPressed(mouseX, mouseY) {
        if (this.#isHovering) {
            this.frameIndex = 2;
            this.framePause = 0.025;
        }

        return this.#isHovering;
    }

    onReleased(mouseX, mouseY) {
        if (this.#isHovering)
            this.action(mouseX, mouseY);

        return this.#isHovering;
    }

    isMouseHovering(mouseX, mouseY) {
        const spriteWidth = this.getSpriteWidth();
        const spriteHeight = this.getSpriteHeight();

        return mouseX >= this.posX && mouseX < this.posX + spriteWidth && mouseY >= this.posY && mouseY < this.posY + spriteHeight;
    }

    updateAndRender(delta, context, mouseX, mouseY) {
        this.update(delta, mouseX, mouseY);
        this.render(context);
    }

    update(delta, mouseX, mouseY) {
        mouseX = MathG.forceNumber(mouseX);
        mouseY = MathG.forceNumber(mouseY);
        this.#isHovering = this.isMouseHovering(mouseX, mouseY);

        if (this.framePause !== 0)
            this.framePause = MathG.moveToward(this.framePause, 0, delta);
        else
            this.frameIndex = this.#isHovering ? 1 : 0;
    }
}