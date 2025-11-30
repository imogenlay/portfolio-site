
import * as MathG from '../lib/MathG.js';
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

    backgroundSky; backgroundLand; wolf;
    clouds = [];
    cows = [];
    sheep = [];
    chickens = [];
    deadChickens = [];
    forest; lake; ruins; sunflowers; well; wagon;

    livingFeatures;

    static WOLF_HOME_X = 22;
    static WOLF_HOME_Y = 52;

    // ================================== CONSTANTS ===================================
    static CANVAS_SIZE = 144;

    // ================================= CONSTRUCTOR ==================================
    constructor() {
        super();
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.append(this.canvas);

        this.backgroundSky = new RenderItem("./disassembly/background_0_sky.png");
        this.backgroundLand = new RenderItem("./disassembly/background_1_land.png");
        for (let i = 0; i < Cloud.COUNT; i++)
            this.clouds.push(new Cloud("./disassembly/clouds.png", i));

        this.wolf = new RenderItem("./disassembly/wolf.png")
        this.wolf.posX = DisassemblyCanvas.WOLF_HOME_X;
        this.wolf.posY = DisassemblyCanvas.WOLF_HOME_Y;

        for (let i = 0; i < Cow.COUNT; i++)
            this.cows.push(new Cow("./disassembly/cows.png", i));

        for (let i = 0; i < Sheep.COUNT; i++)
            this.sheep.push(new Sheep("./disassembly/sheep.png", i));

        for (let i = 0; i < Chicken.COUNT; i++)
            this.deadChickens.push(new Chicken("./disassembly/chickens.png", i));

        this.forest = new Forest("./disassembly/forest.png");

        this.lake = new MapFeature("./disassembly/lake.png", 8);
        this.lake.posX = 17;
        this.lake.posY = 37;

        this.ruins = new MapFeature("./disassembly/ruins.png", 8);
        this.ruins.posX = 28;
        this.ruins.posY = 16;

        this.sunflowers = new MapFeature("./disassembly/sunflowers.png", 24);
        this.sunflowers.posX = 60;
        this.sunflowers.posY = 32;

        this.well = new MapFeature("./disassembly/well.png", 8);
        this.well.posX = 75;
        this.well.posY = 56;

        this.wagon = new MapFeature("./disassembly/wagon.png", 6);
        this.wagon.posX = 52;
        this.wagon.posY = 87;

        this.barn = new MapFeature("./disassembly/barn.png", 8);
        this.barn.posX = 82;
        this.barn.posY = 70;

        this.house = new MapFeature("./disassembly/house.png", 8);
        this.house.posX = 29;
        this.house.posY = 58;

        this.canvas.addEventListener("click", e => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = MathG.floor((e.clientX - rect.left) / this.currentCanvasScale);
            const mouseY = MathG.floor((e.clientY - rect.top) / this.currentCanvasScale);
            this.click(mouseX, mouseY);
        });

        this.restartGame();
    }

    restartGame() {
        let i = 0;

        this.livingFeatures = [];
        this.livingFeatures.push(this.forest, this.forest, this.forest);
        this.livingFeatures.push(this.cows, this.sheep, this.chickens);
        this.livingFeatures.push(this.lake, this.ruins, this.sunflowers, this.well, this.wagon, this.barn, this.house);

        this.wolf.angry = false;

        for (i = 0; i < this.deadChickens.length; i++)
            this.deadChickens[i].spawnAtHouse();

        this.chickens.push(...this.deadChickens);
        this.deadChickens = [];

        for (i = 0; i < this.cows.length; i++)
            this.cows[i].restart();
        for (i = 0; i < this.sheep.length; i++)
            this.sheep[i].restart();
        for (i = 0; i < this.chickens.length; i++) {
            this.chickens[i].restart();
        }

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
    }

    click(mouseX, mouseY) {
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

    updateWolf(delta) {
        let wolfTargetX = DisassemblyCanvas.WOLF_HOME_X;
        let wolfTargetY = DisassemblyCanvas.WOLF_HOME_Y;
        const chickenIndex = MathG.min(5, this.chickens.length - 1);
        const hasChickens = this.chickens.length > 0;
        const wolfCanKill = this.wolf.angry && hasChickens;

        if (wolfCanKill) {
            wolfTargetX = this.chickens[chickenIndex].posX;
            wolfTargetY = this.chickens[chickenIndex].posY;
        }

        const wolfSpeed = delta * 10;
        this.wolf.posX = MathG.moveToward(this.wolf.posX, wolfTargetX, wolfSpeed);
        this.wolf.posY = MathG.moveToward(this.wolf.posY, wolfTargetY, wolfSpeed * FarmAnimal.VERTICAL_MOVEMENT_MULTIPLIER);

        if (wolfCanKill &&
            MathG.floor(this.wolf.posX) === MathG.floor(this.chickens[chickenIndex].posX) &&
            MathG.floor(this.wolf.posY) === MathG.floor(this.chickens[chickenIndex].posY)) {
            const deadChicken = this.chickens.splice(chickenIndex, 1)[0];
            this.deadChickens.push(deadChicken);
        }
    }

    renderArray(renderItemArray, delta) {
        renderItemArray.sort((a, b) => a.posY - b.posY);
        for (let i = 0; i < renderItemArray.length; i++) {
            const item = renderItemArray[i];
            item.updateAndRender(delta, this.context);
        }
    }

}