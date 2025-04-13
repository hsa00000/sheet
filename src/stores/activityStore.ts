// src/stores/activityStore.ts
import { defineStore } from 'pinia'
import { saveActivityState } from '@/db/db'

export const useActivityStore = defineStore('activity', {
  state: (): { name: string; period: string; location: string } => ({
    name: '',
    period: '',
    location: '',
  }),
  actions: {
    setName(value: string) {
      this.name = value
      this._save()
    },
    setPeriod(value: string) {
      this.period = value
      this._save()
    },
    setLocation(value: string) {
      this.location = value
      this._save()
    },
    loadFromDb(payload: { name: string; period: string; location: string }) {
      this.name = payload.name
      this.period = payload.period
      this.location = payload.location
    },
    _save() {
      saveActivityState({
        name: this.name,
        period: this.period,
        location: this.location,
      })
    },
  },
})
