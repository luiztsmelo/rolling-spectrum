<script setup lang="ts">
const props = defineProps({
  line: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="line" :id="`line-${props.line.id}`" :style="{ background: props.line.color }"></div>
</template>

<style scoped>
.line {
  height: 7px;
}
</style>
