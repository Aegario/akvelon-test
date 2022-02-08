/** @jsxImportSource @emotion/react */
import React, { VFC } from 'react'
import { css } from '@emotion/react'

export const OverdriveCard: VFC = () => (
  <div>
    <p css={
      css`
        text-transform: uppercase;
        font-size: 2rem;
        font-family: "American Typewriter", sans-serif;
        color: black;
        background-color: #bb2020;
        border-radius: 1rem;
        padding: 1.5rem;
      `
    }>
      Overdrive!
    </p>
  </div>
)
