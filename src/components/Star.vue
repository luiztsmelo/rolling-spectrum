<script setup lang="ts">
import { onMounted } from 'vue'
import { getRandomNumber } from '@/logic/helpers'
import { useGameStore } from '../store/game'

const game = useGameStore()

const props = defineProps({
  star: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['disappear'])

function animateStar () {
  const star = document.querySelector(`.star-${props.star.id}`)
  if (!star) return

  const top = getRandomNumber(0, 90)

  const starAnimation = star.animate([
    { top: `${top}%`, opacity: 0, transform: `scale(${getRandomNumber(0, 3)})` },
    { opacity: 1, transform: `scale(${getRandomNumber(0, 3)})` },
    { top: `${top + 7}%`, opacity: 0, transform: `scale(${getRandomNumber(0, 3)})` }
  ], {
    duration: props.star.speed,
    easing: 'ease-in-out'
  })

  if (!starAnimation) return

  starAnimation.onfinish = () => emit('disappear')
}

onMounted(() => {
  animateStar()
})
</script>

<template>
  <div 
    :class="`star star-${props.star.id}`"
    :style="{ left: `${getRandomNumber(0, game.settings.width - 2)}px`, width: `${props.star.size}px` , height: `${props.star.size}px` }" 
  >
  </div>
</template>

<style scoped>
.star {
  opacity: 0;
  border-radius: 50%;
  position: absolute;
  top: 0;
  background: rgba(255, 255, 255, 0.85);
}
</style>
