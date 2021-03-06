// vuex-shim.d.ts
// from https://stackoverflow.com/questions/64412243/vue-js-3-and-typescript-property-store-does-not-exist-on-type-componentpub

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { Card, SwipedCard } from '@/types'
import { SessionT } from '@/types/iotsTypes'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    // counter: number
    CARD_CENTERED_X_COORD: string,
    CARD_CENTERED_Y_COORD: string,
    cards: [],
    currentSession: SessionT,
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
