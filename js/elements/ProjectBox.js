import * as ElementG from '../lib/ElementG.js';
import * as MathG from '../lib/MathG.js';
import * as CheckG from '../lib/CheckG.js';
import { Const } from '../constants/Const.js';

export class ProjectBox extends HTMLElement {

	// ==================================== FIELDS ==================================== 
	pinElementsArray;

	// ================================ STATIC FIELDS =================================
	static pinsArray = null;

	// ================================= CONSTRUCTOR ==================================
	constructor() {
		super();
		// Generate the pins array if it doesn't already exist.
		ProjectBox.initialiseStaticPinsArray();
	}

	// =========================== INITIALISATION FUNCTIONS ===========================

	addPins(...names) {
		if (names.length === 0)
			return;

		if (Array.isArray(names[0]))
			names = names[0];

		for (let i = 0; i < names.length; i++)
			this.append(this.createPin(names[i]));
	}

	addAllPins() {
		for (let i = 0; i < ProjectBox.pinsArray.length; i++) {
			const pin = ProjectBox.pinsArray[i].name;
			this.addPins(pin);
		}
	}

	addAllSkillsPins() {
		const skillsPins = ProjectBox.pinsArray.filter((p) =>
			p.name !== Const.IMOGEN_LAY &&
			p.name !== Const.MINECRAFT &&
			p.name !== Const.PHP);
		for (let i = 0; i < skillsPins.length; i++)
			this.addPins(skillsPins[i].name);
	}

	createPin(name) {
		const pinData = this.getPinData(name);
		const pin = document.createElement("div");
		let img = null;
		if (CheckG.isStringWithValue(pinData.img))
			img = ElementG.createImg("./public/svg/" + pinData.img + ".svg", pinData.img);
		else
			img = document.createElement("figure");
		/*img.style.width = "32px";
		img.style.height = "32px";*/

		const p = ElementG.createSpecific("p", "", pinData.name);

		const h = pinData.hue;
		const s = pinData.sat;
		const l = pinData.light;
		const g = 5; // Gradient amount;

		function oklab(_g) { return "oklab(from hsl(" + h + " " + s + " " + (l + _g) + ") l a b)" }

		const colorA = oklab(+g);
		const colorB = oklab(-g);
		pin.style.background = `linear-gradient(170deg, ${colorA} 10%, ${colorB} 80%)`;

		pin.append(img, p);
		return pin;
	}

	getPinData(name) {
		// Get a pin from the existing list.
		let pin = null;
		if (!CheckG.isString(name))
			name = "not a string";

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

	static getPinSource(name) {
		ProjectBox.initialiseStaticPinsArray();
		for (let i = 0; i < ProjectBox.pinsArray.length; i++)
			if (ProjectBox.pinsArray[i].name === name)
				return ProjectBox.pinsArray[i];

		return null;
	}

	static initialiseStaticPinsArray() {
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
					name: Const.AWS,
					img: "aws",
					hue: 30,
					sat: -1,
					light: -1,
				},
				{
					name: Const.BASE_LIFT_ENGINE,
					img: "base_lift_engine",
					hue: 180,
					sat: -1,
					light: 40,
				},
				{
					name: Const.BLAZOR,
					img: "blazor",
					hue: 260,
					sat: -1,
					light: -1,
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
					name: Const.FIREBASE,
					img: "firebase",
					hue: 10,
					sat: -1,
					light: -1,
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
					name: Const.GDSHADER,
					img: "gdshader",
					hue: 250,
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
					hue: 220,
					sat: 100,
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
					name: Const.INKSCAPE,
					img: "inkscape",
					hue: 0,
					sat: 0,
					light: -1,
				},
				{
					name: Const.INTELLIJ,
					img: "intellij_idea",
					hue: 0,
					sat: -1,
					light: -1,
				},
				{
					name: Const.JAVA,
					img: "java",
					hue: 210,
					sat: -1,
					light: 40,
				},
				{
					name: Const.JAVASCRIPT,
					img: "javascript",
					hue: 50,
					sat: 80,
					light: -1,
				},
				{
					name: Const.JEST,
					img: "jest",
					hue: 350,
					sat: 60,
					light: 30,
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
					name: Const.NODE_JS,
					img: "node_js",
					hue: 120,
					sat: 40,
					light: 40,
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
					img: "open_gl",
					hue: 210,
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
					hue: 310,
					sat: 50,
					light: 40,
				},
				{
					name: Const.SPRING_BOOT,
					img: "spring_boot",
					hue: 90,
					sat: 70,
					light: 30,
				},
				{
					name: Const.SQL,
					img: "sql",
					hue: 50,
					sat: -1,
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
					name: Const.VISUAL_BASIC,
					img: "visual_basic",
					hue: 220,
					sat: 30,
					light: -1,
				},
				{
					name: Const.VISUAL_STUDIO_CODE,
					img: "visual_studio_code",
					hue: 200,
					sat: -1,
					light: -1,
				},
				{
					name: Const.VISUAL_STUDIO,
					img: "visual_studio",
					hue: 270,
					sat: -1,
					light: -1,
				},
				{
					name: Const.VITE,
					img: "vite",
					hue: 270,
					sat: 80,
					light: 60,
				},
				{
					name: Const.VITEST,
					img: "vitest",
					hue: 90,
					sat: -1,
					light: 30,
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