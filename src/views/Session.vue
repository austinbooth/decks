<template>
  <div class="home">
    <CardContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardContainer from "@/components/CardContainer.vue"
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
  name: "Session",
  components: {
    CardContainer,
  },
});
</script>
