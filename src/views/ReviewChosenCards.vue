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
  <div v-if="this.selected.card.uid.length > 0">
    <p>You selected {{this.selected.card.headline}}</p>
    <p>Is this the activity/food that you will do/eat?</p>
    <button @click="selectItemToDo($event)">Yes</button>
  </div>
</template>

<script lang="ts">
import { SwipedCard } from "@/types"
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
      const card = this.$store.state.currentSession.cardsSwiped.find(c => c.card.uid === target.id)
      if (card) {
        this.selected = card
      }
    },
    selectItemToDo(e: Event) {
      if (this.selected.card.uid.length > 0) {
        // TODO check this logic and assign a type to cardToDo
        const cardToDo = mapKeys(this.selected.card, (_, key) => key === 'uid' ? 'cardUid' : key)
        // is renaming this key necessary?
        cardToDo.datetime = DateTime.now().toString()
        // TODO Save this data
      }
    }
  }
})
</script>