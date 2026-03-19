/**
 * Clock.jsx — 타임존 시계
 *
 * 레퍼런스: components/Clock/Clock.jsx
 * 변경: useStore → props (timeZone, location)
 */

import React, { useEffect, useRef, useState } from "react"
import gsap from "https://esm.sh/gsap"

const TIME_ZONES = {
    ATLANTIC: { title: "Atlantic", zone: "America/St_Johns" },
    EASTERN: { title: "Eastern", zone: "America/New_York" },
    CENTRAL: { title: "Central", zone: "America/Chicago" },
    MOUNTAIN: { title: "Mountain", zone: "America/Denver" },
    PACIFIC: { title: "Pacific", zone: "America/Los_Angeles" },
    ALASKA: { title: "Alaska", zone: "America/Nome" },
    UTC: { title: "UTC", zone: "UTC" },
    LONDON: { title: "London", zone: "Europe/London" },
    PARIS: { title: "Paris", zone: "Europe/Paris" },
    TOKYO: { title: "Tokyo", zone: "Asia/Tokyo" },
    SEOUL: { title: "Seoul", zone: "Asia/Seoul" },
}

export { TIME_ZONES }

export default function Clock({
    timeZone = "SEOUL",
    location,
    style,
    className,
}) {
    const [time, setTime] = useState({ hour: "00", minutes: "00" })
    const colonRef = useRef(null)
    const timelineRef = useRef(null)
    const intervalRef = useRef(null)

    // 시간 갱신
    useEffect(() => {
        const zone = TIME_ZONES[timeZone]?.zone || "UTC"

        const fire = () => {
            const stamp = new Date().toLocaleTimeString("en-GB", {
                timeZone: zone,
                hour: "2-digit",
                minute: "2-digit",
            })
            const [h, m] = stamp.split(":")
            setTime({
                hour: parseInt(h, 10),
                minutes: parseInt(m, 10) >= 10 ? m : `0${parseInt(m, 10)}`,
            })
        }

        fire()
        intervalRef.current = setInterval(fire, 5000)
        return () => clearInterval(intervalRef.current)
    }, [timeZone])

    // 콜론 깜빡임
    useEffect(() => {
        if (!colonRef.current) return

        timelineRef.current?.kill()
        timelineRef.current = gsap
            .timeline({ repeat: -1 })
            .fromTo(
                colonRef.current,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.01 }
            )
            .fromTo(
                colonRef.current,
                { autoAlpha: 1 },
                { autoAlpha: 0, duration: 0.01 },
                "+=1"
            )
            .fromTo(
                colonRef.current,
                { autoAlpha: 0 },
                { autoAlpha: 0, duration: 0.01 },
                "+=1"
            )

        return () => timelineRef.current?.kill()
    }, [])

    return (
        <span
            className={className}
            style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "4px",
                ...style,
            }}
        >
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                <span>{time.hour}</span>
                <span ref={colonRef}>:</span>
                <span>{time.minutes}</span>
            </span>
            {location && (
                <span style={{ opacity: 0.5, fontSize: "0.85em" }}>
                    {location}
                </span>
            )}
        </span>
    )
}

Clock.displayName = "Clock"
