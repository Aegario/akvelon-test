/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useMemo, useRef, useState, VFC } from 'react'
import { css } from '@emotion/react'
import { throttle } from 'lodash'
import { gamble, getConfig } from 'helpers'
import { DIFFICULTY } from 'constants'
import { Button, OverdriveCard, TrophyBoard, ScoreDisplay, DifficultySelect } from './components'

const inactiveModeActivationTime = 10000
const overdriveEnabled = true

export const RootContainer: VFC = () => {
  const [counter, setCounter] = useState(0)
  const [isInactiveMode, setIsInactiveMode] = useState(false)
  const [isOverdriveMode, setIsOverdriveMode] = useState(false)
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
      if (!isOverdriveMode) setIsOverdriveMode(true)
      setOverdriveTimer(overdriveDuration)
    }
    handleCounterIncrement(isOverdriveMode ? 2 : 1)
    setIsInactiveMode(false)
  }

  const handleDifficultyChange = useCallback((val: DIFFICULTY) => {
    setDifficulty(val)
  }, [])

  const throttledButtonClick = useCallback(
    throttle(handleButtonClick, 1000/maxClicksPerSecond),
    [maxClicksPerSecond, isOverdriveMode],
  )

  useEffect(() => {
    // inactive mode useEffect
    if (isInactiveMode) return
    inactiveTimeoutIdRef.current = setTimeout(() => setIsInactiveMode(true), inactiveModeActivationTime)

    // clearing timeout when deps change and on unmount
    return () => {
      // only clears when counter is increasing
      if (isInactiveMode) return
      clearTimeout(inactiveTimeoutIdRef.current!)
      inactiveTimeoutIdRef.current = null
    }
  }, [counter, isInactiveMode])

  useEffect(() => {
    // counter decrement useEffect
    if (isInactiveMode && counter) {
      handleCounterDecrement()
      decreaseIntervalIdRef.current = setInterval(handleCounterDecrement, 1000)
    } else if(!isInactiveMode) {
      clearInterval(decreaseIntervalIdRef.current!)
      decreaseIntervalIdRef.current = null
    }
  }, [isInactiveMode])

  useEffect(() => {
    // clears when counter is 0
    if (counter) return
    clearInterval(decreaseIntervalIdRef.current!)
    decreaseIntervalIdRef.current = null
  }, [counter])

  useEffect(() => {
    // overdriveMode useEffect
    if (!overdriveTimer) setIsOverdriveMode(false)
  }, [overdriveTimer])

  useEffect(() => {
    // overdriveTimer useEffect
    if (isOverdriveMode) {
      handleOverdriveTimerDecrement()
      overdriveIntervalIdRef.current = setInterval(handleOverdriveTimerDecrement, 1000)
    } else if (overdriveIntervalIdRef.current) {
      clearInterval(overdriveIntervalIdRef.current)
    }
  }, [isOverdriveMode])


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

      {isOverdriveMode && (
        <div css={css`
          position: absolute;
          top: 2rem;
          font-size: 1.25rem;
        `}>
          <p>Overdrive time: {overdriveTimer} sec</p>
        </div>
      )}

      <ScoreDisplay score={counter} isInactiveMode={isInactiveMode} />

      <div css={
        css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `
      }>
        {isOverdriveMode && (
          <div css={css`
              margin-right: 4rem;`
          }>
            <OverdriveCard />
          </div>
        )}

        <Button
          onClick={throttledButtonClick}
          isInactiveMode={isInactiveMode}
          isOverdriveMode={isOverdriveMode}
        >
          Click me
        </Button>

        {isOverdriveMode && (
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
