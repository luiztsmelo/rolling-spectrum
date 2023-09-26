<script setup lang="ts">
import GameMenu from '@/components/GameMenu.vue'
import Bar from '@/components/Bar.vue'
import Line from '@/components/Line.vue'
import Star from '@/components/Star.vue'
import PlayerBall from '@/components/PlayerBall.vue'
import { useGameStore } from '@/store/game'
import { usePlayerStore } from '@/store/player'

const game = useGameStore()
const player = usePlayerStore()
</script>

<template>
  <main>
    <div
      id="game-board" 
      :style="{ width: `${game.settings.width}px`, height: `${game.settings.height}px`, background: game.getLevelDefinitions.bgColor }" 
      v-if="game.status === 'playing' || game.status === 'leveling'"
    >
      <div class="game-infos">
        <div class="score">{{ game.score }}</div>
        <div class="level">{{ game.getLevelDefinitions.name }}</div>
      </div>

      <Star v-for="star in game.stars.values()" :key="star.id" :star="star" @disappear="game.stars.delete(star.id)"></Star>
      
      <Bar v-for="bar in game.bars" :key="bar.id" :bar="bar">
        <Line v-for="(line, index) in bar.lines" :key="index" :line="line" ref="line"></Line>
      </Bar>

      <PlayerBall ref="player-ball" :player="player"></PlayerBall>
    </div>

    <GameMenu @play="game.play()" v-else />
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