<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <!-- <Counter /> -->
    <!-- <CardTest /> -->
    <CardContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Counter from "@/components/Counter.vue"
import CardTest from "@/components/CardTest.vue"
import CardContainer from "@/components/CardContainer.vue"

export default defineComponent({
  name: "Home",
  components: {
    // HelloWorld,
    // Counter,
    // CardTest
    CardContainer
  },
});
</script>
