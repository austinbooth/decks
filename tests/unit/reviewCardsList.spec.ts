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
  test('Renders the correct number of elements with each elements text being the swiped right card headline', () => {
    const wrapper = mount(ReviewCardsList, {
      data() {
        return {
          unreviewedSessions: data
        }
      }
    })
    const elements = wrapper.findAll('[class="chosen"]')
    expect(elements).toHaveLength(1)
    expect(elements[0].text()).toBe(card1.headline)
  })
})
