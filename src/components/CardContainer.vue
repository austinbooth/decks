<template>
  <div v-if="this.loading">loading: {{ this.loading }}</div>
  <Card
    v-if="!this.loading"
    :chosenCard="this.chosenCard"
    :endOfDeckCard="this.endOfDeckCard"
    :nextCard="this.nextCard"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { getAllCardsInDeck } from "../firebase";
import Card from "@/components/Card.vue";
import { useStore } from "vuex";
import shuffle from "lodash/shuffle";
import { Card as CardType } from "@/types";

export default defineComponent({
  setup() {
    const loading = ref(true)
    const cards = ref()
    const store = useStore()
    onMounted(async () => {
      try {
        const cardsData = await getAllCardsInDeck(store.state.chosenDeck)
        cards.value = cardsData
        store.commit("setCards", cardsData)
      } catch (err) {
        console.error(err)
      } finally {
        loading.value = false
      }
    });

    const endOfDeckCard: CardType = {
      uid: "END",
      headline: "End",
      description: "You've reached the end of the deck.",
    };
    return {
      loading,
      cards,
      endOfDeckCard,
    };
  },
  data() {
    const store = useStore()
    const getCard = (function* () {
      const shuffledCards = shuffle(store.state.cards)
      for (let i = 0; i < shuffledCards.length; i++) {
        yield shuffledCards[i]
      }
    })()
    const nextCard = () => {
      const { done, value } = getCard.next()
      this.chosenCard = !done ? value : this.endOfDeckCard
    };
    return {
      chosenCard: {},
      nextCard,
    };
  },
  components: {
    Card,
  },
});
</script>
