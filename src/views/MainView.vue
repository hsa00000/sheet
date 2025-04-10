<template>
  <v-container class="d-flex justify-center align-center">
    <v-row>
      <v-toolbar class="invisible-when-print px-2">
        <v-btn
          to="/edit"
          @click="modeStore.mode = 'edit'"
          :variant="modeStore.mode == 'edit' ? 'tonal' : undefined"
        >
          編輯模式
        </v-btn>
        <v-btn
          to="/print"
          @click="modeStore.mode = 'print'"
          :variant="modeStore.mode == 'print' ? 'tonal' : undefined"
        >
          列印模式
        </v-btn>
      </v-toolbar>
      <RouterView />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { watchEffect, onMounted } from 'vue'
import Papa from 'papaparse'
import { useModeStore } from '@/stores/modeStore'
import { useParticipantStore } from '@/stores/participantStore'
import { loadFile } from '@/db/db'

const modeStore = useModeStore()
const participantStore = useParticipantStore()

watchEffect(() => {
  console.log('modeStore.food is', modeStore.enableFood)
})

onMounted(async () => {
  const saved = await loadFile('lastCsvFile')
  if (saved) {
    console.log('[Loaded CSV from IndexedDB]', saved)

    const result = Papa.parse(saved, {
      header: true,
      skipEmptyLines: true,
    })

    participantStore.participantList = result.data.map((row) => {
      const cleanedRow = Object.fromEntries(
        Object.entries(row as Record<string, unknown>).map(([key, value]) => [key.trim(), value]),
      )
      return {
        id: String(cleanedRow['職工/學號'] ?? ''),
        department: String(cleanedRow['單位'] ?? ''),
        name: String(cleanedRow['參加者'] ?? ''),
        food: String(cleanedRow['提供用餐'] ?? ''),
      }
    })

    console.log('[Participants loaded from saved CSV]', participantStore.participantList)
  } else {
    console.log('[No saved CSV file found]')
  }
})
</script>

<style scoped>
.print-page {
  width: 210mm;
  height: 297mm;
  padding-left: 4mm;
  padding-right: 4mm;
  box-sizing: border-box;
  page-break-after: always;
}

:deep() .v-table .v-table__wrapper > table {
  border: 2px solid #000 !important;
  border-collapse: collapse !important;
}

:deep() .v-table .v-table__wrapper > table > thead > tr > th,
:deep() .v-table .v-table__wrapper > table > tbody > tr > td {
  color: #000 !important;
  border: 1px solid #000 !important;
  padding: 4px;
}

:deep() .v-table .v-table__wrapper > table > thead > tr > th:not(:last-child),
:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child) {
  border-right: 1px solid #000 !important;
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .invisible-when-print {
    display: none;
  }
}
</style>
