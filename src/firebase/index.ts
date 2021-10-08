import firebase from '@/firebase/firebaseSingleton'
import { writeToidb, DEFAULT_STORE_NAME } from '@/indexeddb'

export const getAllCardsInDeck = async(deck = 'breakfast-deck') => {
  try {
    const db = firebase.firestore()
    const snapshot = await db.collection(`/${deck}/`).get()
    const cards = snapshot.docs.map((doc) => doc.data())
    return cards
  } catch (err) {
    console.error(err)
  }
}

export const createAnonymousUser = async() => {
  try {
    const db = firebase.firestore()
    const firebaseNowTimestamp = firebase.firestore.Timestamp.now()
    const createdDoc = await db.collection(`/users/`).doc()
    if (createdDoc.id) {
      const initialUserData = {
        created: firebaseNowTimestamp,
        uid_anonymous: createdDoc.id,
      }
      await Promise.all([
        createdDoc.set(initialUserData),
        writeToidb(DEFAULT_STORE_NAME, createdDoc.id, 'uid_anonymous')
      ])
    }
    return createdDoc.id
  } catch (err) {
    console.error(err)
  }
}

interface User {
  uid_anonymous: string
}

export const setUserInFireStore = async <T extends User>(userId: string, user: T, merge: boolean) => {
  try {
    const db = firebase.firestore()
    await db.collection(`/users/`).doc(userId).set(user, {merge})
  } catch (err) {
    console.error(err)
  }
}
