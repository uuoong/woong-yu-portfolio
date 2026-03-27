import React, { useEffect, useRef } from "react"

import ContentMask from "../../components/content_mask/ContentMask.jsx"
import ArrowRight from "../../components/_svg/ArrowRight.js"
import Link from "../../components/link/Link.jsx"
import { useAppContext } from "../../context/App.js"

import useWindowResize from "../../hooks/use_window_resize.js"

const Footer = ({ className }) => {
    const { navData: navigationData } = useAppContext()
    const drawerData = navigationData?.drawerContent

    const title1Ref = useRef()
    const title2Ref = useRef()
    const title3Ref = useRef()
    const title4Ref = useRef()
    const containerRef = useRef()

    const resizeKey = useWindowResize()

    useEffect(() => {
        setTimeout(() => {
            document.body.style.setProperty(
                "--footer-height",
                `${containerRef.current?.offsetHeight}px`
            )
        }, 50)
    }, [resizeKey])

    if (!drawerData) return null

    return (
        <footer className="Footer" ref={containerRef}>
            <div className="Footer_grid">
                <p className="Footer_aboutTitle" data-themed="color">
                    <ContentMask element="span" ref={title1Ref} animateInView>
                        <span>{drawerData?.titleType}</span>
                    </ContentMask>
                </p>

                <p className="Footer_titleCopyright">
                    <ContentMask element="span" ref={title2Ref} animateInView>
                        <Link
                            link={{
                                linkType: "internal",
                                link: "/",
                            }}
                            className="Footer_title"
                        >
                            {navigationData?.title}
                        </Link>
                        <span className="Footer_copyright" data-themed="color">
                            {drawerData?.copyright}
                        </span>
                    </ContentMask>
                </p>

                <p className="Footer_contactTitle" data-themed="color">
                    <ContentMask element="span" ref={title3Ref} animateInView>
                        <span className="Footer_contactTitle__contactText">
                            Contact
                        </span>
                        <Link
                            link={{
                                linkType: "external",
                                link: `mailto:${drawerData?.contactEmail}`,
                            }}
                            disableThemeAttribute
                        >
                            <span>{drawerData?.contactEmail}</span>
                        </Link>
                    </ContentMask>
                </p>

                <p className="Footer_locationTitle">
                    <ContentMask element="span" animateInView ref={title4Ref}>
                        <span data-themed="color">
                            {drawerData?.titleLocation}
                        </span>
                    </ContentMask>
                </p>

                {drawerData?.socialLinks?.length > 0 && (
                    <ul className="Footer_socialLinks">
                        {drawerData.socialLinks.map((link, i) => (
                            <li className="Footer_socialLinks__item" key={i}>
                                <FooterLinkWithArrow link={link} />
                            </li>
                        ))}
                    </ul>
                )}

                <p className="Footer_getInTouch">
                    <FooterLinkWithArrow
                        link={{
                            linkType: "external",
                            link: `mailto:${drawerData?.contactEmail}`,
                            label: "Get In Touch",
                        }}
                    />
                </p>
            </div>
        </footer>
    )
}

const FooterLinkWithArrow = ({ link }) => {
    return (
        <ContentMask
            animateInView
            innerClassName="Footer_linkWithArrow"
            element="span"
        >
            <Link
                className="Footer_linkWithArrow__link"
                link={link}
                disableThemeAttribute
            >
                <span
                    data-themed="color"
                    className="Footer_linkWithArrow__linkLabel"
                >
                    {link.label}
                </span>
                <ArrowRight className="Footer_linkWithArrow__arrow" />
            </Link>
        </ContentMask>
    )
}

Footer.displayName = "Footer"

export default Footer
