<template>
  <v-container class="d-flex justify-center align-center">
    <v-row>
      <v-toolbar class="no-print px-2 w-100">
        <v-slide-group show-arrows class="flex-grow-1">
          <v-slide-group-item>
            <v-btn to="/edit" class="ma-1">編輯模式</v-btn>
          </v-slide-group-item>
          <v-slide-group-item>
            <v-btn to="/print" class="ma-1">列印模式</v-btn>
          </v-slide-group-item>
          <v-slide-group-item>
            <v-btn to="/guide" class="ma-1">使用教學</v-btn>
          </v-slide-group-item>
          <v-slide-group-item>
            <v-btn to="/about" class="ma-1">關於本站</v-btn>
          </v-slide-group-item>
          <!-- 更多按鈕 -->
        </v-slide-group>

        <v-btn
          variant="tonal"
          rounded="xl"
          prepend-icon="mdi-content-copy"
          class="ms-2"
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
import {
  loadActivityState,
  loadEmptyPageNumberState,
  loadModeState,
  loadParticipants,
} from '@/db/db'
import { useActivityStore } from '@/stores/activityStore'
import { useMessageStore } from '@/stores/messageStore'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { useEmptyPageNumberStore } from '@/stores/emptyPageNumberStore'

const modeStore = useModeStore()
const participantStore = useParticipantStore()
const activityStore = useActivityStore()
const messageStore = useMessageStore()
const emptyPageNumberStore = useEmptyPageNumberStore()

function logShareUrl() {
  const payload = {
    participantList: participantStore.participantList,
    modeState: {
      enableFood: modeStore.enableFood,
      displayExtendedAsRegular: modeStore.displayExtendedAsRegular,
    },
    activityState: {
      title: activityStore.title,
      name: activityStore.name,
      period: activityStore.period,
      location: activityStore.location,
      showTitle: activityStore.showTitle,
      showName: activityStore.showName,
      showPeriod: activityStore.showPeriod,
      showLocation: activityStore.showLocation,
    },
    emptyPageNumber: emptyPageNumberStore.emptyPageNumber,
  }

  const encoded = compressToEncodedURIComponent(JSON.stringify(payload))
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
  const encoded = location.hash.match(/data=([^&]+)/)?.[1]

  if (encoded) {
    try {
      const json = decompressFromEncodedURIComponent(encoded)
      if (!json) throw new Error('空資料')

      const parsed = JSON.parse(json)

      if (parsed.participantList) {
        participantStore.participantList = parsed.participantList
      }

      if (parsed.modeState) {
        modeStore.loadFromDb(parsed.modeState)
      }

      if (parsed.activityState) {
        activityStore.loadFromDb(parsed.activityState)
      }

      if (parsed.emptyPageNumber !== undefined) {
        emptyPageNumberStore.loadFromDb({ emptyPageNumber: parsed.emptyPageNumber })
      }
    } catch (error) {
      console.error('解碼失敗', error)
      messageStore.error('分享連結格式錯誤，無法還原資料')
    }
  } else {
    const savedParticipants = await loadParticipants()
    if (savedParticipants) {
      participantStore.participantList = savedParticipants
    }

    const savedModeState = await loadModeState()
    if (savedModeState) {
      modeStore.loadFromDb(savedModeState)
    }

    const savedActivityState = await loadActivityState()
    if (savedActivityState) {
      activityStore.loadFromDb(savedActivityState)
    }

    const savedEmptyPageNumberState = await loadEmptyPageNumberState()
    if (savedEmptyPageNumberState) {
      emptyPageNumberStore.loadFromDb(savedEmptyPageNumberState)
    }
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
