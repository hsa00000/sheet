import type { Message, MessageColor } from '@/type/type'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: (): { queue: Message[] } => ({
    queue: [],
  }),
  actions: {
    push(text: string, color: MessageColor = 'success') {
      this.queue.push({ text, color })
    },
    error(text: string) {
      this.push(text, 'error')
    },
    success(text: string) {
      this.push(text, 'success')
    },
  },
})
