<script setup lang="ts">
import { getRandomNumber } from '@/utils'
import { onMounted } from 'vue'

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
    { top: "0%", transform: 'scale(0)', opacity: 0, gridTemplateColumns: props.bar.lines.map(() => '1fr').join(' ') },
    { top: "10%", transform: 'scale(1)', opacity: 1, gridTemplateColumns: props.bar.lines.map(() => '1fr').join(' ') },
    { top: "20%", transform: 'scale(1)', opacity: 1, gridTemplateColumns: firstGridTemplateColumns },
    { top: "40%", transform: 'scale(1)', opacity: 1, gridTemplateColumns: secondGridTemplateColumns },
    { top: "70%", transform: 'scale(1)', opacity: 1, gridTemplateColumns: thirdGridTemplateColumns },
    { top: "100%", transform: 'scale(1)', opacity: 1, gridTemplateColumns: firstGridTemplateColumns }
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
  position: absolute;
  left: 10px;
  display: grid;
  width: calc(100% - 20px);
  gap: 5px;
  height: 7px;
  z-index: 2;
  opacity: 0;
}
</style>
