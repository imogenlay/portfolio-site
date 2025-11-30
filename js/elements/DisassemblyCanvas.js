
import * as MathG from '../lib/MathG.js';
import { RenderItem } from '../lib/RenderItem.js';
import { Chicken } from './disassembly/Chicken.js';
import { Cloud } from './disassembly/Cloud.js';
import { Cow } from './disassembly/Cow.js';
import { Forest } from './disassembly/Forest.js';
import { MapFeature } from './disassembly/MapFeature.js';
import { Sheep } from './disassembly/Sheep.js';

export class DisassemblyCanvas extends HTMLElement {

    // ==================================== FIELDS ====================================
    canvas;
    context;

    backgroundSky; backgroundLand;
    clouds = [];
    cows = [];
    sheep = [];
    chickens = [];
    forest; lake; ruins; sunflowers; well; wagon;
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

        for (let i = 0; i < Cow.COUNT; i++)
            this.cows.push(new Cow("./disassembly/cows.png", i));

        for (let i = 0; i < Sheep.COUNT; i++)
            this.sheep.push(new Sheep("./disassembly/sheep.png", i));
        for (let i = 0; i < Chicken.COUNT; i++)
            this.chickens.push(new Chicken("./disassembly/chickens.png", i));

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
    }

    // ==================================== RESIZE ====================================

    resizeAndClearCanvas() {
        let maxSize = this.offsetWidth;
        const newSize = MathG.max(2, MathG.floor(maxSize / DisassemblyCanvas.CANVAS_SIZE)) * DisassemblyCanvas.CANVAS_SIZE;

        this.canvas.width = DisassemblyCanvas.CANVAS_SIZE;
        this.canvas.height = DisassemblyCanvas.CANVAS_SIZE;
        this.canvas.style.width = newSize + "px";
        this.canvas.style.height = newSize + "px";

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // ==================================== UPDATE ====================================

    update(delta) {
        this.resizeAndClearCanvas();
        this.context.strokeStyle = "blue";
        this.context.lineWidth = 5;
        this.context.strokeRect(10, 10, 100, 100);

        this.backgroundSky.render(this.context);
        this.renderArray(this.clouds, delta);
        this.backgroundLand.render(this.context);

        this.chickens.sort((a, b) => a.posY - b.posY);
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

    renderArray(renderItemArray, delta) {
        for (let i = 0; i < renderItemArray.length; i++) {
            const item = renderItemArray[i];
            item.updateAndRender(delta, this.context);
        }
    }

}