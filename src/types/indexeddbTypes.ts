import { Session, SessionWithChosenCard, Review } from "./";

export interface IDBSession extends Omit<Session, 'datetime'> {
  datetime: Date
}

export interface IDBSessionWithChosenCard extends Omit<SessionWithChosenCard, 'datetime'> {
  datetime: Date
}

interface IDBReview extends Omit<Review, 'datetime'> {
  datetime: Date
}

export interface IDBSessionWithReview extends IDBSessionWithChosenCard {
  review: IDBReview
}
