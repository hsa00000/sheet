<template>
  <v-container class="d-flex justify-center align-center">
    <v-row>
      <v-toolbar class="no-print px-2">
        <v-btn to="/edit"> 編輯模式 </v-btn>
        <v-btn to="/print"> 列印模式 </v-btn>
        <v-btn to="/guide"> 使用教學 </v-btn>
        <v-btn to="/about"> 關於本站 </v-btn>
      </v-toolbar>
      <RouterView />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { watchEffect, onMounted } from 'vue'
import { useModeStore } from '@/stores/modeStore'
import { useParticipantStore } from '@/stores/participantStore'
import { loadParticipants } from '@/db/db'

const modeStore = useModeStore()
const participantStore = useParticipantStore()

watchEffect(() => {
  console.log('modeStore.food is', modeStore.enableFood)
})

onMounted(async () => {
  const saved = await loadParticipants()
  if (saved) {
    participantStore.participantList = saved
  }
})
</script>

<style scoped>
:deep(.v-data-table.row-height-26 tr),
:deep(.v-data-table.row-height-26 td) {
  height: 70px !important;
}

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
