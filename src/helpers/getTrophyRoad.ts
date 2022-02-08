export const getTrophyRoad = (): number[] =>
  Array(10000).fill(null).reduce((acc, i, idx) => {
    switch (true) {
    case idx < 100:
      return idx % 10 === 0 && idx > 0 ? [...acc, idx] : acc
    case idx < 500:
      return idx % 50 === 0 ? [...acc, idx] : acc
    case idx < 1000:
      return idx % 100 === 0 ? [...acc, idx] : acc
    default:
      return idx % 500 === 0 ? [...acc, idx] : acc
    }
  }, [])
