import styles from './Navigation.module.scss'
import useStore from '@/store'
import Clock from '@/components/Clock/Clock'
import { useContext, useEffect, useRef, useState } from 'react'
import { ScrollContext } from '@/context/Scroll'
import Link from '@/components/Link/Link'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import NavigationDrawer, { DRAWER_ANIMATION_CONFIG } from '@/components/Navigation/NavigationDrawer/NavigationDrawer'
import scssExports from '@/styles/export-vars.module.scss'
import gsap from 'gsap'
import { DOC_TYPES } from '@/data'
import useBreakpoint from '@/hooks/use-breakpoint'
import MobileNav from '@/sections/MobileNav/MobileNav'
import classNames from 'classnames'

const { navigationDrawerAnimationDistance } = scssExports

export const HEADER_ID = 'header_yeeeeeeeee'

const SCROLL_CALLBACK_KEY = 'scrollkeeeeeee'

const Navigation = () => {
  const globalData = useStore(state => state.globalData)
  const navigationData = globalData?.navigation
  const { onScrollCallback } = useContext(ScrollContext)
  const percentScrolledRef = useRef()
  const navigationRef = useRef()
  const setNavigationIsOpen = useStore(state => state.setNavigationIsOpen)
  const navigationIsOpen = useStore(state => state.navigationIsOpen)
  const showMainContent = useStore(state => state.showMainContent)
  const drawerElementRef = useRef()
  const { isMobile } = useBreakpoint()
  const setCursorState = useStore(state => state.setCursorState)
  const productHovering = useStore(state => state.productHovering)
  const [debouncedProductHovering, setDebouncedProductHovering] = useState(false)
  const debounceTimeoutRef = useRef()

  useEffect(() => {
    if (isMobile) return
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedProductHovering(productHovering)
    }, 100)
  }, [productHovering, isMobile])

  useEffect(() => {
    if (!navigationRef.current || isMobile) return
    const config = DRAWER_ANIMATION_CONFIG[navigationIsOpen ? 'IN' : 'OUT']
    gsap.killTweensOf(navigationRef.current)
    gsap.to(navigationRef.current, {
      y: navigationIsOpen ? navigationDrawerAnimationDistance : 0,
      ease: config.ease,
      duration: config.duration,
    })
  }, [navigationIsOpen, isMobile])

  useEffect(() => {
    onScrollCallback({
      key: SCROLL_CALLBACK_KEY,
      callback: e => {
        const percent = Math.floor(e.progress * 100)
        let positivePercent = Math.abs(percent)
        if (positivePercent < 10) positivePercent = `0${positivePercent}`
        positivePercent = `${positivePercent}%`
        if (percent < 0) {
          positivePercent = `-${positivePercent}`
        }
        if (percentScrolledRef.current) {
          percentScrolledRef.current.innerHTML = positivePercent
        }
      },
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!navigationData) return null

  return (
    <>
      {!isMobile && (
        <NavigationDrawer
          ref={ref => {
            if (ref) {
              drawerElementRef.current = ref.getElement()
            }
          }}
        />
      )}

      {isMobile && <MobileNav />}

      <header
        id={HEADER_ID}
        className={classNames(styles.Navigation, { [styles.isVisible]: showMainContent })}
        ref={navigationRef}
      >
        <nav className={styles.nav}>
          <div className={styles.left}>
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
            <p className={styles.clock}>
              <Clock />
            </p>
            <p
              className={styles.percentScrolled}
              ref={percentScrolledRef}
              data-themed="color"
            >
              00%
            </p>
            {debouncedProductHovering && !isMobile && (
              <p className={styles.hoveredProduct}>
                <span>{debouncedProductHovering?.model}</span>
                <span>{debouncedProductHovering?.title}</span>
              </p>
            )}
          </div>
          <div className={styles.right}>
            {navigationData?.mainLinks?.map((link, i) => (
              <Link
                link={link}
                className={styles.link}
                key={i}
              >
                <span className={styles.link__number}>{i + 1}.</span>
                <span className={styles.link__label}>{link.label}</span>
              </Link>
            ))}
            <button
              className={styles.drawerButton}
              onClick={() => {
                setNavigationIsOpen(true)
              }}
              onMouseEnter={() => {
                setCursorState('FOCUS')
              }}
              onMouseLeave={() => {
                setCursorState(null)
              }}
            >
              <span
                className={styles.link__number}
                data-themed="color"
              >
                {navigationData?.mainLinks?.length + 1}.
              </span>
              <span
                className={styles.link__label}
                data-themed="color"
              >
                {isMobile ? 'Menu' : 'Information'}
              </span>
            </button>
            <ThemeToggle />
          </div>
        </nav>
      </header>
    </>
  )
}

Navigation.displayName = 'Navigation'

export default Navigation
