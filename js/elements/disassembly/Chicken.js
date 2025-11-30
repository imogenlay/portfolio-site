import { DisassemblyCanvas } from '../DisassemblyCanvas.js';
import { FarmAnimal } from './FarmAnimal.js';

export class Chicken extends FarmAnimal {

    static COUNT = 11;
    static HOME_WIDTH = 20;
    static HOME_HEIGHT = 12;
    static COUP_X = 37;
    static COUP_Y = 63;

    constructor(path, index) {
        super(path, index, 6);
        this.homeWidth = Chicken.HOME_WIDTH;
        this.homeHeight = Chicken.HOME_HEIGHT;
        this.delayLength = 14;

        this.forceToHome(49, 57);
    }

    spawnAtHouse() {
        this.posX = Chicken.COUP_X;
        this.posY = Chicken.COUP_Y;
    }

    restart() {
        this.speedMultiplier = 0.5;
        this.speedBoostTimer = 4 + this.variant * 0.3;
    }

    kill() {
        console.log("Alert: Trying to kill a chicken.")
    }
}