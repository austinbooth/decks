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
})
