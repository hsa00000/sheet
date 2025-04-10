<template>
  <v-col cols="12" class="d-flex justify-center">
    <v-card variant="text">
      <v-card-title class="no-print d-flex justify-center">直接使用 Chrome 列印即可</v-card-title>
      <v-card
        v-for="(pageItems, pageIndex) in paginatedItems"
        :key="pageIndex"
        class="print-page"
        variant="text"
      >
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
  </v-col>
</template>
<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import { headers } from '@/script/computeHeader'
import type { Participant } from '@/type/type'
import { itemsPerPage } from '@/const/const'
import { computed } from 'vue'
import { useParticipantStore } from '@/stores/participantStore'
import { useEmptyPageNumberStore } from '@/stores/emptyPageNumberStore'

const activityStore = useActivityStore()
const participantStore = useParticipantStore()
const emptyPageNumberStore = useEmptyPageNumberStore()

const paginatedItems = computed(() => {
  const combined = [...participantStore.combinedList]

  const blankCount =
    Math.ceil(combined.length / 10) * 10 -
    combined.length +
    emptyPageNumberStore.emptyPageNumber * 10

  for (let i = 0; i < blankCount; i++) {
    combined.push({
      id: '',
      department: '',
      name: '',
      food: '',
    } as Participant)
  }

  console.log('combined result is', combined)

  const pages: Participant[][] = []
  for (let i = 0; i < combined.length; i += itemsPerPage) {
    pages.push(combined.slice(i, i + itemsPerPage))
  }

  return pages
})
</script>

<style scoped>
/* Print page layout */
.print-page {
  width: 210mm; /* A4 width */
  height: 280mm; /* A4 height */
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

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
