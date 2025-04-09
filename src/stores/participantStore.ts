import type { Participant } from '@/type/type'
import { defineStore } from 'pinia'

export const useParticipantStore = defineStore('participant', {
  state: (): { participantList: Participant[] } => ({
    participantList: [],
  }),
  actions: {},
})
