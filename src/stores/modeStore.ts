import { defineStore } from 'pinia'
import { saveModeState } from '@/db/db'

export const useModeStore = defineStore('mode', {
  state: (): {
    enableFood: boolean
    displayExtendedAsRegular: boolean
    displayCompanion: boolean
  } => ({
    enableFood: false,
    displayExtendedAsRegular: false,
    displayCompanion: false,
  }),
  actions: {
    setEnableFood(value: boolean) {
      this.enableFood = value
      this._save()
    },
    setDisplayExtendedAsRegular(value: boolean) {
      this.displayExtendedAsRegular = value
      this._save()
    },
    setDisplayCompanion(value: boolean) {
      this.displayCompanion = value
      this._save()
    },
    loadFromDb(payload: {
      enableFood: boolean
      displayExtendedAsRegular: boolean
      displayCompanion: boolean
    }) {
      this.enableFood = payload.enableFood
      this.displayExtendedAsRegular = payload.displayExtendedAsRegular
      this.displayCompanion = payload.displayCompanion
    },
    _save() {
      saveModeState({
        enableFood: this.enableFood,
        displayExtendedAsRegular: this.displayExtendedAsRegular,
        displayCompanion: this.displayCompanion,
      })
    },
  },
})
