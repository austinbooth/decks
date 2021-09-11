<template>
  <div>Value: {{ this.$store.state.counter }}</div>
  <button v-on:click="add1">+1</button>
  <button v-on:click="add5">+5</button>
  <button v-on:click="this.$store.commit('increment', 100)">+100!</button>
  <button v-on:click="this.localCounter += 1">Local counter: {{ this.localCounter }}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // data() {
  //   return {
  //     localCounter: 7
  //   }
  // },
  data: () => ({ localCounter: 7 }),
  methods: {
      add1(): void {
        this.$store.commit('increment', 1)
      },
      add5(): void {
        this.$store.commit('increment', 5)
      }
  }
})
</script>
