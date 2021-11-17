<template>
  <div class="container" ref="containerRef">
    <div
      v-touch:drag="dragHandler"
      v-touch:drag.once="dragStartHandler"
      v-touch:release="endHandler"
      id="card"
      ref="card"
    >
      <div id="headline">
        <h1>{{ this.chosenCard.headline }}</h1>
      </div>
        <p>{{ this.chosenCard.description }}</p>
        <div v-if="this.chosenCard.uid === 'END'">
        <button @click="this.$router.push('review')">Click here to review your chosen cards</button>
      </div>
      </div>
      
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, ComponentPublicInstance } from "vue"
import { SwipedCardT } from '@/types/iotsTypes'

export default defineComponent({
  props: ['chosenCard', 'endOfDeckCard', 'nextCard'],
  setup() {
    document.body.style.overscrollBehaviorY = "contain"; // prevent swipe to reload
    const card = ref<ComponentPublicInstance<HTMLInputElement>>()
    const containerRef = ref<ComponentPublicInstance<HTMLInputElement>>()
    return {
      card,
      containerRef,
    }
  },
  data() {
    const isDragging = false;
    if (!this.nextCard.uid) {
      this.nextCard()
    }
    return {
      isDragging,
      startDragXcoord: -1,
      card_x_coord: this.$store.state.CARD_CENTERED_X_COORD,
      card_y_coord: this.$store.state.CARD_CENTERED_Y_COORD,
      containerColor: 'white',
    }
  },
  methods: {
    dragHandler(e: TouchEvent) {
      if (this.card) {
        const cardBoundingRect = this.card.getBoundingClientRect()
        this.card_x_coord =
          e.targetTouches[0].clientX - cardBoundingRect.width / 2 + "px"
        this.card_y_coord =
          e.targetTouches[0].clientY - cardBoundingRect.height / 2 + "px"
      }
    },
    dragStartHandler(e: TouchEvent) {
      this.isDragging = true
      if (this.startDragXcoord === -1) {
        this.startDragXcoord = e.changedTouches[0].clientX
      }
    },
    endHandler(e: TouchEvent) {
      if (this.card && this.isDragging) {
        this.card_x_coord = this.$store.state.CARD_CENTERED_X_COORD
        this.card_y_coord = this.$store.state.CARD_CENTERED_Y_COORD
        this.isDragging = false

        const delta = e.changedTouches[0].clientX - this.startDragXcoord
        const screenWidth = e.view?.innerWidth
        if (screenWidth) {
          const deltaPc = delta / screenWidth
          console.log(deltaPc)
          if (deltaPc > 0.2) {
            this.feedbackAfterSwipe('right')
            const swipedCard: SwipedCardT = {
              card: {...this.chosenCard},
              swiped: 'right',
            }
            if (this.chosenCard.uid !== 'END') {
              this.$store.commit('addSwipedCard', swipedCard)
            }
            this.nextCard()

          }

          if (deltaPc < -0.15) {
            this.feedbackAfterSwipe('left')
            const swipedCard: SwipedCardT = {
              card: {...this.chosenCard},
              swiped: 'left'
            }
            if (this.chosenCard.uid !== 'END') {
              this.$store.commit('addSwipedCard', swipedCard)
            }
            this.nextCard()
          }
        }
      }
    },
    feedbackAfterSwipe(direction: 'left' | 'right') {
      this.containerColor = direction === 'right' ? 'green' : 'red'
      setTimeout(() => this.containerColor = "white", 1000)
    },
  },
})
</script>
<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: v-bind('containerColor');
  transition-property: background-color;
  transition-duration: 1s;
  transition-delay: 0s;
}
#card {
  background: rgb(20, 163, 196);
  color: white;
  width: 85%;
  height: 90%;
  position: absolute;
  border-radius: 1%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translate(v-bind('card_x_coord'), v-bind('card_y_coord'));
}
#headline {
  margin: 0 5% 0;
  border-bottom: 1px solid white;
}
p {
  font-size: 20px;
  padding: 0 10px 0;
}
</style>
