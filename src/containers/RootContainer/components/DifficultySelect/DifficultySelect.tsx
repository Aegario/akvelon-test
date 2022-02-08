/** @jsxImportSource @emotion/react */
import React, { memo, ChangeEvent } from 'react'
import { css } from '@emotion/react'
import { DIFFICULTY } from 'constants'
import { capitalize } from 'helpers'

interface Option {
  label: string;
  value: DIFFICULTY;
}

const getOptions = (): Option[] =>
  Object.values(DIFFICULTY).map((difficulty) => {
    return {
      label: capitalize(difficulty),
      value: difficulty,
    }
  })

const options = getOptions()

interface Props {
  value: DIFFICULTY,
  onChange: (val: DIFFICULTY) => void,
}

export const DifficultySelect = memo<Props>(({ value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as DIFFICULTY)
  }

  return (
    <div css={css`
      position: absolute;
      top: 2rem;
      right: 2rem;
      background-color: #a19f9f;

      display: flex;
      flex-direction: column;
      align-items: center;

      border: 2px solid black;
      padding: 1.75rem;
      border-top-right-radius: 45px 15px;
      border-top-left-radius: 30px 134px;
      border-bottom-right-radius: 44px 40px;
      border-bottom-left-radius: 70px 24px;

      select {
        --radius: 2em;
        --baseFg: #130f11;
        --baseBg: #939191;
        --accentFg: #ffffff;
        --accentBg: #797878;
      }

      select {
        width: 10rem;
        font-size: .875rem;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        color: var(--baseFg);
        border: 1px solid var(--baseFg);
        line-height: 1;
        outline: 0;
        padding: 0.65em 2.5em 0.55em 0.75em;
        border-radius: var(--radius);
        background-color: var(--baseBg);
        background-image: linear-gradient(var(--baseFg), var(--baseFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(var(--accentBg) 42%, var(--accentFg) 42%);
        background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
        background-size: 1px 100%, 20px 22px, 20px 22px, 20px 100%;
        background-position: right 20px center, right bottom, right bottom, right bottom;
      }

      select:hover {
        background-image: linear-gradient(var(--accentFg), var(--accentFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(var(--accentFg) 42%, var(--accentBg) 42%);
      }

      select:active {
        background-image: linear-gradient(var(--accentFg), var(--accentFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentFg) 50%),
        linear-gradient(var(--accentFg) 42%, var(--accentBg) 42%);
        color: var(--accentBg);
        border-color: var(--accentFg);
        background-color: var(--accentFg);
      }
    `}>
      <p css={css`
        padding-bottom: 1.25rem;
        font-size: 1.25rem;
      `}>
        Select difficulty:
      </p>

      <select value={value} onChange={handleChange}>
        {options.map((option) => (
          <option value={option.value} label={option.label} />
        ))}
      </select>
    </div>
  )
})
