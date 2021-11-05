<template>
  <div class="container" v-if="this.$data.unreviewedSessions.length > 0">
    <h3>Review your chosen cards:</h3>
    <div
      v-for="session in this.$data.unreviewedSessions"
      :key="session.uid"
      :id="session.uid"
      @click="reviewSelected($event)"
      class="chosen"
    >
      {{ session.cardsSwiped.find(swipedCard => swipedCard.card.uid === session.chosenCard).card.headline }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { getUserFromidb } from '@/indexeddb'
import { getUnreviewedSessions } from "@/firebase"
import { SessionWithChosenCard } from "@/types"

export default defineComponent({
  data() {
    const unreviewedSessions: SessionWithChosenCard[] = []
    return {
      unreviewedSessions,
    }
  },
  mounted() {
    (async () => {
      const user = await getUserFromidb()
      const unreviewedSessions = await getUnreviewedSessions(user)
      console.log(unreviewedSessions)
      if (unreviewedSessions) {
        this.$data.unreviewedSessions = unreviewedSessions
      }
    })()
  },
  methods: {
    reviewSelected(e: Event) {
      const session = (e.currentTarget as HTMLInputElement).id
      if (session) {
        this.$router.push({name: 'ReviewCard', params: { session }})
      }
    }
  },
})
</script>
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 90%;
    margin: 18px auto 0;
    padding: 8px 3px 12px;
    border-radius: 5px;
  }
  .chosen {
    background: rgb(255, 162, 0);
    border-radius: 12px;
    padding: 8px 16px;
    margin: 8px 0;
    width: fit-content;
  }
  h3 {
    margin-bottom: 12px;
  }
</style>