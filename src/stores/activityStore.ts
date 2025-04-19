import { defineStore } from 'pinia'
import { saveActivityState } from '@/db/db'

export const useActivityStore = defineStore('activity', {
  state: (): {
    title: string
    name: string
    period: string
    location: string
    showTitle: boolean
    showName: boolean
    showPeriod: boolean
    showLocation: boolean
  } => ({
    title: '簽到表',
    name: '',
    period: '',
    location: '',
    showTitle: true,
    showName: true,
    showPeriod: true,
    showLocation: true,
  }),

  actions: {
    setTitle(value: string) {
      this.title = value
      this._save()
    },
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
    setShowTitle(value: boolean) {
      this.showTitle = value
      this._save()
    },
    setShowName(value: boolean) {
      this.showName = value
      this._save()
    },
    setShowPeriod(value: boolean) {
      this.showPeriod = value
      this._save()
    },
    setShowLocation(value: boolean) {
      this.showLocation = value
      this._save()
    },

    loadFromDb(payload: {
      title: string
      name: string
      period: string
      location: string
      showTitle: boolean
      showName: boolean
      showPeriod: boolean
      showLocation: boolean
    }) {
      this.title = payload.title
      this.name = payload.name
      this.period = payload.period
      this.location = payload.location
      this.showTitle = payload.showTitle
      this.showName = payload.showName
      this.showPeriod = payload.showPeriod
      this.showLocation = payload.showLocation
    },

    _save() {
      saveActivityState({
        title: this.title,
        name: this.name,
        period: this.period,
        location: this.location,
        showTitle: this.showTitle,
        showName: this.showName,
        showPeriod: this.showPeriod,
        showLocation: this.showLocation,
      })
    },
  },
})
