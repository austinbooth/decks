import firebase from '@/firebase/firebaseSingleton'
import { DateTime } from 'luxon'
import { Session, SessionWithChosenCard, SessionWithReview, isSessionWithReview } from '@/types'
import {
  isFireStoreSessionWithReview, isFireStoreSessionWithChosenCard,
  FireStoreSession, FireStoreSessionWithChosenCard, FireStoreSessionWithReview,
} from '@/types/fireStoreTypes'

const toFirestoreSession = (session: Session): firebase.firestore.DocumentData => {
  const firebaseSession = {
      ...session,
      datetime: firebase.firestore.Timestamp.fromDate(session.datetime.toJSDate()),
  }
  if (isSessionWithReview(session)) {
    // need to create types for firebase sessions
    const firebaseSessionWithReview = {
      ...firebaseSession,
      review: {
        datetime: firebase.firestore.Timestamp.fromDate(session.review.datetime.toJSDate()),
        reviewValue: session.review.reviewValue
      }
    }
    return firebaseSessionWithReview
  }
  return firebaseSession
}

const fromFirestoreSession = (
  firebaseSession: FireStoreSession | FireStoreSessionWithChosenCard | FireStoreSessionWithReview
): Session | SessionWithChosenCard | SessionWithReview => {
  const session: Session = {
    ...firebaseSession,
    datetime: DateTime.fromJSDate(firebaseSession.datetime.toDate())
  }

  if (isFireStoreSessionWithChosenCard(firebaseSession)) {
    const sessionWithChosenCard: SessionWithChosenCard = {
      ...session,
      chosenCard: firebaseSession.chosenCard,
    }
    return sessionWithChosenCard
  }
  
  if (isFireStoreSessionWithReview(firebaseSession)) {
    const sessionWithReview: SessionWithReview = {
      ...session,
      chosenCard: firebaseSession.chosenCard,
      review: {
        ...firebaseSession.review,
        datetime: DateTime.fromJSDate(firebaseSession.review.datetime.toDate())
      }
    }
    return sessionWithReview
  }
  return session
}

export const sessionConverter = {
    toFirestore(session: Session | SessionWithChosenCard | SessionWithReview): firebase.firestore.DocumentData {
      return toFirestoreSession(session)
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions)
    : Session | SessionWithChosenCard | SessionWithReview {
      const data = snapshot.data(options) as FireStoreSession | FireStoreSessionWithChosenCard | FireStoreSessionWithReview
      if (data) {
        return fromFirestoreSession(data)
      }
      throw new Error('Could not convert data from firebase')
    },
  }
