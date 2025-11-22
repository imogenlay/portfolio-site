import { ProjectBox } from './elements/ProjectBox.js';
import * as ElementG from './lib/ElementG.js';
import * as MathG from './lib/MathG.js';

export class PageBuilder {

	// ==================================== FIELDS ==================================== 
	header; main; navbar;
	navbarElements;
	pageElements;

	// ================================== CONSTANTS ===================================
	CURRENT_PAGE_KEY = "currentPage";

	// ================================= CONSTRUCTOR ==================================
	constructor(_header, _main) {
		this.header = _header;
		this.main = _main;
	}

	// =========================== INITIALISATION FUNCTIONS ===========================

	initialise() {
		this.appendTitleElementsAndCreateNavbar();
		this.createAndAppendNavbarElementsArray();
		this.createAndConnectPageElementsArray();
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

	createAndAppendNavbarElementsArray() {
		// Create nav bar buttons and subtitles.
		this.navbarElements = [
			ElementG.createSpecific("button", "nav-button", "Home"),
			ElementG.createSpecific("button", "nav-button", "About"),
			ElementG.createSpecific("button", "nav-button", "Skills"),
			ElementG.createSpecific("button", "nav-button", "Contact"),
			this.createNavbarDivider("Projects"),
			ElementG.createSpecific("button", "nav-button", "Project A"),
			this.createNavbarDivider("Other"),
			ElementG.createSpecific("button", "nav-button", "Sub Heading Generator"),
		];

		for (let i = 0; i < this.navbarElements.length; i++)
			this.navbar.append(this.navbarElements[i]);
	}

	createAndConnectPageElementsArray() {
		// Create pages: Have to be in same order as nab buttons. 
		this.pageElements = [
			this.generateHomePage(),
			this.generateAboutPage(),
			ElementG.createSpecific("section", "", "Skills"),
			this.generateContactPage(),
			ElementG.createSpecific("section", "", "Projects"),
			this.generateSubHeadingGenerator(),
		];

		// Append nav buttons and add click funtionality.
		let currentPageIndex = 0;
		for (let i = 0; i < this.navbarElements.length; i++) {

			if (ElementG.isTag(this.navbarElements[i], "button")) {
				// This variable must be passed by value to a new variable to save it.
				let j = currentPageIndex;

				this.navbarElements[i].addEventListener('click', () => this.switchToPage(j));
				++currentPageIndex;
			}
		}

		// Lookup the last page visited but just go to home if there is none.
		let lastPage = localStorage.getItem(this.CURRENT_PAGE_KEY);
		lastPage = MathG.clamp(MathG.floorToInt(lastPage), 0, this.pageElements.length - 1);
		this.switchToPage(lastPage)
	}

	// =========================== PAGE GENERATOR FUNCTIONS ===========================

	generateHomePage() {
		const section = document.createElement("section");
		const textA = ElementG.createParagraph([
			"A detail-oriented ",
			"Software Developer",
			" with 7 years of experience designing and building innovative solutions. Prioritises ",
			"readable, maintainable",
			" and ",
			"performant",
			" code to maximise usability and manoeuvrability for teams during development."
		]);

		section.appendChild(textA);
		return section;
	}

	generateAboutPage() {
		const section = document.createElement("section");
		section.append(ElementG.createSpecific("p", "", "about me"));
		const projectBox = new ProjectBox();
		section.append(projectBox);
		return section;
	}

	generateSubHeadingGenerator() {

		const section = document.createElement("section");
		const input = document.createElement("input");
		const p = document.createElement("p");
		const button = ElementG.createSpecific("button", "heading-generator", "Convert to sub-heading");

		button.onclick = () => {

			const MAX_CHARACTERS = 80;
			let text = input.value.toUpperCase().trim();
			let output = "// ";
			let charactersRemaining = MAX_CHARACTERS;
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
		};

		section.append(input, button, p);
		return section;
	}

	generateContactPage() {
		const section = ElementG.createSpecific("section", "", "");
		const form = ElementG.createSpecific("form", "", "");
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

	// =============================== OTHER FUNCTIONS ================================

	switchToPage(pageIndex) {

		main.innerHTML = "";
		main.append(this.pageElements[pageIndex]);

		// Save selected page to local memory.
		localStorage.setItem(this.CURRENT_PAGE_KEY, pageIndex);

		let j = 0;
		for (let i = 0; i < this.navbarElements.length; i++) {
			const element = this.navbarElements[i];
			element.classList.remove('active');

			if (ElementG.isTag(element, "button")) {
				if (j === pageIndex)
					element.classList.add('active');
				++j;
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
}