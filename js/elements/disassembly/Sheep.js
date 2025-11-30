import { DisassemblyCanvas } from '../DisassemblyCanvas.js';
import { FarmAnimal } from './FarmAnimal.js';

export class Sheep extends FarmAnimal {

    static COUNT = 6;
    static HOME_WIDTH = 7;
    static HOME_HEIGHT = 5;

    constructor(path, index) {
        super(path, index, 2);
        this.homeWidth = Sheep.HOME_WIDTH;
        this.homeHeight = Sheep.HOME_HEIGHT;
        this.posX = DisassemblyCanvas.CANVAS_SIZE + index * 12;
        this.posY = 80;
    }

    restart() {
        this.speedMultiplier = 1.3;
        this.speedBoostTimer = 5 + this.variant;

        if (this.variant === 0)
            this.forceToHome(101, 72);
        else if (this.variant === 1)
            this.forceToHome(112, 66);
        else if (this.variant === 2)
            this.forceToHome(129, 72);
        else if (this.variant === 3)
            this.forceToHome(108, 82);
        else if (this.variant === 4)
            this.forceToHome(115, 76);
        else
            this.forceToHome(124, 77);
    }

    kill() {
        this.speedBoostTimer = 0;
        this.homeX = DisassemblyCanvas.CANVAS_SIZE;
        this.timer += 10;
        this.speedMultiplier = 7;
    }
}