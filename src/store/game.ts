import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/store/player'
import { getRandomNumber, getRandomSortedColors, generateRandomColors } from '@/utils'
import type { GameStatus, LevelDefinition, Bar } from '@/types'
import hitSoundSfx from '@/assets/hit-sound.wav'
import NextLevelSoundSfx from '@/assets/next-level.wav'

const nextLevelSound = new Audio(NextLevelSoundSfx)
const hitSound = new Audio(hitSoundSfx)

export const useGameStore = defineStore('game', () => {
  const player = usePlayerStore()

  const settings = {
    levelsCount: 10,
    roundsPerLevel: 3,
    width: 720,
    height: window.innerHeight
  }

  const levelsDefinitions = ref<LevelDefinition[]>([])
  const status = ref<GameStatus>('idle')
  const level = ref(0)
  const round = ref(0)
  const score = ref(0)
  
  const bars = ref<Bar[]>([])
  const stars = ref(new Map())

  let starsInterval = 0

  const linesPassed = [] as string[]

  function generateLevelsDefinitions() {
    for (let i = 0; i < settings.levelsCount; i++) {
      const levelDefinition = {
        name: `level ${i + 1}`,
        colors: generateRandomColors(i < 5 ? i + 2 : 5),
        bgColor: `#00${i < 9 ? i + 1 : 9}`,
        speed: 8000 - (i * 400)
      }

      levelsDefinitions.value.push(levelDefinition)
    }
  }

  function generateBars() {
    for (let i = 0; i < settings.roundsPerLevel; i++) {
      const lines = []

      const colors = getRandomSortedColors(getLevelDefinitions.value.colors)

      for (let j = 0; j < colors.length; j++) {
        const line = {
          id: window.crypto.randomUUID(),
          color: colors[j],
          size: getRandomNumber(1, 6)
        }

        lines.push(line)
      }

      const bar = {
        id: window.crypto.randomUUID(),
        speed: getLevelDefinitions.value.speed,
        delay: (i + 1) * 3000,
        lines
      }
      
      bars.value.push(bar)
    }
  }

  function generateStars() {
    starsInterval = setInterval(() => {
      const star = {
        id: window.crypto.randomUUID(),
        size: getRandomNumber(1, 2),
        speed: getRandomNumber(3000, 6000)
      }
  
      stars.value.set(star.id, star)
    }, 40)
  }

  function detectCollisions() {
    if (status.value === 'leveling' || bars.value.length === 0) return

    const playerBall = document.querySelector('#player-ball')
    if (!playerBall) return

    const playerBallRect = playerBall.getBoundingClientRect()

    for (const bar of bars.value) {
      for (const line of bar.lines) {
        const lineEl = document.querySelector(`#line-${line.id}`)
        if (!lineEl) return

        const lineRect = lineEl.getBoundingClientRect()

        if (linesPassed.includes(line.id)) continue

        const collisionDetected = (
          playerBallRect.right > lineRect.left &&
          playerBallRect.left < lineRect.right &&
          playerBallRect.bottom > lineRect.top &&
          playerBallRect.top < lineRect.bottom
        )

        if (collisionDetected) {
          if (line.color === player.color) {
            linesPassed.push(line.id)
            hitSound.play()
            increaseScore()
            setRound()
            player.setColor(getRandomSortedColors(getLevelDefinitions.value.colors)[0])
          } else {
            gameOver()
          }
        }
      }
    }
  }

  function detectCollisionsLoop() {
    if (status.value === 'playing') {
      detectCollisions()
    }
  
    requestAnimationFrame(detectCollisionsLoop)
  }

  const getLevelDefinitions = computed(() => {
    return levelsDefinitions.value[level.value]
  })

  function nextLevel() {
    level.value++
    status.value = 'leveling'
    nextLevelSound.play()

    setTimeout(() => {
      generateBars()
      status.value = 'playing'
    }, 5000)
  }

  function setRound() {
    if (round.value === settings.roundsPerLevel - 1) {
      round.value = 0
      nextLevel()
    } else {
      round.value++
    }
  }

  function increaseScore() {
    score.value++
  }

  function play() {
    generateLevelsDefinitions()
    generateBars()
    generateStars()
    detectCollisionsLoop()
    player.setColor(getRandomSortedColors(getLevelDefinitions.value.colors)[0])
    status.value = 'playing'
  }

  function reset() {
    status.value = 'idle'
    level.value = 0
    round.value = 0
    score.value = 0
    bars.value = []
    stars.value.clear()
    clearInterval(starsInterval)
    player.reset()
  }

  function gameOver() {
    status.value = 'gameover'
    reset()
  }

  watch(score, value => {
    if (value) {
      const bar = document.querySelector(`.bar-${bars.value[0].id}`) as HTMLElement
      if (!bar) return

      const animations = document.getAnimations()

      // @ts-ignore
      const barAnimation = animations.find(animation => animation.effect.target.className.includes(`bar-${bars.value[0].id}`))
      if (!barAnimation) return

      barAnimation.commitStyles()
      barAnimation.cancel()

      const animation = bar.animate([
        { top: bar.style.top, opacity: 1, },
        { top: `${Number(bar.style.top.replace('%', '')) + 10}%`, opacity: 0 }
      ], {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards'
      })

      animation.onfinish = () => {
        bars.value = bars.value.slice(1)
      }
    }
  })

  return {
    settings,
    status,
    level,
    round,
    score,
    bars,
    stars,
    getLevelDefinitions,
    generateBars,
    nextLevel,
    setRound,
    increaseScore,
    play,
    gameOver
  }
})