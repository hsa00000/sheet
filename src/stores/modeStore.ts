import { defineStore } from 'pinia'
import { saveModeState } from '@/db/db'

export const useModeStore = defineStore('mode', {
  state: (): {
    enableFood: boolean
    displayExtendedAsRegular: boolean
    displayCompanion: boolean
    displayIdentity: boolean
    displayDepartment: boolean
  } => ({
    enableFood: false,
    displayExtendedAsRegular: false,
    displayCompanion: false,
    displayIdentity: true,
    displayDepartment: true,
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
    setDisplayIdentity(value: boolean) {
      this.displayIdentity = value
      this._save()
    },
    setDisplayDepartment(value: boolean) {
      this.displayDepartment = value
      this._save()
    },
    loadFromDb(payload: {
      enableFood: boolean
      displayExtendedAsRegular: boolean
      displayCompanion: boolean
      displayIdentity?: boolean
      displayDepartment?: boolean
    }) {
      this.enableFood = payload.enableFood
      this.displayExtendedAsRegular = payload.displayExtendedAsRegular
      this.displayCompanion = payload.displayCompanion
      this.displayIdentity = payload.displayIdentity ?? true
      this.displayDepartment = payload.displayDepartment ?? true
    },
    _save() {
      saveModeState({
        enableFood: this.enableFood,
        displayExtendedAsRegular: this.displayExtendedAsRegular,
        displayCompanion: this.displayCompanion,
        displayIdentity: this.displayIdentity,
        displayDepartment: this.displayDepartment,
      })
    },
  },
})
