
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
    gameOptionsHaveLoaded = false;
    restartRequested = false;
    playerGameEnded = false;

    wordAnswer = "";
    wordLink = "";
    guessedCharactersSet = new Set();
    gameArray = [];

    hyperLinkParent;
    hyperlink;

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

    // Display
    wordDisplay;
    youWin;
    letterDisplays = [];
    displayLetterLookup = [
        // Check text.png for order.
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "!", "#", "'", "*", "+", "-", ".", "/", ":", "@", "π", " ", " ",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_", " ", " "
    ];
    letterWide2 = "i!'.:";
    letterWide3 = "jl";
    letterWide6 = "MmWw#@π";
    symbolsGuess = "0123456789!#'*+-./:@π";

    // Buttons
    buttonRetry;
    buttonClue;
    buttonSymbols;
    buttonLetters = [];

    // ================================== CONSTANTS ===================================

    static CANVAS_SIZE = 144;
    static WOLF_HOME_X = 22;
    static WOLF_HOME_Y = 52;

    static MOUSE_NOTHING = 0;
    static MOUSE_PRESSED = 1;
    static MOUSE_CLICKED = 2;

    static CLUE_CHAR = "♦";

    // ================================= CONSTRUCTOR ==================================

    constructor() {
        super();
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.hyperLinkParent = document.createElement("div");
        this.hyperLinkParent.style.display = "none";
        this.hyperlink = document.createElement("a");
        const linkTitle = document.createElement("span");
        linkTitle.textContent = "Link:"
        this.hyperLinkParent.append(linkTitle, this.hyperlink);

        const gameDescription = document.createElement("p");
        gameDescription.textContent = "Welcome to Disassembly! In this game you must correctly guess the name of programming " +
            "languages or else your farm will suffer ecological collapse!";

        const gameRules = document.createElement("p");
        gameRules.textContent = "This game is very difficult so don't worry about winning too much! You are permitted 13 wrong " +
            "guesses before you lose! The clue button will give you a random correct letter for free.";
        this.append(this.canvas, this.hyperLinkParent, gameDescription, gameRules);

        const PATH = "./public/disassembly/";

        fetch(PATH + "game_options.txt")
            .then(r => r.text())
            .then(text => {
                this.gameOptions = text.split(/\r?\n/).filter(Boolean);
                this.gameOptionsHaveLoaded = true;
            });

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

        // Word display.

        const DISPLAY_BASE_X = 5;
        const DISPLAY_BASE_Y = 102;
        this.wordDisplay = new RenderItem(PATH + "word_display.png");
        this.wordDisplay.posX = DISPLAY_BASE_X;
        this.wordDisplay.posY = DISPLAY_BASE_Y;

        const MAX_DISPLAY_LETTERS = 26;
        const DISPLAY_LETTER_PX_SIZE = 5;
        for (let i = 0; i < MAX_DISPLAY_LETTERS; i++) {
            const displayLetter = new RenderItem(PATH + "text.png", 13, 6);

            displayLetter.posY = DISPLAY_BASE_Y + 2;

            this.letterDisplays.push(displayLetter);
        }

        this.youWin = new RenderItem(PATH + "you_win.png", 2);
        this.youWin.posX = 22;
        this.youWin.posY = 118;

        // Buttons.

        this.buttonRetry = new RenderButton(PATH + "button_retry.png", 3);
        this.buttonRetry.posX = 115;
        this.buttonRetry.posY = 112;
        this.buttonRetry.setAllCrop(1);
        this.buttonRetry.action = (mouseX, mouseY) => { this.restartRequested = true; };

        this.buttonClue = new RenderButton(PATH + "button_clue.png", 3);
        this.buttonClue.posX = 44;
        this.buttonClue.posY = 132;
        this.buttonClue.setAllCrop(1);
        this.buttonClue.action = (mouseX, mouseY) => { this.getClue(); };
        this.buttonClue.usedCheck = DisassemblyCanvas.CLUE_CHAR;

        this.buttonSymbols = new RenderButton(PATH + "button_symbols.png", 3);
        this.buttonSymbols.posX = 64;
        this.buttonSymbols.posY = 132;
        this.buttonSymbols.setAllCrop(1);
        this.buttonSymbols.action = (mouseX, mouseY) => { this.makeGuess(this.symbolsGuess, false); };
        this.buttonSymbols.usedCheck = "0";

        // Letter buttons.
        const LETTER_COUNT = 26;
        const LETTER_BASE_X = 4;
        const LETTER_BASE_Y = 112;
        const LETTER_PX_SIZE = 10;

        for (let i = 0; i < LETTER_COUNT; i++) {
            const buttonLetter = new RenderButton(PATH + "button_letters.png", 3, LETTER_COUNT);
            const guess = String.fromCharCode(97 + i); // 97 = 'a';

            buttonLetter.posX = LETTER_BASE_X + (i % 11) * LETTER_PX_SIZE;
            buttonLetter.posY = LETTER_BASE_Y + MathG.floor(i / 11) * LETTER_PX_SIZE;
            buttonLetter.setAllCrop(1);
            buttonLetter.action = (mouseX, mouseY) => { this.makeGuess(guess, false); };
            buttonLetter.usedCheck = guess;
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

        this.restartRequested = true;
    }

    restartGame() {
        let i = 0;
        console.log("Restart Disassembly");

        this.playerGameEnded = false;
        this.youWin.visible = false;

        // Set word.
        const selectedGame = (this.gameOptions[MathG.floor(MathG.nextFloat() * this.gameOptions.length)]).split("|");
        this.wordAnswer = selectedGame[0].trim();;
        this.wordLink = selectedGame[1].trim();
        this.gameArray = new Array(this.wordAnswer.length).fill("_");
        this.guessedCharactersSet.clear();

        console.log(this.wordAnswer + " --- " + this.wordLink);

        // The player starts with the space character already guessed.
        this.makeGuess(" ", true);

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

        if (!this.gameOptionsHaveLoaded)
            return;

        if (this.restartRequested) {
            this.restartRequested = false;
            this.restartGame();
        }

        this.setButtonsVisible();
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

        this.updateAndRenderWolf(delta);

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
        this.youWin.updateAndRender(delta, this.context);
        this.updateAndRenderLetterDisplays(delta);

        this.buttonRetry.updateAndRender(delta, this.context);

        if (!this.playerGameEnded) {
            this.buttonClue.updateAndRender(delta, this.context);
            this.buttonSymbols.updateAndRender(delta, this.context);
            for (let i = 0; i < this.buttonLetters.length; i++)
                this.buttonLetters[i].updateAndRender(delta, this.context);
        }
    }

    renderArray(renderItemArray, delta) {
        renderItemArray.sort((a, b) => a.posY - b.posY);
        for (let i = 0; i < renderItemArray.length; i++) {
            const item = renderItemArray[i];
            item.updateAndRender(delta, this.context);
        }
    }

    updateAndRenderWolf(delta) {
        let wolfTargetX = DisassemblyCanvas.WOLF_HOME_X;
        let wolfTargetY = DisassemblyCanvas.WOLF_HOME_Y;
        const chickenIndex = MathG.min(3, this.chickens.length - 1);
        const hasChickens = this.chickens.length > 0;
        const wolfAngry = this.wolf.angry && hasChickens;

        if (wolfAngry) {
            wolfTargetX = this.chickens[chickenIndex].posX;
            wolfTargetY = this.chickens[chickenIndex].posY;
        }

        const wolfSpeed = delta * 15;
        this.wolf.posX = MathG.moveToward(this.wolf.posX, wolfTargetX, wolfSpeed);
        this.wolf.posY = MathG.moveToward(this.wolf.posY, wolfTargetY, wolfSpeed * FarmAnimal.VERTICAL_MOVEMENT_MULTIPLIER);

        if (wolfAngry &&
            MathG.floor(this.wolf.posX) === MathG.floor(this.chickens[chickenIndex].posX) &&
            MathG.floor(this.wolf.posY) === MathG.floor(this.chickens[chickenIndex].posY)) {
            const deadChicken = this.chickens.splice(chickenIndex, 1)[0];
            this.deadChickens.push(deadChicken);
        }

        this.wolf.render(this.context);
    }

    updateAndRenderLetterDisplays(delta) {

        const getCharWidth = (char) => {
            if (this.letterWide6.includes(char))
                return 6;
            if (this.letterWide3.includes(char))
                return 3;
            if (this.letterWide2.includes(char))
                return 2;
            return 4;
        }

        let width = 0;
        for (let i = 0; i < this.letterDisplays.length; i++) {
            const letter = this.letterDisplays[i];

            if (i >= this.gameArray.length) {
                letter.visible = false;
                continue;
            }

            letter.visible = true;
            width += getCharWidth(this.gameArray[i]);
        }

        let positionX = MathG.floor(DisassemblyCanvas.CANVAS_SIZE / 2 - (width / 2));
        for (let i = 0; i < this.gameArray.length; i++) {
            const letter = this.letterDisplays[i];

            letter.posX = positionX;
            letter.frameIndex = this.displayLetterLookup.indexOf(this.gameArray[i]);
            letter.updateAndRender(delta, this.context);

            positionX += getCharWidth(this.gameArray[i]);
        }
    }

    // ================================= MOUSE STATE ==================================

    setButtonsVisible() {
        const setVisibility = (button) => { button.visible = !(this.guessedCharactersSet.has(button.usedCheck)); };

        setVisibility(this.buttonClue);
        setVisibility(this.buttonSymbols);
        for (let i = 0; i < this.buttonLetters.length; i++)
            setVisibility(this.buttonLetters[i]);

    }

    onMouseNothing() {
        this.buttonRetry.onNothing(this.mouseX, this.mouseY);

        if (!this.playerGameEnded) {
            this.buttonClue.onNothing(this.mouseX, this.mouseY);
            this.buttonSymbols.onNothing(this.mouseX, this.mouseY);
            for (let i = 0; i < this.buttonLetters.length; i++)
                this.buttonLetters[i].onNothing(this.mouseX, this.mouseY);
        }
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

        if (!this.playerGameEnded) {
            press(this.buttonClue);
            press(this.buttonSymbols);
            for (let i = 0; i < this.buttonLetters.length; i++)
                press(this.buttonLetters[i]);
        }
    }

    onMouseClicked() {
        if (this.buttonRetry.onClicked(this.mouseX, this.mouseY))
            return;

        if (!this.playerGameEnded) {
            if (this.buttonClue.onClicked(this.mouseX, this.mouseY))
                return;
            if (this.buttonSymbols.onClicked(this.mouseX, this.mouseY))
                return;
            for (let i = 0; i < this.buttonLetters.length; i++)
                if (this.buttonLetters[i].onClicked(this.mouseX, this.mouseY))
                    return;
        }
    }

    // ================================== GAME LOGIC ==================================

    getClue() {
        let clue = [];
        for (let i = 0; i < this.gameArray.length; i++)
            if (this.gameArray[i] === "_")
                clue.push(this.wordAnswer[i]);

        let finalClue = clue[MathG.floor(MathG.nextFloat() * clue.length)]
        if (this.symbolsGuess.includes(finalClue))
            // We must override the guess as the symbols button only disappears if '0' is guessed.
            finalClue = this.symbolsGuess;

        this.makeGuess(DisassemblyCanvas.CLUE_CHAR + finalClue, true);
    };

    makeGuess(guesses, correctGuess) {
        // Add the uppercase and lowercase version just in case one of those was missed.
        guesses += guesses.toUpperCase() + guesses.toLowerCase();
        const allGuessLetters = guesses.split("");

        if (!correctGuess) {
            // Sometimes the guess is always correct, and we don't need to scan for a match.
            // The guess is always correct is the guess is the clue or " ".
            for (let i = 0; i < allGuessLetters.length; i++)
                if (this.wordAnswer.includes(allGuessLetters[i])) {
                    correctGuess = true;
                    break;
                }
        }

        allGuessLetters.forEach(v => this.guessedCharactersSet.add(v));

        if (correctGuess) {
            for (let i = 0; i < this.gameArray.length; i++)
                if (this.guessedCharactersSet.has(this.wordAnswer[i]))
                    this.gameArray[i] = this.wordAnswer[i];

            if (this.gameArray.join("") === this.wordAnswer)
                this.playerWins(true);
        }
        else {
            this.damage();
            if (this.livingFeatures.length === 0)
                this.playerWins(false);
        }
    }

    damage() {
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

    playerWins(isWinner) {
        // Make sure answer is given.
        for (let i = 0; i < this.gameArray.length; i++)
            this.gameArray[i] = this.wordAnswer[i];

        this.playerGameEnded = true;
        this.youWin.visible = true;
        this.youWin.frameIndex = isWinner ? 0 : 1;

        this.hyperLinkParent.style.display = "block";
        this.hyperlink.href = "https://" + this.wordLink;
        this.hyperlink.textContent = this.wordLink;
        console.log(this.wordLink);
    }
}