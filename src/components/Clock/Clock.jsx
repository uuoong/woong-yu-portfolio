import classnames from 'classnames'
import styles from './Clock.module.scss'
import { useEffect, useRef, useState } from 'react'
import useStore from '@/store'
import gsap from 'gsap'

const TIME_ZONES = {
  ATLANTIC: {
    title: 'Atlantic',
    offset: '+4:00',
    zone: 'America/St_Johns',
  },
  EASTERN: {
    title: 'Eastern',
    offset: '+5:00',
    zone: 'America/New_York',
  },
  CENTRAL: {
    title: 'Central',
    offset: '+6:00',
    zone: 'America/Chicago',
  },
  MOUNTAIN: {
    title: 'Mountain',
    offset: '+7:00',
    zone: 'America/Denver',
  },
  PACIFIC: {
    title: 'Pacific',
    offset: '+8:00',
    zone: 'America/Los_Angeles',
  },
  ALASKA: {
    title: 'Alaska',
    offset: '+9:00',
    zone: 'America/Nome',
  },
}

const Clock = ({ className }) => {
  const intervalRef = useRef(null)
  const globalData = useStore(state => state.globalData)
  const navigationData = globalData?.navigation
  const [time, setTime] = useState({ hour: '00', minutes: '00' })
  const colonRef = useRef()
  const timelineRef = useRef()

  useEffect(() => {
    if (!navigationData?.timeZone) return

    const fire = () => {
      const timestamp = new Date().toLocaleDateString('en-GB', {
        timeZone: TIME_ZONES[navigationData?.timeZone].zone,
        hour: '2-digit',
        minute: '2-digit',
      })

      const hourMinutesString = timestamp.split(' ')[1]
      const hour = parseInt(hourMinutesString.split(':')[0])
      let minutes = parseInt(hourMinutesString.split(':')[1])
      minutes = minutes >= 10 ? minutes : `0${minutes}`
      setTime({ hour, minutes })
    }

    fire()

    intervalRef.current = setInterval(() => {
      fire()
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [navigationData?.timeZone])

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    timelineRef.current = gsap.timeline({
      repeat: -1,
    })

    timelineRef.current.fromTo(
      colonRef.current,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.01,
      },
    )
    timelineRef.current.fromTo(
      colonRef.current,
      {
        autoAlpha: 1,
      },
      {
        autoAlpha: 0,
        duration: 0.01,
      },
      '+=1',
    )
    timelineRef.current.fromTo(
      colonRef.current,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 0,
        duration: 0.01,
      },
      '+=1',
    )
  }, [])

  return (
    <span className={classnames(styles.Clock, className)}>
      <span
        data-themed="color"
        className={styles.time}
      >
        <span className={styles.time__hour}>{time.hour}</span>
        <span
          className={styles.time__color}
          ref={colonRef}
        >
          :
        </span>
        <span className={styles.time__minutes}>{time.minutes}</span>
      </span>
      <span
        data-themed="color"
        className={styles.title}
      >
        {navigationData?.location}
      </span>
    </span>
  )
}

Clock.displayName = 'Clock'

export default Clock
