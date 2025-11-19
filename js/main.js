import { PageBuilder } from './PageBuilder.js';

const header = document.getElementById("header");
const main = document.getElementById("main");
const pageBuilder = new PageBuilder(header, main);
pageBuilder.initialise();