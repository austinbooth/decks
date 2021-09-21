import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBSg9FGh8KbSjvzq5fEi99kV_fA6AXdj_w",
  authDomain: "decks-poc.firebaseapp.com",
  projectId: "decks-poc",
  storageBucket: "decks-poc.appspot.com",
  messagingSenderId: "567903013973",
  appId: "1:567903013973:web:304de42c6ff160d23ad8dc",
  measurementId: "G-3L3WYGHCLN"
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
  // firebase.auth() // We must also initialize the auth component.
  firebase.firestore()
  console.log(`Initialized firebase project with ID: ${firebaseConfig.projectId}`)
}

export default firebase
