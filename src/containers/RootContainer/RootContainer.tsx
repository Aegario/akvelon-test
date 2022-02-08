/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useMemo, useRef, useState, VFC } from 'react'
import { css } from '@emotion/react'
import { throttle } from 'lodash'
import { gamble, getConfig } from 'helpers'
import { DIFFICULTY } from 'constants'
import { DifficultySelect } from 'containers/RootContainer/components/DifficultySelect/DifficultySelect'
import { OverdriveCard, TrophyBoard } from './components'

const inactiveModeActivationTime = 2000
const overdriveEnabled = true

export const RootContainer: VFC = () => {
  const [counter, setCounter] = useState(0)
  const [isInInactiveMode, setIsInInactiveMode] = useState(false)
  const [overdriveMode, setOverdriveMode] = useState(false)
  const [overdriveTimer, setOverdriveTimer] = useState(0)
  const [difficulty, setDifficulty] = useState(DIFFICULTY.MEDIUM)

  const inactiveTimeoutIdRef = useRef<number | null>(null)
  const decreaseIntervalIdRef = useRef<number | null>(null)
  const overdriveIntervalIdRef = useRef<number | null>(null)

  const { overdriveDuration, overdriveChance, maxClicksPerSecond } = useMemo(
    () => getConfig(difficulty), [difficulty],
  )

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
    const isOverdrive = overdriveEnabled ? gamble(overdriveChance) : false
    if (isOverdrive) {
      if (!overdriveMode) setOverdriveMode(true)
      setOverdriveTimer(overdriveDuration)
    }
    handleCounterIncrement(overdriveMode ? 2 : 1)
    // handleCounterIncrement(300)
    setIsInInactiveMode(false)
  }

  const handleDifficultyChange = (val: DIFFICULTY) => {
    setDifficulty(val)
  }

  const throttledButtonClick = useCallback(
    throttle(handleButtonClick, 1000/maxClicksPerSecond),
    [maxClicksPerSecond],
  )

  useEffect(() => {
    console.log('Root Container update')
    console.log({ overdriveDuration, overdriveChance, maxClicksPerSecond })
    console.log({
      counter,
      isInInactiveMode,
      overdriveMode,
      overdriveTimer,
    })
  })


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
    // the counter in inactive mode
    if (isInInactiveMode && counter) {
      handleCounterDecrement()
      decreaseIntervalIdRef.current = setInterval(handleCounterDecrement, 1000)
    } else if(!isInInactiveMode) {
      clearInterval(decreaseIntervalIdRef.current!)
      decreaseIntervalIdRef.current = null
    }
  }, [isInInactiveMode])

  useEffect(() => {
    // clears when counter is 0
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
    // unmount cleanup useEffect
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
      <DifficultySelect value={difficulty} onChange={handleDifficultyChange}/>
      <TrophyBoard score={counter}/>

      {overdriveMode && (
        <div css={css`
          position: absolute;
          top: 2rem;
          font-size: 1.25rem;
        `}>
          <p>Overdrive time: {overdriveTimer} sec</p>
        </div>
      )}

      <div css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}>
        <p css={css`
          font-size: 1.625rem;
          text-transform: uppercase;
        `}>
          Your score:
        </p>

        <p css={css`
            color: ${counter % 10 === 0 
            && counter !== 0 
            && !isInInactiveMode ? '#bb2020' : 'unset'};
            padding-bottom: 1.625rem;
            padding-top: 1rem;
            font-size: 3.25rem;
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
            font-size: 1rem;
            background-color: ${isInInactiveMode ? '#a19f9f' : '#8d6bce'};
            border: ${overdriveMode ? '4px solid #bb2020' : 'none'};
            border-radius: .375rem;
            cursor: pointer;
            opacity: .9;
            max-height: 3.75rem;
            text-transform: uppercase;
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
