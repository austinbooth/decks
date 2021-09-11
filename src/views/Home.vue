<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <div style="background: red">Drag me</div>
    <Counter />
    <Card />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Counter from "@/components/Counter.vue"
import Card from "@/components/Card.vue"

export default defineComponent({
  name: "Home",
  components: {
    // HelloWorld,
    Counter,
    Card
  },
});
</script>
