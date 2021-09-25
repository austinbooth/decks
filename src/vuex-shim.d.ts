// vuex-shim.d.ts
// from https://stackoverflow.com/questions/64412243/vue-js-3-and-typescript-property-store-does-not-exist-on-type-componentpub

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { Card } from '@/types'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    // counter: number
    cards: []
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
