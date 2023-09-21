import { defineStore } from 'pinia'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useGameStore } from '@/store/game'

type Direction = 'Up' | 'Down' | 'Left' | 'Right'

export const usePlayerStore = defineStore('player', () => {
  const game = useGameStore()

  const size = ref(22)
  const color = ref('#F6FA70')
  const position = ref({ x: 0, y: 0 })
  const velocity = ref({ x: 0, y: 0 })
  const acceleration = ref(0.09)
  const frictionFactor = 0.99

  const isMoving = {
    up: false,
    down: false,
    left: false,
    right: false
  } as { [key: string]: boolean }

  function reset() {
    position.value = { x: game.settings.width / 2, y: 100 }
    velocity.value = { x: 0, y: 0 }
  }

  function move(direction: Direction, isMovingNow: boolean) {
    const isPlaying = game.status === 'playing' || game.status === 'leveling'
    if (!isPlaying) return
  
    const axis = direction === 'Up' || direction === 'Down' ? 'y' : 'x'
    const directionSign = direction === 'Down' || direction === 'Left' ? -1 : 1

    if (isMovingNow && !isMoving[direction]) {
      isMoving[direction] = true

      const moveInterval = setInterval(() => {
        velocity.value[axis] += directionSign * acceleration.value
      }, 1000 / 60)

      const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key === `Arrow${direction}`) {
          isMoving[direction] = false
          clearInterval(moveInterval)
          document.removeEventListener('keyup', keyUpHandler)
        }
      }

      document.addEventListener('keyup', keyUpHandler)
    } else if (!isMovingNow && isMoving[direction]) {
      isMoving[direction] = false
    }
  }

  function updatePosition() {
    const maxX = game.settings.width - size.value
    const maxY = game.settings.height - size.value

    position.value.x = Math.min(maxX, Math.max(0, position.value.x + velocity.value.x))
    position.value.y = Math.min(maxY, Math.max(0, position.value.y + velocity.value.y))

    velocity.value.x *= frictionFactor
    velocity.value.y *= frictionFactor
  }

  const keyDownHandler = (event: KeyboardEvent) => {
    if (!event.key.includes('Arrow')) return

    const direction = event.key.replace('Arrow', '') as Direction
    move(direction, true)
  }

  function setColor (value: string) {
    color.value = value
  }

  onMounted(() => {
    position.value = { x: game.settings.width / 2, y: 100 }

    document.addEventListener('keydown', keyDownHandler)

    function animatePositionUpdate() {
      updatePosition()
      requestAnimationFrame(animatePositionUpdate)
    }

    animatePositionUpdate()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', keyDownHandler)
  })

  return {
    size, 
    color,
    position,
    setColor,
    reset
  }
})
