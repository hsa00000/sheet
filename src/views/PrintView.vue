<template>
  <v-card>
    <v-toolbar class="invisible-when-print px-2">
      <v-btn @click="modeStore.mode = 'edit'"> 編輯模式 </v-btn
      ><v-btn @click="modeStore.mode = 'print'" variant="tonal"> 列印模式 </v-btn></v-toolbar
    >
    <v-card v-for="(pageItems, pageIndex) in paginatedItems" :key="pageIndex" class="print-page">
      <v-card-text class="text-body-1 text-center">
        <p class="text-h3 font-weight-bold">{{ `${activityStore.name}簽到表` }}</p>
      </v-card-text>
      <v-card-text class="text-body-1">
        <p class="text-h5"><span>活動名稱：</span>{{ activityStore.name }}</p>
        <p class="text-h5"><span>活動期間：</span>{{ activityStore.period }}</p>
        <p class="text-h5"><span>活動地點：</span>{{ activityStore.location }}</p>
      </v-card-text>

      <v-data-table
        border-collapse:
        collapse
        :headers="headers"
        :items="pageItems"
        v-model:sort-by="sortBy"
        class="print-table row-height-26 text-center text-black"
        :items-per-page="itemsPerPage"
      >
        <template #[`item.index`]="{ index }">
          {{ pageIndex * itemsPerPage + index + 1 }}
        </template>
        <template #bottom> </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>
<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import { useModeStore } from '@/stores/modeStore'
import type { Header, Participant } from '@/type/type'
import { sortBy, itemsPerPage } from '@/const/const'
import { computed } from 'vue'
const props = defineProps<{
  participantList: Participant[]
  headers: Header[]
}>()

const modeStore = useModeStore()
const activityStore = useActivityStore()

const paginatedItems = computed(() => {
  const pages = []
  for (let i = 0; i < props.participantList.length; i += itemsPerPage) {
    pages.push(props.participantList.slice(i, i + itemsPerPage))
  }
  return pages
})
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

/* Table font size */
.v-data-table,
.v-card-text {
  font-size: 12pt;
}

/* Row height adjustment */
::v-deep .v-data-table.row-height-26 tr,
::v-deep .v-data-table.row-height-26 td {
  height: 70px !important;
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
</style>
