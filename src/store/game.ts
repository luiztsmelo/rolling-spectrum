import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/store/player'
import { getRandomNumber, getRandomSortedColors, generateRandomColors } from '@/logic/helpers'
import type { GameStatus, LevelDefinition, Bar } from '@/types'
import NextLevelSoundSfx from '@/assets/next-level.wav'

const nextLevelSound = new Audio(NextLevelSoundSfx)

export const useGameStore = defineStore('game', () => {
  const player = usePlayerStore()

  const settings = {
    levelsCount: 10,
    roundsPerLevelCount: 3,
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

  function generateLevelsDefinitions() {
    for (let i = 0; i < settings.levelsCount; i++) {
      levelsDefinitions.value.push({
        name: `level ${i + 1}`,
        colors: generateRandomColors(i < 5 ? i + 2 : 5),
        bgColor: `#00${i < 9 ? i + 1 : 9}`,
        speed: 8000 - (i * 400)
      })
    }
  }

  function generateBars() {
    for (let i = 0; i < settings.roundsPerLevelCount; i++) {
      const lines = []

      const colors = getRandomSortedColors(getLevelDefinitions.value.colors)

      for (let j = 0; j < colors.length; j++) {
        lines.push({
          id: window.crypto.randomUUID(),
          color: colors[j],
          size: getRandomNumber(1, 6)
        })
      }
      
      bars.value.push({
        id: window.crypto.randomUUID(),
        speed: getLevelDefinitions.value.speed,
        delay: (i + 1) * 3000,
        lines
      })
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

  const getLevelDefinitions = computed(() => {
    return levelsDefinitions.value[level.value]
  }) 

  const getBars = computed(() => {
    return bars
  })

  const getStatus = computed(() => {
    return status.value
  }) 

  const getScore = computed(() => {
    return score.value
  }) 

  const getLevel = computed(() => {
    return level.value
  }) 

  const getRound = computed(() => {
    return round.value
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
    if (round.value === settings.roundsPerLevelCount - 1) {
      round.value = 0
      nextLevel()
    } else {
      round.value++
    }
  }

  function increaseScore() {
    score.value++
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

  function play() {
    generateLevelsDefinitions()
    generateBars()
    generateStars()
    player.setColor(getRandomSortedColors(getLevelDefinitions.value.colors)[0])
    status.value = 'playing'
  }

  function gameOver() {
    status.value = 'gameover'
    reset()
  }

  watch(score, value => {
    if (value) {
      const bar = document.querySelector(`.bar-${bars.value[0].id}`) as HTMLElement
      const animations = document.getAnimations()

      // @ts-ignore
      const barAnimation = animations.find(animation => animation.effect.target.className.includes(`bar-${bars.value[0].id}`))
      if (!barAnimation) return

      barAnimation.commitStyles()
      barAnimation.cancel()

      if (bar) {
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
    }
  })

  return {
    settings,
    score,
    bars,
    stars,
    getLevelDefinitions,
    getStatus,
    getScore,
    getLevel,
    getRound,
    getBars,
    generateBars,
    nextLevel,
    setRound,
    increaseScore,
    play,
    gameOver
  }
})