import * as MathG from '../lib/MathG.js';
import * as ElementG from '../lib/ElementG.js';

export class PopoutElement extends HTMLElement {

    popoutParent
    popoutChild;
    popoutButton;
    popoutPlaceholder;
    svg; svgPathA; svgPathB;

    static pathExpandA;
    static pathExpandB;
    static pathShrinkA;
    static pathShrinkB;

    constructor(_child) {
        super();
        this.buildStaticPaths();

        this.popoutChild = _child;

        // Create SVG elements.
        const NS = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(NS, "svg");
        this.svg.setAttribute("viewBox", "0 0 100 100");
        this.svgPathA = document.createElementNS(NS, "path");
        this.svgPathB = document.createElementNS(NS, "path");

        this.setIconToExpand(true);
        this.popoutPlaceholder = document.createElement("div");
        this.popoutParent = document.createElement("div");
        this.popoutPlaceholder.style.display = "none";

        this.popoutButton = document.createElement("button");
        this.svg.append(this.svgPathA, this.svgPathB);
        this.popoutButton.append(this.svg);
        this.popoutParent.append(this.popoutChild, this.popoutButton);

        this.append(this.popoutParent, this.popoutPlaceholder);

        this.popoutParent.classList.add("popout-parent");
        this.popoutPlaceholder.classList.add("popout-placeholder");

        this.popoutButton.addEventListener("mouseenter", () => { this.classList.add("popout-hover"); });
        this.popoutButton.addEventListener("mouseleave", () => { this.killQuery("popout-hover"); });

        this.popoutButton.addEventListener("click", () => {

            const isPopped = this.popoutParent.classList.contains("popped");

            if (!isPopped) {
                this.popoutPlaceholder.style.width = this.popoutParent.offsetWidth + "px";
                this.popoutPlaceholder.style.height = this.popoutParent.offsetHeight + "px";
                this.popoutPlaceholder.style.display = "block";
                document.documentElement.style.overflowY = "hidden";
                this.setIconToExpand(false);
            }
            else {

                document.documentElement.style.overflowY = "visible";
                this.popoutPlaceholder.style.display = "none";
                this.setIconToExpand(true);
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

    setIconToExpand(expand) {

        let a, b;
        if (expand) {
            a = PopoutElement.pathExpandA;
            b = PopoutElement.pathExpandB;
        } else {
            a = PopoutElement.pathShrinkA;
            b = PopoutElement.pathShrinkB;
        }

        this.svgPathA.setAttribute("d", a.join(" "));
        this.svgPathB.setAttribute("d", b.join(" "));
    }

    buildStaticPaths() {
        if (!this.pathExpandA) {
            const L = 16.66667

            PopoutElement.pathExpandA = [
                "M", L * 3, L * 0,
                "L", L * 6, L * 0,
                "L", L * 6, L * 3,
                "L", L * 5, L * 2,
                "L", L * 4, L * 3,
                "L", L * 3, L * 2,
                "L", L * 4, L * 1,
                "Z"];

            PopoutElement.pathExpandB = [
                "M", L * 0, L * 3,
                "L", L * 0, L * 6,
                "L", L * 3, L * 6,
                "L", L * 2, L * 5,
                "L", L * 3, L * 4,
                "L", L * 2, L * 3,
                "L", L * 1, L * 4,
                "Z"];

            PopoutElement.pathShrinkA = [
                "M", L * 3, L * 0,
                "L", L * 4, L * 1,
                "L", L * 5, L * 0,
                "L", L * 6, L * 1,
                "L", L * 5, L * 2,
                "L", L * 6, L * 3,
                "L", L * 3, L * 3,
                "Z"];

            PopoutElement.pathShrinkB = [
                "M", L * 0, L * 3,
                "L", L * 1, L * 4,
                "L", L * 0, L * 5,
                "L", L * 1, L * 6,
                "L", L * 2, L * 5,
                "L", L * 3, L * 6,
                "L", L * 3, L * 3,
                "Z"];
        }
    }
}