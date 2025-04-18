<template>
  <v-container class="d-flex justify-center align-center">
    <v-row>
      <v-toolbar class="no-print px-2">
        <v-btn to="/edit"> 編輯模式 </v-btn>
        <v-btn to="/print"> 列印模式 </v-btn>
        <v-btn to="/guide"> 使用教學 </v-btn>
        <v-btn to="/about"> 關於本站 </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          rounded="xl"
          prepend-icon="mdi-export-variant"
          size="large"
          @click="logShareUrl"
        >
          分享
        </v-btn>
      </v-toolbar>
      <router-view v-slot="{ Component }">
        <KeepAlive include="EditView,PrintView">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useModeStore } from '@/stores/modeStore'
import { useParticipantStore } from '@/stores/participantStore'
import { loadActivityState, loadModeState, loadParticipants } from '@/db/db'
import { useActivityStore } from '@/stores/activityStore'
import { useMessageStore } from '@/stores/messageStore'

const modeStore = useModeStore()
const participantStore = useParticipantStore()
const activityStore = useActivityStore()
const messageStore = useMessageStore()

function logShareUrl() {
  const encoded = participantStore.encodeToShareUrl()
  const shareUrl = `${location.origin}${location.pathname}#/edit?data=${encoded}`

  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      console.log('已複製分享網址：', shareUrl)
      messageStore.success('分享連結已複製到剪貼簿')
    })
    .catch((err) => {
      console.error('複製失敗', err)
      messageStore.error('無法複製分享連結，請手動複製')
    })
}

onMounted(async () => {
  const url = new URL(location.href)
  const encoded = url.hash.match(/data=([^&]+)/)?.[1]

  if (encoded) {
    // 如果網址上有 data 參數，就還原
    participantStore.decodeFromUrlData(encoded)
  } else {
    // 否則才從 IndexedDB 載入
    const savedParticipants = await loadParticipants()
    if (savedParticipants) {
      participantStore.participantList = savedParticipants
    }
  }

  // mode 與 activity 不受網址影響，仍然從 IndexedDB 載入
  const savedMode = await loadModeState()
  if (savedMode) {
    modeStore.loadFromDb(savedMode)
  }

  const savedActivity = await loadActivityState()
  if (savedActivity) {
    activityStore.loadFromDb(savedActivity)
  }
})
</script>

<style scoped>
:deep(.v-table .v-table__wrapper > table) {
  border: 2px solid #000 !important;
  border-collapse: collapse !important;
}

:deep(.v-table .v-table__wrapper > table > thead > tr > th),
:deep(.v-table .v-table__wrapper > table > tbody > tr > td) {
  color: #000 !important;
  border: 1px solid #000 !important;
  padding: 4px;
}

:deep(.v-table .v-table__wrapper > table > thead > tr > th:not(:last-child)),
:deep(.v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child)) {
  border-right: 1px solid #000 !important;
}

@media print {
  .no-print {
    display: none;
  }
}
</style>
