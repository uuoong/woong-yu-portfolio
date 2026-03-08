import classnames from 'classnames'
import styles from './MobileNav.module.scss'
import Link from '@/components/Link/Link'
import { DOC_TYPES } from '@/data'
import Clock from '@/components/Clock/Clock'
import ContentMask from '@/components/ContentMask/ContentMask'
import useStore from '@/store'
import { useEffect, useRef, useState } from 'react'
import ArrowRight from '@/components/_svg/ArrowRight'
import gsap from 'gsap'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { getUrlFromPageType } from '@/utils'

const MobileNav = ({ className }) => {
  const globalData = useStore(state => state.globalData)
  const navigationData = globalData?.navigation
  const drawerData = globalData?.navigation?.navigationDrawerContent
  const socialLinkMaskRefs = useRef([])
  const aboutTitleRef = useRef()
  const bgRef = useRef()
  const locationTitleRef = useRef()
  const navigationTitleRef = useRef()
  const linkLineRefs = useRef([])
  const linkTitleRefs = useRef([])
  const linkIndexRefs = useRef([])
  const descriptionTitleRef = useRef()
  const descriptionContainerRef = useRef()
  const descriptionContainerInnerRef = useRef()
  const descriptionRef = useRef()
  const [descriptionIsOpen, setDescriptionIsOpen] = useState(false)
  const navigationIsOpen = useStore(state => state.navigationIsOpen)
  const setNavigationIsOpen = useStore(state => state.setNavigationIsOpen)
  const router = useRouter()

  const animateInDescription = () => {
    const lastLine = linkLineRefs?.current[linkLineRefs?.current.length - 1]
    if (
      !descriptionTitleRef.current ||
      !descriptionRef.current ||
      !lastLine ||
      !descriptionContainerRef.current ||
      !descriptionContainerInnerRef.current
    ) {
      return
    }

    const duration = 0.8
    const ease = 'Power3.easeOut'
    const height = descriptionContainerInnerRef.current.offsetHeight

    descriptionTitleRef.current.animateIn()
    gsap.killTweensOf([descriptionRef.current, descriptionContainerRef.current, descriptionContainerInnerRef.current])
    gsap.to(descriptionRef.current, {
      autoAlpha: 1,
      duration,
      ease,
    })
    gsap.to(lastLine, {
      y: height,
      duration,
      ease,
    })
    gsap.to(descriptionContainerRef.current, {
      height,
      duration,
      ease,
    })
  }

  const animateOutDescription = () => {
    const lastLine = linkLineRefs?.current[linkLineRefs?.current.length - 1]
    if (
      !descriptionTitleRef.current ||
      !descriptionRef.current ||
      !lastLine ||
      !descriptionContainerRef.current ||
      !descriptionContainerInnerRef.current
    ) {
      return
    }

    descriptionTitleRef.current.animateOut({
      direction: 'DOWN',
    })
    const duration = 0.4
    const ease = 'Power3.easeOut'
    gsap.killTweensOf([descriptionRef.current, descriptionContainerRef.current, descriptionContainerInnerRef.current])
    gsap.to(descriptionRef.current, {
      autoAlpha: 0,
      duration,
      ease,
    })
    gsap.to(lastLine, {
      y: 0,
      duration,
      ease,
    })
    gsap.to(descriptionContainerRef.current, {
      height: 0,
      duration,
      ease,
    })
  }

  const animateIn = () => {
    if (
      !aboutTitleRef?.current ||
      !socialLinkMaskRefs?.current?.length ||
      !locationTitleRef?.current ||
      !navigationTitleRef?.current ||
      !linkLineRefs?.current?.length ||
      !linkTitleRefs?.current?.length ||
      !linkIndexRefs?.current?.length ||
      !bgRef?.current
    ) {
      return null
    }

    gsap.killTweensOf([...linkLineRefs?.current, navigationTitleRef.current])

    const duration = 1.2
    const ease = 'Power3.easeInOut'

    gsap.killTweensOf(bgRef?.current)
    gsap.to(bgRef?.current, {
      '--left-y': '100%',
      '--right-y': '100%',
      duration,
      ease,
    })

    const titleDelay = duration * 0.4
    navigationTitleRef.current.animateIn({
      delay: titleDelay,
    })
    linkTitleRefs?.current.forEach((ref, i) => {
      if (!ref) return
      ref.animateIn({
        delay: titleDelay + i * 0.1,
      })
    })
    linkIndexRefs?.current.forEach((ref, i) => {
      if (!ref) return
      ref.animateIn({
        delay: titleDelay + 0.1 + i * 0.1,
      })
    })

    linkLineRefs.current.forEach((el, i) => {
      gsap.to(el, {
        scaleX: 1,
        duration,
        ease,
        delay: titleDelay * 0.75 + i * 0.1,
      })
    })

    // bottom
    socialLinkMaskRefs.current?.forEach(ref => {
      if (!ref) return
      ref.animateIn({
        delay: duration * 0.8,
      })
    })

    const refs = [aboutTitleRef.current, locationTitleRef.current]
    refs.forEach(ref => {
      if (!ref) return
      ref.animateIn({
        delay: duration * 0.8,
      })
    })
  }

  const animateOut = () => {
    if (
      !aboutTitleRef?.current ||
      !socialLinkMaskRefs?.current?.length ||
      !locationTitleRef?.current ||
      !navigationTitleRef?.current ||
      !linkLineRefs?.current?.length ||
      !linkTitleRefs?.current?.length ||
      !linkIndexRefs?.current?.length ||
      !bgRef?.current
    ) {
      return null
    }

    gsap.killTweensOf([...linkLineRefs?.current, navigationTitleRef.current])

    const duration = 0.6
    const ease = 'Power3.easeOut'

    gsap.killTweensOf(bgRef?.current)
    gsap.to(bgRef?.current, {
      '--left-y': '0%',
      '--right-y': '0%',
      duration,
      ease,
    })

    const maskOutDuration = 0.6
    navigationTitleRef.current.animateOut({
      direction: 'DOWN',
    })
    linkTitleRefs?.current.forEach(ref => {
      if (!ref) return
      ref.animateOut({
        direction: 'DOWN',
        duration: maskOutDuration,
      })
    })
    linkIndexRefs?.current.forEach(ref => {
      if (!ref) return
      ref.animateOut({
        direction: 'DOWN',
        duration: maskOutDuration,
      })
    })
    gsap.to(linkLineRefs.current, {
      scaleX: 0,
      duration: duration,
      ease,
    })

    // bottom
    socialLinkMaskRefs.current?.forEach(ref => {
      if (!ref) return
      ref.animateOut({
        direction: 'DOWN',
        duration: maskOutDuration,
      })
    })

    const refs = [aboutTitleRef.current, locationTitleRef.current]
    refs.forEach(ref => {
      if (!ref) return
      ref.animateOut({
        duration: maskOutDuration,
        direction: 'DOWN',
      })
    })

    // Description
    setDescriptionIsOpen(false)
  }

  useEffect(() => {
    if (navigationIsOpen) {
      animateIn()
    } else {
      animateOut()
    }
  }, [navigationIsOpen])

  useEffect(() => {
    if (descriptionIsOpen) {
      animateInDescription()
    } else {
      animateOutDescription()
    }
  }, [descriptionIsOpen])

  return (
    <div className={classnames(styles.MobileNav, className, { [styles.navIsOpen]: navigationIsOpen })}>
      <div
        className={styles.bgContainer}
        ref={bgRef}
      >
        <div className={styles.header}>
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
            data-themed="color"
          >
            {navigationData?.title}
          </Link>
          <div className={styles.topRight}>
            <Clock className={styles.clock} />
            <button
              className={styles.close}
              onClick={() => {
                setNavigationIsOpen(false)
              }}
            >
              <span className={styles.close__text}>Close</span>
              <span className={styles.close__line} />
            </button>
          </div>
        </div>

        <div className={styles.navigationContainer}>
          <ContentMask
            element="div"
            ref={navigationTitleRef}
            className={styles.navigationContainer__titleContainer}
          >
            <span className={styles.navigationContainer__title}>(Navigation)</span>
          </ContentMask>
          <ul className={styles.linkList}>
            {navigationData?.mainLinks?.map((link, i) => (
              <li
                onClick={() => {
                  setNavigationIsOpen(false)
                }}
                key={i}
              >
                <Link
                  link={link}
                  className={classNames(styles.linkList__link, {
                    [styles.isActive]:
                      router.asPath === getUrlFromPageType(link?.link?._type, link?.link?.slug) && !descriptionIsOpen,
                  })}
                >
                  <span
                    className={styles.linkList__link__line}
                    ref={ref => {
                      linkLineRefs.current[i] = ref
                    }}
                  />
                  <ContentMask
                    element="span"
                    ref={ref => {
                      linkTitleRefs.current[i] = ref
                    }}
                  >
                    <span className={styles.linkList__link__label}>{link.label}</span>
                  </ContentMask>
                  <ContentMask
                    element="span"
                    ref={ref => {
                      linkIndexRefs.current[i] = ref
                    }}
                  >
                    <span className={styles.linkList__link__number}>0{i + 1}</span>
                  </ContentMask>
                </Link>
              </li>
            ))}
          </ul>
          <button
            className={classNames(styles.informationButton, { [styles.isActive]: descriptionIsOpen })}
            onClick={() => {
              setDescriptionIsOpen(prev => !prev)
            }}
          >
            <span
              className={styles.linkList__link__line}
              ref={ref => {
                linkLineRefs.current[navigationData?.mainLinks?.length] = ref
              }}
            />
            <ContentMask
              element="span"
              ref={ref => {
                linkTitleRefs.current[navigationData?.mainLinks?.length] = ref
              }}
            >
              <span
                className={styles.informationButton__label}
                data-themed="color"
              >
                Information
              </span>
            </ContentMask>
            <ContentMask
              element="span"
              ref={ref => {
                linkIndexRefs.current[navigationData?.mainLinks?.length] = ref
              }}
            >
              <span
                className={styles.informationButton__number}
                data-themed="color"
              >
                0{navigationData?.mainLinks?.length + 1}
              </span>
            </ContentMask>
            <span
              className={classnames(styles.linkList__link__line, styles.descriptionLine)}
              ref={ref => {
                linkLineRefs.current[navigationData?.mainLinks?.length + 1] = ref
              }}
            />
          </button>
          <div
            className={styles.descriptionContainer}
            ref={descriptionContainerRef}
          >
            <div
              className={styles.descriptionContainer__inner}
              ref={descriptionContainerInnerRef}
            >
              <p className={styles.descriptionContainer__title}>
                <ContentMask
                  element="span"
                  ref={descriptionTitleRef}
                  text={drawerData?.titleDescription}
                />
              </p>
              <p
                className={styles.descriptionContainer__description}
                ref={descriptionRef}
              >
                {drawerData?.description}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.bottomContainer}>
          {drawerData?.socialLinks?.length > 0 && (
            <ul className={styles.socialLinks}>
              {drawerData?.socialLinks?.map((link, i) => (
                <li
                  className={styles.socialLinks__item}
                  key={i}
                >
                  <ContentMask
                    ref={ref => {
                      socialLinkMaskRefs.current[i] = ref
                    }}
                    innerClassName={styles.socialLinks__linkMask}
                    element="span"
                  >
                    <Link
                      className={styles.socialLinks__link}
                      link={link}
                    >
                      <span className={styles.socialLinks__linkLabel}>{link.label}</span>
                      <ArrowRight className={styles.socialLinks__arrow} />
                    </Link>
                  </ContentMask>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.bottomTitles}>
            <p className={styles.aboutTitle}>
              <ContentMask
                element="span"
                ref={aboutTitleRef}
              >
                <span>{drawerData?.titleType}</span>
              </ContentMask>
            </p>
            <p className={styles.locationTitle}>
              <ContentMask
                element="span"
                ref={locationTitleRef}
              >
                <span>{drawerData?.titleLocation}</span>
              </ContentMask>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

MobileNav.displayName = 'MobileNav'

export default MobileNav
