import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import styles from './RotatingWord.module.scss'

type RotatingWordProps = {
    words: string[]
    interval?: number
    debug?: boolean
}

type Phase = 'visible' | 'fading'

export const RotatingWord = ({
    words,
    interval = 1500,
    debug = false,
}: RotatingWordProps) => {
    const [index, setIndex] = useState(0)
    const [phase, setPhase] = useState<Phase>('visible')
    const [width, setWidth] = useState<number | undefined>(undefined)
    const wordRef = useRef<HTMLSpanElement>(null)

    // Handle edge cases
    if (!words || words.length === 0) {
        return <span style={{ display: 'inline-block', color: 'inherit' }}>—</span>
    }

    // Single word: no rotation needed
    if (words.length === 1) {
        return (
            <span style={{ display: 'inline-block', color: 'inherit', opacity: 1 }}>
                {words[0]}
            </span>
        )
    }

    // Measure word width for smooth transitions
    useLayoutEffect(() => {
        if (wordRef.current) {
            const measuredWidth = wordRef.current.offsetWidth
            setWidth(measuredWidth)
        }
    }, [index, debug])

    useEffect(() => {
        

        // Start rotation cycle
        const timerId = setInterval(() => {
            setPhase('fading')

            // After fade completes, switch word and return to visible
            setTimeout(() => {
                setIndex((prev) => {
                    const next = (prev + 1) % words.length
                    return next
                })
                setPhase('visible')
            }, 300) // Match CSS transition duration
        }, interval)

        return () => {
            clearInterval(timerId)
        }
    }, [words, interval, index, debug])

    const currentWord = words[index] || ''

    return (
        <span
            style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
                width: width ? `${width}px` : 'auto',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'visible',
            }}
        >
            <span
                ref={wordRef}
                style={{
                    display: 'inline-block',
                    opacity: phase === 'visible' ? 1 : 0,
                    transform: phase === 'visible' ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    lineHeight: 'inherit',
                    whiteSpace: 'nowrap',
                    background: 'linear-gradient(90deg, #00D4FF 0%, #9F6CF9 50%, #FF6B9D 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                {currentWord}
            </span>
        </span>
    )
}
