<template>
  <div>
    <h3 v-if="this.$data.unreviewedSessions.length > 0">Review chosen cards:</h3>
    <p
      v-for="session in this.$data.unreviewedSessions"
      :key="session.uid"
      :id="session.uid"
      @click="reviewSelected($event)"
    >
      {{ session.cardsSwiped.find(swipedCard => swipedCard.card.uid === session.chosenCard).card.headline }}
    </p>
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
