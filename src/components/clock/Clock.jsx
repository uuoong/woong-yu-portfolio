/**
 * Clock.jsx — 타임존 시계
 *
 * 레퍼런스: Clock.jsx (원본)
 *
 * ─── 원본과의 대응 관계 ───────────────────────────────────────────────────
 *
 *  원본:
 *    const globalData     = useStore(state => state.globalData)
 *    const navigationData = globalData?.navigation
 *    // navigationData.timeZone, navigationData.location 사용
 *
 *  리팩토링:
 *    const { navData: navigationData } = useAppContext()
 *    // navData가 원본의 navigationData와 동일한 구조
 *    // navData.timeZone, navData.location 사용
 *
 *  Navigation에서 props를 넘기지 않아도 됨 (원본 패턴과 동일).
 *  Clock은 AppContext를 직접 구독.
 *
 * ─── TIME_ZONES ───────────────────────────────────────────────────────────
 *
 *  SEOUL만 사용. 필요 시 추가 가능.
 *
 * ─── 원본 로직 유지 ───────────────────────────────────────────────────────
 *
 *  - toLocaleDateString('en-GB', ...) 방식 (원본과 동일)
 *  - timestamp.split(' ')[1]으로 시:분 추출
 *  - minutes < 10 → "0${minutes}" 포맷
 *  - GSAP timeline repeat: -1, 콜론 깜빡임
 */

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

const Clock = ({ className, style }) => {
    // 원본 패턴:
    //   const globalData     = useStore(state => state.globalData)
    //   const navigationData = globalData?.navigation
    // 리팩토링 버전: navData가 navigationData와 동일
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
        <span
            className={className}
            style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "4px",
                ...style,
            }}
        >
            {/* 시간 표시 (원본 time__hour + colon + time__minutes 구조) */}
            <span
                data-themed="color"
                style={{ fontVariantNumeric: "tabular-nums" }}
            >
                <span>{time.hour}</span>
                <span ref={colonRef}>:</span>
                <span>{time.minutes}</span>
            </span>

            {/* 위치 표시 (원본 title span, navigationData.location) */}
            {navigationData?.location && (
                <span
                    data-themed="color"
                    style={{ opacity: 0.5, fontSize: "0.85em" }}
                >
                    {navigationData.location}
                </span>
            )}
        </span>
    )
}

export default Clock
