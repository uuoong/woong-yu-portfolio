/**
 * index.js — 프로젝트 단일 진입점 (URL 불변 보장)
 */

// ── 상태 & 컨텍스트 ───────────────────────────────────────────────────────
export { AppProvider, useAppContext } from "./context/App.js"

export {
    ScrollContext,
    ScrollProvider,
    useScrollContext,
} from "./context/Scroll.js"

// ── 레이아웃 (SCROLL_CONTAINER_CLASS, SCROLL_CONTENT_CLASS 여기서 export) ──
export {
    default as Layout,
    MAIN_FADE_IN_DURATION,
    SCROLL_CONTAINER_CLASS,
    SCROLL_CONTENT_CLASS,
} from "./base/layout/Layout.js"

export {
    default as Navigation,
    HEADER_ID,
} from "./components/navigation/Navigation.jsx"

export {
    default as Drawer,
    DRAWER_ANIMATION_CONFIG,
    DRAWER_INNER_ID,
} from "./components/navigation/drawer/Drawer.jsx"

export { default as DrawerImages } from "./components/navigation/drawer/DrawerImages.jsx"

export { default as MobileNav } from "./components/navigation/mobile/MobileNav.jsx"

// export { default as PageTransition } from "./components/page_transition/PageTransition.jsx"
export { default as Wipe } from "./components/wipe/Wipe.jsx"
export { default as PageTransition } from "./components/page_transition/PageTransition.jsx"
export { default as Footer } from "./sections/footer/Footer.jsx"
export { default as Sections } from "./base/sections/Sections.jsx"
export { default as SectionContainer } from "./base/section_container/SectionContainer.jsx"

// ── 섹션 컴포넌트 ─────────────────────────────────────────────────────────
export { default as MultiParagraphWithLinks } from "./sections/MultiParagraphWithLinks/MultiParagraphWithLinks.jsx"
export { default as TwoImagesAndText } from "./sections/TwoImagesAndText/TwoImagesAndText.jsx"
export { default as WorksGL } from "./sections/GL/Worksgl.jsx"

// ── UI 컴포넌트 ───────────────────────────────────────────────────────────
export { default as ContentMask } from "./components/content_mask/ContentMask.jsx"
export { default as Clock } from "./components/clock/Clock.jsx"
export { default as ThemeToggle } from "./components/theme_toggle/ThemeToggle.jsx"
export { default as Link } from "./components/link/Link.jsx"
export { default as Image } from "./components/image/Image.jsx"
export { default as ImageReveal } from "./components/image_reveal/ImageReveal.jsx"
export { default as ArrowRight } from "./components/_svg/ArrowRight.js"
export { default as Cursor } from "./components/cursor/Cursor.jsx"

// ── GL (WebGL) ────────────────────────────────────────────────────────────
export {
    SceneProvider,
    useScene,
} from "./components/_webgl/scroll_reveal_image/core/scene.js"
export { default as ScrollRevealImage } from "./components/_webgl/scroll_reveal_image/ScrollRevealImage.jsx"
export { buildPlane } from "./components/_webgl/scroll_reveal_image/utils/geometry.js"
export { hexToFloat32 } from "./components/_webgl/scroll_reveal_image/utils/color.js"
export { vertex } from "./components/_webgl/scroll_reveal_image/shader/vertex.js"
export { fragment } from "./components/_webgl/scroll_reveal_image/shader/fragment.js"

// ── Hooks ─────────────────────────────────────────────────────────────────
export {
    default as useWindowResize,
    USE_WINDOW_RESIZE_DEFAULTS,
} from "./hooks/use_window_resize.js"
export {
    default as useBreakpoint,
    BREAKPOINTS,
    getBreakpoint,
    getIsMobile,
} from "./hooks/use_breakpoint.js"
export {
    default as useInView,
    USE_IN_VIEW_DEFAULTS,
} from "./hooks/use_in_view.js"
export { default as useIsReducedMotion } from "./hooks/use_is_reduced_motion.js"

// ── Utils ─────────────────────────────────────────────────────────────────
export {
    BP_SRCSET_WIDTHS,
    buildIdFromText,
    bytesToMb,
    deviceInfo,
    formatBytes,
    getCssVar,
    getDeviceInfo,
    getImagePath,
    getImageUrl,
    getSrcSet,
    getUrlFromPageType,
    lerp,
    simpleImagesPreload,
    wait,
} from "./utils/index.js"

// ── Data ──────────────────────────────────────────────────────────────────

export {
    ABOUT_SECTIONS,
    CONTACT_SECTIONS,
    CONTENT,
    DOC_TYPES,
    FOUR_OH_FOUR_SLUG,
    HOME_SECTIONS,
    HOME_SLUG,
    NAV_DATA,
    TRANSITION_DURATION,
    TRANSITION_DURATION_MS,
    WORKS_SECTIONS,
    WORKS_SLUG,
} from "./data/index.js"
