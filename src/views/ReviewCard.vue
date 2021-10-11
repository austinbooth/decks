<script lang="ts">
import { defineComponent } from "vue"
import { getUnreviewedSessions } from "@/firebase"
import { Session } from "@/types"

export default defineComponent({
  data() {
    const unreviewedSessions: Session[] = []
    return {
      unreviewedSessions,
    }
  },
  mounted() {
    (async () => {
      const unreviewedSessions = await getUnreviewedSessions()
      console.log(unreviewedSessions)
      if (unreviewedSessions) {
        this.$data.unreviewedSessions = unreviewedSessions
      }
    })()
  },
})
</script>