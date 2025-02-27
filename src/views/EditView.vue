<template>
  <v-card>
    <v-toolbar class="invisible-when-print px-2">
      <v-btn @click="modeStore.mode = 'edit'" variant="tonal"> 編輯模式 </v-btn
      ><v-btn @click="modeStore.mode = 'print'"> 列印模式 </v-btn></v-toolbar
    >
    <v-card class="print-page">
      <v-card-text>
        <v-text-field
          v-model="activityStore.name"
          label="活動名稱"
          variant="underlined"
          dense
        ></v-text-field>

        <v-text-field
          v-model="activityStore.period"
          label="活動日期"
          variant="underlined"
          dense
        ></v-text-field>

        <v-text-field
          v-model="activityStore.location"
          label="活動地點"
          variant="underlined"
          dense
        ></v-text-field>
      </v-card-text>

      <v-data-table
        border-collapse:
        collapse
        :headers="props.headers"
        :items="props.participantList"
        v-model:sort-by="sortBy"
        class="print-table row-height-26 text-center text-black"
        :items-per-page="itemsPerPage"
      >
        <template #[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>
<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import { useModeStore } from '@/stores/modeStore'
import type { Header, Participant } from '@/type/type'
import { sortBy, itemsPerPage } from '@/const/const'
const props = defineProps<{
  participantList: Participant[]
  headers: Header[]
}>()

const modeStore = useModeStore()
const activityStore = useActivityStore()
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
