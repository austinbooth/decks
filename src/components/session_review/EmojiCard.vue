<template>
  <div class="container" v-if="rating" :id="rating" @click="cardClick($event)">
    <p class="emoji">{{ this.$data.emoji }}</p>
    <p>{{ this.$data.description }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"

export const ReviewEmojiLookup = {
  1: '😖',
  2: '😕',
  3: '🙂',
  4: '😍',
} as const

export type ReviewEmojiKeys = keyof typeof ReviewEmojiLookup
type ReviewEmojiValues = typeof ReviewEmojiLookup[ReviewEmojiKeys]

const ReviewEmojiExplanationLookup = {
  1: 'Bad',
  2: 'Meh',
  3: 'Good',
  4: 'Great!',
} as const

export default defineComponent({
  name: 'EmojiCard',
  props: {
    rating: {
      type: Number as () => ReviewEmojiKeys
    },
  },
  data() {
    const emoji = this.rating ? ReviewEmojiLookup[this.rating] : null
    const description = this.rating ? ReviewEmojiExplanationLookup[this.rating] : null
    return {
      emoji,
      description,
    }
  },
  methods: {
    cardClick(e: Event) {
      const id  = +(e.currentTarget as HTMLInputElement).id as ReviewEmojiKeys
      this.$emit('set_rating_value', id)
    }
  }
})
</script>
<style scoped>
  .container {
    text-align: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    margin: 0 5px;
    width: 100%;
    max-width: 100px;

  }
  .emoji {
    font-size: 2rem;
  }
  p {
    margin: 6px 0;
  }
</style>
