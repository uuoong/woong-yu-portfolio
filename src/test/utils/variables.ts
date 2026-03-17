import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const mixAnimChars = "▀▊▋▌▍▎▏▐▕▖▗▘▙▚▛▜▝▞▟&&&&";

export const bp = {
    sm: 600,
    md: 768,
    lg: 1024,
    xlg: 1232,
    xxlg: 1600,
};

export const isMobile = "ontouchstart" in document.documentElement;
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

export const inner = {
    w: window.innerWidth,
    h: window.innerHeight,
};

export let varSpacer: number = 15;
export let headerHeight: number = 80;

const header = document.querySelector<HTMLElement>(".header");
function calcResize() {
    inner.w = window.innerWidth;
    inner.h = window.innerHeight;

    if (inner.w < bp.lg) varSpacer = 14;
    else varSpacer = (inner.w / 100) * 2;

    if (header) {
        headerHeight = header.offsetHeight;
        gsap.set(":root", { "--header-height": headerHeight + "px" });
    }
}

export function heightCorrection() {
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
}

let debounceTimer: ReturnType<typeof setTimeout>;
function resizerDebounce() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        if (window.innerHeight !== inner.h && isMobile) {
            if (window.innerHeight > inner.h + inner.h * 0.3 || window.innerHeight < inner.h - inner.h * 0.3) {
                calcResize();
            }
        } else calcResize();
    }, 500);
}

export const mouse = {
    x: inner.w / 2,
    y: inner.h / 2,

    xPerc: 50,
    yPerc: 50,

    xFromCen: 0,
    yFromCen: 0,

    xPerFromCen: 0,
    yPerFromCen: 0,

    movementX: 0,
    movementY: 0,
};

// function mouseMove(e: MouseEvent, cursor: HTMLElement) {
//     mouse.x = e.clientX;
//     mouse.y = e.clientY;

//     mouse.xPerc = (mouse.x / inner.h) * 100;
//     mouse.yPerc = (mouse.y / inner.h) * 100;

//     mouse.xFromCen = mouse.x - inner.w / 2;
//     mouse.yFromCen = mouse.y - inner.h / 2;

//     mouse.xPerFromCen = (mouse.xFromCen / inner.w) * 100;
//     mouse.yPerFromCen = (mouse.yFromCen / inner.h) * 100;

//     mouse.movementX = e.movementX;
//     mouse.movementY = e.movementY;
// }

export function initUtils() {
    calcResize();
    window.addEventListener("resize", resizerDebounce);

    // if (!isMobile) {
    //     const cursor = document.querySelector<HTMLElement>(".cursor");
    //     if (!cursor) return
    //     window.addEventListener("mousemove", (e) => mouseMove(e, cursor));
    // }
}
