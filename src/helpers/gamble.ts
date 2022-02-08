export const gamble = (successChance: number) => {
  return Math.random() < successChance / 100
}
