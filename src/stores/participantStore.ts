import type { Participant } from '@/type/type'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
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
    encodeToShareUrl(): string {
      const json = JSON.stringify(this.participantList)
      return compressToEncodedURIComponent(json)
    },
    decodeFromUrlData(encoded: string): void {
      try {
        const json = decompressFromEncodedURIComponent(encoded)
        if (!json) throw new Error('資料格式錯誤')
        this.participantList = JSON.parse(json)
      } catch (e) {
        console.error('無法解碼參加者資料', e)
        alert('分享連結內容無效，無法還原參加者資料')
      }
    },
  },
})
