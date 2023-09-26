<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/store/player'

const player = usePlayerStore()

const style = computed(() => {
  return {
    width: `${player.size}px`,
    background: player.color,
    transform: `translate(${player.position.x}px, -${player.position.y}px)`,
    boxShadow: `2px 2px 50px 5px ${player.color}`
  }
})
</script>

<template>
  <div id="player-ball" :style="style"></div>
</template>

<style scoped>
#player-ball {
  position: absolute;
  bottom: 0;
  left: 0;
  aspect-ratio: 1;
  border-radius: 50%;
  transition: background 0.5s ease;
  z-index: 3;
}
</style>
