import Lenis from "lenis";
import "lenis/dist/lenis.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scrambleTextAnim } from "../components/scramble-anim";
import { isMobile, headerHeight } from "../utils/variables";

export let lenis: Lenis;

export async function initScroller() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        infinite: false,
        orientation: "vertical",
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    scrollToTopAndStop();
    initJumpLinksScrollTo();
    initScrollPrompt();

    if (!isMobile) {
        const parallaxModule = await import("./parallax");
        parallaxModule.default(document.body, lenis);
    } else {
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    }
}

export async function refreshScroller(ajaxRefresh = false, container: HTMLElement = document.body) {
    if (!ajaxRefresh) {
        const allSt = ScrollTrigger.getAll();
        allSt.forEach(st => st.kill(false, false));
    }

    if (!isMobile) {
        const parallaxModule = await import("./parallax");
        parallaxModule.default(container, null);
    }

    initScrollPrompt();
}

export function scrollToTopAndStop() {
    window.scrollTo(0, 0);

    lenis.scrollTo(0, {
        duration: 0.001,
        force: true,
        onComplete: () => lenis.stop(),
    });
}

function initJumpLinksScrollTo() {
    const jumpLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    jumpLinks.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            if (location.pathname.replace(/^\//, "") === anchor.pathname.replace(/^\//, "") && location.hostname === anchor.hostname) {
                const targetId = anchor.hash;
                const target = document.querySelector(targetId) as HTMLElement;

                if (target) {
                    lenis.scrollTo(target);
                    history.pushState(null, "", targetId);
                }
            }
        });
    });
}

interface Window {
    themeData?: {
        taglines: string[];
        scrollprompts: string[];
    };
}

let scrollPrompts = ["Take a peek below the fold...", "Curiosity awaits..."];
const themeData = (window as Window).themeData;
if (themeData && typeof (window as Window).themeData !== "undefined") {
    scrollPrompts = themeData.scrollprompts;
}

let scrollTimeout: ReturnType<typeof setTimeout>;
function initScrollPrompt() {
    let hasScrolled = false;
    const header = document.querySelector<HTMLElement>(".header");
    if (!header) return;

    let tagline = header.querySelector<HTMLElement>(".header__tagline");
    if (!tagline) return;

    const initialTagline = tagline.textContent;
    if (!initialTagline) return;

    lenis.on("scroll", () => {
        if (!hasScrolled) {
            hasScrolled = true;
        }
    });

    scrollTimeout && clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        if (hasScrolled) return;
        const randomScrollPrompt = scrollPrompts[(Math.random() * scrollPrompts.length) | 0];

        scrambleTextAnim(tagline, randomScrollPrompt || "Take a peek below the fold...", "auto");

        ScrollTrigger.create({
            trigger: header,
            start: "top-=1 top",
            end: `top+=${headerHeight * 0.25} top`,
            once: true,

            onLeave: () => scrambleTextAnim(tagline, initialTagline, "auto"),
        });
    }, 10000);
}
