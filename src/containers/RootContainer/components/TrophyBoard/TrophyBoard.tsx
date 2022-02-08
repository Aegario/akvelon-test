/** @jsxImportSource @emotion/react */
import React, { memo, useCallback, useEffect, useState } from 'react'
import { css } from '@emotion/react'
import { getTrophyRoad } from 'helpers'

interface Props {
  score: number;
}

interface Trophy {
  text: string;
}

const getTrophy = (score: number): Trophy =>
  ({ text: `Congrats! You've reached score ${score}!` })
const trophyRoad = getTrophyRoad()

export const TrophyBoard = memo<Props>(({ score }) => {
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const nextTrophyPoint = trophyRoad[trophies.length]

  const handleAddTrophy = useCallback(() => {
    setTrophies((state) => [...state, getTrophy(nextTrophyPoint)])
  }, [nextTrophyPoint])

  useEffect(() => {
    if (score >= nextTrophyPoint) handleAddTrophy()
  }, [score, handleAddTrophy, nextTrophyPoint])

  useEffect(() => {
    console.log('TrophyBoard update')
  })

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      width: 20rem;
      height: 34rem;
      left: 2rem;
      top: 2rem;
      border-top-left-radius: 37px 140px;
      border-top-right-radius: 23px 130px;
      border-bottom-left-radius: 110px 19px;
      border-bottom-right-radius: 120px 24px;
      border: 2px solid black;
      overflow: scroll;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
       display: none;
      }
    `}>
      <div css={css`
        
      `}>
        <p css={css`
          padding: 1.25rem 1rem 1.75rem;
          font-size: 1.625rem;
          text-align: center;
        `}>
          Trophy Board
        </p>

        <div>
          {trophies.map((item) => (
            <p css={css`
              padding-bottom: .625rem; 
              text-align: center;
            `}>
              {item.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return nextProps.score < prevProps.score
})
