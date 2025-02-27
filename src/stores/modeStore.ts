import { defineStore } from 'pinia'

export const useModeStore = defineStore('mode', {
  state: (): { mode: 'edit' | 'print' } => ({
    mode: 'edit',
  }),
  actions: {},
})
