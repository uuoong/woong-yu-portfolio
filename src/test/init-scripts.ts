import { runModuleDefault, runLayoutDefault, runComponentDefault } from "./utils/runner-functions";
import { initScroller, refreshScroller } from "./base/scroll";
import { refreshHeader } from "./layout/header";
import { initContactBtns } from "./layout/contact";
import { ITransitionData } from "@barba/core";
import { initUtils, inner, bp, isMobile } from "./utils/variables";

export function initGlobalScripts() {
    initUtils();
    initScroller();
}

export function initLayoutScripts(data: ITransitionData | null) {
    runLayoutDefault("header");
    runLayoutDefault("contact");
    runLayoutDefault("grid");

    if (!isMobile) {
        runLayoutDefault("saver");
    }
}

export function initComponentScripts(data: ITransitionData | null) {
    runComponentDefault(data, "video", ".video-js:not(.video-modal__video)");
    runComponentDefault(data, "video-modal", "[data-video-src]");
    runComponentDefault(data, "link");
    runComponentDefault(data, "accordion", ".accordion");
    runComponentDefault(data, "img-mask");

    if (!isMobile) {
        runComponentDefault(data, "cursor", "[data-cursor-title]");
    }

    if (inner.w > bp.lg) {
        runComponentDefault(data, "scroll-anim", "default");

        if (!(data?.current.namespace === "")) {
            setTimeout(() => {
                runComponentDefault(data, "tagline", "default");
            }, 500);
        }
    }
}

export function initModuleScripts(data: ITransitionData | null) {
    runModuleDefault(data, "footer", ".footer");
    runModuleDefault(data, "work", ".work");
    runModuleDefault(data, "time", ".time");
    runModuleDefault(data, "studies", ".studies");
    runModuleDefault(data, "open-positions", ".open-positions");
    runModuleDefault(data, "news", ".news__list");
    runModuleDefault(data, "img-quote", ".img-quote");
    runModuleDefault(data, "news-detail", ".detail");
    runModuleDefault(data, "product-slider", ".product-slider");
    runModuleDefault(data, "product-list", ".product-list");

    if (inner.w < bp.md) {
        runModuleDefault(data, "timezone", ".timezone");
    }
}

export function refreshGlobalScripts(data: ITransitionData) {
    refreshScroller(false, data.next.container);
    initContactBtns(data);

    setTimeout(() => refreshHeader(data), data.current.container && 800);
}
