import { ProjectBox } from "./elements/ProjectBox.js";
import { Const } from "./constants/Const.js";
import * as ElementG from "./lib/ElementG.js";
import * as MathG from "./lib/MathG.js";
import * as CheckG from "./lib/CheckG.js";

export class PageBuilder {

	// ==================================== FIELDS ====================================

	header; main; foreground; background;
	floatingTitleAnimLerp = 0;
	floatingTitleSpan; floatingTitleUnderlineA; floatingTitleUnderlineB; floatingTitleButton;
	navbar; navbarElements; pageElements;

	fadeInElements = [];
	fadeOutElements = [];

	isFloatingTitleVisible = true;

	// ================================= CONSTRUCTOR ==================================
	constructor(_header, _main, _foreground, _background) {
		this.header = _header;
		this.main = _main;
		this.foreground = _foreground;
		this.background = _background;
	}

	// =========================== INITIALISATION FUNCTIONS ===========================

	initialise() {
		this.appendFloatingTitleAndUnderline();
		this.appendTitleElementsAndCreateNavbar();
		this.createNavbarElementsAndPageElementsArrays();
		this.appendNavbarAndPageElementsArray();
	}

	appendFloatingTitleAndUnderline() {

		// Create title elements.
		this.floatingTitleSpan = ElementG.createSpecific("span", "", "Imogen Lay");
		this.floatingTitleUnderlineA = ElementG.createSpecific("div", "underline", "");
		this.floatingTitleUnderlineB = ElementG.createSpecific("div", "underline", "");
		this.floatingTitleButton = ElementG.createSpecific("button", "", "Continue");

		// Append elements.
		this.foreground.append(this.floatingTitleSpan);
		this.foreground.append(this.floatingTitleButton);
		this.floatingTitleSpan.append(this.floatingTitleUnderlineA, this.floatingTitleUnderlineB);

		// Functions for force-showing/hiding elements.
		function showAll(show, ...array) {
			for (let i = 0; i < array.length; i++) {
				const element = array[i];
				element.style.opacity = show ? 1 : 0;
				element.style.display = show ? "block" : "none";
			}
		}

		// Hide everything.
		showAll(false,
			this.floatingTitleSpan, this.floatingTitleButton,
			this.floatingTitleUnderlineA, this.floatingTitleUnderlineB,
			this.main, this.header);

		// Show some things depending on situation.
		let lastPageVisitTime = Number(localStorage.getItem(Const.LAST_PAGE_VISIT));
		const ONE_DAY_IN_MS = 1;//24 * 60 * 60 * 1000;
		let oneWeekAgo = Date.now() - ONE_DAY_IN_MS;

		if (lastPageVisitTime < oneWeekAgo) {
			// This user hasn't visited for a while.

			showAll(true,
				this.floatingTitleSpan, this.floatingTitleButton,
				this.floatingTitleUnderlineA, this.floatingTitleUnderlineB);
		}
		else {
			showAll(true, this.main, this.header);
			this.isFloatingTitleVisible = false;
		}


		// Add floating title click.
		this.floatingTitleButton.onclick = () => {
			this.isFloatingTitleVisible = false;

			this.beginElementFadeIn(this.header);
			this.beginElementFadeIn(this.main);
			this.beginElementFadeOut(this.floatingTitleSpan);
			this.beginElementFadeOut(this.floatingTitleUnderlineA);
			this.beginElementFadeOut(this.floatingTitleUnderlineB);
			this.beginElementFadeOut(this.floatingTitleButton);
		};

		// Update title path when resizing window.
		addEventListener("resize", (event) => this.updateTitlePathLength());
	}

	appendTitleElementsAndCreateNavbar() {
		// Create main name title and underline divider.
		const imogenLayTitle = ElementG.createSpecific("h1", "", "Imogen Lay");
		const hrTitle = ElementG.createSpecific("hr", "title", "");
		this.navbar = ElementG.createSpecific("nav", "", "");

		// Append elements!!
		this.header.append(imogenLayTitle);
		this.header.append(hrTitle);
		this.header.append(this.navbar);
	}

	createNavbarElementsAndPageElementsArrays() {

		let version = "Ver " + Const.VERSION;
		if (CheckG.isSafari())
			version += " (Safari)";
		else
			version += " (Not Safari)";

		// Create nav bar buttons and section titles.
		this.navbarElements = [
			ElementG.createSpecific("button", "nav-button", "About"),
			ElementG.createSpecific("button", "nav-button", "Skills"),
			ElementG.createSpecific("button", "nav-button", "Contact"),
			this.createNavbarDivider("Projects"),
			ElementG.createSpecific("button", "nav-button", "Mineshaft"),
			ElementG.createSpecific("button", "nav-button", Const.TITLE_CU_CARTA),
			ElementG.createSpecific("button", "nav-button", "Portfolio"),
			this.createNavbarDivider("Other"),
			ElementG.createSpecific("button", "nav-button", "Subheading Generator"),
			this.createNavbarDivider(version),
		];

		// Create pages: Have to be in same order as nav buttons. 
		this.pageElements = [
			this.generateAboutPage(),
			this.generateSkillsPage(),
			this.generateContactPage(),
			this.generateMineshaftPage(),
			this.generateCuCartaPage(),
			this.generatePortfolioPage(),
			this.generateSubHeadingGenerator(),
		];
	}

	appendNavbarAndPageElementsArray() {

		for (let i = 0; i < this.navbarElements.length; i++)
			this.navbar.append(this.navbarElements[i]);

		// Append nav buttons and add click funtionality.
		let currentPageIndex = 0;
		for (let i = 0; i < this.navbarElements.length; i++)
			if (ElementG.isTag(this.navbarElements[i], "button")) {
				// This variable must be passed by value to a new variable to save it.
				let j = currentPageIndex;
				this.navbarElements[i].addEventListener("click", () => this.switchToPage(j));
				++currentPageIndex;
			}

		// Lookup the last page visited but just go to home if there is none.
		let lastPage = localStorage.getItem(Const.CURRENT_PAGE_KEY);
		lastPage = MathG.clamp(MathG.floorToInt(lastPage), 0, this.pageElements.length - 1);
		this.switchToPage(lastPage)
	}

	// =============================== ANIMATION UPDATE ===============================

	updateFloatingTitleAnimation(delta) {
		this.floatingTitleAnimLerp += delta;
		if (this.floatingTitleAnimLerp < 100)
			this.updateTitlePathLength();

		this.makeElementsFadeInAndOut(delta);
	}

	updateTitlePathLength() {

		const PATH_A = 0.000;
		const PATH_B = 0.336;
		const PATH_C = 0.411;
		//const PATH_D = 0.939;
		const PATH_D = 6.0;

		let maxSize = this.floatingTitleSpan.offsetWidth * 1;
		let animLerp = MathG.max(this.floatingTitleAnimLerp - 0.5, 0) * 2;
		animLerp = animLerp * animLerp * animLerp;

		const getWidth = (p0, p1) => {
			let lerp = maxSize * animLerp;
			let pathStart = maxSize * p0;
			let pathEnd = maxSize * p1;
			return MathG.clamp(lerp - pathStart, 0, pathEnd - pathStart);
		}

		// Max width.
		let outputMax = getWidth(PATH_A, PATH_D);

		// Underline A width.
		let outputWidthA = getWidth(PATH_A, PATH_B);
		this.floatingTitleUnderlineA.style.width = outputWidthA + "px";

		// Underline B offset.
		let offset = MathG.floor(PATH_C * maxSize);
		this.floatingTitleUnderlineB.style.left = offset + "px";

		// Underline B width.   
		let outputWidthB = getWidth(PATH_C, PATH_D);
		this.floatingTitleUnderlineB.style.width = outputWidthB + "px";

		this.floatingTitleUnderlineA.style.setProperty("--underline-full-width", MathG.max(outputWidthA, outputMax) + "px");
		this.floatingTitleUnderlineB.style.setProperty("--underline-full-width", outputWidthB + "px");

		if (this.floatingTitleAnimLerp > 1.5 && this.isFloatingTitleVisible)
			this.beginElementFadeIn(this.floatingTitleButton);
	}

	beginElementFadeOut(element) {
		this.fadeInElements = this.fadeInElements.filter((e) => e !== element);
		if (!this.fadeOutElements.includes(element))
			this.fadeOutElements.push(element);
	}

	beginElementFadeIn(element) {
		this.fadeOutElements = this.fadeOutElements.filter((e) => e !== element);
		if (!this.fadeInElements.includes(element))
			this.fadeInElements.push(element);
	}

	makeElementsFadeInAndOut(delta) {
		delta *= 5;

		function genericFadeInOut(array, modifier, removalCallback) {
			for (let i = 0; i < array.length; i++) {
				const element = array[i];
				let newOpacity = Number(element.style.opacity) + delta * modifier;
				if (isNaN(newOpacity))
					newOpacity = 0;

				newOpacity = MathG.clamp(newOpacity, 0, 1);
				element.style.opacity = newOpacity;
				element.style.display = newOpacity > 0 ? "block" : "none";
			}

			return array.filter(removalCallback);
		}

		this.fadeInElements = genericFadeInOut(this.fadeInElements, 1, (e) => Number(e.style.opacity) < 1);
		this.fadeOutElements = genericFadeInOut(this.fadeOutElements, -1, (e) => Number(e.style.opacity) > 0);

	}

	// =========================== PAGE GENERATOR FUNCTIONS ===========================

	generateAboutPage() {
		const section = document.createElement("section");
		const title = ElementG.createSpecific("h2", "", "About Me");
		const textA = ElementG.createParagraph([
			"A detail-oriented ",
			"Software Developer",
			" with 7 years of experience designing and building innovative solutions. Prioritises ",
			"readable, maintainable",
			" and ",
			"performant",
			" code to maximise usability and manoeuvrability for teams during development."
		]);

		const textB = ElementG.createParagraph([
			"Demonstrated adaptability across ",
			"multiple frameworks and languages,",
			" consistently delivering robust applications. Thrives both as an ",
			"independent contributor",
			" and ",
			"team player,",
			" bringing a proven track record of elevating project outcomes through meticulous attention to detail."
		]);

		section.append(title, textA, textB);
		return section;
	}

	generateSkillsPage() {
		const section = document.createElement("section");
		section.append(ElementG.createSpecific("h2", "", "Skills"));
		const projectBox = new ProjectBox();
		projectBox.addAllPins();
		section.append(projectBox);
		return section;
	}

	generateContactPage() {
		const section = document.createElement("section");
		const form = document.createElement("form");
		section.append(ElementG.createSpecific("h2", "", "Contact"));
		section.append(document.createElement("p"));

		form.action = "./sent.html";

		// Name
		form.append(ElementG.createInput("Name", {
			name: "name",
			type: "text",
			minlength: "1",
			maxlength: "50",
			required: ""
		}));

		// Email Address
		form.append(ElementG.createInput("Email", {
			name: "email",
			type: "email",
			minlength: "1",
			maxlength: "50",
			required: ""
		}));

		const fieldSet = document.createElement("fieldset");
		form.append(fieldSet);
		fieldSet.append(ElementG.createInputAlternate("Option A", {
			type: "radio",
			name: "category",
			value: "option-a",
			checked: true
		}));
		fieldSet.append(ElementG.createInputAlternate("Option B", {
			type: "radio",
			name: "category",
			value: "option-b"
		}));

		form.append(ElementG.createTextArea("Message", {
			name: "message",
			minlength: "10",
			required: ""
		}));

		// Submit button
		form.append(ElementG.createInput("", {
			type: "submit",
			value: "Send",
		}));

		section.append(form);
		return section;
	}

	generateMineshaftPage() {
		const section = document.createElement("section");
		section.append(ElementG.createSpecific("h2", "", "Mineshaft"));
		const codeBox = new ProjectBox();
		codeBox.addPins(
			Const.CSHARP,
			Const.BASE_LIFT_ENGINE,
			Const.OPEN_GL,
			Const.GLSL,
			Const.VISUAL_STUDIO,
			Const.VISUAL_STUDIO_CODE,
			Const.ASEPRITE,
			Const.BLENDER,
			Const.GIT,
			Const.GITHUB);

		section.append(codeBox);
		section.append(ElementG.createImg("./public/img/mineshaft_00.png", "mineshaft_00"));
		section.append(ElementG.createImg("./public/img/mineshaft_01.png", "mineshaft_01"));
		section.append(ElementG.createImg("./public/img/mineshaft_02.png", "mineshaft_02"));
		section.append(ElementG.createImg("./public/img/mineshaft_03.png", "mineshaft_03"));
		return section;
	}

	generateCuCartaPage() {
		const section = document.createElement("section");
		section.append(ElementG.createSpecific("h2", "", Const.TITLE_CU_CARTA));
		const codeBox = new ProjectBox();
		codeBox.addPins(
			Const.CSHARP,
			Const.GDSCRIPT,
			Const.GODOT,
			Const.WYSCI,
			Const.VISUAL_STUDIO,
			Const.ASEPRITE,
			Const.KRITA,
			Const.BLENDER,
			Const.GIT,
			Const.GITHUB);

		section.append(codeBox);
		section.append(ElementG.createImg("./public/img/cu_carta_00.png", "cu_carta_00"));
		section.append(ElementG.createImg("./public/img/cu_carta_01.png", "cu_carta_01"));
		section.append(ElementG.createImg("./public/img/cu_carta_02.png", "cu_carta_02"));
		section.append(ElementG.createImg("./public/img/cu_carta_03.png", "cu_carta_03"));
		return section;
	}

	generatePortfolioPage() {

		const section = document.createElement("section");
		section.append(ElementG.createSpecific("h2", "", "Portfolio Site"));
		section.append(ElementG.createSpecific("h3", "", "Heading 3"));
		section.append(ElementG.createSpecific("h4", "", "Heading 4"));
		section.append(ElementG.createSpecific("h5", "", "Heading 5"));

		const otherBox = new ProjectBox();
		otherBox.addPins(
			Const.HTML,
			Const.CSS,
			Const.SASS,
			Const.JAVASCRIPT,
			Const.INKSCAPE,
			Const.VISUAL_STUDIO_CODE,
			Const.GIT,
			Const.GITHUB,
			"Unnamed",
			null,
		);

		section.append(otherBox);
		section.append(ElementG.createSpecific("p", "", "You're looking at it"));
		return section;
	}

	generateSubHeadingGenerator() {

		const section = document.createElement("section");
		const title = ElementG.createSpecific("h2", "", "Subheading Generator");
		const inputTextParent = ElementG.createInput("Text");
		const inputCountParent = ElementG.createInput("Length");

		const inputText = ElementG.findSelfOrFirstOfType(inputTextParent, "input");
		const inputCount = ElementG.findSelfOrFirstOfType(inputCountParent, "input");

		inputText.value = "Write Subheading Here";
		inputCount.value = "80";

		const p = document.createElement("pre");
		const button = ElementG.createSpecific("button", "heading-generator", "Copy to clipboard");

		button.onclick = () => this.createSubHeading(inputText, inputCount, p);

		section.append(title, inputTextParent, inputCountParent, button, p);
		return section;
	}

	// =============================== OTHER FUNCTIONS ================================

	switchToPage(pageIndex) {

		main.innerHTML = "";
		main.append(this.pageElements[pageIndex]);

		// Save selected page to local memory.
		localStorage.setItem(Const.CURRENT_PAGE_KEY, pageIndex);
		localStorage.setItem(Const.LAST_PAGE_VISIT, Date.now());

		let j = 0;
		for (let i = 0; i < this.navbarElements.length; i++) {
			const element = this.navbarElements[i];
			element.classList.remove("recently-selected");
			element.classList.remove("selected");

			if (ElementG.isTag(element, "button")) {
				if (j === pageIndex)
					element.classList.add("recently-selected");
				++j;
			}
		}

		setTimeout(() => this.switchToPageUpdate(), 10);
	}

	switchToPageUpdate() {
		for (let i = 0; i < this.navbarElements.length; i++) {
			const element = this.navbarElements[i];
			if (element.classList.contains("recently-selected")) {
				element.classList.remove("recently-selected");
				element.classList.add("selected");
			}
		}
	}

	createNavbarDivider(text) {
		const div = ElementG.createSpecific("div", "nav-divider", "");
		const hrA = document.createElement("hr");
		const title = ElementG.createSpecific("p", "", text);
		const hrB = document.createElement("hr");

		div.append(hrA, title, hrB);
		return div;
	}

	createSubHeading(inputText, inputCount, p) {
		let text = inputText.value.toUpperCase().trim();
		if (text.length === 0)
			return;

		let output = "// ";
		let charactersRemaining = MathG.floorToInt(inputCount.value);
		charactersRemaining -= text.length + 2;
		let firstSpanLength = 0;
		let lastSpanLength = 0;

		if (charactersRemaining % 2 == 0) {
			firstSpanLength = charactersRemaining / 2;
			lastSpanLength = firstSpanLength;
		} else {
			firstSpanLength = MathG.floor(charactersRemaining / 2);
			lastSpanLength = firstSpanLength + 1;
		}

		output += "=".repeat(firstSpanLength);
		output += " " + text + " ";
		output += "=".repeat(lastSpanLength);

		p.textContent = output;
		navigator.clipboard.writeText(output);
	}
}