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
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, ComponentPublicInstance } from "vue";
import { useStore } from 'vuex'
import { shuffle } from 'lodash'
import { Card } from '@/types'

export default defineComponent({
  setup() {
    document.body.style.overscrollBehaviorY = "contain"; // prevent swipe to reload
    document.body.style.transition = "background-color 1s"
    document.body.style.transitionDelay = "0s"
    const card = ref<ComponentPublicInstance<HTMLInputElement>>()
    const containerRef = ref<ComponentPublicInstance<HTMLInputElement>>()
    
    return {
      card,
      containerRef,
    };
  },
  data() {
    const isDragging = false;
    const store = useStore()
    const getCard = function*() {
      const shuffledCards = shuffle(store.state.cards)
      for (let i = 0; i < shuffledCards.length; i++) {
        yield shuffledCards[i]
      }
    }()
    const endOfDeckCard: Card = {
      uid: 'END',
      headline: 'End',
      description: "You've reached the end of the deck.",
    }
    const chosenCard = getCard.next().value

    return {
      isDragging,
      startDragXcoord: -1,
      getCard,
      endOfDeckCard,
      chosenCard,
      card_x_coord: '7.75%',
      card_y_coord: '4.75%',
    }
  },
  methods: {
    dragHandler(e: TouchEvent) {
      const windowWidth =
        this.containerRef && this.containerRef.getBoundingClientRect().width;
      const windowHeight =
        this.containerRef && this.containerRef.getBoundingClientRect().height;

      if (this.card) {
        const boundingRect = this.card.getBoundingClientRect();
        this.card_x_coord =
          e.targetTouches[0].clientX - boundingRect.width / 2 + "px";
        this.card_y_coord =
          e.targetTouches[0].clientY - boundingRect.height / 2 + "px";
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
        this.card.style.left = "7.75%";
        this.card.style.top = "4.75%";
        this.isDragging = false;

        const delta = e.changedTouches[0].clientX - this.startDragXcoord
        const screenWidth = e.view?.innerWidth
        if (screenWidth) {
          const deltaPc = delta / screenWidth
          console.log(deltaPc)
          if (deltaPc > 0.2) {
            this.feedbackAfterSwipe('right')
            this.nextCard()
          }

          if (deltaPc < -0.15) {
            this.feedbackAfterSwipe('left')
            this.nextCard()
          }
        }
      }
    },
    feedbackAfterSwipe(direction: 'left' | 'right') {
      document.body.style.background = direction === 'right' ? 'green' : 'red'
      setTimeout(() => document.body.style.background = "white", 1000)
    },
    nextCard() {
      const { done, value } = this.getCard.next()
      this.chosenCard = !done ? value : this.endOfDeckCard
    }
  },
});
</script>
<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#card {
  background: rgb(20, 163, 196);
  color: white;
  top: 4.75%;
  left: 7.75%;
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
