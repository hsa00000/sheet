// db.ts
import type { Participant } from '@/type/type'

const DB_NAME = 'MyAppDB'
const STORE_NAME = 'participants'
const FIXED_KEY = 'latest'

export const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2) // 第三版 schema

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = () => {
      const db = request.result

      // 刪除舊的資料表 'files'（如果存在）
      if (db.objectStoreNames.contains('files')) {
        db.deleteObjectStore('files')
      }

      // 建立新的資料表 'participants'（如果尚未建立）
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

export const saveParticipants = async (data: Participant[]): Promise<void> => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put(data, FIXED_KEY)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export const loadParticipants = async (): Promise<Participant[] | null> => {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const request = tx.objectStore(STORE_NAME).get(FIXED_KEY)

  return new Promise((resolve) => {
    request.onsuccess = () => {
      resolve(request.result ?? null)
    }
    request.onerror = () => resolve(null)
  })
}
