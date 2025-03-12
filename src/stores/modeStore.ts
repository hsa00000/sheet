import { defineStore } from 'pinia'

export const useModeStore = defineStore('mode', {
  state: (): { mode: 'edit' | 'print'; enableFood: boolean } => ({
    mode: 'edit',
    enableFood: false,
  }),
  actions: {},
})
