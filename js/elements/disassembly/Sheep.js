import { FarmAnimal } from './FarmAnimal.js';

export class Sheep extends FarmAnimal {

    static COUNT = 6;
    static HOME_WIDTH = 7;
    static HOME_HEIGHT = 5;

    constructor(path, index) {
        super(path, index, 2);
        this.homeWidth = Sheep.HOME_WIDTH;
        this.homeHeight = Sheep.HOME_HEIGHT;
        this.speedMultiplier = 1.3;

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

}