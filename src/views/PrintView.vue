<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" lg="6" class="print-full-width">
        <v-card variant="text">
          <v-card-title class="no-print d-flex justify-center"
            >直接使用 Chrome 列印即可</v-card-title
          >
          <v-card
            v-for="(pageItems, pageIndex) in paginatedItems"
            :key="pageIndex"
            class="print-page"
            variant="text"
          >
            <h1 class="font-weight-bold text-center">
              {{ `簽到表` }}
            </h1>
            <v-card-text class="text-body-1">
              <p class="text-h5 multi-line-truncate">
                <span class="label-strong">活動名稱：</span>{{ activityStore.name }}
              </p>
              <p class="text-h5 multi-line-truncate">
                <span class="label-strong">活動期間：</span>{{ activityStore.period }}
              </p>
              <p class="text-h5 multi-line-truncate">
                <span class="label-strong">活動地點：</span>{{ activityStore.location }}
              </p>
            </v-card-text>

            <v-data-table
              border-collapse:
              collapse
              :headers="headers"
              :items="pageItems"
              class="print-table row-height-26 text-center text-black"
              :items-per-page="itemsPerPage"
              ><template #[`item.department`]="{ item }">
                {{
                  modeStore.displayExtendedAsRegular && item.department === '數學延'
                    ? '數學四'
                    : item.department
                }}
              </template>
              <template #[`item.index`]="{ index }">
                {{ pageIndex * itemsPerPage + index + 1 }}
              </template>
              <template #bottom> </template>
            </v-data-table>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import { headers } from '@/script/computeHeader'
import type { Participant } from '@/type/type'
import { itemsPerPage } from '@/const/const'
import { computed } from 'vue'
import { useParticipantStore } from '@/stores/participantStore'
import { useEmptyPageNumberStore } from '@/stores/emptyPageNumberStore'
import { useModeStore } from '@/stores/modeStore'

const activityStore = useActivityStore()
const participantStore = useParticipantStore()
const emptyPageNumberStore = useEmptyPageNumberStore()
const modeStore = useModeStore()

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

/* Table font size */
.v-data-table,
.v-card-text {
  font-size: 14pt;
}

.multi-line-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多顯示兩行 */
  line-clamp: 2; /* Standard property for compatibility */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.label-strong {
  font-weight: bold;
  color: #000; /* 或用其他更深的顏色如 #111, #222 視需求調整 */
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-page {
    width: 210mm; /* A4 width */
    height: 280mm; /* A4 height */
    padding-left: 4mm; /* Adjust as needed */
    padding-right: 4mm; /* Adjust as needed */
    box-sizing: border-box;
    page-break-after: always; /* Ensure page breaks when printing */
  }
  .print-full-width {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}
</style>
