import * as T from 'io-ts'
import { DateTime } from 'luxon'
import firebase from '@/firebase/firebaseSingleton'

export const DeckInfoT = T.type({
  uid: T.string,
  name: T.string,
  description: T.string,
})
export type DeckInfoT = T.TypeOf<typeof DeckInfoT>

export const DeckInfoArrayT = T.array(DeckInfoT)
export type DeckInfoArrayT = T.TypeOf<typeof DeckInfoArrayT>

export const CardT = T.type({
  uid: T.string,
  headline: T.string,
  description: T.string,
})
export type CardT = T.TypeOf<typeof CardT>

export const CardArrayT = T.array(CardT)
export type CardArrayT = T.TypeOf<typeof CardArrayT>

export const LuxonDateTimeT = new T.Type<DateTime, firebase.firestore.Timestamp, unknown>(
  'LuxonDateTimeT',
  (u: unknown): u is DateTime => u instanceof DateTime,
  (u: unknown, c: T.Context) => {
    if (!(u instanceof firebase.firestore.Timestamp)) {
      return T.failure(u, c)
    }
    return T.success(DateTime.fromJSDate(u.toDate()).setZone('Europe/London'))
  },
  (a: DateTime) => firebase.firestore.Timestamp.fromDate(a.toJSDate()),
)

export const DeckRefT = T.type({
  uid: T.string,
  type: T.union([T.literal('publisher'), T.literal('user')])
})
export type DeckRefT = T.TypeOf<typeof DeckInfoT>

export const SwipedCardT = T.type({
  card: CardT,
  swiped: T.union([T.literal('left'), T.literal('right')])
})
export type SwipedCardT = T.TypeOf<typeof SwipedCardT>

export const SwipedCardArrayT = T.array(SwipedCardT)
export type SwipedCardArrayT = T.TypeOf<typeof SwipedCardArrayT>

export const SessionBaseT = T.type({
  uid: T.string,
  user: T.string,
  deck: DeckRefT,
  cardsSwiped: SwipedCardArrayT,
})

export const SessionT = T.intersection([SessionBaseT, T.type({ datetime: LuxonDateTimeT })])
export type SessionT = T.TypeOf<typeof SessionT>

export const SessionWithChosenCardT = T.intersection([SessionT, T.type({
  chosenCard: T.string
})])
export type SessionWithChosenCardT = T.TypeOf<typeof SessionWithChosenCardT>

export const SessionWithChosenCardArrayT = T.array(SessionWithChosenCardT)
export type SessionWithChosenCardArrayT = T.TypeOf<typeof SessionWithChosenCardArrayT>

export const ReviewBaseT = T.type({
  reviewValue: T.union([T.literal(1), T.literal(2), T.literal(3), T.literal(4)])
})
export type ReviewBaseT = T.TypeOf<typeof ReviewBaseT>

export const ReviewT = T.intersection([ReviewBaseT, T.type({ datetime: LuxonDateTimeT })])
export type ReviewT = T.TypeOf<typeof ReviewT>

export const SessionWithReviewT = T.intersection([SessionWithChosenCardT, T.type({review: ReviewT})])
export type SessionWithReviewT = T.TypeOf<typeof SessionWithReviewT>
