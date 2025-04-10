/**
 * 開啟（或初始化）IndexedDB 資料庫
 * 如果第一次開啟會建立版本 1 的資料庫與 'files' 資料表
 */
export const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyAppDB', 1)

    request.onerror = () => reject(request.error) // 開啟資料庫失敗
    request.onsuccess = () => resolve(request.result) // 成功取得資料庫實例

    // 第一次開啟或版本升級時觸發，用來初始化 schema
    request.onupgradeneeded = () => {
      const db = request.result
      // 如果沒有名為 'files' 的 object store，就建立一個，並以 'name' 作為主鍵
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'name' })
      }
    }
  })
}

/**
 * 儲存檔案內容到 IndexedDB
 * @param name 檔案名稱（作為主鍵）
 * @param content 檔案的文字內容
 */
export const saveFile = async (name: string, content: string): Promise<void> => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    // 建立一個 readwrite 交易，操作 'files' 資料表
    const tx = db.transaction('files', 'readwrite')
    const store = tx.objectStore('files')
    store.put({ name, content }) // 寫入資料，會覆蓋相同 key 的資料

    // 當交易成功完成時 resolve
    tx.oncomplete = () => resolve()
    // 發生錯誤或被中止時 reject
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

/**
 * 讀取檔案內容（文字）從 IndexedDB
 * @param name 檔案名稱（主鍵）
 * @returns 檔案內容文字，若不存在則回傳 null
 */
export const loadFile = async (name: string): Promise<string | null> => {
  const db = await openDb()
  const tx = db.transaction('files', 'readonly')
  const request = tx.objectStore('files').get(name)

  return new Promise((resolve) => {
    request.onsuccess = () => {
      // 如果找不到資料則回傳 null
      resolve(request.result?.content ?? null)
    }
    request.onerror = () => {
      // 發生錯誤時回傳 null（避免程式中斷）
      resolve(null)
    }
  })
}
