import { FarmAnimal } from './FarmAnimal.js';

export class Cow extends FarmAnimal {

    static COUNT = 4;
    static HOME_WIDTH = 11;
    static HOME_HEIGHT = 6;

    constructor(path, index) {
        super(path, index, Cow.COUNT * 2);
        this.homeWidth = Cow.HOME_WIDTH;
        this.homeHeight = Cow.HOME_HEIGHT;
        this.posX = index * -10;
        this.posY = 80;
    }

    restart() {
        this.speedMultiplier = 1;
        this.speedBoostTimer = 5 + this.variant;

        if (this.variant === 0)
            this.forceToHome(8, 75);
        else if (this.variant === 1)
            this.forceToHome(23, 73);
        else if (this.variant === 2)
            this.forceToHome(12, 84);
        else
            this.forceToHome(27, 83);
    }

    kill() {
        this.speedBoostTimer = 0;
        this.homeX = -20;
        this.timer += 10;
        this.speedMultiplier = 6;
    }
}