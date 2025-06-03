// db.ts
import type { Participant } from '@/type/type'

const DB_NAME = 'MyAppDB'
const STORE_NAME = 'participants'
const FIXED_KEY = 'latest'
const MODE_KEY = 'mode'
const ACTIVITY_KEY = 'activity'
const EMPTY_PAGE_NUMBER_KEY = 'emptyPageNumber'

interface ModeState {
  enableFood: boolean
  displayExtendedAsRegular: boolean
  displayCompanion: boolean
}

interface ActivityState {
  title: string
  name: string
  period: string
  location: string
  showTitle: boolean
  showName: boolean
  showPeriod: boolean
  showLocation: boolean
}

interface EmptyPageNumberState {
  emptyPageNumber: number
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
    request.onsuccess = () => {
      const result = request.result
      if (!result) return resolve(null)

      const mode: ModeState = {
        enableFood: result.enableFood ?? false,
        displayExtendedAsRegular: result.displayExtendedAsRegular ?? false,
        displayCompanion: result.displayCompanion ?? false,
      }

      resolve(mode)
    }
    request.onerror = () => resolve(null)
  })
}

// 儲存 activity 狀態
export const saveActivityState = async (activity: ActivityState): Promise<void> => {
  const db = await openDb()
  const cloneSafeData = JSON.parse(JSON.stringify(activity))
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put(cloneSafeData, ACTIVITY_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

// 載入 activity 狀態
export const loadActivityState = async (): Promise<ActivityState | null> => {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const request = tx.objectStore(STORE_NAME).get(ACTIVITY_KEY)

  return new Promise((resolve) => {
    request.onsuccess = () => {
      const result = request.result
      if (!result) return resolve(null)

      const activity: ActivityState = {
        title: result.title ?? '',
        name: result.name ?? '',
        period: result.period ?? '',
        location: result.location ?? '',
        showTitle: result.showTitle ?? true,
        showName: result.showName ?? true,
        showPeriod: result.showPeriod ?? true,
        showLocation: result.showLocation ?? true,
      }

      resolve(activity)
    }
    request.onerror = () => resolve(null)
  })
}

// 儲存 emptyPageNumber 狀態
export const saveEmptyPageNumberState = async (state: EmptyPageNumberState): Promise<void> => {
  const db = await openDb()
  const cloneSafeData = JSON.parse(JSON.stringify(state))
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put(cloneSafeData, EMPTY_PAGE_NUMBER_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

// 載入 emptyPageNumber 狀態
export const loadEmptyPageNumberState = async (): Promise<EmptyPageNumberState | null> => {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const request = tx.objectStore(STORE_NAME).get(EMPTY_PAGE_NUMBER_KEY)

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => resolve(null)
  })
}
