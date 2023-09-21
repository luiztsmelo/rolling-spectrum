<script setup lang="ts">
import { getRandomNumber } from '@/utils'
import { onMounted } from 'vue'
import { useGameStore } from '@/store/game'

const game = useGameStore()

const props = defineProps({
  bar: {
    type: Object,
    required: true
  }
})

function animateBar () {
  const bar = document.querySelector(`.bar-${props.bar.id}`)
  if (!bar) return

  let firstGridTemplateColumns = props.bar.lines.map(() => `${getRandomNumber(1, 4)}fr `).join(' ')
  let secondGridTemplateColumns = props.bar.lines.map(() => `${getRandomNumber(1, 4)}fr `).join(' ')
  let thirdGridTemplateColumns = props.bar.lines.map(() => `${getRandomNumber(1, 4)}fr `).join(' ')

  bar.animate([
    { transform: 'translateY(0) scale(0)', opacity: 0, gridTemplateColumns: props.bar.lines.map(() => '1fr').join(' ') },
    { transform: `translateY(${0.1 * game.settings.height}px) scale(1)`, opacity: 1, gridTemplateColumns: props.bar.lines.map(() => '1fr').join(' ') },
    { transform: `translateY(${0.2 * game.settings.height}px) scale(1)`, opacity: 1, gridTemplateColumns: firstGridTemplateColumns },
    { transform: `translateY(${0.4 * game.settings.height}px) scale(1)`, opacity: 1, gridTemplateColumns: secondGridTemplateColumns },
    { transform: `translateY(${0.7 * game.settings.height}px) scale(1)`, opacity: 1, gridTemplateColumns: thirdGridTemplateColumns },
    { transform: `translateY(${game.settings.height}px) scale(1)`, opacity: 1, gridTemplateColumns: firstGridTemplateColumns }
  ], {
    duration: props.bar.speed,
    delay: props.bar.delay,
    easing: 'ease-out'
  })
}

onMounted(() => {
  animateBar()
})
</script>

<template>
  <div :class="`bar bar-${props.bar.id}`">
    <slot/>
  </div>
</template>

<style scoped>
.bar {
  display: grid;
  position: absolute;
  left: 10px;
  width: calc(100% - 20px);
  height: 7px;
  gap: 5px;
  z-index: 2;
  opacity: 0;
}
</style>
