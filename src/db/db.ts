// db.ts
import type { Participant } from '@/type/type'

const DB_NAME = 'MyAppDB'
const STORE_NAME = 'participants'
const FIXED_KEY = 'latest'
const MODE_KEY = 'mode'

interface ModeState {
  enableFood: boolean
  displayExtendedAsRegular: boolean
}

export const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = () => {
      const db = request.result

      // 移除舊的資料表 'files'（如果存在）
      if (db.objectStoreNames.contains('files')) {
        db.deleteObjectStore('files')
      }

      // 建立 'participants' store（若不存在）
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

// 儲存參與者資料
export const saveParticipants = async (data: Participant[]): Promise<void> => {
  const db = await openDb()
  const cloneSafeData = JSON.parse(JSON.stringify(data))
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put(cloneSafeData, FIXED_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

// 載入參與者資料
export const loadParticipants = async (): Promise<Participant[] | null> => {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const request = tx.objectStore(STORE_NAME).get(FIXED_KEY)

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => resolve(null)
  })
}

// 儲存 mode 狀態
export const saveModeState = async (mode: ModeState): Promise<void> => {
  const db = await openDb()
  const cloneSafeData = JSON.parse(JSON.stringify(mode))
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put(cloneSafeData, MODE_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

// 載入 mode 狀態
export const loadModeState = async (): Promise<ModeState | null> => {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const request = tx.objectStore(STORE_NAME).get(MODE_KEY)

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => resolve(null)
  })
}
