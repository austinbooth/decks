import firebase from '@/firebase/firebaseSingleton'

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
