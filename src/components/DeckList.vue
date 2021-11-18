<template>
  <button
    v-for="deck in this.decks"
    :key="deck.uid"
    class="deck-btn"
    @click="chooseDeck(deck.uid)"
  >
    {{ deck.name }}
  </button>
</template>

<script lang="ts">
  import { defineComponent } from "vue"
  import { DeckInfoArrayT } from "@/types/iotsTypes"
  export default defineComponent({
    props: {
      decks: Array as () => DeckInfoArrayT
    },
    methods: {
      chooseDeck(deck: string) {
        this.$store.commit('clearSessionData') // clear any old session data
        this.$store.commit('setChosenDeck', deck)
        this.$router.push('session')
      }
    }
  })
</script>

<style scoped>
  .deck-btn {
    width: fit-content;
    margin: 4px 0;
  }
</style>