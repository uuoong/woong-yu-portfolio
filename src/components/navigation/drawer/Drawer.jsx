/**
 * Drawer.jsx
 *
 * 레퍼런스: Drawer.jsx (원본)
 *
 * ─── drawerData 경로 변경 ─────────────────────────────────────────────────
 *  원본: globalData?.navigation?.DrawerContent
 *  현재: navData?.drawerContent  (AppContext의 navData)
 *
 * ─── materialsListProduct → worksListItems ───────────────────────────────
 *  원본: drawerData.materialsListProduct.productData.variants (Sanity 제품 변형)
 *  현재: drawerData.worksListItems [{ label, image }] (직접 관리)
 *  이유: Sanity CMS 없음, 작업 목록을 data.js에서 직접 관리
 *
 * ─── 원본 구조 그대로 ─────────────────────────────────────────────────────
 *  forwardRef + useImperativeHandle (getElement)
 *  animateIn / animateOut — 원본 GSAP 로직 그대로
 *  ContentMask refs (upperItems, bottomItems 분류)
 *  materialImages state → 첫 번째 이미지 초기화 + hover 스택 추가
 */

import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react"
import gsap from "gsap"
import ContentMask from "../../content_mask/ContentMask.jsx"
import DrawerImages from "./DrawerImages.jsx"
import Link from "../../link/Link.jsx"
import ArrowRight from "../../_svg/ArrowRight.js"
import { useAppContext } from "../../../context/App.js"

export const DRAWER_ANIMATION_CONFIG = {
    IN: { duration: 1.3, ease: "Power3.easeInOut" },
    OUT: { duration: 0.8, ease: "Power3.easeOut" },
}

export const DRAWER_INNER_ID = "drawer-innnnurrrrr"

const Drawer = forwardRef(({ className }, ref) => {
    const {
        navData,
        navigationIsOpen,
        setNavigationIsOpen,
        setCursorState,
        setDrawerHeight,
    } = useAppContext()

    const drawerData = navData?.drawerContent

    const [materialImages, setMaterialImages] = useState([])

    const containerRef = useRef()
    const bgRef = useRef()
    const closeButtonTextRef = useRef()
    const materialItemRefs = useRef([])
    const socialLinkMaskRefs = useRef([])
    const materialTitleRef = useRef()
    const descriptionTitleRef = useRef()
    const descriptionRef = useRef()
    const aboutTitleRef = useRef()
    const locationTitleRef = useRef()
    const contactTitleRef = useRef()
    const overlayRef = useRef()
    const productImagesRef = useRef()

    useEffect(() => {
        const el =
            containerRef.current || document.getElementById(DRAWER_INNER_ID)
        if (el && setDrawerHeight) setDrawerHeight(el.offsetHeight)
    }, [])

    useEffect(() => {
        const firstItem = drawerData?.worksListItems?.[0]
        if (!firstItem?.image) return
        setMaterialImages([firstItem.image])
    }, [drawerData])

    const animateIn = useCallback(() => {
        gsap.killTweensOf([
            bgRef.current,
            descriptionRef.current,
            overlayRef.current,
        ])

        const duration = DRAWER_ANIMATION_CONFIG.IN.duration
        const ease = DRAWER_ANIMATION_CONFIG.IN.ease

        gsap.to(bgRef.current, { scaleY: 1, duration, ease })
        gsap.to(overlayRef.current, { autoAlpha: 0.5, duration, ease })
        gsap.to(descriptionRef.current, {
            autoAlpha: 1,
            duration,
            ease,
            delay: duration * 0.5,
        })

        const upperItems = [
            closeButtonTextRef.current,
            ...materialItemRefs.current,
            materialTitleRef.current,
            descriptionTitleRef.current,
        ].filter(Boolean)

        const bottomItems = [
            ...socialLinkMaskRefs.current.filter(Boolean),
            aboutTitleRef.current,
            locationTitleRef.current,
            contactTitleRef.current,
        ].filter(Boolean)

        upperItems.forEach((item) =>
            item.animateIn?.({ delay: duration * 0.3 })
        )
        bottomItems.forEach((item) =>
            item.animateIn?.({ delay: duration * 0.7 })
        )

        productImagesRef.current?.animateIn({
            duration: duration * 1.2,
            ease,
            delay: duration * 0.25,
        })
    }, [])

    const animateOut = useCallback(() => {
        gsap.killTweensOf([
            bgRef.current,
            descriptionRef.current,
            overlayRef.current,
        ])

        const duration = DRAWER_ANIMATION_CONFIG.OUT.duration
        const ease = DRAWER_ANIMATION_CONFIG.OUT.ease

        gsap.to(bgRef.current, { scaleY: 0, duration, ease })
        gsap.to(overlayRef.current, { autoAlpha: 0, duration, ease })
        gsap.to(descriptionRef.current, {
            autoAlpha: 0,
            duration: duration * 0.5,
            ease,
        })

        const upperItems = [
            closeButtonTextRef.current,
            ...materialItemRefs.current,
            materialTitleRef.current,
            descriptionTitleRef.current,
        ].filter(Boolean)

        const bottomItems = [
            ...socialLinkMaskRefs.current.filter(Boolean),
            aboutTitleRef.current,
            locationTitleRef.current,
            contactTitleRef.current,
        ].filter(Boolean)

        upperItems.forEach((item) => item.animateOut?.({ duration }))
        bottomItems.forEach((item) => item.animateOut?.({ duration: 0.1 }))

        productImagesRef.current?.animateOut({
            duration: duration * 0.25,
            ease,
        })
    }, [])

    useImperativeHandle(ref, () => ({ getElement: () => containerRef.current }))

    useEffect(() => {
        if (navigationIsOpen) animateIn()
        else animateOut()
    }, [navigationIsOpen, animateIn, animateOut])

    if (!drawerData) return null

    return (
        <div
            ref={containerRef}
            className="Drawer"
            aria-hidden={!navigationIsOpen}
        >
            <div className="Drawer_navigationDrawerInner" id={DRAWER_INNER_ID}>
                <div className="Drawer_bg" ref={bgRef} />

                <div className="Drawer_navigationDrawerInner__content">
                    <button
                        className="Drawer_closeButton"
                        onClick={() => setNavigationIsOpen(false)}
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
                                    text={drawerData?.titleDescription}
                                />
                            </p>
                            <p
                                className="Drawer_description__description"
                                ref={descriptionRef}
                            >
                                {drawerData?.description}
                            </p>
                        </div>

                        {drawerData?.worksListItems?.length > 0 && (
                            <div className="Drawer_finishesListContainer">
                                <p className="Drawer_finishesListTitle">
                                    <ContentMask
                                        element="span"
                                        ref={materialTitleRef}
                                        text="Works"
                                    />
                                </p>
                                <ul className="Drawer_finishesList">
                                    {drawerData.worksListItems.map(
                                        (item, i) => (
                                            <li
                                                key={i}
                                                className="Drawer_finishesList__item"
                                            >
                                                <button
                                                    className="Drawer_finishesList__button"
                                                    onMouseEnter={() => {
                                                        if (item.image) {
                                                            setMaterialImages(
                                                                (prev) => [
                                                                    ...prev,
                                                                    item.image,
                                                                ]
                                                            )
                                                        }
                                                    }}
                                                >
                                                    <ContentMask
                                                        element="span"
                                                        ref={(r) => {
                                                            materialItemRefs.current[
                                                                i
                                                            ] = r
                                                        }}
                                                        text={item.label}
                                                    />
                                                </button>
                                            </li>
                                        )
                                    )}
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
                                        link: `mailto:${drawerData?.contactEmail}`,
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
                                            element="span"
                                            ref={(r) => {
                                                socialLinkMaskRefs.current[i] =
                                                    r
                                            }}
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
                        <DrawerImages
                            ref={productImagesRef}
                            productImages={materialImages}
                        />
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
