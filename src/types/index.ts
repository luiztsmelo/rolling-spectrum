export type GameStatus = 'idle' | 'playing' | 'leveling' | 'gameover' | 'win'

export interface LevelDefinition {
  name: string
  colors: string[]
  bgColor: string
  speed: number
}

export interface Bar {
  id: string
  speed: number
  delay: number
  lines: Line[]
}

export interface Line {
  id: string
  color: string
  size: number
}
