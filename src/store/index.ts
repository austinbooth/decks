import { createStore } from "vuex";
import { Card, SwipedCard } from '@/types'

export default createStore({
  state: {
    // counter: 0,
    CARD_CENTERED_X_COORD: '9%',
    CARD_CENTERED_Y_COORD: '5.25%',
    cards: [],
    cardsSwiped: [] as SwipedCard[],
  },
  mutations: {
    // increment: (currentState, value) => currentState.counter += value
    setCards: (currentState, value) => currentState.cards = value,
    addSwipedCard: (currentState, newCard) => currentState.cardsSwiped.push(newCard),
  },
  actions: {},
  modules: {},
});
