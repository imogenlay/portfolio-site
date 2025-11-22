import * as ElementG from '../lib/ElementG.js';
import * as MathG from '../lib/MathG.js';

export class ProjectBox extends HTMLElement {

    // ==================================== FIELDS ==================================== 
    pinElementsArray;

    // ========================== STATIC FIELDS & CONSTANTS ===========================

    static pinsArray = null;

    static DEFAULT_SATURATION = 60;
    static DEFAULT_LIGHT = 50;

    static ANDROID = "Android";
    static ASEPRITE = "Aseprite";
    static BLENDER = "Blender";
    static CSHARP = "C#";
    static CSS = "CSS";
    static EXCEL = "Excel";
    static GDSCRIPT = "GDScript";
    static GIT = "Git";
    static GITHUB = "GitHub";
    static GODOT = "Godot";
    static GLSL = "GLSL";
    static HTML = "HTML";
    static IMOGEN_LAY = "Imogen";
    static INTELLIJ = "IntelliJ IDEA";
    static JAVA = "Java";
    static JAVASCRIPT = "JavaScript";
    static KRITA = "Krita";
    static MINECRAFT = "Minecraft";
    static OCULUS = "Oculus";
    static OPEN_GL = "OpenGL";
    static PHOTOSHOP = "PhotoShop";
    static PHP = "PHP";
    static REACT = "React";
    static SASS = "SASS";
    static TYPESCRIPT = "TypeScript";
    static UNITY = "Unity";
    static VISUAL_STUDIO_CODE = "Visual Studio Code";
    static VISUAL_STUDIO = "Visual Studio";
    static WYSCI = "Wysci";

    // ================================= CONSTRUCTOR ==================================
    constructor() {
        super();
        this.initialise();
    }

    // =========================== INITIALISATION FUNCTIONS ===========================

    initialise() {

        this.pinElementsArray = [




            this.createPin(ProjectBox.ANDROID),
            this.createPin(ProjectBox.ASEPRITE),
            this.createPin(ProjectBox.BLENDER),
            this.createPin(ProjectBox.CSHARP),
            this.createPin(ProjectBox.CSS),
            this.createPin(ProjectBox.EXCEL),
            this.createPin(ProjectBox.GDSCRIPT),
            this.createPin(ProjectBox.GIT),
            this.createPin(ProjectBox.GITHUB),
            this.createPin(ProjectBox.GODOT),
            this.createPin(ProjectBox.GLSL),
            this.createPin(ProjectBox.HTML),
            this.createPin(ProjectBox.IMOGEN_LAY),
            this.createPin(ProjectBox.INTELLIJ),
            this.createPin(ProjectBox.JAVA),
            this.createPin(ProjectBox.JAVASCRIPT),
            this.createPin(ProjectBox.KRITA),
            this.createPin(ProjectBox.MINECRAFT),
            this.createPin(ProjectBox.OCULUS),
            this.createPin(ProjectBox.OPEN_GL),
            this.createPin(ProjectBox.PHOTOSHOP),
            this.createPin(ProjectBox.PHP),
            this.createPin(ProjectBox.REACT),
            this.createPin(ProjectBox.SASS),
            this.createPin(ProjectBox.TYPESCRIPT),
            this.createPin(ProjectBox.UNITY),
            this.createPin(ProjectBox.VISUAL_STUDIO_CODE),
            this.createPin(ProjectBox.VISUAL_STUDIO),
            this.createPin(ProjectBox.WYSCI)
        ];

        for (let i = 0; i < this.pinElementsArray.length; i++) {
            this.append(this.pinElementsArray[i]);
        }
    }

    hslToOklab(h, s, l) {
        return "oklab(from hsl(" + h + " " + s + " " + l + ") l a b)";
    }

    hslaToOklab(h, s, l, a) {
        return "oklab(from hsl(" + h + " " + s + " " + l + ") l a b / " + a + ")";
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
        //`oklab(${h} ${s}% ${l} / 1)`
        //this.hslToOklab(pinData.hue, pinData.saturation, pinData.light);
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
            pin.sat = ProjectBox.DEFAULT_SATURATION;
        if (pin.light < 0)
            pin.light = ProjectBox.DEFAULT_LIGHT;

        return pin;
    }

    initaliseStaticPinsArray() {
        if (ProjectBox.pinsArray === null)
            ProjectBox.pinsArray = [
                {
                    name: ProjectBox.ANDROID,
                    img: "android",
                    hue: 90,
                    sat: 40,
                    light: -1,
                },
                {
                    name: ProjectBox.ASEPRITE,
                    img: "aseprite",
                    hue: 355,
                    sat: 10,
                    light: 85,
                },
                {
                    name: ProjectBox.BLENDER,
                    img: "blender",
                    hue: 20,
                    sat: 90,
                    light: -1,
                },
                {
                    name: ProjectBox.CSHARP,
                    img: "csharp",
                    hue: 300,
                    sat: -1,
                    light: 40,
                },
                {
                    name: ProjectBox.CSS,
                    img: "css",
                    hue: 200,
                    sat: 30,
                    light: 60,
                },
                {
                    name: ProjectBox.EXCEL,
                    img: "excel",
                    hue: 100,
                    sat: -1,
                    light: 35,
                },
                {
                    name: ProjectBox.GDSCRIPT,
                    img: "gdscript",
                    hue: 180,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.GIT,
                    img: "git",
                    hue: 340,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.GITHUB,
                    img: "github",
                    hue: 280,
                    sat: -1,
                    light: 40,
                },
                {
                    name: ProjectBox.GLSL,
                    img: "glsl",
                    hue: 210,
                    sat: 40,
                    light: 40,
                },
                {
                    name: ProjectBox.GODOT,
                    img: "godot",
                    hue: 200,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.HTML,
                    img: "html",
                    hue: 25,
                    sat: 70,
                    light: -1,
                },
                {
                    name: ProjectBox.IMOGEN_LAY,
                    img: "il",
                    hue: 280,
                    sat: 80,
                    light: 30,
                },
                {
                    name: ProjectBox.INTELLIJ,
                    img: "intellij-idea",
                    hue: 0,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.JAVA,
                    img: "java",
                    hue: 190,
                    sat: 50,
                    light: 30,
                },
                {
                    name: ProjectBox.JAVASCRIPT,
                    img: "javascript",
                    hue: 50,
                    sat: 80,
                    light: -1,
                },
                {
                    name: ProjectBox.KRITA,
                    img: "krita",
                    hue: 320,
                    sat: -1,
                    light: 65,
                },
                {
                    name: ProjectBox.MINECRAFT,
                    img: "minecraft",
                    hue: 80,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.OCULUS,
                    img: "oculus",
                    hue: 50,
                    sat: 10,
                    light: 80,
                },
                {
                    name: ProjectBox.OPEN_GL,
                    img: "open-gl",
                    hue: 200,
                    sat: -1,
                    light: 30,
                },
                {
                    name: ProjectBox.PHOTOSHOP,
                    img: "photoshop",
                    hue: 240,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.PHP,
                    img: "php",
                    hue: 220,
                    sat: 40,
                    light: -1,
                },
                {
                    name: ProjectBox.REACT,
                    img: "react",
                    hue: 200,
                    sat: 100,
                    light: -1,
                },
                {
                    name: ProjectBox.SASS,
                    img: "sass",
                    hue: 300,
                    sat: 40,
                    light: -1,
                },
                {
                    name: ProjectBox.TYPESCRIPT,
                    img: "typescript",
                    hue: 220,
                    sat: 100,
                    light: 60,
                },
                {
                    name: ProjectBox.UNITY,
                    img: "unity",
                    hue: 205,
                    sat: 20,
                    light: 80,
                },
                {
                    name: ProjectBox.VISUAL_STUDIO_CODE,
                    img: "visual-studio-code",
                    hue: 200,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.VISUAL_STUDIO,
                    img: "visual-studio",
                    hue: 270,
                    sat: -1,
                    light: -1,
                },
                {
                    name: ProjectBox.WYSCI,
                    img: "wysci",
                    hue: 0,
                    sat: -1,
                    light: -1,
                },
            ];
    }
}