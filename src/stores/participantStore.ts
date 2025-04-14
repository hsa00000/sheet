import type { Participant } from '@/type/type'
import { defineStore } from 'pinia'

export const useParticipantStore = defineStore('participant', {
  state: (): { participantList: Participant[] } => ({
    participantList: [],
  }),
  actions: {
    deleteByCombinedIndex(index: number): void {
      if (index >= 0 && index < this.participantList.length) {
        this.participantList.splice(index, 1)
      }
    },
    moveUpInParticipantList(index: number): void {
      if (index > 0 && index < this.participantList.length) {
        const temp = this.participantList[index]
        this.participantList[index] = this.participantList[index - 1]
        this.participantList[index - 1] = temp
      }
    },
    moveDownInParticipantList(index: number): void {
      if (index >= 0 && index < this.participantList.length - 1) {
        const temp = this.participantList[index]
        this.participantList[index] = this.participantList[index + 1]
        this.participantList[index + 1] = temp
      }
    },
  },
})
