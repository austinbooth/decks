<template>
  <div>
    <div class="home-container">
      <h3>Decks:</h3>
      <DeckList :decks="this.$data.publisherDecks" />
    </div>
    <ReviewCardsList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import ReviewCardsList from "@/components/ReviewCardsList.vue"
import DeckList from "@/components/DeckList.vue"
import { openDB } from "idb"
import { createAnonymousUser, getAllPublisherDecks } from "@/firebase"
import {
  DBNAME,
  USER_STORE_NAME,
  SWIPING_SESSIONS_STORE_NAME,
} from "@/indexeddb"
import { DeckInfoArrayT } from "@/types/iotsTypes"

(async () => {
  const version = 1
  const db = await openDB(DBNAME, version, {
    upgrade: async (db, localDbVersion) => {
      if (localDbVersion === 0) {
        await db.createObjectStore(USER_STORE_NAME)
        await db.createObjectStore(SWIPING_SESSIONS_STORE_NAME, {
          keyPath: "uid",
        })
        const createdUserId = await createAnonymousUser()
        console.log("Created user:", createdUserId)
      }
    },
  })
})()

export default defineComponent({
  name: "Home",
  components: {
    ReviewCardsList,
    DeckList,
  },
  data() {
    const publisherDecks: DeckInfoArrayT = []
    return {
      publisherDecks,
    }
  },
  mounted() {
    (async () => {
      const decks = await getAllPublisherDecks()
      console.log("-->>", decks)
      this.$data.publisherDecks = decks ?? []
    })()
  },
})
</script>
<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 90%;
  margin: 18px auto 0;
  padding: 8px 3px 24px;
  border-radius: 5px;
}
</style>