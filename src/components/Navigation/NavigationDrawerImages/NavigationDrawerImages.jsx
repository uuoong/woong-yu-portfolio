import classnames from 'classnames'
import styles from './NavigationDrawerImages.module.scss'
import useStore from '@/store'
import SanityImage from '@/components/SanityImage/SanityImage'
import { getCropHeightFromWidth, getCropOptions } from '@/utils'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'

const NavigationDrawerImages = forwardRef(({ className, productImages }, ref) => {
  const globalData = useStore(state => state.globalData)
  const drawerData = globalData?.navigation?.navigationDrawerContent
  const containerRef = useRef()

  const animateIn = options => {
    if (!containerRef.current) return
    gsap.killTweensOf(containerRef.current)
    gsap.to(containerRef.current, {
      '--left-y': '100%',
      '--right-y': '100%',
      duration: options?.duration || 1.8,
      ease: options?.ease || 'Power3.easeInOut',
      delay: options?.delay || 0,
    })
  }

  const animateOut = options => {
    if (!containerRef.current) return
    gsap.killTweensOf(containerRef.current)
    gsap.to(containerRef.current, {
      '--left-y': '0%',
      '--right-y': '0%',
      duration: options?.duration || 1.8,
      ease: options?.ease || 'Power3.easeInOut',
      delay: options?.delay || 0,
    })
  }

  useImperativeHandle(ref, () => ({
    animateIn,
    animateOut,
  }))

  if (!drawerData || !productImages?.length) return null

  return (
    <div
      ref={containerRef}
      className={classnames(styles.NavigationDrawerImages, className)}
    >
      <div className={styles.inner}>
        {productImages?.map((image, i) => (
          <div
            key={i}
            className={styles.productImageContainer}
            ref={ref => {
              if (ref) {
                setTimeout(() => {
                  ref.classList.add(styles.isActive)
                }, 5)
              }
            }}
          >
            <SanityImage
              image={image}
              className={styles.image}
              priority
              breakpoints={{
                tablet: {
                  width: 410,
                  image: image,
                  options: getCropOptions(drawerData.materialsListProduct?.productData?.imageOrientation, 'portrait', {
                    height: getCropHeightFromWidth('portrait', 410),
                  }),
                },
                xs: {
                  width: 160,
                  image: image,
                  options: getCropOptions(drawerData.materialsListProduct?.productData?.imageOrientation, 'portrait', {
                    height: getCropHeightFromWidth('portrait', 160),
                  }),
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

NavigationDrawerImages.displayName = 'NavigationDrawerImages'

export default NavigationDrawerImages
