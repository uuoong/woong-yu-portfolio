import classnames from 'classnames'
import styles from './NavigationDrawer.module.scss'
import useStore from '@/store'
import Link from '@/components/Link/Link'
import ArrowRight from '@/components/_svg/ArrowRight'
import NavigationDrawerImages from '@/components/Navigation/NavigationDrawerImages/NavigationDrawerImages'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ContentMask from '@/components/ContentMask/ContentMask'
import gsap from 'gsap'

export const DRAWER_ANIMATION_CONFIG = {
  IN: {
    duration: 1.3,
    ease: 'Power3.easeInOut',
  },
  OUT: {
    duration: 0.8,
    ease: 'Power3.easeOut',
  },
}

export const DRAWER_INNER_ID = 'drawer-innnnurrrrr'

const NavigationDrawer = forwardRef(({ className }, ref) => {
  const globalData = useStore(state => state.globalData)
  const drawerData = globalData?.navigation?.navigationDrawerContent
  const [materialImages, setMaterialImages] = useState([])
  const setNavigationIsOpen = useStore(state => state.setNavigationIsOpen)
  const navigationIsOpen = useStore(state => state.navigationIsOpen)
  const setCursorState = useStore(state => state.setCursorState)
  const containerRef = useRef()

  // Refs
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

  // Animate In
  const animateIn = useCallback(() => {
    gsap.killTweensOf([bgRef.current, descriptionRef.current, overlayRef.current])

    const duration = DRAWER_ANIMATION_CONFIG.IN.duration
    const ease = DRAWER_ANIMATION_CONFIG.IN.ease

    gsap.to(bgRef.current, {
      scaleY: 1,
      duration,
      ease,
    })

    gsap.to(overlayRef.current, {
      autoAlpha: 0.5,
      duration,
      ease,
    })

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
    ]

    const bottomItems = [
      ...socialLinkMaskRefs.current,
      aboutTitleRef.current,
      locationTitleRef.current,
      contactTitleRef.current,
    ]

    upperItems.forEach(item => {
      item.animateIn({ delay: duration * 0.3 })
    })

    bottomItems.forEach(item => {
      item.animateIn({ delay: duration * 0.7 })
    })

    productImagesRef.current.animateIn({
      duration: duration * 1.2,
      ease,
      delay: duration * 0.25,
    })
  }, [])

  // Animate In
  const animateOut = useCallback(() => {
    gsap.killTweensOf([bgRef.current, descriptionRef.current, overlayRef.current])
    const duration = DRAWER_ANIMATION_CONFIG.OUT.duration
    const ease = DRAWER_ANIMATION_CONFIG.OUT.ease

    gsap.to(bgRef.current, {
      scaleY: 0,
      duration,
      ease,
    })

    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration,
      ease,
    })

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
    ]

    const bottomItems = [
      ...socialLinkMaskRefs.current,
      aboutTitleRef.current,
      locationTitleRef.current,
      contactTitleRef.current,
    ]

    upperItems.forEach(item => {
      item.animateOut({ duration })
    })

    bottomItems.forEach(item => {
      item.animateOut({ duration: 0.1 })
    })

    productImagesRef.current.animateOut({
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
    const firstVariant = drawerData?.materialsListProduct?.productData?.variants[0]
    if (!firstVariant) return
    setMaterialImages([firstVariant.image])
  }, [drawerData])

  if (!drawerData) return null

  return (
    <div
      ref={containerRef}
      className={classnames(styles.NavigationDrawer, className, { [styles.navigationIsOpen]: navigationIsOpen })}
      aria-hidden={!navigationIsOpen}
    >
      <div
        className={styles.navigationDrawerInner}
        id={DRAWER_INNER_ID}
      >
        <div
          className={styles.bg}
          ref={bgRef}
        />
        <div className={styles.navigationDrawerInner__content}>
          <button
            className={styles.closeButton}
            onClick={() => {
              setNavigationIsOpen(false)
            }}
          >
            <ContentMask
              element="span"
              ref={closeButtonTextRef}
            >
              <span
                onMouseEnter={() => {
                  setCursorState('FOCUS')
                }}
                onMouseLeave={() => {
                  setCursorState(null)
                }}
              >
                (Close)
              </span>
            </ContentMask>
          </button>
          <div className={styles.top}>
            <div className={styles.description}>
              <p className={styles.description__title}>
                <ContentMask
                  element="span"
                  ref={descriptionTitleRef}
                  text={drawerData?.titleDescription}
                />
              </p>
              <p
                className={styles.description__description}
                ref={descriptionRef}
              >
                {drawerData?.description}
              </p>
            </div>
            {drawerData.materialsListProduct && (
              <div className={styles.finishesListContainer}>
                <p className={styles.finishesListTitle}>
                  <ContentMask
                    element="span"
                    ref={materialTitleRef}
                    text="Finishes"
                  />
                </p>
                <ul className={styles.finishesList}>
                  {drawerData.materialsListProduct?.productData?.variants?.map((variant, i) => (
                    <li
                      key={i}
                      className={styles.finishesList__item}
                    >
                      <button
                        className={styles.finishesList__button}
                        onMouseEnter={() => {
                          setMaterialImages(prev => {
                            return [...prev, variant.image]
                          })
                        }}
                      >
                        <ContentMask
                          element="span"
                          ref={ref => {
                            materialItemRefs.current[i] = ref
                          }}
                          text={variant.material}
                        ></ContentMask>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={styles.bottom}>
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
            <p className={styles.contactTitle}>
              <ContentMask
                element="span"
                ref={contactTitleRef}
              >
                <span className={styles.contactTitle__contactText}>Contact</span>
                <Link
                  link={{
                    linkType: 'external',
                    link: `mailto:${drawerData?.contactEmail}`,
                    label: drawerData?.contactEmail,
                  }}
                />
              </ContentMask>
            </p>
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
            <NavigationDrawerImages
              ref={productImagesRef}
              productImages={materialImages}
            />
          </div>
        </div>
      </div>
      <div
        className={styles.overlay}
        ref={overlayRef}
        onClick={() => {
          setNavigationIsOpen(false)
        }}
      />
    </div>
  )
})

NavigationDrawer.displayName = 'NavigationDrawer'

export default NavigationDrawer
