/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState, VFC } from 'react'
import { css } from '@emotion/react'
import { throttle } from 'lodash'

export const RootContainer: VFC = () => {
  const [counter, setCounter] = useState(0)
  const [isInInactiveMode, setIsInInactiveMode] = useState(false)
  const inactiveTimeoutIdRef = useRef<number | null>(null)
  const decreaseIntervalIdRef = useRef<number | null>(null)

  const handleCounterIncrease = () => {
    setCounter((val) => val + 1)
  }

  const handleCounterDecrease = () => {
    setCounter((val) => val - 1)
  }

  const handleButtonClick = () => {
    handleCounterIncrease()
    setIsInInactiveMode(false)
  }

  const throttledButtonClick = throttle(handleButtonClick, 1000)

  useEffect(() => {
    // this useEffect is responsible for setting
    // inactive mode state when N seconds has passed
    // without activity
    if (isInInactiveMode) return

    // setting up a new inactive mode timeout
    inactiveTimeoutIdRef.current = setTimeout(() => setIsInInactiveMode(true), 2000)

    // clearing timeout when deps change and on unmount
    return () => {
      if (isInInactiveMode) return // we only need to do clear when counter is increasing
      clearTimeout(inactiveTimeoutIdRef.current!)
      inactiveTimeoutIdRef.current = null
    }
  }, [counter, isInInactiveMode])

  useEffect(() => {
    // this useEffect is responsible for decreasing
    // the counter when in inactive mode
    if (!isInInactiveMode) return

    handleCounterDecrease()
    decreaseIntervalIdRef.current = setInterval(handleCounterDecrease, 1000)
  }, [isInInactiveMode])

  useEffect(() => {
    if (counter) return
    clearInterval(decreaseIntervalIdRef.current!)
    decreaseIntervalIdRef.current = null
  }, [counter])


  useEffect(() => {
    return () => {
      clearInterval(decreaseIntervalIdRef.current!)
      decreaseIntervalIdRef.current = null
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
    `}
    >
      <div>
        <p css={css`
            color: ${counter % 10 === 0 && counter !== 0 ? 'red' : 'unset'};
            padding-bottom: 1.625rem;
            font-size: 2.25rem;
          `}
        >
          {counter}
        </p>
      </div>

      <div>
        <button
          onClick={throttledButtonClick}
          css={css`
            padding: 1.25rem 6rem;
            background-color: ${isInInactiveMode ? '#589558ff' : '#ad93dc'};
            border: none;
            border-radius: .375rem;
            cursor: pointer;
            opacity: .9;

            &:hover {
              opacity: 1;
              transition: .3s;
            }
          `}
        >
          Click me
        </button>
      </div>
    </div>
  )
}
