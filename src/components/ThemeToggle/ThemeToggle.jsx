import { useEffect, useRef } from 'react'
import useStore from '@/store'
import styles from './ThemeToggle.module.scss'
import styleExports from '@/styles/export-vars.module.scss'

const { themeTransitionDuration } = styleExports

const THEME_TRANSITION_DURATION = parseFloat(themeTransitionDuration)

const ThemeToggle = () => {
  const setTheme = useStore(state => state.setTheme)
  const theme = useStore(state => state.theme)
  const inactiveTheme = theme === 'light' ? 'dark' : 'light'
  const timeoutRef = useRef()
  const buttonRef = useRef(null)
  const setCursorState = useStore(state => state.setCursorState)

  const animateAllComponents = (reset = false) => {
    const themedElements = document.querySelectorAll('[data-themed]')
    const elements = []

    for (let index = 0; index < themedElements.length; index++) {
      elements.push(themedElements[index])
    }

    elements.forEach(element => {
      if (!element) return

      if (reset && element) {
        element.style.removeProperty('transition')
        return
      }

      if (!element.dataset.themed) return

      const toTransition = element.dataset.themed.split(',')
      element.style.transition = toTransition.map(property => `${property} ${THEME_TRANSITION_DURATION}s`).join(',')
    })
  }

  const handleClick = () => {
    setTheme(inactiveTheme)
  }

  useEffect(() => {
    if (!theme) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    animateAllComponents()
    timeoutRef.current = setTimeout(
      () => {
        animateAllComponents(true)
      },
      THEME_TRANSITION_DURATION * 1.1 * 1000,
    )
  }, [theme])

  useEffect(() => {
    let isLight = true
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isLight = false
    }
    setTheme(isLight ? 'light' : 'dark')
  }, [setTheme])

  useEffect(() => {
    if (!theme) return
    document.body.dataset.theme = theme
  }, [theme])

  return (
    <div className={styles.container}>
      <div className={styles.spacer} />
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={styles.ThemeToggle}
        aria-label={`Turn on ${inactiveTheme} theme.`}
        data-themed="background-color"
        onMouseEnter={() => {
          setCursorState('FOCUS')
        }}
        onMouseLeave={() => {
          setCursorState(null)
        }}
      >
        <div className={styles.dot} />
      </button>
    </div>
  )
}

ThemeToggle.displayName = 'ThemeToggle'

export default ThemeToggle
