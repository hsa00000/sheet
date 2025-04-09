<template>
  <v-container class="d-flex justify-center align-center">
    <v-row>
      <v-toolbar class="invisible-when-print px-2">
        <v-btn
          @click="modeStore.mode = 'edit'"
          :variant="modeStore.mode == 'edit' ? 'tonal' : undefined"
        >
          編輯模式
        </v-btn>
        <v-btn
          @click="modeStore.mode = 'print'"
          :variant="modeStore.mode == 'print' ? 'tonal' : undefined"
        >
          列印模式
        </v-btn>
      </v-toolbar>

      <v-col cols="3" v-show="modeStore.mode === 'edit'">
        <v-list-item>
          <template #prepend>
            <v-list-item-action start>
              <v-checkbox-btn v-model="modeStore.enableFood" label="用餐" />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-col>

      <v-col
        :cols="modeStore.mode === 'edit' ? 6 : 12"
        :class="modeStore.mode === 'print' ? 'd-flex justify-center' : ''"
      >
        <EditView v-if="modeStore.mode === 'edit'" :headers="headers" />
        <PrintView v-else :headers="headers" />
      </v-col>

      <v-col cols="3" v-show="modeStore.mode === 'edit'">
        <v-file-input v-model="uploadedFile" label="選擇 CSV 檔" accept=".csv" show-size />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'
import type { Header } from '@/type/type'
import EditView from './EditView.vue'
import PrintView from './PrintView.vue'
import Papa from 'papaparse'
import { useModeStore } from '@/stores/modeStore'
import { useParticipantStore } from '@/stores/participantStore'

const modeStore = useModeStore()
const participantStore = useParticipantStore()
const uploadedFile = ref<File | null>(null)

watch(uploadedFile, (file) => {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const uint8Array = new Uint8Array(reader.result as ArrayBuffer)
    const decoder = new TextDecoder('big5') // Big5 轉 UTF-8
    const text = decoder.decode(uint8Array)

    const result = Papa.parse(text, {
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

    console.log('解析後的 items:', participantStore.participantList)
  }
  reader.readAsArrayBuffer(file)
})

const baseHeaders: Header[] = [
  { title: '#', value: 'index', width: '5px', align: 'center' },
  { title: '學號', value: 'id', width: '100px', align: 'center' },
  { title: '單位', value: 'department', width: '100px', align: 'center' },
  { title: '姓名', value: 'name', width: '100px', align: 'center' },
  { title: '簽到', value: 'sign', width: '100px', align: 'center' },
  { title: '用餐', value: 'food', width: '100px', align: 'center' },
]

const headers = computed(() => {
  return modeStore.enableFood
    ? baseHeaders
    : baseHeaders.filter((header) => header.value !== 'food')
})

watchEffect(() => {
  console.log('modeStore.food is', modeStore.enableFood)
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
