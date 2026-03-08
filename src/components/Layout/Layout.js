import Preloader from '@/components/Preloader/Preloader'
import styles from './Layout.module.scss'
import useStore from '@/store'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Navigation from '@/components/Navigation/Navigation'
import { DRAWER_ANIMATION_CONFIG, DRAWER_INNER_ID } from '@/components/Navigation/NavigationDrawer/NavigationDrawer'
import PageTransition from '@/components/PageTransition/PageTransition'
import Wipe from '@/components/Wipe/Wipe'
import ProductGridTextImageContainer from '@/sections/ProductGridTextImageContainer/ProductGridTextImageContainer'
import { useRouter } from 'next/router'
import ProductZoomView from '@/components/ProductZoomView/ProductZoomView'
import useBreakpoint from '@/hooks/use-breakpoint'
import Cursor from '@/sections/Cursor/Cursor'
import FixedProductGridHeader from '@/components/FixedProductGridHeader/FixedProductGridHeader'
import classNames from 'classnames'
import NextProduct from '@/components/NextProduct/NextProduct'
import { TRANSITION_DURATION_MS } from '@/data'

export const SCROLL_CONTAINER_CLASS = styles.scrollContainer
export const SCROLL_CONTENT_CLASS = styles.scrollContainerInner
export const MAIN_FADE_IN_DURATION = 0.3

const Layout = ({ children, nextItem }) => {
  const mainRef = useRef()
  const scrollContentRef = useRef()
  const showMainContent = useStore(state => state.showMainContent)
  const navigationIsOpen = useStore(state => state.navigationIsOpen)
  const capContentHeight = useStore(state => state.capContentHeight)
  const router = useRouter()
  const { isMobile } = useBreakpoint()
  const [cachedNextItem, setCachedNextItem] = useState(nextItem)
  const cachedNextItemDebounce = useRef()

  useEffect(() => {
    if (cachedNextItemDebounce.current) {
      clearTimeout(cachedNextItemDebounce.current)
    }

    cachedNextItemDebounce.current = setTimeout(() => {
      setCachedNextItem(nextItem)
    }, TRANSITION_DURATION_MS)
  }, [nextItem])

  useEffect(() => {
    if (!scrollContentRef.current || isMobile) return
    const config = DRAWER_ANIMATION_CONFIG[navigationIsOpen ? 'IN' : 'OUT']
    const innerDrawerHeight = document.getElementById(DRAWER_INNER_ID)?.offsetHeight
    gsap.to(scrollContentRef.current, {
      y: navigationIsOpen ? innerDrawerHeight : 0,
      ease: config.ease,
      duration: config.duration,
    })
  }, [navigationIsOpen, isMobile])

  useEffect(() => {
    if (!showMainContent) return
    const duration = router.pathname === '/' ? MAIN_FADE_IN_DURATION : 1.2
    if (showMainContent) {
      document.body.dataset.showMainContent = true
    }
    gsap.to(mainRef.current, {
      autoAlpha: 1,
      duration,
    })
  }, [showMainContent, router.pathname])

  return (
    <>
      <Preloader />
      <Navigation />
      <main
        id="main"
        ref={mainRef}
        className={classNames(SCROLL_CONTAINER_CLASS, { [styles.disableScroll]: capContentHeight })}
        data-themed="background-color"
      >
        <div
          ref={scrollContentRef}
          className={classNames(SCROLL_CONTENT_CLASS, { [styles.hasNextItem]: cachedNextItem })}
        >
          <PageTransition>{children}</PageTransition>
        </div>
        <NextProduct
          className={styles.nextProduct}
          product={cachedNextItem}
        />
      </main>
      <ProductGridTextImageContainer />
      <ProductZoomView />
      <Wipe />
      <Cursor />
      <FixedProductGridHeader />
    </>
  )
}

Layout.displayName = 'Layout'

export default Layout
