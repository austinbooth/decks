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
        <h1>{{ this.cardData.headline }}</h1>
      </div>
        <p>{{ this.cardData.description }}</p>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, ComponentPublicInstance } from "vue";
type CardData = {
  headline: string;
  description: string;
};
export default defineComponent({
  setup() {
    document.body.style.overscrollBehaviorY = "contain"; // prevent swipe to reload
    const card = ref<ComponentPublicInstance<HTMLInputElement>>();
    const containerRef = ref<ComponentPublicInstance<HTMLInputElement>>();
    return {
      card,
      containerRef,
    };
  },
  data() {
    const cardData: CardData = {
      headline: "Heading to the cinema",
      description: "Catch a movie on the big screen",
    };
    let isDragging = false;
    return {
      cardData,
      isDragging,
      startDragXcoord: -1
    };
  },
  methods: {
    dragHandler(e: TouchEvent) {
      const windowWidth =
        this.containerRef && this.containerRef.getBoundingClientRect().width;
      const windowHeight =
        this.containerRef && this.containerRef.getBoundingClientRect().height;

      if (this.card) {
        const boundingRect = this.card.getBoundingClientRect();
        this.card.style.left =
          e.targetTouches[0].clientX - boundingRect.width / 2 + "px";
        this.card.style.top =
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
          if (deltaPc > 0.15) {
            document.body.style.background = "green"
          }

          if (deltaPc < -0.2) {
            document.body.style.background = "red"
          }
        }
        console.log(delta)
      }
    },
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
