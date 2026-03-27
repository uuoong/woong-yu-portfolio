import React, { useEffect, useRef, useState } from "react"
import gsap from "https://esm.sh/gsap"
import { useAppContext } from "../../context/App.js"

const TIME_ZONES = {
    SEOUL: {
        title: "Seoul",
        offset: "+9:00",
        zone: "Asia/Seoul",
    },
}

const Clock = ({ className }) => {
    const { navData: navigationData } = useAppContext()

    const intervalRef = useRef(null)
    const colonRef = useRef(null)
    const timelineRef = useRef(null)

    const [time, setTime] = useState({ hour: "00", minutes: "00" })

    useEffect(() => {
        if (!navigationData?.timeZone) return

        const fire = () => {
            const timestamp = new Date().toLocaleDateString("en-GB", {
                timeZone: TIME_ZONES[navigationData.timeZone]?.zone,
                hour: "2-digit",
                minute: "2-digit",
            })

            const hourMinutesString = timestamp.split(" ")[1]
            const hour = parseInt(hourMinutesString.split(":")[0])
            let minutes = parseInt(hourMinutesString.split(":")[1])
            minutes = minutes >= 10 ? minutes : `0${minutes}`

            setTime({ hour, minutes })
        }

        fire()

        intervalRef.current = setInterval(fire, 5000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [navigationData?.timeZone])

    useEffect(() => {
        if (timelineRef.current) timelineRef.current.kill()

        timelineRef.current = gsap.timeline({ repeat: -1 })

        timelineRef.current.fromTo(
            colonRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.01 }
        )
        timelineRef.current.fromTo(
            colonRef.current,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.01 },
            "+=1"
        )
        timelineRef.current.fromTo(
            colonRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 0, duration: 0.01 },
            "+=1"
        )

        return () => timelineRef.current?.kill()
    }, [])

    return (
        <span className="Clock">
            <span data-themed="color" className="Clock_time">
                <span className="Clock_time__hour">{time.hour}</span>
                <span className="Clock_time__color" ref={colonRef}>
                    :
                </span>
                <span className="Clock_time__minutes">{time.minutes}</span>
            </span>
            <span data-themed="color" className="Clock_time__title">
                {navigationData?.location}
            </span>
        </span>
    )
}

Clock.displayName = "Clock"

export default Clock
