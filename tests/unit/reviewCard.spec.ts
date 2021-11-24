import { mount } from "@vue/test-utils"
import ReviewCard from '@/views/ReviewCard.vue'
import EmojiCard from '@/components/session_review/EmojiCard.vue'
import { SessionWithChosenCardT, CardT } from "@/types/iotsTypes"
import { DateTime } from "luxon"

jest.mock('@/indexeddb')
jest.mock("@/firebase")

const card1: CardT = {
  uid: 'c456',
  headline: 'Card 1 headline',
  description: 'Card 1 description'
}

const session: SessionWithChosenCardT = {
  uid: 's12345',
  user: 'u123',
  datetime: DateTime.now(),
  deck: {
    uid: 'd123',
    type: 'publisher'
  },
  cardsSwiped: [
    {
      card: card1,
      swiped: 'right'
    }
  ],
  chosenCard: card1.uid
}

const mountComponent = () => {
  const wrapper = mount(ReviewCard, {
    props: {
      session: session.uid
    },
    data() {
      return {
        fullSession: session,
        cardToReview: {
          card: card1
        }
      }
    },
  })
  return wrapper
}

describe('ReviewCard.vue', () => {
  test('Should render the chosen card headline and description, and format the datetime correctly ', () => {
    const wrapper = mountComponent()
    const wrapperText = wrapper.text()
    expect(wrapperText).toMatch(card1.headline)
    expect(wrapperText).toMatch(card1.description)
    expect(wrapperText).toMatch(`You chose this on ${session.datetime.toFormat('dd LLL')}`)
  })
  test('Should display all emoji cards correctly', () => {
    const wrapper = mountComponent()
    const emojiCards = wrapper.findAllComponents(EmojiCard)
    expect(emojiCards.length).toEqual(4)
    expect(emojiCards[0].text()).toMatch('😖Bad')
    expect(emojiCards[1].text()).toMatch('😕Meh')
    expect(emojiCards[2].text()).toMatch('🙂Good')
    expect(emojiCards[3].text()).toMatch('😍Great!')
  })
  test('Should display the chosen emoji card when one is clicked', async () => {
    const wrapper = mountComponent()
    const emojiCardsBeforeClick = wrapper.findAllComponents(EmojiCard)
    expect(emojiCardsBeforeClick.length).toEqual(4)
    await emojiCardsBeforeClick[2].trigger('click')
    const chosenEmojiCard = wrapper.find('[class="chosen_rating_container"]').findComponent(EmojiCard)
    expect(chosenEmojiCard.text()).toMatch('🙂Good')
  })
  test('The correct rating is chosen when an chosen emoji card is clicked', async () => {
    const wrapper = mountComponent()
    const emojiCardsBeforeClick = wrapper.findAllComponents(EmojiCard)
    expect(wrapper.vm.reviewValue).toBe(undefined) // vm is the Vue instance
    await emojiCardsBeforeClick[1].trigger('click')
    expect(wrapper.vm.reviewValue).toEqual(2)
  })

  test('The correct fn is called when the submit button is pressed', async () => {
    const wrapper = mountComponent()
    const emojiCardsBeforeClick = wrapper.findAllComponents(EmojiCard)
    await emojiCardsBeforeClick[1].trigger('click')
    const button = wrapper.find('[class="submit"')
    const spy = jest.spyOn(wrapper.vm, 'submitReview')
    await button.trigger('click')
    expect(spy).toHaveBeenCalled()
  })
})
