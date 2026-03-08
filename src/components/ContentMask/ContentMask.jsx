import classnames from 'classnames'
import styles from './ContentMask.module.scss'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import useInView from '@/hooks/use-in-view'
import useStore from '@/store'

const EASE = 'Power3.easeOut'
const DURATION = 1.2

// startPos === UP, DOWN
const ContentMask = forwardRef(
  (
    {
      className,
      innerClassName,
      element,
      text,
      startPos = 'DOWN',
      children,
      animateInView,
      delay = 0,
      onInView,
      duration,
    },
    ref,
  ) => {
    const Element = element || 'div'
    const innerRefs = useRef([])
    const containerRef = useRef()
    const { setElementToObserve, isInView } = useInView()
    const textLines = text?.split('\n')
    const loaderAnimationComplete = useStore(state => state.loaderAnimationComplete)

    const animateIn = options => {
      if (!innerRefs.current?.length) return
      gsap.killTweensOf(innerRefs.current)

      const config = {
        y: 0,
        ease: EASE,
        duration: options?.duration || DURATION,
        delay: options?.delay || 0,
      }

      if (config?.stagger || innerRefs.current?.length > 1) {
        config.stagger = config?.stagger || 0.1
      }

      gsap.to(innerRefs.current, config)
    }

    const animateOut = options => {
      if (!innerRefs.current?.length) return
      gsap.killTweensOf(innerRefs.current)

      // direction === UP, DOWN
      let y = '-105%'
      if (options?.direction === 'DOWN') {
        y = '105%'
      }

      const config = {
        y,
        ease: EASE,
        duration: options?.duration || DURATION,
        delay: options?.delay || 0,
      }

      if (config?.stagger || innerRefs.current?.length > 1) {
        config.stagger = config?.stagger || 0.1
      }

      gsap.to(innerRefs.current, config)
    }

    useEffect(() => {
      if (isInView && animateInView && loaderAnimationComplete) {
        setTimeout(() => {
          if (onInView) onInView()
          animateIn({
            duration: duration || DURATION,
          })
        }, delay * 1000)
      }
    }, [isInView, animateInView, delay, onInView, duration, loaderAnimationComplete])

    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
    }))

    return (
      <Element
        ref={ref => {
          containerRef.current = ref
          setElementToObserve(ref)
        }}
        className={classnames(styles.ContentMask, className)}
        data-start-pos={startPos}
      >
        {textLines?.length > 0 && (
          <>
            {textLines.map((line, i) => (
              <span
                className={classnames(styles.inner, innerClassName)}
                ref={ref => {
                  innerRefs.current[i] = ref
                }}
                key={i}
                data-themed="color"
              >
                {line}
              </span>
            ))}
          </>
        )}
        {children && !text && (
          <span
            ref={ref => {
              innerRefs.current[0] = ref
            }}
            className={classnames(styles.inner, innerClassName)}
          >
            {children}
          </span>
        )}
      </Element>
    )
  },
)

ContentMask.displayName = 'ContentMask'

export default ContentMask
