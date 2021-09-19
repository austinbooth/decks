<template>
  <div class="container">
    <div v-touch:swipe.left="swipeLeftHandler" v-touch:swipe.right="swipeRightHandler" v-touch:drag="dragHandler" id="block" ref="block" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, ComponentPublicInstance } from 'vue'
export default defineComponent({
  setup() {
    document.body.style.overscrollBehaviorY = 'contain' // prevent swipe to reload
    const block = ref<ComponentPublicInstance<HTMLInputElement>>()
    return {
      block
    }
  },
  methods: {
    swipeLeftHandler() {
      console.log('<<< swiped LEFT!')
    },
    swipeRightHandler() {
      console.log('>>> swiped RIGHT!')
    },
    dragHandler(e: TouchEvent) {
      if (this.block) {
        const boundingRect = this.block.getBoundingClientRect()
        this.block.style.left = (e.targetTouches[0].clientX - (boundingRect.width / 2)) + "px"
        this.block.style.top = (e.targetTouches[0].clientY - (boundingRect.height / 2)) + "px"
      }
    }
  }
})

</script>
<style scoped>
  .container {
    display: flex;
    justify-content: center;
  }
  #block {
    background: red;
    width: 100px;
    height: 100px;
    position: absolute;
  }
</style>
