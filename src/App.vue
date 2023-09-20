<script setup lang="ts">
import { onMounted } from 'vue'
import GameMenu from './components/GameMenu.vue'
import Bar from './components/Bar.vue'
import Line from './components/Line.vue'
import Star from './components/Star.vue'
import PlayerBall from './components/PlayerBall.vue'
import { useGameStore } from './store/game'
import { usePlayerStore } from './store/player'
import { getRandomSortedColors } from './logic/helpers'
import hitSoundSfx from './assets/hit-sound.wav'

const game = useGameStore()
const player = usePlayerStore()

const hitSound = new Audio(hitSoundSfx)

function gameLoop() {
  if (game.getStatus === 'playing') {
    detectCollisions()
  }

  requestAnimationFrame(gameLoop)
}

async function play() {
  game.play()
}

const linesPassed = [] as string[]

function detectCollisions() {
  if (game.getStatus === 'leveling') return

  const playerBall = document.querySelector('#player-ball')
  if (!playerBall) return

  const playerRect = playerBall.getBoundingClientRect()

  if (game.bars.length === 0) return

  for (const bar of game.bars) {
    for (const line of bar.lines) {
      const lineEl = document.querySelector(`#line-${line.id}`)
      if (!lineEl) return

      const lineRect = lineEl.getBoundingClientRect()

      if (linesPassed.includes(line.id))  continue

      if (
        playerRect.right > lineRect.left &&
        playerRect.left < lineRect.right &&
        playerRect.bottom > lineRect.top &&
        playerRect.top < lineRect.bottom
      ) {
        if (line.color === player.getColor) {
          linesPassed.push(line.id)
          hitSound.play()
          game.increaseScore()
          game.setRound()
          player.setColor(getRandomSortedColors(game.getLevelDefinitions.colors)[0])
        } else {
          game.gameOver()
        }
      }
    }
  }
}

onMounted(() => {
  gameLoop()
})
</script>

<template>
  <main>
    <div id="game-board" :style="{ width: `${game.settings.width}px`, height: `${game.settings.height}px`, background: game.getLevelDefinitions.bgColor }" v-if="game.getStatus === 'playing' || game.getStatus === 'leveling'">
      <div class="game-infos">
        <div class="score">{{ game.getScore }}</div>
        <div class="level">{{ game.getLevelDefinitions.name }}</div>
      </div>

      <Star v-for="star in game.stars.values()" :key="star.id" :star="star" @disappear="game.stars.delete(star.id)"></Star>
      
      <Bar v-for="bar in game.bars" :key="bar.id" :bar="bar">
        <Line v-for="(line, index) in bar.lines" :key="index" :line="line" ref="line"></Line>
      </Bar>

      <PlayerBall ref="player-ball" :player="player"></PlayerBall>
    </div>

    <GameMenu @play="play()" v-else />
  </main>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #222222;
  overflow: hidden;
  font-family: 'Gill Sans', sans-serif;
}

#game-board {
  position: relative;
  transition: all 5s ease-in-out;
}

.game-infos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  color: rgba(255, 255, 255, 1);
  font-weight: 700;

  .score {
    font-size: 60px;
    padding-left: 20px;
  }

  .level {
    font-size: 22px;
    padding-right: 20px;
  }
}
</style>