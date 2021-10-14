<template>
  <div v-if="this.$data.error">
    {{ this.$data.error }}
  </div>
  <div v-if="this.$data.cardToReview">
    <h2>{{ this.$data.cardToReview.card.headline }}</h2>
    <p>{{ this.$data.cardToReview.card.description }}</p>
    <p>You chose this on {{ this.$data.fullSession.datetime.toFormat('dd LLL') }}</p>
    <h3>Your review:</h3>
  </div>
  <div class="emoji_card_container">
    <EmojiCard
      v-for="rating in this.$data.reviewEmojiKeysArray"
      :rating="rating"
      :key="'rating_card_'+rating"
      @set_rating_value="setRatingValue"
    />
  </div>
  <div v-if="this.$data.reviewValue" class="chosen_rating_container">
      <h3>You chose</h3>
      <EmojiCard :rating="this.$data.reviewValue" :key="this.$data.reviewValue" @set_rating_value="setRatingValue" />
      <button @click="submitReview" class="submit">Submit</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import EmojiCard, { ReviewEmojiKeys, ReviewEmojiLookup } from '@/components/session_review/EmojiCard.vue'
import { getSessionForUser, setSessionInFireStore } from '@/firebase'
import { writeSessionToidb } from '@/indexeddb'
import { SessionWithChosenCard, isSessionWithChosenCard, SwipedCard, SessionWithReview } from "@/types"
import { DateTime } from "luxon"

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
      reviewValue: 0,
      reviewEmojiKeysArray: Object.keys(ReviewEmojiLookup).map(k => +k)
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
  },
  methods: {
    setRatingValue(value: ReviewEmojiKeys) {
      this.$data.reviewValue = value
    },
    async submitReview() {
      if (this.fullSession) {
        const sessionWithReview: SessionWithReview = {
          ...this.fullSession,
          review: {
            datetime: DateTime.now().toUTC(),
            reviewValue: this.$data.reviewValue
          }
        }
        try {
          await setSessionInFireStore(sessionWithReview)
          await writeSessionToidb(sessionWithReview)
          this.$router.push('/')
        } catch (err) {
          console.log(err)
          this.$data.error = err
        }
      }
    }
  },
  components: {
    EmojiCard,
  }
})
</script>
<style scoped>
  .emoji_card_container {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .chosen_rating_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 6px;
  }
  .submit {
    margin-top: 20px;
  }
</style>
