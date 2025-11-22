import { PageBuilder } from './PageBuilder.js';
import { ProjectBox } from './elements/ProjectBox.js';

const header = document.getElementById("header");
const main = document.getElementById("main");
customElements.define('project-box', ProjectBox);

const pageBuilder = new PageBuilder(header, main);
pageBuilder.initialise(); 