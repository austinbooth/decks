<template>
  <div v-if="this.loading">loading: {{this.loading}}</div>
  <Card v-if="!this.loading" />

</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getAllCardsInDeck } from '../firebase'
import Card from "@/components/Card.vue"
import { useStore } from 'vuex'

// put generator code etc in here and pass down card data + fn to get next card

export default defineComponent({
    setup() {
      const loading = ref(true)
      const cards = ref()
      const store = useStore()
      onMounted(async() => {
        try {
          const cardsData = await getAllCardsInDeck()
          cards.value = cardsData
          store.commit('setCards', cardsData)
        } catch (err) {
          console.error(err)    
        } finally {
          loading.value = false
        }
      })
      
      return {
        loading,
        cards,
      }
    },
    components: {
      Card
    }
})
</script>
