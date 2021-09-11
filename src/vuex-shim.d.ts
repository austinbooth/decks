// vuex-shim.d.ts
// from https://stackoverflow.com/questions/64412243/vue-js-3-and-typescript-property-store-does-not-exist-on-type-componentpub

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    counter: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
