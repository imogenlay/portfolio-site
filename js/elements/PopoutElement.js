import * as MathG from '../lib/MathG.js';
import * as ElementG from '../lib/ElementG.js';

export class PopoutElement extends HTMLElement {

    popoutParent
    popoutChild;
    popoutButton;
    svg;
    popoutPlaceholder;

    constructor(_child, _widthSetting) {
        super();

        this.popoutChild = _child;
        const NS = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(NS, "svg");
        this.svg.setAttribute("viewBox", "0 0 100 100");
        const path0 = document.createElementNS(NS, "path");
        const path1 = document.createElementNS(NS, "path");

        const L = 16.66667

        const path0Array = [
            "M", 50, 0,
            "L", 100, 0,
            "L", 100, 50,
            "L", L * 5, L * 2,
            "L", L * 4, L * 3,
            "L", L * 3, L * 2,
            "L", L * 4, L,
            "Z"];

        const path1Array = [
            "M", 0, 50,
            "L", 0, 100,
            "L", 50, 100,
            "L", L * 2, L * 5,
            "L", L * 3, L * 4,
            "L", L * 2, L * 3,
            "L", L, L * 4,
            "Z"];

        path0.setAttribute("d", path0Array.join(" "));
        path1.setAttribute("d", path1Array.join(" "));
        this.popoutPlaceholder = document.createElement("div");
        this.popoutParent = document.createElement("div");
        this.popoutPlaceholder.style.display = "none";

        this.popoutButton = document.createElement("button");
        this.svg.append(path0, path1);
        this.popoutButton.append(this.svg);
        this.popoutParent.append(this.popoutChild, this.popoutButton);

        this.append(this.popoutParent, this.popoutPlaceholder);

        this.popoutParent.classList.add("popout-parent");
        this.popoutPlaceholder.classList.add("popout-placeholder");

        this.popoutButton.addEventListener("mouseenter", () => { this.popoutParent.classList.add("popout-hover"); });
        this.popoutButton.addEventListener("mouseleave", () => { this.killQuery("popout-hover"); });

        this.popoutButton.addEventListener("click", () => {

            const isPopped = this.popoutParent.classList.contains("popped");

            if (!isPopped) {
                this.popoutPlaceholder.style.width = this.popoutParent.offsetWidth + "px";
                this.popoutPlaceholder.style.height = this.popoutParent.offsetHeight + "px";
                this.popoutPlaceholder.style.display = "block";
            }
            else {

                this.popoutPlaceholder.style.display = "none";
            }

            this.killQuery("popped");

            if (!isPopped)
                this.popoutParent.classList.add("popped");
        });
    }

    killQuery(className) {
        const popouts = document.querySelectorAll("." + className);
        for (let i = 0; i < popouts.length; i++)
            popouts[i].classList.remove(className);
    }
}