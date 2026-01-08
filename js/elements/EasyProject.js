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
    dropdown;
    isOpened = false;

    constructor(_title) {
        super();
        this.title = _title;
        this.createLayout();
        this.createDropdown();
    }

    createLayout() {

        const heading = ElementG.createSpecific("h3", "", this.title);
        this.article = document.createElement("article");
        this.details = ElementG.createSpecific("div", "details", "");
        this.description = ElementG.createSpecific("p", "", "No description.");
        this.pinsBox = new ProjectBox();

        this.append(this.article);
        this.article.append(heading, this.details, this.pinsBox);
        this.details.append(this.description);
    }

    createDropdown() {
        this.dropdown = ElementG.createImg("./public/svg/dropdown_a.svg");
        this.dropdown.classList.add("dropdown");
        this.append(this.dropdown);

        const forceOpen = () => {
            this.classList.add("expand");
            this.dropdown.src = "./public/svg/dropdown_b.svg";
            this.isOpened = true;
        }

        this.dropdown.onclick = () => {
            if (this.isOpened) {

                console.log("close  dropdown ", this.isOpened);
                this.classList.remove("expand");
                this.dropdown.src = "./public/svg/dropdown_a.svg";
                this.isOpened = false;
            }
            else {
                console.log("open dropdown ", this.isOpened);
                forceOpen();
            }
        }

        /*this.onclick = () => {
            if (!this.isOpened) {
                console.log("open whole");
                forceOpen();
            }
        }*/
    }

    addDescription(text) {
        this.description.textContent = text;
    }

    addPins(...names) {
        this.pinsBox.addPins(names);
    }

    addLink(text, href) {
        const link = document.createElement("a");
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