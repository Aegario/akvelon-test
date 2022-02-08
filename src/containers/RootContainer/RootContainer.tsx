/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState, VFC } from 'react'
import { css } from '@emotion/react'
import { throttle } from 'lodash'
import { gamble } from 'helpers'
import { OverdriveCard } from './components'

const inactiveModeActivationTime = 2000
const overdriveDuration = 10

export const RootContainer: VFC = () => {
  const [counter, setCounter] = useState(0)
  const [isInInactiveMode, setIsInInactiveMode] = useState(false)
  const [overdriveMode, setOverdriveMode] = useState(false)
  const [overdriveTimer, setOverdriveTimer] = useState(0)
  const inactiveTimeoutIdRef = useRef<number | null>(null)
  const decreaseIntervalIdRef = useRef<number | null>(null)
  const overdriveIntervalIdRef = useRef<number | null>(null)

  const handleCounterIncrement = (increment: number) => {
    setCounter((val) => val + increment)
  }

  const handleCounterDecrement = () => {
    setCounter((val) => val - 1)
  }

  const handleOverdriveTimerDecrement = () => {
    setOverdriveTimer((val) => val - 1)
  }

  const handleButtonClick = () => {
    const isOverdrive = gamble(10)
    if (isOverdrive) {
      if (!overdriveMode) setOverdriveMode(true)
      setOverdriveTimer(overdriveDuration)
    }
    handleCounterIncrement(overdriveMode ? 2 : 1)
    setIsInInactiveMode(false)
  }

  const throttledButtonClick = throttle(handleButtonClick, 1000)

  useEffect(() => {
    // this useEffect is responsible for setting
    // inactive mode state useEffect when 10 seconds has passed
    // without activity
    if (isInInactiveMode) return

    inactiveTimeoutIdRef.current = setTimeout(() => setIsInInactiveMode(true), inactiveModeActivationTime)

    // clearing timeout when deps change and on unmount
    return () => {
      // only clears when counter is increasing
      if (isInInactiveMode) return
      clearTimeout(inactiveTimeoutIdRef.current!)
      inactiveTimeoutIdRef.current = null
    }
  }, [counter, isInInactiveMode])

  useEffect(() => {
    // this useEffect is responsible for decreasing
    // the counter when in inactive mode
    if (!isInInactiveMode || !counter) return

    handleCounterDecrement()
    decreaseIntervalIdRef.current = setInterval(handleCounterDecrement, 1000)
  }, [isInInactiveMode])

  useEffect(() => {
    if (counter) return
    clearInterval(decreaseIntervalIdRef.current!)
    decreaseIntervalIdRef.current = null
  }, [counter])

  useEffect(() => {
    // overdriveMode useEffect
    if (!overdriveTimer) setOverdriveMode(false)
  }, [overdriveTimer])

  useEffect(() => {
    // overdriveTimer useEffect
    if (overdriveMode) {
      handleOverdriveTimerDecrement()
      overdriveIntervalIdRef.current = setInterval(handleOverdriveTimerDecrement, 1000)
    } else if (overdriveIntervalIdRef.current) {
      clearInterval(overdriveIntervalIdRef.current)
    }
  }, [overdriveMode])


  useEffect(() => () => {
    // cleanup useEffect
    if (decreaseIntervalIdRef.current) {
      clearInterval(decreaseIntervalIdRef.current)
    }

    if (overdriveIntervalIdRef.current) {
      clearInterval(overdriveIntervalIdRef.current)
    }
  }, [])

  return (
    <div css={css`
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
    `}
    >
      {overdriveMode && (
        <div css={css`
          position: absolute;
          top: 2rem;
        `}>
          <p>Overdrive time: {overdriveTimer}</p>
        </div>
      )}

      <div>
        <p css={css`
            color: ${counter % 10 === 0 
            && counter !== 0 
            && !isInInactiveMode ? '#bb2020' : 'unset'};
            padding-bottom: 1.625rem;
            font-size: 2.25rem;
          `}
        >
          {counter}
        </p>
      </div>

      <div css={
        css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `
      }>
        {overdriveMode && (
          <div css={css`
              margin-right: 4rem;`
          }>
            <OverdriveCard />
          </div>
        )}

        <button
          type='button'
          onClick={throttledButtonClick}
          css={css`
            padding: 1.25rem 6rem;
            background-color: ${isInInactiveMode ? '#589558ff' : '#ad93dc'};
            border: ${overdriveMode ? '2px solid #bb2020' : 'none'};
            border-radius: .375rem;
            cursor: pointer;
            opacity: .9;
            max-height: 3.75rem;
            &:hover {
              opacity: 1;
              transition: .3s;
            }`
          }>
          Click me
        </button>

        {overdriveMode && (
          <div css={css`
            margin-left: 4rem;
          `}>
            <OverdriveCard />
          </div>
        )}
      </div>
    </div>
  )
}
