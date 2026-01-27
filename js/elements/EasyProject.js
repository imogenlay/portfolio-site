import * as ElementG from '../lib/ElementG.js';
import * as MathG from '../lib/MathG.js';
import * as CheckG from '../lib/CheckG.js';
import { ProjectBox } from './ProjectBox.js';
import { Const } from '../constants/Const.js';

export class EasyProject extends HTMLElement {

    title;
    details; description;
    pinsBox;
    isOpened = false;
    titlePins;

    constructor(_title) {
        super();
        this.title = _title;
        this.createLayout();
    }

    createLayout() {
        // Create heading.
        const hgroup = document.createElement("hgroup");
        const hgroupTitle = ElementG.createSpecific("div", "title-text", "");
        this.titlePins = ElementG.createSpecific("div", "title-pins", "");
        hgroup.append(hgroupTitle, this.titlePins);

        const heading = ElementG.createSpecific("h3", "", this.title);
        this.id = this.title.toLowerCase().replaceAll(" ", "-");
        const dropdownIcon = ElementG.createImg("./public/svg/dropdown_a.svg", "dropdown");
        hgroupTitle.append(heading, dropdownIcon);

        // Create article.
        const article = document.createElement("article");
        this.details = ElementG.createSpecific("div", "details-easy-project", "");
        this.description = ElementG.createSpecific("p", "", "No description.");
        this.pinsBox = new ProjectBox();

        this.append(article);
        article.append(hgroup, this.details, this.pinsBox);
        this.details.append(this.description);

        // Attach dropdown behaviour.
        const forceOpen = () => {
            localStorage.setItem(Const.PROJECT_INTERACT, this.title);

            this.classList.add("expand-easy-project");
            dropdownIcon.src = "./public/svg/dropdown_b.svg";
            this.isOpened = true;
        }

        const forceClose = () => {
            this.classList.remove("expand-easy-project");
            dropdownIcon.src = "./public/svg/dropdown_a.svg";
            this.isOpened = false;
        }

        hgroupTitle.onclick = () => {
            if (this.isOpened)
                forceClose();
            else
                forceOpen();
        }

        if (this.title === localStorage.getItem(Const.PROJECT_INTERACT))
            forceOpen();
        else
            forceClose();
    }

    addDescription(text) {
        this.description.textContent = text;
    }

    addPins(...names) {
        this.pinsBox.addPins(names);
    }

    addTitlePins(...names) {
        for (let i = 0; i < names.length; i++) {
            const image = ProjectBox.getPinSource(names[i]).img;

            if (image) {
                const img = ElementG.createImg("./public/svg/" + image + ".svg", image);
                this.titlePins.append(img);
            }
        }
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