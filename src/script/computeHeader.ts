import { BASE_HEADERS } from '@/const/const'
import { useModeStore } from '@/stores/modeStore'
import { computed } from 'vue'

export const headers = computed(() => {
  const modeStore = useModeStore()
  return modeStore.enableFood
    ? BASE_HEADERS
    : BASE_HEADERS.filter((header) => header.value !== 'food')
})
