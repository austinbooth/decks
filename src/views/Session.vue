<template>
  <div class="home">
    <CardContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardContainer from "@/components/CardContainer.vue"

export default defineComponent({
  name: "Session",
  components: {
    CardContainer,
  },
});
</script>
