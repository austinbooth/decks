<template>
  <div v-if="this.$data.cardToReview">
    <p>{{ this.$data.cardToReview.card.headline }}</p>
    <p>{{ this.$data.cardToReview.card.description }}</p>
    <p>You chose this on {{ this.$data.fullSession.datetime.toFormat('dd LLL') }}</p>
    <h3>Your review:</h3>
  </div>
  <div v-if="this.$data.error">
    {{ this.$data.error }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { getSessionForUser } from '@/firebase'
import { SessionWithChosenCard, isSessionWithChosenCard, SwipedCard } from "@/types"

export default defineComponent({
  name: 'ReviewCard',
  props: {
    session: String
  },
  data() {
    let fullSession: SessionWithChosenCard | undefined
    let cardToReview: SwipedCard | undefined
    const error = ''
    return {
      fullSession,
      cardToReview,
      error,
    }
  },
  mounted() {
    (async () => {
      if (this.session) {
        const sessionData = await getSessionForUser(this.session)
        if (typeof sessionData === 'string') {
          this.error = sessionData
        } else if(isSessionWithChosenCard(sessionData)) {
          this.fullSession = sessionData
          const card = sessionData.cardsSwiped.find(swipedCard => swipedCard.card.uid === sessionData.chosenCard)
          if (card && card.swiped === 'right') {
            this.$data.cardToReview = card
          } else {
            this.$data.error = 'Error fetching card'
          }
        }
      } else {
        this.$data.error = 'Error, no session id.'
      }
    })()
  }
})
</script>