import classnames from 'classnames'
import styles from './Footer.module.scss'
import useStore from '@/store'
import ContentMask from '@/components/ContentMask/ContentMask'
import { useEffect, useRef } from 'react'
import { DOC_TYPES } from '@/data'
import ArrowRight from '@/components/_svg/ArrowRight'
import Link from '@/components/Link/Link'
import useWindowResize from '@/hooks/use-window-resize'

const Footer = ({ className }) => {
  const globalData = useStore(state => state.globalData)
  const navigationData = globalData?.navigation
  const drawerData = globalData?.navigation?.navigationDrawerContent
  const title1Ref = useRef()
  const title2Ref = useRef()
  const title3Ref = useRef()
  const title4Ref = useRef()
  const containerRef = useRef()
  const resizeKey = useWindowResize()

  useEffect(() => {
    setTimeout(() => {
      document.body.style.setProperty('--footer-height', `${containerRef.current?.offsetHeight}px`)
    }, 50)
  }, [resizeKey])

  if (!drawerData) return null

  return (
    <footer
      className={classnames(styles.Footer, className)}
      ref={containerRef}
    >
      <div className={styles.grid}>
        <p
          className={styles.aboutTitle}
          data-themed="color"
        >
          <ContentMask
            element="span"
            ref={title1Ref}
            animateInView
          >
            <span>{drawerData?.titleType}</span>
          </ContentMask>
        </p>

        <p className={styles.titleCopyright}>
          <ContentMask
            element="span"
            ref={title2Ref}
            animateInView
          >
            <Link
              link={{
                linkType: 'internal',
                link: {
                  _id: 'anyString',
                  _type: DOC_TYPES.PAGE,
                  slug: 'home',
                },
              }}
              className={styles.title}
            >
              {navigationData?.title}
            </Link>
            <span
              className={styles.copyright}
              data-themed="color"
            >
              {drawerData?.copyright}
            </span>
          </ContentMask>
        </p>
        <p
          className={styles.contactTitle}
          data-themed="color"
        >
          <ContentMask
            element="span"
            ref={title3Ref}
            animateInView
          >
            <span className={styles.contactTitle__contactText}>Contact</span>
            <Link
              link={{
                linkType: 'external',
                link: `mailto:${drawerData?.contactEmail}`,
              }}
              disableThemeAttribute
            >
              <span>{drawerData?.contactEmail}</span>
            </Link>
          </ContentMask>
        </p>
        <p className={styles.locationTitle}>
          <ContentMask
            element="span"
            animateInView
            ref={title4Ref}
          >
            <span data-themed="color">{drawerData?.titleLocation}</span>
          </ContentMask>
        </p>
        {drawerData?.socialLinks?.length > 0 && (
          <ul className={styles.socialLinks}>
            {drawerData?.socialLinks?.map((link, i) => (
              <li
                className={styles.socialLinks__item}
                key={i}
              >
                <FooterLinkWithArrow link={link} />
              </li>
            ))}
          </ul>
        )}

        <p className={styles.getInTouch}>
          <FooterLinkWithArrow
            link={{
              linkType: 'external',
              link: `mailto:${drawerData?.contactEmail}`,
              label: 'Get In Touch',
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
      innerClassName={styles.linkWithArrow}
      element="span"
    >
      <Link
        className={styles.linkWithArrow__link}
        link={link}
        disableThemeAttribute
      >
        <span
          data-themed="color"
          className={styles.linkWithArrow__linkLabel}
        >
          {link.label}
        </span>
        <ArrowRight className={styles.linkWithArrow__arrow} />
      </Link>
    </ContentMask>
  )
}

Footer.displayName = 'Footer'

export default Footer
