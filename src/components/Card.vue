<template>
  <div class="container" ref="containerRef">
    <div v-touch:swipe.left="swipeLeftHandler" v-touch:swipe.right="swipeRightHandler" v-touch:drag="dragHandler" id="block" ref="block">
      <h1>{{this.cardData.headline}}</h1>
      <p>{{this.cardData.description}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, ComponentPublicInstance } from 'vue'
type CardData = {
  headline: string
  description: string
}
export default defineComponent({
  setup() {
    document.body.style.overscrollBehaviorY = 'contain' // prevent swipe to reload
    const block = ref<ComponentPublicInstance<HTMLInputElement>>()
    const containerRef = ref<ComponentPublicInstance<HTMLInputElement>>()
    return {
      block,
      containerRef
    }
  },
  data() {
    const cardData: CardData = {
      headline: 'Heading to the cinema',
      description: 'Catch a movie on the big screen',
    }
    return {
      cardData
    }
  },
  methods: {
    swipeLeftHandler() {
      console.log('<<< swiped LEFT!')
      document.body.style.background = 'red'
    },
    swipeRightHandler() {
      console.log('>>> swiped RIGHT!')
      document.body.style.background = 'green'
    },
    dragHandler(e: TouchEvent) {
      const windowWidth = this.containerRef && this.containerRef.getBoundingClientRect().width
      const windowHeight = this.containerRef && this.containerRef.getBoundingClientRect().height

    //   if (this.block) {
    //     const boundingRect = this.block.getBoundingClientRect()
    //     this.block.style.left = (e.targetTouches[0].clientX - (boundingRect.width / 2)) + "px"
    //     this.block.style.top = (e.targetTouches[0].clientY - (boundingRect.height / 2)) + "px"
    //     console.log(this.block.getBoundingClientRect())
    //   }
    }
  }
})

</script>
<style scoped>
  .container {
    /* display: flex;
    justify-content: center; */

    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

  }
  #block {
    background: rgb(20, 163, 196);
    color: white;
    top: 4.75%;
    left: 7.75%;
    width: 85%;
    height: 90%;
    position: absolute;
  }
</style>
