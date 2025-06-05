import type { Participant } from '@/type/type'
import { defineStore } from 'pinia'

interface SortItem {
  key: keyof Participant
  order?: boolean | 'asc' | 'desc'
}

export const useParticipantStore = defineStore('participant', {
  state: (): {
    participantList: Participant[]
    sortBy: SortItem[]
  } => ({
    participantList: [],
    sortBy: [],
  }),
  getters: {
    sortedParticipantList(state): Participant[] {
      const sorted = [...state.participantList]
      const sortItem = state.sortBy[0]
      if (sortItem) {
        const { key, order } = sortItem
        sorted.sort((a, b) => {
          const aValue = a[key] ?? ''
          const bValue = b[key] ?? ''
          if (aValue < bValue) return order === 'desc' ? 1 : -1
          if (aValue > bValue) return order === 'desc' ? -1 : 1
          return 0
        })
      }
      return sorted
    },
  },
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
    setSort(field: keyof Participant, descending: boolean): void {
      this.sortBy = [{ key: field, order: descending ? 'desc' : 'asc' }]
    },
  },
})
