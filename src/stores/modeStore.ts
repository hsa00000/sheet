import { defineStore } from 'pinia'
import { saveModeState } from '@/db/db'

export const useModeStore = defineStore('mode', {
  state: (): { enableFood: boolean; displayExtendedAsRegular: boolean } => ({
    enableFood: false,
    displayExtendedAsRegular: false,
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
    loadFromDb(payload: { enableFood: boolean; displayExtendedAsRegular: boolean }) {
      this.enableFood = payload.enableFood
      this.displayExtendedAsRegular = payload.displayExtendedAsRegular
    },
    _save() {
      saveModeState({
        enableFood: this.enableFood,
        displayExtendedAsRegular: this.displayExtendedAsRegular,
      })
    },
  },
})
