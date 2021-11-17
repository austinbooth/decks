import * as T from 'io-ts'
import { DateTime } from 'luxon'
import * as IOTS from './iotsTypes'

export const JSDateTimeT = new T.Type<Date, DateTime, unknown>(
  'JSDateTimeT',
  (u: unknown): u is Date => u instanceof Date,
  (u: unknown, c: T.Context) => u instanceof DateTime ? T.success(u.toJSDate()) : T.failure(u, c),
  (a: Date) => DateTime.fromJSDate(a)
)

export const IDBSessionT = T.intersection([IOTS.SessionBaseT, T.type({ datetime: JSDateTimeT})])
export type IDBSessionT = T.TypeOf<typeof IDBSessionT>

export const IDBSessionWithChosenCardT = T.intersection([IDBSessionT, T.type({
  chosenCard: T.string
})])
export type IDBSessionWithChosenCardT = T.TypeOf<typeof IDBSessionWithChosenCardT>

export const IDBReviewT = T.intersection([IOTS.ReviewBaseT, T.type({ datetime: JSDateTimeT })])
export type IDBReviewT = T.TypeOf<typeof IDBReviewT>

export const IDBSessionWithReviewT = T.intersection([IDBSessionWithChosenCardT, T.type({review: IDBReviewT})])
export type IDBSessionWithReviewT = T.TypeOf<typeof IDBSessionWithReviewT>
