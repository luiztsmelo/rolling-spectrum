<script setup lang="ts">
import { computed } from 'vue'
import { hslToRgba } from '../logic/helpers'
import { usePlayerStore } from '../store/player'

const player = usePlayerStore()

const style = computed(() => {
  return {
    width: `${player.getSize}px`,
    background: player.getColor,
    transform: `translate(${player.position.x}px, -${player.position.y}px)`,
    boxShadow: `2px 2px 50px 5px ${hslToRgba(player.getColor, 1)}`
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
