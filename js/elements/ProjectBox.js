import * as ElementG from '../lib/ElementG.js';
import * as MathG from '../lib/MathG.js';
import { Const } from '../constants/Const.js';

export class ProjectBox extends HTMLElement {

    // ==================================== FIELDS ==================================== 
    pinElementsArray;

    // ========================== STATIC   ===========================

    static pinsArray = null;
    // ================================= CONSTRUCTOR ==================================
    constructor() {
        super();
        this.initialise();
    }

    // =========================== INITIALISATION FUNCTIONS ===========================

    initialise() {

        this.pinElementsArray = [
            this.createPin(Const.ANDROID),
            this.createPin(Const.ASEPRITE),
            this.createPin(Const.BLENDER),
            this.createPin(Const.CSHARP),
            this.createPin(Const.CSS),
            this.createPin(Const.EXCEL),
            this.createPin(Const.GDSCRIPT),
            this.createPin(Const.GIT),
            this.createPin(Const.GITHUB),
            this.createPin(Const.GODOT),
            this.createPin(Const.GLSL),
            this.createPin(Const.HTML),
            this.createPin(Const.IMOGEN_LAY),
            this.createPin(Const.INTELLIJ),
            this.createPin(Const.JAVA),
            this.createPin(Const.JAVASCRIPT),
            this.createPin(Const.KRITA),
            this.createPin(Const.MINECRAFT),
            this.createPin(Const.OCULUS),
            this.createPin(Const.OPEN_GL),
            this.createPin(Const.PHOTOSHOP),
            this.createPin(Const.PHP),
            this.createPin(Const.REACT),
            this.createPin(Const.SASS),
            this.createPin(Const.TYPESCRIPT),
            this.createPin(Const.UNITY),
            this.createPin(Const.VISUAL_STUDIO_CODE),
            this.createPin(Const.VISUAL_STUDIO),
            this.createPin(Const.WYSCI)
        ];

        for (let i = 0; i < this.pinElementsArray.length; i++)
            this.append(this.pinElementsArray[i]);
    }

    createPin(name) {
        const pinData = this.getPinData(name);
        const pin = document.createElement("div");
        const img = ElementG.createImg("./public/svg/" + pinData.img + ".svg", pinData.img);
        const p = ElementG.createSpecific("p", "", pinData.name);

        const h = pinData.hue;
        const s = pinData.sat;
        const l = pinData.light;
        const pinBackgroundColor = "oklab(from hsl(" + h + " " + s + " " + l + ") l a b)";
        pin.style.backgroundColor = pinBackgroundColor;

        pin.append(img, p);
        return pin;
    }

    getPinData(name) {

        // Generate the pins array if it doesn't already exist.
        this.initaliseStaticPinsArray()

        // Get a pin from the existing list.
        let pin = null;
        for (let i = 0; i < ProjectBox.pinsArray.length; i++)
            if (ProjectBox.pinsArray[i].name === name)
                pin = ProjectBox.pinsArray[i];

        // If a pin hasn't been found, then create an empty one.
        if (pin === null)
            pin = { name: name, img: "", hue: -1, sat: -1, light: -1 };

        // If there is no hue set, this generates a deterministic random number from name.
        // That number is then used as the hue.
        if (pin.hue < 0) {
            pin.hue = name.length;
            for (let i = 0; i < name.length; i++)
                pin.hue += name.charCodeAt(i) * 71.1734609;

            pin.hue = MathG.floor(pin.hue % 360);
        }

        // Set default saturation and light values.
        if (pin.sat < 0)
            pin.sat = Const.DEFAULT_SATURATION;
        if (pin.light < 0)
            pin.light = Const.DEFAULT_LIGHT;

        return pin;
    }

    initaliseStaticPinsArray() {
        if (ProjectBox.pinsArray === null)
            ProjectBox.pinsArray = [
                {
                    name: Const.ANDROID,
                    img: "android",
                    hue: 90,
                    sat: 40,
                    light: -1,
                },
                {
                    name: Const.ASEPRITE,
                    img: "aseprite",
                    hue: 355,
                    sat: 10,
                    light: 85,
                },
                {
                    name: Const.BLENDER,
                    img: "blender",
                    hue: 20,
                    sat: 90,
                    light: -1,
                },
                {
                    name: Const.CSHARP,
                    img: "csharp",
                    hue: 300,
                    sat: -1,
                    light: 40,
                },
                {
                    name: Const.CSS,
                    img: "css",
                    hue: 200,
                    sat: 30,
                    light: 60,
                },
                {
                    name: Const.EXCEL,
                    img: "excel",
                    hue: 100,
                    sat: -1,
                    light: 35,
                },
                {
                    name: Const.GDSCRIPT,
                    img: "gdscript",
                    hue: 180,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.GIT,
                    img: "git",
                    hue: 340,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.GITHUB,
                    img: "github",
                    hue: 280,
                    sat: -1,
                    light: 40,
                },
                {
                    name: Const.GLSL,
                    img: "glsl",
                    hue: 210,
                    sat: 40,
                    light: 40,
                },
                {
                    name: Const.GODOT,
                    img: "godot",
                    hue: 200,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.HTML,
                    img: "html",
                    hue: 25,
                    sat: 70,
                    light: -1,
                },
                {
                    name: Const.IMOGEN_LAY,
                    img: "il",
                    hue: 280,
                    sat: 80,
                    light: 30,
                },
                {
                    name: Const.INTELLIJ,
                    img: "intellij-idea",
                    hue: 0,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.JAVA,
                    img: "java",
                    hue: 190,
                    sat: 50,
                    light: 30,
                },
                {
                    name: Const.JAVASCRIPT,
                    img: "javascript",
                    hue: 50,
                    sat: 80,
                    light: -1,
                },
                {
                    name: Const.KRITA,
                    img: "krita",
                    hue: 320,
                    sat: -1,
                    light: 65,
                },
                {
                    name: Const.MINECRAFT,
                    img: "minecraft",
                    hue: 80,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.OCULUS,
                    img: "oculus",
                    hue: 50,
                    sat: 10,
                    light: 80,
                },
                {
                    name: Const.OPEN_GL,
                    img: "open-gl",
                    hue: 200,
                    sat: -1,
                    light: 30,
                },
                {
                    name: Const.PHOTOSHOP,
                    img: "photoshop",
                    hue: 240,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.PHP,
                    img: "php",
                    hue: 220,
                    sat: 40,
                    light: -1,
                },
                {
                    name: Const.REACT,
                    img: "react",
                    hue: 200,
                    sat: 100,
                    light: -1,
                },
                {
                    name: Const.SASS,
                    img: "sass",
                    hue: 320,
                    sat: 40,
                    light: -1,
                },
                {
                    name: Const.TYPESCRIPT,
                    img: "typescript",
                    hue: 220,
                    sat: 100,
                    light: 60,
                },
                {
                    name: Const.UNITY,
                    img: "unity",
                    hue: 205,
                    sat: 20,
                    light: 80,
                },
                {
                    name: Const.VISUAL_STUDIO_CODE,
                    img: "visual-studio-code",
                    hue: 200,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.VISUAL_STUDIO,
                    img: "visual-studio",
                    hue: 270,
                    sat: -1,
                    light: -1,
                },
                {
                    name: Const.WYSCI,
                    img: "wysci",
                    hue: 0,
                    sat: -1,
                    light: -1,
                },
            ];
    }
}