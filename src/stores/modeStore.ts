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
      saveModeState({
        enableFood: this.enableFood,
        displayExtendedAsRegular: this.displayExtendedAsRegular,
      })
    },
    setDisplayExtendedAsRegular(value: boolean) {
      this.displayExtendedAsRegular = value
      saveModeState({
        enableFood: this.enableFood,
        displayExtendedAsRegular: this.displayExtendedAsRegular,
      })
    },
    loadFromDb(payload: { enableFood: boolean; displayExtendedAsRegular: boolean }) {
      this.enableFood = payload.enableFood
      this.displayExtendedAsRegular = payload.displayExtendedAsRegular
    },
  },
})
