import gsap from "gsap";

import { ITransitionData } from "@barba/core";

import { heightCorrection, inner } from "./utils/variables";
import { lenis } from "./base/scroll";

const transitionEnabled = true;

export async function defaultTransitionIn(data: ITransitionData, ajaxIn: boolean = true) {
    const isInternalTransition = ajaxIn;

    if (ajaxIn) {
        const body = document.querySelector("body");
        if (!body) return;

        body.classList.add("ajax");
    }

    return new Promise(resolve => {
        if (!data.next.container) return;

        const nextContainer = data.next.container;

        nextContainer.classList.add("transition-in");
        gsap.set(nextContainer, { opacity: 1, force3D: true });

        let animationSpeed = 1.7;
        const tl = gsap.timeline({
            defaults: {
                duration: transitionEnabled ? animationSpeed : 0.01,
                ease: "power3.out",
                force3D: true,
            },
            onComplete: () => {
                gsap.set(nextContainer, { clearProps: "all" });
                nextContainer.classList.remove("transition-in");

                heightCorrection();
                lenis.start();
                resolve(true);
            },
        });

        if (isInternalTransition) {
            const startClip = `polygon(
                    0px ${inner.h}px,
                    ${inner.w}px ${inner.h}px,
                    ${inner.w}px ${inner.h}px,
                    0px ${inner.h}px)`;

            gsap.set(nextContainer, { clipPath: startClip });

            tl.to(nextContainer, {
                onStart: () => nextContainer.classList.remove("lottie-in"),
                delay: 0.08,
                clipPath: fullPageClip,
            });
        } else {
            const body = document.querySelector("body");
            if (!body) return;

            tl.fromTo(
                body,
                { "--blocker-transform": 0 + "%" },
                {
                    "--blocker-transform": -100 + "%",
                    duration: 1.5,
                    onComplete: () => {
                        gsap.set(body, { clearProps: "transform" });
                        body.classList.add("remove-blocker");
                    },
                }
            );
        }

        tl.from(
            nextContainer,
            {
                y: 30,
                ease: "power3.out",
                duration: animationSpeed,
                force3D: true,
            },
            isInternalTransition ? "<+=.05" : "<+=.05"
        );
    });
}

const fullPageClip = `polygon(0px 0px,${inner.w}px 0px,${inner.w}px ${inner.h}px,0px ${inner.h}px)`;
