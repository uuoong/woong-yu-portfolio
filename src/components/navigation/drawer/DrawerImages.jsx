import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react"
import gsap from "https://esm.sh/gsap"
import Image from "../../image/Image.jsx"

const DrawerImages = forwardRef(({ className, workImages }, ref) => {
    const containerRef = useRef()

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        el.style.setProperty("--left-y", "0%")
        el.style.setProperty("--right-y", "0%")
    }, [])

    const animateIn = (options) => {
        if (!containerRef.current) return
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
            "--left-y": "100%",
            "--right-y": "100%",
            duration: options?.duration || 1.8,
            ease: options?.ease || "Power3.easeInOut",
            delay: options?.delay || 0,
        })
    }

    const animateOut = (options) => {
        if (!containerRef.current) return
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
            "--left-y": "0%",
            "--right-y": "0%",
            duration: options?.duration || 1.8,
            ease: options?.ease || "Power3.easeInOut",
            delay: options?.delay || 0,
        })
    }

    useImperativeHandle(ref, () => ({ animateIn, animateOut }))

    if (!workImages?.length) return null

    return (
        <div ref={containerRef} className="DrawerImages">
            <div className="DrawerImages_inner">
                {workImages.map((image, i) => (
                    <ProductImageContainer key={i} image={image} />
                ))}
            </div>
        </div>
    )
})

function ProductImageContainer({ image }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.setProperty("--left-y", "100%")
        el.style.setProperty("--right-y", "100%")

        const timer = setTimeout(() => {
            el.style.setProperty("--left-y", "0%")
            el.style.setProperty("--right-y", "0%")
        }, 5)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div ref={ref} className="DrawerImages_productImageContainer">
            <Image
                src={image}
                alt=""
                priority
                objectFit="cover"
                className="DrawerImages_image"
            />
        </div>
    )
}

DrawerImages.displayName = "DrawerImages"

export default DrawerImages
