import { User } from './User.js';
import * as Check from './lib/Check.js';
import * as MathG from './lib/MathG.js';
import * as ElementG from './lib/ElementG.js';

const header = document.getElementById("header");
const main = document.getElementById("main");
const CURRENT_PAGE_KEY = "currentPage";

initialise();

function initialise() {
	// Create main name title and underline divider.
	const imogenLayTitle = ElementG.createSpecific("h1", "", "Imogen Lay");
	const hrTitle = ElementG.createSpecific("hr", "title", "");
	const navbar = ElementG.createSpecific("nav", "", "");

	// Append elements!!
	header.append(imogenLayTitle);
	header.append(hrTitle);
	header.append(navbar);

	// Create nav bar buttons.
	const allNavButtons = [
		ElementG.createSpecific("button", "nav-button", "Home"),
		ElementG.createSpecific("button", "nav-button", "About"),
		ElementG.createSpecific("button", "nav-button", "Contact"),
	];

	// Create pages: Have to be in same order as nab buttons. 
	const allPages = [
		generateHomePage(),
		ElementG.createSpecific("p", "", "About"),
		generateContactPage(),
	];

	// Switch to page function.
	function switchToPage(pageIndex) {

		main.innerHTML = "";
		main.append(allPages[pageIndex]);

		// Save selected page to local memory.
		localStorage.setItem(CURRENT_PAGE_KEY, pageIndex);

		allNavButtons.forEach(b => b.classList.remove('active'));
		allNavButtons[pageIndex].classList.add('active');
	}

	// Append nav buttons and add click funtionality.
	for (let i = 0; i < allNavButtons.length; i++) {
		navbar.append(allNavButtons[i]);
		allNavButtons[i].addEventListener('click', () => switchToPage(i));
	}

	// Lookup the last page visited but just go to home if there is none.
	let lastPage = localStorage.getItem(CURRENT_PAGE_KEY);
	lastPage = MathG.clamp(MathG.floorToInt(lastPage), 0, allPages.length - 1);
	switchToPage(lastPage)
}

function generateHomePage() {
	const section = ElementG.createSpecific("section", "", "");
	const lorum = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. "
	const output = lorum + lorum + lorum + lorum;

	for (let i = 0; i < 12; i++) {
		section.append(ElementG.createSpecific("p", "", output));
	}
	return section;
}

function generateContactPage() {
	const section = ElementG.createSpecific("section", "", "");
	section.append(createContactForm());
	return section;
}

function createContactForm() {
	const form = ElementG.createSpecific("form", "", "");
	form.action = "./sent.html";

	// Full Name
	form.append(ElementG.createInput("Name", {
		name: "name",
		type: "text",
		minlength: "1",
		maxlength: "50",
		required: ""
	}));

	// Email Address
	form.append(ElementG.createInput("Email", {
		type: "email",
		minlength: "1",
		maxlength: "50",
		name: "email",
		required: ""
	}));

	const select = ElementG.createSelect("Cate", "category");
	ElementG.appendOption(select, { value: "", text: "Please choose an option", disabled: true, selected: true });
	ElementG.appendOption(select, { value: "bookings", text: "Bookings" });
	ElementG.appendOption(select, { value: "online-orders", text: "Online orders" });
	ElementG.appendOption(select, { value: "complaints", text: "Complaints" });

	form.append(select);

	// Category (select)
	/*const categoryDiv = document.createElement("div");
	const categoryLabel = document.createElement("label");
	categoryLabel.textContent = "Category";
	const select = document.createElement("select");
	select.name = "category";
	select.required = true;

	const options = [
		{ value: "", text: "Please choose an option", disabled: true, selected: true, className: "contact__disabled-select" },
		{ value: "bookings", text: "Bookings" },
		{ value: "online-orders", text: "Online orders" },
		{ value: "complaints", text: "Complaints" },
	];

	options.forEach(opt => {
		const option = document.createElement("option");
		option.value = opt.value;
		option.textContent = opt.text;
		if (opt.disabled) option.disabled = true;
		if (opt.selected) option.selected = true;
		if (opt.className) option.className = opt.className;
		select.appendChild(option);
	});

	categoryDiv.append(categoryLabel, select);
	form.appendChild(categoryDiv);*/

	// Message (textarea)
	const messageDiv = document.createElement("div");
	const messageLabel = document.createElement("label");
	messageLabel.textContent = "Message";
	const textarea = document.createElement("textarea");
	textarea.name = "message";
	textarea.placeholder = "Enter your message here!";
	textarea.required = true;
	messageDiv.append(messageLabel, textarea);
	form.appendChild(messageDiv);

	// Submit button
	const submitDiv = document.createElement("div");
	const p = document.createElement("p");
	const submitInput = document.createElement("input");
	submitInput.type = "submit";
	submitInput.value = "Send";
	submitDiv.append(p, submitInput);
	form.appendChild(submitDiv);

	return form;
}

