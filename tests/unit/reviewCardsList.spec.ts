import { mount } from "@vue/test-utils"
import  ReviewCardsList from "@/components/ReviewCardsList.vue"
import { DateTime } from "luxon"
import { CardT, SessionWithChosenCardArrayT } from "@/types/iotsTypes"

jest.mock('@/indexeddb')
jest.mock("@/firebase")

const card1: CardT = {
  uid: '456',
  headline: 'Card 1 headline',
  description: 'Card 1 description'
}

export const data: SessionWithChosenCardArrayT = [
  {
    uid: '0123',
    user: 'username',
    deck: {
      uid: '789',
      type: 'publisher'
    },
    cardsSwiped: [
      {
        card: card1,
        swiped: 'right'
      }
    ],
    datetime: DateTime.now(),
    chosenCard: card1.uid
  },
]

describe('ReviewCardsList.vue', () => {
  test('Renders cards to review correctly. Redirects appropriately when clicked.', async () => {
    const $router = {
      push: jest.fn()
    }

    const wrapper = mount(ReviewCardsList, {
      global: {
        mocks: {
          $router
        }
      },
      data() {
        return {
          unreviewedSessions: data
        }
      }
    })
    const elements = wrapper.findAll('[class="chosen"]')
    expect(elements).toHaveLength(1)
    expect(elements[0].attributes().id).toBe(data[0].uid)
    expect(elements[0].text()).toBe(card1.headline)
    await elements[0].trigger('click')
    expect($router.push).toHaveBeenCalledWith({name: "ReviewCard", params: { session: data[0].uid}})
  })
})
