<template>
  <v-container class="d-flex justify-center align-center">
    <v-row>
      <v-col cols="3" v-if="modeStore.mode === 'edit'">123</v-col>
      <v-col :cols="modeStore.mode === 'edit' ? 6 : 12">
        <EditView v-if="modeStore.mode === 'edit'" :participant-list="items" :headers="headers" />
        <PrintView v-else :participant-list="items" :headers="headers" />
      </v-col>
      <v-col cols="3" v-if="modeStore.mode === 'edit'">
        <v-file-input label="選擇 csv 檔" @change="handleFileUpload"></v-file-input>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Header, Participant } from '@/type/type'
import { ref, type Ref } from 'vue'
import EditView from './EditView.vue'
import { useModeStore } from '@/stores/modeStore'
import PrintView from './PrintView.vue'
import Papa from 'papaparse'
const modeStore = useModeStore()

const items = ref<Participant[]>([])
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
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

    // **清理欄位名稱並轉換為 Participant 格式**
    items.value = result.data.map((row) => {
      const cleanedRow = Object.fromEntries(
        Object.entries(row as Record<string, unknown>).map(([key, value]) => [key.trim(), value]),
      )

      return {
        id: String(cleanedRow['職工/學號'] ?? ''),
        department: String(cleanedRow['單位'] ?? ''),
        name: String(cleanedRow['參加者'] ?? ''),
      }
    })

    console.log('解析後的 items:', items.value)
  }

  reader.readAsArrayBuffer(file)
}

const headers: Ref<Header[]> = ref([
  { title: '#', value: 'index', width: '5px', align: 'center' },
  { title: '學號', value: 'id', width: '100px', align: 'center' },
  { title: '單位', value: 'department', width: '100px', align: 'center' },
  { title: '姓名', value: 'name', width: '100px', align: 'center' },
  { title: '簽到', value: 'sign', width: '100px', align: 'center' },
])
</script>

<style scoped>
/* Print page layout */
.print-page {
  width: 210mm; /* A4 width */
  height: 297mm; /* A4 height */
  padding-left: 4mm; /* Adjust as needed */
  padding-right: 4mm; /* Adjust as needed */
  box-sizing: border-box;
  page-break-after: always; /* Ensure page breaks when printing */
}

:deep() .v-table .v-table__wrapper > table {
  border: 2px solid #000 !important; /* Thicker outer border */
  border-collapse: collapse !important; /* Remove double borders */
}

:deep() .v-table .v-table__wrapper > table > thead > tr > th,
:deep() .v-table .v-table__wrapper > table > tbody > tr > td {
  color: #000 !important; /* Black text */
  border: 1px solid #000 !important; /* Black borders */
  padding: 4px; /* Consistent padding */
}

/* Separator lines between columns */
:deep() .v-table .v-table__wrapper > table > thead > tr > th:not(:last-child),
:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child) {
  border-right: 1px solid #000 !important;
}

/* Print-specific adjustments */
@media print {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
