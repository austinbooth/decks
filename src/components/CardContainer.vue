<template>
  <div v-if="this.loading">loading: {{this.loading}}</div>
  <Card v-if="!this.loading" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getAllCardsInDeck } from '../firebase'
import Card from "@/components/Card.vue"

export default defineComponent({
    setup() {
      const loading = ref(true)
      const cards = ref()
      onMounted(async() => {
        try {
          cards.value = await getAllCardsInDeck()
        } catch (err) {
          console.error(err)    
        } finally {
          loading.value = false
        }
      })
      return {
        loading,
        cards
      }
    },
    components: {
      Card
    }
})
</script>
