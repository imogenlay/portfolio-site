import { Const } from "./constants/Const.js";

function redirect(location, storage) {
    if (storage)
        localStorage.setItem(Const.CURRENT_PAGE_KEY, storage);
    window.location.href = location;
}

const mainURL = "https://www.imogenlay.com";
if (window.location.href.includes("disassembly"))
    redirect(mainURL, 4);
else if (window.location.href.includes("projects"))
    redirect(mainURL, 5);
else
    redirect(mainURL);

