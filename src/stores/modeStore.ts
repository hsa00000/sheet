import { defineStore } from 'pinia'

export const useModeStore = defineStore('mode', {
  state: (): { enableFood: boolean; displayExtendedAsRegular: boolean } => ({
    enableFood: false,
    displayExtendedAsRegular: false,
  }),
  actions: {},
})
