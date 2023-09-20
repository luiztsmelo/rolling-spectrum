<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generateRandomColors } from '@/logic/helpers'

interface CharObject {
  char: string
  color: string
  fontSize: number
}

const emit = defineEmits(['play'])

const gameTitle = 'Rolling Spectrum'
const gameTitleChars = ref<CharObject[]>([])

function animateGameTitle() {
  for (const [index, char] of gameTitle.split('').entries()) {
    gameTitleChars.value.push({
      char,
      color: generateRandomColors(1)[0],
      fontSize: 80 - index * 4
    })
  }
  
  setInterval(() => {
    for (const char of gameTitleChars.value) {
      char.color = generateRandomColors(1)[0]
    }
  }, 500)
}

onMounted(() => {
  animateGameTitle()
})
</script>

<template>
  <div class="menu">
    <span class="game-title">
      <span 
        class="char" 
        v-for="(char, index) in gameTitleChars" 
        :key="index" 
        :style="{ color: char.color, fontSize: char.fontSize + 'px' }"
      >
        {{ char.char }}
      </span>
    </span>

    <button @click="emit('play')">Play</button>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #001;
  width: 720px;
  height: 100vh;
  color: #fff;
}

.game-title {
  display: flex; 
  align-items: center;

  .char {
    font-weight: 400;
    transition: all ease-in-out 0.5s;
    letter-spacing: 6px;
  }
}

button {
  margin-top: 80px;
  height: 46px;
  width: 140px;
  border-radius: 23px;
  border: 1px solid #fff;
  background: #FFF;
  color: #000;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>
