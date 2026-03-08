import styles from './PageTransition.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { TRANSITION_DURATION } from '@/data'
import useStore from '@/store'
import { useContext } from 'react'
import { ScrollContext } from '@/context/Scroll'

const START_STATE = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}

const END_STATE = {
  position: 'relative',
  top: 0,
  left: 0,
  width: '100%',
  height: 'auto',
  overflow: 'visible',
}

const ANIMATION = {
  start: {
    opacity: 0,
    ...START_STATE,
    transition: { duration: 0, delay: TRANSITION_DURATION },
  },
  enter: {
    opacity: 1,
    ...END_STATE,
  },
  exit: {
    ...END_STATE,
    opacity: 1,
    transition: { delay: TRANSITION_DURATION },
  },
}

const PageTransition = ({ className, children }) => {
  const router = useRouter()
  const setPageIsTransitioning = useStore(state => state.setPageIsTransitioning)
  const pageIsTransitioning = useStore(state => state.pageIsTransitioning)
  const { scroll } = useContext(ScrollContext)

  return (
    <div className={classNames(styles.PageTransition, className)}>
      <AnimatePresence
        mode="wait"
        initial={false}
      >
        <motion.div
          onAnimationStart={state => {
            if (state === 'exit') {
              scroll?.stop()
              setPageIsTransitioning(true)
            }
          }}
          initial="start"
          animate="enter"
          exit="exit"
          variants={ANIMATION}
          data-themed="background-color"
          key={router.asPath}
          className={classNames(styles.page, { [styles.pageIsTransitioning]: pageIsTransitioning })}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

PageTransition.displayName = 'PageTransition'

export default PageTransition
