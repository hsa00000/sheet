import type { Participant } from '@/type/type'
import { defineStore } from 'pinia'

export const useParticipantStore = defineStore('participant', {
  state: (): { participantList: Participant[]; outsider: Participant[] } => ({
    participantList: [],
    outsider: [],
  }),
  getters: {
    combinedList(state): Participant[] {
      return [...state.outsider, ...state.participantList]
    },
  },
  actions: {
    deleteByCombinedIndex(index: number): void {
      if (index < this.outsider.length) {
        this.outsider.splice(index, 1)
      } else {
        const participantIndex = index - this.outsider.length
        if (participantIndex >= 0 && participantIndex < this.participantList.length) {
          this.participantList.splice(participantIndex, 1)
        }
      }
    },
  },
})
