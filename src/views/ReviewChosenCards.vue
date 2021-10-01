<template>
  <div>
    <h3>You swiped right on:</h3>
    <p
      v-for="card in this.$store.state.cardsSwiped.filter(
        (c) => c.swiped === 'right'
      )"
      :key="card.uid"
      :id="card.uid"
      @click="itemClick($event)"
    >
      {{ card.headline }}
    </p>
  </div>
  <div v-if="this.selected.uid.length > 0">
    <p>You selected {{this.selected.headline}}</p>
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
    let selected: SwipedCard = {uid:'', headline:'', description:'', swiped: 'right'}
    return {
      selected
    }
  },
  methods: {
    itemClick(e: Event) {
      const target = (e.currentTarget as HTMLInputElement)
      const card = this.$store.state.cardsSwiped.find(c => c.uid === target.id)
      if (card) {
        this.selected = card
      }
    },
    selectItemToDo(e: Event) {
      if (this.selected.uid.length > 0) {
        const {uid, headline, description, swiped} = this.selected
        const cardToDo = mapKeys(this.selected, (_, key) => key === 'uid' ? 'cardUid' : key)
        cardToDo.datetime = DateTime.now().toString()
        // TODO Save this data
      }
    }
  }
})
</script>