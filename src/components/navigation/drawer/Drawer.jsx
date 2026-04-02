import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react"
import gsap from "https://esm.sh/gsap"
import ContentMask from "../../content_mask/ContentMask.jsx"
import DrawerImages from "./DrawerImages.jsx"
import Link from "../../link/Link.jsx"
import ArrowRight from "../../_svg/ArrowRight.js"
import { useAppContext } from "../../../context/App.js"

export const DRAWER_ANIMATION_CONFIG = {
    IN: { duration: 1.3, ease: "Power3.easeInOut" },
    OUT: { duration: 0.8, ease: "Power3.easeOut" },
}

export const DRAWER_INNER_ID = "drawer-inner"

const Drawer = forwardRef(({ className }, ref) => {
    const {
        navigationData,
        navigationIsOpen,
        setNavigationIsOpen,
        setCursorState,
    } = useAppContext()

    const drawerData = navigationData?.drawerContent

    const [images, setImages] = useState([])

    const containerRef = useRef()
    const bgRef = useRef()
    const overlayRef = useRef()
    const closeButtonTextRef = useRef()

    const listTitleRef = useRef()
    const listItemRefs = useRef([])
    const imagesRef = useRef()

    const descriptionTitleRef = useRef()
    const descriptionRef = useRef()
    const aboutTitleRef = useRef()
    const locationTitleRef = useRef()
    const contactTitleRef = useRef()
    const socialLinkMaskRefs = useRef([])

    const animateIn = useCallback(() => {
        const duration = DRAWER_ANIMATION_CONFIG.IN.duration
        const ease = DRAWER_ANIMATION_CONFIG.IN.ease

        gsap.killTweensOf([
            bgRef.current,
            descriptionRef.current,
            overlayRef.current,
        ])

        gsap.to(bgRef.current, { scaleY: 1, duration, ease })

        gsap.to(overlayRef.current, { autoAlpha: 0.5, duration, ease })

        gsap.to(descriptionRef.current, {
            autoAlpha: 1,
            duration,
            delay: duration * 0.5,
            ease,
        })

        const upperItems = [
            closeButtonTextRef.current,
            descriptionTitleRef.current,
            listTitleRef.current,
            ...listItemRefs.current,
        ]

        const bottomItems = [
            aboutTitleRef.current,
            locationTitleRef.current,
            contactTitleRef.current,
            ...socialLinkMaskRefs.current,
        ]

        upperItems.forEach((item) => {
            item.animateIn({ delay: duration * 0.3 })
        })

        bottomItems.forEach((item) => {
            item.animateIn({ delay: duration * 0.7 })
        })

        imagesRef.current?.animateIn({
            duration: duration * 1.2,
            delay: duration * 0.25,
            ease,
        })
    }, [])

    const animateOut = useCallback(() => {
        const duration = DRAWER_ANIMATION_CONFIG.OUT.duration
        const ease = DRAWER_ANIMATION_CONFIG.OUT.ease

        gsap.killTweensOf([
            bgRef.current,
            descriptionRef.current,
            overlayRef.current,
        ])

        gsap.to(bgRef.current, { scaleY: 0, duration, ease })

        gsap.to(overlayRef.current, { autoAlpha: 0, duration, ease })

        gsap.to(descriptionRef.current, {
            autoAlpha: 0,
            duration: duration * 0.5,
            ease,
        })

        const upperItems = [
            closeButtonTextRef.current,
            descriptionTitleRef.current,
            listTitleRef.current,
            ...listItemRefs.current,
        ]

        const bottomItems = [
            aboutTitleRef.current,
            locationTitleRef.current,
            contactTitleRef.current,
            ...socialLinkMaskRefs.current,
        ]

        upperItems.forEach((item) => item.animateOut?.({ duration }))

        bottomItems.forEach((item) => item.animateOut?.({ duration: 0.1 }))

        imagesRef.current?.animateOut({
            duration: duration * 0.25,
            ease,
        })
    }, [])

    useImperativeHandle(ref, () => ({
        getElement: () => {
            return containerRef.current
        },
    }))

    useEffect(() => {
        if (navigationIsOpen) {
            animateIn()
        } else {
            animateOut()
        }
    }, [navigationIsOpen, animateIn, animateOut])

    useEffect(() => {
        if (!drawerData?.list?.length) return
        setImages([drawerData.list[0].itemImage])
    }, [drawerData])

    if (!drawerData) return null

    return (
        <div
            ref={containerRef}
            className={`Drawer ${className || ""} ${navigationIsOpen ? "navigationIsOpen" : ""}`}
            aria-hidden={!navigationIsOpen}
        >
            <div className="Drawer_navigationDrawerInner" id={DRAWER_INNER_ID}>
                <div className="Drawer_bg" ref={bgRef} />

                <div className="Drawer_navigationDrawerInner__content">
                    <button
                        className="Drawer_closeButton"
                        onClick={() => {
                            setNavigationIsOpen(false)
                        }}
                    >
                        <ContentMask element="span" ref={closeButtonTextRef}>
                            <span
                                onMouseEnter={() => setCursorState?.("FOCUS")}
                                onMouseLeave={() => setCursorState?.(null)}
                            >
                                (Close)
                            </span>
                        </ContentMask>
                    </button>

                    <div className="Drawer_top">
                        <div className="Drawer_description">
                            <p className="Drawer_description__title">
                                <ContentMask
                                    element="span"
                                    ref={descriptionTitleRef}
                                    text={drawerData?.descriptionTitle}
                                />
                            </p>
                            <p
                                className="Drawer_description__description"
                                ref={descriptionRef}
                            >
                                {drawerData?.description}
                            </p>
                        </div>

                        {drawerData.list && (
                            <div className="Drawer_finishesListContainer">
                                <p className="Drawer_finishesListTitle">
                                    <ContentMask
                                        element="span"
                                        ref={listTitleRef}
                                        text="Title"
                                    />
                                </p>
                                <ul className="Drawer_finishesList">
                                    {drawerData.list.map((item, i) => (
                                        <li
                                            key={i}
                                            className="Drawer_finishesList__item"
                                        >
                                            <button
                                                className="Drawer_finishesList__button"
                                                onMouseEnter={() => {
                                                    setImages((prev) => {
                                                        return [
                                                            ...prev,
                                                            item.itemImage,
                                                        ]
                                                    })
                                                }}
                                            >
                                                <ContentMask
                                                    element="span"
                                                    ref={(ref) => {
                                                        listItemRefs.current[
                                                            i
                                                        ] = ref
                                                    }}
                                                    text={item.itemTitle}
                                                ></ContentMask>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="Drawer_bottom">
                        <p className="Drawer_aboutTitle">
                            <ContentMask element="span" ref={aboutTitleRef}>
                                <span>{drawerData?.titleType}</span>
                            </ContentMask>
                        </p>

                        <p className="Drawer_locationTitle">
                            <ContentMask element="span" ref={locationTitleRef}>
                                <span>{drawerData?.titleLocation}</span>
                            </ContentMask>
                        </p>

                        <p className="Drawer_contactTitle">
                            <ContentMask element="span" ref={contactTitleRef}>
                                <span className="Drawer_contactTitle__contactText">
                                    Contact
                                </span>
                                <Link
                                    link={{
                                        linkType: "external",
                                        href: `mailto:${drawerData?.contactEmail}`,
                                        label: drawerData?.contactEmail,
                                    }}
                                />
                            </ContentMask>
                        </p>

                        {drawerData?.socialLinks?.length > 0 && (
                            <ul className="Drawer_socialLinks">
                                {drawerData.socialLinks.map((link, i) => (
                                    <li
                                        className="Drawer_socialLinks__item"
                                        key={i}
                                    >
                                        <ContentMask
                                            ref={(ref) => {
                                                socialLinkMaskRefs.current[i] =
                                                    ref
                                            }}
                                            innerClassName="Drawer_socialLinks__linkMask"
                                            element="span"
                                        >
                                            <Link
                                                className="Drawer_socialLinks__link"
                                                link={link}
                                            >
                                                <span className="Drawer_socialLinks__linkLabel">
                                                    {link.label}
                                                </span>
                                                <ArrowRight className="Drawer_socialLinks__arrow" />
                                            </Link>
                                        </ContentMask>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <DrawerImages ref={imagesRef} items={images} />
                    </div>
                </div>
            </div>

            <div
                className="Drawer_overlay"
                ref={overlayRef}
                onClick={() => setNavigationIsOpen(false)}
            />
        </div>
    )
})

Drawer.displayName = "Drawer"

export default Drawer
