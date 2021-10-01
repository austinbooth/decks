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
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  methods: {
    itemClick(e: Event) {
      const target = (e.currentTarget as HTMLInputElement)
      console.log(target.id)
    }
  }
})
</script>