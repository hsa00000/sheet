import { defineStore } from 'pinia'

export const useActivityStore = defineStore('activity', {
  state: (): { name: string; period: string; location: string } => ({
    name: '',
    period: '',
    location: '',
  }),
  actions: {},
})
