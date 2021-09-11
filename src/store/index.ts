import { createStore } from "vuex";

export default createStore({
  state: {
    counter: 0,
  },
  mutations: {
    increment: (currentState, value) => currentState.counter += value
  },
  actions: {},
  modules: {},
});
