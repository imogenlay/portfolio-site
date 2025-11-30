import { FarmAnimal } from './FarmAnimal.js';

export class Chicken extends FarmAnimal {

    static COUNT = 11;
    static HOME_WIDTH = 20;
    static HOME_HEIGHT = 12;

    constructor(path, index) {
        super(path, index, 6);
        this.homeWidth = Chicken.HOME_WIDTH;
        this.homeHeight = Chicken.HOME_HEIGHT;
        this.speedMultiplier = 0.5;
        this.delayLength = 14;

        this.forceToHome(49, 57);
    }

}