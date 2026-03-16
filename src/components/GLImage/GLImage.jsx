import { useEffect, useRef, useContext } from "react"
import { useScene } from "./gl/scene.js"
import { Texture, Program, Mesh } from "ogl"
import gsap from "gsap"

import { buildPlane } from "./gl/buildPlane.js"
import { vertex } from "./gl/shaders/vertex.js"
import { fragmentPixel, fragmentWave } from "./gl/shaders/fragment.js"

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

    const ctx = useScene()

    useEffect(() => {
        if (!ctx) return

        const unsubscribe = ctx.subscribe((S) => {
            const img = imgRef.current
            if (!img) return

            const bootstrap = () => {
                if (!img.naturalWidth) return

                const rect = img.getBoundingClientRect()

                const absTop = rect.top + window.scrollY
                const left = rect.left
                const width = rect.width
                const height = rect.height

                if (!width || !height) return

                const { gl } = S

                // geometry
                const geometry = buildPlane(gl, 80, 80)

                // texture
                const texture = new Texture(gl, {
                    image: img,
                    generateMipmaps: false,
                    minFilter: gl.LINEAR,
                    magFilter: gl.LINEAR,
                    flipY: true,
                })

                // shader selection
                const fragment = type === "pixel" ? fragmentPixel : fragmentWave

                // color hex → float
                const hex = color.replace("#", "")

                const fillColor = new Float32Array([
                    parseInt(hex.slice(0, 2), 16) / 255,
                    parseInt(hex.slice(2, 4), 16) / 255,
                    parseInt(hex.slice(4, 6), 16) / 255,
                ])

                const program = new Program(gl, {
                    vertex: vertex,
                    fragment: fragment,
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

                        uFillColor: { value: fillColor },
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

                // GSAP animation
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

                // Intersection observer
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
    }, [src, type, color])

    if (!ctx) {
        return <img src={src} alt={alt} className={className} style={style} />
    }

    return (
        <div
            className={className}
            style={{
                position: "relative",
                display: "block",
                ...style,
            }}
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
