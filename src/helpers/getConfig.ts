import { DIFFICULTY , gameConfig } from 'constants'

export const getConfig = (difficulty: DIFFICULTY) => gameConfig[difficulty]
