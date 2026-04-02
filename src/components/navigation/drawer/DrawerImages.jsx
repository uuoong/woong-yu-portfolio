import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react"
import gsap from "https://esm.sh/gsap"
import Image from "../../image/Image.jsx"
import { useAppContext } from "../../../context/App.js"

const DrawerImages = forwardRef(({ className, items }, ref) => {
    const { navigationData } = useAppContext()
    const drawerData = navigationData?.drawerContent
    const containerRef = useRef()

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

    useImperativeHandle(ref, () => ({
        animateIn,
        animateOut,
    }))

    if (!drawerData || !items?.length) return null

    return (
        <div ref={containerRef} className={`DrawerImages ${className || ""}`}>
            <div className="DrawerImages_inner">
                {items?.map((item, i) => {
                    const isActiveClass = "isActive"

                    return (
                        <div
                            key={i}
                            className={`DrawerImages_workImageContainer`}
                            ref={(ref) => {
                                if (ref) {
                                    setTimeout(() => {
                                        ref.classList.add(isActiveClass)
                                    }, 5)
                                }
                            }}
                        >
                            <Image
                                src={item.itemImage}
                                alt={item.itemTitle}
                                priority
                                objectFit="cover"
                                className="DrawerImages_image"
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
})

DrawerImages.displayName = "DrawerImages"

export default DrawerImages
