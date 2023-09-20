export function getRandomNumber(min: number, max: number): number {
  const randomDecimal = Math.random()
  const randomInRange = randomDecimal * (max - min + 1) + min

  return Math.floor(randomInRange)
}

export function getRandomSortedColors(colors: string[]): string[] {
  return colors.sort(() => Math.random() - 0.5)
}

export function generateRandomColors(amount: number): string[] {
  const colors = []

  for (let i = 0; i < amount; i++) {
    const hue = getRandomNumber(0, 360)
    const saturation = getRandomNumber(10, 90)
    const lightness = getRandomNumber(10, 90)

    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }

  return colors
}

export function hslToRgba(color: string, alpha: number): string {
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  if (!hslMatch) {
    throw new Error('Invalid HSL color format')
  }
  
  const [, hue, saturation, lightness] = hslMatch.map(parseFloat)

  const c = (1 - Math.abs(2 * (lightness / 100) - 1)) * (saturation / 100)
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = (lightness / 100) - c / 2

  let r, g, b
  if (hue >= 0 && hue < 60) {
    r = c
    g = x
    b = 0
  } else if (hue >= 60 && hue < 120) {
    r = x
    g = c
    b = 0
  } else if (hue >= 120 && hue < 180) {
    r = 0
    g = c
    b = x
  } else if (hue >= 180 && hue < 240) {
    r = 0
    g = x
    b = c
  } else if (hue >= 240 && hue < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  alpha = alpha !== undefined ? alpha : 1

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}