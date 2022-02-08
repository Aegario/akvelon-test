/** @jsxImportSource @emotion/react */
import React, { FC } from 'react'
import { css } from '@emotion/react'

interface Props {
  onClick: () => void;
  isInactiveMode: boolean;
  isOverdriveMode: boolean;
}

export const Button: FC<Props> = ({
  children,
  onClick,
  isInactiveMode,
  isOverdriveMode,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      css={
        css`
          padding: 1.25rem 6rem;
          font-size: 1rem;
          background-color: ${isInactiveMode ? '#a19f9f' : '#8d6bce'};
          border: ${isOverdriveMode ? '2px solid #bb2020' : 'none'};
          box-sizing: border-box;
          border-radius: .375rem;
          cursor: pointer;
          opacity: .9;
          max-height: 3.75rem;
          text-transform: uppercase;
          &:hover {
            opacity: 1;
            transition: .3s;
        }`
      }
    >
      {children}
    </button>
  )
}
