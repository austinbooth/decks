import { createStore } from "vuex";
import { Card } from '@/types'

export default createStore({
  state: {
    // counter: 0,
    cards: [],
  },
  mutations: {
    // increment: (currentState, value) => currentState.counter += value
    setCards: (currentState, value) => currentState.cards = value
  },
  actions: {},
  modules: {},
});
