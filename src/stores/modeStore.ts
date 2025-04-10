import { defineStore } from 'pinia'

export const useModeStore = defineStore('mode', {
  state: (): { enableFood: boolean } => ({
    enableFood: false,
  }),
  actions: {},
})
