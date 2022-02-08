/** @jsxImportSource @emotion/react */
import React, { VFC } from 'react'
import { Global } from '@emotion/react'
import { RootContainer } from 'containers/RootContainer'
import { resetStyles } from 'constants'

export const App: VFC = () => {
  return (
    <div>
      <RootContainer />
      <Global styles={resetStyles} />
    </div>
  )
}
