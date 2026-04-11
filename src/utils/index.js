/**
 * utils.js — 프로젝트 공통 유틸리티
 *
 * ─── getDeviceInfo 수정 (Fix 5) ───────────────────────────────────────────
 *  원본: @jam3/detect (npm 패키지) → Framer 환경 사용 불가
 *  변경: navigator.userAgent + navigator.maxTouchPoints 기반 직접 감지
 *
 *  원본 deviceInfo 구조 그대로 유지:
 *    { device: { type, isDesktop }, browser: { chrome }, isTouchDevice }
 *  → Scroll.js가 deviceInfo.device.type, deviceInfo.browser.chrome를 그대로 사용 가능
 */

export const wait = (ms = 0) => new Promise((r) => setTimeout(r, ms))

export const lerp = (cur, target, ease = 0.1) => cur + (target - cur) * ease

export const getCssVar = (variable) =>
    window.getComputedStyle(document.body).getPropertyValue(`--${variable}`)

export const buildIdFromText = (input) =>
    input
        .trim()
        .replace(/[^\w\s+]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()

export const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return { unit: "Bytes", size: 0 }
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return {
        size: parseFloat(
            (bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)
        ),
        unit: sizes[i],
    }
}

export const bytesToMb = (bytes) => {
    const { size, unit } = formatBytes(bytes)
    return unit === "KB" ? size / 1024 : size
}

export const simpleImagesPreload = ({ urls, onComplete, onProgress }) => {
    let loaded = 0
    urls.forEach((url) => {
        const img = new window.Image()
        img.onload = () => {
            loaded++
            onProgress?.(loaded / urls.length, url)
            if (loaded === urls.length) onComplete?.()
        }
        img.src = url
    })
}

// ─── getDeviceInfo (원본 구조 유지, @jam3/detect 대체) ────────────────────────
/**
 * 원본:
 *   deviceInfo.device.type        → 'mobile' | 'tablet' | 'desktop'
 *   deviceInfo.device.isDesktop   → boolean
 *   deviceInfo.browser.chrome     → boolean
 *   deviceInfo.isTouchDevice      → boolean
 *
 * Scroll.js 사용 패턴 (원본):
 *   const isMobileChrome = deviceInfo.device.type === 'mobile' && deviceInfo.browser.chrome
 *   const isDesktop = deviceInfo.device.isDesktop || isMobileChrome
 */
export const getDeviceInfo = () => {
    const isBrowser = typeof window !== "undefined"

    if (!isBrowser) {
        return {
            device: {
                type: "desktop",
                isDesktop: true,
                isMobile: false,
                isTablet: false,
            },
            browser: {
                chrome: false,
                safari: false,
                firefox: false,
                edge: false,
            },
            isTouchDevice: false,
        }
    }

    const ua = navigator.userAgent

    // Touch 감지
    const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0

    // 기기 타입 감지
    const isMobileUA = /Mobi|Android|iPhone|iPod/i.test(ua)
    const isTabletUA =
        /iPad/i.test(ua) || (isTouchDevice && /Macintosh/i.test(ua)) // iPad + desktop Safari
    const isMobile = isMobileUA && !isTabletUA
    const isTablet =
        isTabletUA || (!isMobile && isTouchDevice && window.innerWidth <= 1024)
    const isDesktop = !isMobile && !isTablet

    // 브라우저 감지
    const isEdge = /Edg\//i.test(ua)
    const isChrome = /Chrome\//i.test(ua) && !isEdge && !/OPR\//i.test(ua)
    const isSafari = /Safari\//i.test(ua) && !/Chrome\//i.test(ua)
    const isFirefox = /Firefox\//i.test(ua)

    return {
        device: {
            type: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
            isDesktop,
            isMobile,
            isTablet,
        },
        browser: {
            chrome: isChrome,
            safari: isSafari,
            firefox: isFirefox,
            edge: isEdge,
        },
        isTouchDevice,
    }
}

/**
 * deviceInfo — 모듈 로드 시 1회 계산 (원본 패턴 그대로)
 * Scroll.js에서 import { deviceInfo } from "./utils.js" 로 사용
 */
export const deviceInfo = getDeviceInfo()

// ─── Vercel Image Optimization ────────────────────────────────────────────────

const VERCEL_ORIGIN = "https://woong-yu-portfolio.vercel.app"
const VERCEL_IMAGES_BASE = "/assets/images"

export const getImageUrl = (src, { width = null, quality = 80 } = {}) => {
    if (!src) return null
    if (src.includes("/_vercel/image")) return src

    let imagePath
    if (src.startsWith("http://") || src.startsWith("https://")) {
        imagePath = src
    } else if (src.startsWith("/")) {
        imagePath = src
    } else {
        imagePath = `${VERCEL_IMAGES_BASE}/${src}`
    }

    const params = new URLSearchParams()
    params.set("url", imagePath)
    if (width) params.set("w", String(width))
    params.set("q", String(quality))

    return `${VERCEL_ORIGIN}/_vercel/image?${params.toString()}`
}

export const BP_SRCSET_WIDTHS = [
    768, 967, 1200, 1512, 1536, 1800, 1934, 2400, 3024,
]

export const getSrcSet = (src, widths = BP_SRCSET_WIDTHS, quality = 80) => {
    if (!src) return ""
    return widths
        .map((w) => `${getImageUrl(src, { width: w, quality })} ${w}w`)
        .join(", ")
}

export const getImagePath = (folder, filename) =>
    `${VERCEL_ORIGIN}${VERCEL_IMAGES_BASE}/${folder}/${filename}`
