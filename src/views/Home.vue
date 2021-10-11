<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <!-- <Counter /> -->
    <!-- <CardTest /> -->
    <CardContainer />
    <ReviewCard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Counter from "@/components/Counter.vue"
import CardTest from "@/components/CardTest.vue"
import CardContainer from "@/components/CardContainer.vue"
import ReviewCard from "@/views/ReviewCard.vue"
import { openDB } from 'idb'
import { createAnonymousUser } from '@/firebase'
import { DBNAME, USER_STORE_NAME, SWIPING_SESSIONS_STORE_NAME } from '@/indexeddb'

(async () => {
  const version = 1
  const db = await openDB(DBNAME, version, {
    upgrade: async(db, localDbVersion) => {
      if (localDbVersion === 0) {
        await db.createObjectStore(USER_STORE_NAME)
        await db.createObjectStore(SWIPING_SESSIONS_STORE_NAME, {
          keyPath: 'uid'
        })
        const createdUserId = await createAnonymousUser()
        console.log('Created user:', createdUserId)
      }      
    }
  })
})()

export default defineComponent({
  name: "Home",
  components: {
    // HelloWorld,
    // Counter,
    // CardTest
    CardContainer,
    ReviewCard,
  },
});
</script>
