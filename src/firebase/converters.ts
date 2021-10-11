import firebase from '@/firebase/firebaseSingleton'
import { DateTime } from 'luxon'
import { Session } from '@/types'

const toFirestoreSession = (session: Session): firebase.firestore.DocumentData => {
  const firebaseSession = {
      ...session,
      datetime: firebase.firestore.Timestamp.fromDate(session.datetime.toJSDate())
  }
  return firebaseSession
}

const fromFirestoreSession = (firebaseSession: firebase.firestore.DocumentData): Session => {
  const session = {
    ...firebaseSession,
    datetime: DateTime.fromJSDate(firebaseSession.datetime.toDate())
  }
  return session as Session // TODO remove cast
}

export const sessionConverter = {
    toFirestore(session: Session): firebase.firestore.DocumentData {
      return toFirestoreSession(session)
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions)
    : Session {
      const data = snapshot.data(options)
      if (data) {
        return fromFirestoreSession(data)
      }
      throw new Error('Could not convert data from firebase')
    },
  }