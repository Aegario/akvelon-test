/** @jsxImportSource @emotion/react */
import React, { memo } from 'react'
import { css } from '@emotion/react'

interface Props {
  score: number;
  isInactiveMode: boolean;
}

export const ScoreDisplay = memo<Props>(({ score, isInactiveMode }) => {
  return (
    <div css={
      css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <p css={
        css`
          font-size: 1.625rem;
          text-transform: uppercase;
        `}
      >
        Your score:
      </p>

      <p css={
        css`
          color: ${score % 10 === 0
          && score !== 0
          && !isInactiveMode ? '#bb2020' : 'unset'};
            padding-bottom: 1.625rem;
            padding-top: 1rem;
            font-size: 3.25rem;
      `}
      >
        {score}
      </p>
    </div>
  )
})
