import { mount } from "@vue/test-utils"
import  DeckList from "@/components/DeckList.vue"

const data = [
  {
    uid: '0123',
    name: 'Test deck 1',
    description: 'First test deck'
  },
  {
    uid: '4567',
    name: 'Test deck 2',
    description: 'second test deck'
  }
]

describe('DeckList.vue', () => {
  test('Renders the correct number of buttons with deck names being the button text', async () => {
    const wrapper = mount(DeckList, { props: { decks: data }})
    const buttons = wrapper.findAll('[class="deck-btn"]')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe(data[0].name)
    expect(buttons[1].text()).toBe(data[1].name)    
  })
  test('The store commit fn is called along with the router push method when one of the buttons is pressed', async () => {
    const $store = {
      state: {
        chosenDeck: ''
      },
      commit: jest.fn()
    }
    const $router = {
      push: jest.fn()
    }
    const wrapper = mount(DeckList, {
      props: {
        decks: data
      },
      global: {
        mocks: {
          $store,
          $router
        }
      }
    })
    const buttons = wrapper.findAll('[class="deck-btn"]')
    await buttons[0].trigger('click')
    expect($store.commit).toHaveBeenCalled()
    expect($router.push).toBeCalledWith('session')
  })
})
