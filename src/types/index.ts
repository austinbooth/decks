import firebase from "@/firebase/firebaseSingleton"

export interface User {
  uid: string
  created: firebase.firestore.Timestamp
}
