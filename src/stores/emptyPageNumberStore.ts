import { defineStore } from 'pinia'

export const useEmptyPageNumberStore = defineStore('emptyPageNumber', {
  state: (): { emptyPageNumber: number } => ({
    emptyPageNumber: 1,
  }),
  actions: {},
})
