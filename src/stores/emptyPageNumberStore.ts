import { defineStore } from 'pinia'
import { saveEmptyPageNumberState } from '@/db/db'

export const useEmptyPageNumberStore = defineStore('emptyPageNumber', {
  state: (): { emptyPageNumber: number } => ({
    emptyPageNumber: 1,
  }),
  actions: {
    setEmptyPageNumber(value: number) {
      this.emptyPageNumber = value
      this._save()
    },
    loadFromDb(payload: { emptyPageNumber: number }) {
      this.emptyPageNumber = payload.emptyPageNumber
    },
    _save() {
      saveEmptyPageNumberState({
        emptyPageNumber: this.emptyPageNumber,
      })
    },
  },
})
