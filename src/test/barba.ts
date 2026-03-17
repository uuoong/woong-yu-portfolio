import barba from "@barba/core";
import { ITransitionData } from "@barba/core";

import { initComponentScripts, initModuleScripts, initLayoutScripts, refreshGlobalScripts } from "./init-scripts";
// import { transitionIn, transitionOut } from "./transitions";

import gsap from "gsap";
import { hideMblNav } from "./layout/mbl-nav";
import { homeIn } from "./home-in";
import { headerIn } from "./layout/header";
import { lenis, scrollToTopAndStop } from "./base/scroll";
import { defaultTransitionIn } from "./transitions";

export function initBarba() {
    barba.init({
        debug: false,
        cacheIgnore: false,
        preventRunning: true,

        transitions: [
            {
                name: "global",
                sync: true,
                priority: 1,

                async once(data: ITransitionData) {
                    headerIn();
                    await defaultTransitionIn(data, false);
                },

                async beforeLeave(data: ITransitionData) {
                    await defaultLeave(data);
                },

                async enter(data: ITransitionData) {
                    await defaultTransitionIn(data);
                },
            },

            {
                name: "to-home",
                sync: true,
                priority: 2,

                to: {
                    namespace: ["home", "home-seo-update"],
                },

                async once(data: ITransitionData) {
                    homeIn(false);

                    data.next.container.classList.add("transition-in");
                    gsap.set(data.next.container, { opacity: 1 });
                },

                async beforeLeave(data: ITransitionData) {
                    defaultLeave(data);
                },

                async enter(data: ITransitionData) {
                    homeIn(true);
                    await defaultTransitionIn(data);
                },
            },
        ],
    });

    barba.hooks.once(async (data: ITransitionData) => {
        initLayoutScripts(data);
        initComponentScripts(data);
        initModuleScripts(data);
    });

    barba.hooks.enter(async (data: ITransitionData) => {
        refreshGlobalScripts(data);
        initComponentScripts(data);
        initModuleScripts(data);
    });

    barba.hooks.after(() => {
        if (typeof gtag === "function") {
            gtag("event", "page_view", {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
            });
        }
    });

    const adminBarLinks = document.querySelectorAll("#wpadminbar a");
    adminBarLinks.forEach(item => item.setAttribute("data-barba-prevent", "self"));
}

async function defaultLeave(data: ITransitionData) {
    handleContainers(data);
    hideMblNav();
}

function handleContainers(data: ITransitionData) {
    gsap.set(data.current.container, {
        position: "fixed",
        pointerEvents: "none",
        zIndex: 8,
        top: -lenis.actualScroll,
        left: 0,
    });

    gsap.to(data.current.container.querySelector(".work__ui__wrapper"), {
        opacity: 0,
        duration: 0.2,
    });

    gsap.fromTo(
        data.current.container,
        {
            filter: "brightness(1)",
        },
        {
            filter: "brightness(.6)",
            duration: 2,
            delay: 0.1,
            ease: "power3.out",
        }
    );

    gsap.set(data.next.container, {
        opacity: 0,
        position: "relative",
        zIndex: 9,
    });

    scrollToTopAndStop();
}
