
import * as MathG from '../lib/MathG.js';
import { RenderButton } from '../lib/RenderButton.js';
import { RenderItem } from '../lib/RenderItem.js';
import { Chicken } from './disassembly/Chicken.js';
import { Cloud } from './disassembly/Cloud.js';
import { Cow } from './disassembly/Cow.js';
import { FarmAnimal } from './disassembly/FarmAnimal.js';
import { Forest } from './disassembly/Forest.js';
import { MapFeature } from './disassembly/MapFeature.js';
import { Sheep } from './disassembly/Sheep.js';

export class DisassemblyCanvas extends HTMLElement {

    // ==================================== FIELDS ====================================

    canvas;
    context;
    currentCanvasScale;

    gameOptions;

    // Mouse
    mouseX = 0; mouseY = 0;
    mouseState = 0; // 0 = Nothing, 1 = Held down, 2 = On Release Click

    // Game objects
    backgroundSky; backgroundLand; wolf;
    clouds = [];
    cows = [];
    sheep = [];
    chickens = [];
    deadChickens = [];

    forest; lake; ruins; sunflowers; well; wagon;
    livingFeatures = [];

    // Buttons
    wordDisplay;
    buttonRetry;
    buttonClue;
    buttonNumbers;
    buttonSymbols;
    buttonLetters = [];

    // ================================== CONSTANTS ===================================

    static CANVAS_SIZE = 144;
    static WOLF_HOME_X = 22;
    static WOLF_HOME_Y = 52;

    static MOUSE_NOTHING = 0;
    static MOUSE_PRESSED = 1;
    static MOUSE_CLICKED = 2;

    // ================================= CONSTRUCTOR ==================================

    constructor() {
        super();
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.append(this.canvas);
        // Possible characters: !#'*+-./012345678:@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzπ
        const PATH = "./public/disassembly/";

        fetch(PATH + "game_options.txt")
            .then(r => r.text())
            .then(text => { this.gameOptions = text.split(/\r?\n/).filter(Boolean); });

        // const randomLine = lines[MathG.round(MathG.nextFloat() * lines.length)]; 

        this.backgroundSky = new RenderItem(PATH + "background_0_sky.png");
        this.backgroundLand = new RenderItem(PATH + "background_1_land.png");
        for (let i = 0; i < Cloud.COUNT; i++)
            this.clouds.push(new Cloud(PATH + "clouds.png", i));

        this.wolf = new RenderItem(PATH + "wolf.png");
        this.wolf.posX = DisassemblyCanvas.WOLF_HOME_X;
        this.wolf.posY = DisassemblyCanvas.WOLF_HOME_Y;

        for (let i = 0; i < Cow.COUNT; i++)
            this.cows.push(new Cow(PATH + "cows.png", i));

        for (let i = 0; i < Sheep.COUNT; i++)
            this.sheep.push(new Sheep(PATH + "sheep.png", i));

        for (let i = 0; i < Chicken.COUNT; i++)
            this.deadChickens.push(new Chicken(PATH + "chickens.png", i));

        this.forest = new Forest(PATH + "forest.png");

        this.lake = new MapFeature(PATH + "lake.png", 8);
        this.lake.posX = 17;
        this.lake.posY = 37;

        this.ruins = new MapFeature(PATH + "ruins.png", 8);
        this.ruins.posX = 28;
        this.ruins.posY = 16;

        this.sunflowers = new MapFeature(PATH + "sunflowers.png", 24);
        this.sunflowers.posX = 60;
        this.sunflowers.posY = 32;

        this.well = new MapFeature(PATH + "well.png", 8);
        this.well.posX = 75;
        this.well.posY = 56;

        this.wagon = new MapFeature(PATH + "wagon.png", 6);
        this.wagon.posX = 44;
        this.wagon.posY = 87;

        this.barn = new MapFeature(PATH + "barn.png", 8);
        this.barn.posX = 82;
        this.barn.posY = 70;

        this.house = new MapFeature(PATH + "house.png", 8);
        this.house.posX = 29;
        this.house.posY = 58;

        // Buttons.
        this.wordDisplay = new RenderItem(PATH + "word_display.png");
        this.wordDisplay.posX = 5;
        this.wordDisplay.posY = 103;

        this.buttonRetry = new RenderButton(PATH + "button_retry.png", 3);
        this.buttonRetry.posX = 115;
        this.buttonRetry.posY = 112;
        this.buttonRetry.setAllCrop(1);
        this.buttonRetry.action = (mouseX, mouseY) => { this.restartGame(); };

        this.buttonClue = new RenderButton(PATH + "button_clue.png", 3);
        this.buttonClue.posX = 44;
        this.buttonClue.posY = 132;
        this.buttonClue.setAllCrop(1);
        this.buttonClue.action = (mouseX, mouseY) => { };

        this.buttonNumbers = new RenderButton(PATH + "button_numbers.png", 3);
        this.buttonNumbers.posX = 64;
        this.buttonNumbers.posY = 132;
        this.buttonNumbers.setAllCrop(1);
        this.buttonNumbers.action = (mouseX, mouseY) => { };

        this.buttonSymbols = new RenderButton(PATH + "button_symbols.png", 3);
        this.buttonSymbols.posX = 84;
        this.buttonSymbols.posY = 132;
        this.buttonSymbols.setAllCrop(1);
        this.buttonSymbols.action = (mouseX, mouseY) => { };

        // Letter buttons.
        const LETTER_COUNT = 26;
        const LETTER_BASE_X = 4;
        const LETTER_BASE_Y = 112;
        const LETTER_PX_SIZE = 10;

        for (let i = 0; i < LETTER_COUNT; i++) {
            const buttonLetter = new RenderButton(PATH + "button_letters.png", 3, LETTER_COUNT);
            buttonLetter.posX = LETTER_BASE_X + (i % 11) * LETTER_PX_SIZE;
            buttonLetter.posY = LETTER_BASE_Y + MathG.floor(i / 11) * LETTER_PX_SIZE;
            buttonLetter.setAllCrop(1);
            buttonLetter.action = (mouseX, mouseY) => { };
            buttonLetter.baseFrame = i * 3;

            this.buttonLetters.push(buttonLetter);
        }

        // Events. 

        this.canvas.addEventListener("mouseup", e => { this.mouseState = DisassemblyCanvas.MOUSE_CLICKED; });
        this.canvas.addEventListener("mousedown", e => { this.mouseState = DisassemblyCanvas.MOUSE_PRESSED; });
        this.canvas.addEventListener("mousemove", e => {
            // Get mouse position.
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = MathG.floor((e.clientX - rect.left) / this.currentCanvasScale);
            this.mouseY = MathG.floor((e.clientY - rect.top) / this.currentCanvasScale);
        });
        this.canvas.addEventListener("mouseleave", () => {
            this.mouseX = 99999;
            this.mouseY = 99999;
        });

        this.restartGame();
    }

    restartGame() {
        let i = 0;

        // Restart features.
        this.livingFeatures = [];
        this.livingFeatures.push(this.forest, this.forest, this.forest);
        this.livingFeatures.push(this.cows, this.sheep, this.chickens);
        this.livingFeatures.push(this.lake, this.ruins, this.sunflowers, this.well, this.wagon, this.barn, this.house);

        this.forest.restart();
        this.lake.restart();
        this.ruins.restart();
        this.sunflowers.restart();
        this.well.restart();
        this.wagon.restart();
        this.barn.restart();
        this.house.restart();

        // Restart chickens.
        this.wolf.angry = false;

        for (i = 0; i < this.deadChickens.length; i++)
            this.deadChickens[i].spawnAtHouse();

        this.chickens.push(...this.deadChickens);
        this.deadChickens = [];
        for (i = 0; i < this.chickens.length; i++)
            this.chickens[i].restart();

        // Restart other animals.
        for (i = 0; i < this.cows.length; i++)
            this.cows[i].restart();
        for (i = 0; i < this.sheep.length; i++)
            this.sheep[i].restart();
    }

    // ==================================== RESIZE ====================================

    resizeAndClearCanvas() {
        let maxSize = this.offsetWidth;
        this.currentCanvasScale = MathG.max(2, MathG.floor(maxSize / DisassemblyCanvas.CANVAS_SIZE));
        const newSize = this.currentCanvasScale * DisassemblyCanvas.CANVAS_SIZE;

        this.canvas.width = DisassemblyCanvas.CANVAS_SIZE;
        this.canvas.height = DisassemblyCanvas.CANVAS_SIZE;
        this.canvas.style.width = newSize + "px";
        this.canvas.style.height = newSize + "px";

        this.context.fillStyle = "#2e93e6";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // ==================================== UPDATE ====================================

    update(delta) {
        this.resizeAndClearCanvas();

        if (this.mouseState === DisassemblyCanvas.MOUSE_NOTHING)
            this.onMouseNothing();
        else if (this.mouseState === DisassemblyCanvas.MOUSE_PRESSED)
            this.onMousePressed();
        else if (this.mouseState === DisassemblyCanvas.MOUSE_CLICKED) {
            this.mouseState = DisassemblyCanvas.MOUSE_NOTHING;
            this.onMouseClicked();
        }

        this.backgroundSky.render(this.context);
        this.renderArray(this.clouds, delta);
        this.backgroundLand.render(this.context);

        this.updateWolf(delta);
        this.wolf.render(this.context);

        this.renderArray(this.chickens, delta);
        this.renderArray(this.cows, delta);
        this.renderArray(this.sheep, delta);

        this.forest.updateAndRender(delta, this.context);
        this.lake.updateAndRender(delta, this.context);
        this.ruins.updateAndRender(delta, this.context);
        this.sunflowers.updateAndRender(delta, this.context);
        this.well.updateAndRender(delta, this.context);
        this.wagon.updateAndRender(delta, this.context);
        this.barn.updateAndRender(delta, this.context);
        this.house.updateAndRender(delta, this.context);

        this.wordDisplay.updateAndRender(delta, this.context);
        this.buttonRetry.updateAndRender(delta, this.context);
        this.buttonClue.updateAndRender(delta, this.context);
        this.buttonNumbers.updateAndRender(delta, this.context);
        this.buttonSymbols.updateAndRender(delta, this.context);
        for (let i = 0; i < this.buttonLetters.length; i++)
            this.buttonLetters[i].updateAndRender(delta, this.context);
    }

    renderArray(renderItemArray, delta) {
        renderItemArray.sort((a, b) => a.posY - b.posY);
        for (let i = 0; i < renderItemArray.length; i++) {
            const item = renderItemArray[i];
            item.updateAndRender(delta, this.context);
        }
    }

    updateWolf(delta) {
        let wolfTargetX = DisassemblyCanvas.WOLF_HOME_X;
        let wolfTargetY = DisassemblyCanvas.WOLF_HOME_Y;
        const chickenIndex = MathG.min(3, this.chickens.length - 1);
        const hasChickens = this.chickens.length > 0;
        const wolfAngry = this.wolf.angry && hasChickens;

        if (wolfAngry) {
            wolfTargetX = this.chickens[chickenIndex].posX;
            wolfTargetY = this.chickens[chickenIndex].posY;
        }

        const wolfSpeed = delta * 10;
        this.wolf.posX = MathG.moveToward(this.wolf.posX, wolfTargetX, wolfSpeed);
        this.wolf.posY = MathG.moveToward(this.wolf.posY, wolfTargetY, wolfSpeed * FarmAnimal.VERTICAL_MOVEMENT_MULTIPLIER);

        if (wolfAngry &&
            MathG.floor(this.wolf.posX) === MathG.floor(this.chickens[chickenIndex].posX) &&
            MathG.floor(this.wolf.posY) === MathG.floor(this.chickens[chickenIndex].posY)) {
            const deadChicken = this.chickens.splice(chickenIndex, 1)[0];
            this.deadChickens.push(deadChicken);
        }
    }

    // ================================= MOUSE STATE ==================================

    onMouseNothing() {
        this.buttonRetry.onNothing(this.mouseX, this.mouseY);
        this.buttonClue.onNothing(this.mouseX, this.mouseY);
        this.buttonNumbers.onNothing(this.mouseX, this.mouseY);
        this.buttonSymbols.onNothing(this.mouseX, this.mouseY);
        for (let i = 0; i < this.buttonLetters.length; i++)
            this.buttonLetters[i].onNothing(this.mouseX, this.mouseY);


    }

    onMousePressed() {
        let buttonFound = false;

        const press = (button) => {
            if (buttonFound) {
                button.onNothing(this.mouseX, this.mouseY);
                return;
            }

            if (button.onPressed(this.mouseX, this.mouseY))
                buttonFound = true;
        };

        press(this.buttonRetry);
        press(this.buttonClue);
        press(this.buttonNumbers);
        press(this.buttonSymbols);
        for (let i = 0; i < this.buttonLetters.length; i++)
            press(this.buttonLetters[i]);
    }

    onMouseClicked() {
        if (this.buttonRetry.onClicked(this.mouseX, this.mouseY))
            return;
        if (this.buttonClue.onClicked(this.mouseX, this.mouseY))
            return;
        if (this.buttonNumbers.onClicked(this.mouseX, this.mouseY))
            return;
        if (this.buttonSymbols.onClicked(this.mouseX, this.mouseY))
            return;
        for (let i = 0; i < this.buttonLetters.length; i++)
            if (this.buttonLetters[i].onClicked(this.mouseX, this.mouseY))
                return;

        // Delete objects script.
        if (this.livingFeatures.length === 0)
            return;

        // Get random feature from the array.
        const featureIndex = MathG.floor(MathG.nextFloat() * this.livingFeatures.length);
        const item = this.livingFeatures.splice(featureIndex, 1)[0];
        if (item === this.chickens) {
            // Chickens array.
            this.wolf.angry = true;
        }
        else if (Array.isArray(item)) {
            // Sheep or Cows.
            for (let i = 0; i < item.length; i++)
                item[i].kill();
        }
        else
            // Everything else.
            item.kill();
    }
}