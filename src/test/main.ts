import "vite/modulepreload-polyfill";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, TextPlugin);

gsap.defaults({
    ease: "ease",
    duration: 1,
});
gsap.config({
    nullTargetWarn: false,
    force3D: true,
    autoSleep: 60,
});

import { initBarba } from "./barba";
import { initGlobalScripts } from "./init-scripts";

if (!(document.readyState === "loading")) init();
else document.addEventListener("DOMContentLoaded", init);

function init() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    initBarba();
    initGlobalScripts();
}
