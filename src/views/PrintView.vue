<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" lg="6" class="print-full-width">
        <v-card variant="text">
          <v-card-title class="no-print d-flex justify-center">
            直接使用 Chrome 列印即可
          </v-card-title>

          <!-- 每張要列印的頁面 -->
          <v-card
            v-for="(pageItems, pageIndex) in paginatedItems"
            :key="pageIndex"
            class="print-page"
            variant="text"
          >
            <!-- 用 page-body 包住真正要放版面的內容 -->
            <div class="page-body">
              <h1 class="font-weight-bold text-center fixed-two-line-truncate">
                {{ `${activityStore.name} 簽到表` }}
              </h1>

              <v-card-text class="text-body-1">
                <p class="text-h5 fixed-two-line-truncate" v-if="activityStore.showName">
                  <span class="label-strong">活動名稱：</span>{{ activityStore.name }}
                </p>
                <p class="text-h5 fixed-two-line-truncate" v-if="activityStore.showPeriod">
                  <span class="label-strong">活動期間：</span>{{ activityStore.period }}
                </p>
                <p class="text-h5 fixed-two-line-truncate" v-if="activityStore.showLocation">
                  <span class="label-strong">活動地點：</span>{{ activityStore.location }}
                </p>
              </v-card-text>

              <v-data-table
                :headers="headers"
                :items="pageItems"
                class="print-table row-height-26 text-center text-black"
                :items-per-page="itemsPerPage"
              >
                <!-- 部門名稱轉換 -->
                <template #[`item.department`]="{ item }">
                  {{
                    modeStore.displayExtendedAsRegular && item.department === '數學延'
                      ? '數學四'
                      : item.department
                  }}
                </template>

                <!-- 連續流水號 -->
                <template #[`item.index`]="{ index }">
                  {{ pageIndex * itemsPerPage + index + 1 }}
                </template>

                <!-- 移除資料表底部空白 -->
                <template #bottom />
              </v-data-table>
            </div>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { useParticipantStore } from '@/stores/participantStore'
import { useEmptyPageNumberStore } from '@/stores/emptyPageNumberStore'
import { useModeStore } from '@/stores/modeStore'
import { headers } from '@/script/computeHeader'
import { itemsPerPage } from '@/const/const'
import type { Participant } from '@/type/type'

const activityStore = useActivityStore()
const participantStore = useParticipantStore()
const emptyPageNumberStore = useEmptyPageNumberStore()
const modeStore = useModeStore()

/** 依 itemsPerPage 分頁並補足空白列 */
const paginatedItems = computed(() => {
  const combined = [...participantStore.participantList]

  const blankCount =
    Math.ceil(combined.length / 10) * 10 -
    combined.length +
    emptyPageNumberStore.emptyPageNumber * 10

  for (let i = 0; i < blankCount; i++) {
    combined.push({ id: '', department: '', name: '', food: '' } as Participant)
  }

  const pages: Participant[][] = []
  for (let i = 0; i < combined.length; i += itemsPerPage) {
    pages.push(combined.slice(i, i + itemsPerPage))
  }

  return pages
})
</script>

<style scoped>
/* ----------------------- 一般畫面設定 ----------------------- */
:deep(.v-data-table.row-height-26 tr),
:deep(.v-data-table.row-height-26 td) {
  height: 70px !important;
}

.v-data-table,
.v-card-text {
  font-size: 14pt;
}

.label-strong {
  font-weight: bold;
  color: #000;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-page {
    width: 210mm;
    min-height: 290mm;
    padding: 0 4mm;
    box-sizing: border-box;
    display: flex !important;
    page-break-after: always; /* 每頁自動分隔 */
  }

  /* 核心：page-body 加 margin:auto → 在 flex 容器中上下置中 */
  .page-body {
    margin: auto 0;
    width: 100%;
  }
}
.fixed-two-line-truncate {
  display: -webkit-box;
  display: box; /* 不常見，但部分舊瀏覽器可能需要 */
  -webkit-box-orient: vertical;
  box-orient: vertical; /* 同上：較舊的標準草案 */
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2; /* 目前實際支援的主力 */
  line-clamp: 2; /* 標準屬性，未廣泛支援，但可預先寫好 */
}
</style>
