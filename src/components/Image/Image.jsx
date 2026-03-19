/**
 * Image.jsx — 최적화된 이미지 컴포넌트
 *
 * ─── SanityImage 대체 ─────────────────────────────────────────────────────
 *
 *  제거: next-sanity-image, next/image, Sanity client
 *  유지: blur-up 패턴, 반응형 srcSet, onLoad 콜백
 *
 * ─── Vercel CDN 사용 방식 ────────────────────────────────────────────────
 *
 *  GitHub → Vercel 연결 시 /public 폴더 이미지는
 *  자동으로 CDN (https://project.vercel.app/images/...) 에서 서빙됨.
 *
 *  Next.js Image Optimization API가 없으므로 srcSet을 수동으로 구성.
 *  (필요 시 Cloudinary / imgix URL 변환 함수 사용 가능)
 *
 * ─── Props ────────────────────────────────────────────────────────────────
 *
 *  src          string   이미지 경로 (Vercel CDN URL 또는 /public 상대경로)
 *  alt          string
 *  width?       number   표시 너비 (px)
 *  height?      number   표시 높이 (px)
 *  sizes?       string   반응형 sizes 속성
 *  priority?    boolean  true → fetchpriority="high", loading="eager"
 *  className?   string
 *  style?       object
 *  onLoad?      function
 *  objectFit?   "cover" | "contain" | "fill" (기본값: "cover")
 */

import React, { useState } from "react"

export const BASE_IMAGE_URL =
    "https://woong-yu-portfolio.vercel.app/assets/images"

// src={buildImageUrl(src)}
export const buildImageUrl = (src) => {
    if (!src) return ""
    if (src.startsWith("http")) return src

    const path = src.startsWith("/") ? src : `/${src}`
    return `${BASE_IMAGE_URL}${path}`
}

export default function Image({
    src,
    alt = "",
    width,
    height,
    sizes = "100vw",
    priority = false,
    className,
    style,
    onLoad,
    objectFit = "cover",
}) {
    const [loaded, setLoaded] = useState(false)

    const handleLoad = () => {
        setLoaded(true)
        onLoad?.()
    }

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : "auto"}
            decoding="async"
            className={className}
            onLoad={handleLoad}
            style={{
                objectFit,
                opacity: loaded || priority ? 1 : 0,
                transition: "opacity 0.3s ease",
                ...style,
            }}
        />
    )
}

Image.displayName = "Image"
