import React, { useEffect, useRef } from "react"
import { Texture, Program, Mesh } from "https://esm.sh/ogl"
import gsap from "https://esm.sh/gsap"
import { useScene } from "./core/scene.js"
import { buildPlane } from "./utils/geometry.js"
import { hexToFloat32 } from "./utils/color.js"
import { vertex } from "./shader/vertex.js"
import { fragment } from "./shader/fragment.js"

export default function ScrollRevealImage({
    src,
    alt = "",
    color = "#403fb7",
    className,
    style,
}) {
    const imgRef = useRef(null)
    const itemRef = useRef(null)
    const cleanupRef = useRef(null)
    const ctx = useScene()

    useEffect(() => {
        if (!ctx) return

        const unsubscribe = ctx.subscribe((S) => {
            const img = imgRef.current
            if (!img) return

            const bootstrap = () => {
                if (!img.naturalWidth) return

                const rect = img.getBoundingClientRect()
                // 수정: window.scrollY → S.scroll (div scroll 환경에서도 정확)
                const absTop = rect.top + S.scroll
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
                        // 수정: S.scroll 사용
                        this.absTop = r.top + S.scroll
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
    }, [src, color]) // eslint-disable-line

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
                    height: "100%",
                    objectFit: "cover",
                    visibility: "hidden",
                    position: "absolute", // DOM 흐름에서 분리하여 레이아웃 안정성 확보
                    top: 0,
                    left: 0,
                }}
            />
        </div>
    )
}

ScrollRevealImage.displayName = "ScrollRevealImage"
