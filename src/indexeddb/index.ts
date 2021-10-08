import { openDB } from "idb"

export const DBNAME = 'decks'
export const DEFAULT_STORE_NAME = 'user'

export const writeToidb = async(storeName: string, key: string, val: string) => {
  const db = await openDB(DBNAME)
  const tx = db.transaction(storeName, 'readwrite')
  const userStore = tx.objectStore(storeName)
  await userStore.put(key, val)
  await tx.done
}
