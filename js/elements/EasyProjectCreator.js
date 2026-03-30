import { Const } from "../constants/Const.js";
import { EasyProject } from "./EasyProject.js";

export function createEmployeeCreatorProject() {
    const proj = new EasyProject("Full-Stack Employee Creator");
    proj.addPins(
        Const.REACT,
        Const.TYPESCRIPT,
        Const.JAVA,
        Const.SPRING_BOOT,
        Const.SQL,
        Const.AWS,
        Const.VITE,
        Const.SASS,
        Const.CSS,
        Const.VISUAL_STUDIO_CODE,
        Const.INTELLIJ,
        Const.GIT,
        Const.GITHUB,
        "JUnit + RestAssured"
    );
    proj.addTitlePins(
        Const.REACT,
        Const.JAVA,
        Const.SPRING_BOOT,
        Const.SQL,
        Const.AWS,
    );
    proj.addDescription("A full-stack employee management tool, exposes a RESTful API, enabling full CRUD " +
        "interactions with a MySQL database. Paired with a React/Typescript frontend. Includes a chat box" +
        "that allows interactions with an AI agent. Previously deployed on AWS.");
    proj.addLink("GitHub Frontend", "https://github.com/imogenlay/employee-creator-frontend");
    proj.addLink("GitHub Backend", "https://github.com/imogenlay/employee-creator-backend");

    return proj;
}

export function createECommerceProject() {
    const proj = new EasyProject("E-Commerce Storefront");
    proj.addPins(
        Const.REACT,
        Const.FIREBASE,
        Const.TYPESCRIPT,
        Const.VITE,
        Const.SASS,
        Const.CSS,
        Const.VISUAL_STUDIO_CODE,
        Const.GIT,
    );
    proj.addTitlePins(
        Const.REACT,
        Const.FIREBASE,
        Const.TYPESCRIPT,
    );
    proj.addDescription("A React e-commerce store utilising interaction with a " +
        "firebase document-database. The application stores both items and user cart contents " +
        "in the cloud.");
    proj.addLink("View", "https://imogenlay.com/projects/react-e-commerce");
    proj.addLink("GitHub", "https://github.com/imogenlay/react-e-commerce");

    return proj;
}

export function createJavaMinesweeperProject() {
    const proj = new EasyProject("Java CLI Minesweeper");
    proj.addPins(
        Const.JAVA,
        Const.INTELLIJ,
        Const.GODOT,
        Const.GDSCRIPT,
        Const.GIT,
    );
    proj.addTitlePins(
        Const.JAVA,
        Const.GODOT,
    );
    proj.addDescription("A command line interface implementation of the game minesweeper. " +
        "Utilising classes, byte arrays and recursive functions, this project allows players to test " +
        "their ability to locate mines. Additionally, there is a Godot version of the game " +
        "that can be played in the browser.");
    proj.addLink("View", "https://imogenlay.com/projects/minesweeper");
    proj.addLink("Java GitHub", "https://github.com/imogenlay/java-minesweeper");
    proj.addLink("Godot GitHub", "https://github.com/imogenlay/godot-minesweeper");

    return proj;
}

export function createGoogleBooksProject() {
    const proj = new EasyProject("Google Books API");
    proj.addPins(
        Const.REACT,
        Const.VITE,
        Const.JAVASCRIPT,
        Const.HTML,
        Const.SASS,
        Const.CSS,
        Const.VISUAL_STUDIO_CODE,
        Const.GIT,
        Const.GITHUB,
    );
    proj.addTitlePins(
        Const.REACT,
        Const.JAVASCRIPT,
    );
    proj.addDescription("A React application that allows for user interaction with the " +
        "publicly accessible Google Books API. Employing asynchronous programming " +
        "and React state, creating seamless communication with external data.");
    proj.addLink("View", "https://imogenlay.com/projects/google-books");
    proj.addLink("GitHub", "https://github.com/imogenlay/google-books-api");

    return proj;
}

export function createGodotMagnifyProject() {
    const proj = new EasyProject("Godot Magnify");
    proj.addPins(
        Const.GODOT,
        Const.GDSCRIPT,
        Const.GDSHADER,
        Const.ASEPRITE,
        Const.GITHUB,
    );
    proj.addTitlePins(
        Const.GODOT,
        Const.GDSCRIPT,
        Const.GDSHADER,
    );
    proj.addDescription("A custom plugin for Godot 4.0+ that works as a " +
        "magnification tool for assistance with sight-impaired users utilising screen space shaders.");
    proj.addLink("GitHub", "https://github.com/imogenlay/godot-magnify");

    return proj;
}

export function createMorseCodeProject() {
    const proj = new EasyProject("Morse Code");
    proj.addPins(
        Const.JAVASCRIPT,
        Const.JEST,
        Const.HTML,
        Const.SASS,
        Const.CSS,
        Const.VISUAL_STUDIO_CODE,
        Const.GITHUB);
    proj.addTitlePins(
        Const.JAVASCRIPT,
        Const.JEST,
    );
    proj.addDescription("This page translates user text back and forth between English and Morse Code. " +
        "The algorithm facilitates per-line translation from either language. Additionally, " +
        "all non-DOM functions have Jest unit tests, ensuring development safety.");
    proj.addLink("View", "https://imogenlay.com/projects/morse");
    proj.addLink("GitHub", "https://github.com/imogenlay/morse-code");

    return proj;
}

export function createPortfolioProject() {
    const proj = new EasyProject("Portfolio Site");
    proj.addPins(
        Const.JAVASCRIPT,
        Const.HTML,
        Const.CSS,
        Const.SASS,
        Const.ASEPRITE,
        Const.INKSCAPE,
        Const.VISUAL_STUDIO_CODE,
        Const.GIT,
        Const.GITHUB);
    proj.addTitlePins(
        Const.JAVASCRIPT,
        Const.SASS,
    );
    proj.addDescription("The site you are currently looking at was built from scratch to be " +
        "a versatile and maintainable archive of all my work. Inspired by React, " +
        "the site utilises a tailored solution to single page applications, integrating custom elements for reusability and performance.");
    proj.addLink("GitHub", "https://github.com/imogenlay/portfolio-site");

    return proj;
}

export function createCoffeeCornerProject() {
    const proj = new EasyProject("Pixel Perfect Design");
    proj.addPins(
        Const.HTML,
        Const.SASS,
        Const.CSS,
        Const.VISUAL_STUDIO_CODE,
        Const.GITHUB);
    proj.addTitlePins(
        Const.HTML,
        Const.CSS,
    );
    proj.addDescription("A pixel-perfect recreation of a Canva design making extensive use of SASS and the " +
        "Block, Element, Modifier (BEM) methodology.");
    proj.addLink("View", "https://imogenlay.com/projects/coffee-corner");
    proj.addLink("GitHub", "https://github.com/imogenlay/nology-precourse");

    return proj;
}