/**
 * ScrollRevealImage.jsx — WebGL 이미지 리빌 컴포넌트
 *
 * ─── 아키텍처 통합 ────────────────────────────────────────────────────────
 *
 *  이전: scrollReady Promise, 독립 스크롤 구독
 *  현재: Scroll.js 아키텍처 통합
 *    - useScrollContext()  → onScrollCallback으로 스크롤 위치 실시간 감지
 *    - initScene()        → onScrollCallback을 전달받아 glScene 스크롤 구독 등록
 *    - IntersectionObserver → GSAP 기반 uProgress tween
 *
 *  동작 검증된 로직 유지:
 *    - OGL Mesh 생성 + glScene pending queue 등록
 *    - getBoundingClientRect() 기반 DOM 위치 추적
 *    - uProgress 0→1 GSAP tween (IntersectionObserver 트리거)
 *    - GLSL ES 3.00 셰이더 (fragmentPixel / fragmentWave)
 *    - cover UV 보정 + gamma correction
 *
 * ─── Props ────────────────────────────────────────────────────────────────
 *
 *  src       string              이미지 URL
 *  alt       string              alt 텍스트 (기본값: "")
 *  type      "pixel" | "wave"    효과 종류 (기본값: "pixel")
 *  color     string              fill 색상 hex (기본값: "#403fb7")
 *  className string
 *  style     object
 *
 * ─── 사용법 ───────────────────────────────────────────────────────────────
 *
 *  // GL이 있는 페이지에서
 *  function PageHome() {
 *    const { onScrollCallback } = useScrollContext()
 *
 *    useEffect(() => {
 *      initScene(onScrollCallback)   // OGL 초기화 (1회)
 *    }, [])
 *
 *    return (
 *      <main>
 *        <GLImage src="..." type="pixel" color="#403fb7" />
 *        <GLImage src="..." type="wave" />
 *      </main>
 *    )
 *  }
 */

import { useEffect, useRef } from "react"
import { Texture, Program, Mesh } from "ogl"
import gsap from "gsap"
import { useScene } from "https://framer.com/m/scene-OZ8hbL.js@8qS4IvODM4RIw2MjdapQ"
import {
    buildPlane,
    hexToFloat32,
} from "https://framer.com/m/utils-F27url.js@1BBpe5gzOuuHevG4Z7Wg"
import {
    vertex,
    fragmentPixel,
    fragmentWave,
} from "https://framer.com/m/shaders-eHCRuL.js@kWRYsjAsrSft450sMpc0"

export default function GLImage({
    src,
    alt = "",
    type = "pixel",
    color = "#403fb7",
    className,
    style,
}) {
    const imgRef = useRef(null)
    const itemRef = useRef(null)
    const cleanupRef = useRef(null)

    // 싱글톤 sceneCtx 직접 반환 (Provider 없이)
    const ctx = useScene()

    useEffect(() => {
        if (!ctx) return

        const unsubscribe = ctx.subscribe((S) => {
            const img = imgRef.current
            if (!img) return

            const bootstrap = () => {
                if (!img.naturalWidth) return

                const rect = img.getBoundingClientRect()
                // window 스크롤 기준 (Scroll.js wrapper: window 고정 이후 일치)
                const absTop = rect.top + window.scrollY
                const left = rect.left
                const width = rect.width
                const height = rect.height

                if (!width || !height) return

                const { gl } = S

                const geometry = buildPlane(gl, 80, 80)

                const texture = new Texture(gl, {
                    image: img,
                    generateMipmaps: false,
                    minFilter: gl.LINEAR,
                    magFilter: gl.LINEAR,
                    flipY: true,
                })

                const fragment = type === "pixel" ? fragmentPixel : fragmentWave

                const program = new Program(gl, {
                    vertex,
                    fragment,
                    uniforms: {
                        uTexture: { value: texture },
                        uTextureSize: {
                            value: new Float32Array([
                                img.naturalWidth,
                                img.naturalHeight,
                            ]),
                        },
                        uElementSize: {
                            value: new Float32Array([width, height]),
                        },
                        uProgress: { value: 0.0 },
                        uFillColor: { value: hexToFloat32(color) },
                    },
                    transparent: true,
                    depthTest: false,
                    depthWrite: false,
                    cullFace: false,
                })

                const mesh = new Mesh(gl, { geometry, program })
                mesh.scale.set(width, height, 1)
                mesh.position.set(
                    -window.innerWidth / 2 + left + width / 2,
                    S.scroll + window.innerHeight / 2 - absTop - height / 2,
                    0
                )

                // GSAP tween: uProgress 0 → 1
                let tween = null
                const animateTo = (target) => {
                    tween?.kill()
                    tween = gsap.to(program.uniforms.uProgress, {
                        value: target,
                        duration: 1.5,
                        ease: "none",
                        onUpdate: ctx.scheduleRender,
                        onComplete: ctx.scheduleRender,
                    })
                }

                // IntersectionObserver (동작 검증된 로직 유지)
                const observer = new IntersectionObserver(([entry]) => {
                    animateTo(entry.isIntersecting ? 1 : 0)
                })
                observer.observe(img)

                const item = {
                    mesh,
                    program,
                    geometry,
                    texture,
                    absTop,
                    left,
                    width,
                    height,
                    recompute() {
                        const r = img.getBoundingClientRect()
                        this.absTop = r.top + window.scrollY
                        this.left = r.left
                        this.width = r.width
                        this.height = r.height
                    },
                }

                itemRef.current = item
                ctx.addItem(item)

                cleanupRef.current = () => {
                    tween?.kill()
                    observer.disconnect()
                    if (itemRef.current) {
                        ctx.removeItem(itemRef.current)
                        itemRef.current = null
                    }
                }
            }

            if (img.complete && img.naturalWidth) {
                bootstrap()
            } else {
                img.addEventListener("load", bootstrap, { once: true })
            }
        })

        return () => {
            unsubscribe()
            cleanupRef.current?.()
            cleanupRef.current = null
        }
    }, [src, type, color]) // eslint-disable-line

    return (
        <div
            className={className}
            style={{ position: "relative", display: "block", ...style }}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                crossOrigin="anonymous"
                style={{
                    display: "block",
                    width: "100%",
                    visibility: "hidden",
                }}
            />
        </div>
    )
}
