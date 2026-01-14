import * as ElementG from '../lib/ElementG.js';
import * as MathG from '../lib/MathG.js';
import * as CheckG from '../lib/CheckG.js';
import { ProjectBox } from './ProjectBox.js';
import { Const } from '../constants/Const.js';

export class EasyProject extends HTMLElement {

    title;
    article;
    details; description;
    pinsBox;
    isOpened = false;
    dropdownIcon;

    constructor(_title) {
        super();
        this.title = _title;
        this.createLayout();
        this.createDropdown();
    }

    createLayout() {

        const heading = ElementG.createSpecific("h3", "", this.title);
        this.article = document.createElement("article");
        this.details = ElementG.createSpecific("div", "details-easy-project", "");
        this.description = ElementG.createSpecific("p", "", "No description.");
        this.pinsBox = new ProjectBox();

        this.append(this.article);
        this.article.append(heading, this.details, this.pinsBox);
        this.details.append(this.description);
    }

    createDropdown() {
        const dropdown = ElementG.createSpecific("div", "dropdown", "");
        this.dropdownIcon = ElementG.createImg("./public/svg/dropdown_a.svg");

        this.append(dropdown);
        dropdown.append(this.dropdownIcon);

        dropdown.onclick = () => {
            if (this.isOpened) {
                this.classList.remove("expand-easy-project");
                this.dropdownIcon.src = "./public/svg/dropdown_a.svg";
                this.isOpened = false;
            }
            else
                this.forceOpen();
        }

        if (this.title === localStorage.getItem(Const.PROJECT_INTERACT))
            this.forceOpen();
    }

    forceOpen() {
        this.classList.add("expand-easy-project");
        this.dropdownIcon.src = "./public/svg/dropdown_b.svg";
        this.isOpened = true;
        localStorage.setItem(Const.PROJECT_INTERACT, this.title);
    }

    addDescription(text) {
        this.description.textContent = text;
    }

    addPins(...names) {
        this.pinsBox.addPins(names);
    }

    addLink(text, href) {
        const link = ElementG.createSpecific("a", "", "");
        link.href = href;

        // Create GitHub Icon 
        if ((text + href).toLowerCase().includes("github")) {
            const icon = ElementG.createImg("./public/svg/github_link.svg", "github");
            link.append(icon);
        }

        // Create Preview Icon 
        if ((text + href).toLowerCase().includes("view")) {
            const icon = ElementG.createImg("./public/svg/live_preview.svg", "live");
            link.append(icon);
        }

        link.append(text);
        this.details.append(link);
    }
}