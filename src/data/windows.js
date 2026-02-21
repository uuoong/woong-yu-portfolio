/**
 * src/data/windows.js
 *
 * 순수 데이터만 포함 — 컴포넌트 import 없음.
 * WindowToggleList 등 UI 컴포넌트가 안전하게 참조할 수 있습니다.
 *
 * WINDOW_REGISTRY (컴포넌트 매핑)는 Home.jsx에서 직접 정의합니다.
 * → 컴포넌트 import가 데이터 파일로 전파되는 것을 차단.
 */

export const WINDOW_TOGGLE_LIST = [
    {
        id: "about",
        label: "About",
        icon: "document",
        defaultOnDesktop: true,
        defaultOnMobile: true,
    },
    {
        id: "works",
        label: "Work Gallery",
        icon: "document",
        defaultOnDesktop: true,
        defaultOnMobile: true,
    },
    {
        id: "lab",
        label: "Featured Experiment",
        icon: "document",
        defaultOnDesktop: true,
        defaultOnMobile: false,
    },
    {
        id: "showreel",
        label: "Showreel",
        icon: "play",
        defaultOnDesktop: false,
        defaultOnMobile: false,
    },
]
