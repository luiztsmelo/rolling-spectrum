export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffleColors(colors: string[]): string[] {
  return colors.sort(() => Math.random() - 0.5)
}

export function generateRandomColors(amount: number): string[] {
  const colors = []

  for (let i = 0; i < amount; i++) {
    const h = getRandomNumber(0, 360)
    const s = getRandomNumber(10, 90)
    const l = getRandomNumber(10, 90)

    const hslColor = `hsl(${h}, ${s}%, ${l}%)`

    colors.push(hslColor)
  }

  return colors
}
