import classnames from 'classnames'
import styles from './Preloader.module.scss'
import LogoSvg from '@/components/_svg/Logo'
import useStore from '@/store'
import SanityImage from '@/components/SanityImage/SanityImage'
import { getCropHeightFromWidth, getCropOptions, wait } from '@/utils'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/dist/Flip'
import { LOGO_CONTAINER_ID } from '@/sections/LogoWithProducts/LogoWithProducts'
import { MAIN_FADE_IN_DURATION } from '@/components/Layout/Layout'
import { ScrollContext } from '@/context/Scroll'
import useBreakpoint from '@/hooks/use-breakpoint'
import { useRouter } from 'next/router'

gsap.registerPlugin(Flip)

const LOAD_SPEED = 3.5

const Preloader = ({ className }) => {
  const globalData = useStore(state => state.globalData)
  const setLoaderAnimationComplete = useStore(state => state.setLoaderAnimationComplete)
  const setShowMainContent = useStore(state => state.setShowMainContent)
  const setCapContentHeight = useStore(state => state.setCapContentHeight)
  const preloaderData = globalData?.navigation?.preloader
  const logoContainerRefs = useRef([])
  const productImageContainerRefs = useRef([])
  const percentRef = useRef()
  const logoContainerRef = useRef()
  const loadingTextRef = useRef()
  const containerRef = useRef()
  const loadedPercentRef = useRef(0)
  const imageRotatorRef = useRef()
  const placeholderRef = useRef(0)
  const [render, setRender] = useState(true)
  const maskLeftRef = useRef()
  const maskRightRef = useRef()
  const { scroll } = useContext(ScrollContext)
  const { isMobile } = useBreakpoint()
  const router = useRouter()
  const is404 = router.pathname === '/404'

  const animations = useCallback(() => {
    const closeLogoDuration = 1.2
    const closeLogoEase = 'Power3.easeInOut'

    const closeLogoContainer = () => {
      const leftLogo = logoContainerRefs.current[0]
      const rightLogo = logoContainerRefs.current[1]

      setCapContentHeight(false)

      if (!leftLogo || !rightLogo) return

      gsap.killTweensOf([leftLogo, rightLogo, maskLeftRef.current, maskRightRef.current])

      const duration = closeLogoDuration
      const ease = closeLogoEase

      gsap.to(leftLogo, {
        x: 0,
        ease,
        duration,
      })

      gsap.to(rightLogo, {
        x: 0,
        ease,
        duration,
      })

      gsap.to(imageRotatorRef.current, {
        left: '50.5%',
        ease,
        duration,
      })

      gsap.to(maskLeftRef.current, {
        x: 0,
        ease,
        duration,
        onComplete: () => {
          gsap.set(imageRotatorRef.current, {
            display: 'none',
          })
        },
      })

      gsap.to(maskRightRef.current, {
        x: 0,
        ease,
        duration,
      })
    }

    const animateOut = () => {
      const hugeLogo = document.getElementById(LOGO_CONTAINER_ID)

      gsap.to([percentRef.current, loadingTextRef.current], {
        y: '-110%',
        stagger: 0.1,
        duration: 1.2,
        ease: 'Power3.easeInOut',
      })

      const onComplete = () => {
        if (hugeLogo) {
          setLoaderAnimationComplete(true)
          gsap.set(hugeLogo, {
            autoAlpha: 1,
          })
          gsap.to(logoContainerRef.current, {
            autoAlpha: 0,
            delay: MAIN_FADE_IN_DURATION,
            duration: 0.05,
            onComplete: () => {
              setRender(false)
            },
          })
        } else {
          setLoaderAnimationComplete(true)
          setRender(false)
          setShowMainContent(true)
          scroll?.start()
        }
      }

      if (hugeLogo) {
        closeLogoContainer()
        Flip.fit(logoContainerRef.current, hugeLogo, {
          duration: 2.3,
          ease: 'Power4.easeInOut',
          scale: true,
          onUpdate: function () {
            const threshold = isMobile ? 0.75 : 0.65

            if (this.progress() > threshold) {
              setShowMainContent(true)
              scroll?.start()
            }
          },
          onComplete: onComplete,
        })
      } else {
        const svgs = []
        logoContainerRefs.current.forEach(el => {
          const svg = el.querySelectorAll('svg')[0]
          svgs.push(svg)
        })

        closeLogoContainer()

        const duration = closeLogoDuration
        const ease = closeLogoEase

        gsap.to(svgs[0], {
          y: '-105%',
          duration,
          ease,
        })

        gsap.to(svgs[1], {
          y: '105%',
          duration,
          ease,
          onComplete: onComplete,
        })
      }
    }

    return {
      animateOut,
      animatePercent: () => {
        const intervalPeriod = Math.ceil(100 / productImageContainerRefs.current.length)

        gsap.to(placeholderRef, {
          current: 99,
          duration: LOAD_SPEED * 0.75,
          ease: 'linear',
          onUpdate: () => {
            const value = Math.round(placeholderRef.current)
            const toHide = Math.floor(value / intervalPeriod)
            for (let index = 0; index < toHide; index++) {
              const element = productImageContainerRefs.current[index]
              if (element) {
                gsap.set(element, { autoAlpha: 0 })
              }
            }
          },
          onComplete: () => {
            animateOut()
          },
        })

        gsap.to(loadedPercentRef, {
          current: 99,
          duration: LOAD_SPEED,
          ease: 'Power4.easeInOut',
          onUpdate: () => {
            let value = Math.round(loadedPercentRef.current)
            if (value < 10) value = `0${value}`
            if (percentRef.current) {
              percentRef.current.innerHTML = `${value}%`
            }
          },
        })
      },
      openUp: async () => {
        let inc = 0
        const int = setInterval(() => {
          window.scroll(0, 0)
          inc++
          if (inc === 15) {
            clearInterval(int)
            scroll?.stop()
            gsap.to(containerRef.current, {
              autoAlpha: 1,
              delay: 0.05,
            })
          }
        }, 10)

        const leftLogo = logoContainerRefs.current[0]
        const rightLogo = logoContainerRefs.current[1]
        if (!leftLogo || !rightLogo) return
        gsap.killTweensOf([leftLogo, rightLogo, maskLeftRef.current, maskRightRef.current])

        await wait(100)

        const duration = 0.8
        const ease = 'Power3.easeInOut'

        gsap.to(leftLogo, {
          x: '-22.5%',
          ease,
          duration,
        })

        gsap.to(rightLogo, {
          x: '18.5%',
          ease,
          duration,
        })

        gsap.to(imageRotatorRef.current, {
          left: '50%',
          ease,
          duration,
        })

        gsap.to(maskLeftRef.current, {
          x: '-100%',
          ease,
          duration,
        })
        gsap.to(maskRightRef.current, {
          x: '100%',
          ease,
          duration,
        })
      },
    }
  }, [setLoaderAnimationComplete, scroll, setShowMainContent, isMobile, setCapContentHeight])

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_PRELOADER === 'true' || is404) {
      scroll?.scrollTo(0, { immediate: true })
      setRender(false)
      setLoaderAnimationComplete(true)
      setShowMainContent(true)
      return
    }

    if (!render) return

    scroll?.scrollTo(0, { immediate: true })

    setTimeout(() => {
      animations().animatePercent()
      animations().openUp()
    }, 20)
  }, [animations, render, is404, setLoaderAnimationComplete, setShowMainContent, scroll])

  if (!preloaderData || !render) return null

  return (
    <div
      className={classnames(styles.Preloader, className)}
      ref={containerRef}
    >
      <div
        className={styles.imageRotator}
        ref={imageRotatorRef}
      >
        <div
          className={styles.productImageContainer__leftMask}
          ref={maskLeftRef}
        />
        <div
          className={styles.productImageContainer__rightMask}
          ref={maskRightRef}
        />
        {preloaderData.products.map((product, i) => {
          const image = product?.productData?.variants[0]?.image

          if (!image) return null

          return (
            <div
              className={styles.productImageContainer}
              key={i}
              style={{ zIndex: preloaderData.products.length - i }}
              ref={ref => {
                productImageContainerRefs.current[i] = ref
              }}
            >
              {isMobile !== null && (
                <SanityImage
                  className={styles.productImage}
                  image={image}
                  priority
                  width={isMobile ? 76 : 214}
                  height={isMobile ? 103 : 291}
                  breakpoints={{
                    tablet: {
                      width: 410,
                      image,
                      options: getCropOptions(product.productData.imageOrientation, 'portrait', {
                        height: getCropHeightFromWidth('portrait', 410),
                      }),
                    },
                    xs: {
                      width: 160,
                      image,
                      options: getCropOptions(product.productData.imageOrientation, 'portrait', {
                        height: getCropHeightFromWidth('portrait', 160),
                      }),
                    },
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div
        className={styles.logoContainer}
        ref={logoContainerRef}
      >
        <div
          className={styles.logoLeftContainer}
          ref={ref => {
            logoContainerRefs.current[0] = ref
          }}
        >
          <LogoSvg className={styles.logoLeft} />
        </div>
        <div
          className={styles.logoRightContainer}
          ref={ref => {
            logoContainerRefs.current[1] = ref
          }}
        >
          <LogoSvg className={styles.logoRight} />
        </div>
      </div>
      <div className={styles.bottom}>
        <p
          className={styles.loadingText}
          ref={loadingTextRef}
        >
          (loading)
        </p>
        <p
          className={styles.percentText}
          ref={percentRef}
        >
          00%
        </p>
      </div>
    </div>
  )
}

Preloader.displayName = 'Preloader'

export default Preloader
