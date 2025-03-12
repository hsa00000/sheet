import { defineStore } from 'pinia'

export const useModeStore = defineStore('mode', {
  state: (): { mode: 'edit' | 'print'; food: boolean } => ({
    mode: 'edit',
    food: false,
  }),
  actions: {},
})
