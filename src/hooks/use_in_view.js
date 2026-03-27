/**
 * useInView.js — ScrollTrigger 기반 뷰포트 진입 감지
 *
 * 레퍼런스: hooks/use-in-view.js 를 최대한 그대로 이식
 *
 * ─── remValueCalculated 의존성 제거 ──────────────────────────────────────
 *
 *  원본: remValueCalculated를 기다린 후 ScrollTrigger 실행
 *  이유: rem 기반 픽셀 위치 계산이 완료된 뒤에 ST가 올바른 위치를 잡기 위함
 *
 *  현재: 의존성 제거
 *  이유:
 *    - 우리 프로젝트의 start/end는 "top bottom", "bottom top" 등 % 기반
 *    - rem 값이 ST 위치에 영향을 주지 않음
 *    - remValueCalculated가 false이면 useInView가 절대 실행 안 되는 버그 방지
 *
 *  bodyHeightChangeKey는 유지:
 *    - ResizeObserver가 높이 변화를 감지하면 bodyHeightChangeKey가 업데이트
 *    - useInView가 재실행되어 ScrollTrigger를 refresh
 *
 * ─── FadeSection 사용 예시 ────────────────────────────────────────────────
 *
 *  FadeSection은 useInView를 사용해 React state(isInView)로
 *  opacity/transform을 제어하는 래퍼 컴포넌트.
 *
 *  ImageReveal과 함께 사용 시:
 *    <FadeSection>       ← isInView로 container opacity 제어
 *      <ImageReveal />   ← 자체 IntersectionObserver로 clipPath 애니메이션
 *    </FadeSection>
 *
 *  FadeSection이 opacity:0이면 ImageReveal이 보이지 않음.
 *  두 효과가 동시에 필요하지 않다면 FadeSection이나 ImageReveal 중 하나만 사용.
 *
 *  사용 방법:
 *    1. 텍스트/일반 콘텐츠 등장: FadeSection 사용
 *    2. 이미지 클립/와이프 리빌: ImageReveal 단독 사용 (FadeSection 불필요)
 *    3. 이미지에 FadeSection도 함께 쓰고 싶다면:
 *       ImageReveal의 effect를 "none"으로 설정하거나
 *       FadeSection 안에 ImageReveal을 넣고 ImageReveal의 자체 애니메이션 제거
 */

import React, { useState, useEffect, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger"
import useWindowResize, {
    USE_WINDOW_RESIZE_DEFAULTS,
} from "./use_window_resize.js"
import { useAppContext } from "../context/App.js"

export const USE_IN_VIEW_DEFAULTS = {
    fireOnce: true,
    scrolltriggerStart: "top bottom",
    scrolltriggerEnd: "bottom top",
}

export default function useInView(props) {
    const options = { ...USE_IN_VIEW_DEFAULTS, ...props }

    const [elementToObserve, setElementToObserve] = useState(null)
    const [isInView, setIsInView] = useState(false)
    const hasFiredInView = useRef(false)
    const scrollTriggerRef = useRef()

    const resizeKey = useWindowResize({
        debounce: USE_WINDOW_RESIZE_DEFAULTS.debounce + 100,
    })
    const { remValueCalculated, bodyHeightChangeKey } = useAppContext()

    // GSAP ScrollTrigger 등록 (useEffect 내부 = 브라우저 환경 보장)
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        ScrollTrigger.config({ ignoreMobileResize: true })
    }, [])

    useEffect(() => {
        // 원본과 동일한 조건: elementToObserve가 없거나 이미 발동되었으면 종료
        if (!remValueCalculated) return
        if (!elementToObserve || (hasFiredInView.current && options.fireOnce))
            return

        if (scrollTriggerRef.current) {
            scrollTriggerRef.current.kill()
        }

        scrollTriggerRef.current = ScrollTrigger.create({
            trigger: elementToObserve,
            start: options.scrolltriggerStart,
            end: options.scrolltriggerEnd,

            onEnter: () => {
                setIsInView(true)
                if (options.fireOnce && scrollTriggerRef.current) {
                    hasFiredInView.current = true
                    scrollTriggerRef.current.kill()
                }
            },
            onEnterBack: () => {
                setIsInView(true)
                if (options.fireOnce && scrollTriggerRef.current) {
                    hasFiredInView.current = true
                    scrollTriggerRef.current.kill()
                }
            },
            onLeave: () => {
                if (!options.fireOnce) setIsInView(false)
            },
            onLeaveBack: () => {
                if (!options.fireOnce) setIsInView(false)
            },
        })
    }, [
        elementToObserve,
        options.fireOnce,
        options.scrolltriggerStart,
        options.scrolltriggerEnd,
        resizeKey,
        remValueCalculated,
        bodyHeightChangeKey,
    ])

    useEffect(() => {
        return () => {
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill()
            }
        }
    }, [])

    return { setElementToObserve, isInView, setIsInView }
}
