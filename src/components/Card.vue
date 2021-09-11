<template>
  <span v-touch:drag.once="touchHandler" v-touch:release="releaseHandler" draggable="true">Tap Me</span>
  <span v-touch:swipe="swipeHandler">Swipe me</span>
</template>

<script lang="ts">
export default {
  methods: {
    touchHandler() {
      console.log('touched!')
    },
    releaseHandler() {
      console.log('released')
    },
    swipeHandler() {
      console.log('swiped')
    }
  }
}
</script>
