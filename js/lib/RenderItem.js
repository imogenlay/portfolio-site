import * as MathG from './MathG.js';

export class RenderItem {

    // ==================================== FIELDS ====================================
    #texture;
    #isTextureLoaded = false;

    #textureWidth = 0;
    #textureHeight = 0;
    #spriteCountX; #spriteCountY;

    visible = true;
    frameIndex = 0;
    posX = 0; posY = 0;

    // ================================= CONSTRUCTOR ==================================
    constructor(path, _spriteCountX, _spriteCountY) {
        this.#spriteCountX = MathG.max(1, Number(_spriteCountX) || 0);
        this.#spriteCountY = MathG.max(1, Number(_spriteCountY) || 0);

        this.#texture = new Image();
        this.#texture.onload = () => {
            this.#textureWidth = this.#texture.width;
            this.#textureHeight = this.#texture.height;
            this.#isTextureLoaded = true;
        };
        this.#texture.src = path;
    }

    updateAndRender(delta, context) {
        this.update(delta);
        this.render(context);
    }

    update(delta) {

    }

    // ==================================== RENDER ====================================

    render(context) {
        if (!this.#isTextureLoaded || !this.visible)
            return;

        const f = MathG.clamp(this.frameIndex, 0, this.#spriteCountX * this.#spriteCountY - 1);
        const spriteWidth = MathG.floor(this.#textureWidth / this.#spriteCountX);
        const spriteHeight = MathG.floor(this.#textureHeight / this.#spriteCountY);
        const frameXOffset = MathG.floor(f % this.#spriteCountX);
        const frameYOffset = MathG.floor(f / this.#spriteCountX);
        const cropX = frameXOffset * spriteWidth;
        const cropY = frameYOffset * spriteHeight;

        context.drawImage(this.#texture, cropX, cropY, spriteWidth, spriteHeight, MathG.floor(this.posX), MathG.floor(this.posY), spriteWidth, spriteHeight);
    }
}
