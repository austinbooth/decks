<template>
  <div>
    <h3>You swiped right on:</h3>
    <p
      v-for="swipedCard in this.$store.state.currentSession.cardsSwiped.filter(
        (c) => c.swiped === 'right'
      )"
      :key="swipedCard.card.uid"
      :id="swipedCard.card.uid"
      @click="itemClick($event)"
    >
      {{ swipedCard.card.headline }}
    </p>
  </div>
  <div v-if="this.selected.card.uid">
    <p>You selected {{this.selected.card.headline}}</p>
    <p>Is this your final selection?</p>
    <button @click="selectItemToDo">Yes</button>
  </div>
</template>

<script lang="ts">
import { Session, SwipedCard } from "@/types"
import { defineComponent } from "vue"
import mapKeys from "lodash/mapKeys"
import { DateTime } from 'luxon'

export default defineComponent({
  data() {
    let selected: SwipedCard = {card: {uid:'', headline:'', description:''}, swiped: 'right'}
    return {
      selected
    }
  },
  methods: {
    itemClick(e: Event) {
      const target = (e.currentTarget as HTMLInputElement)
      const card = (this.$store.state.currentSession as Session).cardsSwiped.find((c) => c.card.uid === target.id)
      if (card) {
        this.selected = card
      }
    },
    selectItemToDo() {
      if (this.selected.card.uid) {
        this.$store.commit('addChosenCard', this.selected.card.uid)
      }
    }
  }
})
</script>