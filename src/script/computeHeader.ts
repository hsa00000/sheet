import { BASE_HEADERS } from '@/const/const'
import { useModeStore } from '@/stores/modeStore'
import { computed } from 'vue'

export const headers = computed(() => {
  const modeStore = useModeStore()

  return BASE_HEADERS.filter((header) => {
    if (!modeStore.displayIdentity && header.value === 'identity') return false
    if (!modeStore.displayDepartment && header.value === 'department') return false
    if (!modeStore.displayCompanion && header.value === 'companion') return false
    if (!modeStore.enableFood && header.value === 'food') return false
    return true
  })
})
