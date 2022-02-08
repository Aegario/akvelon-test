import { DIFFICULTY } from './difficulty'

interface Config {
  overdriveDuration: number,
  overdriveChance: number,
  maxClicksPerSecond: number,
}

export const gameConfig: Record<DIFFICULTY, Config> = {
  [DIFFICULTY.EASY]: {
    overdriveDuration: 15,
    overdriveChance: 33.33,
    maxClicksPerSecond: 5,
  },
  [DIFFICULTY.MEDIUM]: {
    overdriveDuration: 10,
    overdriveChance: 10,
    maxClicksPerSecond: 3,
  },
  [DIFFICULTY.HARD]: {
    overdriveDuration: 5,
    overdriveChance: 5,
    maxClicksPerSecond: 1,
  },
}
