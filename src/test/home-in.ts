import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

import { inner, bp } from "./utils/variables";

import { heightCorrection } from "./utils/variables";
import { headerIn } from "./layout/header";
import { lenis } from "./base/scroll";

import lottie, { AnimationItem } from "lottie-web";
import mandc from "./../assets/lottie/M&C©5fx.json";

import { isFirefox, isMobile } from "./utils/variables";
import { inlineUseInsideMasks } from "./utils/inlineUseInsideMask";

export let heroLogoLottie: AnimationItem;

export function homeIn(ajaxIn: boolean = false) {
    const isInternalTransition = ajaxIn && !isMobile;

    const heroLogo = document.querySelector(".intro-banner__logo");
    if (!heroLogo) return;

    if (!heroLogo.classList.contains("loaded")) {
        heroLogoLottie = lottie.loadAnimation({
            container: heroLogo,
            animationData: mandc,
            renderer: !isFirefox ? "svg" : "canvas",
            loop: false,
            autoplay: false,
            rendererSettings: {
                preserveAspectRatio: "xMidYMax meet",
            },
        });

        heroLogoLottie.setSpeed(0.7);
        heroLogo.classList.add("loaded");

        if (heroLogoLottie.renderer.svgElement) {
            inlineUseInsideMasks(heroLogoLottie.renderer.svgElement);
        }
    }

    heroLogoLottie.play();
    transitionHomeIn(isInternalTransition);
}

function transitionHomeIn(isInternalTransition: boolean) {
    const introBanner = document.querySelector(".intro-banner");
    if (!introBanner) return;

    const heightOfIntroBanner = introBanner.getBoundingClientRect().height;
    const scale = inner.h / heightOfIntroBanner;

    gsap.set(".intro-banner", { scaleY: !isMobile ? scale : scale * 0.995 });
    gsap.set(".intro-banner__dummy", { display: "none" });

    gsap.timeline({
        defaults: {
            duration: isInternalTransition ? 0.01 : 1.2,
            ease: "expo.inOut",
        },
    })
        .fromTo(
            ".intro-banner",
            { scaleY: !isMobile ? scale : scale * 0.995 },
            {
                scaleY: 1,
                delay: isInternalTransition ? 0 : 0.8,
            }
        )
        .fromTo(
            ".intro-banner__lower",
            { scaleY: 1 / scale },
            {
                scaleY: 1,
            },
            "<"
        )
        .fromTo(".intro-banner__content__info", { opacity: 0.001 }, { opacity: 1 }, "<+=0")
        .from(
            ".intro-banner__content__info .gap, .intro-banner__content__info h1",
            {
                yPercent: 90,
                stagger: 0.1,
                onStart: () => {
                    if (!isInternalTransition) headerIn();
                },
            },
            "<+=0"
        )
        .from(
            ".work__inner > .work__item:first-of-type",
            {
                scale: 1.2,
                onComplete: () => {
                    heightCorrection();

                    lenis.scrollTo(0, {
                        duration: 0.01,
                        force: true,
                        onComplete: () => lenis.start(),
                    });
                },
            },
            "<+=0"
        )
        .set(".intro-banner__upper", { opacity: 1 }, "<+=0")
        .fromTo(
            ".intro-banner__upper",
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.5,
                ease: "expo.out",
            },
            isInternalTransition ? "<+=.5" : "<+=1.2"
        )
        .fromTo(
            ".intro-banner__video",
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", opacity: 0.001 },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.8,
                ease: "expo.out",
                onStart: () => {
                    const introVideo = document.querySelector<HTMLElement>(".intro-banner__video");
                    let introUpper = document.querySelector<HTMLElement>(`.intro-banner__upper--${inner.w > bp.md ? "dsk" : "mbl"}`);
                    if (!introVideo || !introUpper) return;

                    introVideo.classList.add("loaded");

                    const video = introVideo.querySelector<HTMLVideoElement>("video");
                    if (video) {
                        if (video.readyState === 4) video.play();
                        else video.addEventListener("loadeddata", () => video.play());
                    }

                    fitVideo(introVideo, introUpper);
                    window.addEventListener("resize", () => fitVideo(introVideo, introUpper));
                },
                onComplete: () => {
                    gsap.set(".intro-banner__video", { clearProps: "clipPath" });
                    gsap.set(".intro-banner__upper", {
                        clearProps: "clipPath",
                        background: "transparent",
                    });
                },
            }
        );
}

function fitVideo(introVideo: HTMLElement, introUpper: HTMLElement) {
    Flip.fit(introVideo, introUpper, {
        absolute: true,
        scale: true,
        duration: 0.01,
    });
}
